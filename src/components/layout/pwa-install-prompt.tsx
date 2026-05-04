'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, X, Sparkles } from 'lucide-react';
import { triggerHaptic } from '@/lib/utils';
import { useTranslations } from 'next-intl';

// ✅ غير ده لـ false لما تتأكد إن كل حاجة شغالة
const DEBUG_MODE = true;

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(true);
  const [showPrompt, setShowPrompt] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');
  const t = useTranslations('pwa')
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // STEP 1: هل التطبيق متثبت أصلاً؟
    const isAppMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    setIsStandalone(isAppMode);
    if (DEBUG_MODE) setDebugInfo(`standalone:${isAppMode}`);
    if (isAppMode) return;

    // STEP 2: هل iOS؟
    const ua = window.navigator.userAgent.toLowerCase();
    const isAppleDevice =
      /iphone|ipad|ipod/.test(ua) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    setIsIOS(isAppleDevice);
    if (DEBUG_MODE) setDebugInfo(prev => prev + ` | iOS:${isAppleDevice}`);

    // STEP 3: في DEBUG نتجاهل الـ dismiss — في production نحترمه
    if (!DEBUG_MODE) {
      const dismissed = localStorage.getItem('pwa_prompt_dismissed');
      if (dismissed) {
        const age = Date.now() - parseInt(dismissed);
        if (age < 7 * 24 * 60 * 60 * 1000) return;
      }
    }

    if (isAppleDevice) {
      setTimeout(() => setShowPrompt(true), DEBUG_MODE ? 1000 : 8000);
    } else {
      // Android: جرب window.__pwaPrompt المحفوظ في layout
      const saved = (window as any).__pwaPrompt;
      if (DEBUG_MODE) setDebugInfo(prev => prev + ` | saved:${!!saved}`);

      if (saved) {
        setDeferredPrompt(saved);
        setTimeout(() => setShowPrompt(true), DEBUG_MODE ? 1000 : 3000);
      } else if (DEBUG_MODE) {
        // في debug: اعرض الـ UI حتى لو مفيش prompt عشان نشوف الـ UI
        setTimeout(() => setShowPrompt(true), 1000);
      }

      const handler = (e: any) => {
        e.preventDefault();
        (window as any).__pwaPrompt = e;
        setDeferredPrompt(e);
        if (DEBUG_MODE) setDebugInfo(prev => prev + ' | event!');
        setTimeout(() => setShowPrompt(true), DEBUG_MODE ? 500 : 3000);
      };
      window.addEventListener('beforeinstallprompt', handler);
      return () => window.removeEventListener('beforeinstallprompt', handler);
    }
  }, []);

  const handleInstall = async () => {
    triggerHaptic('light');
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setShowPrompt(false);
    setDeferredPrompt(null);
  };

  const dismiss = () => {
    triggerHaptic('light');
    setShowPrompt(false);
    if (!DEBUG_MODE) {
      localStorage.setItem('pwa_prompt_dismissed', Date.now().toString());
    }
  };

  if (isStandalone || !showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 bg-card border-2 border-primary/30 p-4 rounded-2xl shadow-2xl z-[9998] animate-in slide-in-from-bottom-10 duration-500">

      {/* {DEBUG_MODE && debugInfo && (
        <p className="text-[9px] text-yellow-400 bg-black/60 rounded px-2 py-1 mb-2 font-mono break-all">
          🐛 {debugInfo}
        </p>
      )} */}

      <div className="flex items-start gap-3">
        <div className="h-11 w-11 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold mb-1">{t("title")}</h4>

          {isIOS ? (
            <div className="text-[11px] text-muted-foreground leading-relaxed">
              <p className="mb-1.5">{t('androidDesc')}</p>
              <ol className="flex flex-col gap-1">
                <li className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-primary/20 text-primary text-[9px] flex items-center justify-center font-bold shrink-0">١</span>
                  <span>{t('step1')}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-primary/20 text-primary text-[9px] flex items-center justify-center font-bold shrink-0">٢</span>
                  <span>{t('step2')}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-primary/20 text-primary text-[9px] flex items-center justify-center font-bold shrink-0">٣</span>
                  <span>{t('step3')} </span>
                </li>
              </ol>
            </div>
          ) : (
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {t('androidDesc')}
            </p>
          )}
        </div>

        <button onClick={dismiss} className="text-muted-foreground hover:text-foreground p-1 -mt-1 -mr-1">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex gap-2 mt-3">
        {!isIOS && (
          <Button onClick={handleInstall} size="sm" className="flex-1 h-8 text-xs font-black gap-1.5">
            <Download className="h-3.5 w-3.5" />
            {/* {deferredPrompt ? 'تثبيت الآن' : (DEBUG_MODE ? '🐛 No Native Prompt' : 'تثبيت')} */}
            {t('install')}
          </Button>
        )}
        <button onClick={dismiss} className="text-xs text-muted-foreground hover:text-foreground font-medium px-3">
          {t('later')}
        </button>
      </div>
    </div>
  );
}