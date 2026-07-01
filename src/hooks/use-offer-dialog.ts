// "use client";

// import { useState } from "react";
// import { useToast } from "@/hooks/use-toast";
// import { useUser, useFirestore } from "@/firebase";
// import { sendOffer } from "@/lib/carrier-actions";
// import type { Trip, Offer } from "@/lib/data";

// /**
//  * @hook useOfferDialog
//  * @description THE REINFORCED OFFER HANDLER (STERILIZED - V2.0 - SCR-014)
//  * [SCR-014]: Eradicated AI Price Suggestion to ensure Sovereign Manual Pricing.
//  * Protocol 16: Sterilized. Protocol 88: Zero-Waste.
//  */
// export function useOfferDialog() {
//   const { toast } = useToast();
//   const { user } = useUser();
//   const firestore = useFirestore();

//   const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);

//   const openOfferDialog = (trip: Trip) => {
//     setSelectedTrip(trip);
//     setIsDialogOpen(true);
//   };

//   const handleSendOffer = async (
//     offerData: Omit<Offer, "id" | "tripId" | "carrierId" | "status" | "createdAt">,
//     passengerIntentId: string,
//   ): Promise<boolean> => {
//     if (!firestore || !user || !selectedTrip) return false;

//     const success = await sendOffer(firestore, user, selectedTrip, offerData, passengerIntentId);

//     if (success) {
//       toast({ title: "تم إرسال العرض بنجاح!", description: "سيتم إعلام المسافر بعرضك." });
//       setIsDialogOpen(false);
//     } else {
//       toast({ variant: "destructive", title: "فشل إرسال العرض", description: "حدث خطأ ما." });
//     }
//     return success;
//   };

//   return {
//     selectedTrip,
//     isDialogOpen,
//     openOfferDialog,
//     setIsDialogOpen,
//     handleSendOffer,
//   };
// }

"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { sendOffer } from "@/lib/carrier-actions";
import type { Trip, Offer } from "@/lib/data";
import { collection, query, where } from "firebase/firestore";

/**
 * @hook useOfferDialog
 * @description THE REINFORCED OFFER HANDLER (STERILIZED - V3.0 - SCR-014)
 * [FIX]: carrierTripId يجيب من رحلة الناقل النشطة مش من رحلة المسافر
 */
export function useOfferDialog() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // ✅ [FIX]: جلب رحلة الناقل النشطة — هي المصدر الحقيقي لـ carrierTripId
  const activeCarrierTripQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return query(collection(firestore, "trips"), where("carrierId", "==", user.uid), where("status", "in", ["Planned", "Ongoing"]));
  }, [firestore, user?.uid]);

  const { data: activeCarrierTrips } = useCollection<Trip>(activeCarrierTripQuery);

  // الرحلة النشطة اللي أنشأها الناقل نفسه
  const activeCarrierTrip = activeCarrierTrips?.find((t: any) => t.userId === user?.uid) ?? null;

  const openOfferDialog = (trip: Trip) => {
    setSelectedTrip(trip);
    setIsDialogOpen(true);
  };

  const handleSendOffer = async (
    offerData: Omit<Offer, "id" | "tripId" | "carrierId" | "status" | "createdAt">,
    passengerIntentId: string,
  ): Promise<boolean> => {
    if (!firestore || !user || !selectedTrip) return false;

    // ✅ [FIX]: لو عند الناقل رحلة نشطة → استخدمها كـ carrierTrip
    // لو مفيش → ابعت رحلة المسافر كـ fallback (الـ sendOffer هيتعامل معاها)
    const carrierTrip = (activeCarrierTrip as Trip | null) || selectedTrip;

    const success = await sendOffer(firestore, user, carrierTrip, offerData, passengerIntentId);

    if (success) {
      toast({ title: "تم إرسال العرض بنجاح!", description: "سيتم إعلام المسافر بعرضك." });
      setIsDialogOpen(false);
    } else {
      toast({ variant: "destructive", title: "فشل إرسال العرض", description: "حدث خطأ ما." });
    }
    return success;
  };

  return {
    selectedTrip,
    isDialogOpen,
    openOfferDialog,
    setIsDialogOpen,
    handleSendOffer,
    activeCarrierTrip, // ✅ export عشان OfferDialog يستخدمه
  };
}
