// 'use client';

// import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import {
//     UserCheck, MapPin, MessageSquare, ShieldCheck, CheckCircle2,
//     QrCode, Printer, FileText, RefreshCw, Ban, Clock, Loader2, Users, Star
// } from 'lucide-react';
// import type {
//     Trip, Booking, UserProfile,
// } from '@/lib/data';
// import { getCityName } from '@/lib/constants';
// import { formatDate } from '@/lib/formatters';
// import { FinancialLogic } from '@/lib/financial-logic';
// import { useMemo, useState, useEffect } from 'react';
// import { cn } from '@/lib/utils';
// import { QRDialog } from './qr-dialog';
// import { PrintableTicket } from './printable-ticket';
// import { useLocale, useTranslations } from 'next-intl';
// import { useTripActions } from '@/hooks/use-trip-actions';
// import { useLiveTripReactor } from '@/hooks/use-live-trip-reactor';
// import { useAtomicAction } from '@/hooks/use-atomic-action';
// import { ResilienceShield } from '@/components/ticket/resilience-shield';
// import { TicketModificationAlert } from '../traveler/ticket-modification-alert';
// import { BookingTransferPassengerCard } from '@/components/booking/booking-transfer-passenger-card';
// import { useBookingTransferPassenger } from '@/hooks/use-booking-transfer-passenger';
// // import { useBookingTransferPassenger } from '@/hooks/use-booking-transfer-passenger';

// interface HeroTicketProps {
//     trip: Trip;
//     booking: Booking;
//     carrierProfile?: UserProfile | null;
//     onRateTrip: (trip: Trip) => void;
//     onCancelBooking: (trip: Trip, booking: Booking) => void;
//     onMessageCarrier: () => void;
//     onMessageGroup: () => void;
// }

// type TicketState = 'scheduled' | 'active' | 'archived';

// const STATE_STYLES = {
//     scheduled: { card: "border-primary", header: "from-blue-600 to-blue-800", badge: "bg-primary", badgeText: "تذكرة مؤكدة" },
//     active: { card: "border-green-500 ring-1 ring-green-500/50", header: "from-green-600 to-green-800", badge: "bg-green-500 animate-pulse", badgeText: "الرحلة جارية الآن 🚌" },
//     archived: { card: "border-muted-foreground/30 grayscale opacity-90", header: "from-slate-700 to-slate-900", badge: "bg-muted-foreground", badgeText: "مكتملة" }
// };

// export const HeroTicket = ({ trip: initialTrip, booking, carrierProfile, onRateTrip, onCancelBooking, onMessageCarrier, onMessageGroup }: HeroTicketProps) => {
//     const locale = useLocale();
//     const { travelerConfirmArrival } = useTripActions();
//     const [ticketState, setTicketState] = useState<TicketState>('scheduled');
//     const [isQROpen, setIsQROpen] = useState(false);
//     const [isPrintOpen, setIsPrintOpen] = useState(false);
//     const t = useTranslations('heroTicket');
//     const { trip: liveTrip } = useLiveTripReactor(initialTrip?.id);
//     const baseTripData = liveTrip || initialTrip;

//     // جلب رحلة الناقل الفعلية (carrierTripId) لسحب الوقت ونقطة الانطلاق منها
//     const carrierTripId = (booking as any).carrierTripId || (baseTripData as any).carrierTripId;
//     const { trip: liveCarrierTrip } = useLiveTripReactor(carrierTripId || null);

//     // دمج بيانات رحلة الناقل (وقت + نقطة انطلاق) فوق بيانات الرحلة الأصلية
//     const displayTrip = {
//         ...baseTripData,
//         ...(liveCarrierTrip ? {
//             // ✅ [FIX] استخدم id رحلة الناقل عشان رقم الرحلة يكون صح في التذكرة
//             id: liveCarrierTrip.id || baseTripData.id,
//             departureDate: liveCarrierTrip.departureDate || baseTripData.departureDate,
//             departureTime: (liveCarrierTrip as any).departureTime || (baseTripData as any).departureTime,
//             meetingPoint: (liveCarrierTrip as any).meetingPoint || (baseTripData as any).meetingPoint,
//             meetingPointLink: (liveCarrierTrip as any).meetingPointLink || (baseTripData as any).meetingPointLink,
//             depositPercentage: (liveCarrierTrip as any).depositPercentage ?? (baseTripData as any).depositPercentage,
//             price: (liveCarrierTrip as any).price ?? (baseTripData as any).price,
//         } : {}),
//     } as typeof baseTripData;

//     const { state: atomicState, execute: executeConfirm, retry: retryConfirm, traceId } = useAtomicAction(
//         async (tId: string) => travelerConfirmArrival(tId)
//     );
//     useEffect(() => {
//         // اطبع كل بيانات الرحلة لنرى أين يختبئ الوقت 6:30!
//         console.log("📦 بيانات الرحلة بالكامل من فايربيز:", displayTrip);

//         let departureDate: Date;
//         const rawDate = displayTrip.departureDate;

//         if (!rawDate) {
//             setTicketState('scheduled');
//             return;
//         }

//         // 1. قراءة التاريخ الأساسي
//         if (typeof (rawDate as any).toDate === 'function') {
//             departureDate = (rawDate as any).toDate();
//         } else if (typeof rawDate === 'object' && 'seconds' in rawDate) {
//             departureDate = new Date((rawDate as any).seconds * 1000);
//         } else {
//             departureDate = new Date(rawDate);
//         }

//         if (isNaN(departureDate.getTime())) {
//             setTicketState('scheduled');
//             return;
//         }

//         // 🚀 [THE FIX]: البحث العنيف عن الوقت في عدة حقول محتملة
//         const tripData = displayTrip as any;
//         const timeString = tripData.time || tripData.departureTime || tripData.pickupTime;

//         if (timeString && typeof timeString === 'string') {
//             // استخراج الساعات والدقائق حتى لو كان النص مكتوباً بـ AM/PM أو 24H
//             const timeMatch = timeString.match(/(\d+):(\d+)/);
//             if (timeMatch) {
//                 let hours = parseInt(timeMatch[1], 10);
//                 const minutes = parseInt(timeMatch[2], 10);

//                 // تحويل صيغة PM إلى 24 ساعة (مثال: 6:30 PM تصبح 18:30)
//                 if (timeString.toLowerCase().includes('pm') && hours < 12) hours += 12;
//                 if (timeString.toLowerCase().includes('م') && hours < 12) hours += 12; // دعم حرف 'م' للعربي
//                 if (timeString.toLowerCase().includes('am') && hours === 12) hours = 0;
//                 if (timeString.toLowerCase().includes('ص') && hours === 12) hours = 0;

//                 // تحديث التاريخ ليعكس الساعة الحقيقية
//                 departureDate.setHours(hours, minutes, 0, 0);
//             }
//         } else if (departureDate.getHours() === 0 && departureDate.getMinutes() === 0) {
//             console.warn("⚠️ تحذير: فايربيز أرسل التاريخ 12:00 منتصف الليل ولم نجد حقل وقت إضافي!");
//         }

//         const now = new Date();
//         const durationHours = displayTrip.estimatedDurationHours ? Number(displayTrip.estimatedDurationHours) : 2;
//         const arrivalDate = new Date(departureDate.getTime() + (durationHours * 60 * 60 * 1000));

//         console.log("⏰ وقت المتصفح الآن:", now.toLocaleString());
//         console.log("🚀 وقت الانطلاق المحسوب (بعد محاولة الدمج):", departureDate.toLocaleString());
//         console.log("🏁 وقت الوصول المحسوب:", arrivalDate.toLocaleString());

//         if (booking.status === 'Cancelled' || displayTrip.status === 'Cancelled') {
//             setTicketState('archived');
//             return;
//         }

//         if (now < departureDate) {
//             setTicketState('scheduled');
//         } else if (now >= departureDate && now <= arrivalDate) {
//             setTicketState('active');
//         } else {
//             setTicketState('archived');
//         }
//     }, [displayTrip.departureDate, displayTrip.status, booking.status, displayTrip.estimatedDurationHours, displayTrip]);
//     const displayCarrierName = carrierProfile?.firstName || displayTrip.carrierName;
//     const isTransferred = displayTrip.transferStatus === 'Transferred' || !!displayTrip.originalCarrierId;

//     // طلب نقل المسافر لناقل آخر (لو الناقل الحالي طلب تحويله لرحلة/ناقل جديد)
//     const { request: transferRequest } = useBookingTransferPassenger(booking.id, booking.userId);

//     const currentTotalPrice = booking.totalPrice;
//     const depositAmount = useMemo(() => FinancialLogic.calculateDeposit(currentTotalPrice, displayTrip.depositPercentage), [currentTotalPrice, displayTrip.depositPercentage]);
//     const remainingAmount = useMemo(() => FinancialLogic.calculateRemaining(currentTotalPrice, depositAmount), [currentTotalPrice, displayTrip.depositPercentage]);

//     const currentStyle = STATE_STYLES[ticketState];

//     return (
//         <>
//             <TicketModificationAlert tripId={booking.carrierTripId || booking.tripId} />
//             {transferRequest && (
//                 <div className="mb-6">
//                     <BookingTransferPassengerCard
//                         transferRequestId={transferRequest.id}
//                         bookingId={booking.id}
//                         fromCarrierId={transferRequest.fromCarrierId}
//                         toCarrierId={transferRequest.toCarrierId}
//                         toCarrierTripId={transferRequest.toCarrierTripId}
//                         tripDetails={transferRequest.tripDetails}
//                     />
//                 </div>
//             )}
//             <Card className={cn("bg-gradient-to-br shadow-lg mb-6 transition-all duration-700 relative overflow-hidden", currentStyle.card)}>
//                 <div className="absolute top-4 left-4 z-10 flex gap-2 no-print">
//                     <Button variant="outline" size="icon" className="rounded-full h-10 w-10 bg-white/10 hover:bg-white/30 border-white/20 text-white backdrop-blur-md" onClick={() => setIsPrintOpen(true)}>
//                         <Printer className="h-5 w-5" />
//                     </Button>
//                     <Button variant="outline" size="icon" className="rounded-full h-10 w-10 bg-white/10 hover:bg-white/30 border-white/20 text-white backdrop-blur-md" onClick={() => setIsQROpen(true)}>
//                         <QrCode className="h-5 w-5" />
//                     </Button>
//                 </div>
//                 <div className="  absolute top-4 left-1/2 -translate-x-1/2">
//                     <div className="p-2 bg-background/50 rounded-xl border border-primary/20 w-20 text-center shadow-sm">
//                         <p className="text-[10px] md:text-sm font-black text-muted-foreground uppercase">{t('flightNumber')}</p>
//                         <p className="font-mono font-bold text-sm text-white">{displayTrip.id.slice(-6).toUpperCase()}</p>
//                     </div>
//                 </div>
//                 <CardHeader className={cn("text-white transition-colors duration-700", currentStyle.header)}>
//                     <div className="flex items-center gap-2">
//                         <Badge variant="default" className={cn("w-fit shadow-sm border-0", currentStyle.badge)}>
//                             {booking.status === 'Cancelled' ? t('canceled') : currentStyle.badgeText}
//                         </Badge>
//                         {isTransferred && (
//                             <Badge variant="outline" className="bg-amber-500/20 text-amber-200 border-amber-500/30 font-black gap-1.5 px-3 h-6">
//                                 <RefreshCw className="h-3 w-3 animate-spin-slow" /> {t('responsibility')}
//                             </Badge>
//                         )}
//                     </div>
//                     <CardTitle className="pt-2 text-xl flex items-center gap-1">
//                         {getCityName(displayTrip.origin, locale)}
//                         <span className="text-white/70 mx-1">{locale === 'ar' ? '◄' : '►'}</span>
//                         {getCityName(displayTrip.destination, locale)}
//                     </CardTitle>
//                 </CardHeader>

//                 <CardContent className="space-y-4 text-sm pt-4">
//                     {isTransferred && (
//                         <div className="p-4 text-xs bg-amber-500/10 border border-amber-500/20 text-amber-200 rounded-[1.5rem] flex items-start gap-3">
//                             <ShieldCheck className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
//                             <div className="space-y-1">
//                                 <p className="font-black text-sm text-amber-400 uppercase tracking-tighter italic">{t('fieldNotice')}</p>
//                                 <p className="opacity-90 leading-relaxed font-bold">{t('dec')}</p>
//                             </div>
//                         </div>
//                     )}

//                     <div className="grid grid-cols-1 gap-2">
//                         {booking.passengersDetails?.map((pax, idx) => (
//                             <div key={`pax-${idx}`} className="flex items-center justify-between p-3 bg-primary/5 border border-primary/10 rounded-2xl">
//                                 <span className="font-bold text-lg">{pax.name}</span>
//                                 <Badge variant="outline" className="font-mono text-[14px] text-black gap-1 px-3 bg-[#A18E64]">
//                                     <FileText className="h-3 w-3 opacity-40" />
//                                     {pax.documentNumber}
//                                 </Badge>
//                             </div>
//                         ))}
//                     </div>

//                     <div className="p-4 bg-background/50 rounded-2xl border border-primary/20 space-y-3 shadow-inner">
//                         <p className="font-black text-sm md:text-lg uppercase tracking-widest flex items-center gap-2 text-muted-foreground"><UserCheck className="h-4 w-4 text-primary" />{t('ditalsCarrier')}</p>
//                         <div className="space-y-2">
//                             <div className="flex justify-between items-center text-xs border-b border-dashed border-primary/10 pb-2">
//                                 <span className="opacity-60 uppercase font-bold text-sm md:text-lg">{t('carrierName')}:</span>
//                                 <span className={cn("font-black text-lg", isTransferred ? "text-amber-400" : "text-primary")}>{displayCarrierName}</span>
//                             </div>
//                             {/* عرض تقييم الناقل بالنجوم */}
//                             {carrierProfile?.ratingStats && (
//                                 <div className="flex justify-between items-center text-xs border-b border-dashed border-primary/10 pb-2">
//                                     <span className="opacity-60 uppercase font-bold text-sm md:text-lg">التقييم:</span>
//                                     <div className="flex items-center gap-2">
//                                         <div className="flex items-center gap-0.5">
//                                             {[1, 2, 3, 4, 5].map(s => (
//                                                 <Star key={s} className={cn("h-4 w-4", s <= Math.round(carrierProfile.ratingStats!.average) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30")} />
//                                             ))}
//                                         </div>
//                                         <span className="font-black text-sm text-yellow-500">{carrierProfile.ratingStats.average.toFixed(1)}</span>
//                                         <span className="text-muted-foreground font-bold">({carrierProfile.ratingStats.count})</span>
//                                     </div>
//                                 </div>
//                             )}
//                             <div className="flex justify-between items-center text-xs">
//                                 <span className="opacity-60 uppercase font-bold text-sm md:text-lg">{t('carrierNum')}:</span>
//                                 {carrierProfile?.phoneNumber ? (
//                                     <a href={`tel:${carrierProfile.phoneNumber}`} className="font-black hover:underline ltr text-black  bg-[#A18E64] hover:bg-[#a18e64b1] px-2 py-1 rounded-lg ">{carrierProfile.phoneNumber}</a>
//                                 ) : <span className="font-bold italic opacity-40">{t('viaChat')}</span>}
//                             </div>
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-2 gap-4">
//                         <div className="p-3 bg-background/50 rounded-2xl border border-primary/20 space-y-1 shadow-sm">
//                             <p className="text-sm md:text-lg font-black text-muted-foreground uppercase flex items-center gap-1"><Clock className="h-3 w-3" />
//                                 {t('time')}                             </p>
//                             {/* إظهار الوقت بجانب التاريخ لكشف خطأ الـ AM/PM */}
//                             <p className="font-bold text-md text-primary">{formatDate(displayTrip.departureDate, 'd MMM yyyy - hh:mm a', locale)}</p>
//                         </div>
//                         <div className="p-3 bg-background/50 rounded-2xl border border-primary/20 space-y-1 shadow-sm">
//                             <p className="text-sm md:text-lg font-black text-muted-foreground uppercase flex items-center gap-1"><MapPin className="h-3 w-3" /> {t('meetingPoint')}</p>
//                             <div className="flex flex-col md:flex-row gap-1 justify-between md:items-center">
//                                 <p className="font-bold text-md truncate">{displayTrip.meetingPoint || t('mainStation')}</p>
//                                 {displayTrip.meetingPointLink ? (
//                                     <a href={displayTrip.meetingPointLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-md font-black text-black bg-[#A18E64] hover:bg-[#a18e64b1]  px-2 py-1 rounded-lg transition-all mt-1">
//                                         <MapPin className="h-3 w-3" /> افتح الخريطة
//                                     </a>
//                                 ) : null}
//                             </div>
//                         </div>
//                     </div>

//                     <div className="p-4 bg-primary/5 rounded-2xl border border-dashed border-primary/30 space-y-3">
//                         <div className="flex justify-between items-center">
//                             <span className="text-sm md:text-lg font-bold opacity-60">{t('totalPrice')}:</span>
//                             <span className="font-bold text-lg">{currentTotalPrice.toFixed(2)} {booking.currency}</span>
//                         </div>
//                         <div className="flex  justify-between items-center pt-2 border-t border-primary/10">
//                             <span className="text-sm md:text-lg font-black text-primary uppercase">{t('remainderCommander')}:</span>
//                             <Badge className="text-sm font-black bg-primary text-black px-4 py-1  shadow-md">
//                                 {remainingAmount.toFixed(2)} {booking.currency}
//                             </Badge>
//                         </div>
//                     </div>
//                 </CardContent>

//                 <CardFooter className="grid grid-cols-1 gap-3 pt-2 no-print">


//                     {ticketState === 'active' && (
//                         <ResilienceShield state={atomicState} onRetry={retryConfirm} onConvertToCash={() => { }} traceId={traceId}>
//                             <Button className="w-full h-14 bg-green-600 hover:bg-green-700 text-white font-black rounded-2xl shadow-xl active:scale-95 transition-all" onClick={() => executeConfirm(displayTrip.id)} disabled={atomicState === 'executing'}>
//                                 {atomicState === 'executing' ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
//                                 {t('accessConfirmed')}
//                             </Button>
//                         </ResilienceShield>
//                     )}

//                     {ticketState !== 'archived' && (
//                         <div className="grid grid-cols-2 gap-2">
//                             <Button variant="outline" className="h-12 rounded-2xl font-bold gap-2" onClick={onMessageCarrier}>
//                                 <MessageSquare className="h-4 w-4" /> {t('chatpriv')}
//                             </Button>
//                             <Button variant="outline" className="h-12 rounded-2xl font-bold gap-2" onClick={onMessageGroup}>
//                                 <Users className="h-4 w-4" /> {t('chatGrop')}
//                             </Button>
//                         </div>
//                     )}
//                     {ticketState === 'scheduled' && (
//                         <Button variant="destructive" className="w-20 mx-auto h-12 rounded-2xl font-black gap-2 shadow-lg bg-transparent" onClick={() => onCancelBooking(displayTrip, booking)}>
//                             <Ban className="h-4 w-4" /> {t('cancelBooking')}
//                         </Button>
//                     )}
//                 </CardFooter>
//             </Card>

//             <QRDialog isOpen={isQROpen} onOpenChange={setIsQROpen} data={{ tripId: displayTrip.id, bookingId: booking.id, passengerName: booking.passengersDetails?.[0]?.name || 'مسافر', documentNumber: booking.passengersDetails?.[0]?.documentNumber, seats: booking.seats, pickup: displayTrip.meetingPoint || getCityName(displayTrip.origin, locale), carrierName: displayCarrierName, carrierPhone: carrierProfile?.phoneNumber, departureDate: formatDate(displayTrip.departureDate, 'd MMM yyyy', locale), departureTime: formatDate(displayTrip.departureDate, 'hh:mm a', locale) }} />
//             <PrintableTicket isOpen={isPrintOpen} onOpenChange={setIsPrintOpen} trip={displayTrip} booking={booking} carrier={carrierProfile || null} />
//         </>
//     );
// };


'use client';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    UserCheck, MapPin, MessageSquare, ShieldCheck, CheckCircle2,
    QrCode, Printer, FileText, RefreshCw, Ban, Clock, Loader2, Users, Star
} from 'lucide-react';
import type {
    Trip, Booking, UserProfile,
} from '@/lib/data';
import { getCityName } from '@/lib/constants';
import { formatDate } from '@/lib/formatters';
import { FinancialLogic } from '@/lib/financial-logic';
import { useMemo, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { QRDialog } from './qr-dialog';
import { PrintableTicket } from './printable-ticket';
import { useLocale, useTranslations } from 'next-intl';
import { useTripActions } from '@/hooks/use-trip-actions';
import { useLiveTripReactor } from '@/hooks/use-live-trip-reactor';
import { useAtomicAction } from '@/hooks/use-atomic-action';
import { ResilienceShield } from '@/components/ticket/resilience-shield';
import { TicketModificationAlert } from '../traveler/ticket-modification-alert';
import { BookingTransferPassengerCard } from '@/components/booking/booking-transfer-passenger-card';
import { useBookingTransferPassenger } from '@/hooks/use-booking-transfer-passenger';
// import { useBookingTransferPassenger } from '@/hooks/use-booking-transfer-passenger';

interface HeroTicketProps {
    trip: Trip;
    booking: Booking;
    carrierProfile?: UserProfile | null;
    onRateTrip: (trip: Trip) => void;
    onCancelBooking: (trip: Trip, booking: Booking) => void;
    onMessageCarrier: () => void;
    onMessageGroup: () => void;
}

type TicketState = 'scheduled' | 'active' | 'archived';

const STATE_STYLES = {
    scheduled: { card: "border-primary", header: "from-blue-600 to-blue-800", badge: "bg-primary", badgeText: "تذكرة مؤكدة" },
    active: { card: "border-green-500 ring-1 ring-green-500/50", header: "from-green-600 to-green-800", badge: "bg-green-500 animate-pulse", badgeText: "الرحلة جارية الآن 🚌" },
    archived: { card: "border-muted-foreground/30 grayscale opacity-90", header: "from-slate-700 to-slate-900", badge: "bg-muted-foreground", badgeText: "مكتملة" }
};

export const HeroTicket = ({ trip: initialTrip, booking, carrierProfile, onRateTrip, onCancelBooking, onMessageCarrier, onMessageGroup }: HeroTicketProps) => {
    const locale = useLocale();
    const { travelerConfirmArrival } = useTripActions();
    const [ticketState, setTicketState] = useState<TicketState>('scheduled');
    const [isQROpen, setIsQROpen] = useState(false);
    const [isPrintOpen, setIsPrintOpen] = useState(false);
    const t = useTranslations('heroTicket');
    const { trip: liveTrip } = useLiveTripReactor(initialTrip?.id);
    const baseTripData = liveTrip || initialTrip;

    // ✅ [FIX]: استخدم carrierTripId من الـ booking مباشرة — أولوية قصوى
    const carrierTripId = (booking as any).carrierTripId || (baseTripData as any).carrierTripId;
    const { trip: liveCarrierTrip } = useLiveTripReactor(carrierTripId || null);

    // ✅ [FIX]: دمج بيانات رحلة الناقل فوق بيانات الرحلة الأصلية
    // رحلة الناقل هي المصدر الحقيقي: التاريخ + الوقت + نقطة الانطلاق + رقم الرحلة
    const displayTrip = {
        ...baseTripData,
        ...(liveCarrierTrip ? {
            // ✅ id رحلة الناقل → رقم الرحلة الصح في التذكرة
            id: liveCarrierTrip.id || baseTripData.id,
            departureDate: liveCarrierTrip.departureDate || baseTripData.departureDate,
            departureTime: (liveCarrierTrip as any).departureTime || (baseTripData as any).departureTime,
            meetingPoint: (liveCarrierTrip as any).meetingPoint || (baseTripData as any).meetingPoint,
            meetingPointLink: (liveCarrierTrip as any).meetingPointLink || (baseTripData as any).meetingPointLink,
            depositPercentage: (liveCarrierTrip as any).depositPercentage ?? (baseTripData as any).depositPercentage,
            price: (liveCarrierTrip as any).price ?? (baseTripData as any).price,
            conditions: (liveCarrierTrip as any).conditions || (baseTripData as any).conditions,
        } : {
            // ✅ [FIX]: حتى لو مفيش liveCarrierTrip، استخدم carrierTripId كـ id للتذكرة
            ...(carrierTripId && carrierTripId !== baseTripData.id ? { id: carrierTripId } : {}),
        }),
    } as typeof baseTripData;

    const { state: atomicState, execute: executeConfirm, retry: retryConfirm, traceId } = useAtomicAction(
        async (tId: string) => travelerConfirmArrival(tId)
    );
    useEffect(() => {
        // اطبع كل بيانات الرحلة لنرى أين يختبئ الوقت 6:30!
        console.log("📦 بيانات الرحلة بالكامل من فايربيز:", displayTrip);

        let departureDate: Date;
        const rawDate = displayTrip.departureDate;

        if (!rawDate) {
            setTicketState('scheduled');
            return;
        }

        // 1. قراءة التاريخ الأساسي
        if (typeof (rawDate as any).toDate === 'function') {
            departureDate = (rawDate as any).toDate();
        } else if (typeof rawDate === 'object' && 'seconds' in rawDate) {
            departureDate = new Date((rawDate as any).seconds * 1000);
        } else {
            departureDate = new Date(rawDate);
        }

        if (isNaN(departureDate.getTime())) {
            setTicketState('scheduled');
            return;
        }

        // 🚀 [THE FIX]: البحث العنيف عن الوقت في عدة حقول محتملة
        const tripData = displayTrip as any;
        const timeString = tripData.time || tripData.departureTime || tripData.pickupTime;

        if (timeString && typeof timeString === 'string') {
            // استخراج الساعات والدقائق حتى لو كان النص مكتوباً بـ AM/PM أو 24H
            const timeMatch = timeString.match(/(\d+):(\d+)/);
            if (timeMatch) {
                let hours = parseInt(timeMatch[1], 10);
                const minutes = parseInt(timeMatch[2], 10);

                // تحويل صيغة PM إلى 24 ساعة (مثال: 6:30 PM تصبح 18:30)
                if (timeString.toLowerCase().includes('pm') && hours < 12) hours += 12;
                if (timeString.toLowerCase().includes('م') && hours < 12) hours += 12; // دعم حرف 'م' للعربي
                if (timeString.toLowerCase().includes('am') && hours === 12) hours = 0;
                if (timeString.toLowerCase().includes('ص') && hours === 12) hours = 0;

                // تحديث التاريخ ليعكس الساعة الحقيقية
                departureDate.setHours(hours, minutes, 0, 0);
            }
        } else if (departureDate.getHours() === 0 && departureDate.getMinutes() === 0) {
            console.warn("⚠️ تحذير: فايربيز أرسل التاريخ 12:00 منتصف الليل ولم نجد حقل وقت إضافي!");
        }

        const now = new Date();
        const durationHours = displayTrip.estimatedDurationHours ? Number(displayTrip.estimatedDurationHours) : 2;
        const arrivalDate = new Date(departureDate.getTime() + (durationHours * 60 * 60 * 1000));

        console.log("⏰ وقت المتصفح الآن:", now.toLocaleString());
        console.log("🚀 وقت الانطلاق المحسوب (بعد محاولة الدمج):", departureDate.toLocaleString());
        console.log("🏁 وقت الوصول المحسوب:", arrivalDate.toLocaleString());

        if (booking.status === 'Cancelled' || displayTrip.status === 'Cancelled') {
            setTicketState('archived');
            return;
        }

        if (now < departureDate) {
            setTicketState('scheduled');
        } else if (now >= departureDate && now <= arrivalDate) {
            setTicketState('active');
        } else {
            setTicketState('archived');
        }
    }, [displayTrip.departureDate, displayTrip.status, booking.status, displayTrip.estimatedDurationHours, displayTrip]);
    const displayCarrierName = carrierProfile?.firstName || displayTrip.carrierName;
    const isTransferred = displayTrip.transferStatus === 'Transferred' || !!displayTrip.originalCarrierId;

    // طلب نقل المسافر لناقل آخر (لو الناقل الحالي طلب تحويله لرحلة/ناقل جديد)
    const { request: transferRequest } = useBookingTransferPassenger(booking.id, booking.userId);

    const currentTotalPrice = booking.totalPrice;
    const depositAmount = useMemo(() => FinancialLogic.calculateDeposit(currentTotalPrice, displayTrip.depositPercentage), [currentTotalPrice, displayTrip.depositPercentage]);
    const remainingAmount = useMemo(() => FinancialLogic.calculateRemaining(currentTotalPrice, depositAmount), [currentTotalPrice, displayTrip.depositPercentage]);

    const currentStyle = STATE_STYLES[ticketState];

    return (
        <>
            <TicketModificationAlert tripId={booking.carrierTripId || booking.tripId} />
            {transferRequest && (
                <div className="mb-6">
                    <BookingTransferPassengerCard
                        transferRequestId={transferRequest.id}
                        bookingId={booking.id}
                        fromCarrierId={transferRequest.fromCarrierId}
                        toCarrierId={transferRequest.toCarrierId}
                        toCarrierTripId={transferRequest.toCarrierTripId}
                        tripDetails={transferRequest.tripDetails}
                    />
                </div>
            )}
            <Card className={cn("bg-gradient-to-br shadow-lg mb-6 transition-all duration-700 relative overflow-hidden", currentStyle.card)}>
                <div className="absolute top-4 left-4 z-10 flex gap-2 no-print">
                    <Button variant="outline" size="icon" className="rounded-full h-10 w-10 bg-white/10 hover:bg-white/30 border-white/20 text-white backdrop-blur-md" onClick={() => setIsPrintOpen(true)}>
                        <Printer className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full h-10 w-10 bg-white/10 hover:bg-white/30 border-white/20 text-white backdrop-blur-md" onClick={() => setIsQROpen(true)}>
                        <QrCode className="h-5 w-5" />
                    </Button>
                </div>
                <div className="  absolute top-4 left-1/2 -translate-x-1/2">
                    <div className="p-2 bg-background/50 rounded-xl border border-primary/20 w-20 text-center shadow-sm">
                        <p className="text-[10px] md:text-sm font-black text-muted-foreground uppercase">{t('flightNumber')}</p>
                        <p className="font-mono font-bold text-sm text-white">{displayTrip.id.slice(-6).toUpperCase()}</p>
                    </div>
                </div>
                <CardHeader className={cn("text-white transition-colors duration-700", currentStyle.header)}>
                    <div className="flex items-center gap-2">
                        <Badge variant="default" className={cn("w-fit shadow-sm border-0", currentStyle.badge)}>
                            {booking.status === 'Cancelled' ? t('canceled') : currentStyle.badgeText}
                        </Badge>
                        {isTransferred && (
                            <Badge variant="outline" className="bg-amber-500/20 text-amber-200 border-amber-500/30 font-black gap-1.5 px-3 h-6">
                                <RefreshCw className="h-3 w-3 animate-spin-slow" /> {t('responsibility')}
                            </Badge>
                        )}
                    </div>
                    <CardTitle className="pt-2 text-xl flex items-center gap-1">
                        {getCityName(displayTrip.origin, locale)}
                        <span className="text-white/70 mx-1">{locale === 'ar' ? '◄' : '►'}</span>
                        {getCityName(displayTrip.destination, locale)}
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4 text-sm pt-4">
                    {isTransferred && (
                        <div className="p-4 text-xs bg-amber-500/10 border border-amber-500/20 text-amber-200 rounded-[1.5rem] flex items-start gap-3">
                            <ShieldCheck className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <p className="font-black text-sm text-amber-400 uppercase tracking-tighter italic">{t('fieldNotice')}</p>
                                <p className="opacity-90 leading-relaxed font-bold">{t('dec')}</p>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-2">
                        {booking.passengersDetails?.map((pax, idx) => (
                            <div key={`pax-${idx}`} className="flex items-center justify-between p-3 bg-primary/5 border border-primary/10 rounded-2xl">
                                <span className="font-bold text-lg">{pax.name}</span>
                                <Badge variant="outline" className="font-mono text-[14px] text-black gap-1 px-3 bg-[#A18E64]">
                                    <FileText className="h-3 w-3 opacity-40" />
                                    {pax.documentNumber}
                                </Badge>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 bg-background/50 rounded-2xl border border-primary/20 space-y-3 shadow-inner">
                        <p className="font-black text-sm md:text-lg uppercase tracking-widest flex items-center gap-2 text-muted-foreground"><UserCheck className="h-4 w-4 text-primary" />{t('ditalsCarrier')}</p>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-xs border-b border-dashed border-primary/10 pb-2">
                                <span className="opacity-60 uppercase font-bold text-sm md:text-lg">{t('carrierName')}:</span>
                                <span className={cn("font-black text-lg", isTransferred ? "text-amber-400" : "text-primary")}>{displayCarrierName}</span>
                            </div>
                            {/* عرض تقييم الناقل بالنجوم */}
                            {carrierProfile?.ratingStats && (
                                <div className="flex justify-between items-center text-xs border-b border-dashed border-primary/10 pb-2">
                                    <span className="opacity-60 uppercase font-bold text-sm md:text-lg">التقييم:</span>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-0.5">
                                            {[1, 2, 3, 4, 5].map(s => (
                                                <Star key={s} className={cn("h-4 w-4", s <= Math.round(carrierProfile.ratingStats!.average) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30")} />
                                            ))}
                                        </div>
                                        <span className="font-black text-sm text-yellow-500">{carrierProfile.ratingStats.average.toFixed(1)}</span>
                                        <span className="text-muted-foreground font-bold">({carrierProfile.ratingStats.count})</span>
                                    </div>
                                </div>
                            )}
                            <div className="flex justify-between items-center text-xs">
                                <span className="opacity-60 uppercase font-bold text-sm md:text-lg">{t('carrierNum')}:</span>
                                {carrierProfile?.phoneNumber ? (
                                    <a href={`tel:${carrierProfile.phoneNumber}`} className="font-black hover:underline ltr text-black  bg-[#A18E64] hover:bg-[#a18e64b1] px-2 py-1 rounded-lg ">{carrierProfile.phoneNumber}</a>
                                ) : <span className="font-bold italic opacity-40">{t('viaChat')}</span>}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-background/50 rounded-2xl border border-primary/20 space-y-1 shadow-sm">
                            <p className="text-sm md:text-lg font-black text-muted-foreground uppercase flex items-center gap-1"><Clock className="h-3 w-3" />
                                {t('time')}                             </p>
                            {/* إظهار الوقت بجانب التاريخ لكشف خطأ الـ AM/PM */}
                            <p className="font-bold text-md text-primary">{formatDate(displayTrip.departureDate, 'd MMM yyyy - hh:mm a', locale)}</p>
                        </div>
                        <div className="p-3 bg-background/50 rounded-2xl border border-primary/20 space-y-1 shadow-sm">
                            <p className="text-sm md:text-lg font-black text-muted-foreground uppercase flex items-center gap-1"><MapPin className="h-3 w-3" /> {t('meetingPoint')}</p>
                            <div className="flex flex-col md:flex-row gap-1 justify-between md:items-center">
                                <p className="font-bold text-md truncate">{displayTrip.meetingPoint || t('mainStation')}</p>
                                {displayTrip.meetingPointLink ? (
                                    <a href={displayTrip.meetingPointLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-md font-black text-black bg-[#A18E64] hover:bg-[#a18e64b1]  px-2 py-1 rounded-lg transition-all mt-1">
                                        <MapPin className="h-3 w-3" /> افتح الخريطة
                                    </a>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-primary/5 rounded-2xl border border-dashed border-primary/30 space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm md:text-lg font-bold opacity-60">{t('totalPrice')}:</span>
                            <span className="font-bold text-lg">{currentTotalPrice.toFixed(2)} {booking.currency}</span>
                        </div>
                        <div className="flex  justify-between items-center pt-2 border-t border-primary/10">
                            <span className="text-sm md:text-lg font-black text-primary uppercase">{t('remainderCommander')}:</span>
                            <Badge className="text-sm font-black bg-primary text-black px-4 py-1  shadow-md">
                                {remainingAmount.toFixed(2)} {booking.currency}
                            </Badge>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="grid grid-cols-1 gap-3 pt-2 no-print">


                    {ticketState === 'active' && (
                        <ResilienceShield state={atomicState} onRetry={retryConfirm} onConvertToCash={() => { }} traceId={traceId}>
                            <Button className="w-full h-14 bg-green-600 hover:bg-green-700 text-white font-black rounded-2xl shadow-xl active:scale-95 transition-all" onClick={() => executeConfirm(displayTrip.id)} disabled={atomicState === 'executing'}>
                                {atomicState === 'executing' ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
                                {t('accessConfirmed')}
                            </Button>
                        </ResilienceShield>
                    )}

                    {ticketState !== 'archived' && (
                        <div className="grid grid-cols-2 gap-2">
                            <Button variant="outline" className="h-12 rounded-2xl font-bold gap-2" onClick={onMessageCarrier}>
                                <MessageSquare className="h-4 w-4" /> {t('chatpriv')}
                            </Button>
                            <Button variant="outline" className="h-12 rounded-2xl font-bold gap-2" onClick={onMessageGroup}>
                                <Users className="h-4 w-4" /> {t('chatGrop')}
                            </Button>
                        </div>
                    )}
                    {ticketState === 'scheduled' && (
                        <Button variant="destructive" className="w-20 mx-auto h-12 rounded-2xl font-black gap-2 shadow-lg bg-transparent" onClick={() => onCancelBooking(displayTrip, booking)}>
                            <Ban className="h-4 w-4" /> {t('cancelBooking')}
                        </Button>
                    )}
                </CardFooter>
            </Card>

            <QRDialog isOpen={isQROpen} onOpenChange={setIsQROpen} data={{ tripId: displayTrip.id, bookingId: booking.id, passengerName: booking.passengersDetails?.[0]?.name || 'مسافر', documentNumber: booking.passengersDetails?.[0]?.documentNumber, seats: booking.seats, pickup: displayTrip.meetingPoint || getCityName(displayTrip.origin, locale), carrierName: displayCarrierName, carrierPhone: carrierProfile?.phoneNumber, departureDate: formatDate(displayTrip.departureDate, 'd MMM yyyy', locale), departureTime: formatDate(displayTrip.departureDate, 'hh:mm a', locale) }} />
            <PrintableTicket isOpen={isPrintOpen} onOpenChange={setIsPrintOpen} trip={displayTrip} booking={booking} carrier={carrierProfile || null} />
        </>
    );
};