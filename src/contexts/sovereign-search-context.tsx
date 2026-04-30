'use client';

/**
 * @context SovereignSearchContext
 * @description SSOT Context for search state — prevents duplicate Firestore listeners
 * Single instance shared between SmartRadar and ProxyBookingForm.
 */

import { createContext, useContext, ReactNode } from 'react';
import { useSovereignSearch } from '@/hooks/use-sovereign-search';

type SovereignSearchContextType = ReturnType<typeof useSovereignSearch>;

const SovereignSearchContext = createContext<SovereignSearchContextType | null>(null);

export function SovereignSearchProvider({ children }: { children: ReactNode }) {
    const search = useSovereignSearch();
    return (
        <SovereignSearchContext.Provider value={search}>
            {children}
        </SovereignSearchContext.Provider>
    );
}

export function useSovereignSearchContext(): SovereignSearchContextType {
    const ctx = useContext(SovereignSearchContext);
    if (!ctx) throw new Error('useSovereignSearchContext must be used inside SovereignSearchProvider');
    return ctx;
}