// /**
//  * @file functions/src/chat-archive-cleaner.ts (أو .js)
//  *
//  * Cloud Function — تعمل كـ Scheduled Job كل يوم
//  * تحذف المحادثات المؤرشفة اللي مضى عليها أكتر من 10 أيام
//  *
//  * كيفية التشغيل:
//  *  firebase deploy --only functions:cleanArchivedChats
//  */

// import * as functions from "firebase-functions";
// import * as admin from "firebase-admin";

// if (!admin.apps.length) admin.initializeApp();
// const db = admin.firestore();

// /**
//  * تعمل كل يوم الساعة 3 صباحاً (UTC)
//  * تحذف كل شات:
//  *   - isClosed = true
//  *   - archivedAt قبل 10 أيام أو أكثر
//  */
// export const cleanArchivedChats = functions.pubsub
//   .schedule("0 3 * * *") // كل يوم 3 صباحاً
//   .timeZone("Asia/Amman")
//   .onRun(async (_context) => {
//     const TEN_DAYS_MS = 10 * 24 * 60 * 60 * 1000;
//     const cutoff = new Date(Date.now() - TEN_DAYS_MS);

//     const snapshot = await db
//       .collection("chats")
//       .where("isClosed", "==", true)
//       .where("archivedAt", "<=", admin.firestore.Timestamp.fromDate(cutoff))
//       .get();

//     if (snapshot.empty) {
//       console.log("[CleanArchivedChats] لا توجد محادثات تستحق الحذف");
//       return null;
//     }

//     const batch = db.batch();
//     const toDelete: string[] = [];

//     for (const chatDoc of snapshot.docs) {
//       // احذف الـ subcollection messages أولاً
//       const messagesSnap = await chatDoc.ref.collection("messages").get();
//       messagesSnap.forEach((msgDoc) => batch.delete(msgDoc.ref));

//       // ثم احذف الـ chat document نفسه
//       batch.delete(chatDoc.ref);
//       toDelete.push(chatDoc.id);
//     }

//     await batch.commit();

//     console.log(`[CleanArchivedChats] تم حذف ${toDelete.length} محادثة: ${toDelete.join(", ")}`);
//     return null;
//   });

// /**
//  * بديل: تُستدعى من الـ client مباشرة (Callable Function)
//  * مفيدة لو مش عندك Pub/Sub مفعّل
//  *
//  * الاستخدام من الـ client:
//  *   const fn = httpsCallable(functions, 'manualCleanArchivedChats');
//  *   await fn();
//  */
// export const manualCleanArchivedChats = functions.https.onCall(async (_data, context) => {
//   // تأكد إن الطالب admin
//   if (!context.auth?.token?.admin) {
//     throw new functions.https.HttpsError("permission-denied", "Admins only");
//   }

//   const TEN_DAYS_MS = 10 * 24 * 60 * 60 * 1000;
//   const cutoff = new Date(Date.now() - TEN_DAYS_MS);

//   const snapshot = await db
//     .collection("chats")
//     .where("isClosed", "==", true)
//     .where("archivedAt", "<=", admin.firestore.Timestamp.fromDate(cutoff))
//     .get();

//   if (snapshot.empty) return { deleted: 0 };

//   const batch = db.batch();
//   for (const chatDoc of snapshot.docs) {
//     const messagesSnap = await chatDoc.ref.collection("messages").get();
//     messagesSnap.forEach((msgDoc) => batch.delete(msgDoc.ref));
//     batch.delete(chatDoc.ref);
//   }

//   await batch.commit();
//   return { deleted: snapshot.size };
// });

/**
 * @file functions/src/chat_archive_cleaner.ts
 *
 * Cloud Function — تعمل كـ Scheduled Job كل يوم
 * تحذف المحادثات المؤرشفة اللي مضى عليها أكتر من 10 أيام
 *
 * كيفية التشغيل:
 *  firebase deploy --only functions:cleanArchivedChats
 */

import * as admin from "firebase-admin";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { onCall, HttpsError } from "firebase-functions/v2/https";

if (!admin.apps.length) admin.initializeApp();
const db = admin.firestore();

const TEN_DAYS_MS = 10 * 24 * 60 * 60 * 1000;

/**
 * المنطق الفعلي لحذف المحادثات المؤرشفة (مشترك بين الـ Scheduler والـ Callable)
 */
async function deleteArchivedChats(): Promise<number> {
  const cutoff = new Date(Date.now() - TEN_DAYS_MS);

  const snapshot = await db
    .collection("chats")
    .where("isClosed", "==", true)
    .where("archivedAt", "<=", admin.firestore.Timestamp.fromDate(cutoff))
    .get();

  if (snapshot.empty) return 0;

  const batch = db.batch();
  const toDelete: string[] = [];

  for (const chatDoc of snapshot.docs) {
    // احذف الـ subcollection messages أولاً
    const messagesSnap = await chatDoc.ref.collection("messages").get();
    messagesSnap.forEach((msgDoc) => batch.delete(msgDoc.ref));

    // ثم احذف الـ chat document نفسه
    batch.delete(chatDoc.ref);
    toDelete.push(chatDoc.id);
  }

  await batch.commit();
  console.log(`[CleanArchivedChats] تم حذف ${toDelete.length} محادثة: ${toDelete.join(", ")}`);
  return toDelete.length;
}

/**
 * تعمل كل يوم الساعة 3 صباحاً بتوقيت عمّان
 * تحذف كل شات:
 *   - isClosed = true
 *   - archivedAt قبل 10 أيام أو أكثر
 */
export const cleanArchivedChats = onSchedule(
  {
    schedule: "0 3 * * *", // كل يوم 3 صباحاً
    timeZone: "Asia/Amman",
  },
  async (_event) => {
    const deletedCount = await deleteArchivedChats();
    if (deletedCount === 0) {
      console.log("[CleanArchivedChats] لا توجد محادثات تستحق الحذف");
    }
  },
);

/**
 * بديل: تُستدعى من الـ client مباشرة (Callable Function)
 * مفيدة لو عايز تشغّل عملية التنظيف يدوياً بدل ما تستنى الـ Scheduler
 *
 * الاستخدام من الـ client:
 *   const fn = httpsCallable(functions, 'manualCleanArchivedChats');
 *   await fn();
 */
export const manualCleanArchivedChats = onCall(async (request) => {
  // تأكد إن الطالب admin/owner (نفس منطق فحص الصلاحيات في باقي فنكشنز المشروع)
  if (!request.auth?.uid) {
    throw new HttpsError("unauthenticated", "AUTH_REQUIRED");
  }

  const callerSnap = await db.collection("users").doc(request.auth.uid).get();
  const callerRole = callerSnap.data()?.role;

  if (!["admin", "owner", "developer"].includes(callerRole)) {
    throw new HttpsError("permission-denied", "Admins only");
  }

  const deleted = await deleteArchivedChats();
  return { deleted };
});
