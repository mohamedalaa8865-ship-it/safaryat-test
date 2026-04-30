'use client';

import { useMemoFirebase, useCollection, useFirestore } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import { useDebounce } from './use-debounce';
import { useMemo } from 'react';

/**
 * @hook useCarrierDispatch
 * @description THE REINFORCED DISPATCH ARTERY (PROTOCOL 43 - SC-847)
 * [SC-847]: Neurological decoupling of carrier search logic from the UI.
 * Protocol 88: Zero-Waste via debounced queries and limited snapshots.
 */
export function useCarrierDispatch(searchTerm: string) {
  const firestore = useFirestore();
  
  // [PROTOCOL 88]: Arterial Throttle to prevent network chatter
  const debouncedSearch = useDebounce(searchTerm, 500);

  const carriersQuery = useMemoFirebase(() => {
    if (!firestore || debouncedSearch.length < 2) return null;
    
    // Targeted query for candidates in the dispatch registry
    return query(
      collection(firestore, 'users'),
      where('role', '==', 'carrier'),
      limit(10)
    );
  }, [firestore, debouncedSearch]);

  const { data: rawCarriers, isLoading } = useCollection(carriersQuery);

  // [PROTOCOL 16]: Pure In-Memory Filtering (Loose Coupling)
  const carriers = useMemo(() => {
    if (!rawCarriers) return [];
    const q = debouncedSearch.toLowerCase();
    return rawCarriers.filter((c: any) => 
      c.firstName?.toLowerCase().includes(q) ||
      c.officeName?.toLowerCase().includes(q) ||
      c.phoneNumber?.includes(q)
    );
  }, [rawCarriers, debouncedSearch]);

  return { carriers, isLoading };
}
