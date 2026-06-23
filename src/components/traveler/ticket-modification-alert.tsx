// // 'use client';

// // import { useEffect, useState } from 'react';
// // import { collection, query, where, onSnapshot, doc, updateDoc, arrayUnion } from 'firebase/firestore';
// // import { useFirestore } from '@/firebase';
// // import { useUserProfile } from '@/hooks/use-user-profile';
// // import { Button } from '@/components/ui/button';
// // import { AlertTriangle, Check, X, Loader2 } from 'lucide-react';
// // import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// // import { format } from 'date-fns';
// // import { ar } from 'date-fns/locale'; // تأكد إنك تستخدم لغة التطبيق الصحيحة

// // export function TicketModificationAlert({ tripId }: { tripId: string }) {
// //     const firestore = useFirestore();
// //     const { profile } = useUserProfile();
// //     const [modificationReq, setModificationReq] = useState<any>(null);
// //     const [loading, setLoading] = useState(false);

// //     useEffect(() => {
// //         if (!firestore || !tripId) return;

// //         // المراقبة الحية لطلبات التعديل المعلقة الخاصة بهذه الرحلة
// //         const q = query(
// //             collection(firestore, 'trip_modifications'),
// //             where('tripId', '==', tripId),
// //             where('status', '==', 'Pending')
// //         );

// //         const unsubscribe = onSnapshot(q, (snapshot) => {
// //             if (!snapshot.empty) {
// //                 const data = snapshot.docs[0].data();
// //                 // إخفاء الإشعار لو المستخدم وافق عليه بالفعل
// //                 if (profile && data.acceptedBy && data.acceptedBy.includes(profile.id)) {
// //                     setModificationReq(null);
// //                 } else {
// //                     setModificationReq({ id: snapshot.docs[0].id, ...data });
// //                 }
// //             } else {
// //                 setModificationReq(null);
// //             }
// //         });

// //         return () => unsubscribe();
// //     }, [firestore, tripId, profile]);

// //     const handleAccept = async () => {
// //         if (!firestore || !profile) return;
// //         setLoading(true);
// //         try {
// //             const reqRef = doc(firestore, 'trip_modifications', modificationReq.id);
// //             // نقوم بإضافة المسافر لمصفوفة الموافقين (الـ Backend سيتحقق إذا اكتملت الموافقة)
// //             await updateDoc(reqRef, {
// //                 acceptedBy: arrayUnion(profile.id)
// //             });
// //         } catch (e) {
// //             console.error(e);
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     const handleReject = async () => {
// //         if (!firestore || !profile) return;
// //         setLoading(true);
// //         try {
// //             const reqRef = doc(firestore, 'trip_modifications', modificationReq.id);
// //             // تغيير الحالة لـ مرفوض وإسناد مسؤولية الرفض للمسافر
// //             await updateDoc(reqRef, {
// //                 status: 'Rejected',
// //                 rejectedBy: profile.id
// //             });
// //         } catch (e) {
// //             console.error(e);
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     if (!modificationReq || !profile) return null;

// //     // تحويل Timestamp إلى تاريخ مقروء
// //     const newDateObj = modificationReq.newDate?.toDate ? modificationReq.newDate.toDate() : new Date(modificationReq.newDate);
// //     const formattedDate = format(newDateObj, 'EEEE, d MMMM yyyy', { locale: ar });

// //     return (
// //         <Alert className="mb-6 border-amber-500 bg-amber-500/10 shadow-lg animate-in slide-in-from-top-4">
// //             <AlertTriangle className="h-5 w-5 text-amber-500" />
// //             <AlertTitle className="text-amber-600 font-black mb-2">تنبيه هام: طلب سيادي لتعديل الرحلة</AlertTitle>
// //             <AlertDescription className="space-y-3">
// //                 <p className="text-foreground text-sm font-bold">
// //                     يطلب الناقل تغيير موعد الانطلاق ليكون يوم <span className="text-primary">{formattedDate}</span> الساعة <span className="text-primary font-black">{modificationReq.newTime}</span>.
// //                 </p>
// //                 <div className="bg-background/80 p-3 rounded-xl border border-amber-500/20 text-sm">
// //                     <span className="font-black text-muted-foreground block mb-1">سبب التعديل:</span>
// //                     {modificationReq.reason}
// //                 </div>
// //                 <div className="flex gap-3 pt-2">
// //                     <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 flex-1 font-bold h-10 rounded-xl" onClick={handleAccept} disabled={loading}>
// //                         {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Check className="h-4 w-4 ml-1" /> أوافق على التعديل</>}
// //                     </Button>
// //                     <Button size="sm" variant="destructive" className="flex-1 font-bold h-10 rounded-xl" onClick={handleReject} disabled={loading}>
// //                         {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><X className="h-4 w-4 ml-1" /> أرفض التعديل</>}
// //                     </Button>
// //                 </div>
// //             </AlertDescription>
// //         </Alert>
// //     );
// // }
// 'use client';

// import { useEffect, useState } from 'react';
// import { collection, query, where, onSnapshot, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
// import { useFirestore } from '@/firebase';
// import { useUserProfile } from '@/hooks/use-user-profile';
// import { Button } from '@/components/ui/button';
// import { AlertTriangle, Check, X, Loader2 } from 'lucide-react';
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// import { format } from 'date-fns';
// import { ar } from 'date-fns/locale'; // تأكد إنك تستخدم لغة التطبيق الصحيحة

// export function TicketModificationAlert({ tripId }: { tripId: string }) {
//     const firestore = useFirestore();
//     const { profile } = useUserProfile();
//     const [modificationReq, setModificationReq] = useState<any>(null);
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         if (!firestore || !tripId) return;

//         // المراقبة الحية لطلبات التعديل المعلقة الخاصة بهذه الرحلة
//         const q = query(
//             collection(firestore, 'trip_modifications'),
//             where('tripId', '==', tripId),
//             where('status', '==', 'Pending')
//         );

//         const unsubscribe = onSnapshot(q, (snapshot) => {
//             if (!snapshot.empty) {
//                 const data = snapshot.docs[0].data();
//                 // إخفاء الإشعار لو المستخدم وافق عليه بالفعل
//                 if (profile && data.acceptedBy && data.acceptedBy.includes(profile.id)) {
//                     setModificationReq(null);
//                 } else {
//                     setModificationReq({ id: snapshot.docs[0].id, ...data });
//                 }
//             } else {
//                 setModificationReq(null);
//             }
//         });

//         return () => unsubscribe();
//     }, [firestore, tripId, profile]);

//     const handleAccept = async () => {
//         if (!firestore || !profile) return;
//         setLoading(true);
//         try {
//             const reqRef = doc(firestore, 'trip_modifications', modificationReq.id);

//             // ① أضف المسافر الحالي لمصفوفة الموافقين
//             await updateDoc(reqRef, {
//                 acceptedBy: arrayUnion(profile.id)
//             });

//             // ② اجلب الطلب المحدّث للتحقق من اكتمال الموافقة
//             const updatedSnap = await getDoc(reqRef);
//             const updatedData = updatedSnap.data();
//             const acceptedBy: string[] = updatedData?.acceptedBy ?? [];

//             // ③ اجلب الرحلة لمعرفة عدد الحجوزات النشطة
//             const tripRef = doc(firestore, 'trips', tripId);
//             const tripSnap = await getDoc(tripRef);
//             const tripData = tripSnap.data();
//             const bookingIds: string[] = tripData?.bookingIds ?? [];

//             // ④ لو كل المسافرين وافقوا → حدّث الرحلة وأغلق الطلب
//             if (bookingIds.length > 0 && acceptedBy.length >= bookingIds.length) {
//                 const newDate: Date = updatedData?.newDate?.toDate
//                     ? updatedData.newDate.toDate()
//                     : new Date(updatedData?.newDate);

//                 await updateDoc(tripRef, {
//                     departureDate: newDate.toISOString(),
//                     updatedAt: new Date(),
//                 });

//                 await updateDoc(reqRef, {
//                     status: 'Approved',
//                 });
//             }
//         } catch (e) {
//             console.error(e);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleReject = async () => {
//         if (!firestore || !profile) return;
//         setLoading(true);
//         try {
//             const reqRef = doc(firestore, 'trip_modifications', modificationReq.id);
//             // تغيير الحالة لـ مرفوض وإسناد مسؤولية الرفض للمسافر
//             await updateDoc(reqRef, {
//                 status: 'Rejected',
//                 rejectedBy: profile.id
//             });
//         } catch (e) {
//             console.error(e);
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (!modificationReq || !profile) return null;

//     // تحويل Timestamp إلى تاريخ مقروء
//     const newDateObj = modificationReq.newDate?.toDate ? modificationReq.newDate.toDate() : new Date(modificationReq.newDate);
//     const formattedDate = format(newDateObj, 'EEEE, d MMMM yyyy', { locale: ar });

//     return (
//         <Alert className="mb-6 border-amber-500 bg-amber-500/10 shadow-lg animate-in slide-in-from-top-4">
//             <AlertTriangle className="h-5 w-5 text-amber-500" />
//             <AlertTitle className="text-amber-600 font-black mb-2">تنبيه هام: طلب سيادي لتعديل الرحلة</AlertTitle>
//             <AlertDescription className="space-y-3">
//                 <p className="text-foreground text-sm font-bold">
//                     يطلب الناقل تغيير موعد الانطلاق ليكون يوم <span className="text-primary">{formattedDate}</span> الساعة <span className="text-primary font-black">{modificationReq.newTime}</span>.
//                 </p>
//                 <div className="bg-background/80 p-3 rounded-xl border border-amber-500/20 text-sm">
//                     <span className="font-black text-muted-foreground block mb-1">سبب التعديل:</span>
//                     {modificationReq.reason}
//                 </div>
//                 <div className="flex gap-3 pt-2">
//                     <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 flex-1 font-bold h-10 rounded-xl" onClick={handleAccept} disabled={loading}>
//                         {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Check className="h-4 w-4 ml-1" /> أوافق على التعديل</>}
//                     </Button>
//                     <Button size="sm" variant="destructive" className="flex-1 font-bold h-10 rounded-xl" onClick={handleReject} disabled={loading}>
//                         {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><X className="h-4 w-4 ml-1" /> أرفض التعديل</>}
//                     </Button>
//                 </div>
//             </AlertDescription>
//         </Alert>
//     );
// }
'use client';

import { useEffect, useState } from 'react';
import {
    collection, query, where, onSnapshot,
    doc, updateDoc, arrayUnion, getDoc, addDoc, serverTimestamp
} from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useUserProfile } from '@/hooks/use-user-profile';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Check, X, Loader2, XCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { sendPush } from '@/lib/send-push';

export function TicketModificationAlert({ tripId }: { tripId: string }) {
    const firestore = useFirestore();
    const { profile } = useUserProfile();
    const [modificationReq, setModificationReq] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!firestore || !tripId) return;

        const q = query(
            collection(firestore, 'trip_modifications'),
            where('tripId', '==', tripId),
            where('status', '==', 'Pending')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                const data = snapshot.docs[0].data();
                if (profile && data.acceptedBy && data.acceptedBy.includes(profile.id)) {
                    setModificationReq(null);
                } else {
                    setModificationReq({ id: snapshot.docs[0].id, ...data });
                }
            } else {
                setModificationReq(null);
            }
        });

        return () => unsubscribe();
    }, [firestore, tripId, profile]);

    // ── helper: إشعار الناقل ──
    const notifyCarrier = async (carrierId: string, title: string, message: string, type: string) => {
        if (!firestore) return;
        try {
            await addDoc(collection(doc(firestore, 'users', carrierId), 'notifications'), {
                userId: carrierId,
                title,
                message,
                type,
                tripId,
                isRead: false,
                link: `/carrier/trips`,
                createdAt: serverTimestamp(),
            });
            await sendPush({ userId: carrierId, title, body: message, data: { type, tripId } });
        } catch (e) {
            console.warn('[TicketModificationAlert] carrier notify failed:', e);
        }
    };

    const handleAccept = async () => {
        if (!firestore || !profile) return;
        setLoading(true);
        try {
            const reqRef = doc(firestore, 'trip_modifications', modificationReq.id);

            // ① أضف المسافر لمصفوفة الموافقين
            await updateDoc(reqRef, { acceptedBy: arrayUnion(profile.id) });

            // ② اجلب الطلب المحدّث
            const updatedSnap = await getDoc(reqRef);
            const updatedData = updatedSnap.data();
            const acceptedBy: string[] = updatedData?.acceptedBy ?? [];
            const carrierId: string = updatedData?.carrierId ?? '';

            // ③ اجلب الرحلة
            const tripRef = doc(firestore, 'trips', tripId);
            const tripSnap = await getDoc(tripRef);
            const tripData = tripSnap.data();
            const bookingIds: string[] = tripData?.bookingIds ?? [];

            // ④ لو كل المسافرين وافقوا → حدّث الرحلة وأغلق الطلب
            if (bookingIds.length > 0 && acceptedBy.length >= bookingIds.length) {
                const newDate: Date = updatedData?.newDate?.toDate
                    ? updatedData.newDate.toDate()
                    : new Date(updatedData?.newDate);

                await updateDoc(tripRef, {
                    departureDate: newDate.toISOString(),
                    updatedAt: new Date(),
                });

                await updateDoc(reqRef, { status: 'Approved' });

                // إشعار الناقل: الكل وافق ✅
                if (carrierId) {
                    await notifyCarrier(
                        carrierId,
                        'وافق جميع المسافرين على التعديل ✅',
                        'وافق جميع المسافرين على تغيير موعد الرحلة. تم تحديث الرحلة تلقائياً.',
                        'trip_update_approved'
                    );
                }
            } else {
                // إشعار الناقل: مسافر واحد وافق (لو في أكثر من مسافر)
                if (carrierId && bookingIds.length > 1) {
                    const travelerName = profile.displayName || profile.firstName || 'مسافر';
                    await notifyCarrier(
                        carrierId,
                        `${travelerName} وافق على التعديل ✅`,
                        `وافق ${acceptedBy.length} من ${bookingIds.length} مسافرين على تغيير الموعد.`,
                        'trip_update_partial_accept'
                    );
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async () => {
        if (!firestore || !profile) return;
        setLoading(true);
        try {
            const reqRef = doc(firestore, 'trip_modifications', modificationReq.id);

            // تغيير الحالة لمرفوض
            await updateDoc(reqRef, {
                status: 'Rejected',
                rejectedBy: profile.id,
            });

            // إشعار الناقل بالرفض ❌
            const carrierId: string = modificationReq?.carrierId ?? '';
            if (carrierId) {
                const travelerName = profile.displayName || profile.firstName || 'مسافر';
                await notifyCarrier(
                    carrierId,
                    `${travelerName} رفض التعديل ❌`,
                    `رفض أحد المسافرين طلب تغيير موعد الرحلة. يرجى التواصل معه.`,
                    'trip_update_rejected'
                );
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (!modificationReq || !profile) return null;

    const newDateObj = modificationReq.newDate?.toDate
        ? modificationReq.newDate.toDate()
        : new Date(modificationReq.newDate);
    const formattedDate = format(newDateObj, 'EEEE, d MMMM yyyy', { locale: ar });

    return (
        <Alert className="mb-6 border-amber-500 bg-amber-500/10 shadow-lg animate-in slide-in-from-top-4">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <AlertTitle className="text-amber-600 font-black mb-2">تنبيه هام: طلب سيادي لتعديل الرحلة</AlertTitle>
            <AlertDescription className="space-y-3">
                <p className="text-foreground text-sm font-bold">
                    يطلب الناقل تغيير موعد الانطلاق ليكون يوم{' '}
                    <span className="text-primary">{formattedDate}</span> الساعة{' '}
                    <span className="text-primary font-black">{modificationReq.newTime}</span>.
                </p>
                <div className="bg-background/80 p-3 rounded-xl border border-amber-500/20 text-sm">
                    <span className="font-black text-muted-foreground block mb-1">سبب التعديل:</span>
                    {modificationReq.reason}
                </div>
                <div className="flex gap-3 pt-2">
                    <Button
                        size="sm"
                        className="bg-[#16A34A] hover:bg-[#16a34aa9] flex-1 font-bold text-white h-10 rounded-xl"
                        onClick={handleAccept}
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <div className='flex gap-2 items-center'> <CheckCircle2 className="h-4 w-4 " /> أوافق على التعديل</div>}
                    </Button>
                    <Button
                        size="sm"
                        // variant="destructive"
                        className="flex-1 font-bold h-10 rounded-xl   bg-[#991C22] text-white hover:bg-[#991C22a9]"
                        onClick={handleReject}
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="h-4   animate-spin" /> : <div className='flex gap-2 items-center' ><XCircle className="h-4 w-4" /> أرفض التعديل</div>}
                    </Button>
                </div>
            </AlertDescription>
        </Alert>
    );
}