'use client';

/**
 * @file src/hooks/use-owner-intelligence.ts
 * @description THE REINFORCED SOVEREIGN ARTERY [SCR-935 - DIAMOND STERILIZED]
 * [SCR-935]: Refactored with Pulse Damper (Debounce) & Dynamic Genomic Discovery.
 * Protocol 88: Resource Protected (Debounced Queries & Cache).
 * Protocol 16: Diamond Sterilized logic separation.
 */

import { useMemoFirebase, useFirestore, useCollection } from '@/firebase';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { useState, useCallback, useMemo, useEffect } from 'react';
import { useStrategicIntelligence } from './use-strategic-intelligence';
import { useDebounce } from './use-debounce';

export interface ForensicLog {
    id: string | number;
    time: string;
    sender: string;
    message: string;
    type?: 'system' | 'transfer' | 'judicial';
}

const ATOMIC_PATTERNS = {
    TRIP: /^TRP-\d+/,
    BOOKING: /^BKG-\d+/,
    USER: /^[TCA]-26-\d+/ 
};

export function useOwnerIntelligence() {
    const firestore = useFirestore();
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResult, setSearchResult] = useState<any>(null);

    // [PROTOCOL 88]: Pulse Damper - Wait 500ms before firing cloud queries
    const debouncedSearch = useDebounce(searchTerm, 500);

    // [SSOT]: Consolidated Pulse from the Strategic Reactor
    const { metrics: counters, isLoading: isCountersLoading } = useStrategicIntelligence();

    // [SCR-925]: Live Judicial Feed - Real-time Audit Tracking
    const judicialQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(
            collection(firestore, 'admin_logs'),
            where('action', 'in', ['TRANSFER', 'PRICING_UPDATE', 'SYSTEM_REPAIR', 'BROADCAST']),
            orderBy('timestamp', 'desc'),
            limit(5)
        );
    }, [firestore]);

    const { data: recentJudicialActions, isLoading: isJudicialLoading } = useCollection(judicialQuery);

    /**
     * @function executeSnipe
     * @description THE REINFORCED ATOMIC SNIPE [SCR-935]
     * Dynamic genomic discovery to eradicate hardcoded prefix drift.
     */
    const executeSnipe = useCallback(async (qStr: string) => {
        if (!qStr || !firestore) {
            setSearchResult(null);
            return;
        }

        const upperQuery = qStr.trim().toUpperCase();
        setIsSearching(true);

        try {
            // [SCR-935]: Dynamic Artery Discovery Pattern
            let targetCollections = ['users', 'trips', 'bookings'];
            
            // Genomic Optimization: If it looks like a user ID, search users first
            if (ATOMIC_PATTERNS.USER.test(upperQuery)) targetCollections = ['users'];
            else if (ATOMIC_PATTERNS.TRIP.test(upperQuery)) targetCollections = ['trips'];
            else if (ATOMIC_PATTERNS.BOOKING.test(upperQuery)) targetCollections = ['bookings'];

            for (const colName of targetCollections) {
                const q = query(collection(firestore, colName), where('atomicId', '==', upperQuery), limit(1));
                const snap = await getDocs(q);
                
                if (!snap.empty) {
                    const data = { id: snap.docs[0].id, type: colName, ...snap.docs[0].data() };
                    setSearchResult(data);
                    setIsSearching(false);
                    return;
                }
            }

            setSearchResult(null);
        } catch (err: any) {
            console.error("[Atomic Snipe] Artery Rupture:", err);
        } finally {
            setIsSearching(false);
        }
    }, [firestore]);

    // [PROTOCOL 88]: Trigger snipe only when debounced term changes
    useEffect(() => {
        if (debouncedSearch) executeSnipe(debouncedSearch);
        else setSearchResult(null);
    }, [debouncedSearch, executeSnipe]);

    /**
     * @function forensicTimeline
     * @description Pure Logical Reactor: Reconstructs logs into a stream.
     */
    const forensicTimeline = useMemo((): ForensicLog[] => {
        const rawArchive = searchResult?.chatArchive || searchResult?.tripChatArchive;
        if (!rawArchive) return [];
        
        return rawArchive.split('\n')
            .filter((line: string) => line.trim() !== '')
            .map((line: string, index: number) => {
                const timeMatch = line.match(/\[(.*?)\]/);
                const senderMatch = line.match(/\] (.*?):/);
                const content = line.split(': ').slice(1).join(': ');
                
                return {
                    id: `log-${index}`,
                    time: timeMatch ? timeMatch[1] : 'N/A',
                    sender: senderMatch ? senderMatch[1] : 'System',
                    message: content,
                    type: line.includes('إشعار سيادي') ? 'judicial' : 'system'
                };
            });
    }, [searchResult]);

    return { 
        counters, 
        isCountersLoading,
        searchTerm,
        setSearchTerm,
        isSearching,
        searchResult,
        forensicTimeline,
        recentJudicialActions,
        isJudicialLoading
    };
}
