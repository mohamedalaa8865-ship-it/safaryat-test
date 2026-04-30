// "use client";

// import { firebaseConfig } from "@/firebase/config";
// import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import { getFunctions } from "firebase/functions";

// /**
//  * @file src/firebase/index.ts
//  * @description THE REINFORCED SOVEREIGN HUB (STERILIZED - V11.0 - SCR-980)
//  * [SCR-980]: Consolidated getSdks to prevent 'undefined reading call' errors.
//  * Protocol 16: Sterilized. Protocol 88: Zero-Waste Initialization.
//  */

// // IMPORTANT: DO NOT MODIFY THIS FUNCTION
// export function initializeFirebase() {
//   if (!getApps().length) {
//     let firebaseApp;
//     try {
//       firebaseApp = initializeApp();
//     } catch (e) {
//       if (process.env.NODE_ENV === "production") {
//         console.warn("Automatic initialization failed. Falling back to firebase config object.", e);
//       }
//       firebaseApp = initializeApp(firebaseConfig);
//     }
//     return getSdks(firebaseApp);
//   }
//   return getSdks(getApp());
// }

// export function getSdks(firebaseApp: FirebaseApp) {
//   let functionsInstance;
//   try {
//     // [SCR-980]: Single point of functions initialization with regional enforcement
//     functionsInstance = getFunctions(firebaseApp, "us-central1");
//   } catch (e) {
//     console.warn("[Firebase Artery] Functions initialization pulse failed:", e);
//     functionsInstance = null as any;
//   }

//   return {
//     firebaseApp,
//     auth: getAuth(firebaseApp),
//     firestore: getFirestore(firebaseApp),
//     functions: functionsInstance,
//   };
// }

// export * from "./provider";
// export * from "./client-provider";
// export * from "./firestore/use-collection";
// export * from "./firestore/use-doc";
// export * from "./non-blocking-updates";
// export * from "./non-blocking-login";
// export * from "./errors";
// export * from "./error-emitter";

"use client";

import { firebaseConfig } from "@/firebase/config";
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, browserLocalPersistence, setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

/**
 * @file src/firebase/index.ts
 * @description THE REINFORCED SOVEREIGN HUB (STERILIZED - V11.0 - SCR-980)
 * [SCR-980]: Consolidated getSdks to prevent 'undefined reading call' errors.
 * Protocol 16: Sterilized. Protocol 88: Zero-Waste Initialization.
 */

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  if (!getApps().length) {
    let firebaseApp;
    try {
      firebaseApp = initializeApp();
    } catch (e) {
      if (process.env.NODE_ENV === "production") {
        console.warn("Automatic initialization failed. Falling back to firebase config object.", e);
      }
      firebaseApp = initializeApp(firebaseConfig);
    }
    return getSdks(firebaseApp);
  }
  return getSdks(getApp());
}

export function getSdks(firebaseApp: FirebaseApp) {
  let functionsInstance;
  try {
    // [SCR-980]: Single point of functions initialization with regional enforcement
    functionsInstance = getFunctions(firebaseApp, "us-central1");
  } catch (e) {
    console.warn("[Firebase Artery] Functions initialization pulse failed:", e);
    functionsInstance = null as any;
  }

  const auth = getAuth(firebaseApp);
  // ✅ Local Persistence — الـ session تفضل محفوظة حتى لو أغلق التاب
  setPersistence(auth, browserLocalPersistence).catch(() => {
    console.warn("[Firebase] Could not set local persistence");
  });

  return {
    firebaseApp,
    auth,
    firestore: getFirestore(firebaseApp),
    functions: functionsInstance,
  };
}

export * from "./provider";
export * from "./client-provider";
export * from "./firestore/use-collection";
export * from "./firestore/use-doc";
export * from "./non-blocking-updates";
export * from "./non-blocking-login";
export * from "./errors";
export * from "./error-emitter";
