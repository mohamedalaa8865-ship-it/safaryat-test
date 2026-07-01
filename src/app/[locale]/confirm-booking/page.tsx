// // // // 'use client';

// // // // import { useEffect, useState, Suspense } from 'react';
// // // // import { useSearchParams, useRouter } from 'next/navigation';
// // // // import { useFirestore, useUser } from '@/firebase';
// // // // import { doc, getDoc, collection, serverTimestamp, writeBatch, arrayUnion, increment, setDoc, deleteField } from 'firebase/firestore';
// // // // import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
// // // // import { Button } from '@/components/ui/button';
// // // // import { BookingDialog } from '@/components/booking-dialog';
// // // // import type { Trip, PassengerDetails } from '@/lib/data';
// // // // import { useLocale, useTranslations } from 'next-intl';
// // // // import { sendPush } from "@/lib/send-push";

// // // // /**
// // // //  * @file src/app/[locale]/confirm-booking/page.tsx
// // // //  * @description THE STERILIZED BOOKING CONFIRMATION (REINFORCED - SC-806 V6.1)
// // // //  * [FIX]: تم الفصل الذكي بين حجز "الرحلات المجدولة" و "الطلبات الخاصة" لمنع اختفاء الرحلات
// // // //  */

// // // // type Status = 'loading' | 'ready' | 'confirming' | 'success' | 'error' | 'expired';

// // // // export default function ConfirmBookingPage() {
// // // //   return (
// // // //     <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
// // // //       <ConfirmBookingContent />
// // // //     </Suspense>
// // // //   );
// // // // }

// // // // function ConfirmBookingContent() {
// // // //   const searchParams = useSearchParams();
// // // //   const router = useRouter();
// // // //   const firestore = useFirestore();
// // // //   const { user } = useUser();
// // // //   const locale = useLocale();
// // // //   const tError = useTranslations('errorDictionary');
// // // //   const t = useTranslations('ConfirmBooking');
// // // //   const token = searchParams.get('token');

// // // //   const [status, setStatus] = useState<Status>('loading');
// // // //   const [tokenData, setTokenData] = useState<any>(null);
// // // //   const [trip, setTrip] = useState<Trip | null>(null);
// // // //   const [isDialogOpen, setIsDialogOpen] = useState(false);
// // // //   const [errorCode, setErrorCode] = useState('DEFAULT');

// // // //   useEffect(() => {
// // // //     if (!token || !firestore) return;

// // // //     const verifyToken = async () => {
// // // //       try {
// // // //         const tokenRef = doc(firestore, 'booking_tokens', token);
// // // //         const tokenSnap = await getDoc(tokenRef);

// // // //         if (!tokenSnap.exists()) {
// // // //           setStatus('error');
// // // //           setErrorCode('TOKEN_INVALID');
// // // //           return;
// // // //         }

// // // //         const data = tokenSnap.data();

// // // //         if (data.status === 'used') {
// // // //           setStatus('error');
// // // //           setErrorCode('TOKEN_USED');
// // // //           return;
// // // //         }

// // // //         const expiresAt = data.expiresAt?.toDate?.() || new Date(data.expiresAt);
// // // //         if (new Date() > expiresAt) {
// // // //           setStatus('error');
// // // //           setErrorCode('TOKEN_EXPIRED');
// // // //           return;
// // // //         }

// // // //         const tripRef = doc(firestore, 'trips', data.tripId);
// // // //         const tripSnap = await getDoc(tripRef);

// // // //         if (!tripSnap.exists()) {
// // // //           setStatus('error');
// // // //           setErrorCode('TRIP_NOT_FOUND');
// // // //           return;
// // // //         }

// // // //         setTokenData(data);
// // // //         setTrip({ id: tripSnap.id, ...tripSnap.data() } as Trip);
// // // //         setStatus('ready');
// // // //         setIsDialogOpen(true);
// // // //       } catch (err) {
// // // //         console.error('[VerifyToken Error]', err);
// // // //         setStatus('error');
// // // //         setErrorCode('VERIFICATION_FAILED');
// // // //       }
// // // //     };

// // // //     verifyToken();
// // // //   }, [token, firestore]);

// // // //   const handleConfirmBooking = async (passengers: PassengerDetails[]) => {
// // // //     if (!firestore || !tokenData || !trip || !token) throw new Error('MISSING_DATA');
// // // //     if (!user?.uid) throw new Error('AUTH_REQUIRED');

// // // //     setStatus('confirming');

// // // //     try {
// // // //       const batch = writeBatch(firestore);
// // // //       const tokenRef = doc(firestore, 'booking_tokens', token);

// // // //       if (tokenData.bookingId) {
// // // //         // ══════════════════════════════════════════════════════════════════
// // // //         // المسار الجاي من وكيل
// // // //         // ══════════════════════════════════════════════════════════════════
// // // //         const existingBookingRef = doc(firestore, 'bookings', tokenData.bookingId);

// // // //         batch.update(existingBookingRef, {
// // // //           userId: user.uid,
// // // //           passengersDetails: passengers,
// // // //           seats: passengers.length,
// // // //           depositPaid: true,
// // // //           depositPercentage: trip.depositPercentage ?? 0,
// // // //           verifiedEmail: tokenData.email || null,
// // // //           status: 'Pending-Carrier-Confirmation',
// // // //           updatedAt: serverTimestamp(),
// // // //         });

// // // //         batch.update(tokenRef, { status: 'used', usedAt: serverTimestamp() });

// // // //         if (tokenData.carrierTripId) {
// // // //           const carrierTripRef = doc(firestore, 'trips', tokenData.carrierTripId);
// // // //           batch.update(carrierTripRef, {
// // // //             bookingIds: arrayUnion(tokenData.bookingId),
// // // //             updatedAt: serverTimestamp(),
// // // //           });
// // // //         }

// // // //         const userRef = doc(firestore, 'users', user.uid);
// // // //         batch.set(userRef, {
// // // //           activeBookingId: tokenData.bookingId,
// // // //           // activeIntentId: null,
// // // //           activeIntentId: deleteField(),

// // // //           updatedAt: serverTimestamp(),
// // // //         }, { merge: true });

// // // //         if (trip.carrierId) {
// // // //           const notifRef = doc(collection(doc(firestore, 'users', trip.carrierId), 'notifications'));
// // // //           batch.set(notifRef, {
// // // //             userId: trip.carrierId,
// // // //             title: 'مسافر أكمّل بيانات الحجز ✅',
// // // //             message: `المسافر "${passengers[0]?.name || ''}" أكمل بياناته ودفع العربون — ${passengers.length} مقعد`,
// // // //             type: 'passenger_deposit_paid',
// // // //             bookingId: tokenData.bookingId,
// // // //             isRead: false,
// // // //             link: `/${locale}/carrier/bookings`,
// // // //             createdAt: serverTimestamp(),
// // // //           });
// // // //         }

// // // //         await batch.commit();

// // // //         if (trip.carrierId) {
// // // //           await sendPush({
// // // //             userId: trip.carrierId,
// // // //             title: 'مسافر أكمّل بيانات الحجز ✅',
// // // //             body: `${passengers[0]?.name || 'مسافر'} دفع العربون — ${passengers.length} مقعد`,
// // // //             data: { type: 'passenger_deposit_paid', bookingId: tokenData.bookingId },
// // // //           });
// // // //         }

// // // //         try {
// // // //           const groupChatRef = doc(firestore, 'chats', trip.id);
// // // //           await setDoc(groupChatRef, { participants: arrayUnion(user.uid) }, { merge: true });
// // // //         } catch (e) {
// // // //           console.warn('[GroupChat] Could not join:', e);
// // // //         }

// // // //       } else {
// // // //         // ══════════════════════════════════════════════════════════════════
// // // //         // المسار العادي: مسافر مباشر بدون وكيل → booking جديد
// // // //         // ══════════════════════════════════════════════════════════════════
// // // //         const bookingRef = doc(collection(firestore, 'bookings'));

// // // //         // [FIX]: نستخدم tokenData.carrierId لأن trip.carrierId اتمسح من handleAcceptOffer
// // // //         // أو ممكن يكون في pendingCarrierId (من العرض)
// // // //         const effectiveCarrierId = tokenData.carrierId || (trip as any).pendingCarrierId || trip.carrierId || null;
// // // //         const notificationRef = effectiveCarrierId
// // // //           ? doc(collection(doc(firestore, 'users', effectiveCarrierId), 'notifications'))
// // // //           : null;

// // // //         // ✅ التفرقة بين رحلة مجدولة وطلب خاص
// // // //         // رحلة مجدولة = حالتها Planned أو Ongoing أو الناقل هو من أنشأها
// // // //         const isScheduledTrip = trip.status === 'Planned' || trip.status === 'Ongoing' || (trip.userId === (trip.carrierId || effectiveCarrierId));

// // // //         // دايمًا Pending-Carrier-Confirmation — الناقل يقرر: يوافق فوراً لو عنده رحلة، وإلا ينشئ رحلة جديدة
// // // //         const newBookingStatus = 'Pending-Carrier-Confirmation';

// // // //         batch.set(bookingRef, {
// // // //           id: bookingRef.id,
// // // //           tripId: trip.id,
// // // //           carrierTripId: isScheduledTrip ? trip.id : (tokenData.carrierTripId || null),
// // // //           userId: user.uid,
// // // //           carrierId: trip.carrierId || tokenData.carrierId,
// // // //           seats: passengers.length,
// // // //           passengersDetails: passengers,
// // // //           status: newBookingStatus,
// // // //           totalPrice: (tokenData.price || trip.price || 0) * passengers.length,
// // // //           currency: tokenData.currency || trip.currency || 'JOD',
// // // //           depositPercentage: trip.depositPercentage ?? 0,
// // // //           verifiedEmail: tokenData.email || null,
// // // //           bookedByAgent: false,
// // // //           requestOrigin: trip.origin,
// // // //           requestDestination: trip.destination,
// // // //           requestDepartureDate: trip.departureDate,
// // // //           requestPassengers: passengers.length,
// // // //           createdAt: serverTimestamp(),
// // // //           updatedAt: serverTimestamp(),
// // // //         });

// // // //         batch.update(tokenRef, { status: 'used', usedAt: serverTimestamp() });

// // // //         // ✅ [FIX]: التحديث حسب نوع الرحلة
// // // //         if (isScheduledTrip) {
// // // //           // 1️⃣ إذا كانت رحلة مجدولة، لا نغير حالتها أبداً (تظل Planned)
// // // //           // نضيف فقط معرف الحجز إليها لكي تظهر للناقل
// // // //           const tripUpdateRef = doc(firestore, 'trips', trip.id);
// // // //           batch.update(tripUpdateRef, {
// // // //             bookingIds: arrayUnion(bookingRef.id),
// // // //             updatedAt: serverTimestamp(),
// // // //           });
// // // //         } else {
// // // //           // 2️⃣ إذا كان طلب مسافر (طلب خاص)، نحدّث حالته لـ Pending-Carrier-Confirmation
// // // //           // [FIX]: نمسح carrierId و pendingCarrierId من رحلة المسافر — مش رحلة الناقل
// // // //           // carrierId هيرجع يتحط لما الناقل ينشئ رحلته فعلاً (في handleTripCreated)
// // // //           const tripUpdateRef = doc(firestore, 'trips', trip.id);
// // // //           batch.update(tripUpdateRef, {
// // // //             status: 'Pending-Carrier-Confirmation',
// // // //             pendingBookingId: bookingRef.id,
// // // //             carrierId: deleteField(),
// // // //             pendingCarrierId: deleteField(),
// // // //             updatedAt: serverTimestamp(),
// // // //           });

// // // //           // لو الناقل كان رابط عرضه برحلة مجدولة عنده مسبقاً، نضيف الحجز ليها
// // // //           if (tokenData.carrierTripId) {
// // // //             const carrierTripRef = doc(firestore, 'trips', tokenData.carrierTripId);
// // // //             batch.update(carrierTripRef, {
// // // //               bookingIds: arrayUnion(bookingRef.id),
// // // //               updatedAt: serverTimestamp(),
// // // //             });
// // // //           }
// // // //         }

// // // //         const userRef = doc(firestore, 'users', user.uid);
// // // //         batch.set(userRef, {
// // // //           activeBookingId: bookingRef.id,
// // // //           // activeIntentId: null,
// // // //           activeIntentId: deleteField(),
// // // //           updatedAt: serverTimestamp(),
// // // //         }, { merge: true });

// // // //         // إشعارات مخصصة حسب نوع الرحلة
// // // //         if (effectiveCarrierId && notificationRef) {
// // // //           batch.set(notificationRef, {
// // // //             userId: effectiveCarrierId,
// // // //             title: isScheduledTrip ? 'حجز جديد في رحلتك المجدولة! 🎫' : 'المسافر وافق على عرضك — في انتظار قبولك 🎉',
// // // //             message: isScheduledTrip
// // // //               ? `المسافر "${passengers[0]?.name || ''}" حجز ${passengers.length} مقعد في رحلتك المجدولة — يرجى تأكيد الحجز.`
// // // //               : `المسافر "${passengers[0]?.name || ''}" وافق على عرضك — اضغط لقبول الحجز.`,
// // // //             type: 'new_booking_request',
// // // //             bookingId: bookingRef.id,
// // // //             isRead: false,
// // // //             link: `/${locale}/carrier/bookings`,
// // // //             createdAt: serverTimestamp(),
// // // //           });
// // // //         }

// // // //         await batch.commit();

// // // //         if (effectiveCarrierId) {
// // // //           await sendPush({
// // // //             userId: effectiveCarrierId,
// // // //             title: isScheduledTrip ? 'حجز جديد في رحلتك المجدولة! 🎫' : 'المسافر وافق على عرضك! 🎉',
// // // //             body: isScheduledTrip
// // // //               ? `المسافر "${passengers[0]?.name || 'مسافر'}" بانتظار تأكيد حجز ${passengers.length} مقعد`
// // // //               : `${passengers[0]?.name || 'مسافر'} وافق — افتح التطبيق لقبول الحجز`,
// // // //             data: { type: 'new_booking_request' },
// // // //           });
// // // //         }

// // // //         try {
// // // //           const groupChatRef = doc(firestore, 'chats', trip.id);
// // // //           await setDoc(groupChatRef, { participants: arrayUnion(user.uid) }, { merge: true });
// // // //         } catch (e) {
// // // //           console.warn('[GroupChat] Could not join:', e);
// // // //         }
// // // //       }

// // // //       setIsDialogOpen(false);
// // // //       setStatus('success');

// // // //     } catch (err) {
// // // //       console.error('[ConfirmBooking Error]', err);
// // // //       setStatus('error');
// // // //       setErrorCode('OPERATION_FAILED');
// // // //       throw err;
// // // //     }
// // // //   };

// // // //   return (
// // // //     <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background" dir="rtl">
// // // //       {status === 'loading' && (
// // // //         <div className="text-center space-y-4">
// // // //           <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
// // // //           <p className="text-muted-foreground">جاري فحص الختم الرقمي...</p>
// // // //         </div>
// // // //       )}

// // // //       {(status === 'ready' || status === 'confirming') && trip && (
// // // //         <div className="text-center space-y-4">
// // // //           <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
// // // //           <p className="text-muted-foreground">جاري استرجاع بيانات الرحلة...</p>
// // // //         </div>
// // // //       )}

// // // //       {status === 'success' && (
// // // //         <div className="text-center space-y-6 max-w-md animate-in zoom-in duration-500">
// // // //           <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto" />
// // // //           <h1 className="text-2xl font-bold text-white">{t('accptReq')} 🎉</h1>
// // // //           <Button className="w-full" onClick={() => router.push(`/${locale}/history`)}>
// // // //             {t('gotoReq')}
// // // //           </Button>
// // // //         </div>
// // // //       )}

// // // //       {status === 'error' && (
// // // //         <div className="text-center space-y-6 max-w-md animate-in shake duration-500">
// // // //           <XCircle className="h-20 w-20 text-red-500 mx-auto" />
// // // //           <h1 className="text-2xl font-bold">تنبيه سيادي</h1>
// // // //           <p className="text-muted-foreground">{tError(errorCode)}</p>
// // // //           <Button className="w-full" onClick={() => router.push(`/${locale}/dashboard`)}>
// // // //             العودة للرئيسية
// // // //           </Button>
// // // //         </div>
// // // //       )}

// // // //       {trip && isDialogOpen && (
// // // //         <BookingDialog
// // // //           isOpen={isDialogOpen}
// // // //           onOpenChange={(open) => {
// // // //             setIsDialogOpen(open);
// // // //             if (!open && status === 'ready') router.push(`/${locale}/dashboard`);
// // // //           }}
// // // //           trip={trip}
// // // //           seatCount={tokenData?.seatCount || 1}
// // // //           onSubmit={handleConfirmBooking}
// // // //           isProcessing={status === 'confirming'}
// // // //           // ✅ [FIX]: تمرير أنواع الركاب من الطلب الأصلي للتعبئة التلقائية
// // // //           passengerTypes={
// // // //             // ✅ [FIX]: نمرر أنواع الركاب من الطلب الأصلي — child→minor لضمان التوافق مع RadioGroup
// // // //             (trip.passengersDetails && trip.passengersDetails.length > 0)
// // // //               ? trip.passengersDetails.map(p => {
// // // //                 const t = p.type as string;
// // // //                 return (t === 'child' ? 'minor' : t) as 'adult' | 'minor' | 'infant';
// // // //               })
// // // //               : undefined
// // // //           }
// // // //         />
// // // //       )}
// // // //     </div>
// // // //   );
// // // // }

// // // 'use client';

// // // import { useEffect, useState, Suspense } from 'react';
// // // import { useSearchParams, useRouter } from 'next/navigation';
// // // import { useFirestore, useUser } from '@/firebase';
// // // import { doc, getDoc, collection, serverTimestamp, writeBatch, arrayUnion, increment, setDoc, deleteField } from 'firebase/firestore';
// // // import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
// // // import { Button } from '@/components/ui/button';
// // // import { BookingDialog } from '@/components/booking-dialog';
// // // import type { Trip, PassengerDetails } from '@/lib/data';
// // // import { useLocale, useTranslations } from 'next-intl';
// // // import { sendPush } from "@/lib/send-push";

// // // /**
// // //  * @file src/app/[locale]/confirm-booking/page.tsx
// // //  * @description THE STERILIZED BOOKING CONFIRMATION (REINFORCED - SC-806 V6.1)
// // //  * [FIX]: تم الفصل الذكي بين حجز "الرحلات المجدولة" و "الطلبات الخاصة" لمنع اختفاء الرحلات
// // //  */

// // // type Status = 'loading' | 'ready' | 'confirming' | 'success' | 'error' | 'expired';

// // // export default function ConfirmBookingPage() {
// // //   return (
// // //     <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
// // //       <ConfirmBookingContent />
// // //     </Suspense>
// // //   );
// // // }

// // // function ConfirmBookingContent() {
// // //   const searchParams = useSearchParams();
// // //   const router = useRouter();
// // //   const firestore = useFirestore();
// // //   const { user } = useUser();
// // //   const locale = useLocale();
// // //   const tError = useTranslations('errorDictionary');
// // //   const t = useTranslations('ConfirmBooking');
// // //   const token = searchParams.get('token');

// // //   const [status, setStatus] = useState<Status>('loading');
// // //   const [tokenData, setTokenData] = useState<any>(null);
// // //   const [trip, setTrip] = useState<Trip | null>(null);
// // //   const [isDialogOpen, setIsDialogOpen] = useState(false);
// // //   const [errorCode, setErrorCode] = useState('DEFAULT');

// // //   useEffect(() => {
// // //     if (!token || !firestore) return;

// // //     const verifyToken = async () => {
// // //       try {
// // //         const tokenRef = doc(firestore, 'booking_tokens', token);
// // //         const tokenSnap = await getDoc(tokenRef);

// // //         if (!tokenSnap.exists()) {
// // //           setStatus('error');
// // //           setErrorCode('TOKEN_INVALID');
// // //           return;
// // //         }

// // //         const data = tokenSnap.data();

// // //         if (data.status === 'used') {
// // //           setStatus('error');
// // //           setErrorCode('TOKEN_USED');
// // //           return;
// // //         }

// // //         const expiresAt = data.expiresAt?.toDate?.() || new Date(data.expiresAt);
// // //         if (new Date() > expiresAt) {
// // //           setStatus('error');
// // //           setErrorCode('TOKEN_EXPIRED');
// // //           return;
// // //         }

// // //         const tripRef = doc(firestore, 'trips', data.tripId);
// // //         const tripSnap = await getDoc(tripRef);

// // //         if (!tripSnap.exists()) {
// // //           setStatus('error');
// // //           setErrorCode('TRIP_NOT_FOUND');
// // //           return;
// // //         }

// // //         setTokenData(data);
// // //         setTrip({ id: tripSnap.id, ...tripSnap.data() } as Trip);
// // //         setStatus('ready');
// // //         setIsDialogOpen(true);
// // //       } catch (err) {
// // //         console.error('[VerifyToken Error]', err);
// // //         setStatus('error');
// // //         setErrorCode('VERIFICATION_FAILED');
// // //       }
// // //     };

// // //     verifyToken();
// // //   }, [token, firestore]);

// // //   const handleConfirmBooking = async (passengers: PassengerDetails[]) => {
// // //     if (!firestore || !tokenData || !trip || !token) throw new Error('MISSING_DATA');
// // //     if (!user?.uid) throw new Error('AUTH_REQUIRED');

// // //     setStatus('confirming');

// // //     try {
// // //       const batch = writeBatch(firestore);
// // //       const tokenRef = doc(firestore, 'booking_tokens', token);

// // //       if (tokenData.bookingId) {
// // //         // ══════════════════════════════════════════════════════════════════
// // //         // المسار الجاي من وكيل
// // //         // ══════════════════════════════════════════════════════════════════
// // //         const existingBookingRef = doc(firestore, 'bookings', tokenData.bookingId);

// // //         batch.update(existingBookingRef, {
// // //           userId: user.uid,
// // //           passengersDetails: passengers,
// // //           seats: passengers.length,
// // //           depositPaid: true,
// // //           depositPercentage: trip.depositPercentage ?? 0,
// // //           verifiedEmail: tokenData.email || null,
// // //           status: 'Pending-Carrier-Confirmation',
// // //           updatedAt: serverTimestamp(),
// // //         });

// // //         batch.update(tokenRef, { status: 'used', usedAt: serverTimestamp() });

// // //         if (tokenData.carrierTripId) {
// // //           const carrierTripRef = doc(firestore, 'trips', tokenData.carrierTripId);
// // //           batch.update(carrierTripRef, {
// // //             bookingIds: arrayUnion(tokenData.bookingId),
// // //             updatedAt: serverTimestamp(),
// // //           });
// // //         }

// // //         const userRef = doc(firestore, 'users', user.uid);
// // //         batch.set(userRef, {
// // //           activeBookingId: tokenData.bookingId,
// // //           // activeIntentId: null,
// // //           activeIntentId: deleteField(),

// // //           updatedAt: serverTimestamp(),
// // //         }, { merge: true });

// // //         if (trip.carrierId) {
// // //           const notifRef = doc(collection(doc(firestore, 'users', trip.carrierId), 'notifications'));
// // //           batch.set(notifRef, {
// // //             userId: trip.carrierId,
// // //             title: 'مسافر أكمّل بيانات الحجز ✅',
// // //             message: `المسافر "${passengers[0]?.name || ''}" أكمل بياناته ودفع العربون — ${passengers.length} مقعد`,
// // //             type: 'passenger_deposit_paid',
// // //             bookingId: tokenData.bookingId,
// // //             isRead: false,
// // //             link: `/${locale}/carrier/bookings`,
// // //             createdAt: serverTimestamp(),
// // //           });
// // //         }

// // //         await batch.commit();

// // //         if (trip.carrierId) {
// // //           await sendPush({
// // //             userId: trip.carrierId,
// // //             title: 'مسافر أكمّل بيانات الحجز ✅',
// // //             body: `${passengers[0]?.name || 'مسافر'} دفع العربون — ${passengers.length} مقعد`,
// // //             data: { type: 'passenger_deposit_paid', bookingId: tokenData.bookingId },
// // //           });
// // //         }

// // //         try {
// // //           const groupChatRef = doc(firestore, 'chats', trip.id);
// // //           await setDoc(groupChatRef, { participants: arrayUnion(user.uid) }, { merge: true });
// // //         } catch (e) {
// // //           console.warn('[GroupChat] Could not join:', e);
// // //         }

// // //       } else {
// // //         // ══════════════════════════════════════════════════════════════════
// // //         // المسار العادي: مسافر مباشر بدون وكيل → booking جديد
// // //         // ══════════════════════════════════════════════════════════════════
// // //         const bookingRef = doc(collection(firestore, 'bookings'));

// // //         const effectiveCarrierId = tokenData.carrierId || (trip as any).pendingCarrierId || trip.carrierId || null;
// // //         const notificationRef = effectiveCarrierId
// // //           ? doc(collection(doc(firestore, 'users', effectiveCarrierId), 'notifications'))
// // //           : null;

// // //         // ✅ [FIX]: carrierTripId من الـ token (اللي يجي من رحلة الناقل الحقيقية)
// // //         // لو مفيش carrierTripId في الـ token → رحلة المسافر هي الأصل (طلب بدون ناقل بعد)
// // //         const effectiveCarrierTripId = tokenData.carrierTripId || null;
// // //         const isScheduledTrip = !!effectiveCarrierTripId ||
// // //           trip.status === 'Planned' || trip.status === 'Ongoing';

// // //         const newBookingStatus = 'Pending-Carrier-Confirmation';

// // //         batch.set(bookingRef, {
// // //           id: bookingRef.id,
// // //           tripId: trip.id,                                           // رحلة المسافر (الطلب الأصلي)
// // //           carrierTripId: effectiveCarrierTripId,                     // ✅ [FIX]: رحلة الناقل الحقيقية
// // //           userId: user.uid,
// // //           carrierId: effectiveCarrierId,
// // //           seats: passengers.length,
// // //           passengersDetails: passengers,
// // //           status: newBookingStatus,
// // //           totalPrice: (tokenData.price || trip.price || 0) * passengers.length,
// // //           currency: tokenData.currency || trip.currency || 'JOD',
// // //           depositPercentage: trip.depositPercentage ?? 0,
// // //           verifiedEmail: tokenData.email || null,
// // //           bookedByAgent: false,
// // //           requestOrigin: trip.origin,
// // //           requestDestination: trip.destination,
// // //           requestDepartureDate: trip.departureDate,
// // //           requestPassengers: passengers.length,
// // //           createdAt: serverTimestamp(),
// // //           updatedAt: serverTimestamp(),
// // //         });

// // //         batch.update(tokenRef, { status: 'used', usedAt: serverTimestamp() });

// // //         // ✅ [FIX]: دايماً حدّث رحلة المسافر بـ pendingBookingId
// // //         batch.update(doc(firestore, 'trips', trip.id), {
// // //           status: 'Pending-Carrier-Confirmation',
// // //           pendingBookingId: bookingRef.id,
// // //           carrierId: deleteField(),
// // //           pendingCarrierId: deleteField(),
// // //           updatedAt: serverTimestamp(),
// // //         });

// // //         // ✅ [FIX]: لو في carrierTripId → أضف الـ booking لرحلة الناقل الحقيقية وخصم المقاعد
// // //         if (effectiveCarrierTripId) {
// // //           batch.update(doc(firestore, 'trips', effectiveCarrierTripId), {
// // //             bookingIds: arrayUnion(bookingRef.id),   // ✅ يظهر عند الناقل
// // //             updatedAt: serverTimestamp(),
// // //           });
// // //         }

// // //         const userRef = doc(firestore, 'users', user.uid);
// // //         batch.set(userRef, {
// // //           activeBookingId: bookingRef.id,
// // //           // activeIntentId: null,
// // //           activeIntentId: deleteField(),
// // //           updatedAt: serverTimestamp(),
// // //         }, { merge: true });

// // //         // إشعارات مخصصة حسب نوع الرحلة
// // //         if (effectiveCarrierId && notificationRef) {
// // //           batch.set(notificationRef, {
// // //             userId: effectiveCarrierId,
// // //             title: isScheduledTrip ? 'حجز جديد في رحلتك المجدولة! 🎫' : 'المسافر وافق على عرضك — في انتظار قبولك 🎉',
// // //             message: isScheduledTrip
// // //               ? `المسافر "${passengers[0]?.name || ''}" حجز ${passengers.length} مقعد في رحلتك المجدولة — يرجى تأكيد الحجز.`
// // //               : `المسافر "${passengers[0]?.name || ''}" وافق على عرضك — اضغط لقبول الحجز.`,
// // //             type: 'new_booking_request',
// // //             bookingId: bookingRef.id,
// // //             isRead: false,
// // //             link: `/${locale}/carrier/bookings`,
// // //             createdAt: serverTimestamp(),
// // //           });
// // //         }

// // //         await batch.commit();

// // //         if (effectiveCarrierId) {
// // //           await sendPush({
// // //             userId: effectiveCarrierId,
// // //             title: isScheduledTrip ? 'حجز جديد في رحلتك المجدولة! 🎫' : 'المسافر وافق على عرضك! 🎉',
// // //             body: isScheduledTrip
// // //               ? `المسافر "${passengers[0]?.name || 'مسافر'}" بانتظار تأكيد حجز ${passengers.length} مقعد`
// // //               : `${passengers[0]?.name || 'مسافر'} وافق — افتح التطبيق لقبول الحجز`,
// // //             data: { type: 'new_booking_request' },
// // //           });
// // //         }

// // //         try {
// // //           const groupChatRef = doc(firestore, 'chats', trip.id);
// // //           await setDoc(groupChatRef, { participants: arrayUnion(user.uid) }, { merge: true });
// // //         } catch (e) {
// // //           console.warn('[GroupChat] Could not join:', e);
// // //         }
// // //       }

// // //       setIsDialogOpen(false);
// // //       setStatus('success');

// // //     } catch (err) {
// // //       console.error('[ConfirmBooking Error]', err);
// // //       setStatus('error');
// // //       setErrorCode('OPERATION_FAILED');
// // //       throw err;
// // //     }
// // //   };

// // //   return (
// // //     <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background" dir="rtl">
// // //       {status === 'loading' && (
// // //         <div className="text-center space-y-4">
// // //           <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
// // //           <p className="text-muted-foreground">جاري فحص الختم الرقمي...</p>
// // //         </div>
// // //       )}

// // //       {(status === 'ready' || status === 'confirming') && trip && (
// // //         <div className="text-center space-y-4">
// // //           <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
// // //           <p className="text-muted-foreground">جاري استرجاع بيانات الرحلة...</p>
// // //         </div>
// // //       )}

// // //       {status === 'success' && (
// // //         <div className="text-center space-y-6 max-w-md animate-in zoom-in duration-500">
// // //           <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto" />
// // //           <h1 className="text-2xl font-bold text-white">{t('accptReq')} 🎉</h1>
// // //           <Button className="w-full" onClick={() => router.push(`/${locale}/history`)}>
// // //             {t('gotoReq')}
// // //           </Button>
// // //         </div>
// // //       )}

// // //       {status === 'error' && (
// // //         <div className="text-center space-y-6 max-w-md animate-in shake duration-500">
// // //           <XCircle className="h-20 w-20 text-red-500 mx-auto" />
// // //           <h1 className="text-2xl font-bold">تنبيه سيادي</h1>
// // //           <p className="text-muted-foreground">{tError(errorCode)}</p>
// // //           <Button className="w-full" onClick={() => router.push(`/${locale}/dashboard`)}>
// // //             العودة للرئيسية
// // //           </Button>
// // //         </div>
// // //       )}

// // //       {trip && isDialogOpen && (
// // //         <BookingDialog
// // //           isOpen={isDialogOpen}
// // //           onOpenChange={(open) => {
// // //             setIsDialogOpen(open);
// // //             if (!open && status === 'ready') router.push(`/${locale}/dashboard`);
// // //           }}
// // //           trip={trip}
// // //           seatCount={tokenData?.seatCount || 1}
// // //           onSubmit={handleConfirmBooking}
// // //           isProcessing={status === 'confirming'}
// // //           // ✅ [FIX]: تمرير أنواع الركاب من الطلب الأصلي للتعبئة التلقائية
// // //           passengerTypes={
// // //             // ✅ [FIX]: نمرر أنواع الركاب من الطلب الأصلي — child→minor لضمان التوافق مع RadioGroup
// // //             (trip.passengersDetails && trip.passengersDetails.length > 0)
// // //               ? trip.passengersDetails.map(p => {
// // //                 const t = p.type as string;
// // //                 return (t === 'child' ? 'minor' : t) as 'adult' | 'minor' | 'infant';
// // //               })
// // //               : undefined
// // //           }
// // //         />
// // //       )}
// // //     </div>
// // //   );
// // // }

// // 'use client';

// // import { useEffect, useState, Suspense } from 'react';
// // import { useSearchParams, useRouter } from 'next/navigation';
// // import { useFirestore, useUser } from '@/firebase';
// // import { doc, getDoc, collection, serverTimestamp, writeBatch, arrayUnion, increment, setDoc, deleteField } from 'firebase/firestore';
// // import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
// // import { Button } from '@/components/ui/button';
// // import { BookingDialog } from '@/components/booking-dialog';
// // import type { Trip, PassengerDetails } from '@/lib/data';
// // import { useLocale, useTranslations } from 'next-intl';
// // import { sendPush } from "@/lib/send-push";

// // /**
// //  * @file src/app/[locale]/confirm-booking/page.tsx
// //  * @description THE STERILIZED BOOKING CONFIRMATION (REINFORCED - SC-806 V6.1)
// //  * [FIX]: تم الفصل الذكي بين حجز "الرحلات المجدولة" و "الطلبات الخاصة" لمنع اختفاء الرحلات
// //  */

// // type Status = 'loading' | 'ready' | 'confirming' | 'success' | 'error' | 'expired';

// // export default function ConfirmBookingPage() {
// //   return (
// //     <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
// //       <ConfirmBookingContent />
// //     </Suspense>
// //   );
// // }

// // function ConfirmBookingContent() {
// //   const searchParams = useSearchParams();
// //   const router = useRouter();
// //   const firestore = useFirestore();
// //   const { user } = useUser();
// //   const locale = useLocale();
// //   const tError = useTranslations('errorDictionary');
// //   const t = useTranslations('ConfirmBooking');
// //   const token = searchParams.get('token');

// //   const [status, setStatus] = useState<Status>('loading');
// //   const [tokenData, setTokenData] = useState<any>(null);
// //   const [trip, setTrip] = useState<Trip | null>(null);
// //   const [isDialogOpen, setIsDialogOpen] = useState(false);
// //   const [errorCode, setErrorCode] = useState('DEFAULT');

// //   useEffect(() => {
// //     if (!token || !firestore) return;

// //     const verifyToken = async () => {
// //       try {
// //         const tokenRef = doc(firestore, 'booking_tokens', token);
// //         const tokenSnap = await getDoc(tokenRef);

// //         if (!tokenSnap.exists()) {
// //           setStatus('error');
// //           setErrorCode('TOKEN_INVALID');
// //           return;
// //         }

// //         const data = tokenSnap.data();

// //         if (data.status === 'used') {
// //           setStatus('error');
// //           setErrorCode('TOKEN_USED');
// //           return;
// //         }

// //         const expiresAt = data.expiresAt?.toDate?.() || new Date(data.expiresAt);
// //         if (new Date() > expiresAt) {
// //           setStatus('error');
// //           setErrorCode('TOKEN_EXPIRED');
// //           return;
// //         }

// //         const tripRef = doc(firestore, 'trips', data.tripId);
// //         const tripSnap = await getDoc(tripRef);

// //         if (!tripSnap.exists()) {
// //           setStatus('error');
// //           setErrorCode('TRIP_NOT_FOUND');
// //           return;
// //         }

// //         setTokenData(data);
// //         setTrip({ id: tripSnap.id, ...tripSnap.data() } as Trip);
// //         setStatus('ready');
// //         setIsDialogOpen(true);
// //       } catch (err) {
// //         console.error('[VerifyToken Error]', err);
// //         setStatus('error');
// //         setErrorCode('VERIFICATION_FAILED');
// //       }
// //     };

// //     verifyToken();
// //   }, [token, firestore]);

// //   const handleConfirmBooking = async (passengers: PassengerDetails[]) => {
// //     if (!firestore || !tokenData || !trip || !token) throw new Error('MISSING_DATA');
// //     if (!user?.uid) throw new Error('AUTH_REQUIRED');

// //     setStatus('confirming');

// //     try {
// //       const batch = writeBatch(firestore);
// //       const tokenRef = doc(firestore, 'booking_tokens', token);

// //       if (tokenData.bookingId) {
// //         // ══════════════════════════════════════════════════════════════════
// //         // المسار الجاي من وكيل
// //         // ══════════════════════════════════════════════════════════════════
// //         const existingBookingRef = doc(firestore, 'bookings', tokenData.bookingId);

// //         batch.update(existingBookingRef, {
// //           userId: user.uid,
// //           passengersDetails: passengers,
// //           seats: passengers.length,
// //           depositPaid: true,
// //           depositPercentage: trip.depositPercentage ?? 0,
// //           verifiedEmail: tokenData.email || null,
// //           status: 'Pending-Carrier-Confirmation',
// //           updatedAt: serverTimestamp(),
// //         });

// //         batch.update(tokenRef, { status: 'used', usedAt: serverTimestamp() });

// //         if (tokenData.carrierTripId) {
// //           const carrierTripRef = doc(firestore, 'trips', tokenData.carrierTripId);
// //           batch.update(carrierTripRef, {
// //             bookingIds: arrayUnion(tokenData.bookingId),
// //             updatedAt: serverTimestamp(),
// //           });
// //         }

// //         const userRef = doc(firestore, 'users', user.uid);
// //         batch.set(userRef, {
// //           activeBookingId: tokenData.bookingId,
// //           // activeIntentId: null,
// //           activeIntentId: deleteField(),

// //           updatedAt: serverTimestamp(),
// //         }, { merge: true });

// //         if (trip.carrierId) {
// //           const notifRef = doc(collection(doc(firestore, 'users', trip.carrierId), 'notifications'));
// //           batch.set(notifRef, {
// //             userId: trip.carrierId,
// //             title: 'مسافر أكمّل بيانات الحجز ✅',
// //             message: `المسافر "${passengers[0]?.name || ''}" أكمل بياناته ودفع العربون — ${passengers.length} مقعد`,
// //             type: 'passenger_deposit_paid',
// //             bookingId: tokenData.bookingId,
// //             isRead: false,
// //             link: `/${locale}/carrier/bookings`,
// //             createdAt: serverTimestamp(),
// //           });
// //         }

// //         await batch.commit();

// //         if (trip.carrierId) {
// //           await sendPush({
// //             userId: trip.carrierId,
// //             title: 'مسافر أكمّل بيانات الحجز ✅',
// //             body: `${passengers[0]?.name || 'مسافر'} دفع العربون — ${passengers.length} مقعد`,
// //             data: { type: 'passenger_deposit_paid', bookingId: tokenData.bookingId },
// //           });
// //         }

// //         try {
// //           const groupChatRef = doc(firestore, 'chats', trip.id);
// //           await setDoc(groupChatRef, { participants: arrayUnion(user.uid) }, { merge: true });
// //         } catch (e) {
// //           console.warn('[GroupChat] Could not join:', e);
// //         }

// //       } else {
// //         // ══════════════════════════════════════════════════════════════════
// //         // المسار العادي: مسافر مباشر بدون وكيل → booking جديد
// //         // ══════════════════════════════════════════════════════════════════
// //         const bookingRef = doc(collection(firestore, 'bookings'));

// //         const effectiveCarrierId = tokenData.carrierId || (trip as any).pendingCarrierId || trip.carrierId || null;
// //         const notificationRef = effectiveCarrierId
// //           ? doc(collection(doc(firestore, 'users', effectiveCarrierId), 'notifications'))
// //           : null;

// //         // ✅ [FIX]: carrierTripId من الـ token (اللي يجي من رحلة الناقل الحقيقية)
// //         // لو مفيش carrierTripId في الـ token → رحلة المسافر هي الأصل (طلب بدون ناقل بعد)
// //         const effectiveCarrierTripId = tokenData.carrierTripId || null;
// //         const isScheduledTrip = !!effectiveCarrierTripId ||
// //           trip.status === 'Planned' || trip.status === 'Ongoing';

// //         const newBookingStatus = 'Pending-Carrier-Confirmation';

// //         batch.set(bookingRef, {
// //           id: bookingRef.id,
// //           tripId: trip.id,                                           // رحلة المسافر (الطلب الأصلي)
// //           carrierTripId: effectiveCarrierTripId,                     // ✅ [FIX]: رحلة الناقل الحقيقية
// //           userId: user.uid,
// //           carrierId: effectiveCarrierId,
// //           seats: passengers.length,
// //           passengersDetails: passengers,
// //           status: newBookingStatus,
// //           totalPrice: (tokenData.price || trip.price || 0) * passengers.length,
// //           currency: tokenData.currency || trip.currency || 'JOD',
// //           depositPercentage: trip.depositPercentage ?? 0,
// //           verifiedEmail: tokenData.email || null,
// //           bookedByAgent: false,
// //           requestOrigin: trip.origin,
// //           requestDestination: trip.destination,
// //           requestDepartureDate: trip.departureDate,
// //           requestPassengers: passengers.length,
// //           createdAt: serverTimestamp(),
// //           updatedAt: serverTimestamp(),
// //         });

// //         batch.update(tokenRef, { status: 'used', usedAt: serverTimestamp() });

// //         // ✅ [FIX]: دايماً حدّث رحلة المسافر بـ pendingBookingId
// //         // [FIX-2]: لا تمسح carrierId إلا لو مفيش رحلة ناقل مربوطة بالفعل
// //         // لو في effectiveCarrierTripId → معناه الناقل عنده رحلة → الـ carrierId مهم للـ query
// //         batch.update(doc(firestore, 'trips', trip.id), {
// //           status: 'Pending-Carrier-Confirmation',
// //           pendingBookingId: bookingRef.id,
// //           ...(!effectiveCarrierTripId && {
// //             carrierId: deleteField(),
// //             pendingCarrierId: deleteField(),
// //           }),
// //           updatedAt: serverTimestamp(),
// //         });

// //         // ✅ [FIX]: لو في carrierTripId → أضف الـ booking لرحلة الناقل الحقيقية وخصم المقاعد
// //         if (effectiveCarrierTripId) {
// //           batch.update(doc(firestore, 'trips', effectiveCarrierTripId), {
// //             bookingIds: arrayUnion(bookingRef.id),   // ✅ يظهر عند الناقل
// //             updatedAt: serverTimestamp(),
// //           });
// //         }

// //         const userRef = doc(firestore, 'users', user.uid);
// //         batch.set(userRef, {
// //           activeBookingId: bookingRef.id,
// //           // activeIntentId: null,
// //           activeIntentId: deleteField(),
// //           updatedAt: serverTimestamp(),
// //         }, { merge: true });

// //         // إشعارات مخصصة حسب نوع الرحلة
// //         if (effectiveCarrierId && notificationRef) {
// //           batch.set(notificationRef, {
// //             userId: effectiveCarrierId,
// //             title: isScheduledTrip ? 'حجز جديد في رحلتك المجدولة! 🎫' : 'المسافر وافق على عرضك — في انتظار قبولك 🎉',
// //             message: isScheduledTrip
// //               ? `المسافر "${passengers[0]?.name || ''}" حجز ${passengers.length} مقعد في رحلتك المجدولة — يرجى تأكيد الحجز.`
// //               : `المسافر "${passengers[0]?.name || ''}" وافق على عرضك — اضغط لقبول الحجز.`,
// //             type: 'new_booking_request',
// //             bookingId: bookingRef.id,
// //             isRead: false,
// //             link: `/${locale}/carrier/bookings`,
// //             createdAt: serverTimestamp(),
// //           });
// //         }

// //         await batch.commit();

// //         if (effectiveCarrierId) {
// //           await sendPush({
// //             userId: effectiveCarrierId,
// //             title: isScheduledTrip ? 'حجز جديد في رحلتك المجدولة! 🎫' : 'المسافر وافق على عرضك! 🎉',
// //             body: isScheduledTrip
// //               ? `المسافر "${passengers[0]?.name || 'مسافر'}" بانتظار تأكيد حجز ${passengers.length} مقعد`
// //               : `${passengers[0]?.name || 'مسافر'} وافق — افتح التطبيق لقبول الحجز`,
// //             data: { type: 'new_booking_request' },
// //           });
// //         }

// //         try {
// //           const groupChatRef = doc(firestore, 'chats', trip.id);
// //           await setDoc(groupChatRef, { participants: arrayUnion(user.uid) }, { merge: true });
// //         } catch (e) {
// //           console.warn('[GroupChat] Could not join:', e);
// //         }
// //       }

// //       setIsDialogOpen(false);
// //       setStatus('success');

// //     } catch (err) {
// //       console.error('[ConfirmBooking Error]', err);
// //       setStatus('error');
// //       setErrorCode('OPERATION_FAILED');
// //       throw err;
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background" dir="rtl">
// //       {status === 'loading' && (
// //         <div className="text-center space-y-4">
// //           <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
// //           <p className="text-muted-foreground">جاري فحص الختم الرقمي...</p>
// //         </div>
// //       )}

// //       {(status === 'ready' || status === 'confirming') && trip && (
// //         <div className="text-center space-y-4">
// //           <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
// //           <p className="text-muted-foreground">جاري استرجاع بيانات الرحلة...</p>
// //         </div>
// //       )}

// //       {status === 'success' && (
// //         <div className="text-center space-y-6 max-w-md animate-in zoom-in duration-500">
// //           <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto" />
// //           <h1 className="text-2xl font-bold text-white">{t('accptReq')} 🎉</h1>
// //           <Button className="w-full" onClick={() => router.push(`/${locale}/history`)}>
// //             {t('gotoReq')}
// //           </Button>
// //         </div>
// //       )}

// //       {status === 'error' && (
// //         <div className="text-center space-y-6 max-w-md animate-in shake duration-500">
// //           <XCircle className="h-20 w-20 text-red-500 mx-auto" />
// //           <h1 className="text-2xl font-bold">تنبيه سيادي</h1>
// //           <p className="text-muted-foreground">{tError(errorCode)}</p>
// //           <Button className="w-full" onClick={() => router.push(`/${locale}/dashboard`)}>
// //             العودة للرئيسية
// //           </Button>
// //         </div>
// //       )}

// //       {trip && isDialogOpen && (
// //         <BookingDialog
// //           isOpen={isDialogOpen}
// //           onOpenChange={(open) => {
// //             setIsDialogOpen(open);
// //             if (!open && status === 'ready') router.push(`/${locale}/dashboard`);
// //           }}
// //           trip={trip}
// //           seatCount={tokenData?.seatCount || 1}
// //           onSubmit={handleConfirmBooking}
// //           isProcessing={status === 'confirming'}
// //           // ✅ [FIX]: تمرير أنواع الركاب من الطلب الأصلي للتعبئة التلقائية
// //           passengerTypes={
// //             // ✅ [FIX]: نمرر أنواع الركاب من الطلب الأصلي — child→minor لضمان التوافق مع RadioGroup
// //             (trip.passengersDetails && trip.passengersDetails.length > 0)
// //               ? trip.passengersDetails.map(p => {
// //                 const t = p.type as string;
// //                 return (t === 'child' ? 'minor' : t) as 'adult' | 'minor' | 'infant';
// //               })
// //               : undefined
// //           }
// //         />
// //       )}
// //     </div>
// //   );
// // }
// 'use client';

// import { useEffect, useState, Suspense } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';
// import { useFirestore, useUser } from '@/firebase';
// import { doc, getDoc, collection, serverTimestamp, writeBatch, arrayUnion, increment, setDoc, deleteField } from 'firebase/firestore';
// import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { BookingDialog } from '@/components/booking-dialog';
// import type { Trip, PassengerDetails } from '@/lib/data';
// import { useLocale, useTranslations } from 'next-intl';
// import { sendPush } from "@/lib/send-push";

// /**
//  * @file src/app/[locale]/confirm-booking/page.tsx
//  * @description THE STERILIZED BOOKING CONFIRMATION (REINFORCED - SC-806 V7.0)
//  *
//  * [FIX-V7]: الحل الجذري لمشكلة بيانات التذكرة في مسار "طلب الرحلة":
//  *
//  * المشكلة كانت:
//  *   - لما المسافر بيحجز من "طلب رحلة"، الـ token بيشاور على رحلة المسافر (tripId)
//  *   - رحلة المسافر مش بيكون فيها بيانات كاملة (تاريخ/وقت/نقطة انطلاق) — دي عند الناقل
//  *   - فبيانات التذكرة بتظهر غلط، والناقل ما بيشوفش المسافر، والمقاعد ما بتنخصمش
//  *
//  * الحل:
//  *   - لما يكون في carrierTripId في الـ token، نجيب رحلة الناقل كـ "displayTrip"
//  *   - نعرض بياناتها في الـ BookingDialog (التاريخ/الوقت/نقطة الانطلاق الصح)
//  *   - نفضل نحتفظ بـ "passengerTrip" لتحديثها في Firestore
//  *
//  * المسارات المدعومة:
//  *   1. رحلة مجدولة: tripId = رحلة الناقل مباشرة → displayTrip = passengerTrip = نفس الرحلة
//  *   2. طلب رحلة: tripId = رحلة المسافر، carrierTripId = رحلة الناقل → displayTrip ≠ passengerTrip
//  *   3. وكيل: bookingId موجود → تحديث booking موجود مسبقاً
//  */

// type Status = 'loading' | 'ready' | 'confirming' | 'success' | 'error' | 'expired';

// export default function ConfirmBookingPage() {
//   return (
//     <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
//       <ConfirmBookingContent />
//     </Suspense>
//   );
// }

// function ConfirmBookingContent() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const firestore = useFirestore();
//   const { user } = useUser();
//   const locale = useLocale();
//   const tError = useTranslations('errorDictionary');
//   const t = useTranslations('ConfirmBooking');
//   const token = searchParams.get('token');

//   const [status, setStatus] = useState<Status>('loading');
//   const [tokenData, setTokenData] = useState<any>(null);

//   // [FIX-V7]: رحلتان منفصلتان
//   // passengerTrip: رحلة المسافر (للتحديث في Firestore)
//   // displayTrip:   الرحلة اللي بيتعرض بياناتها في التذكرة (رحلة الناقل لو موجود، وإلا نفس passengerTrip)
//   const [passengerTrip, setPassengerTrip] = useState<Trip | null>(null);
//   const [displayTrip, setDisplayTrip] = useState<Trip | null>(null);

//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [errorCode, setErrorCode] = useState('DEFAULT');

//   useEffect(() => {
//     if (!token || !firestore) return;

//     const verifyToken = async () => {
//       try {
//         const tokenRef = doc(firestore, 'booking_tokens', token);
//         const tokenSnap = await getDoc(tokenRef);

//         if (!tokenSnap.exists()) {
//           setStatus('error');
//           setErrorCode('TOKEN_INVALID');
//           return;
//         }

//         const data = tokenSnap.data();

//         if (data.status === 'used') {
//           setStatus('error');
//           setErrorCode('TOKEN_USED');
//           return;
//         }

//         const expiresAt = data.expiresAt?.toDate?.() || new Date(data.expiresAt);
//         if (new Date() > expiresAt) {
//           setStatus('error');
//           setErrorCode('TOKEN_EXPIRED');
//           return;
//         }

//         // جيب رحلة المسافر (أو رحلة الناقل في حالة الرحلات المجدولة المباشرة)
//         const passengerTripRef = doc(firestore, 'trips', data.tripId);
//         const passengerTripSnap = await getDoc(passengerTripRef);

//         if (!passengerTripSnap.exists()) {
//           setStatus('error');
//           setErrorCode('TRIP_NOT_FOUND');
//           return;
//         }

//         const pTrip = { id: passengerTripSnap.id, ...passengerTripSnap.data() } as Trip;
//         setPassengerTrip(pTrip);
//         setTokenData(data);

//         // [FIX-V7]: لو في carrierTripId في الـ token، جيب رحلة الناقل للعرض
//         // لأن البيانات الحقيقية (التاريخ/الوقت/نقطة الانطلاق) موجودة عند الناقل
//         if (data.carrierTripId) {
//           try {
//             const carrierTripRef = doc(firestore, 'trips', data.carrierTripId);
//             const carrierTripSnap = await getDoc(carrierTripRef);
//             if (carrierTripSnap.exists()) {
//               setDisplayTrip({ id: carrierTripSnap.id, ...carrierTripSnap.data() } as Trip);
//             } else {
//               // fallback: لو رحلة الناقل ما اتلقتش، استخدم رحلة المسافر
//               setDisplayTrip(pTrip);
//             }
//           } catch {
//             setDisplayTrip(pTrip);
//           }
//         } else {
//           // رحلة مجدولة مباشرة أو بدون ناقل بعد → نفس الرحلة
//           setDisplayTrip(pTrip);
//         }

//         setStatus('ready');
//         setIsDialogOpen(true);
//       } catch (err) {
//         console.error('[VerifyToken Error]', err);
//         setStatus('error');
//         setErrorCode('VERIFICATION_FAILED');
//       }
//     };

//     verifyToken();
//   }, [token, firestore]);

//   const handleConfirmBooking = async (passengers: PassengerDetails[]) => {
//     if (!firestore || !tokenData || !passengerTrip || !displayTrip || !token) throw new Error('MISSING_DATA');
//     if (!user?.uid) throw new Error('AUTH_REQUIRED');

//     setStatus('confirming');

//     try {
//       const batch = writeBatch(firestore);
//       const tokenRef = doc(firestore, 'booking_tokens', token);

//       if (tokenData.bookingId) {
//         // ══════════════════════════════════════════════════════════════════
//         // المسار الجاي من وكيل: تحديث booking موجود
//         // ══════════════════════════════════════════════════════════════════
//         const existingBookingRef = doc(firestore, 'bookings', tokenData.bookingId);

//         batch.update(existingBookingRef, {
//           userId: user.uid,
//           passengersDetails: passengers,
//           seats: passengers.length,
//           depositPaid: true,
//           depositPercentage: displayTrip.depositPercentage ?? 0,
//           verifiedEmail: tokenData.email || null,
//           status: 'Pending-Carrier-Confirmation',
//           updatedAt: serverTimestamp(),
//         });

//         batch.update(tokenRef, { status: 'used', usedAt: serverTimestamp() });

//         if (tokenData.carrierTripId) {
//           const carrierTripRef = doc(firestore, 'trips', tokenData.carrierTripId);
//           batch.update(carrierTripRef, {
//             bookingIds: arrayUnion(tokenData.bookingId),
//             updatedAt: serverTimestamp(),
//           });
//         }

//         const userRef = doc(firestore, 'users', user.uid);
//         batch.set(userRef, {
//           activeBookingId: tokenData.bookingId,
//           activeIntentId: deleteField(),
//           updatedAt: serverTimestamp(),
//         }, { merge: true });

//         // [FIX-V7]: نستخدم displayTrip.carrierId لأنه رحلة الناقل الحقيقية
//         const effectiveCarrierId = displayTrip.carrierId || passengerTrip.carrierId;
//         if (effectiveCarrierId) {
//           const notifRef = doc(collection(doc(firestore, 'users', effectiveCarrierId), 'notifications'));
//           batch.set(notifRef, {
//             userId: effectiveCarrierId,
//             title: 'مسافر أكمّل بيانات الحجز ✅',
//             message: `المسافر "${passengers[0]?.name || ''}" أكمل بياناته ودفع العربون — ${passengers.length} مقعد`,
//             type: 'passenger_deposit_paid',
//             bookingId: tokenData.bookingId,
//             isRead: false,
//             link: `/${locale}/carrier/bookings`,
//             createdAt: serverTimestamp(),
//           });
//         }

//         await batch.commit();

//         if (effectiveCarrierId) {
//           await sendPush({
//             userId: effectiveCarrierId,
//             title: 'مسافر أكمّل بيانات الحجز ✅',
//             body: `${passengers[0]?.name || 'مسافر'} دفع العربون — ${passengers.length} مقعد`,
//             data: { type: 'passenger_deposit_paid', bookingId: tokenData.bookingId },
//           });
//         }

//         try {
//           // [FIX-V7]: الشات يربط على رحلة الناقل (displayTrip) أو رحلة المسافر
//           const chatTripId = tokenData.carrierTripId || passengerTrip.id;
//           const groupChatRef = doc(firestore, 'chats', chatTripId);
//           await setDoc(groupChatRef, { participants: arrayUnion(user.uid) }, { merge: true });
//         } catch (e) {
//           console.warn('[GroupChat] Could not join:', e);
//         }

//       } else {
//         // ══════════════════════════════════════════════════════════════════
//         // المسار العادي: مسافر مباشر بدون وكيل → booking جديد
//         //
//         // [FIX-V7]:
//         //   - tripId في الـ booking = رحلة المسافر (passengerTrip.id) دايماً
//         //   - carrierTripId = tokenData.carrierTripId (رحلة الناقل الحقيقية)
//         //   - بيانات التذكرة بتيجي من displayTrip (رحلة الناقل لو موجود)
//         // ══════════════════════════════════════════════════════════════════
//         const bookingRef = doc(collection(firestore, 'bookings'));

//         const effectiveCarrierId = tokenData.carrierId
//           || (passengerTrip as any).pendingCarrierId
//           || displayTrip.carrierId
//           || passengerTrip.carrierId
//           || null;

//         const effectiveCarrierTripId = tokenData.carrierTripId || null;

//         // [FIX-V7]: تحديد نوع الرحلة للإشعار
//         const isScheduledTrip = !!effectiveCarrierTripId
//           || displayTrip.status === 'Planned'
//           || displayTrip.status === 'Ongoing';

//         const notificationRef = effectiveCarrierId
//           ? doc(collection(doc(firestore, 'users', effectiveCarrierId), 'notifications'))
//           : null;

//         // [FIX-V7]: بيانات التذكرة من displayTrip (رحلة الناقل الحقيقية)
//         // هذا يضمن أن التذكرة تعرض:
//         //   - التاريخ الصح (departureDate من رحلة الناقل)
//         //   - الوقت الصح (departureTime من رحلة الناقل)
//         //   - نقطة الانطلاق الصح (meetingPoint من رحلة الناقل)
//         //   - رابط نقطة الانطلاق (meetingPointLink من رحلة الناقل)
//         //   - رقم الرحلة (atomicId من رحلة الناقل)
//         batch.set(bookingRef, {
//           id: bookingRef.id,
//           tripId: passengerTrip.id,                                    // رحلة المسافر (الطلب الأصلي)
//           carrierTripId: effectiveCarrierTripId,                       // رحلة الناقل الحقيقية
//           userId: user.uid,
//           carrierId: effectiveCarrierId,
//           seats: passengers.length,
//           passengersDetails: passengers,
//           status: 'Pending-Carrier-Confirmation',
//           totalPrice: (tokenData.price || displayTrip.price || passengerTrip.price || 0) * passengers.length,
//           currency: tokenData.currency || displayTrip.currency || passengerTrip.currency || 'JOD',
//           depositPercentage: displayTrip.depositPercentage ?? passengerTrip.depositPercentage ?? 0,
//           verifiedEmail: tokenData.email || null,
//           bookedByAgent: false,
//           // [FIX-V7]: بيانات الطلب الأصلي من رحلة المسافر
//           requestOrigin: passengerTrip.origin,
//           requestDestination: passengerTrip.destination,
//           requestDepartureDate: passengerTrip.departureDate,
//           requestPassengers: passengers.length,
//           // [FIX-V7]: بيانات الرحلة الفعلية من رحلة الناقل (للتذكرة)
//           displayOrigin: displayTrip.origin,
//           displayDestination: displayTrip.destination,
//           displayDepartureDate: displayTrip.departureDate,
//           displayDepartureTime: (displayTrip as any).departureTime || null,
//           displayMeetingPoint: displayTrip.meetingPoint || null,
//           displayMeetingPointLink: displayTrip.meetingPointLink || null,
//           displayAtomicId: displayTrip.atomicId || null,
//           createdAt: serverTimestamp(),
//           updatedAt: serverTimestamp(),
//         });

//         batch.update(tokenRef, { status: 'used', usedAt: serverTimestamp() });

//         // [FIX-V7]: تحديث رحلة المسافر (الطلب الأصلي) بـ pendingBookingId
//         batch.update(doc(firestore, 'trips', passengerTrip.id), {
//           status: 'Pending-Carrier-Confirmation',
//           pendingBookingId: bookingRef.id,
//           ...(!effectiveCarrierTripId && {
//             carrierId: deleteField(),
//             pendingCarrierId: deleteField(),
//           }),
//           updatedAt: serverTimestamp(),
//         });

//         // [FIX-V7]: تحديث رحلة الناقل الحقيقية → أضف الـ booking وخصم المقاعد
//         if (effectiveCarrierTripId) {
//           batch.update(doc(firestore, 'trips', effectiveCarrierTripId), {
//             bookingIds: arrayUnion(bookingRef.id),
//             availableSeats: increment(-passengers.length),             // [FIX-V7]: خصم المقاعد من رحلة الناقل
//             updatedAt: serverTimestamp(),
//           });
//         }

//         const userRef = doc(firestore, 'users', user.uid);
//         batch.set(userRef, {
//           activeBookingId: bookingRef.id,
//           activeIntentId: deleteField(),
//           updatedAt: serverTimestamp(),
//         }, { merge: true });

//         // إشعارات مخصصة حسب نوع الرحلة
//         if (effectiveCarrierId && notificationRef) {
//           batch.set(notificationRef, {
//             userId: effectiveCarrierId,
//             title: isScheduledTrip ? 'حجز جديد في رحلتك المجدولة! 🎫' : 'المسافر وافق على عرضك — في انتظار قبولك 🎉',
//             message: isScheduledTrip
//               ? `المسافر "${passengers[0]?.name || ''}" حجز ${passengers.length} مقعد في رحلتك المجدولة — يرجى تأكيد الحجز.`
//               : `المسافر "${passengers[0]?.name || ''}" وافق على عرضك — اضغط لقبول الحجز.`,
//             type: 'new_booking_request',
//             bookingId: bookingRef.id,
//             isRead: false,
//             link: `/${locale}/carrier/bookings`,
//             createdAt: serverTimestamp(),
//           });
//         }

//         await batch.commit();

//         if (effectiveCarrierId) {
//           await sendPush({
//             userId: effectiveCarrierId,
//             title: isScheduledTrip ? 'حجز جديد في رحلتك المجدولة! 🎫' : 'المسافر وافق على عرضك! 🎉',
//             body: isScheduledTrip
//               ? `المسافر "${passengers[0]?.name || 'مسافر'}" بانتظار تأكيد حجز ${passengers.length} مقعد`
//               : `${passengers[0]?.name || 'مسافر'} وافق — افتح التطبيق لقبول الحجز`,
//             data: { type: 'new_booking_request' },
//           });
//         }

//         try {
//           // [FIX-V7]: الشات على رحلة الناقل (لو موجود) أو رحلة المسافر
//           const chatTripId = effectiveCarrierTripId || passengerTrip.id;
//           const groupChatRef = doc(firestore, 'chats', chatTripId);
//           await setDoc(groupChatRef, { participants: arrayUnion(user.uid) }, { merge: true });
//         } catch (e) {
//           console.warn('[GroupChat] Could not join:', e);
//         }
//       }

//       setIsDialogOpen(false);
//       setStatus('success');

//     } catch (err) {
//       console.error('[ConfirmBooking Error]', err);
//       setStatus('error');
//       setErrorCode('OPERATION_FAILED');
//       throw err;
//     }
//   };

//   // [FIX-V7]: نمرر displayTrip للـ BookingDialog (البيانات الصح للتذكرة)
//   // لكن نحتفظ بـ passengerTrip للعمليات الداخلية
//   const tripForDialog = displayTrip;

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background" dir="rtl">
//       {status === 'loading' && (
//         <div className="text-center space-y-4">
//           <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
//           <p className="text-muted-foreground">جاري فحص الختم الرقمي...</p>
//         </div>
//       )}

//       {(status === 'ready' || status === 'confirming') && tripForDialog && (
//         <div className="text-center space-y-4">
//           <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
//           <p className="text-muted-foreground">جاري استرجاع بيانات الرحلة...</p>
//         </div>
//       )}

//       {status === 'success' && (
//         <div className="text-center space-y-6 max-w-md animate-in zoom-in duration-500">
//           <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto" />
//           <h1 className="text-2xl font-bold text-white">{t('accptReq')} 🎉</h1>
//           <Button className="w-full" onClick={() => router.push(`/${locale}/history`)}>
//             {t('gotoReq')}
//           </Button>
//         </div>
//       )}

//       {status === 'error' && (
//         <div className="text-center space-y-6 max-w-md animate-in shake duration-500">
//           <XCircle className="h-20 w-20 text-red-500 mx-auto" />
//           <h1 className="text-2xl font-bold">تنبيه سيادي</h1>
//           <p className="text-muted-foreground">{tError(errorCode)}</p>
//           <Button className="w-full" onClick={() => router.push(`/${locale}/dashboard`)}>
//             العودة للرئيسية
//           </Button>
//         </div>
//       )}

//       {tripForDialog && isDialogOpen && (
//         <BookingDialog
//           isOpen={isDialogOpen}
//           onOpenChange={(open) => {
//             setIsDialogOpen(open);
//             if (!open && status === 'ready') router.push(`/${locale}/dashboard`);
//           }}
//           trip={tripForDialog}
//           seatCount={tokenData?.seatCount || 1}
//           onSubmit={handleConfirmBooking}
//           isProcessing={status === 'confirming'}
//           // [FIX-V7]: نمرر أنواع الركاب من رحلة المسافر (الطلب الأصلي) للتعبئة التلقائية
//           passengerTypes={
//             (passengerTrip?.passengersDetails && passengerTrip.passengersDetails.length > 0)
//               ? passengerTrip.passengersDetails.map(p => {
//                 const t = p.type as string;
//                 return (t === 'child' ? 'minor' : t) as 'adult' | 'minor' | 'infant';
//               })
//               : undefined
//           }
//         />
//       )}
//     </div>
//   );
// }
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useFirestore, useUser } from '@/firebase';
import { doc, getDoc, collection, serverTimestamp, writeBatch, arrayUnion, increment, setDoc, deleteField } from 'firebase/firestore';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BookingDialog } from '@/components/booking-dialog';
import type { Trip, PassengerDetails } from '@/lib/data';
import { useLocale, useTranslations } from 'next-intl';
import { sendPush } from "@/lib/send-push";

/**
 * @file src/app/[locale]/confirm-booking/page.tsx
 * @description THE STERILIZED BOOKING CONFIRMATION (V8.0 - DUAL PATH FIX)
 *
 * ══════════════════════════════════════════════════════════════════
 * المسار 1: SCHEDULED TRIP (رحلة مجدولة)
 *   token.tripId        = رحلة الناقل (carrierTrip) — هي المصدر الوحيد للبيانات
 *   token.carrierTripId = null
 *   الـ booking يُربط بـ carrierTrip.id كـ tripId
 *   رحلة الناقل لا تتغير حالتها — فقط availableSeats تنخصم
 *   المسافر عنده activeBookingId → يظهر له Pending-Carrier-Confirmation
 *
 * المسار 2: REQUEST TRIP (طلب رحلة)
 *   token.tripId        = رحلة المسافر (passengerTrip) — الطلب الأصلي
 *   token.carrierTripId = رحلة الناقل الحقيقية — بيانات التذكرة
 *   بيانات التذكرة تُجلب من carrierTrip
 *   الـ booking يُربط بـ passengerTrip.id كـ tripId و carrierTripId كـ carrierTripId
 *   passengerTrip تتغير حالتها → Pending-Carrier-Confirmation
 *   carrierTrip تُخصم منها المقاعد فقط + إضافة bookingId
 *   الناقل يشوف الـ booking لأن carrierId موجود فيه
 *
 * المسار 3: AGENT BOOKING (حجز وكيل)
 *   token.bookingId موجود → تحديث booking موجود
 * ══════════════════════════════════════════════════════════════════
 */

type Status = 'loading' | 'ready' | 'confirming' | 'success' | 'error';

export default function ConfirmBookingPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <ConfirmBookingContent />
    </Suspense>
  );
}

function ConfirmBookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const firestore = useFirestore();
  const { user } = useUser();
  const locale = useLocale();
  const tError = useTranslations('errorDictionary');
  const t = useTranslations('ConfirmBooking');
  const token = searchParams.get('token');

  const [status, setStatus] = useState<Status>('loading');
  const [tokenData, setTokenData] = useState<any>(null);
  // passengerTrip: رحلة المسافر (الطلب) في مسار الطلب، أو رحلة الناقل في مسار المجدولة
  const [passengerTrip, setPassengerTrip] = useState<Trip | null>(null);
  // displayTrip: الرحلة التي تُعرض بياناتها في الـ BookingDialog
  // = carrierTrip في مسار الطلب، = passengerTrip في مسار المجدولة
  const [displayTrip, setDisplayTrip] = useState<Trip | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [errorCode, setErrorCode] = useState('DEFAULT');

  useEffect(() => {
    if (!token || !firestore) return;

    const verifyToken = async () => {
      try {
        const tokenRef = doc(firestore, 'booking_tokens', token);
        const tokenSnap = await getDoc(tokenRef);

        if (!tokenSnap.exists()) { setStatus('error'); setErrorCode('TOKEN_INVALID'); return; }
        const data = tokenSnap.data();
        if (data.status === 'used') { setStatus('error'); setErrorCode('TOKEN_USED'); return; }
        const expiresAt = data.expiresAt?.toDate?.() || new Date(data.expiresAt);
        if (new Date() > expiresAt) { setStatus('error'); setErrorCode('TOKEN_EXPIRED'); return; }

        // جيب رحلة المسافر/الناقل الأساسية (token.tripId)
        const mainTripSnap = await getDoc(doc(firestore, 'trips', data.tripId));
        if (!mainTripSnap.exists()) { setStatus('error'); setErrorCode('TRIP_NOT_FOUND'); return; }
        const mainTrip = { id: mainTripSnap.id, ...mainTripSnap.data() } as Trip;

        setPassengerTrip(mainTrip);
        setTokenData(data);

        if (data.carrierTripId) {
          // ═══ مسار الطلب: جيب رحلة الناقل للعرض ═══
          try {
            const carrierTripSnap = await getDoc(doc(firestore, 'trips', data.carrierTripId));
            setDisplayTrip(carrierTripSnap.exists()
              ? { id: carrierTripSnap.id, ...carrierTripSnap.data() } as Trip
              : mainTrip // fallback
            );
          } catch { setDisplayTrip(mainTrip); }
        } else {
          // ═══ مسار المجدولة: نفس الرحلة ═══
          setDisplayTrip(mainTrip);
        }

        setStatus('ready');
        setIsDialogOpen(true);
      } catch (err) {
        console.error('[VerifyToken Error]', err);
        setStatus('error');
        setErrorCode('VERIFICATION_FAILED');
      }
    };

    verifyToken();
  }, [token, firestore]);

  const handleConfirmBooking = async (passengers: PassengerDetails[]) => {
    if (!firestore || !tokenData || !passengerTrip || !displayTrip || !token) throw new Error('MISSING_DATA');
    if (!user?.uid) throw new Error('AUTH_REQUIRED');

    setStatus('confirming');

    try {
      const batch = writeBatch(firestore);
      const tokenRef = doc(firestore, 'booking_tokens', token);

      // ══════════════════════════════════════════════════════════════════
      // المسار 3: وكيل — تحديث booking موجود
      // ══════════════════════════════════════════════════════════════════
      if (tokenData.bookingId) {
        const existingBookingRef = doc(firestore, 'bookings', tokenData.bookingId);

        batch.update(existingBookingRef, {
          userId: user.uid,
          passengersDetails: passengers,
          seats: passengers.length,
          depositPaid: true,
          depositPercentage: displayTrip.depositPercentage ?? 0,
          verifiedEmail: tokenData.email || null,
          status: 'Pending-Carrier-Confirmation',
          updatedAt: serverTimestamp(),
        });

        batch.update(tokenRef, { status: 'used', usedAt: serverTimestamp() });

        if (tokenData.carrierTripId) {
          batch.update(doc(firestore, 'trips', tokenData.carrierTripId), {
            bookingIds: arrayUnion(tokenData.bookingId),
            updatedAt: serverTimestamp(),
          });
        }

        const userRef = doc(firestore, 'users', user.uid);
        batch.set(userRef, {
          activeBookingId: tokenData.bookingId,
          activeIntentId: deleteField(),
          updatedAt: serverTimestamp(),
        }, { merge: true });

        const effectiveCarrierId = displayTrip.carrierId || passengerTrip.carrierId;
        if (effectiveCarrierId) {
          const notifRef = doc(collection(doc(firestore, 'users', effectiveCarrierId), 'notifications'));
          batch.set(notifRef, {
            userId: effectiveCarrierId,
            title: 'مسافر أكمّل بيانات الحجز ✅',
            message: `المسافر "${passengers[0]?.name || ''}" أكمل بياناته ودفع العربون — ${passengers.length} مقعد`,
            type: 'passenger_deposit_paid',
            bookingId: tokenData.bookingId,
            isRead: false,
            link: `/${locale}/carrier/bookings`,
            createdAt: serverTimestamp(),
          });
        }

        await batch.commit();

        if (effectiveCarrierId) {
          await sendPush({
            userId: effectiveCarrierId,
            title: 'مسافر أكمّل بيانات الحجز ✅',
            body: `${passengers[0]?.name || 'مسافر'} دفع العربون — ${passengers.length} مقعد`,
            data: { type: 'passenger_deposit_paid', bookingId: tokenData.bookingId },
          });
        }

        try {
          const chatTripId = tokenData.carrierTripId || passengerTrip.id;
          await setDoc(doc(firestore, 'chats', chatTripId), { participants: arrayUnion(user.uid) }, { merge: true });
        } catch (e) { console.warn('[GroupChat]', e); }
      }

      // ══════════════════════════════════════════════════════════════════
      // المسار 1: رحلة مجدولة — carrierTripId = null
      //   token.tripId = رحلة الناقل مباشرة
      //   نُنشئ booking مربوط بـ carrierTrip
      //   لا نغير حالة الرحلة — فقط نخصم المقاعد
      // ══════════════════════════════════════════════════════════════════
      else if (!tokenData.carrierTripId) {
        const bookingRef = doc(collection(firestore, 'bookings'));
        // في مسار المجدولة: passengerTrip = displayTrip = رحلة الناقل
        const carrierTrip = displayTrip;
        const effectiveCarrierId = tokenData.carrierId || carrierTrip.carrierId || null;

        const notifRef = effectiveCarrierId
          ? doc(collection(doc(firestore, 'users', effectiveCarrierId), 'notifications'))
          : null;

        // الـ booking يُربط بـ carrierTrip.id كـ tripId (رحلة الناقل مباشرة)
        batch.set(bookingRef, {
          id: bookingRef.id,
          tripId: carrierTrip.id,                      // ✅ رحلة الناقل
          carrierTripId: null,                          // ✅ لا يوجد رحلة ثانية
          userId: user.uid,
          carrierId: effectiveCarrierId,
          seats: passengers.length,
          passengersDetails: passengers,
          status: 'Pending-Carrier-Confirmation',
          totalPrice: (tokenData.price || carrierTrip.price || 0) * passengers.length,
          currency: tokenData.currency || carrierTrip.currency || 'JOD',
          depositPercentage: carrierTrip.depositPercentage ?? 0,
          verifiedEmail: tokenData.email || null,
          bookedByAgent: false,
          requestOrigin: carrierTrip.origin,
          requestDestination: carrierTrip.destination,
          requestDepartureDate: carrierTrip.departureDate,
          requestPassengers: passengers.length,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        batch.update(tokenRef, { status: 'used', usedAt: serverTimestamp() });

        // ✅ خصم المقاعد من رحلة الناقل + إضافة bookingId
        batch.update(doc(firestore, 'trips', carrierTrip.id), {
          bookingIds: arrayUnion(bookingRef.id),
          availableSeats: increment(-passengers.length),
          updatedAt: serverTimestamp(),
          // ✅ لا نغير status الرحلة — الناقل هو من يقرر
        });

        // ✅ تحديث user
        batch.set(doc(firestore, 'users', user.uid), {
          activeBookingId: bookingRef.id,
          activeIntentId: deleteField(),
          updatedAt: serverTimestamp(),
        }, { merge: true });

        // إشعار الناقل
        if (effectiveCarrierId && notifRef) {
          batch.set(notifRef, {
            userId: effectiveCarrierId,
            title: 'حجز جديد في رحلتك المجدولة! 🎫',
            message: `المسافر "${passengers[0]?.name || ''}" حجز ${passengers.length} مقعد — يرجى تأكيد الحجز.`,
            type: 'new_booking_request',
            bookingId: bookingRef.id,
            isRead: false,
            link: `/${locale}/carrier/bookings`,
            createdAt: serverTimestamp(),
          });
        }

        await batch.commit();

        if (effectiveCarrierId) {
          await sendPush({
            userId: effectiveCarrierId,
            title: 'حجز جديد في رحلتك المجدولة! 🎫',
            body: `${passengers[0]?.name || 'مسافر'} بانتظار تأكيد ${passengers.length} مقعد`,
            data: { type: 'new_booking_request' },
          });
        }

        try {
          await setDoc(doc(firestore, 'chats', carrierTrip.id), { participants: arrayUnion(user.uid) }, { merge: true });
        } catch (e) { console.warn('[GroupChat]', e); }
      }

      // ══════════════════════════════════════════════════════════════════
      // المسار 2: طلب رحلة — carrierTripId موجود
      //   token.tripId        = رحلة المسافر (passengerTrip)
      //   token.carrierTripId = رحلة الناقل (displayTrip)
      //   بيانات التذكرة من displayTrip
      //   passengerTrip تتغير → Pending-Carrier-Confirmation
      //   carrierTrip تُخصم منها المقاعد
      // ══════════════════════════════════════════════════════════════════
      else {
        const bookingRef = doc(collection(firestore, 'bookings'));
        const carrierTrip = displayTrip;  // رحلة الناقل الحقيقية
        const effectiveCarrierId = tokenData.carrierId
          || (passengerTrip as any).pendingCarrierId
          || carrierTrip.carrierId
          || null;

        const notifRef = effectiveCarrierId
          ? doc(collection(doc(firestore, 'users', effectiveCarrierId), 'notifications'))
          : null;

        // الـ booking يُربط بـ passengerTrip كـ tripId و carrierTrip كـ carrierTripId
        batch.set(bookingRef, {
          id: bookingRef.id,
          tripId: passengerTrip.id,                                // ✅ رحلة المسافر
          carrierTripId: tokenData.carrierTripId,                  // ✅ رحلة الناقل
          userId: user.uid,
          carrierId: effectiveCarrierId,
          seats: passengers.length,
          passengersDetails: passengers,
          status: 'Pending-Carrier-Confirmation',
          totalPrice: (tokenData.price || carrierTrip.price || passengerTrip.price || 0) * passengers.length,
          currency: tokenData.currency || carrierTrip.currency || passengerTrip.currency || 'JOD',
          depositPercentage: carrierTrip.depositPercentage ?? passengerTrip.depositPercentage ?? 0,
          verifiedEmail: tokenData.email || null,
          bookedByAgent: false,
          // بيانات الطلب الأصلي
          requestOrigin: passengerTrip.origin,
          requestDestination: passengerTrip.destination,
          requestDepartureDate: passengerTrip.departureDate,
          requestPassengers: passengers.length,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        batch.update(tokenRef, { status: 'used', usedAt: serverTimestamp() });

        // ✅ تغيير حالة رحلة المسافر (الطلب) — لا نلمس رحلة الناقل
        batch.update(doc(firestore, 'trips', passengerTrip.id), {
          status: 'Pending-Carrier-Confirmation',
          pendingBookingId: bookingRef.id,
          carrierId: deleteField(),
          pendingCarrierId: deleteField(),
          updatedAt: serverTimestamp(),
        });

        // ✅ خصم المقاعد من رحلة الناقل الحقيقية + إضافة bookingId
        batch.update(doc(firestore, 'trips', tokenData.carrierTripId), {
          bookingIds: arrayUnion(bookingRef.id),
          availableSeats: increment(-passengers.length),
          updatedAt: serverTimestamp(),
        });

        // ✅ تحديث user
        batch.set(doc(firestore, 'users', user.uid), {
          activeBookingId: bookingRef.id,
          activeIntentId: deleteField(),
          updatedAt: serverTimestamp(),
        }, { merge: true });

        // إشعار الناقل
        if (effectiveCarrierId && notifRef) {
          batch.set(notifRef, {
            userId: effectiveCarrierId,
            title: 'المسافر وافق على عرضك — في انتظار قبولك 🎉',
            message: `المسافر "${passengers[0]?.name || ''}" وافق على عرضك — اضغط لقبول الحجز.`,
            type: 'new_booking_request',
            bookingId: bookingRef.id,
            isRead: false,
            link: `/${locale}/carrier/bookings`,
            createdAt: serverTimestamp(),
          });
        }

        await batch.commit();

        if (effectiveCarrierId) {
          await sendPush({
            userId: effectiveCarrierId,
            title: 'المسافر وافق على عرضك! 🎉',
            body: `${passengers[0]?.name || 'مسافر'} وافق — افتح التطبيق لقبول الحجز`,
            data: { type: 'new_booking_request' },
          });
        }

        try {
          // الشات على رحلة الناقل
          await setDoc(doc(firestore, 'chats', tokenData.carrierTripId), { participants: arrayUnion(user.uid) }, { merge: true });
        } catch (e) { console.warn('[GroupChat]', e); }
      }

      setIsDialogOpen(false);
      setStatus('success');

    } catch (err) {
      console.error('[ConfirmBooking Error]', err);
      setStatus('error');
      setErrorCode('OPERATION_FAILED');
      throw err;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background" dir="rtl">
      {status === 'loading' && (
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">جاري فحص الختم الرقمي...</p>
        </div>
      )}

      {(status === 'ready' || status === 'confirming') && displayTrip && (
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">جاري استرجاع بيانات الرحلة...</p>
        </div>
      )}

      {status === 'success' && (
        <div className="text-center space-y-6 max-w-md animate-in zoom-in duration-500">
          <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto" />
          <h1 className="text-2xl font-bold text-white">{t('accptReq')} 🎉</h1>
          <Button className="w-full" onClick={() => router.push(`/${locale}/history`)}>
            {t('gotoReq')}
          </Button>
        </div>
      )}

      {status === 'error' && (
        <div className="text-center space-y-6 max-w-md animate-in shake duration-500">
          <XCircle className="h-20 w-20 text-red-500 mx-auto" />
          <h1 className="text-2xl font-bold">تنبيه سيادي</h1>
          <p className="text-muted-foreground">{tError(errorCode)}</p>
          <Button className="w-full" onClick={() => router.push(`/${locale}/dashboard`)}>
            العودة للرئيسية
          </Button>
        </div>
      )}

      {displayTrip && isDialogOpen && (
        <BookingDialog
          isOpen={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open && status === 'ready') router.push(`/${locale}/dashboard`);
          }}
          trip={displayTrip}
          seatCount={tokenData?.seatCount || 1}
          onSubmit={handleConfirmBooking}
          isProcessing={status === 'confirming'}
          passengerTypes={
            (passengerTrip?.passengersDetails && passengerTrip.passengersDetails.length > 0)
              ? passengerTrip.passengersDetails.map(p => {
                const type = p.type as string;
                return (type === 'child' ? 'minor' : type) as 'adult' | 'minor' | 'infant';
              })
              : undefined
          }
        />
      )}
    </div>
  );
}