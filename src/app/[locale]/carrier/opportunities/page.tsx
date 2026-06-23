// // 'use client';

// // import { useState, useMemo, useCallback } from 'react';
// // import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
// // import {
// //   collection, query, where, orderBy, limit, doc, serverTimestamp, increment, writeBatch
// // } from 'firebase/firestore';
// // import { useLocale, useTranslations } from 'next-intl';
// // import { getCityName } from '@/lib/constants';
// // import { formatDate } from '@/lib/formatters';
// // import type { Trip, Offer } from '@/lib/data';
// // import { useUserProfile } from '@/hooks/use-user-profile';
// // import { useToast } from '@/hooks/use-toast';
// // import { useActiveMarkets } from '@/hooks/use-active-markets';
// // import { LocalErrorBoundary } from '@/components/ui/local-error-boundary';
// // import { Skeleton } from '@/components/ui/skeleton';
// // import { Button } from '@/components/ui/button';
// // import { Badge } from '@/components/ui/badge';
// // import { Input } from '@/components/ui/input';
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// // import { OfferDialog } from '@/components/carrier/offer-dialog';
// // import {
// //   Search, ArrowLeft, Calendar, Users, SlidersHorizontal,
// //   UserCheck, ShipWheel, Handshake, MapPin, Car, Bus,
// //   Baby, User, X, TrendingUp, Clock,
// //   Star, BadgeDollarSign, ChevronDown, RefreshCw, Phone
// // } from 'lucide-react';
// // import { cn } from '@/lib/utils';

// // type PassengerType = 'adult' | 'child' | 'infant';

// // interface NormalizedPassenger {
// //   id: string;
// //   type: PassengerType;
// //   label: string;
// // }

// // const PASSENGER_ICON: Record<PassengerType, React.ElementType> = {
// //   adult: User,
// //   child: Users,
// //   infant: Baby,
// // };

// // const PASSENGER_COLOR: Record<PassengerType, string> = {
// //   adult: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
// //   child: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
// //   infant: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
// // };

// // interface RawPassenger {
// //   type?: string;
// //   typeLabel?: string;
// //   passengerType?: string;
// //   documentId?: string;
// // }

// // function normalizePassenger(raw: RawPassenger, index: number): NormalizedPassenger {
// //   const uniqueId = raw?.documentId || `passenger-${index}-${index}`;

// //   // الشكل الجديد: { type: 'adult'|'child'|'minor'|'infant' }
// //   if (raw?.type && typeof raw.type === 'string') {
// //     const rawType = raw.type.toLowerCase();
// //     const t: PassengerType = (rawType === 'minor' || rawType === 'child') ? 'child'
// //       : rawType === 'infant' ? 'infant'
// //         : 'adult';
// //     return {
// //       id: uniqueId,
// //       type: t,
// //       label: raw.typeLabel || (t === 'adult' ? 'بالغ' : t === 'child' ? 'قاصر' : 'رضيع')
// //     };
// //   }

// //   // الشكل القديم: { passengerType: string, passengerName, nationality, documentId, ... }
// //   const pt = (raw?.passengerType || '').toLowerCase();
// //   if (pt.includes('child') || pt.includes('minor') || pt.includes('قاصر')) return { id: uniqueId, type: 'child', label: 'قاصر' };
// //   if (pt.includes('infant') || pt.includes('رضيع')) return { id: uniqueId, type: 'infant', label: 'رضيع' };

// //   return { id: uniqueId, type: 'adult', label: 'بالغ' };
// // }

// // function RequestCard({ trip, onOffer }: { trip: Trip; onOffer: (trip: Trip) => void }) {
// //   const locale = useLocale();
// //   const firestore = useFirestore();
// //   const isDirectRequest = trip.requestType === 'Direct';
// //   const tripAny = trip as any;

// //   // ✅ جلب بيانات المسافر من users collection لو مش موجودة في الطلب
// //   const travelerDocRef = useMemo(() => {
// //     if (!firestore) return null;
// //     const uid = tripAny.userId;
// //     if (!uid) return null;
// //     // لو البيانات موجودة أصلاً ما نجيبش
// //     if (tripAny.travelerName || tripAny.travelerPhone) return null;
// //     return doc(firestore, 'users', uid);
// //   }, [firestore, tripAny.userId, tripAny.travelerName, tripAny.travelerPhone]);

// //   const { data: travelerProfile } = useDoc<any>(travelerDocRef);

// //   // اسم المسافر ورقمه — من الطلب أو من الـ profile
// //   const travelerName = tripAny.travelerName
// //     || [travelerProfile?.firstName, travelerProfile?.lastName].filter(Boolean).join(' ')
// //     || travelerProfile?.displayName
// //     || travelerProfile?.fullName
// //     || '';

// //   const travelerPhone = tripAny.travelerPhone || travelerProfile?.phoneNumber || '';
// //   const travelerPhoneCode = tripAny.travelerPhoneCode || travelerProfile?.phoneCountryCode || '';

// //   // ✅ بناء رقم الاتصال الكامل مع كود الدولة
// //   const fullPhoneNumber = useMemo(() => {
// //     if (!travelerPhone) return '';
// //     // لو الرقم فيه + في الأول يبقا كامل بالفعل
// //     if (travelerPhone.startsWith('+')) return travelerPhone;
// //     // لو في كود دولة
// //     if (travelerPhoneCode) {
// //       const code = travelerPhoneCode.startsWith('+') ? travelerPhoneCode : `+${travelerPhoneCode}`;
// //       // شيل الصفر من الأول لو موجود
// //       const num = travelerPhone.replace(/^0+/, '');
// //       return `${code}${num}`;
// //     }
// //     // مفيش كود → حط + في الأول على الأقل
// //     return travelerPhone.startsWith('0') ? travelerPhone : `+${travelerPhone}`;
// //   }, [travelerPhone, travelerPhoneCode]);

// //   const passengersDetails: NormalizedPassenger[] = useMemo(() => {
// //     const tripAny = trip as any;
// //     // الحقل ممكن يكون passengersDetails أو passengers لو array
// //     const raw = tripAny.passengersDetails ?? tripAny.passengersList ?? null;
// //     if (!Array.isArray(raw) || raw.length === 0) return [];
// //     return raw.map((p: RawPassenger, idx: number) => normalizePassenger(p, idx));
// //   }, [(trip as any).passengersDetails, (trip as any).passengersList]);

// //   const passengerSummary = useMemo(() => {
// //     if (!passengersDetails.length) return null;
// //     const counts: Record<PassengerType, number> = { adult: 0, child: 0, infant: 0 };
// //     passengersDetails.forEach(p => { counts[p.type] = (counts[p.type] || 0) + 1; });
// //     return counts;
// //   }, [passengersDetails]);

// //   const depDate = useMemo(() => {
// //     const raw = trip.departureDate;
// //     if (!raw) return null;
// //     try { return typeof (raw as any)?.toDate === 'function' ? (raw as any).toDate() : new Date(raw); }
// //     catch { return null; }
// //   }, [trip.departureDate]);

// //   const daysUntil = depDate ? Math.ceil((depDate.getTime() - Date.now()) / 86400000) : null;
// //   const isPast = daysUntil !== null && daysUntil < 0;

// //   // ✅ حساب عدد الركاب بشكل آمن لتجنب مشكلة الكائنات القديمة
// //   // const passengerCount = useMemo(() => {
// //   //   if (typeof trip.passengers === 'number' || typeof trip.passengers === 'string') {
// //   //     return Number(trip.passengers) || 1;
// //   //   }
// //   //   if (Array.isArray(trip.passengers)) {
// //   //     return trip.passengers.length;
// //   //   }
// //   //   if (Array.isArray((trip as any).passengersDetails)) {
// //   //     return (trip as any).passengersDetails.length;
// //   //   }
// //   //   return 1;
// //   // }, [trip.passengers, (trip as any).passengersDetails]);
// //   // ✅ تم إضافة (as any) للتحايل على حماية TypeScript لأن نوع البيانات الفعلي قد يختلف عن الـ Interface
// //   const passengerCount = useMemo(() => {
// //     const rawPassengers = trip.passengers as any;

// //     if (typeof rawPassengers === 'number' || typeof rawPassengers === 'string') {
// //       return Number(rawPassengers) || 1;
// //     }
// //     if (Array.isArray(rawPassengers)) {
// //       return rawPassengers.length;
// //     }
// //     if (Array.isArray((trip as any).passengersDetails)) {
// //       return (trip as any).passengersDetails.length;
// //     }
// //     return 1;
// //   }, [trip.passengers, (trip as any).passengersDetails]);
// //   return (
// //     <div className={cn(
// //       'group relative flex flex-col gap-4 p-5 rounded-2xl border transition-all duration-300',
// //       'bg-card hover:shadow-lg hover:shadow-primary/5',
// //       isDirectRequest
// //         ? 'border-primary/40 shadow-sm shadow-primary/10 bg-gradient-to-br from-primary/5 to-card'
// //         : 'border-border hover:border-primary/30'
// //     )}>
// //       {isDirectRequest && (
// //         <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r from-primary via-[#BFAF78] to-primary" />
// //       )}

// //       <div className="flex items-start justify-between gap-3">
// //         <div className="flex-1 min-w-0">
// //           {isDirectRequest && (
// //             <Badge className="mb-2 gap-1 text-xs bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
// //               <UserCheck className="h-3 w-3" /> مخصص لك
// //             </Badge>
// //           )}
// //           {/* ✅ السهم من اليمين لليسار (عمّان → الرياض) */}
// //           <div className="flex items-center gap-2 font-bold text-lg text-foreground flex-wrap">
// //             <span className="flex items-center gap-1">
// //               <MapPin className="h-4 w-4 text-primary shrink-0" />
// //               {getCityName(trip.origin, locale)}
// //             </span>
// //             <span className="text-primary font-black text-xl leading-none">←</span>
// //             <span className="flex items-center gap-1">
// //               <MapPin className="h-4 w-4 text-[#BFAF78] shrink-0" />
// //               {getCityName(trip.destination, locale)}
// //             </span>
// //           </div>
// //         </div>

// //         {daysUntil !== null && (
// //           <div className={cn(
// //             'flex flex-col items-center justify-center min-w-[52px] h-[52px] rounded-xl border text-center shrink-0',
// //             isPast ? 'bg-muted/50 border-muted text-muted-foreground' :
// //               daysUntil <= 1 ? 'bg-destructive/10 border-destructive/30 text-destructive' :
// //                 daysUntil <= 3 ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
// //                   'bg-muted/50 border-muted text-muted-foreground'
// //           )}>
// //             {isPast ? (
// //               <span className="text-xs font-bold leading-none">منتهية</span>
// //             ) : (
// //               <>
// //                 <span className="text-xl font-black leading-none">{daysUntil}</span>
// //                 <span className="text-[10px] font-bold leading-none mt-0.5">يوم</span>
// //               </>
// //             )}
// //           </div>
// //         )}
// //       </div>

// //       <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
// //         {depDate && (
// //           <span className="flex items-center gap-1.5 font-medium">
// //             <Calendar className="h-3.5 w-3.5 text-primary" />
// //             {formatDate(trip.departureDate, 'd MMM yyyy', locale)}
// //           </span>
// //         )}
// //         <span className="flex items-center gap-1.5 font-medium">
// //           <Users className="h-3.5 w-3.5 text-primary" />
// //           {passengerCount} راكب
// //         </span>
// //         {trip.vehicleType && (
// //           <span className="flex items-center gap-1.5 font-medium">
// //             {trip.vehicleType === 'حافلة' ? <Bus className="h-3.5 w-3.5 text-primary" /> : <Car className="h-3.5 w-3.5 text-primary" />}
// //             {trip.vehicleType}
// //           </span>
// //         )}
// //         {trip.targetPrice && (
// //           <span className="flex items-center gap-1.5 font-medium text-emerald-500">
// //             <BadgeDollarSign className="h-3.5 w-3.5" />
// //             ميزانية: ~{trip.targetPrice} {trip.currency || 'JOD'}
// //           </span>
// //         )}
// //       </div>

// //       {/* ✅ بيانات المسافر - تظهر دايماً لو في اسم أو تليفون */}
// //       {(travelerName || travelerPhone) && (
// //         <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-muted/30 border border-muted/50">
// //           <div className="flex items-center gap-2 min-w-0">
// //             <div className="h-7 w-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
// //               <User className="h-3.5 w-3.5 text-primary" />
// //             </div>
// //             <span className="text-sm font-semibold text-foreground truncate">
// //               {travelerName || 'مسافر'}
// //             </span>
// //           </div>
// //           {travelerPhone && (
// //             <a
// //               href={`tel:${fullPhoneNumber}`}
// //               className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors shrink-0"
// //               dir="ltr"
// //               onClick={e => e.stopPropagation()}
// //             >
// //               <Phone className="h-3.5 w-3.5" />
// //               <span>{fullPhoneNumber}</span>
// //             </a>
// //           )}
// //         </div>
// //       )}

// //       {passengersDetails.length > 0 && (
// //         <div className="space-y-2">
// //           <p className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
// //             <Users className="h-3 w-3" /> تفاصيل الركاب:
// //           </p>
// //           <div className="flex flex-wrap gap-1.5">
// //             {passengersDetails.map((p, idx) => {
// //               const Icon = PASSENGER_ICON[p.type] || User;
// //               const colorClass = PASSENGER_COLOR[p.type] || PASSENGER_COLOR.adult;
// //               return (
// //                 <span key={p.id} className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border font-medium', colorClass)}>
// //                   <Icon className="h-3 w-3" />
// //                   راكب {idx + 1}: {p.label}
// //                 </span>
// //               );
// //             })}
// //           </div>
// //           {passengerSummary && (
// //             <div className="flex flex-wrap gap-3 pt-1 border-t border-muted/40">
// //               {passengerSummary.adult > 0 && <span className="text-xs text-muted-foreground flex items-center gap-1"><User className="h-3 w-3 text-blue-400" /> {passengerSummary.adult} بالغ</span>}
// //               {passengerSummary.child > 0 && <span className="text-xs text-muted-foreground flex items-center gap-1"><Users className="h-3 w-3 text-amber-400" /> {passengerSummary.child} قاصر</span>}
// //               {passengerSummary.infant > 0 && <span className="text-xs text-muted-foreground flex items-center gap-1"><Baby className="h-3 w-3 text-pink-400" /> {passengerSummary.infant} رضيع</span>}
// //             </div>
// //           )}
// //         </div>
// //       )}

// //       {trip.notes && (
// //         <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded-xl border border-dashed border-muted">
// //           <span className="font-semibold text-foreground/80">ملاحظات المسافر: </span>{trip.notes}
// //         </div>
// //       )}

// //       <div className="flex items-center justify-between gap-3 pt-1 border-t border-muted/40">
// //         <span className="text-xs text-muted-foreground/60 flex items-center gap-1">
// //           <Clock className="h-3 w-3" />
// //           {(trip as any).createdAt?.toDate
// //             ? formatDate((trip as any).createdAt.toDate().toISOString(), 'd MMM', locale)
// //             : 'حديثاً'}
// //         </span>
// //         <Button
// //           onClick={() => onOffer(trip)}
// //           size="sm"
// //           disabled={isPast}
// //           className={cn(
// //             'gap-2 rounded-xl font-semibold transition-all duration-200',
// //             isDirectRequest
// //               ? 'bg-primary hover:bg-primary/90 shadow-md shadow-primary/20'
// //               : 'bg-card hover:bg-primary hover:text-primary-foreground border border-primary/40 text-primary'
// //           )}
// //           variant={isDirectRequest ? 'default' : 'outline'}
// //         >
// //           <Handshake className="h-4 w-4" />
// //           {isDirectRequest ? 'قبول وتحديد السعر' : 'تقديم عرض'}
// //         </Button>
// //       </div>
// //     </div>
// //   );
// // }

// // export default function MarketRequestsPage() {
// //   const { user } = useUser();
// //   const { profile } = useUserProfile();
// //   const firestore = useFirestore();
// //   const { toast } = useToast();
// //   const locale = useLocale();
// //   const isRtl = locale === 'ar';
// //   const tc = useTranslations('carrierLayout');
// //   const { activeMarkets } = useActiveMarkets();

// //   // جمع كل المدن من كل الأسواق النشطة
// //   const allCities = useMemo(() => {
// //     const cities: { key: string; label: string }[] = [];
// //     activeMarkets.forEach(market => {
// //       (market.cities || []).forEach((cityKey: string) => {
// //         cities.push({ key: cityKey, label: getCityName(cityKey, locale) });
// //       });
// //     });
// //     return cities.sort((a, b) => a.label.localeCompare(b.label));
// //   }, [activeMarkets, locale]);

// //   const [searchOrigin, setSearchOrigin] = useState('');
// //   const [searchDest, setSearchDest] = useState('');
// //   const [filterType, setFilterType] = useState<'all' | 'Direct' | 'General'>('all');
// //   const [filterVehicle, setFilterVehicle] = useState<'all' | 'سيارة' | 'حافلة'>('all');
// //   const [showFilters, setShowFilters] = useState(false);
// //   const [visibleCount, setVisibleCount] = useState(20);
// //   const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
// //   const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);
// //   const marketRequestsQuery = useMemoFirebase(() => {
// //     if (!firestore || !user?.uid) return null;
// //     return query(
// //       collection(firestore, 'trips'),
// //       where('status', 'in', ['Awaiting-Offers', 'Has_Offers']),
// //       limit(visibleCount)
// //     );
// //   }, [firestore, user, visibleCount]);

// //   const directRequestsQuery = useMemoFirebase(() => {
// //     if (!firestore || !user?.uid) return null;
// //     return query(
// //       collection(firestore, 'trips'),
// //       // ✅ تعديل: نفس الشيء للطلبات المباشرة
// //       where('status', 'in', ['Awaiting-Offers', 'Has_Offers']),
// //       where('targetCarrierId', '==', user.uid),
// //       limit(50)
// //     );
// //   }, [firestore, user]);

// //   const { data: marketRequests, isLoading: isLoadingMarket } = useCollection<Trip>(marketRequestsQuery);
// //   const { data: directRequests, isLoading: isLoadingDirect } = useCollection<Trip>(directRequestsQuery);

// //   const allRequests = useMemo(() => {
// //     const market = marketRequests || [];
// //     const direct = directRequests || [];
// //     const directIds = new Set(direct.map(t => t.id));
// //     const merged = [...direct, ...market.filter(t => !directIds.has(t.id))];
// //     // ترتيب من الأحدث للأقدم client-side (بدون Composite Index)
// //     return merged.sort((a, b) => {
// //       const aTime = (a as any).createdAt?.toMillis?.() ?? ((a as any).createdAt?.seconds ?? 0) * 1000;
// //       const bTime = (b as any).createdAt?.toMillis?.() ?? ((b as any).createdAt?.seconds ?? 0) * 1000;
// //       return bTime - aTime;
// //     });
// //   }, [marketRequests, directRequests]);

// //   const filteredRequests = useMemo(() => {
// //     let result = allRequests;
// //     if (filterType !== 'all') result = result.filter(t => filterType === 'Direct' ? t.requestType === 'Direct' : t.requestType !== 'Direct');
// //     if (filterVehicle !== 'all') result = result.filter(t => t.vehicleType === filterVehicle);
// //     if (searchOrigin.trim()) { const q = searchOrigin.trim().toLowerCase(); result = result.filter(t => getCityName(t.origin, locale).toLowerCase().includes(q) || t.origin?.toLowerCase().includes(q)); }
// //     if (searchDest.trim()) { const q = searchDest.trim().toLowerCase(); result = result.filter(t => getCityName(t.destination, locale).toLowerCase().includes(q) || t.destination?.toLowerCase().includes(q)); }
// //     return result;
// //   }, [allRequests, filterType, filterVehicle, searchOrigin, searchDest, locale]);

// //   const directCount = useMemo(() => allRequests.filter(t => t.requestType === 'Direct').length, [allRequests]);
// //   const isLoading = isLoadingMarket || isLoadingDirect;

// //   const handleSendOffer = useCallback(async (
// //     offerData: Omit<Offer, 'id' | 'tripId' | 'carrierId' | 'status' | 'createdAt'>
// //   ): Promise<boolean> => {
// //     if (!firestore || !user?.uid || !selectedTrip || !profile) {
// //       toast({ variant: 'destructive', title: 'خطأ', description: 'بيانات مفقودة.' });
// //       return false;
// //     }

// //     try {
// //       const batch = writeBatch(firestore);

// //       const offerRef = doc(collection(firestore, 'offers'));
// //       batch.set(offerRef, {
// //         ...offerData,
// //         tripId: selectedTrip.id,
// //         passengerIntentId: selectedTrip.id,
// //         carrierId: user.uid,
// //         carrierName: [profile.firstName, profile.lastName].filter(Boolean).join(' ') || 'ناقل',
// //         status: 'Pending',
// //         createdAt: serverTimestamp(),
// //         updatedAt: serverTimestamp(),
// //       });

// //       const tripRef = doc(firestore, 'trips', selectedTrip.id);
// //       batch.update(tripRef, {
// //         offersCount: increment(1),
// //         status: 'Has_Offers',
// //         updatedAt: serverTimestamp(),
// //       });

// //       await batch.commit();

// //       toast({ title: '✅ تم إرسال عرضك بنجاح!' });
// //       setIsOfferDialogOpen(false);
// //       setSelectedTrip(null);
// //       return true;
// //     } catch (err) {
// //       console.error('[MarketRequests] sendOffer error:', err);
// //       toast({ variant: 'destructive', title: 'فشل إرسال العرض', description: 'حاول مجدداً.' });
// //       return false;
// //     }
// //   }, [firestore, user, selectedTrip, profile, toast]);


// //   const handleOffer = useCallback((trip: Trip) => { setSelectedTrip(trip); setIsOfferDialogOpen(true); }, []);
// //   const hasActiveFilters = filterType !== 'all' || filterVehicle !== 'all' || !!searchOrigin || !!searchDest;
// //   const clearFilters = () => { setSearchOrigin(''); setSearchDest(''); setFilterType('all'); setFilterVehicle('all'); };

// //   // const tc = useTranslations('carrierLayout');

// //   return (
// //     <div className="space-y-4 pb-20 pt-4 animate-in fade-in slide-in-from-bottom-2 duration-500" dir={isRtl ? 'rtl' : 'ltr'}>

// //       {/* ─── الهيدر الثابت ─── */}
// //       <div className="sticky top-[60px] md:top-[70px] z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-2">
// //         <div className="bg-card rounded-2xl border border-[#BFAF78] overflow-hidden shadow-sm">

// //           <div className="flex items-center justify-between p-4 bg-blue-600 text-white">
// //             <div className="flex items-center gap-2 font-semibold text-sm">
// //               <TrendingUp className="w-4 h-4" />
// //               <span>{tc('marketTitle')}</span>
// //               {!isLoading && (
// //                 <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full font-bold">
// //                   {filteredRequests.length}
// //                 </span>
// //               )}
// //             </div>
// //             <div className="flex items-center gap-2">
// //               {directCount > 0 && (
// //                 <span className="flex items-center gap-1 text-xs bg-amber-400/20 border border-amber-300/30 text-amber-200 px-2 py-0.5 rounded-full font-bold animate-pulse">
// //                   <UserCheck className="h-3 w-3" />{directCount} {tc('marketDirect')}
// //                 </span>
// //               )}
// //               <button
// //                 onClick={() => setShowFilters(v => !v)}
// //                 className={cn(
// //                   'flex items-center gap-1 text-xs px-3 py-1.5 rounded-full font-semibold transition-colors',
// //                   hasActiveFilters ? 'bg-amber-400/20 border border-amber-300/30 text-amber-200' : 'bg-white/10 hover:bg-white/20'
// //                 )}
// //               >
// //                 <SlidersHorizontal className="h-3.5 w-3.5" />
// //                 {hasActiveFilters ? tc('marketActiveFilter') : tc('marketFilter')}
// //               </button>
// //             </div>
// //           </div>

// //           {showFilters && (
// //             <div className="p-4 border-t border-muted/50 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">

// //               {/* ✅ سليكتور المدن */}
// //               {/* <div className="grid grid-cols-2 gap-2">
// //                 <Select value={searchOrigin || 'all'} onValueChange={v => setSearchOrigin(v === 'all' ? '' : v)} dir={isRtl ? 'rtl' : 'ltr'}>
// //                   <SelectTrigger className="h-10 bg-card/50 text-sm">
// //                     <SelectValue placeholder={tc('marketOrigin')} />
// //                   </SelectTrigger>
// //                   <SelectContent className="max-h-60">
// //                     <SelectItem value="all">{tc('marketAllCities')}</SelectItem>
// //                     {allCities.map(c => (
// //                       <SelectItem key={c.key} value={c.key}>{c.label}</SelectItem>
// //                     ))}
// //                   </SelectContent>
// //                 </Select>

// //                 <Select value={searchDest || 'all'} onValueChange={v => setSearchDest(v === 'all' ? '' : v)} dir={isRtl ? 'rtl' : 'ltr'}>
// //                   <SelectTrigger className="h-10 bg-card/50 text-sm">
// //                     <SelectValue placeholder={tc('marketDest')} />
// //                   </SelectTrigger>
// //                   <SelectContent className="max-h-60">
// //                     <SelectItem value="all">{tc('marketAllCities')}</SelectItem>
// //                     {allCities.map(c => (
// //                       <SelectItem key={c.key} value={c.key}>{c.label}</SelectItem>
// //                     ))}
// //                   </SelectContent>
// //                 </Select>
// //               </div> */}


// //               {/* ✅ سليكتور المدن */}
// //               <div className="grid grid-cols-2 gap-2">
// //                 <div className="space-y-1">
// //                   <label className="text-sm px-2 font-semibold text-muted-foreground">
// //                     {tc('marketOrigin')}
// //                   </label>
// //                   <Select value={searchOrigin || 'all'} onValueChange={v => setSearchOrigin(v === 'all' ? '' : v)} dir={isRtl ? 'rtl' : 'ltr'}>
// //                     <SelectTrigger className="h-10 bg-card/50 text-sm">
// //                       <SelectValue placeholder={tc('marketOrigin')} />
// //                     </SelectTrigger>
// //                     <SelectContent className="max-h-60">
// //                       <SelectItem value="all">{tc('marketAllCities')}</SelectItem>
// //                       {allCities.map(c => (
// //                         <SelectItem key={c.key} value={c.key}>{c.label}</SelectItem>
// //                       ))}
// //                     </SelectContent>
// //                   </Select>
// //                 </div>

// //                 <div className="space-y-1">
// //                   <label className="text-sm px-2 font-semibold text-muted-foreground">
// //                     {tc('marketDest')}
// //                   </label>
// //                   <Select value={searchDest || 'all'} onValueChange={v => setSearchDest(v === 'all' ? '' : v)} dir={isRtl ? 'rtl' : 'ltr'}>
// //                     <SelectTrigger className="h-10 bg-card/50 text-sm">
// //                       <SelectValue placeholder={tc('marketDest')} />
// //                     </SelectTrigger>
// //                     <SelectContent className="max-h-60">
// //                       <SelectItem value="all">{tc('marketAllCities')}</SelectItem>
// //                       {allCities.map(c => (
// //                         <SelectItem key={c.key} value={c.key}>{c.label}</SelectItem>
// //                       ))}
// //                     </SelectContent>
// //                   </Select>
// //                 </div>
// //               </div>
// //               <div className="grid  gap-2">
// //                 <Select value={filterType} onValueChange={(v: any) => setFilterType(v)} dir={isRtl ? 'rtl' : 'ltr'}>
// //                   <SelectTrigger className="h-10 bg-card/50 text-sm"><SelectValue placeholder={tc('marketReqType')} /></SelectTrigger>
// //                   <SelectContent>
// //                     <SelectItem value="all">{tc('marketAllReqs')}</SelectItem>
// //                     <SelectItem value="Direct">{tc('marketDirectOnly')}</SelectItem>
// //                     <SelectItem value="General">{tc('marketGeneral')}</SelectItem>
// //                   </SelectContent>
// //                 </Select>
// //               </div>

// //               {hasActiveFilters && (
// //                 <Button variant="ghost" size="sm" onClick={clearFilters} className="text-destructive hover:text-destructive gap-1 text-xs h-8 w-full">
// //                   <X className="h-3.5 w-3.5" />{tc('marketClearAll')}
// //                 </Button>
// //               )}
// //             </div>
// //           )}
// //         </div>
// //       </div>

// //       {/* ─── المحتوى ─── */}
// //       <LocalErrorBoundary fallbackTitle={isRtl ? 'تعثر تحميل الطلبات' : 'Failed to load requests'}>
// //         {isLoading ? (
// //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
// //             {Array.from({ length: 6 }).map((_, i) => (
// //               <div key={i} className="p-5 rounded-2xl border bg-card space-y-3">
// //                 <Skeleton className="h-6 w-3/4" /><Skeleton className="h-4 w-1/2" /><Skeleton className="h-16 w-full rounded-xl" /><Skeleton className="h-9 w-28 ml-auto rounded-xl" />
// //               </div>
// //             ))}
// //           </div>
// //         ) : filteredRequests.length === 0 ? (
// //           <div className="flex flex-col items-center justify-center text-center py-20 px-4 border-2 border-dashed border-[#BFAF78]/30 rounded-2xl bg-secondary/5">
// //             <ShipWheel className="h-14 w-14 text-primary/20 mb-4 animate-spin-slow" />
// //             <h3 className="text-xl font-bold mb-2 text-foreground/70">
// //               {hasActiveFilters ? tc('marketNoResults') : tc('marketNoRequests')}
// //             </h3>
// //             <p className="text-sm text-muted-foreground max-w-xs">
// //               {hasActiveFilters ? tc('marketNoResultsDesc') : tc('marketNoReqDesc')}
// //             </p>
// //             {hasActiveFilters && (
// //               <Button variant="outline" size="sm" className="mt-4 gap-2" onClick={clearFilters}>
// //                 <RefreshCw className="h-3.5 w-3.5" />{tc('marketShowAll')}
// //               </Button>
// //             )}
// //           </div>
// //         ) : (
// //           <>
// //             <div className="grid grid-cols-3 gap-3">
// //               {[
// //                 { label: tc('marketTotalReqs'), value: filteredRequests.length, icon: TrendingUp, color: 'text-blue-400' },
// //                 { label: tc('marketDirectForYou'), value: directCount, icon: UserCheck, color: 'text-primary' },
// //                 { label: tc('marketGeneralStat'), value: filteredRequests.length - directCount, icon: Star, color: 'text-[#BFAF78]' },
// //               ].map(stat => (
// //                 <div key={stat.label} className="bg-card border border-muted rounded-xl p-3 text-center space-y-1">
// //                   <stat.icon className={cn('h-4 w-4 mx-auto', stat.color)} />
// //                   <div className="text-xl font-black">{stat.value}</div>
// //                   <div className="text-[10px] text-muted-foreground font-medium leading-tight">{stat.label}</div>
// //                 </div>
// //               ))}
// //             </div>

// //             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
// //               {filteredRequests.slice(0, visibleCount).map(trip => (
// //                 <RequestCard key={trip.id} trip={trip} onOffer={handleOffer} />
// //               ))}
// //             </div>

// //             {filteredRequests.length > visibleCount && (
// //               <div className="flex justify-center pt-2">
// //                 <Button variant="outline" size="lg" onClick={() => setVisibleCount(prev => prev + 10)} className="gap-2 font-bold w-full max-w-sm">
// //                   <ChevronDown className="h-4 w-4" />
// //                   {tc('marketShowMore')} ({filteredRequests.length - visibleCount} {tc('marketRemaining')})
// //                 </Button>
// //               </div>
// //             )}
// //           </>
// //         )}
// //       </LocalErrorBoundary>

// //       {selectedTrip && (
// //         <OfferDialog
// //           isOpen={isOfferDialogOpen}
// //           onOpenChange={(open) => { setIsOfferDialogOpen(open); if (!open) setSelectedTrip(null); }}
// //           trip={selectedTrip}
// //           onSendOffer={handleSendOffer}
// //         />
// //       )}
// //     </div>
// //   );
// // }
// 'use client';

// import { useState, useMemo, useCallback } from 'react';
// import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
// import {
//   collection, query, where, orderBy, limit, doc, serverTimestamp, increment, writeBatch
// } from 'firebase/firestore';
// import { useLocale, useTranslations } from 'next-intl';
// import { getCityName } from '@/lib/constants';
// import { formatDate } from '@/lib/formatters';
// import type { Trip, Offer } from '@/lib/data';
// import { useUserProfile } from '@/hooks/use-user-profile';
// import { useToast } from '@/hooks/use-toast';
// import { useActiveMarkets } from '@/hooks/use-active-markets';
// import { LocalErrorBoundary } from '@/components/ui/local-error-boundary';
// import { Skeleton } from '@/components/ui/skeleton';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Input } from '@/components/ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { OfferDialog } from '@/components/carrier/offer-dialog';
// import {
//   Search, ArrowLeft, Calendar, Users, SlidersHorizontal,
//   UserCheck, ShipWheel, Handshake, MapPin, Car, Bus,
//   Baby, User, X, TrendingUp, Clock,
//   Star, BadgeDollarSign, ChevronDown, RefreshCw, Phone
// } from 'lucide-react';
// import { cn } from '@/lib/utils';

// type PassengerType = 'adult' | 'child' | 'infant';

// interface NormalizedPassenger {
//   id: string;
//   type: PassengerType;
//   label: string;
// }

// const PASSENGER_ICON: Record<PassengerType, React.ElementType> = {
//   adult: User,
//   child: Users,
//   infant: Baby,
// };

// const PASSENGER_COLOR: Record<PassengerType, string> = {
//   adult: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
//   child: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
//   infant: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
// };

// interface RawPassenger {
//   type?: string;
//   typeLabel?: string;
//   passengerType?: string;
//   documentId?: string;
// }

// function normalizePassenger(raw: RawPassenger, index: number): NormalizedPassenger {
//   const uniqueId = raw?.documentId || `passenger-${index}-${index}`;

//   // الشكل الجديد: { type: 'adult'|'child'|'minor'|'infant' }
//   if (raw?.type && typeof raw.type === 'string') {
//     const rawType = raw.type.toLowerCase();
//     const t: PassengerType = (rawType === 'minor' || rawType === 'child') ? 'child'
//       : rawType === 'infant' ? 'infant'
//         : 'adult';
//     return {
//       id: uniqueId,
//       type: t,
//       label: raw.typeLabel || (t === 'adult' ? 'بالغ' : t === 'child' ? 'قاصر' : 'رضيع')
//     };
//   }

//   // الشكل القديم: { passengerType: string, passengerName, nationality, documentId, ... }
//   const pt = (raw?.passengerType || '').toLowerCase();
//   if (pt.includes('child') || pt.includes('minor') || pt.includes('قاصر')) return { id: uniqueId, type: 'child', label: 'قاصر' };
//   if (pt.includes('infant') || pt.includes('رضيع')) return { id: uniqueId, type: 'infant', label: 'رضيع' };

//   return { id: uniqueId, type: 'adult', label: 'بالغ' };
// }

// function RequestCard({ trip, onOffer }: { trip: Trip; onOffer: (trip: Trip) => void }) {
//   const locale = useLocale();
//   const firestore = useFirestore();
//   const isDirectRequest = trip.requestType === 'Direct';
//   const tripAny = trip as any;

//   // ✅ جلب بيانات المسافر من users collection لو مش موجودة في الطلب
//   const travelerDocRef = useMemo(() => {
//     if (!firestore) return null;
//     const uid = tripAny.userId;
//     if (!uid) return null;
//     // لو البيانات موجودة أصلاً ما نجيبش
//     if (tripAny.travelerName || tripAny.travelerPhone) return null;
//     return doc(firestore, 'users', uid);
//   }, [firestore, tripAny.userId, tripAny.travelerName, tripAny.travelerPhone]);

//   const { data: travelerProfile } = useDoc<any>(travelerDocRef);

//   // اسم المسافر ورقمه — من الطلب أو من الـ profile
//   const travelerName = tripAny.travelerName
//     || [travelerProfile?.firstName, travelerProfile?.lastName].filter(Boolean).join(' ')
//     || travelerProfile?.displayName
//     || travelerProfile?.fullName
//     || '';

//   const travelerPhone = tripAny.travelerPhone || travelerProfile?.phoneNumber || '';
//   const travelerPhoneCode = tripAny.travelerPhoneCode || travelerProfile?.phoneCountryCode || '';

//   // ✅ بناء رقم الاتصال الكامل مع كود الدولة
//   const fullPhoneNumber = useMemo(() => {
//     if (!travelerPhone) return '';
//     // لو الرقم فيه + في الأول يبقا كامل بالفعل
//     if (travelerPhone.startsWith('+')) return travelerPhone;
//     // لو في كود دولة
//     if (travelerPhoneCode) {
//       const code = travelerPhoneCode.startsWith('+') ? travelerPhoneCode : `+${travelerPhoneCode}`;
//       // شيل الصفر من الأول لو موجود
//       const num = travelerPhone.replace(/^0+/, '');
//       return `${code}${num}`;
//     }
//     // مفيش كود → حط + في الأول على الأقل
//     return travelerPhone.startsWith('0') ? travelerPhone : `+${travelerPhone}`;
//   }, [travelerPhone, travelerPhoneCode]);

//   const passengersDetails: NormalizedPassenger[] = useMemo(() => {
//     const tripAny = trip as any;
//     // الحقل ممكن يكون passengersDetails أو passengers لو array
//     const raw = tripAny.passengersDetails ?? tripAny.passengersList ?? null;
//     if (!Array.isArray(raw) || raw.length === 0) return [];
//     return raw.map((p: RawPassenger, idx: number) => normalizePassenger(p, idx));
//   }, [(trip as any).passengersDetails, (trip as any).passengersList]);

//   const passengerSummary = useMemo(() => {
//     if (!passengersDetails.length) return null;
//     const counts: Record<PassengerType, number> = { adult: 0, child: 0, infant: 0 };
//     passengersDetails.forEach(p => { counts[p.type] = (counts[p.type] || 0) + 1; });
//     return counts;
//   }, [passengersDetails]);

//   const depDate = useMemo(() => {
//     const raw = trip.departureDate;
//     if (!raw) return null;
//     try { return typeof (raw as any)?.toDate === 'function' ? (raw as any).toDate() : new Date(raw); }
//     catch { return null; }
//   }, [trip.departureDate]);

//   const daysUntil = depDate ? Math.ceil((depDate.getTime() - Date.now()) / 86400000) : null;
//   const isPast = daysUntil !== null && daysUntil < 0;

//   // ✅ حساب عدد الركاب بشكل آمن لتجنب مشكلة الكائنات القديمة
//   // const passengerCount = useMemo(() => {
//   //   if (typeof trip.passengers === 'number' || typeof trip.passengers === 'string') {
//   //     return Number(trip.passengers) || 1;
//   //   }
//   //   if (Array.isArray(trip.passengers)) {
//   //     return trip.passengers.length;
//   //   }
//   //   if (Array.isArray((trip as any).passengersDetails)) {
//   //     return (trip as any).passengersDetails.length;
//   //   }
//   //   return 1;
//   // }, [trip.passengers, (trip as any).passengersDetails]);
//   // ✅ تم إضافة (as any) للتحايل على حماية TypeScript لأن نوع البيانات الفعلي قد يختلف عن الـ Interface
//   const passengerCount = useMemo(() => {
//     const rawPassengers = trip.passengers as any;

//     if (typeof rawPassengers === 'number' || typeof rawPassengers === 'string') {
//       return Number(rawPassengers) || 1;
//     }
//     if (Array.isArray(rawPassengers)) {
//       return rawPassengers.length;
//     }
//     if (Array.isArray((trip as any).passengersDetails)) {
//       return (trip as any).passengersDetails.length;
//     }
//     return 1;
//   }, [trip.passengers, (trip as any).passengersDetails]);
//   return (
//     <div className={cn(
//       'group relative flex flex-col gap-4 p-5 rounded-2xl border transition-all duration-300',
//       'bg-card hover:shadow-lg hover:shadow-primary/5',
//       isDirectRequest
//         ? 'border-primary/40 shadow-sm shadow-primary/10 bg-gradient-to-br from-primary/5 to-card'
//         : 'border-border hover:border-primary/30'
//     )}>
//       {isDirectRequest && (
//         <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r from-primary via-[#BFAF78] to-primary" />
//       )}

//       <div className="flex items-start justify-between gap-3">
//         <div className="flex-1 min-w-0">
//           {isDirectRequest && (
//             <Badge className="mb-2 gap-1 text-xs bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
//               <UserCheck className="h-3 w-3" /> مخصص لك
//             </Badge>
//           )}
//           {/* ✅ السهم من اليمين لليسار (عمّان → الرياض) */}
//           <div className="flex items-center gap-2 font-bold text-lg text-foreground flex-wrap">
//             <span className="flex items-center gap-1">
//               <MapPin className="h-4 w-4 text-primary shrink-0" />
//               {getCityName(trip.origin, locale)}
//             </span>
//             <span className="text-primary font-black text-xl leading-none">←</span>
//             <span className="flex items-center gap-1">
//               <MapPin className="h-4 w-4 text-[#BFAF78] shrink-0" />
//               {getCityName(trip.destination, locale)}
//             </span>
//           </div>
//         </div>

//         {daysUntil !== null && (
//           <div className={cn(
//             'flex flex-col items-center justify-center min-w-[52px] h-[52px] rounded-xl border text-center shrink-0',
//             isPast ? 'bg-muted/50 border-muted text-muted-foreground' :
//               daysUntil <= 1 ? 'bg-destructive/10 border-destructive/30 text-destructive' :
//                 daysUntil <= 3 ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
//                   'bg-muted/50 border-muted text-muted-foreground'
//           )}>
//             {isPast ? (
//               <span className="text-xs font-bold leading-none">منتهية</span>
//             ) : (
//               <>
//                 <span className="text-xl font-black leading-none">{daysUntil}</span>
//                 <span className="text-[10px] font-bold leading-none mt-0.5">يوم</span>
//               </>
//             )}
//           </div>
//         )}
//       </div>

//       <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
//         {depDate && (
//           <span className="flex items-center gap-1.5 font-medium">
//             <Calendar className="h-3.5 w-3.5 text-primary" />
//             {formatDate(trip.departureDate, 'd MMM yyyy', locale)}
//           </span>
//         )}
//         <span className="flex items-center gap-1.5 font-medium">
//           <Users className="h-3.5 w-3.5 text-primary" />
//           {passengerCount} راكب
//         </span>
//         {trip.vehicleType && (
//           <span className="flex items-center gap-1.5 font-medium">
//             {trip.vehicleType === 'حافلة' ? <Bus className="h-3.5 w-3.5 text-primary" /> : <Car className="h-3.5 w-3.5 text-primary" />}
//             {trip.vehicleType}
//           </span>
//         )}
//         {trip.targetPrice && (
//           <span className="flex items-center gap-1.5 font-medium text-emerald-500">
//             <BadgeDollarSign className="h-3.5 w-3.5" />
//             ميزانية: ~{trip.targetPrice} {trip.currency || 'JOD'}
//           </span>
//         )}
//       </div>

//       {/* ✅ بيانات المسافر - تظهر دايماً لو في اسم أو تليفون */}
//       {(travelerName || travelerPhone) && (
//         <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-muted/30 border border-muted/50">
//           <div className="flex items-center gap-2 min-w-0">
//             <div className="h-7 w-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
//               <User className="h-3.5 w-3.5 text-primary" />
//             </div>
//             <span className="text-sm font-semibold text-foreground truncate">
//               {travelerName || 'مسافر'}
//             </span>
//           </div>
//           {travelerPhone && (
//             <a
//               href={`tel:${fullPhoneNumber}`}
//               className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors shrink-0"
//               dir="ltr"
//               onClick={e => e.stopPropagation()}
//             >
//               <Phone className="h-3.5 w-3.5" />
//               <span>{fullPhoneNumber}</span>
//             </a>
//           )}
//         </div>
//       )}

//       {passengersDetails.length > 0 && (
//         <div className="space-y-2">
//           <p className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
//             <Users className="h-3 w-3" /> تفاصيل الركاب:
//           </p>
//           <div className="flex flex-wrap gap-1.5">
//             {passengersDetails.map((p, idx) => {
//               const Icon = PASSENGER_ICON[p.type] || User;
//               const colorClass = PASSENGER_COLOR[p.type] || PASSENGER_COLOR.adult;
//               return (
//                 <span key={p.id} className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border font-medium', colorClass)}>
//                   <Icon className="h-3 w-3" />
//                   راكب {idx + 1}: {p.label}
//                 </span>
//               );
//             })}
//           </div>
//           {passengerSummary && (
//             <div className="flex flex-wrap gap-3 pt-1 border-t border-muted/40">
//               {passengerSummary.adult > 0 && <span className="text-xs text-muted-foreground flex items-center gap-1"><User className="h-3 w-3 text-blue-400" /> {passengerSummary.adult} بالغ</span>}
//               {passengerSummary.child > 0 && <span className="text-xs text-muted-foreground flex items-center gap-1"><Users className="h-3 w-3 text-amber-400" /> {passengerSummary.child} قاصر</span>}
//               {passengerSummary.infant > 0 && <span className="text-xs text-muted-foreground flex items-center gap-1"><Baby className="h-3 w-3 text-pink-400" /> {passengerSummary.infant} رضيع</span>}
//             </div>
//           )}
//         </div>
//       )}

//       {trip.notes && (
//         <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded-xl border border-dashed border-muted">
//           <span className="font-semibold text-foreground/80">ملاحظات المسافر: </span>{trip.notes}
//         </div>
//       )}

//       <div className="flex items-center justify-between gap-3 pt-1 border-t border-muted/40">
//         <span className="text-xs text-muted-foreground/60 flex items-center gap-1">
//           <Clock className="h-3 w-3" />
//           {(trip as any).createdAt?.toDate
//             ? formatDate((trip as any).createdAt.toDate().toISOString(), 'd MMM', locale)
//             : 'حديثاً'}
//         </span>
//         <Button
//           onClick={() => onOffer(trip)}
//           size="sm"
//           disabled={isPast}
//           className={cn(
//             'gap-2 rounded-xl font-semibold transition-all duration-200',
//             isDirectRequest
//               ? 'bg-primary hover:bg-primary/90 shadow-md shadow-primary/20'
//               : 'bg-card hover:bg-primary hover:text-primary-foreground border border-primary/40 text-primary'
//           )}
//           variant={isDirectRequest ? 'default' : 'outline'}
//         >
//           <Handshake className="h-4 w-4" />
//           {isDirectRequest ? 'قبول وتحديد السعر' : 'تقديم عرض'}
//         </Button>
//       </div>
//     </div>
//   );
// }

// export default function MarketRequestsPage() {
//   const { user } = useUser();
//   const { profile } = useUserProfile();
//   const firestore = useFirestore();
//   const { toast } = useToast();
//   const locale = useLocale();
//   const isRtl = locale === 'ar';
//   const tc = useTranslations('carrierLayout');
//   const { activeMarkets } = useActiveMarkets();

//   // جمع كل المدن من كل الأسواق النشطة
//   const allCities = useMemo(() => {
//     const cities: { key: string; label: string }[] = [];
//     activeMarkets.forEach(market => {
//       (market.cities || []).forEach((cityKey: string) => {
//         cities.push({ key: cityKey, label: getCityName(cityKey, locale) });
//       });
//     });
//     return cities.sort((a, b) => a.label.localeCompare(b.label));
//   }, [activeMarkets, locale]);

//   const [searchOrigin, setSearchOrigin] = useState('');
//   const [searchDest, setSearchDest] = useState('');
//   const [filterType, setFilterType] = useState<'all' | 'Direct' | 'General'>('all');
//   const [filterVehicle, setFilterVehicle] = useState<'all' | 'سيارة' | 'حافلة'>('all');
//   const [showFilters, setShowFilters] = useState(false);
//   const [visibleCount, setVisibleCount] = useState(20);
//   const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
//   const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);
//   const marketRequestsQuery = useMemoFirebase(() => {
//     if (!firestore || !user?.uid) return null;
//     return query(
//       collection(firestore, 'trips'),
//       where('status', 'in', ['Awaiting-Offers', 'Has_Offers']),
//       limit(visibleCount)
//     );
//   }, [firestore, user, visibleCount]);

//   const directRequestsQuery = useMemoFirebase(() => {
//     if (!firestore || !user?.uid) return null;
//     return query(
//       collection(firestore, 'trips'),
//       where('status', 'in', ['Awaiting-Offers', 'Has_Offers']),
//       where('targetCarrierId', '==', user.uid),
//       limit(50)
//     );
//   }, [firestore, user]);

//   const { data: marketRequests, isLoading: isLoadingMarket } = useCollection<Trip>(marketRequestsQuery);
//   const { data: directRequests, isLoading: isLoadingDirect } = useCollection<Trip>(directRequestsQuery);

//   // ✅ تحديد فئة مركبة الناقل: 'bus' أو 'small'
//   const carrierVehicleCategory = useMemo(() => {
//     if (!profile) return null;
//     const cat = (profile as any).vehicleCategory;
//     if (cat === 'bus' || cat === 'small') return cat;
//     // fallback: استنتج من vehicleCapacity
//     const cap = (profile as any).vehicleCapacity;
//     if (cap) return Number(cap) > 7 ? 'bus' : 'small';
//     return null;
//   }, [profile]);

//   const allRequests = useMemo(() => {
//     const market = marketRequests || [];
//     const direct = directRequests || [];
//     const directIds = new Set(direct.map(t => t.id));
//     const merged = [...direct, ...market.filter(t => !directIds.has(t.id))];

//     // ✅ فلترة حسب نوع مركبة الناقل:
//     // - لو الناقل عنده حافلة (bus) → يشوف الطلبات اللي فيها حافلة أو مفيهاش تفضيل
//     // - لو الناقل عنده سيارة (small) → يشوف الطلبات اللي فيها سيارة أو مفيهاش تفضيل
//     const vehicleFiltered = carrierVehicleCategory
//       ? merged.filter(t => {
//         const tv = (t.vehicleType || '').trim();
//         if (!tv) return true; // مفيش تفضيل → يظهر للكل
//         if (carrierVehicleCategory === 'bus') return tv === 'حافلة';
//         if (carrierVehicleCategory === 'small') return tv === 'سيارة';
//         return true;
//       })
//       : merged;

//     return vehicleFiltered.sort((a, b) => {
//       const aTime = (a as any).createdAt?.toMillis?.() ?? ((a as any).createdAt?.seconds ?? 0) * 1000;
//       const bTime = (b as any).createdAt?.toMillis?.() ?? ((b as any).createdAt?.seconds ?? 0) * 1000;
//       return bTime - aTime;
//     });
//   }, [marketRequests, directRequests, carrierVehicleCategory]);

//   const filteredRequests = useMemo(() => {
//     let result = allRequests;
//     if (filterType !== 'all') result = result.filter(t => filterType === 'Direct' ? t.requestType === 'Direct' : t.requestType !== 'Direct');
//     if (filterVehicle !== 'all') result = result.filter(t => t.vehicleType === filterVehicle);
//     if (searchOrigin.trim()) { const q = searchOrigin.trim().toLowerCase(); result = result.filter(t => getCityName(t.origin, locale).toLowerCase().includes(q) || t.origin?.toLowerCase().includes(q)); }
//     if (searchDest.trim()) { const q = searchDest.trim().toLowerCase(); result = result.filter(t => getCityName(t.destination, locale).toLowerCase().includes(q) || t.destination?.toLowerCase().includes(q)); }
//     return result;
//   }, [allRequests, filterType, filterVehicle, searchOrigin, searchDest, locale]);

//   const directCount = useMemo(() => allRequests.filter(t => t.requestType === 'Direct').length, [allRequests]);
//   const isLoading = isLoadingMarket || isLoadingDirect;

//   const handleSendOffer = useCallback(async (
//     offerData: Omit<Offer, 'id' | 'tripId' | 'carrierId' | 'status' | 'createdAt'>
//   ): Promise<boolean> => {
//     if (!firestore || !user?.uid || !selectedTrip || !profile) {
//       toast({ variant: 'destructive', title: 'خطأ', description: 'بيانات مفقودة.' });
//       return false;
//     }

//     try {
//       const batch = writeBatch(firestore);

//       const offerRef = doc(collection(firestore, 'offers'));
//       batch.set(offerRef, {
//         ...offerData,
//         tripId: selectedTrip.id,
//         passengerIntentId: selectedTrip.id,
//         carrierId: user.uid,
//         carrierName: [profile.firstName, profile.lastName].filter(Boolean).join(' ') || 'ناقل',
//         status: 'Pending',
//         createdAt: serverTimestamp(),
//         updatedAt: serverTimestamp(),
//       });

//       const tripRef = doc(firestore, 'trips', selectedTrip.id);
//       batch.update(tripRef, {
//         offersCount: increment(1),
//         status: 'Has_Offers',
//         updatedAt: serverTimestamp(),
//       });

//       await batch.commit();

//       toast({ title: '✅ تم إرسال عرضك بنجاح!' });
//       setIsOfferDialogOpen(false);
//       setSelectedTrip(null);
//       return true;
//     } catch (err) {
//       console.error('[MarketRequests] sendOffer error:', err);
//       toast({ variant: 'destructive', title: 'فشل إرسال العرض', description: 'حاول مجدداً.' });
//       return false;
//     }
//   }, [firestore, user, selectedTrip, profile, toast]);


//   const handleOffer = useCallback((trip: Trip) => { setSelectedTrip(trip); setIsOfferDialogOpen(true); }, []);
//   const hasActiveFilters = filterType !== 'all' || filterVehicle !== 'all' || !!searchOrigin || !!searchDest;
//   const clearFilters = () => { setSearchOrigin(''); setSearchDest(''); setFilterType('all'); setFilterVehicle('all'); };

//   // const tc = useTranslations('carrierLayout');

//   return (
//     <div className="space-y-4 pb-20 pt-4 animate-in fade-in slide-in-from-bottom-2 duration-500" dir={isRtl ? 'rtl' : 'ltr'}>

//       {/* ─── الهيدر الثابت ─── */}
//       <div className="sticky top-[60px] md:top-[70px] z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-2">
//         <div className="bg-card rounded-2xl border border-[#BFAF78] overflow-hidden shadow-sm">

//           <div className="flex items-center justify-between p-4 bg-blue-600 text-white">
//             <div className="flex items-center gap-2 font-semibold text-sm">
//               <TrendingUp className="w-4 h-4" />
//               <span>{tc('marketTitle')}</span>
//               {!isLoading && (
//                 <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full font-bold">
//                   {filteredRequests.length}
//                 </span>
//               )}
//             </div>
//             <div className="flex items-center gap-2">
//               {directCount > 0 && (
//                 <span className="flex items-center gap-1 text-xs bg-amber-400/20 border border-amber-300/30 text-amber-200 px-2 py-0.5 rounded-full font-bold animate-pulse">
//                   <UserCheck className="h-3 w-3" />{directCount} {tc('marketDirect')}
//                 </span>
//               )}
//               <button
//                 onClick={() => setShowFilters(v => !v)}
//                 className={cn(
//                   'flex items-center gap-1 text-xs px-3 py-1.5 rounded-full font-semibold transition-colors',
//                   hasActiveFilters ? 'bg-amber-400/20 border border-amber-300/30 text-amber-200' : 'bg-white/10 hover:bg-white/20'
//                 )}
//               >
//                 <SlidersHorizontal className="h-3.5 w-3.5" />
//                 {hasActiveFilters ? tc('marketActiveFilter') : tc('marketFilter')}
//               </button>
//             </div>
//           </div>

//           {showFilters && (
//             <div className="p-4 border-t border-muted/50 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">

//               {/* ✅ سليكتور المدن */}
//               {/* <div className="grid grid-cols-2 gap-2">
//                 <Select value={searchOrigin || 'all'} onValueChange={v => setSearchOrigin(v === 'all' ? '' : v)} dir={isRtl ? 'rtl' : 'ltr'}>
//                   <SelectTrigger className="h-10 bg-card/50 text-sm">
//                     <SelectValue placeholder={tc('marketOrigin')} />
//                   </SelectTrigger>
//                   <SelectContent className="max-h-60">
//                     <SelectItem value="all">{tc('marketAllCities')}</SelectItem>
//                     {allCities.map(c => (
//                       <SelectItem key={c.key} value={c.key}>{c.label}</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>

//                 <Select value={searchDest || 'all'} onValueChange={v => setSearchDest(v === 'all' ? '' : v)} dir={isRtl ? 'rtl' : 'ltr'}>
//                   <SelectTrigger className="h-10 bg-card/50 text-sm">
//                     <SelectValue placeholder={tc('marketDest')} />
//                   </SelectTrigger>
//                   <SelectContent className="max-h-60">
//                     <SelectItem value="all">{tc('marketAllCities')}</SelectItem>
//                     {allCities.map(c => (
//                       <SelectItem key={c.key} value={c.key}>{c.label}</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div> */}


//               {/* ✅ سليكتور المدن */}
//               <div className="grid grid-cols-2 gap-2">
//                 <div className="space-y-1">
//                   <label className="text-sm px-2 font-semibold text-muted-foreground">
//                     {tc('marketOrigin')}
//                   </label>
//                   <Select value={searchOrigin || 'all'} onValueChange={v => setSearchOrigin(v === 'all' ? '' : v)} dir={isRtl ? 'rtl' : 'ltr'}>
//                     <SelectTrigger className="h-10 bg-card/50 text-sm">
//                       <SelectValue placeholder={tc('marketOrigin')} />
//                     </SelectTrigger>
//                     <SelectContent className="max-h-60">
//                       <SelectItem value="all">{tc('marketAllCities')}</SelectItem>
//                       {allCities.map(c => (
//                         <SelectItem key={c.key} value={c.key}>{c.label}</SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-1">
//                   <label className="text-sm px-2 font-semibold text-muted-foreground">
//                     {tc('marketDest')}
//                   </label>
//                   <Select value={searchDest || 'all'} onValueChange={v => setSearchDest(v === 'all' ? '' : v)} dir={isRtl ? 'rtl' : 'ltr'}>
//                     <SelectTrigger className="h-10 bg-card/50 text-sm">
//                       <SelectValue placeholder={tc('marketDest')} />
//                     </SelectTrigger>
//                     <SelectContent className="max-h-60">
//                       <SelectItem value="all">{tc('marketAllCities')}</SelectItem>
//                       {allCities.map(c => (
//                         <SelectItem key={c.key} value={c.key}>{c.label}</SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//               <div className="grid  gap-2">
//                 <Select value={filterType} onValueChange={(v: any) => setFilterType(v)} dir={isRtl ? 'rtl' : 'ltr'}>
//                   <SelectTrigger className="h-10 bg-card/50 text-sm"><SelectValue placeholder={tc('marketReqType')} /></SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">{tc('marketAllReqs')}</SelectItem>
//                     <SelectItem value="Direct">{tc('marketDirectOnly')}</SelectItem>
//                     <SelectItem value="General">{tc('marketGeneral')}</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               {hasActiveFilters && (
//                 <Button variant="ghost" size="sm" onClick={clearFilters} className="text-destructive hover:text-destructive gap-1 text-xs h-8 w-full">
//                   <X className="h-3.5 w-3.5" />{tc('marketClearAll')}
//                 </Button>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ─── المحتوى ─── */}
//       <LocalErrorBoundary fallbackTitle={isRtl ? 'تعثر تحميل الطلبات' : 'Failed to load requests'}>
//         {isLoading ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {Array.from({ length: 6 }).map((_, i) => (
//               <div key={i} className="p-5 rounded-2xl border bg-card space-y-3">
//                 <Skeleton className="h-6 w-3/4" /><Skeleton className="h-4 w-1/2" /><Skeleton className="h-16 w-full rounded-xl" /><Skeleton className="h-9 w-28 ml-auto rounded-xl" />
//               </div>
//             ))}
//           </div>
//         ) : filteredRequests.length === 0 ? (
//           <div className="flex flex-col items-center justify-center text-center py-20 px-4 border-2 border-dashed border-[#BFAF78]/30 rounded-2xl bg-secondary/5">
//             <ShipWheel className="h-14 w-14 text-primary/20 mb-4 animate-spin-slow" />
//             <h3 className="text-xl font-bold mb-2 text-foreground/70">
//               {hasActiveFilters ? tc('marketNoResults') : tc('marketNoRequests')}
//             </h3>
//             <p className="text-sm text-muted-foreground max-w-xs">
//               {hasActiveFilters ? tc('marketNoResultsDesc') : tc('marketNoReqDesc')}
//             </p>
//             {hasActiveFilters && (
//               <Button variant="outline" size="sm" className="mt-4 gap-2" onClick={clearFilters}>
//                 <RefreshCw className="h-3.5 w-3.5" />{tc('marketShowAll')}
//               </Button>
//             )}
//           </div>
//         ) : (
//           <>
//             <div className="grid grid-cols-3 gap-3">
//               {[
//                 { label: tc('marketTotalReqs'), value: filteredRequests.length, icon: TrendingUp, color: 'text-blue-400' },
//                 { label: tc('marketDirectForYou'), value: directCount, icon: UserCheck, color: 'text-primary' },
//                 { label: tc('marketGeneralStat'), value: filteredRequests.length - directCount, icon: Star, color: 'text-[#BFAF78]' },
//               ].map(stat => (
//                 <div key={stat.label} className="bg-card border border-muted rounded-xl p-3 text-center space-y-1">
//                   <stat.icon className={cn('h-4 w-4 mx-auto', stat.color)} />
//                   <div className="text-xl font-black">{stat.value}</div>
//                   <div className="text-[10px] text-muted-foreground font-medium leading-tight">{stat.label}</div>
//                 </div>
//               ))}
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {filteredRequests.slice(0, visibleCount).map(trip => (
//                 <RequestCard key={trip.id} trip={trip} onOffer={handleOffer} />
//               ))}
//             </div>

//             {filteredRequests.length > visibleCount && (
//               <div className="flex justify-center pt-2">
//                 <Button variant="outline" size="lg" onClick={() => setVisibleCount(prev => prev + 10)} className="gap-2 font-bold w-full max-w-sm">
//                   <ChevronDown className="h-4 w-4" />
//                   {tc('marketShowMore')} ({filteredRequests.length - visibleCount} {tc('marketRemaining')})
//                 </Button>
//               </div>
//             )}
//           </>
//         )}
//       </LocalErrorBoundary>

//       {selectedTrip && (
//         <OfferDialog
//           isOpen={isOfferDialogOpen}
//           onOpenChange={(open) => { setIsOfferDialogOpen(open); if (!open) setSelectedTrip(null); }}
//           trip={selectedTrip}
//           onSendOffer={handleSendOffer}
//         />
//       )}
//     </div>
//   );
// }
// 'use client';

// import { useState, useMemo, useCallback } from 'react';
// import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
// import {
//   collection, query, where, orderBy, limit, doc, serverTimestamp, increment, writeBatch
// } from 'firebase/firestore';
// import { useLocale, useTranslations } from 'next-intl';
// import { getCityName } from '@/lib/constants';
// import { formatDate } from '@/lib/formatters';
// import type { Trip, Offer } from '@/lib/data';
// import { useUserProfile } from '@/hooks/use-user-profile';
// import { useToast } from '@/hooks/use-toast';
// import { useActiveMarkets } from '@/hooks/use-active-markets';
// import { LocalErrorBoundary } from '@/components/ui/local-error-boundary';
// import { Skeleton } from '@/components/ui/skeleton';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Input } from '@/components/ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { OfferDialog } from '@/components/carrier/offer-dialog';
// import {
//   Search, ArrowLeft, Calendar, Users, SlidersHorizontal,
//   UserCheck, ShipWheel, Handshake, MapPin, Car, Bus,
//   Baby, User, X, TrendingUp, Clock,
//   Star, BadgeDollarSign, ChevronDown, RefreshCw, Phone
// } from 'lucide-react';
// import { cn } from '@/lib/utils';

// type PassengerType = 'adult' | 'child' | 'infant';

// interface NormalizedPassenger {
//   id: string;
//   type: PassengerType;
//   label: string;
// }

// const PASSENGER_ICON: Record<PassengerType, React.ElementType> = {
//   adult: User,
//   child: Users,
//   infant: Baby,
// };

// const PASSENGER_COLOR: Record<PassengerType, string> = {
//   adult: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
//   child: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
//   infant: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
// };

// interface RawPassenger {
//   type?: string;
//   typeLabel?: string;
//   passengerType?: string;
//   documentId?: string;
// }

// function normalizePassenger(raw: RawPassenger, index: number): NormalizedPassenger {
//   const uniqueId = raw?.documentId || `passenger-${index}-${index}`;

//   // الشكل الجديد: { type: 'adult'|'child'|'minor'|'infant' }
//   if (raw?.type && typeof raw.type === 'string') {
//     const rawType = raw.type.toLowerCase();
//     const t: PassengerType = (rawType === 'minor' || rawType === 'child') ? 'child'
//       : rawType === 'infant' ? 'infant'
//         : 'adult';
//     return {
//       id: uniqueId,
//       type: t,
//       label: raw.typeLabel || (t === 'adult' ? 'بالغ' : t === 'child' ? 'قاصر' : 'رضيع')
//     };
//   }

//   // الشكل القديم: { passengerType: string, passengerName, nationality, documentId, ... }
//   const pt = (raw?.passengerType || '').toLowerCase();
//   if (pt.includes('child') || pt.includes('minor') || pt.includes('قاصر')) return { id: uniqueId, type: 'child', label: 'قاصر' };
//   if (pt.includes('infant') || pt.includes('رضيع')) return { id: uniqueId, type: 'infant', label: 'رضيع' };

//   return { id: uniqueId, type: 'adult', label: 'بالغ' };
// }

// function RequestCard({ trip, onOffer }: { trip: Trip; onOffer: (trip: Trip) => void }) {
//   const locale = useLocale();
//   const firestore = useFirestore();
//   const isDirectRequest = trip.requestType === 'Direct';
//   const tripAny = trip as any;
//   const tc = useTranslations('carrierLayout')

//   // ✅ جلب بيانات المسافر من users collection لو مش موجودة في الطلب
//   const travelerDocRef = useMemo(() => {
//     if (!firestore) return null;
//     const uid = tripAny.userId;
//     if (!uid) return null;
//     // لو البيانات موجودة أصلاً ما نجيبش
//     if (tripAny.travelerName || tripAny.travelerPhone) return null;
//     return doc(firestore, 'users', uid);
//   }, [firestore, tripAny.userId, tripAny.travelerName, tripAny.travelerPhone]);

//   const { data: travelerProfile } = useDoc<any>(travelerDocRef);

//   // اسم المسافر ورقمه — من الطلب أو من الـ profile
//   const travelerName = tripAny.travelerName
//     || [travelerProfile?.firstName, travelerProfile?.lastName].filter(Boolean).join(' ')
//     || travelerProfile?.displayName
//     || travelerProfile?.fullName
//     || '';

//   const travelerPhone = tripAny.travelerPhone || travelerProfile?.phoneNumber || '';
//   const travelerPhoneCode = tripAny.travelerPhoneCode || travelerProfile?.phoneCountryCode || '';

//   // ✅ بناء رقم الاتصال الكامل مع كود الدولة
//   const fullPhoneNumber = useMemo(() => {
//     if (!travelerPhone) return '';
//     // لو الرقم فيه + في الأول يبقا كامل بالفعل
//     if (travelerPhone.startsWith('+')) return travelerPhone;
//     // لو في كود دولة
//     if (travelerPhoneCode) {
//       const code = travelerPhoneCode.startsWith('+') ? travelerPhoneCode : `+${travelerPhoneCode}`;
//       // شيل الصفر من الأول لو موجود
//       const num = travelerPhone.replace(/^0+/, '');
//       return `${code}${num}`;
//     }
//     // مفيش كود → حط + في الأول على الأقل
//     return travelerPhone.startsWith('0') ? travelerPhone : `+${travelerPhone}`;
//   }, [travelerPhone, travelerPhoneCode]);

//   const passengersDetails: NormalizedPassenger[] = useMemo(() => {
//     const tripAny = trip as any;
//     // الحقل ممكن يكون passengersDetails أو passengers لو array
//     const raw = tripAny.passengersDetails ?? tripAny.passengersList ?? null;
//     if (!Array.isArray(raw) || raw.length === 0) return [];
//     return raw.map((p: RawPassenger, idx: number) => normalizePassenger(p, idx));
//   }, [(trip as any).passengersDetails, (trip as any).passengersList]);

//   const passengerSummary = useMemo(() => {
//     if (!passengersDetails.length) return null;
//     const counts: Record<PassengerType, number> = { adult: 0, child: 0, infant: 0 };
//     passengersDetails.forEach(p => { counts[p.type] = (counts[p.type] || 0) + 1; });
//     return counts;
//   }, [passengersDetails]);

//   const depDate = useMemo(() => {
//     const raw = trip.departureDate;
//     if (!raw) return null;
//     try { return typeof (raw as any)?.toDate === 'function' ? (raw as any).toDate() : new Date(raw); }
//     catch { return null; }
//   }, [trip.departureDate]);

//   const daysUntil = depDate ? Math.ceil((depDate.getTime() - Date.now()) / 86400000) : null;
//   const isPast = daysUntil !== null && daysUntil < 0;


//   // ✅ تم إضافة (as any) للتحايل على حماية TypeScript لأن نوع البيانات الفعلي قد يختلف عن الـ Interface
//   const passengerCount = useMemo(() => {
//     const rawPassengers = trip.passengers as any;

//     if (typeof rawPassengers === 'number' || typeof rawPassengers === 'string') {
//       return Number(rawPassengers) || 1;
//     }
//     if (Array.isArray(rawPassengers)) {
//       return rawPassengers.length;
//     }
//     if (Array.isArray((trip as any).passengersDetails)) {
//       return (trip as any).passengersDetails.length;
//     }
//     return 1;
//   }, [trip.passengers, (trip as any).passengersDetails]);
//   return (
//     <div className={cn(
//       'group relative flex flex-col gap-4 p-5 rounded-2xl border transition-all duration-300',
//       'bg-card hover:shadow-lg hover:shadow-primary/5',
//       isDirectRequest
//         ? 'border-primary/40 shadow-sm shadow-primary/10 bg-gradient-to-br from-primary/5 to-card'
//         : 'border-border hover:border-primary/30'
//     )}>
//       {isDirectRequest && (
//         <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r from-primary via-[#BFAF78] to-primary" />
//       )}

//       <div className="flex items-start justify-between gap-3">
//         <div className="flex-1 min-w-0">
//           {isDirectRequest && (
//             <Badge className="mb-2 gap-1 text-xs bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
//               <UserCheck className="h-3 w-3" /> {tc('marketDirect')}
//             </Badge>
//           )}
//           {/* ✅ السهم من اليمين لليسار (عمّان → الرياض) */}
//           <div className="flex items-center gap-2 font-bold text-lg text-foreground flex-wrap">
//             <span className="flex items-center gap-1">
//               <MapPin className="h-4 w-4 text-primary shrink-0" />
//               {getCityName(trip.origin, locale)}
//             </span>
//             <span className="text-primary font-black text-xl leading-none">←</span>
//             <span className="flex items-center gap-1">
//               <MapPin className="h-4 w-4 text-[#BFAF78] shrink-0" />
//               {getCityName(trip.destination, locale)}
//             </span>
//           </div>
//         </div>

//         {/* {daysUntil !== null && (
//           <div className={cn(
//             'flex flex-col items-center justify-center min-w-[52px] h-[52px] rounded-xl border text-center shrink-0',
//             isPast ? 'bg-muted/50 border-muted text-muted-foreground' :
//               daysUntil <= 1 ? 'bg-destructive/10 border-destructive/30 text-destructive' :
//                 daysUntil <= 3 ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
//                   'bg-muted/50 border-muted text-muted-foreground'
//           )}>
//             {isPast ? (
//               <span className="text-xs font-bold leading-none">منتهية</span>
//             ) : (
//               <>
//                 <span className="text-xl font-black leading-none">{daysUntil}</span>
//                 <span className="text-[10px] font-bold leading-none mt-0.5">يوم</span>
//               </>
//             )}
//           </div>
//         )} */}
//       </div>

//       <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
//         {depDate && (
//           <span className="flex items-center gap-1.5 font-medium">
//             <Calendar className="h-3.5 w-3.5 text-primary" />
//             {formatDate(trip.departureDate, 'd MMM yyyy', locale)}
//           </span>
//         )}
//         <span className="flex items-center gap-1.5 font-medium">
//           <Users className="h-3.5 w-3.5 text-primary" />
//           {passengerCount} راكب
//         </span>
//         {trip.vehicleType && (
//           <span className="flex items-center gap-1.5 font-medium">
//             {trip.vehicleType === 'حافلة' ? <Bus className="h-3.5 w-3.5 text-primary" /> : <Car className="h-3.5 w-3.5 text-primary" />}
//             {trip.vehicleType}
//           </span>
//         )}
//         {trip.targetPrice && (
//           <span className="flex items-center gap-1.5 font-medium text-emerald-500">
//             <BadgeDollarSign className="h-3.5 w-3.5" />
//             ميزانية: ~{trip.targetPrice} {trip.currency || 'JOD'}
//           </span>
//         )}
//       </div>
//       {daysUntil !== null && (
//         <div className={cn(
//           'flex items-center gap-1  min-w-[52px] h-[52px] rounded-xl border text-center shrink-0 px-3',
//           isPast ? 'bg-muted/50 border-muted text-muted-foreground' :
//             // daysUntil <= 1 ? 'bg-destructive/10 border-destructive/30 text-destructive' :
//             //   daysUntil <= 3 ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
//             'bg-[#B09E6E] border-muted text-black'
//         )}>
//           {isPast ? (
//             <span className="text-xs font-bold leading-none">منتهية</span>
//           ) : (
//             <>
//               <span className="text-sm font-bold leading-none mt-0.5">{tc('marketLeft')}</span>
//               <span className="text-xl font-bold leading-none">{daysUntil}</span>
//               <span className="text-sm font-bold leading-none mt-0.5">{tc('marketDaysLeft')}</span>

//             </>
//           )}
//         </div>
//       )}
//       {/* ✅ بيانات المسافر - تظهر دايماً لو في اسم أو تليفون */}
//       {(travelerName || travelerPhone) && (
//         <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-muted/30 border border-muted/50">
//           <div className="flex items-center gap-2 min-w-0">
//             <div className="h-7 w-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
//               <User className="h-3.5 w-3.5 text-primary" />
//             </div>
//             <span className="text-sm font-semibold text-foreground truncate">
//               {travelerName || 'مسافر'}
//             </span>
//           </div>
//           {travelerPhone && (
//             <a
//               href={`tel:${fullPhoneNumber}`}
//               className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors shrink-0"
//               dir="ltr"
//               onClick={e => e.stopPropagation()}
//             >
//               <Phone className="h-3.5 w-3.5" />
//               <span>{fullPhoneNumber}</span>
//             </a>
//           )}
//         </div>
//       )}

//       {passengersDetails.length > 0 && (
//         <div className="space-y-2">
//           <p className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
//             <Users className="h-3 w-3" /> {tc('marketPassengers')}:
//           </p>
//           <div className="flex flex-wrap gap-1.5">
//             {passengersDetails.map((p, idx) => {
//               const Icon = PASSENGER_ICON[p.type] || User;
//               const colorClass = PASSENGER_COLOR[p.type] || PASSENGER_COLOR.adult;
//               return (
//                 <span key={p.id} className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border font-medium', colorClass)}>
//                   <Icon className="h-3 w-3" />
//                   راكب {idx + 1}: {p.label}
//                 </span>
//               );
//             })}
//           </div>
//           {passengerSummary && (
//             <div className="flex flex-wrap gap-3 pt-1 border-t border-muted/40">
//               {passengerSummary.adult > 0 && <span className="text-xs text-muted-foreground flex items-center gap-1"><User className="h-3 w-3 text-blue-400" /> {passengerSummary.adult} بالغ</span>}
//               {passengerSummary.child > 0 && <span className="text-xs text-muted-foreground flex items-center gap-1"><Users className="h-3 w-3 text-amber-400" /> {passengerSummary.child} قاصر</span>}
//               {passengerSummary.infant > 0 && <span className="text-xs text-muted-foreground flex items-center gap-1"><Baby className="h-3 w-3 text-pink-400" /> {passengerSummary.infant} رضيع</span>}
//             </div>
//           )}
//         </div>
//       )}

//       {trip.notes && (
//         <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded-xl border border-dashed border-muted">
//           <span className="font-semibold text-foreground/80">ملاحظات المسافر: </span>{trip.notes}
//         </div>
//       )}

//       <div className="flex items-center justify-between gap-3 pt-1 border-t border-muted/40">
//         <span className="text-xs text-muted-foreground/60 flex items-center gap-1">
//           <Clock className="h-3 w-3" />
//           {(trip as any).createdAt?.toDate
//             ? formatDate((trip as any).createdAt.toDate().toISOString(), 'd MMM', locale)
//             : 'حديثاً'}
//         </span>
//         <Button
//           onClick={() => onOffer(trip)}
//           size="sm"
//           disabled={isPast}
//           className={cn(
//             'gap-2 rounded-xl font-semibold transition-all duration-200',
//             isDirectRequest
//               ? 'bg-primary hover:bg-primary/90 shadow-md shadow-primary/20'
//               : 'bg-card hover:bg-primary hover:text-primary-foreground border border-primary/40 text-primary'
//           )}
//           variant={isDirectRequest ? 'default' : 'outline'}
//         >
//           <Handshake className="h-4 w-4" />
//           {isDirectRequest ? 'قبول وتحديد السعر' : 'تقديم عرض'}
//         </Button>
//       </div>
//     </div>
//   );
// }

// export default function MarketRequestsPage() {
//   const { user } = useUser();
//   const { profile } = useUserProfile();
//   const firestore = useFirestore();
//   const { toast } = useToast();
//   const locale = useLocale();
//   const isRtl = locale === 'ar';
//   const tc = useTranslations('carrierLayout');
//   const { activeMarkets } = useActiveMarkets();

//   // جمع كل المدن من كل الأسواق النشطة
//   const allCities = useMemo(() => {
//     const cities: { key: string; label: string }[] = [];
//     activeMarkets.forEach(market => {
//       (market.cities || []).forEach((cityKey: string) => {
//         cities.push({ key: cityKey, label: getCityName(cityKey, locale) });
//       });
//     });
//     return cities.sort((a, b) => a.label.localeCompare(b.label));
//   }, [activeMarkets, locale]);

//   const [searchOrigin, setSearchOrigin] = useState('');
//   const [searchDest, setSearchDest] = useState('');
//   const [filterType, setFilterType] = useState<'all' | 'Direct' | 'General'>('all');
//   const [filterVehicle, setFilterVehicle] = useState<'all' | 'سيارة' | 'حافلة'>('all');
//   const [showFilters, setShowFilters] = useState(false);
//   const [visibleCount, setVisibleCount] = useState(20);
//   const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
//   const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);
//   const marketRequestsQuery = useMemoFirebase(() => {
//     if (!firestore || !user?.uid) return null;
//     return query(
//       collection(firestore, 'trips'),
//       where('status', 'in', ['Awaiting-Offers', 'Has_Offers']),
//       limit(200)
//     );
//   }, [firestore, user]);

//   const directRequestsQuery = useMemoFirebase(() => {
//     if (!firestore || !user?.uid) return null;
//     return query(
//       collection(firestore, 'trips'),
//       where('status', 'in', ['Awaiting-Offers', 'Has_Offers']),
//       where('targetCarrierId', '==', user.uid),
//       limit(50)
//     );
//   }, [firestore, user]);

//   // ✅ جلب العروض اللي الناقل بعتها عشان نخفي الطلبات المقدَّم عليها
//   const sentOffersQuery = useMemoFirebase(() => {
//     if (!firestore || !user?.uid) return null;
//     return query(
//       collection(firestore, 'offers'),
//       where('carrierId', '==', user.uid),
//       where('status', '==', 'Pending'),
//       limit(100)
//     );
//   }, [firestore, user]);

//   const { data: marketRequests, isLoading: isLoadingMarket } = useCollection<Trip>(marketRequestsQuery);
//   const { data: directRequests, isLoading: isLoadingDirect } = useCollection<Trip>(directRequestsQuery);
//   const { data: sentOffers } = useCollection<any>(sentOffersQuery);

//   // IDs الطلبات اللي الناقل بعتلها عرض بالفعل
//   const alreadyOfferedTripIds = useMemo(() => {
//     if (!sentOffers) return new Set<string>();
//     return new Set(sentOffers.map((o: any) => o.tripId).filter(Boolean));
//   }, [sentOffers]);

//   // ✅ تحديد فئة مركبة الناقل: 'bus' أو 'small'
//   const carrierVehicleCategory = useMemo(() => {
//     if (!profile) return null;
//     const cat = (profile as any).vehicleCategory;
//     if (cat === 'bus' || cat === 'small') return cat;
//     // fallback: استنتج من vehicleCapacity
//     const cap = (profile as any).vehicleCapacity;
//     if (cap) return Number(cap) > 7 ? 'bus' : 'small';
//     return null;
//   }, [profile]);

//   const allRequests = useMemo(() => {
//     const market = marketRequests || [];
//     const direct = directRequests || [];
//     const directIds = new Set(direct.map(t => t.id));
//     const merged = [...direct, ...market.filter(t => !directIds.has(t.id))];

//     // ✅ إخفاء الطلبات اللي الناقل بعتلها عرض بالفعل
//     const withoutSent = merged.filter(t => !alreadyOfferedTripIds.has(t.id));

//     // ✅ فلترة حسب نوع مركبة الناقل:
//     const vehicleFiltered = carrierVehicleCategory
//       ? withoutSent.filter(t => {
//         const tv = (t.vehicleType || '').trim();
//         if (!tv) return true;
//         if (carrierVehicleCategory === 'bus') return tv === 'حافلة';
//         if (carrierVehicleCategory === 'small') return tv === 'سيارة';
//         return true;
//       })
//       : withoutSent;

//     return vehicleFiltered.sort((a, b) => {
//       const aTime = (a as any).createdAt?.toMillis?.() ?? ((a as any).createdAt?.seconds ?? 0) * 1000;
//       const bTime = (b as any).createdAt?.toMillis?.() ?? ((b as any).createdAt?.seconds ?? 0) * 1000;
//       return bTime - aTime;
//     });
//   }, [marketRequests, directRequests, carrierVehicleCategory, alreadyOfferedTripIds]);

//   const filteredRequests = useMemo(() => {
//     let result = allRequests;
//     if (filterType !== 'all') result = result.filter(t => filterType === 'Direct' ? t.requestType === 'Direct' : t.requestType !== 'Direct');
//     if (filterVehicle !== 'all') result = result.filter(t => t.vehicleType === filterVehicle);
//     if (searchOrigin.trim()) { const q = searchOrigin.trim().toLowerCase(); result = result.filter(t => getCityName(t.origin, locale).toLowerCase().includes(q) || t.origin?.toLowerCase().includes(q)); }
//     if (searchDest.trim()) { const q = searchDest.trim().toLowerCase(); result = result.filter(t => getCityName(t.destination, locale).toLowerCase().includes(q) || t.destination?.toLowerCase().includes(q)); }
//     return result;
//   }, [allRequests, filterType, filterVehicle, searchOrigin, searchDest, locale]);

//   const directCount = useMemo(() => allRequests.filter(t => t.requestType === 'Direct').length, [allRequests]);
//   const isLoading = isLoadingMarket || isLoadingDirect;

//   const handleSendOffer = useCallback(async (
//     offerData: Omit<Offer, 'id' | 'tripId' | 'carrierId' | 'status' | 'createdAt'>
//   ): Promise<boolean> => {
//     if (!firestore || !user?.uid || !selectedTrip || !profile) {
//       toast({ variant: 'destructive', title: 'خطأ', description: 'بيانات مفقودة.' });
//       return false;
//     }

//     try {
//       const batch = writeBatch(firestore);

//       const offerRef = doc(collection(firestore, 'offers'));
//       batch.set(offerRef, {
//         ...offerData,
//         tripId: selectedTrip.id,
//         passengerIntentId: selectedTrip.id,
//         carrierId: user.uid,
//         carrierName: [profile.firstName, profile.lastName].filter(Boolean).join(' ') || 'ناقل',
//         status: 'Pending',
//         createdAt: serverTimestamp(),
//         updatedAt: serverTimestamp(),
//       });

//       const tripRef = doc(firestore, 'trips', selectedTrip.id);
//       batch.update(tripRef, {
//         offersCount: increment(1),
//         status: 'Has_Offers',
//         updatedAt: serverTimestamp(),
//       });

//       await batch.commit();

//       toast({ title: '✅ تم إرسال عرضك بنجاح!' });
//       setIsOfferDialogOpen(false);
//       setSelectedTrip(null);
//       return true;
//     } catch (err) {
//       console.error('[MarketRequests] sendOffer error:', err);
//       toast({ variant: 'destructive', title: 'فشل إرسال العرض', description: 'حاول مجدداً.' });
//       return false;
//     }
//   }, [firestore, user, selectedTrip, profile, toast]);


//   const handleOffer = useCallback((trip: Trip) => { setSelectedTrip(trip); setIsOfferDialogOpen(true); }, []);
//   const hasActiveFilters = filterType !== 'all' || filterVehicle !== 'all' || !!searchOrigin || !!searchDest;
//   const clearFilters = () => { setSearchOrigin(''); setSearchDest(''); setFilterType('all'); setFilterVehicle('all'); };

//   // const tc = useTranslations('carrierLayout');

//   return (
//     <div className="space-y-4 pb-20 pt-4 animate-in fade-in slide-in-from-bottom-2 duration-500" dir={isRtl ? 'rtl' : 'ltr'}>

//       {/* ─── الهيدر الثابت ─── */}
//       <div className="sticky top-[60px] md:top-[70px] z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-2">
//         <div className="bg-card rounded-2xl border border-[#BFAF78] overflow-hidden shadow-sm">

//           <div className="flex items-center justify-between p-4 bg-blue-600 text-white">
//             <div className="flex items-center gap-2 font-semibold text-sm">
//               <TrendingUp className="w-4 h-4" />
//               <span>{tc('marketTitle')}</span>
//               {!isLoading && (
//                 <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full font-bold">
//                   {filteredRequests.length}
//                 </span>
//               )}
//             </div>
//             <div className="flex items-center gap-2">
//               {directCount > 0 && (
//                 <span className="flex items-center gap-1 text-xs bg-amber-400/20 border border-amber-300/30 text-amber-200 px-2 py-0.5 rounded-full font-bold animate-pulse">
//                   <UserCheck className="h-3 w-3" />{directCount} {tc('marketDirect')}
//                 </span>
//               )}
//               <button
//                 onClick={() => setShowFilters(v => !v)}
//                 className={cn(
//                   'flex items-center gap-1 text-xs px-3 py-1.5 rounded-full font-semibold transition-colors',
//                   hasActiveFilters ? 'bg-amber-400/20 border border-amber-300/30 text-amber-200' : 'bg-white/10 hover:bg-white/20'
//                 )}
//               >
//                 <SlidersHorizontal className="h-3.5 w-3.5" />
//                 {hasActiveFilters ? tc('marketActiveFilter') : tc('marketFilter')}
//               </button>
//             </div>
//           </div>

//           {showFilters && (
//             <div className="p-4 border-t border-muted/50 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">

//               {/* ✅ سليكتور المدن */}
//               <div className="grid grid-cols-2 gap-2">
//                 <div className="space-y-1">
//                   <label className="text-sm px-2 font-semibold text-muted-foreground">
//                     {tc('marketOrigin')}
//                   </label>
//                   <Select value={searchOrigin || 'all'} onValueChange={v => setSearchOrigin(v === 'all' ? '' : v)} dir={isRtl ? 'rtl' : 'ltr'}>
//                     <SelectTrigger className="h-10 bg-card/50 text-sm">
//                       <SelectValue placeholder={tc('marketOrigin')} />
//                     </SelectTrigger>
//                     <SelectContent className="max-h-60">
//                       <SelectItem value="all">{tc('marketAllCities')}</SelectItem>
//                       {allCities.map(c => (
//                         <SelectItem key={c.key} value={c.key}>{c.label}</SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-1">
//                   <label className="text-sm px-2 font-semibold text-muted-foreground">
//                     {tc('marketDest')}
//                   </label>
//                   <Select value={searchDest || 'all'} onValueChange={v => setSearchDest(v === 'all' ? '' : v)} dir={isRtl ? 'rtl' : 'ltr'}>
//                     <SelectTrigger className="h-10 bg-card/50 text-sm">
//                       <SelectValue placeholder={tc('marketDest')} />
//                     </SelectTrigger>
//                     <SelectContent className="max-h-60">
//                       <SelectItem value="all">{tc('marketAllCities')}</SelectItem>
//                       {allCities.map(c => (
//                         <SelectItem key={c.key} value={c.key}>{c.label}</SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//               <div className="grid  gap-2">
//                 <Select value={filterType} onValueChange={(v: any) => setFilterType(v)} dir={isRtl ? 'rtl' : 'ltr'}>
//                   <SelectTrigger className="h-10 bg-card/50 text-sm"><SelectValue placeholder={tc('marketReqType')} /></SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">{tc('marketAllReqs')}</SelectItem>
//                     <SelectItem value="Direct">{tc('marketDirectOnly')}</SelectItem>
//                     <SelectItem value="General">{tc('marketGeneral')}</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               {hasActiveFilters && (
//                 <Button variant="ghost" size="sm" onClick={clearFilters} className="text-destructive hover:text-destructive gap-1 text-xs h-8 w-full">
//                   <X className="h-3.5 w-3.5" />{tc('marketClearAll')}
//                 </Button>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ─── المحتوى ─── */}
//       <LocalErrorBoundary fallbackTitle={isRtl ? 'تعثر تحميل الطلبات' : 'Failed to load requests'}>
//         {isLoading ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {Array.from({ length: 6 }).map((_, i) => (
//               <div key={i} className="p-5 rounded-2xl border bg-card space-y-3">
//                 <Skeleton className="h-6 w-3/4" /><Skeleton className="h-4 w-1/2" /><Skeleton className="h-16 w-full rounded-xl" /><Skeleton className="h-9 w-28 ml-auto rounded-xl" />
//               </div>
//             ))}
//           </div>
//         ) : filteredRequests.length === 0 ? (
//           <div className="flex flex-col items-center justify-center text-center py-20 px-4 border-2 border-dashed border-[#BFAF78]/30 rounded-2xl bg-secondary/5">
//             <ShipWheel className="h-14 w-14 text-primary/20 mb-4 animate-spin-slow" />
//             <h3 className="text-xl font-bold mb-2 text-foreground/70">
//               {hasActiveFilters ? tc('marketNoResults') : tc('marketNoRequests')}
//             </h3>
//             <p className="text-sm text-muted-foreground max-w-xs">
//               {hasActiveFilters ? tc('marketNoResultsDesc') : tc('marketNoReqDesc')}
//             </p>
//             {hasActiveFilters && (
//               <Button variant="outline" size="sm" className="mt-4 gap-2" onClick={clearFilters}>
//                 <RefreshCw className="h-3.5 w-3.5" />{tc('marketShowAll')}
//               </Button>
//             )}
//           </div>
//         ) : (
//           <>
//             <div className="grid grid-cols-3 gap-3">
//               {[
//                 { label: tc('marketTotalReqs'), value: filteredRequests.length, icon: TrendingUp, color: 'text-blue-400' },
//                 { label: tc('marketDirectForYou'), value: directCount, icon: UserCheck, color: 'text-primary' },
//                 { label: tc('marketGeneralStat'), value: filteredRequests.length - directCount, icon: Star, color: 'text-[#BFAF78]' },
//               ].map(stat => (
//                 <div key={stat.label} className="bg-card border border-muted rounded-xl p-3 text-center space-y-1">
//                   <stat.icon className={cn('h-4 w-4 mx-auto', stat.color)} />
//                   <div className="text-xl font-black">{stat.value}</div>
//                   <div className="text-[10px] text-muted-foreground font-medium leading-tight">{stat.label}</div>
//                 </div>
//               ))}
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {filteredRequests.slice(0, visibleCount).map(trip => (
//                 <RequestCard key={trip.id} trip={trip} onOffer={handleOffer} />
//               ))}
//             </div>

//             {filteredRequests.length > visibleCount && (
//               <div className="flex justify-center pt-2">
//                 <Button variant="outline" size="lg" onClick={() => setVisibleCount(prev => prev + 10)} className="gap-2 font-bold w-full max-w-sm">
//                   <ChevronDown className="h-4 w-4" />
//                   {tc('marketShowMore')} ({filteredRequests.length - visibleCount} {tc('marketRemaining')})
//                 </Button>
//               </div>
//             )}
//           </>
//         )}
//       </LocalErrorBoundary>

//       {selectedTrip && (
//         <OfferDialog
//           isOpen={isOfferDialogOpen}
//           onOpenChange={(open) => { setIsOfferDialogOpen(open); if (!open) setSelectedTrip(null); }}
//           trip={selectedTrip}
//           onSendOffer={handleSendOffer}
//         />
//       )}
//     </div>
//   );
// }
'use client';

import { useState, useMemo, useCallback } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import {
  collection, query, where, orderBy, limit, doc, serverTimestamp, increment, writeBatch
} from 'firebase/firestore';
import { useLocale, useTranslations } from 'next-intl';
import { getCityName } from '@/lib/constants';
import { formatDate } from '@/lib/formatters';
import type { Trip, Offer } from '@/lib/data';
import { useUserProfile } from '@/hooks/use-user-profile';
import { useToast } from '@/hooks/use-toast';
import { useActiveMarkets } from '@/hooks/use-active-markets';
import { LocalErrorBoundary } from '@/components/ui/local-error-boundary';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OfferDialog } from '@/components/carrier/offer-dialog';
import {
  Search, ArrowLeft, Calendar, Users, SlidersHorizontal,
  UserCheck, ShipWheel, Handshake, MapPin, Car, Bus,
  Baby, User, X, TrendingUp, Clock,
  Star, BadgeDollarSign, ChevronDown, RefreshCw, Phone
} from 'lucide-react';
import { cn } from '@/lib/utils';

type PassengerType = 'adult' | 'child' | 'infant';

interface NormalizedPassenger {
  id: string;
  type: PassengerType;
  label: string;
}

const PASSENGER_ICON: Record<PassengerType, React.ElementType> = {
  adult: User,
  child: Users,
  infant: Baby,
};

const PASSENGER_COLOR: Record<PassengerType, string> = {
  adult: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  child: 'text-amber-400 border-amber-500/20',
  infant: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
};

interface RawPassenger {
  type?: string;
  typeLabel?: string;
  passengerType?: string;
  documentId?: string;
}

function normalizePassenger(raw: RawPassenger, index: number): NormalizedPassenger {
  const uniqueId = raw?.documentId || `passenger-${index}-${index}`;

  // الشكل الجديد: { type: 'adult'|'child'|'minor'|'infant' }
  if (raw?.type && typeof raw.type === 'string') {
    const rawType = raw.type.toLowerCase();
    const t: PassengerType = (rawType === 'minor' || rawType === 'child') ? 'child'
      : rawType === 'infant' ? 'infant'
        : 'adult';
    return {
      id: uniqueId,
      type: t,
      label: raw.typeLabel || (t === 'adult' ? 'بالغ' : t === 'child' ? 'قاصر' : 'رضيع')
    };
  }

  // الشكل القديم: { passengerType: string, passengerName, nationality, documentId, ... }
  const pt = (raw?.passengerType || '').toLowerCase();
  if (pt.includes('child') || pt.includes('minor') || pt.includes('قاصر')) return { id: uniqueId, type: 'child', label: 'قاصر' };
  if (pt.includes('infant') || pt.includes('رضيع')) return { id: uniqueId, type: 'infant', label: 'رضيع' };

  return { id: uniqueId, type: 'adult', label: 'بالغ' };
}

function RequestCard({ trip, onOffer }: { trip: Trip; onOffer: (trip: Trip) => void }) {
  const locale = useLocale();
  const firestore = useFirestore();
  const isDirectRequest = trip.requestType === 'Direct';
  const tripAny = trip as any;
  const tc = useTranslations('carrierLayout');

  // ✅ جلب بيانات المسافر من users collection لو مش موجودة في الطلب
  const travelerDocRef = useMemo(() => {
    if (!firestore) return null;
    const uid = tripAny.userId;
    if (!uid) return null;
    // لو البيانات موجودة أصلاً ما نجيبش
    if (tripAny.travelerName || tripAny.travelerPhone) return null;
    return doc(firestore, 'users', uid);
  }, [firestore, tripAny.userId, tripAny.travelerName, tripAny.travelerPhone]);

  const { data: travelerProfile } = useDoc<any>(travelerDocRef);

  // اسم المسافر ورقمه — من الطلب أو من الـ profile
  const travelerName = tripAny.travelerName
    || [travelerProfile?.firstName, travelerProfile?.lastName].filter(Boolean).join(' ')
    || travelerProfile?.displayName
    || travelerProfile?.fullName
    || '';

  const travelerPhone = tripAny.travelerPhone || travelerProfile?.phoneNumber || '';
  const travelerPhoneCode = tripAny.travelerPhoneCode || travelerProfile?.phoneCountryCode || '';

  // ✅ بناء رقم الاتصال الكامل مع كود الدولة
  const fullPhoneNumber = useMemo(() => {
    if (!travelerPhone) return '';
    // لو الرقم فيه + في الأول يبقا كامل بالفعل
    if (travelerPhone.startsWith('+')) return travelerPhone;
    // لو في كود دولة
    if (travelerPhoneCode) {
      const code = travelerPhoneCode.startsWith('+') ? travelerPhoneCode : `+${travelerPhoneCode}`;
      // شيل الصفر من الأول لو موجود
      const num = travelerPhone.replace(/^0+/, '');
      return `${code}${num}`;
    }
    // مفيش كود → حط + في الأول على الأقل
    return travelerPhone.startsWith('0') ? travelerPhone : `+${travelerPhone}`;
  }, [travelerPhone, travelerPhoneCode]);

  const passengersDetails: NormalizedPassenger[] = useMemo(() => {
    const tripAny = trip as any;
    // الحقل ممكن يكون passengersDetails أو passengers لو array
    const raw = tripAny.passengersDetails ?? tripAny.passengersList ?? null;
    if (!Array.isArray(raw) || raw.length === 0) return [];
    return raw.map((p: RawPassenger, idx: number) => normalizePassenger(p, idx));
  }, [(trip as any).passengersDetails, (trip as any).passengersList]);

  const passengerSummary = useMemo(() => {
    if (!passengersDetails.length) return null;
    const counts: Record<PassengerType, number> = { adult: 0, child: 0, infant: 0 };
    passengersDetails.forEach(p => { counts[p.type] = (counts[p.type] || 0) + 1; });
    return counts;
  }, [passengersDetails]);

  const depDate = useMemo(() => {
    const raw = trip.departureDate;
    if (!raw) return null;
    try { return typeof (raw as any)?.toDate === 'function' ? (raw as any).toDate() : new Date(raw); }
    catch { return null; }
  }, [trip.departureDate]);

  const daysUntil = depDate ? Math.ceil((depDate.getTime() - Date.now()) / 86400000) : null;
  const isPast = daysUntil !== null && daysUntil < 0;

  // ✅ تم إضافة (as any) للتحايل على حماية TypeScript لأن نوع البيانات الفعلي قد يختلف عن الـ Interface
  const passengerCount = useMemo(() => {
    const rawPassengers = trip.passengers as any;

    if (typeof rawPassengers === 'number' || typeof rawPassengers === 'string') {
      return Number(rawPassengers) || 1;
    }
    if (Array.isArray(rawPassengers)) {
      return rawPassengers.length;
    }
    if (Array.isArray((trip as any).passengersDetails)) {
      return (trip as any).passengersDetails.length;
    }
    return 1;
  }, [trip.passengers, (trip as any).passengersDetails]);

  return (
    <div className={cn(
      'group relative flex flex-col gap-4 p-5 rounded-2xl border transition-all duration-300',
      'bg-card hover:shadow-lg hover:shadow-primary/5',
      isDirectRequest
        ? 'border-primary/40 shadow-sm shadow-primary/10 bg-gradient-to-br from-primary/5 to-card'
        : 'border-border hover:border-primary/30'
    )}>
      {isDirectRequest && (
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r from-primary via-[#BFAF78] to-primary" />
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {isDirectRequest && (
            <Badge className="mb-2 gap-1 text-xs bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
              <UserCheck className="h-3 w-3" /> {tc('marketDirect')}
            </Badge>
          )}
          {/* ✅ السهم من اليمين لليسار (عمّان → الرياض) */}
          <div className="flex items-center gap-2 font-bold text-lg text-foreground flex-wrap">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-primary shrink-0" />
              {getCityName(trip.origin, locale)}
            </span>
            <span className="text-primary font-black text-xl leading-none">←</span>
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-[#BFAF78] shrink-0" />
              {getCityName(trip.destination, locale)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
        {depDate && (
          <span className="flex items-center gap-1.5 font-medium">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            {formatDate(trip.departureDate, 'd MMM yyyy', locale)}
          </span>
        )}
        <span className="flex items-center gap-1.5 font-medium">
          <Users className="h-3.5 w-3.5 text-primary" />
          {passengerCount} راكب
        </span>
        {trip.vehicleType && (
          <span className="flex items-center gap-1.5 font-medium">
            {trip.vehicleType === 'حافلة' ? <Bus className="h-3.5 w-3.5 text-primary" /> : <Car className="h-3.5 w-3.5 text-primary" />}
            {trip.vehicleType}
          </span>
        )}
        {trip.targetPrice && (
          <span className="flex items-center gap-1.5 font-medium text-emerald-500">
            <BadgeDollarSign className="h-3.5 w-3.5" />
            ميزانية: ~{trip.targetPrice} {trip.currency || 'JOD'}
          </span>
        )}
      </div>
      {daysUntil !== null && (
        <div className={cn(
          'flex items-center gap-1  min-w-[52px] h-[52px] rounded-xl border text-center shrink-0 px-3',
          isPast ? 'bg-muted/50 border-muted text-muted-foreground' :
            'bg-[#B09E6E] border-muted text-black'
        )}>
          {isPast ? (
            <span className="text-xs font-bold leading-none">منتهية</span>
          ) : (
            <>
              <span className="text-sm font-bold leading-none mt-0.5">{tc('marketLeft')}</span>
              <span className="text-xl font-bold leading-none">{daysUntil}</span>
              <span className="text-sm font-bold leading-none mt-0.5">{tc('marketDaysLeft')}</span>
            </>
          )}
        </div>
      )}
      {/* ✅ بيانات المسافر - تظهر دايماً لو في اسم أو تليفون */}
      {(travelerName || travelerPhone) && (
        <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-muted/30 border border-muted/50">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-7 w-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <User className="h-3.5 w-3.5 text-primary" />
            </div>
            <span className="text-sm font-semibold text-foreground truncate">
              {travelerName || 'مسافر'}
            </span>
          </div>
          {travelerPhone && (
            <a
              href={`tel:${fullPhoneNumber}`}
              className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors shrink-0"
              dir="ltr"
              onClick={e => e.stopPropagation()}
            >
              <Phone className="h-3.5 w-3.5" />
              <span>{fullPhoneNumber}</span>
            </a>
          )}
        </div>
      )}

      {passengersDetails.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
            <Users className="h-3 w-3" /> {tc('marketPassengers')}:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {passengersDetails.map((p, idx) => {
              const Icon = PASSENGER_ICON[p.type] || User;
              const colorClass = PASSENGER_COLOR[p.type] || PASSENGER_COLOR.adult;
              return (
                <span key={p.id} className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border font-medium', colorClass)}>
                  <Icon className="h-3 w-3" />
                  راكب {idx + 1}: {p.label}
                </span>
              );
            })}
          </div>
          {passengerSummary && (
            <div className="flex flex-wrap gap-3 pt-1 border-t border-muted/40">
              {passengerSummary.adult > 0 && <span className="text-xs text-muted-foreground flex items-center gap-1"><User className="h-3 w-3 text-blue-400" /> {passengerSummary.adult} بالغ</span>}
              {passengerSummary.child > 0 && <span className="text-xs text-muted-foreground flex items-center gap-1"><Users className="h-3 w-3 text-amber-400" /> {passengerSummary.child} قاصر</span>}
              {passengerSummary.infant > 0 && <span className="text-xs text-muted-foreground flex items-center gap-1"><Baby className="h-3 w-3 text-pink-400" /> {passengerSummary.infant} رضيع</span>}
            </div>
          )}
        </div>
      )}

      {trip.notes && (
        <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded-xl border border-dashed border-muted">
          <span className="font-semibold text-foreground/80">ملاحظات المسافر: </span>{trip.notes}
        </div>
      )}

      <div className="flex items-center justify-between gap-3 pt-1 border-t border-muted/40">
        <span className="text-xs text-muted-foreground/60 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {(trip as any).createdAt?.toDate
            ? formatDate((trip as any).createdAt.toDate().toISOString(), 'd MMM', locale)
            : 'حديثاً'}
        </span>
        <Button
          onClick={() => onOffer(trip)}
          size="sm"
          disabled={isPast}
          className={cn(
            'gap-2 rounded-xl font-semibold transition-all duration-200',
            isDirectRequest
              ? 'bg-primary hover:bg-primary/90 shadow-md shadow-primary/20'
              : 'bg-card hover:bg-primary hover:text-primary-foreground border border-primary/40 text-primary'
          )}
          variant={isDirectRequest ? 'default' : 'outline'}
        >
          <Handshake className="h-4 w-4" />
          {isDirectRequest ? 'قبول وتحديد السعر' : 'تقديم عرض'}
        </Button>
      </div>
    </div>
  );
}

export default function MarketRequestsPage() {
  const { user } = useUser();
  const { profile } = useUserProfile();
  const firestore = useFirestore();
  const { toast } = useToast();
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const tc = useTranslations('carrierLayout');
  const { activeMarkets } = useActiveMarkets();

  // جمع كل المدن من كل الأسواق النشطة
  const allCities = useMemo(() => {
    const cities: { key: string; label: string }[] = [];
    activeMarkets.forEach(market => {
      (market.cities || []).forEach((cityKey: string) => {
        cities.push({ key: cityKey, label: getCityName(cityKey, locale) });
      });
    });
    return cities.sort((a, b) => a.label.localeCompare(b.label));
  }, [activeMarkets, locale]);

  const [searchOrigin, setSearchOrigin] = useState('');
  const [searchDest, setSearchDest] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'Direct' | 'General'>('all');
  const [filterVehicle, setFilterVehicle] = useState<'all' | 'سيارة' | 'حافلة'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(20);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);

  const marketRequestsQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return query(
      collection(firestore, 'trips'),
      where('status', 'in', ['Awaiting-Offers', 'Has_Offers']),
      limit(200)
    );
  }, [firestore, user]);

  const directRequestsQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return query(
      collection(firestore, 'trips'),
      where('status', 'in', ['Awaiting-Offers', 'Has_Offers']),
      where('targetCarrierId', '==', user.uid),
      limit(50)
    );
  }, [firestore, user]);

  // ✅ جلب العروض اللي الناقل بعتها عشان نخفي الطلبات المقدَّم عليها
  const sentOffersQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return query(
      collection(firestore, 'offers'),
      where('carrierId', '==', user.uid),
      where('status', '==', 'Pending'),
      limit(100)
    );
  }, [firestore, user]);

  const { data: marketRequests, isLoading: isLoadingMarket } = useCollection<Trip>(marketRequestsQuery);
  const { data: directRequests, isLoading: isLoadingDirect } = useCollection<Trip>(directRequestsQuery);
  const { data: sentOffers } = useCollection<any>(sentOffersQuery);

  // IDs الطلبات اللي الناقل بعتلها عرض بالفعل
  const alreadyOfferedTripIds = useMemo(() => {
    if (!sentOffers) return new Set<string>();
    return new Set(sentOffers.map((o: any) => o.tripId).filter(Boolean));
  }, [sentOffers]);

  // ✅ تحديد فئة مركبة الناقل: 'bus' أو 'small'
  const carrierVehicleCategory = useMemo(() => {
    if (!profile) return null;
    const cat = (profile as any).vehicleCategory;
    if (cat === 'bus' || cat === 'small') return cat;
    // fallback: استنتج من vehicleCapacity
    const cap = (profile as any).vehicleCapacity;
    if (cap) return Number(cap) > 7 ? 'bus' : 'small';
    return null;
  }, [profile]);

  const allRequests = useMemo(() => {
    const market = marketRequests || [];
    const direct = directRequests || [];
    const directIds = new Set(direct.map(t => t.id));
    const merged = [...direct, ...market.filter(t => !directIds.has(t.id))];

    // 1. إخفاء الطلبات اللي الناقل بعتلها عرض بالفعل
    const withoutSent = merged.filter(t => !alreadyOfferedTripIds.has(t.id));

    // 2. ✅ فلترة حسب السعة: استبعاد الطلبات اللي عدد ركابها أكبر من سعة مركبة الناقل
    const carrierCapacity = parseInt((profile as any)?.vehicleCapacity || '0', 10);

    const capacityFiltered = withoutSent.filter(t => {
      // لو الناقل مش مسجل سعة في البروفايل، هنعرضله الطلب علشان منخفيش عنه كل حاجة بالغلط
      if (!carrierCapacity) return true;

      // حساب عدد المقاعد المطلوبة في الرحلة
      let requiredSeats = 1;
      const rawPassengers = t.passengers as any;
      if (typeof rawPassengers === 'number' || typeof rawPassengers === 'string') {
        requiredSeats = Number(rawPassengers) || 1;
      } else if (Array.isArray(rawPassengers)) {
        requiredSeats = rawPassengers.length;
      } else if (Array.isArray((t as any).passengersDetails)) {
        requiredSeats = (t as any).passengersDetails.length;
      }

      // إظهار الطلب فقط لو سعة سيارة الناقل أكبر من أو تساوي عدد الركاب المطلوب
      return requiredSeats <= carrierCapacity;
    });

    // 3. فلترة حسب نوع مركبة الناقل:
    const vehicleFiltered = carrierVehicleCategory
      ? capacityFiltered.filter(t => {
        const tv = (t.vehicleType || '').trim();
        if (!tv) return true;
        if (carrierVehicleCategory === 'bus') return tv === 'حافلة';
        if (carrierVehicleCategory === 'small') return tv === 'سيارة';
        return true;
      })
      : capacityFiltered;

    return vehicleFiltered.sort((a, b) => {
      const aTime = (a as any).createdAt?.toMillis?.() ?? ((a as any).createdAt?.seconds ?? 0) * 1000;
      const bTime = (b as any).createdAt?.toMillis?.() ?? ((b as any).createdAt?.seconds ?? 0) * 1000;
      return bTime - aTime;
    });
  }, [marketRequests, directRequests, carrierVehicleCategory, alreadyOfferedTripIds, profile]);

  const filteredRequests = useMemo(() => {
    let result = allRequests;
    if (filterType !== 'all') result = result.filter(t => filterType === 'Direct' ? t.requestType === 'Direct' : t.requestType !== 'Direct');
    if (filterVehicle !== 'all') result = result.filter(t => t.vehicleType === filterVehicle);
    if (searchOrigin.trim()) { const q = searchOrigin.trim().toLowerCase(); result = result.filter(t => getCityName(t.origin, locale).toLowerCase().includes(q) || t.origin?.toLowerCase().includes(q)); }
    if (searchDest.trim()) { const q = searchDest.trim().toLowerCase(); result = result.filter(t => getCityName(t.destination, locale).toLowerCase().includes(q) || t.destination?.toLowerCase().includes(q)); }
    return result;
  }, [allRequests, filterType, filterVehicle, searchOrigin, searchDest, locale]);

  const directCount = useMemo(() => allRequests.filter(t => t.requestType === 'Direct').length, [allRequests]);
  const isLoading = isLoadingMarket || isLoadingDirect;

  const handleSendOffer = useCallback(async (
    offerData: Omit<Offer, 'id' | 'tripId' | 'carrierId' | 'status' | 'createdAt'>
  ): Promise<boolean> => {
    if (!firestore || !user?.uid || !selectedTrip || !profile) {
      toast({ variant: 'destructive', title: 'خطأ', description: 'بيانات مفقودة.' });
      return false;
    }

    try {
      const batch = writeBatch(firestore);

      const offerRef = doc(collection(firestore, 'offers'));
      batch.set(offerRef, {
        ...offerData,
        tripId: selectedTrip.id,
        passengerIntentId: selectedTrip.id,
        carrierId: user.uid,
        carrierName: [profile.firstName, profile.lastName].filter(Boolean).join(' ') || 'ناقل',
        status: 'Pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const tripRef = doc(firestore, 'trips', selectedTrip.id);
      batch.update(tripRef, {
        offersCount: increment(1),
        status: 'Has_Offers',
        updatedAt: serverTimestamp(),
      });

      await batch.commit();

      toast({ title: '✅ تم إرسال عرضك بنجاح!' });
      setIsOfferDialogOpen(false);
      setSelectedTrip(null);
      return true;
    } catch (err) {
      console.error('[MarketRequests] sendOffer error:', err);
      toast({ variant: 'destructive', title: 'فشل إرسال العرض', description: 'حاول مجدداً.' });
      return false;
    }
  }, [firestore, user, selectedTrip, profile, toast]);

  const handleOffer = useCallback((trip: Trip) => { setSelectedTrip(trip); setIsOfferDialogOpen(true); }, []);
  const hasActiveFilters = filterType !== 'all' || filterVehicle !== 'all' || !!searchOrigin || !!searchDest;
  const clearFilters = () => { setSearchOrigin(''); setSearchDest(''); setFilterType('all'); setFilterVehicle('all'); };

  return (
    <div className="space-y-4 pb-20 pt-4 animate-in fade-in slide-in-from-bottom-2 duration-500" dir={isRtl ? 'rtl' : 'ltr'}>

      {/* ─── الهيدر الثابت ─── */}
      <div className="sticky top-[60px] md:top-[70px] z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-2">
        <div className="bg-card rounded-2xl border border-[#BFAF78] overflow-hidden shadow-sm">

          <div className="flex items-center justify-between p-4 bg-[#307380] text-white">
            <div className="flex items-center gap-2 font-semibold text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>{tc('marketTitle')}</span>
              {!isLoading && (
                <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  {filteredRequests.length}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {directCount > 0 && (
                <span className="flex items-center gap-1 text-xs bg-amber-400/20 border border-amber-300/30 text-amber-200 px-2 py-0.5 rounded-full font-bold animate-pulse">
                  <UserCheck className="h-3 w-3" />{directCount} {tc('marketDirect')}
                </span>
              )}
              <button
                onClick={() => setShowFilters(v => !v)}
                className={cn(
                  'flex items-center gap-1 text-xs px-3 py-1.5 rounded-full font-semibold transition-colors',
                  hasActiveFilters ? 'bg-amber-400/20 border border-amber-300/30 text-amber-200' : 'bg-white/10 hover:bg-white/20'
                )}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                {hasActiveFilters ? tc('marketActiveFilter') : tc('marketFilter')}
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="p-4 border-t border-muted/50 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">

              {/* ✅ سليكتور المدن */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-sm px-2 font-semibold text-muted-foreground">
                    {tc('marketOrigin')}
                  </label>
                  <Select value={searchOrigin || 'all'} onValueChange={v => setSearchOrigin(v === 'all' ? '' : v)} dir={isRtl ? 'rtl' : 'ltr'}>
                    <SelectTrigger className="h-10 bg-card/50 text-sm">
                      <SelectValue placeholder={tc('marketOrigin')} />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      <SelectItem value="all">{tc('marketAllCities')}</SelectItem>
                      {allCities.map(c => (
                        <SelectItem key={c.key} value={c.key}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm px-2 font-semibold text-muted-foreground">
                    {tc('marketDest')}
                  </label>
                  <Select value={searchDest || 'all'} onValueChange={v => setSearchDest(v === 'all' ? '' : v)} dir={isRtl ? 'rtl' : 'ltr'}>
                    <SelectTrigger className="h-10 bg-card/50 text-sm">
                      <SelectValue placeholder={tc('marketDest')} />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      <SelectItem value="all">{tc('marketAllCities')}</SelectItem>
                      {allCities.map(c => (
                        <SelectItem key={c.key} value={c.key}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid  gap-2">
                <Select value={filterType} onValueChange={(v: any) => setFilterType(v)} dir={isRtl ? 'rtl' : 'ltr'}>
                  <SelectTrigger className="h-10 bg-card/50 text-sm"><SelectValue placeholder={tc('marketReqType')} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{tc('marketAllReqs')}</SelectItem>
                    <SelectItem value="Direct">{tc('marketDirectOnly')}</SelectItem>
                    <SelectItem value="General">{tc('marketGeneral')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-destructive hover:text-destructive gap-1 text-xs h-8 w-full">
                  <X className="h-3.5 w-3.5" />{tc('marketClearAll')}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ─── المحتوى ─── */}
      <LocalErrorBoundary fallbackTitle={isRtl ? 'تعثر تحميل الطلبات' : 'Failed to load requests'}>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-5 rounded-2xl border bg-card space-y-3">
                <Skeleton className="h-6 w-3/4" /><Skeleton className="h-4 w-1/2" /><Skeleton className="h-16 w-full rounded-xl" /><Skeleton className="h-9 w-28 ml-auto rounded-xl" />
              </div>
            ))}
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 px-4 border-2 border-dashed border-[#BFAF78]/30 rounded-2xl bg-secondary/5">
            <ShipWheel className="h-14 w-14 text-primary/20 mb-4 animate-spin-slow" />
            <h3 className="text-xl font-bold mb-2 text-foreground/70">
              {hasActiveFilters ? tc('marketNoResults') : tc('marketNoRequests')}
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              {hasActiveFilters ? tc('marketNoResultsDesc') : tc('marketNoReqDesc')}
            </p>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" className="mt-4 gap-2" onClick={clearFilters}>
                <RefreshCw className="h-3.5 w-3.5" />{tc('marketShowAll')}
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: tc('marketTotalReqs'), value: filteredRequests.length, icon: TrendingUp, color: 'text-blue-400' },
                { label: tc('marketDirectForYou'), value: directCount, icon: UserCheck, color: 'text-primary' },
                { label: tc('marketGeneralStat'), value: filteredRequests.length - directCount, icon: Star, color: 'text-[#BFAF78]' },
              ].map(stat => (
                <div key={stat.label} className="bg-card border border-muted rounded-xl p-3 text-center space-y-1">
                  <stat.icon className={cn('h-4 w-4 mx-auto', stat.color)} />
                  <div className="text-xl font-black">{stat.value}</div>
                  <div className="text-[10px] text-muted-foreground font-medium leading-tight">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRequests.slice(0, visibleCount).map(trip => (
                <RequestCard key={trip.id} trip={trip} onOffer={handleOffer} />
              ))}
            </div>

            {filteredRequests.length > visibleCount && (
              <div className="flex justify-center pt-2">
                <Button variant="outline" size="lg" onClick={() => setVisibleCount(prev => prev + 10)} className="gap-2 font-bold w-full max-w-sm">
                  <ChevronDown className="h-4 w-4" />
                  {tc('marketShowMore')} ({filteredRequests.length - visibleCount} {tc('marketRemaining')})
                </Button>
              </div>
            )}
          </>
        )}
      </LocalErrorBoundary>

      {selectedTrip && (
        <OfferDialog
          isOpen={isOfferDialogOpen}
          onOpenChange={(open) => { setIsOfferDialogOpen(open); if (!open) setSelectedTrip(null); }}
          trip={selectedTrip}
          onSendOffer={handleSendOffer}
        />
      )}
    </div>
  );
}