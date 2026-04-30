"use client";
/**
 * @file src/hooks/use-agent-ops.ts
 * @description THE REINFORCED AGENT REACTOR (V33.0 - AGENT-BOOKING-FLOW)
 * [SCR-ABF]: Agent booking → Pending-Carrier-Confirmation + notify carrier with agentName/agentFee.
 * Protocol 20: No silent failures. All ruptures flow to the Black Box.
 */
import { useState, useCallback } from "react";
import { useFirestore } from "@/firebase";
import { collection, addDoc, serverTimestamp, doc, updateDoc, getDoc } from "firebase/firestore";
import { getErrorMessage } from "@/lib/error-dictionary";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "next-intl";
import { SovereignBlackBox } from "@/lib/sovereign-monitor";

export function useAgentOps(agentId: string) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const locale = useLocale();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [magicLink, setMagicLink] = useState("");

  const submitProxyBooking = useCallback(
    async (tripData: any, onSuccess?: () => void) => {
      if (!firestore || !agentId) {
        toast({ variant: "destructive", title: "فشل الهوية", description: "المعرف الرقمي للوكيل غير صالح." });
        return;
      }

      setIsSubmitting(true);
      setMagicLink("");

      try {
        let generatedLink = "";

        // نجيب اسم الوكيل مرة واحدة
        const agentSnap = await getDoc(doc(firestore, "users", agentId));
        const agentData = agentSnap.data();
        const agentName = [agentData?.firstName, agentData?.lastName].filter(Boolean).join(" ").trim() || agentData?.fullName || "وكيل";

        if (tripData.tripId) {
          // المسار 1: الوكيل اختار رحلة ناقل موجودة
          const { tripId, passengers, passengersCount, agentFee } = tripData;

          const tripSnap = await getDoc(doc(firestore, "trips", tripId));
          if (!tripSnap.exists()) throw new Error("TRIP_NOT_FOUND");
          const trip = tripSnap.data();

          const seats = passengersCount || passengers?.length || 1;
          if (seats > (trip.availableSeats || 0)) {
            toast({ variant: "destructive", title: "المقاعد غير كافية", description: `المتاح: ${trip.availableSeats} مقعد` });
            setIsSubmitting(false);
            return;
          }

          const passengersDetails = (passengers || []).map((p: any) => ({
            name: p.passengerName || p.name || "",
            nationality: p.nationality || "",
            documentNumber: p.documentId || p.documentNumber || "",
            type: p.passengerType || p.type || "adult",
            phone: p.passengerPhone || p.phone || "",
          }));

          console.log("🔵 [AgentOps] Creating booking (Pending-Carrier-Confirmation) tripId:", tripId);
          const bookingRef = await addDoc(collection(firestore, "bookings"), {
            tripId,
            carrierId: trip.carrierId,
            userId: agentId,
            agentId,
            agentName,
            agentFee: agentFee || 0,
            bookedByAgent: true,
            seats,
            passengersDetails,
            status: "Pending-Carrier-Confirmation",
            totalPrice: (trip.price || 0) * seats,
            currency: trip.currency || "JOD",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          console.log("✅ [AgentOps] Booking created (awaiting carrier approval):", bookingRef.id);

          // إشعار للناقل بطلب الوكيل + العمولة
          if (trip.carrierId) {
            await addDoc(collection(doc(firestore, "users", trip.carrierId), "notifications"), {
              userId: trip.carrierId,
              title: "طلب حجز من وكيل 🤝",
              message: `الوكيل "${agentName}" يطلب حجز ${seats} مقعد — العمولة: ${agentFee || 0} ${trip.currency || "JOD"}`,
              type: "agent_booking_request",
              bookingId: bookingRef.id,
              isRead: false,
              link: `/${locale}/carrier/bookings`,
              createdAt: serverTimestamp(),
            });
          }

          await updateDoc(doc(firestore, "users", agentId), {
            activeIntentId: bookingRef.id,
            updatedAt: serverTimestamp(),
          });

          // [SCR-ABF]: اللينك بيكون للـ booking مش للـ trip
          // عشان المسافر يشوف حالة حجزه بالظبط
          const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
          generatedLink = `${baseUrl}/${locale}/ticket/${bookingRef.id}`;
          setMagicLink(generatedLink);
        } else {
          // المسار 2: ينشر الطلب في السوق كـ Awaiting-Offers
          const tripsRef = collection(firestore, "trips");
          const payload = {
            ...tripData,
            agentId,
            agentName,
            origin: tripData.originCity || "",
            destination: tripData.destCity || "",
            agentFee: tripData.agentFee || 0,
            creatorRole: "agent",
            status: "Awaiting-Offers",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          };
          Object.keys(payload).forEach((key) => {
            if ((payload as any)[key] === undefined) delete (payload as any)[key];
          });
          const docRef = await addDoc(tripsRef, payload);

          await updateDoc(doc(firestore, "users", agentId), {
            activeIntentId: docRef.id,
            updatedAt: serverTimestamp(),
          });

          const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
          generatedLink = `${baseUrl}/${locale}/ticket/${docRef.id}`;
          setMagicLink(generatedLink);
        }

        toast({ title: "تم الحجز بنجاح ✅" });
        if (onSuccess) onSuccess();
      } catch (error: any) {
        console.error("🔴 REAL ERROR:", error.code, error.message, JSON.stringify(error));
        SovereignBlackBox.reportLethalCrash(error, "AGENT_PROXY_BOOKING_FAILURE", { agentId, tripData });
        const msg = getErrorMessage(error.code || "DEFAULT", "فشل في ترحيل البيانات الميدانية.");
        toast({ variant: "destructive", title: "تعثر المفاعل الميداني", description: msg });
      } finally {
        setIsSubmitting(false);
      }
    },
    [firestore, agentId, locale, toast],
  );

  return {
    isSubmitting,
    magicLink,
    setMagicLink,
    submitProxyBooking,
  };
}
