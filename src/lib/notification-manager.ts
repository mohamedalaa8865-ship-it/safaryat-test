// "use client";
// import { getMessaging, getToken, onMessage } from "firebase/messaging";
// import { getApp } from "firebase/app";
// import { doc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore";
// import type { Firestore } from "firebase/firestore";
// import type { User } from "firebase/auth";
// import { toast } from "@/hooks/use-toast";
// import React from "react";
// import { ShieldCheck } from "lucide-react";

// /**
//  * @file src/lib/notification-manager.ts
//  * @description THE REINFORCED NOTIFICATION ENGINE (SC-707)
//  * [SC-707]: Injected high-priority handling for Sovereign alerts.
//  * Protocol 13: High contrast visual feedback for official pulses.
//  */

// export const setupNotifications = async (firestore: Firestore, user: User) => {
//   if (typeof window === "undefined" || !("serviceWorker" in navigator) || !("Notification" in window)) {
//     console.log("Push notifications are not supported in this environment.");
//     return;
//   }

//   try {
//     const registration = await navigator.serviceWorker.ready;
//     const app = getApp();
//     const messaging = getMessaging(app);

//     const permission = await Notification.requestPermission();
//     if (permission !== "granted") {
//       console.log("Notification permission denied by user.");
//       return;
//     }

//     const currentToken = await getToken(messaging, {
//       vapidKey: "BJEZ0yGvX3Jz1F2s5r7eYJ3Xz9J2Yc6kZ8fQ1vA0wS9nC3bH4lG5jK8dF7gT6hR1oP9iU7eW6xZ_0",
//       serviceWorkerRegistration: registration,
//     });

//     if (currentToken) {
//       const userDocRef = doc(firestore, "users", user.uid);
//       await updateDoc(userDocRef, {
//         fcmTokens: arrayUnion(currentToken),
//         lastTokenUpdate: serverTimestamp(),
//       }).catch((err) => {
//         if (err.code === "messaging/token-subscribe-failed") {
//           console.warn(`[FB-NOTIF-WARN] Failed to subscribe FCM token.`);
//         }
//       });

//       console.log("FCM Token Registered Successfully.");
//     }

//     // [SC-707] THE REINFORCED LISTENER: Official Voice vs Operational Noise
//     onMessage(messaging, (payload) => {
//       console.log("Foreground Pulse Received:", payload);

//       const isSovereign = payload.data?.isSovereign === "true" || payload.data?.type === "SOVEREIGN";

//       toast({
//         title: isSovereign ? "بلاغ سيادي رسمي" : "إشعار",

//         description: isSovereign
//           ? React.createElement(
//               "div",
//               { className: "flex items-center gap-2 text-primary font-black animate-in zoom-in" },
//               React.createElement(ShieldCheck, { className: "h-4 w-4" }),
//               React.createElement("span", null, "بلاغ سيادي رسمي"),
//             )
//           : undefined,
//         // description: payload.notification?.body,
//         // Sovereign alerts are "Sticky" - they require manual dismissal to ensure accountability
//         duration: isSovereign ? Infinity : 5000,
//       });
//     });
//   } catch (error) {
//     console.warn("Notification Setup Warning:", error);
//   }
// };

"use client";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getApp } from "firebase/app";
import { doc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore";
import type { Firestore } from "firebase/firestore";
import type { User } from "firebase/auth";
import { toast } from "@/hooks/use-toast";
import React from "react";
import { ShieldCheck } from "lucide-react";

/**
 * @file src/lib/notification-manager.ts
 * @description THE REINFORCED NOTIFICATION ENGINE (SC-707)
 */

// ── صوت الإشعار (Foreground) ──
const playNotificationSound = () => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(880, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.3);
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.4);
  } catch {
    // صوت غير متاح في البيئة الحالية
  }
};

export const setupNotifications = async (firestore: Firestore, user: User) => {
  if (typeof window === "undefined" || !("serviceWorker" in navigator) || !("Notification" in window)) {
    console.log("Push notifications are not supported in this environment.");
    return;
  }

  try {
    // ── تسجيل الـ Service Worker لو مش مسجل ──
    let registration = await navigator.serviceWorker.getRegistration("/firebase-messaging-sw.js");
    if (!registration) {
      registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js", {
        scope: "/",
      });
      console.log("[FCM] Service Worker registered.");
    }

    await navigator.serviceWorker.ready;

    const app = getApp();
    const messaging = getMessaging(app);

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Notification permission denied by user.");
      return;
    }

    const currentToken = await getToken(messaging, {
      vapidKey: "BJLsP7Yk_RP58YEc3v9cBcU6s7uHFbYc2Knc-xuZo6OQ371OVOFnd3DVrqHkbUupLtxR1cgONUwwA9PJygm1NaY",
      serviceWorkerRegistration: registration,
    });

    if (currentToken) {
      const userDocRef = doc(firestore, "users", user.uid);
      await updateDoc(userDocRef, {
        fcmTokens: arrayUnion(currentToken),
        lastTokenUpdate: serverTimestamp(),
      }).catch((err) => {
        console.warn(`[FCM] Failed to save token:`, err);
      });
      console.log("[FCM] Token saved successfully.");
    }

    // ── Foreground: إشعار + صوت لما الأبليكيشن فاتح ──
    onMessage(messaging, (payload) => {
      console.log("[FCM] Foreground message received:", payload);

      playNotificationSound();

      const isSovereign = payload.data?.isSovereign === "true" || payload.data?.type === "SOVEREIGN";

      const title = payload.notification?.title || payload.data?.title || "إشعار جديد";
      const body = payload.notification?.body || payload.data?.body || "";

      toast({
        title: isSovereign ? "بلاغ سيادي رسمي" : title,
        description: isSovereign
          ? React.createElement(
              "div",
              { className: "flex items-center gap-2 text-primary font-black animate-in zoom-in" },
              React.createElement(ShieldCheck, { className: "h-4 w-4" }),
              React.createElement("span", null, "بلاغ سيادي رسمي"),
            )
          : body || undefined,
        duration: isSovereign ? Infinity : 5000,
      });
    });
  } catch (error) {
    console.warn("[FCM] Notification Setup Warning:", error);
  }
};
