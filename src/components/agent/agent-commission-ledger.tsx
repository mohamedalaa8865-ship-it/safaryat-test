
'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Coins, History, ArrowUpRight, CheckCircle2, Clock, Wallet } from 'lucide-react';
import { formatDate } from '@/lib/formatters';
import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';

/**
 * @component AgentCommissionLedger
 * @description THE REINFORCED FINANCIAL LEDGER (STERILIZED - V1.0 - SCR-852)
 * Protocol 43: Independent UI Island. Protocol 88: Resource Protected.
 * Displays the agent's commission history with forensic detail.
 */

interface CommissionEntry {
  id: string;
  amount: number;
  currency: string;
  status: 'EARNED' | 'PAID' | 'CANCELLED';
  earnedAt: any;
  bookingId?: string;
}

interface AgentCommissionLedgerProps {
  commissions: CommissionEntry[];
  isLoading: boolean;
}

export function AgentCommissionLedger({ commissions, isLoading }: AgentCommissionLedgerProps) {
  const locale = useLocale();

  const sortedCommissions = useMemo(() => {
    return [...commissions].sort((a, b) => {
      const aDate = a.earnedAt?.seconds ? a.earnedAt.seconds : new Date(a.earnedAt).getTime();
      const bDate = b.earnedAt?.seconds ? b.earnedAt.seconds : new Date(b.earnedAt).getTime();
      return bDate - aDate;
    });
  }, [commissions]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 w-full bg-muted/20 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  if (commissions.length === 0) {
    return (
      <div className="p-12 text-center text-[10px] text-muted-foreground bg-muted/5 rounded-[2.5rem] border-2 border-dashed border-primary/10">
        <History className="h-8 w-8 mx-auto mb-2 opacity-20" />
        لا توجد قيود مالية مسجلة في دفتر العمولات بعد.
      </div>
    );
  }

  return (
    <Card className="border-primary/10 bg-card/50 backdrop-blur-md rounded-[2.5rem] overflow-hidden shadow-2xl">
      <CardHeader className="bg-muted/30 border-b border-primary/5 pb-4">
        <CardTitle className="text-sm font-black flex items-center gap-2">
          <Coins className="h-4 w-4 text-primary" />
          دفتر أستاذ العمولات السيادي
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-muted/10">
            <TableRow className="border-primary/5">
              <TableHead className="text-right text-[10px] font-black uppercase">العملية</TableHead>
              <TableHead className="text-center text-[10px] font-black uppercase">المبلغ</TableHead>
              <TableHead className="text-left text-[10px] font-black uppercase">الحالة</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCommissions.map((comm) => (
              <TableRow key={comm.id} className="border-primary/5 hover:bg-primary/5 transition-colors group">
                <TableCell className="py-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] font-black text-foreground">عمولة حجز #{comm.bookingId?.slice(-4).toUpperCase() || 'N/A'}</span>
                    <span className="text-[9px] font-mono text-muted-foreground">{formatDate(comm.earnedAt, 'dd/MM HH:mm', locale)}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-sm font-black text-emerald-500">+{comm.amount}</span>
                    <span className="text-[10px] font-bold text-muted-foreground">{comm.currency}</span>
                  </div>
                </TableCell>
                <TableCell className="text-left">
                  <Badge variant="outline" className={cn(
                    "text-[8px] font-black px-2 py-0 h-5 gap-1 rounded-full border-0",
                    comm.status === 'PAID' ? "bg-emerald-500/10 text-emerald-500" : 
                    comm.status === 'EARNED' ? "bg-amber-500/10 text-amber-500" : "bg-destructive/10 text-destructive"
                  )}>
                    {comm.status === 'PAID' ? <CheckCircle2 className="h-2.5 w-2.5" /> : <Clock className="h-2.5 w-2.5" />}
                    {comm.status === 'PAID' ? 'مقبوض' : comm.status === 'EARNED' ? 'مستحق' : 'ملغي'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
