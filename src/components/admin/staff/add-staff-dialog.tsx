// 'use client';

// import { useState, useEffect, useCallback, useMemo } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { StaffSchema, type Staff, PERMISSION_MATRIX } from '@/types/staff';
// import { Button } from '@/components/ui/button';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from '@/components/ui/dialog';
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { ShieldCheck, Activity, UserPlus, Loader2, Briefcase, DollarSign, Target, Gift, Zap } from 'lucide-react';
// import { useToast } from '@/hooks/use-toast';
// import { generateSovereignEmail, generateTemporaryPIN } from '@/lib/sovereign-id';
// import { useFunctions } from '@/firebase';
// import { httpsCallable } from 'firebase/functions';
// import { getApp, getApps, initializeApp } from 'firebase/app';
// import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
// import { useAuth, useFirestore } from '@/firebase';
// // import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
// /**
//  * @component AddStaffDialog
//  * @description THE REINFORCED RECRUITER (ERP CORE - SC-806 V7.0 - STERILIZED)
//  * [SCR-983]: Type Alignment with Zod Inference to prevent undefined role conflict.
//  */
// export function AddStaffDialog({ onSuccess }: { onSuccess?: () => void }) {
//   const [open, setOpen] = useState(false);
//   const { toast } = useToast();
//   const functions = useFunctions();
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // [SCR-983]: Strict Schema Enforcement
//   const form = useForm<z.infer<typeof StaffSchema>>({
//     resolver: zodResolver(StaffSchema),
//     defaultValues: {
//       fullName: '',
//       nationalId: '',
//       email: '',
//       tempPassword: '',
//       role: 'support',
//       workType: 'office',
//       paymentSystem: 'monthly',
//       baseSalary: 0,
//       hourlyRate: 0,
//       agentTarget: 50,
//       agentBonus: 100,
//       commissionRate: 0,
//       currency: 'JOD',
//       isActive: true,
//       isFirstLogin: true,
//       currentBalance: 0,
//       lifetimeEarnings: 0,
//       advancesBalance: 0,
//       pendingHours: 0,
//       permissions: {
//         fieldControl: false, sovereignComm: false, liveMonitoring: false,
//         socialMedia: false, treasury: false, securityAdmin: false, financeVault: false,
//         financeAnalytics: false,
//       }
//     }
//   });

//   const fullName = form.watch('fullName');
//   const role = form.watch('role');
//   const paymentSystem = form.watch('paymentSystem');
//   const auth = useAuth();
//   const firestore = useFirestore();
//   useEffect(() => {
//     if (fullName && fullName.trim().split(' ').length >= 2) {
//       const generatedEmail = generateSovereignEmail(fullName);
//       const generatedPin = generateTemporaryPIN();

//       if (!form.getValues('email')) form.setValue('email', generatedEmail);
//       if (!form.getValues('tempPassword')) form.setValue('tempPassword', generatedPin);
//     } else if (!fullName) {
//       form.setValue('email', '');
//       form.setValue('tempPassword', '');
//     }
//   }, [fullName, form]);

//   // const onSubmit = useCallback(async (data: z.infer<typeof StaffSchema>) => {
//   //   if (!functions) return;
//   //   setIsSubmitting(true);
//   //   try {
//   //     if (data.role === 'agent') {
//   //       data.permissions = {
//   //         fieldControl: false, sovereignComm: false, liveMonitoring: false,
//   //         socialMedia: false, treasury: false, securityAdmin: false, financeVault: false,
//   //         financeAnalytics: false,
//   //       };
//   //     }

//   //     const recruitFn = httpsCallable(functions, 'recruitSovereignStaff');
//   //     await recruitFn(data);

//   //     toast({ title: "تم التجنيد بنجاح ✅", description: `تم إنشاء الهوية السحابية والملف المهني لـ ${data.fullName}.` });
//   //     setOpen(false);
//   //     form.reset();
//   //     if (onSuccess) onSuccess();
//   //   } catch (error: any) {
//   //     toast({ variant: "destructive", title: "فشل التجنيد", description: error.message || "حدث خلل في النواة السحابية." });
//   //   } finally {
//   //     setIsSubmitting(false);
//   //   }
//   // }, [functions, form, onSuccess, toast]);
//   // const onSubmit = useCallback(async (data: z.infer<typeof StaffSchema>) => {
//   //   if (!auth || !firestore) return;
//   //   setIsSubmitting(true);
//   //   try {
//   //     // 1. أنشئ الـ user في Firebase Auth
//   //     const { user } = await createUserWithEmailAndPassword(
//   //       auth,
//   //       data.email ?? '',
//   //       data.tempPassword ?? ''
//   //     );

//   //     const firstName = data.fullName.trim().split(" ")[0];
//   //     const lastName = data.fullName.trim().split(" ").slice(1).join(" ");

//   //     // 2. احفظ في Firestore
//   //     await setDoc(doc(firestore, 'users', user.uid), {
//   //       uid: user.uid,
//   //       id: user.uid,
//   //       email: data.email,
//   //       firstName,
//   //       lastName,
//   //       fullName: data.fullName,
//   //       nationalId: data.nationalId || "",
//   //       role: data.role,
//   //       workType: data.workType || "office",
//   //       paymentSystem: data.paymentSystem || "monthly",
//   //       baseSalary: data.baseSalary || 0,
//   //       currency: data.currency || "JOD",
//   //       permissions: data.role === 'agent' ? {} : (data.permissions || {}),
//   //       isActive: true,
//   //       isFirstLogin: true,
//   //       currentBalance: 0,
//   //       lifetimeEarnings: 0,
//   //       ...(data.role === "agent" && {
//   //         agentStatus: "active",
//   //         agentTarget: data.agentTarget || 50,
//   //         agentBonus: data.agentBonus || 100,
//   //         commissionRate: data.commissionRate || 0,
//   //       }),
//   //       createdAt: serverTimestamp(),
//   //       updatedAt: serverTimestamp(),
//   //     });

//   //     toast({ title: "تم التجنيد بنجاح ✅", description: `تم إنشاء الهوية لـ ${data.fullName}.` });
//   //     setOpen(false);
//   //     form.reset();
//   //     if (onSuccess) onSuccess();
//   //   } catch (error: any) {
//   //     toast({ variant: "destructive", title: "فشل التجنيد", description: error.message });
//   //   } finally {
//   //     setIsSubmitting(false);
//   //   }
//   // }, [auth, firestore, form, onSuccess, toast]);
//   const onSubmit = useCallback(async (data: z.infer<typeof StaffSchema>) => {
//     if (!firestore) return;
//     setIsSubmitting(true);
//     try {
//       // ✅ Secondary app عشان منأثرش على session الأدمن
//       const secondaryAppName = 'SecondaryApp';
//       const firebaseConfig = {
//         apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//         authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//         projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//       };

//       const secondaryApp = getApps().find(a => a.name === secondaryAppName)
//         ?? initializeApp(firebaseConfig, secondaryAppName);

//       const secondaryAuth = getAuth(secondaryApp);

//       // أنشئ الـ user في الـ secondary app
//       const { user } = await createUserWithEmailAndPassword(
//         secondaryAuth,
//         data.email ?? '',
//         data.tempPassword ?? ''
//       );

//       // Sign out من الـ secondary app فوراً
//       await secondaryAuth.signOut();

//       const firstName = data.fullName.trim().split(" ")[0];
//       const lastName = data.fullName.trim().split(" ").slice(1).join(" ");

//       // احفظ في Firestore
//       await setDoc(doc(firestore, 'users', user.uid), {
//         uid: user.uid,
//         id: user.uid,
//         email: data.email,
//         firstName,
//         lastName,
//         fullName: data.fullName,
//         nationalId: data.nationalId || "",
//         role: data.role,
//         workType: data.workType || "office",
//         paymentSystem: data.paymentSystem || "monthly",
//         baseSalary: data.baseSalary || 0,
//         currency: data.currency || "JOD",
//         permissions: data.role === 'agent' ? {} : (data.permissions || {}),
//         isActive: true,
//         isFirstLogin: true,
//         currentBalance: 0,
//         lifetimeEarnings: 0,
//         ...(data.role === "agent" && {
//           agentStatus: "active",
//           agentTarget: data.agentTarget || 50,
//           agentBonus: data.agentBonus || 100,
//           commissionRate: data.commissionRate || 0,
//         }),
//         createdAt: serverTimestamp(),
//         updatedAt: serverTimestamp(),
//       });

//       toast({ title: "تم التجنيد بنجاح ✅", description: `تم إنشاء الهوية لـ ${data.fullName}.` });
//       setOpen(false);
//       form.reset();
//       if (onSuccess) onSuccess();
//     } catch (error: any) {
//       toast({ variant: "destructive", title: "فشل التجنيد", description: error.message });
//     } finally {
//       setIsSubmitting(false);
//     }
//   }, [firestore, form, onSuccess, toast]);
//   const renderedPermissions = useMemo(() => {
//     if (role === 'agent') return <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-700 text-xs font-bold">الوكلاء يملكون صلاحيات ميدانية محددة (بوابة الوكيل) ولا يحتاجون لتعديل مصفوفة صلاحيات الإدارة.</div>;

//     return PERMISSION_MATRIX.map((perm) => (
//       <FormField
//         key={perm.id}
//         control={form.control}
//         name={`permissions.${perm.id}` as any}
//         render={({ field }) => (
//           <FormItem className="flex flex-row items-start space-x-3 space-x-reverse space-y-0 rounded-xl border p-3 shadow-sm hover:bg-muted/50 transition-all cursor-pointer">
//             <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isSubmitting} /></FormControl>
//             <div className="space-y-1 leading-none mr-2">
//               <FormLabel className="font-bold flex items-center gap-2 text-xs">
//                 <perm.icon className="h-3.5 w-3.5 text-primary" /> {perm.label}
//               </FormLabel>
//               <FormDescription className="text-[10px]">{perm.desc}</FormDescription>
//             </div>
//           </FormItem>
//         )}
//       />
//     ));
//   }, [form.control, isSubmitting, role]);

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button className="gap-2 font-bold shadow-lg"><UserPlus className="h-4 w-4" /> إضافة كادر جديد</Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto" dir="rtl">
//         <DialogHeader className="text-right">
//           <DialogTitle className="flex items-center gap-2 text-xl font-black text-primary">
//             <ShieldCheck className="h-6 w-6" /> التجنيد والهيكل الإداري
//           </DialogTitle>
//           <DialogDescription className="text-xs">
//             إدخال القيد المدني وتحديد الرتبة والملف المالي في النواة السحابية [SC-806].
//           </DialogDescription>
//         </DialogHeader>

//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-dashed pb-4">
//               <FormField control={form.control} name="fullName" render={({ field }) => (
//                 <FormItem><FormLabel>الاسم الرباعي</FormLabel><FormControl><Input placeholder="الاسم كما في الهوية" {...field} disabled={isSubmitting} /></FormControl><FormMessage /></FormItem>
//               )} />
//               <FormField control={form.control} name="nationalId" render={({ field }) => (
//                 <FormItem><FormLabel>الرقم الوطني</FormLabel><FormControl><Input placeholder="10 خانات رقمية" {...field} maxLength={10} disabled={isSubmitting} /></FormControl><FormMessage /></FormItem>
//               )} />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/10 p-4 rounded-xl border border-dashed">
//               <FormField control={form.control} name="role" render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-primary font-bold flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> الرتبة</FormLabel>
//                   <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
//                     <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
//                     <SelectContent>
//                       <SelectItem value="admin">مدير نظام</SelectItem>
//                       <SelectItem value="operations_manager">مدير عمليات</SelectItem>
//                       <SelectItem value="developer">مبرمج/تقني</SelectItem>
//                       <SelectItem value="support">دعم فني</SelectItem>
//                       <SelectItem value="agent" className="font-black text-blue-600">وكيل سيادي (Agent)</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )} />

//               <FormField control={form.control} name="workType" render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="flex items-center gap-1"><Briefcase className="h-3 w-3" /> طبيعة العمل</FormLabel>
//                   <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
//                     <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
//                     <SelectContent>
//                       <SelectItem value="office">مكتبي</SelectItem>
//                       <SelectItem value="remote">عن بعد</SelectItem>
//                       <SelectItem value="hybrid">هجين</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )} />

//               <FormField control={form.control} name="paymentSystem" render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="flex items-center gap-1"><DollarSign className="h-3 w-3" /> نظام الأجور</FormLabel>
//                   <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
//                     <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
//                     <SelectContent>
//                       <SelectItem value="monthly">راتب شهري</SelectItem>
//                       <SelectItem value="hourly">نظام المياومة</SelectItem>
//                       <SelectItem value="commission" className="font-bold">نظام العمولات</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )} />

//               {role === 'agent' && (
//                 <div className="col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4 mt-2 animate-in zoom-in-95 duration-300">
//                   <FormField control={form.control} name="agentTarget" render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="flex items-center gap-1 text-blue-600 font-bold"><Target className="h-3 w-3" /> هدف الرحلات (Target)</FormLabel>
//                       <FormControl><Input type="number" {...field} disabled={isSubmitting} className="font-bold border-blue-200" /></FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )} />
//                   <FormField control={form.control} name="agentBonus" render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="flex items-center gap-1 text-emerald-600 font-bold"><Gift className="h-3 w-3" /> مكافأة الهدف (Bonus)</FormLabel>
//                       <FormControl><Input type="number" {...field} disabled={isSubmitting} className="font-bold border-emerald-200" /></FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )} />
//                   <FormField control={form.control} name="commissionRate" render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="flex items-center gap-1 text-orange-600 font-bold"><Zap className="h-3 w-3" /> عمولة الرحلة (اختياري)</FormLabel>
//                       <FormControl><Input type="number" {...field} disabled={isSubmitting} className="font-bold border-orange-200" /></FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )} />
//                 </div>
//               )}

//               {paymentSystem === 'monthly' && role !== 'agent' && (
//                 <FormField control={form.control} name="baseSalary" render={({ field }) => (
//                   <FormItem className="col-span-3 animate-in slide-in-from-top-2">
//                     <FormLabel>الراتب الأساسي (JOD)</FormLabel>
//                     <FormControl><Input type="number" {...field} disabled={isSubmitting} className="font-mono font-bold text-lg" /></FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )} />
//               )}
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-primary/5 p-4 rounded-xl border border-primary/20">
//               <div className="space-y-2">
//                 <FormLabel className="text-primary font-bold">📧 البريد المولد للوكيل</FormLabel>
//                 <Input value={form.watch('email')} readOnly className="bg-background font-mono text-xs" dir="ltr" />
//               </div>
//               <div className="space-y-2">
//                 <FormLabel className="text-destructive font-bold">🔑 رمز PIN المبدئي</FormLabel>
//                 <div className="bg-background border rounded-lg px-3 py-2 font-mono font-black text-center tracking-widest text-lg text-destructive shadow-inner">
//                   {form.watch('tempPassword') || '----'}
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-4">
//               <h3 className="font-bold text-sm text-muted-foreground flex items-center gap-2">
//                 <Activity className="h-4 w-4" /> مصفوفة الصلاحيات
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                 {renderedPermissions}
//               </div>
//             </div>

//             <DialogFooter className="pt-4">
//               <Button type="submit" className="w-full font-black text-lg h-14 shadow-2xl" disabled={!form.watch('email') || isSubmitting}>
//                 {isSubmitting ? <Loader2 className="ml-2 h-5 w-5 animate-spin" /> : <ShieldCheck className="ml-2 h-5 w-5" />}
//                 اعتماد وتفعيل الوكيل السيادي
//               </Button>
//             </DialogFooter>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// }

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { StaffSchema, type Staff, PERMISSION_MATRIX } from '@/types/staff';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShieldCheck, Activity, UserPlus, Loader2, Briefcase, DollarSign, Target, Gift, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateSovereignEmail, generateTemporaryPIN } from '@/lib/sovereign-id';
import { useFunctions } from '@/firebase';
import { httpsCallable } from 'firebase/functions';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useAuth, useFirestore } from '@/firebase';
// import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
/**
 * @component AddStaffDialog
 * @description THE REINFORCED RECRUITER (ERP CORE - SC-806 V7.0 - STERILIZED)
 * [SCR-983]: Type Alignment with Zod Inference to prevent undefined role conflict.
 */
export function AddStaffDialog({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const functions = useFunctions();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // [SCR-983]: Strict Schema Enforcement
  const form = useForm<z.infer<typeof StaffSchema>>({
    resolver: zodResolver(StaffSchema),
    defaultValues: {
      fullName: '',
      nationalId: '',
      email: '',
      tempPassword: '',
      role: 'support',
      workType: 'office',
      paymentSystem: 'monthly',
      baseSalary: 0,
      hourlyRate: 0,
      agentTarget: 50,
      agentBonus: 100,
      commissionRate: 0,
      currency: 'JOD',
      isActive: true,
      isFirstLogin: true,
      currentBalance: 0,
      lifetimeEarnings: 0,
      advancesBalance: 0,
      pendingHours: 0,
      permissions: {
        fieldControl: false, sovereignComm: false, liveMonitoring: false,
        socialMedia: false, treasury: false, securityAdmin: false, financeVault: false,
        financeAnalytics: false,
      }
    }
  });

  const fullName = form.watch('fullName');
  const role = form.watch('role');
  const paymentSystem = form.watch('paymentSystem');
  const auth = useAuth();
  const firestore = useFirestore();
  useEffect(() => {
    if (fullName && fullName.trim().split(' ').length >= 2) {
      const generatedEmail = generateSovereignEmail(fullName);
      const generatedPin = generateTemporaryPIN();

      if (!form.getValues('email')) form.setValue('email', generatedEmail);
      if (!form.getValues('tempPassword')) form.setValue('tempPassword', generatedPin);
    } else if (!fullName) {
      form.setValue('email', '');
      form.setValue('tempPassword', '');
    }
  }, [fullName, form]);

  // const onSubmit = useCallback(async (data: z.infer<typeof StaffSchema>) => {
  //   if (!functions) return;
  //   setIsSubmitting(true);
  //   try {
  //     if (data.role === 'agent') {
  //       data.permissions = {
  //         fieldControl: false, sovereignComm: false, liveMonitoring: false,
  //         socialMedia: false, treasury: false, securityAdmin: false, financeVault: false,
  //         financeAnalytics: false,
  //       };
  //     }

  //     const recruitFn = httpsCallable(functions, 'recruitSovereignStaff');
  //     await recruitFn(data);

  //     toast({ title: "تم التجنيد بنجاح ✅", description: `تم إنشاء الهوية السحابية والملف المهني لـ ${data.fullName}.` });
  //     setOpen(false);
  //     form.reset();
  //     if (onSuccess) onSuccess();
  //   } catch (error: any) {
  //     toast({ variant: "destructive", title: "فشل التجنيد", description: error.message || "حدث خلل في النواة السحابية." });
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // }, [functions, form, onSuccess, toast]);
  // const onSubmit = useCallback(async (data: z.infer<typeof StaffSchema>) => {
  //   if (!auth || !firestore) return;
  //   setIsSubmitting(true);
  //   try {
  //     // 1. أنشئ الـ user في Firebase Auth
  //     const { user } = await createUserWithEmailAndPassword(
  //       auth,
  //       data.email ?? '',
  //       data.tempPassword ?? ''
  //     );

  //     const firstName = data.fullName.trim().split(" ")[0];
  //     const lastName = data.fullName.trim().split(" ").slice(1).join(" ");

  //     // 2. احفظ في Firestore
  //     await setDoc(doc(firestore, 'users', user.uid), {
  //       uid: user.uid,
  //       id: user.uid,
  //       email: data.email,
  //       firstName,
  //       lastName,
  //       fullName: data.fullName,
  //       nationalId: data.nationalId || "",
  //       role: data.role,
  //       workType: data.workType || "office",
  //       paymentSystem: data.paymentSystem || "monthly",
  //       baseSalary: data.baseSalary || 0,
  //       currency: data.currency || "JOD",
  //       permissions: data.role === 'agent' ? {} : (data.permissions || {}),
  //       isActive: true,
  //       isFirstLogin: true,
  //       currentBalance: 0,
  //       lifetimeEarnings: 0,
  //       ...(data.role === "agent" && {
  //         agentStatus: "active",
  //         agentTarget: data.agentTarget || 50,
  //         agentBonus: data.agentBonus || 100,
  //         commissionRate: data.commissionRate || 0,
  //       }),
  //       createdAt: serverTimestamp(),
  //       updatedAt: serverTimestamp(),
  //     });

  //     toast({ title: "تم التجنيد بنجاح ✅", description: `تم إنشاء الهوية لـ ${data.fullName}.` });
  //     setOpen(false);
  //     form.reset();
  //     if (onSuccess) onSuccess();
  //   } catch (error: any) {
  //     toast({ variant: "destructive", title: "فشل التجنيد", description: error.message });
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // }, [auth, firestore, form, onSuccess, toast]);
  const onSubmit = useCallback(async (data: z.infer<typeof StaffSchema>) => {
    if (!firestore) return;
    setIsSubmitting(true);
    try {
      // ✅ Secondary app عشان منأثرش على session الأدمن
      const secondaryAppName = 'SecondaryApp';
      // [SCR-1005]: Use hardcoded config — env vars undefined at runtime in this context
      const { firebaseConfig: fbConfig } = await import('@/firebase/config');

      const secondaryApp = getApps().find(a => a.name === secondaryAppName)
        ?? initializeApp(fbConfig, secondaryAppName);

      const secondaryAuth = getAuth(secondaryApp);

      // أنشئ الـ user في الـ secondary app
      const { user } = await createUserWithEmailAndPassword(
        secondaryAuth,
        data.email ?? '',
        data.tempPassword ?? ''
      );

      // Sign out من الـ secondary app فوراً
      await secondaryAuth.signOut();

      const firstName = data.fullName.trim().split(" ")[0];
      const lastName = data.fullName.trim().split(" ").slice(1).join(" ");

      // احفظ في Firestore
      await setDoc(doc(firestore, 'users', user.uid), {
        uid: user.uid,
        id: user.uid,
        email: data.email,
        firstName,
        lastName,
        fullName: data.fullName,
        nationalId: data.nationalId || "",
        role: data.role,
        workType: data.workType || "office",
        paymentSystem: data.paymentSystem || "monthly",
        baseSalary: data.baseSalary || 0,
        currency: data.currency || "JOD",
        permissions: data.role === 'agent' ? {} : (data.permissions || {}),
        isActive: true,
        isFirstLogin: true,
        currentBalance: 0,
        lifetimeEarnings: 0,
        ...(data.role === "agent" && {
          agentStatus: "active",
          agentTarget: data.agentTarget || 50,
          agentBonus: data.agentBonus || 100,
          commissionRate: data.commissionRate || 0,
        }),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast({ title: "تم التجنيد بنجاح ✅", description: `تم إنشاء الهوية لـ ${data.fullName}.` });
      setOpen(false);
      form.reset();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast({ variant: "destructive", title: "فشل التجنيد", description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  }, [firestore, form, onSuccess, toast]);
  const renderedPermissions = useMemo(() => {
    if (role === 'agent') return <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-700 text-xs font-bold">الوكلاء يملكون صلاحيات ميدانية محددة (بوابة الوكيل) ولا يحتاجون لتعديل مصفوفة صلاحيات الإدارة.</div>;

    return PERMISSION_MATRIX.map((perm) => (
      <FormField
        key={perm.id}
        control={form.control}
        name={`permissions.${perm.id}` as any}
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-x-reverse space-y-0 rounded-xl border p-3 shadow-sm hover:bg-muted/50 transition-all cursor-pointer">
            <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isSubmitting} /></FormControl>
            <div className="space-y-1 leading-none mr-2">
              <FormLabel className="font-bold flex items-center gap-2 text-xs">
                <perm.icon className="h-3.5 w-3.5 text-primary" /> {perm.label}
              </FormLabel>
              <FormDescription className="text-[10px]">{perm.desc}</FormDescription>
            </div>
          </FormItem>
        )}
      />
    ));
  }, [form.control, isSubmitting, role]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 font-bold shadow-lg"><UserPlus className="h-4 w-4" /> إضافة كادر جديد</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader className="text-right">
          <DialogTitle className="flex items-center gap-2 text-xl font-black text-primary">
            <ShieldCheck className="h-6 w-6" /> التجنيد والهيكل الإداري
          </DialogTitle>
          <DialogDescription className="text-xs">
            إدخال القيد المدني وتحديد الرتبة والملف المالي في النواة السحابية [SC-806].
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-dashed pb-4">
              <FormField control={form.control} name="fullName" render={({ field }) => (
                <FormItem><FormLabel>الاسم الرباعي</FormLabel><FormControl><Input placeholder="الاسم كما في الهوية" {...field} disabled={isSubmitting} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="nationalId" render={({ field }) => (
                <FormItem><FormLabel>الرقم الوطني</FormLabel><FormControl><Input placeholder="10 خانات رقمية" {...field} maxLength={10} disabled={isSubmitting} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/10 p-4 rounded-xl border border-dashed">
              <FormField control={form.control} name="role" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary font-bold flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> الرتبة</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="admin">مدير نظام</SelectItem>
                      <SelectItem value="operations_manager">مدير عمليات</SelectItem>
                      <SelectItem value="developer">مبرمج/تقني</SelectItem>
                      <SelectItem value="support">دعم فني</SelectItem>
                      <SelectItem value="agent" className="font-black text-blue-600">وكيل سيادي (Agent)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="workType" render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1"><Briefcase className="h-3 w-3" /> طبيعة العمل</FormLabel>
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
                  <FormLabel className="flex items-center gap-1"><DollarSign className="h-3 w-3" /> نظام الأجور</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="monthly">راتب شهري</SelectItem>
                      <SelectItem value="hourly">نظام المياومة</SelectItem>
                      <SelectItem value="commission" className="font-bold">نظام العمولات</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              {role === 'agent' && (
                <div className="col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4 mt-2 animate-in zoom-in-95 duration-300">
                  <FormField control={form.control} name="agentTarget" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1 text-blue-600 font-bold"><Target className="h-3 w-3" /> هدف الرحلات (Target)</FormLabel>
                      <FormControl><Input type="number" {...field} disabled={isSubmitting} className="font-bold border-blue-200" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="agentBonus" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1 text-emerald-600 font-bold"><Gift className="h-3 w-3" /> مكافأة الهدف (Bonus)</FormLabel>
                      <FormControl><Input type="number" {...field} disabled={isSubmitting} className="font-bold border-emerald-200" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="commissionRate" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1 text-orange-600 font-bold"><Zap className="h-3 w-3" /> عمولة الرحلة (اختياري)</FormLabel>
                      <FormControl><Input type="number" {...field} disabled={isSubmitting} className="font-bold border-orange-200" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              )}

              {paymentSystem === 'monthly' && role !== 'agent' && (
                <FormField control={form.control} name="baseSalary" render={({ field }) => (
                  <FormItem className="col-span-3 animate-in slide-in-from-top-2">
                    <FormLabel>الراتب الأساسي (JOD)</FormLabel>
                    <FormControl><Input type="number" {...field} disabled={isSubmitting} className="font-mono font-bold text-lg" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-primary/5 p-4 rounded-xl border border-primary/20">
              <div className="space-y-2">
                <FormLabel className="text-primary font-bold">📧 البريد المولد للوكيل</FormLabel>
                <Input value={form.watch('email')} readOnly className="bg-background font-mono text-xs" dir="ltr" />
              </div>
              <div className="space-y-2">
                <FormLabel className="text-destructive font-bold">🔑 رمز PIN المبدئي</FormLabel>
                <div className="bg-background border rounded-lg px-3 py-2 font-mono font-black text-center tracking-widest text-lg text-destructive shadow-inner">
                  {form.watch('tempPassword') || '----'}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-sm text-muted-foreground flex items-center gap-2">
                <Activity className="h-4 w-4" /> مصفوفة الصلاحيات
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {renderedPermissions}
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button type="submit" className="w-full font-black text-lg h-14 shadow-2xl" disabled={!form.watch('email') || isSubmitting}>
                {isSubmitting ? <Loader2 className="ml-2 h-5 w-5 animate-spin" /> : <ShieldCheck className="ml-2 h-5 w-5" />}
                اعتماد وتفعيل الوكيل السيادي
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}