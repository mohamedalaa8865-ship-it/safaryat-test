// // "use client";

// // /**
// //  * @hook useHistoryOps
// //  * @description THE REINFORCED OPERATIONAL REACTOR (STERILIZED - V6.5 - PROTOCOL 20)
// //  * [SCR-065]: Injected Financial Snapshotting and Atomic Voucher Generation.
// //  * [PROTOCOL 20]: Immune system integration. No swallowed exceptions.
// //  */

// // import { useState, useCallback } from "react";
// // import { useFirestore } from "@/firebase";
// // import { doc, serverTimestamp, collection, runTransaction, deleteField, getDoc, increment } from "firebase/firestore";
// // import { useToast } from "@/hooks/use-toast";
// // import { getErrorMessage } from "@/lib/error-dictionary";
// // import type { Trip, Offer, Booking, UserProfile } from "@/lib/data";
// // import { SovereignBlackBox } from "@/lib/sovereign-monitor";

// // export function useHistoryOps(user: any) {
// //   const firestore = useFirestore();
// //   const { toast } = useToast();

// //   const [isProcessingOffer, setIsProcessingOffer] = useState(false);
// //   const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);
// //   const [isCancelling, setIsCancelling] = useState(false);

// //   /**
// //    * handleAcceptOffer
// //    * [SCR-065]: Now takes a snapshot of the carrier's wallet matrix to ensure financial integrity.
// //    */
// //   const handleAcceptOffer = useCallback(
// //     async (trip: Trip, offer: Offer, onSuccess: (bookingId: string) => void) => {
// //       if (!firestore || !user) return;
// //       setIsProcessingOffer(true);
// //       try {
// //         // 1. Fetch Carrier's Official Wallet Matrix for snapshotting
// //         const carrierSnap = await getDoc(doc(firestore, "users", offer.carrierId));
// //         const carrierData = carrierSnap.data() as UserProfile;
// //         const walletSnapshot = carrierData?.paymentWallets || [];

// //         // 2. Atomic Transaction: Transition from Request to Sealed Booking
// //         let newBookingId = "";
// //         await runTransaction(firestore, async (transaction) => {
// //           const tripRef = doc(firestore, "trips", trip.id);
// //           const offerRef = doc(firestore, "offers", offer.id);
// //           const bookingRef = doc(collection(firestore, "bookings"));
// //           newBookingId = bookingRef.id;

// //           transaction.update(tripRef, {
// //             status: "Pending-Carrier-Confirmation",
// //             carrierTripId: offer.carrierTripId || null,
// //             carrierId: offer.carrierId,
// //             carrierName: offer.carrierName || "",
// //             price: offer.price,
// //             currency: offer.currency,
// //             depositPercentage: offer.depositPercentage || 10,
// //             meetingPoint: offer.meetingPoint || trip.meetingPoint || "",
// //             acceptedOfferId: offer.id,
// //             updatedAt: serverTimestamp(),
// //           });

// //           transaction.update(offerRef, { status: "Accepted" });

// //           transaction.set(bookingRef, {
// //             id: bookingRef.id,
// //             tripId: trip.id,
// //             carrierTripId: offer.carrierTripId || null,
// //             userId: user.uid,
// //             carrierId: offer.carrierId,
// //             seats: trip.passengers || 1,
// //             status: "Pending-Carrier-Confirmation",
// //             totalPrice: offer.price,
// //             currency: offer.currency || "JOD",
// //             passengersDetails: trip.passengersDetails || [],
// //             paymentSnapshot: walletSnapshot, // [SCR-065] LOCKING FINANCIAL CHANNELS
// //             createdAt: serverTimestamp(),
// //             updatedAt: serverTimestamp(),
// //           });

// //           // \u2705 activeBookingId مبيتعملش هنا — بيتحدد بس لما المسافر يؤكد من صفحة confirm-booking
// //           // لو حدثناه هنا، الـ Firestore listener هيحوّل engagementType لـ BOOKING فوراً
// //           // وهينقل الـ UI لشاشة انتظار الناقل قبل ما يبعت الإيميل
// //           // الـ activeIntentId هيفضل كما هو — المسافر يفضل في شاشة العروض لحد ما يأكد من الإيميل
// //         });

// //         toast({ title: "تم قبول العرض! ✅", description: "في انتظار تأكيد الناقل النهائي." });
// //         // [FIX]: نبعت bookingId لـ onSuccess عشان يتحط في الـ token
// //         onSuccess(newBookingId);
// //       } catch (error: any) {
// //         SovereignBlackBox.reportLethalCrash(error, "ACCEPT_OFFER_RUPTURE", { tripId: trip.id, offerId: offer.id });
// //         toast({ variant: "destructive", title: getErrorMessage(error, "فشل قبول العرض السيادي") });
// //       } finally {
// //         setIsProcessingOffer(false);
// //       }
// //     },
// //     [firestore, user, toast],
// //   );

// //   /**
// //    * handleConfirmPayment
// //    * [SCR-061]: Atomic Voucher Generation. Links Traveler and Carrier via Unique Seal.
// //    */
// //   const handleConfirmPayment = useCallback(
// //     async (booking: Booking, onSuccess: () => void) => {
// //       if (!firestore) return;
// //       setIsConfirmingPayment(true);
// //       try {
// //         const voucherId = `PAY-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
// //         const bookingRef = doc(firestore, "bookings", booking.id);
// //         const tripRef = doc(firestore, "trips", booking.tripId);
// //         const notificationRef = doc(collection(firestore, "notifications"));

// //         await runTransaction(firestore, async (transaction) => {
// //           // [FIX]: status بيبقى Pending-Payment-Verification مش Confirmed مباشرة
// //           // الناقل لازم يختم الاستلام أولاً قبل ما يبقى Confirmed
// //           transaction.update(bookingRef, {
// //             status: "Pending-Payment-Verification",
// //             depositVoucherId: voucherId,
// //             paymentDeclaredAt: serverTimestamp(),
// //             updatedAt: serverTimestamp(),
// //           });

// //           // [FIX]: خصم المقاعد بيحصل في verifyBookingReceipt لما الناقل يختم — مش هنا

// //           // ✅ إشعار للناقل
// //           transaction.set(notificationRef, {
// //             userId: booking.carrierId,
// //             title: "المسافر أكد الدفع — راجع السند ✅",
// //             message: `المسافر أرسل إشعار الدفع — رقم السند: ${voucherId} — اضغط لتأكيد الاستلام`,
// //             type: "payment_declared",
// //             bookingId: booking.id,
// //             isRead: false,
// //             createdAt: serverTimestamp(),
// //           });
// //         });

// //         toast({
// //           title: "تم تأكيد الدفع! 💳",
// //           description: "سيتم إعلام الناقل بتأكيد دفع العربون.",
// //         });
// //         onSuccess();
// //       } catch (error: any) {
// //         SovereignBlackBox.reportLethalCrash(error, "PAYMENT_CONFIRMATION_RUPTURE", { bookingId: booking.id });
// //         toast({ variant: "destructive", title: getErrorMessage(error, "فشل تأكيد النبض المالي") });
// //       } finally {
// //         setIsConfirmingPayment(false);
// //       }
// //     },
// //     [firestore, toast],
// //   );

// //   const handleConfirmCancellation = useCallback(
// //     async (booking: Booking, reason: string, onSuccess: () => void) => {
// //       if (!firestore || !user) return;
// //       setIsCancelling(true);
// //       try {
// //         const bookingRef = doc(firestore, "bookings", booking.id);
// //         const userRef = doc(firestore, "users", user.uid);

// //         await runTransaction(firestore, async (transaction) => {
// //           transaction.update(bookingRef, {
// //             status: "Cancelled",
// //             cancelReason: reason,
// //             cancelledBy: "traveler",
// //             cancelledAt: serverTimestamp(),
// //             updatedAt: serverTimestamp(),
// //           });

// //           if (["Confirmed", "Pending-Payment", "Pending-Payment-Verification"].includes(booking.status)) {
// //             const seatsToRestore = booking.seats || 1;
// //             // [FIX]: رجّع الكراسي للـ carrierTripId (رحلة الناقل) لو موجود
// //             if (booking.carrierTripId) {
// //               transaction.update(doc(firestore, "trips", booking.carrierTripId), {
// //                 availableSeats: increment(seatsToRestore),
// //                 updatedAt: serverTimestamp(),
// //               });
// //             }
// //             // ورجّع للـ tripId (رحلة المسافر) دايماً
// //             if (booking.tripId) {
// //               transaction.update(doc(firestore, "trips", booking.tripId), {
// //                 availableSeats: increment(seatsToRestore),
// //                 updatedAt: serverTimestamp(),
// //               });
// //             }
// //           }

// //           transaction.update(userRef, {
// //             activeBookingId: deleteField(),
// //             activeIntentId: deleteField(),
// //             updatedAt: serverTimestamp(),
// //           });
// //         });

// //         toast({ title: "تم إلغاء الحجز بنجاح ✅" });
// //         onSuccess();
// //       } catch (error: any) {
// //         SovereignBlackBox.reportLethalCrash(error, "CANCELLATION_RUPTURE", { bookingId: booking.id });
// //         toast({ variant: "destructive", title: getErrorMessage(error, "فشل إلغاء الحجز الموثق") });
// //       } finally {
// //         setIsCancelling(false);
// //       }
// //     },
// //     [firestore, user, toast],
// //   );

// //   const handleWithdrawRequest = useCallback(
// //     async (tripId: string) => {
// //       if (!firestore || !user) return;
// //       try {
// //         const { updateDoc } = await import("firebase/firestore");
// //         await updateDoc(doc(firestore, "trips", tripId), {
// //           status: "Cancelled",
// //           updatedAt: serverTimestamp(),
// //         });
// //         await updateDoc(doc(firestore, "users", user.uid), {
// //           activeIntentId: deleteField(),
// //           updatedAt: serverTimestamp(),
// //         });
// //         toast({ title: "تم سحب الطلب بنجاح" });
// //       } catch (error: any) {
// //         SovereignBlackBox.reportLethalCrash(error, "WITHDRAW_REQUEST_RUPTURE", { tripId });
// //         toast({ variant: "destructive", title: getErrorMessage(error, "فشل سحب الطلب من السوق") });
// //       }
// //     },
// //     [firestore, user, toast],
// //   );

// //   return {
// //     isProcessingOffer,
// //     isConfirmingPayment,
// //     isCancelling,
// //     handleAcceptOffer,
// //     handleConfirmPayment,
// //     handleConfirmCancellation,
// //     handleWithdrawRequest,
// //   };
// // }

// "use client";

// import { useState, useCallback } from "react";
// import { useFirestore } from "@/firebase";
// import { doc, serverTimestamp, collection, runTransaction, deleteField, getDoc, increment } from "firebase/firestore";
// import { useToast } from "@/hooks/use-toast";
// import { getErrorMessage } from "@/lib/error-dictionary";
// import type { Trip, Offer, Booking, UserProfile } from "@/lib/data";
// import { SovereignBlackBox } from "@/lib/sovereign-monitor";

// export function useHistoryOps(user: any) {
//   const firestore = useFirestore();
//   const { toast } = useToast();

//   const [isProcessingOffer, setIsProcessingOffer] = useState(false);
//   const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);
//   const [isCancelling, setIsCancelling] = useState(false);

//   const handleAcceptOffer = useCallback(
//     async (trip: Trip, offer: Offer, onSuccess: (bookingId: string) => void) => {
//       if (!firestore || !user) return;
//       setIsProcessingOffer(true);
//       try {
//         // 1. جلب المحفظة المالية للناقل
//         const carrierSnap = await getDoc(doc(firestore, "users", offer.carrierId));
//         const carrierData = carrierSnap.data() as UserProfile;
//         const walletSnapshot = carrierData?.paymentWallets || [];

//         // 🚀 2. [SMART MATCH]: جلب رحلة الناقل لنسخ التوقيت والمدة الحقيقية
//         let exactDepartureTime = (offer as any).departureTime || null;
//         let exactDurationHours = (offer as any).estimatedDurationHours || null;

//         if (offer.carrierTripId) {
//           const carrierTripSnap = await getDoc(doc(firestore, "trips", offer.carrierTripId));
//           if (carrierTripSnap.exists()) {
//             const ctData = carrierTripSnap.data();
//             if (ctData.departureTime) exactDepartureTime = ctData.departureTime;
//             if (ctData.estimatedDurationHours) exactDurationHours = ctData.estimatedDurationHours;
//           }
//         }

//         let newBookingId = "";
//         await runTransaction(firestore, async (transaction) => {
//           const tripRef = doc(firestore, "trips", trip.id);
//           const offerRef = doc(firestore, "offers", offer.id);
//           const bookingRef = doc(collection(firestore, "bookings"));
//           newBookingId = bookingRef.id;

//           const tripUpdateData: any = {
//             status: "Pending-Carrier-Confirmation",
//             carrierTripId: offer.carrierTripId || null,
//             carrierId: offer.carrierId,
//             carrierName: offer.carrierName || "",
//             price: offer.price,
//             currency: offer.currency,
//             depositPercentage: offer.depositPercentage || 10,
//             meetingPoint: offer.meetingPoint || trip.meetingPoint || "",
//             acceptedOfferId: offer.id,
//             updatedAt: serverTimestamp(),
//           };

//           // 🌟 زرع الوقت والمدة بشكل نهائي في تذكرة المسافر لتُقرأ في HeroTicket بشكل صحيح
//           if (exactDepartureTime) tripUpdateData.departureTime = exactDepartureTime;
//           if (exactDurationHours) tripUpdateData.estimatedDurationHours = exactDurationHours;

//           transaction.update(tripRef, tripUpdateData);
//           transaction.update(offerRef, { status: "Accepted" });

//           transaction.set(bookingRef, {
//             id: bookingRef.id,
//             tripId: trip.id,
//             carrierTripId: offer.carrierTripId || null,
//             userId: user.uid,
//             carrierId: offer.carrierId,
//             seats: trip.passengers || 1,
//             status: "Pending-Carrier-Confirmation",
//             totalPrice: offer.price,
//             currency: offer.currency || "JOD",
//             passengersDetails: trip.passengersDetails || [],
//             paymentSnapshot: walletSnapshot,
//             createdAt: serverTimestamp(),
//             updatedAt: serverTimestamp(),
//           });
//         });

//         toast({ title: "تم قبول العرض! ✅", description: "في انتظار تأكيد الناقل النهائي." });
//         onSuccess(newBookingId);
//       } catch (error: any) {
//         SovereignBlackBox.reportLethalCrash(error, "ACCEPT_OFFER_RUPTURE", { tripId: trip.id, offerId: offer.id });
//         toast({ variant: "destructive", title: getErrorMessage(error, "فشل قبول العرض السيادي") });
//       } finally {
//         setIsProcessingOffer(false);
//       }
//     },
//     [firestore, user, toast],
//   );

//   const handleConfirmPayment = useCallback(
//     async (booking: Booking, onSuccess: () => void) => {
//       if (!firestore) return;
//       setIsConfirmingPayment(true);
//       try {
//         const voucherId = `PAY-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
//         const bookingRef = doc(firestore, "bookings", booking.id);
//         const notificationRef = doc(collection(firestore, "notifications"));

//         await runTransaction(firestore, async (transaction) => {
//           transaction.update(bookingRef, {
//             status: "Pending-Payment-Verification",
//             depositVoucherId: voucherId,
//             paymentDeclaredAt: serverTimestamp(),
//             updatedAt: serverTimestamp(),
//           });

//           transaction.set(notificationRef, {
//             userId: booking.carrierId,
//             title: "المسافر أكد الدفع — راجع السند ✅",
//             message: `المسافر أرسل إشعار الدفع — رقم السند: ${voucherId} — اضغط لتأكيد الاستلام`,
//             type: "payment_declared",
//             bookingId: booking.id,
//             isRead: false,
//             createdAt: serverTimestamp(),
//           });
//         });

//         toast({ title: "تم تأكيد الدفع! 💳", description: "سيتم إعلام الناقل بتأكيد دفع العربون." });
//         onSuccess();
//       } catch (error: any) {
//         SovereignBlackBox.reportLethalCrash(error, "PAYMENT_CONFIRMATION_RUPTURE", { bookingId: booking.id });
//         toast({ variant: "destructive", title: getErrorMessage(error, "فشل تأكيد النبض المالي") });
//       } finally {
//         setIsConfirmingPayment(false);
//       }
//     },
//     [firestore, toast],
//   );

//   const handleConfirmCancellation = useCallback(
//     async (booking: Booking, reason: string, onSuccess: () => void) => {
//       if (!firestore || !user) return;
//       setIsCancelling(true);
//       try {
//         const bookingRef = doc(firestore, "bookings", booking.id);
//         const userRef = doc(firestore, "users", user.uid);

//         await runTransaction(firestore, async (transaction) => {
//           transaction.update(bookingRef, {
//             status: "Cancelled",
//             cancelReason: reason,
//             cancelledBy: "traveler",
//             cancelledAt: serverTimestamp(),
//             updatedAt: serverTimestamp(),
//           });

//           if (["Confirmed", "Pending-Payment", "Pending-Payment-Verification"].includes(booking.status)) {
//             const seatsToRestore = booking.seats || 1;
//             if (booking.carrierTripId) {
//               transaction.update(doc(firestore, "trips", booking.carrierTripId), {
//                 availableSeats: increment(seatsToRestore),
//                 updatedAt: serverTimestamp(),
//               });
//             }
//             if (booking.tripId) {
//               transaction.update(doc(firestore, "trips", booking.tripId), {
//                 availableSeats: increment(seatsToRestore),
//                 updatedAt: serverTimestamp(),
//               });
//             }
//           }

//           transaction.update(userRef, {
//             activeBookingId: deleteField(),
//             activeIntentId: deleteField(),
//             updatedAt: serverTimestamp(),
//           });
//         });

//         toast({ title: "تم إلغاء الحجز بنجاح ✅" });
//         onSuccess();
//       } catch (error: any) {
//         SovereignBlackBox.reportLethalCrash(error, "CANCELLATION_RUPTURE", { bookingId: booking.id });
//         toast({ variant: "destructive", title: getErrorMessage(error, "فشل إلغاء الحجز الموثق") });
//       } finally {
//         setIsCancelling(false);
//       }
//     },
//     [firestore, user, toast],
//   );

//   const handleWithdrawRequest = useCallback(
//     async (tripId: string) => {
//       if (!firestore || !user) return;
//       try {
//         const { updateDoc } = await import("firebase/firestore");
//         await updateDoc(doc(firestore, "trips", tripId), {
//           status: "Cancelled",
//           updatedAt: serverTimestamp(),
//         });
//         await updateDoc(doc(firestore, "users", user.uid), {
//           activeIntentId: deleteField(),
//           updatedAt: serverTimestamp(),
//         });
//         toast({ title: "تم سحب الطلب بنجاح" });
//       } catch (error: any) {
//         SovereignBlackBox.reportLethalCrash(error, "WITHDRAW_REQUEST_RUPTURE", { tripId });
//         toast({ variant: "destructive", title: getErrorMessage(error, "فشل سحب الطلب من السوق") });
//       }
//     },
//     [firestore, user, toast],
//   );

//   return {
//     isProcessingOffer,
//     isConfirmingPayment,
//     isCancelling,
//     handleAcceptOffer,
//     handleConfirmPayment,
//     handleConfirmCancellation,
//     handleWithdrawRequest,
//   };
// }

"use client";

import { useState, useCallback } from "react";
import { useFirestore } from "@/firebase";
import { doc, serverTimestamp, collection, runTransaction, deleteField, getDoc, increment } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/error-dictionary";
import type { Trip, Offer, Booking, UserProfile } from "@/lib/data";
import { SovereignBlackBox } from "@/lib/sovereign-monitor";
import { sendPush } from "@/lib/send-push";

export function useHistoryOps(user: any) {
  const firestore = useFirestore();
  const { toast } = useToast();

  const [isProcessingOffer, setIsProcessingOffer] = useState(false);
  const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleAcceptOffer = useCallback(
    async (trip: Trip, offer: Offer, onSuccess: (bookingId: string) => void) => {
      if (!firestore || !user) return;
      setIsProcessingOffer(true);
      try {
        // 1. جلب المحفظة المالية للناقل
        const carrierSnap = await getDoc(doc(firestore, "users", offer.carrierId));
        const carrierData = carrierSnap.data() as UserProfile;
        const walletSnapshot = carrierData?.paymentWallets || [];

        // 🚀 2. [SMART MATCH]: جلب رحلة الناقل لنسخ التوقيت والمدة الحقيقية
        let exactDepartureTime = (offer as any).departureTime || null;
        let exactDurationHours = (offer as any).estimatedDurationHours || null;

        if (offer.carrierTripId) {
          const carrierTripSnap = await getDoc(doc(firestore, "trips", offer.carrierTripId));
          if (carrierTripSnap.exists()) {
            const ctData = carrierTripSnap.data();
            if (ctData.departureTime) exactDepartureTime = ctData.departureTime;
            if (ctData.estimatedDurationHours) exactDurationHours = ctData.estimatedDurationHours;
          }
        }

        let newBookingId = "";
        await runTransaction(firestore, async (transaction) => {
          const tripRef = doc(firestore, "trips", trip.id);
          const offerRef = doc(firestore, "offers", offer.id);
          const bookingRef = doc(collection(firestore, "bookings"));
          newBookingId = bookingRef.id;

          const tripUpdateData: any = {
            status: "Pending-Carrier-Confirmation",
            carrierTripId: offer.carrierTripId || null,
            carrierId: offer.carrierId,
            carrierName: offer.carrierName || "",
            price: offer.price,
            currency: offer.currency,
            depositPercentage: offer.depositPercentage || 10,
            meetingPoint: offer.meetingPoint || trip.meetingPoint || "",
            acceptedOfferId: offer.id,
            updatedAt: serverTimestamp(),
          };

          // 🌟 زرع الوقت والمدة بشكل نهائي في تذكرة المسافر لتُقرأ في HeroTicket بشكل صحيح
          if (exactDepartureTime) tripUpdateData.departureTime = exactDepartureTime;
          if (exactDurationHours) tripUpdateData.estimatedDurationHours = exactDurationHours;

          transaction.update(tripRef, tripUpdateData);
          transaction.update(offerRef, { status: "Accepted" });

          transaction.set(bookingRef, {
            id: bookingRef.id,
            tripId: trip.id,
            carrierTripId: offer.carrierTripId || null,
            userId: user.uid,
            carrierId: offer.carrierId,
            seats: trip.passengers || 1,
            status: "Pending-Carrier-Confirmation",
            totalPrice: offer.price,
            currency: offer.currency || "JOD",
            passengersDetails: trip.passengersDetails || [],
            paymentSnapshot: walletSnapshot,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        });

        // [PUSH]: إشعار للناقل إن المسافر قبل عرضه
        await sendPush({
          userId: offer.carrierId,
          title: "المسافر قبل عرضك! 🎉",
          body: `تم قبول عرض ${offer.price} ${offer.currency} — في انتظار تأكيدك النهائي`,
          data: { type: "traveler_accepted_offer", bookingId: newBookingId },
        });
        toast({ title: "تم قبول العرض! ✅", description: "في انتظار تأكيد الناقل النهائي." });
        onSuccess(newBookingId);
      } catch (error: any) {
        SovereignBlackBox.reportLethalCrash(error, "ACCEPT_OFFER_RUPTURE", { tripId: trip.id, offerId: offer.id });
        toast({ variant: "destructive", title: getErrorMessage(error, "فشل قبول العرض السيادي") });
      } finally {
        setIsProcessingOffer(false);
      }
    },
    [firestore, user, toast],
  );

  const handleConfirmPayment = useCallback(
    async (booking: Booking, onSuccess: () => void) => {
      if (!firestore) return;
      setIsConfirmingPayment(true);
      try {
        const voucherId = `PAY-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        const bookingRef = doc(firestore, "bookings", booking.id);
        const notificationRef = doc(collection(firestore, "notifications"));

        await runTransaction(firestore, async (transaction) => {
          transaction.update(bookingRef, {
            status: "Pending-Payment-Verification",
            depositVoucherId: voucherId,
            paymentDeclaredAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });

          transaction.set(notificationRef, {
            userId: booking.carrierId,
            title: "المسافر أكد الدفع — راجع السند ✅",
            message: `المسافر أرسل إشعار الدفع — رقم السند: ${voucherId} — اضغط لتأكيد الاستلام`,
            type: "payment_declared",
            bookingId: booking.id,
            isRead: false,
            createdAt: serverTimestamp(),
          });
        });

        // [PUSH]: إشعار Push للناقل إن المسافر دفع
        await sendPush({
          userId: booking.carrierId,
          title: "المسافر أكد الدفع! 💳",
          body: `المسافر أرسل إشعار دفع العربون — راجع السند وأكد الاستلام`,
          data: { type: "payment_declared", bookingId: booking.id },
        });
        toast({ title: "تم تأكيد الدفع! 💳", description: "سيتم إعلام الناقل بتأكيد دفع العربون." });
        onSuccess();
      } catch (error: any) {
        SovereignBlackBox.reportLethalCrash(error, "PAYMENT_CONFIRMATION_RUPTURE", { bookingId: booking.id });
        toast({ variant: "destructive", title: getErrorMessage(error, "فشل تأكيد النبض المالي") });
      } finally {
        setIsConfirmingPayment(false);
      }
    },
    [firestore, toast],
  );

  const handleConfirmCancellation = useCallback(
    async (booking: Booking, reason: string, onSuccess: () => void) => {
      if (!firestore || !user) return;
      setIsCancelling(true);
      try {
        const bookingRef = doc(firestore, "bookings", booking.id);
        const userRef = doc(firestore, "users", user.uid);

        await runTransaction(firestore, async (transaction) => {
          transaction.update(bookingRef, {
            status: "Cancelled",
            cancelReason: reason,
            cancelledBy: "traveler",
            cancelledAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });

          if (["Confirmed", "Pending-Payment", "Pending-Payment-Verification"].includes(booking.status)) {
            const seatsToRestore = booking.seats || 1;
            if (booking.carrierTripId) {
              transaction.update(doc(firestore, "trips", booking.carrierTripId), {
                availableSeats: increment(seatsToRestore),
                updatedAt: serverTimestamp(),
              });
            }
            if (booking.tripId) {
              transaction.update(doc(firestore, "trips", booking.tripId), {
                availableSeats: increment(seatsToRestore),
                updatedAt: serverTimestamp(),
              });
            }
          }

          transaction.update(userRef, {
            activeBookingId: deleteField(),
            activeIntentId: deleteField(),
            updatedAt: serverTimestamp(),
          });
        });

        // [PUSH]: إشعار للناقل إن المسافر ألغى
        if (booking.carrierId) {
          await sendPush({
            userId: booking.carrierId,
            title: "المسافر ألغى الحجز ❌",
            body: `تم إلغاء حجز ${booking.seats} مقعد — السبب: ${reason}`,
            data: { type: "traveler_cancelled_booking", bookingId: booking.id },
          });
        }
        toast({ title: "تم إلغاء الحجز بنجاح ✅" });
        onSuccess();
      } catch (error: any) {
        SovereignBlackBox.reportLethalCrash(error, "CANCELLATION_RUPTURE", { bookingId: booking.id });
        toast({ variant: "destructive", title: getErrorMessage(error, "فشل إلغاء الحجز الموثق") });
      } finally {
        setIsCancelling(false);
      }
    },
    [firestore, user, toast],
  );

  const handleWithdrawRequest = useCallback(
    async (tripId: string) => {
      if (!firestore || !user) return;
      try {
        const { updateDoc } = await import("firebase/firestore");
        await updateDoc(doc(firestore, "trips", tripId), {
          status: "Cancelled",
          updatedAt: serverTimestamp(),
        });
        await updateDoc(doc(firestore, "users", user.uid), {
          activeIntentId: deleteField(),
          updatedAt: serverTimestamp(),
        });
        toast({ title: "تم سحب الطلب بنجاح" });
      } catch (error: any) {
        SovereignBlackBox.reportLethalCrash(error, "WITHDRAW_REQUEST_RUPTURE", { tripId });
        toast({ variant: "destructive", title: getErrorMessage(error, "فشل سحب الطلب من السوق") });
      }
    },
    [firestore, user, toast],
  );

  return {
    isProcessingOffer,
    isConfirmingPayment,
    isCancelling,
    handleAcceptOffer,
    handleConfirmPayment,
    handleConfirmCancellation,
    handleWithdrawRequest,
  };
}
