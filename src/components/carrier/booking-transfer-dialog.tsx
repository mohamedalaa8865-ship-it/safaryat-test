// // 'use client';

// // /**
// //  * @component BookingTransferDialog
// //  * @description ميزة نقل الحجز المؤكد من ناقل لآخر على نفس المسار
// //  * 
// //  * الفلو الكامل:
// //  * 1. الناقل الأصلي يضغط "نقل إلى ناقل آخر" → يظهر هذا الديالوج
// //  * 2. يختار الناقل المستقبل → يضغط "بعت الطلب"
// //  * 3. يوصل إشعار للمسافر أولاً (قبل ما يوصل للناقل الجديد)
// //  * 4. المسافر يوافق → يوصل طلب للناقل الجديد
// //  * 5. الناقل الجديد يوافق ويستلم العربون → تتحول بيانات المسافر للرحلة الجديدة
// //  */

// // import { useState, useMemo } from 'react';
// // import {
// //     Dialog, DialogContent, DialogHeader, DialogTitle,
// //     DialogDescription, DialogFooter
// // } from '@/components/ui/dialog';
// // import { Button } from '@/components/ui/button';
// // import { Input } from '@/components/ui/input';
// // import { ScrollArea } from '@/components/ui/scroll-area';
// // import { Avatar, AvatarFallback } from '@/components/ui/avatar';
// // import { Badge } from '@/components/ui/badge';
// // import { useToast } from '@/hooks/use-toast';
// // import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
// // import { collection, query, where, serverTimestamp, addDoc, doc } from 'firebase/firestore';
// // import {
// //     Loader2, Send, Search, UserCheck, ArrowRight,
// //     MapPin, Calendar, Users, AlertCircle
// // } from 'lucide-react';
// // import { getCityName } from '@/lib/constants';
// // import { useLocale } from 'next-intl';
// // import { sendPush } from '@/lib/send-push';
// // import type { Booking, Trip } from '@/lib/data';

// // interface BookingTransferDialogProps {
// //     isOpen: boolean;
// //     onOpenChange: (open: boolean) => void;
// //     booking: Booking;
// //     /** بيانات رحلة الناقل الأصلية (carrierTripId) */
// //     carrierTrip: Trip | null;
// //     passengerName: string;
// // }

// // interface CarrierOnRoute {
// //     id: string;
// //     name: string;
// //     tripId: string;
// //     departureDate?: string;
// //     departureTime?: string;
// //     meetingPoint?: string;
// //     availableSeats?: number;
// // }

// // function CarrierItem({
// //     carrier,
// //     isSelected,
// //     onSelect,
// //     locale,
// //     booking,
// // }: {
// //     carrier: CarrierOnRoute;
// //     isSelected: boolean;
// //     onSelect: (c: CarrierOnRoute) => void;
// //     locale: string;
// //     booking: Booking;
// // }) {
// //     return (
// //         <div
// //             onClick={() => onSelect(carrier)}
// //             className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-150 border-2 ${isSelected
// //                 ? 'bg-primary/10 border-primary shadow-sm'
// //                 : 'hover:bg-muted/50 border-transparent hover:border-border'
// //                 }`}
// //         >
// //             <div className="flex items-center gap-3">
// //                 <Avatar className="h-10 w-10 shrink-0">
// //                     <AvatarFallback className="bg-primary/10 text-primary font-black">
// //                         {carrier.name?.charAt(0)?.toUpperCase() || 'N'}
// //                     </AvatarFallback>
// //                 </Avatar>
// //                 <div className="min-w-0">
// //                     <p className="font-bold text-sm text-foreground">{carrier.name}</p>
// //                     <div className="flex items-center gap-2 mt-0.5 flex-wrap">
// //                         {carrier.departureDate && (
// //                             <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
// //                                 <Calendar className="h-3 w-3" />
// //                                 {new Date(carrier.departureDate).toLocaleDateString('ar-SA')}
// //                             </span>
// //                         )}
// //                         {carrier.departureTime && (
// //                             <span className="text-[10px] text-muted-foreground">{carrier.departureTime}</span>
// //                         )}
// //                         {carrier.availableSeats !== undefined && (
// //                             <Badge variant="outline" className="h-4 px-1.5 text-[9px]">
// //                                 <Users className="h-2.5 w-2.5 me-0.5" />
// //                                 {carrier.availableSeats} مقعد متاح
// //                             </Badge>
// //                         )}
// //                     </div>
// //                     {carrier.meetingPoint && (
// //                         <p className="text-[10px] text-muted-foreground flex items-center gap-0.5 mt-0.5">
// //                             <MapPin className="h-2.5 w-2.5" /> {carrier.meetingPoint}
// //                         </p>
// //                     )}
// //                 </div>
// //             </div>
// //             {isSelected && <UserCheck className="h-5 w-5 text-primary shrink-0" />}
// //         </div>
// //     );
// // }

// // export function BookingTransferDialog({
// //     isOpen,
// //     onOpenChange,
// //     booking,
// //     carrierTrip,
// //     passengerName,
// // }: BookingTransferDialogProps) {
// //     const { user } = useUser();
// //     const firestore = useFirestore();
// //     const { toast } = useToast();
// //     const locale = useLocale();

// //     const [isSubmitting, setIsSubmitting] = useState(false);
// //     const [selectedCarrier, setSelectedCarrier] = useState<CarrierOnRoute | null>(null);
// //     const [searchTerm, setSearchTerm] = useState('');

// //     // جلب الرحلات على نفس المسار (origin + destination) من ناقلين آخرين
// //     const tripsOnRouteQuery = useMemoFirebase(() => {
// //         if (!firestore || !carrierTrip || !user) return null;
// //         return query(
// //             collection(firestore, 'trips'),
// //             where('origin', '==', carrierTrip.origin),
// //             where('destination', '==', carrierTrip.destination),
// //             where('status', 'in', ['Planned', 'Ongoing']),
// //         );
// //     }, [firestore, carrierTrip, user]);

// //     const { data: tripsOnRoute, isLoading } = useCollection<Trip>(tripsOnRouteQuery);

// //     // استخراج الناقلين الفريدين (بستثناء الناقل الحالي)
// //     const availableCarriers = useMemo((): CarrierOnRoute[] => {
// //         if (!tripsOnRoute) return [];
// //         const seen = new Set<string>();
// //         const result: CarrierOnRoute[] = [];
// //         for (const trip of tripsOnRoute) {
// //             const cId = trip.carrierId || trip.userId;
// //             if (!cId || cId === user?.uid || seen.has(cId)) continue;
// //             seen.add(cId);
// //             result.push({
// //                 id: cId,
// //                 name: trip.carrierName || 'ناقل',
// //                 tripId: trip.id,
// //                 departureDate: trip.departureDate,
// //                 departureTime: trip.departureTime,
// //                 meetingPoint: trip.meetingPoint,
// //                 availableSeats: trip.availableSeats,
// //             });
// //         }
// //         return result;
// //     }, [tripsOnRoute, user?.uid]);

// //     const filteredCarriers = useMemo(() => {
// //         if (!searchTerm.trim()) return availableCarriers;
// //         const q = searchTerm.toLowerCase();
// //         return availableCarriers.filter((c) => c.name.toLowerCase().includes(q));
// //     }, [availableCarriers, searchTerm]);

// //     /**
// //      * إرسال الطلب:
// //      * - أولاً: إشعار للمسافر بأن ناقله يريد نقله لرحلة أخرى (مع تفاصيل الرحلة الجديدة)
// //      * - الحجز يدخل حالة 'Transfer-Pending-Passenger' → المسافر يوافق أو يرفض
// //      * - عند موافقة المسافر → يُنشأ bookingTransferRequest في Firestore
// //      */
// //     const handleSendRequest = async () => {
// //         if (!firestore || !user || !selectedCarrier || !carrierTrip) {
// //             toast({ variant: 'destructive', title: 'اختر ناقلاً أولاً' });
// //             return;
// //         }
// //         setIsSubmitting(true);
// //         try {
// //             // 1. إنشاء وثيقة bookingTransferRequest
// //             const transferRef = await addDoc(collection(firestore, 'bookingTransferRequests'), {
// //                 bookingId: booking.id,
// //                 userId: booking.userId,          // المسافر
// //                 fromCarrierId: user.uid,          // الناقل الأصلي
// //                 toCarrierId: selectedCarrier.id,  // الناقل الجديد
// //                 toCarrierTripId: selectedCarrier.tripId,
// //                 fromCarrierTripId: booking.carrierTripId || booking.tripId,
// //                 status: 'pending_passenger',       // ينتظر موافقة المسافر أولاً
// //                 tripDetails: {
// //                     origin: carrierTrip.origin,
// //                     destination: carrierTrip.destination,
// //                     newDepartureDate: selectedCarrier.departureDate || null,
// //                     newDepartureTime: selectedCarrier.departureTime || null,
// //                     newMeetingPoint: selectedCarrier.meetingPoint || null,
// //                     newCarrierName: selectedCarrier.name,
// //                     passengerCount: booking.seats,
// //                 },
// //                 createdAt: serverTimestamp(),
// //                 updatedAt: serverTimestamp(),
// //             });

// //             // 2. إشعار للمسافر بتفاصيل الرحلة الجديدة
// //             const origin = getCityName(carrierTrip.origin, locale);
// //             const dest = getCityName(carrierTrip.destination, locale);
// //             const newDate = selectedCarrier.departureDate
// //                 ? new Date(selectedCarrier.departureDate).toLocaleDateString('ar-SA')
// //                 : '—';
// //             const newTime = selectedCarrier.departureTime || '—';
// //             const newMeeting = selectedCarrier.meetingPoint || '—';

// //             await addDoc(collection(firestore, 'notifications'), {
// //                 userId: booking.userId,
// //                 title: '🔄 طلب نقل رحلتك',
// //                 message: `ناقلك يريد نقلك إلى رحلة أخرى على نفس المسار (${origin} → ${dest}).\nالناقل الجديد: ${selectedCarrier.name}\nالتاريخ: ${newDate} | الوقت: ${newTime}\nnقطة الانطلاق: ${newMeeting}\nيُرجى الموافقة أو الرفض من تطبيقك.`,
// //                 type: 'booking_transfer_request',
// //                 bookingTransferRequestId: transferRef.id,
// //                 bookingId: booking.id,
// //                 isRead: false,
// //                 link: `/${locale}/my-bookings`,
// //                 createdAt: serverTimestamp(),
// //             });

// //             await sendPush({
// //                 userId: booking.userId,
// //                 title: '🔄 طلب نقل رحلتك',
// //                 body: `ناقلك يريد نقلك لرحلة أخرى. الناقل الجديد: ${selectedCarrier.name} — التاريخ: ${newDate}. يُرجى الرد من التطبيق.`,
// //                 data: {
// //                     type: 'booking_transfer_request',
// //                     bookingTransferRequestId: transferRef.id,
// //                     bookingId: booking.id,
// //                 },
// //             });

// //             toast({
// //                 title: '✅ تم إرسال الطلب للمسافر',
// //                 description: 'سيصل إشعار للمسافر، وبمجرد موافقته سيُرسل الطلب للناقل الجديد.',
// //             });
// //             onOpenChange(false);
// //             setSelectedCarrier(null);
// //             setSearchTerm('');
// //         } catch (error: any) {
// //             console.error('[BookingTransfer] Error:', error);
// //             toast({ variant: 'destructive', title: 'فشل إرسال الطلب', description: error?.message });
// //         } finally {
// //             setIsSubmitting(false);
// //         }
// //     };

// //     const originLabel = getCityName(carrierTrip?.origin || '', locale);
// //     const destLabel = getCityName(carrierTrip?.destination || '', locale);

// //     return (
// //         <Dialog open={isOpen} onOpenChange={onOpenChange}>
// //             <DialogContent className="sm:max-w-md">
// //                 <DialogHeader>
// //                     <DialogTitle className="flex items-center gap-2 mt-5">
// //                         {/* <ArrowRight className="h-4 w-4" /> */}
// //                         نقل الحجز إلى ناقل آخر
// //                     </DialogTitle>
// //                     {/* <DialogDescription>
// //                         اختر ناقلاً على نفس المسار. سيُرسل إشعار للمسافر أولاً ليوافق قبل توصيل الطلب للناقل الجديد.
// //                     </DialogDescription> */}
// //                 </DialogHeader>

// //                 <div className="py-3 space-y-4">
// //                     {/* معلومات الحجز */}
// //                     <div className="p-3 rounded-xl border border-dashed bg-muted/40 space-y-1.5">
// //                         <div className="flex items-center justify-between text-sm">
// //                             <span className="font-bold text-foreground">{passengerName}</span>
// //                             <Badge variant="outline" className="text-[10px] bg-green-500/10 text-green-600 border-green-500/20">
// //                                 {booking.seats} مقعد
// //                             </Badge>
// //                         </div>
// //                         <p className="text-xs text-muted-foreground flex items-center gap-1">
// //                             <MapPin className="h-3 w-3" />
// //                             {originLabel} → {destLabel}
// //                         </p>
// //                     </div>

// //                     {/* تحذير */}
// //                     <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-700">
// //                         <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
// //                         <p>
// //                             سيصل إشعار للمسافر بتفاصيل الرحلة الجديدة. بعد موافقته يُرسل الطلب للناقل الجديد،
// //                             وبعد موافقة الناقل واستلام العربون تنتقل التذكرة تلقائياً.
// //                         </p>
// //                     </div>

// //                     {/* بحث */}
// //                     <div className="relative">
// //                         <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
// //                         <Input
// //                             placeholder="ابحث باسم الناقل..."
// //                             value={searchTerm}
// //                             onChange={(e) => setSearchTerm(e.target.value)}
// //                             className="ps-9"
// //                         />
// //                     </div>

// //                     {/* قائمة الناقلين */}
// //                     <ScrollArea className="h-56 rounded-xl border border-border/50">
// //                         <div className="p-2 space-y-1">
// //                             {isLoading ? (
// //                                 <div className="p-6 text-center text-sm text-muted-foreground">
// //                                     <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
// //                                     جاري تحميل الناقلين...
// //                                 </div>
// //                             ) : filteredCarriers.length === 0 ? (
// //                                 <div className="p-6 text-center text-sm text-muted-foreground">
// //                                     لا يوجد ناقلون آخرون على هذا المسار حالياً.
// //                                 </div>
// //                             ) : (
// //                                 filteredCarriers.map((carrier) => (
// //                                     <CarrierItem
// //                                         key={carrier.id}
// //                                         carrier={carrier}
// //                                         isSelected={selectedCarrier?.id === carrier.id}
// //                                         onSelect={setSelectedCarrier}
// //                                         locale={locale}
// //                                         booking={booking}
// //                                     />
// //                                 ))
// //                             )}
// //                         </div>
// //                     </ScrollArea>

// //                     {/* الناقل المختار */}
// //                     {selectedCarrier && (
// //                         <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-sm">
// //                             <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-1">الناقل المختار</p>
// //                             <p className="font-black text-foreground">{selectedCarrier.name}</p>
// //                             {selectedCarrier.departureDate && (
// //                                 <p className="text-xs text-muted-foreground mt-0.5">
// //                                     {new Date(selectedCarrier.departureDate).toLocaleDateString('ar-SA')}
// //                                     {selectedCarrier.departureTime && ` — ${selectedCarrier.departureTime}`}
// //                                 </p>
// //                             )}
// //                         </div>
// //                     )}
// //                 </div>

// //                 <DialogFooter className="gap-2">
// //                     <Button
// //                         variant="secondary"
// //                         onClick={() => { onOpenChange(false); setSelectedCarrier(null); setSearchTerm(''); }}
// //                         disabled={isSubmitting}
// //                     >
// //                         إلغاء
// //                     </Button>
// //                     <Button
// //                         onClick={handleSendRequest}
// //                         disabled={!selectedCarrier || isSubmitting}
// //                         className="gap-2"
// //                     >
// //                         {isSubmitting
// //                             ? <Loader2 className="h-4 w-4 animate-spin" />
// //                             : <Send className="h-4 w-4" />
// //                         }
// //                         بعت الطلب
// //                     </Button>
// //                 </DialogFooter>
// //             </DialogContent>
// //         </Dialog>
// //     );
// // }
// 'use client';

// /**
//  * @component BookingTransferDialog
//  * @description ميزة نقل الحجز المؤكد من ناقل لآخر على نفس المسار
//  * 
//  * الفلو الكامل:
//  * 1. الناقل الأصلي يضغط "نقل إلى ناقل آخر" → يظهر هذا الديالوج
//  * 2. يختار الناقل المستقبل → يضغط "بعت الطلب"
//  * 3. يوصل إشعار للمسافر أولاً (قبل ما يوصل للناقل الجديد)
//  * 4. المسافر يوافق → يوصل طلب للناقل الجديد
//  * 5. الناقل الجديد يوافق ويستلم العربون → تتحول بيانات المسافر للرحلة الجديدة
//  */

// import { useState, useMemo } from 'react';
// import {
//     Dialog, DialogContent, DialogHeader, DialogTitle,
//     DialogDescription, DialogFooter
// } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { Avatar, AvatarFallback } from '@/components/ui/avatar';
// import { Badge } from '@/components/ui/badge';
// import { useToast } from '@/hooks/use-toast';
// import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
// import { collection, query, where, serverTimestamp, addDoc, doc } from 'firebase/firestore';
// import {
//     Loader2, Send, Search, UserCheck, ArrowRight,
//     MapPin, Calendar, Users, AlertCircle
// } from 'lucide-react';
// import { getCityName } from '@/lib/constants';
// import { useLocale } from 'next-intl';
// import { sendPush } from '@/lib/send-push';
// import type { Booking, Trip } from '@/lib/data';

// interface BookingTransferDialogProps {
//     isOpen: boolean;
//     onOpenChange: (open: boolean) => void;
//     booking: Booking;
//     /** بيانات رحلة الناقل الأصلية (carrierTripId) */
//     carrierTrip: Trip | null;
//     passengerName: string;
// }

// interface CarrierOnRoute {
//     id: string;
//     name: string;
//     tripId: string;
//     departureDate?: string;
//     departureTime?: string;
//     meetingPoint?: string;
//     meetingPointLink?: string;
//     availableSeats?: number;
// }

// function CarrierItem({
//     carrier,
//     isSelected,
//     onSelect,
//     locale,
//     booking,
// }: {
//     carrier: CarrierOnRoute;
//     isSelected: boolean;
//     onSelect: (c: CarrierOnRoute) => void;
//     locale: string;
//     booking: Booking;
// }) {
//     return (
//         <div
//             onClick={() => onSelect(carrier)}
//             className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-150 border-2 ${isSelected
//                 ? 'bg-primary/10 border-primary shadow-sm'
//                 : 'hover:bg-muted/50 border-transparent hover:border-border'
//                 }`}
//         >
//             <div className="flex items-center gap-3">
//                 <Avatar className="h-10 w-10 shrink-0">
//                     <AvatarFallback className="bg-primary/10 text-primary font-black">
//                         {carrier.name?.charAt(0)?.toUpperCase() || 'N'}
//                     </AvatarFallback>
//                 </Avatar>
//                 <div className="min-w-0">
//                     <p className="font-bold text-sm text-foreground">{carrier.name}</p>
//                     <div className="flex items-center gap-2 mt-0.5 flex-wrap">
//                         {carrier.departureDate && (
//                             <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
//                                 <Calendar className="h-3 w-3" />
//                                 {new Date(carrier.departureDate).toLocaleDateString('ar-SA')}
//                             </span>
//                         )}
//                         {carrier.departureTime && (
//                             <span className="text-[10px] text-muted-foreground">{carrier.departureTime}</span>
//                         )}
//                         {carrier.availableSeats !== undefined && (
//                             <Badge variant="outline" className="h-4 px-1.5 text-[9px]">
//                                 <Users className="h-2.5 w-2.5 me-0.5" />
//                                 {carrier.availableSeats} مقعد متاح
//                             </Badge>
//                         )}
//                     </div>
//                     {carrier.meetingPoint && (
//                         <p className="text-[10px] text-muted-foreground flex items-center gap-0.5 mt-0.5">
//                             <MapPin className="h-2.5 w-2.5" /> {carrier.meetingPoint}
//                         </p>
//                     )}
//                 </div>
//             </div>
//             {isSelected && <UserCheck className="h-5 w-5 text-primary shrink-0" />}
//         </div>
//     );
// }

// export function BookingTransferDialog({
//     isOpen,
//     onOpenChange,
//     booking,
//     carrierTrip,
//     passengerName,
// }: BookingTransferDialogProps) {
//     const { user } = useUser();
//     const firestore = useFirestore();
//     const { toast } = useToast();
//     const locale = useLocale();

//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [selectedCarrier, setSelectedCarrier] = useState<CarrierOnRoute | null>(null);
//     const [searchTerm, setSearchTerm] = useState('');

//     // جلب الرحلات على نفس المسار (origin + destination) من ناقلين آخرين
//     const tripsOnRouteQuery = useMemoFirebase(() => {
//         if (!firestore || !carrierTrip || !user) return null;
//         return query(
//             collection(firestore, 'trips'),
//             where('origin', '==', carrierTrip.origin),
//             where('destination', '==', carrierTrip.destination),
//             where('status', 'in', ['Planned', 'Ongoing']),
//         );
//     }, [firestore, carrierTrip, user]);

//     const { data: tripsOnRoute, isLoading } = useCollection<Trip>(tripsOnRouteQuery);

//     // استخراج الناقلين الفريدين (بستثناء الناقل الحالي)
//     const availableCarriers = useMemo((): CarrierOnRoute[] => {
//         if (!tripsOnRoute) return [];
//         const seen = new Set<string>();
//         const result: CarrierOnRoute[] = [];
//         for (const trip of tripsOnRoute) {
//             const cId = trip.carrierId || trip.userId;
//             if (!cId || cId === user?.uid || seen.has(cId)) continue;
//             seen.add(cId);
//             result.push({
//                 id: cId,
//                 name: trip.carrierName || 'ناقل',
//                 tripId: trip.id,
//                 departureDate: trip.departureDate,
//                 departureTime: trip.departureTime,
//                 meetingPoint: trip.meetingPoint,
//                 meetingPointLink: trip.meetingPointLink,
//                 availableSeats: trip.availableSeats,
//             });
//         }
//         return result;
//     }, [tripsOnRoute, user?.uid]);

//     const filteredCarriers = useMemo(() => {
//         if (!searchTerm.trim()) return availableCarriers;
//         const q = searchTerm.toLowerCase();
//         return availableCarriers.filter((c) => c.name.toLowerCase().includes(q));
//     }, [availableCarriers, searchTerm]);

//     /**
//      * إرسال الطلب:
//      * - أولاً: إشعار للمسافر بأن ناقله يريد نقله لرحلة أخرى (مع تفاصيل الرحلة الجديدة)
//      * - الحجز يدخل حالة 'Transfer-Pending-Passenger' → المسافر يوافق أو يرفض
//      * - عند موافقة المسافر → يُنشأ bookingTransferRequest في Firestore
//      */
//     const handleSendRequest = async () => {
//         if (!firestore || !user || !selectedCarrier || !carrierTrip) {
//             toast({ variant: 'destructive', title: 'اختر ناقلاً أولاً' });
//             return;
//         }
//         setIsSubmitting(true);
//         try {
//             // 1. إنشاء وثيقة bookingTransferRequest
//             const transferRef = await addDoc(collection(firestore, 'bookingTransferRequests'), {
//                 bookingId: booking.id,
//                 userId: booking.userId,          // المسافر
//                 fromCarrierId: user.uid,          // الناقل الأصلي
//                 toCarrierId: selectedCarrier.id,  // الناقل الجديد
//                 toCarrierTripId: selectedCarrier.tripId,
//                 fromCarrierTripId: booking.carrierTripId || booking.tripId,
//                 status: 'pending_passenger',       // ينتظر موافقة المسافر أولاً
//                 tripDetails: {
//                     origin: carrierTrip.origin,
//                     destination: carrierTrip.destination,
//                     newDepartureDate: selectedCarrier.departureDate || null,
//                     newDepartureTime: selectedCarrier.departureTime || null,
//                     newMeetingPoint: selectedCarrier.meetingPoint || null,
//                     newMeetingPointLink: selectedCarrier.meetingPointLink || null,
//                     newCarrierName: selectedCarrier.name,
//                     passengerCount: booking.seats,
//                 },
//                 createdAt: serverTimestamp(),
//                 updatedAt: serverTimestamp(),
//             });

//             // 2. إشعار للمسافر بتفاصيل الرحلة الجديدة
//             const origin = getCityName(carrierTrip.origin, locale);
//             const dest = getCityName(carrierTrip.destination, locale);
//             const newDate = selectedCarrier.departureDate
//                 ? new Date(selectedCarrier.departureDate).toLocaleDateString('ar-SA')
//                 : '—';
//             const newTime = selectedCarrier.departureTime || '—';
//             const newMeeting = selectedCarrier.meetingPoint || '—';

//             await addDoc(collection(firestore, 'notifications'), {
//                 userId: booking.userId,
//                 title: '🔄 طلب نقل رحلتك',
//                 message: `ناقلك يريد نقلك إلى رحلة أخرى على نفس المسار (${origin} → ${dest}).\nالناقل الجديد: ${selectedCarrier.name}\nالتاريخ: ${newDate} | الوقت: ${newTime}\nnقطة الانطلاق: ${newMeeting}\nيُرجى الموافقة أو الرفض من تطبيقك.`,
//                 type: 'booking_transfer_request',
//                 bookingTransferRequestId: transferRef.id,
//                 bookingId: booking.id,
//                 isRead: false,
//                 link: `/${locale}/my-bookings`,
//                 createdAt: serverTimestamp(),
//             });

//             await sendPush({
//                 userId: booking.userId,
//                 title: '🔄 طلب نقل رحلتك',
//                 body: `ناقلك يريد نقلك لرحلة أخرى. الناقل الجديد: ${selectedCarrier.name} — التاريخ: ${newDate}. يُرجى الرد من التطبيق.`,
//                 data: {
//                     type: 'booking_transfer_request',
//                     bookingTransferRequestId: transferRef.id,
//                     bookingId: booking.id,
//                 },
//             });

//             toast({
//                 title: '✅ تم إرسال الطلب للمسافر',
//                 description: 'سيصل إشعار للمسافر، وبمجرد موافقته سيُرسل الطلب للناقل الجديد.',
//             });
//             onOpenChange(false);
//             setSelectedCarrier(null);
//             setSearchTerm('');
//         } catch (error: any) {
//             console.error('[BookingTransfer] Error:', error);
//             toast({ variant: 'destructive', title: 'فشل إرسال الطلب', description: error?.message });
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const originLabel = getCityName(carrierTrip?.origin || '', locale);
//     const destLabel = getCityName(carrierTrip?.destination || '', locale);

//     return (
//         <Dialog open={isOpen} onOpenChange={onOpenChange}>
//             <DialogContent className="sm:max-w-md">
//                 <DialogHeader>
//                     <DialogTitle className="flex items-center gap-2 mt-5">
//                         {/* <ArrowRight className="h-4 w-4" /> */}
//                         نقل الحجز إلى ناقل آخر
//                     </DialogTitle>
//                     {/* <DialogDescription>
//                         اختر ناقلاً على نفس المسار. سيُرسل إشعار للمسافر أولاً ليوافق قبل توصيل الطلب للناقل الجديد.
//                     </DialogDescription> */}
//                 </DialogHeader>

//                 <div className="py-3 space-y-4">
//                     {/* معلومات الحجز */}
//                     <div className="p-3 rounded-xl border border-dashed bg-muted/40 space-y-1.5">
//                         <div className="flex items-center justify-between text-sm">
//                             <span className="font-bold text-foreground">{passengerName}</span>
//                             <Badge variant="outline" className="text-[10px] bg-green-500/10 text-green-600 border-green-500/20">
//                                 {booking.seats} مقعد
//                             </Badge>
//                         </div>
//                         <p className="text-xs text-muted-foreground flex items-center gap-1">
//                             <MapPin className="h-3 w-3" />
//                             {originLabel} → {destLabel}
//                         </p>
//                     </div>

//                     {/* تحذير */}
//                     <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-700">
//                         <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
//                         <p>
//                             سيصل إشعار للمسافر بتفاصيل الرحلة الجديدة. بعد موافقته يُرسل الطلب للناقل الجديد،
//                             وبعد موافقة الناقل واستلام العربون تنتقل التذكرة تلقائياً.
//                         </p>
//                     </div>

//                     {/* بحث */}
//                     <div className="relative">
//                         <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
//                         <Input
//                             placeholder="ابحث باسم الناقل..."
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             className="ps-9"
//                         />
//                     </div>

//                     {/* قائمة الناقلين */}
//                     <ScrollArea className="h-56 rounded-xl border border-border/50">
//                         <div className="p-2 space-y-1">
//                             {isLoading ? (
//                                 <div className="p-6 text-center text-sm text-muted-foreground">
//                                     <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
//                                     جاري تحميل الناقلين...
//                                 </div>
//                             ) : filteredCarriers.length === 0 ? (
//                                 <div className="p-6 text-center text-sm text-muted-foreground">
//                                     لا يوجد ناقلون آخرون على هذا المسار حالياً.
//                                 </div>
//                             ) : (
//                                 filteredCarriers.map((carrier) => (
//                                     <CarrierItem
//                                         key={carrier.id}
//                                         carrier={carrier}
//                                         isSelected={selectedCarrier?.id === carrier.id}
//                                         onSelect={setSelectedCarrier}
//                                         locale={locale}
//                                         booking={booking}
//                                     />
//                                 ))
//                             )}
//                         </div>
//                     </ScrollArea>

//                     {/* الناقل المختار */}
//                     {selectedCarrier && (
//                         <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-sm">
//                             <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-1">الناقل المختار</p>
//                             <p className="font-black text-foreground">{selectedCarrier.name}</p>
//                             {selectedCarrier.departureDate && (
//                                 <p className="text-xs text-muted-foreground mt-0.5">
//                                     {new Date(selectedCarrier.departureDate).toLocaleDateString('ar-SA')}
//                                     {selectedCarrier.departureTime && ` — ${selectedCarrier.departureTime}`}
//                                 </p>
//                             )}
//                         </div>
//                     )}
//                 </div>

//                 <DialogFooter className="gap-2">
//                     <Button
//                         variant="secondary"
//                         onClick={() => { onOpenChange(false); setSelectedCarrier(null); setSearchTerm(''); }}
//                         disabled={isSubmitting}
//                     >
//                         إلغاء
//                     </Button>
//                     <Button
//                         onClick={handleSendRequest}
//                         disabled={!selectedCarrier || isSubmitting}
//                         className="gap-2"
//                     >
//                         {isSubmitting
//                             ? <Loader2 className="h-4 w-4 animate-spin" />
//                             : <Send className="h-4 w-4" />
//                         }
//                         بعت الطلب
//                     </Button>
//                 </DialogFooter>
//             </DialogContent>
//         </Dialog>
//     );
// }

'use client';

/**
 * @component BookingTransferDialog
 * @description ميزة نقل الحجز المؤكد من ناقل لآخر على نفس المسار
 * 
 * الفلو الكامل:
 * 1. الناقل الأصلي يضغط "نقل إلى ناقل آخر" → يظهر هذا الديالوج
 * 2. يختار الناقل المستقبل → يضغط "بعت الطلب"
 * 3. يوصل إشعار للمسافر أولاً (قبل ما يوصل للناقل الجديد)
 * 4. المسافر يوافق → يوصل طلب للناقل الجديد
 * 5. الناقل الجديد يوافق ويستلم العربون → تتحول بيانات المسافر للرحلة الجديدة
 */

import { useState, useMemo } from 'react';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
    DialogDescription, DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useUser, useFunctions, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import {
    Loader2, Send, Search, UserCheck, ArrowRight,
    MapPin, Calendar, Users, AlertCircle
} from 'lucide-react';
import { getCityName } from '@/lib/constants';
import { useLocale } from 'next-intl';
import type { Booking, Trip } from '@/lib/data';

interface BookingTransferDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    booking: Booking;
    /** بيانات رحلة الناقل الأصلية (carrierTripId) */
    carrierTrip: Trip | null;
    passengerName: string;
}

interface CarrierOnRoute {
    id: string;
    name: string;
    tripId: string;
    departureDate?: string;
    departureTime?: string;
    meetingPoint?: string;
    meetingPointLink?: string;
    availableSeats?: number;
}

function CarrierItem({
    carrier,
    isSelected,
    onSelect,
    locale,
    booking,
}: {
    carrier: CarrierOnRoute;
    isSelected: boolean;
    onSelect: (c: CarrierOnRoute) => void;
    locale: string;
    booking: Booking;
}) {
    return (
        <div
            onClick={() => onSelect(carrier)}
            className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-150 border-2 ${isSelected
                ? 'bg-primary/10 border-primary shadow-sm'
                : 'hover:bg-muted/50 border-transparent hover:border-border'
                }`}
        >
            <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary font-black">
                        {carrier.name?.charAt(0)?.toUpperCase() || 'N'}
                    </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                    <p className="font-bold text-sm text-foreground">{carrier.name}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        {carrier.departureDate && (
                            <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                                <Calendar className="h-3 w-3" />
                                {new Date(carrier.departureDate).toLocaleDateString('ar-SA')}
                            </span>
                        )}
                        {carrier.departureTime && (
                            <span className="text-[10px] text-muted-foreground">{carrier.departureTime}</span>
                        )}
                        {carrier.availableSeats !== undefined && (
                            <Badge variant="outline" className="h-4 px-1.5 text-[9px]">
                                <Users className="h-2.5 w-2.5 me-0.5" />
                                {carrier.availableSeats} مقعد متاح
                            </Badge>
                        )}
                    </div>
                    {carrier.meetingPoint && (
                        <p className="text-[10px] text-muted-foreground flex items-center gap-0.5 mt-0.5">
                            <MapPin className="h-2.5 w-2.5" /> {carrier.meetingPoint}
                        </p>
                    )}
                </div>
            </div>
            {isSelected && <UserCheck className="h-5 w-5 text-primary shrink-0" />}
        </div>
    );
}

export function BookingTransferDialog({
    isOpen,
    onOpenChange,
    booking,
    carrierTrip,
    passengerName,
}: BookingTransferDialogProps) {
    const { user } = useUser();
    const firestore = useFirestore();
    const functions = useFunctions();
    const { toast } = useToast();
    const locale = useLocale();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedCarrier, setSelectedCarrier] = useState<CarrierOnRoute | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // جلب الرحلات على نفس المسار (origin + destination) من ناقلين آخرين
    const tripsOnRouteQuery = useMemoFirebase(() => {
        if (!firestore || !carrierTrip || !user) return null;
        return query(
            collection(firestore, 'trips'),
            where('origin', '==', carrierTrip.origin),
            where('destination', '==', carrierTrip.destination),
            where('status', 'in', ['Planned', 'Ongoing']),
        );
    }, [firestore, carrierTrip, user]);

    const { data: tripsOnRoute, isLoading } = useCollection<Trip>(tripsOnRouteQuery);

    // استخراج الناقلين الفريدين (بستثناء الناقل الحالي)
    const availableCarriers = useMemo((): CarrierOnRoute[] => {
        if (!tripsOnRoute) return [];
        const seen = new Set<string>();
        const result: CarrierOnRoute[] = [];
        for (const trip of tripsOnRoute) {
            const cId = trip.carrierId || trip.userId;
            if (!cId || cId === user?.uid || seen.has(cId)) continue;
            seen.add(cId);
            result.push({
                id: cId,
                name: trip.carrierName || 'ناقل',
                tripId: trip.id,
                departureDate: trip.departureDate,
                departureTime: trip.departureTime,
                meetingPoint: trip.meetingPoint,
                meetingPointLink: trip.meetingPointLink,
                availableSeats: trip.availableSeats,
            });
        }
        return result;
    }, [tripsOnRoute, user?.uid]);

    const filteredCarriers = useMemo(() => {
        if (!searchTerm.trim()) return availableCarriers;
        const q = searchTerm.toLowerCase();
        return availableCarriers.filter((c) => c.name.toLowerCase().includes(q));
    }, [availableCarriers, searchTerm]);

    /**
     * إرسال الطلب:
     * - تتم العملية بالكامل عبر Cloud Function (initiateBookingTransfer) لأن
     *   قواعد Firestore تمنع الكتابة المباشرة على bookingTransferRequests
     *   (allow create, update: if false في firestore.rules — SCR-1007).
     * - الدالة على السيرفر تتحقق من ملكية الحجز وحالته وتوافر المقاعد عند
     *   الناقل الجديد، ثم تنشئ الطلب وترسل إشعار المسافر تلقائياً.
     */
    const handleSendRequest = async () => {
        if (!firestore || !functions || !user || !selectedCarrier || !carrierTrip) {
            toast({ variant: 'destructive', title: 'اختر ناقلاً أولاً' });
            return;
        }
        setIsSubmitting(true);
        try {
            const initiateFn = httpsCallable(functions, 'initiateBookingTransfer');
            await initiateFn({
                bookingId: booking.id,
                toCarrierId: selectedCarrier.id,
                toCarrierTripId: selectedCarrier.tripId,
            });

            toast({
                title: '✅ تم إرسال الطلب للمسافر',
                description: 'سيصل إشعار للمسافر، وبمجرد موافقته سيُرسل الطلب للناقل الجديد.',
            });
            onOpenChange(false);
            setSelectedCarrier(null);
            setSearchTerm('');
        } catch (error: any) {
            console.error('[BookingTransfer] Error:', error);
            toast({ variant: 'destructive', title: 'فشل إرسال الطلب', description: error?.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    const originLabel = getCityName(carrierTrip?.origin || '', locale);
    const destLabel = getCityName(carrierTrip?.destination || '', locale);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 mt-5">
                        {/* <ArrowRight className="h-4 w-4" /> */}
                        نقل الحجز إلى ناقل آخر
                    </DialogTitle>
                    {/* <DialogDescription>
                        اختر ناقلاً على نفس المسار. سيُرسل إشعار للمسافر أولاً ليوافق قبل توصيل الطلب للناقل الجديد.
                    </DialogDescription> */}
                </DialogHeader>

                <div className="py-3 space-y-4">
                    {/* معلومات الحجز */}
                    <div className="p-3 rounded-xl border border-dashed bg-muted/40 space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-bold text-foreground">{passengerName}</span>
                            <Badge variant="outline" className="text-[10px] bg-green-500/10 text-green-600 border-green-500/20">
                                {booking.seats} مقعد
                            </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {originLabel} → {destLabel}
                        </p>
                    </div>

                    {/* تحذير */}
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-700">
                        <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                        <p>
                            سيصل إشعار للمسافر بتفاصيل الرحلة الجديدة. بعد موافقته يُرسل الطلب للناقل الجديد،
                            وبعد موافقة الناقل واستلام العربون تنتقل التذكرة تلقائياً.
                        </p>
                    </div>

                    {/* بحث */}
                    <div className="relative">
                        <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <Input
                            placeholder="ابحث باسم الناقل..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="ps-9"
                        />
                    </div>

                    {/* قائمة الناقلين */}
                    <ScrollArea className="h-56 rounded-xl border border-border/50">
                        <div className="p-2 space-y-1">
                            {isLoading ? (
                                <div className="p-6 text-center text-sm text-muted-foreground">
                                    <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
                                    جاري تحميل الناقلين...
                                </div>
                            ) : filteredCarriers.length === 0 ? (
                                <div className="p-6 text-center text-sm text-muted-foreground">
                                    لا يوجد ناقلون آخرون على هذا المسار حالياً.
                                </div>
                            ) : (
                                filteredCarriers.map((carrier) => (
                                    <CarrierItem
                                        key={carrier.id}
                                        carrier={carrier}
                                        isSelected={selectedCarrier?.id === carrier.id}
                                        onSelect={setSelectedCarrier}
                                        locale={locale}
                                        booking={booking}
                                    />
                                ))
                            )}
                        </div>
                    </ScrollArea>

                    {/* الناقل المختار */}
                    {selectedCarrier && (
                        <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-sm">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-1">الناقل المختار</p>
                            <p className="font-black text-foreground">{selectedCarrier.name}</p>
                            {selectedCarrier.departureDate && (
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {new Date(selectedCarrier.departureDate).toLocaleDateString('ar-SA')}
                                    {selectedCarrier.departureTime && ` — ${selectedCarrier.departureTime}`}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        variant="secondary"
                        onClick={() => { onOpenChange(false); setSelectedCarrier(null); setSearchTerm(''); }}
                        disabled={isSubmitting}
                    >
                        إلغاء
                    </Button>
                    <Button
                        onClick={handleSendRequest}
                        disabled={!selectedCarrier || isSubmitting}
                        className="gap-2"
                    >
                        {isSubmitting
                            ? <Loader2 className="h-4 w-4 animate-spin" />
                            : <Send className="h-4 w-4" />
                        }
                        بعت الطلب
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}