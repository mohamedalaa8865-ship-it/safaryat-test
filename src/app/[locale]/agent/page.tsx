'use client';

/**
 * @page AgentDashboard
 * @description THE DIAMOND STERILIZED AGENT CLOUD (V42.0 - CONTEXT EDITION)
 * [SCR-CTX]: Wrapped with SovereignSearchProvider to prevent duplicate Firestore listeners.
 */

import { useUserProfile } from '@/hooks/use-user-profile';
import { ProxyBookingForm } from '@/components/agent/proxy-booking-form';
import { SmartRadar } from '@/components/agent/smart-radar';
import { RecentOpsList } from '@/components/agent/recent-ops-list';
import { AgentAchievementPulse } from '@/components/agent/agent-achievement-pulse';
import { JobOfferCard } from '@/components/agent/job-offer-card';
import { AgentHistoryArchive } from '@/components/agent/agent-history-archive';
import { Cloud, Loader2, Settings, Zap, History } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useActiveMarkets } from '@/hooks/use-active-markets';
import { LocalErrorBoundary } from '@/components/ui/local-error-boundary';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from '@/i18n/routing';
import { useAgentArchive } from '@/hooks/use-agent-archive';
import { SovereignSearchProvider } from '@/contexts/sovereign-search-context';
import { useTranslations } from 'next-intl';

export default function AgentDashboard() {
  const { profile, isLoading: isProfileLoading, isMaster } = useUserProfile();
  const { activeMarkets, isLoading: isLoadingMarkets } = useActiveMarkets();
  const { recent, archive, isLoading: isArchiveLoading, counts } = useAgentArchive();
  const t = useTranslations('AgentDashboard');
  const isGlobalLoading = isProfileLoading || isLoadingMarkets;

  if (isGlobalLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-950 pt-16">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-primary font-mono text-[10px] uppercase tracking-widest animate-pulse">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    // [SCR-CTX]: Provider واحد بس = listener واحد لـ Firestore = لا crashes
    <SovereignSearchProvider>
      <div className="max-w-7xl mx-auto space-y-1 animate-in fade-in duration-700 p-4 pb-24 pt-8" dir="rtl">

        <header className="flex justify-between items-center px-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl border border-primary/20">
              <Cloud className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-black text-xl tracking-tighter text-foreground">
                {t('title')}
              </h1>
              {/* <p className="text-[10px] font-mono text-primary/60 uppercase tracking-widest">Arterial Pulse v42.0 [CONTEXT]</p> */}
            </div>
          </div>
          <Link href="/agent/cockpit">
            <Badge variant="outline" className="bg-primary text-black border-primary font-black text-[10px] gap-1 px-3 py-1.5 shadow-lg rounded-xl cursor-pointer hover:bg-primary/90 transition-all active:scale-95 group">
              {t('manage_account')}
              <Settings className="h-3 w-3 group-hover:rotate-90 transition-transform" />
            </Badge>
          </Link>
        </header>

        <Tabs defaultValue="operations" className="w-full">
          <div className="w-full">
            <div className="grid w-full grid-cols-1 h-14 bg-card/50 border border-[#BEAD77] mt-3 rounded-[1.5rem] p-1 mb-6 shadow-sm ">
              <p className="flex justify-center items-center gap-2 text-[#BEAD77]">
                <Zap className="h-4 w-4" /> {t('operations_radar')}

              </p>
            </div>
          </div>
          <TabsContent value="operations" className="space-y-6 animate-in slide-in-from-right-4 duration-500 m-0">
            <LocalErrorBoundary fallbackTitle={t('exploration_radar_error')}>
              <SmartRadar activeMarkets={activeMarkets} />
            </LocalErrorBoundary>
            <div className="space-y-4 pt-4">
              <h3 className="text-sm font-black text-muted-foreground uppercase tracking-[0.2em] px-2 flex items-center justify-start gap-2">
                <Zap className="h-4 w-4 text-primary" /> {t('booking_room')}
              </h3>
              <ProxyBookingForm />
            </div>
          </TabsContent>

          <TabsContent value="financials" className="animate-in slide-in-from-left-4 duration-500 m-0">
            <LocalErrorBoundary fallbackTitle={t('history_archive_error')}>
              <AgentHistoryArchive trips={archive} />
            </LocalErrorBoundary>
          </TabsContent>
        </Tabs>
      </div>
    </SovereignSearchProvider >
  );
}