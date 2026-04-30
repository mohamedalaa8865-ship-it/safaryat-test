// "use client";

// import { useMemo } from "react";
// import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
// import { collection, query, where, orderBy } from "firebase/firestore";
// import type { Booking } from "@/lib/data";

// /**
//  * @hook useAgentBookings
//  * @description جيب كل الحجوزات اللي عملها الوكيل — كل الحالات من الأول للآخر
//  */
// export function useAgentBookings() {
//   const { user } = useUser();
//   const firestore = useFirestore();

//   const bookingsQuery = useMemoFirebase(() => {
//     if (!firestore || !user?.uid) return null;
//     return query(collection(firestore, "bookings"), where("agentId", "==", user.uid), orderBy("createdAt", "desc"));
//   }, [firestore, user?.uid]);

//   const { data: allBookings, isLoading } = useCollection<Booking>(bookingsQuery);

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

import { useMemo, useEffect } from "react";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, where, orderBy } from "firebase/firestore";
import type { Booking } from "@/lib/data";

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

  return { ...grouped, isLoading };
}
