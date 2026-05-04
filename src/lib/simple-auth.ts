// // "use client";
// // import { type Firestore, collection, query, where, getDocs, limit, doc, setDoc, serverTimestamp, writeBatch } from "firebase/firestore";
// // import {
// //   type Auth,
// //   signInAnonymously,
// //   updateProfile,
// //   createUserWithEmailAndPassword,
// //   signInWithEmailAndPassword,
// //   type UserCredential,
// //   GoogleAuthProvider,
// //   signInWithPopup,
// //   signOut,
// // } from "firebase/auth";
// // import { SOVEREIGN_MASTER_EMAIL } from "@/lib/constants";

// // /**
// //  * @file src/lib/simple-auth.ts
// //  * @description THE REINFORCED AUTH GATEWAY (DIAMOND STERILIZED - SC-806 V9.0)
// //  * [SCR-954]: Traveler Genesis - Merged Mohamed's ease with Sovereign Integrity.
// //  * [SCR-978-PURGE]: Eradicated Delegate and Referral logic from registration.
// //  * [SCR-984]: Hardened role-assignment to Traveler only for public registration.
// //  */

// // const syncSessionCookie = async (userCredential: UserCredential) => {
// //   if (userCredential.user) {
// //     const token = await userCredential.user.getIdToken(true);
// //     document.cookie = `__session=${token}; path=/; max-age=432000; SameSite=Strict; Secure`;
// //   }
// // };

// // /**
// //  * [SCR-1002]: checkUserExistence — Anonymous Auth Gate
// //  * قبل أي query على Firestore، بنتأكد إن المستخدم signed-in (ولو anonymous).
// //  * ده يخلي request.auth != null فالـ Rules تسمح بـ list: if isSignedIn().
// //  * بكده نحمي الـ Rules ومحتاجنيش Blaze plan.
// //  */
// // export async function checkUserExistence(db: Firestore, phone: string, auth?: Auth) {
// //   try {
// //     // [SCR-1002]: Anonymous Auth Gate — sign in silently if no current user
// //     if (auth && !auth.currentUser) {
// //       try {
// //         await signInAnonymously(auth);
// //       } catch {
// //         // لو فشل الـ anonymous login، نكمل ونخلي الـ Rules ترفض
// //       }
// //     }

// //     const q = query(collection(db, "users"), where("phoneNumber", "==", phone), limit(1));
// //     const snapshot = await getDocs(q);

// //     if (!snapshot.empty) {
// //       return {
// //         exists: true,
// //         data: { id: snapshot.docs[0].id, ...snapshot.docs[0].data() },
// //       };
// //     }
// //     return { exists: false, data: null };
// //   } catch (error) {
// //     console.error("[Sovereign Auth] Check Rupture:", error);
// //     return { exists: false, data: null };
// //   }
// // }

// // export async function registerNewUser(
// //   db: Firestore,
// //   auth: Auth,
// //   phone: string,
// //   name: string,
// //   requestedRole: string,
// //   countryCode: string = "JO",
// //   _ignoredRef?: string,
// //   email?: string,
// //   password?: string,
// // ) {
// //   try {
// //     let user = auth.currentUser;

// //     if (email && password) {
// //       // ✅ لو في أي user قديم (سواء anonymous أو email) — اعمل sign out أولاً
// //       // عشان مش يحجز نفس الـ uid للمستخدم الجديد
// //       if (user) {
// //         await signOut(auth);
// //         user = null;
// //       }
// //       const result = await createUserWithEmailAndPassword(auth, email, password);
// //       user = result.user;
// //     } else if (!user) {
// //       const result = await signInAnonymously(auth);
// //       user = result.user;
// //     }

// //     if (!user) throw new Error("Auth Pulse Lost");

// //     await updateProfile(user, { displayName: name });

// //     const batch = writeBatch(db);
// //     const userRef = doc(db, "users", user.uid);
// //     const safeRole = requestedRole === "carrier" ? "carrier" : requestedRole === "agent" ? "agent" : "traveler";

// //     batch.set(userRef, {
// //       uid: user.uid,
// //       id: user.uid,
// //       phoneNumber: phone,
// //       firstName: name,
// //       email: email || user.email || "",
// //       role: safeRole,
// //       operatingCountry: countryCode.toLowerCase(),
// //       createdAt: serverTimestamp(),
// //       isPartial: false,
// //       status: "active",
// //       termsAgreed: true,
// //       termsVersion: "1.5",
// //       updatedAt: serverTimestamp(),
// //       ...(safeRole === "agent" && { agentStatus: "pending" }),
// //     });

// //     await batch.commit();

// //     const token = await user.getIdToken(true);
// //     document.cookie = `__session=${token}; path=/; max-age=432000; SameSite=Strict; Secure`;

// //     return { success: true, user };
// //   } catch (error) {
// //     console.error("[Sovereign Auth] Registration Rupture:", error);
// //     return { success: false, error };
// //   }
// // }

// // export async function signInWithEmail(auth: Auth, firestore: Firestore, email: string, password: string): Promise<UserCredential | null> {
// //   const MASTER_EMAIL = SOVEREIGN_MASTER_EMAIL.toLowerCase();
// //   const inputEmail = email.toLowerCase().trim();

// //   try {
// //     const userCredential = await signInWithEmailAndPassword(auth, inputEmail, password);
// //     await syncSessionCookie(userCredential);
// //     return userCredential;
// //   } catch (error: any) {
// //     console.warn("[Sovereign Auth] Primary Login failed, checking recovery eligibility...");

// //     const isMasterEmail = inputEmail === MASTER_EMAIL;
// //     const isUserNotFound = error.code === "auth/user-not-found" || error.code === "auth/invalid-credential";

// //     if (isMasterEmail && isUserNotFound) {
// //       try {
// //         const userCredential = await createUserWithEmailAndPassword(auth, inputEmail, password);
// //         const user = userCredential.user;

// //         await setDoc(doc(firestore, "users", user.uid), {
// //           uid: user.uid,
// //           id: user.uid,
// //           firstName: "Fayz",
// //           lastName: "Master",
// //           email: inputEmail,
// //           role: "owner",
// //           isAdmin: true,
// //           createdAt: serverTimestamp(),
// //           updatedAt: serverTimestamp(),
// //         });

// //         await syncSessionCookie(userCredential);
// //         return userCredential;
// //       } catch (createError: any) {
// //         throw createError;
// //       }
// //     }

// //     if (error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
// //       throw new Error("PASSWORD_INCORRECT");
// //     }

// //     throw error;
// //   }
// // }

// // export async function initiateGoogleSignIn(auth: Auth, firestore: Firestore): Promise<boolean> {
// //   const provider = new GoogleAuthProvider();
// //   try {
// //     const result = await signInWithPopup(auth, provider);
// //     const user = result.user;

// //     const userSnap = await getDocs(query(collection(firestore, "users"), where("uid", "==", user.uid), limit(1)));

// //     if (userSnap.empty) {
// //       const [firstName, ...lastNameParts] = (user.displayName || "").split(" ");
// //       await setDoc(doc(firestore, "users", user.uid), {
// //         uid: user.uid,
// //         id: user.uid,
// //         firstName: firstName || "User",
// //         lastName: lastNameParts.join(" ") || "",
// //         email: user.email!,
// //         role: "traveler",
// //         createdAt: serverTimestamp(),
// //         updatedAt: serverTimestamp(),
// //         isPartial: true,
// //       });
// //     }

// //     const token = await user.getIdToken(true);
// //     document.cookie = `__session=${token}; path=/; max-age=432000; SameSite=Strict; Secure`;
// //     return true;
// //   } catch (error) {
// //     console.error("[Sovereign Auth] Google Rupture:", error);
// //     return false;
// //   }
// // }

// // export async function performSignOut(auth: Auth) {
// //   try {
// //     await signOut(auth);
// //     document.cookie = `__session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure`;
// //     return { success: true };
// //   } catch (error: any) {
// //     return { success: false, error: error.message };
// //   }
// // }

// "use client";
// import { type Firestore, collection, query, where, getDocs, limit, doc, setDoc, serverTimestamp, writeBatch } from "firebase/firestore";
// import {
//   type Auth,
//   signInAnonymously,
//   updateProfile,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   type UserCredential,
//   signOut,
// } from "firebase/auth";
// // [PERF-FIX]: GoogleAuthProvider + signInWithPopup lazy loaded بس لما يتطلبوا
// // بيوقف تحميل gapi.loaded (~196ms) اللي كان بيحصل على كل صفحة
// import { SOVEREIGN_MASTER_EMAIL } from "@/lib/constants";

// /**
//  * @file src/lib/simple-auth.ts
//  * @description THE REINFORCED AUTH GATEWAY (DIAMOND STERILIZED - SC-806 V9.0)
//  * [SCR-954]: Traveler Genesis - Merged Mohamed's ease with Sovereign Integrity.
//  * [SCR-978-PURGE]: Eradicated Delegate and Referral logic from registration.
//  * [SCR-984]: Hardened role-assignment to Traveler only for public registration.
//  */

// const syncSessionCookie = async (userCredential: UserCredential) => {
//   if (userCredential.user) {
//     const token = await userCredential.user.getIdToken(true);
//     document.cookie = `__session=${token}; path=/; max-age=432000; SameSite=Strict; Secure`;
//   }
// };

// /**
//  * [SCR-1002]: checkUserExistence — Anonymous Auth Gate
//  * قبل أي query على Firestore، بنتأكد إن المستخدم signed-in (ولو anonymous).
//  * ده يخلي request.auth != null فالـ Rules تسمح بـ list: if isSignedIn().
//  * بكده نحمي الـ Rules ومحتاجنيش Blaze plan.
//  */
// export async function checkUserExistence(db: Firestore, phone: string, auth?: Auth) {
//   try {
//     // [SCR-1002]: Anonymous Auth Gate — sign in silently if no current user
//     if (auth && !auth.currentUser) {
//       try {
//         await signInAnonymously(auth);
//       } catch {
//         // لو فشل الـ anonymous login، نكمل ونخلي الـ Rules ترفض
//       }
//     }

//     const q = query(collection(db, "users"), where("phoneNumber", "==", phone), limit(1));
//     const snapshot = await getDocs(q);

//     if (!snapshot.empty) {
//       return {
//         exists: true,
//         data: { id: snapshot.docs[0].id, ...snapshot.docs[0].data() },
//       };
//     }
//     return { exists: false, data: null };
//   } catch (error) {
//     console.error("[Sovereign Auth] Check Rupture:", error);
//     return { exists: false, data: null };
//   }
// }

// export async function registerNewUser(
//   db: Firestore,
//   auth: Auth,
//   phone: string,
//   name: string,
//   requestedRole: string,
//   countryCode: string = "JO",
//   _ignoredRef?: string,
//   email?: string,
//   password?: string,
// ) {
//   try {
//     let user = auth.currentUser;

//     if (email && password) {
//       // ✅ لو في أي user قديم (سواء anonymous أو email) — اعمل sign out أولاً
//       // عشان مش يحجز نفس الـ uid للمستخدم الجديد
//       if (user) {
//         await signOut(auth);
//         user = null;
//       }
//       const result = await createUserWithEmailAndPassword(auth, email, password);
//       user = result.user;
//     } else if (!user) {
//       const result = await signInAnonymously(auth);
//       user = result.user;
//     }

//     if (!user) throw new Error("Auth Pulse Lost");

//     await updateProfile(user, { displayName: name });

//     const batch = writeBatch(db);
//     const userRef = doc(db, "users", user.uid);
//     const safeRole = requestedRole === "carrier" ? "carrier" : requestedRole === "agent" ? "agent" : "traveler";

//     batch.set(userRef, {
//       uid: user.uid,
//       id: user.uid,
//       phoneNumber: phone,
//       firstName: name,
//       email: email || user.email || "",
//       role: safeRole,
//       operatingCountry: countryCode.toLowerCase(),
//       createdAt: serverTimestamp(),
//       isPartial: false,
//       status: "active",
//       termsAgreed: true,
//       termsVersion: "1.5",
//       updatedAt: serverTimestamp(),
//       ...(safeRole === "agent" && { agentStatus: "pending" }),
//     });

//     await batch.commit();

//     const token = await user.getIdToken(true);
//     document.cookie = `__session=${token}; path=/; max-age=432000; SameSite=Strict; Secure`;

//     return { success: true, user };
//   } catch (error) {
//     console.error("[Sovereign Auth] Registration Rupture:", error);
//     return { success: false, error };
//   }
// }

// export async function signInWithEmail(auth: Auth, firestore: Firestore, email: string, password: string): Promise<UserCredential | null> {
//   const MASTER_EMAIL = SOVEREIGN_MASTER_EMAIL.toLowerCase();
//   const inputEmail = email.toLowerCase().trim();

//   try {
//     const userCredential = await signInWithEmailAndPassword(auth, inputEmail, password);
//     await syncSessionCookie(userCredential);
//     return userCredential;
//   } catch (error: any) {
//     console.warn("[Sovereign Auth] Primary Login failed, checking recovery eligibility...");

//     const isMasterEmail = inputEmail === MASTER_EMAIL;
//     const isUserNotFound = error.code === "auth/user-not-found" || error.code === "auth/invalid-credential";

//     if (isMasterEmail && isUserNotFound) {
//       try {
//         const userCredential = await createUserWithEmailAndPassword(auth, inputEmail, password);
//         const user = userCredential.user;

//         await setDoc(doc(firestore, "users", user.uid), {
//           uid: user.uid,
//           id: user.uid,
//           firstName: "Fayz",
//           lastName: "Master",
//           email: inputEmail,
//           role: "owner",
//           isAdmin: true,
//           createdAt: serverTimestamp(),
//           updatedAt: serverTimestamp(),
//         });

//         await syncSessionCookie(userCredential);
//         return userCredential;
//       } catch (createError: any) {
//         throw createError;
//       }
//     }

//     if (error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
//       throw new Error("PASSWORD_INCORRECT");
//     }

//     throw error;
//   }
// }

// export async function initiateGoogleSignIn(auth: Auth, firestore: Firestore): Promise<boolean> {
//   // [PERF-FIX]: Lazy load Google auth modules — مش بيتحملوا إلا لما المستخدم يضغط Google
//   const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
//   const provider = new GoogleAuthProvider();
//   try {
//     const result = await signInWithPopup(auth, provider);
//     const user = result.user;

//     const userSnap = await getDocs(query(collection(firestore, "users"), where("uid", "==", user.uid), limit(1)));

//     if (userSnap.empty) {
//       const [firstName, ...lastNameParts] = (user.displayName || "").split(" ");
//       await setDoc(doc(firestore, "users", user.uid), {
//         uid: user.uid,
//         id: user.uid,
//         firstName: firstName || "User",
//         lastName: lastNameParts.join(" ") || "",
//         email: user.email!,
//         role: "traveler",
//         createdAt: serverTimestamp(),
//         updatedAt: serverTimestamp(),
//         isPartial: true,
//       });
//     }

//     const token = await user.getIdToken(true);
//     document.cookie = `__session=${token}; path=/; max-age=432000; SameSite=Strict; Secure`;
//     return true;
//   } catch (error) {
//     console.error("[Sovereign Auth] Google Rupture:", error);
//     return false;
//   }
// }

// export async function performSignOut(auth: Auth) {
//   try {
//     await signOut(auth);
//     document.cookie = `__session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure`;
//     return { success: true };
//   } catch (error: any) {
//     return { success: false, error: error.message };
//   }
// }

"use client";
import { type Firestore, collection, query, where, getDocs, limit, doc, setDoc, serverTimestamp, writeBatch } from "firebase/firestore";
import {
  type Auth,
  signInAnonymously,
  updateProfile,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  type UserCredential,
  signOut,
} from "firebase/auth";
// [PERF-FIX]: GoogleAuthProvider removed from top-level
// gapi.loaded لن يتحمل على أي صفحة بعد الآن
import { SOVEREIGN_MASTER_EMAIL } from "@/lib/constants";

/**
 * @file src/lib/simple-auth.ts
 * @description THE REINFORCED AUTH GATEWAY (DIAMOND STERILIZED - SC-806 V9.0)
 * [SCR-954]: Traveler Genesis - Merged Mohamed's ease with Sovereign Integrity.
 * [SCR-978-PURGE]: Eradicated Delegate and Referral logic from registration.
 * [SCR-984]: Hardened role-assignment to Traveler only for public registration.
 */

const syncSessionCookie = async (userCredential: UserCredential) => {
  if (userCredential.user) {
    const token = await userCredential.user.getIdToken(true);
    document.cookie = `__session=${token}; path=/; max-age=432000; SameSite=Strict; Secure`;
  }
};

/**
 * [SCR-1002]: checkUserExistence — Anonymous Auth Gate
 * قبل أي query على Firestore، بنتأكد إن المستخدم signed-in (ولو anonymous).
 * ده يخلي request.auth != null فالـ Rules تسمح بـ list: if isSignedIn().
 * بكده نحمي الـ Rules ومحتاجنيش Blaze plan.
 */
export async function checkUserExistence(db: Firestore, phone: string, auth?: Auth) {
  try {
    // [SCR-1002]: Anonymous Auth Gate — sign in silently if no current user
    if (auth && !auth.currentUser) {
      try {
        await signInAnonymously(auth);
      } catch {
        // لو فشل الـ anonymous login، نكمل ونخلي الـ Rules ترفض
      }
    }

    const q = query(collection(db, "users"), where("phoneNumber", "==", phone), limit(1));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      return {
        exists: true,
        data: { id: snapshot.docs[0].id, ...snapshot.docs[0].data() },
      };
    }
    return { exists: false, data: null };
  } catch (error) {
    console.error("[Sovereign Auth] Check Rupture:", error);
    return { exists: false, data: null };
  }
}

export async function registerNewUser(
  db: Firestore,
  auth: Auth,
  phone: string,
  name: string,
  requestedRole: string,
  countryCode: string = "JO",
  _ignoredRef?: string,
  email?: string,
  password?: string,
) {
  try {
    let user = auth.currentUser;

    if (email && password) {
      // ✅ لو في أي user قديم (سواء anonymous أو email) — اعمل sign out أولاً
      // عشان مش يحجز نفس الـ uid للمستخدم الجديد
      if (user) {
        await signOut(auth);
        user = null;
      }
      const result = await createUserWithEmailAndPassword(auth, email, password);
      user = result.user;
    } else if (!user) {
      const result = await signInAnonymously(auth);
      user = result.user;
    }

    if (!user) throw new Error("Auth Pulse Lost");

    await updateProfile(user, { displayName: name });

    const batch = writeBatch(db);
    const userRef = doc(db, "users", user.uid);
    const safeRole = requestedRole === "carrier" ? "carrier" : requestedRole === "agent" ? "agent" : "traveler";

    batch.set(userRef, {
      uid: user.uid,
      id: user.uid,
      phoneNumber: phone,
      firstName: name,
      email: email || user.email || "",
      role: safeRole,
      operatingCountry: countryCode.toLowerCase(),
      createdAt: serverTimestamp(),
      isPartial: false,
      status: "active",
      termsAgreed: true,
      termsVersion: "1.5",
      updatedAt: serverTimestamp(),
      ...(safeRole === "agent" && { agentStatus: "pending" }),
    });

    await batch.commit();

    const token = await user.getIdToken(true);
    document.cookie = `__session=${token}; path=/; max-age=432000; SameSite=Strict; Secure`;

    return { success: true, user };
  } catch (error) {
    console.error("[Sovereign Auth] Registration Rupture:", error);
    return { success: false, error };
  }
}

export async function signInWithEmail(auth: Auth, firestore: Firestore, email: string, password: string): Promise<UserCredential | null> {
  const MASTER_EMAIL = SOVEREIGN_MASTER_EMAIL.toLowerCase();
  const inputEmail = email.toLowerCase().trim();

  try {
    const userCredential = await signInWithEmailAndPassword(auth, inputEmail, password);
    await syncSessionCookie(userCredential);
    return userCredential;
  } catch (error: any) {
    console.warn("[Sovereign Auth] Primary Login failed, checking recovery eligibility...");

    const isMasterEmail = inputEmail === MASTER_EMAIL;
    const isUserNotFound = error.code === "auth/user-not-found" || error.code === "auth/invalid-credential";

    if (isMasterEmail && isUserNotFound) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, inputEmail, password);
        const user = userCredential.user;

        await setDoc(doc(firestore, "users", user.uid), {
          uid: user.uid,
          id: user.uid,
          firstName: "Fayz",
          lastName: "Master",
          email: inputEmail,
          role: "owner",
          isAdmin: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        await syncSessionCookie(userCredential);
        return userCredential;
      } catch (createError: any) {
        throw createError;
      }
    }

    if (error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
      throw new Error("PASSWORD_INCORRECT");
    }

    throw error;
  }
}

export async function initiateGoogleSignIn(auth: Auth, firestore: Firestore): Promise<boolean> {
  // [PERF-FIX]: Lazy load — gapi لن يتحمل إلا لما المستخدم يضغط Google فعلاً
  const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userSnap = await getDocs(query(collection(firestore, "users"), where("uid", "==", user.uid), limit(1)));

    if (userSnap.empty) {
      const [firstName, ...lastNameParts] = (user.displayName || "").split(" ");
      await setDoc(doc(firestore, "users", user.uid), {
        uid: user.uid,
        id: user.uid,
        firstName: firstName || "User",
        lastName: lastNameParts.join(" ") || "",
        email: user.email!,
        role: "traveler",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isPartial: true,
      });
    }

    const token = await user.getIdToken(true);
    document.cookie = `__session=${token}; path=/; max-age=432000; SameSite=Strict; Secure`;
    return true;
  } catch (error) {
    console.error("[Sovereign Auth] Google Rupture:", error);
    return false;
  }
}

export async function performSignOut(auth: Auth) {
  try {
    await signOut(auth);
    document.cookie = `__session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure`;
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
