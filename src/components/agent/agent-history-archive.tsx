'use client';

import React, { useMemo, useCallback } from 'react';
import type { Trip } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { History, PlaneTakeoff, DollarSign } from 'lucide-react';
import { getCityName } from '@/lib/constants';
import { useLocale } from 'next-intl';
import { formatDate } from '@/lib/formatters';
import { cn } from '@/lib/utils';

interface AgentHistoryArchiveProps {
  trips: Trip[];
}

/**
 * @component AgentHistoryArchive
 * @description THE REINFORCED ARCHIVE ISLAND (STERILIZED - V1.1 - SCR-865-ST)
 * [PROTOCOL 16]: Diamond Sterilized. Presentational logic only.
 * [PROTOCOL 13]: Optimized for PWA high-speed interaction.
 */
export function AgentHistoryArchive({ trips }: AgentHistoryArchiveProps) {
  const locale = useLocale();

  // [PROTOCOL 16]: Pure rendering logic for status
  const renderStatus = useCallback((status: string) => {
    switch(status) {
        case 'Confirmed':
        case 'Completed':
            return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[8px] font-black">ناجحة</Badge>;
        case 'Cancelled':
            return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 text-[8px] font-black">ملغاة</Badge>;
        default:
            return <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[8px] font-black">جارية</Badge>;
    }
  }, []);

  if (trips.length === 0) {
    return (
      <div className="p-12 text-center text-xs text-muted-foreground bg-muted/5 rounded-[2.5rem] border-2 border-dashed border-primary/10 animate-in fade-in">
          السجل التاريخي فارغ. لم يتم أرشفة أي رحلات بعد.
      </div>
    );
  }

  return (
    <Card className="border-primary/10 shadow-xl rounded-[2.5rem] bg-card overflow-hidden">
        <CardHeader className="bg-muted/10 border-b border-primary/5 pb-4">
            <CardTitle className="text-sm font-black text-foreground flex items-center gap-2">
                <History className="h-4 w-4 text-primary" /> الأرشيف الميداني السيادي
            </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
            <div className="divide-y divide-primary/5 max-h-[450px] overflow-y-auto no-scrollbar">
                {trips.map(trip => (
                    <div key={trip.id} className="p-4 flex items-center justify-between hover:bg-primary/5 transition-colors group">
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <h4 className="text-[11px] font-black group-hover:text-primary transition-colors">{trip.passengerName || 'مسافر سيادي'}</h4>
                                <div className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground mt-1">
                                    <PlaneTakeoff className="h-3 w-3 text-primary opacity-60" />
                                    {getCityName(trip.origin, locale)} <span>←</span> {getCityName(trip.destination, locale)}
                                </div>
                                <p className="text-[8px] font-mono text-muted-foreground/50 mt-0.5">
                                    {formatDate(trip.createdAt, 'dd/MM/yyyy HH:mm', locale)}
                                </p>
                            </div>
                        </div>
                        <div className="text-left flex flex-col items-end gap-1">
                            <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600 mb-1">
                                <span>+{trip.agentFee || 0}</span>
                                <DollarSign className="h-3 w-3" />
                            </div>
                            {renderStatus(trip.status)}
                        </div>
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
  );
}
