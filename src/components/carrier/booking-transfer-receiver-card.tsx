'use client';

/**
 * @component BookingTransferReceiverCard
 * @description كارد يُعرض للناقل الجديد ليقبل أو يرفض استقبال مسافر من ناقل آخر
 * يظهر في صفحة carrier/bookings ضمن قسم منفصل
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useFirestore, useUser, useFunctions } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { doc, updateDoc, serverTimestamp, addDoc, collection } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { sendPush } from '@/lib/send-push';
import {
    ArrowRightLeft, CheckCircle2, XCircle, Loader2,
    MapPin, Calendar, Clock, User, Users
} from 'lucide-react';
import { useLocale } from 'next-intl';
import { getCityName } from '@/lib/constants';

export interface BookingTransferRequest {
    id: string;
    bookingId: string;
    userId: string;
    fromCarrierId: string;
    toCarrierId: string;
    toCarrierTripId: string;
    fromCarrierTripId: string;
    status: 'pending_carrier' | 'deposit_pending' | 'deposit_sent' | 'completed' | 'rejected_by_carrier' | string;
    depositAmount?: number;
    currency?: string;
    tripDetails: {
        origin: string;
        destination: string;
        newDepartureDate?: string | null;
        newDepartureTime?: string | null;
        newMeetingPoint?: string | null;
        newCarrierName: string;
        passengerCount: number;
    };
    createdAt: any;
}

interface BookingTransferReceiverCardProps {
    request: BookingTransferRequest;
    onProcessed?: () => void;
}

export function BookingTransferReceiverCard({
    request,
    onProcessed,
}: BookingTransferReceiverCardProps) {
    const { user } = useUser();
    const firestore = useFirestore();
    const functions = useFunctions();
    const { toast } = useToast();
    const locale = useLocale();
    const [loading, setLoading] = useState<'accept' | 'reject' | null>(null);

    const origin = getCityName(request.tripDetails.origin, locale);
    const dest = getCityName(request.tripDetails.destination, locale);

    const handleAccept = async () => {
        if (!firestore || !user || !functions) return;
        setLoading('accept');
        try {
            const acceptFn = httpsCallable(functions, 'acceptBookingTransferByCarrier');
            await acceptFn({ bookingTransferRequestId: request.id });

            toast({
                title: '✅ قبلت استلام المسافر',
                description: 'الناقل الأصلي سيرسل العربون لإتمام النقل.',
            });
            onProcessed?.();
        } catch (error: any) {
            console.error('[BookingTransferReceiver] Accept error:', error);
            toast({ variant: 'destructive', title: 'فشل القبول', description: error?.message });
        } finally {
            setLoading(null);
        }
    };

    const handleReject = async () => {
        if (!firestore || !user) return;
        setLoading('reject');
        try {
            // تحديث حالة الطلب → rejected_by_carrier
            await updateDoc(doc(firestore, 'bookingTransferRequests', request.id), {
                status: 'rejected_by_carrier',
                carrierRejectedAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            // إشعار للناقل الأصلي
            await addDoc(collection(doc(firestore, 'users', request.fromCarrierId), 'notifications'), {
                userId: request.fromCarrierId,
                title: '❌ رفض الناقل استلام الحجز',
                message: 'رفض الناقل الجديد استلام المسافر. يمكنك اختيار ناقل آخر.',
                type: 'booking_transfer_rejected_by_carrier',
                bookingId: request.bookingId,
                isRead: false,
                link: `/${locale}/carrier/bookings`,
                createdAt: serverTimestamp(),
            });

            await sendPush({
                userId: request.fromCarrierId,
                title: '❌ رفض الناقل الجديد',
                body: 'رفض الناقل استلام المسافر. يمكنك إعادة المحاولة مع ناقل آخر.',
                data: { type: 'booking_transfer_rejected_by_carrier', bookingId: request.bookingId },
            });

            toast({ title: 'تم رفض الطلب' });
            onProcessed?.();
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'فشل الرفض', description: error?.message });
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="relative overflow-hidden rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-purple-500/0 p-4 shadow-sm">
            {/* Top accent bar */}
            <div className="absolute top-0 start-0 end-0 h-0.5 bg-gradient-to-r from-purple-500/60 via-purple-400/40 to-transparent rounded-t-2xl" />

            <div className="space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                            <ArrowRightLeft className="h-3.5 w-3.5 text-purple-500" />
                        </div>
                        <p className="text-xs font-black text-purple-600 uppercase tracking-wide">
                            طلب استقبال مسافر
                        </p>
                    </div>
                    <Badge variant="outline" className="h-5 px-2 text-[10px] bg-purple-500/10 text-purple-600 border-purple-500/20">
                        <Users className="h-2.5 w-2.5 me-1" />
                        {request.tripDetails.passengerCount} مقعد
                    </Badge>
                </div>

                {/* Travel Info */}
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="font-bold">{origin} → {dest}</span>
                    </div>

                    {request.tripDetails.newDepartureDate && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3 shrink-0" />
                            {new Date(request.tripDetails.newDepartureDate).toLocaleDateString('ar-SA')}
                            {request.tripDetails.newDepartureTime && (
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {request.tripDetails.newDepartureTime}
                                </span>
                            )}
                        </div>
                    )}

                    {request.tripDetails.newMeetingPoint && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3 shrink-0" />
                            {request.tripDetails.newMeetingPoint}
                        </p>
                    )}
                </div>

                <p className="text-[11px] text-muted-foreground border-t border-border/50 pt-2">
                    وافق المسافر على الانتقال لرحلتك. موافقتك ستُحول الحجز لك بعد إتمام عملية العربون.
                </p>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                    <Button
                        className="h-10 bg-green-600 hover:bg-green-700 text-white font-black rounded-xl gap-1.5 text-sm"
                        onClick={handleAccept}
                        disabled={!!loading}
                    >
                        {loading === 'accept'
                            ? <Loader2 className="h-4 w-4 animate-spin" />
                            : <><CheckCircle2 className="h-4 w-4" /> قبول</>
                        }
                    </Button>
                    <Button
                        variant="outline"
                        className="h-10 border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 font-black rounded-xl text-sm gap-1.5"
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