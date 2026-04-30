'use client';

import { useState, useCallback, useEffect } from 'react';
import { useFunctions, useFirestore } from '@/firebase';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, CheckCircle, XCircle, Eye, RefreshCw, History, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/lib/formatters';
import type { TopupRequest } from '@/lib/data';
import { useLocale, useTranslations } from 'next-intl';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SovereignVaultDialog } from '@/components/admin/vault/sovereign-vault-dialog';

/**
 * @page AdminFinancePage
 * @description THE REINFORCED TREASURY (DIAMOND STERILIZED - SC-722)
 * [SC-722]: Eradicated Ghost Command. Fixed Lucide Import.
 * Unified Reject/Approve logic via Sovereign Vault (Protocol 30).
 */
export default function AdminFinancePage() {
  const firestore = useFirestore();
  const functions = useFunctions();
  const { toast } = useToast();
  const locale = useLocale();
  const tError = useTranslations('errorDictionary');
  const tCommon = useTranslations('common');
  
  const [requests, setRequests] = useState<TopupRequest[]>([]);
  const [history, setHistory] = useState<TopupRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [vaultOpen, setVaultOpen] = useState(false);
  const [vaultMode, setVaultMode] = useState<'APPROVE' | 'REJECT' | null>(null);
  const [activeRequest, setActiveRequest] = useState<TopupRequest | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchFinancialData = useCallback(async () => {
    if (!firestore) return;
    setIsLoading(true);
    try {
      const pendingQ = query(
        collection(firestore, 'topup_requests'),
        where('status', '==', 'PENDING'),
        orderBy('createdAt', 'desc')
      );
      const pendingSnap = await getDocs(pendingQ);
      setRequests(pendingSnap.docs.map(d => ({ id: d.id, ...d.data() } as TopupRequest)));

      const historyQ = query(
        collection(firestore, 'topup_requests'),
        where('status', 'in', ['APPROVED', 'REJECTED']),
        orderBy('processedAt', 'desc'),
        limit(20)
      );
      const historySnap = await getDocs(historyQ);
      setHistory(historySnap.docs.map(d => ({ id: d.id, ...d.data() } as TopupRequest)));
    } catch (e) {
      console.error("[Treasury Artery] Data fetch rupture:", e);
    } finally {
      setIsLoading(false);
    }
  }, [firestore]);

  useEffect(() => {
    fetchFinancialData();
  }, [fetchFinancialData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchFinancialData();
    setIsRefreshing(false);
    toast({ title: "تم تحديث النبض المالي ✅" });
  };

  const handleVaultAction = useCallback((request: TopupRequest, mode: 'APPROVE' | 'REJECT') => {
    setActiveRequest(request);
    setVaultMode(mode);
    setVaultOpen(true);
  }, []);

  const executeVaultInference = useCallback(async (reason: string) => {
    if (!functions || !activeRequest || !vaultMode) return;
    
    const requestId = activeRequest.id;
    const mode = vaultMode;
    setProcessingId(requestId);

    try {
        if (mode === 'APPROVE') {
            const approveFn = httpsCallable(functions, 'approveTopup');
            await approveFn({ requestId, adminNote: reason });
            toast({ title: tCommon('success'), description: "تم تفعيل الاشتراك وتوثيق السند." });
        } else {
            const rejectFn = httpsCallable(functions, 'rejectTopup');
            await rejectFn({ requestId, reason });
            toast({ title: tCommon('success'), description: "تم رفض الطلب وحفظ السبب جنائياً." });
        }
        await fetchFinancialData();
    } catch (error: any) {
        toast({ 
            variant: "destructive", 
            title: tCommon('error'), 
            description: tError(error.message || 'DEFAULT') 
        });
    } finally {
        setProcessingId(null);
        setActiveRequest(null);
        setVaultMode(null);
    }
  }, [functions, activeRequest, vaultMode, tCommon, tError, toast, fetchFinancialData]);

  return (
    <div className="p-4 md:p-8 space-y-6 bg-slate-50 min-h-screen" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">الخزينة المركزية</h1>
            <p className="text-slate-500 mt-1 text-sm">إدارة التدفقات المالية السيادية [Forensic Sterilization - SC-722].</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing || isLoading} className="gap-2 font-bold shadow-sm">
            {isRefreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            تحديث البيانات
        </Button>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mb-6 bg-white border shadow-sm">
            <TabsTrigger value="pending" className="font-bold gap-2 data-[state=active]:bg-primary data-[state=active]:text-white">
                <Clock className="h-4 w-4" />
                طلبات معلقة
                {requests.length > 0 && <Badge variant="destructive" className="h-5 px-1.5 mr-1">{requests.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="history" className="font-bold gap-2 data-[state=active]:bg-primary data-[state=active]:text-white">
                <History className="h-4 w-4" />
                سجل الاعتمادات
            </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="animate-in fade-in duration-500">
            <Card className="border-0 shadow-md">
                <CardHeader className="bg-white border-b pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                        ⏳ طلبات قيد المراجعة الفنية
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="p-12 text-center text-muted-foreground">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
                            جاري فحص السجلات...
                        </div>
                    ) : requests.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50">
                                    <TableHead className="text-right">الناقل</TableHead>
                                    <TableHead className="text-right">المبلغ</TableHead>
                                    <TableHead className="text-right">الطريقة</TableHead>
                                    <TableHead className="text-right">التاريخ</TableHead>
                                    <TableHead className="text-center">الإثبات</TableHead>
                                    <TableHead className="text-center">إجراء</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {requests.map((req) => (
                                    <TableRow key={req.id} className="hover:bg-slate-50/50">
                                        <TableCell className="font-black text-slate-800">{req.carrierName}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-base px-3 py-1 font-bold border-green-200 bg-green-50 text-green-700">
                                                {req.amount} {req.currency}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-xs font-bold text-muted-foreground">{req.method}</TableCell>
                                        <TableCell className="text-slate-500 text-[10px] font-mono">
                                        {req.createdAt?.toDate
                                            ? formatDate(req.createdAt.toDate(), 'd MMM yyyy, h:mm a', locale)
                                            : 'الآن'}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 gap-1">
                                                        <Eye className="w-4 h-4" /> معاينة
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-2xl p-0 overflow-hidden bg-black border-0">
                                                    <img 
                                                        src={req.proofImageUrl} 
                                                        alt="Receipt" 
                                                        className="w-full h-auto max-h-[80vh] object-contain" 
                                                    />
                                                </DialogContent>
                                            </Dialog>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex justify-center gap-2">
                                                <Button 
                                                    size="sm" 
                                                    className="bg-green-600 hover:bg-green-700 text-white min-w-[90px] shadow-sm"
                                                    onClick={() => handleVaultAction(req, 'APPROVE')}
                                                    disabled={!!processingId}
                                                >
                                                    {processingId === req.id && vaultMode === 'APPROVE' ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                                        <>
                                                            <CheckCircle className="w-4 h-4 ml-2" /> موافقة
                                                        </>
                                                    )}
                                                </Button>
                                                <Button 
                                                    size="sm" 
                                                    variant="outline" 
                                                    className="text-red-600 border-red-200 hover:bg-red-50"
                                                    onClick={() => handleVaultAction(req, 'REJECT')}
                                                    disabled={!!processingId}
                                                >
                                                    {processingId === req.id && vaultMode === 'REJECT' ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <>
                                                            <XCircle className="w-4 h-4" />
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="p-12 text-center bg-white">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-slate-300" />
                            </div>
                            <h3 className="text-lg font-medium text-slate-900">لا توجد طلبات معلقة</h3>
                            <p className="text-slate-500">الخزينة مستقرة، والنبض الميداني ممتاز.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="history" className="animate-in fade-in duration-500">
            <Card className="border-0 shadow-md">
                <CardHeader className="bg-white border-b pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-muted-foreground">
                        📑 السجل المالي التاريخي (Ledger)
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50">
                                <TableHead className="text-right">الناقل</TableHead>
                                <TableHead className="text-right">المبلغ</TableHead>
                                <TableHead className="text-right">الحالة</TableHead>
                                <TableHead className="text-right">توقيت المعالجة</TableHead>
                                <TableHead className="text-right">السبب/الملاحظات</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {history.map((h) => (
                                <TableRow key={h.id} className="opacity-80">
                                    <TableCell className="font-bold text-slate-700">{h.carrierName}</TableCell>
                                    <TableCell className="font-mono">{h.amount} {h.currency}</TableCell>
                                    <TableCell>
                                        <Badge variant={h.status === 'APPROVED' ? 'default' : 'destructive'} className="h-5 text-[10px] px-2">
                                            {h.status === 'APPROVED' ? 'معتمد ✅' : 'مرفوض ❌'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-[10px] font-mono text-slate-500">
                                        {h.processedAt?.toDate ? formatDate(h.processedAt.toDate(), 'd MMM yyyy, h:mm a', locale) : '-'}
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground italic max-w-[200px] truncate">
                                        {h.rejectionReason || h.processedBy || 'معالجة نظامية'}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {history.length === 0 && !isLoading && (
                                <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground">السجل التاريخي فارغ.</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>

      {activeRequest && (
          <SovereignVaultDialog 
            isOpen={vaultOpen}
            onOpenChange={setVaultOpen}
            title={vaultMode === 'APPROVE' ? "اعتماد تدفق مالي" : "رفض تدفق مالي"}
            description={
                vaultMode === 'APPROVE' 
                ? `أنت على وشك تفعيل رصيد للناقل ${activeRequest.carrierName} بمبلغ ${activeRequest.amount} ${activeRequest.currency}.`
                : `أنت على وشك رفض طلب الشحن المقدم من ${activeRequest.carrierName}.`
            }
            onVerified={executeVaultInference}
          />
      )}
    </div>
  );
}
