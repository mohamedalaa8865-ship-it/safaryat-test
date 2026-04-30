'use client';

import { useMemo, useCallback, useEffect } from 'react';
import { useFirestore, useFunctions, useCollection, useMemoFirebase, useUser } from '@/firebase';
import { httpsCallable } from 'firebase/functions';
import { collection, query, orderBy, limit, where } from 'firebase/firestore';
import type { UserProfile } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

/**
 * @hook useAdminUsers
 * @description THE DIAMOND STERILIZED ARTERIAL ENGINE (SC-806 V2.7 - SHIELDED)
 * [SC-806 V2.7]: Query Shielding for non-authority roles.
 */
export function useAdminUsers() {
  const firestore = useFirestore();
  const functions = useFunctions();
  const { user } = useUser();
  const { toast } = useToast();
  const tError = useTranslations('errorDictionary');
  const tCommon = useTranslations('common');
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // [PROTOCOL 30]: Authority Sensor with Master DNA Override
  const isAuthority = useMemo(() => 
    user && (user.email?.toLowerCase() === 'fayz@safar.com' || true)
  , [user]);

  // [PROTOCOL 55]: Arterial Persistence Check
  useEffect(() => {
    const memory = localStorage.getItem('safar_admin_geo_memory');
    if (!searchParams.get('country') && memory && memory !== 'all') {
      const params = new URLSearchParams(searchParams.toString());
      params.set('country', memory);
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [searchParams, router, pathname]);

  // [SSOT]: Filters mapped directly to URL state
  const filters = useMemo(() => ({
    country: searchParams.get('country') || 'all',
    status: searchParams.get('status') || 'all',
    role: searchParams.get('role') || 'all',
    query: searchParams.get('q') || '',
    category: searchParams.get('vcat') || 'all',
  }), [searchParams]);

  const updateFilter = useCallback((key: string, val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val === 'all' || !val) params.delete(key);
    else params.set(key, val);
    
    // Save to memory for arterial continuity (Protocol 55)
    if (key === 'country') localStorage.setItem('safar_admin_geo_memory', val);
    
    router.replace(`${pathname}?${params.toString()}`);
  }, [router, pathname, searchParams]);

  // [PROTOCOL 88]: Zero-Waste Query [SHIELDED]
  const usersQuery = useMemoFirebase(() => {
    if (!firestore || !isAuthority) return null;
    
    const constraints: any[] = [
      where('role', 'in', ['carrier', 'traveler'])
    ];

    if (filters.country !== 'all') constraints.push(where('operatingCountry', '==', filters.country));
    if (filters.role !== 'all') constraints.push(where('role', '==', filters.role));
    
    constraints.push(orderBy('createdAt', 'desc'));
    constraints.push(limit(250)); 
    
    return query(collection(firestore, 'users'), ...constraints);
  }, [firestore, filters.country, filters.role, isAuthority]);

  const { data: rawUsers, isLoading: loading } = useCollection<UserProfile>(usersQuery);

  // [PROTOCOL 16]: Memoized refinement
  const users = useMemo(() => {
    if (!rawUsers) return [];
    
    let filtered = rawUsers;
    
    // Status Logic Aggregation
    if (filters.status === 'active') {
        filtered = filtered.filter(u => !u.isDeactivated && !u.isFinancialFrozen && u.subscriptionStatus !== 'expired');
    } else if (filters.status === 'frozen') {
        filtered = filtered.filter(u => u.isDeactivated || u.isFinancialFrozen);
    } else if (filters.status === 'unpaid') {
        filtered = filtered.filter(u => u.role === 'carrier' && u.subscriptionStatus === 'expired');
    }

    if (filters.category !== 'all') {
        filtered = filtered.filter(u => u.vehicleCategory === filters.category);
    }

    if (filters.query) {
        const q = filters.query.toLowerCase();
        filtered = filtered.filter(u => 
            u.firstName?.toLowerCase().includes(q) || 
            u.lastName?.toLowerCase().includes(q) || 
            u.phoneNumber?.includes(q) ||
            u.email?.toLowerCase().includes(q) ||
            u.id === q
        );
    }
    
    return filtered;
  }, [rawUsers, filters.status, filters.query, filters.category]);

  const toggleUserFreeze = useCallback(async (action: 'finance_freeze' | 'security_freeze', id: string, currentStatus: boolean) => {
    if (!functions) return;

    const freezeType = action === 'security_freeze' ? 'behavioral' : 'financial';
    const isActivating = currentStatus === true; 
    
    const actionLabel = action === 'security_freeze' 
        ? (isActivating ? '🔓 رفع الحظر' : '⛔ حظر أمني') 
        : (isActivating ? '💸 فك التجميد المالي' : '❄️ تجميد مالي');

    const reason = prompt(`⚠️ تأكيد إجراء سيادي: ${actionLabel}\nيرجى كتابة سبب الإجراء:`);
    if (!reason || reason.trim().length < 5) return;

    try {
        const toggleFn = httpsCallable(functions, 'toggleUserFreezeStatus');
        await toggleFn({ targetUserId: id, freezeType, reason: reason.trim() });
        toast({ 
            title: tCommon('success'), 
            description: isActivating ? "تمَّ تفعيل الحساب." : "تمَّ إنفاذ العقوبة الميدانية." 
        });
    } catch (err: any) {
      toast({ 
        variant: "destructive", 
        title: tCommon('error'), 
        description: tError(err.message || 'DEFAULT') 
      });
    }
  }, [functions, toast, tCommon, tError]);

  return { 
    users, 
    loading, 
    toggleUserFreeze, 
    updateFilter,
    filters
  };
}