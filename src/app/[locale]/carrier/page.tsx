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

