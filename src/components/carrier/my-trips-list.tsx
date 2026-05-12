// // // 'use client';

// // // import { useEffect, useMemo, useState } from 'react';
// // // import { Button } from '@/components/ui/button';
// // // import { Input } from '@/components/ui/input';
// // // import { Label } from '@/components/ui/label';
// // // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// // // import { Edit, Trash2, Loader2, CheckCircle2, AlertTriangle, User, Route, UserPlus, Ban, UserCircle, Store, Star } from 'lucide-react';
// // // import type { Trip, Booking, UserProfile } from '@/lib/data';
// // // import {
// // //   AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
// // //   AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
// // // } from '@/components/ui/alert-dialog';
// // // import {
// // //   Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
// // // } from '@/components/ui/dialog';
// // // import { TripManifestDialog } from './trip-manifest-dialog';
// // // import { useTripActions } from '@/hooks/use-trip-actions';
// // // import { useFirestore, useUser, useCollection, useMemoFirebase, useDoc } from '@/firebase';
// // // import { collection, query, where, addDoc, updateDoc, doc, serverTimestamp, increment, orderBy, limit, getDoc } from 'firebase/firestore';
// // // import { getCityName } from '@/lib/constants';
// // // import { formatDate } from '@/lib/formatters';
// // // import { useLocale, useTranslations } from 'next-intl';
// // // import { cn } from '@/lib/utils';
// // // import { Badge } from '@/components/ui/badge';
// // // import { Card } from '@/components/ui/card';
// // // import { useToast } from '@/hooks/use-toast';
// // // import { useOfferDialog } from '@/hooks/use-offer-dialog';
// // // import { OfferDialog } from './offer-dialog';

// // // interface MyTripsListProps {
// // //   trips: Trip[];
// // //   isLoading: boolean;
// // //   onEdit: (trip: Trip) => void;
// // //   carrierProfile: UserProfile | null;
// // // }

// // // // ── Direct Booking Dialog ──────────────────────────────────────────
// // // function DirectBookingDialog({ trip, isOpen, onClose }: { trip: Trip; isOpen: boolean; onClose: () => void }) {
// // //   const locale = useLocale();
// // //   const t = useTranslations('carrier');
// // //   const firestore = useFirestore();
// // //   const { user } = useUser();
// // //   const { toast } = useToast();
// // //   const [loading, setLoading] = useState(false);
// // //   const [form, setForm] = useState({ name: '', nationality: '', documentNumber: '', type: 'adult' as 'adult' | 'minor' | 'infant', seats: 1 });

// // //   const handleSubmit = async () => {
// // //     if (!firestore || !user) return;
// // //     const depDate = (trip.departureDate as any)?.toDate?.()
// // //       ? (trip.departureDate as any).toDate()
// // //       : new Date(trip.departureDate);
// // //     if (depDate < new Date()) {
// // //       toast({ variant: 'destructive', title: t('timeExpired'), description: t('timeExpiredDesc') });
// // //       return;
// // //     }

// // //     if (!form.name.trim() || !form.nationality.trim() || !form.documentNumber.trim()) {
// // //       toast({ variant: 'destructive', title: t('fillAllFields') });
// // //       return;
// // //     }
// // //     if (form.seats > (trip.availableSeats || 0)) {
// // //       toast({ variant: 'destructive', title: t('seatsExceeded') });
// // //       return;
// // //     }
// // //     setLoading(true);
// // //     try {
// // //       const bookingRef = await addDoc(collection(firestore, 'bookings'), {
// // //         tripId: trip.id, carrierId: user.uid, userId: user.uid, bookedByCarrier: true,
// // //         seats: form.seats, passengersDetails: [{ name: form.name.trim(), nationality: form.nationality.trim(), documentNumber: form.documentNumber.trim(), type: form.type }],
// // //         status: 'Confirmed', totalPrice: (trip.price || 0) * form.seats, currency: trip.currency,
// // //         createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
// // //       });
// // //       await updateDoc(doc(firestore, 'trips', trip.id), {
// // //         availableSeats: increment(-form.seats),
// // //         bookingIds: [...(trip.bookingIds || []), bookingRef.id],
// // //         updatedAt: serverTimestamp(),
// // //       });
// // //       toast({ title: t('bookingSuccess') });
// // //       onClose();
// // //       setForm({ name: '', nationality: '', documentNumber: '', type: 'adult', seats: 1 });
// // //     } catch (e: any) {
// // //       toast({ variant: 'destructive', title: t('bookingFailed'), description: e?.message });
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   return (
// // //     <Dialog open={isOpen} onOpenChange={(o) => !loading && !o && onClose()}>
// // //       <DialogContent className="sm:max-w-md">
// // //         <DialogHeader>
// // //           <DialogTitle className="flex items-center gap-2"><UserPlus className="h-5 w-5 text-primary" />{t('directBookingTitle')}</DialogTitle>
// // //           <DialogDescription>
// // //             {getCityName(trip.origin, locale)} {locale === 'ar' ? '←' : '→'} {getCityName(trip.destination, locale)} | {t('available')}: {trip.availableSeats} {t('seat')}
// // //           </DialogDescription>
// // //         </DialogHeader>
// // //         <div className="space-y-4 py-2">
// // //           <div className="space-y-2">
// // //             <Label>{t('fullName')}<span className="text-destructive">*</span></Label>
// // //             <Input placeholder={t('passengerName')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} disabled={loading} />
// // //           </div>
// // //           <div className="grid grid-cols-2 gap-3">
// // //             <div className="space-y-2">
// // //               <Label>{t('nationality')}<span className="text-destructive">*</span></Label>
// // //               <Input placeholder={t('nationalityPlaceholder')} value={form.nationality} onChange={(e) => setForm({ ...form, nationality: e.target.value })} disabled={loading} />
// // //             </div>
// // //             <div className="space-y-2">
// // //               <Label>{t('docNumber')}<span className="text-destructive">*</span></Label>
// // //               <Input placeholder={t('docPlaceholder')} value={form.documentNumber} onChange={(e) => setForm({ ...form, documentNumber: e.target.value })} disabled={loading} className="font-mono" />
// // //             </div>
// // //           </div>
// // //           <div className="grid grid-cols-2 gap-3">
// // //             <div className="space-y-2">
// // //               <Label> {t('passengerType')}</Label>
// // //               <Select value={form.type} onValueChange={(v: any) => setForm({ ...form, type: v })}>
// // //                 <SelectTrigger><SelectValue /></SelectTrigger>
// // //                 <SelectContent>
// // //                   <SelectItem value="adult">{t('adult')}</SelectItem>
// // //                   <SelectItem value="minor">{t('minor')}</SelectItem>
// // //                   <SelectItem value="infant">{t('infant')}</SelectItem>
// // //                 </SelectContent>
// // //               </Select>
// // //             </div>
// // //             <div className="space-y-2">
// // //               <Label>{t('seatsCount')}</Label>
// // //               <Select value={String(form.seats)} onValueChange={(v) => setForm({ ...form, seats: Number(v) })}>
// // //                 <SelectTrigger><SelectValue /></SelectTrigger>
// // //                 <SelectContent>
// // //                   {Array.from({ length: trip.availableSeats || 1 }, (_, i) => i + 1).map(n => (
// // //                     <SelectItem key={n} value={String(n)}>{n}</SelectItem>
// // //                   ))}
// // //                 </SelectContent>
// // //               </Select>
// // //             </div>
// // //           </div>
// // //           <div className="bg-muted/40 rounded-lg p-3 text-sm">
// // //             <div className="flex justify-between">
// // //               <span className="text-muted-foreground">{t('total')}</span>
// // //               <span className="font-bold">{((trip.price || 0) * form.seats).toFixed(2)} {trip.currency}</span>
// // //             </div>
// // //           </div>
// // //         </div>
// // //         <DialogFooter className="gap-2">
// // //           <Button variant="secondary" onClick={onClose} disabled={loading}>{t('cancel')}</Button>
// // //           <Button onClick={handleSubmit} disabled={loading}>
// // //             {loading ? <><Loader2 className="h-4 w-4 animate-spin ml-2" />{t('bookingInProgress')}</> : <><UserPlus className="h-4 w-4 ml-2" /> {t('confirmBooking')}</>}
// // //           </Button>
// // //         </DialogFooter>
// // //       </DialogContent>
// // //     </Dialog>
// // //   );
// // // }

// // // // ── Passengers List ────────────────────────────────────────────────
// // // // ── مكوّن مصغّر: يجلب profile المسافر للحجوزات التي passengersDetails فيها فارغة ──
// // // function BookingPassengerRow({
// // //   booking,
// // //   index,
// // //   isSelected,
// // //   onToggle,
// // //   onCancel,
// // //   t,
// // // }: {
// // //   booking: any;
// // //   index: number;
// // //   isSelected: boolean;
// // //   onToggle: () => void;
// // //   onCancel: (bookingId: string) => void;
// // //   t: (key: string) => string;
// // // }) {
// // //   const firestore = useFirestore();
// // //   const [travelerProfile, setTravelerProfile] = useState<any>(null);

// // //   // جلب بيانات المسافر من الـ profile لو passengersDetails فارغة
// // //   const details = booking.passengersDetails;
// // //   const detailsArray = Array.isArray(details)
// // //     ? details
// // //     : details && typeof details === 'object'
// // //       ? [details]
// // //       : [];
// // //   const hasPassengerDetails = detailsArray.length > 0 && (detailsArray[0]?.name || detailsArray[0]?.passengerName);

// // //   useEffect(() => {
// // //     if (hasPassengerDetails || !firestore || !booking.userId) return;
// // //     getDoc(doc(firestore, 'users', booking.userId))
// // //       .then(snap => { if (snap.exists()) setTravelerProfile(snap.data()); })
// // //       .catch(() => { });
// // //   }, [firestore, booking.userId, hasPassengerDetails]);

// // //   // بيانات العرض النهائية
// // //   const displayPassengers = hasPassengerDetails
// // //     ? detailsArray.map((p: any) => ({
// // //       name: p.name || p.passengerName || '',
// // //       nationality: p.nationality || '',
// // //       documentNumber: p.documentNumber || p.documentId || '',
// // //       type: p.type || p.passengerType || 'adult',
// // //       phone: p.phone || p.passengerPhone || '',
// // //     }))
// // //     : [{
// // //       name: travelerProfile
// // //         ? [travelerProfile.firstName, travelerProfile.lastName].filter(Boolean).join(' ') || travelerProfile.fullName || travelerProfile.displayName || ''
// // //         : '',
// // //       nationality: travelerProfile?.nationality || '',
// // //       documentNumber: '',
// // //       type: 'adult',
// // //       phone: travelerProfile
// // //         ? (travelerProfile.phoneCountryCode ? `+${travelerProfile.phoneCountryCode}` : '') + (travelerProfile.phoneNumber || '')
// // //         : '',
// // //     }];

// // //   return (
// // //     <>
// // //       {displayPassengers.map((p, pIdx) => {
// // //         const globalIdx = `${index}-${pIdx}`;
// // //         return (
// // //           <div key={globalIdx}>
// // //             <button
// // //               onClick={onToggle}
// // //               className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-muted/30 border hover:bg-muted/60 transition-colors text-sm"
// // //             >
// // //               <span className="flex items-center gap-2">
// // //                 <span className="font-mono text-xs text-muted-foreground">#{index + 1}</span>
// // //                 <span className="font-semibold">{p.name || (travelerProfile === null && !hasPassengerDetails ? '...' : t('traveler'))}</span>
// // //                 {p.phone && (
// // //                   <a href={`tel:${p.phone}`} onClick={e => e.stopPropagation()} className="font-mono text-[11px] text-emerald-400 hover:text-emerald-300" dir="ltr">{p.phone}</a>
// // //                 )}
// // //               </span>
// // //               <Badge
// // //                 variant={booking.status === 'Confirmed' ? 'default' : booking.status === 'Pending-Payment-Verification' ? 'default' : 'secondary'}
// // //                 className={`text-[10px] ${booking.status === 'Pending-Payment-Verification' ? 'bg-blue-500 text-white' : ''}`}
// // //               >
// // //                 {booking.status === 'Confirmed' ? t('confirmed') :
// // //                   booking.status === 'Pending-Carrier-Confirmation' ? t('pendingConfirm') :
// // //                     booking.status === 'Pending-Payment-Verification' ? t('pendingVerification') : t('pendingPayment')}
// // //               </Badge>
// // //             </button>
// // //             {isSelected && (
// // //               <div className="bg-muted/20 border border-t-0 rounded-b-lg px-3 py-2 space-y-2 text-sm animate-in fade-in duration-150">
// // //                 <div className="flex justify-between">
// // //                   <span className="text-muted-foreground">{t('seatsNum')}</span>
// // //                   <span className="font-semibold">{booking.seats}</span>
// // //                 </div>
// // //                 {p.nationality && (
// // //                   <div className="flex justify-between">
// // //                     <span className="text-muted-foreground">{t('nationality')}</span>
// // //                     <span className="font-semibold">{p.nationality}</span>
// // //                   </div>
// // //                 )}
// // //                 {p.documentNumber && (
// // //                   <div className="flex justify-between">
// // //                     <span className="text-muted-foreground">{t('docNumber')}</span>
// // //                     <span className="font-mono font-semibold">{p.documentNumber}</span>
// // //                   </div>
// // //                 )}
// // //                 <div className="flex justify-between">
// // //                   <span className="text-muted-foreground">{t('docType')}</span>
// // //                   <span className="font-semibold">
// // //                     {p.type === 'adult' ? t('adult') : p.type === 'minor' ? t('minor') : t('infant')}
// // //                   </span>
// // //                 </div>
// // //                 {p.phone && (
// // //                   <div className="flex justify-between items-center">
// // //                     <span className="text-muted-foreground">رقم الهاتف</span>
// // //                     <a href={`tel:${p.phone}`} className="font-mono font-semibold text-emerald-400 hover:text-emerald-300 transition-colors" dir="ltr">{p.phone}</a>
// // //                   </div>
// // //                 )}
// // //                 {booking.bookedByCarrier && (
// // //                   <Button variant="destructive" size="sm" className="w-full gap-2 mt-1"
// // //                     onClick={() => onCancel(booking.id)}>
// // //                     <Ban className="h-3.5 w-3.5" /> {t('cancelBooking')}
// // //                   </Button>
// // //                 )}
// // //               </div>
// // //             )}
// // //           </div>
// // //         );
// // //       })}
// // //     </>
// // //   );
// // // }

// // // function TripPassengers({ trip }: { trip: Trip }) {
// // //   const firestore = useFirestore();
// // //   const { toast } = useToast();
// // //   const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
// // //   const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);
// // //   const [loadingCancel, setLoadingCancel] = useState(false);
// // //   const t = useTranslations('carrier')
// // //   const bookingsQuery1 = useMemoFirebase(() => {
// // //     if (!firestore || !trip.id) return null;
// // //     return query(
// // //       collection(firestore, 'bookings'),
// // //       where('tripId', '==', trip.id),
// // //       where('status', 'in', ['Confirmed', 'Pending-Carrier-Confirmation', 'Pending-Payment', 'Pending-Payment-Verification'])
// // //     );
// // //   }, [firestore, trip.id]);

// // //   const bookingsQuery2 = useMemoFirebase(() => {
// // //     if (!firestore || !trip.id) return null;
// // //     return query(
// // //       collection(firestore, 'bookings'),
// // //       where('carrierTripId', '==', trip.id),
// // //       where('status', 'in', ['Confirmed', 'Pending-Carrier-Confirmation', 'Pending-Payment', 'Pending-Payment-Verification'])
// // //     );
// // //   }, [firestore, trip.id]);

// // //   const { data: bookings1 } = useCollection<Booking>(bookingsQuery1);
// // //   const { data: bookings2 } = useCollection<Booking>(bookingsQuery2);

// // //   const bookings = useMemo(() => {
// // //     const all = [...(bookings1 || []), ...(bookings2 || [])];
// // //     const seen = new Set<string>();
// // //     return all.filter(b => {
// // //       if (seen.has(b.id)) return false;
// // //       seen.add(b.id);
// // //       return true;
// // //     });
// // //   }, [bookings1, bookings2]);

// // //   const handleCancelBooking = async () => {
// // //     if (!firestore || !cancellingBookingId) return;
// // //     setLoadingCancel(true);
// // //     try {
// // //       const booking = bookings.find(b => b.id === cancellingBookingId);
// // //       if (!booking) return;
// // //       await updateDoc(doc(firestore, 'bookings', cancellingBookingId), {
// // //         status: 'Cancelled', cancelledBy: 'carrier',
// // //         cancelledAt: serverTimestamp(), updatedAt: serverTimestamp()
// // //       });
// // //       await updateDoc(doc(firestore, 'trips', trip.id), {
// // //         availableSeats: increment(booking.seats), updatedAt: serverTimestamp()
// // //       });
// // //       if (booking.userId) {
// // //         await addDoc(collection(firestore, 'notifications'), {
// // //           userId: booking.userId, title: t('cancelledNotif'),
// // //           message: t('cancelledByCarrier'), type: 'trip_update',
// // //           isRead: false, createdAt: serverTimestamp()
// // //         });
// // //       }
// // //       toast({ title: t('cancelSuccess') });
// // //       setCancellingBookingId(null);
// // //       setSelectedIndex(null);
// // //     } catch {
// // //       toast({ variant: 'destructive', title: t('cancelFailed') });
// // //     } finally {
// // //       setLoadingCancel(false);
// // //     }
// // //   };

// // //   if (bookings.length === 0) return (
// // //     <p className="text-xs text-muted-foreground text-center py-2">{t('noSeatsYet')}</p>
// // //   );

// // //   return (
// // //     <>
// // //       <div className="space-y-2">
// // //         {bookings.map((b, i) => (
// // //           <BookingPassengerRow
// // //             key={b.id}
// // //             booking={b}
// // //             index={i}
// // //             isSelected={selectedIndex === i}
// // //             onToggle={() => setSelectedIndex(selectedIndex === i ? null : i)}
// // //             onCancel={setCancellingBookingId}
// // //             t={t}
// // //           />
// // //         ))}
// // //       </div>

// // //       <AlertDialog open={!!cancellingBookingId} onOpenChange={(o) => !o && setCancellingBookingId(null)}>
// // //         <AlertDialogContent>
// // //           <AlertDialogHeader>
// // //             <AlertDialogTitle className="text-destructive flex items-center gap-2">
// // //               <AlertTriangle className="h-5 w-5" /> {t('confirmCancelTitle')}
// // //             </AlertDialogTitle>
// // //             <AlertDialogDescription>
// // //               {t('confirmCancelDesc')}
// // //             </AlertDialogDescription>
// // //           </AlertDialogHeader>
// // //           <AlertDialogFooter>
// // //             <AlertDialogCancel disabled={loadingCancel}>{t('goBack')}</AlertDialogCancel>
// // //             <AlertDialogAction onClick={handleCancelBooking} disabled={loadingCancel}
// // //               className="bg-destructive">
// // //               {loadingCancel ? <Loader2 className="h-4 w-4 animate-spin" /> : t('confirmCancelTitle')}
// // //             </AlertDialogAction>
// // //           </AlertDialogFooter>
// // //         </AlertDialogContent>
// // //       </AlertDialog>
// // //     </>
// // //   );
// // // }

// // // // ── صف طلب واحد ──
// // // function OpportunityRow({ opportunity, carrierId, isOpen, onToggle, onOffer }: {
// // //   opportunity: Trip; carrierId: string; isOpen: boolean; onToggle: () => void; onOffer: (passengerIntentId: string) => void;
// // // }): JSX.Element {  // ✅ أضف return type
// // //   const firestore = useFirestore();
// // //   const t = useTranslations('carrier');
// // //   const [traveler, setTraveler] = useState<UserProfile | null>(null);

// // //   // ✅ جيب بيانات المسافر فوراً بدون ما تنتظر الفتح
// // //   useEffect(() => {
// // //     if (!firestore || !opportunity.userId || traveler) return;
// // //     const fetchTraveler = async () => {
// // //       try {
// // //         const userDoc = await getDoc(doc(firestore, 'users', opportunity.userId));
// // //         if (userDoc.exists()) {
// // //           setTraveler({ id: userDoc.id, ...userDoc.data() } as UserProfile);
// // //         }
// // //       } catch (e) {
// // //         console.error('Failed to fetch traveler:', e);
// // //       }
// // //     };
// // //     fetchTraveler();
// // //   }, [firestore, opportunity.userId]);

// // //   const isDirectRequest = opportunity.requestType === 'Direct' && opportunity.targetCarrierId === carrierId;

// // //   return (  // ✅ تأكد إن return موجودة
// // //     <div>
// // //       <button onClick={onToggle}
// // //         className={cn(
// // //           "w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-colors text-sm",
// // //           isDirectRequest
// // //             ? "bg-primary/10 border-primary/30 hover:bg-primary/20"
// // //             : "bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20"
// // //         )}>
// // //         <span className="flex items-center gap-2 flex-wrap">
// // //           <UserCircle className={cn("h-4 w-4 shrink-0", isDirectRequest ? "text-primary" : "text-amber-500",
// // //             opportunity.creatorRole === 'agent' ? "text-blue-400" : ""
// // //           )} />
// // //           {opportunity.creatorRole === 'agent' ? (
// // //             <span className="font-semibold text-blue-400">{opportunity.agentName || 'وكيل'}</span>
// // //           ) : (
// // //             <span className="font-semibold">{traveler?.firstName || t('traveler')}</span>
// // //           )}
// // //           <span className="text-xs text-muted-foreground">• {typeof opportunity.passengers === 'number' ? opportunity.passengers : ''} {t('seat')}</span>
// // //           {opportunity.creatorRole === 'agent' && opportunity.agentFee ? (
// // //             <span className="text-[10px] font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
// // //               عمولة: {opportunity.agentFee} {opportunity.currency || 'JOD'}
// // //             </span>
// // //           ) : null}
// // //         </span>
// // //         <div className="flex items-center gap-2">
// // //           {opportunity.creatorRole === 'agent' && (
// // //             <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-[10px] gap-1">🤝 وكيل</Badge>
// // //           )}
// // //           {isDirectRequest && (
// // //             <Badge className="bg-primary text-[10px] gap-1"><Star className="h-3 w-3" /> {t('customRequest')}</Badge>
// // //           )}
// // //         </div>
// // //       </button>

// // //       {isOpen && (
// // //         <div className="bg-muted/20 border border-t-0 rounded-b-lg px-3 py-3 space-y-2 text-sm animate-in fade-in duration-150">
// // //           <div className="flex justify-between">
// // //             <span className="text-muted-foreground">{t('travelerName')}</span>
// // //             <span className="font-semibold">
// // //               {[traveler?.firstName, traveler?.lastName].filter(Boolean).join(' ') || t('traveler')}
// // //             </span>
// // //           </div>
// // //           {(traveler?.phoneNumber) && (
// // //             <div className="flex justify-between">
// // //               <span className="text-muted-foreground">{t('phoneTrev')}</span>
// // //               <span className="font-semibold font-mono" dir="ltr">
// // //                 {traveler.phoneCountryCode ? `+${traveler.phoneCountryCode}` : ''}{traveler.phoneNumber}
// // //               </span>
// // //             </div>
// // //           )}
// // //           <div className="flex justify-between">
// // //             <span className="text-muted-foreground">{t('seatsNum')}</span>
// // //             <span className="font-semibold">{typeof opportunity.passengers === 'number' ? opportunity.passengers : ''} {t('seat')}</span>
// // //           </div>
// // //           <div className="flex justify-between">
// // //             <span className="text-muted-foreground">{t('requestType')}</span>
// // //             <span className={cn("font-semibold", isDirectRequest ? "text-primary" : "text-amber-500")}>
// // //               {isDirectRequest ? t('directForYou') : t('generalMarket')}
// // //             </span>
// // //           </div>
// // //           {opportunity.creatorRole === 'agent' && (
// // //             <>
// // //               <div className="flex justify-between items-center bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-2">
// // //                 <span className="text-muted-foreground text-xs">الطلب من وكيل</span>
// // //                 <span className="font-black text-blue-400 text-sm">{opportunity.agentName || 'وكيل'}</span>
// // //               </div>
// // //               {opportunity.agentFee ? (
// // //                 <div className="flex justify-between items-center bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
// // //                   <span className="text-muted-foreground text-xs">العمولة المطلوبة</span>
// // //                   <span className="font-black text-amber-400 text-sm">{opportunity.agentFee} {opportunity.currency || 'JOD'}</span>
// // //                 </div>
// // //               ) : null}
// // //             </>
// // //           )}
// // //           {opportunity.notes && (
// // //             <div className="bg-muted/30 rounded p-2 text-xs text-muted-foreground">
// // //               {opportunity.notes}
// // //             </div>
// // //           )}
// // //           <Button size="sm" className="w-full mt-2" onClick={() => onOffer(opportunity.id)}>
// // //             {t('sendOffer')}
// // //           </Button>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // }
// // // // ── ✅ طلبات Direct — عميل طلب الناقل بالاسم ──
// // // function DirectOpportunities({ trip, carrierId }: { trip: Trip; carrierId: string }) {
// // //   const firestore = useFirestore();
// // //   const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
// // //   const [currentPassengerIntentId, setCurrentPassengerIntentId] = useState('');
// // //   const t = useTranslations('carrier')
// // //   // [PROTOCOL 16]: Clean Hook Consumption - AI Residue Purged
// // //   const { openOfferDialog, selectedTrip, isDialogOpen, setIsDialogOpen, handleSendOffer } = useOfferDialog();

// // //   const q = useMemoFirebase(() => {
// // //     if (!firestore) return null;
// // //     return query(
// // //       collection(firestore, 'trips'),
// // //       where('status', '==', 'Awaiting-Offers'),
// // //       where('origin', '==', trip.origin),
// // //       where('destination', '==', trip.destination),
// // //       limit(10)
// // //     );
// // //   }, [firestore, trip.origin, trip.destination, carrierId]);

// // //   const { data: opps } = useCollection<Trip>(q);

// // //   const filteredOpps = useMemo(() => {
// // //     if (!opps) return [];
// // //     return opps.filter(opp =>
// // //       opp.requestType === 'Direct' && opp.targetCarrierId === carrierId
// // //     );
// // //   }, [opps, carrierId]);

// // //   if (!filteredOpps || filteredOpps.length === 0) return (
// // //     <p className="text-xs text-muted-foreground text-center py-2">{t('noDirectOrders')}</p>
// // //   );

// // //   return (
// // //     <>
// // //       <div className="space-y-2">
// // //         {filteredOpps.map((opp, i) => (
// // //           <OpportunityRow key={opp.id} opportunity={opp} carrierId={carrierId}
// // //             isOpen={selectedIndex === i} onToggle={() => setSelectedIndex(selectedIndex === i ? null : i)}
// // //             onOffer={(passengerIntentId) => {
// // //               openOfferDialog(trip);
// // //               setCurrentPassengerIntentId(passengerIntentId);
// // //             }}
// // //           />
// // //         ))}
// // //       </div>
// // //       {selectedTrip && (
// // //         <OfferDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} trip={selectedTrip}
// // //           onSendOffer={(offerData) => handleSendOffer(offerData, currentPassengerIntentId)}
// // //         />
// // //       )}
// // //     </>
// // //   );
// // // }

// // // // ── ✅ طلبات General — طلبات عامة على نفس المسار ──
// // // function GeneralOpportunities({ trip, carrierId }: { trip: Trip; carrierId: string }) {
// // //   const firestore = useFirestore();
// // //   const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
// // //   const [currentPassengerIntentId, setCurrentPassengerIntentId] = useState('');
// // //   const t = useTranslations('carrier')
// // //   // [PROTOCOL 16]: Clean Hook Consumption - AI Residue Purged
// // //   const { openOfferDialog, selectedTrip, isDialogOpen, setIsDialogOpen, handleSendOffer } = useOfferDialog();

// // //   const q = useMemoFirebase(() => {
// // //     if (!firestore) return null;
// // //     return query(
// // //       collection(firestore, 'trips'),
// // //       where('status', '==', 'Awaiting-Offers'),
// // //       where('origin', '==', trip.origin),
// // //       where('destination', '==', trip.destination),
// // //       limit(10)
// // //     );
// // //   }, [firestore, trip.origin, trip.destination]);

// // //   const { data: opps } = useCollection<Trip>(q);

// // //   const filteredOpps = useMemo(() => {
// // //     if (!opps) return [];
// // //     return opps.filter(opp => opp.requestType === 'General');
// // //   }, [opps]);

// // //   if (!filteredOpps || filteredOpps.length === 0) return <p className="text-xs text-muted-foreground text-center py-2">{t('noGeneralOrders')}</p>;

// // //   return (
// // //     <>
// // //       <div className="space-y-2">
// // //         {filteredOpps.map((opp, i) => (
// // //           <OpportunityRow key={opp.id} opportunity={opp} carrierId={carrierId}
// // //             isOpen={selectedIndex === i} onToggle={() => setSelectedIndex(selectedIndex === i ? null : i)}
// // //             onOffer={(passengerIntentId) => {
// // //               openOfferDialog(trip);
// // //               setCurrentPassengerIntentId(passengerIntentId);
// // //             }}
// // //           />
// // //         ))}
// // //       </div>
// // //       {selectedTrip && (
// // //         <OfferDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} trip={selectedTrip}
// // //           onSendOffer={(offerData) => handleSendOffer(offerData, currentPassengerIntentId)}
// // //         />
// // //       )}
// // //     </>
// // //   );
// // // }

// // // // ── Single Trip Card ───────────────────────────────────────────────
// // // function TripCard({ trip, onEdit, carrierProfile }: { trip: Trip; onEdit: (trip: Trip) => void; carrierProfile: UserProfile | null }) {
// // //   const locale = useLocale();
// // //   const { user } = useUser();
// // //   const [manifestOpen, setManifestOpen] = useState(false);
// // //   const [cancelOpen, setCancelOpen] = useState(false);
// // //   const [showBlockingAlert, setShowBlockingAlert] = useState(false);
// // //   const [directBookingOpen, setDirectBookingOpen] = useState(false);
// // //   const { isProcessing, completeTrip, cancelTrip } = useTripActions();
// // //   const t = useTranslations('carrier')
// // //   const isCompleted = useMemo(() => {
// // //     if (['Completed', 'Cancelled'].includes(trip.status)) return true;
// // //     const depDate = (trip.departureDate as any)?.toDate?.()
// // //       ? (trip.departureDate as any).toDate()
// // //       : new Date(trip.departureDate || 0);
// // //     const durationHours = (trip as any).estimatedDurationHours || 0;
// // //     const endDate = new Date(depDate.getTime() + durationHours * 60 * 60 * 1000);
// // //     return endDate < new Date();
// // //   }, [trip.status, trip.departureDate, (trip as any).estimatedDurationHours]);

// // //   const isDeparted = useMemo(() => {
// // //     const depDate = (trip.departureDate as any)?.toDate?.()
// // //       ? (trip.departureDate as any).toDate()
// // //       : new Date(trip.departureDate);
// // //     return depDate < new Date();
// // //   }, [trip.departureDate]);

// // //   const isThisProcessing = isProcessing?.endsWith(trip.id);
// // //   const capacity = carrierProfile?.vehicleCapacity || (trip as any).vehicleCapacity || 0;
// // //   const available = trip.availableSeats ?? 0;
// // //   const booked = Math.max(0, capacity - available);
// // //   const fillPct = capacity > 0 ? Math.min(100, (booked / capacity) * 100) : 0;
// // //   const isFull = available <= 0;
// // //   const hasBookings = trip.bookingIds && trip.bookingIds.length > 0;
// // //   const carrierId = user?.uid || '';


// // //   {/* <Card className={cn(
// // //         "overflow-hidden border-2 shadow-md transition-all duration-300",
// // //         isCompleted
// // //           ? "border-gray-500/40"
// // //           : "border-blue-400 hover:border-yellow-300 hover:shadow-[0_0_12px_2px_rgba(234,179,8,0.35)]"
// // //       )}></Card> */}
// // //   return (
// // //     <>
// // //       <Card className={cn(
// // //         "relative overflow-hidden border-2 shadow-md transition-all duration-300",
// // //         isCompleted
// // //           ? "border-gray-500/40 opacity-60 pointer-events-none"
// // //           : "border-blue-400 hover:border-yellow-300 hover:shadow-[0_0_12px_2px_rgba(234,179,8,0.35)]"
// // //       )}>
// // //         {isCompleted && (
// // //           <div className="absolute inset-0 bg-black/40 z-50 flex items-center justify-center">
// // //             <span className="text-white font-bold text-lg">
// // //               {t('endTrip')}
// // //             </span>
// // //           </div>
// // //         )}
// // //         <div className="p-4 text-white bg-[#200a0f89] border-b border-b-amber-200/30">
// // //           <div className="flex justify-between items-start ">
// // //             <h2 className="text-lg font-bold">
// // //               {getCityName(trip.origin, locale)}<span className="mx-2 font-light opacity-70">←</span>{getCityName(trip.destination, locale)}
// // //             </h2>
// // //             <Badge variant="outline" className="text-white border-white/40 text-[10px]">
// // //               {trip.status === 'Planned' ? t('scheduled') : trip.status === 'In-Transit' ? t('inTheWay') : trip.status}
// // //             </Badge>
// // //           </div>
// // //           <div className="grid grid-cols-3 gap-2 mt-3 text-center">
// // //             <div className="bg-white/10 rounded-lg p-2">
// // //               <p className="text-[10px] opacity-70">{t('flightNumber')}</p>
// // //               <p className="font-mono font-bold text-sm">{trip.id.slice(-6).toUpperCase()}</p>
// // //             </div>
// // //             <div className="bg-white/10 rounded-lg p-2">
// // //               <p className="text-[10px] opacity-70">{t('departureTime')}</p>
// // //               <p className="font-bold text-sm">{formatDate(trip.departureDate, 'hh:mm a', locale)}</p>
// // //             </div>
// // //             <div className="bg-white/10 rounded-lg p-2">
// // //               <p className="text-[10px] opacity-70">{t('date')}</p>
// // //               <p className="font-bold text-sm">{formatDate(trip.departureDate, 'dd/MM/yyyy', locale)}</p>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         <div className="p-4 space-y-4 bg-[#200a0f89]">
// // //           <div className="h-3 w-full bg-secondary/50 rounded-full overflow-hidden border border-border/50">
// // //             <div className={cn("h-full transition-all duration-500", isFull ? "bg-red-500" : fillPct > 80 ? "bg-orange-500" : "bg-emerald-500")}
// // //               style={{ width: `${fillPct}%` }} />
// // //           </div>

// // //           <div className="flex items-center justify-between">
// // //             {/* <h3 className="text-sm font-bold">{isFull ? '🚫 '+{t('flightFull')} : `🪑{t('emptySeats')} : ${available}`}</h3> */}
// // //             <h3 className="text-sm font-bold">
// // //               {isFull ? `🚫 ${t('flightFull')}` : `🪑 ${t('emptySeats')} : ${available}`}
// // //             </h3>
// // //             {!isFull && (
// // //               <Button
// // //                 size="sm"
// // //                 variant="outline"
// // //                 className="gap-1.5 border-primary/40 text-primary hover:bg-primary/10 text-xs"
// // //                 onClick={() => setDirectBookingOpen(true)}
// // //                 // disabled={isDeparted}
// // //                 disabled={isCompleted || !!isThisProcessing}
// // //                 title={isDeparted ? t('takeOffTime') : ''}
// // //               >
// // //                 <UserPlus className="h-3.5 w-3.5" /> {t('bookedYourClients')}
// // //               </Button>
// // //             )}
// // //           </div>

// // //           <div className="space-y-2">
// // //             <div className="flex gap-1 items-center">
// // //               <UserCircle className="size-4 text-primary" />
// // //               <h3 className="text-sm font-bold">{t('clientRequests')}</h3>
// // //             </div>
// // //             <DirectOpportunities trip={trip} carrierId={carrierId} />
// // //           </div>

// // //           <div className="space-y-2">
// // //             <div className="flex gap-1 items-center">
// // //               <Store className="size-4 text-amber-500" />
// // //               <h3 className="text-sm font-bold">{t('requestsMarket')}</h3>
// // //             </div>
// // //             <GeneralOpportunities trip={trip} carrierId={carrierId} />
// // //           </div>
// // //           {/* <div className="space-y-2">
// // //             <div className="flex gap-1 items-center">
// // //               <Store className="size-4 text-amber-500" />
// // //               <h3 className="text-sm font-bold">طلبات من الوكلاء</h3>
// // //             </div>
// // //             <GeneralOpportunities trip={trip} carrierId={carrierId} />
// // //           </div> */}

// // //           <div className="space-y-2">
// // //             <h3 className="text-sm font-bold flex items-center gap-2">
// // //               <User className="h-4 w-4 text-primary" />{t('reservedSeats')} ({booked})
// // //             </h3>
// // //             <TripPassengers trip={trip} />
// // //           </div>

// // //           <div className="grid grid-cols-2 gap-3 text-sm pt-1 border-t">
// // //             <div><p className="text-xs text-muted-foreground">{t('price')}</p><p className="font-semibold">{trip.price} {trip.currency}</p></div>
// // //             <div><p className="text-xs text-muted-foreground">{t('meetingPoint')}</p><p className="font-semibold text-xs truncate">{trip.meetingPoint || '—'}</p></div>
// // //           </div>

// // //           {trip.status === 'In-Transit' ? (
// // //             <Button size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white gap-2" onClick={() => completeTrip(trip)} disabled={!!isThisProcessing}>
// // //               {isThisProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />} إنهاء الرحلة
// // //             </Button>
// // //           ) : (
// // //             <div className="flex gap-2">
// // //               <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => setManifestOpen(true)} disabled={!!isThisProcessing}>
// // //                 <User className="h-4 w-4" /> {t('Statement')}
// // //               </Button>
// // //               <Button variant="ghost" size="icon"
// // //                 className={cn("h-9 w-9", hasBookings ? "text-muted-foreground opacity-40 cursor-not-allowed" : "text-blue-600")}
// // //                 onClick={() => !hasBookings && onEdit(trip)}
// // //                 //  disabled={!!isThisProcessing || !!hasBookings}
// // //                 disabled={isCompleted || !!isThisProcessing || !!hasBookings}

// // //               >
// // //                 <Edit className="h-4 w-4" />
// // //               </Button>
// // //               <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 h-9 w-9"
// // //                 onClick={() => hasBookings ? setShowBlockingAlert(true) : setCancelOpen(true)}
// // //                 // disabled={!!isThisProcessing || !!hasBookings}
// // //                 disabled={isCompleted || !!isThisProcessing || !!hasBookings}
// // //               >
// // //                 <Trash2 className="h-4 w-4" />
// // //               </Button>
// // //             </div>
// // //           )}
// // //         </div>
// // //       </Card>

// // //       <DirectBookingDialog trip={trip} isOpen={directBookingOpen} onClose={() => setDirectBookingOpen(false)} />
// // //       <TripManifestDialog tripId={manifestOpen ? trip.id : null} trip={manifestOpen ? trip : null} open={manifestOpen} onOpenChange={setManifestOpen} />

// // //       <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
// // //         <AlertDialogContent>
// // //           <AlertDialogHeader>
// // //             <AlertDialogTitle>تأكيد إلغاء الرحلة</AlertDialogTitle>
// // //             <AlertDialogDescription>هل أنت متأكد من إلغاء هذه الرحلة؟ لا يمكن التراجع عن هذا الإجراء.</AlertDialogDescription>
// // //           </AlertDialogHeader>
// // //           <AlertDialogFooter>
// // //             <AlertDialogCancel>تراجع</AlertDialogCancel>
// // //             <AlertDialogAction onClick={() => { cancelTrip(trip); setCancelOpen(false); }} className="bg-destructive">إلغاء الرحلة</AlertDialogAction>
// // //           </AlertDialogFooter>
// // //         </AlertDialogContent>
// // //       </AlertDialog>

// // //       <AlertDialog open={showBlockingAlert} onOpenChange={setShowBlockingAlert}>
// // //         <AlertDialogContent>
// // //           <AlertDialogHeader>
// // //             <AlertDialogTitle className="flex items-center gap-2 text-destructive"><AlertTriangle className="h-5 w-5" /> قانون التمرير السيادي</AlertDialogTitle>
// // //             <AlertDialogDescription className="space-y-2 pt-2">
// // //               <p className="font-bold text-foreground">لا يمكن إلغاء هذه الرحلة بسبب وجود ركاب مؤكدين.</p>
// // //               <p className="text-sm text-muted-foreground">دستور "سفريات" يمنع ترك الركاب دون بديل.</p>
// // //             </AlertDialogDescription>
// // //           </AlertDialogHeader>
// // //           <AlertDialogFooter><AlertDialogCancel>فهمت</AlertDialogCancel></AlertDialogFooter>
// // //         </AlertDialogContent>
// // //       </AlertDialog>
// // //     </>
// // //   );
// // // }

// // // // ── Main Export ────────────────────────────────────────────────────
// // // export function MyTripsList({ trips, isLoading, onEdit, carrierProfile }: MyTripsListProps) {
// // //   if (isLoading) return <div className="text-center py-10 text-muted-foreground">جاري التحميل...</div>;
// // //   const t = useTranslations('myTripsList')
// // //   if (!trips?.length) return (
// // //     <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-lg bg-card col-span-full">
// // //       <Route className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
// // //       <p className="font-bold">{t('emptyTitle')}</p>
// // //       <p className="text-sm mt-1">{t('createTrip')}</p>
// // //     </div>
// // //   );

// // //   return (
// // //     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// // //       {trips.map(trip => (
// // //         <TripCard key={trip.id} trip={trip} onEdit={onEdit} carrierProfile={carrierProfile} />
// // //       ))}
// // //     </div>
// // //   );
// // // }

// // 'use client';

// // import { useEffect, useMemo, useState } from 'react';
// // import { Button } from '@/components/ui/button';
// // import { Input } from '@/components/ui/input';
// // import { Label } from '@/components/ui/label';
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// // import { Edit, Trash2, Loader2, CheckCircle2, AlertTriangle, User, Route, UserPlus, Ban, UserCircle, Store, Star } from 'lucide-react';
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
// // import { useFirestore, useUser, useCollection, useMemoFirebase, useDoc } from '@/firebase';
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

// // interface MyTripsListProps {
// //   trips: Trip[];
// //   isLoading: boolean;
// //   onEdit: (trip: Trip) => void;
// //   carrierProfile: UserProfile | null;
// // }

// // // ── Utilities ──────────────────────────────────────────────────────
// // const parseFirestoreDate = (dateObj: any): Date => {
// //   if (!dateObj) return new Date(0);
// //   return dateObj.toDate?.() || new Date(dateObj);
// // };

// // // ── Cache System (لتقليل قراءات Firestore) ──────────────────────────
// // const userCache = new Map<string, Promise<UserProfile | null>>();
// // const fetchUserCached = async (firestore: any, userId: string): Promise<UserProfile | null> => {
// //   if (userCache.has(userId)) return userCache.get(userId) as Promise<UserProfile | null>;
// //   const promise = getDoc(doc(firestore, 'users', userId)).then(snap => snap.exists() ? { id: snap.id, ...snap.data() } as UserProfile : null);
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

// //     // حماية إضافية من جهة السيرفر ضد الحجز بعد الوقت
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
// //       // ✅ استخدام Batch لضمان الخصم والحجز معاً
// //       const batch = writeBatch(firestore);
// //       const bookingRef = doc(collection(firestore, 'bookings'));
// //       const tripRef = doc(firestore, 'trips', trip.id);

// //       batch.set(bookingRef, {
// //         id: bookingRef.id,
// //         tripId: trip.id,
// //         carrierId: user.uid,
// //         userId: user.uid,
// //         bookedByCarrier: true,
// //         seats: form.seats,
// //         passengersDetails: [{ name: form.name.trim(), nationality: form.nationality.trim(), documentNumber: form.documentNumber.trim(), type: form.type }],
// //         status: 'Confirmed',
// //         totalPrice: (trip.price || 0) * form.seats,
// //         currency: trip.currency,
// //         createdAt: serverTimestamp(),
// //         updatedAt: serverTimestamp(),
// //       });

// //       batch.update(tripRef, {
// //         availableSeats: increment(-form.seats),
// //         bookingIds: arrayUnion(bookingRef.id), // ✅ إضافة الـ ID بآمان
// //         updatedAt: serverTimestamp(),
// //       });

// //       await batch.commit();

// //       toast({ title: t('bookingSuccess') });
// //       onClose();
// //       setForm({ name: '', nationality: '', documentNumber: '', type: 'adult', seats: 1 });
// //     } catch (e: any) {
// //       toast({ variant: 'destructive', title: t('bookingFailed'), description: e?.message });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <Dialog open={isOpen} onOpenChange={(o) => !loading && !o && onClose()}>
// //       <DialogContent className="sm:max-w-md">
// //         <DialogHeader>
// //           <DialogTitle className="flex items-center gap-2"><UserPlus className="h-5 w-5 text-primary" />{t('directBookingTitle')}</DialogTitle>
// //           <DialogDescription>
// //             {getCityName(trip.origin, locale)} {locale === 'ar' ? '←' : '→'} {getCityName(trip.destination, locale)} | {t('available')}: {trip.availableSeats} {t('seat')}
// //           </DialogDescription>
// //         </DialogHeader>
// //         <div className="space-y-4 py-2">
// //           <div className="space-y-2">
// //             <Label>{t('fullName')}<span className="text-destructive">*</span></Label>
// //             <Input placeholder={t('passengerName')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} disabled={loading} />
// //           </div>
// //           <div className="grid grid-cols-2 gap-3">
// //             <div className="space-y-2">
// //               <Label>{t('nationality')}<span className="text-destructive">*</span></Label>
// //               <Input placeholder={t('nationalityPlaceholder')} value={form.nationality} onChange={(e) => setForm({ ...form, nationality: e.target.value })} disabled={loading} />
// //             </div>
// //             <div className="space-y-2">
// //               <Label>{t('docNumber')}<span className="text-destructive">*</span></Label>
// //               <Input placeholder={t('docPlaceholder')} value={form.documentNumber} onChange={(e) => setForm({ ...form, documentNumber: e.target.value })} disabled={loading} className="font-mono" />
// //             </div>
// //           </div>
// //           <div className="grid grid-cols-2 gap-3">
// //             <div className="space-y-2">
// //               <Label> {t('passengerType')}</Label>
// //               <Select value={form.type} onValueChange={(v: any) => setForm({ ...form, type: v })}>
// //                 <SelectTrigger><SelectValue /></SelectTrigger>
// //                 <SelectContent>
// //                   <SelectItem value="adult">{t('adult')}</SelectItem>
// //                   <SelectItem value="minor">{t('minor')}</SelectItem>
// //                   <SelectItem value="infant">{t('infant')}</SelectItem>
// //                 </SelectContent>
// //               </Select>
// //             </div>
// //             <div className="space-y-2">
// //               <Label>{t('seatsCount')}</Label>
// //               <Select value={String(form.seats)} onValueChange={(v) => setForm({ ...form, seats: Number(v) })}>
// //                 <SelectTrigger><SelectValue /></SelectTrigger>
// //                 <SelectContent>
// //                   {Array.from({ length: trip.availableSeats || 1 }, (_, i) => i + 1).map(n => (
// //                     <SelectItem key={n} value={String(n)}>{n}</SelectItem>
// //                   ))}
// //                 </SelectContent>
// //               </Select>
// //             </div>
// //           </div>
// //           <div className="bg-muted/40 rounded-lg p-3 text-sm">
// //             <div className="flex justify-between">
// //               <span className="text-muted-foreground">{t('total')}</span>
// //               <span className="font-bold">{((trip.price || 0) * form.seats).toFixed(2)} {trip.currency}</span>
// //             </div>
// //           </div>
// //         </div>
// //         <DialogFooter className="gap-2">
// //           <Button variant="secondary" onClick={onClose} disabled={loading}>{t('cancel')}</Button>
// //           <Button onClick={handleSubmit} disabled={loading}>
// //             {loading ? <><Loader2 className="h-4 w-4 animate-spin ml-2" />{t('bookingInProgress')}</> : <><UserPlus className="h-4 w-4 ml-2" /> {t('confirmBooking')}</>}
// //           </Button>
// //         </DialogFooter>
// //       </DialogContent>
// //     </Dialog>
// //   );
// // }

// // // ── Passengers List ────────────────────────────────────────────────
// // function BookingPassengerRow({ booking, index, isSelected, onToggle, onCancel, t }: {
// //   booking: any; index: number; isSelected: boolean; onToggle: () => void; onCancel: (bookingId: string) => void; t: (key: string) => string;
// // }) {
// //   const firestore = useFirestore();
// //   const [travelerProfile, setTravelerProfile] = useState<any>(null);

// //   const details = booking.passengersDetails;
// //   const detailsArray = Array.isArray(details) ? details : details && typeof details === 'object' ? [details] : [];
// //   const hasPassengerDetails = detailsArray.length > 0 && (detailsArray[0]?.name || detailsArray[0]?.passengerName);

// //   useEffect(() => {
// //     if (hasPassengerDetails || !firestore || !booking.userId) return;
// //     // ✅ استخدام نظام التخزين المؤقت
// //     fetchUserCached(firestore, booking.userId).then(profile => {
// //       if (profile) setTravelerProfile(profile);
// //     }).catch(() => { });
// //   }, [firestore, booking.userId, hasPassengerDetails]);

// //   const displayPassengers = hasPassengerDetails
// //     ? detailsArray.map((p: any) => ({
// //       name: p.name || p.passengerName || '',
// //       nationality: p.nationality || '',
// //       documentNumber: p.documentNumber || p.documentId || '',
// //       type: p.type || p.passengerType || 'adult',
// //       phone: p.phone || p.passengerPhone || '',
// //     }))
// //     : [{
// //       name: travelerProfile
// //         ? [travelerProfile.firstName, travelerProfile.lastName].filter(Boolean).join(' ') || travelerProfile.fullName || travelerProfile.displayName || ''
// //         : '',
// //       nationality: travelerProfile?.nationality || '',
// //       documentNumber: '',
// //       type: 'adult',
// //       phone: travelerProfile
// //         ? (travelerProfile.phoneCountryCode ? `+${travelerProfile.phoneCountryCode}` : '') + (travelerProfile.phoneNumber || '')
// //         : '',
// //     }];

// //   return (
// //     <>
// //       {displayPassengers.map((p, pIdx) => {
// //         const globalIdx = `${index}-${pIdx}`;
// //         return (
// //           <div key={globalIdx}>
// //             <button
// //               onClick={onToggle}
// //               className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-muted/30 border hover:bg-muted/60 transition-colors text-sm"
// //             >
// //               <span className="flex items-center gap-2">
// //                 <span className="font-mono text-xs text-muted-foreground">#{index + 1}</span>
// //                 <span className="font-semibold">{p.name || (travelerProfile === null && !hasPassengerDetails ? '...' : t('traveler'))}</span>
// //                 {p.phone && (
// //                   <a href={`tel:${p.phone}`} onClick={e => e.stopPropagation()} className="font-mono text-[11px] text-emerald-400 hover:text-emerald-300" dir="ltr">{p.phone}</a>
// //                 )}
// //               </span>
// //               <Badge
// //                 variant={booking.status === 'Confirmed' ? 'default' : booking.status === 'Pending-Payment-Verification' ? 'default' : 'secondary'}
// //                 className={`text-[10px] ${booking.status === 'Pending-Payment-Verification' ? 'bg-blue-500 text-white' : ''}`}
// //               >
// //                 {booking.status === 'Confirmed' ? t('confirmed') :
// //                   booking.status === 'Pending-Carrier-Confirmation' ? t('pendingConfirm') :
// //                     booking.status === 'Pending-Payment-Verification' ? t('pendingVerification') : t('pendingPayment')}
// //               </Badge>
// //             </button>
// //             {isSelected && (
// //               <div className="bg-muted/20 border border-t-0 rounded-b-lg px-3 py-2 space-y-2 text-sm animate-in fade-in duration-150">
// //                 <div className="flex justify-between">
// //                   <span className="text-muted-foreground">{t('seatsNum')}</span>
// //                   <span className="font-semibold">{booking.seats}</span>
// //                 </div>
// //                 {p.nationality && (
// //                   <div className="flex justify-between">
// //                     <span className="text-muted-foreground">{t('nationality')}</span>
// //                     <span className="font-semibold">{p.nationality}</span>
// //                   </div>
// //                 )}
// //                 {p.documentNumber && (
// //                   <div className="flex justify-between">
// //                     <span className="text-muted-foreground">{t('docNumber')}</span>
// //                     <span className="font-mono font-semibold">{p.documentNumber}</span>
// //                   </div>
// //                 )}
// //                 <div className="flex justify-between">
// //                   <span className="text-muted-foreground">{t('docType')}</span>
// //                   <span className="font-semibold">
// //                     {p.type === 'adult' ? t('adult') : p.type === 'minor' ? t('minor') : t('infant')}
// //                   </span>
// //                 </div>
// //                 {p.phone && (
// //                   <div className="flex justify-between items-center">
// //                     <span className="text-muted-foreground">{t('phoneTrev')}</span>
// //                     <a href={`tel:${p.phone}`} className="font-mono font-semibold text-emerald-400 hover:text-emerald-300 transition-colors" dir="ltr">{p.phone}</a>
// //                   </div>
// //                 )}
// //                 {booking.bookedByCarrier && (
// //                   <Button variant="destructive" size="sm" className="w-full gap-2 mt-1"
// //                     onClick={() => onCancel(booking.id)}>
// //                     <Ban className="h-3.5 w-3.5" /> {t('cancelBooking')}
// //                   </Button>
// //                 )}
// //               </div>
// //             )}
// //           </div>
// //         );
// //       })}
// //     </>
// //   );
// // }

// // function TripPassengers({ trip }: { trip: Trip }) {
// //   const firestore = useFirestore();
// //   const { toast } = useToast();
// //   const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
// //   const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);
// //   const [loadingCancel, setLoadingCancel] = useState(false);
// //   const t = useTranslations('carrier')

// //   const bookingsQuery1 = useMemoFirebase(() => {
// //     if (!firestore || !trip.id) return null;
// //     return query(
// //       collection(firestore, 'bookings'),
// //       where('tripId', '==', trip.id),
// //       where('status', 'in', ['Confirmed', 'Pending-Carrier-Confirmation', 'Pending-Payment', 'Pending-Payment-Verification'])
// //     );
// //   }, [firestore, trip.id]);

// //   const bookingsQuery2 = useMemoFirebase(() => {
// //     if (!firestore || !trip.id) return null;
// //     return query(
// //       collection(firestore, 'bookings'),
// //       where('carrierTripId', '==', trip.id),
// //       where('status', 'in', ['Confirmed', 'Pending-Carrier-Confirmation', 'Pending-Payment', 'Pending-Payment-Verification'])
// //     );
// //   }, [firestore, trip.id]);

// //   const { data: bookings1 } = useCollection<Booking>(bookingsQuery1);
// //   const { data: bookings2 } = useCollection<Booking>(bookingsQuery2);

// //   const bookings = useMemo(() => {
// //     const all = [...(bookings1 || []), ...(bookings2 || [])];
// //     const seen = new Set<string>();
// //     return all.filter(b => {
// //       if (seen.has(b.id)) return false;
// //       seen.add(b.id);
// //       return true;
// //     });
// //   }, [bookings1, bookings2]);

// //   const handleCancelBooking = async () => {
// //     if (!firestore || !cancellingBookingId) return;
// //     setLoadingCancel(true);
// //     try {
// //       const booking = bookings.find(b => b.id === cancellingBookingId);
// //       if (!booking) return;
// //       await updateDoc(doc(firestore, 'bookings', cancellingBookingId), {
// //         status: 'Cancelled', cancelledBy: 'carrier',
// //         cancelledAt: serverTimestamp(), updatedAt: serverTimestamp()
// //       });
// //       await updateDoc(doc(firestore, 'trips', trip.id), {
// //         availableSeats: increment(booking.seats), updatedAt: serverTimestamp()
// //       });
// //       if (booking.userId) {
// //         await addDoc(collection(firestore, 'notifications'), {
// //           userId: booking.userId, title: t('cancelledNotif'),
// //           message: t('cancelledByCarrier'), type: 'trip_update',
// //           isRead: false, createdAt: serverTimestamp()
// //         });
// //       }
// //       toast({ title: t('cancelSuccess') });
// //       setCancellingBookingId(null);
// //       setSelectedIndex(null);
// //     } catch {
// //       toast({ variant: 'destructive', title: t('cancelFailed') });
// //     } finally {
// //       setLoadingCancel(false);
// //     }
// //   };

// //   if (bookings.length === 0) return (
// //     <p className="text-xs text-muted-foreground text-center py-2">{t('noSeatsYet')}</p>
// //   );

// //   return (
// //     <>
// //       <div className="space-y-2">
// //         {bookings.map((b, i) => (
// //           <BookingPassengerRow
// //             key={b.id}
// //             booking={b}
// //             index={i}
// //             isSelected={selectedIndex === i}
// //             onToggle={() => setSelectedIndex(selectedIndex === i ? null : i)}
// //             onCancel={setCancellingBookingId}
// //             t={t}
// //           />
// //         ))}
// //       </div>

// //       <AlertDialog open={!!cancellingBookingId} onOpenChange={(o) => !o && setCancellingBookingId(null)}>
// //         <AlertDialogContent>
// //           <AlertDialogHeader>
// //             <AlertDialogTitle className="text-destructive flex items-center gap-2">
// //               <AlertTriangle className="h-5 w-5" /> {t('confirmCancelTitle')}
// //             </AlertDialogTitle>
// //             <AlertDialogDescription>
// //               {t('confirmCancelDesc')}
// //             </AlertDialogDescription>
// //           </AlertDialogHeader>
// //           <AlertDialogFooter>
// //             <AlertDialogCancel disabled={loadingCancel}>{t('goBack')}</AlertDialogCancel>
// //             <AlertDialogAction onClick={handleCancelBooking} disabled={loadingCancel}
// //               className="bg-destructive">
// //               {loadingCancel ? <Loader2 className="h-4 w-4 animate-spin" /> : t('confirmCancelTitle')}
// //             </AlertDialogAction>
// //           </AlertDialogFooter>
// //         </AlertDialogContent>
// //       </AlertDialog>
// //     </>
// //   );
// // }

// // // ── Opportunity Row ──
// // function OpportunityRow({ opportunity, carrierId, isOpen, onToggle, onOffer }: {
// //   opportunity: Trip; carrierId: string; isOpen: boolean; onToggle: () => void; onOffer: (passengerIntentId: string) => void;
// // }): JSX.Element {
// //   const firestore = useFirestore();
// //   const t = useTranslations('carrier');
// //   const [traveler, setTraveler] = useState<UserProfile | null>(null);

// //   useEffect(() => {
// //     if (!firestore || !opportunity.userId || traveler) return;
// //     fetchUserCached(firestore, opportunity.userId).then(profile => {
// //       if (profile) setTraveler(profile); // ✅ التعديل الصحيح
// //     }).catch(e => console.error('Failed to fetch traveler:', e));
// //   }, [firestore, opportunity.userId]);

// //   const isDirectRequest = opportunity.requestType === 'Direct' && opportunity.targetCarrierId === carrierId;

// //   return (
// //     <div>
// //       <button onClick={onToggle}
// //         className={cn(
// //           "w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-colors text-sm",
// //           isDirectRequest
// //             ? "bg-primary/10 border-primary/30 hover:bg-primary/20"
// //             : "bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20"
// //         )}>
// //         <span className="flex items-center gap-2 flex-wrap">
// //           <UserCircle className={cn("h-4 w-4 shrink-0", isDirectRequest ? "text-primary" : "text-amber-500",
// //             opportunity.creatorRole === 'agent' ? "text-blue-400" : ""
// //           )} />
// //           {opportunity.creatorRole === 'agent' ? (
// //             <span className="font-semibold text-blue-400">{opportunity.agentName || t('agent')}</span>
// //           ) : (
// //             <span className="font-semibold">{traveler?.firstName || t('traveler')}</span>
// //           )}
// //           <span className="text-xs text-muted-foreground">• {typeof opportunity.passengers === 'number' ? opportunity.passengers : ''} {t('seat')}</span>
// //           {opportunity.creatorRole === 'agent' && opportunity.agentFee ? (
// //             <span className="text-[10px] font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
// //               {t('agentFee')}: {opportunity.agentFee} {opportunity.currency || 'JOD'}
// //             </span>
// //           ) : null}
// //         </span>
// //         <div className="flex items-center gap-2">
// //           {opportunity.creatorRole === 'agent' && (
// //             <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-[10px] gap-1">🤝 {t('agent')}</Badge>
// //           )}
// //           {isDirectRequest && (
// //             <Badge className="bg-primary text-[10px] gap-1"><Star className="h-3 w-3" /> {t('customRequest')}</Badge>
// //           )}
// //         </div>
// //       </button>

// //       {isOpen && (
// //         <div className="bg-muted/20 border border-t-0 rounded-b-lg px-3 py-3 space-y-2 text-sm animate-in fade-in duration-150">
// //           <div className="flex justify-between">
// //             <span className="text-muted-foreground">{t('travelerName')}</span>
// //             <span className="font-semibold">
// //               {[traveler?.firstName, traveler?.lastName].filter(Boolean).join(' ') || t('traveler')}
// //             </span>
// //           </div>
// //           {(traveler?.phoneNumber) && (
// //             <div className="flex justify-between">
// //               <span className="text-muted-foreground">{t('phoneTrev')}</span>
// //               <span className="font-semibold font-mono" dir="ltr">
// //                 {traveler.phoneCountryCode ? `+${traveler.phoneCountryCode}` : ''}{traveler.phoneNumber}
// //               </span>
// //             </div>
// //           )}
// //           <div className="flex justify-between">
// //             <span className="text-muted-foreground">{t('seatsNum')}</span>
// //             <span className="font-semibold">{typeof opportunity.passengers === 'number' ? opportunity.passengers : ''} {t('seat')}</span>
// //           </div>
// //           <div className="flex justify-between">
// //             <span className="text-muted-foreground">{t('requestType')}</span>
// //             <span className={cn("font-semibold", isDirectRequest ? "text-primary" : "text-amber-500")}>
// //               {isDirectRequest ? t('directForYou') : t('generalMarket')}
// //             </span>
// //           </div>
// //           {opportunity.creatorRole === 'agent' && (
// //             <>
// //               <div className="flex justify-between items-center bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-2">
// //                 <span className="text-muted-foreground text-xs">{t('requestFromAgent')}</span>
// //                 <span className="font-black text-blue-400 text-sm">{opportunity.agentName || t('agent')}</span>
// //               </div>
// //               {opportunity.agentFee ? (
// //                 <div className="flex justify-between items-center bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
// //                   <span className="text-muted-foreground text-xs">{t('requestedFee')}</span>
// //                   <span className="font-black text-amber-400 text-sm">{opportunity.agentFee} {opportunity.currency || 'JOD'}</span>
// //                 </div>
// //               ) : null}
// //             </>
// //           )}
// //           {opportunity.notes && (
// //             <div className="bg-muted/30 rounded p-2 text-xs text-muted-foreground">
// //               {opportunity.notes}
// //             </div>
// //           )}
// //           <Button size="sm" className="w-full mt-2" onClick={() => onOffer(opportunity.id)}>
// //             {t('sendOffer')}
// //           </Button>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // // ── Direct Opportunities ──
// // function DirectOpportunities({ trip, carrierId }: { trip: Trip; carrierId: string }) {
// //   const firestore = useFirestore();
// //   const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
// //   const [currentPassengerIntentId, setCurrentPassengerIntentId] = useState('');
// //   const t = useTranslations('carrier')
// //   const { openOfferDialog, selectedTrip, isDialogOpen, setIsDialogOpen, handleSendOffer } = useOfferDialog();

// //   const q = useMemoFirebase(() => {
// //     if (!firestore) return null;
// //     return query(
// //       collection(firestore, 'trips'),
// //       where('status', '==', 'Awaiting-Offers'),
// //       where('origin', '==', trip.origin),
// //       where('destination', '==', trip.destination),
// //       limit(10)
// //     );
// //   }, [firestore, trip.origin, trip.destination, carrierId]);

// //   const { data: opps } = useCollection<Trip>(q);

// //   const filteredOpps = useMemo(() => {
// //     if (!opps) return [];
// //     return opps.filter(opp => opp.requestType === 'Direct' && opp.targetCarrierId === carrierId);
// //   }, [opps, carrierId]);

// //   if (!filteredOpps || filteredOpps.length === 0) return (
// //     <p className="text-xs text-muted-foreground text-center py-2">{t('noDirectOrders')}</p>
// //   );

// //   return (
// //     <>
// //       <div className="space-y-2">
// //         {filteredOpps.map((opp, i) => (
// //           <OpportunityRow key={opp.id} opportunity={opp} carrierId={carrierId}
// //             isOpen={selectedIndex === i} onToggle={() => setSelectedIndex(selectedIndex === i ? null : i)}
// //             onOffer={(passengerIntentId) => {
// //               openOfferDialog(trip);
// //               setCurrentPassengerIntentId(passengerIntentId);
// //             }}
// //           />
// //         ))}
// //       </div>
// //       {selectedTrip && (
// //         <OfferDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} trip={selectedTrip}
// //           onSendOffer={(offerData) => handleSendOffer(offerData, currentPassengerIntentId)}
// //         />
// //       )}
// //     </>
// //   );
// // }

// // // ── General Opportunities ──
// // function GeneralOpportunities({ trip, carrierId }: { trip: Trip; carrierId: string }) {
// //   const firestore = useFirestore();
// //   const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
// //   const [currentPassengerIntentId, setCurrentPassengerIntentId] = useState('');
// //   const t = useTranslations('carrier')
// //   const { openOfferDialog, selectedTrip, isDialogOpen, setIsDialogOpen, handleSendOffer } = useOfferDialog();

// //   const q = useMemoFirebase(() => {
// //     if (!firestore) return null;
// //     return query(
// //       collection(firestore, 'trips'),
// //       where('status', '==', 'Awaiting-Offers'),
// //       where('origin', '==', trip.origin),
// //       where('destination', '==', trip.destination),
// //       limit(10)
// //     );
// //   }, [firestore, trip.origin, trip.destination]);

// //   const { data: opps } = useCollection<Trip>(q);

// //   const filteredOpps = useMemo(() => {
// //     if (!opps) return [];
// //     return opps.filter(opp => opp.requestType === 'General');
// //   }, [opps]);

// //   if (!filteredOpps || filteredOpps.length === 0) return <p className="text-xs text-muted-foreground text-center py-2">{t('noGeneralOrders')}</p>;

// //   return (
// //     <>
// //       <div className="space-y-2">
// //         {filteredOpps.map((opp, i) => (
// //           <OpportunityRow key={opp.id} opportunity={opp} carrierId={carrierId}
// //             isOpen={selectedIndex === i} onToggle={() => setSelectedIndex(selectedIndex === i ? null : i)}
// //             onOffer={(passengerIntentId) => {
// //               openOfferDialog(trip);
// //               setCurrentPassengerIntentId(passengerIntentId);
// //             }}
// //           />
// //         ))}
// //       </div>
// //       {selectedTrip && (
// //         <OfferDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} trip={selectedTrip}
// //           onSendOffer={(offerData) => handleSendOffer(offerData, currentPassengerIntentId)}
// //         />
// //       )}
// //     </>
// //   );
// // }

// // // ── Single Trip Card ───────────────────────────────────────────────
// // function TripCard({ trip, onEdit, carrierProfile }: { trip: Trip; onEdit: (trip: Trip) => void; carrierProfile: UserProfile | null }) {
// //   const locale = useLocale();
// //   const { user } = useUser();
// //   const [manifestOpen, setManifestOpen] = useState(false);
// //   const [cancelOpen, setCancelOpen] = useState(false);
// //   const [showBlockingAlert, setShowBlockingAlert] = useState(false);
// //   const [directBookingOpen, setDirectBookingOpen] = useState(false);
// //   const { isProcessing, completeTrip, cancelTrip } = useTripActions();
// //   const t = useTranslations('carrier');

// //   const isCompleted = useMemo(() => {
// //     if (['Completed', 'Cancelled'].includes(trip.status)) return true;
// //     const depDate = parseFirestoreDate(trip.departureDate);
// //     const durationHours = (trip as any).estimatedDurationHours || 0;
// //     const endDate = new Date(depDate.getTime() + durationHours * 60 * 60 * 1000);
// //     return endDate < new Date();
// //   }, [trip.status, trip.departureDate, (trip as any).estimatedDurationHours]);

// //   // ✅ استخدام الدالة المساعدة لتوحيد حساب وقت الانطلاق
// //   const isDeparted = useMemo(() => {
// //     const depDate = parseFirestoreDate(trip.departureDate);
// //     return depDate < new Date();
// //   }, [trip.departureDate]);

// //   const isThisProcessing = isProcessing?.endsWith(trip.id);
// //   const capacity = carrierProfile?.vehicleCapacity || (trip as any).vehicleCapacity || 0;
// //   const available = trip.availableSeats ?? 0;
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
// //             {/* 🛑 الزر يختفي إذا كانت الرحلة ممتلئة (isFull) ويصبح معطلاً إذا مر وقت الرحلة (isDeparted) */}
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

// //           {trip.status === 'In-Transit' ? (
// //             <Button size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white gap-2" onClick={() => completeTrip(trip)} disabled={!!isThisProcessing}>
// //               {isThisProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />} {t('endTrip')}
// //             </Button>
// //           ) : (
// //             <div className="flex gap-2">
// //               <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => setManifestOpen(true)} disabled={!!isThisProcessing}>
// //                 <User className="h-4 w-4" /> {t('Statement')}
// //               </Button>
// //               <Button variant="ghost" size="icon"
// //                 className={cn("h-9 w-9", hasBookings ? "text-muted-foreground opacity-40 cursor-not-allowed" : "text-blue-600")}
// //                 onClick={() => !hasBookings && onEdit(trip)}
// //                 disabled={isCompleted || !!isThisProcessing || !!hasBookings}
// //               >
// //                 <Edit className="h-4 w-4" />
// //               </Button>
// //               <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 h-9 w-9"
// //                 onClick={() => hasBookings ? setShowBlockingAlert(true) : setCancelOpen(true)}
// //                 disabled={isCompleted || !!isThisProcessing || !!hasBookings}
// //               >
// //                 <Trash2 className="h-4 w-4" />
// //               </Button>
// //             </div>
// //           )}
// //         </div>
// //       </Card>

// //       <DirectBookingDialog trip={trip} isOpen={directBookingOpen} onClose={() => setDirectBookingOpen(false)} />
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
// // export function MyTripsList({ trips, isLoading, onEdit, carrierProfile }: MyTripsListProps) {
// //   const t = useTranslations('myTripsList');
// //   if (isLoading) return <div className="text-center py-10 text-muted-foreground">جاري التحميل...</div>;
// //   if (!trips?.length) return (
// //     <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-lg bg-card col-span-full">
// //       <Route className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
// //       <p className="font-bold">{t('emptyTitle')}</p>
// //       <p className="text-sm mt-1">{t('createTrip')}</p>
// //     </div>
// //   );

// //   return (
// //     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// //       {trips.map(trip => (
// //         <TripCard key={trip.id} trip={trip} onEdit={onEdit} carrierProfile={carrierProfile} />
// //       ))}
// //     </div>
// //   );
// // }
// 'use client';

// import { useEffect, useMemo, useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Edit, Trash2, Loader2, CheckCircle2, AlertTriangle, User, Route, UserPlus, Ban, UserCircle, Store, Star } from 'lucide-react';
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
// import { useFirestore, useUser, useCollection, useMemoFirebase, useDoc } from '@/firebase';
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

// interface MyTripsListProps {
//   trips: Trip[];
//   isLoading: boolean;
//   onEdit: (trip: Trip) => void;
//   carrierProfile: UserProfile | null;
// }

// // ── Utilities ──────────────────────────────────────────────────────
// const parseFirestoreDate = (dateObj: any): Date => {
//   if (!dateObj) return new Date(0);
//   return dateObj.toDate?.() || new Date(dateObj);
// };

// // ── Cache System (لتقليل قراءات Firestore) ──────────────────────────
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

//     // حماية إضافية من جهة السيرفر ضد الحجز بعد الوقت
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
//       // ✅ استخدام Batch لضمان الخصم والحجز معاً (منع الـ Overbooking)
//       const batch = writeBatch(firestore);
//       const bookingRef = doc(collection(firestore, 'bookings'));
//       const tripRef = doc(firestore, 'trips', trip.id);

//       batch.set(bookingRef, {
//         id: bookingRef.id,
//         tripId: trip.id, 
//         carrierId: user.uid, 
//         userId: user.uid, 
//         bookedByCarrier: true,
//         seats: form.seats, 
//         passengersDetails: [{ name: form.name.trim(), nationality: form.nationality.trim(), documentNumber: form.documentNumber.trim(), type: form.type }],
//         status: 'Confirmed', 
//         totalPrice: (trip.price || 0) * form.seats, 
//         currency: trip.currency,
//         createdAt: serverTimestamp(), 
//         updatedAt: serverTimestamp(),
//       });

//       batch.update(tripRef, {
//         availableSeats: increment(-form.seats),
//         bookingIds: arrayUnion(bookingRef.id), // إضافة الـ ID بآمان
//         updatedAt: serverTimestamp(),
//       });

//       await batch.commit();

//       toast({ title: t('bookingSuccess') });
//       onClose();
//       setForm({ name: '', nationality: '', documentNumber: '', type: 'adult', seats: 1 });
//     } catch (e: any) {
//       toast({ variant: 'destructive', title: t('bookingFailed'), description: e?.message });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={(o) => !loading && !o && onClose()}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2"><UserPlus className="h-5 w-5 text-primary" />{t('directBookingTitle')}</DialogTitle>
//           <DialogDescription>
//             {getCityName(trip.origin, locale)} {locale === 'ar' ? '←' : '→'} {getCityName(trip.destination, locale)} | {t('available')}: {trip.availableSeats} {t('seat')}
//           </DialogDescription>
//         </DialogHeader>
//         <div className="space-y-4 py-2">
//           <div className="space-y-2">
//             <Label>{t('fullName')}<span className="text-destructive">*</span></Label>
//             <Input placeholder={t('passengerName')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} disabled={loading} />
//           </div>
//           <div className="grid grid-cols-2 gap-3">
//             <div className="space-y-2">
//               <Label>{t('nationality')}<span className="text-destructive">*</span></Label>
//               <Input placeholder={t('nationalityPlaceholder')} value={form.nationality} onChange={(e) => setForm({ ...form, nationality: e.target.value })} disabled={loading} />
//             </div>
//             <div className="space-y-2">
//               <Label>{t('docNumber')}<span className="text-destructive">*</span></Label>
//               <Input placeholder={t('docPlaceholder')} value={form.documentNumber} onChange={(e) => setForm({ ...form, documentNumber: e.target.value })} disabled={loading} className="font-mono" />
//             </div>
//           </div>
//           <div className="grid grid-cols-2 gap-3">
//             <div className="space-y-2">
//               <Label> {t('passengerType')}</Label>
//               <Select value={form.type} onValueChange={(v: any) => setForm({ ...form, type: v })}>
//                 <SelectTrigger><SelectValue /></SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="adult">{t('adult')}</SelectItem>
//                   <SelectItem value="minor">{t('minor')}</SelectItem>
//                   <SelectItem value="infant">{t('infant')}</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="space-y-2">
//               <Label>{t('seatsCount')}</Label>
//               <Select value={String(form.seats)} onValueChange={(v) => setForm({ ...form, seats: Number(v) })}>
//                 <SelectTrigger><SelectValue /></SelectTrigger>
//                 <SelectContent>
//                   {Array.from({ length: trip.availableSeats || 1 }, (_, i) => i + 1).map(n => (
//                     <SelectItem key={n} value={String(n)}>{n}</SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//           <div className="bg-muted/40 rounded-lg p-3 text-sm">
//             <div className="flex justify-between">
//               <span className="text-muted-foreground">{t('total')}</span>
//               <span className="font-bold">{((trip.price || 0) * form.seats).toFixed(2)} {trip.currency}</span>
//             </div>
//           </div>
//         </div>
//         <DialogFooter className="gap-2">
//           <Button variant="secondary" onClick={onClose} disabled={loading}>{t('cancel')}</Button>
//           <Button onClick={handleSubmit} disabled={loading}>
//             {loading ? <><Loader2 className="h-4 w-4 animate-spin ml-2" />{t('bookingInProgress')}</> : <><UserPlus className="h-4 w-4 ml-2" /> {t('confirmBooking')}</>}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

// // ── Passengers List ────────────────────────────────────────────────
// function BookingPassengerRow({ booking, index, isSelected, onToggle, onCancel, t }: {
//   booking: any; index: number; isSelected: boolean; onToggle: () => void; onCancel: (bookingId: string) => void; t: (key: string) => string;
// }) {
//   const firestore = useFirestore();
//   const [travelerProfile, setTravelerProfile] = useState<any>(null);

//   const details = booking.passengersDetails;
//   const detailsArray = Array.isArray(details) ? details : details && typeof details === 'object' ? [details] : [];
//   const hasPassengerDetails = detailsArray.length > 0 && (detailsArray[0]?.name || detailsArray[0]?.passengerName);

//   useEffect(() => {
//     if (!firestore || !booking.userId) return;
//     fetchUserCached(firestore, booking.userId).then(profile => {
//       if (profile) setTravelerProfile(profile);
//     }).catch(() => {});
//   }, [firestore, booking.userId]);

//   const profilePhone = travelerProfile?.phoneNumber 
//     ? `${travelerProfile.phoneCountryCode ? '+' + travelerProfile.phoneCountryCode + ' ' : ''}${travelerProfile.phoneNumber}` 
//     : '';

//   const displayPassengers = hasPassengerDetails
//     ? detailsArray.map((p: any, pIdx: number) => ({
//       name: p.name || p.passengerName || '',
//       nationality: p.nationality || '',
//       documentNumber: p.documentNumber || p.documentId || '',
//       type: p.type || p.passengerType || 'adult',
//       phone: p.phone || p.passengerPhone || (p.phoneNumber ? `${p.phoneCountryCode ? '+' + p.phoneCountryCode + ' ' : ''}${p.phoneNumber}` : '') || (pIdx === 0 ? profilePhone : ''),
//     }))
//     : [{
//       name: travelerProfile
//         ? [travelerProfile.firstName, travelerProfile.lastName].filter(Boolean).join(' ') || travelerProfile.fullName || travelerProfile.displayName || ''
//         : '',
//       nationality: travelerProfile?.nationality || '',
//       documentNumber: '',
//       type: 'adult',
//       phone: profilePhone,
//     }];

//   return (
//     <>
//       {displayPassengers.map((p, pIdx) => {
//         const globalIdx = `${index}-${pIdx}`;
//         const telLink = p.phone ? `tel:${p.phone.replace(/\s+/g, '')}` : '#';

//         return (
//           <div key={globalIdx}>
//             <button
//               onClick={onToggle}
//               className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-muted/30 border hover:bg-muted/60 transition-colors text-sm"
//             >
//               <span className="flex items-center gap-2">
//                 <span className="font-mono text-xs text-muted-foreground">#{index + 1}</span>
//                 <span className="font-semibold">{p.name || (travelerProfile === null && !hasPassengerDetails ? '...' : t('traveler'))}</span>
//                 {p.phone && (
//                   <a href={telLink} onClick={e => e.stopPropagation()} className="font-mono text-[11px] text-emerald-400 hover:text-emerald-300" dir="ltr">{p.phone}</a>
//                 )}
//               </span>
//               <Badge
//                 variant={booking.status === 'Confirmed' ? 'default' : booking.status === 'Pending-Payment-Verification' ? 'default' : 'secondary'}
//                 className={`text-[10px] ${booking.status === 'Pending-Payment-Verification' ? 'bg-blue-500 text-white' : ''}`}
//               >
//                 {booking.status === 'Confirmed' ? t('confirmed') :
//                   booking.status === 'Pending-Carrier-Confirmation' ? t('pendingConfirm') :
//                     booking.status === 'Pending-Payment-Verification' ? t('pendingVerification') : t('pendingPayment')}
//               </Badge>
//             </button>
//             {isSelected && (
//               <div className="bg-muted/20 border border-t-0 rounded-b-lg px-3 py-2 space-y-2 text-sm animate-in fade-in duration-150">
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">{t('seatsNum')}</span>
//                   <span className="font-semibold">{booking.seats}</span>
//                 </div>
//                 {p.nationality && (
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">{t('nationality')}</span>
//                     <span className="font-semibold">{p.nationality}</span>
//                   </div>
//                 )}
//                 {p.documentNumber && (
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">{t('docNumber')}</span>
//                     <span className="font-mono font-semibold">{p.documentNumber}</span>
//                   </div>
//                 )}
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">{t('docType')}</span>
//                   <span className="font-semibold">
//                     {p.type === 'adult' ? t('adult') : p.type === 'minor' ? t('minor') : t('infant')}
//                   </span>
//                 </div>
//                 {p.phone && (
//                   <div className="flex justify-between items-center">
//                     <span className="text-muted-foreground">{t('phoneTrev')}</span>
//                     <a href={telLink} className="font-mono font-semibold text-emerald-400 hover:text-emerald-300 transition-colors" dir="ltr">{p.phone}</a>
//                   </div>
//                 )}
//                 {booking.bookedByCarrier && (
//                   <Button variant="destructive" size="sm" className="w-full gap-2 mt-1"
//                     onClick={() => onCancel(booking.id)}>
//                     <Ban className="h-3.5 w-3.5" /> {t('cancelBooking')}
//                   </Button>
//                 )}
//               </div>
//             )}
//           </div>
//         );
//       })}
//     </>
//   );
// }

// function TripPassengers({ trip }: { trip: Trip }) {
//   const firestore = useFirestore();
//   const { toast } = useToast();
//   const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
//   const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);
//   const [loadingCancel, setLoadingCancel] = useState(false);
//   const t = useTranslations('carrier')

//   const bookingsQuery1 = useMemoFirebase(() => {
//     if (!firestore || !trip.id) return null;
//     return query(
//       collection(firestore, 'bookings'),
//       where('tripId', '==', trip.id),
//       where('status', 'in', ['Confirmed', 'Pending-Carrier-Confirmation', 'Pending-Payment', 'Pending-Payment-Verification'])
//     );
//   }, [firestore, trip.id]);

//   const bookingsQuery2 = useMemoFirebase(() => {
//     if (!firestore || !trip.id) return null;
//     return query(
//       collection(firestore, 'bookings'),
//       where('carrierTripId', '==', trip.id),
//       where('status', 'in', ['Confirmed', 'Pending-Carrier-Confirmation', 'Pending-Payment', 'Pending-Payment-Verification'])
//     );
//   }, [firestore, trip.id]);

//   const { data: bookings1 } = useCollection<Booking>(bookingsQuery1);
//   const { data: bookings2 } = useCollection<Booking>(bookingsQuery2);

//   const bookings = useMemo(() => {
//     const all = [...(bookings1 || []), ...(bookings2 || [])];
//     const seen = new Set<string>();
//     return all.filter(b => {
//       if (seen.has(b.id)) return false;
//       seen.add(b.id);
//       return true;
//     });
//   }, [bookings1, bookings2]);

//   const handleCancelBooking = async () => {
//     if (!firestore || !cancellingBookingId) return;
//     setLoadingCancel(true);
//     try {
//       const booking = bookings.find(b => b.id === cancellingBookingId);
//       if (!booking) return;
//       await updateDoc(doc(firestore, 'bookings', cancellingBookingId), {
//         status: 'Cancelled', cancelledBy: 'carrier',
//         cancelledAt: serverTimestamp(), updatedAt: serverTimestamp()
//       });
//       await updateDoc(doc(firestore, 'trips', trip.id), {
//         availableSeats: increment(booking.seats), updatedAt: serverTimestamp()
//       });
//       if (booking.userId) {
//         await addDoc(collection(firestore, 'notifications'), {
//           userId: booking.userId, title: t('cancelledNotif'),
//           message: t('cancelledByCarrier'), type: 'trip_update',
//           isRead: false, createdAt: serverTimestamp()
//         });
//       }
//       toast({ title: t('cancelSuccess') });
//       setCancellingBookingId(null);
//       setSelectedIndex(null);
//     } catch {
//       toast({ variant: 'destructive', title: t('cancelFailed') });
//     } finally {
//       setLoadingCancel(false);
//     }
//   };

//   if (bookings.length === 0) return (
//     <p className="text-xs text-muted-foreground text-center py-2">{t('noSeatsYet')}</p>
//   );

//   return (
//     <>
//       <div className="space-y-2">
//         {bookings.map((b, i) => (
//           <BookingPassengerRow
//             key={b.id}
//             booking={b}
//             index={i}
//             isSelected={selectedIndex === i}
//             onToggle={() => setSelectedIndex(selectedIndex === i ? null : i)}
//             onCancel={setCancellingBookingId}
//             t={t}
//           />
//         ))}
//       </div>

//       <AlertDialog open={!!cancellingBookingId} onOpenChange={(o) => !o && setCancellingBookingId(null)}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle className="text-destructive flex items-center gap-2">
//               <AlertTriangle className="h-5 w-5" /> {t('confirmCancelTitle')}
//             </AlertDialogTitle>
//             <AlertDialogDescription>
//               {t('confirmCancelDesc')}
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel disabled={loadingCancel}>{t('goBack')}</AlertDialogCancel>
//             <AlertDialogAction onClick={handleCancelBooking} disabled={loadingCancel}
//               className="bg-destructive">
//               {loadingCancel ? <Loader2 className="h-4 w-4 animate-spin" /> : t('confirmCancelTitle')}
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </>
//   );
// }

// // ── Opportunity Row ──
// function OpportunityRow({ opportunity, carrierId, isOpen, onToggle, onOffer }: {
//   opportunity: Trip; carrierId: string; isOpen: boolean; onToggle: () => void; onOffer: (passengerIntentId: string) => void;
// }): JSX.Element {
//   const firestore = useFirestore();
//   const t = useTranslations('carrier');
//   const [traveler, setTraveler] = useState<UserProfile | null>(null);

//   useEffect(() => {
//     if (!firestore || !opportunity.userId || traveler) return;
//     fetchUserCached(firestore, opportunity.userId).then(profile => {
//       if (profile) setTraveler(profile);
//     }).catch(e => console.error('Failed to fetch traveler:', e));
//   }, [firestore, opportunity.userId]);

//   const isDirectRequest = opportunity.requestType === 'Direct' && opportunity.targetCarrierId === carrierId;

//   return (
//     <div>
//       <button onClick={onToggle}
//         className={cn(
//           "w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-colors text-sm",
//           isDirectRequest
//             ? "bg-primary/10 border-primary/30 hover:bg-primary/20"
//             : "bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20"
//         )}>
//         <span className="flex items-center gap-2 flex-wrap">
//           <UserCircle className={cn("h-4 w-4 shrink-0", isDirectRequest ? "text-primary" : "text-amber-500",
//             opportunity.creatorRole === 'agent' ? "text-blue-400" : ""
//           )} />
//           {opportunity.creatorRole === 'agent' ? (
//             <span className="font-semibold text-blue-400">{opportunity.agentName || t('agent')}</span>
//           ) : (
//             <span className="font-semibold">{traveler?.firstName || t('traveler')}</span>
//           )}
//           <span className="text-xs text-muted-foreground">• {typeof opportunity.passengers === 'number' ? opportunity.passengers : ''} {t('seat')}</span>
//           {opportunity.creatorRole === 'agent' && opportunity.agentFee ? (
//             <span className="text-[10px] font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
//               {t('agentFee')}: {opportunity.agentFee} {opportunity.currency || 'JOD'}
//             </span>
//           ) : null}
//         </span>
//         <div className="flex items-center gap-2">
//           {opportunity.creatorRole === 'agent' && (
//             <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-[10px] gap-1">🤝 {t('agent')}</Badge>
//           )}
//           {isDirectRequest && (
//             <Badge className="bg-primary text-[10px] gap-1"><Star className="h-3 w-3" /> {t('customRequest')}</Badge>
//           )}
//         </div>
//       </button>

//       {isOpen && (
//         <div className="bg-muted/20 border border-t-0 rounded-b-lg px-3 py-3 space-y-2 text-sm animate-in fade-in duration-150">
//           <div className="flex justify-between">
//             <span className="text-muted-foreground">{t('travelerName')}</span>
//             <span className="font-semibold">
//               {[traveler?.firstName, traveler?.lastName].filter(Boolean).join(' ') || t('traveler')}
//             </span>
//           </div>
//           {(traveler?.phoneNumber) && (
//             <div className="flex justify-between items-center">
//               <span className="text-muted-foreground">{t('phoneTrev')}</span>
//               <a 
//                 href={`tel:+${traveler.phoneCountryCode || ''}${traveler.phoneNumber}`} 
//                 className="font-semibold font-mono hover:text-emerald-400 transition-colors" 
//                 dir="ltr"
//               >
//                 {traveler.phoneCountryCode ? `+${traveler.phoneCountryCode} ` : ''}{traveler.phoneNumber}
//               </a>
//             </div>
//           )}
//           <div className="flex justify-between">
//             <span className="text-muted-foreground">{t('seatsNum')}</span>
//             <span className="font-semibold">{typeof opportunity.passengers === 'number' ? opportunity.passengers : ''} {t('seat')}</span>
//           </div>
//           <div className="flex justify-between">
//             <span className="text-muted-foreground">{t('requestType')}</span>
//             <span className={cn("font-semibold", isDirectRequest ? "text-primary" : "text-amber-500")}>
//               {isDirectRequest ? t('directForYou') : t('generalMarket')}
//             </span>
//           </div>
//           {opportunity.creatorRole === 'agent' && (
//             <>
//               <div className="flex justify-between items-center bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-2">
//                 <span className="text-muted-foreground text-xs">{t('requestFromAgent')}</span>
//                 <span className="font-black text-blue-400 text-sm">{opportunity.agentName || t('agent')}</span>
//               </div>
//               {opportunity.agentFee ? (
//                 <div className="flex justify-between items-center bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
//                   <span className="text-muted-foreground text-xs">{t('requestedFee')}</span>
//                   <span className="font-black text-amber-400 text-sm">{opportunity.agentFee} {opportunity.currency || 'JOD'}</span>
//                 </div>
//               ) : null}
//             </>
//           )}
//           {opportunity.notes && (
//             <div className="bg-muted/30 rounded p-2 text-xs text-muted-foreground">
//               {opportunity.notes}
//             </div>
//           )}
//           <Button size="sm" className="w-full mt-2" onClick={() => onOffer(opportunity.id)}>
//             {t('sendOffer')}
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// }

// // ── Direct Opportunities ──
// function DirectOpportunities({ trip, carrierId }: { trip: Trip; carrierId: string }) {
//   const firestore = useFirestore();
//   const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
//   const [currentPassengerIntentId, setCurrentPassengerIntentId] = useState('');
//   const t = useTranslations('carrier')
//   const { openOfferDialog, selectedTrip, isDialogOpen, setIsDialogOpen, handleSendOffer } = useOfferDialog();

//   const q = useMemoFirebase(() => {
//     if (!firestore) return null;
//     return query(
//       collection(firestore, 'trips'),
//       where('status', '==', 'Awaiting-Offers'),
//       where('origin', '==', trip.origin),
//       where('destination', '==', trip.destination),
//       limit(10)
//     );
//   }, [firestore, trip.origin, trip.destination, carrierId]);

//   const { data: opps } = useCollection<Trip>(q);

//   const filteredOpps = useMemo(() => {
//     if (!opps) return [];
//     return opps.filter(opp => opp.requestType === 'Direct' && opp.targetCarrierId === carrierId);
//   }, [opps, carrierId]);

//   if (!filteredOpps || filteredOpps.length === 0) return (
//     <p className="text-xs text-muted-foreground text-center py-2">{t('noDirectOrders')}</p>
//   );

//   return (
//     <>
//       <div className="space-y-2">
//         {filteredOpps.map((opp, i) => (
//           <OpportunityRow key={opp.id} opportunity={opp} carrierId={carrierId}
//             isOpen={selectedIndex === i} onToggle={() => setSelectedIndex(selectedIndex === i ? null : i)}
//             onOffer={(passengerIntentId) => {
//               openOfferDialog(trip);
//               setCurrentPassengerIntentId(passengerIntentId);
//             }}
//           />
//         ))}
//       </div>
//       {selectedTrip && (
//         <OfferDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} trip={selectedTrip}
//           onSendOffer={(offerData) => handleSendOffer(offerData, currentPassengerIntentId)}
//         />
//       )}
//     </>
//   );
// }

// // ── General Opportunities ──
// function GeneralOpportunities({ trip, carrierId }: { trip: Trip; carrierId: string }) {
//   const firestore = useFirestore();
//   const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
//   const [currentPassengerIntentId, setCurrentPassengerIntentId] = useState('');
//   const t = useTranslations('carrier')
//   const { openOfferDialog, selectedTrip, isDialogOpen, setIsDialogOpen, handleSendOffer } = useOfferDialog();

//   const q = useMemoFirebase(() => {
//     if (!firestore) return null;
//     return query(
//       collection(firestore, 'trips'),
//       where('status', '==', 'Awaiting-Offers'),
//       where('origin', '==', trip.origin),
//       where('destination', '==', trip.destination),
//       limit(10)
//     );
//   }, [firestore, trip.origin, trip.destination]);

//   const { data: opps } = useCollection<Trip>(q);

//   const filteredOpps = useMemo(() => {
//     if (!opps) return [];
//     return opps.filter(opp => opp.requestType === 'General');
//   }, [opps]);

//   if (!filteredOpps || filteredOpps.length === 0) return <p className="text-xs text-muted-foreground text-center py-2">{t('noGeneralOrders')}</p>;

//   return (
//     <>
//       <div className="space-y-2">
//         {filteredOpps.map((opp, i) => (
//           <OpportunityRow key={opp.id} opportunity={opp} carrierId={carrierId}
//             isOpen={selectedIndex === i} onToggle={() => setSelectedIndex(selectedIndex === i ? null : i)}
//             onOffer={(passengerIntentId) => {
//               openOfferDialog(trip);
//               setCurrentPassengerIntentId(passengerIntentId);
//             }}
//           />
//         ))}
//       </div>
//       {selectedTrip && (
//         <OfferDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} trip={selectedTrip}
//           onSendOffer={(offerData) => handleSendOffer(offerData, currentPassengerIntentId)}
//         />
//       )}
//     </>
//   );
// }

// // ── Single Trip Card ───────────────────────────────────────────────
// function TripCard({ trip, onEdit, carrierProfile }: { trip: Trip; onEdit: (trip: Trip) => void; carrierProfile: UserProfile | null }) {
//   const locale = useLocale();
//   const { user } = useUser();
//   const [manifestOpen, setManifestOpen] = useState(false);
//   const [cancelOpen, setCancelOpen] = useState(false);
//   const [showBlockingAlert, setShowBlockingAlert] = useState(false);
//   const [directBookingOpen, setDirectBookingOpen] = useState(false);
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

//   const isThisProcessing = isProcessing?.endsWith(trip.id);
//   const capacity = carrierProfile?.vehicleCapacity || (trip as any).vehicleCapacity || 0;
//   const available = trip.availableSeats ?? 0;
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

//           {trip.status === 'In-Transit' ? (
//             <Button size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white gap-2" onClick={() => completeTrip(trip)} disabled={!!isThisProcessing}>
//               {isThisProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />} {t('endTrip')}
//             </Button>
//           ) : (
//             <div className="flex gap-2">
//               <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => setManifestOpen(true)} disabled={!!isThisProcessing}>
//                 <User className="h-4 w-4" /> {t('Statement')}
//               </Button>
//               <Button variant="ghost" size="icon"
//                 className={cn("h-9 w-9", hasBookings ? "text-muted-foreground opacity-40 cursor-not-allowed" : "text-blue-600")}
//                 onClick={() => !hasBookings && onEdit(trip)}
//                 disabled={isCompleted || !!isThisProcessing || !!hasBookings}
//               >
//                 <Edit className="h-4 w-4" />
//               </Button>
//               <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 h-9 w-9"
//                 onClick={() => hasBookings ? setShowBlockingAlert(true) : setCancelOpen(true)}
//                 disabled={isCompleted || !!isThisProcessing || !!hasBookings}
//               >
//                 <Trash2 className="h-4 w-4" />
//               </Button>
//             </div>
//           )}
//         </div>
//       </Card>

//       <DirectBookingDialog trip={trip} isOpen={directBookingOpen} onClose={() => setDirectBookingOpen(false)} />
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
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter><AlertDialogCancel>{t('understood')}</AlertDialogCancel></AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </>
//   );
// }

// // ── Main Export ────────────────────────────────────────────────────
// export function MyTripsList({ trips, isLoading, onEdit, carrierProfile }: MyTripsListProps) {
//   const t = useTranslations('myTripsList');
//   if (isLoading) return <div className="text-center py-10 text-muted-foreground">جاري التحميل...</div>;
//   if (!trips?.length) return (
//     <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-lg bg-card col-span-full">
//       <Route className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
//       <p className="font-bold">{t('emptyTitle')}</p>
//       <p className="text-sm mt-1">{t('createTrip')}</p>
//     </div>
//   );

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//       {trips.map(trip => (
//         <TripCard key={trip.id} trip={trip} onEdit={onEdit} carrierProfile={carrierProfile} />
//       ))}
//     </div>
//   );
// }
'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2, Loader2, CheckCircle2, AlertTriangle, User, Route, UserPlus, Ban, UserCircle, Store, Star, Phone } from 'lucide-react';
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

interface MyTripsListProps {
  trips: Trip[];
  isLoading: boolean;
  onEdit: (trip: Trip) => void;
  carrierProfile: UserProfile | null;
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
function BookingPassengerRow({ booking, index, isSelected, onToggle, onCancel, t }: any) {
  const firestore = useFirestore();
  const [profile, setProfile] = useState<any>(null);
  useEffect(() => {
    if (booking.userId) fetchUserCached(firestore, booking.userId).then(setProfile);
  }, [firestore, booking.userId]);

  const p = booking.passengersDetails?.[0] || {};
  const phone = p.phone || p.phoneNumber || (profile?.phoneNumber ? `${profile.phoneCountryCode ? '+' + profile.phoneCountryCode + ' ' : ''}${profile.phoneNumber}` : '');

  return (
    <div className="space-y-1">
      <button onClick={onToggle} className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-muted/30 border text-sm">
        <span className="flex items-center gap-2"><span className="font-mono text-xs text-muted-foreground">#{index + 1}</span><span className="font-semibold">{p.name || profile?.firstName || t('traveler')}</span></span>
        <Badge variant={booking.status === 'Confirmed' ? 'default' : 'secondary'} className="text-[10px]">{booking.status === 'Confirmed' ? t('confirmed') : t('pendingConfirm')}</Badge>
      </button>
      {isSelected && (
        <div className="bg-muted/20 border border-t-0 rounded-b-lg px-3 py-3 space-y-2 text-sm animate-in fade-in">
          <div className="flex justify-between"><span className="text-muted-foreground">{t('phoneTrev')}</span><a href={`tel:${phone?.replace(/\s+/g, '')}`} className="font-mono font-bold text-emerald-400" dir="ltr">{phone || '—'}</a></div>
          <div className="flex justify-between"><span className="text-muted-foreground">{t('docNumber')}</span><span className="font-mono">{p.documentNumber || '—'}</span></div>
          {booking.bookedByCarrier && <Button variant="destructive" size="sm" className="w-full mt-2" onClick={() => onCancel(booking.id)}><Ban className="size-3.5 ml-1" /> {t('cancelBooking')}</Button>}
        </div>
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

  const q = useMemoFirebase(() => !firestore || !trip.id ? null : query(collection(firestore, 'bookings'), where('tripId', '==', trip.id), where('status', 'in', ['Confirmed', 'Pending-Carrier-Confirmation'])), [firestore, trip.id]);
  const { data: bookings } = useCollection<Booking>(q);

  if (!bookings?.length) return <p className="text-xs text-muted-foreground text-center py-2">{t('noSeatsYet')}</p>;

  return (
    <div className="space-y-2">
      {bookings.map((b, i) => <BookingPassengerRow key={b.id} booking={b} index={i} isSelected={selectedIndex === i} onToggle={() => setSelectedIndex(selectedIndex === i ? null : i)} onCancel={setCancellingId} t={t} />)}
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
  return (<><div className="space-y-2">{filtered.map((opp, i) => <OpportunityRow key={opp.id} opportunity={opp} carrierId={carrierId} isOpen={selectedIndex === i} onToggle={() => setSelectedIndex(selectedIndex === i ? null : i)} onOffer={(id: any) => { setIntentId(id); openOfferDialog(trip); }} />)}</div>{selectedTrip && <OfferDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} trip={selectedTrip} onSendOffer={(d) => handleSendOffer(d, intentId)} />}</>);
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
  return (<><div className="space-y-2">{filtered.map((opp, i) => <OpportunityRow key={opp.id} opportunity={opp} carrierId={carrierId} isOpen={selectedIndex === i} onToggle={() => setSelectedIndex(selectedIndex === i ? null : i)} onOffer={(id: any) => { setIntentId(id); openOfferDialog(trip); }} />)}</div>{selectedTrip && <OfferDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} trip={selectedTrip} onSendOffer={(d) => handleSendOffer(d, intentId)} />}</>);
}

// ── Single Trip Card ───────────────────────────────────────────────
// function TripCard({ trip, onEdit, carrierProfile }: any) {
//   const locale = useLocale();
//   const { user } = useUser();
//   const [manifestOpen, setManifestOpen] = useState(false);
//   const [cancelOpen, setCancelOpen] = useState(false);
//   const [blockingAlert, setBlockingAlert] = useState(false);
//   const [directBookingOpen, setDirectBookingOpen] = useState(false);
//   const { completeTrip, cancelTrip } = useTripActions();
//   const t = useTranslations('carrier');

//   const depDate = parseFirestoreDate(trip.departureDate);
//   const isCompleted = ['Completed', 'Cancelled'].includes(trip.status) || new Date(depDate.getTime() + (trip.estimatedDurationHours || 0) * 3600000) < new Date();
//   const isDeparted = depDate < new Date();
//   const isFull = (trip.availableSeats || 0) <= 0;
//   const bookedCount = (carrierProfile?.vehicleCapacity || trip.vehicleCapacity || 0) - (trip.availableSeats || 0);

//   return (
//     <>
//       <Card className={cn("relative overflow-hidden border-2 transition-all duration-300", isCompleted ? "opacity-60 pointer-events-none" : "border-blue-400 hover:shadow-lg")}>
//         {isCompleted &&
//           <div className="absolute inset-0 bg-black/40 z-50 flex items-center justify-center">
//             <span className="text-white font-bold text-lg">{t('endTrip')}</span>
//           </div>}
//         <div className="p-4 bg-[#200a0f89] border-b border-amber-200/20 flex justify-between items-center"><h2 className="text-lg font-bold text-white">{getCityName(trip.origin, locale)} ← {getCityName(trip.destination, locale)}</h2><Badge variant="outline" className="text-white text-[10px]">{trip.status}</Badge></div>
//         <div className="p-4 space-y-4 bg-[#200a0f89]">
//           <div className="flex justify-between items-center"><h3 className="text-sm font-bold text-white">{isFull ? `🚫 ${t('flightFull')}` : `🪑 ${t('emptySeats')} : ${trip.availableSeats}`}</h3>{!isFull && <Button size="sm" variant="outline" className="text-xs h-8 border-primary/40 text-primary" onClick={() => setDirectBookingOpen(true)} disabled={isCompleted || isDeparted}><UserPlus className="size-3.5 ml-1" /> {t('bookedYourClients')}</Button>}</div>
//           <div className="space-y-3 pt-2">
//             <div className="flex items-center gap-1.5 text-primary text-sm font-black"><UserCircle className="size-4" /> {t('clientRequests')}</div>
//             <DirectOpportunities trip={trip} carrierId={user?.uid || ''} />
//             <div className="flex items-center gap-1.5 text-amber-500 text-sm font-black pt-1"><Store className="size-4" /> {t('requestsMarket')}</div>
//             <GeneralOpportunities trip={trip} carrierId={user?.uid || ''} />
//           </div>
//           <div className="space-y-2 pt-2 border-t border-white/10"><h3 className="text-sm font-bold flex items-center gap-2 text-white"><User className="size-4 text-primary" />{t('reservedSeats')} ({bookedCount})</h3><TripPassengers trip={trip} /></div>
//           <div className="flex gap-2 pt-2"><Button variant="outline" size="sm" className="flex-1" onClick={() => setManifestOpen(true)}>{t('Statement')}</Button><Button variant="ghost" size="icon" className="text-blue-500" onClick={() => onEdit(trip)} disabled={isCompleted || (trip.bookingIds?.length > 0)}><Edit className="size-4" /></Button><Button variant="ghost" size="icon" className="text-destructive" onClick={() => trip.bookingIds?.length > 0 ? setBlockingAlert(true) : setCancelOpen(true)} disabled={isCompleted}><Trash2 className="size-4" /></Button></div>
//         </div>
//       </Card>
//       <DirectBookingDialog trip={trip} isOpen={directBookingOpen} onClose={() => setDirectBookingOpen(false)} />
//       <TripManifestDialog tripId={manifestOpen ? trip.id : null} trip={manifestOpen ? trip : null} open={manifestOpen} onOpenChange={setManifestOpen} />
//       <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>{t('confirmCancelTitle')}</AlertDialogTitle><AlertDialogDescription>{t('confirmCancelDesc')}</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>{t('goBack')}</AlertDialogCancel><AlertDialogAction onClick={() => { cancelTrip(trip); setCancelOpen(false); }} className="bg-destructive">{t('cancelTrip')}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
//       <AlertDialog open={blockingAlert} onOpenChange={setBlockingAlert}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle className="flex items-center gap-2 text-destructive"><AlertTriangle className="size-5" /> {t('sovereignLawTitle')}</AlertDialogTitle><AlertDialogDescription className="font-bold text-foreground">{t('cannotCancelBooked')}</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>{t('understood')}</AlertDialogCancel></AlertDialogFooter></AlertDialogContent></AlertDialog>
//     </>
//   );
// }

function TripCard({ trip, onEdit, carrierProfile }: { trip: Trip; onEdit: (trip: Trip) => void; carrierProfile: UserProfile | null }) {
  const locale = useLocale();
  const { user } = useUser();
  const [manifestOpen, setManifestOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [showBlockingAlert, setShowBlockingAlert] = useState(false);
  const [directBookingOpen, setDirectBookingOpen] = useState(false);
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

  const isThisProcessing = isProcessing?.endsWith(trip.id);
  const capacity = carrierProfile?.vehicleCapacity || (trip as any).vehicleCapacity || 0;
  const available = trip.availableSeats ?? 0;
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

          {/* <div className="space-y-2">
            <div className="flex gap-1 items-center">
              <UserCircle className="size-4 text-primary" />
              <h3 className="text-sm font-bold">{t('clientRequests')}</h3>
            </div>
            <DirectOpportunities trip={trip} carrierId={carrierId} />
          </div> */}

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

          {trip.status === 'In-Transit' ? (
            <Button size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white gap-2" onClick={() => completeTrip(trip)} disabled={!!isThisProcessing}>
              {isThisProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />} {t('endTrip')}
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => setManifestOpen(true)} disabled={!!isThisProcessing}>
                <User className="h-4 w-4" /> {t('Statement')}
              </Button>
              <Button variant="ghost" size="icon"
                className={cn("h-9 w-9", hasBookings ? "text-muted-foreground opacity-40 cursor-not-allowed" : "text-blue-600")}
                onClick={() => !hasBookings && onEdit(trip)}
                disabled={isCompleted || !!isThisProcessing || !!hasBookings}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 h-9 w-9"
                onClick={() => hasBookings ? setShowBlockingAlert(true) : setCancelOpen(true)}
                disabled={isCompleted || !!isThisProcessing || !!hasBookings}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </Card>

      <DirectBookingDialog trip={trip} isOpen={directBookingOpen} onClose={() => setDirectBookingOpen(false)} />
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
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>{t('understood')}</AlertDialogCancel></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
// ── Main Export ────────────────────────────────────────────────────
export function MyTripsList({ trips, isLoading, onEdit, carrierProfile }: MyTripsListProps) {
  const t = useTranslations('myTripsList');
  if (isLoading) return <div className="text-center py-10 text-muted-foreground">جاري التحميل...</div>;
  if (!trips?.length) return <div className="text-center py-16 border-2 border-dashed rounded-lg bg-card col-span-full"><Route className="mx-auto h-12 w-12 opacity-20 mb-4" /><p className="font-bold">{t('emptyTitle')}</p></div>;
  return <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{trips.map(trip => <TripCard key={trip.id} trip={trip} onEdit={onEdit} carrierProfile={carrierProfile} />)}</div>;
}