'use client';

import { useState, useCallback, useEffect } from 'react';
import { useFirestore, useFunctions } from '@/firebase';
import { collection, query, orderBy, limit, getDocs, doc, getDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Banknote, Scale, PlusCircle, 
  RefreshCw, TrendingUp, TrendingDown 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/lib/formatters';
import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';
import type { LedgerEntry, FinanceSummary } from '@/lib/data';
import { SovereignVaultDialog } from '@/components/admin/vault/sovereign-vault-dialog';
import { useUserProfile } from '@/hooks/use-user-profile';

/**
 * @page GeneralLedgerPage
 * @description THE REINFORCED SOVEREIGN LEDGER (STERILIZED - SCR-2026-014)
 * [SCR-2026-014]: Aligned with expanded FinanceSummary (totalIncome).
 * [SCR-2026-008]: Enforced Null-Safety for sovereignBalance.
 */
export default function GeneralLedgerPage() {
  const firestore = useFirestore();
  const functions = useFunctions();
  const { checkPermission } = useUserProfile();
  const { toast } = useToast();
  const locale = useLocale();

  const [summary, setSummary] = useState<FinanceSummary | null>(null);
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  
  // [SCR-2026-007]: Sovereign Initial State Alignment
  const [newEntry, setNewEntry] = useState<Partial<LedgerEntry>>({ 
    currency: 'JOD', 
    category: 'EXPENSE',
    status: 'pending' 
  });

  const canAddEntry = checkPermission('financeVault');

  const fetchFinancePulse = useCallback(async () => {
    if (!firestore) return;
    setIsLoading(true);
    try {
      const summaryRef = doc(firestore, 'finance_summary', 'JOD');
      const summarySnap = await getDoc(summaryRef);
      if (summarySnap.exists()) {
        const data = summarySnap.data();
        // [SCR-2026-014] Mapping merged semantic fields
        setSummary({ 
            id: summarySnap.id, 
            ...data,
            totalIncome: data.totalIncome || data.totalRevenue || 0 
        } as any);
      }

      const entriesQ = query(collection(firestore, 'central_ledger'), orderBy('createdAt', 'desc'), limit(100));
      const entriesSnap = await getDocs(entriesQ);
      setEntries(entriesSnap.docs.map(d => ({ id: d.id, ...d.data() } as LedgerEntry)));

    } catch (error) {
      console.error("[Ledger Artery] Pulse Loss:", error);
      toast({ variant: 'destructive', title: 'خطأ في الجلب', description: 'تعذر الاتصال بالخزينة المركزية.' });
    } finally {
      setIsLoading(false);
    }
  }, [firestore, toast]);

  useEffect(() => { fetchFinancePulse(); }, [fetchFinancePulse]);

  const executeVaultInference = useCallback(async (reason: string) => {
    if (!functions) return;
    setIsLoading(true);
    try {
        const addEntryFn = httpsCallable(functions, 'addManualLedgerEntry');
        await addEntryFn({ ...newEntry, constitutionalReason: reason });
        
        toast({ title: "تم التوثيق السيادي ✅" });
        setNewEntry({ currency: 'JOD', category: 'EXPENSE', status: 'pending' });
        await fetchFinancePulse();
    } catch (error: any) {
        toast({ variant: "destructive", title: "فشل الإنفاذ", description: error.message });
    } finally {
        setIsLoading(false);
    }
  }, [functions, newEntry, fetchFinancePulse, toast]);

  return (
    <div className="space-y-6 animate-in fade-in duration-700 p-2 md:p-4" dir="rtl">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3 text-slate-900">
            <Banknote className="h-8 w-8 text-primary" /> الخزينة والديوان
          </h1>
          <p className="text-muted-foreground text-sm mt-1">الرقابة المالية العليا بناءً على الاستحقاق الجزيئي [Sterilized].</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchFinancePulse} disabled={isLoading} className="font-bold">
                <RefreshCw className={isLoading ? "animate-spin h-4 w-4 ml-2" : "h-4 w-4 ml-2"} /> تحديث
            </Button>
            {canAddEntry && (
              <Button className="font-black gap-2 bg-slate-900 hover:bg-slate-800 text-white" onClick={() => setIsVaultOpen(true)}>
                  <PlusCircle className="h-5 w-5" /> إدراج قيد
              </Button>
            )}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-green-500 bg-green-50/30 shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-full"><TrendingUp className="h-5 w-5 text-green-600" /></div>
                <div>
                    <p className="text-[10px] font-black uppercase text-slate-500">إجمالي الإيرادات</p>
                    {/* [SCR-2026-014]: Safe Semantic Access */}
                    <h3 className="text-xl font-black text-slate-900">{(summary?.totalIncome ?? 0).toFixed(2)} <span className="text-xs">JOD</span></h3>
                </div>
            </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500 bg-red-50/30 shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-red-100 rounded-full"><TrendingDown className="h-5 w-5 text-red-600" /></div>
                <div>
                    <p className="text-[10px] font-black uppercase text-slate-500">إجمالي المصروفات</p>
                    <h3 className="text-xl font-black text-slate-900">{summary?.totalExpenses?.toFixed(2) || '0.00'} <span className="text-xs">JOD</span></h3>
                </div>
            </CardContent>
        </Card>
        
        {/* [SCR-2026-008]: Null-Safety Enforcement */}
        <Card className={`border-l-4 shadow-md ${(summary?.sovereignBalance ?? 0) < 0 ? 'border-l-destructive bg-destructive/5' : 'border-l-primary bg-primary/5'}`}>
            <CardContent className="p-4 flex items-center gap-4">
                <div className={`p-3 rounded-full ${(summary?.sovereignBalance ?? 0) < 0 ? 'bg-destructive/10' : 'bg-primary/10'}`}>
                    <Scale className={`h-5 w-5 ${(summary?.sovereignBalance ?? 0) < 0 ? 'text-destructive' : 'text-primary'}`} />
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase text-slate-600">الميزان السيادي</p>
                    <h3 className="text-2xl font-black text-slate-900">{(summary?.sovereignBalance ?? 0).toFixed(2)} <span className="text-xs">JOD</span></h3>
                </div>
            </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-xl overflow-hidden">
          <CardContent className="p-0">
              <Table>
                  <TableHeader className="bg-slate-50">
                      <TableRow>
                          <TableHead className="text-right py-4 font-black">التاريخ</TableHead>
                          <TableHead className="text-right font-black">التصنيف</TableHead>
                          <TableHead className="text-right font-black">المبلغ</TableHead>
                          <TableHead className="text-right font-black">البيان</TableHead>
                          <TableHead className="text-left font-black">الحالة</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {entries.map(entry => (
                          <TableRow key={entry.id} className="hover:bg-slate-50/50">
                              <TableCell className="text-[10px] font-mono opacity-60">{formatDate(entry.createdAt, 'dd/MM/yyyy HH:mm', locale)}</TableCell>
                              <TableCell>
                                  <Badge variant="outline" className={cn(
                                      "text-[9px] font-black px-2 py-0",
                                      entry.category === 'REVENUE' ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
                                  )}>{entry.category}</Badge>
                              </TableCell>
                              <TableCell className={cn("font-black", entry.type === 'debit' ? "text-red-600" : "text-green-600")}>
                                  {entry.type === 'debit' ? '-' : '+'}{entry.amount} {entry.currency}
                              </TableCell>
                              <TableCell className="text-xs font-bold text-slate-700">{entry.description}</TableCell>
                              <TableCell className="text-left">
                                  <Badge variant={entry.status === 'completed' ? 'default' : 'secondary'} className="text-[8px] uppercase">
                                      {entry.status}
                                  </Badge>
                              </TableCell>
                          </TableRow>
                      ))}
                  </TableBody>
              </Table>
          </CardContent>
      </Card>

      <SovereignVaultDialog 
        isOpen={isVaultOpen} 
        onOpenChange={setIsVaultOpen} 
        title="تأمين القيد المالي" 
        description="أنت على وشك إضافة قيد يدوي للخزينة المركزية."
        onVerified={executeVaultInference} 
      />
    </div>
  );
}
