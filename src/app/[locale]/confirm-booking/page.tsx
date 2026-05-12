// 'use client';

// import { useEffect, useState } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';
// import { useFirestore, useUser } from '@/firebase';
// import { doc, getDoc, collection, serverTimestamp, writeBatch, arrayUnion, increment, setDoc } from 'firebase/firestore';
// import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { BookingDialog } from '@/components/booking-dialog';
// import type { Trip, PassengerDetails } from '@/lib/data';
// import { useLocale, useTranslations } from 'next-intl';

// /**
//  * @file src/app/[locale]/confirm-booking/page.tsx
//  * @description THE STERILIZED BOOKING CONFIRMATION (REINFORCED - SC-806 V6.0)
//  * [FIX]: لو الـ token فيه bookingId (جاي من وكيل) → يحدّث الـ booking الموجود
//  *        بدل ما يعمل booking جديد — عشان بيانات المسافر تظهر عند الناقل
//  */

// type Status = 'loading' | 'ready' | 'confirming' | 'success' | 'error' | 'expired';

// export default function ConfirmBookingPage() {
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

//       // ══════════════════════════════════════════════════════════════════
//       // [FIX - SC-806 V6.0]: المسار الجاي من وكيل
//       // لو في bookingId في الـ token → الـ booking موجود (عمله الوكيل)
//       // المسافر بس يكمّل البيانات ويدفع الغربون
//       // ══════════════════════════════════════════════════════════════════
//       if (tokenData.bookingId) {
//         const existingBookingRef = doc(firestore, 'bookings', tokenData.bookingId);

//         // تحديث الـ booking الموجود ببيانات المسافر
//         batch.update(existingBookingRef, {
//           userId: user.uid,
//           passengersDetails: passengers,
//           seats: passengers.length,
//           depositPaid: true,
//           verifiedEmail: tokenData.email || null,
//           status: 'Pending-Carrier-Confirmation', // يفضل نفسه — الناقل هيشوفه
//           updatedAt: serverTimestamp(),
//         });

//         // تعليم التوكن كمستخدم
//         batch.update(tokenRef, { status: 'used', usedAt: serverTimestamp() });

//         // تقليل المقاعد من رحلة الناقل
//         if (tokenData.carrierTripId) {
//           const carrierTripRef = doc(firestore, 'trips', tokenData.carrierTripId);
//           batch.update(carrierTripRef, {
//             availableSeats: increment(-passengers.length),
//             bookingIds: arrayUnion(tokenData.bookingId),
//             updatedAt: serverTimestamp(),
//           });
//         }

//         // ربط المسافر بالحجز في بروفايله
//         const userRef = doc(firestore, 'users', user.uid);
//         batch.update(userRef, {
//           activeBookingId: tokenData.bookingId,
//           activeIntentId: null,
//           updatedAt: serverTimestamp(),
//         });

//         // إشعار للناقل إن المسافر دفع وأكمل البيانات
//         if (trip.carrierId) {
//           const notifRef = doc(collection(doc(firestore, 'users', trip.carrierId), 'notifications'));
//           batch.set(notifRef, {
//             userId: trip.carrierId,
//             title: 'مسافر أكمّل بيانات الحجز ✅',
//             message: `المسافر "${passengers[0]?.name || ''}" أكمل بياناته ودفع الغربون — ${passengers.length} مقعد`,
//             type: 'passenger_deposit_paid',
//             bookingId: tokenData.bookingId,
//             isRead: false,
//             link: `/${locale}/carrier/bookings`,
//             createdAt: serverTimestamp(),
//           });
//         }

//         await batch.commit();

//         // محاولة الانضمام للـ group chat
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
//         const notificationRef = trip.carrierId
//           ? doc(collection(doc(firestore, 'users', trip.carrierId), 'notifications'))
//           : null;

//         batch.set(bookingRef, {
//           id: bookingRef.id,
//           tripId: trip.id,
//           carrierTripId: tokenData.carrierTripId || null,
//           userId: user.uid,
//           carrierId: trip.carrierId || tokenData.carrierId,
//           seats: passengers.length,
//           passengersDetails: passengers,
//           status: 'Pending-Carrier-Confirmation',
//           totalPrice: (tokenData.price || trip.price || 0) * passengers.length,
//           currency: tokenData.currency || trip.currency || 'JOD',
//           verifiedEmail: tokenData.email || null,
//           bookedByAgent: false,
//           createdAt: serverTimestamp(),
//           updatedAt: serverTimestamp(),
//         });

//         // تعليم التوكن كمستخدم
//         batch.update(tokenRef, { status: 'used', usedAt: serverTimestamp() });

//         // تقليل المقاعد
//         if (tokenData.carrierTripId) {
//           const carrierTripRef = doc(firestore, 'trips', tokenData.carrierTripId);
//           batch.update(carrierTripRef, {
//             availableSeats: increment(-passengers.length),
//             bookingIds: arrayUnion(bookingRef.id),
//             updatedAt: serverTimestamp(),
//           });
//         }

//         // ربط المسافر بالحجز
//         const userRef = doc(firestore, 'users', user.uid);
//         batch.update(userRef, {
//           activeBookingId: bookingRef.id,
//           activeIntentId: null,
//           updatedAt: serverTimestamp(),
//         });

//         // إشعار للناقل
//         if (trip.carrierId && notificationRef) {
//           batch.set(notificationRef, {
//             userId: trip.carrierId,
//             title: 'طلب حجز جديد 🎫',
//             message: `مسافر يطلب حجز ${passengers.length} مقعد من ${trip.origin} إلى ${trip.destination}`,
//             type: 'new_booking_request',
//             isRead: false,
//             link: `/${locale}/carrier/bookings`,
//             createdAt: serverTimestamp(),
//           });
//         }

//         await batch.commit();

//         // محاولة الانضمام للـ group chat
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

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useFirestore, useUser } from '@/firebase';
import { doc, getDoc, collection, serverTimestamp, writeBatch, arrayUnion, increment, setDoc } from 'firebase/firestore';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BookingDialog } from '@/components/booking-dialog';
import type { Trip, PassengerDetails } from '@/lib/data';
import { useLocale, useTranslations } from 'next-intl';
import { sendPush } from "@/lib/send-push";

/**
 * @file src/app/[locale]/confirm-booking/page.tsx
 * @description THE STERILIZED BOOKING CONFIRMATION (REINFORCED - SC-806 V6.0)
 * [FIX]: لو الـ token فيه bookingId (جاي من وكيل) → يحدّث الـ booking الموجود
 *        بدل ما يعمل booking جديد — عشان بيانات المسافر تظهر عند الناقل
 */

type Status = 'loading' | 'ready' | 'confirming' | 'success' | 'error' | 'expired';

export default function ConfirmBookingPage() {
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

      // ══════════════════════════════════════════════════════════════════
      // [FIX - SC-806 V6.0]: المسار الجاي من وكيل
      // لو في bookingId في الـ token → الـ booking موجود (عمله الوكيل)
      // المسافر بس يكمّل البيانات ويدفع الغربون
      // ══════════════════════════════════════════════════════════════════
      if (tokenData.bookingId) {
        const existingBookingRef = doc(firestore, 'bookings', tokenData.bookingId);

        // تحديث الـ booking الموجود ببيانات المسافر
        batch.update(existingBookingRef, {
          userId: user.uid,
          passengersDetails: passengers,
          seats: passengers.length,
          depositPaid: true,
          verifiedEmail: tokenData.email || null,
          status: 'Pending-Carrier-Confirmation', // يفضل نفسه — الناقل هيشوفه
          updatedAt: serverTimestamp(),
        });

        // تعليم التوكن كمستخدم
        batch.update(tokenRef, { status: 'used', usedAt: serverTimestamp() });

        // تقليل المقاعد من رحلة الناقل
        if (tokenData.carrierTripId) {
          const carrierTripRef = doc(firestore, 'trips', tokenData.carrierTripId);
          batch.update(carrierTripRef, {
            availableSeats: increment(-passengers.length),
            bookingIds: arrayUnion(tokenData.bookingId),
            updatedAt: serverTimestamp(),
          });
        }

        // ربط المسافر بالحجز في بروفايله
        const userRef = doc(firestore, 'users', user.uid);
        // [FIX]: set+merge بدل update — لو الـ user doc مش موجود ميفشلش
        batch.set(userRef, {
          activeBookingId: tokenData.bookingId,
          activeIntentId: null,
          updatedAt: serverTimestamp(),
        }, { merge: true });

        // إشعار للناقل إن المسافر دفع وأكمل البيانات
        if (trip.carrierId) {
          const notifRef = doc(collection(doc(firestore, 'users', trip.carrierId), 'notifications'));
          batch.set(notifRef, {
            userId: trip.carrierId,
            title: 'مسافر أكمّل بيانات الحجز ✅',
            message: `المسافر "${passengers[0]?.name || ''}" أكمل بياناته ودفع الغربون — ${passengers.length} مقعد`,
            type: 'passenger_deposit_paid',
            bookingId: tokenData.bookingId,
            isRead: false,
            link: `/${locale}/carrier/bookings`,
            createdAt: serverTimestamp(),
          });
        }

        await batch.commit();

        // FCM Push للناقل
        if (trip.carrierId) {
          await sendPush({
            userId: trip.carrierId,
            title: 'مسافر أكمّل بيانات الحجز ✅',
            body: `${passengers[0]?.name || 'مسافر'} دفع الغربون — ${passengers.length} مقعد`,
            data: { type: 'passenger_deposit_paid', bookingId: tokenData.bookingId },
          });
        }

        // محاولة الانضمام للـ group chat
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
        const notificationRef = trip.carrierId
          ? doc(collection(doc(firestore, 'users', trip.carrierId), 'notifications'))
          : null;

        batch.set(bookingRef, {
          id: bookingRef.id,
          tripId: trip.id,
          carrierTripId: tokenData.carrierTripId || null,
          userId: user.uid,
          carrierId: trip.carrierId || tokenData.carrierId,
          seats: passengers.length,
          passengersDetails: passengers,
          status: 'Pending-Carrier-Confirmation',
          totalPrice: (tokenData.price || trip.price || 0) * passengers.length,
          currency: tokenData.currency || trip.currency || 'JOD',
          verifiedEmail: tokenData.email || null,
          bookedByAgent: false,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        // تعليم التوكن كمستخدم
        batch.update(tokenRef, { status: 'used', usedAt: serverTimestamp() });

        // تقليل المقاعد
        if (tokenData.carrierTripId) {
          const carrierTripRef = doc(firestore, 'trips', tokenData.carrierTripId);
          batch.update(carrierTripRef, {
            availableSeats: increment(-passengers.length),
            bookingIds: arrayUnion(bookingRef.id),
            updatedAt: serverTimestamp(),
          });
        }

        // ربط المسافر بالحجز
        const userRef = doc(firestore, 'users', user.uid);
        // [FIX]: set+merge بدل update — لو الـ user doc مش موجود ميفشلش
        batch.set(userRef, {
          activeBookingId: bookingRef.id,
          activeIntentId: null,
          updatedAt: serverTimestamp(),
        }, { merge: true });

        // إشعار للناقل
        if (trip.carrierId && notificationRef) {
          batch.set(notificationRef, {
            userId: trip.carrierId,
            title: 'طلب حجز جديد 🎫',
            message: `مسافر يطلب حجز ${passengers.length} مقعد من ${trip.origin} إلى ${trip.destination}`,
            type: 'new_booking_request',
            isRead: false,
            link: `/${locale}/carrier/bookings`,
            createdAt: serverTimestamp(),
          });
        }

        await batch.commit();

        // FCM Push للناقل
        if (trip.carrierId) {
          await sendPush({
            userId: trip.carrierId,
            title: 'طلب حجز جديد 🎫',
            body: `مسافر يطلب حجز ${passengers.length} مقعد من ${trip.origin} إلى ${trip.destination}`,
            data: { type: 'new_booking_request' },
          });
        }

        // محاولة الانضمام للـ group chat
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
        />
      )}
    </div>
  );
}