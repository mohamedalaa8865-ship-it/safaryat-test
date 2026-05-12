// 'use client';

// import { useState, useEffect, useMemo, useRef } from 'react';
// import { useTranslations } from 'next-intl';
// import { useUserProfile } from '@/hooks/use-user-profile';
// import { updateDoc, serverTimestamp } from 'firebase/firestore';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { Button } from '@/components/ui/button';
// import { Label } from '@/components/ui/label';
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Textarea } from '@/components/ui/textarea';
// import { Input } from '@/components/ui/input';
// import { Loader2, Save, ListChecks, Wallet, ShieldAlert, Plus, Trash2, Banknote, CreditCard, Landmark } from 'lucide-react';
// import { useToast } from '@/hooks/use-toast';
// import { useRouter } from 'next/navigation';
// import { useCarrierSubscription } from '@/hooks/use-carrier-subscription';
// import { triggerHaptic } from '@/lib/utils';
// import type { PaymentWallet } from '@/lib/data';
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from '@/components/ui/accordion';
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form';

// const pageSchema = z.object({
//   price: z.coerce.number().positive('السعر يجب أن يكون رقماً موجباً').optional(),
//   currency: z.string().default('د.أ'),
//   depositPercentage: z.coerce.number().min(0).default(10),
//   conditions: z.string().max(200).optional(),
// });

// type PageFormValues = z.infer<typeof pageSchema>;

// /**
//  * @page CarrierPermanentPage
//  * @description THE REINFORCED STABILITY FORM (V2.0 - SCR-063)
//  * [SCR-063]: Injected Sovereign Wallet Matrix for structured payments.
//  * Protocol 16: Sterilized. Protocol 13: High Contrast interactions.
//  */
// export default function CarrierPermanentPage() {
//   const t = useTranslations('carrierConditions');
//   const tCommon = useTranslations('common');
//   const tError = useTranslations('errorDictionary');
//   const { profile, isLoading, userProfileRef } = useUserProfile();
//   const { isMarketActive, marketRule, status: subStatus } = useCarrierSubscription(profile);
//   const { toast } = useToast();
//   const router = useRouter();
//   const isInitialized = useRef(false);

//   const [wallets, setWallets] = useState<PaymentWallet[]>([]);
//   const [isAddingWallet, setIsAddingWallet] = useState(false);
//   const [newWallet, setNewWallet] = useState<Partial<PaymentWallet>>({
//     type: 'wallet',
//     provider: '',
//     accountNumber: '',
//     holderName: '',
//     isPrimary: false
//   });

//   const [formData, setFormData] = useState({
//     paymentInformation: '',
//     bagsPerSeat: '1',
//     numberOfStops: '0',
//     vehicleType: '',
//     vehicleYear: '',
//     plateNumber: '',
//     vehicleCapacity: '',
//     jurisdictionOrigin: '',
//     jurisdictionDest: '',
//     officeName: '',
//     officePhone: '',
//     sidePanelNumber: '',
//     vehicleCategory: '',
//   });

//   const [isSaving, setIsSaving] = useState(false);

//   const form = useForm<PageFormValues>({
//     resolver: zodResolver(pageSchema),
//     defaultValues: {
//       price: undefined,
//       currency: 'د.أ',
//       depositPercentage: 10,
//       conditions: '',
//     },
//   });

//   useEffect(() => {
//     if (profile && !isInitialized.current) {
//       setFormData({
//         paymentInformation: profile.paymentInformation || '',
//         bagsPerSeat: profile.bagsPerSeat?.toString() || '1',
//         numberOfStops: profile.numberOfStops?.toString() || '0',
//         vehicleType: profile.vehicleType || '',
//         vehicleYear: profile.vehicleYear || '',
//         plateNumber: profile.plateNumber || '',
//         vehicleCapacity: profile.vehicleCapacity?.toString() || '',
//         jurisdictionOrigin: profile.jurisdiction?.origin || '',
//         jurisdictionDest: profile.jurisdiction?.destination || '',
//         officeName: profile.officeName || '',
//         officePhone: profile.officePhone || '',
//         sidePanelNumber: profile.sidePanelNumber || '',
//         vehicleCategory: profile.vehicleCategory || '',
//       });

//       setWallets(profile.paymentWallets || []);

//       form.reset({
//         price: profile.price ?? undefined,
//         currency: profile.currency || 'د.أ',
//         depositPercentage: profile.depositPercentage ?? 10,
//         conditions: profile.conditions || '',
//       });
//       isInitialized.current = true;
//     }
//   }, [profile, form]);

//   const handleAddWallet = () => {
//     if (!newWallet.provider || !newWallet.accountNumber) {
//       toast({ variant: 'destructive', title: t('missingData') });
//       return;
//     }
//     const wallet: PaymentWallet = {
//       id: `w_${Date.now()}`,
//       type: newWallet.type as any,
//       provider: newWallet.provider!,
//       accountNumber: newWallet.accountNumber!,
//       holderName: newWallet.holderName || (profile?.firstName + ' ' + (profile?.lastName || '')),
//       isPrimary: wallets.length === 0
//     };
//     setWallets([...wallets, wallet]);
//     setIsAddingWallet(false);
//     setNewWallet({ type: 'wallet', provider: '', accountNumber: '', holderName: '', isPrimary: false });
//     triggerHaptic('success');
//   };

//   const handleRemoveWallet = (id: string) => {
//     setWallets(wallets.filter(w => w.id !== id));
//     triggerHaptic('heavy');
//   };

//   const handleSave = async () => {
//     if (!isMarketActive || !userProfileRef) return;

//     setIsSaving(true);
//     try {
//       const formValues = form.getValues();
//       const capacity = Number(formData.vehicleCapacity);

//       await updateDoc(userProfileRef, {
//         ...formData,
//         paymentWallets: wallets, // Structured Snapshot
//         vehicleCapacity: capacity,
//         vehicleCategory: capacity > 7 ? 'bus' : 'small',
//         price: formValues.price ?? null,
//         currency: formValues.currency,
//         depositPercentage: formValues.depositPercentage,
//         conditions: formValues.conditions || '',
//         updatedAt: serverTimestamp(),
//         isPartial: false,
//       });

//       toast({ title: tCommon('success'), description: t('scsses') });
//       router.push('/carrier');
//     } catch (error: any) {
//       toast({ variant: 'destructive', title: tCommon('error'), description: tError('DEFAULT') });
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   if (isLoading || subStatus === 'loading') return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-primary" /></div>;

//   return (
//     <div className="container max-w-3xl mx-auto p-4 space-y-6 animate-in fade-in duration-700" dir="rtl">
//       <Card className="border-primary/20 shadow-xl overflow-hidden rounded-[2.5rem]">
//         <div className="absolute top-0 right-0 w-1.5 h-full bg-primary" />
//         <CardHeader className="bg-muted/30 p-8 border-b">
//           <CardTitle className="flex items-center gap-3 text-2xl font-black">
//             <ListChecks className="h-8 w-8 text-primary" />
//             {t('titlePermanent')}
//           </CardTitle>
//           <CardDescription className="font-bold text-xs">{t('carrierDec')}</CardDescription>
//         </CardHeader>

//         <CardContent className="p-8 space-y-8">

//           {/* Section: Sovereign Wallet Matrix */}
//           <section className="space-y-4">
//             <div className="flex justify-between items-center px-1">
//               <Label className="text-sm font-black uppercase text-primary flex items-center gap-2"><Wallet className="h-5 w-5" /> {t('wallet')}</Label>
//               <Button variant="outline" size="sm" onClick={() => setIsAddingWallet(true)} className="h-8 rounded-xl font-bold gap-1 border-primary/20">
//                 <Plus className="h-3 w-3" /> {t('addWallet')}
//               </Button>
//             </div>

//             <div className="grid grid-cols-1 gap-3">
//               {wallets.map(w => (
//                 <div key={w.id} className="flex items-center justify-between p-4 bg-muted/20 border border-primary/5 rounded-2xl group hover:border-primary/20 transition-all">
//                   <div className="flex items-center gap-3">
//                     <div className="p-2 bg-background rounded-xl border border-primary/10">
//                       {w.type === 'bank' ? <Landmark className="h-5 w-5 text-blue-500" /> : w.type === 'card' ? <CreditCard className="h-5 w-5 text-orange-500" /> : <Banknote className="h-5 w-5 text-emerald-500" />}
//                     </div>
//                     <div className="text-right">
//                       <p className="text-xs font-black">{w.provider}</p>
//                       <p className="text-[10px] font-mono text-muted-foreground">{w.accountNumber}</p>
//                     </div>
//                   </div>
//                   <Button variant="ghost" size="icon" onClick={() => handleRemoveWallet(w.id)} className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
//                     <Trash2 className="h-4 w-4" />
//                   </Button>
//                 </div>
//               ))}
//               {wallets.length === 0 && (
//                 <div className="p-10 text-center border-2 border-dashed border-primary/10 rounded-3xl opacity-40">
//                   <p className="text-xs font-bold">{t('noWallet')}</p>
//                 </div>
//               )}
//             </div>

//             {isAddingWallet && (
//               <div className="p-6 bg-primary/5 border border-primary/20 rounded-[2rem] space-y-4 animate-in zoom-in-95">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label className="text-[10px] font-black uppercase">{t('type')}</Label>
//                     <Select value={newWallet.type} onValueChange={(v: any) => setNewWallet({ ...newWallet, type: v })}>
//                       <SelectTrigger className="h-11 bg-background"><SelectValue /></SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="wallet">{t('electronicWallet')}</SelectItem>
//                         <SelectItem value="bank">{t('bankingAccount')}</SelectItem>
//                         <SelectItem value="card">{t('payWallet')}</SelectItem>
//                         <SelectItem value="other">{t('other')}</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="text-[10px] font-black uppercase">{t('nameBank')}</Label>
//                     <Input value={newWallet.provider} onChange={e => setNewWallet({ ...newWallet, provider: e.target.value })} placeholder={t('like')} className="h-11 bg-background" />
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label className="text-[10px] font-black uppercase">{t('phonenum')}</Label>
//                     <Input value={newWallet.accountNumber} onChange={e => setNewWallet({ ...newWallet, accountNumber: e.target.value })} placeholder="079XXXXXXX" className="h-11 bg-background font-mono" dir="ltr" />
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="text-[10px] font-black uppercase">{t('userName')}</Label>
//                     <Input value={newWallet.holderName} onChange={e => setNewWallet({ ...newWallet, holderName: e.target.value })} placeholder={t('namePayment')} className="h-11 bg-background" />
//                   </div>
//                 </div>
//                 <div className="flex gap-2">
//                   <Button className="flex-1 font-black" onClick={handleAddWallet}>{t('confirmWallet')}</Button>
//                   <Button variant="ghost" onClick={() => setIsAddingWallet(false)}>{t('cancel')}</Button>
//                 </div>
//               </div>
//             )}
//           </section>

//           <Form {...form}>
//             <Accordion type="single" collapsible className="w-full">
//               <AccordionItem value="financials" className="border-primary/10 rounded-2xl bg-muted/10 px-4">
//                 <AccordionTrigger className="font-black text-sm hover:no-underline text-primary">
//                   <div className="flex items-center gap-2"><Wallet className="h-4 w-4" /> {t('pricingTitle')}</div>
//                 </AccordionTrigger>
//                 <AccordionContent className="pb-6 space-y-4">
//                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                     <FormField control={form.control} name="price" render={({ field }) => (
//                       <FormItem>
//                         <FormLabel className="text-xs font-bold">{t('seatPrice')}</FormLabel>
//                         <FormControl><Input className="h-12 bg-background font-black text-lg" type="number" {...field} value={field.value ?? ''} /></FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )} />
//                     <FormField control={form.control} name="currency" render={({ field }) => (
//                       <FormItem>
//                         <FormLabel className="text-xs font-bold">{t('currency')}</FormLabel>
//                         <FormControl><Input className="h-12 bg-background font-mono" {...field} /></FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )} />
//                     <FormField control={form.control} name="depositPercentage" render={({ field }) => (
//                       <FormItem>
//                         <FormLabel className="text-xs font-bold"> {t('depositPercentage')}</FormLabel>
//                         <Select onValueChange={(value) => field.onChange(parseInt(value))} value={String(field.value)}>
//                           <FormControl><SelectTrigger className="h-12 bg-background"><SelectValue /></SelectTrigger></FormControl>
//                           <SelectContent>
//                             {[0, 5, 10, 15, 20, 25, 30, 40, 50, 75, 100].map(p => (
//                               <SelectItem key={p} value={String(p)}>{p}%</SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                         <FormMessage />
//                       </FormItem>
//                     )} />
//                   </div>
//                 </AccordionContent>
//               </AccordionItem>
//             </Accordion>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
//               <div className="space-y-2">
//                 <Label className="text-xs font-black uppercase text-muted-foreground">{t('bagsLabel')}</Label>
//                 <Select value={formData.bagsPerSeat} onValueChange={val => setFormData({ ...formData, bagsPerSeat: val })}>
//                   <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="0">{t('bagsNone')}</SelectItem>
//                     <SelectItem value="1">{t('bags1')}</SelectItem>
//                     <SelectItem value="2">{t('bags2')}</SelectItem>
//                     <SelectItem value="3">{t('bags3')}</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="space-y-2">
//                 <Label className="text-xs font-black uppercase text-muted-foreground">{t('stopsLabel')}</Label>
//                 <Select value={formData.numberOfStops} onValueChange={val => setFormData({ ...formData, numberOfStops: val })}>
//                   <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="0"> {t('stopsNone')}</SelectItem>
//                     <SelectItem value="1">{t('stops1')} </SelectItem>
//                     <SelectItem value="2">{t('stops2')}</SelectItem>
//                     <SelectItem value="3">{t('stops3')} </SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//           </Form>

//           <Button className="w-full h-16 text-xl font-black rounded-3xl shadow-2xl gap-3 transition-all active:scale-95" onClick={handleSave} disabled={isSaving}>
//             {isSaving ? <Loader2 className="animate-spin h-6 w-6" /> : <><Save className="h-6 w-6" /> {t('saveBtn')}</>}
//           </Button>

//         </CardContent>
//       </Card>
//     </div>
//   );
// }
'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useUserProfile } from '@/hooks/use-user-profile';
import { updateDoc, serverTimestamp } from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Loader2, Save, ListChecks, Wallet, ShieldAlert, Plus, Trash2, Banknote, CreditCard, Landmark } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useCarrierSubscription } from '@/hooks/use-carrier-subscription';
import { triggerHaptic } from '@/lib/utils';
import type { PaymentWallet } from '@/lib/data';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const pageSchema = z.object({
  price: z.coerce.number().positive('السعر يجب أن يكون رقماً موجباً').optional(),
  currency: z.string().default('د.أ'),
  depositPercentage: z.coerce.number().min(0).default(10),
  conditions: z.string().max(200).optional(),
});

type PageFormValues = z.infer<typeof pageSchema>;

/**
 * @page CarrierPermanentPage
 * @description THE REINFORCED STABILITY FORM (V2.0 - SCR-063)
 * [SCR-063]: Injected Sovereign Wallet Matrix for structured payments.
 * Protocol 16: Sterilized. Protocol 13: High Contrast interactions.
 */
export default function CarrierPermanentPage() {
  const t = useTranslations('carrierConditions');
  const tCommon = useTranslations('common');
  const tError = useTranslations('errorDictionary');
  const { profile, isLoading, userProfileRef } = useUserProfile();
  const { isMarketActive, marketRule, status: subStatus } = useCarrierSubscription(profile);
  const { toast } = useToast();
  const router = useRouter();
  const isInitialized = useRef(false);

  const [wallets, setWallets] = useState<PaymentWallet[]>([]);
  const [isAddingWallet, setIsAddingWallet] = useState(false);
  const [newWallet, setNewWallet] = useState<Partial<PaymentWallet>>({
    type: 'wallet',
    provider: '',
    accountNumber: '',
    holderName: '',
    isPrimary: false
  });

  const [formData, setFormData] = useState({
    paymentInformation: '',
    bagsPerSeat: '1',
    numberOfStops: '0',
    vehicleType: '',
    vehicleYear: '',
    plateNumber: '',
    vehicleCapacity: '',
    jurisdictionOrigin: '',
    jurisdictionDest: '',
    officeName: '',
    officePhone: '',
    sidePanelNumber: '',
    vehicleCategory: '',
  });

  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<PageFormValues>({
    resolver: zodResolver(pageSchema),
    defaultValues: {
      price: undefined,
      currency: 'د.أ',
      depositPercentage: 10,
      conditions: '',
    },
  });

  useEffect(() => {
    if (profile && !isInitialized.current) {
      setFormData({
        paymentInformation: profile.paymentInformation || '',
        bagsPerSeat: profile.bagsPerSeat?.toString() || '1',
        numberOfStops: profile.numberOfStops?.toString() || '0',
        vehicleType: profile.vehicleType || '',
        vehicleYear: profile.vehicleYear || '',
        plateNumber: profile.plateNumber || '',
        vehicleCapacity: profile.vehicleCapacity?.toString() || '',
        jurisdictionOrigin: profile.jurisdiction?.origin || '',
        jurisdictionDest: profile.jurisdiction?.destination || '',
        officeName: profile.officeName || '',
        officePhone: profile.officePhone || '',
        sidePanelNumber: profile.sidePanelNumber || '',
        vehicleCategory: profile.vehicleCategory || '',
      });

      setWallets(profile.paymentWallets || []);

      form.reset({
        price: profile.price ?? undefined,
        currency: profile.currency || 'د.أ',
        depositPercentage: profile.depositPercentage ?? 10,
        conditions: profile.conditions || '',
      });
      isInitialized.current = true;
    }
  }, [profile, form]);

  const handleAddWallet = () => {
    if (!newWallet.provider || !newWallet.accountNumber) {
      toast({ variant: 'destructive', title: t('missingData') });
      return;
    }
    const wallet: PaymentWallet = {
      id: `w_${Date.now()}`,
      type: newWallet.type as any,
      provider: newWallet.provider!,
      accountNumber: newWallet.accountNumber!,
      holderName: newWallet.holderName || (profile?.firstName + ' ' + (profile?.lastName || '')),
      isPrimary: wallets.length === 0
    };
    setWallets([...wallets, wallet]);
    setIsAddingWallet(false);
    setNewWallet({ type: 'wallet', provider: '', accountNumber: '', holderName: '', isPrimary: false });
    triggerHaptic('success');
  };

  const handleRemoveWallet = (id: string) => {
    setWallets(wallets.filter(w => w.id !== id));
    triggerHaptic('heavy');
  };

  const handleSave = async () => {
    if (!isMarketActive || !userProfileRef) return;

    // ── Validation: تأكد من البيانات الإلزامية قبل الحفظ ──
    const formValues = form.getValues();

    const missingFields: string[] = [];

    if (wallets.length === 0) {
      missingFields.push(t('wallet'));
    }
    if (!formValues.price || formValues.price <= 0) {
      missingFields.push(t('seatPrice'));
    }

    if (missingFields.length > 0) {
      toast({
        variant: 'destructive',
        title: t('missingData') || 'بيانات ناقصة',
        description: missingFields.join(' • '),
      });
      return;
    }
    // ── نهاية الـ Validation ──

    setIsSaving(true);
    try {
      const capacity = Number(formData.vehicleCapacity);

      await updateDoc(userProfileRef, {
        ...formData,
        paymentWallets: wallets, // Structured Snapshot
        vehicleCapacity: capacity,
        vehicleCategory: capacity > 7 ? 'bus' : 'small',
        price: formValues.price ?? null,
        currency: formValues.currency,
        depositPercentage: formValues.depositPercentage,
        conditions: formValues.conditions || '',
        updatedAt: serverTimestamp(),
        isPartial: false,
        isPermanentComplete: true,
      });

      toast({ title: tCommon('success'), description: t('scsses') });
      router.push('/carrier/profile');
    } catch (error: any) {
      toast({ variant: 'destructive', title: tCommon('error'), description: tError('DEFAULT') });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || subStatus === 'loading') return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="container max-w-3xl mx-auto p-4 space-y-6 animate-in fade-in duration-700" dir="rtl">
      <Card className="border-primary/20 shadow-xl overflow-hidden rounded-[2.5rem]">
        <div className="absolute top-0 right-0 w-1.5 h-full bg-primary" />
        <CardHeader className="bg-muted/30 p-8 border-b">
          <CardTitle className="flex items-center gap-3 text-2xl font-black">
            <ListChecks className="h-8 w-8 text-primary" />
            {t('titlePermanent')}
          </CardTitle>
          <CardDescription className="font-bold text-xs">{t('carrierDec')}</CardDescription>
        </CardHeader>

        <CardContent className="p-8 space-y-8">

          {/* Section: Sovereign Wallet Matrix */}
          <section className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <Label className="text-sm font-black uppercase text-primary flex items-center gap-2"><Wallet className="h-5 w-5" /> {t('wallet')}</Label>
              <Button variant="outline" size="sm" onClick={() => setIsAddingWallet(true)} className="h-8 rounded-xl font-bold gap-1 border-primary/20">
                <Plus className="h-3 w-3" /> {t('addWallet')}
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {wallets.map(w => (
                <div key={w.id} className="flex items-center justify-between p-4 bg-muted/20 border border-primary/5 rounded-2xl group hover:border-primary/20 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-background rounded-xl border border-primary/10">
                      {w.type === 'bank' ? <Landmark className="h-5 w-5 text-blue-500" /> : w.type === 'card' ? <CreditCard className="h-5 w-5 text-orange-500" /> : <Banknote className="h-5 w-5 text-emerald-500" />}
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black">{w.provider}</p>
                      <p className="text-[10px] font-mono text-muted-foreground">{w.accountNumber}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveWallet(w.id)} className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {wallets.length === 0 && (
                <div className="p-10 text-center border-2 border-dashed border-primary/10 rounded-3xl opacity-40">
                  <p className="text-xs font-bold">{t('noWallet')}</p>
                </div>
              )}
            </div>

            {isAddingWallet && (
              <div className="p-6 bg-primary/5 border border-primary/20 rounded-[2rem] space-y-4 animate-in zoom-in-95">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase">{t('type')}</Label>
                    <Select value={newWallet.type} onValueChange={(v: any) => setNewWallet({ ...newWallet, type: v })}>
                      <SelectTrigger className="h-11 bg-background"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wallet">{t('electronicWallet')}</SelectItem>
                        <SelectItem value="bank">{t('bankingAccount')}</SelectItem>
                        <SelectItem value="card">{t('payWallet')}</SelectItem>
                        <SelectItem value="other">{t('other')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase">{t('nameBank')}</Label>
                    <Input value={newWallet.provider} onChange={e => setNewWallet({ ...newWallet, provider: e.target.value })} placeholder={t('like')} className="h-11 bg-background" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase">{t('phonenum')}</Label>
                    <Input value={newWallet.accountNumber} onChange={e => setNewWallet({ ...newWallet, accountNumber: e.target.value })} placeholder="079XXXXXXX" className="h-11 bg-background font-mono" dir="ltr" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase">{t('userName')}</Label>
                    <Input value={newWallet.holderName} onChange={e => setNewWallet({ ...newWallet, holderName: e.target.value })} placeholder={t('namePayment')} className="h-11 bg-background" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1 font-black" onClick={handleAddWallet}>{t('confirmWallet')}</Button>
                  <Button variant="ghost" onClick={() => setIsAddingWallet(false)}>{t('cancel')}</Button>
                </div>
              </div>
            )}
          </section>

          <Form {...form}>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="financials" className="border-primary/10 rounded-2xl bg-muted/10 px-4">
                <AccordionTrigger className="font-black text-sm hover:no-underline text-primary">
                  <div className="flex items-center gap-2"><Wallet className="h-4 w-4" /> {t('pricingTitle')}</div>
                </AccordionTrigger>
                <AccordionContent className="pb-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <FormField control={form.control} name="price" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold">{t('seatPrice')}</FormLabel>
                        <FormControl><Input className="h-12 bg-background font-black text-lg" type="number" {...field} value={field.value ?? ''} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="currency" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold">{t('currency')}</FormLabel>
                        <FormControl><Input className="h-12 bg-background font-mono" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="depositPercentage" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold"> {t('depositPercentage')}</FormLabel>
                        <Select onValueChange={(value) => field.onChange(parseInt(value))} value={String(field.value)}>
                          <FormControl><SelectTrigger className="h-12 bg-background"><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            {[0, 5, 10, 15, 20, 25, 30, 40, 50, 75, 100].map(p => (
                              <SelectItem key={p} value={String(p)}>{p}%</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-muted-foreground">{t('bagsLabel')}</Label>
                <Select value={formData.bagsPerSeat} onValueChange={val => setFormData({ ...formData, bagsPerSeat: val })}>
                  <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">{t('bagsNone')}</SelectItem>
                    <SelectItem value="1">{t('bags1')}</SelectItem>
                    <SelectItem value="2">{t('bags2')}</SelectItem>
                    <SelectItem value="3">{t('bags3')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-muted-foreground">{t('stopsLabel')}</Label>
                <Select value={formData.numberOfStops} onValueChange={val => setFormData({ ...formData, numberOfStops: val })}>
                  <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0"> {t('stopsNone')}</SelectItem>
                    <SelectItem value="1">{t('stops1')} </SelectItem>
                    <SelectItem value="2">{t('stops2')}</SelectItem>
                    <SelectItem value="3">{t('stops3')} </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Form>

          <Button className="w-full h-16 text-xl font-black rounded-3xl shadow-2xl gap-3 transition-all active:scale-95" onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="animate-spin h-6 w-6" /> : <><Save className="h-6 w-6" /> {t('saveBtn')}</>}
          </Button>

        </CardContent>
      </Card>
    </div>
  );
}