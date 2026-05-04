// // // 'use client';

// // // import React, { useMemo, type ReactNode } from 'react';
// // // import { FirebaseProvider } from '@/firebase/provider';
// // // import { initializeFirebase } from '@/firebase';
// // // import { getFunctions } from 'firebase/functions';

// // // interface FirebaseClientProviderProps {
// // //   children: ReactNode;
// // // }

// // // /**
// // //  * @component FirebaseClientProvider
// // //  * @description THE REINFORCED STABLE PROVIDER (SCR-918)
// // //  * Ensures all initialized SDKs (including functions) are passed to the context.
// // //  * Protocol 16: Diamond Sterilized.
// // //  */
// // // export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
// // //   const firebaseServices = useMemo(() => {
// // //     // Initialize Firebase on the client side, once per component mount.
// // //     const sdks = initializeFirebase();

// // //     // Explicitly pull functions from the core to ensure it's provided with correct region
// // //     const functionsInstance = getFunctions(sdks.firebaseApp, 'us-central1');

// // //     return {
// // //         ...sdks,
// // //         functions: functionsInstance
// // //     };
// // //   }, []);

// // //   return (
// // //     <FirebaseProvider
// // //       firebaseApp={firebaseServices.firebaseApp}
// // //       auth={firebaseServices.auth}
// // //       firestore={firebaseServices.firestore}
// // //       functions={firebaseServices.functions}
// // //     >
// // //       {children}
// // //     </FirebaseProvider>
// // //   );
// // // }

// // 'use client';

// // import React, { useState, useEffect, type ReactNode } from 'react';

// // interface FirebaseClientProviderProps {
// //   children: ReactNode;
// // }

// // /**
// //  * @component FirebaseClientProvider
// //  * [PERF-FIX-2]: Firebase now loads lazily after first render.
// //  * Previously it blocked the main thread on every page including landing.
// //  * Now: children render immediately, Firebase initializes in background.
// //  */
// // export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
// //   const [Provider, setProvider] = useState<React.ComponentType<any> | null>(null);
// //   const [services, setServices] = useState<any>(null);

// //   useEffect(() => {
// //     // Load Firebase only after first paint — non-blocking
// //     Promise.all([
// //       import('@/firebase/provider'),
// //       import('@/firebase'),
// //       import('firebase/functions'),
// //     ]).then(([{ FirebaseProvider }, { initializeFirebase }, { getFunctions }]) => {
// //       const sdks = initializeFirebase();
// //       const functions = getFunctions(sdks.firebaseApp, 'us-central1');
// //       setServices({ ...sdks, functions });
// //       setProvider(() => FirebaseProvider);
// //     });
// //   }, []);

// //   // Render children immediately without Firebase (for non-auth pages like landing)
// //   if (!Provider || !services) {
// //     return <>{children}</>;
// //   }

// //   return (
// //     <Provider
// //       firebaseApp={services.firebaseApp}
// //       auth={services.auth}
// //       firestore={services.firestore}
// //       functions={services.functions}
// //     >
// //       {children}
// //     </Provider>
// //   );
// // }

// 'use client';

// import React, { useState, useEffect, type ReactNode } from 'react';

// interface FirebaseClientProviderProps {
//   children: ReactNode;
// }

// /**
//  * @component FirebaseClientProvider
//  * [PERF-FIX-2]: Firebase now loads lazily after first render.
//  * Previously it blocked the main thread on every page including landing.
//  * Now: children render immediately, Firebase initializes in background.
//  */
// export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
//   const [Provider, setProvider] = useState<React.ComponentType<any> | null>(null);
//   const [services, setServices] = useState<any>(null);

//   useEffect(() => {
//     // [PERF-FIX]: استخدم requestIdleCallback عشان Firebase يتحمل في الوقت الفاضي
//     // مش في أول render — بيديها الأولوية للـ UI أولاً
//     const load = () => {
//       Promise.all([
//         import('@/firebase/provider'),
//         import('@/firebase'),
//         import('firebase/functions'),
//       ]).then(([{ FirebaseProvider }, { initializeFirebase }, { getFunctions }]) => {
//         const sdks = initializeFirebase();
//         const functions = getFunctions(sdks.firebaseApp, 'us-central1');
//         setServices({ ...sdks, functions });
//         setProvider(() => FirebaseProvider);
//       });
//     };

//     // requestIdleCallback: Firebase يتحمل بعد ما المتصفح يخلص رسم الـ UI
//     if (typeof window !== 'undefined') {
//       if ('requestIdleCallback' in window) {
//         (window as any).requestIdleCallback(load, { timeout: 3000 });
//       } else {
//         // fallback للمتصفحات اللي مش بتدعم requestIdleCallback
//         setTimeout(load, 100);
//       }
//     }
//   }, []);

//   // Render children immediately without Firebase (for non-auth pages like landing)
//   if (!Provider || !services) {
//     return <>{children}</>;
//   }

//   return (
//     <Provider
//       firebaseApp={services.firebaseApp}
//       auth={services.auth}
//       firestore={services.firestore}
//       functions={services.functions}
//     >
//       {children}
//     </Provider>
//   );
// }

'use client';

import React, { useMemo, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';
import { getFunctions } from 'firebase/functions';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

/**
 * @component FirebaseClientProvider
 * ✅ Firebase يتحمل فوراً — مش lazy
 * عشان useAuth/useFirestore يشتغلوا في أي صفحة بدون error
 */
export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const firebaseServices = useMemo(() => {
    const sdks = initializeFirebase();
    const functions = getFunctions(sdks.firebaseApp, 'us-central1');
    return { ...sdks, functions };
  }, []);

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
      functions={firebaseServices.functions}
    >
      {children}
    </FirebaseProvider>
  );
}