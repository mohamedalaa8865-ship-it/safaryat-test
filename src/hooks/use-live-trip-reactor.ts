// 'use client';

// /**
//  * @file src/hooks/use-live-trip-reactor.ts
//  * @description THE SOVEREIGN LIVE TRIP REACTOR (SCR-932 - PHASE 1)
//  * [PROTOCOL 14]: Precise Injection. Single file SSOT for trip syncing.
//  * [PROTOCOL 88]: Zero-Leak Resource Management. Kills connection on unmount.
//  * [PROTOCOL 20]: Digital Immune System for silent failure tracking.
//  */

// import { useState, useEffect } from 'react';
// import { useFirestore } from '@/firebase';
// import { doc, onSnapshot } from 'firebase/firestore';
// import type { Trip } from '@/lib/data';

// export function useLiveTripReactor(tripId: string | null | undefined) {
//     const firestore = useFirestore();
//     const [trip, setTrip] = useState<Trip | null>(null);
//     const [isLoading, setIsLoading] = useState<boolean>(true);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         // [PROTOCOL 88]: Anti-Chatter - الإغلاق المبكر إذا لم يكن هناك معرّف
//         if (!firestore || !tripId) {
//             setTrip(null);
//             setIsLoading(false);
//             return;
//         }

//         setIsLoading(true);
//         setError(null);

//         const tripRef = doc(firestore, 'trips', tripId);

//         // [SOVEREIGN BRIDGE]: فتح قناة الاستماع اللحظية للسحابة
//         const unsubscribe = onSnapshot(
//             tripRef,
//             (snapshot) => {
//                 if (snapshot.exists()) {
//                     setTrip({ id: snapshot.id, ...snapshot.data() } as Trip);
//                 } else {
//                     setTrip(null);
//                     setError('TRIP_NOT_FOUND');
//                 }
//                 setIsLoading(false);
//             },
//             (err: any) => {
//                 // [PROTOCOL 20]: البصمة الجنائية عند انقطاع الاتصال (لا وجود لـ catch فارغ)
//                 const traceId = `ERR-LIVE-${Math.floor(Math.random() * 10000)}`;
//                 console.error(`[Live Reactor] Connection ruptured. Trace: ${traceId}`, err);
//                 setError(traceId);
//                 setIsLoading(false);
//             }
//         );

//         // [PROTOCOL 88]: الإعدام الفوري - إغلاق القناة بمجرد خروج المستخدم (Unmount)
//         return () => {
//             unsubscribe();
//         };
//     }, [firestore, tripId]); // إعادة الربط فقط إذا تغير الـ tripId

//     return { trip, isLoading, error };
// }

"use client";

/**
 * @file src/hooks/use-live-trip-reactor.ts
 * @description THE SOVEREIGN LIVE TRIP REACTOR (SCR-932 - PHASE 1)
 * [PROTOCOL 14]: Precise Injection. Single file SSOT for trip syncing.
 * [PROTOCOL 88]: Zero-Leak Resource Management. Kills connection on unmount.
 * [PROTOCOL 20]: Digital Immune System for silent failure tracking.
 */

import { useState, useEffect } from "react";
import { useFirestore } from "@/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import type { Trip } from "@/lib/data";

export function useLiveTripReactor(tripId: string | null | undefined) {
  const firestore = useFirestore();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // [PROTOCOL 88]: Anti-Chatter - الإغلاق المبكر إذا لم يكن هناك معرّف
    if (!firestore || !tripId) {
      setTrip(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const tripRef = doc(firestore, "trips", tripId);

    // [SOVEREIGN BRIDGE]: فتح قناة الاستماع اللحظية للسحابة
    const unsubscribe = onSnapshot(
      tripRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          // [FIX]: حوّل Firestore Timestamps لـ ISO strings عشان isPast() تشتغل صح
          if (data.departureDate && typeof data.departureDate.toDate === "function") {
            data.departureDate = data.departureDate.toDate().toISOString();
          }
          if (data.createdAt && typeof data.createdAt.toDate === "function") {
            data.createdAt = data.createdAt.toDate().toISOString();
          }
          if (data.updatedAt && typeof data.updatedAt.toDate === "function") {
            data.updatedAt = data.updatedAt.toDate().toISOString();
          }
          setTrip({ id: snapshot.id, ...data } as Trip);
        } else {
          setTrip(null);
          setError("TRIP_NOT_FOUND");
        }
        setIsLoading(false);
      },
      (err: any) => {
        // [PROTOCOL 20]: البصمة الجنائية عند انقطاع الاتصال (لا وجود لـ catch فارغ)
        const traceId = `ERR-LIVE-${Math.floor(Math.random() * 10000)}`;
        console.error(`[Live Reactor] Connection ruptured. Trace: ${traceId}`, err);
        setError(traceId);
        setIsLoading(false);
      },
    );

    // [PROTOCOL 88]: الإعدام الفوري - إغلاق القناة بمجرد خروج المستخدم (Unmount)
    return () => {
      unsubscribe();
    };
  }, [firestore, tripId]); // إعادة الربط فقط إذا تغير الـ tripId

  return { trip, isLoading, error };
}
