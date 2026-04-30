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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useUser } from '@/firebase';
import { useUserProfile } from '@/hooks/use-user-profile';
import { collection, serverTimestamp, doc, updateDoc, addDoc, getDoc } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';
import {
  Loader2,
  Send,
  Clock,
  PlaneTakeoff,
  PlaneLanding,
  Settings,
  MapPin,
  Calendar as CalendarIcon,
  Lock,
  Facebook,
  Instagram,
  Video,
  Info,
  ShieldCheck,
} from 'lucide-react';
import { format } from 'date-fns';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { getCityName } from '@/lib/constants';
import { combineDateAndTime } from '@/lib/formatters';
import { useLocale, useTranslations } from 'next-intl';
import { useActiveMarkets } from '@/hooks/use-active-markets';
import { useRouter } from '@/i18n/routing';
import { useCarrierStatus } from '@/hooks/use-carrier-status';

const addTripSchema = z.object({
  origin: z.string().min(1, 'مدينة الانطلاق مطلوبة'),
  destination: z.string().min(1, 'مدينة الوصول مطلوبة'),
  departureDate: z.date({ required_error: 'تاريخ المغادرة مطلوب' }),
  departureTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'الرجاء إدخل وقت صالح (صيغة 24 ساعة HH:MM)',
  }),
  meetingPoint: z.string().min(3, 'نقطة التجمع مطلوبة'),
  meetingPointLink: z.string().url('الرجاء إدخال رابط خرائط جوجل صالح').min(1, 'رابط الموقع على الخريطة مطلوب'),
  availableSeats: z.coerce.number().int().min(1, 'يجب توفر مقعد واحد على الأقل'),
  estimatedDurationHours: z.coerce.number().int().min(1, 'مدة الرحلة التقديرية إجبارية'),
  conditions: z.string().max(200, 'الشروط يجب ألا تتجاوز 200 حرف').optional(),
  facebookProfile: z.string().url('رابط فيسبوك غير صالح').optional().or(z.literal('')),
  instagramProfile: z.string().url('رابط إنستغرام غير صالح').optional().or(z.literal('')),
  tiktokProfile: z.string().url('رابط تيك توك غير صالح').optional().or(z.literal('')),
});

type AddTripFormValues = z.infer<typeof addTripSchema>;

interface AddTripDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function AddTripDialog({ isOpen, onOpenChange }: AddTripDialogProps) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();
  const { profile } = useUserProfile();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const locale = useLocale();
  const { activeMarkets, isLoading: isLoadingMarkets } = useActiveMarkets();
  const { isExpired } = useCarrierStatus(profile?.expiryDate);
  const t = useTranslations('addTripDialog');
  const [originCountry, setOriginCountry] = useState('');
  const [destinationCountry, setDestinationCountry] = useState('');

  const form = useForm<AddTripFormValues>({
    resolver: zodResolver(addTripSchema),
    defaultValues: {
      origin: '',
      destination: '',
      departureTime: '',
      meetingPoint: '',
      meetingPointLink: '',
      availableSeats: 4,
      estimatedDurationHours: 3,
      conditions: '',
      facebookProfile: '',
      instagramProfile: '',
      tiktokProfile: '',
    },
  });

  useEffect(() => {
    if (isOpen && profile) {
      if (profile.jurisdiction?.origin) setOriginCountry(profile.jurisdiction.origin);
      if (profile.jurisdiction?.destination) setDestinationCountry(profile.jurisdiction.destination);

      form.reset({
        origin: '',
        destination: '',
        estimatedDurationHours: 3,
        departureTime: '',
        meetingPoint: '',
        meetingPointLink: '',
        availableSeats: profile.vehicleCapacity || 4,
        conditions: profile.conditions || '',
        facebookProfile: (profile as any).facebookProfile || '',
        instagramProfile: (profile as any).instagramProfile || '',
        tiktokProfile: (profile as any).tiktokProfile || '',
      });
    }
  }, [isOpen, profile, form]);

  const originCities = useMemo(() => {
    if (!originCountry) return [];
    return activeMarkets.find((m) => m.id === originCountry)?.cities || [];
  }, [activeMarkets, originCountry]);

  const destinationCities = useMemo(() => {
    if (!destinationCountry) return [];
    return activeMarkets.find((m) => m.id === destinationCountry)?.cities || [];
  }, [activeMarkets, destinationCountry]);

  const handleOriginCountryChange = useCallback(
    (val: string) => {
      setOriginCountry(val);
      form.setValue('origin', '');
    },
    [form]
  );

  const handleDestCountryChange = useCallback(
    (val: string) => {
      setDestinationCountry(val);
      form.setValue('destination', '');
    },
    [form]
  );

  const onSubmit = async (data: AddTripFormValues) => {
    if (!firestore || !user || !profile) return;

    if (profile.isPartial || !profile.vehicleType || !profile.vehicleCapacity) {
      toast({
        variant: 'destructive',
        title: t('errorProfile'),
        description: 'يجب إكمال بيانات المركبة في ملفك الشخصي أولاً.'
      });
      onOpenChange(false);
      router.push('/carrier/profile');
      return;
    }

    if (profile.currentActiveTripId) {
      try {
        const activeTripRef = doc(firestore, 'trips', profile.currentActiveTripId);
        const activeTripSnap = await getDoc(activeTripRef);

        if (activeTripSnap.exists()) {
          const activeTrip = activeTripSnap.data() as any;

          const depDate = activeTrip.departureDate?.toDate?.()
            ? activeTrip.departureDate.toDate()
            : new Date(activeTrip.departureDate || 0);

          const durationHours = activeTrip.estimatedDurationHours || 0;
          const endDate = new Date(depDate.getTime() + durationHours * 60 * 60 * 1000);
          const hasEnded = endDate < new Date();

          if (hasEnded || activeTrip.status === 'Completed' || activeTrip.status === 'Cancelled') {
            await updateDoc(doc(firestore, 'users', user.uid), {
              currentActiveTripId: null,
              updatedAt: serverTimestamp(),
            });
          } else {
            toast({
              variant: 'destructive',
              title: 'عندك رحلة نشطة بالفعل ⚠️',
              description: 'يجب إنهاء رحلتك الحالية قبل إنشاء رحلة جديدة.'
            });
            return;
          }
        } else {
          await updateDoc(doc(firestore, 'users', user.uid), {
            currentActiveTripId: null,
            updatedAt: serverTimestamp(),
          });
        }
      } catch (e) {
        toast({
          variant: 'destructive',
          title: 'تعذر التحقق من الرحلة الحالية',
          description: 'حاول مرة أخرى.'
        });
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const combinedDepartureDateTime = combineDateAndTime(data.departureDate, data.departureTime);

      const tripData = {
        ...data,
        departureDate: combinedDepartureDateTime.toISOString(),
        userId: user.uid,
        carrierId: user.uid,
        carrierName: profile.firstName,
        vehicleType: profile.vehicleType || 'غير محدد',
        vehiclePlateNumber: profile?.plateNumber || '',
        vehicleCapacity: profile?.vehicleCapacity || 0,
        numberOfStops: profile.numberOfStops ?? 0,
        bagsPerSeat: profile.bagsPerSeat ?? 1,
        vehicleCategory: profile.vehicleCapacity && profile.vehicleCapacity > 7 ? 'bus' : 'small',
        status: 'Planned' as const,
        price: Number(profile.price) || 0,
        currency: profile.currency || 'د.أ',
        depositPercentage: profile.depositPercentage ?? 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      delete (tripData as any).departureTime;

      const newTripRef = await addDoc(collection(firestore, 'trips'), tripData);

      const userUpdates: any = {
        currentActiveTripId: newTripRef.id,
        updatedAt: serverTimestamp(),
      };

      if (data.facebookProfile) userUpdates.facebookProfile = data.facebookProfile;
      if (data.instagramProfile) userUpdates.instagramProfile = data.instagramProfile;
      if (data.tiktokProfile) userUpdates.tiktokProfile = data.tiktokProfile;

      await updateDoc(doc(firestore, 'users', user.uid), userUpdates);

      toast({ title: 'تمت إضافة الرحلة بنجاح! ✅' });
      onOpenChange(false);
      form.reset();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'فشل الإضافة',
        description: error?.message || 'حدث خطأ في النواة السحابية.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle> {t('title')}</DialogTitle>
          <DialogDescription>
            {t('desc')}
          </DialogDescription>
        </DialogHeader>

        {isExpired ? (
          <div className="p-10 flex flex-col items-center text-center space-y-6 animate-in fade-in zoom-in duration-500 bg-destructive/5 rounded-[2.5rem] border-2 border-destructive/20 my-4">
            <div className="w-20 h-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center shadow-inner">
              <Lock className="w-10 h-10 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-foreground tracking-tight uppercase">
                انتهت صلاحية التصريح
              </h3>
              <p className="text-sm text-muted-foreground font-bold leading-relaxed max-w-sm mx-auto">
                عذراً كابتن، لا يمكنك إضافة رحلات جديدة أو الظهور في سوق الفرص حالياً. يرجى تجديد
                اشتراكك الماسي لاستعادة سيادتك الميدانية.
              </p>
            </div>

            <Button
              className="w-full h-14 rounded-2xl bg-primary text-black font-black text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
              onClick={() => router.push('/carrier/Permanent')}
            >
              تجديد الاشتراك الآن
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card className="bg-muted/30 border-accent/20">
                <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 font-bold text-accent">
                      <PlaneTakeoff className="h-4 w-4" /> {t('from')}
                    </Label>

                    <Select
                      onValueChange={handleOriginCountryChange}
                      value={originCountry}
                      disabled={isLoadingMarkets}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder={t('originCountry')} />
                      </SelectTrigger>
                      <SelectContent>
                        {activeMarkets.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            {m.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormField
                      control={form.control}
                      name="origin"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              disabled={!originCountry}
                            >
                              <SelectTrigger className="bg-background">
                                <SelectValue placeholder={t('originCity')} />
                              </SelectTrigger>
                              <SelectContent>
                                {originCities.map((cityKey) => (
                                  <SelectItem key={cityKey} value={cityKey}>
                                    {getCityName(cityKey, locale)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 font-bold text-accent">
                      <PlaneLanding className="h-4 w-4" />{t('to')}
                    </Label>

                    <Select
                      onValueChange={handleDestCountryChange}
                      value={destinationCountry}
                      disabled={isLoadingMarkets}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder={t('destinationCountry')} />
                      </SelectTrigger>
                      <SelectContent>
                        {activeMarkets
                          .filter((m) => m.id !== originCountry)
                          .map((m) => (
                            <SelectItem key={m.id} value={m.id}>
                              {m.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>

                    <FormField
                      control={form.control}
                      name="destination"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              disabled={!destinationCountry}
                            >
                              <SelectTrigger className="bg-background">
                                <SelectValue placeholder={t('destinationCity')} />
                              </SelectTrigger>
                              <SelectContent>
                                {destinationCities.map((cityKey) => (
                                  <SelectItem key={cityKey} value={cityKey}>
                                    {getCityName(cityKey, locale)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Accordion type="single" collapsible className="w-full" defaultValue="social">
                <AccordionItem value="social" className="border rounded-lg bg-primary/5 border-primary/20">
                  <AccordionTrigger className="p-4 font-black text-sm hover:no-underline text-primary">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4" />
                      {t('social')}
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="p-4 pt-0 space-y-4">
                    <div className="bg-background/50 p-3 rounded-xl border border-dashed border-primary/20 flex gap-2 items-start mb-4">
                      <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <p className="text-[10px] leading-relaxed text-muted-foreground">
                        {t('socialInfo')}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="facebookProfile"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1 text-[10px] font-black">
                              <Facebook className="h-3 w-3 text-blue-600" /> {t('facebook')}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://facebook.com/..."
                                className="bg-card text-[10px] ltr"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="instagramProfile"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1 text-[10px] font-black">
                              <Instagram className="h-3 w-3 text-pink-600" /> {t('instagram')}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://instagram.com/..."
                                className="bg-card text-[10px] ltr"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="tiktokProfile"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1 text-[10px] font-black">
                              <Video className="h-3 w-3 text-foreground" /> {t('tiktok')}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://tiktok.com/@..."
                                className="bg-card text-[10px] ltr"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="details" className="border rounded-lg bg-muted/30 mt-4">
                  <AccordionTrigger className="p-4 font-semibold text-sm hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      {t('details')}
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="p-4 pt-0 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="departureDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>{t('departureDate')}</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type="date"
                                  className="bg-card block w-full pl-10"
                                  {...field}
                                  value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
                                  onChange={(e) =>
                                    field.onChange(e.target.value ? new Date(e.target.value) : undefined)
                                  }
                                  min={new Date().toISOString().split('T')[0]}
                                />
                                <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="departureTime"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>{t('departureTime')}</FormLabel>
                            <FormControl>
                              <Input type="time" className="bg-card" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="availableSeats"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('availableSeats')}</FormLabel>
                            <FormControl>
                              <Input className="bg-card" type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="estimatedDurationHours"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-primary font-bold" />
                              {t('duration')}
                            </FormLabel>
                            <FormControl>
                              <Input className="bg-card border-primary/50" type="number" {...field} />
                            </FormControl>
                            <p className="text-[10px] text-muted-foreground">
                              {t('ticketTravel')}
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="meetingPoint"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {t('meetingPoint')}
                          </FormLabel>
                          <FormControl>
                            <Input className="bg-card" placeholder={t('meetingPointPlaceholder')} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="meetingPointLink"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            رابط الموقع على الخريطة
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="bg-card ltr text-sm"
                              placeholder="https://maps.google.com/..."
                              {...field}
                            />
                          </FormControl>
                          <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            سيظهر هذا الرابط للمسافر في تذكرته ليتمكن من الوصول لنقطة الانطلاق بسهولة
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <DialogFooter className="gap-2 sm:gap-0 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  {t('cancel')}
                </Button>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="font-black text-sm rounded-2xl shadow-md"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                      {t('submitting')}
                    </>
                  ) : (
                    <>
                      <Send className="ml-2 h-5 w-5" />
                      {t('submit')}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}