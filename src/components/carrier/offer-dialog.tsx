// 'use client';

// import { useState, useMemo, useEffect, useCallback } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from '@/components/ui/dialog';
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { useToast } from '@/hooks/use-toast';
// import type { Trip, Offer } from '@/lib/data';
// import { FinancialLogic } from '@/lib/financial-logic';
// import { Loader2, Send, ListChecks, Clock, Save } from 'lucide-react';
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
// import { useUserProfile } from '@/hooks/use-user-profile';
// import { Badge } from '../ui/badge';
// import { updateDoc } from 'firebase/firestore';
// import { useCountryPricing } from '@/hooks/use-country-pricing';
// import { COUNTRY_CODE_MAP } from '@/lib/constants';
// import { useLocale, useTranslations } from 'next-intl';

// const offerFormSchema = z.object({
//   price: z.coerce.number().positive('يجب أن يكون السعر رقماً موجباً'),
//   currency: z.string().min(1, "العملة مطلوبة").max(10, "رمز العملة طويل جداً"),
//   vehicleType: z.string().min(3, 'نوع المركبة مطلوب'),
//   depositPercentage: z.coerce.number().min(0, "العربون لا يمكن أن يكون سالباً"),
//   notes: z.string().optional(),
//   conditions: z.string().max(200, "الشروط يجب ألا تتجاوز 200 حرف").optional(),
//   estimatedDurationHours: z.coerce.number().min(1, "يجب تحديد مدة ساعة واحدة على الأقل").max(48, "المدة طويلة جداً"),
// });

// type OfferFormValues = z.infer<typeof offerFormSchema>;

// interface OfferDialogProps {
//   isOpen: boolean;
//   onOpenChange: (isOpen: boolean) => void;
//   trip: Trip;
//   onSendOffer: (offerData: Omit<Offer, 'id' | 'tripId' | 'carrierId' | 'status' | 'createdAt'>) => Promise<boolean>;
// }

// /**
//  * @component OfferDialog
//  * @description THE STERILIZED OFFER HANDLER (V4.0 - SCR-988 - AI PURGED)
//  * [SCR-988]: Surgical Removal of AI props to fix build. Sovereign manual pricing only.
//  * Protocol 16: Sterilized. Protocol 88: Zero-Waste.
//  */
// export function OfferDialog({ isOpen, onOpenChange, trip, onSendOffer }: OfferDialogProps) {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const { profile, userProfileRef } = useUserProfile();
//   const { toast } = useToast();
//   const t = useTranslations('carrier');
//   const locale = useLocale();
//   const form = useForm<OfferFormValues>({
//     resolver: zodResolver(offerFormSchema),
//     defaultValues: {
//       price: 0,
//       vehicleType: '',
//       depositPercentage: 10,
//       notes: '',
//       conditions: '',
//       currency: 'د.أ',
//       estimatedDurationHours: 1,
//     },
//   });

//   const [templates, setTemplates] = useState<{ name: string, price: number, notes: string }[]>([]);
//   const [templateName, setTemplateName] = useState('');

//   const priceValue = form.watch('price');
//   const notesValue = form.watch('notes');
//   const conditionsValue = form.watch('conditions');
//   const depositPercentageValue = form.watch('depositPercentage');

//   const carrierCountryCode = useMemo(() => {
//     return (profile?.jurisdiction?.origin && COUNTRY_CODE_MAP[profile.jurisdiction.origin]) || 'JO';
//   }, [profile?.jurisdiction?.origin]);

//   const { rule: pricingRule } = useCountryPricing(carrierCountryCode);

//   useEffect(() => {
//     if (isOpen && pricingRule) {
//       // form.setValue('currency', pricingRule.currency, { shouldValidate: true });
//       form.setValue('price', trip.targetPrice || 0);
//       form.setValue('vehicleType', profile?.vehicleType || '');
//       form.setValue('currency', profile?.currency || 'د.أ');          // ← أضف
//       form.setValue('estimatedDurationHours', (trip as any).estimatedDurationHours || 1); // ← أضف
//     }
//   }, [isOpen, profile, trip, pricingRule, form]);

//   useEffect(() => {
//     if (isOpen) {
//       try {
//         const localSaved = localStorage.getItem('carrier_offer_templates_v1');
//         if (localSaved && localSaved.trim().startsWith('[')) {
//           const parsed = JSON.parse(localSaved);
//           if (Array.isArray(parsed)) setTemplates(parsed);
//         } else if (profile?.savedTemplates) {
//           setTemplates(profile.savedTemplates);
//           localStorage.setItem('carrier_offer_templates_v1', JSON.stringify(profile.savedTemplates));
//         }
//       } catch (e) {
//         console.warn("Template load warning", e);
//       }
//     }
//   }, [isOpen, profile]);

//   const saveTemplate = useCallback(async () => {
//     if (!templateName || !priceValue) return;
//     const newTemplate = { name: templateName, price: priceValue, notes: notesValue || '' };
//     const updated = [...templates, newTemplate];
//     setTemplates(updated);
//     localStorage.setItem('carrier_offer_templates_v1', JSON.stringify(updated));
//     setTemplateName('');
//     if (userProfileRef) updateDoc(userProfileRef, { savedTemplates: updated });
//     toast({ title: t('templateSaved') });
//   }, [templateName, priceValue, notesValue, templates, userProfileRef, toast]);

//   const loadTemplate = useCallback((t: { price: number, notes: string }) => {
//     form.setValue('price', t.price, { shouldValidate: true });
//     if (t.notes) form.setValue('notes', t.notes, { shouldValidate: true });
//   }, [form]);

//   const depositAmount = useMemo(() => {
//     return FinancialLogic.calculateDeposit(priceValue || 0, depositPercentageValue);
//   }, [priceValue, depositPercentageValue]);

//   useEffect(() => {
//     if (isOpen) {
//       form.setValue('price', trip.targetPrice || 0);
//       form.setValue('vehicleType', profile?.vehicleType || '');
//       const defaultConditions = [];
//       if (profile?.bagsPerSeat) defaultConditions.push(`${t('bagPerPassenger')}  ${profile.bagsPerSeat} ${t('perPassenger')}`);
//       if (profile?.numberOfStops !== undefined) {
//         if (profile.numberOfStops === 0) defaultConditions.push(t('directTrip'));
//         else defaultConditions.push(`${t('tripsWithStops')} ${profile.numberOfStops} ${t('stopStation')}`);
//       }
//       if (defaultConditions.length > 0) form.setValue('conditions', defaultConditions.join('\n'));
//     }
//   }, [profile, isOpen, trip.targetPrice, form]);

//   const onSubmit = useCallback(async (data: OfferFormValues) => {
//     if (!profile) return;
//     if (data.depositPercentage > 0 && (!profile.paymentInformation || profile.paymentInformation.trim().length < 5)) {
//       toast({ variant: "destructive", title: t('missingPayment'), description: t('missingPaymentDesc') });
//       return;
//     }
//     setIsSubmitting(true);
//     const offerPayload: any = {
//       ...data,
//       notes: data.notes ?? '',
//       conditions: data.conditions ?? '',
//       vehicleCategory: (profile?.vehicleCapacity || 0) > 7 ? 'bus' : 'small',
//       availableSeats: profile?.vehicleCapacity || 0,
//     };
//     if (profile?.vehicleYear) {
//       const parsed = parseInt(profile.vehicleYear, 10);
//       if (!isNaN(parsed)) offerPayload.vehicleModelYear = parsed;
//     }
//     const success = await onSendOffer(offerPayload);
//     if (success) {
//       onOpenChange(false);
//       form.reset();
//     }
//     setIsSubmitting(false);
//   }, [profile, onSendOffer, onOpenChange, form, toast]);

//   return (
//     <Dialog open={isOpen} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[480px]">
//         <DialogHeader>
//           <DialogTitle>{t('offerTitle')}</DialogTitle>
//           <DialogDescription>{t('offerDesc')} {trip.origin} {t('offerTo')}  {trip.destination}.</DialogDescription>
//         </DialogHeader>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//             <div className="flex items-center justify-between gap-2 bg-muted/30 p-2 rounded-lg border border-dashed">
//               <div className="flex gap-2 items-center overflow-x-auto">
//                 {templates.map((t, idx) => (
//                   <Badge key={idx} variant="outline" className="cursor-pointer" onClick={() => loadTemplate(t)}>{t.name}</Badge>
//                 ))}
//               </div>
//               <div className="flex items-center gap-1 flex-shrink-0">
//                 <Input placeholder={t('templateNamePlaceholder')} className="h-7 w-24 text-xs" value={templateName} onChange={(e) => setTemplateName(e.target.value)} />
//                 <Button type="button" size="icon" variant="ghost" className="h-7 w-7" onClick={saveTemplate} disabled={!templateName || !priceValue}><Save className="h-3 w-3" /></Button>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <FormField control={form.control} name="price" render={({ field }) => (
//                 <FormItem><FormLabel>{t('totalPrice')}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
//               )} />
//               {/* <FormField control={form.control} name="currency" render={({ field }) => (
//                 <FormItem><FormLabel>{t('currency')}</FormLabel><FormControl><Input {...field} disabled className="bg-muted/50 font-mono" /></FormControl><FormMessage /></FormItem>
//               )} /> */}
//               <FormField control={form.control} name="currency" render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>{t('currency')}</FormLabel>
//                   <FormControl>
//                     <Input {...field} disabled className="bg-muted/50 font-mono cursor-not-allowed" />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )} />
//             </div>

//             <FormField control={form.control} name="depositPercentage" render={({ field }) => (
//               <FormItem>
//                 <div className="flex justify-between items-center mb-2">
//                   <FormLabel>{t('depositRate')}</FormLabel>
//                   <span className="text-sm font-bold text-primary">{t('depositValue')} {depositAmount} {form.watch('currency')}</span>
//                 </div>
//                 <Select onValueChange={(value) => field.onChange(parseInt(value))} value={String(field.value)}>
//                   <FormControl><SelectTrigger><SelectValue placeholder={t('depositPlaceholder')} /></SelectTrigger></FormControl>
//                   <SelectContent>{[0, 5, 10, 15, 20, 25, 30, 40, 50, 75, 100].map(p => <SelectItem key={p} value={String(p)}>{p}%</SelectItem>)}</SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//             />

//             <div className="grid grid-cols-2 gap-4">
//               <FormField control={form.control} name="vehicleType" render={({ field }) => (
//                 <FormItem><FormLabel>{t('vehicleType')}</FormLabel><FormControl><Input placeholder="e.g., GMC Yukon 2023" {...field} /></FormControl><FormMessage /></FormItem>
//               )} />
//               {/* <FormField control={form.control} name="estimatedDurationHours" render={({ field }) => (
//                 <FormItem><FormLabel className="flex items-center gap-1"><Clock className="w-4" />{t('duration')} </FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
//               )} /> */}
//               <FormField control={form.control} name="estimatedDurationHours" render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="flex items-center gap-1"><Clock className="w-4" />{t('duration')}</FormLabel>
//                   <FormControl>
//                     <Input type="number" {...field} disabled className="bg-muted/50 cursor-not-allowed" />
//                   </FormControl>
//                   <p className="text-xs text-muted-foreground">مدة الرحلة المحددة عند إنشاء الرحلة</p>
//                   <FormMessage />
//                 </FormItem>
//               )} />
//             </div>

//             <FormField control={form.control} name="conditions" render={({ field }) => (
//               <FormItem><FormLabel><ListChecks className="h-4 w-4" />{t('offerConditions')}</FormLabel><FormControl><Textarea {...field} maxLength={200} /></FormControl><div className="text-xs text-muted-foreground text-left">{conditionsValue?.length || 0}/200</div><FormMessage /></FormItem>
//             )} />
//             <DialogFooter className="gap-2 flex">
//               <Button type="button" variant="secondary" onClick={() => onOpenChange(false)} disabled={isSubmitting}>{t('cancel')}</Button>
//               <Button type="submit" disabled={isSubmitting}>{isSubmitting ? <><Loader2 className="ml-2 h-4 w-4 animate-spin" />{t('sending')}</> : <><Send className="ml-2 h-4 w-4" />{t('sendOffer')}</>}</Button>
//             </DialogFooter>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// }

'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { Trip, Offer } from '@/lib/data';
import { FinancialLogic } from '@/lib/financial-logic';
import { Loader2, Send, ListChecks, Clock, Save } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { useUserProfile } from '@/hooks/use-user-profile';
import { Badge } from '../ui/badge';
import { updateDoc } from 'firebase/firestore';
import { useCountryPricing } from '@/hooks/use-country-pricing';
import { COUNTRY_CODE_MAP } from '@/lib/constants';
import { useLocale, useTranslations } from 'next-intl';

const offerFormSchema = z.object({
  price: z.coerce.number().positive('يجب أن يكون السعر رقماً موجباً'),
  currency: z.string().min(1, "العملة مطلوبة").max(10, "رمز العملة طويل جداً"),
  vehicleType: z.string().min(3, 'نوع المركبة مطلوب'),
  depositPercentage: z.coerce.number().min(0, "العربون لا يمكن أن يكون سالباً"),
  notes: z.string().optional(),
  conditions: z.string().max(200, "الشروط يجب ألا تتجاوز 200 حرف").optional(),
  estimatedDurationHours: z.coerce.number().min(1, "يجب تحديد مدة ساعة واحدة على الأقل").max(48, "المدة طويلة جداً"),
});

type OfferFormValues = z.infer<typeof offerFormSchema>;

interface OfferDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  trip: Trip;
  onSendOffer: (offerData: Omit<Offer, 'id' | 'tripId' | 'carrierId' | 'status' | 'createdAt'>) => Promise<boolean>;
}

/**
 * @component OfferDialog
 * @description THE STERILIZED OFFER HANDLER (V4.0 - SCR-988 - AI PURGED)
 * [SCR-988]: Surgical Removal of AI props to fix build. Sovereign manual pricing only.
 * Protocol 16: Sterilized. Protocol 88: Zero-Waste.
 */
export function OfferDialog({ isOpen, onOpenChange, trip, onSendOffer }: OfferDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { profile, userProfileRef } = useUserProfile();
  const { toast } = useToast();
  const t = useTranslations('carrier');
  const locale = useLocale();
  const form = useForm<OfferFormValues>({
    resolver: zodResolver(offerFormSchema),
    defaultValues: {
      price: 0,
      vehicleType: '',
      depositPercentage: 10,
      notes: '',
      conditions: '',
      currency: 'د.أ',
      estimatedDurationHours: 1,
    },
  });

  const [templates, setTemplates] = useState<{ name: string, price: number, notes: string }[]>([]);
  const [templateName, setTemplateName] = useState('');

  const priceValue = form.watch('price');
  const notesValue = form.watch('notes');
  const conditionsValue = form.watch('conditions');
  const depositPercentageValue = form.watch('depositPercentage');

  const carrierCountryCode = useMemo(() => {
    return (profile?.jurisdiction?.origin && COUNTRY_CODE_MAP[profile.jurisdiction.origin]) || 'JO';
  }, [profile?.jurisdiction?.origin]);

  const { rule: pricingRule } = useCountryPricing(carrierCountryCode);

  useEffect(() => {
    if (isOpen && pricingRule) {
      // form.setValue('currency', pricingRule.currency, { shouldValidate: true });
      form.setValue('price', trip.targetPrice || 0);
      form.setValue('vehicleType', profile?.vehicleType || '');
      form.setValue('currency', profile?.currency || 'د.أ');          // ← أضف
      form.setValue('estimatedDurationHours', (trip as any).estimatedDurationHours || 1); // ← أضف
    }
  }, [isOpen, profile, trip, pricingRule, form]);

  useEffect(() => {
    if (isOpen) {
      try {
        const localSaved = localStorage.getItem('carrier_offer_templates_v1');
        if (localSaved && localSaved.trim().startsWith('[')) {
          const parsed = JSON.parse(localSaved);
          if (Array.isArray(parsed)) setTemplates(parsed);
        } else if (profile?.savedTemplates) {
          setTemplates(profile.savedTemplates);
          localStorage.setItem('carrier_offer_templates_v1', JSON.stringify(profile.savedTemplates));
        }
      } catch (e) {
        console.warn("Template load warning", e);
      }
    }
  }, [isOpen, profile]);

  const saveTemplate = useCallback(async () => {
    if (!templateName || !priceValue) return;
    const newTemplate = { name: templateName, price: priceValue, notes: notesValue || '' };
    const updated = [...templates, newTemplate];
    setTemplates(updated);
    localStorage.setItem('carrier_offer_templates_v1', JSON.stringify(updated));
    setTemplateName('');
    if (userProfileRef) updateDoc(userProfileRef, { savedTemplates: updated });
    toast({ title: t('templateSaved') });
  }, [templateName, priceValue, notesValue, templates, userProfileRef, toast]);

  const loadTemplate = useCallback((t: { price: number, notes: string }) => {
    form.setValue('price', t.price, { shouldValidate: true });
    if (t.notes) form.setValue('notes', t.notes, { shouldValidate: true });
  }, [form]);

  const depositAmount = useMemo(() => {
    return FinancialLogic.calculateDeposit(priceValue || 0, depositPercentageValue);
  }, [priceValue, depositPercentageValue]);

  useEffect(() => {
    if (isOpen) {
      form.setValue('price', trip.targetPrice || 0);
      form.setValue('vehicleType', profile?.vehicleType || '');
      const defaultConditions = [];
      if (profile?.bagsPerSeat) defaultConditions.push(`${t('bagPerPassenger')}  ${profile.bagsPerSeat} ${t('perPassenger')}`);
      if (profile?.numberOfStops !== undefined) {
        if (profile.numberOfStops === 0) defaultConditions.push(t('directTrip'));
        else defaultConditions.push(`${t('tripsWithStops')} ${profile.numberOfStops} ${t('stopStation')}`);
      }
      if (defaultConditions.length > 0) form.setValue('conditions', defaultConditions.join('\n'));
    }
  }, [profile, isOpen, trip.targetPrice, form]);

  const onSubmit = useCallback(async (data: OfferFormValues) => {
    if (!profile) return;

    // [FIX]: تحقق من paymentWallets (الـ structured wallets) بدل paymentInformation (النص المكومنت)
    // الناقل بيحفظ بيانات الدفع كـ paymentWallets في صفحة الشروط الدائمة
    const hasPaymentMethod =
      (profile.paymentWallets && profile.paymentWallets.length > 0) ||
      (profile.paymentInformation && profile.paymentInformation.trim().length >= 5);

    if (data.depositPercentage > 0 && !hasPaymentMethod) {
      toast({ variant: "destructive", title: t('missingPayment'), description: t('missingPaymentDesc') });
      return;
    }
    setIsSubmitting(true);
    const offerPayload: any = {
      ...data,
      notes: data.notes ?? '',
      conditions: data.conditions ?? '',
      vehicleCategory: (profile?.vehicleCapacity || 0) > 7 ? 'bus' : 'small',
      availableSeats: profile?.vehicleCapacity || 0,
    };
    if (profile?.vehicleYear) {
      const parsed = parseInt(profile.vehicleYear, 10);
      if (!isNaN(parsed)) offerPayload.vehicleModelYear = parsed;
    }
    const success = await onSendOffer(offerPayload);
    if (success) {
      onOpenChange(false);
      form.reset();
    }
    setIsSubmitting(false);
  }, [profile, onSendOffer, onOpenChange, form, toast]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{t('offerTitle')}</DialogTitle>
          <DialogDescription>{t('offerDesc')} {trip.origin} {t('offerTo')}  {trip.destination}.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-center justify-between gap-2 bg-muted/30 p-2 rounded-lg border border-dashed">
              <div className="flex gap-2 items-center overflow-x-auto">
                {templates.map((t, idx) => (
                  <Badge key={idx} variant="outline" className="cursor-pointer" onClick={() => loadTemplate(t)}>{t.name}</Badge>
                ))}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Input placeholder={t('templateNamePlaceholder')} className="h-7 w-24 text-xs" value={templateName} onChange={(e) => setTemplateName(e.target.value)} />
                <Button type="button" size="icon" variant="ghost" className="h-7 w-7" onClick={saveTemplate} disabled={!templateName || !priceValue}><Save className="h-3 w-3" /></Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="price" render={({ field }) => (
                <FormItem><FormLabel>{t('totalPrice')}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              {/* <FormField control={form.control} name="currency" render={({ field }) => (
                <FormItem><FormLabel>{t('currency')}</FormLabel><FormControl><Input {...field} disabled className="bg-muted/50 font-mono" /></FormControl><FormMessage /></FormItem>
              )} /> */}
              <FormField control={form.control} name="currency" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('currency')}</FormLabel>
                  <FormControl>
                    <Input {...field} disabled className="bg-muted/50 font-mono cursor-not-allowed" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="depositPercentage" render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center mb-2">
                  <FormLabel>{t('depositRate')}</FormLabel>
                  <span className="text-sm font-bold text-primary">{t('depositValue')} {depositAmount} {form.watch('currency')}</span>
                </div>
                <Select onValueChange={(value) => field.onChange(parseInt(value))} value={String(field.value)}>
                  <FormControl><SelectTrigger><SelectValue placeholder={t('depositPlaceholder')} /></SelectTrigger></FormControl>
                  <SelectContent>{[0, 5, 10, 15, 20, 25, 30, 40, 50, 75, 100].map(p => <SelectItem key={p} value={String(p)}>{p}%</SelectItem>)}</SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="vehicleType" render={({ field }) => (
                <FormItem><FormLabel>{t('vehicleType')}</FormLabel><FormControl><Input placeholder="e.g., GMC Yukon 2023" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              {/* <FormField control={form.control} name="estimatedDurationHours" render={({ field }) => (
                <FormItem><FormLabel className="flex items-center gap-1"><Clock className="w-4" />{t('duration')} </FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
              )} /> */}
              <FormField control={form.control} name="estimatedDurationHours" render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1"><Clock className="w-4" />{t('duration')}</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} disabled className="bg-muted/50 cursor-not-allowed" />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">{t('tripDuration')}</p>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="conditions" render={({ field }) => (
              <FormItem><FormLabel><ListChecks className="h-4 w-4" />{t('offerConditions')}</FormLabel><FormControl><Textarea {...field} maxLength={200} /></FormControl><div className="text-xs text-muted-foreground text-left">{conditionsValue?.length || 0}/200</div><FormMessage /></FormItem>
            )} />
            <DialogFooter className="gap-2 flex">
              <Button type="button" variant="secondary" onClick={() => onOpenChange(false)} disabled={isSubmitting}>{t('cancel')}</Button>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? <><Loader2 className="ml-2 h-4 w-4 animate-spin" />{t('sending')}</> : <><Send className="ml-2 h-4 w-4" />{t('sendOffer')}</>}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}