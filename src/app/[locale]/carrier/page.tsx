'use client';

import { useMemo, useState } from 'react';
import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit, doc, serverTimestamp, updateDoc, Timestamp } from 'firebase/firestore';
import { Link } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { AlertCircle, Route, Search, Star, ChevronLeft, ArrowRightLeft, Zap, User } from 'lucide-react';
import { BookingActionCard } from '@/components/carrier/booking-action-card';
import { MyTripsList } from '@/components/carrier/my-trips-list';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import type { Trip, Booking, UserProfile } from '@/lib/data';
import { EditTripDialog, type EditTripFormValues } from '@/components/carrier/edit-trip-dialog';
import { CarrierTrustSheet } from '@/components/carrier/carrier-trust-sheet';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { useUserProfile } from '@/hooks/use-user-profile';
import { SubscriptionStatusCard } from '@/components/carrier/subscription-status-card';
import { LocalErrorBoundary } from '@/components/ui/local-error-boundary';

/**
 * @component BookingActionCardDispatcher
 * @description THE ARTERIAL IDENTITY DISPATCHER FOR CARRIERS [SC-806 V2.6]
 */
function BookingActionCardDispatcher({ booking, onReject }: { booking: Booking, onReject: any }) {
    const firestore = useFirestore();
    const travelerRef = useMemoFirebase(() => firestore ? doc(firestore, 'users', booking.userId) : null, [firestore, booking.userId]);
    const { data: travelerProfile } = useDoc<UserProfile>(travelerRef);
    return <BookingActionCard booking={booking} onReject={onReject} />;
}

/**
 * @page CarrierDashboard
 * @description THE REINFORCED OPS CENTER (SC-806 V5.5)
 * [SC-806 V5.5]: Eradicated "Double Echo" by passing profile pulse directly.
 * Enforced useMemoFirebase for queries to ensure zero redundant reads.
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

    const pendingBookingsQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return query(collection(firestore, 'bookings'), where('carrierId', '==', user.uid), where('status', '==', 'Pending-Carrier-Confirmation'), limit(3));
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
    const { data: pendingBookings, isLoading: loadingBookings } = useCollection<Booking>(pendingBookingsQuery);
    const { data: nextTripsRaw, isLoading: loadingTrip } = useCollection<Trip>(nextTripQuery);


    const upcomingTrips = useMemo(() => {
        if (!nextTripsRaw || nextTripsRaw.length === 0) return [];
        return [...nextTripsRaw]
            .filter(trip => {
                // ✅ استبعد الرحلات اللي انتهى وقتها
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
    // const hasActiveTrip = upcomingTrips.length > 0;

    const handleBookingReject = async (bookingId: string) => {
        if (!firestore) return;
        await updateDoc(doc(firestore, 'bookings', bookingId), { status: 'Rejected', updatedAt: serverTimestamp() });
        toast({ title: t('bookingRejected') });
    };

    const handleEditTrip = (trip: Trip) => setTripToEdit(trip);


    const handleConfirmEdit = async (trip: Trip, data: EditTripFormValues) => {
        if (!firestore) return;

        await updateDoc(doc(firestore, 'trips', trip.id), {
            price: Number(data.price), // ✅ توحيد السعر
            // availableSeats: data.availableSeats,

            // ✅ تحويل التاريخ لـ Timestamp
            // departureDate: Timestamp.fromDate(new Date(data.departureDate)),
            departureDate: new Date(data.departureDate).toISOString(),
            updatedAt: serverTimestamp()
        });
    };

    const isLoading = loadingBookings || isLoadingProfile || loadingTrip;

    return (
        <>
            <div className="space-y-6 p-4 pb-20 animate-in fade-in slide-in-from-bottom-2">
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
                    {/* [SC-806 V5.5]: Pass profile directly to eradicate Double Echo syndrome */}
                    <SubscriptionStatusCard profile={userProfile} />
                </LocalErrorBoundary>

                <section className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-orange-600 flex items-center gap-2"><AlertCircle className="h-4 w-4" /> {t('pendingRequests')}</h3>
                        {pendingBookings && pendingBookings.length > 0 && <Link href="/carrier/bookings" className="text-xs text-primary hover:underline">{t('viewAll')}</Link>}
                    </div>

                    <LocalErrorBoundary fallbackTitle="تعثر صندوق الطلبات">
                        {loadingBookings ? (
                            <div className="grid gap-4 md:grid-cols-2"><Skeleton className="h-40 w-full" /><Skeleton className="h-40 w-full" /></div>
                        ) : pendingBookings && pendingBookings.length > 0 ? (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {pendingBookings.map(booking => (
                                    <BookingActionCardDispatcher key={booking.id} booking={booking} onReject={handleBookingReject} />
                                ))}
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

                {isLoading ? <Skeleton className="h-48 w-full" /> : upcomingTrips.length > 0 ? (
                    <section className="space-y-3">
                        <h3 className="text-sm font-bold flex items-center gap-2"><Route className="h-4 w-4 text-blue-600" /> {t('nextTrip')}</h3>
                        <LocalErrorBoundary fallbackTitle="تعثرت قائمة رحلاتي">
                            <MyTripsList trips={upcomingTrips} isLoading={false} onEdit={handleEditTrip} carrierProfile={userProfile} />
                        </LocalErrorBoundary>
                    </section>
                ) : null}
            </div>

            <EditTripDialog isOpen={!!tripToEdit} onOpenChange={(open) => !open && setTripToEdit(null)} trip={tripToEdit} onConfirm={handleConfirmEdit} />
            <CarrierTrustSheet isOpen={isMyTrustSheetOpen} onClose={() => setIsMyTrustSheetOpen(false)} carrierId={user?.uid || null} />
        </>
    );
}


// 'use client';

// import { useMemo, useState } from 'react';
// import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase';
// import { collection, query, where, limit, doc, serverTimestamp, updateDoc, Timestamp } from 'firebase/firestore';
// import { Link } from '@/i18n/routing';
// import { useTranslations, useLocale } from 'next-intl';
// import { AlertCircle, Route, Search, Star, ChevronLeft, ArrowRightLeft, Zap, User, Briefcase, MapPin, Users } from 'lucide-react';
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
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { useUserProfile } from '@/hooks/use-user-profile';
// import { SubscriptionStatusCard } from '@/components/carrier/subscription-status-card';
// import { LocalErrorBoundary } from '@/components/ui/local-error-boundary';
// import { OfferDialog } from '@/components/carrier/offer-dialog';
// import { useOfferDialog } from '@/hooks/use-offer-dialog';
// import { getCityName } from '@/lib/constants';

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
//  * @component MarketOpportunityCard
//  * @description كارت فرص السوق — يفرّق بين طلبات الوكلاء والمسافرين
//  */
// function MarketOpportunityCard({ trip, onOpenOffer }: { trip: Trip; onOpenOffer: () => void }) {
//     const locale = useLocale();
//     const isFromAgent = trip.creatorRole === 'agent' && !!trip.agentId;

//     const depDate = (trip.departureDate as any)?.toDate?.()
//         ? (trip.departureDate as any).toDate()
//         : new Date(trip.departureDate || 0);
//     const dateLabel = depDate instanceof Date && !isNaN(depDate.getTime())
//         ? depDate.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' })
//         : '';
//     const tripAny = trip as any;
//     const origin = trip.origin || tripAny.jurisdiction?.origin || tripAny.from || '';
//     const destination = trip.destination || tripAny.jurisdiction?.destination || tripAny.to || '';
//     return (
//         <div className={`border rounded-[2rem] p-5 space-y-4 transition-all ${isFromAgent
//             ? 'border-amber-500/30 bg-amber-500/5'
//             : 'border-primary/20 bg-card/40'
//             }`}>
//             <div className="flex items-start justify-between gap-3">
//                 <div className="flex-1 space-y-2">
//                     <div className="flex items-center gap-2 flex-wrap">
//                         {isFromAgent && (
//                             <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 font-black text-[9px] px-2 h-5 gap-1">
//                                 <Briefcase className="h-2.5 w-2.5" /> طلب وكيل
//                             </Badge>
//                         )}
//                         <Badge variant="outline" className="font-black text-[9px] px-2 h-5 gap-1">
//                             <Users className="h-2.5 w-2.5" />
//                             {/* {trip.passengers || 1} مسافر */}
//                             {(() => {
//                                 const p = (trip as any).passengers;
//                                 if (typeof p === 'number') return p;
//                                 if (Array.isArray(p)) return p.length;
//                                 return 1;
//                             })()} مسافر
//                         </Badge>
//                         {dateLabel && (
//                             <span className="text-[10px] text-muted-foreground">{dateLabel}</span>
//                         )}
//                     </div>
//                     <div className="flex items-center gap-2 text-sm font-bold">
//                         <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
//                         <span>{getCityName(origin, locale)}</span>
//                         <span className="text-muted-foreground">←</span>
//                         <span>{getCityName(destination, locale)}</span>
//                     </div>
//                 </div>

//                 {isFromAgent && (
//                     <div className="flex flex-col items-end gap-1 shrink-0">
//                         <p className="text-[9px] text-muted-foreground">الوكيل</p>
//                         <p className="text-sm font-black text-white">{trip.agentName || 'وكيل'}</p>
//                         <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg px-2 py-0.5">
//                             <p className="text-[9px] text-amber-400 font-black">عمولة: {trip.agentFee || 0} {trip.currency || 'JOD'}</p>
//                         </div>
//                     </div>
//                 )}
//             </div>

//             <Button
//                 className={`w-full font-black rounded-2xl h-11 ${isFromAgent
//                     ? 'bg-amber-500 hover:bg-amber-600 text-black'
//                     : 'bg-primary hover:bg-primary/90 text-black'
//                     }`}
//                 onClick={onOpenOffer}
//             >
//                 <Zap className="h-4 w-4 ml-1" />
//                 تقديم عرض سعر
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

//     const { selectedTrip, isDialogOpen, openOfferDialog, setIsDialogOpen, handleSendOffer } = useOfferDialog();

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

//     // [SCR-ABF]: طلبات السوق العامة (Awaiting-Offers بدون targetCarrierId)
//     const marketQuery = useMemoFirebase(() => {
//         if (!firestore || !user?.uid) return null;
//         return query(
//             collection(firestore, 'trips'),
//             where('status', '==', 'Awaiting-Offers'),
//         );
//     }, [firestore, user?.uid]);

//     const { data: pendingBookings, isLoading: loadingBookings } = useCollection<Booking>(pendingBookingsQuery);
//     const { data: nextTripsRaw, isLoading: loadingTrip } = useCollection<Trip>(nextTripQuery);
//     const { data: marketTripsRaw, isLoading: loadingMarket } = useCollection<Trip>(marketQuery);

//     // فلتر السوق: مش رحلاتي + مش موجّه لناقل محدد
//     const marketTrips = useMemo(() => {
//         if (!marketTripsRaw) return [];
//         return marketTripsRaw.filter(
//             (t) => t.carrierId !== user?.uid && !t.targetCarrierId
//         );
//     }, [marketTripsRaw, user?.uid]);


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

//                 {/* [SCR-ABF]: فرص السوق — طلبات الوكلاء والمسافرين */}
//                 {(loadingMarket ? (
//                     <section className="space-y-3">
//                         <Skeleton className="h-5 w-32" />
//                         <Skeleton className="h-36 w-full rounded-[2rem]" />
//                     </section>
//                 ) : marketTrips.length > 0 ? (
//                     <section className="space-y-3">
//                         <h3 className="text-sm font-bold flex items-center gap-2">
//                             <Zap className="h-4 w-4 text-amber-500" />
//                             فرص السوق
//                             <Badge variant="secondary" className="h-5 px-2 text-[10px]">{marketTrips.length}</Badge>
//                         </h3>
//                         <div className="grid gap-4 md:grid-cols-2">
//                             {marketTrips.map(trip => (
//                                 <MarketOpportunityCard
//                                     key={trip.id}
//                                     trip={trip}
//                                     onOpenOffer={() => openOfferDialog(trip)}
//                                 />
//                             ))}
//                         </div>
//                     </section>
//                 ) : null)}
//             </div>

//             <EditTripDialog isOpen={!!tripToEdit} onOpenChange={(open) => !open && setTripToEdit(null)} trip={tripToEdit} onConfirm={handleConfirmEdit} />
//             <CarrierTrustSheet isOpen={isMyTrustSheetOpen} onClose={() => setIsMyTrustSheetOpen(false)} carrierId={user?.uid || null} />

//             {selectedTrip && (
//                 <OfferDialog
//                     isOpen={isDialogOpen}
//                     onOpenChange={setIsDialogOpen}
//                     trip={selectedTrip}
//                     onSendOffer={(offerData) => handleSendOffer(offerData, selectedTrip.id)}
//                 />
//             )}
//         </>
//     );
// }