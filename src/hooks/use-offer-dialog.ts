"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUser, useFirestore } from "@/firebase";
import { sendOffer } from "@/lib/carrier-actions";
import type { Trip, Offer } from "@/lib/data";

/**
 * @hook useOfferDialog
 * @description THE REINFORCED OFFER HANDLER (STERILIZED - V2.0 - SCR-014)
 * [SCR-014]: Eradicated AI Price Suggestion to ensure Sovereign Manual Pricing.
 * Protocol 16: Sterilized. Protocol 88: Zero-Waste.
 */
export function useOfferDialog() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openOfferDialog = (trip: Trip) => {
    setSelectedTrip(trip);
    setIsDialogOpen(true);
  };

  const handleSendOffer = async (
    offerData: Omit<Offer, "id" | "tripId" | "carrierId" | "status" | "createdAt">,
    passengerIntentId: string,
  ): Promise<boolean> => {
    if (!firestore || !user || !selectedTrip) return false;

    const success = await sendOffer(firestore, user, selectedTrip, offerData, passengerIntentId);

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
  };
}
