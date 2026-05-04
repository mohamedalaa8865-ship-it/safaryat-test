// 'use client';
// import { initializeFirebase } from '@/firebase';
// import { getAnalytics, logEvent as firebaseLogEvent, isSupported } from "firebase/analytics";
// import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// let analytics: any;

// /**
//  * @file src/lib/analytics.ts
//  * @description THE REINFORCED SENSOR (SC-806 V9.0 - SCR-954 VISITOR TRACKER)
//  * [SCR-954]: Implemented logVisitorPulse to track non-account users for the owner.
//  */

// isSupported().then(supported => {
//   if (supported) {
//     const { firebaseApp } = initializeFirebase();
//     analytics = getAnalytics(firebaseApp);
//   }
// }).catch(err => {
//   console.warn("[Sovereign Analytics] Support check rupture:", err.message);
// });

// export const logEvent = (eventName: string, eventParams?: { [key: string]: any }) => {
//   if (!analytics) return;
//   firebaseLogEvent(analytics, eventName, eventParams);
// }

// /**
//  * logVisitorPulse
//  * [SCR-954]: Silent tracker for unauthenticated visitors.
//  * Records to 'visitor_pulses' for owner visibility only.
//  */
// export const logVisitorPulse = async () => {
//     try {
//         const { firestore } = initializeFirebase();
//         if (!firestore) return;

//         // Session-based throttling to prevent pulse flooding
//         const lastPulse = sessionStorage.getItem('safar_visitor_pulse');
//         const now = Date.now();
//         if (lastPulse && now - parseInt(lastPulse) < 30 * 60 * 1000) return;

//         await addDoc(collection(firestore, 'visitor_pulses'), {
//             timestamp: serverTimestamp(),
//             userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'Unknown',
//             screenSize: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'Unknown',
//             path: typeof window !== 'undefined' ? window.location.pathname : 'Unknown'
//         });

//         sessionStorage.setItem('safar_visitor_pulse', now.toString());
//     } catch (e) {
//         console.warn("[Visitor Pulse] Transmission silenced.");
//     }
// };

"use client";

/**
 * @file src/lib/analytics.ts
 * [PERF-FIX]: كل Firebase imports بقت lazy بداخل الفunctions
 * مش في top-level — بيوفر ~400ms من Script Evaluation وقت التحميل
 *
 * المشكلة الأصلية: isSupported().then() كانت بتتنفذ فوراً عند import الملف
 * وده كان بيجيب firebase/analytics + initializeFirebase في أول chunk
 */

// [PERF-FIX]: مفيش top-level imports من firebase هنا

let analyticsInitialized = false;

// [PERF-FIX]: بدل ما نعمل isSupported() عند الـ import، نعملها بـ requestIdleCallback
if (typeof window !== "undefined") {
  const initAnalytics = async () => {
    try {
      const { isSupported, getAnalytics, logEvent: fbLog } = await import("firebase/analytics");
      const supported = await isSupported();
      if (supported) {
        const { initializeFirebase } = await import("@/firebase");
        const { firebaseApp } = initializeFirebase();
        getAnalytics(firebaseApp);
        analyticsInitialized = true;
      }
    } catch (e) {
      // silently fail
    }
  };

  if ("requestIdleCallback" in window) {
    (window as any).requestIdleCallback(initAnalytics, { timeout: 5000 });
  } else {
    setTimeout(initAnalytics, 2000);
  }
}

export const logEvent = async (eventName: string, eventParams?: Record<string, any>) => {
  if (!analyticsInitialized) return;
  try {
    const { getAnalytics, logEvent: fbLog } = await import("firebase/analytics");
    const { initializeFirebase } = await import("@/firebase");
    const { firebaseApp } = initializeFirebase();
    fbLog(getAnalytics(firebaseApp), eventName, eventParams);
  } catch (e) {
    // silently fail
  }
};

/**
 * logVisitorPulse
 * [SCR-954]: Silent tracker for unauthenticated visitors.
 * [PERF-FIX]: Fully lazy — لا يحمل Firebase إلا لما يتشغل
 */
export const logVisitorPulse = async () => {
  try {
    // Session-based throttling
    const lastPulse = sessionStorage.getItem("safar_visitor_pulse");
    const now = Date.now();
    if (lastPulse && now - parseInt(lastPulse) < 30 * 60 * 1000) return;

    // Lazy load Firebase
    const [{ initializeFirebase }, { collection, addDoc, serverTimestamp }] = await Promise.all([import("@/firebase"), import("firebase/firestore")]);

    const { firestore } = initializeFirebase();
    if (!firestore) return;

    await addDoc(collection(firestore, "visitor_pulses"), {
      timestamp: serverTimestamp(),
      userAgent: navigator.userAgent,
      screenSize: `${window.innerWidth}x${window.innerHeight}`,
      path: window.location.pathname,
    });

    sessionStorage.setItem("safar_visitor_pulse", now.toString());
  } catch (e) {
    // silently fail
  }
};
