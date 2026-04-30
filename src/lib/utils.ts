import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * [SC-533] Sovereign Haptic Feedback (Native Simulation)
 * [SC-704 V7.2.2] THE UNIFIED PULSE: Refractory period injected to prevent haptic storms.
 * Ensures hardware interaction only triggers once every 100ms (Protocol 88).
 */
let lastHapticTime = 0;

export const triggerHaptic = (type: 'light' | 'heavy' | 'success' | 'limit' = 'light') => {
  if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
    const now = Date.now();
    if (now - lastHapticTime < 100) return;
    
    lastHapticTime = now;
    
    switch (type) {
      case 'heavy': window.navigator.vibrate([50, 50, 50]); break;
      case 'success': window.navigator.vibrate(15); break;
      case 'limit': window.navigator.vibrate([50, 50, 50]); break;
      default: window.navigator.vibrate(50); // light
    }
  }
};
