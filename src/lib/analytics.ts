
'use client';
import { initializeFirebase } from '@/firebase';
import { getAnalytics, logEvent as firebaseLogEvent, isSupported } from "firebase/analytics";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

let analytics: any;

/**
 * @file src/lib/analytics.ts
 * @description THE REINFORCED SENSOR (SC-806 V9.0 - SCR-954 VISITOR TRACKER)
 * [SCR-954]: Implemented logVisitorPulse to track non-account users for the owner.
 */

isSupported().then(supported => {
  if (supported) {
    const { firebaseApp } = initializeFirebase();
    analytics = getAnalytics(firebaseApp);
  }
}).catch(err => {
  console.warn("[Sovereign Analytics] Support check rupture:", err.message);
});

export const logEvent = (eventName: string, eventParams?: { [key: string]: any }) => {
  if (!analytics) return;
  firebaseLogEvent(analytics, eventName, eventParams);
}

/**
 * logVisitorPulse
 * [SCR-954]: Silent tracker for unauthenticated visitors.
 * Records to 'visitor_pulses' for owner visibility only.
 */
export const logVisitorPulse = async () => {
    try {
        const { firestore } = initializeFirebase();
        if (!firestore) return;

        // Session-based throttling to prevent pulse flooding
        const lastPulse = sessionStorage.getItem('safar_visitor_pulse');
        const now = Date.now();
        if (lastPulse && now - parseInt(lastPulse) < 30 * 60 * 1000) return;

        await addDoc(collection(firestore, 'visitor_pulses'), {
            timestamp: serverTimestamp(),
            userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'Unknown',
            screenSize: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'Unknown',
            path: typeof window !== 'undefined' ? window.location.pathname : 'Unknown'
        });

        sessionStorage.setItem('safar_visitor_pulse', now.toString());
    } catch (e) {
        console.warn("[Visitor Pulse] Transmission silenced.");
    }
};
