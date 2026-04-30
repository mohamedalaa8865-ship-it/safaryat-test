'use client';

/**
 * @file src/hooks/use-strategic-intelligence.ts
 * @description THE SOVEREIGN STRATEGIC PULSE REACTOR (SCR-935 - DIAMOND STERILIZED)
 * [PROTOCOL 3/3]: Single Source of Truth (SSOT) merging counters and live reactors.
 * [PROTOCOL 88]: Strict Cleanup & Memoization to prevent Resource Bleed.
 * [PROTOCOL 20]: Digital Immune System active. No silent failures.
 */

import { useState, useEffect, useMemo } from 'react';
import { useFirestore } from '@/firebase';
import { doc, onSnapshot, collection, query, where } from 'firebase/firestore';

export interface MasterStats {
    totalUsers: number;
    totalTripsHistory: number;
    activeOperations: number;
    totalRevenue: number;
}

export function useStrategicIntelligence(country: string = 'all') {
    const firestore = useFirestore();
    const [rawCounters, setRawCounters] = useState<any>({});
    const [activeOperationsCount, setActiveOperationsCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!firestore) return;

        setIsLoading(true);
        setError(null);

        // 1. [SSOT Stream A]: الاستماع للعدادات السيادية (التاريخية والتراكمية)
        const countersRef = doc(firestore, 'system_config', 'counters');
        const countersUnsub = onSnapshot(countersRef, 
            (docSnap) => {
                if (docSnap.exists()) {
                    setRawCounters(docSnap.data());
                }
            }, 
            (err) => {
                const traceId = `ERR-PULSE-C-${Date.now().toString().slice(-4)}`;
                console.error(`[SCR-935] Counters Schism. Trace: ${traceId}`, err);
                setError(traceId);
            }
        );

        // 2. [SSOT Stream B]: الاستماع للعمليات الحية (لحل أزمة تأخر تحديث العدادات)
        const tripsRef = collection(firestore, 'trips');
        let activeTripsQuery = query(tripsRef, where('status', 'in', ['Planned', 'In-Transit']));
        
        // [SC-935] Geo-Injection: Filter live pulse if country is specified
        if (country !== 'all') {
            activeTripsQuery = query(activeTripsQuery, where('origin', '==', country));
        }

        const reactorsUnsub = onSnapshot(activeTripsQuery, 
            (snapshot) => {
                setActiveOperationsCount(snapshot.size); 
                setIsLoading(false); 
            }, 
            (err) => {
                const traceId = `ERR-PULSE-R-${Date.now().toString().slice(-4)}`;
                console.error(`[SCR-935] Live Reactor Schism. Trace: ${traceId}`, err);
                setError(traceId);
                setIsLoading(false);
            }
        );

        // [PROTOCOL 88]: إعدام القنوات فور الخروج لمنع النزيف السحابي
        return () => {
            countersUnsub();
            reactorsUnsub();
        };
    }, [firestore, country]);

    // 3. [PROTOCOL 3/3 & P88]: دمج التيارات في مصدر حقيقة واحد يمنع الرندرة العشوائية
    const metrics = useMemo<MasterStats>(() => {
        return {
            totalUsers: (rawCounters.travelersCount || 0) + (rawCounters.carriersCount || 0),
            totalTripsHistory: rawCounters.tripsCount || 0,
            activeOperations: activeOperationsCount, 
            totalRevenue: rawCounters.totalRevenue || 0,
        };
    }, [rawCounters, activeOperationsCount]);

    return { metrics, isLoading, error };
}
