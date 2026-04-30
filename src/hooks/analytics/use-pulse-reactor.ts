
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useFirestore, useUser } from '@/firebase';
import { collection, query, where, getCountFromServer } from 'firebase/firestore';

/**
 * @file src/hooks/analytics/use-pulse-reactor.ts
 * @description ATOMIC REACTOR 2: Weekly Flow Aggregator (REINFORCED - SC-806 V6.0)
 * [SC-806 V6.0]: Triangle Check: Enforced Session Cache and Nuclear Time Sync.
 */

const PULSE_CACHE: Record<string, { data: any[]; timestamp: number }> = {};
const CACHE_TTL = 10 * 60 * 1000; 

export function usePulseReactor(country: string) {
  const firestore = useFirestore();
  const { isUserLoading } = useUser();
  const [dailyVolume, setDailyVolume] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // [SC-806 V5.8] Nuclear Time Sync: Stabilize day windows
  const dayWindows = useMemo(() => {
    const anchor = new Date();
    anchor.setHours(0, 0, 0, 0);
    return Array.from({ length: 7 }, (_, i) => {
      const start = new Date(anchor);
      start.setDate(anchor.getDate() + i);
      const end = new Date(start);
      end.setHours(23, 59, 59, 999);
      return { 
        name: start.toLocaleDateString('ar-EG', { weekday: 'long' }), 
        start: start, 
        end: end 
      };
    });
  }, []);

  useEffect(() => {
    if (!firestore || isUserLoading) return;

    // [SC-806 V6.0] TRIANGLE CHECK: Session Persistence
    const cacheKey = `pulse_${country}`;
    if (PULSE_CACHE[cacheKey] && (Date.now() - PULSE_CACHE[cacheKey].timestamp < CACHE_TTL)) {
      setDailyVolume(PULSE_CACHE[cacheKey].data);
      setLoading(false);
      return;
    }

    const fetchPulse = async () => {
      setLoading(true);
      try {
        const promises = dayWindows.map(async (d) => {
          let dailyQ = query(
            collection(firestore, 'trips'),
            where('status', 'in', ['Planned', 'In-Transit']),
            where('departureDate', '>=', d.start.toISOString()),
            where('departureDate', '<=', d.end.toISOString())
          );

          if (country !== 'all') {
            dailyQ = query(dailyQ, where('origin', '==', country));
          }

          const snap = await getCountFromServer(dailyQ);
          return { name: d.name, trips: snap.data().count };
        });

        const results = await Promise.all(promises);
        
        PULSE_CACHE[cacheKey] = { data: results, timestamp: Date.now() };
        setDailyVolume(results);
      } catch (error) {
        console.error("[Pulse Reactor] Waveform Rupture:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPulse();
  }, [firestore, country, isUserLoading, dayWindows]);

  return { dailyVolume, loading };
}
