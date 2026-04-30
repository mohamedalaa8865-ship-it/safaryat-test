'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Share, X, Sparkles } from 'lucide-react';
import { triggerHaptic } from '@/lib/utils';

/**
 * @component PwaInstallPrompt
 * @description THE SMART BRIDGE (NATIVE SIMULATION - SC-534)
 * Guides users to install the PWA based on their platform (iOS/Android).
 */
export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(true);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if already running in standalone mode
    const isAppMode = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    setIsStandalone(isAppMode);
    
    if (isAppMode) return;

    // Detect iOS to show manual instructions
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isApple = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isApple);

    // If Apple, delay the prompt slightly for UX
    if (isApple) {
      const dismissed = localStorage.getItem('pwa_prompt_dismissed');
      if (!dismissed) {
        setTimeout(() => setShowPrompt(true), 10000);
      }
    }

    // Capture the native install prompt event (Chrome/Android)
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      const dismissed = localStorage.getItem('pwa_prompt_dismissed');
      if (!dismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    triggerHaptic('light');
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const dismissPrompt = () => {
    setShowPrompt(false);
    // Remember dismissal for 7 days to avoid annoyance
    localStorage.setItem('pwa_prompt_dismissed', Date.now().toString());
  };

  if (isStandalone || !showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 bg-card border-2 border-primary/30 p-4 rounded-2xl shadow-2xl z-[9998] flex items-center gap-4 animate-in slide-in-from-bottom-10 duration-700">
      <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
        <Sparkles className="h-6 w-6 text-primary animate-pulse" />
      </div>
      
      <div className="flex-1">
        <h4 className="text-sm font-bold mb-0.5">تجربة "سفريات" كاملة</h4>
        {isIOS ? (
          <p className="text-[10px] text-muted-foreground leading-tight">
            اضغط على <Share className="h-3 w-3 inline mx-0.5" /> ثم <strong>"إضافة للشاشة الرئيسية"</strong> للحصول على تطبيق أسرع.
          </p>
        ) : (
          <p className="text-[10px] text-muted-foreground leading-tight">
            قم بتثبيت التطبيق الآن للعمل بدون إنترنت وتلقي إشعارات فورية.
          </p>
        )}
      </div>
      
      <div className="flex flex-col gap-2">
        {!isIOS && (
          <Button onClick={handleInstallClick} size="sm" className="h-8 text-[10px] font-black px-4 bg-turquoise text-black hover:bg-turquoise/90">
            <Download className="ml-1.5 h-3 w-3" /> تثبيت
          </Button>
        )}
        <button onClick={dismissPrompt} className="text-[10px] text-muted-foreground hover:text-foreground font-bold transition-colors">
          ليس الآن
        </button>
      </div>
    </div>
  );
}
