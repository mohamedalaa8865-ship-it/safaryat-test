'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { type Staff } from '@/types/staff';
import { Button } from '@/components/ui/button';
import {
    Dialog, DialogContent, DialogDescription, DialogFooter,
    DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
    Briefcase, Loader2, Target, Gift, Zap, DollarSign, ShieldCheck,
    Edit,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { doc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';

const EditJobSchema = z.object({
    jobTitle: z.string().optional().default(''),
    workType: z.enum(['office', 'remote', 'hybrid']).default('office'),
    paymentSystem: z.enum(['monthly', 'hourly', 'commission']).default('monthly'),
    baseSalary: z.coerce.number().min(0).default(0),
    agentTarget: z.coerce.number().min(0).default(0),
    agentBonus: z.coerce.number().min(0).default(0),
    commissionRate: z.coerce.number().min(0).default(0),
    currency: z.string().default('JOD'),
});

type EditJobForm = z.infer<typeof EditJobSchema>;

interface EditJobOfferDialogProps {
    staff: Staff | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    adminId?: string;
}

export function EditJobOfferDialog({ staff, open, onOpenChange, adminId }: EditJobOfferDialogProps) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<EditJobForm>({
        resolver: zodResolver(EditJobSchema),
        values: {
            jobTitle: (staff as any)?.jobTitle || '',
            workType: (staff as any)?.workType || 'office',
            paymentSystem: (staff as any)?.paymentSystem || 'monthly',
            baseSalary: (staff as any)?.baseSalary || 0,
            agentTarget: staff?.agentTarget || 0,
            agentBonus: staff?.agentBonus || 0,
            commissionRate: (staff as any)?.commissionRate || 0,
            currency: staff?.currency || 'JOD',
        },
    });

    const onSubmit = useCallback(async (data: EditJobForm) => {
        if (!firestore || !staff) return;
        setIsSubmitting(true);
        try {
            const updates: Record<string, any> = {
                workType: data.workType,
                paymentSystem: data.paymentSystem,
                baseSalary: data.baseSalary,
                agentTarget: data.agentTarget,
                agentBonus: data.agentBonus,
                commissionRate: data.commissionRate,
                currency: data.currency,
                updatedAt: serverTimestamp(),
            };
            if (data.jobTitle?.trim()) updates.jobTitle = data.jobTitle.trim();

            await updateDoc(doc(firestore, 'users', staff.id), updates);

            // إشعار للوكيل
            const changes: string[] = [];
            if (data.jobTitle?.trim()) changes.push(`المسمى الوظيفي: ${data.jobTitle.trim()}`);
            changes.push(`طبيعة العمل: ${{ office: 'مكتبي', remote: 'عن بعد', hybrid: 'هجين' }[data.workType]}`);
            changes.push(`هدف الحجوزات: ${data.agentTarget} راكب`);
            changes.push(`مكافأة الهدف: ${data.agentBonus} ${data.currency}`);
            changes.push(`الراتب الشهري: ${data.baseSalary} ${data.currency}`);

            await addDoc(
                collection(doc(firestore, 'users', staff.id), 'notifications'),
                {
                    userId: staff.id,
                    title: '📋 تم تحديث عرض عملك',
                    message: `قامت الإدارة بتحديث بيانات وظيفتك:\n${changes.join('\n')}`,
                    type: 'job_offer_updated',
                    isRead: false,
                    link: '/agent',
                    createdAt: serverTimestamp(),
                    updatedBy: adminId || 'admin',
                    changes: updates,
                }
            );

            toast({ title: 'تم تحديث عرض الشغل ✅', description: 'تم إرسال إشعار للوكيل بالتغييرات.' });
            onOpenChange(false);
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'فشل التحديث', description: e.message });
        } finally {
            setIsSubmitting(false);
        }
    }, [firestore, staff, adminId, toast, onOpenChange]);

    const displayName = staff?.fullName || staff?.email || '';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto pt-10" dir="rtl">
                <DialogHeader className="text-right">
                    <DialogTitle className="flex items-center gap-2 text-xl font-black text-amber-700">
                        <Edit className="h-6 w-6" /> تعديل عرض الشغل
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                        تعديل الملف المهني والمالي للوكيل <strong>{displayName}</strong> — سيصله إشعار فوري بالتغييرات [SC-806].
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        {/* المسمى الوظيفي */}
                        {/* <div className="border-b border-dashed pb-4">
                            <FormField control={form.control} name="jobTitle" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-1 font-bold">
                                        <Briefcase className="h-3.5 w-3.5 text-amber-600" /> المسمى الوظيفي
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="مثال: وكيل مبيعات أول" {...field} disabled={isSubmitting} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div> */}

                        {/* طبيعة العمل + نظام الأجور */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/10 p-4 rounded-xl border border-dashed">
                            <FormField control={form.control} name="workType" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-1 font-bold">
                                        <Briefcase className="h-3 w-3" /> طبيعة العمل
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="office">مكتبي</SelectItem>
                                            <SelectItem value="remote">عن بعد</SelectItem>
                                            <SelectItem value="hybrid">هجين</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="paymentSystem" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-1 font-bold">
                                        <DollarSign className="h-3 w-3" /> نظام الأجور
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="monthly">راتب شهري</SelectItem>
                                            <SelectItem value="hourly">نظام المياومة</SelectItem>
                                            <SelectItem value="commission">نظام العمولات</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            {/* الراتب الشهري */}
                            <FormField control={form.control} name="baseSalary" render={({ field }) => (
                                <FormItem className="col-span-2">
                                    <FormLabel className="flex items-center gap-1 font-bold">
                                        <DollarSign className="h-3 w-3 text-emerald-600" /> الراتب الشهري
                                    </FormLabel>
                                    <FormControl>
                                        <Input type="number" min="0" {...field} disabled={isSubmitting}
                                            className="font-mono font-bold text-lg border-emerald-200" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>

                        {/* هدف الوكيل + المكافأة + العمولة */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-blue-50/50 border border-blue-100 p-4 rounded-xl">
                            <p className="col-span-3 text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1">
                                <Target className="h-3 w-3" /> مؤشرات الأداء الميداني
                            </p>

                            <FormField control={form.control} name="agentTarget" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-1 text-blue-600 font-bold text-xs">
                                        <Target className="h-3 w-3" /> هدف الحجوزات
                                    </FormLabel>
                                    <FormControl>
                                        <Input type="number" min="0" {...field} disabled={isSubmitting}
                                            className="font-bold border-blue-200" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="agentBonus" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-1 text-emerald-600 font-bold text-xs">
                                        <Gift className="h-3 w-3" /> مكافأة الهدف
                                    </FormLabel>
                                    <FormControl>
                                        <Input type="number" min="0" {...field} disabled={isSubmitting}
                                            className="font-bold border-emerald-200" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="commissionRate" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-1 text-orange-600 font-bold text-xs">
                                        <Zap className="h-3 w-3" /> عمولة الرحلة
                                    </FormLabel>
                                    <FormControl>
                                        <Input type="number" min="0" {...field} disabled={isSubmitting}
                                            className="font-bold border-orange-200" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>

                        {/* العملة */}
                        <FormField control={form.control} name="currency" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold text-xs">العملة</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                                    <FormControl><SelectTrigger className="w-32"><SelectValue /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="JOD">JOD — دينار أردني</SelectItem>
                                        <SelectItem value="USD">USD — دولار</SelectItem>
                                        <SelectItem value="SAR">SAR — ريال سعودي</SelectItem>
                                        <SelectItem value="EGP">EGP — جنيه مصري</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <DialogFooter className="pt-2">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                                إلغاء
                            </Button>
                            <Button type="submit"
                                className="bg-[#cfb76f] hover:bg-[#AF9E6D] text-black font-black h-10 px-8 shadow-lg"
                                disabled={isSubmitting}>
                                {isSubmitting
                                    ? <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                                    : <ShieldCheck className="ml-2 h-5 w-5" />
                                }
                                حفظ وإرسال الإشعار للوكيل
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}