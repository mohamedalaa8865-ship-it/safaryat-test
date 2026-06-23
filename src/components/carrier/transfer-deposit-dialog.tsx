'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import type { TransferRequest, PaymentWallet } from '@/lib/data';
import { Loader2, Wallet, CreditCard, Banknote, CheckCircle2, Copy, ArrowRight, ArrowLeft } from 'lucide-react';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, updateDoc, serverTimestamp, addDoc, collection } from 'firebase/firestore';
import { sendPush } from '@/lib/send-push';
import { getCityName } from '@/lib/constants';
import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';

interface TransferDepositDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    request: TransferRequest | null;
    depositAmount: number;
    currency: string;
}

const WALLET_TYPE_LABEL: Record<string, string> = {
    wallet: 'محفظة إلكترونية',
    bank: 'حساب بنكي',
    card: 'بطاقة',
    other: 'أخرى',
};

const WALLET_TYPE_ICON: Record<string, React.ElementType> = {
    wallet: Wallet,
    bank: Banknote,
    card: CreditCard,
    other: Wallet,
};

function PaymentWalletCard({ wallet }: { wallet: PaymentWallet }) {
    const [copied, setCopied] = useState(false);
    const Icon = WALLET_TYPE_ICON[wallet.type] || Wallet;

    const handleCopy = () => {
        navigator.clipboard.writeText(wallet.accountNumber);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={cn(
            'relative rounded-xl border p-4 space-y-2 transition-all',
            wallet.isPrimary ? 'border-primary/50 bg-primary/5' : 'border-border bg-card'
        )}>
            {wallet.isPrimary && (
                <Badge className="absolute top-2 left-2 text-[10px] bg-primary/10 text-primary border-primary/20">
                    رئيسية
                </Badge>
            )}
            <div className="flex items-center gap-2 pt-2">
                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                    <Icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                    <p className="font-bold text-sm">{wallet.provider}</p>
                    <p className="text-[10px] text-muted-foreground">{WALLET_TYPE_LABEL[wallet.type]}</p>
                </div>
            </div>
            <div className="flex items-center justify-between gap-2 bg-muted/50 rounded-lg px-3 py-2">
                <div className="min-w-0">
                    <p className="text-[10px] text-muted-foreground">اسم صاحب الحساب</p>
                    <p className="text-sm font-semibold truncate">{wallet.holderName}</p>
                </div>
            </div>
            <div className="flex items-center justify-between gap-2 bg-muted/50 rounded-lg px-3 py-2">
                <div className="min-w-0">
                    <p className="text-[10px] text-muted-foreground">رقم الحساب / المحفظة</p>
                    <p className="text-sm font-bold font-mono truncate" dir="ltr">{wallet.accountNumber}</p>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 shrink-0"
                    onClick={handleCopy}
                >
                    {copied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
            </div>
        </div>
    );
}

export function TransferDepositDialog({
    isOpen,
    onOpenChange,
    request,
    depositAmount,
    currency,
}: TransferDepositDialogProps) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const locale = useLocale();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // جلب بيانات الناقل المستلم (to) لعرض طرق دفعه
    const toCarrierRef = useMemoFirebase(() => {
        if (!firestore || !request?.toCarrierId) return null;
        return doc(firestore, 'users', request.toCarrierId);
    }, [firestore, request?.toCarrierId]);

    const { data: toCarrier, isLoading: isLoadingCarrier } = useDoc<any>(toCarrierRef);

    const wallets: PaymentWallet[] = toCarrier?.paymentWallets || [];
    const primaryWallet = wallets.find(w => w.isPrimary) || wallets[0];

    const handleConfirmSent = async () => {
        if (!firestore || !request) return;
        setIsSubmitting(true);
        try {
            // تحديث حالة طلب النقل → deposit_sent
            await updateDoc(doc(firestore, 'transferRequests', request.id), {
                status: 'deposit_sent',
                depositSentAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            // إشعار للناقل المستلم بإن العربون اتبعت
            await addDoc(collection(doc(firestore, 'users', request.toCarrierId), 'notifications'), {
                userId: request.toCarrierId,
                title: '🏦 العربون في طريقه إليك',
                message: `الناقل أكد إرسال العربون (${depositAmount} ${currency})، تحقق من حسابك وأكد الاستلام`,
                type: 'transfer_deposit_sent',
                transferRequestId: request.id,
                tripId: request.tripId,
                isRead: false,
                createdAt: serverTimestamp(),
            });

            await sendPush({
                userId: request.toCarrierId,
                title: '🏦 العربون في طريقه إليك',
                body: `الناقل أكد إرسال العربون (${depositAmount} ${currency})، تحقق من حسابك`,
                data: { type: 'transfer_deposit_sent', transferRequestId: request.id },
            });

            toast({ title: '✅ تم تأكيد إرسال العربون' });
            onOpenChange(false);
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'فشل التأكيد', description: error?.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!request) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Banknote className="h-5 w-5 text-primary" />
                        إرسال العربون للناقل الجديد
                    </DialogTitle>
                    <DialogDescription>
                        وافق الناقل على استلام رحلتك. أرسل العربون المطلوب لإتمام عملية النقل.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {/* ملخص الرحلة */}
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl border text-sm">
                        <span className="font-bold flex items-center gap-1.5">
                            <span>{getCityName(request.tripDetails?.origin || '', locale)}</span>
                            <ArrowLeft className="h-3.5 w-3.5 text-primary" />
                            <span>{getCityName(request.tripDetails?.destination || '', locale)}</span>
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {request.tripDetails?.passengerCount} ركاب
                        </span>
                    </div>

                    {/* مبلغ العربون */}
                    {/* <div className="flex items-center justify-between p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                        <div>
                            <p className="text-xs text-muted-foreground font-medium">مبلغ العربون المطلوب</p>
                            <p className="text-2xl font-black text-amber-600">{depositAmount}</p>
                            <p className="text-xs text-amber-700 font-semibold">{currency}</p>
                        </div>
                        <Banknote className="h-10 w-10 text-amber-400" />
                    </div> */}

                    {/* بيانات الدفع */}
                    {isLoadingCarrier ? (
                        <div className="flex items-center justify-center p-6 text-muted-foreground text-sm">
                            <Loader2 className="h-5 w-5 animate-spin ml-2" />
                            جاري تحميل بيانات الدفع...
                        </div>
                    ) : wallets.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground text-sm rounded-xl border border-dashed">
                            لم يضف الناقل بيانات دفع بعد. تواصل معه مباشرة.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <p className="text-sm font-bold text-foreground flex items-center gap-1.5">
                                <Wallet className="h-4 w-4 text-primary" />
                                طرق استقبال الناقل للدفع
                            </p>
                            {/* الأفضلية للمحفظة الرئيسية */}
                            {primaryWallet && <PaymentWalletCard wallet={primaryWallet} />}
                            {wallets.filter(w => !w.isPrimary).map((wallet) => (
                                <PaymentWalletCard key={wallet.id} wallet={wallet} />
                            ))}
                        </div>
                    )}

                    <p className="text-xs text-muted-foreground text-center">
                        بعد إرسال العربون، اضغط "أكدت الإرسال" وسيتحقق الناقل من استلامه
                    </p>
                </div>

                <DialogFooter className="gap-2 flex-col sm:flex-row">
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
                        إلغاء
                    </Button>
                    <Button
                        onClick={handleConfirmSent}
                        disabled={isSubmitting || isLoadingCarrier}
                        className="flex-1 bg-[#16A34A] hover:bg-[#16a34abd] text-white"
                    >
                        {isSubmitting
                            ? <><Loader2 className="h-4 w-4 animate-spin ml-2" /> جاري التأكيد...</>
                            : <><CheckCircle2 className="h-4 w-4 ml-2" /> أكدت إرسال العربون</>
                        }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}