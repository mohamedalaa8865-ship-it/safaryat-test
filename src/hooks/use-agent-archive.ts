"use client";

import { useMemo } from "react";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, where, orderBy, limit } from "firebase/firestore";
import type { Trip } from "@/lib/data";

/**
 * @hook useAgentArchive
 * @description THE STERILIZED AGENT ARTERY (REINFORCED - SCR-890)
 * [PROTOCOL 16]: Diamond Sterilization.
 * Heavy memoization of derived results to ensure Protocol 88 compliance.
 */
export function useAgentArchive() {
  const { user } = useUser();
  const firestore = useFirestore();

  // [PROTOCOL 88]: Sovereign Artery Query - Stable Pulse
  const tripsQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return query(collection(firestore, "trips"), where("agentId", "==", user.uid), orderBy("createdAt", "desc"), limit(100));
  }, [firestore, user?.uid]);

  const { data: allTrips, isLoading } = useCollection<Trip>(tripsQuery);

  // [PROTOCOL 16/88]: Atomic Aggregator - Memoized calculation
  const result = useMemo(() => {
    if (!allTrips) {
      return {
        recent: [],
        archive: [],
        counts: { success: 0, failed: 0 },
      };
    }

    const recent = allTrips.slice(0, 5);
    const archive = [...allTrips];

    let successCount = 0;
    let failedCount = 0;

    for (const t of allTrips) {
      // [SCR-2026-037]: Logic Alignment with SSOT Trip Status
      // We consider these statuses as agent success (planned, active or finished)
      const isSuccessful = t.status === "Completed" || t.status === "In-Transit" || t.status === "Planned" || t.status === "Offer-Received";

      if (isSuccessful) {
        successCount++;
      } else if (t.status === "Cancelled") {
        failedCount++;
      }
    }

    return {
      recent,
      archive,
      counts: { success: successCount, failed: failedCount },
    };
  }, [allTrips]);

  return { ...result, isLoading };
}
