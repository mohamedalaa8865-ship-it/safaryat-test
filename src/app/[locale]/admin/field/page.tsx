// @ts-nocheck
'use client';

import { useAdminUsers } from '@/hooks/use-admin-users';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Shield, ShieldAlert, Users, Search, Globe, Filter, 
  User, CheckCircle2, Banknote, Ghost, AlertTriangle, Sparkles,
  History
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';
import React, { useCallback } from 'react';
import { useActiveMarkets } from '@/hooks/use-active-markets';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { UserRowActions } from '@/components/admin/users/user-row-actions';
import { Button } from '@/components/ui/button';

/**
 * @page FieldCommandPage
 * @description THE REINFORCED SOVEREIGN RADAR (SC-806 V2.6)
 * [SCR-2026-023]: Fixed Type-Safety for Avatar alt property with Fallback.
 */

const getStatusBadge = (user: any) => {
  if (user.isDeactivated) {
    return (
      <Badge variant="destructive" className="animate-pulse font-black text-[10px] h-5 px-2 gap-1">
        <Ghost className="h-3 w-3" /> محظور (مطرود)
      </Badge>
    );
  }

  if (user.role === 'carrier' && user.subscriptionStatus === 'expired') {
    return (
      <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50 font-black text-[10px] h-5 px-2 gap-1 animate-bounce">
        <AlertTriangle className="h-3 w-3" /> متأخر عن السداد
      </Badge>
    );
  }

  if (user.isFinancialFrozen) {
    return (
      <Badge className="bg-orange-500 text-white font-black text-[10px] h-5 px-2 gap-1">
        <Banknote className="h-3 w-3" /> مجمد مالياً
      </Badge>
    );
  }

  if (user.role === 'carrier' && user.subscriptionStatus === 'trial') {
    return (
      <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 font-black text-[10px] h-5 px-2 gap-1">
        <Sparkles className="h-3 w-3" /> فترة سماح
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 font-black text-[10px] h-5 px-2 gap-1">
      <CheckCircle2 className="h-3 w-3" /> نشط وصالح
    </Badge>
  );
};

export default function FieldCommandPage() {
  const router = useRouter();
  const { users, loading, filters, updateFilter, toggleUserFreeze } = useAdminUsers();
  const { activeMarkets, getMarketName, isLoading: isLoadingMarkets } = useActiveMarkets();

  const handleActionBridge = useCallback((action: 'view' | 'finance_freeze' | 'security_freeze', userId: string, currentStatus: boolean) => {
    if (action === 'view') {
      router.push(`/admin/users/${userId}`);
    } else {
      toggleUserFreeze(action, userId, currentStatus);
    }
  }, [router, toggleUserFreeze]);

  return (
    <div className="space-y-6 animate-in fade-in duration-700 p-2 md:p-4" dir="rtl">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3 text-emerald-500">
            <Shield className="h-8 w-8 text-emerald-500 animate-pulse" />
            رادار الميدان والعدالة الموحد
          </h1>
          <p className="text-muted-foreground text-sm mt-1 font-bold italic text-emerald-600/70">غرفة العمليات المركزية للسيطرة على الجمهور والعتاد [SC-806 V2.6].</p>
        </div>
        <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2 font-black border-emerald-200 text-emerald-600 hover:bg-emerald-50" onClick={() => router.push('/admin/audit-logs?cat=FIELD_MGMT')}>
                <History className="h-4 w-4" />
                سجل القرارات العامة
            </Button>
            <div className="bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20 flex items-center gap-2 shadow-inner">
              <ShieldAlert className="h-5 w-5 text-emerald-500" />
              <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">Sovereign Pulse Radar v2.6</span>
            </div>
        </div>
      </header>

      <Card className="border-emerald-500/20 bg-emerald-500/5 shadow-sm overflow-visible">
        <CardContent className="p-4 flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2 text-emerald-600 font-black px-2 border-l border-emerald-500/20 shrink-0">
            <Filter className="h-5 w-5" /> الرادار
          </div>
          
          <div className="flex-1 min-w-[200px] relative w-full">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500/50" />
            <Input 
              placeholder="ابحث..." 
              value={filters.query}
              onChange={(e) => updateFilter('q', e.target.value)}
              className="pr-10 h-12 font-bold bg-background border-emerald-500/10 focus:ring-emerald-500/30 text-right" 
            />
          </div>

          <Select value={filters.role} onValueChange={(v) => updateFilter('role', v)}>
            <SelectTrigger className="w-full md:w-[140px] h-12 font-bold bg-background border-emerald-500/10">
              <div className="flex items-center gap-2"><User className="h-4 w-4 text-emerald-500" /><SelectValue placeholder="التصنيف" /></div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الجمهور</SelectItem>
              <SelectItem value="carrier" className="font-bold text-blue-600">الناقلون</SelectItem>
              <SelectItem value="traveler" className="font-bold">المسافرون</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.country} onValueChange={(v) => updateFilter('country', v)} disabled={isLoadingMarkets}>
            <SelectTrigger className="w-full md:w-[160px] h-12 font-bold bg-background border-emerald-500/10">
              <div className="flex items-center gap-2">
                <Globe className={cn("h-4 w-4 text-emerald-500", isLoadingMarkets && "animate-spin")} />
                <SelectValue placeholder="الدولة" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="font-black">🌍 كافة الدول</SelectItem>
              {activeMarkets.map((market) => (
                <SelectItem key={market.id} value={market.id} className="font-bold">{market.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-xl overflow-hidden bg-card/50 backdrop-blur-md">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-emerald-500/5">
                <TableRow className="border-emerald-500/10">
                  <TableHead className="w-[250px] py-4 text-emerald-700 font-black text-right">المنتسب</TableHead>
                  <TableHead className="text-emerald-700 font-black text-center">التصنيف</TableHead>
                  <TableHead className="text-emerald-700 font-black text-center">النطاق</TableHead>
                  <TableHead className="text-emerald-700 font-black text-center">وضعية النبض</TableHead>
                  <TableHead className="w-[100px] text-center text-emerald-700 font-black">إجراء</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  [...Array(8)].map((_, i) => (
                    <TableRow key={i}><TableCell colSpan={5}><Skeleton className="h-12 w-full bg-emerald-500/5" /></TableCell></TableRow>
                  ))
                ) : !users || users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-64 text-center opacity-30">
                      <div className="flex flex-col items-center justify-center gap-4">
                        <Users className="h-16 w-16 text-emerald-500" />
                        <p className="text-xl font-black italic">لا يوجد أهداف.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map(user => (
                    <TableRow key={user.id} className={cn(
                      "group transition-colors hover:bg-emerald-500/5 border-emerald-500/5",
                      user.isDeactivated && "bg-destructive/5"
                    )}>
                      <TableCell>
                        <div className="flex items-center gap-3 text-right">
                          <Avatar className="h-10 w-10 border-2 border-background shadow-md">
                            <AvatarImage 
                              src={user.photoURL || ""} 
                              alt={user.firstName || user.fullName || ""} 
                            />
                            <AvatarFallback className="bg-emerald-500/10 text-emerald-600 font-black">{user.firstName?.charAt(0) || user.fullName?.charAt(0) || "U"}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col min-w-0">
                            <span className="font-black text-sm truncate">{user.firstName || user.fullName} {user.lastName || ""}</span>
                            <span className="text-[10px] font-mono text-muted-foreground truncate" dir="ltr">{user.phoneNumber || user.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={user.role === 'carrier' ? "secondary" : "outline"} className={cn(
                          "font-bold text-[10px]",
                          user.role === 'carrier' ? "bg-blue-50 text-blue-700 border-blue-100" : ""
                        )}>
                          {user.role === 'carrier' ? 'ناقل' : 'مسافر'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center gap-1">
                          <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground">
                            <Globe className="h-3 w-3 text-emerald-500" /> 
                            {getMarketName(user.operatingCountry || '')}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(user)}
                      </TableCell>
                      <TableCell className="text-center">
                        <UserRowActions 
                          userId={user.id}
                          isFinancialFrozen={!!user.isFinancialFrozen || user.subscriptionStatus === 'expired'}
                          isSecurityFrozen={!!user.isDeactivated}
                          onAction={handleActionBridge}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
