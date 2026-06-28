'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, MessageSquare, ShieldCheck, CheckCircle2, Clock, Shield, MenuIcon, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { triggerHaptic, cn } from '@/lib/utils';
import { useUserProfile } from '@/hooks/use-user-profile';
import { useLocale, useTranslations } from 'next-intl';
import { Logo } from '../logo';
import { LanguageSwitcher } from '../language-switcher';

/**
 * @component TicketHeader
 * @description THE REINFORCED SOVEREIGN TICKET HEADER (STERILIZED - V12.5 - SSOT)
 * [V12.5]: Injected Sovereign Progress Tracker (SCR-830 V1.2 Enforcement).
 * Centralizes the "Truth" of the trip's journey for the traveler.
 * Protocol 16: Sterilized. Protocol 88: Zero-Waste.
 */

interface TicketHeaderProps {
  tripId: string;
  carrierId?: string;
  tripStatus?: string;
}

export function TicketHeader({ tripId, carrierId, tripStatus }: TicketHeaderProps) {
  const router = useRouter();
  const firestore = useFirestore();
  const locale = useLocale();
  const { profile } = useUserProfile();
  const t = useTranslations('traveler');
  const [carrierData, setCarrierData] = useState<any>(null);
  const [unreadChats, setUnreadChats] = useState(0);
  const [isCarrierLoading, setIsCarrierLoading] = useState(true);

  // [PROTOCOL 88]: Sovereign Carrier Pulse
  const carrierRef = useMemoFirebase(() => {
    if (!firestore || !carrierId) return null;
    return doc(firestore, 'users', carrierId);
  }, [firestore, carrierId]);

  useEffect(() => {
    if (!carrierRef) {
      setIsCarrierLoading(false);
      return;
    }
    const unsubscribe = onSnapshot(carrierRef, (snap) => {
      if (snap.exists()) setCarrierData(snap.data());
      setIsCarrierLoading(false);
    });
    return () => unsubscribe();
  }, [carrierRef]);

  // [PROTOCOL 88]: Chat Pulse
  useEffect(() => {
    if (!firestore || !tripId) return;
    const chatDocRef = doc(firestore, 'chats', tripId);
    const unsubscribe = onSnapshot(chatDocRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        const unreadCount = data.unreadCounts?.[profile?.id || ''] || 0;
        setUnreadChats(unreadCount);
      }
    });
    return () => unsubscribe();
  }, [firestore, tripId, profile?.id]);

  const handleBack = () => {
    triggerHaptic('light');
    router.back();
  };

  const openChats = () => {
    triggerHaptic('light');
    router.push(`/${locale}/chats`);
  };

  const isRTL = locale === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const [menuOpen, setMenuOpen] = useState(false);

  // [SSOT]: Universal Progress Steps - THE CORE OF TRUTH [SCR-830 V1.2]
  const progressSteps = useMemo(() => {
    const status = tripStatus || 'Awaiting-Offers';
    const isPending = status === 'Pending-Carrier-Confirmation' || status === 'Awaiting-Offers';
    const isConfirmed = status === 'Confirmed' || status === 'In-Transit' || status === 'Completed';

    return [
      { id: 1, label: t('stepRequest'), active: true, done: true },
      { id: 2, label: t('stepConfirm'), active: status === 'Pending-Carrier-Confirmation', done: !isPending },
      { id: 3, label: t('stepTicket'), active: status === 'Confirmed', done: isConfirmed }
    ];
  }, [tripStatus]);

  return (
    <>
      <nav className="fixed h-16  rounded-b-lg top-0 pb-6 pt-9  left-0 right-0 z-50 flex items-center justify-between px-6  bg-[#BFAF78] backdrop-blur-md border-b border-[#BFAF78]/20"
        aria-label="Main navigation">
        <div className="h-16 flex items-center justify-center pt-5">
          <Logo />
        </div>
        <LanguageSwitcher />
      </nav>
      <header dir={isRTL ? 'rtl' : 'ltr'} className="sticky top-0 z-40 w-full bg-background/90 backdrop-blur-xl border-b border-primary/10 shadow-2xl overflow-hidden">
        <div className="flex flex-col max-w-7xl mt-20 border border-[#BFAF78] rounded-3xl  mx-auto w-full">
          <div className="flex items-center justify-between px-4 h-16">
            {/* <Button variant="ghost" size="icon" onClick={handleBack} className="rounded-full hover:bg-primary/5 active:scale-90 transition-transform">
            <ChevronRight className="h-6 w-6" />
          </Button> */}

            <div className="flex-1 flex flex-col items-center justify-center">
              {isCarrierLoading ? (
                <Skeleton className="h-4 w-24 rounded bg-primary/10" />
              ) : carrierData ? (
                <div className="flex flex-col items-center group cursor-pointer" onClick={() => triggerHaptic('light')}>
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-sm font-black text-foreground group-hover:text-primary transition-colors">
                      {carrierData.firstName || carrierData.officeName || t('captain')}
                    </h2>
                    {carrierData.ratingStats?.tier && <ShieldCheck className="h-3.5 w-3.5 text-primary animate-pulse" />}
                  </div>
                  <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{carrierData.vehicleType || t('touristVehicle')}</span>
                </div>
              ) : (
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest animate-pulse">{t('awaitingCarrier')}</span>
              )}
            </div>

            {/* <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="rounded-full relative" onClick={openChats}>
              <MessageSquare className="h-5 w-5" />
              {unreadChats > 0 && <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-destructive rounded-full border border-background animate-pulse" />}
            </Button>
          </div> */}
          </div>

          {/* [SCR-830] SOVEREIGN PROGRESS PULSE (SSOT) - CONSTITUTIONAL PLACEMENT */}
          <div className="px-6 pb-3 pt-1 flex justify-between items-center relative">
            <div className="absolute top-[1.15rem] left-8 right-8 h-0.5 bg-muted z-0" />
            {progressSteps.map((step) => (
              <div key={step.id} className="relative z-10 flex flex-col items-center gap-1">
                <div className={cn(
                  "h-5 w-5 rounded-full flex items-center justify-center border-2 transition-all duration-700 shadow-sm",
                  step.done ? "bg-primary border-primary text-black" :
                    step.active ? "bg-background border-primary text-primary animate-pulse" : "bg-muted border-muted text-muted-foreground"
                )}>
                  {step.done ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-2.5 w-2.5" />}
                </div>
                <span className={cn("text-[8px] font-black uppercase tracking-tighter", step.active || step.done ? "text-primary" : "text-muted-foreground")}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </header>
    </>
  );
}
