"use strict";
// /**
//  * @file functions/src/chat-archive-cleaner.ts (أو .js)
//  *
//  * Cloud Function — تعمل كـ Scheduled Job كل يوم
//  * تحذف المحادثات المؤرشفة اللي مضى عليها أكتر من 10 أيام
//  *
//  * كيفية التشغيل:
//  *  firebase deploy --only functions:cleanArchivedChats
//  */
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
exports.manualCleanArchivedChats = exports.cleanArchivedChats = void 0;
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
const admin = __importStar(require("firebase-admin"));
const scheduler_1 = require("firebase-functions/v2/scheduler");
const https_1 = require("firebase-functions/v2/https");
if (!admin.apps.length)
    admin.initializeApp();
const db = admin.firestore();
const TEN_DAYS_MS = 10 * 24 * 60 * 60 * 1000;
/**
 * المنطق الفعلي لحذف المحادثات المؤرشفة (مشترك بين الـ Scheduler والـ Callable)
 */
async function deleteArchivedChats() {
    const cutoff = new Date(Date.now() - TEN_DAYS_MS);
    const snapshot = await db
        .collection("chats")
        .where("isClosed", "==", true)
        .where("archivedAt", "<=", admin.firestore.Timestamp.fromDate(cutoff))
        .get();
    if (snapshot.empty)
        return 0;
    const batch = db.batch();
    const toDelete = [];
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
exports.cleanArchivedChats = (0, scheduler_1.onSchedule)({
    schedule: "0 3 * * *", // كل يوم 3 صباحاً
    timeZone: "Asia/Amman",
}, async (_event) => {
    const deletedCount = await deleteArchivedChats();
    if (deletedCount === 0) {
        console.log("[CleanArchivedChats] لا توجد محادثات تستحق الحذف");
    }
});
/**
 * بديل: تُستدعى من الـ client مباشرة (Callable Function)
 * مفيدة لو عايز تشغّل عملية التنظيف يدوياً بدل ما تستنى الـ Scheduler
 *
 * الاستخدام من الـ client:
 *   const fn = httpsCallable(functions, 'manualCleanArchivedChats');
 *   await fn();
 */
exports.manualCleanArchivedChats = (0, https_1.onCall)(async (request) => {
    // تأكد إن الطالب admin/owner (نفس منطق فحص الصلاحيات في باقي فنكشنز المشروع)
    if (!request.auth?.uid) {
        throw new https_1.HttpsError("unauthenticated", "AUTH_REQUIRED");
    }
    const callerSnap = await db.collection("users").doc(request.auth.uid).get();
    const callerRole = callerSnap.data()?.role;
    if (!["admin", "owner", "developer"].includes(callerRole)) {
        throw new https_1.HttpsError("permission-denied", "Admins only");
    }
    const deleted = await deleteArchivedChats();
    return { deleted };
});
//# sourceMappingURL=chat_archive_cleaner.js.map