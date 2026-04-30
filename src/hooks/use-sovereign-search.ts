// /**
//  * @hook useSovereignSearch
//  * @description THE REINFORCED PERSISTENT SEARCH ENGINE (STERILIZED - V23.0 - DIAMOND)
//  * [PROTOCOL 16]: Diamond Sterilization. Unified logic for Agents and Public search.
//  * [PROTOCOL 55]: Context Integrity via URL Persistence.
//  * [PROTOCOL 88]: Debounced queries to protect cloud resources.
//  */
// "use client";

// import { useMemoFirebase, useCollection, useFirestore } from "@/firebase";
// import { collection, query, where, orderBy, limit } from "firebase/firestore";
// import type { Trip, UserProfile } from "@/lib/data";
// import { useMemo, useState, useCallback, useEffect, useRef } from "react";
// // import { useDebounce } from "./use-debounce";
// import { useSearchParams, useRouter, usePathname } from "next/navigation";

// export interface SovereignSearchFilters {
//   originCountry: string;
//   originCity: string;
//   destCountry: string;
//   destCity: string;
//   travelDate?: Date;
//   seats: number;
//   vehicleCategory: "any" | "small" | "bus";
// }

// export function useSovereignSearch() {
//   const firestore = useFirestore();
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const pathname = usePathname();

//   // [SSOT]: Core Filter Artery - Linked to URL state
//   const [filters, setFilters] = useState<SovereignSearchFilters>(() => {
//     if (typeof window === "undefined") return { originCountry: "", originCity: "", destCountry: "", destCity: "", seats: 1, vehicleCategory: "any" };

//     return {
//       originCountry: searchParams.get("oc") || "",
//       originCity: searchParams.get("o") || "",
//       destCountry: searchParams.get("dc") || "",
//       destCity: searchParams.get("d") || "",
//       seats: parseInt(searchParams.get("s") || "1"),
//       vehicleCategory: (searchParams.get("v") as any) || "any",
//       travelDate: searchParams.get("dt") ? new Date(searchParams.get("dt")!) : undefined,
//     };
//   });

//   // [PROTOCOL 55]: Arterial Sync - Zero state loss on refresh
//   // useEffect(() => {
//   //   const params = new URLSearchParams();
//   //   if (filters.originCity) params.set('o', filters.originCity);
//   //   if (filters.destCity) params.set('d', filters.destCity);
//   //   if (filters.originCountry) params.set('oc', filters.originCountry);
//   //   if (filters.destCountry) params.set('dc', filters.destCountry);
//   //   if (filters.travelDate) params.set('dt', filters.travelDate.toISOString().split('T')[0]);
//   //   if (filters.seats > 1) params.set('s', filters.seats.toString());
//   //   if (filters.vehicleCategory !== 'any') params.set('v', filters.vehicleCategory);

//   //   const currentQuery = params.toString();
//   //   if (currentQuery !== searchParams.toString()) {
//   //       router.replace(`${pathname}?${currentQuery}`, { scroll: false });
//   //   }
//   // }, [filters, searchParams, router, pathname]);
//   const [committedKey, setCommittedKey] = useState("");
//   const activeKey = `${filters.originCity}|${filters.destCity}`;

//   useEffect(() => {
//     if (!filters.originCity || !filters.destCity) {
//       setCommittedKey("");
//       return;
//     }
//     setCommittedKey(activeKey);
//   }, [filters.originCity, filters.destCity]);

//   const isQuerySettled = committedKey === activeKey && !!filters.originCity && !!filters.destCity;
//   useEffect(() => {
//     const params = new URLSearchParams();
//     if (filters.originCity) params.set("o", filters.originCity);
//     if (filters.destCity) params.set("d", filters.destCity);
//     if (filters.originCountry) params.set("oc", filters.originCountry);
//     if (filters.destCountry) params.set("dc", filters.destCountry);
//     if (filters.travelDate) params.set("dt", filters.travelDate.toISOString().split("T")[0]);
//     if (filters.seats > 1) params.set("s", filters.seats.toString());
//     if (filters.vehicleCategory !== "any") params.set("v", filters.vehicleCategory);

//     const currentQuery = params.toString();
//     const existingQuery = window.location.search.replace("?", "");

//     // ✅ بدون router - مش بيسبب re-render
//     if (currentQuery !== existingQuery) {
//       window.history.replaceState(null, "", `${pathname}?${currentQuery}`);
//     }
//   }, [filters, pathname]);
//   // const debouncedOrigin = useDebounce(filters.originCity, 500);
//   // const debouncedDest = useDebounce(filters.destCity, 500);

//   // const isRadarActive = useMemo(() => Boolean(debouncedOrigin && debouncedDest), [debouncedOrigin, debouncedDest]);
//   const isRadarActive = useMemo(() => Boolean(filters.originCity && filters.destCity), [filters.originCity, filters.destCity]);

//   // [PROTOCOL 88]: Sovereign Queries - Limited and Targetted
//   // const tripsQuery = useMemoFirebase(() => {
//   //   if (!firestore || !isRadarActive) return null;
//   //   return query(
//   //     collection(firestore, "trips"),
//   //     // where("origin", "==", debouncedOrigin),
//   //     // where("destination", "==", debouncedDest),
//   //     where("origin", "==", filters.originCity),
//   //     where("destination", "==", filters.destCity),
//   //     where("status", "==", "Planned"),
//   //     orderBy("departureDate", "asc"),
//   //     limit(20),
//   //   );
//   //   // }, [firestore, debouncedOrigin, debouncedDest, isRadarActive]);
//   // }, [firestore, filters.originCity, filters.destCity, isRadarActive]);
//   // const tripsQuery = useMemoFirebase(() => {
//   //   if (!firestore || !filters.originCity || !filters.destCity) return null;
//   //   return query(
//   //     collection(firestore, "trips"),
//   //     where("origin", "==", filters.originCity),
//   //     where("destination", "==", filters.destCity),
//   //     where("status", "==", "Planned"),
//   //     orderBy("departureDate", "asc"),
//   //     limit(20),
//   //   );
//   // }, [firestore, filters.originCity, filters.destCity]); // ✅ بدون isRadarActive
//   const tripsQuery = useMemoFirebase(() => {
//     if (!firestore || !filters.originCity || !filters.destCity) return null;
//     return query(
//       collection(firestore, "trips"),
//       where("origin", "==", filters.originCity),
//       where("destination", "==", filters.destCity),
//       where("status", "in", ["Planned", "In-Transit"]), // ✅ بدل == "Planned"
//       orderBy("departureDate", "asc"),
//       limit(20),
//     );
//   }, [firestore, filters.originCity, filters.destCity]);
//   const carriersQuery = useMemoFirebase(() => {
//     if (!firestore || !isRadarActive) return null;
//     return query(
//       collection(firestore, "users"),
//       where("role", "==", "carrier"),
//       // where("jurisdiction.origin", "==", debouncedOrigin),
//       // where("jurisdiction.destination", "==", debouncedDest),
//       where("jurisdiction.origin", "==", filters.originCity),
//       where("jurisdiction.destination", "==", filters.destCity),
//       limit(15),
//     );
//     // }, [firestore, debouncedOrigin, debouncedDest, isRadarActive]);
//   }, [firestore, filters.originCity, filters.destCity, isRadarActive]);

//   const { data: rawTrips, isLoading: loadingTrips } = useCollection<Trip>(tripsQuery);
//   const { data: rawCarriers, isLoading: loadingCarriers } = useCollection<UserProfile>(carriersQuery);
//   const updateFilters = useCallback((updates: Partial<SovereignSearchFilters>) => {
//     setFilters((prev) => ({ ...prev, ...updates }));
//   }, []);

//   // const clearFilters = useCallback(() => {
//   //   setFilters({ originCountry: "", originCity: "", destCountry: "", destCity: "", seats: 1, vehicleCategory: "any" });
//   // }, []);

//   const clearFilters = useCallback(() => {
//     setCommittedKey(""); // ✅
//     setFilters({ originCountry: "", originCity: "", destCountry: "", destCity: "", seats: 1, vehicleCategory: "any" });
//   }, []);
//   // [PROTOCOL 16]: Pure Data Processing
//   const processedData = useMemo(() => {
//     if (!isRadarActive) return { trips: [], carriers: [] };
//     // [SCR-1004]: Only filter when both origin and dest are set
//     const trips = (rawTrips || []).filter((t) => {
//       const matchSeats = (t.availableSeats || 0) >= filters.seats;
//       const matchCat = filters.vehicleCategory === "any" || t.vehicleCategory === filters.vehicleCategory;
//       const matchDate = filters.travelDate ? new Date(t.departureDate).toDateString() === filters.travelDate.toDateString() : true;
//       return matchSeats && matchCat && matchDate;
//     });

//     const carriers = (rawCarriers || []).filter((c) => {
//       const capacity = c.vehicleCapacity || 0;
//       const matchSeats = capacity >= filters.seats;
//       const matchCat = filters.vehicleCategory === "any" || (filters.vehicleCategory === "small" ? capacity <= 7 : capacity > 7);
//       return matchSeats && matchCat;
//     });

//     return { trips, carriers };
//   }, [rawTrips, rawCarriers, filters]);

//   return {
//     filters,
//     updateFilters,
//     clearFilters,
//     matchedTrips: processedData.trips,
//     matchedCarriers: processedData.carriers,
//     isLoading: loadingTrips || loadingCarriers,
//     // radarStatus: !isRadarActive ? "idle" : loadingTrips || loadingCarriers ? "loading" : "success",
//     // radarStatus: !isRadarActive ? "idle" : loadingTrips || loadingCarriers || rawTrips === undefined ? "loading" : "success",
//     radarStatus: !isRadarActive ? "idle" : !isQuerySettled || loadingTrips || loadingCarriers || rawTrips === null ? "loading" : "success",
//   };
// }
// /**
//  * @hook useSovereignSearch
//  * @description THE REINFORCED PERSISTENT SEARCH ENGINE (STERILIZED - V23.0 - DIAMOND)
//  * [PROTOCOL 16]: Diamond Sterilization. Unified logic for Agents and Public search.
//  * [PROTOCOL 55]: Context Integrity via URL Persistence.
//  * [PROTOCOL 88]: Debounced queries to protect cloud resources.
//  */
// "use client";

// import { useMemoFirebase, useCollection, useFirestore } from "@/firebase";
// import { collection, query, where, orderBy, limit } from "firebase/firestore";
// import type { Trip, UserProfile } from "@/lib/data";
// import { useMemo, useState, useCallback, useEffect } from "react";
// // import { useDebounce } from "./use-debounce";
// import { useSearchParams, useRouter, usePathname } from "next/navigation";

// export interface SovereignSearchFilters {
//   originCountry: string;
//   originCity: string;
//   destCountry: string;
//   destCity: string;
//   travelDate?: Date;
//   seats: number;
//   vehicleCategory: "any" | "small" | "bus";
// }

// export function useSovereignSearch() {
//   const firestore = useFirestore();
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const pathname = usePathname();

//   // [SSOT]: Core Filter Artery - Linked to URL state
//   const [filters, setFilters] = useState<SovereignSearchFilters>(() => {
//     if (typeof window === "undefined") return { originCountry: "", originCity: "", destCountry: "", destCity: "", seats: 1, vehicleCategory: "any" };

//     return {
//       originCountry: searchParams.get("oc") || "",
//       originCity: searchParams.get("o") || "",
//       destCountry: searchParams.get("dc") || "",
//       destCity: searchParams.get("d") || "",
//       seats: parseInt(searchParams.get("s") || "1"),
//       vehicleCategory: (searchParams.get("v") as any) || "any",
//       travelDate: searchParams.get("dt") ? new Date(searchParams.get("dt")!) : undefined,
//     };
//   });

//   // [PROTOCOL 55]: Arterial Sync - Zero state loss on refresh
//   // useEffect(() => {
//   //   const params = new URLSearchParams();
//   //   if (filters.originCity) params.set('o', filters.originCity);
//   //   if (filters.destCity) params.set('d', filters.destCity);
//   //   if (filters.originCountry) params.set('oc', filters.originCountry);
//   //   if (filters.destCountry) params.set('dc', filters.destCountry);
//   //   if (filters.travelDate) params.set('dt', filters.travelDate.toISOString().split('T')[0]);
//   //   if (filters.seats > 1) params.set('s', filters.seats.toString());
//   //   if (filters.vehicleCategory !== 'any') params.set('v', filters.vehicleCategory);

//   //   const currentQuery = params.toString();
//   //   if (currentQuery !== searchParams.toString()) {
//   //       router.replace(`${pathname}?${currentQuery}`, { scroll: false });
//   //   }
//   // }, [filters, searchParams, router, pathname]);
//   useEffect(() => {
//     const params = new URLSearchParams();
//     if (filters.originCity) params.set("o", filters.originCity);
//     if (filters.destCity) params.set("d", filters.destCity);
//     if (filters.originCountry) params.set("oc", filters.originCountry);
//     if (filters.destCountry) params.set("dc", filters.destCountry);
//     if (filters.travelDate) params.set("dt", filters.travelDate.toISOString().split("T")[0]);
//     if (filters.seats > 1) params.set("s", filters.seats.toString());
//     if (filters.vehicleCategory !== "any") params.set("v", filters.vehicleCategory);

//     const currentQuery = params.toString();
//     const existingQuery = window.location.search.replace("?", "");

//     // ✅ بدون router - مش بيسبب re-render
//     if (currentQuery !== existingQuery) {
//       window.history.replaceState(null, "", `${pathname}?${currentQuery}`);
//     }
//   }, [filters, pathname]);
//   // const debouncedOrigin = useDebounce(filters.originCity, 500);
//   // const debouncedDest = useDebounce(filters.destCity, 500);

//   // const isRadarActive = useMemo(() => Boolean(debouncedOrigin && debouncedDest), [debouncedOrigin, debouncedDest]);
//   const isRadarActive = useMemo(() => Boolean(filters.originCity && filters.destCity), [filters.originCity, filters.destCity]);

//   // [PROTOCOL 88]: Sovereign Queries - Limited and Targetted
//   // const tripsQuery = useMemoFirebase(() => {
//   //   if (!firestore || !isRadarActive) return null;
//   //   return query(
//   //     collection(firestore, "trips"),
//   //     // where("origin", "==", debouncedOrigin),
//   //     // where("destination", "==", debouncedDest),
//   //     where("origin", "==", filters.originCity),
//   //     where("destination", "==", filters.destCity),
//   //     where("status", "==", "Planned"),
//   //     orderBy("departureDate", "asc"),
//   //     limit(20),
//   //   );
//   //   // }, [firestore, debouncedOrigin, debouncedDest, isRadarActive]);
//   // }, [firestore, filters.originCity, filters.destCity, isRadarActive]);
//   const tripsQuery = useMemoFirebase(() => {
//     if (!firestore || !filters.originCity || !filters.destCity) return null;
//     return query(
//       collection(firestore, "trips"),
//       where("origin", "==", filters.originCity),
//       where("destination", "==", filters.destCity),
//       where("status", "==", "Planned"),
//       orderBy("departureDate", "asc"),
//       limit(20),
//     );
//   }, [firestore, filters.originCity, filters.destCity]); // ✅ بدون isRadarActive
//   const carriersQuery = useMemoFirebase(() => {
//     if (!firestore || !isRadarActive) return null;
//     return query(
//       collection(firestore, "users"),
//       where("role", "==", "carrier"),
//       // where("jurisdiction.origin", "==", debouncedOrigin),
//       // where("jurisdiction.destination", "==", debouncedDest),
//       where("jurisdiction.origin", "==", filters.originCity),
//       where("jurisdiction.destination", "==", filters.destCity),
//       limit(15),
//     );
//     // }, [firestore, debouncedOrigin, debouncedDest, isRadarActive]);
//   }, [firestore, filters.originCity, filters.destCity, isRadarActive]);

//   const { data: rawTrips, isLoading: loadingTrips } = useCollection<Trip>(tripsQuery);
//   const { data: rawCarriers, isLoading: loadingCarriers } = useCollection<UserProfile>(carriersQuery);
//   console.log("originCity:", filters.originCity);
//   console.log("destCity:", filters.destCity);
//   console.log("rawTrips:", rawTrips);
//   console.log("isRadarActive:", isRadarActive);
//   const updateFilters = useCallback((updates: Partial<SovereignSearchFilters>) => {
//     setFilters((prev) => ({ ...prev, ...updates }));
//   }, []);

//   const clearFilters = useCallback(() => {
//     setFilters({ originCountry: "", originCity: "", destCountry: "", destCity: "", seats: 1, vehicleCategory: "any" });
//   }, []);

//   // [PROTOCOL 16]: Pure Data Processing
//   const processedData = useMemo(() => {
//     if (!isRadarActive) return { trips: [], carriers: [] };

//     const trips = (rawTrips || []).filter((t) => {
//       const matchSeats = (t.availableSeats || 0) >= filters.seats;
//       const matchCat = filters.vehicleCategory === "any" || t.vehicleCategory === filters.vehicleCategory;
//       const matchDate = filters.travelDate ? new Date(t.departureDate).toDateString() === filters.travelDate.toDateString() : true;
//       return matchSeats && matchCat && matchDate;
//     });

//     const carriers = (rawCarriers || []).filter((c) => {
//       const capacity = c.vehicleCapacity || 0;
//       const matchSeats = capacity >= filters.seats;
//       const matchCat = filters.vehicleCategory === "any" || (filters.vehicleCategory === "small" ? capacity <= 7 : capacity > 7);
//       return matchSeats && matchCat;
//     });

//     return { trips, carriers };
//   }, [rawTrips, rawCarriers, filters, isRadarActive]);

//   return {
//     filters,
//     updateFilters,
//     clearFilters,
//     matchedTrips: processedData.trips,
//     matchedCarriers: processedData.carriers,
//     isLoading: loadingTrips || loadingCarriers,
//     radarStatus: !isRadarActive ? "idle" : loadingTrips || loadingCarriers ? "loading" : "success",
//   };
// }

// /**
//  * @hook useSovereignSearch
//  * @description THE REINFORCED PERSISTENT SEARCH ENGINE (STERILIZED - V23.0 - DIAMOND)
//  * [PROTOCOL 16]: Diamond Sterilization. Unified logic for Agents and Public search.
//  * [PROTOCOL 55]: Context Integrity via URL Persistence.
//  * [PROTOCOL 88]: Debounced queries to protect cloud resources.
//  */
// "use client";

// import { useMemoFirebase, useCollection, useFirestore } from "@/firebase";
// import { collection, query, where, orderBy, limit } from "firebase/firestore";
// import type { Trip, UserProfile } from "@/lib/data";
// import { useMemo, useState, useCallback, useEffect, useRef } from "react";
// import { useSearchParams, useRouter, usePathname } from "next/navigation";

// export interface SovereignSearchFilters {
//   originCountry: string;
//   originCity: string;
//   destCountry: string;
//   destCity: string;
//   travelDate?: Date;
//   seats: number;
//   vehicleCategory: "any" | "small" | "bus";
// }

// export function useSovereignSearch() {
//   const firestore = useFirestore();
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const pathname = usePathname();

//   // [SCR-TRIP-SELECT]: Selected Trip State
//   const [selectedTrip, setSelectedTrip] = useState<any | null>(null);

//   const selectTrip = useCallback((trip: any | null) => {
//     setSelectedTrip(trip);
//   }, []);

//   // [SSOT]: Core Filter Artery - Linked to URL state
//   const [filters, setFilters] = useState<SovereignSearchFilters>(() => {
//     if (typeof window === "undefined") return { originCountry: "", originCity: "", destCountry: "", destCity: "", seats: 1, vehicleCategory: "any" };

//     return {
//       originCountry: searchParams.get("oc") || "",
//       originCity: searchParams.get("o") || "",
//       destCountry: searchParams.get("dc") || "",
//       destCity: searchParams.get("d") || "",
//       seats: parseInt(searchParams.get("s") || "1"),
//       vehicleCategory: (searchParams.get("v") as any) || "any",
//       travelDate: searchParams.get("dt") ? new Date(searchParams.get("dt")!) : undefined,
//     };
//   });

//   // [PROTOCOL 55]: Arterial Sync - Zero state loss on refresh
//   const [committedKey, setCommittedKey] = useState("");
//   const activeKey = `${filters.originCity}|${filters.destCity}`;

//   useEffect(() => {
//     if (!filters.originCity || !filters.destCity) {
//       setCommittedKey("");
//       return;
//     }
//     setCommittedKey(activeKey);
//   }, [filters.originCity, filters.destCity]);

//   const isQuerySettled = committedKey === activeKey && !!filters.originCity && !!filters.destCity;
//   useEffect(() => {
//     const params = new URLSearchParams();
//     if (filters.originCity) params.set("o", filters.originCity);
//     if (filters.destCity) params.set("d", filters.destCity);
//     if (filters.originCountry) params.set("oc", filters.originCountry);
//     if (filters.destCountry) params.set("dc", filters.destCountry);
//     if (filters.travelDate) params.set("dt", filters.travelDate.toISOString().split("T")[0]);
//     if (filters.seats > 1) params.set("s", filters.seats.toString());
//     if (filters.vehicleCategory !== "any") params.set("v", filters.vehicleCategory);

//     const currentQuery = params.toString();
//     const existingQuery = window.location.search.replace("?", "");

//     // ✅ بدون router - مش بيسبب re-render
//     if (currentQuery !== existingQuery) {
//       window.history.replaceState(null, "", `${pathname}?${currentQuery}`);
//     }
//   }, [filters, pathname]);
//   const isRadarActive = useMemo(() => Boolean(filters.originCity && filters.destCity), [filters.originCity, filters.destCity]);

//   const tripsQuery = useMemoFirebase(() => {
//     if (!firestore || !filters.originCity || !filters.destCity) return null;
//     return query(
//       collection(firestore, "trips"),
//       where("origin", "==", filters.originCity),
//       where("destination", "==", filters.destCity),
//       where("status", "in", ["Planned", "In-Transit"]), // ✅ بدل == "Planned"
//       orderBy("departureDate", "asc"),
//       limit(20),
//     );
//   }, [firestore, filters.originCity, filters.destCity]);
//   const carriersQuery = useMemoFirebase(() => {
//     if (!firestore || !isRadarActive) return null;
//     return query(
//       collection(firestore, "users"),
//       where("role", "==", "carrier"),
//       // where("jurisdiction.origin", "==", debouncedOrigin),
//       // where("jurisdiction.destination", "==", debouncedDest),
//       where("jurisdiction.origin", "==", filters.originCity),
//       where("jurisdiction.destination", "==", filters.destCity),
//       limit(15),
//     );
//   }, [firestore, filters.originCity, filters.destCity, isRadarActive]);

//   const { data: rawTrips, isLoading: loadingTrips } = useCollection<Trip>(tripsQuery);
//   const { data: rawCarriers, isLoading: loadingCarriers } = useCollection<UserProfile>(carriersQuery);
//   const updateFilters = useCallback((updates: Partial<SovereignSearchFilters>) => {
//     setFilters((prev) => ({ ...prev, ...updates }));
//   }, []);

//   const clearFilters = useCallback(() => {
//     setCommittedKey(""); // ✅
//     setSelectedTrip(null);
//     setFilters({ originCountry: "", originCity: "", destCountry: "", destCity: "", seats: 1, vehicleCategory: "any" });
//   }, []);
//   // [PROTOCOL 16]: Pure Data Processing
//   const processedData = useMemo(() => {
//     if (!isRadarActive) return { trips: [], carriers: [] };
//     // [SCR-1004]: Only filter when both origin and dest are set
//     const trips = (rawTrips || []).filter((t) => {
//       const matchSeats = (t.availableSeats || 0) >= filters.seats;
//       const matchCat = filters.vehicleCategory === "any" || t.vehicleCategory === filters.vehicleCategory;
//       const matchDate = filters.travelDate ? new Date(t.departureDate).toDateString() === filters.travelDate.toDateString() : true;
//       return matchSeats && matchCat && matchDate;
//     });

//     const carriers = (rawCarriers || []).filter((c) => {
//       const capacity = c.vehicleCapacity || 0;
//       const matchSeats = capacity >= filters.seats;
//       const matchCat = filters.vehicleCategory === "any" || (filters.vehicleCategory === "small" ? capacity <= 7 : capacity > 7);
//       return matchSeats && matchCat;
//     });

//     return { trips, carriers };
//   }, [rawTrips, rawCarriers, filters]);

//   return {
//     filters,
//     updateFilters,
//     clearFilters,
//     selectedTrip,
//     selectTrip,
//     matchedTrips: processedData.trips,
//     matchedCarriers: processedData.carriers,
//     isLoading: loadingTrips || loadingCarriers,
//     radarStatus: !isRadarActive ? "idle" : !isQuerySettled || loadingTrips || loadingCarriers || rawTrips === null ? "loading" : "success",
//   };
// }

/**
 * @hook useSovereignSearch
 * @description THE REINFORCED PERSISTENT SEARCH ENGINE (STERILIZED - V23.0 - DIAMOND)
 * [PROTOCOL 16]: Diamond Sterilization. Unified logic for Agents and Public search.
 * [PROTOCOL 55]: Context Integrity via URL Persistence.
 * [PROTOCOL 88]: Debounced queries to protect cloud resources.
 */
"use client";

import { useMemoFirebase, useCollection, useFirestore } from "@/firebase";
import { collection, query, where, orderBy, limit } from "firebase/firestore";
import type { Trip, UserProfile } from "@/lib/data";
import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export interface SovereignSearchFilters {
  originCountry: string;
  originCity: string;
  destCountry: string;
  destCity: string;
  travelDate?: Date;
  seats: number;
  vehicleCategory: "any" | "small" | "bus";
}

export function useSovereignSearch() {
  const firestore = useFirestore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // [SCR-TRIP-SELECT]: Selected Trip State
  const [selectedTrip, setSelectedTrip] = useState<any | null>(null);

  const selectTrip = useCallback((trip: any | null) => {
    setSelectedTrip(trip);
  }, []);

  // [SSOT]: Core Filter Artery - Linked to URL state
  const [filters, setFilters] = useState<SovereignSearchFilters>(() => {
    if (typeof window === "undefined") return { originCountry: "", originCity: "", destCountry: "", destCity: "", seats: 1, vehicleCategory: "any" };

    return {
      originCountry: searchParams.get("oc") || "",
      originCity: searchParams.get("o") || "",
      destCountry: searchParams.get("dc") || "",
      destCity: searchParams.get("d") || "",
      seats: parseInt(searchParams.get("s") || "1"),
      vehicleCategory: (searchParams.get("v") as any) || "any",
      travelDate: searchParams.get("dt") ? new Date(searchParams.get("dt")!) : undefined,
    };
  });

  // [PROTOCOL 55]: Arterial Sync - Zero state loss on refresh
  const [committedKey, setCommittedKey] = useState("");
  const activeKey = `${filters.originCity}|${filters.destCity}`;

  useEffect(() => {
    if (!filters.originCity || !filters.destCity) {
      setCommittedKey("");
      return;
    }
    setCommittedKey(activeKey);
  }, [filters.originCity, filters.destCity]);

  const isQuerySettled = committedKey === activeKey && !!filters.originCity && !!filters.destCity;
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.originCity) params.set("o", filters.originCity);
    if (filters.destCity) params.set("d", filters.destCity);
    if (filters.originCountry) params.set("oc", filters.originCountry);
    if (filters.destCountry) params.set("dc", filters.destCountry);
    if (filters.travelDate) params.set("dt", filters.travelDate.toISOString().split("T")[0]);
    if (filters.seats > 1) params.set("s", filters.seats.toString());
    if (filters.vehicleCategory !== "any") params.set("v", filters.vehicleCategory);

    const currentQuery = params.toString();
    const existingQuery = window.location.search.replace("?", "");

    // ✅ بدون router - مش بيسبب re-render
    if (currentQuery !== existingQuery) {
      window.history.replaceState(null, "", `${pathname}?${currentQuery}`);
    }
  }, [filters, pathname]);
  const isRadarActive = useMemo(() => Boolean(filters.originCity && filters.destCity), [filters.originCity, filters.destCity]);

  const tripsQuery = useMemoFirebase(() => {
    if (!firestore || !filters.originCity || !filters.destCity) return null;
    return query(
      collection(firestore, "trips"),
      where("origin", "==", filters.originCity),
      where("destination", "==", filters.destCity),
      where("status", "in", ["Planned", "In-Transit"]), // ✅ بدل == "Planned"
      orderBy("departureDate", "asc"),
      limit(20),
    );
  }, [firestore, filters.originCity, filters.destCity]);
  const carriersQuery = useMemoFirebase(() => {
    if (!firestore || !isRadarActive) return null;
    return query(
      collection(firestore, "users"),
      where("role", "==", "carrier"),
      // where("jurisdiction.origin", "==", debouncedOrigin),
      // where("jurisdiction.destination", "==", debouncedDest),
      where("jurisdiction.origin", "==", filters.originCity),
      where("jurisdiction.destination", "==", filters.destCity),
      limit(15),
    );
  }, [firestore, filters.originCity, filters.destCity, isRadarActive]);

  const { data: rawTrips, isLoading: loadingTrips } = useCollection<Trip>(tripsQuery);
  const { data: rawCarriers, isLoading: loadingCarriers } = useCollection<UserProfile>(carriersQuery);
  const updateFilters = useCallback((updates: Partial<SovereignSearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  }, []);

  const clearFilters = useCallback(() => {
    setCommittedKey(""); // ✅
    setSelectedTrip(null);
    setFilters({ originCountry: "", originCity: "", destCountry: "", destCity: "", seats: 1, vehicleCategory: "any" });
  }, []);
  // [PROTOCOL 16]: Pure Data Processing
  const processedData = useMemo(() => {
    if (!isRadarActive) return { trips: [], carriers: [] };
    // [SCR-1004]: Only filter when both origin and dest are set
    const now = new Date();
    const trips = (rawTrips || []).filter((t) => {
      const matchSeats = (t.availableSeats || 0) >= filters.seats;
      const matchCat = filters.vehicleCategory === "any" || t.vehicleCategory === filters.vehicleCategory;
      const matchDate = filters.travelDate ? new Date(t.departureDate).toDateString() === filters.travelDate.toDateString() : true;
      // إخفاء الرحلات المنتهية
      const tripDate = t.departureDate ? new Date(t.departureDate) : null;
      const notExpired = tripDate ? tripDate >= now : true;
      return matchSeats && matchCat && matchDate && notExpired;
    });

    const carriers = (rawCarriers || []).filter((c) => {
      const capacity = c.vehicleCapacity || 0;
      const matchSeats = capacity >= filters.seats;
      const matchCat = filters.vehicleCategory === "any" || (filters.vehicleCategory === "small" ? capacity <= 7 : capacity > 7);
      return matchSeats && matchCat;
    });

    return { trips, carriers };
  }, [rawTrips, rawCarriers, filters]);

  return {
    filters,
    updateFilters,
    clearFilters,
    selectedTrip,
    selectTrip,
    matchedTrips: processedData.trips,
    matchedCarriers: processedData.carriers,
    isLoading: loadingTrips || loadingCarriers,
    radarStatus: !isRadarActive ? "idle" : !isQuerySettled || loadingTrips || loadingCarriers || rawTrips === null ? "loading" : "success",
  };
}
