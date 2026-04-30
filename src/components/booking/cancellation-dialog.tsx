// 'use client';

// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from '@/components/ui/alert-dialog';
// import { AlertTriangle, Info } from 'lucide-react'; // Added Info icon
// import type { Trip, Booking } from '@/lib/data'; // Import types

// interface CancellationDialogProps {
//   isOpen: boolean;
//   onOpenChange: (isOpen: boolean) => void;
//   isCancelling: boolean;
//   onConfirm: () => void;
//   // [SC-135] Inject: Accept context data
//   trip?: Trip | null;
//   booking?: Booking | null;
// }

// export function CancellationDialog({ isOpen, onOpenChange, isCancelling, onConfirm, trip }: CancellationDialogProps) {
//   return (
//     <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
//       <AlertDialogContent className="sm:max-w-[450px]">
//         <AlertDialogHeader>
//           <AlertDialogTitle className="flex items-center gap-2 text-destructive">
//             <AlertTriangle className="h-5 w-5" />
//             تأكيد إلغاء الحجز
//           </AlertDialogTitle>
//           <AlertDialogDescription className="space-y-4 pt-2">
//             <p className="font-semibold text-foreground">
//               هل أنت متأكد من رغبتك في إلغاء هذا الحجز نهائياً؟
//             </p>

//             {/* [SC-135] FIX: Safe Harbor Policy (Neutral Text) */}
//             <div className="bg-muted/50 p-3 rounded-lg border border-border text-sm space-y-2">
//                 <div className="flex items-center gap-2 font-bold text-primary">
//                     <Info className="h-4 w-4" />
//                     <span>تنويه بخصوص العربون</span>
//                 </div>
//                 <p className="text-muted-foreground text-xs leading-relaxed">
//                     منصة "سفريات" هي وسيط تقني لتوثيق الحجوزات.
//                     <br/>
//                     <strong>استرداد العربون يخضع للاتفاق المباشر بينك وبين الناقل ({trip?.carrierName || 'الناقل'}).</strong>
//                 </p>
//                 <ul className="list-disc list-inside text-xs text-muted-foreground">
//                     <li>نحن نوثق توقيت الإلغاء بدقة في السجل.</li>
//                     <li>يرجى التواصل مع الناقل لتسوية أي مستحقات بناءً على وقت الإلغاء.</li>
//                 </ul>
//             </div>

//           </AlertDialogDescription>
//         </AlertDialogHeader>
//         <AlertDialogFooter>
//           <AlertDialogCancel disabled={isCancelling}>تراجع</AlertDialogCancel>
//           <AlertDialogAction
//             onClick={(e) => {
//               e.preventDefault();
//               onConfirm();
//             }}
//             disabled={isCancelling}
//             className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
//           >
//             {isCancelling ? "جاري الإلغاء..." : "نعم، ألغِ الحجز"}
//           </AlertDialogAction>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   );
// }
'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Info } from 'lucide-react';
import type { Trip, Booking } from '@/lib/data';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
interface CancellationDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  isCancelling: boolean;
  onConfirm: (reason: string) => void;
  trip?: Trip | null;
  booking?: Booking | null;
}

export function CancellationDialog({ isOpen, onOpenChange, isCancelling, onConfirm, trip }: CancellationDialogProps) {
  const [reason, setReason] = useState('');
  const [touched, setTouched] = useState(false);
  const t = useTranslations('booking');
  const isReasonEmpty = reason.trim() === '';
  const showError = touched && isReasonEmpty;

  // إعادة تعيين الحقل عند إغلاق الداياليوج
  useEffect(() => {
    if (!isOpen) {
      setReason('');
      setTouched(false);
    }
  }, [isOpen]);

  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    setTouched(true);
    if (isReasonEmpty) return;
    onConfirm(reason.trim());
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[450px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            {t('confirmCancelTitle')}
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4 pt-2">
              <p className="font-semibold text-foreground">
                {t('confirmCancelDesc')}
              </p>

              {/* سبب الإلغاء */}
              <div className="space-y-2">
                <Label htmlFor="cancel-reason" className="text-sm font-semibold text-foreground">
                  {t('cancelReason')}<span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="cancel-reason"
                  placeholder={t('cancelReasonPlaceholder')}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  onBlur={() => setTouched(true)}
                  disabled={isCancelling}
                  className={`bg-background resize-none min-h-[90px] ${showError ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                />
                {showError && (
                  <p className="text-xs text-destructive">{t('cancelReasonRequired')}</p>
                )}
              </div>

              {/* تنويه العربون */}
              <div className="bg-muted/50 p-3 rounded-lg border border-border text-sm space-y-2">
                <div className="flex items-center gap-2 font-bold text-primary">
                  <Info className="h-4 w-4" />
                  <span><span>{t('depositNote')}</span></span>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {t('depositNoteDesc')}
                  <br />
                  <strong>{t('depositNoteCarrier')} ({trip?.carrierName || t('carrier')}).</strong>
                </p>
                <ul className="list-disc list-inside text-xs text-muted-foreground">
                  <li>{t('depositNoteLog')}</li>
                  <li>{t('depositNoteContact')}</li>
                </ul>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isCancelling}>{t('goBack')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isCancelling}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isCancelling ? t('cancelling') : t('confirmCancel')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}



