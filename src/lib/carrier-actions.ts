// // 'use client';

// // import { addDoc, collection, serverTimestamp, type Firestore } from "firebase/firestore";
// // import type { User } from "firebase/auth";
// // import type { Offer, Trip } from "./data";

// // /**
// //  * Creates a new offer for a trip request.
// //  * Encapsulates the logic for creating an offer document in Firestore.
// //  * @returns {Promise<boolean>} True if the offer was sent successfully, false otherwise.
// //  */
// // export const sendOffer = async (
// //     firestore: Firestore,
// //     user: User,
// //     trip: Trip,
// //     offerData: Omit<Offer, 'id' | 'tripId' | 'carrierId' | 'status' | 'createdAt'>
// // ): Promise<boolean> => {
// //     try {
// //         const offersCollection = collection(firestore, 'trips', trip.id, 'offers');
// //         const offerPayload: Omit<Offer, 'id'> = {
// //             ...offerData,
// //             tripId: trip.id,
// //             carrierId: user.uid,
// //             status: 'Pending',
// //             createdAt: serverTimestamp() as any,
// //         };

// //         await addDoc(offersCollection, offerPayload);
// //         return true; // Return success
// //     } catch (error) {
// //         console.error("Error sending offer:", error);
// //         return false; // Return failure
// //     }
// // };

// "use client";

// import { addDoc, collection, doc, serverTimestamp, updateDoc, type Firestore } from "firebase/firestore";
// import type { User } from "firebase/auth";
// import type { Offer, Trip } from "./data";

// export const sendOffer = async (
//   firestore: Firestore,
//   user: User,
//   trip: Trip,
//   offerData: Omit<Offer, "id" | "tripId" | "carrierId" | "status" | "createdAt">,
//   passengerIntentId: string, // ✅ أضفناه
// ): Promise<boolean> => {
//   try {
//     const offersCollection = collection(firestore, "offers"); // ✅ collection مستقلة
//     const offerPayload = {
//       ...offerData,
//       carrierTripId: trip.id, // ✅ رحلة الناقل
//       passengerIntentId: passengerIntentId, // ✅ طلب المسافر
//       carrierId: user.uid,
//       status: "Pending",
//       createdAt: serverTimestamp(),
//     };

//     await addDoc(offersCollection, offerPayload);
//     await updateDoc(doc(firestore, "trips", passengerIntentId), {
//       status: "Offer-Received",
//       updatedAt: serverTimestamp(),
//     });

//     return true;
//   } catch (error) {
//     console.error("Error sending offer:", error);
//     return false;
//   }
// };
// // "use client";

// // import { addDoc, updateDoc, doc, collection, serverTimestamp, type Firestore } from "firebase/firestore";
// // import type { User } from "firebase/auth";
// // import type { Offer, Trip } from "./data";

// // export const sendOffer = async (
// //   firestore: Firestore,
// //   user: User,
// //   trip: Trip,
// //   offerData: Omit<Offer, "id" | "tripId" | "carrierId" | "status" | "createdAt">,
// //   passengerIntentId: string,
// // ): Promise<boolean> => {
// //   try {
// //     const offersCollection = collection(firestore, "offers");
// //     const offerPayload = {
// //       ...offerData,
// //       carrierTripId: trip.id,
// //       passengerIntentId: passengerIntentId,
// //       carrierId: user.uid,
// //       status: "Pending",
// //       createdAt: serverTimestamp(),
// //     };

// //     await addDoc(offersCollection, offerPayload);

// //     // ✅ غير status طلب المسافر عشان يختفي من السوق
// //     await updateDoc(doc(firestore, "trips", passengerIntentId), {
// //       status: "Offer-Received",
// //       updatedAt: serverTimestamp(),
// //     });

// //     return true;
// //   } catch (error) {
// //     console.error("Error sending offer:", error);
// //     return false;
// //   }
// // };

"use client";

/**
 * @file src/lib/carrier-actions.ts
 * [FIX V2.0]:
 * 1. بيجيب اسم الناقل من Firestore وبيحطه في الـ offer (carrierName)
 * 2. بيضيف tripId في الـ offer (مش بس carrierTripId)
 * 3. بيبعت إشعار للمسافر إن في عرض جديد
 * 4. بيزود offersCount على الـ trip
 */

import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc, increment, type Firestore } from "firebase/firestore";
import type { User } from "firebase/auth";
import type { Offer, Trip } from "./data";

export const sendOffer = async (
  firestore: Firestore,
  user: User,
  trip: Trip,
  offerData: Omit<Offer, "id" | "tripId" | "carrierId" | "status" | "createdAt">,
  passengerIntentId: string,
): Promise<boolean> => {
  try {
    // 1. جيب اسم الناقل عشان يتعرض للمسافر في الإشعار والعرض
    let carrierName = "";
    try {
      const carrierSnap = await getDoc(doc(firestore, "users", user.uid));
      if (carrierSnap.exists()) {
        const d = carrierSnap.data();
        carrierName = [d?.firstName, d?.lastName].filter(Boolean).join(" ").trim() || d?.fullName || d?.displayName || "";
      }
    } catch (e) {
      console.warn("[sendOffer] Could not fetch carrier name:", e);
    }

    // 2. ضيف الـ offer في collection مستقلة
    const offerRef = await addDoc(collection(firestore, "offers"), {
      ...offerData,
      tripId: passengerIntentId, // ← id طلب المسافر (عشان يقدر يجيب العروض بـ tripId)
      carrierTripId: trip.id, // ← رحلة الناقل
      passengerIntentId: passengerIntentId,
      carrierId: user.uid,
      carrierName, // ← [FIX] اسم الناقل
      status: "Pending",
      createdAt: serverTimestamp(),
    });

    // 3. حدّث الـ trip: status + عداد العروض
    await updateDoc(doc(firestore, "trips", passengerIntentId), {
      status: "Offer-Received",
      offersCount: increment(1), // ← [FIX] عداد للعروض
      lastOfferAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // 4. [FIX] ابعت إشعار للمسافر
    try {
      // جيب الـ trip عشان تعرف userId المسافر
      const tripSnap = await getDoc(doc(firestore, "trips", passengerIntentId));
      if (tripSnap.exists()) {
        const tripData = tripSnap.data();
        const passengerId = tripData?.userId;

        if (passengerId) {
          await addDoc(collection(doc(firestore, "users", passengerId), "notifications"), {
            userId: passengerId,
            title: "عرض جديد وصلك! 🚗",
            message: `الناقل "${carrierName || "ناقل"}" أرسل عرضاً بسعر ${offerData.price} ${offerData.currency}`,
            type: "new_offer",
            tripId: passengerIntentId,
            offerId: offerRef.id,
            carrierId: user.uid,
            isRead: false,
            link: `/ticket/${passengerIntentId}`,
            createdAt: serverTimestamp(),
          });
        }
      }
    } catch (notifError) {
      // الإشعار مش critical — نسجله بس ومنوقفش العملية
      console.warn("[sendOffer] Notification failed (non-critical):", notifError);
    }

    return true;
  } catch (error) {
    console.error("[sendOffer] Error:", error);
    return false;
  }
};
