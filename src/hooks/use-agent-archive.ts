// "use client";

// import { useMemo } from "react";
// import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
// import { collection, query, where, orderBy, limit } from "firebase/firestore";
// import type { Trip } from "@/lib/data";

// /**
//  * @hook useAgentArchive
//  * @description THE STERILIZED AGENT ARTERY (REINFORCED - SCR-890)
//  * [PROTOCOL 16]: Diamond Sterilization.
//  * Heavy memoization of derived results to ensure Protocol 88 compliance.
//  */
// export function useAgentArchive() {
//   const { user } = useUser();
//   const firestore = useFirestore();

//   // [PROTOCOL 88]: Sovereign Artery Query - Stable Pulse
//   const tripsQuery = useMemoFirebase(() => {
//     if (!firestore || !user?.uid) return null;
//     return query(collection(firestore, "trips"), where("agentId", "==", user.uid), orderBy("createdAt", "desc"), limit(100));
//   }, [firestore, user?.uid]);

//   const { data: allTrips, isLoading } = useCollection<Trip>(tripsQuery);

//   // [PROTOCOL 16/88]: Atomic Aggregator - Memoized calculation
//   const result = useMemo(() => {
//     if (!allTrips) {
//       return {
//         recent: [],
//         archive: [],
//         counts: { success: 0, failed: 0 },
//       };
//     }

//     const recent = allTrips.slice(0, 5);
//     const archive = [...allTrips];

//     let successCount = 0;
//     let failedCount = 0;

//     for (const t of allTrips) {
//       // [SCR-2026-037]: Logic Alignment with SSOT Trip Status
//       // We consider these statuses as agent success (planned, active or finished)
//       const isSuccessful = t.status === "Completed" || t.status === "In-Transit" || t.status === "Planned" || t.status === "Offer-Received";

//       if (isSuccessful) {
//         successCount++;
//       } else if (t.status === "Cancelled") {
//         failedCount++;
//       }
//     }

//     return {
//       recent,
//       archive,
//       counts: { success: successCount, failed: failedCount },
//     };
//   }, [allTrips]);

//   return { ...result, isLoading };
// }

"use client";

import { useMemo } from "react";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, where, orderBy, limit } from "firebase/firestore";
import type { Trip, Booking } from "@/lib/data";

/**
 * @hook useAgentArchive
 * @description THE STERILIZED AGENT ARTERY (REINFORCED - SCR-890)
 * [PROTOCOL 16]: Diamond Sterilization.
 * Heavy memoization of derived results to ensure Protocol 88 compliance.
 */
export function useAgentArchive() {
  const { user } = useUser();
  const firestore = useFirestore();

  // [PROTOCOL 88]: Sovereign Artery Query - Stable Pulse
  // مسار "نشر طلب في السوق" (General) — بيتسجل على trips مباشرة
  const tripsQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return query(collection(firestore, "trips"), where("agentId", "==", user.uid), orderBy("createdAt", "desc"), limit(100));
  }, [firestore, user?.uid]);

  const { data: allTrips, isLoading: isTripsLoading } = useCollection<Trip>(tripsQuery);

  // [SCR-2026-FIX]: مسار "الحجز المباشر" (Proxy Booking) — بيتسجل على bookings
  // ده المسار الأساسي اللي الوكيل بيستخدمه، ولازم يدخل في عداد "الرحلات المنجزة"
  // بمجرد ما المسافر يدفع العربون (status يتعدى Pending-Payment)
  // [ملاحظة]: من غير orderBy عمداً — بس فلتر واحد، مش محتاج composite index جديد
  const agentBookingsQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return query(collection(firestore, "bookings"), where("agentId", "==", user.uid));
  }, [firestore, user?.uid]);

  const { data: allAgentBookings, isLoading: isBookingsLoading } = useCollection<Booking>(agentBookingsQuery);

  // [PROTOCOL 16/88]: Atomic Aggregator - Memoized calculation
  const result = useMemo(() => {
    if (!allTrips && !allAgentBookings) {
      return {
        recent: [],
        archive: [],
        counts: { success: 0, failed: 0 },
      };
    }

    const trips = allTrips || [];
    const bookings = allAgentBookings || [];

    const recent = trips.slice(0, 5);
    const archive = [...trips];

    let successCount = 0;
    let failedCount = 0;

    for (const t of trips) {
      // [SCR-2026-037]: Logic Alignment with SSOT Trip Status
      // We consider these statuses as agent success (planned, active or finished)
      const isSuccessful = t.status === "Completed" || t.status === "In-Transit" || t.status === "Planned" || t.status === "Offer-Received";

      if (isSuccessful) {
        successCount++;
      } else if (t.status === "Cancelled") {
        failedCount++;
      }
    }

    // [SCR-2026-FIX]: عدّ الحجوزات المباشرة اللي اتدفع عليها عربون فعلاً
    const depositPaidStatuses: Booking["status"][] = ["Pending-Payment-Verification", "Confirmed", "Completed", "Rated"];

    for (const b of bookings) {
      if (depositPaidStatuses.includes(b.status)) {
        successCount++;
      } else if (b.status === "Cancelled") {
        failedCount++;
      }
    }

    return {
      recent,
      archive,
      counts: { success: successCount, failed: failedCount },
    };
  }, [allTrips, allAgentBookings]);

  return { ...result, isLoading: isTripsLoading || isBookingsLoading };
}
