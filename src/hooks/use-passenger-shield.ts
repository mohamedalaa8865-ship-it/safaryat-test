'use client';

import { useState, useEffect } from 'react';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';

/**
 * @hook usePassengerShield
 * @description THE REINFORCED IDENTITY SHIELD (CONSTITUTIONAL - SC-845)
 * Enforces Article 3/1 by checking for active engagements by phone number.
 * Protocol 88: Zero-Waste targeted query.
 */
export function usePassengerShield(phoneNumber: string) {
  const firestore = useFirestore();
  const [hasActiveTrip, setHasActiveTrip] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Halt Gate: Only check if the phone number is substantially complete
    if (!firestore || phoneNumber.length < 9) {
      setHasActiveTrip(false);
      return;
    }

    const checkIdentity = async () => {
      setIsLoading(true);
      try {
        const tripsRef = collection(firestore, 'trips');
        // Targeted query for ANY active/pending proxy or general booking for this phone
        const q = query(
          tripsRef,
          where('passengerPhone', '==', phoneNumber),
          where('status', 'in', ['Awaiting-Offers', 'Pending-Carrier-Confirmation', 'Planned', 'In-Transit']),
          limit(1)
        );

        const snap = await getDocs(q);
        setHasActiveTrip(!snap.empty);
      } catch (error) {
        console.warn("[Passenger Shield] Pulse Loss:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(checkIdentity, 600); // Debounced internal check
    return () => clearTimeout(timer);
  }, [firestore, phoneNumber]);

  return { hasActiveTrip, isLoading };
}
