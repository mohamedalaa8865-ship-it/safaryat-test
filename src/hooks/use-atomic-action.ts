'use client';

/**
 * @hook useAtomicAction
 * @description THE REINFORCED ATOMIC RETRY ENGINE (SCR-930 - STERILIZED)
 * [PROTOCOL 18]: Sovereign Fission. Decouples failure state from UI.
 * [PROTOCOL 88]: Resource Protection. Persists payload for $0 re-fetch retries.
 * [PROTOCOL 20]: Digital Immune System. Maps errors to forensic traces.
 */

import { useState, useCallback } from 'react';

type ActionState = 'idle' | 'executing' | 'offline_vault' | 'payment_fallback' | 'fatal_error' | 'success';

export function useAtomicAction<T, P>(
    sovereignAction: (payload: P) => Promise<T>,
    onSuccess?: (data: T) => void
) {
    const [state, setState] = useState<ActionState>('idle');
    const [savedPayload, setSavedPayload] = useState<P | null>(null);
    const [traceId, setTraceId] = useState<string | null>(null);

    const execute = useCallback(async (payload: P) => {
        setState('executing');
        setSavedPayload(payload); // SSOT: Lock payload into memory for atomic retry

        try {
            // [PROTOCOL 88]: Pre-emptive Offline Detection
            if (typeof navigator !== 'undefined' && !navigator.onLine) {
                setState('offline_vault');
                return;
            }

            const result = await sovereignAction(payload);
            setState('success');
            if (onSuccess) onSuccess(result);

        } catch (error: any) {
            // [PROTOCOL 20]: Forensic Error Mapping
            const errStr = error?.message?.toLowerCase() || '';
            const newTraceId = `ERR-${Math.floor(Math.random() * 10000)}-${Date.now().toString().slice(-4)}`;
            setTraceId(newTraceId);

            if (errStr.includes('network') || errStr.includes('offline') || error?.code === 'unavailable') {
                setState('offline_vault');
            } else if (errStr.includes('payment') || errStr.includes('card') || errStr.includes('fund')) {
                setState('payment_fallback');
            } else {
                setState('fatal_error');
                console.error(`[Atomic Shield] Rupture Trace: ${newTraceId}`, error);
            }
        }
    }, [sovereignAction, onSuccess]);

    const retry = useCallback(() => {
        if (savedPayload) execute(savedPayload);
    }, [execute, savedPayload]);

    const convertToCash = useCallback(() => {
        // [SSOT]: Strategic Fallback to Cash to preserve the conversion pulse
        if (savedPayload) {
            execute({ ...savedPayload, paymentMethod: 'CASH' } as any);
        }
    }, [execute, savedPayload]);

    return { state, execute, retry, convertToCash, traceId };
}
