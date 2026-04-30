// // "use client";

// // import { useState } from "react";
// // import { useFirestore, useFunctions } from "@/firebase";
// // import { useToast } from "@/hooks/use-toast";
// // import { useUserProfile } from "@/hooks/use-user-profile";
// // import { doc, serverTimestamp, Timestamp, updateDoc } from "firebase/firestore";
// // import { httpsCallable } from "firebase/functions";
// // import type { Trip, Booking } from "@/lib/data";
// // import { type EditTripFormValues } from "@/components/carrier/edit-trip-dialog";
// // import { useTranslations } from "next-intl";

// // /**
// //  * @hook useTripActions
// //  * @description THE OPERATIONAL ENGINE (REINFORCED - SC-806 V5.7)
// //  * [SC-806 V5.7]: Substantiating operational commands via Cloud Artery.
// //  * Protocol 16: Sterilized error handling.
// //  */
// // export function useTripActions() {
// //   const firestore = useFirestore();
// //   const functions = useFunctions();
// //   const { toast } = useToast();
// //   const t = useTranslations();
// //   const tError = useTranslations("errorDictionary");
// //   const { profile } = useUserProfile();
// //   const [isProcessing, setIsProcessing] = useState<string | null>(null);

// //   /**
// //    * @function getSovereignMessage
// //    * @description RESOLVES SSOT ERROR CODES (DIAMOND ALIGNMENT)
// //    */
// //   const getSovereignMessage = (code: string) => {
// //     const normalizedCode = code?.toUpperCase() || "DEFAULT";
// //     try {
// //       const message = tError(normalizedCode);
// //       if (message === normalizedCode) return tError("DEFAULT");
// //       return message;
// //     } catch {
// //       return tError("DEFAULT");
// //     }
// //   };

// //   const completeTrip = async (trip: Trip) => {
// //     if (!functions || trip.status === "Completed" || !profile) return;
// //     setIsProcessing(`complete-${trip.id}`);
// //     try {
// //       // ✅ امسح أولاً قبل الـ function عشان لو فشلت مش يبقى مقفول
// //       if (firestore && profile.id) {
// //         await updateDoc(doc(firestore, "users", profile.id), {
// //           currentActiveTripId: null,
// //           updatedAt: serverTimestamp(),
// //         });
// //       }

// //       const completeFn = httpsCallable(functions, "confirmArrivalSovereign");
// //       await completeFn({ tripId: trip.id });

// //       toast({ title: t("common.success") });
// //     } catch (error: any) {
// //       toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
// //     } finally {
// //       setIsProcessing(null);
// //     }
// //   };
// //   const travelerConfirmArrival = async (tripId: string) => {
// //     if (!functions) return;
// //     setIsProcessing(`traveler-confirm-${tripId}`);
// //     try {
// //       const confirmFn = httpsCallable(functions, "confirmArrivalSovereign");
// //       await confirmFn({ tripId });
// //       toast({ title: t("common.success") });
// //     } catch (error: any) {
// //       toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
// //     } finally {
// //       setIsProcessing(null);
// //     }
// //   };

// //   const cancelTrip = async (trip: Trip, booking?: Booking): Promise<"cancelled" | "error"> => {
// //     if (!functions) return "error";
// //     const bookingId = booking?.id;
// //     const cancelledBy = profile?.role === "carrier" ? "carrier" : "traveler";
// //     setIsProcessing(`cancel-${bookingId || trip.id}`);
// //     try {
// //       const cancelFn = httpsCallable(functions, "cancelBookingSovereign");
// //       await cancelFn({
// //         bookingId,
// //         reason: cancelledBy === "carrier" ? "إلغاء من طرف الناقل" : "إلغاء من طرف المسافر",
// //         cancelledBy,
// //       });
// //       toast({ title: t("common.success") });
// //       return "cancelled";
// //     } catch (error: any) {
// //       toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
// //       return "error";
// //     } finally {
// //       setIsProcessing(null);
// //     }
// //   };
// //   const editTrip = async (trip: Trip, data: EditTripFormValues): Promise<boolean> => {
// //     if (!firestore) return false;
// //     if (trip.bookingIds && trip.bookingIds.length > 0) {
// //       toast({
// //         variant: "destructive",
// //         title: "لا يمكن التعديل",
// //         description: "لا يمكن تعديل الرحلة بعد تأكيد أول حجز.",
// //       });
// //       return false;
// //     }
// //     setIsProcessing(`edit-${trip.id}`);

// //     try {
// //       await updateDoc(doc(firestore, "trips", trip.id), {
// //         status: trip.status, // ✅ احتفظ بالـ status الأصلي مش "Planned" ثابت
// //         departureDate: Timestamp.fromDate(new Date(data.departureDate)), // ✅ Timestamp
// //         price: Number(data.price), // ✅ number
// //         availableSeats: Number(data.availableSeats),
// //         updatedAt: serverTimestamp(),
// //       });
// //       // await updateDoc(doc(firestore, "trips", trip.id), {
// //       //   // ...data,
// //       //   // status: trip.status,
// //       //   // status: "Planned", // ✅ ثابت مش من trip.status
// //       //   // departureDate: data.departureDate.toISOString(),
// //       //   // departureDate: new Date(data.departureDate).toISOString(),
// //       //   // price: Number(data.price),
// //       //   // departureDate: data.departureDate.toISOString(), // ✅ String
// //       //   departureDate: Timestamp.fromDate(new Date(data.departureDate)),
// //       //   price: Number(data.price), // ✅ String
// //       //   availableSeats: Number(data.availableSeats), // seats منطقي تبقى رقم
// //       //   updatedAt: serverTimestamp(),

// //       //   // availableSeats: Number(data.availableSeats),
// //       //   // updatedAt: serverTimestamp(),
// //       // });
// //       toast({ title: t("common.success" + { updateDoc }) });
// //       return true;
// //     } catch (error: any) {
// //       toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
// //       return false;
// //     } finally {
// //       setIsProcessing(null);
// //     }
// //   };
// //   const changeSeats = async (trip: Trip, delta: number) => {
// //     if (!firestore) return;
// //     const newSeats = (trip.availableSeats || 0) + delta;
// //     if (newSeats < 0) return;
// //     setIsProcessing(`seats-${trip.id}`);
// //     try {
// //       await updateDoc(doc(firestore, "trips", trip.id), {
// //         availableSeats: newSeats,
// //         updatedAt: serverTimestamp(),
// //       });
// //     } catch (error: any) {
// //       toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
// //     } finally {
// //       setIsProcessing(null);
// //     }
// //   };

// //   return { isProcessing, completeTrip, travelerConfirmArrival, cancelTrip, editTrip, changeSeats };
// // }
// "use client";

// /**
//  * @hook useTripActions
//  * @description THE OPERATIONAL ENGINE (REINFORCED - SC-806 V6.6 - PROTOCOL 20)
//  * [SCR-061]: Injected verifyBookingReceipt for Carrier Handshake.
//  * [PROTOCOL 20]: Immune system integration. No swallowed exceptions.
//  */

// import { useState } from "react";
// import { useFirestore, useFunctions } from "@/firebase";
// import { useToast } from "@/hooks/use-toast";
// import { useUserProfile } from "@/hooks/use-user-profile";
// import { doc, serverTimestamp, Timestamp, updateDoc, runTransaction, increment, writeBatch } from "firebase/firestore";
// import { httpsCallable } from "firebase/functions";
// import type { Trip, Booking } from "@/lib/data";
// import { type EditTripFormValues } from "@/components/carrier/edit-trip-dialog";
// import { useTranslations } from "next-intl";
// import { SovereignBlackBox } from "@/lib/sovereign-monitor";
// export function useTripActions() {
//   const firestore = useFirestore();
//   const functions = useFunctions();
//   const { toast } = useToast();
//   const t = useTranslations();
//   const tError = useTranslations("errorDictionary");
//   const { profile } = useUserProfile();
//   const [isProcessing, setIsProcessing] = useState<string | null>(null);

//   const getSovereignMessage = (code: string) => {
//     const normalizedCode = code?.toUpperCase() || "DEFAULT";
//     try {
//       const message = tError(normalizedCode);
//       return message === normalizedCode ? tError("DEFAULT") : message;
//     } catch {
//       return tError("DEFAULT");
//     }
//   };

//   /**
//    * verifyBookingReceipt
//    * [SCR-061]: Sovereign Handshake Finalization. Carrier authenticates the Voucher.
//    */
//   const verifyBookingReceipt = async (booking: Booking) => {
//     if (!firestore || !profile) return;
//     setIsProcessing(`verify-${booking.id}`);
//     try {
//       await runTransaction(firestore, async (transaction) => {
//         const bookingRef = doc(firestore, "bookings", booking.id);
//         const passengerTripRef = doc(firestore, "trips", booking.tripId);
//         const carrierTripId = booking.carrierTripId;
//         const carrierTripRef = carrierTripId ? doc(firestore, "trips", carrierTripId) : null;

//         // 1. Confirm Receipt & Seal Booking
//         transaction.update(bookingRef, {
//           status: "Confirmed",
//           verifiedAt: serverTimestamp(),
//           updatedAt: serverTimestamp(),
//         });

//         // 2. Atomic Seat Reduction (Source Request)
//         transaction.update(passengerTripRef, {
//           availableSeats: increment(-booking.seats),
//           updatedAt: serverTimestamp(),
//         });

//         // 3. Atomic Seat Reduction (Carrier Scheduled Trip)
//         if (carrierTripRef) {
//           transaction.update(carrierTripRef, {
//             availableSeats: increment(-booking.seats),
//             updatedAt: serverTimestamp(),
//           });
//         }
//       });

//       toast({ title: "تم تأكيد استلام العربون! ✅", description: "أصبح الحجز مؤكداً والمقاعد محجوزة الآن." });
//     } catch (error: any) {
//       SovereignBlackBox.reportLethalCrash(error, "VERIFY_RECEIPT_RUPTURE", { bookingId: booking.id });
//       toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
//     } finally {
//       setIsProcessing(null);
//     }
//   };

//   const completeTrip = async (trip: Trip) => {
//     if (!functions || trip.status === "Completed" || !profile) return;
//     setIsProcessing(`complete-${trip.id}`);
//     try {
//       if (firestore && profile.id) {
//         await updateDoc(doc(firestore, "users", profile.id), {
//           currentActiveTripId: null,
//           updatedAt: serverTimestamp(),
//         });
//       }

//       const completeFn = httpsCallable(functions, "confirmArrivalSovereign");
//       await completeFn({ tripId: trip.id });

//       toast({ title: t("common.success") });
//     } catch (error: any) {
//       SovereignBlackBox.reportLethalCrash(error, "COMPLETE_TRIP_RUPTURE", { tripId: trip.id });
//       toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
//     } finally {
//       setIsProcessing(null);
//     }
//   };

//   const travelerConfirmArrival = async (tripId: string) => {
//     if (!functions) return;
//     setIsProcessing(`traveler-confirm-${tripId}`);
//     try {
//       const confirmFn = httpsCallable(functions, "confirmArrivalSovereign");
//       await confirmFn({ tripId });
//       toast({ title: t("common.success") });
//     } catch (error: any) {
//       SovereignBlackBox.reportLethalCrash(error, "TRAVELER_ARRIVAL_CONFIRM_RUPTURE", { tripId });
//       toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
//     } finally {
//       setIsProcessing(null);
//     }
//   };

//   // const cancelTrip = async (trip: Trip, booking?: Booking): Promise<"cancelled" | "error"> => {
//   //   if (!functions) return "error";
//   //   const bookingId = booking?.id;
//   //   const cancelledBy = profile?.role === "carrier" ? "carrier" : "traveler";
//   //   setIsProcessing(`cancel-${bookingId || trip.id}`);
//   //   try {
//   //     const cancelFn = httpsCallable(functions, "cancelBookingSovereign");
//   //     await cancelFn({
//   //       bookingId,
//   //       reason: cancelledBy === "carrier" ? "إلغاء من طرف الناقل" : "إلغاء من طرف المسافر",
//   //       cancelledBy,
//   //     });
//   //     toast({ title: t("common.success") });
//   //     return "cancelled";
//   //   } catch (error: any) {
//   //     SovereignBlackBox.reportLethalCrash(error, "CANCEL_TRIP_RUPTURE", { tripId: trip.id, bookingId });
//   //     toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
//   //     return "error";
//   //   } finally {
//   //     setIsProcessing(null);
//   //   }
//   // };

//   // const cancelTrip = async (trip: Trip, booking?: Booking): Promise<"cancelled" | "error"> => {
//   //   const cancelledBy = profile?.role === "carrier" ? "carrier" : "traveler";
//   //   setIsProcessing(`cancel-${booking?.id || trip.id}`);

//   //   try {
//   //     // TRIP cancellation path: do it directly in Firestore
//   //     if (!booking) {
//   //       if (!firestore) return "error";

//   //       await updateDoc(doc(firestore, "trips", trip.id), {
//   //         status: "Cancelled",
//   //         cancelReason: cancelledBy === "carrier" ? "إلغاء من طرف الناقل" : "إلغاء من طرف المسافر",
//   //         cancelledBy,
//   //         cancelledAt: serverTimestamp(),
//   //         updatedAt: serverTimestamp(),
//   //       });

//   //       if (profile?.role === "carrier" && profile.id) {
//   //         await updateDoc(doc(firestore, "users", profile.id), {
//   //           currentActiveTripId: null,
//   //           updatedAt: serverTimestamp(),
//   //         });
//   //       }

//   //       toast({ title: t("common.success") });
//   //       return "cancelled";
//   //     }

//   //     // BOOKING cancellation path: leave as callable for now
//   //     if (!functions) return "error";

//   //     const cancelFn = httpsCallable(functions, "cancelBookingSovereign");
//   //     await cancelFn({
//   //       bookingId: booking.id,
//   //       reason: cancelledBy === "carrier" ? "إلغاء من طرف الناقل" : "إلغاء من طرف المسافر",
//   //       cancelledBy,
//   //     });

//   //     toast({ title: t("common.success") });
//   //     return "cancelled";
//   //   } catch (error: any) {
//   //     toast({
//   //       variant: "destructive",
//   //       title: t("common.error"),
//   //       description: getSovereignMessage(error.message),
//   //     });
//   //     return "error";
//   //   } finally {
//   //     setIsProcessing(null);
//   //   }
//   // };
//   const cancelTrip = async (trip: Trip, booking?: Booking): Promise<"cancelled" | "error"> => {
//     const cancelledBy = profile?.role === "carrier" ? "carrier" : "traveler";
//     setIsProcessing(`cancel-${booking?.id || trip.id}`);

//     try {
//       // Booking cancel stays callable
//       if (booking) {
//         if (!functions) return "error";

//         const cancelFn = httpsCallable(functions, "cancelBookingSovereign");
//         await cancelFn({
//           bookingId: booking.id,
//           reason: cancelledBy === "carrier" ? "إلغاء من طرف الناقل" : "إلغاء من طرف المسافر",
//           cancelledBy,
//         });

//         toast({ title: t("common.success") });
//         return "cancelled";
//       }

//       // Trip cancel = direct Firestore batch
//       if (!firestore) return "error";

//       const batch = writeBatch(firestore);
//       const tripRef = doc(firestore, "trips", trip.id);

//       batch.update(tripRef, {
//         status: "Cancelled",
//         cancelReason: cancelledBy === "carrier" ? "إلغاء من طرف الناقل" : "إلغاء من طرف المسافر",
//         cancelledBy,
//         cancelledAt: serverTimestamp(),
//         updatedAt: serverTimestamp(),
//       });

//       if (profile?.role === "carrier" && profile.id && profile.currentActiveTripId === trip.id) {
//         const userRef = doc(firestore, "users", profile.id);
//         batch.update(userRef, {
//           currentActiveTripId: null,
//           updatedAt: serverTimestamp(),
//         });
//       }

//       await batch.commit();

//       toast({ title: t("common.success") });
//       return "cancelled";
//     } catch (error: any) {
//       toast({
//         variant: "destructive",
//         title: t("common.error"),
//         description: getSovereignMessage(error.message),
//       });
//       return "error";
//     } finally {
//       setIsProcessing(null);
//     }
//   };
//   const editTrip = async (trip: Trip, data: EditTripFormValues): Promise<boolean> => {
//     if (!firestore) return false;
//     if (trip.bookingIds && trip.bookingIds.length > 0) {
//       toast({
//         variant: "destructive",
//         title: "لا يمكن التعديل",
//         description: "لا يمكن تعديل الرحلة بعد تأكيد أول حجز.",
//       });
//       return false;
//     }
//     setIsProcessing(`edit-${trip.id}`);

//     try {
//       await updateDoc(doc(firestore, "trips", trip.id), {
//         departureDate: Timestamp.fromDate(new Date(data.departureDate)),
//         price: Number(data.price),
//         availableSeats: Number(data.availableSeats),
//         updatedAt: serverTimestamp(),
//       });
//       toast({ title: t("common.success") });
//       return true;
//     } catch (error: any) {
//       SovereignBlackBox.reportLethalCrash(error, "EDIT_TRIP_RUPTURE", { tripId: trip.id });
//       toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
//       return false;
//     } finally {
//       setIsProcessing(null);
//     }
//   };

//   return { isProcessing, completeTrip, travelerConfirmArrival, cancelTrip, editTrip, verifyBookingReceipt };
// }

"use client";

/**
 * @hook useTripActions
 * @description THE OPERATIONAL ENGINE (REINFORCED - SC-806 V6.6 - PROTOCOL 20)
 * [SCR-061]: Injected verifyBookingReceipt for Carrier Handshake.
 * [PROTOCOL 20]: Immune system integration. No swallowed exceptions.
 */

import { useState } from "react";
import { useFirestore, useFunctions } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { useUserProfile } from "@/hooks/use-user-profile";
import { doc, serverTimestamp, Timestamp, updateDoc, runTransaction, increment, writeBatch } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import type { Trip, Booking } from "@/lib/data";
import { type EditTripFormValues } from "@/components/carrier/edit-trip-dialog";
import { useTranslations } from "next-intl";
import { SovereignBlackBox } from "@/lib/sovereign-monitor";
export function useTripActions() {
  const firestore = useFirestore();
  const functions = useFunctions();
  const { toast } = useToast();
  const t = useTranslations();
  const tError = useTranslations("errorDictionary");
  const { profile } = useUserProfile();
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const getSovereignMessage = (code: string) => {
    const normalizedCode = code?.toUpperCase() || "DEFAULT";
    try {
      const message = tError(normalizedCode);
      return message === normalizedCode ? tError("DEFAULT") : message;
    } catch {
      return tError("DEFAULT");
    }
  };

  /**
   * verifyBookingReceipt
   * [SCR-061]: Sovereign Handshake Finalization. Carrier authenticates the Voucher.
   */
  const verifyBookingReceipt = async (booking: Booking) => {
    if (!firestore || !profile) return;
    setIsProcessing(`verify-${booking.id}`);
    try {
      await runTransaction(firestore, async (transaction) => {
        const bookingRef = doc(firestore, "bookings", booking.id);
        const passengerTripRef = doc(firestore, "trips", booking.tripId);
        const carrierTripId = booking.carrierTripId;
        const carrierTripRef = carrierTripId ? doc(firestore, "trips", carrierTripId) : null;

        // 1. Confirm Receipt & Seal Booking
        transaction.update(bookingRef, {
          status: "Confirmed",
          verifiedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        // الكراسي اتخصمت بالفعل لما المسافر دفع العربون في confirm-booking
        // مش محتاجين نخصم هنا تاني
      });

      toast({ title: "تم تأكيد استلام العربون! ✅", description: "أصبح الحجز مؤكداً والمقاعد محجوزة الآن." });
    } catch (error: any) {
      SovereignBlackBox.reportLethalCrash(error, "VERIFY_RECEIPT_RUPTURE", { bookingId: booking.id });
      toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
    } finally {
      setIsProcessing(null);
    }
  };

  const completeTrip = async (trip: Trip) => {
    if (!functions || trip.status === "Completed" || !profile) return;
    setIsProcessing(`complete-${trip.id}`);
    try {
      if (firestore && profile.id) {
        await updateDoc(doc(firestore, "users", profile.id), {
          currentActiveTripId: null,
          updatedAt: serverTimestamp(),
        });
      }

      const completeFn = httpsCallable(functions, "confirmArrivalSovereign");
      await completeFn({ tripId: trip.id });

      toast({ title: t("common.success") });
    } catch (error: any) {
      SovereignBlackBox.reportLethalCrash(error, "COMPLETE_TRIP_RUPTURE", { tripId: trip.id });
      toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
    } finally {
      setIsProcessing(null);
    }
  };

  const travelerConfirmArrival = async (tripId: string) => {
    if (!functions) return;
    setIsProcessing(`traveler-confirm-${tripId}`);
    try {
      const confirmFn = httpsCallable(functions, "confirmArrivalSovereign");
      await confirmFn({ tripId });
      toast({ title: t("common.success") });
    } catch (error: any) {
      SovereignBlackBox.reportLethalCrash(error, "TRAVELER_ARRIVAL_CONFIRM_RUPTURE", { tripId });
      toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
    } finally {
      setIsProcessing(null);
    }
  };

  // const cancelTrip = async (trip: Trip, booking?: Booking): Promise<"cancelled" | "error"> => {
  //   if (!functions) return "error";
  //   const bookingId = booking?.id;
  //   const cancelledBy = profile?.role === "carrier" ? "carrier" : "traveler";
  //   setIsProcessing(`cancel-${bookingId || trip.id}`);
  //   try {
  //     const cancelFn = httpsCallable(functions, "cancelBookingSovereign");
  //     await cancelFn({
  //       bookingId,
  //       reason: cancelledBy === "carrier" ? "إلغاء من طرف الناقل" : "إلغاء من طرف المسافر",
  //       cancelledBy,
  //     });
  //     toast({ title: t("common.success") });
  //     return "cancelled";
  //   } catch (error: any) {
  //     SovereignBlackBox.reportLethalCrash(error, "CANCEL_TRIP_RUPTURE", { tripId: trip.id, bookingId });
  //     toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
  //     return "error";
  //   } finally {
  //     setIsProcessing(null);
  //   }
  // };

  // const cancelTrip = async (trip: Trip, booking?: Booking): Promise<"cancelled" | "error"> => {
  //   const cancelledBy = profile?.role === "carrier" ? "carrier" : "traveler";
  //   setIsProcessing(`cancel-${booking?.id || trip.id}`);

  //   try {
  //     // TRIP cancellation path: do it directly in Firestore
  //     if (!booking) {
  //       if (!firestore) return "error";

  //       await updateDoc(doc(firestore, "trips", trip.id), {
  //         status: "Cancelled",
  //         cancelReason: cancelledBy === "carrier" ? "إلغاء من طرف الناقل" : "إلغاء من طرف المسافر",
  //         cancelledBy,
  //         cancelledAt: serverTimestamp(),
  //         updatedAt: serverTimestamp(),
  //       });

  //       if (profile?.role === "carrier" && profile.id) {
  //         await updateDoc(doc(firestore, "users", profile.id), {
  //           currentActiveTripId: null,
  //           updatedAt: serverTimestamp(),
  //         });
  //       }

  //       toast({ title: t("common.success") });
  //       return "cancelled";
  //     }

  //     // BOOKING cancellation path: leave as callable for now
  //     if (!functions) return "error";

  //     const cancelFn = httpsCallable(functions, "cancelBookingSovereign");
  //     await cancelFn({
  //       bookingId: booking.id,
  //       reason: cancelledBy === "carrier" ? "إلغاء من طرف الناقل" : "إلغاء من طرف المسافر",
  //       cancelledBy,
  //     });

  //     toast({ title: t("common.success") });
  //     return "cancelled";
  //   } catch (error: any) {
  //     toast({
  //       variant: "destructive",
  //       title: t("common.error"),
  //       description: getSovereignMessage(error.message),
  //     });
  //     return "error";
  //   } finally {
  //     setIsProcessing(null);
  //   }
  // };
  const cancelTrip = async (trip: Trip, booking?: Booking): Promise<"cancelled" | "error"> => {
    const cancelledBy = profile?.role === "carrier" ? "carrier" : "traveler";
    setIsProcessing(`cancel-${booking?.id || trip.id}`);

    try {
      // Booking cancel stays callable
      if (booking) {
        if (!functions) return "error";

        const cancelFn = httpsCallable(functions, "cancelBookingSovereign");
        await cancelFn({
          bookingId: booking.id,
          reason: cancelledBy === "carrier" ? "إلغاء من طرف الناقل" : "إلغاء من طرف المسافر",
          cancelledBy,
        });

        toast({ title: t("common.success") });
        return "cancelled";
      }

      // Trip cancel = direct Firestore batch
      if (!firestore) return "error";

      const batch = writeBatch(firestore);
      const tripRef = doc(firestore, "trips", trip.id);

      batch.update(tripRef, {
        status: "Cancelled",
        cancelReason: cancelledBy === "carrier" ? "إلغاء من طرف الناقل" : "إلغاء من طرف المسافر",
        cancelledBy,
        cancelledAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      if (profile?.role === "carrier" && profile.id && profile.currentActiveTripId === trip.id) {
        const userRef = doc(firestore, "users", profile.id);
        batch.update(userRef, {
          currentActiveTripId: null,
          updatedAt: serverTimestamp(),
        });
      }

      await batch.commit();

      toast({ title: t("common.success") });
      return "cancelled";
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t("common.error"),
        description: getSovereignMessage(error.message),
      });
      return "error";
    } finally {
      setIsProcessing(null);
    }
  };
  const editTrip = async (trip: Trip, data: EditTripFormValues): Promise<boolean> => {
    if (!firestore) return false;
    if (trip.bookingIds && trip.bookingIds.length > 0) {
      toast({
        variant: "destructive",
        title: "لا يمكن التعديل",
        description: "لا يمكن تعديل الرحلة بعد تأكيد أول حجز.",
      });
      return false;
    }
    setIsProcessing(`edit-${trip.id}`);

    try {
      await updateDoc(doc(firestore, "trips", trip.id), {
        departureDate: Timestamp.fromDate(new Date(data.departureDate)),
        price: Number(data.price),
        availableSeats: Number(data.availableSeats),
        updatedAt: serverTimestamp(),
      });
      toast({ title: t("common.success") });
      return true;
    } catch (error: any) {
      SovereignBlackBox.reportLethalCrash(error, "EDIT_TRIP_RUPTURE", { tripId: trip.id });
      toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
      return false;
    } finally {
      setIsProcessing(null);
    }
  };

  return { isProcessing, completeTrip, travelerConfirmArrival, cancelTrip, editTrip, verifyBookingReceipt };
}
