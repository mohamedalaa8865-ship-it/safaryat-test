'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth, useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, Loader2, AlertCircle, Users } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useState, useCallback } from 'react';
import { signInWithEmail } from '@/lib/simple-auth';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { triggerHaptic } from '@/lib/utils';

/**
 * @page AdminLoginPage
 * @description THE REINFORCED SOVEREIGN PORTAL (STERILIZED - SC-812 V1.2)
 * [SC-812 V1.2]: FIXED ZOD IMPORT. Enforced Role-Based Nuclear Redirect for Agents.
 * Protocol 30: Dictatorship of the Token.
 */

const adminLoginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح.'),
  password: z.string().min(1, 'كلمة المرور مطلوبة.'),
});

type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

export default function AdminLoginPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const locale = useLocale();
  const tError = useTranslations('errorDictionary');
  
  const [error, setError] = useState('');
  const [showSecretPortal, setShowSecretPortal] = useState(false);
  const [secretEmail, setSecretEmail] = useState('');
  const [secretPass, setSecretPass] = useState('');
  const [isSecretLoading, setIsSecretLoading] = useState(false);

  const form = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { email: '', password: '' },
  });

  const handleLoginSuccess = useCallback(async (user: any) => {
    if (!user) return;
    
    // [SC-812] ATOMIC SYNC: Force token refresh to capture NEW claims immediately
    const idTokenResult = await user.getIdTokenResult(true);
    const role = (idTokenResult.claims.role as string || '').toLowerCase();
    
    triggerHaptic('success');
    toast({ title: 'تم التحقق من الهوية ✅' });
    
    // [SC-812] NUCLEAR REDIRECT: Bypass Router to force a hard reload and Middleware sync
    if (role === 'agent') {
        window.location.href = `/${locale}/agent`;
    } else {
        window.location.href = `/${locale}/admin`;
    }
  }, [locale, toast]);

  const onSubmit = useCallback(async (data: AdminLoginFormValues) => {
    if (!auth || !firestore) return;
    setError('');
    
    try {
        const result = await signInWithEmail(auth, firestore, data.email, data.password);
        if (result?.user) {
            await handleLoginSuccess(result.user);
        }
    } catch (err: any) {
        const errorCode = err.message === 'PASSWORD_INCORRECT' ? 'PASSWORD_INCORRECT' : 'AUTH_REQUIRED';
        setError(tError(errorCode) || 'خطأ في المصادقة.');
        triggerHaptic('light');
        toast({ variant: 'destructive', title: 'خطأ في الختم', description: tError(errorCode) });
    }
  }, [auth, firestore, handleLoginSuccess, toast, tError]);

  const handleSecretLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !firestore) return;
    setIsSecretLoading(true);
    setError('');
    try {
      const result = await signInWithEmail(auth, firestore, secretEmail, secretPass);
      if (result?.user) {
        await handleLoginSuccess(result.user);
      }
    } catch (err: any) {
      setError('كلمة المرور غير صحيحة.');
      triggerHaptic('light');
      toast({ variant: 'destructive', title: 'خطأ في المفتاح الماستر' });
    } finally {
      setIsSecretLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4 overflow-hidden relative">
        <div className="absolute inset-0 bg-primary/5 blur-[100px] rounded-full -z-10 translate-y-1/2" />
        
        <Card className="w-full max-w-md border-2 border-primary/30 shadow-2xl animate-in zoom-in duration-500 bg-card/80 backdrop-blur-xl">
          <CardHeader className="text-center space-y-2">
            <div 
              onClick={() => { triggerHaptic('light'); setShowSecretPortal(true); }}
              className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-2 border border-primary/20 cursor-pointer hover:scale-110 hover:bg-primary/20 transition-all duration-300 group"
            >
                <Users className="h-10 w-10 text-primary animate-pulse group-hover:scale-125 transition-transform"/>
            </div>
            <CardTitle className="text-3xl font-black tracking-tighter text-foreground">بوابة الكوادر والوكلاء</CardTitle>
            <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest italic">Safar Gate Staff & Agent Entry</p>
          </CardHeader>
          
          <CardContent>
            {error && (
              <div className="bg-destructive/10 p-4 rounded-xl border border-destructive/20 text-destructive text-sm text-center font-bold mb-6 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase text-muted-foreground">البريد السيادي المعتمد</FormLabel>
                    <FormControl><Input type="email" placeholder="name@safar-gate.com" {...field} dir="ltr" className="font-mono h-12 bg-muted/20 border-primary/10 text-foreground" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
                <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase text-muted-foreground">مفتاح الدخول (PIN)</FormLabel>
                    <FormControl><Input type="password" placeholder="••••••••" {...field} dir="ltr" className="font-mono h-12 bg-muted/20 border-primary/10 text-foreground" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
                <Button type="submit" className="w-full h-14 text-xl font-black shadow-lg" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? <Loader2 className="animate-spin h-6 w-6" /> : "دخول سيادي آمن"}
                </Button>
              </form>
            </Form>
          </CardContent>
          
          <CardFooter className="justify-center border-t border-primary/10 p-4">
            <Button variant="ghost" size="sm" onClick={() => { triggerHaptic('light'); window.location.href = '/'; }} className="text-muted-foreground text-xs font-bold hover:text-primary transition-colors">
              <ArrowRight className="ml-2 h-3 w-3" /> العودة للساحة العامة
            </Button>
          </CardFooter>
        </Card>

        {/* Secret Portal Modal */}
        <Dialog open={showSecretPortal} onOpenChange={setShowSecretPortal}>
          <DialogContent className="sm:max-w-md bg-card border-2 border-primary shadow-2xl" dir="rtl">
            <form onSubmit={handleSecretLogin}>
                <DialogHeader className="text-center">
                    <DialogTitle className="text-2xl font-black tracking-tight text-foreground">بوابة القلعة السيادية</DialogTitle>
                    <DialogDescription className="text-xs font-bold text-muted-foreground">الوصول المباشر للمالك المرجع الأعلى.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-muted-foreground">البريد الماستر</Label>
                        <Input type="email" value={secretEmail} onChange={(e) => setSecretEmail(e.target.value)} required dir="ltr" disabled={isSecretLoading} className="font-mono h-12" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-muted-foreground">المفتاح الماستر</Label>
                        <Input type="password" value={secretPass} onChange={(e) => setSecretPass(e.target.value)} required dir="ltr" disabled={isSecretLoading} className="font-mono h-12 text-center text-2xl tracking-widest" />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" disabled={isSecretLoading} className="w-full h-14 text-xl font-black shadow-2xl">إلغاء القفل والعبور</Button>
                </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
    </div>
  );
}
