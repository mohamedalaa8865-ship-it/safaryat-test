// 'use client';

// import { useMemo, useState } from 'react';
// import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase';
// import { collection, query, where, limit, doc, serverTimestamp, updateDoc, Timestamp } from 'firebase/firestore';
// import { Link } from '@/i18n/routing';
// import { useTranslations, useLocale } from 'next-intl';
// import { AlertCircle, Route, Search, Star, ChevronLeft, ArrowRightLeft, Zap, User } from 'lucide-react';
// import { BookingActionCard } from '@/components/carrier/booking-action-card';
// import { MyTripsList } from '@/components/carrier/my-trips-list';
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// import { Skeleton } from '@/components/ui/skeleton';
// import { useToast } from '@/hooks/use-toast';
// import type { Trip, Booking, UserProfile } from '@/lib/data';
// import { EditTripDialog, type EditTripFormValues } from '@/components/carrier/edit-trip-dialog';
// import { CarrierTrustSheet } from '@/components/carrier/carrier-trust-sheet';
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Card } from "@/components/ui/card";
// import { useUserProfile } from '@/hooks/use-user-profile';
// import { SubscriptionStatusCard } from '@/components/carrier/subscription-status-card';
// import { LocalErrorBoundary } from '@/components/ui/local-error-boundary';

// /**
//  * @component BookingActionCardDispatcher
//  * @description THE ARTERIAL IDENTITY DISPATCHER FOR CARRIERS [SC-806 V2.6]
//  */
// function BookingActionCardDispatcher({ booking, onReject }: { booking: Booking, onReject: any }) {
//     const firestore = useFirestore();
//     const travelerRef = useMemoFirebase(() => firestore ? doc(firestore, 'users', booking.userId) : null, [firestore, booking.userId]);
//     const { data: travelerProfile } = useDoc<UserProfile>(travelerRef);
//     return <BookingActionCard booking={booking} onReject={onReject} />;
// }

// /**
//  * @page CarrierDashboard
//  * @description THE REINFORCED OPS CENTER (SC-806 V5.5)
//  * [SC-806 V5.5]: Eradicated "Double Echo" by passing profile pulse directly.
//  * Enforced useMemoFirebase for queries to ensure zero redundant reads.
//  */
// export default function CarrierDashboardPage() {
//     const { user } = useUser();
//     const firestore = useFirestore();
//     const { profile: userProfile, isLoading: isLoadingProfile } = useUserProfile();
//     const { toast } = useToast();
//     const t = useTranslations('carrier');
//     const locale = useLocale();
//     const [tripToEdit, setTripToEdit] = useState<Trip | null>(null);
//     const [isMyTrustSheetOpen, setIsMyTrustSheetOpen] = useState(false);

//     const pendingBookingsQuery = useMemoFirebase(() => {
//         if (!user || !firestore) return null;
//         return query(collection(firestore, 'bookings'), where('carrierId', '==', user.uid), where('status', '==', 'Pending-Carrier-Confirmation'), limit(3));
//     }, [user, firestore]);


//     const nextTripQuery = useMemoFirebase(() => {
//         if (!firestore || !user?.uid) return null;
//         return query(
//             collection(firestore, 'trips'),
//             where('carrierId', '==', user.uid),
//             where('status', 'in', ['Planned', 'In-Transit', 'Has_Offers', 'Negotiating', 'Pending-Carrier-Confirmation',
//                 'Confirmed', 'Awaiting-Offers'])
//         );
//     }, [firestore, user]);
//     const { data: pendingBookings, isLoading: loadingBookings } = useCollection<Booking>(pendingBookingsQuery);
//     const { data: nextTripsRaw, isLoading: loadingTrip } = useCollection<Trip>(nextTripQuery);


//     const upcomingTrips = useMemo(() => {
//         if (!nextTripsRaw || nextTripsRaw.length === 0) return [];
//         return [...nextTripsRaw]
//             .filter(trip => {
//                 // ✅ استبعد الرحلات اللي انتهى وقتها
//                 const depDate = (trip.departureDate as any)?.toDate?.()
//                     ? (trip.departureDate as any).toDate()
//                     : new Date(trip.departureDate || 0);
//                 const durationHours = (trip as any).estimatedDurationHours || 0;
//                 const endDate = new Date(depDate.getTime() + durationHours * 60 * 60 * 1000);
//                 return endDate > new Date();
//             })
//             .sort((a, b) => {
//                 const aDate = (a.departureDate as any)?.toDate?.() ?? new Date(a.departureDate || 0);
//                 const bDate = (b.departureDate as any)?.toDate?.() ?? new Date(b.departureDate || 0);
//                 return aDate.getTime() - bDate.getTime();
//             })
//             .slice(0, 1);
//     }, [nextTripsRaw]);
//     // const hasActiveTrip = upcomingTrips.length > 0;

//     const handleBookingReject = async (bookingId: string) => {
//         if (!firestore) return;
//         await updateDoc(doc(firestore, 'bookings', bookingId), { status: 'Rejected', updatedAt: serverTimestamp() });
//         toast({ title: t('bookingRejected') });
//     };

//     const handleEditTrip = (trip: Trip) => setTripToEdit(trip);


//     const handleConfirmEdit = async (trip: Trip, data: EditTripFormValues) => {
//         if (!firestore) return;

//         await updateDoc(doc(firestore, 'trips', trip.id), {
//             price: Number(data.price), // ✅ توحيد السعر
//             // availableSeats: data.availableSeats,

//             // ✅ تحويل التاريخ لـ Timestamp
//             // departureDate: Timestamp.fromDate(new Date(data.departureDate)),
//             departureDate: new Date(data.departureDate).toISOString(),
//             updatedAt: serverTimestamp()
//         });
//     };

//     const isLoading = loadingBookings || isLoadingProfile || loadingTrip;

//     return (
//         <>
//             <div className="space-y-6 p-4 pb-20 animate-in fade-in slide-in-from-bottom-2">
//                 <div className="mb-6 space-y-4">
//                     <Card className="relative overflow-hidden border-0 shadow-md bg-gradient-to-br from-primary/5 via-background to-background">
//                         <div className="p-4 flex items-center justify-between relative z-10">
//                             <div className="flex items-center gap-4">
//                                 <Avatar className="h-14 w-14 border-2 border-background shadow-sm">
//                                     <AvatarImage src={userProfile?.photoURL || ""} alt="User" />
//                                     <AvatarFallback>{userProfile?.firstName?.[0]}</AvatarFallback>
//                                 </Avatar>
//                                 <div>
//                                     <h1 className="font-bold text-lg text-foreground">{userProfile?.firstName} {userProfile?.lastName}</h1>
//                                     <span className="text-sm text-muted-foreground bg-secondary px-3 -mr-3 py-1.5 rounded-full">{t('title')}</span>
//                                 </div>
//                             </div>
//                             <button onClick={() => setIsMyTrustSheetOpen(true)} className="flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform">
//                                 <div className="h-10 w-10 bg-background rounded-full flex items-center justify-center shadow-sm border border-border hover:bg-muted">
//                                     <ChevronLeft className="h-5 w-5 text-muted-foreground" />
//                                 </div>
//                                 <span className="text-[10px] font-medium text-muted-foreground">{t('record')}</span>
//                             </button>
//                         </div>
//                     </Card>
//                 </div>

//                 <LocalErrorBoundary fallbackTitle="تعثر مستشعر الاشتراك">
//                     {/* [SC-806 V5.5]: Pass profile directly to eradicate Double Echo syndrome */}
//                     <SubscriptionStatusCard profile={userProfile} />
//                 </LocalErrorBoundary>

//                 <section className="space-y-3">
//                     <div className="flex items-center justify-between">
//                         <h3 className="text-sm font-bold text-orange-600 flex items-center gap-2"><AlertCircle className="h-4 w-4" /> {t('pendingRequests')}</h3>
//                         {pendingBookings && pendingBookings.length > 0 && <Link href="/carrier/bookings" className="text-xs text-primary hover:underline">{t('viewAll')}</Link>}
//                     </div>

//                     <LocalErrorBoundary fallbackTitle="تعثر صندوق الطلبات">
//                         {loadingBookings ? (
//                             <div className="grid gap-4 md:grid-cols-2"><Skeleton className="h-40 w-full" /><Skeleton className="h-40 w-full" /></div>
//                         ) : pendingBookings && pendingBookings.length > 0 ? (
//                             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//                                 {pendingBookings.map(booking => (
//                                     <BookingActionCardDispatcher key={booking.id} booking={booking} onReject={handleBookingReject} />
//                                 ))}
//                             </div>
//                         ) : (
//                             <Alert className="bg-muted/30 border-dashed">
//                                 <Search className="h-4 w-4 text-muted-foreground" />
//                                 <AlertTitle className="text-sm">{t('noPending')}</AlertTitle>
//                                 <AlertDescription className="text-xs text-muted-foreground">{t('noPendingDesc')}</AlertDescription>
//                             </Alert>
//                         )}
//                     </LocalErrorBoundary>
//                 </section>

//                 {isLoading ? <Skeleton className="h-48 w-full" /> : upcomingTrips.length > 0 ? (
//                     <section className="space-y-3">
//                         <h3 className="text-sm font-bold flex items-center gap-2"><Route className="h-4 w-4 text-blue-600" /> {t('nextTrip')}</h3>
//                         <LocalErrorBoundary fallbackTitle="تعثرت قائمة رحلاتي">
//                             <MyTripsList trips={upcomingTrips} isLoading={false} onEdit={handleEditTrip} carrierProfile={userProfile} />
//                         </LocalErrorBoundary>
//                     </section>
//                 ) : null}
//             </div>

//             <EditTripDialog isOpen={!!tripToEdit} onOpenChange={(open) => !open && setTripToEdit(null)} trip={tripToEdit} onConfirm={handleConfirmEdit} />
//             <CarrierTrustSheet isOpen={isMyTrustSheetOpen} onClose={() => setIsMyTrustSheetOpen(false)} carrierId={user?.uid || null} />
//         </>
//     );
// }


// 'use client';

// import { useMemo, useState } from 'react';
// import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase';
// import { collection, query, where, limit, doc, serverTimestamp, updateDoc, Timestamp } from 'firebase/firestore';
// import { Link } from '@/i18n/routing';
// import { useTranslations, useLocale } from 'next-intl';
// import { AlertCircle, Route, Search, Star, ChevronLeft, ArrowRightLeft, Zap, User } from 'lucide-react';
// import { BookingActionCard } from '@/components/carrier/booking-action-card';
// import { MyTripsList } from '@/components/carrier/my-trips-list';
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// import { Skeleton } from '@/components/ui/skeleton';
// import { useToast } from '@/hooks/use-toast';
// import type { Trip, Booking, UserProfile } from '@/lib/data';
// import { EditTripDialog, type EditTripFormValues } from '@/components/carrier/edit-trip-dialog';
// import { CarrierTrustSheet } from '@/components/carrier/carrier-trust-sheet';
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Card } from "@/components/ui/card";
// import { useUserProfile } from '@/hooks/use-user-profile';
// import { SubscriptionStatusCard } from '@/components/carrier/subscription-status-card';
// import { LocalErrorBoundary } from '@/components/ui/local-error-boundary';

// /**
//  * @component BookingActionCardDispatcher
//  * @description THE ARTERIAL IDENTITY DISPATCHER FOR CARRIERS [SC-806 V2.6]
//  */
// function BookingActionCardDispatcher({ booking, onReject }: { booking: Booking, onReject: any }) {
//     const firestore = useFirestore();
//     const travelerRef = useMemoFirebase(() => firestore ? doc(firestore, 'users', booking.userId) : null, [firestore, booking.userId]);
//     const { data: travelerProfile } = useDoc<UserProfile>(travelerRef);
//     return <BookingActionCard booking={booking} onReject={onReject} />;
// }

// /**
//  * @page CarrierDashboard
//  * @description THE REINFORCED OPS CENTER (SC-806 V5.5)
//  * [SC-806 V5.5]: Eradicated "Double Echo" by passing profile pulse directly.
//  * Enforced useMemoFirebase for queries to ensure zero redundant reads.
//  */
// export default function CarrierDashboardPage() {
//     const { user } = useUser();
//     const firestore = useFirestore();
//     const { profile: userProfile, isLoading: isLoadingProfile } = useUserProfile();
//     const { toast } = useToast();
//     const t = useTranslations('carrier');
//     const locale = useLocale();
//     const [tripToEdit, setTripToEdit] = useState<Trip | null>(null);
//     const [isMyTrustSheetOpen, setIsMyTrustSheetOpen] = useState(false);

//     const pendingBookingsQuery = useMemoFirebase(() => {
//         if (!user || !firestore) return null;
//         return query(collection(firestore, 'bookings'), where('carrierId', '==', user.uid), where('status', '==', 'Pending-Carrier-Confirmation'), limit(3));
//     }, [user, firestore]);


//     const nextTripQuery = useMemoFirebase(() => {
//         if (!firestore || !user?.uid) return null;
//         return query(
//             collection(firestore, 'trips'),
//             where('carrierId', '==', user.uid),
//             where('status', 'in', ['Planned', 'In-Transit', 'Has_Offers', 'Negotiating', 'Pending-Carrier-Confirmation',
//                 'Confirmed', 'Awaiting-Offers'])
//         );
//     }, [firestore, user]);
//     const { data: pendingBookings, isLoading: loadingBookings } = useCollection<Booking>(pendingBookingsQuery);
//     const { data: nextTripsRaw, isLoading: loadingTrip } = useCollection<Trip>(nextTripQuery);


//     const upcomingTrips = useMemo(() => {
//         if (!nextTripsRaw || nextTripsRaw.length === 0) return [];
//         return [...nextTripsRaw]
//             .filter(trip => {
//                 // ✅ استبعد الرحلات اللي انتهى وقتها
//                 const depDate = (trip.departureDate as any)?.toDate?.()
//                     ? (trip.departureDate as any).toDate()
//                     : new Date(trip.departureDate || 0);
//                 const durationHours = (trip as any).estimatedDurationHours || 0;
//                 const endDate = new Date(depDate.getTime() + durationHours * 60 * 60 * 1000);
//                 return endDate > new Date();
//             })
//             .sort((a, b) => {
//                 const aDate = (a.departureDate as any)?.toDate?.() ?? new Date(a.departureDate || 0);
//                 const bDate = (b.departureDate as any)?.toDate?.() ?? new Date(b.departureDate || 0);
//                 return aDate.getTime() - bDate.getTime();
//             })
//             .slice(0, 1);
//     }, [nextTripsRaw]);
//     // const hasActiveTrip = upcomingTrips.length > 0;

//     const handleBookingReject = async (bookingId: string) => {
//         if (!firestore) return;
//         await updateDoc(doc(firestore, 'bookings', bookingId), { status: 'Rejected', updatedAt: serverTimestamp() });
//         toast({ title: t('bookingRejected') });
//     };

//     const handleEditTrip = (trip: Trip) => setTripToEdit(trip);


//     const handleConfirmEdit = async (trip: Trip, data: EditTripFormValues) => {
//         if (!firestore || !user) return;

//         // ✅ تحديث بيانات الرحلة (السعر + التاريخ + العربون)
//         await updateDoc(doc(firestore, 'trips', trip.id), {
//             price: Number(data.price),
//             departureDate: new Date(data.departureDate).toISOString(),
//             depositPercentage: data.depositPercentage,
//             updatedAt: serverTimestamp()
//         });

//         // ✅ تحديث نسبة العربون في بروفايل الناقل عشان تنعكس على الرحلات الجديدة
//         await updateDoc(doc(firestore, 'users', user.uid), {
//             depositPercentage: data.depositPercentage,
//             updatedAt: serverTimestamp()
//         });
//     };

//     const isLoading = loadingBookings || isLoadingProfile || loadingTrip;

//     return (
//         <>
//             <div className="space-y-6 p-4 pb-20 animate-in fade-in slide-in-from-bottom-2">
//                 <div className="mb-6 space-y-4">
//                     <Card className="relative overflow-hidden border-0 shadow-md bg-gradient-to-br from-primary/5 via-background to-background">
//                         <div className="p-4 flex items-center justify-between relative z-10">
//                             <div className="flex items-center gap-4">
//                                 <Avatar className="h-14 w-14 border-2 border-background shadow-sm">
//                                     <AvatarImage src={userProfile?.photoURL || ""} alt="User" />
//                                     <AvatarFallback>{userProfile?.firstName?.[0]}</AvatarFallback>
//                                 </Avatar>
//                                 <div>
//                                     <h1 className="font-bold text-lg text-foreground">{userProfile?.firstName} {userProfile?.lastName}</h1>
//                                     <span className="text-sm text-muted-foreground bg-secondary px-3 -mr-3 py-1.5 rounded-full">{t('title')}</span>
//                                 </div>
//                             </div>
//                             <button onClick={() => setIsMyTrustSheetOpen(true)} className="flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform">
//                                 <div className="h-10 w-10 bg-background rounded-full flex items-center justify-center shadow-sm border border-border hover:bg-muted">
//                                     <ChevronLeft className="h-5 w-5 text-muted-foreground" />
//                                 </div>
//                                 <span className="text-[10px] font-medium text-muted-foreground">{t('record')}</span>
//                             </button>
//                         </div>
//                     </Card>
//                 </div>

//                 <LocalErrorBoundary fallbackTitle="تعثر مستشعر الاشتراك">
//                     {/* [SC-806 V5.5]: Pass profile directly to eradicate Double Echo syndrome */}
//                     <SubscriptionStatusCard profile={userProfile} />
//                 </LocalErrorBoundary>

//                 <section className="space-y-3">
//                     <div className="flex items-center justify-between">
//                         <h3 className="text-sm font-bold text-orange-600 flex items-center gap-2"><AlertCircle className="h-4 w-4" /> {t('pendingRequests')}</h3>
//                         {pendingBookings && pendingBookings.length > 0 && <Link href="/carrier/bookings" className="text-xs text-primary hover:underline">{t('viewAll')}</Link>}
//                     </div>

//                     <LocalErrorBoundary fallbackTitle="تعثر صندوق الطلبات">
//                         {loadingBookings ? (
//                             <div className="grid gap-4 md:grid-cols-2"><Skeleton className="h-40 w-full" /><Skeleton className="h-40 w-full" /></div>
//                         ) : pendingBookings && pendingBookings.length > 0 ? (
//                             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//                                 {pendingBookings.map(booking => (
//                                     <BookingActionCardDispatcher key={booking.id} booking={booking} onReject={handleBookingReject} />
//                                 ))}
//                             </div>
//                         ) : (
//                             <Alert className="bg-muted/30 border-dashed">
//                                 <Search className="h-4 w-4 text-muted-foreground" />
//                                 <AlertTitle className="text-sm">{t('noPending')}</AlertTitle>
//                                 <AlertDescription className="text-xs text-muted-foreground">{t('noPendingDesc')}</AlertDescription>
//                             </Alert>
//                         )}
//                     </LocalErrorBoundary>
//                 </section>

//                 {isLoading ? <Skeleton className="h-48 w-full" /> : upcomingTrips.length > 0 ? (
//                     <section className="space-y-3">
//                         <h3 className="text-sm font-bold flex items-center gap-2"><Route className="h-4 w-4 text-blue-600" /> {t('nextTrip')}</h3>
//                         <LocalErrorBoundary fallbackTitle="تعثرت قائمة رحلاتي">
//                             <MyTripsList trips={upcomingTrips} isLoading={false} onEdit={handleEditTrip} carrierProfile={userProfile} />
//                         </LocalErrorBoundary>
//                     </section>
//                 ) : null}
//             </div>

//             <EditTripDialog isOpen={!!tripToEdit} onOpenChange={(open) => !open && setTripToEdit(null)} trip={tripToEdit} onConfirm={handleConfirmEdit} />
//             <CarrierTrustSheet isOpen={isMyTrustSheetOpen} onClose={() => setIsMyTrustSheetOpen(false)} carrierId={user?.uid || null} />
//         </>
//     );
// }
// 'use client';

// import { useMemo, useState } from 'react';
// import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase';
// import { collection, query, where, limit, doc, serverTimestamp, updateDoc, Timestamp } from 'firebase/firestore';
// import { Link } from '@/i18n/routing';
// import { useTranslations, useLocale } from 'next-intl';
// import { AlertCircle, Route, Search, Star, ChevronLeft, ArrowRightLeft, Zap, User, ShieldCheck, FileDigit, Loader2 } from 'lucide-react';
// import { BookingActionCard } from '@/components/carrier/booking-action-card';
// import { MyTripsList } from '@/components/carrier/my-trips-list';
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// import { Skeleton } from '@/components/ui/skeleton';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { useToast } from '@/hooks/use-toast';
// import type { Trip, Booking, UserProfile } from '@/lib/data';
// import { EditTripDialog, type EditTripFormValues } from '@/components/carrier/edit-trip-dialog';
// import { CarrierTrustSheet } from '@/components/carrier/carrier-trust-sheet';
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Card } from "@/components/ui/card";
// import { useUserProfile } from '@/hooks/use-user-profile';
// import { SubscriptionStatusCard } from '@/components/carrier/subscription-status-card';
// import { LocalErrorBoundary } from '@/components/ui/local-error-boundary';
// import { useTripActions } from '@/hooks/use-trip-actions';
// import { TransferRequestDialog } from '@/components/carrier/transfer-request-dialog';

// /**
//  * @component BookingActionCardDispatcher
//  */
// function BookingActionCardDispatcher({ booking, onReject }: { booking: Booking, onReject: any }) {
//     const firestore = useFirestore();
//     const travelerRef = useMemoFirebase(() => firestore ? doc(firestore, 'users', booking.userId) : null, [firestore, booking.userId]);
//     const { data: travelerProfile } = useDoc<UserProfile>(travelerRef);
//     return <BookingActionCard booking={booking} onReject={onReject} />;
// }

// /**
//  * @component PendingVerificationCard
//  * @description بطاقة تأكيد استلام العربون — تظهر في الداشبورد الرئيسية
//  */
// function PendingVerificationCard({ booking }: { booking: Booking }) {
//     const { verifyBookingReceipt, isProcessing } = useTripActions();
//     const isThisProcessing = isProcessing === `verify-${booking.id}`;

//     const totalPrice = booking.totalPrice || 0;
//     const depositPercentage = (booking as any).depositPercentage ?? 20;
//     const depositPaid = Math.round(totalPrice * depositPercentage / 100);
//     const remaining = totalPrice - depositPaid;
//     const passengerName = (booking as any).passengersDetails?.[0]?.name || 'مسافر';
//     const voucherId = (booking as any).depositVoucherId || '———';
//     const atomicId = (booking as any).atomicId || booking.id.slice(0, 8).toUpperCase();

//     return (
//         <div className="rounded-xl border-2 border-dashed border-[#307380] bg-blue-500/5 p-4 space-y-3">
//             {/* اسم المسافر */}
//             <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                     <div className="h-8 w-8 rounded-full bg-[#307380] flex items-center justify-center text-white font-black text-sm">
//                         {passengerName[0]}
//                     </div>
//                     <div>
//                         <p className="text-sm font-black">{passengerName}</p>
//                         <p className="text-[10px] text-muted-foreground font-mono">{atomicId}</p>
//                     </div>
//                 </div>
//                 <Badge variant="outline" className="text-[10px] border-[#307380] text-[#307380]">
//                     {booking.seats || 1} مقعد
//                 </Badge>
//             </div>

//             {/* المبالغ */}
//             <div className="grid grid-cols-3 gap-2 text-center bg-black/20 rounded-lg p-2">
//                 <div>
//                     <p className="text-[9px] text-muted-foreground">الإجمالي</p>
//                     <p className="text-sm font-black">{totalPrice} <span className="text-[9px]">{booking.currency}</span></p>
//                 </div>
//                 <div>
//                     <p className="text-[9px] text-green-400">المدفوع</p>
//                     <p className="text-sm font-black text-green-400">{depositPaid}</p>
//                 </div>
//                 <div>
//                     <p className="text-[9px] text-orange-400">التحصيل</p>
//                     <p className="text-sm font-black text-orange-400">{remaining}</p>
//                 </div>
//             </div>

//             {/* السند الرقمي */}
//             <div className="text-center space-y-1">
//                 <p className="text-[10px] font-black text-[#307380] uppercase tracking-widest flex items-center justify-center gap-1">
//                     <FileDigit className="h-3 w-3" /> السند الرقمي
//                 </p>
//                 <p className="text-xl font-black font-mono text-[#307380] tracking-widest">{voucherId}</p>
//             </div>

//             {/* زر التأكيد */}
//             <Button
//                 className="w-full h-11 bg-[#307380] hover:bg-[#3073808f] text-white font-black rounded-xl gap-2"
//                 onClick={() => verifyBookingReceipt(booking)}
//                 disabled={!!isThisProcessing}
//             >
//                 {isThisProcessing
//                     ? <Loader2 className="h-4 w-4 animate-spin" />
//                     : <><ShieldCheck className="h-4 w-4" /> ختم ومصادقة الاستلام</>
//                 }
//             </Button>
//         </div>
//     );
// }

// /**
//  * @page CarrierDashboard
//  */
// export default function CarrierDashboardPage() {
//     const { user } = useUser();
//     const firestore = useFirestore();
//     const { profile: userProfile, isLoading: isLoadingProfile } = useUserProfile();
//     const { toast } = useToast();
//     const t = useTranslations('carrier');
//     const locale = useLocale();
//     const [tripToEdit, setTripToEdit] = useState<Trip | null>(null);
//     const [isMyTrustSheetOpen, setIsMyTrustSheetOpen] = useState(false);
//     const [tripToTransfer, setTripToTransfer] = useState<Trip | null>(null);

//     // ── Pending carrier confirmation ──
//     const pendingBookingsQuery = useMemoFirebase(() => {
//         if (!user || !firestore) return null;
//         return query(collection(firestore, 'bookings'), where('carrierId', '==', user.uid), where('status', '==', 'Pending-Carrier-Confirmation'), limit(3));
//     }, [user, firestore]);

//     // ── Pending payment verification (العربون المدفوع بانتظار تأكيد الناقل) ──
//     const pendingVerificationQuery = useMemoFirebase(() => {
//         if (!user || !firestore) return null;
//         return query(collection(firestore, 'bookings'), where('carrierId', '==', user.uid), where('status', '==', 'Pending-Payment-Verification'), limit(10));
//     }, [user, firestore]);

//     const nextTripQuery = useMemoFirebase(() => {
//         if (!firestore || !user?.uid) return null;
//         return query(
//             collection(firestore, 'trips'),
//             where('carrierId', '==', user.uid),
//             where('status', 'in', ['Planned', 'In-Transit', 'Has_Offers', 'Negotiating', 'Pending-Carrier-Confirmation',
//                 'Confirmed', 'Awaiting-Offers'])
//         );
//     }, [firestore, user]);

//     const { data: pendingBookings, isLoading: loadingBookings } = useCollection<Booking>(pendingBookingsQuery);
//     const { data: pendingVerifications, isLoading: loadingVerifications } = useCollection<Booking>(pendingVerificationQuery);
//     const { data: nextTripsRaw, isLoading: loadingTrip } = useCollection<Trip>(nextTripQuery);

//     const upcomingTrips = useMemo(() => {
//         if (!nextTripsRaw || nextTripsRaw.length === 0) return [];
//         return [...nextTripsRaw]
//             .filter(trip => {
//                 const depDate = (trip.departureDate as any)?.toDate?.()
//                     ? (trip.departureDate as any).toDate()
//                     : new Date(trip.departureDate || 0);
//                 const durationHours = (trip as any).estimatedDurationHours || 0;
//                 const endDate = new Date(depDate.getTime() + durationHours * 60 * 60 * 1000);
//                 return endDate > new Date();
//             })
//             .sort((a, b) => {
//                 const aDate = (a.departureDate as any)?.toDate?.() ?? new Date(a.departureDate || 0);
//                 const bDate = (b.departureDate as any)?.toDate?.() ?? new Date(b.departureDate || 0);
//                 return aDate.getTime() - bDate.getTime();
//             })
//             .slice(0, 1);
//     }, [nextTripsRaw]);

//     const handleBookingReject = async (bookingId: string) => {
//         if (!firestore) return;
//         await updateDoc(doc(firestore, 'bookings', bookingId), { status: 'Rejected', updatedAt: serverTimestamp() });
//         toast({ title: t('bookingRejected') });
//     };

//     const handleEditTrip = (trip: Trip) => setTripToEdit(trip);

//     const handleConfirmEdit = async (trip: Trip, data: EditTripFormValues) => {
//         if (!firestore || !user) return;
//         await updateDoc(doc(firestore, 'trips', trip.id), {
//             price: Number(data.price),
//             departureDate: new Date(data.departureDate).toISOString(),
//             depositPercentage: data.depositPercentage,
//             updatedAt: serverTimestamp()
//         });
//         await updateDoc(doc(firestore, 'users', user.uid), {
//             depositPercentage: data.depositPercentage,
//             updatedAt: serverTimestamp()
//         });
//     };

//     const isLoading = loadingBookings || isLoadingProfile || loadingTrip;

//     return (
//         <>
//             <div className="space-y-6 p-4 pb-20 animate-in fade-in slide-in-from-bottom-2">
//                 {/* ── Header ── */}
//                 <div className="mb-6 space-y-4">
//                     <Card className="relative overflow-hidden border-0 shadow-md bg-gradient-to-br from-primary/5 via-background to-background">
//                         <div className="p-4 flex items-center justify-between relative z-10">
//                             <div className="flex items-center gap-4">
//                                 <Avatar className="h-14 w-14 border-2 border-background shadow-sm">
//                                     <AvatarImage src={userProfile?.photoURL || ""} alt="User" />
//                                     <AvatarFallback>{userProfile?.firstName?.[0]}</AvatarFallback>
//                                 </Avatar>
//                                 <div>
//                                     <h1 className="font-bold text-lg text-foreground">{userProfile?.firstName} {userProfile?.lastName}</h1>
//                                     <span className="text-sm text-muted-foreground bg-secondary px-3 -mr-3 py-1.5 rounded-full">{t('title')}</span>
//                                 </div>
//                             </div>
//                             <button onClick={() => setIsMyTrustSheetOpen(true)} className="flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform">
//                                 <div className="h-10 w-10 bg-background rounded-full flex items-center justify-center shadow-sm border border-border hover:bg-muted">
//                                     <ChevronLeft className="h-5 w-5 text-muted-foreground" />
//                                 </div>
//                                 <span className="text-[10px] font-medium text-muted-foreground">{t('record')}</span>
//                             </button>
//                         </div>
//                     </Card>
//                 </div>

//                 <LocalErrorBoundary fallbackTitle="تعثر مستشعر الاشتراك">
//                     <SubscriptionStatusCard profile={userProfile} />
//                 </LocalErrorBoundary>

//                 {/* ── بانتظار تأكيد استلام العربون ── */}
//                 {(loadingVerifications || (pendingVerifications && pendingVerifications.length > 0)) && (
//                     <section className="space-y-3">
//                         <div className="flex items-center justify-between">
//                             <h3 className="text-sm font-bold text-[#307380] flex items-center gap-2">
//                                 <ShieldCheck className="h-4 w-4" />
//                                 بانتظار تأكيد استلام العربون
//                                 {pendingVerifications && pendingVerifications.length > 0 && (
//                                     <span className="bg-[#307380] text-white text-[10px] font-black rounded-full px-2 py-0.5">
//                                         {pendingVerifications.length}
//                                     </span>
//                                 )}
//                             </h3>
//                         </div>
//                         <LocalErrorBoundary fallbackTitle="تعثر صندوق التحقق">
//                             {loadingVerifications ? (
//                                 <Skeleton className="h-48 w-full" />
//                             ) : (
//                                 <div className="grid gap-4 md:grid-cols-2">
//                                     {pendingVerifications!.map(booking => (
//                                         <PendingVerificationCard key={booking.id} booking={booking} />
//                                     ))}
//                                 </div>
//                             )}
//                         </LocalErrorBoundary>
//                     </section>
//                 )}

//                 {/* ── الطلبات المعلقة ── */}
//                 <section className="space-y-3">
//                     <div className="flex items-center justify-between">
//                         <h3 className="text-sm font-bold text-orange-600 flex items-center gap-2">
//                             <AlertCircle className="h-4 w-4" /> {t('pendingRequests')}
//                         </h3>
//                         {pendingBookings && pendingBookings.length > 0 && (
//                             <Link href="/carrier/bookings" className="text-xs text-primary hover:underline">{t('viewAll')}</Link>
//                         )}
//                     </div>
//                     <LocalErrorBoundary fallbackTitle="تعثر صندوق الطلبات">
//                         {loadingBookings ? (
//                             <div className="grid gap-4 md:grid-cols-2"><Skeleton className="h-40 w-full" /><Skeleton className="h-40 w-full" /></div>
//                         ) : pendingBookings && pendingBookings.length > 0 ? (
//                             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//                                 {pendingBookings.map(booking => (
//                                     <BookingActionCardDispatcher key={booking.id} booking={booking} onReject={handleBookingReject} />
//                                 ))}
//                             </div>
//                         ) : (
//                             <Alert className="bg-muted/30 border-dashed">
//                                 <Search className="h-4 w-4 text-muted-foreground" />
//                                 <AlertTitle className="text-sm">{t('noPending')}</AlertTitle>
//                                 <AlertDescription className="text-xs text-muted-foreground">{t('noPendingDesc')}</AlertDescription>
//                             </Alert>
//                         )}
//                     </LocalErrorBoundary>
//                 </section>

//                 {/* ── الرحلة القادمة ── */}
//                 {isLoading ? <Skeleton className="h-48 w-full" /> : upcomingTrips.length > 0 ? (
//                     <section className="space-y-3">
//                         <h3 className="text-sm font-bold flex items-center gap-2"><Route className="h-4 w-4 text-blue-600" /> {t('nextTrip')}</h3>
//                         <LocalErrorBoundary fallbackTitle="تعثرت قائمة رحلاتي">
//                             <MyTripsList
//                                 trips={upcomingTrips}
//                                 isLoading={false}
//                                 onEdit={handleEditTrip}
//                                 carrierProfile={userProfile}
//                             // onTransfer={(trip) => setTripToTransfer(trip)}  // ← أضف دي
//                             />
//                         </LocalErrorBoundary>
//                     </section>
//                 ) : null}
//             </div>

//             <EditTripDialog isOpen={!!tripToEdit} onOpenChange={(open) => !open && setTripToEdit(null)} trip={tripToEdit} onConfirm={handleConfirmEdit} />
//             <CarrierTrustSheet isOpen={isMyTrustSheetOpen} onClose={() => setIsMyTrustSheetOpen(false)} carrierId={user?.uid || null} />
//         </>
//     );
// }
// 'use client';

// import { useMemo, useState } from 'react';
// import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase';
// import { collection, query, where, limit, doc, serverTimestamp, updateDoc, Timestamp } from 'firebase/firestore';
// import { Link } from '@/i18n/routing';
// import { useTranslations, useLocale } from 'next-intl';
// import { AlertCircle, Route, Search, Star, ChevronLeft, ArrowRightLeft, Zap, User, ShieldCheck, FileDigit, Loader2 } from 'lucide-react';
// import { BookingActionCard } from '@/components/carrier/booking-action-card';
// import { MyTripsList } from '@/components/carrier/my-trips-list';
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// import { Skeleton } from '@/components/ui/skeleton';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { useToast } from '@/hooks/use-toast';
// import type { Trip, Booking, UserProfile } from '@/lib/data';
// import { EditTripDialog, type EditTripFormValues } from '@/components/carrier/edit-trip-dialog';
// import { CarrierTrustSheet } from '@/components/carrier/carrier-trust-sheet';
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Card } from "@/components/ui/card";
// import { useUserProfile } from '@/hooks/use-user-profile';
// import { SubscriptionStatusCard } from '@/components/carrier/subscription-status-card';
// import { LocalErrorBoundary } from '@/components/ui/local-error-boundary';
// import { useTripActions } from '@/hooks/use-trip-actions';
// import { TransferRequestDialog } from '@/components/carrier/transfer-request-dialog';

// /**
//  * @component BookingActionCardDispatcher
//  */
// function BookingActionCardDispatcher({ booking, onReject }: { booking: Booking, onReject: any }) {
//     const firestore = useFirestore();
//     const travelerRef = useMemoFirebase(() => firestore ? doc(firestore, 'users', booking.userId) : null, [firestore, booking.userId]);
//     const { data: travelerProfile } = useDoc<UserProfile>(travelerRef);
//     return <BookingActionCard booking={booking} onReject={onReject} />;
// }

// /**
//  * @component PendingVerificationCard
//  * @description بطاقة تأكيد استلام العربون — تظهر في الداشبورد الرئيسية
//  */
// function PendingVerificationCard({ booking }: { booking: Booking }) {
//     const { verifyBookingReceipt, isProcessing } = useTripActions();
//     const isThisProcessing = isProcessing === `verify-${booking.id}`;

//     const totalPrice = booking.totalPrice || 0;
//     const depositPercentage = (booking as any).depositPercentage ?? 20;
//     const depositPaid = Math.round(totalPrice * depositPercentage / 100);
//     const remaining = totalPrice - depositPaid;
//     const passengerName = (booking as any).passengersDetails?.[0]?.name || 'مسافر';
//     const voucherId = (booking as any).depositVoucherId || '———';
//     const atomicId = (booking as any).atomicId || booking.id.slice(0, 8).toUpperCase();

//     return (
//         <div className="rounded-xl border-2 border-dashed border-[#307380] bg-blue-500/5 p-4 space-y-3">
//             {/* اسم المسافر */}
//             <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                     <div className="h-8 w-8 rounded-full bg-[#307380] flex items-center justify-center text-white font-black text-sm">
//                         {passengerName[0]}
//                     </div>
//                     <div>
//                         <p className="text-sm font-black">{passengerName}</p>
//                         <p className="text-[10px] text-muted-foreground font-mono">{atomicId}</p>
//                     </div>
//                 </div>
//                 <Badge variant="outline" className="text-[10px] border-[#307380] text-[#307380]">
//                     {booking.seats || 1} مقعد
//                 </Badge>
//             </div>

//             {/* المبالغ */}
//             <div className="grid grid-cols-3 gap-2 text-center bg-black/20 rounded-lg p-2">
//                 <div>
//                     <p className="text-[9px] text-muted-foreground">الإجمالي</p>
//                     <p className="text-sm font-black">{totalPrice} <span className="text-[9px]">{booking.currency}</span></p>
//                 </div>
//                 <div>
//                     <p className="text-[9px] text-green-400">المدفوع</p>
//                     <p className="text-sm font-black text-green-400">{depositPaid}</p>
//                 </div>
//                 <div>
//                     <p className="text-[9px] text-orange-400">التحصيل</p>
//                     <p className="text-sm font-black text-orange-400">{remaining}</p>
//                 </div>
//             </div>

//             {/* السند الرقمي */}
//             <div className="text-center space-y-1">
//                 <p className="text-[10px] font-black text-[#307380] uppercase tracking-widest flex items-center justify-center gap-1">
//                     <FileDigit className="h-3 w-3" /> السند الرقمي
//                 </p>
//                 <p className="text-xl font-black font-mono text-[#307380] tracking-widest">{voucherId}</p>
//             </div>

//             {/* زر التأكيد */}
//             <Button
//                 className="w-full h-11 bg-[#307380] hover:bg-[#3073808f] text-white font-black rounded-xl gap-2"
//                 onClick={() => verifyBookingReceipt(booking)}
//                 disabled={!!isThisProcessing}
//             >
//                 {isThisProcessing
//                     ? <Loader2 className="h-4 w-4 animate-spin" />
//                     : <><ShieldCheck className="h-4 w-4" /> ختم ومصادقة الاستلام</>
//                 }
//             </Button>
//         </div>
//     );
// }

// /**
//  * @page CarrierDashboard
//  */
// export default function CarrierDashboardPage() {
//     const { user } = useUser();
//     const firestore = useFirestore();
//     const { profile: userProfile, isLoading: isLoadingProfile } = useUserProfile();
//     const { toast } = useToast();
//     const t = useTranslations('carrier');
//     const locale = useLocale();
//     const [tripToEdit, setTripToEdit] = useState<Trip | null>(null);
//     const [isMyTrustSheetOpen, setIsMyTrustSheetOpen] = useState(false);

//     // الخطوة 1: إضافة حالة رحلة النقل (Transfer Trip State)
//     const [tripToTransfer, setTripToTransfer] = useState<Trip | null>(null);

//     // ── Pending carrier confirmation ──
//     const pendingBookingsQuery = useMemoFirebase(() => {
//         if (!user || !firestore) return null;
//         return query(collection(firestore, 'bookings'), where('carrierId', '==', user.uid), where('status', '==', 'Pending-Carrier-Confirmation'), limit(3));
//     }, [user, firestore]);

//     // ── Pending payment verification (العربون المدفوع بانتظار تأكيد الناقل) ──
//     const pendingVerificationQuery = useMemoFirebase(() => {
//         if (!user || !firestore) return null;
//         return query(collection(firestore, 'bookings'), where('carrierId', '==', user.uid), where('status', '==', 'Pending-Payment-Verification'), limit(10));
//     }, [user, firestore]);

//     const nextTripQuery = useMemoFirebase(() => {
//         if (!firestore || !user?.uid) return null;
//         return query(
//             collection(firestore, 'trips'),
//             where('carrierId', '==', user.uid),
//             where('status', 'in', ['Planned', 'In-Transit', 'Has_Offers', 'Negotiating', 'Pending-Carrier-Confirmation',
//                 'Confirmed', 'Awaiting-Offers'])
//         );
//     }, [firestore, user]);

//     const { data: pendingBookings, isLoading: loadingBookings } = useCollection<Booking>(pendingBookingsQuery);
//     const { data: pendingVerifications, isLoading: loadingVerifications } = useCollection<Booking>(pendingVerificationQuery);
//     const { data: nextTripsRaw, isLoading: loadingTrip } = useCollection<Trip>(nextTripQuery);

//     const upcomingTrips = useMemo(() => {
//         if (!nextTripsRaw || nextTripsRaw.length === 0) return [];
//         return [...nextTripsRaw]
//             .filter(trip => {
//                 const depDate = (trip.departureDate as any)?.toDate?.()
//                     ? (trip.departureDate as any).toDate()
//                     : new Date(trip.departureDate || 0);
//                 const durationHours = (trip as any).estimatedDurationHours || 0;
//                 const endDate = new Date(depDate.getTime() + durationHours * 60 * 60 * 1000);
//                 return endDate > new Date();
//             })
//             .sort((a, b) => {
//                 const aDate = (a.departureDate as any)?.toDate?.() ?? new Date(a.departureDate || 0);
//                 const bDate = (b.departureDate as any)?.toDate?.() ?? new Date(b.departureDate || 0);
//                 return aDate.getTime() - bDate.getTime();
//             })
//             .slice(0, 1);
//     }, [nextTripsRaw]);

//     const handleBookingReject = async (bookingId: string) => {
//         if (!firestore) return;
//         await updateDoc(doc(firestore, 'bookings', bookingId), { status: 'Rejected', updatedAt: serverTimestamp() });
//         toast({ title: t('bookingRejected') });
//     };

//     const handleEditTrip = (trip: Trip) => setTripToEdit(trip);

//     const handleConfirmEdit = async (trip: Trip, data: EditTripFormValues) => {
//         if (!firestore || !user) return;
//         await updateDoc(doc(firestore, 'trips', trip.id), {
//             price: Number(data.price),
//             departureDate: new Date(data.departureDate).toISOString(),
//             depositPercentage: data.depositPercentage,
//             updatedAt: serverTimestamp()
//         });
//         await updateDoc(doc(firestore, 'users', user.uid), {
//             depositPercentage: data.depositPercentage,
//             updatedAt: serverTimestamp()
//         });
//     };

//     const isLoading = loadingBookings || isLoadingProfile || loadingTrip;

//     return (
//         <>
//             <div className="space-y-6 p-4 pb-20 animate-in fade-in slide-in-from-bottom-2">
//                 {/* ── Header ── */}
//                 <div className="mb-6 space-y-4">
//                     <Card className="relative overflow-hidden border-0 shadow-md bg-gradient-to-br from-primary/5 via-background to-background">
//                         <div className="p-4 flex items-center justify-between relative z-10">
//                             <div className="flex items-center gap-4">
//                                 <Avatar className="h-14 w-14 border-2 border-background shadow-sm">
//                                     <AvatarImage src={userProfile?.photoURL || ""} alt="User" />
//                                     <AvatarFallback>{userProfile?.firstName?.[0]}</AvatarFallback>
//                                 </Avatar>
//                                 <div>
//                                     <h1 className="font-bold text-lg text-foreground">{userProfile?.firstName} {userProfile?.lastName}</h1>
//                                     <span className="text-sm text-muted-foreground bg-secondary px-3 -mr-3 py-1.5 rounded-full">{t('title')}</span>
//                                 </div>
//                             </div>
//                             <button onClick={() => setIsMyTrustSheetOpen(true)} className="flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform">
//                                 <div className="h-10 w-10 bg-background rounded-full flex items-center justify-center shadow-sm border border-border hover:bg-muted">
//                                     <ChevronLeft className="h-5 w-5 text-muted-foreground" />
//                                 </div>
//                                 <span className="text-[10px] font-medium text-muted-foreground">{t('record')}</span>
//                             </button>
//                         </div>
//                     </Card>
//                 </div>

//                 <LocalErrorBoundary fallbackTitle="تعثر مستشعر الاشتراك">
//                     <SubscriptionStatusCard profile={userProfile} />
//                 </LocalErrorBoundary>

//                 {/* ── بانتظار تأكيد استلام العربون ── */}
//                 {(loadingVerifications || (pendingVerifications && pendingVerifications.length > 0)) && (
//                     <section className="space-y-3">
//                         <div className="flex items-center justify-between">
//                             <h3 className="text-sm font-bold text-[#307380] flex items-center gap-2">
//                                 <ShieldCheck className="h-4 w-4" />
//                                 بانتظار تأكيد استلام العربون
//                                 {pendingVerifications && pendingVerifications.length > 0 && (
//                                     <span className="bg-[#307380] text-white text-[10px] font-black rounded-full px-2 py-0.5">
//                                         {pendingVerifications.length}
//                                     </span>
//                                 )}
//                             </h3>
//                         </div>
//                         <LocalErrorBoundary fallbackTitle="تعثر صندوق التحقق">
//                             {loadingVerifications ? (
//                                 <Skeleton className="h-48 w-full" />
//                             ) : (
//                                 <div className="grid gap-4 md:grid-cols-2">
//                                     {pendingVerifications!.map(booking => (
//                                         <PendingVerificationCard key={booking.id} booking={booking} />
//                                     ))}
//                                 </div>
//                             )}
//                         </LocalErrorBoundary>
//                     </section>
//                 )}

//                 {/* ── الطلبات المعلقة ── */}
//                 <section className="space-y-3">
//                     <div className="flex items-center justify-between">
//                         <h3 className="text-sm font-bold text-orange-600 flex items-center gap-2">
//                             <AlertCircle className="h-4 w-4" /> {t('pendingRequests')}
//                         </h3>
//                         {pendingBookings && pendingBookings.length > 0 && (
//                             <Link href="/carrier/bookings" className="text-xs text-primary hover:underline">{t('viewAll')}</Link>
//                         )}
//                     </div>
//                     <LocalErrorBoundary fallbackTitle="تعثر صندوق الطلبات">
//                         {loadingBookings ? (
//                             <div className="grid gap-4 md:grid-cols-2"><Skeleton className="h-40 w-full" /><Skeleton className="h-40 w-full" /></div>
//                         ) : pendingBookings && pendingBookings.length > 0 ? (
//                             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//                                 {pendingBookings.map(booking => (
//                                     <BookingActionCardDispatcher key={booking.id} booking={booking} onReject={handleBookingReject} />
//                                 ))}
//                             </div>
//                         ) : (
//                             <Alert className="bg-muted/30 border-dashed">
//                                 <Search className="h-4 w-4 text-muted-foreground" />
//                                 <AlertTitle className="text-sm">{t('noPending')}</AlertTitle>
//                                 <AlertDescription className="text-xs text-muted-foreground">{t('noPendingDesc')}</AlertDescription>
//                             </Alert>
//                         )}
//                     </LocalErrorBoundary>
//                 </section>

//                 {/* ── الرحلة القادمة ── */}
//                 {isLoading ? <Skeleton className="h-48 w-full" /> : upcomingTrips.length > 0 ? (
//                     <section className="space-y-3">
//                         <h3 className="text-sm font-bold flex items-center gap-2"><Route className="h-4 w-4 text-blue-600" /> {t('nextTrip')}</h3>
//                         <LocalErrorBoundary fallbackTitle="تعثرت قائمة رحلاتي">
//                             <MyTripsList
//                                 trips={upcomingTrips}
//                                 isLoading={false}
//                                 onEdit={handleEditTrip}
//                                 // الخطوة 2: تمرير onTransfer إلى MyTripsList
//                                 onTransfer={(trip) => setTripToTransfer(trip)}
//                                 carrierProfile={userProfile}
//                             />
//                         </LocalErrorBoundary>
//                     </section>
//                 ) : null}
//             </div>

//             <EditTripDialog isOpen={!!tripToEdit} onOpenChange={(open) => !open && setTripToEdit(null)} trip={tripToEdit} onConfirm={handleConfirmEdit} />
//             <CarrierTrustSheet isOpen={isMyTrustSheetOpen} onClose={() => setIsMyTrustSheetOpen(false)} carrierId={user?.uid || null} />

//             {/* الخطوة 3: إضافة TransferRequestDialog */}
//             <TransferRequestDialog
//                 isOpen={!!tripToTransfer}
//                 onOpenChange={(open) => !open && setTripToTransfer(null)}
//                 trip={tripToTransfer}
//             />
//         </>
//     );
// }
'use client';

import { useMemo, useState, useCallback } from 'react';
import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit, doc, serverTimestamp, updateDoc, Timestamp, addDoc, getDocs } from 'firebase/firestore';
import { Link } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { AlertCircle, Route, Search, Star, ChevronLeft, ArrowRightLeft, Zap, User, ShieldCheck, FileDigit, Loader2 } from 'lucide-react';
import { BookingActionCard } from '@/components/carrier/booking-action-card';
import { MyTripsList } from '@/components/carrier/my-trips-list';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import type { Trip, Booking, UserProfile, TransferRequest } from '@/lib/data';
import { EditTripDialog, type EditTripFormValues } from '@/components/carrier/edit-trip-dialog';
import { CarrierTrustSheet } from '@/components/carrier/carrier-trust-sheet';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { useUserProfile } from '@/hooks/use-user-profile';
import { SubscriptionStatusCard } from '@/components/carrier/subscription-status-card';
import { LocalErrorBoundary } from '@/components/ui/local-error-boundary';
import { useTripActions } from '@/hooks/use-trip-actions';
import { TransferRequestDialog } from '@/components/carrier/transfer-request-dialog';
import { TransferRequestCard } from '@/components/carrier/transfer-request-card';
import { TransferDepositDialog } from '@/components/carrier/transfer-deposit-dialog';
import { TransferDepositConfirmCard } from '@/components/carrier/transfer-deposit-confirm-card';
import { cn } from '@/lib/utils';
import { BookingTransferReceiverCard, BookingTransferRequest } from '@/components/carrier/booking-transfer-receiver-card';
import { sendPush } from "@/lib/send-push";

// ... (BookingActionCardDispatcher و PendingVerificationCard كما هما بدون تغيير)

/**
 * @page CarrierDashboard
 */
export default function CarrierDashboardPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    const { profile: userProfile, isLoading: isLoadingProfile } = useUserProfile();
    const { toast } = useToast();
    const t = useTranslations('carrier');
    const locale = useLocale();
    const [tripToEdit, setTripToEdit] = useState<Trip | null>(null);
    const [isMyTrustSheetOpen, setIsMyTrustSheetOpen] = useState(false);
    const [tripToTransfer, setTripToTransfer] = useState<Trip | null>(null);

    // ── Transfer States ──
    const [isProcessingTransfer, setIsProcessingTransfer] = useState<string | null>(null);
    const [depositDialogRequest, setDepositDialogRequest] = useState<TransferRequest | null>(null);

    // ── Existing Queries ──
    const pendingBookingsQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return query(collection(firestore, 'bookings'), where('carrierId', '==', user.uid), where('status', '==', 'Pending-Carrier-Confirmation'), limit(3));
    }, [user, firestore]);

    const pendingVerificationQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return query(collection(firestore, 'bookings'), where('carrierId', '==', user.uid), where('status', '==', 'Pending-Payment-Verification'), limit(10));
    }, [user, firestore]);

    const nextTripQuery = useMemoFirebase(() => {
        if (!firestore || !user?.uid) return null;
        return query(
            collection(firestore, 'trips'),
            where('carrierId', '==', user.uid),
            where('status', 'in', ['Planned', 'In-Transit', 'Has_Offers', 'Negotiating', 'Pending-Carrier-Confirmation',
                'Confirmed', 'Awaiting-Offers'])
        );
    }, [firestore, user]);

    // ── Transfer Queries ──
    const transferReqQuery = useMemoFirebase(() => {
        if (!user?.uid || !firestore) return null;
        return query(
            collection(firestore, 'transferRequests'),
            where('toCarrierId', '==', user.uid),
            where('status', '==', 'pending')
        );
    }, [user?.uid, firestore]);

    const depositSentQuery = useMemoFirebase(() => {
        if (!user?.uid || !firestore) return null;
        return query(
            collection(firestore, 'transferRequests'),
            where('toCarrierId', '==', user.uid),
            where('status', '==', 'deposit_sent')
        );
    }, [user?.uid, firestore]);

    const depositPendingQuery = useMemoFirebase(() => {
        if (!user?.uid || !firestore) return null;
        return query(
            collection(firestore, 'transferRequests'),
            where('fromCarrierId', '==', user.uid),
            where('status', '==', 'deposit_pending')
        );
    }, [user?.uid, firestore]);

    const bookingTransferInboxQuery = useMemoFirebase(() => {
        if (!user?.uid || !firestore) return null;
        return query(
            collection(firestore, 'bookingTransferRequests'),
            where('toCarrierId', '==', user.uid),
            where('status', '==', 'pending_carrier')
        );
    }, [user?.uid, firestore]);

    // ── Collections ──
    const { data: pendingBookings, isLoading: loadingBookings } = useCollection<Booking>(pendingBookingsQuery);
    const { data: pendingVerifications, isLoading: loadingVerifications } = useCollection<Booking>(pendingVerificationQuery);
    const { data: nextTripsRaw, isLoading: loadingTrip } = useCollection<Trip>(nextTripQuery);
    const { data: transfers } = useCollection<TransferRequest>(transferReqQuery);
    const { data: depositSentTransfers } = useCollection<TransferRequest>(depositSentQuery);
    const { data: depositPendingTransfers } = useCollection<TransferRequest>(depositPendingQuery);
    const { data: bookingTransferInbox } = useCollection<BookingTransferRequest>(bookingTransferInboxQuery);

    // ── Transfer Handlers ──
    const handleAcceptTransfer = useCallback(async (request: TransferRequest) => {
        if (!firestore || !user) return;
        setIsProcessingTransfer(request.id);
        try {
            const tripSnap = await getDocs(
                query(collection(firestore, 'trips'), where('__name__', '==', request.tripId))
            );
            const tripData = tripSnap.docs[0]?.data() || {};
            const tripPrice = tripData.price || 0;
            const depositPct = tripData.depositPercentage || 20;
            const depositAmount = Math.round((tripPrice * depositPct) / 100);
            const currency = tripData.currency || 'JOD';

            await updateDoc(doc(firestore, 'transferRequests', request.id), {
                status: 'deposit_pending',
                acceptedAt: serverTimestamp(),
                depositAmount,
                currency,
                toCarrierId: user.uid,
                updatedAt: serverTimestamp(),
            });

            await addDoc(collection(doc(firestore, 'users', request.fromCarrierId), 'notifications'), {
                userId: request.fromCarrierId,
                title: '✅ الناقل قبل — أرسل العربون الآن',
                message: `وافق الناقل على استلام رحلتك. أرسل العربون (${depositAmount} ${currency}) لإتمام النقل`,
                type: 'transfer_accepted_send_deposit',
                transferRequestId: request.id,
                tripId: request.tripId,
                depositAmount,
                currency,
                isRead: false,
                link: `/${locale}/carrier/bookings`,
                createdAt: serverTimestamp(),
            });

            await sendPush({
                userId: request.fromCarrierId,
                title: '✅ الناقل قبل — أرسل العربون الآن',
                body: `وافق الناقل على استلام رحلتك. أرسل العربون (${depositAmount} ${currency}) لإتمام النقل`,
                data: { type: 'transfer_accepted_send_deposit', transferRequestId: request.id },
            });

            toast({ title: '✅ قبلت الرحلة — بانتظار العربون من الناقل الأصلي' });
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'فشل قبول الطلب', description: error?.message });
        } finally {
            setIsProcessingTransfer(null);
        }
    }, [firestore, user, toast, locale]);

    const handleRejectTransfer = useCallback(async (request: TransferRequest) => {
        if (!firestore || !user) return;
        setIsProcessingTransfer(request.id);
        try {
            await updateDoc(doc(firestore, 'transferRequests', request.id), {
                status: 'rejected',
                updatedAt: serverTimestamp(),
            });
            await addDoc(collection(doc(firestore, 'users', request.fromCarrierId), 'notifications'), {
                userId: request.fromCarrierId,
                title: 'تم رفض طلب النقل ❌',
                message: 'رفض الناقل استلام رحلتك',
                type: 'transfer_rejected',
                tripId: request.tripId,
                isRead: false,
                createdAt: serverTimestamp(),
            });
            await sendPush({
                userId: request.fromCarrierId,
                title: 'تم رفض طلب النقل ❌',
                body: 'رفض الناقل استلام رحلتك، يمكنك إرسال الطلب لناقل آخر.',
                data: { type: 'transfer_rejected', tripId: request.tripId },
            });
            toast({ title: 'تم رفض الطلب' });
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'فشل رفض الطلب', description: error?.message });
        } finally {
            setIsProcessingTransfer(null);
        }
    }, [firestore, user, toast]);

    // ── Existing Logic ──
    const upcomingTrips = useMemo(() => {
        if (!nextTripsRaw || nextTripsRaw.length === 0) return [];
        return [...nextTripsRaw]
            .filter(trip => {
                const depDate = (trip.departureDate as any)?.toDate?.()
                    ? (trip.departureDate as any).toDate()
                    : new Date(trip.departureDate || 0);
                const durationHours = (trip as any).estimatedDurationHours || 0;
                const endDate = new Date(depDate.getTime() + durationHours * 60 * 60 * 1000);
                return endDate > new Date();
            })
            .sort((a, b) => {
                const aDate = (a.departureDate as any)?.toDate?.() ?? new Date(a.departureDate || 0);
                const bDate = (b.departureDate as any)?.toDate?.() ?? new Date(b.departureDate || 0);
                return aDate.getTime() - bDate.getTime();
            })
            .slice(0, 1);
    }, [nextTripsRaw]);

    const handleBookingReject = async (bookingId: string) => {
        if (!firestore) return;
        await updateDoc(doc(firestore, 'bookings', bookingId), { status: 'Rejected', updatedAt: serverTimestamp() });
        toast({ title: t('bookingRejected') });
    };

    const handleEditTrip = (trip: Trip) => setTripToEdit(trip);

    const handleConfirmEdit = async (trip: Trip, data: EditTripFormValues) => {
        if (!firestore || !user) return;
        await updateDoc(doc(firestore, 'trips', trip.id), {
            price: Number(data.price),
            departureDate: new Date(data.departureDate).toISOString(),
            depositPercentage: data.depositPercentage,
            updatedAt: serverTimestamp()
        });
        await updateDoc(doc(firestore, 'users', user.uid), {
            depositPercentage: data.depositPercentage,
            updatedAt: serverTimestamp()
        });
    };

    // حساب إذا في طلبات نقل تستاهل تظهر السكشن
    const hasTransferItems =
        (transfers?.length || 0) +
        (depositSentTransfers?.length || 0) +
        (depositPendingTransfers?.length || 0) +
        (bookingTransferInbox?.length || 0) > 0;

    const isLoading = loadingBookings || isLoadingProfile || loadingTrip;

    return (
        <>
            <div className="space-y-6 p-4 pb-20 animate-in fade-in slide-in-from-bottom-2">
                {/* ── Header ── */}
                <div className="mb-6 space-y-4">
                    <Card className="relative overflow-hidden border-0 shadow-md bg-gradient-to-br from-primary/5 via-background to-background">
                        <div className="p-4 flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-14 w-14 border-2 border-background shadow-sm">
                                    <AvatarImage src={userProfile?.photoURL || ""} alt="User" />
                                    <AvatarFallback>{userProfile?.firstName?.[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h1 className="font-bold text-lg text-foreground">{userProfile?.firstName} {userProfile?.lastName}</h1>
                                    <span className="text-sm text-muted-foreground bg-secondary px-3 -mr-3 py-1.5 rounded-full">{t('title')}</span>
                                </div>
                            </div>
                            <button onClick={() => setIsMyTrustSheetOpen(true)} className="flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform">
                                <div className="h-10 w-10 bg-background rounded-full flex items-center justify-center shadow-sm border border-border hover:bg-muted">
                                    <ChevronLeft className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <span className="text-[10px] font-medium text-muted-foreground">{t('record')}</span>
                            </button>
                        </div>
                    </Card>
                </div>

                <LocalErrorBoundary fallbackTitle="تعثر مستشعر الاشتراك">
                    <SubscriptionStatusCard profile={userProfile} />
                </LocalErrorBoundary>

                {/* ── بانتظار تأكيد استلام العربون ── */}
                {(loadingVerifications || (pendingVerifications && pendingVerifications.length > 0)) && (
                    <section className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-[#307380] flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4" />
                                بانتظار تأكيد استلام العربون
                                {pendingVerifications && pendingVerifications.length > 0 && (
                                    <span className="bg-[#307380] text-white text-[10px] font-black rounded-full px-2 py-0.5">
                                        {pendingVerifications.length}
                                    </span>
                                )}
                            </h3>
                        </div>
                        <LocalErrorBoundary fallbackTitle="تعثر صندوق التحقق">
                            {loadingVerifications ? (
                                <Skeleton className="h-48 w-full" />
                            ) : (
                                <div className="grid gap-4 md:grid-cols-2">
                                    {/* {pendingVerifications!.map(booking => (
                                        <PendingVerificationCard key={booking.id} booking={booking} />
                                    ))} */}
                                </div>
                            )}
                        </LocalErrorBoundary>
                    </section>
                )}

                {/* ══════════════════════════════════════════════
                    طلبات تنتظر قرارك (Transfer Sections)
                ══════════════════════════════════════════════ */}
                {hasTransferItems && (
                    <section className="space-y-4">
                        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                            <ArrowRightLeft className="h-4 w-4 text-orange-500" />
                            طلبات تنتظر قرارك
                            <span className="bg-orange-500 text-white text-[10px] font-black rounded-full px-2 py-0.5">
                                {(transfers?.length || 0) + (depositSentTransfers?.length || 0) + (depositPendingTransfers?.length || 0) + (bookingTransferInbox?.length || 0)}
                            </span>
                        </h3>

                        {/* طلبات النقل الطارئة */}
                        {transfers && transfers.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-xs font-bold text-red-500 flex items-center gap-1.5">
                                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 inline-block" />
                                    طلبات النقل الطارئة
                                </p>
                                <div className="space-y-3">
                                    {transfers.map((req) => (
                                        <TransferRequestCard
                                            key={req.id}
                                            request={req}
                                            onAccept={handleAcceptTransfer}
                                            onReject={handleRejectTransfer}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* أكد استلام العربون */}
                        {depositSentTransfers && depositSentTransfers.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-xs font-bold text-orange-500 flex items-center gap-1.5">
                                    <span className="h-1.5 w-1.5 rounded-full bg-orange-500 inline-block" />
                                    أكد استلام العربون لإتمام نقل الرحلة
                                </p>
                                <div className="space-y-3">
                                    {depositSentTransfers.map((req) => (
                                        <TransferDepositConfirmCard key={req.id} request={req} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* أرسل العربون */}
                        {depositPendingTransfers && depositPendingTransfers.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-xs font-bold text-yellow-600 flex items-center gap-1.5">
                                    <span className="h-1.5 w-1.5 rounded-full bg-yellow-500 inline-block" />
                                    أرسل العربون لإتمام نقل الرحلة
                                </p>
                                <div className="space-y-3">
                                    {depositPendingTransfers.map((req) => (
                                        <div
                                            key={req.id}
                                            className="border-2 border-amber-400/50 bg-amber-500/5 rounded-xl p-4 space-y-3 cursor-pointer hover:border-amber-500 transition-colors"
                                            onClick={() => setDepositDialogRequest(req)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <p className="font-bold text-sm flex items-center gap-2">
                                                    <ArrowRightLeft className="h-4 w-4 text-amber-500" />
                                                    رحلة في انتظار إرسال العربون
                                                </p>
                                                {/* <span className="text-xs bg-amber-500/15 text-amber-700 border border-amber-500/30 rounded-full px-2 py-0.5 font-semibold">
                                                    {req.depositAmount} {req.currency}
                                                </span> */}
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                اضغط لعرض بيانات الدفع وإرسال العربون للناقل الجديد
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* مسافرون ينتقلون لرحلتك */}
                        {bookingTransferInbox && bookingTransferInbox.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                                    <span className="h-1.5 w-1.5 rounded-full bg-foreground/40 inline-block" />
                                    مسافرون ينتقلون لرحلتك
                                </p>
                                <div className="space-y-3">
                                    {bookingTransferInbox.map((req) => (
                                        <BookingTransferReceiverCard key={req.id} request={req} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>
                )}

                {/* ── الطلبات المعلقة ── */}
                <section className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-orange-600 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" /> {t('pendingRequests')}
                        </h3>
                        {pendingBookings && pendingBookings.length > 0 && (
                            <Link href="/carrier/bookings" className="text-xs text-primary hover:underline">{t('viewAll')}</Link>
                        )}
                    </div>
                    <LocalErrorBoundary fallbackTitle="تعثر صندوق الطلبات">
                        {loadingBookings ? (
                            <div className="grid gap-4 md:grid-cols-2"><Skeleton className="h-40 w-full" /><Skeleton className="h-40 w-full" /></div>
                        ) : pendingBookings && pendingBookings.length > 0 ? (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {/* {pendingBookings.map(booking => (
                                    <BookingActionCardDispatcher key={booking.id} booking={booking} onReject={handleBookingReject} />
                                ))} */}
                            </div>
                        ) : (
                            <Alert className="bg-muted/30 border-dashed">
                                <Search className="h-4 w-4 text-muted-foreground" />
                                <AlertTitle className="text-sm">{t('noPending')}</AlertTitle>
                                <AlertDescription className="text-xs text-muted-foreground">{t('noPendingDesc')}</AlertDescription>
                            </Alert>
                        )}
                    </LocalErrorBoundary>
                </section>

                {/* ── الرحلة القادمة ── */}
                {isLoading ? <Skeleton className="h-48 w-full" /> : upcomingTrips.length > 0 ? (
                    <section className="space-y-3">
                        <h3 className="text-sm font-bold flex items-center gap-2"><Route className="h-4 w-4 text-blue-600" /> {t('nextTrip')}</h3>
                        <LocalErrorBoundary fallbackTitle="تعثرت قائمة رحلاتي">
                            <MyTripsList
                                trips={upcomingTrips}
                                isLoading={false}
                                onEdit={handleEditTrip}
                                onTransfer={(trip) => setTripToTransfer(trip)}
                                carrierProfile={userProfile}
                            />
                        </LocalErrorBoundary>
                    </section>
                ) : null}
            </div>

            <EditTripDialog isOpen={!!tripToEdit} onOpenChange={(open) => !open && setTripToEdit(null)} trip={tripToEdit} onConfirm={handleConfirmEdit} />
            <CarrierTrustSheet isOpen={isMyTrustSheetOpen} onClose={() => setIsMyTrustSheetOpen(false)} carrierId={user?.uid || null} />
            <TransferRequestDialog
                isOpen={!!tripToTransfer}
                onOpenChange={(open) => !open && setTripToTransfer(null)}
                trip={tripToTransfer}
            />

            {/* Deposit Dialog */}
            <TransferDepositDialog
                isOpen={!!depositDialogRequest}
                onOpenChange={(open) => { if (!open) setDepositDialogRequest(null); }}
                request={depositDialogRequest}
                depositAmount={depositDialogRequest?.depositAmount || 0}
                currency={depositDialogRequest?.currency || 'JOD'}
            />
        </>
    );
}