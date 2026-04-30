'use client';

import { useState, useEffect } from 'react';
import { useFirestore } from '@/firebase';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';

/**
 * @hook usePassengerMemory
 * @description THE REINFORCED IDENTITY RECALL (PROTOCOL 88 - SC-847)
 * Recalls passenger identity from historical trips to prevent re-entry.
 * Logic: One-time query with strict limit(1) to protect resources.
 * Protocol 16: Sterilized.
 */
export function usePassengerMemory(phone: string) {
  const firestore = useFirestore();
  const [rememberedData, setRememberedData] = useState<{
    name: string;
    nationality: string;
    documentId: string;
    type: string;
  } | null>(null);
  const [isRecalling, setIsRecalling] = useState(false);

  useEffect(() => {
    // Halt Gate: Only trigger when a substantial international phone is detected
    if (!firestore || phone.length < 9) {
      setRememberedData(null);
      return;
    }

    const recallIdentity = async () => {
      setIsRecalling(true);
      try {
        const q = query(
          collection(firestore, 'trips'),
          where('passengerPhone', '==', phone),
          orderBy('createdAt', 'desc'),
          limit(1)
        );
        
        const snap = await getDocs(q);
        if (!snap.empty) {
          const data = snap.docs[0].data();
          // [SSOT]: Extract only verified identity fields
          setRememberedData({
            name: data.passengerName || '',
            nationality: data.nationality || '',
            documentId: data.documentId || '',
            type: data.passengerType || 'adult'
          });
        }
      } catch (error) {
        console.warn("[Passenger Memory] Recall failure (Forensic Alert):", error);
      } finally {
        setIsRecalling(false);
      }
    };

    const timer = setTimeout(recallIdentity, 850); // Debounce pulse to prevent network chatter
    return () => clearTimeout(timer);
  }, [firestore, phone]);

  return { rememberedData, isRecalling };
}
