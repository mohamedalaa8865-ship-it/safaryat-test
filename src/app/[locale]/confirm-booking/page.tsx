// // // // // // // // 'use client';

// // // // // // // // import { useEffect, useState } from 'react';
// // // // // // // // import { useSearchParams, useRouter } from 'next/navigation';
// // // // // // // // import { useFirestore, useUser } from '@/firebase';
// // // // // // // // import { doc, getDoc, collection, serverTimestamp, writeBatch, arrayUnion, increment, setDoc } from 'firebase/firestore';
// // // // // // // // import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
// // // // // // // // import { Button } from '@/components/ui/button';
// // // // // // // // import { BookingDialog } from '@/components/booking-dialog';
// // // // // // // // import type { Trip, PassengerDetails } from '@/lib/data';
// // // // // // // // import { useLocale, useTranslations } from 'next-intl';

// // // // // // // // /**
// // // // // // // //  * @file src/app/[locale]/confirm-booking/page.tsx
// // // // // // // //  * @description THE STERILIZED BOOKING CONFIRMATION (REINFORCED - SC-806 V6.0)
// // // // // // // //  * [FIX]: لو الـ token فيه bookingId (جاي من وكيل) → يحدّث الـ booking الموجود
// // // // // // // //  *        بدل ما يعمل booking جديد — عشان بيانات المسافر تظهر عند الناقل
// // // // // // // //  */

// // // // // // // // type Status = 'loading' | 'ready' | 'confirming' | 'success' | 'error' | 'expired';

// // // // // // // // export default function ConfirmBookingPage() {
// // // // // // // //   const searchParams = useSearchParams();
// // // // // // // //   const router = useRouter();
// // // // // // // //   const firestore = useFirestore();
// // // // // // // //   const { user } = useUser();
// // // // // // // //   const locale = useLocale();
// // // // // // // //   const tError = useTranslations('errorDictionary');
// // // // // // // //   const t = useTranslations('ConfirmBooking');
// // // // // // // //   const token = searchParams.get('token');

// // // // // // // //   const [status, setStatus] = useState<Status>('loading');
// // // // // // // //   const [tokenData, setTokenData] = useState<any>(null);
// // // // // // // //   const [trip, setTrip] = useState<Trip | null>(null);
// // // // // // // //   const [isDialogOpen, setIsDialogOpen] = useState(false);
// // // // // // // //   const [errorCode, setErrorCode] = useState('DEFAULT');

// // // // // // // //   useEffect(() => {
// // // // // // // //     if (!token || !firestore) return;

// // // // // // // //     const verifyToken = async () => {
// // // // // // // //       try {
// // // // // // // //         const tokenRef = doc(firestore, 'booking_tokens', token);
// // // // // // // //         const tokenSnap = await getDoc(tokenRef);

// // // // // // // //         if (!tokenSnap.exists()) {
// // // // // // // //           setStatus('error');
// // // // // // // //           setErrorCode('TOKEN_INVALID');
// // // // // // // //           return;
// // // // // // // //         }

// // // // // // // //         const data = tokenSnap.data();

// // // // // // // //         if (data.status === 'used') {
// // // // // // // //           setStatus('error');
// // // // // // // //           setErrorCode('TOKEN_USED');
// // // // // // // //           return;
// // // // // // // //         }

// // // // // // // //         const expiresAt = data.expiresAt?.toDate?.() || new Date(data.expiresAt);
// // // // // // // //         if (new Date() > expiresAt) {
// // // // // // // //           setStatus('error');
// // // // // // // //           setErrorCode('TOKEN_EXPIRED');
// // // // // // // //           return;
// // // // // // // //         }

// // // // // // // //         const tripRef = doc(firestore, 'trips', data.tripId);
// // // // // // // //         const tripSnap = await getDoc(tripRef);

// // // // // // // //         if (!tripSnap.exists()) {
// // // // // // // //           setStatus('error');
// // // // // // // //           setErrorCode('TRIP_NOT_FOUND');
// // // // // // // //           return;
// // // // // // // //         }

// // // // // // // //         setTokenData(data);
// // // // // // // //         setTrip({ id: tripSnap.id, ...tripSnap.data() } as Trip);
// // // // // // // //         setStatus('ready');
// // // // // // // //         setIsDialogOpen(true);
// // // // // // // //       } catch (err) {
// // // // // // // //         console.error('[VerifyToken Error]', err);
// // // // // // // //         setStatus('error');
// // // // // // // //         setErrorCode('VERIFICATION_FAILED');
// // // // // // // //       }
// // // // // // // //     };

// // // // // // // //     verifyToken();
// // // // // // // //   }, [token, firestore]);

// // // // // // // //   const handleConfirmBooking = async (passengers: PassengerDetails[]) => {
// // // // // // // //     if (!firestore || !tokenData || !trip || !token) throw new Error('MISSING_DATA');
// // // // // // // //     if (!user?.uid) throw new Error('AUTH_REQUIRED');

// // // // // // // //     setStatus('confirming');

// // // // // // // //     try {
// // // // // // // //       const batch = writeBatch(firestore);
// // // // // // // //       const tokenRef = doc(firestore, 'booking_tokens', token);

// // // // // // // //       // ══════════════════════════════════════════════════════════════════
// // // // // // // //       // [FIX - SC-806 V6.0]: المسار الجاي من وكيل
// // // // // // // //       // لو في bookingId في الـ token → الـ booking موجود (عمله الوكيل)
// // // // // // // //       // المسافر بس يكمّل البيانات ويدفع الغربون
// // // // // // // //       // ══════════════════════════════════════════════════════════════════
// // // // // // // //       if (tokenData.bookingId) {
// // // // // // // //         const existingBookingRef = doc(firestore, 'bookings', tokenData.bookingId);

// // // // // // // //         // تحديث الـ booking الموجود ببيانات المسافر
// // // // // // // //         batch.update(existingBookingRef, {
// // // // // // // //           userId: user.uid,
// // // // // // // //           passengersDetails: passengers,
// // // // // // // //           seats: passengers.length,
// // // // // // // //           depositPaid: true,
// // // // // // // //           verifiedEmail: tokenData.email || null,
// // // // // // // //           status: 'Pending-Carrier-Confirmation', // يفضل نفسه — الناقل هيشوفه
// // // // // // // //           updatedAt: serverTimestamp(),
// // // // // // // //         });

// // // // // // // //         // تعليم التوكن كمستخدم
// // // // // // // //         batch.update(tokenRef, { status: 'used', usedAt: serverTimestamp() });

// // // // // // // //         // تقليل المقاعد من رحلة الناقل
// // // // // // // //         if (tokenData.carrierTripId) {
// // // // // // // //           const carrierTripRef = doc(firestore, 'trips', tokenData.carrierTripId);
// // // // // // // //           batch.update(carrierTripRef, {
// // // // // // // //             availableSeats: increment(-passengers.length),
// // // // // // // //             bookingIds: arrayUnion(tokenData.bookingId),
// // // // // // // //             updatedAt: serverTimestamp(),
// // // // // // // //           });
// // // // // // // //         }

// // // // // // // //         // ربط المسافر بالحجز في بروفايله
// // // // // // // //         const userRef = doc(firestore, 'users', user.uid);
// // // // // // // //         batch.update(userRef, {
// // // // // // // //           activeBookingId: tokenData.bookingId,
// // // // // // // //           activeIntentId: null,
// // // // // // // //           updatedAt: serverTimestamp(),
// // // // // // // //         });

// // // // // // // //         // إشعار للناقل إن المسافر دفع وأكمل البيانات
// // // // // // // //         if (trip.carrierId) {
// // // // // // // //           const notifRef = doc(collection(doc(firestore, 'users', trip.carrierId), 'notifications'));
// // // // // // // //           batch.set(notifRef, {
// // // // // // // //             userId: trip.carrierId,
// // // // // // // //             title: 'مسافر أكمّل بيانات الحجز ✅',
// // // // // // // //             message: `المسافر "${passengers[0]?.name || ''}" أكمل بياناته ودفع الغربون — ${passengers.length} مقعد`,
// // // // // // // //             type: 'passenger_deposit_paid',
// // // // // // // //             bookingId: tokenData.bookingId,
// // // // // // // //             isRead: false,
// // // // // // // //             link: `/${locale}/carrier/bookings`,
// // // // // // // //             createdAt: serverTimestamp(),
// // // // // // // //           });
// // // // // // // //         }

// // // // // // // //         await batch.commit();

// // // // // // // //         // محاولة الانضمام للـ group chat
// // // // // // // //         try {
// // // // // // // //           const groupChatRef = doc(firestore, 'chats', trip.id);
// // // // // // // //           await setDoc(groupChatRef, { participants: arrayUnion(user.uid) }, { merge: true });
// // // // // // // //         } catch (e) {
// // // // // // // //           console.warn('[GroupChat] Could not join:', e);
// // // // // // // //         }

// // // // // // // //       } else {
// // // // // // // //         // ══════════════════════════════════════════════════════════════════
// // // // // // // //         // المسار العادي: مسافر مباشر بدون وكيل → booking جديد
// // // // // // // //         // ══════════════════════════════════════════════════════════════════
// // // // // // // //         const bookingRef = doc(collection(firestore, 'bookings'));
// // // // // // // //         const notificationRef = trip.carrierId
// // // // // // // //           ? doc(collection(doc(firestore, 'users', trip.carrierId), 'notifications'))
// // // // // // // //           : null;

// // // // // // // //         batch.set(bookingRef, {
// // // // // // // //           id: bookingRef.id,
// // // // // // // //           tripId: trip.id,
// // // // // // // //           carrierTripId: tokenData.carrierTripId || null,
// // // // // // // //           userId: user.uid,
// // // // // // // //           carrierId: trip.carrierId || tokenData.carrierId,
// // // // // // // //           seats: passengers.length,
// // // // // // // //           passengersDetails: passengers,
// // // // // // // //           status: 'Pending-Carrier-Confirmation',
// // // // // // // //           totalPrice: (tokenData.price || trip.price || 0) * passengers.length,
// // // // // // // //           currency: tokenData.currency || trip.currency || 'JOD',
// // // // // // // //           verifiedEmail: tokenData.email || null,
// // // // // // // //           bookedByAgent: false,
// // // // // // // //           createdAt: serverTimestamp(),
// // // // // // // //           updatedAt: serverTimestamp(),
// // // // // // // //         });

// // // // // // // //         // تعليم التوكن كمستخدم
// // // // // // // //         batch.update(tokenRef, { status: 'used', usedAt: serverTimestamp() });

// // // // // // // //         // تقليل المقاعد
// // // // // // // //         if (tokenData.carrierTripId) {
// // // // // // // //           const carrierTripRef = doc(firestore, 'trips', tokenData.carrierTripId);
// // // // // // // //           batch.update(carrierTripRef, {
// // // // // // // //             availableSeats: increment(-passengers.length),
// // // // // // // //             bookingIds: arrayUnion(bookingRef.id),
// // // // // // // //             updatedAt: serverTimestamp(),
// // // // // // // //           });
// // // // // // // //         }

// // // // // // // //         // ربط المسافر بالحجز
// // // // // // // //         const userRef = doc(firestore, 'users', user.uid);
// // // // // // // //         batch.update(userRef, {
// // // // // // // //           activeBookingId: bookingRef.id,
// // // // // // // //           activeIntentId: null,
// // // // // // // //           updatedAt: serverTimestamp(),
// // // // // // // //         });

// // // // // // // //         // إشعار للناقل
// // // // // // // //         if (trip.carrierId && notificationRef) {
// // // // // // // //           batch.set(notificationRef, {
// // // // // // // //             userId: trip.carrierId,
// // // // // // // //             title: 'طلب حجز جديد 🎫',
// // // // // // // //             message: `مسافر يطلب حجز ${passengers.length} مقعد من ${trip.origin} إلى ${trip.destination}`,
// // // // // // // //             type: 'new_booking_request',
// // // // // // // //             isRead: false,
// // // // // // // //             link: `/${locale}/carrier/bookings`,
// // // // // // // //             createdAt: serverTimestamp(),
// // // // // // // //           });
// // // // // // // //         }

// // // // // // // //         await batch.commit();

// // // // // // // //         // محاولة الانضمام للـ group chat
// // // // // // // //         try {
// // // // // // // //           const groupChatRef = doc(firestore, 'chats', trip.id);
// // // // // // // //           await setDoc(groupChatRef, { participants: arrayUnion(user.uid) }, { merge: true });
// // // // // // // //         } catch (e) {
// // // // // // // //           console.warn('[GroupChat] Could not join:', e);
// // // // // // // //         }
// // // // // // // //       }

// // // // // // // //       setIsDialogOpen(false);
// // // // // // // //       setStatus('success');

// // // // // // // //     } catch (err) {
// // // // // // // //       console.error('[ConfirmBooking Error]', err);
// // // // // // // //       setStatus('error');
// // // // // // // //       setErrorCode('OPERATION_FAILED');
// // // // // // // //       throw err;
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   return (
// // // // // // // //     <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background" dir="rtl">

// // // // // // // //       {status === 'loading' && (
// // // // // // // //         <div className="text-center space-y-4">
// // // // // // // //           <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
// // // // // // // //           <p className="text-muted-foreground">جاري فحص الختم الرقمي...</p>
// // // // // // // //         </div>
// // // // // // // //       )}

// // // // // // // //       {(status === 'ready' || status === 'confirming') && trip && (
// // // // // // // //         <div className="text-center space-y-4">
// // // // // // // //           <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
// // // // // // // //           <p className="text-muted-foreground">جاري استرجاع بيانات الرحلة...</p>
// // // // // // // //         </div>
// // // // // // // //       )}

// // // // // // // //       {status === 'success' && (
// // // // // // // //         <div className="text-center space-y-6 max-w-md animate-in zoom-in duration-500">
// // // // // // // //           <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto" />
// // // // // // // //           <h1 className="text-2xl font-bold text-white">{t('accptReq')} 🎉</h1>
// // // // // // // //           <Button className="w-full" onClick={() => router.push(`/${locale}/history`)}>
// // // // // // // //             {t('gotoReq')}
// // // // // // // //           </Button>
// // // // // // // //         </div>
// // // // // // // //       )}

// // // // // // // //       {status === 'error' && (
// // // // // // // //         <div className="text-center space-y-6 max-w-md animate-in shake duration-500">
// // // // // // // //           <XCircle className="h-20 w-20 text-red-500 mx-auto" />
// // // // // // // //           <h1 className="text-2xl font-bold">تنبيه سيادي</h1>
// // // // // // // //           <p className="text-muted-foreground">{tError(errorCode)}</p>
// // // // // // // //           <Button className="w-full" onClick={() => router.push(`/${locale}/dashboard`)}>
// // // // // // // //             العودة للرئيسية
// // // // // // // //           </Button>
// // // // // // // //         </div>
// // // // // // // //       )}

// // // // // // // //       {trip && isDialogOpen && (
// // // // // // // //         <BookingDialog
// // // // // // // //           isOpen={isDialogOpen}
// // // // // // // //           onOpenChange={(open) => {
// // // // // // // //             setIsDialogOpen(open);
// // // // // // // //             if (!open && status === 'ready') router.push(`/${locale}/dashboard`);
// // // // // // // //           }}
// // // // // // // //           trip={trip}
// // // // // // // //           seatCount={tokenData?.seatCount || 1}
// // // // // // // //           onSubmit={handleConfirmBooking}
// // // // // // // //           isProcessing={status === 'confirming'}
// // // // // // // //         />
// // // // // // // //       )}
// // // // // // // //     </div>
// // // // // // // //   );
// // // // // // // // }




// // // // // // // 'use client';

// // // // // // // import { useEffect, useState } from 'react';
// // // // // // // import { useSearchParams, useRouter } from 'next/navigation';
// // // // // // // import { useFirestore, useUser } from '@/firebase';
// // // // // // // import { doc, getDoc, collection, serverTimestamp, writeBatch, arrayUnion, increment, setDoc } from 'firebase/firestore';
// // // // // // // import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
// // // // // // // import { Button } from '@/components/ui/button';
// // // // // // // import { BookingDialog } from '@/components/booking-dialog';
// // // // // // // import type { Trip, PassengerDetails } from '@/lib/data';
// // // // // // // import { useLocale, useTranslations } from 'next-intl';
// // // // // // // import { sendPush } from "@/lib/send-push";

// // // // // // // /**
// // // // // // //  * @file src/app/[locale]/confirm-booking/page.tsx
// // // // // // //  * @description THE STERILIZED BOOKING CONFIRMATION (REINFORCED - SC-806 V6.0)
// // // // // // //  * [FIX]: لو الـ token فيه bookingId (جاي من وكيل) → يحدّث الـ booking الموجود
// // // // // // //  *        بدل ما يعمل booking جديد — عشان بيانات المسافر تظهر عند الناقل
// // // // // // //  */

// // // // // // // type Status = 'loading' | 'ready' | 'confirming' | 'success' | 'error' | 'expired';

// // // // // // // export default function ConfirmBookingPage() {
// // // // // // //   const searchParams = useSearchParams();
// // // // // // //   const router = useRouter();
// // // // // // //   const firestore = useFirestore();
// // // // // // //   const { user } = useUser();
// // // // // // //   const locale = useLocale();
// // // // // // //   const tError = useTranslations('errorDictionary');
// // // // // // //   const t = useTranslations('ConfirmBooking');
// // // // // // //   const token = searchParams.get('token');

// // // // // // //   const [status, setStatus] = useState<Status>('loading');
// // // // // // //   const [tokenData, setTokenData] = useState<any>(null);
// // // // // // //   const [trip, setTrip] = useState<Trip | null>(null);
// // // // // // //   const [isDialogOpen, setIsDialogOpen] = useState(false);
// // // // // // //   const [errorCode, setErrorCode] = useState('DEFAULT');

// // // // // // //   useEffect(() => {
// // // // // // //     if (!token || !firestore) return;

// // // // // // //     const verifyToken = async () => {
// // // // // // //       try {
// // // // // // //         const tokenRef = doc(firestore, 'booking_tokens', token);
// // // // // // //         const tokenSnap = await getDoc(tokenRef);

// // // // // // //         if (!tokenSnap.exists()) {
// // // // // // //           setStatus('error');
// // // // // // //           setErrorCode('TOKEN_INVALID');
// // // // // // //           return;
// // // // // // //         }

// // // // // // //         const data = tokenSnap.data();

// // // // // // //         if (data.status === 'used') {
// // // // // // //           setStatus('error');
// // // // // // //           setErrorCode('TOKEN_USED');
// // // // // // //           return;
// // // // // // //         }

// // // // // // //         const expiresAt = data.expiresAt?.toDate?.() || new Date(data.expiresAt);
// // // // // // //         if (new Date() > expiresAt) {
// // // // // // //           setStatus('error');
// // // // // // //           setErrorCode('TOKEN_EXPIRED');
// // // // // // //           return;
// // // // // // //         }

// // // // // // //         const tripRef = doc(firestore, 'trips', data.tripId);
// // // // // // //         const tripSnap = await getDoc(tripRef);

// // // // // // //         if (!tripSnap.exists()) {
// // // // // // //           setStatus('error');
// // // // // // //           setErrorCode('TRIP_NOT_FOUND');
// // // // // // //           return;
// // // // // // //         }

// // // // // // //         setTokenData(data);
// // // // // // //         setTrip({ id: tripSnap.id, ...tripSnap.data() } as Trip);
// // // // // // //         setStatus('ready');
// // // // // // //         setIsDialogOpen(true);
// // // // // // //       } catch (err) {
// // // // // // //         console.error('[VerifyToken Error]', err);
// // // // // // //         setStatus('error');
// // // // // // //         setErrorCode('VERIFICATION_FAILED');
// // // // // // //       }
// // // // // // //     };

// // // // // // //     verifyToken();
// // // // // // //   }, [token, firestore]);

// // // // // // //   const handleConfirmBooking = async (passengers: PassengerDetails[]) => {
// // // // // // //     if (!firestore || !tokenData || !trip || !token) throw new Error('MISSING_DATA');
// // // // // // //     if (!user?.uid) throw new Error('AUTH_REQUIRED');

// // // // // // //     setStatus('confirming');

// // // // // // //     try {
// // // // // // //       const batch = writeBatch(firestore);
// // // // // // //       const tokenRef = doc(firestore, 'booking_tokens', token);

// // // // // // //       // ══════════════════════════════════════════════════════════════════
// // // // // // //       // [FIX - SC-806 V6.0]: المسار الجاي من وكيل
// // // // // // //       // لو في bookingId في الـ token → الـ booking موجود (عمله الوكيل)
// // // // // // //       // المسافر بس يكمّل البيانات ويدفع الغربون
// // // // // // //       // ══════════════════════════════════════════════════════════════════
// // // // // // //       if (tokenData.bookingId) {
// // // // // // //         const existingBookingRef = doc(firestore, 'bookings', tokenData.bookingId);

// // // // // // //         // تحديث الـ booking الموجود ببيانات المسافر
// // // // // // //         batch.update(existingBookingRef, {
// // // // // // //           userId: user.uid,
// // // // // // //           passengersDetails: passengers,
// // // // // // //           seats: passengers.length,
// // // // // // //           depositPaid: true,
// // // // // // //           verifiedEmail: tokenData.email || null,
// // // // // // //           status: 'Pending-Carrier-Confirmation', // يفضل نفسه — الناقل هيشوفه
// // // // // // //           updatedAt: serverTimestamp(),
// // // // // // //         });

// // // // // // //         // تعليم التوكن كمستخدم
// // // // // // //         batch.update(tokenRef, { status: 'used', usedAt: serverTimestamp() });

// // // // // // //         // تقليل المقاعد من رحلة الناقل
// // // // // // //         if (tokenData.carrierTripId) {
// // // // // // //           const carrierTripRef = doc(firestore, 'trips', tokenData.carrierTripId);
// // // // // // //           batch.update(carrierTripRef, {
// // // // // // //             availableSeats: increment(-passengers.length),
// // // // // // //             bookingIds: arrayUnion(tokenData.bookingId),
// // // // // // //             updatedAt: serverTimestamp(),
// // // // // // //           });
// // // // // // //         }

// // // // // // //         // ربط المسافر بالحجز في بروفايله
// // // // // // //         const userRef = doc(firestore, 'users', user.uid);
// // // // // // //         // [FIX]: set+merge بدل update — لو الـ user doc مش موجود ميفشلش
// // // // // // //         batch.set(userRef, {
// // // // // // //           activeBookingId: tokenData.bookingId,
// // // // // // //           activeIntentId: null,
// // // // // // //           updatedAt: serverTimestamp(),
// // // // // // //         }, { merge: true });

// // // // // // //         // إشعار للناقل إن المسافر دفع وأكمل البيانات
// // // // // // //         if (trip.carrierId) {
// // // // // // //           const notifRef = doc(collection(doc(firestore, 'users', trip.carrierId), 'notifications'));
// // // // // // //           batch.set(notifRef, {
// // // // // // //             userId: trip.carrierId,
// // // // // // //             title: 'مسافر أكمّل بيانات الحجز ✅',
// // // // // // //             message: `المسافر "${passengers[0]?.name || ''}" أكمل بياناته ودفع الغربون — ${passengers.length} مقعد`,
// // // // // // //             type: 'passenger_deposit_paid',
// // // // // // //             bookingId: tokenData.bookingId,
// // // // // // //             isRead: false,
// // // // // // //             link: `/${locale}/carrier/bookings`,
// // // // // // //             createdAt: serverTimestamp(),
// // // // // // //           });
// // // // // // //         }

// // // // // // //         await batch.commit();

// // // // // // //         // FCM Push للناقل
// // // // // // //         if (trip.carrierId) {
// // // // // // //           await sendPush({
// // // // // // //             userId: trip.carrierId,
// // // // // // //             title: 'مسافر أكمّل بيانات الحجز ✅',
// // // // // // //             body: `${passengers[0]?.name || 'مسافر'} دفع الغربون — ${passengers.length} مقعد`,
// // // // // // //             data: { type: 'passenger_deposit_paid', bookingId: tokenData.bookingId },
// // // // // // //           });
// // // // // // //         }

// // // // // // //         // محاولة الانضمام للـ group chat
// // // // // // //         try {
// // // // // // //           const groupChatRef = doc(firestore, 'chats', trip.id);
// // // // // // //           await setDoc(groupChatRef, { participants: arrayUnion(user.uid) }, { merge: true });
// // // // // // //         } catch (e) {
// // // // // // //           console.warn('[GroupChat] Could not join:', e);
// // // // // // //         }

// // // // // // //       } else {
// // // // // // //         // ══════════════════════════════════════════════════════════════════
// // // // // // //         // المسار العادي: مسافر مباشر بدون وكيل → booking جديد
// // // // // // //         // ══════════════════════════════════════════════════════════════════
// // // // // // //         const bookingRef = doc(collection(firestore, 'bookings'));
// // // // // // //         const notificationRef = trip.carrierId
// // // // // // //           ? doc(collection(doc(firestore, 'users', trip.carrierId), 'notifications'))
// // // // // // //           : null;

// // // // // // //         batch.set(bookingRef, {
// // // // // // //           id: bookingRef.id,
// // // // // // //           tripId: trip.id,
// // // // // // //           carrierTripId: tokenData.carrierTripId || null,
// // // // // // //           userId: user.uid,
// // // // // // //           carrierId: trip.carrierId || tokenData.carrierId,
// // // // // // //           seats: passengers.length,
// // // // // // //           passengersDetails: passengers,
// // // // // // //           status: 'Pending-Carrier-Confirmation',
// // // // // // //           totalPrice: (tokenData.price || trip.price || 0) * passengers.length,
// // // // // // //           currency: tokenData.currency || trip.currency || 'JOD',
// // // // // // //           verifiedEmail: tokenData.email || null,
// // // // // // //           bookedByAgent: false,
// // // // // // //           createdAt: serverTimestamp(),
// // // // // // //           updatedAt: serverTimestamp(),
// // // // // // //         });

// // // // // // //         // تعليم التوكن كمستخدم
// // // // // // //         batch.update(tokenRef, { status: 'used', usedAt: serverTimestamp() });

// // // // // // //         // تقليل المقاعد
// // // // // // //         if (tokenData.carrierTripId) {
// // // // // // //           const carrierTripRef = doc(firestore, 'trips', tokenData.carrierTripId);
// // // // // // //           batch.update(carrierTripRef, {
// // // // // // //             availableSeats: increment(-passengers.length),
// // // // // // //             bookingIds: arrayUnion(bookingRef.id),
// // // // // // //             updatedAt: serverTimestamp(),
// // // // // // //           });
// // // // // // //         }

// // // // // // //         // ربط المسافر بالحجز
// // // // // // //         const userRef = doc(firestore, 'users', user.uid);
// // // // // // //         // [FIX]: set+merge بدل update — لو الـ user doc مش موجود ميفشلش
// // // // // // //         batch.set(userRef, {
// // // // // // //           activeBookingId: bookingRef.id,
// // // // // // //           activeIntentId: null,
// // // // // // //           updatedAt: serverTimestamp(),
// // // // // // //         }, { merge: true });

// // // // // // //         // إشعار للناقل
// // // // // // //         if (trip.carrierId && notificationRef) {
// // // // // // //           batch.set(notificationRef, {
// // // // // // //             userId: trip.carrierId,
// // // // // // //             title: 'طلب حجز جديد 🎫',
// // // // // // //             message: `مسافر يطلب حجز ${passengers.length} مقعد من ${trip.origin} إلى ${trip.destination}`,
// // // // // // //             type: 'new_booking_request',
// // // // // // //             isRead: false,
// // // // // // //             link: `/${locale}/carrier/bookings`,
// // // // // // //             createdAt: serverTimestamp(),
// // // // // // //           });
// // // // // // //         }

// // // // // // //         await batch.commit();

// // // // // // //         // FCM Push للناقل
// // // // // // //         if (trip.carrierId) {
// // // // // // //           await sendPush({
// // // // // // //             userId: trip.carrierId,
// // // // // // //             title: 'طلب حجز جديد 🎫',
// // // // // // //             body: `مسافر يطلب حجز ${passengers.length} مقعد من ${trip.origin} إلى ${trip.destination}`,
// // // // // // //             data: { type: 'new_booking_request' },
// // // // // // //           });
// // // // // // //         }

// // // // // // //         // محاولة الانضمام للـ group chat
// // // // // // //         try {
// // // // // // //           const groupChatRef = doc(firestore, 'chats', trip.id);
// // // // // // //           await setDoc(groupChatRef, { participants: arrayUnion(user.uid) }, { merge: true });
// // // // // // //         } catch (e) {
// // // // // // //           console.warn('[GroupChat] Could not join:', e);
// // // // // // //         }
// // // // // // //       }

// // // // // // //       setIsDialogOpen(false);
// // // // // // //       setStatus('success');

// // // // // // //     } catch (err) {
// // // // // // //       console.error('[ConfirmBooking Error]', err);
// // // // // // //       setStatus('error');
// // // // // // //       setErrorCode('OPERATION_FAILED');
// // // // // // //       throw err;
// // // // // // //     }
// // // // // // //   };

// // // // // // //   return (
// // // // // // //     <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background" dir="rtl">

// // // // // // //       {status === 'loading' && (
// // // // // // //         <div className="text-center space-y-4">
// // // // // // //           <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
// // // // // // //           <p className="text-muted-foreground">جاري فحص الختم الرقمي...</p>
// // // // // // //         </div>
// // // // // // //       )}

// // // // // // //       {(status === 'ready' || status === 'confirming') && trip && (
// // // // // // //         <div className="text-center space-y-4">
// // // // // // //           <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
// // // // // // //           <p className="text-muted-foreground">جاري استرجاع بيانات الرحلة...</p>
// // // // // // //         </div>
// // // // // // //       )}

// // // // // // //       {status === 'success' && (
// // // // // // //         <div className="text-center space-y-6 max-w-md animate-in zoom-in duration-500">
// // // // // // //           <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto" />
// // // // // // //           <h1 className="text-2xl font-bold text-white">{t('accptReq')} 🎉</h1>
// // // // // // //           <Button className="w-full" onClick={() => router.push(`/${locale}/history`)}>
// // // // // // //             {t('gotoReq')}
// // // // // // //           </Button>
// // // // // // //         </div>
// // // // // // //       )}

// // // // // // //       {status === 'error' && (
// // // // // // //         <div className="text-center space-y-6 max-w-md animate-in shake duration-500">
// // // // // // //           <XCircle className="h-20 w-20 text-red-500 mx-auto" />
// // // // // // //           <h1 className="text-2xl font-bold">تنبيه سيادي</h1>
// // // // // // //           <p className="text-muted-foreground">{tError(errorCode)}</p>
// // // // // // //           <Button className="w-full" onClick={() => router.push(`/${locale}/dashboard`)}>
// // // // // // //             العودة للرئيسية
// // // // // // //           </Button>
// // // // // // //         </div>
// // // // // // //       )}

// // // // // // //       {trip && isDialogOpen && (
// // // // // // //         <BookingDialog
// // // // // // //           isOpen={isDialogOpen}
// // // // // // //           onOpenChange={(open) => {
// // // // // // //             setIsDialogOpen(open);
// // // // // // //             if (!open && status === 'ready') router.push(`/${locale}/dashboard`);
// // // // // // //           }}
// // // // // // //           trip={trip}
// // // // // // //           seatCount={tokenData?.seatCount || 1}
// // // // // // //           onSubmit={handleConfirmBooking}
// // // // // // //           isProcessing={status === 'confirming'}
// // // // // // //         />
// // // // // // //       )}
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // }


// // // // // // 'use client';

// // // // // // import { useEffect, useState } from 'react';
// // // // // // import { useSearchParams, useRouter } from 'next/navigation';
// // // // // // import { useFirestore, useUser } from '@/firebase';
// // // // // // import { doc, getDoc, collection, serverTimestamp, writeBatch, arrayUnion, increment, setDoc } from 'firebase/firestore';
// // // // // // import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
// // // // // // import { Button } from '@/components/ui/button';
// // // // // // import { BookingDialog } from '@/components/booking-dialog';
// // // // // // import type { Trip, PassengerDetails } from '@/lib/data';
// // // // // // import { useLocale, useTranslations } from 'next-intl';
// // // // // // import { sendPush } from "@/lib/send-push";

// // // // // // /**
// // // // // //  * @file src/app/[locale]/confirm-booking/page.tsx
// // // // // //  * @description THE STERILIZED BOOKING CONFIRMATION (REINFORCED - SC-806 V6.0)
// // // // // //  * [FIX]: لو الـ token فيه bookingId (جاي من وكيل) → يحدّث الـ booking الموجود
// // // // // //  *        بدل ما يعمل booking جديد — عشان بيانات المسافر تظهر عند الناقل
// // // // // //  */

// // // // // // type Status = 'loading' | 'ready' | 'confirming' | 'success' | 'error' | 'expired';

// // // // // // export default function ConfirmBookingPage() {
// // // // // //   const searchParams = useSearchParams();
// // // // // //   const router = useRouter();
// // // // // //   const firestore = useFirestore();
// // // // // //   const { user } = useUser();
// // // // // //   const locale = useLocale();
// // // // // //   const tError = useTranslations('errorDictionary');
// // // // // //   const t = useTranslations('ConfirmBooking');
// // // // // //   const token = searchParams.get('token');

// // // // // //   const [status, setStatus] = useState<Status>('loading');
// // // // // //   const [tokenData, setTokenData] = useState<any>(null);
// // // // // //   const [trip, setTrip] = useState<Trip | null>(null);
// // // // // //   const [isDialogOpen, setIsDialogOpen] = useState(false);
// // // // // //   const [errorCode, setErrorCode] = useState('DEFAULT');

// // // // // //   useEffect(() => {
// // // // // //     if (!token || !firestore) return;

// // // // // //     const verifyToken = async () => {
// // // // // //       try {
// // // // // //         const tokenRef = doc(firestore, 'booking_tokens', token);
// // // // // //         const tokenSnap = await getDoc(tokenRef);

// // // // // //         if (!tokenSnap.exists()) {
// // // // // //           setStatus('error');
// // // // // //           setErrorCode('TOKEN_INVALID');
// // // // // //           return;
// // // // // //         }

// // // // // //         const data = tokenSnap.data();

// // // // // //         if (data.status === 'used') {
// // // // // //           setStatus('error');
// // // // // //           setErrorCode('TOKEN_USED');
// // // // // //           return;
// // // // // //         }

// // // // // //         const expiresAt = data.expiresAt?.toDate?.() || new Date(data.expiresAt);
// // // // // //         if (new Date() > expiresAt) {
// // // // // //           setStatus('error');
// // // // // //           setErrorCode('TOKEN_EXPIRED');
// // // // // //           return;
// // // // // //         }

// // // // // //         const tripRef = doc(firestore, 'trips', data.tripId);
// // // // // //         const tripSnap = await getDoc(tripRef);

// // // // // //         if (!tripSnap.exists()) {
// // // // // //           setStatus('error');
// // // // // //           setErrorCode('TRIP_NOT_FOUND');
// // // // // //           return;
// // // // // //         }

// // // // // //         setTokenData(data);
// // // // // //         setTrip({ id: tripSnap.id, ...tripSnap.data() } as Trip);
// // // // // //         setStatus('ready');
// // // // // //         setIsDialogOpen(true);
// // // // // //       } catch (err) {
// // // // // //         console.error('[VerifyToken Error]', err);
// // // // // //         setStatus('error');
// // // // // //         setErrorCode('VERIFICATION_FAILED');
// // // // // //       }
// // // // // //     };

// // // // // //     verifyToken();
// // // // // //   }, [token, firestore]);

// // // // // //   const handleConfirmBooking = async (passengers: PassengerDetails[]) => {
// // // // // //     if (!firestore || !tokenData || !trip || !token) throw new Error('MISSING_DATA');
// // // // // //     if (!user?.uid) throw new Error('AUTH_REQUIRED');

// // // // // //     setStatus('confirming');

// // // // // //     try {
// // // // // //       const batch = writeBatch(firestore);
// // // // // //       const tokenRef = doc(firestore, 'booking_tokens', token);

// // // // // //       // ══════════════════════════════════════════════════════════════════
// // // // // //       // [FIX - SC-806 V6.0]: المسار الجاي من وكيل
// // // // // //       // لو في bookingId في الـ token → الـ booking موجود (عمله الوكيل)
// // // // // //       // المسافر بس يكمّل البيانات ويدفع الغربون
// // // // // //       // ══════════════════════════════════════════════════════════════════
// // // // // //       if (tokenData.bookingId) {
// // // // // //         const existingBookingRef = doc(firestore, 'bookings', tokenData.bookingId);

// // // // // //         // تحديث الـ booking الموجود ببيانات المسافر
// // // // // //         batch.update(existingBookingRef, {
// // // // // //           userId: user.uid,
// // // // // //           passengersDetails: passengers,
// // // // // //           seats: passengers.length,
// // // // // //           depositPaid: true,
// // // // // //           verifiedEmail: tokenData.email || null,
// // // // // //           status: 'Pending-Carrier-Confirmation', // يفضل نفسه — الناقل هيشوفه
// // // // // //           updatedAt: serverTimestamp(),
// // // // // //         });

// // // // // //         // تعليم التوكن كمستخدم
// // // // // //         batch.update(tokenRef, { status: 'used', usedAt: serverTimestamp() });

// // // // // //         // ✅ [FIX]: لا نخصم المقاعد هنا — الخصم يكون بعد موافقة الناقل فقط
// // // // // //         // availableSeats بتتخصم في verifyBookingReceipt (use-trip-actions) بعد تأكيد الناقل
// // // // // //         if (tokenData.carrierTripId) {
// // // // // //           const carrierTripRef = doc(firestore, 'trips', tokenData.carrierTripId);
// // // // // //           batch.update(carrierTripRef, {
// // // // // //             bookingIds: arrayUnion(tokenData.bookingId),
// // // // // //             updatedAt: serverTimestamp(),
// // // // // //           });
// // // // // //         }

// // // // // //         // ربط المسافر بالحجز في بروفايله
// // // // // //         const userRef = doc(firestore, 'users', user.uid);
// // // // // //         // [FIX]: set+merge بدل update — لو الـ user doc مش موجود ميفشلش
// // // // // //         batch.set(userRef, {
// // // // // //           activeBookingId: tokenData.bookingId,
// // // // // //           activeIntentId: null,
// // // // // //           updatedAt: serverTimestamp(),
// // // // // //         }, { merge: true });

// // // // // //         // إشعار للناقل إن المسافر دفع وأكمل البيانات
// // // // // //         if (trip.carrierId) {
// // // // // //           const notifRef = doc(collection(doc(firestore, 'users', trip.carrierId), 'notifications'));
// // // // // //           batch.set(notifRef, {
// // // // // //             userId: trip.carrierId,
// // // // // //             title: 'مسافر أكمّل بيانات الحجز ✅',
// // // // // //             message: `المسافر "${passengers[0]?.name || ''}" أكمل بياناته ودفع الغربون — ${passengers.length} مقعد`,
// // // // // //             type: 'passenger_deposit_paid',
// // // // // //             bookingId: tokenData.bookingId,
// // // // // //             isRead: false,
// // // // // //             link: `/${locale}/carrier/bookings`,
// // // // // //             createdAt: serverTimestamp(),
// // // // // //           });
// // // // // //         }

// // // // // //         await batch.commit();

// // // // // //         // FCM Push للناقل
// // // // // //         if (trip.carrierId) {
// // // // // //           await sendPush({
// // // // // //             userId: trip.carrierId,
// // // // // //             title: 'مسافر أكمّل بيانات الحجز ✅',
// // // // // //             body: `${passengers[0]?.name || 'مسافر'} دفع الغربون — ${passengers.length} مقعد`,
// // // // // //             data: { type: 'passenger_deposit_paid', bookingId: tokenData.bookingId },
// // // // // //           });
// // // // // //         }

// // // // // //         // محاولة الانضمام للـ group chat
// // // // // //         try {
// // // // // //           const groupChatRef = doc(firestore, 'chats', trip.id);
// // // // // //           await setDoc(groupChatRef, { participants: arrayUnion(user.uid) }, { merge: true });
// // // // // //         } catch (e) {
// // // // // //           console.warn('[GroupChat] Could not join:', e);
// // // // // //         }

// // // // // //       } else {
// // // // // //         // ══════════════════════════════════════════════════════════════════
// // // // // //         // المسار العادي: مسافر مباشر بدون وكيل → booking جديد
// // // // // //         // ══════════════════════════════════════════════════════════════════
// // // // // //         const bookingRef = doc(collection(firestore, 'bookings'));
// // // // // //         const notificationRef = trip.carrierId
// // // // // //           ? doc(collection(doc(firestore, 'users', trip.carrierId), 'notifications'))
// // // // // //           : null;

// // // // // //         batch.set(bookingRef, {
// // // // // //           id: bookingRef.id,
// // // // // //           tripId: trip.id,
// // // // // //           carrierTripId: tokenData.carrierTripId || null,
// // // // // //           userId: user.uid,
// // // // // //           carrierId: trip.carrierId || tokenData.carrierId,
// // // // // //           seats: passengers.length,
// // // // // //           passengersDetails: passengers,
// // // // // //           status: 'Pending-Carrier-Confirmation',
// // // // // //           totalPrice: (tokenData.price || trip.price || 0) * passengers.length,
// // // // // //           currency: tokenData.currency || trip.currency || 'JOD',
// // // // // //           verifiedEmail: tokenData.email || null,
// // // // // //           bookedByAgent: false,
// // // // // //           createdAt: serverTimestamp(),
// // // // // //           updatedAt: serverTimestamp(),
// // // // // //         });

// // // // // //         // تعليم التوكن كمستخدم
// // // // // //         batch.update(tokenRef, { status: 'used', usedAt: serverTimestamp() });

// // // // // //         // ✅ [FIX]: لا نخصم المقاعد هنا — الخصم بعد موافقة الناقل فقط
// // // // // //         if (tokenData.carrierTripId) {
// // // // // //           const carrierTripRef = doc(firestore, 'trips', tokenData.carrierTripId);
// // // // // //           batch.update(carrierTripRef, {
// // // // // //             bookingIds: arrayUnion(bookingRef.id),
// // // // // //             updatedAt: serverTimestamp(),
// // // // // //           });
// // // // // //         }

// // // // // //         // ربط المسافر بالحجز
// // // // // //         const userRef = doc(firestore, 'users', user.uid);
// // // // // //         // [FIX]: set+merge بدل update — لو الـ user doc مش موجود ميفشلش
// // // // // //         batch.set(userRef, {
// // // // // //           activeBookingId: bookingRef.id,
// // // // // //           activeIntentId: null,
// // // // // //           updatedAt: serverTimestamp(),
// // // // // //         }, { merge: true });

// // // // // //         // إشعار للناقل
// // // // // //         if (trip.carrierId && notificationRef) {
// // // // // //           batch.set(notificationRef, {
// // // // // //             userId: trip.carrierId,
// // // // // //             title: 'طلب حجز جديد 🎫',
// // // // // //             message: `مسافر يطلب حجز ${passengers.length} مقعد من ${trip.origin} إلى ${trip.destination}`,
// // // // // //             type: 'new_booking_request',
// // // // // //             isRead: false,
// // // // // //             link: `/${locale}/carrier/bookings`,
// // // // // //             createdAt: serverTimestamp(),
// // // // // //           });
// // // // // //         }

// // // // // //         await batch.commit();

// // // // // //         // FCM Push للناقل
// // // // // //         if (trip.carrierId) {
// // // // // //           await sendPush({
// // // // // //             userId: trip.carrierId,
// // // // // //             title: 'طلب حجز جديد 🎫',
// // // // // //             body: `مسافر يطلب حجز ${passengers.length} مقعد من ${trip.origin} إلى ${trip.destination}`,
// // // // // //             data: { type: 'new_booking_request' },
// // // // // //           });
// // // // // //         }

// // // // // //         // محاولة الانضمام للـ group chat
// // // // // //         try {
// // // // // //           const groupChatRef = doc(firestore, 'chats', trip.id);
// // // // // //           await setDoc(groupChatRef, { participants: arrayUnion(user.uid) }, { merge: true });
// // // // // //         } catch (e) {
// // // // // //           console.warn('[GroupChat] Could not join:', e);
// // // // // //         }
// // // // // //       }

// // // // // //       setIsDialogOpen(false);
// // // // // //       setStatus('success');

// // // // // //     } catch (err) {
// // // // // //       console.error('[ConfirmBooking Error]', err);
// // // // // //       setStatus('error');
// // // // // //       setErrorCode('OPERATION_FAILED');
// // // // // //       throw err;
// // // // // //     }
// // // // // //   };

// // // // // //   return (
// // // // // //     <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background" dir="rtl">

// // // // // //       {status === 'loading' && (
// // // // // //         <div className="text-center space-y-4">
// // // // // //           <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
// // // // // //           <p className="text-muted-foreground">جاري فحص الختم الرقمي...</p>
// // // // // //         </div>
// // // // // //       )}

// // // // // //       {(status === 'ready' || status === 'confirming') && trip && (
// // // // // //         <div className="text-center space-y-4">
// // // // // //           <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
// // // // // //           <p className="text-muted-foreground">جاري استرجاع بيانات الرحلة...</p>
// // // // // //         </div>
// // // // // //       )}

// // // // // //       {status === 'success' && (
// // // // // //         <div className="text-center space-y-6 max-w-md animate-in zoom-in duration-500">
// // // // // //           <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto" />
// // // // // //           <h1 className="text-2xl font-bold text-white">{t('accptReq')} 🎉</h1>
// // // // // //           <Button className="w-full" onClick={() => router.push(`/${locale}/history`)}>
// // // // // //             {t('gotoReq')}
// // // // // //           </Button>
// // // // // //         </div>
// // // // // //       )}

// // // // // //       {status === 'error' && (
// // // // // //         <div className="text-center space-y-6 max-w-md animate-in shake duration-500">
// // // // // //           <XCircle className="h-20 w-20 text-red-500 mx-auto" />
// // // // // //           <h1 className="text-2xl font-bold">تنبيه سيادي</h1>
// // // // // //           <p className="text-muted-foreground">{tError(errorCode)}</p>
// // // // // //           <Button className="w-full" onClick={() => router.push(`/${locale}/dashboard`)}>
// // // // // //             العودة للرئيسية
// // // // // //           </Button>
// // // // // //         </div>
// // // // // //       )}

// // // // // //       {trip && isDialogOpen && (
// // // // // //         <BookingDialog
// // // // // //           isOpen={isDialogOpen}
// // // // // //           onOpenChange={(open) => {
// // // // // //             setIsDialogOpen(open);
// // // // // //             if (!open && status === 'ready') router.push(`/${locale}/dashboard`);
// // // // // //           }}
// // // // // //           trip={trip}
// // // // // //           seatCount={tokenData?.seatCount || 1}
// // // // // //           onSubmit={handleConfirmBooking}
// // // // // //           isProcessing={status === 'confirming'}
// // // // // //         />
// // // // // //       )}
// // // // // //     </div>
// // // // // //   );
// // // // // // }

// // // // // 'use client';

// // // // // import { useEffect, useState } from 'react';
// // // // // import { useSearchParams, useRouter } from 'next/navigation';
// // // // // import { useFirestore, useUser } from '@/firebase';
// // // // // import { doc, getDoc, collection, serverTimestamp, writeBatch, arrayUnion, increment, setDoc } from 'firebase/firestore';
// // // // // import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
// // // // // import { Button } from '@/components/ui/button';
// // // // // import { BookingDialog } from '@/components/booking-dialog';
// // // // // import type { Trip, PassengerDetails } from '@/lib/data';
// // // // // import { useLocale, useTranslations } from 'next-intl';
// // // // // import { sendPush } from "@/lib/send-push";

// // // // // /**
// // // // //  * @file src/app/[locale]/confirm-booking/page.tsx
// // // // //  * @description THE STERILIZED BOOKING CONFIRMATION (REINFORCED - SC-806 V6.0)
// // // // //  * [FIX]: لو الـ token فيه bookingId (جاي من وكيل) → يحدّث الـ booking الموجود
// // // // //  *        بدل ما يعمل booking جديد — عشان بيانات المسافر تظهر عند الناقل
// // // // //  */

// // // // // type Status = 'loading' | 'ready' | 'confirming' | 'success' | 'error' | 'expired';

// // // // // export default function ConfirmBookingPage() {
// // // // //   const searchParams = useSearchParams();
// // // // //   const router = useRouter();
// // // // //   const firestore = useFirestore();
// // // // //   const { user } = useUser();
// // // // //   const locale = useLocale();
// // // // //   const tError = useTranslations('errorDictionary');
// // // // //   const t = useTranslations('ConfirmBooking');
// // // // //   const token = searchParams.get('token');

// // // // //   const [status, setStatus] = useState<Status>('loading');
// // // // //   const [tokenData, setTokenData] = useState<any>(null);
// // // // //   const [trip, setTrip] = useState<Trip | null>(null);
// // // // //   const [isDialogOpen, setIsDialogOpen] = useState(false);
// // // // //   const [errorCode, setErrorCode] = useState('DEFAULT');

// // // // //   useEffect(() => {
// // // // //     if (!token || !firestore) return;

// // // // //     const verifyToken = async () => {
// // // // //       try {
// // // // //         const tokenRef = doc(firestore, 'booking_tokens', token);
// // // // //         const tokenSnap = await getDoc(tokenRef);

// // // // //         if (!tokenSnap.exists()) {
// // // // //           setStatus('error');
// // // // //           setErrorCode('TOKEN_INVALID');
// // // // //           return;
// // // // //         }

// // // // //         const data = tokenSnap.data();

// // // // //         if (data.status === 'used') {
// // // // //           setStatus('error');
// // // // //           setErrorCode('TOKEN_USED');
// // // // //           return;
// // // // //         }

// // // // //         const expiresAt = data.expiresAt?.toDate?.() || new Date(data.expiresAt);
// // // // //         if (new Date() > expiresAt) {
// // // // //           setStatus('error');
// // // // //           setErrorCode('TOKEN_EXPIRED');
// // // // //           return;
// // // // //         }

// // // // //         const tripRef = doc(firestore, 'trips', data.tripId);
// // // // //         const tripSnap = await getDoc(tripRef);

// // // // //         if (!tripSnap.exists()) {
// // // // //           setStatus('error');
// // // // //           setErrorCode('TRIP_NOT_FOUND');
// // // // //           return;
// // // // //         }

// // // // //         setTokenData(data);
// // // // //         setTrip({ id: tripSnap.id, ...tripSnap.data() } as Trip);
// // // // //         setStatus('ready');
// // // // //         setIsDialogOpen(true);
// // // // //       } catch (err) {
// // // // //         console.error('[VerifyToken Error]', err);
// // // // //         setStatus('error');
// // // // //         setErrorCode('VERIFICATION_FAILED');
// // // // //       }
// // // // //     };

// // // // //     verifyToken();
// // // // //   }, [token, firestore]);

// // // // //   const handleConfirmBooking = async (passengers: PassengerDetails[]) => {
// // // // //     if (!firestore || !tokenData || !trip || !token) throw new Error('MISSING_DATA');
// // // // //     if (!user?.uid) throw new Error('AUTH_REQUIRED');

// // // // //     setStatus('confirming');

// // // // //     try {
// // // // //       const batch = writeBatch(firestore);
// // // // //       const tokenRef = doc(firestore, 'booking_tokens', token);

// // // // //       // ══════════════════════════════════════════════════════════════════
// // // // //       // [FIX - SC-806 V6.0]: المسار الجاي من وكيل
// // // // //       // لو في bookingId في الـ token → الـ booking موجود (عمله الوكيل)
// // // // //       // المسافر بس يكمّل البيانات ويدفع الغربون
// // // // //       // ══════════════════════════════════════════════════════════════════
// // // // //       if (tokenData.bookingId) {
// // // // //         const existingBookingRef = doc(firestore, 'bookings', tokenData.bookingId);

// // // // //         // تحديث الـ booking الموجود ببيانات المسافر
// // // // //         batch.update(existingBookingRef, {
// // // // //           userId: user.uid,
// // // // //           passengersDetails: passengers,
// // // // //           seats: passengers.length,
// // // // //           depositPaid: true,
// // // // //           verifiedEmail: tokenData.email || null,
// // // // //           status: 'Pending-Carrier-Confirmation', // يفضل نفسه — الناقل هيشوفه
// // // // //           updatedAt: serverTimestamp(),
// // // // //         });

// // // // //         // تعليم التوكن كمستخدم
// // // // //         batch.update(tokenRef, { status: 'used', usedAt: serverTimestamp() });

// // // // //         // ✅ [FIX]: لا نخصم المقاعد هنا — الخصم يكون بعد موافقة الناقل فقط
// // // // //         // availableSeats بتتخصم في verifyBookingReceipt (use-trip-actions) بعد تأكيد الناقل
// // // // //         if (tokenData.carrierTripId) {
// // // // //           const carrierTripRef = doc(firestore, 'trips', tokenData.carrierTripId);
// // // // //           batch.update(carrierTripRef, {
// // // // //             bookingIds: arrayUnion(tokenData.bookingId),
// // // // //             updatedAt: serverTimestamp(),
// // // // //           });
// // // // //         }

// // // // //         // ربط المسافر بالحجز في بروفايله
// // // // //         const userRef = doc(firestore, 'users', user.uid);
// // // // //         // [FIX]: set+merge بدل update — لو الـ user doc مش موجود ميفشلش
// // // // //         batch.set(userRef, {
// // // // //           activeBookingId: tokenData.bookingId,
// // // // //           activeIntentId: null,
// // // // //           updatedAt: serverTimestamp(),
// // // // //         }, { merge: true });

// // // // //         // إشعار للناقل إن المسافر دفع وأكمل البيانات
// // // // //         if (trip.carrierId) {
// // // // //           const notifRef = doc(collection(doc(firestore, 'users', trip.carrierId), 'notifications'));
// // // // //           batch.set(notifRef, {
// // // // //             userId: trip.carrierId,
// // // // //             title: 'مسافر أكمّل بيانات الحجز ✅',
// // // // //             message: `المسافر "${passengers[0]?.name || ''}" أكمل بياناته ودفع الغربون — ${passengers.length} مقعد`,
// // // // //             type: 'passenger_deposit_paid',
// // // // //             bookingId: tokenData.bookingId,
// // // // //             isRead: false,
// // // // //             link: `/${locale}/carrier/bookings`,
// // // // //             createdAt: serverTimestamp(),
// // // // //           });
// // // // //         }

// // // // //         await batch.commit();

// // // // //         // FCM Push للناقل
// // // // //         if (trip.carrierId) {
// // // // //           await sendPush({
// // // // //             userId: trip.carrierId,
// // // // //             title: 'مسافر أكمّل بيانات الحجز ✅',
// // // // //             body: `${passengers[0]?.name || 'مسافر'} دفع الغربون — ${passengers.length} مقعد`,
// // // // //             data: { type: 'passenger_deposit_paid', bookingId: tokenData.bookingId },
// // // // //           });
// // // // //         }

// // // // //         // محاولة الانضمام للـ group chat
// // // // //         try {
// // // // //           const groupChatRef = doc(firestore, 'chats', trip.id);
// // // // //           await setDoc(groupChatRef, { participants: arrayUnion(user.uid) }, { merge: true });
// // // // //         } catch (e) {
// // // // //           console.warn('[GroupChat] Could not join:', e);
// // // // //         }

// // // // //       } else {
// // // // //         // ══════════════════════════════════════════════════════════════════
// // // // //         // المسار العادي: مسافر مباشر بدون وكيل → booking جديد
// // // // //         // ══════════════════════════════════════════════════════════════════
// // // // //         const bookingRef = doc(collection(firestore, 'bookings'));
// // // // //         const notificationRef = trip.carrierId
// // // // //           ? doc(collection(doc(firestore, 'users', trip.carrierId), 'notifications'))
// // // // //           : null;

// // // // //         batch.set(bookingRef, {
// // // // //           id: bookingRef.id,
// // // // //           tripId: trip.id,
// // // // //           carrierTripId: null, // سيُعبأ بعد إنشاء الناقل للرحلة
// // // // //           userId: user.uid,
// // // // //           carrierId: trip.carrierId || tokenData.carrierId,
// // // // //           seats: passengers.length,
// // // // //           passengersDetails: passengers,
// // // // //           status: 'Traveler-Accepted-Awaiting-Carrier',
// // // // //           totalPrice: (tokenData.price || trip.price || 0) * passengers.length,
// // // // //           currency: tokenData.currency || trip.currency || 'JOD',
// // // // //           verifiedEmail: tokenData.email || null,
// // // // //           bookedByAgent: false,
// // // // //           // بيانات الطلب الأصلي للناقل
// // // // //           requestOrigin: trip.origin,
// // // // //           requestDestination: trip.destination,
// // // // //           requestDepartureDate: trip.departureDate,
// // // // //           requestPassengers: passengers.length,
// // // // //           createdAt: serverTimestamp(),
// // // // //           updatedAt: serverTimestamp(),
// // // // //         });

// // // // //         // تعليم التوكن كمستخدم
// // // // //         batch.update(tokenRef, { status: 'used', usedAt: serverTimestamp() });

// // // // //         // ✅ [FIX]: لا نخصم المقاعد هنا — الخصم بعد موافقة الناقل فقط
// // // // //         if (tokenData.carrierTripId) {
// // // // //           const carrierTripRef = doc(firestore, 'trips', tokenData.carrierTripId);
// // // // //           batch.update(carrierTripRef, {
// // // // //             bookingIds: arrayUnion(bookingRef.id),
// // // // //             updatedAt: serverTimestamp(),
// // // // //           });
// // // // //         }

// // // // //         // ربط المسافر بالحجز
// // // // //         const userRef = doc(firestore, 'users', user.uid);
// // // // //         // [FIX]: set+merge بدل update — لو الـ user doc مش موجود ميفشلش
// // // // //         batch.set(userRef, {
// // // // //           activeBookingId: bookingRef.id,
// // // // //           activeIntentId: null,
// // // // //           updatedAt: serverTimestamp(),
// // // // //         }, { merge: true });

// // // // //         // تحديث طلب المسافر بالحالة الجديدة
// // // // //         const tripUpdateRef = doc(firestore, 'trips', trip.id);
// // // // //         batch.update(tripUpdateRef, {
// // // // //           status: 'Traveler-Accepted-Awaiting-Carrier',
// // // // //           pendingBookingId: bookingRef.id,
// // // // //           updatedAt: serverTimestamp(),
// // // // //         });

// // // // //         // إشعار للناقل إنه يقبل ويُنشئ الرحلة
// // // // //         if (trip.carrierId && notificationRef) {
// // // // //           batch.set(notificationRef, {
// // // // //             userId: trip.carrierId,
// // // // //             title: 'المسافر وافق — في انتظار قبولك 🎉',
// // // // //             message: `المسافر \"${passengers[0]?.name || ''}\" وافق على عرضك — اضغط لقبول الحجز وإنشاء الرحلة`,
// // // // //             type: 'traveler_accepted_offer',
// // // // //             bookingId: bookingRef.id,
// // // // //             isRead: false,
// // // // //             link: `/${locale}/carrier/bookings`,
// // // // //             createdAt: serverTimestamp(),
// // // // //           });
// // // // //         }

// // // // //         await batch.commit();

// // // // //         // FCM Push للناقل
// // // // //         if (trip.carrierId) {
// // // // //           await sendPush({
// // // // //             userId: trip.carrierId,
// // // // //             title: 'المسافر وافق على عرضك! 🎉',
// // // // //             body: `${passengers[0]?.name || 'مسافر'} وافق — افتح التطبيق وأنشئ الرحلة`,
// // // // //             data: { type: 'traveler_accepted_offer' },
// // // // //           });
// // // // //         }

// // // // //         // محاولة الانضمام للـ group chat
// // // // //         try {
// // // // //           const groupChatRef = doc(firestore, 'chats', trip.id);
// // // // //           await setDoc(groupChatRef, { participants: arrayUnion(user.uid) }, { merge: true });
// // // // //         } catch (e) {
// // // // //           console.warn('[GroupChat] Could not join:', e);
// // // // //         }
// // // // //       }

// // // // //       setIsDialogOpen(false);
// // // // //       setStatus('success');

// // // // //     } catch (err) {
// // // // //       console.error('[ConfirmBooking Error]', err);
// // // // //       setStatus('error');
// // // // //       setErrorCode('OPERATION_FAILED');
// // // // //       throw err;
// // // // //     }
// // // // //   };

// // // // //   return (
// // // // //     <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background" dir="rtl">

// // // // //       {status === 'loading' && (
// // // // //         <div className="text-center space-y-4">
// // // // //           <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
// // // // //           <p className="text-muted-foreground">جاري فحص الختم الرقمي...</p>
// // // // //         </div>
// // // // //       )}

// // // // //       {(status === 'ready' || status === 'confirming') && trip && (
// // // // //         <div className="text-center space-y-4">
// // // // //           <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
// // // // //           <p className="text-muted-foreground">جاري استرجاع بيانات الرحلة...</p>
// // // // //         </div>
// // // // //       )}

// // // // //       {status === 'success' && (
// // // // //         <div className="text-center space-y-6 max-w-md animate-in zoom-in duration-500">
// // // // //           <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto" />
// // // // //           <h1 className="text-2xl font-bold text-white">{t('accptReq')} 🎉</h1>
// // // // //           <Button className="w-full" onClick={() => router.push(`/${locale}/history`)}>
// // // // //             {t('gotoReq')}
// // // // //           </Button>
// // // // //         </div>
// // // // //       )}

// // // // //       {status === 'error' && (
// // // // //         <div className="text-center space-y-6 max-w-md animate-in shake duration-500">
// // // // //           <XCircle className="h-20 w-20 text-red-500 mx-auto" />
// // // // //           <h1 className="text-2xl font-bold">تنبيه سيادي</h1>
// // // // //           <p className="text-muted-foreground">{tError(errorCode)}</p>
// // // // //           <Button className="w-full" onClick={() => router.push(`/${locale}/dashboard`)}>
// // // // //             العودة للرئيسية
// // // // //           </Button>
// // // // //         </div>
// // // // //       )}

// // // // //       {trip && isDialogOpen && (
// // // // //         <BookingDialog
// // // // //           isOpen={isDialogOpen}
// // // // //           onOpenChange={(open) => {
// // // // //             setIsDialogOpen(open);
// // // // //             if (!open && status === 'ready') router.push(`/${locale}/dashboard`);
// // // // //           }}
// // // // //           trip={trip}
// // // // //           seatCount={tokenData?.seatCount || 1}
// // // // //           onSubmit={handleConfirmBooking}
// // // // //           isProcessing={status === 'confirming'}
// // // // //         />
// // // // //       )}
// // // // //     </div>
// // // // //   );
// // // // // }
// // // // 'use client';

// // // // import { useEffect, useState } from 'react';
// // // // import { useSearchParams, useRouter } from 'next/navigation';
// // // // import { useFirestore, useUser } from '@/firebase';
// // // // import { doc, getDoc, collection, serverTimestamp, writeBatch, arrayUnion, increment, setDoc } from 'firebase/firestore';
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
// // // //           activeIntentId: null,
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
// // // //         const notificationRef = trip.carrierId
// // // //           ? doc(collection(doc(firestore, 'users', trip.carrierId), 'notifications'))
// // // //           : null;

// // // //         // ✅ التفرقة بين رحلة مجدولة وطلب خاص
// // // //         // رحلة مجدولة = حالتها Planned أو Ongoing أو الناقل هو من أنشأها
// // // //         const isScheduledTrip = trip.status === 'Planned' || trip.status === 'Ongoing' || (trip.userId === trip.carrierId);

// // // //         // لو رحلة مجدولة، الحجز يكون Pending-Carrier-Confirmation لكي يضغط الناقل "قبول" فقط
// // // //         // لو طلب خاص، يكون Traveler-Accepted-Awaiting-Carrier ليضغط الناقل "قبول وإنشاء رحلة"
// // // //         const newBookingStatus = isScheduledTrip ? 'Pending-Carrier-Confirmation' : 'Traveler-Accepted-Awaiting-Carrier';

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
// // // //           // 2️⃣ إذا كان طلب مسافر (طلب خاص)، نقوم بتحديث حالته إلى "في انتظار الناقل"
// // // //           const tripUpdateRef = doc(firestore, 'trips', trip.id);
// // // //           batch.update(tripUpdateRef, {
// // // //             status: 'Traveler-Accepted-Awaiting-Carrier',
// // // //             pendingBookingId: bookingRef.id,
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
// // // //           activeIntentId: null,
// // // //           updatedAt: serverTimestamp(),
// // // //         }, { merge: true });

// // // //         // إشعارات مخصصة حسب نوع الرحلة
// // // //         if (trip.carrierId && notificationRef) {
// // // //           batch.set(notificationRef, {
// // // //             userId: trip.carrierId,
// // // //             title: isScheduledTrip ? 'حجز جديد في رحلتك المجدولة! 🎫' : 'المسافر وافق — في انتظار قبولك 🎉',
// // // //             message: isScheduledTrip
// // // //               ? `المسافر "${passengers[0]?.name || ''}" حجز ${passengers.length} مقعد في رحلتك المجدولة — يرجى تأكيد الحجز.`
// // // //               : `المسافر "${passengers[0]?.name || ''}" وافق على عرضك — اضغط لقبول الحجز وإنشاء الرحلة.`,
// // // //             type: isScheduledTrip ? 'new_booking_request' : 'traveler_accepted_offer',
// // // //             bookingId: bookingRef.id,
// // // //             isRead: false,
// // // //             link: `/${locale}/carrier/bookings`,
// // // //             createdAt: serverTimestamp(),
// // // //           });
// // // //         }

// // // //         await batch.commit();

// // // //         if (trip.carrierId) {
// // // //           await sendPush({
// // // //             userId: trip.carrierId,
// // // //             title: isScheduledTrip ? 'حجز جديد في رحلتك المجدولة! 🎫' : 'المسافر وافق على عرضك! 🎉',
// // // //             body: isScheduledTrip
// // // //               ? `المسافر "${passengers[0]?.name || 'مسافر'}" بانتظار تأكيد حجز ${passengers.length} مقعد`
// // // //               : `${passengers[0]?.name || 'مسافر'} وافق — افتح التطبيق وأنشئ الرحلة`,
// // // //             data: { type: isScheduledTrip ? 'new_booking_request' : 'traveler_accepted_offer' },
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
// // // //         />
// // // //       )}
// // // //     </div>
// // // //   );
// // // // }

// // // "use client";

// // // import { useState, useCallback } from "react";
// // // import { useFirestore } from "@/firebase";
// // // import { doc, serverTimestamp, collection, runTransaction, deleteField, getDoc, increment } from "firebase/firestore";
// // // import { useToast } from "@/hooks/use-toast";
// // // import { getErrorMessage } from "@/lib/error-dictionary";
// // // import type { Trip, Offer, Booking, UserProfile } from "@/lib/data";
// // // import { SovereignBlackBox } from "@/lib/sovereign-monitor";
// // // import { sendPush } from "@/lib/send-push";

// // // export function useHistoryOps(user: any) {
// // //   const firestore = useFirestore();
// // //   const { toast } = useToast();

// // //   const [isProcessingOffer, setIsProcessingOffer] = useState(false);
// // //   const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);
// // //   const [isCancelling, setIsCancelling] = useState(false);

// // //   const handleAcceptOffer = useCallback(
// // //     async (trip: Trip, offer: Offer, onSuccess: (bookingId: string) => void) => {
// // //       if (!firestore || !user) return;
// // //       setIsProcessingOffer(true);
// // //       try {
// // //         // 1. جلب المحفظة المالية للناقل لحفظها في snapshot
// // //         const carrierSnap = await getDoc(doc(firestore, "users", offer.carrierId));
// // //         const carrierData = carrierSnap.data() as UserProfile;
// // //         const walletSnapshot = carrierData?.paymentWallets || [];

// // //         // ══════════════════════════════════════════════════════════════
// // //         // [NEW FLOW]: المسافر وافق على العرض →
// // //         //   - نحدّث طلب المسافر بـ status: Pending-Carrier-Confirmation
// // //         //   - ننشئ booking بـ status: Pending-Carrier-Confirmation
// // //         //   - نبعت إشعار للناقل إن المسافر وافق وفي انتظار قبوله
// // //         //   - الناقل يدوس قبول: لو عنده رحلة يوافق فوراً، لو لأ ينشئ رحلة جديدة
// // //         // ══════════════════════════════════════════════════════════════
// // //         let newBookingId = "";
// // //         await runTransaction(firestore, async (transaction) => {
// // //           const tripRef = doc(firestore, "trips", trip.id);
// // //           const offerRef = doc(firestore, "offers", offer.id);
// // //           const bookingRef = doc(collection(firestore, "bookings"));
// // //           newBookingId = bookingRef.id;

// // //           // تحديث طلب المسافر الأصلي
// // //           transaction.update(tripRef, {
// // //             status: "Pending-Carrier-Confirmation",
// // //             carrierId: offer.carrierId,
// // //             carrierName: offer.carrierName || "",
// // //             price: offer.price,
// // //             currency: offer.currency,
// // //             depositPercentage: offer.depositPercentage || 10,
// // //             acceptedOfferId: offer.id,
// // //             pendingBookingId: bookingRef.id,
// // //             updatedAt: serverTimestamp(),
// // //           });

// // //           // تغيير الـ offer لـ Accepted
// // //           transaction.update(offerRef, { status: "Accepted" });

// // //           // إنشاء booking بحالة انتظار الناقل
// // //           transaction.set(bookingRef, {
// // //             id: bookingRef.id,
// // //             tripId: trip.id,
// // //             carrierTripId: null, // سيُعبأ بعد إنشاء الناقل للرحلة
// // //             userId: user.uid,
// // //             carrierId: offer.carrierId,
// // //             seats: trip.passengers || 1,
// // //             status: "Pending-Carrier-Confirmation",
// // //             totalPrice: offer.price,
// // //             currency: offer.currency || "JOD",
// // //             passengersDetails: (trip as any).passengersDetails || [],
// // //             paymentSnapshot: walletSnapshot,
// // //             offerId: offer.id,
// // //             // بيانات الطلب الأصلي للناقل عند إنشاء الرحلة
// // //             requestOrigin: trip.origin,
// // //             requestDestination: trip.destination,
// // //             requestDepartureDate: trip.departureDate,
// // //             requestPassengers: trip.passengers || 1,
// // //             createdAt: serverTimestamp(),
// // //             updatedAt: serverTimestamp(),
// // //           });
// // //         });

// // //         // [PUSH + NOTIF]: إشعار للناقل إن المسافر وافق — في انتظاره
// // //         const notifRef = doc(collection(doc(firestore, "users", offer.carrierId), "notifications"));
// // //         await (
// // //           await import("firebase/firestore")
// // //         ).setDoc(notifRef, {
// // //           userId: offer.carrierId,
// // //           title: "المسافر وافق على عرضك! 🎉",
// // //           message: `المسافر قبل عرضك بـ ${offer.price} ${offer.currency} — اضغط لقبول الرحلة وإنشائها`,
// // //           type: "traveler_accepted_offer",
// // //           bookingId: newBookingId,
// // //           isRead: false,
// // //           createdAt: (await import("firebase/firestore")).serverTimestamp(),
// // //         });

// // //         await sendPush({
// // //           userId: offer.carrierId,
// // //           title: "المسافر وافق على عرضك! 🎉",
// // //           body: `عرضك بـ ${offer.price} ${offer.currency} تم قبوله — افتح التطبيق وأنشئ الرحلة`,
// // //           data: { type: "traveler_accepted_offer", bookingId: newBookingId },
// // //         });

// // //         toast({ title: "تم قبول العرض! ✅", description: "في انتظار موافقة الناقل وإنشاء الرحلة." });
// // //         onSuccess(newBookingId);
// // //       } catch (error: any) {
// // //         SovereignBlackBox.reportLethalCrash(error, "ACCEPT_OFFER_RUPTURE", { tripId: trip.id, offerId: offer.id });
// // //         toast({ variant: "destructive", title: getErrorMessage(error, "فشل قبول العرض السيادي") });
// // //       } finally {
// // //         setIsProcessingOffer(false);
// // //       }
// // //     },
// // //     [firestore, user, toast],
// // //   );

// // //   const handleConfirmPayment = useCallback(
// // //     async (booking: Booking, onSuccess: () => void) => {
// // //       if (!firestore) return;
// // //       setIsConfirmingPayment(true);
// // //       try {
// // //         const voucherId = `PAY-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
// // //         const bookingRef = doc(firestore, "bookings", booking.id);
// // //         const notificationRef = doc(collection(firestore, "notifications"));

// // //         await runTransaction(firestore, async (transaction) => {
// // //           transaction.update(bookingRef, {
// // //             status: "Pending-Payment-Verification",
// // //             depositVoucherId: voucherId,
// // //             paymentDeclaredAt: serverTimestamp(),
// // //             updatedAt: serverTimestamp(),
// // //           });

// // //           transaction.set(notificationRef, {
// // //             userId: booking.carrierId,
// // //             title: "المسافر أكد الدفع — راجع السند ✅",
// // //             message: `المسافر أرسل إشعار الدفع — رقم السند: ${voucherId} — اضغط لتأكيد الاستلام`,
// // //             type: "payment_declared",
// // //             bookingId: booking.id,
// // //             isRead: false,
// // //             createdAt: serverTimestamp(),
// // //           });
// // //         });

// // //         // [PUSH]: إشعار Push للناقل إن المسافر دفع
// // //         await sendPush({
// // //           userId: booking.carrierId,
// // //           title: "المسافر أكد الدفع! 💳",
// // //           body: `المسافر أرسل إشعار دفع العربون — راجع السند وأكد الاستلام`,
// // //           data: { type: "payment_declared", bookingId: booking.id },
// // //         });
// // //         toast({ title: "تم تأكيد الدفع! 💳", description: "سيتم إعلام الناقل بتأكيد دفع العربون." });
// // //         onSuccess();
// // //       } catch (error: any) {
// // //         SovereignBlackBox.reportLethalCrash(error, "PAYMENT_CONFIRMATION_RUPTURE", { bookingId: booking.id });
// // //         toast({ variant: "destructive", title: getErrorMessage(error, "فشل تأكيد النبض المالي") });
// // //       } finally {
// // //         setIsConfirmingPayment(false);
// // //       }
// // //     },
// // //     [firestore, toast],
// // //   );

// // //   const handleConfirmCancellation = useCallback(
// // //     async (booking: Booking, reason: string, onSuccess: () => void) => {
// // //       if (!firestore || !user) return;
// // //       setIsCancelling(true);
// // //       try {
// // //         const bookingRef = doc(firestore, "bookings", booking.id);
// // //         const userRef = doc(firestore, "users", user.uid);

// // //         await runTransaction(firestore, async (transaction) => {
// // //           transaction.update(bookingRef, {
// // //             status: "Cancelled",
// // //             cancelReason: reason,
// // //             cancelledBy: "traveler",
// // //             cancelledAt: serverTimestamp(),
// // //             updatedAt: serverTimestamp(),
// // //           });

// // //           if (["Confirmed", "Pending-Payment", "Pending-Payment-Verification"].includes(booking.status)) {
// // //             const seatsToRestore = booking.seats || 1;
// // //             if (booking.carrierTripId) {
// // //               transaction.update(doc(firestore, "trips", booking.carrierTripId), {
// // //                 availableSeats: increment(seatsToRestore),
// // //                 updatedAt: serverTimestamp(),
// // //               });
// // //             }
// // //             if (booking.tripId) {
// // //               transaction.update(doc(firestore, "trips", booking.tripId), {
// // //                 availableSeats: increment(seatsToRestore),
// // //                 updatedAt: serverTimestamp(),
// // //               });
// // //             }
// // //           }

// // //           transaction.update(userRef, {
// // //             activeBookingId: deleteField(),
// // //             activeIntentId: deleteField(),
// // //             updatedAt: serverTimestamp(),
// // //           });
// // //         });

// // //         // [PUSH]: إشعار للناقل إن المسافر ألغى
// // //         if (booking.carrierId) {
// // //           await sendPush({
// // //             userId: booking.carrierId,
// // //             title: "المسافر ألغى الحجز ❌",
// // //             body: `تم إلغاء حجز ${booking.seats} مقعد — السبب: ${reason}`,
// // //             data: { type: "traveler_cancelled_booking", bookingId: booking.id },
// // //           });
// // //         }
// // //         toast({ title: "تم إلغاء الحجز بنجاح ✅" });
// // //         onSuccess();
// // //       } catch (error: any) {
// // //         SovereignBlackBox.reportLethalCrash(error, "CANCELLATION_RUPTURE", { bookingId: booking.id });
// // //         toast({ variant: "destructive", title: getErrorMessage(error, "فشل إلغاء الحجز الموثق") });
// // //       } finally {
// // //         setIsCancelling(false);
// // //       }
// // //     },
// // //     [firestore, user, toast],
// // //   );

// // //   const handleWithdrawRequest = useCallback(
// // //     async (tripId: string) => {
// // //       if (!firestore || !user) return;
// // //       try {
// // //         const { updateDoc } = await import("firebase/firestore");
// // //         await updateDoc(doc(firestore, "trips", tripId), {
// // //           status: "Cancelled",
// // //           updatedAt: serverTimestamp(),
// // //         });
// // //         await updateDoc(doc(firestore, "users", user.uid), {
// // //           activeIntentId: deleteField(),
// // //           updatedAt: serverTimestamp(),
// // //         });
// // //         toast({ title: "تم سحب الطلب بنجاح" });
// // //       } catch (error: any) {
// // //         SovereignBlackBox.reportLethalCrash(error, "WITHDRAW_REQUEST_RUPTURE", { tripId });
// // //         toast({ variant: "destructive", title: getErrorMessage(error, "فشل سحب الطلب من السوق") });
// // //       }
// // //     },
// // //     [firestore, user, toast],
// // //   );

// // //   return {
// // //     isProcessingOffer,
// // //     isConfirmingPayment,
// // //     isCancelling,
// // //     handleAcceptOffer,
// // //     handleConfirmPayment,
// // //     handleConfirmCancellation,
// // //     handleWithdrawRequest,
// // //   };
// // // }

// // 'use client';

// // import { useEffect, useState, Suspense } from 'react';
// // import { useSearchParams, useRouter } from 'next/navigation';
// // import { useFirestore, useUser } from '@/firebase';
// // import { doc, getDoc, collection, serverTimestamp, writeBatch, arrayUnion, increment, setDoc } from 'firebase/firestore';
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
// //           activeIntentId: null,
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
// //         const notificationRef = trip.carrierId
// //           ? doc(collection(doc(firestore, 'users', trip.carrierId), 'notifications'))
// //           : null;

// //         // ✅ التفرقة بين رحلة مجدولة وطلب خاص
// //         // رحلة مجدولة = حالتها Planned أو Ongoing أو الناقل هو من أنشأها
// //         const isScheduledTrip = trip.status === 'Planned' || trip.status === 'Ongoing' || (trip.userId === trip.carrierId);

// //         // دايمًا Pending-Carrier-Confirmation — الناقل يقرر: يوافق فوراً لو عنده رحلة، وإلا ينشئ رحلة جديدة
// //         const newBookingStatus = 'Pending-Carrier-Confirmation';

// //         batch.set(bookingRef, {
// //           id: bookingRef.id,
// //           tripId: trip.id,
// //           carrierTripId: isScheduledTrip ? trip.id : (tokenData.carrierTripId || null),
// //           userId: user.uid,
// //           carrierId: trip.carrierId || tokenData.carrierId,
// //           seats: passengers.length,
// //           passengersDetails: passengers,
// //           status: newBookingStatus,
// //           totalPrice: (tokenData.price || trip.price || 0) * passengers.length,
// //           currency: tokenData.currency || trip.currency || 'JOD',
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

// //         // ✅ [FIX]: التحديث حسب نوع الرحلة
// //         if (isScheduledTrip) {
// //           // 1️⃣ إذا كانت رحلة مجدولة، لا نغير حالتها أبداً (تظل Planned)
// //           // نضيف فقط معرف الحجز إليها لكي تظهر للناقل
// //           const tripUpdateRef = doc(firestore, 'trips', trip.id);
// //           batch.update(tripUpdateRef, {
// //             bookingIds: arrayUnion(bookingRef.id),
// //             updatedAt: serverTimestamp(),
// //           });
// //         } else {
// //           // 2️⃣ إذا كان طلب مسافر (طلب خاص)، نحدّث حالته لـ Pending-Carrier-Confirmation
// //           const tripUpdateRef = doc(firestore, 'trips', trip.id);
// //           batch.update(tripUpdateRef, {
// //             status: 'Pending-Carrier-Confirmation',
// //             pendingBookingId: bookingRef.id,
// //             updatedAt: serverTimestamp(),
// //           });

// //           // لو الناقل كان رابط عرضه برحلة مجدولة عنده مسبقاً، نضيف الحجز ليها
// //           if (tokenData.carrierTripId) {
// //             const carrierTripRef = doc(firestore, 'trips', tokenData.carrierTripId);
// //             batch.update(carrierTripRef, {
// //               bookingIds: arrayUnion(bookingRef.id),
// //               updatedAt: serverTimestamp(),
// //             });
// //           }
// //         }

// //         const userRef = doc(firestore, 'users', user.uid);
// //         batch.set(userRef, {
// //           activeBookingId: bookingRef.id,
// //           activeIntentId: null,
// //           updatedAt: serverTimestamp(),
// //         }, { merge: true });

// //         // إشعارات مخصصة حسب نوع الرحلة
// //         if (trip.carrierId && notificationRef) {
// //           batch.set(notificationRef, {
// //             userId: trip.carrierId,
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

// //         if (trip.carrierId) {
// //           await sendPush({
// //             userId: trip.carrierId,
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
// //         />
// //       )}
// //     </div>
// //   );
// // }

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

// //         // [FIX]: نستخدم tokenData.carrierId لأن trip.carrierId اتمسح من handleAcceptOffer
// //         // أو ممكن يكون في pendingCarrierId (من العرض)
// //         const effectiveCarrierId = tokenData.carrierId || (trip as any).pendingCarrierId || trip.carrierId || null;
// //         const notificationRef = effectiveCarrierId
// //           ? doc(collection(doc(firestore, 'users', effectiveCarrierId), 'notifications'))
// //           : null;

// //         // ✅ التفرقة بين رحلة مجدولة وطلب خاص
// //         // رحلة مجدولة = حالتها Planned أو Ongoing أو الناقل هو من أنشأها
// //         const isScheduledTrip = trip.status === 'Planned' || trip.status === 'Ongoing' || (trip.userId === (trip.carrierId || effectiveCarrierId));

// //         // دايمًا Pending-Carrier-Confirmation — الناقل يقرر: يوافق فوراً لو عنده رحلة، وإلا ينشئ رحلة جديدة
// //         const newBookingStatus = 'Pending-Carrier-Confirmation';

// //         batch.set(bookingRef, {
// //           id: bookingRef.id,
// //           tripId: trip.id,
// //           carrierTripId: isScheduledTrip ? trip.id : (tokenData.carrierTripId || null),
// //           userId: user.uid,
// //           carrierId: trip.carrierId || tokenData.carrierId,
// //           seats: passengers.length,
// //           passengersDetails: passengers,
// //           status: newBookingStatus,
// //           totalPrice: (tokenData.price || trip.price || 0) * passengers.length,
// //           currency: tokenData.currency || trip.currency || 'JOD',
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

// //         // ✅ [FIX]: التحديث حسب نوع الرحلة
// //         if (isScheduledTrip) {
// //           // 1️⃣ إذا كانت رحلة مجدولة، لا نغير حالتها أبداً (تظل Planned)
// //           // نضيف فقط معرف الحجز إليها لكي تظهر للناقل
// //           const tripUpdateRef = doc(firestore, 'trips', trip.id);
// //           batch.update(tripUpdateRef, {
// //             bookingIds: arrayUnion(bookingRef.id),
// //             updatedAt: serverTimestamp(),
// //           });
// //         } else {
// //           // 2️⃣ إذا كان طلب مسافر (طلب خاص)، نحدّث حالته لـ Pending-Carrier-Confirmation
// //           // [FIX]: نمسح carrierId و pendingCarrierId من رحلة المسافر — مش رحلة الناقل
// //           // carrierId هيرجع يتحط لما الناقل ينشئ رحلته فعلاً (في handleTripCreated)
// //           const tripUpdateRef = doc(firestore, 'trips', trip.id);
// //           batch.update(tripUpdateRef, {
// //             status: 'Pending-Carrier-Confirmation',
// //             pendingBookingId: bookingRef.id,
// //             carrierId: deleteField(),
// //             pendingCarrierId: deleteField(),
// //             updatedAt: serverTimestamp(),
// //           });

// //           // لو الناقل كان رابط عرضه برحلة مجدولة عنده مسبقاً، نضيف الحجز ليها
// //           if (tokenData.carrierTripId) {
// //             const carrierTripRef = doc(firestore, 'trips', tokenData.carrierTripId);
// //             batch.update(carrierTripRef, {
// //               bookingIds: arrayUnion(bookingRef.id),
// //               updatedAt: serverTimestamp(),
// //             });
// //           }
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
//  * @description THE STERILIZED BOOKING CONFIRMATION (REINFORCED - SC-806 V6.1)
//  * [FIX]: تم الفصل الذكي بين حجز "الرحلات المجدولة" و "الطلبات الخاصة" لمنع اختفاء الرحلات
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
//   const [trip, setTrip] = useState<Trip | null>(null);
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

//         const tripRef = doc(firestore, 'trips', data.tripId);
//         const tripSnap = await getDoc(tripRef);

//         if (!tripSnap.exists()) {
//           setStatus('error');
//           setErrorCode('TRIP_NOT_FOUND');
//           return;
//         }

//         setTokenData(data);
//         setTrip({ id: tripSnap.id, ...tripSnap.data() } as Trip);
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
//     if (!firestore || !tokenData || !trip || !token) throw new Error('MISSING_DATA');
//     if (!user?.uid) throw new Error('AUTH_REQUIRED');

//     setStatus('confirming');

//     try {
//       const batch = writeBatch(firestore);
//       const tokenRef = doc(firestore, 'booking_tokens', token);

//       if (tokenData.bookingId) {
//         // ══════════════════════════════════════════════════════════════════
//         // المسار الجاي من وكيل
//         // ══════════════════════════════════════════════════════════════════
//         const existingBookingRef = doc(firestore, 'bookings', tokenData.bookingId);

//         batch.update(existingBookingRef, {
//           userId: user.uid,
//           passengersDetails: passengers,
//           seats: passengers.length,
//           depositPaid: true,
//           depositPercentage: trip.depositPercentage ?? 0,
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
//           // activeIntentId: null,
//           activeIntentId: deleteField(),

//           updatedAt: serverTimestamp(),
//         }, { merge: true });

//         if (trip.carrierId) {
//           const notifRef = doc(collection(doc(firestore, 'users', trip.carrierId), 'notifications'));
//           batch.set(notifRef, {
//             userId: trip.carrierId,
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

//         if (trip.carrierId) {
//           await sendPush({
//             userId: trip.carrierId,
//             title: 'مسافر أكمّل بيانات الحجز ✅',
//             body: `${passengers[0]?.name || 'مسافر'} دفع العربون — ${passengers.length} مقعد`,
//             data: { type: 'passenger_deposit_paid', bookingId: tokenData.bookingId },
//           });
//         }

//         try {
//           const groupChatRef = doc(firestore, 'chats', trip.id);
//           await setDoc(groupChatRef, { participants: arrayUnion(user.uid) }, { merge: true });
//         } catch (e) {
//           console.warn('[GroupChat] Could not join:', e);
//         }

//       } else {
//         // ══════════════════════════════════════════════════════════════════
//         // المسار العادي: مسافر مباشر بدون وكيل → booking جديد
//         // ══════════════════════════════════════════════════════════════════
//         const bookingRef = doc(collection(firestore, 'bookings'));

//         // [FIX]: نستخدم tokenData.carrierId لأن trip.carrierId اتمسح من handleAcceptOffer
//         // أو ممكن يكون في pendingCarrierId (من العرض)
//         const effectiveCarrierId = tokenData.carrierId || (trip as any).pendingCarrierId || trip.carrierId || null;
//         const notificationRef = effectiveCarrierId
//           ? doc(collection(doc(firestore, 'users', effectiveCarrierId), 'notifications'))
//           : null;

//         // ✅ التفرقة بين رحلة مجدولة وطلب خاص
//         // رحلة مجدولة = حالتها Planned أو Ongoing أو الناقل هو من أنشأها
//         const isScheduledTrip = trip.status === 'Planned' || trip.status === 'Ongoing' || (trip.userId === (trip.carrierId || effectiveCarrierId));

//         // دايمًا Pending-Carrier-Confirmation — الناقل يقرر: يوافق فوراً لو عنده رحلة، وإلا ينشئ رحلة جديدة
//         const newBookingStatus = 'Pending-Carrier-Confirmation';

//         batch.set(bookingRef, {
//           id: bookingRef.id,
//           tripId: trip.id,
//           carrierTripId: isScheduledTrip ? trip.id : (tokenData.carrierTripId || null),
//           userId: user.uid,
//           carrierId: trip.carrierId || tokenData.carrierId,
//           seats: passengers.length,
//           passengersDetails: passengers,
//           status: newBookingStatus,
//           totalPrice: (tokenData.price || trip.price || 0) * passengers.length,
//           currency: tokenData.currency || trip.currency || 'JOD',
//           depositPercentage: trip.depositPercentage ?? 0,
//           verifiedEmail: tokenData.email || null,
//           bookedByAgent: false,
//           requestOrigin: trip.origin,
//           requestDestination: trip.destination,
//           requestDepartureDate: trip.departureDate,
//           requestPassengers: passengers.length,
//           createdAt: serverTimestamp(),
//           updatedAt: serverTimestamp(),
//         });

//         batch.update(tokenRef, { status: 'used', usedAt: serverTimestamp() });

//         // ✅ [FIX]: التحديث حسب نوع الرحلة
//         if (isScheduledTrip) {
//           // 1️⃣ إذا كانت رحلة مجدولة، لا نغير حالتها أبداً (تظل Planned)
//           // نضيف فقط معرف الحجز إليها لكي تظهر للناقل
//           const tripUpdateRef = doc(firestore, 'trips', trip.id);
//           batch.update(tripUpdateRef, {
//             bookingIds: arrayUnion(bookingRef.id),
//             updatedAt: serverTimestamp(),
//           });
//         } else {
//           // 2️⃣ إذا كان طلب مسافر (طلب خاص)، نحدّث حالته لـ Pending-Carrier-Confirmation
//           // [FIX]: نمسح carrierId و pendingCarrierId من رحلة المسافر — مش رحلة الناقل
//           // carrierId هيرجع يتحط لما الناقل ينشئ رحلته فعلاً (في handleTripCreated)
//           const tripUpdateRef = doc(firestore, 'trips', trip.id);
//           batch.update(tripUpdateRef, {
//             status: 'Pending-Carrier-Confirmation',
//             pendingBookingId: bookingRef.id,
//             carrierId: deleteField(),
//             pendingCarrierId: deleteField(),
//             updatedAt: serverTimestamp(),
//           });

//           // لو الناقل كان رابط عرضه برحلة مجدولة عنده مسبقاً، نضيف الحجز ليها
//           if (tokenData.carrierTripId) {
//             const carrierTripRef = doc(firestore, 'trips', tokenData.carrierTripId);
//             batch.update(carrierTripRef, {
//               bookingIds: arrayUnion(bookingRef.id),
//               updatedAt: serverTimestamp(),
//             });
//           }
//         }

//         const userRef = doc(firestore, 'users', user.uid);
//         batch.set(userRef, {
//           activeBookingId: bookingRef.id,
//           // activeIntentId: null,
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
//           const groupChatRef = doc(firestore, 'chats', trip.id);
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

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background" dir="rtl">
//       {status === 'loading' && (
//         <div className="text-center space-y-4">
//           <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
//           <p className="text-muted-foreground">جاري فحص الختم الرقمي...</p>
//         </div>
//       )}

//       {(status === 'ready' || status === 'confirming') && trip && (
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

//       {trip && isDialogOpen && (
//         <BookingDialog
//           isOpen={isDialogOpen}
//           onOpenChange={(open) => {
//             setIsDialogOpen(open);
//             if (!open && status === 'ready') router.push(`/${locale}/dashboard`);
//           }}
//           trip={trip}
//           seatCount={tokenData?.seatCount || 1}
//           onSubmit={handleConfirmBooking}
//           isProcessing={status === 'confirming'}
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
 * @description THE STERILIZED BOOKING CONFIRMATION (REINFORCED - SC-806 V6.1)
 * [FIX]: تم الفصل الذكي بين حجز "الرحلات المجدولة" و "الطلبات الخاصة" لمنع اختفاء الرحلات
 */

type Status = 'loading' | 'ready' | 'confirming' | 'success' | 'error' | 'expired';

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
  const [trip, setTrip] = useState<Trip | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [errorCode, setErrorCode] = useState('DEFAULT');

  useEffect(() => {
    if (!token || !firestore) return;

    const verifyToken = async () => {
      try {
        const tokenRef = doc(firestore, 'booking_tokens', token);
        const tokenSnap = await getDoc(tokenRef);

        if (!tokenSnap.exists()) {
          setStatus('error');
          setErrorCode('TOKEN_INVALID');
          return;
        }

        const data = tokenSnap.data();

        if (data.status === 'used') {
          setStatus('error');
          setErrorCode('TOKEN_USED');
          return;
        }

        const expiresAt = data.expiresAt?.toDate?.() || new Date(data.expiresAt);
        if (new Date() > expiresAt) {
          setStatus('error');
          setErrorCode('TOKEN_EXPIRED');
          return;
        }

        const tripRef = doc(firestore, 'trips', data.tripId);
        const tripSnap = await getDoc(tripRef);

        if (!tripSnap.exists()) {
          setStatus('error');
          setErrorCode('TRIP_NOT_FOUND');
          return;
        }

        setTokenData(data);
        setTrip({ id: tripSnap.id, ...tripSnap.data() } as Trip);
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
    if (!firestore || !tokenData || !trip || !token) throw new Error('MISSING_DATA');
    if (!user?.uid) throw new Error('AUTH_REQUIRED');

    setStatus('confirming');

    try {
      const batch = writeBatch(firestore);
      const tokenRef = doc(firestore, 'booking_tokens', token);

      if (tokenData.bookingId) {
        // ══════════════════════════════════════════════════════════════════
        // المسار الجاي من وكيل
        // ══════════════════════════════════════════════════════════════════
        const existingBookingRef = doc(firestore, 'bookings', tokenData.bookingId);

        batch.update(existingBookingRef, {
          userId: user.uid,
          passengersDetails: passengers,
          seats: passengers.length,
          depositPaid: true,
          depositPercentage: trip.depositPercentage ?? 0,
          verifiedEmail: tokenData.email || null,
          status: 'Pending-Carrier-Confirmation',
          updatedAt: serverTimestamp(),
        });

        batch.update(tokenRef, { status: 'used', usedAt: serverTimestamp() });

        if (tokenData.carrierTripId) {
          const carrierTripRef = doc(firestore, 'trips', tokenData.carrierTripId);
          batch.update(carrierTripRef, {
            bookingIds: arrayUnion(tokenData.bookingId),
            updatedAt: serverTimestamp(),
          });
        }

        const userRef = doc(firestore, 'users', user.uid);
        batch.set(userRef, {
          activeBookingId: tokenData.bookingId,
          // activeIntentId: null,
          activeIntentId: deleteField(),

          updatedAt: serverTimestamp(),
        }, { merge: true });

        if (trip.carrierId) {
          const notifRef = doc(collection(doc(firestore, 'users', trip.carrierId), 'notifications'));
          batch.set(notifRef, {
            userId: trip.carrierId,
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

        if (trip.carrierId) {
          await sendPush({
            userId: trip.carrierId,
            title: 'مسافر أكمّل بيانات الحجز ✅',
            body: `${passengers[0]?.name || 'مسافر'} دفع العربون — ${passengers.length} مقعد`,
            data: { type: 'passenger_deposit_paid', bookingId: tokenData.bookingId },
          });
        }

        try {
          const groupChatRef = doc(firestore, 'chats', trip.id);
          await setDoc(groupChatRef, { participants: arrayUnion(user.uid) }, { merge: true });
        } catch (e) {
          console.warn('[GroupChat] Could not join:', e);
        }

      } else {
        // ══════════════════════════════════════════════════════════════════
        // المسار العادي: مسافر مباشر بدون وكيل → booking جديد
        // ══════════════════════════════════════════════════════════════════
        const bookingRef = doc(collection(firestore, 'bookings'));

        // [FIX]: نستخدم tokenData.carrierId لأن trip.carrierId اتمسح من handleAcceptOffer
        // أو ممكن يكون في pendingCarrierId (من العرض)
        const effectiveCarrierId = tokenData.carrierId || (trip as any).pendingCarrierId || trip.carrierId || null;
        const notificationRef = effectiveCarrierId
          ? doc(collection(doc(firestore, 'users', effectiveCarrierId), 'notifications'))
          : null;

        // ✅ التفرقة بين رحلة مجدولة وطلب خاص
        // رحلة مجدولة = حالتها Planned أو Ongoing أو الناقل هو من أنشأها
        const isScheduledTrip = trip.status === 'Planned' || trip.status === 'Ongoing' || (trip.userId === (trip.carrierId || effectiveCarrierId));

        // دايمًا Pending-Carrier-Confirmation — الناقل يقرر: يوافق فوراً لو عنده رحلة، وإلا ينشئ رحلة جديدة
        const newBookingStatus = 'Pending-Carrier-Confirmation';

        batch.set(bookingRef, {
          id: bookingRef.id,
          tripId: trip.id,
          carrierTripId: isScheduledTrip ? trip.id : (tokenData.carrierTripId || null),
          userId: user.uid,
          carrierId: trip.carrierId || tokenData.carrierId,
          seats: passengers.length,
          passengersDetails: passengers,
          status: newBookingStatus,
          totalPrice: (tokenData.price || trip.price || 0) * passengers.length,
          currency: tokenData.currency || trip.currency || 'JOD',
          depositPercentage: trip.depositPercentage ?? 0,
          verifiedEmail: tokenData.email || null,
          bookedByAgent: false,
          requestOrigin: trip.origin,
          requestDestination: trip.destination,
          requestDepartureDate: trip.departureDate,
          requestPassengers: passengers.length,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        batch.update(tokenRef, { status: 'used', usedAt: serverTimestamp() });

        // ✅ [FIX]: التحديث حسب نوع الرحلة
        if (isScheduledTrip) {
          // 1️⃣ إذا كانت رحلة مجدولة، لا نغير حالتها أبداً (تظل Planned)
          // نضيف فقط معرف الحجز إليها لكي تظهر للناقل
          const tripUpdateRef = doc(firestore, 'trips', trip.id);
          batch.update(tripUpdateRef, {
            bookingIds: arrayUnion(bookingRef.id),
            updatedAt: serverTimestamp(),
          });
        } else {
          // 2️⃣ إذا كان طلب مسافر (طلب خاص)، نحدّث حالته لـ Pending-Carrier-Confirmation
          // [FIX]: نمسح carrierId و pendingCarrierId من رحلة المسافر — مش رحلة الناقل
          // carrierId هيرجع يتحط لما الناقل ينشئ رحلته فعلاً (في handleTripCreated)
          const tripUpdateRef = doc(firestore, 'trips', trip.id);
          batch.update(tripUpdateRef, {
            status: 'Pending-Carrier-Confirmation',
            pendingBookingId: bookingRef.id,
            carrierId: deleteField(),
            pendingCarrierId: deleteField(),
            updatedAt: serverTimestamp(),
          });

          // لو الناقل كان رابط عرضه برحلة مجدولة عنده مسبقاً، نضيف الحجز ليها
          if (tokenData.carrierTripId) {
            const carrierTripRef = doc(firestore, 'trips', tokenData.carrierTripId);
            batch.update(carrierTripRef, {
              bookingIds: arrayUnion(bookingRef.id),
              updatedAt: serverTimestamp(),
            });
          }
        }

        const userRef = doc(firestore, 'users', user.uid);
        batch.set(userRef, {
          activeBookingId: bookingRef.id,
          // activeIntentId: null,
          activeIntentId: deleteField(),
          updatedAt: serverTimestamp(),
        }, { merge: true });

        // إشعارات مخصصة حسب نوع الرحلة
        if (effectiveCarrierId && notificationRef) {
          batch.set(notificationRef, {
            userId: effectiveCarrierId,
            title: isScheduledTrip ? 'حجز جديد في رحلتك المجدولة! 🎫' : 'المسافر وافق على عرضك — في انتظار قبولك 🎉',
            message: isScheduledTrip
              ? `المسافر "${passengers[0]?.name || ''}" حجز ${passengers.length} مقعد في رحلتك المجدولة — يرجى تأكيد الحجز.`
              : `المسافر "${passengers[0]?.name || ''}" وافق على عرضك — اضغط لقبول الحجز.`,
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
            title: isScheduledTrip ? 'حجز جديد في رحلتك المجدولة! 🎫' : 'المسافر وافق على عرضك! 🎉',
            body: isScheduledTrip
              ? `المسافر "${passengers[0]?.name || 'مسافر'}" بانتظار تأكيد حجز ${passengers.length} مقعد`
              : `${passengers[0]?.name || 'مسافر'} وافق — افتح التطبيق لقبول الحجز`,
            data: { type: 'new_booking_request' },
          });
        }

        try {
          const groupChatRef = doc(firestore, 'chats', trip.id);
          await setDoc(groupChatRef, { participants: arrayUnion(user.uid) }, { merge: true });
        } catch (e) {
          console.warn('[GroupChat] Could not join:', e);
        }
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

      {(status === 'ready' || status === 'confirming') && trip && (
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

      {trip && isDialogOpen && (
        <BookingDialog
          isOpen={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open && status === 'ready') router.push(`/${locale}/dashboard`);
          }}
          trip={trip}
          seatCount={tokenData?.seatCount || 1}
          onSubmit={handleConfirmBooking}
          isProcessing={status === 'confirming'}
          // ✅ [FIX]: تمرير أنواع الركاب من الطلب الأصلي للتعبئة التلقائية
          passengerTypes={
            // ✅ [FIX]: نمرر أنواع الركاب من الطلب الأصلي — child→minor لضمان التوافق مع RadioGroup
            (trip.passengersDetails && trip.passengersDetails.length > 0)
              ? trip.passengersDetails.map(p => {
                const t = p.type as string;
                return (t === 'child' ? 'minor' : t) as 'adult' | 'minor' | 'infant';
              })
              : undefined
          }
        />
      )}
    </div>
  );
}