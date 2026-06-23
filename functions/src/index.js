"use strict";
// import * as admin from "firebase-admin";
// import { onDocumentCreated, onDocumentUpdated } from "firebase-functions/v2/firestore";
// import { onCall, HttpsError } from "firebase-functions/v2/https";
// import { onSchedule } from "firebase-functions/v2/scheduler";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.acceptBookingTransferByCarrier = exports.completeBookingTransfer = exports.respondToBookingTransfer = exports.initiateBookingTransfer = exports.onTripModificationUpdated = exports.onTripModificationRequested = exports.repairSystemRupture = exports.toggleStaffStatusSovereign = exports.recruitSovereignStaff = exports.archiveTripChatSovereign = exports.archiveBookingChatSovereign = exports.archiveStaleTrips = exports.checkCarrierSubscriptionExpiry = exports.confirmArrivalSovereign = exports.cancelBookingSovereign = exports.acceptTransferSovereign = exports.backfillAtomicIdsSovereign = exports.generateBookingAtomicId = exports.generateTripAtomicId = exports.generateUserAtomicId = void 0;
// /**
//  * @file functions/src/index.ts
//  * @description THE DIAMOND STERILIZED SOVEREIGN CORE (V24.0 - SCR-927-SUBSCRIPTION)
//  * [SCR-919]: Atomic Transfer Reactor refined. Eradicated Data Schism.
//  * [SCR-927]: 24h Early Warning Reactor for Subscription Expiry.
//  * Protocol 16: Sterilized. Protocol 88: Resource Protected.
//  */
// if (!admin.apps.length) {
//   admin.initializeApp();
// }
// const db = admin.firestore();
// // ✅ CORS Policy — أضف domain الـ production هنا
// const CORS_ORIGINS = ["http://localhost:3000", "https://your-production-domain.com"];
// // --- 🧬 SECTION 1: THE ATOMIC ID FORGE (IDENTITY GENOME) ---
// async function getNextAtomicId(counterName: string, prefix: string, padding: number): Promise<string> {
//   const counterRef = db.collection("system_config").doc("counters");
//   return db.runTransaction(async (t) => {
//     const doc = await t.get(counterRef);
//     let current = 0;
//     if (doc.exists) {
//       current = doc.data()?.[counterName] || 0;
//     }
//     const next = current + 1;
//     t.set(counterRef, { [counterName]: next }, { merge: true });
//     return `${prefix}${String(next).padStart(padding, "0")}`;
//   });
// }
// export const generateUserAtomicId = onDocumentCreated("users/{userId}", async (event) => {
//   const snap = event.data;
//   if (!snap || snap.data().atomicId) return;
//   const data = snap.data();
//   const role = data.role || "traveler";
//   let prefix = "T-26-";
//   let counterName = "travelersCount";
//   if (role === "carrier") {
//     prefix = "C-26-";
//     counterName = "carriersCount";
//   } else if (role === "agent") {
//     prefix = "A-26-";
//     counterName = "agentsCount";
//   }
//   try {
//     const newId = await getNextAtomicId(counterName, prefix, 4);
//     await snap.ref.update({ atomicId: newId });
//   } catch (e) {
//     console.error(`[Atomic Forge] User Rupture:`, e);
//   }
// });
// export const generateTripAtomicId = onDocumentCreated("trips/{tripId}", async (event) => {
//   const snap = event.data;
//   if (!snap || snap.data().atomicId) return;
//   try {
//     const newId = await getNextAtomicId("tripsCount", "TRP-", 5);
//     await snap.ref.update({ atomicId: newId });
//   } catch (e) {
//     console.error(`[Atomic Forge] Trip Rupture:`, e);
//   }
// });
// export const generateBookingAtomicId = onDocumentCreated("bookings/{bookingId}", async (event) => {
//   const snap = event.data;
//   if (!snap || snap.data().atomicId) return;
//   try {
//     const newId = await getNextAtomicId("bookingsCount", "BKG-", 5);
//     await snap.ref.update({ atomicId: newId });
//   } catch (e) {
//     console.error(`[Atomic Forge] Booking Rupture:`, e);
//   }
// });
// export const backfillAtomicIdsSovereign = onCall({ cors: CORS_ORIGINS }, async (request) => {
//   if (!request.auth?.uid) throw new HttpsError("unauthenticated", "AUTH_REQUIRED");
//   const userSnap = await db.collection("users").doc(request.auth.uid).get();
//   const role = userSnap.data()?.role;
//   const email = request.auth.token.email?.toLowerCase();
//   if (role !== "owner" && email !== "fayzgabli22@gmail.com") {
//     throw new HttpsError("permission-denied", "UNAUTHORIZED_ACCESS");
//   }
//   let processed = 0;
//   try {
//     const tripsSnap = await db.collection("trips").where("atomicId", "==", null).limit(100).get();
//     for (const doc of tripsSnap.docs) {
//       const newId = await getNextAtomicId("tripsCount", "TRP-", 5);
//       await doc.ref.update({ atomicId: newId });
//       processed++;
//     }
//     return { success: true, processed };
//   } catch (e: any) {
//     throw new HttpsError("internal", e.message);
//   }
// });
// // --- 🚀 SECTION 2: OPERATIONAL REACTORS (FIELD COMMAND) ---
// /**
//  * [SCR-919] ATOMIC TRANSFER REACTOR
//  * Ensures full consistency between Trip, Bookings, and Transfer Requests.
//  */
// export const acceptTransferSovereign = onCall({ cors: CORS_ORIGINS }, async (request) => {
//   if (!request.auth) throw new HttpsError("unauthenticated", "AUTH_REQUIRED");
//   const { transferRequestId } = request.data;
//   if (!transferRequestId) throw new HttpsError("invalid-argument", "MISSING_REQUEST_ID");
//   const transferRef = db.collection("transferRequests").doc(transferRequestId);
//   return db.runTransaction(async (transaction) => {
//     const transferSnap = await transaction.get(transferRef);
//     if (!transferSnap.exists) throw new Error("REQUEST_NOT_FOUND");
//     const tData = transferSnap.data()!;
//     if (tData.status !== "pending") throw new Error("REQUEST_NOT_PENDING");
//     // if (tData.toCarrierId !== request.auth.uid) throw new Error("NOT_TARGET_CARRIER");
//     if (!request.auth?.uid) {
//       throw new HttpsError("unauthenticated", "AUTH_REQUIRED");
//     }
//     const tripId = tData.originalTripId;
//     const tripRef = db.collection("trips").doc(tripId);
//     const tripSnap = await transaction.get(tripRef);
//     if (!tripSnap.exists) throw new Error("TRIP_NOT_FOUND");
//     // 1. Update Trip Ownership & Status
//     transaction.update(tripRef, {
//       carrierId: tData.toCarrierId,
//       originalCarrierId: tData.fromCarrierId,
//       transferStatus: "Transferred",
//       transferredAt: admin.firestore.FieldValue.serverTimestamp(),
//       updatedAt: admin.firestore.FieldValue.serverTimestamp(),
//     });
//     // 2. Update all associated active Bookings
//     const bookingsQuery = db
//       .collection("bookings")
//       .where("tripId", "==", tripId)
//       .where("status", "in", ["Confirmed", "Pending-Payment", "Pending-Carrier-Confirmation", "Rated"]);
//     const bookingsSnap = await transaction.get(bookingsQuery);
//     bookingsSnap.docs.forEach((bDoc) => {
//       transaction.update(bDoc.ref, {
//         carrierId: tData.toCarrierId,
//         updatedAt: admin.firestore.FieldValue.serverTimestamp(),
//       });
//     });
//     // 3. Close the Transfer Request
//     transaction.update(transferRef, {
//       status: "accepted",
//       acceptedAt: admin.firestore.FieldValue.serverTimestamp(),
//     });
//     // 4. Inject Forensic System Message
//     const chatMsgRef = db.collection("chats").doc(tripId).collection("messages").doc();
//     transaction.set(chatMsgRef, {
//       content: `إشعار سيادي: تم نقل مسؤولية هذه الرحلة لقائد جديد لضمان استمرار الخدمة بأمان.`,
//       senderId: "SYSTEM",
//       senderName: "نظام سفريات",
//       type: "system",
//       timestamp: admin.firestore.FieldValue.serverTimestamp(),
//     });
//     return { success: true };
//   });
// });
// // export const cancelBookingSovereign = onCall({ cors: CORS_ORIGINS }, async (request) => {
// //   if (!request.auth?.uid) {
// //     throw new HttpsError("unauthenticated", "AUTH_REQUIRED");
// //   }
// //   const { bookingId, tripId, reason, cancelledBy } = request.data;
// //   return db.runTransaction(async (transaction) => {
// //     if (bookingId) {
// //       const bookingRef = db.collection("bookings").doc(bookingId);
// //       const bookingSnap = await transaction.get(bookingRef);
// //       if (!bookingSnap.exists) {
// //         throw new HttpsError("not-found", "BOOKING_NOT_FOUND");
// //       }
// //       const bData = bookingSnap.data()!;
// //       transaction.update(bookingRef, {
// //         status: "Cancelled",
// //         cancelReason: reason || "إلغاء سيادي",
// //         cancelledBy: cancelledBy || "system",
// //         cancelledAt: admin.firestore.FieldValue.serverTimestamp(),
// //         updatedAt: admin.firestore.FieldValue.serverTimestamp(),
// //       });
// //       if (["Confirmed", "Pending-Payment"].includes(bData.status)) {
// //         transaction.update(db.collection("trips").doc(bData.tripId), {
// //           availableSeats: admin.firestore.FieldValue.increment(bData.seats || 1),
// //           updatedAt: admin.firestore.FieldValue.serverTimestamp(),
// //         });
// //       }
// //       return { success: true, mode: "booking" };
// //     }
// //     if (tripId) {
// //       const tripRef = db.collection("trips").doc(tripId);
// //       const tripSnap = await transaction.get(tripRef);
// //       if (!tripSnap.exists) {
// //         throw new HttpsError("not-found", "TRIP_NOT_FOUND");
// //       }
// //       const tripData = tripSnap.data()!;
// //       transaction.update(tripRef, {
// //         status: "Cancelled",
// //         cancelReason: reason || "سحب الطلب",
// //         cancelledBy: cancelledBy || "system",
// //         cancelledAt: admin.firestore.FieldValue.serverTimestamp(),
// //         updatedAt: admin.firestore.FieldValue.serverTimestamp(),
// //       });
// //       if (tripData.carrierId) {
// //         transaction.update(db.collection("users").doc(tripData.carrierId), {
// //           currentActiveTripId: null,
// //           updatedAt: admin.firestore.FieldValue.serverTimestamp(),
// //         });
// //       }
// //       return { success: true, mode: "trip" };
// //     }
// //     throw new HttpsError("invalid-argument", "MISSING_DATA");
// //   });
// // });
// export const cancelBookingSovereign = onCall({ cors: CORS_ORIGINS }, async (request) => {
//   if (!request.auth?.uid) {
//     throw new HttpsError("unauthenticated", "AUTH_REQUIRED");
//   }
//   const { bookingId, tripId, reason, cancelledBy } = request.data;
//   return db.runTransaction(async (transaction) => {
//     if (bookingId) {
//       const bookingRef = db.collection("bookings").doc(bookingId);
//       const bookingSnap = await transaction.get(bookingRef);
//       if (!bookingSnap.exists) {
//         throw new HttpsError("not-found", "BOOKING_NOT_FOUND");
//       }
//       const bData = bookingSnap.data()!;
//       // 🚀 1. الحماية من التنفيذ المزدوج: التأكد إن الحجز لم يُلغى مسبقاً
//       if (bData.status === "Cancelled") {
//         return { success: true, message: "ALREADY_CANCELLED", mode: "booking" };
//       }
//       transaction.update(bookingRef, {
//         status: "Cancelled",
//         cancelReason: reason || "إلغاء سيادي",
//         cancelledBy: cancelledBy || "system",
//         cancelledAt: admin.firestore.FieldValue.serverTimestamp(),
//         updatedAt: admin.firestore.FieldValue.serverTimestamp(),
//       });
//       // 🚀 2. إرجاع المقاعد بذكاء: فقط لو كانت مخصومة فعلاً من الرحلة!
//       const seatsToRefund = bData.seats || 1;
//       const isConfirmed = bData.status === "Confirmed";
//       // خصم المقاعد في حالة Pending-Payment يحدث فقط لو:
//       // - تم الخصم عند إنشاء رحلة جديدة للناقل (isPassengerTripDeleted = true)
//       // - أو الحجز تم من قبل الناقل مباشرة (bookedByCarrier = true)
//       const isPendingWithDeductedSeats =
//         bData.status === "Pending-Payment" && (bData.isPassengerTripDeleted === true || bData.bookedByCarrier === true);
//       if (isConfirmed || isPendingWithDeductedSeats) {
//         // transaction.update(db.collection("trips").doc(bData.tripId), {
//         //   availableSeats: admin.firestore.FieldValue.increment(seatsToRefund),
//         const targetTripId = bData.carrierTripId || bData.tripId;
//         transaction.update(db.collection("trips").doc(targetTripId), {
//           availableSeats: admin.firestore.FieldValue.increment(seatsToRefund),
//           updatedAt: admin.firestore.FieldValue.serverTimestamp(),
//         });
//       }
//       return { success: true, mode: "booking" };
//     }
//     if (tripId) {
//       const tripRef = db.collection("trips").doc(tripId);
//       const tripSnap = await transaction.get(tripRef);
//       if (!tripSnap.exists) {
//         throw new HttpsError("not-found", "TRIP_NOT_FOUND");
//       }
//       const tripData = tripSnap.data()!;
//       // 🚀 الحماية من التنفيذ المزدوج للرحلة بالكامل
//       if (tripData.status === "Cancelled") {
//         return { success: true, message: "ALREADY_CANCELLED", mode: "trip" };
//       }
//       transaction.update(tripRef, {
//         status: "Cancelled",
//         cancelReason: reason || "سحب الطلب",
//         cancelledBy: cancelledBy || "system",
//         cancelledAt: admin.firestore.FieldValue.serverTimestamp(),
//         updatedAt: admin.firestore.FieldValue.serverTimestamp(),
//       });
//       if (tripData.carrierId) {
//         transaction.update(db.collection("users").doc(tripData.carrierId), {
//           currentActiveTripId: null,
//           updatedAt: admin.firestore.FieldValue.serverTimestamp(),
//         });
//       }
//       return { success: true, mode: "trip" };
//     }
//     throw new HttpsError("invalid-argument", "MISSING_DATA");
//   });
// });
// /**
//  * ✅ confirmArrivalSovereign
//  * يُستدعى من المسافر أو الناقل لتأكيد الوصول وإنهاء الرحلة.
//  */
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
// /**
//  * ✅ confirmArrivalSovereign
//  * يُستدعى من المسافر أو الناقل لتأكيد الوصول وإنهاء الرحلة.
//  */
// // export const confirmArrivalSovereign = onCall({ cors: CORS_ORIGINS }, async (request) => {
// //   if (!request.auth?.uid) throw new HttpsError("unauthenticated", "AUTH_REQUIRED");
// //   const { tripId } = request.data;
// //   if (!tripId) throw new HttpsError("invalid-argument", "TRIP_ID_REQUIRED");
// //   return db.runTransaction(async (transaction) => {
// //     const tripRef = db.collection("trips").doc(tripId);
// //     const tripSnap = await transaction.get(tripRef);
// //     if (!tripSnap.exists) throw new HttpsError("not-found", "TRIP_NOT_FOUND");
// //     const tripData = tripSnap.data()!;
// //     if (tripData.status === "Completed") throw new HttpsError("failed-precondition", "ALREADY_CANCELLED");
// //     // تحديث الرحلة لـ Completed
// //     transaction.update(tripRef, {
// //       status: "Completed",
// //       completedAt: admin.firestore.FieldValue.serverTimestamp(),
// //       updatedAt: admin.firestore.FieldValue.serverTimestamp(),
// //     });
// //     // تحديث الحجوزات المرتبطة لـ Completed
// //     const bookingsSnap = await db.collection("bookings").where("tripId", "==", tripId).where("status", "in", ["Confirmed", "Pending-Payment"]).get();
// //     bookingsSnap.docs.forEach((bookingDoc) => {
// //       transaction.update(bookingDoc.ref, {
// //         status: "Completed",
// //         updatedAt: admin.firestore.FieldValue.serverTimestamp(),
// //       });
// //     });
// //     // تحرير الناقل من الرحلة النشطة
// //     if (tripData.carrierId) {
// //       transaction.update(db.collection("users").doc(tripData.carrierId), {
// //         currentActiveTripId: null,
// //         updatedAt: admin.firestore.FieldValue.serverTimestamp(),
// //       });
// //     }
// //     return { success: true };
// //   });
// // });
// // --- 🧹 SECTION 3: TIME SWEEPERS (CRON GHOSTS) ---
// /**
//  * [SCR-927] 24h Early Warning Reactor
//  * Scans for carriers whose subscription expires in the next 24 hours.
//  * Protocol 88: Targeted query to minimize read volume.
//  */
// export const checkCarrierSubscriptionExpiry = onSchedule("every 24 hours", async (event) => {
//   const now = admin.firestore.Timestamp.now();
//   // Tomorrow Window: now + 24h
//   const tomorrowSeconds = now.seconds + 86400;
//   const tomorrow = new admin.firestore.Timestamp(tomorrowSeconds, now.nanoseconds);
//   try {
//     const expiringSnap = await db
//       .collection("users")
//       .where("role", "==", "carrier")
//       .where("expiryDate", ">", now)
//       .where("expiryDate", "<=", tomorrow)
//       .get();
//     if (expiringSnap.empty) return;
//     const batch = db.batch();
//     expiringSnap.docs.forEach((doc) => {
//       const notifRef = db.collection("users").doc(doc.id).collection("notifications").doc();
//       batch.set(notifRef, {
//         title: "⚠️ تنبيه سيادي: انتهاء التصريح",
//         message: "يتبقى 24 ساعة فقط على انتهاء تصريحك التشغيلي. جدد اشتراكك الآن لضمان استمرار ظهورك في رادار الرحلات.",
//         type: "SOVEREIGN",
//         isRead: false,
//         createdAt: admin.firestore.FieldValue.serverTimestamp(),
//         link: "/carrier/Permanent",
//       });
//     });
//     await batch.commit();
//     console.log(`[SCR-927] Sent warning pulses to ${expiringSnap.size} carriers.`);
//   } catch (e) {
//     console.error("[SCR-927] Early Warning Reactor Failure:", e);
//   }
// });
// export const archiveStaleTrips = onSchedule("every 60 minutes", async () => {
//   const now = new Date();
//   const snapshot = await db.collection("trips").where("status", "in", ["Planned", "In-Transit"]).get();
//   if (snapshot.empty) return;
//   const batch = db.batch();
//   snapshot.docs.forEach((doc) => {
//     const data = doc.data();
//     const departure = new Date(data.departureDate);
//     const duration = data.estimatedDurationHours || 3;
//     const arrivalPlusBuffer = new Date(departure.getTime() + (duration + 2) * 3600000);
//     if (now > arrivalPlusBuffer) {
//       batch.update(doc.ref, {
//         status: "Completed",
//         autoCompletedAt: admin.firestore.FieldValue.serverTimestamp(),
//         completionReason: "AUTO_STALE_PURGE",
//       });
//       if (data.carrierId) {
//         batch.update(db.collection("users").doc(data.carrierId), { currentActiveTripId: null });
//       }
//     }
//   });
//   await batch.commit();
// });
// // --- 🎞️ SECTION 4: ARCHIVAL REACTORS (FORENSIC COMPRESSION) ---
// async function compressChatLogs(chatId: string, parentRef: admin.firestore.DocumentReference, fieldName: string) {
//   const messages = await db.collection("chats").doc(chatId).collection("messages").orderBy("timestamp", "asc").get();
//   if (messages.empty) return;
//   let log = "";
//   const batch = db.batch();
//   messages.docs.forEach((m) => {
//     const d = m.data();
//     const time = d.timestamp?.toDate ? d.timestamp.toDate().toISOString() : "N/A";
//     log += `[${time}] ${d.senderName || "System"}: ${d.content}\n`;
//     batch.delete(m.ref);
//   });
//   batch.update(parentRef, {
//     [fieldName]: log,
//     [`${fieldName}At`]: admin.firestore.FieldValue.serverTimestamp(),
//   });
//   await batch.commit();
// }
// /**
//  * [FIX] لما الرحلة/الحجز تنتهي، الفنكشن دي كانت بتعمل compressChatLogs بس
//  * (تمسح الرسائل وتكتبها كـ log على الـ trip/booking) لكن مستند chats/{chatId}
//  * في collection "chats" — اللي عليه الـ client بيعتمد في تصنيف التابات
//  * (المجموعات / الخاصة / الأرشيف) — كان فاضل isClosed=false للأبد.
//  * نتيجة كده: شاتات الرحلات المنتهية فضلت ظاهرة في تاب "المجموعات" بدل
//  * ما تتنقل لتاب "الأرشيف"، لحد ما الناقل يقفلها يدوياً من زر PowerOff.
//  *
//  * هنا بنحدّث مستند الشات نفسه (isClosed + archivedAt) فور انتهاء الرحلة/الحجز،
//  * فالـ client (classifyChat) ينقلها للأرشيف تلقائياً، وبعد 10 أيام
//  * cleanArchivedChats (chat_archive_cleaner.ts) بيحذفها نهائياً.
//  */
// async function closeChatRecord(chatId: string) {
//   const chatRef = db.collection("chats").doc(chatId);
//   const snap = await chatRef.get();
//   if (!snap.exists) return;
//   if (snap.data()?.isClosed === true) return; // مقفولة بالفعل
//   await chatRef.update({
//     isClosed: true,
//     archivedAt: admin.firestore.FieldValue.serverTimestamp(),
//   });
// }
// export const archiveBookingChatSovereign = onDocumentUpdated("bookings/{bookingId}", async (event) => {
//   const after = event.data?.after.data();
//   const before = event.data?.before.data();
//   if (!after || !before || before.status === after.status) return;
//   if (["Completed", "Cancelled"].includes(after.status)) {
//     await compressChatLogs(event.params.bookingId, event.data?.after.ref!, "chatArchive");
//     await closeChatRecord(event.params.bookingId); // [FIX] أرشف شات الحجز الخاص فعلياً
//   }
// });
// export const archiveTripChatSovereign = onDocumentUpdated("trips/{tripId}", async (event) => {
//   const after = event.data?.after.data();
//   const before = event.data?.before.data();
//   if (!after || !before || before.status === after.status) return;
//   if (["Completed", "Cancelled"].includes(after.status)) {
//     await compressChatLogs(event.params.tripId, event.data?.after.ref!, "tripChatArchive");
//     await closeChatRecord(event.params.tripId); // [FIX] أرشف جروب الرحلة الجماعي فعلياً
//   }
// });
// // --- 🎖️ SECTION 5: SOVEREIGN STAFF RECRUITMENT ---
// export const recruitSovereignStaff = onCall({ cors: CORS_ORIGINS }, async (request) => {
//   if (!request.auth?.uid) throw new HttpsError("unauthenticated", "AUTH_REQUIRED");
//   // تأكد إن المستدعي admin أو owner
//   const callerSnap = await db.collection("users").doc(request.auth.uid).get();
//   const callerRole = callerSnap.data()?.role;
//   if (!["admin", "owner", "developer", "operations_manager"].includes(callerRole)) {
//     throw new HttpsError("permission-denied", "FORBIDDEN");
//   }
//   const {
//     fullName,
//     email,
//     tempPassword,
//     role,
//     agentTarget,
//     agentBonus,
//     commissionRate,
//     workType,
//     paymentSystem,
//     baseSalary,
//     nationalId,
//     permissions,
//     currency,
//   } = request.data;
//   if (!email || !tempPassword || !fullName || !role) {
//     throw new HttpsError("invalid-argument", "MISSING_REQUIRED_FIELDS");
//   }
//   const firstName = fullName.trim().split(" ")[0];
//   const lastName = fullName.trim().split(" ").slice(1).join(" ");
//   const staffData = {
//     email,
//     firstName,
//     lastName,
//     fullName,
//     nationalId: nationalId || "",
//     role,
//     workType: workType || "office",
//     paymentSystem: paymentSystem || "monthly",
//     baseSalary: baseSalary || 0,
//     currency: currency || "JOD",
//     permissions: permissions || {},
//     isActive: true,
//     isFirstLogin: true,
//     currentBalance: 0,
//     lifetimeEarnings: 0,
//     ...(role === "agent" && {
//       agentStatus: "active",
//       agentTarget: agentTarget || 50,
//       agentBonus: agentBonus || 100,
//       commissionRate: commissionRate || 0,
//     }),
//     updatedAt: admin.firestore.FieldValue.serverTimestamp(),
//   };
//   try {
//     // [SCR-DEDUP]: تحقق أولاً إن المستخدم مش موجود في Firebase Auth
//     // لو الوكيل سجّل نفسه مسبقاً، نستخدم uid الموجود ونحدّث Firestore فقط
//     let uid: string;
//     let isExisting = false;
//     try {
//       const existingUser = await admin.auth().getUserByEmail(email);
//       uid = existingUser.uid;
//       isExisting = true;
//       console.log(`[recruitSovereignStaff] User already exists in Auth, merging: ${uid}`);
//     } catch (notFoundError: any) {
//       if (notFoundError.code === "auth/user-not-found") {
//         // مستخدم جديد كلياً → ننشئه
//         const userRecord = await admin.auth().createUser({
//           email,
//           password: tempPassword,
//           displayName: fullName,
//         });
//         uid = userRecord.uid;
//         console.log(`[recruitSovereignStaff] New user created in Auth: ${uid}`);
//       } else {
//         throw notFoundError;
//       }
//     }
//     // احفظ أو حدّث في Firestore — merge:true يحمي البيانات القديمة
//     await db
//       .collection("users")
//       .doc(uid)
//       .set(
//         {
//           uid,
//           id: uid,
//           ...staffData,
//           // createdAt فقط لو مستخدم جديد
//           ...(!isExisting && { createdAt: admin.firestore.FieldValue.serverTimestamp() }),
//         },
//         { merge: true },
//       );
//     return { success: true, uid, email, merged: isExisting };
//   } catch (e: any) {
//     console.error("[recruitSovereignStaff] Error:", e);
//     throw new HttpsError("internal", e.message || "RECRUITMENT_FAILED");
//   }
// });
// export const toggleStaffStatusSovereign = onCall({ cors: CORS_ORIGINS }, async (request) => {
//   if (!request.auth?.uid) throw new HttpsError("unauthenticated", "AUTH_REQUIRED");
//   const callerSnap = await db.collection("users").doc(request.auth.uid).get();
//   const callerRole = callerSnap.data()?.role;
//   if (!["admin", "owner", "developer", "operations_manager"].includes(callerRole)) {
//     throw new HttpsError("permission-denied", "FORBIDDEN");
//   }
//   const { staffId, currentStatus, reason } = request.data;
//   if (!staffId || !reason || reason.trim().length < 5) {
//     throw new HttpsError("invalid-argument", "MISSING_FIELDS");
//   }
//   await db.collection("users").doc(staffId).update({
//     isActive: !currentStatus,
//     updatedAt: admin.firestore.FieldValue.serverTimestamp(),
//   });
//   // توثيق في السجل الجنائي
//   await db.collection("admin_logs").add({
//     action: currentStatus ? "FREEZE" : "UNFREEZE",
//     freezeType: "behavioral",
//     targetUserId: staffId,
//     adminId: request.auth.uid,
//     reason,
//     timestamp: admin.firestore.FieldValue.serverTimestamp(),
//   });
//   return { success: true };
// });
// export const repairSystemRupture = onCall({ cors: true }, async (request) => {
//   if (!request.auth?.uid) throw new HttpsError("unauthenticated", "AUTH_REQUIRED");
//   const callerSnap = await db.collection("users").doc(request.auth.uid).get();
//   const callerRole = callerSnap.data()?.role;
//   if (!["admin", "owner", "developer"].includes(callerRole)) {
//     throw new HttpsError("permission-denied", "FORBIDDEN");
//   }
//   const { crashId, resolveNote } = request.data;
//   if (!crashId || !resolveNote || resolveNote.trim().length < 3) {
//     throw new HttpsError("invalid-argument", "MISSING_FIELDS");
//   }
//   await db.collection("fatal_crashes").doc(crashId).update({
//     status: "resolved",
//     resolveNote: resolveNote.trim(),
//     resolvedAt: admin.firestore.FieldValue.serverTimestamp(),
//     resolvedBy: request.auth.uid,
//   });
//   await db.collection("admin_logs").add({
//     action: "REPAIR_SYSTEM_RUPTURE",
//     crashId,
//     resolveNote: resolveNote.trim(),
//     adminId: request.auth.uid,
//     timestamp: admin.firestore.FieldValue.serverTimestamp(),
//   });
//   return { success: true };
// });
// // --- 🚨 SECTION 6: TRIP MODIFICATION PROTOCOL (FCM & LOGIC) ---
// /**
//  * 1. إشعار المسافرين عند إنشاء طلب تعديل للرحلة
//  */
// export const onTripModificationRequested = onDocumentCreated("trip_modifications/{modId}", async (event) => {
//   const snap = event.data;
//   if (!snap) return;
//   const modData = snap.data();
//   const tripId = modData.tripId;
//   try {
//     const bookingsSnap = await db.collection("bookings").where("tripId", "==", tripId).where("status", "in", ["Confirmed", "Pending-Payment"]).get();
//     if (bookingsSnap.empty) return;
//     const passengerIds = new Set<string>();
//     bookingsSnap.docs.forEach((doc) => {
//       const data = doc.data();
//       if (data.userId) passengerIds.add(data.userId);
//     });
//     const tokens: string[] = [];
//     for (const userId of passengerIds) {
//       const userDoc = await db.collection("users").doc(userId).get();
//       const fcmToken = userDoc.data()?.fcmToken;
//       if (fcmToken) tokens.push(fcmToken);
//     }
//     if (tokens.length === 0) return;
//     // إرسال FCM (Push Notification)
//     await admin.messaging().sendEachForMulticast({
//       tokens,
//       notification: {
//         title: "⚠️ تغيير في موعد رحلتك!",
//         body: "الناقل يطلب تغيير موعد انطلاق الرحلة. يرجى فتح التطبيق للموافقة أو الرفض.",
//       },
//       data: { type: "TRIP_MODIFICATION", tripId },
//     });
//   } catch (error) {
//     console.error("[onTripModificationRequested] Rupture:", error);
//   }
// });
// /**
//  * 2. معالجة القبول الجماعي أو الرفض (Atomic Decision)
//  */
// // export const onTripModificationUpdated = onDocumentUpdated("trip_modifications/{modId}", async (event) => {
// //   const after = event.data?.after.data();
// //   const before = event.data?.before.data();
// //   if (!after || !before) return;
// //   const tripId = after.tripId;
// //   // حالة الرفض من أي مسافر
// //   if (after.status === "Rejected" && before.status !== "Rejected") {
// //     const carrierDoc = await db.collection("users").doc(after.carrierId).get();
// //     const carrierToken = carrierDoc.data()?.fcmToken;
// //     if (carrierToken) {
// //       await admin.messaging().send({
// //         token: carrierToken,
// //         notification: {
// //           title: "❌ تم رفض التعديل",
// //           body: "أحد المسافرين رفض تعديل موعد الرحلة. الرحلة باقية على موعدها الأصلي.",
// //         },
// //       });
// //     }
// //     return; // انتهت العملية بالرفض
// //   }
// //   // التحقق من حالة القبول عند انضمام مسافر جديد لمصفوفة الموافقين
// //   if (after.status === "Pending" && (after.acceptedBy?.length || 0) > (before.acceptedBy?.length || 0)) {
// //     // جلب كل الحجوزات النشطة للرحلة لمعرفة إجمالي المسافرين الفعلي
// //     const bookingsSnap = await db.collection("bookings").where("tripId", "==", tripId).where("status", "in", ["Confirmed", "Pending-Payment"]).get();
// //     const requiredPassengerIds = new Set<string>();
// //     bookingsSnap.docs.forEach((doc) => {
// //       const data = doc.data();
// //       if (data.userId) requiredPassengerIds.add(data.userId);
// //     });
// //     const acceptedBySet = new Set(after.acceptedBy || []);
// //     // هل كل المسافرين المطلوبين موجودين في قائمة الموافقين؟
// //     const allAccepted = Array.from(requiredPassengerIds).every((id) => acceptedBySet.has(id));
// //     if (allAccepted && requiredPassengerIds.size > 0) {
// //       // 1. تحديث جدول التعديلات ليصبح معتمد
// //       await event.data?.after.ref.update({
// //         status: "Approved",
// //         approvedAt: admin.firestore.FieldValue.serverTimestamp(),
// //       });
// //       // 2. تحديث موعد الرحلة الأصلي (Atomic Transfer)
// //       // نحتاج لدمج التاريخ الجديد مع الوقت وتكوين Timestamp سليم
// //       const newDateObj = after.newDate.toDate();
// //       const [hours, minutes] = (after.newTime || "00:00").split(":");
// //       newDateObj.setHours(Number(hours), Number(minutes), 0, 0);
// //       const tripRef = db.collection("trips").doc(tripId);
// //       await tripRef.update({
// //         departureDate: admin.firestore.Timestamp.fromDate(newDateObj),
// //         departureTime: after.newTime || "",
// //         updatedAt: admin.firestore.FieldValue.serverTimestamp(),
// //       });
// //       // 3. إشعار الناقل بالنجاح
// //       const carrierDoc = await db.collection("users").doc(after.carrierId).get();
// //       const carrierToken = carrierDoc.data()?.fcmToken;
// //       if (carrierToken) {
// //         await admin.messaging().send({
// //           token: carrierToken,
// //           notification: {
// //             title: "✅ تمت الموافقة!",
// //             body: "وافق جميع المسافرين على الموعد الجديد. تم تحديث الرحلة بنجاح.",
// //           },
// //         });
// //       }
// //     }
// //   }
// // });
// /**
//  * 2. معالجة القبول الجماعي أو الرفض (Atomic Decision)
//  */
// export const onTripModificationUpdated = onDocumentUpdated("trip_modifications/{modId}", async (event) => {
//   const after = event.data?.after.data();
//   const before = event.data?.before.data();
//   if (!after || !before) return;
//   const tripId = after.tripId;
//   // حالة الرفض من أي مسافر
//   if (after.status === "Rejected" && before.status !== "Rejected") {
//     const carrierDoc = await db.collection("users").doc(after.carrierId).get();
//     const carrierToken = carrierDoc.data()?.fcmToken;
//     if (carrierToken) {
//       await admin.messaging().send({
//         token: carrierToken,
//         notification: {
//           title: "❌ تم رفض التعديل",
//           body: "أحد المسافرين رفض تعديل موعد الرحلة. الرحلة باقية على موعدها الأصلي.",
//         },
//       });
//     }
//     return; // انتهت العملية بالرفض
//   }
//   // التحقق من حالة القبول عند انضمام مسافر جديد لمصفوفة الموافقين
//   if (after.status === "Pending" && (after.acceptedBy?.length || 0) > (before.acceptedBy?.length || 0)) {
//     const requiredPassengerIds = new Set<string>();
//     // 1. البحث عن المسافرين باستخدام tripId
//     const snap1 = await db.collection("bookings").where("tripId", "==", tripId).where("status", "in", ["Confirmed", "Pending-Payment"]).get();
//     snap1.docs.forEach((doc) => {
//       if (doc.data().userId) requiredPassengerIds.add(doc.data().userId);
//     });
//     // 2. البحث عن المسافرين باستخدام carrierTripId (ده اللي كان ناقص هنا)
//     const snap2 = await db.collection("bookings").where("carrierTripId", "==", tripId).where("status", "in", ["Confirmed", "Pending-Payment"]).get();
//     snap2.docs.forEach((doc) => {
//       if (doc.data().userId) requiredPassengerIds.add(doc.data().userId);
//     });
//     const acceptedBySet = new Set(after.acceptedBy || []);
//     // هل كل المسافرين المطلوبين موجودين في قائمة الموافقين؟
//     const allAccepted = Array.from(requiredPassengerIds).every((id) => acceptedBySet.has(id));
//     if (allAccepted && requiredPassengerIds.size > 0) {
//       // 1. تحديث جدول التعديلات ليصبح معتمد
//       await event.data?.after.ref.update({
//         status: "Approved",
//         approvedAt: admin.firestore.FieldValue.serverTimestamp(),
//       });
//       // 2. تحديث موعد الرحلة الأصلي (Atomic Transfer)
//       const newDateObj = after.newDate.toDate();
//       const [hours, minutes] = (after.newTime || "00:00").split(":");
//       newDateObj.setHours(Number(hours), Number(minutes), 0, 0);
//       const tripRef = db.collection("trips").doc(tripId);
//       await tripRef.update({
//         departureDate: admin.firestore.Timestamp.fromDate(newDateObj),
//         departureTime: after.newTime || "",
//         updatedAt: admin.firestore.FieldValue.serverTimestamp(),
//       });
//       // 3. تحديث العروض (Offers) المرتبطة بهذه الرحلة (حتى يظهر الموعد الجديد في السوق)
//       const offersSnap = await db.collection("offers").where("carrierTripId", "==", tripId).get();
//       if (!offersSnap.empty) {
//         const batch = db.batch();
//         offersSnap.docs.forEach((offerDoc) => {
//           batch.update(offerDoc.ref, {
//             departureDate: admin.firestore.Timestamp.fromDate(newDateObj),
//             departureTime: after.newTime || "",
//             updatedAt: admin.firestore.FieldValue.serverTimestamp(),
//           });
//         });
//         await batch.commit();
//       }
//       // 4. إشعار الناقل بالنجاح
//       const carrierDoc = await db.collection("users").doc(after.carrierId).get();
//       const carrierToken = carrierDoc.data()?.fcmToken;
//       if (carrierToken) {
//         await admin.messaging().send({
//           token: carrierToken,
//           notification: {
//             title: "✅ تمت الموافقة!",
//             body: "وافق جميع المسافرين على الموعد الجديد. تم تحديث الرحلة بنجاح.",
//           },
//         });
//       }
//     }
//   }
// });
// /**
//  * [BOOKING-TRANSFER] completeBookingTransfer
//  *
//  * Cloud Function تُستدعى من الناقل الجديد بعد:
//  * 1. موافقة المسافر (status: pending_carrier)
//  * 2. موافقة الناقل الجديد وتأكيد استلام العربون
//  *
//  * تنقل الحجز من الرحلة القديمة للرحلة الجديدة بشكل atomic.
//  */
// export const completeBookingTransfer = onCall({ cors: CORS_ORIGINS }, async (request) => {
//   if (!request.auth) throw new HttpsError("unauthenticated", "AUTH_REQUIRED");
//   const { bookingTransferRequestId } = request.data;
//   if (!bookingTransferRequestId) {
//     throw new HttpsError("invalid-argument", "MISSING_TRANSFER_REQUEST_ID");
//   }
//   const transferRef = db.collection("bookingTransferRequests").doc(bookingTransferRequestId);
//   return db
//     .runTransaction(async (transaction) => {
//       // 1. قراءة طلب النقل
//       const transferSnap = await transaction.get(transferRef);
//       if (!transferSnap.exists) throw new HttpsError("not-found", "TRANSFER_REQUEST_NOT_FOUND");
//       const tData = transferSnap.data()!;
//       if (tData.status !== "pending_carrier") {
//         throw new HttpsError("failed-precondition", `INVALID_STATUS: ${tData.status}`);
//       }
//       if (tData.toCarrierId !== request.auth!.uid) {
//         throw new HttpsError("permission-denied", "NOT_TARGET_CARRIER");
//       }
//       const { bookingId, fromCarrierId, toCarrierId, toCarrierTripId, fromCarrierTripId } = tData;
//       // 2. قراءة الحجز
//       const bookingRef = db.collection("bookings").doc(bookingId);
//       const bookingSnap = await transaction.get(bookingRef);
//       if (!bookingSnap.exists) throw new HttpsError("not-found", "BOOKING_NOT_FOUND");
//       const bData = bookingSnap.data()!;
//       const seats = bData.seats || 1;
//       // 3. قراءة الرحلة الجديدة
//       const newTripRef = db.collection("trips").doc(toCarrierTripId);
//       const newTripSnap = await transaction.get(newTripRef);
//       if (!newTripSnap.exists) throw new HttpsError("not-found", "NEW_TRIP_NOT_FOUND");
//       const newTripData = newTripSnap.data()!;
//       // 4. قراءة الرحلة القديمة
//       const oldTripRef = db.collection("trips").doc(fromCarrierTripId);
//       const oldTripSnap = await transaction.get(oldTripRef);
//       const oldTripData = oldTripSnap.exists ? oldTripSnap.data()! : null;
//       // 5. تحديث الحجز: انقله للرحلة الجديدة مع تحديث بيانات التذكرة
//       transaction.update(bookingRef, {
//         tripId: toCarrierTripId,
//         carrierTripId: toCarrierTripId,
//         carrierId: toCarrierId,
//         ...(newTripData.departureDate ? { departureDate: newTripData.departureDate } : {}),
//         ...(newTripData.departureTime ? { departureTime: newTripData.departureTime } : {}),
//         ...(newTripData.meetingPoint ? { meetingPoint: newTripData.meetingPoint } : {}),
//         ...(newTripData.meetingPointLink ? { meetingPointLink: newTripData.meetingPointLink } : {}),
//         transferredAt: admin.firestore.FieldValue.serverTimestamp(),
//         previousCarrierId: fromCarrierId,
//         previousTripId: fromCarrierTripId,
//         updatedAt: admin.firestore.FieldValue.serverTimestamp(),
//       });
//       // 6. إضافة الحجز للرحلة الجديدة + خصم المقاعد
//       transaction.update(newTripRef, {
//         bookingIds: admin.firestore.FieldValue.arrayUnion(bookingId),
//         availableSeats: admin.firestore.FieldValue.increment(-seats),
//         bookedSeats: admin.firestore.FieldValue.increment(seats),
//         updatedAt: admin.firestore.FieldValue.serverTimestamp(),
//       });
//       // 7. إزالة الحجز من الرحلة القديمة + رجوع المقاعد
//       if (oldTripData) {
//         transaction.update(oldTripRef, {
//           bookingIds: admin.firestore.FieldValue.arrayRemove(bookingId),
//           availableSeats: admin.firestore.FieldValue.increment(seats),
//           bookedSeats: admin.firestore.FieldValue.increment(-seats),
//           updatedAt: admin.firestore.FieldValue.serverTimestamp(),
//         });
//       }
//       // 8. إغلاق طلب النقل
//       transaction.update(transferRef, {
//         status: "completed",
//         completedAt: admin.firestore.FieldValue.serverTimestamp(),
//         updatedAt: admin.firestore.FieldValue.serverTimestamp(),
//       });
//       return { success: true };
//     })
//     .then(async (result) => {
//       // بعد الـ transaction: إشعارات (خارج الـ transaction عشان ما تسبب rollback)
//       try {
//         const tSnap = await transferRef.get();
//         const tData = tSnap.data()!;
//         const { userId: passengerId, fromCarrierId, tripDetails } = tData;
//         const notifBase = {
//           isRead: false,
//           createdAt: admin.firestore.FieldValue.serverTimestamp(),
//           bookingId: tData.bookingId,
//           type: "booking_transfer_completed",
//         };
//         // إشعار للمسافر بإتمام النقل
//         await db.collection("notifications").add({
//           ...notifBase,
//           userId: passengerId,
//           title: "✅ تم نقل رحلتك بنجاح!",
//           message: `تذكرتك الآن مع الناقل ${tripDetails?.newCarrierName || "الجديد"} — تحقق من تفاصيل رحلتك المحدّثة.`,
//         });
//         // إشعار للناقل الأصلي بإتمام النقل
//         await db.collection("notifications").add({
//           ...notifBase,
//           userId: fromCarrierId,
//           title: "✅ تم نقل الحجز بنجاح",
//           message: "تم إتمام عملية نقل الحجز للناقل الجديد وحُذف من رحلتك.",
//         });
//       } catch (notifErr) {
//         console.error("[completeBookingTransfer] Notification error:", notifErr);
//       }
//       return result;
//     });
// });
// /**
//  * [BOOKING-TRANSFER] acceptBookingTransferByCarrier
//  *
//  * الناقل الجديد يقبل استلام المسافر (بعد ما المسافر وافق)
//  * يُحدّث الحالة إلى deposit_pending ويطلب من الناقل الأصلي إرسال العربون
//  * بعد استلام العربون → يُستدعى completeBookingTransfer
//  */
// export const acceptBookingTransferByCarrier = onCall({ cors: CORS_ORIGINS }, async (request) => {
//   if (!request.auth) throw new HttpsError("unauthenticated", "AUTH_REQUIRED");
//   const { bookingTransferRequestId } = request.data;
//   if (!bookingTransferRequestId) {
//     throw new HttpsError("invalid-argument", "MISSING_TRANSFER_REQUEST_ID");
//   }
//   const transferRef = db.collection("bookingTransferRequests").doc(bookingTransferRequestId);
//   const transferSnap = await transferRef.get();
//   if (!transferSnap.exists) throw new HttpsError("not-found", "NOT_FOUND");
//   const tData = transferSnap.data()!;
//   if (tData.status !== "pending_carrier") {
//     throw new HttpsError("failed-precondition", `INVALID_STATUS: ${tData.status}`);
//   }
//   if (tData.toCarrierId !== request.auth.uid) {
//     throw new HttpsError("permission-denied", "NOT_TARGET_CARRIER");
//   }
//   // جلب بيانات الرحلة لحساب العربون
//   const newTripSnap = await db.collection("trips").doc(tData.toCarrierTripId).get();
//   const newTripData = newTripSnap.exists ? newTripSnap.data()! : {};
//   const tripPrice = newTripData.price || 0;
//   const depositPct = newTripData.depositPercentage || 20;
//   const depositAmount = Math.round((tripPrice * depositPct) / 100);
//   const currency = newTripData.currency || "JOD";
//   // تحديث الحالة → deposit_pending
//   await transferRef.update({
//     status: "deposit_pending",
//     depositAmount,
//     currency,
//     carrierAcceptedAt: admin.firestore.FieldValue.serverTimestamp(),
//     updatedAt: admin.firestore.FieldValue.serverTimestamp(),
//   });
//   // إشعار للناقل الأصلي بإرسال العربون
//   await db
//     .collection("users")
//     .doc(tData.fromCarrierId)
//     .collection("notifications")
//     .add({
//       userId: tData.fromCarrierId,
//       title: "✅ الناقل الجديد قبل — أرسل العربون",
//       message: `وافق الناقل على استلام الحجز. أرسل العربون (${depositAmount} ${currency}) لإتمام النقل.`,
//       type: "booking_transfer_send_deposit",
//       bookingTransferRequestId,
//       depositAmount,
//       currency,
//       isRead: false,
//       createdAt: admin.firestore.FieldValue.serverTimestamp(),
//     });
//   return { success: true, depositAmount, currency };
// });
const admin = __importStar(require("firebase-admin"));
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
    if (!snap || snap.data().atomicId)
        return;
    const data = snap.data();
    const role = data.role || "traveler";
    let prefix = "T-26-";
    let counterName = "travelersCount";
    if (role === "carrier") {
        prefix = "C-26-";
        counterName = "carriersCount";
    }
    else if (role === "agent") {
        prefix = "A-26-";
        counterName = "agentsCount";
    }
    try {
        const newId = await getNextAtomicId(counterName, prefix, 4);
        await snap.ref.update({ atomicId: newId });
    }
    catch (e) {
        console.error(`[Atomic Forge] User Rupture:`, e);
    }
});
exports.generateTripAtomicId = (0, firestore_1.onDocumentCreated)("trips/{tripId}", async (event) => {
    const snap = event.data;
    if (!snap || snap.data().atomicId)
        return;
    try {
        const newId = await getNextAtomicId("tripsCount", "TRP-", 5);
        await snap.ref.update({ atomicId: newId });
    }
    catch (e) {
        console.error(`[Atomic Forge] Trip Rupture:`, e);
    }
});
exports.generateBookingAtomicId = (0, firestore_1.onDocumentCreated)("bookings/{bookingId}", async (event) => {
    const snap = event.data;
    if (!snap || snap.data().atomicId)
        return;
    try {
        const newId = await getNextAtomicId("bookingsCount", "BKG-", 5);
        await snap.ref.update({ atomicId: newId });
    }
    catch (e) {
        console.error(`[Atomic Forge] Booking Rupture:`, e);
    }
});
exports.backfillAtomicIdsSovereign = (0, https_1.onCall)({ cors: CORS_ORIGINS }, async (request) => {
    if (!request.auth?.uid)
        throw new https_1.HttpsError("unauthenticated", "AUTH_REQUIRED");
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
    }
    catch (e) {
        throw new https_1.HttpsError("internal", e.message);
    }
});
// --- 🚀 SECTION 2: OPERATIONAL REACTORS (FIELD COMMAND) ---
/**
 * [SCR-919] ATOMIC TRANSFER REACTOR
 * Ensures full consistency between Trip, Bookings, and Transfer Requests.
 */
exports.acceptTransferSovereign = (0, https_1.onCall)({ cors: CORS_ORIGINS }, async (request) => {
    if (!request.auth)
        throw new https_1.HttpsError("unauthenticated", "AUTH_REQUIRED");
    const { transferRequestId } = request.data;
    if (!transferRequestId)
        throw new https_1.HttpsError("invalid-argument", "MISSING_REQUEST_ID");
    const transferRef = db.collection("transferRequests").doc(transferRequestId);
    return db.runTransaction(async (transaction) => {
        const transferSnap = await transaction.get(transferRef);
        if (!transferSnap.exists)
            throw new Error("REQUEST_NOT_FOUND");
        const tData = transferSnap.data();
        if (tData.status !== "pending")
            throw new Error("REQUEST_NOT_PENDING");
        // [FIX-SECURITY] إعادة تفعيل فحص الصلاحية: فقط الناقل المستهدف (toCarrierId) يحق له قبول طلب نقل الرحلة.
        // كان هذا الفحص معطّلاً بالتعليق، مما يسمح لأي مستخدم مسجّل دخول بقبول النقل والاستحواذ على رحلة ليست له.
        if (tData.toCarrierId !== request.auth.uid) {
            throw new https_1.HttpsError("permission-denied", "NOT_TARGET_CARRIER");
        }
        const tripId = tData.originalTripId;
        const tripRef = db.collection("trips").doc(tripId);
        const tripSnap = await transaction.get(tripRef);
        if (!tripSnap.exists)
            throw new Error("TRIP_NOT_FOUND");
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
//   if (!request.auth?.uid) {
//     throw new HttpsError("unauthenticated", "AUTH_REQUIRED");
//   }
//   const { bookingId, tripId, reason, cancelledBy } = request.data;
//   return db.runTransaction(async (transaction) => {
//     if (bookingId) {
//       const bookingRef = db.collection("bookings").doc(bookingId);
//       const bookingSnap = await transaction.get(bookingRef);
//       if (!bookingSnap.exists) {
//         throw new HttpsError("not-found", "BOOKING_NOT_FOUND");
//       }
//       const bData = bookingSnap.data()!;
//       transaction.update(bookingRef, {
//         status: "Cancelled",
//         cancelReason: reason || "إلغاء سيادي",
//         cancelledBy: cancelledBy || "system",
//         cancelledAt: admin.firestore.FieldValue.serverTimestamp(),
//         updatedAt: admin.firestore.FieldValue.serverTimestamp(),
//       });
//       if (["Confirmed", "Pending-Payment"].includes(bData.status)) {
//         transaction.update(db.collection("trips").doc(bData.tripId), {
//           availableSeats: admin.firestore.FieldValue.increment(bData.seats || 1),
//           updatedAt: admin.firestore.FieldValue.serverTimestamp(),
//         });
//       }
//       return { success: true, mode: "booking" };
//     }
//     if (tripId) {
//       const tripRef = db.collection("trips").doc(tripId);
//       const tripSnap = await transaction.get(tripRef);
//       if (!tripSnap.exists) {
//         throw new HttpsError("not-found", "TRIP_NOT_FOUND");
//       }
//       const tripData = tripSnap.data()!;
//       transaction.update(tripRef, {
//         status: "Cancelled",
//         cancelReason: reason || "سحب الطلب",
//         cancelledBy: cancelledBy || "system",
//         cancelledAt: admin.firestore.FieldValue.serverTimestamp(),
//         updatedAt: admin.firestore.FieldValue.serverTimestamp(),
//       });
//       if (tripData.carrierId) {
//         transaction.update(db.collection("users").doc(tripData.carrierId), {
//           currentActiveTripId: null,
//           updatedAt: admin.firestore.FieldValue.serverTimestamp(),
//         });
//       }
//       return { success: true, mode: "trip" };
//     }
//     throw new HttpsError("invalid-argument", "MISSING_DATA");
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
            // 🚀 1. الحماية من التنفيذ المزدوج: التأكد إن الحجز لم يُلغى مسبقاً
            if (bData.status === "Cancelled") {
                return { success: true, message: "ALREADY_CANCELLED", mode: "booking" };
            }
            transaction.update(bookingRef, {
                status: "Cancelled",
                cancelReason: reason || "إلغاء سيادي",
                cancelledBy: cancelledBy || "system",
                cancelledAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            // 🚀 2. إرجاع المقاعد بذكاء: فقط لو كانت مخصومة فعلاً من الرحلة!
            const seatsToRefund = bData.seats || 1;
            const isConfirmed = bData.status === "Confirmed";
            // خصم المقاعد في حالة Pending-Payment يحدث فقط لو:
            // - تم الخصم عند إنشاء رحلة جديدة للناقل (isPassengerTripDeleted = true)
            // - أو الحجز تم من قبل الناقل مباشرة (bookedByCarrier = true)
            const isPendingWithDeductedSeats = bData.status === "Pending-Payment" && (bData.isPassengerTripDeleted === true || bData.bookedByCarrier === true);
            if (isConfirmed || isPendingWithDeductedSeats) {
                // transaction.update(db.collection("trips").doc(bData.tripId), {
                //   availableSeats: admin.firestore.FieldValue.increment(seatsToRefund),
                const targetTripId = bData.carrierTripId || bData.tripId;
                transaction.update(db.collection("trips").doc(targetTripId), {
                    availableSeats: admin.firestore.FieldValue.increment(seatsToRefund),
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
            // 🚀 الحماية من التنفيذ المزدوج للرحلة بالكامل
            if (tripData.status === "Cancelled") {
                return { success: true, message: "ALREADY_CANCELLED", mode: "trip" };
            }
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
    if (!request.auth?.uid)
        throw new https_1.HttpsError("unauthenticated", "AUTH_REQUIRED");
    const { tripId } = request.data;
    if (!tripId)
        throw new https_1.HttpsError("invalid-argument", "TRIP_ID_REQUIRED");
    return db.runTransaction(async (transaction) => {
        const tripRef = db.collection("trips").doc(tripId);
        const tripSnap = await transaction.get(tripRef);
        if (!tripSnap.exists)
            throw new https_1.HttpsError("not-found", "TRIP_NOT_FOUND");
        const tripData = tripSnap.data();
        if (tripData.status === "Completed")
            throw new https_1.HttpsError("failed-precondition", "ALREADY_CANCELLED");
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
        if (expiringSnap.empty)
            return;
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
    }
    catch (e) {
        console.error("[SCR-927] Early Warning Reactor Failure:", e);
    }
});
exports.archiveStaleTrips = (0, scheduler_1.onSchedule)("every 60 minutes", async () => {
    const now = new Date();
    const snapshot = await db.collection("trips").where("status", "in", ["Planned", "In-Transit"]).get();
    if (snapshot.empty)
        return;
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
    if (messages.empty)
        return;
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
/**
 * [FIX] لما الرحلة/الحجز تنتهي، الفنكشن دي كانت بتعمل compressChatLogs بس
 * (تمسح الرسائل وتكتبها كـ log على الـ trip/booking) لكن مستند chats/{chatId}
 * في collection "chats" — اللي عليه الـ client بيعتمد في تصنيف التابات
 * (المجموعات / الخاصة / الأرشيف) — كان فاضل isClosed=false للأبد.
 * نتيجة كده: شاتات الرحلات المنتهية فضلت ظاهرة في تاب "المجموعات" بدل
 * ما تتنقل لتاب "الأرشيف"، لحد ما الناقل يقفلها يدوياً من زر PowerOff.
 *
 * هنا بنحدّث مستند الشات نفسه (isClosed + archivedAt) فور انتهاء الرحلة/الحجز،
 * فالـ client (classifyChat) ينقلها للأرشيف تلقائياً، وبعد 10 أيام
 * cleanArchivedChats (chat_archive_cleaner.ts) بيحذفها نهائياً.
 */
async function closeChatRecord(chatId) {
    const chatRef = db.collection("chats").doc(chatId);
    const snap = await chatRef.get();
    if (!snap.exists)
        return;
    if (snap.data()?.isClosed === true)
        return; // مقفولة بالفعل
    await chatRef.update({
        isClosed: true,
        archivedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
}
exports.archiveBookingChatSovereign = (0, firestore_1.onDocumentUpdated)("bookings/{bookingId}", async (event) => {
    const after = event.data?.after.data();
    const before = event.data?.before.data();
    if (!after || !before || before.status === after.status)
        return;
    if (["Completed", "Cancelled"].includes(after.status)) {
        await compressChatLogs(event.params.bookingId, event.data?.after.ref, "chatArchive");
        await closeChatRecord(event.params.bookingId); // [FIX] أرشف شات الحجز الخاص فعلياً
    }
});
exports.archiveTripChatSovereign = (0, firestore_1.onDocumentUpdated)("trips/{tripId}", async (event) => {
    const after = event.data?.after.data();
    const before = event.data?.before.data();
    if (!after || !before || before.status === after.status)
        return;
    if (["Completed", "Cancelled"].includes(after.status)) {
        await compressChatLogs(event.params.tripId, event.data?.after.ref, "tripChatArchive");
        await closeChatRecord(event.params.tripId); // [FIX] أرشف جروب الرحلة الجماعي فعلياً
    }
});
// --- 🎖️ SECTION 5: SOVEREIGN STAFF RECRUITMENT ---
exports.recruitSovereignStaff = (0, https_1.onCall)({ cors: CORS_ORIGINS }, async (request) => {
    if (!request.auth?.uid)
        throw new https_1.HttpsError("unauthenticated", "AUTH_REQUIRED");
    // تأكد إن المستدعي admin أو owner
    const callerSnap = await db.collection("users").doc(request.auth.uid).get();
    const callerRole = callerSnap.data()?.role;
    if (!["admin", "owner", "developer", "operations_manager"].includes(callerRole)) {
        throw new https_1.HttpsError("permission-denied", "FORBIDDEN");
    }
    const { fullName, email, tempPassword, role, agentTarget, agentBonus, commissionRate, workType, paymentSystem, baseSalary, nationalId, permissions, currency, } = request.data;
    if (!email || !tempPassword || !fullName || !role) {
        throw new https_1.HttpsError("invalid-argument", "MISSING_REQUIRED_FIELDS");
    }
    const firstName = fullName.trim().split(" ")[0];
    const lastName = fullName.trim().split(" ").slice(1).join(" ");
    const staffData = {
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
        ...(role === "agent" && {
            agentStatus: "active",
            agentTarget: agentTarget || 50,
            agentBonus: agentBonus || 100,
            commissionRate: commissionRate || 0,
        }),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    try {
        // [SCR-DEDUP]: تحقق أولاً إن المستخدم مش موجود في Firebase Auth
        // لو الوكيل سجّل نفسه مسبقاً، نستخدم uid الموجود ونحدّث Firestore فقط
        let uid;
        let isExisting = false;
        try {
            const existingUser = await admin.auth().getUserByEmail(email);
            uid = existingUser.uid;
            isExisting = true;
            console.log(`[recruitSovereignStaff] User already exists in Auth, merging: ${uid}`);
        }
        catch (notFoundError) {
            if (notFoundError.code === "auth/user-not-found") {
                // مستخدم جديد كلياً → ننشئه
                const userRecord = await admin.auth().createUser({
                    email,
                    password: tempPassword,
                    displayName: fullName,
                });
                uid = userRecord.uid;
                console.log(`[recruitSovereignStaff] New user created in Auth: ${uid}`);
            }
            else {
                throw notFoundError;
            }
        }
        // احفظ أو حدّث في Firestore — merge:true يحمي البيانات القديمة
        await db
            .collection("users")
            .doc(uid)
            .set({
            uid,
            id: uid,
            ...staffData,
            // createdAt فقط لو مستخدم جديد
            ...(!isExisting && { createdAt: admin.firestore.FieldValue.serverTimestamp() }),
        }, { merge: true });
        return { success: true, uid, email, merged: isExisting };
    }
    catch (e) {
        console.error("[recruitSovereignStaff] Error:", e);
        throw new https_1.HttpsError("internal", e.message || "RECRUITMENT_FAILED");
    }
});
exports.toggleStaffStatusSovereign = (0, https_1.onCall)({ cors: CORS_ORIGINS }, async (request) => {
    if (!request.auth?.uid)
        throw new https_1.HttpsError("unauthenticated", "AUTH_REQUIRED");
    const callerSnap = await db.collection("users").doc(request.auth.uid).get();
    const callerRole = callerSnap.data()?.role;
    if (!["admin", "owner", "developer", "operations_manager"].includes(callerRole)) {
        throw new https_1.HttpsError("permission-denied", "FORBIDDEN");
    }
    const { staffId, currentStatus, reason } = request.data;
    if (!staffId || !reason || reason.trim().length < 5) {
        throw new https_1.HttpsError("invalid-argument", "MISSING_FIELDS");
    }
    await db.collection("users").doc(staffId).update({
        isActive: !currentStatus,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    // توثيق في السجل الجنائي
    await db.collection("admin_logs").add({
        action: currentStatus ? "FREEZE" : "UNFREEZE",
        freezeType: "behavioral",
        targetUserId: staffId,
        adminId: request.auth.uid,
        reason,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { success: true };
});
exports.repairSystemRupture = (0, https_1.onCall)({ cors: true }, async (request) => {
    if (!request.auth?.uid)
        throw new https_1.HttpsError("unauthenticated", "AUTH_REQUIRED");
    const callerSnap = await db.collection("users").doc(request.auth.uid).get();
    const callerRole = callerSnap.data()?.role;
    if (!["admin", "owner", "developer"].includes(callerRole)) {
        throw new https_1.HttpsError("permission-denied", "FORBIDDEN");
    }
    const { crashId, resolveNote } = request.data;
    if (!crashId || !resolveNote || resolveNote.trim().length < 3) {
        throw new https_1.HttpsError("invalid-argument", "MISSING_FIELDS");
    }
    await db.collection("fatal_crashes").doc(crashId).update({
        status: "resolved",
        resolveNote: resolveNote.trim(),
        resolvedAt: admin.firestore.FieldValue.serverTimestamp(),
        resolvedBy: request.auth.uid,
    });
    await db.collection("admin_logs").add({
        action: "REPAIR_SYSTEM_RUPTURE",
        crashId,
        resolveNote: resolveNote.trim(),
        adminId: request.auth.uid,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { success: true };
});
// --- 🚨 SECTION 6: TRIP MODIFICATION PROTOCOL (FCM & LOGIC) ---
/**
 * 1. إشعار المسافرين عند إنشاء طلب تعديل للرحلة
 */
exports.onTripModificationRequested = (0, firestore_1.onDocumentCreated)("trip_modifications/{modId}", async (event) => {
    const snap = event.data;
    if (!snap)
        return;
    const modData = snap.data();
    const tripId = modData.tripId;
    try {
        const bookingsSnap = await db.collection("bookings").where("tripId", "==", tripId).where("status", "in", ["Confirmed", "Pending-Payment"]).get();
        if (bookingsSnap.empty)
            return;
        const passengerIds = new Set();
        bookingsSnap.docs.forEach((doc) => {
            const data = doc.data();
            if (data.userId)
                passengerIds.add(data.userId);
        });
        const tokens = [];
        for (const userId of passengerIds) {
            const userDoc = await db.collection("users").doc(userId).get();
            const fcmToken = userDoc.data()?.fcmToken;
            if (fcmToken)
                tokens.push(fcmToken);
        }
        if (tokens.length === 0)
            return;
        // إرسال FCM (Push Notification)
        await admin.messaging().sendEachForMulticast({
            tokens,
            notification: {
                title: "⚠️ تغيير في موعد رحلتك!",
                body: "الناقل يطلب تغيير موعد انطلاق الرحلة. يرجى فتح التطبيق للموافقة أو الرفض.",
            },
            data: { type: "TRIP_MODIFICATION", tripId },
        });
    }
    catch (error) {
        console.error("[onTripModificationRequested] Rupture:", error);
    }
});
/**
 * 2. معالجة القبول الجماعي أو الرفض (Atomic Decision)
 */
// export const onTripModificationUpdated = onDocumentUpdated("trip_modifications/{modId}", async (event) => {
//   const after = event.data?.after.data();
//   const before = event.data?.before.data();
//   if (!after || !before) return;
//   const tripId = after.tripId;
//   // حالة الرفض من أي مسافر
//   if (after.status === "Rejected" && before.status !== "Rejected") {
//     const carrierDoc = await db.collection("users").doc(after.carrierId).get();
//     const carrierToken = carrierDoc.data()?.fcmToken;
//     if (carrierToken) {
//       await admin.messaging().send({
//         token: carrierToken,
//         notification: {
//           title: "❌ تم رفض التعديل",
//           body: "أحد المسافرين رفض تعديل موعد الرحلة. الرحلة باقية على موعدها الأصلي.",
//         },
//       });
//     }
//     return; // انتهت العملية بالرفض
//   }
//   // التحقق من حالة القبول عند انضمام مسافر جديد لمصفوفة الموافقين
//   if (after.status === "Pending" && (after.acceptedBy?.length || 0) > (before.acceptedBy?.length || 0)) {
//     // جلب كل الحجوزات النشطة للرحلة لمعرفة إجمالي المسافرين الفعلي
//     const bookingsSnap = await db.collection("bookings").where("tripId", "==", tripId).where("status", "in", ["Confirmed", "Pending-Payment"]).get();
//     const requiredPassengerIds = new Set<string>();
//     bookingsSnap.docs.forEach((doc) => {
//       const data = doc.data();
//       if (data.userId) requiredPassengerIds.add(data.userId);
//     });
//     const acceptedBySet = new Set(after.acceptedBy || []);
//     // هل كل المسافرين المطلوبين موجودين في قائمة الموافقين؟
//     const allAccepted = Array.from(requiredPassengerIds).every((id) => acceptedBySet.has(id));
//     if (allAccepted && requiredPassengerIds.size > 0) {
//       // 1. تحديث جدول التعديلات ليصبح معتمد
//       await event.data?.after.ref.update({
//         status: "Approved",
//         approvedAt: admin.firestore.FieldValue.serverTimestamp(),
//       });
//       // 2. تحديث موعد الرحلة الأصلي (Atomic Transfer)
//       // نحتاج لدمج التاريخ الجديد مع الوقت وتكوين Timestamp سليم
//       const newDateObj = after.newDate.toDate();
//       const [hours, minutes] = (after.newTime || "00:00").split(":");
//       newDateObj.setHours(Number(hours), Number(minutes), 0, 0);
//       const tripRef = db.collection("trips").doc(tripId);
//       await tripRef.update({
//         departureDate: admin.firestore.Timestamp.fromDate(newDateObj),
//         departureTime: after.newTime || "",
//         updatedAt: admin.firestore.FieldValue.serverTimestamp(),
//       });
//       // 3. إشعار الناقل بالنجاح
//       const carrierDoc = await db.collection("users").doc(after.carrierId).get();
//       const carrierToken = carrierDoc.data()?.fcmToken;
//       if (carrierToken) {
//         await admin.messaging().send({
//           token: carrierToken,
//           notification: {
//             title: "✅ تمت الموافقة!",
//             body: "وافق جميع المسافرين على الموعد الجديد. تم تحديث الرحلة بنجاح.",
//           },
//         });
//       }
//     }
//   }
// });
/**
 * 2. معالجة القبول الجماعي أو الرفض (Atomic Decision)
 */
exports.onTripModificationUpdated = (0, firestore_1.onDocumentUpdated)("trip_modifications/{modId}", async (event) => {
    const after = event.data?.after.data();
    const before = event.data?.before.data();
    if (!after || !before)
        return;
    const tripId = after.tripId;
    // حالة الرفض من أي مسافر
    if (after.status === "Rejected" && before.status !== "Rejected") {
        const carrierDoc = await db.collection("users").doc(after.carrierId).get();
        const carrierToken = carrierDoc.data()?.fcmToken;
        if (carrierToken) {
            await admin.messaging().send({
                token: carrierToken,
                notification: {
                    title: "❌ تم رفض التعديل",
                    body: "أحد المسافرين رفض تعديل موعد الرحلة. الرحلة باقية على موعدها الأصلي.",
                },
            });
        }
        return; // انتهت العملية بالرفض
    }
    // التحقق من حالة القبول عند انضمام مسافر جديد لمصفوفة الموافقين
    if (after.status === "Pending" && (after.acceptedBy?.length || 0) > (before.acceptedBy?.length || 0)) {
        const requiredPassengerIds = new Set();
        // 1. البحث عن المسافرين باستخدام tripId
        const snap1 = await db.collection("bookings").where("tripId", "==", tripId).where("status", "in", ["Confirmed", "Pending-Payment"]).get();
        snap1.docs.forEach((doc) => {
            if (doc.data().userId)
                requiredPassengerIds.add(doc.data().userId);
        });
        // 2. البحث عن المسافرين باستخدام carrierTripId (ده اللي كان ناقص هنا)
        const snap2 = await db.collection("bookings").where("carrierTripId", "==", tripId).where("status", "in", ["Confirmed", "Pending-Payment"]).get();
        snap2.docs.forEach((doc) => {
            if (doc.data().userId)
                requiredPassengerIds.add(doc.data().userId);
        });
        const acceptedBySet = new Set(after.acceptedBy || []);
        // هل كل المسافرين المطلوبين موجودين في قائمة الموافقين؟
        const allAccepted = Array.from(requiredPassengerIds).every((id) => acceptedBySet.has(id));
        if (allAccepted && requiredPassengerIds.size > 0) {
            // 1. تحديث جدول التعديلات ليصبح معتمد
            await event.data?.after.ref.update({
                status: "Approved",
                approvedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            // 2. تحديث موعد الرحلة الأصلي (Atomic Transfer)
            const newDateObj = after.newDate.toDate();
            const [hours, minutes] = (after.newTime || "00:00").split(":");
            newDateObj.setHours(Number(hours), Number(minutes), 0, 0);
            const tripRef = db.collection("trips").doc(tripId);
            await tripRef.update({
                departureDate: admin.firestore.Timestamp.fromDate(newDateObj),
                departureTime: after.newTime || "",
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            // 3. تحديث العروض (Offers) المرتبطة بهذه الرحلة (حتى يظهر الموعد الجديد في السوق)
            const offersSnap = await db.collection("offers").where("carrierTripId", "==", tripId).get();
            if (!offersSnap.empty) {
                const batch = db.batch();
                offersSnap.docs.forEach((offerDoc) => {
                    batch.update(offerDoc.ref, {
                        departureDate: admin.firestore.Timestamp.fromDate(newDateObj),
                        departureTime: after.newTime || "",
                        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                    });
                });
                await batch.commit();
            }
            // 4. إشعار الناقل بالنجاح
            const carrierDoc = await db.collection("users").doc(after.carrierId).get();
            const carrierToken = carrierDoc.data()?.fcmToken;
            if (carrierToken) {
                await admin.messaging().send({
                    token: carrierToken,
                    notification: {
                        title: "✅ تمت الموافقة!",
                        body: "وافق جميع المسافرين على الموعد الجديد. تم تحديث الرحلة بنجاح.",
                    },
                });
            }
        }
    }
});
/**
 * [FIX-UNPROTECTED-WRITE] initiateBookingTransfer
 *
 * تحل محل الكتابة المباشرة من الواجهة (addDoc على bookingTransferRequests
 * في booking-transfer-dialog.tsx) التي كانت تتم بلا أي تحقق من جهة السيرفر.
 * يستدعيها الناقل الأصلي لبدء طلب نقل حجز راكب لناقل آخر على نفس المسار.
 *
 * تحقّقات السيرفر:
 * - أن المستخدم المتصل هو فعلاً الناقل المالك للحجز (fromCarrierId).
 * - أن الحجز ما زال في حالة نشطة قابلة للنقل.
 * - أن رحلة الناقل الجديد (toCarrierTripId) لديها مقاعد متاحة كافية فعلاً
 *   (كانت غير مفحوصة سابقاً، فيمكن إرسال طلب نقل لرحلة ممتلئة بالكامل).
 */
exports.initiateBookingTransfer = (0, https_1.onCall)({ cors: CORS_ORIGINS }, async (request) => {
    if (!request.auth)
        throw new https_1.HttpsError("unauthenticated", "AUTH_REQUIRED");
    const { bookingId, toCarrierId, toCarrierTripId } = request.data;
    if (!bookingId || !toCarrierId || !toCarrierTripId) {
        throw new https_1.HttpsError("invalid-argument", "MISSING_FIELDS");
    }
    if (toCarrierId === request.auth.uid) {
        throw new https_1.HttpsError("invalid-argument", "CANNOT_TRANSFER_TO_SELF");
    }
    const bookingRef = db.collection("bookings").doc(bookingId);
    const bookingSnap = await bookingRef.get();
    if (!bookingSnap.exists)
        throw new https_1.HttpsError("not-found", "BOOKING_NOT_FOUND");
    const bData = bookingSnap.data();
    if (bData.carrierId !== request.auth.uid) {
        throw new https_1.HttpsError("permission-denied", "NOT_BOOKING_OWNER");
    }
    if (!["Confirmed", "Pending-Carrier-Confirmation"].includes(bData.status)) {
        throw new https_1.HttpsError("failed-precondition", `BOOKING_NOT_TRANSFERABLE: ${bData.status}`);
    }
    const newTripSnap = await db.collection("trips").doc(toCarrierTripId).get();
    if (!newTripSnap.exists)
        throw new https_1.HttpsError("not-found", "NEW_TRIP_NOT_FOUND");
    const newTripData = newTripSnap.data();
    if (newTripData.carrierId !== toCarrierId) {
        throw new https_1.HttpsError("invalid-argument", "TRIP_CARRIER_MISMATCH");
    }
    if (newTripData.origin !== bData.origin || newTripData.destination !== bData.destination) {
        throw new https_1.HttpsError("invalid-argument", "ROUTE_MISMATCH");
    }
    const requiredSeats = bData.seats || 1;
    const availableSeats = newTripData.availableSeats ?? 0;
    if (availableSeats < requiredSeats) {
        throw new https_1.HttpsError("resource-exhausted", "NOT_ENOUGH_SEATS");
    }
    const transferRef = await db.collection("bookingTransferRequests").add({
        bookingId,
        userId: bData.userId,
        fromCarrierId: request.auth.uid,
        toCarrierId,
        toCarrierTripId,
        fromCarrierTripId: bData.carrierTripId || bData.tripId,
        status: "pending_passenger",
        tripDetails: {
            origin: newTripData.origin,
            destination: newTripData.destination,
            newDepartureDate: newTripData.departureDate || null,
            newDepartureTime: newTripData.departureTime || null,
            newMeetingPoint: newTripData.meetingPoint || null,
            newMeetingPointLink: newTripData.meetingPointLink || null,
            newCarrierName: newTripData.carrierName || "ناقل",
            passengerCount: requiredSeats,
        },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    await db.collection("notifications").add({
        userId: bData.userId,
        title: "🔄 طلب نقل رحلتك",
        message: `ناقلك يريد نقلك إلى رحلة أخرى على نفس المسار مع الناقل ${newTripData.carrierName || ""}. يُرجى الموافقة أو الرفض من تطبيقك.`,
        type: "booking_transfer_request",
        bookingTransferRequestId: transferRef.id,
        bookingId,
        isRead: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { success: true, transferRequestId: transferRef.id };
});
/**
 * [FIX-UNPROTECTED-WRITE] respondToBookingTransfer
 *
 * تحل محل الكتابة المباشرة من الواجهة (updateDoc في
 * booking-transfer-passenger-card.tsx) التي كانت تتم بلا أي تحقق من جهة
 * السيرفر. يستدعيها المسافر للموافقة أو الرفض على طلب نقله لناقل آخر.
 *
 * تحقّقات السيرفر:
 * - أن المستخدم المتصل هو فعلاً صاحب الحجز (userId) في طلب النقل.
 * - أن الطلب ما زال في حالة pending_passenger (لا يمكن الرد عليه مرتين).
 */
exports.respondToBookingTransfer = (0, https_1.onCall)({ cors: CORS_ORIGINS }, async (request) => {
    if (!request.auth)
        throw new https_1.HttpsError("unauthenticated", "AUTH_REQUIRED");
    const { transferRequestId, accept } = request.data;
    if (!transferRequestId || typeof accept !== "boolean") {
        throw new https_1.HttpsError("invalid-argument", "MISSING_FIELDS");
    }
    const transferRef = db.collection("bookingTransferRequests").doc(transferRequestId);
    const result = await db.runTransaction(async (transaction) => {
        const transferSnap = await transaction.get(transferRef);
        if (!transferSnap.exists)
            throw new https_1.HttpsError("not-found", "NOT_FOUND");
        const tData = transferSnap.data();
        if (tData.status !== "pending_passenger") {
            throw new https_1.HttpsError("failed-precondition", `INVALID_STATUS: ${tData.status}`);
        }
        if (tData.userId !== request.auth.uid) {
            throw new https_1.HttpsError("permission-denied", "NOT_BOOKING_PASSENGER");
        }
        if (accept) {
            transaction.update(transferRef, {
                status: "pending_carrier",
                passengerAcceptedAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
        }
        else {
            transaction.update(transferRef, {
                status: "rejected_by_passenger",
                passengerRejectedAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
        }
        return { toCarrierId: tData.toCarrierId, fromCarrierId: tData.fromCarrierId, bookingId: tData.bookingId };
    });
    if (accept) {
        await db.collection("notifications").add({
            userId: result.toCarrierId,
            title: "✅ مسافر جديد يريد الانضمام لرحلتك",
            message: "وافق المسافر على النقل. الرجاء مراجعة الطلب والموافقة على استقباله في رحلتك.",
            type: "booking_transfer_to_carrier",
            bookingTransferRequestId: transferRequestId,
            bookingId: result.bookingId,
            isRead: false,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
    }
    else {
        await db.collection("notifications").add({
            userId: result.fromCarrierId,
            title: "❌ المسافر رفض النقل",
            message: "المسافر لا يريد الانتقال لناقل آخر.",
            type: "booking_transfer_rejected_by_passenger",
            bookingId: result.bookingId,
            isRead: false,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
    }
    return { success: true };
});
/**
 * [BOOKING-TRANSFER] completeBookingTransfer
 *
 * Cloud Function تُستدعى من الناقل الجديد بعد:
 * 1. موافقة المسافر (status: pending_carrier)
 * 2. موافقة الناقل الجديد وتأكيد استلام العربون
 *
 * تنقل الحجز من الرحلة القديمة للرحلة الجديدة بشكل atomic.
 */
exports.completeBookingTransfer = (0, https_1.onCall)({ cors: CORS_ORIGINS }, async (request) => {
    if (!request.auth)
        throw new https_1.HttpsError("unauthenticated", "AUTH_REQUIRED");
    const { bookingTransferRequestId } = request.data;
    if (!bookingTransferRequestId) {
        throw new https_1.HttpsError("invalid-argument", "MISSING_TRANSFER_REQUEST_ID");
    }
    const transferRef = db.collection("bookingTransferRequests").doc(bookingTransferRequestId);
    return db
        .runTransaction(async (transaction) => {
        // 1. قراءة طلب النقل
        const transferSnap = await transaction.get(transferRef);
        if (!transferSnap.exists)
            throw new https_1.HttpsError("not-found", "TRANSFER_REQUEST_NOT_FOUND");
        const tData = transferSnap.data();
        if (tData.status !== "pending_carrier") {
            throw new https_1.HttpsError("failed-precondition", `INVALID_STATUS: ${tData.status}`);
        }
        if (tData.toCarrierId !== request.auth.uid) {
            throw new https_1.HttpsError("permission-denied", "NOT_TARGET_CARRIER");
        }
        const { bookingId, fromCarrierId, toCarrierId, toCarrierTripId, fromCarrierTripId } = tData;
        // 2. قراءة الحجز
        const bookingRef = db.collection("bookings").doc(bookingId);
        const bookingSnap = await transaction.get(bookingRef);
        if (!bookingSnap.exists)
            throw new https_1.HttpsError("not-found", "BOOKING_NOT_FOUND");
        const bData = bookingSnap.data();
        const seats = bData.seats || 1;
        // 3. قراءة الرحلة الجديدة
        const newTripRef = db.collection("trips").doc(toCarrierTripId);
        const newTripSnap = await transaction.get(newTripRef);
        if (!newTripSnap.exists)
            throw new https_1.HttpsError("not-found", "NEW_TRIP_NOT_FOUND");
        const newTripData = newTripSnap.data();
        // [FIX-SEATS-CHECK] فحص نهائي لتوفر المقاعد قبل الترحيل الفعلي (حاجز أمان أخير
        // حتى لو حجزت مقاعد الرحلة الجديدة بين خطوة القبول وخطوة الإتمام).
        if ((newTripData.availableSeats ?? 0) < seats) {
            throw new https_1.HttpsError("resource-exhausted", "NOT_ENOUGH_SEATS");
        }
        // 4. قراءة الرحلة القديمة
        const oldTripRef = db.collection("trips").doc(fromCarrierTripId);
        const oldTripSnap = await transaction.get(oldTripRef);
        const oldTripData = oldTripSnap.exists ? oldTripSnap.data() : null;
        // 5. تحديث الحجز: انقله للرحلة الجديدة مع تحديث بيانات التذكرة
        transaction.update(bookingRef, {
            tripId: toCarrierTripId,
            carrierTripId: toCarrierTripId,
            carrierId: toCarrierId,
            ...(newTripData.departureDate ? { departureDate: newTripData.departureDate } : {}),
            ...(newTripData.departureTime ? { departureTime: newTripData.departureTime } : {}),
            ...(newTripData.meetingPoint ? { meetingPoint: newTripData.meetingPoint } : {}),
            ...(newTripData.meetingPointLink ? { meetingPointLink: newTripData.meetingPointLink } : {}),
            transferredAt: admin.firestore.FieldValue.serverTimestamp(),
            previousCarrierId: fromCarrierId,
            previousTripId: fromCarrierTripId,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        // 6. إضافة الحجز للرحلة الجديدة + خصم المقاعد
        transaction.update(newTripRef, {
            bookingIds: admin.firestore.FieldValue.arrayUnion(bookingId),
            availableSeats: admin.firestore.FieldValue.increment(-seats),
            bookedSeats: admin.firestore.FieldValue.increment(seats),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        // 7. إزالة الحجز من الرحلة القديمة + رجوع المقاعد
        if (oldTripData) {
            transaction.update(oldTripRef, {
                bookingIds: admin.firestore.FieldValue.arrayRemove(bookingId),
                availableSeats: admin.firestore.FieldValue.increment(seats),
                bookedSeats: admin.firestore.FieldValue.increment(-seats),
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
        }
        // 8. إغلاق طلب النقل
        transaction.update(transferRef, {
            status: "completed",
            completedAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        return { success: true };
    })
        .then(async (result) => {
        // بعد الـ transaction: إشعارات (خارج الـ transaction عشان ما تسبب rollback)
        try {
            const tSnap = await transferRef.get();
            const tData = tSnap.data();
            const { userId: passengerId, fromCarrierId, tripDetails } = tData;
            const notifBase = {
                isRead: false,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                bookingId: tData.bookingId,
                type: "booking_transfer_completed",
            };
            // إشعار للمسافر بإتمام النقل
            await db.collection("notifications").add({
                ...notifBase,
                userId: passengerId,
                title: "✅ تم نقل رحلتك بنجاح!",
                message: `تذكرتك الآن مع الناقل ${tripDetails?.newCarrierName || "الجديد"} — تحقق من تفاصيل رحلتك المحدّثة.`,
            });
            // إشعار للناقل الأصلي بإتمام النقل
            await db.collection("notifications").add({
                ...notifBase,
                userId: fromCarrierId,
                title: "✅ تم نقل الحجز بنجاح",
                message: "تم إتمام عملية نقل الحجز للناقل الجديد وحُذف من رحلتك.",
            });
        }
        catch (notifErr) {
            console.error("[completeBookingTransfer] Notification error:", notifErr);
        }
        return result;
    });
});
/**
 * [BOOKING-TRANSFER] acceptBookingTransferByCarrier
 *
 * الناقل الجديد يقبل استلام المسافر (بعد ما المسافر وافق)
 * يُحدّث الحالة إلى deposit_pending ويطلب من الناقل الأصلي إرسال العربون
 * بعد استلام العربون → يُستدعى completeBookingTransfer
 */
exports.acceptBookingTransferByCarrier = (0, https_1.onCall)({ cors: CORS_ORIGINS }, async (request) => {
    if (!request.auth)
        throw new https_1.HttpsError("unauthenticated", "AUTH_REQUIRED");
    const { bookingTransferRequestId } = request.data;
    if (!bookingTransferRequestId) {
        throw new https_1.HttpsError("invalid-argument", "MISSING_TRANSFER_REQUEST_ID");
    }
    const transferRef = db.collection("bookingTransferRequests").doc(bookingTransferRequestId);
    // [FIX-RACE-CONDITION] نقل القراءة والتحديث داخل Transaction لمنع تنفيذ الدالة مرتين بالتزامن
    // (مثلاً نتيجة ضغط مزدوج أو إعادة محاولة الشبكة) وتجاوز فحص الحالة pending_carrier.
    const { depositAmount, currency } = await db
        .runTransaction(async (transaction) => {
        const transferSnap = await transaction.get(transferRef);
        if (!transferSnap.exists)
            throw new https_1.HttpsError("not-found", "NOT_FOUND");
        const tData = transferSnap.data();
        if (tData.status !== "pending_carrier") {
            throw new https_1.HttpsError("failed-precondition", `INVALID_STATUS: ${tData.status}`);
        }
        if (tData.toCarrierId !== request.auth.uid) {
            throw new https_1.HttpsError("permission-denied", "NOT_TARGET_CARRIER");
        }
        // [FIX-SEATS-CHECK] التحقق من توفر مقاعد كافية في رحلة الناقل الجديد قبل الموافقة على الاستلام.
        const newTripRef = db.collection("trips").doc(tData.toCarrierTripId);
        const newTripSnap = await transaction.get(newTripRef);
        if (!newTripSnap.exists)
            throw new https_1.HttpsError("not-found", "NEW_TRIP_NOT_FOUND");
        const newTripData = newTripSnap.data();
        const requiredSeats = tData.tripDetails?.passengerCount || 1;
        const availableSeats = newTripData.availableSeats ?? 0;
        if (availableSeats < requiredSeats) {
            throw new https_1.HttpsError("resource-exhausted", "NOT_ENOUGH_SEATS");
        }
        const tripPrice = newTripData.price || 0;
        const depositPct = newTripData.depositPercentage || 20;
        const depositAmountCalc = Math.round((tripPrice * depositPct) / 100);
        const currencyCalc = newTripData.currency || "JOD";
        transaction.update(transferRef, {
            status: "deposit_pending",
            depositAmount: depositAmountCalc,
            currency: currencyCalc,
            carrierAcceptedAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        return { depositAmount: depositAmountCalc, currency: currencyCalc, fromCarrierId: tData.fromCarrierId };
    })
        .then(async (res) => {
        // إشعار للناقل الأصلي بإرسال العربون (بعد إغلاق الـ Transaction بنجاح)
        // [FIX-NOTIFICATION-PATH] توحيد المسار مع باقي النظام: مجموعة "notifications" الرئيسية
        // (كانت تُكتب سابقاً في users/{id}/notifications وهو مسار لا تستمع له الواجهة، فلا يصل الإشعار).
        await db.collection("notifications").add({
            userId: res.fromCarrierId,
            title: "✅ الناقل الجديد قبل — أرسل العربون",
            message: `وافق الناقل على استلام الحجز. أرسل العربون (${res.depositAmount} ${res.currency}) لإتمام النقل.`,
            type: "booking_transfer_send_deposit",
            bookingTransferRequestId,
            depositAmount: res.depositAmount,
            currency: res.currency,
            isRead: false,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        return res;
    });
    return { success: true, depositAmount, currency };
});
//# sourceMappingURL=index.js.map