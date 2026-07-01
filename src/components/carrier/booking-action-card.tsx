// // 'use client';

// // import { useState } from 'react';
// // import type { Booking, UserProfile } from '@/lib/data';
// // import { Button } from '@/components/ui/button';
// // import {
// //   User, Loader2, CheckCircle2, XCircle, MessageSquare,
// //   Users, FileDigit, ShieldCheck, Briefcase, Phone, CreditCard,
// //   ChevronDown, ChevronUp, Ticket, MapPin, Clock, Navigation, ArrowRightLeft
// // } from 'lucide-react';
// // import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// // import { Badge } from '@/components/ui/badge';
// // import { Skeleton } from '@/components/ui/skeleton';
// // import { Input } from '@/components/ui/input';
// // import { Label } from '@/components/ui/label';
// // import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
// // import { ChatDialog } from '@/components/chat/chat-dialog';
// // import { useFirestore, useUser, useDoc, useMemoFirebase } from '@/firebase';
// // import { useToast } from '@/hooks/use-toast';
// // import { cn, triggerHaptic } from '@/lib/utils';
// // import { useTripActions } from '@/hooks/use-trip-actions';
// // import { useUserProfile } from '@/hooks/use-user-profile';
// // import { doc, updateDoc, serverTimestamp, setDoc, arrayUnion, collection, writeBatch, getDocs, getDoc, deleteDoc, query, where, increment } from 'firebase/firestore';
// // import { useTranslations } from 'next-intl';
// // import { sendPush } from '@/lib/send-push';
// // import { AddTripDialog } from '@/components/carrier/add-trip-dialog';
// // import { SOVEREIGN_GEO_REGISTRY } from '@/lib/constants';
// // import { BookingTransferDialog } from '@/components/carrier/booking-transfer-dialog';

// // // helper: يرجع كود الدولة من city key (مثلاً 'riyadh' → 'SA')
// // function getCountryFromCity(cityKey: string): string {
// //   if (!cityKey) return '';
// //   const lower = cityKey.toLowerCase();
// //   for (const [countryCode, data] of Object.entries(SOVEREIGN_GEO_REGISTRY)) {
// //     if ((data as any).cities?.includes(lower)) return countryCode;
// //   }
// //   return '';
// // }

// // interface BookingActionCardProps {
// //   booking: Booking;
// //   onReject: (bookingId: string) => Promise<void>;
// // }

// // const STATUS_CONFIG = {
// //   'Pending-Carrier-Confirmation': {
// //     pill: 'bg-white text-black border-amber-500/20',
// //     accent: 'bg-[#111827]',
// //     bar: 'bg-white',
// //     labelKey: 'status.pendingCarrier',
// //   },
// //   'Pending-Payment': {
// //     pill: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
// //     accent: 'from-orange-500/15 to-orange-500/0',
// //     bar: 'bg-orange-500',
// //     labelKey: 'status.pendingPayment',
// //   },
// //   'Pending-Payment-Verification': {
// //     pill: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
// //     accent: 'from-blue-500/15 to-blue-500/0',
// //     bar: 'bg-blue-500 animate-pulse',
// //     labelKey: 'status.pendingVerification',
// //   },
// //   'Confirmed': {
// //     pill: 'bg-green-500/10 text-green-600 border-green-500/20',
// //     accent: 'from-green-500/10 to-green-500/0',
// //     bar: 'bg-green-500',
// //     labelKey: 'status.confirmed',
// //   },
// // } as Record<string, { pill: string; accent: string; bar: string; labelKey: string }>;

// // export function BookingActionCard({ booking, onReject }: BookingActionCardProps) {
// //   const [loading, setLoading] = useState(false);
// //   const [expanded, setExpanded] = useState(false);
// //   const [isChatOpen, setIsChatOpen] = useState(false);
// //   const [isGroupChatOpen, setIsGroupChatOpen] = useState(false);
// //   // Dialog إنشاء الرحلة (يُفتح عند قبول طلب المسافر)
// //   const [isAddTripOpen, setIsAddTripOpen] = useState(false);
// //   // Dialog تفاصيل الرحلة (وقت الانطلاق + نقطة التجمع)
// //   const [isTripDetailsOpen, setIsTripDetailsOpen] = useState(false);
// //   // Dialog نقل الحجز لناقل آخر
// //   const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
// //   const [departureTime, setDepartureTime] = useState('');
// //   const [meetingPoint, setMeetingPoint] = useState((booking as any).meetingPoint || '');
// //   const firestore = useFirestore();
// //   const { user } = useUser();
// //   const { toast } = useToast();
// //   const { verifyBookingReceipt, isProcessing } = useTripActions();
// //   const { profile } = useUserProfile();
// //   const t = useTranslations('bookingActionCard');

// //   const travelerRef = useMemoFirebase(() => {
// //     if (!firestore || !booking.userId) return null;
// //     return doc(firestore, 'users', booking.userId);
// //   }, [firestore, booking.userId]);

// //   const tripRef = useMemoFirebase(() => {
// //     if (!firestore || !booking.tripId) return null;
// //     return doc(firestore, 'trips', booking.tripId);
// //   }, [firestore, booking.tripId]);

// //   const { data: tripData } = useDoc<any>(tripRef);
// //   const { data: travelerProfile, isLoading: isLoadingTraveler } = useDoc<UserProfile>(travelerRef);

// //   const isGhost = !travelerProfile || travelerProfile.isDeactivated;
// //   const travelerProfileName =
// //     [travelerProfile?.firstName, travelerProfile?.lastName].filter(Boolean).join(' ').trim() ||
// //     travelerProfile?.fullName ||
// //     travelerProfile?.displayName;
// //   const displayName = isGhost
// //     ? booking.passengersDetails?.[0]?.name || t('unknownTraveler')
// //     : travelerProfileName || booking.passengersDetails?.[0]?.name || t('traveler');

// //   const depositPct = (booking as any).depositPercentage ?? 10;
// //   const depositAmount = ((booking.totalPrice * depositPct) / 100).toFixed(2);
// //   const remainingAmount = (booking.totalPrice - parseFloat(depositAmount)).toFixed(2);

// //   // ✅ تجهيز رقم الهاتف الخاص بالمسافر مع كود الدولة
// //   const displayPhone = travelerProfile?.phoneNumber
// //     ? `${travelerProfile.phoneCountryCode ? '+' + travelerProfile.phoneCountryCode + ' ' : ''}${travelerProfile.phoneNumber}`
// //     : '';

// //   const config = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG['Pending-Carrier-Confirmation'];
// //   const isThisProcessing = isProcessing === `verify-${booking.id}`;
// //   const reqId = `#${booking.id.slice(-5).toUpperCase()}`;

// //   // ── [NEW FLOW]: الناقل يقبل طلب المسافر → يُفتح dialog إنشاء الرحلة ──
// //   // بعد إنشاء الرحلة من AddTripDialog → نربط الـ booking بالرحلة الجديدة
// //   const handleTripCreated = async (newTripId: string, seatsDeductedByDialog = false) => {
// //     if (!firestore || !user) return;
// //     setLoading(true);
// //     try {
// //       const batch = writeBatch(firestore);

// //       const newStatus = (booking as any).depositPercentage === 0 ? 'Confirmed' : 'Pending-Payment';
// //       const seatsToDeduct = booking.seats || 1;

// //       // ✅ دايماً نجيب بيانات رحلة الناقل الحقيقية
// //       const carrierTripSnap = await getDoc(doc(firestore, 'trips', newTripId));
// //       const carrierTripData = carrierTripSnap.exists() ? carrierTripSnap.data() : null;

// //       // ✅ حدّث الـ booking بكل بيانات رحلة الناقل
// //       batch.update(doc(firestore, 'bookings', booking.id), {
// //         tripId: newTripId,
// //         carrierTripId: newTripId,
// //         status: newStatus,
// //         isPassengerTripDeleted: seatsDeductedByDialog,
// //         // انسخ بيانات رحلة الناقل على الـ booking عشان التذكرة تكون صح
// //         ...(carrierTripData?.departureDate ? { departureDate: carrierTripData.departureDate } : {}),
// //         ...(carrierTripData?.departureTime ? { departureTime: carrierTripData.departureTime } : {}),
// //         ...(carrierTripData?.meetingPoint ? { meetingPoint: carrierTripData.meetingPoint } : {}),
// //         ...(carrierTripData?.meetingPointLink ? { meetingPointLink: carrierTripData.meetingPointLink } : {}),
// //         updatedAt: serverTimestamp(),
// //       });

// //       // ✅ ربط الـ booking برحلة الناقل + خصم المقاعد فوراً لو مفيش عربون
// //       batch.update(doc(firestore, 'trips', newTripId), {
// //         bookingIds: arrayUnion(booking.id),
// //         ...(newStatus === 'Confirmed' && !seatsDeductedByDialog ? {
// //           availableSeats: increment(-seatsToDeduct),
// //           bookedSeats: increment(seatsToDeduct),
// //         } : {}),
// //         updatedAt: serverTimestamp(),
// //       });

// //       // إشعار للمسافر
// //       const notifRef = doc(collection(firestore, 'notifications'));
// //       batch.set(notifRef, {
// //         userId: booking.userId,
// //         title: 'الناقل وافق وأنشأ الرحلة! ✅',
// //         message: newStatus === 'Confirmed' ? 'تم قبول حجزك — تذكرتك جاهزة!' : 'تم قبول حجزك — ادفع العربون لتأكيد مقعدك',
// //         type: 'carrier_accepted_booking',
// //         bookingId: booking.id,
// //         isRead: false,
// //         createdAt: serverTimestamp(),
// //       });

// //       await batch.commit();

// //       // بعد الـ commit: نمسح رحلة المسافر القديمة لو كانت مؤقتة
// //       if (booking.tripId && booking.tripId !== newTripId) {
// //         try {
// //           const passengerTripSnap = await getDoc(doc(firestore, 'trips', booking.tripId));
// //           if (passengerTripSnap.exists() && passengerTripSnap.data()?.status === 'Pending-Carrier-Confirmation') {
// //             await deleteDoc(doc(firestore, 'trips', booking.tripId));
// //           }
// //         } catch (delErr) {
// //           console.error('[handleTripCreated] Failed to delete passenger trip:', delErr);
// //         }
// //       }

// //       // Push للمسافر
// //       await sendPush({
// //         userId: booking.userId,
// //         title: 'الناقل وافق على حجزك ✅',
// //         body: newStatus === 'Confirmed' ? 'تم قبول حجزك — تذكرتك جاهزة!' : 'تم قبول حجزك — ادفع العربون الآن لتأكيد مقعدك',
// //         data: { type: 'carrier_accepted_booking', bookingId: booking.id },
// //       });

// //       // إنشاء group chat
// //       try {
// //         const groupChatRef = doc(firestore, 'chats', newTripId);
// //         await setDoc(groupChatRef, {
// //           id: newTripId,
// //           isGroupChat: true,
// //           tripId: newTripId,
// //           participants: arrayUnion(user.uid, booking.userId),
// //           isClosed: false,
// //           lastMessage: 'انضم الناقل للرحلة',
// //           lastMessageSenderId: 'system',
// //           lastMessageTimestamp: serverTimestamp(),
// //         }, { merge: true });
// //       } catch (e) {
// //         console.warn('[GroupChat] Could not create:', e);
// //       }

// //       setIsAddTripOpen(false);
// //       toast({ title: 'تم قبول الحجز! ✅', description: newStatus === 'Confirmed' ? 'تذكرة المسافر جاهزة.' : 'المسافر سيتلقى إشعاراً بالدفع.' });
// //     } catch (error: any) {
// //       toast({ variant: 'destructive', title: 'فشل ربط الرحلة بالحجز', description: error?.message });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // ✅ دالة موحدة للقبول: تشوف لو في رحلة مربوطة → توافق فوراً، وإلا تفتح AddTripDialog
// //   // تُستخدم لكلا الحالتين: Traveler-Accepted-Awaiting-Carrier و Pending-Carrier-Confirmation
// //   const handleAcceptCustomRequest = async () => {
// //     triggerHaptic('light');
// //     if (!firestore || !user?.uid) return;

// //     setLoading(true);
// //     try {
// //       // ✅ [FIX]: لو الناقل عنده رحلة نشطة حالياً → استخدمها مباشرة بدون بحث
// //       let matchingTripId: string | null = booking.carrierTripId || null;

// //       if (!matchingTripId && profile?.currentActiveTripId) {
// //         // تحقق إن الرحلة النشطة فعلاً Planned أو Ongoing وليست Completed/Cancelled
// //         const activeTripSnap = await getDoc(doc(firestore, 'trips', profile.currentActiveTripId));
// //         if (activeTripSnap.exists()) {
// //           const activeStatus = activeTripSnap.data()?.status;
// //           if (activeStatus === 'Planned' || activeStatus === 'Ongoing') {
// //             matchingTripId = profile.currentActiveTripId;
// //           }
// //         }
// //       }

// //       if (!matchingTripId) {
// //         // Fallback: نبحث في رحلات الناقل بـ origin/destination/date
// //         const q = query(
// //           collection(firestore, 'trips'),
// //           where('carrierId', '==', user.uid),
// //           where('status', 'in', ['Planned', 'Ongoing'])
// //         );
// //         const snapshot = await getDocs(q);

// //         const targetOrigin = (booking as any).requestOrigin || tripData?.origin;
// //         const targetDest = (booking as any).requestDestination || tripData?.destination;

// //         const getIsoDate = (d: any) => {
// //           if (!d) return null;
// //           try { return new Date(d).toISOString().split('T')[0]; } catch { return null; }
// //         };
// //         const targetDateStr = getIsoDate((booking as any).requestDepartureDate || tripData?.departureDate);

// //         snapshot.forEach(docSnap => {
// //           if (matchingTripId) return; // خذ أول واحدة بس
// //           const tData = docSnap.data();
// //           if (tData.origin === targetOrigin && tData.destination === targetDest) {
// //             const tDateStr = getIsoDate(tData.departureDate);
// //             if (!targetDateStr || tDateStr === targetDateStr) {
// //               matchingTripId = docSnap.id;
// //             }
// //           }
// //         });
// //       }

// //       if (matchingTripId) {
// //         // تم العثور على رحلة موجودة! ربط فوراً بدون ديالوج
// //         // seatsDeductedByDialog=false لأن AddTripDialog ما اشتغلش → verifyBookingReceipt هيخصم المقاعد
// //         await handleTripCreated(matchingTripId, false);
// //       } else {
// //         // مفيش رحلة → فتح ديالوج إنشاء رحلة جديدة
// //         setIsAddTripOpen(true);
// //       }
// //     } catch (error) {
// //       console.error('Error checking trips:', error);
// //       setIsAddTripOpen(true); // Fallback in case of error
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleAccept = async () => {
// //     if (!firestore || !user) return;
// //     // التحقق من البيانات الإلزامية
// //     if (!departureTime.trim()) {
// //       toast({ variant: 'destructive', title: 'يجب تحديد وقت الانطلاق أولاً' });
// //       return;
// //     }
// //     if (!meetingPoint.trim()) {
// //       toast({ variant: 'destructive', title: 'يجب تحديد نقطة الانطلاق أولاً' });
// //       return;
// //     }
// //     setLoading(true);
// //     triggerHaptic('success');
// //     try {
// //       // حفظ البيانات في booking وtrip معاً
// //       await updateDoc(doc(firestore, 'bookings', booking.id), {
// //         status: (booking as any).depositPercentage === 0 ? 'Confirmed' : 'Pending-Payment',
// //         departureTime: departureTime.trim(),
// //         meetingPoint: meetingPoint.trim(),
// //         updatedAt: serverTimestamp(),
// //       });
// //       // تحديث الـ trip بنفس البيانات + تحديث departureDate بالوقت الجديد
// //       let newDepartureDateISO: string | undefined;
// //       if (departureTime.trim() && tripData?.departureDate) {
// //         const existingDate = new Date(tripData.departureDate);
// //         const [hours, minutes] = departureTime.trim().split(':').map(Number);
// //         existingDate.setHours(hours, minutes, 0, 0);
// //         newDepartureDateISO = existingDate.toISOString();
// //       }
// //       await updateDoc(doc(firestore, 'trips', booking.tripId), {
// //         departureTime: departureTime.trim(),
// //         meetingPoint: meetingPoint.trim(),
// //         ...(newDepartureDateISO ? { departureDate: newDepartureDateISO } : {}),
// //         updatedAt: serverTimestamp(),
// //       });
// //       const groupChatRef = doc(firestore, 'chats', booking.tripId);
// //       await setDoc(
// //         groupChatRef,
// //         {
// //           id: booking.tripId,
// //           isGroupChat: true,
// //           tripId: booking.tripId,
// //           participants: arrayUnion(user.uid, booking.userId),
// //           isClosed: false,
// //           lastMessage: t('joinedTrip', { name: displayName }),
// //           lastMessageSenderId: 'system',
// //           lastMessageTimestamp: serverTimestamp(),
// //         },
// //         { merge: true }
// //       );
// //       if (booking.bookedByAgent && booking.agentId) {
// //         const { collection: fsCol, addDoc: fsAdd } = await import('firebase/firestore');
// //         await fsAdd(fsCol(doc(firestore, 'users', booking.agentId), 'notifications'), {
// //           userId: booking.agentId,
// //           title: t('agentNotifTitle'),
// //           message: t('agentNotifMessage', { seats: booking.seats }),
// //           type: 'carrier_accepted_agent_booking',
// //           bookingId: booking.id,
// //           tripId: booking.tripId,
// //           isRead: false,
// //           createdAt: serverTimestamp(),
// //         });
// //       }
// //       const pushTarget = booking.bookedByAgent ? booking.agentId : booking.userId;
// //       if (pushTarget) {
// //         await sendPush({
// //           userId: pushTarget,
// //           title: 'الناقل وافق على حجزك ✅',
// //           body: (booking as any).depositPercentage === 0 ? `موعد الانطلاق: ${departureTime} — نقطة التجمع: ${meetingPoint} — تذكرتك جاهزة!` : `موعد الانطلاق: ${departureTime} — نقطة التجمع: ${meetingPoint} — ادفع العربون الآن`,
// //           data: { type: 'carrier_accepted_booking', bookingId: booking.id },
// //         });
// //       }
// //       setIsTripDetailsOpen(false);
// //       toast({ title: t('acceptSuccess') });
// //     } catch (error: any) {
// //       toast({ variant: 'destructive', title: t('acceptError'), description: error?.message });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleReject = async () => {
// //     triggerHaptic('heavy');
// //     setLoading(true);
// //     await onReject(booking.id);
// //     setLoading(false);
// //   };

// //   return (
// //     <>
// //       <div
// //         className={cn(
// //           'group relative overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-200',
// //           'hover:border-border hover:shadow-md',
// //           booking.status === 'Pending-Payment-Verification' && 'border-blue-500/30 hover:border-blue-500/50'
// //         )}
// //       >
// //         {/* Left color bar */}
// //         <div className={cn('absolute start-0 top-0 bottom-0 w-1 rounded-s-2xl', config.bar)} />

// //         {/* Subtle gradient bg */}
// //         <div className={cn('absolute inset-0 bg-gradient-to-br opacity-40 pointer-events-none', config.accent)} />

// //         <div className="relative p-4 sm:p-5 space-y-4">
// //           {/* ── Header row ── */}
// //           <div className="flex justify-center items-center gap-2">
// //             <p className={cn('text-[10px] font-bold uppercase   tracking-wider mb-0.5 border rounded-full px-2 py-0.5 w-fit', config.pill)}>
// //               {t(config.labelKey as any)}
// //             </p>
// //             {booking.status === 'Confirmed' && (
// //               <Button
// //                 variant="outline"
// //                 size="sm"
// //                 className="h-6 px-2 text-[10px] border-amber-500/30 text-amber-600 hover:bg-amber-500 hover:text-white hover:border-amber-500 font-bold rounded-full gap-1 transition-colors"
// //                 onClick={() => setIsTransferDialogOpen(true)}
// //               >
// //                 <ArrowRightLeft className="h-3 w-3" />
// //                 نقل
// //               </Button>
// //             )}
// //           </div>
// //           <div className="flex items-start justify-between gap-3">
// //             {/* Avatar + name */}
// //             <div className="flex items-center gap-3 min-w-0">
// //               {isLoadingTraveler ? (
// //                 <Skeleton className="h-11 w-11 rounded-full shrink-0" />
// //               ) : (
// //                 <Avatar className="h-11 w-11 shrink-0 border-2 border-background shadow-sm">
// //                   <AvatarImage src={travelerProfile?.photoURL || ''} alt='' />
// //                   <AvatarFallback className="bg-primary/10 text-primary font-black text-sm">
// //                     {displayName?.charAt(0)?.toUpperCase() || <User className="h-4 w-4" />}
// //                   </AvatarFallback>
// //                 </Avatar>
// //               )}
// //               <div className="min-w-0">
// //                 <p className="font-black text-sm text-foreground truncate leading-tight">
// //                   {displayName}
// //                 </p>
// //                 <div className="flex items-center gap-2 mt-1">
// //                   <Badge variant="outline" className="h-5 px-1.5 text-[10px] font-bold bg-muted/50">
// //                     {t('seats', { n: booking.seats })}
// //                   </Badge>
// //                   <span className="text-[10px] text-muted-foreground font-mono">{reqId}</span>
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Action buttons */}
// //             <div className="flex items-center gap-1.5 shrink-0">
// //               <Button
// //                 variant="ghost"
// //                 size="icon"
// //                 className="h-9 w-9 rounded-xl hover:bg-blue-500/10 hover:text-blue-600"
// //                 onClick={() => setIsGroupChatOpen(true)}
// //               >
// //                 <MessageSquare className="h-4 w-4" />

// //               </Button>
// //             </div>
// //           </div>

// //           {/* ── Financial summary ── */}
// //           <div className="grid grid-cols-3 gap-2 rounded-xl bg-muted/40 border border-border/50 p-3">
// //             <div className="text-center">
// //               <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">{t('financials.total')}</p>
// //               <p className="text-sm font-black text-foreground mt-0.5">
// //                 {booking.totalPrice} <span className="text-[10px] font-bold text-muted-foreground">{booking.currency}</span>
// //               </p>
// //             </div>
// //             <div className="text-center border-x border-border/50">
// //               <p className="text-[9px] font-bold text-green-600 uppercase tracking-wide">{t('financials.paid')}</p>
// //               <p className="text-sm font-black text-green-600 mt-0.5">{depositAmount}</p>
// //             </div>
// //             <div className="text-center">
// //               <p className="text-[9px] font-bold text-orange-500 uppercase tracking-wide">{t('financials.remaining')}</p>
// //               <p className="text-sm font-black text-orange-500 mt-0.5">{remainingAmount}</p>
// //             </div>
// //           </div>

// //           {/* ── Expandable passengers ── */}
// //           <button
// //             onClick={() => setExpanded((v) => !v)}
// //             className="w-full flex items-center justify-between text-[11px] font-bold text-muted-foreground hover:text-foreground transition-colors py-0.5"
// //           >
// //             <span className="flex items-center gap-1.5">
// //               <Ticket className="h-3.5 w-3.5" />
// //               {t('passengersSection', { count: booking.passengersDetails?.length || 0 })}
// //             </span>
// //             {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
// //           </button>

// //           {expanded && (
// //             <div className="space-y-2 animate-in slide-in-from-top-1 duration-150">
// //               {booking.passengersDetails?.map((p: any, i: number) => {
// //                 const name = p.name || p.passengerName || '';
// //                 const type = p.type || p.passengerType || 'adult';
// //                 const docNum = p.documentNumber || p.documentId || '';

// //                 // ✅ جلب الرقم من بيانات المسافر إذا لم يكن مسجلاً في مصفوفة الركاب
// //                 const phone = p.phone || p.passengerPhone || (i === 0 ? displayPhone : '');

// //                 const nationality = p.nationality || '';
// //                 const typeLabel = type === 'adult' ? t('passengerType.adult') : type === 'minor' ? t('passengerType.minor') : t('passengerType.infant');

// //                 return (
// //                   <div
// //                     key={i}
// //                     className="rounded-xl border border-border/50 bg-muted/30 p-3 space-y-2"
// //                   >
// //                     <div className="flex items-center justify-between">
// //                       <span className="font-black text-sm">{name}</span>
// //                       <Badge variant="outline" className="h-5 text-[10px] px-2">{typeLabel}</Badge>
// //                     </div>
// //                     {(nationality || docNum || phone) && (
// //                       <div className="grid grid-cols-1 gap-1 pt-1.5 border-t border-border/40">
// //                         {nationality && (
// //                           <div className="flex justify-between items-center text-xs">
// //                             <span className="text-muted-foreground">{t('nationality')}</span>
// //                             <span className="font-bold">{nationality}</span>
// //                           </div>
// //                         )}
// //                         {docNum && (
// //                           <div className="flex justify-between items-center text-xs">
// //                             <span className="text-muted-foreground flex items-center gap-1"><CreditCard className="h-3 w-3" /> {t('document')}</span>
// //                             <span className="font-mono font-bold">{docNum}</span>
// //                           </div>
// //                         )}

// //                         {/* ✅ عرض الهاتف بالتنسيق الأخضر المميز */}
// //                         {phone && (
// //                           <div className="flex justify-between items-center text-xs">
// //                             <span className="text-muted-foreground flex items-center gap-1">
// //                               <Phone className="h-3 w-3" /> {t('phone')}
// //                             </span>
// //                             <a href={`tel:${phone.replace(/\s+/g, '')}`} className="font-mono font-black text-emerald-400 hover:text-emerald-300 transition-colors" dir="ltr">
// //                               {phone}
// //                             </a>
// //                           </div>
// //                         )}
// //                       </div>
// //                     )}
// //                   </div>
// //                 );
// //               })}

// //               {/* Agent info */}
// //               {booking.bookedByAgent && booking.agentName && (
// //                 <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
// //                   <p className="text-[10px] font-black text-amber-600 flex items-center gap-1.5 mb-2 uppercase tracking-wide">
// //                     <Briefcase className="h-3 w-3" /> {t('agentBadge')}
// //                   </p>
// //                   <div className="flex justify-between text-xs">
// //                     <span className="text-muted-foreground">{t('agentName')}</span>
// //                     <span className="font-black">{booking.agentName}</span>
// //                   </div>
// //                   <div className="flex justify-between text-xs mt-1">
// //                     <span className="text-muted-foreground">{t('agentFee')}</span>
// //                     <span className="font-black text-amber-600">{booking.agentFee || 0} {booking.currency}</span>
// //                   </div>
// //                 </div>
// //               )}
// //             </div>
// //           )}

// //           {/* ── Payment Verification Block ── */}
// //           {booking.status === 'Pending-Payment-Verification' && (
// //             <div className="rounded-xl border-2 border-dashed border-blue-500/30 bg-blue-500/5 p-4 space-y-3">
// //               <div className="text-center">
// //                 <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center justify-center gap-1.5 mb-1">
// //                   <FileDigit className="h-3.5 w-3.5" /> {t('voucher')}
// //                 </p>
// //                 <p className="text-2xl font-black font-mono text-blue-500 tracking-widest">
// //                   {booking.depositVoucherId || '———'}
// //                 </p>
// //               </div>
// //               <Button
// //                 className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-sm gap-2"
// //                 onClick={() => { triggerHaptic('success'); verifyBookingReceipt(booking); }}
// //                 disabled={isThisProcessing}
// //               >
// //                 {isThisProcessing
// //                   ? <Loader2 className="h-4 w-4 animate-spin" />
// //                   : <><ShieldCheck className="h-4 w-4" /> {t('verifyBtn')}</>
// //                 }
// //               </Button>
// //             </div>
// //           )}

// //           {/* ── Accept / Reject ── */}
// //           {(booking.status === 'Pending-Carrier-Confirmation') && (
// //             <div className="grid grid-cols-2 gap-2 pt-1">
// //               <Button
// //                 className="h-11 bg-green-600 hover:bg-green-700 text-white font-black rounded-xl shadow-sm gap-1.5 text-sm"
// //                 onClick={handleAcceptCustomRequest}
// //                 disabled={loading}
// //               >
// //                 <CheckCircle2 className="h-4 w-4" /> {t('acceptBtn')}
// //               </Button>
// //               <Button
// //                 variant="outline"
// //                 className="h-11 border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 font-black rounded-xl text-sm gap-1.5"
// //                 onClick={handleReject}
// //                 disabled={loading}
// //               >
// //                 <XCircle className="h-4 w-4" /> {t('rejectBtn')}
// //               </Button>
// //             </div>
// //           )}
// //         </div>
// //       </div>

// //       <ChatDialog
// //         isOpen={isChatOpen}
// //         onOpenChange={setIsChatOpen}
// //         bookingId={booking.id}
// //         otherPartyId={booking.userId}
// //         otherPartyName={displayName || t('traveler')}
// //         chatType="private"
// //       />
// //       <ChatDialog
// //         isOpen={isGroupChatOpen}
// //         onOpenChange={setIsGroupChatOpen}
// //         trip={{ id: booking.tripId } as any}
// //         chatType="group"
// //       />


// //       {/* ── BookingTransferDialog: نقل الحجز المؤكد لناقل آخر ── */}
// //       {booking.status === 'Confirmed' && tripData && (
// //         <BookingTransferDialog
// //           isOpen={isTransferDialogOpen}
// //           onOpenChange={setIsTransferDialogOpen}
// //           booking={booking}
// //           carrierTrip={tripData}
// //           passengerName={displayName || ''}
// //         />
// //       )}

// //       {/* ── AddTripDialog: يُفتح عند قبول الناقل لطلب المسافر ── */}
// //       <AddTripDialog
// //         isOpen={isAddTripOpen}
// //         onOpenChange={setIsAddTripOpen}
// //         prefill={(() => {
// //           const originCity = (booking as any).requestOrigin || (booking as any).origin || '';
// //           const destCity = (booking as any).requestDestination || (booking as any).destination || '';
// //           const rawDate = (booking as any).requestDepartureDate || (booking as any).departureDate;
// //           return {
// //             origin: originCity,
// //             originCountry: (booking as any).requestOriginCountry || (booking as any).originCountry || getCountryFromCity(originCity),
// //             destination: destCity,
// //             destinationCountry: (booking as any).requestDestinationCountry || (booking as any).destinationCountry || getCountryFromCity(destCity),
// //             departureDate: rawDate ? new Date(rawDate) : undefined,
// //             passengers: booking.seats,
// //             requestId: booking.tripId,
// //             // ✅ نمرّر نسبة العربون من الحجز عشان الناقل يقدر يعدّلها على الرحلة
// //             depositPercentage: (booking as any).depositPercentage,
// //           };
// //         })()}
// //         onTripCreated={(id) => handleTripCreated(id, true)}
// //       />
// //     </>
// //   );
// // }

// 'use client';

// import { useState } from 'react';
// import type { Booking, UserProfile } from '@/lib/data';
// import { Button } from '@/components/ui/button';
// import {
//   User, Loader2, CheckCircle2, XCircle, MessageSquare,
//   Users, FileDigit, ShieldCheck, Briefcase, Phone, CreditCard,
//   ChevronDown, ChevronUp, Ticket, MapPin, Clock, Navigation, ArrowRightLeft
// } from 'lucide-react';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Badge } from '@/components/ui/badge';
// import { Skeleton } from '@/components/ui/skeleton';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
// import { ChatDialog } from '@/components/chat/chat-dialog';
// import { useFirestore, useUser, useDoc, useMemoFirebase } from '@/firebase';
// import { useToast } from '@/hooks/use-toast';
// import { cn, triggerHaptic } from '@/lib/utils';
// import { useTripActions } from '@/hooks/use-trip-actions';
// import { useUserProfile } from '@/hooks/use-user-profile';
// import { doc, updateDoc, serverTimestamp, setDoc, arrayUnion, collection, writeBatch, getDocs, getDoc, deleteDoc, query, where, increment } from 'firebase/firestore';
// import { useTranslations } from 'next-intl';
// import { sendPush } from '@/lib/send-push';
// import { AddTripDialog } from '@/components/carrier/add-trip-dialog';
// import { SOVEREIGN_GEO_REGISTRY } from '@/lib/constants';
// import { BookingTransferDialog } from '@/components/carrier/booking-transfer-dialog';

// // helper: يرجع كود الدولة من city key (مثلاً 'riyadh' → 'SA')
// function getCountryFromCity(cityKey: string): string {
//   if (!cityKey) return '';
//   const lower = cityKey.toLowerCase();
//   for (const [countryCode, data] of Object.entries(SOVEREIGN_GEO_REGISTRY)) {
//     if ((data as any).cities?.includes(lower)) return countryCode;
//   }
//   return '';
// }

// interface BookingActionCardProps {
//   booking: Booking;
//   onReject: (bookingId: string) => Promise<void>;
// }

// const STATUS_CONFIG = {
//   'Pending-Carrier-Confirmation': {
//     pill: 'bg-white text-black border-amber-500/20',
//     accent: 'bg-[#111827]',
//     bar: 'bg-white',
//     labelKey: 'status.pendingCarrier',
//   },
//   'Pending-Payment': {
//     pill: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
//     accent: 'from-orange-500/15 to-orange-500/0',
//     bar: 'bg-orange-500',
//     labelKey: 'status.pendingPayment',
//   },
//   'Pending-Payment-Verification': {
//     pill: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
//     accent: 'from-blue-500/15 to-blue-500/0',
//     bar: 'bg-blue-500 animate-pulse',
//     labelKey: 'status.pendingVerification',
//   },
//   'Confirmed': {
//     pill: 'bg-green-500/10 text-green-600 border-green-500/20',
//     accent: 'from-green-500/10 to-green-500/0',
//     bar: 'bg-green-500',
//     labelKey: 'status.confirmed',
//   },
// } as Record<string, { pill: string; accent: string; bar: string; labelKey: string }>;

// export function BookingActionCard({ booking, onReject }: BookingActionCardProps) {
//   const [loading, setLoading] = useState(false);
//   const [expanded, setExpanded] = useState(false);
//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const [isGroupChatOpen, setIsGroupChatOpen] = useState(false);
//   // Dialog إنشاء الرحلة (يُفتح عند قبول طلب المسافر)
//   const [isAddTripOpen, setIsAddTripOpen] = useState(false);
//   // Dialog تفاصيل الرحلة (وقت الانطلاق + نقطة التجمع)
//   const [isTripDetailsOpen, setIsTripDetailsOpen] = useState(false);
//   // Dialog نقل الحجز لناقل آخر
//   const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
//   const [departureTime, setDepartureTime] = useState('');
//   const [meetingPoint, setMeetingPoint] = useState((booking as any).meetingPoint || '');
//   const firestore = useFirestore();
//   const { user } = useUser();
//   const { toast } = useToast();
//   const { verifyBookingReceipt, isProcessing } = useTripActions();
//   const { profile } = useUserProfile();
//   const t = useTranslations('bookingActionCard');

//   const travelerRef = useMemoFirebase(() => {
//     if (!firestore || !booking.userId) return null;
//     return doc(firestore, 'users', booking.userId);
//   }, [firestore, booking.userId]);

//   const tripRef = useMemoFirebase(() => {
//     if (!firestore || !booking.tripId) return null;
//     return doc(firestore, 'trips', booking.tripId);
//   }, [firestore, booking.tripId]);

//   const { data: tripData } = useDoc<any>(tripRef);
//   const { data: travelerProfile, isLoading: isLoadingTraveler } = useDoc<UserProfile>(travelerRef);

//   const isGhost = !travelerProfile || travelerProfile.isDeactivated;
//   const travelerProfileName =
//     [travelerProfile?.firstName, travelerProfile?.lastName].filter(Boolean).join(' ').trim() ||
//     travelerProfile?.fullName ||
//     travelerProfile?.displayName;
//   const displayName = isGhost
//     ? booking.passengersDetails?.[0]?.name || t('unknownTraveler')
//     : travelerProfileName || booking.passengersDetails?.[0]?.name || t('traveler');

//   const depositPct = (booking as any).depositPercentage ?? 10;
//   const depositAmount = ((booking.totalPrice * depositPct) / 100).toFixed(2);
//   const remainingAmount = (booking.totalPrice - parseFloat(depositAmount)).toFixed(2);

//   // ✅ تجهيز رقم الهاتف الخاص بالمسافر مع كود الدولة
//   const displayPhone = travelerProfile?.phoneNumber
//     ? `${travelerProfile.phoneCountryCode ? '+' + travelerProfile.phoneCountryCode + ' ' : ''}${travelerProfile.phoneNumber}`
//     : '';

//   const config = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG['Pending-Carrier-Confirmation'];
//   const isThisProcessing = isProcessing === `verify-${booking.id}`;
//   const reqId = `#${booking.id.slice(-5).toUpperCase()}`;

//   // ── [NEW FLOW]: الناقل يقبل طلب المسافر → يُفتح dialog إنشاء الرحلة ──
//   // بعد إنشاء الرحلة من AddTripDialog → نربط الـ booking بالرحلة الجديدة
//   const handleTripCreated = async (newTripId: string, seatsDeductedByDialog = false) => {
//     if (!firestore || !user) return;
//     setLoading(true);
//     try {
//       const batch = writeBatch(firestore);

//       const newStatus = (booking as any).depositPercentage === 0 ? 'Confirmed' : 'Pending-Payment';
//       const seatsToDeduct = booking.seats || 1;

//       // ✅ دايماً نجيب بيانات رحلة الناقل الحقيقية
//       const carrierTripSnap = await getDoc(doc(firestore, 'trips', newTripId));
//       const carrierTripData = carrierTripSnap.exists() ? carrierTripSnap.data() : null;

//       // ✅ حدّث الـ booking بكل بيانات رحلة الناقل
//       batch.update(doc(firestore, 'bookings', booking.id), {
//         tripId: newTripId,
//         carrierTripId: newTripId,
//         status: newStatus,
//         isPassengerTripDeleted: seatsDeductedByDialog,
//         // انسخ بيانات رحلة الناقل على الـ booking عشان التذكرة تكون صح
//         ...(carrierTripData?.departureDate ? { departureDate: carrierTripData.departureDate } : {}),
//         ...(carrierTripData?.departureTime ? { departureTime: carrierTripData.departureTime } : {}),
//         ...(carrierTripData?.meetingPoint ? { meetingPoint: carrierTripData.meetingPoint } : {}),
//         ...(carrierTripData?.meetingPointLink ? { meetingPointLink: carrierTripData.meetingPointLink } : {}),
//         updatedAt: serverTimestamp(),
//       });

//       // ✅ ربط الـ booking برحلة الناقل + خصم المقاعد فوراً لو مفيش عربون
//       batch.update(doc(firestore, 'trips', newTripId), {
//         bookingIds: arrayUnion(booking.id),
//         ...(newStatus === 'Confirmed' && !seatsDeductedByDialog ? {
//           availableSeats: increment(-seatsToDeduct),
//           bookedSeats: increment(seatsToDeduct),
//         } : {}),
//         updatedAt: serverTimestamp(),
//       });

//       // إشعار للمسافر
//       const notifRef = doc(collection(firestore, 'notifications'));
//       batch.set(notifRef, {
//         userId: booking.userId,
//         title: 'الناقل وافق وأنشأ الرحلة! ✅',
//         message: newStatus === 'Confirmed' ? 'تم قبول حجزك — تذكرتك جاهزة!' : 'تم قبول حجزك — ادفع العربون لتأكيد مقعدك',
//         type: 'carrier_accepted_booking',
//         bookingId: booking.id,
//         isRead: false,
//         createdAt: serverTimestamp(),
//       });

//       await batch.commit();

//       // بعد الـ commit: نمسح رحلة المسافر القديمة لو كانت مؤقتة
//       if (booking.tripId && booking.tripId !== newTripId) {
//         try {
//           const passengerTripSnap = await getDoc(doc(firestore, 'trips', booking.tripId));
//           if (passengerTripSnap.exists() && passengerTripSnap.data()?.status === 'Pending-Carrier-Confirmation') {
//             await deleteDoc(doc(firestore, 'trips', booking.tripId));
//           }
//         } catch (delErr) {
//           console.error('[handleTripCreated] Failed to delete passenger trip:', delErr);
//         }
//       }

//       // Push للمسافر
//       await sendPush({
//         userId: booking.userId,
//         title: 'الناقل وافق على حجزك ✅',
//         body: newStatus === 'Confirmed' ? 'تم قبول حجزك — تذكرتك جاهزة!' : 'تم قبول حجزك — ادفع العربون الآن لتأكيد مقعدك',
//         data: { type: 'carrier_accepted_booking', bookingId: booking.id },
//       });

//       // إنشاء group chat
//       try {
//         const groupChatRef = doc(firestore, 'chats', newTripId);
//         await setDoc(groupChatRef, {
//           id: newTripId,
//           isGroupChat: true,
//           tripId: newTripId,
//           participants: arrayUnion(user.uid, booking.userId),
//           isClosed: false,
//           lastMessage: 'انضم الناقل للرحلة',
//           lastMessageSenderId: 'system',
//           lastMessageTimestamp: serverTimestamp(),
//         }, { merge: true });
//       } catch (e) {
//         console.warn('[GroupChat] Could not create:', e);
//       }

//       setIsAddTripOpen(false);
//       toast({ title: 'تم قبول الحجز! ✅', description: newStatus === 'Confirmed' ? 'تذكرة المسافر جاهزة.' : 'المسافر سيتلقى إشعاراً بالدفع.' });
//     } catch (error: any) {
//       toast({ variant: 'destructive', title: 'فشل ربط الرحلة بالحجز', description: error?.message });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ دالة موحدة للقبول: تشوف لو في رحلة مربوطة → توافق فوراً، وإلا تفتح AddTripDialog
//   // تُستخدم لكلا الحالتين: Traveler-Accepted-Awaiting-Carrier و Pending-Carrier-Confirmation
//   const handleAcceptCustomRequest = async () => {
//     triggerHaptic('light');
//     if (!firestore || !user?.uid) return;

//     setLoading(true);
//     try {
//       // ✅ [FIX]: لو الناقل عنده رحلة نشطة حالياً → استخدمها مباشرة بدون بحث
//       let matchingTripId: string | null = booking.carrierTripId || null;

//       if (!matchingTripId && profile?.currentActiveTripId) {
//         // تحقق إن الرحلة النشطة فعلاً Planned أو Ongoing وليست Completed/Cancelled
//         const activeTripSnap = await getDoc(doc(firestore, 'trips', profile.currentActiveTripId));
//         if (activeTripSnap.exists()) {
//           const activeStatus = activeTripSnap.data()?.status;
//           if (activeStatus === 'Planned' || activeStatus === 'Ongoing') {
//             matchingTripId = profile.currentActiveTripId;
//           }
//         }
//       }

//       if (!matchingTripId) {
//         // Fallback: نبحث في رحلات الناقل بـ origin/destination/date
//         const q = query(
//           collection(firestore, 'trips'),
//           where('carrierId', '==', user.uid),
//           where('status', 'in', ['Planned', 'Ongoing'])
//         );
//         const snapshot = await getDocs(q);

//         const targetOrigin = (booking as any).requestOrigin || tripData?.origin;
//         const targetDest = (booking as any).requestDestination || tripData?.destination;

//         const getIsoDate = (d: any) => {
//           if (!d) return null;
//           try { return new Date(d).toISOString().split('T')[0]; } catch { return null; }
//         };
//         const targetDateStr = getIsoDate((booking as any).requestDepartureDate || tripData?.departureDate);

//         snapshot.forEach(docSnap => {
//           if (matchingTripId) return; // خذ أول واحدة بس
//           const tData = docSnap.data();
//           if (tData.origin === targetOrigin && tData.destination === targetDest) {
//             const tDateStr = getIsoDate(tData.departureDate);
//             if (!targetDateStr || tDateStr === targetDateStr) {
//               matchingTripId = docSnap.id;
//             }
//           }
//         });
//       }

//       if (matchingTripId) {
//         // تم العثور على رحلة موجودة! ربط فوراً بدون ديالوج
//         // seatsDeductedByDialog=false لأن AddTripDialog ما اشتغلش → verifyBookingReceipt هيخصم المقاعد
//         await handleTripCreated(matchingTripId, false);
//       } else {
//         // مفيش رحلة → فتح ديالوج إنشاء رحلة جديدة
//         setIsAddTripOpen(true);
//       }
//     } catch (error) {
//       console.error('Error checking trips:', error);
//       setIsAddTripOpen(true); // Fallback in case of error
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAccept = async () => {
//     if (!firestore || !user) return;
//     // التحقق من البيانات الإلزامية
//     if (!departureTime.trim()) {
//       toast({ variant: 'destructive', title: 'يجب تحديد وقت الانطلاق أولاً' });
//       return;
//     }
//     if (!meetingPoint.trim()) {
//       toast({ variant: 'destructive', title: 'يجب تحديد نقطة الانطلاق أولاً' });
//       return;
//     }
//     setLoading(true);
//     triggerHaptic('success');
//     try {
//       const newStatus = (booking as any).depositPercentage === 0 ? 'Confirmed' : 'Pending-Payment';
//       const seatsToDeduct = booking.seats || 1;

//       // ✅ [FIX]: استخدام writeBatch لضمان atomicity
//       const batch = writeBatch(firestore);

//       // حفظ البيانات في booking وtrip معاً
//       batch.update(doc(firestore, 'bookings', booking.id), {
//         status: newStatus,
//         departureTime: departureTime.trim(),
//         meetingPoint: meetingPoint.trim(),
//         carrierId: user.uid,          // ✅ [FIX]: تأكيد carrierId على الـ booking
//         carrierTripId: booking.carrierTripId || booking.tripId, // ✅ [FIX]: ربط الـ booking برحلة الناقل
//         updatedAt: serverTimestamp(),
//       });

//       // تحديث الـ trip بنفس البيانات + تحديث departureDate بالوقت الجديد
//       let newDepartureDateISO: string | undefined;
//       if (departureTime.trim() && tripData?.departureDate) {
//         const existingDate = new Date(tripData.departureDate);
//         const [hours, minutes] = departureTime.trim().split(':').map(Number);
//         existingDate.setHours(hours, minutes, 0, 0);
//         newDepartureDateISO = existingDate.toISOString();
//       }

//       // ✅ [FIX]: خصم المقاعد عند القبول لو الحجز Confirmed مباشرة (بدون عربون)
//       batch.update(doc(firestore, 'trips', booking.carrierTripId || booking.tripId), {
//         departureTime: departureTime.trim(),
//         meetingPoint: meetingPoint.trim(),
//         ...(newDepartureDateISO ? { departureDate: newDepartureDateISO } : {}),
//         bookingIds: arrayUnion(booking.id), // ✅ [FIX]: إضافة الـ booking لقائمة رحلة الناقل
//         ...(newStatus === 'Confirmed' ? {
//           availableSeats: increment(-seatsToDeduct), // ✅ [FIX]: خصم المقاعد فوراً لو Confirmed
//           bookedSeats: increment(seatsToDeduct),
//         } : {}),
//         updatedAt: serverTimestamp(),
//       });

//       await batch.commit();
//       const groupChatRef = doc(firestore, 'chats', booking.tripId);
//       await setDoc(
//         groupChatRef,
//         {
//           id: booking.tripId,
//           isGroupChat: true,
//           tripId: booking.tripId,
//           participants: arrayUnion(user.uid, booking.userId),
//           isClosed: false,
//           lastMessage: t('joinedTrip', { name: displayName }),
//           lastMessageSenderId: 'system',
//           lastMessageTimestamp: serverTimestamp(),
//         },
//         { merge: true }
//       );
//       if (booking.bookedByAgent && booking.agentId) {
//         const { collection: fsCol, addDoc: fsAdd } = await import('firebase/firestore');
//         await fsAdd(fsCol(doc(firestore, 'users', booking.agentId), 'notifications'), {
//           userId: booking.agentId,
//           title: t('agentNotifTitle'),
//           message: t('agentNotifMessage', { seats: booking.seats }),
//           type: 'carrier_accepted_agent_booking',
//           bookingId: booking.id,
//           tripId: booking.tripId,
//           isRead: false,
//           createdAt: serverTimestamp(),
//         });
//       }
//       const pushTarget = booking.bookedByAgent ? booking.agentId : booking.userId;
//       if (pushTarget) {
//         await sendPush({
//           userId: pushTarget,
//           title: 'الناقل وافق على حجزك ✅',
//           body: (booking as any).depositPercentage === 0 ? `موعد الانطلاق: ${departureTime} — نقطة التجمع: ${meetingPoint} — تذكرتك جاهزة!` : `موعد الانطلاق: ${departureTime} — نقطة التجمع: ${meetingPoint} — ادفع العربون الآن`,
//           data: { type: 'carrier_accepted_booking', bookingId: booking.id },
//         });
//       }
//       setIsTripDetailsOpen(false);
//       toast({ title: t('acceptSuccess') });
//     } catch (error: any) {
//       toast({ variant: 'destructive', title: t('acceptError'), description: error?.message });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleReject = async () => {
//     triggerHaptic('heavy');
//     setLoading(true);
//     await onReject(booking.id);
//     setLoading(false);
//   };

//   return (
//     <>
//       <div
//         className={cn(
//           'group relative overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-200',
//           'hover:border-border hover:shadow-md',
//           booking.status === 'Pending-Payment-Verification' && 'border-blue-500/30 hover:border-blue-500/50'
//         )}
//       >
//         {/* Left color bar */}
//         <div className={cn('absolute start-0 top-0 bottom-0 w-1 rounded-s-2xl', config.bar)} />

//         {/* Subtle gradient bg */}
//         <div className={cn('absolute inset-0 bg-gradient-to-br opacity-40 pointer-events-none', config.accent)} />

//         <div className="relative p-4 sm:p-5 space-y-4">
//           {/* ── Header row ── */}
//           <div className="flex justify-center items-center gap-2">
//             <p className={cn('text-[10px] font-bold uppercase   tracking-wider mb-0.5 border rounded-full px-2 py-0.5 w-fit', config.pill)}>
//               {t(config.labelKey as any)}
//             </p>
//             {booking.status === 'Confirmed' && (
//               <Button
//                 variant="outline"
//                 size="sm"
//                 className="h-6 px-2 text-[10px] border-amber-500/30 text-amber-600 hover:bg-amber-500 hover:text-white hover:border-amber-500 font-bold rounded-full gap-1 transition-colors"
//                 onClick={() => setIsTransferDialogOpen(true)}
//               >
//                 <ArrowRightLeft className="h-3 w-3" />
//                 نقل
//               </Button>
//             )}
//           </div>
//           <div className="flex items-start justify-between gap-3">
//             {/* Avatar + name */}
//             <div className="flex items-center gap-3 min-w-0">
//               {isLoadingTraveler ? (
//                 <Skeleton className="h-11 w-11 rounded-full shrink-0" />
//               ) : (
//                 <Avatar className="h-11 w-11 shrink-0 border-2 border-background shadow-sm">
//                   <AvatarImage src={travelerProfile?.photoURL || ''} alt='' />
//                   <AvatarFallback className="bg-primary/10 text-primary font-black text-sm">
//                     {displayName?.charAt(0)?.toUpperCase() || <User className="h-4 w-4" />}
//                   </AvatarFallback>
//                 </Avatar>
//               )}
//               <div className="min-w-0">
//                 <p className="font-black text-sm text-foreground truncate leading-tight">
//                   {displayName}
//                 </p>
//                 <div className="flex items-center gap-2 mt-1">
//                   <Badge variant="outline" className="h-5 px-1.5 text-[10px] font-bold bg-muted/50">
//                     {t('seats', { n: booking.seats })}
//                   </Badge>
//                   <span className="text-[10px] text-muted-foreground font-mono">{reqId}</span>
//                 </div>
//               </div>
//             </div>

//             {/* Action buttons */}
//             <div className="flex items-center gap-1.5 shrink-0">
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="h-9 w-9 rounded-xl hover:bg-blue-500/10 hover:text-blue-600"
//                 onClick={() => setIsGroupChatOpen(true)}
//               >
//                 <MessageSquare className="h-4 w-4" />

//               </Button>
//             </div>
//           </div>

//           {/* ── Financial summary ── */}
//           <div className="grid grid-cols-3 gap-2 rounded-xl bg-muted/40 border border-border/50 p-3">
//             <div className="text-center">
//               <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">{t('financials.total')}</p>
//               <p className="text-sm font-black text-foreground mt-0.5">
//                 {booking.totalPrice} <span className="text-[10px] font-bold text-muted-foreground">{booking.currency}</span>
//               </p>
//             </div>
//             <div className="text-center border-x border-border/50">
//               <p className="text-[9px] font-bold text-green-600 uppercase tracking-wide">{t('financials.paid')}</p>
//               <p className="text-sm font-black text-green-600 mt-0.5">{depositAmount}</p>
//             </div>
//             <div className="text-center">
//               <p className="text-[9px] font-bold text-orange-500 uppercase tracking-wide">{t('financials.remaining')}</p>
//               <p className="text-sm font-black text-orange-500 mt-0.5">{remainingAmount}</p>
//             </div>
//           </div>

//           {/* ── Expandable passengers ── */}
//           <button
//             onClick={() => setExpanded((v) => !v)}
//             className="w-full flex items-center justify-between text-[11px] font-bold text-muted-foreground hover:text-foreground transition-colors py-0.5"
//           >
//             <span className="flex items-center gap-1.5">
//               <Ticket className="h-3.5 w-3.5" />
//               {t('passengersSection', { count: booking.passengersDetails?.length || 0 })}
//             </span>
//             {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
//           </button>

//           {expanded && (
//             <div className="space-y-2 animate-in slide-in-from-top-1 duration-150">
//               {booking.passengersDetails?.map((p: any, i: number) => {
//                 const name = p.name || p.passengerName || '';
//                 const type = p.type || p.passengerType || 'adult';
//                 const docNum = p.documentNumber || p.documentId || '';

//                 // ✅ جلب الرقم من بيانات المسافر إذا لم يكن مسجلاً في مصفوفة الركاب
//                 const phone = p.phone || p.passengerPhone || (i === 0 ? displayPhone : '');

//                 const nationality = p.nationality || '';
//                 const typeLabel = type === 'adult' ? t('passengerType.adult') : type === 'minor' ? t('passengerType.minor') : t('passengerType.infant');

//                 return (
//                   <div
//                     key={i}
//                     className="rounded-xl border border-border/50 bg-muted/30 p-3 space-y-2"
//                   >
//                     <div className="flex items-center justify-between">
//                       <span className="font-black text-sm">{name}</span>
//                       <Badge variant="outline" className="h-5 text-[10px] px-2">{typeLabel}</Badge>
//                     </div>
//                     {(nationality || docNum || phone) && (
//                       <div className="grid grid-cols-1 gap-1 pt-1.5 border-t border-border/40">
//                         {nationality && (
//                           <div className="flex justify-between items-center text-xs">
//                             <span className="text-muted-foreground">{t('nationality')}</span>
//                             <span className="font-bold">{nationality}</span>
//                           </div>
//                         )}
//                         {docNum && (
//                           <div className="flex justify-between items-center text-xs">
//                             <span className="text-muted-foreground flex items-center gap-1"><CreditCard className="h-3 w-3" /> {t('document')}</span>
//                             <span className="font-mono font-bold">{docNum}</span>
//                           </div>
//                         )}

//                         {/* ✅ عرض الهاتف بالتنسيق الأخضر المميز */}
//                         {phone && (
//                           <div className="flex justify-between items-center text-xs">
//                             <span className="text-muted-foreground flex items-center gap-1">
//                               <Phone className="h-3 w-3" /> {t('phone')}
//                             </span>
//                             <a href={`tel:${phone.replace(/\s+/g, '')}`} className="font-mono font-black text-emerald-400 hover:text-emerald-300 transition-colors" dir="ltr">
//                               {phone}
//                             </a>
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}

//               {/* Agent info */}
//               {booking.bookedByAgent && booking.agentName && (
//                 <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
//                   <p className="text-[10px] font-black text-amber-600 flex items-center gap-1.5 mb-2 uppercase tracking-wide">
//                     <Briefcase className="h-3 w-3" /> {t('agentBadge')}
//                   </p>
//                   <div className="flex justify-between text-xs">
//                     <span className="text-muted-foreground">{t('agentName')}</span>
//                     <span className="font-black">{booking.agentName}</span>
//                   </div>
//                   <div className="flex justify-between text-xs mt-1">
//                     <span className="text-muted-foreground">{t('agentFee')}</span>
//                     <span className="font-black text-amber-600">{booking.agentFee || 0} {booking.currency}</span>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* ── Payment Verification Block ── */}
//           {booking.status === 'Pending-Payment-Verification' && (
//             <div className="rounded-xl border-2 border-dashed border-blue-500/30 bg-blue-500/5 p-4 space-y-3">
//               <div className="text-center">
//                 <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center justify-center gap-1.5 mb-1">
//                   <FileDigit className="h-3.5 w-3.5" /> {t('voucher')}
//                 </p>
//                 <p className="text-2xl font-black font-mono text-blue-500 tracking-widest">
//                   {booking.depositVoucherId || '———'}
//                 </p>
//               </div>
//               <Button
//                 className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-sm gap-2"
//                 onClick={() => { triggerHaptic('success'); verifyBookingReceipt(booking); }}
//                 disabled={isThisProcessing}
//               >
//                 {isThisProcessing
//                   ? <Loader2 className="h-4 w-4 animate-spin" />
//                   : <><ShieldCheck className="h-4 w-4" /> {t('verifyBtn')}</>
//                 }
//               </Button>
//             </div>
//           )}

//           {/* ── Accept / Reject ── */}
//           {(booking.status === 'Pending-Carrier-Confirmation') && (
//             <div className="grid grid-cols-2 gap-2 pt-1">
//               <Button
//                 className="h-11 bg-green-600 hover:bg-green-700 text-white font-black rounded-xl shadow-sm gap-1.5 text-sm"
//                 onClick={handleAcceptCustomRequest}
//                 disabled={loading}
//               >
//                 <CheckCircle2 className="h-4 w-4" /> {t('acceptBtn')}
//               </Button>
//               <Button
//                 variant="outline"
//                 className="h-11 border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 font-black rounded-xl text-sm gap-1.5"
//                 onClick={handleReject}
//                 disabled={loading}
//               >
//                 <XCircle className="h-4 w-4" /> {t('rejectBtn')}
//               </Button>
//             </div>
//           )}
//         </div>
//       </div>

//       <ChatDialog
//         isOpen={isChatOpen}
//         onOpenChange={setIsChatOpen}
//         bookingId={booking.id}
//         otherPartyId={booking.userId}
//         otherPartyName={displayName || t('traveler')}
//         chatType="private"
//       />
//       <ChatDialog
//         isOpen={isGroupChatOpen}
//         onOpenChange={setIsGroupChatOpen}
//         trip={{ id: booking.tripId } as any}
//         chatType="group"
//       />


//       {/* ── BookingTransferDialog: نقل الحجز المؤكد لناقل آخر ── */}
//       {booking.status === 'Confirmed' && tripData && (
//         <BookingTransferDialog
//           isOpen={isTransferDialogOpen}
//           onOpenChange={setIsTransferDialogOpen}
//           booking={booking}
//           carrierTrip={tripData}
//           passengerName={displayName || ''}
//         />
//       )}

//       {/* ── AddTripDialog: يُفتح عند قبول الناقل لطلب المسافر ── */}
//       <AddTripDialog
//         isOpen={isAddTripOpen}
//         onOpenChange={setIsAddTripOpen}
//         prefill={(() => {
//           const originCity = (booking as any).requestOrigin || (booking as any).origin || '';
//           const destCity = (booking as any).requestDestination || (booking as any).destination || '';
//           const rawDate = (booking as any).requestDepartureDate || (booking as any).departureDate;
//           return {
//             origin: originCity,
//             originCountry: (booking as any).requestOriginCountry || (booking as any).originCountry || getCountryFromCity(originCity),
//             destination: destCity,
//             destinationCountry: (booking as any).requestDestinationCountry || (booking as any).destinationCountry || getCountryFromCity(destCity),
//             departureDate: rawDate ? new Date(rawDate) : undefined,
//             passengers: booking.seats,
//             requestId: booking.tripId,
//             // ✅ نمرّر نسبة العربون من الحجز عشان الناقل يقدر يعدّلها على الرحلة
//             depositPercentage: (booking as any).depositPercentage,
//           };
//         })()}
//         onTripCreated={(id) => handleTripCreated(id, true)}
//       />
//     </>
//   );
// }

'use client';

import { useState } from 'react';
import type { Booking, UserProfile } from '@/lib/data';
import { Button } from '@/components/ui/button';
import {
  User, Loader2, CheckCircle2, XCircle, MessageSquare,
  Users, FileDigit, ShieldCheck, Briefcase, Phone, CreditCard,
  ChevronDown, ChevronUp, Ticket, MapPin, Clock, Navigation, ArrowRightLeft
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ChatDialog } from '@/components/chat/chat-dialog';
import { useFirestore, useUser, useDoc, useMemoFirebase } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { cn, triggerHaptic } from '@/lib/utils';
import { useTripActions } from '@/hooks/use-trip-actions';
import { useUserProfile } from '@/hooks/use-user-profile';
import { doc, updateDoc, serverTimestamp, setDoc, arrayUnion, collection, writeBatch, getDocs, getDoc, deleteDoc, query, where, increment } from 'firebase/firestore';
import { useTranslations } from 'next-intl';
import { sendPush } from '@/lib/send-push';
import { AddTripDialog } from '@/components/carrier/add-trip-dialog';
import { SOVEREIGN_GEO_REGISTRY } from '@/lib/constants';
import { BookingTransferDialog } from '@/components/carrier/booking-transfer-dialog';

// helper: يرجع كود الدولة من city key (مثلاً 'riyadh' → 'SA')
function getCountryFromCity(cityKey: string): string {
  if (!cityKey) return '';
  const lower = cityKey.toLowerCase();
  for (const [countryCode, data] of Object.entries(SOVEREIGN_GEO_REGISTRY)) {
    if ((data as any).cities?.includes(lower)) return countryCode;
  }
  return '';
}

interface BookingActionCardProps {
  booking: Booking;
  onReject: (bookingId: string) => Promise<void>;
}

const STATUS_CONFIG = {
  'Pending-Carrier-Confirmation': {
    pill: 'bg-white text-black border-amber-500/20',
    accent: 'bg-[#111827]',
    bar: 'bg-white',
    labelKey: 'status.pendingCarrier',
  },
  'Pending-Payment': {
    pill: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
    accent: 'from-orange-500/15 to-orange-500/0',
    bar: 'bg-orange-500',
    labelKey: 'status.pendingPayment',
  },
  'Pending-Payment-Verification': {
    pill: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    accent: 'from-blue-500/15 to-blue-500/0',
    bar: 'bg-blue-500 animate-pulse',
    labelKey: 'status.pendingVerification',
  },
  'Confirmed': {
    pill: 'bg-green-500/10 text-green-600 border-green-500/20',
    accent: 'from-green-500/10 to-green-500/0',
    bar: 'bg-green-500',
    labelKey: 'status.confirmed',
  },
} as Record<string, { pill: string; accent: string; bar: string; labelKey: string }>;

export function BookingActionCard({ booking, onReject }: BookingActionCardProps) {
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isGroupChatOpen, setIsGroupChatOpen] = useState(false);
  // Dialog إنشاء الرحلة (يُفتح عند قبول طلب المسافر)
  const [isAddTripOpen, setIsAddTripOpen] = useState(false);
  // Dialog تفاصيل الرحلة (وقت الانطلاق + نقطة التجمع)
  const [isTripDetailsOpen, setIsTripDetailsOpen] = useState(false);
  // Dialog نقل الحجز لناقل آخر
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [departureTime, setDepartureTime] = useState('');
  const [meetingPoint, setMeetingPoint] = useState((booking as any).meetingPoint || '');
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const { verifyBookingReceipt, isProcessing } = useTripActions();
  const { profile } = useUserProfile();
  const t = useTranslations('bookingActionCard');

  const travelerRef = useMemoFirebase(() => {
    if (!firestore || !booking.userId) return null;
    return doc(firestore, 'users', booking.userId);
  }, [firestore, booking.userId]);

  const tripRef = useMemoFirebase(() => {
    if (!firestore || !booking.tripId) return null;
    return doc(firestore, 'trips', booking.tripId);
  }, [firestore, booking.tripId]);

  const { data: tripData } = useDoc<any>(tripRef);
  const { data: travelerProfile, isLoading: isLoadingTraveler } = useDoc<UserProfile>(travelerRef);

  const isGhost = !travelerProfile || travelerProfile.isDeactivated;
  const travelerProfileName =
    [travelerProfile?.firstName, travelerProfile?.lastName].filter(Boolean).join(' ').trim() ||
    travelerProfile?.fullName ||
    travelerProfile?.displayName;
  const displayName = isGhost
    ? booking.passengersDetails?.[0]?.name || t('unknownTraveler')
    : travelerProfileName || booking.passengersDetails?.[0]?.name || t('traveler');

  const depositPct = (booking as any).depositPercentage ?? 10;
  const depositAmount = ((booking.totalPrice * depositPct) / 100).toFixed(2);
  const remainingAmount = (booking.totalPrice - parseFloat(depositAmount)).toFixed(2);

  // ✅ تجهيز رقم الهاتف الخاص بالمسافر مع كود الدولة
  const displayPhone = travelerProfile?.phoneNumber
    ? `${travelerProfile.phoneCountryCode ? '+' + travelerProfile.phoneCountryCode + ' ' : ''}${travelerProfile.phoneNumber}`
    : '';

  const config = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG['Pending-Carrier-Confirmation'];
  const isThisProcessing = isProcessing === `verify-${booking.id}`;
  const reqId = `#${booking.id.slice(-5).toUpperCase()}`;

  // ── [NEW FLOW]: الناقل يقبل طلب المسافر → يُفتح dialog إنشاء الرحلة ──
  // بعد إنشاء الرحلة من AddTripDialog → نربط الـ booking بالرحلة الجديدة
  const handleTripCreated = async (newTripId: string, seatsDeductedByDialog = false) => {
    if (!firestore || !user) return;
    setLoading(true);
    try {
      const batch = writeBatch(firestore);

      const newStatus = (booking as any).depositPercentage === 0 ? 'Confirmed' : 'Pending-Payment';
      const seatsToDeduct = booking.seats || 1;

      // ✅ دايماً نجيب بيانات رحلة الناقل الحقيقية
      const carrierTripSnap = await getDoc(doc(firestore, 'trips', newTripId));
      const carrierTripData = carrierTripSnap.exists() ? carrierTripSnap.data() : null;

      // ✅ حدّث الـ booking بكل بيانات رحلة الناقل
      batch.update(doc(firestore, 'bookings', booking.id), {
        tripId: newTripId,
        carrierTripId: newTripId,
        status: newStatus,
        isPassengerTripDeleted: seatsDeductedByDialog,
        // انسخ بيانات رحلة الناقل على الـ booking عشان التذكرة تكون صح
        ...(carrierTripData?.departureDate ? { departureDate: carrierTripData.departureDate } : {}),
        ...(carrierTripData?.departureTime ? { departureTime: carrierTripData.departureTime } : {}),
        ...(carrierTripData?.meetingPoint ? { meetingPoint: carrierTripData.meetingPoint } : {}),
        ...(carrierTripData?.meetingPointLink ? { meetingPointLink: carrierTripData.meetingPointLink } : {}),
        updatedAt: serverTimestamp(),
      });

      // ✅ ربط الـ booking برحلة الناقل + خصم المقاعد فوراً لو مفيش عربون
      batch.update(doc(firestore, 'trips', newTripId), {
        bookingIds: arrayUnion(booking.id),
        ...(newStatus === 'Confirmed' && !seatsDeductedByDialog ? {
          availableSeats: increment(-seatsToDeduct),
          bookedSeats: increment(seatsToDeduct),
        } : {}),
        updatedAt: serverTimestamp(),
      });

      // إشعار للمسافر
      const notifRef = doc(collection(firestore, 'notifications'));
      batch.set(notifRef, {
        userId: booking.userId,
        title: 'الناقل وافق وأنشأ الرحلة! ✅',
        message: newStatus === 'Confirmed' ? 'تم قبول حجزك — تذكرتك جاهزة!' : 'تم قبول حجزك — ادفع العربون لتأكيد مقعدك',
        type: 'carrier_accepted_booking',
        bookingId: booking.id,
        isRead: false,
        createdAt: serverTimestamp(),
      });

      await batch.commit();

      // بعد الـ commit: نمسح رحلة المسافر القديمة لو كانت مؤقتة
      if (booking.tripId && booking.tripId !== newTripId) {
        try {
          const passengerTripSnap = await getDoc(doc(firestore, 'trips', booking.tripId));
          if (passengerTripSnap.exists() && passengerTripSnap.data()?.status === 'Pending-Carrier-Confirmation') {
            await deleteDoc(doc(firestore, 'trips', booking.tripId));
          }
        } catch (delErr) {
          console.error('[handleTripCreated] Failed to delete passenger trip:', delErr);
        }
      }

      // Push للمسافر
      await sendPush({
        userId: booking.userId,
        title: 'الناقل وافق على حجزك ✅',
        body: newStatus === 'Confirmed' ? 'تم قبول حجزك — تذكرتك جاهزة!' : 'تم قبول حجزك — ادفع العربون الآن لتأكيد مقعدك',
        data: { type: 'carrier_accepted_booking', bookingId: booking.id },
      });

      // إنشاء group chat
      try {
        const groupChatRef = doc(firestore, 'chats', newTripId);
        await setDoc(groupChatRef, {
          id: newTripId,
          isGroupChat: true,
          tripId: newTripId,
          participants: arrayUnion(user.uid, booking.userId),
          isClosed: false,
          lastMessage: 'انضم الناقل للرحلة',
          lastMessageSenderId: 'system',
          lastMessageTimestamp: serverTimestamp(),
        }, { merge: true });
      } catch (e) {
        console.warn('[GroupChat] Could not create:', e);
      }

      setIsAddTripOpen(false);
      toast({ title: 'تم قبول الحجز! ✅', description: newStatus === 'Confirmed' ? 'تذكرة المسافر جاهزة.' : 'المسافر سيتلقى إشعاراً بالدفع.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'فشل ربط الرحلة بالحجز', description: error?.message });
    } finally {
      setLoading(false);
    }
  };

  // ✅ دالة موحدة للقبول: تشوف لو في رحلة مربوطة → توافق فوراً، وإلا تفتح AddTripDialog
  // تُستخدم لكلا الحالتين: Traveler-Accepted-Awaiting-Carrier و Pending-Carrier-Confirmation
  const handleAcceptCustomRequest = async () => {
    triggerHaptic('light');
    if (!firestore || !user?.uid) return;

    setLoading(true);
    try {
      // ✅ [FIX]: لو الناقل عنده رحلة نشطة حالياً → استخدمها مباشرة بدون بحث
      let matchingTripId: string | null = booking.carrierTripId || null;

      if (!matchingTripId && profile?.currentActiveTripId) {
        // تحقق إن الرحلة النشطة فعلاً Planned أو Ongoing وليست Completed/Cancelled
        const activeTripSnap = await getDoc(doc(firestore, 'trips', profile.currentActiveTripId));
        if (activeTripSnap.exists()) {
          const activeStatus = activeTripSnap.data()?.status;
          if (activeStatus === 'Planned' || activeStatus === 'Ongoing') {
            matchingTripId = profile.currentActiveTripId;
          }
        }
      }

      if (!matchingTripId) {
        // Fallback: نبحث في رحلات الناقل بـ origin/destination/date
        const q = query(
          collection(firestore, 'trips'),
          where('carrierId', '==', user.uid),
          where('status', 'in', ['Planned', 'Ongoing'])
        );
        const snapshot = await getDocs(q);

        const targetOrigin = (booking as any).requestOrigin || tripData?.origin;
        const targetDest = (booking as any).requestDestination || tripData?.destination;

        const getIsoDate = (d: any) => {
          if (!d) return null;
          try { return new Date(d).toISOString().split('T')[0]; } catch { return null; }
        };
        const targetDateStr = getIsoDate((booking as any).requestDepartureDate || tripData?.departureDate);

        snapshot.forEach(docSnap => {
          if (matchingTripId) return; // خذ أول واحدة بس
          const tData = docSnap.data();
          if (tData.origin === targetOrigin && tData.destination === targetDest) {
            const tDateStr = getIsoDate(tData.departureDate);
            if (!targetDateStr || tDateStr === targetDateStr) {
              matchingTripId = docSnap.id;
            }
          }
        });
      }

      if (matchingTripId) {
        // تم العثور على رحلة موجودة! ربط فوراً بدون ديالوج
        // seatsDeductedByDialog=false لأن AddTripDialog ما اشتغلش → verifyBookingReceipt هيخصم المقاعد
        await handleTripCreated(matchingTripId, false);
      } else {
        // مفيش رحلة → فتح ديالوج إنشاء رحلة جديدة
        setIsAddTripOpen(true);
      }
    } catch (error) {
      console.error('Error checking trips:', error);
      setIsAddTripOpen(true); // Fallback in case of error
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!firestore || !user) return;
    // التحقق من البيانات الإلزامية
    if (!departureTime.trim()) {
      toast({ variant: 'destructive', title: 'يجب تحديد وقت الانطلاق أولاً' });
      return;
    }
    if (!meetingPoint.trim()) {
      toast({ variant: 'destructive', title: 'يجب تحديد نقطة الانطلاق أولاً' });
      return;
    }
    setLoading(true);
    triggerHaptic('success');
    try {
      const newStatus = (booking as any).depositPercentage === 0 ? 'Confirmed' : 'Pending-Payment';
      const seatsToDeduct = booking.seats || 1;

      // ✅ [FIX]: استخدام writeBatch لضمان atomicity
      const batch = writeBatch(firestore);

      // حفظ البيانات في booking وtrip معاً
      batch.update(doc(firestore, 'bookings', booking.id), {
        status: newStatus,
        departureTime: departureTime.trim(),
        meetingPoint: meetingPoint.trim(),
        carrierId: user.uid,          // ✅ [FIX]: تأكيد carrierId على الـ booking
        carrierTripId: booking.carrierTripId || booking.tripId, // ✅ [FIX]: ربط الـ booking برحلة الناقل
        updatedAt: serverTimestamp(),
      });

      // تحديث الـ trip بنفس البيانات + تحديث departureDate بالوقت الجديد
      let newDepartureDateISO: string | undefined;
      if (departureTime.trim() && tripData?.departureDate) {
        const existingDate = new Date(tripData.departureDate);
        const [hours, minutes] = departureTime.trim().split(':').map(Number);
        existingDate.setHours(hours, minutes, 0, 0);
        newDepartureDateISO = existingDate.toISOString();
      }

      // ✅ [FIX]: خصم المقاعد عند القبول لو الحجز Confirmed مباشرة (بدون عربون)
      batch.update(doc(firestore, 'trips', booking.carrierTripId || booking.tripId), {
        departureTime: departureTime.trim(),
        meetingPoint: meetingPoint.trim(),
        ...(newDepartureDateISO ? { departureDate: newDepartureDateISO } : {}),
        bookingIds: arrayUnion(booking.id), // ✅ [FIX]: إضافة الـ booking لقائمة رحلة الناقل
        ...(newStatus === 'Confirmed' ? {
          availableSeats: increment(-seatsToDeduct), // ✅ [FIX]: خصم المقاعد فوراً لو Confirmed
          bookedSeats: increment(seatsToDeduct),
        } : {}),
        updatedAt: serverTimestamp(),
      });

      await batch.commit();
      const groupChatRef = doc(firestore, 'chats', booking.tripId);
      await setDoc(
        groupChatRef,
        {
          id: booking.tripId,
          isGroupChat: true,
          tripId: booking.tripId,
          participants: arrayUnion(user.uid, booking.userId),
          isClosed: false,
          lastMessage: t('joinedTrip', { name: displayName }),
          lastMessageSenderId: 'system',
          lastMessageTimestamp: serverTimestamp(),
        },
        { merge: true }
      );
      if (booking.bookedByAgent && booking.agentId) {
        const { collection: fsCol, addDoc: fsAdd } = await import('firebase/firestore');
        await fsAdd(fsCol(doc(firestore, 'users', booking.agentId), 'notifications'), {
          userId: booking.agentId,
          title: t('agentNotifTitle'),
          message: t('agentNotifMessage', { seats: booking.seats }),
          type: 'carrier_accepted_agent_booking',
          bookingId: booking.id,
          tripId: booking.tripId,
          isRead: false,
          createdAt: serverTimestamp(),
        });
      }
      const pushTarget = booking.bookedByAgent ? booking.agentId : booking.userId;
      if (pushTarget) {
        await sendPush({
          userId: pushTarget,
          title: 'الناقل وافق على حجزك ✅',
          body: (booking as any).depositPercentage === 0 ? `موعد الانطلاق: ${departureTime} — نقطة التجمع: ${meetingPoint} — تذكرتك جاهزة!` : `موعد الانطلاق: ${departureTime} — نقطة التجمع: ${meetingPoint} — ادفع العربون الآن`,
          data: { type: 'carrier_accepted_booking', bookingId: booking.id },
        });
      }
      setIsTripDetailsOpen(false);
      toast({ title: t('acceptSuccess') });
    } catch (error: any) {
      toast({ variant: 'destructive', title: t('acceptError'), description: error?.message });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    triggerHaptic('heavy');
    setLoading(true);
    await onReject(booking.id);
    setLoading(false);
  };

  return (
    <>
      <div
        className={cn(
          'group relative overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-200',
          'hover:border-border hover:shadow-md',
          booking.status === 'Pending-Payment-Verification' && 'border-blue-500/30 hover:border-blue-500/50'
        )}
      >
        {/* Left color bar */}
        <div className={cn('absolute start-0 top-0 bottom-0 w-1 rounded-s-2xl', config.bar)} />

        {/* Subtle gradient bg */}
        <div className={cn('absolute inset-0 bg-gradient-to-br opacity-40 pointer-events-none', config.accent)} />

        <div className="relative p-4 sm:p-5 space-y-4">
          {/* ── Header row ── */}
          <div className="flex justify-center items-center gap-2">
            <p className={cn('text-[10px] font-bold uppercase   tracking-wider mb-0.5 border rounded-full px-2 py-0.5 w-fit', config.pill)}>
              {t(config.labelKey as any)}
            </p>
            {booking.status === 'Confirmed' && (
              <Button
                variant="outline"
                size="sm"
                className="h-6 px-2 text-[10px] border-amber-500/30 text-amber-600 hover:bg-amber-500 hover:text-white hover:border-amber-500 font-bold rounded-full gap-1 transition-colors"
                onClick={() => setIsTransferDialogOpen(true)}
              >
                <ArrowRightLeft className="h-3 w-3" />
                نقل
              </Button>
            )}
          </div>
          <div className="flex items-start justify-between gap-3">
            {/* Avatar + name */}
            <div className="flex items-center gap-3 min-w-0">
              {isLoadingTraveler ? (
                <Skeleton className="h-11 w-11 rounded-full shrink-0" />
              ) : (
                <Avatar className="h-11 w-11 shrink-0 border-2 border-background shadow-sm">
                  <AvatarImage src={travelerProfile?.photoURL || ''} alt='' />
                  <AvatarFallback className="bg-primary/10 text-primary font-black text-sm">
                    {displayName?.charAt(0)?.toUpperCase() || <User className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
              )}
              <div className="min-w-0">
                <p className="font-black text-sm text-foreground truncate leading-tight">
                  {displayName}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="h-5 px-1.5 text-[10px] font-bold bg-muted/50">
                    {t('seats', { n: booking.seats })}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground font-mono">{reqId}</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl hover:bg-blue-500/10 hover:text-blue-600"
                onClick={() => setIsGroupChatOpen(true)}
              >
                <MessageSquare className="h-4 w-4" />

              </Button>
            </div>
          </div>

          {/* ── Financial summary ── */}
          <div className="grid grid-cols-3 gap-2 rounded-xl bg-muted/40 border border-border/50 p-3">
            <div className="text-center">
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">{t('financials.total')}</p>
              <p className="text-sm font-black text-foreground mt-0.5">
                {booking.totalPrice} <span className="text-[10px] font-bold text-muted-foreground">{booking.currency}</span>
              </p>
            </div>
            <div className="text-center border-x border-border/50">
              <p className="text-[9px] font-bold text-green-600 uppercase tracking-wide">{t('financials.paid')}</p>
              <p className="text-sm font-black text-green-600 mt-0.5">{depositAmount}</p>
            </div>
            <div className="text-center">
              <p className="text-[9px] font-bold text-orange-500 uppercase tracking-wide">{t('financials.remaining')}</p>
              <p className="text-sm font-black text-orange-500 mt-0.5">{remainingAmount}</p>
            </div>
          </div>

          {/* ── Expandable passengers ── */}
          <button
            onClick={() => setExpanded((v) => !v)}
            className="w-full flex items-center justify-between text-[11px] font-bold text-muted-foreground hover:text-foreground transition-colors py-0.5"
          >
            <span className="flex items-center gap-1.5">
              <Ticket className="h-3.5 w-3.5" />
              {t('passengersSection', { count: booking.passengersDetails?.length || 0 })}
            </span>
            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>

          {expanded && (
            <div className="space-y-2 animate-in slide-in-from-top-1 duration-150">
              {booking.passengersDetails?.map((p: any, i: number) => {
                const name = p.name || p.passengerName || '';
                const type = p.type || p.passengerType || 'adult';
                const docNum = p.documentNumber || p.documentId || '';

                // ✅ جلب الرقم من بيانات المسافر إذا لم يكن مسجلاً في مصفوفة الركاب
                const phone = p.phone || p.passengerPhone || (i === 0 ? displayPhone : '');

                const nationality = p.nationality || '';
                const typeLabel = type === 'adult' ? t('passengerType.adult') : type === 'minor' ? t('passengerType.minor') : t('passengerType.infant');

                return (
                  <div
                    key={i}
                    className="rounded-xl border border-border/50 bg-muted/30 p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-sm">{name}</span>
                      <Badge variant="outline" className="h-5 text-[10px] px-2">{typeLabel}</Badge>
                    </div>
                    {(nationality || docNum || phone) && (
                      <div className="grid grid-cols-1 gap-1 pt-1.5 border-t border-border/40">
                        {nationality && (
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-muted-foreground">{t('nationality')}</span>
                            <span className="font-bold">{nationality}</span>
                          </div>
                        )}
                        {docNum && (
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-muted-foreground flex items-center gap-1"><CreditCard className="h-3 w-3" /> {t('document')}</span>
                            <span className="font-mono font-bold">{docNum}</span>
                          </div>
                        )}

                        {/* ✅ عرض الهاتف بالتنسيق الأخضر المميز */}
                        {phone && (
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-muted-foreground flex items-center gap-1">
                              <Phone className="h-3 w-3" /> {t('phone')}
                            </span>
                            <a href={`tel:${phone.replace(/\s+/g, '')}`} className="font-mono font-black text-emerald-400 hover:text-emerald-300 transition-colors" dir="ltr">
                              {phone}
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Agent info */}
              {booking.bookedByAgent && booking.agentName && (
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
                  <p className="text-[10px] font-black text-amber-600 flex items-center gap-1.5 mb-2 uppercase tracking-wide">
                    <Briefcase className="h-3 w-3" /> {t('agentBadge')}
                  </p>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{t('agentName')}</span>
                    <span className="font-black">{booking.agentName}</span>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-muted-foreground">{t('agentFee')}</span>
                    <span className="font-black text-amber-600">{booking.agentFee || 0} {booking.currency}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Payment Verification Block ── */}
          {booking.status === 'Pending-Payment-Verification' && (
            <div className="rounded-xl border-2 border-dashed border-blue-500/30 bg-blue-500/5 p-4 space-y-3">
              <div className="text-center">
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center justify-center gap-1.5 mb-1">
                  <FileDigit className="h-3.5 w-3.5" /> {t('voucher')}
                </p>
                <p className="text-2xl font-black font-mono text-blue-500 tracking-widest">
                  {booking.depositVoucherId || '———'}
                </p>
              </div>
              <Button
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-sm gap-2"
                onClick={() => { triggerHaptic('success'); verifyBookingReceipt(booking); }}
                disabled={isThisProcessing}
              >
                {isThisProcessing
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : <><ShieldCheck className="h-4 w-4" /> {t('verifyBtn')}</>
                }
              </Button>
            </div>
          )}

          {/* ── Accept / Reject ── */}
          {(booking.status === 'Pending-Carrier-Confirmation') && (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Button
                className="h-11 bg-green-600 hover:bg-green-700 text-white font-black rounded-xl shadow-sm gap-1.5 text-sm"
                onClick={handleAcceptCustomRequest}
                disabled={loading}
              >
                <CheckCircle2 className="h-4 w-4" /> {t('acceptBtn')}
              </Button>
              <Button
                variant="outline"
                className="h-11 border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 font-black rounded-xl text-sm gap-1.5"
                onClick={handleReject}
                disabled={loading}
              >
                <XCircle className="h-4 w-4" /> {t('rejectBtn')}
              </Button>
            </div>
          )}
        </div>
      </div>

      <ChatDialog
        isOpen={isChatOpen}
        onOpenChange={setIsChatOpen}
        bookingId={booking.id}
        otherPartyId={booking.userId}
        otherPartyName={displayName || t('traveler')}
        chatType="private"
      />
      <ChatDialog
        isOpen={isGroupChatOpen}
        onOpenChange={setIsGroupChatOpen}
        trip={{ id: booking.tripId } as any}
        chatType="group"
      />


      {/* ── BookingTransferDialog: نقل الحجز المؤكد لناقل آخر ── */}
      {booking.status === 'Confirmed' && tripData && (
        <BookingTransferDialog
          isOpen={isTransferDialogOpen}
          onOpenChange={setIsTransferDialogOpen}
          booking={booking}
          carrierTrip={tripData}
          passengerName={displayName || ''}
        />
      )}

      {/* ── AddTripDialog: يُفتح عند قبول الناقل لطلب المسافر ── */}
      <AddTripDialog
        isOpen={isAddTripOpen}
        onOpenChange={setIsAddTripOpen}
        prefill={(() => {
          const originCity = (booking as any).requestOrigin || (booking as any).origin || '';
          const destCity = (booking as any).requestDestination || (booking as any).destination || '';
          const rawDate = (booking as any).requestDepartureDate || (booking as any).departureDate;
          return {
            origin: originCity,
            originCountry: (booking as any).requestOriginCountry || (booking as any).originCountry || getCountryFromCity(originCity),
            destination: destCity,
            destinationCountry: (booking as any).requestDestinationCountry || (booking as any).destinationCountry || getCountryFromCity(destCity),
            departureDate: rawDate ? new Date(rawDate) : undefined,
            passengers: booking.seats,
            requestId: booking.tripId,
            // ✅ نمرّر نسبة العربون من الحجز عشان الناقل يقدر يعدّلها على الرحلة
            depositPercentage: (booking as any).depositPercentage,
          };
        })()}
        onTripCreated={(id) => handleTripCreated(id, true)}
      />
    </>
  );
}