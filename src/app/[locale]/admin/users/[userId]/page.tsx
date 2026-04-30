'use client';

import { useFirestore, useFunctions, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection, query, where, orderBy } from 'firebase/firestore';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Calendar, Activity, FileText, Ban, DollarSign, ShieldCheck, Clock } from 'lucide-react';
import { UserRowActions } from '@/components/admin/users/user-row-actions';
import { httpsCallable } from 'firebase/functions';
import { useToast } from '@/hooks/use-toast';
import type { UserProfile } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useTranslations, useLocale } from 'next-intl';
import { formatDate } from '@/lib/formatters';

/**
 * @page UserDetailPage
 * @description THE REINFORCED SOVEREIGN AUDIT (SC-806 - V2.6)
 * [SC-806 V2.6]: Fixed Stability and useMemoFirebase enforcement. Purged external hooks.
 */
export default function UserDetailPage() {
  const { userId } = useParams();
  const router = useRouter();
  const firestore = useFirestore();
  const functions = useFunctions();
  const { toast } = useToast();
  const locale = useLocale();
  const tError = useTranslations('errorDictionary');
  const tCommon = useTranslations('common');

  // 🛰️ ARTERIAL PULSE: Memoized Identity & Audit Logs
  const userDocRef = useMemoFirebase(() => 
    firestore && userId ? doc(firestore, 'users', userId as string) : null
  , [firestore, userId]);

  const logsQuery = useMemoFirebase(() => 
    firestore && userId ? query(
      collection(firestore, 'admin_logs'), 
      where('targetUserId', '==', userId), 
      orderBy('timestamp', 'desc')
    ) : null
  , [firestore, userId]);

  const { data: userData, isLoading: loadingUser } = useDoc<UserProfile>(userDocRef);
  const { data: logs, isLoading: loadingLogs } = useCollection(logsQuery);

  const handleAction = async (action: any, id: string) => {
      if (!functions) return;
      const freezeType = action === 'finance_freeze' ? 'financial' : 'security';
      const reason = prompt(`تأكيد الإجراء السيادي:\nيرجى كتابة سبب الإجراء لتوثيق في السجل:`);
      if (reason === null) return;

      try {
          const toggleFn = httpsCallable(functions, 'toggleUserFreezeStatus');
          await toggleFn({ targetUserId: id, freezeType, reason });
          toast({ title: tCommon('success') });
      } catch (error: any) {
          toast({ 
              variant: "destructive", 
              title: tCommon('error'), 
              description: tError(error.message || 'DEFAULT') 
          });
      }
  };

  if (loadingUser) return <div className="p-8"><Skeleton className="h-64 w-full" /></div>;
  if (!userData) return <div className="p-8 text-center text-red-500">مستخدم غير موجود في السجل.</div>;

  const isTrialActive = userData.trialEndsAt && (
    typeof userData.trialEndsAt === 'number' ? userData.trialEndsAt > Date.now() : 
    userData.trialEndsAt.toDate ? userData.trialEndsAt.toDate() > new Date() : false
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500" dir="rtl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()} className="font-bold">
          <ArrowRight className="w-4 h-4 ml-2" /> عودة للقائمة
        </Button>
        <h1 className="text-2xl font-black tracking-tight">ملف المنتسب الجنائي والوظيفي</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card className={cn(
              "border-t-4 shadow-md transition-colors",
              userData.isDeactivated ? "border-t-destructive" : userData.isFinancialFrozen ? "border-t-orange-500" : "border-t-primary"
          )}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>الهوية الرقمية</span>
                <Badge variant={userData.isDeactivated ? "destructive" : "outline"}>{userData.role}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center py-4">
                <div className="relative mb-3">
                    <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center text-3xl border-2 border-dashed border-slate-300 overflow-hidden">
                    {userData.photoURL ? <img src={userData.photoURL} alt="Avatar" className="w-full h-full object-cover" /> : "👤"}
                    </div>
                    {userData.isDeactivated && (
                        <div className="absolute -bottom-1 -right-1 bg-destructive text-white p-1.5 rounded-full shadow-lg border-2 border-white">
                            <Ban className="h-4 w-4" />
                        </div>
                    )}
                </div>
                <h3 className="text-xl font-bold">{userData.firstName} {userData.lastName}</h3>
                <p className="text-slate-500 font-mono text-sm">{userId}</p>
              </div>
              
              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">الهاتف:</span>
                  <span className="font-mono font-bold" dir="ltr">{userData.phoneNumber || '-'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">البريد:</span>
                  <span className="font-mono text-xs truncate max-w-[150px]">{userData.email}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">الدولة:</span>
                  <span className="font-bold">{userData.operatingCountry || 'غير محدد'}</span>
                </div>
              </div>

              <div className="pt-4 border-t flex justify-center">
                 <UserRowActions 
                    userId={userId as string}
                    isFinancialFrozen={!!userData.isFinancialFrozen} 
                    isSecurityFrozen={!!userData.isDeactivated}
                    onAction={handleAction}
                 />
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardHeader><CardTitle className="text-sm font-bold">المؤشرات المالية والسماح</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-2 bg-background rounded border border-dashed">
                    <span className="text-xs text-slate-500">الحالة المالية:</span>
                    {userData.isDeactivated ? (
                        <Badge variant="destructive">مطرود (Banned)</Badge>
                    ) : userData.isFinancialFrozen ? (
                        <Badge className="bg-orange-500 text-white">مجمد مالياً</Badge>
                    ) : isTrialActive ? (
                        <Badge variant="default" className="bg-green-600 animate-pulse">فترة سماح نشطة</Badge>
                    ) : (
                        <Badge variant="default" className="bg-green-600">نشط وصالح</Badge>
                    )}
                </div>
                
                {userData.trialEndsAt && (
                    <div className="flex justify-between items-center px-2 text-xs">
                        <span className="text-slate-500 flex items-center gap-1"><Clock className="h-3 w-3"/> انتهاء السماح:</span>
                        <span className="font-bold">{formatDate(userData.trialEndsAt, 'dd/MM/yyyy', locale)}</span>
                    </div>
                )}

                <div className="flex justify-between items-center px-2 border-t pt-3">
                    <span className="text-sm text-slate-500">الرصيد المتاح:</span>
                    <span className="font-black text-lg text-primary">{userData.walletBalance || 0} د.أ</span>
                </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="h-full shadow-md">
            <CardHeader className="bg-slate-50/50 border-b">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                <div>
                    <CardTitle className="font-black">سجل الرقابة والعدالة (Audit Log)</CardTitle>
                    <CardDescription>تتبع كافة الإجراءات السيادية المتخذة ضد الهوية الرقمية.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
                {loadingLogs ? <Skeleton className="h-40 w-full" /> : 
                 !logs || logs.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                        <FileText className="w-12 h-12 mx-auto mb-2 opacity-20" />
                        <p className="font-bold">لا توجد سجلات جنائية أو إدارية لهذا المستخدم.</p>
                    </div>
                 ) : (
                    <div className="relative border-r border-slate-200 mr-3 space-y-8">
                        {logs.map((log) => {
                            const isFreeze = log.action === 'FREEZE';
                            const isSecurity = log.freezeType === 'security';
                            
                            return (
                                <div key={log.id} className="relative mr-6">
                                    <span className={cn(
                                        "absolute -right-[31px] flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-white",
                                        isFreeze ? (isSecurity ? "bg-red-600" : "bg-orange-500") : "bg-green-500"
                                    )}>
                                        {isFreeze ? (isSecurity ? <Ban className="h-2 w-2 text-white" /> : <DollarSign className="h-2 w-2 text-white" />) : <ShieldCheck className="h-2 w-2 text-white" />}
                                    </span>
                                    <div className="flex flex-col gap-1 rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow bg-white">
                                        <div className="flex justify-between items-start">
                                            <div className="flex flex-col gap-1">
                                                <Badge variant={isFreeze ? "destructive" : "outline"} className={cn(
                                                    "w-fit font-bold",
                                                    !isFreeze && "text-green-700 border-green-200 bg-green-50",
                                                    isFreeze && !isSecurity && "bg-orange-500 border-orange-600"
                                                )}>
                                                    {log.action} ({log.freezeType === 'security' ? 'أمني' : 'مالي'})
                                                </Badge>
                                            </div>
                                            <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {formatDate(log.timestamp, 'dd/MM/yyyy HH:mm', locale)}
                                            </span>
                                        </div>
                                        <div className="mt-2 space-y-1">
                                            <p className="text-sm font-bold text-slate-800">
                                                السبب: {log.reason || 'إجراء سيادي غير مسبب'}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground font-mono">
                                                المنفذ: {log.adminEmail || log.adminId}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                 )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
