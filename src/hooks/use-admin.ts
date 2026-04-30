'use client';

import { useUserProfile } from '@/hooks/use-user-profile';

/**
 * @hook useAdmin
 * @description THE PASSIVE SENSOR (STERILIZED - SC-550)
 * Provides identity state only. Redirection logic is centralized in Middleware.
 */
export function useAdmin() {
  const { profile, isLoading } = useUserProfile();

  return { 
    isLoading: isLoading,
    isAdmin: profile?.role === 'admin' || profile?.role === 'owner'
  };
}
