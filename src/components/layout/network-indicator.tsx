'use client';

import { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

/**
 * @component NetworkIndicator
 * @description THE OFFLINE SENSOR (PROTOCOL 88 - SC-534)
 * Provides visual feedback when connectivity is lost. Zero Network Cost.
 */
export function NetworkIndicator() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Initial check
    setIsOffline(!navigator.onLine);

    const handleOnline = () => {
        setIsOffline(false);
        document.body.classList.remove('grayscale', 'contrast-125');
    };
    const handleOffline = () => {
        setIsOffline(true);
        document.body.classList.add('grayscale', 'contrast-125');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.body.classList.remove('grayscale', 'contrast-125');
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-destructive text-destructive-foreground text-[10px] font-bold py-1.5 px-4 flex items-center justify-center gap-2 z-[9999] shadow-lg animate-in slide-in-from-top duration-300">
      <WifiOff className="h-3 w-3 animate-pulse" />
      أنت الآن في وضع عدم الاتصال - يتم عرض البيانات من الذاكرة المحلية السيادية
    </div>
  );
}
