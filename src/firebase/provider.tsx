
// 'use client';

// import React, { DependencyList, createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
// import { FirebaseApp } from 'firebase/app';
// import { Firestore } from 'firebase/firestore';
// import { Auth, User, onAuthStateChanged } from 'firebase/auth';
// import { Functions } from 'firebase/functions';
// import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

// /**
//  * @file src/firebase/provider.tsx
//  * @description THE REINFORCED SOVEREIGN ARTERY (STERILIZED - V10.0 - SCR-918)
//  * [SCR-918]: Injected Functions into the atomic context to prevent ReferenceErrors.
//  * Protocol 16: Sterilized. Protocol 88: Resource Protected.
//  */

// interface FirebaseProviderProps {
//   children: ReactNode;
//   firebaseApp: FirebaseApp;
//   firestore: Firestore;
//   auth: Auth;
//   functions: Functions;
// }

// interface UserAuthState {
//   user: User | null;
//   isUserLoading: boolean;
//   userError: Error | null;
// }

// export interface FirebaseContextState {
//   areServicesAvailable: boolean;
//   firebaseApp: FirebaseApp | null;
//   firestore: Firestore | null;
//   auth: Auth | null;
//   functions: Functions | null;
//   user: User | null;
//   isUserLoading: boolean; 
//   userError: Error | null; 
// }

// export interface FirebaseServicesAndUser {
//   firebaseApp: FirebaseApp;
//   firestore: Firestore;
//   auth: Auth;
//   functions: Functions;
//   user: User | null;
//   isUserLoading: boolean;
//   userError: Error | null;
// }

// export interface UserHookResult {
//   user: User | null;
//   isUserLoading: boolean;
//   userError: Error | null;
// }

// export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

// export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({
//   children,
//   firebaseApp,
//   firestore,
//   auth,
//   functions,
// }) => {
//   const [userAuthState, setUserAuthState] = useState<UserAuthState>({
//     user: null,
//     isUserLoading: true,
//     userError: null,
//   });

//   useEffect(() => {
//     if (!auth) return;
//     const unsubscribe = onAuthStateChanged(
//       auth,
//       (firebaseUser) => setUserAuthState({ user: firebaseUser, isUserLoading: false, userError: null }),
//       (error) => setUserAuthState({ user: null, isUserLoading: false, userError: error })
//     );
//     return () => unsubscribe();
//   }, [auth]);

//   const contextValue = useMemo((): FirebaseContextState => {
//     const servicesAvailable = !!(firebaseApp && firestore && auth && functions);
//     return {
//       areServicesAvailable: servicesAvailable,
//       firebaseApp: servicesAvailable ? firebaseApp : null,
//       firestore: servicesAvailable ? firestore : null,
//       auth: servicesAvailable ? auth : null,
//       functions: servicesAvailable ? functions : null,
//       user: userAuthState.user,
//       isUserLoading: userAuthState.isUserLoading,
//       userError: userAuthState.userError,
//     };
//   }, [firebaseApp, firestore, auth, functions, userAuthState]);

//   return (
//     <FirebaseContext.Provider value={contextValue}>
//       <FirebaseErrorListener />
//       {children}
//     </FirebaseContext.Provider>
//   );
// };

// export const useFirebase = (): FirebaseServicesAndUser => {
//   const context = useContext(FirebaseContext);
//   if (context === undefined) throw new Error('useFirebase must be used within a FirebaseProvider.');
//   if (!context.areServicesAvailable || !context.firebaseApp || !context.firestore || !context.auth || !context.functions) {
//     throw new Error('Firebase core services not available. Check FirebaseProvider props.');
//   }
//   return {
//     firebaseApp: context.firebaseApp,
//     firestore: context.firestore,
//     auth: context.auth,
//     functions: context.functions,
//     user: context.user,
//     isUserLoading: context.isUserLoading,
//     userError: context.userError,
//   };
// };

// export const useAuth = (): Auth => useFirebase().auth;
// export const useFirestore = (): Firestore => useFirebase().firestore;
// export const useFunctions = (): Functions => useFirebase().functions;
// export const useFirebaseApp = (): FirebaseApp => useFirebase().firebaseApp;

// export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T {
//   const memoized = useMemo(factory, deps);
//   if(typeof memoized === 'object' && memoized !== null) {
//     (memoized as any).__memo = true;
//   }
//   return memoized;
// }

// export const useUser = (): UserHookResult => {
//   const { user, isUserLoading, userError } = useFirebase();
//   return { user, isUserLoading, userError };
// };


'use client';

import React, { DependencyList, createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth, User, onAuthStateChanged } from 'firebase/auth';
import { Functions } from 'firebase/functions';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

/**
 * @file src/firebase/provider.tsx
 * @description THE REINFORCED SOVEREIGN ARTERY (STERILIZED - V10.0 - SCR-918)
 * [SCR-918]: Injected Functions into the atomic context to prevent ReferenceErrors.
 * Protocol 16: Sterilized. Protocol 88: Resource Protected.
 */

interface FirebaseProviderProps {
  children: ReactNode;
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  functions: Functions;
}

interface UserAuthState {
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

export interface FirebaseContextState {
  areServicesAvailable: boolean;
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
  functions: Functions | null;
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

export interface FirebaseServicesAndUser {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  functions: Functions;
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

export interface UserHookResult {
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({
  children,
  firebaseApp,
  firestore,
  auth,
  functions,
}) => {
  const [userAuthState, setUserAuthState] = useState<UserAuthState>({
    user: null,
    isUserLoading: true,
    userError: null,
  });

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => setUserAuthState({ user: firebaseUser, isUserLoading: false, userError: null }),
      (error) => setUserAuthState({ user: null, isUserLoading: false, userError: error })
    );
    return () => unsubscribe();
  }, [auth]);

  const servicesValue = useMemo((): Pick<FirebaseContextState, 'areServicesAvailable' | 'firebaseApp' | 'firestore' | 'auth' | 'functions'> => {
    const servicesAvailable = !!(firebaseApp && firestore && auth && functions);
    return {
      areServicesAvailable: servicesAvailable,
      firebaseApp: servicesAvailable ? firebaseApp : null,
      firestore: servicesAvailable ? firestore : null,
      auth: servicesAvailable ? auth : null,
      functions: servicesAvailable ? functions : null,
    };
  }, [firebaseApp, firestore, auth, functions]);

  const contextValue = useMemo((): FirebaseContextState => ({
    ...servicesValue,
    user: userAuthState.user,
    isUserLoading: userAuthState.isUserLoading,
    userError: userAuthState.userError,
  }), [servicesValue, userAuthState]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = (): FirebaseServicesAndUser => {
  const context = useContext(FirebaseContext);
  if (context === undefined) throw new Error('useFirebase must be used within a FirebaseProvider.');
  if (!context.areServicesAvailable || !context.firebaseApp || !context.firestore || !context.auth || !context.functions) {
    throw new Error('Firebase core services not available. Check FirebaseProvider props.');
  }
  return {
    firebaseApp: context.firebaseApp,
    firestore: context.firestore,
    auth: context.auth,
    functions: context.functions,
    user: context.user,
    isUserLoading: context.isUserLoading,
    userError: context.userError,
  };
};

export const useAuth = (): Auth => useFirebase().auth;
export const useFirestore = (): Firestore => useFirebase().firestore;
export const useFunctions = (): Functions => useFirebase().functions;
export const useFirebaseApp = (): FirebaseApp => useFirebase().firebaseApp;

export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T {
  const memoized = useMemo(factory, deps);
  if (typeof memoized === 'object' && memoized !== null) {
    (memoized as any).__memo = true;
  }
  return memoized;
}

export const useUser = (): UserHookResult => {
  const { user, isUserLoading, userError } = useFirebase();
  return { user, isUserLoading, userError };
};