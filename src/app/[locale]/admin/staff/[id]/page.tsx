'use client';

import { useState, useCallback, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDoc, useFirestore, useFunctions, useMemoFirebase } from '@/firebase';
import { doc, collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { useUserProfile } from '@/hooks/use-user-profile';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowRight, User, DollarSign, ShieldCheck, Fingerprint, Mail, 
  Phone, Calendar, Loader2, Clock, History, CheckCircle2, RefreshCw, Power
} from 'lucide-react';
import { type Staff, PERMISSION_MATRIX } from '@/types/staff';
import { type StaffLedgerEntry, type StaffTimesheet } from '@/lib/data';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/formatters';
import { useLocale } from 'next-intl';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LocalErrorBoundary } from '@/components/ui/local-error-boundary';
import { StaffService } from '@/services/staff-service';
import { useToast } from '@/hooks/use-toast';
import { SovereignVaultDialog } from '@/components/admin/vault/sovereign-vault-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/**
 * @page StaffProfileDetail
 * @description THE REINFORCED SOVEREIGN OPS HUB (STERILIZED - SC-806 V4.9 - SEALED)
 * [SC-806 V4.9]: Judicial HR Integration. PIN-protected financial approvals.
 * Protocol 16: Diamond Sterilization. Protocol 88: Zero redundant listeners.
 */
export default function StaffProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const locale = useLocale();
  const firestore = useFirestore();
  const functions = useFunctions();
  const { checkPermission } = useUserProfile();
  const { toast } = useToast();

  const [vaultOpen, setVaultOpen] = useState(false);
  const [vaultAction, setVaultAction] = useState<{ id: string, type: 'timesheet' | 'advance' | 'status' } | null>(null);
  
  const [ledgerEntries, setLedgerEntries] = useState<StaffLedgerEntry[]>([]);
  const [timesheetEntries, setTimesheetEntries] = useState<StaffTimesheet[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [logHoursOpen, setLogHoursOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const staffRef = useMemoFirebase(() => {
    if (!firestore || !id) return null;
    return doc(firestore, 'staff_registry', id as string);
  }, [firestore, id]);

  const { data: staff, isLoading: isProfileLoading } = useDoc<Staff>(staffRef);

  const fetchStaffFinancialPulse = useCallback(async () => {
    if (!firestore || !id) return;
    setIsDataLoading(true);
    try {
      const [ledger, timesheets] = await Promise.all([
        StaffService.getStaffLedger(firestore, id as string),
        getDocs(query(collection(firestore, 'staff_timesheets'), where('staffId', '==', id), orderBy('createdAt', 'desc'), limit(20)))
      ]);
      
      setLedgerEntries(ledger as StaffLedgerEntry[]);
      setTimesheetEntries((timesheets as any).docs.map((d: any) => ({ id: d.id, ...d.data() } as StaffTimesheet)));
    } catch (e) {
      console.error("[Staff Artery] Data retrieval rupture:", e);
    } finally {
      setIsDataLoading(false);
    }
  }, [firestore, id]);

  useEffect(() => {
    fetchStaffFinancialPulse();
  }, [fetchStaffFinancialPulse]);

  const handleInitiateVault = useCallback((actionId: string, type: 'timesheet' | 'advance' | 'status') => {
    setVaultAction({ id: actionId, type });
    setVaultOpen(true);
  }, []);

  const executeVaultInference = useCallback(async (reason: string) => {
    if (!functions || !vaultAction || !staff) return;
    setIsProcessing(true);
    try {
      if (vaultAction.type === 'status') {
          await StaffService.toggleStaffStatus(functions, id as string, staff.isActive, reason);
          toast({ title: staff.isActive ? "تم تجميد الكادر ❄️" : "تم التفعيل ✅" });
      } else {
          await StaffService.approveAccrual(functions, vaultAction.id, vaultAction.type, reason);
          toast({ title: "تم الاعتماد السيادي ✅", description: "تم تحديث موازين الكادر والترحيل لدفتر الأستاذ." });
      }
      await fetchStaffFinancialPulse(); 
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'فشل العملية', description: e.message });
    } finally {
      setIsProcessing(false);
      setVaultAction(null);
    }
  }, [functions, vaultAction, staff, id, toast, fetchStaffFinancialPulse]);

  const handleLogTimesheet = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!functions) return;
    const formData = new FormData(e.currentTarget);
    setIsProcessing(true);
    try {
      await StaffService.logTimesheet(functions, {
        staffId: id as string,
        date: formData.get('date') as string,
        hours: Number(formData.get('hours')),
        task: formData.get('task') as string
      });
      toast({ title: "تم التوثيق بنجاح ✓" });
      setLogHoursOpen(false);
      await fetchStaffFinancialPulse();
    } catch (err: any) { 
      toast({ variant: 'destructive', title: 'فشل التوثيق', description: err.message }); 
    } finally { 
      setIsProcessing(false); 
    }
  }, [functions, id, toast, fetchStaffFinancialPulse]);

  if (isProfileLoading) return <div className="flex h-[60vh] items-center justify-center opacity-30"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  if (!staff) return <div className="p-8 text-center font-bold">عذراً، لم يتم العثور على ملف هذا الكادر.</div>;

  const canManageSensitive = checkPermission('securityAdmin');

  return (
    <div className="space-y-6 animate-in fade-in duration-500 p-2 md:p-4" dir="rtl">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => router.back()} className="rounded-full shadow-sm">
                <ArrowRight className="h-4 w-4" />
            </Button>
            <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900">{staff.fullName}</h1>
                <p className="text-xs text-muted-foreground uppercase font-bold">{staff.role} • {staff.paymentSystem === 'monthly' ? 'تعاقد شهري' : 'نظام الساعات'}</p>
            </div>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchStaffFinancialPulse} disabled={isDataLoading} className="font-bold">
                <RefreshCw className={cn("h-4 w-4 ml-2", isDataLoading && "animate-spin")} /> تحديث الموازين
            </Button>
            <Button 
                variant={staff.isActive ? "destructive" : "default"} 
                size="sm" 
                onClick={() => handleInitiateVault(id as string, 'status')}
                className="font-black gap-2"
            >
                <Power className="h-4 w-4" /> {staff.isActive ? "تجميد الكادر" : "تفعيل الكادر"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setLogHoursOpen(true)} className="font-bold border-primary/20">
                <Clock className="ml-2 h-4 w-4 text-primary" /> تسجيل دوام
            </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-primary/10 overflow-hidden shadow-md">
            <div className={cn("h-2", staff.isActive ? "bg-green-500" : "bg-destructive")} />
            <CardContent className="pt-6 text-center space-y-4">
              <div className="mx-auto w-20 h-20 bg-muted rounded-full flex items-center justify-center border-2 border-dashed border-primary/20 shadow-inner">
                <User className="h-10 w-10 text-primary/40" />
              </div>
              <div>
                <Badge variant={staff.isActive ? "default" : "destructive"} className="h-6 font-black">{staff.isActive ? "نشط وصالح" : "مجمد إدارياً"}</Badge>
                <p className="text-[10px] text-muted-foreground font-mono mt-1 opacity-50 uppercase">{staff.workType}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Tabs defaultValue="financials" className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-12 bg-muted/50 border p-1 rounded-xl shadow-inner">
              <TabsTrigger value="financials" className="font-bold gap-2"><DollarSign className="h-4 w-4" /> الخزينة والمستحقات</TabsTrigger>
              <TabsTrigger value="identity" className="font-bold gap-2"><Fingerprint className="h-4 w-4" /> ملف الهوية</TabsTrigger>
              <TabsTrigger value="permissions" className="font-bold gap-2"><ShieldCheck className="h-4 w-4" /> الصلاحيات</TabsTrigger>
            </TabsList>

            <TabsContent value="financials" className="mt-6 animate-in slide-in-from-bottom-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-primary/5 border-primary/20 shadow-sm">
                    <CardContent className="p-4">
                        <p className="text-[10px] font-black text-muted-foreground mb-1 uppercase tracking-widest">المستحق الصافي</p>
                        <h3 className="text-2xl font-black text-slate-900">{staff.currentBalance?.toFixed(2) || '0.00'} <span className="text-xs">{staff.currency}</span></h3>
                    </CardContent>
                </Card>
                <Card className="bg-blue-50/50 border-blue-100 shadow-sm">
                    <CardContent className="p-4">
                        <p className="text-[10px] font-black text-blue-600 mb-1 uppercase tracking-widest">ساعات معلقة</p>
                        <h3 className="text-2xl font-black text-blue-900">{staff.pendingHours || 0} <span className="text-xs">ساعة</span></h3>
                    </CardContent>
                </Card>
                <Card className="bg-red-50/50 border-red-100 shadow-sm">
                    <CardContent className="p-4">
                        <p className="text-[10px] font-black text-red-600 mb-1 uppercase tracking-widest">إجمالي السلفيات</p>
                        <h3 className="text-2xl font-black text-red-900">{staff.advancesBalance?.toFixed(2) || '0.00'} <span className="text-xs">{staff.currency}</span></h3>
                    </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <LocalErrorBoundary fallbackTitle="تعثر محرك الدوام">
                    <Card className="border-dashed">
                        <CardHeader className="bg-muted/30 border-b pb-3"><CardTitle className="text-sm font-black flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> دوام بانتظار الاعتماد</CardTitle></CardHeader>
                        <CardContent className="p-0">
                            {isDataLoading ? <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto h-4 w-4" /></div> : (
                                <Table>
                                    <TableBody>
                                        {timesheetEntries.filter(t => t.status === 'pending').map(ts => (
                                            <TableRow key={ts.id}>
                                                <TableCell className="py-2"><p className="text-[10px] font-bold">{ts.date}</p><p className="text-[9px] text-muted-foreground truncate max-w-[100px]">{ts.task}</p></TableCell>
                                                <TableCell className="font-mono font-bold text-xs">{ts.hours} س</TableCell>
                                                <TableCell className="text-left"><Button size="sm" variant="ghost" onClick={() => handleInitiateVault(ts.id, 'timesheet')} className="text-green-600 h-7 text-[10px] font-black">اعتماد ✓</Button></TableCell>
                                            </TableRow>
                                        ))}
                                        {timesheetEntries.filter(t => t.status === 'pending').length === 0 && <TableRow><TableCell className="text-center py-8 text-[10px] text-muted-foreground opacity-50">لا يوجد دوام معلق.</TableCell></TableRow>}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </LocalErrorBoundary>

                <LocalErrorBoundary fallbackTitle="تعثر سجل السندات">
                    <Card className="border-dashed">
                        <CardHeader className="bg-muted/30 border-b pb-3"><CardTitle className="text-sm font-black flex items-center gap-2"><History className="h-4 w-4" /> التاريخ المالي المعتمد</CardTitle></CardHeader>
                        <CardContent className="p-0">
                            {isDataLoading ? <div className="p-12 text-center"><Loader2 className="animate-spin mx-auto h-6 w-6" /></div> : (
                                <Table>
                                    <TableBody>
                                        {ledgerEntries.slice(0, 5).map((entry) => (
                                            <TableRow key={entry.id}>
                                                <TableCell className="text-[10px] font-bold uppercase">{entry.type}</TableCell>
                                                <TableCell className="text-[10px] font-black">{entry.amount} {entry.currency}</TableCell>
                                                <TableCell className="text-left"><Badge variant="outline" className="text-[8px] h-4 uppercase">{entry.status}</Badge></TableCell>
                                            </TableRow>
                                        ))}
                                        {ledgerEntries.length === 0 && <TableRow><TableCell className="text-center py-8 text-xs opacity-30">لا توجد سجلات مالية.</TableCell></TableRow>}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </LocalErrorBoundary>
              </div>
            </TabsContent>

            <TabsContent value="identity" className="mt-6 space-y-6">
                <Card className="shadow-sm">
                    <CardHeader><CardTitle className="text-lg flex items-center gap-2"><User className="h-5 w-5 text-primary" /> البيانات الشخصية</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex justify-between border-b pb-2"><span className="text-muted-foreground text-sm">الرقم الوطني</span><span className="font-bold">{canManageSensitive ? staff.nationalId : `******${staff.nationalId?.slice(-4)}`}</span></div>
                            <div className="flex justify-between border-b pb-2"><span className="text-muted-foreground text-sm">البريد السيادي</span><span className="font-mono text-xs">{staff.email}</span></div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between border-b pb-2"><span className="text-muted-foreground text-sm">الهاتف</span><span className="font-mono">{staff.phoneNumber || "غير مسجل"}</span></div>
                            <div className="flex justify-between border-b pb-2"><span className="text-muted-foreground text-sm">تاريخ التجنيد</span><span className="font-bold text-sm">{formatDate(staff.createdAt, 'dd MMMM yyyy', locale)}</span></div>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="permissions" className="mt-6">
                <Card className="shadow-sm">
                    <CardHeader><CardTitle className="text-lg flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" /> مصفوفة الصلاحيات</CardTitle></CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {PERMISSION_MATRIX.map((perm) => {
                                const hasPerm = (staff.permissions as any)[perm.id];
                                return (
                                    <div key={perm.id} className={cn("flex items-center gap-3 p-3 rounded-xl border transition-all", hasPerm ? "bg-primary/5 border-primary/20" : "bg-muted/20 opacity-40 grayscale")}>
                                        <perm.icon className={cn("h-4 w-4", hasPerm ? "text-primary" : "text-muted-foreground")} />
                                        <div className="flex-1"><p className="text-xs font-bold">{perm.label}</p></div>
                                        {hasPerm && <CheckCircle2 className="h-4 w-4 text-primary" />}
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <SovereignVaultDialog 
        isOpen={vaultOpen} 
        onOpenChange={setVaultOpen} 
        title="بصمة الوصول المالي والوظيفي" 
        description={
            vaultAction?.type === 'status' 
            ? `أنت على وشك ${staff.isActive ? 'تجميد' : 'تفعيل'} الكادر ${staff.fullName} في كافة مفاصل النظام.`
            : vaultAction?.type === 'timesheet' 
            ? "أنت على وشك اعتماد ساعات دوام وتحويلها لمستحقات نقدية وترحيلها للخزينة." 
            : "أنت على وشك الموافقة على صرف سلفة مالية فورية من الخزينة."
        }
        onVerified={executeVaultInference} 
      />

      <Dialog open={logHoursOpen} onOpenChange={setLogHoursOpen}>
          <DialogContent className="sm:max-w-md" dir="rtl">
              <DialogHeader><DialogTitle className="text-xl font-black">توثيق ساعات عمل</DialogTitle></DialogHeader>
              <form onSubmit={handleLogTimesheet} className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>التاريخ</Label><Input type="date" name="date" required defaultValue={new Date().toISOString().split('T')[0]} /></div>
                      <div className="space-y-2"><Label>الساعات</Label><Input type="number" name="hours" required placeholder="0" /></div>
                  </div>
                  <div className="space-y-2"><Label>المهمة المنجزة</Label><Input name="task" required placeholder="مثال: مراقبة ميدانية لرحلات عمان" /></div>
                  <DialogFooter><Button type="submit" className="w-full font-bold" disabled={isProcessing}>{isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : "إرسال للاعتماد"}</Button></DialogFooter>
              </form>
          </DialogContent>
      </Dialog>
    </div>
  );
}