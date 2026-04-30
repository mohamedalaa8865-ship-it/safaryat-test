'use client';

import React, { useState, useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase/client-provider';

/**
 * @file src/components/layout/app-providers.tsx
 * @description THE REINFORCED STABLE WRAPPER (SC-806 - V2.5 - STERILIZED)
 * [SCR-988]: Eradicated AskAiTrigger Ghost Import to resolve build failure.
 * Protocol 16: Diamond Sterilized.
 */

export default function AppProviders({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <FirebaseClientProvider>
      {children}
      <Toaster />
    </FirebaseClientProvider>
  );
}
