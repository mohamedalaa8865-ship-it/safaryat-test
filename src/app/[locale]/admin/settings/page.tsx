
'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth, useFunctions } from '@/firebase';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, KeyRound, ShieldCheck, Lock } from 'lucide-react';
import { useUserProfile } from '@/hooks/use-user-profile';

const passwordSchema = z.object({
    currentPassword: z.string().min(1, 'كلمة المرور الحالية مطلوبة.'),
    newPassword: z.string().min(6, 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل.'),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين.",
    path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

const pinSchema = z.object({
    newPin: z.string().length(4, 'الرمز يجب أن يتكون من 4 أرقام').regex(/^\d+$/, 'أرقام فقط'),
});

type PinFormValues = z.infer<typeof pinSchema>;

/**
 * @page AdminSettingsPage
 * @description THE REINFORCED SECURITY CENTER (SC-641 - MASTER KEY)
 * [SC-641]: Added Sovereign PIN management for Owners.
 */
export default function AdminSettingsPage() {
    const auth = useAuth();
    const functions = useFunctions();
    const { profile } = useUserProfile();
    const { toast } = useToast();
    
    const [isPassLoading, setIsPassLoading] = useState(false);
    const [isPinLoading, setIsPinLoading] = useState(false);

    const isOwner = profile?.role === 'owner';
    
    const passForm = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordSchema),
        defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
    });

    const pinForm = useForm<PinFormValues>({
        resolver: zodResolver(pinSchema),
        defaultValues: { newPin: '' },
    });

    const onPassSubmit = async (data: PasswordFormValues) => {
        setIsPassLoading(true);
        const user = auth?.currentUser;
        if (!user || !user.email) return;

        try {
            const credential = EmailAuthProvider.credential(user.email, data.currentPassword);
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, data.newPassword);
            toast({ title: "تم تحديث كلمة المرور بنجاح!" });
            passForm.reset();
        } catch (error: any) {
            toast({ variant: "destructive", title: "فشل التحديث", description: "كلمة المرور الحالية غير صحيحة." });
        } finally {
            setIsPassLoading(false);
        }
    };

    const onPinSubmit = async (data: PinFormValues) => {
        if (!functions) return;
        setIsPinLoading(true);
        try {
            const updatePinFn = httpsCallable(functions, 'updateSovereignPin');
            await updatePinFn({ newPin: data.newPin });
            toast({ title: "تم تحديث الرمز السيادي بنجاح ✅" });
            pinForm.reset();
        } catch (error: any) {
            toast({ variant: "destructive", title: "فشل التحديث", description: error.message });
        } finally {
            setIsPinLoading(false);
        }
    };

    return (
        <div className="space-y-8 p-4 md:p-8" dir="rtl">
            <header>
                <h1 className="text-3xl font-black tracking-tight">إعدادات الأمان السيادي</h1>
                <p className="text-muted-foreground text-sm mt-1">إدارة مفاتيح القلعة والرموز المشفرة.</p>
            </header>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border-primary/10 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <KeyRound className="h-5 w-5 text-primary"/>
                            تغيير كلمة المرور
                        </CardTitle>
                        <CardDescription>تحديث مفتاح الدخول الخاص بحسابك الشخصي.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...passForm}>
                            <form onSubmit={passForm.handleSubmit(onPassSubmit)} className="space-y-4">
                                <FormField control={passForm.control} name="currentPassword" render={({ field }) => (
                                    <FormItem><FormLabel>كلمة المرور الحالية</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={passForm.control} name="newPassword" render={({ field }) => (
                                    <FormItem><FormLabel>كلمة المرور الجديدة</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={passForm.control} name="confirmPassword" render={({ field }) => (
                                    <FormItem><FormLabel>تأكيد الكلمة الجديدة</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <div className="flex justify-end pt-4">
                                    <Button type="submit" disabled={isPassLoading}>
                                        {isPassLoading ? <Loader2 className="animate-spin" /> : <><ShieldCheck className="ml-2 h-4 w-4"/> تحديث المفتاح</>}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                {isOwner && (
                    <Card className="border-amber-500/20 bg-amber-50/5 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg text-amber-600">
                                <Lock className="h-5 w-5"/>
                                الرمز السيادي الماستر (PIN)
                            </CardTitle>
                            <CardDescription>تغيير رمز العبور لغرفة التسعير والخزينة المركزية.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...pinForm}>
                                <form onSubmit={pinForm.handleSubmit(onPinSubmit)} className="space-y-6">
                                    <FormField control={pinForm.control} name="newPin" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-amber-700 font-bold">رمز PIN جديد (4 أرقام)</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    placeholder="0000" 
                                                    maxLength={4} 
                                                    className="text-center text-3xl font-black tracking-[0.5em] h-16 border-amber-200" 
                                                    {...field} 
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <div className="flex justify-end pt-2">
                                        <Button type="submit" variant="default" className="bg-amber-600 hover:bg-amber-700 w-full" disabled={isPinLoading}>
                                            {isPinLoading ? <Loader2 className="animate-spin" /> : <><ShieldCheck className="ml-2 h-4 w-4"/> اعتماد الرمز الماستر</>}
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
