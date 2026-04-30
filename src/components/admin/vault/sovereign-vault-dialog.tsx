'use client';

import { useState, useCallback } from 'react';
import { useFunctions } from '@/firebase';
import { httpsCallable } from 'firebase/functions';
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
import { Textarea } from '@/components/ui/textarea';
import { ShieldCheck, Lock, Loader2, AlertCircle } from 'lucide-react';
import { triggerHaptic } from '@/lib/utils';

interface SovereignVaultDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onVerified: (reason: string) => Promise<void>;
}

/**
 * @component SovereignVaultDialog
 * @description THE REINFORCED SECURITY GATE (SC-683-STERILIZED)
 * [STERILIZED]: Applied Protocol 16. Memoized handlers and purged noise.
 * Protocol 30: Backend-First Verification.
 */
export function SovereignVaultDialog({
  isOpen,
  onOpenChange,
  title,
  description,
  onVerified
}: SovereignVaultDialogProps) {
  const functions = useFunctions();
  
  const [pin, setPin] = useState('');
  const [reason, setReason] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!functions) return;
    
    if (pin.length < 4) {
        setError('الرجاء إدخال الرمز المكون من 4 أرقام.');
        return;
    }
    if (reason.trim().length < 5) {
        setError('يرجى كتابة سبب استراتيجي واضح (5 أحرف على الأقل).');
        return;
    }

    setIsVerifying(true);
    setError('');

    try {
        const verifyFn = httpsCallable(functions, 'verifySovereignPin');
        const result = await verifyFn({ pin });
        const { success } = result.data as { success: boolean };

        if (success) {
            triggerHaptic('light');
            await onVerified(reason);
            setPin('');
            setReason('');
            onOpenChange(false);
        } else {
            triggerHaptic('heavy');
            setError('الرمز السيادي (PIN) غير صحيح. تم تسجيل المحاولة الفاشلة.');
            setPin('');
        }
    } catch (err: any) {
        setError('حدث خطأ في الاتصال بالخزنة. يرجى المحاولة لاحقاً.');
    } finally {
        setIsVerifying(false);
    }
  }, [functions, pin, reason, onVerified, onOpenChange]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isVerifying && onOpenChange(open)}>
      <DialogContent className="sm:max-w-md bg-card border-2 border-primary/20 shadow-2xl" dir="rtl">
        <DialogHeader className="text-center">
          <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-2 border border-primary/20">
            <Lock className="h-8 w-8 text-primary animate-pulse" />
          </div>
          <DialogTitle className="text-2xl font-black tracking-tight">{title}</DialogTitle>
          <DialogDescription className="text-xs font-bold text-muted-foreground">{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-2">
          {error && (
            <div className="bg-destructive/10 p-3 rounded-lg border border-destructive/20 text-destructive text-[10px] font-black flex items-center gap-2 animate-in shake duration-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest px-1">الرمز السيادي (PIN)</Label>
              <Input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                autoFocus
                placeholder="****"
                className="text-center text-3xl font-black tracking-[1em] h-16 bg-muted/20 border-primary/10 focus:ring-primary/30"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                disabled={isVerifying}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest px-1">السبب الاستراتيجي (للسجل الجنائي)</Label>
              <Textarea
                placeholder="أدخل مبررات هذا الإجراء المالي..."
                className="bg-muted/20 border-primary/10 resize-none h-20 text-xs font-medium"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={isVerifying}
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
                type="submit" 
                className="w-full h-14 text-lg font-black gap-2 shadow-lg active:scale-95 transition-transform" 
                disabled={isVerifying || pin.length < 4 || reason.length < 5}
            >
              {isVerifying ? <Loader2 className="h-6 w-6 animate-spin" /> : <><ShieldCheck className="h-6 w-6" /> فتح الخزنة والإنفاذ</>}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
