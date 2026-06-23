
// // // // // // // 'use client';

// // // // // // // import { useParams, useRouter } from 'next/navigation';
// // // // // // // import { useFirestore, useMemoFirebase, useCollection } from '@/firebase';
// // // // // // // import { collection, query, where, limit, updateDoc, serverTimestamp, doc } from 'firebase/firestore';
// // // // // // // import { TicketHeader } from '@/components/traveler/ticket-header';
// // // // // // // import { HeroTicket } from '@/components/history/hero-ticket';
// // // // // // // import { ProxyWaitingState } from '@/components/traveler/proxy-waiting-state';
// // // // // // // import { Skeleton } from '@/components/ui/skeleton';
// // // // // // // import type { Trip, Booking } from '@/lib/data';
// // // // // // // import { LocalErrorBoundary } from '@/components/ui/local-error-boundary';
// // // // // // // import { ShieldAlert, RefreshCw } from 'lucide-react';
// // // // // // // import { Button } from '@/components/ui/button';
// // // // // // // import { useMemo, useEffect } from 'react';
// // // // // // // import { FloatingChatBubble } from '@/components/traveler/floating-chat-bubble';
// // // // // // // import { useLiveTripReactor } from '@/hooks/use-live-trip-reactor';

// // // // // // // /**
// // // // // // //  * @page SmartTicketPage
// // // // // // //  * @description THE REINFORCED NEURAL HUB (STERILIZED - V18.0 - SCR-933 RE-LINKED)
// // // // // // //  * [SCR-933]: Injected useLiveTripReactor for zero-latency arterial updates.
// // // // // // //  * [SCR-921]: Eradicated Double Echo & Ghost Twinning. 
// // // // // // //  * Protocol 16: Sterilized. Protocol 88: Zero Network Chatter.
// // // // // // //  */
// // // // // // // export default function SmartTicketPage() {
// // // // // // //   const params = useParams();
// // // // // // //   const tripId = params.id as string;
// // // // // // //   const firestore = useFirestore();
// // // // // // //   const router = useRouter();

// // // // // // //   // [SCR-914] Pulse Sensor: Track ticket views once per session
// // // // // // //   useEffect(() => {
// // // // // // //     if (!firestore || !tripId) return;

// // // // // // //     const transmitViewPulse = async () => {
// // // // // // //       const storageKey = `safar_ticket_viewed_${tripId}`;
// // // // // // //       if (typeof window !== 'undefined' && sessionStorage.getItem(storageKey)) return;

// // // // // // //       try {
// // // // // // //         const tripRef = doc(firestore, 'trips', tripId);
// // // // // // //         // [SCR-921] Atomic Stamp: Using serverTimestamp for the Time Nucleus
// // // // // // //         await updateDoc(tripRef, { viewedAt: serverTimestamp() });
// // // // // // //         sessionStorage.setItem(storageKey, 'true');
// // // // // // //       } catch (error) {
// // // // // // //         console.warn("[Pulse Sensor] Transmission silenced.");
// // // // // // //       }
// // // // // // //     };

// // // // // // //     transmitViewPulse();
// // // // // // //   }, [firestore, tripId]);

// // // // // // //   // [SCR-933] ARTERIAL LINK: Replacing useDoc with the specialized Live Reactor
// // // // // // //   const { trip, isLoading: isTripLoading, error: reactorError } = useLiveTripReactor(tripId);

// // // // // // //   // [SCR-916] Lazy Fetching: Artery opens only if status demands it
// // // // // // //   const bookingQuery = useMemoFirebase(() => {
// // // // // // //     const status = trip?.status;
// // // // // // //     if (!firestore || !tripId || status === 'Awaiting-Offers' || status === 'Pending-Carrier-Confirmation') return null;

// // // // // // //     return query(
// // // // // // //       collection(firestore, 'bookings'),
// // // // // // //       where('tripId', '==', tripId),
// // // // // // //       limit(1)
// // // // // // //     );
// // // // // // //   }, [firestore, tripId, trip?.status]);

// // // // // // //   const { data: bookingList, isLoading: isLoadingBooking } = useCollection<Booking>(bookingQuery);

// // // // // // //   const booking = useMemo(() => bookingList?.[0] || null, [bookingList]);

// // // // // // //   // [SCR-921] Time Nucleus Sync: Stabilize server time for child components
// // // // // // //   const serverTime = useMemo(() => {
// // // // // // //     if (!trip?.createdAt) return new Date();
// // // // // // //     return typeof trip.createdAt.toDate === 'function' ? trip.createdAt.toDate() : new Date(trip.createdAt);
// // // // // // //   }, [trip?.createdAt]);

// // // // // // //   const isLoading = isTripLoading || isLoadingBooking;

// // // // // // //   if (isLoading) {
// // // // // // //     return (
// // // // // // //       <div className="min-h-screen bg-background flex flex-col items-center">
// // // // // // //         <Skeleton className="h-24 w-full max-w-md sticky top-0" />
// // // // // // //         <main className="w-full max-w-md p-4 space-y-6">
// // // // // // //           <Skeleton className="h-64 w-full rounded-[2.5rem]" />
// // // // // // //         </main>
// // // // // // //       </div>
// // // // // // //     );
// // // // // // //   }

// // // // // // //   if (reactorError || !trip) {
// // // // // // //     return (
// // // // // // //       <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center gap-4">
// // // // // // //         <div className="bg-destructive/10 p-6 rounded-full">
// // // // // // //             <ShieldAlert className="h-16 w-16 text-destructive opacity-40 animate-pulse" />
// // // // // // //         </div>
// // // // // // //         <h1 className="text-2xl font-black tracking-tighter text-white">عذراً، التذكرة غير متاحة</h1>
// // // // // // //         <p className="text-sm text-muted-foreground font-bold">
// // // // // // //             {reactorError === 'TRIP_NOT_FOUND' ? 'ربما تمَّ إلغاء الرحلة نهائياً.' : 'لقد اصطدم الرادار بعائق تقني.'}
// // // // // // //         </p>
// // // // // // //         <div className="flex flex-col gap-2 w-full max-w-xs">
// // // // // // //             <Button variant="default" className="rounded-2xl h-12 px-8 font-black gap-2" onClick={() => window.location.reload()}>
// // // // // // //                 <RefreshCw className="h-4 w-4" /> إعادة محاولة الاتصال
// // // // // // //             </Button>
// // // // // // //             <Button variant="outline" className="rounded-2xl h-12 px-8 font-black" onClick={() => router.push('/')}>العودة للرئيسية</Button>
// // // // // // //         </div>
// // // // // // //       </div>
// // // // // // //     );
// // // // // // //   }

// // // // // // //   return (
// // // // // // //     <div className="min-h-screen bg-background flex flex-col items-center w-full pb-32 overscroll-none" dir="rtl">
// // // // // // //       <div className="w-full max-w-md mx-auto sticky top-0 z-50">
// // // // // // //          <TicketHeader tripId={tripId} carrierId={trip.carrierId} tripStatus={trip.status} />
// // // // // // //       </div>
// // // // // // //       <main className="flex-1 w-full max-w-md mx-auto p-4">
// // // // // // //           <LocalErrorBoundary fallbackTitle="تعثرت البوابة الذكية">
// // // // // // //             {booking ? (
// // // // // // //                 <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
// // // // // // //                     <HeroTicket 
// // // // // // //                         trip={trip} 
// // // // // // //                         booking={booking} 
// // // // // // //                         onRateTrip={() => {}} 
// // // // // // //                         onCancelBooking={() => {}} 
// // // // // // //                         onMessageCarrier={() => {}} 
// // // // // // //                         onMessageGroup={() => {}}
// // // // // // //                     />
// // // // // // //                 </div>
// // // // // // //             ) : (
// // // // // // //                 <ProxyWaitingState trip={trip} serverTime={serverTime} />
// // // // // // //             )}
// // // // // // //           </LocalErrorBoundary>
// // // // // // //       </main>

// // // // // // //       {/* [SCR-917] Hybrid Sovereign Chat */}
// // // // // // //       <FloatingChatBubble tripId={tripId} />
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // }



// // // // // // 'use client';

// // // // // // import { useParams, useRouter } from 'next/navigation';
// // // // // // import { useFirestore, useMemoFirebase, useCollection } from '@/firebase';
// // // // // // import { collection, query, where, limit, updateDoc, serverTimestamp, doc, getDoc, runTransaction } from 'firebase/firestore';
// // // // // // import { BookingPaymentDialog } from '@/components/booking/booking-payment-dialog';
// // // // // // import { TicketHeader } from '@/components/traveler/ticket-header';
// // // // // // import { HeroTicket } from '@/components/history/hero-ticket';
// // // // // // import { ProxyWaitingState } from '@/components/traveler/proxy-waiting-state';
// // // // // // import { Skeleton } from '@/components/ui/skeleton';
// // // // // // import type { Trip, Booking } from '@/lib/data';
// // // // // // import { LocalErrorBoundary } from '@/components/ui/local-error-boundary';
// // // // // // import { ShieldAlert, RefreshCw } from 'lucide-react';
// // // // // // import { Button } from '@/components/ui/button';
// // // // // // import { useMemo, useEffect, useState, useCallback } from 'react';
// // // // // // import { FloatingChatBubble } from '@/components/traveler/floating-chat-bubble';
// // // // // // import { useLiveTripReactor } from '@/hooks/use-live-trip-reactor';

// // // // // // /**
// // // // // //  * @page SmartTicketPage
// // // // // //  * @description THE REINFORCED NEURAL HUB (STERILIZED - V18.0 - SCR-933 RE-LINKED)
// // // // // //  * [SCR-933]: Injected useLiveTripReactor for zero-latency arterial updates.
// // // // // //  * [SCR-921]: Eradicated Double Echo & Ghost Twinning. 
// // // // // //  * Protocol 16: Sterilized. Protocol 88: Zero Network Chatter.
// // // // // //  */
// // // // // // export default function SmartTicketPage() {
// // // // // //   const params = useParams();
// // // // // //   const idParam = params.id as string;
// // // // // //   const firestore = useFirestore();
// // // // // //   const router = useRouter();

// // // // // //   // [SCR-ABF]: id قد يكون bookingId أو tripId — نحدد النوع الأول
// // // // // //   const [resolvedTripId, setResolvedTripId] = useState<string | null>(null);
// // // // // //   const [directBooking, setDirectBooking] = useState<Booking | null>(null);
// // // // // //   const [isResolving, setIsResolving] = useState(true);
// // // // // //   const [isPaymentOpen, setIsPaymentOpen] = useState(false);
// // // // // //   const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);

// // // // // //   useEffect(() => {
// // // // // //     if (!firestore || !idParam) return;
// // // // // //     const resolve = async () => {
// // // // // //       setIsResolving(true);
// // // // // //       try {
// // // // // //         // نحاول نجيبه من bookings أولاً
// // // // // //         const bookingSnap = await getDoc(doc(firestore, 'bookings', idParam));
// // // // // //         if (bookingSnap.exists()) {
// // // // // //           const b = { id: bookingSnap.id, ...bookingSnap.data() } as Booking;
// // // // // //           setDirectBooking(b);
// // // // // //           setResolvedTripId(b.tripId);
// // // // // //         } else {
// // // // // //           // مش booking → tripId مباشر
// // // // // //           setResolvedTripId(idParam);
// // // // // //         }
// // // // // //       } catch {
// // // // // //         setResolvedTripId(idParam);
// // // // // //       } finally {
// // // // // //         setIsResolving(false);
// // // // // //       }
// // // // // //     };
// // // // // //     resolve();
// // // // // //   }, [firestore, idParam]);

// // // // // //   const tripId = resolvedTripId || idParam;

// // // // // //   const handleConfirmPayment = useCallback(async (targetBooking: any, onSuccess: () => void) => {
// // // // // //     if (!firestore || !targetBooking?.id) return;
// // // // // //     setIsConfirmingPayment(true);
// // // // // //     try {
// // // // // //       const voucherId = `PAY-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
// // // // // //       await runTransaction(firestore, async (transaction) => {
// // // // // //         transaction.update(doc(firestore, 'bookings', targetBooking.id), {
// // // // // //           status: 'Pending-Payment-Verification',
// // // // // //           depositVoucherId: voucherId,
// // // // // //           paymentDeclaredAt: serverTimestamp(),
// // // // // //           updatedAt: serverTimestamp(),
// // // // // //         });
// // // // // //       });
// // // // // //       onSuccess();
// // // // // //       setIsPaymentOpen(false);
// // // // // //     } catch (e: any) {
// // // // // //       console.error('[TicketPage] Payment failed:', e);
// // // // // //     } finally {
// // // // // //       setIsConfirmingPayment(false);
// // // // // //     }
// // // // // //   }, [firestore]);

// // // // // //   // [SCR-914] Pulse Sensor: Track ticket views once per session
// // // // // //   useEffect(() => {
// // // // // //     if (!firestore || !tripId || isResolving) return;
// // // // // //     const transmitViewPulse = async () => {
// // // // // //       const storageKey = `safar_ticket_viewed_${tripId}`;
// // // // // //       if (typeof window !== 'undefined' && sessionStorage.getItem(storageKey)) return;
// // // // // //       try {
// // // // // //         await updateDoc(doc(firestore, 'trips', tripId), { viewedAt: serverTimestamp() });
// // // // // //         sessionStorage.setItem(storageKey, 'true');
// // // // // //       } catch (error) {
// // // // // //         console.warn("[Pulse Sensor] Transmission silenced.");
// // // // // //       }
// // // // // //     };
// // // // // //     transmitViewPulse();
// // // // // //   }, [firestore, tripId, isResolving]);

// // // // // //   // [SCR-933] ARTERIAL LINK
// // // // // //   const { trip, isLoading: isTripLoading, error: reactorError } = useLiveTripReactor(tripId);

// // // // // //   // [SCR-916] Lazy Fetching: لو عندنا booking مباشر من الـ id، مش محتاجين نعمل query
// // // // // //   const bookingQuery = useMemoFirebase(() => {
// // // // // //     if (!firestore || !tripId || directBooking) return null;
// // // // // //     const status = trip?.status;
// // // // // //     if (status === 'Awaiting-Offers' || status === 'Pending-Carrier-Confirmation') return null;
// // // // // //     return query(
// // // // // //       collection(firestore, 'bookings'),
// // // // // //       where('tripId', '==', tripId),
// // // // // //       limit(1)
// // // // // //     );
// // // // // //   }, [firestore, tripId, trip?.status, directBooking]);

// // // // // //   const { data: bookingList, isLoading: isLoadingBooking } = useCollection<Booking>(bookingQuery);

// // // // // //   const booking = useMemo(() => directBooking || bookingList?.[0] || null, [directBooking, bookingList]);

// // // // // //   // [SCR-921] Time Nucleus Sync: Stabilize server time for child components
// // // // // //   const serverTime = useMemo(() => {
// // // // // //     if (!trip?.createdAt) return new Date();
// // // // // //     return typeof trip.createdAt.toDate === 'function' ? trip.createdAt.toDate() : new Date(trip.createdAt);
// // // // // //   }, [trip?.createdAt]);

// // // // // //   const isLoading = isResolving || isTripLoading || isLoadingBooking;

// // // // // //   if (isLoading) {
// // // // // //     return (
// // // // // //       <div className="min-h-screen bg-background flex flex-col items-center">
// // // // // //         <Skeleton className="h-24 w-full max-w-md sticky top-0" />
// // // // // //         <main className="w-full max-w-md p-4 space-y-6">
// // // // // //           <Skeleton className="h-64 w-full rounded-[2.5rem]" />
// // // // // //         </main>
// // // // // //       </div>
// // // // // //     );
// // // // // //   }

// // // // // //   if (reactorError || !trip) {
// // // // // //     return (
// // // // // //       <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center gap-4">
// // // // // //         <div className="bg-destructive/10 p-6 rounded-full">
// // // // // //           <ShieldAlert className="h-16 w-16 text-destructive opacity-40 animate-pulse" />
// // // // // //         </div>
// // // // // //         <h1 className="text-2xl font-black tracking-tighter text-white">عذراً، التذكرة غير متاحة</h1>
// // // // // //         <p className="text-sm text-muted-foreground font-bold">
// // // // // //           {reactorError === 'TRIP_NOT_FOUND' ? 'ربما تمَّ إلغاء الرحلة نهائياً.' : 'لقد اصطدم الرادار بعائق تقني.'}
// // // // // //         </p>
// // // // // //         <div className="flex flex-col gap-2 w-full max-w-xs">
// // // // // //           <Button variant="default" className="rounded-2xl h-12 px-8 font-black gap-2" onClick={() => window.location.reload()}>
// // // // // //             <RefreshCw className="h-4 w-4" /> إعادة محاولة الاتصال
// // // // // //           </Button>
// // // // // //           <Button variant="outline" className="rounded-2xl h-12 px-8 font-black" onClick={() => router.push('/')}>العودة للرئيسية</Button>
// // // // // //         </div>
// // // // // //       </div>
// // // // // //     );
// // // // // //   }

// // // // // //   return (
// // // // // //     <div className="min-h-screen bg-background flex flex-col items-center w-full pb-32 overscroll-none" dir="rtl">
// // // // // //       <div className="w-full max-w-md mx-auto sticky top-0 z-50">
// // // // // //         <TicketHeader tripId={tripId} carrierId={trip.carrierId} tripStatus={trip.status} />
// // // // // //       </div>
// // // // // //       <main className="flex-1 w-full max-w-md mx-auto p-4">
// // // // // //         <LocalErrorBoundary fallbackTitle="تعثرت البوابة الذكية">
// // // // // //           {booking && booking.status === 'Pending-Carrier-Confirmation' ? (
// // // // // //             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
// // // // // //               <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-[2.5rem] p-8 text-center space-y-4">
// // // // // //                 <div className="text-4xl">⏳</div>
// // // // // //                 <h2 className="text-xl font-black tracking-tight">في انتظار موافقة الناقل</h2>
// // // // // //                 <p className="text-sm text-muted-foreground font-bold">
// // // // // //                   طلب الحجز وصل للناقل. سيتم إشعارك فور الموافقة.
// // // // // //                 </p>
// // // // // //                 <div className="bg-muted/30 p-4 rounded-2xl text-right space-y-2">
// // // // // //                   <div className="flex justify-between text-xs font-bold">
// // // // // //                     <span className="text-muted-foreground">المقاعد:</span>
// // // // // //                     <span>{booking.seats}</span>
// // // // // //                   </div>
// // // // // //                   <div className="flex justify-between text-xs font-bold">
// // // // // //                     <span className="text-muted-foreground">الإجمالي:</span>
// // // // // //                     <span>{booking.totalPrice} {booking.currency}</span>
// // // // // //                   </div>
// // // // // //                 </div>
// // // // // //               </div>
// // // // // //             </div>
// // // // // //           ) : booking && booking.status === 'Pending-Payment' ? (
// // // // // //             // الناقل وافق — المسافر محتاج يدفع العربون
// // // // // //             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
// // // // // //               <div className="bg-emerald-500/10 border-2 border-emerald-500/30 rounded-[2.5rem] p-8 text-center space-y-4">
// // // // // //                 <div className="text-5xl">✅</div>
// // // // // //                 <h2 className="text-xl font-black tracking-tight text-emerald-500">وافق الناقل على حجزك!</h2>
// // // // // //                 <p className="text-sm text-muted-foreground font-bold">
// // // // // //                   أكمل الحجز بدفع العربون الآن لتأكيد مقعدك.
// // // // // //                 </p>
// // // // // //                 <div className="bg-muted/30 p-4 rounded-2xl text-right space-y-2">
// // // // // //                   <div className="flex justify-between text-xs font-bold">
// // // // // //                     <span className="text-muted-foreground">المسار:</span>
// // // // // //                     <span>{trip.origin} ← {trip.destination}</span>
// // // // // //                   </div>
// // // // // //                   <div className="flex justify-between text-xs font-bold">
// // // // // //                     <span className="text-muted-foreground">المقاعد:</span>
// // // // // //                     <span>{booking.seats}</span>
// // // // // //                   </div>
// // // // // //                   <div className="flex justify-between text-xs font-bold">
// // // // // //                     <span className="text-muted-foreground">الإجمالي:</span>
// // // // // //                     <span className="font-black text-white">{booking.totalPrice} {booking.currency}</span>
// // // // // //                   </div>
// // // // // //                 </div>
// // // // // //                 <button
// // // // // //                   onClick={() => setIsPaymentOpen(true)}
// // // // // //                   className="w-full h-16 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xl rounded-3xl shadow-[0_20px_50px_rgba(22,163,74,0.4)] transition-all active:scale-95 flex items-center justify-center gap-3"
// // // // // //                 >
// // // // // //                   💳 ادفع العربون الآن
// // // // // //                 </button>
// // // // // //               </div>

// // // // // //               <BookingPaymentDialog
// // // // // //                 isOpen={isPaymentOpen}
// // // // // //                 onOpenChange={setIsPaymentOpen}
// // // // // //                 trip={trip}
// // // // // //                 booking={booking}
// // // // // //                 onConfirm={(receiptUrl) => handleConfirmPayment(booking, () => { })}
// // // // // //                 isProcessing={isConfirmingPayment}
// // // // // //               />
// // // // // //             </div>
// // // // // //           ) : booking ? (
// // // // // //             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
// // // // // //               <HeroTicket
// // // // // //                 trip={trip}
// // // // // //                 booking={booking}
// // // // // //                 onRateTrip={() => { }}
// // // // // //                 onCancelBooking={() => { }}
// // // // // //                 onMessageCarrier={() => { }}
// // // // // //                 onMessageGroup={() => { }}
// // // // // //               />
// // // // // //             </div>
// // // // // //           ) : (
// // // // // //             <ProxyWaitingState trip={trip} serverTime={serverTime} />
// // // // // //           )}
// // // // // //         </LocalErrorBoundary>
// // // // // //       </main>

// // // // // //       {/* [SCR-917] Hybrid Sovereign Chat */}
// // // // // //       <FloatingChatBubble tripId={tripId} />
// // // // // //     </div>
// // // // // //   );
// // // // // // }

// // // // // // 'use client';

// // // // // // import { useParams, useRouter } from 'next/navigation';
// // // // // // import { useFirestore, useMemoFirebase, useCollection } from '@/firebase';
// // // // // // import { collection, query, where, limit, updateDoc, serverTimestamp, doc, getDoc, runTransaction, increment, addDoc } from 'firebase/firestore';
// // // // // // import { BookingPaymentDialog } from '@/components/booking/booking-payment-dialog';
// // // // // // import { TicketHeader } from '@/components/traveler/ticket-header';
// // // // // // import { HeroTicket } from '@/components/history/hero-ticket';
// // // // // // import { ProxyWaitingState } from '@/components/traveler/proxy-waiting-state';
// // // // // // import { CancellationDialog } from '@/components/booking/cancellation-dialog';
// // // // // // import { Skeleton } from '@/components/ui/skeleton';
// // // // // // import type { Trip, Booking } from '@/lib/data';
// // // // // // import { LocalErrorBoundary } from '@/components/ui/local-error-boundary';
// // // // // // import { ShieldAlert, RefreshCw } from 'lucide-react';
// // // // // // import { Button } from '@/components/ui/button';
// // // // // // import { useMemo, useEffect, useState, useCallback } from 'react';
// // // // // // import { FloatingChatBubble } from '@/components/traveler/floating-chat-bubble';
// // // // // // import { useLiveTripReactor } from '@/hooks/use-live-trip-reactor';
// // // // // // import { useLocale } from 'next-intl';

// // // // // // /**
// // // // // //  * @page SmartTicketPage
// // // // // //  * @description THE REINFORCED NEURAL HUB (STERILIZED - V19.0 - SCR-PROXY-CHAT-CANCEL)
// // // // // //  * [V19.0]:
// // // // // //  *   - [SCR-CANCEL]: CancellationDialog مربوطة بدالة حقيقية:
// // // // // //  *       1. تغيير status الـ booking إلى Cancelled
// // // // // //  *       2. إرجاع الكراسي للرحلة عبر increment(+seats)
// // // // // //  *       3. إشعار للناقل
// // // // // //  *   - [SCR-PHONE-GATE]: استخراج allowedPhones من passengersDetails وتمريرها للـ FloatingChatBubble
// // // // // //  * Protocol 16: Sterilized. Protocol 88: Zero Network Chatter.
// // // // // //  */
// // // // // // export default function SmartTicketPage() {
// // // // // //   const params = useParams();
// // // // // //   const idParam = params.id as string;
// // // // // //   const firestore = useFirestore();
// // // // // //   const router = useRouter();
// // // // // //   const locale = useLocale();

// // // // // //   const [resolvedTripId, setResolvedTripId] = useState<string | null>(null);
// // // // // //   const [directBooking, setDirectBooking] = useState<Booking | null>(null);
// // // // // //   const [isResolving, setIsResolving] = useState(true);
// // // // // //   const [isPaymentOpen, setIsPaymentOpen] = useState(false);
// // // // // //   const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);

// // // // // //   // [SCR-CANCEL]: حالة نافذة الإلغاء
// // // // // //   const [isCancelOpen, setIsCancelOpen] = useState(false);
// // // // // //   const [isCancelling, setIsCancelling] = useState(false);

// // // // // //   useEffect(() => {
// // // // // //     if (!firestore || !idParam) return;
// // // // // //     const resolve = async () => {
// // // // // //       setIsResolving(true);
// // // // // //       try {
// // // // // //         const bookingSnap = await getDoc(doc(firestore, 'bookings', idParam));
// // // // // //         if (bookingSnap.exists()) {
// // // // // //           const b = { id: bookingSnap.id, ...bookingSnap.data() } as Booking;
// // // // // //           setDirectBooking(b);
// // // // // //           setResolvedTripId(b.tripId);
// // // // // //         } else {
// // // // // //           setResolvedTripId(idParam);
// // // // // //         }
// // // // // //       } catch {
// // // // // //         setResolvedTripId(idParam);
// // // // // //       } finally {
// // // // // //         setIsResolving(false);
// // // // // //       }
// // // // // //     };
// // // // // //     resolve();
// // // // // //   }, [firestore, idParam]);

// // // // // //   const tripId = resolvedTripId || idParam;

// // // // // //   // [SCR-CANCEL]: دالة الإلغاء الحقيقية — 3 عمليات atomic
// // // // // //   const handleCancelBooking = useCallback(async (reason: string) => {
// // // // // //     const targetBooking = directBooking || bookingList?.[0];
// // // // // //     if (!firestore || !targetBooking?.id) return;

// // // // // //     setIsCancelling(true);
// // // // // //     try {
// // // // // //       await runTransaction(firestore, async (tx) => {
// // // // // //         // 1. تغيير status الحجز
// // // // // //         tx.update(doc(firestore, 'bookings', targetBooking.id), {
// // // // // //           status: 'Cancelled',
// // // // // //           cancelReason: reason,
// // // // // //           cancelledBy: 'traveler',
// // // // // //           cancelledAt: serverTimestamp(),
// // // // // //           updatedAt: serverTimestamp(),
// // // // // //         });

// // // // // //         // 2. إرجاع الكراسي للرحلة — بس لو كان الحجز confirmed (مش pending)
// // // // // //         // لو كان Pending-Carrier-Confirmation الناقل لسه ما خصمش الكراسي
// // // // // //         const seatsToRestore = targetBooking.seats || 0;
// // // // // //         const statusesRequiringRestore: Booking['status'][] = [
// // // // // //           'Pending-Payment',
// // // // // //           'Pending-Payment-Verification',
// // // // // //           'Confirmed',
// // // // // //         ];
// // // // // //         if (seatsToRestore > 0 && targetBooking.tripId && statusesRequiringRestore.includes(targetBooking.status)) {
// // // // // //           tx.update(doc(firestore, 'trips', targetBooking.tripId), {
// // // // // //             availableSeats: increment(seatsToRestore),
// // // // // //             updatedAt: serverTimestamp(),
// // // // // //           });
// // // // // //         }
// // // // // //       });

// // // // // //       // 3. إشعار للناقل (خارج الـ transaction — مش critical)
// // // // // //       if (targetBooking.carrierId) {
// // // // // //         try {
// // // // // //           await addDoc(
// // // // // //             collection(doc(firestore, 'users', targetBooking.carrierId), 'notifications'),
// // // // // //             {
// // // // // //               userId: targetBooking.carrierId,
// // // // // //               title: 'ألغى المسافر حجزه ❌',
// // // // // //               message: `تم إلغاء حجز ${targetBooking.seats} مقعد — السبب: ${reason}`,
// // // // // //               type: 'traveler_cancelled_booking',
// // // // // //               bookingId: targetBooking.id,
// // // // // //               tripId: targetBooking.tripId,
// // // // // //               isRead: false,
// // // // // //               link: `/${locale}/carrier/bookings`,
// // // // // //               createdAt: serverTimestamp(),
// // // // // //             }
// // // // // //           );
// // // // // //         } catch (notifError) {
// // // // // //           // الإشعار مش critical — نسجله بس ومنوقفش العملية
// // // // // //           console.warn('[TicketPage] Notification failed (non-critical):', notifError);
// // // // // //         }
// // // // // //       }

// // // // // //       setIsCancelOpen(false);
// // // // // //       // تحديث الـ directBooking محلياً فوراً
// // // // // //       if (directBooking) {
// // // // // //         setDirectBooking(prev => prev ? { ...prev, status: 'Cancelled', cancelReason: reason } : prev);
// // // // // //       }
// // // // // //     } catch (e) {
// // // // // //       console.error('[TicketPage] Cancel failed:', e);
// // // // // //     } finally {
// // // // // //       setIsCancelling(false);
// // // // // //     }
// // // // // //   }, [firestore, directBooking, locale]);

// // // // // //   const handleConfirmPayment = useCallback(async (targetBooking: any, onSuccess: () => void) => {
// // // // // //     if (!firestore || !targetBooking?.id) return;
// // // // // //     setIsConfirmingPayment(true);
// // // // // //     try {
// // // // // //       const voucherId = `PAY-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
// // // // // //       await runTransaction(firestore, async (transaction) => {
// // // // // //         transaction.update(doc(firestore, 'bookings', targetBooking.id), {
// // // // // //           status: 'Pending-Payment-Verification',
// // // // // //           depositVoucherId: voucherId,
// // // // // //           paymentDeclaredAt: serverTimestamp(),
// // // // // //           updatedAt: serverTimestamp(),
// // // // // //         });
// // // // // //       });
// // // // // //       onSuccess();
// // // // // //       setIsPaymentOpen(false);
// // // // // //     } catch (e: any) {
// // // // // //       console.error('[TicketPage] Payment failed:', e);
// // // // // //     } finally {
// // // // // //       setIsConfirmingPayment(false);
// // // // // //     }
// // // // // //   }, [firestore]);

// // // // // //   // [SCR-914] Pulse Sensor
// // // // // //   useEffect(() => {
// // // // // //     if (!firestore || !tripId || isResolving) return;
// // // // // //     const transmitViewPulse = async () => {
// // // // // //       const storageKey = `safar_ticket_viewed_${tripId}`;
// // // // // //       if (typeof window !== 'undefined' && sessionStorage.getItem(storageKey)) return;
// // // // // //       try {
// // // // // //         await updateDoc(doc(firestore, 'trips', tripId), { viewedAt: serverTimestamp() });
// // // // // //         sessionStorage.setItem(storageKey, 'true');
// // // // // //       } catch {
// // // // // //         console.warn('[Pulse Sensor] Transmission silenced.');
// // // // // //       }
// // // // // //     };
// // // // // //     transmitViewPulse();
// // // // // //   }, [firestore, tripId, isResolving]);

// // // // // //   const { trip, isLoading: isTripLoading, error: reactorError } = useLiveTripReactor(tripId);

// // // // // //   const bookingQuery = useMemoFirebase(() => {
// // // // // //     if (!firestore || !tripId || directBooking) return null;
// // // // // //     const status = trip?.status;
// // // // // //     if (status === 'Awaiting-Offers' || status === 'Pending-Carrier-Confirmation') return null;
// // // // // //     return query(collection(firestore, 'bookings'), where('tripId', '==', tripId), limit(1));
// // // // // //   }, [firestore, tripId, trip?.status, directBooking]);

// // // // // //   const { data: bookingList, isLoading: isLoadingBooking } = useCollection<Booking>(bookingQuery);

// // // // // //   const booking = useMemo(() => directBooking || bookingList?.[0] || null, [directBooking, bookingList]);

// // // // // //   // [SCR-PHONE-GATE]: أرقام المسافرين للتحقق في الشات
// // // // // //   const allowedPhones = useMemo(() => {
// // // // // //     const details = booking?.passengersDetails || trip?.passengersDetails || [];
// // // // // //     return details
// // // // // //       .map((p: any) => p.phone || p.passengerPhone || '')
// // // // // //       .filter(Boolean) as string[];
// // // // // //   }, [booking?.passengersDetails, trip?.passengersDetails]);

// // // // // //   const primaryPassengerName = useMemo(() => {
// // // // // //     const details = booking?.passengersDetails || trip?.passengersDetails || [];
// // // // // //     return (details[0] as any)?.name || (details[0] as any)?.passengerName || 'مسافر';
// // // // // //   }, [booking?.passengersDetails, trip?.passengersDetails]);

// // // // // //   const serverTime = useMemo(() => {
// // // // // //     if (!trip?.createdAt) return new Date();
// // // // // //     return typeof trip.createdAt.toDate === 'function' ? trip.createdAt.toDate() : new Date(trip.createdAt);
// // // // // //   }, [trip?.createdAt]);

// // // // // //   const isLoading = isResolving || isTripLoading || isLoadingBooking;

// // // // // //   if (isLoading) {
// // // // // //     return (
// // // // // //       <div className="min-h-screen bg-background flex flex-col items-center">
// // // // // //         <Skeleton className="h-24 w-full max-w-md sticky top-0" />
// // // // // //         <main className="w-full max-w-md p-4 space-y-6">
// // // // // //           <Skeleton className="h-64 w-full rounded-[2.5rem]" />
// // // // // //         </main>
// // // // // //       </div>
// // // // // //     );
// // // // // //   }

// // // // // //   if (reactorError || !trip) {
// // // // // //     return (
// // // // // //       <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center gap-4">
// // // // // //         <div className="bg-destructive/10 p-6 rounded-full">
// // // // // //           <ShieldAlert className="h-16 w-16 text-destructive opacity-40 animate-pulse" />
// // // // // //         </div>
// // // // // //         <h1 className="text-2xl font-black tracking-tighter text-white">عذراً، التذكرة غير متاحة</h1>
// // // // // //         <p className="text-sm text-muted-foreground font-bold">
// // // // // //           {reactorError === 'TRIP_NOT_FOUND' ? 'ربما تمَّ إلغاء الرحلة نهائياً.' : 'لقد اصطدم الرادار بعائق تقني.'}
// // // // // //         </p>
// // // // // //         <div className="flex flex-col gap-2 w-full max-w-xs">
// // // // // //           <Button variant="default" className="rounded-2xl h-12 px-8 font-black gap-2" onClick={() => window.location.reload()}>
// // // // // //             <RefreshCw className="h-4 w-4" /> إعادة محاولة الاتصال
// // // // // //           </Button>
// // // // // //           <Button variant="outline" className="rounded-2xl h-12 px-8 font-black" onClick={() => router.push('/')}>العودة للرئيسية</Button>
// // // // // //         </div>
// // // // // //       </div>
// // // // // //     );
// // // // // //   }

// // // // // //   return (
// // // // // //     <div className="min-h-screen bg-background flex flex-col items-center w-full pb-32 overscroll-none" dir="rtl">
// // // // // //       <div className="w-full max-w-md mx-auto sticky top-0 z-50">
// // // // // //         <TicketHeader tripId={tripId} carrierId={trip.carrierId} tripStatus={trip.status} />
// // // // // //       </div>
// // // // // //       <main className="flex-1 w-full max-w-md mx-auto p-4">
// // // // // //         <LocalErrorBoundary fallbackTitle="تعثرت البوابة الذكية">
// // // // // //           {booking && booking.status === 'Pending-Carrier-Confirmation' ? (
// // // // // //             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
// // // // // //               <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-[2.5rem] p-8 text-center space-y-4">
// // // // // //                 <div className="text-4xl">⏳</div>
// // // // // //                 <h2 className="text-xl font-black tracking-tight">في انتظار موافقة الناقل</h2>
// // // // // //                 <p className="text-sm text-muted-foreground font-bold">
// // // // // //                   طلب الحجز وصل للناقل. سيتم إشعارك فور الموافقة.
// // // // // //                 </p>
// // // // // //                 <div className="bg-muted/30 p-4 rounded-2xl text-right space-y-2">
// // // // // //                   <div className="flex justify-between text-xs font-bold">
// // // // // //                     <span className="text-muted-foreground">المقاعد:</span>
// // // // // //                     <span>{booking.seats}</span>
// // // // // //                   </div>
// // // // // //                   <div className="flex justify-between text-xs font-bold">
// // // // // //                     <span className="text-muted-foreground">الإجمالي:</span>
// // // // // //                     <span>{booking.totalPrice} {booking.currency}</span>
// // // // // //                   </div>
// // // // // //                 </div>
// // // // // //               </div>
// // // // // //             </div>
// // // // // //           ) : booking && booking.status === 'Pending-Payment' ? (
// // // // // //             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
// // // // // //               <div className="bg-emerald-500/10 border-2 border-emerald-500/30 rounded-[2.5rem] p-8 text-center space-y-4">
// // // // // //                 <div className="text-5xl">✅</div>
// // // // // //                 <h2 className="text-xl font-black tracking-tight text-emerald-500">وافق الناقل على حجزك!</h2>
// // // // // //                 <p className="text-sm text-muted-foreground font-bold">
// // // // // //                   أكمل الحجز بدفع العربون الآن لتأكيد مقعدك.
// // // // // //                 </p>
// // // // // //                 <div className="bg-muted/30 p-4 rounded-2xl text-right space-y-2">
// // // // // //                   <div className="flex justify-between text-xs font-bold">
// // // // // //                     <span className="text-muted-foreground">المسار:</span>
// // // // // //                     <span>{trip.origin} ← {trip.destination}</span>
// // // // // //                   </div>
// // // // // //                   <div className="flex justify-between text-xs font-bold">
// // // // // //                     <span className="text-muted-foreground">المقاعد:</span>
// // // // // //                     <span>{booking.seats}</span>
// // // // // //                   </div>
// // // // // //                   <div className="flex justify-between text-xs font-bold">
// // // // // //                     <span className="text-muted-foreground">الإجمالي:</span>
// // // // // //                     <span className="font-black text-white">{booking.totalPrice} {booking.currency}</span>
// // // // // //                   </div>
// // // // // //                 </div>
// // // // // //                 <button
// // // // // //                   onClick={() => setIsPaymentOpen(true)}
// // // // // //                   className="w-full h-16 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xl rounded-3xl shadow-[0_20px_50px_rgba(22,163,74,0.4)] transition-all active:scale-95 flex items-center justify-center gap-3"
// // // // // //                 >
// // // // // //                   💳 ادفع العربون الآن
// // // // // //                 </button>
// // // // // //               </div>

// // // // // //               <BookingPaymentDialog
// // // // // //                 isOpen={isPaymentOpen}
// // // // // //                 onOpenChange={setIsPaymentOpen}
// // // // // //                 trip={trip}
// // // // // //                 booking={booking}
// // // // // //                 onConfirm={(receiptUrl) => handleConfirmPayment(booking, () => { })}
// // // // // //                 isProcessing={isConfirmingPayment}
// // // // // //               />
// // // // // //             </div>
// // // // // //           ) : booking ? (
// // // // // //             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
// // // // // //               <HeroTicket
// // // // // //                 trip={trip}
// // // // // //                 booking={booking}
// // // // // //                 onRateTrip={() => { }}
// // // // // //                 onCancelBooking={() => setIsCancelOpen(true)}
// // // // // //                 onMessageCarrier={() => { }}
// // // // // //                 onMessageGroup={() => { }}
// // // // // //               />
// // // // // //             </div>
// // // // // //           ) : (
// // // // // //             <ProxyWaitingState trip={trip} serverTime={serverTime} />
// // // // // //           )}
// // // // // //         </LocalErrorBoundary>
// // // // // //       </main>

// // // // // //       {/* [SCR-CANCEL]: نافذة تأكيد الإلغاء */}
// // // // // //       <CancellationDialog
// // // // // //         isOpen={isCancelOpen}
// // // // // //         onOpenChange={setIsCancelOpen}
// // // // // //         isCancelling={isCancelling}
// // // // // //         onConfirm={handleCancelBooking}
// // // // // //         trip={trip}
// // // // // //         booking={booking}
// // // // // //       />

// // // // // //       {/* [SCR-PHONE-GATE]: الشات مع gate التحقق بالرقم */}
// // // // // //       <FloatingChatBubble
// // // // // //         tripId={tripId}
// // // // // //         allowedPhones={allowedPhones}
// // // // // //         passengerName={primaryPassengerName}
// // // // // //       />
// // // // // //     </div>
// // // // // //   );
// // // // // // }



// // // // // 'use client';

// // // // // import { useParams, useRouter } from 'next/navigation';
// // // // // import { useFirestore, useMemoFirebase, useCollection } from '@/firebase';
// // // // // import { collection, query, where, limit, updateDoc, serverTimestamp, doc, getDoc, runTransaction, increment, addDoc } from 'firebase/firestore';
// // // // // import { BookingPaymentDialog } from '@/components/booking/booking-payment-dialog';
// // // // // import { TicketHeader } from '@/components/traveler/ticket-header';
// // // // // import { HeroTicket } from '@/components/history/hero-ticket';
// // // // // import { ProxyWaitingState } from '@/components/traveler/proxy-waiting-state';
// // // // // import { CancellationDialog } from '@/components/booking/cancellation-dialog';
// // // // // import { Skeleton } from '@/components/ui/skeleton';
// // // // // import type { Trip, Booking } from '@/lib/data';
// // // // // import { LocalErrorBoundary } from '@/components/ui/local-error-boundary';
// // // // // import { ShieldAlert, RefreshCw } from 'lucide-react';
// // // // // import { Button } from '@/components/ui/button';
// // // // // import { useMemo, useEffect, useState, useCallback } from 'react';
// // // // // import { FloatingChatBubble } from '@/components/traveler/floating-chat-bubble';
// // // // // import { useLiveTripReactor } from '@/hooks/use-live-trip-reactor';
// // // // // import { useLocale } from 'next-intl';

// // // // // /**
// // // // //  * @page SmartTicketPage
// // // // //  * @description THE REINFORCED NEURAL HUB (STERILIZED - V19.0 - SCR-PROXY-CHAT-CANCEL)
// // // // //  * [V19.0]:
// // // // //  *   - [SCR-CANCEL]: CancellationDialog مربوطة بدالة حقيقية:
// // // // //  *       1. تغيير status الـ booking إلى Cancelled
// // // // //  *       2. إرجاع الكراسي للرحلة عبر increment(+seats)
// // // // //  *       3. إشعار للناقل
// // // // //  *   - [SCR-PHONE-GATE]: استخراج allowedPhones من passengersDetails وتمريرها للـ FloatingChatBubble
// // // // //  * Protocol 16: Sterilized. Protocol 88: Zero Network Chatter.
// // // // //  */
// // // // // export default function SmartTicketPage() {
// // // // //   const params = useParams();
// // // // //   const idParam = params.id as string;
// // // // //   const firestore = useFirestore();
// // // // //   const router = useRouter();
// // // // //   const locale = useLocale();

// // // // //   const [resolvedTripId, setResolvedTripId] = useState<string | null>(null);
// // // // //   const [directBooking, setDirectBooking] = useState<Booking | null>(null);
// // // // //   const [isResolving, setIsResolving] = useState(true);
// // // // //   const [isPaymentOpen, setIsPaymentOpen] = useState(false);
// // // // //   const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);

// // // // //   // [SCR-CANCEL]: حالة نافذة الإلغاء
// // // // //   const [isCancelOpen, setIsCancelOpen] = useState(false);
// // // // //   const [isCancelling, setIsCancelling] = useState(false);

// // // // //   useEffect(() => {
// // // // //     if (!firestore || !idParam) return;
// // // // //     const resolve = async () => {
// // // // //       setIsResolving(true);
// // // // //       try {
// // // // //         const bookingSnap = await getDoc(doc(firestore, 'bookings', idParam));
// // // // //         if (bookingSnap.exists()) {
// // // // //           const b = { id: bookingSnap.id, ...bookingSnap.data() } as Booking;
// // // // //           setDirectBooking(b);
// // // // //           setResolvedTripId(b.tripId);
// // // // //         } else {
// // // // //           setResolvedTripId(idParam);
// // // // //         }
// // // // //       } catch {
// // // // //         setResolvedTripId(idParam);
// // // // //       } finally {
// // // // //         setIsResolving(false);
// // // // //       }
// // // // //     };
// // // // //     resolve();
// // // // //   }, [firestore, idParam]);

// // // // //   const tripId = resolvedTripId || idParam;

// // // // //   // [SCR-CANCEL]: دالة الإلغاء الحقيقية — 3 عمليات atomic
// // // // //   const handleCancelBooking = useCallback(async (reason: string) => {
// // // // //     const targetBooking = directBooking || bookingList?.[0];
// // // // //     if (!firestore || !targetBooking?.id) return;

// // // // //     setIsCancelling(true);
// // // // //     try {
// // // // //       await runTransaction(firestore, async (tx) => {
// // // // //         // 1. تغيير status الحجز
// // // // //         tx.update(doc(firestore, 'bookings', targetBooking.id), {
// // // // //           status: 'Cancelled',
// // // // //           cancelReason: reason,
// // // // //           cancelledBy: 'traveler',
// // // // //           cancelledAt: serverTimestamp(),
// // // // //           updatedAt: serverTimestamp(),
// // // // //         });

// // // // //         // 2. إرجاع الكراسي للرحلة — بس لو كان الحجز confirmed (مش pending)
// // // // //         // لو كان Pending-Carrier-Confirmation الناقل لسه ما خصمش الكراسي
// // // // //         const seatsToRestore = targetBooking.seats || 0;
// // // // //         const statusesRequiringRestore: Booking['status'][] = [
// // // // //           'Pending-Payment',
// // // // //           'Pending-Payment-Verification',
// // // // //           'Confirmed',
// // // // //         ];
// // // // //         if (seatsToRestore > 0 && statusesRequiringRestore.includes(targetBooking.status)) {
// // // // //           // [FIX]: رجّع الكراسي للـ carrierTripId (رحلة الناقل الفعلية) لو موجود
// // // // //           // وإلا رجّعها للـ tripId (رحلة المسافر)
// // // // //           const carrierTripId = (targetBooking as any).carrierTripId;
// // // // //           if (carrierTripId) {
// // // // //             tx.update(doc(firestore, 'trips', carrierTripId), {
// // // // //               availableSeats: increment(seatsToRestore),
// // // // //               updatedAt: serverTimestamp(),
// // // // //             });
// // // // //           }
// // // // //           // دايماً رجّع للـ tripId كمان (رحلة المسافر/الطلب)
// // // // //           if (targetBooking.tripId) {
// // // // //             tx.update(doc(firestore, 'trips', targetBooking.tripId), {
// // // // //               availableSeats: increment(seatsToRestore),
// // // // //               updatedAt: serverTimestamp(),
// // // // //             });
// // // // //           }
// // // // //         }
// // // // //       });

// // // // //       // 3. إشعار للناقل (خارج الـ transaction — مش critical)
// // // // //       if (targetBooking.carrierId) {
// // // // //         try {
// // // // //           await addDoc(
// // // // //             collection(doc(firestore, 'users', targetBooking.carrierId), 'notifications'),
// // // // //             {
// // // // //               userId: targetBooking.carrierId,
// // // // //               title: 'ألغى المسافر حجزه ❌',
// // // // //               message: `تم إلغاء حجز ${targetBooking.seats} مقعد — السبب: ${reason}`,
// // // // //               type: 'traveler_cancelled_booking',
// // // // //               bookingId: targetBooking.id,
// // // // //               tripId: targetBooking.tripId,
// // // // //               isRead: false,
// // // // //               link: `/${locale}/carrier/bookings`,
// // // // //               createdAt: serverTimestamp(),
// // // // //             }
// // // // //           );
// // // // //         } catch (notifError) {
// // // // //           // الإشعار مش critical — نسجله بس ومنوقفش العملية
// // // // //           console.warn('[TicketPage] Notification failed (non-critical):', notifError);
// // // // //         }
// // // // //       }

// // // // //       setIsCancelOpen(false);
// // // // //       // تحديث الـ directBooking محلياً فوراً
// // // // //       if (directBooking) {
// // // // //         setDirectBooking(prev => prev ? { ...prev, status: 'Cancelled', cancelReason: reason } : prev);
// // // // //       }
// // // // //     } catch (e) {
// // // // //       console.error('[TicketPage] Cancel failed:', e);
// // // // //     } finally {
// // // // //       setIsCancelling(false);
// // // // //     }
// // // // //   }, [firestore, directBooking, locale]);

// // // // //   const handleConfirmPayment = useCallback(async (targetBooking: any, onSuccess: () => void) => {
// // // // //     if (!firestore || !targetBooking?.id) return;
// // // // //     setIsConfirmingPayment(true);
// // // // //     try {
// // // // //       const voucherId = `PAY-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
// // // // //       await runTransaction(firestore, async (transaction) => {
// // // // //         transaction.update(doc(firestore, 'bookings', targetBooking.id), {
// // // // //           status: 'Pending-Payment-Verification',
// // // // //           depositVoucherId: voucherId,
// // // // //           paymentDeclaredAt: serverTimestamp(),
// // // // //           updatedAt: serverTimestamp(),
// // // // //         });
// // // // //       });
// // // // //       onSuccess();
// // // // //       setIsPaymentOpen(false);
// // // // //     } catch (e: any) {
// // // // //       console.error('[TicketPage] Payment failed:', e);
// // // // //     } finally {
// // // // //       setIsConfirmingPayment(false);
// // // // //     }
// // // // //   }, [firestore]);

// // // // //   // [SCR-914] Pulse Sensor
// // // // //   useEffect(() => {
// // // // //     if (!firestore || !tripId || isResolving) return;
// // // // //     const transmitViewPulse = async () => {
// // // // //       const storageKey = `safar_ticket_viewed_${tripId}`;
// // // // //       if (typeof window !== 'undefined' && sessionStorage.getItem(storageKey)) return;
// // // // //       try {
// // // // //         await updateDoc(doc(firestore, 'trips', tripId), { viewedAt: serverTimestamp() });
// // // // //         sessionStorage.setItem(storageKey, 'true');
// // // // //       } catch {
// // // // //         console.warn('[Pulse Sensor] Transmission silenced.');
// // // // //       }
// // // // //     };
// // // // //     transmitViewPulse();
// // // // //   }, [firestore, tripId, isResolving]);

// // // // //   const { trip, isLoading: isTripLoading, error: reactorError } = useLiveTripReactor(tripId);

// // // // //   const bookingQuery = useMemoFirebase(() => {
// // // // //     if (!firestore || !tripId || directBooking) return null;
// // // // //     const status = trip?.status;
// // // // //     if (status === 'Awaiting-Offers' || status === 'Pending-Carrier-Confirmation') return null;
// // // // //     return query(collection(firestore, 'bookings'), where('tripId', '==', tripId), limit(1));
// // // // //   }, [firestore, tripId, trip?.status, directBooking]);

// // // // //   const { data: bookingList, isLoading: isLoadingBooking } = useCollection<Booking>(bookingQuery);

// // // // //   const booking = useMemo(() => directBooking || bookingList?.[0] || null, [directBooking, bookingList]);

// // // // //   // [SCR-PHONE-GATE]: أرقام المسافرين للتحقق في الشات
// // // // //   const allowedPhones = useMemo(() => {
// // // // //     const details = booking?.passengersDetails || trip?.passengersDetails || [];
// // // // //     return details
// // // // //       .map((p: any) => p.phone || p.passengerPhone || '')
// // // // //       .filter(Boolean) as string[];
// // // // //   }, [booking?.passengersDetails, trip?.passengersDetails]);

// // // // //   const primaryPassengerName = useMemo(() => {
// // // // //     const details = booking?.passengersDetails || trip?.passengersDetails || [];
// // // // //     return (details[0] as any)?.name || (details[0] as any)?.passengerName || 'مسافر';
// // // // //   }, [booking?.passengersDetails, trip?.passengersDetails]);

// // // // //   const serverTime = useMemo(() => {
// // // // //     if (!trip?.createdAt) return new Date();
// // // // //     return typeof trip.createdAt.toDate === 'function' ? trip.createdAt.toDate() : new Date(trip.createdAt);
// // // // //   }, [trip?.createdAt]);

// // // // //   const isLoading = isResolving || isTripLoading || isLoadingBooking;

// // // // //   if (isLoading) {
// // // // //     return (
// // // // //       <div className="min-h-screen bg-background flex flex-col items-center">
// // // // //         <Skeleton className="h-24 w-full max-w-md sticky top-0" />
// // // // //         <main className="w-full max-w-md p-4 space-y-6">
// // // // //           <Skeleton className="h-64 w-full rounded-[2.5rem]" />
// // // // //         </main>
// // // // //       </div>
// // // // //     );
// // // // //   }

// // // // //   if (reactorError || !trip) {
// // // // //     return (
// // // // //       <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center gap-4">
// // // // //         <div className="bg-destructive/10 p-6 rounded-full">
// // // // //           <ShieldAlert className="h-16 w-16 text-destructive opacity-40 animate-pulse" />
// // // // //         </div>
// // // // //         <h1 className="text-2xl font-black tracking-tighter text-white">عذراً، التذكرة غير متاحة</h1>
// // // // //         <p className="text-sm text-muted-foreground font-bold">
// // // // //           {reactorError === 'TRIP_NOT_FOUND' ? 'ربما تمَّ إلغاء الرحلة نهائياً.' : 'لقد اصطدم الرادار بعائق تقني.'}
// // // // //         </p>
// // // // //         <div className="flex flex-col gap-2 w-full max-w-xs">
// // // // //           <Button variant="default" className="rounded-2xl h-12 px-8 font-black gap-2" onClick={() => window.location.reload()}>
// // // // //             <RefreshCw className="h-4 w-4" /> إعادة محاولة الاتصال
// // // // //           </Button>
// // // // //           <Button variant="outline" className="rounded-2xl h-12 px-8 font-black" onClick={() => router.push('/')}>العودة للرئيسية</Button>
// // // // //         </div>
// // // // //       </div>
// // // // //     );
// // // // //   }

// // // // //   return (
// // // // //     <div className="min-h-screen bg-background flex flex-col items-center w-full pb-32 overscroll-none" dir="rtl">
// // // // //       <div className="w-full max-w-md mx-auto sticky top-0 z-50">
// // // // //         <TicketHeader tripId={tripId} carrierId={trip.carrierId} tripStatus={trip.status} />
// // // // //       </div>
// // // // //       <main className="flex-1 w-full max-w-md mx-auto p-4">
// // // // //         <LocalErrorBoundary fallbackTitle="تعثرت البوابة الذكية">
// // // // //           {booking && booking.status === 'Pending-Carrier-Confirmation' ? (
// // // // //             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
// // // // //               <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-[2.5rem] p-8 text-center space-y-4">
// // // // //                 <div className="text-4xl">⏳</div>
// // // // //                 <h2 className="text-xl font-black tracking-tight">في انتظار موافقة الناقل</h2>
// // // // //                 <p className="text-sm text-muted-foreground font-bold">
// // // // //                   طلب الحجز وصل للناقل. سيتم إشعارك فور الموافقة.
// // // // //                 </p>
// // // // //                 <div className="bg-muted/30 p-4 rounded-2xl text-right space-y-2">
// // // // //                   <div className="flex justify-between text-xs font-bold">
// // // // //                     <span className="text-muted-foreground">المقاعد:</span>
// // // // //                     <span>{booking.seats}</span>
// // // // //                   </div>
// // // // //                   <div className="flex justify-between text-xs font-bold">
// // // // //                     <span className="text-muted-foreground">الإجمالي:</span>
// // // // //                     <span>{booking.totalPrice} {booking.currency}</span>
// // // // //                   </div>
// // // // //                 </div>
// // // // //               </div>
// // // // //             </div>
// // // // //           ) : booking && booking.status === 'Pending-Payment' ? (
// // // // //             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
// // // // //               <div className="bg-emerald-500/10 border-2 border-emerald-500/30 rounded-[2.5rem] p-8 text-center space-y-4">
// // // // //                 <div className="text-5xl">✅</div>
// // // // //                 <h2 className="text-xl font-black tracking-tight text-emerald-500">وافق الناقل على حجزك!</h2>
// // // // //                 <p className="text-sm text-muted-foreground font-bold">
// // // // //                   أكمل الحجز بدفع العربون الآن لتأكيد مقعدك.
// // // // //                 </p>
// // // // //                 <div className="bg-muted/30 p-4 rounded-2xl text-right space-y-2">
// // // // //                   <div className="flex justify-between text-xs font-bold">
// // // // //                     <span className="text-muted-foreground">المسار:</span>
// // // // //                     <span>{trip.origin} ← {trip.destination}</span>
// // // // //                   </div>
// // // // //                   <div className="flex justify-between text-xs font-bold">
// // // // //                     <span className="text-muted-foreground">المقاعد:</span>
// // // // //                     <span>{booking.seats}</span>
// // // // //                   </div>
// // // // //                   <div className="flex justify-between text-xs font-bold">
// // // // //                     <span className="text-muted-foreground">الإجمالي:</span>
// // // // //                     <span className="font-black text-white">{booking.totalPrice} {booking.currency}</span>
// // // // //                   </div>
// // // // //                 </div>
// // // // //                 <button
// // // // //                   onClick={() => setIsPaymentOpen(true)}
// // // // //                   className="w-full h-16 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xl rounded-3xl shadow-[0_20px_50px_rgba(22,163,74,0.4)] transition-all active:scale-95 flex items-center justify-center gap-3"
// // // // //                 >
// // // // //                   💳 ادفع العربون الآن
// // // // //                 </button>
// // // // //               </div>

// // // // //               <BookingPaymentDialog
// // // // //                 isOpen={isPaymentOpen}
// // // // //                 onOpenChange={setIsPaymentOpen}
// // // // //                 trip={trip}
// // // // //                 booking={booking}
// // // // //                 onConfirm={(receiptUrl) => handleConfirmPayment(booking, () => { })}
// // // // //                 isProcessing={isConfirmingPayment}
// // // // //               />
// // // // //             </div>
// // // // //           ) : booking && booking.status === 'Pending-Payment-Verification' ? (
// // // // //             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
// // // // //               <div className="bg-blue-500/10 border-2 border-blue-500/30 rounded-[2.5rem] p-8 text-center space-y-4">
// // // // //                 <div className="text-5xl">🔵</div>
// // // // //                 <h2 className="text-xl font-black tracking-tight text-blue-400">تم استلام إشعار دفعك!</h2>
// // // // //                 <p className="text-sm text-muted-foreground font-bold">
// // // // //                   الناقل سيراجع السند ويختم الاستلام. ستظهر تذكرتك فور التأكيد.
// // // // //                 </p>
// // // // //                 {booking.depositVoucherId && (
// // // // //                   <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
// // // // //                     <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">رقم سند الدفع</p>
// // // // //                     <p className="font-mono font-black text-blue-300 text-lg tracking-widest">{booking.depositVoucherId}</p>
// // // // //                   </div>
// // // // //                 )}
// // // // //               </div>
// // // // //             </div>
// // // // //           ) : booking ? (
// // // // //             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
// // // // //               <HeroTicket
// // // // //                 trip={trip}
// // // // //                 booking={booking}
// // // // //                 onRateTrip={() => { }}
// // // // //                 onCancelBooking={() => setIsCancelOpen(true)}
// // // // //                 onMessageCarrier={() => { }}
// // // // //                 onMessageGroup={() => { }}
// // // // //               />
// // // // //             </div>
// // // // //           ) : (
// // // // //             <ProxyWaitingState trip={trip} serverTime={serverTime} />
// // // // //           )}
// // // // //         </LocalErrorBoundary>
// // // // //       </main>

// // // // //       {/* [SCR-CANCEL]: نافذة تأكيد الإلغاء */}
// // // // //       <CancellationDialog
// // // // //         isOpen={isCancelOpen}
// // // // //         onOpenChange={setIsCancelOpen}
// // // // //         isCancelling={isCancelling}
// // // // //         onConfirm={handleCancelBooking}
// // // // //         trip={trip}
// // // // //         booking={booking}
// // // // //       />

// // // // //       {/* [SCR-PHONE-GATE]: الشات مع gate التحقق بالرقم */}
// // // // //       <FloatingChatBubble
// // // // //         tripId={tripId}
// // // // //         allowedPhones={allowedPhones}
// // // // //         passengerName={primaryPassengerName}
// // // // //       />
// // // // //     </div>
// // // // //   );
// // // // // }

// // // // //=============================



// // // // 'use client';

// // // // import { useParams, useRouter } from 'next/navigation';
// // // // import { useFirestore, useMemoFirebase, useCollection } from '@/firebase';
// // // // import { collection, query, where, limit, updateDoc, serverTimestamp, doc, getDoc, runTransaction, increment, addDoc } from 'firebase/firestore';
// // // // import { BookingPaymentDialog } from '@/components/booking/booking-payment-dialog';
// // // // import { TicketHeader } from '@/components/traveler/ticket-header';
// // // // import { HeroTicket } from '@/components/history/hero-ticket';
// // // // import { ProxyWaitingState } from '@/components/traveler/proxy-waiting-state';
// // // // import { CancellationDialog } from '@/components/booking/cancellation-dialog';
// // // // import { Skeleton } from '@/components/ui/skeleton';
// // // // import type { Trip, Booking } from '@/lib/data';
// // // // import { LocalErrorBoundary } from '@/components/ui/local-error-boundary';
// // // // import { ShieldAlert, RefreshCw } from 'lucide-react';
// // // // import { Button } from '@/components/ui/button';
// // // // import { useMemo, useEffect, useState, useCallback } from 'react';
// // // // import { FloatingChatBubble } from '@/components/traveler/floating-chat-bubble';
// // // // import { useLiveTripReactor } from '@/hooks/use-live-trip-reactor';
// // // // import { useLocale } from 'next-intl';

// // // // /**
// // // //  * @page SmartTicketPage
// // // //  * @description THE REINFORCED NEURAL HUB (STERILIZED - V19.0 - SCR-PROXY-CHAT-CANCEL)
// // // //  * [V19.0]:
// // // //  *   - [SCR-CANCEL]: CancellationDialog مربوطة بدالة حقيقية:
// // // //  *       1. تغيير status الـ booking إلى Cancelled
// // // //  *       2. إرجاع الكراسي للرحلة عبر increment(+seats)
// // // //  *       3. إشعار للناقل
// // // //  *   - [SCR-PHONE-GATE]: استخراج allowedPhones من passengersDetails وتمريرها للـ FloatingChatBubble
// // // //  * Protocol 16: Sterilized. Protocol 88: Zero Network Chatter.
// // // //  */
// // // // export default function SmartTicketPage() {
// // // //   const params = useParams();
// // // //   const idParam = params.id as string;
// // // //   const firestore = useFirestore();
// // // //   const router = useRouter();
// // // //   const locale = useLocale();

// // // //   const [resolvedTripId, setResolvedTripId] = useState<string | null>(null);
// // // //   const [directBooking, setDirectBooking] = useState<Booking | null>(null);
// // // //   const [isResolving, setIsResolving] = useState(true);
// // // //   const [isPaymentOpen, setIsPaymentOpen] = useState(false);
// // // //   const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);

// // // //   // [SCR-CANCEL]: حالة نافذة الإلغاء
// // // //   const [isCancelOpen, setIsCancelOpen] = useState(false);
// // // //   const [isCancelling, setIsCancelling] = useState(false);

// // // //   useEffect(() => {
// // // //     if (!firestore || !idParam) return;
// // // //     const resolve = async () => {
// // // //       setIsResolving(true);
// // // //       try {
// // // //         const bookingSnap = await getDoc(doc(firestore, 'bookings', idParam));
// // // //         if (bookingSnap.exists()) {
// // // //           const b = { id: bookingSnap.id, ...bookingSnap.data() } as Booking;
// // // //           setDirectBooking(b);
// // // //           setResolvedTripId(b.tripId);
// // // //         } else {
// // // //           setResolvedTripId(idParam);
// // // //         }
// // // //       } catch {
// // // //         setResolvedTripId(idParam);
// // // //       } finally {
// // // //         setIsResolving(false);
// // // //       }
// // // //     };
// // // //     resolve();
// // // //   }, [firestore, idParam]);

// // // //   const tripId = resolvedTripId || idParam;

// // // //   // [SCR-CANCEL]: دالة الإلغاء الحقيقية — 3 عمليات atomic
// // // //   const handleCancelBooking = useCallback(async (reason: string) => {
// // // //     const targetBooking = directBooking || bookingList?.[0];
// // // //     if (!firestore || !targetBooking?.id) return;

// // // //     setIsCancelling(true);
// // // //     try {
// // // //       await runTransaction(firestore, async (tx) => {
// // // //         // 1. تغيير status الحجز
// // // //         tx.update(doc(firestore, 'bookings', targetBooking.id), {
// // // //           status: 'Cancelled',
// // // //           cancelReason: reason,
// // // //           cancelledBy: 'traveler',
// // // //           cancelledAt: serverTimestamp(),
// // // //           updatedAt: serverTimestamp(),
// // // //         });

// // // //         // 2. إرجاع الكراسي للرحلة — بس لو كان الحجز confirmed (مش pending)
// // // //         // لو كان Pending-Carrier-Confirmation الناقل لسه ما خصمش الكراسي
// // // //         const seatsToRestore = targetBooking.seats || 0;
// // // //         const statusesRequiringRestore: Booking['status'][] = [
// // // //           'Pending-Payment',
// // // //           'Pending-Payment-Verification',
// // // //           'Confirmed',
// // // //         ];
// // // //         if (seatsToRestore > 0 && statusesRequiringRestore.includes(targetBooking.status)) {
// // // //           // [FIX]: رجّع الكراسي للـ carrierTripId (رحلة الناقل الفعلية) لو موجود
// // // //           // وإلا رجّعها للـ tripId (رحلة المسافر)
// // // //           const carrierTripId = (targetBooking as any).carrierTripId;
// // // //           if (carrierTripId) {
// // // //             tx.update(doc(firestore, 'trips', carrierTripId), {
// // // //               availableSeats: increment(seatsToRestore),
// // // //               updatedAt: serverTimestamp(),
// // // //             });
// // // //           }
// // // //           // دايماً رجّع للـ tripId كمان (رحلة المسافر/الطلب)
// // // //           if (targetBooking.tripId) {
// // // //             tx.update(doc(firestore, 'trips', targetBooking.tripId), {
// // // //               availableSeats: increment(seatsToRestore),
// // // //               updatedAt: serverTimestamp(),
// // // //             });
// // // //           }
// // // //         }
// // // //       });

// // // //       // 3. إشعار للناقل (خارج الـ transaction — مش critical)
// // // //       if (targetBooking.carrierId) {
// // // //         try {
// // // //           await addDoc(
// // // //             collection(doc(firestore, 'users', targetBooking.carrierId), 'notifications'),
// // // //             {
// // // //               userId: targetBooking.carrierId,
// // // //               title: 'ألغى المسافر حجزه ❌',
// // // //               message: `تم إلغاء حجز ${targetBooking.seats} مقعد — السبب: ${reason}`,
// // // //               type: 'traveler_cancelled_booking',
// // // //               bookingId: targetBooking.id,
// // // //               tripId: targetBooking.tripId,
// // // //               isRead: false,
// // // //               link: `/${locale}/carrier/bookings`,
// // // //               createdAt: serverTimestamp(),
// // // //             }
// // // //           );
// // // //         } catch (notifError) {
// // // //           // الإشعار مش critical — نسجله بس ومنوقفش العملية
// // // //           console.warn('[TicketPage] Notification failed (non-critical):', notifError);
// // // //         }
// // // //       }

// // // //       setIsCancelOpen(false);
// // // //       // تحديث الـ directBooking محلياً فوراً
// // // //       if (directBooking) {
// // // //         setDirectBooking(prev => prev ? { ...prev, status: 'Cancelled', cancelReason: reason } : prev);
// // // //       }
// // // //     } catch (e) {
// // // //       console.error('[TicketPage] Cancel failed:', e);
// // // //     } finally {
// // // //       setIsCancelling(false);
// // // //     }
// // // //   }, [firestore, directBooking, locale]);

// // // //   const handleConfirmPayment = useCallback(async (targetBooking: any, onSuccess: () => void) => {
// // // //     if (!firestore || !targetBooking?.id) return;
// // // //     setIsConfirmingPayment(true);
// // // //     try {
// // // //       const voucherId = `PAY-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
// // // //       await runTransaction(firestore, async (transaction) => {
// // // //         transaction.update(doc(firestore, 'bookings', targetBooking.id), {
// // // //           status: 'Pending-Payment-Verification',
// // // //           depositVoucherId: voucherId,
// // // //           paymentDeclaredAt: serverTimestamp(),
// // // //           updatedAt: serverTimestamp(),
// // // //         });
// // // //       });
// // // //       onSuccess();
// // // //       setIsPaymentOpen(false);
// // // //     } catch (e: any) {
// // // //       console.error('[TicketPage] Payment failed:', e);
// // // //     } finally {
// // // //       setIsConfirmingPayment(false);
// // // //     }
// // // //   }, [firestore]);

// // // //   // [SCR-914] Pulse Sensor
// // // //   useEffect(() => {
// // // //     if (!firestore || !tripId || isResolving) return;
// // // //     const transmitViewPulse = async () => {
// // // //       const storageKey = `safar_ticket_viewed_${tripId}`;
// // // //       if (typeof window !== 'undefined' && sessionStorage.getItem(storageKey)) return;
// // // //       try {
// // // //         await updateDoc(doc(firestore, 'trips', tripId), { viewedAt: serverTimestamp() });
// // // //         sessionStorage.setItem(storageKey, 'true');
// // // //       } catch {
// // // //         console.warn('[Pulse Sensor] Transmission silenced.');
// // // //       }
// // // //     };
// // // //     transmitViewPulse();
// // // //   }, [firestore, tripId, isResolving]);

// // // //   const { trip, isLoading: isTripLoading, error: reactorError } = useLiveTripReactor(tripId);

// // // //   const bookingQuery = useMemoFirebase(() => {
// // // //     if (!firestore || !tripId || directBooking) return null;
// // // //     const status = trip?.status;
// // // //     if (status === 'Awaiting-Offers' || status === 'Pending-Carrier-Confirmation') return null;
// // // //     return query(collection(firestore, 'bookings'), where('tripId', '==', tripId), limit(1));
// // // //   }, [firestore, tripId, trip?.status, directBooking]);

// // // //   const { data: bookingList, isLoading: isLoadingBooking } = useCollection<Booking>(bookingQuery);

// // // //   const booking = useMemo(() => directBooking || bookingList?.[0] || null, [directBooking, bookingList]);

// // // //   // [SCR-PHONE-GATE]: أرقام المسافرين للتحقق في الشات
// // // //   const allowedPhones = useMemo(() => {
// // // //     const details = booking?.passengersDetails || trip?.passengersDetails || [];
// // // //     return details
// // // //       .map((p: any) => p.phone || p.passengerPhone || '')
// // // //       .filter(Boolean) as string[];
// // // //   }, [booking?.passengersDetails, trip?.passengersDetails]);

// // // //   const primaryPassengerName = useMemo(() => {
// // // //     const details = booking?.passengersDetails || trip?.passengersDetails || [];
// // // //     return (details[0] as any)?.name || (details[0] as any)?.passengerName || 'مسافر';
// // // //   }, [booking?.passengersDetails, trip?.passengersDetails]);

// // // //   const serverTime = useMemo(() => {
// // // //     if (!trip?.createdAt) return new Date();
// // // //     return typeof trip.createdAt.toDate === 'function' ? trip.createdAt.toDate() : new Date(trip.createdAt);
// // // //   }, [trip?.createdAt]);

// // // //   const isLoading = isResolving || isTripLoading || isLoadingBooking;

// // // //   if (isLoading) {
// // // //     return (
// // // //       <div className="min-h-screen bg-background flex flex-col items-center">
// // // //         <Skeleton className="h-24 w-full max-w-md sticky top-0" />
// // // //         <main className="w-full max-w-md p-4 space-y-6">
// // // //           <Skeleton className="h-64 w-full rounded-[2.5rem]" />
// // // //         </main>
// // // //       </div>
// // // //     );
// // // //   }

// // // //   if (reactorError || !trip) {
// // // //     return (
// // // //       <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center gap-4">
// // // //         <div className="bg-destructive/10 p-6 rounded-full">
// // // //           <ShieldAlert className="h-16 w-16 text-destructive opacity-40 animate-pulse" />
// // // //         </div>
// // // //         <h1 className="text-2xl font-black tracking-tighter text-white">عذراً، التذكرة غير متاحة</h1>
// // // //         <p className="text-sm text-muted-foreground font-bold">
// // // //           {reactorError === 'TRIP_NOT_FOUND' ? 'ربما تمَّ إلغاء الرحلة نهائياً.' : 'لقد اصطدم الرادار بعائق تقني.'}
// // // //         </p>
// // // //         <div className="flex flex-col gap-2 w-full max-w-xs">
// // // //           <Button variant="default" className="rounded-2xl h-12 px-8 font-black gap-2" onClick={() => window.location.reload()}>
// // // //             <RefreshCw className="h-4 w-4" /> إعادة محاولة الاتصال
// // // //           </Button>
// // // //           <Button variant="outline" className="rounded-2xl h-12 px-8 font-black" onClick={() => router.push('/')}>العودة للرئيسية</Button>
// // // //         </div>
// // // //       </div>
// // // //     );
// // // //   }

// // // //   return (
// // // //     <div className="min-h-screen bg-background flex flex-col items-center w-full pb-32 overscroll-none" dir="rtl">
// // // //       <div className="w-full max-w-md mx-auto sticky top-0 z-50">
// // // //         <TicketHeader tripId={tripId} carrierId={trip.carrierId} tripStatus={trip.status} />
// // // //       </div>
// // // //       <main className="flex-1 w-full max-w-md mx-auto p-4">
// // // //         <LocalErrorBoundary fallbackTitle="تعثرت البوابة الذكية">
// // // //           {booking && booking.status === 'Pending-Carrier-Confirmation' ? (
// // // //             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
// // // //               <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-[2.5rem] p-8 text-center space-y-4">
// // // //                 <div className="text-4xl">⏳</div>
// // // //                 <h2 className="text-xl font-black tracking-tight">في انتظار موافقة الناقل</h2>
// // // //                 <p className="text-sm text-muted-foreground font-bold">
// // // //                   طلب الحجز وصل للناقل. سيتم إشعارك فور الموافقة.
// // // //                 </p>
// // // //                 <div className="bg-muted/30 p-4 rounded-2xl text-right space-y-2">
// // // //                   <div className="flex justify-between text-xs font-bold">
// // // //                     <span className="text-muted-foreground">المقاعد:</span>
// // // //                     <span>{booking.seats}</span>
// // // //                   </div>
// // // //                   <div className="flex justify-between text-xs font-bold">
// // // //                     <span className="text-muted-foreground">الإجمالي:</span>
// // // //                     <span>{booking.totalPrice} {booking.currency}</span>
// // // //                   </div>
// // // //                 </div>
// // // //               </div>
// // // //             </div>
// // // //           ) : booking && booking.status === 'Pending-Payment' ? (
// // // //             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
// // // //               <div className="bg-emerald-500/10 border-2 border-emerald-500/30 rounded-[2.5rem] p-8 text-center space-y-4">
// // // //                 <div className="text-5xl">✅</div>
// // // //                 <h2 className="text-xl font-black tracking-tight text-emerald-500">وافق الناقل على حجزك!</h2>
// // // //                 <p className="text-sm text-muted-foreground font-bold">
// // // //                   أكمل الحجز بدفع العربون الآن لتأكيد مقعدك.
// // // //                 </p>
// // // //                 <div className="bg-muted/30 p-4 rounded-2xl text-right space-y-2">
// // // //                   <div className="flex justify-between text-xs font-bold">
// // // //                     <span className="text-muted-foreground">المسار:</span>
// // // //                     <span>{trip.origin} ← {trip.destination}</span>
// // // //                   </div>
// // // //                   <div className="flex justify-between text-xs font-bold">
// // // //                     <span className="text-muted-foreground">المقاعد:</span>
// // // //                     <span>{booking.seats}</span>
// // // //                   </div>
// // // //                   <div className="flex justify-between text-xs font-bold">
// // // //                     <span className="text-muted-foreground">الإجمالي:</span>
// // // //                     <span className="font-black text-white">{booking.totalPrice} {booking.currency}</span>
// // // //                   </div>
// // // //                 </div>
// // // //                 <button
// // // //                   onClick={() => setIsPaymentOpen(true)}
// // // //                   className="w-full h-16 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xl rounded-3xl shadow-[0_20px_50px_rgba(22,163,74,0.4)] transition-all active:scale-95 flex items-center justify-center gap-3"
// // // //                 >
// // // //                   💳 ادفع العربون الآن
// // // //                 </button>
// // // //               </div>

// // // //               <BookingPaymentDialog
// // // //                 isOpen={isPaymentOpen}
// // // //                 onOpenChange={setIsPaymentOpen}
// // // //                 trip={trip}
// // // //                 booking={booking}
// // // //                 onConfirm={(receiptUrl) => handleConfirmPayment(booking, () => { })}
// // // //                 isProcessing={isConfirmingPayment}
// // // //               />
// // // //             </div>
// // // //           ) : booking && booking.status === 'Pending-Payment-Verification' ? (
// // // //             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
// // // //               <div className="bg-blue-500/10 border-2 border-blue-500/30 rounded-[2.5rem] p-8 text-center space-y-4">
// // // //                 <div className="text-5xl">🔵</div>
// // // //                 <h2 className="text-xl font-black tracking-tight text-blue-400">تم استلام إشعار دفعك!</h2>
// // // //                 <p className="text-sm text-muted-foreground font-bold">
// // // //                   الناقل سيراجع السند ويختم الاستلام. ستظهر تذكرتك فور التأكيد.
// // // //                 </p>
// // // //                 {booking.depositVoucherId && (
// // // //                   <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
// // // //                     <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">رقم سند الدفع</p>
// // // //                     <p className="font-mono font-black text-blue-300 text-lg tracking-widest">{booking.depositVoucherId}</p>
// // // //                   </div>
// // // //                 )}
// // // //               </div>
// // // //             </div>
// // // //           ) : booking ? (
// // // //             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
// // // //               <HeroTicket
// // // //                 trip={trip}
// // // //                 booking={booking}
// // // //                 onRateTrip={() => { }}
// // // //                 onCancelBooking={() => setIsCancelOpen(true)}
// // // //                 onMessageCarrier={() => { }}
// // // //                 onMessageGroup={() => { }}
// // // //               />
// // // //             </div>
// // // //           ) : (
// // // //             <ProxyWaitingState trip={trip} serverTime={serverTime} />
// // // //           )}
// // // //         </LocalErrorBoundary>
// // // //       </main>

// // // //       {/* [SCR-CANCEL]: نافذة تأكيد الإلغاء */}
// // // //       <CancellationDialog
// // // //         isOpen={isCancelOpen}
// // // //         onOpenChange={setIsCancelOpen}
// // // //         isCancelling={isCancelling}
// // // //         onConfirm={handleCancelBooking}
// // // //         trip={trip}
// // // //         booking={booking}
// // // //       />

// // // //       {/* [SCR-PHONE-GATE]: الشات مع gate التحقق بالرقم */}
// // // //       <FloatingChatBubble
// // // //         tripId={tripId}
// // // //         allowedPhones={allowedPhones}
// // // //         passengerName={primaryPassengerName}
// // // //       />
// // // //     </div>
// // // //   );
// // // // }
// // // 'use client';

// // // import { useParams, useRouter } from 'next/navigation';
// // // import { useFirestore, useMemoFirebase, useCollection } from '@/firebase';
// // // import { collection, query, where, limit, updateDoc, serverTimestamp, doc, getDoc, runTransaction, increment, addDoc } from 'firebase/firestore';
// // // import { BookingPaymentDialog } from '@/components/booking/booking-payment-dialog';
// // // import { TicketHeader } from '@/components/traveler/ticket-header';
// // // import { HeroTicket } from '@/components/history/hero-ticket';
// // // import { ProxyWaitingState } from '@/components/traveler/proxy-waiting-state';
// // // import { CancellationDialog } from '@/components/booking/cancellation-dialog';
// // // import { Skeleton } from '@/components/ui/skeleton';
// // // import type { Trip, Booking } from '@/lib/data';
// // // import { LocalErrorBoundary } from '@/components/ui/local-error-boundary';
// // // import { ShieldAlert, RefreshCw } from 'lucide-react';
// // // import { Button } from '@/components/ui/button';
// // // import { useMemo, useEffect, useState, useCallback } from 'react';
// // // import { FloatingChatBubble } from '@/components/traveler/floating-chat-bubble';
// // // import { useLiveTripReactor } from '@/hooks/use-live-trip-reactor';
// // // import { useLocale } from 'next-intl';

// // // /**
// // //  * @page SmartTicketPage
// // //  * @description THE REINFORCED NEURAL HUB (STERILIZED - V19.0 - SCR-PROXY-CHAT-CANCEL)
// // //  * [V19.0]:
// // //  *   - [SCR-CANCEL]: CancellationDialog مربوطة بدالة حقيقية:
// // //  *       1. تغيير status الـ booking إلى Cancelled
// // //  *       2. إرجاع الكراسي للرحلة عبر increment(+seats)
// // //  *       3. إشعار للناقل
// // //  *   - [SCR-PHONE-GATE]: استخراج allowedPhones من passengersDetails وتمريرها للـ FloatingChatBubble
// // //  * Protocol 16: Sterilized. Protocol 88: Zero Network Chatter.
// // //  */
// // // export default function SmartTicketPage() {
// // //   const params = useParams();
// // //   const idParam = params.id as string;
// // //   const firestore = useFirestore();
// // //   const router = useRouter();
// // //   const locale = useLocale();

// // //   const [resolvedTripId, setResolvedTripId] = useState<string | null>(null);
// // //   const [directBooking, setDirectBooking] = useState<Booking | null>(null);
// // //   const [isResolving, setIsResolving] = useState(true);
// // //   const [isPaymentOpen, setIsPaymentOpen] = useState(false);
// // //   const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);

// // //   // [SCR-CANCEL]: حالة نافذة الإلغاء
// // //   const [isCancelOpen, setIsCancelOpen] = useState(false);
// // //   const [isCancelling, setIsCancelling] = useState(false);

// // //   useEffect(() => {
// // //     if (!firestore || !idParam) return;
// // //     const resolve = async () => {
// // //       setIsResolving(true);
// // //       try {
// // //         const bookingSnap = await getDoc(doc(firestore, 'bookings', idParam));
// // //         if (bookingSnap.exists()) {
// // //           const b = { id: bookingSnap.id, ...bookingSnap.data() } as Booking;
// // //           setDirectBooking(b);
// // //           // ✅ [FIX] استخدم carrierTripId أولاً لو موجود — ده رحلة الناقل الحقيقية
// // //           // tripId ممكن يكون رحلة المسافر القديمة قبل ما الناقل يقبل
// // //           const effectiveTripId = (b as any).carrierTripId || b.tripId;
// // //           setResolvedTripId(effectiveTripId);
// // //         } else {
// // //           setResolvedTripId(idParam);
// // //         }
// // //       } catch {
// // //         setResolvedTripId(idParam);
// // //       } finally {
// // //         setIsResolving(false);
// // //       }
// // //     };
// // //     resolve();
// // //   }, [firestore, idParam]);

// // //   const tripId = resolvedTripId || idParam;

// // //   // [SCR-CANCEL]: دالة الإلغاء الحقيقية — 3 عمليات atomic
// // //   const handleCancelBooking = useCallback(async (reason: string) => {
// // //     const targetBooking = directBooking || bookingList?.[0];
// // //     if (!firestore || !targetBooking?.id) return;

// // //     setIsCancelling(true);
// // //     try {
// // //       await runTransaction(firestore, async (tx) => {
// // //         // 1. تغيير status الحجز
// // //         tx.update(doc(firestore, 'bookings', targetBooking.id), {
// // //           status: 'Cancelled',
// // //           cancelReason: reason,
// // //           cancelledBy: 'traveler',
// // //           cancelledAt: serverTimestamp(),
// // //           updatedAt: serverTimestamp(),
// // //         });

// // //         // 2. إرجاع الكراسي للرحلة — بس لو كان الحجز confirmed (مش pending)
// // //         // لو كان Pending-Carrier-Confirmation الناقل لسه ما خصمش الكراسي
// // //         const seatsToRestore = targetBooking.seats || 0;
// // //         const statusesRequiringRestore: Booking['status'][] = [
// // //           'Pending-Payment',
// // //           'Pending-Payment-Verification',
// // //           'Confirmed',
// // //         ];
// // //         if (seatsToRestore > 0 && statusesRequiringRestore.includes(targetBooking.status)) {
// // //           // [FIX]: رجّع الكراسي للـ carrierTripId (رحلة الناقل الفعلية) لو موجود
// // //           // وإلا رجّعها للـ tripId (رحلة المسافر)
// // //           const carrierTripId = (targetBooking as any).carrierTripId;
// // //           if (carrierTripId) {
// // //             tx.update(doc(firestore, 'trips', carrierTripId), {
// // //               availableSeats: increment(seatsToRestore),
// // //               updatedAt: serverTimestamp(),
// // //             });
// // //           }
// // //           // دايماً رجّع للـ tripId كمان (رحلة المسافر/الطلب)
// // //           if (targetBooking.tripId) {
// // //             tx.update(doc(firestore, 'trips', targetBooking.tripId), {
// // //               availableSeats: increment(seatsToRestore),
// // //               updatedAt: serverTimestamp(),
// // //             });
// // //           }
// // //         }
// // //       });

// // //       // 3. إشعار للناقل (خارج الـ transaction — مش critical)
// // //       if (targetBooking.carrierId) {
// // //         try {
// // //           await addDoc(
// // //             collection(doc(firestore, 'users', targetBooking.carrierId), 'notifications'),
// // //             {
// // //               userId: targetBooking.carrierId,
// // //               title: 'ألغى المسافر حجزه ❌',
// // //               message: `تم إلغاء حجز ${targetBooking.seats} مقعد — السبب: ${reason}`,
// // //               type: 'traveler_cancelled_booking',
// // //               bookingId: targetBooking.id,
// // //               tripId: targetBooking.tripId,
// // //               isRead: false,
// // //               link: `/${locale}/carrier/bookings`,
// // //               createdAt: serverTimestamp(),
// // //             }
// // //           );
// // //         } catch (notifError) {
// // //           // الإشعار مش critical — نسجله بس ومنوقفش العملية
// // //           console.warn('[TicketPage] Notification failed (non-critical):', notifError);
// // //         }
// // //       }

// // //       setIsCancelOpen(false);
// // //       // تحديث الـ directBooking محلياً فوراً
// // //       if (directBooking) {
// // //         setDirectBooking(prev => prev ? { ...prev, status: 'Cancelled', cancelReason: reason } : prev);
// // //       }
// // //     } catch (e) {
// // //       console.error('[TicketPage] Cancel failed:', e);
// // //     } finally {
// // //       setIsCancelling(false);
// // //     }
// // //   }, [firestore, directBooking, locale]);

// // //   const handleConfirmPayment = useCallback(async (targetBooking: any, onSuccess: () => void) => {
// // //     if (!firestore || !targetBooking?.id) return;
// // //     setIsConfirmingPayment(true);
// // //     try {
// // //       const voucherId = `PAY-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
// // //       await runTransaction(firestore, async (transaction) => {
// // //         transaction.update(doc(firestore, 'bookings', targetBooking.id), {
// // //           status: 'Pending-Payment-Verification',
// // //           depositVoucherId: voucherId,
// // //           paymentDeclaredAt: serverTimestamp(),
// // //           updatedAt: serverTimestamp(),
// // //         });
// // //       });
// // //       onSuccess();
// // //       setIsPaymentOpen(false);
// // //     } catch (e: any) {
// // //       console.error('[TicketPage] Payment failed:', e);
// // //     } finally {
// // //       setIsConfirmingPayment(false);
// // //     }
// // //   }, [firestore]);

// // //   // [SCR-914] Pulse Sensor
// // //   useEffect(() => {
// // //     if (!firestore || !tripId || isResolving) return;
// // //     const transmitViewPulse = async () => {
// // //       const storageKey = `safar_ticket_viewed_${tripId}`;
// // //       if (typeof window !== 'undefined' && sessionStorage.getItem(storageKey)) return;
// // //       try {
// // //         await updateDoc(doc(firestore, 'trips', tripId), { viewedAt: serverTimestamp() });
// // //         sessionStorage.setItem(storageKey, 'true');
// // //       } catch {
// // //         console.warn('[Pulse Sensor] Transmission silenced.');
// // //       }
// // //     };
// // //     transmitViewPulse();
// // //   }, [firestore, tripId, isResolving]);

// // //   const { trip, isLoading: isTripLoading, error: reactorError } = useLiveTripReactor(tripId);

// // //   const bookingQuery = useMemoFirebase(() => {
// // //     if (!firestore || !tripId || directBooking) return null;
// // //     const status = trip?.status;
// // //     if (status === 'Awaiting-Offers' || status === 'Pending-Carrier-Confirmation') return null;
// // //     return query(collection(firestore, 'bookings'), where('tripId', '==', tripId), limit(1));
// // //   }, [firestore, tripId, trip?.status, directBooking]);

// // //   const { data: bookingList, isLoading: isLoadingBooking } = useCollection<Booking>(bookingQuery);

// // //   const booking = useMemo(() => directBooking || bookingList?.[0] || null, [directBooking, bookingList]);

// // //   // [SCR-PHONE-GATE]: أرقام المسافرين للتحقق في الشات
// // //   const allowedPhones = useMemo(() => {
// // //     const details = booking?.passengersDetails || trip?.passengersDetails || [];
// // //     return details
// // //       .map((p: any) => p.phone || p.passengerPhone || '')
// // //       .filter(Boolean) as string[];
// // //   }, [booking?.passengersDetails, trip?.passengersDetails]);

// // //   const primaryPassengerName = useMemo(() => {
// // //     const details = booking?.passengersDetails || trip?.passengersDetails || [];
// // //     return (details[0] as any)?.name || (details[0] as any)?.passengerName || 'مسافر';
// // //   }, [booking?.passengersDetails, trip?.passengersDetails]);

// // //   const serverTime = useMemo(() => {
// // //     if (!trip?.createdAt) return new Date();
// // //     return typeof trip.createdAt.toDate === 'function' ? trip.createdAt.toDate() : new Date(trip.createdAt);
// // //   }, [trip?.createdAt]);

// // //   const isLoading = isResolving || isTripLoading || isLoadingBooking;

// // //   if (isLoading) {
// // //     return (
// // //       <div className="min-h-screen bg-background flex flex-col items-center">
// // //         <Skeleton className="h-24 w-full max-w-md sticky top-0" />
// // //         <main className="w-full max-w-md p-4 space-y-6">
// // //           <Skeleton className="h-64 w-full rounded-[2.5rem]" />
// // //         </main>
// // //       </div>
// // //     );
// // //   }

// // //   if (reactorError || !trip) {
// // //     return (
// // //       <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center gap-4">
// // //         <div className="bg-destructive/10 p-6 rounded-full">
// // //           <ShieldAlert className="h-16 w-16 text-destructive opacity-40 animate-pulse" />
// // //         </div>
// // //         <h1 className="text-2xl font-black tracking-tighter text-white">عذراً، التذكرة غير متاحة</h1>
// // //         <p className="text-sm text-muted-foreground font-bold">
// // //           {reactorError === 'TRIP_NOT_FOUND' ? 'ربما تمَّ إلغاء الرحلة نهائياً.' : 'لقد اصطدم الرادار بعائق تقني.'}
// // //         </p>
// // //         <div className="flex flex-col gap-2 w-full max-w-xs">
// // //           <Button variant="default" className="rounded-2xl h-12 px-8 font-black gap-2" onClick={() => window.location.reload()}>
// // //             <RefreshCw className="h-4 w-4" /> إعادة محاولة الاتصال
// // //           </Button>
// // //           <Button variant="outline" className="rounded-2xl h-12 px-8 font-black" onClick={() => router.push('/')}>العودة للرئيسية</Button>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="min-h-screen bg-background flex flex-col items-center w-full pb-32 overscroll-none" dir="rtl">
// // //       <div className="w-full max-w-md mx-auto sticky top-0 z-50">
// // //         <TicketHeader tripId={tripId} carrierId={trip.carrierId} tripStatus={trip.status} />
// // //       </div>
// // //       <main className="flex-1 w-full max-w-md mx-auto p-4">
// // //         <LocalErrorBoundary fallbackTitle="تعثرت البوابة الذكية">
// // //           {booking && booking.status === 'Pending-Carrier-Confirmation' ? (
// // //             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
// // //               <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-[2.5rem] p-8 text-center space-y-4">
// // //                 <div className="text-4xl">⏳</div>
// // //                 <h2 className="text-xl font-black tracking-tight">في انتظار موافقة الناقل</h2>
// // //                 <p className="text-sm text-muted-foreground font-bold">
// // //                   طلب الحجز وصل للناقل. سيتم إشعارك فور الموافقة.
// // //                 </p>
// // //                 <div className="bg-muted/30 p-4 rounded-2xl text-right space-y-2">
// // //                   <div className="flex justify-between text-xs font-bold">
// // //                     <span className="text-muted-foreground">المقاعد:</span>
// // //                     <span>{booking.seats}</span>
// // //                   </div>
// // //                   <div className="flex justify-between text-xs font-bold">
// // //                     <span className="text-muted-foreground">الإجمالي:</span>
// // //                     <span>{booking.totalPrice} {booking.currency}</span>
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           ) : booking && booking.status === 'Pending-Payment' ? (
// // //             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
// // //               <div className="bg-emerald-500/10 border-2 border-emerald-500/30 rounded-[2.5rem] p-8 text-center space-y-4">
// // //                 <div className="text-5xl">✅</div>
// // //                 <h2 className="text-xl font-black tracking-tight text-emerald-500">وافق الناقل على حجزك!</h2>
// // //                 <p className="text-sm text-muted-foreground font-bold">
// // //                   أكمل الحجز بدفع العربون الآن لتأكيد مقعدك.
// // //                 </p>
// // //                 <div className="bg-muted/30 p-4 rounded-2xl text-right space-y-2">
// // //                   <div className="flex justify-between text-xs font-bold">
// // //                     <span className="text-muted-foreground">المسار:</span>
// // //                     <span>{trip.origin} ← {trip.destination}</span>
// // //                   </div>
// // //                   <div className="flex justify-between text-xs font-bold">
// // //                     <span className="text-muted-foreground">المقاعد:</span>
// // //                     <span>{booking.seats}</span>
// // //                   </div>
// // //                   <div className="flex justify-between text-xs font-bold">
// // //                     <span className="text-muted-foreground">الإجمالي:</span>
// // //                     <span className="font-black text-white">{booking.totalPrice} {booking.currency}</span>
// // //                   </div>
// // //                 </div>
// // //                 <button
// // //                   onClick={() => setIsPaymentOpen(true)}
// // //                   className="w-full h-16 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xl rounded-3xl shadow-[0_20px_50px_rgba(22,163,74,0.4)] transition-all active:scale-95 flex items-center justify-center gap-3"
// // //                 >
// // //                   💳 ادفع العربون الآن
// // //                 </button>
// // //               </div>

// // //               <BookingPaymentDialog
// // //                 isOpen={isPaymentOpen}
// // //                 onOpenChange={setIsPaymentOpen}
// // //                 trip={trip}
// // //                 booking={booking}
// // //                 onConfirm={(receiptUrl) => handleConfirmPayment(booking, () => { })}
// // //                 isProcessing={isConfirmingPayment}
// // //               />
// // //             </div>
// // //           ) : booking && booking.status === 'Pending-Payment-Verification' ? (
// // //             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
// // //               <div className="bg-blue-500/10 border-2 border-blue-500/30 rounded-[2.5rem] p-8 text-center space-y-4">
// // //                 <div className="text-5xl">🔵</div>
// // //                 <h2 className="text-xl font-black tracking-tight text-blue-400">تم استلام إشعار دفعك!</h2>
// // //                 <p className="text-sm text-muted-foreground font-bold">
// // //                   الناقل سيراجع السند ويختم الاستلام. ستظهر تذكرتك فور التأكيد.
// // //                 </p>
// // //                 {booking.depositVoucherId && (
// // //                   <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
// // //                     <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">رقم سند الدفع</p>
// // //                     <p className="font-mono font-black text-blue-300 text-lg tracking-widest">{booking.depositVoucherId}</p>
// // //                   </div>
// // //                 )}
// // //               </div>
// // //             </div>
// // //           ) : booking ? (
// // //             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
// // //               <HeroTicket
// // //                 trip={trip}
// // //                 booking={booking}
// // //                 onRateTrip={() => { }}
// // //                 onCancelBooking={() => setIsCancelOpen(true)}
// // //                 onMessageCarrier={() => { }}
// // //                 onMessageGroup={() => { }}
// // //               />
// // //             </div>
// // //           ) : (
// // //             <ProxyWaitingState trip={trip} serverTime={serverTime} />
// // //           )}
// // //         </LocalErrorBoundary>
// // //       </main>

// // //       {/* [SCR-CANCEL]: نافذة تأكيد الإلغاء */}
// // //       <CancellationDialog
// // //         isOpen={isCancelOpen}
// // //         onOpenChange={setIsCancelOpen}
// // //         isCancelling={isCancelling}
// // //         onConfirm={handleCancelBooking}
// // //         trip={trip}
// // //         booking={booking}
// // //       />

// // //       {/* [SCR-PHONE-GATE]: الشات مع gate التحقق بالرقم */}
// // //       <FloatingChatBubble
// // //         tripId={tripId}
// // //         allowedPhones={allowedPhones}
// // //         passengerName={primaryPassengerName}
// // //       />
// // //     </div>
// // //   );
// // // }

// // 'use client';

// // import { useParams, useRouter } from 'next/navigation';
// // import { useFirestore, useMemoFirebase, useCollection, useUser } from '@/firebase';
// // import { collection, query, where, limit, updateDoc, serverTimestamp, doc, getDoc, runTransaction, increment, addDoc, writeBatch, arrayUnion, Timestamp } from 'firebase/firestore';
// // import { BookingPaymentDialog } from '@/components/booking/booking-payment-dialog';
// // import { TicketHeader } from '@/components/traveler/ticket-header';
// // import { HeroTicket } from '@/components/history/hero-ticket';
// // import { ProxyWaitingState } from '@/components/traveler/proxy-waiting-state';
// // import { CancellationDialog } from '@/components/booking/cancellation-dialog';
// // import { Skeleton } from '@/components/ui/skeleton';
// // import type { Trip, Booking } from '@/lib/data';
// // import { LocalErrorBoundary } from '@/components/ui/local-error-boundary';
// // import { ShieldAlert, RefreshCw, Clock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
// // import { Button } from '@/components/ui/button';
// // import { useMemo, useEffect, useState, useCallback } from 'react';
// // import { FloatingChatBubble } from '@/components/traveler/floating-chat-bubble';
// // import { useLiveTripReactor } from '@/hooks/use-live-trip-reactor';
// // import { useLocale } from 'next-intl';

// // /**
// //  * @page SmartTicketPage
// //  * @description THE REINFORCED NEURAL HUB (STERILIZED - V19.0 - SCR-PROXY-CHAT-CANCEL)
// //  * [V19.0]:
// //  *   - [SCR-CANCEL]: CancellationDialog مربوطة بدالة حقيقية:
// //  *       1. تغيير status الـ booking إلى Cancelled
// //  *       2. إرجاع الكراسي للرحلة عبر increment(+seats)
// //  *       3. إشعار للناقل
// //  *   - [SCR-PHONE-GATE]: استخراج allowedPhones من passengersDetails وتمريرها للـ FloatingChatBubble
// //  * Protocol 16: Sterilized. Protocol 88: Zero Network Chatter.
// //  */
// // export default function SmartTicketPage() {
// //   const params = useParams();
// //   const idParam = params.id as string;
// //   const firestore = useFirestore();
// //   const router = useRouter();
// //   const locale = useLocale();
// //   const { user } = useUser();

// //   const [resolvedTripId, setResolvedTripId] = useState<string | null>(null);
// //   const [directBooking, setDirectBooking] = useState<Booking | null>(null);
// //   const [isResolving, setIsResolving] = useState(true);
// //   const [isPaymentOpen, setIsPaymentOpen] = useState(false);
// //   const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);

// //   // [SCR-CANCEL]: حالة نافذة الإلغاء
// //   const [isCancelOpen, setIsCancelOpen] = useState(false);
// //   const [isCancelling, setIsCancelling] = useState(false);

// //   // [SCR-RESCHEDULE]: حالة الموافقة/الرفض على طلب تغيير الموعد
// //   const [isRescheduling, setIsRescheduling] = useState(false);

// //   useEffect(() => {
// //     if (!firestore || !idParam) return;
// //     const resolve = async () => {
// //       setIsResolving(true);
// //       try {
// //         const bookingSnap = await getDoc(doc(firestore, 'bookings', idParam));
// //         if (bookingSnap.exists()) {
// //           const b = { id: bookingSnap.id, ...bookingSnap.data() } as Booking;
// //           setDirectBooking(b);
// //           // ✅ [FIX] استخدم carrierTripId أولاً لو موجود — ده رحلة الناقل الحقيقية
// //           // tripId ممكن يكون رحلة المسافر القديمة قبل ما الناقل يقبل
// //           const effectiveTripId = (b as any).carrierTripId || b.tripId;
// //           setResolvedTripId(effectiveTripId);
// //         } else {
// //           setResolvedTripId(idParam);
// //         }
// //       } catch {
// //         setResolvedTripId(idParam);
// //       } finally {
// //         setIsResolving(false);
// //       }
// //     };
// //     resolve();
// //   }, [firestore, idParam]);

// //   const tripId = resolvedTripId || idParam;

// //   // [SCR-CANCEL]: دالة الإلغاء الحقيقية — 3 عمليات atomic
// //   const handleCancelBooking = useCallback(async (reason: string) => {
// //     const targetBooking = directBooking || bookingList?.[0];
// //     if (!firestore || !targetBooking?.id) return;

// //     setIsCancelling(true);
// //     try {
// //       await runTransaction(firestore, async (tx) => {
// //         // 1. تغيير status الحجز
// //         tx.update(doc(firestore, 'bookings', targetBooking.id), {
// //           status: 'Cancelled',
// //           cancelReason: reason,
// //           cancelledBy: 'traveler',
// //           cancelledAt: serverTimestamp(),
// //           updatedAt: serverTimestamp(),
// //         });

// //         // 2. إرجاع الكراسي للرحلة — بس لو كان الحجز confirmed (مش pending)
// //         // لو كان Pending-Carrier-Confirmation الناقل لسه ما خصمش الكراسي
// //         const seatsToRestore = targetBooking.seats || 0;
// //         const statusesRequiringRestore: Booking['status'][] = [
// //           'Pending-Payment',
// //           'Pending-Payment-Verification',
// //           'Confirmed',
// //         ];
// //         if (seatsToRestore > 0 && statusesRequiringRestore.includes(targetBooking.status)) {
// //           // [FIX]: رجّع الكراسي للـ carrierTripId (رحلة الناقل الفعلية) لو موجود
// //           // وإلا رجّعها للـ tripId (رحلة المسافر)
// //           const carrierTripId = (targetBooking as any).carrierTripId;
// //           if (carrierTripId) {
// //             tx.update(doc(firestore, 'trips', carrierTripId), {
// //               availableSeats: increment(seatsToRestore),
// //               updatedAt: serverTimestamp(),
// //             });
// //           }
// //           // دايماً رجّع للـ tripId كمان (رحلة المسافر/الطلب)
// //           if (targetBooking.tripId) {
// //             tx.update(doc(firestore, 'trips', targetBooking.tripId), {
// //               availableSeats: increment(seatsToRestore),
// //               updatedAt: serverTimestamp(),
// //             });
// //           }
// //         }
// //       });

// //       // 3. إشعار للناقل (خارج الـ transaction — مش critical)
// //       if (targetBooking.carrierId) {
// //         try {
// //           await addDoc(
// //             collection(doc(firestore, 'users', targetBooking.carrierId), 'notifications'),
// //             {
// //               userId: targetBooking.carrierId,
// //               title: 'ألغى المسافر حجزه ❌',
// //               message: `تم إلغاء حجز ${targetBooking.seats} مقعد — السبب: ${reason}`,
// //               type: 'traveler_cancelled_booking',
// //               bookingId: targetBooking.id,
// //               tripId: targetBooking.tripId,
// //               isRead: false,
// //               link: `/${locale}/carrier/bookings`,
// //               createdAt: serverTimestamp(),
// //             }
// //           );
// //         } catch (notifError) {
// //           // الإشعار مش critical — نسجله بس ومنوقفش العملية
// //           console.warn('[TicketPage] Notification failed (non-critical):', notifError);
// //         }
// //       }

// //       setIsCancelOpen(false);
// //       // تحديث الـ directBooking محلياً فوراً
// //       if (directBooking) {
// //         setDirectBooking(prev => prev ? { ...prev, status: 'Cancelled', cancelReason: reason } : prev);
// //       }
// //     } catch (e) {
// //       console.error('[TicketPage] Cancel failed:', e);
// //     } finally {
// //       setIsCancelling(false);
// //     }
// //   }, [firestore, directBooking, locale]);


// //   const handleConfirmPayment = useCallback(async (targetBooking: any, onSuccess: () => void) => {
// //     if (!firestore || !targetBooking?.id) return;
// //     setIsConfirmingPayment(true);
// //     try {
// //       const voucherId = `PAY-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
// //       await runTransaction(firestore, async (transaction) => {
// //         transaction.update(doc(firestore, 'bookings', targetBooking.id), {
// //           status: 'Pending-Payment-Verification',
// //           depositVoucherId: voucherId,
// //           paymentDeclaredAt: serverTimestamp(),
// //           updatedAt: serverTimestamp(),
// //         });
// //       });
// //       onSuccess();
// //       setIsPaymentOpen(false);
// //     } catch (e: any) {
// //       console.error('[TicketPage] Payment failed:', e);
// //     } finally {
// //       setIsConfirmingPayment(false);
// //     }
// //   }, [firestore]);

// //   // [SCR-914] Pulse Sensor
// //   useEffect(() => {
// //     if (!firestore || !tripId || isResolving) return;
// //     const transmitViewPulse = async () => {
// //       const storageKey = `safar_ticket_viewed_${tripId}`;
// //       if (typeof window !== 'undefined' && sessionStorage.getItem(storageKey)) return;
// //       try {
// //         await updateDoc(doc(firestore, 'trips', tripId), { viewedAt: serverTimestamp() });
// //         sessionStorage.setItem(storageKey, 'true');
// //       } catch {
// //         console.warn('[Pulse Sensor] Transmission silenced.');
// //       }
// //     };
// //     transmitViewPulse();
// //   }, [firestore, tripId, isResolving]);

// //   const { trip, isLoading: isTripLoading, error: reactorError } = useLiveTripReactor(tripId);

// //   const bookingQuery = useMemoFirebase(() => {
// //     if (!firestore || !tripId || directBooking) return null;
// //     const status = trip?.status;
// //     if (status === 'Awaiting-Offers' || status === 'Pending-Carrier-Confirmation') return null;
// //     return query(collection(firestore, 'bookings'), where('tripId', '==', tripId), limit(1));
// //   }, [firestore, tripId, trip?.status, directBooking]);

// //   const { data: bookingList, isLoading: isLoadingBooking } = useCollection<Booking>(bookingQuery);

// //   // [SCR-RESCHEDULE]: موافقة أو رفض طلب تغيير الموعد — مكانها بعد تعريف bookingList
// //   const handleRescheduleResponse = useCallback(async (approve: boolean) => {
// //     if (!firestore || !user?.uid) return;
// //     const targetBooking = directBooking || bookingList?.[0];
// //     if (!targetBooking) return;

// //     const effectiveTripId = (targetBooking as any).carrierTripId || targetBooking.tripId || tripId;
// //     const tripRef = doc(firestore, 'trips', effectiveTripId);
// //     setIsRescheduling(true);
// //     try {
// //       const tripSnap = await getDoc(tripRef);
// //       if (!tripSnap.exists()) return;
// //       const tripData = tripSnap.data() as Trip & { pendingReschedule?: any };
// //       const pending = tripData.pendingReschedule;
// //       if (!pending) return;

// //       const batch = writeBatch(firestore);

// //       if (approve) {
// //         const newApprovals = [...(pending.approvals || []), user.uid];
// //         const allApproved = newApprovals.length >= pending.totalRequired;

// //         if (allApproved) {
// //           const updatePayload: any = {
// //             departureDate: Timestamp.fromDate(new Date(pending.newDepartureDate)),
// //             pendingReschedule: null,
// //             updatedAt: serverTimestamp(),
// //           };
// //           if (pending.newDepartureTime) updatePayload.departureTime = pending.newDepartureTime;
// //           batch.update(tripRef, updatePayload);
// //           await batch.commit();

// //           if (tripData.carrierId) {
// //             try {
// //               await addDoc(
// //                 collection(doc(firestore, 'users', tripData.carrierId), 'notifications'),
// //                 {
// //                   userId: tripData.carrierId,
// //                   title: '✅ وافق جميع المسافرين على تغيير الموعد',
// //                   message: `تم تطبيق الموعد الجديد لرحلة ${tripData.origin} ← ${tripData.destination}`,
// //                   type: 'reschedule_approved',
// //                   tripId: effectiveTripId,
// //                   isRead: false,
// //                   link: `/${locale}/carrier/trips`,
// //                   createdAt: serverTimestamp(),
// //                 }
// //               );
// //             } catch { /* non-critical */ }
// //           }
// //         } else {
// //           batch.update(tripRef, {
// //             'pendingReschedule.approvals': arrayUnion(user.uid),
// //             updatedAt: serverTimestamp(),
// //           });
// //           await batch.commit();
// //         }
// //       } else {
// //         batch.update(tripRef, {
// //           pendingReschedule: null,
// //           updatedAt: serverTimestamp(),
// //         });
// //         await batch.commit();

// //         if (tripData.carrierId) {
// //           try {
// //             await addDoc(
// //               collection(doc(firestore, 'users', tripData.carrierId), 'notifications'),
// //               {
// //                 userId: tripData.carrierId,
// //                 title: '❌ رفض مسافر طلب تغيير الموعد',
// //                 message: `رفض أحد المسافرين تغيير الموعد لرحلة ${tripData.origin} ← ${tripData.destination}. يحق له الإلغاء مجاناً.`,
// //                 type: 'reschedule_rejected',
// //                 tripId: effectiveTripId,
// //                 isRead: false,
// //                 link: `/${locale}/carrier/bookings`,
// //                 createdAt: serverTimestamp(),
// //               }
// //             );
// //           } catch { /* non-critical */ }
// //         }
// //       }
// //     } catch (e) {
// //       console.error('[TicketPage] Reschedule response failed:', e);
// //     } finally {
// //       setIsRescheduling(false);
// //     }
// //   }, [firestore, user?.uid, directBooking, bookingList, tripId, locale]);


// //   const booking = useMemo(() => directBooking || bookingList?.[0] || null, [directBooking, bookingList]);

// //   // [SCR-PHONE-GATE]: أرقام المسافرين للتحقق في الشات
// //   const allowedPhones = useMemo(() => {
// //     const details = booking?.passengersDetails || trip?.passengersDetails || [];
// //     return details
// //       .map((p: any) => p.phone || p.passengerPhone || '')
// //       .filter(Boolean) as string[];
// //   }, [booking?.passengersDetails, trip?.passengersDetails]);

// //   const primaryPassengerName = useMemo(() => {
// //     const details = booking?.passengersDetails || trip?.passengersDetails || [];
// //     return (details[0] as any)?.name || (details[0] as any)?.passengerName || 'مسافر';
// //   }, [booking?.passengersDetails, trip?.passengersDetails]);

// //   const serverTime = useMemo(() => {
// //     if (!trip?.createdAt) return new Date();
// //     return typeof trip.createdAt.toDate === 'function' ? trip.createdAt.toDate() : new Date(trip.createdAt);
// //   }, [trip?.createdAt]);

// //   const isLoading = isResolving || isTripLoading || isLoadingBooking;

// //   if (isLoading) {
// //     return (
// //       <div className="min-h-screen bg-background flex flex-col items-center">
// //         <Skeleton className="h-24 w-full max-w-md sticky top-0" />
// //         <main className="w-full max-w-md p-4 space-y-6">
// //           <Skeleton className="h-64 w-full rounded-[2.5rem]" />
// //         </main>
// //       </div>
// //     );
// //   }

// //   if (reactorError || !trip) {
// //     return (
// //       <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center gap-4">
// //         <div className="bg-destructive/10 p-6 rounded-full">
// //           <ShieldAlert className="h-16 w-16 text-destructive opacity-40 animate-pulse" />
// //         </div>
// //         <h1 className="text-2xl font-black tracking-tighter text-white">عذراً، التذكرة غير متاحة</h1>
// //         <p className="text-sm text-muted-foreground font-bold">
// //           {reactorError === 'TRIP_NOT_FOUND' ? 'ربما تمَّ إلغاء الرحلة نهائياً.' : 'لقد اصطدم الرادار بعائق تقني.'}
// //         </p>
// //         <div className="flex flex-col gap-2 w-full max-w-xs">
// //           <Button variant="default" className="rounded-2xl h-12 px-8 font-black gap-2" onClick={() => window.location.reload()}>
// //             <RefreshCw className="h-4 w-4" /> إعادة محاولة الاتصال
// //           </Button>
// //           <Button variant="outline" className="rounded-2xl h-12 px-8 font-black" onClick={() => router.push('/')}>العودة للرئيسية</Button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-background flex flex-col items-center w-full pb-32 overscroll-none" dir="rtl">
// //       <div className="w-full max-w-md mx-auto sticky top-0 z-50">
// //         <TicketHeader tripId={tripId} carrierId={trip.carrierId} tripStatus={trip.status} />
// //       </div>
// //       <main className="flex-1 w-full max-w-md mx-auto p-4">
// //         <LocalErrorBoundary fallbackTitle="تعثرت البوابة الذكية">

// //           {/* [SCR-RESCHEDULE]: بانر طلب تغيير الموعد — يظهر فوق كل شيء لو في طلب معلق */}
// //           {(trip as any).pendingReschedule && booking && user?.uid && !(trip as any).pendingReschedule?.approvals?.includes(user.uid) && !(trip as any).pendingReschedule?.rejections?.includes(user.uid) && (
// //             <div className="mb-6 bg-blue-500/10 border-2 border-blue-500/30 rounded-[2.5rem] p-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
// //               <div className="flex items-center gap-3">
// //                 <div className="bg-blue-500/20 p-2 rounded-full">
// //                   <Clock className="h-6 w-6 text-blue-400" />
// //                 </div>
// //                 <div>
// //                   <h3 className="font-black text-blue-300 text-base">طلب تغيير موعد الرحلة</h3>
// //                   <p className="text-xs text-muted-foreground font-bold">الناقل يطلب تغيير موعد الانطلاق</p>
// //                 </div>
// //               </div>
// //               <div className="bg-muted/30 rounded-2xl p-4 space-y-2 text-right">
// //                 <div className="flex justify-between text-xs font-bold">
// //                   <span className="text-muted-foreground">الموعد الجديد:</span>
// //                   <span className="text-white font-black">
// //                     {new Date((trip as any).pendingReschedule.newDepartureDate).toLocaleDateString('ar', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
// //                     {(trip as any).pendingReschedule.newDepartureTime ? ` — ${(trip as any).pendingReschedule.newDepartureTime}` : ''}
// //                   </span>
// //                 </div>
// //                 {(trip as any).pendingReschedule.reason && (
// //                   <div className="flex justify-between text-xs font-bold gap-2">
// //                     <span className="text-muted-foreground shrink-0">السبب:</span>
// //                     <span className="text-right text-muted-foreground">{(trip as any).pendingReschedule.reason}</span>
// //                   </div>
// //                 )}
// //                 <div className="flex justify-between text-xs font-bold">
// //                   <span className="text-muted-foreground">الموافقات:</span>
// //                   <span className="text-emerald-400">{(trip as any).pendingReschedule.approvals?.length || 0} / {(trip as any).pendingReschedule.totalRequired}</span>
// //                 </div>
// //               </div>
// //               <p className="text-xs text-muted-foreground font-bold text-center">
// //                 في حال الرفض يحق لك إلغاء حجزك مجاناً
// //               </p>
// //               <div className="grid grid-cols-2 gap-3">
// //                 <Button
// //                   variant="outline"
// //                   className="h-12 font-black rounded-2xl border-destructive/50 text-destructive hover:bg-destructive/10"
// //                   disabled={isRescheduling}
// //                   onClick={() => handleRescheduleResponse(false)}
// //                 >
// //                   {isRescheduling ? <Loader2 className="h-4 w-4 animate-spin" /> : <><XCircle className="h-4 w-4 ml-1" />رفض</>}
// //                 </Button>
// //                 <Button
// //                   className="h-12 font-black rounded-2xl bg-emerald-600 hover:bg-emerald-700"
// //                   disabled={isRescheduling}
// //                   onClick={() => handleRescheduleResponse(true)}
// //                 >
// //                   {isRescheduling ? <Loader2 className="h-4 w-4 animate-spin" /> : <><CheckCircle2 className="h-4 w-4 ml-1" />موافقة</>}
// //                 </Button>
// //               </div>
// //             </div>
// //           )}

// //           {booking && booking.status === 'Pending-Carrier-Confirmation' ? (
// //             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
// //               <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-[2.5rem] p-8 text-center space-y-4">
// //                 <div className="text-4xl">⏳</div>
// //                 <h2 className="text-xl font-black tracking-tight">في انتظار موافقة الناقل</h2>
// //                 <p className="text-sm text-muted-foreground font-bold">
// //                   طلب الحجز وصل للناقل. سيتم إشعارك فور الموافقة.
// //                 </p>
// //                 <div className="bg-muted/30 p-4 rounded-2xl text-right space-y-2">
// //                   <div className="flex justify-between text-xs font-bold">
// //                     <span className="text-muted-foreground">المقاعد:</span>
// //                     <span>{booking.seats}</span>
// //                   </div>
// //                   <div className="flex justify-between text-xs font-bold">
// //                     <span className="text-muted-foreground">الإجمالي:</span>
// //                     <span>{booking.totalPrice} {booking.currency}</span>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           ) : booking && booking.status === 'Pending-Payment' ? (
// //             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
// //               <div className="bg-emerald-500/10 border-2 border-emerald-500/30 rounded-[2.5rem] p-8 text-center space-y-4">
// //                 <div className="text-5xl">✅</div>
// //                 <h2 className="text-xl font-black tracking-tight text-emerald-500">وافق الناقل على حجزك!</h2>
// //                 <p className="text-sm text-muted-foreground font-bold">
// //                   أكمل الحجز بدفع العربون الآن لتأكيد مقعدك.
// //                 </p>
// //                 <div className="bg-muted/30 p-4 rounded-2xl text-right space-y-2">
// //                   <div className="flex justify-between text-xs font-bold">
// //                     <span className="text-muted-foreground">المسار:</span>
// //                     <span>{trip.origin} ← {trip.destination}</span>
// //                   </div>
// //                   <div className="flex justify-between text-xs font-bold">
// //                     <span className="text-muted-foreground">المقاعد:</span>
// //                     <span>{booking.seats}</span>
// //                   </div>
// //                   <div className="flex justify-between text-xs font-bold">
// //                     <span className="text-muted-foreground">الإجمالي:</span>
// //                     <span className="font-black text-white">{booking.totalPrice} {booking.currency}</span>
// //                   </div>
// //                 </div>
// //                 <button
// //                   onClick={() => setIsPaymentOpen(true)}
// //                   className="w-full h-16 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xl rounded-3xl shadow-[0_20px_50px_rgba(22,163,74,0.4)] transition-all active:scale-95 flex items-center justify-center gap-3"
// //                 >
// //                   💳 ادفع العربون الآن
// //                 </button>
// //               </div>

// //               <BookingPaymentDialog
// //                 isOpen={isPaymentOpen}
// //                 onOpenChange={setIsPaymentOpen}
// //                 trip={trip}
// //                 booking={booking}
// //                 onConfirm={(receiptUrl) => handleConfirmPayment(booking, () => { })}
// //                 isProcessing={isConfirmingPayment}
// //               />
// //             </div>
// //           ) : booking && booking.status === 'Pending-Payment-Verification' ? (
// //             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
// //               <div className="bg-blue-500/10 border-2 border-blue-500/30 rounded-[2.5rem] p-8 text-center space-y-4">
// //                 <div className="text-5xl">🔵</div>
// //                 <h2 className="text-xl font-black tracking-tight text-blue-400">تم استلام إشعار دفعك!</h2>
// //                 <p className="text-sm text-muted-foreground font-bold">
// //                   الناقل سيراجع السند ويختم الاستلام. ستظهر تذكرتك فور التأكيد.
// //                 </p>
// //                 {booking.depositVoucherId && (
// //                   <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
// //                     <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">رقم سند الدفع</p>
// //                     <p className="font-mono font-black text-blue-300 text-lg tracking-widest">{booking.depositVoucherId}</p>
// //                   </div>
// //                 )}
// //               </div>
// //             </div>
// //           ) : booking ? (
// //             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
// //               <HeroTicket
// //                 trip={trip}
// //                 booking={booking}
// //                 onRateTrip={() => { }}
// //                 onCancelBooking={() => setIsCancelOpen(true)}
// //                 onMessageCarrier={() => { }}
// //                 onMessageGroup={() => { }}
// //               />
// //             </div>
// //           ) : (
// //             <ProxyWaitingState trip={trip} serverTime={serverTime} />
// //           )}
// //         </LocalErrorBoundary>
// //       </main>

// //       {/* [SCR-CANCEL]: نافذة تأكيد الإلغاء */}
// //       <CancellationDialog
// //         isOpen={isCancelOpen}
// //         onOpenChange={setIsCancelOpen}
// //         isCancelling={isCancelling}
// //         onConfirm={handleCancelBooking}
// //         trip={trip}
// //         booking={booking}
// //       />

// //       {/* [SCR-PHONE-GATE]: الشات مع gate التحقق بالرقم */}
// //       <FloatingChatBubble
// //         tripId={tripId}
// //         allowedPhones={allowedPhones}
// //         passengerName={primaryPassengerName}
// //       />
// //     </div>
// //   );
// // }

// 'use client';

// import { useParams, useRouter } from 'next/navigation';
// import { useFirestore, useMemoFirebase, useCollection, useUser } from '@/firebase';
// import { collection, query, where, limit, updateDoc, serverTimestamp, doc, getDoc, runTransaction, increment, addDoc, writeBatch, arrayUnion, Timestamp } from 'firebase/firestore';
// import { BookingPaymentDialog } from '@/components/booking/booking-payment-dialog';
// import { TicketHeader } from '@/components/traveler/ticket-header';
// import { HeroTicket } from '@/components/history/hero-ticket';
// import { ProxyWaitingState } from '@/components/traveler/proxy-waiting-state';
// import { CancellationDialog } from '@/components/booking/cancellation-dialog';
// import { Skeleton } from '@/components/ui/skeleton';
// import type { Trip, Booking } from '@/lib/data';
// import { LocalErrorBoundary } from '@/components/ui/local-error-boundary';
// import { ShieldAlert, RefreshCw, Clock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { useMemo, useEffect, useState, useCallback } from 'react';
// import { FloatingChatBubble } from '@/components/traveler/floating-chat-bubble';
// import { useLiveTripReactor } from '@/hooks/use-live-trip-reactor';
// import { useLocale } from 'next-intl';

// /**
//  * @page SmartTicketPage
//  * @description THE REINFORCED NEURAL HUB (STERILIZED - V19.0 - SCR-PROXY-CHAT-CANCEL)
//  * [V19.0]:
//  *   - [SCR-CANCEL]: CancellationDialog مربوطة بدالة حقيقية:
//  *       1. تغيير status الـ booking إلى Cancelled
//  *       2. إرجاع الكراسي للرحلة عبر increment(+seats)
//  *       3. إشعار للناقل
//  *   - [SCR-PHONE-GATE]: استخراج allowedPhones من passengersDetails وتمريرها للـ FloatingChatBubble
//  * Protocol 16: Sterilized. Protocol 88: Zero Network Chatter.
//  */
// export default function SmartTicketPage() {
//   const params = useParams();
//   const idParam = params.id as string;
//   const firestore = useFirestore();
//   const router = useRouter();
//   const locale = useLocale();
//   const { user } = useUser();

//   const [resolvedTripId, setResolvedTripId] = useState<string | null>(null);
//   const [directBooking, setDirectBooking] = useState<Booking | null>(null);
//   const [isResolving, setIsResolving] = useState(true);
//   const [isPaymentOpen, setIsPaymentOpen] = useState(false);
//   const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);

//   // [SCR-CANCEL]: حالة نافذة الإلغاء
//   const [isCancelOpen, setIsCancelOpen] = useState(false);
//   const [isCancelling, setIsCancelling] = useState(false);

//   // [SCR-RESCHEDULE]: حالة الموافقة/الرفض على طلب تغيير الموعد
//   const [isRescheduling, setIsRescheduling] = useState(false);

//   useEffect(() => {
//     if (!firestore || !idParam) return;
//     const resolve = async () => {
//       setIsResolving(true);
//       try {
//         const bookingSnap = await getDoc(doc(firestore, 'bookings', idParam));
//         if (bookingSnap.exists()) {
//           const b = { id: bookingSnap.id, ...bookingSnap.data() } as Booking;
//           setDirectBooking(b);
//           // ✅ [FIX] استخدم carrierTripId أولاً لو موجود — ده رحلة الناقل الحقيقية
//           // tripId ممكن يكون رحلة المسافر القديمة قبل ما الناقل يقبل
//           const effectiveTripId = (b as any).carrierTripId || b.tripId;
//           setResolvedTripId(effectiveTripId);
//         } else {
//           setResolvedTripId(idParam);
//         }
//       } catch {
//         setResolvedTripId(idParam);
//       } finally {
//         setIsResolving(false);
//       }
//     };
//     resolve();
//   }, [firestore, idParam]);

//   const tripId = resolvedTripId || idParam;

//   // [SCR-CANCEL]: دالة الإلغاء الحقيقية — 3 عمليات atomic
//   const handleCancelBooking = useCallback(async (reason: string) => {
//     const targetBooking = directBooking || bookingList?.[0];
//     if (!firestore || !targetBooking?.id) return;

//     setIsCancelling(true);
//     try {
//       await runTransaction(firestore, async (tx) => {
//         // 1. تغيير status الحجز
//         tx.update(doc(firestore, 'bookings', targetBooking.id), {
//           status: 'Cancelled',
//           cancelReason: reason,
//           cancelledBy: 'traveler',
//           cancelledAt: serverTimestamp(),
//           updatedAt: serverTimestamp(),
//         });

//         // 2. إرجاع الكراسي للرحلة — بس لو كان الحجز confirmed (مش pending)
//         // لو كان Pending-Carrier-Confirmation الناقل لسه ما خصمش الكراسي
//         const seatsToRestore = targetBooking.seats || 0;
//         const statusesRequiringRestore: Booking['status'][] = [
//           'Pending-Payment',
//           'Pending-Payment-Verification',
//           'Confirmed',
//         ];
//         if (seatsToRestore > 0 && statusesRequiringRestore.includes(targetBooking.status)) {
//           // [FIX]: رجّع الكراسي للـ carrierTripId (رحلة الناقل الفعلية) لو موجود
//           // وإلا رجّعها للـ tripId (رحلة المسافر)
//           const carrierTripId = (targetBooking as any).carrierTripId;
//           if (carrierTripId) {
//             tx.update(doc(firestore, 'trips', carrierTripId), {
//               availableSeats: increment(seatsToRestore),
//               updatedAt: serverTimestamp(),
//             });
//           }
//           // دايماً رجّع للـ tripId كمان (رحلة المسافر/الطلب)
//           if (targetBooking.tripId) {
//             tx.update(doc(firestore, 'trips', targetBooking.tripId), {
//               availableSeats: increment(seatsToRestore),
//               updatedAt: serverTimestamp(),
//             });
//           }
//         }
//       });

//       // 3. إشعار للناقل (خارج الـ transaction — مش critical)
//       if (targetBooking.carrierId) {
//         try {
//           await addDoc(
//             collection(doc(firestore, 'users', targetBooking.carrierId), 'notifications'),
//             {
//               userId: targetBooking.carrierId,
//               title: 'ألغى المسافر حجزه ❌',
//               message: `تم إلغاء حجز ${targetBooking.seats} مقعد — السبب: ${reason}`,
//               type: 'traveler_cancelled_booking',
//               bookingId: targetBooking.id,
//               tripId: targetBooking.tripId,
//               isRead: false,
//               link: `/${locale}/carrier/bookings`,
//               createdAt: serverTimestamp(),
//             }
//           );
//         } catch (notifError) {
//           // الإشعار مش critical — نسجله بس ومنوقفش العملية
//           console.warn('[TicketPage] Notification failed (non-critical):', notifError);
//         }
//       }

//       setIsCancelOpen(false);
//       // تحديث الـ directBooking محلياً فوراً
//       if (directBooking) {
//         setDirectBooking(prev => prev ? { ...prev, status: 'Cancelled', cancelReason: reason } : prev);
//       }
//     } catch (e) {
//       console.error('[TicketPage] Cancel failed:', e);
//     } finally {
//       setIsCancelling(false);
//     }
//   }, [firestore, directBooking, locale]);


//   const handleConfirmPayment = useCallback(async (targetBooking: any, onSuccess: () => void) => {
//     if (!firestore || !targetBooking?.id) return;
//     setIsConfirmingPayment(true);
//     try {
//       const voucherId = `PAY-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
//       await runTransaction(firestore, async (transaction) => {
//         transaction.update(doc(firestore, 'bookings', targetBooking.id), {
//           status: 'Pending-Payment-Verification',
//           depositVoucherId: voucherId,
//           paymentDeclaredAt: serverTimestamp(),
//           updatedAt: serverTimestamp(),
//         });
//       });
//       onSuccess();
//       setIsPaymentOpen(false);
//     } catch (e: any) {
//       console.error('[TicketPage] Payment failed:', e);
//     } finally {
//       setIsConfirmingPayment(false);
//     }
//   }, [firestore]);

//   // [SCR-914] Pulse Sensor
//   useEffect(() => {
//     if (!firestore || !tripId || isResolving) return;
//     const transmitViewPulse = async () => {
//       const storageKey = `safar_ticket_viewed_${tripId}`;
//       if (typeof window !== 'undefined' && sessionStorage.getItem(storageKey)) return;
//       try {
//         await updateDoc(doc(firestore, 'trips', tripId), { viewedAt: serverTimestamp() });
//         sessionStorage.setItem(storageKey, 'true');
//       } catch {
//         console.warn('[Pulse Sensor] Transmission silenced.');
//       }
//     };
//     transmitViewPulse();
//   }, [firestore, tripId, isResolving]);

//   const { trip, isLoading: isTripLoading, error: reactorError } = useLiveTripReactor(tripId);

//   const bookingQuery = useMemoFirebase(() => {
//     if (!firestore || !tripId || directBooking) return null;
//     const status = trip?.status;
//     if (status === 'Awaiting-Offers' || status === 'Pending-Carrier-Confirmation') return null;
//     return query(collection(firestore, 'bookings'), where('tripId', '==', tripId), limit(1));
//   }, [firestore, tripId, trip?.status, directBooking]);

//   const { data: bookingList, isLoading: isLoadingBooking } = useCollection<Booking>(bookingQuery);

//   // [SCR-RESCHEDULE]: موافقة أو رفض طلب تغيير الموعد — مكانها بعد تعريف bookingList
//   const handleRescheduleResponse = useCallback(async (approve: boolean) => {
//     if (!firestore || !user?.uid || !tripId) return;

//     // [FIX]: نستخدم tripId المحلول مباشرة بدل الاعتماد على targetBooking،
//     // لأن الـ URL ممكن يحتوي على bookingId مش tripId،
//     // وده كان بيخلي targetBooking فاضي وبالتالي الدالة بترجع من غير ما تعمل أي تحديث.
//     const effectiveTripId = tripId;
//     const tripRef = doc(firestore, 'trips', effectiveTripId);
//     setIsRescheduling(true);
//     try {
//       const tripSnap = await getDoc(tripRef);
//       if (!tripSnap.exists()) return;
//       const tripData = tripSnap.data() as Trip & { pendingReschedule?: any };
//       const pending = tripData.pendingReschedule;
//       if (!pending) return;

//       const batch = writeBatch(firestore);

//       if (approve) {
//         const newApprovals = [...(pending.approvals || []), user.uid];
//         const allApproved = newApprovals.length >= pending.totalRequired;

//         if (allApproved) {
//           const updatePayload: any = {
//             departureDate: Timestamp.fromDate(new Date(pending.newDepartureDate)),
//             pendingReschedule: null,
//             updatedAt: serverTimestamp(),
//           };
//           if (pending.newDepartureTime) updatePayload.departureTime = pending.newDepartureTime;
//           batch.update(tripRef, updatePayload);
//           await batch.commit();

//           if (tripData.carrierId) {
//             try {
//               await addDoc(
//                 collection(doc(firestore, 'users', tripData.carrierId), 'notifications'),
//                 {
//                   userId: tripData.carrierId,
//                   title: '✅ وافق جميع المسافرين على تغيير الموعد',
//                   message: `تم تطبيق الموعد الجديد لرحلة ${tripData.origin} ← ${tripData.destination}`,
//                   type: 'reschedule_approved',
//                   tripId: effectiveTripId,
//                   isRead: false,
//                   link: `/${locale}/carrier/trips`,
//                   createdAt: serverTimestamp(),
//                 }
//               );
//             } catch { /* non-critical */ }
//           }
//         } else {
//           batch.update(tripRef, {
//             'pendingReschedule.approvals': arrayUnion(user.uid),
//             updatedAt: serverTimestamp(),
//           });
//           await batch.commit();
//         }
//       } else {
//         batch.update(tripRef, {
//           pendingReschedule: null,
//           updatedAt: serverTimestamp(),
//         });
//         await batch.commit();

//         if (tripData.carrierId) {
//           try {
//             await addDoc(
//               collection(doc(firestore, 'users', tripData.carrierId), 'notifications'),
//               {
//                 userId: tripData.carrierId,
//                 title: '❌ رفض مسافر طلب تغيير الموعد',
//                 message: `رفض أحد المسافرين تغيير الموعد لرحلة ${tripData.origin} ← ${tripData.destination}. يحق له الإلغاء مجاناً.`,
//                 type: 'reschedule_rejected',
//                 tripId: effectiveTripId,
//                 isRead: false,
//                 link: `/${locale}/carrier/bookings`,
//                 createdAt: serverTimestamp(),
//               }
//             );
//           } catch { /* non-critical */ }
//         }
//       }
//     } catch (e) {
//       console.error('[TicketPage] Reschedule response failed:', e);
//     } finally {
//       setIsRescheduling(false);
//     }
//   }, [firestore, user?.uid, tripId, locale]);


//   const booking = useMemo(() => directBooking || bookingList?.[0] || null, [directBooking, bookingList]);

//   // [SCR-PHONE-GATE]: أرقام المسافرين للتحقق في الشات
//   const allowedPhones = useMemo(() => {
//     const details = booking?.passengersDetails || trip?.passengersDetails || [];
//     return details
//       .map((p: any) => p.phone || p.passengerPhone || '')
//       .filter(Boolean) as string[];
//   }, [booking?.passengersDetails, trip?.passengersDetails]);

//   const primaryPassengerName = useMemo(() => {
//     const details = booking?.passengersDetails || trip?.passengersDetails || [];
//     return (details[0] as any)?.name || (details[0] as any)?.passengerName || 'مسافر';
//   }, [booking?.passengersDetails, trip?.passengersDetails]);

//   const serverTime = useMemo(() => {
//     if (!trip?.createdAt) return new Date();
//     return typeof trip.createdAt.toDate === 'function' ? trip.createdAt.toDate() : new Date(trip.createdAt);
//   }, [trip?.createdAt]);

//   const isLoading = isResolving || isTripLoading || isLoadingBooking;

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-background flex flex-col items-center">
//         <Skeleton className="h-24 w-full max-w-md sticky top-0" />
//         <main className="w-full max-w-md p-4 space-y-6">
//           <Skeleton className="h-64 w-full rounded-[2.5rem]" />
//         </main>
//       </div>
//     );
//   }

//   if (reactorError || !trip) {
//     return (
//       <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center gap-4">
//         <div className="bg-destructive/10 p-6 rounded-full">
//           <ShieldAlert className="h-16 w-16 text-destructive opacity-40 animate-pulse" />
//         </div>
//         <h1 className="text-2xl font-black tracking-tighter text-white">عذراً، التذكرة غير متاحة</h1>
//         <p className="text-sm text-muted-foreground font-bold">
//           {reactorError === 'TRIP_NOT_FOUND' ? 'ربما تمَّ إلغاء الرحلة نهائياً.' : 'لقد اصطدم الرادار بعائق تقني.'}
//         </p>
//         <div className="flex flex-col gap-2 w-full max-w-xs">
//           <Button variant="default" className="rounded-2xl h-12 px-8 font-black gap-2" onClick={() => window.location.reload()}>
//             <RefreshCw className="h-4 w-4" /> إعادة محاولة الاتصال
//           </Button>
//           <Button variant="outline" className="rounded-2xl h-12 px-8 font-black" onClick={() => router.push('/')}>العودة للرئيسية</Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background flex flex-col items-center w-full pb-32 overscroll-none" dir="rtl">
//       <div className="w-full max-w-md mx-auto sticky top-0 z-50">
//         <TicketHeader tripId={tripId} carrierId={trip.carrierId} tripStatus={trip.status} />
//       </div>
//       <main className="flex-1 w-full max-w-md mx-auto p-4">
//         <LocalErrorBoundary fallbackTitle="تعثرت البوابة الذكية">

//           {/* [SCR-RESCHEDULE]: بانر طلب تغيير الموعد — يظهر فوق كل شيء لو في طلب معلق */}
//           {(trip as any).pendingReschedule && booking && user?.uid && !(trip as any).pendingReschedule?.approvals?.includes(user.uid) && !(trip as any).pendingReschedule?.rejections?.includes(user.uid) && (
//             <div className="mb-6 bg-blue-500/10 border-2 border-blue-500/30 rounded-[2.5rem] p-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
//               <div className="flex items-center gap-3">
//                 <div className="bg-blue-500/20 p-2 rounded-full">
//                   <Clock className="h-6 w-6 text-blue-400" />
//                 </div>
//                 <div>
//                   <h3 className="font-black text-blue-300 text-base">طلب تغيير موعد الرحلة</h3>
//                   <p className="text-xs text-muted-foreground font-bold">الناقل يطلب تغيير موعد الانطلاق</p>
//                 </div>
//               </div>
//               <div className="bg-muted/30 rounded-2xl p-4 space-y-2 text-right">
//                 <div className="flex justify-between text-xs font-bold">
//                   <span className="text-muted-foreground">الموعد الجديد:</span>
//                   <span className="text-white font-black">
//                     {new Date((trip as any).pendingReschedule.newDepartureDate).toLocaleDateString('ar', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
//                     {(trip as any).pendingReschedule.newDepartureTime ? ` — ${(trip as any).pendingReschedule.newDepartureTime}` : ''}
//                   </span>
//                 </div>
//                 {(trip as any).pendingReschedule.reason && (
//                   <div className="flex justify-between text-xs font-bold gap-2">
//                     <span className="text-muted-foreground shrink-0">السبب:</span>
//                     <span className="text-right text-muted-foreground">{(trip as any).pendingReschedule.reason}</span>
//                   </div>
//                 )}
//                 <div className="flex justify-between text-xs font-bold">
//                   <span className="text-muted-foreground">الموافقات:</span>
//                   <span className="text-emerald-400">{(trip as any).pendingReschedule.approvals?.length || 0} / {(trip as any).pendingReschedule.totalRequired}</span>
//                 </div>
//               </div>
//               <p className="text-xs text-muted-foreground font-bold text-center">
//                 في حال الرفض يحق لك إلغاء حجزك مجاناً
//               </p>
//               <div className="grid grid-cols-2 gap-3">
//                 <Button
//                   variant="outline"
//                   className="h-12 font-black rounded-2xl border-destructive/50 text-destructive hover:bg-destructive/10"
//                   disabled={isRescheduling}
//                   onClick={() => handleRescheduleResponse(false)}
//                 >
//                   {isRescheduling ? <Loader2 className="h-4 w-4 animate-spin" /> : <><XCircle className="h-4 w-4 ml-1" />رفض</>}
//                 </Button>
//                 <Button
//                   className="h-12 font-black rounded-2xl bg-emerald-600 hover:bg-emerald-700"
//                   disabled={isRescheduling}
//                   onClick={() => handleRescheduleResponse(true)}
//                 >
//                   {isRescheduling ? <Loader2 className="h-4 w-4 animate-spin" /> : <><CheckCircle2 className="h-4 w-4 ml-1" />موافقة</>}
//                 </Button>
//               </div>
//             </div>
//           )}

//           {booking && booking.status === 'Pending-Carrier-Confirmation' ? (
//             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
//               <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-[2.5rem] p-8 text-center space-y-4">
//                 <div className="text-4xl">⏳</div>
//                 <h2 className="text-xl font-black tracking-tight">في انتظار موافقة الناقل</h2>
//                 <p className="text-sm text-muted-foreground font-bold">
//                   طلب الحجز وصل للناقل. سيتم إشعارك فور الموافقة.
//                 </p>
//                 <div className="bg-muted/30 p-4 rounded-2xl text-right space-y-2">
//                   <div className="flex justify-between text-xs font-bold">
//                     <span className="text-muted-foreground">المقاعد:</span>
//                     <span>{booking.seats}</span>
//                   </div>
//                   <div className="flex justify-between text-xs font-bold">
//                     <span className="text-muted-foreground">الإجمالي:</span>
//                     <span>{booking.totalPrice} {booking.currency}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ) : booking && booking.status === 'Pending-Payment' ? (
//             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
//               <div className="bg-emerald-500/10 border-2 border-emerald-500/30 rounded-[2.5rem] p-8 text-center space-y-4">
//                 <div className="text-5xl">✅</div>
//                 <h2 className="text-xl font-black tracking-tight text-emerald-500">وافق الناقل على حجزك!</h2>
//                 <p className="text-sm text-muted-foreground font-bold">
//                   أكمل الحجز بدفع العربون الآن لتأكيد مقعدك.
//                 </p>
//                 <div className="bg-muted/30 p-4 rounded-2xl text-right space-y-2">
//                   <div className="flex justify-between text-xs font-bold">
//                     <span className="text-muted-foreground">المسار:</span>
//                     <span>{trip.origin} ← {trip.destination}</span>
//                   </div>
//                   <div className="flex justify-between text-xs font-bold">
//                     <span className="text-muted-foreground">المقاعد:</span>
//                     <span>{booking.seats}</span>
//                   </div>
//                   <div className="flex justify-between text-xs font-bold">
//                     <span className="text-muted-foreground">الإجمالي:</span>
//                     <span className="font-black text-white">{booking.totalPrice} {booking.currency}</span>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => setIsPaymentOpen(true)}
//                   className="w-full h-16 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xl rounded-3xl shadow-[0_20px_50px_rgba(22,163,74,0.4)] transition-all active:scale-95 flex items-center justify-center gap-3"
//                 >
//                   💳 ادفع العربون الآن
//                 </button>
//               </div>

//               <BookingPaymentDialog
//                 isOpen={isPaymentOpen}
//                 onOpenChange={setIsPaymentOpen}
//                 trip={trip}
//                 booking={booking}
//                 onConfirm={(receiptUrl) => handleConfirmPayment(booking, () => { })}
//                 isProcessing={isConfirmingPayment}
//               />
//             </div>
//           ) : booking && booking.status === 'Pending-Payment-Verification' ? (
//             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
//               <div className="bg-blue-500/10 border-2 border-blue-500/30 rounded-[2.5rem] p-8 text-center space-y-4">
//                 <div className="text-5xl">🔵</div>
//                 <h2 className="text-xl font-black tracking-tight text-blue-400">تم استلام إشعار دفعك!</h2>
//                 <p className="text-sm text-muted-foreground font-bold">
//                   الناقل سيراجع السند ويختم الاستلام. ستظهر تذكرتك فور التأكيد.
//                 </p>
//                 {booking.depositVoucherId && (
//                   <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
//                     <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">رقم سند الدفع</p>
//                     <p className="font-mono font-black text-blue-300 text-lg tracking-widest">{booking.depositVoucherId}</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ) : booking ? (
//             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
//               <HeroTicket
//                 trip={trip}
//                 booking={booking}
//                 onRateTrip={() => { }}
//                 onCancelBooking={() => setIsCancelOpen(true)}
//                 onMessageCarrier={() => { }}
//                 onMessageGroup={() => { }}
//               />
//             </div>
//           ) : (
//             <ProxyWaitingState trip={trip} serverTime={serverTime} />
//           )}
//         </LocalErrorBoundary>
//       </main>

//       {/* [SCR-CANCEL]: نافذة تأكيد الإلغاء */}
//       <CancellationDialog
//         isOpen={isCancelOpen}
//         onOpenChange={setIsCancelOpen}
//         isCancelling={isCancelling}
//         onConfirm={handleCancelBooking}
//         trip={trip}
//         booking={booking}
//       />

//       {/* [SCR-PHONE-GATE]: الشات مع gate التحقق بالرقم */}
//       <FloatingChatBubble
//         tripId={tripId}
//         allowedPhones={allowedPhones}
//         passengerName={primaryPassengerName}
//       />
//     </div>
//   );
// }

'use client';

import { useParams, useRouter } from 'next/navigation';
import { useFirestore, useMemoFirebase, useCollection, useUser } from '@/firebase';
import { collection, query, where, limit, updateDoc, serverTimestamp, doc, getDoc, runTransaction, increment, addDoc, writeBatch, arrayUnion, Timestamp } from 'firebase/firestore';
import { BookingPaymentDialog } from '@/components/booking/booking-payment-dialog';
import { TicketHeader } from '@/components/traveler/ticket-header';
import { HeroTicket } from '@/components/history/hero-ticket';
import { ProxyWaitingState } from '@/components/traveler/proxy-waiting-state';
import { CancellationDialog } from '@/components/booking/cancellation-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import type { Trip, Booking } from '@/lib/data';
import { LocalErrorBoundary } from '@/components/ui/local-error-boundary';
import { ShieldAlert, RefreshCw, Clock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMemo, useEffect, useState, useCallback } from 'react';
import { FloatingChatBubble } from '@/components/traveler/floating-chat-bubble';
import { useLiveTripReactor } from '@/hooks/use-live-trip-reactor';
import { useLocale } from 'next-intl';

/**
 * @page SmartTicketPage
 * @description THE REINFORCED NEURAL HUB (STERILIZED - V19.0 - SCR-PROXY-CHAT-CANCEL)
 * [V19.0]:
 *   - [SCR-CANCEL]: CancellationDialog مربوطة بدالة حقيقية:
 *       1. تغيير status الـ booking إلى Cancelled
 *       2. إرجاع الكراسي للرحلة عبر increment(+seats)
 *       3. إشعار للناقل
 *   - [SCR-PHONE-GATE]: استخراج allowedPhones من passengersDetails وتمريرها للـ FloatingChatBubble
 * Protocol 16: Sterilized. Protocol 88: Zero Network Chatter.
 */
export default function SmartTicketPage() {
  const params = useParams();
  const idParam = params.id as string;
  const firestore = useFirestore();
  const router = useRouter();
  const locale = useLocale();
  const { user } = useUser();

  const [resolvedTripId, setResolvedTripId] = useState<string | null>(null);
  const [directBooking, setDirectBooking] = useState<Booking | null>(null);
  const [isResolving, setIsResolving] = useState(true);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);

  // [SCR-CANCEL]: حالة نافذة الإلغاء
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // [SCR-RESCHEDULE]: حالة الموافقة/الرفض على طلب تغيير الموعد
  const [isRescheduling, setIsRescheduling] = useState(false);

  useEffect(() => {
    if (!firestore || !idParam) return;
    const resolve = async () => {
      setIsResolving(true);
      try {
        const bookingSnap = await getDoc(doc(firestore, 'bookings', idParam));
        if (bookingSnap.exists()) {
          const b = { id: bookingSnap.id, ...bookingSnap.data() } as Booking;
          setDirectBooking(b);
          // ✅ [FIX] استخدم carrierTripId أولاً لو موجود — ده رحلة الناقل الحقيقية
          // tripId ممكن يكون رحلة المسافر القديمة قبل ما الناقل يقبل
          const effectiveTripId = (b as any).carrierTripId || b.tripId;
          setResolvedTripId(effectiveTripId);
        } else {
          setResolvedTripId(idParam);
        }
      } catch {
        setResolvedTripId(idParam);
      } finally {
        setIsResolving(false);
      }
    };
    resolve();
  }, [firestore, idParam]);

  const tripId = resolvedTripId || idParam;

  // [SCR-CANCEL]: دالة الإلغاء الحقيقية — 3 عمليات atomic
  const handleCancelBooking = useCallback(async (reason: string) => {
    const targetBooking = directBooking || bookingList?.[0];
    if (!firestore || !targetBooking?.id) return;

    setIsCancelling(true);
    try {
      await runTransaction(firestore, async (tx) => {
        // 1. تغيير status الحجز
        tx.update(doc(firestore, 'bookings', targetBooking.id), {
          status: 'Cancelled',
          cancelReason: reason,
          cancelledBy: 'traveler',
          cancelledAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        // 2. إرجاع الكراسي للرحلة — بس لو كان الحجز confirmed (مش pending)
        // لو كان Pending-Carrier-Confirmation الناقل لسه ما خصمش الكراسي
        const seatsToRestore = targetBooking.seats || 0;
        const statusesRequiringRestore: Booking['status'][] = [
          'Pending-Payment',
          'Pending-Payment-Verification',
          'Confirmed',
        ];
        if (seatsToRestore > 0 && statusesRequiringRestore.includes(targetBooking.status)) {
          // [FIX]: رجّع الكراسي للـ carrierTripId (رحلة الناقل الفعلية) لو موجود
          // وإلا رجّعها للـ tripId (رحلة المسافر)
          const carrierTripId = (targetBooking as any).carrierTripId;
          if (carrierTripId) {
            tx.update(doc(firestore, 'trips', carrierTripId), {
              availableSeats: increment(seatsToRestore),
              updatedAt: serverTimestamp(),
            });
          }
          // دايماً رجّع للـ tripId كمان (رحلة المسافر/الطلب)
          if (targetBooking.tripId) {
            tx.update(doc(firestore, 'trips', targetBooking.tripId), {
              availableSeats: increment(seatsToRestore),
              updatedAt: serverTimestamp(),
            });
          }
        }
      });

      // 3. إشعار للناقل (خارج الـ transaction — مش critical)
      if (targetBooking.carrierId) {
        try {
          await addDoc(
            collection(doc(firestore, 'users', targetBooking.carrierId), 'notifications'),
            {
              userId: targetBooking.carrierId,
              title: 'ألغى المسافر حجزه ❌',
              message: `تم إلغاء حجز ${targetBooking.seats} مقعد — السبب: ${reason}`,
              type: 'traveler_cancelled_booking',
              bookingId: targetBooking.id,
              tripId: targetBooking.tripId,
              isRead: false,
              link: `/${locale}/carrier/bookings`,
              createdAt: serverTimestamp(),
            }
          );
        } catch (notifError) {
          // الإشعار مش critical — نسجله بس ومنوقفش العملية
          console.warn('[TicketPage] Notification failed (non-critical):', notifError);
        }
      }

      setIsCancelOpen(false);
      // تحديث الـ directBooking محلياً فوراً
      if (directBooking) {
        setDirectBooking(prev => prev ? { ...prev, status: 'Cancelled', cancelReason: reason } : prev);
      }
    } catch (e) {
      console.error('[TicketPage] Cancel failed:', e);
    } finally {
      setIsCancelling(false);
    }
  }, [firestore, directBooking, locale]);


  const handleConfirmPayment = useCallback(async (targetBooking: any, onSuccess: () => void) => {
    if (!firestore || !targetBooking?.id) return;
    setIsConfirmingPayment(true);
    try {
      const voucherId = `PAY-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      await runTransaction(firestore, async (transaction) => {
        transaction.update(doc(firestore, 'bookings', targetBooking.id), {
          status: 'Pending-Payment-Verification',
          depositVoucherId: voucherId,
          paymentDeclaredAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      });
      onSuccess();
      setIsPaymentOpen(false);
    } catch (e: any) {
      console.error('[TicketPage] Payment failed:', e);
    } finally {
      setIsConfirmingPayment(false);
    }
  }, [firestore]);

  // [SCR-914] Pulse Sensor
  useEffect(() => {
    if (!firestore || !tripId || isResolving) return;
    const transmitViewPulse = async () => {
      const storageKey = `safar_ticket_viewed_${tripId}`;
      if (typeof window !== 'undefined' && sessionStorage.getItem(storageKey)) return;
      try {
        await updateDoc(doc(firestore, 'trips', tripId), { viewedAt: serverTimestamp() });
        sessionStorage.setItem(storageKey, 'true');
      } catch {
        console.warn('[Pulse Sensor] Transmission silenced.');
      }
    };
    transmitViewPulse();
  }, [firestore, tripId, isResolving]);

  const { trip, isLoading: isTripLoading, error: reactorError } = useLiveTripReactor(tripId);

  const bookingQuery = useMemoFirebase(() => {
    if (!firestore || !tripId || directBooking) return null;
    const status = trip?.status;
    if (status === 'Awaiting-Offers' || status === 'Pending-Carrier-Confirmation') return null;
    return query(collection(firestore, 'bookings'), where('tripId', '==', tripId), limit(1));
  }, [firestore, tripId, trip?.status, directBooking]);

  const { data: bookingList, isLoading: isLoadingBooking } = useCollection<Booking>(bookingQuery);

  // [SCR-RESCHEDULE]: موافقة أو رفض طلب تغيير الموعد — مكانها بعد تعريف bookingList
  const handleRescheduleResponse = useCallback(async (approve: boolean) => {
    if (!firestore || !user?.uid || !tripId) return;

    // [FIX]: نستخدم tripId المحلول مباشرة بدل الاعتماد على targetBooking،
    // لأن الـ URL ممكن يحتوي على bookingId مش tripId،
    // وده كان بيخلي targetBooking فاضي وبالتالي الدالة بترجع من غير ما تعمل أي تحديث.
    const effectiveTripId = tripId;
    const tripRef = doc(firestore, 'trips', effectiveTripId);
    setIsRescheduling(true);
    try {
      const tripSnap = await getDoc(tripRef);
      if (!tripSnap.exists()) return;
      const tripData = tripSnap.data() as Trip & { pendingReschedule?: any };
      const pending = tripData.pendingReschedule;
      if (!pending) return;

      const batch = writeBatch(firestore);

      if (approve) {
        const newApprovals = [...(pending.approvals || []), user.uid];
        const allApproved = newApprovals.length >= pending.totalRequired;

        if (allApproved) {
          const updatePayload: any = {
            // [FIX]: نخزن كـ ISO string لأن الـ Firestore document أصلاً بيخزن departureDate كـ string
            // (نفس الـ format اللي بيستخدمه الناقل لما بيعدل الرحلة مباشرة)
            departureDate: new Date(pending.newDepartureDate).toISOString(),
            pendingReschedule: null,
            updatedAt: serverTimestamp(),
          };
          if (pending.newDepartureTime) updatePayload.departureTime = pending.newDepartureTime;
          batch.update(tripRef, updatePayload);
          await batch.commit();

          if (tripData.carrierId) {
            try {
              await addDoc(
                collection(doc(firestore, 'users', tripData.carrierId), 'notifications'),
                {
                  userId: tripData.carrierId,
                  title: '✅ وافق جميع المسافرين على تغيير الموعد',
                  message: `تم تطبيق الموعد الجديد لرحلة ${tripData.origin} ← ${tripData.destination}`,
                  type: 'reschedule_approved',
                  tripId: effectiveTripId,
                  isRead: false,
                  link: `/${locale}/carrier/trips`,
                  createdAt: serverTimestamp(),
                }
              );
            } catch { /* non-critical */ }
          }
        } else {
          batch.update(tripRef, {
            'pendingReschedule.approvals': arrayUnion(user.uid),
            updatedAt: serverTimestamp(),
          });
          await batch.commit();
        }
      } else {
        batch.update(tripRef, {
          pendingReschedule: null,
          updatedAt: serverTimestamp(),
        });
        await batch.commit();

        if (tripData.carrierId) {
          try {
            await addDoc(
              collection(doc(firestore, 'users', tripData.carrierId), 'notifications'),
              {
                userId: tripData.carrierId,
                title: '❌ رفض مسافر طلب تغيير الموعد',
                message: `رفض أحد المسافرين تغيير الموعد لرحلة ${tripData.origin} ← ${tripData.destination}. يحق له الإلغاء مجاناً.`,
                type: 'reschedule_rejected',
                tripId: effectiveTripId,
                isRead: false,
                link: `/${locale}/carrier/bookings`,
                createdAt: serverTimestamp(),
              }
            );
          } catch { /* non-critical */ }
        }
      }
    } catch (e) {
      console.error('[TicketPage] Reschedule response failed:', e);
    } finally {
      setIsRescheduling(false);
    }
  }, [firestore, user?.uid, tripId, locale]);


  const booking = useMemo(() => directBooking || bookingList?.[0] || null, [directBooking, bookingList]);

  // [SCR-PHONE-GATE]: أرقام المسافرين للتحقق في الشات
  const allowedPhones = useMemo(() => {
    const details = booking?.passengersDetails || trip?.passengersDetails || [];
    return details
      .map((p: any) => p.phone || p.passengerPhone || '')
      .filter(Boolean) as string[];
  }, [booking?.passengersDetails, trip?.passengersDetails]);

  const primaryPassengerName = useMemo(() => {
    const details = booking?.passengersDetails || trip?.passengersDetails || [];
    return (details[0] as any)?.name || (details[0] as any)?.passengerName || 'مسافر';
  }, [booking?.passengersDetails, trip?.passengersDetails]);

  const serverTime = useMemo(() => {
    if (!trip?.createdAt) return new Date();
    return typeof trip.createdAt.toDate === 'function' ? trip.createdAt.toDate() : new Date(trip.createdAt);
  }, [trip?.createdAt]);

  const isLoading = isResolving || isTripLoading || isLoadingBooking;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center">
        <Skeleton className="h-24 w-full max-w-md sticky top-0" />
        <main className="w-full max-w-md p-4 space-y-6">
          <Skeleton className="h-64 w-full rounded-[2.5rem]" />
        </main>
      </div>
    );
  }

  if (reactorError || !trip) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center gap-4">
        <div className="bg-destructive/10 p-6 rounded-full">
          <ShieldAlert className="h-16 w-16 text-destructive opacity-40 animate-pulse" />
        </div>
        <h1 className="text-2xl font-black tracking-tighter text-white">عذراً، التذكرة غير متاحة</h1>
        <p className="text-sm text-muted-foreground font-bold">
          {reactorError === 'TRIP_NOT_FOUND' ? 'ربما تمَّ إلغاء الرحلة نهائياً.' : 'لقد اصطدم الرادار بعائق تقني.'}
        </p>
        <div className="flex flex-col gap-2 w-full max-w-xs">
          <Button variant="default" className="rounded-2xl h-12 px-8 font-black gap-2" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4" /> إعادة محاولة الاتصال
          </Button>
          <Button variant="outline" className="rounded-2xl h-12 px-8 font-black" onClick={() => router.push('/')}>العودة للرئيسية</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center w-full pb-32 overscroll-none" dir="rtl">
      <div className="w-full max-w-md mx-auto sticky top-0 z-50">
        <TicketHeader tripId={tripId} carrierId={trip.carrierId} tripStatus={trip.status} />
      </div>
      <main className="flex-1 w-full max-w-md mx-auto p-4">
        <LocalErrorBoundary fallbackTitle="تعثرت البوابة الذكية">

          {/* [SCR-RESCHEDULE]: بانر طلب تغيير الموعد — يظهر فوق كل شيء لو في طلب معلق */}
          {(trip as any).pendingReschedule && booking && user?.uid && !(trip as any).pendingReschedule?.approvals?.includes(user.uid) && !(trip as any).pendingReschedule?.rejections?.includes(user.uid) && (
            <div className="mb-6 bg-blue-500/10 border-2 border-blue-500/30 rounded-[2.5rem] p-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500/20 p-2 rounded-full">
                  <Clock className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-black text-blue-300 text-base">طلب تغيير موعد الرحلة</h3>
                  <p className="text-xs text-muted-foreground font-bold">الناقل يطلب تغيير موعد الانطلاق</p>
                </div>
              </div>
              <div className="bg-muted/30 rounded-2xl p-4 space-y-2 text-right">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-muted-foreground">الموعد الجديد:</span>
                  <span className="text-white font-black">
                    {new Date((trip as any).pendingReschedule.newDepartureDate).toLocaleDateString('ar', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    {(trip as any).pendingReschedule.newDepartureTime ? ` — ${(trip as any).pendingReschedule.newDepartureTime}` : ''}
                  </span>
                </div>
                {(trip as any).pendingReschedule.reason && (
                  <div className="flex justify-between text-xs font-bold gap-2">
                    <span className="text-muted-foreground shrink-0">السبب:</span>
                    <span className="text-right text-muted-foreground">{(trip as any).pendingReschedule.reason}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-muted-foreground">الموافقات:</span>
                  <span className="text-emerald-400">{(trip as any).pendingReschedule.approvals?.length || 0} / {(trip as any).pendingReschedule.totalRequired}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground font-bold text-center">
                في حال الرفض يحق لك إلغاء حجزك مجاناً
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="h-12 font-black rounded-2xl border-destructive/50 text-destructive hover:bg-destructive/10"
                  disabled={isRescheduling}
                  onClick={() => handleRescheduleResponse(false)}
                >
                  {isRescheduling ? <Loader2 className="h-4 w-4 animate-spin" /> : <><XCircle className="h-4 w-4 ml-1" />رفض</>}
                </Button>
                <Button
                  className="h-12 font-black rounded-2xl bg-emerald-600 hover:bg-emerald-700"
                  disabled={isRescheduling}
                  onClick={() => handleRescheduleResponse(true)}
                >
                  {isRescheduling ? <Loader2 className="h-4 w-4 animate-spin" /> : <><CheckCircle2 className="h-4 w-4 ml-1" />موافقة</>}
                </Button>
              </div>
            </div>
          )}

          {booking && booking.status === 'Pending-Carrier-Confirmation' ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-[2.5rem] p-8 text-center space-y-4">
                <div className="text-4xl">⏳</div>
                <h2 className="text-xl font-black tracking-tight">في انتظار موافقة الناقل</h2>
                <p className="text-sm text-muted-foreground font-bold">
                  طلب الحجز وصل للناقل. سيتم إشعارك فور الموافقة.
                </p>
                <div className="bg-muted/30 p-4 rounded-2xl text-right space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-muted-foreground">المقاعد:</span>
                    <span>{booking.seats}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-muted-foreground">الإجمالي:</span>
                    <span>{booking.totalPrice} {booking.currency}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : booking && booking.status === 'Pending-Payment' ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="bg-emerald-500/10 border-2 border-emerald-500/30 rounded-[2.5rem] p-8 text-center space-y-4">
                <div className="text-5xl">✅</div>
                <h2 className="text-xl font-black tracking-tight text-emerald-500">وافق الناقل على حجزك!</h2>
                <p className="text-sm text-muted-foreground font-bold">
                  أكمل الحجز بدفع العربون الآن لتأكيد مقعدك.
                </p>
                <div className="bg-muted/30 p-4 rounded-2xl text-right space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-muted-foreground">المسار:</span>
                    <span>{trip.origin} ← {trip.destination}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-muted-foreground">المقاعد:</span>
                    <span>{booking.seats}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-muted-foreground">الإجمالي:</span>
                    <span className="font-black text-white">{booking.totalPrice} {booking.currency}</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsPaymentOpen(true)}
                  className="w-full h-16 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xl rounded-3xl shadow-[0_20px_50px_rgba(22,163,74,0.4)] transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  💳 ادفع العربون الآن
                </button>
              </div>

              <BookingPaymentDialog
                isOpen={isPaymentOpen}
                onOpenChange={setIsPaymentOpen}
                trip={trip}
                booking={booking}
                onConfirm={(receiptUrl) => handleConfirmPayment(booking, () => { })}
                isProcessing={isConfirmingPayment}
              />
            </div>
          ) : booking && booking.status === 'Pending-Payment-Verification' ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="bg-blue-500/10 border-2 border-blue-500/30 rounded-[2.5rem] p-8 text-center space-y-4">
                <div className="text-5xl">🔵</div>
                <h2 className="text-xl font-black tracking-tight text-blue-400">تم استلام إشعار دفعك!</h2>
                <p className="text-sm text-muted-foreground font-bold">
                  الناقل سيراجع السند ويختم الاستلام. ستظهر تذكرتك فور التأكيد.
                </p>
                {booking.depositVoucherId && (
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">رقم سند الدفع</p>
                    <p className="font-mono font-black text-blue-300 text-lg tracking-widest">{booking.depositVoucherId}</p>
                  </div>
                )}
              </div>
            </div>
          ) : booking ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <HeroTicket
                trip={trip}
                booking={booking}
                onRateTrip={() => { }}
                onCancelBooking={() => setIsCancelOpen(true)}
                onMessageCarrier={() => { }}
                onMessageGroup={() => { }}
              />
            </div>
          ) : (
            <ProxyWaitingState trip={trip} serverTime={serverTime} />
          )}
        </LocalErrorBoundary>
      </main>

      {/* [SCR-CANCEL]: نافذة تأكيد الإلغاء */}
      <CancellationDialog
        isOpen={isCancelOpen}
        onOpenChange={setIsCancelOpen}
        isCancelling={isCancelling}
        onConfirm={handleCancelBooking}
        trip={trip}
        booking={booking}
      />

      {/* [SCR-PHONE-GATE]: الشات مع gate التحقق بالرقم */}
      <FloatingChatBubble
        tripId={tripId}
        allowedPhones={allowedPhones}
        passengerName={primaryPassengerName}
      />
    </div>
  );
}


