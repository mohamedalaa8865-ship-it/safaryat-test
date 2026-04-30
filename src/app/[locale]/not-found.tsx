'use client';

import { useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';
/**
 * @file src/app/[locale]/not-found.tsx
 * @description THE REINFORCED LOCALE 404 HOUND (V7.0 - CHUNK RESILIENT)
 * Re-directs lost users back to the Sovereign Dashboard within their locale.
 * Optimized to be lightweight and prevent chunk loading errors.
 */
export default function LocaleNotFound() {
  const locale = useLocale();
  const t = useTranslations('common');
  useEffect(() => {
    // [PROTOCOL 88]: Immediate hard redirect to bypass any broken router state or missing chunks
    const target = `/${locale || 'ar'}/dashboard`;
    window.location.href = target;
  }, [locale]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-[#1F0A10] text-[#beae77]" dir="rtl">
      <div className="bg-[#beae77]/10 p-6 rounded-full animate-pulse border border-[#beae77]/20 shadow-2xl">
        <h1 className="text-6xl font-black tracking-tighter text-[#beae77]">404</h1>
      </div>
      <p className="text-[#beae77]/60 font-black uppercase tracking-widest text-xs">{t('notFoundPath')}</p>
      <p className="text-white font-bold">{t('notFoundReconnecting')}</p>
    </div>
  );
}
