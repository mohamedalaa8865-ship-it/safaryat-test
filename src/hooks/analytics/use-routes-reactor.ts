'use client';

import { useState, useEffect, useCallback } from 'react';
import { useFirestore } from '@/firebase';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';

/**
 * @hook useRoutesReactor
 * @description ATOMIC REACTOR 3: Deep Route Vitality (DIAMOND STERILIZED - SC-617)
 * [SC-617]: Strictly focused on Active Field Vitality.
 * Protocol 88: Limited reads (50) to sample vitality.
 */
export function useRoutesReactor(country: string) {
  const firestore = useFirestore();
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRoutes = useCallback(async () => {
    if (!firestore) return;
    
    setLoading(true);
    try {
      // [SC-617] Sovereign Filter: Active trips only
      let routeQuery = query(
          collection(firestore, 'trips'), 
          where('status', 'in', ['Planned', 'In-Transit']),
          orderBy('createdAt', 'desc'), 
          limit(50) 
      );

      if (country !== 'all') {
           routeQuery = query(routeQuery, where('origin', '==', country));
      }
      
      const routeSnap = await getDocs(routeQuery);
      const routeMap: Record<string, number> = {};
      
      routeSnap.docs.forEach(doc => {
          const d = doc.data();
          if (d.origin && d.destination) {
              const key = `${d.origin} ➝ ${d.destination}`;
              routeMap[key] = (routeMap[key] || 0) + 1;
          }
      });

      const sortedRoutes = Object.entries(routeMap)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5); 

      setRoutes(sortedRoutes);
    } catch (error) {
      console.error("[Routes Reactor] Aggregation Rupture:", error);
    } finally {
      setLoading(false);
    }
  }, [firestore, country]);

  useEffect(() => {
    fetchRoutes();
  }, [fetchRoutes]);

  return { routes, loading };
}
