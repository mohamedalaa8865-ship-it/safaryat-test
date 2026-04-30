import { redirect } from 'next/navigation';

/**
 * @file src/app/not-found.tsx
 * @description THE SOVEREIGN ROOT GUARD (PROTOCOL 30 - FALLBACK)
 * Catches any non-localized 404s and forces a return to the main artery.
 * Ensures the system never looks for an undefined chunk in the root space.
 */
export default function RootNotFound() {
  // Absolute redirect to ensure we enter the safe [locale] segment
  redirect('/ar/dashboard');
  return null;
}
