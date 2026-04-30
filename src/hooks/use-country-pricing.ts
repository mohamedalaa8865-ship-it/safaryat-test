'use client';

import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import type { PricingRule } from '@/lib/data';

/**
 * @file src/hooks/use-country-pricing.ts
 * @description CACHE-FIRST GEOGRAPHIC PRICING ARTERY [SC-676]
 * Protocol 88: $0 Reads via single document fetch (getDoc).
 * [SC-676]: Eradicated getDocs collection fetch to prevent resource waste.
 * [SCR-2026-038]: Fixed ID duplication type error for build stability.
 */
export function useCountryPricing(countryCode: string = 'JO') {
  const firestore = useFirestore();
  const [rule, setRule] = useState<PricingRule | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPricing = useCallback(async () => {
    if (!firestore || !countryCode) return;
    
    // 1. بروتوكول الذاكرة الصلبة: الفحص المحلي أولاً (Stale-While-Revalidate)
    const cacheKey = `safar_pricing_${countryCode}`;
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          setRule(JSON.parse(cached));
          setLoading(false);
        } catch (e) {
          console.warn("Pricing cache corruption detected.");
        }
      }
    }

    // 2. الشريان السحابي: الاستدعاء المفرد الموفر للموارد (Protocol 88)
    try {
      const docRef = doc(firestore, 'pricing_rules', countryCode.toUpperCase());
      const snap = await getDoc(docRef);
      
      if (snap.exists()) {
        // [SCR-2026-038]: Atomic Data Merge - إبادة خطأ تكرار التعريف
        const enrichedRule = { 
          ...snap.data(), 
          id: snap.id 
        } as PricingRule;

        setRule(enrichedRule);
        if (typeof window !== 'undefined') {
          localStorage.setItem(cacheKey, JSON.stringify(enrichedRule)); // تحديث الذاكرة
        }
      }
    } catch (e) {
      console.error("[Pricing Artery] Pulse Lost", e);
    } finally {
      setLoading(false);
    }
  }, [firestore, countryCode]);

  useEffect(() => {
    fetchPricing();
  }, [fetchPricing]);

  return { rule, loading, refetch: fetchPricing };
}
