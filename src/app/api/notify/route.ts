// /**
//  * @file src/app/api/notify/route.ts
//  * @description API Route — بتبعت FCM Push Notification لأي user عن طريق الـ fcmTokens المحفوظة في Firestore
//  *
//  * POST /api/notify
//  * Body: { userId, title, body, data? }
//  */

// import { NextRequest, NextResponse } from "next/server";
// import { initializeApp, getApps, cert } from "firebase-admin/app";
// import { getFirestore } from "firebase-admin/firestore";
// import { getMessaging } from "firebase-admin/messaging";

// // ── تهيئة Firebase Admin (مرة واحدة بس) ──
// function getAdminApp() {
//   if (getApps().length > 0) return getApps()[0];

//   return initializeApp({
//     credential: cert({
//       projectId: process.env.FIREBASE_PROJECT_ID,
//       clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//       // السطر التالي بيحول \n النصية لسطر حقيقي في الـ private key
//       privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
//     }),
//   });
// }

// export async function POST(req: NextRequest) {
//   try {
//     const { userId, title, body, data } = await req.json();

//     if (!userId || !title) {
//       return NextResponse.json({ error: "userId and title are required" }, { status: 400 });
//     }

//     const app = getAdminApp();
//     const db = getFirestore(app);
//     const messaging = getMessaging(app);

//     // ── جيب الـ fcmTokens بتاعة الـ user من Firestore ──
//     const userDoc = await db.collection("users").doc(userId).get();
//     const fcmTokens: string[] = userDoc.data()?.fcmTokens || [];

//     if (fcmTokens.length === 0) {
//       return NextResponse.json({ success: false, reason: "no_tokens" });
//     }

//     // ── ابعت لكل token ──
//     const results = await Promise.allSettled(
//       fcmTokens.map((token) =>
//         messaging.send({
//           token,
//           notification: { title, body: body || "" },
//           data: data || {},
//           android: {
//             priority: "high",
//             notification: {
//               sound: "default",
//               channelId: "safaryat_default",
//             },
//           },
//           apns: {
//             payload: {
//               aps: {
//                 sound: "default",
//                 badge: 1,
//               },
//             },
//           },
//           webpush: {
//             notification: {
//               icon: "/icons/icon-192x192.png",
//               badge: "/icons/badge-72x72.png",
//               vibrate: [200, 100, 200],
//             },
//           },
//         }),
//       ),
//     );

//     // ── احذف الـ tokens الباظة عشان ما تتراكمش ──
//     const invalidTokens: string[] = [];
//     results.forEach((result, i) => {
//       if (result.status === "rejected") {
//         const errCode = (result.reason as any)?.errorInfo?.code;
//         if (errCode === "messaging/registration-token-not-registered" || errCode === "messaging/invalid-registration-token") {
//           invalidTokens.push(fcmTokens[i]);
//         }
//       }
//     });

//     if (invalidTokens.length > 0) {
//       await db
//         .collection("users")
//         .doc(userId)
//         .update({
//           fcmTokens: fcmTokens.filter((t) => !invalidTokens.includes(t)),
//         });
//     }

//     const successCount = results.filter((r) => r.status === "fulfilled").length;
//     return NextResponse.json({ success: true, sent: successCount, total: fcmTokens.length });
//   } catch (error: any) {
//     console.error("[/api/notify] Error:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

/**
 * @file src/app/api/notify/route.ts
 * POST /api/notify
 * Body: { userId, title, body?, data? }
 *
 * ✅ Firebase Admin init مرة واحدة
 * ✅ بيحذف الـ tokens الباظة تلقائياً
 * ✅ Android + iOS + Web push صح
 */

import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";

function getAdminApp() {
  if (getApps().length > 0) return getApps()[0];

  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export async function POST(req: NextRequest) {
  try {
    const { userId, title, body, data } = await req.json();

    if (!userId || !title) {
      return NextResponse.json({ error: "userId and title are required" }, { status: 400 });
    }

    const app = getAdminApp();
    const db = getFirestore(app);
    const messaging = getMessaging(app);

    // جيب الـ fcmTokens
    const userDoc = await db.collection("users").doc(userId).get();
    const fcmTokens: string[] = userDoc.data()?.fcmTokens || [];

    if (fcmTokens.length === 0) {
      return NextResponse.json({ success: false, reason: "no_tokens" });
    }

    // ابعت لكل token
    const results = await Promise.allSettled(
      fcmTokens.map((token) =>
        messaging.send({
          token,
          notification: { title, body: body || "" },
          data: data ? Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v)])) : {},
          android: {
            priority: "high",
            notification: {
              sound: "default",
              channelId: "safaryat_default",
              // icon: بيستخدم icon التطبيق تلقائياً — مش محتاج badge
            },
          },
          apns: {
            payload: {
              aps: {
                sound: "default",
                badge: 1,
                // content-available: 1 عشان يصحّي التطبيق في الخلفية على iOS
                "content-available": 1,
              },
            },
            headers: {
              "apns-priority": "10",
            },
          },
          webpush: {
            notification: {
              icon: "/icons/icon-192x192.png",
              // ❌ badge: أزلناه — badge-72x72.png مش موجود
            },
            headers: {
              Urgency: "high",
            },
          },
        }),
      ),
    );

    // احذف الـ tokens الباظة
    const invalidTokens: string[] = [];
    results.forEach((result, i) => {
      if (result.status === "rejected") {
        const code = (result.reason as any)?.errorInfo?.code ?? "";
        if (code === "messaging/registration-token-not-registered" || code === "messaging/invalid-registration-token") {
          invalidTokens.push(fcmTokens[i]);
        }
      }
    });

    if (invalidTokens.length > 0) {
      await db
        .collection("users")
        .doc(userId)
        .update({
          fcmTokens: FieldValue.arrayRemove(...invalidTokens),
        });
      console.log(`[notify] Removed ${invalidTokens.length} stale token(s) for ${userId}`);
    }

    const successCount = results.filter((r) => r.status === "fulfilled").length;
    return NextResponse.json({
      success: true,
      sent: successCount,
      total: fcmTokens.length,
    });
  } catch (error: any) {
    console.error("[/api/notify] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
