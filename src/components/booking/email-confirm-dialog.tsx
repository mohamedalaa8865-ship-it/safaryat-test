'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Trip } from '@/lib/data';
import { useTranslations } from 'next-intl';
interface EmailConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (email: string) => void;
  trip: Trip;
}

export function EmailConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  trip,
}: EmailConfirmDialogProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const t = useTranslations('booking');
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleConfirm = async () => {
    if (!isValidEmail) {
      toast({
        variant: 'destructive',
        title: t('invalidEmail'),
        description: t('invalidEmailDesc'),
      });
      return;
    }

    setLoading(true);
    // نمرر الإيميل للخطوة التالية
    onConfirm(email);
    setLoading(false);
  };

  const handleClose = () => {
    setEmail('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Mail className="h-5 w-5 text-primary" />
            {t('confirmEmailTitle')}
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed">
            {t('confirmEmailDesc')}
            <span className="font-semibold text-foreground">{trip.origin}</span>
            {t('confirmEmailTo')}
            <span className="font-semibold text-foreground">{trip.destination}</span>
            {t('confirmEmailAfter')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* معلومات الرحلة المختصرة */}
          <div className="bg-muted/50 rounded-lg p-3 text-sm space-y-1.5 border">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('trip')}</span>
              <span className="font-medium">{trip.origin} ← {trip.destination}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('priceLabel')}</span>
              <span className="font-medium">{trip.price} {trip.currency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('deposit')}</span>
              <span className="font-medium">{trip.depositPercentage || 0}%</span>
            </div>
          </div>

          {/* حقل الإيميل */}
          <div className="space-y-2">
            <Label htmlFor="email-input">{t('emailLabel')}</Label>
            <Input
              id="email-input"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="ltr text-left"
              onKeyDown={(e) => e.key === 'Enter' && isValidEmail && handleConfirm()}
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              {t('emailHint')}
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2 flex-col sm:flex-row">
          <Button variant="outline" onClick={handleClose} disabled={loading} className="w-full sm:w-auto">
            {t('cancel')}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!isValidEmail || loading}
            className="w-full sm:w-auto"
          >
            {loading ? (
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            ) : (
              <ArrowLeft className="ml-2 h-4 w-4" />
            )}
            {t('continueBooking')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}