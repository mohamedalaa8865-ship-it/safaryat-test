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
import { useUser, useFirestore, useFunctions, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { collection, query, where, limit, doc, getDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { useUserProfile } from '@/hooks/use-user-profile';
import { useToast } from '@/hooks/use-toast';
import { triggerHaptic, cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getCityName } from '@/lib/constants';
import { usePassengerShield } from '@/hooks/use-passenger-shield';
import { usePassengerMemory } from '@/hooks/use-passenger-memory';
import { useLocale, useTranslations } from 'next-intl';
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
  { code: '+98', flag: '🇮ران', name: 'إيران' },
  { code: '+44', flag: '🇬🇧', name: 'بريطانيا' },
  { code: '+1', flag: '🇺🇸', name: 'أمريكا' },
  { code: '+49', flag: '🇩🇪', name: 'ألمانيا' },
];

export function ProxyBookingForm() {
  const { user } = useUser();
  const firestore = useFirestore();
  const functions = useFunctions();
  const locale = useLocale();
  const { toast } = useToast();
  const { profile, isLoading: isProfileLoading } = useUserProfile();
  const t = useTranslations('ProxyBookingForm');
  const inputDir = locale === 'en' ? 'ltr' : 'rtl';
  // [SSOT ARTERY]: Sharing context with the Radar via URL persistent filters
  const { filters: sharedRadarData, selectedTrip } = useSovereignSearchContext();
  const { isSubmitting, magicLink, setMagicLink, submitProxyBooking } = useAgentOps(user?.uid || '');

  const [isCancelling, setIsCancelling] = useState(false);
  const [isRestoring, setIsRestoring] = useState(true);
  const [carrierSearch, setCarrierSearch] = useState('');
  const [selectedCarrier, setSelectedCarrier] = useState<{ id: string, name: string } | null>(null);

  // حالة وسيطة للاحتفاظ بـ ID الحجز المعلق بانتظار موافقة الناقل
  const [pendingBookingId, setPendingBookingId] = useState('');

  // [FIX] استرجاع شاشة الانتظار بعد الريفرش: activeIntentId محفوظ على بروفايل
  // الوكيل وقت إنشاء الحجز، فلو الصفحة اتعمل لها reload نرجّع نفس الحالة من Firestore
  // بدل ما تفضل الواجهة فاضية وكإن الطلب اختفى وهو لسه شغال عند الناقل.
  useEffect(() => {
    let isCancelled = false;

    (async () => {
      if (isProfileLoading) return; // لسه بنستنى البروفايل يوصل

      if (!firestore || !profile?.activeIntentId) {
        setIsRestoring(false);
        return;
      }

      try {
        const snap = await getDoc(doc(firestore, 'bookings', profile.activeIntentId));
        if (isCancelled) return;

        if (snap.exists() && snap.data()?.status === 'Pending-Carrier-Confirmation') {
          setPendingBookingId(snap.id);
        }
      } catch (error) {
        console.error('[ProxyBookingForm] restore intent error:', error);
      } finally {
        if (!isCancelled) setIsRestoring(false);
      }
    })();

    return () => { isCancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firestore, profile?.activeIntentId, isProfileLoading]);

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
    const termDigits = carrierSearch.replace(/\D/g, '');
    const phoneMatch = termDigits.length >= 3 && (
      c.phone?.replace(/\D/g, '').includes(termDigits) ||
      c.phoneNumber?.replace(/\D/g, '').includes(termDigits)
    );
    return c.firstName?.toLowerCase().includes(term) ||
      c.officeName?.toLowerCase().includes(term) ||
      phoneMatch;
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

  // مراقبة مستند الحجز بالوقت الفعلي من Firestore
  const pendingBookingRef = useMemoFirebase(() => {
    if (!firestore || !pendingBookingId) return null;
    return doc(firestore, 'bookings', pendingBookingId);
  }, [firestore, pendingBookingId]);
  const { data: pendingBooking } = useDoc<any>(pendingBookingRef);

  // تتبع حالة الحجز: عند موافقة الناقل وتغير الـ status يتم توليد رابط الـ magicLink
  useEffect(() => {
    if (!pendingBooking || !pendingBookingId) return;
    if (pendingBooking.status && pendingBooking.status !== 'Pending-Carrier-Confirmation') {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      setMagicLink(`${baseUrl}/${locale}/ticket/${pendingBookingId}`);
      setPendingBookingId('');
    }
  }, [pendingBooking, pendingBookingId, locale, setMagicLink]);

  const onSubmit = useCallback(async (data: any) => {
    if (hasActiveTrip) return;
    // الوكيل لازم يختار رحلة من الفلتر
    if (!selectedTrip) return;

    // التحقق من اكتمال بيانات المسافرين
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
        title: t('incomplete_data_title'),
        description: t('incomplete_data_desc'),
      });
      return;
    }

    // دمج كود الدولة مع رقم الهاتف
    const passengersWithFullPhone = passengers.map((p: any) => ({
      ...p,
      passengerPhone: `${p.passengerPhoneCode || '+962'}${p.passengerPhone.replace(/^0/, '')}`,
    }));

    // استدعاء الميغاترون مع التقاط الـ bookingId الراجع من تنفيذ العملية
    const bookingId = await submitProxyBooking({
      passengers: passengersWithFullPhone,
      agentFee: Number(data.agentFee),
      targetCarrierId: selectedCarrier?.id || selectedTrip?.carrierId,
      originCountry: sharedRadarData?.originCountry || '',
      originCity: sharedRadarData?.originCity || selectedTrip?.origin || '',
      destCountry: sharedRadarData?.destCountry || '',
      destCity: sharedRadarData?.destCity || selectedTrip?.destination || '',
      departureDate: selectedTrip?.departureDate || sharedRadarData?.travelDate?.toISOString(),
      passengersCount: sharedRadarData?.seats || 1,
      tripId: selectedTrip?.id || null,
      requestType: selectedTrip?.id ? 'Direct' : selectedCarrier?.id ? 'Direct' : 'General'
    }, () => {
      triggerHaptic('success');
    });

    // إذا أرجعت الدالة المعرّفة الـ ID بنجاح، يتم تفعيل شاشة الانتظار الوميضية
    if (bookingId) {
      setPendingBookingId(bookingId);
    }
  }, [submitProxyBooking, hasActiveTrip, sharedRadarData, selectedCarrier, selectedTrip, toast]);

  // [FIX] إلغاء الطلب فعلياً عند الناقل برضو، مش فقط من واجهة الوكيل
  const handleCancelPending = useCallback(async () => {
    if (!pendingBookingId || !functions) {
      setPendingBookingId('');
      form.reset();
      setSelectedCarrier(null);
      return;
    }

    setIsCancelling(true);
    try {
      const cancelFn = httpsCallable(functions, 'cancelBookingSovereign');
      await cancelFn({
        bookingId: pendingBookingId,
        reason: t('cancel_reason'),
        cancelledBy: 'agent',
      });
      toast({ title: t('cancel_success_title'), description: t('cancel_success_desc') });
    } catch (error: any) {
      console.error('🔴 [AgentCancel] ERROR:', error.code, error.message);
      toast({
        variant: 'destructive',
        title: t('cancel_error_title'),
        description: t('cancel_error_desc'),
      });
      return; // ما نرجعش للواجهة السابقة لو الإلغاء فشل فعلياً عند الناقل
    } finally {
      setIsCancelling(false);
    }

    setPendingBookingId('');
    form.reset();
    setSelectedCarrier(null);
  }, [pendingBookingId, functions, form, toast]);

  // أثناء فحص وجود طلب معلّق من قبل (بعد الريفرش) — منعاً لظهور الفورم الفاضي للحظة
  if (isRestoring) return (
    <div className="bg-card border border-[#BEAD77] p-6 rounded-[2.5rem] flex items-center justify-center h-40">
      <Loader2 className="h-8 w-8 text-primary animate-spin" />
    </div>
  );

  // الشاشة الأولى: واجهة الانتظار ومراقبة استجابة الناقل الفورية
  if (pendingBookingId && !magicLink) return (
    <div className="bg-amber-950/20 border-2 border-amber-500/20 p-6 rounded-[2.5rem] text-center space-y-4 animate-in zoom-in shadow-2xl backdrop-blur-xl">
      <div className="bg-amber-500/10 p-3 rounded-full w-fit mx-auto">
        <Loader2 className="h-12 w-12 text-amber-500 animate-spin" />
      </div>
      <h3 className="font-black text-xl text-white">{t('pending_title')}</h3>
      <p className="text-sm text-muted-foreground">{t('pending_desc')}</p>
      <Button onClick={handleCancelPending} disabled={isCancelling}
        variant="outline" className="w-full h-12 rounded-2xl border-amber-500/30 text-amber-400">
        {isCancelling ? <Loader2 className="h-4 w-4 animate-spin" /> : t('cancel_pending')}
      </Button>
    </div>
  );

  // الشاشة الثانية: شاشة توليد وانبثاق الرابط السحري السنق (Magic Link) بعد تخطي حاجز القبول
  if (magicLink) return (
    <div className="bg-emerald-950/20 border-2 border-emerald-500/20 p-6 rounded-[2.5rem] text-center space-y-4 animate-in zoom-in shadow-2xl backdrop-blur-xl">
      <div className="bg-emerald-500/10 p-3 rounded-full w-fit mx-auto"><CheckCircle2 className="h-12 w-12 text-emerald-500" /></div>
      <h3 className="font-black text-xl text-white">{t('magic_link_title')}</h3>
      <div className="flex items-center gap-2 bg-black/40 p-2 rounded-2xl border border-white/10 shadow-inner">
        <Input value={magicLink} dir="ltr" readOnly className="border-0 bg-transparent text-xs font-mono font-bold text-emerald-400" />
        <Button onClick={() => { navigator.clipboard.writeText(magicLink); toast({ title: t('copy_success') }); }} size="icon" variant="secondary" className="rounded - xl bg- primary / 10 text - primary"><Share2 className="h - 4 w - 4" /></Button>
      </div>
      <Button onClick={() => { setMagicLink(''); form.reset(); setSelectedCarrier(null); }} className="w-full h-14 rounded-2xl bg-primary text-black font-black"> {t('new_booking')}</Button>
    </div>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-card border border-[#BEAD77] p-6 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        {sharedRadarData?.originCity && sharedRadarData?.destCity ? (
          <div className="space-y-2">
            <div className="bg-primary/5 mb-5 border border-primary/20 p-4 rounded-3xl flex items-center justify-between shadow-inner">
              <div className="flex flex-col items-center"><PlaneTakeoff className="h-4 w-4 text-primary mb-1" /><span className="text-sm font-black">{getCityName(sharedRadarData.originCity, locale)}</span></div>
              <div className="flex-1 px-4">
                <div className="w-full h-px bg-primary/20 relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-sm font-black text-primary">
                    {t('seats_label', { count: sharedRadarData.seats })}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center"><PlaneLanding className="h-4 w-4 text-primary mb-1" /><span className="text-sm font-black">{getCityName(sharedRadarData.destCity, locale)}</span></div>
            </div>
            {selectedTrip &&
              <div className="bg-[#17070B] flex flex-col gap-2 p-3 rounded-[2rem] border border-[#BEAD77]">
                {selectedTrip && (
                  <div className=" p-3 rounded-2xl flex items-center justify-between animate-in slide-in-from-top-2">
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-mono text-sm">{selectedTrip.price} {selectedTrip.currency}</Badge>

                    <div className="text-right">
                      <p className="text-sm font-black text-emerald-500">{t('selected_trip_badge')}</p>
                      <p className="text-xs font-black">{selectedTrip.carrierName}</p>
                      <p className="text-xs text-muted-foreground">
                        {selectedTrip.departureDate
                          ? new Date(selectedTrip.departureDate)
                            .toLocaleDateString('EG')
                          : ''}
                      </p>
                    </div>
                  </div>
                )}
                {selectedTrip?.conditions && (
                  <div className="bg-yellow-950/40 border border-[#AE9E6D] rounded-2xl px-3 py-2.5 space-y-1 flex justify-between animate-in slide-in-from-top-2">
                    <p className="text-yellow-200 text-xs font-semibold whitespace-pre-wrap leading-relaxed">
                      {selectedTrip.conditions}
                    </p>
                    <span className="flex items-center gap-1.5 text-yellow-400 text-xs font-black">
                      {t('carrier_conditions')}
                    </span>

                  </div>
                )}
                {selectedTrip?.excessWeightFee != null && selectedTrip.excessWeightFee > 0 && (
                  <div className="flex justify-between items-center bg-orange-950/40 border border-[#AE9E6D] rounded-2xl px-3 py-2.5 animate-in slide-in-from-top-2">
                    <span className="text-orange-300 font-mono text-xs font-bold">
                      {/* {selectedTrip.excessWeightFee} {selectedTrip.currency || 'د.أ'} / كغ */}
                      {t('excess_weight_unit', { fee: selectedTrip.excessWeightFee, currency: selectedTrip.currency })}
                    </span>
                    <span className="flex items-center gap-1.5 text-orange-400 text-xs font-bold">
                      {t('excess_weight_fee')}
                    </span>

                  </div>
                )}
              </div>
            }
          </div>
        ) : (
          <div className="bg-muted/20 border border-dashed border-[#BEAD77] p-4 rounded-3xl text-center text-sm font-bold text-muted-foreground">{t('select_route_first')}</div>
        )}
        <div className="space-y-6">
          {fields.map((field, index) => (
            <div key={field.id} className="space-y-4 p-4 bg-muted/10 rounded-[2rem] border border-[#BEAD77] relative">
              <div className="flex items-center gap-2 border-b border-[#BEAD77] pb-2 mb-2">
                <Badge className="bg-primary text-black h-5 w-5 rounded-full font-black flex justify-center items-center">
                  {index + 1}
                </Badge>
                <span className="text-sm font-black text-primary uppercase">
                  {t('passenger_label')} {index === 0 ? t('passenger_primary') : ''}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name={`passengers.${index}.passengerName`} render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder={t('name_placeholder')}
                        {...field}
                        dir={inputDir}
                        className="h-11 rounded-xl bg-background me-auto border-[#BEAD77] text-xs font-bold "
                      />
                    </FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name={`passengers.${index}.passengerPhone`} render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className={cn("flex h-11 rounded-xl bg-background border border-[#BEAD77] overflow-hidden", index === 0 && hasActiveTrip && "border-destructive bg-destructive/5")}>
                        <FormField control={form.control} name={`passengers.${index}.passengerPhoneCode`} render={({ field: codeField }) => (
                          <Select value={codeField.value || '+962'} onValueChange={codeField.onChange}>
                            <SelectTrigger className="w-24 h-full border-0 border-l border-[#BEAD77] rounded-none bg-primary/5 text-xs font-mono focus:ring-0 px-2">
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
                        <Input placeholder="7XXXXXXXX" {...field} dir='ltr' className="h-full border-0 rounded-none bg-transparent font-mono text-xs flex-1 focus-visible:ring-0" />
                      </div>
                    </FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name={`passengers.${index}.nationality`} render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder={t('nationality_placeholder')}
                        {...field}
                        className="h-11 rounded-xl bg-background border-[#BEAD77] text-xs font-bold "
                        dir={inputDir}
                      />
                    </FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name={`passengers.${index}.documentId`} render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder={t('document_placeholder')}
                        {...field}
                        dir={inputDir}
                        className="h-11 rounded-xl bg-background border-[#BEAD77] font-mono text-xs" />
                    </FormControl>
                  </FormItem>
                )} />
              </div>
            </div>
          ))}
        </div>

        <FormField control={form.control} name="agentFee" render={({ field }) => (
          <FormItem className="mt-4"><FormLabel className="text-sm font-black text-primary uppercase tracking-[0.2em] flex items-center justify-center gap-2 mb-2">
            {t('agent_fee_label')}
            <Zap className="h-4 w-4" />
          </FormLabel><FormControl><Input type="number" {...field} className="h-16 rounded-[1.5rem] bg-primary/5 border-[#BEAD77] text-3xl font-black text-center text-primary" /></FormControl></FormItem>
        )} />

        <Button type="submit" className={cn("w-full font-black h-16 rounded-3xl text-xl shadow-2xl transition-all gap-3",
          (hasActiveTrip || !selectedTrip) ? "bg-muted cursor-not-allowed" :
            selectedTrip ? "bg-[#BEAD77] hover:bg-[#bead77d5] text-black" :
              "bg-primary text-black hover:bg-primary/90"
        )} disabled={isSubmitting || hasActiveTrip || !selectedTrip}>
          {isSubmitting ? <Loader2 className="animate-spin h-6 w-6" /> : selectedTrip && (
            <>
              {t('submit_button')}
              <Zap className="h-6 w-6" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}