'use client';

import { useState, useEffect, useMemo } from 'react';
import { useFirestore, useUser } from '@/firebase';
import { collection, query, where, getCountFromServer } from 'firebase/firestore';

/**
 * @hook useCountersReactor
 * @description THE REINFORCED COUNTER ENGINE (REINFORCED - SC-801)
 * [SC-801]: Injected Local Session Cache. Optimized for $0 redundant reads.
 * Protocol 88: Preventing request stacking and chattiness.
 */

const COUNTERS_CACHE: Record<string, { data: any; timestamp: number }> = {};
const CACHE_TTL = 2 * 60 * 1000; // 2 Minutes (Higher frequency requirement)

export function useCountersReactor(country: string) {
  const firestore = useFirestore();
  const { isUserLoading } = useUser();
  const [counts, setCounts] = useState({
    totalUsers: 0,
    activeTrips: 0,
    dailyBrokerageFlow: 0,
    todayTrips: 0,
    unpaidCarriers: 0
  });
  const [loading, setLoading] = useState(true);

  // [PROTOCOL 88]: Memoize the today anchor
  const startOfDay = useMemo(() => {
    return new Date(new Date().setHours(0,0,0,0)).toISOString();
  }, []);

  useEffect(() => {
    if (!firestore || isUserLoading) return;

    const cacheKey = `counts_${country}`;
    if (COUNTERS_CACHE[cacheKey] && (Date.now() - COUNTERS_CACHE[cacheKey].timestamp < CACHE_TTL)) {
      setCounts(COUNTERS_CACHE[cacheKey].data);
      setLoading(false);
      return;
    }

    const fetchCounts = async () => {
      setLoading(true);
      try {
        // 1. Base Counter Queries
        let usersQ = query(collection(firestore, 'users'), where('role', 'in', ['carrier', 'traveler']));
        let tripsQ = query(collection(firestore, 'trips'), where('status', 'in', ['Planned', 'In-Transit']));
        let flowQ = query(collection(firestore, 'bookings'), where('status', 'in', ['Confirmed', 'Pending-Payment']));
        let todayQ = query(
            collection(firestore, 'trips'), 
            where('status', '==', 'Planned'), 
            where('departureDate', '>=', startOfDay)
        );
        
        let unpaidQ = query(
            collection(firestore, 'users'), 
            where('role', '==', 'carrier'),
            where('subscriptionStatus', '==', 'expired')
        );

        // 2. Cross-Link: Geo-Injection
        if (country !== 'all') {
          usersQ = query(usersQ, where('operatingCountry', '==', country));
          todayQ = query(todayQ, where('origin', '==', country));
          tripsQ = query(tripsQ, where('origin', '==', country));
          unpaidQ = query(unpaidQ, where('operatingCountry', '==', country));
        }

        const [uSnap, tSnap, fSnap, tdSnap, unSnap] = await Promise.all([
          getCountFromServer(usersQ),
          getCountFromServer(tripsQ),
          getCountFromServer(flowQ),
          getCountFromServer(todayQ),
          getCountFromServer(unpaidQ)
        ]);

        const finalizedData = {
          totalUsers: uSnap.data().count,
          activeTrips: tSnap.data().count,
          dailyBrokerageFlow: fSnap.data().count,
          todayTrips: tdSnap.data().count,
          unpaidCarriers: unSnap.data().count
        };

        COUNTERS_CACHE[cacheKey] = { data: finalizedData, timestamp: Date.now() };
        setCounts(finalizedData);
      } catch (error) {
        console.error("[Counters Reactor] Atomic Pulse Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, [firestore, country, isUserLoading, startOfDay]);

  return { counts, loading };
}
