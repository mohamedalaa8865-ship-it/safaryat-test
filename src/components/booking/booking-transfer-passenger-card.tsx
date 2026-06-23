// // // 'use client';

// // // /**
// // //  * @component BookingTransferPassengerCard
// // //  * @description كارد يُعرض للمسافر للموافقة أو الرفض على طلب نقله لناقل آخر
// // //  * يظهر في صفحة حجوزات المسافر (my-bookings / history / trip-card)
// // //  */

// // // import { useState } from 'react';
// // // import { Button } from '@/components/ui/button';
// // // import { Badge } from '@/components/ui/badge';
// // // import { useFirestore, useUser } from '@/firebase';
// // // import { useToast } from '@/hooks/use-toast';
// // // import { doc, updateDoc, serverTimestamp, addDoc, collection } from 'firebase/firestore';
// // // import { sendPush } from '@/lib/send-push';
// // // import { ArrowRightLeft, CheckCircle2, XCircle, Loader2, MapPin, Calendar, Clock, User } from 'lucide-react';
// // // import { useLocale } from 'next-intl';
// // // import { getCityName } from '@/lib/constants';

// // // interface BookingTransferPassengerCardProps {
// // //     transferRequestId: string;
// // //     bookingId: string;
// // //     fromCarrierId: string;
// // //     toCarrierId: string;
// // //     toCarrierTripId: string;
// // //     tripDetails: {
// // //         origin: string;
// // //         destination: string;
// // //         newDepartureDate?: string | null;
// // //         newDepartureTime?: string | null;
// // //         newMeetingPoint?: string | null;
// // //         newCarrierName: string;
// // //         passengerCount: number;
// // //     };
// // // }

// // // export function BookingTransferPassengerCard({
// // //     transferRequestId,
// // //     bookingId,
// // //     fromCarrierId,
// // //     toCarrierId,
// // //     toCarrierTripId,
// // //     tripDetails,
// // // }: BookingTransferPassengerCardProps) {
// // //     const { user } = useUser();
// // //     const firestore = useFirestore();
// // //     const { toast } = useToast();
// // //     const locale = useLocale();
// // //     const [loading, setLoading] = useState<'accept' | 'reject' | null>(null);

// // //     const origin = getCityName(tripDetails.origin, locale);
// // //     const dest = getCityName(tripDetails.destination, locale);

// // //     const handleAccept = async () => {
// // //         if (!firestore || !user) return;
// // //         setLoading('accept');
// // //         try {
// // //             // 1. تحديث حالة طلب النقل → pending_carrier (ينتظر الناقل الجديد)
// // //             await updateDoc(doc(firestore, 'bookingTransferRequests', transferRequestId), {
// // //                 status: 'pending_carrier',
// // //                 passengerAcceptedAt: serverTimestamp(),
// // //                 updatedAt: serverTimestamp(),
// // //             });

// // //             // 2. إشعار للناقل الجديد
// // //             await addDoc(collection(doc(firestore, 'users', toCarrierId), 'notifications'), {
// // //                 userId: toCarrierId,
// // //                 title: '✅ مسافر جديد يريد الانضمام لرحلتك',
// // //                 message: `وافق المسافر على النقل. الرجاء مراجعة الطلب والموافقة على استقباله في رحلتك.`,
// // //                 type: 'booking_transfer_to_carrier',
// // //                 bookingTransferRequestId: transferRequestId,
// // //                 bookingId: bookingId,
// // //                 isRead: false,
// // //                 link: `/${locale}/carrier/bookings`,
// // //                 createdAt: serverTimestamp(),
// // //             });

// // //             await sendPush({
// // //                 userId: toCarrierId,
// // //                 title: '✅ مسافر جديد يريد الانضمام',
// // //                 body: 'وافق المسافر على الانتقال لرحلتك. راجع الطلب الآن.',
// // //                 data: { type: 'booking_transfer_to_carrier', bookingTransferRequestId: transferRequestId },
// // //             });

// // //             toast({ title: '✅ تم قبول النقل', description: 'سيتواصل معك الناقل الجديد قريباً.' });
// // //         } catch (error: any) {
// // //             toast({ variant: 'destructive', title: 'فشل القبول', description: error?.message });
// // //         } finally {
// // //             setLoading(null);
// // //         }
// // //     };

// // //     const handleReject = async () => {
// // //         if (!firestore || !user) return;
// // //         setLoading('reject');
// // //         try {
// // //             // 1. رفض الطلب
// // //             await updateDoc(doc(firestore, 'bookingTransferRequests', transferRequestId), {
// // //                 status: 'rejected_by_passenger',
// // //                 passengerRejectedAt: serverTimestamp(),
// // //                 updatedAt: serverTimestamp(),
// // //             });

// // //             // 2. إشعار للناقل الأصلي بأن المسافر رفض
// // //             await addDoc(collection(doc(firestore, 'users', fromCarrierId), 'notifications'), {
// // //                 userId: fromCarrierId,
// // //                 title: '❌ المسافر رفض النقل',
// // //                 message: 'المسافر لا يريد الانتقال لناقل آخر.',
// // //                 type: 'booking_transfer_rejected_by_passenger',
// // //                 bookingId: bookingId,
// // //                 isRead: false,
// // //                 link: `/${locale}/carrier/bookings`,
// // //                 createdAt: serverTimestamp(),
// // //             });

// // //             await sendPush({
// // //                 userId: fromCarrierId,
// // //                 title: '❌ المسافر رفض النقل',
// // //                 body: 'المسافر رفض طلب نقله لناقل آخر.',
// // //                 data: { type: 'booking_transfer_rejected_by_passenger', bookingId },
// // //             });

// // //             toast({ title: 'تم رفض النقل', description: 'الحجز سيبقى مع الناقل الأصلي.' });
// // //         } catch (error: any) {
// // //             toast({ variant: 'destructive', title: 'فشل الرفض', description: error?.message });
// // //         } finally {
// // //             setLoading(null);
// // //         }
// // //     };

// // //     return (
// // //         <div className="rounded-2xl border-2 border-amber-500/30 bg-amber-500/5 overflow-hidden">
// // //             {/* Header */}
// // //             <div className="bg-amber-500/10 px-4 py-3 flex items-center gap-2">
// // //                 <ArrowRightLeft className="h-4 w-4 text-amber-600 shrink-0" />
// // //                 <p className="text-sm font-black text-amber-700">ناقلك يريد نقلك لرحلة أخرى</p>
// // //             </div>

// // //             <div className="p-4 space-y-3">
// // //                 {/* تفاصيل الرحلة الجديدة */}
// // //                 <div className="space-y-2">
// // //                     <div className="flex items-center gap-2 text-sm">
// // //                         <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
// // //                         <span className="font-bold">{origin} → {dest}</span>
// // //                     </div>

// // //                     <div className="flex items-center gap-2 text-sm">
// // //                         <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
// // //                         <span className="text-muted-foreground">الناقل الجديد:</span>
// // //                         <span className="font-bold">{tripDetails.newCarrierName}</span>
// // //                     </div>

// // //                     {tripDetails.newDepartureDate && (
// // //                         <div className="flex items-center gap-2 text-sm">
// // //                             <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
// // //                             <span className="text-muted-foreground">التاريخ:</span>
// // //                             <span className="font-bold">
// // //                                 {new Date(tripDetails.newDepartureDate).toLocaleDateString('ar-SA')}
// // //                             </span>
// // //                         </div>
// // //                     )}

// // //                     {tripDetails.newDepartureTime && (
// // //                         <div className="flex items-center gap-2 text-sm">
// // //                             <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
// // //                             <span className="text-muted-foreground">الوقت:</span>
// // //                             <span className="font-bold">{tripDetails.newDepartureTime}</span>
// // //                         </div>
// // //                     )}

// // //                     {tripDetails.newMeetingPoint && (
// // //                         <div className="flex items-center gap-2 text-sm">
// // //                             <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
// // //                             <span className="text-muted-foreground">نقطة الانطلاق:</span>
// // //                             <span className="font-bold">{tripDetails.newMeetingPoint}</span>
// // //                         </div>
// // //                     )}
// // //                 </div>

// // //                 <p className="text-xs text-muted-foreground border-t border-border/50 pt-3">
// // //                     بموافقتك، سيُرسل طلب للناقل الجديد، وبعد موافقته وتأكيد العربون ستنتقل تذكرتك تلقائياً.
// // //                 </p>

// // //                 {/* أزرار الموافقة والرفض */}
// // //                 <div className="grid grid-cols-2 gap-2 pt-1">
// // //                     <Button
// // //                         className="h-11 bg-green-600 hover:bg-green-700 text-white font-black rounded-xl gap-1.5 text-sm"
// // //                         onClick={handleAccept}
// // //                         disabled={!!loading}
// // //                     >
// // //                         {loading === 'accept'
// // //                             ? <Loader2 className="h-4 w-4 animate-spin" />
// // //                             : <><CheckCircle2 className="h-4 w-4" /> موافق</>
// // //                         }
// // //                     </Button>
// // //                     <Button
// // //                         variant="outline"
// // //                         className="h-11 border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 font-black rounded-xl text-sm gap-1.5"
// // //                         onClick={handleReject}
// // //                         disabled={!!loading}
// // //                     >
// // //                         {loading === 'reject'
// // //                             ? <Loader2 className="h-4 w-4 animate-spin" />
// // //                             : <><XCircle className="h-4 w-4" /> رفض</>
// // //                         }
// // //                     </Button>
// // //                 </div>
// // //             </div>
// // //         </div>
// // //     );
// // // }
// // 'use client';

// // /**
// //  * @component BookingTransferPassengerCard
// //  * @description كارد يُعرض للمسافر للموافقة أو الرفض على طلب نقله لناقل آخر
// //  * يظهر في صفحة حجوزات المسافر (my-bookings / history / trip-card)
// //  */

// // import { useState } from 'react';
// // import { Button } from '@/components/ui/button';
// // import { Badge } from '@/components/ui/badge';
// // import { useFirestore, useUser } from '@/firebase';
// // import { useToast } from '@/hooks/use-toast';
// // import { doc, updateDoc, serverTimestamp, addDoc, collection } from 'firebase/firestore';
// // import { sendPush } from '@/lib/send-push';
// // import { ArrowRightLeft, CheckCircle2, XCircle, Loader2, MapPin, Calendar, Clock, User } from 'lucide-react';
// // import { useLocale } from 'next-intl';
// // import { getCityName } from '@/lib/constants';

// // interface BookingTransferPassengerCardProps {
// //     transferRequestId: string;
// //     bookingId: string;
// //     fromCarrierId: string;
// //     toCarrierId: string;
// //     toCarrierTripId: string;
// //     tripDetails: {
// //         origin: string;
// //         destination: string;
// //         newDepartureDate?: string | null;
// //         newDepartureTime?: string | null;
// //         newMeetingPoint?: string | null;
// //         newMeetingPointLink?: string | null;
// //         newCarrierName: string;
// //         passengerCount: number;
// //     };
// // }

// // export function BookingTransferPassengerCard({
// //     transferRequestId,
// //     bookingId,
// //     fromCarrierId,
// //     toCarrierId,
// //     toCarrierTripId,
// //     tripDetails,
// // }: BookingTransferPassengerCardProps) {
// //     const { user } = useUser();
// //     const firestore = useFirestore();
// //     const { toast } = useToast();
// //     const locale = useLocale();
// //     const [loading, setLoading] = useState<'accept' | 'reject' | null>(null);

// //     const origin = getCityName(tripDetails.origin, locale);
// //     const dest = getCityName(tripDetails.destination, locale);

// //     const handleAccept = async () => {
// //         if (!firestore || !user) return;
// //         setLoading('accept');
// //         try {
// //             // 1. تحديث حالة طلب النقل → pending_carrier (ينتظر الناقل الجديد)
// //             await updateDoc(doc(firestore, 'bookingTransferRequests', transferRequestId), {
// //                 status: 'pending_carrier',
// //                 passengerAcceptedAt: serverTimestamp(),
// //                 updatedAt: serverTimestamp(),
// //             });

// //             // 2. إشعار للناقل الجديد
// //             await addDoc(collection(doc(firestore, 'users', toCarrierId), 'notifications'), {
// //                 userId: toCarrierId,
// //                 title: '✅ مسافر جديد يريد الانضمام لرحلتك',
// //                 message: `وافق المسافر على النقل. الرجاء مراجعة الطلب والموافقة على استقباله في رحلتك.`,
// //                 type: 'booking_transfer_to_carrier',
// //                 bookingTransferRequestId: transferRequestId,
// //                 bookingId: bookingId,
// //                 isRead: false,
// //                 link: `/${locale}/carrier/bookings`,
// //                 createdAt: serverTimestamp(),
// //             });

// //             await sendPush({
// //                 userId: toCarrierId,
// //                 title: '✅ مسافر جديد يريد الانضمام',
// //                 body: 'وافق المسافر على الانتقال لرحلتك. راجع الطلب الآن.',
// //                 data: { type: 'booking_transfer_to_carrier', bookingTransferRequestId: transferRequestId },
// //             });

// //             toast({ title: '✅ تم قبول النقل', description: 'سيتواصل معك الناقل الجديد قريباً.' });
// //         } catch (error: any) {
// //             toast({ variant: 'destructive', title: 'فشل القبول', description: error?.message });
// //         } finally {
// //             setLoading(null);
// //         }
// //     };

// //     const handleReject = async () => {
// //         if (!firestore || !user) return;
// //         setLoading('reject');
// //         try {
// //             // 1. رفض الطلب
// //             await updateDoc(doc(firestore, 'bookingTransferRequests', transferRequestId), {
// //                 status: 'rejected_by_passenger',
// //                 passengerRejectedAt: serverTimestamp(),
// //                 updatedAt: serverTimestamp(),
// //             });

// //             // 2. إشعار للناقل الأصلي بأن المسافر رفض
// //             await addDoc(collection(doc(firestore, 'users', fromCarrierId), 'notifications'), {
// //                 userId: fromCarrierId,
// //                 title: '❌ المسافر رفض النقل',
// //                 message: 'المسافر لا يريد الانتقال لناقل آخر.',
// //                 type: 'booking_transfer_rejected_by_passenger',
// //                 bookingId: bookingId,
// //                 isRead: false,
// //                 link: `/${locale}/carrier/bookings`,
// //                 createdAt: serverTimestamp(),
// //             });

// //             await sendPush({
// //                 userId: fromCarrierId,
// //                 title: '❌ المسافر رفض النقل',
// //                 body: 'المسافر رفض طلب نقله لناقل آخر.',
// //                 data: { type: 'booking_transfer_rejected_by_passenger', bookingId },
// //             });

// //             toast({ title: 'تم رفض النقل', description: 'الحجز سيبقى مع الناقل الأصلي.' });
// //         } catch (error: any) {
// //             toast({ variant: 'destructive', title: 'فشل الرفض', description: error?.message });
// //         } finally {
// //             setLoading(null);
// //         }
// //     };

// //     return (
// //         <div className="rounded-2xl border-2 border-amber-500/30 bg-amber-500/5 overflow-hidden">
// //             {/* Header */}
// //             <div className="bg-amber-500/10 px-4 py-3 flex items-center gap-2">
// //                 <ArrowRightLeft className="h-4 w-4 text-amber-600 shrink-0" />
// //                 <p className="text-sm font-black text-amber-700">ناقلك يريد نقلك لرحلة أخرى</p>
// //             </div>

// //             <div className="p-4 space-y-3">
// //                 {/* تفاصيل الرحلة الجديدة */}
// //                 <div className="space-y-2">
// //                     <div className="flex items-center gap-2 text-sm">
// //                         <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
// //                         <span className="font-bold">{origin} → {dest}</span>
// //                     </div>

// //                     <div className="flex items-center gap-2 text-sm">
// //                         <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
// //                         <span className="text-muted-foreground">الناقل الجديد:</span>
// //                         <span className="font-bold">{tripDetails.newCarrierName}</span>
// //                     </div>

// //                     {tripDetails.newDepartureDate && (
// //                         <div className="flex items-center gap-2 text-sm">
// //                             <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
// //                             <span className="text-muted-foreground">التاريخ:</span>
// //                             <span className="font-bold">
// //                                 {new Date(tripDetails.newDepartureDate).toLocaleDateString('ar-SA')}
// //                             </span>
// //                         </div>
// //                     )}

// //                     {tripDetails.newDepartureTime && (
// //                         <div className="flex items-center gap-2 text-sm">
// //                             <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
// //                             <span className="text-muted-foreground">وقت الانطلاق:</span>
// //                             <span className="font-bold">{tripDetails.newDepartureTime}</span>
// //                         </div>
// //                     )}

// //                     {tripDetails.newMeetingPoint && (
// //                         <div className="flex items-center gap-2 text-sm">
// //                             <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
// //                             <span className="text-muted-foreground">نقطة الانطلاق:</span>
// //                             <div className="flex items-center gap-1.5 flex-wrap">
// //                                 <span className="font-bold">{tripDetails.newMeetingPoint}</span>
// //                                 {tripDetails.newMeetingPointLink && (
// //                                     <a
// //                                         href={tripDetails.newMeetingPointLink}
// //                                         target="_blank"
// //                                         rel="noopener noreferrer"
// //                                         className="inline-flex items-center gap-1 text-xs font-black text-black bg-[#A18E64] hover:bg-[#a18e64b1] px-2 py-0.5 rounded-lg transition-all"
// //                                     >
// //                                         <MapPin className="h-3 w-3" /> افتح الخريطة
// //                                     </a>
// //                                 )}
// //                             </div>
// //                         </div>
// //                     )}
// //                 </div>

// //                 <p className="text-xs text-muted-foreground border-t border-border/50 pt-3">
// //                     بموافقتك، سيُرسل طلب للناقل الجديد، وبعد موافقته وتأكيد العربون ستنتقل تذكرتك تلقائياً.
// //                 </p>

// //                 {/* أزرار الموافقة والرفض */}
// //                 <div className="grid grid-cols-2 gap-2 pt-1">
// //                     <Button
// //                         className="h-11 bg-green-600 hover:bg-green-700 text-white font-black rounded-xl gap-1.5 text-sm"
// //                         onClick={handleAccept}
// //                         disabled={!!loading}
// //                     >
// //                         {loading === 'accept'
// //                             ? <Loader2 className="h-4 w-4 animate-spin" />
// //                             : <><CheckCircle2 className="h-4 w-4" /> موافق</>
// //                         }
// //                     </Button>
// //                     <Button
// //                         variant="outline"
// //                         className="h-11 border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 font-black rounded-xl text-sm gap-1.5"
// //                         onClick={handleReject}
// //                         disabled={!!loading}
// //                     >
// //                         {loading === 'reject'
// //                             ? <Loader2 className="h-4 w-4 animate-spin" />
// //                             : <><XCircle className="h-4 w-4" /> رفض</>
// //                         }
// //                     </Button>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // }
// 'use client';

// /**
//  * @component BookingTransferPassengerCard
//  * @description كارد يُعرض للمسافر للموافقة أو الرفض على طلب نقله لناقل آخر
//  * يظهر في صفحة حجوزات المسافر (my-bookings / history / trip-card)
//  */

// import { useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { useFirestore, useUser } from '@/firebase';
// import { useToast } from '@/hooks/use-toast';
// import { doc, updateDoc, serverTimestamp, addDoc, collection, getDoc } from 'firebase/firestore';
// import { sendPush } from '@/lib/send-push';
// import { ArrowRightLeft, CheckCircle2, XCircle, Loader2, MapPin, Calendar, Clock, User, ArrowLeft } from 'lucide-react';
// import { useLocale } from 'next-intl';
// import { getCityName } from '@/lib/constants';

// interface BookingTransferPassengerCardProps {
//     transferRequestId: string;
//     bookingId: string;
//     fromCarrierId: string;
//     toCarrierId: string;
//     toCarrierTripId: string;
//     tripDetails: {
//         origin: string;
//         destination: string;
//         newDepartureDate?: string | null;
//         newDepartureTime?: string | null;
//         newMeetingPoint?: string | null;
//         newMeetingPointLink?: string | null;
//         newCarrierName: string;
//         passengerCount: number;
//     };
// }

// export function BookingTransferPassengerCard({
//     transferRequestId,
//     bookingId,
//     fromCarrierId,
//     toCarrierId,
//     toCarrierTripId,
//     tripDetails,
// }: BookingTransferPassengerCardProps) {
//     const { user } = useUser();
//     const firestore = useFirestore();
//     const { toast } = useToast();
//     const locale = useLocale();
//     const [loading, setLoading] = useState<'accept' | 'reject' | null>(null);

//     // جلب بيانات الرحلة الجديدة مباشرة من Firestore كـ fallback
//     // (بعض الطلبات القديمة مش فيها newDepartureTime أو newMeetingPointLink)
//     const [liveTrip, setLiveTrip] = useState<Record<string, any> | null>(null);
//     useEffect(() => {
//         if (!firestore || !toCarrierTripId) return;
//         getDoc(doc(firestore, 'trips', toCarrierTripId)).then((snap) => {
//             if (snap.exists()) setLiveTrip(snap.data());
//         });
//     }, [firestore, toCarrierTripId]);

//     // دمج بيانات tripDetails مع الـ liveTrip: tripDetails له الأولوية لو موجود
//     const departureTime = tripDetails.newDepartureTime || liveTrip?.departureTime || null;
//     const meetingPointLink = tripDetails.newMeetingPointLink || liveTrip?.meetingPointLink || null;
//     const meetingPoint = tripDetails.newMeetingPoint || liveTrip?.meetingPoint || null;
//     const departureDate = tripDetails.newDepartureDate || liveTrip?.departureDate || null;

//     const origin = getCityName(tripDetails.origin, locale);
//     const dest = getCityName(tripDetails.destination, locale);

//     const handleAccept = async () => {
//         if (!firestore || !user) return;
//         setLoading('accept');
//         try {
//             // 1. تحديث حالة طلب النقل → pending_carrier (ينتظر الناقل الجديد)
//             await updateDoc(doc(firestore, 'bookingTransferRequests', transferRequestId), {
//                 status: 'pending_carrier',
//                 passengerAcceptedAt: serverTimestamp(),
//                 updatedAt: serverTimestamp(),
//             });

//             // 2. إشعار للناقل الجديد
//             await addDoc(collection(doc(firestore, 'users', toCarrierId), 'notifications'), {
//                 userId: toCarrierId,
//                 title: '✅ مسافر جديد يريد الانضمام لرحلتك',
//                 message: `وافق المسافر على النقل. الرجاء مراجعة الطلب والموافقة على استقباله في رحلتك.`,
//                 type: 'booking_transfer_to_carrier',
//                 bookingTransferRequestId: transferRequestId,
//                 bookingId: bookingId,
//                 isRead: false,
//                 link: `/${locale}/carrier/bookings`,
//                 createdAt: serverTimestamp(),
//             });

//             await sendPush({
//                 userId: toCarrierId,
//                 title: '✅ مسافر جديد يريد الانضمام',
//                 body: 'وافق المسافر على الانتقال لرحلتك. راجع الطلب الآن.',
//                 data: { type: 'booking_transfer_to_carrier', bookingTransferRequestId: transferRequestId },
//             });

//             toast({ title: '✅ تم قبول النقل', description: 'سيتواصل معك الناقل الجديد قريباً.' });
//         } catch (error: any) {
//             toast({ variant: 'destructive', title: 'فشل القبول', description: error?.message });
//         } finally {
//             setLoading(null);
//         }
//     };

//     const handleReject = async () => {
//         if (!firestore || !user) return;
//         setLoading('reject');
//         try {
//             // 1. رفض الطلب
//             await updateDoc(doc(firestore, 'bookingTransferRequests', transferRequestId), {
//                 status: 'rejected_by_passenger',
//                 passengerRejectedAt: serverTimestamp(),
//                 updatedAt: serverTimestamp(),
//             });

//             // 2. إشعار للناقل الأصلي بأن المسافر رفض
//             await addDoc(collection(doc(firestore, 'users', fromCarrierId), 'notifications'), {
//                 userId: fromCarrierId,
//                 title: '❌ المسافر رفض النقل',
//                 message: 'المسافر لا يريد الانتقال لناقل آخر.',
//                 type: 'booking_transfer_rejected_by_passenger',
//                 bookingId: bookingId,
//                 isRead: false,
//                 link: `/${locale}/carrier/bookings`,
//                 createdAt: serverTimestamp(),
//             });

//             await sendPush({
//                 userId: fromCarrierId,
//                 title: '❌ المسافر رفض النقل',
//                 body: 'المسافر رفض طلب نقله لناقل آخر.',
//                 data: { type: 'booking_transfer_rejected_by_passenger', bookingId },
//             });

//             toast({ title: 'تم رفض النقل', description: 'الحجز سيبقى مع الناقل الأصلي.' });
//         } catch (error: any) {
//             toast({ variant: 'destructive', title: 'فشل الرفض', description: error?.message });
//         } finally {
//             setLoading(null);
//         }
//     };

//     return (
//         <div className="rounded-2xl border-2 border-amber-500/30 bg-amber-500/5 overflow-hidden">
//             {/* Header */}
//             <div className="bg-amber-500/10 px-4 py-3 flex items-center gap-2">
//                 <ArrowRightLeft className="h-4 w-4 text-amber-600 shrink-0" />
//                 <p className="text-sm font-black text-amber-700">ناقلك يريد نقلك لرحلة أخرى</p>
//             </div>

//             <div className="p-4 space-y-3">
//                 {/* تفاصيل الرحلة الجديدة */}
//                 <div className="space-y-2 flex flex-wrap ">
//                     <div className="flex items-center w-1/2 gap-2 text-sm">
//                         <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
//                         <span className="font-bold flex items-center gap-2">{origin}
//                             <ArrowLeft className='size-3' />
//                             {dest}</span>
//                     </div>

//                     <div className="flex items-center w-1/2  gap-2 text-sm">
//                         <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
//                         <span className="text-muted-foreground">الناقل الجديد:</span>
//                         <span className="font-bold">{tripDetails.newCarrierName}</span>
//                     </div>

//                     {departureDate && (
//                         <div className="flex items-center w-1/2 gap-2 text-sm ">
//                             <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
//                             <span className="text-muted-foreground">التاريخ:</span>
//                             <span className="font-bold">
//                                 {new Date(departureDate).toLocaleDateString('ar-SA')}
//                             </span>
//                         </div>
//                     )}

//                     {departureTime && (
//                         <div className="flex items-center w-1/2 gap-2 text-sm ">
//                             <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
//                             <span className="text-muted-foreground">وقت الانطلاق:</span>
//                             <span className="font-bold">{departureTime}</span>
//                         </div>
//                     )}

//                     {meetingPoint && (
//                         <div className="flex items-center w-1/2 gap-2 text-sm">
//                             <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0 " />
//                             <span className="text-muted-foreground">نقطة الانطلاق:</span>
//                             <div className="flex items-center gap-1.5 ">
//                                 <span className="font-bold">{meetingPoint}</span>
//                                 {meetingPointLink && (
//                                     <a
//                                         href={meetingPointLink}
//                                         target="_blank"
//                                         rel="noopener noreferrer"
//                                         className="inline-flex items-center gap-1 text-xs font-black text-black bg-[#A18E64] hover:bg-[#a18e64b1] px-2 py-0.5 rounded-lg transition-all"
//                                     >
//                                         <MapPin className="h-3 w-3" /> افتح الخريطة
//                                     </a>
//                                 )}
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 <p className="text-xs text-muted-foreground border-t border-border/50 pt-3">
//                     بموافقتك، سيُرسل طلب للناقل الجديد، وبعد موافقته وتأكيد العربون ستنتقل تذكرتك تلقائياً.
//                 </p>

//                 {/* أزرار الموافقة والرفض */}
//                 <div className="grid grid-cols-2 gap-2 pt-1">
//                     <Button
//                         className="h-11 bg-green-600 hover:bg-green-700 text-white font-black rounded-xl gap-1.5 text-sm"
//                         onClick={handleAccept}
//                         disabled={!!loading}
//                     >
//                         {loading === 'accept'
//                             ? <Loader2 className="h-4 w-4 animate-spin" />
//                             : <><CheckCircle2 className="h-4 w-4" /> موافق</>
//                         }
//                     </Button>
//                     <Button
//                         variant="outline"
//                         className="h-11 border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 font-black rounded-xl text-sm gap-1.5"
//                         onClick={handleReject}
//                         disabled={!!loading}
//                     >
//                         {loading === 'reject'
//                             ? <Loader2 className="h-4 w-4 animate-spin" />
//                             : <><XCircle className="h-4 w-4" /> رفض</>
//                         }
//                     </Button>
//                 </div>
//             </div>
//         </div>
//     );
// }
'use client';

/**
 * @component BookingTransferPassengerCard
 * @description كارد يُعرض للمسافر للموافقة أو الرفض على طلب نقله لناقل آخر
 * يظهر في صفحة حجوزات المسافر (my-bookings / history / trip-card)
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFirestore, useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { doc, updateDoc, serverTimestamp, addDoc, collection, getDoc } from 'firebase/firestore';
import { sendPush } from '@/lib/send-push';
import { ArrowRightLeft, CheckCircle2, XCircle, Loader2, MapPin, Calendar, Clock, User } from 'lucide-react';
import { useLocale } from 'next-intl';
import { getCityName } from '@/lib/constants';

interface BookingTransferPassengerCardProps {
    transferRequestId: string;
    bookingId: string;
    fromCarrierId: string;
    toCarrierId: string;
    toCarrierTripId: string;
    tripDetails: {
        origin: string;
        destination: string;
        newDepartureDate?: string | null;
        newDepartureTime?: string | null;
        newMeetingPoint?: string | null;
        newMeetingPointLink?: string | null;
        newCarrierName: string;
        passengerCount: number;
    };
}

export function BookingTransferPassengerCard({
    transferRequestId,
    bookingId,
    fromCarrierId,
    toCarrierId,
    toCarrierTripId,
    tripDetails,
}: BookingTransferPassengerCardProps) {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const locale = useLocale();
    const [loading, setLoading] = useState<'accept' | 'reject' | null>(null);

    // جلب بيانات الرحلة الجديدة مباشرة من Firestore كـ fallback
    // (بعض الطلبات القديمة مش فيها newDepartureTime أو newMeetingPointLink)
    const [liveTrip, setLiveTrip] = useState<Record<string, any> | null>(null);
    useEffect(() => {
        if (!firestore || !toCarrierTripId) return;
        getDoc(doc(firestore, 'trips', toCarrierTripId)).then((snap) => {
            if (snap.exists()) setLiveTrip(snap.data());
        });
    }, [firestore, toCarrierTripId]);

    // دمج بيانات tripDetails مع الـ liveTrip: tripDetails له الأولوية لو موجود
    // الوقت مش بيتحفظ كحقل منفصل في Firestore — بيتدمج داخل departureDate كـ ISO string
    const rawDate = liveTrip?.departureDate;
    let extractedTime: string | null = null;
    if (rawDate) {
        try {
            const d = typeof rawDate?.toDate === 'function'
                ? rawDate.toDate()
                : new Date(typeof rawDate === 'object' && 'seconds' in rawDate
                    ? rawDate.seconds * 1000
                    : rawDate);
            if (!isNaN(d.getTime())) {
                const h = d.getHours().toString().padStart(2, '0');
                const m = d.getMinutes().toString().padStart(2, '0');
                extractedTime = `${h}:${m}`;
            }
        } catch { extractedTime = null; }
    }

    const departureTime = tripDetails.newDepartureTime || liveTrip?.departureTime || extractedTime || null;
    const meetingPointLink = tripDetails.newMeetingPointLink || liveTrip?.meetingPointLink || null;
    const meetingPoint = tripDetails.newMeetingPoint || liveTrip?.meetingPoint || null;
    const departureDate = tripDetails.newDepartureDate || liveTrip?.departureDate || null;

    const origin = getCityName(tripDetails.origin, locale);
    const dest = getCityName(tripDetails.destination, locale);

    const handleAccept = async () => {
        if (!firestore || !user) return;
        setLoading('accept');
        try {
            // 1. تحديث حالة طلب النقل → pending_carrier (ينتظر الناقل الجديد)
            await updateDoc(doc(firestore, 'bookingTransferRequests', transferRequestId), {
                status: 'pending_carrier',
                passengerAcceptedAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            // 2. إشعار للناقل الجديد
            await addDoc(collection(doc(firestore, 'users', toCarrierId), 'notifications'), {
                userId: toCarrierId,
                title: '✅ مسافر جديد يريد الانضمام لرحلتك',
                message: `وافق المسافر على النقل. الرجاء مراجعة الطلب والموافقة على استقباله في رحلتك.`,
                type: 'booking_transfer_to_carrier',
                bookingTransferRequestId: transferRequestId,
                bookingId: bookingId,
                isRead: false,
                link: `/${locale}/carrier/bookings`,
                createdAt: serverTimestamp(),
            });

            await sendPush({
                userId: toCarrierId,
                title: '✅ مسافر جديد يريد الانضمام',
                body: 'وافق المسافر على الانتقال لرحلتك. راجع الطلب الآن.',
                data: { type: 'booking_transfer_to_carrier', bookingTransferRequestId: transferRequestId },
            });

            toast({ title: '✅ تم قبول النقل', description: 'سيتواصل معك الناقل الجديد قريباً.' });
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'فشل القبول', description: error?.message });
        } finally {
            setLoading(null);
        }
    };

    const handleReject = async () => {
        if (!firestore || !user) return;
        setLoading('reject');
        try {
            // 1. رفض الطلب
            await updateDoc(doc(firestore, 'bookingTransferRequests', transferRequestId), {
                status: 'rejected_by_passenger',
                passengerRejectedAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            // 2. إشعار للناقل الأصلي بأن المسافر رفض
            await addDoc(collection(doc(firestore, 'users', fromCarrierId), 'notifications'), {
                userId: fromCarrierId,
                title: '❌ المسافر رفض النقل',
                message: 'المسافر لا يريد الانتقال لناقل آخر.',
                type: 'booking_transfer_rejected_by_passenger',
                bookingId: bookingId,
                isRead: false,
                link: `/${locale}/carrier/bookings`,
                createdAt: serverTimestamp(),
            });

            await sendPush({
                userId: fromCarrierId,
                title: '❌ المسافر رفض النقل',
                body: 'المسافر رفض طلب نقله لناقل آخر.',
                data: { type: 'booking_transfer_rejected_by_passenger', bookingId },
            });

            toast({ title: 'تم رفض النقل', description: 'الحجز سيبقى مع الناقل الأصلي.' });
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'فشل الرفض', description: error?.message });
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="rounded-2xl border-2 border-amber-500/30 bg-amber-500/5 overflow-hidden">
            {/* Header */}
            <div className="bg-amber-500/10 px-4 py-3 flex items-center gap-2">
                <ArrowRightLeft className="h-4 w-4 text-amber-600 shrink-0" />
                <p className="text-sm font-black text-amber-700">ناقلك يريد نقلك لرحلة أخرى</p>
            </div>

            <div className="p-4 space-y-3">
                {/* تفاصيل الرحلة الجديدة */}
                <div className="space-y-2 flex flex-wrap">
                    <div className="flex items-center w-1/2 gap-2 text-sm">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="font-bold">{origin} → {dest}</span>
                    </div>

                    <div className="flex items-center w-1/2 gap-2 text-sm">
                        <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="text-muted-foreground">الناقل الجديد:</span>
                        <span className="font-bold">{tripDetails.newCarrierName}</span>
                    </div>

                    {departureDate && (
                        <div className="flex items-center w-1/2 gap-2 text-sm">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <span className="text-muted-foreground">التاريخ:</span>
                            <span className="font-bold">
                                {(() => {
                                    try {
                                        const d = typeof (departureDate as any)?.toDate === 'function'
                                            ? (departureDate as any).toDate()
                                            : new Date(typeof departureDate === 'object' && 'seconds' in (departureDate as any)
                                                ? (departureDate as any).seconds * 1000
                                                : departureDate as string);
                                        return d.toLocaleDateString('ar-SA');
                                    } catch { return '—'; }
                                })()}
                            </span>
                        </div>
                    )}

                    {departureTime && (
                        <div className="flex items-center w-1/2 gap-2 text-sm">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <span className="text-muted-foreground">وقت الانطلاق:</span>
                            <span className="font-bold">{departureTime}</span>
                        </div>
                    )}

                    {meetingPoint && (
                        <div className="flex items-center w-1/2 gap-2 text-sm">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <span className="text-muted-foreground">نقطة الانطلاق:</span>
                            <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-bold">{meetingPoint}</span>
                                {meetingPointLink && (
                                    <a
                                        href={meetingPointLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-xs font-black text-black bg-[#A18E64] hover:bg-[#a18e64b1] px-2 py-0.5 rounded-lg transition-all"
                                    >
                                        <MapPin className="h-3 w-3" /> افتح الخريطة
                                    </a>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <p className="text-xs text-muted-foreground border-t border-border/50 pt-3">
                    بموافقتك، سيُرسل طلب للناقل الجديد، وبعد موافقته وتأكيد العربون ستنتقل تذكرتك تلقائياً.
                </p>

                {/* أزرار الموافقة والرفض */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                    <Button
                        className="h-11 bg-green-600 hover:bg-green-700 text-white font-black rounded-xl gap-1.5 text-sm"
                        onClick={handleAccept}
                        disabled={!!loading}
                    >
                        {loading === 'accept'
                            ? <Loader2 className="h-4 w-4 animate-spin" />
                            : <><CheckCircle2 className="h-4 w-4" /> موافق</>
                        }
                    </Button>
                    <Button
                        variant="outline"
                        className="h-11 border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 font-black rounded-xl text-sm gap-1.5"
                        onClick={handleReject}
                        disabled={!!loading}
                    >
                        {loading === 'reject'
                            ? <Loader2 className="h-4 w-4 animate-spin" />
                            : <><XCircle className="h-4 w-4" /> رفض</>
                        }
                    </Button>
                </div>
            </div>
        </div>
    );
}