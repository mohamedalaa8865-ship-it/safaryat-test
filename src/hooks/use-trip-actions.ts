// // // // // // // // // "use client";

// // // // // // // // // import { useState } from "react";
// // // // // // // // // import { useFirestore, useFunctions } from "@/firebase";
// // // // // // // // // import { useToast } from "@/hooks/use-toast";
// // // // // // // // // import { useUserProfile } from "@/hooks/use-user-profile";
// // // // // // // // // import { doc, serverTimestamp, Timestamp, updateDoc } from "firebase/firestore";
// // // // // // // // // import { httpsCallable } from "firebase/functions";
// // // // // // // // // import type { Trip, Booking } from "@/lib/data";
// // // // // // // // // import { type EditTripFormValues } from "@/components/carrier/edit-trip-dialog";
// // // // // // // // // import { useTranslations } from "next-intl";

// // // // // // // // // /**
// // // // // // // // //  * @hook useTripActions
// // // // // // // // //  * @description THE OPERATIONAL ENGINE (REINFORCED - SC-806 V5.7)
// // // // // // // // //  * [SC-806 V5.7]: Substantiating operational commands via Cloud Artery.
// // // // // // // // //  * Protocol 16: Sterilized error handling.
// // // // // // // // //  */
// // // // // // // // // export function useTripActions() {
// // // // // // // // //   const firestore = useFirestore();
// // // // // // // // //   const functions = useFunctions();
// // // // // // // // //   const { toast } = useToast();
// // // // // // // // //   const t = useTranslations();
// // // // // // // // //   const tError = useTranslations("errorDictionary");
// // // // // // // // //   const { profile } = useUserProfile();
// // // // // // // // //   const [isProcessing, setIsProcessing] = useState<string | null>(null);

// // // // // // // // //   /**
// // // // // // // // //    * @function getSovereignMessage
// // // // // // // // //    * @description RESOLVES SSOT ERROR CODES (DIAMOND ALIGNMENT)
// // // // // // // // //    */
// // // // // // // // //   const getSovereignMessage = (code: string) => {
// // // // // // // // //     const normalizedCode = code?.toUpperCase() || "DEFAULT";
// // // // // // // // //     try {
// // // // // // // // //       const message = tError(normalizedCode);
// // // // // // // // //       if (message === normalizedCode) return tError("DEFAULT");
// // // // // // // // //       return message;
// // // // // // // // //     } catch {
// // // // // // // // //       return tError("DEFAULT");
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   const completeTrip = async (trip: Trip) => {
// // // // // // // // //     if (!functions || trip.status === "Completed" || !profile) return;
// // // // // // // // //     setIsProcessing(`complete-${trip.id}`);
// // // // // // // // //     try {
// // // // // // // // //       // ✅ امسح أولاً قبل الـ function عشان لو فشلت مش يبقى مقفول
// // // // // // // // //       if (firestore && profile.id) {
// // // // // // // // //         await updateDoc(doc(firestore, "users", profile.id), {
// // // // // // // // //           currentActiveTripId: null,
// // // // // // // // //           updatedAt: serverTimestamp(),
// // // // // // // // //         });
// // // // // // // // //       }

// // // // // // // // //       const completeFn = httpsCallable(functions, "confirmArrivalSovereign");
// // // // // // // // //       await completeFn({ tripId: trip.id });

// // // // // // // // //       toast({ title: t("common.success") });
// // // // // // // // //     } catch (error: any) {
// // // // // // // // //       toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
// // // // // // // // //     } finally {
// // // // // // // // //       setIsProcessing(null);
// // // // // // // // //     }
// // // // // // // // //   };
// // // // // // // // //   const travelerConfirmArrival = async (tripId: string) => {
// // // // // // // // //     if (!functions) return;
// // // // // // // // //     setIsProcessing(`traveler-confirm-${tripId}`);
// // // // // // // // //     try {
// // // // // // // // //       const confirmFn = httpsCallable(functions, "confirmArrivalSovereign");
// // // // // // // // //       await confirmFn({ tripId });
// // // // // // // // //       toast({ title: t("common.success") });
// // // // // // // // //     } catch (error: any) {
// // // // // // // // //       toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
// // // // // // // // //     } finally {
// // // // // // // // //       setIsProcessing(null);
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   const cancelTrip = async (trip: Trip, booking?: Booking): Promise<"cancelled" | "error"> => {
// // // // // // // // //     if (!functions) return "error";
// // // // // // // // //     const bookingId = booking?.id;
// // // // // // // // //     const cancelledBy = profile?.role === "carrier" ? "carrier" : "traveler";
// // // // // // // // //     setIsProcessing(`cancel-${bookingId || trip.id}`);
// // // // // // // // //     try {
// // // // // // // // //       const cancelFn = httpsCallable(functions, "cancelBookingSovereign");
// // // // // // // // //       await cancelFn({
// // // // // // // // //         bookingId,
// // // // // // // // //         reason: cancelledBy === "carrier" ? "إلغاء من طرف الناقل" : "إلغاء من طرف المسافر",
// // // // // // // // //         cancelledBy,
// // // // // // // // //       });
// // // // // // // // //       toast({ title: t("common.success") });
// // // // // // // // //       return "cancelled";
// // // // // // // // //     } catch (error: any) {
// // // // // // // // //       toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
// // // // // // // // //       return "error";
// // // // // // // // //     } finally {
// // // // // // // // //       setIsProcessing(null);
// // // // // // // // //     }
// // // // // // // // //   };
// // // // // // // // //   const editTrip = async (trip: Trip, data: EditTripFormValues): Promise<boolean> => {
// // // // // // // // //     if (!firestore) return false;
// // // // // // // // //     if (trip.bookingIds && trip.bookingIds.length > 0) {
// // // // // // // // //       toast({
// // // // // // // // //         variant: "destructive",
// // // // // // // // //         title: "لا يمكن التعديل",
// // // // // // // // //         description: "لا يمكن تعديل الرحلة بعد تأكيد أول حجز.",
// // // // // // // // //       });
// // // // // // // // //       return false;
// // // // // // // // //     }
// // // // // // // // //     setIsProcessing(`edit-${trip.id}`);

// // // // // // // // //     try {
// // // // // // // // //       await updateDoc(doc(firestore, "trips", trip.id), {
// // // // // // // // //         status: trip.status, // ✅ احتفظ بالـ status الأصلي مش "Planned" ثابت
// // // // // // // // //         departureDate: Timestamp.fromDate(new Date(data.departureDate)), // ✅ Timestamp
// // // // // // // // //         price: Number(data.price), // ✅ number
// // // // // // // // //         availableSeats: Number(data.availableSeats),
// // // // // // // // //         updatedAt: serverTimestamp(),
// // // // // // // // //       });
// // // // // // // // //       // await updateDoc(doc(firestore, "trips", trip.id), {
// // // // // // // // //       //   // ...data,
// // // // // // // // //       //   // status: trip.status,
// // // // // // // // //       //   // status: "Planned", // ✅ ثابت مش من trip.status
// // // // // // // // //       //   // departureDate: data.departureDate.toISOString(),
// // // // // // // // //       //   // departureDate: new Date(data.departureDate).toISOString(),
// // // // // // // // //       //   // price: Number(data.price),
// // // // // // // // //       //   // departureDate: data.departureDate.toISOString(), // ✅ String
// // // // // // // // //       //   departureDate: Timestamp.fromDate(new Date(data.departureDate)),
// // // // // // // // //       //   price: Number(data.price), // ✅ String
// // // // // // // // //       //   availableSeats: Number(data.availableSeats), // seats منطقي تبقى رقم
// // // // // // // // //       //   updatedAt: serverTimestamp(),

// // // // // // // // //       //   // availableSeats: Number(data.availableSeats),
// // // // // // // // //       //   // updatedAt: serverTimestamp(),
// // // // // // // // //       // });
// // // // // // // // //       toast({ title: t("common.success" + { updateDoc }) });
// // // // // // // // //       return true;
// // // // // // // // //     } catch (error: any) {
// // // // // // // // //       toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
// // // // // // // // //       return false;
// // // // // // // // //     } finally {
// // // // // // // // //       setIsProcessing(null);
// // // // // // // // //     }
// // // // // // // // //   };
// // // // // // // // //   const changeSeats = async (trip: Trip, delta: number) => {
// // // // // // // // //     if (!firestore) return;
// // // // // // // // //     const newSeats = (trip.availableSeats || 0) + delta;
// // // // // // // // //     if (newSeats < 0) return;
// // // // // // // // //     setIsProcessing(`seats-${trip.id}`);
// // // // // // // // //     try {
// // // // // // // // //       await updateDoc(doc(firestore, "trips", trip.id), {
// // // // // // // // //         availableSeats: newSeats,
// // // // // // // // //         updatedAt: serverTimestamp(),
// // // // // // // // //       });
// // // // // // // // //     } catch (error: any) {
// // // // // // // // //       toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
// // // // // // // // //     } finally {
// // // // // // // // //       setIsProcessing(null);
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   return { isProcessing, completeTrip, travelerConfirmArrival, cancelTrip, editTrip, changeSeats };
// // // // // // // // // }
// // // // // // // // "use client";

// // // // // // // // /**
// // // // // // // //  * @hook useTripActions
// // // // // // // //  * @description THE OPERATIONAL ENGINE (REINFORCED - SC-806 V6.6 - PROTOCOL 20)
// // // // // // // //  * [SCR-061]: Injected verifyBookingReceipt for Carrier Handshake.
// // // // // // // //  * [PROTOCOL 20]: Immune system integration. No swallowed exceptions.
// // // // // // // //  */

// // // // // // // // import { useState } from "react";
// // // // // // // // import { useFirestore, useFunctions } from "@/firebase";
// // // // // // // // import { useToast } from "@/hooks/use-toast";
// // // // // // // // import { useUserProfile } from "@/hooks/use-user-profile";
// // // // // // // // import { doc, serverTimestamp, Timestamp, updateDoc, runTransaction, increment, writeBatch } from "firebase/firestore";
// // // // // // // // import { httpsCallable } from "firebase/functions";
// // // // // // // // import type { Trip, Booking } from "@/lib/data";
// // // // // // // // import { type EditTripFormValues } from "@/components/carrier/edit-trip-dialog";
// // // // // // // // import { useTranslations } from "next-intl";
// // // // // // // // import { SovereignBlackBox } from "@/lib/sovereign-monitor";
// // // // // // // // export function useTripActions() {
// // // // // // // //   const firestore = useFirestore();
// // // // // // // //   const functions = useFunctions();
// // // // // // // //   const { toast } = useToast();
// // // // // // // //   const t = useTranslations();
// // // // // // // //   const tError = useTranslations("errorDictionary");
// // // // // // // //   const { profile } = useUserProfile();
// // // // // // // //   const [isProcessing, setIsProcessing] = useState<string | null>(null);

// // // // // // // //   const getSovereignMessage = (code: string) => {
// // // // // // // //     const normalizedCode = code?.toUpperCase() || "DEFAULT";
// // // // // // // //     try {
// // // // // // // //       const message = tError(normalizedCode);
// // // // // // // //       return message === normalizedCode ? tError("DEFAULT") : message;
// // // // // // // //     } catch {
// // // // // // // //       return tError("DEFAULT");
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   /**
// // // // // // // //    * verifyBookingReceipt
// // // // // // // //    * [SCR-061]: Sovereign Handshake Finalization. Carrier authenticates the Voucher.
// // // // // // // //    */
// // // // // // // //   const verifyBookingReceipt = async (booking: Booking) => {
// // // // // // // //     if (!firestore || !profile) return;
// // // // // // // //     setIsProcessing(`verify-${booking.id}`);
// // // // // // // //     try {
// // // // // // // //       await runTransaction(firestore, async (transaction) => {
// // // // // // // //         const bookingRef = doc(firestore, "bookings", booking.id);
// // // // // // // //         const passengerTripRef = doc(firestore, "trips", booking.tripId);
// // // // // // // //         const carrierTripId = booking.carrierTripId;
// // // // // // // //         const carrierTripRef = carrierTripId ? doc(firestore, "trips", carrierTripId) : null;

// // // // // // // //         // 1. Confirm Receipt & Seal Booking
// // // // // // // //         transaction.update(bookingRef, {
// // // // // // // //           status: "Confirmed",
// // // // // // // //           verifiedAt: serverTimestamp(),
// // // // // // // //           updatedAt: serverTimestamp(),
// // // // // // // //         });

// // // // // // // //         // 2. Atomic Seat Reduction (Source Request)
// // // // // // // //         transaction.update(passengerTripRef, {
// // // // // // // //           availableSeats: increment(-booking.seats),
// // // // // // // //           updatedAt: serverTimestamp(),
// // // // // // // //         });

// // // // // // // //         // 3. Atomic Seat Reduction (Carrier Scheduled Trip)
// // // // // // // //         if (carrierTripRef) {
// // // // // // // //           transaction.update(carrierTripRef, {
// // // // // // // //             availableSeats: increment(-booking.seats),
// // // // // // // //             updatedAt: serverTimestamp(),
// // // // // // // //           });
// // // // // // // //         }
// // // // // // // //       });

// // // // // // // //       toast({ title: "تم تأكيد استلام العربون! ✅", description: "أصبح الحجز مؤكداً والمقاعد محجوزة الآن." });
// // // // // // // //     } catch (error: any) {
// // // // // // // //       SovereignBlackBox.reportLethalCrash(error, "VERIFY_RECEIPT_RUPTURE", { bookingId: booking.id });
// // // // // // // //       toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
// // // // // // // //     } finally {
// // // // // // // //       setIsProcessing(null);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   const completeTrip = async (trip: Trip) => {
// // // // // // // //     if (!functions || trip.status === "Completed" || !profile) return;
// // // // // // // //     setIsProcessing(`complete-${trip.id}`);
// // // // // // // //     try {
// // // // // // // //       if (firestore && profile.id) {
// // // // // // // //         await updateDoc(doc(firestore, "users", profile.id), {
// // // // // // // //           currentActiveTripId: null,
// // // // // // // //           updatedAt: serverTimestamp(),
// // // // // // // //         });
// // // // // // // //       }

// // // // // // // //       const completeFn = httpsCallable(functions, "confirmArrivalSovereign");
// // // // // // // //       await completeFn({ tripId: trip.id });

// // // // // // // //       toast({ title: t("common.success") });
// // // // // // // //     } catch (error: any) {
// // // // // // // //       SovereignBlackBox.reportLethalCrash(error, "COMPLETE_TRIP_RUPTURE", { tripId: trip.id });
// // // // // // // //       toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
// // // // // // // //     } finally {
// // // // // // // //       setIsProcessing(null);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   const travelerConfirmArrival = async (tripId: string) => {
// // // // // // // //     if (!functions) return;
// // // // // // // //     setIsProcessing(`traveler-confirm-${tripId}`);
// // // // // // // //     try {
// // // // // // // //       const confirmFn = httpsCallable(functions, "confirmArrivalSovereign");
// // // // // // // //       await confirmFn({ tripId });
// // // // // // // //       toast({ title: t("common.success") });
// // // // // // // //     } catch (error: any) {
// // // // // // // //       SovereignBlackBox.reportLethalCrash(error, "TRAVELER_ARRIVAL_CONFIRM_RUPTURE", { tripId });
// // // // // // // //       toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
// // // // // // // //     } finally {
// // // // // // // //       setIsProcessing(null);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   // const cancelTrip = async (trip: Trip, booking?: Booking): Promise<"cancelled" | "error"> => {
// // // // // // // //   //   if (!functions) return "error";
// // // // // // // //   //   const bookingId = booking?.id;
// // // // // // // //   //   const cancelledBy = profile?.role === "carrier" ? "carrier" : "traveler";
// // // // // // // //   //   setIsProcessing(`cancel-${bookingId || trip.id}`);
// // // // // // // //   //   try {
// // // // // // // //   //     const cancelFn = httpsCallable(functions, "cancelBookingSovereign");
// // // // // // // //   //     await cancelFn({
// // // // // // // //   //       bookingId,
// // // // // // // //   //       reason: cancelledBy === "carrier" ? "إلغاء من طرف الناقل" : "إلغاء من طرف المسافر",
// // // // // // // //   //       cancelledBy,
// // // // // // // //   //     });
// // // // // // // //   //     toast({ title: t("common.success") });
// // // // // // // //   //     return "cancelled";
// // // // // // // //   //   } catch (error: any) {
// // // // // // // //   //     SovereignBlackBox.reportLethalCrash(error, "CANCEL_TRIP_RUPTURE", { tripId: trip.id, bookingId });
// // // // // // // //   //     toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
// // // // // // // //   //     return "error";
// // // // // // // //   //   } finally {
// // // // // // // //   //     setIsProcessing(null);
// // // // // // // //   //   }
// // // // // // // //   // };

// // // // // // // //   // const cancelTrip = async (trip: Trip, booking?: Booking): Promise<"cancelled" | "error"> => {
// // // // // // // //   //   const cancelledBy = profile?.role === "carrier" ? "carrier" : "traveler";
// // // // // // // //   //   setIsProcessing(`cancel-${booking?.id || trip.id}`);

// // // // // // // //   //   try {
// // // // // // // //   //     // TRIP cancellation path: do it directly in Firestore
// // // // // // // //   //     if (!booking) {
// // // // // // // //   //       if (!firestore) return "error";

// // // // // // // //   //       await updateDoc(doc(firestore, "trips", trip.id), {
// // // // // // // //   //         status: "Cancelled",
// // // // // // // //   //         cancelReason: cancelledBy === "carrier" ? "إلغاء من طرف الناقل" : "إلغاء من طرف المسافر",
// // // // // // // //   //         cancelledBy,
// // // // // // // //   //         cancelledAt: serverTimestamp(),
// // // // // // // //   //         updatedAt: serverTimestamp(),
// // // // // // // //   //       });

// // // // // // // //   //       if (profile?.role === "carrier" && profile.id) {
// // // // // // // //   //         await updateDoc(doc(firestore, "users", profile.id), {
// // // // // // // //   //           currentActiveTripId: null,
// // // // // // // //   //           updatedAt: serverTimestamp(),
// // // // // // // //   //         });
// // // // // // // //   //       }

// // // // // // // //   //       toast({ title: t("common.success") });
// // // // // // // //   //       return "cancelled";
// // // // // // // //   //     }

// // // // // // // //   //     // BOOKING cancellation path: leave as callable for now
// // // // // // // //   //     if (!functions) return "error";

// // // // // // // //   //     const cancelFn = httpsCallable(functions, "cancelBookingSovereign");
// // // // // // // //   //     await cancelFn({
// // // // // // // //   //       bookingId: booking.id,
// // // // // // // //   //       reason: cancelledBy === "carrier" ? "إلغاء من طرف الناقل" : "إلغاء من طرف المسافر",
// // // // // // // //   //       cancelledBy,
// // // // // // // //   //     });

// // // // // // // //   //     toast({ title: t("common.success") });
// // // // // // // //   //     return "cancelled";
// // // // // // // //   //   } catch (error: any) {
// // // // // // // //   //     toast({
// // // // // // // //   //       variant: "destructive",
// // // // // // // //   //       title: t("common.error"),
// // // // // // // //   //       description: getSovereignMessage(error.message),
// // // // // // // //   //     });
// // // // // // // //   //     return "error";
// // // // // // // //   //   } finally {
// // // // // // // //   //     setIsProcessing(null);
// // // // // // // //   //   }
// // // // // // // //   // };
// // // // // // // //   const cancelTrip = async (trip: Trip, booking?: Booking): Promise<"cancelled" | "error"> => {
// // // // // // // //     const cancelledBy = profile?.role === "carrier" ? "carrier" : "traveler";
// // // // // // // //     setIsProcessing(`cancel-${booking?.id || trip.id}`);

// // // // // // // //     try {
// // // // // // // //       // Booking cancel stays callable
// // // // // // // //       if (booking) {
// // // // // // // //         if (!functions) return "error";

// // // // // // // //         const cancelFn = httpsCallable(functions, "cancelBookingSovereign");
// // // // // // // //         await cancelFn({
// // // // // // // //           bookingId: booking.id,
// // // // // // // //           reason: cancelledBy === "carrier" ? "إلغاء من طرف الناقل" : "إلغاء من طرف المسافر",
// // // // // // // //           cancelledBy,
// // // // // // // //         });

// // // // // // // //         toast({ title: t("common.success") });
// // // // // // // //         return "cancelled";
// // // // // // // //       }

// // // // // // // //       // Trip cancel = direct Firestore batch
// // // // // // // //       if (!firestore) return "error";

// // // // // // // //       const batch = writeBatch(firestore);
// // // // // // // //       const tripRef = doc(firestore, "trips", trip.id);

// // // // // // // //       batch.update(tripRef, {
// // // // // // // //         status: "Cancelled",
// // // // // // // //         cancelReason: cancelledBy === "carrier" ? "إلغاء من طرف الناقل" : "إلغاء من طرف المسافر",
// // // // // // // //         cancelledBy,
// // // // // // // //         cancelledAt: serverTimestamp(),
// // // // // // // //         updatedAt: serverTimestamp(),
// // // // // // // //       });

// // // // // // // //       if (profile?.role === "carrier" && profile.id && profile.currentActiveTripId === trip.id) {
// // // // // // // //         const userRef = doc(firestore, "users", profile.id);
// // // // // // // //         batch.update(userRef, {
// // // // // // // //           currentActiveTripId: null,
// // // // // // // //           updatedAt: serverTimestamp(),
// // // // // // // //         });
// // // // // // // //       }

// // // // // // // //       await batch.commit();

// // // // // // // //       toast({ title: t("common.success") });
// // // // // // // //       return "cancelled";
// // // // // // // //     } catch (error: any) {
// // // // // // // //       toast({
// // // // // // // //         variant: "destructive",
// // // // // // // //         title: t("common.error"),
// // // // // // // //         description: getSovereignMessage(error.message),
// // // // // // // //       });
// // // // // // // //       return "error";
// // // // // // // //     } finally {
// // // // // // // //       setIsProcessing(null);
// // // // // // // //     }
// // // // // // // //   };
// // // // // // // //   const editTrip = async (trip: Trip, data: EditTripFormValues): Promise<boolean> => {
// // // // // // // //     if (!firestore) return false;
// // // // // // // //     if (trip.bookingIds && trip.bookingIds.length > 0) {
// // // // // // // //       toast({
// // // // // // // //         variant: "destructive",
// // // // // // // //         title: "لا يمكن التعديل",
// // // // // // // //         description: "لا يمكن تعديل الرحلة بعد تأكيد أول حجز.",
// // // // // // // //       });
// // // // // // // //       return false;
// // // // // // // //     }
// // // // // // // //     setIsProcessing(`edit-${trip.id}`);

// // // // // // // //     try {
// // // // // // // //       await updateDoc(doc(firestore, "trips", trip.id), {
// // // // // // // //         departureDate: Timestamp.fromDate(new Date(data.departureDate)),
// // // // // // // //         price: Number(data.price),
// // // // // // // //         availableSeats: Number(data.availableSeats),
// // // // // // // //         updatedAt: serverTimestamp(),
// // // // // // // //       });
// // // // // // // //       toast({ title: t("common.success") });
// // // // // // // //       return true;
// // // // // // // //     } catch (error: any) {
// // // // // // // //       SovereignBlackBox.reportLethalCrash(error, "EDIT_TRIP_RUPTURE", { tripId: trip.id });
// // // // // // // //       toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
// // // // // // // //       return false;
// // // // // // // //     } finally {
// // // // // // // //       setIsProcessing(null);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   return { isProcessing, completeTrip, travelerConfirmArrival, cancelTrip, editTrip, verifyBookingReceipt };
// // // // // // // // }

// // // // // // // // "use client";

// // // // // // // // /**
// // // // // // // //  * @hook useTripActions
// // // // // // // //  * @description THE OPERATIONAL ENGINE (REINFORCED - SC-806 V6.6 - PROTOCOL 20)
// // // // // // // //  * [SCR-061]: Injected verifyBookingReceipt for Carrier Handshake.
// // // // // // // //  * [PROTOCOL 20]: Immune system integration. No swallowed exceptions.
// // // // // // // //  */

// // // // // // // // import { useState } from "react";
// // // // // // // // import { useFirestore, useFunctions } from "@/firebase";
// // // // // // // // import { useToast } from "@/hooks/use-toast";
// // // // // // // // import { useUserProfile } from "@/hooks/use-user-profile";
// // // // // // // // import { doc, serverTimestamp, Timestamp, updateDoc, runTransaction, increment, writeBatch } from "firebase/firestore";
// // // // // // // // import { httpsCallable } from "firebase/functions";
// // // // // // // // import type { Trip, Booking } from "@/lib/data";
// // // // // // // // import { type EditTripFormValues } from "@/components/carrier/edit-trip-dialog";
// // // // // // // // import { useTranslations } from "next-intl";
// // // // // // // // import { SovereignBlackBox } from "@/lib/sovereign-monitor";
// // // // // // // // export function useTripActions() {
// // // // // // // //   const firestore = useFirestore();
// // // // // // // //   const functions = useFunctions();
// // // // // // // //   const { toast } = useToast();
// // // // // // // //   const t = useTranslations();
// // // // // // // //   const tError = useTranslations("errorDictionary");
// // // // // // // //   const { profile } = useUserProfile();
// // // // // // // //   const [isProcessing, setIsProcessing] = useState<string | null>(null);

// // // // // // // //   const getSovereignMessage = (code: string) => {
// // // // // // // //     const normalizedCode = code?.toUpperCase() || "DEFAULT";
// // // // // // // //     try {
// // // // // // // //       const message = tError(normalizedCode);
// // // // // // // //       return message === normalizedCode ? tError("DEFAULT") : message;
// // // // // // // //     } catch {
// // // // // // // //       return tError("DEFAULT");
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   /**
// // // // // // // //    * verifyBookingReceipt
// // // // // // // //    * [SCR-061]: Sovereign Handshake Finalization. Carrier authenticates the Voucher.
// // // // // // // //    */
// // // // // // // //   const verifyBookingReceipt = async (booking: Booking) => {
// // // // // // // //     if (!firestore || !profile) return;
// // // // // // // //     setIsProcessing(`verify-${booking.id}`);
// // // // // // // //     try {
// // // // // // // //       await runTransaction(firestore, async (transaction) => {
// // // // // // // //         const bookingRef = doc(firestore, "bookings", booking.id);
// // // // // // // //         const passengerTripRef = doc(firestore, "trips", booking.tripId);
// // // // // // // //         const carrierTripId = booking.carrierTripId;
// // // // // // // //         const carrierTripRef = carrierTripId ? doc(firestore, "trips", carrierTripId) : null;

// // // // // // // //         // 1. Confirm Receipt & Seal Booking
// // // // // // // //         transaction.update(bookingRef, {
// // // // // // // //           status: "Confirmed",
// // // // // // // //           verifiedAt: serverTimestamp(),
// // // // // // // //           updatedAt: serverTimestamp(),
// // // // // // // //         });

// // // // // // // //         // الكراسي اتخصمت بالفعل لما المسافر دفع العربون في confirm-booking
// // // // // // // //         // مش محتاجين نخصم هنا تاني
// // // // // // // //       });

// // // // // // // //       toast({ title: "تم تأكيد استلام العربون! ✅", description: "أصبح الحجز مؤكداً والمقاعد محجوزة الآن." });
// // // // // // // //     } catch (error: any) {
// // // // // // // //       SovereignBlackBox.reportLethalCrash(error, "VERIFY_RECEIPT_RUPTURE", { bookingId: booking.id });
// // // // // // // //       toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
// // // // // // // //     } finally {
// // // // // // // //       setIsProcessing(null);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   const completeTrip = async (trip: Trip) => {
// // // // // // // //     if (!functions || trip.status === "Completed" || !profile) return;
// // // // // // // //     setIsProcessing(`complete-${trip.id}`);
// // // // // // // //     try {
// // // // // // // //       if (firestore && profile.id) {
// // // // // // // //         await updateDoc(doc(firestore, "users", profile.id), {
// // // // // // // //           currentActiveTripId: null,
// // // // // // // //           updatedAt: serverTimestamp(),
// // // // // // // //         });
// // // // // // // //       }

// // // // // // // //       const completeFn = httpsCallable(functions, "confirmArrivalSovereign");
// // // // // // // //       await completeFn({ tripId: trip.id });

// // // // // // // //       toast({ title: t("common.success") });
// // // // // // // //     } catch (error: any) {
// // // // // // // //       SovereignBlackBox.reportLethalCrash(error, "COMPLETE_TRIP_RUPTURE", { tripId: trip.id });
// // // // // // // //       toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
// // // // // // // //     } finally {
// // // // // // // //       setIsProcessing(null);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   const travelerConfirmArrival = async (tripId: string) => {
// // // // // // // //     if (!functions) return;
// // // // // // // //     setIsProcessing(`traveler-confirm-${tripId}`);
// // // // // // // //     try {
// // // // // // // //       const confirmFn = httpsCallable(functions, "confirmArrivalSovereign");
// // // // // // // //       await confirmFn({ tripId });
// // // // // // // //       toast({ title: t("common.success") });
// // // // // // // //     } catch (error: any) {
// // // // // // // //       SovereignBlackBox.reportLethalCrash(error, "TRAVELER_ARRIVAL_CONFIRM_RUPTURE", { tripId });
// // // // // // // //       toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
// // // // // // // //     } finally {
// // // // // // // //       setIsProcessing(null);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   // const cancelTrip = async (trip: Trip, booking?: Booking): Promise<"cancelled" | "error"> => {
// // // // // // // //   //   if (!functions) return "error";
// // // // // // // //   //   const bookingId = booking?.id;
// // // // // // // //   //   const cancelledBy = profile?.role === "carrier" ? "carrier" : "traveler";
// // // // // // // //   //   setIsProcessing(`cancel-${bookingId || trip.id}`);
// // // // // // // //   //   try {
// // // // // // // //   //     const cancelFn = httpsCallable(functions, "cancelBookingSovereign");
// // // // // // // //   //     await cancelFn({
// // // // // // // //   //       bookingId,
// // // // // // // //   //       reason: cancelledBy === "carrier" ? "إلغاء من طرف الناقل" : "إلغاء من طرف المسافر",
// // // // // // // //   //       cancelledBy,
// // // // // // // //   //     });
// // // // // // // //   //     toast({ title: t("common.success") });
// // // // // // // //   //     return "cancelled";
// // // // // // // //   //   } catch (error: any) {
// // // // // // // //   //     SovereignBlackBox.reportLethalCrash(error, "CANCEL_TRIP_RUPTURE", { tripId: trip.id, bookingId });
// // // // // // // //   //     toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
// // // // // // // //   //     return "error";
// // // // // // // //   //   } finally {
// // // // // // // //   //     setIsProcessing(null);
// // // // // // // //   //   }
// // // // // // // //   // };

// // // // // // // //   // const cancelTrip = async (trip: Trip, booking?: Booking): Promise<"cancelled" | "error"> => {
// // // // // // // //   //   const cancelledBy = profile?.role === "carrier" ? "carrier" : "traveler";
// // // // // // // //   //   setIsProcessing(`cancel-${booking?.id || trip.id}`);

// // // // // // // //   //   try {
// // // // // // // //   //     // TRIP cancellation path: do it directly in Firestore
// // // // // // // //   //     if (!booking) {
// // // // // // // //   //       if (!firestore) return "error";

// // // // // // // //   //       await updateDoc(doc(firestore, "trips", trip.id), {
// // // // // // // //   //         status: "Cancelled",
// // // // // // // //   //         cancelReason: cancelledBy === "carrier" ? "إلغاء من طرف الناقل" : "إلغاء من طرف المسافر",
// // // // // // // //   //         cancelledBy,
// // // // // // // //   //         cancelledAt: serverTimestamp(),
// // // // // // // //   //         updatedAt: serverTimestamp(),
// // // // // // // //   //       });

// // // // // // // //   //       if (profile?.role === "carrier" && profile.id) {
// // // // // // // //   //         await updateDoc(doc(firestore, "users", profile.id), {
// // // // // // // //   //           currentActiveTripId: null,
// // // // // // // //   //           updatedAt: serverTimestamp(),
// // // // // // // //   //         });
// // // // // // // //   //       }

// // // // // // // //   //       toast({ title: t("common.success") });
// // // // // // // //   //       return "cancelled";
// // // // // // // //   //     }

// // // // // // // //   //     // BOOKING cancellation path: leave as callable for now
// // // // // // // //   //     if (!functions) return "error";

// // // // // // // //   //     const cancelFn = httpsCallable(functions, "cancelBookingSovereign");
// // // // // // // //   //     await cancelFn({
// // // // // // // //   //       bookingId: booking.id,
// // // // // // // //   //       reason: cancelledBy === "carrier" ? "إلغاء من طرف الناقل" : "إلغاء من طرف المسافر",
// // // // // // // //   //       cancelledBy,
// // // // // // // //   //     });

// // // // // // // //   //     toast({ title: t("common.success") });
// // // // // // // //   //     return "cancelled";
// // // // // // // //   //   } catch (error: any) {
// // // // // // // //   //     toast({
// // // // // // // //   //       variant: "destructive",
// // // // // // // //   //       title: t("common.error"),
// // // // // // // //   //       description: getSovereignMessage(error.message),
// // // // // // // //   //     });
// // // // // // // //   //     return "error";
// // // // // // // //   //   } finally {
// // // // // // // //   //     setIsProcessing(null);
// // // // // // // //   //   }
// // // // // // // //   // };
// // // // // // // //   const cancelTrip = async (trip: Trip, booking?: Booking): Promise<"cancelled" | "error"> => {
// // // // // // // //     const cancelledBy = profile?.role === "carrier" ? "carrier" : "traveler";
// // // // // // // //     setIsProcessing(`cancel-${booking?.id || trip.id}`);

// // // // // // // //     try {
// // // // // // // //       // Booking cancel stays callable
// // // // // // // //       if (booking) {
// // // // // // // //         if (!functions) return "error";

// // // // // // // //         const cancelFn = httpsCallable(functions, "cancelBookingSovereign");
// // // // // // // //         await cancelFn({
// // // // // // // //           bookingId: booking.id,
// // // // // // // //           reason: cancelledBy === "carrier" ? "إلغاء من طرف الناقل" : "إلغاء من طرف المسافر",
// // // // // // // //           cancelledBy,
// // // // // // // //         });

// // // // // // // //         toast({ title: t("common.success") });
// // // // // // // //         return "cancelled";
// // // // // // // //       }

// // // // // // // //       // Trip cancel = direct Firestore batch
// // // // // // // //       if (!firestore) return "error";

// // // // // // // //       const batch = writeBatch(firestore);
// // // // // // // //       const tripRef = doc(firestore, "trips", trip.id);

// // // // // // // //       batch.update(tripRef, {
// // // // // // // //         status: "Cancelled",
// // // // // // // //         cancelReason: cancelledBy === "carrier" ? "إلغاء من طرف الناقل" : "إلغاء من طرف المسافر",
// // // // // // // //         cancelledBy,
// // // // // // // //         cancelledAt: serverTimestamp(),
// // // // // // // //         updatedAt: serverTimestamp(),
// // // // // // // //       });

// // // // // // // //       if (profile?.role === "carrier" && profile.id && profile.currentActiveTripId === trip.id) {
// // // // // // // //         const userRef = doc(firestore, "users", profile.id);
// // // // // // // //         batch.update(userRef, {
// // // // // // // //           currentActiveTripId: null,
// // // // // // // //           updatedAt: serverTimestamp(),
// // // // // // // //         });
// // // // // // // //       }

// // // // // // // //       await batch.commit();

// // // // // // // //       toast({ title: t("common.success") });
// // // // // // // //       return "cancelled";
// // // // // // // //     } catch (error: any) {
// // // // // // // //       toast({
// // // // // // // //         variant: "destructive",
// // // // // // // //         title: t("common.error"),
// // // // // // // //         description: getSovereignMessage(error.message),
// // // // // // // //       });
// // // // // // // //       return "error";
// // // // // // // //     } finally {
// // // // // // // //       setIsProcessing(null);
// // // // // // // //     }
// // // // // // // //   };
// // // // // // // //   const editTrip = async (trip: Trip, data: EditTripFormValues): Promise<boolean> => {
// // // // // // // //     if (!firestore) return false;
// // // // // // // //     if (trip.bookingIds && trip.bookingIds.length > 0) {
// // // // // // // //       toast({
// // // // // // // //         variant: "destructive",
// // // // // // // //         title: "لا يمكن التعديل",
// // // // // // // //         description: "لا يمكن تعديل الرحلة بعد تأكيد أول حجز.",
// // // // // // // //       });
// // // // // // // //       return false;
// // // // // // // //     }
// // // // // // // //     setIsProcessing(`edit-${trip.id}`);

// // // // // // // //     try {
// // // // // // // //       await updateDoc(doc(firestore, "trips", trip.id), {
// // // // // // // //         departureDate: Timestamp.fromDate(new Date(data.departureDate)),
// // // // // // // //         price: Number(data.price),
// // // // // // // //         availableSeats: Number(data.availableSeats),
// // // // // // // //         updatedAt: serverTimestamp(),
// // // // // // // //       });
// // // // // // // //       toast({ title: t("common.success") });
// // // // // // // //       return true;
// // // // // // // //     } catch (error: any) {
// // // // // // // //       SovereignBlackBox.reportLethalCrash(error, "EDIT_TRIP_RUPTURE", { tripId: trip.id });
// // // // // // // //       toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
// // // // // // // //       return false;
// // // // // // // //     } finally {
// // // // // // // //       setIsProcessing(null);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   return { isProcessing, completeTrip, travelerConfirmArrival, cancelTrip, editTrip, verifyBookingReceipt };
// // // // // // // // }

// // // // // // // "use client";

// // // // // // // /**
// // // // // // //  * @hook useTripActions
// // // // // // //  * @description THE OPERATIONAL ENGINE (REINFORCED - SC-806 V6.6 - PROTOCOL 20)
// // // // // // //  * [SCR-061]: Injected verifyBookingReceipt for Carrier Handshake.
// // // // // // //  * [PROTOCOL 20]: Immune system integration. No swallowed exceptions.
// // // // // // //  * [FIX]: Added Offer Cleanup mechanism when a Carrier cancels their trip.
// // // // // // //  */

// // // // // // // import { useState } from "react";
// // // // // // // import { useFirestore, useFunctions } from "@/firebase";
// // // // // // // import { useToast } from "@/hooks/use-toast";
// // // // // // // import { useUserProfile } from "@/hooks/use-user-profile";
// // // // // // // // ✅ أضفنا collection, query, where, getDocs هنا
// // // // // // // import {
// // // // // // //   doc,
// // // // // // //   serverTimestamp,
// // // // // // //   Timestamp,
// // // // // // //   updateDoc,
// // // // // // //   runTransaction,
// // // // // // //   increment,
// // // // // // //   writeBatch,
// // // // // // //   collection,
// // // // // // //   query,
// // // // // // //   where,
// // // // // // //   getDocs,
// // // // // // // } from "firebase/firestore";
// // // // // // // import { httpsCallable } from "firebase/functions";
// // // // // // // import type { Trip, Booking } from "@/lib/data";
// // // // // // // import { type EditTripFormValues } from "@/components/carrier/edit-trip-dialog";
// // // // // // // import { useTranslations } from "next-intl";
// // // // // // // import { SovereignBlackBox } from "@/lib/sovereign-monitor";

// // // // // // // export function useTripActions() {
// // // // // // //   const firestore = useFirestore();
// // // // // // //   const functions = useFunctions();
// // // // // // //   const { toast } = useToast();
// // // // // // //   const t = useTranslations();
// // // // // // //   const tError = useTranslations("errorDictionary");
// // // // // // //   const { profile } = useUserProfile();
// // // // // // //   const [isProcessing, setIsProcessing] = useState<string | null>(null);

// // // // // // //   const getSovereignMessage = (code: string) => {
// // // // // // //     const normalizedCode = code?.toUpperCase() || "DEFAULT";
// // // // // // //     try {
// // // // // // //       const message = tError(normalizedCode);
// // // // // // //       return message === normalizedCode ? tError("DEFAULT") : message;
// // // // // // //     } catch {
// // // // // // //       return tError("DEFAULT");
// // // // // // //     }
// // // // // // //   };

// // // // // // //   /**
// // // // // // //    * verifyBookingReceipt
// // // // // // //    * [SCR-061]: Sovereign Handshake Finalization. Carrier authenticates the Voucher.
// // // // // // //    */
// // // // // // //   const verifyBookingReceipt = async (booking: Booking) => {
// // // // // // //     if (!firestore || !profile) return;
// // // // // // //     setIsProcessing(`verify-${booking.id}`);
// // // // // // //     try {
// // // // // // //       await runTransaction(firestore, async (transaction) => {
// // // // // // //         const bookingRef = doc(firestore, "bookings", booking.id);

// // // // // // //         // 1. Confirm Receipt & Seal Booking
// // // // // // //         transaction.update(bookingRef, {
// // // // // // //           status: "Confirmed",
// // // // // // //           verifiedAt: serverTimestamp(),
// // // // // // //           updatedAt: serverTimestamp(),
// // // // // // //         });
// // // // // // //       });

// // // // // // //       toast({ title: "تم تأكيد استلام العربون! ✅", description: "أصبح الحجز مؤكداً والمقاعد محجوزة الآن." });
// // // // // // //     } catch (error: any) {
// // // // // // //       SovereignBlackBox.reportLethalCrash(error, "VERIFY_RECEIPT_RUPTURE", { bookingId: booking.id });
// // // // // // //       toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
// // // // // // //     } finally {
// // // // // // //       setIsProcessing(null);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const completeTrip = async (trip: Trip) => {
// // // // // // //     if (!functions || trip.status === "Completed" || !profile) return;
// // // // // // //     setIsProcessing(`complete-${trip.id}`);
// // // // // // //     try {
// // // // // // //       if (firestore && profile.id) {
// // // // // // //         await updateDoc(doc(firestore, "users", profile.id), {
// // // // // // //           currentActiveTripId: null,
// // // // // // //           updatedAt: serverTimestamp(),
// // // // // // //         });
// // // // // // //       }

// // // // // // //       const completeFn = httpsCallable(functions, "confirmArrivalSovereign");
// // // // // // //       await completeFn({ tripId: trip.id });

// // // // // // //       toast({ title: t("common.success") });
// // // // // // //     } catch (error: any) {
// // // // // // //       SovereignBlackBox.reportLethalCrash(error, "COMPLETE_TRIP_RUPTURE", { tripId: trip.id });
// // // // // // //       toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
// // // // // // //     } finally {
// // // // // // //       setIsProcessing(null);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const travelerConfirmArrival = async (tripId: string) => {
// // // // // // //     if (!functions) return;
// // // // // // //     setIsProcessing(`traveler-confirm-${tripId}`);
// // // // // // //     try {
// // // // // // //       const confirmFn = httpsCallable(functions, "confirmArrivalSovereign");
// // // // // // //       await confirmFn({ tripId });
// // // // // // //       toast({ title: t("common.success") });
// // // // // // //     } catch (error: any) {
// // // // // // //       SovereignBlackBox.reportLethalCrash(error, "TRAVELER_ARRIVAL_CONFIRM_RUPTURE", { tripId });
// // // // // // //       toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
// // // // // // //     } finally {
// // // // // // //       setIsProcessing(null);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const cancelTrip = async (trip: Trip, booking?: Booking): Promise<"cancelled" | "error"> => {
// // // // // // //     const cancelledBy = profile?.role === "carrier" ? "carrier" : "traveler";
// // // // // // //     setIsProcessing(`cancel-${booking?.id || trip.id}`);

// // // // // // //     try {
// // // // // // //       // Booking cancel stays callable
// // // // // // //       if (booking) {
// // // // // // //         if (!functions) return "error";

// // // // // // //         const cancelFn = httpsCallable(functions, "cancelBookingSovereign");
// // // // // // //         await cancelFn({
// // // // // // //           bookingId: booking.id,
// // // // // // //           reason: cancelledBy === "carrier" ? "إلغاء من طرف الناقل" : "إلغاء من طرف المسافر",
// // // // // // //           cancelledBy,
// // // // // // //         });

// // // // // // //         toast({ title: t("common.success") });
// // // // // // //         return "cancelled";
// // // // // // //       }

// // // // // // //       // Trip cancel = direct Firestore batch
// // // // // // //       if (!firestore) return "error";

// // // // // // //       const batch = writeBatch(firestore);
// // // // // // //       const tripRef = doc(firestore, "trips", trip.id);

// // // // // // //       // 1. تحديث حالة الرحلة إلى "ملغاة"
// // // // // // //       batch.update(tripRef, {
// // // // // // //         status: "Cancelled",
// // // // // // //         cancelReason: cancelledBy === "carrier" ? "إلغاء من طرف الناقل" : "إلغاء من طرف المسافر",
// // // // // // //         cancelledBy,
// // // // // // //         cancelledAt: serverTimestamp(),
// // // // // // //         updatedAt: serverTimestamp(),
// // // // // // //       });

// // // // // // //       // 2. تحرير الناقل من الرحلة النشطة
// // // // // // //       if (profile?.role === "carrier" && profile.id && profile.currentActiveTripId === trip.id) {
// // // // // // //         const userRef = doc(firestore, "users", profile.id);
// // // // // // //         batch.update(userRef, {
// // // // // // //           currentActiveTripId: null,
// // // // // // //           updatedAt: serverTimestamp(),
// // // // // // //         });
// // // // // // //       }

// // // // // // //       // 🚀 3. التنظيف التلقائي (Offer Cleanup): جلب ومسح جميع العروض المرتبطة بهذه الرحلة
// // // // // // //       const offersRef = collection(firestore, "offers");
// // // // // // //       const offersQuery = query(offersRef, where("carrierTripId", "==", trip.id));
// // // // // // //       const offersSnapshot = await getDocs(offersQuery);

// // // // // // //       offersSnapshot.forEach((offerDoc) => {
// // // // // // //         batch.delete(offerDoc.ref);
// // // // // // //       });

// // // // // // //       // تنفيذ الـ Batch بالكامل (إلغاء الرحلة + فك ارتباط الناقل + مسح العروض)
// // // // // // //       await batch.commit();

// // // // // // //       toast({ title: t("common.success") });
// // // // // // //       return "cancelled";
// // // // // // //     } catch (error: any) {
// // // // // // //       toast({
// // // // // // //         variant: "destructive",
// // // // // // //         title: t("common.error"),
// // // // // // //         description: getSovereignMessage(error.message),
// // // // // // //       });
// // // // // // //       return "error";
// // // // // // //     } finally {
// // // // // // //       setIsProcessing(null);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const editTrip = async (trip: Trip, data: EditTripFormValues): Promise<boolean> => {
// // // // // // //     if (!firestore) return false;
// // // // // // //     if (trip.bookingIds && trip.bookingIds.length > 0) {
// // // // // // //       toast({
// // // // // // //         variant: "destructive",
// // // // // // //         title: "لا يمكن التعديل",
// // // // // // //         description: "لا يمكن تعديل الرحلة بعد تأكيد أول حجز.",
// // // // // // //       });
// // // // // // //       return false;
// // // // // // //     }
// // // // // // //     setIsProcessing(`edit-${trip.id}`);

// // // // // // //     try {
// // // // // // //       await updateDoc(doc(firestore, "trips", trip.id), {
// // // // // // //         departureDate: Timestamp.fromDate(new Date(data.departureDate)),
// // // // // // //         price: Number(data.price),
// // // // // // //         availableSeats: Number(data.availableSeats),
// // // // // // //         updatedAt: serverTimestamp(),
// // // // // // //       });
// // // // // // //       toast({ title: t("common.success") });
// // // // // // //       return true;
// // // // // // //     } catch (error: any) {
// // // // // // //       SovereignBlackBox.reportLethalCrash(error, "EDIT_TRIP_RUPTURE", { tripId: trip.id });
// // // // // // //       toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
// // // // // // //       return false;
// // // // // // //     } finally {
// // // // // // //       setIsProcessing(null);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   return { isProcessing, completeTrip, travelerConfirmArrival, cancelTrip, editTrip, verifyBookingReceipt };
// // // // // // // }

// // // // // // "use client";

// // // // // // /**
// // // // // //  * @hook useTripActions
// // // // // //  * @description THE OPERATIONAL ENGINE (REINFORCED - SC-806 V6.6 - PROTOCOL 20)
// // // // // //  * [SCR-061]: Injected verifyBookingReceipt for Carrier Handshake.
// // // // // //  * [PROTOCOL 20]: Immune system integration. No swallowed exceptions.
// // // // // //  * [FIX]: Added Offer Cleanup mechanism when a Carrier cancels their trip.
// // // // // //  */

// // // // // // import { useState } from "react";
// // // // // // import { useFirestore, useFunctions } from "@/firebase";
// // // // // // import { useToast } from "@/hooks/use-toast";
// // // // // // import { useUserProfile } from "@/hooks/use-user-profile";
// // // // // // // ✅ أضفنا collection, query, where, getDocs هنا
// // // // // // import {
// // // // // //   doc,
// // // // // //   serverTimestamp,
// // // // // //   Timestamp,
// // // // // //   updateDoc,
// // // // // //   runTransaction,
// // // // // //   increment,
// // // // // //   writeBatch,
// // // // // //   collection,
// // // // // //   query,
// // // // // //   where,
// // // // // //   getDocs,
// // // // // // } from "firebase/firestore";
// // // // // // import { httpsCallable } from "firebase/functions";
// // // // // // import type { Trip, Booking } from "@/lib/data";
// // // // // // import { type EditTripFormValues } from "@/components/carrier/edit-trip-dialog";
// // // // // // import { useTranslations } from "next-intl";
// // // // // // import { SovereignBlackBox } from "@/lib/sovereign-monitor";

// // // // // // export function useTripActions() {
// // // // // //   const firestore = useFirestore();
// // // // // //   const functions = useFunctions();
// // // // // //   const { toast } = useToast();
// // // // // //   const t = useTranslations();
// // // // // //   const tError = useTranslations("errorDictionary");
// // // // // //   const { profile } = useUserProfile();
// // // // // //   const [isProcessing, setIsProcessing] = useState<string | null>(null);

// // // // // //   const getSovereignMessage = (code: string) => {
// // // // // //     const normalizedCode = code?.toUpperCase() || "DEFAULT";
// // // // // //     try {
// // // // // //       const message = tError(normalizedCode);
// // // // // //       return message === normalizedCode ? tError("DEFAULT") : message;
// // // // // //     } catch {
// // // // // //       return tError("DEFAULT");
// // // // // //     }
// // // // // //   };

// // // // // //   /**
// // // // // //    * verifyBookingReceipt
// // // // // //    * [SCR-061]: Sovereign Handshake Finalization. Carrier authenticates the Voucher.
// // // // // //    */
// // // // // //   const verifyBookingReceipt = async (booking: Booking) => {
// // // // // //     if (!firestore || !profile) return;
// // // // // //     setIsProcessing(`verify-${booking.id}`);
// // // // // //     try {
// // // // // //       await runTransaction(firestore, async (transaction) => {
// // // // // //         const bookingRef = doc(firestore, "bookings", booking.id);

// // // // // //         // 1. Confirm Receipt & Seal Booking
// // // // // //         transaction.update(bookingRef, {
// // // // // //           status: "Confirmed",
// // // // // //           verifiedAt: serverTimestamp(),
// // // // // //           updatedAt: serverTimestamp(),
// // // // // //         });

// // // // // //         // 2. ✅ [FIX]: خصم المقاعد بعد موافقة الناقل فقط (مش في confirm-booking)
// // // // // //         const seatsToBook = booking.seats || 1;
// // // // // //         if (booking.carrierTripId) {
// // // // // //           transaction.update(doc(firestore, "trips", booking.carrierTripId), {
// // // // // //             availableSeats: increment(-seatsToBook),
// // // // // //             updatedAt: serverTimestamp(),
// // // // // //           });
// // // // // //         }
// // // // // //       });

// // // // // //       toast({ title: "تم تأكيد استلام العربون! ✅", description: "أصبح الحجز مؤكداً والمقاعد محجوزة الآن." });
// // // // // //     } catch (error: any) {
// // // // // //       SovereignBlackBox.reportLethalCrash(error, "VERIFY_RECEIPT_RUPTURE", { bookingId: booking.id });
// // // // // //       toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
// // // // // //     } finally {
// // // // // //       setIsProcessing(null);
// // // // // //     }
// // // // // //   };

// // // // // //   const completeTrip = async (trip: Trip) => {
// // // // // //     if (!functions || trip.status === "Completed" || !profile) return;
// // // // // //     setIsProcessing(`complete-${trip.id}`);
// // // // // //     try {
// // // // // //       if (firestore && profile.id) {
// // // // // //         await updateDoc(doc(firestore, "users", profile.id), {
// // // // // //           currentActiveTripId: null,
// // // // // //           updatedAt: serverTimestamp(),
// // // // // //         });
// // // // // //       }

// // // // // //       const completeFn = httpsCallable(functions, "confirmArrivalSovereign");
// // // // // //       await completeFn({ tripId: trip.id });

// // // // // //       toast({ title: t("common.success") });
// // // // // //     } catch (error: any) {
// // // // // //       SovereignBlackBox.reportLethalCrash(error, "COMPLETE_TRIP_RUPTURE", { tripId: trip.id });
// // // // // //       toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
// // // // // //     } finally {
// // // // // //       setIsProcessing(null);
// // // // // //     }
// // // // // //   };

// // // // // //   const travelerConfirmArrival = async (tripId: string) => {
// // // // // //     if (!functions) return;
// // // // // //     setIsProcessing(`traveler-confirm-${tripId}`);
// // // // // //     try {
// // // // // //       const confirmFn = httpsCallable(functions, "confirmArrivalSovereign");
// // // // // //       await confirmFn({ tripId });
// // // // // //       toast({ title: t("common.success") });
// // // // // //     } catch (error: any) {
// // // // // //       SovereignBlackBox.reportLethalCrash(error, "TRAVELER_ARRIVAL_CONFIRM_RUPTURE", { tripId });
// // // // // //       toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
// // // // // //     } finally {
// // // // // //       setIsProcessing(null);
// // // // // //     }
// // // // // //   };

// // // // // //   const cancelTrip = async (trip: Trip, booking?: Booking): Promise<"cancelled" | "error"> => {
// // // // // //     const cancelledBy = profile?.role === "carrier" ? "carrier" : "traveler";
// // // // // //     setIsProcessing(`cancel-${booking?.id || trip.id}`);

// // // // // //     try {
// // // // // //       // Booking cancel stays callable
// // // // // //       if (booking) {
// // // // // //         if (!functions) return "error";

// // // // // //         const cancelFn = httpsCallable(functions, "cancelBookingSovereign");
// // // // // //         await cancelFn({
// // // // // //           bookingId: booking.id,
// // // // // //           reason: cancelledBy === "carrier" ? "إلغاء من طرف الناقل" : "إلغاء من طرف المسافر",
// // // // // //           cancelledBy,
// // // // // //         });

// // // // // //         toast({ title: t("common.success") });
// // // // // //         return "cancelled";
// // // // // //       }

// // // // // //       // Trip cancel = direct Firestore batch
// // // // // //       if (!firestore) return "error";

// // // // // //       const batch = writeBatch(firestore);
// // // // // //       const tripRef = doc(firestore, "trips", trip.id);

// // // // // //       // 1. تحديث حالة الرحلة إلى "ملغاة"
// // // // // //       batch.update(tripRef, {
// // // // // //         status: "Cancelled",
// // // // // //         cancelReason: cancelledBy === "carrier" ? "إلغاء من طرف الناقل" : "إلغاء من طرف المسافر",
// // // // // //         cancelledBy,
// // // // // //         cancelledAt: serverTimestamp(),
// // // // // //         updatedAt: serverTimestamp(),
// // // // // //       });

// // // // // //       // 2. تحرير الناقل من الرحلة النشطة
// // // // // //       if (profile?.role === "carrier" && profile.id && profile.currentActiveTripId === trip.id) {
// // // // // //         const userRef = doc(firestore, "users", profile.id);
// // // // // //         batch.update(userRef, {
// // // // // //           currentActiveTripId: null,
// // // // // //           updatedAt: serverTimestamp(),
// // // // // //         });
// // // // // //       }

// // // // // //       // 🚀 3. التنظيف التلقائي (Offer Cleanup): جلب ومسح جميع العروض المرتبطة بهذه الرحلة
// // // // // //       const offersRef = collection(firestore, "offers");
// // // // // //       const offersQuery = query(offersRef, where("carrierTripId", "==", trip.id));
// // // // // //       const offersSnapshot = await getDocs(offersQuery);

// // // // // //       offersSnapshot.forEach((offerDoc) => {
// // // // // //         batch.delete(offerDoc.ref);
// // // // // //       });

// // // // // //       // تنفيذ الـ Batch بالكامل (إلغاء الرحلة + فك ارتباط الناقل + مسح العروض)
// // // // // //       await batch.commit();

// // // // // //       toast({ title: t("common.success") });
// // // // // //       return "cancelled";
// // // // // //     } catch (error: any) {
// // // // // //       toast({
// // // // // //         variant: "destructive",
// // // // // //         title: t("common.error"),
// // // // // //         description: getSovereignMessage(error.message),
// // // // // //       });
// // // // // //       return "error";
// // // // // //     } finally {
// // // // // //       setIsProcessing(null);
// // // // // //     }
// // // // // //   };

// // // // // //   const editTrip = async (trip: Trip, data: EditTripFormValues): Promise<boolean> => {
// // // // // //     if (!firestore) return false;
// // // // // //     if (trip.bookingIds && trip.bookingIds.length > 0) {
// // // // // //       toast({
// // // // // //         variant: "destructive",
// // // // // //         title: "لا يمكن التعديل",
// // // // // //         description: "لا يمكن تعديل الرحلة بعد تأكيد أول حجز.",
// // // // // //       });
// // // // // //       return false;
// // // // // //     }
// // // // // //     setIsProcessing(`edit-${trip.id}`);

// // // // // //     try {
// // // // // //       await updateDoc(doc(firestore, "trips", trip.id), {
// // // // // //         departureDate: Timestamp.fromDate(new Date(data.departureDate)),
// // // // // //         price: Number(data.price),
// // // // // //         availableSeats: Number(data.availableSeats),
// // // // // //         updatedAt: serverTimestamp(),
// // // // // //       });
// // // // // //       toast({ title: t("common.success") });
// // // // // //       return true;
// // // // // //     } catch (error: any) {
// // // // // //       SovereignBlackBox.reportLethalCrash(error, "EDIT_TRIP_RUPTURE", { tripId: trip.id });
// // // // // //       toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
// // // // // //       return false;
// // // // // //     } finally {
// // // // // //       setIsProcessing(null);
// // // // // //     }
// // // // // //   };

// // // // // //   return { isProcessing, completeTrip, travelerConfirmArrival, cancelTrip, editTrip, verifyBookingReceipt };
// // // // // // }

// // // // // "use client";

// // // // // /**
// // // // //  * @hook useTripActions
// // // // //  * @description THE OPERATIONAL ENGINE (REINFORCED - SC-806 V6.6 - PROTOCOL 20)
// // // // //  * [SCR-061]: Injected verifyBookingReceipt for Carrier Handshake.
// // // // //  * [PROTOCOL 20]: Immune system integration. No swallowed exceptions.
// // // // //  * [FIX]: Added Offer Cleanup mechanism when a Carrier cancels their trip.
// // // // //  */

// // // // // import { useState } from "react";
// // // // // import { useFirestore, useFunctions } from "@/firebase";
// // // // // import { useToast } from "@/hooks/use-toast";
// // // // // import { useUserProfile } from "@/hooks/use-user-profile";
// // // // // // ✅ أضفنا collection, query, where, getDocs هنا
// // // // // import {
// // // // //   doc,
// // // // //   serverTimestamp,
// // // // //   Timestamp,
// // // // //   updateDoc,
// // // // //   runTransaction,
// // // // //   increment,
// // // // //   writeBatch,
// // // // //   collection,
// // // // //   query,
// // // // //   where,
// // // // //   getDocs,
// // // // // } from "firebase/firestore";
// // // // // import { httpsCallable } from "firebase/functions";
// // // // // import type { Trip, Booking } from "@/lib/data";
// // // // // import { type EditTripFormValues } from "@/components/carrier/edit-trip-dialog";
// // // // // import { useTranslations } from "next-intl";
// // // // // import { SovereignBlackBox } from "@/lib/sovereign-monitor";

// // // // // export function useTripActions() {
// // // // //   const firestore = useFirestore();
// // // // //   const functions = useFunctions();
// // // // //   const { toast } = useToast();
// // // // //   const t = useTranslations();
// // // // //   const tError = useTranslations("errorDictionary");
// // // // //   const { profile } = useUserProfile();
// // // // //   const [isProcessing, setIsProcessing] = useState<string | null>(null);

// // // // //   const getSovereignMessage = (code: string) => {
// // // // //     const normalizedCode = code?.toUpperCase() || "DEFAULT";
// // // // //     try {
// // // // //       const message = tError(normalizedCode);
// // // // //       return message === normalizedCode ? tError("DEFAULT") : message;
// // // // //     } catch {
// // // // //       return tError("DEFAULT");
// // // // //     }
// // // // //   };

// // // // //   /**
// // // // //    * verifyBookingReceipt
// // // // //    * [SCR-061]: Sovereign Handshake Finalization. Carrier authenticates the Voucher.
// // // // //    */
// // // // //   const verifyBookingReceipt = async (booking: Booking) => {
// // // // //     if (!firestore || !profile) return;
// // // // //     setIsProcessing(`verify-${booking.id}`);
// // // // //     try {
// // // // //       await runTransaction(firestore, async (transaction) => {
// // // // //         const bookingRef = doc(firestore, "bookings", booking.id);

// // // // //         // 1. Confirm Receipt & Seal Booking
// // // // //         transaction.update(bookingRef, {
// // // // //           status: "Confirmed",
// // // // //           verifiedAt: serverTimestamp(),
// // // // //           updatedAt: serverTimestamp(),
// // // // //         });

// // // // //         // 2. ✅ خصم المقاعد هنا بعد تأكيد الناقل استلام العربون
// // // // //         const seatsToBook = booking.seats || 1;
// // // // //         if (booking.carrierTripId) {
// // // // //           transaction.update(doc(firestore, "trips", booking.carrierTripId), {
// // // // //             availableSeats: increment(-seatsToBook),
// // // // //             updatedAt: serverTimestamp(),
// // // // //           });
// // // // //         }
// // // // //       });

// // // // //       toast({ title: "تم تأكيد استلام العربون! ✅", description: "أصبح الحجز مؤكداً والمقاعد محجوزة الآن." });
// // // // //     } catch (error: any) {
// // // // //       SovereignBlackBox.reportLethalCrash(error, "VERIFY_RECEIPT_RUPTURE", { bookingId: booking.id });
// // // // //       toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
// // // // //     } finally {
// // // // //       setIsProcessing(null);
// // // // //     }
// // // // //   };

// // // // //   const completeTrip = async (trip: Trip) => {
// // // // //     if (!functions || trip.status === "Completed" || !profile) return;
// // // // //     setIsProcessing(`complete-${trip.id}`);
// // // // //     try {
// // // // //       if (firestore && profile.id) {
// // // // //         await updateDoc(doc(firestore, "users", profile.id), {
// // // // //           currentActiveTripId: null,
// // // // //           updatedAt: serverTimestamp(),
// // // // //         });
// // // // //       }

// // // // //       const completeFn = httpsCallable(functions, "confirmArrivalSovereign");
// // // // //       await completeFn({ tripId: trip.id });

// // // // //       toast({ title: t("common.success") });
// // // // //     } catch (error: any) {
// // // // //       SovereignBlackBox.reportLethalCrash(error, "COMPLETE_TRIP_RUPTURE", { tripId: trip.id });
// // // // //       toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
// // // // //     } finally {
// // // // //       setIsProcessing(null);
// // // // //     }
// // // // //   };

// // // // //   const travelerConfirmArrival = async (tripId: string) => {
// // // // //     if (!functions) return;
// // // // //     setIsProcessing(`traveler-confirm-${tripId}`);
// // // // //     try {
// // // // //       const confirmFn = httpsCallable(functions, "confirmArrivalSovereign");
// // // // //       await confirmFn({ tripId });
// // // // //       toast({ title: t("common.success") });
// // // // //     } catch (error: any) {
// // // // //       SovereignBlackBox.reportLethalCrash(error, "TRAVELER_ARRIVAL_CONFIRM_RUPTURE", { tripId });
// // // // //       toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
// // // // //     } finally {
// // // // //       setIsProcessing(null);
// // // // //     }
// // // // //   };

// // // // //   const cancelTrip = async (trip: Trip, booking?: Booking): Promise<"cancelled" | "error"> => {
// // // // //     const cancelledBy = profile?.role === "carrier" ? "carrier" : "traveler";
// // // // //     setIsProcessing(`cancel-${booking?.id || trip.id}`);

// // // // //     try {
// // // // //       // Booking cancel stays callable
// // // // //       if (booking) {
// // // // //         if (!functions) return "error";

// // // // //         const cancelFn = httpsCallable(functions, "cancelBookingSovereign");
// // // // //         await cancelFn({
// // // // //           bookingId: booking.id,
// // // // //           reason: cancelledBy === "carrier" ? "إلغاء من طرف الناقل" : "إلغاء من طرف المسافر",
// // // // //           cancelledBy,
// // // // //         });

// // // // //         toast({ title: t("common.success") });
// // // // //         return "cancelled";
// // // // //       }

// // // // //       // Trip cancel = direct Firestore batch
// // // // //       if (!firestore) return "error";

// // // // //       const batch = writeBatch(firestore);
// // // // //       const tripRef = doc(firestore, "trips", trip.id);

// // // // //       // 1. تحديث حالة الرحلة إلى "ملغاة"
// // // // //       batch.update(tripRef, {
// // // // //         status: "Cancelled",
// // // // //         cancelReason: cancelledBy === "carrier" ? "إلغاء من طرف الناقل" : "إلغاء من طرف المسافر",
// // // // //         cancelledBy,
// // // // //         cancelledAt: serverTimestamp(),
// // // // //         updatedAt: serverTimestamp(),
// // // // //       });

// // // // //       // 2. تحرير الناقل من الرحلة النشطة
// // // // //       if (profile?.role === "carrier" && profile.id && profile.currentActiveTripId === trip.id) {
// // // // //         const userRef = doc(firestore, "users", profile.id);
// // // // //         batch.update(userRef, {
// // // // //           currentActiveTripId: null,
// // // // //           updatedAt: serverTimestamp(),
// // // // //         });
// // // // //       }

// // // // //       // 🚀 3. التنظيف التلقائي (Offer Cleanup): جلب ومسح جميع العروض المرتبطة بهذه الرحلة
// // // // //       const offersRef = collection(firestore, "offers");
// // // // //       const offersQuery = query(offersRef, where("carrierTripId", "==", trip.id));
// // // // //       const offersSnapshot = await getDocs(offersQuery);

// // // // //       offersSnapshot.forEach((offerDoc) => {
// // // // //         batch.delete(offerDoc.ref);
// // // // //       });

// // // // //       // تنفيذ الـ Batch بالكامل (إلغاء الرحلة + فك ارتباط الناقل + مسح العروض)
// // // // //       await batch.commit();

// // // // //       toast({ title: t("common.success") });
// // // // //       return "cancelled";
// // // // //     } catch (error: any) {
// // // // //       toast({
// // // // //         variant: "destructive",
// // // // //         title: t("common.error"),
// // // // //         description: getSovereignMessage(error.message),
// // // // //       });
// // // // //       return "error";
// // // // //     } finally {
// // // // //       setIsProcessing(null);
// // // // //     }
// // // // //   };

// // // // //   const editTrip = async (trip: Trip, data: EditTripFormValues): Promise<boolean> => {
// // // // //     if (!firestore) return false;
// // // // //     if (trip.bookingIds && trip.bookingIds.length > 0) {
// // // // //       toast({
// // // // //         variant: "destructive",
// // // // //         title: "لا يمكن التعديل",
// // // // //         description: "لا يمكن تعديل الرحلة بعد تأكيد أول حجز.",
// // // // //       });
// // // // //       return false;
// // // // //     }
// // // // //     setIsProcessing(`edit-${trip.id}`);

// // // // //     try {
// // // // //       await updateDoc(doc(firestore, "trips", trip.id), {
// // // // //         departureDate: Timestamp.fromDate(new Date(data.departureDate)),
// // // // //         price: Number(data.price),
// // // // //         availableSeats: Number(data.availableSeats),
// // // // //         updatedAt: serverTimestamp(),
// // // // //       });
// // // // //       toast({ title: t("common.success") });
// // // // //       return true;
// // // // //     } catch (error: any) {
// // // // //       SovereignBlackBox.reportLethalCrash(error, "EDIT_TRIP_RUPTURE", { tripId: trip.id });
// // // // //       toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
// // // // //       return false;
// // // // //     } finally {
// // // // //       setIsProcessing(null);
// // // // //     }
// // // // //   };

// // // // //   return { isProcessing, completeTrip, travelerConfirmArrival, cancelTrip, editTrip, verifyBookingReceipt };
// // // // // }

// // // // "use client";

// // // // /**
// // // //  * @hook useTripActions
// // // //  * @description THE OPERATIONAL ENGINE (REINFORCED - SC-806 V6.6 - PROTOCOL 20)
// // // //  * [SCR-061]: Injected verifyBookingReceipt for Carrier Handshake.
// // // //  * [PROTOCOL 20]: Immune system integration. No swallowed exceptions.
// // // //  * [FIX]: Added Offer Cleanup mechanism when a Carrier cancels their trip.
// // // //  */

// // // // import { useState } from "react";
// // // // import { useFirestore, useFunctions } from "@/firebase";
// // // // import { useToast } from "@/hooks/use-toast";
// // // // import { useUserProfile } from "@/hooks/use-user-profile";
// // // // // ✅ أضفنا collection, query, where, getDocs هنا
// // // // import {
// // // //   doc,
// // // //   serverTimestamp,
// // // //   Timestamp,
// // // //   updateDoc,
// // // //   runTransaction,
// // // //   increment,
// // // //   writeBatch,
// // // //   collection,
// // // //   query,
// // // //   where,
// // // //   getDocs,
// // // // } from "firebase/firestore";
// // // // import { httpsCallable } from "firebase/functions";
// // // // import type { Trip, Booking } from "@/lib/data";
// // // // import { type EditTripFormValues } from "@/components/carrier/edit-trip-dialog";
// // // // import { useTranslations } from "next-intl";
// // // // import { SovereignBlackBox } from "@/lib/sovereign-monitor";

// // // // export function useTripActions() {
// // // //   const firestore = useFirestore();
// // // //   const functions = useFunctions();
// // // //   const { toast } = useToast();
// // // //   const t = useTranslations();
// // // //   const tError = useTranslations("errorDictionary");
// // // //   const { profile } = useUserProfile();
// // // //   const [isProcessing, setIsProcessing] = useState<string | null>(null);

// // // //   const getSovereignMessage = (code: string) => {
// // // //     const normalizedCode = code?.toUpperCase() || "DEFAULT";
// // // //     try {
// // // //       const message = tError(normalizedCode);
// // // //       return message === normalizedCode ? tError("DEFAULT") : message;
// // // //     } catch {
// // // //       return tError("DEFAULT");
// // // //     }
// // // //   };

// // // //   /**
// // // //    * verifyBookingReceipt
// // // //    * [SCR-061]: Sovereign Handshake Finalization. Carrier authenticates the Voucher.
// // // //    */
// // // //   const verifyBookingReceipt = async (booking: Booking) => {
// // // //     if (!firestore || !profile) return;
// // // //     setIsProcessing(`verify-${booking.id}`);
// // // //     try {
// // // //       await runTransaction(firestore, async (transaction) => {
// // // //         const bookingRef = doc(firestore, "bookings", booking.id);

// // // //         // 1. Confirm Receipt & Seal Booking
// // // //         transaction.update(bookingRef, {
// // // //           status: "Confirmed",
// // // //           verifiedAt: serverTimestamp(),
// // // //           updatedAt: serverTimestamp(),
// // // //         });

// // // //         // 2. خصم المقاعد فقط لو الحجز مش جاي من طلب مسافر
// // // //         // (لو في carrierTripId ≠ tripId يعني الناقل أنشأ رحلة جديدة وخصم المقاعد فيها من البداية)
// // // //         const isFromTravelerRequest = (booking as any).carrierTripId && (booking as any).carrierTripId !== booking.tripId;
// // // //         if (!isFromTravelerRequest) {
// // // //           const seatsToBook = booking.seats || 1;
// // // //           if (booking.carrierTripId) {
// // // //             transaction.update(doc(firestore, "trips", booking.carrierTripId), {
// // // //               availableSeats: increment(-seatsToBook),
// // // //               updatedAt: serverTimestamp(),
// // // //             });
// // // //           }
// // // //         }
// // // //       });

// // // //       toast({ title: "تم تأكيد استلام العربون! ✅", description: "أصبح الحجز مؤكداً والمقاعد محجوزة الآن." });
// // // //     } catch (error: any) {
// // // //       SovereignBlackBox.reportLethalCrash(error, "VERIFY_RECEIPT_RUPTURE", { bookingId: booking.id });
// // // //       toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
// // // //     } finally {
// // // //       setIsProcessing(null);
// // // //     }
// // // //   };

// // // //   const completeTrip = async (trip: Trip) => {
// // // //     if (!functions || trip.status === "Completed" || !profile) return;
// // // //     setIsProcessing(`complete-${trip.id}`);
// // // //     try {
// // // //       if (firestore && profile.id) {
// // // //         await updateDoc(doc(firestore, "users", profile.id), {
// // // //           currentActiveTripId: null,
// // // //           updatedAt: serverTimestamp(),
// // // //         });
// // // //       }

// // // //       const completeFn = httpsCallable(functions, "confirmArrivalSovereign");
// // // //       await completeFn({ tripId: trip.id });

// // // //       toast({ title: t("common.success") });
// // // //     } catch (error: any) {
// // // //       SovereignBlackBox.reportLethalCrash(error, "COMPLETE_TRIP_RUPTURE", { tripId: trip.id });
// // // //       toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
// // // //     } finally {
// // // //       setIsProcessing(null);
// // // //     }
// // // //   };

// // // //   const travelerConfirmArrival = async (tripId: string) => {
// // // //     if (!functions) return;
// // // //     setIsProcessing(`traveler-confirm-${tripId}`);
// // // //     try {
// // // //       const confirmFn = httpsCallable(functions, "confirmArrivalSovereign");
// // // //       await confirmFn({ tripId });
// // // //       toast({ title: t("common.success") });
// // // //     } catch (error: any) {
// // // //       SovereignBlackBox.reportLethalCrash(error, "TRAVELER_ARRIVAL_CONFIRM_RUPTURE", { tripId });
// // // //       toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
// // // //     } finally {
// // // //       setIsProcessing(null);
// // // //     }
// // // //   };

// // // //   const cancelTrip = async (trip: Trip, booking?: Booking): Promise<"cancelled" | "error"> => {
// // // //     const cancelledBy = profile?.role === "carrier" ? "carrier" : "traveler";
// // // //     setIsProcessing(`cancel-${booking?.id || trip.id}`);

// // // //     try {
// // // //       // Booking cancel stays callable
// // // //       if (booking) {
// // // //         if (!functions) return "error";

// // // //         const cancelFn = httpsCallable(functions, "cancelBookingSovereign");
// // // //         await cancelFn({
// // // //           bookingId: booking.id,
// // // //           reason: cancelledBy === "carrier" ? "إلغاء من طرف الناقل" : "إلغاء من طرف المسافر",
// // // //           cancelledBy,
// // // //         });

// // // //         toast({ title: t("common.success") });
// // // //         return "cancelled";
// // // //       }

// // // //       // Trip cancel = direct Firestore batch
// // // //       if (!firestore) return "error";

// // // //       const batch = writeBatch(firestore);
// // // //       const tripRef = doc(firestore, "trips", trip.id);

// // // //       // 1. تحديث حالة الرحلة إلى "ملغاة"
// // // //       batch.update(tripRef, {
// // // //         status: "Cancelled",
// // // //         cancelReason: cancelledBy === "carrier" ? "إلغاء من طرف الناقل" : "إلغاء من طرف المسافر",
// // // //         cancelledBy,
// // // //         cancelledAt: serverTimestamp(),
// // // //         updatedAt: serverTimestamp(),
// // // //       });

// // // //       // 2. تحرير الناقل من الرحلة النشطة
// // // //       if (profile?.role === "carrier" && profile.id && profile.currentActiveTripId === trip.id) {
// // // //         const userRef = doc(firestore, "users", profile.id);
// // // //         batch.update(userRef, {
// // // //           currentActiveTripId: null,
// // // //           updatedAt: serverTimestamp(),
// // // //         });
// // // //       }

// // // //       // 🚀 3. التنظيف التلقائي (Offer Cleanup): جلب ومسح جميع العروض المرتبطة بهذه الرحلة
// // // //       const offersRef = collection(firestore, "offers");
// // // //       const offersQuery = query(offersRef, where("carrierTripId", "==", trip.id));
// // // //       const offersSnapshot = await getDocs(offersQuery);

// // // //       offersSnapshot.forEach((offerDoc) => {
// // // //         batch.delete(offerDoc.ref);
// // // //       });

// // // //       // تنفيذ الـ Batch بالكامل (إلغاء الرحلة + فك ارتباط الناقل + مسح العروض)
// // // //       await batch.commit();

// // // //       toast({ title: t("common.success") });
// // // //       return "cancelled";
// // // //     } catch (error: any) {
// // // //       toast({
// // // //         variant: "destructive",
// // // //         title: t("common.error"),
// // // //         description: getSovereignMessage(error.message),
// // // //       });
// // // //       return "error";
// // // //     } finally {
// // // //       setIsProcessing(null);
// // // //     }
// // // //   };

// // // //   const editTrip = async (trip: Trip, data: EditTripFormValues): Promise<boolean> => {
// // // //     if (!firestore) return false;
// // // //     if (trip.bookingIds && trip.bookingIds.length > 0) {
// // // //       toast({
// // // //         variant: "destructive",
// // // //         title: "لا يمكن التعديل",
// // // //         description: "لا يمكن تعديل الرحلة بعد تأكيد أول حجز.",
// // // //       });
// // // //       return false;
// // // //     }
// // // //     setIsProcessing(`edit-${trip.id}`);

// // // //     try {
// // // //       await updateDoc(doc(firestore, "trips", trip.id), {
// // // //         departureDate: Timestamp.fromDate(new Date(data.departureDate)),
// // // //         price: Number(data.price),
// // // //         availableSeats: Number(data.availableSeats),
// // // //         updatedAt: serverTimestamp(),
// // // //       });
// // // //       toast({ title: t("common.success") });
// // // //       return true;
// // // //     } catch (error: any) {
// // // //       SovereignBlackBox.reportLethalCrash(error, "EDIT_TRIP_RUPTURE", { tripId: trip.id });
// // // //       toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
// // // //       return false;
// // // //     } finally {
// // // //       setIsProcessing(null);
// // // //     }
// // // //   };

// // // //   return { isProcessing, completeTrip, travelerConfirmArrival, cancelTrip, editTrip, verifyBookingReceipt };
// // // // }

// // // "use client";

// // // /**
// // //  * @hook useTripActions
// // //  * @description THE OPERATIONAL ENGINE (REINFORCED - SC-806 V6.6 - PROTOCOL 20)
// // //  * [SCR-061]: Injected verifyBookingReceipt for Carrier Handshake.
// // //  * [PROTOCOL 20]: Immune system integration. No swallowed exceptions.
// // //  * [FIX]: Added Offer Cleanup mechanism when a Carrier cancels their trip.
// // //  */

// // // import { useState } from "react";
// // // import { useFirestore, useFunctions } from "@/firebase";
// // // import { useToast } from "@/hooks/use-toast";
// // // import { useUserProfile } from "@/hooks/use-user-profile";
// // // // ✅ أضفنا collection, query, where, getDocs هنا
// // // import {
// // //   doc,
// // //   serverTimestamp,
// // //   Timestamp,
// // //   updateDoc,
// // //   runTransaction,
// // //   increment,
// // //   writeBatch,
// // //   collection,
// // //   query,
// // //   where,
// // //   getDocs,
// // // } from "firebase/firestore";
// // // import { httpsCallable } from "firebase/functions";
// // // import type { Trip, Booking } from "@/lib/data";
// // // import { type EditTripFormValues } from "@/components/carrier/edit-trip-dialog";
// // // import { useTranslations } from "next-intl";
// // // import { SovereignBlackBox } from "@/lib/sovereign-monitor";

// // // export function useTripActions() {
// // //   const firestore = useFirestore();
// // //   const functions = useFunctions();
// // //   const { toast } = useToast();
// // //   const t = useTranslations();
// // //   const tError = useTranslations("errorDictionary");
// // //   const { profile } = useUserProfile();
// // //   const [isProcessing, setIsProcessing] = useState<string | null>(null);

// // //   const getSovereignMessage = (code: string) => {
// // //     const normalizedCode = code?.toUpperCase() || "DEFAULT";
// // //     try {
// // //       const message = tError(normalizedCode);
// // //       return message === normalizedCode ? tError("DEFAULT") : message;
// // //     } catch {
// // //       return tError("DEFAULT");
// // //     }
// // //   };

// // //   /**
// // //    * verifyBookingReceipt
// // //    * [SCR-061]: Sovereign Handshake Finalization. Carrier authenticates the Voucher.
// // //    */
// // //   const verifyBookingReceipt = async (booking: Booking) => {
// // //     if (!firestore || !profile) return;
// // //     setIsProcessing(`verify-${booking.id}`);
// // //     try {
// // //       await runTransaction(firestore, async (transaction) => {
// // //         const bookingRef = doc(firestore, "bookings", booking.id);

// // //         // 1. Confirm Receipt & Seal Booking
// // //         transaction.update(bookingRef, {
// // //           status: "Confirmed",
// // //           verifiedAt: serverTimestamp(),
// // //           updatedAt: serverTimestamp(),
// // //         });

// // //         // 2. خصم المقاعد فقط لو لم يتم خصمها مسبقاً في handleTripCreated
// // //         // isPassengerTripDeleted = true يعني الناقل أنشأ رحلة جديدة وخصم المقاعد فيها بالفعل
// // //         const seatsAlreadyDeducted = !!(booking as any).isPassengerTripDeleted;
// // //         if (!seatsAlreadyDeducted) {
// // //           const seatsToBook = booking.seats || 1;
// // //           const targetTripId = (booking as any).carrierTripId || booking.tripId;
// // //           if (targetTripId) {
// // //             transaction.update(doc(firestore, "trips", targetTripId), {
// // //               availableSeats: increment(-seatsToBook),
// // //               updatedAt: serverTimestamp(),
// // //             });
// // //           }
// // //         }
// // //       });

// // //       toast({ title: "تم تأكيد استلام العربون! ✅", description: "أصبح الحجز مؤكداً والمقاعد محجوزة الآن." });
// // //     } catch (error: any) {
// // //       SovereignBlackBox.reportLethalCrash(error, "VERIFY_RECEIPT_RUPTURE", { bookingId: booking.id });
// // //       toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
// // //     } finally {
// // //       setIsProcessing(null);
// // //     }
// // //   };

// // //   const completeTrip = async (trip: Trip) => {
// // //     if (!functions || trip.status === "Completed" || !profile) return;
// // //     setIsProcessing(`complete-${trip.id}`);
// // //     try {
// // //       if (firestore && profile.id) {
// // //         await updateDoc(doc(firestore, "users", profile.id), {
// // //           currentActiveTripId: null,
// // //           updatedAt: serverTimestamp(),
// // //         });
// // //       }

// // //       const completeFn = httpsCallable(functions, "confirmArrivalSovereign");
// // //       await completeFn({ tripId: trip.id });

// // //       toast({ title: t("common.success") });
// // //     } catch (error: any) {
// // //       SovereignBlackBox.reportLethalCrash(error, "COMPLETE_TRIP_RUPTURE", { tripId: trip.id });
// // //       toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
// // //     } finally {
// // //       setIsProcessing(null);
// // //     }
// // //   };

// // //   const travelerConfirmArrival = async (tripId: string) => {
// // //     if (!functions) return;
// // //     setIsProcessing(`traveler-confirm-${tripId}`);
// // //     try {
// // //       const confirmFn = httpsCallable(functions, "confirmArrivalSovereign");
// // //       await confirmFn({ tripId });
// // //       toast({ title: t("common.success") });
// // //     } catch (error: any) {
// // //       SovereignBlackBox.reportLethalCrash(error, "TRAVELER_ARRIVAL_CONFIRM_RUPTURE", { tripId });
// // //       toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
// // //     } finally {
// // //       setIsProcessing(null);
// // //     }
// // //   };

// // //   const cancelTrip = async (trip: Trip, booking?: Booking): Promise<"cancelled" | "error"> => {
// // //     const cancelledBy = profile?.role === "carrier" ? "carrier" : "traveler";
// // //     setIsProcessing(`cancel-${booking?.id || trip.id}`);

// // //     try {
// // //       // Booking cancel stays callable
// // //       if (booking) {
// // //         if (!functions) return "error";

// // //         const cancelFn = httpsCallable(functions, "cancelBookingSovereign");
// // //         await cancelFn({
// // //           bookingId: booking.id,
// // //           reason: cancelledBy === "carrier" ? "إلغاء من طرف الناقل" : "إلغاء من طرف المسافر",
// // //           cancelledBy,
// // //         });

// // //         toast({ title: t("common.success") });
// // //         return "cancelled";
// // //       }

// // //       // Trip cancel = direct Firestore batch
// // //       if (!firestore) return "error";

// // //       const batch = writeBatch(firestore);
// // //       const tripRef = doc(firestore, "trips", trip.id);

// // //       // 1. تحديث حالة الرحلة إلى "ملغاة"
// // //       batch.update(tripRef, {
// // //         status: "Cancelled",
// // //         cancelReason: cancelledBy === "carrier" ? "إلغاء من طرف الناقل" : "إلغاء من طرف المسافر",
// // //         cancelledBy,
// // //         cancelledAt: serverTimestamp(),
// // //         updatedAt: serverTimestamp(),
// // //       });

// // //       // 2. تحرير الناقل من الرحلة النشطة
// // //       if (profile?.role === "carrier" && profile.id && profile.currentActiveTripId === trip.id) {
// // //         const userRef = doc(firestore, "users", profile.id);
// // //         batch.update(userRef, {
// // //           currentActiveTripId: null,
// // //           updatedAt: serverTimestamp(),
// // //         });
// // //       }

// // //       // 🚀 3. التنظيف التلقائي (Offer Cleanup): جلب ومسح جميع العروض المرتبطة بهذه الرحلة
// // //       const offersRef = collection(firestore, "offers");
// // //       const offersQuery = query(offersRef, where("carrierTripId", "==", trip.id));
// // //       const offersSnapshot = await getDocs(offersQuery);

// // //       offersSnapshot.forEach((offerDoc) => {
// // //         batch.delete(offerDoc.ref);
// // //       });

// // //       // تنفيذ الـ Batch بالكامل (إلغاء الرحلة + فك ارتباط الناقل + مسح العروض)
// // //       await batch.commit();

// // //       toast({ title: t("common.success") });
// // //       return "cancelled";
// // //     } catch (error: any) {
// // //       toast({
// // //         variant: "destructive",
// // //         title: t("common.error"),
// // //         description: getSovereignMessage(error.message),
// // //       });
// // //       return "error";
// // //     } finally {
// // //       setIsProcessing(null);
// // //     }
// // //   };

// // //   const editTrip = async (trip: Trip, data: EditTripFormValues): Promise<boolean> => {
// // //     if (!firestore) return false;
// // //     if (trip.bookingIds && trip.bookingIds.length > 0) {
// // //       toast({
// // //         variant: "destructive",
// // //         title: "لا يمكن التعديل",
// // //         description: "لا يمكن تعديل الرحلة بعد تأكيد أول حجز.",
// // //       });
// // //       return false;
// // //     }
// // //     setIsProcessing(`edit-${trip.id}`);

// // //     try {
// // //       await updateDoc(doc(firestore, "trips", trip.id), {
// // //         departureDate: Timestamp.fromDate(new Date(data.departureDate)),
// // //         price: Number(data.price),
// // //         availableSeats: Number(data.availableSeats),
// // //         updatedAt: serverTimestamp(),
// // //       });
// // //       toast({ title: t("common.success") });
// // //       return true;
// // //     } catch (error: any) {
// // //       SovereignBlackBox.reportLethalCrash(error, "EDIT_TRIP_RUPTURE", { tripId: trip.id });
// // //       toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
// // //       return false;
// // //     } finally {
// // //       setIsProcessing(null);
// // //     }
// // //   };

// // //   return { isProcessing, completeTrip, travelerConfirmArrival, cancelTrip, editTrip, verifyBookingReceipt };
// // // }

// // // "use client";

// // // /**
// // //  * @hook useTripActions
// // //  * @description THE OPERATIONAL ENGINE (REINFORCED - SC-806 V6.6 - PROTOCOL 20)
// // //  * [SCR-061]: Injected verifyBookingReceipt for Carrier Handshake.
// // //  * [PROTOCOL 20]: Immune system integration. No swallowed exceptions.
// // //  * [FIX]: Added Offer Cleanup mechanism when a Carrier cancels their trip.
// // //  */

// // // import { useState } from "react";
// // // import { useFirestore, useFunctions } from "@/firebase";
// // // import { useToast } from "@/hooks/use-toast";
// // // import { useUserProfile } from "@/hooks/use-user-profile";
// // // // ✅ أضفنا collection, query, where, getDocs هنا
// // // import {
// // //   doc,
// // //   serverTimestamp,
// // //   Timestamp,
// // //   updateDoc,
// // //   runTransaction,
// // //   increment,
// // //   writeBatch,
// // //   collection,
// // //   query,
// // //   where,
// // //   getDocs,
// // // } from "firebase/firestore";
// // // import { httpsCallable } from "firebase/functions";
// // // import type { Trip, Booking } from "@/lib/data";
// // // import { type EditTripFormValues } from "@/components/carrier/edit-trip-dialog";
// // // import { useTranslations } from "next-intl";
// // // import { SovereignBlackBox } from "@/lib/sovereign-monitor";

// // // export function useTripActions() {
// // //   const firestore = useFirestore();
// // //   const functions = useFunctions();
// // //   const { toast } = useToast();
// // //   const t = useTranslations();
// // //   const tError = useTranslations("errorDictionary");
// // //   const { profile } = useUserProfile();
// // //   const [isProcessing, setIsProcessing] = useState<string | null>(null);

// // //   const getSovereignMessage = (code: string) => {
// // //     const normalizedCode = code?.toUpperCase() || "DEFAULT";
// // //     try {
// // //       const message = tError(normalizedCode);
// // //       return message === normalizedCode ? tError("DEFAULT") : message;
// // //     } catch {
// // //       return tError("DEFAULT");
// // //     }
// // //   };

// // //   /**
// // //    * verifyBookingReceipt
// // //    * [SCR-061]: Sovereign Handshake Finalization. Carrier authenticates the Voucher.
// // //    */
// // //   const verifyBookingReceipt = async (booking: Booking) => {
// // //     if (!firestore || !profile) return;
// // //     setIsProcessing(`verify-${booking.id}`);
// // //     try {
// // //       await runTransaction(firestore, async (transaction) => {
// // //         const bookingRef = doc(firestore, "bookings", booking.id);

// // //         // 1. Confirm Receipt & Seal Booking
// // //         transaction.update(bookingRef, {
// // //           status: "Confirmed",
// // //           verifiedAt: serverTimestamp(),
// // //           updatedAt: serverTimestamp(),
// // //         });

// // //         // 2. خصم المقاعد فقط لو لم يتم خصمها مسبقاً في handleTripCreated
// // //         // isPassengerTripDeleted = true يعني الناقل أنشأ رحلة جديدة وخصم المقاعد فيها بالفعل
// // //         const seatsAlreadyDeducted = !!(booking as any).isPassengerTripDeleted;
// // //         if (!seatsAlreadyDeducted) {
// // //           const seatsToBook = booking.seats || 1;
// // //           const targetTripId = (booking as any).carrierTripId || booking.tripId;
// // //           if (targetTripId) {
// // //             transaction.update(doc(firestore, "trips", targetTripId), {
// // //               availableSeats: increment(-seatsToBook),
// // //               updatedAt: serverTimestamp(),
// // //             });
// // //           }
// // //         }
// // //       });

// // //       toast({ title: "تم تأكيد استلام العربون! ✅", description: "أصبح الحجز مؤكداً والمقاعد محجوزة الآن." });
// // //     } catch (error: any) {
// // //       SovereignBlackBox.reportLethalCrash(error, "VERIFY_RECEIPT_RUPTURE", { bookingId: booking.id });
// // //       toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
// // //     } finally {
// // //       setIsProcessing(null);
// // //     }
// // //   };

// // //   const completeTrip = async (trip: Trip) => {
// // //     if (!functions || trip.status === "Completed" || !profile) return;
// // //     setIsProcessing(`complete-${trip.id}`);
// // //     try {
// // //       if (firestore && profile.id) {
// // //         await updateDoc(doc(firestore, "users", profile.id), {
// // //           currentActiveTripId: null,
// // //           updatedAt: serverTimestamp(),
// // //         });
// // //       }

// // //       const completeFn = httpsCallable(functions, "confirmArrivalSovereign");
// // //       await completeFn({ tripId: trip.id });

// // //       toast({ title: t("common.success") });
// // //     } catch (error: any) {
// // //       SovereignBlackBox.reportLethalCrash(error, "COMPLETE_TRIP_RUPTURE", { tripId: trip.id });
// // //       toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
// // //     } finally {
// // //       setIsProcessing(null);
// // //     }
// // //   };

// // //   const travelerConfirmArrival = async (tripId: string) => {
// // //     if (!functions) return;
// // //     setIsProcessing(`traveler-confirm-${tripId}`);
// // //     try {
// // //       const confirmFn = httpsCallable(functions, "confirmArrivalSovereign");
// // //       await confirmFn({ tripId });
// // //       toast({ title: t("common.success") });
// // //     } catch (error: any) {
// // //       SovereignBlackBox.reportLethalCrash(error, "TRAVELER_ARRIVAL_CONFIRM_RUPTURE", { tripId });
// // //       toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
// // //     } finally {
// // //       setIsProcessing(null);
// // //     }
// // //   };

// // //   const cancelTrip = async (trip: Trip, booking?: Booking): Promise<"cancelled" | "error"> => {
// // //     const cancelledBy = profile?.role === "carrier" ? "carrier" : "traveler";
// // //     setIsProcessing(`cancel-${booking?.id || trip.id}`);

// // //     try {
// // //       // Booking cancel stays callable
// // //       if (booking) {
// // //         if (!functions) return "error";

// // //         const cancelFn = httpsCallable(functions, "cancelBookingSovereign");
// // //         await cancelFn({
// // //           bookingId: booking.id,
// // //           reason: cancelledBy === "carrier" ? "إلغاء من طرف الناقل" : "إلغاء من طرف المسافر",
// // //           cancelledBy,
// // //         });

// // //         toast({ title: t("common.success") });
// // //         return "cancelled";
// // //       }

// // //       // Trip cancel = direct Firestore batch
// // //       if (!firestore) return "error";

// // //       const batch = writeBatch(firestore);
// // //       const tripRef = doc(firestore, "trips", trip.id);

// // //       // 1. تحديث حالة الرحلة إلى "ملغاة"
// // //       batch.update(tripRef, {
// // //         status: "Cancelled",
// // //         cancelReason: cancelledBy === "carrier" ? "إلغاء من طرف الناقل" : "إلغاء من طرف المسافر",
// // //         cancelledBy,
// // //         cancelledAt: serverTimestamp(),
// // //         updatedAt: serverTimestamp(),
// // //       });

// // //       // 2. تحرير الناقل من الرحلة النشطة
// // //       if (profile?.role === "carrier" && profile.id && profile.currentActiveTripId === trip.id) {
// // //         const userRef = doc(firestore, "users", profile.id);
// // //         batch.update(userRef, {
// // //           currentActiveTripId: null,
// // //           updatedAt: serverTimestamp(),
// // //         });
// // //       }

// // //       // 🚀 3. التنظيف التلقائي (Offer Cleanup): جلب ومسح جميع العروض المرتبطة بهذه الرحلة
// // //       const offersRef = collection(firestore, "offers");
// // //       const offersQuery = query(offersRef, where("carrierTripId", "==", trip.id));
// // //       const offersSnapshot = await getDocs(offersQuery);

// // //       offersSnapshot.forEach((offerDoc) => {
// // //         batch.delete(offerDoc.ref);
// // //       });

// // //       // تنفيذ الـ Batch بالكامل (إلغاء الرحلة + فك ارتباط الناقل + مسح العروض)
// // //       await batch.commit();

// // //       toast({ title: t("common.success") });
// // //       return "cancelled";
// // //     } catch (error: any) {
// // //       toast({
// // //         variant: "destructive",
// // //         title: t("common.error"),
// // //         description: getSovereignMessage(error.message),
// // //       });
// // //       return "error";
// // //     } finally {
// // //       setIsProcessing(null);
// // //     }
// // //   };

// // //   const editTrip = async (trip: Trip, data: EditTripFormValues): Promise<boolean> => {
// // //     if (!firestore) return false;
// // //     if (trip.bookingIds && trip.bookingIds.length > 0) {
// // //       toast({
// // //         variant: "destructive",
// // //         title: "لا يمكن التعديل",
// // //         description: "لا يمكن تعديل الرحلة بعد تأكيد أول حجز.",
// // //       });
// // //       return false;
// // //     }
// // //     setIsProcessing(`edit-${trip.id}`);

// // //     try {
// // //       await updateDoc(doc(firestore, "trips", trip.id), {
// // //         departureDate: Timestamp.fromDate(new Date(data.departureDate)),
// // //         price: Number(data.price),
// // //         availableSeats: Number(data.availableSeats),
// // //         depositPercentage: Number(data.depositPercentage),
// // //         updatedAt: serverTimestamp(),
// // //       });
// // //       toast({ title: t("common.success") });
// // //       return true;
// // //     } catch (error: any) {
// // //       SovereignBlackBox.reportLethalCrash(error, "EDIT_TRIP_RUPTURE", { tripId: trip.id });
// // //       toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
// // //       return false;
// // //     } finally {
// // //       setIsProcessing(null);
// // //     }
// // //   };

// // //   return { isProcessing, completeTrip, travelerConfirmArrival, cancelTrip, editTrip, verifyBookingReceipt };
// // // }

// // "use client";

// // /**
// //  * @hook useTripActions
// //  * @description THE OPERATIONAL ENGINE (REINFORCED - SC-806 V6.6 - PROTOCOL 20)
// //  * [SCR-061]: Injected verifyBookingReceipt for Carrier Handshake.
// //  * [PROTOCOL 20]: Immune system integration. No swallowed exceptions.
// //  * [FIX]: Added Offer Cleanup mechanism when a Carrier cancels their trip.
// //  * [FIX]: Synced Offer updates when Carrier edits trip details (Price/Deposit).
// //  */

// // import { useState } from "react";
// // import { useFirestore, useFunctions } from "@/firebase";
// // import { useToast } from "@/hooks/use-toast";
// // import { useUserProfile } from "@/hooks/use-user-profile";
// // import {
// //   doc,
// //   serverTimestamp,
// //   Timestamp,
// //   updateDoc,
// //   runTransaction,
// //   increment,
// //   writeBatch,
// //   collection,
// //   query,
// //   where,
// //   getDocs,
// // } from "firebase/firestore";
// // import { httpsCallable } from "firebase/functions";
// // import type { Trip, Booking } from "@/lib/data";
// // import { type EditTripFormValues } from "@/components/carrier/edit-trip-dialog";
// // import { useTranslations } from "next-intl";
// // import { SovereignBlackBox } from "@/lib/sovereign-monitor";

// // export function useTripActions() {
// //   const firestore = useFirestore();
// //   const functions = useFunctions();
// //   const { toast } = useToast();
// //   const t = useTranslations();
// //   const tError = useTranslations("errorDictionary");
// //   const { profile } = useUserProfile();
// //   const [isProcessing, setIsProcessing] = useState<string | null>(null);

// //   const getSovereignMessage = (code: string) => {
// //     const normalizedCode = code?.toUpperCase() || "DEFAULT";
// //     try {
// //       const message = tError(normalizedCode);
// //       return message === normalizedCode ? tError("DEFAULT") : message;
// //     } catch {
// //       return tError("DEFAULT");
// //     }
// //   };

// //   /**
// //    * verifyBookingReceipt
// //    * [SCR-061]: Sovereign Handshake Finalization. Carrier authenticates the Voucher.
// //    */
// //   const verifyBookingReceipt = async (booking: Booking) => {
// //     if (!firestore || !profile) return;
// //     setIsProcessing(`verify-${booking.id}`);
// //     try {
// //       await runTransaction(firestore, async (transaction) => {
// //         const bookingRef = doc(firestore, "bookings", booking.id);

// //         // 1. Confirm Receipt & Seal Booking
// //         transaction.update(bookingRef, {
// //           status: "Confirmed",
// //           verifiedAt: serverTimestamp(),
// //           updatedAt: serverTimestamp(),
// //         });

// //         // 2. خصم المقاعد فقط لو لم يتم خصمها مسبقاً في handleTripCreated
// //         // isPassengerTripDeleted = true يعني الناقل أنشأ رحلة جديدة وخصم المقاعد فيها بالفعل
// //         const seatsAlreadyDeducted = !!(booking as any).isPassengerTripDeleted;
// //         if (!seatsAlreadyDeducted) {
// //           const seatsToBook = booking.seats || 1;
// //           const targetTripId = (booking as any).carrierTripId || booking.tripId;
// //           if (targetTripId) {
// //             transaction.update(doc(firestore, "trips", targetTripId), {
// //               availableSeats: increment(-seatsToBook),
// //               updatedAt: serverTimestamp(),
// //             });
// //           }
// //         }
// //       });

// //       toast({ title: "تم تأكيد استلام العربون! ✅", description: "أصبح الحجز مؤكداً والمقاعد محجوزة الآن." });
// //     } catch (error: any) {
// //       SovereignBlackBox.reportLethalCrash(error, "VERIFY_RECEIPT_RUPTURE", { bookingId: booking.id });
// //       toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
// //     } finally {
// //       setIsProcessing(null);
// //     }
// //   };

// //   const completeTrip = async (trip: Trip) => {
// //     if (!functions || trip.status === "Completed" || !profile) return;
// //     setIsProcessing(`complete-${trip.id}`);
// //     try {
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
// //       SovereignBlackBox.reportLethalCrash(error, "COMPLETE_TRIP_RUPTURE", { tripId: trip.id });
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
// //       SovereignBlackBox.reportLethalCrash(error, "TRAVELER_ARRIVAL_CONFIRM_RUPTURE", { tripId });
// //       toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
// //     } finally {
// //       setIsProcessing(null);
// //     }
// //   };

// //   const cancelTrip = async (trip: Trip, booking?: Booking): Promise<"cancelled" | "error"> => {
// //     const cancelledBy = profile?.role === "carrier" ? "carrier" : "traveler";
// //     setIsProcessing(`cancel-${booking?.id || trip.id}`);

// //     try {
// //       // Booking cancel stays callable
// //       if (booking) {
// //         if (!functions) return "error";

// //         const cancelFn = httpsCallable(functions, "cancelBookingSovereign");
// //         await cancelFn({
// //           bookingId: booking.id,
// //           reason: cancelledBy === "carrier" ? "إلغاء من طرف الناقل" : "إلغاء من طرف المسافر",
// //           cancelledBy,
// //         });

// //         toast({ title: t("common.success") });
// //         return "cancelled";
// //       }

// //       // Trip cancel = direct Firestore batch
// //       if (!firestore) return "error";

// //       const batch = writeBatch(firestore);
// //       const tripRef = doc(firestore, "trips", trip.id);

// //       // 1. تحديث حالة الرحلة إلى "ملغاة"
// //       batch.update(tripRef, {
// //         status: "Cancelled",
// //         cancelReason: cancelledBy === "carrier" ? "إلغاء من طرف الناقل" : "إلغاء من طرف المسافر",
// //         cancelledBy,
// //         cancelledAt: serverTimestamp(),
// //         updatedAt: serverTimestamp(),
// //       });

// //       // 2. تحرير الناقل من الرحلة النشطة
// //       if (profile?.role === "carrier" && profile.id && profile.currentActiveTripId === trip.id) {
// //         const userRef = doc(firestore, "users", profile.id);
// //         batch.update(userRef, {
// //           currentActiveTripId: null,
// //           updatedAt: serverTimestamp(),
// //         });
// //       }

// //       // 🚀 3. التنظيف التلقائي (Offer Cleanup): جلب ومسح جميع العروض المرتبطة بهذه الرحلة
// //       const offersRef = collection(firestore, "offers");
// //       const offersQuery = query(offersRef, where("carrierTripId", "==", trip.id));
// //       const offersSnapshot = await getDocs(offersQuery);

// //       offersSnapshot.forEach((offerDoc) => {
// //         batch.delete(offerDoc.ref);
// //       });

// //       // تنفيذ الـ Batch بالكامل (إلغاء الرحلة + فك ارتباط الناقل + مسح العروض)
// //       await batch.commit();

// //       toast({ title: t("common.success") });
// //       return "cancelled";
// //     } catch (error: any) {
// //       toast({
// //         variant: "destructive",
// //         title: t("common.error"),
// //         description: getSovereignMessage(error.message),
// //       });
// //       return "error";
// //     } finally {
// //       setIsProcessing(null);
// //     }
// //   };

// //   // const editTrip = async (trip: Trip, data: EditTripFormValues): Promise<boolean> => {
// //   //   if (!firestore) return false;

// //   //   if (trip.bookingIds && trip.bookingIds.length > 0) {
// //   //     toast({
// //   //       variant: "destructive",
// //   //       title: "لا يمكن التعديل",
// //   //       description: "لا يمكن تعديل الرحلة بعد تأكيد أول حجز.",
// //   //     });
// //   //     return false;
// //   //   }
// //   //   setIsProcessing(`edit-${trip.id}`);

// //   //   try {
// //   //     // 🚀 استخدام Batch لتحديث الرحلة والعروض معاً في نفس اللحظة
// //   //     const batch = writeBatch(firestore);

// //   //     // 1. تحديث مستند الرحلة الأصلي (Trip)
// //   //     const tripRef = doc(firestore, "trips", trip.id);
// //   //     batch.update(tripRef, {
// //   //       departureDate: Timestamp.fromDate(new Date(data.departureDate)),
// //   //       price: Number(data.price),
// //   //       availableSeats: Number(data.availableSeats),
// //   //       depositPercentage: Number(data.depositPercentage),
// //   //       updatedAt: serverTimestamp(),
// //   //     });

// //   //     // 2. تحديث جميع العروض (Offers) المرتبطة بهذه الرحلة في السوق
// //   //     const offersRef = collection(firestore, "offers");
// //   //     const offersQuery = query(offersRef, where("carrierTripId", "==", trip.id));
// //   //     const offersSnapshot = await getDocs(offersQuery);

// //   //     offersSnapshot.forEach((offerDoc) => {
// //   //       batch.update(offerDoc.ref, {
// //   //         price: Number(data.price), // تحديث السعر أيضاً في العروض
// //   //         depositPercentage: Number(data.depositPercentage), // تحديث العربون في العروض
// //   //         updatedAt: serverTimestamp(),
// //   //       });
// //   //     });

// //   //     // تنفيذ التحديثات دفعة واحدة
// //   //     await batch.commit();

// //   //     toast({ title: t("common.success") });
// //   //     return true;
// //   //   } catch (error: any) {
// //   //     SovereignBlackBox.reportLethalCrash(error, "EDIT_TRIP_RUPTURE", { tripId: trip.id });
// //   //     toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
// //   //     return false;
// //   //   } finally {
// //   //     setIsProcessing(null);
// //   //   }
// //   // };
// //   const editTrip = async (trip: Trip, data: EditTripFormValues): Promise<boolean> => {
// //     alert("الخطوة 2: وصلنا لدالة فايربيز.. جاري الاتصال بقاعدة البيانات.");

// //     if (!firestore) {
// //       alert("خطأ: لا يوجد اتصال بخوادم فايربيز (firestore is null)");
// //       return false;
// //     }

// //     try {
// //       const batch = writeBatch(firestore);

// //       // تحديث الرحلة الأصلية
// //       const tripRef = doc(firestore, "trips", trip.id);
// //       batch.update(tripRef, {
// //         depositPercentage: Number(data.depositPercentage),
// //         price: Number(data.price),
// //         updatedAt: serverTimestamp(),
// //       });

// //       // جلب وتحديث العروض
// //       const offersRef = collection(firestore, "offers");
// //       const offersQuery = query(offersRef, where("carrierTripId", "==", trip.id));
// //       const offersSnapshot = await getDocs(offersQuery);

// //       offersSnapshot.forEach((offerDoc) => {
// //         batch.update(offerDoc.ref, {
// //           depositPercentage: Number(data.depositPercentage),
// //           price: Number(data.price),
// //           updatedAt: serverTimestamp(),
// //         });
// //       });

// //       await batch.commit();
// //       alert("الخطوة 3: تم الحفظ في قاعدة بيانات فايربيز بنجاح!");
// //       toast({ title: t("common.success") });
// //       return true;
// //     } catch (error: any) {
// //       alert("الخطوة 3 (فشل): حدث خطأ من فايربيز: " + error.message);
// //       return false;
// //     } finally {
// //       setIsProcessing(null);
// //     }
// //   };
// //   return { isProcessing, completeTrip, travelerConfirmArrival, cancelTrip, editTrip, verifyBookingReceipt };
// // }

// "use client";

// /**
//  * @hook useTripActions
//  * @description THE OPERATIONAL ENGINE (REINFORCED - SC-806 V6.6 - PROTOCOL 20)
//  * [SCR-061]: Injected verifyBookingReceipt for Carrier Handshake.
//  * [PROTOCOL 20]: Immune system integration. No swallowed exceptions.
//  * [FIX]: Added Offer Cleanup mechanism when a Carrier cancels their trip.
//  * [FIX]: Synced Offer updates when Carrier edits trip details (Price/Deposit).
//  */

// import { useState } from "react";
// import { useFirestore, useFunctions } from "@/firebase";
// import { useToast } from "@/hooks/use-toast";
// import { useUserProfile } from "@/hooks/use-user-profile";
// import {
//   doc,
//   serverTimestamp,
//   Timestamp,
//   updateDoc,
//   runTransaction,
//   increment,
//   writeBatch,
//   collection,
//   query,
//   where,
//   getDocs,
//   addDoc,
// } from "firebase/firestore";
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

//   const verifyBookingReceipt = async (booking: Booking) => {
//     if (!firestore || !profile) return;
//     setIsProcessing(`verify-${booking.id}`);
//     try {
//       await runTransaction(firestore, async (transaction) => {
//         const bookingRef = doc(firestore, "bookings", booking.id);

//         transaction.update(bookingRef, {
//           status: "Confirmed",
//           verifiedAt: serverTimestamp(),
//           updatedAt: serverTimestamp(),
//         });

//         const seatsAlreadyDeducted = !!(booking as any).isPassengerTripDeleted;
//         if (!seatsAlreadyDeducted) {
//           const seatsToBook = booking.seats || 1;
//           const targetTripId = (booking as any).carrierTripId || booking.tripId;
//           if (targetTripId) {
//             transaction.update(doc(firestore, "trips", targetTripId), {
//               availableSeats: increment(-seatsToBook),
//               updatedAt: serverTimestamp(),
//             });
//           }
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

//   const cancelTrip = async (trip: Trip, booking?: Booking): Promise<"cancelled" | "error"> => {
//     const cancelledBy = profile?.role === "carrier" ? "carrier" : "traveler";
//     setIsProcessing(`cancel-${booking?.id || trip.id}`);

//     try {
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

//       const offersRef = collection(firestore, "offers");
//       const offersQuery = query(offersRef, where("carrierTripId", "==", trip.id));
//       const offersSnapshot = await getDocs(offersQuery);

//       offersSnapshot.forEach((offerDoc) => {
//         batch.delete(offerDoc.ref);
//       });

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

//   // 🚀 دالة التحديث النهائية (تم دمج التحديثين للرحلة والعروض معاً)
//   // const editTrip = async (trip: Trip, data: EditTripFormValues): Promise<boolean> => {
//   //   if (!firestore) return false;
//   //   if (trip.bookingIds && trip.bookingIds.length > 0) {
//   //     toast({
//   //       variant: "destructive",
//   //       title: "لا يمكن التعديل",
//   //       description: "لا يمكن تعديل الرحلة بعد تأكيد أول حجز.",
//   //     });
//   //     return false;
//   //   }

//   //   setIsProcessing(`edit-${trip.id}`);

//   //   try {
//   //     const batch = writeBatch(firestore);

//   //     // 1. تحديث مستند الرحلة الأصلي (لكي يراها الناقل)
//   //     const tripRef = doc(firestore, "trips", trip.id);
//   //     batch.update(tripRef, {
//   //       departureDate: Timestamp.fromDate(new Date(data.departureDate)),
//   //       price: Number(data.price),
//   //       depositPercentage: Number(data.depositPercentage), // تحديث العربون
//   //       updatedAt: serverTimestamp(),
//   //     });

//   //     // 2. تحديث جميع العروض المرتبطة (لكي يراها المسافرون في السوق)
//   //     const offersRef = collection(firestore, "offers");
//   //     const offersQuery = query(offersRef, where("carrierTripId", "==", trip.id));
//   //     const offersSnapshot = await getDocs(offersQuery);

//   //     offersSnapshot.forEach((offerDoc) => {
//   //       batch.update(offerDoc.ref, {
//   //         price: Number(data.price),
//   //         depositPercentage: Number(data.depositPercentage), // تحديث العربون في العروض
//   //         updatedAt: serverTimestamp(),
//   //       });
//   //     });

//   //     // تنفيذ الحفظ
//   //     await batch.commit();

//   //     toast({ title: t("common.success") });
//   //     return true;
//   //   } catch (error: any) {
//   //     console.error("EDIT_TRIP_ERROR:", error);
//   //     toast({ variant: "destructive", title: t("common.error"), description: "فشل تحديث البيانات." });
//   //     return false;
//   //   } finally {
//   //     setIsProcessing(null);
//   //   }
//   // };
//   // 🚀 دالة التحديث النهائية (تم دمج التحديثين للرحلة والعروض معاً وتظبيط الوقت)
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
//       const batch = writeBatch(firestore);

//       // 🛠️ دمج التاريخ مع الوقت الصحيح
//       const finalDateObj = new Date(data.departureDate);
//       if (data.departureTime) {
//         const [hours, minutes] = data.departureTime.split(":");
//         finalDateObj.setHours(Number(hours), Number(minutes), 0, 0);
//       }

//       // 1. تحديث مستند الرحلة الأصلي
//       const tripRef = doc(firestore, "trips", trip.id);
//       batch.update(tripRef, {
//         departureDate: Timestamp.fromDate(finalDateObj), // التاريخ مدمج مع الوقت
//         departureTime: data.departureTime || trip.departureTime || "", // حفظ حقل الوقت منفصل لو تحب
//         price: Number(data.price),
//         depositPercentage: Number(data.depositPercentage),
//         updatedAt: serverTimestamp(),
//       });

//       // 2. تحديث جميع العروض المرتبطة (لكي يراها المسافرون في السوق)
//       const offersRef = collection(firestore, "offers");
//       const offersQuery = query(offersRef, where("carrierTripId", "==", trip.id));
//       const offersSnapshot = await getDocs(offersQuery);

//       offersSnapshot.forEach((offerDoc) => {
//         batch.update(offerDoc.ref, {
//           departureDate: Timestamp.fromDate(finalDateObj), // تحديث التاريخ هنا كمان
//           departureTime: data.departureTime || trip.departureTime || "",
//           price: Number(data.price),
//           depositPercentage: Number(data.depositPercentage),
//           updatedAt: serverTimestamp(),
//         });
//       });

//       // تنفيذ الحفظ
//       await batch.commit();

//       toast({ title: t("common.success") });
//       return true;
//     } catch (error: any) {
//       console.error("EDIT_TRIP_ERROR:", error);
//       toast({ variant: "destructive", title: t("common.error"), description: "فشل تحديث البيانات." });
//       return false;
//     } finally {
//       setIsProcessing(null);
//     }
//   };
//   // 🚀 إضافة دالة طلب تعديل موعد الرحلة (تُستدعى عندما يكون هناك ركاب)
//   const requestTripModification = async (tripId: string, newDate: Date, newTime: string, reason: string): Promise<boolean> => {
//     if (!firestore || !profile) return false;
//     setIsProcessing(`request-mod-${tripId}`);

//     try {
//       // إرسال الطلب لـ Firestore
//       await addDoc(collection(firestore, "trip_modifications"), {
//         tripId,
//         carrierId: profile.id,
//         newDate: Timestamp.fromDate(newDate),
//         newTime,
//         reason,
//         status: "Pending", // Pending, Approved, Rejected
//         acceptedBy: [], // مصفوفة لتخزين الـ IDs للمسافرين الذين وافقوا
//         rejectedBy: null, // سيخزن ID المسافر الذي يرفض أولاً
//         createdAt: serverTimestamp(),
//       });

//       toast({
//         title: "تم إرسال الطلب السيادي! 📡",
//         description: "تم إشعار المسافرين بطلب تعديل الموعد. سيتم التحديث فور موافقتهم جميعاً.",
//       });
//       return true;
//     } catch (error: any) {
//       SovereignBlackBox.reportLethalCrash(error, "TRIP_MODIFICATION_RUPTURE", { tripId });
//       toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
//       return false;
//     } finally {
//       setIsProcessing(null);
//     }
//   };

//   // تأكد إنك بتعمل return للدالة في آخر الـ Hook
//   return { isProcessing, completeTrip, travelerConfirmArrival, cancelTrip, editTrip, verifyBookingReceipt, requestTripModification };
//   // return { isProcessing, completeTrip, travelerConfirmArrival, cancelTrip, editTrip, verifyBookingReceipt };
// }

"use client";

/**
 * @hook useTripActions
 * @description THE OPERATIONAL ENGINE (REINFORCED - SC-806 V6.6 - PROTOCOL 20)
 * [SCR-061]: Injected verifyBookingReceipt for Carrier Handshake.
 * [PROTOCOL 20]: Immune system integration. No swallowed exceptions.
 * [FIX]: Added Offer Cleanup mechanism when a Carrier cancels their trip.
 * [FIX]: Synced Offer updates when Carrier edits trip details (Price/Deposit).
 */

import { useState } from "react";
import { useFirestore, useFunctions } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { useUserProfile } from "@/hooks/use-user-profile";
import {
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
  runTransaction,
  increment,
  writeBatch,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  addDoc,
} from "firebase/firestore";
import { sendPush } from "@/lib/send-push";
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

  const verifyBookingReceipt = async (booking: Booking) => {
    if (!firestore || !profile) return;
    setIsProcessing(`verify-${booking.id}`);
    try {
      await runTransaction(firestore, async (transaction) => {
        const bookingRef = doc(firestore, "bookings", booking.id);

        transaction.update(bookingRef, {
          status: "Confirmed",
          verifiedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        const seatsAlreadyDeducted = !!(booking as any).isPassengerTripDeleted;
        if (!seatsAlreadyDeducted) {
          const seatsToBook = booking.seats || 1;
          const targetTripId = (booking as any).carrierTripId || booking.tripId;
          if (targetTripId) {
            transaction.update(doc(firestore, "trips", targetTripId), {
              availableSeats: increment(-seatsToBook),
              updatedAt: serverTimestamp(),
            });
          }
        }
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

  const cancelTrip = async (trip: Trip, booking?: Booking): Promise<"cancelled" | "error"> => {
    const cancelledBy = profile?.role === "carrier" ? "carrier" : "traveler";
    setIsProcessing(`cancel-${booking?.id || trip.id}`);

    try {
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

      const offersRef = collection(firestore, "offers");
      const offersQuery = query(offersRef, where("carrierTripId", "==", trip.id));
      const offersSnapshot = await getDocs(offersQuery);

      offersSnapshot.forEach((offerDoc) => {
        batch.delete(offerDoc.ref);
      });

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

  // 🚀 دالة التحديث النهائية (تم دمج التحديثين للرحلة والعروض معاً)
  // const editTrip = async (trip: Trip, data: EditTripFormValues): Promise<boolean> => {
  //   if (!firestore) return false;
  //   if (trip.bookingIds && trip.bookingIds.length > 0) {
  //     toast({
  //       variant: "destructive",
  //       title: "لا يمكن التعديل",
  //       description: "لا يمكن تعديل الرحلة بعد تأكيد أول حجز.",
  //     });
  //     return false;
  //   }

  //   setIsProcessing(`edit-${trip.id}`);

  //   try {
  //     const batch = writeBatch(firestore);

  //     // 1. تحديث مستند الرحلة الأصلي (لكي يراها الناقل)
  //     const tripRef = doc(firestore, "trips", trip.id);
  //     batch.update(tripRef, {
  //       departureDate: Timestamp.fromDate(new Date(data.departureDate)),
  //       price: Number(data.price),
  //       depositPercentage: Number(data.depositPercentage), // تحديث العربون
  //       updatedAt: serverTimestamp(),
  //     });

  //     // 2. تحديث جميع العروض المرتبطة (لكي يراها المسافرون في السوق)
  //     const offersRef = collection(firestore, "offers");
  //     const offersQuery = query(offersRef, where("carrierTripId", "==", trip.id));
  //     const offersSnapshot = await getDocs(offersQuery);

  //     offersSnapshot.forEach((offerDoc) => {
  //       batch.update(offerDoc.ref, {
  //         price: Number(data.price),
  //         depositPercentage: Number(data.depositPercentage), // تحديث العربون في العروض
  //         updatedAt: serverTimestamp(),
  //       });
  //     });

  //     // تنفيذ الحفظ
  //     await batch.commit();

  //     toast({ title: t("common.success") });
  //     return true;
  //   } catch (error: any) {
  //     console.error("EDIT_TRIP_ERROR:", error);
  //     toast({ variant: "destructive", title: t("common.error"), description: "فشل تحديث البيانات." });
  //     return false;
  //   } finally {
  //     setIsProcessing(null);
  //   }
  // };
  // 🚀 دالة التحديث النهائية (تم دمج التحديثين للرحلة والعروض معاً وتظبيط الوقت)
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
      const batch = writeBatch(firestore);

      // 🛠️ دمج التاريخ مع الوقت الصحيح
      const finalDateObj = new Date(data.departureDate);
      if (data.departureTime) {
        const [hours, minutes] = data.departureTime.split(":");
        finalDateObj.setHours(Number(hours), Number(minutes), 0, 0);
      }

      // 1. تحديث مستند الرحلة الأصلي
      const tripRef = doc(firestore, "trips", trip.id);
      batch.update(tripRef, {
        departureDate: Timestamp.fromDate(finalDateObj), // التاريخ مدمج مع الوقت
        departureTime: data.departureTime || trip.departureTime || "", // حفظ حقل الوقت منفصل لو تحب
        price: Number(data.price),
        depositPercentage: Number(data.depositPercentage),
        updatedAt: serverTimestamp(),
      });

      // 2. تحديث جميع العروض المرتبطة (لكي يراها المسافرون في السوق)
      const offersRef = collection(firestore, "offers");
      const offersQuery = query(offersRef, where("carrierTripId", "==", trip.id));
      const offersSnapshot = await getDocs(offersQuery);

      offersSnapshot.forEach((offerDoc) => {
        batch.update(offerDoc.ref, {
          departureDate: Timestamp.fromDate(finalDateObj), // تحديث التاريخ هنا كمان
          departureTime: data.departureTime || trip.departureTime || "",
          price: Number(data.price),
          depositPercentage: Number(data.depositPercentage),
          updatedAt: serverTimestamp(),
        });
      });

      // تنفيذ الحفظ
      await batch.commit();

      toast({ title: t("common.success") });
      return true;
    } catch (error: any) {
      console.error("EDIT_TRIP_ERROR:", error);
      toast({ variant: "destructive", title: t("common.error"), description: "فشل تحديث البيانات." });
      return false;
    } finally {
      setIsProcessing(null);
    }
  };
  // 🚀 إضافة دالة طلب تعديل موعد الرحلة (تُستدعى عندما يكون هناك ركاب)
  const requestTripModification = async (tripId: string, newDate: Date, newTime: string, reason: string): Promise<boolean> => {
    if (!firestore || !profile) return false;
    setIsProcessing(`request-mod-${tripId}`);

    try {
      // إرسال الطلب لـ Firestore
      await addDoc(collection(firestore, "trip_modifications"), {
        tripId,
        carrierId: profile.id,
        newDate: Timestamp.fromDate(newDate),
        newTime,
        reason,
        status: "Pending", // Pending, Approved, Rejected
        acceptedBy: [], // مصفوفة لتخزين الـ IDs للمسافرين الذين وافقوا
        rejectedBy: null, // سيخزن ID المسافر الذي يرفض أولاً
        createdAt: serverTimestamp(),
      });

      // ── إشعار المسافرين بطلب التعديل ──
      try {
        const tripSnap = await getDoc(doc(firestore, "trips", tripId));
        const tripData = tripSnap.data();
        const bookingIds: string[] = tripData?.bookingIds ?? [];

        const formattedDate = newDate.toLocaleDateString("ar-EG", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        const notifTitle = "طلب تعديل موعد الرحلة ✏️";
        const notifMessage = `الناقل يطلب تغيير موعد الانطلاق إلى ${formattedDate} الساعة ${newTime}. السبب: ${reason}`;

        await Promise.all(
          bookingIds.map(async (bookingId) => {
            const bookingSnap = await getDoc(doc(firestore, "bookings", bookingId));
            if (!bookingSnap.exists()) return;
            const bookingData = bookingSnap.data();
            const travelerId: string | undefined = bookingData?.userId;
            if (!travelerId) return;

            // إشعار داخل التطبيق
            await addDoc(collection(doc(firestore, "users", travelerId), "notifications"), {
              userId: travelerId,
              title: notifTitle,
              message: notifMessage,
              type: "trip_update",
              tripId,
              isRead: false,
              link: `/history`,
              createdAt: serverTimestamp(),
            });

            // Push notification
            await sendPush({ userId: travelerId, title: notifTitle, body: notifMessage, data: { type: "trip_update", tripId } });
          }),
        );
      } catch (notifErr) {
        console.warn("[requestTripModification] Notification failed (non-critical):", notifErr);
      }

      toast({
        title: "تم إرسال الطلب السيادي! 📡",
        description: "تم إشعار المسافرين بطلب تعديل الموعد. سيتم التحديث فور موافقتهم جميعاً.",
      });
      return true;
    } catch (error: any) {
      SovereignBlackBox.reportLethalCrash(error, "TRIP_MODIFICATION_RUPTURE", { tripId });
      toast({ variant: "destructive", title: t("common.error"), description: getSovereignMessage(error.message) });
      return false;
    } finally {
      setIsProcessing(null);
    }
  };

  // تأكد إنك بتعمل return للدالة في آخر الـ Hook
  return { isProcessing, completeTrip, travelerConfirmArrival, cancelTrip, editTrip, verifyBookingReceipt, requestTripModification };
  // return { isProcessing, completeTrip, travelerConfirmArrival, cancelTrip, editTrip, verifyBookingReceipt };
}
