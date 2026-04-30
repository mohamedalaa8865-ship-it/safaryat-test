// // 'use client';

// // import { useEffect, useState, useMemo, useRef, useCallback } from "react";
// // import { useUser, useFirebase } from "@/firebase/provider";
// // import { doc, onSnapshot, updateDoc, deleteField, serverTimestamp, type DocumentReference, type DocumentData } from "firebase/firestore";
// // import { signOut } from "firebase/auth";
// // import type { UserProfile } from "@/lib/data";
// // import { SOVEREIGN_MASTER_EMAIL } from "@/lib/constants";
// // import { logVisitorPulse } from "@/lib/analytics";

// // /**
// //  * @hook useUserProfile
// //  * @description THE STERILIZED SOVEREIGN SENSOR (V6.2 - PROTOCOL 20 IMMUNITY)
// //  * [SCR-955]: Diamond Sterilization.
// //  * [PROTOCOL 20]: Digital Immune System - Eradicated silent empty catch blocks.
// //  * Protocol 88: Resource Protection. Context Integrity enforced.
// //  */

// // export type PulseStatus = "BOOTING" | "VISITOR" | "IDENTIFIED" | "STABLE" | "ERR_RUPTURE";
// // export type SecurityLevel = "MASTER" | "ADMIN" | "STAFF" | "USER";
// // export type EngagementType = "NONE" | "ACTIVE_TRIP" | "BOOKING" | "INTENT";

// // export function useUserProfile() {
// //   const { user, isUserLoading, userError } = useUser();
// //   const { firestore, auth } = useFirebase();

// //   const [profile, setProfile] = useState<UserProfile | null>(null);
// //   const [pulseStatus, setPulseStatus] = useState<PulseStatus>("BOOTING");
// //   const [profileError, setProfileError] = useState<Error | null>(null);

// //   const [activeEngagement, setActiveEngagement] = useState<{ id: string; data: any } | null>(null);
// //   const [engagementType, setEngagementType] = useState<EngagementType>("NONE");

// //   const unsubscribeProfile = useRef<(() => void) | null>(null);
// //   const unsubscribeEngagement = useRef<(() => void) | null>(null);

// //   const lastEngagementId = useRef<string | null>(null);
// //   const lastEngagementType = useRef<EngagementType>("NONE");

// //   const isMaster = useMemo(() =>
// //     user?.email?.toLowerCase() === SOVEREIGN_MASTER_EMAIL.toLowerCase(),
// //     [user?.email]
// //   );

// //   const securityLevel = useMemo<SecurityLevel>(() => {
// //     if (isMaster) return "MASTER";
// //     if (profile?.role === "owner" || profile?.role === "admin" || profile?.isAdmin) return "ADMIN";
// //     if (["operations_manager", "support", "developer"].includes(profile?.role || "")) return "STAFF";
// //     return "USER";
// //   }, [isMaster, profile?.role, profile?.isAdmin]);

// //   const userProfileRef = useMemo<DocumentReference<DocumentData> | null>(() => {
// //     if (user?.uid && firestore) return doc(firestore, "users", user.uid);
// //     return null;
// //   }, [user?.uid, !!firestore]);

// //   const checkPermission = useCallback((permissionKey: string): boolean => {
// //     if (securityLevel === "MASTER") return true;
// //     if (!profile) return false;
// //     if (profile.role === "owner") return true;
// //     return !!(profile?.permissions as any)?.[permissionKey];
// //   }, [profile, securityLevel]);

// //   const startEngagementPulse = useCallback((id: string, type: EngagementType) => {
// //     if (id === lastEngagementId.current && type === lastEngagementType.current) return;

// //     if (unsubscribeEngagement.current) unsubscribeEngagement.current();

// //     lastEngagementId.current = id;
// //     lastEngagementType.current = type;

// //     if (!firestore || !id) {
// //       setActiveEngagement(null);
// //       setEngagementType("NONE");
// //       return;
// //     }

// //     const collectionName = (type === "ACTIVE_TRIP" || type === "INTENT") ? "trips" : "bookings";
// //     const docRef = doc(firestore, collectionName, id);

// //     unsubscribeEngagement.current = onSnapshot(docRef, (snap) => {
// //       if (snap.exists()) {
// //         const data = snap.data();
// //         const isStale = ["Completed", "Cancelled", "Rejected"].includes(data.status);

// //         if (isStale) {
// //           setActiveEngagement(null);
// //           setEngagementType("NONE");

// //           if (firestore && userProfileRef) {
// //             const field = type === "BOOKING" ? "activeBookingId" : type === "INTENT" ? "activeIntentId" : "currentActiveTripId";
// //             // [PROTOCOL 20]: No silent catch. Document failure.
// //             updateDoc(userProfileRef, { [field]: deleteField(), updatedAt: serverTimestamp() })
// //               .catch((err) => console.warn(`[Immune System] Failed to purge stale engagement field (${field}):`, err.message));
// //           }
// //         } else {
// //           setActiveEngagement({ id: snap.id, data });
// //           setEngagementType(type);
// //         }
// //       } else {
// //         setActiveEngagement(null);
// //         setEngagementType("NONE");
// //       }
// //     }, (err) => console.warn(`[Engagement Pulse] Rupture: ${id}`, err.message));
// //   }, [firestore, userProfileRef]);

// //   useEffect(() => {
// //     if (unsubscribeProfile.current) unsubscribeProfile.current();

// //     if (isUserLoading) {
// //       setPulseStatus("BOOTING");
// //       return;
// //     }

// //     if (!user) {
// //       logVisitorPulse();
// //       setProfile(null);
// //       setPulseStatus("VISITOR");
// //       setActiveEngagement(null);
// //       setEngagementType("NONE");
// //       return;
// //     }

// //     setPulseStatus("IDENTIFIED");

// //     unsubscribeProfile.current = onSnapshot(userProfileRef!, async (docSnapshot) => {
// //       if (docSnapshot.exists()) {
// //         const data = docSnapshot.data() as UserProfile;

// //         if (data.isDeactivated) {
// //           signOut(auth).then(() => {
// //             document.cookie = `__session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure`;
// //             if (typeof window !== "undefined") window.location.href = "/login";
// //           });
// //           return;
// //         }

// //         setProfile({ ...data, id: docSnapshot.id } as UserProfile);

// //         // ATOMIC SELECTION: Choose primary engagement pulse
// //         if (data.currentActiveTripId) {
// //           startEngagementPulse(data.currentActiveTripId, "ACTIVE_TRIP");
// //         } else if (data.activeBookingId) {
// //           startEngagementPulse(data.activeBookingId, "BOOKING");
// //         } else if (data.activeIntentId) {
// //           startEngagementPulse(data.activeIntentId, "INTENT");
// //         } else {
// //           setActiveEngagement(null);
// //           setEngagementType("NONE");
// //         }

// //         setPulseStatus("STABLE");
// //       } else {
// //         setProfile(null);
// //         setPulseStatus("STABLE");
// //       }
// //     }, (error) => {
// //       console.warn("[Pulse Artery] Rupture:", error.message);
// //       setProfileError(error);
// //       setPulseStatus("ERR_RUPTURE");
// //     });

// //     return () => {
// //       if (unsubscribeProfile.current) unsubscribeProfile.current();
// //       if (unsubscribeEngagement.current) unsubscribeEngagement.current();
// //     };
// //   }, [userProfileRef, isUserLoading, user, auth, startEngagementPulse, firestore]);

// //   return {
// //     user,
// //     profile,
// //     pulseStatus,
// //     securityLevel,
// //     isMaster,
// //     isLoading: pulseStatus === "BOOTING" || pulseStatus === "IDENTIFIED",
// //     isVisitor: pulseStatus === "VISITOR",
// //     isEngaged: engagementType !== "NONE",
// //     engagementType,
// //     activeEngagement,
// //     error: userError || profileError,
// //     userProfileRef,
// //     checkPermission,
// //   };
// // }
// "use client";

// import { useEffect, useState, useMemo, useRef, useCallback } from "react";
// import { useUser, useFirebase } from "@/firebase/provider";
// import { doc, onSnapshot, updateDoc, deleteField, serverTimestamp, type DocumentReference, type DocumentData } from "firebase/firestore";
// import { signOut } from "firebase/auth";
// import type { UserProfile } from "@/lib/data";
// import { SOVEREIGN_MASTER_EMAIL } from "@/lib/constants";
// import { logVisitorPulse } from "@/lib/analytics";

// /**
//  * @hook useUserProfile
//  * @description THE REINFORCED SOVEREIGN SENSOR (V6.5 - SCR-065 - DESYNC PURGE)
//  * [SCR-065]: Eradicated "Ghost Engagements" by adding atomic cleanup and stale guards.
//  * Protocol 88: Resource Protection. Context Integrity enforced.
//  */

// export type PulseStatus = "BOOTING" | "VISITOR" | "IDENTIFIED" | "STABLE" | "ERR_RUPTURE";
// export type SecurityLevel = "MASTER" | "ADMIN" | "STAFF" | "USER";
// export type EngagementType = "NONE" | "ACTIVE_TRIP" | "BOOKING" | "INTENT";

// export function useUserProfile() {
//   const { user, isUserLoading, userError } = useUser();
//   const { firestore, auth } = useFirebase();

//   const [profile, setProfile] = useState<UserProfile | null>(null);
//   const [pulseStatus, setPulseStatus] = useState<PulseStatus>("BOOTING");
//   const [profileError, setError] = useState<Error | null>(null);

//   const [activeEngagement, setActiveEngagement] = useState<{ id: string; data: any } | null>(null);
//   const [engagementType, setEngagementType] = useState<EngagementType>("NONE");

//   const unsubscribeProfile = useRef<(() => void) | null>(null);
//   const unsubscribeEngagement = useRef<(() => void) | null>(null);

//   const lastEngagementId = useRef<string | null>(null);
//   const lastEngagementType = useRef<EngagementType>("NONE");

//   const isMaster = useMemo(() => user?.email?.toLowerCase() === SOVEREIGN_MASTER_EMAIL.toLowerCase(), [user?.email]);

//   const securityLevel = useMemo<SecurityLevel>(() => {
//     if (isMaster) return "MASTER";
//     if (profile?.role === "owner" || profile?.role === "admin" || profile?.isAdmin) return "ADMIN";
//     if (["operations_manager", "support", "developer"].includes(profile?.role || "")) return "STAFF";
//     return "USER";
//   }, [isMaster, profile?.role, profile?.isAdmin]);

//   // const userProfileRef = useMemo<DocumentReference<DocumentData> | null>(() => {
//   //   if (user?.uid && firestore) return doc(firestore, "users", user.uid);
//   //   return null;
//   // }, [user?.uid, !!firestore]);
//   // ✅ بعد
//   const userProfileRef = useMemo<DocumentReference<DocumentData> | null>(() => {
//     if (user?.uid && firestore) return doc(firestore, "users", user.uid);
//     return null;
//   }, [user?.uid, firestore]); // firestore مش !!firestore
//   const checkPermission = useCallback(
//     (permissionKey: string): boolean => {
//       if (securityLevel === "MASTER") return true;
//       if (!profile) return false;
//       if (profile.role === "owner") return true;
//       return !!profile?.permissions?.[permissionKey];
//     },
//     [profile, securityLevel],
//   );

//   /**
//    * startEngagementPulse
//    * [SCR-065]: Hardened logic to prevent engagement ghosting.
//    */
//   const startEngagementPulse = useCallback(
//     (id: string, type: EngagementType) => {
//       if (id === lastEngagementId.current && type === lastEngagementType.current) return;

//       if (unsubscribeEngagement.current) unsubscribeEngagement.current();

//       lastEngagementId.current = id;
//       lastEngagementType.current = type;

//       if (!firestore || !id) {
//         setActiveEngagement(null);
//         setEngagementType("NONE");
//         return;
//       }

//       const collectionName = type === "ACTIVE_TRIP" || type === "INTENT" ? "trips" : "bookings";
//       const docRef = doc(firestore, collectionName, id);

//       unsubscribeEngagement.current = onSnapshot(
//         docRef,
//         (snap) => {
//           if (snap.exists()) {
//             const data = snap.data();
//             // [SSOT]: Stale check - If Trip/Booking is over, purge it from the profile pulse
//             const isStale = ["Completed", "Cancelled", "Rejected"].includes(data.status);

//             if (isStale) {
//               setActiveEngagement(null);
//               setEngagementType("NONE");

//               if (firestore && userProfileRef) {
//                 const field = type === "BOOKING" ? "activeBookingId" : type === "INTENT" ? "activeIntentId" : "currentActiveTripId";
//                 updateDoc(userProfileRef, { [field]: deleteField(), updatedAt: serverTimestamp() }).catch((err) =>
//                   console.warn(`[SCR-065] Pulse Cleanup Silenced:`, err.message),
//                 );
//               }
//             } else {
//               setActiveEngagement({ id: snap.id, data });
//               setEngagementType(type);
//             }
//           } else {
//             // Document deleted? Zero the pulse
//             setActiveEngagement(null);
//             setEngagementType("NONE");
//           }
//         },
//         (err) => console.warn(`[Engagement Pulse] Artery Rupture: ${id}`, err.message),
//       );
//     },
//     [firestore, userProfileRef],
//   );

//   useEffect(() => {
//     if (unsubscribeProfile.current) unsubscribeProfile.current();

//     if (isUserLoading) {
//       setPulseStatus("BOOTING");
//       return;
//     }

//     if (!user) {
//       logVisitorPulse();
//       setProfile(null);
//       setPulseStatus("VISITOR");
//       setActiveEngagement(null);
//       setEngagementType("NONE");
//       return;
//     }

//     setPulseStatus("IDENTIFIED");

//     unsubscribeProfile.current = onSnapshot(
//       userProfileRef!,
//       async (docSnapshot) => {
//         if (docSnapshot.exists()) {
//           const data = docSnapshot.data() as UserProfile;

//           if (data.isDeactivated) {
//             signOut(auth).then(() => {
//               document.cookie = `__session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure`;
//               if (typeof window !== "undefined") window.location.href = "/login";
//             });
//             return;
//           }

//           setProfile({ ...data, id: docSnapshot.id } as UserProfile);

//           // ATOMIC SELECTION: Booking pulse takes priority over Intent pulse
//           if (data.currentActiveTripId) {
//             startEngagementPulse(data.currentActiveTripId, "ACTIVE_TRIP");
//           } else if (data.activeBookingId) {
//             startEngagementPulse(data.activeBookingId, "BOOKING");
//           } else if (data.activeIntentId) {
//             startEngagementPulse(data.activeIntentId, "INTENT");
//           } else {
//             // No active engagements found in registry
//             if (lastEngagementId.current) {
//               setActiveEngagement(null);
//               setEngagementType("NONE");
//               lastEngagementId.current = null;
//               lastEngagementType.current = "NONE";
//             }
//           }

//           setPulseStatus("STABLE");
//         } else {
//           setProfile(null);
//           setPulseStatus("STABLE");
//         }
//       },
//       (error) => {
//         console.warn("[Pulse Artery] Rupture:", error.message);
//         setError(error);
//         setPulseStatus("ERR_RUPTURE");
//       },
//     );

//     return () => {
//       if (unsubscribeProfile.current) unsubscribeProfile.current();
//       if (unsubscribeEngagement.current) unsubscribeEngagement.current();
//     };
//   }, [userProfileRef, isUserLoading, user, auth, startEngagementPulse, firestore]);

//   return {
//     user,
//     profile,
//     pulseStatus,
//     securityLevel,
//     isMaster,
//     isLoading: pulseStatus === "BOOTING" || pulseStatus === "IDENTIFIED",
//     isVisitor: pulseStatus === "VISITOR",
//     isEngaged: engagementType !== "NONE",
//     engagementType,
//     activeEngagement,
//     error: userError || profileError,
//     userProfileRef,
//     checkPermission,
//   };
// }

"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useUser, useFirebase } from "@/firebase/provider";
import { doc, onSnapshot, updateDoc, deleteField, serverTimestamp, type DocumentReference, type DocumentData } from "firebase/firestore";
import { signOut } from "firebase/auth";
import type { UserProfile } from "@/lib/data";
import { SOVEREIGN_MASTER_EMAIL } from "@/lib/constants";
import { logVisitorPulse } from "@/lib/analytics";

/**
 * @hook useUserProfile
 * @description THE REINFORCED SOVEREIGN SENSOR (V6.5 - SCR-065 - DESYNC PURGE)
 * [SCR-065]: Eradicated "Ghost Engagements" by adding atomic cleanup and stale guards.
 * Protocol 88: Resource Protection. Context Integrity enforced.
 */

export type PulseStatus = "BOOTING" | "VISITOR" | "IDENTIFIED" | "STABLE" | "ERR_RUPTURE";
export type SecurityLevel = "MASTER" | "ADMIN" | "STAFF" | "USER";
export type EngagementType = "NONE" | "ACTIVE_TRIP" | "BOOKING" | "INTENT";

export function useUserProfile() {
  const { user, isUserLoading, userError } = useUser();
  const { firestore, auth } = useFirebase();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [pulseStatus, setPulseStatus] = useState<PulseStatus>("BOOTING");
  const [profileError, setError] = useState<Error | null>(null);

  const [activeEngagement, setActiveEngagement] = useState<{ id: string; data: any } | null>(null);
  const [engagementType, setEngagementType] = useState<EngagementType>("NONE");

  const unsubscribeProfile = useRef<(() => void) | null>(null);
  const unsubscribeEngagement = useRef<(() => void) | null>(null);

  const lastEngagementId = useRef<string | null>(null);
  const lastEngagementType = useRef<EngagementType>("NONE");

  const isMaster = useMemo(() => user?.email?.toLowerCase() === SOVEREIGN_MASTER_EMAIL.toLowerCase(), [user?.email]);

  const securityLevel = useMemo<SecurityLevel>(() => {
    if (isMaster) return "MASTER";
    if (profile?.role === "owner" || profile?.role === "admin" || profile?.isAdmin) return "ADMIN";
    if (["operations_manager", "support", "developer"].includes(profile?.role || "")) return "STAFF";
    return "USER";
  }, [isMaster, profile?.role, profile?.isAdmin]);

  // const userProfileRef = useMemo<DocumentReference<DocumentData> | null>(() => {
  //   if (user?.uid && firestore) return doc(firestore, "users", user.uid);
  //   return null;
  // }, [user?.uid, !!firestore]);
  // ✅ بعد
  const userProfileRef = useMemo<DocumentReference<DocumentData> | null>(() => {
    if (user?.uid && firestore) return doc(firestore, "users", user.uid);
    return null;
  }, [user?.uid, firestore]); // firestore مش !!firestore
  const checkPermission = useCallback(
    (permissionKey: string): boolean => {
      if (securityLevel === "MASTER") return true;
      if (!profile) return false;
      if (profile.role === "owner") return true;
      return !!profile?.permissions?.[permissionKey];
    },
    [profile, securityLevel],
  );

  /**
   * startEngagementPulse
   * [SCR-065]: Hardened logic to prevent engagement ghosting.
   */
  const startEngagementPulse = useCallback(
    (id: string, type: EngagementType) => {
      if (id === lastEngagementId.current && type === lastEngagementType.current) return;

      if (unsubscribeEngagement.current) unsubscribeEngagement.current();

      lastEngagementId.current = id;
      lastEngagementType.current = type;

      if (!firestore || !id) {
        setActiveEngagement(null);
        setEngagementType("NONE");
        return;
      }

      const collectionName = type === "ACTIVE_TRIP" || type === "INTENT" ? "trips" : "bookings";
      const docRef = doc(firestore, collectionName, id);

      unsubscribeEngagement.current = onSnapshot(
        docRef,
        (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            // [SSOT]: Stale check - If Trip/Booking is over, purge it from the profile pulse
            const isStale = ["Completed", "Cancelled", "Rejected"].includes(data.status);

            if (isStale) {
              setActiveEngagement(null);
              setEngagementType("NONE");

              if (firestore && userProfileRef) {
                const field = type === "BOOKING" ? "activeBookingId" : type === "INTENT" ? "activeIntentId" : "currentActiveTripId";
                updateDoc(userProfileRef, { [field]: deleteField(), updatedAt: serverTimestamp() }).catch((err) =>
                  console.warn(`[SCR-065] Pulse Cleanup Silenced:`, err.message),
                );
              }
            } else {
              setActiveEngagement({ id: snap.id, data });
              setEngagementType(type);
            }
          } else {
            // Document deleted? Zero the pulse
            setActiveEngagement(null);
            setEngagementType("NONE");
          }
        },
        (err) => console.warn(`[Engagement Pulse] Artery Rupture: ${id}`, err.message),
      );
    },
    [firestore, userProfileRef],
  );

  useEffect(() => {
    if (unsubscribeProfile.current) unsubscribeProfile.current();

    if (isUserLoading) {
      setPulseStatus("BOOTING");
      return;
    }

    if (!user) {
      logVisitorPulse();
      setProfile(null);
      setPulseStatus("VISITOR");
      setActiveEngagement(null);
      setEngagementType("NONE");
      return;
    }

    setPulseStatus("IDENTIFIED");

    unsubscribeProfile.current = onSnapshot(
      userProfileRef!,
      async (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data() as UserProfile;

          if (data.isDeactivated) {
            signOut(auth).then(() => {
              document.cookie = `__session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure`;
              if (typeof window !== "undefined") window.location.href = "/login";
            });
            return;
          }

          setProfile({ ...data, id: docSnapshot.id } as UserProfile);

          // ATOMIC SELECTION: Booking pulse takes priority over Intent pulse
          if (data.currentActiveTripId) {
            startEngagementPulse(data.currentActiveTripId, "ACTIVE_TRIP");
          } else if (data.activeBookingId) {
            startEngagementPulse(data.activeBookingId, "BOOKING");
          } else if (data.activeIntentId) {
            startEngagementPulse(data.activeIntentId, "INTENT");
          } else {
            // No active engagements found in registry
            if (lastEngagementId.current) {
              setActiveEngagement(null);
              setEngagementType("NONE");
              lastEngagementId.current = null;
              lastEngagementType.current = "NONE";
            }
          }

          setPulseStatus("STABLE");
        } else {
          setProfile(null);
          setPulseStatus("STABLE");
        }
      },
      (error) => {
        console.warn("[Pulse Artery] Rupture:", error.message);
        setError(error);
        setPulseStatus("ERR_RUPTURE");
      },
    );

    return () => {
      if (unsubscribeProfile.current) unsubscribeProfile.current();
      if (unsubscribeEngagement.current) unsubscribeEngagement.current();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfileRef, isUserLoading]);

  return {
    user,
    profile,
    pulseStatus,
    securityLevel,
    isMaster,
    isLoading: pulseStatus === "BOOTING" || pulseStatus === "IDENTIFIED",
    isVisitor: pulseStatus === "VISITOR",
    isEngaged: engagementType !== "NONE",
    engagementType,
    activeEngagement,
    error: userError || profileError,
    userProfileRef,
    checkPermission,
  };
}
