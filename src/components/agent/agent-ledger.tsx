'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, CheckCircle2, XCircle, Clock, PlaneTakeoff } from 'lucide-react';
import { getCityName } from '@/lib/constants';
import { useLocale } from 'next-intl';
import React, { useMemo } from 'react';

/**
 * @component AgentLedger
 * @description THE REINFORCED FIELD LEDGER (SCR-858 - STERILIZED)
 * [V2.0]: Applied Protocol 16. Memoized presentational mapping.
 * Protocol 88: Limited to 10 docs. Protocol 30: Read-Only logic.
 */
export function AgentLedger({ isMaster = false }: { isMaster?: boolean }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const locale = useLocale();

  // [PROTOCOL 88]: Halt query if User is Master (Master has a separate omni-view)
  // [PROTOCOL 16]: Early return prevents execution of following hooks.
  if (isMaster) return null;

  const ledgerQuery = useMemoFirebase(() => 
    (firestore && user && !isMaster) ? query(
      collection(firestore, 'trips'),
      where('agentId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(10)
    ) : null
  , [firestore, user, isMaster]);

  const { data: recentTrips, isLoading } = useCollection<any>(ledgerQuery);

  // [PROTOCOL 16]: Stable rendering logic
  const renderStatusBadge = (status: string) => {
    const baseClass = "text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter border";
    switch (status) {
      case 'Confirmed':
      case 'Completed':
        return <span className={`${baseClass} bg-emerald-500/10 text-emerald-500 border-emerald-500/20`}>{status === 'Confirmed' ? 'مؤكدة' : 'مكتملة'}</span>;
      case 'Cancelled':
        return <span className={`${baseClass} bg-destructive/10 text-destructive border-destructive/20`}>ملغاة</span>;
      default:
        return <span className={`${baseClass} bg-amber-500/10 text-amber-500 border-amber-500/20`}>معلقة</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="h-20 w-full rounded-[2rem] animate-pulse bg-muted/20" />
        ))}
      </div>
    );
  }

  if (!recentTrips || recentTrips.length === 0) return null;

  return (
    <Card className="border-primary/10 shadow-xl rounded-[2.5rem] bg-card overflow-hidden">
        <CardHeader className="bg-muted/10 border-b border-primary/5 pb-4">
            <CardTitle className="text-sm font-black text-foreground flex items-center justify-between">
                <span className="flex items-center gap-2"><Activity className="h-4 w-4 text-primary" /> السجل الميداني (آخر 10 عمليات)</span>
            </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
            <div className="divide-y divide-primary/5 max-h-[350px] overflow-y-auto no-scrollbar">
                {recentTrips.map(trip => (
                    <div key={trip.id} className="p-4 flex items-center justify-between hover:bg-primary/5 transition-colors group">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                                {trip.status === 'Confirmed' || trip.status === 'Completed' ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : 
                                 trip.status === 'Cancelled' ? <XCircle className="h-5 w-5 text-destructive" /> : 
                                 <Clock className="h-5 w-5 text-amber-500 animate-pulse" />}
                            </div>
                            <div className="text-right">
                                <h4 className="text-[11px] font-black">{trip.passengerName || 'مسافر سيادي'}</h4>
                                <div className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground mt-1">
                                    <PlaneTakeoff className="h-3 w-3 text-primary opacity-60" />
                                    {getCityName(trip.origin, locale)} <span>←</span> {getCityName(trip.destination, locale)}
                                </div>
                            </div>
                        </div>
                        <div className="text-left">
                            {renderStatusBadge(trip.status)}
                        </div>
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
  );
}
