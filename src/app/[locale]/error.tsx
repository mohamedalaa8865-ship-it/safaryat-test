'use client';

/**
 * @file src/app/[locale]/error.tsx
 * @description THE REINFORCED LOCALE BOUNDARY (PROTOCOL 20 - THE SHIELD)
 * Handles local cell ruptures. Documents collapses in the Black Box.
 */

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import { triggerHaptic } from '@/lib/utils';
import { SovereignBlackBox } from '@/lib/sovereign-monitor';
import { useTranslations } from 'next-intl';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('errorDictionary');

  useEffect(() => {
    // [PROTOCOL 20]: Automatic Forensic Documentation
    console.error("[Sovereign Cell Rupture]:", error);
    triggerHaptic('heavy');
    
    // Auto-report to the Black Box
    SovereignBlackBox.reportLethalCrash(error, 'LOCALE_CELL_RUPTURE');
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center animate-in fade-in duration-500" dir="rtl">
      <div className="bg-destructive/10 p-6 rounded-full mb-6 border border-destructive/20 shadow-inner">
        <AlertTriangle className="h-16 w-16 text-destructive animate-bounce" />
      </div>
      
      <div className="space-y-2 mb-10">
        <h2 className="text-3xl font-black tracking-tighter text-foreground italic uppercase">Cell Rupture Detected</h2>
        <p className="text-muted-foreground font-bold max-w-md mx-auto leading-relaxed">
          عذراً أيها المستخدم، حدث اضطراب في هذا القطاع. تمَّ عزل الانهيار وتفعيل بروتوكولات التعافي الذاتي.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-xs">
        <Button onClick={() => reset()} variant="default" className="gap-2 h-14 rounded-2xl text-sm font-black shadow-lg">
          <RefreshCcw className="h-4 w-4" />
          إعادة إنعاش النبض
        </Button>
        <Button onClick={() => window.location.href = '/'} variant="outline" className="gap-2 h-14 rounded-2xl text-sm font-black">
          <Home className="h-4 w-4" />
          ساحة القلعة
        </Button>
      </div>

      <div className="mt-12 flex flex-col items-center gap-2 opacity-30">
          <div className="h-px w-24 bg-primary" />
          <p className="text-[8px] font-black uppercase tracking-[0.5em] text-muted-foreground">Sovereign Immune System Active • Protocol 20</p>
      </div>
    </div>
  );
}
