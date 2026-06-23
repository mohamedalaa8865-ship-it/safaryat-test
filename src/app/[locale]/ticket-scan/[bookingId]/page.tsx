'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDoc, collection, query, where, limit, getDocs } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';
import { getCityName } from '@/lib/constants';
import { formatDate } from '@/lib/formatters';
import {
    User, FileText, Phone, Bus, Calendar, Clock,
    MapPin, Hash, CheckCircle2, XCircle, Loader2, ShieldAlert
} from 'lucide-react';

// ===== Firebase Init (بدون auth) =====
function getFirestorePublic() {
    const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    return getFirestore(app);
}

// ===== Types =====
interface PassengerDetail {
    name: string;
    documentNumber?: string;
    nationality?: string;
    type?: string;
}

interface TicketData {
    // Booking
    bookingId: string;
    seats: number;
    totalPrice: number;
    currency: string;
    status: string;
    passengersDetails: PassengerDetail[];
    // Trip
    tripId: string;
    origin: string;
    destination: string;
    departureDate: any;
    meetingPoint?: string;
    carrierName?: string;
    carrierId?: string;
    // Carrier
    carrierPhone?: string;
}

// ===== Status Badge =====
function StatusBadge({ status }: { status: string }) {
    const map: Record<string, { label: string; color: string }> = {
        Confirmed: { label: 'مؤكدة ✅', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
        'In-Transit': { label: 'جارية الآن 🚌', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
        Completed: { label: 'مكتملة', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
        Cancelled: { label: 'ملغاة ❌', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
    };
    const s = map[status] || { label: status, color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };
    return (
        <span className={`text-xs font-black px-3 py-1 rounded-full border ${s.color}`}>
            {s.label}
        </span>
    );
}

// ===== Main Page =====
export default function TicketScanPage() {
    const params = useParams();
    const bookingId = params.bookingId as string;

    const [ticket, setTicket] = useState<TicketData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!bookingId) return;

        const fetchTicket = async () => {
            try {
                const db = getFirestorePublic();

                // 1. جيب الـ booking
                const bookingSnap = await getDoc(doc(db, 'bookings', bookingId));
                if (!bookingSnap.exists()) {
                    setError('لم يتم العثور على هذا الحجز.');
                    return;
                }
                const booking = bookingSnap.data();

                // 2. جيب الـ trip
                const tripId = booking.tripId || booking.carrierTripId;
                let trip: any = {};
                if (tripId) {
                    const tripSnap = await getDoc(doc(db, 'trips', tripId));
                    if (tripSnap.exists()) trip = tripSnap.data();
                }

                // 3. جيب بيانات الناقل (phone فقط)
                let carrierPhone: string | undefined;
                const carrierId = booking.carrierId || trip.carrierId;
                if (carrierId) {
                    const carrierSnap = await getDoc(doc(db, 'users', carrierId));
                    if (carrierSnap.exists()) {
                        carrierPhone = carrierSnap.data().phoneNumber;
                    }
                }

                setTicket({
                    bookingId,
                    seats: booking.seats || 1,
                    totalPrice: booking.totalPrice || 0,
                    currency: booking.currency || '',
                    status: booking.status || '',
                    passengersDetails: booking.passengersDetails || [],
                    tripId: tripId || '',
                    origin: trip.origin || booking.origin || '',
                    destination: trip.destination || booking.destination || '',
                    departureDate: trip.departureDate || booking.departureDate,
                    meetingPoint: trip.meetingPoint || booking.meetingPoint,
                    carrierName: trip.carrierName || booking.carrierName,
                    carrierId,
                    carrierPhone,
                });
            } catch (e) {
                console.error(e);
                setError('حدث خطأ أثناء تحميل التذكرة.');
            } finally {
                setLoading(false);
            }
        };

        fetchTicket();
    }, [bookingId]);

    // ===== Loading =====
    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center" dir="rtl">
                <div className="flex flex-col items-center gap-4 text-white">
                    <Loader2 className="h-12 w-12 animate-spin text-[#A18E64]" />
                    <p className="font-black text-lg">جاري تحميل التذكرة...</p>
                </div>
            </div>
        );
    }

    // ===== Error =====
    if (error || !ticket) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6" dir="rtl">
                <div className="text-center space-y-4">
                    <div className="bg-red-500/10 p-6 rounded-full w-fit mx-auto">
                        <ShieldAlert className="h-16 w-16 text-red-400 opacity-60" />
                    </div>
                    <h1 className="text-2xl font-black text-white">التذكرة غير متاحة</h1>
                    <p className="text-sm text-gray-400 font-bold">{error || 'ربما تمَّ إلغاء الرحلة نهائياً.'}</p>
                </div>
            </div>
        );
    }

    const isCancelled = ticket.status === 'Cancelled';

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-4 pb-12" dir="rtl">
            <div className="max-w-md mx-auto space-y-4">

                {/* Header */}
                <div className="text-center pt-6 pb-2 space-y-1">
                    <p className="text-xs text-[#A18E64] font-black uppercase tracking-widest">ختم العبور الرقمي</p>
                    <h1 className="text-2xl font-black tracking-tight">
                        {ticket.origin && ticket.destination
                            ? `${ticket.origin} ← ${ticket.destination}`
                            : 'تذكرة سفر'}
                    </h1>
                    <StatusBadge status={ticket.status} />
                </div>

                {/* Trip ID */}
                <div className="flex justify-center gap-6 text-center">
                    <div>
                        <p className="text-[10px] text-gray-500 font-black uppercase flex items-center justify-center gap-1">
                            <Hash className="h-3 w-3" /> رقم الرحلة
                        </p>
                        <p className="font-mono font-black text-[#A18E64] text-lg">
                            {ticket.tripId.slice(-6).toUpperCase()}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-500 font-black uppercase flex items-center justify-center gap-1">
                            <Hash className="h-3 w-3" /> رقم الحجز
                        </p>
                        <p className="font-mono font-black text-[#A18E64] text-lg">
                            {ticket.bookingId.slice(-6).toUpperCase()}
                        </p>
                    </div>
                </div>

                {/* Passengers */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                    <p className="text-xs font-black text-gray-400 uppercase flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-[#A18E64]" /> بيانات المسافرين
                    </p>
                    {ticket.passengersDetails.length > 0 ? (
                        ticket.passengersDetails.map((pax, i) => (
                            <div key={i} className="flex items-center justify-between border-t border-white/5 pt-2">
                                <span className="font-bold text-base">{pax.name}</span>
                                {pax.documentNumber && (
                                    <span className="font-mono text-sm bg-[#A18E64] text-black px-2 py-0.5 rounded-lg flex items-center gap-1">
                                        <FileText className="h-3 w-3 opacity-50" />
                                        {pax.documentNumber}
                                    </span>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-sm">لا توجد بيانات مسافرين</p>
                    )}
                    <div className="flex justify-between items-center border-t border-white/5 pt-2 text-sm">
                        <span className="text-gray-400">عدد المقاعد</span>
                        <span className="font-black">{ticket.seats}</span>
                    </div>
                </div>

                {/* Carrier */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                    <p className="text-xs font-black text-gray-400 uppercase flex items-center gap-2">
                        <Bus className="h-3.5 w-3.5 text-[#A18E64]" /> الناقل
                    </p>
                    {ticket.carrierName && (
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">الاسم</span>
                            <span className="font-black text-[#A18E64]">{ticket.carrierName}</span>
                        </div>
                    )}
                    {ticket.carrierPhone && (
                        <div className="flex justify-between items-center border-t border-white/5 pt-2">
                            <span className="text-gray-400 text-sm flex items-center gap-1">
                                <Phone className="h-3 w-3" /> رقم التلفون
                            </span>
                            <a
                                href={`tel:${ticket.carrierPhone}`}
                                className="font-black text-black bg-[#A18E64] hover:bg-[#c4ac7a] px-3 py-1 rounded-lg transition-colors ltr"
                            >
                                {ticket.carrierPhone}
                            </a>
                        </div>
                    )}
                </div>

                {/* Date & Time & Meeting Point */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-[#A18E64]" /> التاريخ
                        </p>
                        <p className="font-bold text-sm">
                            {formatDate(ticket.departureDate, 'd MMM yyyy', 'ar')}
                        </p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-1">
                            <Clock className="h-3 w-3 text-[#A18E64]" /> الوقت
                        </p>
                        <p className="font-bold text-sm">
                            {formatDate(ticket.departureDate, 'hh:mm a', 'ar')}
                        </p>
                    </div>
                </div>

                {ticket.meetingPoint && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-[#A18E64]" /> نقطة الانطلاق
                        </p>
                        <p className="font-bold">{ticket.meetingPoint}</p>
                    </div>
                )}

                {/* Price */}
                <div className="bg-[#A18E64]/10 border border-[#A18E64]/30 rounded-2xl p-4 flex justify-between items-center">
                    <span className="text-gray-300 font-bold">إجمالي الحجز</span>
                    <span className="font-black text-lg text-[#A18E64]">
                        {ticket.totalPrice.toFixed(2)} {ticket.currency}
                    </span>
                </div>

                {/* Validity */}
                <div className={`rounded-2xl p-4 flex items-center gap-3 ${isCancelled ? 'bg-red-500/10 border border-red-500/20' : 'bg-green-500/10 border border-green-500/20'}`}>
                    {isCancelled
                        ? <XCircle className="h-6 w-6 text-red-400 shrink-0" />
                        : <CheckCircle2 className="h-6 w-6 text-green-400 shrink-0" />}
                    <p className={`font-black text-sm ${isCancelled ? 'text-red-400' : 'text-green-400'}`}>
                        {isCancelled ? 'هذا الحجز ملغى ولا يعتد به' : 'تذكرة سارية المفعول — تم التحقق'}
                    </p>
                </div>

                <p className="text-center text-[10px] text-gray-600 pt-2">
                    safaryat.net · تم التحقق تلقائياً من قاعدة البيانات
                </p>
            </div>
        </div>
    );
}