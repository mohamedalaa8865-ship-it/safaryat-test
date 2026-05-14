// // "use client";

// // import { useState, useEffect } from "react";
// // import { useRouter } from "@/i18n/routing";
// // import { checkUserExistence, registerNewUser } from "@/lib/simple-auth";
// // import { useToast } from "@/hooks/use-toast";
// // import { useAuth, useFirestore } from "@/firebase";
// // import type { UserProfile } from "@/lib/data";
// // // import { signInAnonymously } from "firebase/auth";
// // import { collection, query, where, getDocs } from "firebase/firestore";
// // import { useTranslations } from "next-intl";
// // import { useSearchParams } from "next/navigation";
// // import { signInAnonymously, signInWithEmailAndPassword } from "firebase/auth";
// // /**
// //  * @hook useLogin
// //  * @description THE ARTERIAL-RESILIENT LOGIN ENGINE (SC-700-ALIGNED)
// //  * [SC-700]: Injected Referral Sniffer to ensure commission persistence.
// //  */
// // export function useLogin() {
// //   const router = useRouter();
// //   const searchParams = useSearchParams();
// //   const { toast } = useToast();
// //   const auth = useAuth();
// //   const db = useFirestore();
// //   const t = useTranslations();

// //   const [step, setStep] = useState<"phone" | "name" | "authenticate">("phone");
// //   const [loading, setLoading] = useState(false);
// //   const [returningUser, setReturningUser] = useState<Partial<UserProfile> | null>(null);

// //   const returnPath = searchParams.get("returnTo");

// //   const [formData, setFormData] = useState({
// //     phone: "",
// //     firstName: "",
// //     email: "",
// //     password: "",
// //     role: (searchParams.get("role") as "carrier" | "traveler" | "agent") || "traveler",
// //     agreed: false,
// //   });

// //   // [SC-700] ARTERIAL REFERRAL SNIFFER
// //   useEffect(() => {
// //     const referralCode = searchParams.get("ref");
// //     if (referralCode) {
// //       localStorage.setItem("safar_pending_ref", referralCode);
// //       console.log(`[Referral Artery] Snipped Code: ${referralCode}`);
// //     }
// //   }, [searchParams]);

// //   useEffect(() => {
// //     const role = searchParams.get("role");
// //     if (role === "carrier" || role === "traveler") {
// //       setFormData((prev) => ({ ...prev, role }));
// //     }
// //   }, [searchParams]);

// //   const handleCheckPhone = async () => {
// //     if (!formData.phone || formData.phone.length < 9 || !db) {
// //       toast({ variant: "destructive", title: t("common.error"), description: t("errors.invalidPhone") });
// //       return { success: false, isReturningUser: false };
// //     }
// //     setLoading(true);
// //     try {
// //       const checkResult = await checkUserExistence(db, formData.phone);
// //       setLoading(false);
// //       if (checkResult.exists && checkResult.data) {
// //         setReturningUser(checkResult.data as UserProfile);
// //         setStep("authenticate");
// //         return { success: true, isReturningUser: true };
// //       } else {
// //         setStep("name");
// //         return { success: true, isReturningUser: false };
// //       }
// //     } catch (error) {
// //       setLoading(false);
// //       toast({ variant: "destructive", title: t("common.error"), description: t("errors.serverError") });
// //       return { success: false, isReturningUser: false };
// //     }
// //   };

// //   const handleRegister = async () => {
// //     if (!formData.agreed || !db || !auth) return;
// //     setLoading(true);
// //     try {
// //       // Pull pending referral from memory
// //       const refCode = localStorage.getItem("safar_pending_ref") || undefined;

// //       // const result = await registerNewUser(db, auth, formData.phone, formData.firstName, formData.role, "JO", refCode);
// //       const result = await registerNewUser(
// //         db,
// //         auth,
// //         formData.phone,
// //         formData.firstName,
// //         formData.role,
// //         "JO",
// //         refCode,
// //         formData.email, // ✅
// //         formData.password, // ✅
// //       );
// //       if (result.success) {
// //         localStorage.removeItem("safar_pending_ref");
// //         if (result.user) await result.user.getIdToken(true);
// //         window.location.href = returnPath || (formData.role === "carrier" ? "/carrier" : "/dashboard");
// //       } else {
// //         toast({ variant: "destructive", title: t("common.error"), description: t("errors.signupFailed") });
// //         setLoading(false);
// //       }
// //     } catch (error) {
// //       toast({ variant: "destructive", title: t("common.error"), description: t("errors.signupFailed") });
// //       setLoading(false);
// //     }
// //   };

// //   const handleReturningUserLogin = async () => {
// //     if (!returningUser?.role || !auth || !db) return;
// //     setLoading(true);
// //     try {
// //       let user = auth.currentUser;
// //       if (!user) {
// //         // const result = await signInAnonymously(auth);
// //         // user = result.user;
// //         if (returningUser?.email) {
// //           const result = await signInWithEmailAndPassword(auth, returningUser.email as string, formData.password);
// //           user = result.user;
// //         } else {
// //           const result = await signInAnonymously(auth);
// //           user = result.user;
// //         }
// //       }

// //       if (user) await user.getIdToken(true);

// //       if (returningUser.role === "carrier") {
// //         window.location.href = "/carrier";
// //         return;
// //       }

// //       const checkUid = user?.uid;
// //       if (checkUid) {
// //         const bookingsQuery = query(
// //           collection(db, "bookings"),
// //           where("userId", "==", checkUid),
// //           where("status", "in", ["Pending-Payment", "Pending-Carrier-Confirmation", "Confirmed"]),
// //         );
// //         const intentsQuery = query(collection(db, "trips"), where("userId", "==", checkUid), where("status", "==", "Awaiting-Offers"));
// //         const [bookingsSnap, intentsSnap] = await Promise.all([getDocs(bookingsQuery), getDocs(intentsQuery)]);
// //         if (!bookingsSnap.empty || !intentsSnap.empty) {
// //           window.location.href = "/history";
// //           return;
// //         }
// //       }
// //       window.location.href = returnPath || "/dashboard";
// //     } catch (error) {
// //       toast({ variant: "destructive", title: t("common.error"), description: t("errors.loginFailed") });
// //       setLoading(false);
// //     }
// //   };

// //   const resetToPhoneStep = () => {
// //     setStep("phone");
// //     setReturningUser(null);
// //     setFormData((prev) => ({ ...prev, phone: "", firstName: "", agreed: false }));
// //   };

// //   return { step, loading, returningUser, formData, setFormData, handleCheckPhone, handleRegister, handleReturningUserLogin, resetToPhoneStep };
// // }

// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "@/i18n/routing";
// import { checkUserExistence, registerNewUser } from "@/lib/simple-auth";
// import { useToast } from "@/hooks/use-toast";
// import { useAuth, useFirestore } from "@/firebase";
// import type { UserProfile } from "@/lib/data";
// // import { signInAnonymously } from "firebase/auth";
// import { collection, query, where, getDocs } from "firebase/firestore";
// import { useTranslations } from "next-intl";
// import { useSearchParams } from "next/navigation";
// import { signInAnonymously, signInWithEmailAndPassword } from "firebase/auth";
// /**
//  * @hook useLogin
//  * @description THE ARTERIAL-RESILIENT LOGIN ENGINE (SC-700-ALIGNED)
//  * [SC-700]: Injected Referral Sniffer to ensure commission persistence.
//  */
// export function useLogin() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const { toast } = useToast();
//   const auth = useAuth();
//   const db = useFirestore();
//   const t = useTranslations();

//   const [step, setStep] = useState<"phone" | "name" | "authenticate">("phone");
//   const [loading, setLoading] = useState(false);
//   const [returningUser, setReturningUser] = useState<Partial<UserProfile> | null>(null);

//   const returnPath = searchParams.get("returnTo");

//   const [formData, setFormData] = useState({
//     phone: "",
//     firstName: "",
//     email: "",
//     password: "",
//     // role: (searchParams.get("role") as "carrier" | "traveler") || "traveler",
//     // role: (searchParams.get("role") as "carrier" | "traveler" | "agent") || "traveler",
//     role: (searchParams.get("role") as "carrier" | "traveler" | "agent") || "traveler",

//     agreed: false,
//   });

//   // [SC-700] ARTERIAL REFERRAL SNIFFER
//   useEffect(() => {
//     const referralCode = searchParams.get("ref");
//     if (referralCode) {
//       localStorage.setItem("safar_pending_ref", referralCode);
//       console.log(`[Referral Artery] Snipped Code: ${referralCode}`);
//     }
//   }, [searchParams]);

//   useEffect(() => {
//     const role = searchParams.get("role");
//     // if (role === "carrier" || role === "traveler") {
//     //   setFormData((prev) => ({ ...prev, role }));
//     // }
//     if (role === "carrier" || role === "traveler" || role === "agent") {
//       setFormData((prev) => ({ ...prev, role }));
//     }
//   }, [searchParams]);

//   const handleCheckPhone = async () => {
//     if (!formData.phone || formData.phone.length < 9 || !db) {
//       toast({ variant: "destructive", title: t("common.error"), description: t("errors.invalidPhone") });
//       return { success: false, isReturningUser: false };
//     }
//     setLoading(true);
//     try {
//       const checkResult = await checkUserExistence(db, formData.phone, auth);
//       setLoading(false);
//       if (checkResult.exists && checkResult.data) {
//         setReturningUser(checkResult.data as UserProfile);
//         setStep("authenticate");
//         return { success: true, isReturningUser: true };
//       } else {
//         setStep("name");
//         return { success: true, isReturningUser: false };
//       }
//     } catch (error) {
//       setLoading(false);
//       toast({ variant: "destructive", title: t("common.error"), description: t("errors.serverError") });
//       return { success: false, isReturningUser: false };
//     }
//   };

//   const handleRegister = async () => {
//     if (!formData.agreed || !db || !auth) return;
//     setLoading(true);
//     try {
//       // Pull pending referral from memory
//       const refCode = localStorage.getItem("safar_pending_ref") || undefined;

//       // const result = await registerNewUser(db, auth, formData.phone, formData.firstName, formData.role, "JO", refCode);
//       const result = await registerNewUser(
//         db,
//         auth,
//         formData.phone,
//         formData.firstName,
//         formData.role,
//         "JO",
//         refCode,
//         formData.email, // ✅
//         formData.password, // ✅
//       );
//       if (result.success) {
//         localStorage.removeItem("safar_pending_ref");
//         if (result.user) await result.user.getIdToken(true);
//         // window.location.href = returnPath || (formData.role === "carrier" ? "/carrier" : "/dashboard");
//         window.location.href = returnPath || (formData.role === "carrier" ? "/carrier" : formData.role === "agent" ? "/agent" : "/dashboard");
//       } else {
//         toast({ variant: "destructive", title: t("common.error"), description: t("errors.signupFailed") });
//         setLoading(false);
//       }
//     } catch (error) {
//       toast({ variant: "destructive", title: t("common.error"), description: t("errors.signupFailed") });
//       setLoading(false);
//     }
//   };

//   const handleReturningUserLogin = async () => {
//     if (!returningUser?.role || !auth || !db) return;
//     setLoading(true);
//     try {
//       let user = auth.currentUser;
//       if (!user) {
//         // const result = await signInAnonymously(auth);
//         // user = result.user;
//         if (returningUser?.email) {
//           const result = await signInWithEmailAndPassword(auth, returningUser.email as string, formData.password);
//           user = result.user;
//         } else {
//           const result = await signInAnonymously(auth);
//           user = result.user;
//         }
//       }

//       if (user) await user.getIdToken(true);

//       if (returningUser.role === "carrier") {
//         window.location.href = "/carrier";
//         return;
//       }

//       const checkUid = user?.uid;
//       if (checkUid) {
//         const bookingsQuery = query(
//           collection(db, "bookings"),
//           where("userId", "==", checkUid),
//           where("status", "in", ["Pending-Payment", "Pending-Carrier-Confirmation", "Confirmed"]),
//         );
//         const intentsQuery = query(collection(db, "trips"), where("userId", "==", checkUid), where("status", "==", "Awaiting-Offers"));
//         const [bookingsSnap, intentsSnap] = await Promise.all([getDocs(bookingsQuery), getDocs(intentsQuery)]);
//         if (!bookingsSnap.empty || !intentsSnap.empty) {
//           window.location.href = "/history";
//           return;
//         }
//       }
//       window.location.href = returnPath || "/dashboard";
//     } catch (error) {
//       toast({ variant: "destructive", title: t("common.error"), description: t("errors.loginFailed") });
//       setLoading(false);
//     }
//   };

//   const resetToPhoneStep = () => {
//     setStep("phone");
//     setReturningUser(null);
//     setFormData((prev) => ({ ...prev, phone: "", firstName: "", agreed: false }));
//   };

//   return { step, loading, returningUser, formData, setFormData, handleCheckPhone, handleRegister, handleReturningUserLogin, resetToPhoneStep };
// }

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/routing";
import { checkUserExistence, registerNewUser } from "@/lib/simple-auth";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useFirestore } from "@/firebase";
import type { UserProfile } from "@/lib/data";
// import { signInAnonymously } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { signInAnonymously, signInWithEmailAndPassword } from "firebase/auth";
/**
 * @hook useLogin
 * @description THE ARTERIAL-RESILIENT LOGIN ENGINE (SC-700-ALIGNED)
 * [SC-700]: Injected Referral Sniffer to ensure commission persistence.
 */
export function useLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const auth = useAuth();
  const db = useFirestore();
  const t = useTranslations();

  const [step, setStep] = useState<"phone" | "name" | "authenticate">("phone");
  const [loading, setLoading] = useState(false);
  const [returningUser, setReturningUser] = useState<Partial<UserProfile> | null>(null);

  const returnPath = searchParams.get("returnTo");

  const [formData, setFormData] = useState({
    phone: "",
    phoneCountryCode: "962",
    firstName: "",
    email: "",
    password: "",
    // role: (searchParams.get("role") as "carrier" | "traveler") || "traveler",
    // role: (searchParams.get("role") as "carrier" | "traveler" | "agent") || "traveler",
    role: (searchParams.get("role") as "carrier" | "traveler" | "agent") || "traveler",

    agreed: false,
  });

  // [SC-700] ARTERIAL REFERRAL SNIFFER
  useEffect(() => {
    const referralCode = searchParams.get("ref");
    if (referralCode) {
      localStorage.setItem("safar_pending_ref", referralCode);
      console.log(`[Referral Artery] Snipped Code: ${referralCode}`);
    }
  }, [searchParams]);

  useEffect(() => {
    const role = searchParams.get("role");
    // if (role === "carrier" || role === "traveler") {
    //   setFormData((prev) => ({ ...prev, role }));
    // }
    if (role === "carrier" || role === "traveler" || role === "agent") {
      setFormData((prev) => ({ ...prev, role }));
    }
  }, [searchParams]);

  const handleCheckPhone = async () => {
    if (!formData.phone || formData.phone.length < 9 || !db) {
      toast({ variant: "destructive", title: t("common.error"), description: t("errors.invalidPhone") });
      return { success: false, isReturningUser: false };
    }
    setLoading(true);
    try {
      const checkResult = await checkUserExistence(db, formData.phone, auth);
      setLoading(false);
      if (checkResult.exists && checkResult.data) {
        setReturningUser(checkResult.data as UserProfile);
        setStep("authenticate");
        return { success: true, isReturningUser: true };
      } else {
        setStep("name");
        return { success: true, isReturningUser: false };
      }
    } catch (error) {
      setLoading(false);
      toast({ variant: "destructive", title: t("common.error"), description: t("errors.serverError") });
      return { success: false, isReturningUser: false };
    }
  };

  const handleRegister = async () => {
    if (!formData.agreed || !db || !auth) return;
    setLoading(true);
    try {
      // Pull pending referral from memory
      const refCode = localStorage.getItem("safar_pending_ref") || undefined;

      // const result = await registerNewUser(db, auth, formData.phone, formData.firstName, formData.role, "JO", refCode);
      const result = await registerNewUser(
        db,
        auth,
        formData.phone,
        formData.firstName,
        formData.role,
        "JO",
        refCode,
        formData.email, // ✅
        formData.password, // ✅
        formData.phoneCountryCode, // ✅
      );
      if (result.success) {
        localStorage.removeItem("safar_pending_ref");
        if (result.user) await result.user.getIdToken(true);
        // window.location.href = returnPath || (formData.role === "carrier" ? "/carrier" : "/dashboard");
        window.location.href = returnPath || (formData.role === "carrier" ? "/carrier" : formData.role === "agent" ? "/agent" : "/dashboard");
      } else {
        toast({ variant: "destructive", title: t("common.error"), description: t("errors.signupFailed") });
        setLoading(false);
      }
    } catch (error) {
      toast({ variant: "destructive", title: t("common.error"), description: t("errors.signupFailed") });
      setLoading(false);
    }
  };

  const handleReturningUserLogin = async () => {
    if (!returningUser?.role || !auth || !db) return;
    setLoading(true);
    try {
      let user = auth.currentUser;
      if (!user) {
        // const result = await signInAnonymously(auth);
        // user = result.user;
        if (returningUser?.email) {
          const result = await signInWithEmailAndPassword(auth, returningUser.email as string, formData.password);
          user = result.user;
        } else {
          const result = await signInAnonymously(auth);
          user = result.user;
        }
      }

      if (user) await user.getIdToken(true);

      if (returningUser.role === "carrier") {
        window.location.href = "/carrier";
        return;
      }

      const checkUid = user?.uid;
      if (checkUid) {
        const bookingsQuery = query(
          collection(db, "bookings"),
          where("userId", "==", checkUid),
          where("status", "in", ["Pending-Payment", "Pending-Carrier-Confirmation", "Confirmed"]),
        );
        const intentsQuery = query(collection(db, "trips"), where("userId", "==", checkUid), where("status", "==", "Awaiting-Offers"));
        const [bookingsSnap, intentsSnap] = await Promise.all([getDocs(bookingsQuery), getDocs(intentsQuery)]);
        if (!bookingsSnap.empty || !intentsSnap.empty) {
          window.location.href = "/history";
          return;
        }
      }
      window.location.href = returnPath || "/dashboard";
    } catch (error) {
      toast({ variant: "destructive", title: t("common.error"), description: t("errors.loginFailed") });
      setLoading(false);
    }
  };

  const resetToPhoneStep = () => {
    setStep("phone");
    setReturningUser(null);
    setFormData((prev) => ({ ...prev, phone: "", firstName: "", agreed: false }));
  };

  return { step, loading, returningUser, formData, setFormData, handleCheckPhone, handleRegister, handleReturningUserLogin, resetToPhoneStep };
}
