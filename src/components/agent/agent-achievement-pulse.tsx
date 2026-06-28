'use client';

import { useMemo } from 'react';
import { TrendingUp, Terminal, Zap, Award } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { triggerHaptic } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

/**
 * @component AgentAchievementPulse
 * @description THE REINFORCED TARGET REACTOR (STERILIZED - V11.0 - DUMB UI)
 * [PROTOCOL 16]: Pure Dumb UI component. Receives explicit primitive values.
 * [SSOT]: Displays truth directly from the archive artery.
 */

interface AgentAchievementPulseProps {
  completedTrips: number;
  target: number;
  bonus: number;
  currency: string;
  isMaster: boolean;
  firstName?: string;
}

export function AgentAchievementPulse({
  completedTrips,
  target,
  bonus,
  currency,
  isMaster,
  firstName
}: AgentAchievementPulseProps) {

  // [PROTOCOL 16]: Pure mathematical derivation
  const progress = useMemo(() => {
    if (!target || target <= 0) return 0;
    return Math.min((completedTrips / target) * 100, 100);
  }, [completedTrips, target]);

  return (
    <Card
      className="border-primary/10 shadow-2xl overflow-hidden rounded-[2.5rem] bg-card relative cursor-pointer group active:scale-[0.98] transition-all"
      onClick={() => triggerHaptic('success')}
    >
      <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-700" />

      <CardContent className="space-y-6 pt-6 text-right border border-[#BEAD77] rounded-[2.6rem] relative z-10">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-foreground">
              {isMaster ? 'القائد فايز' : `كابتن ${firstName || ''}`}
            </h2>
            <div className="flex items-center gap-2 justify-start pt-2">
              <Badge variant="outline" className="text-xs font-black bg-primary/5 text-primary border-[#BEAD77] px-2 py-0">وكيل سيادي</Badge>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">لوحة الإنجازات الميدانية</p>
            </div>
          </div>
          <div className="p-3 bg-primary/10 rounded-2xl text-primary shadow-inner group-hover:rotate-12 transition-transform">
            {isMaster ? <Terminal className="h-6 w-6" /> : <TrendingUp className="h-6 w-6" />}
          </div>
        </div>

        <div className="p-5 bg-muted/30 rounded-3xl border border-[#BEAD77] border-dashed text-right shadow-inner hover:bg-muted/50 transition-colors">
          <span className="text-sm text-muted-foreground font-black uppercase flex items-center gap-1 justify-end">
            إجمالي الرحلات المنجزة <Zap className="h-3 w-3 text-primary" />
          </span>
          <p className="text-4xl font-black text-foreground font-mono mt-1">
            {completedTrips}
            <span className="text-sm text-muted-foreground font-bold mr-2">من أصل {target}</span>
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-[10px] font-black uppercase text-muted-foreground">
            <div className="flex items-center gap-1 text-xs">
              <Award className="h-4 w-4 text-amber-500" />
              <span>مكافأة الهدف : <span className="text-foreground font-mono">{bonus} {currency}</span></span>
            </div>
            <span className="text-primary text-xs font-mono">{progress.toFixed(0)}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-muted rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}
