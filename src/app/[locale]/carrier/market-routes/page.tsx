// // // // // 'use client';

// // // // // import { useMemo, useState } from 'react';
// // // // // import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
// // // // // import { collection, query, where, orderBy } from 'firebase/firestore';
// // // // // import { useTranslations } from 'next-intl';
// // // // // import { useUserProfile } from '@/hooks/use-user-profile';
// // // // // import type { Trip } from '@/lib/data';
// // // // // import { Skeleton } from '@/components/ui/skeleton';
// // // // // import { Badge } from '@/components/ui/badge';
// // // // // import { Button } from '@/components/ui/button';
// // // // // import {
// // // // //     MapPin,
// // // // //     Calendar,
// // // // //     Clock,
// // // // //     Users,
// // // // //     Car,
// // // // //     Bus,
// // // // //     ChevronDown,
// // // // //     ChevronUp,
// // // // //     ArrowLeft,
// // // // //     Route,
// // // // // } from 'lucide-react';
// // // // // import { cn } from '@/lib/utils';

// // // // // // ─── helpers ────────────────────────────────────────────────────────────────
// // // // // function formatDate(raw: any): string {
// // // // //     if (!raw) return '—';
// // // // //     const d = raw?.toDate?.() ?? new Date(raw);
// // // // //     if (isNaN(d.getTime())) return '—';
// // // // //     return d.toLocaleDateString('ar-EG', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
// // // // // }

// // // // // function getVehicleIcon(type?: string) {
// // // // //     if (!type) return <Car className="h-4 w-4" />;
// // // // //     const lower = type.toLowerCase();
// // // // //     if (lower.includes('bus') || lower.includes('حافلة') || lower.includes('باص')) {
// // // // //         return <Bus className="h-4 w-4" />;
// // // // //     }
// // // // //     return <Car className="h-4 w-4" />;
// // // // // }

// // // // // // ─── Trip Card ───────────────────────────────────────────────────────────────
// // // // // function CompetitorTripCard({ trip }: { trip: Trip }) {
// // // // //     const [expanded, setExpanded] = useState(false);

// // // // //     const available = trip.availableSeats ?? (trip.vehicleCapacity ?? 0);
// // // // //     const total = trip.vehicleCapacity ?? available;

// // // // //     const occupancyPct = total > 0 ? Math.round(((total - available) / total) * 100) : 0;
// // // // //     const isFull = available === 0;
// // // // //     const isAlmostFull = !isFull && available <= 2;

// // // // //     return (
// // // // //         <div className={cn(
// // // // //             'rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md overflow-hidden',
// // // // //             isFull && 'opacity-60'
// // // // //         )}>
// // // // //             {/* Header bar */}
// // // // //             <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/40">
// // // // //                 <div className="flex items-center gap-2 text-sm font-semibold">
// // // // //                     <MapPin className="h-4 w-4 text-primary shrink-0" />
// // // // //                     <span>{trip.origin}</span>
// // // // //                     <ArrowRight className="h-3 w-3 text-muted-foreground" />
// // // // //                     <span>{trip.destination}</span>
// // // // //                 </div>
// // // // //                 <div className="flex items-center gap-2">
// // // // //                     {isFull ? (
// // // // //                         <Badge variant="destructive" className="text-[10px]">مكتملة</Badge>
// // // // //                     ) : isAlmostFull ? (
// // // // //                         <Badge className="text-[10px] bg-orange-500 hover:bg-orange-500/90">أوشكت تكتمل</Badge>
// // // // //                     ) : (
// // // // //                         <Badge variant="secondary" className="text-[10px]">متاحة</Badge>
// // // // //                     )}
// // // // //                 </div>
// // // // //             </div>

// // // // //             {/* Body */}
// // // // //             <div className="px-4 py-3 space-y-3">
// // // // //                 {/* Carrier name + vehicle */}
// // // // //                 <div className="flex items-center justify-between">
// // // // //                     <div className="flex items-center gap-2 text-sm">
// // // // //                         {getVehicleIcon(trip.vehicleType)}
// // // // //                         <span className="font-medium">{trip.carrierName ?? 'ناقل'}</span>
// // // // //                         {trip.vehicleType && (
// // // // //                             <span className="text-muted-foreground text-xs">· {trip.vehicleType}</span>
// // // // //                         )}
// // // // //                     </div>
// // // // //                     {trip.price != null && (
// // // // //                         <span className="text-sm font-bold text-primary">
// // // // //                             {trip.price} {trip.currency ?? 'د.أ'}
// // // // //                         </span>
// // // // //                     )}
// // // // //                 </div>

// // // // //                 {/* Date / time */}
// // // // //                 <div className="flex items-center gap-4 text-xs text-muted-foreground">
// // // // //                     <span className="flex items-center gap-1">
// // // // //                         <Calendar className="h-3.5 w-3.5" />
// // // // //                         {formatDate(trip.departureDate)}
// // // // //                     </span>
// // // // //                     {trip.departureTime && (
// // // // //                         <span className="flex items-center gap-1">
// // // // //                             <Clock className="h-3.5 w-3.5" />
// // // // //                             {trip.departureTime}
// // // // //                         </span>
// // // // //                     )}
// // // // //                 </div>

// // // // //                 {/* Seats bar */}
// // // // //                 <div className="space-y-1">
// // // // //                     <div className="flex items-center justify-between text-xs">
// // // // //                         <span className="flex items-center gap-1 text-muted-foreground">
// // // // //                             <Users className="h-3.5 w-3.5" />
// // // // //                             المقاعد المتبقية
// // // // //                         </span>
// // // // //                         <span className={cn(
// // // // //                             'font-bold',
// // // // //                             isFull ? 'text-destructive' : isAlmostFull ? 'text-orange-500' : 'text-green-600'
// // // // //                         )}>
// // // // //                             {available} / {total}
// // // // //                         </span>
// // // // //                     </div>
// // // // //                     <div className="h-2 rounded-full bg-muted overflow-hidden">
// // // // //                         <div
// // // // //                             className={cn(
// // // // //                                 'h-full rounded-full transition-all',
// // // // //                                 isFull ? 'bg-destructive' : isAlmostFull ? 'bg-orange-500' : 'bg-green-500'
// // // // //                             )}
// // // // //                             style={{ width: `${occupancyPct}%` }}
// // // // //                         />
// // // // //                     </div>
// // // // //                 </div>

// // // // //                 {/* Toggle details */}
// // // // //                 <Button
// // // // //                     variant="ghost"
// // // // //                     size="sm"
// // // // //                     className="w-full h-7 text-xs text-muted-foreground"
// // // // //                     onClick={() => setExpanded(p => !p)}
// // // // //                 >
// // // // //                     {expanded ? (
// // // // //                         <><ChevronUp className="h-3 w-3 ml-1" /> إخفاء التفاصيل</>
// // // // //                     ) : (
// // // // //                         <><ChevronDown className="h-3 w-3 ml-1" /> عرض التفاصيل</>
// // // // //                     )}
// // // // //                 </Button>

// // // // //                 {expanded && (
// // // // //                     <div className="text-xs text-muted-foreground space-y-1 border-t pt-2">
// // // // //                         {trip.meetingPoint && (
// // // // //                             <div className="flex gap-2"><span className="font-medium">نقطة الالتقاء:</span><span>{trip.meetingPoint}</span></div>
// // // // //                         )}
// // // // //                         {trip.numberOfStops != null && (
// // // // //                             <div className="flex gap-2"><span className="font-medium">عدد المحطات:</span><span>{trip.numberOfStops}</span></div>
// // // // //                         )}
// // // // //                         {trip.bagsPerSeat != null && (
// // // // //                             <div className="flex gap-2"><span className="font-medium">حقائب / مقعد:</span><span>{trip.bagsPerSeat}</span></div>
// // // // //                         )}
// // // // //                         {trip.estimatedDurationHours != null && (
// // // // //                             <div className="flex gap-2"><span className="font-medium">مدة الرحلة:</span><span>{trip.estimatedDurationHours} ساعة</span></div>
// // // // //                         )}
// // // // //                         {trip.depositPercentage != null && (
// // // // //                             <div className="flex gap-2"><span className="font-medium">نسبة العربون:</span><span>{trip.depositPercentage}%</span></div>
// // // // //                         )}
// // // // //                         {trip.conditions && (
// // // // //                             <div className="flex gap-2"><span className="font-medium">الشروط:</span><span className="break-words">{trip.conditions}</span></div>
// // // // //                         )}
// // // // //                     </div>
// // // // //                 )}
// // // // //             </div>
// // // // //         </div>
// // // // //     );
// // // // // }

// // // // // // ─── Route Group ────────────────────────────────────────────────────────────
// // // // // function RouteGroup({ origin, destination, trips }: { origin: string; destination: string; trips: Trip[] }) {
// // // // //     const [open, setOpen] = useState(true);

// // // // //     const totalSeats = trips.reduce((s, t) => s + (t.availableSeats ?? t.vehicleCapacity ?? 0), 0);
// // // // //     const totalTrips = trips.length;

// // // // //     return (
// // // // //         <div className="rounded-2xl border bg-background shadow-sm overflow-hidden">
// // // // //             {/* Group header */}
// // // // //             <button
// // // // //                 className="w-full flex items-center justify-between px-4 py-3 bg-primary/5 hover:bg-primary/10 transition-colors"
// // // // //                 onClick={() => setOpen(p => !p)}
// // // // //             >
// // // // //                 <div className="flex items-center gap-2 font-semibold text-sm">
// // // // //                     <Route className="h-4 w-4 text-primary" />
// // // // //                     <span>{origin}</span>
// // // // //                     <ArrowRight className="h-3 w-3 text-muted-foreground" />
// // // // //                     <span>{destination}</span>
// // // // //                 </div>
// // // // //                 <div className="flex items-center gap-3 text-xs text-muted-foreground">
// // // // //                     <span>{totalTrips} رحلة · {totalSeats} مقعد متاح</span>
// // // // //                     {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
// // // // //                 </div>
// // // // //             </button>

// // // // //             {open && (
// // // // //                 <div className="p-3 space-y-3">
// // // // //                     {trips.map(trip => (
// // // // //                         <CompetitorTripCard key={trip.id} trip={trip} />
// // // // //                     ))}
// // // // //                 </div>
// // // // //             )}
// // // // //         </div>
// // // // //     );
// // // // // }

// // // // // // ─── Loading Skeleton ────────────────────────────────────────────────────────
// // // // // function LoadingState() {
// // // // //     return (
// // // // //         <div className="space-y-4 pt-4">
// // // // //             {[...Array(3)].map((_, i) => (
// // // // //                 <Skeleton key={i} className="h-48 w-full rounded-xl" />
// // // // //             ))}
// // // // //         </div>
// // // // //     );
// // // // // }

// // // // // // ─── Page ────────────────────────────────────────────────────────────────────
// // // // // export default function MarketRoutesPage() {
// // // // //     const { user } = useUser();
// // // // //     const firestore = useFirestore();
// // // // //     const { profile } = useUserProfile();

// // // // //     // ── 1. جيب رحلات الناقل الحالي عشان نعرف مساراته ──
// // // // //     const myTripsQuery = useMemoFirebase(() => {
// // // // //         if (!firestore || !user?.uid) return null;
// // // // //         return query(
// // // // //             collection(firestore, 'trips'),
// // // // //             where('carrierId', '==', user.uid),
// // // // //             where('status', 'in', ['Planned', 'In-Transit', 'Has_Offers', 'Negotiating', 'Pending-Carrier-Confirmation'])
// // // // //         );
// // // // //     }, [firestore, user]);

// // // // //     const { data: myTrips, isLoading: myLoading } = useCollection<Trip>(myTripsQuery);

// // // // //     // ── 2. جيب كل الرحلات النشطة في النظام (بدون فلتر carrierId) ──
// // // // //     const allActiveTripsQuery = useMemoFirebase(() => {
// // // // //         if (!firestore) return null;
// // // // //         return query(
// // // // //             collection(firestore, 'trips'),
// // // // //             where('status', 'in', ['Planned', 'In-Transit'])
// // // // //         );
// // // // //     }, [firestore]);

// // // // //     const { data: allTrips, isLoading: allLoading } = useCollection<Trip>(allActiveTripsQuery);

// // // // //     const isLoading = myLoading || allLoading;

// // // // //     // ── 3. استخرج المسارات من رحلاتي ──
// // // // //     const myRoutes = useMemo(() => {
// // // // //         if (!myTrips) return new Set<string>();
// // // // //         return new Set(myTrips.map(t => `${t.origin}__${t.destination}`));
// // // // //     }, [myTrips]);

// // // // //     // ── 4. فلتر رحلات المنافسين على نفس المسارات ──
// // // // //     const competitorTrips = useMemo(() => {
// // // // //         if (!allTrips || !user?.uid) return [];
// // // // //         return allTrips.filter(t => {
// // // // //             if (t.carrierId === user.uid) return false; // مش رحلاتي
// // // // //             return myRoutes.has(`${t.origin}__${t.destination}`);
// // // // //         });
// // // // //     }, [allTrips, user, myRoutes]);

// // // // //     // ── 5. جمّع حسب المسار ──
// // // // //     const grouped = useMemo(() => {
// // // // //         const map = new Map<string, { origin: string; destination: string; trips: Trip[] }>();
// // // // //         for (const trip of competitorTrips) {
// // // // //             const key = `${trip.origin}__${trip.destination}`;
// // // // //             if (!map.has(key)) {
// // // // //                 map.set(key, { origin: trip.origin, destination: trip.destination, trips: [] });
// // // // //             }
// // // // //             map.get(key)!.trips.push(trip);
// // // // //         }
// // // // //         // رتب من الأكتر إلى الأقل
// // // // //         return [...map.values()].sort((a, b) => b.trips.length - a.trips.length);
// // // // //     }, [competitorTrips]);

// // // // //     // ── حالة: ما عندوش رحلات نشطة ──
// // // // //     const hasNoActiveTrips = !myLoading && (!myTrips || myTrips.length === 0);

// // // // //     return (
// // // // //         <div className="space-y-5 pt-4">
// // // // //             {/* Page Title */}
// // // // //             <div>
// // // // //                 <h1 className="text-xl font-bold flex items-center gap-2">
// // // // //                     <Route className="h-5 w-5 text-primary" />
// // // // //                     رحلات المنافسين على مساراتي
// // // // //                 </h1>
// // // // //                 <p className="text-sm text-muted-foreground mt-1">
// // // // //                     رحلات الناقلين الآخرين في نفس مساراتك النشطة مع عدد المقاعد المتبقية
// // // // //                 </p>
// // // // //             </div>

// // // // //             {isLoading && <LoadingState />}

// // // // //             {!isLoading && hasNoActiveTrips && (
// // // // //                 <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
// // // // //                     <Route className="h-12 w-12 text-muted-foreground/40" />
// // // // //                     <p className="font-semibold text-muted-foreground">لا توجد رحلات نشطة</p>
// // // // //                     <p className="text-sm text-muted-foreground/70">
// // // // //                         أنشئ رحلة نشطة أولاً لترى رحلات المنافسين على نفس المسار
// // // // //                     </p>
// // // // //                 </div>
// // // // //             )}

// // // // //             {!isLoading && !hasNoActiveTrips && grouped.length === 0 && (
// // // // //                 <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
// // // // //                     <Users className="h-12 w-12 text-muted-foreground/40" />
// // // // //                     <p className="font-semibold text-muted-foreground">لا يوجد منافسون حالياً</p>
// // // // //                     <p className="text-sm text-muted-foreground/70">
// // // // //                         لا توجد رحلات لناقلين آخرين على مساراتك النشطة في الوقت الحالي
// // // // //                     </p>
// // // // //                 </div>
// // // // //             )}

// // // // //             {!isLoading && grouped.map(group => (
// // // // //                 <RouteGroup
// // // // //                     key={`${group.origin}__${group.destination}`}
// // // // //                     origin={group.origin}
// // // // //                     destination={group.destination}
// // // // //                     trips={group.trips}
// // // // //                 />
// // // // //             ))}
// // // // //         </div>
// // // // //     );
// // // // // }
// // // // 'use client';

// // // // import { useMemo, useState } from 'react';
// // // // import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
// // // // import { collection, query, where } from 'firebase/firestore';
// // // // import { useUserProfile } from '@/hooks/use-user-profile';
// // // // import type { Trip } from '@/lib/data';
// // // // import { Skeleton } from '@/components/ui/skeleton';
// // // // import { Badge } from '@/components/ui/badge';
// // // // import { Button } from '@/components/ui/button';
// // // // import {
// // // //     MapPin,
// // // //     Calendar,
// // // //     Clock,
// // // //     Users,
// // // //     Car,
// // // //     Bus,
// // // //     ChevronDown,
// // // //     ChevronUp,
// // // //     ArrowRight,
// // // //     Route,
// // // // } from 'lucide-react';
// // // // import { cn } from '@/lib/utils';

// // // // // ─── helpers ────────────────────────────────────────────────────────────────
// // // // function formatDate(raw: any): string {
// // // //     if (!raw) return '—';
// // // //     const d = raw?.toDate?.() ?? new Date(raw);
// // // //     if (isNaN(d.getTime())) return '—';
// // // //     return d.toLocaleDateString('ar-EG', {
// // // //         weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
// // // //     });
// // // // }

// // // // function getStatusLabel(status: Trip['status']) {
// // // //     const map: Record<string, { label: string; pill: string; bar: string }> = {
// // // //         'Planned': { label: 'مخططة', pill: 'bg-green-500/10 text-green-600 border-green-500/20', bar: 'bg-green-500' },
// // // //         'In-Transit': { label: 'في الطريق', pill: 'bg-blue-500/10 text-blue-600 border-blue-500/20', bar: 'bg-blue-500 animate-pulse' },
// // // //         'Has_Offers': { label: 'لديها عروض', pill: 'bg-amber-500/10 text-amber-600 border-amber-500/20', bar: 'bg-amber-500' },
// // // //         'Negotiating': { label: 'تفاوض', pill: 'bg-orange-500/10 text-orange-600 border-orange-500/20', bar: 'bg-orange-500' },
// // // //     };
// // // //     return map[status] ?? { label: status, pill: 'bg-muted text-muted-foreground border-border', bar: 'bg-muted-foreground' };
// // // // }

// // // // // ─── Card ────────────────────────────────────────────────────────────────────
// // // // function CompetitorTripCard({ trip }: { trip: Trip }) {
// // // //     const [expanded, setExpanded] = useState(false);

// // // //     const available = trip.availableSeats ?? (trip.vehicleCapacity ?? 0);
// // // //     const total = trip.vehicleCapacity ?? available;
// // // //     const occupied = total - available;
// // // //     const occupancyPct = total > 0 ? Math.round((occupied / total) * 100) : 0;
// // // //     const isFull = available === 0;
// // // //     const isAlmostFull = !isFull && available <= 2;

// // // //     const { label, pill, bar } = getStatusLabel(trip.status);

// // // //     // السعر والعملة
// // // //     const price = trip.price;
// // // //     const currency = trip.currency ?? 'د.أ';

// // // //     // أجرة المقعد الواحد (نفس منطق BookingActionCard)
// // // //     const totalPrice = price ?? 0;
// // // //     const depositPct = trip.depositPercentage ?? 10;
// // // //     const depositAmt = ((totalPrice * depositPct) / 100).toFixed(2);
// // // //     const remainingAmt = (totalPrice - parseFloat(depositAmt)).toFixed(2);

// // // //     return (
// // // //         <div
// // // //             className={cn(
// // // //                 'group relative overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-200',
// // // //                 'hover:border-border hover:shadow-md',
// // // //                 isFull && 'opacity-60',
// // // //             )}
// // // //         >
// // // //             {/* Left color bar */}
// // // //             <div className={cn('absolute start-0 top-0 bottom-0 w-1 rounded-s-2xl', bar)} />

// // // //             {/* Gradient bg */}
// // // //             <div className="absolute inset-0 bg-gradient-to-br from-muted/30 to-transparent opacity-40 pointer-events-none" />

// // // //             <div className="relative p-4 sm:p-5 space-y-4">

// // // //                 {/* Status pill */}
// // // //                 <div className="flex justify-center">
// // // //                     <p className={cn('text-[10px] font-bold uppercase tracking-wider border rounded-full px-2 py-0.5 w-fit', pill)}>
// // // //                         {label}
// // // //                     </p>
// // // //                 </div>

// // // //                 {/* ── Header: اسم الناقل + مسار ── */}
// // // //                 <div className="flex items-start justify-between gap-3">
// // // //                     <div className="flex items-center gap-3 min-w-0">
// // // //                         {/* Avatar بالحرف الأول */}
// // // //                         <div className="h-11 w-11 shrink-0 rounded-full border-2 border-background shadow-sm bg-primary/10 flex items-center justify-center">
// // // //                             <span className="font-black text-sm text-primary">
// // // //                                 {(trip.carrierName ?? 'ن').charAt(0).toUpperCase()}
// // // //                             </span>
// // // //                         </div>
// // // //                         <div className="min-w-0">
// // // //                             <p className="font-black text-sm text-foreground truncate leading-tight">
// // // //                                 {trip.carrierName ?? 'ناقل'}
// // // //                             </p>
// // // //                             <div className="flex items-center gap-2 mt-1">
// // // //                                 {/* نوع المركبة */}
// // // //                                 <Badge variant="outline" className="h-5 px-1.5 text-[10px] font-bold bg-muted/50 flex items-center gap-1">
// // // //                                     {trip.vehicleType?.toLowerCase().includes('bus') ||
// // // //                                         trip.vehicleType?.toLowerCase().includes('حافلة')
// // // //                                         ? <Bus className="h-3 w-3" />
// // // //                                         : <Car className="h-3 w-3" />
// // // //                                     }
// // // //                                     {trip.vehicleType ?? 'مركبة'}
// // // //                                 </Badge>
// // // //                                 {/* كود الرحلة */}
// // // //                                 <span className="text-[10px] text-muted-foreground font-mono">
// // // //                                     #{trip.id.slice(-5).toUpperCase()}
// // // //                                 </span>
// // // //                             </div>
// // // //                         </div>
// // // //                     </div>
// // // //                 </div>

// // // //                 {/* ── المسار والتاريخ ── */}
// // // //                 <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
// // // //                     <span className="flex items-center gap-1 font-semibold text-foreground">
// // // //                         <MapPin className="h-3.5 w-3.5 text-primary" />
// // // //                         {trip.origin}
// // // //                         <ArrowRight className="h-3 w-3 text-muted-foreground" />
// // // //                         {trip.destination}
// // // //                     </span>
// // // //                     <span className="flex items-center gap-1">
// // // //                         <Calendar className="h-3.5 w-3.5" />
// // // //                         {formatDate(trip.departureDate)}
// // // //                     </span>
// // // //                     {trip.departureTime && (
// // // //                         <span className="flex items-center gap-1">
// // // //                             <Clock className="h-3.5 w-3.5" />
// // // //                             {trip.departureTime}
// // // //                         </span>
// // // //                     )}
// // // //                 </div>

// // // //                 {/* ── Financial summary (نفس بطاقة الحجز) ── */}
// // // //                 {/* <div className="grid grid-cols-3 gap-2 rounded-xl bg-muted/40 border border-border/50 p-3">
// // // //                     <div className="text-center">
// // // //                         <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">الإجمالي</p>
// // // //                         <p className="text-sm font-black text-foreground mt-0.5">
// // // //                             {price ?? '—'} <span className="text-[10px] font-bold text-muted-foreground">{currency}</span>
// // // //                         </p>
// // // //                     </div>
// // // //                     <div className="text-center border-x border-border/50">
// // // //                         <p className="text-[9px] font-bold text-green-600 uppercase tracking-wide">المدفوع</p>
// // // //                         <p className="text-sm font-black text-green-600 mt-0.5">{price ? depositAmt : '—'}</p>
// // // //                     </div>
// // // //                     <div className="text-center">
// // // //                         <p className="text-[9px] font-bold text-orange-500 uppercase tracking-wide">التحصيل</p>
// // // //                         <p className="text-sm font-black text-orange-500 mt-0.5">{price ? remainingAmt : '—'}</p>
// // // //                     </div>
// // // //                 </div> */}

// // // //                 {/* ── المقاعد (expandable) ── */}
// // // //                 <button
// // // //                     onClick={() => setExpanded(v => !v)}
// // // //                     className="w-full flex items-center justify-between text-[11px] font-bold text-muted-foreground hover:text-foreground transition-colors py-0.5"
// // // //                 >
// // // //                     <span className="flex items-center gap-1.5">
// // // //                         <Users className="h-3.5 w-3.5" />
// // // //                         المقاعد المتبقية ({available} / {total})
// // // //                     </span>
// // // //                     {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
// // // //                 </button>

// // // //                 {expanded && (
// // // //                     <div className="space-y-2 animate-in slide-in-from-top-1 duration-150">
// // // //                         {/* Progress bar */}
// // // //                         <div className="space-y-1">
// // // //                             <div className="h-2 rounded-full bg-muted overflow-hidden">
// // // //                                 <div
// // // //                                     className={cn(
// // // //                                         'h-full rounded-full transition-all',
// // // //                                         isFull ? 'bg-destructive' : isAlmostFull ? 'bg-orange-500' : 'bg-green-500',
// // // //                                     )}
// // // //                                     style={{ width: `${occupancyPct}%` }}
// // // //                                 />
// // // //                             </div>
// // // //                             <div className="flex justify-between text-[10px] text-muted-foreground">
// // // //                                 <span>{occupied} محجوز</span>
// // // //                                 <span
// // // //                                     className={cn(
// // // //                                         'font-bold',
// // // //                                         isFull ? 'text-destructive' : isAlmostFull ? 'text-orange-500' : 'text-green-600',
// // // //                                     )}
// // // //                                 >
// // // //                                     {isFull ? 'مكتملة' : isAlmostFull ? 'أوشكت تكتمل' : `${available} متاح`}
// // // //                                 </span>
// // // //                             </div>
// // // //                         </div>

// // // //                         {/* تفاصيل إضافية */}
// // // //                         <div className="rounded-xl border border-border/50 bg-muted/30 p-3 space-y-1.5 text-xs">
// // // //                             {trip.meetingPoint && (
// // // //                                 <div className="flex justify-between">
// // // //                                     <span className="text-muted-foreground">نقطة الالتقاء</span>
// // // //                                     <span className="font-bold">{trip.meetingPoint}</span>
// // // //                                 </div>
// // // //                             )}
// // // //                             {trip.numberOfStops != null && (
// // // //                                 <div className="flex justify-between">
// // // //                                     <span className="text-muted-foreground">عدد المحطات</span>
// // // //                                     <span className="font-bold">{trip.numberOfStops}</span>
// // // //                                 </div>
// // // //                             )}
// // // //                             {trip.bagsPerSeat != null && (
// // // //                                 <div className="flex justify-between">
// // // //                                     <span className="text-muted-foreground">حقائب / مقعد</span>
// // // //                                     <span className="font-bold">{trip.bagsPerSeat}</span>
// // // //                                 </div>
// // // //                             )}
// // // //                             {trip.estimatedDurationHours != null && (
// // // //                                 <div className="flex justify-between">
// // // //                                     <span className="text-muted-foreground">مدة الرحلة</span>
// // // //                                     <span className="font-bold">{trip.estimatedDurationHours} ساعة</span>
// // // //                                 </div>
// // // //                             )}
// // // //                             {trip.depositPercentage != null && (
// // // //                                 <div className="flex justify-between">
// // // //                                     <span className="text-muted-foreground">نسبة العربون</span>
// // // //                                     <span className="font-bold">{trip.depositPercentage}%</span>
// // // //                                 </div>
// // // //                             )}
// // // //                             {trip.conditions && (
// // // //                                 <div className="flex justify-between gap-3">
// // // //                                     <span className="text-muted-foreground shrink-0">الشروط</span>
// // // //                                     <span className="font-bold text-end break-words">{trip.conditions}</span>
// // // //                                 </div>
// // // //                             )}
// // // //                         </div>
// // // //                     </div>
// // // //                 )}
// // // //             </div>
// // // //         </div>
// // // //     );
// // // // }

// // // // // ─── Route Group ─────────────────────────────────────────────────────────────
// // // // function RouteGroup({ origin, destination, trips }: { origin: string; destination: string; trips: Trip[] }) {
// // // //     const [open, setOpen] = useState(true);
// // // //     const totalSeats = trips.reduce((s, t) => s + (t.availableSeats ?? t.vehicleCapacity ?? 0), 0);

// // // //     return (
// // // //         <div className="rounded-2xl border bg-background shadow-sm overflow-hidden">
// // // //             <button
// // // //                 className="w-full flex items-center justify-between px-4 py-3 bg-primary/5 hover:bg-primary/10 transition-colors"
// // // //                 onClick={() => setOpen(p => !p)}
// // // //             >
// // // //                 <div className="flex items-center gap-2 font-semibold text-sm">
// // // //                     <Route className="h-4 w-4 text-primary" />
// // // //                     <span>{origin}</span>
// // // //                     <ArrowRight className="h-3 w-3 text-muted-foreground" />
// // // //                     <span>{destination}</span>
// // // //                 </div>
// // // //                 <div className="flex items-center gap-3 text-xs text-muted-foreground">
// // // //                     <span>{trips.length} رحلة · {totalSeats} مقعد متاح</span>
// // // //                     {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
// // // //                 </div>
// // // //             </button>

// // // //             {open && (
// // // //                 <div className="p-3 space-y-3">
// // // //                     {trips.map(trip => (
// // // //                         <CompetitorTripCard key={trip.id} trip={trip} />
// // // //                     ))}
// // // //                 </div>
// // // //             )}
// // // //         </div>
// // // //     );
// // // // }

// // // // // ─── Loading ──────────────────────────────────────────────────────────────────
// // // // function LoadingState() {
// // // //     return (
// // // //         <div className="space-y-4 pt-4">
// // // //             {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-52 w-full rounded-2xl" />)}
// // // //         </div>
// // // //     );
// // // // }

// // // // // ─── Page ─────────────────────────────────────────────────────────────────────
// // // // export default function MarketRoutesPage() {
// // // //     const { user } = useUser();
// // // //     const firestore = useFirestore();

// // // //     // رحلاتي النشطة — عشان نعرف المسارات
// // // //     const myTripsQuery = useMemoFirebase(() => {
// // // //         if (!firestore || !user?.uid) return null;
// // // //         return query(
// // // //             collection(firestore, 'trips'),
// // // //             where('carrierId', '==', user.uid),
// // // //             where('status', 'in', ['Planned', 'In-Transit', 'Has_Offers', 'Negotiating', 'Pending-Carrier-Confirmation']),
// // // //         );
// // // //     }, [firestore, user]);

// // // //     const { data: myTrips, isLoading: myLoading } = useCollection<Trip>(myTripsQuery);

// // // //     // كل الرحلات النشطة في النظام
// // // //     const allActiveQuery = useMemoFirebase(() => {
// // // //         if (!firestore) return null;
// // // //         return query(
// // // //             collection(firestore, 'trips'),
// // // //             where('status', 'in', ['Planned', 'In-Transit']),
// // // //         );
// // // //     }, [firestore]);

// // // //     const { data: allTrips, isLoading: allLoading } = useCollection<Trip>(allActiveQuery);

// // // //     const isLoading = myLoading || allLoading;

// // // //     // المسارات الخاصة بي
// // // //     const myRoutes = useMemo(() => {
// // // //         if (!myTrips) return new Set<string>();
// // // //         return new Set(myTrips.map(t => `${t.origin}__${t.destination}`));
// // // //     }, [myTrips]);

// // // //     // رحلات المنافسين على نفس مساراتي
// // // //     const competitorTrips = useMemo(() => {
// // // //         if (!allTrips || !user?.uid) return [];
// // // //         return allTrips.filter(t => t.carrierId !== user.uid && myRoutes.has(`${t.origin}__${t.destination}`));
// // // //     }, [allTrips, user, myRoutes]);

// // // //     // تجميع حسب المسار
// // // //     const grouped = useMemo(() => {
// // // //         const map = new Map<string, { origin: string; destination: string; trips: Trip[] }>();
// // // //         for (const trip of competitorTrips) {
// // // //             const key = `${trip.origin}__${trip.destination}`;
// // // //             if (!map.has(key)) map.set(key, { origin: trip.origin, destination: trip.destination, trips: [] });
// // // //             map.get(key)!.trips.push(trip);
// // // //         }
// // // //         return [...map.values()].sort((a, b) => b.trips.length - a.trips.length);
// // // //     }, [competitorTrips]);

// // // //     const hasNoActiveTrips = !myLoading && (!myTrips || myTrips.length === 0);

// // // //     return (
// // // //         <div className="space-y-5 pt-4">
// // // //             <div>
// // // //                 <h1 className="text-xl font-bold flex items-center gap-2">
// // // //                     <Route className="h-5 w-5 text-primary" />
// // // //                     رحلات المنافسين على مساراتي
// // // //                 </h1>
// // // //                 <p className="text-sm text-muted-foreground mt-1">
// // // //                     رحلات الناقلين الآخرين في نفس مساراتك النشطة
// // // //                 </p>
// // // //             </div>

// // // //             {isLoading && <LoadingState />}

// // // //             {!isLoading && hasNoActiveTrips && (
// // // //                 <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
// // // //                     <Route className="h-12 w-12 text-muted-foreground/40" />
// // // //                     <p className="font-semibold text-muted-foreground">لا توجد رحلات نشطة</p>
// // // //                     <p className="text-sm text-muted-foreground/70">أنشئ رحلة نشطة أولاً لترى رحلات المنافسين</p>
// // // //                 </div>
// // // //             )}

// // // //             {!isLoading && !hasNoActiveTrips && grouped.length === 0 && (
// // // //                 <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
// // // //                     <Users className="h-12 w-12 text-muted-foreground/40" />
// // // //                     <p className="font-semibold text-muted-foreground">لا يوجد منافسون حالياً</p>
// // // //                     <p className="text-sm text-muted-foreground/70">لا توجد رحلات لناقلين آخرين على مساراتك</p>
// // // //                 </div>
// // // //             )}

// // // //             {!isLoading && grouped.map(group => (
// // // //                 <RouteGroup
// // // //                     key={`${group.origin}__${group.destination}`}
// // // //                     origin={group.origin}
// // // //                     destination={group.destination}
// // // //                     trips={group.trips}
// // // //                 />
// // // //             ))}
// // // //         </div>
// // // //     );
// // // // }
// // // 'use client';

// // // import { useMemo, useState } from 'react';
// // // import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
// // // import { collection, query, where } from 'firebase/firestore';
// // // import { useUserProfile } from '@/hooks/use-user-profile';
// // // import type { Trip } from '@/lib/data';
// // // import { Skeleton } from '@/components/ui/skeleton';
// // // import { Badge } from '@/components/ui/badge';
// // // import { Button } from '@/components/ui/button';
// // // import {
// // //     MapPin,
// // //     Calendar,
// // //     Clock,
// // //     Users,
// // //     Car,
// // //     Bus,
// // //     ChevronDown,
// // //     ChevronUp,
// // //     ArrowRight,
// // //     Route,
// // // } from 'lucide-react';
// // // import { cn } from '@/lib/utils';

// // // // ─── helpers ────────────────────────────────────────────────────────────────
// // // function formatDate(raw: any): string {
// // //     if (!raw) return '—';
// // //     const d = raw?.toDate?.() ?? new Date(raw);
// // //     if (isNaN(d.getTime())) return '—';
// // //     return d.toLocaleDateString('ar-EG', {
// // //         weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
// // //     });
// // // }

// // // function getStatusLabel(status: Trip['status']) {
// // //     const map: Record<string, { label: string; pill: string; bar: string }> = {
// // //         'Planned': { label: 'مخططة', pill: 'bg-green-500/10 text-green-600 border-green-500/20', bar: 'bg-green-500' },
// // //         'In-Transit': { label: 'في الطريق', pill: 'bg-blue-500/10 text-blue-600 border-blue-500/20', bar: 'bg-blue-500 animate-pulse' },
// // //         'Has_Offers': { label: 'لديها عروض', pill: 'bg-amber-500/10 text-amber-600 border-amber-500/20', bar: 'bg-amber-500' },
// // //         'Negotiating': { label: 'تفاوض', pill: 'bg-orange-500/10 text-orange-600 border-orange-500/20', bar: 'bg-orange-500' },
// // //     };
// // //     return map[status] ?? { label: status, pill: 'bg-muted text-muted-foreground border-border', bar: 'bg-muted-foreground' };
// // // }

// // // // ─── Card ────────────────────────────────────────────────────────────────────
// // // function CompetitorTripCard({ trip }: { trip: Trip }) {
// // //     const [expanded, setExpanded] = useState(false);

// // //     const available = trip.availableSeats ?? (trip.vehicleCapacity ?? 0);
// // //     const total = trip.vehicleCapacity ?? available;
// // //     const occupied = total - available;
// // //     const occupancyPct = total > 0 ? Math.round((occupied / total) * 100) : 0;
// // //     const isFull = available === 0;
// // //     const isAlmostFull = !isFull && available <= 2;

// // //     const { label, pill, bar } = getStatusLabel(trip.status);

// // //     // السعر والعملة
// // //     const price = trip.price;
// // //     const currency = trip.currency ?? 'د.أ';

// // //     // أجرة المقعد الواحد (نفس منطق BookingActionCard)
// // //     const totalPrice = price ?? 0;
// // //     const depositPct = trip.depositPercentage ?? 10;
// // //     const depositAmt = ((totalPrice * depositPct) / 100).toFixed(2);
// // //     const remainingAmt = (totalPrice - parseFloat(depositAmt)).toFixed(2);

// // //     return (
// // //         <div
// // //             className={cn(
// // //                 'group relative overflow-hidden rounded-2xl border border-[#BFAF78] bg-card transition-all duration-200',
// // //                 'hover:border-border hover:shadow-md',
// // //                 isFull && 'opacity-60',
// // //             )}
// // //         >
// // //             {/* Left color bar */}
// // //             {/* <div className={cn('absolute start-0 top-0 bottom-0 w-1 rounded-s-2xl', bar)} /> */}

// // //             {/* Gradient bg */}
// // //             <div className="absolute inset-0 bg-gradient-to-br from-muted/30 to-transparent opacity-40 pointer-events-none" />

// // //             <div className="relative p-4 sm:p-5 space-y-4">

// // //                 {/* Status pill */}
// // //                 <div className="flex justify-center">
// // //                     <p className={cn('text-[10px] font-bold uppercase tracking-wider border rounded-full px-2 py-0.5 w-fit', pill)}>
// // //                         {label}
// // //                     </p>
// // //                 </div>

// // //                 {/* ── Header: اسم الناقل + مسار ── */}
// // //                 <div className="flex items-start justify-between gap-3">
// // //                     <div className="flex items-center gap-3 min-w-0">
// // //                         {/* Avatar بالحرف الأول */}
// // //                         <div className="h-11 w-11 shrink-0 rounded-full border-2 border-background shadow-sm bg-primary/10 flex items-center justify-center">
// // //                             <span className="font-black text-sm text-primary">
// // //                                 {(trip.carrierName ?? 'ن').charAt(0).toUpperCase()}
// // //                             </span>
// // //                         </div>
// // //                         <div className="min-w-0">
// // //                             <p className="font-black text-sm text-foreground truncate leading-tight">
// // //                                 {trip.carrierName ?? 'ناقل'}
// // //                             </p>
// // //                             <div className="flex items-center gap-2 mt-1">
// // //                                 {/* نوع المركبة */}
// // //                                 <Badge variant="outline" className="h-5 px-1.5 text-[10px] font-bold bg-muted/50 flex items-center gap-1">
// // //                                     {trip.vehicleType?.toLowerCase().includes('bus') ||
// // //                                         trip.vehicleType?.toLowerCase().includes('حافلة')
// // //                                         ? <Bus className="h-3 w-3" />
// // //                                         : <Car className="h-3 w-3" />
// // //                                     }
// // //                                     {trip.vehicleType ?? 'مركبة'}
// // //                                 </Badge>
// // //                                 {/* كود الرحلة */}
// // //                                 <span className="text-[10px] text-muted-foreground font-mono">
// // //                                     #{trip.id.slice(-5).toUpperCase()}
// // //                                 </span>
// // //                             </div>
// // //                         </div>
// // //                     </div>
// // //                 </div>

// // //                 {/* ── المسار والتاريخ ── */}
// // //                 <div className="flex flex-wrap items-center gap-3  justify-between text-xs text-muted-foreground">
// // //                     <span className="flex items-center gap-1 font-semibold text-foreground">
// // //                         <MapPin className="h-3.5 w-3.5 text-primary" />
// // //                         {trip.origin}
// // //                         <ArrowRight className="h-3 w-3 text-muted-foreground" />
// // //                         {trip.destination}
// // //                     </span>
// // //                     <span className="flex items-center gap-1">
// // //                         <Calendar className="h-3.5 w-3.5" />
// // //                         {formatDate(trip.departureDate)}
// // //                     </span>
// // //                     {trip.departureTime && (
// // //                         <span className="flex items-center gap-1">
// // //                             <Clock className="h-3.5 w-3.5" />
// // //                             {trip.departureTime}
// // //                         </span>
// // //                     )}
// // //                 </div>

// // //                 {/* ── Financial summary (نفس بطاقة الحجز) ── */}
// // //                 {/* <div className="grid grid-cols-3 gap-2 rounded-xl bg-muted/40 border border-border/50 p-3">
// // //                     <div className="text-center">
// // //                         <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">الإجمالي</p>
// // //                         <p className="text-sm font-black text-foreground mt-0.5">
// // //                             {price ?? '—'} <span className="text-[10px] font-bold text-muted-foreground">{currency}</span>
// // //                         </p>
// // //                     </div>
// // //                     <div className="text-center border-x border-border/50">
// // //                         <p className="text-[9px] font-bold text-green-600 uppercase tracking-wide">المدفوع</p>
// // //                         <p className="text-sm font-black text-green-600 mt-0.5">{price ? depositAmt : '—'}</p>
// // //                     </div>
// // //                     <div className="text-center">
// // //                         <p className="text-[9px] font-bold text-orange-500 uppercase tracking-wide">التحصيل</p>
// // //                         <p className="text-sm font-black text-orange-500 mt-0.5">{price ? remainingAmt : '—'}</p>
// // //                     </div>
// // //                 </div> */}

// // //                 {/* ── المقاعد (expandable) ── */}
// // //                 <button
// // //                     onClick={() => setExpanded(v => !v)}
// // //                     className="w-full flex items-center justify-between text-[11px] font-bold text-muted-foreground hover:text-foreground transition-colors py-0.5"
// // //                 >
// // //                     <span className="flex items-center gap-1.5">
// // //                         <Users className="h-3.5 w-3.5" />
// // //                         المقاعد المتبقية ({available} / {total})
// // //                     </span>
// // //                     {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
// // //                 </button>

// // //                 {expanded && (
// // //                     <div className="space-y-2 animate-in slide-in-from-top-1 duration-150">
// // //                         {/* Progress bar */}
// // //                         <div className="space-y-1">
// // //                             <div className="h-2 rounded-full bg-muted overflow-hidden">
// // //                                 <div
// // //                                     className={cn(
// // //                                         'h-full rounded-full transition-all',
// // //                                         isFull ? 'bg-destructive' : isAlmostFull ? 'bg-orange-500' : 'bg-green-500',
// // //                                     )}
// // //                                     style={{ width: `${occupancyPct}%` }}
// // //                                 />
// // //                             </div>
// // //                             <div className="flex justify-between text-[10px] text-muted-foreground">
// // //                                 <span>{occupied} محجوز</span>
// // //                                 <span
// // //                                     className={cn(
// // //                                         'font-bold',
// // //                                         isFull ? 'text-destructive' : isAlmostFull ? 'text-orange-500' : 'text-green-600',
// // //                                     )}
// // //                                 >
// // //                                     {isFull ? 'مكتملة' : isAlmostFull ? 'أوشكت تكتمل' : `${available} متاح`}
// // //                                 </span>
// // //                             </div>
// // //                         </div>

// // //                         {/* تفاصيل إضافية */}
// // //                         <div className="rounded-xl border border-border/50 bg-muted/30 p-3 space-y-1.5 text-xs">
// // //                             {trip.meetingPoint && (
// // //                                 <div className="flex justify-between">
// // //                                     <span className="text-muted-foreground">نقطة الالتقاء</span>
// // //                                     <span className="font-bold">{trip.meetingPoint}</span>
// // //                                 </div>
// // //                             )}
// // //                             {trip.numberOfStops != null && (
// // //                                 <div className="flex justify-between">
// // //                                     <span className="text-muted-foreground">عدد المحطات</span>
// // //                                     <span className="font-bold">{trip.numberOfStops}</span>
// // //                                 </div>
// // //                             )}
// // //                             {trip.bagsPerSeat != null && (
// // //                                 <div className="flex justify-between">
// // //                                     <span className="text-muted-foreground">حقائب / مقعد</span>
// // //                                     <span className="font-bold">{trip.bagsPerSeat}</span>
// // //                                 </div>
// // //                             )}
// // //                             {trip.estimatedDurationHours != null && (
// // //                                 <div className="flex justify-between">
// // //                                     <span className="text-muted-foreground">مدة الرحلة</span>
// // //                                     <span className="font-bold">{trip.estimatedDurationHours} ساعة</span>
// // //                                 </div>
// // //                             )}
// // //                             {trip.depositPercentage != null && (
// // //                                 <div className="flex justify-between">
// // //                                     <span className="text-muted-foreground">نسبة العربون</span>
// // //                                     <span className="font-bold">{trip.depositPercentage}%</span>
// // //                                 </div>
// // //                             )}
// // //                             {trip.conditions && (
// // //                                 <div className="flex justify-between gap-3">
// // //                                     <span className="text-muted-foreground shrink-0">الشروط</span>
// // //                                     <span className="font-bold text-end break-words">{trip.conditions}</span>
// // //                                 </div>
// // //                             )}
// // //                         </div>
// // //                     </div>
// // //                 )}
// // //             </div>
// // //         </div>
// // //     );
// // // }

// // // // ─── Route Group ─────────────────────────────────────────────────────────────
// // // function RouteGroup({ origin, destination, trips }: { origin: string; destination: string; trips: Trip[] }) {
// // //     const [open, setOpen] = useState(true);
// // //     const totalSeats = trips.reduce((s, t) => s + (t.availableSeats ?? t.vehicleCapacity ?? 0), 0);

// // //     return (
// // //         <div className="rounded-2xl border border-[#BFAF78] bg-background shadow-sm overflow-hidden">
// // //             <button
// // //                 className="w-full flex items-center justify-between px-4 py-3 bg-primary/5 hover:bg-primary/10 transition-colors"
// // //                 onClick={() => setOpen(p => !p)}
// // //             >
// // //                 <div className="flex items-center gap-2 font-semibold text-sm">
// // //                     <Route className="h-4 w-4 text-primary" />
// // //                     <span>{origin}</span>
// // //                     <ArrowRight className="h-3 w-3 text-muted-foreground" />
// // //                     <span>{destination}</span>
// // //                 </div>
// // //                 <div className="flex items-center gap-3 text-xs text-muted-foreground">
// // //                     <span>{trips.length} رحلة · {totalSeats} مقعد متاح</span>
// // //                     {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
// // //                 </div>
// // //             </button>

// // //             {open && (
// // //                 <div className="p-3 grid grid-cols-1 sm:grid-cols-2  gap-3">
// // //                     {trips.map(trip => (
// // //                         <CompetitorTripCard key={trip.id} trip={trip} />
// // //                     ))}
// // //                 </div>
// // //             )}
// // //         </div>
// // //     );
// // // }

// // // // ─── Loading ──────────────────────────────────────────────────────────────────
// // // function LoadingState() {
// // //     return (
// // //         <div className="space-y-4 pt-4">
// // //             {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-52 w-full rounded-2xl" />)}
// // //         </div>
// // //     );
// // // }

// // // // ─── Page ─────────────────────────────────────────────────────────────────────
// // // export default function MarketRoutesPage() {
// // //     const { user } = useUser();
// // //     const firestore = useFirestore();

// // //     // رحلاتي النشطة — عشان نعرف المسارات
// // //     const myTripsQuery = useMemoFirebase(() => {
// // //         if (!firestore || !user?.uid) return null;
// // //         return query(
// // //             collection(firestore, 'trips'),
// // //             where('carrierId', '==', user.uid),
// // //             where('status', 'in', ['Planned', 'In-Transit', 'Has_Offers', 'Negotiating', 'Pending-Carrier-Confirmation']),
// // //         );
// // //     }, [firestore, user]);

// // //     const { data: myTrips, isLoading: myLoading } = useCollection<Trip>(myTripsQuery);

// // //     // كل الرحلات النشطة في النظام
// // //     const allActiveQuery = useMemoFirebase(() => {
// // //         if (!firestore) return null;
// // //         return query(
// // //             collection(firestore, 'trips'),
// // //             where('status', 'in', ['Planned', 'In-Transit']),
// // //         );
// // //     }, [firestore]);

// // //     const { data: allTrips, isLoading: allLoading } = useCollection<Trip>(allActiveQuery);

// // //     const isLoading = myLoading || allLoading;

// // //     // المسارات الخاصة بي
// // //     const myRoutes = useMemo(() => {
// // //         if (!myTrips) return new Set<string>();
// // //         return new Set(myTrips.map(t => `${t.origin}__${t.destination}`));
// // //     }, [myTrips]);

// // //     // رحلات المنافسين على نفس مساراتي
// // //     const competitorTrips = useMemo(() => {
// // //         if (!allTrips || !user?.uid) return [];
// // //         return allTrips.filter(t => t.carrierId !== user.uid && myRoutes.has(`${t.origin}__${t.destination}`));
// // //     }, [allTrips, user, myRoutes]);

// // //     // تجميع حسب المسار
// // //     const grouped = useMemo(() => {
// // //         const map = new Map<string, { origin: string; destination: string; trips: Trip[] }>();
// // //         for (const trip of competitorTrips) {
// // //             const key = `${trip.origin}__${trip.destination}`;
// // //             if (!map.has(key)) map.set(key, { origin: trip.origin, destination: trip.destination, trips: [] });
// // //             map.get(key)!.trips.push(trip);
// // //         }
// // //         return [...map.values()].sort((a, b) => b.trips.length - a.trips.length);
// // //     }, [competitorTrips]);

// // //     const hasNoActiveTrips = !myLoading && (!myTrips || myTrips.length === 0);

// // //     return (
// // //         <div className="space-y-5 pt-4">
// // //             <div>
// // //                 <h1 className="text-xl font-bold flex items-center gap-2">
// // //                     <Route className="h-5 w-5 text-primary" />
// // //                     رحلات المنافسين على مساراتي
// // //                 </h1>
// // //                 <p className="text-sm text-muted-foreground mt-1">
// // //                     رحلات الناقلين الآخرين في نفس مساراتك النشطة
// // //                 </p>
// // //             </div>

// // //             {isLoading && <LoadingState />}

// // //             {!isLoading && hasNoActiveTrips && (
// // //                 <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
// // //                     <Route className="h-12 w-12 text-muted-foreground/40" />
// // //                     <p className="font-semibold text-muted-foreground">لا توجد رحلات نشطة</p>
// // //                     <p className="text-sm text-muted-foreground/70">أنشئ رحلة نشطة أولاً لترى رحلات المنافسين</p>
// // //                 </div>
// // //             )}

// // //             {!isLoading && !hasNoActiveTrips && grouped.length === 0 && (
// // //                 <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
// // //                     <Users className="h-12 w-12 text-muted-foreground/40" />
// // //                     <p className="font-semibold text-muted-foreground">لا يوجد منافسون حالياً</p>
// // //                     <p className="text-sm text-muted-foreground/70">لا توجد رحلات لناقلين آخرين على مساراتك</p>
// // //                 </div>
// // //             )}

// // //             {!isLoading && grouped.map(group => (
// // //                 <RouteGroup
// // //                     key={`${group.origin}__${group.destination}`}
// // //                     origin={group.origin}
// // //                     destination={group.destination}
// // //                     trips={group.trips}
// // //                 />
// // //             ))}
// // //         </div>
// // //     );
// // // }

// // 'use client';

// // import { useMemo, useState, useEffect } from 'react';
// // import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
// // import { collection, query, where } from 'firebase/firestore';
// // import { useUserProfile } from '@/hooks/use-user-profile';
// // import type { Trip } from '@/lib/data';
// // import { Skeleton } from '@/components/ui/skeleton';
// // import { Badge } from '@/components/ui/badge';
// // import { Button } from '@/components/ui/button';
// // import {
// //     MapPin,
// //     Calendar,
// //     Clock,
// //     Users,
// //     Car,
// //     Bus,
// //     ChevronDown,
// //     ChevronUp,
// //     ArrowRight,
// //     Route,
// // } from 'lucide-react';
// // import { cn } from '@/lib/utils';

// // // ─── helpers ────────────────────────────────────────────────────────────────
// // function formatDate(raw: any): string {
// //     if (!raw) return '—';
// //     const d = raw?.toDate?.() ?? new Date(raw);
// //     if (isNaN(d.getTime())) return '—';
// //     return d.toLocaleDateString('ar-EG', {
// //         weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
// //     });
// // }

// // function getDepartureCountdown(departureDate: any, departureTime?: string): { text: string; urgent: boolean } | null {
// //     if (!departureDate) return null;

// //     const base = departureDate?.toDate?.() ?? new Date(departureDate);
// //     if (isNaN(base.getTime())) return null;

// //     // دمج وقت الانطلاق لو موجود (مثال: "14:30")
// //     const target = new Date(base);
// //     if (departureTime) {
// //         const match = departureTime.match(/(\d{1,2}):(\d{2})/);
// //         if (match) {
// //             target.setHours(parseInt(match[1], 10), parseInt(match[2], 10), 0, 0);
// //         }
// //     }

// //     const diffMs = target.getTime() - Date.now();

// //     if (diffMs <= 0) {
// //         return { text: 'موعد الانطلاق حان', urgent: true };
// //     }

// //     const totalMinutes = Math.floor(diffMs / 60000);
// //     const days = Math.floor(totalMinutes / (60 * 24));
// //     const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
// //     const minutes = totalMinutes % 60;

// //     const parts: string[] = [];
// //     if (days > 0) parts.push(`${days} يوم`);
// //     if (hours > 0) parts.push(`${hours} ساعة`);
// //     if (days === 0 && minutes > 0) parts.push(`${minutes} دقيقة`);

// //     const text = parts.length > 0 ? `باقي ${parts.join(' و ')} على الانطلاق` : 'باقي أقل من دقيقة على الانطلاق';
// //     const urgent = days === 0 && hours < 3;

// //     return { text, urgent };
// // }

// // function getStatusLabel(status: Trip['status']) {
// //     const map: Record<string, { label: string; pill: string; bar: string }> = {
// //         'Planned': { label: 'مخططة', pill: 'bg-green-500/10 text-green-600 border-green-500/20', bar: 'bg-green-500' },
// //         'In-Transit': { label: 'في الطريق', pill: 'bg-blue-500/10 text-blue-600 border-blue-500/20', bar: 'bg-blue-500 animate-pulse' },
// //         'Has_Offers': { label: 'لديها عروض', pill: 'bg-amber-500/10 text-amber-600 border-amber-500/20', bar: 'bg-amber-500' },
// //         'Negotiating': { label: 'تفاوض', pill: 'bg-orange-500/10 text-orange-600 border-orange-500/20', bar: 'bg-orange-500' },
// //     };
// //     return map[status] ?? { label: status, pill: 'bg-muted text-muted-foreground border-border', bar: 'bg-muted-foreground' };
// // }

// // // ─── Card ────────────────────────────────────────────────────────────────────
// // function CompetitorTripCard({ trip }: { trip: Trip }) {
// //     const [expanded, setExpanded] = useState(false);

// //     // تحديث العداد كل دقيقة
// //     const [tick, setTick] = useState(0);
// //     useEffect(() => {
// //         const interval = setInterval(() => setTick(t => t + 1), 60000);
// //         return () => clearInterval(interval);
// //     }, []);

// //     const countdown = useMemo(
// //         () => getDepartureCountdown(trip.departureDate, trip.departureTime),
// //         // eslint-disable-next-line react-hooks/exhaustive-deps
// //         [trip.departureDate, trip.departureTime, tick]
// //     );

// //     const available = trip.availableSeats ?? (trip.vehicleCapacity ?? 0);
// //     const total = trip.vehicleCapacity ?? available;
// //     const occupied = total - available;
// //     const occupancyPct = total > 0 ? Math.round((occupied / total) * 100) : 0;
// //     const isFull = available === 0;
// //     const isAlmostFull = !isFull && available <= 2;

// //     const { label, pill, bar } = getStatusLabel(trip.status);

// //     // السعر والعملة
// //     const price = trip.price;
// //     const currency = trip.currency ?? 'د.أ';

// //     // أجرة المقعد الواحد (نفس منطق BookingActionCard)
// //     const totalPrice = price ?? 0;
// //     const depositPct = trip.depositPercentage ?? 10;
// //     const depositAmt = ((totalPrice * depositPct) / 100).toFixed(2);
// //     const remainingAmt = (totalPrice - parseFloat(depositAmt)).toFixed(2);

// //     return (
// //         <div
// //             className={cn(
// //                 'group relative overflow-hidden rounded-2xl border border-[#BFAF78] bg-card transition-all duration-200',
// //                 'hover:border-border hover:shadow-md',
// //                 isFull && 'opacity-60',
// //             )}
// //         >
// //             {/* Left color bar */}
// //             {/* <div className={cn('absolute start-0 top-0 bottom-0 w-1 rounded-s-2xl', bar)} /> */}

// //             {/* Gradient bg */}
// //             <div className="absolute inset-0 bg-gradient-to-br from-muted/30 to-transparent opacity-40 pointer-events-none" />

// //             <div className="relative p-4 sm:p-5 space-y-4">

// //                 {/* المدة المتبقية على الانطلاق */}
// //                 {countdown && (
// //                     <div className="flex justify-center">
// //                         <p
// //                             className={cn(
// //                                 'flex items-center gap-1 text-[10px] font-bold rounded-full px-2 py-0.5 w-fit border',
// //                                 countdown.urgent
// //                                     ? 'bg-red-500/10 text-red-600 border-red-500/20'
// //                                     : 'bg-muted/50 text-muted-foreground border-border'
// //                             )}
// //                         >
// //                             <Clock className="h-3 w-3" />
// //                             {countdown.text}
// //                         </p>
// //                     </div>
// //                 )}

// //                 {/* Status pill */}
// //                 <div className="flex justify-center">
// //                     <p className={cn('text-[10px] font-bold uppercase tracking-wider border rounded-full px-2 py-0.5 w-fit', pill)}>
// //                         {label}
// //                     </p>
// //                 </div>

// //                 {/* ── Header: اسم الناقل + مسار ── */}
// //                 <div className="flex items-start justify-between gap-3">
// //                     <div className="flex items-center gap-3 min-w-0">
// //                         {/* Avatar بالحرف الأول */}
// //                         <div className="h-11 w-11 shrink-0 rounded-full border-2 border-background shadow-sm bg-primary/10 flex items-center justify-center">
// //                             <span className="font-black text-sm text-primary">
// //                                 {(trip.carrierName ?? 'ن').charAt(0).toUpperCase()}
// //                             </span>
// //                         </div>
// //                         <div className="min-w-0">
// //                             <p className="font-black text-sm text-foreground truncate leading-tight">
// //                                 {trip.carrierName ?? 'ناقل'}
// //                             </p>
// //                             <div className="flex items-center gap-2 mt-1">
// //                                 {/* نوع المركبة */}
// //                                 <Badge variant="outline" className="h-5 px-1.5 text-[10px] font-bold bg-muted/50 flex items-center gap-1">
// //                                     {trip.vehicleType?.toLowerCase().includes('bus') ||
// //                                         trip.vehicleType?.toLowerCase().includes('حافلة')
// //                                         ? <Bus className="h-3 w-3" />
// //                                         : <Car className="h-3 w-3" />
// //                                     }
// //                                     {trip.vehicleType ?? 'مركبة'}
// //                                 </Badge>
// //                                 {/* كود الرحلة */}
// //                                 <span className="text-[10px] text-muted-foreground font-mono">
// //                                     #{trip.id.slice(-5).toUpperCase()}
// //                                 </span>
// //                             </div>
// //                         </div>
// //                     </div>
// //                 </div>

// //                 {/* ── المسار والتاريخ ── */}
// //                 <div className="flex flex-wrap items-center gap-3  justify-between text-xs text-muted-foreground">
// //                     <span className="flex items-center gap-1 font-semibold text-foreground">
// //                         <MapPin className="h-3.5 w-3.5 text-primary" />
// //                         {trip.origin}
// //                         <ArrowRight className="h-3 w-3 text-muted-foreground" />
// //                         {trip.destination}
// //                     </span>
// //                     <span className="flex items-center gap-1">
// //                         <Calendar className="h-3.5 w-3.5" />
// //                         {formatDate(trip.departureDate)}
// //                     </span>
// //                     {trip.departureTime && (
// //                         <span className="flex items-center gap-1">
// //                             <Clock className="h-3.5 w-3.5" />
// //                             {trip.departureTime}
// //                         </span>
// //                     )}
// //                 </div>

// //                 {/* ── Financial summary (نفس بطاقة الحجز) ── */}
// //                 {/* <div className="grid grid-cols-3 gap-2 rounded-xl bg-muted/40 border border-border/50 p-3">
// //                     <div className="text-center">
// //                         <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">الإجمالي</p>
// //                         <p className="text-sm font-black text-foreground mt-0.5">
// //                             {price ?? '—'} <span className="text-[10px] font-bold text-muted-foreground">{currency}</span>
// //                         </p>
// //                     </div>
// //                     <div className="text-center border-x border-border/50">
// //                         <p className="text-[9px] font-bold text-green-600 uppercase tracking-wide">المدفوع</p>
// //                         <p className="text-sm font-black text-green-600 mt-0.5">{price ? depositAmt : '—'}</p>
// //                     </div>
// //                     <div className="text-center">
// //                         <p className="text-[9px] font-bold text-orange-500 uppercase tracking-wide">التحصيل</p>
// //                         <p className="text-sm font-black text-orange-500 mt-0.5">{price ? remainingAmt : '—'}</p>
// //                     </div>
// //                 </div> */}

// //                 {/* ── المقاعد (expandable) ── */}
// //                 <button
// //                     onClick={() => setExpanded(v => !v)}
// //                     className="w-full flex items-center justify-between text-[11px] font-bold text-muted-foreground hover:text-foreground transition-colors py-0.5"
// //                 >
// //                     <span className="flex items-center gap-1.5">
// //                         <Users className="h-3.5 w-3.5" />
// //                         المقاعد المتبقية ({available} / {total})
// //                     </span>
// //                     {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
// //                 </button>

// //                 {expanded && (
// //                     <div className="space-y-2 animate-in slide-in-from-top-1 duration-150">
// //                         {/* Progress bar */}
// //                         <div className="space-y-1">
// //                             <div className="h-2 rounded-full bg-muted overflow-hidden">
// //                                 <div
// //                                     className={cn(
// //                                         'h-full rounded-full transition-all',
// //                                         isFull ? 'bg-destructive' : isAlmostFull ? 'bg-orange-500' : 'bg-green-500',
// //                                     )}
// //                                     style={{ width: `${occupancyPct}%` }}
// //                                 />
// //                             </div>
// //                             <div className="flex justify-between text-[10px] text-muted-foreground">
// //                                 <span>{occupied} محجوز</span>
// //                                 <span
// //                                     className={cn(
// //                                         'font-bold',
// //                                         isFull ? 'text-destructive' : isAlmostFull ? 'text-orange-500' : 'text-green-600',
// //                                     )}
// //                                 >
// //                                     {isFull ? 'مكتملة' : isAlmostFull ? 'أوشكت تكتمل' : `${available} متاح`}
// //                                 </span>
// //                             </div>
// //                         </div>

// //                         {/* تفاصيل إضافية */}
// //                         <div className="rounded-xl border border-border/50 bg-muted/30 p-3 space-y-1.5 text-xs">
// //                             {trip.meetingPoint && (
// //                                 <div className="flex justify-between">
// //                                     <span className="text-muted-foreground">نقطة الالتقاء</span>
// //                                     <span className="font-bold">{trip.meetingPoint}</span>
// //                                 </div>
// //                             )}
// //                             {trip.numberOfStops != null && (
// //                                 <div className="flex justify-between">
// //                                     <span className="text-muted-foreground">عدد المحطات</span>
// //                                     <span className="font-bold">{trip.numberOfStops}</span>
// //                                 </div>
// //                             )}
// //                             {trip.bagsPerSeat != null && (
// //                                 <div className="flex justify-between">
// //                                     <span className="text-muted-foreground">حقائب / مقعد</span>
// //                                     <span className="font-bold">{trip.bagsPerSeat}</span>
// //                                 </div>
// //                             )}
// //                             {trip.estimatedDurationHours != null && (
// //                                 <div className="flex justify-between">
// //                                     <span className="text-muted-foreground">مدة الرحلة</span>
// //                                     <span className="font-bold">{trip.estimatedDurationHours} ساعة</span>
// //                                 </div>
// //                             )}
// //                             {trip.depositPercentage != null && (
// //                                 <div className="flex justify-between">
// //                                     <span className="text-muted-foreground">نسبة العربون</span>
// //                                     <span className="font-bold">{trip.depositPercentage}%</span>
// //                                 </div>
// //                             )}
// //                             {trip.conditions && (
// //                                 <div className="flex justify-between gap-3">
// //                                     <span className="text-muted-foreground shrink-0">الشروط</span>
// //                                     <span className="font-bold text-end break-words">{trip.conditions}</span>
// //                                 </div>
// //                             )}
// //                         </div>
// //                     </div>
// //                 )}
// //             </div>
// //         </div>
// //     );
// // }

// // // ─── Route Group ─────────────────────────────────────────────────────────────
// // function RouteGroup({ origin, destination, trips }: { origin: string; destination: string; trips: Trip[] }) {
// //     const [open, setOpen] = useState(true);
// //     const totalSeats = trips.reduce((s, t) => s + (t.availableSeats ?? t.vehicleCapacity ?? 0), 0);

// //     return (
// //         <div className="rounded-2xl border border-[#BFAF78] bg-background shadow-sm overflow-hidden">
// //             <button
// //                 className="w-full flex items-center justify-between px-4 py-3 bg-primary/5 hover:bg-primary/10 transition-colors"
// //                 onClick={() => setOpen(p => !p)}
// //             >
// //                 <div className="flex items-center gap-2 font-semibold text-sm">
// //                     <Route className="h-4 w-4 text-primary" />
// //                     <span>{origin}</span>
// //                     <ArrowRight className="h-3 w-3 text-muted-foreground" />
// //                     <span>{destination}</span>
// //                 </div>
// //                 <div className="flex items-center gap-3 text-xs text-muted-foreground">
// //                     <span>{trips.length} رحلة · {totalSeats} مقعد متاح</span>
// //                     {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
// //                 </div>
// //             </button>

// //             {open && (
// //                 <div className="p-3 grid grid-cols-1 sm:grid-cols-2  gap-3">
// //                     {trips.map(trip => (
// //                         <CompetitorTripCard key={trip.id} trip={trip} />
// //                     ))}
// //                 </div>
// //             )}
// //         </div>
// //     );
// // }

// // // ─── Loading ──────────────────────────────────────────────────────────────────
// // function LoadingState() {
// //     return (
// //         <div className="space-y-4 pt-4">
// //             {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-52 w-full rounded-2xl" />)}
// //         </div>
// //     );
// // }

// // // ─── Page ─────────────────────────────────────────────────────────────────────
// // export default function MarketRoutesPage() {
// //     const { user } = useUser();
// //     const firestore = useFirestore();

// //     // رحلاتي النشطة — عشان نعرف المسارات
// //     const myTripsQuery = useMemoFirebase(() => {
// //         if (!firestore || !user?.uid) return null;
// //         return query(
// //             collection(firestore, 'trips'),
// //             where('carrierId', '==', user.uid),
// //             where('status', 'in', ['Planned', 'In-Transit', 'Has_Offers', 'Negotiating', 'Pending-Carrier-Confirmation']),
// //         );
// //     }, [firestore, user]);

// //     const { data: myTrips, isLoading: myLoading } = useCollection<Trip>(myTripsQuery);

// //     // كل الرحلات النشطة في النظام
// //     const allActiveQuery = useMemoFirebase(() => {
// //         if (!firestore) return null;
// //         return query(
// //             collection(firestore, 'trips'),
// //             where('status', 'in', ['Planned', 'In-Transit']),
// //         );
// //     }, [firestore]);

// //     const { data: allTrips, isLoading: allLoading } = useCollection<Trip>(allActiveQuery);

// //     const isLoading = myLoading || allLoading;

// //     // المسارات الخاصة بي
// //     const myRoutes = useMemo(() => {
// //         if (!myTrips) return new Set<string>();
// //         return new Set(myTrips.map(t => `${t.origin}__${t.destination}`));
// //     }, [myTrips]);

// //     // رحلات المنافسين على نفس مساراتي
// //     const competitorTrips = useMemo(() => {
// //         if (!allTrips || !user?.uid) return [];
// //         return allTrips.filter(t => t.carrierId !== user.uid && myRoutes.has(`${t.origin}__${t.destination}`));
// //     }, [allTrips, user, myRoutes]);

// //     // تجميع حسب المسار
// //     const grouped = useMemo(() => {
// //         const map = new Map<string, { origin: string; destination: string; trips: Trip[] }>();
// //         for (const trip of competitorTrips) {
// //             const key = `${trip.origin}__${trip.destination}`;
// //             if (!map.has(key)) map.set(key, { origin: trip.origin, destination: trip.destination, trips: [] });
// //             map.get(key)!.trips.push(trip);
// //         }
// //         return [...map.values()].sort((a, b) => b.trips.length - a.trips.length);
// //     }, [competitorTrips]);

// //     const hasNoActiveTrips = !myLoading && (!myTrips || myTrips.length === 0);

// //     return (
// //         <div className="space-y-5 pt-4">
// //             <div>
// //                 <h1 className="text-xl font-bold flex items-center gap-2">
// //                     <Route className="h-5 w-5 text-primary" />
// //                     رحلات المنافسين على مساراتي
// //                 </h1>
// //                 <p className="text-sm text-muted-foreground mt-1">
// //                     رحلات الناقلين الآخرين في نفس مساراتك النشطة
// //                 </p>
// //             </div>

// //             {isLoading && <LoadingState />}

// //             {!isLoading && hasNoActiveTrips && (
// //                 <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
// //                     <Route className="h-12 w-12 text-muted-foreground/40" />
// //                     <p className="font-semibold text-muted-foreground">لا توجد رحلات نشطة</p>
// //                     <p className="text-sm text-muted-foreground/70">أنشئ رحلة نشطة أولاً لترى رحلات المنافسين</p>
// //                 </div>
// //             )}

// //             {!isLoading && !hasNoActiveTrips && grouped.length === 0 && (
// //                 <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
// //                     <Users className="h-12 w-12 text-muted-foreground/40" />
// //                     <p className="font-semibold text-muted-foreground">لا يوجد منافسون حالياً</p>
// //                     <p className="text-sm text-muted-foreground/70">لا توجد رحلات لناقلين آخرين على مساراتك</p>
// //                 </div>
// //             )}

// //             {!isLoading && grouped.map(group => (
// //                 <RouteGroup
// //                     key={`${group.origin}__${group.destination}`}
// //                     origin={group.origin}
// //                     destination={group.destination}
// //                     trips={group.trips}
// //                 />
// //             ))}
// //         </div>
// //     );
// // }
// 'use client';

// import { useMemo, useState, useEffect } from 'react';
// import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
// import { collection, query, where, documentId, doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
// import { useUserProfile } from '@/hooks/use-user-profile';
// import type { Trip, UserProfile } from '@/lib/data';
// import { Skeleton } from '@/components/ui/skeleton';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { ChatDialog } from '@/components/chat/chat-dialog';
// import {
//     MapPin,
//     Calendar,
//     Clock,
//     Users,
//     Car,
//     Bus,
//     ChevronDown,
//     ChevronUp,
//     ArrowRight,
//     Route,
//     Phone,
//     MessageSquare,
//     ArrowLeft,
// } from 'lucide-react';
// import { cn } from '@/lib/utils';

// // ─── Route group ID (نفس منطق صفحة الشاتات) ──────────────────────────────────
// function routeChatId(origin: string, destination: string) {
//     const [a, b] = [origin, destination].map(s => s.toLowerCase().replace(/\s+/g, '_'));
//     return `route_${a}_${b}`;
// }

// // ─── helpers ────────────────────────────────────────────────────────────────
// function formatDate(raw: any): string {
//     if (!raw) return '—';
//     const d = raw?.toDate?.() ?? new Date(raw);
//     if (isNaN(d.getTime())) return '—';
//     return d.toLocaleDateString('ar-EG', {
//         weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
//     });
// }

// function getDepartureCountdown(departureDate: any, departureTime?: string): { text: string; urgent: boolean } | null {
//     if (!departureDate) return null;

//     const base = departureDate?.toDate?.() ?? new Date(departureDate);
//     if (isNaN(base.getTime())) return null;

//     // دمج وقت الانطلاق لو موجود (مثال: "14:30")
//     const target = new Date(base);
//     if (departureTime) {
//         const match = departureTime.match(/(\d{1,2}):(\d{2})/);
//         if (match) {
//             target.setHours(parseInt(match[1], 10), parseInt(match[2], 10), 0, 0);
//         }
//     }

//     const diffMs = target.getTime() - Date.now();

//     if (diffMs <= 0) {
//         return { text: 'موعد الانطلاق حان', urgent: true };
//     }

//     const totalMinutes = Math.floor(diffMs / 60000);
//     const days = Math.floor(totalMinutes / (60 * 24));
//     const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
//     const minutes = totalMinutes % 60;

//     const parts: string[] = [];
//     if (days > 0) parts.push(`${days} يوم`);
//     if (hours > 0) parts.push(`${hours} ساعة`);
//     if (days === 0 && minutes > 0) parts.push(`${minutes} دقيقة`);

//     const text = parts.length > 0 ? `باقي ${parts.join(' و ')} على الانطلاق` : 'باقي أقل من دقيقة على الانطلاق';
//     const urgent = days === 0 && hours < 3;

//     return { text, urgent };
// }

// function getStatusLabel(status: Trip['status']) {
//     const map: Record<string, { label: string; pill: string; bar: string }> = {
//         'Planned': { label: 'مخططة', pill: 'bg-green-500/10 text-green-600 border-green-500/20', bar: 'bg-green-500' },
//         'In-Transit': { label: 'في الطريق', pill: 'bg-blue-500/10 text-blue-600 border-blue-500/20', bar: 'bg-blue-500 animate-pulse' },
//         'Has_Offers': { label: 'لديها عروض', pill: 'bg-amber-500/10 text-amber-600 border-amber-500/20', bar: 'bg-amber-500' },
//         'Negotiating': { label: 'تفاوض', pill: 'bg-orange-500/10 text-orange-600 border-orange-500/20', bar: 'bg-orange-500' },
//     };
//     return map[status] ?? { label: status, pill: 'bg-muted text-muted-foreground border-border', bar: 'bg-muted-foreground' };
// }

// // ─── Card ────────────────────────────────────────────────────────────────────
// function CompetitorTripCard({
//     trip,
//     carrierProfile,
//     onOpenRouteChat,
// }: {
//     trip: Trip;
//     carrierProfile?: UserProfile | null;
//     onOpenRouteChat: (origin: string, destination: string) => void;
// }) {
//     const [expanded, setExpanded] = useState(false);

//     // تحديث العداد كل دقيقة
//     const [tick, setTick] = useState(0);
//     useEffect(() => {
//         const interval = setInterval(() => setTick(t => t + 1), 60000);
//         return () => clearInterval(interval);
//     }, []);

//     const countdown = useMemo(
//         () => getDepartureCountdown(trip.departureDate, trip.departureTime),
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//         [trip.departureDate, trip.departureTime, tick]
//     );

//     const available = trip.availableSeats ?? (trip.vehicleCapacity ?? 0);
//     const total = trip.vehicleCapacity ?? available;
//     const occupied = total - available;
//     const occupancyPct = total > 0 ? Math.round((occupied / total) * 100) : 0;
//     const isFull = available === 0;
//     const isAlmostFull = !isFull && available <= 2;

//     const { label, pill, bar } = getStatusLabel(trip.status);

//     // السعر والعملة
//     const price = trip.price;
//     const currency = trip.currency ?? 'د.أ';

//     // أجرة المقعد الواحد (نفس منطق BookingActionCard)
//     const totalPrice = price ?? 0;
//     const depositPct = trip.depositPercentage ?? 10;
//     const depositAmt = ((totalPrice * depositPct) / 100).toFixed(2);
//     const remainingAmt = (totalPrice - parseFloat(depositAmt)).toFixed(2);

//     // رقم تلفون الناقل (كود الدولة + الرقم)
//     const carrierPhone = carrierProfile?.phoneNumber
//         ? `${carrierProfile.phoneCountryCode ?? ''}${carrierProfile.phoneNumber}`.trim()
//         : null;

//     return (
//         <div
//             className={cn(
//                 'group relative overflow-hidden rounded-2xl border border-[#BFAF78] bg-card transition-all duration-200',
//                 'hover:border-border hover:shadow-md',
//                 isFull && 'opacity-60',
//             )}
//         >
//             {/* Left color bar */}
//             {/* <div className={cn('absolute start-0 top-0 bottom-0 w-1 rounded-s-2xl', bar)} /> */}

//             {/* Gradient bg */}
//             <div className="absolute inset-0 bg-gradient-to-br from-muted/30 to-transparent opacity-40 pointer-events-none" />

//             <div className="relative p-4 sm:p-5 space-y-4">

//                 {/* المدة المتبقية على الانطلاق */}
//                 {countdown && (
//                     <div className="flex justify-center">
//                         <p
//                             className={cn(
//                                 'flex items-center gap-1 text-[10px] font-bold rounded-full px-2 py-0.5 w-fit border',
//                                 countdown.urgent
//                                     ? 'bg-red-500/10 text-red-600 border-red-500/20'
//                                     : 'bg-muted/50 text-muted-foreground border-border'
//                             )}
//                         >
//                             <Clock className="h-3 w-3" />
//                             {countdown.text}
//                         </p>
//                     </div>
//                 )}

//                 {/* Status pill */}
//                 <div className="flex justify-center">
//                     <p className={cn('text-[10px] font-bold uppercase tracking-wider border rounded-full px-2 py-0.5 w-fit', pill)}>
//                         {label}
//                     </p>
//                 </div>

//                 {/* ── Header: اسم الناقل + مسار ── */}
//                 <div className="flex items-start justify-between gap-3">
//                     <div className="flex items-center gap-3 min-w-0">
//                         {/* Avatar بالحرف الأول */}
//                         <div className="h-11 w-11 shrink-0 rounded-full border-2 border-background shadow-sm bg-primary/10 flex items-center justify-center">
//                             <span className="font-black text-sm text-primary">
//                                 {(trip.carrierName ?? 'ن').charAt(0).toUpperCase()}
//                             </span>
//                         </div>
//                         <div className="min-w-0">
//                             <p className="font-black text-sm text-foreground truncate leading-tight">
//                                 {trip.carrierName ?? 'ناقل'}
//                             </p>
//                             {carrierPhone && (
//                                 <a
//                                     href={`tel:${carrierPhone}`}
//                                     className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground hover:text-primary transition-colors mt-0.5"
//                                     dir="ltr"
//                                 >
//                                     <Phone className="h-3 w-3" />
//                                     {carrierPhone}
//                                 </a>
//                             )}
//                             <div className="flex items-center gap-2 mt-1">
//                                 {/* نوع المركبة */}
//                                 <Badge variant="outline" className="h-5 px-1.5 text-[10px] font-bold bg-muted/50 flex items-center gap-1">
//                                     {trip.vehicleType?.toLowerCase().includes('bus') ||
//                                         trip.vehicleType?.toLowerCase().includes('حافلة')
//                                         ? <Bus className="h-3 w-3" />
//                                         : <Car className="h-3 w-3" />
//                                     }
//                                     {trip.vehicleType ?? 'مركبة'}
//                                 </Badge>
//                                 {/* كود الرحلة */}
//                                 <span className="text-[10px] text-muted-foreground font-mono">
//                                     #{trip.id.slice(-5).toUpperCase()}
//                                 </span>
//                             </div>
//                         </div>
//                     </div>

//                     {/* أيقونة المحادثة الجماعية الخاصة بالمسار */}
//                     <Button
//                         variant="outline"
//                         size="icon"
//                         className="h-8 w-8 shrink-0 rounded-full"
//                         onClick={() => onOpenRouteChat(trip.origin, trip.destination)}
//                         title="محادثة جماعية للمسار"
//                     >
//                         <MessageSquare className="h-4 w-4" />
//                     </Button>
//                 </div>

//                 {/* ── المسار والتاريخ ── */}
//                 <div className="flex flex-wrap items-center gap-3  justify-between text-xs text-muted-foreground">
//                     <span className="flex items-center gap-1 font-semibold text-foreground">
//                         <MapPin className="h-3.5 w-3.5 text-primary" />
//                         {trip.origin}
//                         <ArrowLeft className="h-3 w-3 text-muted-foreground" />
//                         {trip.destination}
//                     </span>
//                     <span className="flex items-center gap-1">
//                         <Calendar className="h-3.5 w-3.5" />
//                         {formatDate(trip.departureDate)}
//                     </span>
//                     {trip.departureTime && (
//                         <span className="flex items-center gap-1">
//                             <Clock className="h-3.5 w-3.5" />
//                             {trip.departureTime}
//                         </span>
//                     )}
//                 </div>


//                 {/* ── المقاعد (expandable) ── */}
//                 <button
//                     onClick={() => setExpanded(v => !v)}
//                     className="w-full flex items-center justify-between text-[11px] font-bold text-muted-foreground hover:text-foreground transition-colors py-0.5"
//                 >
//                     <span className="flex items-center gap-1.5">
//                         <Users className="h-3.5 w-3.5" />
//                         المقاعد المتبقية ({available} / {total})
//                     </span>
//                     {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
//                 </button>

//                 {expanded && (
//                     <div className="space-y-2 animate-in slide-in-from-top-1 duration-150">
//                         {/* Progress bar */}
//                         <div className="space-y-1">
//                             <div className="h-2 rounded-full bg-muted overflow-hidden">
//                                 <div
//                                     className={cn(
//                                         'h-full rounded-full transition-all',
//                                         isFull ? 'bg-destructive' : isAlmostFull ? 'bg-orange-500' : 'bg-green-500',
//                                     )}
//                                     style={{ width: `${occupancyPct}%` }}
//                                 />
//                             </div>
//                             <div className="flex justify-between text-[10px] text-muted-foreground">
//                                 <span>{occupied} محجوز</span>
//                                 <span
//                                     className={cn(
//                                         'font-bold',
//                                         isFull ? 'text-destructive' : isAlmostFull ? 'text-orange-500' : 'text-green-600',
//                                     )}
//                                 >
//                                     {isFull ? 'مكتملة' : isAlmostFull ? 'أوشكت تكتمل' : `${available} متاح`}
//                                 </span>
//                             </div>
//                         </div>

//                         {/* تفاصيل إضافية */}
//                         <div className="rounded-xl border border-border/50 bg-muted/30 p-3 space-y-1.5 text-xs">
//                             {trip.meetingPoint && (
//                                 <div className="flex justify-between">
//                                     <span className="text-muted-foreground">نقطة الالتقاء</span>
//                                     <span className="font-bold">{trip.meetingPoint}</span>
//                                 </div>
//                             )}
//                             {trip.numberOfStops != null && (
//                                 <div className="flex justify-between">
//                                     <span className="text-muted-foreground">عدد المحطات</span>
//                                     <span className="font-bold">{trip.numberOfStops}</span>
//                                 </div>
//                             )}
//                             {trip.bagsPerSeat != null && (
//                                 <div className="flex justify-between">
//                                     <span className="text-muted-foreground">حقائب / مقعد</span>
//                                     <span className="font-bold">{trip.bagsPerSeat}</span>
//                                 </div>
//                             )}
//                             {trip.estimatedDurationHours != null && (
//                                 <div className="flex justify-between">
//                                     <span className="text-muted-foreground">مدة الرحلة</span>
//                                     <span className="font-bold">{trip.estimatedDurationHours} ساعة</span>
//                                 </div>
//                             )}
//                             {trip.depositPercentage != null && (
//                                 <div className="flex justify-between">
//                                     <span className="text-muted-foreground">نسبة العربون</span>
//                                     <span className="font-bold">{trip.depositPercentage}%</span>
//                                 </div>
//                             )}
//                             {trip.conditions && (
//                                 <div className="flex justify-between gap-3">
//                                     <span className="text-muted-foreground shrink-0">الشروط</span>
//                                     <span className="font-bold text-end break-words">{trip.conditions}</span>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

// // ─── Route Group ─────────────────────────────────────────────────────────────
// function RouteGroup({
//     origin,
//     destination,
//     trips,
//     carriersMap,
//     onOpenRouteChat,
// }: {
//     origin: string;
//     destination: string;
//     trips: Trip[];
//     carriersMap: Map<string, UserProfile>;
//     onOpenRouteChat: (origin: string, destination: string) => void;
// }) {
//     const [open, setOpen] = useState(true);
//     const totalSeats = trips.reduce((s, t) => s + (t.availableSeats ?? t.vehicleCapacity ?? 0), 0);

//     return (
//         <div className="rounded-2xl border border-[#BFAF78] bg-background shadow-sm overflow-hidden">
//             <button
//                 className="w-full flex items-center justify-between px-4 py-3 bg-primary/5 hover:bg-primary/10 transition-colors"
//                 onClick={() => setOpen(p => !p)}
//             >
//                 <div className="flex items-center gap-2 font-semibold text-sm">
//                     <Route className="h-4 w-4 text-primary" />
//                     <span>{origin}</span>
//                     <ArrowLeft className="h-3 w-3 text-muted-foreground" />
//                     <span>{destination}</span>
//                 </div>
//                 <div className="flex items-center gap-3 text-xs text-muted-foreground">
//                     <span>{trips.length} رحلة · {totalSeats} مقعد متاح</span>
//                     {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
//                 </div>
//             </button>

//             {open && (
//                 <div className="p-3 grid grid-cols-1 sm:grid-cols-2  gap-3">
//                     {trips.map(trip => (
//                         <CompetitorTripCard
//                             key={trip.id}
//                             trip={trip}
//                             carrierProfile={trip.carrierId ? carriersMap.get(trip.carrierId) : null}
//                             onOpenRouteChat={onOpenRouteChat}
//                         />
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// }

// // ─── Loading ──────────────────────────────────────────────────────────────────
// function LoadingState() {
//     return (
//         <div className="space-y-4 pt-4">
//             {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-52 w-full rounded-2xl" />)}
//         </div>
//     );
// }

// // ─── Page ─────────────────────────────────────────────────────────────────────
// export default function MarketRoutesPage() {
//     const { user } = useUser();
//     const firestore = useFirestore();
//     const { profile } = useUserProfile();

//     const [activeRouteChatId, setActiveRouteChatId] = useState<string | null>(null);
//     const [isChatOpen, setIsChatOpen] = useState(false);
//     const [isJoiningChat, setIsJoiningChat] = useState(false);

//     // رحلاتي النشطة — عشان نعرف المسارات
//     const myTripsQuery = useMemoFirebase(() => {
//         if (!firestore || !user?.uid) return null;
//         return query(
//             collection(firestore, 'trips'),
//             where('carrierId', '==', user.uid),
//             where('status', 'in', ['Planned', 'In-Transit', 'Has_Offers', 'Negotiating', 'Pending-Carrier-Confirmation']),
//         );
//     }, [firestore, user]);

//     const { data: myTrips, isLoading: myLoading } = useCollection<Trip>(myTripsQuery);

//     // كل الرحلات النشطة في النظام
//     const allActiveQuery = useMemoFirebase(() => {
//         if (!firestore) return null;
//         return query(
//             collection(firestore, 'trips'),
//             where('status', 'in', ['Planned', 'In-Transit']),
//         );
//     }, [firestore]);

//     const { data: allTrips, isLoading: allLoading } = useCollection<Trip>(allActiveQuery);

//     const isLoading = myLoading || allLoading;

//     // المسارات الخاصة بي
//     const myRoutes = useMemo(() => {
//         if (!myTrips) return new Set<string>();
//         return new Set(myTrips.map(t => `${t.origin}__${t.destination}`));
//     }, [myTrips]);

//     // رحلات المنافسين على نفس مساراتي
//     const competitorTrips = useMemo(() => {
//         if (!allTrips || !user?.uid) return [];
//         return allTrips.filter(t => t.carrierId !== user.uid && myRoutes.has(`${t.origin}__${t.destination}`));
//     }, [allTrips, user, myRoutes]);

//     // معرّفات الناقلين المنافسين (لجلب أرقام تلفوناتهم دفعة واحدة)
//     const competitorCarrierIds = useMemo(() => {
//         const ids = competitorTrips.map(t => t.carrierId).filter(Boolean) as string[];
//         return [...new Set(ids)].slice(0, 30); // حد Firestore الأقصى لاستعلام "in"
//     }, [competitorTrips]);

//     const carriersQuery = useMemoFirebase(() => {
//         if (!firestore || competitorCarrierIds.length === 0) return null;
//         return query(collection(firestore, 'users'), where(documentId(), 'in', competitorCarrierIds));
//     }, [firestore, competitorCarrierIds]);

//     const { data: carriers } = useCollection<UserProfile>(carriersQuery);

//     const carriersMap = useMemo(() => {
//         const map = new Map<string, UserProfile>();
//         carriers?.forEach(c => map.set(c.id, c));
//         return map;
//     }, [carriers]);

//     // تجميع حسب المسار
//     const grouped = useMemo(() => {
//         const map = new Map<string, { origin: string; destination: string; trips: Trip[] }>();
//         for (const trip of competitorTrips) {
//             const key = `${trip.origin}__${trip.destination}`;
//             if (!map.has(key)) map.set(key, { origin: trip.origin, destination: trip.destination, trips: [] });
//             map.get(key)!.trips.push(trip);
//         }
//         return [...map.values()].sort((a, b) => b.trips.length - a.trips.length);
//     }, [competitorTrips]);

//     const hasNoActiveTrips = !myLoading && (!myTrips || myTrips.length === 0);

//     // اسم الناقل الحالي (لرسالة "انضم لجروب المسار")
//     const myName = useMemo(() => {
//         return profile?.firstName || profile?.fullName || profile?.displayName || user?.email?.split('@')[0] || 'ناقل';
//     }, [profile, user]);

//     // فتح/الانضمام لمحادثة المسار الجماعية (نفس منطق RouteChatCard في صفحة الشاتات)
//     const handleOpenRouteChat = async (origin: string, destination: string) => {
//         if (!firestore || !user?.uid) return;
//         const chatId = routeChatId(origin, destination);
//         setIsJoiningChat(true);
//         try {
//             const chatSnap = await getDoc(doc(firestore, 'chats', chatId));
//             if (!chatSnap.exists()) {
//                 await setDoc(doc(firestore, 'chats', chatId), {
//                     id: chatId,
//                     isGroupChat: true,
//                     isCarrierRouteGroup: true,
//                     routeOrigin: origin,
//                     routeDestination: destination,
//                     participants: [user.uid],
//                     unreadCounts: { [user.uid]: 0 },
//                     isClosed: false,
//                     lastMessage: `${myName} انضم لجروب المسار`,
//                     lastMessageSenderId: 'system',
//                     lastMessageTimestamp: serverTimestamp(),
//                 });
//             } else {
//                 const data = chatSnap.data();
//                 if (!data?.participants?.includes(user.uid)) {
//                     await updateDoc(doc(firestore, 'chats', chatId), {
//                         participants: [...(data.participants || []), user.uid],
//                         [`unreadCounts.${user.uid}`]: 0,
//                         lastMessage: `${myName} انضم لجروب المسار`,
//                         lastMessageTimestamp: serverTimestamp(),
//                     });
//                 }
//             }
//             setActiveRouteChatId(chatId);
//             setIsChatOpen(true);
//         } finally {
//             setIsJoiningChat(false);
//         }
//     };

//     return (
//         <div className="space-y-5 pt-4">
//             <div>
//                 <h1 className="text-xl font-bold flex items-center gap-2">
//                     <Route className="h-5 w-5 text-primary" />
//                     رحلات الناقلين على مساراتي
//                 </h1>
//                 <p className="text-sm text-muted-foreground mt-1">
//                     رحلات الناقلين الآخرين في نفس مساراتك النشطة
//                 </p>
//             </div>

//             {isLoading && <LoadingState />}

//             {!isLoading && hasNoActiveTrips && (
//                 <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
//                     <Route className="h-12 w-12 text-muted-foreground/40" />
//                     <p className="font-semibold text-muted-foreground">لا توجد رحلات نشطة</p>
//                     <p className="text-sm text-muted-foreground/70">أنشئ رحلة نشطة أولاً لترى رحلات الناقلين</p>
//                 </div>
//             )}

//             {!isLoading && !hasNoActiveTrips && grouped.length === 0 && (
//                 <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
//                     <Users className="h-12 w-12 text-muted-foreground/40" />
//                     <p className="font-semibold text-muted-foreground">لا يوجد منافسون حالياً</p>
//                     <p className="text-sm text-muted-foreground/70">لا توجد رحلات لناقلين آخرين على مساراتك</p>
//                 </div>
//             )}

//             {!isLoading && grouped.map(group => (
//                 <RouteGroup
//                     key={`${group.origin}__${group.destination}`}
//                     origin={group.origin}
//                     destination={group.destination}
//                     trips={group.trips}
//                     carriersMap={carriersMap}
//                     onOpenRouteChat={handleOpenRouteChat}
//                 />
//             ))}

//             {activeRouteChatId && (
//                 <ChatDialog
//                     isOpen={isChatOpen}
//                     onOpenChange={(open) => { setIsChatOpen(open); if (!open) setActiveRouteChatId(null); }}
//                     trip={{ id: activeRouteChatId } as Trip}
//                     chatType="group"
//                 />
//             )}
//         </div>
//     );
// }

'use client';

import { useMemo, useState, useEffect } from 'react';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, documentId, doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useUserProfile } from '@/hooks/use-user-profile';
import type { Trip, UserProfile } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChatDialog } from '@/components/chat/chat-dialog';
import {
    MapPin,
    Calendar,
    Clock,
    Users,
    Car,
    Bus,
    ChevronDown,
    ChevronUp,
    ArrowRight,
    Route,
    Phone,
    MessageSquare,
    ArrowLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Route group ID (نفس منطق صفحة الشاتات) ──────────────────────────────────
function routeChatId(origin: string, destination: string) {
    const [a, b] = [origin, destination].map(s => s.toLowerCase().replace(/\s+/g, '_'));
    return `route_${a}_${b}`;
}

// ─── helpers ────────────────────────────────────────────────────────────────
function formatDate(raw: any): string {
    if (!raw) return '—';
    const d = raw?.toDate?.() ?? new Date(raw);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('ar-EG', {
        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
    });
}

function getDepartureCountdown(departureDate: any, departureTime?: string): { text: string; urgent: boolean } | null {
    if (!departureDate) return null;

    const base = departureDate?.toDate?.() ?? new Date(departureDate);
    if (isNaN(base.getTime())) return null;

    // دمج وقت الانطلاق لو موجود (مثال: "14:30")
    const target = new Date(base);
    if (departureTime) {
        const match = departureTime.match(/(\d{1,2}):(\d{2})/);
        if (match) {
            target.setHours(parseInt(match[1], 10), parseInt(match[2], 10), 0, 0);
        }
    }

    const diffMs = target.getTime() - Date.now();

    if (diffMs <= 0) {
        return { text: 'موعد الانطلاق حان', urgent: true };
    }

    const totalMinutes = Math.floor(diffMs / 60000);
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;

    const parts: string[] = [];
    if (days > 0) parts.push(`${days} يوم`);
    if (hours > 0) parts.push(`${hours} ساعة`);
    if (days === 0 && minutes > 0) parts.push(`${minutes} دقيقة`);

    const text = parts.length > 0 ? `باقي ${parts.join(' و ')} على الانطلاق` : 'باقي أقل من دقيقة على الانطلاق';
    const urgent = days === 0 && hours < 3;

    return { text, urgent };
}

// هل وقت انطلاق الرحلة قد حان أو فات؟
function hasDeparted(departureDate: any, departureTime?: string): boolean {
    if (!departureDate) return false;

    const base = departureDate?.toDate?.() ?? new Date(departureDate);
    if (isNaN(base.getTime())) return false;

    const target = new Date(base);
    if (departureTime) {
        const match = departureTime.match(/(\d{1,2}):(\d{2})/);
        if (match) {
            target.setHours(parseInt(match[1], 10), parseInt(match[2], 10), 0, 0);
        }
    }

    return target.getTime() - Date.now() <= 0;
}

function getStatusLabel(status: Trip['status']) {
    const map: Record<string, { label: string; pill: string; bar: string }> = {
        'Planned': { label: 'مخططة', pill: 'bg-green-500/10 text-green-600 border-green-500/20', bar: 'bg-green-500' },
        'In-Transit': { label: 'في الطريق', pill: 'bg-blue-500/10 text-blue-600 border-blue-500/20', bar: 'bg-blue-500 animate-pulse' },
        'Has_Offers': { label: 'لديها عروض', pill: 'bg-amber-500/10 text-amber-600 border-amber-500/20', bar: 'bg-amber-500' },
        'Negotiating': { label: 'تفاوض', pill: 'bg-orange-500/10 text-orange-600 border-orange-500/20', bar: 'bg-orange-500' },
    };
    return map[status] ?? { label: status, pill: 'bg-muted text-muted-foreground border-border', bar: 'bg-muted-foreground' };
}

// ─── Card ────────────────────────────────────────────────────────────────────
function CompetitorTripCard({
    trip,
    carrierProfile,
    onOpenRouteChat,
}: {
    trip: Trip;
    carrierProfile?: UserProfile | null;
    onOpenRouteChat: (origin: string, destination: string) => void;
}) {
    const [expanded, setExpanded] = useState(false);

    // تحديث العداد كل دقيقة
    const [tick, setTick] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => setTick(t => t + 1), 60000);
        return () => clearInterval(interval);
    }, []);

    const countdown = useMemo(
        () => getDepartureCountdown(trip.departureDate, trip.departureTime),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [trip.departureDate, trip.departureTime, tick]
    );

    const available = trip.availableSeats ?? (trip.vehicleCapacity ?? 0);
    const total = trip.vehicleCapacity ?? available;
    const occupied = total - available;
    const occupancyPct = total > 0 ? Math.round((occupied / total) * 100) : 0;
    const isFull = available === 0;
    const isAlmostFull = !isFull && available <= 2;

    const { label, pill, bar } = getStatusLabel(trip.status);

    // السعر والعملة
    const price = trip.price;
    const currency = trip.currency ?? 'د.أ';

    // أجرة المقعد الواحد (نفس منطق BookingActionCard)
    const totalPrice = price ?? 0;
    const depositPct = trip.depositPercentage ?? 10;
    const depositAmt = ((totalPrice * depositPct) / 100).toFixed(2);
    const remainingAmt = (totalPrice - parseFloat(depositAmt)).toFixed(2);

    // رقم تلفون الناقل (كود الدولة + الرقم)
    const carrierPhone = carrierProfile?.phoneNumber
        ? `${carrierProfile.phoneCountryCode ?? ''}${carrierProfile.phoneNumber}`.trim()
        : null;

    return (
        <div
            className={cn(
                'group relative overflow-hidden rounded-2xl border border-[#BFAF78] bg-card transition-all duration-200',
                'hover:border-border hover:shadow-md',
                isFull && 'opacity-60',
            )}
        >
            {/* Left color bar */}
            {/* <div className={cn('absolute start-0 top-0 bottom-0 w-1 rounded-s-2xl', bar)} /> */}

            {/* Gradient bg */}
            <div className="absolute inset-0 bg-gradient-to-br from-muted/30 to-transparent opacity-40 pointer-events-none" />

            <div className="relative p-4 sm:p-5 space-y-4">

                {/* المدة المتبقية على الانطلاق */}
                {countdown && (
                    <div className="flex justify-center">
                        <p
                            className={cn(
                                'flex items-center gap-1 text-[10px] font-bold rounded-full px-2 py-0.5 w-fit border',
                                countdown.urgent
                                    ? 'bg-red-500/10 text-red-600 border-red-500/20'
                                    : 'bg-muted/50 text-muted-foreground border-border'
                            )}
                        >
                            <Clock className="h-3 w-3" />
                            {countdown.text}
                        </p>
                    </div>
                )}

                {/* Status pill */}
                <div className="flex justify-center">
                    <p className={cn('text-[10px] font-bold uppercase tracking-wider border rounded-full px-2 py-0.5 w-fit', pill)}>
                        {label}
                    </p>
                </div>

                {/* ── Header: اسم الناقل + مسار ── */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        {/* Avatar بالحرف الأول */}
                        <div className="h-11 w-11 shrink-0 rounded-full border-2 border-background shadow-sm bg-primary/10 flex items-center justify-center">
                            <span className="font-black text-sm text-primary">
                                {(trip.carrierName ?? 'ن').charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="min-w-0">
                            <p className="font-black text-sm text-foreground truncate leading-tight">
                                {trip.carrierName ?? 'ناقل'}
                            </p>
                            {carrierPhone && (
                                <a
                                    href={`tel:${carrierPhone}`}
                                    className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground hover:text-primary transition-colors mt-0.5"
                                    dir="ltr"
                                >
                                    <Phone className="h-3 w-3" />
                                    {carrierPhone}
                                </a>
                            )}
                            <div className="flex items-center gap-2 mt-1">
                                {/* نوع المركبة */}
                                <Badge variant="outline" className="h-5 px-1.5 text-[10px] font-bold bg-muted/50 flex items-center gap-1">
                                    {trip.vehicleType?.toLowerCase().includes('bus') ||
                                        trip.vehicleType?.toLowerCase().includes('حافلة')
                                        ? <Bus className="h-3 w-3" />
                                        : <Car className="h-3 w-3" />
                                    }
                                    {trip.vehicleType ?? 'مركبة'}
                                </Badge>
                                {/* كود الرحلة */}
                                <span className="text-[10px] text-muted-foreground font-mono">
                                    #{trip.id.slice(-5).toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* أيقونة المحادثة الجماعية الخاصة بالمسار */}
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 shrink-0 rounded-full"
                        onClick={() => onOpenRouteChat(trip.origin, trip.destination)}
                        title="محادثة جماعية للمسار"
                    >
                        <MessageSquare className="h-4 w-4" />
                    </Button>
                </div>

                {/* ── المسار والتاريخ ── */}
                <div className="flex flex-wrap items-center gap-3  justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 font-semibold text-foreground">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        {trip.origin}
                        <ArrowLeft className="h-3 w-3 text-muted-foreground" />
                        {trip.destination}
                    </span>
                    <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(trip.departureDate)}
                    </span>
                    {trip.departureTime && (
                        <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {trip.departureTime}
                        </span>
                    )}
                </div>


                {/* ── المقاعد (expandable) ── */}
                <button
                    onClick={() => setExpanded(v => !v)}
                    className="w-full flex items-center justify-between text-[11px] font-bold text-muted-foreground hover:text-foreground transition-colors py-0.5"
                >
                    <span className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" />
                        المقاعد المتبقية ({available} / {total})
                    </span>
                    {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                </button>

                {expanded && (
                    <div className="space-y-2 animate-in slide-in-from-top-1 duration-150">
                        {/* Progress bar */}
                        <div className="space-y-1">
                            <div className="h-2 rounded-full bg-muted overflow-hidden">
                                <div
                                    className={cn(
                                        'h-full rounded-full transition-all',
                                        isFull ? 'bg-destructive' : isAlmostFull ? 'bg-orange-500' : 'bg-green-500',
                                    )}
                                    style={{ width: `${occupancyPct}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-[10px] text-muted-foreground">
                                <span>{occupied} محجوز</span>
                                <span
                                    className={cn(
                                        'font-bold',
                                        isFull ? 'text-destructive' : isAlmostFull ? 'text-orange-500' : 'text-green-600',
                                    )}
                                >
                                    {isFull ? 'مكتملة' : isAlmostFull ? 'أوشكت تكتمل' : `${available} متاح`}
                                </span>
                            </div>
                        </div>

                        {/* تفاصيل إضافية */}
                        <div className="rounded-xl border border-border/50 bg-muted/30 p-3 space-y-1.5 text-xs">
                            {trip.meetingPoint && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">نقطة الالتقاء</span>
                                    <span className="font-bold">{trip.meetingPoint}</span>
                                </div>
                            )}
                            {trip.numberOfStops != null && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">عدد المحطات</span>
                                    <span className="font-bold">{trip.numberOfStops}</span>
                                </div>
                            )}
                            {trip.bagsPerSeat != null && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">حقائب / مقعد</span>
                                    <span className="font-bold">{trip.bagsPerSeat}</span>
                                </div>
                            )}
                            {trip.estimatedDurationHours != null && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">مدة الرحلة</span>
                                    <span className="font-bold">{trip.estimatedDurationHours} ساعة</span>
                                </div>
                            )}
                            {trip.depositPercentage != null && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">نسبة العربون</span>
                                    <span className="font-bold">{trip.depositPercentage}%</span>
                                </div>
                            )}
                            {trip.conditions && (
                                <div className="flex justify-between gap-3">
                                    <span className="text-muted-foreground shrink-0">الشروط</span>
                                    <span className="font-bold text-end break-words">{trip.conditions}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Route Group ─────────────────────────────────────────────────────────────
function RouteGroup({
    origin,
    destination,
    trips,
    carriersMap,
    onOpenRouteChat,
}: {
    origin: string;
    destination: string;
    trips: Trip[];
    carriersMap: Map<string, UserProfile>;
    onOpenRouteChat: (origin: string, destination: string) => void;
}) {
    const [open, setOpen] = useState(true);
    const totalSeats = trips.reduce((s, t) => s + (t.availableSeats ?? t.vehicleCapacity ?? 0), 0);

    return (
        <div className="rounded-2xl border border-[#BFAF78] bg-background shadow-sm overflow-hidden">
            <button
                className="w-full flex items-center justify-between px-4 py-3 bg-primary/5 hover:bg-primary/10 transition-colors"
                onClick={() => setOpen(p => !p)}
            >
                <div className="flex items-center gap-2 font-semibold text-sm">
                    <Route className="h-4 w-4 text-primary" />
                    <span>{origin}</span>
                    <ArrowLeft className="h-3 w-3 text-muted-foreground" />
                    <span>{destination}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{trips.length} رحلة · {totalSeats} مقعد متاح</span>
                    {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
            </button>

            {open && (
                <div className="p-3 grid grid-cols-1 sm:grid-cols-2  gap-3">
                    {trips.map(trip => (
                        <CompetitorTripCard
                            key={trip.id}
                            trip={trip}
                            carrierProfile={trip.carrierId ? carriersMap.get(trip.carrierId) : null}
                            onOpenRouteChat={onOpenRouteChat}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Loading ──────────────────────────────────────────────────────────────────
function LoadingState() {
    return (
        <div className="space-y-4 pt-4">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-52 w-full rounded-2xl" />)}
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function MarketRoutesPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    const { profile } = useUserProfile();

    const [activeRouteChatId, setActiveRouteChatId] = useState<string | null>(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isJoiningChat, setIsJoiningChat] = useState(false);

    // رحلاتي النشطة — عشان نعرف المسارات
    const myTripsQuery = useMemoFirebase(() => {
        if (!firestore || !user?.uid) return null;
        return query(
            collection(firestore, 'trips'),
            where('carrierId', '==', user.uid),
            where('status', 'in', ['Planned', 'In-Transit', 'Has_Offers', 'Negotiating', 'Pending-Carrier-Confirmation']),
        );
    }, [firestore, user]);

    const { data: myTrips, isLoading: myLoading } = useCollection<Trip>(myTripsQuery);

    // كل الرحلات النشطة في النظام
    const allActiveQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(
            collection(firestore, 'trips'),
            where('status', 'in', ['Planned', 'In-Transit']),
        );
    }, [firestore]);

    const { data: allTrips, isLoading: allLoading } = useCollection<Trip>(allActiveQuery);

    const isLoading = myLoading || allLoading;

    // المسارات الخاصة بي
    const myRoutes = useMemo(() => {
        if (!myTrips) return new Set<string>();
        return new Set(myTrips.map(t => `${t.origin}__${t.destination}`));
    }, [myTrips]);

    // رحلات المنافسين على نفس مساراتي
    const competitorTrips = useMemo(() => {
        if (!allTrips || !user?.uid) return [];
        return allTrips.filter(t => {
            const isOtherCarrier = t.carrierId !== user.uid;
            const isMyRoute = myRoutes.has(`${t.origin}__${t.destination}`);
            const available = t.availableSeats ?? (t.vehicleCapacity ?? 0);
            const hasSeats = available > 0;
            const notDeparted = !hasDeparted(t.departureDate, t.departureTime);
            return isOtherCarrier && isMyRoute && hasSeats && notDeparted;
        });
    }, [allTrips, user, myRoutes]);

    // معرّفات الناقلين المنافسين (لجلب أرقام تلفوناتهم دفعة واحدة)
    const competitorCarrierIds = useMemo(() => {
        const ids = competitorTrips.map(t => t.carrierId).filter(Boolean) as string[];
        return [...new Set(ids)].slice(0, 30); // حد Firestore الأقصى لاستعلام "in"
    }, [competitorTrips]);

    const carriersQuery = useMemoFirebase(() => {
        if (!firestore || competitorCarrierIds.length === 0) return null;
        return query(collection(firestore, 'users'), where(documentId(), 'in', competitorCarrierIds));
    }, [firestore, competitorCarrierIds]);

    const { data: carriers } = useCollection<UserProfile>(carriersQuery);

    const carriersMap = useMemo(() => {
        const map = new Map<string, UserProfile>();
        carriers?.forEach(c => map.set(c.id, c));
        return map;
    }, [carriers]);

    // تجميع حسب المسار
    const grouped = useMemo(() => {
        const map = new Map<string, { origin: string; destination: string; trips: Trip[] }>();
        for (const trip of competitorTrips) {
            const key = `${trip.origin}__${trip.destination}`;
            if (!map.has(key)) map.set(key, { origin: trip.origin, destination: trip.destination, trips: [] });
            map.get(key)!.trips.push(trip);
        }
        return [...map.values()].sort((a, b) => b.trips.length - a.trips.length);
    }, [competitorTrips]);

    const hasNoActiveTrips = !myLoading && (!myTrips || myTrips.length === 0);

    // اسم الناقل الحالي (لرسالة "انضم لجروب المسار")
    const myName = useMemo(() => {
        return profile?.firstName || profile?.fullName || profile?.displayName || user?.email?.split('@')[0] || 'ناقل';
    }, [profile, user]);

    // فتح/الانضمام لمحادثة المسار الجماعية (نفس منطق RouteChatCard في صفحة الشاتات)
    const handleOpenRouteChat = async (origin: string, destination: string) => {
        if (!firestore || !user?.uid) return;
        const chatId = routeChatId(origin, destination);
        setIsJoiningChat(true);
        try {
            const chatSnap = await getDoc(doc(firestore, 'chats', chatId));
            if (!chatSnap.exists()) {
                await setDoc(doc(firestore, 'chats', chatId), {
                    id: chatId,
                    isGroupChat: true,
                    isCarrierRouteGroup: true,
                    routeOrigin: origin,
                    routeDestination: destination,
                    participants: [user.uid],
                    unreadCounts: { [user.uid]: 0 },
                    isClosed: false,
                    lastMessage: `${myName} انضم لجروب المسار`,
                    lastMessageSenderId: 'system',
                    lastMessageTimestamp: serverTimestamp(),
                });
            } else {
                const data = chatSnap.data();
                if (!data?.participants?.includes(user.uid)) {
                    await updateDoc(doc(firestore, 'chats', chatId), {
                        participants: [...(data.participants || []), user.uid],
                        [`unreadCounts.${user.uid}`]: 0,
                        lastMessage: `${myName} انضم لجروب المسار`,
                        lastMessageTimestamp: serverTimestamp(),
                    });
                }
            }
            setActiveRouteChatId(chatId);
            setIsChatOpen(true);
        } finally {
            setIsJoiningChat(false);
        }
    };

    return (
        <div className="space-y-5 pt-4">
            <div>
                <h1 className="text-xl font-bold flex items-center gap-2">
                    <Route className="h-5 w-5 text-primary" />
                    رحلات الناقلين على مساراتي
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    رحلات الناقلين الآخرين في نفس مساراتك النشطة
                </p>
            </div>

            {isLoading && <LoadingState />}

            {!isLoading && hasNoActiveTrips && (
                <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
                    <Route className="h-12 w-12 text-muted-foreground/40" />
                    <p className="font-semibold text-muted-foreground">لا توجد رحلات نشطة</p>
                    <p className="text-sm text-muted-foreground/70">أنشئ رحلة نشطة أولاً لترى رحلات الناقلين</p>
                </div>
            )}

            {!isLoading && !hasNoActiveTrips && grouped.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
                    <Users className="h-12 w-12 text-muted-foreground/40" />
                    <p className="font-semibold text-muted-foreground">لا يوجد منافسون حالياً</p>
                    <p className="text-sm text-muted-foreground/70">لا توجد رحلات لناقلين آخرين على مساراتك</p>
                </div>
            )}

            {!isLoading && grouped.map(group => (
                <RouteGroup
                    key={`${group.origin}__${group.destination}`}
                    origin={group.origin}
                    destination={group.destination}
                    trips={group.trips}
                    carriersMap={carriersMap}
                    onOpenRouteChat={handleOpenRouteChat}
                />
            ))}

            {activeRouteChatId && (
                <ChatDialog
                    isOpen={isChatOpen}
                    onOpenChange={(open) => { setIsChatOpen(open); if (!open) setActiveRouteChatId(null); }}
                    trip={{ id: activeRouteChatId } as Trip}
                    chatType="group"
                />
            )}
        </div>
    );
}