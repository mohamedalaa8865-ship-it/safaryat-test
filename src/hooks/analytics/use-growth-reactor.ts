
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useFirestore, useUser } from '@/firebase';
import { collection, query, where, getCountFromServer, Timestamp } from 'firebase/firestore';

/**
 * @file src/hooks/analytics/use-growth-reactor.ts
 * @description ATOMIC REACTOR 1: Growth Engine (REINFORCED - SC-806 V6.0)
 * [SC-806 V6.0]: Quality Trinity: Enforced Session Cache for $0 Redundant Reads.
 * Protocol 88: Zero-Waste. Protocol 16: Sterilized.
 */

// Sovereign Session Cache (Persists during the user's browser session)
const GROWTH_CACHE: Record<string, { data: any[]; timestamp: number }> = {};
const CACHE_TTL = 15 * 60 * 1000; // 15 Minutes persistence for heavy analytics

export function useGrowthReactor(country: string) {
  const firestore = useFirestore();
  const { isUserLoading } = useUser();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // [PROTOCOL 88]: Memoize time windows to prevent effect jitter and CLS
  const monthWindows = useMemo(() => {
    const anchorDate = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(anchorDate);
      d.setMonth(anchorDate.getMonth() - (5 - i));
      const start = new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
      return {
        name: start.toLocaleString('ar-EG', { month: 'short' }),
        start: start,
        end: end
      };
    });
  }, []); 

  useEffect(() => {
    if (!firestore || isUserLoading) return;

    // [SC-806 V6.0] TRIANGLE CHECK: Zero Redundant Reads from Cache
    const cacheKey = `growth_${country}`;
    if (GROWTH_CACHE[cacheKey] && (Date.now() - GROWTH_CACHE[cacheKey].timestamp < CACHE_TTL)) {
      setData(GROWTH_CACHE[cacheKey].data);
      setLoading(false);
      return;
    }

    const fetchGrowth = async () => {
      setLoading(true);
      try {
        const promises = monthWindows.map(async (m) => {
          let usersQ = query(
            collection(firestore, 'users'),
            where('role', 'in', ['carrier', 'traveler']),
            where('createdAt', '>=', Timestamp.fromDate(m.start)),
            where('createdAt', '<=', Timestamp.fromDate(m.end))
          );

          let tripsQ = query(
            collection(firestore, 'trips'),
            where('createdAt', '>=', Timestamp.fromDate(m.start)),
            where('createdAt', '<=', Timestamp.fromDate(m.end))
          );
          
          if (country !== 'all') {
            usersQ = query(usersQ, where('operatingCountry', '==', country));
            tripsQ = query(tripsQ, where('origin', '==', country));
          }

          const [u, t] = await Promise.all([
            getCountFromServer(usersQ),
            getCountFromServer(tripsQ)
          ]);

          return { name: m.name, users: u.data().count, trips: t.data().count };
        });

        const results = await Promise.all(promises);
        
        // Update Session Cache
        GROWTH_CACHE[cacheKey] = { data: results, timestamp: Date.now() };
        setData(results);

      } catch (e) { 
        console.error("[Growth Reactor] Pulse Failure:", e); 
      } finally { 
        setLoading(false); 
      }
    };

    fetchGrowth();
  }, [firestore, country, isUserLoading, monthWindows]);

  return { growth: data, loading };
}
