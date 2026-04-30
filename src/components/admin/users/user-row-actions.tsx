'use client';

import { MoreHorizontal, Eye, Unlock, Ban, Banknote, CheckCircle2, History } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface UserRowActionsProps {
  userId: string;
  isFinancialFrozen: boolean;
  isSecurityFrozen: boolean;
  onAction: (action: 'view' | 'finance_freeze' | 'security_freeze', id: string, currentStatus: boolean) => void;
}

/**
 * @component UserRowActions
 * @description THE REINFORCED COMMAND MENU (DIAMOND STERILIZED - SC-988)
 * [SCR-988]: Purged unsupported 'dir' prop to prevent hydration/type errors.
 * Protocol 16: Sterilized UI Logic.
 */
export const UserRowActions = ({ userId, isFinancialFrozen, isSecurityFrozen, onAction }: UserRowActionsProps) => {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-emerald-500/10">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4 text-emerald-600" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 text-right">
        <DropdownMenuLabel className="text-right">العمليات السيادية</DropdownMenuLabel>
        
        <DropdownMenuItem onClick={() => onAction('view', userId, false)} className="cursor-pointer text-right">
          <Eye className="ml-2 h-4 w-4" />
          التفاصيل والتحقيق الجنائي
        </DropdownMenuItem>

        <DropdownMenuItem 
          onClick={() => router.push(`/admin/audit-logs?q=${userId}&cat=FIELD_MGMT`)} 
          className="cursor-pointer text-right text-emerald-600 font-bold"
        >
          <History className="ml-2 h-4 w-4" />
          عرض السجل القانوني (التاريخ)
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem
          onClick={() => onAction('finance_freeze', userId, isFinancialFrozen)}
          className={cn(
            "cursor-pointer font-bold text-right",
            isFinancialFrozen ? "text-emerald-600 focus:text-emerald-700" : "text-orange-600 focus:text-orange-700"
          )}
        >
          {isFinancialFrozen ? <CheckCircle2 className="ml-2 h-4 w-4" /> : <Banknote className="ml-2 h-4 w-4" />}
          {isFinancialFrozen ? 'تفعيل (فك التجميد المالي)' : 'تجميد مالي (تقييد)'}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onAction('security_freeze', userId, isSecurityFrozen)}
          className={cn(
            "cursor-pointer font-black text-right",
            isSecurityFrozen ? "text-emerald-600 focus:text-emerald-700" : "text-destructive focus:text-destructive"
          )}
        >
          {isSecurityFrozen ? <Unlock className="ml-2 h-4 w-4" /> : <Ban className="ml-2 h-4 w-4" />}
          {isSecurityFrozen ? 'رفع الحظر (إعادة تفعيل)' : 'حظر أمني (طرد نهائي)'}
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => {
            navigator.clipboard.writeText(userId);
        }} className="text-[10px] text-muted-foreground text-right group">
            نسخ المعرف الرقمي (UID)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
