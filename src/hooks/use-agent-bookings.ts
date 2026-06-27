// // "use client";

// // import { useMemo } from "react";
// // import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
// // import { collection, query, where, orderBy } from "firebase/firestore";
// // import type { Booking } from "@/lib/data";

// // /**
// //  * @hook useAgentBookings
// //  * @description جيب كل الحجوزات اللي عملها الوكيل — كل الحالات من الأول للآخر
// //  */
// // export function useAgentBookings() {
// //   const { user } = useUser();
// //   const firestore = useFirestore();

// //   const bookingsQuery = useMemoFirebase(() => {
// //     if (!firestore || !user?.uid) return null;
// //     return query(collection(firestore, "bookings"), where("agentId", "==", user.uid), orderBy("createdAt", "desc"));
// //   }, [firestore, user?.uid]);

// //   const { data: allBookings, isLoading } = useCollection<Booking>(bookingsQuery);

// //   const grouped = useMemo(() => {
// //     const bookings = allBookings || [];
// //     return {
// //       pendingConfirmation: bookings.filter((b) => b.status === "Pending-Carrier-Confirmation"),
// //       pendingPayment: bookings.filter((b) => b.status === "Pending-Payment"),
// //       pendingVerification: bookings.filter((b) => b.status === "Pending-Payment-Verification"),
// //       confirmed: bookings.filter((b) => b.status === "Confirmed"),
// //       completed: bookings.filter((b) => b.status === "Completed" || b.status === "Rated"),
// //       cancelled: bookings.filter((b) => b.status === "Cancelled"),
// //       all: bookings,
// //     };
// //   }, [allBookings]);

// //   return { ...grouped, isLoading };
// // }

// "use client";

// import { useMemo, useEffect } from "react";
// import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
// import { collection, query, where, orderBy } from "firebase/firestore";
// import type { Booking } from "@/lib/data";

// export function useAgentBookings() {
//   const { user, isUserLoading } = useUser();
//   const firestore = useFirestore();

//   const bookingsQuery = useMemoFirebase(() => {
//     if (!firestore || !user?.uid) return null;
//     return query(
//       collection(firestore, "bookings"),
//       where("agentId", "==", user.uid),
//       // orderBy("createdAt", "desc")
//     );
//   }, [firestore, user?.uid]);

//   const { data: allBookings, isLoading: isCollectionLoading } = useCollection<Booking>(bookingsQuery);

//   const isLoading = isUserLoading || isCollectionLoading;

//   useEffect(() => {
//     console.log("[useAgentBookings]", {
//       isUserLoading,
//       isCollectionLoading,
//       isLoading,
//       uid: user?.uid,
//       bookingsCount: allBookings?.length ?? "null",
//       hasQuery: !!bookingsQuery,
//     });
//   });

//   const grouped = useMemo(() => {
//     const bookings = allBookings || [];
//     return {
//       pendingConfirmation: bookings.filter((b) => b.status === "Pending-Carrier-Confirmation"),
//       pendingPayment: bookings.filter((b) => b.status === "Pending-Payment"),
//       pendingVerification: bookings.filter((b) => b.status === "Pending-Payment-Verification"),
//       confirmed: bookings.filter((b) => b.status === "Confirmed"),
//       completed: bookings.filter((b) => b.status === "Completed" || b.status === "Rated"),
//       cancelled: bookings.filter((b) => b.status === "Cancelled"),
//       all: bookings,
//     };
//   }, [allBookings]);

//   return { ...grouped, isLoading };
// }

"use client";

import { useMemo, useEffect, useState } from "react";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, where, orderBy, doc, getDoc } from "firebase/firestore";
import type { Booking, Trip } from "@/lib/data";

export function useAgentBookings() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const bookingsQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return query(
      collection(firestore, "bookings"),
      where("agentId", "==", user.uid),
      // orderBy("createdAt", "desc")
    );
  }, [firestore, user?.uid]);

  const { data: allBookings, isLoading: isCollectionLoading } = useCollection<Booking>(bookingsQuery);

  // ══════════════════════════════════════════
  // جيب بيانات الرحلات المرتبطة بكل حجز (مرة واحدة)
  // عشان نقدر نبحث باسم الناقل من غير ما نعمل useDoc لكل كارت
  // ══════════════════════════════════════════
  const [tripsMap, setTripsMap] = useState<Record<string, Trip>>({});
  const [isTripsLoading, setIsTripsLoading] = useState(false);

  const tripIds = useMemo(() => {
    const ids = (allBookings || []).map((b) => b.tripId).filter(Boolean) as string[];
    return Array.from(new Set(ids));
  }, [allBookings]);

  useEffect(() => {
    if (!firestore || tripIds.length === 0) return;

    let isCancelled = false;
    setIsTripsLoading(true);

    (async () => {
      try {
        const missingIds = tripIds.filter((id) => !tripsMap[id]);
        if (missingIds.length === 0) {
          setIsTripsLoading(false);
          return;
        }

        const results = await Promise.all(
          missingIds.map(async (id) => {
            const snap = await getDoc(doc(firestore, "trips", id));
            return snap.exists() ? ({ id: snap.id, ...snap.data() } as Trip) : null;
          }),
        );

        if (isCancelled) return;

        setTripsMap((prev) => {
          const next = { ...prev };
          results.forEach((trip) => {
            if (trip) next[trip.id] = trip;
          });
          return next;
        });
      } catch (error) {
        console.error("[useAgentBookings] trips fetch error:", error);
      } finally {
        if (!isCancelled) setIsTripsLoading(false);
      }
    })();

    return () => {
      isCancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firestore, tripIds]);

  const isLoading = isUserLoading || isCollectionLoading;

  useEffect(() => {
    console.log("[useAgentBookings]", {
      isUserLoading,
      isCollectionLoading,
      isLoading,
      uid: user?.uid,
      bookingsCount: allBookings?.length ?? "null",
      hasQuery: !!bookingsQuery,
    });
  });

  const grouped = useMemo(() => {
    const bookings = allBookings || [];
    return {
      pendingConfirmation: bookings.filter((b) => b.status === "Pending-Carrier-Confirmation"),
      pendingPayment: bookings.filter((b) => b.status === "Pending-Payment"),
      pendingVerification: bookings.filter((b) => b.status === "Pending-Payment-Verification"),
      confirmed: bookings.filter((b) => b.status === "Confirmed"),
      completed: bookings.filter((b) => b.status === "Completed" || b.status === "Rated"),
      cancelled: bookings.filter((b) => b.status === "Cancelled"),
      all: bookings,
    };
  }, [allBookings]);

  return { ...grouped, isLoading, tripsMap, isTripsLoading };
}
