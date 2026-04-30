'use client';

/**
 * @hook useCarrierStatus
 * @description THE REINFORCED SUBSCRIPTION SENSOR (SCR-927)
 * Protocol 14: Surgical Monitoring. 
 * Protocol 88: Memoized logic to prevent redundant calculations.
 */
import { useMemo } from 'react';

export function useCarrierStatus(expiryDate: any) {
    return useMemo(() => {
        if (!expiryDate) return { isExpired: false, isWarningActive: false, hoursLeft: 0 };
        
        const now = new Date().getTime();
        // SUPPORT: Supports both Firestore Timestamp and JS Date
        const expiryTime = expiryDate.toDate ? expiryDate.toDate().getTime() : new Date(expiryDate).getTime();
        const timeDiff = expiryTime - now;
        const hoursLeft = timeDiff / (1000 * 60 * 60);

        return {
            isExpired: hoursLeft <= 0,
            isWarningActive: hoursLeft > 0 && hoursLeft <= 24, // 24h Early Warning Pulse
            hoursLeft: Math.max(0, hoursLeft)
        };
    }, [expiryDate]);
}
