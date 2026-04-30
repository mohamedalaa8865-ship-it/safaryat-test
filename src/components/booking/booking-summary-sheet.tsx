
'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, Receipt, Send, Ticket, Sparkles } from "lucide-react";
import { useCountryPricing } from "@/hooks/use-country-pricing";
import { FinancialLogic } from "@/lib/financial-logic";
import { Trip } from "@/lib/data";
import { useTranslations } from "next-intl";
import { useState, useMemo, useCallback } from "react";

interface BookingSummaryProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  trip?: Trip;
  countryCode?: string;
  confirmedEmail?: string;
}

/**
 * @component BookingSummarySheet
 * @description THE REINFORCED BILLING SHEET (SC-640 - FREEDOM)
 * [PROTOCOL 12]: Explicitly labels Free Period for Traveler Trust.
 */
export function BookingSummarySheet({
  isOpen, onClose, onConfirm, trip, countryCode = 'JO', confirmedEmail = '',
}: BookingSummaryProps) {

  const t = useTranslations('booking');
  const { rule, loading } = useCountryPricing(countryCode);
  const [isConfirming, setIsConfirming] = useState(false);

  // [SC-640]: Synced with freedom fields (travelerCommissionFee)
  const financials = useMemo(() => {
    const platformFee = rule?.travelerCommissionFee ?? 0;
    const discount = rule?.travelerDiscount ?? 0;
    const totalDue = FinancialLogic.calculatePlatformFeeDue(platformFee, discount);
    const currency = rule?.currency ?? 'JOD';
    const isFreePeriod = totalDue === 0 && platformFee > 0;

    return { platformFee, discount, totalDue, currency, isFreePeriod };
  }, [rule]);

  const handleConfirm = useCallback(async () => {
    setIsConfirming(true);
    try {
      await onConfirm();
    } finally {
      setIsConfirming(false);
    }
  }, [onConfirm]);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="rounded-t-xl px-6 pb-8 pt-4 h-auto max-h-[90vh]">

        <SheetHeader className="text-right mb-6">
          <SheetTitle className="flex items-center gap-2 text-xl">
            <Receipt className="w-5 h-5 text-blue-600" />
            {t('title')}
          </SheetTitle>
          <SheetDescription>
            {t('description')}
            {confirmedEmail && (
              <span className="block mt-1 text-xs text-green-600">
                {t('emailWillBeSent')} <span className="font-medium ltr">{confirmedEmail}</span>
              </span>
            )}
          </SheetDescription>
        </SheetHeader>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : rule ? (
          <div className="space-y-6">

            <div className="bg-gray-900 p-4 rounded-lg border space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{t('route')}</span>
                <span className="font-semibold">{trip?.origin || '--'} ⬅ {trip?.destination || '--'}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('carrier')}</span>
                <span>{trip?.carrierName || '--'}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('ticketPrice')}</span>
                <span className="font-semibold">{trip?.price ?? '--'} {trip?.currency || ''}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center font-extrabold text-white">
                <span>{t('serviceFee')}</span>
                <span className="font-mono">
                  {financials.platformFee.toFixed(2)} {financials.currency}
                </span>
              </div>

              <div className="flex justify-between items-center text-green-800 font-bold bg-green-50 p-2 rounded">
                <span className="flex items-center gap-1">
                  {financials.isFreePeriod ? <Sparkles className="w-4 h-4" /> : <Ticket className="w-4 h-4" />}
                  {financials.isFreePeriod ? t('freeLaunch') : t('promoDiscount')}
                </span>
                <span className="font-mono">
                  -{financials.discount.toFixed(2)} {financials.currency}
                </span>
              </div>

              <Separator className="my-2" />

              <div className="flex justify-between items-center text-lg font-bold text-white">
                <span>{t('amountDue')}</span>
                <span className="font-mono text-2xl">
                  {financials.totalDue.toFixed(2)} <span className="text-sm">{financials.currency}</span>
                </span>
              </div>

              {financials.isFreePeriod && (
                <p className="text-[10px] text-center text-muted-foreground animate-pulse">
                  {t('freePeriodNote')}
                </p>
              )}
            </div>

            <SheetFooter>
              <Button
                onClick={handleConfirm}
                disabled={isConfirming}
                className="w-full h-12 text-lg font-bold bg-blue-600 hover:bg-blue-700"
              >
                {isConfirming ? (
                  <><Loader2 className="ml-2 h-5 w-5 animate-spin" />{t('confirming')}</>
                ) : (
                  <><Send className="ml-2 h-5 w-5" />{t('confirmButton')}</>
                )}
              </Button>
            </SheetFooter>

          </div>
        ) : (
          <div className="text-center text-red-500">{t('pricingError')}</div>
        )}

      </SheetContent>
    </Sheet>
  );
}
