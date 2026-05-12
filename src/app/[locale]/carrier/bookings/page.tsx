// /**
//  * @page BookingRequestsPage - REDESIGNED (Modern, Responsive, RTL/LTR)
//  */
// 'use client';

// import { useState, useMemo, useCallback } from 'react';
// import { useUser, useFirestore, useCollection, useFunctions, useMemoFirebase, useDoc } from '@/firebase';
// import { collection, query, where, doc, updateDoc, serverTimestamp, addDoc } from 'firebase/firestore';
// import { httpsCallable } from 'firebase/functions';
// import { BookingActionCard } from '@/components/carrier/booking-action-card';
// import {
//     Inbox, ArrowRightLeft, Zap, User,
//     Clock, CreditCard, CheckCircle2, PackageOpen
// } from 'lucide-react';
// import { useToast } from '@/hooks/use-toast';
// import type { Booking, Trip, TransferRequest, UserProfile } from '@/lib/data';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Avatar, AvatarFallback } from '@/components/ui/avatar';
// import { Skeleton } from '@/components/ui/skeleton';
// import { getCityName } from '@/lib/constants';
// import { OfferDialog } from '@/components/carrier/offer-dialog';
// import { useOfferDialog } from '@/hooks/use-offer-dialog';
// import { useTranslations, useLocale } from 'next-intl';
// import { TransferRequestCard } from '@/components/carrier/transfer-request-card';
// import { cn } from '@/lib/utils';

// /* ─────────────────────────────────────────────────────────────
//    Section Header
// ───────────────────────────────────────────────────────────── */
// function SectionHeader({
//     icon: Icon,
//     label,
//     count,
//     color,
// }: {
//     icon: React.ElementType;
//     label: string;
//     count: number;
//     color: 'red' | 'blue' | 'orange' | 'yellow' | 'green' | 'default';
// }) {
//     const colorMap = {
//         red: 'text-red-500 bg-red-500/10 border-red-500/20',
//         blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
//         orange: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
//         yellow: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
//         green: 'text-green-500 bg-green-500/10 border-green-500/20',
//         default: 'text-foreground bg-muted border-border',
//     };
//     const badgeMap = {
//         red: 'bg-red-500/15 text-red-500 border-red-500/20',
//         blue: 'bg-blue-500/15 text-blue-500 border-blue-500/20',
//         orange: 'bg-orange-500/15 text-orange-500 border-orange-500/20',
//         yellow: 'bg-yellow-500/15 text-yellow-500 border-yellow-500/20',
//         green: 'bg-green-500/15 text-green-500 border-green-500/20',
//         default: 'bg-muted text-foreground border-border',
//     };

//     return (
//         <div className="flex items-center gap-2.5 mb-3">
//             <div className={cn('flex items-center justify-center h-7 w-7 rounded-lg border', colorMap[color])}>
//                 <Icon className="h-3.5 w-3.5" />
//             </div>
//             <span className={cn('text-sm font-bold', colorMap[color].split(' ')[0])}>
//                 {label}
//             </span>
//             <Badge
//                 variant="outline"
//                 className={cn('h-5 px-2 text-[10px] font-black rounded-full border', badgeMap[color])}
//             >
//                 {count}
//             </Badge>
//             <div className="flex-1 h-px bg-border/50" />
//         </div>
//     );
// }

// /* ─────────────────────────────────────────────────────────────
//    Direct Request Card
// ───────────────────────────────────────────────────────────── */
// function DirectRequestCard({ trip, onOpenOffer }: { trip: Trip; onOpenOffer: () => void }) {
//     const firestore = useFirestore();
//     const tCarrier = useTranslations('carrier');
//     const t = useTranslations('bookingRequests');
//     const locale = useLocale();

//     const travelerRef = useMemoFirebase(() => {
//         if (!firestore || !trip.userId) return null;
//         return doc(firestore, 'users', trip.userId);
//     }, [firestore, trip.userId]);

//     const { data: travelerProfile, isLoading } = useDoc<UserProfile>(travelerRef);
//     const travelerName =
//         [travelerProfile?.firstName, travelerProfile?.lastName].filter(Boolean).join(' ').trim() ||
//         travelerProfile?.fullName ||
//         travelerProfile?.displayName ||
//         trip.passengersDetails?.[0]?.name ||
//         tCarrier('traveler');

//     return (
//         <div className="group relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-blue-500/0 p-4 sm:p-5 shadow-sm transition-all duration-200 hover:border-blue-500/40 hover:shadow-md">
//             {/* Top accent line */}
//             <div className="absolute top-0 start-0 end-0 h-0.5 bg-gradient-to-r from-blue-500/60 via-blue-400/40 to-transparent rounded-t-2xl" />

//             <div className="flex flex-col sm:flex-row sm:items-center gap-4">
//                 {/* Traveler info */}
//                 <div className="flex items-center gap-3 flex-1 min-w-0">
//                     {isLoading ? (
//                         <Skeleton className="h-11 w-11 rounded-full shrink-0" />
//                     ) : (
//                         <Avatar className="h-11 w-11 shrink-0 border-2 border-blue-500/20 shadow">
//                             <AvatarFallback className="bg-blue-500/10 text-blue-600 font-black text-sm">
//                                 {travelerName?.charAt(0)?.toUpperCase() || <User className="h-4 w-4" />}
//                             </AvatarFallback>
//                         </Avatar>
//                     )}
//                     <div className="min-w-0 flex-1">
//                         <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">
//                             {t('specialRequestForYou')}
//                         </p>
//                         <p className="font-black text-sm text-foreground truncate">
//                             {isLoading ? <Skeleton className="h-4 w-24 inline-block" /> : travelerName}
//                         </p>
//                         <p className="text-xs text-muted-foreground mt-0.5 font-medium">
//                             {getCityName(trip.origin, locale)} ← {getCityName(trip.destination, locale)}
//                         </p>
//                     </div>
//                 </div>

//                 {/* Badge + CTA */}
//                 <div className="flex items-center gap-2 shrink-0">
//                     <Badge variant="outline" className="h-6 text-[10px] bg-blue-500/10 text-blue-600 border-blue-500/20 font-bold hidden sm:flex">
//                         {t('waitingOffer')}
//                     </Badge>
//                     <Button
//                         size="sm"
//                         className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-sm text-xs"
//                         onClick={onOpenOffer}
//                     >
//                         <Zap className="h-3.5 w-3.5 me-1.5" />
//                         {t('waitingOffer')}
//                     </Button>
//                 </div>
//             </div>
//         </div>
//     );
// }

// /* ─────────────────────────────────────────────────────────────
//    Loading Skeleton
// ───────────────────────────────────────────────────────────── */
// function LoadingSkeleton() {
//     return (
//         <div className="space-y-3">
//             {[1, 2, 3].map((i) => (
//                 <div key={i} className="rounded-2xl border border-border/50 p-4 space-y-3 animate-pulse">
//                     <div className="flex items-center gap-3">
//                         <Skeleton className="h-12 w-12 rounded-full" />
//                         <div className="flex-1 space-y-2">
//                             <Skeleton className="h-3.5 w-32" />
//                             <Skeleton className="h-3 w-48" />
//                         </div>
//                         <Skeleton className="h-8 w-16 rounded-lg" />
//                     </div>
//                     <Skeleton className="h-10 w-full rounded-xl" />
//                 </div>
//             ))}
//         </div>
//     );
// }

// /* ─────────────────────────────────────────────────────────────
//    Empty State
// ───────────────────────────────────────────────────────────── */
// function EmptyState({ t }: { t: any }) {
//     return (
//         <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
//             <div className="relative mb-5">
//                 <div className="h-20 w-20 rounded-2xl bg-muted/60 border border-border/50 flex items-center justify-center">
//                     <PackageOpen className="h-9 w-9 text-muted-foreground/50" />
//                 </div>
//                 <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-green-500/15 border border-green-500/20 flex items-center justify-center">
//                     <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
//                 </div>
//             </div>
//             <h3 className="text-base font-black text-foreground mb-1">{t('inboxCleanTitle')}</h3>
//             <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">{t('inboxCleanDesc')}</p>
//         </div>
//     );
// }

// /* ─────────────────────────────────────────────────────────────
//    Main Page
// ───────────────────────────────────────────────────────────── */
// export default function BookingRequestsPage() {
//     const { user } = useUser();
//     const firestore = useFirestore();
//     const functions = useFunctions();
//     const { toast } = useToast();
//     const t = useTranslations('bookingRequests');
//     const tCommon = useTranslations('common');
//     const tError = useTranslations('errorDictionary');
//     const locale = useLocale();
//     const [isProcessingTransfer, setIsProcessingTransfer] = useState<string | null>(null);

//     const { selectedTrip, isDialogOpen, openOfferDialog, setIsDialogOpen, handleSendOffer } = useOfferDialog();

//     const bookingReqQuery = useMemoFirebase(() => {
//         if (!user?.uid || !firestore) return null;
//         return query(collection(firestore, 'bookings'), where('carrierId', '==', user.uid));
//     }, [user?.uid, firestore]);

//     const directReqQuery = useMemoFirebase(() => {
//         if (!user?.uid || !firestore) return null;
//         return query(
//             collection(firestore, 'trips'),
//             where('targetCarrierId', '==', user.uid),
//             where('requestType', '==', 'Direct'),
//             where('status', '==', 'Awaiting-Offers')
//         );
//     }, [user?.uid, firestore]);

//     const transferReqQuery = useMemoFirebase(() => {
//         if (!user?.uid || !firestore) return null;
//         return query(
//             collection(firestore, 'transferRequests'),
//             where('toCarrierId', '==', user.uid),
//             where('status', '==', 'pending')
//         );
//     }, [user?.uid, firestore]);

//     const { data: bookings, isLoading: loadBookings } = useCollection<Booking>(bookingReqQuery);
//     const { data: directTrips, isLoading: loadDirect } = useCollection<Trip>(directReqQuery);
//     const { data: transfers, isLoading: loadTransfers } = useCollection<TransferRequest>(transferReqQuery);

//     const isLoading = loadBookings || loadDirect || loadTransfers;

//     const pendingConfirmation = useMemo(
//         () => (bookings || []).filter((b) => b.status === 'Pending-Carrier-Confirmation'),
//         [bookings]
//     );
//     const pendingPayment = useMemo(
//         () => (bookings || []).filter((b) => b.status === 'Pending-Payment'),
//         [bookings]
//     );
//     const pendingVerification = useMemo(
//         () => (bookings || []).filter((b) => b.status === 'Pending-Payment-Verification'),
//         [bookings]
//     );
//     const confirmedBookings = useMemo(
//         () => (bookings || []).filter((b) => b.status === 'Confirmed'),
//         [bookings]
//     );

//     const hasItems = useMemo(
//         () =>
//             (pendingConfirmation.length +
//                 pendingPayment.length +
//                 pendingVerification.length +
//                 confirmedBookings.length +
//                 (directTrips?.length || 0) +
//                 (transfers?.length || 0)) > 0,
//         [pendingConfirmation, pendingPayment, pendingVerification, confirmedBookings, directTrips, transfers]
//     );

//     const handleAcceptTransfer = useCallback(
//         async (request: TransferRequest) => {
//             if (!functions) return;
//             setIsProcessingTransfer(request.id);
//             try {
//                 const acceptFn = httpsCallable(functions, 'acceptTransferSovereign');
//                 await acceptFn({ transferRequestId: request.id });
//                 toast({ title: tCommon('success') });
//             } catch (error: any) {
//                 toast({ variant: 'destructive', title: tCommon('error'), description: tError(error.message || 'DEFAULT') });
//             } finally {
//                 setIsProcessingTransfer(null);
//             }
//         },
//         [functions, tCommon, tError, toast]
//     );

//     const handleRejectBooking = useCallback(
//         async (bookingId: string) => {
//             if (!firestore) return;
//             const booking = bookings?.find((b) => b.id === bookingId);
//             if (!booking) return;
//             try {
//                 await updateDoc(doc(firestore, 'bookings', bookingId), {
//                     status: 'Cancelled',
//                     cancelReason: 'رُفض من الناقل',
//                     cancelledBy: 'carrier',
//                     cancelledAt: serverTimestamp(),
//                     updatedAt: serverTimestamp(),
//                 });
//                 if (booking.bookedByAgent && booking.agentId) {
//                     await addDoc(collection(doc(firestore, 'users', booking.agentId), 'notifications'), {
//                         userId: booking.agentId,
//                         title: 'رفض الناقل الحجز ❌',
//                         message: `تم رفض حجز ${booking.seats} مقعد من قِبل الناقل`,
//                         type: 'carrier_rejected_booking',
//                         bookingId: booking.id,
//                         tripId: booking.tripId,
//                         isRead: false,
//                         link: `/${locale}/agent`,
//                         createdAt: serverTimestamp(),
//                     });
//                 }
//                 if (!booking.bookedByAgent && booking.userId) {
//                     await addDoc(collection(doc(firestore, 'users', booking.userId), 'notifications'), {
//                         userId: booking.userId,
//                         title: 'رفض الناقل الحجز ❌',
//                         message: `تم رفض حجز ${booking.seats} مقعد`,
//                         type: 'carrier_rejected_booking',
//                         bookingId: booking.id,
//                         tripId: booking.tripId,
//                         isRead: false,
//                         link: `/${locale}/history`,
//                         createdAt: serverTimestamp(),
//                     });
//                 }
//                 toast({ title: 'تم رفض الحجز' });
//             } catch (error: any) {
//                 toast({ variant: 'destructive', title: 'فشل رفض الحجز', description: error?.message });
//             }
//         },
//         [firestore, bookings, locale, toast]
//     );

//     return (
//         <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
//             {/* Loading */}
//             {isLoading && <LoadingSkeleton />}

//             {/* Empty state */}
//             {!isLoading && !hasItems && <EmptyState t={t} />}

//             {!isLoading && hasItems && (
//                 <>
//                     {/* Emergency Transfers */}
//                     {transfers && transfers.length > 0 && (
//                         <section>
//                             <SectionHeader icon={ArrowRightLeft} label={t('emergencyTransfers')} count={transfers.length} color="red" />
//                             <div className="space-y-3">
//                                 {transfers.map((req) => (
//                                     <TransferRequestCard
//                                         key={req.id}
//                                         request={req}
//                                         onAccept={handleAcceptTransfer}
//                                         onReject={async () => { }}
//                                     />
//                                 ))}
//                             </div>
//                         </section>
//                     )}

//                     {/* Direct Requests */}
//                     {directTrips && directTrips.length > 0 && (
//                         <section>
//                             <SectionHeader icon={Zap} label={t('directRequests')} count={directTrips.length} color="blue" />
//                             <div className="space-y-3">
//                                 {directTrips.map((trip) => (
//                                     <DirectRequestCard key={trip.id} trip={trip} onOpenOffer={() => openOfferDialog(trip)} />
//                                 ))}
//                             </div>
//                         </section>
//                     )}

//                     {/* Pending Carrier Confirmation */}
//                     {pendingConfirmation.length > 0 && (
//                         <section>
//                             <SectionHeader icon={Inbox} label={t('pendingBookings')} count={pendingConfirmation.length} color="default" />
//                             <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
//                                 {pendingConfirmation.map((booking) => (
//                                     <BookingActionCard key={booking.id} booking={booking} onReject={handleRejectBooking} />
//                                 ))}
//                             </div>
//                         </section>
//                     )}

//                     {/* Pending Payment */}
//                     {pendingPayment.length > 0 && (
//                         <section>
//                             <SectionHeader icon={Clock} label="بانتظار دفع المسافر" count={pendingPayment.length} color="orange" />
//                             <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
//                                 {pendingPayment.map((booking) => (
//                                     <BookingActionCard key={booking.id} booking={booking} onReject={handleRejectBooking} />
//                                 ))}
//                             </div>
//                         </section>
//                     )}

//                     {/* Pending Payment Verification */}
//                     {pendingVerification.length > 0 && (
//                         <section>
//                             <SectionHeader icon={CreditCard} label="المسافر دفع — تحقق من الدفع" count={pendingVerification.length} color="yellow" />
//                             <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
//                                 {pendingVerification.map((booking) => (
//                                     <BookingActionCard key={booking.id} booking={booking} onReject={handleRejectBooking} />
//                                 ))}
//                             </div>
//                         </section>
//                     )}

//                     {/* Confirmed Bookings */}
//                     {confirmedBookings.length > 0 && (
//                         <section>
//                             <SectionHeader icon={CheckCircle2} label="حجوزات مؤكدة" count={confirmedBookings.length} color="green" />
//                             <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
//                                 {confirmedBookings.map((booking) => (
//                                     <BookingActionCard key={booking.id} booking={booking} onReject={handleRejectBooking} />
//                                 ))}
//                             </div>
//                         </section>
//                     )}
//                 </>
//             )}

//             {selectedTrip && (
//                 <OfferDialog
//                     isOpen={isDialogOpen}
//                     onOpenChange={setIsDialogOpen}
//                     trip={selectedTrip}
//                     onSendOffer={(offerData) => handleSendOffer(offerData, selectedTrip.id)}
//                 />
//             )}
//         </div>
//     );
// }
/**
 * @page BookingRequestsPage - REDESIGNED (Modern, Responsive, RTL/LTR)
 */
'use client';

import { useState, useMemo, useCallback } from 'react';
import { sendPush } from "@/lib/send-push";
import { useUser, useFirestore, useCollection, useFunctions, useMemoFirebase, useDoc } from '@/firebase';
import { collection, query, where, doc, updateDoc, serverTimestamp, addDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { BookingActionCard } from '@/components/carrier/booking-action-card';
import {
    Inbox, ArrowRightLeft, Zap, User,
    Clock, CreditCard, CheckCircle2, PackageOpen
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Booking, Trip, TransferRequest, UserProfile } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { getCityName } from '@/lib/constants';
import { OfferDialog } from '@/components/carrier/offer-dialog';
import { useOfferDialog } from '@/hooks/use-offer-dialog';
import { useTranslations, useLocale } from 'next-intl';
import { TransferRequestCard } from '@/components/carrier/transfer-request-card';
import { cn } from '@/lib/utils';

/* ─────────────────────────────────────────────────────────────
   Section Header
───────────────────────────────────────────────────────────── */
function SectionHeader({
    icon: Icon,
    label,
    count,
    color,
}: {
    icon: React.ElementType;
    label: string;
    count: number;
    color: 'red' | 'blue' | 'orange' | 'yellow' | 'green' | 'default';
}) {
    const colorMap = {
        red: 'text-red-500 bg-red-500/10 border-red-500/20',
        blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
        orange: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
        yellow: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
        green: 'text-green-500 bg-green-500/10 border-green-500/20',
        default: 'text-foreground bg-muted border-border',
    };
    const badgeMap = {
        red: 'bg-red-500/15 text-red-500 border-red-500/20',
        blue: 'bg-blue-500/15 text-blue-500 border-blue-500/20',
        orange: 'bg-orange-500/15 text-orange-500 border-orange-500/20',
        yellow: 'bg-yellow-500/15 text-yellow-500 border-yellow-500/20',
        green: 'bg-green-500/15 text-green-500 border-green-500/20',
        default: 'bg-muted text-foreground border-border',
    };

    return (
        <div className="flex items-center gap-2.5 mb-3">
            <div className={cn('flex items-center justify-center h-7 w-7 rounded-lg border', colorMap[color])}>
                <Icon className="h-3.5 w-3.5" />
            </div>
            <span className={cn('text-sm font-bold', colorMap[color].split(' ')[0])}>
                {label}
            </span>
            <Badge
                variant="outline"
                className={cn('h-5 px-2 text-[10px] font-black rounded-full border', badgeMap[color])}
            >
                {count}
            </Badge>
            <div className="flex-1 h-px bg-border/50" />
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────
   Direct Request Card
───────────────────────────────────────────────────────────── */
function DirectRequestCard({ trip, onOpenOffer }: { trip: Trip; onOpenOffer: () => void }) {
    const firestore = useFirestore();
    const tCarrier = useTranslations('carrier');
    const t = useTranslations('bookingRequests');
    const locale = useLocale();

    const travelerRef = useMemoFirebase(() => {
        if (!firestore || !trip.userId) return null;
        return doc(firestore, 'users', trip.userId);
    }, [firestore, trip.userId]);

    const { data: travelerProfile, isLoading } = useDoc<UserProfile>(travelerRef);
    const travelerName =
        [travelerProfile?.firstName, travelerProfile?.lastName].filter(Boolean).join(' ').trim() ||
        travelerProfile?.fullName ||
        travelerProfile?.displayName ||
        trip.passengersDetails?.[0]?.name ||
        tCarrier('traveler');

    return (
        <div className="group relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-blue-500/0 p-4 sm:p-5 shadow-sm transition-all duration-200 hover:border-blue-500/40 hover:shadow-md">
            {/* Top accent line */}
            <div className="absolute top-0 start-0 end-0 h-0.5 bg-gradient-to-r from-blue-500/60 via-blue-400/40 to-transparent rounded-t-2xl" />

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Traveler info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    {isLoading ? (
                        <Skeleton className="h-11 w-11 rounded-full shrink-0" />
                    ) : (
                        <Avatar className="h-11 w-11 shrink-0 border-2 border-blue-500/20 shadow">
                            <AvatarFallback className="bg-blue-500/10 text-blue-600 font-black text-sm">
                                {travelerName?.charAt(0)?.toUpperCase() || <User className="h-4 w-4" />}
                            </AvatarFallback>
                        </Avatar>
                    )}
                    <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">
                            {t('specialRequestForYou')}
                        </p>
                        <p className="font-black text-sm text-foreground truncate">
                            {isLoading ? <Skeleton className="h-4 w-24 inline-block" /> : travelerName}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                            {getCityName(trip.origin, locale)} ← {getCityName(trip.destination, locale)}
                        </p>
                    </div>
                </div>

                {/* Badge + CTA */}
                <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="outline" className="h-6 text-[10px] bg-blue-500/10 text-blue-600 border-blue-500/20 font-bold hidden sm:flex">
                        {t('waitingOffer')}
                    </Badge>
                    <Button
                        size="sm"
                        className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-sm text-xs"
                        onClick={onOpenOffer}
                    >
                        <Zap className="h-3.5 w-3.5 me-1.5" />
                        {t('waitingOffer')}
                    </Button>
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────
   Loading Skeleton
───────────────────────────────────────────────────────────── */
function LoadingSkeleton() {
    return (
        <div className="space-y-3">
            {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl border border-border/50 p-4 space-y-3 animate-pulse">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-3.5 w-32" />
                            <Skeleton className="h-3 w-48" />
                        </div>
                        <Skeleton className="h-8 w-16 rounded-lg" />
                    </div>
                    <Skeleton className="h-10 w-full rounded-xl" />
                </div>
            ))}
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────
   Empty State
───────────────────────────────────────────────────────────── */
function EmptyState({ t }: { t: any }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="relative mb-5">
                <div className="h-20 w-20 rounded-2xl bg-muted/60 border border-border/50 flex items-center justify-center">
                    <PackageOpen className="h-9 w-9 text-muted-foreground/50" />
                </div>
                <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-green-500/15 border border-green-500/20 flex items-center justify-center">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                </div>
            </div>
            <h3 className="text-base font-black text-foreground mb-1">{t('inboxCleanTitle')}</h3>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">{t('inboxCleanDesc')}</p>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────
   Main Page
───────────────────────────────────────────────────────────── */
export default function BookingRequestsPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    const functions = useFunctions();
    const { toast } = useToast();
    const t = useTranslations('bookingRequests');
    const tCommon = useTranslations('common');
    const tError = useTranslations('errorDictionary');
    const locale = useLocale();
    const [isProcessingTransfer, setIsProcessingTransfer] = useState<string | null>(null);

    const { selectedTrip, isDialogOpen, openOfferDialog, setIsDialogOpen, handleSendOffer } = useOfferDialog();

    const bookingReqQuery = useMemoFirebase(() => {
        if (!user?.uid || !firestore) return null;
        return query(collection(firestore, 'bookings'), where('carrierId', '==', user.uid));
    }, [user?.uid, firestore]);

    const directReqQuery = useMemoFirebase(() => {
        if (!user?.uid || !firestore) return null;
        return query(
            collection(firestore, 'trips'),
            where('targetCarrierId', '==', user.uid),
            where('requestType', '==', 'Direct'),
            where('status', '==', 'Awaiting-Offers')
        );
    }, [user?.uid, firestore]);

    const transferReqQuery = useMemoFirebase(() => {
        if (!user?.uid || !firestore) return null;
        return query(
            collection(firestore, 'transferRequests'),
            where('toCarrierId', '==', user.uid),
            where('status', '==', 'pending')
        );
    }, [user?.uid, firestore]);

    const { data: bookings, isLoading: loadBookings } = useCollection<Booking>(bookingReqQuery);
    const { data: directTrips, isLoading: loadDirect } = useCollection<Trip>(directReqQuery);
    const { data: transfers, isLoading: loadTransfers } = useCollection<TransferRequest>(transferReqQuery);

    const isLoading = loadBookings || loadDirect || loadTransfers;

    const pendingConfirmation = useMemo(
        () => (bookings || []).filter((b) => b.status === 'Pending-Carrier-Confirmation'),
        [bookings]
    );
    const pendingPayment = useMemo(
        () => (bookings || []).filter((b) => b.status === 'Pending-Payment'),
        [bookings]
    );
    const pendingVerification = useMemo(
        () => (bookings || []).filter((b) => b.status === 'Pending-Payment-Verification'),
        [bookings]
    );
    const confirmedBookings = useMemo(
        () => (bookings || []).filter((b) => b.status === 'Confirmed'),
        [bookings]
    );

    const hasItems = useMemo(
        () =>
            (pendingConfirmation.length +
                pendingPayment.length +
                pendingVerification.length +
                confirmedBookings.length +
                (directTrips?.length || 0) +
                (transfers?.length || 0)) > 0,
        [pendingConfirmation, pendingPayment, pendingVerification, confirmedBookings, directTrips, transfers]
    );

    const handleAcceptTransfer = useCallback(
        async (request: TransferRequest) => {
            if (!functions) return;
            setIsProcessingTransfer(request.id);
            try {
                const acceptFn = httpsCallable(functions, 'acceptTransferSovereign');
                await acceptFn({ transferRequestId: request.id });
                toast({ title: tCommon('success') });
            } catch (error: any) {
                toast({ variant: 'destructive', title: tCommon('error'), description: tError(error.message || 'DEFAULT') });
            } finally {
                setIsProcessingTransfer(null);
            }
        },
        [functions, tCommon, tError, toast]
    );

    const handleRejectBooking = useCallback(
        async (bookingId: string) => {
            if (!firestore) return;
            const booking = bookings?.find((b) => b.id === bookingId);
            if (!booking) return;
            try {
                await updateDoc(doc(firestore, 'bookings', bookingId), {
                    status: 'Cancelled',
                    cancelReason: 'رُفض من الناقل',
                    cancelledBy: 'carrier',
                    cancelledAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                });
                if (booking.bookedByAgent && booking.agentId) {
                    await addDoc(collection(doc(firestore, 'users', booking.agentId), 'notifications'), {
                        userId: booking.agentId,
                        title: 'رفض الناقل الحجز ❌',
                        message: `تم رفض حجز ${booking.seats} مقعد من قِبل الناقل`,
                        type: 'carrier_rejected_booking',
                        bookingId: booking.id,
                        tripId: booking.tripId,
                        isRead: false,
                        link: `/${locale}/agent`,
                        createdAt: serverTimestamp(),
                    });
                }
                if (!booking.bookedByAgent && booking.userId) {
                    await addDoc(collection(doc(firestore, 'users', booking.userId), 'notifications'), {
                        userId: booking.userId,
                        title: 'رفض الناقل الحجز ❌',
                        message: `تم رفض حجز ${booking.seats} مقعد`,
                        type: 'carrier_rejected_booking',
                        bookingId: booking.id,
                        tripId: booking.tripId,
                        isRead: false,
                        link: `/${locale}/history`,
                        createdAt: serverTimestamp(),
                    });
                }

                await sendPush({
                    userId: booking.agentId || booking.userId,
                    title: 'رفض الناقل الحجز ❌',
                    body: 'للأسف، الناقل رفض طلب الحجز.',
                    data: { type: 'carrier_rejected_booking', bookingId: booking.id },
                });
                toast({ title: 'تم رفض الحجز' });
            } catch (error: any) {
                toast({ variant: 'destructive', title: 'فشل رفض الحجز', description: error?.message });
            }
        },
        [firestore, bookings, locale, toast]
    );

    return (
        <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
            {/* Loading */}
            {isLoading && <LoadingSkeleton />}

            {/* Empty state */}
            {!isLoading && !hasItems && <EmptyState t={t} />}

            {!isLoading && hasItems && (
                <>
                    {/* Emergency Transfers */}
                    {transfers && transfers.length > 0 && (
                        <section>
                            <SectionHeader icon={ArrowRightLeft} label={t('emergencyTransfers')} count={transfers.length} color="red" />
                            <div className="space-y-3">
                                {transfers.map((req) => (
                                    <TransferRequestCard
                                        key={req.id}
                                        request={req}
                                        onAccept={handleAcceptTransfer}
                                        onReject={async () => { }}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Direct Requests */}
                    {directTrips && directTrips.length > 0 && (
                        <section>
                            <SectionHeader icon={Zap} label={t('directRequests')} count={directTrips.length} color="blue" />
                            <div className="space-y-3">
                                {directTrips.map((trip) => (
                                    <DirectRequestCard key={trip.id} trip={trip} onOpenOffer={() => openOfferDialog(trip)} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Pending Carrier Confirmation */}
                    {pendingConfirmation.length > 0 && (
                        <section>
                            <SectionHeader icon={Inbox} label={t('pendingBookings')} count={pendingConfirmation.length} color="default" />
                            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                {pendingConfirmation.map((booking) => (
                                    <BookingActionCard key={booking.id} booking={booking} onReject={handleRejectBooking} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Pending Payment */}
                    {pendingPayment.length > 0 && (
                        <section>
                            <SectionHeader icon={Clock} label="بانتظار دفع المسافر" count={pendingPayment.length} color="orange" />
                            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                {pendingPayment.map((booking) => (
                                    <BookingActionCard key={booking.id} booking={booking} onReject={handleRejectBooking} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Pending Payment Verification */}
                    {pendingVerification.length > 0 && (
                        <section>
                            <SectionHeader icon={CreditCard} label="المسافر دفع — تحقق من الدفع" count={pendingVerification.length} color="yellow" />
                            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                {pendingVerification.map((booking) => (
                                    <BookingActionCard key={booking.id} booking={booking} onReject={handleRejectBooking} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Confirmed Bookings */}
                    {confirmedBookings.length > 0 && (
                        <section>
                            <SectionHeader icon={CheckCircle2} label="حجوزات مؤكدة" count={confirmedBookings.length} color="green" />
                            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                {confirmedBookings.map((booking) => (
                                    <BookingActionCard key={booking.id} booking={booking} onReject={handleRejectBooking} />
                                ))}
                            </div>
                        </section>
                    )}
                </>
            )}

            {selectedTrip && (
                <OfferDialog
                    isOpen={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    trip={selectedTrip}
                    onSendOffer={(offerData) => handleSendOffer(offerData, selectedTrip.id)}
                />
            )}
        </div>
    );
}