// 'use client';

// import { useMemoFirebase } from '@/firebase';
// import { useCollection, useFirestore } from '@/firebase';
// import { collection, query } from 'firebase/firestore';
// import { SOVEREIGN_GEO_REGISTRY } from '@/lib/constants';
// import { useMemo } from 'react';

// /**
//  * @hook useActiveMarkets
//  * @description THE REINFORCED GEOGRAPHIC SSOT (STERILIZED - SC-806 V2.6)
//  * Enforced useMemoFirebase for queries to ensure zero redundant reads.
//  */
// export function useActiveMarkets() {
//   const firestore = useFirestore();

//   // Listen directly to the Owner's established markets in pricing_rules
//   const pricingQuery = useMemoFirebase(() => {
//     if (!firestore) return null;
//     return query(collection(firestore, 'pricing_rules'));
//   }, [firestore]);

//   const { data: rules, isLoading } = useCollection(pricingQuery);

//   const activeMarkets = useMemo(() => {
//     if (!rules) return [];

//     return rules
//       .filter(rule => rule.isActive) // Only return markets explicitly activated by Owner
//       .map(rule => {
//         const registryInfo = SOVEREIGN_GEO_REGISTRY[rule.id] || {
//           name: rule.countryName || rule.id,
//           defaultCurrency: rule.currency || 'USD',
//           cities: []
//         };

//         return {
//           id: rule.id, // e.g., JO
//           code: rule.id,
//           name: registryInfo.name,
//           currency: rule.currency || registryInfo.defaultCurrency,
//           cities: registryInfo.cities,
//           subscriptionFee: rule.carrierSubscriptionFee || 0,
//           passengerFee: rule.travelerCommissionFee || 0
//         };
//       })
//       .sort((a, b) => a.name.localeCompare(b.name));
//   }, [rules]);

//   /**
//    * @function getMarketName
//    * @description PURE SSOT HELPER: Resolves country key to display name.
//    */
//   const getMarketName = (id: string) => {
//     if (id === 'all') return 'العالم';
//     return SOVEREIGN_GEO_REGISTRY[id.toUpperCase()]?.name || activeMarkets.find(m => m.id === id)?.name || id;
//   };

//   return { activeMarkets, getMarketName, isLoading };
// }
"use client";

import { useMemoFirebase } from "@/firebase";
import { useCollection, useFirestore } from "@/firebase";
import { collection, query } from "firebase/firestore";
import { SOVEREIGN_GEO_REGISTRY } from "@/lib/constants";
import { useMemo } from "react";
import { useLocale } from "next-intl";

export function useActiveMarkets() {
  const firestore = useFirestore();
  const locale = useLocale(); // ← زود ده

  const pricingQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "pricing_rules"));
  }, [firestore]);

  const { data: rules, isLoading } = useCollection(pricingQuery);

  const activeMarkets = useMemo(() => {
    if (!rules) return [];

    return rules
      .filter((rule) => rule.isActive)
      .map((rule) => {
        const registryInfo = SOVEREIGN_GEO_REGISTRY[rule.id] || {
          name: rule.countryName || rule.id,
          nameEn: rule.countryName || rule.id,
          defaultCurrency: rule.currency || "USD",
          cities: [],
        };

        return {
          id: rule.id,
          code: rule.id,
          name: locale === "en" ? registryInfo.nameEn : registryInfo.name, // ← حسب اللغة
          currency: rule.currency || registryInfo.defaultCurrency,
          cities: registryInfo.cities,
          subscriptionFee: rule.carrierSubscriptionFee || 0,
          passengerFee: rule.travelerCommissionFee || 0,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [rules, locale]); // ← زود locale هنا

  const getMarketName = (id: string) => {
    if (id === "all") return locale === "en" ? "All" : "العالم";
    const entry = SOVEREIGN_GEO_REGISTRY[id.toUpperCase()];
    if (!entry) return activeMarkets.find((m) => m.id === id)?.name || id;
    return locale === "en" ? entry.nameEn : entry.name; // ← حسب اللغة
  };

  return { activeMarkets, getMarketName, isLoading };
}
