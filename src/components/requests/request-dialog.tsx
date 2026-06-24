
// // 'use client';

// // import { useState, useEffect } from 'react';
// // import { useForm } from 'react-hook-form';
// // import { zodResolver } from '@hookform/resolvers/zod';
// // import { z } from 'zod';
// // import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
// // import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
// // import { Button } from '@/components/ui/button';
// // import { Input } from '@/components/ui/input';
// // import { Textarea } from '@/components/ui/textarea';
// // import { useToast } from '@/hooks/use-toast';
// // import { useFirestore, useUser, addDocumentNonBlocking } from '@/firebase';
// // import { collection, serverTimestamp } from 'firebase/firestore';
// // import { Loader2, Send, Car, Share2, User, Bus } from 'lucide-react';
// // import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
// // import { Label } from '@/components/ui/label';
// // import { Switch } from '@/components/ui/switch';
// // import { ScrollArea } from '../ui/scroll-area';

// // const requestSchema = z.object({
// //   preferredVehicle: z.enum(['any', 'small', 'bus']).default('any'),
// //   isShared: z.boolean().default(true),
// //   targetPrice: z.coerce.number().optional(),
// //   notes: z.string().max(200, 'الملاحظات يجب ألا تتجاوز 200 حرف').optional(),
// // });

// // type RequestFormValues = z.infer<typeof requestSchema>;

// // interface RequestDialogProps {
// //   isOpen: boolean;
// //   onOpenChange: (isOpen: boolean) => void;
// //   showValidationToast?: boolean;
// //   searchParams: {
// //     origin: string;
// //     destination: string;
// //     departureDate?: Date;
// //     passengers: number;
// //     requestType: 'General' | 'Direct';
// //     targetCarrierId?: string;
// //     carrierName?: string;   // ✅ جديد
// //     vehicleType?: string;   // ✅ جديد
// //   };
// //   onSuccess: () => void;
// // }

// // export function RequestDialog({
// //   isOpen,
// //   onOpenChange,
// //   searchParams,
// //   onSuccess,
// //   showValidationToast = false,
// // }: RequestDialogProps) {
// //   const { toast } = useToast();
// //   const firestore = useFirestore();
// //   const { user } = useUser();
// //   const [isSubmitting, setIsSubmitting] = useState(false);

// //   const form = useForm<RequestFormValues>({
// //     resolver: zodResolver(requestSchema),
// //     defaultValues: {
// //       preferredVehicle: 'any',
// //       isShared: true,
// //       targetPrice: undefined,
// //       notes: '',
// //     },
// //   });

// //   useEffect(() => {
// //     if (isOpen) {
// //       if (!searchParams.origin || !searchParams.destination || !searchParams.departureDate) {
// //         if (showValidationToast) {
// //           toast({
// //             variant: "destructive",
// //             title: "بيانات غير مكتملة",
// //             description: "يجب تحديد الأصل والوجهة والتاريخ أولاً.",
// //           });
// //         }
// //         setTimeout(() => onOpenChange(false), 0);
// //       } else {
// //         form.reset({
// //           preferredVehicle: 'any',
// //           isShared: true,
// //           targetPrice: undefined,
// //           notes: '',
// //         });
// //       }
// //     }
// //   }, [isOpen, searchParams, onOpenChange, toast, form]);

// //   const onSubmit = async (data: RequestFormValues) => {
// //     if (!firestore || !user || !searchParams.origin || !searchParams.destination || !searchParams.departureDate) {
// //       toast({ variant: 'destructive', title: 'خطأ', description: 'البيانات الأساسية مفقودة.' });
// //       return;
// //     }
// //     setIsSubmitting(true);
// //     try {
// //       const tripsCollection = collection(firestore, 'trips');
// //       const tripRequestData: any = {
// //         ...data,
// //         origin: searchParams.origin,
// //         destination: searchParams.destination,
// //         passengers: searchParams.passengers,
// //         passengersDetails: [],
// //         departureDate: searchParams.departureDate.toISOString(),
// //         status: 'Awaiting-Offers' as const,
// //         userId: user.uid,
// //         requestType: searchParams.requestType,
// //         targetCarrierId: searchParams.targetCarrierId || null,
// //         createdAt: serverTimestamp(),
// //         updatedAt: serverTimestamp(),
// //       };
// //       if (tripRequestData.targetPrice === undefined) delete tripRequestData.targetPrice;
// //       if (!tripRequestData.notes) delete tripRequestData.notes;

// //       // ✅ استخدم addDoc بدل addDocumentNonBlocking عشان تاخد الـ ID
// //       const { addDoc, doc, updateDoc } = await import('firebase/firestore');
// //       const newTripRef = await addDoc(tripsCollection, tripRequestData);

// //       // ✅ احفظ activeIntentId في الـ user

// //       try {
// //         await updateDoc(doc(firestore, 'users', user.uid), {
// //           activeIntentId: newTripRef.id,
// //           updatedAt: serverTimestamp(),
// //         });
// //         console.log('[Request] activeIntentId saved:', newTripRef.id); // ✅
// //       } catch (e) {
// //         console.error('[Request] Failed to save activeIntentId:', e); // ❌
// //       }
// //       // await updateDoc(doc(firestore, 'users', user.uid), {
// //       //   activeIntentId: newTripRef.id,
// //       //   updatedAt: serverTimestamp(),
// //       // });

// //       onOpenChange(false);
// //       onSuccess();
// //     } catch (error) {
// //       console.error('Failed to create trip request:', error);
// //       toast({ variant: 'destructive', title: 'فشل إرسال الطلب' });
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };
// //   if (!searchParams.origin || !searchParams.destination || !searchParams.departureDate) {
// //     return null;
// //   }

// //   return (
// //     <Dialog open={isOpen} onOpenChange={onOpenChange}>
// //       <DialogContent className="sm:max-w-md">
// //         <DialogHeader>
// //           <DialogTitle>إرسال طلب رحلة</DialogTitle>
// //           <DialogDescription>
// //             أكمل التفاصيل التالية لإرسال طلبك إلى {searchParams.requestType === 'General' ? 'السوق العام' : 'الناقل المحدد'}.
// //           </DialogDescription>
// //         </DialogHeader>
// //         <Form {...form}>
// //           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

// //             <div className="p-3 border rounded-lg bg-muted/50 space-y-2 text-sm">
// //               <p className="flex justify-between"><strong>من:</strong> <span>{searchParams.origin}</span></p>
// //               <p className="flex justify-between"><strong>إلى:</strong> <span>{searchParams.destination}</span></p>
// //               <p className="flex justify-between">
// //                 <strong>التاريخ:</strong>
// //                 <span>{searchParams.departureDate ? new Date(searchParams.departureDate).toLocaleDateString('ar-SA') : 'N/A'}</span>
// //               </p>
// //               <p className="flex justify-between"><strong>عدد الركاب:</strong> <span>{searchParams.passengers}</span></p>
// //               {/* <p className="flex justify-between"><strong>عدد الركاب:</strong> <span>{searchParams.nationality}</span></p> */}

// //               {/* ✅ اسم الناقل */}
// //               {searchParams.carrierName && (
// //                 <p className="flex justify-between items-center">
// //                   <strong className="flex items-center gap-1">
// //                     <User className="h-3.5 w-3.5" /> الناقل:
// //                   </strong>
// //                   <span className="font-semibold text-primary">{searchParams.carrierName}</span>
// //                 </p>
// //               )}

// //               {/* ✅ نوع المركبة */}
// //               {searchParams.vehicleType && (
// //                 <p className="flex justify-between items-center">
// //                   <strong className="flex items-center gap-1">
// //                     <Bus className="h-3.5 w-3.5" /> المركبة:
// //                   </strong>
// //                   <span className="font-semibold">{searchParams.vehicleType}</span>
// //                 </p>
// //               )}
// //             </div>

// //             <DialogFooter className="gap-2 sm:gap-0 pt-4">
// //               <Button type="button" variant="secondary" onClick={() => onOpenChange(false)} disabled={isSubmitting}>إلغاء</Button>
// //               <Button type="submit" disabled={isSubmitting}>
// //                 {isSubmitting
// //                   ? <><Loader2 className="ml-2 h-4 w-4 animate-spin" /> جاري الإرسال...</>
// //                   : <><Send className="ml-2 h-4 w-4" /> إرسال الطلب</>
// //                 }
// //               </Button>
// //             </DialogFooter>
// //           </form>
// //         </Form>
// //       </DialogContent>
// //     </Dialog>
// //   );
// // }

// 'use client';

// import { useState, useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { useToast } from '@/hooks/use-toast';
// import { useFirestore, useUser, addDocumentNonBlocking } from '@/firebase';
// import { collection, serverTimestamp } from 'firebase/firestore';
// import { Loader2, Send, Car, Share2, User, Bus, Baby, Users } from 'lucide-react';
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
// import { Label } from '@/components/ui/label';
// import { Switch } from '@/components/ui/switch';
// import { ScrollArea } from '../ui/scroll-area';
// import { Badge } from '@/components/ui/badge';

// // نوع الراكب
// type PassengerType = 'adult' | 'child' | 'infant';

// interface PassengerDetail {
//   type: PassengerType;
// }

// const requestSchema = z.object({
//   preferredVehicle: z.enum(['any', 'small', 'bus']).default('any'),
//   isShared: z.boolean().default(true),
//   targetPrice: z.coerce.number().optional(),
//   notes: z.string().max(200, 'الملاحظات يجب ألا تتجاوز 200 حرف').optional(),
// });

// type RequestFormValues = z.infer<typeof requestSchema>;

// interface RequestDialogProps {
//   isOpen: boolean;
//   onOpenChange: (isOpen: boolean) => void;
//   showValidationToast?: boolean;
//   searchParams: {
//     origin: string;
//     destination: string;
//     departureDate?: Date;
//     passengers: number;
//     passengerDetails?: PassengerDetail[];   // ✅ تفاصيل أنواع الركاب
//     requestType: 'General' | 'Direct';
//     targetCarrierId?: string;
//     carrierName?: string;
//     vehicleType?: string;
//   };
//   onSuccess: () => void;
// }

// // ✅ helper: أيقونة ونص نوع الراكب
// const passengerTypeInfo = (type: PassengerType) => {
//   switch (type) {
//     case 'adult': return { label: 'بالغ', icon: User, color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
//     case 'child': return { label: 'قاصر', icon: Users, color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' };
//     case 'infant': return { label: 'رضيع', icon: Baby, color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' };
//   }
// };

// export function RequestDialog({
//   isOpen,
//   onOpenChange,
//   searchParams,
//   onSuccess,
//   showValidationToast = false,
// }: RequestDialogProps) {
//   const { toast } = useToast();
//   const firestore = useFirestore();
//   const { user } = useUser();
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const form = useForm<RequestFormValues>({
//     resolver: zodResolver(requestSchema),
//     defaultValues: {
//       preferredVehicle: 'any',
//       isShared: true,
//       targetPrice: undefined,
//       notes: '',
//     },
//   });

//   useEffect(() => {
//     if (isOpen) {
//       if (!searchParams.origin || !searchParams.destination || !searchParams.departureDate) {
//         if (showValidationToast) {
//           toast({
//             variant: "destructive",
//             title: "بيانات غير مكتملة",
//             description: "يجب تحديد الأصل والوجهة والتاريخ أولاً.",
//           });
//         }
//         setTimeout(() => onOpenChange(false), 0);
//       } else {
//         form.reset({
//           preferredVehicle: 'any',
//           isShared: true,
//           targetPrice: undefined,
//           notes: '',
//         });
//       }
//     }
//   }, [isOpen, searchParams, onOpenChange, toast, form]);

//   const onSubmit = async (data: RequestFormValues) => {
//     if (!firestore || !user || !searchParams.origin || !searchParams.destination || !searchParams.departureDate) {
//       toast({ variant: 'destructive', title: 'خطأ', description: 'البيانات الأساسية مفقودة.' });
//       return;
//     }
//     setIsSubmitting(true);
//     try {
//       const tripsCollection = collection(firestore, 'trips');

//       // ✅ بناء تفاصيل الركاب مع أنواعهم
//       const passengersDetails = (searchParams.passengerDetails || []).map((p, idx) => ({
//         index: idx + 1,
//         type: p.type,
//         typeLabel: passengerTypeInfo(p.type).label,
//       }));

//       const tripRequestData: any = {
//         ...data,
//         origin: searchParams.origin,
//         destination: searchParams.destination,
//         passengers: searchParams.passengers,
//         passengersDetails,                          // ✅ تفاصيل أنواع الركاب
//         departureDate: searchParams.departureDate.toISOString(),
//         status: 'Awaiting-Offers' as const,
//         userId: user.uid,
//         requestType: searchParams.requestType,
//         targetCarrierId: searchParams.targetCarrierId || null,
//         carrierName: searchParams.carrierName || null,
//         vehicleType: searchParams.vehicleType || null,
//         createdAt: serverTimestamp(),
//         updatedAt: serverTimestamp(),
//       };
//       if (tripRequestData.targetPrice === undefined) delete tripRequestData.targetPrice;
//       if (!tripRequestData.notes) delete tripRequestData.notes;

//       const { addDoc, doc, updateDoc } = await import('firebase/firestore');
//       const newTripRef = await addDoc(tripsCollection, tripRequestData);

//       try {
//         await updateDoc(doc(firestore, 'users', user.uid), {
//           activeIntentId: newTripRef.id,
//           updatedAt: serverTimestamp(),
//         });
//       } catch (e) {
//         console.error('[Request] Failed to save activeIntentId:', e);
//       }

//       onOpenChange(false);
//       onSuccess();
//     } catch (error) {
//       console.error('Failed to create trip request:', error);
//       toast({ variant: 'destructive', title: 'فشل إرسال الطلب' });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (!searchParams.origin || !searchParams.destination || !searchParams.departureDate) {
//     return null;
//   }

//   // ✅ ملخص أنواع الركاب
//   const passengerSummary = searchParams.passengerDetails
//     ? (() => {
//       const counts = { adult: 0, child: 0, infant: 0 };
//       searchParams.passengerDetails.forEach(p => counts[p.type]++);
//       return counts;
//     })()
//     : null;

//   return (
//     <Dialog open={isOpen} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle>إرسال طلب رحلة</DialogTitle>
//           <DialogDescription>
//             أكمل التفاصيل التالية لإرسال طلبك إلى {searchParams.requestType === 'General' ? 'السوق العام' : 'الناقل المحدد'}.
//           </DialogDescription>
//         </DialogHeader>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

//             {/* ملخص بيانات الرحلة */}
//             <div className="p-3 border rounded-lg bg-muted/50 space-y-2 text-sm">
//               <p className="flex justify-between"><strong>من:</strong> <span>{searchParams.origin}</span></p>
//               <p className="flex justify-between"><strong>إلى:</strong> <span>{searchParams.destination}</span></p>
//               <p className="flex justify-between">
//                 <strong>التاريخ:</strong>
//                 <span>{searchParams.departureDate ? new Date(searchParams.departureDate).toLocaleDateString('ar-SA') : 'N/A'}</span>
//               </p>
//               <p className="flex justify-between"><strong>إجمالي الركاب:</strong> <span>{searchParams.passengers}</span></p>

//               {/* ✅ تفاصيل أنواع الركاب */}
//               {searchParams.passengerDetails && searchParams.passengerDetails.length > 0 && (
//                 <div className="pt-1 space-y-1 ">
//                   <strong className="flex items-center gap-1 text-xs text-white">
//                     <Users className="h-3.5 w-3.5" /> تفاصيل الركاب:
//                   </strong>
//                   <div className="flex flex-wrap gap-2 pt-1">
//                     {searchParams.passengerDetails.map((p, idx) => {
//                       const info = passengerTypeInfo(p.type);
//                       const Icon = info.icon;
//                       return (
//                         <span
//                           key={idx}
//                           className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border font-medium ${info.color}`}
//                         >
//                           <Icon className="h-3 w-3" />
//                           راكب {idx + 1}: {info.label}
//                         </span>
//                       );
//                     })}
//                   </div>

//                   {/* ✅ ملخص عدد كل نوع */}
//                   {/* {passengerSummary && (
//                     <div className="flex flex-wrap gap-2 pt-1 border-t border-muted/50 mt-2">
//                       {passengerSummary.adult > 0 && (
//                         <span className="text-xs text-muted-foreground flex items-center gap-1">
//                           <User className="h-3 w-3" /> {passengerSummary.adult} بالغ
//                         </span>
//                       )}
//                       {passengerSummary.child > 0 && (
//                         <span className="text-xs text-muted-foreground flex items-center gap-1">
//                           <Users className="h-3 w-3" /> {passengerSummary.child} قاصر
//                         </span>
//                       )}
//                       {passengerSummary.infant > 0 && (
//                         <span className="text-xs text-muted-foreground flex items-center gap-1">
//                           <Baby className="h-3 w-3" /> {passengerSummary.infant} رضيع
//                         </span>
//                       )}
//                     </div>
//                   )} */}
//                 </div>
//               )}

//               {/* اسم الناقل */}
//               {searchParams.carrierName && (
//                 <p className="flex justify-between items-center">
//                   <strong className="flex items-center gap-1">
//                     <User className="h-3.5 w-3.5" /> الناقل:
//                   </strong>
//                   <span className="font-semibold text-primary">{searchParams.carrierName}</span>
//                 </p>
//               )}

//               {/* نوع المركبة */}
//               {searchParams.vehicleType && (
//                 <p className="flex justify-between items-center">
//                   <strong className="flex items-center gap-1">
//                     <Bus className="h-3.5 w-3.5" /> المركبة:
//                   </strong>
//                   <span className="font-semibold">{searchParams.vehicleType}</span>
//                 </p>
//               )}
//             </div>

//             <DialogFooter className="gap-2 sm:gap-0 pt-4">
//               <Button type="button" variant="secondary" onClick={() => onOpenChange(false)} disabled={isSubmitting}>إلغاء</Button>
//               <Button type="submit" disabled={isSubmitting}>
//                 {isSubmitting
//                   ? <><Loader2 className="ml-2 h-4 w-4 animate-spin" /> جاري الإرسال...</>
//                   : <><Send className="ml-2 h-4 w-4" /> إرسال الطلب</>
//                 }
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useUser, addDocumentNonBlocking } from '@/firebase';
import { useUserProfile } from '@/hooks/use-user-profile';
import { collection, serverTimestamp } from 'firebase/firestore';
import { Loader2, Send, Car, Share2, User, Bus, Baby, Users } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';

// نوع الراكب
type PassengerType = 'adult' | 'child' | 'infant';

interface PassengerDetail {
  type: PassengerType;
}

const requestSchema = z.object({
  preferredVehicle: z.enum(['any', 'small', 'bus']).default('any'),
  isShared: z.boolean().default(true),
  targetPrice: z.coerce.number().optional(),
  notes: z.string().max(200, 'الملاحظات يجب ألا تتجاوز 200 حرف').optional(),
});

type RequestFormValues = z.infer<typeof requestSchema>;

interface RequestDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  showValidationToast?: boolean;
  searchParams: {
    origin: string;
    destination: string;
    departureDate?: Date;
    passengers: number;
    passengerDetails?: PassengerDetail[];   // ✅ تفاصيل أنواع الركاب
    requestType: 'General' | 'Direct';
    targetCarrierId?: string;
    carrierName?: string;
    vehicleType?: string;
  };
  onSuccess: () => void;
}

// ✅ helper: أيقونة ونص نوع الراكب
const passengerTypeInfo = (type: PassengerType) => {
  switch (type) {
    case 'adult': return { label: 'بالغ', icon: User, color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
    case 'child': return { label: 'قاصر', icon: Users, color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' };
    case 'infant': return { label: 'رضيع', icon: Baby, color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' };
  }
};

export function RequestDialog({
  isOpen,
  onOpenChange,
  searchParams,
  onSuccess,
  showValidationToast = false,
}: RequestDialogProps) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();
  const { profile } = useUserProfile();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = useTranslations("reqestDaialog")
  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      preferredVehicle: 'any',
      isShared: true,
      targetPrice: undefined,
      notes: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (!searchParams.origin || !searchParams.destination || !searchParams.departureDate) {
        if (showValidationToast) {
          toast({
            variant: "destructive",
            title: "بيانات غير مكتملة",
            description: "يجب تحديد الأصل والوجهة والتاريخ أولاً.",
          });
        }
        setTimeout(() => onOpenChange(false), 0);
      } else {
        form.reset({
          preferredVehicle: 'any',
          isShared: true,
          targetPrice: undefined,
          notes: '',
        });
      }
    }
  }, [isOpen, searchParams, onOpenChange, toast, form]);

  const onSubmit = async (data: RequestFormValues) => {
    if (!firestore || !user || !searchParams.origin || !searchParams.destination || !searchParams.departureDate) {
      toast({ variant: 'destructive', title: 'خطأ', description: 'البيانات الأساسية مفقودة.' });
      return;
    }
    setIsSubmitting(true);
    try {
      const tripsCollection = collection(firestore, 'trips');

      // ✅ بناء تفاصيل الركاب مع أنواعهم
      const passengersDetails = (searchParams.passengerDetails || []).map((p, idx) => ({
        index: idx + 1,
        type: p.type,
        typeLabel: passengerTypeInfo(p.type).label,
      }));

      const tripRequestData: any = {
        ...data,
        origin: searchParams.origin,
        destination: searchParams.destination,
        passengers: searchParams.passengers,
        passengersDetails,
        departureDate: searchParams.departureDate.toISOString(),
        status: 'Awaiting-Offers' as const,
        userId: user.uid,
        // ✅ بيانات المسافر للناقل
        travelerName: [profile?.firstName, profile?.lastName].filter(Boolean).join(' ') || profile?.displayName || profile?.fullName || '',
        travelerPhone: profile?.phoneNumber || '',
        travelerPhoneCode: profile?.phoneCountryCode || '',
        requestType: searchParams.requestType,
        targetCarrierId: searchParams.targetCarrierId || null,
        carrierName: searchParams.carrierName || null,
        vehicleType: searchParams.vehicleType || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      if (tripRequestData.targetPrice === undefined) delete tripRequestData.targetPrice;
      if (!tripRequestData.notes) delete tripRequestData.notes;

      const { addDoc, doc, updateDoc } = await import('firebase/firestore');
      const newTripRef = await addDoc(tripsCollection, tripRequestData);

      try {
        await updateDoc(doc(firestore, 'users', user.uid), {
          activeIntentId: newTripRef.id,
          updatedAt: serverTimestamp(),
        });
      } catch (e) {
        console.error('[Request] Failed to save activeIntentId:', e);
      }

      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error('Failed to create trip request:', error);
      toast({ variant: 'destructive', title: 'فشل إرسال الطلب' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!searchParams.origin || !searchParams.destination || !searchParams.departureDate) {
    return null;
  }

  // ✅ ملخص أنواع الركاب
  const passengerSummary = searchParams.passengerDetails
    ? (() => {
      const counts = { adult: 0, child: 0, infant: 0 };
      searchParams.passengerDetails.forEach(p => counts[p.type]++);
      return counts;
    })()
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>
            {t('desc')}
            {searchParams.requestType === 'General' ? 'السوق العام' : 'الناقل المحدد'}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            {/* ملخص بيانات الرحلة */}
            <div className="p-3 border rounded-lg bg-muted/50 space-y-2 text-sm">
              <p className="flex justify-between"><strong>{t('from')}:</strong> <span>{searchParams.origin}</span></p>
              <p className="flex justify-between"><strong>{t('to')}:</strong> <span>{searchParams.destination}</span></p>
              <p className="flex justify-between">
                <strong>التاريخ:</strong>
                <span>{searchParams.departureDate ? new Date(searchParams.departureDate).toLocaleDateString('ar-SA') : 'N/A'}</span>
              </p>
              <p className="flex justify-between"><strong> {t('totalseats')}:</strong> <span>{searchParams.passengers}</span></p>

              {/* ✅ تفاصيل أنواع الركاب */}
              {searchParams.passengerDetails && searchParams.passengerDetails.length > 0 && (
                <div className="pt-1 space-y-1 ">
                  <strong className="flex items-center gap-1 text-xs text-white">
                    <Users className="h-3.5 w-3.5" />  {t('detailstravel')}:
                  </strong>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {searchParams.passengerDetails.map((p, idx) => {
                      const info = passengerTypeInfo(p.type);
                      const Icon = info.icon;
                      return (
                        <span
                          key={idx}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border font-medium ${info.color}`}
                        >
                          <Icon className="h-3 w-3" />
                          راكب {idx + 1}: {info.label}
                        </span>
                      );
                    })}
                  </div>

                  {/* ✅ ملخص عدد كل نوع */}
                  {/* {passengerSummary && (
                    <div className="flex flex-wrap gap-2 pt-1 border-t border-muted/50 mt-2">
                      {passengerSummary.adult > 0 && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <User className="h-3 w-3" /> {passengerSummary.adult} بالغ
                        </span>
                      )}
                      {passengerSummary.child > 0 && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Users className="h-3 w-3" /> {passengerSummary.child} قاصر
                        </span>
                      )}
                      {passengerSummary.infant > 0 && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Baby className="h-3 w-3" /> {passengerSummary.infant} رضيع
                        </span>
                      )}
                    </div>
                  )} */}
                </div>
              )}

              {/* اسم الناقل */}
              {searchParams.carrierName && (
                <p className="flex justify-between items-center">
                  <strong className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5" /> {t('nameCarreir')}:
                  </strong>
                  <span className="font-semibold text-primary">{searchParams.carrierName}</span>
                </p>
              )}

              {/* نوع المركبة */}
              {searchParams.vehicleType && (
                <p className="flex justify-between items-center">
                  <strong className="flex items-center gap-1">
                    <Bus className="h-3.5 w-3.5" /> {t('typeV')}:
                  </strong>
                  <span className="font-semibold">{searchParams.vehicleType}</span>
                </p>
              )}
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-4">
              <Button type="button" variant="secondary" onClick={() => onOpenChange(false)} disabled={isSubmitting}>إلغاء</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? <><Loader2 className="ml-2 h-4 w-4 animate-spin" /> جاري الإرسال...</>
                  : <><Send className="ml-2 h-4 w-4" /> إرسال الطلب</>
                }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}