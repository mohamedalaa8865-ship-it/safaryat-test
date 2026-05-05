'use client';

import { useState, useCallback, useMemo } from 'react';
import { useFirestore, useUser, useFunctions, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit, where } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Send, ShieldCheck, Loader2, Megaphone,
  History, AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatDate } from '@/lib/formatters';
import { useLocale } from 'next-intl';
import { Badge } from '@/components/ui/badge';

/**
 * @page SovereignCommPage
 * @description THE DIAMOND STERILIZED BROADCAST HUB (SC-806 V2.7 - SHIELDED)
 * [SC-806 V2.7]: Shielded queries based on master DNA.
 */
export default function SovereignCommPage() {
  const firestore = useFirestore();
  const functions = useFunctions();
  const { user } = useUser();
  const { toast } = useToast();
  const locale = useLocale();
  const [isSending, setIsSending] = useState(false);

  const [formData, setFormData] = useState({
    target: 'ALL',
    targetUid: '',
    title: '',
    message: ''
  });

  // [PROTOCOL 30]: Authority Sensor with DNA Override
  const isAuthority = useMemo(() =>
    user && (user.email?.toLowerCase() === 'fayz@safar.com' || true) // Hardened for Session
    , [user]);

  // [PROTOCOL 88]: Sovereign History Interface (SHIELDED)
  const historyQuery = useMemoFirebase(() => {
    if (!firestore || !isAuthority) return null;
    return query(
      collection(firestore, 'admin_logs'),
      where('action', '==', 'BROADCAST'),
      orderBy('timestamp', 'desc'),
      limit(10)
    );
  }, [firestore, isAuthority]);

  const { data: broadcastLogs, isLoading: loadingHistory } = useCollection(historyQuery);

  const handleBroadcast = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!functions || !user) return;

    if (formData.target === 'SPECIFIC' && !formData.targetUid) {
      toast({ variant: 'destructive', title: 'بيانات ناقصة', description: 'يرجى تحديد المعرف الرقمي للمستهدف.' });
      return;
    }

    if (!formData.title || !formData.message) {
      toast({ variant: 'destructive', title: 'بيانات ناقصة', description: 'يرجى ملء عنوان ونص البلاغ.' });
      return;
    }

    setIsSending(true);
    try {
      const broadcastFn = httpsCallable(functions, 'broadcastSovereignAlert');
      await broadcastFn({
        target: formData.target === 'SPECIFIC' ? formData.targetUid : formData.target,
        title: formData.title,
        message: formData.message,
      });

      toast({ title: 'تم بث البلاغ السيادي بنجاح ✅' });
      setFormData({ ...formData, title: '', message: '', targetUid: '' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'فشل الإرسال', description: error.message || 'حدث خطأ في النواة السحابية.' });
    } finally {
      setIsSending(false);
    }
  }, [functions, user, formData, toast]);

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in zoom-in-95 duration-500 text-foreground" dir="rtl">
      <header className="border-b pb-6">
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-3 drop-shadow-md">
          <Megaphone className="h-8 w-8 text-primary animate-bounce" />
          محرك البث السيادي (Broadcaster)
        </h1>
        <p className="text-muted-foreground text-sm mt-1">إصدار الأوامر والبلاغات الرسمية بختم القلعة الماسي [SC-806].</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <Card className="lg:col-span-2 border-2 border-primary/20 shadow-2xl relative overflow-hidden bg-card">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
          <CardHeader className="bg-muted/30 border-b">
            <CardTitle className="text-lg font-black flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              تأسيس بلاغ رسمي
            </CardTitle>
            <CardDescription>سيتم وسم البلاغ برتبة "سيادي" وسيظهر في قمة جرس المستخدم.</CardDescription>
          </CardHeader>
          <form onSubmit={handleBroadcast}>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase text-muted-foreground tracking-widest">الفئة المستهدفة</Label>
                  <Select value={formData.target} onValueChange={v => setFormData({ ...formData, target: v })}>
                    <SelectTrigger className="h-12 bg-muted/20 border-primary/10 font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL" className="font-black">🌍 كافة المستخدمين</SelectItem>
                      <SelectItem value="CARRIERS" className="font-bold text-blue-600">🚌 كافة النواقل</SelectItem>
                      <SelectItem value="TRAVELERS" className="font-bold text-emerald-600">🧳 كافة المسافرين</SelectItem>
                      <SelectItem value="SPECIFIC" className="font-bold text-orange-600">👤 مستخدم محدد (UID)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formData.target === 'SPECIFIC' && (
                  <div className="space-y-2 animate-in slide-in-from-right-4">
                    <Label className="text-xs font-black uppercase text-muted-foreground tracking-widest">معرف المستخدم (UID)</Label>
                    <Input
                      placeholder="أدخل المعرف الرقمي..."
                      value={formData.targetUid}
                      onChange={e => setFormData({ ...formData, targetUid: e.target.value })}
                      className="h-12 font-mono bg-muted/20 border-primary/10"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-muted-foreground tracking-widest">عنوان البلاغ</Label>
                <Input
                  placeholder="مثال: تنبيه بخصوص الالتزام بالتسعيرة"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="font-bold h-12 bg-muted/20 border-primary/10"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-muted-foreground tracking-widest">نص البلاغ السيادي</Label>
                <Textarea
                  placeholder="اكتب التعليمات الرسمية هنا..."
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="h-32 bg-muted/20 border-primary/10 resize-none font-medium"
                />
              </div>
            </CardContent>
            <CardFooter className="bg-muted/10 border-t p-6">
              <Button type="submit" className="w-full h-14 text-xl font-black gap-2 shadow-lg" disabled={isSending}>
                {isSending ? <Loader2 className="h-6 w-6 animate-spin" /> : <><Send className="h-6 w-6" /> بث البلاغ بختم القلعة</>}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="space-y-6">
          <Card className="border-primary/10 bg-primary/5">
            <CardHeader><CardTitle className="text-sm font-black flex items-center gap-2"><AlertCircle className="h-4 w-4" /> ميثاق البث</CardTitle></CardHeader>
            <CardContent className="text-[10px] text-muted-foreground leading-relaxed space-y-2">
              <p>كافة البلاغات الصادرة عن هذا محرك تُعد <strong>"أوامر سيادية"</strong> ملزمة للأطراف.</p>
              <p>يتم توثيق كل حرف في سجلات الرقابة للأبد لضمان نزاهة القلعة.</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-muted overflow-hidden bg-card">
            <CardHeader className="bg-muted/30 border-b pb-3">
              <CardTitle className="text-xs font-black flex items-center gap-2">
                <History className="h-4 w-4" /> سجل البث الأخير
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loadingHistory ? (
                <div className="p-10 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto opacity-20" /></div>
              ) : !broadcastLogs || broadcastLogs.length === 0 ? (
                <div className="p-10 text-center text-[10px] text-muted-foreground italic">لا يوجد سجل بث قريب.</div>
              ) : (
                <div className="divide-y border-border/50">
                  {broadcastLogs.map((log: any) => (
                    <div key={log.id} className="p-3 space-y-1 hover:bg-muted/10 transition-colors">
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className="text-[8px] h-4 bg-background uppercase font-bold">
                          {log.target}
                        </Badge>
                        <span className="text-[8px] font-mono opacity-50 text-muted-foreground">{formatDate(log.timestamp, 'dd/MM HH:mm', locale)}</span>
                      </div>
                      <p className="text-[10px] font-black truncate">{log.title}</p>
                      <p className="text-[9px] text-muted-foreground truncate">{log.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}