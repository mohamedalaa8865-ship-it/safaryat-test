// // // // // // // // 'use client';

// // // // // // // // import { useState, useMemo, useEffect, useCallback } from 'react';
// // // // // // // // import { useForm } from 'react-hook-form';
// // // // // // // // import { zodResolver } from '@hookform/resolvers/zod';
// // // // // // // // import { z } from 'zod';
// // // // // // // // import {
// // // // // // // //   Dialog,
// // // // // // // //   DialogContent,
// // // // // // // //   DialogHeader,
// // // // // // // //   DialogTitle,
// // // // // // // //   DialogDescription,
// // // // // // // //   DialogFooter,
// // // // // // // // } from '@/components/ui/dialog';
// // // // // // // // import {
// // // // // // // //   Form,
// // // // // // // //   FormControl,
// // // // // // // //   FormField,
// // // // // // // //   FormItem,
// // // // // // // //   FormLabel,
// // // // // // // //   FormMessage,
// // // // // // // // } from '@/components/ui/form';
// // // // // // // // import { Button } from '@/components/ui/button';
// // // // // // // // import { Input } from '@/components/ui/input';
// // // // // // // // import {
// // // // // // // //   Select,
// // // // // // // //   SelectContent,
// // // // // // // //   SelectItem,
// // // // // // // //   SelectTrigger,
// // // // // // // //   SelectValue,
// // // // // // // // } from '@/components/ui/select';
// // // // // // // // import { Card, CardContent } from '@/components/ui/card';
// // // // // // // // import { useToast } from '@/hooks/use-toast';
// // // // // // // // import { useFirestore, useUser } from '@/firebase';
// // // // // // // // import { useUserProfile } from '@/hooks/use-user-profile';
// // // // // // // // import { collection, serverTimestamp, doc, updateDoc, addDoc, getDoc } from 'firebase/firestore';
// // // // // // // // import { FirebaseError } from 'firebase/app';
// // // // // // // // import {
// // // // // // // //   Loader2,
// // // // // // // //   Send,
// // // // // // // //   Clock,
// // // // // // // //   PlaneTakeoff,
// // // // // // // //   PlaneLanding,
// // // // // // // //   Settings,
// // // // // // // //   MapPin,
// // // // // // // //   Calendar as CalendarIcon,
// // // // // // // //   Lock,
// // // // // // // //   Facebook,
// // // // // // // //   Instagram,
// // // // // // // //   Video,
// // // // // // // //   Info,
// // // // // // // //   ShieldCheck,
// // // // // // // // } from 'lucide-react';
// // // // // // // // import { format } from 'date-fns';
// // // // // // // // import { Label } from '@/components/ui/label';
// // // // // // // // import {
// // // // // // // //   Accordion,
// // // // // // // //   AccordionContent,
// // // // // // // //   AccordionItem,
// // // // // // // //   AccordionTrigger,
// // // // // // // // } from '@/components/ui/accordion';
// // // // // // // // import { getCityName } from '@/lib/constants';
// // // // // // // // import { combineDateAndTime } from '@/lib/formatters';
// // // // // // // // import { useLocale, useTranslations } from 'next-intl';
// // // // // // // // import { useActiveMarkets } from '@/hooks/use-active-markets';
// // // // // // // // import { useRouter } from '@/i18n/routing';
// // // // // // // // import { useCarrierStatus } from '@/hooks/use-carrier-status';

// // // // // // // // const addTripSchema = z.object({
// // // // // // // //   origin: z.string().min(1, 'مدينة الانطلاق مطلوبة'),
// // // // // // // //   destination: z.string().min(1, 'مدينة الوصول مطلوبة'),
// // // // // // // //   departureDate: z.date({ required_error: 'تاريخ المغادرة مطلوب' }),
// // // // // // // //   departureTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
// // // // // // // //     message: 'الرجاء إدخل وقت صالح (صيغة 24 ساعة HH:MM)',
// // // // // // // //   }),
// // // // // // // //   meetingPoint: z.string().min(3, 'نقطة التجمع مطلوبة'),
// // // // // // // //   meetingPointLink: z.string().url('الرجاء إدخال رابط خرائط جوجل صالح').min(1, 'رابط الموقع على الخريطة مطلوب'),
// // // // // // // //   availableSeats: z.coerce.number().int().min(1, 'يجب توفر مقعد واحد على الأقل'),
// // // // // // // //   estimatedDurationHours: z.coerce.number().int().min(1, 'مدة الرحلة التقديرية إجبارية'),
// // // // // // // //   conditions: z.string().max(200, 'الشروط يجب ألا تتجاوز 200 حرف').optional(),
// // // // // // // //   facebookProfile: z.string().url('رابط فيسبوك غير صالح').optional().or(z.literal('')),
// // // // // // // //   instagramProfile: z.string().url('رابط إنستغرام غير صالح').optional().or(z.literal('')),
// // // // // // // //   tiktokProfile: z.string().url('رابط تيك توك غير صالح').optional().or(z.literal('')),
// // // // // // // // });

// // // // // // // // type AddTripFormValues = z.infer<typeof addTripSchema>;

// // // // // // // // interface AddTripDialogProps {
// // // // // // // //   isOpen: boolean;
// // // // // // // //   onOpenChange: (isOpen: boolean) => void;
// // // // // // // // }

// // // // // // // // export function AddTripDialog({ isOpen, onOpenChange }: AddTripDialogProps) {
// // // // // // // //   const { toast } = useToast();
// // // // // // // //   const firestore = useFirestore();
// // // // // // // //   const { user } = useUser();
// // // // // // // //   const { profile } = useUserProfile();
// // // // // // // //   const router = useRouter();
// // // // // // // //   const [isSubmitting, setIsSubmitting] = useState(false);
// // // // // // // //   const locale = useLocale();
// // // // // // // //   const { activeMarkets, isLoading: isLoadingMarkets } = useActiveMarkets();
// // // // // // // //   const { isExpired } = useCarrierStatus(profile?.expiryDate);
// // // // // // // //   const t = useTranslations('addTripDialog');
// // // // // // // //   const [originCountry, setOriginCountry] = useState('');
// // // // // // // //   const [destinationCountry, setDestinationCountry] = useState('');

// // // // // // // //   const form = useForm<AddTripFormValues>({
// // // // // // // //     resolver: zodResolver(addTripSchema),
// // // // // // // //     defaultValues: {
// // // // // // // //       origin: '',
// // // // // // // //       destination: '',
// // // // // // // //       departureTime: '',
// // // // // // // //       meetingPoint: '',
// // // // // // // //       meetingPointLink: '',
// // // // // // // //       availableSeats: 4,
// // // // // // // //       estimatedDurationHours: 3,
// // // // // // // //       conditions: '',
// // // // // // // //       facebookProfile: '',
// // // // // // // //       instagramProfile: '',
// // // // // // // //       tiktokProfile: '',
// // // // // // // //     },
// // // // // // // //   });

// // // // // // // //   useEffect(() => {
// // // // // // // //     if (isOpen && profile) {
// // // // // // // //       if (profile.jurisdiction?.origin) setOriginCountry(profile.jurisdiction.origin);
// // // // // // // //       if (profile.jurisdiction?.destination) setDestinationCountry(profile.jurisdiction.destination);

// // // // // // // //       form.reset({
// // // // // // // //         origin: '',
// // // // // // // //         destination: '',
// // // // // // // //         estimatedDurationHours: 3,
// // // // // // // //         departureTime: '',
// // // // // // // //         meetingPoint: '',
// // // // // // // //         meetingPointLink: '',
// // // // // // // //         availableSeats: profile.vehicleCapacity || 4,
// // // // // // // //         conditions: profile.conditions || '',
// // // // // // // //         facebookProfile: (profile as any).facebookProfile || '',
// // // // // // // //         instagramProfile: (profile as any).instagramProfile || '',
// // // // // // // //         tiktokProfile: (profile as any).tiktokProfile || '',
// // // // // // // //       });
// // // // // // // //     }
// // // // // // // //   }, [isOpen, profile, form]);

// // // // // // // //   const originCities = useMemo(() => {
// // // // // // // //     if (!originCountry) return [];
// // // // // // // //     return activeMarkets.find((m) => m.id === originCountry)?.cities || [];
// // // // // // // //   }, [activeMarkets, originCountry]);

// // // // // // // //   const destinationCities = useMemo(() => {
// // // // // // // //     if (!destinationCountry) return [];
// // // // // // // //     return activeMarkets.find((m) => m.id === destinationCountry)?.cities || [];
// // // // // // // //   }, [activeMarkets, destinationCountry]);

// // // // // // // //   const handleOriginCountryChange = useCallback(
// // // // // // // //     (val: string) => {
// // // // // // // //       setOriginCountry(val);
// // // // // // // //       form.setValue('origin', '');
// // // // // // // //     },
// // // // // // // //     [form]
// // // // // // // //   );

// // // // // // // //   const handleDestCountryChange = useCallback(
// // // // // // // //     (val: string) => {
// // // // // // // //       setDestinationCountry(val);
// // // // // // // //       form.setValue('destination', '');
// // // // // // // //     },
// // // // // // // //     [form]
// // // // // // // //   );

// // // // // // // //   const onSubmit = async (data: AddTripFormValues) => {
// // // // // // // //     if (!firestore || !user || !profile) return;

// // // // // // // //     if (profile.isPartial || !profile.vehicleType || !profile.vehicleCapacity) {
// // // // // // // //       toast({
// // // // // // // //         variant: 'destructive',
// // // // // // // //         title: t('errorProfile'),
// // // // // // // //         description: t('errorProfileDesc')
// // // // // // // //       });
// // // // // // // //       onOpenChange(false);
// // // // // // // //       router.push('/carrier/profile');
// // // // // // // //       return;
// // // // // // // //     }

// // // // // // // //     if (profile.currentActiveTripId) {
// // // // // // // //       try {
// // // // // // // //         const activeTripRef = doc(firestore, 'trips', profile.currentActiveTripId);
// // // // // // // //         const activeTripSnap = await getDoc(activeTripRef);

// // // // // // // //         if (activeTripSnap.exists()) {
// // // // // // // //           const activeTrip = activeTripSnap.data() as any;

// // // // // // // //           const depDate = activeTrip.departureDate?.toDate?.()
// // // // // // // //             ? activeTrip.departureDate.toDate()
// // // // // // // //             : new Date(activeTrip.departureDate || 0);

// // // // // // // //           const durationHours = activeTrip.estimatedDurationHours || 0;
// // // // // // // //           const endDate = new Date(depDate.getTime() + durationHours * 60 * 60 * 1000);
// // // // // // // //           const hasEnded = endDate < new Date();

// // // // // // // //           if (hasEnded || activeTrip.status === 'Completed' || activeTrip.status === 'Cancelled') {
// // // // // // // //             await updateDoc(doc(firestore, 'users', user.uid), {
// // // // // // // //               currentActiveTripId: null,
// // // // // // // //               updatedAt: serverTimestamp(),
// // // // // // // //             });
// // // // // // // //           } else {
// // // // // // // //             toast({
// // // // // // // //               variant: 'destructive',
// // // // // // // //               title: t('errorActiveTrip'),
// // // // // // // //               description: t('errorActiveTripDesc')
// // // // // // // //             });
// // // // // // // //             return;
// // // // // // // //           }
// // // // // // // //         } else {
// // // // // // // //           await updateDoc(doc(firestore, 'users', user.uid), {
// // // // // // // //             currentActiveTripId: null,
// // // // // // // //             updatedAt: serverTimestamp(),
// // // // // // // //           });
// // // // // // // //         }
// // // // // // // //       } catch (e) {
// // // // // // // //         toast({
// // // // // // // //           variant: 'destructive',
// // // // // // // //           title: t('errorVerify'),
// // // // // // // //           description: t('errorVerifyDesc')
// // // // // // // //         });
// // // // // // // //         return;
// // // // // // // //       }
// // // // // // // //     }

// // // // // // // //     setIsSubmitting(true);

// // // // // // // //     try {
// // // // // // // //       const combinedDepartureDateTime = combineDateAndTime(data.departureDate, data.departureTime);

// // // // // // // //       const tripData = {
// // // // // // // //         ...data,
// // // // // // // //         departureDate: combinedDepartureDateTime.toISOString(),
// // // // // // // //         userId: user.uid,
// // // // // // // //         carrierId: user.uid,
// // // // // // // //         carrierName: profile.firstName,
// // // // // // // //         vehicleType: profile.vehicleType || 'غير محدد',
// // // // // // // //         vehiclePlateNumber: profile?.plateNumber || '',
// // // // // // // //         vehicleCapacity: profile?.vehicleCapacity || 0,
// // // // // // // //         numberOfStops: profile.numberOfStops ?? 0,
// // // // // // // //         bagsPerSeat: profile.bagsPerSeat ?? 1,
// // // // // // // //         vehicleCategory: profile.vehicleCapacity && profile.vehicleCapacity > 7 ? 'bus' : 'small',
// // // // // // // //         status: 'Planned' as const,
// // // // // // // //         price: Number(profile.price) || 0,
// // // // // // // //         currency: profile.currency || 'د.أ',
// // // // // // // //         depositPercentage: profile.depositPercentage ?? 0,
// // // // // // // //         createdAt: serverTimestamp(),
// // // // // // // //         updatedAt: serverTimestamp(),
// // // // // // // //       };

// // // // // // // //       delete (tripData as any).departureTime;

// // // // // // // //       const newTripRef = await addDoc(collection(firestore, 'trips'), tripData);

// // // // // // // //       const userUpdates: any = {
// // // // // // // //         currentActiveTripId: newTripRef.id,
// // // // // // // //         updatedAt: serverTimestamp(),
// // // // // // // //       };

// // // // // // // //       if (data.facebookProfile) userUpdates.facebookProfile = data.facebookProfile;
// // // // // // // //       if (data.instagramProfile) userUpdates.instagramProfile = data.instagramProfile;
// // // // // // // //       if (data.tiktokProfile) userUpdates.tiktokProfile = data.tiktokProfile;

// // // // // // // //       await updateDoc(doc(firestore, 'users', user.uid), userUpdates);

// // // // // // // //       toast({ title: t('successAdd') + ' ✅' });
// // // // // // // //       onOpenChange(false);
// // // // // // // //       form.reset();
// // // // // // // //     } catch (error: any) {
// // // // // // // //       toast({
// // // // // // // //         variant: 'destructive',
// // // // // // // //         title: t('errorAdd'),
// // // // // // // //         description: error?.message || t('errorAddDesc')
// // // // // // // //       });
// // // // // // // //     } finally {
// // // // // // // //       setIsSubmitting(false);
// // // // // // // //     }
// // // // // // // //   };
// // // // // // // //   return (
// // // // // // // //     <Dialog open={isOpen} onOpenChange={onOpenChange}>
// // // // // // // //       <DialogContent className="sm:max-w-3xl">
// // // // // // // //         <DialogHeader>
// // // // // // // //           <DialogTitle> {t('title')}</DialogTitle>
// // // // // // // //           <DialogDescription>
// // // // // // // //             {t('desc')}
// // // // // // // //           </DialogDescription>
// // // // // // // //         </DialogHeader>

// // // // // // // //         {isExpired ? (
// // // // // // // //           <div className="p-10 flex flex-col items-center text-center space-y-6 animate-in fade-in zoom-in duration-500 bg-destructive/5 rounded-[2.5rem] border-2 border-destructive/20 my-4">
// // // // // // // //             <div className="w-20 h-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center shadow-inner">
// // // // // // // //               <Lock className="w-10 h-10 animate-pulse" />
// // // // // // // //             </div>

// // // // // // // //             <div className="space-y-2">
// // // // // // // //               <h3 className="text-2xl font-black text-foreground tracking-tight uppercase">
// // // // // // // //                 {t('expiredTitle')}
// // // // // // // //               </h3>
// // // // // // // //               <p className="text-sm text-muted-foreground font-bold leading-relaxed max-w-sm mx-auto  ">
// // // // // // // //                 {t('expiredDesc')}
// // // // // // // //               </p>
// // // // // // // //             </div>

// // // // // // // //             <Button
// // // // // // // //               className="w-full h-14 rounded-2xl bg-primary text-black font-black text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
// // // // // // // //               onClick={() => router.push('/carrier/Permanent')}
// // // // // // // //             >
// // // // // // // //               {t('expiredBtn')}
// // // // // // // //             </Button>
// // // // // // // //           </div>
// // // // // // // //         ) : (
// // // // // // // //           <Form {...form}>
// // // // // // // //             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
// // // // // // // //               <Card className="bg-muted/30 border-accent/20">
// // // // // // // //                 <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
// // // // // // // //                   <div className="space-y-2">
// // // // // // // //                     <Label className="flex items-center gap-2 font-bold text-accent">
// // // // // // // //                       <PlaneTakeoff className="h-4 w-4" /> {t('from')}
// // // // // // // //                     </Label>

// // // // // // // //                     <Select
// // // // // // // //                       onValueChange={handleOriginCountryChange}
// // // // // // // //                       value={originCountry}
// // // // // // // //                       disabled={isLoadingMarkets}
// // // // // // // //                     >
// // // // // // // //                       <SelectTrigger className="bg-background">
// // // // // // // //                         <SelectValue placeholder={t('originCountry')} />
// // // // // // // //                       </SelectTrigger>
// // // // // // // //                       <SelectContent>
// // // // // // // //                         {activeMarkets.map((m) => (
// // // // // // // //                           <SelectItem key={m.id} value={m.id}>
// // // // // // // //                             {m.name}
// // // // // // // //                           </SelectItem>
// // // // // // // //                         ))}
// // // // // // // //                       </SelectContent>
// // // // // // // //                     </Select>

// // // // // // // //                     <FormField
// // // // // // // //                       control={form.control}
// // // // // // // //                       name="origin"
// // // // // // // //                       render={({ field }) => (
// // // // // // // //                         <FormItem>
// // // // // // // //                           <FormControl>
// // // // // // // //                             <Select
// // // // // // // //                               onValueChange={field.onChange}
// // // // // // // //                               value={field.value}
// // // // // // // //                               disabled={!originCountry}
// // // // // // // //                             >
// // // // // // // //                               <SelectTrigger className="bg-background">
// // // // // // // //                                 <SelectValue placeholder={t('originCity')} />
// // // // // // // //                               </SelectTrigger>
// // // // // // // //                               <SelectContent>
// // // // // // // //                                 {originCities.map((cityKey) => (
// // // // // // // //                                   <SelectItem key={cityKey} value={cityKey}>
// // // // // // // //                                     {getCityName(cityKey, locale)}
// // // // // // // //                                   </SelectItem>
// // // // // // // //                                 ))}
// // // // // // // //                               </SelectContent>
// // // // // // // //                             </Select>
// // // // // // // //                           </FormControl>
// // // // // // // //                           <FormMessage />
// // // // // // // //                         </FormItem>
// // // // // // // //                       )}
// // // // // // // //                     />
// // // // // // // //                   </div>

// // // // // // // //                   <div className="space-y-2">
// // // // // // // //                     <Label className="flex items-center gap-2 font-bold text-accent">
// // // // // // // //                       <PlaneLanding className="h-4 w-4" />{t('to')}
// // // // // // // //                     </Label>

// // // // // // // //                     <Select
// // // // // // // //                       onValueChange={handleDestCountryChange}
// // // // // // // //                       value={destinationCountry}
// // // // // // // //                       disabled={isLoadingMarkets}
// // // // // // // //                     >
// // // // // // // //                       <SelectTrigger className="bg-background">
// // // // // // // //                         <SelectValue placeholder={t('destinationCountry')} />
// // // // // // // //                       </SelectTrigger>
// // // // // // // //                       <SelectContent>
// // // // // // // //                         {activeMarkets
// // // // // // // //                           .filter((m) => m.id !== originCountry)
// // // // // // // //                           .map((m) => (
// // // // // // // //                             <SelectItem key={m.id} value={m.id}>
// // // // // // // //                               {m.name}
// // // // // // // //                             </SelectItem>
// // // // // // // //                           ))}
// // // // // // // //                       </SelectContent>
// // // // // // // //                     </Select>

// // // // // // // //                     <FormField
// // // // // // // //                       control={form.control}
// // // // // // // //                       name="destination"
// // // // // // // //                       render={({ field }) => (
// // // // // // // //                         <FormItem>
// // // // // // // //                           <FormControl>
// // // // // // // //                             <Select
// // // // // // // //                               onValueChange={field.onChange}
// // // // // // // //                               value={field.value}
// // // // // // // //                               disabled={!destinationCountry}
// // // // // // // //                             >
// // // // // // // //                               <SelectTrigger className="bg-background">
// // // // // // // //                                 <SelectValue placeholder={t('destinationCity')} />
// // // // // // // //                               </SelectTrigger>
// // // // // // // //                               <SelectContent>
// // // // // // // //                                 {destinationCities.map((cityKey) => (
// // // // // // // //                                   <SelectItem key={cityKey} value={cityKey}>
// // // // // // // //                                     {getCityName(cityKey, locale)}
// // // // // // // //                                   </SelectItem>
// // // // // // // //                                 ))}
// // // // // // // //                               </SelectContent>
// // // // // // // //                             </Select>
// // // // // // // //                           </FormControl>
// // // // // // // //                           <FormMessage />
// // // // // // // //                         </FormItem>
// // // // // // // //                       )}
// // // // // // // //                     />
// // // // // // // //                   </div>
// // // // // // // //                 </CardContent>
// // // // // // // //               </Card>

// // // // // // // //               <Accordion type="single" collapsible className="w-full" defaultValue="social">
// // // // // // // //                 <AccordionItem value="social" className="border rounded-lg bg-primary/5 border-primary/20">
// // // // // // // //                   <AccordionTrigger className="p-4 font-black text-sm hover:no-underline text-primary">
// // // // // // // //                     <div className="flex items-center gap-2">
// // // // // // // //                       <ShieldCheck className="h-4 w-4" />
// // // // // // // //                       {t('social')}
// // // // // // // //                     </div>
// // // // // // // //                   </AccordionTrigger>

// // // // // // // //                   <AccordionContent className="p-4 pt-0 space-y-4">
// // // // // // // //                     <div className="bg-background/50 p-3 rounded-xl border border-dashed border-primary/20 flex gap-2 items-start mb-4">
// // // // // // // //                       <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
// // // // // // // //                       <p className="text-[10px] leading-relaxed text-muted-foreground">
// // // // // // // //                         {t('socialInfo')}
// // // // // // // //                       </p>
// // // // // // // //                     </div>

// // // // // // // //                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// // // // // // // //                       <FormField
// // // // // // // //                         control={form.control}
// // // // // // // //                         name="facebookProfile"
// // // // // // // //                         render={({ field }) => (
// // // // // // // //                           <FormItem>
// // // // // // // //                             <FormLabel className="flex items-center gap-1 text-[10px] font-black">
// // // // // // // //                               <Facebook className="h-3 w-3 text-blue-600" /> {t('facebook')}
// // // // // // // //                             </FormLabel>
// // // // // // // //                             <FormControl>
// // // // // // // //                               <Input
// // // // // // // //                                 placeholder="https://facebook.com/..."
// // // // // // // //                                 className="bg-card text-[10px] ltr"
// // // // // // // //                                 {...field}
// // // // // // // //                               />
// // // // // // // //                             </FormControl>
// // // // // // // //                             <FormMessage />
// // // // // // // //                           </FormItem>
// // // // // // // //                         )}
// // // // // // // //                       />

// // // // // // // //                       <FormField
// // // // // // // //                         control={form.control}
// // // // // // // //                         name="instagramProfile"
// // // // // // // //                         render={({ field }) => (
// // // // // // // //                           <FormItem>
// // // // // // // //                             <FormLabel className="flex items-center gap-1 text-[10px] font-black">
// // // // // // // //                               <Instagram className="h-3 w-3 text-pink-600" /> {t('instagram')}
// // // // // // // //                             </FormLabel>
// // // // // // // //                             <FormControl>
// // // // // // // //                               <Input
// // // // // // // //                                 placeholder="https://instagram.com/..."
// // // // // // // //                                 className="bg-card text-[10px] ltr"
// // // // // // // //                                 {...field}
// // // // // // // //                               />
// // // // // // // //                             </FormControl>
// // // // // // // //                             <FormMessage />
// // // // // // // //                           </FormItem>
// // // // // // // //                         )}
// // // // // // // //                       />

// // // // // // // //                       <FormField
// // // // // // // //                         control={form.control}
// // // // // // // //                         name="tiktokProfile"
// // // // // // // //                         render={({ field }) => (
// // // // // // // //                           <FormItem>
// // // // // // // //                             <FormLabel className="flex items-center gap-1 text-[10px] font-black">
// // // // // // // //                               <Video className="h-3 w-3 text-foreground" /> {t('tiktok')}
// // // // // // // //                             </FormLabel>
// // // // // // // //                             <FormControl>
// // // // // // // //                               <Input
// // // // // // // //                                 placeholder="https://tiktok.com/@..."
// // // // // // // //                                 className="bg-card text-[10px] ltr"
// // // // // // // //                                 {...field}
// // // // // // // //                               />
// // // // // // // //                             </FormControl>
// // // // // // // //                             <FormMessage />
// // // // // // // //                           </FormItem>
// // // // // // // //                         )}
// // // // // // // //                       />
// // // // // // // //                     </div>
// // // // // // // //                   </AccordionContent>
// // // // // // // //                 </AccordionItem>

// // // // // // // //                 <AccordionItem value="details" className="border rounded-lg bg-muted/30 mt-4">
// // // // // // // //                   <AccordionTrigger className="p-4 font-semibold text-sm hover:no-underline">
// // // // // // // //                     <div className="flex items-center gap-2">
// // // // // // // //                       <Settings className="h-4 w-4" />
// // // // // // // //                       {t('details')}
// // // // // // // //                     </div>
// // // // // // // //                   </AccordionTrigger>

// // // // // // // //                   <AccordionContent className="p-4 pt-0 space-y-4">
// // // // // // // //                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // // // // // // //                       {/* <FormField
// // // // // // // //                         control={form.control}
// // // // // // // //                         name="departureDate"
// // // // // // // //                         render={({ field }) => (
// // // // // // // //                           <FormItem className="flex flex-col">
// // // // // // // //                             <FormLabel>{t('departureDate')}</FormLabel>
// // // // // // // //                             <FormControl>
// // // // // // // //                               <div className="relative">
// // // // // // // //                                 <Input
// // // // // // // //                                   type="date"
// // // // // // // //                                   className="bg-card block w-full pl-10"
// // // // // // // //                                   {...field}
// // // // // // // //                                   value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
// // // // // // // //                                   onChange={(e) =>
// // // // // // // //                                     field.onChange(e.target.value ? new Date(e.target.value) : undefined)
// // // // // // // //                                   }
// // // // // // // //                                   min={new Date().toISOString().split('T')[0]}
// // // // // // // //                                 />
// // // // // // // //                                 <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
// // // // // // // //                               </div>
// // // // // // // //                             </FormControl>
// // // // // // // //                             <FormMessage />
// // // // // // // //                           </FormItem>
// // // // // // // //                         )}
// // // // // // // //                       /> */}
// // // // // // // //                       <FormField
// // // // // // // //                         control={form.control}
// // // // // // // //                         name="departureDate"
// // // // // // // //                         render={({ field }) => (
// // // // // // // //                           <FormItem className="flex flex-col">
// // // // // // // //                             <FormLabel>{t('departureDate')}</FormLabel>
// // // // // // // //                             <FormControl>
// // // // // // // //                               <div className="relative">
// // // // // // // //                                 <Input
// // // // // // // //                                   type="date"
// // // // // // // //                                   className="bg-card block w-full pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
// // // // // // // //                                   {...field}
// // // // // // // //                                   value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
// // // // // // // //                                   onChange={(e) =>
// // // // // // // //                                     field.onChange(e.target.value ? new Date(e.target.value) : undefined)
// // // // // // // //                                   }
// // // // // // // //                                   min={new Date().toISOString().split('T')[0]}
// // // // // // // //                                 />
// // // // // // // //                                 <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-primary cursor-pointer" />
// // // // // // // //                               </div>
// // // // // // // //                             </FormControl>
// // // // // // // //                             <FormMessage />
// // // // // // // //                           </FormItem>
// // // // // // // //                         )}
// // // // // // // //                       />
// // // // // // // //                       {/* <FormField
// // // // // // // //                         control={form.control}
// // // // // // // //                         name="departureTime"
// // // // // // // //                         render={({ field }) => (
// // // // // // // //                           <FormItem className="flex flex-col">
// // // // // // // //                             <FormLabel>{t('departureTime')}</FormLabel>
// // // // // // // //                             <FormControl>
// // // // // // // //                               <Input type="time" className="bg-card" {...field} />
// // // // // // // //                             </FormControl>
// // // // // // // //                             <FormMessage />
// // // // // // // //                           </FormItem>
// // // // // // // //                         )}
// // // // // // // //                       /> */}
// // // // // // // //                       <FormField
// // // // // // // //                         control={form.control}
// // // // // // // //                         name="departureTime"
// // // // // // // //                         render={({ field }) => (
// // // // // // // //                           <FormItem className="flex flex-col">
// // // // // // // //                             <FormLabel>{t('departureTime')}</FormLabel>
// // // // // // // //                             <FormControl>
// // // // // // // //                               <div className="relative">
// // // // // // // //                                 <Input
// // // // // // // //                                   type="time"
// // // // // // // //                                   className="bg-card pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
// // // // // // // //                                   {...field}
// // // // // // // //                                 />
// // // // // // // //                                 <Clock className="absolute right-3 top-2.5 h-4 w-4 text-primary pointer-events-none" />
// // // // // // // //                               </div>
// // // // // // // //                             </FormControl>
// // // // // // // //                             <FormMessage />
// // // // // // // //                           </FormItem>
// // // // // // // //                         )}
// // // // // // // //                       />
// // // // // // // //                     </div>

// // // // // // // //                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // // // // // // //                       <FormField
// // // // // // // //                         control={form.control}
// // // // // // // //                         name="availableSeats"
// // // // // // // //                         render={({ field }) => (
// // // // // // // //                           <FormItem>
// // // // // // // //                             <FormLabel>{t('availableSeats')}</FormLabel>
// // // // // // // //                             <FormControl>
// // // // // // // //                               <Input className="bg-card" type="number" {...field} />
// // // // // // // //                             </FormControl>
// // // // // // // //                             <FormMessage />
// // // // // // // //                           </FormItem>
// // // // // // // //                         )}
// // // // // // // //                       />

// // // // // // // //                       <FormField
// // // // // // // //                         control={form.control}
// // // // // // // //                         name="estimatedDurationHours"
// // // // // // // //                         render={({ field }) => (
// // // // // // // //                           <FormItem>
// // // // // // // //                             <FormLabel className="flex items-center gap-1">
// // // // // // // //                               <Clock className="h-4 w-4 text-primary font-bold" />
// // // // // // // //                               {t('duration')}
// // // // // // // //                             </FormLabel>
// // // // // // // //                             <FormControl>
// // // // // // // //                               <Input className="bg-card border-primary/50" type="number" {...field} />
// // // // // // // //                             </FormControl>
// // // // // // // //                             <p className="text-[10px] text-muted-foreground">
// // // // // // // //                               {t('ticketTravel')}
// // // // // // // //                             </p>
// // // // // // // //                             <FormMessage />
// // // // // // // //                           </FormItem>
// // // // // // // //                         )}
// // // // // // // //                       />
// // // // // // // //                     </div>

// // // // // // // //                     <FormField
// // // // // // // //                       control={form.control}
// // // // // // // //                       name="meetingPoint"
// // // // // // // //                       render={({ field }) => (
// // // // // // // //                         <FormItem>
// // // // // // // //                           <FormLabel className="flex items-center gap-1">
// // // // // // // //                             <MapPin className="h-4 w-4" />
// // // // // // // //                             {t('meetingPoint')}
// // // // // // // //                           </FormLabel>
// // // // // // // //                           <FormControl>
// // // // // // // //                             <Input className="bg-card" placeholder={t('meetingPointPlaceholder')} {...field} />
// // // // // // // //                           </FormControl>
// // // // // // // //                           <FormMessage />
// // // // // // // //                         </FormItem>
// // // // // // // //                       )}
// // // // // // // //                     />

// // // // // // // //                     <FormField
// // // // // // // //                       control={form.control}
// // // // // // // //                       name="meetingPointLink"
// // // // // // // //                       render={({ field }) => (
// // // // // // // //                         <FormItem>
// // // // // // // //                           <FormLabel className="flex items-center gap-1">
// // // // // // // //                             <MapPin className="h-4 w-4" />
// // // // // // // //                             {t('linkLocation')}
// // // // // // // //                           </FormLabel>
// // // // // // // //                           <FormControl>
// // // // // // // //                             <Input
// // // // // // // //                               className="bg-card ltr text-sm"
// // // // // // // //                               placeholder="https://maps.google.com/..."
// // // // // // // //                               {...field}
// // // // // // // //                             />
// // // // // // // //                           </FormControl>
// // // // // // // //                           <p className="text-[10px] text-muted-foreground flex items-center gap-1">
// // // // // // // //                             <MapPin className="h-3 w-3" />
// // // // // // // //                             {t('linkDec')}
// // // // // // // //                           </p>
// // // // // // // //                           <FormMessage />
// // // // // // // //                         </FormItem>
// // // // // // // //                       )}
// // // // // // // //                     />
// // // // // // // //                   </AccordionContent>
// // // // // // // //                 </AccordionItem>
// // // // // // // //               </Accordion>

// // // // // // // //               <DialogFooter className="gap-2 sm:gap-0 pt-4">
// // // // // // // //                 <Button
// // // // // // // //                   type="button"
// // // // // // // //                   variant="secondary"
// // // // // // // //                   onClick={() => onOpenChange(false)}
// // // // // // // //                   disabled={isSubmitting}
// // // // // // // //                 >
// // // // // // // //                   {t('cancel')}
// // // // // // // //                 </Button>

// // // // // // // //                 <Button
// // // // // // // //                   type="submit"
// // // // // // // //                   disabled={isSubmitting}
// // // // // // // //                   className="font-black text-sm rounded-2xl shadow-md"
// // // // // // // //                 >
// // // // // // // //                   {isSubmitting ? (
// // // // // // // //                     <>
// // // // // // // //                       <Loader2 className="ml-2 h-5 w-5 animate-spin" />
// // // // // // // //                       {t('submitting')}
// // // // // // // //                     </>
// // // // // // // //                   ) : (
// // // // // // // //                     <>
// // // // // // // //                       <Send className="ml-2 h-5 w-5" />
// // // // // // // //                       {t('submit')}
// // // // // // // //                     </>
// // // // // // // //                   )}
// // // // // // // //                 </Button>
// // // // // // // //               </DialogFooter>
// // // // // // // //             </form>
// // // // // // // //           </Form>
// // // // // // // //         )}
// // // // // // // //       </DialogContent>
// // // // // // // //     </Dialog>
// // // // // // // //   );
// // // // // // // // }
// // // // // // // 'use client';

// // // // // // // import { useState, useMemo, useEffect, useCallback } from 'react';
// // // // // // // import { useForm } from 'react-hook-form';
// // // // // // // import { zodResolver } from '@hookform/resolvers/zod';
// // // // // // // import { z } from 'zod';
// // // // // // // import {
// // // // // // //   Dialog,
// // // // // // //   DialogContent,
// // // // // // //   DialogHeader,
// // // // // // //   DialogTitle,
// // // // // // //   DialogDescription,
// // // // // // //   DialogFooter,
// // // // // // // } from '@/components/ui/dialog';
// // // // // // // import {
// // // // // // //   Form,
// // // // // // //   FormControl,
// // // // // // //   FormField,
// // // // // // //   FormItem,
// // // // // // //   FormLabel,
// // // // // // //   FormMessage,
// // // // // // // } from '@/components/ui/form';
// // // // // // // import { Button } from '@/components/ui/button';
// // // // // // // import { Input } from '@/components/ui/input';
// // // // // // // import {
// // // // // // //   Select,
// // // // // // //   SelectContent,
// // // // // // //   SelectItem,
// // // // // // //   SelectTrigger,
// // // // // // //   SelectValue,
// // // // // // // } from '@/components/ui/select';
// // // // // // // import { Card, CardContent } from '@/components/ui/card';
// // // // // // // import { useToast } from '@/hooks/use-toast';
// // // // // // // import { useFirestore, useUser } from '@/firebase';
// // // // // // // import { useUserProfile } from '@/hooks/use-user-profile';
// // // // // // // import { collection, serverTimestamp, doc, updateDoc, addDoc, getDoc } from 'firebase/firestore';
// // // // // // // import { FirebaseError } from 'firebase/app';
// // // // // // // import {
// // // // // // //   Loader2,
// // // // // // //   Send,
// // // // // // //   Clock,
// // // // // // //   PlaneTakeoff,
// // // // // // //   PlaneLanding,
// // // // // // //   Settings,
// // // // // // //   MapPin,
// // // // // // //   Calendar as CalendarIcon,
// // // // // // //   Lock,
// // // // // // //   Facebook,
// // // // // // //   Instagram,
// // // // // // //   Video,
// // // // // // //   Info,
// // // // // // //   ShieldCheck,
// // // // // // // } from 'lucide-react';
// // // // // // // import { format } from 'date-fns';
// // // // // // // import { Label } from '@/components/ui/label';
// // // // // // // import {
// // // // // // //   Accordion,
// // // // // // //   AccordionContent,
// // // // // // //   AccordionItem,
// // // // // // //   AccordionTrigger,
// // // // // // // } from '@/components/ui/accordion';
// // // // // // // import { getCityName } from '@/lib/constants';
// // // // // // // import { combineDateAndTime } from '@/lib/formatters';
// // // // // // // import { useLocale, useTranslations } from 'next-intl';
// // // // // // // import { useActiveMarkets } from '@/hooks/use-active-markets';
// // // // // // // import { useRouter } from '@/i18n/routing';
// // // // // // // import { useCarrierStatus } from '@/hooks/use-carrier-status';

// // // // // // // const addTripSchema = z.object({
// // // // // // //   origin: z.string().min(1, 'مدينة الانطلاق مطلوبة'),
// // // // // // //   destination: z.string().min(1, 'مدينة الوصول مطلوبة'),
// // // // // // //   departureDate: z.date({ required_error: 'تاريخ المغادرة مطلوب' }),
// // // // // // //   departureTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
// // // // // // //     message: 'الرجاء إدخل وقت صالح (صيغة 24 ساعة HH:MM)',
// // // // // // //   }),
// // // // // // //   meetingPoint: z.string().min(3, 'نقطة التجمع مطلوبة'),
// // // // // // //   meetingPointLink: z.string().url('الرجاء إدخال رابط خرائط جوجل صالح').min(1, 'رابط الموقع على الخريطة مطلوب'),
// // // // // // //   availableSeats: z.coerce.number().int().min(1, 'يجب توفر مقعد واحد على الأقل'),
// // // // // // //   estimatedDurationHours: z.coerce.number().int().min(1, 'مدة الرحلة التقديرية إجبارية'),
// // // // // // //   conditions: z.string().max(200, 'الشروط يجب ألا تتجاوز 200 حرف').optional(),
// // // // // // //   facebookProfile: z.string().url('رابط فيسبوك غير صالح').optional().or(z.literal('')),
// // // // // // //   instagramProfile: z.string().url('رابط إنستغرام غير صالح').optional().or(z.literal('')),
// // // // // // //   tiktokProfile: z.string().url('رابط تيك توك غير صالح').optional().or(z.literal('')),
// // // // // // // });

// // // // // // // type AddTripFormValues = z.infer<typeof addTripSchema>;

// // // // // // // interface AddTripDialogProps {
// // // // // // //   isOpen: boolean;
// // // // // // //   onOpenChange: (isOpen: boolean) => void;
// // // // // // // }

// // // // // // // export function AddTripDialog({ isOpen, onOpenChange }: AddTripDialogProps) {
// // // // // // //   const { toast } = useToast();
// // // // // // //   const firestore = useFirestore();
// // // // // // //   const { user } = useUser();
// // // // // // //   const { profile } = useUserProfile();
// // // // // // //   const router = useRouter();
// // // // // // //   const [isSubmitting, setIsSubmitting] = useState(false);
// // // // // // //   const locale = useLocale();
// // // // // // //   const { activeMarkets, isLoading: isLoadingMarkets } = useActiveMarkets();
// // // // // // //   const { isExpired } = useCarrierStatus(profile?.expiryDate);
// // // // // // //   const t = useTranslations('addTripDialog');
// // // // // // //   const [originCountry, setOriginCountry] = useState('');
// // // // // // //   const [destinationCountry, setDestinationCountry] = useState('');

// // // // // // //   const form = useForm<AddTripFormValues>({
// // // // // // //     resolver: zodResolver(addTripSchema),
// // // // // // //     defaultValues: {
// // // // // // //       origin: '',
// // // // // // //       destination: '',
// // // // // // //       departureTime: '',
// // // // // // //       meetingPoint: '',
// // // // // // //       meetingPointLink: '',
// // // // // // //       availableSeats: 4,
// // // // // // //       estimatedDurationHours: 3,
// // // // // // //       conditions: '',
// // // // // // //       facebookProfile: '',
// // // // // // //       instagramProfile: '',
// // // // // // //       tiktokProfile: '',
// // // // // // //     },
// // // // // // //   });

// // // // // // //   useEffect(() => {
// // // // // // //     if (isOpen && profile) {
// // // // // // //       if (profile.jurisdiction?.origin) setOriginCountry(profile.jurisdiction.origin);
// // // // // // //       if (profile.jurisdiction?.destination) setDestinationCountry(profile.jurisdiction.destination);

// // // // // // //       form.reset({
// // // // // // //         origin: '',
// // // // // // //         destination: '',
// // // // // // //         estimatedDurationHours: 3,
// // // // // // //         departureTime: '',
// // // // // // //         meetingPoint: '',
// // // // // // //         meetingPointLink: '',
// // // // // // //         availableSeats: profile.vehicleCapacity || 4,
// // // // // // //         conditions: profile.conditions || '',
// // // // // // //         facebookProfile: (profile as any).facebookProfile || '',
// // // // // // //         instagramProfile: (profile as any).instagramProfile || '',
// // // // // // //         tiktokProfile: (profile as any).tiktokProfile || '',
// // // // // // //       });
// // // // // // //     }
// // // // // // //   }, [isOpen, profile, form]);

// // // // // // //   const originCities = useMemo(() => {
// // // // // // //     if (!originCountry) return [];
// // // // // // //     return activeMarkets.find((m) => m.id === originCountry)?.cities || [];
// // // // // // //   }, [activeMarkets, originCountry]);

// // // // // // //   const destinationCities = useMemo(() => {
// // // // // // //     if (!destinationCountry) return [];
// // // // // // //     return activeMarkets.find((m) => m.id === destinationCountry)?.cities || [];
// // // // // // //   }, [activeMarkets, destinationCountry]);

// // // // // // //   const handleOriginCountryChange = useCallback(
// // // // // // //     (val: string) => {
// // // // // // //       setOriginCountry(val);
// // // // // // //       form.setValue('origin', '');
// // // // // // //     },
// // // // // // //     [form]
// // // // // // //   );

// // // // // // //   const handleDestCountryChange = useCallback(
// // // // // // //     (val: string) => {
// // // // // // //       setDestinationCountry(val);
// // // // // // //       form.setValue('destination', '');
// // // // // // //     },
// // // // // // //     [form]
// // // // // // //   );

// // // // // // //   const onSubmit = async (data: AddTripFormValues) => {
// // // // // // //     if (!firestore || !user || !profile) return;

// // // // // // //     // تأكد إن الناقل أكمل الشروط الدائمة والبروفيل قبل إنشاء رحلة
// // // // // // //     if (!profile.isPermanentComplete) {
// // // // // // //       toast({
// // // // // // //         variant: 'destructive',
// // // // // // //         title: t('errorProfile'),
// // // // // // //         description: t('errorProfileDesc'),
// // // // // // //       });
// // // // // // //       onOpenChange(false);
// // // // // // //       router.push('/carrier/Permanent');
// // // // // // //       return;
// // // // // // //     }

// // // // // // //     if (profile.isPartial || !profile.vehicleType || !profile.vehicleCapacity) {
// // // // // // //       toast({
// // // // // // //         variant: 'destructive',
// // // // // // //         title: t('errorProfile'),
// // // // // // //         description: t('errorProfileDesc')
// // // // // // //       });
// // // // // // //       onOpenChange(false);
// // // // // // //       router.push('/carrier/profile');
// // // // // // //       return;
// // // // // // //     }

// // // // // // //     if (profile.currentActiveTripId) {
// // // // // // //       try {
// // // // // // //         const activeTripRef = doc(firestore, 'trips', profile.currentActiveTripId);
// // // // // // //         const activeTripSnap = await getDoc(activeTripRef);

// // // // // // //         if (activeTripSnap.exists()) {
// // // // // // //           const activeTrip = activeTripSnap.data() as any;

// // // // // // //           const depDate = activeTrip.departureDate?.toDate?.()
// // // // // // //             ? activeTrip.departureDate.toDate()
// // // // // // //             : new Date(activeTrip.departureDate || 0);

// // // // // // //           const durationHours = activeTrip.estimatedDurationHours || 0;
// // // // // // //           const endDate = new Date(depDate.getTime() + durationHours * 60 * 60 * 1000);
// // // // // // //           const hasEnded = endDate < new Date();

// // // // // // //           if (hasEnded || activeTrip.status === 'Completed' || activeTrip.status === 'Cancelled') {
// // // // // // //             await updateDoc(doc(firestore, 'users', user.uid), {
// // // // // // //               currentActiveTripId: null,
// // // // // // //               updatedAt: serverTimestamp(),
// // // // // // //             });
// // // // // // //           } else {
// // // // // // //             toast({
// // // // // // //               variant: 'destructive',
// // // // // // //               title: t('errorActiveTrip'),
// // // // // // //               description: t('errorActiveTripDesc')
// // // // // // //             });
// // // // // // //             return;
// // // // // // //           }
// // // // // // //         } else {
// // // // // // //           await updateDoc(doc(firestore, 'users', user.uid), {
// // // // // // //             currentActiveTripId: null,
// // // // // // //             updatedAt: serverTimestamp(),
// // // // // // //           });
// // // // // // //         }
// // // // // // //       } catch (e) {
// // // // // // //         toast({
// // // // // // //           variant: 'destructive',
// // // // // // //           title: t('errorVerify'),
// // // // // // //           description: t('errorVerifyDesc')
// // // // // // //         });
// // // // // // //         return;
// // // // // // //       }
// // // // // // //     }

// // // // // // //     setIsSubmitting(true);

// // // // // // //     try {
// // // // // // //       const combinedDepartureDateTime = combineDateAndTime(data.departureDate, data.departureTime);

// // // // // // //       const tripData = {
// // // // // // //         ...data,
// // // // // // //         departureDate: combinedDepartureDateTime.toISOString(),
// // // // // // //         userId: user.uid,
// // // // // // //         carrierId: user.uid,
// // // // // // //         carrierName: profile.firstName,
// // // // // // //         vehicleType: profile.vehicleType || 'غير محدد',
// // // // // // //         vehiclePlateNumber: profile?.plateNumber || '',
// // // // // // //         vehicleCapacity: profile?.vehicleCapacity || 0,
// // // // // // //         numberOfStops: profile.numberOfStops ?? 0,
// // // // // // //         bagsPerSeat: profile.bagsPerSeat ?? 1,
// // // // // // //         vehicleCategory: profile.vehicleCapacity && profile.vehicleCapacity > 7 ? 'bus' : 'small',
// // // // // // //         status: 'Planned' as const,
// // // // // // //         price: Number(profile.price) || 0,
// // // // // // //         currency: profile.currency || 'د.أ',
// // // // // // //         depositPercentage: profile.depositPercentage ?? 0,
// // // // // // //         createdAt: serverTimestamp(),
// // // // // // //         updatedAt: serverTimestamp(),
// // // // // // //       };

// // // // // // //       delete (tripData as any).departureTime;

// // // // // // //       const newTripRef = await addDoc(collection(firestore, 'trips'), tripData);

// // // // // // //       const userUpdates: any = {
// // // // // // //         currentActiveTripId: newTripRef.id,
// // // // // // //         updatedAt: serverTimestamp(),
// // // // // // //       };

// // // // // // //       if (data.facebookProfile) userUpdates.facebookProfile = data.facebookProfile;
// // // // // // //       if (data.instagramProfile) userUpdates.instagramProfile = data.instagramProfile;
// // // // // // //       if (data.tiktokProfile) userUpdates.tiktokProfile = data.tiktokProfile;

// // // // // // //       await updateDoc(doc(firestore, 'users', user.uid), userUpdates);

// // // // // // //       toast({ title: t('successAdd') + ' ✅' });
// // // // // // //       onOpenChange(false);
// // // // // // //       form.reset();
// // // // // // //     } catch (error: any) {
// // // // // // //       toast({
// // // // // // //         variant: 'destructive',
// // // // // // //         title: t('errorAdd'),
// // // // // // //         description: error?.message || t('errorAddDesc')
// // // // // // //       });
// // // // // // //     } finally {
// // // // // // //       setIsSubmitting(false);
// // // // // // //     }
// // // // // // //   };
// // // // // // //   return (
// // // // // // //     <Dialog open={isOpen} onOpenChange={onOpenChange}>
// // // // // // //       <DialogContent className="sm:max-w-3xl">
// // // // // // //         <DialogHeader>
// // // // // // //           <DialogTitle> {t('title')}</DialogTitle>
// // // // // // //           <DialogDescription>
// // // // // // //             {t('desc')}
// // // // // // //           </DialogDescription>
// // // // // // //         </DialogHeader>

// // // // // // //         {isExpired ? (
// // // // // // //           <div className="p-10 flex flex-col items-center text-center space-y-6 animate-in fade-in zoom-in duration-500 bg-destructive/5 rounded-[2.5rem] border-2 border-destructive/20 my-4">
// // // // // // //             <div className="w-20 h-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center shadow-inner">
// // // // // // //               <Lock className="w-10 h-10 animate-pulse" />
// // // // // // //             </div>

// // // // // // //             <div className="space-y-2">
// // // // // // //               <h3 className="text-2xl font-black text-foreground tracking-tight uppercase">
// // // // // // //                 {t('expiredTitle')}
// // // // // // //               </h3>
// // // // // // //               <p className="text-sm text-muted-foreground font-bold leading-relaxed max-w-sm mx-auto  ">
// // // // // // //                 {t('expiredDesc')}
// // // // // // //               </p>
// // // // // // //             </div>

// // // // // // //             <Button
// // // // // // //               className="w-full h-14 rounded-2xl bg-primary text-black font-black text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
// // // // // // //               onClick={() => router.push('/carrier/Permanent')}
// // // // // // //             >
// // // // // // //               {t('expiredBtn')}
// // // // // // //             </Button>
// // // // // // //           </div>
// // // // // // //         ) : (
// // // // // // //           <Form {...form}>
// // // // // // //             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
// // // // // // //               <Card className="bg-muted/30 border-accent/20">
// // // // // // //                 <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
// // // // // // //                   <div className="space-y-2">
// // // // // // //                     <Label className="flex items-center gap-2 font-bold text-accent">
// // // // // // //                       <PlaneTakeoff className="h-4 w-4" /> {t('from')}
// // // // // // //                     </Label>

// // // // // // //                     <Select
// // // // // // //                       onValueChange={handleOriginCountryChange}
// // // // // // //                       value={originCountry}
// // // // // // //                       disabled={isLoadingMarkets}
// // // // // // //                     >
// // // // // // //                       <SelectTrigger className="bg-background">
// // // // // // //                         <SelectValue placeholder={t('originCountry')} />
// // // // // // //                       </SelectTrigger>
// // // // // // //                       <SelectContent>
// // // // // // //                         {activeMarkets.map((m) => (
// // // // // // //                           <SelectItem key={m.id} value={m.id}>
// // // // // // //                             {m.name}
// // // // // // //                           </SelectItem>
// // // // // // //                         ))}
// // // // // // //                       </SelectContent>
// // // // // // //                     </Select>

// // // // // // //                     <FormField
// // // // // // //                       control={form.control}
// // // // // // //                       name="origin"
// // // // // // //                       render={({ field }) => (
// // // // // // //                         <FormItem>
// // // // // // //                           <FormControl>
// // // // // // //                             <Select
// // // // // // //                               onValueChange={field.onChange}
// // // // // // //                               value={field.value}
// // // // // // //                               disabled={!originCountry}
// // // // // // //                             >
// // // // // // //                               <SelectTrigger className="bg-background">
// // // // // // //                                 <SelectValue placeholder={t('originCity')} />
// // // // // // //                               </SelectTrigger>
// // // // // // //                               <SelectContent>
// // // // // // //                                 {originCities.map((cityKey) => (
// // // // // // //                                   <SelectItem key={cityKey} value={cityKey}>
// // // // // // //                                     {getCityName(cityKey, locale)}
// // // // // // //                                   </SelectItem>
// // // // // // //                                 ))}
// // // // // // //                               </SelectContent>
// // // // // // //                             </Select>
// // // // // // //                           </FormControl>
// // // // // // //                           <FormMessage />
// // // // // // //                         </FormItem>
// // // // // // //                       )}
// // // // // // //                     />
// // // // // // //                   </div>

// // // // // // //                   <div className="space-y-2">
// // // // // // //                     <Label className="flex items-center gap-2 font-bold text-accent">
// // // // // // //                       <PlaneLanding className="h-4 w-4" />{t('to')}
// // // // // // //                     </Label>

// // // // // // //                     <Select
// // // // // // //                       onValueChange={handleDestCountryChange}
// // // // // // //                       value={destinationCountry}
// // // // // // //                       disabled={isLoadingMarkets}
// // // // // // //                     >
// // // // // // //                       <SelectTrigger className="bg-background">
// // // // // // //                         <SelectValue placeholder={t('destinationCountry')} />
// // // // // // //                       </SelectTrigger>
// // // // // // //                       <SelectContent>
// // // // // // //                         {activeMarkets
// // // // // // //                           .filter((m) => m.id !== originCountry)
// // // // // // //                           .map((m) => (
// // // // // // //                             <SelectItem key={m.id} value={m.id}>
// // // // // // //                               {m.name}
// // // // // // //                             </SelectItem>
// // // // // // //                           ))}
// // // // // // //                       </SelectContent>
// // // // // // //                     </Select>

// // // // // // //                     <FormField
// // // // // // //                       control={form.control}
// // // // // // //                       name="destination"
// // // // // // //                       render={({ field }) => (
// // // // // // //                         <FormItem>
// // // // // // //                           <FormControl>
// // // // // // //                             <Select
// // // // // // //                               onValueChange={field.onChange}
// // // // // // //                               value={field.value}
// // // // // // //                               disabled={!destinationCountry}
// // // // // // //                             >
// // // // // // //                               <SelectTrigger className="bg-background">
// // // // // // //                                 <SelectValue placeholder={t('destinationCity')} />
// // // // // // //                               </SelectTrigger>
// // // // // // //                               <SelectContent>
// // // // // // //                                 {destinationCities.map((cityKey) => (
// // // // // // //                                   <SelectItem key={cityKey} value={cityKey}>
// // // // // // //                                     {getCityName(cityKey, locale)}
// // // // // // //                                   </SelectItem>
// // // // // // //                                 ))}
// // // // // // //                               </SelectContent>
// // // // // // //                             </Select>
// // // // // // //                           </FormControl>
// // // // // // //                           <FormMessage />
// // // // // // //                         </FormItem>
// // // // // // //                       )}
// // // // // // //                     />
// // // // // // //                   </div>
// // // // // // //                 </CardContent>
// // // // // // //               </Card>

// // // // // // //               <Accordion type="single" collapsible className="w-full" defaultValue="social">
// // // // // // //                 <AccordionItem value="social" className="border rounded-lg bg-primary/5 border-primary/20">
// // // // // // //                   <AccordionTrigger className="p-4 font-black text-sm hover:no-underline text-primary">
// // // // // // //                     <div className="flex items-center gap-2">
// // // // // // //                       <ShieldCheck className="h-4 w-4" />
// // // // // // //                       {t('social')}
// // // // // // //                     </div>
// // // // // // //                   </AccordionTrigger>

// // // // // // //                   <AccordionContent className="p-4 pt-0 space-y-4">
// // // // // // //                     <div className="bg-background/50 p-3 rounded-xl border border-dashed border-primary/20 flex gap-2 items-start mb-4">
// // // // // // //                       <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
// // // // // // //                       <p className="text-[10px] leading-relaxed text-muted-foreground">
// // // // // // //                         {t('socialInfo')}
// // // // // // //                       </p>
// // // // // // //                     </div>

// // // // // // //                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// // // // // // //                       <FormField
// // // // // // //                         control={form.control}
// // // // // // //                         name="facebookProfile"
// // // // // // //                         render={({ field }) => (
// // // // // // //                           <FormItem>
// // // // // // //                             <FormLabel className="flex items-center gap-1 text-[10px] font-black">
// // // // // // //                               <Facebook className="h-3 w-3 text-blue-600" /> {t('facebook')}
// // // // // // //                             </FormLabel>
// // // // // // //                             <FormControl>
// // // // // // //                               <Input
// // // // // // //                                 placeholder="https://facebook.com/..."
// // // // // // //                                 className="bg-card text-[10px] ltr"
// // // // // // //                                 {...field}
// // // // // // //                               />
// // // // // // //                             </FormControl>
// // // // // // //                             <FormMessage />
// // // // // // //                           </FormItem>
// // // // // // //                         )}
// // // // // // //                       />

// // // // // // //                       <FormField
// // // // // // //                         control={form.control}
// // // // // // //                         name="instagramProfile"
// // // // // // //                         render={({ field }) => (
// // // // // // //                           <FormItem>
// // // // // // //                             <FormLabel className="flex items-center gap-1 text-[10px] font-black">
// // // // // // //                               <Instagram className="h-3 w-3 text-pink-600" /> {t('instagram')}
// // // // // // //                             </FormLabel>
// // // // // // //                             <FormControl>
// // // // // // //                               <Input
// // // // // // //                                 placeholder="https://instagram.com/..."
// // // // // // //                                 className="bg-card text-[10px] ltr"
// // // // // // //                                 {...field}
// // // // // // //                               />
// // // // // // //                             </FormControl>
// // // // // // //                             <FormMessage />
// // // // // // //                           </FormItem>
// // // // // // //                         )}
// // // // // // //                       />

// // // // // // //                       <FormField
// // // // // // //                         control={form.control}
// // // // // // //                         name="tiktokProfile"
// // // // // // //                         render={({ field }) => (
// // // // // // //                           <FormItem>
// // // // // // //                             <FormLabel className="flex items-center gap-1 text-[10px] font-black">
// // // // // // //                               <Video className="h-3 w-3 text-foreground" /> {t('tiktok')}
// // // // // // //                             </FormLabel>
// // // // // // //                             <FormControl>
// // // // // // //                               <Input
// // // // // // //                                 placeholder="https://tiktok.com/@..."
// // // // // // //                                 className="bg-card text-[10px] ltr"
// // // // // // //                                 {...field}
// // // // // // //                               />
// // // // // // //                             </FormControl>
// // // // // // //                             <FormMessage />
// // // // // // //                           </FormItem>
// // // // // // //                         )}
// // // // // // //                       />
// // // // // // //                     </div>
// // // // // // //                   </AccordionContent>
// // // // // // //                 </AccordionItem>

// // // // // // //                 <AccordionItem value="details" className="border rounded-lg bg-muted/30 mt-4">
// // // // // // //                   <AccordionTrigger className="p-4 font-semibold text-sm hover:no-underline">
// // // // // // //                     <div className="flex items-center gap-2">
// // // // // // //                       <Settings className="h-4 w-4" />
// // // // // // //                       {t('details')}
// // // // // // //                     </div>
// // // // // // //                   </AccordionTrigger>

// // // // // // //                   <AccordionContent className="p-4 pt-0 space-y-4">
// // // // // // //                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // // // // // //                       {/* <FormField
// // // // // // //                         control={form.control}
// // // // // // //                         name="departureDate"
// // // // // // //                         render={({ field }) => (
// // // // // // //                           <FormItem className="flex flex-col">
// // // // // // //                             <FormLabel>{t('departureDate')}</FormLabel>
// // // // // // //                             <FormControl>
// // // // // // //                               <div className="relative">
// // // // // // //                                 <Input
// // // // // // //                                   type="date"
// // // // // // //                                   className="bg-card block w-full pl-10"
// // // // // // //                                   {...field}
// // // // // // //                                   value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
// // // // // // //                                   onChange={(e) =>
// // // // // // //                                     field.onChange(e.target.value ? new Date(e.target.value) : undefined)
// // // // // // //                                   }
// // // // // // //                                   min={new Date().toISOString().split('T')[0]}
// // // // // // //                                 />
// // // // // // //                                 <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
// // // // // // //                               </div>
// // // // // // //                             </FormControl>
// // // // // // //                             <FormMessage />
// // // // // // //                           </FormItem>
// // // // // // //                         )}
// // // // // // //                       /> */}
// // // // // // //                       <FormField
// // // // // // //                         control={form.control}
// // // // // // //                         name="departureDate"
// // // // // // //                         render={({ field }) => (
// // // // // // //                           <FormItem className="flex flex-col">
// // // // // // //                             <FormLabel>{t('departureDate')}</FormLabel>
// // // // // // //                             <FormControl>
// // // // // // //                               <div className="relative">
// // // // // // //                                 <Input
// // // // // // //                                   type="date"
// // // // // // //                                   className="bg-card block w-full pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
// // // // // // //                                   {...field}
// // // // // // //                                   value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
// // // // // // //                                   onChange={(e) =>
// // // // // // //                                     field.onChange(e.target.value ? new Date(e.target.value) : undefined)
// // // // // // //                                   }
// // // // // // //                                   min={new Date().toISOString().split('T')[0]}
// // // // // // //                                 />
// // // // // // //                                 <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-primary cursor-pointer" />
// // // // // // //                               </div>
// // // // // // //                             </FormControl>
// // // // // // //                             <FormMessage />
// // // // // // //                           </FormItem>
// // // // // // //                         )}
// // // // // // //                       />
// // // // // // //                       {/* <FormField
// // // // // // //                         control={form.control}
// // // // // // //                         name="departureTime"
// // // // // // //                         render={({ field }) => (
// // // // // // //                           <FormItem className="flex flex-col">
// // // // // // //                             <FormLabel>{t('departureTime')}</FormLabel>
// // // // // // //                             <FormControl>
// // // // // // //                               <Input type="time" className="bg-card" {...field} />
// // // // // // //                             </FormControl>
// // // // // // //                             <FormMessage />
// // // // // // //                           </FormItem>
// // // // // // //                         )}
// // // // // // //                       /> */}
// // // // // // //                       <FormField
// // // // // // //                         control={form.control}
// // // // // // //                         name="departureTime"
// // // // // // //                         render={({ field }) => (
// // // // // // //                           <FormItem className="flex flex-col">
// // // // // // //                             <FormLabel>{t('departureTime')}</FormLabel>
// // // // // // //                             <FormControl>
// // // // // // //                               <div className="relative">
// // // // // // //                                 <Input
// // // // // // //                                   type="time"
// // // // // // //                                   className="bg-card pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
// // // // // // //                                   {...field}
// // // // // // //                                 />
// // // // // // //                                 <Clock className="absolute right-3 top-2.5 h-4 w-4 text-primary pointer-events-none" />
// // // // // // //                               </div>
// // // // // // //                             </FormControl>
// // // // // // //                             <FormMessage />
// // // // // // //                           </FormItem>
// // // // // // //                         )}
// // // // // // //                       />
// // // // // // //                     </div>

// // // // // // //                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // // // // // //                       <FormField
// // // // // // //                         control={form.control}
// // // // // // //                         name="availableSeats"
// // // // // // //                         render={({ field }) => (
// // // // // // //                           <FormItem>
// // // // // // //                             <FormLabel>{t('availableSeats')}</FormLabel>
// // // // // // //                             <FormControl>
// // // // // // //                               <Input className="bg-card" type="number" {...field} />
// // // // // // //                             </FormControl>
// // // // // // //                             <FormMessage />
// // // // // // //                           </FormItem>
// // // // // // //                         )}
// // // // // // //                       />

// // // // // // //                       <FormField
// // // // // // //                         control={form.control}
// // // // // // //                         name="estimatedDurationHours"
// // // // // // //                         render={({ field }) => (
// // // // // // //                           <FormItem>
// // // // // // //                             <FormLabel className="flex items-center gap-1">
// // // // // // //                               <Clock className="h-4 w-4 text-primary font-bold" />
// // // // // // //                               {t('duration')}
// // // // // // //                             </FormLabel>
// // // // // // //                             <FormControl>
// // // // // // //                               <Input className="bg-card border-primary/50" type="number" {...field} />
// // // // // // //                             </FormControl>
// // // // // // //                             <p className="text-[10px] text-muted-foreground">
// // // // // // //                               {t('ticketTravel')}
// // // // // // //                             </p>
// // // // // // //                             <FormMessage />
// // // // // // //                           </FormItem>
// // // // // // //                         )}
// // // // // // //                       />
// // // // // // //                     </div>

// // // // // // //                     <FormField
// // // // // // //                       control={form.control}
// // // // // // //                       name="meetingPoint"
// // // // // // //                       render={({ field }) => (
// // // // // // //                         <FormItem>
// // // // // // //                           <FormLabel className="flex items-center gap-1">
// // // // // // //                             <MapPin className="h-4 w-4" />
// // // // // // //                             {t('meetingPoint')}
// // // // // // //                           </FormLabel>
// // // // // // //                           <FormControl>
// // // // // // //                             <Input className="bg-card" placeholder={t('meetingPointPlaceholder')} {...field} />
// // // // // // //                           </FormControl>
// // // // // // //                           <FormMessage />
// // // // // // //                         </FormItem>
// // // // // // //                       )}
// // // // // // //                     />

// // // // // // //                     <FormField
// // // // // // //                       control={form.control}
// // // // // // //                       name="meetingPointLink"
// // // // // // //                       render={({ field }) => (
// // // // // // //                         <FormItem>
// // // // // // //                           <FormLabel className="flex items-center gap-1">
// // // // // // //                             <MapPin className="h-4 w-4" />
// // // // // // //                             {t('linkLocation')}
// // // // // // //                           </FormLabel>
// // // // // // //                           <FormControl>
// // // // // // //                             <Input
// // // // // // //                               className="bg-card ltr text-sm"
// // // // // // //                               placeholder="https://maps.google.com/..."
// // // // // // //                               {...field}
// // // // // // //                             />
// // // // // // //                           </FormControl>
// // // // // // //                           <p className="text-[10px] text-muted-foreground flex items-center gap-1">
// // // // // // //                             <MapPin className="h-3 w-3" />
// // // // // // //                             {t('linkDec')}
// // // // // // //                           </p>
// // // // // // //                           <FormMessage />
// // // // // // //                         </FormItem>
// // // // // // //                       )}
// // // // // // //                     />
// // // // // // //                   </AccordionContent>
// // // // // // //                 </AccordionItem>
// // // // // // //               </Accordion>

// // // // // // //               <DialogFooter className="gap-2 sm:gap-0 pt-4">
// // // // // // //                 <Button
// // // // // // //                   type="button"
// // // // // // //                   variant="secondary"
// // // // // // //                   onClick={() => onOpenChange(false)}
// // // // // // //                   disabled={isSubmitting}
// // // // // // //                 >
// // // // // // //                   {t('cancel')}
// // // // // // //                 </Button>

// // // // // // //                 <Button
// // // // // // //                   type="submit"
// // // // // // //                   disabled={isSubmitting}
// // // // // // //                   className="font-black text-sm rounded-2xl shadow-md"
// // // // // // //                 >
// // // // // // //                   {isSubmitting ? (
// // // // // // //                     <>
// // // // // // //                       <Loader2 className="ml-2 h-5 w-5 animate-spin" />
// // // // // // //                       {t('submitting')}
// // // // // // //                     </>
// // // // // // //                   ) : (
// // // // // // //                     <>
// // // // // // //                       <Send className="ml-2 h-5 w-5" />
// // // // // // //                       {t('submit')}
// // // // // // //                     </>
// // // // // // //                   )}
// // // // // // //                 </Button>
// // // // // // //               </DialogFooter>
// // // // // // //             </form>
// // // // // // //           </Form>
// // // // // // //         )}
// // // // // // //       </DialogContent>
// // // // // // //     </Dialog>
// // // // // // //   );
// // // // // // // }
// // // // // // 'use client';

// // // // // // import { useState, useMemo, useEffect, useCallback } from 'react';
// // // // // // import { useForm } from 'react-hook-form';
// // // // // // import { zodResolver } from '@hookform/resolvers/zod';
// // // // // // import { z } from 'zod';
// // // // // // import {
// // // // // //   Dialog,
// // // // // //   DialogContent,
// // // // // //   DialogHeader,
// // // // // //   DialogTitle,
// // // // // //   DialogDescription,
// // // // // //   DialogFooter,
// // // // // // } from '@/components/ui/dialog';
// // // // // // import {
// // // // // //   Form,
// // // // // //   FormControl,
// // // // // //   FormField,
// // // // // //   FormItem,
// // // // // //   FormLabel,
// // // // // //   FormMessage,
// // // // // // } from '@/components/ui/form';
// // // // // // import { Button } from '@/components/ui/button';
// // // // // // import { Input } from '@/components/ui/input';
// // // // // // import {
// // // // // //   Select,
// // // // // //   SelectContent,
// // // // // //   SelectItem,
// // // // // //   SelectTrigger,
// // // // // //   SelectValue,
// // // // // // } from '@/components/ui/select';
// // // // // // import { Card, CardContent } from '@/components/ui/card';
// // // // // // import { useToast } from '@/hooks/use-toast';
// // // // // // import { useFirestore, useUser } from '@/firebase';
// // // // // // import { useUserProfile } from '@/hooks/use-user-profile';
// // // // // // import { collection, serverTimestamp, doc, updateDoc, addDoc, getDoc } from 'firebase/firestore';
// // // // // // import { FirebaseError } from 'firebase/app';
// // // // // // import {
// // // // // //   Loader2,
// // // // // //   Send,
// // // // // //   Clock,
// // // // // //   PlaneTakeoff,
// // // // // //   PlaneLanding,
// // // // // //   Settings,
// // // // // //   MapPin,
// // // // // //   Calendar as CalendarIcon,
// // // // // //   Lock,
// // // // // //   Facebook,
// // // // // //   Instagram,
// // // // // //   Video,
// // // // // //   Info,
// // // // // //   ShieldCheck,
// // // // // // } from 'lucide-react';
// // // // // // import { format } from 'date-fns';
// // // // // // import { Label } from '@/components/ui/label';
// // // // // // import {
// // // // // //   Accordion,
// // // // // //   AccordionContent,
// // // // // //   AccordionItem,
// // // // // //   AccordionTrigger,
// // // // // // } from '@/components/ui/accordion';
// // // // // // import { getCityName } from '@/lib/constants';
// // // // // // import { combineDateAndTime } from '@/lib/formatters';
// // // // // // import { useLocale, useTranslations } from 'next-intl';
// // // // // // import { useActiveMarkets } from '@/hooks/use-active-markets';
// // // // // // import { useRouter } from '@/i18n/routing';
// // // // // // import { useCarrierStatus } from '@/hooks/use-carrier-status';

// // // // // // const addTripSchema = z.object({
// // // // // //   origin: z.string().min(1, 'مدينة الانطلاق مطلوبة'),
// // // // // //   destination: z.string().min(1, 'مدينة الوصول مطلوبة'),
// // // // // //   departureDate: z.date({ required_error: 'تاريخ المغادرة مطلوب' }),
// // // // // //   departureTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
// // // // // //     message: 'الرجاء إدخل وقت صالح (صيغة 24 ساعة HH:MM)',
// // // // // //   }),
// // // // // //   meetingPoint: z.string().min(3, 'نقطة التجمع مطلوبة'),
// // // // // //   meetingPointLink: z.string().url('الرجاء إدخال رابط خرائط جوجل صالح').min(1, 'رابط الموقع على الخريطة مطلوب'),
// // // // // //   availableSeats: z.coerce.number().int().min(1, 'يجب توفر مقعد واحد على الأقل'),
// // // // // //   estimatedDurationHours: z.coerce.number().int().min(1, 'مدة الرحلة التقديرية إجبارية'),
// // // // // //   conditions: z.string().max(200, 'الشروط يجب ألا تتجاوز 200 حرف').optional(),
// // // // // //   facebookProfile: z.string().url('رابط فيسبوك غير صالح').optional().or(z.literal('')),
// // // // // //   instagramProfile: z.string().url('رابط إنستغرام غير صالح').optional().or(z.literal('')),
// // // // // //   tiktokProfile: z.string().url('رابط تيك توك غير صالح').optional().or(z.literal('')),
// // // // // // });

// // // // // // type AddTripFormValues = z.infer<typeof addTripSchema>;

// // // // // // interface AddTripDialogProps {
// // // // // //   isOpen: boolean;
// // // // // //   onOpenChange: (isOpen: boolean) => void;
// // // // // //   /** بيانات مسبقة من طلب المسافر لتعبئة الرحلة أوتوماتيك */
// // // // // //   prefill?: {
// // // // // //     origin?: string;
// // // // // //     originCountry?: string;
// // // // // //     destination?: string;
// // // // // //     destinationCountry?: string;
// // // // // //     departureDate?: Date;
// // // // // //     passengers?: number;
// // // // // //     requestId?: string;
// // // // // //   };
// // // // // // }

// // // // // // export function AddTripDialog({ isOpen, onOpenChange, prefill }: AddTripDialogProps) {
// // // // // //   const { toast } = useToast();
// // // // // //   const firestore = useFirestore();
// // // // // //   const { user } = useUser();
// // // // // //   const { profile } = useUserProfile();
// // // // // //   const router = useRouter();
// // // // // //   const [isSubmitting, setIsSubmitting] = useState(false);
// // // // // //   const locale = useLocale();
// // // // // //   const { activeMarkets, isLoading: isLoadingMarkets } = useActiveMarkets();
// // // // // //   const { isExpired } = useCarrierStatus(profile?.expiryDate);
// // // // // //   const t = useTranslations('addTripDialog');
// // // // // //   const [originCountry, setOriginCountry] = useState('');
// // // // // //   const [destinationCountry, setDestinationCountry] = useState('');

// // // // // //   const form = useForm<AddTripFormValues>({
// // // // // //     resolver: zodResolver(addTripSchema),
// // // // // //     defaultValues: {
// // // // // //       origin: '',
// // // // // //       destination: '',
// // // // // //       departureTime: '',
// // // // // //       meetingPoint: '',
// // // // // //       meetingPointLink: '',
// // // // // //       availableSeats: 4,
// // // // // //       estimatedDurationHours: 3,
// // // // // //       conditions: '',
// // // // // //       facebookProfile: '',
// // // // // //       instagramProfile: '',
// // // // // //       tiktokProfile: '',
// // // // // //     },
// // // // // //   });

// // // // // //   useEffect(() => {
// // // // // //     if (isOpen && profile) {
// // // // // //       // الأولوية للـ prefill (من طلب المسافر)، وإلا من jurisdiction الناقل
// // // // // //       const originC = prefill?.originCountry || profile.jurisdiction?.origin || '';
// // // // // //       const destC = prefill?.destinationCountry || profile.jurisdiction?.destination || '';
// // // // // //       if (originC) setOriginCountry(originC);
// // // // // //       if (destC) setDestinationCountry(destC);

// // // // // //       form.reset({
// // // // // //         origin: prefill?.origin || '',
// // // // // //         destination: prefill?.destination || '',
// // // // // //         estimatedDurationHours: 3,
// // // // // //         departureDate: prefill?.departureDate || undefined,
// // // // // //         departureTime: '',
// // // // // //         meetingPoint: profile.conditions ? '' : '',
// // // // // //         meetingPointLink: '',
// // // // // //         availableSeats: profile.vehicleCapacity || 4,
// // // // // //         conditions: profile.conditions || '',
// // // // // //         facebookProfile: (profile as any).facebookProfile || '',
// // // // // //         instagramProfile: (profile as any).instagramProfile || '',
// // // // // //         tiktokProfile: (profile as any).tiktokProfile || '',
// // // // // //       });
// // // // // //     }
// // // // // //   }, [isOpen, profile, prefill, form]);

// // // // // //   const originCities = useMemo(() => {
// // // // // //     if (!originCountry) return [];
// // // // // //     return activeMarkets.find((m) => m.id === originCountry)?.cities || [];
// // // // // //   }, [activeMarkets, originCountry]);

// // // // // //   const destinationCities = useMemo(() => {
// // // // // //     if (!destinationCountry) return [];
// // // // // //     return activeMarkets.find((m) => m.id === destinationCountry)?.cities || [];
// // // // // //   }, [activeMarkets, destinationCountry]);

// // // // // //   const handleOriginCountryChange = useCallback(
// // // // // //     (val: string) => {
// // // // // //       setOriginCountry(val);
// // // // // //       form.setValue('origin', '');
// // // // // //     },
// // // // // //     [form]
// // // // // //   );

// // // // // //   const handleDestCountryChange = useCallback(
// // // // // //     (val: string) => {
// // // // // //       setDestinationCountry(val);
// // // // // //       form.setValue('destination', '');
// // // // // //     },
// // // // // //     [form]
// // // // // //   );

// // // // // //   const onSubmit = async (data: AddTripFormValues) => {
// // // // // //     if (!firestore || !user || !profile) return;

// // // // // //     // تأكد إن الناقل أكمل الشروط الدائمة والبروفيل قبل إنشاء رحلة
// // // // // //     if (!profile.isPermanentComplete) {
// // // // // //       toast({
// // // // // //         variant: 'destructive',
// // // // // //         title: t('errorProfile'),
// // // // // //         description: t('errorProfileDesc'),
// // // // // //       });
// // // // // //       onOpenChange(false);
// // // // // //       router.push('/carrier/Permanent');
// // // // // //       return;
// // // // // //     }

// // // // // //     if (profile.isPartial || !profile.vehicleType || !profile.vehicleCapacity) {
// // // // // //       toast({
// // // // // //         variant: 'destructive',
// // // // // //         title: t('errorProfile'),
// // // // // //         description: t('errorProfileDesc')
// // // // // //       });
// // // // // //       onOpenChange(false);
// // // // // //       router.push('/carrier/profile');
// // // // // //       return;
// // // // // //     }

// // // // // //     if (profile.currentActiveTripId) {
// // // // // //       try {
// // // // // //         const activeTripRef = doc(firestore, 'trips', profile.currentActiveTripId);
// // // // // //         const activeTripSnap = await getDoc(activeTripRef);

// // // // // //         if (activeTripSnap.exists()) {
// // // // // //           const activeTrip = activeTripSnap.data() as any;

// // // // // //           const depDate = activeTrip.departureDate?.toDate?.()
// // // // // //             ? activeTrip.departureDate.toDate()
// // // // // //             : new Date(activeTrip.departureDate || 0);

// // // // // //           const durationHours = activeTrip.estimatedDurationHours || 0;
// // // // // //           const endDate = new Date(depDate.getTime() + durationHours * 60 * 60 * 1000);
// // // // // //           const hasEnded = endDate < new Date();

// // // // // //           if (hasEnded || activeTrip.status === 'Completed' || activeTrip.status === 'Cancelled') {
// // // // // //             await updateDoc(doc(firestore, 'users', user.uid), {
// // // // // //               currentActiveTripId: null,
// // // // // //               updatedAt: serverTimestamp(),
// // // // // //             });
// // // // // //           } else {
// // // // // //             toast({
// // // // // //               variant: 'destructive',
// // // // // //               title: t('errorActiveTrip'),
// // // // // //               description: t('errorActiveTripDesc')
// // // // // //             });
// // // // // //             return;
// // // // // //           }
// // // // // //         } else {
// // // // // //           await updateDoc(doc(firestore, 'users', user.uid), {
// // // // // //             currentActiveTripId: null,
// // // // // //             updatedAt: serverTimestamp(),
// // // // // //           });
// // // // // //         }
// // // // // //       } catch (e) {
// // // // // //         toast({
// // // // // //           variant: 'destructive',
// // // // // //           title: t('errorVerify'),
// // // // // //           description: t('errorVerifyDesc')
// // // // // //         });
// // // // // //         return;
// // // // // //       }
// // // // // //     }

// // // // // //     setIsSubmitting(true);

// // // // // //     try {
// // // // // //       const combinedDepartureDateTime = combineDateAndTime(data.departureDate, data.departureTime);

// // // // // //       const tripData: any = {
// // // // // //         ...data,
// // // // // //         departureDate: combinedDepartureDateTime.toISOString(),
// // // // // //         userId: user.uid,
// // // // // //         carrierId: user.uid,
// // // // // //         carrierName: profile.firstName,
// // // // // //         vehicleType: profile.vehicleType || 'غير محدد',
// // // // // //         vehiclePlateNumber: profile?.plateNumber || '',
// // // // // //         vehicleCapacity: profile?.vehicleCapacity || 0,
// // // // // //         numberOfStops: profile.numberOfStops ?? 0,
// // // // // //         bagsPerSeat: profile.bagsPerSeat ?? 1,
// // // // // //         vehicleCategory: profile.vehicleCapacity && profile.vehicleCapacity > 7 ? 'bus' : 'small',
// // // // // //         status: 'Planned' as const,
// // // // // //         price: Number(profile.price) || 0,
// // // // // //         currency: profile.currency || 'د.أ',
// // // // // //         depositPercentage: profile.depositPercentage ?? 0,
// // // // // //         createdAt: serverTimestamp(),
// // // // // //         updatedAt: serverTimestamp(),
// // // // // //       };

// // // // // //       // لو الرحلة مرتبطة بطلب مسافر → سجّل العلاقة واحسب المقاعد المتبقية
// // // // // //       if (prefill?.requestId) {
// // // // // //         tripData.linkedRequestId = prefill.requestId;
// // // // // //         const bookedSeats = prefill.passengers || 0;
// // // // // //         const totalCapacity = profile.vehicleCapacity || 4;
// // // // // //         tripData.availableSeats = Math.max(0, totalCapacity - bookedSeats);
// // // // // //         tripData.bookedSeats = bookedSeats;
// // // // // //       }

// // // // // //       delete (tripData as any).departureTime;

// // // // // //       const newTripRef = await addDoc(collection(firestore, 'trips'), tripData);

// // // // // //       const userUpdates: any = {
// // // // // //         currentActiveTripId: newTripRef.id,
// // // // // //         updatedAt: serverTimestamp(),
// // // // // //       };

// // // // // //       if (data.facebookProfile) userUpdates.facebookProfile = data.facebookProfile;
// // // // // //       if (data.instagramProfile) userUpdates.instagramProfile = data.instagramProfile;
// // // // // //       if (data.tiktokProfile) userUpdates.tiktokProfile = data.tiktokProfile;

// // // // // //       await updateDoc(doc(firestore, 'users', user.uid), userUpdates);

// // // // // //       toast({ title: t('successAdd') + ' ✅' });
// // // // // //       onOpenChange(false);
// // // // // //       form.reset();
// // // // // //     } catch (error: any) {
// // // // // //       toast({
// // // // // //         variant: 'destructive',
// // // // // //         title: t('errorAdd'),
// // // // // //         description: error?.message || t('errorAddDesc')
// // // // // //       });
// // // // // //     } finally {
// // // // // //       setIsSubmitting(false);
// // // // // //     }
// // // // // //   };
// // // // // //   return (
// // // // // //     <Dialog open={isOpen} onOpenChange={onOpenChange}>
// // // // // //       <DialogContent className="sm:max-w-3xl">
// // // // // //         <DialogHeader>
// // // // // //           <DialogTitle> {t('title')}</DialogTitle>
// // // // // //           <DialogDescription>
// // // // // //             {t('desc')}
// // // // // //           </DialogDescription>
// // // // // //         </DialogHeader>

// // // // // //         {isExpired ? (
// // // // // //           <div className="p-10 flex flex-col items-center text-center space-y-6 animate-in fade-in zoom-in duration-500 bg-destructive/5 rounded-[2.5rem] border-2 border-destructive/20 my-4">
// // // // // //             <div className="w-20 h-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center shadow-inner">
// // // // // //               <Lock className="w-10 h-10 animate-pulse" />
// // // // // //             </div>

// // // // // //             <div className="space-y-2">
// // // // // //               <h3 className="text-2xl font-black text-foreground tracking-tight uppercase">
// // // // // //                 {t('expiredTitle')}
// // // // // //               </h3>
// // // // // //               <p className="text-sm text-muted-foreground font-bold leading-relaxed max-w-sm mx-auto  ">
// // // // // //                 {t('expiredDesc')}
// // // // // //               </p>
// // // // // //             </div>

// // // // // //             <Button
// // // // // //               className="w-full h-14 rounded-2xl bg-primary text-black font-black text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
// // // // // //               onClick={() => router.push('/carrier/Permanent')}
// // // // // //             >
// // // // // //               {t('expiredBtn')}
// // // // // //             </Button>
// // // // // //           </div>
// // // // // //         ) : (
// // // // // //           <Form {...form}>
// // // // // //             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

// // // // // //               {/* ── بانر معلومات الطلب (يظهر فقط لو الديالوج اتفتح من حجز مسافر) ── */}
// // // // // //               {prefill?.requestId && (
// // // // // //                 <div className="bg-primary/10 border border-primary/30 rounded-xl p-3 flex items-start gap-3 text-sm">
// // // // // //                   <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
// // // // // //                   <div>
// // // // // //                     <p className="font-bold text-foreground">رحلة مرتبطة بطلب مسافر</p>
// // // // // //                     <p className="text-muted-foreground">
// // // // // //                       المسار: {prefill.origin || '—'} ← {prefill.destination || '—'}
// // // // // //                       {prefill.passengers ? ` · ${prefill.passengers} مقعد محجوز مسبقاً` : ''}
// // // // // //                     </p>
// // // // // //                   </div>
// // // // // //                 </div>
// // // // // //               )}

// // // // // //               <Card className="bg-muted/30 border-accent/20">
// // // // // //                 <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
// // // // // //                   <div className="space-y-2">
// // // // // //                     <Label className="flex items-center gap-2 font-bold text-accent">
// // // // // //                       <PlaneTakeoff className="h-4 w-4" /> {t('from')}
// // // // // //                     </Label>

// // // // // //                     <Select
// // // // // //                       onValueChange={handleOriginCountryChange}
// // // // // //                       value={originCountry}
// // // // // //                       disabled={isLoadingMarkets}
// // // // // //                     >
// // // // // //                       <SelectTrigger className="bg-background">
// // // // // //                         <SelectValue placeholder={t('originCountry')} />
// // // // // //                       </SelectTrigger>
// // // // // //                       <SelectContent>
// // // // // //                         {activeMarkets.map((m) => (
// // // // // //                           <SelectItem key={m.id} value={m.id}>
// // // // // //                             {m.name}
// // // // // //                           </SelectItem>
// // // // // //                         ))}
// // // // // //                       </SelectContent>
// // // // // //                     </Select>

// // // // // //                     <FormField
// // // // // //                       control={form.control}
// // // // // //                       name="origin"
// // // // // //                       render={({ field }) => (
// // // // // //                         <FormItem>
// // // // // //                           <FormControl>
// // // // // //                             <Select
// // // // // //                               onValueChange={field.onChange}
// // // // // //                               value={field.value}
// // // // // //                               disabled={!originCountry}
// // // // // //                             >
// // // // // //                               <SelectTrigger className="bg-background">
// // // // // //                                 <SelectValue placeholder={t('originCity')} />
// // // // // //                               </SelectTrigger>
// // // // // //                               <SelectContent>
// // // // // //                                 {originCities.map((cityKey) => (
// // // // // //                                   <SelectItem key={cityKey} value={cityKey}>
// // // // // //                                     {getCityName(cityKey, locale)}
// // // // // //                                   </SelectItem>
// // // // // //                                 ))}
// // // // // //                               </SelectContent>
// // // // // //                             </Select>
// // // // // //                           </FormControl>
// // // // // //                           <FormMessage />
// // // // // //                         </FormItem>
// // // // // //                       )}
// // // // // //                     />
// // // // // //                   </div>

// // // // // //                   <div className="space-y-2">
// // // // // //                     <Label className="flex items-center gap-2 font-bold text-accent">
// // // // // //                       <PlaneLanding className="h-4 w-4" />{t('to')}
// // // // // //                     </Label>

// // // // // //                     <Select
// // // // // //                       onValueChange={handleDestCountryChange}
// // // // // //                       value={destinationCountry}
// // // // // //                       disabled={isLoadingMarkets}
// // // // // //                     >
// // // // // //                       <SelectTrigger className="bg-background">
// // // // // //                         <SelectValue placeholder={t('destinationCountry')} />
// // // // // //                       </SelectTrigger>
// // // // // //                       <SelectContent>
// // // // // //                         {activeMarkets
// // // // // //                           .filter((m) => m.id !== originCountry)
// // // // // //                           .map((m) => (
// // // // // //                             <SelectItem key={m.id} value={m.id}>
// // // // // //                               {m.name}
// // // // // //                             </SelectItem>
// // // // // //                           ))}
// // // // // //                       </SelectContent>
// // // // // //                     </Select>

// // // // // //                     <FormField
// // // // // //                       control={form.control}
// // // // // //                       name="destination"
// // // // // //                       render={({ field }) => (
// // // // // //                         <FormItem>
// // // // // //                           <FormControl>
// // // // // //                             <Select
// // // // // //                               onValueChange={field.onChange}
// // // // // //                               value={field.value}
// // // // // //                               disabled={!destinationCountry}
// // // // // //                             >
// // // // // //                               <SelectTrigger className="bg-background">
// // // // // //                                 <SelectValue placeholder={t('destinationCity')} />
// // // // // //                               </SelectTrigger>
// // // // // //                               <SelectContent>
// // // // // //                                 {destinationCities.map((cityKey) => (
// // // // // //                                   <SelectItem key={cityKey} value={cityKey}>
// // // // // //                                     {getCityName(cityKey, locale)}
// // // // // //                                   </SelectItem>
// // // // // //                                 ))}
// // // // // //                               </SelectContent>
// // // // // //                             </Select>
// // // // // //                           </FormControl>
// // // // // //                           <FormMessage />
// // // // // //                         </FormItem>
// // // // // //                       )}
// // // // // //                     />
// // // // // //                   </div>
// // // // // //                 </CardContent>
// // // // // //               </Card>

// // // // // //               <Accordion type="single" collapsible className="w-full" defaultValue="social">
// // // // // //                 <AccordionItem value="social" className="border rounded-lg bg-primary/5 border-primary/20">
// // // // // //                   <AccordionTrigger className="p-4 font-black text-sm hover:no-underline text-primary">
// // // // // //                     <div className="flex items-center gap-2">
// // // // // //                       <ShieldCheck className="h-4 w-4" />
// // // // // //                       {t('social')}
// // // // // //                     </div>
// // // // // //                   </AccordionTrigger>

// // // // // //                   <AccordionContent className="p-4 pt-0 space-y-4">
// // // // // //                     <div className="bg-background/50 p-3 rounded-xl border border-dashed border-primary/20 flex gap-2 items-start mb-4">
// // // // // //                       <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
// // // // // //                       <p className="text-[10px] leading-relaxed text-muted-foreground">
// // // // // //                         {t('socialInfo')}
// // // // // //                       </p>
// // // // // //                     </div>

// // // // // //                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// // // // // //                       <FormField
// // // // // //                         control={form.control}
// // // // // //                         name="facebookProfile"
// // // // // //                         render={({ field }) => (
// // // // // //                           <FormItem>
// // // // // //                             <FormLabel className="flex items-center gap-1 text-[10px] font-black">
// // // // // //                               <Facebook className="h-3 w-3 text-blue-600" /> {t('facebook')}
// // // // // //                             </FormLabel>
// // // // // //                             <FormControl>
// // // // // //                               <Input
// // // // // //                                 placeholder="https://facebook.com/..."
// // // // // //                                 className="bg-card text-[10px] ltr"
// // // // // //                                 {...field}
// // // // // //                               />
// // // // // //                             </FormControl>
// // // // // //                             <FormMessage />
// // // // // //                           </FormItem>
// // // // // //                         )}
// // // // // //                       />

// // // // // //                       <FormField
// // // // // //                         control={form.control}
// // // // // //                         name="instagramProfile"
// // // // // //                         render={({ field }) => (
// // // // // //                           <FormItem>
// // // // // //                             <FormLabel className="flex items-center gap-1 text-[10px] font-black">
// // // // // //                               <Instagram className="h-3 w-3 text-pink-600" /> {t('instagram')}
// // // // // //                             </FormLabel>
// // // // // //                             <FormControl>
// // // // // //                               <Input
// // // // // //                                 placeholder="https://instagram.com/..."
// // // // // //                                 className="bg-card text-[10px] ltr"
// // // // // //                                 {...field}
// // // // // //                               />
// // // // // //                             </FormControl>
// // // // // //                             <FormMessage />
// // // // // //                           </FormItem>
// // // // // //                         )}
// // // // // //                       />

// // // // // //                       <FormField
// // // // // //                         control={form.control}
// // // // // //                         name="tiktokProfile"
// // // // // //                         render={({ field }) => (
// // // // // //                           <FormItem>
// // // // // //                             <FormLabel className="flex items-center gap-1 text-[10px] font-black">
// // // // // //                               <Video className="h-3 w-3 text-foreground" /> {t('tiktok')}
// // // // // //                             </FormLabel>
// // // // // //                             <FormControl>
// // // // // //                               <Input
// // // // // //                                 placeholder="https://tiktok.com/@..."
// // // // // //                                 className="bg-card text-[10px] ltr"
// // // // // //                                 {...field}
// // // // // //                               />
// // // // // //                             </FormControl>
// // // // // //                             <FormMessage />
// // // // // //                           </FormItem>
// // // // // //                         )}
// // // // // //                       />
// // // // // //                     </div>
// // // // // //                   </AccordionContent>
// // // // // //                 </AccordionItem>

// // // // // //                 <AccordionItem value="details" className="border rounded-lg bg-muted/30 mt-4">
// // // // // //                   <AccordionTrigger className="p-4 font-semibold text-sm hover:no-underline">
// // // // // //                     <div className="flex items-center gap-2">
// // // // // //                       <Settings className="h-4 w-4" />
// // // // // //                       {t('details')}
// // // // // //                     </div>
// // // // // //                   </AccordionTrigger>

// // // // // //                   <AccordionContent className="p-4 pt-0 space-y-4">
// // // // // //                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // // // // //                       {/* <FormField
// // // // // //                         control={form.control}
// // // // // //                         name="departureDate"
// // // // // //                         render={({ field }) => (
// // // // // //                           <FormItem className="flex flex-col">
// // // // // //                             <FormLabel>{t('departureDate')}</FormLabel>
// // // // // //                             <FormControl>
// // // // // //                               <div className="relative">
// // // // // //                                 <Input
// // // // // //                                   type="date"
// // // // // //                                   className="bg-card block w-full pl-10"
// // // // // //                                   {...field}
// // // // // //                                   value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
// // // // // //                                   onChange={(e) =>
// // // // // //                                     field.onChange(e.target.value ? new Date(e.target.value) : undefined)
// // // // // //                                   }
// // // // // //                                   min={new Date().toISOString().split('T')[0]}
// // // // // //                                 />
// // // // // //                                 <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
// // // // // //                               </div>
// // // // // //                             </FormControl>
// // // // // //                             <FormMessage />
// // // // // //                           </FormItem>
// // // // // //                         )}
// // // // // //                       /> */}
// // // // // //                       <FormField
// // // // // //                         control={form.control}
// // // // // //                         name="departureDate"
// // // // // //                         render={({ field }) => (
// // // // // //                           <FormItem className="flex flex-col">
// // // // // //                             <FormLabel>{t('departureDate')}</FormLabel>
// // // // // //                             <FormControl>
// // // // // //                               <div className="relative">
// // // // // //                                 <Input
// // // // // //                                   type="date"
// // // // // //                                   className="bg-card block w-full pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
// // // // // //                                   {...field}
// // // // // //                                   value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
// // // // // //                                   onChange={(e) =>
// // // // // //                                     field.onChange(e.target.value ? new Date(e.target.value) : undefined)
// // // // // //                                   }
// // // // // //                                   min={new Date().toISOString().split('T')[0]}
// // // // // //                                 />
// // // // // //                                 <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-primary cursor-pointer" />
// // // // // //                               </div>
// // // // // //                             </FormControl>
// // // // // //                             <FormMessage />
// // // // // //                           </FormItem>
// // // // // //                         )}
// // // // // //                       />
// // // // // //                       {/* <FormField
// // // // // //                         control={form.control}
// // // // // //                         name="departureTime"
// // // // // //                         render={({ field }) => (
// // // // // //                           <FormItem className="flex flex-col">
// // // // // //                             <FormLabel>{t('departureTime')}</FormLabel>
// // // // // //                             <FormControl>
// // // // // //                               <Input type="time" className="bg-card" {...field} />
// // // // // //                             </FormControl>
// // // // // //                             <FormMessage />
// // // // // //                           </FormItem>
// // // // // //                         )}
// // // // // //                       /> */}
// // // // // //                       <FormField
// // // // // //                         control={form.control}
// // // // // //                         name="departureTime"
// // // // // //                         render={({ field }) => (
// // // // // //                           <FormItem className="flex flex-col">
// // // // // //                             <FormLabel>{t('departureTime')}</FormLabel>
// // // // // //                             <FormControl>
// // // // // //                               <div className="relative">
// // // // // //                                 <Input
// // // // // //                                   type="time"
// // // // // //                                   className="bg-card pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
// // // // // //                                   {...field}
// // // // // //                                 />
// // // // // //                                 <Clock className="absolute right-3 top-2.5 h-4 w-4 text-primary pointer-events-none" />
// // // // // //                               </div>
// // // // // //                             </FormControl>
// // // // // //                             <FormMessage />
// // // // // //                           </FormItem>
// // // // // //                         )}
// // // // // //                       />
// // // // // //                     </div>

// // // // // //                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // // // // //                       <FormField
// // // // // //                         control={form.control}
// // // // // //                         name="availableSeats"
// // // // // //                         render={({ field }) => (
// // // // // //                           <FormItem>
// // // // // //                             <FormLabel>{t('availableSeats')}</FormLabel>
// // // // // //                             <FormControl>
// // // // // //                               <Input className="bg-card" type="number" {...field} />
// // // // // //                             </FormControl>
// // // // // //                             <FormMessage />
// // // // // //                           </FormItem>
// // // // // //                         )}
// // // // // //                       />

// // // // // //                       <FormField
// // // // // //                         control={form.control}
// // // // // //                         name="estimatedDurationHours"
// // // // // //                         render={({ field }) => (
// // // // // //                           <FormItem>
// // // // // //                             <FormLabel className="flex items-center gap-1">
// // // // // //                               <Clock className="h-4 w-4 text-primary font-bold" />
// // // // // //                               {t('duration')}
// // // // // //                             </FormLabel>
// // // // // //                             <FormControl>
// // // // // //                               <Input className="bg-card border-primary/50" type="number" {...field} />
// // // // // //                             </FormControl>
// // // // // //                             <p className="text-[10px] text-muted-foreground">
// // // // // //                               {t('ticketTravel')}
// // // // // //                             </p>
// // // // // //                             <FormMessage />
// // // // // //                           </FormItem>
// // // // // //                         )}
// // // // // //                       />
// // // // // //                     </div>

// // // // // //                     <FormField
// // // // // //                       control={form.control}
// // // // // //                       name="meetingPoint"
// // // // // //                       render={({ field }) => (
// // // // // //                         <FormItem>
// // // // // //                           <FormLabel className="flex items-center gap-1">
// // // // // //                             <MapPin className="h-4 w-4" />
// // // // // //                             {t('meetingPoint')}
// // // // // //                           </FormLabel>
// // // // // //                           <FormControl>
// // // // // //                             <Input className="bg-card" placeholder={t('meetingPointPlaceholder')} {...field} />
// // // // // //                           </FormControl>
// // // // // //                           <FormMessage />
// // // // // //                         </FormItem>
// // // // // //                       )}
// // // // // //                     />

// // // // // //                     <FormField
// // // // // //                       control={form.control}
// // // // // //                       name="meetingPointLink"
// // // // // //                       render={({ field }) => (
// // // // // //                         <FormItem>
// // // // // //                           <FormLabel className="flex items-center gap-1">
// // // // // //                             <MapPin className="h-4 w-4" />
// // // // // //                             {t('linkLocation')}
// // // // // //                           </FormLabel>
// // // // // //                           <FormControl>
// // // // // //                             <Input
// // // // // //                               className="bg-card ltr text-sm"
// // // // // //                               placeholder="https://maps.google.com/..."
// // // // // //                               {...field}
// // // // // //                             />
// // // // // //                           </FormControl>
// // // // // //                           <p className="text-[10px] text-muted-foreground flex items-center gap-1">
// // // // // //                             <MapPin className="h-3 w-3" />
// // // // // //                             {t('linkDec')}
// // // // // //                           </p>
// // // // // //                           <FormMessage />
// // // // // //                         </FormItem>
// // // // // //                       )}
// // // // // //                     />
// // // // // //                   </AccordionContent>
// // // // // //                 </AccordionItem>
// // // // // //               </Accordion>

// // // // // //               <DialogFooter className="gap-2 sm:gap-0 pt-4">
// // // // // //                 <Button
// // // // // //                   type="button"
// // // // // //                   variant="secondary"
// // // // // //                   onClick={() => onOpenChange(false)}
// // // // // //                   disabled={isSubmitting}
// // // // // //                 >
// // // // // //                   {t('cancel')}
// // // // // //                 </Button>

// // // // // //                 <Button
// // // // // //                   type="submit"
// // // // // //                   disabled={isSubmitting}
// // // // // //                   className="font-black text-sm rounded-2xl shadow-md"
// // // // // //                 >
// // // // // //                   {isSubmitting ? (
// // // // // //                     <>
// // // // // //                       <Loader2 className="ml-2 h-5 w-5 animate-spin" />
// // // // // //                       {t('submitting')}
// // // // // //                     </>
// // // // // //                   ) : (
// // // // // //                     <>
// // // // // //                       <Send className="ml-2 h-5 w-5" />
// // // // // //                       {t('submit')}
// // // // // //                     </>
// // // // // //                   )}
// // // // // //                 </Button>
// // // // // //               </DialogFooter>
// // // // // //             </form>
// // // // // //           </Form>
// // // // // //         )}
// // // // // //       </DialogContent>
// // // // // //     </Dialog>
// // // // // //   );
// // // // // // }
// // // // // 'use client';

// // // // // import { useState, useMemo, useEffect, useCallback } from 'react';
// // // // // import { useForm } from 'react-hook-form';
// // // // // import { zodResolver } from '@hookform/resolvers/zod';
// // // // // import { z } from 'zod';
// // // // // import {
// // // // //   Dialog,
// // // // //   DialogContent,
// // // // //   DialogHeader,
// // // // //   DialogTitle,
// // // // //   DialogDescription,
// // // // //   DialogFooter,
// // // // // } from '@/components/ui/dialog';
// // // // // import {
// // // // //   Form,
// // // // //   FormControl,
// // // // //   FormField,
// // // // //   FormItem,
// // // // //   FormLabel,
// // // // //   FormMessage,
// // // // // } from '@/components/ui/form';
// // // // // import { Button } from '@/components/ui/button';
// // // // // import { Input } from '@/components/ui/input';
// // // // // import {
// // // // //   Select,
// // // // //   SelectContent,
// // // // //   SelectItem,
// // // // //   SelectTrigger,
// // // // //   SelectValue,
// // // // // } from '@/components/ui/select';
// // // // // import { Card, CardContent } from '@/components/ui/card';
// // // // // import { useToast } from '@/hooks/use-toast';
// // // // // import { useFirestore, useUser } from '@/firebase';
// // // // // import { useUserProfile } from '@/hooks/use-user-profile';
// // // // // import { collection, serverTimestamp, doc, updateDoc, addDoc, getDoc } from 'firebase/firestore';
// // // // // import { FirebaseError } from 'firebase/app';
// // // // // import {
// // // // //   Loader2,
// // // // //   Send,
// // // // //   Clock,
// // // // //   PlaneTakeoff,
// // // // //   PlaneLanding,
// // // // //   Settings,
// // // // //   MapPin,
// // // // //   Calendar as CalendarIcon,
// // // // //   Lock,
// // // // //   Facebook,
// // // // //   Instagram,
// // // // //   Video,
// // // // //   Info,
// // // // //   ShieldCheck,
// // // // // } from 'lucide-react';
// // // // // import { format } from 'date-fns';
// // // // // import { Label } from '@/components/ui/label';
// // // // // import {
// // // // //   Accordion,
// // // // //   AccordionContent,
// // // // //   AccordionItem,
// // // // //   AccordionTrigger,
// // // // // } from '@/components/ui/accordion';
// // // // // import { getCityName } from '@/lib/constants';
// // // // // import { combineDateAndTime } from '@/lib/formatters';
// // // // // import { useLocale, useTranslations } from 'next-intl';
// // // // // import { useActiveMarkets } from '@/hooks/use-active-markets';
// // // // // import { useRouter } from '@/i18n/routing';
// // // // // import { useCarrierStatus } from '@/hooks/use-carrier-status';

// // // // // const addTripSchema = z.object({
// // // // //   origin: z.string().min(1, 'مدينة الانطلاق مطلوبة'),
// // // // //   destination: z.string().min(1, 'مدينة الوصول مطلوبة'),
// // // // //   departureDate: z.date({ required_error: 'تاريخ المغادرة مطلوب' }),
// // // // //   departureTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
// // // // //     message: 'الرجاء إدخل وقت صالح (صيغة 24 ساعة HH:MM)',
// // // // //   }),
// // // // //   meetingPoint: z.string().min(3, 'نقطة التجمع مطلوبة'),
// // // // //   meetingPointLink: z.string().url('الرجاء إدخال رابط خرائط جوجل صالح').min(1, 'رابط الموقع على الخريطة مطلوب'),
// // // // //   availableSeats: z.coerce.number().int().min(1, 'يجب توفر مقعد واحد على الأقل'),
// // // // //   estimatedDurationHours: z.coerce.number().int().min(1, 'مدة الرحلة التقديرية إجبارية'),
// // // // //   conditions: z.string().max(200, 'الشروط يجب ألا تتجاوز 200 حرف').optional(),
// // // // //   facebookProfile: z.string().url('رابط فيسبوك غير صالح').optional().or(z.literal('')),
// // // // //   instagramProfile: z.string().url('رابط إنستغرام غير صالح').optional().or(z.literal('')),
// // // // //   tiktokProfile: z.string().url('رابط تيك توك غير صالح').optional().or(z.literal('')),
// // // // // });

// // // // // type AddTripFormValues = z.infer<typeof addTripSchema>;

// // // // // interface AddTripDialogProps {
// // // // //   isOpen: boolean;
// // // // //   onOpenChange: (isOpen: boolean) => void;
// // // // //   /** بيانات مسبقة من طلب المسافر لتعبئة الرحلة أوتوماتيك */
// // // // //   prefill?: {
// // // // //     origin?: string;
// // // // //     originCountry?: string;
// // // // //     destination?: string;
// // // // //     destinationCountry?: string;
// // // // //     departureDate?: Date;
// // // // //     passengers?: number;
// // // // //     requestId?: string;
// // // // //   };
// // // // //   /** callback بعد إنشاء الرحلة — يُستخدم لربط الـ booking بالرحلة الجديدة */
// // // // //   onTripCreated?: (newTripId: string) => Promise<void>;
// // // // // }

// // // // // export function AddTripDialog({ isOpen, onOpenChange, prefill, onTripCreated }: AddTripDialogProps) {
// // // // //   const { toast } = useToast();
// // // // //   const firestore = useFirestore();
// // // // //   const { user } = useUser();
// // // // //   const { profile } = useUserProfile();
// // // // //   const router = useRouter();
// // // // //   const [isSubmitting, setIsSubmitting] = useState(false);
// // // // //   const locale = useLocale();
// // // // //   const { activeMarkets, isLoading: isLoadingMarkets } = useActiveMarkets();
// // // // //   const { isExpired } = useCarrierStatus(profile?.expiryDate);
// // // // //   const t = useTranslations('addTripDialog');
// // // // //   const [originCountry, setOriginCountry] = useState('');
// // // // //   const [destinationCountry, setDestinationCountry] = useState('');

// // // // //   const form = useForm<AddTripFormValues>({
// // // // //     resolver: zodResolver(addTripSchema),
// // // // //     defaultValues: {
// // // // //       origin: '',
// // // // //       destination: '',
// // // // //       departureTime: '',
// // // // //       meetingPoint: '',
// // // // //       meetingPointLink: '',
// // // // //       availableSeats: 4,
// // // // //       estimatedDurationHours: 3,
// // // // //       conditions: '',
// // // // //       facebookProfile: '',
// // // // //       instagramProfile: '',
// // // // //       tiktokProfile: '',
// // // // //     },
// // // // //   });

// // // // //   useEffect(() => {
// // // // //     if (isOpen && profile) {
// // // // //       // الأولوية للـ prefill (من طلب المسافر)، وإلا من jurisdiction الناقل
// // // // //       const originC = prefill?.originCountry || profile.jurisdiction?.origin || '';
// // // // //       const destC = prefill?.destinationCountry || profile.jurisdiction?.destination || '';
// // // // //       if (originC) setOriginCountry(originC);
// // // // //       if (destC) setDestinationCountry(destC);

// // // // //       form.reset({
// // // // //         origin: prefill?.origin || '',
// // // // //         destination: prefill?.destination || '',
// // // // //         estimatedDurationHours: 3,
// // // // //         departureDate: prefill?.departureDate || undefined,
// // // // //         departureTime: '',
// // // // //         meetingPoint: profile.conditions ? '' : '',
// // // // //         meetingPointLink: '',
// // // // //         availableSeats: profile.vehicleCapacity || 4,
// // // // //         conditions: profile.conditions || '',
// // // // //         facebookProfile: (profile as any).facebookProfile || '',
// // // // //         instagramProfile: (profile as any).instagramProfile || '',
// // // // //         tiktokProfile: (profile as any).tiktokProfile || '',
// // // // //       });
// // // // //     }
// // // // //   }, [isOpen, profile, prefill, form]);

// // // // //   const originCities = useMemo(() => {
// // // // //     if (!originCountry) return [];
// // // // //     return activeMarkets.find((m) => m.id === originCountry)?.cities || [];
// // // // //   }, [activeMarkets, originCountry]);

// // // // //   const destinationCities = useMemo(() => {
// // // // //     if (!destinationCountry) return [];
// // // // //     return activeMarkets.find((m) => m.id === destinationCountry)?.cities || [];
// // // // //   }, [activeMarkets, destinationCountry]);

// // // // //   const handleOriginCountryChange = useCallback(
// // // // //     (val: string) => {
// // // // //       setOriginCountry(val);
// // // // //       form.setValue('origin', '');
// // // // //     },
// // // // //     [form]
// // // // //   );

// // // // //   const handleDestCountryChange = useCallback(
// // // // //     (val: string) => {
// // // // //       setDestinationCountry(val);
// // // // //       form.setValue('destination', '');
// // // // //     },
// // // // //     [form]
// // // // //   );

// // // // //   const onSubmit = async (data: AddTripFormValues) => {
// // // // //     if (!firestore || !user || !profile) return;

// // // // //     // تأكد إن الناقل أكمل الشروط الدائمة والبروفيل قبل إنشاء رحلة
// // // // //     if (!profile.isPermanentComplete) {
// // // // //       toast({
// // // // //         variant: 'destructive',
// // // // //         title: t('errorProfile'),
// // // // //         description: t('errorProfileDesc'),
// // // // //       });
// // // // //       onOpenChange(false);
// // // // //       router.push('/carrier/Permanent');
// // // // //       return;
// // // // //     }

// // // // //     if (profile.isPartial || !profile.vehicleType || !profile.vehicleCapacity) {
// // // // //       toast({
// // // // //         variant: 'destructive',
// // // // //         title: t('errorProfile'),
// // // // //         description: t('errorProfileDesc')
// // // // //       });
// // // // //       onOpenChange(false);
// // // // //       router.push('/carrier/profile');
// // // // //       return;
// // // // //     }

// // // // //     if (profile.currentActiveTripId) {
// // // // //       try {
// // // // //         const activeTripRef = doc(firestore, 'trips', profile.currentActiveTripId);
// // // // //         const activeTripSnap = await getDoc(activeTripRef);

// // // // //         if (activeTripSnap.exists()) {
// // // // //           const activeTrip = activeTripSnap.data() as any;

// // // // //           const depDate = activeTrip.departureDate?.toDate?.()
// // // // //             ? activeTrip.departureDate.toDate()
// // // // //             : new Date(activeTrip.departureDate || 0);

// // // // //           const durationHours = activeTrip.estimatedDurationHours || 0;
// // // // //           const endDate = new Date(depDate.getTime() + durationHours * 60 * 60 * 1000);
// // // // //           const hasEnded = endDate < new Date();

// // // // //           if (hasEnded || activeTrip.status === 'Completed' || activeTrip.status === 'Cancelled') {
// // // // //             await updateDoc(doc(firestore, 'users', user.uid), {
// // // // //               currentActiveTripId: null,
// // // // //               updatedAt: serverTimestamp(),
// // // // //             });
// // // // //           } else {
// // // // //             toast({
// // // // //               variant: 'destructive',
// // // // //               title: t('errorActiveTrip'),
// // // // //               description: t('errorActiveTripDesc')
// // // // //             });
// // // // //             return;
// // // // //           }
// // // // //         } else {
// // // // //           await updateDoc(doc(firestore, 'users', user.uid), {
// // // // //             currentActiveTripId: null,
// // // // //             updatedAt: serverTimestamp(),
// // // // //           });
// // // // //         }
// // // // //       } catch (e) {
// // // // //         toast({
// // // // //           variant: 'destructive',
// // // // //           title: t('errorVerify'),
// // // // //           description: t('errorVerifyDesc')
// // // // //         });
// // // // //         return;
// // // // //       }
// // // // //     }

// // // // //     setIsSubmitting(true);

// // // // //     try {
// // // // //       const combinedDepartureDateTime = combineDateAndTime(data.departureDate, data.departureTime);

// // // // //       const tripData: any = {
// // // // //         ...data,
// // // // //         departureDate: combinedDepartureDateTime.toISOString(),
// // // // //         userId: user.uid,
// // // // //         carrierId: user.uid,
// // // // //         carrierName: profile.firstName,
// // // // //         vehicleType: profile.vehicleType || 'غير محدد',
// // // // //         vehiclePlateNumber: profile?.plateNumber || '',
// // // // //         vehicleCapacity: profile?.vehicleCapacity || 0,
// // // // //         numberOfStops: profile.numberOfStops ?? 0,
// // // // //         bagsPerSeat: profile.bagsPerSeat ?? 1,
// // // // //         vehicleCategory: profile.vehicleCapacity && profile.vehicleCapacity > 7 ? 'bus' : 'small',
// // // // //         status: 'Planned' as const,
// // // // //         price: Number(profile.price) || 0,
// // // // //         currency: profile.currency || 'د.أ',
// // // // //         depositPercentage: profile.depositPercentage ?? 0,
// // // // //         createdAt: serverTimestamp(),
// // // // //         updatedAt: serverTimestamp(),
// // // // //       };

// // // // //       // لو الرحلة مرتبطة بطلب مسافر → سجّل العلاقة واحسب المقاعد المتبقية
// // // // //       if (prefill?.requestId) {
// // // // //         tripData.linkedRequestId = prefill.requestId;
// // // // //         const bookedSeats = prefill.passengers || 0;
// // // // //         const totalCapacity = profile.vehicleCapacity || 4;
// // // // //         tripData.availableSeats = Math.max(0, totalCapacity - bookedSeats);
// // // // //         tripData.bookedSeats = bookedSeats;
// // // // //       }

// // // // //       delete (tripData as any).departureTime;

// // // // //       const newTripRef = await addDoc(collection(firestore, 'trips'), tripData);

// // // // //       const userUpdates: any = {
// // // // //         currentActiveTripId: newTripRef.id,
// // // // //         updatedAt: serverTimestamp(),
// // // // //       };

// // // // //       if (data.facebookProfile) userUpdates.facebookProfile = data.facebookProfile;
// // // // //       if (data.instagramProfile) userUpdates.instagramProfile = data.instagramProfile;
// // // // //       if (data.tiktokProfile) userUpdates.tiktokProfile = data.tiktokProfile;

// // // // //       await updateDoc(doc(firestore, 'users', user.uid), userUpdates);

// // // // //       // لو في callback (من booking-action-card) → استدعيه لربط الرحلة بالحجز
// // // // //       if (onTripCreated) {
// // // // //         await onTripCreated(newTripRef.id);
// // // // //       }

// // // // //       toast({ title: t('successAdd') + ' ✅' });
// // // // //       onOpenChange(false);
// // // // //       form.reset();
// // // // //     } catch (error: any) {
// // // // //       toast({
// // // // //         variant: 'destructive',
// // // // //         title: t('errorAdd'),
// // // // //         description: error?.message || t('errorAddDesc')
// // // // //       });
// // // // //     } finally {
// // // // //       setIsSubmitting(false);
// // // // //     }
// // // // //   };
// // // // //   return (
// // // // //     <Dialog open={isOpen} onOpenChange={onOpenChange}>
// // // // //       <DialogContent className="sm:max-w-3xl">
// // // // //         <DialogHeader>
// // // // //           <DialogTitle> {t('title')}</DialogTitle>
// // // // //           <DialogDescription>
// // // // //             {t('desc')}
// // // // //           </DialogDescription>
// // // // //         </DialogHeader>

// // // // //         {isExpired ? (
// // // // //           <div className="p-10 flex flex-col items-center text-center space-y-6 animate-in fade-in zoom-in duration-500 bg-destructive/5 rounded-[2.5rem] border-2 border-destructive/20 my-4">
// // // // //             <div className="w-20 h-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center shadow-inner">
// // // // //               <Lock className="w-10 h-10 animate-pulse" />
// // // // //             </div>

// // // // //             <div className="space-y-2">
// // // // //               <h3 className="text-2xl font-black text-foreground tracking-tight uppercase">
// // // // //                 {t('expiredTitle')}
// // // // //               </h3>
// // // // //               <p className="text-sm text-muted-foreground font-bold leading-relaxed max-w-sm mx-auto  ">
// // // // //                 {t('expiredDesc')}
// // // // //               </p>
// // // // //             </div>

// // // // //             <Button
// // // // //               className="w-full h-14 rounded-2xl bg-primary text-black font-black text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
// // // // //               onClick={() => router.push('/carrier/Permanent')}
// // // // //             >
// // // // //               {t('expiredBtn')}
// // // // //             </Button>
// // // // //           </div>
// // // // //         ) : (
// // // // //           <Form {...form}>
// // // // //             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

// // // // //               {/* ── بانر معلومات الطلب (يظهر فقط لو الديالوج اتفتح من حجز مسافر) ── */}
// // // // //               {prefill?.requestId && (
// // // // //                 <div className="bg-primary/10 border border-primary/30 rounded-xl p-3 flex items-start gap-3 text-sm">
// // // // //                   <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
// // // // //                   <div>
// // // // //                     <p className="font-bold text-foreground">رحلة مرتبطة بطلب مسافر</p>
// // // // //                     <p className="text-muted-foreground">
// // // // //                       المسار: {prefill.origin || '—'} ← {prefill.destination || '—'}
// // // // //                       {prefill.passengers ? ` · ${prefill.passengers} مقعد محجوز مسبقاً` : ''}
// // // // //                     </p>
// // // // //                   </div>
// // // // //                 </div>
// // // // //               )}

// // // // //               <Card className="bg-muted/30 border-accent/20">
// // // // //                 <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
// // // // //                   <div className="space-y-2">
// // // // //                     <Label className="flex items-center gap-2 font-bold text-accent">
// // // // //                       <PlaneTakeoff className="h-4 w-4" /> {t('from')}
// // // // //                     </Label>

// // // // //                     <Select
// // // // //                       onValueChange={handleOriginCountryChange}
// // // // //                       value={originCountry}
// // // // //                       disabled={isLoadingMarkets}
// // // // //                     >
// // // // //                       <SelectTrigger className="bg-background">
// // // // //                         <SelectValue placeholder={t('originCountry')} />
// // // // //                       </SelectTrigger>
// // // // //                       <SelectContent>
// // // // //                         {activeMarkets.map((m) => (
// // // // //                           <SelectItem key={m.id} value={m.id}>
// // // // //                             {m.name}
// // // // //                           </SelectItem>
// // // // //                         ))}
// // // // //                       </SelectContent>
// // // // //                     </Select>

// // // // //                     <FormField
// // // // //                       control={form.control}
// // // // //                       name="origin"
// // // // //                       render={({ field }) => (
// // // // //                         <FormItem>
// // // // //                           <FormControl>
// // // // //                             <Select
// // // // //                               onValueChange={field.onChange}
// // // // //                               value={field.value}
// // // // //                               disabled={!originCountry}
// // // // //                             >
// // // // //                               <SelectTrigger className="bg-background">
// // // // //                                 <SelectValue placeholder={t('originCity')} />
// // // // //                               </SelectTrigger>
// // // // //                               <SelectContent>
// // // // //                                 {originCities.map((cityKey) => (
// // // // //                                   <SelectItem key={cityKey} value={cityKey}>
// // // // //                                     {getCityName(cityKey, locale)}
// // // // //                                   </SelectItem>
// // // // //                                 ))}
// // // // //                               </SelectContent>
// // // // //                             </Select>
// // // // //                           </FormControl>
// // // // //                           <FormMessage />
// // // // //                         </FormItem>
// // // // //                       )}
// // // // //                     />
// // // // //                   </div>

// // // // //                   <div className="space-y-2">
// // // // //                     <Label className="flex items-center gap-2 font-bold text-accent">
// // // // //                       <PlaneLanding className="h-4 w-4" />{t('to')}
// // // // //                     </Label>

// // // // //                     <Select
// // // // //                       onValueChange={handleDestCountryChange}
// // // // //                       value={destinationCountry}
// // // // //                       disabled={isLoadingMarkets}
// // // // //                     >
// // // // //                       <SelectTrigger className="bg-background">
// // // // //                         <SelectValue placeholder={t('destinationCountry')} />
// // // // //                       </SelectTrigger>
// // // // //                       <SelectContent>
// // // // //                         {activeMarkets
// // // // //                           .filter((m) => m.id !== originCountry)
// // // // //                           .map((m) => (
// // // // //                             <SelectItem key={m.id} value={m.id}>
// // // // //                               {m.name}
// // // // //                             </SelectItem>
// // // // //                           ))}
// // // // //                       </SelectContent>
// // // // //                     </Select>

// // // // //                     <FormField
// // // // //                       control={form.control}
// // // // //                       name="destination"
// // // // //                       render={({ field }) => (
// // // // //                         <FormItem>
// // // // //                           <FormControl>
// // // // //                             <Select
// // // // //                               onValueChange={field.onChange}
// // // // //                               value={field.value}
// // // // //                               disabled={!destinationCountry}
// // // // //                             >
// // // // //                               <SelectTrigger className="bg-background">
// // // // //                                 <SelectValue placeholder={t('destinationCity')} />
// // // // //                               </SelectTrigger>
// // // // //                               <SelectContent>
// // // // //                                 {destinationCities.map((cityKey) => (
// // // // //                                   <SelectItem key={cityKey} value={cityKey}>
// // // // //                                     {getCityName(cityKey, locale)}
// // // // //                                   </SelectItem>
// // // // //                                 ))}
// // // // //                               </SelectContent>
// // // // //                             </Select>
// // // // //                           </FormControl>
// // // // //                           <FormMessage />
// // // // //                         </FormItem>
// // // // //                       )}
// // // // //                     />
// // // // //                   </div>
// // // // //                 </CardContent>
// // // // //               </Card>

// // // // //               <Accordion type="single" collapsible className="w-full" defaultValue="social">
// // // // //                 <AccordionItem value="social" className="border rounded-lg bg-primary/5 border-primary/20">
// // // // //                   <AccordionTrigger className="p-4 font-black text-sm hover:no-underline text-primary">
// // // // //                     <div className="flex items-center gap-2">
// // // // //                       <ShieldCheck className="h-4 w-4" />
// // // // //                       {t('social')}
// // // // //                     </div>
// // // // //                   </AccordionTrigger>

// // // // //                   <AccordionContent className="p-4 pt-0 space-y-4">
// // // // //                     <div className="bg-background/50 p-3 rounded-xl border border-dashed border-primary/20 flex gap-2 items-start mb-4">
// // // // //                       <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
// // // // //                       <p className="text-[10px] leading-relaxed text-muted-foreground">
// // // // //                         {t('socialInfo')}
// // // // //                       </p>
// // // // //                     </div>

// // // // //                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// // // // //                       <FormField
// // // // //                         control={form.control}
// // // // //                         name="facebookProfile"
// // // // //                         render={({ field }) => (
// // // // //                           <FormItem>
// // // // //                             <FormLabel className="flex items-center gap-1 text-[10px] font-black">
// // // // //                               <Facebook className="h-3 w-3 text-blue-600" /> {t('facebook')}
// // // // //                             </FormLabel>
// // // // //                             <FormControl>
// // // // //                               <Input
// // // // //                                 placeholder="https://facebook.com/..."
// // // // //                                 className="bg-card text-[10px] ltr"
// // // // //                                 {...field}
// // // // //                               />
// // // // //                             </FormControl>
// // // // //                             <FormMessage />
// // // // //                           </FormItem>
// // // // //                         )}
// // // // //                       />

// // // // //                       <FormField
// // // // //                         control={form.control}
// // // // //                         name="instagramProfile"
// // // // //                         render={({ field }) => (
// // // // //                           <FormItem>
// // // // //                             <FormLabel className="flex items-center gap-1 text-[10px] font-black">
// // // // //                               <Instagram className="h-3 w-3 text-pink-600" /> {t('instagram')}
// // // // //                             </FormLabel>
// // // // //                             <FormControl>
// // // // //                               <Input
// // // // //                                 placeholder="https://instagram.com/..."
// // // // //                                 className="bg-card text-[10px] ltr"
// // // // //                                 {...field}
// // // // //                               />
// // // // //                             </FormControl>
// // // // //                             <FormMessage />
// // // // //                           </FormItem>
// // // // //                         )}
// // // // //                       />

// // // // //                       <FormField
// // // // //                         control={form.control}
// // // // //                         name="tiktokProfile"
// // // // //                         render={({ field }) => (
// // // // //                           <FormItem>
// // // // //                             <FormLabel className="flex items-center gap-1 text-[10px] font-black">
// // // // //                               <Video className="h-3 w-3 text-foreground" /> {t('tiktok')}
// // // // //                             </FormLabel>
// // // // //                             <FormControl>
// // // // //                               <Input
// // // // //                                 placeholder="https://tiktok.com/@..."
// // // // //                                 className="bg-card text-[10px] ltr"
// // // // //                                 {...field}
// // // // //                               />
// // // // //                             </FormControl>
// // // // //                             <FormMessage />
// // // // //                           </FormItem>
// // // // //                         )}
// // // // //                       />
// // // // //                     </div>
// // // // //                   </AccordionContent>
// // // // //                 </AccordionItem>

// // // // //                 <AccordionItem value="details" className="border rounded-lg bg-muted/30 mt-4">
// // // // //                   <AccordionTrigger className="p-4 font-semibold text-sm hover:no-underline">
// // // // //                     <div className="flex items-center gap-2">
// // // // //                       <Settings className="h-4 w-4" />
// // // // //                       {t('details')}
// // // // //                     </div>
// // // // //                   </AccordionTrigger>

// // // // //                   <AccordionContent className="p-4 pt-0 space-y-4">
// // // // //                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // // // //                       {/* <FormField
// // // // //                         control={form.control}
// // // // //                         name="departureDate"
// // // // //                         render={({ field }) => (
// // // // //                           <FormItem className="flex flex-col">
// // // // //                             <FormLabel>{t('departureDate')}</FormLabel>
// // // // //                             <FormControl>
// // // // //                               <div className="relative">
// // // // //                                 <Input
// // // // //                                   type="date"
// // // // //                                   className="bg-card block w-full pl-10"
// // // // //                                   {...field}
// // // // //                                   value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
// // // // //                                   onChange={(e) =>
// // // // //                                     field.onChange(e.target.value ? new Date(e.target.value) : undefined)
// // // // //                                   }
// // // // //                                   min={new Date().toISOString().split('T')[0]}
// // // // //                                 />
// // // // //                                 <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
// // // // //                               </div>
// // // // //                             </FormControl>
// // // // //                             <FormMessage />
// // // // //                           </FormItem>
// // // // //                         )}
// // // // //                       /> */}
// // // // //                       <FormField
// // // // //                         control={form.control}
// // // // //                         name="departureDate"
// // // // //                         render={({ field }) => (
// // // // //                           <FormItem className="flex flex-col">
// // // // //                             <FormLabel>{t('departureDate')}</FormLabel>
// // // // //                             <FormControl>
// // // // //                               <div className="relative">
// // // // //                                 <Input
// // // // //                                   type="date"
// // // // //                                   className="bg-card block w-full pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
// // // // //                                   {...field}
// // // // //                                   value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
// // // // //                                   onChange={(e) =>
// // // // //                                     field.onChange(e.target.value ? new Date(e.target.value) : undefined)
// // // // //                                   }
// // // // //                                   min={new Date().toISOString().split('T')[0]}
// // // // //                                 />
// // // // //                                 <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-primary cursor-pointer" />
// // // // //                               </div>
// // // // //                             </FormControl>
// // // // //                             <FormMessage />
// // // // //                           </FormItem>
// // // // //                         )}
// // // // //                       />
// // // // //                       {/* <FormField
// // // // //                         control={form.control}
// // // // //                         name="departureTime"
// // // // //                         render={({ field }) => (
// // // // //                           <FormItem className="flex flex-col">
// // // // //                             <FormLabel>{t('departureTime')}</FormLabel>
// // // // //                             <FormControl>
// // // // //                               <Input type="time" className="bg-card" {...field} />
// // // // //                             </FormControl>
// // // // //                             <FormMessage />
// // // // //                           </FormItem>
// // // // //                         )}
// // // // //                       /> */}
// // // // //                       <FormField
// // // // //                         control={form.control}
// // // // //                         name="departureTime"
// // // // //                         render={({ field }) => (
// // // // //                           <FormItem className="flex flex-col">
// // // // //                             <FormLabel>{t('departureTime')}</FormLabel>
// // // // //                             <FormControl>
// // // // //                               <div className="relative">
// // // // //                                 <Input
// // // // //                                   type="time"
// // // // //                                   className="bg-card pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
// // // // //                                   {...field}
// // // // //                                 />
// // // // //                                 <Clock className="absolute right-3 top-2.5 h-4 w-4 text-primary pointer-events-none" />
// // // // //                               </div>
// // // // //                             </FormControl>
// // // // //                             <FormMessage />
// // // // //                           </FormItem>
// // // // //                         )}
// // // // //                       />
// // // // //                     </div>

// // // // //                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // // // //                       <FormField
// // // // //                         control={form.control}
// // // // //                         name="availableSeats"
// // // // //                         render={({ field }) => (
// // // // //                           <FormItem>
// // // // //                             <FormLabel>{t('availableSeats')}</FormLabel>
// // // // //                             <FormControl>
// // // // //                               <Input className="bg-card" type="number" {...field} />
// // // // //                             </FormControl>
// // // // //                             <FormMessage />
// // // // //                           </FormItem>
// // // // //                         )}
// // // // //                       />

// // // // //                       <FormField
// // // // //                         control={form.control}
// // // // //                         name="estimatedDurationHours"
// // // // //                         render={({ field }) => (
// // // // //                           <FormItem>
// // // // //                             <FormLabel className="flex items-center gap-1">
// // // // //                               <Clock className="h-4 w-4 text-primary font-bold" />
// // // // //                               {t('duration')}
// // // // //                             </FormLabel>
// // // // //                             <FormControl>
// // // // //                               <Input className="bg-card border-primary/50" type="number" {...field} />
// // // // //                             </FormControl>
// // // // //                             <p className="text-[10px] text-muted-foreground">
// // // // //                               {t('ticketTravel')}
// // // // //                             </p>
// // // // //                             <FormMessage />
// // // // //                           </FormItem>
// // // // //                         )}
// // // // //                       />
// // // // //                     </div>

// // // // //                     <FormField
// // // // //                       control={form.control}
// // // // //                       name="meetingPoint"
// // // // //                       render={({ field }) => (
// // // // //                         <FormItem>
// // // // //                           <FormLabel className="flex items-center gap-1">
// // // // //                             <MapPin className="h-4 w-4" />
// // // // //                             {t('meetingPoint')}
// // // // //                           </FormLabel>
// // // // //                           <FormControl>
// // // // //                             <Input className="bg-card" placeholder={t('meetingPointPlaceholder')} {...field} />
// // // // //                           </FormControl>
// // // // //                           <FormMessage />
// // // // //                         </FormItem>
// // // // //                       )}
// // // // //                     />

// // // // //                     <FormField
// // // // //                       control={form.control}
// // // // //                       name="meetingPointLink"
// // // // //                       render={({ field }) => (
// // // // //                         <FormItem>
// // // // //                           <FormLabel className="flex items-center gap-1">
// // // // //                             <MapPin className="h-4 w-4" />
// // // // //                             {t('linkLocation')}
// // // // //                           </FormLabel>
// // // // //                           <FormControl>
// // // // //                             <Input
// // // // //                               className="bg-card ltr text-sm"
// // // // //                               placeholder="https://maps.google.com/..."
// // // // //                               {...field}
// // // // //                             />
// // // // //                           </FormControl>
// // // // //                           <p className="text-[10px] text-muted-foreground flex items-center gap-1">
// // // // //                             <MapPin className="h-3 w-3" />
// // // // //                             {t('linkDec')}
// // // // //                           </p>
// // // // //                           <FormMessage />
// // // // //                         </FormItem>
// // // // //                       )}
// // // // //                     />
// // // // //                   </AccordionContent>
// // // // //                 </AccordionItem>
// // // // //               </Accordion>

// // // // //               <DialogFooter className="gap-2 sm:gap-0 pt-4">
// // // // //                 <Button
// // // // //                   type="button"
// // // // //                   variant="secondary"
// // // // //                   onClick={() => onOpenChange(false)}
// // // // //                   disabled={isSubmitting}
// // // // //                 >
// // // // //                   {t('cancel')}
// // // // //                 </Button>

// // // // //                 <Button
// // // // //                   type="submit"
// // // // //                   disabled={isSubmitting}
// // // // //                   className="font-black text-sm rounded-2xl shadow-md"
// // // // //                 >
// // // // //                   {isSubmitting ? (
// // // // //                     <>
// // // // //                       <Loader2 className="ml-2 h-5 w-5 animate-spin" />
// // // // //                       {t('submitting')}
// // // // //                     </>
// // // // //                   ) : (
// // // // //                     <>
// // // // //                       <Send className="ml-2 h-5 w-5" />
// // // // //                       {t('submit')}
// // // // //                     </>
// // // // //                   )}
// // // // //                 </Button>
// // // // //               </DialogFooter>
// // // // //             </form>
// // // // //           </Form>
// // // // //         )}
// // // // //       </DialogContent>
// // // // //     </Dialog>
// // // // //   );
// // // // // }
// // // // 'use client';

// // // // import { useState, useMemo, useEffect, useCallback } from 'react';
// // // // import { useForm } from 'react-hook-form';
// // // // import { zodResolver } from '@hookform/resolvers/zod';
// // // // import { z } from 'zod';
// // // // import {
// // // //   Dialog,
// // // //   DialogContent,
// // // //   DialogHeader,
// // // //   DialogTitle,
// // // //   DialogDescription,
// // // //   DialogFooter,
// // // // } from '@/components/ui/dialog';
// // // // import {
// // // //   Form,
// // // //   FormControl,
// // // //   FormField,
// // // //   FormItem,
// // // //   FormLabel,
// // // //   FormMessage,
// // // // } from '@/components/ui/form';
// // // // import { Button } from '@/components/ui/button';
// // // // import { Input } from '@/components/ui/input';
// // // // import {
// // // //   Select,
// // // //   SelectContent,
// // // //   SelectItem,
// // // //   SelectTrigger,
// // // //   SelectValue,
// // // // } from '@/components/ui/select';
// // // // import { Card, CardContent } from '@/components/ui/card';
// // // // import { useToast } from '@/hooks/use-toast';
// // // // import { useFirestore, useUser } from '@/firebase';
// // // // import { useUserProfile } from '@/hooks/use-user-profile';
// // // // import { collection, serverTimestamp, doc, updateDoc, addDoc, getDoc } from 'firebase/firestore';
// // // // import { FirebaseError } from 'firebase/app';
// // // // import {
// // // //   Loader2,
// // // //   Send,
// // // //   Clock,
// // // //   PlaneTakeoff,
// // // //   PlaneLanding,
// // // //   Settings,
// // // //   MapPin,
// // // //   Calendar as CalendarIcon,
// // // //   Lock,
// // // //   Facebook,
// // // //   Instagram,
// // // //   Video,
// // // //   Info,
// // // //   ShieldCheck,
// // // // } from 'lucide-react';
// // // // import { format } from 'date-fns';
// // // // import { Label } from '@/components/ui/label';
// // // // import {
// // // //   Accordion,
// // // //   AccordionContent,
// // // //   AccordionItem,
// // // //   AccordionTrigger,
// // // // } from '@/components/ui/accordion';
// // // // import { getCityName } from '@/lib/constants';
// // // // import { combineDateAndTime } from '@/lib/formatters';
// // // // import { useLocale, useTranslations } from 'next-intl';
// // // // import { useActiveMarkets } from '@/hooks/use-active-markets';
// // // // import { useRouter } from '@/i18n/routing';
// // // // import { useCarrierStatus } from '@/hooks/use-carrier-status';

// // // // const addTripSchema = z.object({
// // // //   origin: z.string().min(1, 'مدينة الانطلاق مطلوبة'),
// // // //   destination: z.string().min(1, 'مدينة الوصول مطلوبة'),
// // // //   departureDate: z.date({ required_error: 'تاريخ المغادرة مطلوب' }),
// // // //   departureTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
// // // //     message: 'الرجاء إدخل وقت صالح (صيغة 24 ساعة HH:MM)',
// // // //   }),
// // // //   meetingPoint: z.string().min(3, 'نقطة التجمع مطلوبة'),
// // // //   meetingPointLink: z.string().url('الرجاء إدخال رابط خرائط جوجل صالح').min(1, 'رابط الموقع على الخريطة مطلوب'),
// // // //   availableSeats: z.coerce.number().int().min(1, 'يجب توفر مقعد واحد على الأقل'),
// // // //   estimatedDurationHours: z.coerce.number().int().min(1, 'مدة الرحلة التقديرية إجبارية'),
// // // //   conditions: z.string().max(200, 'الشروط يجب ألا تتجاوز 200 حرف').optional(),
// // // //   facebookProfile: z.string().url('رابط فيسبوك غير صالح').optional().or(z.literal('')),
// // // //   instagramProfile: z.string().url('رابط إنستغرام غير صالح').optional().or(z.literal('')),
// // // //   tiktokProfile: z.string().url('رابط تيك توك غير صالح').optional().or(z.literal('')),
// // // // });

// // // // type AddTripFormValues = z.infer<typeof addTripSchema>;

// // // // interface AddTripDialogProps {
// // // //   isOpen: boolean;
// // // //   onOpenChange: (isOpen: boolean) => void;
// // // //   /** بيانات مسبقة من طلب المسافر لتعبئة الرحلة أوتوماتيك */
// // // //   prefill?: {
// // // //     origin?: string;
// // // //     originCountry?: string;
// // // //     destination?: string;
// // // //     destinationCountry?: string;
// // // //     departureDate?: Date;
// // // //     passengers?: number;
// // // //     requestId?: string;
// // // //   };
// // // //   /** callback بعد إنشاء الرحلة — يُستخدم لربط الـ booking بالرحلة الجديدة */
// // // //   onTripCreated?: (newTripId: string) => Promise<void>;
// // // // }

// // // // export function AddTripDialog({ isOpen, onOpenChange, prefill, onTripCreated }: AddTripDialogProps) {
// // // //   const { toast } = useToast();
// // // //   const firestore = useFirestore();
// // // //   const { user } = useUser();
// // // //   const { profile } = useUserProfile();
// // // //   const router = useRouter();
// // // //   const [isSubmitting, setIsSubmitting] = useState(false);
// // // //   const locale = useLocale();
// // // //   const { activeMarkets, isLoading: isLoadingMarkets } = useActiveMarkets();
// // // //   const { isExpired } = useCarrierStatus(profile?.expiryDate);
// // // //   const t = useTranslations('addTripDialog');
// // // //   const [originCountry, setOriginCountry] = useState('');
// // // //   const [destinationCountry, setDestinationCountry] = useState('');

// // // //   const form = useForm<AddTripFormValues>({
// // // //     resolver: zodResolver(addTripSchema),
// // // //     defaultValues: {
// // // //       origin: '',
// // // //       destination: '',
// // // //       departureTime: '',
// // // //       meetingPoint: '',
// // // //       meetingPointLink: '',
// // // //       availableSeats: 4,
// // // //       estimatedDurationHours: 3,
// // // //       conditions: '',
// // // //       facebookProfile: '',
// // // //       instagramProfile: '',
// // // //       tiktokProfile: '',
// // // //     },
// // // //   });

// // // //   useEffect(() => {
// // // //     if (isOpen && profile) {
// // // //       // الأولوية للـ prefill (من طلب المسافر)، وإلا من jurisdiction الناقل
// // // //       const originC = prefill?.originCountry || profile.jurisdiction?.origin || '';
// // // //       const destC = prefill?.destinationCountry || profile.jurisdiction?.destination || '';
// // // //       if (originC) setOriginCountry(originC);
// // // //       if (destC) setDestinationCountry(destC);

// // // //       form.reset({
// // // //         origin: prefill?.origin || '',
// // // //         destination: prefill?.destination || '',
// // // //         estimatedDurationHours: 3,
// // // //         departureDate: prefill?.departureDate || undefined,
// // // //         departureTime: '',
// // // //         meetingPoint: profile.conditions ? '' : '',
// // // //         meetingPointLink: '',
// // // //         availableSeats: profile.vehicleCapacity || 4,
// // // //         conditions: profile.conditions || '',
// // // //         facebookProfile: (profile as any).facebookProfile || '',
// // // //         instagramProfile: (profile as any).instagramProfile || '',
// // // //         tiktokProfile: (profile as any).tiktokProfile || '',
// // // //       });
// // // //     }
// // // //   }, [isOpen, profile, prefill, form]);

// // // //   const originCities = useMemo(() => {
// // // //     if (!originCountry) return [];
// // // //     return activeMarkets.find((m) => m.id === originCountry)?.cities || [];
// // // //   }, [activeMarkets, originCountry]);

// // // //   const destinationCities = useMemo(() => {
// // // //     if (!destinationCountry) return [];
// // // //     return activeMarkets.find((m) => m.id === destinationCountry)?.cities || [];
// // // //   }, [activeMarkets, destinationCountry]);

// // // //   const handleOriginCountryChange = useCallback(
// // // //     (val: string) => {
// // // //       setOriginCountry(val);
// // // //       form.setValue('origin', '');
// // // //     },
// // // //     [form]
// // // //   );

// // // //   const handleDestCountryChange = useCallback(
// // // //     (val: string) => {
// // // //       setDestinationCountry(val);
// // // //       form.setValue('destination', '');
// // // //     },
// // // //     [form]
// // // //   );

// // // //   const onSubmit = async (data: AddTripFormValues) => {
// // // //     if (!firestore || !user || !profile) return;

// // // //     // تأكد إن الناقل أكمل الشروط الدائمة والبروفيل قبل إنشاء رحلة
// // // //     if (!profile.isPermanentComplete) {
// // // //       toast({
// // // //         variant: 'destructive',
// // // //         title: t('errorProfile'),
// // // //         description: t('errorProfileDesc'),
// // // //       });
// // // //       onOpenChange(false);
// // // //       router.push('/carrier/Permanent');
// // // //       return;
// // // //     }

// // // //     if (profile.isPartial || !profile.vehicleType || !profile.vehicleCapacity) {
// // // //       toast({
// // // //         variant: 'destructive',
// // // //         title: t('errorProfile'),
// // // //         description: t('errorProfileDesc')
// // // //       });
// // // //       onOpenChange(false);
// // // //       router.push('/carrier/profile');
// // // //       return;
// // // //     }

// // // //     if (profile.currentActiveTripId) {
// // // //       try {
// // // //         const activeTripRef = doc(firestore, 'trips', profile.currentActiveTripId);
// // // //         const activeTripSnap = await getDoc(activeTripRef);

// // // //         if (activeTripSnap.exists()) {
// // // //           const activeTrip = activeTripSnap.data() as any;

// // // //           const depDate = activeTrip.departureDate?.toDate?.()
// // // //             ? activeTrip.departureDate.toDate()
// // // //             : new Date(activeTrip.departureDate || 0);

// // // //           const durationHours = activeTrip.estimatedDurationHours || 0;
// // // //           const endDate = new Date(depDate.getTime() + durationHours * 60 * 60 * 1000);
// // // //           const hasEnded = endDate < new Date();

// // // //           if (hasEnded || activeTrip.status === 'Completed' || activeTrip.status === 'Cancelled') {
// // // //             await updateDoc(doc(firestore, 'users', user.uid), {
// // // //               currentActiveTripId: null,
// // // //               updatedAt: serverTimestamp(),
// // // //             });
// // // //           } else {
// // // //             toast({
// // // //               variant: 'destructive',
// // // //               title: t('errorActiveTrip'),
// // // //               description: t('errorActiveTripDesc')
// // // //             });
// // // //             return;
// // // //           }
// // // //         } else {
// // // //           await updateDoc(doc(firestore, 'users', user.uid), {
// // // //             currentActiveTripId: null,
// // // //             updatedAt: serverTimestamp(),
// // // //           });
// // // //         }
// // // //       } catch (e) {
// // // //         toast({
// // // //           variant: 'destructive',
// // // //           title: t('errorVerify'),
// // // //           description: t('errorVerifyDesc')
// // // //         });
// // // //         return;
// // // //       }
// // // //     }

// // // //     setIsSubmitting(true);

// // // //     try {
// // // //       const combinedDepartureDateTime = combineDateAndTime(data.departureDate, data.departureTime);

// // // //       const tripData: any = {
// // // //         ...data,
// // // //         departureDate: combinedDepartureDateTime.toISOString(),
// // // //         userId: user.uid,
// // // //         carrierId: user.uid,
// // // //         carrierName: profile.firstName,
// // // //         vehicleType: profile.vehicleType || 'غير محدد',
// // // //         vehiclePlateNumber: profile?.plateNumber || '',
// // // //         vehicleCapacity: profile?.vehicleCapacity || 0,
// // // //         numberOfStops: profile.numberOfStops ?? 0,
// // // //         bagsPerSeat: profile.bagsPerSeat ?? 1,
// // // //         vehicleCategory: profile.vehicleCapacity && profile.vehicleCapacity > 7 ? 'bus' : 'small',
// // // //         status: 'Planned' as const,
// // // //         price: Number(profile.price) || 0,
// // // //         currency: profile.currency || 'د.أ',
// // // //         depositPercentage: profile.depositPercentage ?? 0,
// // // //         createdAt: serverTimestamp(),
// // // //         updatedAt: serverTimestamp(),
// // // //       };

// // // //       // لو الرحلة مرتبطة بطلب مسافر → سجّل العلاقة واحسب المقاعد المتبقية
// // // //       if (prefill?.requestId) {
// // // //         tripData.linkedRequestId = prefill.requestId;
// // // //         const bookedSeats = prefill.passengers || 0;
// // // //         const totalCapacity = profile.vehicleCapacity || 4;
// // // //         tripData.availableSeats = Math.max(0, totalCapacity - bookedSeats);
// // // //         tripData.bookedSeats = bookedSeats;
// // // //       }

// // // //       delete (tripData as any).departureTime;

// // // //       const newTripRef = await addDoc(collection(firestore, 'trips'), tripData);

// // // //       const userUpdates: any = {
// // // //         currentActiveTripId: newTripRef.id,
// // // //         updatedAt: serverTimestamp(),
// // // //       };

// // // //       if (data.facebookProfile) userUpdates.facebookProfile = data.facebookProfile;
// // // //       if (data.instagramProfile) userUpdates.instagramProfile = data.instagramProfile;
// // // //       if (data.tiktokProfile) userUpdates.tiktokProfile = data.tiktokProfile;

// // // //       await updateDoc(doc(firestore, 'users', user.uid), userUpdates);

// // // //       // لو في callback (من booking-action-card) → استدعيه لربط الرحلة بالحجز
// // // //       if (onTripCreated) {
// // // //         await onTripCreated(newTripRef.id);
// // // //       }

// // // //       toast({ title: t('successAdd') + ' ✅' });
// // // //       onOpenChange(false);
// // // //       form.reset();
// // // //     } catch (error: any) {
// // // //       toast({
// // // //         variant: 'destructive',
// // // //         title: t('errorAdd'),
// // // //         description: error?.message || t('errorAddDesc')
// // // //       });
// // // //     } finally {
// // // //       setIsSubmitting(false);
// // // //     }
// // // //   };
// // // //   return (
// // // //     <Dialog open={isOpen} onOpenChange={onOpenChange}>
// // // //       <DialogContent className="sm:max-w-3xl">
// // // //         <DialogHeader>
// // // //           <DialogTitle> {t('title')}</DialogTitle>
// // // //           <DialogDescription>
// // // //             {t('desc')}
// // // //           </DialogDescription>
// // // //         </DialogHeader>

// // // //         {isExpired ? (
// // // //           <div className="p-10 flex flex-col items-center text-center space-y-6 animate-in fade-in zoom-in duration-500 bg-destructive/5 rounded-[2.5rem] border-2 border-destructive/20 my-4">
// // // //             <div className="w-20 h-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center shadow-inner">
// // // //               <Lock className="w-10 h-10 animate-pulse" />
// // // //             </div>

// // // //             <div className="space-y-2">
// // // //               <h3 className="text-2xl font-black text-foreground tracking-tight uppercase">
// // // //                 {t('expiredTitle')}
// // // //               </h3>
// // // //               <p className="text-sm text-muted-foreground font-bold leading-relaxed max-w-sm mx-auto  ">
// // // //                 {t('expiredDesc')}
// // // //               </p>
// // // //             </div>

// // // //             <Button
// // // //               className="w-full h-14 rounded-2xl bg-primary text-black font-black text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
// // // //               onClick={() => router.push('/carrier/Permanent')}
// // // //             >
// // // //               {t('expiredBtn')}
// // // //             </Button>
// // // //           </div>
// // // //         ) : (
// // // //           <Form {...form}>
// // // //             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

// // // //               {/* ── بانر معلومات الطلب (يظهر فقط لو الديالوج اتفتح من حجز مسافر) ── */}
// // // //               {prefill?.requestId && (
// // // //                 <div className="bg-primary/10 border border-primary/30 rounded-xl p-3 flex items-start gap-3 text-sm">
// // // //                   <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
// // // //                   <div>
// // // //                     <p className="font-bold text-foreground">رحلة مرتبطة بطلب مسافر</p>
// // // //                     <p className="text-muted-foreground">
// // // //                       المسار: {prefill.origin || '—'} ← {prefill.destination || '—'}
// // // //                       {prefill.passengers ? ` · ${prefill.passengers} مقعد محجوز مسبقاً` : ''}
// // // //                     </p>
// // // //                   </div>
// // // //                 </div>
// // // //               )}

// // // //               <Card className="bg-muted/30 border-accent/20">
// // // //                 <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
// // // //                   <div className="space-y-2">
// // // //                     <Label className="flex items-center gap-2 font-bold text-accent">
// // // //                       <PlaneTakeoff className="h-4 w-4" /> {t('from')}
// // // //                     </Label>

// // // //                     <Select
// // // //                       onValueChange={handleOriginCountryChange}
// // // //                       value={originCountry}
// // // //                       disabled={isLoadingMarkets}
// // // //                     >
// // // //                       <SelectTrigger className="bg-background">
// // // //                         <SelectValue placeholder={t('originCountry')} />
// // // //                       </SelectTrigger>
// // // //                       <SelectContent>
// // // //                         {activeMarkets.map((m) => (
// // // //                           <SelectItem key={m.id} value={m.id}>
// // // //                             {m.name}
// // // //                           </SelectItem>
// // // //                         ))}
// // // //                       </SelectContent>
// // // //                     </Select>

// // // //                     <FormField
// // // //                       control={form.control}
// // // //                       name="origin"
// // // //                       render={({ field }) => (
// // // //                         <FormItem>
// // // //                           <FormControl>
// // // //                             <Select
// // // //                               onValueChange={field.onChange}
// // // //                               value={field.value}
// // // //                               disabled={!originCountry}
// // // //                             >
// // // //                               <SelectTrigger className="bg-background">
// // // //                                 <SelectValue placeholder={t('originCity')} />
// // // //                               </SelectTrigger>
// // // //                               <SelectContent>
// // // //                                 {originCities.map((cityKey) => (
// // // //                                   <SelectItem key={cityKey} value={cityKey}>
// // // //                                     {getCityName(cityKey, locale)}
// // // //                                   </SelectItem>
// // // //                                 ))}
// // // //                               </SelectContent>
// // // //                             </Select>
// // // //                           </FormControl>
// // // //                           <FormMessage />
// // // //                         </FormItem>
// // // //                       )}
// // // //                     />
// // // //                   </div>

// // // //                   <div className="space-y-2">
// // // //                     <Label className="flex items-center gap-2 font-bold text-accent">
// // // //                       <PlaneLanding className="h-4 w-4" />{t('to')}
// // // //                     </Label>

// // // //                     <Select
// // // //                       onValueChange={handleDestCountryChange}
// // // //                       value={destinationCountry}
// // // //                       disabled={isLoadingMarkets}
// // // //                     >
// // // //                       <SelectTrigger className="bg-background">
// // // //                         <SelectValue placeholder={t('destinationCountry')} />
// // // //                       </SelectTrigger>
// // // //                       <SelectContent>
// // // //                         {activeMarkets
// // // //                           .filter((m) => m.id !== originCountry)
// // // //                           .map((m) => (
// // // //                             <SelectItem key={m.id} value={m.id}>
// // // //                               {m.name}
// // // //                             </SelectItem>
// // // //                           ))}
// // // //                       </SelectContent>
// // // //                     </Select>

// // // //                     <FormField
// // // //                       control={form.control}
// // // //                       name="destination"
// // // //                       render={({ field }) => (
// // // //                         <FormItem>
// // // //                           <FormControl>
// // // //                             <Select
// // // //                               onValueChange={field.onChange}
// // // //                               value={field.value}
// // // //                               disabled={!destinationCountry}
// // // //                             >
// // // //                               <SelectTrigger className="bg-background">
// // // //                                 <SelectValue placeholder={t('destinationCity')} />
// // // //                               </SelectTrigger>
// // // //                               <SelectContent>
// // // //                                 {destinationCities.map((cityKey) => (
// // // //                                   <SelectItem key={cityKey} value={cityKey}>
// // // //                                     {getCityName(cityKey, locale)}
// // // //                                   </SelectItem>
// // // //                                 ))}
// // // //                               </SelectContent>
// // // //                             </Select>
// // // //                           </FormControl>
// // // //                           <FormMessage />
// // // //                         </FormItem>
// // // //                       )}
// // // //                     />
// // // //                   </div>
// // // //                 </CardContent>
// // // //               </Card>

// // // //               <Accordion type="single" collapsible className="w-full" defaultValue="social">
// // // //                 <AccordionItem value="social" className="border rounded-lg bg-primary/5 border-primary/20">
// // // //                   <AccordionTrigger className="p-4 font-black text-sm hover:no-underline text-primary">
// // // //                     <div className="flex items-center gap-2">
// // // //                       <ShieldCheck className="h-4 w-4" />
// // // //                       {t('social')}
// // // //                     </div>
// // // //                   </AccordionTrigger>

// // // //                   <AccordionContent className="p-4 pt-0 space-y-4">
// // // //                     <div className="bg-background/50 p-3 rounded-xl border border-dashed border-primary/20 flex gap-2 items-start mb-4">
// // // //                       <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
// // // //                       <p className="text-[10px] leading-relaxed text-muted-foreground">
// // // //                         {t('socialInfo')}
// // // //                       </p>
// // // //                     </div>

// // // //                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// // // //                       <FormField
// // // //                         control={form.control}
// // // //                         name="facebookProfile"
// // // //                         render={({ field }) => (
// // // //                           <FormItem>
// // // //                             <FormLabel className="flex items-center gap-1 text-[10px] font-black">
// // // //                               <Facebook className="h-3 w-3 text-blue-600" /> {t('facebook')}
// // // //                             </FormLabel>
// // // //                             <FormControl>
// // // //                               <Input
// // // //                                 placeholder="https://facebook.com/..."
// // // //                                 className="bg-card text-[10px] ltr"
// // // //                                 {...field}
// // // //                               />
// // // //                             </FormControl>
// // // //                             <FormMessage />
// // // //                           </FormItem>
// // // //                         )}
// // // //                       />

// // // //                       <FormField
// // // //                         control={form.control}
// // // //                         name="instagramProfile"
// // // //                         render={({ field }) => (
// // // //                           <FormItem>
// // // //                             <FormLabel className="flex items-center gap-1 text-[10px] font-black">
// // // //                               <Instagram className="h-3 w-3 text-pink-600" /> {t('instagram')}
// // // //                             </FormLabel>
// // // //                             <FormControl>
// // // //                               <Input
// // // //                                 placeholder="https://instagram.com/..."
// // // //                                 className="bg-card text-[10px] ltr"
// // // //                                 {...field}
// // // //                               />
// // // //                             </FormControl>
// // // //                             <FormMessage />
// // // //                           </FormItem>
// // // //                         )}
// // // //                       />

// // // //                       <FormField
// // // //                         control={form.control}
// // // //                         name="tiktokProfile"
// // // //                         render={({ field }) => (
// // // //                           <FormItem>
// // // //                             <FormLabel className="flex items-center gap-1 text-[10px] font-black">
// // // //                               <Video className="h-3 w-3 text-foreground" /> {t('tiktok')}
// // // //                             </FormLabel>
// // // //                             <FormControl>
// // // //                               <Input
// // // //                                 placeholder="https://tiktok.com/@..."
// // // //                                 className="bg-card text-[10px] ltr"
// // // //                                 {...field}
// // // //                               />
// // // //                             </FormControl>
// // // //                             <FormMessage />
// // // //                           </FormItem>
// // // //                         )}
// // // //                       />
// // // //                     </div>
// // // //                   </AccordionContent>
// // // //                 </AccordionItem>

// // // //                 <AccordionItem value="details" className="border rounded-lg bg-muted/30 mt-4">
// // // //                   <AccordionTrigger className="p-4 font-semibold text-sm hover:no-underline">
// // // //                     <div className="flex items-center gap-2">
// // // //                       <Settings className="h-4 w-4" />
// // // //                       {t('details')}
// // // //                     </div>
// // // //                   </AccordionTrigger>

// // // //                   <AccordionContent className="p-4 pt-0 space-y-4">
// // // //                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // // //                       {/* <FormField
// // // //                         control={form.control}
// // // //                         name="departureDate"
// // // //                         render={({ field }) => (
// // // //                           <FormItem className="flex flex-col">
// // // //                             <FormLabel>{t('departureDate')}</FormLabel>
// // // //                             <FormControl>
// // // //                               <div className="relative">
// // // //                                 <Input
// // // //                                   type="date"
// // // //                                   className="bg-card block w-full pl-10"
// // // //                                   {...field}
// // // //                                   value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
// // // //                                   onChange={(e) =>
// // // //                                     field.onChange(e.target.value ? new Date(e.target.value) : undefined)
// // // //                                   }
// // // //                                   min={new Date().toISOString().split('T')[0]}
// // // //                                 />
// // // //                                 <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
// // // //                               </div>
// // // //                             </FormControl>
// // // //                             <FormMessage />
// // // //                           </FormItem>
// // // //                         )}
// // // //                       /> */}
// // // //                       <FormField
// // // //                         control={form.control}
// // // //                         name="departureDate"
// // // //                         render={({ field }) => (
// // // //                           <FormItem className="flex flex-col">
// // // //                             <FormLabel>{t('departureDate')}</FormLabel>
// // // //                             <FormControl>
// // // //                               <div className="relative">
// // // //                                 <Input
// // // //                                   type="date"
// // // //                                   className="bg-card block w-full pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
// // // //                                   {...field}
// // // //                                   value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
// // // //                                   onChange={(e) =>
// // // //                                     field.onChange(e.target.value ? new Date(e.target.value) : undefined)
// // // //                                   }
// // // //                                   min={new Date().toISOString().split('T')[0]}
// // // //                                 />
// // // //                                 <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-primary cursor-pointer" />
// // // //                               </div>
// // // //                             </FormControl>
// // // //                             <FormMessage />
// // // //                           </FormItem>
// // // //                         )}
// // // //                       />
// // // //                       {/* <FormField
// // // //                         control={form.control}
// // // //                         name="departureTime"
// // // //                         render={({ field }) => (
// // // //                           <FormItem className="flex flex-col">
// // // //                             <FormLabel>{t('departureTime')}</FormLabel>
// // // //                             <FormControl>
// // // //                               <Input type="time" className="bg-card" {...field} />
// // // //                             </FormControl>
// // // //                             <FormMessage />
// // // //                           </FormItem>
// // // //                         )}
// // // //                       /> */}
// // // //                       <FormField
// // // //                         control={form.control}
// // // //                         name="departureTime"
// // // //                         render={({ field }) => (
// // // //                           <FormItem className="flex flex-col">
// // // //                             <FormLabel>{t('departureTime')}</FormLabel>
// // // //                             <FormControl>
// // // //                               <div className="relative">
// // // //                                 <Input
// // // //                                   type="time"
// // // //                                   className="bg-card pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
// // // //                                   {...field}
// // // //                                 />
// // // //                                 <Clock className="absolute right-3 top-2.5 h-4 w-4 text-primary pointer-events-none" />
// // // //                               </div>
// // // //                             </FormControl>
// // // //                             <FormMessage />
// // // //                           </FormItem>
// // // //                         )}
// // // //                       />
// // // //                     </div>

// // // //                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // // //                       <FormField
// // // //                         control={form.control}
// // // //                         name="availableSeats"
// // // //                         render={({ field }) => (
// // // //                           <FormItem>
// // // //                             <FormLabel>{t('availableSeats')}</FormLabel>
// // // //                             <FormControl>
// // // //                               <Input className="bg-card" type="number" {...field} />
// // // //                             </FormControl>
// // // //                             <FormMessage />
// // // //                           </FormItem>
// // // //                         )}
// // // //                       />

// // // //                       <FormField
// // // //                         control={form.control}
// // // //                         name="estimatedDurationHours"
// // // //                         render={({ field }) => (
// // // //                           <FormItem>
// // // //                             <FormLabel className="flex items-center gap-1">
// // // //                               <Clock className="h-4 w-4 text-primary font-bold" />
// // // //                               {t('duration')}
// // // //                             </FormLabel>
// // // //                             <FormControl>
// // // //                               <Input className="bg-card border-primary/50" type="number" {...field} />
// // // //                             </FormControl>
// // // //                             <p className="text-[10px] text-muted-foreground">
// // // //                               {t('ticketTravel')}
// // // //                             </p>
// // // //                             <FormMessage />
// // // //                           </FormItem>
// // // //                         )}
// // // //                       />
// // // //                     </div>

// // // //                     <FormField
// // // //                       control={form.control}
// // // //                       name="meetingPoint"
// // // //                       render={({ field }) => (
// // // //                         <FormItem>
// // // //                           <FormLabel className="flex items-center gap-1">
// // // //                             <MapPin className="h-4 w-4" />
// // // //                             {t('meetingPoint')}
// // // //                           </FormLabel>
// // // //                           <FormControl>
// // // //                             <Input className="bg-card" placeholder={t('meetingPointPlaceholder')} {...field} />
// // // //                           </FormControl>
// // // //                           <FormMessage />
// // // //                         </FormItem>
// // // //                       )}
// // // //                     />

// // // //                     <FormField
// // // //                       control={form.control}
// // // //                       name="meetingPointLink"
// // // //                       render={({ field }) => (
// // // //                         <FormItem>
// // // //                           <FormLabel className="flex items-center gap-1">
// // // //                             <MapPin className="h-4 w-4" />
// // // //                             {t('linkLocation')}
// // // //                           </FormLabel>
// // // //                           <FormControl>
// // // //                             <Input
// // // //                               className="bg-card ltr text-sm"
// // // //                               placeholder="https://maps.google.com/..."
// // // //                               {...field}
// // // //                             />
// // // //                           </FormControl>
// // // //                           <p className="text-[10px] text-muted-foreground flex items-center gap-1">
// // // //                             <MapPin className="h-3 w-3" />
// // // //                             {t('linkDec')}
// // // //                           </p>
// // // //                           <FormMessage />
// // // //                         </FormItem>
// // // //                       )}
// // // //                     />
// // // //                   </AccordionContent>
// // // //                 </AccordionItem>
// // // //               </Accordion>

// // // //               <DialogFooter className="gap-2 sm:gap-0 pt-4">
// // // //                 <Button
// // // //                   type="button"
// // // //                   variant="secondary"
// // // //                   onClick={() => onOpenChange(false)}
// // // //                   disabled={isSubmitting}
// // // //                 >
// // // //                   {t('cancel')}
// // // //                 </Button>

// // // //                 <Button
// // // //                   type="submit"
// // // //                   disabled={isSubmitting}
// // // //                   className="font-black text-sm rounded-2xl shadow-md"
// // // //                 >
// // // //                   {isSubmitting ? (
// // // //                     <>
// // // //                       <Loader2 className="ml-2 h-5 w-5 animate-spin" />
// // // //                       {t('submitting')}
// // // //                     </>
// // // //                   ) : (
// // // //                     <>
// // // //                       <Send className="ml-2 h-5 w-5" />
// // // //                       {t('submit')}
// // // //                     </>
// // // //                   )}
// // // //                 </Button>
// // // //               </DialogFooter>
// // // //             </form>
// // // //           </Form>
// // // //         )}
// // // //       </DialogContent>
// // // //     </Dialog>
// // // //   );
// // // // }
// // // 'use client';

// // // import { useState, useMemo, useEffect, useCallback } from 'react';
// // // import { useForm } from 'react-hook-form';
// // // import { zodResolver } from '@hookform/resolvers/zod';
// // // import { z } from 'zod';
// // // import {
// // //   Dialog,
// // //   DialogContent,
// // //   DialogHeader,
// // //   DialogTitle,
// // //   DialogDescription,
// // //   DialogFooter,
// // // } from '@/components/ui/dialog';
// // // import {
// // //   Form,
// // //   FormControl,
// // //   FormField,
// // //   FormItem,
// // //   FormLabel,
// // //   FormMessage,
// // // } from '@/components/ui/form';
// // // import { Button } from '@/components/ui/button';
// // // import { Input } from '@/components/ui/input';
// // // import {
// // //   Select,
// // //   SelectContent,
// // //   SelectItem,
// // //   SelectTrigger,
// // //   SelectValue,
// // // } from '@/components/ui/select';
// // // import { Card, CardContent } from '@/components/ui/card';
// // // import { useToast } from '@/hooks/use-toast';
// // // import { useFirestore, useUser } from '@/firebase';
// // // import { useUserProfile } from '@/hooks/use-user-profile';
// // // import { collection, serverTimestamp, doc, updateDoc, addDoc, getDoc } from 'firebase/firestore';
// // // import { FirebaseError } from 'firebase/app';
// // // import {
// // //   Loader2,
// // //   Send,
// // //   Clock,
// // //   PlaneTakeoff,
// // //   PlaneLanding,
// // //   Settings,
// // //   MapPin,
// // //   Calendar as CalendarIcon,
// // //   Lock,
// // //   Facebook,
// // //   Instagram,
// // //   Video,
// // //   Info,
// // //   ShieldCheck,
// // // } from 'lucide-react';
// // // import { format } from 'date-fns';
// // // import { Label } from '@/components/ui/label';
// // // import {
// // //   Accordion,
// // //   AccordionContent,
// // //   AccordionItem,
// // //   AccordionTrigger,
// // // } from '@/components/ui/accordion';
// // // import { getCityName } from '@/lib/constants';
// // // import { combineDateAndTime } from '@/lib/formatters';
// // // import { useLocale, useTranslations } from 'next-intl';
// // // import { useActiveMarkets } from '@/hooks/use-active-markets';
// // // import { useRouter } from '@/i18n/routing';
// // // import { useCarrierStatus } from '@/hooks/use-carrier-status';

// // // const addTripSchema = z.object({
// // //   origin: z.string().min(1, 'مدينة الانطلاق مطلوبة'),
// // //   destination: z.string().min(1, 'مدينة الوصول مطلوبة'),
// // //   departureDate: z.date({ required_error: 'تاريخ المغادرة مطلوب' }),
// // //   departureTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
// // //     message: 'الرجاء إدخل وقت صالح (صيغة 24 ساعة HH:MM)',
// // //   }),
// // //   meetingPoint: z.string().min(3, 'نقطة التجمع مطلوبة'),
// // //   meetingPointLink: z.string().url('الرجاء إدخال رابط خرائط جوجل صالح').min(1, 'رابط الموقع على الخريطة مطلوب'),
// // //   availableSeats: z.coerce.number().int().min(1, 'يجب توفر مقعد واحد على الأقل'),
// // //   estimatedDurationHours: z.coerce.number().int().min(1, 'مدة الرحلة التقديرية إجبارية'),
// // //   conditions: z.string().max(200, 'الشروط يجب ألا تتجاوز 200 حرف').optional(),
// // //   facebookProfile: z.string().url('رابط فيسبوك غير صالح').optional().or(z.literal('')),
// // //   instagramProfile: z.string().url('رابط إنستغرام غير صالح').optional().or(z.literal('')),
// // //   tiktokProfile: z.string().url('رابط تيك توك غير صالح').optional().or(z.literal('')),
// // // });

// // // type AddTripFormValues = z.infer<typeof addTripSchema>;

// // // interface AddTripDialogProps {
// // //   isOpen: boolean;
// // //   onOpenChange: (isOpen: boolean) => void;
// // //   /** بيانات مسبقة من طلب المسافر لتعبئة الرحلة أوتوماتيك */
// // //   prefill?: {
// // //     origin?: string;
// // //     originCountry?: string;
// // //     destination?: string;
// // //     destinationCountry?: string;
// // //     departureDate?: Date;
// // //     passengers?: number;
// // //     requestId?: string;
// // //   };
// // //   /** callback بعد إنشاء الرحلة — يُستخدم لربط الـ booking بالرحلة الجديدة */
// // //   onTripCreated?: (newTripId: string) => Promise<void>;
// // // }

// // // export function AddTripDialog({ isOpen, onOpenChange, prefill, onTripCreated }: AddTripDialogProps) {
// // //   const { toast } = useToast();
// // //   const firestore = useFirestore();
// // //   const { user } = useUser();
// // //   const { profile } = useUserProfile();
// // //   const router = useRouter();
// // //   const [isSubmitting, setIsSubmitting] = useState(false);
// // //   const locale = useLocale();
// // //   const { activeMarkets, isLoading: isLoadingMarkets } = useActiveMarkets();
// // //   const { isExpired } = useCarrierStatus(profile?.expiryDate);
// // //   const t = useTranslations('addTripDialog');
// // //   const [originCountry, setOriginCountry] = useState('');
// // //   const [destinationCountry, setDestinationCountry] = useState('');

// // //   const form = useForm<AddTripFormValues>({
// // //     resolver: zodResolver(addTripSchema),
// // //     defaultValues: {
// // //       origin: '',
// // //       destination: '',
// // //       departureTime: '',
// // //       meetingPoint: '',
// // //       meetingPointLink: '',
// // //       availableSeats: 4,
// // //       estimatedDurationHours: 3,
// // //       conditions: '',
// // //       facebookProfile: '',
// // //       instagramProfile: '',
// // //       tiktokProfile: '',
// // //     },
// // //   });

// // //   useEffect(() => {
// // //     if (isOpen && profile) {
// // //       // الأولوية للـ prefill (من طلب المسافر)، وإلا من jurisdiction الناقل
// // //       const originC = prefill?.originCountry || profile.jurisdiction?.origin || '';
// // //       const destC = prefill?.destinationCountry || profile.jurisdiction?.destination || '';
// // //       // console.log(prefill?.)
// // //       if (originC) setOriginCountry(originC);
// // //       if (destC) setDestinationCountry(destC);

// // //       form.reset({
// // //         origin: prefill?.origin || '',
// // //         destination: prefill?.destination || '',
// // //         estimatedDurationHours: 3,
// // //         departureDate: prefill?.departureDate || undefined,
// // //         departureTime: '',
// // //         meetingPoint: profile.conditions ? '' : '',
// // //         meetingPointLink: '',
// // //         availableSeats: profile.vehicleCapacity || 4,
// // //         conditions: profile.conditions || '',
// // //         facebookProfile: (profile as any).facebookProfile || '',
// // //         instagramProfile: (profile as any).instagramProfile || '',
// // //         tiktokProfile: (profile as any).tiktokProfile || '',
// // //       });
// // //     }
// // //   }, [isOpen, profile, prefill, form]);

// // //   const originCities = useMemo(() => {
// // //     if (!originCountry) return [];
// // //     return activeMarkets.find((m) => m.id === originCountry)?.cities || [];
// // //   }, [activeMarkets, originCountry]);

// // //   const destinationCities = useMemo(() => {
// // //     if (!destinationCountry) return [];
// // //     return activeMarkets.find((m) => m.id === destinationCountry)?.cities || [];
// // //   }, [activeMarkets, destinationCountry]);

// // //   const handleOriginCountryChange = useCallback(
// // //     (val: string) => {
// // //       setOriginCountry(val);
// // //       form.setValue('origin', '');
// // //     },
// // //     [form]
// // //   );

// // //   const handleDestCountryChange = useCallback(
// // //     (val: string) => {
// // //       setDestinationCountry(val);
// // //       form.setValue('destination', '');
// // //     },
// // //     [form]
// // //   );

// // //   const onSubmit = async (data: AddTripFormValues) => {
// // //     if (!firestore || !user || !profile) return;

// // //     // تأكد إن الناقل أكمل الشروط الدائمة والبروفيل قبل إنشاء رحلة
// // //     if (!profile.isPermanentComplete) {
// // //       toast({
// // //         variant: 'destructive',
// // //         title: t('errorProfile'),
// // //         description: t('errorProfileDesc'),
// // //       });
// // //       onOpenChange(false);
// // //       router.push('/carrier/Permanent');
// // //       return;
// // //     }

// // //     if (profile.isPartial || !profile.vehicleType || !profile.vehicleCapacity) {
// // //       toast({
// // //         variant: 'destructive',
// // //         title: t('errorProfile'),
// // //         description: t('errorProfileDesc')
// // //       });
// // //       onOpenChange(false);
// // //       router.push('/carrier/profile');
// // //       return;
// // //     }

// // //     if (profile.currentActiveTripId) {
// // //       try {
// // //         const activeTripRef = doc(firestore, 'trips', profile.currentActiveTripId);
// // //         const activeTripSnap = await getDoc(activeTripRef);

// // //         if (activeTripSnap.exists()) {
// // //           const activeTrip = activeTripSnap.data() as any;

// // //           const depDate = activeTrip.departureDate?.toDate?.()
// // //             ? activeTrip.departureDate.toDate()
// // //             : new Date(activeTrip.departureDate || 0);

// // //           const durationHours = activeTrip.estimatedDurationHours || 0;
// // //           const endDate = new Date(depDate.getTime() + durationHours * 60 * 60 * 1000);
// // //           const hasEnded = endDate < new Date();

// // //           if (hasEnded || activeTrip.status === 'Completed' || activeTrip.status === 'Cancelled') {
// // //             await updateDoc(doc(firestore, 'users', user.uid), {
// // //               currentActiveTripId: null,
// // //               updatedAt: serverTimestamp(),
// // //             });
// // //           } else {
// // //             toast({
// // //               variant: 'destructive',
// // //               title: t('errorActiveTrip'),
// // //               description: t('errorActiveTripDesc')
// // //             });
// // //             return;
// // //           }
// // //         } else {
// // //           await updateDoc(doc(firestore, 'users', user.uid), {
// // //             currentActiveTripId: null,
// // //             updatedAt: serverTimestamp(),
// // //           });
// // //         }
// // //       } catch (e) {
// // //         toast({
// // //           variant: 'destructive',
// // //           title: t('errorVerify'),
// // //           description: t('errorVerifyDesc')
// // //         });
// // //         return;
// // //       }
// // //     }

// // //     setIsSubmitting(true);

// // //     try {
// // //       const combinedDepartureDateTime = combineDateAndTime(data.departureDate, data.departureTime);

// // //       const tripData: any = {
// // //         ...data,
// // //         departureDate: combinedDepartureDateTime.toISOString(),
// // //         userId: user.uid,
// // //         carrierId: user.uid,
// // //         carrierName: profile.firstName,
// // //         vehicleType: profile.vehicleType || 'غير محدد',
// // //         vehiclePlateNumber: profile?.plateNumber || '',
// // //         vehicleCapacity: profile?.vehicleCapacity || 0,
// // //         numberOfStops: profile.numberOfStops ?? 0,
// // //         bagsPerSeat: profile.bagsPerSeat ?? 1,
// // //         vehicleCategory: profile.vehicleCapacity && profile.vehicleCapacity > 7 ? 'bus' : 'small',
// // //         status: 'Planned' as const,
// // //         price: Number(profile.price) || 0,
// // //         currency: profile.currency || 'د.أ',
// // //         depositPercentage: profile.depositPercentage ?? 0,
// // //         createdAt: serverTimestamp(),
// // //         updatedAt: serverTimestamp(),
// // //       };

// // //       // لو الرحلة مرتبطة بطلب مسافر → سجّل العلاقة واحسب المقاعد المتبقية
// // //       if (prefill?.requestId) {
// // //         tripData.linkedRequestId = prefill.requestId;
// // //         const bookedSeats = prefill.passengers || 0;
// // //         const totalCapacity = profile.vehicleCapacity || 4;
// // //         tripData.availableSeats = Math.max(0, totalCapacity - bookedSeats);
// // //         tripData.bookedSeats = bookedSeats;
// // //       }

// // //       delete (tripData as any).departureTime;

// // //       const newTripRef = await addDoc(collection(firestore, 'trips'), tripData);

// // //       const userUpdates: any = {
// // //         currentActiveTripId: newTripRef.id,
// // //         updatedAt: serverTimestamp(),
// // //       };

// // //       if (data.facebookProfile) userUpdates.facebookProfile = data.facebookProfile;
// // //       if (data.instagramProfile) userUpdates.instagramProfile = data.instagramProfile;
// // //       if (data.tiktokProfile) userUpdates.tiktokProfile = data.tiktokProfile;

// // //       await updateDoc(doc(firestore, 'users', user.uid), userUpdates);

// // //       // لو في callback (من booking-action-card) → استدعيه لربط الرحلة بالحجز
// // //       if (onTripCreated) {
// // //         await onTripCreated(newTripRef.id);
// // //       }

// // //       toast({ title: t('successAdd') + ' ✅' });
// // //       onOpenChange(false);
// // //       form.reset();
// // //     } catch (error: any) {
// // //       toast({
// // //         variant: 'destructive',
// // //         title: t('errorAdd'),
// // //         description: error?.message || t('errorAddDesc')
// // //       });
// // //     } finally {
// // //       setIsSubmitting(false);
// // //     }
// // //   };
// // //   return (
// // //     <Dialog open={isOpen} onOpenChange={onOpenChange}>
// // //       <DialogContent className="sm:max-w-3xl">
// // //         <DialogHeader>
// // //           <DialogTitle> {t('title')}</DialogTitle>
// // //           <DialogDescription>
// // //             {t('desc')}
// // //           </DialogDescription>
// // //         </DialogHeader>

// // //         {isExpired ? (
// // //           <div className="p-10 flex flex-col items-center text-center space-y-6 animate-in fade-in zoom-in duration-500 bg-destructive/5 rounded-[2.5rem] border-2 border-destructive/20 my-4">
// // //             <div className="w-20 h-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center shadow-inner">
// // //               <Lock className="w-10 h-10 animate-pulse" />
// // //             </div>

// // //             <div className="space-y-2">
// // //               <h3 className="text-2xl font-black text-foreground tracking-tight uppercase">
// // //                 {t('expiredTitle')}
// // //               </h3>
// // //               <p className="text-sm text-muted-foreground font-bold leading-relaxed max-w-sm mx-auto  ">
// // //                 {t('expiredDesc')}
// // //               </p>
// // //             </div>

// // //             <Button
// // //               className="w-full h-14 rounded-2xl bg-primary text-black font-black text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
// // //               onClick={() => router.push('/carrier/Permanent')}
// // //             >
// // //               {t('expiredBtn')}
// // //             </Button>
// // //           </div>
// // //         ) : (
// // //           <Form {...form}>
// // //             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

// // //               {/* ── بانر معلومات الطلب (يظهر فقط لو الديالوج اتفتح من حجز مسافر) ── */}
// // //               {prefill?.requestId && (
// // //                 <div className="bg-primary/10 border border-primary/30 rounded-xl p-3 flex items-start gap-3 text-sm">
// // //                   <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
// // //                   <div>
// // //                     <p className="font-bold text-foreground">رحلة مرتبطة بطلب مسافر</p>
// // //                     <p className="text-muted-foreground">
// // //                       المسار: {prefill.origin || '—'} ← {prefill.destination || '—'}
// // //                       {prefill.passengers ? ` · ${prefill.passengers} مقعد محجوز مسبقاً` : ''}
// // //                     </p>
// // //                   </div>
// // //                 </div>
// // //               )}

// // //               <Card className="bg-muted/30 border-accent/20">
// // //                 <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
// // //                   <div className="space-y-2">
// // //                     <Label className="flex items-center gap-2 font-bold text-accent">
// // //                       <PlaneTakeoff className="h-4 w-4" /> {t('from')}
// // //                     </Label>

// // //                     <Select
// // //                       onValueChange={handleOriginCountryChange}
// // //                       value={originCountry}
// // //                       disabled={isLoadingMarkets || !!prefill?.originCountry}
// // //                     >
// // //                       <SelectTrigger className="bg-background">
// // //                         <SelectValue placeholder={t('originCountry')} />
// // //                       </SelectTrigger>
// // //                       <SelectContent>
// // //                         {activeMarkets.map((m) => (
// // //                           <SelectItem key={m.id} value={m.id}>
// // //                             {m.name}
// // //                           </SelectItem>
// // //                         ))}
// // //                       </SelectContent>
// // //                     </Select>

// // //                     <FormField
// // //                       control={form.control}
// // //                       name="origin"
// // //                       render={({ field }) => (
// // //                         <FormItem>
// // //                           <FormControl>
// // //                             <Select
// // //                               onValueChange={field.onChange}
// // //                               value={field.value}
// // //                               disabled={!originCountry || !!prefill?.origin}
// // //                             >
// // //                               <SelectTrigger className="bg-background">
// // //                                 <SelectValue placeholder={t('originCity')} />
// // //                               </SelectTrigger>
// // //                               <SelectContent>
// // //                                 {originCities.map((cityKey) => (
// // //                                   <SelectItem key={cityKey} value={cityKey}>
// // //                                     {getCityName(cityKey, locale)}
// // //                                   </SelectItem>
// // //                                 ))}
// // //                               </SelectContent>
// // //                             </Select>
// // //                           </FormControl>
// // //                           <FormMessage />
// // //                         </FormItem>
// // //                       )}
// // //                     />
// // //                   </div>

// // //                   <div className="space-y-2">
// // //                     <Label className="flex items-center gap-2 font-bold text-accent">
// // //                       <PlaneLanding className="h-4 w-4" />{t('to')}
// // //                     </Label>

// // //                     <Select
// // //                       onValueChange={handleDestCountryChange}
// // //                       value={destinationCountry}
// // //                       disabled={isLoadingMarkets || !!prefill?.destinationCountry}
// // //                     >
// // //                       <SelectTrigger className="bg-background">
// // //                         <SelectValue placeholder={t('destinationCountry')} />
// // //                       </SelectTrigger>
// // //                       <SelectContent>
// // //                         {activeMarkets
// // //                           .filter((m) => m.id !== originCountry)
// // //                           .map((m) => (
// // //                             <SelectItem key={m.id} value={m.id}>
// // //                               {m.name}
// // //                             </SelectItem>
// // //                           ))}
// // //                       </SelectContent>
// // //                     </Select>

// // //                     <FormField
// // //                       control={form.control}
// // //                       name="destination"
// // //                       render={({ field }) => (
// // //                         <FormItem>
// // //                           <FormControl>
// // //                             <Select
// // //                               onValueChange={field.onChange}
// // //                               value={field.value}
// // //                               disabled={!destinationCountry || !!prefill?.destination}
// // //                             >
// // //                               <SelectTrigger className="bg-background">
// // //                                 <SelectValue placeholder={t('destinationCity')} />
// // //                               </SelectTrigger>
// // //                               <SelectContent>
// // //                                 {destinationCities.map((cityKey) => (
// // //                                   <SelectItem key={cityKey} value={cityKey}>
// // //                                     {getCityName(cityKey, locale)}
// // //                                   </SelectItem>
// // //                                 ))}
// // //                               </SelectContent>
// // //                             </Select>
// // //                           </FormControl>
// // //                           <FormMessage />
// // //                         </FormItem>
// // //                       )}
// // //                     />
// // //                   </div>
// // //                 </CardContent>
// // //               </Card>

// // //               <Accordion type="single" collapsible className="w-full" defaultValue="social">
// // //                 {/* <AccordionItem value="social" className="border rounded-lg bg-primary/5 border-primary/20">
// // //                   <AccordionTrigger className="p-4 font-black text-sm hover:no-underline text-primary">
// // //                     <div className="flex items-center gap-2">
// // //                       <ShieldCheck className="h-4 w-4" />
// // //                       {t('social')}
// // //                     </div>
// // //                   </AccordionTrigger>

// // //                   <AccordionContent className="p-4 pt-0 space-y-4">
// // //                     <div className="bg-background/50 p-3 rounded-xl border border-dashed border-primary/20 flex gap-2 items-start mb-4">
// // //                       <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
// // //                       <p className="text-[10px] leading-relaxed text-muted-foreground">
// // //                         {t('socialInfo')}
// // //                       </p>
// // //                     </div>

// // //                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// // //                       <FormField
// // //                         control={form.control}
// // //                         name="facebookProfile"
// // //                         render={({ field }) => (
// // //                           <FormItem>
// // //                             <FormLabel className="flex items-center gap-1 text-[10px] font-black">
// // //                               <Facebook className="h-3 w-3 text-blue-600" /> {t('facebook')}
// // //                             </FormLabel>
// // //                             <FormControl>
// // //                               <Input
// // //                                 placeholder="https://facebook.com/..."
// // //                                 className="bg-card text-[10px] ltr"
// // //                                 {...field}
// // //                               />
// // //                             </FormControl>
// // //                             <FormMessage />
// // //                           </FormItem>
// // //                         )}
// // //                       />

// // //                       <FormField
// // //                         control={form.control}
// // //                         name="instagramProfile"
// // //                         render={({ field }) => (
// // //                           <FormItem>
// // //                             <FormLabel className="flex items-center gap-1 text-[10px] font-black">
// // //                               <Instagram className="h-3 w-3 text-pink-600" /> {t('instagram')}
// // //                             </FormLabel>
// // //                             <FormControl>
// // //                               <Input
// // //                                 placeholder="https://instagram.com/..."
// // //                                 className="bg-card text-[10px] ltr"
// // //                                 {...field}
// // //                               />
// // //                             </FormControl>
// // //                             <FormMessage />
// // //                           </FormItem>
// // //                         )}
// // //                       />

// // //                       <FormField
// // //                         control={form.control}
// // //                         name="tiktokProfile"
// // //                         render={({ field }) => (
// // //                           <FormItem>
// // //                             <FormLabel className="flex items-center gap-1 text-[10px] font-black">
// // //                               <Video className="h-3 w-3 text-foreground" /> {t('tiktok')}
// // //                             </FormLabel>
// // //                             <FormControl>
// // //                               <Input
// // //                                 placeholder="https://tiktok.com/@..."
// // //                                 className="bg-card text-[10px] ltr"
// // //                                 {...field}
// // //                               />
// // //                             </FormControl>
// // //                             <FormMessage />
// // //                           </FormItem>
// // //                         )}
// // //                       />
// // //                     </div>
// // //                   </AccordionContent>
// // //                 </AccordionItem> */}

// // //                 <AccordionItem value="details" className="border rounded-lg bg-muted/30 mt-4">
// // //                   <AccordionTrigger className="p-4 font-semibold text-sm hover:no-underline">
// // //                     <div className="flex items-center gap-2">
// // //                       <Settings className="h-4 w-4" />
// // //                       {t('details')}
// // //                     </div>
// // //                   </AccordionTrigger>

// // //                   <AccordionContent className="p-4 pt-0 space-y-4">
// // //                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // //                       <FormField
// // //                         control={form.control}
// // //                         name="departureDate"
// // //                         render={({ field }) => (
// // //                           <FormItem className="flex flex-col">
// // //                             <FormLabel>{t('departureDate')}</FormLabel>
// // //                             <FormControl>
// // //                               <div className="relative">
// // //                                 <Input
// // //                                   type="date"
// // //                                   className="bg-card block w-full pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
// // //                                   {...field}
// // //                                   value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
// // //                                   onChange={(e) =>
// // //                                     field.onChange(e.target.value ? new Date(e.target.value) : undefined)
// // //                                   }
// // //                                   min={new Date().toISOString().split('T')[0]}
// // //                                   disabled={isLoadingMarkets || !!prefill?.destinationCountry}

// // //                                 />
// // //                                 <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-primary cursor-pointer" />
// // //                               </div>
// // //                             </FormControl>
// // //                             <FormMessage />
// // //                           </FormItem>
// // //                         )}
// // //                       />

// // //                       <FormField
// // //                         control={form.control}
// // //                         name="departureTime"
// // //                         render={({ field }) => (
// // //                           <FormItem className="flex flex-col">
// // //                             <FormLabel>{t('departureTime')}</FormLabel>
// // //                             <FormControl>
// // //                               <div className="relative">
// // //                                 <Input
// // //                                   type="time"
// // //                                   className="bg-card pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
// // //                                   {...field}
// // //                                 />
// // //                                 <Clock className="absolute right-3 top-2.5 h-4 w-4 text-primary pointer-events-none" />
// // //                               </div>
// // //                             </FormControl>
// // //                             <FormMessage />
// // //                           </FormItem>
// // //                         )}
// // //                       />
// // //                     </div>

// // //                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // //                       <FormField
// // //                         control={form.control}
// // //                         name="availableSeats"
// // //                         // disabled={isLoadingMarkets || !!prefill?.destinationCountry}

// // //                         render={({ field }) => (
// // //                           <FormItem>
// // //                             <FormLabel>{t('availableSeats')}</FormLabel>
// // //                             <FormControl>
// // //                               <Input className="bg-card" type="number" {...field} />
// // //                             </FormControl>
// // //                             <FormMessage />
// // //                           </FormItem>
// // //                         )}
// // //                       />

// // //                       <FormField
// // //                         control={form.control}
// // //                         name="estimatedDurationHours"
// // //                         render={({ field }) => (
// // //                           <FormItem>
// // //                             <FormLabel className="flex items-center gap-1">
// // //                               <Clock className="h-4 w-4 text-primary font-bold" />
// // //                               {t('duration')}
// // //                             </FormLabel>
// // //                             <FormControl>
// // //                               <Input className="bg-card border-primary/50" type="number" {...field} />
// // //                             </FormControl>
// // //                             <p className="text-[10px] text-muted-foreground">
// // //                               {t('ticketTravel')}
// // //                             </p>
// // //                             <FormMessage />
// // //                           </FormItem>
// // //                         )}
// // //                       />
// // //                     </div>

// // //                     <FormField
// // //                       control={form.control}
// // //                       name="meetingPoint"
// // //                       render={({ field }) => (
// // //                         <FormItem>
// // //                           <FormLabel className="flex items-center gap-1">
// // //                             <MapPin className="h-4 w-4" />
// // //                             {t('meetingPoint')}
// // //                           </FormLabel>
// // //                           <FormControl>
// // //                             <Input className="bg-card" placeholder={t('meetingPointPlaceholder')} {...field} />
// // //                           </FormControl>
// // //                           <FormMessage />
// // //                         </FormItem>
// // //                       )}
// // //                     />

// // //                     <FormField
// // //                       control={form.control}
// // //                       name="meetingPointLink"
// // //                       render={({ field }) => (
// // //                         <FormItem>
// // //                           <FormLabel className="flex items-center gap-1">
// // //                             <MapPin className="h-4 w-4" />
// // //                             {t('linkLocation')}
// // //                           </FormLabel>
// // //                           <FormControl>
// // //                             <Input
// // //                               className="bg-card ltr text-sm"
// // //                               placeholder="https://maps.google.com/..."
// // //                               {...field}
// // //                             />
// // //                           </FormControl>
// // //                           <p className="text-[10px] text-muted-foreground flex items-center gap-1">
// // //                             <MapPin className="h-3 w-3" />
// // //                             {t('linkDec')}
// // //                           </p>
// // //                           <FormMessage />
// // //                         </FormItem>
// // //                       )}
// // //                     />
// // //                   </AccordionContent>
// // //                 </AccordionItem>
// // //               </Accordion>

// // //               <DialogFooter className="gap-2 sm:gap-0 pt-4">
// // //                 <Button
// // //                   type="button"
// // //                   variant="secondary"
// // //                   onClick={() => onOpenChange(false)}
// // //                   disabled={isSubmitting}
// // //                 >
// // //                   {t('cancel')}
// // //                 </Button>

// // //                 <Button
// // //                   type="submit"
// // //                   disabled={isSubmitting}
// // //                   className="font-black text-sm rounded-2xl shadow-md"
// // //                 >
// // //                   {isSubmitting ? (
// // //                     <>
// // //                       <Loader2 className="ml-2 h-5 w-5 animate-spin" />
// // //                       {t('submitting')}
// // //                     </>
// // //                   ) : (
// // //                     <>
// // //                       <Send className="ml-2 h-5 w-5" />
// // //                       {t('submit')}
// // //                     </>
// // //                   )}
// // //                 </Button>
// // //               </DialogFooter>
// // //             </form>
// // //           </Form>
// // //         )}
// // //       </DialogContent>
// // //     </Dialog>
// // //   );
// // // }
// // 'use client';

// // import { useState, useMemo, useEffect, useCallback } from 'react';
// // import { useForm } from 'react-hook-form';
// // import { zodResolver } from '@hookform/resolvers/zod';
// // import { z } from 'zod';
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogHeader,
// //   DialogTitle,
// //   DialogDescription,
// //   DialogFooter,
// // } from '@/components/ui/dialog';
// // import {
// //   Form,
// //   FormControl,
// //   FormField,
// //   FormItem,
// //   FormLabel,
// //   FormMessage,
// // } from '@/components/ui/form';
// // import { Button } from '@/components/ui/button';
// // import { Input } from '@/components/ui/input';
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from '@/components/ui/select';
// // import { Card, CardContent } from '@/components/ui/card';
// // import { useToast } from '@/hooks/use-toast';
// // import { useFirestore, useUser } from '@/firebase';
// // import { useUserProfile } from '@/hooks/use-user-profile';
// // import { collection, serverTimestamp, doc, updateDoc, addDoc, getDoc } from 'firebase/firestore';
// // import { FirebaseError } from 'firebase/app';
// // import {
// //   Loader2,
// //   Send,
// //   Clock,
// //   PlaneTakeoff,
// //   PlaneLanding,
// //   Settings,
// //   MapPin,
// //   Calendar as CalendarIcon,
// //   Lock,
// //   Facebook,
// //   Instagram,
// //   Video,
// //   Info,
// //   ShieldCheck,
// //   Wallet,
// // } from 'lucide-react';
// // import { format } from 'date-fns';
// // import { Label } from '@/components/ui/label';
// // import {
// //   Accordion,
// //   AccordionContent,
// //   AccordionItem,
// //   AccordionTrigger,
// // } from '@/components/ui/accordion';
// // import { getCityName } from '@/lib/constants';
// // import { combineDateAndTime } from '@/lib/formatters';
// // import { useLocale, useTranslations } from 'next-intl';
// // import { useActiveMarkets } from '@/hooks/use-active-markets';
// // import { useRouter } from '@/i18n/routing';
// // import { useCarrierStatus } from '@/hooks/use-carrier-status';

// // const addTripSchema = z.object({
// //   origin: z.string().min(1, 'مدينة الانطلاق مطلوبة'),
// //   destination: z.string().min(1, 'مدينة الوصول مطلوبة'),
// //   departureDate: z.date({ required_error: 'تاريخ المغادرة مطلوب' }),
// //   departureTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
// //     message: 'الرجاء إدخل وقت صالح (صيغة 24 ساعة HH:MM)',
// //   }),
// //   meetingPoint: z.string().min(3, 'نقطة التجمع مطلوبة'),
// //   meetingPointLink: z.string().url('الرجاء إدخال رابط خرائط جوجل صالح').min(1, 'رابط الموقع على الخريطة مطلوب'),
// //   availableSeats: z.coerce.number().int().min(1, 'يجب توفر مقعد واحد على الأقل'),
// //   estimatedDurationHours: z.coerce.number().int().min(1, 'مدة الرحلة التقديرية إجبارية'),
// //   conditions: z.string().max(200, 'الشروط يجب ألا تتجاوز 200 حرف').optional(),
// //   facebookProfile: z.string().url('رابط فيسبوك غير صالح').optional().or(z.literal('')),
// //   instagramProfile: z.string().url('رابط إنستغرام غير صالح').optional().or(z.literal('')),
// //   tiktokProfile: z.string().url('رابط تيك توك غير صالح').optional().or(z.literal('')),
// //   price: z.coerce.number().positive('السعر يجب أن يكون رقماً موجباً').optional(),
// //   currency: z.string().optional(),
// //   depositPercentage: z.coerce.number().min(0).optional(),
// // });

// // type AddTripFormValues = z.infer<typeof addTripSchema>;

// // interface AddTripDialogProps {
// //   isOpen: boolean;
// //   onOpenChange: (isOpen: boolean) => void;
// //   /** بيانات مسبقة من طلب المسافر لتعبئة الرحلة أوتوماتيك */
// //   prefill?: {
// //     origin?: string;
// //     originCountry?: string;
// //     destination?: string;
// //     destinationCountry?: string;
// //     departureDate?: Date;
// //     passengers?: number;
// //     requestId?: string;
// //   };
// //   /** callback بعد إنشاء الرحلة — يُستخدم لربط الـ booking بالرحلة الجديدة */
// //   onTripCreated?: (newTripId: string) => Promise<void>;
// // }

// // export function AddTripDialog({ isOpen, onOpenChange, prefill, onTripCreated }: AddTripDialogProps) {
// //   const { toast } = useToast();
// //   const firestore = useFirestore();
// //   const { user } = useUser();
// //   const { profile } = useUserProfile();
// //   const router = useRouter();
// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const locale = useLocale();
// //   const { activeMarkets, isLoading: isLoadingMarkets } = useActiveMarkets();
// //   const { isExpired } = useCarrierStatus(profile?.expiryDate);
// //   const t = useTranslations('addTripDialog');
// //   const [originCountry, setOriginCountry] = useState('');
// //   const [destinationCountry, setDestinationCountry] = useState('');

// //   const form = useForm<AddTripFormValues>({
// //     resolver: zodResolver(addTripSchema),
// //     defaultValues: {
// //       origin: '',
// //       destination: '',
// //       departureTime: '',
// //       meetingPoint: '',
// //       meetingPointLink: '',
// //       availableSeats: 4,
// //       estimatedDurationHours: 3,
// //       conditions: '',
// //       facebookProfile: '',
// //       instagramProfile: '',
// //       tiktokProfile: '',
// //       price: undefined,
// //       currency: undefined,
// //       depositPercentage: undefined,
// //     },
// //   });

// //   useEffect(() => {
// //     if (isOpen && profile) {
// //       // الأولوية للـ prefill (من طلب المسافر)، وإلا من jurisdiction الناقل
// //       const originC = prefill?.originCountry || profile.jurisdiction?.origin || '';
// //       const destC = prefill?.destinationCountry || profile.jurisdiction?.destination || '';
// //       // console.log(prefill?.)
// //       if (originC) setOriginCountry(originC);
// //       if (destC) setDestinationCountry(destC);

// //       form.reset({
// //         origin: prefill?.origin || '',
// //         destination: prefill?.destination || '',
// //         estimatedDurationHours: 3,
// //         departureDate: prefill?.departureDate || undefined,
// //         departureTime: '',
// //         meetingPoint: profile.conditions ? '' : '',
// //         meetingPointLink: '',
// //         availableSeats: profile.vehicleCapacity || 4,
// //         conditions: profile.conditions || '',
// //         facebookProfile: (profile as any).facebookProfile || '',
// //         instagramProfile: (profile as any).instagramProfile || '',
// //         tiktokProfile: (profile as any).tiktokProfile || '',
// //       });
// //     }
// //   }, [isOpen, profile, prefill, form]);

// //   const originCities = useMemo(() => {
// //     if (!originCountry) return [];
// //     return activeMarkets.find((m) => m.id === originCountry)?.cities || [];
// //   }, [activeMarkets, originCountry]);

// //   const destinationCities = useMemo(() => {
// //     if (!destinationCountry) return [];
// //     return activeMarkets.find((m) => m.id === destinationCountry)?.cities || [];
// //   }, [activeMarkets, destinationCountry]);

// //   const handleOriginCountryChange = useCallback(
// //     (val: string) => {
// //       setOriginCountry(val);
// //       form.setValue('origin', '');
// //     },
// //     [form]
// //   );

// //   const handleDestCountryChange = useCallback(
// //     (val: string) => {
// //       setDestinationCountry(val);
// //       form.setValue('destination', '');
// //     },
// //     [form]
// //   );

// //   const onSubmit = async (data: AddTripFormValues) => {
// //     if (!firestore || !user || !profile) return;

// //     // تأكد إن الناقل أكمل الشروط الدائمة والبروفيل قبل إنشاء رحلة
// //     if (!profile.isPermanentComplete) {
// //       toast({
// //         variant: 'destructive',
// //         title: t('errorProfile'),
// //         description: t('errorProfileDesc'),
// //       });
// //       onOpenChange(false);
// //       router.push('/carrier/Permanent');
// //       return;
// //     }

// //     if (profile.isPartial || !profile.vehicleType || !profile.vehicleCapacity) {
// //       toast({
// //         variant: 'destructive',
// //         title: t('errorProfile'),
// //         description: t('errorProfileDesc')
// //       });
// //       onOpenChange(false);
// //       router.push('/carrier/profile');
// //       return;
// //     }

// //     if (profile.currentActiveTripId) {
// //       try {
// //         const activeTripRef = doc(firestore, 'trips', profile.currentActiveTripId);
// //         const activeTripSnap = await getDoc(activeTripRef);

// //         if (activeTripSnap.exists()) {
// //           const activeTrip = activeTripSnap.data() as any;

// //           const depDate = activeTrip.departureDate?.toDate?.()
// //             ? activeTrip.departureDate.toDate()
// //             : new Date(activeTrip.departureDate || 0);

// //           const durationHours = activeTrip.estimatedDurationHours || 0;
// //           const endDate = new Date(depDate.getTime() + durationHours * 60 * 60 * 1000);
// //           const hasEnded = endDate < new Date();

// //           if (hasEnded || activeTrip.status === 'Completed' || activeTrip.status === 'Cancelled') {
// //             await updateDoc(doc(firestore, 'users', user.uid), {
// //               currentActiveTripId: null,
// //               updatedAt: serverTimestamp(),
// //             });
// //           } else {
// //             toast({
// //               variant: 'destructive',
// //               title: t('errorActiveTrip'),
// //               description: t('errorActiveTripDesc')
// //             });
// //             return;
// //           }
// //         } else {
// //           await updateDoc(doc(firestore, 'users', user.uid), {
// //             currentActiveTripId: null,
// //             updatedAt: serverTimestamp(),
// //           });
// //         }
// //       } catch (e) {
// //         toast({
// //           variant: 'destructive',
// //           title: t('errorVerify'),
// //           description: t('errorVerifyDesc')
// //         });
// //         return;
// //       }
// //     }

// //     setIsSubmitting(true);

// //     try {
// //       const combinedDepartureDateTime = combineDateAndTime(data.departureDate, data.departureTime);

// //       const tripData: any = {
// //         ...data,
// //         departureDate: combinedDepartureDateTime.toISOString(),
// //         userId: user.uid,
// //         carrierId: user.uid,
// //         carrierName: profile.firstName,
// //         vehicleType: profile.vehicleType || 'غير محدد',
// //         vehiclePlateNumber: profile?.plateNumber || '',
// //         vehicleCapacity: profile?.vehicleCapacity || 0,
// //         numberOfStops: profile.numberOfStops ?? 0,
// //         bagsPerSeat: profile.bagsPerSeat ?? 1,
// //         vehicleCategory: profile.vehicleCapacity && profile.vehicleCapacity > 7 ? 'bus' : 'small',
// //         status: 'Planned' as const,
// //         price: data.price !== undefined ? Number(data.price) : (Number(profile.price) || 0),
// //         currency: data.currency || profile.currency || 'د.أ',
// //         depositPercentage: data.depositPercentage !== undefined ? data.depositPercentage : (profile.depositPercentage ?? 0),
// //         createdAt: serverTimestamp(),
// //         updatedAt: serverTimestamp(),
// //       };

// //       // لو الرحلة مرتبطة بطلب مسافر → سجّل العلاقة واحسب المقاعد المتبقية
// //       if (prefill?.requestId) {
// //         tripData.linkedRequestId = prefill.requestId;
// //         const bookedSeats = prefill.passengers || 0;
// //         const totalCapacity = profile.vehicleCapacity || 4;
// //         tripData.availableSeats = Math.max(0, totalCapacity - bookedSeats);
// //         tripData.bookedSeats = bookedSeats;
// //       }

// //       delete (tripData as any).departureTime;

// //       const newTripRef = await addDoc(collection(firestore, 'trips'), tripData);

// //       const userUpdates: any = {
// //         currentActiveTripId: newTripRef.id,
// //         updatedAt: serverTimestamp(),
// //       };

// //       if (data.facebookProfile) userUpdates.facebookProfile = data.facebookProfile;
// //       if (data.instagramProfile) userUpdates.instagramProfile = data.instagramProfile;
// //       if (data.tiktokProfile) userUpdates.tiktokProfile = data.tiktokProfile;

// //       await updateDoc(doc(firestore, 'users', user.uid), userUpdates);

// //       // لو في callback (من booking-action-card) → استدعيه لربط الرحلة بالحجز
// //       if (onTripCreated) {
// //         await onTripCreated(newTripRef.id);
// //       }

// //       toast({ title: t('successAdd') + ' ✅' });
// //       onOpenChange(false);
// //       form.reset();
// //     } catch (error: any) {
// //       toast({
// //         variant: 'destructive',
// //         title: t('errorAdd'),
// //         description: error?.message || t('errorAddDesc')
// //       });
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };
// //   return (
// //     <Dialog open={isOpen} onOpenChange={onOpenChange}>
// //       <DialogContent className="sm:max-w-3xl">
// //         <DialogHeader>
// //           <DialogTitle> {t('title')}</DialogTitle>
// //           <DialogDescription>
// //             {t('desc')}
// //           </DialogDescription>
// //         </DialogHeader>

// //         {isExpired ? (
// //           <div className="p-10 flex flex-col items-center text-center space-y-6 animate-in fade-in zoom-in duration-500 bg-destructive/5 rounded-[2.5rem] border-2 border-destructive/20 my-4">
// //             <div className="w-20 h-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center shadow-inner">
// //               <Lock className="w-10 h-10 animate-pulse" />
// //             </div>

// //             <div className="space-y-2">
// //               <h3 className="text-2xl font-black text-foreground tracking-tight uppercase">
// //                 {t('expiredTitle')}
// //               </h3>
// //               <p className="text-sm text-muted-foreground font-bold leading-relaxed max-w-sm mx-auto  ">
// //                 {t('expiredDesc')}
// //               </p>
// //             </div>

// //             <Button
// //               className="w-full h-14 rounded-2xl bg-primary text-black font-black text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
// //               onClick={() => router.push('/carrier/Permanent')}
// //             >
// //               {t('expiredBtn')}
// //             </Button>
// //           </div>
// //         ) : (
// //           <Form {...form}>
// //             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

// //               {/* ── بانر معلومات الطلب (يظهر فقط لو الديالوج اتفتح من حجز مسافر) ── */}
// //               {prefill?.requestId && (
// //                 <div className="bg-primary/10 border border-primary/30 rounded-xl p-3 flex items-start gap-3 text-sm">
// //                   <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
// //                   <div>
// //                     <p className="font-bold text-foreground">رحلة مرتبطة بطلب مسافر</p>
// //                     <p className="text-muted-foreground">
// //                       المسار: {prefill.origin || '—'} ← {prefill.destination || '—'}
// //                       {prefill.passengers ? ` · ${prefill.passengers} مقعد محجوز مسبقاً` : ''}
// //                     </p>
// //                   </div>
// //                 </div>
// //               )}

// //               <Card className="bg-muted/30 border-accent/20">
// //                 <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
// //                   <div className="space-y-2">
// //                     <Label className="flex items-center gap-2 font-bold text-accent">
// //                       <PlaneTakeoff className="h-4 w-4" /> {t('from')}
// //                     </Label>

// //                     <Select
// //                       onValueChange={handleOriginCountryChange}
// //                       value={originCountry}
// //                       disabled={isLoadingMarkets || !!prefill?.originCountry}
// //                     >
// //                       <SelectTrigger className="bg-background">
// //                         <SelectValue placeholder={t('originCountry')} />
// //                       </SelectTrigger>
// //                       <SelectContent>
// //                         {activeMarkets.map((m) => (
// //                           <SelectItem key={m.id} value={m.id}>
// //                             {m.name}
// //                           </SelectItem>
// //                         ))}
// //                       </SelectContent>
// //                     </Select>

// //                     <FormField
// //                       control={form.control}
// //                       name="origin"
// //                       render={({ field }) => (
// //                         <FormItem>
// //                           <FormControl>
// //                             <Select
// //                               onValueChange={field.onChange}
// //                               value={field.value}
// //                               disabled={!originCountry || !!prefill?.origin}
// //                             >
// //                               <SelectTrigger className="bg-background">
// //                                 <SelectValue placeholder={t('originCity')} />
// //                               </SelectTrigger>
// //                               <SelectContent>
// //                                 {originCities.map((cityKey) => (
// //                                   <SelectItem key={cityKey} value={cityKey}>
// //                                     {getCityName(cityKey, locale)}
// //                                   </SelectItem>
// //                                 ))}
// //                               </SelectContent>
// //                             </Select>
// //                           </FormControl>
// //                           <FormMessage />
// //                         </FormItem>
// //                       )}
// //                     />
// //                   </div>

// //                   <div className="space-y-2">
// //                     <Label className="flex items-center gap-2 font-bold text-accent">
// //                       <PlaneLanding className="h-4 w-4" />{t('to')}
// //                     </Label>

// //                     <Select
// //                       onValueChange={handleDestCountryChange}
// //                       value={destinationCountry}
// //                       disabled={isLoadingMarkets || !!prefill?.destinationCountry}
// //                     >
// //                       <SelectTrigger className="bg-background">
// //                         <SelectValue placeholder={t('destinationCountry')} />
// //                       </SelectTrigger>
// //                       <SelectContent>
// //                         {activeMarkets
// //                           .filter((m) => m.id !== originCountry)
// //                           .map((m) => (
// //                             <SelectItem key={m.id} value={m.id}>
// //                               {m.name}
// //                             </SelectItem>
// //                           ))}
// //                       </SelectContent>
// //                     </Select>

// //                     <FormField
// //                       control={form.control}
// //                       name="destination"
// //                       render={({ field }) => (
// //                         <FormItem>
// //                           <FormControl>
// //                             <Select
// //                               onValueChange={field.onChange}
// //                               value={field.value}
// //                               disabled={!destinationCountry || !!prefill?.destination}
// //                             >
// //                               <SelectTrigger className="bg-background">
// //                                 <SelectValue placeholder={t('destinationCity')} />
// //                               </SelectTrigger>
// //                               <SelectContent>
// //                                 {destinationCities.map((cityKey) => (
// //                                   <SelectItem key={cityKey} value={cityKey}>
// //                                     {getCityName(cityKey, locale)}
// //                                   </SelectItem>
// //                                 ))}
// //                               </SelectContent>
// //                             </Select>
// //                           </FormControl>
// //                           <FormMessage />
// //                         </FormItem>
// //                       )}
// //                     />
// //                   </div>
// //                 </CardContent>
// //               </Card>

// //               <Accordion type="single" collapsible className="w-full" defaultValue="social">
// //                 <AccordionItem value="details" className="border border-[#AE9E6D] rounded-lg bg-muted/30 mt-4">
// //                   <AccordionTrigger className="p-4 font-semibold text-sm hover:no-underline">
// //                     <div className="flex items-center gap-2">
// //                       <Settings className="h-4 w-4" />
// //                       {t('details')}
// //                     </div>
// //                   </AccordionTrigger>

// //                   <AccordionContent className="p-4 pt-0 space-y-4">
// //                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// //                       <FormField
// //                         control={form.control}
// //                         name="departureDate"
// //                         render={({ field }) => (
// //                           <FormItem className="flex flex-col">
// //                             <FormLabel>{t('departureDate')}</FormLabel>
// //                             <FormControl>
// //                               <div className="relative">
// //                                 <Input
// //                                   type="date"
// //                                   className="bg-card block w-full pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
// //                                   {...field}
// //                                   value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
// //                                   onChange={(e) =>
// //                                     field.onChange(e.target.value ? new Date(e.target.value) : undefined)
// //                                   }
// //                                   min={new Date().toISOString().split('T')[0]}
// //                                   disabled={isLoadingMarkets || !!prefill?.destinationCountry}

// //                                 />
// //                                 <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-primary cursor-pointer" />
// //                               </div>
// //                             </FormControl>
// //                             <FormMessage />
// //                           </FormItem>
// //                         )}
// //                       />

// //                       <FormField
// //                         control={form.control}
// //                         name="departureTime"
// //                         render={({ field }) => (
// //                           <FormItem className="flex flex-col">
// //                             <FormLabel>{t('departureTime')}</FormLabel>
// //                             <FormControl>
// //                               <div className="relative">
// //                                 <Input
// //                                   type="time"
// //                                   className="bg-card pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
// //                                   {...field}
// //                                 />
// //                                 <Clock className="absolute right-3 top-2.5 h-4 w-4 text-primary pointer-events-none" />
// //                               </div>
// //                             </FormControl>
// //                             <FormMessage />
// //                           </FormItem>
// //                         )}
// //                       />
// //                     </div>

// //                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// //                       <FormField
// //                         control={form.control}
// //                         name="availableSeats"
// //                         // disabled={isLoadingMarkets || !!prefill?.destinationCountry}

// //                         render={({ field }) => (
// //                           <FormItem>
// //                             <FormLabel>{t('availableSeats')}</FormLabel>
// //                             <FormControl>
// //                               <Input className="bg-card" type="number" {...field} />
// //                             </FormControl>
// //                             <FormMessage />
// //                           </FormItem>
// //                         )}
// //                       />

// //                       <FormField
// //                         control={form.control}
// //                         name="estimatedDurationHours"
// //                         render={({ field }) => (
// //                           <FormItem>
// //                             <FormLabel className="flex items-center gap-1">
// //                               <Clock className="h-4 w-4 text-primary font-bold" />
// //                               {t('duration')}
// //                             </FormLabel>
// //                             <FormControl>
// //                               <Input className="bg-card border-primary/50" type="number" {...field} />
// //                             </FormControl>
// //                             <p className="text-[10px] text-muted-foreground">
// //                               {t('ticketTravel')}
// //                             </p>
// //                             <FormMessage />
// //                           </FormItem>
// //                         )}
// //                       />
// //                     </div>

// //                     <FormField
// //                       control={form.control}
// //                       name="meetingPoint"
// //                       render={({ field }) => (
// //                         <FormItem>
// //                           <FormLabel className="flex items-center gap-1">
// //                             <MapPin className="h-4 w-4" />
// //                             {t('meetingPoint')}
// //                           </FormLabel>
// //                           <FormControl>
// //                             <Input className="bg-card" placeholder={t('meetingPointPlaceholder')} {...field} />
// //                           </FormControl>
// //                           <FormMessage />
// //                         </FormItem>
// //                       )}
// //                     />

// //                     <FormField
// //                       control={form.control}
// //                       name="meetingPointLink"
// //                       render={({ field }) => (
// //                         <FormItem>
// //                           <FormLabel className="flex items-center gap-1">
// //                             <MapPin className="h-4 w-4" />
// //                             {t('linkLocation')}
// //                           </FormLabel>
// //                           <FormControl>
// //                             <Input
// //                               className="bg-card ltr text-sm"
// //                               placeholder="https://maps.google.com/..."
// //                               {...field}
// //                             />
// //                           </FormControl>
// //                           <p className="text-[10px] text-muted-foreground flex items-center gap-1">
// //                             <MapPin className="h-3 w-3" />
// //                             {t('linkDec')}
// //                           </p>
// //                           <FormMessage />
// //                         </FormItem>
// //                       )}
// //                     />
// //                   </AccordionContent>
// //                 </AccordionItem>
// //               </Accordion>

// //               {/* ── قسم تعديل التسعير (اختياري) ── */}
// //               <Accordion type="single" collapsible className="w-full">
// //                 <AccordionItem value="pricing" className="border border-[#AE9E6D] rounded-2xl bg-[#251115] px-4">
// //                   <AccordionTrigger className="font-black text-sm hover:no-underline text-primary">
// //                     <div className="flex items-center w-full justify-between pe-5 " >
// //                       <div className="flex items-center gap-2 text-white">
// //                         <Wallet className="h-4 w-4" />
// //                         {t('pricingOverrideTitle')}
// //                       </div>
// //                       <div className="">
// //                         <p className="text-xs text-muted-foreground">
// //                           {t('pricingOverrideDesc')}
// //                         </p>
// //                       </div>
// //                     </div>

// //                   </AccordionTrigger>
// //                   <AccordionContent className="pb-4 pt-2">
// //                     {/* <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
// //                       {t('pricingOverrideDesc')}
// //                     </p> */}
// //                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
// //                       <FormField
// //                         control={form.control}
// //                         name="price"
// //                         render={({ field }) => (
// //                           <FormItem>
// //                             <FormLabel className="text-xs font-bold">{t('pricingOverrideSeatPrice')}</FormLabel>
// //                             <FormControl>
// //                               <Input
// //                                 className="h-12 bg-background font-black text-lg"
// //                                 type="number"
// //                                 placeholder={String(profile?.price ?? '—')}
// //                                 {...field}
// //                                 value={field.value ?? ''}
// //                               />
// //                             </FormControl>
// //                             <FormMessage />
// //                           </FormItem>
// //                         )}
// //                       />
// //                       <FormField
// //                         control={form.control}
// //                         name="currency"
// //                         render={({ field }) => (
// //                           <FormItem>
// //                             <FormLabel className="text-xs font-bold">{t('pricingOverrideCurrency')}</FormLabel>
// //                             <FormControl>
// //                               <Input
// //                                 className="h-12 bg-background font-mono"
// //                                 placeholder={profile?.currency || 'د.أ'}
// //                                 {...field}
// //                                 value={field.value ?? ''}
// //                               />
// //                             </FormControl>
// //                             <FormMessage />
// //                           </FormItem>
// //                         )}
// //                       />
// //                       <FormField
// //                         control={form.control}
// //                         name="depositPercentage"
// //                         render={({ field }) => (
// //                           <FormItem>
// //                             <FormLabel className="text-xs font-bold">{t('pricingOverrideDeposit')}</FormLabel>
// //                             <Select
// //                               onValueChange={(value) => field.onChange(parseInt(value))}
// //                               value={field.value !== undefined ? String(field.value) : ''}
// //                             >
// //                               <FormControl>
// //                                 <SelectTrigger className="h-12 bg-background">
// //                                   <SelectValue placeholder={`${profile?.depositPercentage ?? 0}%`} />
// //                                 </SelectTrigger>
// //                               </FormControl>
// //                               <SelectContent>
// //                                 {[0, 5, 10, 15, 20, 25, 30, 40, 50, 75, 100].map((p) => (
// //                                   <SelectItem key={p} value={String(p)}>
// //                                     {p}%
// //                                   </SelectItem>
// //                                 ))}
// //                               </SelectContent>
// //                             </Select>
// //                             <FormMessage />
// //                           </FormItem>
// //                         )}
// //                       />
// //                     </div>
// //                   </AccordionContent>
// //                 </AccordionItem>
// //               </Accordion>

// //               <DialogFooter className="gap-2 sm:gap-0 pt-4">
// //                 <Button
// //                   type="button"
// //                   variant="secondary"
// //                   onClick={() => onOpenChange(false)}
// //                   disabled={isSubmitting}
// //                 >
// //                   {t('cancel')}
// //                 </Button>

// //                 <Button
// //                   type="submit"
// //                   disabled={isSubmitting}
// //                   className="font-black text-sm rounded-2xl shadow-md"
// //                 >
// //                   {isSubmitting ? (
// //                     <>
// //                       <Loader2 className="ml-2 h-5 w-5 animate-spin" />
// //                       {t('submitting')}
// //                     </>
// //                   ) : (
// //                     <>
// //                       <Send className="ml-2 h-5 w-5" />
// //                       {t('submit')}
// //                     </>
// //                   )}
// //                 </Button>
// //               </DialogFooter>
// //             </form>
// //           </Form>
// //         )}
// //       </DialogContent>
// //     </Dialog>
// //   );
// // }
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
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { Card, CardContent } from '@/components/ui/card';
// import { useToast } from '@/hooks/use-toast';
// import { useFirestore, useUser } from '@/firebase';
// import { useUserProfile } from '@/hooks/use-user-profile';
// import { collection, serverTimestamp, doc, updateDoc, addDoc, getDoc } from 'firebase/firestore';
// import { FirebaseError } from 'firebase/app';
// import {
//   Loader2,
//   Send,
//   Clock,
//   PlaneTakeoff,
//   PlaneLanding,
//   Settings,
//   MapPin,
//   Calendar as CalendarIcon,
//   Lock,
//   Facebook,
//   Instagram,
//   Video,
//   Info,
//   ShieldCheck,
//   Wallet,
// } from 'lucide-react';
// import { format } from 'date-fns';
// import { Label } from '@/components/ui/label';
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from '@/components/ui/accordion';
// import { getCityName } from '@/lib/constants';
// import { combineDateAndTime } from '@/lib/formatters';
// import { useLocale, useTranslations } from 'next-intl';
// import { useActiveMarkets } from '@/hooks/use-active-markets';
// import { useRouter } from '@/i18n/routing';
// import { useCarrierStatus } from '@/hooks/use-carrier-status';

// const addTripSchema = z.object({
//   origin: z.string().min(1, 'مدينة الانطلاق مطلوبة'),
//   destination: z.string().min(1, 'مدينة الوصول مطلوبة'),
//   departureDate: z.date({ required_error: 'تاريخ المغادرة مطلوب' }),
//   departureTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
//     message: 'الرجاء إدخل وقت صالح (صيغة 24 ساعة HH:MM)',
//   }),
//   meetingPoint: z.string().min(3, 'نقطة التجمع مطلوبة'),
//   meetingPointLink: z.string().url('الرجاء إدخال رابط خرائط جوجل صالح').min(1, 'رابط الموقع على الخريطة مطلوب'),
//   availableSeats: z.coerce.number().int().min(1, 'يجب توفر مقعد واحد على الأقل'),
//   estimatedDurationHours: z.coerce.number().int().min(1, 'مدة الرحلة التقديرية إجبارية'),
//   conditions: z.string().max(200, 'الشروط يجب ألا تتجاوز 200 حرف').optional(),
//   facebookProfile: z.string().url('رابط فيسبوك غير صالح').optional().or(z.literal('')),
//   instagramProfile: z.string().url('رابط إنستغرام غير صالح').optional().or(z.literal('')),
//   tiktokProfile: z.string().url('رابط تيك توك غير صالح').optional().or(z.literal('')),
//   price: z.coerce.number().positive('السعر يجب أن يكون رقماً موجباً').optional(),
//   currency: z.string().optional(),
//   depositPercentage: z.coerce.number().min(0).optional(),
// });

// type AddTripFormValues = z.infer<typeof addTripSchema>;

// interface AddTripDialogProps {
//   isOpen: boolean;
//   onOpenChange: (isOpen: boolean) => void;
//   /** بيانات مسبقة من طلب المسافر لتعبئة الرحلة أوتوماتيك */
//   prefill?: {
//     origin?: string;
//     originCountry?: string;
//     destination?: string;
//     destinationCountry?: string;
//     departureDate?: Date;
//     passengers?: number;
//     requestId?: string;
//   };
//   /** callback بعد إنشاء الرحلة — يُستخدم لربط الـ booking بالرحلة الجديدة */
//   onTripCreated?: (newTripId: string) => Promise<void>;
// }

// export function AddTripDialog({ isOpen, onOpenChange, prefill, onTripCreated }: AddTripDialogProps) {
//   const { toast } = useToast();
//   const firestore = useFirestore();
//   const { user } = useUser();
//   const { profile } = useUserProfile();
//   const router = useRouter();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const locale = useLocale();
//   const { activeMarkets, isLoading: isLoadingMarkets } = useActiveMarkets();
//   const { isExpired } = useCarrierStatus(profile?.expiryDate);
//   const t = useTranslations('addTripDialog');
//   const [originCountry, setOriginCountry] = useState('');
//   const [destinationCountry, setDestinationCountry] = useState('');

//   const form = useForm<AddTripFormValues>({
//     resolver: zodResolver(addTripSchema),
//     defaultValues: {
//       origin: '',
//       destination: '',
//       departureTime: '',
//       meetingPoint: '',
//       meetingPointLink: '',
//       availableSeats: 4,
//       estimatedDurationHours: 3,
//       conditions: '',
//       facebookProfile: '',
//       instagramProfile: '',
//       tiktokProfile: '',
//       price: undefined,
//       currency: undefined,
//       depositPercentage: undefined,
//     },
//   });

//   useEffect(() => {
//     if (isOpen && profile) {
//       // الأولوية للـ prefill (من طلب المسافر)، وإلا من jurisdiction الناقل
//       const originC = prefill?.originCountry || profile.jurisdiction?.origin || '';
//       const destC = prefill?.destinationCountry || profile.jurisdiction?.destination || '';
//       // console.log(prefill?.)
//       if (originC) setOriginCountry(originC);
//       if (destC) setDestinationCountry(destC);

//       form.reset({
//         origin: prefill?.origin || '',
//         destination: prefill?.destination || '',
//         estimatedDurationHours: 3,
//         departureDate: prefill?.departureDate || undefined,
//         departureTime: '',
//         meetingPoint: profile.conditions ? '' : '',
//         meetingPointLink: '',
//         availableSeats: profile.vehicleCapacity || 4,
//         conditions: profile.conditions || '',
//         facebookProfile: (profile as any).facebookProfile || '',
//         instagramProfile: (profile as any).instagramProfile || '',
//         tiktokProfile: (profile as any).tiktokProfile || '',
//       });
//     }
//   }, [isOpen, profile, prefill, form]);

//   const originCities = useMemo(() => {
//     if (!originCountry) return [];
//     return activeMarkets.find((m) => m.id === originCountry)?.cities || [];
//   }, [activeMarkets, originCountry]);

//   const destinationCities = useMemo(() => {
//     if (!destinationCountry) return [];
//     return activeMarkets.find((m) => m.id === destinationCountry)?.cities || [];
//   }, [activeMarkets, destinationCountry]);

//   const handleOriginCountryChange = useCallback(
//     (val: string) => {
//       setOriginCountry(val);
//       form.setValue('origin', '');
//     },
//     [form]
//   );

//   const handleDestCountryChange = useCallback(
//     (val: string) => {
//       setDestinationCountry(val);
//       form.setValue('destination', '');
//     },
//     [form]
//   );

//   const onSubmit = async (data: AddTripFormValues) => {
//     if (!firestore || !user || !profile) return;

//     // تأكد إن الناقل أكمل الشروط الدائمة والبروفيل قبل إنشاء رحلة
//     if (!profile.isPermanentComplete) {
//       toast({
//         variant: 'destructive',
//         title: t('errorProfile'),
//         description: t('errorProfileDesc'),
//       });
//       onOpenChange(false);
//       router.push('/carrier/Permanent');
//       return;
//     }

//     if (profile.isPartial || !profile.vehicleType || !profile.vehicleCapacity) {
//       toast({
//         variant: 'destructive',
//         title: t('errorProfile'),
//         description: t('errorProfileDesc')
//       });
//       onOpenChange(false);
//       router.push('/carrier/profile');
//       return;
//     }

//     if (profile.currentActiveTripId) {
//       try {
//         const activeTripRef = doc(firestore, 'trips', profile.currentActiveTripId);
//         const activeTripSnap = await getDoc(activeTripRef);

//         if (activeTripSnap.exists()) {
//           const activeTrip = activeTripSnap.data() as any;

//           const depDate = activeTrip.departureDate?.toDate?.()
//             ? activeTrip.departureDate.toDate()
//             : new Date(activeTrip.departureDate || 0);

//           const durationHours = activeTrip.estimatedDurationHours || 0;
//           const endDate = new Date(depDate.getTime() + durationHours * 60 * 60 * 1000);
//           const hasEnded = endDate < new Date();

//           if (hasEnded || activeTrip.status === 'Completed' || activeTrip.status === 'Cancelled') {
//             await updateDoc(doc(firestore, 'users', user.uid), {
//               currentActiveTripId: null,
//               updatedAt: serverTimestamp(),
//             });
//           } else {
//             toast({
//               variant: 'destructive',
//               title: t('errorActiveTrip'),
//               description: t('errorActiveTripDesc')
//             });
//             return;
//           }
//         } else {
//           await updateDoc(doc(firestore, 'users', user.uid), {
//             currentActiveTripId: null,
//             updatedAt: serverTimestamp(),
//           });
//         }
//       } catch (e) {
//         toast({
//           variant: 'destructive',
//           title: t('errorVerify'),
//           description: t('errorVerifyDesc')
//         });
//         return;
//       }
//     }

//     setIsSubmitting(true);

//     try {
//       const combinedDepartureDateTime = combineDateAndTime(data.departureDate, data.departureTime);

//       const tripData: any = {
//         ...data,
//         departureDate: combinedDepartureDateTime.toISOString(),
//         userId: user.uid,
//         carrierId: user.uid,
//         carrierName: profile.firstName,
//         vehicleType: profile.vehicleType || 'غير محدد',
//         vehiclePlateNumber: profile?.plateNumber || '',
//         vehicleCapacity: profile?.vehicleCapacity || 0,
//         numberOfStops: profile.numberOfStops ?? 0,
//         bagsPerSeat: profile.bagsPerSeat ?? 1,
//         vehicleCategory: profile.vehicleCapacity && profile.vehicleCapacity > 7 ? 'bus' : 'small',
//         status: 'Planned' as const,
//         price: data.price !== undefined ? Number(data.price) : (Number(profile.price) || 0),
//         currency: data.currency || profile.currency || 'د.أ',
//         depositPercentage: data.depositPercentage !== undefined ? data.depositPercentage : (profile.depositPercentage ?? 0),
//         ...(profile.excessWeightFee != null && profile.excessWeightFee > 0 ? { excessWeightFee: profile.excessWeightFee } : {}),
//         createdAt: serverTimestamp(),
//         updatedAt: serverTimestamp(),
//       };

//       // لو الرحلة مرتبطة بطلب مسافر → سجّل العلاقة واحسب المقاعد المتبقية
//       if (prefill?.requestId) {
//         tripData.linkedRequestId = prefill.requestId;
//         const bookedSeats = prefill.passengers || 0;
//         const totalCapacity = profile.vehicleCapacity || 4;
//         tripData.availableSeats = Math.max(0, totalCapacity - bookedSeats);
//         tripData.bookedSeats = bookedSeats;
//       }

//       delete (tripData as any).departureTime;

//       const newTripRef = await addDoc(collection(firestore, 'trips'), tripData);

//       const userUpdates: any = {
//         currentActiveTripId: newTripRef.id,
//         updatedAt: serverTimestamp(),
//       };

//       if (data.facebookProfile) userUpdates.facebookProfile = data.facebookProfile;
//       if (data.instagramProfile) userUpdates.instagramProfile = data.instagramProfile;
//       if (data.tiktokProfile) userUpdates.tiktokProfile = data.tiktokProfile;

//       await updateDoc(doc(firestore, 'users', user.uid), userUpdates);

//       // لو في callback (من booking-action-card) → استدعيه لربط الرحلة بالحجز
//       if (onTripCreated) {
//         await onTripCreated(newTripRef.id);
//       }

//       toast({ title: t('successAdd') + ' ✅' });
//       onOpenChange(false);
//       form.reset();
//     } catch (error: any) {
//       toast({
//         variant: 'destructive',
//         title: t('errorAdd'),
//         description: error?.message || t('errorAddDesc')
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
//   return (
//     <Dialog open={isOpen} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-3xl">
//         <DialogHeader>
//           <DialogTitle> {t('title')}</DialogTitle>
//           <DialogDescription>
//             {t('desc')}
//           </DialogDescription>
//         </DialogHeader>

//         {isExpired ? (
//           <div className="p-10 flex flex-col items-center text-center space-y-6 animate-in fade-in zoom-in duration-500 bg-destructive/5 rounded-[2.5rem] border-2 border-destructive/20 my-4">
//             <div className="w-20 h-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center shadow-inner">
//               <Lock className="w-10 h-10 animate-pulse" />
//             </div>

//             <div className="space-y-2">
//               <h3 className="text-2xl font-black text-foreground tracking-tight uppercase">
//                 {t('expiredTitle')}
//               </h3>
//               <p className="text-sm text-muted-foreground font-bold leading-relaxed max-w-sm mx-auto  ">
//                 {t('expiredDesc')}
//               </p>
//             </div>

//             <Button
//               className="w-full h-14 rounded-2xl bg-primary text-black font-black text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
//               onClick={() => router.push('/carrier/Permanent')}
//             >
//               {t('expiredBtn')}
//             </Button>
//           </div>
//         ) : (
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

//               {/* ── بانر معلومات الطلب (يظهر فقط لو الديالوج اتفتح من حجز مسافر) ── */}
//               {prefill?.requestId && (
//                 <div className="bg-primary/10 border border-primary/30 rounded-xl p-3 flex items-start gap-3 text-sm">
//                   <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
//                   <div>
//                     <p className="font-bold text-foreground">رحلة مرتبطة بطلب مسافر</p>
//                     <p className="text-muted-foreground">
//                       المسار: {prefill.origin || '—'} ← {prefill.destination || '—'}
//                       {prefill.passengers ? ` · ${prefill.passengers} مقعد محجوز مسبقاً` : ''}
//                     </p>
//                   </div>
//                 </div>
//               )}

//               <Card className="bg-muted/30 border-accent/20">
//                 <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
//                   <div className="space-y-2">
//                     <Label className="flex items-center gap-2 font-bold text-accent">
//                       <PlaneTakeoff className="h-4 w-4" /> {t('from')}
//                     </Label>

//                     <Select
//                       onValueChange={handleOriginCountryChange}
//                       value={originCountry}
//                       disabled={isLoadingMarkets || !!prefill?.originCountry}
//                     >
//                       <SelectTrigger className="bg-background">
//                         <SelectValue placeholder={t('originCountry')} />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {activeMarkets.map((m) => (
//                           <SelectItem key={m.id} value={m.id}>
//                             {m.name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>

//                     <FormField
//                       control={form.control}
//                       name="origin"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormControl>
//                             <Select
//                               onValueChange={field.onChange}
//                               value={field.value}
//                               disabled={!originCountry || !!prefill?.origin}
//                             >
//                               <SelectTrigger className="bg-background">
//                                 <SelectValue placeholder={t('originCity')} />
//                               </SelectTrigger>
//                               <SelectContent>
//                                 {originCities.map((cityKey) => (
//                                   <SelectItem key={cityKey} value={cityKey}>
//                                     {getCityName(cityKey, locale)}
//                                   </SelectItem>
//                                 ))}
//                               </SelectContent>
//                             </Select>
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label className="flex items-center gap-2 font-bold text-accent">
//                       <PlaneLanding className="h-4 w-4" />{t('to')}
//                     </Label>

//                     <Select
//                       onValueChange={handleDestCountryChange}
//                       value={destinationCountry}
//                       disabled={isLoadingMarkets || !!prefill?.destinationCountry}
//                     >
//                       <SelectTrigger className="bg-background">
//                         <SelectValue placeholder={t('destinationCountry')} />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {activeMarkets
//                           .filter((m) => m.id !== originCountry)
//                           .map((m) => (
//                             <SelectItem key={m.id} value={m.id}>
//                               {m.name}
//                             </SelectItem>
//                           ))}
//                       </SelectContent>
//                     </Select>

//                     <FormField
//                       control={form.control}
//                       name="destination"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormControl>
//                             <Select
//                               onValueChange={field.onChange}
//                               value={field.value}
//                               disabled={!destinationCountry || !!prefill?.destination}
//                             >
//                               <SelectTrigger className="bg-background">
//                                 <SelectValue placeholder={t('destinationCity')} />
//                               </SelectTrigger>
//                               <SelectContent>
//                                 {destinationCities.map((cityKey) => (
//                                   <SelectItem key={cityKey} value={cityKey}>
//                                     {getCityName(cityKey, locale)}
//                                   </SelectItem>
//                                 ))}
//                               </SelectContent>
//                             </Select>
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                 </CardContent>
//               </Card>

//               <Accordion type="single" collapsible className="w-full" defaultValue="social">
//                 <AccordionItem value="details" className="border border-[#AE9E6D] rounded-lg bg-muted/30 mt-4">
//                   <AccordionTrigger className="p-4 font-semibold text-sm hover:no-underline">
//                     <div className="flex items-center gap-2">
//                       <Settings className="h-4 w-4" />
//                       {t('details')}
//                     </div>
//                   </AccordionTrigger>

//                   <AccordionContent className="p-4 pt-0 space-y-4">
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                       <FormField
//                         control={form.control}
//                         name="departureDate"
//                         render={({ field }) => (
//                           <FormItem className="flex flex-col">
//                             <FormLabel>{t('departureDate')}</FormLabel>
//                             <FormControl>
//                               <div className="relative">
//                                 <Input
//                                   type="date"
//                                   className="bg-card block w-full pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
//                                   {...field}
//                                   value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
//                                   onChange={(e) =>
//                                     field.onChange(e.target.value ? new Date(e.target.value) : undefined)
//                                   }
//                                   min={new Date().toISOString().split('T')[0]}
//                                   disabled={isLoadingMarkets || !!prefill?.destinationCountry}

//                                 />
//                                 <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-primary cursor-pointer" />
//                               </div>
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />

//                       <FormField
//                         control={form.control}
//                         name="departureTime"
//                         render={({ field }) => (
//                           <FormItem className="flex flex-col">
//                             <FormLabel>{t('departureTime')}</FormLabel>
//                             <FormControl>
//                               <div className="relative">
//                                 <Input
//                                   type="time"
//                                   className="bg-card pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
//                                   {...field}
//                                 />
//                                 <Clock className="absolute right-3 top-2.5 h-4 w-4 text-primary pointer-events-none" />
//                               </div>
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                     </div>

//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                       <FormField
//                         control={form.control}
//                         name="availableSeats"
//                         // disabled={isLoadingMarkets || !!prefill?.destinationCountry}

//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>{t('availableSeats')}</FormLabel>
//                             <FormControl>
//                               <Input className="bg-card" type="number" {...field} />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />

//                       <FormField
//                         control={form.control}
//                         name="estimatedDurationHours"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel className="flex items-center gap-1">
//                               <Clock className="h-4 w-4 text-primary font-bold" />
//                               {t('duration')}
//                             </FormLabel>
//                             <FormControl>
//                               <Input className="bg-card border-primary/50" type="number" {...field} />
//                             </FormControl>
//                             <p className="text-[10px] text-muted-foreground">
//                               {t('ticketTravel')}
//                             </p>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                     </div>

//                     <FormField
//                       control={form.control}
//                       name="meetingPoint"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel className="flex items-center gap-1">
//                             <MapPin className="h-4 w-4" />
//                             {t('meetingPoint')}
//                           </FormLabel>
//                           <FormControl>
//                             <Input className="bg-card" placeholder={t('meetingPointPlaceholder')} {...field} />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       control={form.control}
//                       name="meetingPointLink"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel className="flex items-center gap-1">
//                             <MapPin className="h-4 w-4" />
//                             {t('linkLocation')}
//                           </FormLabel>
//                           <FormControl>
//                             <Input
//                               className="bg-card ltr text-sm"
//                               placeholder="https://maps.google.com/..."
//                               {...field}
//                             />
//                           </FormControl>
//                           <p className="text-[10px] text-muted-foreground flex items-center gap-1">
//                             <MapPin className="h-3 w-3" />
//                             {t('linkDec')}
//                           </p>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </AccordionContent>
//                 </AccordionItem>
//               </Accordion>

//               {/* ── قسم تعديل التسعير (اختياري) ── */}
//               <Accordion type="single" collapsible className="w-full">
//                 <AccordionItem value="pricing" className="border border-[#AE9E6D] rounded-2xl bg-[#251115] px-4">
//                   <AccordionTrigger className="font-black text-sm hover:no-underline text-primary">
//                     <div className="flex items-center w-full justify-between pe-5 " >
//                       <div className="flex items-center gap-2 text-white">
//                         <Wallet className="h-4 w-4" />
//                         {t('pricingOverrideTitle')}
//                       </div>
//                       <div className="">
//                         <p className="text-xs text-muted-foreground">
//                           {t('pricingOverrideDesc')}
//                         </p>
//                       </div>
//                     </div>

//                   </AccordionTrigger>
//                   <AccordionContent className="pb-4 pt-2">
//                     {/* <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
//                       {t('pricingOverrideDesc')}
//                     </p> */}
//                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                       <FormField
//                         control={form.control}
//                         name="price"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel className="text-xs font-bold">{t('pricingOverrideSeatPrice')}</FormLabel>
//                             <FormControl>
//                               <Input
//                                 className="h-12 bg-background font-black text-lg"
//                                 type="number"
//                                 placeholder={String(profile?.price ?? '—')}
//                                 {...field}
//                                 value={field.value ?? ''}
//                               />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                       <FormField
//                         control={form.control}
//                         name="currency"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel className="text-xs font-bold">{t('pricingOverrideCurrency')}</FormLabel>
//                             <FormControl>
//                               <Input
//                                 className="h-12 bg-background font-mono"
//                                 placeholder={profile?.currency || 'د.أ'}
//                                 {...field}
//                                 value={field.value ?? ''}
//                               />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                       <FormField
//                         control={form.control}
//                         name="depositPercentage"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel className="text-xs font-bold">{t('pricingOverrideDeposit')}</FormLabel>
//                             <Select
//                               onValueChange={(value) => field.onChange(parseInt(value))}
//                               value={field.value !== undefined ? String(field.value) : ''}
//                             >
//                               <FormControl>
//                                 <SelectTrigger className="h-12 bg-background">
//                                   <SelectValue placeholder={`${profile?.depositPercentage ?? 0}%`} />
//                                 </SelectTrigger>
//                               </FormControl>
//                               <SelectContent>
//                                 {[0, 5, 10, 15, 20, 25, 30, 40, 50, 75, 100].map((p) => (
//                                   <SelectItem key={p} value={String(p)}>
//                                     {p}%
//                                   </SelectItem>
//                                 ))}
//                               </SelectContent>
//                             </Select>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                     </div>
//                   </AccordionContent>
//                 </AccordionItem>
//               </Accordion>

//               <DialogFooter className="gap-2 sm:gap-0 pt-4">
//                 <Button
//                   type="button"
//                   variant="secondary"
//                   onClick={() => onOpenChange(false)}
//                   disabled={isSubmitting}
//                 >
//                   {t('cancel')}
//                 </Button>

//                 <Button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="font-black text-sm rounded-2xl shadow-md"
//                 >
//                   {isSubmitting ? (
//                     <>
//                       <Loader2 className="ml-2 h-5 w-5 animate-spin" />
//                       {t('submitting')}
//                     </>
//                   ) : (
//                     <>
//                       <Send className="ml-2 h-5 w-5" />
//                       {t('submit')}
//                     </>
//                   )}
//                 </Button>
//               </DialogFooter>
//             </form>
//           </Form>
//         )}
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
  Wallet,
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
  price: z.coerce.number().positive('السعر يجب أن يكون رقماً موجباً').optional(),
  currency: z.string().optional(),
  depositPercentage: z.coerce.number().min(0).optional(),
});

type AddTripFormValues = z.infer<typeof addTripSchema>;

interface AddTripDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  /** بيانات مسبقة من طلب المسافر لتعبئة الرحلة أوتوماتيك */
  prefill?: {
    origin?: string;
    originCountry?: string;
    destination?: string;
    destinationCountry?: string;
    departureDate?: Date;
    passengers?: number;
    requestId?: string;
  };
  /** callback بعد إنشاء الرحلة — يُستخدم لربط الـ booking بالرحلة الجديدة */
  onTripCreated?: (newTripId: string) => Promise<void>;
}

export function AddTripDialog({ isOpen, onOpenChange, prefill, onTripCreated }: AddTripDialogProps) {
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
      price: undefined,
      currency: undefined,
      depositPercentage: undefined,
    },
  });

  useEffect(() => {
    if (isOpen && profile) {
      // الأولوية للـ prefill (من طلب المسافر)، وإلا من jurisdiction الناقل
      const originC = prefill?.originCountry || profile.jurisdiction?.origin || '';
      const destC = prefill?.destinationCountry || profile.jurisdiction?.destination || '';
      // console.log(prefill?.)
      if (originC) setOriginCountry(originC);
      if (destC) setDestinationCountry(destC);

      form.reset({
        origin: prefill?.origin || '',
        destination: prefill?.destination || '',
        estimatedDurationHours: 3,
        departureDate: prefill?.departureDate || undefined,
        departureTime: '',
        meetingPoint: profile.conditions ? '' : '',
        meetingPointLink: '',
        availableSeats: profile.vehicleCapacity || 4,
        conditions: profile.conditions || '',
        facebookProfile: (profile as any).facebookProfile || '',
        instagramProfile: (profile as any).instagramProfile || '',
        tiktokProfile: (profile as any).tiktokProfile || '',
      });
    }
  }, [isOpen, profile, prefill, form]);

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

    // تأكد إن الناقل أكمل الشروط الدائمة والبروفيل قبل إنشاء رحلة
    if (!profile.isPermanentComplete) {
      toast({
        variant: 'destructive',
        title: t('errorProfile'),
        description: t('errorProfileDesc'),
      });
      onOpenChange(false);
      router.push('/carrier/Permanent');
      return;
    }

    if (profile.isPartial || !profile.vehicleType || !profile.vehicleCapacity) {
      toast({
        variant: 'destructive',
        title: t('errorProfile'),
        description: t('errorProfileDesc')
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
              title: t('errorActiveTrip'),
              description: t('errorActiveTripDesc')
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
          title: t('errorVerify'),
          description: t('errorVerifyDesc')
        });
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const combinedDepartureDateTime = combineDateAndTime(data.departureDate, data.departureTime);

      const tripData: any = {
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
        price: data.price !== undefined ? Number(data.price) : (Number(profile.price) || 0),
        currency: data.currency || profile.currency || 'د.أ',
        depositPercentage: data.depositPercentage !== undefined ? data.depositPercentage : (profile.depositPercentage ?? 0),
        ...(profile.excessWeightFee != null && profile.excessWeightFee > 0 ? { excessWeightFee: profile.excessWeightFee } : {}),
        ...(profile.conditions ? { conditions: profile.conditions } : {}),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // لو الرحلة مرتبطة بطلب مسافر → سجّل العلاقة واحسب المقاعد المتبقية
      if (prefill?.requestId) {
        tripData.linkedRequestId = prefill.requestId;
        const bookedSeats = prefill.passengers || 0;
        const totalCapacity = profile.vehicleCapacity || 4;
        tripData.availableSeats = Math.max(0, totalCapacity - bookedSeats);
        tripData.bookedSeats = bookedSeats;
      }

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

      // لو في callback (من booking-action-card) → استدعيه لربط الرحلة بالحجز
      if (onTripCreated) {
        await onTripCreated(newTripRef.id);
      }

      toast({ title: t('successAdd') + ' ✅' });
      onOpenChange(false);
      form.reset();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: t('errorAdd'),
        description: error?.message || t('errorAddDesc')
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
                {t('expiredTitle')}
              </h3>
              <p className="text-sm text-muted-foreground font-bold leading-relaxed max-w-sm mx-auto  ">
                {t('expiredDesc')}
              </p>
            </div>

            <Button
              className="w-full h-14 rounded-2xl bg-primary text-black font-black text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
              onClick={() => router.push('/carrier/Permanent')}
            >
              {t('expiredBtn')}
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

              {/* ── بانر معلومات الطلب (يظهر فقط لو الديالوج اتفتح من حجز مسافر) ── */}
              {prefill?.requestId && (
                <div className="bg-primary/10 border border-primary/30 rounded-xl p-3 flex items-start gap-3 text-sm">
                  <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-foreground">رحلة مرتبطة بطلب مسافر</p>
                    <p className="text-muted-foreground">
                      المسار: {prefill.origin || '—'} ← {prefill.destination || '—'}
                      {prefill.passengers ? ` · ${prefill.passengers} مقعد محجوز مسبقاً` : ''}
                    </p>
                  </div>
                </div>
              )}

              <Card className="bg-muted/30 border-accent/20">
                <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 font-bold text-accent">
                      <PlaneTakeoff className="h-4 w-4" /> {t('from')}
                    </Label>

                    <Select
                      onValueChange={handleOriginCountryChange}
                      value={originCountry}
                      disabled={isLoadingMarkets || !!prefill?.originCountry}
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
                              disabled={!originCountry || !!prefill?.origin}
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
                      disabled={isLoadingMarkets || !!prefill?.destinationCountry}
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
                              disabled={!destinationCountry || !!prefill?.destination}
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
                <AccordionItem value="details" className="border border-[#AE9E6D] rounded-lg bg-muted/30 mt-4">
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
                                  className="bg-card block w-full pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                  {...field}
                                  value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
                                  onChange={(e) =>
                                    field.onChange(e.target.value ? new Date(e.target.value) : undefined)
                                  }
                                  min={new Date().toISOString().split('T')[0]}
                                  disabled={isLoadingMarkets || !!prefill?.destinationCountry}

                                />
                                <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-primary cursor-pointer" />
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
                              <div className="relative">
                                <Input
                                  type="time"
                                  className="bg-card pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                  {...field}
                                />
                                <Clock className="absolute right-3 top-2.5 h-4 w-4 text-primary pointer-events-none" />
                              </div>
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
                        // disabled={isLoadingMarkets || !!prefill?.destinationCountry}

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
                            {t('linkLocation')}
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
                            {t('linkDec')}
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* ── قسم تعديل التسعير (اختياري) ── */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="pricing" className="border border-[#AE9E6D] rounded-2xl bg-[#251115] px-4">
                  <AccordionTrigger className="font-black text-sm hover:no-underline text-primary">
                    <div className="flex items-center w-full justify-between pe-5 " >
                      <div className="flex items-center gap-2 text-white">
                        <Wallet className="h-4 w-4" />
                        {t('pricingOverrideTitle')}
                      </div>
                      <div className="">
                        <p className="text-xs text-muted-foreground">
                          {t('pricingOverrideDesc')}
                        </p>
                      </div>
                    </div>

                  </AccordionTrigger>
                  <AccordionContent className="pb-4 pt-2">
                    {/* <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                      {t('pricingOverrideDesc')}
                    </p> */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold">{t('pricingOverrideSeatPrice')}</FormLabel>
                            <FormControl>
                              <Input
                                className="h-12 bg-background font-black text-lg"
                                type="number"
                                placeholder={String(profile?.price ?? '—')}
                                {...field}
                                value={field.value ?? ''}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="currency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold">{t('pricingOverrideCurrency')}</FormLabel>
                            <FormControl>
                              <Input
                                className="h-12 bg-background font-mono"
                                placeholder={profile?.currency || 'د.أ'}
                                {...field}
                                value={field.value ?? ''}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="depositPercentage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold">{t('pricingOverrideDeposit')}</FormLabel>
                            <Select
                              onValueChange={(value) => field.onChange(parseInt(value))}
                              value={field.value !== undefined ? String(field.value) : ''}
                            >
                              <FormControl>
                                <SelectTrigger className="h-12 bg-background">
                                  <SelectValue placeholder={`${profile?.depositPercentage ?? 0}%`} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {[0, 5, 10, 15, 20, 25, 30, 40, 50, 75, 100].map((p) => (
                                  <SelectItem key={p} value={String(p)}>
                                    {p}%
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
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