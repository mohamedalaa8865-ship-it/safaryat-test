// 'use client';

// import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
// import { firestore, auth } from '@/firebase/core';

// // [SSOT]: Local Session Debouncer to prevent Double Echo
// const REPORTED_CACHE = new Set<string>();

// /**
//  * @file src/lib/sovereign-monitor.ts
//  * @description THE REINFORCED SOVEREIGN BLACK BOX (PROTOCOL 20/88 ENFORCED - SC-806 V6.0)
//  * [SC-806 V6.0]: Optimized reporting to respect Google triangle quality standards.
//  * Captures lethal collapses and security violations for judicial review.
//  */
// export const SovereignBlackBox = {
//   /**
//    * التقارير الجنائية للانهيارات القاتلة والانتهاكات الأمنية.
//    */
//   reportLethalCrash: async (error: Error, context: string) => {
//     const trivialPatterns = [
//       'permission-denied',
//       'unauthenticated',
//       'cancelled',
//       'timeout',
//       'user-cancelled',
//       'storage/retry-limit-exceeded',
//       'auth/network-request-failed',
//       'ChunkLoadError',
//       'not-found'
//     ];

//     const isTrivial = trivialPatterns.some(pattern =>
//       error.message?.toLowerCase().includes(pattern.toLowerCase()) ||
//       (error as any).code?.includes(pattern)
//     );

//     // [SC-806] TRIANGLE CHECK: Zero noise reporting to preserve client resources
//     if (isTrivial && !context.includes('SECURITY')) {
//       console.warn(`[Immune System] Ignored expected noise: ${context}`);
//       return;
//     }

//     const signature = `${context}:${error.message}`;
//     if (REPORTED_CACHE.has(signature)) return;

//     REPORTED_CACHE.add(signature);
//     setTimeout(() => REPORTED_CACHE.delete(signature), 15000);

//     const getCategory = () => {
//         if (context.includes('SECURITY') || error.message?.includes('permission-denied')) return 'SECURITY';
//         if (error.message?.includes('memoized')) return 'LOGIC';
//         if (error.message?.includes('defined')) return 'HYGIENE';
//         if (error.name.includes('Network')) return 'NETWORK';
//         return 'GENERAL';
//     };

//     const category = getCategory();
//     const severity = category === 'SECURITY' || category === 'LOGIC' ? 'CRITICAL' : 'FATAL';

//     try {
//       if (firestore) {
//         const userId = auth?.currentUser?.uid || 'ANONYMOUS';
//         const userEmail = auth?.currentUser?.email || 'N/A';

//         // Write once, async, no blocking (Protocol 88)
//         addDoc(collection(firestore, 'fatal_crashes'), {
//           message: error.message || 'Unknown Lethal Error',
//           stack: error.stack?.slice(0, 1500),
//           context: context,
//           category: category,
//           severity: severity,
//           status: 'active',
//           resolvedAt: null,
//           resolvedBy: null,
//           resolveNote: '',
//           timestamp: serverTimestamp(),
//           url: typeof window !== 'undefined' ? window.location.href : 'Unknown',
//           culpritId: userId,
//           culpritEmail: userEmail,
//         });

//         console.error(`[BLACK_BOX_SEALED] Rupture documented in ${context}. Category: ${category}`);
//       }
//     } catch (e) {
//       console.warn("[Black Box] Documentation failed. Artery ruptured.");
//     }
//   }
// };

"use client";

import { doc, setDoc, serverTimestamp, increment } from "firebase/firestore";
import { firestore, auth } from "@/firebase/core";

// [SSOT]: Local Session Cache to prevent UI jitter and redundant cloud pulses
const REPORTED_CACHE = new Set<string>();

/**
 * @file src/lib/sovereign-monitor.ts
 * @description THE REINFORCED SOVEREIGN BLACK BOX (V11.0 - SCR-2026-049)
 * [SCR-049]: Enhanced Forensic Reactor with Atomic Increments & Agent Context.
 * Protocol 88: Resource Protected (One doc per unique rupture).
 * Protocol 20: Digital Immune System (Mandatory reporting).
 */
export const SovereignBlackBox = {
  /**
   * generateSignature: توليد بصمة جزيئية فريدة للخطأ لمنع الضجيج الرقمي
   */
  generateSignature: (message: string, context: string): string => {
    const raw = `${context}:${message}`.replace(/\s+/g, "_").toLowerCase();
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      const char = raw.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return `RUPTURE_${Math.abs(hash).toString(16)}`;
  },

  /**
   * parseStackTrace: المشرط الجزيئي لاستخراج إحداثيات الانهيار (الملف والسطر)
   */
  parseStackTrace: (stack?: string) => {
    if (!stack) return { filePath: "Unknown", lineNumber: 0 };
    const lines = stack.split("\n");
    const projectLine = lines.find((line) => line.includes("src/") && (line.includes(".ts") || line.includes(".tsx")));

    if (projectLine) {
      const match = projectLine.match(/(src\/.*?):(\d+):(\d+)/);
      if (match) {
        return { filePath: match[1], lineNumber: parseInt(match[2], 10) };
      }
    }
    return { filePath: "Internal/System", lineNumber: 0 };
  },

  /**
   * reportLethalCrash: التقارير الجنائية للانهيارات القاتلة والانتهاكات الأمنية
   */
  reportLethalCrash: async (error: Error, context: string, additionalData: any = {}) => {
    const signature = SovereignBlackBox.generateSignature(error.message, context);

    // Prevent redundant pulses in same session to protect quota
    if (REPORTED_CACHE.has(signature)) return;
    REPORTED_CACHE.add(signature);

    const { filePath, lineNumber } = SovereignBlackBox.parseStackTrace(error.stack);

    try {
      if (firestore) {
        const userId = auth?.currentUser?.uid || "ANONYMOUS";
        const userEmail = auth?.currentUser?.email || "N/A";

        // [SCR-049]: Atomic Write - Incremental occurrence tracking
        const crashRef = doc(firestore, "fatal_crashes", signature);

        await setDoc(
          crashRef,
          {
            errorHash: signature,
            message: error.message || "Unknown Lethal Error",
            stack: error.stack?.slice(0, 3000),
            filePath,
            lineNumber,
            context: context,
            category: context.includes("AGENT") ? "FIELD_OPS" : "SYSTEM",
            severity: "FATAL",
            status: "active",
            timestamp: serverTimestamp(),
            url: typeof window !== "undefined" ? window.location.href : "Unknown",
            culpritId: userId,
            culpritEmail: userEmail,
            metadata: additionalData,
            occurrenceCount: increment(1),
          },
          { merge: true },
        );

        console.error(`[BLACK_BOX_SEALED] Rupture documented: ${signature} at ${filePath}:${lineNumber}`);
      }
    } catch (e) {
      console.warn("[Black Box] Artery ruptured. Failed to seal forensics.");
    }
  },
};
