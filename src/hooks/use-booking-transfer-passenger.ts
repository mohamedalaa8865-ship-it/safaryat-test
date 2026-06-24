// // "use client";

// // /**
// //  * @file src/hooks/use-booking-transfer-passenger.ts
// //  * @description يستمع لحظياً لوجود طلب نقل (bookingTransferRequests) معلّق على المسافر
// //  * بخصوص حجز معيّن (status === 'pending_passenger'). يُستخدم لإظهار
// //  * BookingTransferPassengerCard فوق تذكرة الرحلة في صفحة history.
// //  */

// // import { useEffect, useState } from "react";
// // import { useFirestore } from "@/firebase";
// // import { collection, query, where, onSnapshot, limit } from "firebase/firestore";

// // export interface PendingBookingTransferRequest {
// //   id: string;
// //   bookingId: string;
// //   userId: string;
// //   fromCarrierId: string;
// //   toCarrierId: string;
// //   toCarrierTripId: string;
// //   fromCarrierTripId: string;
// //   status: string;
// //   tripDetails: {
// //     origin: string;
// //     destination: string;
// //     newDepartureDate?: string | null;
// //     newDepartureTime?: string | null;
// //     newMeetingPoint?: string | null;
// //     newCarrierName: string;
// //     passengerCount: number;
// //   };
// //   createdAt?: any;
// // }

// // export function useBookingTransferPassenger(bookingId: string | null | undefined) {
// //   const firestore = useFirestore();
// //   const [request, setRequest] = useState<PendingBookingTransferRequest | null>(null);
// //   const [isLoading, setIsLoading] = useState<boolean>(true);

// //   useEffect(() => {
// //     if (!firestore || !bookingId) {
// //       setRequest(null);
// //       setIsLoading(false);
// //       return;
// //     }

// //     setIsLoading(true);

// //     const q = query(
// //       collection(firestore, "bookingTransferRequests"),
// //       where("bookingId", "==", bookingId),
// //       where("status", "==", "pending_passenger"),
// //       limit(1),
// //     );

// //     const unsubscribe = onSnapshot(
// //       q,
// //       (snapshot) => {
// //         if (!snapshot.empty) {
// //           const docSnap = snapshot.docs[0];
// //           setRequest({ id: docSnap.id, ...docSnap.data() } as PendingBookingTransferRequest);
// //         } else {
// //           setRequest(null);
// //         }
// //         setIsLoading(false);
// //       },
// //       (err) => {
// //         console.warn("[useBookingTransferPassenger] listen failed:", err);
// //         setRequest(null);
// //         setIsLoading(false);
// //       },
// //     );

// //     return () => unsubscribe();
// //   }, [firestore, bookingId]);

// //   return { request, isLoading };
// // }

// "use client";

// /**
//  * @file src/hooks/use-booking-transfer-passenger.ts
//  * @description يستمع لحظياً لوجود طلب نقل (bookingTransferRequests) معلّق على المسافر
//  * بخصوص حجز معيّن (status === 'pending_passenger'). يُستخدم لإظهار
//  * BookingTransferPassengerCard فوق تذكرة الرحلة في صفحة history.
//  */

// import { useEffect, useState } from "react";
// import { useFirestore } from "@/firebase";
// import { collection, query, where, onSnapshot, limit } from "firebase/firestore";

// export interface PendingBookingTransferRequest {
//   id: string;
//   bookingId: string;
//   userId: string;
//   fromCarrierId: string;
//   toCarrierId: string;
//   toCarrierTripId: string;
//   fromCarrierTripId: string;
//   status: string;
//   tripDetails: {
//     origin: string;
//     destination: string;
//     newDepartureDate?: string | null;
//     newDepartureTime?: string | null;
//     newMeetingPoint?: string | null;
//     newCarrierName: string;
//     passengerCount: number;
//   };
//   createdAt?: any;
// }

// export function useBookingTransferPassenger(bookingId: string | null | undefined, userId: string | null | undefined) {
//   const firestore = useFirestore();
//   const [request, setRequest] = useState<PendingBookingTransferRequest | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(true);

//   useEffect(() => {
//     if (!firestore || !bookingId || !userId) {
//       setRequest(null);
//       setIsLoading(false);
//       return;
//     }

//     setIsLoading(true);

//     const q = query(
//       collection(firestore, "bookingTransferRequests"),
//       where("bookingId", "==", bookingId),
//       where("userId", "==", userId),
//       where("status", "==", "pending_passenger"),
//       limit(1),
//     );

//     const unsubscribe = onSnapshot(
//       q,
//       (snapshot) => {
//         if (!snapshot.empty) {
//           const docSnap = snapshot.docs[0];
//           setRequest({ id: docSnap.id, ...docSnap.data() } as PendingBookingTransferRequest);
//         } else {
//           setRequest(null);
//         }
//         setIsLoading(false);
//       },
//       (err) => {
//         console.error("[useBookingTransferPassenger] listen failed:", err.code, err.message);
//         setRequest(null);
//         setIsLoading(false);
//       },
//     );

//     return () => unsubscribe();
//   }, [firestore, bookingId, userId]);

//   return { request, isLoading };
// }

"use client";

/**
 * @file src/hooks/use-booking-transfer-passenger.ts
 * @description يستمع لحظياً لوجود طلب نقل (bookingTransferRequests) معلّق على المسافر
 * بخصوص حجز معيّن (status === 'pending_passenger'). يُستخدم لإظهار
 * BookingTransferPassengerCard فوق تذكرة الرحلة في صفحة history.
 */

import { useEffect, useState } from "react";
import { useFirestore } from "@/firebase";
import { collection, query, where, onSnapshot, limit } from "firebase/firestore";

export interface PendingBookingTransferRequest {
  id: string;
  bookingId: string;
  userId: string;
  fromCarrierId: string;
  toCarrierId: string;
  toCarrierTripId: string;
  fromCarrierTripId: string;
  status: string;
  tripDetails: {
    origin: string;
    destination: string;
    newDepartureDate?: string | null;
    newDepartureTime?: string | null;
    newMeetingPoint?: string | null;
    newMeetingPointLink?: string | null;
    newCarrierName: string;
    passengerCount: number;
  };
  createdAt?: any;
}

export function useBookingTransferPassenger(bookingId: string | null | undefined, userId: string | null | undefined) {
  const firestore = useFirestore();
  const [request, setRequest] = useState<PendingBookingTransferRequest | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!firestore || !bookingId || !userId) {
      setRequest(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const q = query(
      collection(firestore, "bookingTransferRequests"),
      where("bookingId", "==", bookingId),
      where("userId", "==", userId),
      where("status", "==", "pending_passenger"),
      limit(1),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const docSnap = snapshot.docs[0];
          setRequest({ id: docSnap.id, ...docSnap.data() } as PendingBookingTransferRequest);
        } else {
          setRequest(null);
        }
        setIsLoading(false);
      },
      (err) => {
        console.error("[useBookingTransferPassenger] listen failed:", err.code, err.message);
        setRequest(null);
        setIsLoading(false);
      },
    );

    return () => unsubscribe();
  }, [firestore, bookingId, userId]);

  return { request, isLoading };
}
