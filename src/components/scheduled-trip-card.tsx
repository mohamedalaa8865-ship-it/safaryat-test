// // 'use client';

// // import type { UserProfile, Trip, Booking } from '@/lib/data';
// // import { Button } from '@/components/ui/button';
// // import {
// //   Star, Ticket, ChevronDown, Car, Facebook,
// //   Instagram, Video, ShieldCheck, Globe
// // } from 'lucide-react';
// // import { useMemo, useState, useCallback, memo } from 'react';
// // import { TripCardBase } from '@/components/trip/trip-card-base';
// // import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
// // import { useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
// // import { doc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
// // import { CarrierTrustSheet } from './carrier/carrier-trust-sheet';
// // import { BookingSummarySheet } from '@/components/booking/booking-summary-sheet';
// // import { EmailConfirmDialog } from '@/components/booking/email-confirm-dialog';
// // import { useTranslations, useLocale } from 'next-intl';
// // import { cn, triggerHaptic } from '@/lib/utils';
// // import { useToast } from '@/hooks/use-toast';
// // import { EMAILJS_CONFIG } from '@/lib/emailjs';

// // const CarrierInfo = memo(({ trip }: { trip: Trip }) => {
// //   const t = useTranslations('scheduledTripCard');
// //   const firestore = useFirestore();
// //   const { user } = useUser();
// //   const [isTrustSheetOpen, setIsTrustSheetOpen] = useState(false);

// //   const carrierProfileRef = useMemoFirebase(() => {
// //     if (!user || !firestore || !trip.carrierId) return null;
// //     return doc(firestore, 'users', trip.carrierId);
// //   }, [user, firestore, trip.carrierId]);

// //   const { data: carrier } = useDoc<UserProfile>(carrierProfileRef);

// //   const handleOpenTrustSheet = useCallback((e: React.MouseEvent) => {
// //     e.stopPropagation();
// //     triggerHaptic('light');

// //     if (!user) return;

// //     setIsTrustSheetOpen(true);
// //   }, [user]);

// //   return (
// //     <>
// //       <button
// //         onClick={handleOpenTrustSheet}
// //         className="flex items-center gap-3 w-full text-right hover:bg-muted/50 p-2 rounded-xl transition-all group"
// //         type="button"
// //       >
// //         <Avatar className="h-10 w-10 border-2 border-background shadow-md group-hover:border-primary/20 transition-all">
// //           <AvatarImage
// //             src={user ? (carrier?.photoURL || "/default-avatar.png") : "/default-avatar.png"}
// //             alt={carrier?.officeName || carrier?.firstName || trip.carrierName || "Carrier Avatar"}
// //           />
// //           <AvatarFallback className="bg-primary/10 text-primary font-black">
// //             {carrier?.officeName?.[0] || carrier?.firstName?.[0] || trip.carrierName?.[0] || "C"}
// //           </AvatarFallback>
// //         </Avatar>

// //         <div className="flex-1">
// //           <div className="flex items-center gap-1.5">
// //             <p className="text-sm font-bold group-hover:text-primary transition-colors">
// //               {carrier?.officeName || carrier?.firstName || trip.carrierName || '...'}
// //             </p>
// //             {user && carrier?.isVerifiedByAgent && (
// //               <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 fill-emerald-500/10" />
// //             )}
// //           </div>

// //           <div className="flex items-center gap-2 text-xs text-muted-foreground">
// //             <div className="flex items-center gap-1 text-amber-500">
// //               <Star className="h-3 w-3 fill-current" />
// //               <span>{user ? (carrier?.ratingStats?.average?.toFixed(1) || t('new')) : t('new')}</span>
// //             </div>
// //             <span>•</span>
// //             <span>{user ? (carrier?.ratingStats?.count || 0) : 0} {t('ratings')}</span>
// //           </div>
// //         </div>
// //       </button>

// //       {user && (
// //         <CarrierTrustSheet
// //           isOpen={isTrustSheetOpen}
// //           onClose={() => setIsTrustSheetOpen(false)}
// //           carrierId={carrier?.id || null}
// //           carrierName={carrier?.officeName || carrier?.firstName}
// //           carrierTier={carrier?.ratingStats?.tier}
// //         />
// //       )}
// //     </>
// //   );
// // });

// // CarrierInfo.displayName = 'CarrierInfo';

// // const SocialLink = ({ href, icon, color }: { href?: string, icon: React.ReactNode, color: 'blue' | 'pink' | 'default' }) => {
// //   if (!href) return <div className="flex items-center justify-center h-10 rounded-xl bg-muted/10 opacity-30 grayscale">{icon}</div>;

// //   const colors = {
// //     blue: "bg-blue-50 border-blue-100 text-blue-600 hover:bg-blue-100",
// //     pink: "bg-pink-50 border-pink-100 text-pink-600 hover:bg-pink-100",
// //     default: "bg-muted/10 border-muted/20 text-foreground hover:bg-muted/20"
// //   };

// //   return (
// //     <a href={href} target="_blank" rel="noreferrer"
// //       className={cn("flex items-center justify-center h-10 rounded-xl border transition-all active:scale-95", colors[color])}>
// //       {icon}
// //     </a>
// //   );
// // };

// // function CarrierDetailsAccordion({ trip }: { trip: Trip }) {
// //   const [isOpen, setIsOpen] = useState(false);

// //   const toggleAccordion = useCallback(() => {
// //     triggerHaptic('light');
// //     setIsOpen(prev => !prev);
// //   }, []);

// //   return (
// //     <div className="border rounded-xl overflow-hidden text-xs bg-muted/5">
// //       <button
// //         onClick={toggleAccordion}
// //         className="w-full flex items-center justify-between px-4 py-3 bg-muted/20 hover:bg-muted/40 transition-colors"
// //       >
// //         <div className="flex items-center gap-2 font-black text-primary uppercase tracking-tighter">
// //           <Globe className="h-4 w-4" />
// //           <span>هوية الثقة والجسور الاجتماعية</span>
// //         </div>
// //         <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-300", isOpen && "rotate-180")} />
// //       </button>

// //       {isOpen && (
// //         <div className="p-4 space-y-4 bg-background animate-in slide-in-from-top-2 duration-300 border-t border-muted/10">
// //           <div className="grid grid-cols-3 gap-2">
// //             <SocialLink href={trip.facebookProfile} icon={<Facebook className="h-5 w-5" />} color="blue" />
// //             <SocialLink href={trip.instagramProfile} icon={<Instagram className="h-5 w-5" />} color="pink" />
// //             <SocialLink href={trip.tiktokProfile} icon={<Video className="h-5 w-5" />} color="default" />
// //           </div>

// //           <div className="bg-primary/5 p-3 rounded-xl flex gap-2 items-start border border-primary/10">
// //             <ShieldCheck className="h-3 w-3 text-primary shrink-0 mt-0.5" />
// //             <p className="text-[9px] leading-tight text-muted-foreground font-bold text-right">
// //               هذا الناقل مسجل بهوية اجتماعية موثقة. يمكنك مراجعة حساباته الرسمية للتحقق من جودة الخدمة بدلاً من الصور التقليدية.
// //             </p>
// //           </div>

// //           <div className="pt-2">
// //             <div className="flex items-center gap-2 bg-muted/20 p-2 rounded-lg">
// //               <Car className="h-3.5 w-3.5 text-primary shrink-0" />
// //               <div className="flex flex-col">
// //                 <span className="font-bold">{trip.vehicleType || 'مركبة معتمدة'}</span>
// //                 <span className="text-[10px] text-muted-foreground ltr font-medium">{trip.vehiclePlateNumber || 'لوحة رسمية'}</span>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // export function ScheduledTripCard({
// //   trip, booking, onBookNow, onClosureAction, onCancelBooking, onMessageCarrier, context = 'dashboard'
// // }: {
// //   trip: Trip;
// //   booking?: Booking;
// //   onBookNow?: (trip: Trip) => void;
// //   onClosureAction?: (trip: Trip) => void;
// //   onCancelBooking?: (trip: Trip, booking: Booking) => void;
// //   onMessageCarrier?: (booking: Booking, trip: Trip) => void;
// //   context?: 'dashboard' | 'history'
// // }) {
// //   const isTripEnded = useMemo(() => {
// //     const depDate = (trip.departureDate as any)?.toDate?.()
// //       ? (trip.departureDate as any).toDate()
// //       : new Date(trip.departureDate || 0);
// //     const durationHours = (trip as any).estimatedDurationHours || 0;
// //     const endDate = new Date(depDate.getTime() + durationHours * 60 * 60 * 1000);
// //     return endDate < new Date();
// //   }, [trip.departureDate, (trip as any).estimatedDurationHours]);

// //   const t = useTranslations('scheduledTripCard');
// //   const firestore = useFirestore();
// //   const { user } = useUser();
// //   const locale = useLocale();
// //   const { toast } = useToast();

// //   const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
// //   const [isBookingSheetOpen, setIsBookingSheetOpen] = useState(false);
// //   const [confirmedEmail, setConfirmedEmail] = useState('');
// //   const [isSendingEmail, setIsSendingEmail] = useState(false);

// //   const carrierRef = useMemoFirebase(() => {
// //     if (!user || !firestore || !trip.carrierId) return null;
// //     return doc(firestore, 'users', trip.carrierId);
// //   }, [user, firestore, trip.carrierId]);

// //   const { data: carrierProfile } = useDoc<UserProfile>(carrierRef);

// //   const countryCode = useMemo(() => {
// //     return carrierProfile?.operatingCountry || 'JO';
// //   }, [carrierProfile]);


// //   const handleBookClick = useCallback(() => {
// //     triggerHaptic('light');

// //     if (onBookNow) {
// //       onBookNow(trip);
// //       return;
// //     }

// //     setIsBookingSheetOpen(true);
// //   }, [onBookNow, trip]);


// //   const handleSheetConfirm = useCallback(() => {
// //     setIsBookingSheetOpen(false);
// //     setIsEmailDialogOpen(true);
// //   }, []);

// //   const handleEmailConfirmed = useCallback(async (email: string) => {
// //     if (!firestore) {
// //       console.error('❌ Firestore not initialized');
// //       return;
// //     }
// //     setIsSendingEmail(true);
// //     const origin = typeof window !== 'undefined' ? window.location.origin : '';
// //     let tokenDocId: string | null = null;

// //     try {
// //       const tokenDoc = await addDoc(collection(firestore, 'booking_tokens'), {
// //         email,
// //         tripId: trip.id,
// //         carrierId: trip.carrierId,
// //         seatCount: 1,
// //         status: 'pending',
// //         createdAt: serverTimestamp(),
// //         expiresAt: new Date(Date.now() + 30 * 60 * 1000),
// //       });
// //       console.log('✅ Token created:', tokenDoc.id);
// //       tokenDocId = tokenDoc.id;
// //       const confirmUrl = `${origin}/${locale}/confirm-booking?token=${tokenDocId}`;

// //       const emailRes = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({
// //           // service_id: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
// //           // template_id: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
// //           // user_id: process.env.NEXT_PUBLIC_EMAILJS_USER_ID!,
// //           service_id: EMAILJS_CONFIG.serviceId,
// //           template_id: EMAILJS_CONFIG.templateId,
// //           user_id: EMAILJS_CONFIG.userId,
// //           template_params: {
// //             to_email: email,
// //             trip_origin: trip.origin || '--',
// //             trip_destination: trip.destination || '--',
// //             carrier_name: trip.carrierName || '--',
// //             ticket_price: `${trip.price} ${trip.currency}`,
// //             deposit_amount: `${((trip.price ?? 0) * ((trip.depositPercentage ?? 0) / 100)).toFixed(2)}`,
// //             total_due: `${trip.price} ${trip.currency}`,
// //             departure_time: trip.departureDate || '--',
// //             meeting_point: trip.meetingPoint || '--',
// //             confirm_url: confirmUrl,
// //           },
// //         }),
// //       });

// //       if (!emailRes.ok) throw new Error(`EmailJS error: ${emailRes.status}`);

// //       setConfirmedEmail(email);
// //       setIsEmailDialogOpen(false);
// //       toast({ title: 'تم إرسال رسالة التحقق! ✉️', description: `تحقق من بريدك ${email} واضغط على "استكمال الحجز"` });

// //     } catch (error: any) {
// //       console.error('❌ Full error:', error); // شوف الـ console بعد كده
// //       if (tokenDocId) {
// //         const confirmUrl = `${origin}/${locale}/confirm-booking?token=${tokenDocId}`;
// //         toast({ title: 'فشل إرسال الإيميل ⚠️', description: `يمكنك استكمال الحجز مباشرة من هذا الرابط`, action: (<Button size="sm" onClick={() => window.open(confirmUrl, '_blank')}>استكمل الحجز</Button>) });
// //         setIsEmailDialogOpen(false);
// //       } else {
// //         toast({ variant: 'destructive', title: 'فشل إرسال الإيميل', description: 'تحقق من الإيميل وحاول مرة أخرى' });
// //       }
// //     } finally {
// //       setIsSendingEmail(false);
// //     }
// //   }, [firestore, trip, locale, toast]);

// //   const hasSeats = trip.availableSeats && trip.availableSeats > 0;

// //   return (
// //     <>
// //       <TripCardBase trip={trip} headerAction={context === 'dashboard' ? <CarrierInfo trip={trip} /> : undefined}>
// //         {context === 'dashboard' && (
// //           <div className="space-y-3">
// //             <CarrierDetailsAccordion trip={trip} />
// //             {isTripEnded ? (
// //               <div className="w-full mt-2 p-3 bg-muted/50 rounded-xl text-center text-xs text-muted-foreground font-black uppercase tracking-widest border border-dashed border-muted-foreground/20">
// //                 🚫 {t('noSeats')}
// //               </div>
// //             ) : (
// //               <Button size="lg" className="w-full font-black text-lg h-14 rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all mt-2" onClick={handleBookClick} disabled={!hasSeats || isSendingEmail}>
// //                 {!hasSeats ? t('noSeats') : (
// //                   <><Ticket className='ml-2 h-5 w-5' />{t('bookSeat')} ({trip.price} {trip.currency})</>
// //                 )}
// //               </Button>
// //             )}
// //           </div>
// //         )}

// //         {context === 'history' && (
// //           <div className="flex flex-col gap-3">
// //             {onClosureAction && (
// //               <Button size="lg" variant="default" className="w-full bg-primary text-black font-black h-12 rounded-xl" onClick={() => onClosureAction(trip)}>
// //                 {t('closure')}
// //               </Button>
// //             )}
// //             <div className="grid grid-cols-2 gap-2">
// //               {onCancelBooking && booking && (
// //                 <Button size="sm" variant="destructive" className="rounded-xl h-10 font-bold" onClick={() => onCancelBooking(trip, booking)}>
// //                   {t('cancel')}
// //                 </Button>
// //               )}
// //               {booking?.status === 'Confirmed' && onMessageCarrier && (
// //                 <Button size="sm" variant="outline" className="rounded-xl h-10 font-bold border-primary/20" onClick={() => onMessageCarrier(booking, trip)}>
// //                   {t('messageCarrier')}
// //                 </Button>
// //               )}
// //             </div>
// //           </div>
// //         )}
// //       </TripCardBase>

// //       {isBookingSheetOpen && (
// //         <BookingSummarySheet
// //           isOpen={isBookingSheetOpen}
// //           onClose={() => setIsBookingSheetOpen(false)}
// //           onConfirm={handleSheetConfirm}
// //           trip={trip}
// //           confirmedEmail={confirmedEmail}
// //           countryCode={countryCode}
// //         />
// //       )}

// //       {isEmailDialogOpen && (
// //         <EmailConfirmDialog
// //           isOpen={isEmailDialogOpen}
// //           onClose={() => setIsEmailDialogOpen(false)}
// //           onConfirm={handleEmailConfirmed}
// //           trip={trip}
// //         />
// //       )}
// //     </>
// //   );
// // }

// 'use client';

// import type { UserProfile, Trip, Booking } from '@/lib/data';
// import { Button } from '@/components/ui/button';
// import {
//   Star, Ticket, ChevronDown, Car, Facebook,
//   Instagram, Video, ShieldCheck, Globe
// } from 'lucide-react';
// import { useMemo, useState, useCallback, memo } from 'react';
// import { TripCardBase } from '@/components/trip/trip-card-base';
// import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
// import { useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
// import { doc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
// import { useTranslations, useLocale } from 'next-intl';
// import { cn, triggerHaptic } from '@/lib/utils';
// import { useToast } from '@/hooks/use-toast';
// import { EMAILJS_CONFIG } from '@/lib/emailjs';
// import dynamic from 'next/dynamic';

// // 🚀 [PERF-FIX]: تأجيل تحميل النوافذ المنبثقة (Sheets & Dialogs) الثقيلة
// const CarrierTrustSheet = dynamic(() => import('./carrier/carrier-trust-sheet').then(m => ({ default: m.CarrierTrustSheet })), { ssr: false });
// const BookingSummarySheet = dynamic(() => import('@/components/booking/booking-summary-sheet').then(m => ({ default: m.BookingSummarySheet })), { ssr: false });
// const EmailConfirmDialog = dynamic(() => import('@/components/booking/email-confirm-dialog').then(m => ({ default: m.EmailConfirmDialog })), { ssr: false });

// const CarrierInfo = memo(({ trip }: { trip: Trip }) => {
//   const t = useTranslations('scheduledTripCard');
//   const firestore = useFirestore();
//   const { user } = useUser();
//   const [isTrustSheetOpen, setIsTrustSheetOpen] = useState(false);

//   const carrierProfileRef = useMemoFirebase(() => {
//     if (!user || !firestore || !trip.carrierId) return null;
//     return doc(firestore, 'users', trip.carrierId);
//   }, [user, firestore, trip.carrierId]);

//   const { data: carrier } = useDoc<UserProfile>(carrierProfileRef);

//   const handleOpenTrustSheet = useCallback((e: React.MouseEvent) => {
//     e.stopPropagation();
//     triggerHaptic('light');
//     if (!user) return;
//     setIsTrustSheetOpen(true);
//   }, [user]);

//   return (
//     <>
//       <button
//         onClick={handleOpenTrustSheet}
//         aria-label="عرض معلومات الناقل"
//         className="flex items-center gap-3 w-full text-right hover:bg-muted/50 p-2 rounded-xl transition-all group"
//         type="button"
//       >
//         <Avatar className="h-10 w-10 border-2 border-background shadow-md group-hover:border-primary/20 transition-all">
//           <AvatarImage
//             src={user ? (carrier?.photoURL || "/default-avatar.png") : "/default-avatar.png"}
//             alt={carrier?.officeName || carrier?.firstName || trip.carrierName || "Carrier Avatar"}
//           />
//           <AvatarFallback className="bg-primary/10 text-primary font-black">
//             {carrier?.officeName?.[0] || carrier?.firstName?.[0] || trip.carrierName?.[0] || "C"}
//           </AvatarFallback>
//         </Avatar>

//         <div className="flex-1">
//           <div className="flex items-center gap-1.5">
//             <p className="text-sm font-bold group-hover:text-primary transition-colors">
//               {carrier?.officeName || carrier?.firstName || trip.carrierName || '...'}
//             </p>
//             {user && carrier?.isVerifiedByAgent && (
//               <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 fill-emerald-500/10" />
//             )}
//           </div>

//           <div className="flex items-center gap-2 text-xs text-muted-foreground">
//             <div className="flex items-center gap-1 text-amber-500">
//               <Star className="h-3 w-3 fill-current" />
//               <span>{user ? (carrier?.ratingStats?.average?.toFixed(1) || t('new')) : t('new')}</span>
//             </div>
//             <span>•</span>
//             <span>{user ? (carrier?.ratingStats?.count || 0) : 0} {t('ratings')}</span>
//           </div>
//         </div>
//       </button>

//       {user && isTrustSheetOpen && (
//         <CarrierTrustSheet
//           isOpen={isTrustSheetOpen}
//           onClose={() => setIsTrustSheetOpen(false)}
//           carrierId={carrier?.id || null}
//           carrierName={carrier?.officeName || carrier?.firstName}
//           carrierTier={carrier?.ratingStats?.tier}
//         />
//       )}
//     </>
//   );
// });
// CarrierInfo.displayName = 'CarrierInfo';

// // 🚀 [ACCESSIBILITY-FIX]: إضافة aria-label لروابط التواصل الاجتماعي
// const SocialLink = ({ href, icon, color, label }: { href?: string, icon: React.ReactNode, color: 'blue' | 'pink' | 'default', label: string }) => {
//   if (!href) return <div className="flex items-center justify-center h-10 rounded-xl bg-muted/10 opacity-30 grayscale" aria-hidden="true">{icon}</div>;

//   const colors = {
//     blue: "bg-blue-50 border-blue-100 text-blue-600 hover:bg-blue-100",
//     pink: "bg-pink-50 border-pink-100 text-pink-600 hover:bg-pink-100",
//     default: "bg-muted/10 border-muted/20 text-foreground hover:bg-muted/20"
//   };

//   return (
//     <a href={href} target="_blank" rel="noreferrer" aria-label={label}
//       className={cn("flex items-center justify-center h-10 rounded-xl border transition-all active:scale-95", colors[color])}>
//       {icon}
//     </a>
//   );
// };

// function CarrierDetailsAccordion({ trip }: { trip: Trip }) {
//   const [isOpen, setIsOpen] = useState(false);
//   const toggleAccordion = useCallback(() => { triggerHaptic('light'); setIsOpen(prev => !prev); }, []);

//   return (
//     <div className="border rounded-xl overflow-hidden text-xs bg-muted/5">
//       <button onClick={toggleAccordion} aria-expanded={isOpen} className="w-full flex items-center justify-between px-4 py-3 bg-muted/20 hover:bg-muted/40 transition-colors">
//         <div className="flex items-center gap-2 font-black text-primary uppercase tracking-tighter">
//           <Globe className="h-4 w-4" />
//           <span>هوية الثقة والجسور الاجتماعية</span>
//         </div>
//         <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-300", isOpen && "rotate-180")} />
//       </button>

//       {isOpen && (
//         <div className="p-4 space-y-4 bg-background animate-in slide-in-from-top-2 duration-300 border-t border-muted/10">
//           <div className="grid grid-cols-3 gap-2">
//             <SocialLink href={trip.facebookProfile} icon={<Facebook className="h-5 w-5" />} color="blue" label="حساب فيسبوك" />
//             <SocialLink href={trip.instagramProfile} icon={<Instagram className="h-5 w-5" />} color="pink" label="حساب انستجرام" />
//             <SocialLink href={trip.tiktokProfile} icon={<Video className="h-5 w-5" />} color="default" label="حساب تيك توك" />
//           </div>

//           <div className="bg-primary/5 p-3 rounded-xl flex gap-2 items-start border border-primary/10">
//             <ShieldCheck className="h-3 w-3 text-primary shrink-0 mt-0.5" />
//             <p className="text-[9px] leading-tight text-muted-foreground font-bold text-right">
//               هذا الناقل مسجل بهوية اجتماعية موثقة. يمكنك مراجعة حساباته الرسمية للتحقق من جودة الخدمة بدلاً من الصور التقليدية.
//             </p>
//           </div>

//           <div className="pt-2">
//             <div className="flex items-center gap-2 bg-muted/20 p-2 rounded-lg">
//               <Car className="h-3.5 w-3.5 text-primary shrink-0" />
//               <div className="flex flex-col">
//                 <span className="font-bold">{trip.vehicleType || 'مركبة معتمدة'}</span>
//                 <span className="text-[10px] text-muted-foreground ltr font-medium">{trip.vehiclePlateNumber || 'لوحة رسمية'}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export function ScheduledTripCard({ trip, booking, onBookNow, onClosureAction, onCancelBooking, onMessageCarrier, context = 'dashboard' }: {
//   trip: Trip; booking?: Booking; onBookNow?: (trip: Trip) => void; onClosureAction?: (trip: Trip) => void; onCancelBooking?: (trip: Trip, booking: Booking) => void; onMessageCarrier?: (booking: Booking, trip: Trip) => void; context?: 'dashboard' | 'history'
// }) {
//   const isTripEnded = useMemo(() => {
//     const depDate = (trip.departureDate as any)?.toDate?.() ? (trip.departureDate as any).toDate() : new Date(trip.departureDate || 0);
//     const durationHours = (trip as any).estimatedDurationHours || 0;
//     const endDate = new Date(depDate.getTime() + durationHours * 60 * 60 * 1000);
//     return endDate < new Date();
//   }, [trip.departureDate, (trip as any).estimatedDurationHours]);

//   const t = useTranslations('scheduledTripCard');
//   const firestore = useFirestore();
//   const { user } = useUser();
//   const locale = useLocale();
//   const { toast } = useToast();

//   const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
//   const [isBookingSheetOpen, setIsBookingSheetOpen] = useState(false);
//   const [confirmedEmail, setConfirmedEmail] = useState('');
//   const [isSendingEmail, setIsSendingEmail] = useState(false);

//   const carrierRef = useMemoFirebase(() => {
//     if (!user || !firestore || !trip.carrierId) return null;
//     return doc(firestore, 'users', trip.carrierId);
//   }, [user, firestore, trip.carrierId]);

//   const { data: carrierProfile } = useDoc<UserProfile>(carrierRef);

//   const countryCode = useMemo(() => carrierProfile?.operatingCountry || 'JO', [carrierProfile]);

//   const handleBookClick = useCallback(() => {
//     triggerHaptic('light');
//     if (onBookNow) { onBookNow(trip); return; }
//     setIsBookingSheetOpen(true);
//   }, [onBookNow, trip]);

//   const handleSheetConfirm = useCallback(() => {
//     setIsBookingSheetOpen(false);
//     setIsEmailDialogOpen(true);
//   }, []);

//   const handleEmailConfirmed = useCallback(async (email: string) => {
//     if (!firestore) return;
//     setIsSendingEmail(true);
//     const origin = typeof window !== 'undefined' ? window.location.origin : '';
//     let tokenDocId: string | null = null;

//     try {
//       const tokenDoc = await addDoc(collection(firestore, 'booking_tokens'), {
//         email, tripId: trip.id, carrierId: trip.carrierId, seatCount: 1, status: 'pending',
//         createdAt: serverTimestamp(), expiresAt: new Date(Date.now() + 30 * 60 * 1000),
//       });
//       tokenDocId = tokenDoc.id;
//       const confirmUrl = `${origin}/${locale}/confirm-booking?token=${tokenDocId}`;

//       const emailRes = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           service_id: EMAILJS_CONFIG.serviceId, template_id: EMAILJS_CONFIG.templateId, user_id: EMAILJS_CONFIG.userId,
//           template_params: {
//             to_email: email, trip_origin: trip.origin || '--', trip_destination: trip.destination || '--',
//             carrier_name: trip.carrierName || '--', ticket_price: `${trip.price} ${trip.currency}`,
//             deposit_amount: `${((trip.price ?? 0) * ((trip.depositPercentage ?? 0) / 100)).toFixed(2)}`,
//             total_due: `${trip.price} ${trip.currency}`, departure_time: trip.departureDate || '--',
//             meeting_point: trip.meetingPoint || '--', confirm_url: confirmUrl,
//           },
//         }),
//       });

//       if (!emailRes.ok) throw new Error(`EmailJS error: ${emailRes.status}`);

//       setConfirmedEmail(email);
//       setIsEmailDialogOpen(false);
//       toast({ title: 'تم إرسال رسالة التحقق! ✉️', description: `تحقق من بريدك ${email} واضغط على "استكمال الحجز"` });
//     } catch (error: any) {
//       if (tokenDocId) {
//         const confirmUrl = `${origin}/${locale}/confirm-booking?token=${tokenDocId}`;
//         toast({ title: 'فشل إرسال الإيميل ⚠️', description: `يمكنك استكمال الحجز مباشرة من هذا الرابط`, action: (<Button size="sm" onClick={() => window.open(confirmUrl, '_blank')}>استكمل الحجز</Button>) });
//         setIsEmailDialogOpen(false);
//       } else {
//         toast({ variant: 'destructive', title: 'فشل إرسال الإيميل', description: 'تحقق من الإيميل وحاول مرة أخرى' });
//       }
//     } finally {
//       setIsSendingEmail(false);
//     }
//   }, [firestore, trip, locale, toast]);

//   const hasSeats = trip.availableSeats && trip.availableSeats > 0;

//   return (
//     // 🚀 [PERF-FIX]: content-visibility تُجبر المتصفح على عدم رسم العناصر خارج الشاشة (يوفر وقت المعالج)
//     <div className="content-visibility-auto contain-intrinsic-size-[400px]">
//       <TripCardBase trip={trip} headerAction={context === 'dashboard' ? <CarrierInfo trip={trip} /> : undefined}>
//         {context === 'dashboard' && (
//           <div className="space-y-3">
//             <CarrierDetailsAccordion trip={trip} />
//             {isTripEnded ? (
//               <div className="w-full mt-2 p-3 bg-muted/50 rounded-xl text-center text-xs text-muted-foreground font-black uppercase tracking-widest border border-dashed border-muted-foreground/20">
//                 🚫 {t('noSeats')}
//               </div>
//             ) : (
//               <Button size="lg" className="w-full font-black text-lg h-14 rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all mt-2" onClick={handleBookClick} disabled={!hasSeats || isSendingEmail}>
//                 {!hasSeats ? t('noSeats') : (
//                   <><Ticket className='ml-2 h-5 w-5' />{t('bookSeat')} ({trip.price} {trip.currency})</>
//                 )}
//               </Button>
//             )}
//           </div>
//         )}

//         {context === 'history' && (
//           <div className="flex flex-col gap-3">
//             {onClosureAction && (
//               <Button size="lg" variant="default" className="w-full bg-primary text-black font-black h-12 rounded-xl" onClick={() => onClosureAction(trip)}>
//                 {t('closure')}
//               </Button>
//             )}
//             <div className="grid grid-cols-2 gap-2">
//               {onCancelBooking && booking && (
//                 <Button size="sm" variant="destructive" className="rounded-xl h-10 font-bold" onClick={() => onCancelBooking(trip, booking)}>
//                   {t('cancel')}
//                 </Button>
//               )}
//               {booking?.status === 'Confirmed' && onMessageCarrier && (
//                 <Button size="sm" variant="outline" className="rounded-xl h-10 font-bold border-primary/20" onClick={() => onMessageCarrier(booking, trip)}>
//                   {t('messageCarrier')}
//                 </Button>
//               )}
//             </div>
//           </div>
//         )}
//       </TripCardBase>

//       {isBookingSheetOpen && (
//         <BookingSummarySheet
//           isOpen={isBookingSheetOpen}
//           onClose={() => setIsBookingSheetOpen(false)}
//           onConfirm={handleSheetConfirm}
//           trip={trip}
//           confirmedEmail={confirmedEmail}
//           countryCode={countryCode}
//         />
//       )}

//       {isEmailDialogOpen && (
//         <EmailConfirmDialog
//           isOpen={isEmailDialogOpen}
//           onClose={() => setIsEmailDialogOpen(false)}
//           onConfirm={handleEmailConfirmed}
//           trip={trip}
//         />
//       )}
//     </div>
//   );
// }
'use client';

import type { UserProfile, Trip, Booking } from '@/lib/data';
import { Button } from '@/components/ui/button';
import {
  Star, Ticket, ChevronDown, Car, Facebook,
  Instagram, Video, ShieldCheck, Globe
} from 'lucide-react';
import { useMemo, useState, useCallback, memo } from 'react';
import { TripCardBase } from '@/components/trip/trip-card-base';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { doc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useTranslations, useLocale } from 'next-intl';
import { cn, triggerHaptic } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { EMAILJS_CONFIG } from '@/lib/emailjs';
import dynamic from 'next/dynamic';

// 🚀 [PERF-FIX]: Lazy Loading للمكونات الثقيلة 
const CarrierTrustSheet = dynamic(() => import('./carrier/carrier-trust-sheet').then(m => ({ default: m.CarrierTrustSheet })), { ssr: false });
const BookingSummarySheet = dynamic(() => import('@/components/booking/booking-summary-sheet').then(m => ({ default: m.BookingSummarySheet })), { ssr: false });
const EmailConfirmDialog = dynamic(() => import('@/components/booking/email-confirm-dialog').then(m => ({ default: m.EmailConfirmDialog })), { ssr: false });

// 🚀 [PERF-FIX]: إزالة استعلام Firebase المكرر وتمرير الـ carrier كـ Prop
const CarrierInfo = memo(({ trip, carrier }: { trip: Trip, carrier?: UserProfile | null }) => {
  const t = useTranslations('scheduledTripCard');
  const { user } = useUser();
  const [isTrustSheetOpen, setIsTrustSheetOpen] = useState(false);

  const handleOpenTrustSheet = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('light');
    if (!user) return;
    setIsTrustSheetOpen(true);
  }, [user]);

  return (
    <>
      <button
        onClick={handleOpenTrustSheet}
        aria-label="عرض معلومات الناقل"
        className="flex items-center gap-3 w-full text-right hover:bg-muted/50 p-2 rounded-xl transition-all group"
        type="button"
      >
        <Avatar className="h-10 w-10 border-2 border-background shadow-md group-hover:border-primary/20 transition-all">
          <AvatarImage
            src={user ? (carrier?.photoURL || "/default-avatar.png") : "/default-avatar.png"}
            alt={carrier?.officeName || carrier?.firstName || trip.carrierName || "Carrier Avatar"}
          />
          <AvatarFallback className="bg-primary/10 text-primary font-black">
            {carrier?.officeName?.[0] || carrier?.firstName?.[0] || trip.carrierName?.[0] || "C"}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-bold group-hover:text-primary transition-colors">
              {carrier?.officeName || carrier?.firstName || trip.carrierName || '...'}
            </p>
            {user && carrier?.isVerifiedByAgent && (
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 fill-emerald-500/10" />
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="h-3 w-3 fill-current" />
              <span>{user ? (carrier?.ratingStats?.average?.toFixed(1) || t('new')) : t('new')}</span>
            </div>
            <span>•</span>
            <span>{user ? (carrier?.ratingStats?.count || 0) : 0} {t('ratings')}</span>
          </div>
        </div>
      </button>

      {user && isTrustSheetOpen && (
        <CarrierTrustSheet
          isOpen={isTrustSheetOpen}
          onClose={() => setIsTrustSheetOpen(false)}
          carrierId={carrier?.id || null}
          carrierName={carrier?.officeName || carrier?.firstName}
          carrierTier={carrier?.ratingStats?.tier}
        />
      )}
    </>
  );
});
CarrierInfo.displayName = 'CarrierInfo';

const SocialLink = ({ href, icon, color, ariaLabel }: { href?: string, icon: React.ReactNode, color: 'blue' | 'pink' | 'default', ariaLabel: string }) => {
  if (!href) return <div className="flex items-center justify-center h-10 rounded-xl bg-muted/10 opacity-30 grayscale" aria-hidden="true">{icon}</div>;

  const colors = {
    blue: "bg-blue-50 border-blue-100 text-blue-600 hover:bg-blue-100",
    pink: "bg-pink-50 border-pink-100 text-pink-600 hover:bg-pink-100",
    default: "bg-muted/10 border-muted/20 text-foreground hover:bg-muted/20"
  };

  return (
    <a href={href} target="_blank" rel="noreferrer" aria-label={ariaLabel}
      className={cn("flex items-center justify-center h-10 rounded-xl border transition-all active:scale-95", colors[color])}>
      {icon}
    </a>
  );
};

function CarrierDetailsAccordion({ trip }: { trip: Trip }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleAccordion = useCallback(() => { triggerHaptic('light'); setIsOpen(prev => !prev); }, []);

  return (
    <div className="border rounded-xl overflow-hidden text-xs bg-muted/5">
      <button aria-expanded={isOpen} onClick={toggleAccordion} className="w-full flex items-center justify-between px-4 py-3 bg-muted/20 hover:bg-muted/40 transition-colors">
        <div className="flex items-center gap-2 font-black text-primary uppercase tracking-tighter">
          <Globe className="h-4 w-4" />
          <span>هوية الثقة والجسور الاجتماعية</span>
        </div>
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-300", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="p-4 space-y-4 bg-background animate-in slide-in-from-top-2 duration-300 border-t border-muted/10">
          <div className="grid grid-cols-3 gap-2">
            <SocialLink href={trip.facebookProfile} icon={<Facebook className="h-5 w-5" />} color="blue" ariaLabel="حساب فيسبوك" />
            <SocialLink href={trip.instagramProfile} icon={<Instagram className="h-5 w-5" />} color="pink" ariaLabel="حساب انستجرام" />
            <SocialLink href={trip.tiktokProfile} icon={<Video className="h-5 w-5" />} color="default" ariaLabel="حساب تيك توك" />
          </div>

          <div className="bg-primary/5 p-3 rounded-xl flex gap-2 items-start border border-primary/10">
            <ShieldCheck className="h-3 w-3 text-primary shrink-0 mt-0.5" />
            <p className="text-[9px] leading-tight text-muted-foreground font-bold text-right">
              هذا الناقل مسجل بهوية اجتماعية موثقة. يمكنك مراجعة حساباته الرسمية للتحقق من جودة الخدمة بدلاً من الصور التقليدية.
            </p>
          </div>

          <div className="pt-2">
            <div className="flex items-center gap-2 bg-muted/20 p-2 rounded-lg">
              <Car className="h-3.5 w-3.5 text-primary shrink-0" />
              <div className="flex flex-col">
                <span className="font-bold">{trip.vehicleType || 'مركبة معتمدة'}</span>
                <span className="text-[10px] text-muted-foreground ltr font-medium">{trip.vehiclePlateNumber || 'لوحة رسمية'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function ScheduledTripCard({
  trip, booking, onBookNow, onClosureAction, onCancelBooking, onMessageCarrier, context = 'dashboard'
}: {
  trip: Trip; booking?: Booking; onBookNow?: (trip: Trip) => void; onClosureAction?: (trip: Trip) => void; onCancelBooking?: (trip: Trip, booking: Booking) => void; onMessageCarrier?: (booking: Booking, trip: Trip) => void; context?: 'dashboard' | 'history'
}) {
  const isTripEnded = useMemo(() => {
    const depDate = (trip.departureDate as any)?.toDate?.() ? (trip.departureDate as any).toDate() : new Date(trip.departureDate || 0);
    const durationHours = (trip as any).estimatedDurationHours || 0;
    const endDate = new Date(depDate.getTime() + durationHours * 60 * 60 * 1000);
    return endDate < new Date();
  }, [trip.departureDate, (trip as any).estimatedDurationHours]);

  const t = useTranslations('scheduledTripCard');
  const firestore = useFirestore();
  const { user } = useUser();
  const locale = useLocale();
  const { toast } = useToast();

  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isBookingSheetOpen, setIsBookingSheetOpen] = useState(false);
  const [confirmedEmail, setConfirmedEmail] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // 🚀 [PERF-FIX]: استعلام فايربيز يتم مرة واحدة فقط هنا ويُمرر للأسفل
  const carrierRef = useMemoFirebase(() => {
    if (!user || !firestore || !trip.carrierId) return null;
    return doc(firestore, 'users', trip.carrierId);
  }, [user, firestore, trip.carrierId]);

  const { data: carrierProfile } = useDoc<UserProfile>(carrierRef);

  const countryCode = useMemo(() => carrierProfile?.operatingCountry || 'JO', [carrierProfile]);

  const handleBookClick = useCallback(() => {
    triggerHaptic('light');
    if (onBookNow) { onBookNow(trip); return; }
    setIsBookingSheetOpen(true);
  }, [onBookNow, trip]);

  const handleSheetConfirm = useCallback(() => {
    setIsBookingSheetOpen(false);
    setIsEmailDialogOpen(true);
  }, []);

  const handleEmailConfirmed = useCallback(async (email: string) => {
    if (!firestore) return;
    setIsSendingEmail(true);
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    let tokenDocId: string | null = null;

    try {
      const tokenDoc = await addDoc(collection(firestore, 'booking_tokens'), {
        email, tripId: trip.id, carrierId: trip.carrierId, seatCount: 1, status: 'pending',
        createdAt: serverTimestamp(), expiresAt: new Date(Date.now() + 30 * 60 * 1000),
      });
      tokenDocId = tokenDoc.id;
      const confirmUrl = `${origin}/${locale}/confirm-booking?token=${tokenDocId}`;

      const emailRes = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: EMAILJS_CONFIG.serviceId, template_id: EMAILJS_CONFIG.templateId, user_id: EMAILJS_CONFIG.userId,
          template_params: {
            to_email: email, trip_origin: trip.origin || '--', trip_destination: trip.destination || '--',
            carrier_name: trip.carrierName || '--', ticket_price: `${trip.price} ${trip.currency}`,
            deposit_amount: `${((trip.price ?? 0) * ((trip.depositPercentage ?? 0) / 100)).toFixed(2)}`,
            total_due: `${trip.price} ${trip.currency}`, departure_time: trip.departureDate || '--',
            meeting_point: trip.meetingPoint || '--', confirm_url: confirmUrl,
          },
        }),
      });

      if (!emailRes.ok) throw new Error(`EmailJS error: ${emailRes.status}`);

      setConfirmedEmail(email);
      setIsEmailDialogOpen(false);
      toast({ title: 'تم إرسال رسالة التحقق! ✉️', description: `تحقق من بريدك ${email} واضغط على "استكمال الحجز"` });

    } catch (error: any) {
      if (tokenDocId) {
        const confirmUrl = `${origin}/${locale}/confirm-booking?token=${tokenDocId}`;
        toast({ title: 'فشل إرسال الإيميل ⚠️', description: `يمكنك استكمال الحجز مباشرة من هذا الرابط`, action: (<Button size="sm" onClick={() => window.open(confirmUrl, '_blank')}>استكمل الحجز</Button>) });
        setIsEmailDialogOpen(false);
      } else {
        toast({ variant: 'destructive', title: 'فشل إرسال الإيميل', description: 'تحقق من الإيميل وحاول مرة أخرى' });
      }
    } finally {
      setIsSendingEmail(false);
    }
  }, [firestore, trip, locale, toast]);

  const hasSeats = trip.availableSeats && trip.availableSeats > 0;

  return (
    <div className="contain-intrinsic-size-[400px]">
      {/* 🚀 [PERF-FIX]: تمرير بيانات الناقل للمكون الفرعي لمنع إعادة الاستعلام */}
      <TripCardBase trip={trip} headerAction={context === 'dashboard' ? <CarrierInfo trip={trip} carrier={carrierProfile} /> : undefined}>
        {context === 'dashboard' && (
          <div className="space-y-3">
            <CarrierDetailsAccordion trip={trip} />
            {isTripEnded ? (
              <div className="w-full mt-2 p-3 bg-muted/50 rounded-xl text-center text-xs text-muted-foreground font-black uppercase tracking-widest border border-dashed border-muted-foreground/20">
                🚫 {t('noSeats')}
              </div>
            ) : (
              <Button aria-label={t('bookSeat')} size="lg" className="w-full font-black text-lg h-14 rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all mt-2" onClick={handleBookClick} disabled={!hasSeats || isSendingEmail}>
                {!hasSeats ? t('noSeats') : (
                  <><Ticket className='ml-2 h-5 w-5' />{t('bookSeat')} ({trip.price} {trip.currency})</>
                )}
              </Button>
            )}
          </div>
        )}

        {context === 'history' && (
          <div className="flex flex-col gap-3">
            {onClosureAction && (
              <Button size="lg" variant="default" className="w-full bg-primary text-black font-black h-12 rounded-xl" onClick={() => onClosureAction(trip)}>
                {t('closure')}
              </Button>
            )}
            <div className="grid grid-cols-2 gap-2">
              {onCancelBooking && booking && (
                <Button size="sm" variant="destructive" className="rounded-xl h-10 font-bold" onClick={() => onCancelBooking(trip, booking)}>
                  {t('cancel')}
                </Button>
              )}
              {booking?.status === 'Confirmed' && onMessageCarrier && (
                <Button size="sm" variant="outline" className="rounded-xl h-10 font-bold border-primary/20" onClick={() => onMessageCarrier(booking, trip)}>
                  {t('messageCarrier')}
                </Button>
              )}
            </div>
          </div>
        )}
      </TripCardBase>

      {isBookingSheetOpen && (
        <BookingSummarySheet
          isOpen={isBookingSheetOpen}
          onClose={() => setIsBookingSheetOpen(false)}
          onConfirm={handleSheetConfirm}
          trip={trip}
          confirmedEmail={confirmedEmail}
          countryCode={countryCode}
        />
      )}

      {isEmailDialogOpen && (
        <EmailConfirmDialog
          isOpen={isEmailDialogOpen}
          onClose={() => setIsEmailDialogOpen(false)}
          onConfirm={handleEmailConfirmed}
          trip={trip}
        />
      )}
    </div>
  );
}