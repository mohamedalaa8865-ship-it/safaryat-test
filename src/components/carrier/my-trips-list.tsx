// // 'use client';

// // import { useEffect, useMemo, useState, useRef } from 'react';
// // import { Button } from '@/components/ui/button';
// // import { Input } from '@/components/ui/input';
// // import { Label } from '@/components/ui/label';
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// // import { Edit, Trash2, Loader2, CheckCircle2, AlertTriangle, User, Route, UserPlus, Ban, UserCircle, Store, Star, Phone, Baby, Users, MessageSquare, ArrowRight } from 'lucide-react';
// // import type { Trip, Booking, UserProfile } from '@/lib/data';
// // import {
// //   AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
// //   AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
// // } from '@/components/ui/alert-dialog';
// // import {
// //   Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
// // } from '@/components/ui/dialog';
// // import { TripManifestDialog } from './trip-manifest-dialog';
// // import { useTripActions } from '@/hooks/use-trip-actions';
// // import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
// // import { collection, query, where, addDoc, updateDoc, doc, serverTimestamp, increment, limit, getDoc, writeBatch, arrayUnion } from 'firebase/firestore';
// // import { getCityName } from '@/lib/constants';
// // import { formatDate } from '@/lib/formatters';
// // import { useLocale, useTranslations } from 'next-intl';
// // import { cn } from '@/lib/utils';
// // import { Badge } from '@/components/ui/badge';
// // import { Card } from '@/components/ui/card';
// // import { useToast } from '@/hooks/use-toast';
// // import { useOfferDialog } from '@/hooks/use-offer-dialog';
// // import { OfferDialog } from './offer-dialog';
// // import { ChatDialog } from '@/components/chat/chat-dialog';

// // interface MyTripsListProps {
// //   trips: Trip[];
// //   isLoading: boolean;
// //   onEdit: (trip: Trip) => void;
// //   carrierProfile: UserProfile | null;
// //   onTransfer?: (trip: Trip) => void;
// // }

// // // ── Utilities ──────────────────────────────────────────────────────
// // const parseFirestoreDate = (dateObj: any): Date => {
// //   if (!dateObj) return new Date(0);
// //   return dateObj.toDate?.() || new Date(dateObj);
// // };

// // // ── Cache System ───────────────────────────────────────────────────
// // const userCache = new Map<string, Promise<UserProfile | null>>();
// // const fetchUserCached = async (firestore: any, userId: string): Promise<UserProfile | null> => {
// //   if (userCache.has(userId)) return userCache.get(userId) as Promise<UserProfile | null>;
// //   const promise = getDoc(doc(firestore, 'users', userId)).then(snap =>
// //     snap.exists() ? { ...snap.data(), id: snap.id } as UserProfile : null
// //   );
// //   userCache.set(userId, promise);
// //   return promise;
// // };

// // // ── Direct Booking Dialog ──────────────────────────────────────────
// // function DirectBookingDialog({ trip, isOpen, onClose }: { trip: Trip; isOpen: boolean; onClose: () => void }) {
// //   const locale = useLocale();
// //   const t = useTranslations('carrier');
// //   const firestore = useFirestore();
// //   const { user } = useUser();
// //   const { toast } = useToast();
// //   const [loading, setLoading] = useState(false);
// //   const [form, setForm] = useState({ name: '', nationality: '', documentNumber: '', type: 'adult' as 'adult' | 'minor' | 'infant', seats: 1 });

// //   const handleSubmit = async () => {
// //     if (!firestore || !user) return;
// //     const depDate = parseFirestoreDate(trip.departureDate);
// //     if (depDate < new Date()) {
// //       toast({ variant: 'destructive', title: t('timeExpired'), description: t('timeExpiredDesc') });
// //       return;
// //     }
// //     if (!form.name.trim() || !form.nationality.trim() || !form.documentNumber.trim()) {
// //       toast({ variant: 'destructive', title: t('fillAllFields') });
// //       return;
// //     }
// //     if (form.seats > (trip.availableSeats || 0)) {
// //       toast({ variant: 'destructive', title: t('seatsExceeded') });
// //       return;
// //     }
// //     setLoading(true);
// //     try {
// //       const batch = writeBatch(firestore);
// //       const bookingRef = doc(collection(firestore, 'bookings'));
// //       const tripRef = doc(firestore, 'trips', trip.id);
// //       batch.set(bookingRef, {
// //         id: bookingRef.id, tripId: trip.id, carrierId: user.uid, userId: user.uid, bookedByCarrier: true,
// //         seats: form.seats, passengersDetails: [{ name: form.name.trim(), nationality: form.nationality.trim(), documentNumber: form.documentNumber.trim(), type: form.type }],
// //         status: 'Confirmed', totalPrice: (trip.price || 0) * form.seats, currency: trip.currency,
// //         createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
// //       });
// //       batch.update(tripRef, { availableSeats: increment(-form.seats), bookingIds: arrayUnion(bookingRef.id), updatedAt: serverTimestamp() });
// //       await batch.commit();
// //       toast({ title: t('bookingSuccess') });
// //       onClose();
// //       setForm({ name: '', nationality: '', documentNumber: '', type: 'adult', seats: 1 });
// //     } catch (e: any) {
// //       toast({ variant: 'destructive', title: t('bookingFailed'), description: e?.message });
// //     } finally { setLoading(false); }
// //   };

// //   return (
// //     <Dialog open={isOpen} onOpenChange={(o) => !loading && !o && onClose()}>
// //       <DialogContent className="sm:max-w-md">
// //         <DialogHeader>
// //           <DialogTitle className="flex items-center gap-2"><UserPlus className="h-5 w-5 text-primary" />{t('directBookingTitle')}</DialogTitle>
// //           <DialogDescription>{getCityName(trip.origin, locale)} {locale === 'ar' ? '←' : '→'} {getCityName(trip.destination, locale)} | {t('available')}: {trip.availableSeats} {t('seat')}</DialogDescription>
// //         </DialogHeader>
// //         <div className="space-y-4 py-2">
// //           <div className="space-y-2"><Label>{t('fullName')}<span className="text-destructive">*</span></Label><Input placeholder={t('passengerName')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} disabled={loading} /></div>
// //           <div className="grid grid-cols-2 gap-3">
// //             <div className="space-y-2"><Label>{t('nationality')}<span className="text-destructive">*</span></Label><Input placeholder={t('nationalityPlaceholder')} value={form.nationality} onChange={(e) => setForm({ ...form, nationality: e.target.value })} disabled={loading} /></div>
// //             <div className="space-y-2"><Label>{t('docNumber')}<span className="text-destructive">*</span></Label><Input placeholder={t('docPlaceholder')} value={form.documentNumber} onChange={(e) => setForm({ ...form, documentNumber: e.target.value })} disabled={loading} className="font-mono" /></div>
// //           </div>
// //           <div className="grid grid-cols-2 gap-3">
// //             <div className="space-y-2">
// //               <Label>{t('passengerType')}</Label>
// //               <Select value={form.type} onValueChange={(v: any) => setForm({ ...form, type: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="adult">{t('adult')}</SelectItem><SelectItem value="minor">{t('minor')}</SelectItem><SelectItem value="infant">{t('infant')}</SelectItem></SelectContent></Select>
// //             </div>
// //             <div className="space-y-2">
// //               <Label>{t('seatsCount')}</Label>
// //               <Select value={String(form.seats)} onValueChange={(v) => setForm({ ...form, seats: Number(v) })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Array.from({ length: trip.availableSeats || 1 }, (_, i) => i + 1).map(n => (<SelectItem key={n} value={String(n)}>{n}</SelectItem>))}</SelectContent></Select>
// //             </div>
// //           </div>
// //           <div className="bg-muted/40 rounded-lg p-3 text-sm flex justify-between"><span className="text-muted-foreground">{t('total')}</span><span className="font-bold">{((trip.price || 0) * form.seats).toFixed(2)} {trip.currency}</span></div>
// //         </div>
// //         <DialogFooter className="gap-2"><Button variant="secondary" onClick={onClose} disabled={loading}>{t('cancel')}</Button><Button onClick={handleSubmit} disabled={loading}>{loading ? <><Loader2 className="h-4 w-4 animate-spin ml-2" />{t('bookingInProgress')}</> : <><UserPlus className="h-4 w-4 ml-2" /> {t('confirmBooking')}</>}</Button></DialogFooter>
// //       </DialogContent>
// //     </Dialog>
// //   );
// // }

// // // ── Passengers List ────────────────────────────────────────────────
// // function BookingPassengerRow({ booking, index, isSelected, onToggle, onCancel, t }: any) {
// //   const firestore = useFirestore();
// //   const [profile, setProfile] = useState<any>(null);
// //   useEffect(() => {
// //     if (booking.userId) fetchUserCached(firestore, booking.userId).then(setProfile);
// //   }, [firestore, booking.userId]);

// //   // [FIX-SEATS-DISPLAY]: نعرض كل المسافرين في الـ booking مش بس الأول
// //   const passengers: any[] = booking.passengersDetails?.length > 0
// //     ? booking.passengersDetails
// //     : [{}]; // fallback لو مفيش بيانات بعد

// //   const firstPassenger = passengers[0] || {};
// //   const profilePhone = profile?.phoneNumber
// //     ? `${profile.phoneCountryCode ? '+' + profile.phoneCountryCode + ' ' : ''}${profile.phoneNumber}`
// //     : '';

// //   return (
// //     <div className="space-y-1">
// //       <button onClick={onToggle} className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-muted/30 border text-sm">
// //         <span className="flex items-center gap-2">
// //           <span className="font-mono text-xs text-muted-foreground">#{index + 1}</span>
// //           <span className="font-semibold">{firstPassenger.name || profile?.firstName || t('traveler')}</span>
// //           {/* عرض عدد المقاعد لو أكتر من واحد */}
// //           {passengers.length > 1 && (
// //             <span className="text-xs text-muted-foreground">({passengers.length} {t('seat') || 'مقاعد'})</span>
// //           )}
// //         </span>
// //         {(() => {
// //           const p = booking.passengersDetails;
// //           const hasDetails = p && p.length > 0 && p[0]?.name && p[0]?.nationality && p[0]?.documentNumber;
// //           if (!hasDetails && booking.status === 'Pending-Carrier-Confirmation') {
// //             return <Badge variant="outline" className="text-[10px] border-gray-400 text-gray-500">بانتظار التأكيد</Badge>;
// //           }
// //           if (booking.status === 'Pending-Carrier-Confirmation') {
// //             return <Badge variant="outline" className="text-[10px] bg-[#FEF9C3] text-black">بانتظار موافقتك</Badge>;
// //           }
// //           if (booking.status === 'Pending-Payment') {
// //             return <Badge variant="outline" className="text-[10px] bg-[#FFEDD5] text-black">بانتظار دفع العربون</Badge>;
// //           }
// //           if (booking.status === 'Pending-Payment-Verification') {
// //             return <Badge variant="outline" className="text-[10px] bg-[#307380] text-white">بانتظار تأكيد الاستلام</Badge>;
// //           }
// //           if (booking.status === 'Confirmed') {
// //             return <Badge className="text-[10px] bg-[#BFAF78] text-black">مؤكدة ✓</Badge>;
// //           }
// //           return <Badge variant="secondary" className="text-[10px]">{booking.status}</Badge>;
// //         })()}
// //       </button>

// //       {isSelected && (
// //         <div className="bg-muted/20 border border-t-0 rounded-b-lg px-3 py-3 space-y-3 text-sm animate-in fade-in">
// //           {/* [FIX]: عرض كل المسافرين في الـ booking */}
// //           {passengers.map((p: any, pIdx: number) => {
// //             const phone = p.phone || p.phoneNumber || (pIdx === 0 ? profilePhone : '');
// //             return (
// //               <div key={pIdx} className={passengers.length > 1 ? 'border-b border-border/40 pb-2 last:border-0 last:pb-0' : ''}>
// //                 {passengers.length > 1 && (
// //                   <p className="text-xs font-bold text-muted-foreground mb-1">
// //                     {/* [FIX-i18n]: استخدام مفاتيح موجودة فعلاً في namespace الـ carrier */}
// //                     {t('passenger')} #{pIdx + 1}
// //                     {p.type === 'minor' ? ` (${t('minor')})` : p.type === 'infant' ? ` (${t('infant')})` : ''}
// //                   </p>
// //                 )}
// //                 {p.name && (
// //                   <div className="flex justify-between">
// //                     <span className="text-muted-foreground">{t('passengerName')}</span>
// //                     <span className="font-semibold">{p.name}</span>
// //                   </div>
// //                 )}
// //                 <div className="flex justify-between">
// //                   <span className="text-muted-foreground">{t('phoneTrev')}</span>
// //                   <a href={`tel:${phone?.replace(/\s+/g, '')}`} className="font-mono font-bold text-emerald-400" dir="ltr">{phone || '—'}</a>
// //                 </div>
// //                 <div className="flex justify-between">
// //                   <span className="text-muted-foreground">{t('docNumber')}</span>
// //                   <span className="font-mono">{p.documentNumber || '—'}</span>
// //                 </div>
// //                 {p.nationality && (
// //                   <div className="flex justify-between">
// //                     <span className="text-muted-foreground">{t('nationality')}</span>
// //                     <span>{p.nationality}</span>
// //                   </div>
// //                 )}
// //               </div>
// //             );
// //           })}
// //           {booking.bookedByCarrier && (
// //             <Button variant="destructive" size="sm" className="w-full mt-2" onClick={() => onCancel(booking.id)}>
// //               <Ban className="size-3.5 ml-1" /> {t('cancelBooking')}
// //             </Button>
// //           )}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // function TripPassengers({ trip }: { trip: Trip }) {
// //   const firestore = useFirestore();
// //   const { toast } = useToast();
// //   const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
// //   const [cancellingId, setCancellingId] = useState<string | null>(null);
// //   const t = useTranslations('carrier');

// //   // جلب الحجوزات المؤكدة — بـ carrierTripId (طلب مسافر) أو tripId (حجز عادي)
// //   const qConfirmedByCarrierTrip = useMemoFirebase(() => !firestore || !trip.id ? null : query(collection(firestore, 'bookings'), where('carrierTripId', '==', trip.id), where('status', 'in', ['Confirmed', 'Pending-Payment', 'Pending-Payment-Verification'])), [firestore, trip.id]);
// //   const qConfirmedByTripId = useMemoFirebase(() => !firestore || !trip.id ? null : query(collection(firestore, 'bookings'), where('tripId', '==', trip.id), where('status', 'in', ['Confirmed', 'Pending-Payment', 'Pending-Payment-Verification'])), [firestore, trip.id]);
// //   const qPendingByCarrierTrip = useMemoFirebase(() => !firestore || !trip.id ? null : query(collection(firestore, 'bookings'), where('carrierTripId', '==', trip.id), where('status', '==', 'Pending-Carrier-Confirmation')), [firestore, trip.id]);
// //   const qPendingByTripId = useMemoFirebase(() => !firestore || !trip.id ? null : query(collection(firestore, 'bookings'), where('tripId', '==', trip.id), where('status', '==', 'Pending-Carrier-Confirmation')), [firestore, trip.id]);

// //   const { data: confirmedByCarrier } = useCollection<Booking>(qConfirmedByCarrierTrip);
// //   const { data: confirmedByTrip } = useCollection<Booking>(qConfirmedByTripId);
// //   const { data: pendingByCarrier } = useCollection<Booking>(qPendingByCarrierTrip);
// //   const { data: pendingByTrip } = useCollection<Booking>(qPendingByTripId);

// //   // دمج النتائج وإزالة المكررات
// //   const confirmedBookings = useMemo(() => {
// //     const all = [...(confirmedByCarrier || []), ...(confirmedByTrip || [])];
// //     return all.filter((b, i, arr) => arr.findIndex(x => x.id === b.id) === i);
// //   }, [confirmedByCarrier, confirmedByTrip]);
// //   const pendingBookings = useMemo(() => {
// //     const all = [...(pendingByCarrier || []), ...(pendingByTrip || [])];
// //     return all.filter((b, i, arr) => arr.findIndex(x => x.id === b.id) === i);
// //   }, [pendingByCarrier, pendingByTrip]);

// //   if (!confirmedBookings?.length && !pendingBookings?.length) return <p className="text-xs text-muted-foreground text-center py-2">{t('noSeatsYet')}</p>;

// //   return (
// //     <div className="space-y-2">
// //       {/* ── حجوزات بانتظار موافقة الناقل ── */}
// //       {pendingBookings && pendingBookings.length > 0 && (
// //         <div className="space-y-1">
// //           <p className="text-[10px] font-bold text-amber-400  flex items-center gap-1">⏳ بانتظار موافقتك ({pendingBookings.length})</p>
// //           {pendingBookings.map((b, i) => <BookingPassengerRow key={b.id} booking={b} index={i} isSelected={selectedIndex === i} onToggle={() => setSelectedIndex(selectedIndex === i ? null : i)} onCancel={setCancellingId} t={t} />)}
// //         </div>
// //       )}
// //       {/* ── حجوزات مؤكدة ── */}
// //       {confirmedBookings && confirmedBookings.length > 0 && (
// //         <div className="space-y-1">
// //           {pendingBookings && pendingBookings.length > 0 && <p className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">✅ مؤكدة ({confirmedBookings.length})</p>}
// //           {confirmedBookings.map((b, i) => <BookingPassengerRow key={b.id} booking={b} index={i} isSelected={selectedIndex === i} onToggle={() => setSelectedIndex(selectedIndex === i ? null : i)} onCancel={setCancellingId} t={t} />)}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // // ── Opportunity Row ────────────────────────────────────────────────
// // function OpportunityRow({ opportunity, carrierId, isOpen, onToggle, onOffer }: any) {
// //   const firestore = useFirestore();
// //   const t = useTranslations('carrier');
// //   const [profile, setProfile] = useState<UserProfile | null>(null);

// //   useEffect(() => {
// //     if (opportunity.userId) fetchUserCached(firestore, opportunity.userId).then(setProfile);
// //   }, [firestore, opportunity.userId]);

// //   const isDirect = opportunity.requestType === 'Direct' && opportunity.targetCarrierId === carrierId;

// //   // ✅ دمج كود الدولة مع الرقم بشكل صحيح
// //   const displayPhone = profile?.phoneNumber
// //     ? `${profile.phoneCountryCode ? '+' + profile.phoneCountryCode + ' ' : ''}${profile.phoneNumber}`
// //     : '—';

// //   return (
// //     <div className="overflow-hidden">
// //       <button onClick={onToggle} className={cn("w-full flex items-center justify-between px-3 py-2 rounded-lg border text-sm transition-all", isDirect ? "bg-primary/10 border-primary/30" : "bg-amber-500/10 border-amber-500/20")}>
// //         <span className="flex items-center gap-2 font-semibold">
// //           <UserCircle className={cn("size-4", isDirect ? "text-primary" : "text-amber-500")} />
// //           {opportunity.creatorRole === 'agent' ? (opportunity.agentName || 'وكيل') : (profile?.firstName || t('traveler'))}
// //         </span>
// //         {isDirect && <Badge className="text-[9px] bg-primary">{t('customRequest')}</Badge>}
// //       </button>

// //       {isOpen && (
// //         <div className="bg-card/40 border border-t-0 rounded-b-lg px-4 py-4 space-y-3 text-sm animate-in slide-in-from-top-2">
// //           <div className="flex justify-between items-center"><span className="text-muted-foreground">{t('travelerName')}</span><span className="font-bold">{[profile?.firstName, profile?.lastName].filter(Boolean).join(' ') || t('traveler')}</span></div>

// //           {/* ✅ حقل الهاتف مع كود الدولة ورابط اتصال مباشر */}
// //           <div className="flex justify-between items-center">
// //             <span className="text-muted-foreground">{t('phoneTrev')}</span>
// //             <a href={`tel:${displayPhone.replace(/\s+/g, '')}`} className="flex items-center gap-1.5 font-mono font-black text-emerald-400 hover:text-emerald-300 transition-colors" dir="ltr">
// //               <Phone className="size-3" /> {displayPhone}
// //             </a>
// //           </div>

// //           <div className="flex justify-between items-center"><span className="text-muted-foreground">{t('seatsNum')}</span><span className="font-bold">{opportunity.passengers} {t('seat')}</span></div>

// //           {/* ✅ تفاصيل نوع الركاب: بالغ / قاصر / رضيع */}
// //           {Array.isArray(opportunity.passengersDetails) && opportunity.passengersDetails.length > 0 && (() => {
// //             const counts = { adult: 0, child: 0, infant: 0 };
// //             opportunity.passengersDetails.forEach((p: any) => {
// //               const type = p.type || p.passengerType || 'adult';
// //               if (type === 'child' || type === 'minor' || type === 'قاصر') counts.child++;
// //               else if (type === 'infant' || type === 'رضيع') counts.infant++;
// //               else counts.adult++;
// //             });
// //             return (
// //               <div className="flex flex-wrap gap-2 pt-1 border-t border-muted/30">
// //                 {counts.adult > 0 && (
// //                   <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-blue-500/10 border border-blue-500/30 text-blue-400 font-medium">
// //                     <User className="h-3 w-3" /> {counts.adult} بالغ
// //                   </span>
// //                 )}
// //                 {counts.child > 0 && (
// //                   <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-amber-500/10 border border-amber-500/30 text-amber-400 font-medium">
// //                     <Users className="h-3 w-3" /> {counts.child} قاصر
// //                   </span>
// //                 )}
// //                 {counts.infant > 0 && (
// //                   <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-pink-500/10 border border-pink-500/30 text-pink-400 font-medium">
// //                     <Baby className="h-3 w-3" /> {counts.infant} رضيع
// //                   </span>
// //                 )}
// //               </div>
// //             );
// //           })()}

// //           <Button size="sm" className="w-full mt-2 font-bold" onClick={() => onOffer(opportunity.id)}>{t('sendOffer')}</Button>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // // ── Direct & General Opportunities ──
// // function DirectOpportunities({ trip, carrierId }: { trip: Trip; carrierId: string }) {
// //   const firestore = useFirestore();
// //   const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
// //   const [intentId, setIntentId] = useState('');
// //   const t = useTranslations('carrier');
// //   const { openOfferDialog, selectedTrip, isDialogOpen, setIsDialogOpen, handleSendOffer } = useOfferDialog();
// //   const q = useMemoFirebase(() => !firestore ? null : query(collection(firestore, 'trips'), where('status', '==', 'Awaiting-Offers'), where('origin', '==', trip.origin), where('destination', '==', trip.destination), limit(10)), [firestore, trip.origin, trip.destination]);
// //   const { data: opps } = useCollection<Trip>(q);
// //   const filtered = useMemo(() => opps?.filter(o => o.requestType === 'Direct' && o.targetCarrierId === carrierId) || [], [opps, carrierId]);

// //   if (!filtered.length) return <p className="text-xs text-muted-foreground text-center py-2">{t('noDirectOrders')}</p>;
// //   return (<><div className="space-y-2">{filtered.map((opp, i) => <OpportunityRow key={opp.id} opportunity={opp} carrierId={carrierId} isOpen={selectedIndex === i} onToggle={() => setSelectedIndex(selectedIndex === i ? null : i)} onOffer={(id: any) => { setIntentId(id); openOfferDialog(opp); }} />)}</div>{selectedTrip && <OfferDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} trip={selectedTrip} onSendOffer={(d) => handleSendOffer(d, intentId)} />}</>);
// // }

// // function GeneralOpportunities({ trip, carrierId }: { trip: Trip; carrierId: string }) {
// //   const firestore = useFirestore();
// //   const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
// //   const [intentId, setIntentId] = useState('');
// //   const t = useTranslations('carrier');
// //   const { openOfferDialog, selectedTrip, isDialogOpen, setIsDialogOpen, handleSendOffer } = useOfferDialog();
// //   const q = useMemoFirebase(() => !firestore ? null : query(collection(firestore, 'trips'), where('status', '==', 'Awaiting-Offers'), where('origin', '==', trip.origin), where('destination', '==', trip.destination), limit(10)), [firestore, trip.origin, trip.destination]);
// //   const { data: opps } = useCollection<Trip>(q);
// //   const filtered = useMemo(() => opps?.filter(o => o.requestType === 'General') || [], [opps]);

// //   if (!filtered.length) return <p className="text-xs text-muted-foreground text-center py-2">{t('noGeneralOrders')}</p>;
// //   return (<><div className="space-y-2">{filtered.map((opp, i) => <OpportunityRow key={opp.id} opportunity={opp} carrierId={carrierId} isOpen={selectedIndex === i} onToggle={() => setSelectedIndex(selectedIndex === i ? null : i)} onOffer={(id: any) => { setIntentId(id); openOfferDialog(opp); }} />)}</div>{selectedTrip && <OfferDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} trip={selectedTrip} onSendOffer={(d) => handleSendOffer(d, intentId)} />}</>);
// // }

// // function TripCard({ trip, onEdit, carrierProfile }: { trip: Trip; onEdit: (trip: Trip) => void; carrierProfile: UserProfile | null }) {
// //   const locale = useLocale();
// //   const { user } = useUser();
// //   const firestore = useFirestore();
// //   const [manifestOpen, setManifestOpen] = useState(false);
// //   const [cancelOpen, setCancelOpen] = useState(false);
// //   const [showBlockingAlert, setShowBlockingAlert] = useState(false);
// //   const [directBookingOpen, setDirectBookingOpen] = useState(false);
// //   const [chatOpen, setChatOpen] = useState(false);

// //   // ── Countdown Timer ─────────────────────────────────────────────
// //   const [countdown, setCountdown] = useState('');
// //   const [isAfterDeparture, setIsAfterDeparture] = useState(false);
// //   useEffect(() => {
// //     const calcCountdown = () => {
// //       const depDate = parseFirestoreDate(trip.departureDate);
// //       const durationHours = (trip as any).estimatedDurationHours || 0;
// //       const arrivalDate = new Date(depDate.getTime() + durationHours * 3600000);
// //       const now = new Date();

// //       if (now < depDate) {
// //         // قبل الانطلاق — عداد تنازلي
// //         setIsAfterDeparture(false);
// //         const diff = depDate.getTime() - now.getTime();
// //         const d = Math.floor(diff / 86400000);
// //         const h = Math.floor((diff % 86400000) / 3600000);
// //         const m = Math.floor((diff % 3600000) / 60000);
// //         const s = Math.floor((diff % 60000) / 1000);
// //         if (d > 0) setCountdown(`${d}ي ${h}س ${m}د`);
// //         else if (h > 0) setCountdown(`${h}س ${m}د ${s}ث`);
// //         else setCountdown(`${m}د ${s}ث`);
// //       } else if (durationHours > 0 && now < arrivalDate) {
// //         // بعد الانطلاق — عداد تصاعدي (مدة الرحلة المنقضية)
// //         setIsAfterDeparture(true);
// //         const diff = now.getTime() - depDate.getTime();
// //         const h = Math.floor(diff / 3600000);
// //         const m = Math.floor((diff % 3600000) / 60000);
// //         const s = Math.floor((diff % 60000) / 1000);
// //         setCountdown(`${h}س ${m}د ${s}ث`);
// //       } else {
// //         setIsAfterDeparture(false);
// //         setCountdown('');
// //       }
// //     };
// //     calcCountdown();
// //     const interval = setInterval(calcCountdown, 1000);
// //     return () => clearInterval(interval);
// //   }, [trip.departureDate, (trip as any).estimatedDurationHours]);
// //   const { isProcessing, completeTrip, cancelTrip } = useTripActions();
// //   const t = useTranslations('carrier');

// //   const isCompleted = useMemo(() => {
// //     if (['Completed', 'Cancelled'].includes(trip.status)) return true;
// //     const depDate = parseFirestoreDate(trip.departureDate);
// //     const durationHours = (trip as any).estimatedDurationHours || 0;
// //     const endDate = new Date(depDate.getTime() + durationHours * 60 * 60 * 1000);
// //     return endDate < new Date();
// //   }, [trip.status, trip.departureDate, (trip as any).estimatedDurationHours]);

// //   const isDeparted = useMemo(() => {
// //     const depDate = parseFirestoreDate(trip.departureDate);
// //     return depDate < new Date();
// //   }, [trip.departureDate]);

// //   // ✅ تحديث تلقائي للحالة إلى In-Transit لما وقت الانطلاق يعدي
// //   useEffect(() => {
// //     if (!firestore || !isDeparted || trip.status !== 'Planned') return;
// //     updateDoc(doc(firestore, 'trips', trip.id), {
// //       status: 'In-Transit',
// //       updatedAt: serverTimestamp(),
// //     }).catch(() => { });
// //   }, [firestore, isDeparted, trip.id, trip.status]);

// //   const isThisProcessing = isProcessing?.endsWith(trip.id);
// //   const capacity = carrierProfile?.vehicleCapacity || (trip as any).vehicleCapacity || 0;
// //   const available = trip.availableSeats ?? 0;
// //   // ✅ المقاعد المحجوزة = الطاقة - المتاح (بس بعد تأكيد الناقل فقط)
// //   // availableSeats بيتخصم بس بعد confirm-booking، يعني الرقم ده صح
// //   const booked = Math.max(0, capacity - available);
// //   const fillPct = capacity > 0 ? Math.min(100, (booked / capacity) * 100) : 0;
// //   const isFull = available <= 0;
// //   const hasBookings = trip.bookingIds && trip.bookingIds.length > 0;
// //   const carrierId = user?.uid || '';

// //   return (
// //     <>
// //       <Card className={cn(
// //         "relative overflow-hidden border-2 shadow-md transition-all duration-300",
// //         isCompleted
// //           ? "border-gray-500/40 opacity-60 pointer-events-none"
// //           : "border-blue-400 hover:border-yellow-300 hover:shadow-[0_0_12px_2px_rgba(234,179,8,0.35)]"
// //       )}>
// //         {isCompleted && (
// //           <div className="absolute inset-0 bg-black/40 z-50 flex items-center justify-center">
// //             <span className="text-white font-bold text-lg">
// //               {t('endTrip')}
// //             </span>
// //           </div>
// //         )}
// //         {/* ── Countdown Banner ── */}
// //         {countdown && (
// //           <div className={`flex items-center justify-center gap-2 py-2 px-4 text-xs font-bold border-b ${isAfterDeparture
// //             ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
// //             : 'bg-amber-500/15 border-amber-500/25 text-amber-300'
// //             }`}>
// //             {isAfterDeparture ? (
// //               <>
// //                 <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
// //                 <span>في الطريق منذ: {countdown}</span>
// //               </>
// //             ) : (
// //               <>
// //                 <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
// //                 <span>ينطلق بعد: {countdown}</span>
// //               </>
// //             )}
// //           </div>
// //         )}
// //         <div className="p-4 text-white bg-[#200a0f89] border-b border-b-amber-200/30">
// //           <div className="flex justify-between items-start ">
// //             <h2 className="text-lg font-bold">
// //               {getCityName(trip.origin, locale)}<span className="mx-2 font-light opacity-70">←</span>{getCityName(trip.destination, locale)}
// //             </h2>
// //             <Badge variant="outline" className="text-white border-white/40 text-[10px]">
// //               {trip.status === 'Planned' ? t('scheduled') : trip.status === 'In-Transit' ? t('inTheWay') : trip.status}
// //             </Badge>
// //           </div>
// //           <div className="grid grid-cols-3 gap-2 mt-3 text-center">
// //             <div className="bg-white/10 rounded-lg p-2">
// //               <p className="text-[10px] opacity-70">{t('flightNumber')}</p>
// //               <p className="font-mono font-bold text-sm">{trip.id.slice(-6).toUpperCase()}</p>
// //             </div>
// //             <div className="bg-white/10 rounded-lg p-2">
// //               <p className="text-[10px] opacity-70">{t('departureTime')}</p>
// //               <p className="font-bold text-sm">{formatDate(trip.departureDate, 'hh:mm a', locale)}</p>
// //             </div>
// //             <div className="bg-white/10 rounded-lg p-2">
// //               <p className="text-[10px] opacity-70">{t('date')}</p>
// //               <p className="font-bold text-sm">{formatDate(trip.departureDate, 'dd/MM/yyyy', locale)}</p>
// //             </div>
// //           </div>
// //         </div>

// //         <div className="p-4 space-y-4 bg-[#200a0f89]">
// //           <div className="h-3 w-full bg-secondary/50 rounded-full overflow-hidden border border-border/50">
// //             <div className={cn("h-full transition-all duration-500", isFull ? "bg-red-500" : fillPct > 80 ? "bg-orange-500" : "bg-emerald-500")}
// //               style={{ width: `${fillPct}%` }} />
// //           </div>

// //           <div className="flex items-center justify-between">
// //             <h3 className="text-sm font-bold">
// //               {isFull ? `🚫 ${t('flightFull')}` : `🪑 ${t('emptySeats')} : ${available}`}
// //             </h3>
// //             {!isFull && (
// //               <Button
// //                 size="sm"
// //                 variant="outline"
// //                 className="gap-1.5 border-primary/40 text-primary hover:bg-primary/10 text-xs"
// //                 onClick={() => setDirectBookingOpen(true)}
// //                 disabled={isCompleted || !!isThisProcessing || isDeparted}
// //                 title={isDeparted ? t('takeOffTime') : ''}
// //               >
// //                 <UserPlus className="h-3.5 w-3.5" /> {t('bookedYourClients')}
// //               </Button>
// //             )}
// //           </div>

// //           <div className="space-y-2">
// //             <div className="flex gap-1 items-center">
// //               <UserCircle className="size-4 text-primary" />
// //               <h3 className="text-sm font-bold">{t('clientRequests')}</h3>
// //             </div>
// //             <DirectOpportunities trip={trip} carrierId={carrierId} />
// //           </div>

// //           <div className="space-y-2">
// //             <div className="flex gap-1 items-center">
// //               <Store className="size-4 text-amber-500" />
// //               <h3 className="text-sm font-bold">{t('requestsMarket')}</h3>
// //             </div>
// //             <GeneralOpportunities trip={trip} carrierId={carrierId} />
// //           </div>

// //           <div className="space-y-2">
// //             <h3 className="text-sm font-bold flex items-center gap-2">
// //               <User className="h-4 w-4 text-primary" />{t('reservedSeats')} ({booked})
// //             </h3>
// //             <TripPassengers trip={trip} />
// //           </div>

// //           <div className="grid grid-cols-2 gap-3 text-sm pt-1 border-t">
// //             <div><p className="text-xs text-muted-foreground">{t('price')}</p><p className="font-semibold">{trip.price} {trip.currency}</p></div>
// //             <div><p className="text-xs text-muted-foreground">{t('meetingPoint')}</p><p className="font-semibold text-xs truncate">{trip.meetingPoint || '—'}</p></div>
// //           </div>

// //           {/* {trip.status === 'In-Transit' ? (
// //             <Button size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white gap-2" onClick={() => completeTrip(trip)} disabled={!!isThisProcessing}>
// //               {isThisProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />} {t('endTrip')}
// //             </Button>
// //           ) :
// //            ( */}
// //           <div className="flex gap-2">
// //             <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => setManifestOpen(true)} disabled={!!isThisProcessing}>
// //               <User className="h-4 w-4" /> {t('Statement')}
// //             </Button>
// //             <Button variant="outline" size="icon" className="h-9 w-9 bg-[#1C080D] border-0 text-emerald-400 hover:bg-[#38121F]" onClick={() => setChatOpen(true)} title="جروب الرحلة">
// //               <MessageSquare className="h-4 w-4" />
// //             </Button>
// //             <Button
// //               variant="ghost"
// //               size="icon"
// //               className={cn(
// //                 "h-9 w-9",
// //                 isDeparted ? "text-muted-foreground opacity-40 cursor-not-allowed" : "text-blue-600 hover:bg-blue-600/10"
// //               )}
// //               onClick={() => !isDeparted && onEdit(trip)}
// //             >
// //               <Edit className="h-4 w-4" />
// //             </Button>
// //             <Button variant="ghost" size="icon" className="text-destructive hover:bg-[#38121F] h-9 w-9"
// //               onClick={() => hasBookings ? setShowBlockingAlert(true) : setCancelOpen(true)}
// //             // disabled={isCompleted || !!isThisProcessing || !!hasBookings || isDeparted}
// //             >
// //               <Trash2 className="h-4 w-4" />
// //             </Button>
// //             <Button
// //               variant="ghost"
// //               size="icon"
// //               className="h-9 w-9 text-orange-500 hover:bg-orange-500/10"
// //               onClick={() => onTransfer(trip)}
// //               title="نقل الرحلة لناقل آخر"
// //             >
// //               <ArrowRight className="h-4 w-4" />
// //             </Button>
// //           </div>
// //           {/* )} */}
// //         </div>
// //       </Card>

// //       <DirectBookingDialog trip={trip} isOpen={directBookingOpen} onClose={() => setDirectBookingOpen(false)} />
// //       <ChatDialog isOpen={chatOpen} onOpenChange={setChatOpen} trip={trip} />
// //       <TripManifestDialog tripId={manifestOpen ? trip.id : null} trip={manifestOpen ? trip : null} open={manifestOpen} onOpenChange={setManifestOpen} />

// //       <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
// //         <AlertDialogContent>
// //           <AlertDialogHeader>
// //             <AlertDialogTitle>{t('confirmCancelTitle')}</AlertDialogTitle>
// //             <AlertDialogDescription>{t('confirmCancelDesc')}</AlertDialogDescription>
// //           </AlertDialogHeader>
// //           <AlertDialogFooter>
// //             <AlertDialogCancel>{t('goBack')}</AlertDialogCancel>
// //             <AlertDialogAction onClick={() => { cancelTrip(trip); setCancelOpen(false); }} className="bg-destructive">{t('cancelTrip')}</AlertDialogAction>
// //           </AlertDialogFooter>
// //         </AlertDialogContent>
// //       </AlertDialog>

// //       <AlertDialog open={showBlockingAlert} onOpenChange={setShowBlockingAlert}>
// //         <AlertDialogContent>
// //           <AlertDialogHeader>
// //             <AlertDialogTitle className="flex items-center gap-2 text-destructive"><AlertTriangle className="h-5 w-5" /> {t('sovereignLawTitle')}</AlertDialogTitle>
// //             <AlertDialogDescription className="space-y-2 pt-2">
// //               <p className="font-bold text-foreground">{t('cannotCancelBooked')}</p>
// //               <p className="text-sm text-muted-foreground">{t('sovereignDesc')}</p>
// //             </AlertDialogDescription>
// //           </AlertDialogHeader>
// //           <AlertDialogFooter><AlertDialogCancel>{t('understood')}</AlertDialogCancel></AlertDialogFooter>
// //         </AlertDialogContent>
// //       </AlertDialog>
// //     </>
// //   );
// // }
// // // ── Main Export ────────────────────────────────────────────────────
// // export function MyTripsList({ trips, isLoading, onEdit, carrierProfile, onTransfer }: MyTripsListProps) {
// //   const t = useTranslations('myTripsList');
// //   if (isLoading) return <div className="text-center py-10 text-muted-foreground">جاري التحميل...</div>;
// //   if (!trips?.length) return <div className="text-center py-16 border-2 border-dashed rounded-lg bg-card col-span-full"><Route className="mx-auto h-12 w-12 opacity-20 mb-4" /><p className="font-bold">{t('emptyTitle')}</p></div>;
// //   return <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{trips.map(trip => <TripCard key={trip.id} trip={trip} onEdit={onEdit} carrierProfile={carrierProfile} onTransfer={onTransfer} />)}</div>;
// // }

// 'use client';

// import { useEffect, useMemo, useState, useRef } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Edit, Trash2, Loader2, CheckCircle2, AlertTriangle, User, Route, UserPlus, Ban, UserCircle, Store, Star, Phone, Baby, Users, MessageSquare, ArrowRight } from 'lucide-react';
// import type { Trip, Booking, UserProfile } from '@/lib/data';
// import {
//   AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
//   AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
// } from '@/components/ui/alert-dialog';
// import {
//   Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
// } from '@/components/ui/dialog';
// import { TripManifestDialog } from './trip-manifest-dialog';
// import { useTripActions } from '@/hooks/use-trip-actions';
// import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
// import { collection, query, where, addDoc, updateDoc, doc, serverTimestamp, increment, limit, getDoc, writeBatch, arrayUnion } from 'firebase/firestore';
// import { getCityName } from '@/lib/constants';
// import { formatDate } from '@/lib/formatters';
// import { useLocale, useTranslations } from 'next-intl';
// import { cn } from '@/lib/utils';
// import { Badge } from '@/components/ui/badge';
// import { Card } from '@/components/ui/card';
// import { useToast } from '@/hooks/use-toast';
// import { useOfferDialog } from '@/hooks/use-offer-dialog';
// import { OfferDialog } from './offer-dialog';
// import { ChatDialog } from '@/components/chat/chat-dialog';

// interface MyTripsListProps {
//   trips: Trip[];
//   isLoading: boolean;
//   onEdit: (trip: Trip) => void;
//   carrierProfile: UserProfile | null;
//   onTransfer?: (trip: Trip) => void;
// }

// // ── Utilities ──────────────────────────────────────────────────────
// const parseFirestoreDate = (dateObj: any): Date => {
//   if (!dateObj) return new Date(0);
//   return dateObj.toDate?.() || new Date(dateObj);
// };

// // ── Cache System ───────────────────────────────────────────────────
// const userCache = new Map<string, Promise<UserProfile | null>>();
// const fetchUserCached = async (firestore: any, userId: string): Promise<UserProfile | null> => {
//   if (userCache.has(userId)) return userCache.get(userId) as Promise<UserProfile | null>;
//   const promise = getDoc(doc(firestore, 'users', userId)).then(snap =>
//     snap.exists() ? { ...snap.data(), id: snap.id } as UserProfile : null
//   );
//   userCache.set(userId, promise);
//   return promise;
// };

// // ── Direct Booking Dialog ──────────────────────────────────────────
// function DirectBookingDialog({ trip, isOpen, onClose }: { trip: Trip; isOpen: boolean; onClose: () => void }) {
//   const locale = useLocale();
//   const t = useTranslations('carrier');
//   const firestore = useFirestore();
//   const { user } = useUser();
//   const { toast } = useToast();
//   const [loading, setLoading] = useState(false);
//   const [form, setForm] = useState({ name: '', nationality: '', documentNumber: '', type: 'adult' as 'adult' | 'minor' | 'infant', seats: 1 });

//   const handleSubmit = async () => {
//     if (!firestore || !user) return;
//     const depDate = parseFirestoreDate(trip.departureDate);
//     if (depDate < new Date()) {
//       toast({ variant: 'destructive', title: t('timeExpired'), description: t('timeExpiredDesc') });
//       return;
//     }
//     if (!form.name.trim() || !form.nationality.trim() || !form.documentNumber.trim()) {
//       toast({ variant: 'destructive', title: t('fillAllFields') });
//       return;
//     }
//     if (form.seats > (trip.availableSeats || 0)) {
//       toast({ variant: 'destructive', title: t('seatsExceeded') });
//       return;
//     }
//     setLoading(true);
//     try {
//       const batch = writeBatch(firestore);
//       const bookingRef = doc(collection(firestore, 'bookings'));
//       const tripRef = doc(firestore, 'trips', trip.id);
//       batch.set(bookingRef, {
//         id: bookingRef.id, tripId: trip.id, carrierId: user.uid, userId: user.uid, bookedByCarrier: true,
//         seats: form.seats, passengersDetails: [{ name: form.name.trim(), nationality: form.nationality.trim(), documentNumber: form.documentNumber.trim(), type: form.type }],
//         status: 'Confirmed', totalPrice: (trip.price || 0) * form.seats, currency: trip.currency,
//         createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
//       });
//       batch.update(tripRef, { availableSeats: increment(-form.seats), bookingIds: arrayUnion(bookingRef.id), updatedAt: serverTimestamp() });
//       await batch.commit();
//       toast({ title: t('bookingSuccess') });
//       onClose();
//       setForm({ name: '', nationality: '', documentNumber: '', type: 'adult', seats: 1 });
//     } catch (e: any) {
//       toast({ variant: 'destructive', title: t('bookingFailed'), description: e?.message });
//     } finally { setLoading(false); }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={(o) => !loading && !o && onClose()}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2"><UserPlus className="h-5 w-5 text-primary" />{t('directBookingTitle')}</DialogTitle>
//           <DialogDescription>{getCityName(trip.origin, locale)} {locale === 'ar' ? '←' : '→'} {getCityName(trip.destination, locale)} | {t('available')}: {trip.availableSeats} {t('seat')}</DialogDescription>
//         </DialogHeader>
//         <div className="space-y-4 py-2">
//           <div className="space-y-2"><Label>{t('fullName')}<span className="text-destructive">*</span></Label><Input placeholder={t('passengerName')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} disabled={loading} /></div>
//           <div className="grid grid-cols-2 gap-3">
//             <div className="space-y-2"><Label>{t('nationality')}<span className="text-destructive">*</span></Label><Input placeholder={t('nationalityPlaceholder')} value={form.nationality} onChange={(e) => setForm({ ...form, nationality: e.target.value })} disabled={loading} /></div>
//             <div className="space-y-2"><Label>{t('docNumber')}<span className="text-destructive">*</span></Label><Input placeholder={t('docPlaceholder')} value={form.documentNumber} onChange={(e) => setForm({ ...form, documentNumber: e.target.value })} disabled={loading} className="font-mono" /></div>
//           </div>
//           <div className="grid grid-cols-2 gap-3">
//             <div className="space-y-2">
//               <Label>{t('passengerType')}</Label>
//               <Select value={form.type} onValueChange={(v: any) => setForm({ ...form, type: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="adult">{t('adult')}</SelectItem><SelectItem value="minor">{t('minor')}</SelectItem><SelectItem value="infant">{t('infant')}</SelectItem></SelectContent></Select>
//             </div>
//             <div className="space-y-2">
//               <Label>{t('seatsCount')}</Label>
//               <Select value={String(form.seats)} onValueChange={(v) => setForm({ ...form, seats: Number(v) })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Array.from({ length: trip.availableSeats || 1 }, (_, i) => i + 1).map(n => (<SelectItem key={n} value={String(n)}>{n}</SelectItem>))}</SelectContent></Select>
//             </div>
//           </div>
//           <div className="bg-muted/40 rounded-lg p-3 text-sm flex justify-between"><span className="text-muted-foreground">{t('total')}</span><span className="font-bold">{((trip.price || 0) * form.seats).toFixed(2)} {trip.currency}</span></div>
//         </div>
//         <DialogFooter className="gap-2"><Button variant="secondary" onClick={onClose} disabled={loading}>{t('cancel')}</Button><Button onClick={handleSubmit} disabled={loading}>{loading ? <><Loader2 className="h-4 w-4 animate-spin ml-2" />{t('bookingInProgress')}</> : <><UserPlus className="h-4 w-4 ml-2" /> {t('confirmBooking')}</>}</Button></DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

// // ── Passengers List ────────────────────────────────────────────────
// function BookingPassengerRow({ booking, index, isSelected, onToggle, onCancel, t }: any) {
//   const firestore = useFirestore();
//   const [profile, setProfile] = useState<any>(null);
//   useEffect(() => {
//     if (booking.userId) fetchUserCached(firestore, booking.userId).then(setProfile);
//   }, [firestore, booking.userId]);

//   // [FIX-SEATS-DISPLAY]: نعرض كل المسافرين في الـ booking مش بس الأول
//   const passengers: any[] = booking.passengersDetails?.length > 0
//     ? booking.passengersDetails
//     : [{}]; // fallback لو مفيش بيانات بعد

//   const firstPassenger = passengers[0] || {};
//   const profilePhone = profile?.phoneNumber
//     ? `${profile.phoneCountryCode ? '+' + profile.phoneCountryCode + ' ' : ''}${profile.phoneNumber}`
//     : '';

//   return (
//     <div className="space-y-1">
//       <button onClick={onToggle} className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-muted/30 border text-sm">
//         <span className="flex items-center gap-2">
//           <span className="font-mono text-xs text-muted-foreground">#{index + 1}</span>
//           <span className="font-semibold">{firstPassenger.name || profile?.firstName || t('traveler')}</span>
//           {/* عرض عدد المقاعد لو أكتر من واحد */}
//           {passengers.length > 1 && (
//             <span className="text-xs text-muted-foreground">({passengers.length} {t('seat') || 'مقاعد'})</span>
//           )}
//         </span>
//         {(() => {
//           const p = booking.passengersDetails;
//           const hasDetails = p && p.length > 0 && p[0]?.name && p[0]?.nationality && p[0]?.documentNumber;
//           if (!hasDetails && booking.status === 'Pending-Carrier-Confirmation') {
//             return <Badge variant="outline" className="text-[10px] border-gray-400 text-gray-500">بانتظار التأكيد</Badge>;
//           }
//           if (booking.status === 'Pending-Carrier-Confirmation') {
//             return <Badge variant="outline" className="text-[10px] bg-[#FEF9C3] text-black">بانتظار موافقتك</Badge>;
//           }
//           if (booking.status === 'Pending-Payment') {
//             return <Badge variant="outline" className="text-[10px] bg-[#FFEDD5] text-black">بانتظار دفع العربون</Badge>;
//           }
//           if (booking.status === 'Pending-Payment-Verification') {
//             return <Badge variant="outline" className="text-[10px] bg-[#307380] text-white">بانتظار تأكيد الاستلام</Badge>;
//           }
//           if (booking.status === 'Confirmed') {
//             return <Badge className="text-[10px] bg-[#BFAF78] text-black">مؤكدة ✓</Badge>;
//           }
//           return <Badge variant="secondary" className="text-[10px]">{booking.status}</Badge>;
//         })()}
//       </button>

//       {isSelected && (
//         <div className="bg-muted/20 border border-t-0 rounded-b-lg px-3 py-3 space-y-3 text-sm animate-in fade-in">
//           {/* [FIX]: عرض كل المسافرين في الـ booking */}
//           {passengers.map((p: any, pIdx: number) => {
//             const phone = p.phone || p.phoneNumber || (pIdx === 0 ? profilePhone : '');
//             return (
//               <div key={pIdx} className={passengers.length > 1 ? 'border-b border-border/40 pb-2 last:border-0 last:pb-0' : ''}>
//                 {passengers.length > 1 && (
//                   <p className="text-xs font-bold text-muted-foreground mb-1">
//                     {/* [FIX-i18n]: استخدام مفاتيح موجودة فعلاً في namespace الـ carrier */}
//                     {t('passenger')} #{pIdx + 1}
//                     {p.type === 'minor' ? ` (${t('minor')})` : p.type === 'infant' ? ` (${t('infant')})` : ''}
//                   </p>
//                 )}
//                 {p.name && (
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">{t('passengerName')}</span>
//                     <span className="font-semibold">{p.name}</span>
//                   </div>
//                 )}
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">{t('phoneTrev')}</span>
//                   <a href={`tel:${phone?.replace(/\s+/g, '')}`} className="font-mono font-bold text-emerald-400" dir="ltr">{phone || '—'}</a>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">{t('docNumber')}</span>
//                   <span className="font-mono">{p.documentNumber || '—'}</span>
//                 </div>
//                 {p.nationality && (
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">{t('nationality')}</span>
//                     <span>{p.nationality}</span>
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//           {booking.bookedByCarrier && (
//             <Button variant="destructive" size="sm" className="w-full mt-2" onClick={() => onCancel(booking.id)}>
//               <Ban className="size-3.5 ml-1" /> {t('cancelBooking')}
//             </Button>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// function TripPassengers({ trip }: { trip: Trip }) {
//   const firestore = useFirestore();
//   const { toast } = useToast();
//   const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
//   const [cancellingId, setCancellingId] = useState<string | null>(null);
//   const t = useTranslations('carrier');

//   // جلب الحجوزات المؤكدة — بـ carrierTripId (طلب مسافر) أو tripId (حجز عادي)
//   const qConfirmedByCarrierTrip = useMemoFirebase(() => !firestore || !trip.id ? null : query(collection(firestore, 'bookings'), where('carrierTripId', '==', trip.id), where('status', 'in', ['Confirmed', 'Pending-Payment', 'Pending-Payment-Verification'])), [firestore, trip.id]);
//   const qConfirmedByTripId = useMemoFirebase(() => !firestore || !trip.id ? null : query(collection(firestore, 'bookings'), where('tripId', '==', trip.id), where('status', 'in', ['Confirmed', 'Pending-Payment', 'Pending-Payment-Verification'])), [firestore, trip.id]);
//   const qPendingByCarrierTrip = useMemoFirebase(() => !firestore || !trip.id ? null : query(collection(firestore, 'bookings'), where('carrierTripId', '==', trip.id), where('status', '==', 'Pending-Carrier-Confirmation')), [firestore, trip.id]);
//   const qPendingByTripId = useMemoFirebase(() => !firestore || !trip.id ? null : query(collection(firestore, 'bookings'), where('tripId', '==', trip.id), where('status', '==', 'Pending-Carrier-Confirmation')), [firestore, trip.id]);

//   const { data: confirmedByCarrier } = useCollection<Booking>(qConfirmedByCarrierTrip);
//   const { data: confirmedByTrip } = useCollection<Booking>(qConfirmedByTripId);
//   const { data: pendingByCarrier } = useCollection<Booking>(qPendingByCarrierTrip);
//   const { data: pendingByTrip } = useCollection<Booking>(qPendingByTripId);

//   // دمج النتائج وإزالة المكررات
//   const confirmedBookings = useMemo(() => {
//     const all = [...(confirmedByCarrier || []), ...(confirmedByTrip || [])];
//     return all.filter((b, i, arr) => arr.findIndex(x => x.id === b.id) === i);
//   }, [confirmedByCarrier, confirmedByTrip]);
//   const pendingBookings = useMemo(() => {
//     const all = [...(pendingByCarrier || []), ...(pendingByTrip || [])];
//     return all.filter((b, i, arr) => arr.findIndex(x => x.id === b.id) === i);
//   }, [pendingByCarrier, pendingByTrip]);

//   if (!confirmedBookings?.length && !pendingBookings?.length) return <p className="text-xs text-muted-foreground text-center py-2">{t('noSeatsYet')}</p>;

//   return (
//     <div className="space-y-2">
//       {/* ── حجوزات بانتظار موافقة الناقل ── */}
//       {pendingBookings && pendingBookings.length > 0 && (
//         <div className="space-y-1">
//           <p className="text-[10px] font-bold text-amber-400  flex items-center gap-1">⏳ بانتظار موافقتك ({pendingBookings.length})</p>
//           {pendingBookings.map((b, i) => <BookingPassengerRow key={b.id} booking={b} index={i} isSelected={selectedIndex === i} onToggle={() => setSelectedIndex(selectedIndex === i ? null : i)} onCancel={setCancellingId} t={t} />)}
//         </div>
//       )}
//       {/* ── حجوزات مؤكدة ── */}
//       {confirmedBookings && confirmedBookings.length > 0 && (
//         <div className="space-y-1">
//           {pendingBookings && pendingBookings.length > 0 && <p className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">✅ مؤكدة ({confirmedBookings.length})</p>}
//           {confirmedBookings.map((b, i) => <BookingPassengerRow key={b.id} booking={b} index={i} isSelected={selectedIndex === i} onToggle={() => setSelectedIndex(selectedIndex === i ? null : i)} onCancel={setCancellingId} t={t} />)}
//         </div>
//       )}
//     </div>
//   );
// }

// // ── Opportunity Row ────────────────────────────────────────────────
// function OpportunityRow({ opportunity, carrierId, isOpen, onToggle, onOffer }: any) {
//   const firestore = useFirestore();
//   const t = useTranslations('carrier');
//   const [profile, setProfile] = useState<UserProfile | null>(null);

//   useEffect(() => {
//     if (opportunity.userId) fetchUserCached(firestore, opportunity.userId).then(setProfile);
//   }, [firestore, opportunity.userId]);

//   const isDirect = opportunity.requestType === 'Direct' && opportunity.targetCarrierId === carrierId;

//   // ✅ دمج كود الدولة مع الرقم بشكل صحيح
//   const displayPhone = profile?.phoneNumber
//     ? `${profile.phoneCountryCode ? '+' + profile.phoneCountryCode + ' ' : ''}${profile.phoneNumber}`
//     : '—';

//   return (
//     <div className="overflow-hidden">
//       <button onClick={onToggle} className={cn("w-full flex items-center justify-between px-3 py-2 rounded-lg border text-sm transition-all", isDirect ? "bg-primary/10 border-primary/30" : "bg-amber-500/10 border-amber-500/20")}>
//         <span className="flex items-center gap-2 font-semibold">
//           <UserCircle className={cn("size-4", isDirect ? "text-primary" : "text-amber-500")} />
//           {opportunity.creatorRole === 'agent' ? (opportunity.agentName || 'وكيل') : (profile?.firstName || t('traveler'))}
//         </span>
//         {isDirect && <Badge className="text-[9px] bg-primary">{t('customRequest')}</Badge>}
//       </button>

//       {isOpen && (
//         <div className="bg-card/40 border border-t-0 rounded-b-lg px-4 py-4 space-y-3 text-sm animate-in slide-in-from-top-2">
//           <div className="flex justify-between items-center"><span className="text-muted-foreground">{t('travelerName')}</span><span className="font-bold">{[profile?.firstName, profile?.lastName].filter(Boolean).join(' ') || t('traveler')}</span></div>

//           {/* ✅ حقل الهاتف مع كود الدولة ورابط اتصال مباشر */}
//           <div className="flex justify-between items-center">
//             <span className="text-muted-foreground">{t('phoneTrev')}</span>
//             <a href={`tel:${displayPhone.replace(/\s+/g, '')}`} className="flex items-center gap-1.5 font-mono font-black text-emerald-400 hover:text-emerald-300 transition-colors" dir="ltr">
//               <Phone className="size-3" /> {displayPhone}
//             </a>
//           </div>

//           <div className="flex justify-between items-center"><span className="text-muted-foreground">{t('seatsNum')}</span><span className="font-bold">{opportunity.passengers} {t('seat')}</span></div>

//           {/* ✅ تفاصيل نوع الركاب: بالغ / قاصر / رضيع */}
//           {Array.isArray(opportunity.passengersDetails) && opportunity.passengersDetails.length > 0 && (() => {
//             const counts = { adult: 0, child: 0, infant: 0 };
//             opportunity.passengersDetails.forEach((p: any) => {
//               const type = p.type || p.passengerType || 'adult';
//               if (type === 'child' || type === 'minor' || type === 'قاصر') counts.child++;
//               else if (type === 'infant' || type === 'رضيع') counts.infant++;
//               else counts.adult++;
//             });
//             return (
//               <div className="flex flex-wrap gap-2 pt-1 border-t border-muted/30">
//                 {counts.adult > 0 && (
//                   <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-blue-500/10 border border-blue-500/30 text-blue-400 font-medium">
//                     <User className="h-3 w-3" /> {counts.adult} بالغ
//                   </span>
//                 )}
//                 {counts.child > 0 && (
//                   <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-amber-500/10 border border-amber-500/30 text-amber-400 font-medium">
//                     <Users className="h-3 w-3" /> {counts.child} قاصر
//                   </span>
//                 )}
//                 {counts.infant > 0 && (
//                   <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-pink-500/10 border border-pink-500/30 text-pink-400 font-medium">
//                     <Baby className="h-3 w-3" /> {counts.infant} رضيع
//                   </span>
//                 )}
//               </div>
//             );
//           })()}

//           <Button size="sm" className="w-full mt-2 font-bold" onClick={() => onOffer(opportunity.id)}>{t('sendOffer')}</Button>
//         </div>
//       )}
//     </div>
//   );
// }

// // ── Direct & General Opportunities ──
// function DirectOpportunities({ trip, carrierId }: { trip: Trip; carrierId: string }) {
//   const firestore = useFirestore();
//   const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
//   const [intentId, setIntentId] = useState('');
//   const t = useTranslations('carrier');
//   const { openOfferDialog, selectedTrip, isDialogOpen, setIsDialogOpen, handleSendOffer } = useOfferDialog();
//   const q = useMemoFirebase(() => !firestore ? null : query(collection(firestore, 'trips'), where('status', '==', 'Awaiting-Offers'), where('origin', '==', trip.origin), where('destination', '==', trip.destination), limit(10)), [firestore, trip.origin, trip.destination]);
//   const { data: opps } = useCollection<Trip>(q);
//   const filtered = useMemo(() => opps?.filter(o => o.requestType === 'Direct' && o.targetCarrierId === carrierId) || [], [opps, carrierId]);

//   if (!filtered.length) return <p className="text-xs text-muted-foreground text-center py-2">{t('noDirectOrders')}</p>;
//   return (<><div className="space-y-2">{filtered.map((opp, i) => <OpportunityRow key={opp.id} opportunity={opp} carrierId={carrierId} isOpen={selectedIndex === i} onToggle={() => setSelectedIndex(selectedIndex === i ? null : i)} onOffer={(id: any) => { setIntentId(id); openOfferDialog(opp); }} />)}</div>{selectedTrip && <OfferDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} trip={selectedTrip} onSendOffer={(d) => handleSendOffer(d, intentId)} />}</>);
// }

// function GeneralOpportunities({ trip, carrierId }: { trip: Trip; carrierId: string }) {
//   const firestore = useFirestore();
//   const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
//   const [intentId, setIntentId] = useState('');
//   const t = useTranslations('carrier');
//   const { openOfferDialog, selectedTrip, isDialogOpen, setIsDialogOpen, handleSendOffer } = useOfferDialog();
//   const q = useMemoFirebase(() => !firestore ? null : query(collection(firestore, 'trips'), where('status', '==', 'Awaiting-Offers'), where('origin', '==', trip.origin), where('destination', '==', trip.destination), limit(10)), [firestore, trip.origin, trip.destination]);
//   const { data: opps } = useCollection<Trip>(q);
//   const filtered = useMemo(() => opps?.filter(o => o.requestType === 'General') || [], [opps]);

//   if (!filtered.length) return <p className="text-xs text-muted-foreground text-center py-2">{t('noGeneralOrders')}</p>;
//   return (<><div className="space-y-2">{filtered.map((opp, i) => <OpportunityRow key={opp.id} opportunity={opp} carrierId={carrierId} isOpen={selectedIndex === i} onToggle={() => setSelectedIndex(selectedIndex === i ? null : i)} onOffer={(id: any) => { setIntentId(id); openOfferDialog(opp); }} />)}</div>{selectedTrip && <OfferDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} trip={selectedTrip} onSendOffer={(d) => handleSendOffer(d, intentId)} />}</>);
// }

// function TripCard({ trip, onEdit, carrierProfile, onTransfer }: { trip: Trip; onEdit: (trip: Trip) => void; carrierProfile: UserProfile | null; onTransfer?: (trip: Trip) => void }) {
//   const locale = useLocale();
//   const { user } = useUser();
//   const firestore = useFirestore();
//   const [manifestOpen, setManifestOpen] = useState(false);
//   const [cancelOpen, setCancelOpen] = useState(false);
//   const [showBlockingAlert, setShowBlockingAlert] = useState(false);
//   const [directBookingOpen, setDirectBookingOpen] = useState(false);
//   const [chatOpen, setChatOpen] = useState(false);

//   // ── Countdown Timer ─────────────────────────────────────────────
//   const [countdown, setCountdown] = useState('');
//   const [isAfterDeparture, setIsAfterDeparture] = useState(false);
//   useEffect(() => {
//     const calcCountdown = () => {
//       const depDate = parseFirestoreDate(trip.departureDate);
//       const durationHours = (trip as any).estimatedDurationHours || 0;
//       const arrivalDate = new Date(depDate.getTime() + durationHours * 3600000);
//       const now = new Date();

//       if (now < depDate) {
//         // قبل الانطلاق — عداد تنازلي
//         setIsAfterDeparture(false);
//         const diff = depDate.getTime() - now.getTime();
//         const d = Math.floor(diff / 86400000);
//         const h = Math.floor((diff % 86400000) / 3600000);
//         const m = Math.floor((diff % 3600000) / 60000);
//         const s = Math.floor((diff % 60000) / 1000);
//         if (d > 0) setCountdown(`${d}ي ${h}س ${m}د`);
//         else if (h > 0) setCountdown(`${h}س ${m}د ${s}ث`);
//         else setCountdown(`${m}د ${s}ث`);
//       } else if (durationHours > 0 && now < arrivalDate) {
//         // بعد الانطلاق — عداد تصاعدي (مدة الرحلة المنقضية)
//         setIsAfterDeparture(true);
//         const diff = now.getTime() - depDate.getTime();
//         const h = Math.floor(diff / 3600000);
//         const m = Math.floor((diff % 3600000) / 60000);
//         const s = Math.floor((diff % 60000) / 1000);
//         setCountdown(`${h}س ${m}د ${s}ث`);
//       } else {
//         setIsAfterDeparture(false);
//         setCountdown('');
//       }
//     };
//     calcCountdown();
//     const interval = setInterval(calcCountdown, 1000);
//     return () => clearInterval(interval);
//   }, [trip.departureDate, (trip as any).estimatedDurationHours]);
//   const { isProcessing, completeTrip, cancelTrip } = useTripActions();
//   const t = useTranslations('carrier');

//   const isCompleted = useMemo(() => {
//     if (['Completed', 'Cancelled'].includes(trip.status)) return true;
//     const depDate = parseFirestoreDate(trip.departureDate);
//     const durationHours = (trip as any).estimatedDurationHours || 0;
//     const endDate = new Date(depDate.getTime() + durationHours * 60 * 60 * 1000);
//     return endDate < new Date();
//   }, [trip.status, trip.departureDate, (trip as any).estimatedDurationHours]);

//   const isDeparted = useMemo(() => {
//     const depDate = parseFirestoreDate(trip.departureDate);
//     return depDate < new Date();
//   }, [trip.departureDate]);

//   // ✅ تحديث تلقائي للحالة إلى In-Transit لما وقت الانطلاق يعدي
//   useEffect(() => {
//     if (!firestore || !isDeparted || trip.status !== 'Planned') return;
//     updateDoc(doc(firestore, 'trips', trip.id), {
//       status: 'In-Transit',
//       updatedAt: serverTimestamp(),
//     }).catch(() => { });
//   }, [firestore, isDeparted, trip.id, trip.status]);

//   const isThisProcessing = isProcessing?.endsWith(trip.id);
//   const capacity = carrierProfile?.vehicleCapacity || (trip as any).vehicleCapacity || 0;
//   const available = trip.availableSeats ?? 0;
//   // ✅ المقاعد المحجوزة = الطاقة - المتاح (بس بعد تأكيد الناقل فقط)
//   // availableSeats بيتخصم بس بعد confirm-booking، يعني الرقم ده صح
//   const booked = Math.max(0, capacity - available);
//   const fillPct = capacity > 0 ? Math.min(100, (booked / capacity) * 100) : 0;
//   const isFull = available <= 0;
//   const hasBookings = trip.bookingIds && trip.bookingIds.length > 0;
//   const carrierId = user?.uid || '';

//   return (
//     <>
//       <Card className={cn(
//         "relative overflow-hidden border-2 shadow-md transition-all duration-300",
//         isCompleted
//           ? "border-gray-500/40 opacity-60 pointer-events-none"
//           : "border-blue-400 hover:border-yellow-300 hover:shadow-[0_0_12px_2px_rgba(234,179,8,0.35)]"
//       )}>
//         {isCompleted && (
//           <div className="absolute inset-0 bg-black/40 z-50 flex items-center justify-center">
//             <span className="text-white font-bold text-lg">
//               {t('endTrip')}
//             </span>
//           </div>
//         )}
//         {/* ── Countdown Banner ── */}
//         {countdown && (
//           <div className={`flex items-center justify-center gap-2 py-2 px-4 text-xs font-bold border-b ${isAfterDeparture
//             ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
//             : 'bg-amber-500/15 border-amber-500/25 text-amber-300'
//             }`}>
//             {isAfterDeparture ? (
//               <>
//                 <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
//                 <span>في الطريق منذ: {countdown}</span>
//               </>
//             ) : (
//               <>
//                 <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
//                 <span>ينطلق بعد: {countdown}</span>
//               </>
//             )}
//           </div>
//         )}
//         <div className="p-4 text-white bg-[#200a0f89] border-b border-b-amber-200/30">
//           <div className="flex justify-between items-start ">
//             <h2 className="text-lg font-bold">
//               {getCityName(trip.origin, locale)}<span className="mx-2 font-light opacity-70">←</span>{getCityName(trip.destination, locale)}
//             </h2>
//             <Badge variant="outline" className="text-white border-white/40 text-[10px]">
//               {trip.status === 'Planned' ? t('scheduled') : trip.status === 'In-Transit' ? t('inTheWay') : trip.status}
//             </Badge>
//           </div>
//           <div className="grid grid-cols-3 gap-2 mt-3 text-center">
//             <div className="bg-white/10 rounded-lg p-2">
//               <p className="text-[10px] opacity-70">{t('flightNumber')}</p>
//               <p className="font-mono font-bold text-sm">{trip.id.slice(-6).toUpperCase()}</p>
//             </div>
//             <div className="bg-white/10 rounded-lg p-2">
//               <p className="text-[10px] opacity-70">{t('departureTime')}</p>
//               <p className="font-bold text-sm">{formatDate(trip.departureDate, 'hh:mm a', locale)}</p>
//             </div>
//             <div className="bg-white/10 rounded-lg p-2">
//               <p className="text-[10px] opacity-70">{t('date')}</p>
//               <p className="font-bold text-sm">{formatDate(trip.departureDate, 'dd/MM/yyyy', locale)}</p>
//             </div>
//           </div>
//         </div>

//         <div className="p-4 space-y-4 bg-[#200a0f89]">
//           <div className="h-3 w-full bg-secondary/50 rounded-full overflow-hidden border border-border/50">
//             <div className={cn("h-full transition-all duration-500", isFull ? "bg-red-500" : fillPct > 80 ? "bg-orange-500" : "bg-emerald-500")}
//               style={{ width: `${fillPct}%` }} />
//           </div>

//           <div className="flex items-center justify-between">
//             <h3 className="text-sm font-bold">
//               {isFull ? `🚫 ${t('flightFull')}` : `🪑 ${t('emptySeats')} : ${available}`}
//             </h3>
//             {!isFull && (
//               <Button
//                 size="sm"
//                 variant="outline"
//                 className="gap-1.5 border-primary/40 text-primary hover:bg-primary/10 text-xs"
//                 onClick={() => setDirectBookingOpen(true)}
//                 disabled={isCompleted || !!isThisProcessing || isDeparted}
//                 title={isDeparted ? t('takeOffTime') : ''}
//               >
//                 <UserPlus className="h-3.5 w-3.5" /> {t('bookedYourClients')}
//               </Button>
//             )}
//           </div>

//           <div className="space-y-2">
//             <div className="flex gap-1 items-center">
//               <UserCircle className="size-4 text-primary" />
//               <h3 className="text-sm font-bold">{t('clientRequests')}</h3>
//             </div>
//             <DirectOpportunities trip={trip} carrierId={carrierId} />
//           </div>

//           <div className="space-y-2">
//             <div className="flex gap-1 items-center">
//               <Store className="size-4 text-amber-500" />
//               <h3 className="text-sm font-bold">{t('requestsMarket')}</h3>
//             </div>
//             <GeneralOpportunities trip={trip} carrierId={carrierId} />
//           </div>

//           <div className="space-y-2">
//             <h3 className="text-sm font-bold flex items-center gap-2">
//               <User className="h-4 w-4 text-primary" />{t('reservedSeats')} ({booked})
//             </h3>
//             <TripPassengers trip={trip} />
//           </div>

//           <div className="grid grid-cols-2 gap-3 text-sm pt-1 border-t">
//             <div><p className="text-xs text-muted-foreground">{t('price')}</p><p className="font-semibold">{trip.price} {trip.currency}</p></div>
//             <div><p className="text-xs text-muted-foreground">{t('meetingPoint')}</p><p className="font-semibold text-xs truncate">{trip.meetingPoint || '—'}</p></div>
//           </div>

//           {/* {trip.status === 'In-Transit' ? (
//             <Button size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white gap-2" onClick={() => completeTrip(trip)} disabled={!!isThisProcessing}>
//               {isThisProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />} {t('endTrip')}
//             </Button>
//           ) :
//            ( */}
//           <div className="flex gap-2">
//             <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => setManifestOpen(true)} disabled={!!isThisProcessing}>
//               <User className="h-4 w-4" /> {t('Statement')}
//             </Button>
//             <Button variant="outline" size="icon" className="h-9 w-9 bg-[#1C080D] border-0 text-emerald-400 hover:bg-[#38121F]" onClick={() => setChatOpen(true)} title="جروب الرحلة">
//               <MessageSquare className="h-4 w-4" />
//             </Button>
//             <Button
//               variant="ghost"
//               size="icon"
//               className={cn(
//                 "h-9 w-9",
//                 isDeparted ? "text-muted-foreground opacity-40 cursor-not-allowed" : "text-blue-600 hover:bg-blue-600/10"
//               )}
//               onClick={() => !isDeparted && onEdit(trip)}
//             >
//               <Edit className="h-4 w-4" />
//             </Button>
//             <Button variant="ghost" size="icon" className="text-destructive hover:bg-[#38121F] h-9 w-9"
//               onClick={() => hasBookings ? setShowBlockingAlert(true) : setCancelOpen(true)}
//             // disabled={isCompleted || !!isThisProcessing || !!hasBookings || isDeparted}
//             >
//               <Trash2 className="h-4 w-4" />
//             </Button>
//             {/* <Button
//               variant="ghost"
//               size="icon"
//               className="h-9 w-9 text-orange-500 hover:bg-orange-500/10"
//               onClick={() => onTransfer && onTransfer(trip)}
//               title="نقل الرحلة لناقل آخر"
//             >
//               <ArrowRight className="h-4 w-4" />
//             </Button> */}
//           </div>
//           {/* )} */}
//         </div>
//       </Card>

//       <DirectBookingDialog trip={trip} isOpen={directBookingOpen} onClose={() => setDirectBookingOpen(false)} />
//       <ChatDialog isOpen={chatOpen} onOpenChange={setChatOpen} trip={trip} />
//       <TripManifestDialog tripId={manifestOpen ? trip.id : null} trip={manifestOpen ? trip : null} open={manifestOpen} onOpenChange={setManifestOpen} />

//       <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>{t('confirmCancelTitle')}</AlertDialogTitle>
//             <AlertDialogDescription>{t('confirmCancelDesc')}</AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>{t('goBack')}</AlertDialogCancel>
//             <AlertDialogAction onClick={() => { cancelTrip(trip); setCancelOpen(false); }} className="bg-destructive">{t('cancelTrip')}</AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//       <AlertDialog open={showBlockingAlert} onOpenChange={setShowBlockingAlert}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle className="flex items-center gap-2 text-destructive"><AlertTriangle className="h-5 w-5" /> {t('sovereignLawTitle')}</AlertDialogTitle>
//             <AlertDialogDescription className="space-y-2 pt-2">
//               <p className="font-bold text-foreground">{t('cannotCancelBooked')}</p>
//               <p className="text-sm text-muted-foreground">{t('sovereignDesc')}</p>
//               <p className="text-sm text-muted-foreground">يجب اولا نقل الركاب الي ناقل اخر قبل حذف الرحله</p>
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <div className="flex gap-2 items-center">
//               <Button
//                 variant="ghost"
//                 // size="icon"
//                 className="h-9 w-full bg-[#BFAF78] text-black hover:bg-orange-500/10"
//                 onClick={() => onTransfer && onTransfer(trip)}
//                 title="نقل الرحلة لناقل آخر"
//               >

//                 {/* <ArrowRight className="h-4 w-4" /> */}
//                 البحث علي ناقل اخر
//               </Button>
//               <AlertDialogCancel>{t('understood')}</AlertDialogCancel>

//             </div>

//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </>
//   );
// }
// // ── Main Export ────────────────────────────────────────────────────
// export function MyTripsList({ trips, isLoading, onEdit, carrierProfile, onTransfer }: MyTripsListProps) {
//   const t = useTranslations('myTripsList');
//   if (isLoading) return <div className="text-center py-10 text-muted-foreground">جاري التحميل...</div>;
//   if (!trips?.length) return <div className="text-center py-16 border-2 border-dashed rounded-lg bg-card col-span-full"><Route className="mx-auto h-12 w-12 opacity-20 mb-4" /><p className="font-bold">{t('emptyTitle')}</p></div>;
//   return <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{trips.map(trip => <TripCard key={trip.id} trip={trip} onEdit={onEdit} carrierProfile={carrierProfile} onTransfer={onTransfer} />)}</div>;
// }
'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2, Loader2, CheckCircle2, AlertTriangle, User, Route, UserPlus, Ban, UserCircle, Store, Star, Phone, Baby, Users, MessageSquare, ArrowRight, ArrowRightLeft } from 'lucide-react';
import type { Trip, Booking, UserProfile } from '@/lib/data';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from '@/components/ui/dialog';
import { TripManifestDialog } from './trip-manifest-dialog';
import { useTripActions } from '@/hooks/use-trip-actions';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, addDoc, updateDoc, doc, serverTimestamp, increment, limit, getDoc, writeBatch, arrayUnion } from 'firebase/firestore';
import { getCityName } from '@/lib/constants';
import { formatDate } from '@/lib/formatters';
import { useLocale, useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useOfferDialog } from '@/hooks/use-offer-dialog';
import { OfferDialog } from './offer-dialog';
import { ChatDialog } from '@/components/chat/chat-dialog';
import { BookingTransferDialog } from '@/components/carrier/booking-transfer-dialog';

interface MyTripsListProps {
  trips: Trip[];
  isLoading: boolean;
  onEdit: (trip: Trip) => void;
  carrierProfile: UserProfile | null;
  onTransfer?: (trip: Trip) => void;
}

// ── Utilities ──────────────────────────────────────────────────────
const parseFirestoreDate = (dateObj: any): Date => {
  if (!dateObj) return new Date(0);
  return dateObj.toDate?.() || new Date(dateObj);
};

// ── Cache System ───────────────────────────────────────────────────
const userCache = new Map<string, Promise<UserProfile | null>>();
const fetchUserCached = async (firestore: any, userId: string): Promise<UserProfile | null> => {
  if (userCache.has(userId)) return userCache.get(userId) as Promise<UserProfile | null>;
  const promise = getDoc(doc(firestore, 'users', userId)).then(snap =>
    snap.exists() ? { ...snap.data(), id: snap.id } as UserProfile : null
  );
  userCache.set(userId, promise);
  return promise;
};

// ── Direct Booking Dialog ──────────────────────────────────────────
function DirectBookingDialog({ trip, isOpen, onClose }: { trip: Trip; isOpen: boolean; onClose: () => void }) {
  const locale = useLocale();
  const t = useTranslations('carrier');
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', nationality: '', documentNumber: '', type: 'adult' as 'adult' | 'minor' | 'infant', seats: 1 });

  const handleSubmit = async () => {
    if (!firestore || !user) return;
    const depDate = parseFirestoreDate(trip.departureDate);
    if (depDate < new Date()) {
      toast({ variant: 'destructive', title: t('timeExpired'), description: t('timeExpiredDesc') });
      return;
    }
    if (!form.name.trim() || !form.nationality.trim() || !form.documentNumber.trim()) {
      toast({ variant: 'destructive', title: t('fillAllFields') });
      return;
    }
    if (form.seats > (trip.availableSeats || 0)) {
      toast({ variant: 'destructive', title: t('seatsExceeded') });
      return;
    }
    setLoading(true);
    try {
      const batch = writeBatch(firestore);
      const bookingRef = doc(collection(firestore, 'bookings'));
      const tripRef = doc(firestore, 'trips', trip.id);
      batch.set(bookingRef, {
        id: bookingRef.id, tripId: trip.id, carrierId: user.uid, userId: user.uid, bookedByCarrier: true,
        seats: form.seats, passengersDetails: [{ name: form.name.trim(), nationality: form.nationality.trim(), documentNumber: form.documentNumber.trim(), type: form.type }],
        status: 'Confirmed', totalPrice: (trip.price || 0) * form.seats, currency: trip.currency,
        createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
      });
      batch.update(tripRef, { availableSeats: increment(-form.seats), bookingIds: arrayUnion(bookingRef.id), updatedAt: serverTimestamp() });
      await batch.commit();
      toast({ title: t('bookingSuccess') });
      onClose();
      setForm({ name: '', nationality: '', documentNumber: '', type: 'adult', seats: 1 });
    } catch (e: any) {
      toast({ variant: 'destructive', title: t('bookingFailed'), description: e?.message });
    } finally { setLoading(false); }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !loading && !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><UserPlus className="h-5 w-5 text-primary" />{t('directBookingTitle')}</DialogTitle>
          <DialogDescription>{getCityName(trip.origin, locale)} {locale === 'ar' ? '←' : '→'} {getCityName(trip.destination, locale)} | {t('available')}: {trip.availableSeats} {t('seat')}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2"><Label>{t('fullName')}<span className="text-destructive">*</span></Label><Input placeholder={t('passengerName')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} disabled={loading} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2"><Label>{t('nationality')}<span className="text-destructive">*</span></Label><Input placeholder={t('nationalityPlaceholder')} value={form.nationality} onChange={(e) => setForm({ ...form, nationality: e.target.value })} disabled={loading} /></div>
            <div className="space-y-2"><Label>{t('docNumber')}<span className="text-destructive">*</span></Label><Input placeholder={t('docPlaceholder')} value={form.documentNumber} onChange={(e) => setForm({ ...form, documentNumber: e.target.value })} disabled={loading} className="font-mono" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>{t('passengerType')}</Label>
              <Select value={form.type} onValueChange={(v: any) => setForm({ ...form, type: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="adult">{t('adult')}</SelectItem><SelectItem value="minor">{t('minor')}</SelectItem><SelectItem value="infant">{t('infant')}</SelectItem></SelectContent></Select>
            </div>
            <div className="space-y-2">
              <Label>{t('seatsCount')}</Label>
              <Select value={String(form.seats)} onValueChange={(v) => setForm({ ...form, seats: Number(v) })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Array.from({ length: trip.availableSeats || 1 }, (_, i) => i + 1).map(n => (<SelectItem key={n} value={String(n)}>{n}</SelectItem>))}</SelectContent></Select>
            </div>
          </div>
          <div className="bg-muted/40 rounded-lg p-3 text-sm flex justify-between"><span className="text-muted-foreground">{t('total')}</span><span className="font-bold">{((trip.price || 0) * form.seats).toFixed(2)} {trip.currency}</span></div>
        </div>
        <DialogFooter className="gap-2"><Button variant="secondary" onClick={onClose} disabled={loading}>{t('cancel')}</Button><Button onClick={handleSubmit} disabled={loading}>{loading ? <><Loader2 className="h-4 w-4 animate-spin ml-2" />{t('bookingInProgress')}</> : <><UserPlus className="h-4 w-4 ml-2" /> {t('confirmBooking')}</>}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Passengers List ────────────────────────────────────────────────
function BookingPassengerRow({ booking, index, isSelected, onToggle, onCancel, t, trip }: any) {
  const firestore = useFirestore();
  const [profile, setProfile] = useState<any>(null);
  // ── Dialog نقل هذا المسافر/الحجز لناقل آخر ──
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  useEffect(() => {
    if (booking.userId) fetchUserCached(firestore, booking.userId).then(setProfile);
  }, [firestore, booking.userId]);

  // [FIX-SEATS-DISPLAY]: نعرض كل المسافرين في الـ booking مش بس الأول
  const passengers: any[] = booking.passengersDetails?.length > 0
    ? booking.passengersDetails
    : [{}]; // fallback لو مفيش بيانات بعد

  const firstPassenger = passengers[0] || {};
  const profilePhone = profile?.phoneNumber
    ? `${profile.phoneCountryCode ? '+' + profile.phoneCountryCode + ' ' : ''}${profile.phoneNumber}`
    : '';

  const passengerDisplayName = firstPassenger.name || profile?.firstName || t('traveler');

  return (
    <div className="space-y-1">
      <div className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-muted/30 border text-sm gap-2">
        <button onClick={onToggle} className="flex items-center gap-2 min-w-0 flex-1 text-start">
          <span className="font-mono text-xs text-muted-foreground">#{index + 1}</span>
          <span className="font-semibold truncate">{passengerDisplayName}</span>
          {/* عرض عدد المقاعد لو أكتر من واحد */}
          {passengers.length > 1 && (
            <span className="text-xs text-muted-foreground shrink-0">({passengers.length} {t('seat') || 'مقاعد'})</span>
          )}
        </button>

        <div className="flex items-center gap-1.5 shrink-0">
          {(() => {
            const p = booking.passengersDetails;
            const hasDetails = p && p.length > 0 && p[0]?.name && p[0]?.nationality && p[0]?.documentNumber;
            if (!hasDetails && booking.status === 'Pending-Carrier-Confirmation') {
              return <Badge variant="outline" className="text-[10px] border-gray-400 text-gray-500">بانتظار التأكيد</Badge>;
            }
            if (booking.status === 'Pending-Carrier-Confirmation') {
              return <Badge variant="outline" className="text-[10px] bg-[#FEF9C3] text-black">بانتظار موافقتك</Badge>;
            }
            if (booking.status === 'Pending-Payment') {
              return <Badge variant="outline" className="text-[10px] bg-[#FFEDD5] text-black">بانتظار دفع العربون</Badge>;
            }
            if (booking.status === 'Pending-Payment-Verification') {
              return <Badge variant="outline" className="text-[10px] bg-[#307380] text-white">بانتظار تأكيد الاستلام</Badge>;
            }
            if (booking.status === 'Confirmed') {
              return <Badge className="text-[10px] bg-[#BFAF78] text-black">مؤكدة ✓</Badge>;
            }
            return <Badge variant="secondary" className="text-[10px]">{booking.status}</Badge>;
          })()}

          {/* ── زرار نقل المسافر لناقل آخر — يظهر فقط على الحجوزات المؤكدة ── */}
          {booking.status === 'Confirmed' && trip && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setIsTransferOpen(true); }}
              title="نقل إلى ناقل آخر"
              className="h-6 px-1.5 rounded-full border border-amber-500/30 text-amber-500 hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-colors flex items-center gap-1 text-[10px] font-bold"
            >
              <ArrowRightLeft className="size-3" />
            </button>
          )}

          {/* السهم لفتح/قفل التفاصيل */}
          <button onClick={onToggle} className="text-muted-foreground">
            <ArrowRight className={cn("size-3.5 transition-transform", isSelected && "-rotate-90")} />
          </button>
        </div>
      </div>

      {isSelected && (
        <div className="bg-muted/20 border border-t-0 rounded-b-lg px-3 py-3 space-y-3 text-sm animate-in fade-in">
          {/* [FIX]: عرض كل المسافرين في الـ booking */}
          {passengers.map((p: any, pIdx: number) => {
            const phone = p.phone || p.phoneNumber || (pIdx === 0 ? profilePhone : '');
            return (
              <div key={pIdx} className={passengers.length > 1 ? 'border-b border-border/40 pb-2 last:border-0 last:pb-0' : ''}>
                {passengers.length > 1 && (
                  <p className="text-xs font-bold text-muted-foreground mb-1">
                    {/* [FIX-i18n]: استخدام مفاتيح موجودة فعلاً في namespace الـ carrier */}
                    {t('passenger')} #{pIdx + 1}
                    {p.type === 'minor' ? ` (${t('minor')})` : p.type === 'infant' ? ` (${t('infant')})` : ''}
                  </p>
                )}
                {p.name && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('passengerName')}</span>
                    <span className="font-semibold">{p.name}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('phoneTrev')}</span>
                  <a href={`tel:${phone?.replace(/\s+/g, '')}`} className="font-mono font-bold text-emerald-400" dir="ltr">{phone || '—'}</a>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('docNumber')}</span>
                  <span className="font-mono">{p.documentNumber || '—'}</span>
                </div>
                {p.nationality && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('nationality')}</span>
                    <span>{p.nationality}</span>
                  </div>
                )}
              </div>
            );
          })}
          {booking.bookedByCarrier && (
            <Button variant="destructive" size="sm" className="w-full mt-2" onClick={() => onCancel(booking.id)}>
              <Ban className="size-3.5 ml-1" /> {t('cancelBooking')}
            </Button>
          )}
        </div>
      )}

      {/* ── BookingTransferDialog: نقل هذا الحجز المؤكد لناقل آخر على نفس المسار ── */}
      {booking.status === 'Confirmed' && trip && (
        <BookingTransferDialog
          isOpen={isTransferOpen}
          onOpenChange={setIsTransferOpen}
          booking={booking}
          carrierTrip={trip}
          passengerName={passengerDisplayName}
        />
      )}
    </div>
  );
}

function TripPassengers({ trip }: { trip: Trip }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const t = useTranslations('carrier');

  // جلب الحجوزات المؤكدة — بـ carrierTripId (طلب مسافر) أو tripId (حجز عادي)
  const qConfirmedByCarrierTrip = useMemoFirebase(() => !firestore || !trip.id ? null : query(collection(firestore, 'bookings'), where('carrierTripId', '==', trip.id), where('status', 'in', ['Confirmed', 'Pending-Payment', 'Pending-Payment-Verification'])), [firestore, trip.id]);
  const qConfirmedByTripId = useMemoFirebase(() => !firestore || !trip.id ? null : query(collection(firestore, 'bookings'), where('tripId', '==', trip.id), where('status', 'in', ['Confirmed', 'Pending-Payment', 'Pending-Payment-Verification'])), [firestore, trip.id]);
  const qPendingByCarrierTrip = useMemoFirebase(() => !firestore || !trip.id ? null : query(collection(firestore, 'bookings'), where('carrierTripId', '==', trip.id), where('status', '==', 'Pending-Carrier-Confirmation')), [firestore, trip.id]);
  const qPendingByTripId = useMemoFirebase(() => !firestore || !trip.id ? null : query(collection(firestore, 'bookings'), where('tripId', '==', trip.id), where('status', '==', 'Pending-Carrier-Confirmation')), [firestore, trip.id]);

  const { data: confirmedByCarrier } = useCollection<Booking>(qConfirmedByCarrierTrip);
  const { data: confirmedByTrip } = useCollection<Booking>(qConfirmedByTripId);
  const { data: pendingByCarrier } = useCollection<Booking>(qPendingByCarrierTrip);
  const { data: pendingByTrip } = useCollection<Booking>(qPendingByTripId);

  // دمج النتائج وإزالة المكررات
  const confirmedBookings = useMemo(() => {
    const all = [...(confirmedByCarrier || []), ...(confirmedByTrip || [])];
    return all.filter((b, i, arr) => arr.findIndex(x => x.id === b.id) === i);
  }, [confirmedByCarrier, confirmedByTrip]);
  const pendingBookings = useMemo(() => {
    const all = [...(pendingByCarrier || []), ...(pendingByTrip || [])];
    return all.filter((b, i, arr) => arr.findIndex(x => x.id === b.id) === i);
  }, [pendingByCarrier, pendingByTrip]);

  if (!confirmedBookings?.length && !pendingBookings?.length) return <p className="text-xs text-muted-foreground text-center py-2">{t('noSeatsYet')}</p>;

  return (
    <div className="space-y-2">
      {/* ── حجوزات بانتظار موافقة الناقل ── */}
      {pendingBookings && pendingBookings.length > 0 && (
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-amber-400  flex items-center gap-1">⏳ بانتظار موافقتك ({pendingBookings.length})</p>
          {pendingBookings.map((b, i) => <BookingPassengerRow key={b.id} booking={b} index={i} isSelected={selectedIndex === i} onToggle={() => setSelectedIndex(selectedIndex === i ? null : i)} onCancel={setCancellingId} t={t} trip={trip} />)}
        </div>
      )}
      {/* ── حجوزات مؤكدة ── */}
      {confirmedBookings && confirmedBookings.length > 0 && (
        <div className="space-y-1">
          {pendingBookings && pendingBookings.length > 0 && <p className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">✅ مؤكدة ({confirmedBookings.length})</p>}
          {confirmedBookings.map((b, i) => <BookingPassengerRow key={b.id} booking={b} index={i} isSelected={selectedIndex === i} onToggle={() => setSelectedIndex(selectedIndex === i ? null : i)} onCancel={setCancellingId} t={t} trip={trip} />)}
        </div>
      )}
    </div>
  );
}

// ── Opportunity Row ────────────────────────────────────────────────
function OpportunityRow({ opportunity, carrierId, isOpen, onToggle, onOffer }: any) {
  const firestore = useFirestore();
  const t = useTranslations('carrier');
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (opportunity.userId) fetchUserCached(firestore, opportunity.userId).then(setProfile);
  }, [firestore, opportunity.userId]);

  const isDirect = opportunity.requestType === 'Direct' && opportunity.targetCarrierId === carrierId;

  // ✅ دمج كود الدولة مع الرقم بشكل صحيح
  const displayPhone = profile?.phoneNumber
    ? `${profile.phoneCountryCode ? '+' + profile.phoneCountryCode + ' ' : ''}${profile.phoneNumber}`
    : '—';

  return (
    <div className="overflow-hidden">
      <button onClick={onToggle} className={cn("w-full flex items-center justify-between px-3 py-2 rounded-lg border text-sm transition-all", isDirect ? "bg-primary/10 border-primary/30" : "bg-amber-500/10 border-amber-500/20")}>
        <span className="flex items-center gap-2 font-semibold">
          <UserCircle className={cn("size-4", isDirect ? "text-primary" : "text-amber-500")} />
          {opportunity.creatorRole === 'agent' ? (opportunity.agentName || 'وكيل') : (profile?.firstName || t('traveler'))}
        </span>
        {isDirect && <Badge className="text-[9px] bg-primary">{t('customRequest')}</Badge>}
      </button>

      {isOpen && (
        <div className="bg-card/40 border border-t-0 rounded-b-lg px-4 py-4 space-y-3 text-sm animate-in slide-in-from-top-2">
          <div className="flex justify-between items-center"><span className="text-muted-foreground">{t('travelerName')}</span><span className="font-bold">{[profile?.firstName, profile?.lastName].filter(Boolean).join(' ') || t('traveler')}</span></div>

          {/* ✅ حقل الهاتف مع كود الدولة ورابط اتصال مباشر */}
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">{t('phoneTrev')}</span>
            <a href={`tel:${displayPhone.replace(/\s+/g, '')}`} className="flex items-center gap-1.5 font-mono font-black text-emerald-400 hover:text-emerald-300 transition-colors" dir="ltr">
              <Phone className="size-3" /> {displayPhone}
            </a>
          </div>

          <div className="flex justify-between items-center"><span className="text-muted-foreground">{t('seatsNum')}</span><span className="font-bold">{opportunity.passengers} {t('seat')}</span></div>

          {/* ✅ تفاصيل نوع الركاب: بالغ / قاصر / رضيع */}
          {Array.isArray(opportunity.passengersDetails) && opportunity.passengersDetails.length > 0 && (() => {
            const counts = { adult: 0, child: 0, infant: 0 };
            opportunity.passengersDetails.forEach((p: any) => {
              const type = p.type || p.passengerType || 'adult';
              if (type === 'child' || type === 'minor' || type === 'قاصر') counts.child++;
              else if (type === 'infant' || type === 'رضيع') counts.infant++;
              else counts.adult++;
            });
            return (
              <div className="flex flex-wrap gap-2 pt-1 border-t border-muted/30">
                {counts.adult > 0 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-blue-500/10 border border-blue-500/30 text-blue-400 font-medium">
                    <User className="h-3 w-3" /> {counts.adult} بالغ
                  </span>
                )}
                {counts.child > 0 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-amber-500/10 border border-amber-500/30 text-amber-400 font-medium">
                    <Users className="h-3 w-3" /> {counts.child} قاصر
                  </span>
                )}
                {counts.infant > 0 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-pink-500/10 border border-pink-500/30 text-pink-400 font-medium">
                    <Baby className="h-3 w-3" /> {counts.infant} رضيع
                  </span>
                )}
              </div>
            );
          })()}

          <Button size="sm" className="w-full mt-2 font-bold" onClick={() => onOffer(opportunity.id)}>{t('sendOffer')}</Button>
        </div>
      )}
    </div>
  );
}

// ── Direct & General Opportunities ──
function DirectOpportunities({ trip, carrierId }: { trip: Trip; carrierId: string }) {
  const firestore = useFirestore();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [intentId, setIntentId] = useState('');
  const t = useTranslations('carrier');
  const { openOfferDialog, selectedTrip, isDialogOpen, setIsDialogOpen, handleSendOffer } = useOfferDialog();
  const q = useMemoFirebase(() => !firestore ? null : query(collection(firestore, 'trips'), where('status', '==', 'Awaiting-Offers'), where('origin', '==', trip.origin), where('destination', '==', trip.destination), limit(10)), [firestore, trip.origin, trip.destination]);
  const { data: opps } = useCollection<Trip>(q);
  const filtered = useMemo(() => opps?.filter(o => o.requestType === 'Direct' && o.targetCarrierId === carrierId) || [], [opps, carrierId]);

  if (!filtered.length) return <p className="text-xs text-muted-foreground text-center py-2">{t('noDirectOrders')}</p>;
  return (<><div className="space-y-2">{filtered.map((opp, i) => <OpportunityRow key={opp.id} opportunity={opp} carrierId={carrierId} isOpen={selectedIndex === i} onToggle={() => setSelectedIndex(selectedIndex === i ? null : i)} onOffer={(id: any) => { setIntentId(id); openOfferDialog(opp); }} />)}</div>{selectedTrip && <OfferDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} trip={selectedTrip} onSendOffer={(d) => handleSendOffer(d, intentId)} />}</>);
}

function GeneralOpportunities({ trip, carrierId }: { trip: Trip; carrierId: string }) {
  const firestore = useFirestore();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [intentId, setIntentId] = useState('');
  const t = useTranslations('carrier');
  const { openOfferDialog, selectedTrip, isDialogOpen, setIsDialogOpen, handleSendOffer } = useOfferDialog();
  const q = useMemoFirebase(() => !firestore ? null : query(collection(firestore, 'trips'), where('status', '==', 'Awaiting-Offers'), where('origin', '==', trip.origin), where('destination', '==', trip.destination), limit(10)), [firestore, trip.origin, trip.destination]);
  const { data: opps } = useCollection<Trip>(q);
  const filtered = useMemo(() => opps?.filter(o => o.requestType === 'General') || [], [opps]);

  if (!filtered.length) return <p className="text-xs text-muted-foreground text-center py-2">{t('noGeneralOrders')}</p>;
  return (<><div className="space-y-2">{filtered.map((opp, i) => <OpportunityRow key={opp.id} opportunity={opp} carrierId={carrierId} isOpen={selectedIndex === i} onToggle={() => setSelectedIndex(selectedIndex === i ? null : i)} onOffer={(id: any) => { setIntentId(id); openOfferDialog(opp); }} />)}</div>{selectedTrip && <OfferDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} trip={selectedTrip} onSendOffer={(d) => handleSendOffer(d, intentId)} />}</>);
}

function TripCard({ trip, onEdit, carrierProfile, onTransfer }: { trip: Trip; onEdit: (trip: Trip) => void; carrierProfile: UserProfile | null; onTransfer?: (trip: Trip) => void }) {
  const locale = useLocale();
  const { user } = useUser();
  const firestore = useFirestore();
  const [manifestOpen, setManifestOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [showBlockingAlert, setShowBlockingAlert] = useState(false);
  const [directBookingOpen, setDirectBookingOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  // ── Countdown Timer ─────────────────────────────────────────────
  const [countdown, setCountdown] = useState('');
  const [isAfterDeparture, setIsAfterDeparture] = useState(false);
  useEffect(() => {
    const calcCountdown = () => {
      const depDate = parseFirestoreDate(trip.departureDate);
      const durationHours = (trip as any).estimatedDurationHours || 0;
      const arrivalDate = new Date(depDate.getTime() + durationHours * 3600000);
      const now = new Date();

      if (now < depDate) {
        // قبل الانطلاق — عداد تنازلي
        setIsAfterDeparture(false);
        const diff = depDate.getTime() - now.getTime();
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        if (d > 0) setCountdown(`${d}ي ${h}س ${m}د`);
        else if (h > 0) setCountdown(`${h}س ${m}د ${s}ث`);
        else setCountdown(`${m}د ${s}ث`);
      } else if (durationHours > 0 && now < arrivalDate) {
        // بعد الانطلاق — عداد تصاعدي (مدة الرحلة المنقضية)
        setIsAfterDeparture(true);
        const diff = now.getTime() - depDate.getTime();
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setCountdown(`${h}س ${m}د ${s}ث`);
      } else {
        setIsAfterDeparture(false);
        setCountdown('');
      }
    };
    calcCountdown();
    const interval = setInterval(calcCountdown, 1000);
    return () => clearInterval(interval);
  }, [trip.departureDate, (trip as any).estimatedDurationHours]);
  const { isProcessing, completeTrip, cancelTrip } = useTripActions();
  const t = useTranslations('carrier');

  const isCompleted = useMemo(() => {
    if (['Completed', 'Cancelled'].includes(trip.status)) return true;
    const depDate = parseFirestoreDate(trip.departureDate);
    const durationHours = (trip as any).estimatedDurationHours || 0;
    const endDate = new Date(depDate.getTime() + durationHours * 60 * 60 * 1000);
    return endDate < new Date();
  }, [trip.status, trip.departureDate, (trip as any).estimatedDurationHours]);

  const isDeparted = useMemo(() => {
    const depDate = parseFirestoreDate(trip.departureDate);
    return depDate < new Date();
  }, [trip.departureDate]);

  // ✅ تحديث تلقائي للحالة إلى In-Transit لما وقت الانطلاق يعدي
  useEffect(() => {
    if (!firestore || !isDeparted || trip.status !== 'Planned') return;
    updateDoc(doc(firestore, 'trips', trip.id), {
      status: 'In-Transit',
      updatedAt: serverTimestamp(),
    }).catch(() => { });
  }, [firestore, isDeparted, trip.id, trip.status]);

  const isThisProcessing = isProcessing?.endsWith(trip.id);
  const capacity = carrierProfile?.vehicleCapacity || (trip as any).vehicleCapacity || 0;
  const available = trip.availableSeats ?? 0;
  // ✅ المقاعد المحجوزة = الطاقة - المتاح (بس بعد تأكيد الناقل فقط)
  // availableSeats بيتخصم بس بعد confirm-booking، يعني الرقم ده صح
  const booked = Math.max(0, capacity - available);
  const fillPct = capacity > 0 ? Math.min(100, (booked / capacity) * 100) : 0;
  const isFull = available <= 0;
  const hasBookings = trip.bookingIds && trip.bookingIds.length > 0;
  const carrierId = user?.uid || '';

  return (
    <>
      <Card className={cn(
        "relative overflow-hidden border-2 shadow-md transition-all duration-300",
        isCompleted
          ? "border-gray-500/40 opacity-60 pointer-events-none"
          : "border-blue-400 hover:border-yellow-300 hover:shadow-[0_0_12px_2px_rgba(234,179,8,0.35)]"
      )}>
        {isCompleted && (
          <div className="absolute inset-0 bg-black/40 z-50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {t('endTrip')}
            </span>
          </div>
        )}
        {/* ── Countdown Banner ── */}
        {countdown && (
          <div className={`flex items-center justify-center gap-2 py-2 px-4 text-xs font-bold border-b ${isAfterDeparture
            ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
            : 'bg-amber-500/15 border-amber-500/25 text-amber-300'
            }`}>
            {isAfterDeparture ? (
              <>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>في الطريق منذ: {countdown}</span>
              </>
            ) : (
              <>
                <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>ينطلق بعد: {countdown}</span>
              </>
            )}
          </div>
        )}
        <div className="p-4 text-white bg-[#200a0f89] border-b border-b-amber-200/30">
          <div className="flex justify-between items-start ">
            <h2 className="text-lg font-bold">
              {getCityName(trip.origin, locale)}<span className="mx-2 font-light opacity-70">←</span>{getCityName(trip.destination, locale)}
            </h2>
            <Badge variant="outline" className="text-white border-white/40 text-[10px]">
              {trip.status === 'Planned' ? t('scheduled') : trip.status === 'In-Transit' ? t('inTheWay') : trip.status}
            </Badge>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3 text-center">
            <div className="bg-white/10 rounded-lg p-2">
              <p className="text-[10px] opacity-70">{t('flightNumber')}</p>
              <p className="font-mono font-bold text-sm">{trip.id.slice(-6).toUpperCase()}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-2">
              <p className="text-[10px] opacity-70">{t('departureTime')}</p>
              <p className="font-bold text-sm">{formatDate(trip.departureDate, 'hh:mm a', locale)}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-2">
              <p className="text-[10px] opacity-70">{t('date')}</p>
              <p className="font-bold text-sm">{formatDate(trip.departureDate, 'dd/MM/yyyy', locale)}</p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4 bg-[#200a0f89]">
          <div className="h-3 w-full bg-secondary/50 rounded-full overflow-hidden border border-border/50">
            <div className={cn("h-full transition-all duration-500", isFull ? "bg-red-500" : fillPct > 80 ? "bg-orange-500" : "bg-emerald-500")}
              style={{ width: `${fillPct}%` }} />
          </div>

          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold">
              {isFull ? `🚫 ${t('flightFull')}` : `🪑 ${t('emptySeats')} : ${available}`}
            </h3>
            {!isFull && (
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 border-primary/40 text-primary hover:bg-primary/10 text-xs"
                onClick={() => setDirectBookingOpen(true)}
                disabled={isCompleted || !!isThisProcessing || isDeparted}
                title={isDeparted ? t('takeOffTime') : ''}
              >
                <UserPlus className="h-3.5 w-3.5" /> {t('bookedYourClients')}
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex gap-1 items-center">
              <UserCircle className="size-4 text-primary" />
              <h3 className="text-sm font-bold">{t('clientRequests')}</h3>
            </div>
            <DirectOpportunities trip={trip} carrierId={carrierId} />
          </div>

          <div className="space-y-2">
            <div className="flex gap-1 items-center">
              <Store className="size-4 text-amber-500" />
              <h3 className="text-sm font-bold">{t('requestsMarket')}</h3>
            </div>
            <GeneralOpportunities trip={trip} carrierId={carrierId} />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />{t('reservedSeats')} ({booked})
            </h3>
            <TripPassengers trip={trip} />
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm pt-1 border-t">
            <div><p className="text-xs text-muted-foreground">{t('price')}</p><p className="font-semibold">{trip.price} {trip.currency}</p></div>
            <div><p className="text-xs text-muted-foreground">{t('meetingPoint')}</p><p className="font-semibold text-xs truncate">{trip.meetingPoint || '—'}</p></div>
          </div>

          {/* {trip.status === 'In-Transit' ? (
            <Button size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white gap-2" onClick={() => completeTrip(trip)} disabled={!!isThisProcessing}>
              {isThisProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />} {t('endTrip')}
            </Button>
          ) :
           ( */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => setManifestOpen(true)} disabled={!!isThisProcessing}>
              <User className="h-4 w-4" /> {t('Statement')}
            </Button>
            <Button variant="outline" size="icon" className="h-9 w-9 bg-[#1C080D] border-0 text-emerald-400 hover:bg-[#38121F]" onClick={() => setChatOpen(true)} title="جروب الرحلة">
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-9 w-9",
                isDeparted ? "text-muted-foreground opacity-40 cursor-not-allowed" : "text-blue-600 hover:bg-blue-600/10"
              )}
              onClick={() => !isDeparted && onEdit(trip)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-destructive hover:bg-[#38121F] h-9 w-9"
              onClick={() => hasBookings ? setShowBlockingAlert(true) : setCancelOpen(true)}
            // disabled={isCompleted || !!isThisProcessing || !!hasBookings || isDeparted}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            {/* <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-orange-500 hover:bg-orange-500/10"
              onClick={() => onTransfer && onTransfer(trip)}
              title="نقل الرحلة لناقل آخر"
            >
              <ArrowRight className="h-4 w-4" />
            </Button> */}
          </div>
          {/* )} */}
        </div>
      </Card>

      <DirectBookingDialog trip={trip} isOpen={directBookingOpen} onClose={() => setDirectBookingOpen(false)} />
      <ChatDialog isOpen={chatOpen} onOpenChange={setChatOpen} trip={trip} />
      <TripManifestDialog tripId={manifestOpen ? trip.id : null} trip={manifestOpen ? trip : null} open={manifestOpen} onOpenChange={setManifestOpen} />

      <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('confirmCancelTitle')}</AlertDialogTitle>
            <AlertDialogDescription>{t('confirmCancelDesc')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('goBack')}</AlertDialogCancel>
            <AlertDialogAction onClick={() => { cancelTrip(trip); setCancelOpen(false); }} className="bg-destructive">{t('cancelTrip')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showBlockingAlert} onOpenChange={setShowBlockingAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive"><AlertTriangle className="h-5 w-5" /> {t('sovereignLawTitle')}</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2 pt-2">
              <p className="font-bold text-foreground">{t('cannotCancelBooked')}</p>
              <p className="text-sm text-muted-foreground">{t('sovereignDesc')}</p>
              <p className="text-sm text-muted-foreground">يجب اولا نقل الركاب الي ناقل اخر قبل حذف الرحله</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <div className="flex gap-2 items-center">
              <Button
                variant="ghost"
                // size="icon"
                className="h-9 w-full bg-[#BFAF78] text-black hover:bg-orange-500/10"
                onClick={() => onTransfer && onTransfer(trip)}
                title="نقل الرحلة لناقل آخر"
              >

                {/* <ArrowRight className="h-4 w-4" /> */}
                البحث علي ناقل اخر
              </Button>
              <AlertDialogCancel>{t('understood')}</AlertDialogCancel>

            </div>

          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
// ── Main Export ────────────────────────────────────────────────────
export function MyTripsList({ trips, isLoading, onEdit, carrierProfile, onTransfer }: MyTripsListProps) {
  const t = useTranslations('myTripsList');
  if (isLoading) return <div className="text-center py-10 text-muted-foreground">جاري التحميل...</div>;
  if (!trips?.length) return <div className="text-center py-16 border-2 border-dashed rounded-lg bg-card col-span-full"><Route className="mx-auto h-12 w-12 opacity-20 mb-4" /><p className="font-bold">{t('emptyTitle')}</p></div>;
  return <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{trips.map(trip => <TripCard key={trip.id} trip={trip} onEdit={onEdit} carrierProfile={carrierProfile} onTransfer={onTransfer} />)}</div>;
}