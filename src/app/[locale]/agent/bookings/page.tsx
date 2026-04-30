// 'use client';

// /**
//  * @page AgentBookingsManagement
//  * @description إدارة الحجوزات — كل حجوزات الوكيل من أول لآخر
//  */

// import { useState, useMemo } from 'react';
// import { useAgentBookings } from '@/hooks/use-agent-bookings';
// import { useFirestore, useMemoFirebase, useDoc } from '@/firebase';
// import { doc } from 'firebase/firestore';
// import { Badge } from '@/components/ui/badge';
// import { Skeleton } from '@/components/ui/skeleton';
// import { Link } from '@/i18n/routing';
// import {
//     ClipboardList, Clock, CreditCard, CheckCircle2,
//     Flag, XCircle, ChevronDown, ChevronUp, User,
//     MapPin, Calendar, Banknote, ArrowRight, Search
// } from 'lucide-react';
// import { getCityName } from '@/lib/constants';
// import { useLocale } from 'next-intl';
// import { formatDate } from '@/lib/formatters';
// import type { Booking } from '@/lib/data';
// import { cn } from '@/lib/utils';

// // ══════════════════════════════════════════
// // تعريف الحالات وألوانها ونصوصها
// // ══════════════════════════════════════════
// const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
//     'Pending-Carrier-Confirmation': { label: 'بانتظار الناقل', color: 'bg-orange-500/15 text-orange-400 border-orange-500/30', icon: Clock },
//     'Pending-Payment': { label: 'بانتظار الدفع', color: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30', icon: CreditCard },
//     'Pending-Payment-Verification': { label: 'دفع — بانتظار الختم', color: 'bg-blue-500/15 text-blue-400 border-blue-500/30', icon: CreditCard },
//     'Confirmed': { label: 'مؤكد', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', icon: CheckCircle2 },
//     'Completed': { label: 'مكتملة', color: 'bg-primary/15 text-primary border-primary/30', icon: Flag },
//     'Rated': { label: 'مكتملة', color: 'bg-primary/15 text-primary border-primary/30', icon: Flag },
//     'Cancelled': { label: 'ملغاة', color: 'bg-red-500/15 text-red-400 border-red-500/30', icon: XCircle },
// };

// const SECTIONS = [
//     { key: 'pendingConfirmation', label: 'بانتظار الناقل', headerColor: 'text-orange-400', dotColor: 'bg-orange-400' },
//     { key: 'pendingPayment', label: 'بانتظار الدفع', headerColor: 'text-yellow-400', dotColor: 'bg-yellow-400' },
//     { key: 'pendingVerification', label: 'دفع — بانتظار الختم', headerColor: 'text-blue-400', dotColor: 'bg-blue-400 animate-pulse' },
//     { key: 'confirmed', label: 'مؤكدة', headerColor: 'text-emerald-400', dotColor: 'bg-emerald-400' },
//     { key: 'completed', label: 'مكتملة', headerColor: 'text-primary', dotColor: 'bg-primary' },
//     { key: 'cancelled', label: 'ملغاة', headerColor: 'text-red-400', dotColor: 'bg-red-400' },
// ] as const;

// // ══════════════════════════════════════════
// // كارت حجز واحد
// // ══════════════════════════════════════════
// function BookingCard({ booking }: { booking: Booking }) {
//     const [expanded, setExpanded] = useState(false);
//     const locale = useLocale();
//     const firestore = useFirestore();

//     const tripRef = useMemoFirebase(() =>
//         firestore && booking.tripId ? doc(firestore, 'trips', booking.tripId) : null,
//         [firestore, booking.tripId]
//     );
//     const { data: trip } = useDoc<any>(tripRef);

//     const cfg = STATUS_CONFIG[booking.status] || STATUS_CONFIG['Confirmed'];
//     const StatusIcon = cfg.icon;

//     const passengerName = booking.passengersDetails?.[0]?.name
//         || (trip?.passengerName)
//         || 'مسافر';

//     const origin = trip ? getCityName(trip.origin, locale) : '—';
//     const destination = trip ? getCityName(trip.destination, locale) : '—';
//     const date = trip?.departureDate
//         ? formatDate(trip.departureDate, 'dd/MM/yyyy', locale)
//         : '—';

//     return (
//         <div className={cn(
//             'rounded-2xl border transition-all duration-300',
//             'bg-card/60 backdrop-blur-sm',
//             expanded ? 'border-primary/30 shadow-[0_0_20px_rgba(var(--primary-rgb),0.08)]' : 'border-white/5 hover:border-white/10'
//         )}>
//             {/* رأس الكارت */}
//             <button
//                 onClick={() => setExpanded(e => !e)}
//                 className="w-full flex items-center justify-between p-4 text-right"
//             >
//                 <div className="flex items-center gap-3">
//                     <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
//                         <User className="h-4 w-4 text-primary" />
//                     </div>
//                     <div>
//                         <p className="font-black text-sm text-foreground">{passengerName}</p>
//                         <p className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 mt-0.5">
//                             {destination} <ArrowRight className="h-2.5 w-2.5" /> {origin}
//                         </p>
//                     </div>
//                 </div>
//                 <div className="flex items-center gap-2">
//                     <Badge className={cn('text-[9px] font-black border gap-1 px-2 h-5', cfg.color)}>
//                         <StatusIcon className="h-2.5 w-2.5" />
//                         {cfg.label}
//                     </Badge>
//                     {expanded
//                         ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
//                         : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
//                 </div>
//             </button>

//             {/* تفاصيل موسّعة */}
//             {expanded && (
//                 <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3 animate-in fade-in slide-in-from-top-2 duration-200">
//                     <div className="grid grid-cols-2 gap-2 text-xs">
//                         <div className="bg-muted/30 rounded-xl p-3 space-y-1">
//                             <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">المقاعد</p>
//                             <p className="font-black text-foreground">{booking.seats} مقعد</p>
//                         </div>
//                         <div className="bg-muted/30 rounded-xl p-3 space-y-1">
//                             <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">السعر الكلي</p>
//                             <p className="font-black text-foreground flex items-center gap-1">
//                                 <Banknote className="h-3 w-3 text-emerald-400" />
//                                 {booking.totalPrice} {booking.currency}
//                             </p>
//                         </div>
//                         <div className="bg-muted/30 rounded-xl p-3 space-y-1">
//                             <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">تاريخ المغادرة</p>
//                             <p className="font-black text-foreground flex items-center gap-1">
//                                 <Calendar className="h-3 w-3 text-primary" />
//                                 {date}
//                             </p>
//                         </div>
//                         <div className="bg-muted/30 rounded-xl p-3 space-y-1">
//                             <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">نقطة الالتقاء</p>
//                             <p className="font-black text-foreground flex items-center gap-1">
//                                 <MapPin className="h-3 w-3 text-red-400" />
//                                 {trip?.meetingPoint || '—'}
//                             </p>
//                         </div>
//                     </div>

//                     {/* المسافرون */}
//                     {booking.passengersDetails && booking.passengersDetails.length > 0 && (
//                         <div className="bg-muted/20 rounded-xl p-3 space-y-1.5">
//                             <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-2">المسافرون</p>
//                             {booking.passengersDetails.map((p, i) => (
//                                 <div key={i} className="flex items-center justify-between text-[11px]">
//                                     <span className="font-bold text-foreground">{p.name}</span>
//                                     <span className="font-mono text-muted-foreground text-[9px]">{p.documentNumber}</span>
//                                 </div>
//                             ))}
//                         </div>
//                     )}

//                     {/* رقم السند */}
//                     {booking.depositVoucherId && (
//                         <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-center">
//                             <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">رقم سند الدفع</p>
//                             <p className="font-mono font-black text-blue-300 text-sm tracking-widest">{booking.depositVoucherId}</p>
//                         </div>
//                     )}

//                     {/* رابط التذكرة */}
//                     <Link
//                         href={`/ticket/${booking.tripId}`}
//                         className="flex items-center justify-center gap-2 w-full h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-black hover:bg-primary/20 transition-colors"
//                     >
//                         عرض التذكرة الكاملة <ArrowRight className="h-3.5 w-3.5" />
//                     </Link>
//                 </div>
//             )}
//         </div>
//     );
// }

// // ══════════════════════════════════════════
// // الصفحة الرئيسية
// // ══════════════════════════════════════════
// export default function AgentBookingsPage() {
//     const {
//         pendingConfirmation, pendingPayment, pendingVerification,
//         confirmed, completed, cancelled, all, isLoading
//     } = useAgentBookings();

//     const [search, setSearch] = useState('');
//     const [activeTab, setActiveTab] = useState<'all' | 'active' | 'done'>('active');

//     const dataMap = {
//         pendingConfirmation, pendingPayment, pendingVerification,
//         confirmed, completed, cancelled,
//     };

//     // فلتر البحث
//     const filteredAll = useMemo(() => {
//         if (!search.trim()) return all;
//         const q = search.toLowerCase();
//         return all.filter(b =>
//             b.passengersDetails?.some(p => p.name.toLowerCase().includes(q)) ||
//             b.depositVoucherId?.toLowerCase().includes(q) ||
//             b.id.toLowerCase().includes(q)
//         );
//     }, [all, search]);

//     const activeSections = SECTIONS.filter(s =>
//         ['pendingConfirmation', 'pendingPayment', 'pendingVerification', 'confirmed'].includes(s.key)
//     );
//     const doneSections = SECTIONS.filter(s =>
//         ['completed', 'cancelled'].includes(s.key)
//     );

//     const totalActive = pendingConfirmation.length + pendingPayment.length + pendingVerification.length + confirmed.length;

//     if (isLoading) {
//         return (
//             <div className="max-w-2xl mx-auto p-4 pt-8 pb-28 space-y-4" dir="rtl">
//                 <Skeleton className="h-10 w-48 rounded-2xl" />
//                 {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 rounded-2xl" />)}
//             </div>
//         );
//     }

//     const renderSections = (sections: typeof SECTIONS[number][]) =>
//         sections.map(section => {
//             const items = dataMap[section.key as keyof typeof dataMap] as Booking[];
//             if (items.length === 0) return null;
//             return (
//                 <section key={section.key} className="space-y-2">
//                     <div className="flex items-center gap-2 px-1">
//                         <span className={cn('w-2 h-2 rounded-full', section.dotColor)} />
//                         <h2 className={cn('text-xs font-black uppercase tracking-widest', section.headerColor)}>
//                             {section.label}
//                         </h2>
//                         <span className={cn('text-[9px] font-black px-1.5 py-0.5 rounded-full border', section.headerColor,
//                             section.dotColor.replace('bg-', 'bg-').replace('animate-pulse', '') + '/10'
//                         )}>
//                             {items.length}
//                         </span>
//                     </div>
//                     <div className="space-y-2">
//                         {items.map(b => <BookingCard key={b.id} booking={b} />)}
//                     </div>
//                 </section>
//             );
//         });

//     return (
//         <div className="max-w-2xl mx-auto p-4 pt-8 pb-28 space-y-5 animate-in fade-in duration-500" dir="rtl">

//             {/* Header */}
//             <header className="flex items-center gap-3">
//                 <div className="p-2.5 bg-primary/10 rounded-2xl border border-primary/20">
//                     <ClipboardList className="h-5 w-5 text-primary" />
//                 </div>
//                 <div>
//                     <h1 className="font-black text-xl tracking-tight text-foreground">إدارة الحجوزات</h1>
//                     <p className="text-[10px] text-muted-foreground font-bold">
//                         {all.length} حجز إجمالي · {totalActive} نشط
//                     </p>
//                 </div>
//             </header>

//             {/* بحث */}
//             <div className="relative">
//                 <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                 <input
//                     value={search}
//                     onChange={e => setSearch(e.target.value)}
//                     placeholder="ابحث باسم المسافر أو رقم السند..."
//                     className="w-full h-11 bg-card/60 border border-white/10 rounded-2xl pr-10 pl-4 text-sm font-bold placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 transition-colors"
//                 />
//             </div>

//             {/* تابز */}
//             {!search && (
//                 <div className="grid grid-cols-3 gap-1 bg-card/40 border border-white/5 rounded-2xl p-1">
//                     {[
//                         { id: 'active', label: 'النشطة', count: totalActive },
//                         { id: 'done', label: 'المنتهية', count: completed.length + cancelled.length },
//                         { id: 'all', label: 'الكل', count: all.length },
//                     ].map(tab => (
//                         <button
//                             key={tab.id}
//                             onClick={() => setActiveTab(tab.id as any)}
//                             className={cn(
//                                 'h-9 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5',
//                                 activeTab === tab.id
//                                     ? 'bg-primary text-black shadow-sm'
//                                     : 'text-muted-foreground hover:text-foreground'
//                             )}
//                         >
//                             {tab.label}
//                             <span className={cn(
//                                 'text-[9px] font-black px-1 rounded-full',
//                                 activeTab === tab.id ? 'bg-black/20 text-black' : 'bg-white/5'
//                             )}>
//                                 {tab.count}
//                             </span>
//                         </button>
//                     ))}
//                 </div>
//             )}

//             {/* المحتوى */}
//             {search ? (
//                 // نتائج البحث
//                 <div className="space-y-2">
//                     {filteredAll.length === 0
//                         ? <p className="text-center text-xs text-muted-foreground py-10">لا توجد نتائج</p>
//                         : filteredAll.map(b => <BookingCard key={b.id} booking={b} />)
//                     }
//                 </div>
//             ) : activeTab === 'active' ? (
//                 <div className="space-y-6">{renderSections(activeSections)}</div>
//             ) : activeTab === 'done' ? (
//                 <div className="space-y-6">{renderSections(doneSections)}</div>
//             ) : (
//                 <div className="space-y-6">{renderSections([...activeSections, ...doneSections])}</div>
//             )}

//             {all.length === 0 && (
//                 <div className="text-center py-16 text-muted-foreground text-sm font-bold border-2 border-dashed border-white/5 rounded-3xl">
//                     <ClipboardList className="h-10 w-10 mx-auto mb-3 opacity-20" />
//                     لا توجد حجوزات بعد
//                 </div>
//             )}
//         </div>
//     );
// }
'use client';

/**
 * @page AgentBookingsManagement
 * @description إدارة الحجوزات — كل حجوزات الوكيل من أول لآخر
 */

import { useState, useMemo, useRef } from 'react';
import { useAgentBookings } from '@/hooks/use-agent-bookings';
import { useFirestore, useMemoFirebase, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from '@/i18n/routing';
import {
    ClipboardList, Clock, CreditCard, CheckCircle2,
    Flag, XCircle, ChevronDown, ChevronUp, User,
    MapPin, Calendar, Banknote, ArrowRight, Search
} from 'lucide-react';
import { getCityName } from '@/lib/constants';
import { useLocale } from 'next-intl';
import { formatDate } from '@/lib/formatters';
import type { Booking } from '@/lib/data';
import { cn } from '@/lib/utils';

// ══════════════════════════════════════════
// تعريف الحالات وألوانها ونصوصها
// ══════════════════════════════════════════
const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
    'Pending-Carrier-Confirmation': { label: 'بانتظار الناقل', color: 'bg-orange-500/15 text-orange-400 border-orange-500/30', icon: Clock },
    'Pending-Payment': { label: 'بانتظار الدفع', color: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30', icon: CreditCard },
    'Pending-Payment-Verification': { label: 'دفع — بانتظار الختم', color: 'bg-blue-500/15 text-blue-400 border-blue-500/30', icon: CreditCard },
    'Confirmed': { label: 'مؤكد', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', icon: CheckCircle2 },
    'Completed': { label: 'مكتملة', color: 'bg-primary/15 text-primary border-primary/30', icon: Flag },
    'Rated': { label: 'مكتملة', color: 'bg-primary/15 text-primary border-primary/30', icon: Flag },
    'Cancelled': { label: 'ملغاة', color: 'bg-red-500/15 text-red-400 border-red-500/30', icon: XCircle },
};

const SECTIONS = [
    { key: 'pendingConfirmation', label: 'بانتظار الناقل', headerColor: 'text-orange-400', dotColor: 'bg-orange-400' },
    { key: 'pendingPayment', label: 'بانتظار الدفع', headerColor: 'text-yellow-400', dotColor: 'bg-yellow-400' },
    { key: 'pendingVerification', label: 'دفع — بانتظار الختم', headerColor: 'text-blue-400', dotColor: 'bg-blue-400 animate-pulse' },
    { key: 'confirmed', label: 'مؤكدة', headerColor: 'text-emerald-400', dotColor: 'bg-emerald-400' },
    { key: 'completed', label: 'مكتملة', headerColor: 'text-primary', dotColor: 'bg-primary' },
    { key: 'cancelled', label: 'ملغاة', headerColor: 'text-red-400', dotColor: 'bg-red-400' },
] as const;

// ══════════════════════════════════════════
// كارت حجز واحد
// ══════════════════════════════════════════
function BookingCard({ booking }: { booking: Booking }) {
    const [expanded, setExpanded] = useState(false);
    const locale = useLocale();
    const firestore = useFirestore();

    const tripDocRef = useMemoFirebase(() =>
        firestore && booking.tripId ? doc(firestore, 'trips', booking.tripId) : null,
        [firestore, booking.tripId]
    );
    const { data: trip } = useDoc<any>(tripDocRef);

    const lastTrip = useRef<any>(null);
    if (trip) lastTrip.current = trip;
    const tripData = trip ?? lastTrip.current;

    const cfg = STATUS_CONFIG[booking.status] || STATUS_CONFIG['Confirmed'];
    const StatusIcon = cfg.icon;

    const passengerName = booking.passengersDetails?.[0]?.name
        || (tripData?.passengerName)
        || 'مسافر';

    const origin = tripData ? getCityName(tripData.origin, locale) : '—';
    const destination = tripData ? getCityName(tripData.destination, locale) : '—';
    const date = tripData?.departureDate
        ? formatDate(tripData.departureDate, 'dd/MM/yyyy', locale)
        : '—';

    return (
        <div className={cn(
            'rounded-2xl border transition-all duration-300',
            'bg-card/60 backdrop-blur-sm',
            expanded ? 'border-primary/30 shadow-[0_0_20px_rgba(var(--primary-rgb),0.08)]' : 'border-white/5 hover:border-white/10'
        )}>
            {/* رأس الكارت */}
            <button
                onClick={() => setExpanded(e => !e)}
                className="w-full flex items-center justify-between p-4 text-right"
            >
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                        <p className="font-black text-sm text-foreground">{passengerName}</p>
                        <p className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 mt-0.5">
                            {destination} <ArrowRight className="h-2.5 w-2.5" /> {origin}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Badge className={cn('text-[9px] font-black border gap-1 px-2 h-5', cfg.color)}>
                        <StatusIcon className="h-2.5 w-2.5" />
                        {cfg.label}
                    </Badge>
                    {expanded
                        ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </div>
            </button>

            {/* تفاصيل موسّعة */}
            {expanded && (
                <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-muted/30 rounded-xl p-3 space-y-1">
                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">المقاعد</p>
                            <p className="font-black text-foreground">{booking.seats} مقعد</p>
                        </div>
                        <div className="bg-muted/30 rounded-xl p-3 space-y-1">
                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">السعر الكلي</p>
                            <p className="font-black text-foreground flex items-center gap-1">
                                <Banknote className="h-3 w-3 text-emerald-400" />
                                {booking.totalPrice} {booking.currency}
                            </p>
                        </div>
                        <div className="bg-muted/30 rounded-xl p-3 space-y-1">
                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">تاريخ المغادرة</p>
                            <p className="font-black text-foreground flex items-center gap-1">
                                <Calendar className="h-3 w-3 text-primary" />
                                {date}
                            </p>
                        </div>
                        <div className="bg-muted/30 rounded-xl p-3 space-y-1">
                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">نقطة الالتقاء</p>
                            <p className="font-black text-foreground flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-red-400" />
                                {tripData?.meetingPoint || '—'}
                            </p>
                        </div>
                    </div>

                    {/* المسافرون */}
                    {booking.passengersDetails && booking.passengersDetails.length > 0 && (
                        <div className="bg-muted/20 rounded-xl p-3 space-y-1.5">
                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-2">المسافرون</p>
                            {booking.passengersDetails.map((p, i) => (
                                <div key={i} className="flex items-center justify-between text-[11px]">
                                    {/* <span className="font-bold text-foreground">{p.name}</span> */}
                                    <span className="font-bold text-foreground">{typeof p === 'string' ? p : p?.name || '—'}</span>
                                    <span className="font-mono text-muted-foreground text-[9px]">{typeof p === 'string' ? '' : p?.documentNumber || '—'}</span>
                                    {/* <span className="font-mono text-muted-foreground text-[9px]">{p.documentNumber}</span> */}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* رقم السند */}
                    {booking.depositVoucherId && (
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-center">
                            <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">رقم سند الدفع</p>
                            <p className="font-mono font-black text-blue-300 text-sm tracking-widest">{booking.depositVoucherId}</p>
                        </div>
                    )}

                    {/* رابط التذكرة */}
                    <Link
                        href={`/ticket/${booking.tripId}`}
                        className="flex items-center justify-center gap-2 w-full h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-black hover:bg-primary/20 transition-colors"
                    >
                        عرض التذكرة الكاملة <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
            )}
        </div>
    );
}

// ══════════════════════════════════════════
// الصفحة الرئيسية
// ══════════════════════════════════════════
export default function AgentBookingsPage() {
    const {
        pendingConfirmation, pendingPayment, pendingVerification,
        confirmed, completed, cancelled, all, isLoading
    } = useAgentBookings();

    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState<'all' | 'active' | 'done'>('active');

    const dataMap = {
        pendingConfirmation, pendingPayment, pendingVerification,
        confirmed, completed, cancelled,
    };

    // فلتر البحث
    const filteredAll = useMemo(() => {
        if (!search.trim()) return all;
        const q = search.toLowerCase();
        return all.filter(b =>
            b.passengersDetails?.some(p => p.name.toLowerCase().includes(q)) ||
            b.depositVoucherId?.toLowerCase().includes(q) ||
            b.id.toLowerCase().includes(q)
        );
    }, [all, search]);

    const activeSections = SECTIONS.filter(s =>
        ['pendingConfirmation', 'pendingPayment', 'pendingVerification', 'confirmed'].includes(s.key)
    );
    const doneSections = SECTIONS.filter(s =>
        ['completed', 'cancelled'].includes(s.key)
    );

    const totalActive = pendingConfirmation.length + pendingPayment.length + pendingVerification.length + confirmed.length;

    if (isLoading) {
        return (
            <div className="max-w-2xl mx-auto p-4 pt-8 pb-28 space-y-4" dir="rtl">
                <Skeleton className="h-10 w-48 rounded-2xl" />
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 rounded-2xl" />)}
            </div>
        );
    }

    const renderSections = (sections: typeof SECTIONS[number][]) =>
        sections.map(section => {
            const items = dataMap[section.key as keyof typeof dataMap] as Booking[];
            if (items.length === 0) return null;
            return (
                <section key={section.key} className="space-y-2">
                    <div className="flex items-center gap-2 px-1">
                        <span className={cn('w-2 h-2 rounded-full', section.dotColor)} />
                        <h2 className={cn('text-xs font-black uppercase tracking-widest', section.headerColor)}>
                            {section.label}
                        </h2>
                        <span className={cn('text-[9px] font-black px-1.5 py-0.5 rounded-full border', section.headerColor,
                            section.dotColor.replace('bg-', 'bg-').replace('animate-pulse', '') + '/10'
                        )}>
                            {items.length}
                        </span>
                    </div>
                    <div className="space-y-2">
                        {items.map(b => <BookingCard key={b.id} booking={b} />)}
                    </div>
                </section>
            );
        });

    return (
        <div className="max-w-2xl mx-auto p-4 pt-8 pb-28 space-y-5 animate-in fade-in duration-500" dir="rtl">

            {/* Header */}
            <header className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-2xl border border-primary/20">
                    <ClipboardList className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <h1 className="font-black text-xl tracking-tight text-foreground">إدارة الحجوزات</h1>
                    <p className="text-[10px] text-muted-foreground font-bold">
                        {all.length} حجز إجمالي · {totalActive} نشط
                    </p>
                </div>
            </header>

            {/* بحث */}
            <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="ابحث باسم المسافر أو رقم السند..."
                    className="w-full h-11 bg-card/60 border border-white/10 rounded-2xl pr-10 pl-4 text-sm font-bold placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 transition-colors"
                />
            </div>

            {/* تابز */}
            {!search && (
                <div className="grid grid-cols-3 gap-1 bg-card/40 border border-white/5 rounded-2xl p-1">
                    {[
                        { id: 'active', label: 'النشطة', count: totalActive },
                        { id: 'done', label: 'المنتهية', count: completed.length + cancelled.length },
                        { id: 'all', label: 'الكل', count: all.length },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={cn(
                                'h-9 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5',
                                activeTab === tab.id
                                    ? 'bg-primary text-black shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                            )}
                        >
                            {tab.label}
                            <span className={cn(
                                'text-[9px] font-black px-1 rounded-full',
                                activeTab === tab.id ? 'bg-black/20 text-black' : 'bg-white/5'
                            )}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>
            )}

            {/* المحتوى */}
            {search ? (
                // نتائج البحث
                <div className="space-y-2">
                    {filteredAll.length === 0
                        ? <p className="text-center text-xs text-muted-foreground py-10">لا توجد نتائج</p>
                        : filteredAll.map(b => <BookingCard key={b.id} booking={b} />)
                    }
                </div>
            ) : activeTab === 'active' ? (
                <div className="space-y-6">{renderSections(activeSections)}</div>
            ) : activeTab === 'done' ? (
                <div className="space-y-6">{renderSections(doneSections)}</div>
            ) : (
                <div className="space-y-6">{renderSections([...activeSections, ...doneSections])}</div>
            )}

            {!isLoading && all.length === 0 && (
                <div className="text-center py-16 text-muted-foreground text-sm font-bold border-2 border-dashed border-white/5 rounded-3xl">
                    <ClipboardList className="h-10 w-10 mx-auto mb-3 opacity-20" />
                    لا توجد حجوزات بعد
                </div>
            )}
        </div>
    );
}