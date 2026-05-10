// 'use client';

// import { useState, useCallback, useMemo } from 'react';
// import { useRouter, usePathname } from '@/i18n/routing';
// import { useSearchParams } from 'next/navigation';
// import { AppLayout } from '@/components/app-layout';
// import { Button } from '@/components/ui/button';
// import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase';
// import { Skeleton } from '@/components/ui/skeleton';
// import { collection, query, where, doc } from 'firebase/firestore';
// import type { Trip, Offer, Booking, UserProfile } from '@/lib/data';
// import { PackageOpen, ArrowRight, ShieldCheck, Radar } from 'lucide-react';
// import { OfferDecisionRoom } from '@/components/offer-decision-room';
// import { RateTripDialog } from '@/components/trip-closure/rate-trip-dialog';
// import { CancellationDialog } from '@/components/booking/cancellation-dialog';
// import { ChatDialog } from '@/components/chat/chat-dialog';
// import { BookingPaymentDialog } from '@/components/booking/booking-payment-dialog';
// import { PendingPaymentCard, PendingConfirmationCard, AwaitingOffersCard } from '@/components/history/status-cards';
// import { HeroTicket } from '@/components/history/hero-ticket';
// import { useUserProfile } from '@/hooks/use-user-profile';
// import { LocalErrorBoundary } from '@/components/ui/local-error-boundary';
// import { EmailConfirmDialog } from '@/components/booking/email-confirm-dialog';
// import { useHistoryOps } from '@/hooks/use-history-ops';
// import { useTranslations, useLocale } from 'next-intl';
// import { addDoc, serverTimestamp } from 'firebase/firestore';
// import { EMAILJS_CONFIG } from '@/lib/emailjs';
// import { toast } from '@/hooks/use-toast';

// /**
//  * @page HistoryPage
//  * @description THE REINFORCED TRAVELER HUB (V15.0 - PROTOCOL 16)
//  * [SCR-955]: Diamond Sterilization. Cleaned redundant wrappers and enforced loose coupling.
//  */

// const AwaitingOffersWrapper = ({ trip, onClick, onWithdraw }: { trip: Trip, onClick: () => void, onWithdraw: () => void }) => {
//     const firestore = useFirestore();
//     const offersQuery = useMemoFirebase(() => {
//         if (!firestore || !trip?.id) return null;
//         return query(collection(firestore, 'offers'), where('passengerIntentId', '==', trip.id));
//     }, [firestore, trip?.id]);

//     const { data: offers } = useCollection<Offer>(offersQuery);

//     return (
//         <AwaitingOffersCard
//             trip={trip}
//             offerCount={offers?.length || 0}
//             offers={offers || []}
//             onClick={onClick}
//             onWithdraw={onWithdraw}
//         />
//     );
// };

// const ConfirmedTripWrapper = ({ booking, onRate, onCancel, onPrivateChat, onGroupChat }: any) => {
//     const firestore = useFirestore();
//     const tripRef = useMemoFirebase(() => firestore ? doc(firestore, 'trips', booking.tripId) : null, [firestore, booking.tripId]);
//     const carrierRef = useMemoFirebase(() => firestore ? doc(firestore, 'users', booking.carrierId) : null, [firestore, booking.carrierId]);

//     const { data: trip } = useDoc<Trip>(tripRef);
//     const { data: carrierProfile } = useDoc<UserProfile>(carrierRef);

//     if (!trip) return <Skeleton className="h-48 w-full rounded-[2.5rem] mb-4 shadow-sm" />;

//     return (
//         <HeroTicket
//             trip={trip}
//             booking={booking}
//             carrierProfile={carrierProfile}
//             onRateTrip={onRate}
//             onCancelBooking={onCancel}
//             onMessageCarrier={onPrivateChat}
//             onMessageGroup={onGroupChat}
//         />
//     );
// };

// export default function HistoryPage() {
//     const { user } = useUser();
//     const { profile, isEngaged, engagementType, activeEngagement, isLoading: isProfileLoading } = useUserProfile();
//     const firestore = useFirestore();
//     const router = useRouter();
//     const pathname = usePathname();
//     const searchParams = useSearchParams();
//     const t = useTranslations('history');
//     const tr = useTranslations('chat');

//     const {
//         isProcessingOffer, isConfirmingPayment, isCancelling,
//         handleAcceptOffer, handleConfirmPayment, handleConfirmCancellation, handleWithdrawRequest
//     } = useHistoryOps(user);

//     const showDecisionRoom = useMemo(() => searchParams.get('view') === 'decision', [searchParams]);

//     const setView = useCallback((view: 'list' | 'decision') => {
//         const params = new URLSearchParams(searchParams.toString());
//         if (view === 'decision') params.set('view', 'decision');
//         else params.delete('view');
//         router.replace(`${pathname}?${params.toString()}`);
//     }, [searchParams, pathname, router]);

//     const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false);
//     const [selectedTripForClosure, setSelectedTripForClosure] = useState<Trip | null>(null);
//     const [isCancellationDialogOpen, setIsCancellationDialogOpen] = useState(false);
//     const [itemToCancel, setItemToCancel] = useState<{ trip: Trip, booking: Booking } | null>(null);
//     const [isChatOpen, setIsChatOpen] = useState(false);
//     const [selectedChatInfo, setSelectedChatInfo] = useState<{ id: string; title: string; otherPartyId?: string; chatType: "private" | "group" } | null>(null);
//     const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
//     const [selectedBookingForPayment, setSelectedBookingForPayment] = useState<Booking | null>(null);
//     const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
//     const [pendingOfferAccept, setPendingOfferAccept] = useState<{ trip: Trip, offer: Offer } | null>(null);
//     const [isSendingEmail, setIsSendingEmail] = useState(false);
//     const locale = useLocale();

//     const activeBooking = useMemo(() => engagementType === 'BOOKING' ? activeEngagement?.data as Booking : null, [engagementType, activeEngagement]);
//     const activeIntent = useMemo(() => (engagementType === 'INTENT' && activeEngagement) ? { ...activeEngagement.data, id: activeEngagement.id } as Trip : null, [engagementType, activeEngagement]);

//     const offersQuery = useMemoFirebase(() => {
//         if (!firestore || !activeIntent?.id) return null;
//         return query(collection(firestore, 'offers'), where('passengerIntentId', '==', activeIntent.id));
//     }, [firestore, activeIntent?.id]);

//     const { data: offers } = useCollection<Offer>(offersQuery);

//     const onAcceptOfferCb = useCallback((t: Trip, o: Offer) => {
//         setPendingOfferAccept({ trip: t, offer: o });
//         setIsEmailDialogOpen(true);
//     }, []);

//     const handleEmailConfirm = useCallback(async (email: string) => {
//         if (!pendingOfferAccept || !firestore) return;
//         // ⚠️ لا تغلق الـ dialog هنا — الـ Firestore listener هيغيّر engagementType فوراً
//         // وهيحوّل الـ UI قبل ما نكمّل إرسال الإيميل والـ token
//         setIsSendingEmail(true);

//         const { trip, offer } = pendingOfferAccept;
//         const origin = typeof window !== 'undefined' ? window.location.origin : '';
//         let tokenDocId: string | null = null;

//         try {
//             // 1. أنشئ الـ booking
//             let newBookingId = '';
//             await handleAcceptOffer(trip, offer, (bookingId: string) => { newBookingId = bookingId; });

//             // 2. أنشئ booking token
//             const tokenDoc = await addDoc(collection(firestore, 'booking_tokens'), {
//                 email,
//                 tripId: trip.id,
//                 carrierId: offer.carrierId,
//                 carrierTripId: offer.carrierTripId || null,
//                 price: offer.price,
//                 currency: offer.currency,
//                 seatCount: trip.passengers || 1,
//                 bookingId: newBookingId || null,
//                 status: 'pending',
//                 createdAt: serverTimestamp(),
//                 expiresAt: new Date(Date.now() + 30 * 60 * 1000),
//             });
//             tokenDocId = tokenDoc.id;

//             // 3. ابعت إيميل التأكيد
//             const confirmUrl = `${origin}/${locale}/confirm-booking?token=${tokenDocId}`;
//             const emailRes = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     service_id: EMAILJS_CONFIG.serviceId,
//                     template_id: EMAILJS_CONFIG.templateId,
//                     user_id: EMAILJS_CONFIG.userId,
//                     template_params: {
//                         to_email: email,
//                         trip_origin: trip.origin || '--',
//                         trip_destination: trip.destination || '--',
//                         carrier_name: (trip as any).carrierName || offer.carrierName || '--',
//                         departure_time: (trip as any).departureDate || '--',
//                         meeting_point: (trip as any).meetingPoint || '--',
//                         confirm_url: confirmUrl,
//                     },
//                 }),
//             });

//             if (!emailRes.ok) throw new Error(`EmailJS error: ${emailRes.status}`);

//             setIsEmailDialogOpen(false);
//             toast({ title: 'تم إرسال إيميل التأكيد!', description: `راجع بريدك ${email} وأكمل الحجز من الرابط.`, duration: 8000 });
//             setView('list');

//         } catch (error: any) {
//             console.error('[handleEmailConfirm] Error:', error);
//             if (tokenDocId) {
//                 const confirmUrl = `${origin}/${locale}/confirm-booking?token=${tokenDocId}`;
//                 toast({
//                     title: 'فشل إرسال الإيميل',
//                     description: 'يمكنك إكمال الحجز مباشرة من هذا الرابط',
//                     duration: 15000,
//                     action: (
//                         <Button size="sm" onClick={() => window.open(confirmUrl, '_blank')}>
//                             إكمال الحجز
//                         </Button>
//                     ),
//                 });
//                 setIsEmailDialogOpen(false);
//                 setView('list');
//             } else {
//                 toast({ variant: 'destructive', title: 'فشل قبول العرض', description: 'حدث خطأ، حاول مجدداً.' });
//             }
//         } finally {
//             setIsSendingEmail(false);
//             setPendingOfferAccept(null);
//         }
//     }, [pendingOfferAccept, firestore, handleAcceptOffer, setView, locale, toast]);

//     const onWithdrawCb = useCallback(() => activeIntent && handleWithdrawRequest(activeIntent.id), [activeIntent, handleWithdrawRequest]);
//     const onConfirmPaymentCb = useCallback(() => {
//         if (!selectedBookingForPayment) return;
//         handleConfirmPayment(selectedBookingForPayment, () => {
//             // ✅ بعد الدفع — افضل في الـ history وشوف شاشة انتظار التأكيد
//             setIsPaymentDialogOpen(false);
//             setSelectedBookingForPayment(null);
//         });
//     }, [selectedBookingForPayment, handleConfirmPayment]);
//     const onConfirmCancelCb = useCallback((reason: string) => itemToCancel && handleConfirmCancellation(itemToCancel.booking, reason, () => { setIsCancellationDialogOpen(false); setItemToCancel(null); }), [itemToCancel, handleConfirmCancellation]);

//     if (isProfileLoading) return <div className="flex h-[60vh] items-center justify-center font-black animate-pulse opacity-40">جاري مزامنة القلعة...</div>;

//     return (
//         <AppLayout profile={profile} user={user} isEngaged={isEngaged} engagementType={engagementType}>
//             <div className="w-full p-4 space-y-6 pb-24 pt-16" dir="rtl">
//                 <Card className="bg-card/50 border-primary/20 shadow-xl overflow-hidden relative rounded-[2.5rem]">
//                     <div className="absolute top-0 right-0 w-1.5 h-full bg-primary" />
//                     <CardHeader className="bg-muted/30">
//                         <div className="flex justify-between items-center">
//                             <div>
//                                 <CardTitle className="font-black text-xl flex items-center gap-2"><ShieldCheck className="h-6 w-6 text-primary" /> {showDecisionRoom ? 'غرفة اتخاذ القرار' : 'غرفة العمليات'}</CardTitle>
//                                 <CardDescription className="text-[10px] font-bold uppercase tracking-widest">{showDecisionRoom ? 'Sovereign Decision Room v1.5' : 'Operations Control'}</CardDescription>
//                             </div>
//                             {!isEngaged && !showDecisionRoom && <Button variant="outline" size="sm" onClick={() => router.push('/dashboard')} className="font-black gap-2 rounded-xl"><ArrowRight className="h-4 w-4" /> العودة للساحة</Button>}
//                             {showDecisionRoom && <Button variant="ghost" size="sm" onClick={() => setView('list')} className="gap-2 font-black"><ArrowRight className="h-4 w-4" /> {t('back')}</Button>}
//                         </div>
//                     </CardHeader>
//                 </Card>

//                 <LocalErrorBoundary fallbackTitle="تعثرت وحدة العمليات">
//                     {engagementType === 'INTENT' && activeIntent && (
//                         showDecisionRoom ?
//                             <OfferDecisionRoom trip={activeIntent} offers={offers || []} onAcceptOffer={onAcceptOfferCb} isProcessing={isProcessingOffer} onBack={() => setView('list')} /> :
//                             <AwaitingOffersWrapper trip={activeIntent} onClick={() => setView('decision')} onWithdraw={onWithdrawCb} />
//                     )}

//                     {engagementType === 'BOOKING' && activeBooking && (
//                         <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
//                             {activeBooking.status === 'Pending-Payment' && <PendingPaymentCard booking={activeBooking} onClick={() => { setSelectedBookingForPayment(activeBooking); setIsPaymentDialogOpen(true); }} />}
//                             {activeBooking.status === 'Pending-Carrier-Confirmation' && <PendingConfirmationCard booking={activeBooking} />}
//                             {activeBooking.status === 'Pending-Payment-Verification' && (
//                                 <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-4">
//                                     {/* شاشة انتظار تأكيد استلام العربون */}
//                                     <div className="relative overflow-hidden rounded-[2.5rem] border-2 border-blue-500/30 from-blue-500/10 to-blue-500/0 p-8 text-center space-y-5">
//                                         {/* نبضة انيميشن */}
//                                         <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
//                                             <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
//                                             <div className="absolute inset-2 rounded-full bg-blue-500/15 animate-pulse" />
//                                             <div className="relative h-14 w-14 rounded-full bg-blue-500/20 border-2 border-blue-500/40 flex items-center justify-center">
//                                                 <span className="text-2xl">💳</span>
//                                             </div>
//                                         </div>

//                                         <div className="space-y-2">
//                                             <h2 className="text-xl font-black tracking-tight text-blue-400">
//                                                 بانتظار تأكيد استلام العربون
//                                             </h2>
//                                             <p className="text-sm text-muted-foreground font-bold leading-relaxed max-w-sm mx-auto">
//                                                 تم إرسال إشعار الدفع للناقل. سيظهر لك سند الرحلة فور تأكيده باستلام العربون.
//                                             </p>
//                                         </div>

//                                         {/* رقم السند */}
//                                         {activeBooking.depositVoucherId && (
//                                             <div className="inline-flex flex-col items-center gap-1 bg-blue-500/10 border border-blue-500/20 rounded-2xl px-6 py-3">
//                                                 <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">رقم سند الدفع</p>
//                                                 <p className="font-mono font-black text-blue-300 text-xl tracking-widest">
//                                                     {activeBooking.depositVoucherId}
//                                                 </p>
//                                             </div>
//                                         )}

//                                         <p className="text-[11px] text-muted-foreground/60 font-bold">
//                                             ستتلقى إشعاراً فور تأكيد الناقل
//                                         </p>
//                                     </div>
//                                 </div>
//                             )}
//                             {(['Confirmed', 'Rated', 'Completed'].includes(activeBooking.status)) && (
//                                 <ConfirmedTripWrapper
//                                     booking={activeBooking}
//                                     onRate={(t: any) => { setSelectedTripForClosure(t); setIsRatingDialogOpen(true); }}
//                                     onCancel={(t: any, b: any) => { setItemToCancel({ trip: t, booking: b }); setIsCancellationDialogOpen(true); }}
//                                     onPrivateChat={() => { setSelectedChatInfo({ id: activeBooking.id, title: tr('messWithCarrier'), otherPartyId: activeBooking.carrierId, chatType: "private" }); setIsChatOpen(true); }}
//                                     onGroupChat={() => { setSelectedChatInfo({ id: activeBooking.tripId, title: tr('messGroupTrip'), chatType: "group" }); setIsChatOpen(true); }}
//                                 />
//                             )}
//                         </div>
//                     )}

//                     {!isEngaged && (
//                         <div className="text-center py-24 text-muted-foreground border-2 border-dashed border-primary/10 rounded-[3rem] bg-card/20 animate-in zoom-in-95 duration-500">
//                             <PackageOpen className="mx-auto h-16 w-16 opacity-10 mb-4" />
//                             <p className="font-black text-xl text-foreground/60">{t('empty.noBookings')}</p>
//                             <Button onClick={() => router.push('/dashboard')} className="mt-8 font-black h-14 px-10 rounded-2xl shadow-lg">ابدأ رحلة جديدة الآن</Button>
//                         </div>
//                     )}
//                 </LocalErrorBoundary>
//             </div>

//             {/* MODALS: Pure Logic separation */}
//             <RateTripDialog isOpen={isRatingDialogOpen} onOpenChange={setIsRatingDialogOpen} trip={selectedTripForClosure} onConfirm={() => { }} />
//             <CancellationDialog isOpen={isCancellationDialogOpen} onOpenChange={setIsCancellationDialogOpen} isCancelling={isCancelling} onConfirm={onConfirmCancelCb} trip={itemToCancel?.trip} />
//             {selectedChatInfo && <ChatDialog isOpen={isChatOpen} onOpenChange={setIsChatOpen} bookingId={selectedChatInfo.id} otherPartyName={selectedChatInfo.title} otherPartyId={selectedChatInfo.otherPartyId} chatType={selectedChatInfo.chatType} />}
//             {selectedBookingForPayment && <BookingPaymentDialog isOpen={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen} trip={{} as Trip} booking={selectedBookingForPayment} onConfirm={onConfirmPaymentCb} isProcessing={isConfirmingPayment} />}

//             {pendingOfferAccept && (
//                 <EmailConfirmDialog
//                     isOpen={isEmailDialogOpen}
//                     onClose={() => setIsEmailDialogOpen(false)}
//                     onConfirm={handleEmailConfirm}
//                     trip={pendingOfferAccept.trip}
//                 />
//             )}
//         </AppLayout>
//     );
// }
'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter, usePathname } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { collection, query, where, doc } from 'firebase/firestore';
import type { Trip, Offer, Booking, UserProfile } from '@/lib/data';
import { PackageOpen, ArrowRight, ShieldCheck, Radar } from 'lucide-react';
import { OfferDecisionRoom } from '@/components/offer-decision-room';
import { RateTripDialog } from '@/components/trip-closure/rate-trip-dialog';
import { CancellationDialog } from '@/components/booking/cancellation-dialog';
import { ChatDialog } from '@/components/chat/chat-dialog';
import { BookingPaymentDialog } from '@/components/booking/booking-payment-dialog';
import { PendingPaymentCard, PendingConfirmationCard, AwaitingOffersCard } from '@/components/history/status-cards';
import { HeroTicket } from '@/components/history/hero-ticket';
import { useUserProfile } from '@/hooks/use-user-profile';
import { LocalErrorBoundary } from '@/components/ui/local-error-boundary';
import { EmailConfirmDialog } from '@/components/booking/email-confirm-dialog';
import { useHistoryOps } from '@/hooks/use-history-ops';
import { useTranslations, useLocale } from 'next-intl';
import { addDoc, serverTimestamp } from 'firebase/firestore';
import { EMAILJS_CONFIG } from '@/lib/emailjs';
import { toast } from '@/hooks/use-toast';

/**
 * @page HistoryPage
 * @description THE REINFORCED TRAVELER HUB (V15.0 - PROTOCOL 16)
 * [SCR-955]: Diamond Sterilization. Cleaned redundant wrappers and enforced loose coupling.
 */

const AwaitingOffersWrapper = ({ trip, onClick, onWithdraw }: { trip: Trip, onClick: () => void, onWithdraw: () => void }) => {
    const firestore = useFirestore();
    const offersQuery = useMemoFirebase(() => {
        if (!firestore || !trip?.id) return null;
        return query(collection(firestore, 'offers'), where('passengerIntentId', '==', trip.id));
    }, [firestore, trip?.id]);

    const { data: offers } = useCollection<Offer>(offersQuery);

    return (
        <AwaitingOffersCard
            trip={trip}
            offerCount={offers?.length || 0}
            offers={offers || []}
            onClick={onClick}
            onWithdraw={onWithdraw}
        />
    );
};

const ConfirmedTripWrapper = ({ booking, onRate, onCancel, onPrivateChat, onGroupChat }: any) => {
    const firestore = useFirestore();
    const tripRef = useMemoFirebase(() => firestore ? doc(firestore, 'trips', booking.tripId) : null, [firestore, booking.tripId]);
    const carrierRef = useMemoFirebase(() => firestore ? doc(firestore, 'users', booking.carrierId) : null, [firestore, booking.carrierId]);

    const { data: trip } = useDoc<Trip>(tripRef);
    const { data: carrierProfile } = useDoc<UserProfile>(carrierRef);

    if (!trip) return <Skeleton className="h-48 w-full rounded-[2.5rem] mb-4 shadow-sm" />;

    return (
        <HeroTicket
            trip={trip}
            booking={booking}
            carrierProfile={carrierProfile}
            onRateTrip={onRate}
            onCancelBooking={onCancel}
            onMessageCarrier={onPrivateChat}
            onMessageGroup={onGroupChat}
        />
    );
};

export default function HistoryPage() {
    const { user } = useUser();
    const { profile, isEngaged, engagementType, activeEngagement, isLoading: isProfileLoading } = useUserProfile();
    const firestore = useFirestore();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const t = useTranslations('history');
    const tr = useTranslations('chat');

    const {
        isProcessingOffer, isConfirmingPayment, isCancelling,
        handleAcceptOffer, handleConfirmPayment, handleConfirmCancellation, handleWithdrawRequest
    } = useHistoryOps(user);

    const showDecisionRoom = useMemo(() => searchParams.get('view') === 'decision', [searchParams]);

    const setView = useCallback((view: 'list' | 'decision') => {
        const params = new URLSearchParams(searchParams.toString());
        if (view === 'decision') params.set('view', 'decision');
        else params.delete('view');
        router.replace(`${pathname}?${params.toString()}`);
    }, [searchParams, pathname, router]);

    const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false);
    const [selectedTripForClosure, setSelectedTripForClosure] = useState<Trip | null>(null);
    const [isCancellationDialogOpen, setIsCancellationDialogOpen] = useState(false);
    const [itemToCancel, setItemToCancel] = useState<{ trip: Trip, booking: Booking } | null>(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [selectedChatInfo, setSelectedChatInfo] = useState<{ id: string; title: string; otherPartyId?: string; chatType: "private" | "group" } | null>(null);
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
    const [selectedBookingForPayment, setSelectedBookingForPayment] = useState<Booking | null>(null);
    const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
    const [pendingOfferAccept, setPendingOfferAccept] = useState<{ trip: Trip, offer: Offer } | null>(null);
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const locale = useLocale();

    const activeBooking = useMemo(() => engagementType === 'BOOKING' ? activeEngagement?.data as Booking : null, [engagementType, activeEngagement]);
    const activeIntent = useMemo(() => (engagementType === 'INTENT' && activeEngagement) ? { ...activeEngagement.data, id: activeEngagement.id } as Trip : null, [engagementType, activeEngagement]);

    const offersQuery = useMemoFirebase(() => {
        if (!firestore || !activeIntent?.id) return null;
        return query(collection(firestore, 'offers'), where('passengerIntentId', '==', activeIntent.id));
    }, [firestore, activeIntent?.id]);

    const { data: offers } = useCollection<Offer>(offersQuery);

    const onAcceptOfferCb = useCallback((t: Trip, o: Offer) => {
        setPendingOfferAccept({ trip: t, offer: o });
        setIsEmailDialogOpen(true);
    }, []);

    const handleEmailConfirm = useCallback(async (email: string) => {
        if (!pendingOfferAccept || !firestore) return;
        // ⚠️ لا تغلق الـ dialog هنا — الـ Firestore listener هيغيّر engagementType فوراً
        // وهيحوّل الـ UI قبل ما نكمّل إرسال الإيميل والـ token
        setIsSendingEmail(true);

        const { trip, offer } = pendingOfferAccept;
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        let tokenDocId: string | null = null;

        try {
            // 1. أنشئ الـ booking
            let newBookingId = '';
            await handleAcceptOffer(trip, offer, (bookingId: string) => { newBookingId = bookingId; });

            // 2. أنشئ booking token
            const tokenDoc = await addDoc(collection(firestore, 'booking_tokens'), {
                email,
                tripId: trip.id,
                carrierId: offer.carrierId,
                carrierTripId: offer.carrierTripId || null,
                price: offer.price,
                currency: offer.currency,
                seatCount: trip.passengers || 1,
                bookingId: newBookingId || null,
                status: 'pending',
                createdAt: serverTimestamp(),
                expiresAt: new Date(Date.now() + 30 * 60 * 1000),
            });
            tokenDocId = tokenDoc.id;

            // 3. ابعت إيميل التأكيد
            const confirmUrl = `${origin}/${locale}/confirm-booking?token=${tokenDocId}`;
            const emailRes = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    service_id: EMAILJS_CONFIG.serviceId,
                    template_id: EMAILJS_CONFIG.templateId,
                    user_id: EMAILJS_CONFIG.userId,
                    template_params: {
                        to_email: email,
                        trip_origin: trip.origin || '--',
                        trip_destination: trip.destination || '--',
                        carrier_name: (trip as any).carrierName || offer.carrierName || '--',
                        departure_time: (() => {
                            const raw = (trip as any).departureDate;
                            if (!raw) return '--';
                            try {
                                const d = typeof raw?.toDate === 'function' ? raw.toDate() : new Date(raw);
                                return isNaN(d.getTime()) ? '--' : d.toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' });
                            } catch { return '--'; }
                        })(),
                        meeting_point: (trip as any).meetingPoint || '--',
                        ticket_price: `${offer.price ?? '--'} ${offer.currency || ''}`.trim(),
                        deposit_amount: offer.price && offer.depositPercentage
                            ? `${((offer.price) * (offer.depositPercentage / 100)).toFixed(2)} ${offer.currency || ''}`
                            : '--',
                        total_due: `${offer.price ?? '--'} ${offer.currency || ''}`.trim(),
                        estimated_duration: (trip as any).estimatedDurationHours ? `${(trip as any).estimatedDurationHours} ساعة` : '--',
                        number_of_stops: (trip as any).numberOfStops ?? '--',
                        bags_per_seat: (trip as any).bagsPerSeat ?? '--',
                        passengers: (trip as any).passengers ?? 1,
                        confirm_url: confirmUrl,
                    },
                }),
            });

            if (!emailRes.ok) throw new Error(`EmailJS error: ${emailRes.status}`);

            setIsEmailDialogOpen(false);
            toast({ title: 'تم إرسال إيميل التأكيد!', description: `راجع بريدك ${email} وأكمل الحجز من الرابط.`, duration: 8000 });
            setView('list');

        } catch (error: any) {
            console.error('[handleEmailConfirm] Error:', error);
            if (tokenDocId) {
                const confirmUrl = `${origin}/${locale}/confirm-booking?token=${tokenDocId}`;
                toast({
                    title: 'فشل إرسال الإيميل',
                    description: 'يمكنك إكمال الحجز مباشرة من هذا الرابط',
                    duration: 15000,
                    action: (
                        <Button size="sm" onClick={() => window.open(confirmUrl, '_blank')}>
                            إكمال الحجز
                        </Button>
                    ),
                });
                setIsEmailDialogOpen(false);
                setView('list');
            } else {
                toast({ variant: 'destructive', title: 'فشل قبول العرض', description: 'حدث خطأ، حاول مجدداً.' });
            }
        } finally {
            setIsSendingEmail(false);
            setPendingOfferAccept(null);
        }
    }, [pendingOfferAccept, firestore, handleAcceptOffer, setView, locale, toast]);

    const onWithdrawCb = useCallback(() => activeIntent && handleWithdrawRequest(activeIntent.id), [activeIntent, handleWithdrawRequest]);
    const onConfirmPaymentCb = useCallback(() => {
        if (!selectedBookingForPayment) return;
        handleConfirmPayment(selectedBookingForPayment, () => {
            // ✅ بعد الدفع — افضل في الـ history وشوف شاشة انتظار التأكيد
            setIsPaymentDialogOpen(false);
            setSelectedBookingForPayment(null);
        });
    }, [selectedBookingForPayment, handleConfirmPayment]);
    const onConfirmCancelCb = useCallback((reason: string) => itemToCancel && handleConfirmCancellation(itemToCancel.booking, reason, () => { setIsCancellationDialogOpen(false); setItemToCancel(null); }), [itemToCancel, handleConfirmCancellation]);

    if (isProfileLoading) return <div className="flex h-[60vh] items-center justify-center font-black animate-pulse opacity-40">جاري مزامنة القلعة...</div>;

    return (
        <AppLayout profile={profile} user={user} isEngaged={isEngaged} engagementType={engagementType}>
            <div className="w-full p-4 space-y-6 pb-24 pt-16" dir="rtl">
                <Card className="bg-card/50 border-primary/20 shadow-xl overflow-hidden relative rounded-[2.5rem]">
                    <div className="absolute top-0 right-0 w-1.5 h-full bg-primary" />
                    <CardHeader className="bg-muted/30">
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="font-black text-xl flex items-center gap-2"><ShieldCheck className="h-6 w-6 text-primary" /> {showDecisionRoom ? 'غرفة اتخاذ القرار' : 'غرفة العمليات'}</CardTitle>
                                <CardDescription className="text-[10px] font-bold uppercase tracking-widest">{showDecisionRoom ? 'Sovereign Decision Room v1.5' : 'Operations Control'}</CardDescription>
                            </div>
                            {!isEngaged && !showDecisionRoom && <Button variant="outline" size="sm" onClick={() => router.push('/dashboard')} className="font-black gap-2 rounded-xl"><ArrowRight className="h-4 w-4" /> العودة للساحة</Button>}
                            {showDecisionRoom && <Button variant="ghost" size="sm" onClick={() => setView('list')} className="gap-2 font-black"><ArrowRight className="h-4 w-4" /> {t('back')}</Button>}
                        </div>
                    </CardHeader>
                </Card>

                <LocalErrorBoundary fallbackTitle="تعثرت وحدة العمليات">
                    {engagementType === 'INTENT' && activeIntent && (
                        showDecisionRoom ?
                            <OfferDecisionRoom trip={activeIntent} offers={offers || []} onAcceptOffer={onAcceptOfferCb} isProcessing={isProcessingOffer} onBack={() => setView('list')} /> :
                            <AwaitingOffersWrapper trip={activeIntent} onClick={() => setView('decision')} onWithdraw={onWithdrawCb} />
                    )}

                    {engagementType === 'BOOKING' && activeBooking && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {activeBooking.status === 'Pending-Payment' && <PendingPaymentCard booking={activeBooking} onClick={() => { setSelectedBookingForPayment(activeBooking); setIsPaymentDialogOpen(true); }} />}
                            {activeBooking.status === 'Pending-Carrier-Confirmation' && <PendingConfirmationCard booking={activeBooking} />}
                            {activeBooking.status === 'Pending-Payment-Verification' && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-4">
                                    {/* شاشة انتظار تأكيد استلام العربون */}
                                    <div className="relative overflow-hidden rounded-[2.5rem] border-2 border-blue-500/30 from-blue-500/10 to-blue-500/0 p-8 text-center space-y-5">
                                        {/* نبضة انيميشن */}
                                        <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
                                            <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
                                            <div className="absolute inset-2 rounded-full bg-blue-500/15 animate-pulse" />
                                            <div className="relative h-14 w-14 rounded-full bg-blue-500/20 border-2 border-blue-500/40 flex items-center justify-center">
                                                <span className="text-2xl">💳</span>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <h2 className="text-xl font-black tracking-tight text-blue-400">
                                                بانتظار تأكيد استلام العربون
                                            </h2>
                                            <p className="text-sm text-muted-foreground font-bold leading-relaxed max-w-sm mx-auto">
                                                تم إرسال إشعار الدفع للناقل. سيظهر لك سند الرحلة فور تأكيده باستلام العربون.
                                            </p>
                                        </div>

                                        {/* رقم السند */}
                                        {activeBooking.depositVoucherId && (
                                            <div className="inline-flex flex-col items-center gap-1 bg-blue-500/10 border border-blue-500/20 rounded-2xl px-6 py-3">
                                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">رقم سند الدفع</p>
                                                <p className="font-mono font-black text-blue-300 text-xl tracking-widest">
                                                    {activeBooking.depositVoucherId}
                                                </p>
                                            </div>
                                        )}

                                        <p className="text-[11px] text-muted-foreground/60 font-bold">
                                            ستتلقى إشعاراً فور تأكيد الناقل
                                        </p>
                                    </div>
                                </div>
                            )}
                            {(['Confirmed', 'Rated', 'Completed'].includes(activeBooking.status)) && (
                                <ConfirmedTripWrapper
                                    booking={activeBooking}
                                    onRate={(t: any) => { setSelectedTripForClosure(t); setIsRatingDialogOpen(true); }}
                                    onCancel={(t: any, b: any) => { setItemToCancel({ trip: t, booking: b }); setIsCancellationDialogOpen(true); }}
                                    onPrivateChat={() => { setSelectedChatInfo({ id: activeBooking.id, title: tr('messWithCarrier'), otherPartyId: activeBooking.carrierId, chatType: "private" }); setIsChatOpen(true); }}
                                    onGroupChat={() => { setSelectedChatInfo({ id: activeBooking.tripId, title: tr('messGroupTrip'), chatType: "group" }); setIsChatOpen(true); }}
                                />
                            )}
                        </div>
                    )}

                    {!isEngaged && (
                        <div className="text-center py-24 text-muted-foreground border-2 border-dashed border-primary/10 rounded-[3rem] bg-card/20 animate-in zoom-in-95 duration-500">
                            <PackageOpen className="mx-auto h-16 w-16 opacity-10 mb-4" />
                            <p className="font-black text-xl text-foreground/60">{t('empty.noBookings')}</p>
                            <Button onClick={() => router.push('/dashboard')} className="mt-8 font-black h-14 px-10 rounded-2xl shadow-lg">ابدأ رحلة جديدة الآن</Button>
                        </div>
                    )}
                </LocalErrorBoundary>
            </div>

            {/* MODALS: Pure Logic separation */}
            <RateTripDialog isOpen={isRatingDialogOpen} onOpenChange={setIsRatingDialogOpen} trip={selectedTripForClosure} onConfirm={() => { }} />
            <CancellationDialog isOpen={isCancellationDialogOpen} onOpenChange={setIsCancellationDialogOpen} isCancelling={isCancelling} onConfirm={onConfirmCancelCb} trip={itemToCancel?.trip} />
            {selectedChatInfo && <ChatDialog isOpen={isChatOpen} onOpenChange={setIsChatOpen} bookingId={selectedChatInfo.id} otherPartyName={selectedChatInfo.title} otherPartyId={selectedChatInfo.otherPartyId} chatType={selectedChatInfo.chatType} />}
            {selectedBookingForPayment && <BookingPaymentDialog isOpen={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen} trip={{} as Trip} booking={selectedBookingForPayment} onConfirm={onConfirmPaymentCb} isProcessing={isConfirmingPayment} />}

            {pendingOfferAccept && (
                <EmailConfirmDialog
                    isOpen={isEmailDialogOpen}
                    onClose={() => setIsEmailDialogOpen(false)}
                    onConfirm={handleEmailConfirm}
                    trip={pendingOfferAccept.trip}
                />
            )}
        </AppLayout>
    );
}