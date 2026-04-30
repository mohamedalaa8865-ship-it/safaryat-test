
'use client';
import { useCallback, useMemo, useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { 
  Activity, ShieldAlert, Coins, 
  Filter, Shield, Search, History
} from 'lucide-react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit, where } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/formatters';
import { useAdmin } from '@/hooks/use-admin';
import { Badge } from '@/components/ui/badge';
import { useLocale } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StaffRegistryHub from '../staff/staff-registry-hub';

/**
 * @page JudicialHubPage (Sovereign Artery)
 * @description THE REINFORCED JUDICIAL HUB (STERILIZED - V6.8)
 * [V6.8]: Unified SSOT for logs and staff. Enforced Protocol 16.
 */

interface AdminLog {
    id: string;
    action: 'FREEZE' | 'UNFREEZE' | 'PRICING_UPDATE' | 'HR_ACTION' | 'MARKET_OPENED' | 'VAULT_ACCESS_GRANTED' | 'VAULT_ACCESS_DENIED' | 'SYSTEM_REPAIR' | 'BROADCAST';
    freezeType?: 'financial' | 'behavioral' | 'security';
    reason: string;
    targetUserId: string;
    adminId: string;
    adminEmail?: string;
    timestamp: any; 
    snapshot?: any;
}

const getActionBadge = (log: AdminLog) => {
  switch(log.action) {
      case 'PRICING_UPDATE':
          return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 gap-1"><Coins className="h-3 w-3"/> تعديل مالي</Badge>;
      case 'FREEZE':
          return <Badge variant="destructive" className="gap-1 font-black"><Shield className="h-3 w-3"/> حظر {log.freezeType === 'behavioral' ? 'أمني' : 'مالي'}</Badge>;
      case 'UNFREEZE':
          return <Badge className="bg-green-100 text-green-800 border-green-200 gap-1 font-black"><Shield className="h-3 w-3"/> فك الحظر</Badge>;
      case 'VAULT_ACCESS_GRANTED':
          return <Badge variant="secondary" className="bg-slate-900 text-white gap-1"><ShieldAlert className="h-3 w-3"/> وصول للخزنة</Badge>;
      case 'SYSTEM_REPAIR':
          return <Badge className="bg-emerald-500 text-white gap-1 font-black">🛠️ إصلاح سيادي</Badge>;
      default:
          return <Badge variant="outline">{log.action}</Badge>;
  }
};

export default function JudicialHubPage() {
  const firestore = useFirestore();
  const { isAdmin } = useAdmin();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeTab = searchParams.get('tab') || 'logs';
  const categoryFilter = searchParams.get('cat') || 'ALL';
  const searchTerm = searchParams.get('q') || '';

  const updateUrlParams = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
        if (v === null || v === 'ALL') params.delete(k);
        else params.set(k, v);
    });
    router.replace(`${pathname}?${params.toString()}`);
  }, [router, pathname, searchParams]);

  // [PROTOCOL 88]: Sovereign Log Query - Memoized & Optimized
  const logsQuery = useMemoFirebase(() => {
    if (!firestore || !isAdmin || activeTab !== 'logs') return null;
    
    const constraints: any[] = [];
    if (categoryFilter === 'FIELD_MGMT') constraints.push(where('action', 'in', ['FREEZE', 'UNFREEZE']));
    else if (categoryFilter === 'FINANCE') constraints.push(where('action', 'in', ['PRICING_UPDATE', 'MARKET_OPENED']));
    else if (categoryFilter === 'SECURITY') constraints.push(where('action', 'in', ['VAULT_ACCESS_GRANTED', 'VAULT_ACCESS_DENIED', 'SYSTEM_REPAIR']));

    constraints.push(orderBy('timestamp', 'desc'));
    constraints.push(limit(150));

    return query(collection(firestore, 'admin_logs'), ...constraints);
  }, [firestore, isAdmin, categoryFilter, activeTab]);

  const { data: rawLogs, isLoading: isLoadingLogs } = useCollection<AdminLog>(logsQuery);
  
  const logs = useMemo(() => {
    if (!rawLogs) return [];
    if (!searchTerm) return rawLogs;
    const q = searchTerm.toLowerCase();
    return rawLogs.filter(log => 
        log.reason?.toLowerCase().includes(q) || 
        log.adminEmail?.toLowerCase().includes(q) || 
        log.targetUserId?.toLowerCase().includes(q)
    );
  }, [rawLogs, searchTerm]);

  return (
    <div className="space-y-6 animate-in fade-in duration-700 p-4 md:p-8 bg-slate-50 min-h-screen rounded-[2.5rem] shadow-2xl border border-white/20" dir="rtl">
      
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3 text-slate-900">
            <History className="h-8 w-8 text-primary" />
            ديوان العدالة والسجل القانوني
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-bold">المركز الموحد لتوثيق الحقيقة وتتبع الأثر الجنائي [Sterilized].</p>
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={(v) => updateUrlParams({ tab: v })} className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-14 bg-white border border-slate-200 p-1 rounded-xl shadow-sm mb-6">
          <TabsTrigger value="logs" className="font-black gap-2 text-sm data-[state=active]:bg-primary data-[state=active]:text-white">
            <Activity className="h-4 w-4" /> رادار الرقابة الجنائية
          </TabsTrigger>
          <TabsTrigger value="staff" className="font-black gap-2 text-sm data-[state=active]:bg-primary data-[state=active]:text-white">
            <Shield className="h-4 w-4" /> السجل المدني والوظيفي
          </TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="animate-in slide-in-from-bottom-2 duration-500 m-0">
          <Card className="border border-slate-200 shadow-sm overflow-hidden bg-white">
            <CardHeader className="bg-slate-50 border-b p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="text-right">
                    <CardTitle className="flex items-center justify-start gap-3 text-lg font-black text-slate-900">سجل القرارات السيادية</CardTitle>
                    <CardDescription className="text-xs font-bold text-slate-500">توثيق تاريخي جزيئي لكافة الإجراءات.</CardDescription>
                </div>
                
                <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm w-full md:w-auto">
                    <Filter className="h-4 w-4 text-primary mr-2" />
                    <Select value={categoryFilter} onValueChange={(v) => updateUrlParams({ cat: v })}>
                        <SelectTrigger className="w-full md:w-[220px] border-0 focus:ring-0 font-black text-xs h-9">
                            <SelectValue placeholder="توجيه التفتيش" />
                        </SelectTrigger>
                        <SelectContent align="end">
                            <SelectItem value="ALL" className="font-bold text-right">🌍 السجل العام</SelectItem>
                            <SelectItem value="FIELD_MGMT" className="font-black text-emerald-600 text-right">🛡️ إدارة الميدان</SelectItem>
                            <SelectItem value="FINANCE" className="font-black text-blue-600 text-right">🏦 المالية</SelectItem>
                            <SelectItem value="SECURITY" className="font-black text-slate-900 text-right">🔑 الأمان والبرمجة</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="p-4 border-b bg-slate-50/50 flex items-center gap-4">
                  <div className="flex-1 relative">
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input 
                        placeholder="بحث استخباري (UID, بريد, سبب)..." 
                        className="pr-10 h-11 bg-white border-slate-200 font-bold"
                        value={searchTerm}
                        onChange={(e) => updateUrlParams({ q: e.target.value })}
                      />
                  </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                    <TableHeader className="bg-slate-50 text-right">
                    <TableRow>
                        <TableHead className="w-[160px] py-4 text-right text-slate-600 font-black">نوع الإجراء</TableHead>
                        <TableHead className="text-right text-slate-600 font-black">الهدف</TableHead>
                        <TableHead className="text-right text-slate-600 font-black">السبب</TableHead>
                        <TableHead className="text-right text-slate-600 font-black">المنفذ</TableHead>
                        <TableHead className="text-right text-slate-600 font-black">التوقيت</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {isLoadingLogs ? (
                        [...Array(8)].map((_, i) => (
                            <TableRow key={i}><TableCell colSpan={5}><Skeleton className="h-10 w-full" /></TableCell></TableRow>
                        ))
                    ) : logs.length === 0 ? (
                        <TableRow><TableCell colSpan={5} className="text-center h-48 opacity-30 font-bold text-slate-900">لا توجد سجلات جنائية في هذا النطاق.</TableCell></TableRow>
                    ) : (
                        logs.map(log => (
                            <Dialog key={log.id}>
                                <DialogTrigger asChild>
                                    <TableRow className="cursor-pointer hover:bg-slate-50 group text-right border-slate-100">
                                        <TableCell>{getActionBadge(log)}</TableCell>
                                        <TableCell className="text-right">
                                            <span className="font-black text-xs text-slate-900">{log.targetUserId}</span>
                                        </TableCell>
                                        <TableCell className="text-xs font-bold text-slate-600 max-w-[200px] truncate">{log.reason}</TableCell>
                                        <TableCell className="text-right font-black text-[10px] text-primary">{log.adminEmail?.split('@')[0] || 'المسؤول'}</TableCell>
                                        <TableCell className="font-mono text-[10px] text-right text-slate-500">
                                            {formatDate(log.timestamp, 'd MMM, h:mm a', locale)}
                                        </TableCell>
                                    </TableRow>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl bg-white border-2 border-slate-200" dir="rtl">
                                    <DialogHeader className="text-right">
                                        <DialogTitle className="flex items-center gap-2 text-xl font-black text-slate-900">
                                            <ShieldAlert className="h-6 w-6 text-primary" /> تفاصيل القرار السيادي
                                        </DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-6 py-4 text-right">
                                        <div className="bg-primary/5 p-5 rounded-2xl border border-primary/20">
                                            <h4 className="text-xs font-black text-primary mb-2">الحيثيات الجنائية</h4>
                                            <p className="text-sm leading-relaxed font-bold text-slate-800">{log.reason}</p>
                                        </div>
                                        {log.snapshot && (
                                            <div className="bg-slate-900 p-5 rounded-2xl overflow-x-auto ltr shadow-inner">
                                                <pre className="text-[11px] text-emerald-400 font-mono">
                                                    {JSON.stringify(log.snapshot, null, 2)}
                                                </pre>
                                            </div>
                                        )}
                                    </div>
                                </DialogContent>
                            </Dialog>
                        ))
                    )}
                    </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff" className="animate-in zoom-in-95 duration-500 m-0">
          <StaffRegistryHub />
        </TabsContent>
      </Tabs>
    </div>
  );
}
