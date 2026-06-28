// 'use client';

// /**
//  * @page AgentBookingsManagement
//  * @description إدارة الحجوزات — كل حجوزات الوكيل من أول لآخر
//  */

// import { useState, useMemo, useRef } from 'react';
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
//     'Confirmed': { label: 'مؤكد', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20', icon: CheckCircle2 },
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
// function BookingCard({ booking, showCarrier }: { booking: Booking; showCarrier?: boolean }) {
//     const [expanded, setExpanded] = useState(false);
//     const locale = useLocale();
//     const firestore = useFirestore();

//     const tripDocRef = useMemoFirebase(() =>
//         firestore && booking.tripId ? doc(firestore, 'trips', booking.tripId) : null,
//         [firestore, booking.tripId]
//     );
//     const { data: trip } = useDoc<any>(tripDocRef);

//     const lastTrip = useRef<any>(null);
//     if (trip) lastTrip.current = trip;
//     const tripData = trip ?? lastTrip.current;

//     // [FIX]: لحد ما الناقل يأكد نقطة النهاية فعلياً (أو لحد ما الفنكشن تتنشر)،
//     // الحجز المؤكد اللي خلصت مدة رحلته بصرياً لازم يبان "منتهية" مش "مؤكد"،
//     // حتى لو status الحقيقي في القاعدة لسه Confirmed.
//     const isDurationElapsedAwaitingConfirm = useMemo(() => {
//         if (booking.status !== 'Confirmed') return false;
//         if (!tripData?.departureDate) return false;
//         const depDate = (tripData.departureDate as any)?.toDate?.() || new Date(tripData.departureDate as any);
//         const durationHours = tripData.estimatedDurationHours || 0;
//         if (!durationHours) return false;
//         const arrivalDate = new Date(depDate.getTime() + durationHours * 3600000);
//         return arrivalDate < new Date();
//     }, [booking.status, tripData?.departureDate, tripData?.estimatedDurationHours]);

//     const cfg = isDurationElapsedAwaitingConfirm
//         ? { ...STATUS_CONFIG['Completed'], label: 'منتهية' }
//         : (STATUS_CONFIG[booking.status] || STATUS_CONFIG['Confirmed']);
//     const StatusIcon = cfg.icon;

//     const passengerName = booking.passengersDetails?.[0]?.name
//         || (tripData?.passengerName)
//         || 'مسافر';

//     const origin = tripData ? getCityName(tripData.origin, locale) : '—';
//     const destination = tripData ? getCityName(tripData.destination, locale) : '—';
//     const date = tripData?.departureDate
//         ? formatDate(tripData.departureDate, 'dd/MM/yyyy', locale)
//         : '—';

//     return (
//         <div className={cn(
//             'rounded-2xl border border-[#BEAD77] transition-all duration-300',
//             'bg-card/60 backdrop-blur-sm',
//             expanded ? 'border-[#BEAD77] shadow-[0_0_20px_rgba(var(--primary-rgb),0.08)]' : 'border-[#BEAD77] '
//         )}>
//             {/* رأس الكارت */}
//             <button
//                 onClick={() => setExpanded(e => !e)}
//                 className="w-full flex items-center justify-between p-4 text-right "
//             >
//                 <div className="flex items-center gap-3">
//                     <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
//                         <User className="h-4 w-4 text-primary" />
//                     </div>
//                     <div>
//                         <p className="font-black text-sm text-foreground">{passengerName}</p>
//                         <p className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 mt-0.5">
//                             {showCarrier && tripData?.carrierName
//                                 ? <>الناقل: {tripData.carrierName}</>
//                                 : <>{destination} <ArrowRight className="h-2.5 w-2.5" /> {origin}</>}
//                         </p>
//                     </div>
//                 </div>
//                 <div className="flex items-center gap-2">
//                     <Badge className={cn('text-xs font-black border gap-1 px-2 h-5 bg-white', cfg.color)}>
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
//                 <div className="px-4 pb-4 space-y-3 border-t border-[#BEAD77] pt-3 animate-in fade-in slide-in-from-top-2 duration-200">
//                     <div className="grid grid-cols-2 gap-2 text-xs">
//                         <div className="bg-muted/30 border border-[#BEAD77] rounded-xl p-3 space-y-1">
//                             <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">المقاعد</p>
//                             <p className="font-black  text-foreground">{booking.seats} مقعد</p>
//                         </div>
//                         <div className="bg-muted/30 border border-[#BEAD77] rounded-xl p-3 space-y-1">
//                             <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">السعر الكلي</p>
//                             <p className="font-black text-foreground flex items-center gap-1">
//                                 <Banknote className="h-3 w-3 text-emerald-400" />
//                                 {booking.totalPrice} {booking.currency}
//                             </p>
//                         </div>
//                         <div className="bg-muted/30 border border-[#BEAD77] rounded-xl p-3 space-y-1">
//                             <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">تاريخ المغادرة</p>
//                             <p className="font-black text-foreground flex items-center gap-1">
//                                 <Calendar className="h-3 w-3 text-primary" />
//                                 {date}
//                             </p>
//                         </div>
//                         <div className="bg-muted/30 border border-[#BEAD77] rounded-xl p-3 space-y-1">
//                             <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">نقطة الالتقاء</p>
//                             <p className="font-black text-foreground flex items-center gap-1">
//                                 <MapPin className="h-3 w-3 text-red-400" />
//                                 {tripData?.meetingPoint || '—'}
//                             </p>
//                         </div>
//                     </div>

//                     {/* الناقل */}
//                     {tripData?.carrierName && (
//                         <div className="bg-muted/30 border border-[#BEAD77] rounded-xl p-3 space-y-1">
//                             <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">الناقل</p>
//                             <p className="font-black text-foreground flex items-center gap-1">
//                                 <ClipboardList className="h-3 w-3 text-primary" />
//                                 {tripData.carrierName}
//                             </p>
//                         </div>
//                     )}

//                     {/* رسوم الوزن الزائد */}
//                     {tripData?.excessWeightFee != null && tripData.excessWeightFee > 0 && (
//                         <div className="flex justify-between items-center bg-orange-950/40 border border-[#AE9E6D] rounded-xl px-3 py-2.5">
//                             <span className="flex items-center gap-1.5 text-orange-400 text-xs font-bold">
//                                 ⚖️ رسوم الوزن الزائد
//                             </span>
//                             <span className="text-orange-300 font-mono text-xs font-bold">
//                                 {tripData.excessWeightFee} {tripData.currency || 'د.أ'} / كغ
//                             </span>
//                         </div>
//                     )}

//                     {/* شروط الناقل */}
//                     {tripData?.conditions && (
//                         <div className="bg-yellow-950/40 border border-[#AE9E6D] rounded-xl px-3 py-2.5 space-y-1">
//                             <span className="flex items-center gap-1.5 text-yellow-400 text-xs font-black">
//                                 ⚠️ شروط الناقل
//                             </span>
//                             <p className="text-yellow-200 text-xs font-semibold whitespace-pre-wrap leading-relaxed">
//                                 {tripData.conditions}
//                             </p>
//                         </div>
//                     )}

//                     {/* المسافرون */}
//                     {booking.passengersDetails && booking.passengersDetails.length > 0 && (
//                         <div className="bg-muted/20 border border-[#BEAD77] rounded-xl p-3 space-y-1.5">
//                             <p className="text-sm font-black text-muted-foreground uppercase tracking-widest mb-2">المسافرون</p>
//                             {booking.passengersDetails.map((p, i) => (
//                                 <div key={i} className="flex items-center justify-between text-[11px]">
//                                     {/* <span className="font-bold text-foreground">{p.name}</span> */}
//                                     <span className="font-bold text-xs text-foreground">{typeof p === 'string' ? p : p?.name || '—'}</span>
//                                     <span className="font-mono text-muted-foreground text-xs">{typeof p === 'string' ? '' : p?.documentNumber || '—'}</span>
//                                     {/* <span className="font-mono text-muted-foreground text-[9px]">{p.documentNumber}</span> */}
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
//                         className="flex items-center justify-center gap-2 w-full h-10 rounded-xl bg-primary/10 border border-[#BEAD77] text-primary text-xs font-black hover:bg-primary/20 transition-colors"
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
//         confirmed, completed, cancelled, all, isLoading, tripsMap
//     } = useAgentBookings();

//     const [search, setSearch] = useState('');
//     const [searchType, setSearchType] = useState<'passenger' | 'carrier'>('passenger');
//     const [activeTab, setActiveTab] = useState<'all' | 'active' | 'done'>('active');

//     // [FIX]: لحد ما confirmArrivalSovereign تتنشر فعلياً، الناقل ممكن يتأخر
//     // يأكد نقطة النهاية حتى لو مدة الرحلة خلصت من زمان. نحسب ده محلياً من
//     // بيانات الرحلة (تاريخ الانطلاق + المدة المقدّرة) ونعرض الحجز في
//     // "المنتهية" بصرياً، من غير ما نغيّر status الحجز الحقيقي في القاعدة.
//     const isTripDurationElapsed = (tripId: string) => {
//         const trip = tripsMap[tripId];
//         if (!trip?.departureDate) return false;
//         const depDate = (trip.departureDate as any)?.toDate?.() || new Date(trip.departureDate as any);
//         const durationHours = (trip as any).estimatedDurationHours || 0;
//         if (!durationHours) return false;
//         const arrivalDate = new Date(depDate.getTime() + durationHours * 3600000);
//         return arrivalDate < new Date();
//     };

//     const { confirmedActive, confirmedElapsed } = useMemo(() => {
//         const active: typeof confirmed = [];
//         const elapsed: typeof confirmed = [];
//         confirmed.forEach(b => {
//             if (isTripDurationElapsed(b.tripId)) elapsed.push(b);
//             else active.push(b);
//         });
//         return { confirmedActive: active, confirmedElapsed: elapsed };
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [confirmed, tripsMap]);

//     // displayCompleted بتضم المكتملة فعلياً + المؤكدة اللي خلصت مدتها وبانتظار تأكيد الناقل
//     const displayCompleted = useMemo(() => [...confirmedElapsed, ...completed], [confirmedElapsed, completed]);

//     const dataMap = {
//         pendingConfirmation, pendingPayment, pendingVerification,
//         confirmed: confirmedActive, completed: displayCompleted, cancelled,
//     };

//     // فلتر البحث
//     const filteredAll = useMemo(() => {
//         if (!search.trim()) return all;
//         const q = search.toLowerCase();

//         if (searchType === 'carrier') {
//             return all.filter(b => {
//                 const trip = tripsMap[b.tripId];
//                 return trip?.carrierName?.toLowerCase().includes(q);
//             });
//         }

//         return all.filter(b =>
//             b.passengersDetails?.some(p => (typeof p === 'string' ? p : p?.name)?.toLowerCase().includes(q)) ||
//             b.depositVoucherId?.toLowerCase().includes(q) ||
//             b.id.toLowerCase().includes(q)
//         );
//     }, [all, search, searchType, tripsMap]);

//     const activeSections = SECTIONS.filter(s =>
//         ['pendingConfirmation', 'pendingPayment', 'pendingVerification', 'confirmed'].includes(s.key)
//     );
//     const doneSections = SECTIONS.filter(s =>
//         ['completed', 'cancelled'].includes(s.key)
//     );

//     const totalActive = pendingConfirmation.length + pendingPayment.length + pendingVerification.length + confirmedActive.length;

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
//                 <section key={section.key} className="space-y-2 ">
//                     <div className="flex items-center gap-2 px-1 ">
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
//                     <div className="space-y-2 ">
//                         {items.map(b => <BookingCard key={b.id} booking={b} />)}
//                     </div>
//                 </section>
//             );
//         });

//     return (
//         <div className="max-w-7xl mx-auto p-4 pt-8 pb-28 space-y-5 animate-in fade-in duration-500" dir="rtl">

//             {/* Header */}
//             <header className="flex items-center gap-3">
//                 <div className="p-2.5 bg-primary/10 rounded-2xl border border-primary/20">
//                     <ClipboardList className="h-5 w-5 text-primary" />
//                 </div>
//                 <div>
//                     <h1 className="font-black text-xl tracking-tight text-foreground">إدارة الحجوزات</h1>
//                     {/* <p className="text-[10px] text-muted-foreground font-bold">
//                         {all.length} حجز إجمالي · {totalActive} نشط
//                     </p> */}
//                 </div>
//             </header>

//             {/* نوع البحث */}
//             <div className="grid grid-cols-2 gap-1 bg-card/40 border border-[#BEAD77] rounded-2xl p-1">
//                 {[
//                     { id: 'passenger', label: 'بحث باسم المسافر', icon: User },
//                     { id: 'carrier', label: 'بحث باسم الناقل', icon: ClipboardList },
//                 ].map(opt => (
//                     <button
//                         key={opt.id}
//                         onClick={() => setSearchType(opt.id as 'passenger' | 'carrier')}
//                         className={cn(
//                             'h-9 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5',
//                             searchType === opt.id
//                                 ? 'bg-primary text-black shadow-sm'
//                                 : 'text-muted-foreground hover:text-foreground'
//                         )}
//                     >
//                         <opt.icon className="h-3.5 w-3.5" />
//                         {opt.label}
//                     </button>
//                 ))}
//             </div>

//             {/* بحث */}
//             <div className="relative">
//                 <Search className="absolute right-3 top-1/2  -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                 <input
//                     value={search}
//                     onChange={e => setSearch(e.target.value)}
//                     placeholder={searchType === 'carrier' ? 'ابحث باسم الناقل...' : 'ابحث باسم المسافر أو رقم السند...'}
//                     className="w-full h-11 bg-card/60 border-[#BEAD77] rounded-2xl pr-10 pl-4 text-sm font-bold placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 transition-colors"
//                 />
//             </div>

//             {/* تابز */}
//             {!search && (
//                 <div className="grid grid-cols-3 gap-1 bg-card/40 border border-[#BEAD77] rounded-2xl p-1">
//                     {[
//                         { id: 'active', label: 'النشطة', count: totalActive },
//                         { id: 'done', label: 'المنتهية', count: displayCompleted.length + cancelled.length },
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
//                         : filteredAll.map(b => <BookingCard key={b.id} booking={b} showCarrier={searchType === 'carrier'} />)
//                     }
//                 </div>
//             ) : activeTab === 'active' ? (
//                 <div className="space-y-6">{renderSections(activeSections)}</div>
//             ) : activeTab === 'done' ? (
//                 <div className="space-y-6">{renderSections(doneSections)}</div>
//             ) : (
//                 <div className="space-y-6">{renderSections([...activeSections, ...doneSections])}</div>
//             )}

//             {!isLoading && all.length === 0 && (
//                 <div className="text-center py-16 text-muted-foreground text-sm font-bold border-2 border-dashed border-[#BEAD77] rounded-3xl">
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
import { useLocale, useTranslations } from 'next-intl';
import { formatDate } from '@/lib/formatters';
import type { Booking } from '@/lib/data';
import { cn } from '@/lib/utils';

// ══════════════════════════════════════════
// كارت حجز واحد
// ══════════════════════════════════════════
function BookingCard({ booking, showCarrier }: { booking: Booking; showCarrier?: boolean }) {
    const [expanded, setExpanded] = useState(false);
    const locale = useLocale();
    const t = useTranslations('AgentBookingsPage');
    const firestore = useFirestore();

    const STATUS_CONFIG: Record<string, { labelKey: string; color: string; icon: React.ElementType }> = {
        'Pending-Carrier-Confirmation': { labelKey: 'status_pending_carrier', color: 'bg-orange-500/15 text-orange-400 border-orange-500/30', icon: Clock },
        'Pending-Payment': { labelKey: 'status_pending_payment', color: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30', icon: CreditCard },
        'Pending-Payment-Verification': { labelKey: 'status_pending_verification', color: 'bg-blue-500/15 text-blue-400 border-blue-500/30', icon: CreditCard },
        'Confirmed': { labelKey: 'status_confirmed', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20', icon: CheckCircle2 },
        'Completed': { labelKey: 'status_completed', color: 'bg-primary/15 text-primary border-primary/30', icon: Flag },
        'Rated': { labelKey: 'status_rated', color: 'bg-primary/15 text-primary border-primary/30', icon: Flag },
        'Cancelled': { labelKey: 'status_cancelled', color: 'bg-red-500/15 text-red-400 border-red-500/30', icon: XCircle },
    };

    const tripDocRef = useMemoFirebase(() =>
        firestore && booking.tripId ? doc(firestore, 'trips', booking.tripId) : null,
        [firestore, booking.tripId]
    );
    const { data: trip } = useDoc<any>(tripDocRef);

    const lastTrip = useRef<any>(null);
    if (trip) lastTrip.current = trip;
    const tripData = trip ?? lastTrip.current;

    const isDurationElapsedAwaitingConfirm = useMemo(() => {
        if (booking.status !== 'Confirmed') return false;
        if (!tripData?.departureDate) return false;
        const depDate = (tripData.departureDate as any)?.toDate?.() || new Date(tripData.departureDate as any);
        const durationHours = tripData.estimatedDurationHours || 0;
        if (!durationHours) return false;
        const arrivalDate = new Date(depDate.getTime() + durationHours * 3600000);
        return arrivalDate < new Date();
    }, [booking.status, tripData?.departureDate, tripData?.estimatedDurationHours]);

    const cfgBase = isDurationElapsedAwaitingConfirm
        ? { ...STATUS_CONFIG['Completed'], labelKey: 'status_elapsed' }
        : (STATUS_CONFIG[booking.status] || STATUS_CONFIG['Confirmed']);

    const StatusIcon = cfgBase.icon;
    const statusLabel = t(cfgBase.labelKey as any);

    const passengerName = booking.passengersDetails?.[0]?.name
        || (tripData?.passengerName)
        || t('default_passenger');

    const origin = tripData ? getCityName(tripData.origin, locale) : '—';
    const destination = tripData ? getCityName(tripData.destination, locale) : '—';
    const date = tripData?.departureDate
        ? formatDate(tripData.departureDate, 'dd/MM/yyyy', locale)
        : '—';

    return (
        <div className={cn(
            'rounded-2xl border border-[#BEAD77] transition-all duration-300',
            'bg-card/60 backdrop-blur-sm',
            expanded ? 'border-[#BEAD77] shadow-[0_0_20px_rgba(var(--primary-rgb),0.08)]' : 'border-[#BEAD77]'
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
                            {showCarrier && tripData?.carrierName
                                ? t('carrier_prefix', { name: tripData.carrierName })
                                : <>{destination} <ArrowRight className="h-2.5 w-2.5" /> {origin}</>}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Badge className={cn('text-xs font-black border gap-1 px-2 h-5 bg-white', cfgBase.color)}>
                        <StatusIcon className="h-2.5 w-2.5" />
                        {statusLabel}
                    </Badge>
                    {expanded
                        ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </div>
            </button>

            {/* تفاصيل موسّعة */}
            {expanded && (
                <div className="px-4 pb-4 space-y-3 border-t border-[#BEAD77] pt-3 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-muted/30 border border-[#BEAD77] rounded-xl p-3 space-y-1">
                            <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">{t('seats_label')}</p>
                            <p className="font-black text-foreground">{t('seats_value', { count: booking.seats })}</p>
                        </div>
                        <div className="bg-muted/30 border border-[#BEAD77] rounded-xl p-3 space-y-1">
                            <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">{t('total_price_label')}</p>
                            <p className="font-black text-foreground flex items-center gap-1">
                                <Banknote className="h-3 w-3 text-emerald-400" />
                                {booking.totalPrice} {booking.currency}
                            </p>
                        </div>
                        <div className="bg-muted/30 border border-[#BEAD77] rounded-xl p-3 space-y-1">
                            <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">{t('departure_date_label')}</p>
                            <p className="font-black text-foreground flex items-center gap-1">
                                <Calendar className="h-3 w-3 text-primary" />
                                {date}
                            </p>
                        </div>
                        <div className="bg-muted/30 border border-[#BEAD77] rounded-xl p-3 space-y-1">
                            <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">{t('meeting_point_label')}</p>
                            <p className="font-black text-foreground flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-red-400" />
                                {tripData?.meetingPoint || '—'}
                            </p>
                        </div>
                    </div>

                    {/* الناقل */}
                    {tripData?.carrierName && (
                        <div className="bg-muted/30 border border-[#BEAD77] rounded-xl p-3 space-y-1">
                            <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">{t('carrier_label')}</p>
                            <p className="font-black text-foreground flex items-center gap-1">
                                <ClipboardList className="h-3 w-3 text-primary" />
                                {tripData.carrierName}
                            </p>
                        </div>
                    )}

                    {/* رسوم الوزن الزائد */}
                    {tripData?.excessWeightFee != null && tripData.excessWeightFee > 0 && (
                        <div className="flex justify-between items-center bg-orange-950/40 border border-[#AE9E6D] rounded-xl px-3 py-2.5">
                            <span className="flex items-center gap-1.5 text-orange-400 text-xs font-bold">
                                {t('excess_weight_fee')}
                            </span>
                            <span className="text-orange-300 font-mono text-xs font-bold">
                                {t('excess_weight_unit', { fee: tripData.excessWeightFee, currency: tripData.currency || 'د.أ' })}
                            </span>
                        </div>
                    )}

                    {/* شروط الناقل */}
                    {tripData?.conditions && (
                        <div className="bg-yellow-950/40 border border-[#AE9E6D] rounded-xl px-3 py-2.5 space-y-1 flex justify-between">
                            <span className="flex items-center gap-1.5 text-yellow-400 text-xs font-black">
                                {t('carrier_conditions')}
                            </span>
                            <p className="text-yellow-200 text-xs font-semibold whitespace-pre-wrap leading-relaxed">
                                {tripData.conditions}
                            </p>
                        </div>
                    )}

                    {/* المسافرون */}
                    {booking.passengersDetails && booking.passengersDetails.length > 0 && (
                        <div className="bg-muted/20 border border-[#BEAD77] rounded-xl p-3 space-y-1.5">
                            <p className="text-sm font-black text-muted-foreground uppercase tracking-widest mb-2">{t('passengers_label')}</p>
                            {booking.passengersDetails.map((p, i) => (
                                <div key={i} className="flex items-center justify-between text-[11px]">
                                    <span className="font-bold text-xs text-foreground">{typeof p === 'string' ? p : p?.name || '—'}</span>
                                    <span className="font-mono text-muted-foreground text-xs">{typeof p === 'string' ? '' : p?.documentNumber || '—'}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* رقم السند */}
                    {booking.depositVoucherId && (
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-center">
                            <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">{t('voucher_label')}</p>
                            <p className="font-mono font-black text-blue-300 text-sm tracking-widest">{booking.depositVoucherId}</p>
                        </div>
                    )}

                    {/* رابط التذكرة */}
                    <Link
                        href={`/ticket/${booking.tripId}`}
                        className="flex items-center justify-center gap-2 w-full h-10 rounded-xl bg-primary/10 border border-[#BEAD77] text-primary text-xs font-black hover:bg-primary/20 transition-colors"
                    >
                        {t('view_ticket')} <ArrowRight className="h-3.5 w-3.5" />
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
        confirmed, completed, cancelled, all, isLoading, tripsMap
    } = useAgentBookings();

    const t = useTranslations('AgentBookingsPage');
    const [search, setSearch] = useState('');
    const [searchType, setSearchType] = useState<'passenger' | 'carrier'>('passenger');
    const [activeTab, setActiveTab] = useState<'all' | 'active' | 'done'>('active');

    const SECTIONS = [
        { key: 'pendingConfirmation', labelKey: 'section_pending_confirmation', headerColor: 'text-orange-400', dotColor: 'bg-orange-400' },
        { key: 'pendingPayment', labelKey: 'section_pending_payment', headerColor: 'text-yellow-400', dotColor: 'bg-yellow-400' },
        { key: 'pendingVerification', labelKey: 'section_pending_verification', headerColor: 'text-blue-400', dotColor: 'bg-blue-400 animate-pulse' },
        { key: 'confirmed', labelKey: 'section_confirmed', headerColor: 'text-emerald-400', dotColor: 'bg-emerald-400' },
        { key: 'completed', labelKey: 'section_completed', headerColor: 'text-primary', dotColor: 'bg-primary' },
        { key: 'cancelled', labelKey: 'section_cancelled', headerColor: 'text-red-400', dotColor: 'bg-red-400' },
    ] as const;

    const isTripDurationElapsed = (tripId: string) => {
        const trip = tripsMap[tripId];
        if (!trip?.departureDate) return false;
        const depDate = (trip.departureDate as any)?.toDate?.() || new Date(trip.departureDate as any);
        const durationHours = (trip as any).estimatedDurationHours || 0;
        if (!durationHours) return false;
        const arrivalDate = new Date(depDate.getTime() + durationHours * 3600000);
        return arrivalDate < new Date();
    };

    const { confirmedActive, confirmedElapsed } = useMemo(() => {
        const active: typeof confirmed = [];
        const elapsed: typeof confirmed = [];
        confirmed.forEach(b => {
            if (isTripDurationElapsed(b.tripId)) elapsed.push(b);
            else active.push(b);
        });
        return { confirmedActive: active, confirmedElapsed: elapsed };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [confirmed, tripsMap]);

    const displayCompleted = useMemo(() => [...confirmedElapsed, ...completed], [confirmedElapsed, completed]);

    const dataMap = {
        pendingConfirmation, pendingPayment, pendingVerification,
        confirmed: confirmedActive, completed: displayCompleted, cancelled,
    };

    const filteredAll = useMemo(() => {
        if (!search.trim()) return all;
        const q = search.toLowerCase();
        if (searchType === 'carrier') {
            return all.filter(b => {
                const trip = tripsMap[b.tripId];
                return trip?.carrierName?.toLowerCase().includes(q);
            });
        }
        return all.filter(b =>
            b.passengersDetails?.some(p => (typeof p === 'string' ? p : p?.name)?.toLowerCase().includes(q)) ||
            b.depositVoucherId?.toLowerCase().includes(q) ||
            b.id.toLowerCase().includes(q)
        );
    }, [all, search, searchType, tripsMap]);

    const activeSections = SECTIONS.filter(s =>
        ['pendingConfirmation', 'pendingPayment', 'pendingVerification', 'confirmed'].includes(s.key)
    );
    const doneSections = SECTIONS.filter(s =>
        ['completed', 'cancelled'].includes(s.key)
    );

    const totalActive = pendingConfirmation.length + pendingPayment.length + pendingVerification.length + confirmedActive.length;

    if (isLoading) {
        return (
            <div className="max-w-2xl mx-auto p-4 pt-8 pb-28 space-y-4">
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
                            {t(section.labelKey as any)}
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
        <div className="max-w-7xl mx-auto p-4 pt-8 pb-28 space-y-5 animate-in fade-in duration-500">

            {/* Header */}
            <header className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-2xl border border-primary/20">
                    <ClipboardList className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <h1 className="font-black text-xl tracking-tight text-foreground">{t('page_title')}</h1>
                </div>
            </header>

            {/* نوع البحث */}
            <div className="grid grid-cols-2 gap-1 bg-card/40 border border-[#BEAD77] rounded-2xl p-1">
                {[
                    { id: 'passenger', labelKey: 'search_passenger', icon: User },
                    { id: 'carrier', labelKey: 'search_carrier', icon: ClipboardList },
                ].map(opt => (
                    <button
                        key={opt.id}
                        onClick={() => setSearchType(opt.id as 'passenger' | 'carrier')}
                        className={cn(
                            'h-9 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5',
                            searchType === opt.id
                                ? 'bg-primary text-black shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                        )}
                    >
                        <opt.icon className="h-3.5 w-3.5" />
                        {t(opt.labelKey as any)}
                    </button>
                ))}
            </div>

            {/* بحث */}
            <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder={searchType === 'carrier' ? t('search_placeholder_carrier') : t('search_placeholder_passenger')}
                    className="w-full h-11 bg-card/60 border-[#BEAD77] rounded-2xl pr-10 pl-4 text-sm font-bold placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 transition-colors"
                />
            </div>

            {/* تابز */}
            {!search && (
                <div className="grid grid-cols-3 gap-1 bg-card/40 border border-[#BEAD77] rounded-2xl p-1">
                    {[
                        { id: 'active', labelKey: 'tab_active', count: totalActive },
                        { id: 'done', labelKey: 'tab_done', count: displayCompleted.length + cancelled.length },
                        { id: 'all', labelKey: 'tab_all', count: all.length },
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
                            {t(tab.labelKey as any)}
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
                <div className="space-y-2">
                    {filteredAll.length === 0
                        ? <p className="text-center text-xs text-muted-foreground py-10">{t('no_results')}</p>
                        : filteredAll.map(b => <BookingCard key={b.id} booking={b} showCarrier={searchType === 'carrier'} />)
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
                <div className="text-center py-16 text-muted-foreground text-sm font-bold border-2 border-dashed border-[#BEAD77] rounded-3xl">
                    <ClipboardList className="h-10 w-10 mx-auto mb-3 opacity-20" />
                    {t('no_bookings')}
                </div>
            )}
        </div>
    );
}