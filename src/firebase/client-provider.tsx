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
 * @description THE REINFORCED STABLE PROVIDER (SCR-918)
 * Ensures all initialized SDKs (including functions) are passed to the context.
 * Protocol 16: Diamond Sterilized.
 */
export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const firebaseServices = useMemo(() => {
    // Initialize Firebase on the client side, once per component mount.
    const sdks = initializeFirebase();
    
    // Explicitly pull functions from the core to ensure it's provided with correct region
    const functionsInstance = getFunctions(sdks.firebaseApp, 'us-central1');
    
    return {
        ...sdks,
        functions: functionsInstance
    };
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
