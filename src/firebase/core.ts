'use client';

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager, 
  getFirestore, 
  type Firestore 
} from 'firebase/firestore';
import { getFunctions, type Functions } from 'firebase/functions';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { firebaseConfig } from './config';

/**
 * @file src/firebase/core.ts
 * @description THE REINFORCED LOGICAL ROOT (DIAMOND - SC-631)
 * Enforces Sovereign Persistence with Multi-Tab Management.
 * Protocol 88: Minimizes redundant network requests across browser tabs.
 */

const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

let db: Firestore;

try {
    // [SC-631-FINAL] Sovereign Persistence with Multi-Tab Manager
    // Protects Battery & Quota by sharing cache between open tabs.
    db = initializeFirestore(app, {
        localCache: persistentLocalCache({ 
            tabManager: persistentMultipleTabManager() 
        })
    });
} catch (error: any) {
    console.warn("[Sovereign Persistence Warning]: Multi-tab manager inhibited.", error);
    db = getFirestore(app); 
}

export const firebaseApp: FirebaseApp = app;
export const auth: Auth = getAuth(app);
export const firestore: Firestore = db;
export const functions: Functions = getFunctions(app, 'us-central1'); 
export const storage: FirebaseStorage = getStorage(app);
