// // // // 'use client';

// // // // /**
// // // //  * @component ProxyBookingForm
// // // //  * @description THE STERILIZED AGENT INTAKE (V32.0 - DIAMOND)
// // // //  * [PROTOCOL 16]: Diamond Sterilized. Pure functional island.
// // // //  * [PROTOCOL 88]: Minimalist logic. Consumes unified search artery.
// // // //  * Loose Coupling: Syncs with SmartRadar via shared useSovereignSearch pulse.
// // // //  */

// // // // import React, { useState, useCallback, useEffect } from 'react';
// // // // import { useForm, useFieldArray } from 'react-hook-form';
// // // // import { Button } from '@/components/ui/button';
// // // // import { Input } from '@/components/ui/input';
// // // // import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
// // // // import { Zap, CheckCircle2, Loader2, Share2, PlusCircle, UserCheck, PlaneTakeoff, PlaneLanding } from 'lucide-react';
// // // // import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
// // // // import { collection, query, where, limit } from 'firebase/firestore';
// // // // import { useToast } from '@/hooks/use-toast';
// // // // import { triggerHaptic, cn } from '@/lib/utils';
// // // // import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// // // // import { Badge } from '@/components/ui/badge';
// // // // import { getCityName } from '@/lib/constants';
// // // // import { usePassengerShield } from '@/hooks/use-passenger-shield';
// // // // import { usePassengerMemory } from '@/hooks/use-passenger-memory';
// // // // import { useLocale } from 'next-intl';
// // // // import { useAgentOps } from '@/hooks/use-agent-ops';
// // // // import { useSovereignSearch } from '@/hooks/use-sovereign-search';

// // // // export function ProxyBookingForm() {
// // // //   const { user } = useUser();
// // // //   const firestore = useFirestore();
// // // //   const locale = useLocale();
// // // //   const { toast } = useToast();

// // // //   // [SSOT ARTERY]: Sharing context with the Radar via URL persistent filters
// // // //   const { filters: sharedRadarData } = useSovereignSearch();
// // // //   const { isSubmitting, magicLink, setMagicLink, submitProxyBooking } = useAgentOps(user?.uid || '');

// // // //   const [carrierSearch, setCarrierSearch] = useState('');
// // // //   const [selectedCarrier, setSelectedCarrier] = useState<{ id: string, name: string } | null>(null);

// // // //   const form = useForm({
// // // //     defaultValues: {
// // // //       passengers: [{ passengerName: '', passengerPhone: '', nationality: '', documentId: '', passengerType: 'adult' }],
// // // //       agentFee: 0
// // // //     }
// // // //   });

// // // //   const { fields, replace } = useFieldArray({ control: form.control, name: "passengers" });

// // // //   // [PROTOCOL 16]: Dynamic Seat Balancing - Keeps form in sync with Radar choices
// // // //   useEffect(() => {
// // // //     const requiredSeats = sharedRadarData?.seats || 1;
// // // //     if (fields.length !== requiredSeats) {
// // // //       replace(Array.from({ length: requiredSeats }, (_, i) => ({
// // // //         passengerName: '', passengerPhone: '', nationality: '', documentId: '', passengerType: 'adult'
// // // //       })));
// // // //     }
// // // //   }, [sharedRadarData?.seats, replace, fields.length]);

// // // //   // [PROTOCOL 88]: Carrier Discovery - Limited to context
// // // //   const carriersQuery = useMemoFirebase(() => {
// // // //     if (!firestore || !sharedRadarData?.originCity) return null;
// // // //     return query(collection(firestore, 'users'), where('role', '==', 'carrier'), where('jurisdiction.origin', '==', sharedRadarData.originCity), limit(20));
// // // //   }, [firestore, sharedRadarData?.originCity]);
// // // //   const { data: availableCarriers } = useCollection(carriersQuery);

// // // //   const filteredCarriers = (availableCarriers || []).filter(c => {
// // // //     const term = carrierSearch.toLowerCase();
// // // //     return c.firstName?.toLowerCase().includes(term) || c.officeName?.toLowerCase().includes(term);
// // // //   }).slice(0, 5);

// // // //   // [PROTOCOL 16]: Identity Recall Reactor
// // // //   const watchPrimaryPhone = form.watch('passengers.0.passengerPhone');
// // // //   const { rememberedData } = usePassengerMemory(watchPrimaryPhone);
// // // //   const { hasActiveTrip } = usePassengerShield(watchPrimaryPhone);

// // // //   useEffect(() => {
// // // //     if (rememberedData && !form.getValues('passengers.0.passengerName')) {
// // // //       form.setValue('passengers.0.passengerName', rememberedData.name);
// // // //       form.setValue('passengers.0.nationality', rememberedData.nationality);
// // // //       form.setValue('passengers.0.documentId', rememberedData.documentId);
// // // //       form.setValue('passengers.0.passengerType', rememberedData.type as any);
// // // //     }
// // // //   }, [rememberedData, form]);

// // // //   const onSubmit = useCallback(async (data: any) => {
// // // //     if (hasActiveTrip || !sharedRadarData?.originCity) return;

// // // //     await submitProxyBooking({
// // // //         passengers: data.passengers, 
// // // //         agentFee: Number(data.agentFee), 
// // // //         targetCarrierId: selectedCarrier?.id,
// // // //         originCountry: sharedRadarData.originCountry, 
// // // //         originCity: sharedRadarData.originCity,
// // // //         destCountry: sharedRadarData.destCountry, 
// // // //         destCity: sharedRadarData.destCity,
// // // //         departureDate: sharedRadarData.travelDate?.toISOString(), 
// // // //         passengersCount: sharedRadarData.seats || 1,
// // // //         requestType: selectedCarrier?.id ? 'Direct' : 'General'
// // // //     }, () => {
// // // //         triggerHaptic('success');
// // // //     });
// // // //   }, [submitProxyBooking, hasActiveTrip, sharedRadarData, selectedCarrier]);

// // // //   if (magicLink) return (
// // // //     <div className="bg-emerald-950/20 border-2 border-emerald-500/20 p-6 rounded-[2.5rem] text-center space-y-4 animate-in zoom-in shadow-2xl backdrop-blur-xl">
// // // //       <div className="bg-emerald-500/10 p-3 rounded-full w-fit mx-auto"><CheckCircle2 className="h-12 w-12 text-emerald-500" /></div>
// // // //       <h3 className="font-black text-xl text-white">الرابط السحري جاهز!</h3>
// // // //       <div className="flex items-center gap-2 bg-black/40 p-2 rounded-2xl border border-white/10 shadow-inner">
// // // //         <Input value={magicLink} readOnly className="border-0 bg-transparent text-xs font-mono font-bold text-emerald-400" dir="ltr" />
// // // //         <Button onClick={() => { navigator.clipboard.writeText(magicLink); toast({ title: "تم النسخ 📋" }); }} size="icon" variant="secondary" className="rounded-xl bg-primary/10 text-primary"><Share2 className="h-4 w-4" /></Button>
// // // //       </div>
// // // //       <Button onClick={() => { setMagicLink(''); form.reset(); setSelectedCarrier(null); }} className="w-full h-14 rounded-2xl bg-primary text-black font-black">حجز جديد</Button>
// // // //     </div>
// // // //   );

// // // //   return (
// // // //     <Form {...form}>
// // // //       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-card border border-primary/10 p-6 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
// // // //         {sharedRadarData?.originCity && sharedRadarData?.destCity ? (
// // // //           <div className="bg-primary/5 border border-primary/20 p-4 rounded-3xl flex items-center justify-between shadow-inner">
// // // //             <div className="flex flex-col items-center"><PlaneTakeoff className="h-4 w-4 text-primary mb-1" /><span className="text-[10px] font-black">{getCityName(sharedRadarData.originCity, locale)}</span></div>
// // // //             <div className="flex-1 px-4"><div className="w-full h-px bg-primary/20 relative"><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-[8px] font-black text-primary">{sharedRadarData.seats} مقاعد</div></div></div>
// // // //             <div className="flex flex-col items-center"><PlaneLanding className="h-4 w-4 text-primary mb-1" /><span className="text-[10px] font-black">{getCityName(sharedRadarData.destCity, locale)}</span></div>
// // // //           </div>
// // // //         ) : (
// // // //           <div className="bg-muted/20 border border-dashed border-muted p-4 rounded-3xl text-center text-[10px] font-bold text-muted-foreground">حدد المسار في الرادار أولاً لتفعيل مفاعل الحجز</div>
// // // //         )}

// // // //         <div className="space-y-3 bg-muted/30 p-4 rounded-3xl border border-dashed border-primary/20">
// // // //           {!selectedCarrier ? (
// // // //             <div className="relative">
// // // //               <UserCheck className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
// // // //               <Input placeholder="ابحث عن كابتن محدد (اختياري)..." value={carrierSearch} onChange={e => setCarrierSearch(e.target.value)} className="h-11 rounded-2xl bg-background border-primary/5 pl-3 pr-10 text-xs font-bold text-right shadow-sm" />
// // // //               {carrierSearch.length >= 2 && (
// // // //                 <div className="absolute top-full left-0 right-0 z-50 bg-background border border-primary/10 rounded-2xl mt-1 shadow-2xl overflow-hidden">
// // // //                   {filteredCarriers.map(c => (
// // // //                     <div key={c.id} className="p-3 flex items-center justify-between hover:bg-primary/5 cursor-pointer border-b border-primary/5 last:border-0" onClick={() => { setSelectedCarrier({ id: c.id, name: c.officeName || c.firstName }); setCarrierSearch(''); }}>
// // // //                       <div className="flex items-center gap-2"><Avatar className="h-7 w-7"><AvatarFallback className="text-[10px]">{c.firstName?.[0]}</AvatarFallback></Avatar><span className="text-[11px] font-black">{c.officeName || `${c.firstName} ${c.lastName}`}</span></div>
// // // //                       <PlusCircle className="h-4 w-4 text-primary opacity-40" />
// // // //                     </div>
// // // //                   ))}
// // // //                 </div>
// // // //               )}
// // // //             </div>
// // // //           ) : (
// // // //             <div className="flex items-center justify-between bg-primary/10 p-2 rounded-2xl border border-primary/20 animate-in slide-in-from-right-2">
// // // //               <div className="flex items-center gap-2"><Avatar className="h-8 w-8"><AvatarFallback className="bg-primary text-black text-[10px] font-black">{selectedCarrier.name[0]}</AvatarFallback></Avatar><span className="text-xs font-black text-primary">{selectedCarrier.name}</span></div>
// // // //               <button type="button" className="text-[10px] font-black text-muted-foreground hover:text-destructive px-3" onClick={() => setSelectedCarrier(null)}>تغيير</button>
// // // //             </div>
// // // //           )}
// // // //         </div>

// // // //         <div className="space-y-6">
// // // //           {fields.map((field, index) => (
// // // //             <div key={field.id} className="space-y-4 p-4 bg-muted/10 rounded-[2rem] border border-primary/5 relative">
// // // //               <div className="flex items-center gap-2 border-b border-primary/5 pb-2 mb-2"><Badge className="bg-primary text-black h-5 w-5 rounded-full font-black">{index + 1}</Badge><span className="text-[10px] font-black text-primary uppercase">بيانات الراكب {index === 0 ? '(الأساسي)' : ''}</span></div>
// // // //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // // //                 <FormField control={form.control} name={`passengers.${index}.passengerName`} render={({ field }) => (
// // // //                   <FormItem><FormControl><Input placeholder="الاسم الرباعي" {...field} className="h-11 rounded-xl bg-background border-primary/5 text-xs font-bold text-right" /></FormControl></FormItem>
// // // //                 )} />
// // // //                 <FormField control={form.control} name={`passengers.${index}.passengerPhone`} render={({ field }) => (
// // // //                   <FormItem><FormControl><Input placeholder="+962..." {...field} dir="ltr" className={cn("h-11 rounded-xl bg-background border-primary/5 font-mono text-xs", index === 0 && hasActiveTrip && "border-destructive bg-destructive/5")} /></FormControl></FormItem>
// // // //                 )} />
// // // //               </div>
// // // //             </div>
// // // //           ))}
// // // //         </div>

// // // //         <FormField control={form.control} name="agentFee" render={({ field }) => (
// // // //           <FormItem className="mt-4"><FormLabel className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center justify-center gap-2 mb-2"><Zap className="h-4 w-4" /> العمولة الميدانية (JOD)</FormLabel><FormControl><Input type="number" {...field} className="h-16 rounded-[1.5rem] bg-primary/5 border-primary/20 text-3xl font-black text-center text-primary" /></FormControl></FormItem>
// // // //         )} />

// // // //         <Button type="submit" className={cn("w-full font-black h-16 rounded-3xl text-xl shadow-2xl transition-all gap-3", (hasActiveTrip || !sharedRadarData?.originCity) ? "bg-muted cursor-not-allowed" : "bg-primary text-black hover:bg-primary/90")} disabled={isSubmitting || hasActiveTrip || !sharedRadarData?.originCity}>
// // // //           {isSubmitting ? <Loader2 className="animate-spin h-6 w-6" /> : <><Zap className="h-6 w-6" /> حجز وتوليد الرابط</>}
// // // //         </Button>
// // // //       </form>
// // // //     </Form>
// // // //   );
// // // // }


// // // // 'use client';

// // // // /**
// // // //  * @component ProxyBookingForm
// // // //  * @description THE STERILIZED AGENT INTAKE (V32.0 - DIAMOND)
// // // //  * [PROTOCOL 16]: Diamond Sterilized. Pure functional island.
// // // //  * [PROTOCOL 88]: Minimalist logic. Consumes unified search artery.
// // // //  * Loose Coupling: Syncs with SmartRadar via shared useSovereignSearch pulse.
// // // //  */

// // // // import React, { useState, useCallback, useEffect } from 'react';
// // // // import { useForm, useFieldArray } from 'react-hook-form';
// // // // import { Button } from '@/components/ui/button';
// // // // import { Input } from '@/components/ui/input';
// // // // import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
// // // // import { Zap, CheckCircle2, Loader2, Share2, PlusCircle, UserCheck, PlaneTakeoff, PlaneLanding } from 'lucide-react';
// // // // import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
// // // // import { collection, query, where, limit } from 'firebase/firestore';
// // // // import { useToast } from '@/hooks/use-toast';
// // // // import { triggerHaptic, cn } from '@/lib/utils';
// // // // import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// // // // import { Badge } from '@/components/ui/badge';
// // // // import { getCityName } from '@/lib/constants';
// // // // import { usePassengerShield } from '@/hooks/use-passenger-shield';
// // // // import { usePassengerMemory } from '@/hooks/use-passenger-memory';
// // // // import { useLocale } from 'next-intl';
// // // // import { useAgentOps } from '@/hooks/use-agent-ops';
// // // // import { useSovereignSearch } from '@/hooks/use-sovereign-search';

// // // // export function ProxyBookingForm() {
// // // //   const { user } = useUser();
// // // //   const firestore = useFirestore();
// // // //   const locale = useLocale();
// // // //   const { toast } = useToast();

// // // //   // [SSOT ARTERY]: Sharing context with the Radar via URL persistent filters
// // // //   const { filters: sharedRadarData, selectedTrip } = useSovereignSearch();
// // // //   const { isSubmitting, magicLink, setMagicLink, submitProxyBooking } = useAgentOps(user?.uid || '');

// // // //   const [carrierSearch, setCarrierSearch] = useState('');
// // // //   const [selectedCarrier, setSelectedCarrier] = useState<{ id: string, name: string } | null>(null);

// // // //   const form = useForm({
// // // //     defaultValues: {
// // // //       passengers: [{ passengerName: '', passengerPhone: '', nationality: '', documentId: '', passengerType: 'adult' }],
// // // //       agentFee: 0
// // // //     }
// // // //   });

// // // //   const { fields, replace } = useFieldArray({ control: form.control, name: "passengers" });

// // // //   // [PROTOCOL 16]: Dynamic Seat Balancing - Keeps form in sync with Radar choices
// // // //   useEffect(() => {
// // // //     const requiredSeats = sharedRadarData?.seats || 1;
// // // //     if (fields.length !== requiredSeats) {
// // // //       replace(Array.from({ length: requiredSeats }, (_, i) => ({
// // // //         passengerName: '', passengerPhone: '', nationality: '', documentId: '', passengerType: 'adult'
// // // //       })));
// // // //     }
// // // //   }, [sharedRadarData?.seats, replace, fields.length]);

// // // //   // [PROTOCOL 88]: Carrier Discovery - Limited to context
// // // //   const carriersQuery = useMemoFirebase(() => {
// // // //     if (!firestore || !sharedRadarData?.originCity) return null;
// // // //     return query(collection(firestore, 'users'), where('role', '==', 'carrier'), where('jurisdiction.origin', '==', sharedRadarData.originCity), limit(20));
// // // //   }, [firestore, sharedRadarData?.originCity]);
// // // //   const { data: availableCarriers } = useCollection(carriersQuery);

// // // //   const filteredCarriers = (availableCarriers || []).filter(c => {
// // // //     const term = carrierSearch.toLowerCase();
// // // //     return c.firstName?.toLowerCase().includes(term) || c.officeName?.toLowerCase().includes(term);
// // // //   }).slice(0, 5);

// // // //   // [PROTOCOL 16]: Identity Recall Reactor
// // // //   const watchPrimaryPhone = form.watch('passengers.0.passengerPhone');
// // // //   const { rememberedData } = usePassengerMemory(watchPrimaryPhone);
// // // //   const { hasActiveTrip } = usePassengerShield(watchPrimaryPhone);

// // // //   useEffect(() => {
// // // //     if (rememberedData && !form.getValues('passengers.0.passengerName')) {
// // // //       form.setValue('passengers.0.passengerName', rememberedData.name);
// // // //       form.setValue('passengers.0.nationality', rememberedData.nationality);
// // // //       form.setValue('passengers.0.documentId', rememberedData.documentId);
// // // //       form.setValue('passengers.0.passengerType', rememberedData.type as any);
// // // //     }
// // // //   }, [rememberedData, form]);

// // // //   const onSubmit = useCallback(async (data: any) => {
// // // //     if (hasActiveTrip || !sharedRadarData?.originCity) return;

// // // //     await submitProxyBooking({
// // // //       passengers: data.passengers,
// // // //       agentFee: Number(data.agentFee),
// // // //       // targetCarrierId: selectedCarrier?.id || selectedTrip?.carrierId,
// // // //       ...(selectedCarrier?.id && { targetCarrierId: selectedCarrier.id }),
// // // //       ...(selectedTrip?.carrierId && { targetCarrierId: selectedTrip.carrierId }),
// // // //       ...(selectedTrip?.id && { tripId: selectedTrip.id }),
// // // //       originCountry: sharedRadarData.originCountry,
// // // //       originCity: sharedRadarData.originCity,
// // // //       destCountry: sharedRadarData.destCountry,
// // // //       destCity: sharedRadarData.destCity,
// // // //       departureDate: selectedTrip?.departureDate || sharedRadarData.travelDate?.toISOString(),
// // // //       passengersCount: sharedRadarData.seats || 1,
// // // //       tripId: selectedTrip?.id || null,
// // // //       requestType: selectedTrip?.id ? 'Direct' : selectedCarrier?.id ? 'Direct' : 'General'
// // // //     }, () => {
// // // //       triggerHaptic('success');
// // // //     });
// // // //   }, [submitProxyBooking, hasActiveTrip, sharedRadarData, selectedCarrier]);

// // // //   if (magicLink) return (
// // // //     <div className="bg-emerald-950/20 border-2 border-emerald-500/20 p-6 rounded-[2.5rem] text-center space-y-4 animate-in zoom-in shadow-2xl backdrop-blur-xl">
// // // //       <div className="bg-emerald-500/10 p-3 rounded-full w-fit mx-auto"><CheckCircle2 className="h-12 w-12 text-emerald-500" /></div>
// // // //       <h3 className="font-black text-xl text-white">الرابط السحري جاهز!</h3>
// // // //       <div className="flex items-center gap-2 bg-black/40 p-2 rounded-2xl border border-white/10 shadow-inner">
// // // //         <Input value={magicLink} readOnly className="border-0 bg-transparent text-xs font-mono font-bold text-emerald-400" dir="ltr" />
// // // //         <Button onClick={() => { navigator.clipboard.writeText(magicLink); toast({ title: "تم النسخ 📋" }); }} size="icon" variant="secondary" className="rounded-xl bg-primary/10 text-primary"><Share2 className="h-4 w-4" /></Button>
// // // //       </div>
// // // //       <Button onClick={() => { setMagicLink(''); form.reset(); setSelectedCarrier(null); }} className="w-full h-14 rounded-2xl bg-primary text-black font-black">حجز جديد</Button>
// // // //     </div>
// // // //   );

// // // //   return (
// // // //     <Form {...form}>
// // // //       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-card border border-primary/10 p-6 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
// // // //         {sharedRadarData?.originCity && sharedRadarData?.destCity ? (
// // // //           <div className="space-y-2">
// // // //             <div className="bg-primary/5 border border-primary/20 p-4 rounded-3xl flex items-center justify-between shadow-inner">
// // // //               <div className="flex flex-col items-center"><PlaneTakeoff className="h-4 w-4 text-primary mb-1" /><span className="text-[10px] font-black">{getCityName(sharedRadarData.originCity, locale)}</span></div>
// // // //               <div className="flex-1 px-4"><div className="w-full h-px bg-primary/20 relative"><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-[8px] font-black text-primary">{sharedRadarData.seats} مقاعد</div></div></div>
// // // //               <div className="flex flex-col items-center"><PlaneLanding className="h-4 w-4 text-primary mb-1" /><span className="text-[10px] font-black">{getCityName(sharedRadarData.destCity, locale)}</span></div>
// // // //             </div>
// // // //             {selectedTrip && (
// // // //               <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-2xl flex items-center justify-between animate-in slide-in-from-top-2">
// // // //                 <div className="text-right">
// // // //                   <p className="text-[10px] font-black text-emerald-500">✓ رحلة محددة من الرادار</p>
// // // //                   <p className="text-xs font-black">{selectedTrip.carrierName}</p>
// // // //                   <p className="text-[10px] text-muted-foreground">{selectedTrip.departureDate ? new Date(selectedTrip.departureDate?.seconds ? selectedTrip.departureDate.seconds * 1000 : selectedTrip.departureDate).toLocaleDateString('ar') : ''}</p>
// // // //                 </div>
// // // //                 <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-mono text-xs">{selectedTrip.price} {selectedTrip.currency}</Badge>
// // // //               </div>
// // // //             )}
// // // //           </div>
// // // //         ) : (
// // // //           <div className="bg-muted/20 border border-dashed border-muted p-4 rounded-3xl text-center text-[10px] font-bold text-muted-foreground">حدد المسار في الرادار أولاً لتفعيل مفاعل الحجز</div>
// // // //         )}

// // // //         <div className="space-y-3 bg-muted/30 p-4 rounded-3xl border border-dashed border-primary/20">
// // // //           {!selectedCarrier ? (
// // // //             <div className="relative">
// // // //               <UserCheck className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
// // // //               <Input placeholder="ابحث عن كابتن محدد (اختياري)..." value={carrierSearch} onChange={e => setCarrierSearch(e.target.value)} className="h-11 rounded-2xl bg-background border-primary/5 pl-3 pr-10 text-xs font-bold text-right shadow-sm" />
// // // //               {carrierSearch.length >= 2 && (
// // // //                 <div className="absolute top-full left-0 right-0 z-50 bg-background border border-primary/10 rounded-2xl mt-1 shadow-2xl overflow-hidden">
// // // //                   {filteredCarriers.map(c => (
// // // //                     <div key={c.id} className="p-3 flex items-center justify-between hover:bg-primary/5 cursor-pointer border-b border-primary/5 last:border-0" onClick={() => { setSelectedCarrier({ id: c.id, name: c.officeName || c.firstName }); setCarrierSearch(''); }}>
// // // //                       <div className="flex items-center gap-2"><Avatar className="h-7 w-7"><AvatarFallback className="text-[10px]">{c.firstName?.[0]}</AvatarFallback></Avatar><span className="text-[11px] font-black">{c.officeName || `${c.firstName} ${c.lastName}`}</span></div>
// // // //                       <PlusCircle className="h-4 w-4 text-primary opacity-40" />
// // // //                     </div>
// // // //                   ))}
// // // //                 </div>
// // // //               )}
// // // //             </div>
// // // //           ) : (
// // // //             <div className="flex items-center justify-between bg-primary/10 p-2 rounded-2xl border border-primary/20 animate-in slide-in-from-right-2">
// // // //               <div className="flex items-center gap-2"><Avatar className="h-8 w-8"><AvatarFallback className="bg-primary text-black text-[10px] font-black">{selectedCarrier.name[0]}</AvatarFallback></Avatar><span className="text-xs font-black text-primary">{selectedCarrier.name}</span></div>
// // // //               <button type="button" className="text-[10px] font-black text-muted-foreground hover:text-destructive px-3" onClick={() => setSelectedCarrier(null)}>تغيير</button>
// // // //             </div>
// // // //           )}
// // // //         </div>

// // // //         <div className="space-y-6">
// // // //           {fields.map((field, index) => (
// // // //             <div key={field.id} className="space-y-4 p-4 bg-muted/10 rounded-[2rem] border border-primary/5 relative">
// // // //               <div className="flex items-center gap-2 border-b border-primary/5 pb-2 mb-2"><Badge className="bg-primary text-black h-5 w-5 rounded-full font-black">{index + 1}</Badge><span className="text-[10px] font-black text-primary uppercase">بيانات الراكب {index === 0 ? '(الأساسي)' : ''}</span></div>
// // // //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // // //                 <FormField control={form.control} name={`passengers.${index}.passengerName`} render={({ field }) => (
// // // //                   <FormItem><FormControl><Input placeholder="الاسم الرباعي" {...field} className="h-11 rounded-xl bg-background border-primary/5 text-xs font-bold text-right" /></FormControl></FormItem>
// // // //                 )} />
// // // //                 <FormField control={form.control} name={`passengers.${index}.passengerPhone`} render={({ field }) => (
// // // //                   <FormItem><FormControl><Input placeholder="+962..." {...field} dir="ltr" className={cn("h-11 rounded-xl bg-background border-primary/5 font-mono text-xs", index === 0 && hasActiveTrip && "border-destructive bg-destructive/5")} /></FormControl></FormItem>
// // // //                 )} />
// // // //               </div>
// // // //             </div>
// // // //           ))}
// // // //         </div>

// // // //         <FormField control={form.control} name="agentFee" render={({ field }) => (
// // // //           <FormItem className="mt-4"><FormLabel className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center justify-center gap-2 mb-2"><Zap className="h-4 w-4" /> العمولة الميدانية (JOD)</FormLabel><FormControl><Input type="number" {...field} className="h-16 rounded-[1.5rem] bg-primary/5 border-primary/20 text-3xl font-black text-center text-primary" /></FormControl></FormItem>
// // // //         )} />

// // // //         <Button type="submit" className={cn("w-full font-black h-16 rounded-3xl text-xl shadow-2xl transition-all gap-3", (hasActiveTrip || !sharedRadarData?.originCity) ? "bg-muted cursor-not-allowed" : "bg-primary text-black hover:bg-primary/90")} disabled={isSubmitting || hasActiveTrip || !sharedRadarData?.originCity}>
// // // //           {isSubmitting ? <Loader2 className="animate-spin h-6 w-6" /> : <><Zap className="h-6 w-6" /> حجز وتوليد الرابط</>}
// // // //         </Button>
// // // //       </form>
// // // //     </Form>
// // // //   );
// // // // }
// // // // ===================================
// // // // 'use client';

// // // // /**
// // // //  * @component ProxyBookingForm
// // // //  * @description THE STERILIZED AGENT INTAKE (V32.0 - DIAMOND)
// // // //  * [PROTOCOL 16]: Diamond Sterilized. Pure functional island.
// // // //  * [PROTOCOL 88]: Minimalist logic. Consumes unified search artery.
// // // //  * Loose Coupling: Syncs with SmartRadar via shared useSovereignSearch pulse.
// // // //  */

// // // // import React, { useState, useCallback, useEffect } from 'react';
// // // // import { useForm, useFieldArray } from 'react-hook-form';
// // // // import { Button } from '@/components/ui/button';
// // // // import { Input } from '@/components/ui/input';
// // // // import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
// // // // import { Zap, CheckCircle2, Loader2, Share2, PlusCircle, UserCheck, PlaneTakeoff, PlaneLanding } from 'lucide-react';
// // // // import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
// // // // import { collection, query, where, limit } from 'firebase/firestore';
// // // // import { useToast } from '@/hooks/use-toast';
// // // // import { triggerHaptic, cn } from '@/lib/utils';
// // // // import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// // // // import { Badge } from '@/components/ui/badge';
// // // // import { getCityName } from '@/lib/constants';
// // // // import { usePassengerShield } from '@/hooks/use-passenger-shield';
// // // // import { usePassengerMemory } from '@/hooks/use-passenger-memory';
// // // // import { useLocale } from 'next-intl';
// // // // import { useAgentOps } from '@/hooks/use-agent-ops';
// // // // import { useSovereignSearchContext } from '@/contexts/sovereign-search-context';

// // // // export function ProxyBookingForm() {
// // // //   const { user } = useUser();
// // // //   const firestore = useFirestore();
// // // //   const locale = useLocale();
// // // //   const { toast } = useToast();

// // // //   // [SSOT ARTERY]: Sharing context with the Radar via URL persistent filters
// // // //   const { filters: sharedRadarData, selectedTrip } = useSovereignSearchContext();
// // // //   const { isSubmitting, magicLink, setMagicLink, submitProxyBooking } = useAgentOps(user?.uid || '');

// // // //   const [carrierSearch, setCarrierSearch] = useState('');
// // // //   const [selectedCarrier, setSelectedCarrier] = useState<{ id: string, name: string } | null>(null);

// // // //   const form = useForm({
// // // //     defaultValues: {
// // // //       passengers: [{ passengerName: '', passengerPhone: '', nationality: '', documentId: '', passengerType: 'adult' }],
// // // //       agentFee: 0
// // // //     }
// // // //   });

// // // //   const { fields, replace } = useFieldArray({ control: form.control, name: "passengers" });

// // // //   // [PROTOCOL 16]: Dynamic Seat Balancing - Keeps form in sync with Radar choices
// // // //   useEffect(() => {
// // // //     const requiredSeats = sharedRadarData?.seats || 1;
// // // //     if (fields.length !== requiredSeats) {
// // // //       replace(Array.from({ length: requiredSeats }, (_, i) => ({
// // // //         passengerName: '', passengerPhone: '', nationality: '', documentId: '', passengerType: 'adult'
// // // //       })));
// // // //     }
// // // //   }, [sharedRadarData?.seats, replace, fields.length]);

// // // //   // [PROTOCOL 88]: Carrier Discovery - Limited to context
// // // //   const carriersQuery = useMemoFirebase(() => {
// // // //     if (!firestore || !sharedRadarData?.originCity) return null;
// // // //     return query(collection(firestore, 'users'), where('role', '==', 'carrier'), where('jurisdiction.origin', '==', sharedRadarData.originCity), limit(20));
// // // //   }, [firestore, sharedRadarData?.originCity]);
// // // //   const { data: availableCarriers } = useCollection(carriersQuery);

// // // //   const filteredCarriers = (availableCarriers || []).filter(c => {
// // // //     const term = carrierSearch.toLowerCase();
// // // //     return c.firstName?.toLowerCase().includes(term) || c.officeName?.toLowerCase().includes(term);
// // // //   }).slice(0, 5);

// // // //   // [PROTOCOL 16]: Identity Recall Reactor
// // // //   const watchPrimaryPhone = form.watch('passengers.0.passengerPhone');
// // // //   const { rememberedData } = usePassengerMemory(watchPrimaryPhone);
// // // //   const { hasActiveTrip } = usePassengerShield(watchPrimaryPhone);

// // // //   useEffect(() => {
// // // //     if (rememberedData && !form.getValues('passengers.0.passengerName')) {
// // // //       form.setValue('passengers.0.passengerName', rememberedData.name);
// // // //       form.setValue('passengers.0.nationality', rememberedData.nationality);
// // // //       form.setValue('passengers.0.documentId', rememberedData.documentId);
// // // //       form.setValue('passengers.0.passengerType', rememberedData.type as any);
// // // //     }
// // // //   }, [rememberedData, form]);

// // // //   const onSubmit = useCallback(async (data: any) => {
// // // //     if (hasActiveTrip || !sharedRadarData?.originCity) return;

// // // //     await submitProxyBooking({
// // // //       passengers: data.passengers,
// // // //       agentFee: Number(data.agentFee),
// // // //       targetCarrierId: selectedCarrier?.id || selectedTrip?.carrierId,
// // // //       originCountry: sharedRadarData.originCountry,
// // // //       originCity: sharedRadarData.originCity,
// // // //       destCountry: sharedRadarData.destCountry,
// // // //       destCity: sharedRadarData.destCity,
// // // //       departureDate: selectedTrip?.departureDate || sharedRadarData.travelDate?.toISOString(),
// // // //       passengersCount: sharedRadarData.seats || 1,
// // // //       tripId: selectedTrip?.id || null,
// // // //       requestType: selectedTrip?.id ? 'Direct' : selectedCarrier?.id ? 'Direct' : 'General'
// // // //     }, () => {
// // // //       triggerHaptic('success');
// // // //     });
// // // //   }, [submitProxyBooking, hasActiveTrip, sharedRadarData, selectedCarrier]);

// // // //   if (magicLink) return (
// // // //     <div className="bg-emerald-950/20 border-2 border-emerald-500/20 p-6 rounded-[2.5rem] text-center space-y-4 animate-in zoom-in shadow-2xl backdrop-blur-xl">
// // // //       <div className="bg-emerald-500/10 p-3 rounded-full w-fit mx-auto"><CheckCircle2 className="h-12 w-12 text-emerald-500" /></div>
// // // //       <h3 className="font-black text-xl text-white">الرابط السحري جاهز!</h3>
// // // //       <div className="flex items-center gap-2 bg-black/40 p-2 rounded-2xl border border-white/10 shadow-inner">
// // // //         <Input value={magicLink} readOnly className="border-0 bg-transparent text-xs font-mono font-bold text-emerald-400" dir="ltr" />
// // // //         <Button onClick={() => { navigator.clipboard.writeText(magicLink); toast({ title: "تم النسخ 📋" }); }} size="icon" variant="secondary" className="rounded-xl bg-primary/10 text-primary"><Share2 className="h-4 w-4" /></Button>
// // // //       </div>
// // // //       <Button onClick={() => { setMagicLink(''); form.reset(); setSelectedCarrier(null); }} className="w-full h-14 rounded-2xl bg-primary text-black font-black">حجز جديد</Button>
// // // //     </div>
// // // //   );

// // // //   return (
// // // //     <Form {...form}>
// // // //       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-card border border-primary/10 p-6 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
// // // //         {sharedRadarData?.originCity && sharedRadarData?.destCity ? (
// // // //           <div className="space-y-2">
// // // //             <div className="bg-primary/5 border border-primary/20 p-4 rounded-3xl flex items-center justify-between shadow-inner">
// // // //               <div className="flex flex-col items-center"><PlaneTakeoff className="h-4 w-4 text-primary mb-1" /><span className="text-[10px] font-black">{getCityName(sharedRadarData.originCity, locale)}</span></div>
// // // //               <div className="flex-1 px-4"><div className="w-full h-px bg-primary/20 relative"><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-[8px] font-black text-primary">{sharedRadarData.seats} مقاعد</div></div></div>
// // // //               <div className="flex flex-col items-center"><PlaneLanding className="h-4 w-4 text-primary mb-1" /><span className="text-[10px] font-black">{getCityName(sharedRadarData.destCity, locale)}</span></div>
// // // //             </div>
// // // //             {selectedTrip && (
// // // //               <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-2xl flex items-center justify-between animate-in slide-in-from-top-2">
// // // //                 <div className="text-right">
// // // //                   <p className="text-[10px] font-black text-emerald-500">✓ رحلة محددة من الرادار</p>
// // // //                   <p className="text-xs font-black">{selectedTrip.carrierName}</p>
// // // //                   <p className="text-[10px] text-muted-foreground">{selectedTrip.departureDate ? new Date(selectedTrip.departureDate?.seconds ? selectedTrip.departureDate.seconds * 1000 : selectedTrip.departureDate).toLocaleDateString('ar') : ''}</p>
// // // //                 </div>
// // // //                 <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-mono text-xs">{selectedTrip.price} {selectedTrip.currency}</Badge>
// // // //               </div>
// // // //             )}
// // // //           </div>
// // // //         ) : (
// // // //           <div className="bg-muted/20 border border-dashed border-muted p-4 rounded-3xl text-center text-[10px] font-bold text-muted-foreground">حدد المسار في الرادار أولاً لتفعيل مفاعل الحجز</div>
// // // //         )}

// // // //         <div className="space-y-3 bg-muted/30 p-4 rounded-3xl border border-dashed border-primary/20">
// // // //           {!selectedCarrier ? (
// // // //             <div className="relative">
// // // //               <UserCheck className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
// // // //               <Input placeholder="ابحث عن كابتن محدد (اختياري)..." value={carrierSearch} onChange={e => setCarrierSearch(e.target.value)} className="h-11 rounded-2xl bg-background border-primary/5 pl-3 pr-10 text-xs font-bold text-right shadow-sm" />
// // // //               {carrierSearch.length >= 2 && (
// // // //                 <div className="absolute top-full left-0 right-0 z-50 bg-background border border-primary/10 rounded-2xl mt-1 shadow-2xl overflow-hidden">
// // // //                   {filteredCarriers.map(c => (
// // // //                     <div key={c.id} className="p-3 flex items-center justify-between hover:bg-primary/5 cursor-pointer border-b border-primary/5 last:border-0" onClick={() => { setSelectedCarrier({ id: c.id, name: c.officeName || c.firstName }); setCarrierSearch(''); }}>
// // // //                       <div className="flex items-center gap-2"><Avatar className="h-7 w-7"><AvatarFallback className="text-[10px]">{c.firstName?.[0]}</AvatarFallback></Avatar><span className="text-[11px] font-black">{c.officeName || `${c.firstName} ${c.lastName}`}</span></div>
// // // //                       <PlusCircle className="h-4 w-4 text-primary opacity-40" />
// // // //                     </div>
// // // //                   ))}
// // // //                 </div>
// // // //               )}
// // // //             </div>
// // // //           ) : (
// // // //             <div className="flex items-center justify-between bg-primary/10 p-2 rounded-2xl border border-primary/20 animate-in slide-in-from-right-2">
// // // //               <div className="flex items-center gap-2"><Avatar className="h-8 w-8"><AvatarFallback className="bg-primary text-black text-[10px] font-black">{selectedCarrier.name[0]}</AvatarFallback></Avatar><span className="text-xs font-black text-primary">{selectedCarrier.name}</span></div>
// // // //               <button type="button" className="text-[10px] font-black text-muted-foreground hover:text-destructive px-3" onClick={() => setSelectedCarrier(null)}>تغيير</button>
// // // //             </div>
// // // //           )}
// // // //         </div>

// // // //         <div className="space-y-6">
// // // //           {fields.map((field, index) => (
// // // //             <div key={field.id} className="space-y-4 p-4 bg-muted/10 rounded-[2rem] border border-primary/5 relative">
// // // //               <div className="flex items-center gap-2 border-b border-primary/5 pb-2 mb-2"><Badge className="bg-primary text-black h-5 w-5 rounded-full font-black">{index + 1}</Badge><span className="text-[10px] font-black text-primary uppercase">بيانات الراكب {index === 0 ? '(الأساسي)' : ''}</span></div>
// // // //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // // //                 <FormField control={form.control} name={`passengers.${index}.passengerName`} render={({ field }) => (
// // // //                   <FormItem><FormControl><Input placeholder="الاسم الرباعي" {...field} className="h-11 rounded-xl bg-background border-primary/5 text-xs font-bold text-right" /></FormControl></FormItem>
// // // //                 )} />
// // // //                 <FormField control={form.control} name={`passengers.${index}.passengerPhone`} render={({ field }) => (
// // // //                   <FormItem><FormControl><Input placeholder="+962..." {...field} dir="ltr" className={cn("h-11 rounded-xl bg-background border-primary/5 font-mono text-xs", index === 0 && hasActiveTrip && "border-destructive bg-destructive/5")} /></FormControl></FormItem>
// // // //                 )} />
// // // //               </div>
// // // //             </div>
// // // //           ))}
// // // //         </div>

// // // //         <FormField control={form.control} name="agentFee" render={({ field }) => (
// // // //           <FormItem className="mt-4"><FormLabel className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center justify-center gap-2 mb-2"><Zap className="h-4 w-4" /> العمولة الميدانية (JOD)</FormLabel><FormControl><Input type="number" {...field} className="h-16 rounded-[1.5rem] bg-primary/5 border-primary/20 text-3xl font-black text-center text-primary" /></FormControl></FormItem>
// // // //         )} />

// // // //         <Button type="submit" className={cn("w-full font-black h-16 rounded-3xl text-xl shadow-2xl transition-all gap-3", (hasActiveTrip || !sharedRadarData?.originCity) ? "bg-muted cursor-not-allowed" : "bg-primary text-black hover:bg-primary/90")} disabled={isSubmitting || hasActiveTrip || !sharedRadarData?.originCity}>
// // // //           {isSubmitting ? <Loader2 className="animate-spin h-6 w-6" /> : <><Zap className="h-6 w-6" /> حجز وتوليد الرابط</>}
// // // //         </Button>
// // // //       </form>
// // // //     </Form>
// // // //   );
// // // // }
// // // //============================

// // // // 'use client';

// // // // /**
// // // //  * @component ProxyBookingForm
// // // //  * @description THE STERILIZED AGENT INTAKE (V32.0 - DIAMOND)
// // // //  * [PROTOCOL 16]: Diamond Sterilized. Pure functional island.
// // // //  * [PROTOCOL 88]: Minimalist logic. Consumes unified search artery.
// // // //  * Loose Coupling: Syncs with SmartRadar via shared useSovereignSearch pulse.
// // // //  */

// // // // import React, { useState, useCallback, useEffect } from 'react';
// // // // import { useForm, useFieldArray } from 'react-hook-form';
// // // // import { Button } from '@/components/ui/button';
// // // // import { Input } from '@/components/ui/input';
// // // // import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
// // // // import { Zap, CheckCircle2, Loader2, Share2, PlusCircle, UserCheck, PlaneTakeoff, PlaneLanding } from 'lucide-react';
// // // // import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
// // // // import { collection, query, where, limit } from 'firebase/firestore';
// // // // import { useToast } from '@/hooks/use-toast';
// // // // import { triggerHaptic, cn } from '@/lib/utils';
// // // // import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// // // // import { Badge } from '@/components/ui/badge';
// // // // import { getCityName } from '@/lib/constants';
// // // // import { usePassengerShield } from '@/hooks/use-passenger-shield';
// // // // import { usePassengerMemory } from '@/hooks/use-passenger-memory';
// // // // import { useLocale } from 'next-intl';
// // // // import { useAgentOps } from '@/hooks/use-agent-ops';
// // // // import { useSovereignSearchContext } from '@/contexts/sovereign-search-context';

// // // // export function ProxyBookingForm() {
// // // //   const { user } = useUser();
// // // //   const firestore = useFirestore();
// // // //   const locale = useLocale();
// // // //   const { toast } = useToast();

// // // //   // [SSOT ARTERY]: Sharing context with the Radar via URL persistent filters
// // // //   const { filters: sharedRadarData, selectedTrip } = useSovereignSearchContext();
// // // //   const { isSubmitting, magicLink, setMagicLink, submitProxyBooking } = useAgentOps(user?.uid || '');

// // // //   const [carrierSearch, setCarrierSearch] = useState('');
// // // //   const [selectedCarrier, setSelectedCarrier] = useState<{ id: string, name: string } | null>(null);

// // // //   const form = useForm({
// // // //     defaultValues: {
// // // //       passengers: [{ passengerName: '', passengerPhone: '', nationality: '', documentId: '', passengerType: 'adult' }],
// // // //       agentFee: 0
// // // //     }
// // // //   });

// // // //   const { fields, replace } = useFieldArray({ control: form.control, name: "passengers" });

// // // //   // [PROTOCOL 16]: Dynamic Seat Balancing - Keeps form in sync with Radar choices
// // // //   useEffect(() => {
// // // //     const requiredSeats = sharedRadarData?.seats || 1;
// // // //     if (fields.length !== requiredSeats) {
// // // //       replace(Array.from({ length: requiredSeats }, (_, i) => ({
// // // //         passengerName: '', passengerPhone: '', nationality: '', documentId: '', passengerType: 'adult'
// // // //       })));
// // // //     }
// // // //   }, [sharedRadarData?.seats, replace, fields.length]);

// // // //   // [PROTOCOL 88]: Carrier Discovery - Limited to context
// // // //   const carriersQuery = useMemoFirebase(() => {
// // // //     if (!firestore || !sharedRadarData?.originCity) return null;
// // // //     return query(collection(firestore, 'users'), where('role', '==', 'carrier'), where('jurisdiction.origin', '==', sharedRadarData.originCity), limit(20));
// // // //   }, [firestore, sharedRadarData?.originCity]);
// // // //   const { data: availableCarriers } = useCollection(carriersQuery);

// // // //   const filteredCarriers = (availableCarriers || []).filter(c => {
// // // //     const term = carrierSearch.toLowerCase();
// // // //     return c.firstName?.toLowerCase().includes(term) || c.officeName?.toLowerCase().includes(term);
// // // //   }).slice(0, 5);

// // // //   // [PROTOCOL 16]: Identity Recall Reactor
// // // //   const watchPrimaryPhone = form.watch('passengers.0.passengerPhone');
// // // //   const { rememberedData } = usePassengerMemory(watchPrimaryPhone);
// // // //   const { hasActiveTrip } = usePassengerShield(watchPrimaryPhone);

// // // //   useEffect(() => {
// // // //     if (rememberedData && !form.getValues('passengers.0.passengerName')) {
// // // //       form.setValue('passengers.0.passengerName', rememberedData.name);
// // // //       form.setValue('passengers.0.nationality', rememberedData.nationality);
// // // //       form.setValue('passengers.0.documentId', rememberedData.documentId);
// // // //       form.setValue('passengers.0.passengerType', rememberedData.type as any);
// // // //     }
// // // //   }, [rememberedData, form]);

// // // //   const onSubmit = useCallback(async (data: any) => {
// // // //     if (hasActiveTrip || !sharedRadarData?.originCity) return;

// // // //     await submitProxyBooking({
// // // //       passengers: data.passengers,
// // // //       agentFee: Number(data.agentFee),
// // // //       targetCarrierId: selectedCarrier?.id || selectedTrip?.carrierId,
// // // //       originCountry: sharedRadarData.originCountry,
// // // //       originCity: sharedRadarData.originCity,
// // // //       destCountry: sharedRadarData.destCountry,
// // // //       destCity: sharedRadarData.destCity,
// // // //       departureDate: selectedTrip?.departureDate || sharedRadarData.travelDate?.toISOString(),
// // // //       passengersCount: sharedRadarData.seats || 1,
// // // //       tripId: selectedTrip?.id || null,
// // // //       requestType: selectedTrip?.id ? 'Direct' : selectedCarrier?.id ? 'Direct' : 'General'
// // // //     }, () => {
// // // //       triggerHaptic('success');
// // // //     });
// // // //   }, [submitProxyBooking, hasActiveTrip, sharedRadarData, selectedCarrier]);

// // // //   if (magicLink) return (
// // // //     <div className="bg-emerald-950/20 border-2 border-emerald-500/20 p-6 rounded-[2.5rem] text-center space-y-4 animate-in zoom-in shadow-2xl backdrop-blur-xl">
// // // //       <div className="bg-emerald-500/10 p-3 rounded-full w-fit mx-auto"><CheckCircle2 className="h-12 w-12 text-emerald-500" /></div>
// // // //       <h3 className="font-black text-xl text-white">الرابط السحري جاهز!</h3>
// // // //       <div className="flex items-center gap-2 bg-black/40 p-2 rounded-2xl border border-white/10 shadow-inner">
// // // //         <Input value={magicLink} readOnly className="border-0 bg-transparent text-xs font-mono font-bold text-emerald-400" dir="ltr" />
// // // //         <Button onClick={() => { navigator.clipboard.writeText(magicLink); toast({ title: "تم النسخ 📋" }); }} size="icon" variant="secondary" className="rounded-xl bg-primary/10 text-primary"><Share2 className="h-4 w-4" /></Button>
// // // //       </div>
// // // //       <Button onClick={() => { setMagicLink(''); form.reset(); setSelectedCarrier(null); }} className="w-full h-14 rounded-2xl bg-primary text-black font-black">حجز جديد</Button>
// // // //     </div>
// // // //   );

// // // //   return (
// // // //     <Form {...form}>
// // // //       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-card border border-primary/10 p-6 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
// // // //         {sharedRadarData?.originCity && sharedRadarData?.destCity ? (
// // // //           <div className="space-y-2">
// // // //             <div className="bg-primary/5 border border-primary/20 p-4 rounded-3xl flex items-center justify-between shadow-inner">
// // // //               <div className="flex flex-col items-center"><PlaneTakeoff className="h-4 w-4 text-primary mb-1" /><span className="text-[10px] font-black">{getCityName(sharedRadarData.originCity, locale)}</span></div>
// // // //               <div className="flex-1 px-4"><div className="w-full h-px bg-primary/20 relative"><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-[8px] font-black text-primary">{sharedRadarData.seats} مقاعد</div></div></div>
// // // //               <div className="flex flex-col items-center"><PlaneLanding className="h-4 w-4 text-primary mb-1" /><span className="text-[10px] font-black">{getCityName(sharedRadarData.destCity, locale)}</span></div>
// // // //             </div>
// // // //             {selectedTrip && (
// // // //               <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-2xl flex items-center justify-between animate-in slide-in-from-top-2">
// // // //                 <div className="text-right">
// // // //                   <p className="text-[10px] font-black text-emerald-500">✓ رحلة محددة من الرادار</p>
// // // //                   <p className="text-xs font-black">{selectedTrip.carrierName}</p>
// // // //                   <p className="text-[10px] text-muted-foreground">{selectedTrip.departureDate ? new Date(selectedTrip.departureDate?.seconds ? selectedTrip.departureDate.seconds * 1000 : selectedTrip.departureDate).toLocaleDateString('ar') : ''}</p>
// // // //                 </div>
// // // //                 <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-mono text-xs">{selectedTrip.price} {selectedTrip.currency}</Badge>
// // // //               </div>
// // // //             )}
// // // //           </div>
// // // //         ) : (
// // // //           <div className="bg-muted/20 border border-dashed border-muted p-4 rounded-3xl text-center text-[10px] font-bold text-muted-foreground">حدد المسار في الرادار أولاً لتفعيل مفاعل الحجز</div>
// // // //         )}

// // // //         {/* [SCR-ABF]: لو الوكيل اختار رحلة → الناقل محدد تلقائياً، مش محتاج يبحث */}
// // // //         {!selectedTrip && (
// // // //           <div className="space-y-3 bg-muted/30 p-4 rounded-3xl border border-dashed border-primary/20">
// // // //             {!selectedCarrier ? (
// // // //               <div className="relative">
// // // //                 <UserCheck className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
// // // //                 <Input placeholder="ابحث عن كابتن محدد (اختياري)..." value={carrierSearch} onChange={e => setCarrierSearch(e.target.value)} className="h-11 rounded-2xl bg-background border-primary/5 pl-3 pr-10 text-xs font-bold text-right shadow-sm" />
// // // //                 {carrierSearch.length >= 2 && (
// // // //                   <div className="absolute top-full left-0 right-0 z-50 bg-background border border-primary/10 rounded-2xl mt-1 shadow-2xl overflow-hidden">
// // // //                     {filteredCarriers.map(c => (
// // // //                       <div key={c.id} className="p-3 flex items-center justify-between hover:bg-primary/5 cursor-pointer border-b border-primary/5 last:border-0" onClick={() => { setSelectedCarrier({ id: c.id, name: c.officeName || c.firstName }); setCarrierSearch(''); }}>
// // // //                         <div className="flex items-center gap-2"><Avatar className="h-7 w-7"><AvatarFallback className="text-[10px]">{c.firstName?.[0]}</AvatarFallback></Avatar><span className="text-[11px] font-black">{c.officeName || `${c.firstName} ${c.lastName}`}</span></div>
// // // //                         <PlusCircle className="h-4 w-4 text-primary opacity-40" />
// // // //                       </div>
// // // //                     ))}
// // // //                   </div>
// // // //                 )}
// // // //               </div>
// // // //             ) : (
// // // //               <div className="flex items-center justify-between bg-primary/10 p-2 rounded-2xl border border-primary/20 animate-in slide-in-from-right-2">
// // // //                 <div className="flex items-center gap-2"><Avatar className="h-8 w-8"><AvatarFallback className="bg-primary text-black text-[10px] font-black">{selectedCarrier.name[0]}</AvatarFallback></Avatar><span className="text-xs font-black text-primary">{selectedCarrier.name}</span></div>
// // // //                 <button type="button" className="text-[10px] font-black text-muted-foreground hover:text-destructive px-3" onClick={() => setSelectedCarrier(null)}>تغيير</button>
// // // //               </div>
// // // //             )}
// // // //           </div>
// // // //         )}

// // // //         <div className="space-y-6">
// // // //           {fields.map((field, index) => (
// // // //             <div key={field.id} className="space-y-4 p-4 bg-muted/10 rounded-[2rem] border border-primary/5 relative">
// // // //               <div className="flex items-center gap-2 border-b border-primary/5 pb-2 mb-2"><Badge className="bg-primary text-black h-5 w-5 rounded-full font-black">{index + 1}</Badge><span className="text-[10px] font-black text-primary uppercase">بيانات الراكب {index === 0 ? '(الأساسي)' : ''}</span></div>
// // // //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // // //                 <FormField control={form.control} name={`passengers.${index}.passengerName`} render={({ field }) => (
// // // //                   <FormItem><FormControl><Input placeholder="الاسم الرباعي" {...field} className="h-11 rounded-xl bg-background border-primary/5 text-xs font-bold text-right" /></FormControl></FormItem>
// // // //                 )} />
// // // //                 <FormField control={form.control} name={`passengers.${index}.passengerPhone`} render={({ field }) => (
// // // //                   <FormItem><FormControl><Input placeholder="+962..." {...field} dir="ltr" className={cn("h-11 rounded-xl bg-background border-primary/5 font-mono text-xs", index === 0 && hasActiveTrip && "border-destructive bg-destructive/5")} /></FormControl></FormItem>
// // // //                 )} />
// // // //               </div>
// // // //             </div>
// // // //           ))}
// // // //         </div>

// // // //         <FormField control={form.control} name="agentFee" render={({ field }) => (
// // // //           <FormItem className="mt-4"><FormLabel className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center justify-center gap-2 mb-2"><Zap className="h-4 w-4" /> العمولة الميدانية (JOD)</FormLabel><FormControl><Input type="number" {...field} className="h-16 rounded-[1.5rem] bg-primary/5 border-primary/20 text-3xl font-black text-center text-primary" /></FormControl></FormItem>
// // // //         )} />

// // // //         <Button type="submit" className={cn("w-full font-black h-16 rounded-3xl text-xl shadow-2xl transition-all gap-3",
// // // //           (hasActiveTrip || !sharedRadarData?.originCity) ? "bg-muted cursor-not-allowed" :
// // // //             selectedTrip ? "bg-emerald-600 hover:bg-emerald-700 text-white" :
// // // //               "bg-primary text-black hover:bg-primary/90"
// // // //         )} disabled={isSubmitting || hasActiveTrip || !sharedRadarData?.originCity}>
// // // //           {isSubmitting ? <Loader2 className="animate-spin h-6 w-6" /> : selectedTrip ? (
// // // //             <><Zap className="h-6 w-6" /> إرسال طلب للناقل</>
// // // //           ) : (
// // // //             <><Zap className="h-6 w-6" /> نشر في السوق وتوليد الرابط</>
// // // //           )}
// // // //         </Button>
// // // //       </form>
// // // //     </Form>
// // // //   );
// // // // }

// // // //==========================
// // // 'use client';

// // // /**
// // //  * @component ProxyBookingForm
// // //  * @description THE STERILIZED AGENT INTAKE (V32.0 - DIAMOND)
// // //  * [PROTOCOL 16]: Diamond Sterilized. Pure functional island.
// // //  * [PROTOCOL 88]: Minimalist logic. Consumes unified search artery.
// // //  * Loose Coupling: Syncs with SmartRadar via shared useSovereignSearch pulse.
// // //  */

// // // import React, { useState, useCallback, useEffect } from 'react';
// // // import { useForm, useFieldArray } from 'react-hook-form';
// // // import { Button } from '@/components/ui/button';
// // // import { Input } from '@/components/ui/input';
// // // import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
// // // import { Zap, CheckCircle2, Loader2, Share2, PlusCircle, UserCheck, PlaneTakeoff, PlaneLanding } from 'lucide-react';
// // // import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
// // // import { collection, query, where, limit } from 'firebase/firestore';
// // // import { useToast } from '@/hooks/use-toast';
// // // import { triggerHaptic, cn } from '@/lib/utils';
// // // import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// // // import { Badge } from '@/components/ui/badge';
// // // import { getCityName } from '@/lib/constants';
// // // import { usePassengerShield } from '@/hooks/use-passenger-shield';
// // // import { usePassengerMemory } from '@/hooks/use-passenger-memory';
// // // import { useLocale } from 'next-intl';
// // // import { useAgentOps } from '@/hooks/use-agent-ops';
// // // import { useSovereignSearchContext } from '@/contexts/sovereign-search-context';

// // // export function ProxyBookingForm() {
// // //   const { user } = useUser();
// // //   const firestore = useFirestore();
// // //   const locale = useLocale();
// // //   const { toast } = useToast();

// // //   // [SSOT ARTERY]: Sharing context with the Radar via URL persistent filters
// // //   const { filters: sharedRadarData, selectedTrip } = useSovereignSearchContext();
// // //   const { isSubmitting, magicLink, setMagicLink, submitProxyBooking } = useAgentOps(user?.uid || '');

// // //   const [carrierSearch, setCarrierSearch] = useState('');
// // //   const [selectedCarrier, setSelectedCarrier] = useState<{ id: string, name: string } | null>(null);

// // //   const form = useForm({
// // //     defaultValues: {
// // //       passengers: [{ passengerName: '', passengerPhone: '', nationality: '', documentId: '', passengerType: 'adult' }],
// // //       agentFee: 0
// // //     }
// // //   });

// // //   const { fields, replace } = useFieldArray({ control: form.control, name: "passengers" });

// // //   // [PROTOCOL 16]: Dynamic Seat Balancing - Keeps form in sync with Radar choices
// // //   useEffect(() => {
// // //     const requiredSeats = sharedRadarData?.seats || 1;
// // //     if (fields.length !== requiredSeats) {
// // //       replace(Array.from({ length: requiredSeats }, (_, i) => ({
// // //         passengerName: '', passengerPhone: '', nationality: '', documentId: '', passengerType: 'adult'
// // //       })));
// // //     }
// // //   }, [sharedRadarData?.seats, replace, fields.length]);

// // //   // [PROTOCOL 88]: Carrier Discovery - Limited to context
// // //   const carriersQuery = useMemoFirebase(() => {
// // //     if (!firestore || !sharedRadarData?.originCity) return null;
// // //     return query(collection(firestore, 'users'), where('role', '==', 'carrier'), where('jurisdiction.origin', '==', sharedRadarData.originCity), limit(20));
// // //   }, [firestore, sharedRadarData?.originCity]);
// // //   const { data: availableCarriers } = useCollection(carriersQuery);

// // //   const filteredCarriers = (availableCarriers || []).filter(c => {
// // //     const term = carrierSearch.toLowerCase();
// // //     return c.firstName?.toLowerCase().includes(term) || c.officeName?.toLowerCase().includes(term);
// // //   }).slice(0, 5);

// // //   // [PROTOCOL 16]: Identity Recall Reactor
// // //   const watchPrimaryPhone = form.watch('passengers.0.passengerPhone');
// // //   const { rememberedData } = usePassengerMemory(watchPrimaryPhone);
// // //   const { hasActiveTrip } = usePassengerShield(watchPrimaryPhone);

// // //   useEffect(() => {
// // //     if (rememberedData && !form.getValues('passengers.0.passengerName')) {
// // //       form.setValue('passengers.0.passengerName', rememberedData.name);
// // //       form.setValue('passengers.0.nationality', rememberedData.nationality);
// // //       form.setValue('passengers.0.documentId', rememberedData.documentId);
// // //       form.setValue('passengers.0.passengerType', rememberedData.type as any);
// // //     }
// // //   }, [rememberedData, form]);

// // //   const onSubmit = useCallback(async (data: any) => {
// // //     if (hasActiveTrip) return;
// // //     // ✅ لو في رحلة محددة مش محتاج originCity — لو مفيش رحلة لازم يكون في originCity
// // //     if (!selectedTrip && !sharedRadarData?.originCity) return;

// // //     await submitProxyBooking({
// // //       passengers: data.passengers,
// // //       agentFee: Number(data.agentFee),
// // //       targetCarrierId: selectedCarrier?.id || selectedTrip?.carrierId,
// // //       originCountry: sharedRadarData?.originCountry || '',
// // //       originCity: sharedRadarData?.originCity || selectedTrip?.origin || '',
// // //       destCountry: sharedRadarData?.destCountry || '',
// // //       destCity: sharedRadarData?.destCity || selectedTrip?.destination || '',
// // //       departureDate: selectedTrip?.departureDate || sharedRadarData?.travelDate?.toISOString(),
// // //       passengersCount: sharedRadarData?.seats || 1,
// // //       // ✅ لو في رحلة محددة → المسار 1 (Pending-Carrier-Confirmation)
// // //       // ✅ لو مفيش → المسار 2 (Awaiting-Offers في السوق)
// // //       tripId: selectedTrip?.id || null,
// // //       requestType: selectedTrip?.id ? 'Direct' : selectedCarrier?.id ? 'Direct' : 'General'
// // //     }, () => {
// // //       triggerHaptic('success');
// // //     });
// // //   }, [submitProxyBooking, hasActiveTrip, sharedRadarData, selectedCarrier, selectedTrip]); // ✅ أضف selectedTrip

// // //   if (magicLink) return (
// // //     <div className="bg-emerald-950/20 border-2 border-emerald-500/20 p-6 rounded-[2.5rem] text-center space-y-4 animate-in zoom-in shadow-2xl backdrop-blur-xl">
// // //       <div className="bg-emerald-500/10 p-3 rounded-full w-fit mx-auto"><CheckCircle2 className="h-12 w-12 text-emerald-500" /></div>
// // //       <h3 className="font-black text-xl text-white">الرابط السحري جاهز!</h3>
// // //       <div className="flex items-center gap-2 bg-black/40 p-2 rounded-2xl border border-white/10 shadow-inner">
// // //         <Input value={magicLink} readOnly className="border-0 bg-transparent text-xs font-mono font-bold text-emerald-400" dir="ltr" />
// // //         <Button onClick={() => { navigator.clipboard.writeText(magicLink); toast({ title: "تم النسخ 📋" }); }} size="icon" variant="secondary" className="rounded-xl bg-primary/10 text-primary"><Share2 className="h-4 w-4" /></Button>
// // //       </div>
// // //       <Button onClick={() => { setMagicLink(''); form.reset(); setSelectedCarrier(null); }} className="w-full h-14 rounded-2xl bg-primary text-black font-black">حجز جديد</Button>
// // //     </div>
// // //   );

// // //   return (
// // //     <Form {...form}>
// // //       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-card border border-primary/10 p-6 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
// // //         {sharedRadarData?.originCity && sharedRadarData?.destCity ? (
// // //           <div className="space-y-2">
// // //             <div className="bg-primary/5 border border-primary/20 p-4 rounded-3xl flex items-center justify-between shadow-inner">
// // //               <div className="flex flex-col items-center"><PlaneTakeoff className="h-4 w-4 text-primary mb-1" /><span className="text-[10px] font-black">{getCityName(sharedRadarData.originCity, locale)}</span></div>
// // //               <div className="flex-1 px-4"><div className="w-full h-px bg-primary/20 relative"><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-[8px] font-black text-primary">{sharedRadarData.seats} مقاعد</div></div></div>
// // //               <div className="flex flex-col items-center"><PlaneLanding className="h-4 w-4 text-primary mb-1" /><span className="text-[10px] font-black">{getCityName(sharedRadarData.destCity, locale)}</span></div>
// // //             </div>
// // //             {selectedTrip && (
// // //               <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-2xl flex items-center justify-between animate-in slide-in-from-top-2">
// // //                 <div className="text-right">
// // //                   <p className="text-[10px] font-black text-emerald-500">✓ رحلة محددة من الرادار</p>
// // //                   <p className="text-xs font-black">{selectedTrip.carrierName}</p>
// // //                   <p className="text-[10px] text-muted-foreground">{selectedTrip.departureDate ? new Date(selectedTrip.departureDate?.seconds ? selectedTrip.departureDate.seconds * 1000 : selectedTrip.departureDate).toLocaleDateString('ar') : ''}</p>
// // //                 </div>
// // //                 <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-mono text-xs">{selectedTrip.price} {selectedTrip.currency}</Badge>
// // //               </div>
// // //             )}
// // //           </div>
// // //         ) : (
// // //           <div className="bg-muted/20 border border-dashed border-muted p-4 rounded-3xl text-center text-[10px] font-bold text-muted-foreground">حدد المسار في الرادار أولاً لتفعيل مفاعل الحجز</div>
// // //         )}

// // //         {/* [SCR-ABF]: لو الوكيل اختار رحلة → الناقل محدد تلقائياً، مش محتاج يبحث */}
// // //         {!selectedTrip && (
// // //           <div className="space-y-3 bg-muted/30 p-4 rounded-3xl border border-dashed border-primary/20">
// // //             {!selectedCarrier ? (
// // //               <div className="relative">
// // //                 <UserCheck className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
// // //                 <Input placeholder="ابحث عن كابتن محدد (اختياري)..." value={carrierSearch} onChange={e => setCarrierSearch(e.target.value)} className="h-11 rounded-2xl bg-background border-primary/5 pl-3 pr-10 text-xs font-bold text-right shadow-sm" />
// // //                 {carrierSearch.length >= 2 && (
// // //                   <div className="absolute top-full left-0 right-0 z-50 bg-background border border-primary/10 rounded-2xl mt-1 shadow-2xl overflow-hidden">
// // //                     {filteredCarriers.map(c => (
// // //                       <div key={c.id} className="p-3 flex items-center justify-between hover:bg-primary/5 cursor-pointer border-b border-primary/5 last:border-0" onClick={() => { setSelectedCarrier({ id: c.id, name: c.officeName || c.firstName }); setCarrierSearch(''); }}>
// // //                         <div className="flex items-center gap-2"><Avatar className="h-7 w-7"><AvatarFallback className="text-[10px]">{c.firstName?.[0]}</AvatarFallback></Avatar><span className="text-[11px] font-black">{c.officeName || `${c.firstName} ${c.lastName}`}</span></div>
// // //                         <PlusCircle className="h-4 w-4 text-primary opacity-40" />
// // //                       </div>
// // //                     ))}
// // //                   </div>
// // //                 )}
// // //               </div>
// // //             ) : (
// // //               <div className="flex items-center justify-between bg-primary/10 p-2 rounded-2xl border border-primary/20 animate-in slide-in-from-right-2">
// // //                 <div className="flex items-center gap-2"><Avatar className="h-8 w-8"><AvatarFallback className="bg-primary text-black text-[10px] font-black">{selectedCarrier.name[0]}</AvatarFallback></Avatar><span className="text-xs font-black text-primary">{selectedCarrier.name}</span></div>
// // //                 <button type="button" className="text-[10px] font-black text-muted-foreground hover:text-destructive px-3" onClick={() => setSelectedCarrier(null)}>تغيير</button>
// // //               </div>
// // //             )}
// // //           </div>
// // //         )}

// // //         <div className="space-y-6">
// // //           {fields.map((field, index) => (
// // //             <div key={field.id} className="space-y-4 p-4 bg-muted/10 rounded-[2rem] border border-primary/5 relative">
// // //               <div className="flex items-center gap-2 border-b border-primary/5 pb-2 mb-2"><Badge className="bg-primary text-black h-5 w-5 rounded-full font-black">{index + 1}</Badge><span className="text-[10px] font-black text-primary uppercase">بيانات الراكب {index === 0 ? '(الأساسي)' : ''}</span></div>
// // //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // //                 <FormField control={form.control} name={`passengers.${index}.passengerName`} render={({ field }) => (
// // //                   <FormItem><FormControl><Input placeholder="الاسم الرباعي" {...field} className="h-11 rounded-xl bg-background border-primary/5 text-xs font-bold text-right" /></FormControl></FormItem>
// // //                 )} />
// // //                 <FormField control={form.control} name={`passengers.${index}.passengerPhone`} render={({ field }) => (
// // //                   <FormItem><FormControl><Input placeholder="+962..." {...field} dir="ltr" className={cn("h-11 rounded-xl bg-background border-primary/5 font-mono text-xs", index === 0 && hasActiveTrip && "border-destructive bg-destructive/5")} /></FormControl></FormItem>
// // //                 )} />
// // //               </div>
// // //             </div>
// // //           ))}
// // //         </div>

// // //         <FormField control={form.control} name="agentFee" render={({ field }) => (
// // //           <FormItem className="mt-4"><FormLabel className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center justify-center gap-2 mb-2"><Zap className="h-4 w-4" /> العمولة الميدانية (JOD)</FormLabel><FormControl><Input type="number" {...field} className="h-16 rounded-[1.5rem] bg-primary/5 border-primary/20 text-3xl font-black text-center text-primary" /></FormControl></FormItem>
// // //         )} />

// // //         <Button type="submit" className={cn("w-full font-black h-16 rounded-3xl text-xl shadow-2xl transition-all gap-3",
// // //           (hasActiveTrip || !sharedRadarData?.originCity) ? "bg-muted cursor-not-allowed" :
// // //             selectedTrip ? "bg-emerald-600 hover:bg-emerald-700 text-white" :
// // //               "bg-primary text-black hover:bg-primary/90"
// // //         )} disabled={isSubmitting || hasActiveTrip || !sharedRadarData?.originCity}>
// // //           {isSubmitting ? <Loader2 className="animate-spin h-6 w-6" /> : selectedTrip ? (
// // //             <><Zap className="h-6 w-6" /> إرسال طلب للناقل</>
// // //           ) : (
// // //             <><Zap className="h-6 w-6" /> نشر في السوق وتوليد الرابط</>
// // //           )}
// // //         </Button>
// // //       </form>
// // //     </Form>
// // //   );
// // // }

// // //==========================
// // 'use client';

// // /**
// //  * @component ProxyBookingForm
// //  * @description THE STERILIZED AGENT INTAKE (V32.0 - DIAMOND)
// //  * [PROTOCOL 16]: Diamond Sterilized. Pure functional island.
// //  * [PROTOCOL 88]: Minimalist logic. Consumes unified search artery.
// //  * Loose Coupling: Syncs with SmartRadar via shared useSovereignSearch pulse.
// //  */

// // import React, { useState, useCallback, useEffect } from 'react';
// // import { useForm, useFieldArray } from 'react-hook-form';
// // import { Button } from '@/components/ui/button';
// // import { Input } from '@/components/ui/input';
// // import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
// // import { Zap, CheckCircle2, Loader2, Share2, PlusCircle, UserCheck, PlaneTakeoff, PlaneLanding } from 'lucide-react';
// // import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
// // import { collection, query, where, limit } from 'firebase/firestore';
// // import { useToast } from '@/hooks/use-toast';
// // import { triggerHaptic, cn } from '@/lib/utils';
// // import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// // import { Badge } from '@/components/ui/badge';
// // import { getCityName } from '@/lib/constants';
// // import { usePassengerShield } from '@/hooks/use-passenger-shield';
// // import { usePassengerMemory } from '@/hooks/use-passenger-memory';
// // import { useLocale } from 'next-intl';
// // import { useAgentOps } from '@/hooks/use-agent-ops';
// // import { useSovereignSearchContext } from '@/contexts/sovereign-search-context';

// // export function ProxyBookingForm() {
// //   const { user } = useUser();
// //   const firestore = useFirestore();
// //   const locale = useLocale();
// //   const { toast } = useToast();

// //   // [SSOT ARTERY]: Sharing context with the Radar via URL persistent filters
// //   const { filters: sharedRadarData, selectedTrip } = useSovereignSearchContext();
// //   const { isSubmitting, magicLink, setMagicLink, submitProxyBooking } = useAgentOps(user?.uid || '');

// //   const [carrierSearch, setCarrierSearch] = useState('');
// //   const [selectedCarrier, setSelectedCarrier] = useState<{ id: string, name: string } | null>(null);

// //   const form = useForm({
// //     defaultValues: {
// //       passengers: [{ passengerName: '', passengerPhone: '', nationality: '', documentId: '', passengerType: 'adult' }],
// //       agentFee: 0
// //     }
// //   });

// //   const { fields, replace } = useFieldArray({ control: form.control, name: "passengers" });

// //   // [PROTOCOL 16]: Dynamic Seat Balancing - Keeps form in sync with Radar choices
// //   useEffect(() => {
// //     const requiredSeats = sharedRadarData?.seats || 1;
// //     if (fields.length !== requiredSeats) {
// //       replace(Array.from({ length: requiredSeats }, (_, i) => ({
// //         passengerName: '', passengerPhone: '', nationality: '', documentId: '', passengerType: 'adult'
// //       })));
// //     }
// //   }, [sharedRadarData?.seats, replace, fields.length]);

// //   // [PROTOCOL 88]: Carrier Discovery - Limited to context
// //   const carriersQuery = useMemoFirebase(() => {
// //     if (!firestore || !sharedRadarData?.originCity) return null;
// //     return query(collection(firestore, 'users'), where('role', '==', 'carrier'), where('jurisdiction.origin', '==', sharedRadarData.originCity), limit(20));
// //   }, [firestore, sharedRadarData?.originCity]);
// //   const { data: availableCarriers } = useCollection(carriersQuery);

// //   const filteredCarriers = (availableCarriers || []).filter(c => {
// //     const term = carrierSearch.toLowerCase();
// //     return c.firstName?.toLowerCase().includes(term) || c.officeName?.toLowerCase().includes(term);
// //   }).slice(0, 5);

// //   // [PROTOCOL 16]: Identity Recall Reactor
// //   const watchPrimaryPhone = form.watch('passengers.0.passengerPhone');
// //   const { rememberedData } = usePassengerMemory(watchPrimaryPhone);
// //   const { hasActiveTrip } = usePassengerShield(watchPrimaryPhone);

// //   useEffect(() => {
// //     if (rememberedData && !form.getValues('passengers.0.passengerName')) {
// //       form.setValue('passengers.0.passengerName', rememberedData.name);
// //       form.setValue('passengers.0.nationality', rememberedData.nationality);
// //       form.setValue('passengers.0.documentId', rememberedData.documentId);
// //       form.setValue('passengers.0.passengerType', rememberedData.type as any);
// //     }
// //   }, [rememberedData, form]);

// //   const onSubmit = useCallback(async (data: any) => {
// //     if (hasActiveTrip) return;
// //     // ✅ لو في رحلة محددة مش محتاج originCity — لو مفيش رحلة لازم يكون في originCity
// //     if (!selectedTrip && !sharedRadarData?.originCity) return;

// //     await submitProxyBooking({
// //       passengers: data.passengers,
// //       agentFee: Number(data.agentFee),
// //       targetCarrierId: selectedCarrier?.id || selectedTrip?.carrierId,
// //       originCountry: sharedRadarData?.originCountry || '',
// //       originCity: sharedRadarData?.originCity || selectedTrip?.origin || '',
// //       destCountry: sharedRadarData?.destCountry || '',
// //       destCity: sharedRadarData?.destCity || selectedTrip?.destination || '',
// //       departureDate: selectedTrip?.departureDate || sharedRadarData?.travelDate?.toISOString(),
// //       passengersCount: sharedRadarData?.seats || 1,
// //       // ✅ لو في رحلة محددة → المسار 1 (Pending-Carrier-Confirmation)
// //       // ✅ لو مفيش → المسار 2 (Awaiting-Offers في السوق)
// //       tripId: selectedTrip?.id || null,
// //       requestType: selectedTrip?.id ? 'Direct' : selectedCarrier?.id ? 'Direct' : 'General'
// //     }, () => {
// //       triggerHaptic('success');
// //     });
// //   }, [submitProxyBooking, hasActiveTrip, sharedRadarData, selectedCarrier, selectedTrip]); // ✅ أضف selectedTrip

// //   if (magicLink) return (
// //     <div className="bg-emerald-950/20 border-2 border-emerald-500/20 p-6 rounded-[2.5rem] text-center space-y-4 animate-in zoom-in shadow-2xl backdrop-blur-xl">
// //       <div className="bg-emerald-500/10 p-3 rounded-full w-fit mx-auto"><CheckCircle2 className="h-12 w-12 text-emerald-500" /></div>
// //       <h3 className="font-black text-xl text-white">الرابط السحري جاهز!</h3>
// //       <div className="flex items-center gap-2 bg-black/40 p-2 rounded-2xl border border-white/10 shadow-inner">
// //         <Input value={magicLink} readOnly className="border-0 bg-transparent text-xs font-mono font-bold text-emerald-400" dir="ltr" />
// //         <Button onClick={() => { navigator.clipboard.writeText(magicLink); toast({ title: "تم النسخ 📋" }); }} size="icon" variant="secondary" className="rounded-xl bg-primary/10 text-primary"><Share2 className="h-4 w-4" /></Button>
// //       </div>
// //       <Button onClick={() => { setMagicLink(''); form.reset(); setSelectedCarrier(null); }} className="w-full h-14 rounded-2xl bg-primary text-black font-black">حجز جديد</Button>
// //     </div>
// //   );

// //   return (
// //     <Form {...form}>
// //       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-card border border-primary/10 p-6 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
// //         {sharedRadarData?.originCity && sharedRadarData?.destCity ? (
// //           <div className="space-y-2">
// //             <div className="bg-primary/5 border border-primary/20 p-4 rounded-3xl flex items-center justify-between shadow-inner">
// //               <div className="flex flex-col items-center"><PlaneTakeoff className="h-4 w-4 text-primary mb-1" /><span className="text-[10px] font-black">{getCityName(sharedRadarData.originCity, locale)}</span></div>
// //               <div className="flex-1 px-4"><div className="w-full h-px bg-primary/20 relative"><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-[8px] font-black text-primary">{sharedRadarData.seats} مقاعد</div></div></div>
// //               <div className="flex flex-col items-center"><PlaneLanding className="h-4 w-4 text-primary mb-1" /><span className="text-[10px] font-black">{getCityName(sharedRadarData.destCity, locale)}</span></div>
// //             </div>
// //             {selectedTrip && (
// //               <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-2xl flex items-center justify-between animate-in slide-in-from-top-2">
// //                 <div className="text-right">
// //                   <p className="text-[10px] font-black text-emerald-500">✓ رحلة محددة من الرادار</p>
// //                   <p className="text-xs font-black">{selectedTrip.carrierName}</p>
// //                   <p className="text-[10px] text-muted-foreground">{selectedTrip.departureDate ? new Date(selectedTrip.departureDate?.seconds ? selectedTrip.departureDate.seconds * 1000 : selectedTrip.departureDate).toLocaleDateString('ar') : ''}</p>
// //                 </div>
// //                 <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-mono text-xs">{selectedTrip.price} {selectedTrip.currency}</Badge>
// //               </div>
// //             )}
// //           </div>
// //         ) : (
// //           <div className="bg-muted/20 border border-dashed border-muted p-4 rounded-3xl text-center text-[10px] font-bold text-muted-foreground">حدد المسار في الرادار أولاً لتفعيل مفاعل الحجز</div>
// //         )}

// //         {/* [SCR-ABF]: لو الوكيل اختار رحلة → الناقل محدد تلقائياً، مش محتاج يبحث */}
// //         {!selectedTrip && (
// //           <div className="space-y-3 bg-muted/30 p-4 rounded-3xl border border-dashed border-primary/20">
// //             {!selectedCarrier ? (
// //               <div className="relative">
// //                 <UserCheck className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
// //                 <Input placeholder="ابحث عن كابتن محدد (اختياري)..." value={carrierSearch} onChange={e => setCarrierSearch(e.target.value)} className="h-11 rounded-2xl bg-background border-primary/5 pl-3 pr-10 text-xs font-bold text-right shadow-sm" />
// //                 {carrierSearch.length >= 2 && (
// //                   <div className="absolute top-full left-0 right-0 z-50 bg-background border border-primary/10 rounded-2xl mt-1 shadow-2xl overflow-hidden">
// //                     {filteredCarriers.map(c => (
// //                       <div key={c.id} className="p-3 flex items-center justify-between hover:bg-primary/5 cursor-pointer border-b border-primary/5 last:border-0" onClick={() => { setSelectedCarrier({ id: c.id, name: c.officeName || c.firstName }); setCarrierSearch(''); }}>
// //                         <div className="flex items-center gap-2"><Avatar className="h-7 w-7"><AvatarFallback className="text-[10px]">{c.firstName?.[0]}</AvatarFallback></Avatar><span className="text-[11px] font-black">{c.officeName || `${c.firstName} ${c.lastName}`}</span></div>
// //                         <PlusCircle className="h-4 w-4 text-primary opacity-40" />
// //                       </div>
// //                     ))}
// //                   </div>
// //                 )}
// //               </div>
// //             ) : (
// //               <div className="flex items-center justify-between bg-primary/10 p-2 rounded-2xl border border-primary/20 animate-in slide-in-from-right-2">
// //                 <div className="flex items-center gap-2"><Avatar className="h-8 w-8"><AvatarFallback className="bg-primary text-black text-[10px] font-black">{selectedCarrier.name[0]}</AvatarFallback></Avatar><span className="text-xs font-black text-primary">{selectedCarrier.name}</span></div>
// //                 <button type="button" className="text-[10px] font-black text-muted-foreground hover:text-destructive px-3" onClick={() => setSelectedCarrier(null)}>تغيير</button>
// //               </div>
// //             )}
// //           </div>
// //         )}

// //         <div className="space-y-6">
// //           {fields.map((field, index) => (
// //             <div key={field.id} className="space-y-4 p-4 bg-muted/10 rounded-[2rem] border border-primary/5 relative">
// //               <div className="flex items-center gap-2 border-b border-primary/5 pb-2 mb-2"><Badge className="bg-primary text-black h-5 w-5 rounded-full font-black">{index + 1}</Badge><span className="text-[10px] font-black text-primary uppercase">بيانات الراكب {index === 0 ? '(الأساسي)' : ''}</span></div>
// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                 <FormField control={form.control} name={`passengers.${index}.passengerName`} render={({ field }) => (
// //                   <FormItem><FormControl><Input placeholder="الاسم الرباعي" {...field} className="h-11 rounded-xl bg-background border-primary/5 text-xs font-bold text-right" /></FormControl></FormItem>
// //                 )} />
// //                 <FormField control={form.control} name={`passengers.${index}.passengerPhone`} render={({ field }) => (
// //                   <FormItem><FormControl><Input placeholder="+962..." {...field} dir="ltr" className={cn("h-11 rounded-xl bg-background border-primary/5 font-mono text-xs", index === 0 && hasActiveTrip && "border-destructive bg-destructive/5")} /></FormControl></FormItem>
// //                 )} />
// //                 <FormField control={form.control} name={`passengers.${index}.nationality`} render={({ field }) => (
// //                   <FormItem><FormControl><Input placeholder="الجنسية (مثال: أردني)" {...field} className="h-11 rounded-xl bg-background border-primary/5 text-xs font-bold text-right" /></FormControl></FormItem>
// //                 )} />
// //                 <FormField control={form.control} name={`passengers.${index}.documentId`} render={({ field }) => (
// //                   <FormItem><FormControl><Input placeholder="رقم الوثيقة / الجواز" {...field} dir="ltr" className="h-11 rounded-xl bg-background border-primary/5 font-mono text-xs" /></FormControl></FormItem>
// //                 )} />
// //               </div>
// //             </div>
// //           ))}
// //         </div>

// //         <FormField control={form.control} name="agentFee" render={({ field }) => (
// //           <FormItem className="mt-4"><FormLabel className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center justify-center gap-2 mb-2"><Zap className="h-4 w-4" /> العمولة الميدانية (JOD)</FormLabel><FormControl><Input type="number" {...field} className="h-16 rounded-[1.5rem] bg-primary/5 border-primary/20 text-3xl font-black text-center text-primary" /></FormControl></FormItem>
// //         )} />

// //         <Button type="submit" className={cn("w-full font-black h-16 rounded-3xl text-xl shadow-2xl transition-all gap-3",
// //           (hasActiveTrip || !sharedRadarData?.originCity) ? "bg-muted cursor-not-allowed" :
// //             selectedTrip ? "bg-emerald-600 hover:bg-emerald-700 text-white" :
// //               "bg-primary text-black hover:bg-primary/90"
// //         )} disabled={isSubmitting || hasActiveTrip || !sharedRadarData?.originCity}>
// //           {isSubmitting ? <Loader2 className="animate-spin h-6 w-6" /> : selectedTrip ? (
// //             <><Zap className="h-6 w-6" /> إرسال طلب للناقل</>
// //           ) : (
// //             <><Zap className="h-6 w-6" /> نشر في السوق وتوليد الرابط</>
// //           )}
// //         </Button>
// //       </form>
// //     </Form>
// //   );
// // }

// //==========================
// 'use client';

// /**
//  * @component ProxyBookingForm
//  * @description THE STERILIZED AGENT INTAKE (V32.0 - DIAMOND)
//  * [PROTOCOL 16]: Diamond Sterilized. Pure functional island.
//  * [PROTOCOL 88]: Minimalist logic. Consumes unified search artery.
//  * Loose Coupling: Syncs with SmartRadar via shared useSovereignSearch pulse.
//  */

// import React, { useState, useCallback, useEffect } from 'react';
// import { useForm, useFieldArray } from 'react-hook-form';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Zap, CheckCircle2, Loader2, Share2, PlusCircle, UserCheck, PlaneTakeoff, PlaneLanding } from 'lucide-react';
// import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
// import { collection, query, where, limit } from 'firebase/firestore';
// import { useToast } from '@/hooks/use-toast';
// import { triggerHaptic, cn } from '@/lib/utils';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Badge } from '@/components/ui/badge';
// import { getCityName } from '@/lib/constants';
// import { usePassengerShield } from '@/hooks/use-passenger-shield';
// import { usePassengerMemory } from '@/hooks/use-passenger-memory';
// import { useLocale } from 'next-intl';
// import { useAgentOps } from '@/hooks/use-agent-ops';
// import { useSovereignSearchContext } from '@/contexts/sovereign-search-context';

// const COUNTRY_CODES = [
//   { code: '+962', flag: '🇯🇴', name: 'الأردن' },
//   { code: '+964', flag: '🇮🇶', name: 'العراق' },
//   { code: '+963', flag: '🇸🇾', name: 'سوريا' },
//   { code: '+966', flag: '🇸🇦', name: 'السعودية' },
//   { code: '+971', flag: '🇦🇪', name: 'الإمارات' },
//   { code: '+965', flag: '🇰🇼', name: 'الكويت' },
//   { code: '+973', flag: '🇧🇭', name: 'البحرين' },
//   { code: '+974', flag: '🇶🇦', name: 'قطر' },
//   { code: '+968', flag: '🇴🇲', name: 'عُمان' },
//   { code: '+20', flag: '🇪🇬', name: 'مصر' },
//   { code: '+961', flag: '🇱🇧', name: 'لبنان' },
//   { code: '+970', flag: '🇵🇸', name: 'فلسطين' },
//   { code: '+90', flag: '🇹🇷', name: 'تركيا' },
//   { code: '+98', flag: '🇮🇷', name: 'إيران' },
//   { code: '+44', flag: '🇬🇧', name: 'بريطانيا' },
//   { code: '+1', flag: '🇺🇸', name: 'أمريكا' },
//   { code: '+49', flag: '🇩🇪', name: 'ألمانيا' },
// ];

// export function ProxyBookingForm() {
//   const { user } = useUser();
//   const firestore = useFirestore();
//   const locale = useLocale();
//   const { toast } = useToast();

//   // [SSOT ARTERY]: Sharing context with the Radar via URL persistent filters
//   const { filters: sharedRadarData, selectedTrip } = useSovereignSearchContext();
//   const { isSubmitting, magicLink, setMagicLink, submitProxyBooking } = useAgentOps(user?.uid || '');

//   const [carrierSearch, setCarrierSearch] = useState('');
//   const [selectedCarrier, setSelectedCarrier] = useState<{ id: string, name: string } | null>(null);

//   const form = useForm({
//     defaultValues: {
//       passengers: [{ passengerName: '', passengerPhone: '', passengerPhoneCode: '+962', nationality: '', documentId: '', passengerType: 'adult' }],
//       agentFee: 0
//     }
//   });

//   const { fields, replace } = useFieldArray({ control: form.control, name: "passengers" });

//   // [PROTOCOL 16]: Dynamic Seat Balancing - Keeps form in sync with Radar choices
//   useEffect(() => {
//     const requiredSeats = sharedRadarData?.seats || 1;
//     if (fields.length !== requiredSeats) {
//       replace(Array.from({ length: requiredSeats }, (_, i) => ({
//         passengerName: '', passengerPhone: '', passengerPhoneCode: '+962', nationality: '', documentId: '', passengerType: 'adult'
//       })));
//     }
//   }, [sharedRadarData?.seats, replace, fields.length]);

//   // [PROTOCOL 88]: Carrier Discovery - Limited to context
//   const carriersQuery = useMemoFirebase(() => {
//     if (!firestore || !sharedRadarData?.originCity) return null;
//     return query(collection(firestore, 'users'), where('role', '==', 'carrier'), where('jurisdiction.origin', '==', sharedRadarData.originCity), limit(20));
//   }, [firestore, sharedRadarData?.originCity]);
//   const { data: availableCarriers } = useCollection(carriersQuery);

//   const filteredCarriers = (availableCarriers || []).filter(c => {
//     const term = carrierSearch.toLowerCase();
//     return c.firstName?.toLowerCase().includes(term) || c.officeName?.toLowerCase().includes(term);
//   }).slice(0, 5);

//   // [PROTOCOL 16]: Identity Recall Reactor
//   const watchPrimaryPhone = form.watch('passengers.0.passengerPhone');
//   const { rememberedData } = usePassengerMemory(watchPrimaryPhone);
//   const { hasActiveTrip } = usePassengerShield(watchPrimaryPhone);

//   useEffect(() => {
//     if (rememberedData && !form.getValues('passengers.0.passengerName')) {
//       form.setValue('passengers.0.passengerName', rememberedData.name);
//       form.setValue('passengers.0.nationality', rememberedData.nationality);
//       form.setValue('passengers.0.documentId', rememberedData.documentId);
//       form.setValue('passengers.0.passengerType', rememberedData.type as any);
//     }
//   }, [rememberedData, form]);

//   const onSubmit = useCallback(async (data: any) => {
//     if (hasActiveTrip) return;
//     if (!selectedTrip && !sharedRadarData?.originCity) return;

//     // ✅ التحقق من اكتمال بيانات المسافرين
//     const passengers = data.passengers || [];
//     const incomplete = passengers.some((p: any) =>
//       !p.passengerName?.trim() ||
//       !p.nationality?.trim() ||
//       !p.documentId?.trim() ||
//       !p.passengerPhone?.trim()
//     );

//     if (incomplete) {
//       toast({
//         variant: 'destructive',
//         title: '❌ بيانات المسافر ناقصة',
//         description: 'يجب إدخال الاسم والجنسية ورقم الوثيقة ورقم الهاتف لكل مسافر قبل إتمام الحجز.',
//       });
//       return;
//     }

//     // دمج كود الدولة مع رقم الهاتف
//     const passengersWithFullPhone = passengers.map((p: any) => ({
//       ...p,
//       passengerPhone: `${p.passengerPhoneCode || '+962'}${p.passengerPhone.replace(/^0/, '')}`,
//     }));

//     await submitProxyBooking({
//       passengers: passengersWithFullPhone,
//       agentFee: Number(data.agentFee),
//       targetCarrierId: selectedCarrier?.id || selectedTrip?.carrierId,
//       originCountry: sharedRadarData?.originCountry || '',
//       originCity: sharedRadarData?.originCity || selectedTrip?.origin || '',
//       destCountry: sharedRadarData?.destCountry || '',
//       destCity: sharedRadarData?.destCity || selectedTrip?.destination || '',
//       departureDate: selectedTrip?.departureDate || sharedRadarData?.travelDate?.toISOString(),
//       passengersCount: sharedRadarData?.seats || 1,
//       // ✅ لو في رحلة محددة → المسار 1 (Pending-Carrier-Confirmation)
//       // ✅ لو مفيش → المسار 2 (Awaiting-Offers في السوق)
//       tripId: selectedTrip?.id || null,
//       requestType: selectedTrip?.id ? 'Direct' : selectedCarrier?.id ? 'Direct' : 'General'
//     }, () => {
//       triggerHaptic('success');
//     });
//   }, [submitProxyBooking, hasActiveTrip, sharedRadarData, selectedCarrier, selectedTrip]); // ✅ أضف selectedTrip

//   if (magicLink) return (
//     <div className="bg-emerald-950/20 border-2 border-emerald-500/20 p-6 rounded-[2.5rem] text-center space-y-4 animate-in zoom-in shadow-2xl backdrop-blur-xl">
//       <div className="bg-emerald-500/10 p-3 rounded-full w-fit mx-auto"><CheckCircle2 className="h-12 w-12 text-emerald-500" /></div>
//       <h3 className="font-black text-xl text-white">الرابط السحري جاهز!</h3>
//       <div className="flex items-center gap-2 bg-black/40 p-2 rounded-2xl border border-white/10 shadow-inner">
//         <Input value={magicLink} readOnly className="border-0 bg-transparent text-xs font-mono font-bold text-emerald-400" dir="ltr" />
//         <Button onClick={() => { navigator.clipboard.writeText(magicLink); toast({ title: "تم النسخ 📋" }); }} size="icon" variant="secondary" className="rounded-xl bg-primary/10 text-primary"><Share2 className="h-4 w-4" /></Button>
//       </div>
//       <Button onClick={() => { setMagicLink(''); form.reset(); setSelectedCarrier(null); }} className="w-full h-14 rounded-2xl bg-primary text-black font-black">حجز جديد</Button>
//     </div>
//   );

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-card border border-primary/10 p-6 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
//         {sharedRadarData?.originCity && sharedRadarData?.destCity ? (
//           <div className="space-y-2">
//             <div className="bg-primary/5 border border-primary/20 p-4 rounded-3xl flex items-center justify-between shadow-inner">
//               <div className="flex flex-col items-center"><PlaneTakeoff className="h-4 w-4 text-primary mb-1" /><span className="text-[10px] font-black">{getCityName(sharedRadarData.originCity, locale)}</span></div>
//               <div className="flex-1 px-4"><div className="w-full h-px bg-primary/20 relative"><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-[8px] font-black text-primary">{sharedRadarData.seats} مقاعد</div></div></div>
//               <div className="flex flex-col items-center"><PlaneLanding className="h-4 w-4 text-primary mb-1" /><span className="text-[10px] font-black">{getCityName(sharedRadarData.destCity, locale)}</span></div>
//             </div>
//             {selectedTrip && (
//               <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-2xl flex items-center justify-between animate-in slide-in-from-top-2">
//                 <div className="text-right">
//                   <p className="text-[10px] font-black text-emerald-500">✓ رحلة محددة من الرادار</p>
//                   <p className="text-xs font-black">{selectedTrip.carrierName}</p>
//                   <p className="text-[10px] text-muted-foreground">{selectedTrip.departureDate ? new Date(selectedTrip.departureDate?.seconds ? selectedTrip.departureDate.seconds * 1000 : selectedTrip.departureDate).toLocaleDateString('ar') : ''}</p>
//                 </div>
//                 <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-mono text-xs">{selectedTrip.price} {selectedTrip.currency}</Badge>
//               </div>
//             )}
//           </div>
//         ) : (
//           <div className="bg-muted/20 border border-dashed border-muted p-4 rounded-3xl text-center text-[10px] font-bold text-muted-foreground">حدد المسار في الرادار أولاً لتفعيل مفاعل الحجز</div>
//         )}

//         {/* [SCR-ABF]: لو الوكيل اختار رحلة → الناقل محدد تلقائياً، مش محتاج يبحث */}
//         {!selectedTrip && (
//           <div className="space-y-3 bg-muted/30 p-4 rounded-3xl border border-dashed border-primary/20">
//             {!selectedCarrier ? (
//               <div className="relative">
//                 <UserCheck className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                 <Input placeholder="ابحث عن كابتن محدد (اختياري)..." value={carrierSearch} onChange={e => setCarrierSearch(e.target.value)} className="h-11 rounded-2xl bg-background border-primary/5 pl-3 pr-10 text-xs font-bold text-right shadow-sm" />
//                 {carrierSearch.length >= 2 && (
//                   <div className="absolute top-full left-0 right-0 z-50 bg-background border border-primary/10 rounded-2xl mt-1 shadow-2xl overflow-hidden">
//                     {filteredCarriers.map(c => (
//                       <div key={c.id} className="p-3 flex items-center justify-between hover:bg-primary/5 cursor-pointer border-b border-primary/5 last:border-0" onClick={() => { setSelectedCarrier({ id: c.id, name: c.officeName || c.firstName }); setCarrierSearch(''); }}>
//                         <div className="flex items-center gap-2"><Avatar className="h-7 w-7"><AvatarFallback className="text-[10px]">{c.firstName?.[0]}</AvatarFallback></Avatar><span className="text-[11px] font-black">{c.officeName || `${c.firstName} ${c.lastName}`}</span></div>
//                         <PlusCircle className="h-4 w-4 text-primary opacity-40" />
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <div className="flex items-center justify-between bg-primary/10 p-2 rounded-2xl border border-primary/20 animate-in slide-in-from-right-2">
//                 <div className="flex items-center gap-2"><Avatar className="h-8 w-8"><AvatarFallback className="bg-primary text-black text-[10px] font-black">{selectedCarrier.name[0]}</AvatarFallback></Avatar><span className="text-xs font-black text-primary">{selectedCarrier.name}</span></div>
//                 <button type="button" className="text-[10px] font-black text-muted-foreground hover:text-destructive px-3" onClick={() => setSelectedCarrier(null)}>تغيير</button>
//               </div>
//             )}
//           </div>
//         )}

//         <div className="space-y-6">
//           {fields.map((field, index) => (
//             <div key={field.id} className="space-y-4 p-4 bg-muted/10 rounded-[2rem] border border-primary/5 relative">
//               <div className="flex items-center gap-2 border-b border-primary/5 pb-2 mb-2"><Badge className="bg-primary text-black h-5 w-5 rounded-full font-black">{index + 1}</Badge><span className="text-[10px] font-black text-primary uppercase">بيانات الراكب {index === 0 ? '(الأساسي)' : ''}</span></div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <FormField control={form.control} name={`passengers.${index}.passengerName`} render={({ field }) => (
//                   <FormItem><FormControl><Input placeholder="الاسم الرباعي" {...field} className="h-11 rounded-xl bg-background border-primary/5 text-xs font-bold text-right" /></FormControl></FormItem>
//                 )} />
//                 <FormField control={form.control} name={`passengers.${index}.passengerPhone`} render={({ field }) => (
//                   <FormItem>
//                     <FormControl>
//                       <div className={cn("flex h-11 rounded-xl bg-background border border-primary/5 overflow-hidden", index === 0 && hasActiveTrip && "border-destructive bg-destructive/5")}>
//                         <FormField control={form.control} name={`passengers.${index}.passengerPhoneCode`} render={({ field: codeField }) => (
//                           <Select value={codeField.value || '+962'} onValueChange={codeField.onChange}>
//                             <SelectTrigger className="w-24 h-full border-0 border-l border-primary/10 rounded-none bg-primary/5 text-xs font-mono focus:ring-0 px-2">
//                               <SelectValue />
//                             </SelectTrigger>
//                             <SelectContent>
//                               {COUNTRY_CODES.map(c => (
//                                 <SelectItem key={c.code} value={c.code} className="text-xs font-mono">
//                                   {c.flag} {c.code} {c.name}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                         )} />
//                         <Input placeholder="7XXXXXXXX" {...field} dir="ltr" className="h-full border-0 rounded-none bg-transparent font-mono text-xs flex-1 focus-visible:ring-0" />
//                       </div>
//                     </FormControl>
//                   </FormItem>
//                 )} />
//                 <FormField control={form.control} name={`passengers.${index}.nationality`} render={({ field }) => (
//                   <FormItem><FormControl><Input placeholder="الجنسية (مثال: أردني)" {...field} className="h-11 rounded-xl bg-background border-primary/5 text-xs font-bold text-right" /></FormControl></FormItem>
//                 )} />
//                 <FormField control={form.control} name={`passengers.${index}.documentId`} render={({ field }) => (
//                   <FormItem><FormControl><Input placeholder="رقم الوثيقة / الجواز" {...field} dir="ltr" className="h-11 rounded-xl bg-background border-primary/5 font-mono text-xs" /></FormControl></FormItem>
//                 )} />
//               </div>
//             </div>
//           ))}
//         </div>

//         <FormField control={form.control} name="agentFee" render={({ field }) => (
//           <FormItem className="mt-4"><FormLabel className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center justify-center gap-2 mb-2"><Zap className="h-4 w-4" /> العمولة الميدانية (JOD)</FormLabel><FormControl><Input type="number" {...field} className="h-16 rounded-[1.5rem] bg-primary/5 border-primary/20 text-3xl font-black text-center text-primary" /></FormControl></FormItem>
//         )} />

//         <Button type="submit" className={cn("w-full font-black h-16 rounded-3xl text-xl shadow-2xl transition-all gap-3",
//           (hasActiveTrip || !sharedRadarData?.originCity) ? "bg-muted cursor-not-allowed" :
//             selectedTrip ? "bg-emerald-600 hover:bg-emerald-700 text-white" :
//               "bg-primary text-black hover:bg-primary/90"
//         )} disabled={isSubmitting || hasActiveTrip || !sharedRadarData?.originCity}>
//           {isSubmitting ? <Loader2 className="animate-spin h-6 w-6" /> : selectedTrip ? (
//             <><Zap className="h-6 w-6" /> إرسال طلب للناقل</>
//           ) : (
//             <><Zap className="h-6 w-6" /> نشر في السوق وتوليد الرابط</>
//           )}
//         </Button>
//       </form>
//     </Form>
//   );
// }

//==========================
'use client';

/**
 * @component ProxyBookingForm
 * @description THE STERILIZED AGENT INTAKE (V32.0 - DIAMOND)
 * [PROTOCOL 16]: Diamond Sterilized. Pure functional island.
 * [PROTOCOL 88]: Minimalist logic. Consumes unified search artery.
 * Loose Coupling: Syncs with SmartRadar via shared useSovereignSearch pulse.
 */

import React, { useState, useCallback, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Zap, CheckCircle2, Loader2, Share2, PlusCircle, UserCheck, PlaneTakeoff, PlaneLanding } from 'lucide-react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { triggerHaptic, cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getCityName } from '@/lib/constants';
import { usePassengerShield } from '@/hooks/use-passenger-shield';
import { usePassengerMemory } from '@/hooks/use-passenger-memory';
import { useLocale } from 'next-intl';
import { useAgentOps } from '@/hooks/use-agent-ops';
import { useSovereignSearchContext } from '@/contexts/sovereign-search-context';

const COUNTRY_CODES = [
  { code: '+962', flag: '🇯🇴', name: 'الأردن' },
  { code: '+964', flag: '🇮🇶', name: 'العراق' },
  { code: '+963', flag: '🇸🇾', name: 'سوريا' },
  { code: '+966', flag: '🇸🇦', name: 'السعودية' },
  { code: '+971', flag: '🇦🇪', name: 'الإمارات' },
  { code: '+965', flag: '🇰🇼', name: 'الكويت' },
  { code: '+973', flag: '🇧🇭', name: 'البحرين' },
  { code: '+974', flag: '🇶🇦', name: 'قطر' },
  { code: '+968', flag: '🇴🇲', name: 'عُمان' },
  { code: '+20', flag: '🇪🇬', name: 'مصر' },
  { code: '+961', flag: '🇱🇧', name: 'لبنان' },
  { code: '+970', flag: '🇵🇸', name: 'فلسطين' },
  { code: '+90', flag: '🇹🇷', name: 'تركيا' },
  { code: '+98', flag: '🇮🇷', name: 'إيران' },
  { code: '+44', flag: '🇬🇧', name: 'بريطانيا' },
  { code: '+1', flag: '🇺🇸', name: 'أمريكا' },
  { code: '+49', flag: '🇩🇪', name: 'ألمانيا' },
];

export function ProxyBookingForm() {
  const { user } = useUser();
  const firestore = useFirestore();
  const locale = useLocale();
  const { toast } = useToast();

  // [SSOT ARTERY]: Sharing context with the Radar via URL persistent filters
  const { filters: sharedRadarData, selectedTrip } = useSovereignSearchContext();
  const { isSubmitting, magicLink, setMagicLink, submitProxyBooking } = useAgentOps(user?.uid || '');

  const [carrierSearch, setCarrierSearch] = useState('');
  const [selectedCarrier, setSelectedCarrier] = useState<{ id: string, name: string } | null>(null);

  const form = useForm({
    defaultValues: {
      passengers: [{ passengerName: '', passengerPhone: '', passengerPhoneCode: '+962', nationality: '', documentId: '', passengerType: 'adult' }],
      agentFee: 0
    }
  });

  const { fields, replace } = useFieldArray({ control: form.control, name: "passengers" });

  // [PROTOCOL 16]: Dynamic Seat Balancing - Keeps form in sync with Radar choices
  useEffect(() => {
    const requiredSeats = sharedRadarData?.seats || 1;
    if (fields.length !== requiredSeats) {
      replace(Array.from({ length: requiredSeats }, (_, i) => ({
        passengerName: '', passengerPhone: '', passengerPhoneCode: '+962', nationality: '', documentId: '', passengerType: 'adult'
      })));
    }
  }, [sharedRadarData?.seats, replace, fields.length]);

  // [PROTOCOL 88]: Carrier Discovery - Limited to context
  const carriersQuery = useMemoFirebase(() => {
    if (!firestore || !sharedRadarData?.originCity) return null;
    return query(collection(firestore, 'users'), where('role', '==', 'carrier'), where('jurisdiction.origin', '==', sharedRadarData.originCity), limit(20));
  }, [firestore, sharedRadarData?.originCity]);
  const { data: availableCarriers } = useCollection(carriersQuery);

  const filteredCarriers = (availableCarriers || []).filter(c => {
    const term = carrierSearch.toLowerCase();
    return c.firstName?.toLowerCase().includes(term) || c.officeName?.toLowerCase().includes(term);
  }).slice(0, 5);

  // [PROTOCOL 16]: Identity Recall Reactor
  const watchPrimaryPhone = form.watch('passengers.0.passengerPhone');
  const { rememberedData } = usePassengerMemory(watchPrimaryPhone);
  const { hasActiveTrip } = usePassengerShield(watchPrimaryPhone);

  useEffect(() => {
    if (rememberedData && !form.getValues('passengers.0.passengerName')) {
      form.setValue('passengers.0.passengerName', rememberedData.name);
      form.setValue('passengers.0.nationality', rememberedData.nationality);
      form.setValue('passengers.0.documentId', rememberedData.documentId);
      form.setValue('passengers.0.passengerType', rememberedData.type as any);
    }
  }, [rememberedData, form]);

  const onSubmit = useCallback(async (data: any) => {
    if (hasActiveTrip) return;
    // ✅ الوكيل لازم يختار رحلة من الفلتر
    if (!selectedTrip) return;

    // ✅ التحقق من اكتمال بيانات المسافرين
    const passengers = data.passengers || [];
    const incomplete = passengers.some((p: any) =>
      !p.passengerName?.trim() ||
      !p.nationality?.trim() ||
      !p.documentId?.trim() ||
      !p.passengerPhone?.trim()
    );

    if (incomplete) {
      toast({
        variant: 'destructive',
        title: '❌ بيانات المسافر ناقصة',
        description: 'يجب إدخال الاسم والجنسية ورقم الوثيقة ورقم الهاتف لكل مسافر قبل إتمام الحجز.',
      });
      return;
    }

    // دمج كود الدولة مع رقم الهاتف
    const passengersWithFullPhone = passengers.map((p: any) => ({
      ...p,
      passengerPhone: `${p.passengerPhoneCode || '+962'}${p.passengerPhone.replace(/^0/, '')}`,
    }));

    await submitProxyBooking({
      passengers: passengersWithFullPhone,
      agentFee: Number(data.agentFee),
      targetCarrierId: selectedCarrier?.id || selectedTrip?.carrierId,
      originCountry: sharedRadarData?.originCountry || '',
      originCity: sharedRadarData?.originCity || selectedTrip?.origin || '',
      destCountry: sharedRadarData?.destCountry || '',
      destCity: sharedRadarData?.destCity || selectedTrip?.destination || '',
      departureDate: selectedTrip?.departureDate || sharedRadarData?.travelDate?.toISOString(),
      passengersCount: sharedRadarData?.seats || 1,
      // ✅ لو في رحلة محددة → المسار 1 (Pending-Carrier-Confirmation)
      // ✅ لو مفيش → المسار 2 (Awaiting-Offers في السوق)
      tripId: selectedTrip?.id || null,
      requestType: selectedTrip?.id ? 'Direct' : selectedCarrier?.id ? 'Direct' : 'General'
    }, () => {
      triggerHaptic('success');
    });
  }, [submitProxyBooking, hasActiveTrip, sharedRadarData, selectedCarrier, selectedTrip]); // ✅ أضف selectedTrip

  if (magicLink) return (
    <div className="bg-emerald-950/20 border-2 border-emerald-500/20 p-6 rounded-[2.5rem] text-center space-y-4 animate-in zoom-in shadow-2xl backdrop-blur-xl">
      <div className="bg-emerald-500/10 p-3 rounded-full w-fit mx-auto"><CheckCircle2 className="h-12 w-12 text-emerald-500" /></div>
      <h3 className="font-black text-xl text-white">الرابط السحري جاهز!</h3>
      <div className="flex items-center gap-2 bg-black/40 p-2 rounded-2xl border border-white/10 shadow-inner">
        <Input value={magicLink} readOnly className="border-0 bg-transparent text-xs font-mono font-bold text-emerald-400" dir="ltr" />
        <Button onClick={() => { navigator.clipboard.writeText(magicLink); toast({ title: "تم النسخ 📋" }); }} size="icon" variant="secondary" className="rounded-xl bg-primary/10 text-primary"><Share2 className="h-4 w-4" /></Button>
      </div>
      <Button onClick={() => { setMagicLink(''); form.reset(); setSelectedCarrier(null); }} className="w-full h-14 rounded-2xl bg-primary text-black font-black">حجز جديد</Button>
    </div>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-card border border-primary/10 p-6 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        {sharedRadarData?.originCity && sharedRadarData?.destCity ? (
          <div className="space-y-2">
            <div className="bg-primary/5 border border-primary/20 p-4 rounded-3xl flex items-center justify-between shadow-inner">
              <div className="flex flex-col items-center"><PlaneTakeoff className="h-4 w-4 text-primary mb-1" /><span className="text-[10px] font-black">{getCityName(sharedRadarData.originCity, locale)}</span></div>
              <div className="flex-1 px-4"><div className="w-full h-px bg-primary/20 relative"><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-[8px] font-black text-primary">{sharedRadarData.seats} مقاعد</div></div></div>
              <div className="flex flex-col items-center"><PlaneLanding className="h-4 w-4 text-primary mb-1" /><span className="text-[10px] font-black">{getCityName(sharedRadarData.destCity, locale)}</span></div>
            </div>
            {selectedTrip && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-2xl flex items-center justify-between animate-in slide-in-from-top-2">
                <div className="text-right">
                  <p className="text-[10px] font-black text-emerald-500">✓ رحلة محددة من الرادار</p>
                  <p className="text-xs font-black">{selectedTrip.carrierName}</p>
                  <p className="text-[10px] text-muted-foreground">{selectedTrip.departureDate ? new Date(selectedTrip.departureDate?.seconds ? selectedTrip.departureDate.seconds * 1000 : selectedTrip.departureDate).toLocaleDateString('ar') : ''}</p>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-mono text-xs">{selectedTrip.price} {selectedTrip.currency}</Badge>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-muted/20 border border-dashed border-muted p-4 rounded-3xl text-center text-[10px] font-bold text-muted-foreground">حدد المسار في الرادار أولاً لتفعيل مفاعل الحجز</div>
        )}

        {/* [SCR-ABF]: لو الوكيل اختار رحلة → الناقل محدد تلقائياً، مش محتاج يبحث */}
        {!selectedTrip && (
          <div className="space-y-3 bg-muted/30 p-4 rounded-3xl border border-dashed border-primary/20">
            {!selectedCarrier ? (
              <div className="relative">
                <UserCheck className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="ابحث عن كابتن محدد (اختياري)..." value={carrierSearch} onChange={e => setCarrierSearch(e.target.value)} className="h-11 rounded-2xl bg-background border-primary/5 pl-3 pr-10 text-xs font-bold text-right shadow-sm" />
                {carrierSearch.length >= 2 && (
                  <div className="absolute top-full left-0 right-0 z-50 bg-background border border-primary/10 rounded-2xl mt-1 shadow-2xl overflow-hidden">
                    {filteredCarriers.map(c => (
                      <div key={c.id} className="p-3 flex items-center justify-between hover:bg-primary/5 cursor-pointer border-b border-primary/5 last:border-0" onClick={() => { setSelectedCarrier({ id: c.id, name: c.officeName || c.firstName }); setCarrierSearch(''); }}>
                        <div className="flex items-center gap-2"><Avatar className="h-7 w-7"><AvatarFallback className="text-[10px]">{c.firstName?.[0]}</AvatarFallback></Avatar><span className="text-[11px] font-black">{c.officeName || `${c.firstName} ${c.lastName}`}</span></div>
                        <PlusCircle className="h-4 w-4 text-primary opacity-40" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between bg-primary/10 p-2 rounded-2xl border border-primary/20 animate-in slide-in-from-right-2">
                <div className="flex items-center gap-2"><Avatar className="h-8 w-8"><AvatarFallback className="bg-primary text-black text-[10px] font-black">{selectedCarrier.name[0]}</AvatarFallback></Avatar><span className="text-xs font-black text-primary">{selectedCarrier.name}</span></div>
                <button type="button" className="text-[10px] font-black text-muted-foreground hover:text-destructive px-3" onClick={() => setSelectedCarrier(null)}>تغيير</button>
              </div>
            )}
          </div>
        )}

        <div className="space-y-6">
          {fields.map((field, index) => (
            <div key={field.id} className="space-y-4 p-4 bg-muted/10 rounded-[2rem] border border-primary/5 relative">
              <div className="flex items-center gap-2 border-b border-primary/5 pb-2 mb-2"><Badge className="bg-primary text-black h-5 w-5 rounded-full font-black">{index + 1}</Badge><span className="text-[10px] font-black text-primary uppercase">بيانات الراكب {index === 0 ? '(الأساسي)' : ''}</span></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name={`passengers.${index}.passengerName`} render={({ field }) => (
                  <FormItem><FormControl><Input placeholder="الاسم الرباعي" {...field} className="h-11 rounded-xl bg-background border-primary/5 text-xs font-bold text-right" /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name={`passengers.${index}.passengerPhone`} render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className={cn("flex h-11 rounded-xl bg-background border border-primary/5 overflow-hidden", index === 0 && hasActiveTrip && "border-destructive bg-destructive/5")}>
                        <FormField control={form.control} name={`passengers.${index}.passengerPhoneCode`} render={({ field: codeField }) => (
                          <Select value={codeField.value || '+962'} onValueChange={codeField.onChange}>
                            <SelectTrigger className="w-24 h-full border-0 border-l border-primary/10 rounded-none bg-primary/5 text-xs font-mono focus:ring-0 px-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {COUNTRY_CODES.map(c => (
                                <SelectItem key={c.code} value={c.code} className="text-xs font-mono">
                                  {c.flag} {c.code} {c.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )} />
                        <Input placeholder="7XXXXXXXX" {...field} dir="ltr" className="h-full border-0 rounded-none bg-transparent font-mono text-xs flex-1 focus-visible:ring-0" />
                      </div>
                    </FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name={`passengers.${index}.nationality`} render={({ field }) => (
                  <FormItem><FormControl><Input placeholder="الجنسية (مثال: أردني)" {...field} className="h-11 rounded-xl bg-background border-primary/5 text-xs font-bold text-right" /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name={`passengers.${index}.documentId`} render={({ field }) => (
                  <FormItem><FormControl><Input placeholder="رقم الوثيقة / الجواز" {...field} dir="ltr" className="h-11 rounded-xl bg-background border-primary/5 font-mono text-xs" /></FormControl></FormItem>
                )} />
              </div>
            </div>
          ))}
        </div>

        <FormField control={form.control} name="agentFee" render={({ field }) => (
          <FormItem className="mt-4"><FormLabel className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center justify-center gap-2 mb-2"><Zap className="h-4 w-4" /> العمولة الميدانية (JOD)</FormLabel><FormControl><Input type="number" {...field} className="h-16 rounded-[1.5rem] bg-primary/5 border-primary/20 text-3xl font-black text-center text-primary" /></FormControl></FormItem>
        )} />

        <Button type="submit" className={cn("w-full font-black h-16 rounded-3xl text-xl shadow-2xl transition-all gap-3",
          (hasActiveTrip || !selectedTrip) ? "bg-muted cursor-not-allowed" :
            selectedTrip ? "bg-emerald-600 hover:bg-emerald-700 text-white" :
              "bg-primary text-black hover:bg-primary/90"
        )} disabled={isSubmitting || hasActiveTrip || !selectedTrip}>
          {isSubmitting ? <Loader2 className="animate-spin h-6 w-6" /> : selectedTrip ? (
            <><Zap className="h-6 w-6" /> إرسال طلب للناقل</>
          ) : (
            <><Zap className="h-6 w-6" /> نشر في السوق وتوليد الرابط</>
          )}
        </Button>
      </form>
    </Form>
  );
}