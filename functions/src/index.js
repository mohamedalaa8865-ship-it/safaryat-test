"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recruitSovereignStaff =
  exports.archiveTripChatSovereign =
  exports.archiveBookingChatSovereign =
  exports.archiveStaleTrips =
  exports.checkCarrierSubscriptionExpiry =
  exports.confirmArrivalSovereign =
  exports.cancelBookingSovereign =
  exports.acceptTransferSovereign =
  exports.backfillAtomicIdsSovereign =
  exports.generateBookingAtomicId =
  exports.generateTripAtomicId =
  exports.generateUserAtomicId =
    void 0;
const admin = require("firebase-admin");
const firestore_1 = require("firebase-functions/v2/firestore");
const https_1 = require("firebase-functions/v2/https");
const scheduler_1 = require("firebase-functions/v2/scheduler");
/**
 * @file functions/src/index.ts
 * @description THE DIAMOND STERILIZED SOVEREIGN CORE (V24.0 - SCR-927-SUBSCRIPTION)
 * [SCR-919]: Atomic Transfer Reactor refined. Eradicated Data Schism.
 * [SCR-927]: 24h Early Warning Reactor for Subscription Expiry.
 * Protocol 16: Sterilized. Protocol 88: Resource Protected.
 */
if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();
// ✅ CORS Policy — أضف domain الـ production هنا
const CORS_ORIGINS = ["http://localhost:3000", "https://your-production-domain.com"];
// --- 🧬 SECTION 1: THE ATOMIC ID FORGE (IDENTITY GENOME) ---
async function getNextAtomicId(counterName, prefix, padding) {
  const counterRef = db.collection("system_config").doc("counters");
  return db.runTransaction(async (t) => {
    const doc = await t.get(counterRef);
    let current = 0;
    if (doc.exists) {
      current = doc.data()?.[counterName] || 0;
    }
    const next = current + 1;
    t.set(counterRef, { [counterName]: next }, { merge: true });
    return `${prefix}${String(next).padStart(padding, "0")}`;
  });
}
exports.generateUserAtomicId = (0, firestore_1.onDocumentCreated)("users/{userId}", async (event) => {
  const snap = event.data;
  if (!snap || snap.data().atomicId) return;
  const data = snap.data();
  const role = data.role || "traveler";
  let prefix = "T-26-";
  let counterName = "travelersCount";
  if (role === "carrier") {
    prefix = "C-26-";
    counterName = "carriersCount";
  } else if (role === "agent") {
    prefix = "A-26-";
    counterName = "agentsCount";
  }
  try {
    const newId = await getNextAtomicId(counterName, prefix, 4);
    await snap.ref.update({ atomicId: newId });
  } catch (e) {
    console.error(`[Atomic Forge] User Rupture:`, e);
  }
});
exports.generateTripAtomicId = (0, firestore_1.onDocumentCreated)("trips/{tripId}", async (event) => {
  const snap = event.data;
  if (!snap || snap.data().atomicId) return;
  try {
    const newId = await getNextAtomicId("tripsCount", "TRP-", 5);
    await snap.ref.update({ atomicId: newId });
  } catch (e) {
    console.error(`[Atomic Forge] Trip Rupture:`, e);
  }
});
exports.generateBookingAtomicId = (0, firestore_1.onDocumentCreated)("bookings/{bookingId}", async (event) => {
  const snap = event.data;
  if (!snap || snap.data().atomicId) return;
  try {
    const newId = await getNextAtomicId("bookingsCount", "BKG-", 5);
    await snap.ref.update({ atomicId: newId });
  } catch (e) {
    console.error(`[Atomic Forge] Booking Rupture:`, e);
  }
});
exports.backfillAtomicIdsSovereign = (0, https_1.onCall)({ cors: CORS_ORIGINS }, async (request) => {
  if (!request.auth?.uid) throw new https_1.HttpsError("unauthenticated", "AUTH_REQUIRED");
  const userSnap = await db.collection("users").doc(request.auth.uid).get();
  const role = userSnap.data()?.role;
  const email = request.auth.token.email?.toLowerCase();
  if (role !== "owner" && email !== "fayzgabli22@gmail.com") {
    throw new https_1.HttpsError("permission-denied", "UNAUTHORIZED_ACCESS");
  }
  let processed = 0;
  try {
    const tripsSnap = await db.collection("trips").where("atomicId", "==", null).limit(100).get();
    for (const doc of tripsSnap.docs) {
      const newId = await getNextAtomicId("tripsCount", "TRP-", 5);
      await doc.ref.update({ atomicId: newId });
      processed++;
    }
    return { success: true, processed };
  } catch (e) {
    throw new https_1.HttpsError("internal", e.message);
  }
});
// --- 🚀 SECTION 2: OPERATIONAL REACTORS (FIELD COMMAND) ---
/**
 * [SCR-919] ATOMIC TRANSFER REACTOR
 * Ensures full consistency between Trip, Bookings, and Transfer Requests.
 */
exports.acceptTransferSovereign = (0, https_1.onCall)({ cors: CORS_ORIGINS }, async (request) => {
  if (!request.auth) throw new https_1.HttpsError("unauthenticated", "AUTH_REQUIRED");
  const { transferRequestId } = request.data;
  if (!transferRequestId) throw new https_1.HttpsError("invalid-argument", "MISSING_REQUEST_ID");
  const transferRef = db.collection("transferRequests").doc(transferRequestId);
  return db.runTransaction(async (transaction) => {
    const transferSnap = await transaction.get(transferRef);
    if (!transferSnap.exists) throw new Error("REQUEST_NOT_FOUND");
    const tData = transferSnap.data();
    if (tData.status !== "pending") throw new Error("REQUEST_NOT_PENDING");
    // if (tData.toCarrierId !== request.auth.uid) throw new Error("NOT_TARGET_CARRIER");
    if (!request.auth?.uid) {
      throw new https_1.HttpsError("unauthenticated", "AUTH_REQUIRED");
    }
    const tripId = tData.originalTripId;
    const tripRef = db.collection("trips").doc(tripId);
    const tripSnap = await transaction.get(tripRef);
    if (!tripSnap.exists) throw new Error("TRIP_NOT_FOUND");
    // 1. Update Trip Ownership & Status
    transaction.update(tripRef, {
      carrierId: tData.toCarrierId,
      originalCarrierId: tData.fromCarrierId,
      transferStatus: "Transferred",
      transferredAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    // 2. Update all associated active Bookings
    const bookingsQuery = db
      .collection("bookings")
      .where("tripId", "==", tripId)
      .where("status", "in", ["Confirmed", "Pending-Payment", "Pending-Carrier-Confirmation", "Rated"]);
    const bookingsSnap = await transaction.get(bookingsQuery);
    bookingsSnap.docs.forEach((bDoc) => {
      transaction.update(bDoc.ref, {
        carrierId: tData.toCarrierId,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });
    // 3. Close the Transfer Request
    transaction.update(transferRef, {
      status: "accepted",
      acceptedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    // 4. Inject Forensic System Message
    const chatMsgRef = db.collection("chats").doc(tripId).collection("messages").doc();
    transaction.set(chatMsgRef, {
      content: `إشعار سيادي: تم نقل مسؤولية هذه الرحلة لقائد جديد لضمان استمرار الخدمة بأمان.`,
      senderId: "SYSTEM",
      senderName: "نظام سفريات",
      type: "system",
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { success: true };
  });
});
// export const cancelBookingSovereign = onCall({ cors: CORS_ORIGINS }, async (request) => {
//   if (!request.auth?.uid) throw new HttpsError("unauthenticated", "AUTH_REQUIRED");
//   const { bookingId, tripId, reason, cancelledBy } = request.data;
//   return db.runTransaction(async (transaction) => {
//     if (bookingId) {
//       const bookingRef = db.collection("bookings").doc(bookingId);
//       const bookingSnap = await transaction.get(bookingRef);
//       if (!bookingSnap.exists) throw new Error("BOOKING_NOT_FOUND");
//       const bData = bookingSnap.data()!;
//       transaction.update(bookingRef, {
//         status: "Cancelled",
//         cancelReason: reason || "إلغاء سيادي",
//         cancelledBy: cancelledBy || "system",
//         updatedAt: admin.firestore.FieldValue.serverTimestamp(),
//       });
//       if (["Confirmed", "Pending-Payment"].includes(bData.status)) {
//         transaction.update(db.collection("trips").doc(bData.tripId), {
//           availableSeats: admin.firestore.FieldValue.increment(bData.seats || 1),
//         });
//       }
//       return { success: true };
//     }
//     if (tripId) {
//       const tripRef = db.collection("trips").doc(tripId);
//       transaction.update(tripRef, { status: "Cancelled", cancelReason: reason || "سحب الطلب" });
//       return { success: true };
//     }
//     throw new Error("MISSING_DATA");
//   });
// });
exports.cancelBookingSovereign = (0, https_1.onCall)({ cors: CORS_ORIGINS }, async (request) => {
  if (!request.auth?.uid) {
    throw new https_1.HttpsError("unauthenticated", "AUTH_REQUIRED");
  }
  const { bookingId, tripId, reason, cancelledBy } = request.data;
  return db.runTransaction(async (transaction) => {
    if (bookingId) {
      const bookingRef = db.collection("bookings").doc(bookingId);
      const bookingSnap = await transaction.get(bookingRef);
      if (!bookingSnap.exists) {
        throw new https_1.HttpsError("not-found", "BOOKING_NOT_FOUND");
      }
      const bData = bookingSnap.data();
      transaction.update(bookingRef, {
        status: "Cancelled",
        cancelReason: reason || "إلغاء سيادي",
        cancelledBy: cancelledBy || "system",
        cancelledAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      if (["Confirmed", "Pending-Payment"].includes(bData.status)) {
        transaction.update(db.collection("trips").doc(bData.tripId), {
          availableSeats: admin.firestore.FieldValue.increment(bData.seats || 1),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
      return { success: true, mode: "booking" };
    }
    if (tripId) {
      const tripRef = db.collection("trips").doc(tripId);
      const tripSnap = await transaction.get(tripRef);
      if (!tripSnap.exists) {
        throw new https_1.HttpsError("not-found", "TRIP_NOT_FOUND");
      }
      const tripData = tripSnap.data();
      transaction.update(tripRef, {
        status: "Cancelled",
        cancelReason: reason || "سحب الطلب",
        cancelledBy: cancelledBy || "system",
        cancelledAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      if (tripData.carrierId) {
        transaction.update(db.collection("users").doc(tripData.carrierId), {
          currentActiveTripId: null,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
      return { success: true, mode: "trip" };
    }
    throw new https_1.HttpsError("invalid-argument", "MISSING_DATA");
  });
});
/**
 * ✅ confirmArrivalSovereign
 * يُستدعى من المسافر أو الناقل لتأكيد الوصول وإنهاء الرحلة.
 */
exports.confirmArrivalSovereign = (0, https_1.onCall)({ cors: CORS_ORIGINS }, async (request) => {
  if (!request.auth?.uid) throw new https_1.HttpsError("unauthenticated", "AUTH_REQUIRED");
  const { tripId } = request.data;
  if (!tripId) throw new https_1.HttpsError("invalid-argument", "TRIP_ID_REQUIRED");
  return db.runTransaction(async (transaction) => {
    const tripRef = db.collection("trips").doc(tripId);
    const tripSnap = await transaction.get(tripRef);
    if (!tripSnap.exists) throw new https_1.HttpsError("not-found", "TRIP_NOT_FOUND");
    const tripData = tripSnap.data();
    if (tripData.status === "Completed") throw new https_1.HttpsError("failed-precondition", "ALREADY_CANCELLED");
    // تحديث الرحلة لـ Completed
    transaction.update(tripRef, {
      status: "Completed",
      completedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    // تحديث الحجوزات المرتبطة لـ Completed
    const bookingsSnap = await db.collection("bookings").where("tripId", "==", tripId).where("status", "in", ["Confirmed", "Pending-Payment"]).get();
    bookingsSnap.docs.forEach((bookingDoc) => {
      transaction.update(bookingDoc.ref, {
        status: "Completed",
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });
    // تحرير الناقل من الرحلة النشطة
    if (tripData.carrierId) {
      transaction.update(db.collection("users").doc(tripData.carrierId), {
        currentActiveTripId: null,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
    return { success: true };
  });
});
/**
 * ✅ confirmArrivalSovereign
 * يُستدعى من المسافر أو الناقل لتأكيد الوصول وإنهاء الرحلة.
 */
// export const confirmArrivalSovereign = onCall({ cors: CORS_ORIGINS }, async (request) => {
//   if (!request.auth?.uid) throw new HttpsError("unauthenticated", "AUTH_REQUIRED");
//   const { tripId } = request.data;
//   if (!tripId) throw new HttpsError("invalid-argument", "TRIP_ID_REQUIRED");
//   return db.runTransaction(async (transaction) => {
//     const tripRef = db.collection("trips").doc(tripId);
//     const tripSnap = await transaction.get(tripRef);
//     if (!tripSnap.exists) throw new HttpsError("not-found", "TRIP_NOT_FOUND");
//     const tripData = tripSnap.data()!;
//     if (tripData.status === "Completed") throw new HttpsError("failed-precondition", "ALREADY_CANCELLED");
//     // تحديث الرحلة لـ Completed
//     transaction.update(tripRef, {
//       status: "Completed",
//       completedAt: admin.firestore.FieldValue.serverTimestamp(),
//       updatedAt: admin.firestore.FieldValue.serverTimestamp(),
//     });
//     // تحديث الحجوزات المرتبطة لـ Completed
//     const bookingsSnap = await db.collection("bookings").where("tripId", "==", tripId).where("status", "in", ["Confirmed", "Pending-Payment"]).get();
//     bookingsSnap.docs.forEach((bookingDoc) => {
//       transaction.update(bookingDoc.ref, {
//         status: "Completed",
//         updatedAt: admin.firestore.FieldValue.serverTimestamp(),
//       });
//     });
//     // تحرير الناقل من الرحلة النشطة
//     if (tripData.carrierId) {
//       transaction.update(db.collection("users").doc(tripData.carrierId), {
//         currentActiveTripId: null,
//         updatedAt: admin.firestore.FieldValue.serverTimestamp(),
//       });
//     }
//     return { success: true };
//   });
// });
// --- 🧹 SECTION 3: TIME SWEEPERS (CRON GHOSTS) ---
/**
 * [SCR-927] 24h Early Warning Reactor
 * Scans for carriers whose subscription expires in the next 24 hours.
 * Protocol 88: Targeted query to minimize read volume.
 */
exports.checkCarrierSubscriptionExpiry = (0, scheduler_1.onSchedule)("every 24 hours", async (event) => {
  const now = admin.firestore.Timestamp.now();
  // Tomorrow Window: now + 24h
  const tomorrowSeconds = now.seconds + 86400;
  const tomorrow = new admin.firestore.Timestamp(tomorrowSeconds, now.nanoseconds);
  try {
    const expiringSnap = await db
      .collection("users")
      .where("role", "==", "carrier")
      .where("expiryDate", ">", now)
      .where("expiryDate", "<=", tomorrow)
      .get();
    if (expiringSnap.empty) return;
    const batch = db.batch();
    expiringSnap.docs.forEach((doc) => {
      const notifRef = db.collection("users").doc(doc.id).collection("notifications").doc();
      batch.set(notifRef, {
        title: "⚠️ تنبيه سيادي: انتهاء التصريح",
        message: "يتبقى 24 ساعة فقط على انتهاء تصريحك التشغيلي. جدد اشتراكك الآن لضمان استمرار ظهورك في رادار الرحلات.",
        type: "SOVEREIGN",
        isRead: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        link: "/carrier/Permanent",
      });
    });
    await batch.commit();
    console.log(`[SCR-927] Sent warning pulses to ${expiringSnap.size} carriers.`);
  } catch (e) {
    console.error("[SCR-927] Early Warning Reactor Failure:", e);
  }
});
exports.archiveStaleTrips = (0, scheduler_1.onSchedule)("every 60 minutes", async () => {
  const now = new Date();
  const snapshot = await db.collection("trips").where("status", "in", ["Planned", "In-Transit"]).get();
  if (snapshot.empty) return;
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    const data = doc.data();
    const departure = new Date(data.departureDate);
    const duration = data.estimatedDurationHours || 3;
    const arrivalPlusBuffer = new Date(departure.getTime() + (duration + 2) * 3600000);
    if (now > arrivalPlusBuffer) {
      batch.update(doc.ref, {
        status: "Completed",
        autoCompletedAt: admin.firestore.FieldValue.serverTimestamp(),
        completionReason: "AUTO_STALE_PURGE",
      });
      if (data.carrierId) {
        batch.update(db.collection("users").doc(data.carrierId), { currentActiveTripId: null });
      }
    }
  });
  await batch.commit();
});
// --- 🎞️ SECTION 4: ARCHIVAL REACTORS (FORENSIC COMPRESSION) ---
async function compressChatLogs(chatId, parentRef, fieldName) {
  const messages = await db.collection("chats").doc(chatId).collection("messages").orderBy("timestamp", "asc").get();
  if (messages.empty) return;
  let log = "";
  const batch = db.batch();
  messages.docs.forEach((m) => {
    const d = m.data();
    const time = d.timestamp?.toDate ? d.timestamp.toDate().toISOString() : "N/A";
    log += `[${time}] ${d.senderName || "System"}: ${d.content}\n`;
    batch.delete(m.ref);
  });
  batch.update(parentRef, {
    [fieldName]: log,
    [`${fieldName}At`]: admin.firestore.FieldValue.serverTimestamp(),
  });
  await batch.commit();
}
exports.archiveBookingChatSovereign = (0, firestore_1.onDocumentUpdated)("bookings/{bookingId}", async (event) => {
  const after = event.data?.after.data();
  const before = event.data?.before.data();
  if (!after || !before || before.status === after.status) return;
  if (["Completed", "Cancelled"].includes(after.status)) {
    await compressChatLogs(event.params.bookingId, event.data?.after.ref, "chatArchive");
  }
});
exports.archiveTripChatSovereign = (0, firestore_1.onDocumentUpdated)("trips/{tripId}", async (event) => {
  const after = event.data?.after.data();
  const before = event.data?.before.data();
  if (!after || !before || before.status === after.status) return;
  if (["Completed", "Cancelled"].includes(after.status)) {
    await compressChatLogs(event.params.tripId, event.data?.after.ref, "tripChatArchive");
  }
});
// --- 🎖️ SECTION 5: SOVEREIGN STAFF RECRUITMENT ---
exports.recruitSovereignStaff = (0, https_1.onCall)({ cors: CORS_ORIGINS }, async (request) => {
  if (!request.auth?.uid) throw new https_1.HttpsError("unauthenticated", "AUTH_REQUIRED");
  // تأكد إن المستدعي admin أو owner
  const callerSnap = await db.collection("users").doc(request.auth.uid).get();
  const callerRole = callerSnap.data()?.role;
  if (!["admin", "owner", "developer", "operations_manager"].includes(callerRole)) {
    throw new https_1.HttpsError("permission-denied", "FORBIDDEN");
  }
  const {
    fullName,
    email,
    tempPassword,
    role,
    agentTarget,
    agentBonus,
    commissionRate,
    workType,
    paymentSystem,
    baseSalary,
    nationalId,
    permissions,
    currency,
  } = request.data;
  if (!email || !tempPassword || !fullName || !role) {
    throw new https_1.HttpsError("invalid-argument", "MISSING_REQUIRED_FIELDS");
  }
  try {
    // 1. أنشئ الـ user في Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password: tempPassword,
      displayName: fullName,
    });
    const uid = userRecord.uid;
    const firstName = fullName.trim().split(" ")[0];
    const lastName = fullName.trim().split(" ").slice(1).join(" ");
    // 2. احفظ في Firestore
    await db
      .collection("users")
      .doc(uid)
      .set({
        uid,
        id: uid,
        email,
        firstName,
        lastName,
        fullName,
        nationalId: nationalId || "",
        role,
        workType: workType || "office",
        paymentSystem: paymentSystem || "monthly",
        baseSalary: baseSalary || 0,
        currency: currency || "JOD",
        permissions: permissions || {},
        isActive: true,
        isFirstLogin: true,
        currentBalance: 0,
        lifetimeEarnings: 0,
        // Agent-specific
        ...(role === "agent" && {
          agentStatus: "active", // الأدمن بيضيفه = active مباشرة
          agentTarget: agentTarget || 50,
          agentBonus: agentBonus || 100,
          commissionRate: commissionRate || 0,
        }),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    return { success: true, uid, email };
  } catch (e) {
    console.error("[recruitSovereignStaff] Error:", e);
    throw new https_1.HttpsError("internal", e.message || "RECRUITMENT_FAILED");
  }
});

//# sourceMappingURL=index.js.map
