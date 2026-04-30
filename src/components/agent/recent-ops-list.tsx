'use client';

import React, { useCallback } from 'react';
import type { Trip } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, DollarSign, ArrowRight, Copy, CheckCheck, Clock } from 'lucide-react';
import { getCityName } from '@/lib/constants';
import { useLocale } from 'next-intl';
import { cn, triggerHaptic } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

/**
 * @component RecentOpsList
 * @description THE REINFORCED PASSIVE LIST (STERILIZED - V4.0 - SCR-914)
 * [V4.0]: Injected "Sovereign Eye" to visualize link view status.
 * [PROTOCOL 16]: Dumb UI Island. Zero internal state or database logic.
 * [PROTOCOL 13]: High Contrast PWA interactions.
 */

interface RecentOpsListProps {
  trips: Trip[];
  isLoading: boolean;
  isMaster?: boolean;
}

export function RecentOpsList({ trips, isLoading, isMaster = false }: RecentOpsListProps) {
  const locale = useLocale();
  const { toast } = useToast();

  const handleCopyMagicLink = useCallback((tripId: string) => {
    triggerHaptic('success');
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const fullLink = `${baseUrl}/${locale}/ticket/${tripId}`;
    
    navigator.clipboard.writeText(fullLink);
    toast({
        title: "تم نسخ الرابط السيادي 📋",
        description: "الرابط جاهز للإرسال للمسافر الآن."
    });
  }, [locale, toast]);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2].map((i) => (
          <div key={i} className="h-20 w-full bg-muted/20 animate-pulse rounded-[1.5rem]" />
        ))}
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="p-8 text-center text-[10px] text-muted-foreground bg-muted/5 rounded-[1.5rem] border-2 border-dashed border-primary/5">
        لا توجد عمليات ميدانية جارية حالياً.
      </div>
    );
  }

  return (
    <div className="space-y-2 animate-in fade-in duration-500">
      {trips.map((trip: any) => {
        const isPending = trip.status === 'Pending-Carrier-Confirmation' || trip.status === 'Awaiting-Offers';
        // [SCR-914] Check if the link has been viewed by the traveler
        const hasBeenViewed = !!trip.viewedAt;
        
        return (
          <Card 
            key={trip.id} 
            className={cn(
              "border border-border/50 p-4 rounded-[1.5rem] flex justify-between items-center transition-all hover:bg-muted/5 group",
              isMaster && "border-dashed opacity-80"
            )}
          >
            <div className="flex items-center gap-3 text-right">
              <div className={cn(
                "h-2 w-2 rounded-full",
                trip.status === 'Confirmed' || trip.status === 'Completed' ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
              )} />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                    <p className="text-xs font-black text-foreground truncate max-w-[120px]">{trip.passengerName || 'عميل سيادي'}</p>
                    
                    {/* [SCR-914] The Sovereign Eye Indicator: Lights up when link is opened */}
                    {hasBeenViewed && (
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[7px] h-4 px-1 gap-0.5 font-black uppercase animate-in zoom-in">
                            <CheckCheck className="h-2 w-2" /> شوهد
                        </Badge>
                    )}
                </div>
                <p className="text-[10px] text-muted-foreground font-bold flex items-center gap-1 mt-0.5">
                  <MapPin className="h-2.5 w-2.5 text-primary/60" />
                  {getCityName(trip.origin, locale)} <ArrowRight className="h-2 w-2 mx-0.5 opacity-30" /> {getCityName(trip.destination, locale)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
                {isPending && !isMaster && (
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-9 w-9 rounded-xl bg-primary/10 text-primary border border-primary/5 hover:bg-primary hover:text-black transition-all"
                        onClick={() => handleCopyMagicLink(trip.id)}
                    >
                        <Copy className="h-4 w-4" />
                    </Button>
                )}
                
                <div className="text-left space-y-1">
                    <div className="flex items-center gap-1.5 justify-end">
                        <span className="text-[10px] font-black text-emerald-600">+{trip.agentFee || 0}</span>
                        <DollarSign className="h-3 w-3 text-emerald-600" />
                    </div>
                    <Badge variant="secondary" className="text-[8px] font-black bg-muted/50 rounded-full px-2 py-0">
                        {trip.status === 'Pending-Carrier-Confirmation' ? 'بانتظار الناقل' : 
                         trip.status === 'Awaiting-Offers' ? 'منشور للسوق' : 'مؤكدة'}
                    </Badge>
                </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
