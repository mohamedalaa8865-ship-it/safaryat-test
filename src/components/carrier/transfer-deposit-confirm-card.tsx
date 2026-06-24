// // // // 'use client';

// // // // import { useState } from 'react';
// // // // import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
// // // // import { Button } from '../ui/button';
// // // // import { Badge } from '../ui/badge';
// // // // import { useToast } from '@/hooks/use-toast';
// // // // import type { TransferRequest } from '@/lib/data';
// // // // import {
// // // //     Users, Calendar, ArrowRight, CheckCircle2, Loader2,
// // // //     Banknote, MessageSquare, Clock
// // // // } from 'lucide-react';
// // // // import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
// // // // import { doc, updateDoc, serverTimestamp, addDoc, collection, getDocs, query, where, arrayUnion, arrayRemove } from 'firebase/firestore';
// // // // import { Avatar, AvatarFallback } from '../ui/avatar';
// // // // import { Skeleton } from '../ui/skeleton';
// // // // import { sendPush } from '@/lib/send-push';
// // // // import { getCityName } from '@/lib/constants';
// // // // import { useLocale } from 'next-intl';
// // // // import { useUser } from '@/firebase';

// // // // function FromCarrierInfo({ carrierId }: { carrierId: string }) {
// // // //     const firestore = useFirestore();
// // // //     const carrierRef = useMemoFirebase(() => {
// // // //         if (!firestore) return null;
// // // //         return doc(firestore, 'users', carrierId);
// // // //     }, [firestore, carrierId]);
// // // //     const { data: carrier, isLoading } = useDoc<any>(carrierRef);

// // // //     if (isLoading) {
// // // //         return (
// // // //             <div className="flex items-center gap-2">
// // // //                 <Skeleton className="h-8 w-8 rounded-full" />
// // // //                 <Skeleton className="h-4 w-28" />
// // // //             </div>
// // // //         );
// // // //     }
// // // //     if (!carrier) return <p className="text-sm text-muted-foreground">ناقل غير معروف</p>;

// // // //     return (
// // // //         <div className="flex items-center gap-3">
// // // //             <Avatar className="h-9 w-9 border-2 border-primary/30">
// // // //                 <AvatarFallback className="bg-primary/10 text-primary font-bold">
// // // //                     {carrier.firstName?.charAt(0) || 'C'}
// // // //                 </AvatarFallback>
// // // //             </Avatar>
// // // //             <div>
// // // //                 <p className="text-sm font-bold">{carrier.firstName} {carrier.lastName}</p>
// // // //                 <p className="text-xs text-muted-foreground">الناقل الأصلي</p>
// // // //             </div>
// // // //         </div>
// // // //     );
// // // // }

// // // // interface TransferDepositConfirmCardProps {
// // // //     request: TransferRequest;
// // // //     onCompleted?: () => void;
// // // // }

// // // // /**
// // // //  * @component TransferDepositConfirmCard
// // // //  * @description يظهر للناقل المستلم لتأكيد استلام العربون وإتمام النقل الكامل للرحلة والمحادثات
// // // //  */
// // // // export function TransferDepositConfirmCard({ request, onCompleted }: TransferDepositConfirmCardProps) {
// // // //     const firestore = useFirestore();
// // // //     const { user } = useUser();
// // // //     const { toast } = useToast();
// // // //     const locale = useLocale();
// // // //     const [isConfirming, setIsConfirming] = useState(false);

// // // //     const depositAmount = request.depositAmount || 0;
// // // //     const currency = request.currency || 'JOD';
// // // //     const { tripDetails } = request;

// // // //     const handleConfirmReceived = async () => {
// // // //         if (!firestore || !user) return;
// // // //         setIsConfirming(true);
// // // //         try {
// // // //             const oldCarrierId = request.fromCarrierId;
// // // //             const newCarrierId = user.uid;

// // // //             // 1. تحديث حالة طلب النقل → completed
// // // //             await updateDoc(doc(firestore, 'transferRequests', request.id), {
// // // //                 status: 'completed',
// // // //                 depositConfirmedAt: serverTimestamp(),
// // // //                 updatedAt: serverTimestamp(),
// // // //             });

// // // //             // 2. نقل الرحلة للناقل الجديد
// // // //             await updateDoc(doc(firestore, 'trips', request.tripId), {
// // // //                 carrierId: newCarrierId,
// // // //                 originalCarrierId: oldCarrierId,
// // // //                 transferStatus: 'Transferred',
// // // //                 updatedAt: serverTimestamp(),
// // // //             });

// // // //             // 3. نقل الـ bookings للناقل الجديد
// // // //             const bookingsSnap = await getDocs(
// // // //                 query(collection(firestore, 'bookings'), where('tripId', '==', request.tripId))
// // // //             );
// // // //             await Promise.all(
// // // //                 bookingsSnap.docs.map((bSnap) =>
// // // //                     updateDoc(bSnap.ref, {
// // // //                         carrierId: newCarrierId,
// // // //                         updatedAt: serverTimestamp(),
// // // //                     })
// // // //                 )
// // // //             );

// // // //             // 4. نقل المشارك في كل الـ chats المرتبطة بالرحلة
// // // //             //    a. المجموعة (isGroupChat: true, tripId matches)
// // // //             //    b. الرسائل الخاصة بين المسافر والناقل القديم
// // // //             const chatsSnap = await getDocs(
// // // //                 query(collection(firestore, 'chats'), where('participants', 'array-contains', oldCarrierId))
// // // //             );

// // // //             await Promise.all(
// // // //                 chatsSnap.docs.map(async (chatSnap) => {
// // // //                     const chatData = chatSnap.data();
// // // //                     // نتحقق إن الشات مرتبط بهذه الرحلة أو بالـ booking الخاص بيها
// // // //                     const isRelated =
// // // //                         chatData.tripId === request.tripId ||
// // // //                         bookingsSnap.docs.some(b => b.id === chatData.bookingId || chatData.tripId === request.tripId);

// // // //                     if (isRelated) {
// // // //                         // أضف الناقل الجديد واحذف القديم
// // // //                         await updateDoc(chatSnap.ref, {
// // // //                             participants: arrayUnion(newCarrierId),
// // // //                         });
// // // //                         await updateDoc(chatSnap.ref, {
// // // //                             participants: arrayRemove(oldCarrierId),
// // // //                         });
// // // //                     }
// // // //                 })
// // // //             );

// // // //             // 5. إشعار للناقل الأصلي بإتمام النقل
// // // //             await addDoc(collection(doc(firestore, 'users', oldCarrierId), 'notifications'), {
// // // //                 userId: oldCarrierId,
// // // //                 title: '✅ تم نقل الرحلة بنجاح',
// // // //                 message: 'أكد الناقل استلام العربون وتمت عملية نقل الرحلة بنجاح',
// // // //                 type: 'transfer_completed',
// // // //                 tripId: request.tripId,
// // // //                 isRead: false,
// // // //                 createdAt: serverTimestamp(),
// // // //             });

// // // //             await sendPush({
// // // //                 userId: oldCarrierId,
// // // //                 title: '✅ تم نقل الرحلة بنجاح',
// // // //                 body: 'أكد الناقل استلام العربون وتمت عملية نقل الرحلة',
// // // //                 data: { type: 'transfer_completed', tripId: request.tripId },
// // // //             });

// // // //             // 6. إشعار للمسافرين المرتبطين بالرحلة
// // // //             await Promise.all(
// // // //                 bookingsSnap.docs.map(async (bSnap) => {
// // // //                     const booking = bSnap.data();
// // // //                     const passengerId = booking.userId || booking.agentId;
// // // //                     if (!passengerId) return;
// // // //                     await addDoc(collection(doc(firestore, 'users', passengerId), 'notifications'), {
// // // //                         userId: passengerId,
// // // //                         title: '🚗 تغيير في ناقل رحلتك',
// // // //                         message: 'تم تحويل رحلتك لناقل جديد. جميع تفاصيل الرحلة محفوظة.',
// // // //                         type: 'trip_carrier_changed',
// // // //                         tripId: request.tripId,
// // // //                         bookingId: bSnap.id,
// // // //                         isRead: false,
// // // //                         link: `/history`,
// // // //                         createdAt: serverTimestamp(),
// // // //                     });
// // // //                 })
// // // //             );

// // // //             toast({ title: '✅ تم تأكيد استلام العربون وإتمام نقل الرحلة' });
// // // //             onCompleted?.();
// // // //         } catch (error: any) {
// // // //             console.error('[TransferDepositConfirm] Error:', error);
// // // //             toast({ variant: 'destructive', title: 'فشل تأكيد الاستلام', description: error?.message });
// // // //         } finally {
// // // //             setIsConfirming(false);
// // // //         }
// // // //     };

// // // //     return (
// // // //         <Card className="w-full shadow-lg border-2 border-emerald-500/60 bg-emerald-500/5">
// // // //             {/* شريط علوي */}
// // // //             <div className="h-1 rounded-t-xl bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-400" />

// // // //             <CardHeader className="pb-3">
// // // //                 <div className="flex items-center justify-between">
// // // //                     <CardTitle className="text-base flex items-center gap-2">
// // // //                         <Banknote className="h-4 w-4 text-emerald-600" />
// // // //                         العربون في طريقه إليك
// // // //                     </CardTitle>
// // // //                     <Badge className="bg-amber-500/15 text-amber-700 border-amber-500/30 text-xs">
// // // //                         <Clock className="h-3 w-3 ml-1" />
// // // //                         في الانتظار
// // // //                     </Badge>
// // // //                 </div>
// // // //                 <CardDescription className="text-xs">
// // // //                     أكد الناقل إرسال العربون — تحقق من حسابك وأكد الاستلام لإتمام نقل الرحلة
// // // //                 </CardDescription>
// // // //             </CardHeader>

// // // //             <CardContent className="space-y-3">
// // // //                 <FromCarrierInfo carrierId={request.fromCarrierId} />

// // // //                 {/* تفاصيل الرحلة */}
// // // //                 <div className="flex items-center justify-center font-bold text-base bg-muted/50 rounded-xl p-3">
// // // //                     <span>{getCityName(tripDetails.origin, locale)}</span>
// // // //                     <ArrowRight className="mx-2 h-4 w-4 text-primary" />
// // // //                     <span>{getCityName(tripDetails.destination, locale)}</span>
// // // //                 </div>

// // // //                 <div className="grid grid-cols-2 gap-2 text-sm">
// // // //                     <div className="p-2 bg-muted rounded-lg flex items-center justify-center gap-2">
// // // //                         <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
// // // //                         <span className="text-xs font-medium">
// // // //                             {new Date(tripDetails.departureDate).toLocaleDateString('ar-SA')}
// // // //                         </span>
// // // //                     </div>
// // // //                     <div className="p-2 bg-muted rounded-lg flex items-center justify-center gap-2">
// // // //                         <Users className="h-3.5 w-3.5 text-muted-foreground" />
// // // //                         <span className="text-xs font-medium">{tripDetails.passengerCount} ركاب</span>
// // // //                     </div>
// // // //                 </div>

// // // //                 {/* مبلغ العربون */}
// // // //                 {depositAmount > 0 && (
// // // //                     <div className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
// // // //                         <div>
// // // //                             <p className="text-[10px] text-muted-foreground">مبلغ العربون المُرسَل</p>
// // // //                             <p className="text-xl font-black text-emerald-700">{depositAmount} <span className="text-sm">{currency}</span></p>
// // // //                         </div>
// // // //                         <CheckCircle2 className="h-8 w-8 text-emerald-500" />
// // // //                     </div>
// // // //                 )}

// // // //                 {/* ما سيحدث بعد التأكيد */}
// // // //                 <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl space-y-1">
// // // //                     <p className="text-xs font-bold text-blue-700 flex items-center gap-1.5">
// // // //                         <MessageSquare className="h-3.5 w-3.5" />
// // // //                         بعد تأكيد الاستلام:
// // // //                     </p>
// // // //                     <ul className="text-xs text-muted-foreground space-y-0.5 pr-2">
// // // //                         <li>• تُحوَّل الرحلة إليك فوراً</li>
// // // //                         <li>• تظهر محادثات المجموعة في قسم رسائلك</li>
// // // //                         <li>• تصلك الرسائل الخاصة مع كل مسافر</li>
// // // //                         <li>• يُشعَر الناقل الأصلي والمسافرون بالتحويل</li>
// // // //                     </ul>
// // // //                 </div>
// // // //             </CardContent>

// // // //             <CardFooter className="pt-2">
// // // //                 <Button
// // // //                     className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
// // // //                     onClick={handleConfirmReceived}
// // // //                     disabled={isConfirming}
// // // //                 >
// // // //                     {isConfirming
// // // //                         ? <><Loader2 className="h-4 w-4 animate-spin ml-2" /> جاري التأكيد...</>
// // // //                         : <><CheckCircle2 className="h-4 w-4 ml-2" /> استلمت العربون — أتمم النقل</>
// // // //                     }
// // // //                 </Button>
// // // //             </CardFooter>
// // // //         </Card>
// // // //     );
// // // // }
// // // 'use client';

// // // import { useState } from 'react';
// // // import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
// // // import { Button } from '../ui/button';
// // // import { Badge } from '../ui/badge';
// // // import { useToast } from '@/hooks/use-toast';
// // // import type { TransferRequest } from '@/lib/data';
// // // import {
// // //     Users, Calendar, ArrowRight, CheckCircle2, Loader2,
// // //     Banknote, MessageSquare, Clock
// // // } from 'lucide-react';
// // // import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
// // // import { doc, updateDoc, serverTimestamp, addDoc, collection, getDocs, query, where, arrayUnion, arrayRemove } from 'firebase/firestore';
// // // import { Avatar, AvatarFallback } from '../ui/avatar';
// // // import { Skeleton } from '../ui/skeleton';
// // // import { sendPush } from '@/lib/send-push';
// // // import { getCityName } from '@/lib/constants';
// // // import { useLocale } from 'next-intl';
// // // import { useUser } from '@/firebase';

// // // function FromCarrierInfo({ carrierId }: { carrierId: string }) {
// // //     const firestore = useFirestore();
// // //     const carrierRef = useMemoFirebase(() => {
// // //         if (!firestore) return null;
// // //         return doc(firestore, 'users', carrierId);
// // //     }, [firestore, carrierId]);
// // //     const { data: carrier, isLoading } = useDoc<any>(carrierRef);

// // //     if (isLoading) {
// // //         return (
// // //             <div className="flex items-center gap-2">
// // //                 <Skeleton className="h-8 w-8 rounded-full" />
// // //                 <Skeleton className="h-4 w-28" />
// // //             </div>
// // //         );
// // //     }
// // //     if (!carrier) return <p className="text-sm text-muted-foreground">ناقل غير معروف</p>;

// // //     return (
// // //         <div className="flex items-center gap-3">
// // //             <Avatar className="h-9 w-9 border-2 border-primary/30">
// // //                 <AvatarFallback className="bg-primary/10 text-primary font-bold">
// // //                     {carrier.firstName?.charAt(0) || 'C'}
// // //                 </AvatarFallback>
// // //             </Avatar>
// // //             <div>
// // //                 <p className="text-sm font-bold">{carrier.firstName} {carrier.lastName}</p>
// // //                 <p className="text-xs text-muted-foreground">الناقل الأصلي</p>
// // //             </div>
// // //         </div>
// // //     );
// // // }

// // // interface TransferDepositConfirmCardProps {
// // //     request: TransferRequest;
// // //     onCompleted?: () => void;
// // // }

// // // /**
// // //  * @component TransferDepositConfirmCard
// // //  * @description يظهر للناقل المستلم لتأكيد استلام العربون وإتمام النقل الكامل للرحلة والمحادثات
// // //  */
// // // export function TransferDepositConfirmCard({ request, onCompleted }: TransferDepositConfirmCardProps) {
// // //     const firestore = useFirestore();
// // //     const { user } = useUser();
// // //     const { toast } = useToast();
// // //     const locale = useLocale();
// // //     const [isConfirming, setIsConfirming] = useState(false);

// // //     const depositAmount = request.depositAmount || 0;
// // //     const currency = request.currency || 'JOD';
// // //     const { tripDetails } = request;

// // //     const handleConfirmReceived = async () => {
// // //         if (!firestore || !user) return;
// // //         setIsConfirming(true);
// // //         try {
// // //             const oldCarrierId = request.fromCarrierId;
// // //             const newCarrierId = user.uid;

// // //             // 1. تحديث حالة طلب النقل → completed
// // //             await updateDoc(doc(firestore, 'transferRequests', request.id), {
// // //                 status: 'completed',
// // //                 depositConfirmedAt: serverTimestamp(),
// // //                 updatedAt: serverTimestamp(),
// // //             });

// // //             // 2. نقل الرحلة للناقل الجديد
// // //             // [FIX-TRANSFER-DUPE]: إضافة status: 'Transferred' لإخفاء الرحلة من داشبورد المسافرين
// // //             // الرحلة الأصلية تنتقل للناقل الجديد وتختفي من نتائج البحث العامة (status != 'Planned'|'Has_Offers'|'Negotiating')
// // //             await updateDoc(doc(firestore, 'trips', request.tripId), {
// // //                 carrierId: newCarrierId,
// // //                 originalCarrierId: oldCarrierId,
// // //                 transferStatus: 'Transferred',
// // //                 status: 'Transferred',
// // //                 updatedAt: serverTimestamp(),
// // //             });

// // //             // 3. نقل الـ bookings للناقل الجديد
// // //             const bookingsSnap = await getDocs(
// // //                 query(collection(firestore, 'bookings'), where('tripId', '==', request.tripId))
// // //             );
// // //             await Promise.all(
// // //                 bookingsSnap.docs.map((bSnap) =>
// // //                     updateDoc(bSnap.ref, {
// // //                         carrierId: newCarrierId,
// // //                         updatedAt: serverTimestamp(),
// // //                     })
// // //                 )
// // //             );

// // //             // 4. نقل المشارك في كل الـ chats المرتبطة بالرحلة
// // //             //    a. المجموعة (isGroupChat: true, tripId matches)
// // //             //    b. الرسائل الخاصة بين المسافر والناقل القديم
// // //             const chatsSnap = await getDocs(
// // //                 query(collection(firestore, 'chats'), where('participants', 'array-contains', oldCarrierId))
// // //             );

// // //             await Promise.all(
// // //                 chatsSnap.docs.map(async (chatSnap) => {
// // //                     const chatData = chatSnap.data();
// // //                     // نتحقق إن الشات مرتبط بهذه الرحلة أو بالـ booking الخاص بيها
// // //                     const isRelated =
// // //                         chatData.tripId === request.tripId ||
// // //                         bookingsSnap.docs.some(b => b.id === chatData.bookingId || chatData.tripId === request.tripId);

// // //                     if (isRelated) {
// // //                         // أضف الناقل الجديد واحذف القديم
// // //                         await updateDoc(chatSnap.ref, {
// // //                             participants: arrayUnion(newCarrierId),
// // //                         });
// // //                         await updateDoc(chatSnap.ref, {
// // //                             participants: arrayRemove(oldCarrierId),
// // //                         });
// // //                     }
// // //                 })
// // //             );

// // //             // 5. إشعار للناقل الأصلي بإتمام النقل
// // //             await addDoc(collection(doc(firestore, 'users', oldCarrierId), 'notifications'), {
// // //                 userId: oldCarrierId,
// // //                 title: '✅ تم نقل الرحلة بنجاح',
// // //                 message: 'أكد الناقل استلام العربون وتمت عملية نقل الرحلة بنجاح',
// // //                 type: 'transfer_completed',
// // //                 tripId: request.tripId,
// // //                 isRead: false,
// // //                 createdAt: serverTimestamp(),
// // //             });

// // //             await sendPush({
// // //                 userId: oldCarrierId,
// // //                 title: '✅ تم نقل الرحلة بنجاح',
// // //                 body: 'أكد الناقل استلام العربون وتمت عملية نقل الرحلة',
// // //                 data: { type: 'transfer_completed', tripId: request.tripId },
// // //             });

// // //             // 6. إشعار للمسافرين المرتبطين بالرحلة
// // //             await Promise.all(
// // //                 bookingsSnap.docs.map(async (bSnap) => {
// // //                     const booking = bSnap.data();
// // //                     const passengerId = booking.userId || booking.agentId;
// // //                     if (!passengerId) return;
// // //                     await addDoc(collection(doc(firestore, 'users', passengerId), 'notifications'), {
// // //                         userId: passengerId,
// // //                         title: '🚗 تغيير في ناقل رحلتك',
// // //                         message: 'تم تحويل رحلتك لناقل جديد. جميع تفاصيل الرحلة محفوظة.',
// // //                         type: 'trip_carrier_changed',
// // //                         tripId: request.tripId,
// // //                         bookingId: bSnap.id,
// // //                         isRead: false,
// // //                         link: `/history`,
// // //                         createdAt: serverTimestamp(),
// // //                     });
// // //                 })
// // //             );

// // //             toast({ title: '✅ تم تأكيد استلام العربون وإتمام نقل الرحلة' });
// // //             onCompleted?.();
// // //         } catch (error: any) {
// // //             console.error('[TransferDepositConfirm] Error:', error);
// // //             toast({ variant: 'destructive', title: 'فشل تأكيد الاستلام', description: error?.message });
// // //         } finally {
// // //             setIsConfirming(false);
// // //         }
// // //     };

// // //     return (
// // //         <Card className="w-full shadow-lg border-2 border-emerald-500/60 bg-emerald-500/5">
// // //             {/* شريط علوي */}
// // //             <div className="h-1 rounded-t-xl bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-400" />

// // //             <CardHeader className="pb-3">
// // //                 <div className="flex items-center justify-between">
// // //                     <CardTitle className="text-base flex items-center gap-2">
// // //                         <Banknote className="h-4 w-4 text-emerald-600" />
// // //                         العربون في طريقه إليك
// // //                     </CardTitle>
// // //                     <Badge className="bg-amber-500/15 text-amber-700 border-amber-500/30 text-xs">
// // //                         <Clock className="h-3 w-3 ml-1" />
// // //                         في الانتظار
// // //                     </Badge>
// // //                 </div>
// // //                 <CardDescription className="text-xs">
// // //                     أكد الناقل إرسال العربون — تحقق من حسابك وأكد الاستلام لإتمام نقل الرحلة
// // //                 </CardDescription>
// // //             </CardHeader>

// // //             <CardContent className="space-y-3">
// // //                 <FromCarrierInfo carrierId={request.fromCarrierId} />

// // //                 {/* تفاصيل الرحلة */}
// // //                 <div className="flex items-center justify-center font-bold text-base bg-muted/50 rounded-xl p-3">
// // //                     <span>{getCityName(tripDetails.origin, locale)}</span>
// // //                     <ArrowRight className="mx-2 h-4 w-4 text-primary" />
// // //                     <span>{getCityName(tripDetails.destination, locale)}</span>
// // //                 </div>

// // //                 <div className="grid grid-cols-2 gap-2 text-sm">
// // //                     <div className="p-2 bg-muted rounded-lg flex items-center justify-center gap-2">
// // //                         <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
// // //                         <span className="text-xs font-medium">
// // //                             {new Date(tripDetails.departureDate).toLocaleDateString('ar-SA')}
// // //                         </span>
// // //                     </div>
// // //                     <div className="p-2 bg-muted rounded-lg flex items-center justify-center gap-2">
// // //                         <Users className="h-3.5 w-3.5 text-muted-foreground" />
// // //                         <span className="text-xs font-medium">{tripDetails.passengerCount} ركاب</span>
// // //                     </div>
// // //                 </div>

// // //                 {/* مبلغ العربون */}
// // //                 {depositAmount > 0 && (
// // //                     <div className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
// // //                         <div>
// // //                             <p className="text-[10px] text-muted-foreground">مبلغ العربون المُرسَل</p>
// // //                             <p className="text-xl font-black text-emerald-700">{depositAmount} <span className="text-sm">{currency}</span></p>
// // //                         </div>
// // //                         <CheckCircle2 className="h-8 w-8 text-emerald-500" />
// // //                     </div>
// // //                 )}

// // //                 {/* ما سيحدث بعد التأكيد */}
// // //                 <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl space-y-1">
// // //                     <p className="text-xs font-bold text-blue-700 flex items-center gap-1.5">
// // //                         <MessageSquare className="h-3.5 w-3.5" />
// // //                         بعد تأكيد الاستلام:
// // //                     </p>
// // //                     <ul className="text-xs text-muted-foreground space-y-0.5 pr-2">
// // //                         <li>• تُحوَّل الرحلة إليك فوراً</li>
// // //                         <li>• تظهر محادثات المجموعة في قسم رسائلك</li>
// // //                         <li>• تصلك الرسائل الخاصة مع كل مسافر</li>
// // //                         <li>• يُشعَر الناقل الأصلي والمسافرون بالتحويل</li>
// // //                     </ul>
// // //                 </div>
// // //             </CardContent>

// // //             <CardFooter className="pt-2">
// // //                 <Button
// // //                     className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
// // //                     onClick={handleConfirmReceived}
// // //                     disabled={isConfirming}
// // //                 >
// // //                     {isConfirming
// // //                         ? <><Loader2 className="h-4 w-4 animate-spin ml-2" /> جاري التأكيد...</>
// // //                         : <><CheckCircle2 className="h-4 w-4 ml-2" /> استلمت العربون — أتمم النقل</>
// // //                     }
// // //                 </Button>
// // //             </CardFooter>
// // //         </Card>
// // //     );
// // // }
// // 'use client';

// // import { useState } from 'react';
// // import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
// // import { Button } from '../ui/button';
// // import { Badge } from '../ui/badge';
// // import { useToast } from '@/hooks/use-toast';
// // import type { TransferRequest } from '@/lib/data';
// // import {
// //     Users, Calendar, ArrowRight, CheckCircle2, Loader2,
// //     Banknote, MessageSquare, Clock
// // } from 'lucide-react';
// // import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
// // import { doc, updateDoc, serverTimestamp, addDoc, collection, getDocs, query, where, arrayUnion, arrayRemove } from 'firebase/firestore';
// // import { Avatar, AvatarFallback } from '../ui/avatar';
// // import { Skeleton } from '../ui/skeleton';
// // import { sendPush } from '@/lib/send-push';
// // import { getCityName } from '@/lib/constants';
// // import { useLocale } from 'next-intl';
// // import { useUser } from '@/firebase';

// // function FromCarrierInfo({ carrierId }: { carrierId: string }) {
// //     const firestore = useFirestore();
// //     const carrierRef = useMemoFirebase(() => {
// //         if (!firestore) return null;
// //         return doc(firestore, 'users', carrierId);
// //     }, [firestore, carrierId]);
// //     const { data: carrier, isLoading } = useDoc<any>(carrierRef);

// //     if (isLoading) {
// //         return (
// //             <div className="flex items-center gap-2">
// //                 <Skeleton className="h-8 w-8 rounded-full" />
// //                 <Skeleton className="h-4 w-28" />
// //             </div>
// //         );
// //     }
// //     if (!carrier) return <p className="text-sm text-muted-foreground">ناقل غير معروف</p>;

// //     return (
// //         <div className="flex items-center gap-3">
// //             <Avatar className="h-9 w-9 border-2 border-primary/30">
// //                 <AvatarFallback className="bg-primary/10 text-primary font-bold">
// //                     {carrier.firstName?.charAt(0) || 'C'}
// //                 </AvatarFallback>
// //             </Avatar>
// //             <div>
// //                 <p className="text-sm font-bold">{carrier.firstName} {carrier.lastName}</p>
// //                 <p className="text-xs text-muted-foreground">الناقل الأصلي</p>
// //             </div>
// //         </div>
// //     );
// // }

// // interface TransferDepositConfirmCardProps {
// //     request: TransferRequest;
// //     onCompleted?: () => void;
// // }

// // /**
// //  * @component TransferDepositConfirmCard
// //  * @description يظهر للناقل المستلم لتأكيد استلام العربون وإتمام النقل الكامل للرحلة والمحادثات
// //  */
// // export function TransferDepositConfirmCard({ request, onCompleted }: TransferDepositConfirmCardProps) {
// //     const firestore = useFirestore();
// //     const { user } = useUser();
// //     const { toast } = useToast();
// //     const locale = useLocale();
// //     const [isConfirming, setIsConfirming] = useState(false);

// //     const depositAmount = request.depositAmount || 0;
// //     const currency = request.currency || 'JOD';
// //     const { tripDetails } = request;

// //     const handleConfirmReceived = async () => {
// //         if (!firestore || !user) return;
// //         setIsConfirming(true);
// //         try {
// //             const oldCarrierId = request.fromCarrierId;
// //             const newCarrierId = user.uid;
// //             // [FIX-TRANSFER-TRIP]: رحلة الناقل المستلم الموجودة على نفس الخط
// //             const toCarrierTripId: string | null = (request as any).toCarrierTripId || null;

// //             // 1. تحديث حالة طلب النقل → completed
// //             await updateDoc(doc(firestore, 'transferRequests', request.id), {
// //                 status: 'completed',
// //                 depositConfirmedAt: serverTimestamp(),
// //                 updatedAt: serverTimestamp(),
// //             });

// //             // 2. [FIX-TRANSFER-TRIP]: إخفاء الرحلة الأصلية من داشبورد المسافرين والناقل الأصلي
// //             //    نغير status إلى 'Transferred' بدل نقلها للناقل الجديد
// //             await updateDoc(doc(firestore, 'trips', request.tripId), {
// //                 originalCarrierId: oldCarrierId,
// //                 transferStatus: 'Transferred',
// //                 status: 'Transferred',
// //                 updatedAt: serverTimestamp(),
// //             });

// //             // 3. نقل الـ bookings للناقل الجديد
// //             //    لو عنده رحلة موجودة على نفس الخط → bookings تنتقل عليها (targetTripId)
// //             //    لو مفيش → نفضل على tripId الأصلي كـ fallback
// //             const targetTripId = toCarrierTripId || request.tripId;

// //             const bookingsSnap = await getDocs(
// //                 query(collection(firestore, 'bookings'), where('tripId', '==', request.tripId))
// //             );
// //             await Promise.all(
// //                 bookingsSnap.docs.map((bSnap) =>
// //                     updateDoc(bSnap.ref, {
// //                         carrierId: newCarrierId,
// //                         tripId: targetTripId,
// //                         updatedAt: serverTimestamp(),
// //                     })
// //                 )
// //             );

// //             // 3b. تحديث مقاعد رحلة الناقل المستلم لو موجودة
// //             if (toCarrierTripId) {
// //                 const toTripSnap = await getDocs(
// //                     query(collection(firestore, 'trips'), where('__name__', '==', toCarrierTripId))
// //                 );
// //                 if (!toTripSnap.empty) {
// //                     const toTripData = toTripSnap.docs[0].data();
// //                     const currentAvailable = toTripData.availableSeats || 0;
// //                     const transferredPassengers = bookingsSnap.docs.length;
// //                     await updateDoc(doc(firestore, 'trips', toCarrierTripId), {
// //                         availableSeats: Math.max(0, currentAvailable - transferredPassengers),
// //                         updatedAt: serverTimestamp(),
// //                     });
// //                 }
// //             }

// //             // 4. نقل المشارك في كل الـ chats المرتبطة بالرحلة
// //             //    a. المجموعة (isGroupChat: true, tripId matches)
// //             //    b. الرسائل الخاصة بين المسافر والناقل القديم
// //             const chatsSnap = await getDocs(
// //                 query(collection(firestore, 'chats'), where('participants', 'array-contains', oldCarrierId))
// //             );

// //             await Promise.all(
// //                 chatsSnap.docs.map(async (chatSnap) => {
// //                     const chatData = chatSnap.data();
// //                     // نتحقق إن الشات مرتبط بهذه الرحلة أو بالـ booking الخاص بيها
// //                     const isRelated =
// //                         chatData.tripId === request.tripId ||
// //                         bookingsSnap.docs.some(b => b.id === chatData.bookingId || chatData.tripId === request.tripId);

// //                     if (isRelated) {
// //                         // أضف الناقل الجديد واحذف القديم
// //                         await updateDoc(chatSnap.ref, {
// //                             participants: arrayUnion(newCarrierId),
// //                         });
// //                         await updateDoc(chatSnap.ref, {
// //                             participants: arrayRemove(oldCarrierId),
// //                         });
// //                     }
// //                 })
// //             );

// //             // 5. إشعار للناقل الأصلي بإتمام النقل
// //             await addDoc(collection(doc(firestore, 'users', oldCarrierId), 'notifications'), {
// //                 userId: oldCarrierId,
// //                 title: '✅ تم نقل الرحلة بنجاح',
// //                 message: 'أكد الناقل استلام العربون وتمت عملية نقل الرحلة بنجاح',
// //                 type: 'transfer_completed',
// //                 tripId: request.tripId,
// //                 isRead: false,
// //                 createdAt: serverTimestamp(),
// //             });

// //             await sendPush({
// //                 userId: oldCarrierId,
// //                 title: '✅ تم نقل الرحلة بنجاح',
// //                 body: 'أكد الناقل استلام العربون وتمت عملية نقل الرحلة',
// //                 data: { type: 'transfer_completed', tripId: request.tripId },
// //             });

// //             // 6. إشعار للمسافرين المرتبطين بالرحلة
// //             await Promise.all(
// //                 bookingsSnap.docs.map(async (bSnap) => {
// //                     const booking = bSnap.data();
// //                     const passengerId = booking.userId || booking.agentId;
// //                     if (!passengerId) return;
// //                     await addDoc(collection(doc(firestore, 'users', passengerId), 'notifications'), {
// //                         userId: passengerId,
// //                         title: '🚗 تغيير في ناقل رحلتك',
// //                         message: 'تم تحويل رحلتك لناقل جديد. جميع تفاصيل الرحلة محفوظة.',
// //                         type: 'trip_carrier_changed',
// //                         tripId: request.tripId,
// //                         bookingId: bSnap.id,
// //                         isRead: false,
// //                         link: `/history`,
// //                         createdAt: serverTimestamp(),
// //                     });
// //                 })
// //             );

// //             toast({ title: '✅ تم تأكيد استلام العربون وإتمام نقل الرحلة' });
// //             onCompleted?.();
// //         } catch (error: any) {
// //             console.error('[TransferDepositConfirm] Error:', error);
// //             toast({ variant: 'destructive', title: 'فشل تأكيد الاستلام', description: error?.message });
// //         } finally {
// //             setIsConfirming(false);
// //         }
// //     };

// //     return (
// //         <Card className="w-full shadow-lg border-2 border-emerald-500/60 bg-emerald-500/5">
// //             {/* شريط علوي */}
// //             <div className="h-1 rounded-t-xl bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-400" />

// //             <CardHeader className="pb-3">
// //                 <div className="flex items-center justify-between">
// //                     <CardTitle className="text-base flex items-center gap-2">
// //                         <Banknote className="h-4 w-4 text-emerald-600" />
// //                         العربون في طريقه إليك
// //                     </CardTitle>
// //                     <Badge className="bg-amber-500/15 text-amber-700 border-amber-500/30 text-xs">
// //                         <Clock className="h-3 w-3 ml-1" />
// //                         في الانتظار
// //                     </Badge>
// //                 </div>
// //                 <CardDescription className="text-xs">
// //                     أكد الناقل إرسال العربون — تحقق من حسابك وأكد الاستلام لإتمام نقل الرحلة
// //                 </CardDescription>
// //             </CardHeader>

// //             <CardContent className="space-y-3">
// //                 <FromCarrierInfo carrierId={request.fromCarrierId} />

// //                 {/* تفاصيل الرحلة */}
// //                 <div className="flex items-center justify-center font-bold text-base bg-muted/50 rounded-xl p-3">
// //                     <span>{getCityName(tripDetails.origin, locale)}</span>
// //                     <ArrowRight className="mx-2 h-4 w-4 text-primary" />
// //                     <span>{getCityName(tripDetails.destination, locale)}</span>
// //                 </div>

// //                 <div className="grid grid-cols-2 gap-2 text-sm">
// //                     <div className="p-2 bg-muted rounded-lg flex items-center justify-center gap-2">
// //                         <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
// //                         <span className="text-xs font-medium">
// //                             {new Date(tripDetails.departureDate).toLocaleDateString('ar-SA')}
// //                         </span>
// //                     </div>
// //                     <div className="p-2 bg-muted rounded-lg flex items-center justify-center gap-2">
// //                         <Users className="h-3.5 w-3.5 text-muted-foreground" />
// //                         <span className="text-xs font-medium">{tripDetails.passengerCount} ركاب</span>
// //                     </div>
// //                 </div>

// //                 {/* مبلغ العربون */}
// //                 {depositAmount > 0 && (
// //                     <div className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
// //                         <div>
// //                             <p className="text-[10px] text-muted-foreground">مبلغ العربون المُرسَل</p>
// //                             <p className="text-xl font-black text-emerald-700">{depositAmount} <span className="text-sm">{currency}</span></p>
// //                         </div>
// //                         <CheckCircle2 className="h-8 w-8 text-emerald-500" />
// //                     </div>
// //                 )}

// //                 {/* ما سيحدث بعد التأكيد */}
// //                 <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl space-y-1">
// //                     <p className="text-xs font-bold text-blue-700 flex items-center gap-1.5">
// //                         <MessageSquare className="h-3.5 w-3.5" />
// //                         بعد تأكيد الاستلام:
// //                     </p>
// //                     <ul className="text-xs text-muted-foreground space-y-0.5 pr-2">
// //                         <li>• تُحوَّل الرحلة إليك فوراً</li>
// //                         <li>• تظهر محادثات المجموعة في قسم رسائلك</li>
// //                         <li>• تصلك الرسائل الخاصة مع كل مسافر</li>
// //                         <li>• يُشعَر الناقل الأصلي والمسافرون بالتحويل</li>
// //                     </ul>
// //                 </div>
// //             </CardContent>

// //             <CardFooter className="pt-2">
// //                 <Button
// //                     className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
// //                     onClick={handleConfirmReceived}
// //                     disabled={isConfirming}
// //                 >
// //                     {isConfirming
// //                         ? <><Loader2 className="h-4 w-4 animate-spin ml-2" /> جاري التأكيد...</>
// //                         : <><CheckCircle2 className="h-4 w-4 ml-2" /> استلمت العربون — أتمم النقل</>
// //                     }
// //                 </Button>
// //             </CardFooter>
// //         </Card>
// //     );
// // }
// // }
// 'use client';

// import { useState } from 'react';
// import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
// import { Button } from '../ui/button';
// import { Badge } from '../ui/badge';
// import { useToast } from '@/hooks/use-toast';
// import type { TransferRequest } from '@/lib/data';
// import {
//     Users, Calendar, ArrowRight, CheckCircle2, Loader2,
//     Banknote, MessageSquare, Clock
// } from 'lucide-react';
// import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
// import { doc, updateDoc, serverTimestamp, addDoc, collection, getDocs, query, where, arrayUnion, arrayRemove } from 'firebase/firestore';
// import { Avatar, AvatarFallback } from '../ui/avatar';
// import { Skeleton } from '../ui/skeleton';
// import { sendPush } from '@/lib/send-push';
// import { getCityName } from '@/lib/constants';
// import { useLocale } from 'next-intl';
// import { useUser } from '@/firebase';

// function FromCarrierInfo({ carrierId }: { carrierId: string }) {
//     const firestore = useFirestore();
//     const carrierRef = useMemoFirebase(() => {
//         if (!firestore) return null;
//         return doc(firestore, 'users', carrierId);
//     }, [firestore, carrierId]);
//     const { data: carrier, isLoading } = useDoc<any>(carrierRef);

//     if (isLoading) {
//         return (
//             <div className="flex items-center gap-2">
//                 <Skeleton className="h-8 w-8 rounded-full" />
//                 <Skeleton className="h-4 w-28" />
//             </div>
//         );
//     }
//     if (!carrier) return <p className="text-sm text-muted-foreground">ناقل غير معروف</p>;

//     return (
//         <div className="flex items-center gap-3">
//             <Avatar className="h-9 w-9 border-2 border-primary/30">
//                 <AvatarFallback className="bg-primary/10 text-primary font-bold">
//                     {carrier.firstName?.charAt(0) || 'C'}
//                 </AvatarFallback>
//             </Avatar>
//             <div>
//                 <p className="text-sm font-bold">{carrier.firstName} {carrier.lastName}</p>
//                 <p className="text-xs text-muted-foreground">الناقل الأصلي</p>
//             </div>
//         </div>
//     );
// }

// interface TransferDepositConfirmCardProps {
//     request: TransferRequest;
//     onCompleted?: () => void;
// }

// /**
//  * @component TransferDepositConfirmCard
//  * @description يظهر للناقل المستلم لتأكيد استلام العربون وإتمام النقل الكامل للرحلة والمحادثات
//  */
// export function TransferDepositConfirmCard({ request, onCompleted }: TransferDepositConfirmCardProps) {
//     const firestore = useFirestore();
//     const { user } = useUser();
//     const { toast } = useToast();
//     const locale = useLocale();
//     const [isConfirming, setIsConfirming] = useState(false);

//     const depositAmount = request.depositAmount || 0;
//     const currency = request.currency || 'JOD';
//     const { tripDetails } = request;

//     const handleConfirmReceived = async () => {
//         if (!firestore || !user) return;
//         setIsConfirming(true);
//         try {
//             const oldCarrierId = request.fromCarrierId;
//             const newCarrierId = user.uid;
//             // [FIX-TRANSFER-TRIP]: رحلة الناقل المستلم الموجودة على نفس الخط
//             const toCarrierTripId: string | null = (request as any).toCarrierTripId || null;

//             // 1. تحديث حالة طلب النقل → completed
//             await updateDoc(doc(firestore, 'transferRequests', request.id), {
//                 status: 'completed',
//                 depositConfirmedAt: serverTimestamp(),
//                 updatedAt: serverTimestamp(),
//             });

//             // 2. [FIX-TRANSFER-TRIP]: إخفاء الرحلة الأصلية من داشبورد المسافرين والناقل الأصلي
//             //    نغير status إلى 'Transferred' بدل نقلها للناقل الجديد
//             await updateDoc(doc(firestore, 'trips', request.tripId), {
//                 originalCarrierId: oldCarrierId,
//                 transferStatus: 'Transferred',
//                 status: 'Transferred',
//                 updatedAt: serverTimestamp(),
//             });

//             // 3. نقل الـ bookings للناقل الجديد
//             //    لو عنده رحلة موجودة على نفس الخط → bookings تنتقل عليها (targetTripId)
//             //    لو مفيش → نفضل على tripId الأصلي كـ fallback
//             const targetTripId = toCarrierTripId || request.tripId;

//             const bookingsSnap = await getDocs(
//                 query(collection(firestore, 'bookings'), where('tripId', '==', request.tripId))
//             );
//             await Promise.all(
//                 bookingsSnap.docs.map((bSnap) =>
//                     updateDoc(bSnap.ref, {
//                         carrierId: newCarrierId,
//                         tripId: targetTripId,
//                         updatedAt: serverTimestamp(),
//                     })
//                 )
//             );

//             // 3b. تحديث مقاعد رحلة الناقل المستلم لو موجودة
//             if (toCarrierTripId) {
//                 const toTripSnap = await getDocs(
//                     query(collection(firestore, 'trips'), where('__name__', '==', toCarrierTripId))
//                 );
//                 if (!toTripSnap.empty) {
//                     const toTripData = toTripSnap.docs[0].data();
//                     const currentAvailable = toTripData.availableSeats || 0;
//                     const transferredPassengers = bookingsSnap.docs.length;

//                     // [FIX-DATE-TIME]: نقل departureDate و departureTime من الرحلة الأصلية للناقل المستلم
//                     const originalTripSnap = await getDocs(
//                         query(collection(firestore, 'trips'), where('__name__', '==', request.tripId))
//                     );
//                     const originalTripData = originalTripSnap.docs[0]?.data() || {};

//                     await updateDoc(doc(firestore, 'trips', toCarrierTripId), {
//                         availableSeats: Math.max(0, currentAvailable - transferredPassengers),
//                         departureDate: originalTripData.departureDate ?? toTripData.departureDate,
//                         departureTime: originalTripData.departureTime ?? toTripData.departureTime,
//                         updatedAt: serverTimestamp(),
//                     });
//                 }
//             }

//             // 4. نقل المشارك في كل الـ chats المرتبطة بالرحلة
//             //    a. المجموعة (isGroupChat: true, tripId matches)
//             //    b. الرسائل الخاصة بين المسافر والناقل القديم
//             const chatsSnap = await getDocs(
//                 query(collection(firestore, 'chats'), where('participants', 'array-contains', oldCarrierId))
//             );

//             await Promise.all(
//                 chatsSnap.docs.map(async (chatSnap) => {
//                     const chatData = chatSnap.data();
//                     // نتحقق إن الشات مرتبط بهذه الرحلة أو بالـ booking الخاص بيها
//                     const isRelated =
//                         chatData.tripId === request.tripId ||
//                         bookingsSnap.docs.some(b => b.id === chatData.bookingId || chatData.tripId === request.tripId);

//                     if (isRelated) {
//                         // أضف الناقل الجديد واحذف القديم
//                         await updateDoc(chatSnap.ref, {
//                             participants: arrayUnion(newCarrierId),
//                         });
//                         await updateDoc(chatSnap.ref, {
//                             participants: arrayRemove(oldCarrierId),
//                         });
//                     }
//                 })
//             );

//             // 5. إشعار للناقل الأصلي بإتمام النقل
//             await addDoc(collection(doc(firestore, 'users', oldCarrierId), 'notifications'), {
//                 userId: oldCarrierId,
//                 title: '✅ تم نقل الرحلة بنجاح',
//                 message: 'أكد الناقل استلام العربون وتمت عملية نقل الرحلة بنجاح',
//                 type: 'transfer_completed',
//                 tripId: request.tripId,
//                 isRead: false,
//                 createdAt: serverTimestamp(),
//             });

//             await sendPush({
//                 userId: oldCarrierId,
//                 title: '✅ تم نقل الرحلة بنجاح',
//                 body: 'أكد الناقل استلام العربون وتمت عملية نقل الرحلة',
//                 data: { type: 'transfer_completed', tripId: request.tripId },
//             });

//             // 6. إشعار للمسافرين المرتبطين بالرحلة
//             await Promise.all(
//                 bookingsSnap.docs.map(async (bSnap) => {
//                     const booking = bSnap.data();
//                     const passengerId = booking.userId || booking.agentId;
//                     if (!passengerId) return;
//                     await addDoc(collection(doc(firestore, 'users', passengerId), 'notifications'), {
//                         userId: passengerId,
//                         title: '🚗 تغيير في ناقل رحلتك',
//                         message: 'تم تحويل رحلتك لناقل جديد. جميع تفاصيل الرحلة محفوظة.',
//                         type: 'trip_carrier_changed',
//                         tripId: request.tripId,
//                         bookingId: bSnap.id,
//                         isRead: false,
//                         link: `/history`,
//                         createdAt: serverTimestamp(),
//                     });
//                 })
//             );

//             toast({ title: '✅ تم تأكيد استلام العربون وإتمام نقل الرحلة' });
//             onCompleted?.();
//         } catch (error: any) {
//             console.error('[TransferDepositConfirm] Error:', error);
//             toast({ variant: 'destructive', title: 'فشل تأكيد الاستلام', description: error?.message });
//         } finally {
//             setIsConfirming(false);
//         }
//     };

//     return (
//         <Card className="w-full shadow-lg border-2 border-emerald-500/60 bg-emerald-500/5">
//             {/* شريط علوي */}
//             <div className="h-1 rounded-t-xl bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-400" />

//             <CardHeader className="pb-3">
//                 <div className="flex items-center justify-between">
//                     <CardTitle className="text-base flex items-center gap-2">
//                         <Banknote className="h-4 w-4 text-emerald-600" />
//                         العربون في طريقه إليك
//                     </CardTitle>
//                     <Badge className="bg-amber-500/15 text-amber-700 border-amber-500/30 text-xs">
//                         <Clock className="h-3 w-3 ml-1" />
//                         في الانتظار
//                     </Badge>
//                 </div>
//                 <CardDescription className="text-xs">
//                     أكد الناقل إرسال العربون — تحقق من حسابك وأكد الاستلام لإتمام نقل الرحلة
//                 </CardDescription>
//             </CardHeader>

//             <CardContent className="space-y-3">
//                 <FromCarrierInfo carrierId={request.fromCarrierId} />

//                 {/* تفاصيل الرحلة */}
//                 <div className="flex items-center justify-center font-bold text-base bg-muted/50 rounded-xl p-3">
//                     <span>{getCityName(tripDetails.origin, locale)}</span>
//                     <ArrowRight className="mx-2 h-4 w-4 text-primary" />
//                     <span>{getCityName(tripDetails.destination, locale)}</span>
//                 </div>

//                 <div className="grid grid-cols-2 gap-2 text-sm">
//                     <div className="p-2 bg-muted rounded-lg flex items-center justify-center gap-2">
//                         <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
//                         <span className="text-xs font-medium">
//                             {new Date(tripDetails.departureDate).toLocaleDateString('ar-SA')}
//                         </span>
//                     </div>
//                     <div className="p-2 bg-muted rounded-lg flex items-center justify-center gap-2">
//                         <Users className="h-3.5 w-3.5 text-muted-foreground" />
//                         <span className="text-xs font-medium">{tripDetails.passengerCount} ركاب</span>
//                     </div>
//                 </div>

//                 {/* مبلغ العربون */}
//                 {depositAmount > 0 && (
//                     <div className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
//                         <div>
//                             <p className="text-[10px] text-muted-foreground">مبلغ العربون المُرسَل</p>
//                             <p className="text-xl font-black text-emerald-700">{depositAmount} <span className="text-sm">{currency}</span></p>
//                         </div>
//                         <CheckCircle2 className="h-8 w-8 text-emerald-500" />
//                     </div>
//                 )}

//                 {/* ما سيحدث بعد التأكيد */}
//                 <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl space-y-1">
//                     <p className="text-xs font-bold text-blue-700 flex items-center gap-1.5">
//                         <MessageSquare className="h-3.5 w-3.5" />
//                         بعد تأكيد الاستلام:
//                     </p>
//                     <ul className="text-xs text-muted-foreground space-y-0.5 pr-2">
//                         <li>• تُحوَّل الرحلة إليك فوراً</li>
//                         <li>• تظهر محادثات المجموعة في قسم رسائلك</li>
//                         <li>• تصلك الرسائل الخاصة مع كل مسافر</li>
//                         <li>• يُشعَر الناقل الأصلي والمسافرون بالتحويل</li>
//                     </ul>
//                 </div>
//             </CardContent>

//             <CardFooter className="pt-2">
//                 <Button
//                     className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
//                     onClick={handleConfirmReceived}
//                     disabled={isConfirming}
//                 >
//                     {isConfirming
//                         ? <><Loader2 className="h-4 w-4 animate-spin ml-2" /> جاري التأكيد...</>
//                         : <><CheckCircle2 className="h-4 w-4 ml-2" /> استلمت العربون — أتمم النقل</>
//                     }
//                 </Button>
//             </CardFooter>
//         </Card>
//     );
// }
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useToast } from '@/hooks/use-toast';
import type { TransferRequest } from '@/lib/data';
import {
    Users, Calendar, ArrowRight, CheckCircle2, Loader2,
    Banknote, MessageSquare, Clock
} from 'lucide-react';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, updateDoc, serverTimestamp, addDoc, collection, getDocs, query, where, arrayUnion, arrayRemove } from 'firebase/firestore';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Skeleton } from '../ui/skeleton';
import { sendPush } from '@/lib/send-push';
import { getCityName } from '@/lib/constants';
import { useLocale } from 'next-intl';
import { useUser } from '@/firebase';

function FromCarrierInfo({ carrierId }: { carrierId: string }) {
    const firestore = useFirestore();
    const carrierRef = useMemoFirebase(() => {
        if (!firestore) return null;
        return doc(firestore, 'users', carrierId);
    }, [firestore, carrierId]);
    const { data: carrier, isLoading } = useDoc<any>(carrierRef);

    if (isLoading) {
        return (
            <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-28" />
            </div>
        );
    }
    if (!carrier) return <p className="text-sm text-muted-foreground">ناقل غير معروف</p>;

    return (
        <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border-2 border-primary/30">
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {carrier.firstName?.charAt(0) || 'C'}
                </AvatarFallback>
            </Avatar>
            <div>
                <p className="text-sm font-bold">{carrier.firstName} {carrier.lastName}</p>
                <p className="text-xs text-muted-foreground">الناقل الأصلي</p>
            </div>
        </div>
    );
}

interface TransferDepositConfirmCardProps {
    request: TransferRequest;
    onCompleted?: () => void;
}

/**
 * @component TransferDepositConfirmCard
 * @description يظهر للناقل المستلم لتأكيد استلام العربون وإتمام النقل الكامل للرحلة والمحادثات
 */
export function TransferDepositConfirmCard({ request, onCompleted }: TransferDepositConfirmCardProps) {
    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();
    const locale = useLocale();
    const [isConfirming, setIsConfirming] = useState(false);

    const depositAmount = request.depositAmount || 0;
    const currency = request.currency || 'JOD';
    const { tripDetails } = request;

    const handleConfirmReceived = async () => {
        if (!firestore || !user) return;
        setIsConfirming(true);
        try {
            const oldCarrierId = request.fromCarrierId;
            const newCarrierId = user.uid;
            // [FIX-TRANSFER-TRIP]: رحلة الناقل المستلم الموجودة على نفس الخط
            const toCarrierTripId: string | null = (request as any).toCarrierTripId || null;

            // 1. تحديث حالة طلب النقل → completed
            await updateDoc(doc(firestore, 'transferRequests', request.id), {
                status: 'completed',
                depositConfirmedAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            // 2. [FIX-TRANSFER-TRIP]: إخفاء الرحلة الأصلية من داشبورد المسافرين والناقل الأصلي
            //    نغير status إلى 'Transferred' بدل نقلها للناقل الجديد
            await updateDoc(doc(firestore, 'trips', request.tripId), {
                originalCarrierId: oldCarrierId,
                transferStatus: 'Transferred',
                status: 'Transferred',
                updatedAt: serverTimestamp(),
            });

            // 3. نقل الـ bookings للناقل الجديد
            //    لو عنده رحلة موجودة على نفس الخط → bookings تنتقل عليها (targetTripId)
            //    لو مفيش → نفضل على tripId الأصلي كـ fallback
            const targetTripId = toCarrierTripId || request.tripId;

            const bookingsSnap = await getDocs(
                query(collection(firestore, 'bookings'), where('tripId', '==', request.tripId))
            );
            await Promise.all(
                bookingsSnap.docs.map((bSnap) =>
                    updateDoc(bSnap.ref, {
                        carrierId: newCarrierId,
                        tripId: targetTripId,
                        updatedAt: serverTimestamp(),
                    })
                )
            );

            // 3b. تحديث مقاعد رحلة الناقل المستلم لو موجودة
            if (toCarrierTripId) {
                const toTripSnap = await getDocs(
                    query(collection(firestore, 'trips'), where('__name__', '==', toCarrierTripId))
                );
                if (!toTripSnap.empty) {
                    const toTripData = toTripSnap.docs[0].data();
                    const currentAvailable = toTripData.availableSeats || 0;
                    const transferredPassengers = bookingsSnap.docs.length;

                    // [FIX-DATE-TIME]: نقل departureDate و departureTime من الرحلة الأصلية للناقل المستلم
                    const originalTripSnap = await getDocs(
                        query(collection(firestore, 'trips'), where('__name__', '==', request.tripId))
                    );
                    const originalTripData = originalTripSnap.docs[0]?.data() || {};

                    await updateDoc(doc(firestore, 'trips', toCarrierTripId), {
                        availableSeats: Math.max(0, currentAvailable - transferredPassengers),
                        ...(originalTripData.departureDate !== undefined
                            ? { departureDate: originalTripData.departureDate }
                            : toTripData.departureDate !== undefined
                                ? { departureDate: toTripData.departureDate }
                                : {}),
                        ...(originalTripData.departureTime !== undefined
                            ? { departureTime: originalTripData.departureTime }
                            : toTripData.departureTime !== undefined
                                ? { departureTime: toTripData.departureTime }
                                : {}),
                        updatedAt: serverTimestamp(),
                    });
                }
            }

            // 4. نقل المشارك في كل الـ chats المرتبطة بالرحلة
            //    a. المجموعة (isGroupChat: true, tripId matches)
            //    b. الرسائل الخاصة بين المسافر والناقل القديم
            const chatsSnap = await getDocs(
                query(collection(firestore, 'chats'), where('participants', 'array-contains', oldCarrierId))
            );

            await Promise.all(
                chatsSnap.docs.map(async (chatSnap) => {
                    const chatData = chatSnap.data();
                    // نتحقق إن الشات مرتبط بهذه الرحلة أو بالـ booking الخاص بيها
                    const isRelated =
                        chatData.tripId === request.tripId ||
                        bookingsSnap.docs.some(b => b.id === chatData.bookingId || chatData.tripId === request.tripId);

                    if (isRelated) {
                        // أضف الناقل الجديد واحذف القديم
                        await updateDoc(chatSnap.ref, {
                            participants: arrayUnion(newCarrierId),
                        });
                        await updateDoc(chatSnap.ref, {
                            participants: arrayRemove(oldCarrierId),
                        });
                    }
                })
            );

            // 5. إشعار للناقل الأصلي بإتمام النقل
            await addDoc(collection(doc(firestore, 'users', oldCarrierId), 'notifications'), {
                userId: oldCarrierId,
                title: '✅ تم نقل الرحلة بنجاح',
                message: 'أكد الناقل استلام العربون وتمت عملية نقل الرحلة بنجاح',
                type: 'transfer_completed',
                tripId: request.tripId,
                isRead: false,
                createdAt: serverTimestamp(),
            });

            await sendPush({
                userId: oldCarrierId,
                title: '✅ تم نقل الرحلة بنجاح',
                body: 'أكد الناقل استلام العربون وتمت عملية نقل الرحلة',
                data: { type: 'transfer_completed', tripId: request.tripId },
            });

            // 6. إشعار للمسافرين المرتبطين بالرحلة
            await Promise.all(
                bookingsSnap.docs.map(async (bSnap) => {
                    const booking = bSnap.data();
                    const passengerId = booking.userId || booking.agentId;
                    if (!passengerId) return;
                    await addDoc(collection(doc(firestore, 'users', passengerId), 'notifications'), {
                        userId: passengerId,
                        title: '🚗 تغيير في ناقل رحلتك',
                        message: 'تم تحويل رحلتك لناقل جديد. جميع تفاصيل الرحلة محفوظة.',
                        type: 'trip_carrier_changed',
                        tripId: request.tripId,
                        bookingId: bSnap.id,
                        isRead: false,
                        link: `/history`,
                        createdAt: serverTimestamp(),
                    });
                })
            );

            toast({ title: '✅ تم تأكيد استلام العربون وإتمام نقل الرحلة' });
            onCompleted?.();
        } catch (error: any) {
            console.error('[TransferDepositConfirm] Error:', error);
            toast({ variant: 'destructive', title: 'فشل تأكيد الاستلام', description: error?.message });
        } finally {
            setIsConfirming(false);
        }
    };

    return (
        <Card className="w-full shadow-lg border-2 border-[#32727F] bg-transparent">
            {/* شريط علوي */}
            {/* <div className="h-1 rounded-t-xl bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-400" /> */}

            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Banknote className="h-4 w-4 text-[#32727F]" />
                        العربون في طريقه إليك
                    </CardTitle>
                    <Badge className="bg-amber-500/15 text-amber-700 border-amber-500/30 text-xs">
                        <Clock className="h-3 w-3 ml-1" />
                        في الانتظار
                    </Badge>
                </div>
                <CardDescription className="text-xs">
                    أكد الناقل إرسال العربون — تحقق من حسابك وأكد الاستلام لإتمام نقل الرحلة
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
                <FromCarrierInfo carrierId={request.fromCarrierId} />

                {/* تفاصيل الرحلة */}
                <div className="flex items-center justify-center font-bold border border-[#BEAD77] text-base bg-muted/50 rounded-xl p-3">
                    <span>{getCityName(tripDetails.origin, locale)}</span>
                    <ArrowRight className="mx-2 h-4 w-4 text-primary" />
                    <span>{getCityName(tripDetails.destination, locale)}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="p-2 bg-[#241517] border border-[#BEAD77] rounded-lg flex items-center justify-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs font-medium">
                            {new Date(tripDetails.departureDate).toLocaleDateString('ar-SA')}
                        </span>
                    </div>
                    <div className="p-2 bg-[#241517] border border-[#BEAD77] rounded-lg flex items-center justify-center gap-2">
                        <Users className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs font-medium">{tripDetails.passengerCount} ركاب</span>
                    </div>
                </div>

                {/* مبلغ العربون */}
                {/* {depositAmount > 0 && (
                    <div className="flex items-center justify-between p-3 bg-[#241517] border border-[#BEAD77] rounded-xl">
                        <div>
                            <p className="text-[10px] text-muted-foreground">مبلغ العربون المُرسَل</p>
                            <p className="text-xl font-black text-emerald-700">{depositAmount} <span className="text-sm">{currency}</span></p>
                        </div>
                        <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                    </div>
                )} */}

                {/* ما سيحدث بعد التأكيد */}
                <div className="p-3 bg-[#241517] border border-[#32727F] rounded-xl space-y-1">
                    <p className="text-xs font-bold text-[#32727F] flex items-center gap-1.5">
                        <MessageSquare className="h-3.5 w-3.5" />
                        بعد تأكيد الاستلام:
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-0.5 pr-2">
                        <li>• تُحوَّل الرحلة إليك فوراً</li>
                        <li>• تظهر محادثات المجموعة في قسم رسائلك</li>
                        <li>• تصلك الرسائل الخاصة مع كل مسافر</li>
                        <li>• يُشعَر الناقل الأصلي والمسافرون بالتحويل</li>
                    </ul>
                </div>
            </CardContent>

            <CardFooter className="pt-2">
                <Button
                    className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-bold"
                    onClick={handleConfirmReceived}
                    disabled={isConfirming}
                >
                    {isConfirming
                        ? <><Loader2 className="h-4 w-4 animate-spin ml-2" /> جاري التأكيد...</>
                        : <><CheckCircle2 className="h-4 w-4 ml-2" /> استلمت العربون — أتمم النقل</>
                    }
                </Button>
            </CardFooter>
        </Card>
    );
}