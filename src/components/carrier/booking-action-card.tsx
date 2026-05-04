// 'use client';

// import { useState } from 'react';
// import type { Booking, UserProfile } from '@/lib/data';
// import { Button } from '@/components/ui/button';
// import {
//   User, Loader2, CheckCircle2, XCircle, MessageSquare,
//   Users, FileDigit, ShieldCheck, Briefcase, Phone, CreditCard,
//   ChevronDown, ChevronUp, Ticket
// } from 'lucide-react';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Badge } from '@/components/ui/badge';
// import { Skeleton } from '@/components/ui/skeleton';
// import { ChatDialog } from '@/components/chat/chat-dialog';
// import { useFirestore, useUser, useDoc, useMemoFirebase } from '@/firebase';
// import { useToast } from '@/hooks/use-toast';
// import { cn, triggerHaptic } from '@/lib/utils';
// import { useTripActions } from '@/hooks/use-trip-actions';
// import { doc, updateDoc, serverTimestamp, setDoc, arrayUnion } from 'firebase/firestore';

// interface BookingActionCardProps {
//   booking: Booking;
//   onReject: (bookingId: string) => Promise<void>;
// }

// const STATUS_CONFIG = {
//   'Pending-Carrier-Confirmation': {
//     pill: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
//     accent: 'from-amber-500/20 to-amber-500/5',
//     bar: 'bg-amber-500',
//     labelAr: 'بانتظار موافقتك',
//     labelEn: 'Awaiting Approval',
//   },
//   'Pending-Payment': {
//     pill: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
//     accent: 'from-orange-500/15 to-orange-500/0',
//     bar: 'bg-orange-500',
//     labelAr: 'بانتظار الدفع',
//     labelEn: 'Awaiting Payment',
//   },
//   'Pending-Payment-Verification': {
//     pill: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
//     accent: 'from-blue-500/15 to-blue-500/0',
//     bar: 'bg-blue-500 animate-pulse',
//     labelAr: 'تحقق من الدفع',
//     labelEn: 'Verify Payment',
//   },
//   'Confirmed': {
//     pill: 'bg-green-500/10 text-green-600 border-green-500/20',
//     accent: 'from-green-500/10 to-green-500/0',
//     bar: 'bg-green-500',
//     labelAr: 'مؤكد',
//     labelEn: 'Confirmed',
//   },
// } as Record<string, { pill: string; accent: string; bar: string; labelAr: string; labelEn: string }>;

// export function BookingActionCard({ booking, onReject }: BookingActionCardProps) {
//   const [loading, setLoading] = useState(false);
//   const [expanded, setExpanded] = useState(false);
//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const [isGroupChatOpen, setIsGroupChatOpen] = useState(false);
//   const firestore = useFirestore();
//   const { user } = useUser();
//   const { toast } = useToast();
//   const { verifyBookingReceipt, isProcessing } = useTripActions();

//   const travelerRef = useMemoFirebase(() => {
//     if (!firestore || !booking.userId) return null;
//     return doc(firestore, 'users', booking.userId);
//   }, [firestore, booking.userId]);

//   const { data: travelerProfile, isLoading: isLoadingTraveler } = useDoc<UserProfile>(travelerRef);

//   const isGhost = !travelerProfile || travelerProfile.isDeactivated;
//   const travelerProfileName =
//     [travelerProfile?.firstName, travelerProfile?.lastName].filter(Boolean).join(' ').trim() ||
//     travelerProfile?.fullName ||
//     travelerProfile?.displayName;
//   const displayName = isGhost
//     ? booking.passengersDetails?.[0]?.name || 'مسافر (غير معرف)'
//     : travelerProfileName || booking.passengersDetails?.[0]?.name || 'مسافر';

//   const depositPct = (booking as any).depositPercentage ?? 10;
//   const depositAmount = ((booking.totalPrice * depositPct) / 100).toFixed(2);
//   const remainingAmount = (booking.totalPrice - parseFloat(depositAmount)).toFixed(2);

//   const config = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG['Pending-Carrier-Confirmation'];
//   const isThisProcessing = isProcessing === `verify-${booking.id}`;
//   const reqId = `#${booking.id.slice(-5).toUpperCase()}`;

//   const handleAccept = async () => {
//     if (!firestore || !user) return;
//     setLoading(true);
//     triggerHaptic('success');
//     try {
//       await updateDoc(doc(firestore, 'bookings', booking.id), {
//         status: 'Pending-Payment',
//         updatedAt: serverTimestamp(),
//       });
//       if (booking.tripId) {
//         const { increment: fsIncrement } = await import('firebase/firestore');
//         await updateDoc(doc(firestore, 'trips', booking.tripId), {
//           availableSeats: fsIncrement(-booking.seats),
//           updatedAt: serverTimestamp(),
//         });
//       }
//       const groupChatRef = doc(firestore, 'chats', booking.tripId);
//       await setDoc(
//         groupChatRef,
//         {
//           id: booking.tripId,
//           isGroupChat: true,
//           tripId: booking.tripId,
//           participants: arrayUnion(user.uid, booking.userId),
//           isClosed: false,
//           lastMessage: `انضم ${displayName} للرحلة`,
//           lastMessageSenderId: 'system',
//           lastMessageTimestamp: serverTimestamp(),
//         },
//         { merge: true }
//       );
//       if (booking.bookedByAgent && booking.agentId) {
//         const { collection: fsCol, addDoc: fsAdd } = await import('firebase/firestore');
//         await fsAdd(fsCol(doc(firestore, 'users', booking.agentId), 'notifications'), {
//           userId: booking.agentId,
//           title: 'وافق الناقل على حجزك ✅',
//           message: `تمَّ قبول حجز ${booking.seats} مقعد`,
//           type: 'carrier_accepted_agent_booking',
//           bookingId: booking.id,
//           tripId: booking.tripId,
//           isRead: false,
//           createdAt: serverTimestamp(),
//         });
//       }
//       toast({ title: 'تم قبول الحجز بنجاح ✅' });
//     } catch (error: any) {
//       toast({ variant: 'destructive', title: 'خطأ في العملية', description: error?.message });
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
//                 <p className={cn('text-[10px] font-bold uppercase tracking-wider mb-0.5 border rounded-full px-2 py-0.5 w-fit', config.pill)}>
//                   {config.labelAr}
//                 </p>
//                 <p className="font-black text-sm text-foreground truncate leading-tight">
//                   {displayName}
//                 </p>
//                 <div className="flex items-center gap-2 mt-1">
//                   <Badge variant="outline" className="h-5 px-1.5 text-[10px] font-bold bg-muted/50">
//                     {booking.seats} مقاعد
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
//                 className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary"
//                 onClick={() => !isGhost && setIsChatOpen(true)}
//                 disabled={isGhost || isLoadingTraveler}
//               >
//                 <MessageSquare className="h-4 w-4" />
//               </Button>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="h-9 w-9 rounded-xl hover:bg-blue-500/10 hover:text-blue-600"
//                 onClick={() => setIsGroupChatOpen(true)}
//               >
//                 <Users className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>

//           {/* ── Financial summary ── */}
//           <div className="grid grid-cols-3 gap-2 rounded-xl bg-muted/40 border border-border/50 p-3">
//             <div className="text-center">
//               <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">الإجمالي</p>
//               <p className="text-sm font-black text-foreground mt-0.5">
//                 {booking.totalPrice} <span className="text-[10px] font-bold text-muted-foreground">{booking.currency}</span>
//               </p>
//             </div>
//             <div className="text-center border-x border-border/50">
//               <p className="text-[9px] font-bold text-green-600 uppercase tracking-wide">المدفوع</p>
//               <p className="text-sm font-black text-green-600 mt-0.5">{depositAmount}</p>
//             </div>
//             <div className="text-center">
//               <p className="text-[9px] font-bold text-orange-500 uppercase tracking-wide">التحصيل</p>
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
//               تفاصيل الركاب ({booking.passengersDetails?.length || 0})
//             </span>
//             {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
//           </button>

//           {expanded && (
//             <div className="space-y-2 animate-in slide-in-from-top-1 duration-150">
//               {booking.passengersDetails?.map((p: any, i: number) => {
//                 const name = p.name || p.passengerName || '';
//                 const type = p.type || p.passengerType || 'adult';
//                 const docNum = p.documentNumber || p.documentId || '';
//                 const phone = p.phone || p.passengerPhone || '';
//                 const nationality = p.nationality || '';
//                 const typeLabel = type === 'adult' ? 'بالغ' : type === 'minor' ? 'قاصر' : 'رضيع';

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
//                             <span className="text-muted-foreground">الجنسية</span>
//                             <span className="font-bold">{nationality}</span>
//                           </div>
//                         )}
//                         {docNum && (
//                           <div className="flex justify-between items-center text-xs">
//                             <span className="text-muted-foreground flex items-center gap-1"><CreditCard className="h-3 w-3" /> الوثيقة</span>
//                             <span className="font-mono font-bold">{docNum}</span>
//                           </div>
//                         )}
//                         {phone && (
//                           <div className="flex justify-between items-center text-xs">
//                             <span className="text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3" /> الهاتف</span>
//                             <a href={`tel:${phone}`} className="font-mono text-primary hover:underline" dir="ltr">{phone}</a>
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
//                     <Briefcase className="h-3 w-3" /> طلب من وكيل
//                   </p>
//                   <div className="flex justify-between text-xs">
//                     <span className="text-muted-foreground">الوكيل</span>
//                     <span className="font-black">{booking.agentName}</span>
//                   </div>
//                   <div className="flex justify-between text-xs mt-1">
//                     <span className="text-muted-foreground">العمولة</span>
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
//                   <FileDigit className="h-3.5 w-3.5" /> السند الرقمي
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
//                   : <><ShieldCheck className="h-4 w-4" /> ختم ومصادقة الاستلام</>
//                 }
//               </Button>
//             </div>
//           )}

//           {/* ── Accept / Reject ── */}
//           {booking.status === 'Pending-Carrier-Confirmation' && (
//             <div className="grid grid-cols-2 gap-2 pt-1">
//               <Button
//                 className="h-11 bg-green-600 hover:bg-green-700 text-white font-black rounded-xl shadow-sm gap-1.5 text-sm"
//                 onClick={handleAccept}
//                 disabled={loading}
//               >
//                 {loading
//                   ? <Loader2 className="h-4 w-4 animate-spin" />
//                   : <><CheckCircle2 className="h-4 w-4" /> قبول</>
//                 }
//               </Button>
//               <Button
//                 variant="outline"
//                 className="h-11 border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 font-black rounded-xl text-sm gap-1.5"
//                 onClick={handleReject}
//                 disabled={loading}
//               >
//                 <XCircle className="h-4 w-4" /> رفض
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
//         otherPartyName={displayName || 'المسافر'}
//         chatType="private"
//       />
//       <ChatDialog
//         isOpen={isGroupChatOpen}
//         onOpenChange={setIsGroupChatOpen}
//         trip={{ id: booking.tripId } as any}
//         chatType="group"
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
  ChevronDown, ChevronUp, Ticket
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ChatDialog } from '@/components/chat/chat-dialog';
import { useFirestore, useUser, useDoc, useMemoFirebase } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { cn, triggerHaptic } from '@/lib/utils';
import { useTripActions } from '@/hooks/use-trip-actions';
import { doc, updateDoc, serverTimestamp, setDoc, arrayUnion } from 'firebase/firestore';
import { useTranslations } from 'next-intl';

interface BookingActionCardProps {
  booking: Booking;
  onReject: (bookingId: string) => Promise<void>;
}

const STATUS_CONFIG = {
  'Pending-Carrier-Confirmation': {
    pill: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    accent: 'from-amber-500/20 to-amber-500/5',
    bar: 'bg-amber-500',
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
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const { verifyBookingReceipt, isProcessing } = useTripActions();
  const t = useTranslations('bookingActionCard');

  const travelerRef = useMemoFirebase(() => {
    if (!firestore || !booking.userId) return null;
    return doc(firestore, 'users', booking.userId);
  }, [firestore, booking.userId]);

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

  const config = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG['Pending-Carrier-Confirmation'];
  const isThisProcessing = isProcessing === `verify-${booking.id}`;
  const reqId = `#${booking.id.slice(-5).toUpperCase()}`;

  const handleAccept = async () => {
    if (!firestore || !user) return;
    setLoading(true);
    triggerHaptic('success');
    try {
      await updateDoc(doc(firestore, 'bookings', booking.id), {
        status: 'Pending-Payment',
        updatedAt: serverTimestamp(),
      });
      if (booking.tripId) {
        const { increment: fsIncrement } = await import('firebase/firestore');
        await updateDoc(doc(firestore, 'trips', booking.tripId), {
          availableSeats: fsIncrement(-booking.seats),
          updatedAt: serverTimestamp(),
        });
      }
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
                <p className={cn('text-[10px] font-bold uppercase tracking-wider mb-0.5 border rounded-full px-2 py-0.5 w-fit', config.pill)}>
                  {t(config.labelKey as any)}
                </p>
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
                className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary"
                onClick={() => !isGhost && setIsChatOpen(true)}
                disabled={isGhost || isLoadingTraveler}
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl hover:bg-blue-500/10 hover:text-blue-600"
                onClick={() => setIsGroupChatOpen(true)}
              >
                <Users className="h-4 w-4" />
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
                const phone = p.phone || p.passengerPhone || '';
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
                        {phone && (
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3" /> {t('phone')}</span>
                            <a href={`tel:${phone}`} className="font-mono text-primary hover:underline" dir="ltr">{phone}</a>
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
          {booking.status === 'Pending-Carrier-Confirmation' && (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Button
                className="h-11 bg-green-600 hover:bg-green-700 text-white font-black rounded-xl shadow-sm gap-1.5 text-sm"
                onClick={handleAccept}
                disabled={loading}
              >
                {loading
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : <><CheckCircle2 className="h-4 w-4" /> {t('acceptBtn')}</>
                }
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
    </>
  );
}