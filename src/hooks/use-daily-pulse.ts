'use client';

import { useState, useEffect } from 'react';
import { useFirestore } from '@/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

/**
 * @hook useDailyPulse
 * @description THE REINFORCED PULSE SENSOR (SC-804)
 * Fetches aggregated daily statistics for the War Room.
 * Protocol 88: Reads 1 document per active market per day.
 */

export interface DailyPulseData {
  id: string;
  country: string;
  activeTrips: number;
  totalTripsToday: number;
  dailyBookings: number;
  dailyRevenue: number;
}

export function useDailyPulse() {
    const firestore = useFirestore();
    const [pulseData, setPulseData] = useState<DailyPulseData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!firestore) return;
        
        const todayDate = new Date().toISOString().split('T')[0];
        // Fetch only today's aggregated documents
        const q = query(collection(firestore, 'daily_stats'), where('date', '==', todayDate));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const stats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DailyPulseData));
            setPulseData(stats);
            setIsLoading(false);
        }, (error) => {
            console.error("[Pulse Reactor] Synapse Failure:", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [firestore]);

    return { pulseData, isLoading };
}
