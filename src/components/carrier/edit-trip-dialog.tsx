// // // // 'use client';

// // // // import { useState, useEffect } from 'react';
// // // // import { useForm } from 'react-hook-form';
// // // // import { zodResolver } from '@hookform/resolvers/zod';
// // // // import { z } from 'zod';
// // // // import {
// // // //   Dialog,
// // // //   DialogContent,
// // // //   DialogHeader,
// // // //   DialogTitle,
// // // //   DialogDescription,
// // // //   DialogFooter,
// // // // } from '@/components/ui/dialog';
// // // // import {
// // // //   Form,
// // // //   FormControl,
// // // //   FormField,
// // // //   FormItem,
// // // //   FormLabel,
// // // //   FormMessage,
// // // // } from '@/components/ui/form';
// // // // import { Button } from '@/components/ui/button';
// // // // import { Input } from '@/components/ui/input';
// // // // import type { Trip } from '@/lib/data';
// // // // import { Loader2, Save, Calendar as CalendarIcon, AlertCircle, Facebook, Instagram, Video } from 'lucide-react';
// // // // import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
// // // // import { Calendar } from '@/components/ui/calendar';
// // // // import { cn } from '@/lib/utils';
// // // // import { format } from 'date-fns';
// // // // import { useTranslations } from 'next-intl';

// // // // interface EditTripDialogProps {
// // // //   isOpen: boolean;
// // // //   onOpenChange: (open: boolean) => void;
// // // //   trip: Trip | null;
// // // //   onConfirm: (trip: Trip, data: EditTripFormValues) => Promise<void>;
// // // // }

// // // // const editTripSchema = z.object({
// // // //   price: z.coerce.number().positive('السعر يجب أن يكون رقماً موجباً'),
// // // //   availableSeats: z.coerce.number().int().min(0, 'عدد المقاعد لا يمكن أن يكون سالباً'),
// // // //   departureDate: z.date({ required_error: 'تاريخ المغادرة مطلوب' }),
// // // //   facebookProfile: z.string().url('رابط فيسبوك غير صالح').optional().or(z.literal('')),
// // // //   instagramProfile: z.string().url('رابط إنستغرام غير صالح').optional().or(z.literal('')),
// // // //   tiktokProfile: z.string().url('رابط تيك توك غير صالح').optional().or(z.literal('')),
// // // // });

// // // // export type EditTripFormValues = z.infer<typeof editTripSchema>;

// // // // export function EditTripDialog({ isOpen, onOpenChange, trip, onConfirm }: EditTripDialogProps) {
// // // //   const [isSubmitting, setIsSubmitting] = useState(false);
// // // //   const t = useTranslations('editTripDialog')
// // // //   const form = useForm<EditTripFormValues>({
// // // //     resolver: zodResolver(editTripSchema),
// // // //     defaultValues: {
// // // //       price: 0,
// // // //       availableSeats: 0,
// // // //       facebookProfile: '',
// // // //       instagramProfile: '',
// // // //       tiktokProfile: '',
// // // //     },
// // // //   });

// // // //   useEffect(() => {
// // // //     if (trip && isOpen) {
// // // //       const departureDate = trip.departureDate
// // // //         ? (typeof (trip.departureDate as any).toDate === 'function'
// // // //           ? (trip.departureDate as any).toDate()
// // // //           : new Date(trip.departureDate))
// // // //         : new Date();

// // // //       form.reset({
// // // //         price: trip.price || 0,
// // // //         availableSeats: trip.availableSeats || 0,
// // // //         departureDate,
// // // //         facebookProfile: trip.facebookProfile || '',
// // // //         instagramProfile: trip.instagramProfile || '',
// // // //         tiktokProfile: trip.tiktokProfile || '',
// // // //       });
// // // //     }
// // // //   }, [trip, isOpen, form]);

// // // //   const onSubmit = async (data: EditTripFormValues) => {
// // // //     if (!trip) return;
// // // //     setIsSubmitting(true);
// // // //     try {
// // // //       await onConfirm(trip, data);
// // // //       onOpenChange(false);
// // // //     } catch (e) {
// // // //       console.error("[Sovereign Edit] Update Rupture:", e);
// // // //     } finally {
// // // //       setIsSubmitting(false);
// // // //     }
// // // //   };

// // // //   const bookedCount = trip ? (trip.vehicleCapacity || 0) - (trip.availableSeats || 0) : 0;

// // // //   return (
// // // //     <Dialog open={isOpen} onOpenChange={onOpenChange}>
// // // //       <DialogContent className="sm:max-w-md">
// // // //         <DialogHeader>
// // // //           <DialogTitle className="flex items-center gap-2 font-black pt-3"> {t('title')} </DialogTitle>
// // // //           <DialogDescription className="flex items-center gap-2  pt-2 text-xs font-bold">
// // // //             {t('desc')}
// // // //           </DialogDescription>
// // // //         </DialogHeader>

// // // //         {bookedCount > 0 && (
// // // //           <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-start gap-3 animate-in zoom-in">
// // // //             <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
// // // //             <div>
// // // //               <p className="text-[10px] font-black text-amber-800 uppercase"> {t('seatsWarningTitle')} </p>
// // // //               <p className="text-[11px] text-amber-700 font-bold">  {t('seatsWarningDesc', { count: bookedCount })}</p>
// // // //             </div>
// // // //           </div>
// // // //         )}

// // // //         <Form {...form}>
// // // //           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
// // // //             <FormField
// // // //               control={form.control}
// // // //               name="departureDate"
// // // //               render={({ field }) => (
// // // //                 <FormItem>
// // // //                   <FormLabel className="text-xs font-bold"> {t('date')} </FormLabel>
// // // //                   <Popover>
// // // //                     <PopoverTrigger asChild>
// // // //                       <FormControl>
// // // //                         <Button
// // // //                           variant={"outline"}
// // // //                           className={cn(
// // // //                             "w-full h-12 justify-between font-bold rounded-xl",
// // // //                             !field.value && "text-muted-foreground"
// // // //                           )}
// // // //                         >
// // // //                           {field.value && !isNaN(new Date(field.value).getTime())
// // // //                             ? format(new Date(field.value), "PPP")
// // // //                             : <span>{t('selectDate')} </span>
// // // //                           }
// // // //                           <CalendarIcon className="h-4 w-4 opacity-50" />
// // // //                         </Button>
// // // //                       </FormControl>
// // // //                     </PopoverTrigger>
// // // //                     <PopoverContent className="w-auto p-0 rounded-2xl" align="start">
// // // //                       <Calendar
// // // //                         mode="single"
// // // //                         selected={field.value}
// // // //                         onSelect={(date) => {
// // // //                           if (date) {
// // // //                             date.setHours(12, 0, 0, 0);
// // // //                             field.onChange(date);
// // // //                           }
// // // //                         }}
// // // //                         disabled={(date) => date < new Date()}
// // // //                       />
// // // //                     </PopoverContent>
// // // //                   </Popover>
// // // //                   <FormMessage />
// // // //                 </FormItem>
// // // //               )}
// // // //             />

// // // //             <div className="grid grid-cols-1 gap-4">
// // // //               <FormField
// // // //                 control={form.control}
// // // //                 name="price"
// // // //                 render={({ field }) => (
// // // //                   <FormItem>
// // // //                     <FormLabel className="text-xs font-bold">{t('price')} ({trip?.currency})</FormLabel>
// // // //                     <FormControl>
// // // //                       <Input type="number" {...field} className="h-12 bg-muted/20 font-black text-lg rounded-xl" />
// // // //                     </FormControl>
// // // //                     <FormMessage />
// // // //                   </FormItem>
// // // //                 )}
// // // //               />
// // // //             </div>



// // // //             <DialogFooter className="gap-2 sm:gap-0 pt-4">
// // // //               <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={isSubmitting}>{t('cancel')}</Button>
// // // //               <Button type="submit" disabled={isSubmitting} className="font-black h-12 shadow-lg rounded-xl px-8">
// // // //                 {isSubmitting ? (
// // // //                   <><Loader2 className="ml-2 h-4 w-4 animate-spin" /> {t('saving')}</>
// // // //                 ) : (
// // // //                   <><Save className="ml-2 h-4 w-4" />  {t('save')}</>
// // // //                 )}
// // // //               </Button>
// // // //             </DialogFooter>
// // // //           </form>
// // // //         </Form>
// // // //       </DialogContent>
// // // //     </Dialog>
// // // //   );
// // // // }
// // // 'use client';

// // // import { useState, useEffect } from 'react';
// // // import { useForm } from 'react-hook-form';
// // // import { zodResolver } from '@hookform/resolvers/zod';
// // // import { z } from 'zod';
// // // import {
// // //   Dialog,
// // //   DialogContent,
// // //   DialogHeader,
// // //   DialogTitle,
// // //   DialogDescription,
// // //   DialogFooter,
// // // } from '@/components/ui/dialog';
// // // import {
// // //   Form,
// // //   FormControl,
// // //   FormField,
// // //   FormItem,
// // //   FormLabel,
// // //   FormMessage,
// // // } from '@/components/ui/form';
// // // import { Button } from '@/components/ui/button';
// // // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// // // import { Input } from '@/components/ui/input';
// // // import type { Trip } from '@/lib/data';
// // // import { Loader2, Save, Calendar as CalendarIcon, AlertCircle } from 'lucide-react';
// // // import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
// // // import { Calendar } from '@/components/ui/calendar';
// // // import { cn } from '@/lib/utils';
// // // import { format } from 'date-fns';
// // // import { useTranslations } from 'next-intl';

// // // interface EditTripDialogProps {
// // //   isOpen: boolean;
// // //   onOpenChange: (open: boolean) => void;
// // //   trip: Trip | null;
// // //   // onConfirm: (trip: Trip, data: EditTripFormValues) => Promise<void>;
// // //   onConfirm: (trip: Trip, data: EditTripFormValues) => Promise<boolean | void>;
// // // }

// // // const editTripSchema = z.object({
// // //   price: z.coerce.number().positive('السعر يجب أن يكون رقماً موجباً'),
// // //   availableSeats: z.coerce.number().int().min(0, 'عدد المقاعد لا يمكن أن يكون سالباً'),
// // //   departureDate: z.date({ required_error: 'تاريخ المغادرة مطلوب' }),
// // //   depositPercentage: z.coerce.number().min(0, 'العربون لا يمكن أن يكون سالباً').max(100, 'العربون لا يمكن أن يتجاوز 100%'),
// // //   facebookProfile: z.string().url('رابط فيسبوك غير صالح').optional().or(z.literal('')),
// // //   instagramProfile: z.string().url('رابط إنستغرام غير صالح').optional().or(z.literal('')),
// // //   tiktokProfile: z.string().url('رابط تيك توك غير صالح').optional().or(z.literal('')),
// // // });

// // // export type EditTripFormValues = z.infer<typeof editTripSchema>;

// // // export function EditTripDialog({ isOpen, onOpenChange, trip, onConfirm }: EditTripDialogProps) {
// // //   const [isSubmitting, setIsSubmitting] = useState(false);
// // //   const t = useTranslations('editTripDialog');
// // //   const form = useForm<EditTripFormValues>({
// // //     resolver: zodResolver(editTripSchema),
// // //     defaultValues: {
// // //       price: 0,
// // //       availableSeats: 0,
// // //       depositPercentage: 0,
// // //       facebookProfile: '',
// // //       instagramProfile: '',
// // //       tiktokProfile: '',
// // //     },
// // //   });

// // //   useEffect(() => {
// // //     if (trip && isOpen) {
// // //       const departureDate = trip.departureDate
// // //         ? (typeof (trip.departureDate as any).toDate === 'function'
// // //           ? (trip.departureDate as any).toDate()
// // //           : new Date(trip.departureDate))
// // //         : new Date();

// // //       form.reset({
// // //         price: trip.price || 0,
// // //         availableSeats: trip.availableSeats || 0,
// // //         depositPercentage: trip.depositPercentage ?? 0,
// // //         departureDate,
// // //         facebookProfile: trip.facebookProfile || '',
// // //         instagramProfile: trip.instagramProfile || '',
// // //         tiktokProfile: trip.tiktokProfile || '',
// // //       });
// // //     }
// // //   }, [trip, isOpen, form]);

// // //   // const onSubmit = async (data: EditTripFormValues) => {
// // //   //   if (!trip) return;
// // //   //   setIsSubmitting(true);
// // //   //   try {
// // //   //     await onConfirm(trip, data);
// // //   //     onOpenChange(false);
// // //   //   } catch (e) {
// // //   //     console.error("[Sovereign Edit] Update Rupture:", e);
// // //   //   } finally {
// // //   //     setIsSubmitting(false);
// // //   //   }
// // //   // };
// // //   const onSubmit = async (data: EditTripFormValues) => {
// // //     if (!trip) return;
// // //     setIsSubmitting(true);
// // //     try {
// // //       await onConfirm(trip, data);
// // //       onOpenChange(false); // نضمن إغلاق الواجهة إذا نجحت العملية
// // //     } catch (e: any) {
// // //       alert("❌ خطأ في الواجهة: " + e.message);
// // //     } finally {
// // //       setIsSubmitting(false);
// // //     }
// // //   };
// // //   const bookedCount = trip ? (trip.vehicleCapacity || 0) - (trip.availableSeats || 0) : 0;
// // //   const price = form.watch('price');
// // //   const deposit = form.watch('depositPercentage');
// // //   const depositAmount = price && deposit ? ((price * deposit) / 100).toFixed(2) : null;

// // //   return (
// // //     <Dialog open={isOpen} onOpenChange={onOpenChange}>
// // //       <DialogContent className="sm:max-w-md">
// // //         <DialogHeader>
// // //           <DialogTitle className="flex items-center gap-2 font-black pt-3">{t('title')}</DialogTitle>
// // //           <DialogDescription className="flex items-center gap-2 pt-2 text-xs font-bold">
// // //             {t('desc')}
// // //           </DialogDescription>
// // //         </DialogHeader>

// // //         {bookedCount > 0 && (
// // //           <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-start gap-3 animate-in zoom-in">
// // //             <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
// // //             <div>
// // //               <p className="text-[10px] font-black text-amber-800 uppercase">{t('seatsWarningTitle')}</p>
// // //               <p className="text-[11px] text-amber-700 font-bold">{t('seatsWarningDesc', { count: bookedCount })}</p>
// // //             </div>
// // //           </div>
// // //         )}

// // //         <Form {...form}>
// // //           {/* <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4"> */}
// // //           <form onSubmit={form.handleSubmit(onSubmit, (errors) => alert("❌ النموذج يرفض الإرسال بسبب خطأ في هذه الحقول: \n" + JSON.stringify(errors, null, 2)))} className="space-y-4 pt-4">
// // //             <FormField
// // //               control={form.control}
// // //               name="departureDate"
// // //               render={({ field }) => (
// // //                 <FormItem>
// // //                   <FormLabel className="text-xs font-bold">{t('date')}</FormLabel>
// // //                   <Popover>
// // //                     <PopoverTrigger asChild>
// // //                       <FormControl>
// // //                         <Button
// // //                           variant={"outline"}
// // //                           className={cn(
// // //                             "w-full h-12 justify-between font-bold rounded-xl",
// // //                             !field.value && "text-muted-foreground"
// // //                           )}
// // //                         >
// // //                           {field.value && !isNaN(new Date(field.value).getTime())
// // //                             ? format(new Date(field.value), "PPP")
// // //                             : <span>{t('selectDate')}</span>
// // //                           }
// // //                           <CalendarIcon className="h-4 w-4 opacity-50" />
// // //                         </Button>
// // //                       </FormControl>
// // //                     </PopoverTrigger>
// // //                     <PopoverContent className="w-auto p-0 rounded-2xl" align="start">
// // //                       <Calendar
// // //                         mode="single"
// // //                         selected={field.value}
// // //                         onSelect={(date) => {
// // //                           if (date) {
// // //                             date.setHours(12, 0, 0, 0);
// // //                             field.onChange(date);
// // //                           }
// // //                         }}
// // //                         disabled={(date) => date < new Date()}
// // //                       />
// // //                     </PopoverContent>
// // //                   </Popover>
// // //                   <FormMessage />
// // //                 </FormItem>
// // //               )}
// // //             />

// // //             <FormField
// // //               control={form.control}
// // //               name="price"
// // //               render={({ field }) => (
// // //                 <FormItem>
// // //                   <FormLabel className="text-xs font-bold">{t('price')} ({trip?.currency})</FormLabel>
// // //                   <FormControl>
// // //                     <Input type="number" {...field} className="h-12 bg-muted/20 font-black text-lg rounded-xl" />
// // //                   </FormControl>
// // //                   <FormMessage />
// // //                 </FormItem>
// // //               )}
// // //             />

// // //             <FormField
// // //               control={form.control}
// // //               name="depositPercentage"
// // //               render={({ field }) => (
// // //                 <FormItem>
// // //                   <FormLabel className="text-xs font-bold">نسبة العربون</FormLabel>
// // //                   <Select
// // //                     value={String(field.value)}
// // //                     onValueChange={(val) => field.onChange(Number(val))}
// // //                   >
// // //                     <FormControl>
// // //                       <SelectTrigger className="h-12 bg-muted/20 font-black text-lg rounded-xl">
// // //                         <SelectValue placeholder="اختر نسبة العربون" />
// // //                       </SelectTrigger>
// // //                     </FormControl>
// // //                     <SelectContent>
// // //                       {[0, 5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100].map((val) => (
// // //                         <SelectItem key={val} value={String(val)}>
// // //                           {val}%
// // //                         </SelectItem>
// // //                       ))}
// // //                     </SelectContent>
// // //                   </Select>
// // //                   {Number(deposit) > 0 && depositAmount && (
// // //                     <p className="text-xs text-muted-foreground font-bold pt-1">
// // //                       💰 قيمة العربون: <span className="text-primary">{depositAmount} {trip?.currency}</span>
// // //                     </p>
// // //                   )}
// // //                   <FormMessage />
// // //                 </FormItem>
// // //               )}
// // //             />

// // //             <DialogFooter className="gap-2 sm:gap-0 pt-4">
// // //               <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={isSubmitting}>{t('cancel')}</Button>
// // //               <Button type="submit" disabled={isSubmitting} className="font-black h-12 shadow-lg rounded-xl px-8">
// // //                 {isSubmitting ? (
// // //                   <><Loader2 className="ml-2 h-4 w-4 animate-spin" />{t('saving')}</>
// // //                 ) : (
// // //                   <><Save className="ml-2 h-4 w-4" />{t('save')}</>
// // //                 )}
// // //               </Button>
// // //             </DialogFooter>
// // //           </form>
// // //         </Form>
// // //       </DialogContent>
// // //     </Dialog>
// // //   );
// // // }
// // 'use client';

// // import { useState, useEffect } from 'react';
// // import { useForm } from 'react-hook-form';
// // import { zodResolver } from '@hookform/resolvers/zod';
// // import { z } from 'zod';
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogHeader,
// //   DialogTitle,
// //   DialogDescription,
// //   DialogFooter,
// // } from '@/components/ui/dialog';
// // import {
// //   Form,
// //   FormControl,
// //   FormField,
// //   FormItem,
// //   FormLabel,
// //   FormMessage,
// // } from '@/components/ui/form';
// // import { Button } from '@/components/ui/button';
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// // import { Input } from '@/components/ui/input';
// // import type { Trip } from '@/lib/data';
// // import { Loader2, Save, Calendar as CalendarIcon, AlertCircle } from 'lucide-react';
// // import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
// // import { Calendar } from '@/components/ui/calendar';
// // import { cn } from '@/lib/utils';
// // import { format } from 'date-fns';
// // import { useTranslations } from 'next-intl';

// // interface EditTripDialogProps {
// //   isOpen: boolean;
// //   onOpenChange: (open: boolean) => void;
// //   trip: Trip | null;
// //   onConfirm: (trip: Trip, data: EditTripFormValues) => Promise<boolean | void>;
// // }

// // // 🚀 تم تبسيط شروط التحقق لتشمل فقط الحقول الموجودة لتجنب الفشل الصامت
// // const editTripSchema = z.object({
// //   price: z.coerce.number().positive('السعر يجب أن يكون رقماً موجباً'),
// //   departureDate: z.date({ required_error: 'تاريخ المغادرة مطلوب' }),
// //   depositPercentage: z.coerce.number().min(0, 'العربون لا يمكن أن يكون سالباً').max(100, 'العربون لا يمكن أن يتجاوز 100%'),
// //   availableSeats: z.coerce.number().optional(),
// // });

// // export type EditTripFormValues = z.infer<typeof editTripSchema>;

// // export function EditTripDialog({ isOpen, onOpenChange, trip, onConfirm }: EditTripDialogProps) {
// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const t = useTranslations('editTripDialog');

// //   const form = useForm<EditTripFormValues>({
// //     resolver: zodResolver(editTripSchema),
// //     defaultValues: {
// //       price: 0,
// //       depositPercentage: 0,
// //       availableSeats: 0,
// //     },
// //   });

// //   useEffect(() => {
// //     if (trip && isOpen) {
// //       const departureDate = trip.departureDate
// //         ? (typeof (trip.departureDate as any).toDate === 'function'
// //           ? (trip.departureDate as any).toDate()
// //           : new Date(trip.departureDate))
// //         : new Date();

// //       form.reset({
// //         price: trip.price || 0,
// //         depositPercentage: trip.depositPercentage ?? 0,
// //         departureDate,
// //         availableSeats: trip.availableSeats || 0,
// //       });
// //     }
// //   }, [trip, isOpen, form]);

// //   const onSubmit = async (data: EditTripFormValues) => {
// //     if (!trip) return;
// //     setIsSubmitting(true);
// //     try {
// //       await onConfirm(trip, data);
// //       onOpenChange(false);
// //     } catch (e) {
// //       console.error("Update failed:", e);
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   const bookedCount = trip ? (trip.vehicleCapacity || 0) - (trip.availableSeats || 0) : 0;
// //   const price = form.watch('price');
// //   const deposit = form.watch('depositPercentage');
// //   const depositAmount = price && deposit ? ((price * deposit) / 100).toFixed(2) : null;

// //   return (
// //     <Dialog open={isOpen} onOpenChange={onOpenChange}>
// //       <DialogContent className="sm:max-w-md">
// //         <DialogHeader>
// //           <DialogTitle className="flex items-center gap-2 font-black pt-3">{t('title')}</DialogTitle>
// //           <DialogDescription className="flex items-center gap-2 pt-2 text-xs font-bold">
// //             {t('desc')}
// //           </DialogDescription>
// //         </DialogHeader>

// //         {bookedCount > 0 && (
// //           <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-start gap-3 animate-in zoom-in">
// //             <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
// //             <div>
// //               <p className="text-[10px] font-black text-amber-800 uppercase">{t('seatsWarningTitle')}</p>
// //               <p className="text-[11px] text-amber-700 font-bold">{t('seatsWarningDesc', { count: bookedCount })}</p>
// //             </div>
// //           </div>
// //         )}

// //         <Form {...form}>
// //           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
// //             <FormField
// //               control={form.control}
// //               name="departureDate"
// //               render={({ field }) => (
// //                 <FormItem>
// //                   <FormLabel className="text-xs font-bold">{t('date')}</FormLabel>
// //                   <Popover>
// //                     <PopoverTrigger asChild>
// //                       <FormControl>
// //                         <Button
// //                           variant={"outline"}
// //                           className={cn(
// //                             "w-full h-12 justify-between font-bold rounded-xl",
// //                             !field.value && "text-muted-foreground"
// //                           )}
// //                         >
// //                           {field.value && !isNaN(new Date(field.value).getTime())
// //                             ? format(new Date(field.value), "PPP")
// //                             : <span>{t('selectDate')}</span>
// //                           }
// //                           <CalendarIcon className="h-4 w-4 opacity-50" />
// //                         </Button>
// //                       </FormControl>
// //                     </PopoverTrigger>
// //                     <PopoverContent className="w-auto p-0 rounded-2xl" align="start">
// //                       <Calendar
// //                         mode="single"
// //                         selected={field.value}
// //                         onSelect={(date) => {
// //                           if (date) {
// //                             date.setHours(12, 0, 0, 0);
// //                             field.onChange(date);
// //                           }
// //                         }}
// //                         disabled={(date) => date < new Date()}
// //                       />
// //                     </PopoverContent>
// //                   </Popover>
// //                   <FormMessage />
// //                 </FormItem>
// //               )}
// //             />

// //             <FormField
// //               control={form.control}
// //               name="price"
// //               render={({ field }) => (
// //                 <FormItem>
// //                   <FormLabel className="text-xs font-bold">{t('price')} ({trip?.currency})</FormLabel>
// //                   <FormControl>
// //                     <Input type="number" {...field} className="h-12 bg-muted/20 font-black text-lg rounded-xl" />
// //                   </FormControl>
// //                   <FormMessage />
// //                 </FormItem>
// //               )}
// //             />

// //             <FormField
// //               control={form.control}
// //               name="depositPercentage"
// //               render={({ field }) => (
// //                 <FormItem>
// //                   <FormLabel className="text-xs font-bold">نسبة العربون</FormLabel>
// //                   {/* 🚀 تم إصلاح الـ Select ليرتبط بالقيمة الصحيحة ويتحدث فوراً */}
// //                   <Select
// //                     onValueChange={(val) => field.onChange(Number(val))}
// //                     defaultValue={String(field.value)}
// //                     value={String(field.value)}
// //                   >
// //                     <FormControl>
// //                       <SelectTrigger className="h-12 bg-muted/20 font-black text-lg rounded-xl">
// //                         <SelectValue placeholder="اختر نسبة العربون" />
// //                       </SelectTrigger>
// //                     </FormControl>
// //                     <SelectContent>
// //                       {[0, 5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100].map((val) => (
// //                         <SelectItem key={val} value={String(val)}>
// //                           {val}%
// //                         </SelectItem>
// //                       ))}
// //                     </SelectContent>
// //                   </Select>
// //                   {Number(deposit) > 0 && depositAmount && (
// //                     <p className="text-xs text-muted-foreground font-bold pt-1">
// //                       💰 قيمة العربون: <span className="text-primary">{depositAmount} {trip?.currency}</span>
// //                     </p>
// //                   )}
// //                   <FormMessage />
// //                 </FormItem>
// //               )}
// //             />

// //             <DialogFooter className="gap-2 sm:gap-0 pt-4">
// //               <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={isSubmitting}>{t('cancel')}</Button>
// //               <Button type="submit" disabled={isSubmitting} className="font-black h-12 shadow-lg rounded-xl px-8">
// //                 {isSubmitting ? (
// //                   <><Loader2 className="ml-2 h-4 w-4 animate-spin" />{t('saving')}</>
// //                 ) : (
// //                   <><Save className="ml-2 h-4 w-4" />{t('save')}</>
// //                 )}
// //               </Button>
// //             </DialogFooter>
// //           </form>
// //         </Form>
// //       </DialogContent>
// //     </Dialog>
// //   );
// // }
// // ============================================================
// // EditTripDialog — v2.1
// // لو مفيش حجوزات: يغير التاريخ + الوقت + السعر + نسبة العربون فوراً
// // لو في حجوزات:   يغير التاريخ + الوقت بس — يبعت طلب موافقة للمسافرين
// // ============================================================
// 'use client';

// import { useState, useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from '@/components/ui/dialog';
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import type { Trip } from '@/lib/data';
// import { Loader2, Save, Calendar as CalendarIcon, AlertCircle, Clock, Tag } from 'lucide-react';
// import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
// import { Calendar } from '@/components/ui/calendar';
// import { cn } from '@/lib/utils';
// import { format } from 'date-fns';
// import { useTranslations } from 'next-intl';

// const editTripSchema = z.object({
//   departureDate: z.date({ required_error: 'تاريخ المغادرة مطلوب' }),
//   departureTime: z.string().optional(),
//   // حقول السعر — مطلوبة بس لو مفيش حجوزات (validation يتم في onSubmit)
//   price: z.coerce.number().positive('السعر يجب أن يكون موجباً').optional(),
//   depositPercentage: z.coerce.number().min(0).max(100).optional(),
//   // سبب التغيير — مطلوب لو في حجوزات
//   rescheduleReason: z.string().optional(),
// });

// export type EditTripFormValues = z.infer<typeof editTripSchema>;

// interface EditTripDialogProps {
//   isOpen: boolean;
//   onOpenChange: (open: boolean) => void;
//   trip: Trip | null;
//   bookedCount?: number;
//   onConfirm: (trip: Trip, data: EditTripFormValues) => Promise<boolean | void>;
// }

// export function EditTripDialog({ isOpen, onOpenChange, trip, onConfirm, bookedCount: bookedCountProp }: EditTripDialogProps) {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [reasonError, setReasonError] = useState('');
//   const t = useTranslations('editTripDialog');

//   const form = useForm<EditTripFormValues>({
//     resolver: zodResolver(editTripSchema),
//     defaultValues: {
//       departureTime: '',
//       rescheduleReason: '',
//       price: 0,
//       depositPercentage: 0,
//     },
//   });

//   const bookedCount = bookedCountProp ?? (trip ? (trip.vehicleCapacity || 0) - (trip.availableSeats || 0) : 0);
//   const hasBookings = bookedCount > 0;

//   useEffect(() => {
//     if (trip && isOpen) {
//       const departureDate = trip.departureDate
//         ? (typeof (trip.departureDate as any).toDate === 'function'
//           ? (trip.departureDate as any).toDate()
//           : new Date(trip.departureDate))
//         : new Date();

//       form.reset({
//         departureDate,
//         departureTime: trip.departureTime || '',
//         rescheduleReason: '',
//         price: trip.price || 0,
//         depositPercentage: trip.depositPercentage ?? 0,
//       });
//       setReasonError('');
//     }
//   }, [trip, isOpen, form]);

//   const price = form.watch('price');
//   const deposit = form.watch('depositPercentage');
//   const depositAmount = price && deposit ? ((Number(price) * Number(deposit)) / 100).toFixed(2) : null;

//   const onSubmit = async (data: EditTripFormValues) => {
//     if (hasBookings && (!data.rescheduleReason || data.rescheduleReason.trim().length < 5)) {
//       setReasonError('يجب كتابة سبب واضح لتغيير الموعد (5 أحرف على الأقل)');
//       return;
//     }
//     setReasonError('');
//     if (!trip) return;
//     setIsSubmitting(true);
//     try {
//       await onConfirm(trip, data);
//       onOpenChange(false);
//     } catch (e) {
//       console.error('EditTripDialog submit failed:', e);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2 font-black pt-3">
//             <CalendarIcon className="h-5 w-5 text-primary" />
//             تعديل الرحلة
//           </DialogTitle>
//           <DialogDescription className="pt-2 text-xs font-bold">
//             {hasBookings
//               ? `يمكنك تغيير الموعد فقط — سيتم إرسال طلب موافقة للمسافرين (${bookedCount} حجز)`
//               : 'لا توجد حجوزات — جميع التغييرات ستُطبَّق فوراً'}
//           </DialogDescription>
//         </DialogHeader>

//         {hasBookings && (
//           <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-start gap-3 animate-in zoom-in">
//             <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
//             <div>
//               <p className="text-[10px] font-black text-amber-800 uppercase">انتبه — في حجوزات مؤكدة</p>
//               <p className="text-[11px] text-amber-700 font-bold">
//                 لا يمكن تغيير السعر أو العربون بعد الحجز. يمكنك تغيير الموعد فقط، والرحلة لن تتحدث حتى يوافق جميع المسافرين.
//               </p>
//             </div>
//           </div>
//         )}

//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">

//             {/* ── التاريخ ── */}
//             <FormField
//               control={form.control}
//               name="departureDate"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-xs font-bold">تاريخ المغادرة</FormLabel>
//                   <Popover>
//                     <PopoverTrigger asChild>
//                       <FormControl>
//                         <Button
//                           variant="outline"
//                           className={cn(
//                             'w-full h-12 justify-between font-bold rounded-xl',
//                             !field.value && 'text-muted-foreground'
//                           )}
//                         >
//                           {field.value && !isNaN(new Date(field.value).getTime())
//                             ? format(new Date(field.value), 'PPP')
//                             : <span>اختر التاريخ</span>}
//                           <CalendarIcon className="h-4 w-4 opacity-50" />
//                         </Button>
//                       </FormControl>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-auto p-0 rounded-2xl" align="start">
//                       <Calendar
//                         mode="single"
//                         selected={field.value}
//                         onSelect={(date) => {
//                           if (date) { date.setHours(12, 0, 0, 0); field.onChange(date); }
//                         }}
//                         disabled={(date) => date < new Date()}
//                       />
//                     </PopoverContent>
//                   </Popover>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* ── وقت الانطلاق ── */}
//             <FormField
//               control={form.control}
//               name="departureTime"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-xs font-bold flex items-center gap-1">
//                     <Clock className="h-3.5 w-3.5" />
//                     وقت الانطلاق (اختياري)
//                   </FormLabel>
//                   <FormControl>
//                     <Input type="time" {...field} className="h-12 bg-muted/20 font-black text-lg rounded-xl" />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* ── السعر ونسبة العربون — يظهران فقط لو مفيش حجوزات ── */}
//             {!hasBookings && (
//               <>
//                 <div className="border-t border-muted/30 pt-4 space-y-4">
//                   <p className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-1">
//                     <Tag className="h-3 w-3" />
//                     تسعير الرحلة
//                   </p>

//                   <FormField
//                     control={form.control}
//                     name="price"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel className="text-xs font-bold">
//                           السعر ({trip?.currency})
//                         </FormLabel>
//                         <FormControl>
//                           <Input
//                             type="number"
//                             min={0}
//                             {...field}
//                             className="h-12 bg-muted/20 font-black text-lg rounded-xl"
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="depositPercentage"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel className="text-xs font-bold">نسبة العربون</FormLabel>
//                         <Select
//                           onValueChange={(val) => field.onChange(Number(val))}
//                           value={String(field.value)}
//                         >
//                           <FormControl>
//                             <SelectTrigger className="h-12 bg-muted/20 font-black text-lg rounded-xl">
//                               <SelectValue placeholder="اختر نسبة العربون" />
//                             </SelectTrigger>
//                           </FormControl>
//                           <SelectContent>
//                             {[0, 5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100].map((val) => (
//                               <SelectItem key={val} value={String(val)}>{val}%</SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                         {Number(deposit) > 0 && depositAmount && (
//                           <p className="text-xs text-muted-foreground font-bold pt-1">
//                             💰 قيمة العربون: <span className="text-primary">{depositAmount} {trip?.currency}</span>
//                           </p>
//                         )}
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </div>
//               </>
//             )}

//             {/* ── سبب التغيير — مطلوب لو في حجوزات ── */}
//             <FormField
//               control={form.control}
//               name="rescheduleReason"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-xs font-bold flex items-center gap-1">
//                     سبب تغيير الموعد
//                     {hasBookings && <span className="text-destructive">*</span>}
//                   </FormLabel>
//                   <FormControl>
//                     <Textarea
//                       placeholder={hasBookings
//                         ? 'مثال: تغيير في جدول العمل، ظروف طارئة...'
//                         : 'اختياري — يمكنك ذكر سبب التغيير'}
//                       className="bg-muted/20 font-bold rounded-xl resize-none min-h-[80px]"
//                       {...field}
//                     />
//                   </FormControl>
//                   {reasonError && (
//                     <p className="text-[11px] text-destructive font-bold">{reasonError}</p>
//                   )}
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <DialogFooter className="gap-2 sm:gap-0 pt-2">
//               <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
//                 إلغاء
//               </Button>
//               <Button type="submit" disabled={isSubmitting} className="font-black h-12 shadow-lg rounded-xl px-8">
//                 {isSubmitting ? (
//                   <><Loader2 className="ml-2 h-4 w-4 animate-spin" />جاري الإرسال...</>
//                 ) : hasBookings ? (
//                   <><Save className="ml-2 h-4 w-4" />إرسال طلب التغيير</>
//                 ) : (
//                   <><Save className="ml-2 h-4 w-4" />حفظ التغييرات</>
//                 )}
//               </Button>
//             </DialogFooter>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// }
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Trip } from '@/lib/data';
import { Loader2, Save, Calendar as CalendarIcon, AlertCircle, Clock, Tag } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useTranslations } from 'next-intl';
import { useTripActions } from '@/hooks/use-trip-actions'; // إضافة الـ Hook

const editTripSchema = z.object({
  departureDate: z.date({ required_error: 'تاريخ المغادرة مطلوب' }),
  departureTime: z.string().optional(),
  price: z.coerce.number().positive('السعر يجب أن يكون موجباً').optional(),
  depositPercentage: z.coerce.number().min(0).max(100).optional(),
  rescheduleReason: z.string().optional(),
});

export type EditTripFormValues = z.infer<typeof editTripSchema>;

interface EditTripDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  trip: Trip | null;
  bookedCount?: number;
  onConfirm: (trip: Trip, data: EditTripFormValues) => Promise<boolean | void>;
}

export function EditTripDialog({ isOpen, onOpenChange, trip, onConfirm, bookedCount: bookedCountProp }: EditTripDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reasonError, setReasonError] = useState('');
  const t = useTranslations('editTripDialog');
  const { requestTripModification } = useTripActions(); // استدعاء الدالة الجديدة

  const form = useForm<EditTripFormValues>({
    resolver: zodResolver(editTripSchema),
    defaultValues: {
      departureTime: '',
      rescheduleReason: '',
      price: 0,
      depositPercentage: 0,
    },
  });

  const bookedCount = bookedCountProp ?? (trip ? (trip.vehicleCapacity || 0) - (trip.availableSeats || 0) : 0);
  const hasBookings = bookedCount > 0;

  // useEffect(() => {
  //   if (trip && isOpen) {
  //     const departureDate = trip.departureDate
  //       ? (typeof (trip.departureDate as any).toDate === 'function'
  //         ? (trip.departureDate as any).toDate()
  //         : new Date(trip.departureDate))
  //       : new Date();

  //     form.reset({
  //       departureDate,
  //       departureTime: trip.departureTime || '',
  //       rescheduleReason: '',
  //       price: trip.price || 0,
  //       depositPercentage: trip.depositPercentage ?? 0,
  //     });
  //     setReasonError('');
  //   }
  // }, [trip, isOpen, form]);
  useEffect(() => {
    if (trip && isOpen) {
      const departureDate = trip.departureDate
        ? (typeof (trip.departureDate as any).toDate === 'function'
          ? (trip.departureDate as any).toDate()
          : new Date(trip.departureDate))
        : new Date();

      // 🚀 استخراج الوقت بصيغة الساعات والدقائق (HH:mm) من التاريخ الأصلي للرحلة
      const extractedTime = format(departureDate, 'HH:mm');

      form.reset({
        departureDate,
        // لو الرحلة ليها departureTime خده، لو لأ استخدم الوقت المستخرج
        departureTime: trip.departureTime || extractedTime,
        rescheduleReason: '',
        price: trip.price || 0,
        depositPercentage: trip.depositPercentage ?? 0,
      });
      setReasonError('');
    }
  }, [trip, isOpen, form]);
  const price = form.watch('price');
  const deposit = form.watch('depositPercentage');
  const depositAmount = price && deposit ? ((Number(price) * Number(deposit)) / 100).toFixed(2) : null;

  // const onSubmit = async (data: EditTripFormValues) => {
  //   if (hasBookings && (!data.rescheduleReason || data.rescheduleReason.trim().length < 5)) {
  //     setReasonError('يجب كتابة سبب واضح لتغيير الموعد (5 أحرف على الأقل)');
  //     return;
  //   }
  //   setReasonError('');
  //   if (!trip) return;
  //   setIsSubmitting(true);

  //   try {
  //     if (hasBookings) {
  //       // إرسال طلب تعديل بدلاً من التعديل المباشر
  //       await requestTripModification(trip.id, data.departureDate, data.departureTime || '', data.rescheduleReason || '');
  //     } else {
  //       // تعديل مباشر لو مفيش حجوزات
  //       await onConfirm(trip, data);
  //     }
  //     onOpenChange(false);
  //   } catch (e) {
  //     console.error('EditTripDialog submit failed:', e);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };
  const onSubmit = async (data: EditTripFormValues) => {
    if (hasBookings && (!data.rescheduleReason || data.rescheduleReason.trim().length < 5)) {
      setReasonError('يجب كتابة سبب واضح لتغيير الموعد (5 أحرف على الأقل)');
      return;
    }
    setReasonError('');
    if (!trip) return;
    setIsSubmitting(true);

    try {
      // 🛠️ الحل الجذري: دمج الوقت مع التاريخ هنا قبل الإرسال لأي مكان
      const finalDate = new Date(data.departureDate);
      if (data.departureTime) {
        const [hours, minutes] = data.departureTime.split(':');
        // هنا بنجبر التاريخ إنه ياخد الساعات والدقايق اللي الناقل كتبها
        finalDate.setHours(Number(hours), Number(minutes), 0, 0);
      }

      // تحديث قيمة التاريخ في الداتا عشان تروح للـ Hook مظبوطة 100%
      data.departureDate = finalDate;

      if (hasBookings) {
        // إرسال طلب تعديل
        await requestTripModification(trip.id, finalDate, data.departureTime || '', data.rescheduleReason || '');
      } else {
        // تعديل مباشر
        await onConfirm(trip, data);
      }

      onOpenChange(false);
    } catch (e) {
      console.error('EditTripDialog submit failed:', e);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-black pt-3">
            <CalendarIcon className="h-5 w-5 text-primary" />
            تعديل الرحلة
          </DialogTitle>
          <DialogDescription className="pt-2 text-xs font-bold">
            {hasBookings
              ? `يمكنك تغيير الموعد فقط — سيتم إرسال طلب موافقة للمسافرين (${bookedCount} حجز)`
              : 'لا توجد حجوزات — جميع التغييرات ستُطبَّق فوراً'}
          </DialogDescription>
        </DialogHeader>

        {hasBookings && (
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-start gap-3 animate-in zoom-in">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] font-black text-amber-800 uppercase">انتبه — في حجوزات مؤكدة</p>
              <p className="text-[11px] text-amber-700 font-bold">
                لا يمكن تغيير السعر أو العربون بعد الحجز. يمكنك تغيير الموعد فقط، والرحلة لن تتحدث حتى يوافق جميع المسافرين.
              </p>
            </div>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">

            {/* ── التاريخ ── */}
            <FormField
              control={form.control}
              name="departureDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-bold">تاريخ المغادرة</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full h-12 justify-between font-bold rounded-xl',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value && !isNaN(new Date(field.value).getTime())
                            ? format(new Date(field.value), 'PPP')
                            : <span>اختر التاريخ</span>}
                          <CalendarIcon className="h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-2xl" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          if (date) { date.setHours(12, 0, 0, 0); field.onChange(date); }
                        }}
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ── وقت الانطلاق ── */}
            <FormField
              control={form.control}
              name="departureTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-bold flex items-center gap-1">
                    {/* <Clock className="h-4 w-4" /> */}
                    وقت الانطلاق
                  </FormLabel>
                  <FormControl>
                    <Input type="time" {...field} className="h-12 bg-muted/20 font-black text-lg rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ── السعر ونسبة العربون — يظهران فقط لو مفيش حجوزات ── */}
            {!hasBookings && (
              <>
                <div className="border-t border-muted/30  space-y-4">
                  {/* <p className="text- font-black text-muted-foreground uppercase flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    تسعير الرحلة
                  </p> */}

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-bold">السعر ({trip?.currency})</FormLabel>
                        <FormControl>
                          <Input type="number" min={0} {...field} className="h-12 bg-muted/20 font-black text-lg rounded-xl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="depositPercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-bold">نسبة العربون</FormLabel>
                        <Select onValueChange={(val) => field.onChange(Number(val))} value={String(field.value)}>
                          <FormControl>
                            <SelectTrigger className="h-12 bg-muted/20 font-black text-lg rounded-xl">
                              <SelectValue placeholder="اختر نسبة العربون" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[0, 5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100].map((val) => (
                              <SelectItem key={val} value={String(val)}>{val}%</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {Number(deposit) > 0 && depositAmount && (
                          <p className="text-sm text-muted-foreground font-bold pt-1">
                            💰 قيمة العربون: <span className="text-primary">{depositAmount} {trip?.currency}</span>
                          </p>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}

            {/* ── سبب التغيير — مطلوب لو في حجوزات ── */}
            {hasBookings && (<FormField
              control={form.control}
              name="rescheduleReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold flex items-center gap-1">
                    سبب تغيير الموعد
                    {hasBookings && <span className="text-destructive">*</span>}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={hasBookings ? 'مثال: تغيير في جدول العمل، ظروف طارئة...' : 'اختياري — يمكنك ذكر سبب التغيير'}
                      className="bg-muted/20 font-bold rounded-xl resize-none min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  {reasonError && <p className="text-[11px] text-destructive font-bold">{reasonError}</p>}
                  <FormMessage />
                </FormItem>
              )}
            />)}

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={isSubmitting}>إلغاء</Button>
              <Button type="submit" disabled={isSubmitting} className="font-black h-12 shadow-lg rounded-xl px-8">
                {isSubmitting ? (
                  <><Loader2 className="ml-2 h-4 w-4 animate-spin" />جاري الإرسال...</>
                ) : hasBookings ? (
                  <><Save className="ml-2 h-4 w-4" />إرسال طلب التغيير</>
                ) : (
                  <><Save className="ml-2 h-4 w-4" />حفظ التغييرات</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}