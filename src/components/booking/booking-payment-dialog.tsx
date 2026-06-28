// // 'use client';

// // import {
// //     Dialog,
// //     DialogContent,
// //     DialogHeader,
// //     DialogTitle,
// //     DialogDescription,
// //     DialogFooter,
// // } from '@/components/ui/dialog';
// // import { Button } from '@/components/ui/button';
// // import { ScrollArea } from '@/components/ui/scroll-area';
// // import { useMemo, useState, useRef } from 'react';
// // import type { Trip, UserProfile, Booking, PaymentWallet } from '@/lib/data';
// // import { Send, Loader2, CreditCard, Banknote, Info, ImagePlus, X, CheckCircle2, Clipboard } from 'lucide-react';
// // import { useToast } from '@/hooks/use-toast';
// // import { Card, CardContent } from '@/components/ui/card';
// // import { Separator } from '@/components/ui/separator';
// // import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
// // import { useDoc, useFirestore } from '@/firebase';
// // import { doc } from 'firebase/firestore';
// // import { FinancialLogic } from '@/lib/financial-logic';
// // import { useTranslations } from 'next-intl';
// // import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// // import { useUser } from '@/firebase';

// // interface BookingPaymentDialogProps {
// //     isOpen: boolean;
// //     onOpenChange: (isOpen: boolean) => void;
// //     trip: Trip;
// //     booking?: Booking | null;
// //     onConfirm: (receiptUrl?: string) => void;
// //     isProcessing?: boolean;
// // }

// // /**
// //  * @component BookingPaymentDialog
// //  * @description [SC-639-STERILIZED] Using FinancialLogic SSOT.
// //  * [UPDATE]&#58; Replaced payment instructions with receipt image upload.
// //  */
// // export function BookingPaymentDialog({
// //     isOpen,
// //     onOpenChange,
// //     trip,
// //     booking,
// //     onConfirm,
// //     // isProcessing = false
// // }: BookingPaymentDialogProps) {
// //     const { toast } = useToast();
// //     const firestore = useFirestore();
// //     const t = useTranslations('booking');
// //     const { user } = useUser();

// //     // --- Receipt Upload State ---
// //     const [receiptFile, setReceiptFile] = useState<File | null>(null);
// //     const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
// //     const [isUploading, setIsUploading] = useState(false);
// //     const fileInputRef = useRef<HTMLInputElement>(null);

// //     const bookingTripRef = useMemo(() => {
// //         if (!firestore || trip?.id || !booking?.tripId) return null;
// //         return doc(firestore, 'trips', booking.tripId);
// //     }, [firestore, trip?.id, booking?.tripId]);

// //     const { data: bookingTrip } = useDoc<Trip>(bookingTripRef);
// //     const effectiveTrip = trip?.id ? trip : bookingTrip;
// //     const resolvedCarrierId = effectiveTrip?.carrierId || booking?.carrierId;

// //     const carrierProfileRef = useMemo(() => {
// //         if (!firestore || !resolvedCarrierId) return null;
// //         return doc(firestore, 'users', resolvedCarrierId);
// //     }, [firestore, resolvedCarrierId]);

// //     const { data: carrierProfile } = useDoc<UserProfile>(carrierProfileRef);

// //     const paymentWallets = useMemo<PaymentWallet[]>(() => {
// //         if (booking?.paymentSnapshot?.length) return booking.paymentSnapshot;
// //         return carrierProfile?.paymentWallets || [];
// //     }, [booking?.paymentSnapshot, carrierProfile?.paymentWallets]);

// //     const paymentDetailsText = useMemo(() => {
// //         const lines: string[] = [];
// //         const freeText = carrierProfile?.paymentInformation?.trim();

// //         if (freeText) lines.push(freeText);

// //         if (paymentWallets.length > 0) {
// //             if (lines.length > 0) lines.push('');
// //             lines.push(...paymentWallets.map((wallet) => {
// //                 const provider = wallet.provider?.trim() || 'Payment';
// //                 const account = wallet.accountNumber?.trim() || '—';
// //                 const holder = wallet.holderName?.trim();
// //                 return holder ? `${provider}: ${account} — ${holder}` : `${provider}: ${account}`;
// //             }));
// //         }

// //         return lines.join('\n') || t('defaultPayment');
// //     }, [carrierProfile?.paymentInformation, paymentWallets, t]);

// //     const { totalAmount, depositAmount, remainingAmount, currency, depositPercentage } = useMemo(() => {
// //         const total = booking?.totalPrice || (effectiveTrip?.price || 0) * (booking?.seats || 1);
// //         const depositPerc = effectiveTrip?.depositPercentage || 20;
// //         const deposit = FinancialLogic.calculateDeposit(total, depositPerc);
// //         const remaining = FinancialLogic.calculateRemaining(total, deposit);
// //         return {
// //             totalAmount: total,
// //             depositAmount: deposit,
// //             remainingAmount: remaining,
// //             currency: booking?.currency || effectiveTrip?.currency || 'USD',
// //             depositPercentage: depositPerc,
// //         };
// //     }, [effectiveTrip, booking]);

// //     const handleCopyPayment = async () => {
// //         try {
// //             await navigator.clipboard.writeText(paymentDetailsText);
// //             toast({ title: t('copyPaymentSuccess') });
// //         } catch (error) {
// //             toast({ variant: 'destructive', title: 'تعذر نسخ تعليمات الدفع' });
// //         }
// //     };

// //     // --- Handle file selection ---
// //     // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     //     const file = e.target.files?.[0];
// //     //     if (!file) return;

// //     //     // Validate type & size (max 5MB)
// //     //     if (!file.type.startsWith('image/')) {
// //     //         toast({ variant: 'destructive', title: 'نوع الملف غير مدعوم', description: 'يرجى اختيار صورة فقط (JPG, PNG, ...)' });
// //     //         return;
// //     //     }
// //     //     if (file.size > 5 * 1024 * 1024) {
// //     //         toast({ variant: 'destructive', title: 'الصورة كبيرة جداً', description: 'الحد الأقصى لحجم الصورة هو 5MB' });
// //     //         return;
// //     //     }

// //     //     setReceiptFile(file);
// //     //     setReceiptPreview(URL.createObjectURL(file));
// //     // };

// //     // const handleRemoveReceipt = () => {
// //     //     setReceiptFile(null);
// //     //     setReceiptPreview(null);
// //     //     if (fileInputRef.current) fileInputRef.current.value = '';
// //     // };

// //     // --- Upload receipt & confirm ---
// //     const handleSubmit = async () => {
// //         if (!receiptFile) {
// //             toast({ variant: 'destructive', title: 'صورة الوصل مطلوبة', description: 'يرجى إرفاق صورة إيصال الدفع قبل التأكيد.' });
// //             return;
// //         }

// //         try {
// //             setIsUploading(true);
// //             const storage = getStorage();
// //             const storageRef = ref(storage, `payment-receipts/${user?.uid}/${Date.now()}-${receiptFile.name}`);
// //             await uploadBytes(storageRef, receiptFile);
// //             const downloadURL = await getDownloadURL(storageRef);
// //             onConfirm(downloadURL);
// //         } catch (error) {
// //             console.error('[PaymentDialog] Upload failed:', error);
// //             toast({ variant: 'destructive', title: 'فشل رفع الصورة', description: 'حدث خطأ أثناء رفع صورة الوصل. حاول مجدداً.' });
// //         } finally {
// //             setIsUploading(false);
// //         }
// //     };

// //     const isBusy = isUploading;

// //     return (
// //         <Dialog open={isOpen} onOpenChange={(open) => !isBusy && onOpenChange(open)}>
// //             <DialogContent className="sm:max-w-lg">
// //                 <DialogHeader>
// //                     <DialogTitle>{t('completeBookingTitle')}</DialogTitle>
// //                     <DialogDescription>
// //                         {t('completeBookingDesc')}
// //                     </DialogDescription>
// //                 </DialogHeader>

// //                 <ScrollArea className="max-h-[60vh] p-1 pr-4">
// //                     <div className="space-y-6">

// //                         {/* 1. Financial Summary */}
// //                         <div className="space-y-3">
// //                             <h3 className="font-semibold text-sm flex items-center gap-2">
// //                                 <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">1</span>
// //                                 {t('finalInvoice')}
// //                             </h3>
// //                             <Card className="bg-muted/50">
// //                                 <CardContent className="p-4 space-y-2 text-sm">
// //                                     <div className="flex justify-between text-muted-foreground">
// //                                         <span>{t('totalPrice')} ({booking?.seats || trip.passengers || 1} {t('seats')})</span>
// //                                         <span className="font-bold">{totalAmount.toFixed(2)} {currency}</span>
// //                                     </div>
// //                                     <Separator />
// //                                     <div className="flex justify-between font-bold text-lg pt-1 text-white ">
// //                                         <span className="flex items-center gap-2">
// //                                             <CreditCard className="inline-block h-5 w-5" />
// //                                             {t('depositRequired')} ({depositPercentage}%)
// //                                         </span>
// //                                         <span>{depositAmount.toFixed(2)} {currency}</span>
// //                                     </div>
// //                                     <div className="flex justify-between text-muted-foreground text-xs pt-1">
// //                                         <span className='flex justify-between gap-2 '>
// //                                             <Banknote className="inline-block ml-2 h-4 w-4" />
// //                                             {t('remaining')}
// //                                         </span>
// //                                         <span>{remainingAmount.toFixed(2)} {currency}</span>
// //                                     </div>
// //                                 </CardContent>
// //                             </Card>
// //                         </div>

// //                         {/* 2. Payment Instructions */}
// //                         <div className="space-y-3">
// //                             <div className="flex items-center justify-between gap-2">
// //                                 <h3 className="font-semibold text-sm flex items-center gap-2">
// //                                     <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">2</span>
// //                                     {t('paymentMethod')}
// //                                 </h3>
// //                                 <Button type="button" size="icon" variant="ghost" className="h-8 w-8" onClick={handleCopyPayment}>
// //                                     <Clipboard className="h-4 w-4" />
// //                                 </Button>
// //                             </div>
// //                             <div className="p-4 border rounded-lg bg-background">
// //                                 <p className="text-sm whitespace-pre-wrap leading-7">{paymentDetailsText}</p>
// //                             </div>
// //                         </div>

// //                         {/* 3. Receipt Upload */}
// //                         {/* <div className="space-y-3">
// //                             <h3 className="font-semibold text-sm flex items-center gap-2">
// //                                 <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">3</span>
// //                                 صورة إيصال الدفع
// //                             </h3>

// //                             {!receiptPreview ? (
// //                                 <button
// //                                     type="button"
// //                                     onClick={() => fileInputRef.current?.click()}
// //                                     className="w-full border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 flex flex-col items-center gap-3 hover:border-primary/50 hover:bg-muted/30 transition-colors"
// //                                 >
// //                                     <ImagePlus className="h-10 w-10 text-muted-foreground/50" />
// //                                     <div className="text-center">
// //                                         <p className="text-sm font-medium">اضغط لرفع صورة الوصل</p>
// //                                         <p className="text-xs text-muted-foreground mt-1">JPG, PNG — الحد الأقصى 5MB</p>
// //                                     </div>
// //                                 </button>
// //                             ) : (
// //                                 <div className="relative rounded-lg overflow-hidden border">
// //                                     <img
// //                                         src={receiptPreview}
// //                                         alt="صورة الوصل"
// //                                         className="w-full max-h-56 object-contain bg-muted/30"
// //                                     />
// //                                     <button
// //                                         type="button"
// //                                         onClick={handleRemoveReceipt}
// //                                         className="absolute top-2 left-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:opacity-90 transition-opacity"
// //                                     >
// //                                         <X className="h-4 w-4" />
// //                                     </button>
// //                                     <div className="absolute bottom-2 right-2 bg-green-600/90 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
// //                                         <CheckCircle2 className="h-3 w-3" />
// //                                         تم اختيار الصورة
// //                                     </div>
// //                                 </div>
// //                             )}

// //                             <input
// //                                 ref={fileInputRef}
// //                                 type="file"
// //                                 accept="image/*"
// //                                 className="hidden"
// //                                 onChange={handleFileChange}
// //                             />
// //                         </div> */}

// //                         {/* 4. Passenger Details READ-ONLY */}
// //                         {booking?.passengersDetails && booking.passengersDetails.length > 0 && (
// //                             <div className="space-y-3">
// //                                 <h3 className="font-semibold text-sm flex items-center gap-2">
// //                                     <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">4</span>
// //                                     {t('passengersData')} ({booking.passengersDetails.length})
// //                                 </h3>
// //                                 <div className="p-3 border rounded-lg space-y-2 bg-muted/30">
// //                                     <ul className="list-disc pr-4 space-y-1">
// //                                         {booking.passengersDetails.map((p, index) => (
// //                                             <li key={index} className="text-sm">{p.name} ({p.type === 'adult' ? t('adult') : t('child')})</li>
// //                                         ))}
// //                                     </ul>
// //                                 </div>
// //                             </div>
// //                         )}

// //                         <Alert variant="destructive" className="bg-black text-white border-destructive">
// //                             <Info className="h-4 w-4 !text-destructive" />
// //                             <AlertTitle className="font-bold !text-destructive">{t('importantNote')}</AlertTitle>
// //                             <AlertDescription className="text-xs !text-white/80">
// //                                 {t('importantNoteDesc')}
// //                             </AlertDescription>
// //                         </Alert>
// //                     </div>
// //                 </ScrollArea>

// //                 <DialogFooter className="gap-2 pt-4">
// //                     <Button
// //                         type="button"
// //                         variant="ghost"
// //                         onClick={() => onOpenChange(false)}
// //                         disabled={isBusy}
// //                     >
// //                         {t('cancel')}
// //                     </Button>
// //                     <Button
// //                         type="submit"
// //                         onClick={handleSubmit}
// //                         // disabled={isBusy || !receiptFile}
// //                         className="w-full sm:w-auto min-w-[180px]"
// //                     >
// //                         {isBusy ? (
// //                             <>
// //                                 <Loader2 className="ml-2 h-4 w-4 animate-spin" />
// //                                 {isUploading ? 'جاري رفع الوصل...' : t('confirming')}
// //                             </>
// //                         ) : (
// //                             <>
// //                                 <Send className="ml-2 h-4 w-4" />
// //                                 {t('confirmTransfer')}
// //                             </>
// //                         )}
// //                     </Button>
// //                 </DialogFooter>
// //             </DialogContent>
// //         </Dialog>
// //     );
// // }

// //=====================================

// 'use client';

// import {
//     Dialog,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
//     DialogDescription,
//     DialogFooter,
// } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { useMemo, useState, useRef } from 'react';
// import type { Trip, UserProfile, Booking, PaymentWallet } from '@/lib/data';
// import { Send, Loader2, CreditCard, Banknote, Info, ImagePlus, X, CheckCircle2, Clipboard } from 'lucide-react';
// import { useToast } from '@/hooks/use-toast';
// import { Card, CardContent } from '@/components/ui/card';
// import { Separator } from '@/components/ui/separator';
// import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
// import { useDoc, useFirestore } from '@/firebase';
// import { doc } from 'firebase/firestore';
// import { FinancialLogic } from '@/lib/financial-logic';
// import { useTranslations } from 'next-intl';
// import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import { useUser } from '@/firebase';

// interface BookingPaymentDialogProps {
//     isOpen: boolean;
//     onOpenChange: (isOpen: boolean) => void;
//     trip: Trip;
//     booking?: Booking | null;
//     onConfirm: (receiptUrl?: string) => void;
//     isProcessing?: boolean;
// }

// /**
//  * @component BookingPaymentDialog
//  * @description [SC-639-STERILIZED] Using FinancialLogic SSOT.
//  * [UPDATE]&#58; Replaced payment instructions with receipt image upload.
//  */
// export function BookingPaymentDialog({
//     isOpen,
//     onOpenChange,
//     trip,
//     booking,
//     onConfirm,
//     isProcessing = false
// }: BookingPaymentDialogProps) {
//     const { toast } = useToast();
//     const firestore = useFirestore();
//     const t = useTranslations('booking');
//     const { user } = useUser();

//     // --- Receipt Upload State ---
//     const [receiptFile, setReceiptFile] = useState<File | null>(null);
//     const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
//     const [isUploading, setIsUploading] = useState(false);
//     const fileInputRef = useRef<HTMLInputElement>(null);

//     const bookingTripRef = useMemo(() => {
//         if (!firestore || trip?.id || !booking?.tripId) return null;
//         return doc(firestore, 'trips', booking.tripId);
//     }, [firestore, trip?.id, booking?.tripId]);

//     const { data: bookingTrip } = useDoc<Trip>(bookingTripRef);
//     const effectiveTrip = trip?.id ? trip : bookingTrip;
//     const resolvedCarrierId = effectiveTrip?.carrierId || booking?.carrierId;

//     const carrierProfileRef = useMemo(() => {
//         if (!firestore || !resolvedCarrierId) return null;
//         return doc(firestore, 'users', resolvedCarrierId);
//     }, [firestore, resolvedCarrierId]);

//     const { data: carrierProfile } = useDoc<UserProfile>(carrierProfileRef);

//     const paymentWallets = useMemo<PaymentWallet[]>(() => {
//         if (booking?.paymentSnapshot?.length) return booking.paymentSnapshot;
//         return carrierProfile?.paymentWallets || [];
//     }, [booking?.paymentSnapshot, carrierProfile?.paymentWallets]);

//     const paymentDetailsText = useMemo(() => {
//         const lines: string[] = [];
//         const freeText = carrierProfile?.paymentInformation?.trim();

//         if (freeText) lines.push(freeText);

//         if (paymentWallets.length > 0) {
//             if (lines.length > 0) lines.push('');
//             lines.push(...paymentWallets.map((wallet) => {
//                 const provider = wallet.provider?.trim() || 'Payment';
//                 const account = wallet.accountNumber?.trim() || '—';
//                 const holder = wallet.holderName?.trim();
//                 return holder ? `${provider}: ${account} — ${holder}` : `${provider}: ${account}`;
//             }));
//         }

//         return lines.join('\n') || t('defaultPayment');
//     }, [carrierProfile?.paymentInformation, paymentWallets, t]);

//     const { totalAmount, depositAmount, remainingAmount, currency, depositPercentage } = useMemo(() => {
//         const total = booking?.totalPrice || (effectiveTrip?.price || 0) * (booking?.seats || 1);
//         const depositPerc = effectiveTrip?.depositPercentage || 20;
//         const deposit = FinancialLogic.calculateDeposit(total, depositPerc);
//         const remaining = FinancialLogic.calculateRemaining(total, deposit);
//         return {
//             totalAmount: total,
//             depositAmount: deposit,
//             remainingAmount: remaining,
//             currency: booking?.currency || effectiveTrip?.currency || 'USD',
//             depositPercentage: depositPerc,
//         };
//     }, [effectiveTrip, booking]);

//     const handleCopyPayment = async () => {
//         try {
//             await navigator.clipboard.writeText(paymentDetailsText);
//             toast({ title: t('copyPaymentSuccess') });
//         } catch (error) {
//             toast({ variant: 'destructive', title: 'تعذر نسخ تعليمات الدفع' });
//         }
//     };

//     // --- Handle file selection ---
//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (!file) return;

//         // Validate type & size (max 5MB)
//         if (!file.type.startsWith('image/')) {
//             toast({ variant: 'destructive', title: 'نوع الملف غير مدعوم', description: 'يرجى اختيار صورة فقط (JPG, PNG, ...)' });
//             return;
//         }
//         if (file.size > 5 * 1024 * 1024) {
//             toast({ variant: 'destructive', title: 'الصورة كبيرة جداً', description: 'الحد الأقصى لحجم الصورة هو 5MB' });
//             return;
//         }

//         setReceiptFile(file);
//         setReceiptPreview(URL.createObjectURL(file));
//     };

//     const handleRemoveReceipt = () => {
//         setReceiptFile(null);
//         setReceiptPreview(null);
//         if (fileInputRef.current) fileInputRef.current.value = '';
//     };

//     // --- Upload receipt & confirm ---
//     const handleSubmit = () => {
//         // ✅ بدون رفع صورة — مباشرة تأكيد الدفع
//         onConfirm();
//     };

//     const isBusy = false;

//     return (
//         <Dialog open={isOpen} onOpenChange={(open) => !isBusy && onOpenChange(open)}>
//             <DialogContent className="sm:max-w-lg">
//                 <DialogHeader>
//                     <DialogTitle>{t('completeBookingTitle')}</DialogTitle>
//                     <DialogDescription>
//                         {t('completeBookingDesc')}
//                     </DialogDescription>
//                 </DialogHeader>

//                 <ScrollArea className="max-h-[60vh] p-1 pr-4">
//                     <div className="space-y-6">

//                         {/* 1. Financial Summary */}
//                         <div className="space-y-3">
//                             <h3 className="font-semibold text-sm flex items-center gap-2">
//                                 <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">1</span>
//                                 {t('finalInvoice')}
//                             </h3>
//                             <Card className="bg-muted/50">
//                                 <CardContent className="p-4 space-y-2 text-sm">
//                                     <div className="flex justify-between text-muted-foreground">
//                                         <span>{t('totalPrice')} ({booking?.seats || trip.passengers || 1} {t('seats')})</span>
//                                         <span className="font-bold">{totalAmount.toFixed(2)} {currency}</span>
//                                     </div>
//                                     <Separator />
//                                     <div className="flex justify-between font-bold text-lg pt-1 text-accent-foreground dark:text-accent">
//                                         <span className="flex items-center gap-2">
//                                             <CreditCard className="inline-block h-5 w-5" />
//                                             {t('depositRequired')} ({depositPercentage}%)
//                                         </span>
//                                         <span>{depositAmount.toFixed(2)} {currency}</span>
//                                     </div>
//                                     <div className="flex justify-between text-muted-foreground text-xs pt-1">
//                                         <span>
//                                             <Banknote className="inline-block ml-2 h-4 w-4" />
//                                             {t('remaining')}
//                                         </span>
//                                         <span>{remainingAmount.toFixed(2)} {currency}</span>
//                                     </div>
//                                 </CardContent>
//                             </Card>
//                         </div>

//                         {/* 2. Payment Instructions */}
//                         <div className="space-y-3">
//                             <div className="flex items-center justify-between gap-2">
//                                 <h3 className="font-semibold text-sm flex items-center gap-2">
//                                     <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">2</span>
//                                     {t('paymentMethod')}
//                                 </h3>
//                                 <Button type="button" size="icon" variant="ghost" className="h-8 w-8" onClick={handleCopyPayment}>
//                                     <Clipboard className="h-4 w-4" />
//                                 </Button>
//                             </div>
//                             <div className="p-4 border rounded-lg bg-background">
//                                 <p className="text-sm whitespace-pre-wrap leading-7">{paymentDetailsText}</p>
//                             </div>
//                         </div>

//                         {/* 3. Receipt Upload */}
//                         {/* <div className="space-y-3">
//                             <h3 className="font-semibold text-sm flex items-center gap-2">
//                                 <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">3</span>
//                                 صورة إيصال الدفع
//                             </h3>

//                             {!receiptPreview ? (
//                                 <button
//                                     type="button"
//                                     onClick={() => fileInputRef.current?.click()}
//                                     className="w-full border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 flex flex-col items-center gap-3 hover:border-primary/50 hover:bg-muted/30 transition-colors"
//                                 >
//                                     <ImagePlus className="h-10 w-10 text-muted-foreground/50" />
//                                     <div className="text-center">
//                                         <p className="text-sm font-medium">اضغط لرفع صورة الوصل</p>
//                                         <p className="text-xs text-muted-foreground mt-1">JPG, PNG — الحد الأقصى 5MB</p>
//                                     </div>
//                                 </button>
//                             ) : (
//                                 <div className="relative rounded-lg overflow-hidden border">
//                                     <img
//                                         src={receiptPreview}
//                                         alt="صورة الوصل"
//                                         className="w-full max-h-56 object-contain bg-muted/30"
//                                     />
//                                     <button
//                                         type="button"
//                                         onClick={handleRemoveReceipt}
//                                         className="absolute top-2 left-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:opacity-90 transition-opacity"
//                                     >
//                                         <X className="h-4 w-4" />
//                                     </button>
//                                     <div className="absolute bottom-2 right-2 bg-green-600/90 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
//                                         <CheckCircle2 className="h-3 w-3" />
//                                         تم اختيار الصورة
//                                     </div>
//                                 </div>
//                             )}

//                             <input
//                                 ref={fileInputRef}
//                                 type="file"
//                                 accept="image/*"
//                                 className="hidden"
//                                 onChange={handleFileChange}
//                             />
//                         </div> */}

//                         {/* 4. Passenger Details READ-ONLY */}
//                         {booking?.passengersDetails && booking.passengersDetails.length > 0 && (
//                             <div className="space-y-3">
//                                 <h3 className="font-semibold text-sm flex items-center gap-2">
//                                     <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">4</span>
//                                     {t('passengersData')} ({booking.passengersDetails.length})
//                                 </h3>
//                                 <div className="p-3 border rounded-lg space-y-2 bg-muted/30">
//                                     <ul className="list-disc pr-4 space-y-1">
//                                         {booking.passengersDetails.map((p, index) => (
//                                             <li key={index} className="text-sm">{p.name} ({p.type === 'adult' ? t('adult') : t('child')})</li>
//                                         ))}
//                                     </ul>
//                                 </div>
//                             </div>
//                         )}

//                         <Alert variant="destructive" className="bg-black text-white border-destructive">
//                             <Info className="h-4 w-4 !text-destructive" />
//                             <AlertTitle className="font-bold !text-destructive">{t('importantNote')}</AlertTitle>
//                             <AlertDescription className="text-xs !text-white/80">
//                                 {t('importantNoteDesc')}
//                             </AlertDescription>
//                         </Alert>
//                     </div>
//                 </ScrollArea>

//                 <DialogFooter className="gap-2 pt-4">
//                     <Button
//                         type="button"
//                         variant="ghost"
//                         onClick={() => onOpenChange(false)}
//                         disabled={isBusy}
//                     >
//                         {t('cancel')}
//                     </Button>
//                     <Button
//                         type="submit"
//                         onClick={handleSubmit}
//                         disabled={isBusy}
//                         className="w-full sm:w-auto min-w-[180px]"
//                     >
//                         {isBusy ? (
//                             <>
//                                 <Loader2 className="ml-2 h-4 w-4 animate-spin" />
//                                 {isUploading ? 'جاري رفع الوصل...' : t('confirming')}
//                             </>
//                         ) : (
//                             <>
//                                 <Send className="ml-2 h-4 w-4" />
//                                 {t('confirmTransfer')}
//                             </>
//                         )}
//                     </Button>
//                 </DialogFooter>
//             </DialogContent>
//         </Dialog>
//     );
// }

// 'use client';

// import {
//     Dialog,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
//     DialogDescription,
//     DialogFooter,
// } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { useMemo, useState, useRef } from 'react';
// import type { Trip, UserProfile, Booking, PaymentWallet } from '@/lib/data';
// import { Send, Loader2, CreditCard, Banknote, Info, ImagePlus, X, CheckCircle2, Clipboard } from 'lucide-react';
// import { useToast } from '@/hooks/use-toast';
// import { Card, CardContent } from '@/components/ui/card';
// import { Separator } from '@/components/ui/separator';
// import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
// import { useDoc, useFirestore } from '@/firebase';
// import { doc } from 'firebase/firestore';
// import { FinancialLogic } from '@/lib/financial-logic';
// import { useTranslations } from 'next-intl';
// import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import { useUser } from '@/firebase';

// interface BookingPaymentDialogProps {
//     isOpen: boolean;
//     onOpenChange: (isOpen: boolean) => void;
//     trip: Trip;
//     booking?: Booking | null;
//     onConfirm: (receiptUrl?: string) => void;
//     isProcessing?: boolean;
// }

// /**
//  * @component BookingPaymentDialog
//  * @description [SC-639-STERILIZED] Using FinancialLogic SSOT.
//  * [UPDATE]&#58; Replaced payment instructions with receipt image upload.
//  */
// export function BookingPaymentDialog({
//     isOpen,
//     onOpenChange,
//     trip,
//     booking,
//     onConfirm,
//     isProcessing = false
// }: BookingPaymentDialogProps) {
//     const { toast } = useToast();
//     const firestore = useFirestore();
//     const t = useTranslations('booking');
//     const { user } = useUser();

//     // --- Receipt Upload State ---
//     const [receiptFile, setReceiptFile] = useState<File | null>(null);
//     const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
//     const [isUploading, setIsUploading] = useState(false);
//     const fileInputRef = useRef<HTMLInputElement>(null);

//     const bookingTripRef = useMemo(() => {
//         if (!firestore || trip?.id || !booking?.tripId) return null;
//         return doc(firestore, 'trips', booking.tripId);
//     }, [firestore, trip?.id, booking?.tripId]);

//     const { data: bookingTrip } = useDoc<Trip>(bookingTripRef);
//     const effectiveTrip = trip?.id ? trip : bookingTrip;
//     const resolvedCarrierId = effectiveTrip?.carrierId || booking?.carrierId;

//     const carrierProfileRef = useMemo(() => {
//         if (!firestore || !resolvedCarrierId) return null;
//         return doc(firestore, 'users', resolvedCarrierId);
//     }, [firestore, resolvedCarrierId]);

//     const { data: carrierProfile } = useDoc<UserProfile>(carrierProfileRef);

//     const paymentWallets = useMemo<PaymentWallet[]>(() => {
//         if (booking?.paymentSnapshot?.length) return booking.paymentSnapshot;
//         return carrierProfile?.paymentWallets || [];
//     }, [booking?.paymentSnapshot, carrierProfile?.paymentWallets]);

//     const paymentDetailsText = useMemo(() => {
//         const lines: string[] = [];
//         const freeText = carrierProfile?.paymentInformation?.trim();

//         if (freeText) lines.push(freeText);

//         if (paymentWallets.length > 0) {
//             if (lines.length > 0) lines.push('');
//             lines.push(...paymentWallets.map((wallet) => {
//                 const provider = wallet.provider?.trim() || 'Payment';
//                 const account = wallet.accountNumber?.trim() || '—';
//                 const holder = wallet.holderName?.trim();
//                 return holder ? `${provider}: ${account} — ${holder}` : `${provider}: ${account}`;
//             }));
//         }

//         return lines.join('\n') || t('defaultPayment');
//     }, [carrierProfile?.paymentInformation, paymentWallets, t]);

//     const { totalAmount, depositAmount, remainingAmount, currency, depositPercentage } = useMemo(() => {
//         const total = booking?.totalPrice || (effectiveTrip?.price || 0) * (booking?.seats || 1);
//         const depositPerc = effectiveTrip?.depositPercentage ?? 0;
//         const deposit = FinancialLogic.calculateDeposit(total, depositPerc);
//         const remaining = FinancialLogic.calculateRemaining(total, deposit);
//         return {
//             totalAmount: total,
//             depositAmount: deposit,
//             remainingAmount: remaining,
//             currency: booking?.currency || effectiveTrip?.currency || 'USD',
//             depositPercentage: depositPerc,
//         };
//     }, [effectiveTrip, booking]);

//     const handleCopyPayment = async () => {
//         try {
//             await navigator.clipboard.writeText(paymentDetailsText);
//             toast({ title: t('copyPaymentSuccess') });
//         } catch (error) {
//             toast({ variant: 'destructive', title: 'تعذر نسخ تعليمات الدفع' });
//         }
//     };

//     // --- Handle file selection ---
//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (!file) return;

//         // Validate type & size (max 5MB)
//         if (!file.type.startsWith('image/')) {
//             toast({ variant: 'destructive', title: 'نوع الملف غير مدعوم', description: 'يرجى اختيار صورة فقط (JPG, PNG, ...)' });
//             return;
//         }
//         if (file.size > 5 * 1024 * 1024) {
//             toast({ variant: 'destructive', title: 'الصورة كبيرة جداً', description: 'الحد الأقصى لحجم الصورة هو 5MB' });
//             return;
//         }

//         setReceiptFile(file);
//         setReceiptPreview(URL.createObjectURL(file));
//     };

//     const handleRemoveReceipt = () => {
//         setReceiptFile(null);
//         setReceiptPreview(null);
//         if (fileInputRef.current) fileInputRef.current.value = '';
//     };

//     // --- Upload receipt & confirm ---
//     const handleSubmit = () => {
//         // ✅ بدون رفع صورة — مباشرة تأكيد الدفع
//         onConfirm();
//     };

//     const isBusy = false;

//     return (
//         <Dialog open={isOpen} onOpenChange={(open) => !isBusy && onOpenChange(open)}>
//             <DialogContent className="sm:max-w-lg border border-[#BEAD77]">
//                 <DialogHeader>
//                     <DialogTitle>{t('completeBookingTitle')}</DialogTitle>
//                     <DialogDescription>
//                         {t('completeBookingDesc')}
//                     </DialogDescription>
//                 </DialogHeader>

//                 <ScrollArea className="max-h-[60vh] p-1 pr-4">
//                     <div className="space-y-6">

//                         {/* 1. Financial Summary */}
//                         <div className="space-y-3">
//                             <h3 className="font-semibold text-sm flex items-center gap-2 " dir='ltr'>
//                                 <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">1</span>
//                                 {t('finalInvoice')}
//                             </h3>
//                             <Card className="bg-[#1F0A0E] border border-[#BEAD77]">
//                                 <CardContent className="p-4 space-y-2 text-sm">
//                                     <div className="flex justify-between text-white">
//                                         <span className="font-bold">{totalAmount.toFixed(2)} {currency}</span>
//                                         <span>{t('totalPrice')} ({booking?.seats || trip.passengers || 1} {t('seats')})</span>
//                                     </div>
//                                     <Separator />
//                                     <div className="flex justify-between font-bold text-lg pt-1 text-[#BEAD77]">
//                                         <span>{depositAmount.toFixed(2)} {currency}</span>
//                                         <span className="flex items-center gap-2">
//                                             {t('depositRequired')} ({depositPercentage}%)
//                                             <CreditCard className="inline-block h-5 w-5" />
//                                         </span>
//                                     </div>
//                                     <div className="flex justify-between text-white text-xs pt-1">
//                                         <span>{remainingAmount.toFixed(2)} {currency}</span>
//                                         <span>
//                                             {t('remaining')}
//                                             <Banknote className="inline-block ml-2 h-4 w-4" />
//                                         </span>
//                                     </div>
//                                 </CardContent>
//                             </Card>
//                         </div>

//                         {/* 2. Payment Instructions */}
//                         <div className="space-y-3">
//                             <div className="flex items-center justify-between gap-2">
//                                 <h3 className="font-semibold text-sm flex items-center gap-2">
//                                     <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">2</span>
//                                     {t('paymentMethod')}
//                                 </h3>
//                                 <Button type="button" size="icon" variant="ghost" className="h-8 w-8" onClick={handleCopyPayment}>
//                                     <Clipboard className="h-4 w-4" />
//                                 </Button>
//                             </div>
//                             <div className="p-4 border rounded-lg bg-[#1F0A0E] border-[#BEAD77]">
//                                 <p className="text-sm whitespace-pre-wrap leading-7">{paymentDetailsText}</p>
//                             </div>
//                         </div>
//                         {/* 3. Passenger Details READ-ONLY */}
//                         {booking?.passengersDetails && booking.passengersDetails.length > 0 && (
//                             <div className="space-y-3">
//                                 <h3 className="font-semibold text-sm flex items-center gap-2">
//                                     <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">4</span>
//                                     {t('passengersData')} ({booking.passengersDetails.length})
//                                 </h3>
//                                 <div className="p-3 border rounded-lg space-y-2 bg-[#1F0A0E] border-[#BEAD77]">
//                                     <ul className="list-disc pr-4 space-y-1 ">
//                                         {booking.passengersDetails.map((p, index) => (
//                                             <li key={index} className="text-sm">{p.name} ({p.type === 'adult' ? t('adult') : t('child')})</li>
//                                         ))}
//                                     </ul>
//                                 </div>
//                             </div>
//                         )}

//                         <Alert variant="destructive" className="bg-black text-white border-destructive">
//                             <Info className="h-4 w-4 !text-destructive" />
//                             <AlertTitle className="font-bold !text-destructive">{t('importantNote')}</AlertTitle>
//                             <AlertDescription className="text-xs !text-white/80">
//                                 {t('importantNoteDesc')}
//                             </AlertDescription>
//                         </Alert>
//                     </div>
//                 </ScrollArea>

//                 <DialogFooter className="gap-2 pt-4">
//                     <Button
//                         type="button"
//                         variant="ghost"
//                         onClick={() => onOpenChange(false)}
//                         disabled={isBusy}
//                     >
//                         {t('cancel')}
//                     </Button>
//                     <Button
//                         type="submit"
//                         onClick={handleSubmit}
//                         disabled={isBusy}
//                         className="w-full sm:w-auto min-w-[180px]"
//                     >
//                         {isBusy ? (
//                             <>
//                                 <Loader2 className="ml-2 h-4 w-4 animate-spin" />
//                                 {isUploading ? 'جاري رفع الوصل...' : t('confirming')}
//                             </>
//                         ) : (
//                             <>
//                                 <Send className="ml-2 h-4 w-4" />
//                                 {t('confirmTransfer')}
//                             </>
//                         )}
//                     </Button>
//                 </DialogFooter>
//             </DialogContent>
//         </Dialog>
//     );
// // }
// 'use client';

// import {
//     Dialog,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
//     DialogDescription,
//     DialogFooter,
// } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { useMemo, useState, useRef } from 'react';
// import type { Trip, UserProfile, Booking, PaymentWallet } from '@/lib/data';
// import { Send, Loader2, CreditCard, Banknote, Info, ImagePlus, X, CheckCircle2, Clipboard } from 'lucide-react';
// import { useToast } from '@/hooks/use-toast';
// import { Card, CardContent } from '@/components/ui/card';
// import { Separator } from '@/components/ui/separator';
// import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
// import { useDoc, useFirestore } from '@/firebase';
// import { doc } from 'firebase/firestore';
// import { FinancialLogic } from '@/lib/financial-logic';
// import { useTranslations } from 'next-intl';

// interface BookingPaymentDialogProps {
//     isOpen: boolean;
//     onOpenChange: (isOpen: boolean) => void;
//     trip: Trip;
//     booking?: Booking | null;
//     onConfirm: (receiptUrl?: string) => void;
//     isProcessing?: boolean;
// }

// /**
//  * @component BookingPaymentDialog
//  * @description [SC-639-STERILIZED] Using FinancialLogic SSOT.
//  */
// export function BookingPaymentDialog({
//     isOpen,
//     onOpenChange,
//     trip,
//     booking,
//     onConfirm,
//     isProcessing = false
// }: BookingPaymentDialogProps) {
//     const { toast } = useToast();
//     const firestore = useFirestore();
//     const t = useTranslations('booking');

//     // --- State ---
//     const fileInputRef = useRef<HTMLInputElement>(null);

//     const bookingTripRef = useMemo(() => {
//         if (!firestore || trip?.id || !booking?.tripId) return null;
//         return doc(firestore, 'trips', booking.tripId);
//     }, [firestore, trip?.id, booking?.tripId]);

//     const { data: bookingTrip } = useDoc<Trip>(bookingTripRef);
//     const effectiveTrip = trip?.id ? trip : bookingTrip;
//     const resolvedCarrierId = effectiveTrip?.carrierId || booking?.carrierId;

//     const carrierProfileRef = useMemo(() => {
//         if (!firestore || !resolvedCarrierId) return null;
//         return doc(firestore, 'users', resolvedCarrierId);
//     }, [firestore, resolvedCarrierId]);

//     const { data: carrierProfile } = useDoc<UserProfile>(carrierProfileRef);

//     const paymentWallets = useMemo<PaymentWallet[]>(() => {
//         if (booking?.paymentSnapshot?.length) return booking.paymentSnapshot;
//         return carrierProfile?.paymentWallets || [];
//     }, [booking?.paymentSnapshot, carrierProfile?.paymentWallets]);

//     const paymentDetailsText = useMemo(() => {
//         const lines: string[] = [];
//         const freeText = carrierProfile?.paymentInformation?.trim();

//         if (freeText) lines.push(freeText);

//         if (paymentWallets.length > 0) {
//             if (lines.length > 0) lines.push('');
//             lines.push(...paymentWallets.map((wallet) => {
//                 const provider = wallet.provider?.trim() || 'Payment';
//                 const account = wallet.accountNumber?.trim() || '—';
//                 const holder = wallet.holderName?.trim();
//                 return holder ? `${provider}: ${account} — ${holder}` : `${provider}: ${account}`;
//             }));
//         }

//         return lines.join('\n') || t('defaultPayment');
//     }, [carrierProfile?.paymentInformation, paymentWallets, t]);

//     const { totalAmount, depositAmount, remainingAmount, currency, depositPercentage } = useMemo(() => {
//         const total = booking?.totalPrice || (effectiveTrip?.price || 0) * (booking?.seats || 1);
//         const depositPerc = effectiveTrip?.depositPercentage ?? 0;
//         const deposit = FinancialLogic.calculateDeposit(total, depositPerc);
//         const remaining = FinancialLogic.calculateRemaining(total, deposit);
//         return {
//             totalAmount: total,
//             depositAmount: deposit,
//             remainingAmount: remaining,
//             currency: booking?.currency || effectiveTrip?.currency || 'USD',
//             depositPercentage: depositPerc,
//         };
//     }, [effectiveTrip, booking]);

//     const handleCopyPayment = async () => {
//         try {
//             await navigator.clipboard.writeText(paymentDetailsText);
//             toast({ title: t('copyPaymentSuccess') });
//         } catch (error) {
//             toast({ variant: 'destructive', title: t('copyPaymentError') });
//         }
//     };

//     const handleSubmit = () => {
//         onConfirm();
//     };

//     const isBusy = isProcessing;

//     return (
//         <Dialog open={isOpen} onOpenChange={(open) => !isBusy && onOpenChange(open)}>
//             {/* إزالة تحديد dir الثابت والاعتماد على اتجاه الصفحة الرئيسي أو الحاوية العليا */}
//             <DialogContent className="sm:max-w-lg border border-[#BEAD77] text-start">
//                 <DialogHeader>
//                     <DialogTitle>{t('completeBookingTitle')}</DialogTitle>
//                     <DialogDescription>
//                         {t('completeBookingDesc')}
//                     </DialogDescription>
//                 </DialogHeader>

//                 <ScrollArea className="max-h-[60vh] p-1 ltr:pr-4 rtl:pl-4">
//                     <div className="space-y-6">

//                         {/* 1. Financial Summary */}
//                         <div className="space-y-3">
//                             <h3 className="font-semibold text-sm flex items-center rtl:justify-end ltr:justify-start gap-2">
//                                 {t('finalInvoice')}
//                                 <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">1</span>
//                             </h3>
//                             <Card className="bg-[#1F0A0E] border border-[#BEAD77]">
//                                 <CardContent className="p-4 space-y-2 text-sm">
//                                     <div className="flex justify-between items-center text-white">
//                                         <span>{t('totalPrice')} ({booking?.seats || trip.passengers || 1} {t('seats')})</span>
//                                         <span className="font-bold">{totalAmount.toFixed(2)} {currency}</span>
//                                     </div>
//                                     <Separator />
//                                     <div className="flex justify-between items-center font-bold text-lg pt-1 text-[#BEAD77]">
//                                         <span className="flex items-center gap-2">
//                                             <CreditCard className="h-5 w-5" />
//                                             {t('depositRequired')} ({depositPercentage}%)
//                                         </span>
//                                         <span>{depositAmount.toFixed(2)} {currency}</span>
//                                     </div>
//                                     <div className="flex justify-between items-center text-white text-xs pt-1">
//                                         <span className="flex items-center gap-1">
//                                             <Banknote className="h-4 w-4" />
//                                             {t('remaining')}
//                                         </span>
//                                         <span>{remainingAmount.toFixed(2)} {currency}</span>
//                                     </div>
//                                 </CardContent>
//                             </Card>
//                         </div>

//                         {/* 2. Payment Instructions */}
//                         <div className="space-y-3">
//                             <div className="flex items-center justify-between  gap-2">
//                                 <h3 className="font-semibold text-sm flex items-center gap-2">
//                                     {t('paymentMethod')}
//                                     <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">2</span>
//                                 </h3>
//                                 <Button type="button" size="icon" variant="ghost" className="h-8 w-8" onClick={handleCopyPayment}>
//                                     <Clipboard className="h-4 w-4" />
//                                 </Button>
//                             </div>
//                             <div className="p-4 border rounded-lg bg-[#1F0A0E] border-[#BEAD77]">
//                                 <p className="text-sm whitespace-pre-wrap leading-7">{paymentDetailsText}</p>
//                             </div>
//                         </div>

//                         {/* 3. Passenger Details READ-ONLY */}
//                         {booking?.passengersDetails && booking.passengersDetails.length > 0 && (
//                             <div className="space-y-3">
//                                 <h3 className="font-semibold text-sm flex items-center rtl:justify-end ltr:justify-start gap-2">
//                                     {t('passengersData')} ({booking.passengersDetails.length})
//                                     <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">3</span>
//                                 </h3>
//                                 <div className="p-3 border rounded-lg space-y-2 bg-[#1F0A0E] border-[#BEAD77]">
//                                     <ul className="list-disc ltr:pl-4 rtl:pr-4 space-y-1">
//                                         {booking.passengersDetails.map((p, index) => (
//                                             <li key={index} className="text-sm">
//                                                 {p.name} ({p.type === 'adult' ? t('adult') : t('child')})
//                                             </li>
//                                         ))}
//                                     </ul>
//                                 </div>
//                             </div>
//                         )}

//                         <Alert variant="destructive" className="bg-black text-white border-destructive">
//                             <Info className="h-4 w-4 !text-destructive" />
//                             <AlertTitle className="font-bold !text-destructive">{t('importantNote')}</AlertTitle>
//                             <AlertDescription className="text-xs !text-white/80">
//                                 {t('importantNoteDesc')}
//                             </AlertDescription>
//                         </Alert>
//                     </div>
//                 </ScrollArea>

//                 <DialogFooter className="gap-2 pt-4">
//                     <Button
//                         type="button"
//                         variant="ghost"
//                         onClick={() => onOpenChange(false)}
//                         disabled={isBusy}
//                     >
//                         {t('cancel')}
//                     </Button>
//                     <Button
//                         type="submit"
//                         onClick={handleSubmit}
//                         disabled={isBusy}
//                         className="w-full sm:w-auto min-w-[180px] flex items-center justify-center gap-2"
//                     >
//                         {isBusy ? (
//                             <>
//                                 <Loader2 className="h-4 w-4 animate-spin" />
//                                 {t('confirming')}
//                             </>
//                         ) : (
//                             <>
//                                 <Send className="h-4 w-4 rtl:rotate-180" />
//                                 {t('confirmTransfer')}
//                             </>
//                         )}
//                     </Button>
//                 </DialogFooter>
//             </DialogContent>
//         </Dialog>
//     );
// }
// 'use client';

// import {
//     Dialog,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
//     DialogDescription,
//     DialogFooter,
// } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { useMemo } from 'react';
// import type { Trip, UserProfile, Booking, PaymentWallet } from '@/lib/data';
// import { Send, Loader2, CreditCard, Banknote, Info, Clipboard } from 'lucide-react';
// import { useToast } from '@/hooks/use-toast';
// import { Card, CardContent } from '@/components/ui/card';
// import { Separator } from '@/components/ui/separator';
// import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
// import { useDoc, useFirestore } from '@/firebase';
// import { doc } from 'firebase/firestore';
// import { FinancialLogic } from '@/lib/financial-logic';
// import { useTranslations } from 'next-intl';

// interface BookingPaymentDialogProps {
//     isOpen: boolean;
//     onOpenChange: (isOpen: boolean) => void;
//     trip: Trip;
//     booking?: Booking | null;
//     onConfirm: (receiptUrl?: string) => void;
//     isProcessing?: boolean;
// }

// /**
//  * @component BookingPaymentDialog
//  * @description [SC-639-STERILIZED] Using FinancialLogic SSOT with full i18n & RTL/LTR dynamic layout support.
//  */
// export function BookingPaymentDialog({
//     isOpen,
//     onOpenChange,
//     trip,
//     booking,
//     onConfirm,
//     isProcessing = false
// }: BookingPaymentDialogProps) {
//     const { toast } = useToast();
//     const firestore = useFirestore();
//     const t = useTranslations('booking');

//     const bookingTripRef = useMemo(() => {
//         if (!firestore || trip?.id || !booking?.tripId) return null;
//         return doc(firestore, 'trips', booking.tripId);
//     }, [firestore, trip?.id, booking?.tripId]);

//     const { data: bookingTrip } = useDoc<Trip>(bookingTripRef);
//     const effectiveTrip = trip?.id ? trip : bookingTrip;
//     const resolvedCarrierId = effectiveTrip?.carrierId || booking?.carrierId;

//     const carrierProfileRef = useMemo(() => {
//         if (!firestore || !resolvedCarrierId) return null;
//         return doc(firestore, 'users', resolvedCarrierId);
//     }, [firestore, resolvedCarrierId]);

//     const { data: carrierProfile } = useDoc<UserProfile>(carrierProfileRef);

//     const paymentWallets = useMemo<PaymentWallet[]>(() => {
//         if (booking?.paymentSnapshot?.length) return booking.paymentSnapshot;
//         return carrierProfile?.paymentWallets || [];
//     }, [booking?.paymentSnapshot, carrierProfile?.paymentWallets]);

//     const paymentDetailsText = useMemo(() => {
//         const lines: string[] = [];
//         const freeText = carrierProfile?.paymentInformation?.trim();

//         if (freeText) lines.push(freeText);

//         if (paymentWallets.length > 0) {
//             if (lines.length > 0) lines.push('');
//             lines.push(...paymentWallets.map((wallet) => {
//                 const provider = wallet.provider?.trim() || 'Payment';
//                 const account = wallet.accountNumber?.trim() || '—';
//                 const holder = wallet.holderName?.trim();
//                 return holder ? `${provider}: ${account} — ${holder}` : `${provider}: ${account}`;
//             }));
//         }

//         return lines.join('\n') || t('defaultPayment');
//     }, [carrierProfile?.paymentInformation, paymentWallets, t]);

//     const { totalAmount, depositAmount, remainingAmount, currency, depositPercentage } = useMemo(() => {
//         const total = booking?.totalPrice || (effectiveTrip?.price || 0) * (booking?.seats || 1);
//         const depositPerc = effectiveTrip?.depositPercentage ?? 0;
//         const deposit = FinancialLogic.calculateDeposit(total, depositPerc);
//         const remaining = FinancialLogic.calculateRemaining(total, deposit);
//         return {
//             totalAmount: total,
//             depositAmount: deposit,
//             remainingAmount: remaining,
//             currency: booking?.currency || effectiveTrip?.currency || 'USD',
//             depositPercentage: depositPerc,
//         };
//     }, [effectiveTrip, booking]);

//     const handleCopyPayment = async () => {
//         try {
//             await navigator.clipboard.writeText(paymentDetailsText);
//             toast({ title: t('copyPaymentSuccess') });
//         } catch (error) {
//             toast({ variant: 'destructive', title: t('copyPaymentError') });
//         }
//     };

//     const handleSubmit = () => {
//         onConfirm();
//     };

//     const isBusy = isProcessing;

//     return (
//         <Dialog open={isOpen} onOpenChange={(open) => !isBusy && onOpenChange(open)}>
//             {/* تم استخدام text-start وتجنب تحديد dir ليتكيف تلقائياً مع لغة الـ HTML أو الحاوية */}
//             <DialogContent className="sm:max-w-lg border border-[#BEAD77] text-start">
//                 <DialogHeader>
//                     <DialogTitle>{t('completeBookingTitle')}</DialogTitle>
//                     <DialogDescription>
//                         {t('completeBookingDesc')}
//                     </DialogDescription>
//                 </DialogHeader>

//                 {/* الحواشي الداخلية مرنة باستخدام ps (padding-start) و pe (padding-end) */}
//                 <ScrollArea className="max-h-[60vh] p-1 pe-4">
//                     <div className="space-y-6">

//                         {/* 1. Financial Summary */}
//                         <div className="space-y-3">
//                             <h3 className="font-semibold text-sm flex items-center gap-2 flex-row-reverse justify-end">
//                                 <span>{t('finalInvoice')}</span>
//                                 <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">1</span>
//                             </h3>
//                             <Card className="bg-[#1F0A0E] border border-[#BEAD77]">
//                                 <CardContent className="p-4 space-y-2 text-sm">
//                                     <div className="flex justify-between items-center text-white">
//                                         <span>{t('totalPrice')} ({booking?.seats || trip.passengers || 1} {t('seats')})</span>
//                                         <span className="font-bold">{totalAmount.toFixed(2)} {currency}</span>
//                                     </div>
//                                     <Separator />
//                                     <div className="flex justify-between items-center font-bold text-lg pt-1 text-[#BEAD77]">
//                                         <span className="flex items-center gap-2">
//                                             <CreditCard className="h-5 w-5" />
//                                             <span>{t('depositRequired')} ({depositPercentage}%)</span>
//                                         </span>
//                                         <span>{depositAmount.toFixed(2)} {currency}</span>
//                                     </div>
//                                     <div className="flex justify-between items-center text-white text-xs pt-1">
//                                         <span className="flex items-center gap-1">
//                                             <Banknote className="h-4 w-4" />
//                                             <span>{t('remaining')}</span>
//                                         </span>
//                                         <span>{remainingAmount.toFixed(2)} {currency}</span>
//                                     </div>
//                                 </CardContent>
//                             </Card>
//                         </div>

//                         {/* 2. Payment Instructions */}
//                         <div className="space-y-3">
//                             <div className="flex items-center justify-between gap-2">
//                                 <h3 className="font-semibold text-sm flex items-center gap-2 flex-row-reverse justify-end">
//                                     <span>{t('paymentMethod')}</span>
//                                     <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">2</span>
//                                 </h3>
//                                 <Button type="button" size="icon" variant="ghost" className="h-8 w-8" onClick={handleCopyPayment}>
//                                     <Clipboard className="h-4 w-4" />
//                                 </Button>
//                             </div>
//                             <div className="p-4 border rounded-lg bg-[#1F0A0E] border-[#BEAD77]">
//                                 <p className="text-sm whitespace-pre-wrap leading-7">{paymentDetailsText}</p>
//                             </div>
//                         </div>

//                         {/* 3. Passenger Details READ-ONLY */}
//                         {booking?.passengersDetails && booking.passengersDetails.length > 0 && (
//                             <div className="space-y-3">
//                                 <h3 className="font-semibold text-sm flex items-center gap-2 flex-row-reverse justify-end">
//                                     <span>{t('passengersData')} ({booking.passengersDetails.length})</span>
//                                     <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">3</span>
//                                 </h3>
//                                 <div className="p-3 border rounded-lg space-y-2 bg-[#1F0A0E] border-[#BEAD77]">
//                                     <ul className="list-disc ps-4 space-y-1">
//                                         {booking.passengersDetails.map((p, index) => (
//                                             <li key={index} className="text-sm">
//                                                 {p.name} ({p.type === 'adult' ? t('adult') : t('child')})
//                                             </li>
//                                         ))}
//                                     </ul>
//                                 </div>
//                             </div>
//                         )}

//                         <Alert variant="destructive" className="bg-black text-white border-destructive text-start">
//                             <Info className="h-4 w-4 !text-destructive" />
//                             <AlertTitle className="font-bold !text-destructive">{t('importantNote')}</AlertTitle>
//                             <AlertDescription className="text-xs !text-white/80">
//                                 {t('importantNoteDesc')}
//                             </AlertDescription>
//                         </Alert>
//                     </div>
//                 </ScrollArea>

//                 <DialogFooter className="gap-2 pt-4 sm:space-x-0">
//                     <Button
//                         type="button"
//                         variant="ghost"
//                         onClick={() => onOpenChange(false)}
//                         disabled={isBusy}
//                     >
//                         {t('cancel')}
//                     </Button>
//                     <Button
//                         type="submit"
//                         onClick={handleSubmit}
//                         disabled={isBusy}
//                         className="w-full sm:w-auto min-w-[180px] flex items-center justify-center gap-2"
//                     >
//                         {isBusy ? (
//                             <>
//                                 <Loader2 className="h-4 w-4 animate-spin" />
//                                 <span>{t('confirming')}</span>
//                             </>
//                         ) : (
//                             <>
//                                 <Send className="h-4 w-4 rtl:rotate-180" />
//                                 <span>{t('confirmTransfer')}</span>
//                             </>
//                         )}
//                     </Button>
//                 </DialogFooter>
//             </DialogContent>
//         </Dialog>
//     );
// }
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMemo } from 'react';
import type { Trip, UserProfile, Booking, PaymentWallet } from '@/lib/data';
import { Send, Loader2, CreditCard, Banknote, Info, Clipboard, Scale, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { FinancialLogic } from '@/lib/financial-logic';
import { useTranslations } from 'next-intl';

interface BookingPaymentDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    trip: Trip;
    booking?: Booking | null;
    onConfirm: (receiptUrl?: string) => void;
    isProcessing?: boolean;
}

/**
 * @component BookingPaymentDialog
 * @description [SC-639-STERILIZED] Using FinancialLogic SSOT with full i18n & RTL/LTR dynamic layout support.
 */
export function BookingPaymentDialog({
    isOpen,
    onOpenChange,
    trip,
    booking,
    onConfirm,
    isProcessing = false
}: BookingPaymentDialogProps) {
    const { toast } = useToast();
    const firestore = useFirestore();
    const t = useTranslations('booking');

    const bookingTripRef = useMemo(() => {
        if (!firestore || trip?.id || !booking?.tripId) return null;
        return doc(firestore, 'trips', booking.tripId);
    }, [firestore, trip?.id, booking?.tripId]);

    const { data: bookingTrip } = useDoc<Trip>(bookingTripRef);
    const effectiveTrip = trip?.id ? trip : bookingTrip;
    const resolvedCarrierId = effectiveTrip?.carrierId || booking?.carrierId;

    const carrierProfileRef = useMemo(() => {
        if (!firestore || !resolvedCarrierId) return null;
        return doc(firestore, 'users', resolvedCarrierId);
    }, [firestore, resolvedCarrierId]);

    const { data: carrierProfile } = useDoc<UserProfile>(carrierProfileRef);

    const paymentWallets = useMemo<PaymentWallet[]>(() => {
        if (booking?.paymentSnapshot?.length) return booking.paymentSnapshot;
        return carrierProfile?.paymentWallets || [];
    }, [booking?.paymentSnapshot, carrierProfile?.paymentWallets]);

    const paymentDetailsText = useMemo(() => {
        const lines: string[] = [];
        const freeText = carrierProfile?.paymentInformation?.trim();

        if (freeText) lines.push(freeText);

        if (paymentWallets.length > 0) {
            if (lines.length > 0) lines.push('');
            lines.push(...paymentWallets.map((wallet) => {
                const provider = wallet.provider?.trim() || 'Payment';
                const account = wallet.accountNumber?.trim() || '—';
                const holder = wallet.holderName?.trim();
                return holder ? `${provider}: ${account} — ${holder}` : `${provider}: ${account}`;
            }));
        }

        return lines.join('\n') || t('defaultPayment');
    }, [carrierProfile?.paymentInformation, paymentWallets, t]);

    const { totalAmount, depositAmount, remainingAmount, currency, depositPercentage } = useMemo(() => {
        const total = booking?.totalPrice || (effectiveTrip?.price || 0) * (booking?.seats || 1);
        const depositPerc = effectiveTrip?.depositPercentage ?? 0;
        const deposit = FinancialLogic.calculateDeposit(total, depositPerc);
        const remaining = FinancialLogic.calculateRemaining(total, deposit);
        return {
            totalAmount: total,
            depositAmount: deposit,
            remainingAmount: remaining,
            currency: booking?.currency || effectiveTrip?.currency || 'USD',
            depositPercentage: depositPerc,
        };
    }, [effectiveTrip, booking]);

    const handleCopyPayment = async () => {
        try {
            await navigator.clipboard.writeText(paymentDetailsText);
            toast({ title: t('copyPaymentSuccess') });
        } catch (error) {
            toast({ variant: 'destructive', title: t('copyPaymentError') });
        }
    };

    const handleSubmit = () => {
        onConfirm();
    };

    const isBusy = isProcessing;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !isBusy && onOpenChange(open)}>
            {/* تم استخدام text-start وتجنب تحديد dir ليتكيف تلقائياً مع لغة الـ HTML أو الحاوية */}
            <DialogContent className="sm:max-w-lg border border-[#BEAD77] text-start">
                <DialogHeader>
                    <DialogTitle>{t('completeBookingTitle')}</DialogTitle>
                    <DialogDescription>
                        {t('completeBookingDesc')}
                    </DialogDescription>
                </DialogHeader>

                {/* الحواشي الداخلية مرنة باستخدام ps (padding-start) و pe (padding-end) */}
                <ScrollArea className="max-h-[60vh] p-1 pe-4">
                    <div className="space-y-6">

                        {/* 1. Financial Summary */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-sm flex items-center gap-2 flex-row-reverse justify-end">
                                <span>{t('finalInvoice')}</span>
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">1</span>
                            </h3>
                            <Card className="bg-[#1F0A0E] border border-[#BEAD77]">
                                <CardContent className="p-4 space-y-2 text-sm">
                                    <div className="flex justify-between items-center text-white">
                                        <span>{t('totalPrice')} ({booking?.seats || trip.passengers || 1} {t('seats')})</span>
                                        <span className="font-bold">{totalAmount.toFixed(2)} {currency}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between items-center font-bold text-lg pt-1 text-[#BEAD77]">
                                        <span className="flex items-center gap-2">
                                            <CreditCard className="h-5 w-5" />
                                            <span>{t('depositRequired')} ({depositPercentage}%)</span>
                                        </span>
                                        <span>{depositAmount.toFixed(2)} {currency}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-white text-xs pt-1">
                                        <span className="flex items-center gap-1">
                                            <Banknote className="h-4 w-4" />
                                            <span>{t('remaining')}</span>
                                        </span>
                                        <span>{remainingAmount.toFixed(2)} {currency}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>



                        {/* 2. Payment Instructions */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between gap-2">
                                <h3 className="font-semibold text-sm flex items-center gap-2 flex-row-reverse justify-end">
                                    <span>{t('paymentMethod')}</span>
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">2</span>
                                </h3>
                                <Button type="button" size="icon" variant="ghost" className="h-8 w-8" onClick={handleCopyPayment}>
                                    <Clipboard className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="p-4 border rounded-lg bg-[#1F0A0E] border-[#BEAD77]">
                                <p className="text-sm whitespace-pre-wrap leading-7">{paymentDetailsText}</p>
                            </div>
                        </div>

                        {/* 3. Passenger Details READ-ONLY */}
                        {booking?.passengersDetails && booking.passengersDetails.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="font-semibold text-sm flex items-center gap-2 flex-row-reverse justify-end">
                                    <span>{t('passengersData')} ({booking.passengersDetails.length})</span>
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">3</span>
                                </h3>
                                <div className="p-3 border rounded-lg space-y-2 bg-[#1F0A0E] border-[#BEAD77]">
                                    <ul className="list-disc ps-4 space-y-1">
                                        {booking.passengersDetails.map((p, index) => (
                                            <li key={index} className="text-sm">
                                                {p.name} ({p.type === 'adult' ? t('adult') : t('child')})
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                        {/* شروط الناقل */}
                        {effectiveTrip?.conditions && (
                            <div className="bg-yellow-950/40 border border-[#AE9E6D] rounded-2xl px-3 py-2.5 flex justify-between items-center space-y-1">
                                <span className="flex items-center gap-1.5 flex-row-reverse justify-end text-yellow-400 text-xs font-black">
                                    <span>{t('carrierConditions')}</span>
                                    <AlertTriangle className="h-3.5 w-3.5" />
                                </span>
                                <p className="text-yellow-200 text-xs font-semibold whitespace-pre-wrap leading-relaxed">
                                    {effectiveTrip.conditions}
                                </p>
                            </div>
                        )}
                        {/* رسوم الوزن الزائد المحددة من الناقل */}
                        {effectiveTrip?.excessWeightFee != null && effectiveTrip.excessWeightFee > 0 && (
                            <div className="flex justify-between items-center bg-orange-950/40 border border-[#AE9E6D] rounded-2xl px-3 py-2.5">
                                <span className="flex items-center gap-1.5 flex-row-reverse text-orange-400 text-xs font-bold">
                                    <span>{t('excessWeightFee')}</span>
                                    <Scale className="h-3.5 w-3.5" />
                                </span>
                                <span className="text-orange-300 font-mono text-xs font-bold">
                                    {effectiveTrip.excessWeightFee} {effectiveTrip.currency || currency} / {t('kg')}
                                </span>
                            </div>
                        )}


                        <Alert variant="destructive" className="bg-black text-white border-destructive text-start">
                            <Info className="h-4 w-4 !text-destructive" />
                            <AlertTitle className="font-bold !text-destructive">{t('importantNote')}</AlertTitle>
                            <AlertDescription className="text-xs !text-white/80">
                                {t('importantNoteDesc')}
                            </AlertDescription>
                        </Alert>
                    </div>
                </ScrollArea>

                <DialogFooter className="gap-2 pt-4 sm:space-x-0">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        disabled={isBusy}
                    >
                        {t('cancel')}
                    </Button>
                    <Button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isBusy}
                        className="w-full sm:w-auto min-w-[180px] flex items-center justify-center gap-2"
                    >
                        {isBusy ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>{t('confirming')}</span>
                            </>
                        ) : (
                            <>
                                <Send className="h-4 w-4 rtl:rotate-180" />
                                <span>{t('confirmTransfer')}</span>
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
