// // // 'use client';

// // // import {
// // //     Dialog,
// // //     DialogContent,
// // //     DialogHeader,
// // //     DialogTitle,
// // //     DialogDescription,
// // //     DialogFooter,
// // // } from '@/components/ui/dialog';
// // // import { Button } from '@/components/ui/button';
// // // import { Input } from '@/components/ui/input';
// // // import { Label } from '@/components/ui/label';
// // // import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
// // // import { ScrollArea } from '@/components/ui/scroll-area';
// // // import { useState, useEffect } from 'react';
// // // import type { Trip, PassengerDetails } from '@/lib/data';
// // // import { Send, Loader2, ArrowRight } from 'lucide-react';
// // // import { useToast } from '@/hooks/use-toast';
// // // import { Checkbox } from '@/components/ui/checkbox';
// // // import { useTranslations } from 'next-intl';

// // // export type { PassengerDetails };

// // // interface BookingDialogProps {
// // //     isOpen: boolean;
// // //     onOpenChange: (isOpen: boolean) => void;
// // //     trip: Trip;
// // //     seatCount: number;
// // //     onSubmit: (passengers: PassengerDetails[]) => Promise<void> | void;
// // //     submitLabel?: string;
// // //     prefillPassengers?: PassengerDetails[];
// // //     isProcessing?: boolean;
// // // }

// // // /**
// // //  * @component BookingDialog
// // //  * @description THE IDENTITY ENFORCER (SC-527)
// // //  * Strictly mandates documentNumber entry.
// // //  */
// // // export function BookingDialog({
// // //     isOpen,
// // //     onOpenChange,
// // //     trip,
// // //     seatCount,
// // //     onSubmit,
// // //     submitLabel,
// // //     prefillPassengers,
// // //     isProcessing = false,
// // // }: BookingDialogProps) {

// // //     const t = useTranslations('bookingDialog');
// // //     const { toast } = useToast();

// // //     const [passengers, setPassengers] = useState<PassengerDetails[]>([]);
// // //     const [isSubmitting, setIsSubmitting] = useState(false);
// // //     const [isAgreed, setIsAgreed] = useState(false);

// // //     const isLoading = isProcessing || isSubmitting;

// // //     useEffect(() => {
// // //         if (isOpen) {
// // //             if (prefillPassengers && prefillPassengers.length > 0) {
// // //                 setPassengers(prefillPassengers);
// // //                 setIsAgreed(true);
// // //             } else {
// // //                 setPassengers(
// // //                     Array.from({ length: seatCount }, () => ({
// // //                         name: '',
// // //                         nationality: '',
// // //                         documentNumber: '',
// // //                         type: 'adult'
// // //                     }))
// // //                 );
// // //                 setIsAgreed(false);
// // //             }
// // //         }
// // //     }, [isOpen, seatCount, prefillPassengers]);

// // //     const handlePassengerChange = (index: number, field: keyof PassengerDetails, value: string) => {
// // //         if (prefillPassengers) return;
// // //         setPassengers(prev => {
// // //             const newPassengers = [...prev];
// // //             newPassengers[index] = { ...newPassengers[index], [field]: value as any };
// // //             return newPassengers;
// // //         });
// // //     };

// // //     const handleConfirm = async () => {
// // //         // [SC-527] DICATATORIAL VALIDATION: documentNumber is mandatory
// // //         const allFilled = passengers.every(
// // //             p => p.name.trim() !== '' &&
// // //                 p.nationality.trim() !== '' &&
// // //                 p.documentNumber.trim() !== ''
// // //         );

// // //         if (!allFilled) {
// // //             toast({
// // //                 variant: 'destructive',
// // //                 title: t('errors.incompleteTitle'),
// // //                 description: t('errors.incompleteDescription'),
// // //             });
// // //             return;
// // //         }

// // //         setIsSubmitting(true);
// // //         try {
// // //             await onSubmit(passengers);
// // //         } catch (error) {
// // //             console.error(error);
// // //         } finally {
// // //             setIsSubmitting(false);
// // //         }
// // //     };

// // //     const isReadonly = !!prefillPassengers;
// // //     const buttonLabel = submitLabel ?? 'تأكيد الحجز';

// // //     return (
// // //         <Dialog open={isOpen} onOpenChange={(open) => !isLoading && onOpenChange(open)}>
// // //             <DialogContent className="sm:max-w-[480px]">

// // //                 <DialogHeader>
// // //                     <DialogTitle>{t('title')}</DialogTitle>
// // //                     <DialogDescription>
// // //                         {t('description', { seats: seatCount, origin: trip.origin, destination: trip.destination })}
// // //                     </DialogDescription>
// // //                 </DialogHeader>

// // //                 <ScrollArea className="max-h-[60vh] p-1 pr-4">
// // //                     <div className="space-y-6">
// // //                         {passengers.map((passenger, index) => (
// // //                             <div key={index} className="p-4 border rounded-lg space-y-4 bg-muted/30">
// // //                                 <Label className="font-bold text-primary">{t('passenger')} {index + 1}</Label>

// // //                                 <div className="grid gap-2">
// // //                                     <Label htmlFor={`name-${index}`}>{t('fullName')}</Label>
// // //                                     <Input
// // //                                         id={`name-${index}`}
// // //                                         placeholder={t('fullNamePlaceholder')}
// // //                                         value={passenger.name}
// // //                                         onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
// // //                                         disabled={isLoading || isReadonly}
// // //                                         className="bg-background"
// // //                                     />
// // //                                 </div>

// // //                                 <div className="grid grid-cols-2 gap-4">
// // //                                     <div className="grid gap-2">
// // //                                         <Label htmlFor={`nationality-${index}`}>{t('nationality')}</Label>
// // //                                         <Input
// // //                                             id={`nationality-${index}`}
// // //                                             placeholder={t('nationalityPlaceholder')}
// // //                                             value={passenger.nationality}
// // //                                             onChange={(e) => handlePassengerChange(index, 'nationality', e.target.value)}
// // //                                             disabled={isLoading || isReadonly}
// // //                                             className="bg-background"
// // //                                         />
// // //                                     </div>
// // //                                     <div className="grid gap-2">
// // //                                         <Label htmlFor={`document-${index}`}>{t('documentNumber')} *</Label>
// // //                                         <Input
// // //                                             id={`document-${index}`}
// // //                                             placeholder={t('documentPlaceholder')}
// // //                                             value={passenger.documentNumber}
// // //                                             onChange={(e) => handlePassengerChange(index, 'documentNumber', e.target.value)}
// // //                                             disabled={isLoading || isReadonly}
// // //                                             className="bg-background font-mono"
// // //                                         />
// // //                                     </div>
// // //                                 </div>

// // //                                 <div className="grid gap-2">
// // //                                     <Label>{t('passengerType')}</Label>
// // //                                     <RadioGroup
// // //                                         onValueChange={(value) => handlePassengerChange(index, 'type', value)}
// // //                                         value={passenger.type}
// // //                                         className="flex gap-4 pt-1"
// // //                                         disabled={isLoading || isReadonly}
// // //                                     >
// // //                                         <div className="flex items-center space-x-2 rtl:space-x-reverse">
// // //                                             <RadioGroupItem value="adult" id={`adult-${index}`} />
// // //                                             <Label htmlFor={`adult-${index}`} className="font-normal cursor-pointer">{t('types.adult')}</Label>
// // //                                         </div>
// // //                                         <div className="flex items-center space-x-2 rtl:space-x-reverse">
// // //                                             <RadioGroupItem value="minor" id={`minor-${index}`} />
// // //                                             <Label htmlFor={`minor-${index}`} className="font-normal cursor-pointer">{t('types.minor')}</Label>
// // //                                         </div>
// // //                                         <div className="flex items-center space-x-2 rtl:space-x-reverse">
// // //                                             <RadioGroupItem value="infant" id={`infant-${index}`} />
// // //                                             <Label htmlFor={`infant-${index}`} className="font-normal cursor-pointer">{t('types.infant')}</Label>
// // //                                         </div>
// // //                                     </RadioGroup>
// // //                                 </div>
// // //                             </div>
// // //                         ))}
// // //                     </div>
// // //                 </ScrollArea>

// // //                 <div className="my-4 p-3 bg-muted/40 rounded-md border border-dashed">
// // //                     <p className="text-xs font-semibold mb-1">{t('conditionsTitle')}</p>
// // //                     <p className="text-xs text-muted-foreground whitespace-pre-wrap max-h-20 overflow-y-auto">
// // //                         {trip.conditions || t('noConditions')}
// // //                     </p>
// // //                 </div>

// // //                 {!isReadonly && (
// // //                     <div className="flex items-center gap-2 mb-4">
// // //                         <Checkbox
// // //                             id="agreement"
// // //                             checked={isAgreed}
// // //                             onCheckedChange={(checked) => setIsAgreed(checked as boolean)}
// // //                             disabled={isLoading}
// // //                         />
// // //                         <label htmlFor="agreement" className="text-sm cursor-pointer select-none">
// // //                             {t('agreement')}
// // //                         </label>
// // //                     </div>
// // //                 )}

// // //                 <DialogFooter className="gap-2 sm:gap-0">
// // //                     <Button type="button" variant="secondary" onClick={() => onOpenChange(false)} disabled={isLoading}>
// // //                         {t('cancel')}
// // //                     </Button>

// // //                     <Button
// // //                         type="button"
// // //                         onClick={handleConfirm}
// // //                         disabled={isLoading || (!isReadonly && !isAgreed)}
// // //                         className="w-full sm:w-auto"
// // //                     >
// // //                         {isLoading ? (
// // //                             <><Loader2 className="ml-2 h-4 w-4 animate-spin" /> جاري المعالجة...</>
// // //                         ) : isReadonly ? (
// // //                             <><Send className="ml-2 h-4 w-4" /> {buttonLabel}</>
// // //                         ) : (
// // //                             <><ArrowRight className="ml-2 h-4 w-4" /> {buttonLabel}</>
// // //                         )}
// // //                     </Button>
// // //                 </DialogFooter>

// // //             </DialogContent>
// // //         </Dialog>
// // //     );
// // // }

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
// // import { Input } from '@/components/ui/input';
// // import { Label } from '@/components/ui/label';
// // import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
// // import { ScrollArea } from '@/components/ui/scroll-area';
// // import { useState, useEffect } from 'react';
// // import type { Trip, PassengerDetails } from '@/lib/data';
// // import { Send, Loader2, ArrowRight } from 'lucide-react';
// // import { useToast } from '@/hooks/use-toast';
// // import { Checkbox } from '@/components/ui/checkbox';
// // import { useTranslations } from 'next-intl';

// // export type { PassengerDetails };

// // interface BookingDialogProps {
// //     isOpen: boolean;
// //     onOpenChange: (isOpen: boolean) => void;
// //     trip: Trip;
// //     seatCount: number;
// //     onSubmit: (passengers: PassengerDetails[]) => Promise<void> | void;
// //     submitLabel?: string;
// //     prefillPassengers?: PassengerDetails[];
// //     isProcessing?: boolean;
// // }

// // export function BookingDialog({
// //     isOpen,
// //     onOpenChange,
// //     trip,
// //     seatCount,
// //     onSubmit,
// //     submitLabel,
// //     prefillPassengers,
// //     isProcessing = false,
// // }: BookingDialogProps) {

// //     const t = useTranslations('bookingDialog');
// //     const { toast } = useToast();

// //     const [passengers, setPassengers] = useState<PassengerDetails[]>([]);
// //     const [isSubmitting, setIsSubmitting] = useState(false);
// //     const [isAgreed, setIsAgreed] = useState(false);

// //     const isLoading = isProcessing || isSubmitting;

// //     useEffect(() => {
// //         if (isOpen) {
// //             if (prefillPassengers && prefillPassengers.length > 0) {
// //                 setPassengers(prefillPassengers);
// //                 setIsAgreed(true);
// //             } else {
// //                 setPassengers(
// //                     Array.from({ length: seatCount }, () => ({
// //                         name: '',
// //                         nationality: '',
// //                         documentNumber: '',
// //                         type: 'adult'
// //                     }))
// //                 );
// //                 setIsAgreed(false);
// //             }
// //         }
// //     }, [isOpen, seatCount, prefillPassengers]);

// //     const handlePassengerChange = (index: number, field: keyof PassengerDetails, value: string) => {
// //         if (prefillPassengers) return;
// //         setPassengers(prev => {
// //             const newPassengers = [...prev];
// //             newPassengers[index] = { ...newPassengers[index], [field]: value as any };
// //             return newPassengers;
// //         });
// //     };

// //     const handleConfirm = async () => {
// //         const allFilled = passengers.every(
// //             p => p.name.trim() !== '' &&
// //                 p.nationality.trim() !== '' &&
// //                 p.documentNumber.trim() !== ''
// //         );

// //         if (!allFilled) {
// //             toast({
// //                 variant: 'destructive',
// //                 title: t('errors.incompleteTitle'),
// //                 description: t('errors.incompleteDescription'),
// //             });
// //             return;
// //         }

// //         setIsSubmitting(true);
// //         try {
// //             await onSubmit(passengers);
// //         } catch (error) {
// //             console.error(error);
// //         } finally {
// //             setIsSubmitting(false);
// //         }
// //     };

// //     const isReadonly = !!prefillPassengers;
// //     const buttonLabel = submitLabel ?? 'تأكيد الحجز';

// //     return (
// //         <Dialog open={isOpen} onOpenChange={(open) => !isLoading && onOpenChange(open)}>
// //             {/* التعديل هنا لقفل النافذة ومنع الإغلاق العشوائي */}
// //             <DialogContent
// //                 className="sm:max-w-[480px]"
// //                 onPointerDownOutside={(e) => e.preventDefault()}
// //                 onInteractOutside={(e) => e.preventDefault()}
// //                 onEscapeKeyDown={(e) => e.preventDefault()}
// //             >

// //                 <DialogHeader>
// //                     <DialogTitle>{t('title')}</DialogTitle>
// //                     <DialogDescription>
// //                         {t('description', { seats: seatCount, origin: trip.origin, destination: trip.destination })}
// //                     </DialogDescription>
// //                 </DialogHeader>

// //                 <ScrollArea className="max-h-[60vh] p-1 pr-4">
// //                     <div className="space-y-6">
// //                         {passengers.map((passenger, index) => (
// //                             <div key={index} className="p-4 border rounded-lg space-y-4 bg-muted/30">
// //                                 <Label className="font-bold text-primary">{t('passenger')} {index + 1}</Label>

// //                                 <div className="grid gap-2">
// //                                     <Label htmlFor={`name-${index}`}>{t('fullName')}</Label>
// //                                     <Input
// //                                         id={`name-${index}`}
// //                                         placeholder={t('fullNamePlaceholder')}
// //                                         value={passenger.name}
// //                                         onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
// //                                         disabled={isLoading || isReadonly}
// //                                         className="bg-background"
// //                                     />
// //                                 </div>

// //                                 <div className="grid grid-cols-2 gap-4">
// //                                     <div className="grid gap-2">
// //                                         <Label htmlFor={`nationality-${index}`}>{t('nationality')}</Label>
// //                                         <Input
// //                                             id={`nationality-${index}`}
// //                                             placeholder={t('nationalityPlaceholder')}
// //                                             value={passenger.nationality}
// //                                             onChange={(e) => handlePassengerChange(index, 'nationality', e.target.value)}
// //                                             disabled={isLoading || isReadonly}
// //                                             className="bg-background"
// //                                         />
// //                                     </div>
// //                                     <div className="grid gap-2">
// //                                         <Label htmlFor={`document-${index}`}>{t('documentNumber')} *</Label>
// //                                         <Input
// //                                             id={`document-${index}`}
// //                                             placeholder={t('documentPlaceholder')}
// //                                             value={passenger.documentNumber}
// //                                             onChange={(e) => handlePassengerChange(index, 'documentNumber', e.target.value)}
// //                                             disabled={isLoading || isReadonly}
// //                                             className="bg-background font-mono"
// //                                         />
// //                                     </div>
// //                                 </div>

// //                                 <div className="grid gap-2">
// //                                     <Label>{t('passengerType')}</Label>
// //                                     <RadioGroup
// //                                         onValueChange={(value) => handlePassengerChange(index, 'type', value)}
// //                                         value={passenger.type}
// //                                         className="flex gap-4 pt-1"
// //                                         disabled={isLoading || isReadonly}
// //                                     >
// //                                         <div className="flex items-center space-x-2 rtl:space-x-reverse">
// //                                             <RadioGroupItem value="adult" id={`adult-${index}`} />
// //                                             <Label htmlFor={`adult-${index}`} className="font-normal cursor-pointer">{t('types.adult')}</Label>
// //                                         </div>
// //                                         <div className="flex items-center space-x-2 rtl:space-x-reverse">
// //                                             <RadioGroupItem value="minor" id={`minor-${index}`} />
// //                                             <Label htmlFor={`minor-${index}`} className="font-normal cursor-pointer">{t('types.minor')}</Label>
// //                                         </div>
// //                                         <div className="flex items-center space-x-2 rtl:space-x-reverse">
// //                                             <RadioGroupItem value="infant" id={`infant-${index}`} />
// //                                             <Label htmlFor={`infant-${index}`} className="font-normal cursor-pointer">{t('types.infant')}</Label>
// //                                         </div>
// //                                     </RadioGroup>
// //                                 </div>
// //                             </div>
// //                         ))}
// //                     </div>
// //                 </ScrollArea>

// //                 <div className="my-4 p-3 bg-muted/40 rounded-md border border-dashed">
// //                     <p className="text-xs font-semibold mb-1">{t('conditionsTitle')}</p>
// //                     <p className="text-xs text-muted-foreground whitespace-pre-wrap max-h-20 overflow-y-auto">
// //                         {trip.conditions || t('noConditions')}
// //                     </p>
// //                 </div>

// //                 {!isReadonly && (
// //                     <div className="flex items-center gap-2 mb-4">
// //                         <Checkbox
// //                             id="agreement"
// //                             checked={isAgreed}
// //                             onCheckedChange={(checked) => setIsAgreed(checked as boolean)}
// //                             disabled={isLoading}
// //                         />
// //                         <label htmlFor="agreement" className="text-sm cursor-pointer select-none">
// //                             {t('agreement')}
// //                         </label>
// //                     </div>
// //                 )}

// //                 <DialogFooter className="gap-2 sm:gap-0">
// //                     <Button type="button" variant="secondary" onClick={() => onOpenChange(false)} disabled={isLoading}>
// //                         {t('cancel')}
// //                     </Button>

// //                     <Button
// //                         type="button"
// //                         onClick={handleConfirm}
// //                         disabled={isLoading || (!isReadonly && !isAgreed)}
// //                         className="w-full sm:w-auto"
// //                     >
// //                         {isLoading ? (
// //                             <><Loader2 className="ml-2 h-4 w-4 animate-spin" /> جاري المعالجة...</>
// //                         ) : isReadonly ? (
// //                             <><Send className="ml-2 h-4 w-4" /> {buttonLabel}</>
// //                         ) : (
// //                             <><ArrowRight className="ml-2 h-4 w-4" /> {buttonLabel}</>
// //                         )}
// //                     </Button>
// //                 </DialogFooter>

// //             </DialogContent>
// //         </Dialog>
// //     );
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
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { useState, useEffect } from 'react';
// import type { Trip, PassengerDetails } from '@/lib/data';
// import { Send, Loader2, ArrowRight } from 'lucide-react';
// import { useToast } from '@/hooks/use-toast';
// import { Checkbox } from '@/components/ui/checkbox';
// import { useTranslations } from 'next-intl';

// export type { PassengerDetails };

// interface BookingDialogProps {
//     isOpen: boolean;
//     onOpenChange: (isOpen: boolean) => void;
//     trip: Trip;
//     seatCount: number;
//     onSubmit: (passengers: PassengerDetails[]) => Promise<void> | void;
//     submitLabel?: string;
//     prefillPassengers?: PassengerDetails[];
//     isProcessing?: boolean;
// }

// export function BookingDialog({
//     isOpen,
//     onOpenChange,
//     trip,
//     seatCount,
//     onSubmit,
//     submitLabel,
//     prefillPassengers,
//     isProcessing = false,
// }: BookingDialogProps) {

//     const t = useTranslations('bookingDialog');
//     const { toast } = useToast();

//     const [passengers, setPassengers] = useState<PassengerDetails[]>([]);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [isAgreed, setIsAgreed] = useState(false);

//     const isLoading = isProcessing || isSubmitting;

//     useEffect(() => {
//         if (isOpen) {
//             if (prefillPassengers && prefillPassengers.length > 0) {
//                 setPassengers(prefillPassengers);
//                 setIsAgreed(true);
//             } else {
//                 setPassengers(
//                     Array.from({ length: seatCount }, () => ({
//                         name: '',
//                         nationality: '',
//                         documentNumber: '',
//                         type: 'adult'
//                     }))
//                 );
//                 setIsAgreed(false);
//             }
//         }
//     }, [isOpen, seatCount, prefillPassengers]);

//     const handlePassengerChange = (index: number, field: keyof PassengerDetails, value: string) => {
//         if (prefillPassengers) return;
//         setPassengers(prev => {
//             const newPassengers = [...prev];
//             newPassengers[index] = { ...newPassengers[index], [field]: value as any };
//             return newPassengers;
//         });
//     };

//     const handleConfirm = async () => {
//         const allFilled = passengers.every(
//             p => p.name.trim() !== '' &&
//                 p.nationality.trim() !== '' &&
//                 p.documentNumber.trim() !== ''
//         );

//         if (!allFilled) {
//             toast({
//                 variant: 'destructive',
//                 title: t('errors.incompleteTitle'),
//                 description: t('errors.incompleteDescription'),
//             });
//             return;
//         }

//         setIsSubmitting(true);
//         try {
//             await onSubmit(passengers);
//         } catch (error) {
//             console.error(error);
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const isReadonly = !!prefillPassengers;
//     const buttonLabel = submitLabel ?? 'تأكيد الحجز';

//     return (
//         <Dialog open={isOpen} onOpenChange={(open) => !isLoading && onOpenChange(open)}>
//             {/* التعديل هنا لقفل النافذة ومنع الإغلاق العشوائي */}
//             <DialogContent
//                 className="sm:max-w-[480px]"
//                 onPointerDownOutside={(e) => e.preventDefault()}
//                 onInteractOutside={(e) => e.preventDefault()}
//                 onEscapeKeyDown={(e) => e.preventDefault()}
//             >

//                 <DialogHeader>
//                     <DialogTitle>{t('title')}</DialogTitle>
//                     <DialogDescription>
//                         {t('description', { seats: seatCount, origin: trip.origin, destination: trip.destination })}
//                     </DialogDescription>
//                 </DialogHeader>

//                 <ScrollArea className="max-h-[60vh] p-1 pr-4">
//                     <div className="space-y-6">
//                         {passengers.map((passenger, index) => (
//                             <div key={index} className="p-4 border rounded-lg space-y-4 bg-muted/30">
//                                 <Label className="font-bold text-primary">{t('passenger')} {index + 1}</Label>

//                                 <div className="grid gap-2">
//                                     <Label htmlFor={`name-${index}`}>{t('fullName')}</Label>
//                                     <Input
//                                         id={`name-${index}`}
//                                         placeholder={t('fullNamePlaceholder')}
//                                         value={passenger.name}
//                                         onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
//                                         disabled={isLoading || isReadonly}
//                                         className="bg-background"
//                                     />
//                                 </div>

//                                 <div className="grid grid-cols-2 gap-4">
//                                     <div className="grid gap-2">
//                                         <Label htmlFor={`nationality-${index}`}>{t('nationality')}</Label>
//                                         <Input
//                                             id={`nationality-${index}`}
//                                             placeholder={t('nationalityPlaceholder')}
//                                             value={passenger.nationality}
//                                             onChange={(e) => handlePassengerChange(index, 'nationality', e.target.value)}
//                                             disabled={isLoading || isReadonly}
//                                             className="bg-background"
//                                         />
//                                     </div>
//                                     <div className="grid gap-2">
//                                         <Label htmlFor={`document-${index}`}>{t('documentNumber')} *</Label>
//                                         <Input
//                                             id={`document-${index}`}
//                                             placeholder={t('documentPlaceholder')}
//                                             value={passenger.documentNumber}
//                                             onChange={(e) => handlePassengerChange(index, 'documentNumber', e.target.value)}
//                                             disabled={isLoading || isReadonly}
//                                             className="bg-background font-mono"
//                                         />
//                                     </div>
//                                 </div>

//                                 <div className="grid gap-2">
//                                     <Label>{t('passengerType')}</Label>
//                                     <RadioGroup
//                                         onValueChange={(value) => handlePassengerChange(index, 'type', value)}
//                                         value={passenger.type}
//                                         className="flex gap-4 pt-1"
//                                         disabled={isLoading || isReadonly}
//                                     >
//                                         <div className="flex items-center space-x-2 rtl:space-x-reverse">
//                                             <RadioGroupItem value="adult" id={`adult-${index}`} />
//                                             <Label htmlFor={`adult-${index}`} className="font-normal cursor-pointer">{t('types.adult')}</Label>
//                                         </div>
//                                         <div className="flex items-center space-x-2 rtl:space-x-reverse">
//                                             <RadioGroupItem value="minor" id={`minor-${index}`} />
//                                             <Label htmlFor={`minor-${index}`} className="font-normal cursor-pointer">{t('types.minor')}</Label>
//                                         </div>
//                                         <div className="flex items-center space-x-2 rtl:space-x-reverse">
//                                             <RadioGroupItem value="infant" id={`infant-${index}`} />
//                                             <Label htmlFor={`infant-${index}`} className="font-normal cursor-pointer">{t('types.infant')}</Label>
//                                         </div>
//                                     </RadioGroup>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </ScrollArea>

//                 <div className="my-4 p-3 bg-muted/40 rounded-md border border-dashed">
//                     <p className="text-xs font-semibold mb-1">{t('conditionsTitle')}</p>
//                     <p className="text-xs text-muted-foreground whitespace-pre-wrap max-h-20 overflow-y-auto">
//                         {trip.conditions || t('noConditions')}
//                     </p>
//                     {trip.excessWeightFee != null && trip.excessWeightFee > 0 && (
//                         <div className="mt-2 flex items-center gap-1.5 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-md px-2.5 py-1.5">
//                             <span className="text-orange-500 text-sm">⚖️</span>
//                             <p className="text-xs font-bold text-orange-700 dark:text-orange-400">
//                                 رسوم الوزن الزائد: {trip.excessWeightFee} {trip.currency || 'د.أ'} لكل كغ إضافي
//                             </p>
//                         </div>
//                     )}
//                 </div>

//                 {!isReadonly && (
//                     <div className="flex items-center gap-2 mb-4">
//                         <Checkbox
//                             id="agreement"
//                             checked={isAgreed}
//                             onCheckedChange={(checked) => setIsAgreed(checked as boolean)}
//                             disabled={isLoading}
//                         />
//                         <label htmlFor="agreement" className="text-sm cursor-pointer select-none">
//                             {t('agreement')}
//                         </label>
//                     </div>
//                 )}

//                 <DialogFooter className="gap-2 sm:gap-0">
//                     <Button type="button" variant="secondary" onClick={() => onOpenChange(false)} disabled={isLoading}>
//                         {t('cancel')}
//                     </Button>

//                     <Button
//                         type="button"
//                         onClick={handleConfirm}
//                         disabled={isLoading || (!isReadonly && !isAgreed)}
//                         className="w-full sm:w-auto"
//                     >
//                         {isLoading ? (
//                             <><Loader2 className="ml-2 h-4 w-4 animate-spin" /> جاري المعالجة...</>
//                         ) : isReadonly ? (
//                             <><Send className="ml-2 h-4 w-4" /> {buttonLabel}</>
//                         ) : (
//                             <><ArrowRight className="ml-2 h-4 w-4" /> {buttonLabel}</>
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState, useEffect } from 'react';
import type { Trip, PassengerDetails } from '@/lib/data';
import { Send, Loader2, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { useTranslations } from 'next-intl';

export type { PassengerDetails };

interface BookingDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    trip: Trip;
    seatCount: number;
    onSubmit: (passengers: PassengerDetails[]) => Promise<void> | void;
    submitLabel?: string;
    prefillPassengers?: PassengerDetails[];
    isProcessing?: boolean;
    /** أنواع الركاب المحددة مسبقاً من طلب المسافر (adult/minor/child/infant) */
    passengerTypes?: Array<'adult' | 'minor' | 'child' | 'infant'>;
}

export function BookingDialog({
    isOpen,
    onOpenChange,
    trip,
    seatCount,
    onSubmit,
    submitLabel,
    prefillPassengers,
    isProcessing = false,
    passengerTypes,
}: BookingDialogProps) {

    const t = useTranslations('bookingDialog');
    const { toast } = useToast();

    const [passengers, setPassengers] = useState<PassengerDetails[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAgreed, setIsAgreed] = useState(false);

    const isLoading = isProcessing || isSubmitting;

    useEffect(() => {
        if (isOpen) {
            if (prefillPassengers && prefillPassengers.length > 0) {
                setPassengers(prefillPassengers);
                setIsAgreed(true);
            } else {
                setPassengers(
                    Array.from({ length: seatCount }, (_, i) => ({
                        name: '',
                        nationality: '',
                        documentNumber: '',
                        // ✅ [FIX]: استخدام نوع الراكب المحدد مسبقاً من الطلب الأصلي
                        // ✅ [FIX]: نحوّل 'child' → 'minor' لأن request-dialog بيخزّن 'child' لكن booking-dialog بيستخدم 'minor'
                        type: (() => {
                            const t = passengerTypes?.[i] ?? 'adult';
                            return (t === 'child' ? 'minor' : t) as 'adult' | 'minor' | 'infant';
                        })(),
                    }))
                );
                setIsAgreed(false);
            }
        }
    }, [isOpen, seatCount, prefillPassengers, passengerTypes]);

    const handlePassengerChange = (index: number, field: keyof PassengerDetails, value: string) => {
        if (prefillPassengers) return;
        setPassengers(prev => {
            const newPassengers = [...prev];
            newPassengers[index] = { ...newPassengers[index], [field]: value as any };
            return newPassengers;
        });
    };

    const handleConfirm = async () => {
        const allFilled = passengers.every(
            p => p.name.trim() !== '' &&
                p.nationality.trim() !== '' &&
                p.documentNumber.trim() !== ''
        );

        if (!allFilled) {
            toast({
                variant: 'destructive',
                title: t('errors.incompleteTitle'),
                description: t('errors.incompleteDescription'),
            });
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit(passengers);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isReadonly = !!prefillPassengers;
    const buttonLabel = submitLabel ?? 'تأكيد الحجز';

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !isLoading && onOpenChange(open)}>
            {/* التعديل هنا لقفل النافذة ومنع الإغلاق العشوائي */}
            <DialogContent
                className="sm:max-w-[480px] border-[#BFAF78]"
                onPointerDownOutside={(e) => e.preventDefault()}
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >

                <DialogHeader>
                    <DialogTitle>{t('title')}</DialogTitle>
                    <DialogDescription>
                        {t('description', { seats: seatCount, origin: trip.origin, destination: trip.destination })}
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[60vh] p-1 pr-4">
                    <div className="space-y-6">
                        {passengers.map((passenger, index) => (
                            <div key={index} className="p-4 border border-[#BFAF78] rounded-lg space-y-4 bg-muted/30">
                                <Label className="font-bold text-primary">{t('passenger')} {index + 1}</Label>

                                <div className="grid gap-2">
                                    <Label htmlFor={`name-${index}`}>{t('fullName')}</Label>
                                    <Input
                                        id={`name-${index}`}
                                        placeholder={t('fullNamePlaceholder')}
                                        value={passenger.name}
                                        onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                                        disabled={isLoading || isReadonly}
                                        className="bg-background"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor={`nationality-${index}`}>{t('nationality')}</Label>
                                        <Input
                                            id={`nationality-${index}`}
                                            placeholder={t('nationalityPlaceholder')}
                                            value={passenger.nationality}
                                            onChange={(e) => handlePassengerChange(index, 'nationality', e.target.value)}
                                            disabled={isLoading || isReadonly}
                                            className="bg-background"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor={`document-${index}`}>{t('documentNumber')} *</Label>
                                        <Input
                                            id={`document-${index}`}
                                            placeholder={t('documentPlaceholder')}
                                            value={passenger.documentNumber}
                                            onChange={(e) => handlePassengerChange(index, 'documentNumber', e.target.value)}
                                            disabled={isLoading || isReadonly}
                                            className="bg-background font-mono"
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label>{t('passengerType')}</Label>
                                    <RadioGroup
                                        onValueChange={(value) => handlePassengerChange(index, 'type', value)}
                                        value={passenger.type}
                                        className="flex gap-4 pt-1"
                                        disabled={isLoading || isReadonly}
                                    >
                                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                            <RadioGroupItem value="adult" id={`adult-${index}`} />
                                            <Label htmlFor={`adult-${index}`} className="font-normal cursor-pointer">{t('types.adult')}</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                            <RadioGroupItem value="minor" id={`minor-${index}`} />
                                            <Label htmlFor={`minor-${index}`} className="font-normal cursor-pointer">{t('types.minor')}</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                            <RadioGroupItem value="infant" id={`infant-${index}`} />
                                            <Label htmlFor={`infant-${index}`} className="font-normal cursor-pointer">{t('types.infant')}</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                <div className="my-4 p-3 bg-[#251115] border-[#BFAF78]  rounded-md border border-dashed ms-3">
                    <div className="flex justify-between bg-yellow-950/40 border border-[#AE9E6D]  rounded-md px-3 py-2">
                        <p className="text-sm font-semibold mb-1">{t('conditionsTitle')}</p>
                        <p className="text-sm font-bold text-muted-foreground whitespace-pre-wrap max-h-20 overflow-y-auto">
                            {trip.conditions || t('noConditions')}
                        </p>
                    </div>
                    {trip.excessWeightFee != null && trip.excessWeightFee > 0 && (
                        <div className="mt-2 flex items-center justify-between gap-1.5 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-md px-2.5 py-1.5">
                            {/* <span className="text-orange-500 text-sm">⚖️</span> */}
                            <p className="text-sm font-semibold mb-1">
                                رسوم الوزن الزائد :
                            </p>
                            <p className="text-sm font-bold text-orange-700 dark:text-orange-400">{trip.excessWeightFee} {trip.currency || 'د.أ'} لكل كغ إضافي</p>
                        </div>
                    )}
                </div>

                {!isReadonly && (
                    <div className="flex items-center gap-2 mb-4">
                        <Checkbox
                            id="agreement"
                            checked={isAgreed}
                            onCheckedChange={(checked) => setIsAgreed(checked as boolean)}
                            disabled={isLoading}
                        />
                        <label htmlFor="agreement" className="text-sm cursor-pointer select-none">
                            {t('agreement')}
                        </label>
                    </div>
                )}

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button type="button" variant="secondary" onClick={() => onOpenChange(false)} disabled={isLoading}>
                        {t('cancel')}
                    </Button>

                    <Button
                        type="button"
                        onClick={handleConfirm}
                        disabled={isLoading || (!isReadonly && !isAgreed)}
                        className="w-full sm:w-auto"
                    >
                        {isLoading ? (
                            <><Loader2 className="ml-2 h-4 w-4 animate-spin" /> جاري المعالجة...</>
                        ) : isReadonly ? (
                            <><Send className="ml-2 h-4 w-4" /> {buttonLabel}</>
                        ) : (
                            <><ArrowRight className="ml-2 h-4 w-4" /> {buttonLabel}</>
                        )}
                    </Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    );
}