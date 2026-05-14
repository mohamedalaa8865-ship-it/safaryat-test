// // // 'use client';

// // // import { useState } from 'react';
// // // import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// // // import { Button } from '@/components/ui/button';
// // // import { Textarea } from '@/components/ui/textarea';
// // // import { Star, Loader2, ThumbsUp, ThumbsDown, Car, DollarSign } from 'lucide-react';
// // // import { useToast } from '@/hooks/use-toast';
// // // import { useFirestore, useUser } from '@/firebase';
// // // import { doc, serverTimestamp, setDoc, collection } from 'firebase/firestore';
// // // import { cn } from '@/lib/utils';
// // // import type { Trip } from '@/lib/data';

// // // interface RateTripDialogProps {
// // //   isOpen: boolean;
// // //   onOpenChange: (open: boolean) => void;
// // //   trip: Trip | null;
// // //   onConfirm: () => void;
// // // }

// // // export function RateTripDialog({ isOpen, onOpenChange, trip, onConfirm }: RateTripDialogProps) {
// // //   const { toast } = useToast();
// // //   const firestore = useFirestore();
// // //   const { user } = useUser();

// // //   const [isSubmitting, setIsSubmitting] = useState(false);
// // //   const [stars, setStars] = useState(0);
// // //   const [comment, setComment] = useState('');

// // //   // Specific Criteria (Simple Yes/No for objectivity)
// // //   const [priceAdherence, setPriceAdherence] = useState<boolean | null>(null); // Did carrier stick to price?
// // //   const [vehicleMatch, setVehicleMatch] = useState<boolean | null>(null);     // Was the car as advertised?

// // //   if (!trip) return null;

// // //   const handleSubmit = async () => {
// // //     if (!firestore || !user || !trip.carrierId) return;

// // //     if (stars === 0) {
// // //         toast({ variant: "destructive", title: "التقييم مطلوب", description: "يرجى اختيار عدد النجوم." });
// // //         return;
// // //     }
// // //     if (priceAdherence === null || vehicleMatch === null) {
// // //         toast({ variant: "destructive", title: "معلومات ناقصة", description: "يرجى الإجابة على أسئلة الالتزام." });
// // //         return;
// // //     }

// // //     setIsSubmitting(true);
// // //     try {
// // //       // 1. Prepare the Payload (Direct Write to Firestore)
// // //       const ratingRef = doc(collection(firestore, 'ratings'));

// // //       const ratingData = {
// // //         id: ratingRef.id,
// // //         tripId: trip.id,
// // //         carrierId: trip.carrierId,
// // //         userId: user.uid,
// // //         // Raw Data for Cloud Function to process
// // //         details: {
// // //             serviceStars: stars,
// // //             priceAdherence: priceAdherence,
// // //             vehicleMatch: vehicleMatch,
// // //             comment: comment.trim()
// // //         },
// // //         // Placeholder ratingValue (will be calculated by Cloud Function)
// // //         ratingValue: 0, 
// // //         createdAt: serverTimestamp(),
// // //       };

// // //       // 2. Execute Write Operation (Protocol 88: Single Request)
// // //       await setDoc(ratingRef, ratingData);

// // //       toast({
// // //         title: "تم استلام التقييم بنجاح",
// // //         description: "شكراً لك! رأيك يساهم في رفع جودة الخدمة.",
// // //       });

// // //       // 3. Close & Reset
// // //       onConfirm(); 
// // //       onOpenChange(false);
// // //       setStars(0);
// // //       setComment('');
// // //       setPriceAdherence(null);
// // //       setVehicleMatch(null);

// // //     } catch (error) {
// // //       console.error("Rating submission error:", error);
// // //       toast({ variant: "destructive", title: "فشل الإرسال", description: "حدث خطأ أثناء حفظ التقييم." });
// // //     } finally {
// // //       setIsSubmitting(false);
// // //     }
// // //   };

// // //   return (
// // //     <Dialog open={isOpen} onOpenChange={onOpenChange}>
// // //       <DialogContent className="sm:max-w-[425px]">
// // //         <DialogHeader>
// // //           <DialogTitle className="text-center">كيف كانت رحلتك؟</DialogTitle>
// // //           <DialogDescription className="text-center">
// // //             تقييمك للكابتن {trip.carrierName} يساعدنا في ضمان الجودة.
// // //           </DialogDescription>
// // //         </DialogHeader>

// // //         <div className="grid gap-6 py-4">

// // //           {/* 1. Star Rating */}
// // //           <div className="flex justify-center gap-2">
// // //             {[1, 2, 3, 4, 5].map((star) => (
// // //               <button
// // //                 key={star}
// // //                 type="button"
// // //                 onClick={() => setStars(star)}
// // //                 className="focus:outline-none transition-transform hover:scale-110"
// // //               >
// // //                 <Star 
// // //                     className={cn(
// // //                         "h-8 w-8 transition-colors", 
// // //                         star <= stars ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
// // //                     )} 
// // //                 />
// // //               </button>
// // //             ))}
// // //           </div>

// // //           {/* 2. Objective Criteria */}
// // //           <div className="space-y-3 bg-muted/30 p-3 rounded-lg border border-dashed">
// // //              {/* Price Adherence */}
// // //              <div className="flex items-center justify-between">
// // //                 <span className="text-sm flex items-center gap-2"><DollarSign className="h-4 w-4"/> هل التزم بالسعر؟</span>
// // //                 <div className="flex gap-2">
// // //                     <Button 
// // //                         size="sm" 
// // //                         variant={priceAdherence === true ? "default" : "outline"} 
// // //                         className={cn("h-7 px-2", priceAdherence === true && "bg-green-600 hover:bg-green-700")}
// // //                         onClick={() => setPriceAdherence(true)}
// // //                     >
// // //                         <ThumbsUp className="h-3 w-3" />
// // //                     </Button>
// // //                     <Button 
// // //                         size="sm" 
// // //                         variant={priceAdherence === false ? "destructive" : "outline"} 
// // //                         className="h-7 px-2"
// // //                         onClick={() => setPriceAdherence(false)}
// // //                     >
// // //                         <ThumbsDown className="h-3 w-3" />
// // //                     </Button>
// // //                 </div>
// // //              </div>

// // //              {/* Vehicle Match */}
// // //              <div className="flex items-center justify-between">
// // //                 <span className="text-sm flex items-center gap-2"><Car className="h-4 w-4"/> هل المركبة مطابقة؟</span>
// // //                 <div className="flex gap-2">
// // //                     <Button 
// // //                         size="sm" 
// // //                         variant={vehicleMatch === true ? "default" : "outline"} 
// // //                         className={cn("h-7 px-2", vehicleMatch === true && "bg-green-600 hover:bg-green-700")}
// // //                         onClick={() => setVehicleMatch(true)}
// // //                     >
// // //                         <ThumbsUp className="h-3 w-3" />
// // //                     </Button>
// // //                     <Button 
// // //                         size="sm" 
// // //                         variant={vehicleMatch === false ? "destructive" : "outline"} 
// // //                         className="h-7 px-2"
// // //                         onClick={() => setVehicleMatch(false)}
// // //                     >
// // //                         <ThumbsDown className="h-3 w-3" />
// // //                     </Button>
// // //                 </div>
// // //              </div>
// // //           </div>

// // //           {/* 3. Comment */}
// // //           <Textarea
// // //             placeholder="اكتب ملاحظاتك هنا (اختياري)..."
// // //             value={comment}
// // //             onChange={(e) => setComment(e.target.value)}
// // //             className="resize-none"
// // //             maxLength={200}
// // //           />
// // //         </div>

// // //         <DialogFooter>
// // //           <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
// // //             تخطي
// // //           </Button>
// // //           <Button onClick={handleSubmit} disabled={isSubmitting || stars === 0}>
// // //             {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "إرسال التقييم"}
// // //           </Button>
// // //         </DialogFooter>
// // //       </DialogContent>
// // //     </Dialog>
// // //   );
// // // }

// // 'use client';

// // import { useState } from 'react';
// // import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// // import { Button } from '@/components/ui/button';
// // import { Textarea } from '@/components/ui/textarea';
// // import { Star, Loader2, ThumbsUp, ThumbsDown, Car, DollarSign, MapPin } from 'lucide-react';
// // import { useToast } from '@/hooks/use-toast';
// // import { useFirestore, useUser } from '@/firebase';
// // import { doc, serverTimestamp, setDoc, collection, updateDoc, getDoc } from 'firebase/firestore';
// // import { cn } from '@/lib/utils';
// // import type { Trip } from '@/lib/data';

// // interface RateTripDialogProps {
// //   isOpen: boolean;
// //   onOpenChange: (open: boolean) => void;
// //   trip: Trip | null;
// //   onConfirm: () => void;
// //   onNewTrip?: () => void;
// // }

// // export function RateTripDialog({ isOpen, onOpenChange, trip, onConfirm, onNewTrip }: RateTripDialogProps) {
// //   const { toast } = useToast();
// //   const firestore = useFirestore();
// //   const { user } = useUser();

// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const [isDone, setIsDone] = useState(false);
// //   const [stars, setStars] = useState(0);
// //   const [comment, setComment] = useState('');
// //   const [priceAdherence, setPriceAdherence] = useState<boolean | null>(null);
// //   const [vehicleMatch, setVehicleMatch] = useState<boolean | null>(null);

// //   if (!trip) return null;

// //   const calculateRatingValue = (serviceStars: number, price: boolean, vehicle: boolean): number => {
// //     const starsScore = (serviceStars / 5) * 0.7;
// //     const criteriaScore = ((price ? 1 : 0) + (vehicle ? 1 : 0)) / 2 * 0.3;
// //     return parseFloat(((starsScore + criteriaScore) * 5).toFixed(2));
// //   };

// //   const handleSubmit = async () => {
// //     if (!firestore || !user || !trip.carrierId) return;

// //     if (stars === 0) {
// //       toast({ variant: "destructive", title: "التقييم مطلوب", description: "يرجى اختيار عدد النجوم." });
// //       return;
// //     }
// //     if (priceAdherence === null || vehicleMatch === null) {
// //       toast({ variant: "destructive", title: "معلومات ناقصة", description: "يرجى الإجابة على أسئلة الالتزام." });
// //       return;
// //     }

// //     setIsSubmitting(true);
// //     try {
// //       const ratingValue = calculateRatingValue(stars, priceAdherence, vehicleMatch);

// //       // 1. حفظ التقييم
// //       const ratingRef = doc(collection(firestore, 'ratings'));
// //       await setDoc(ratingRef, {
// //         id: ratingRef.id,
// //         tripId: trip.id,
// //         carrierId: trip.carrierId,
// //         userId: user.uid,
// //         details: { serviceStars: stars, priceAdherence, vehicleMatch, comment: comment.trim() },
// //         ratingValue,
// //         createdAt: serverTimestamp(),
// //       });

// //       // 2. تحديث ratingStats للناقل
// //       const carrierRef = doc(firestore, 'users', trip.carrierId);
// //       const carrierSnap = await getDoc(carrierRef);
// //       if (carrierSnap.exists()) {
// //         const currentStats = carrierSnap.data().ratingStats || { average: 0, count: 0, tier: 'bronze' };
// //         const newCount = (currentStats.count || 0) + 1;
// //         const newAverage = (((currentStats.average || 0) * (currentStats.count || 0)) + ratingValue) / newCount;
// //         let newTier = 'bronze';
// //         if (newAverage >= 4.5 && newCount >= 10) newTier = 'platinum';
// //         else if (newAverage >= 4.0 && newCount >= 5) newTier = 'gold';
// //         else if (newAverage >= 3.5) newTier = 'silver';
// //         await updateDoc(carrierRef, {
// //           'ratingStats.average': parseFloat(newAverage.toFixed(2)),
// //           'ratingStats.count': newCount,
// //           'ratingStats.tier': newTier,
// //           updatedAt: serverTimestamp(),
// //         });
// //       }

// //       // 3. تحديث حالة الحجز إلى Rated
// //       try {
// //         const { query, where, getDocs, collection: col } = await import('firebase/firestore');
// //         const bookingsSnap = await getDocs(query(col(firestore, 'bookings'), where('tripId', '==', trip.id), where('userId', '==', user.uid)));
// //         if (!bookingsSnap.empty) {
// //           await updateDoc(doc(firestore, 'bookings', bookingsSnap.docs[0].id), {
// //             status: 'Rated',
// //             ratedAt: serverTimestamp(),
// //           });
// //         }
// //       } catch (e) {
// //         console.warn('Could not update booking to Rated:', e);
// //       }

// //       toast({ title: "✅ تم إرسال التقييم بنجاح", description: "شكراً! تقييمك سيظهر في رحلات الناقل القادمة." });
// //       setIsDone(true);
// //       onConfirm();
// //     } catch (error) {
// //       console.error("Rating submission error:", error);
// //       toast({ variant: "destructive", title: "فشل الإرسال", description: "حدث خطأ أثناء حفظ التقييم." });
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   const handleClose = () => {
// //     onOpenChange(false);
// //     setTimeout(() => { setIsDone(false); setStars(0); setComment(''); setPriceAdherence(null); setVehicleMatch(null); }, 300);
// //   };

// //   const handleNewTrip = () => { handleClose(); onNewTrip?.(); };

// //   return (
// //     <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); else onOpenChange(true); }}>
// //       <DialogContent className="sm:max-w-[425px]">

// //         {isDone ? (
// //           <div className="text-center py-6 space-y-6">
// //             <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
// //               <div className="absolute inset-0 rounded-full bg-yellow-400/20 animate-ping" />
// //               <div className="relative h-16 w-16 rounded-full bg-yellow-400/10 border-2 border-yellow-400/40 flex items-center justify-center">
// //                 <span className="text-3xl">⭐</span>
// //               </div>
// //             </div>
// //             <div className="space-y-2">
// //               <div className="flex justify-center gap-1">
// //                 {[1, 2, 3, 4, 5].map(s => (
// //                   <Star key={s} className={cn("h-7 w-7", s <= stars ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30")} />
// //                 ))}
// //               </div>
// //               <p className="font-black text-xl">تم تقييم الرحلة!</p>
// //               <p className="text-sm text-muted-foreground font-bold">
// //                 أعطيت الكابتن <span className="text-primary font-black">{trip.carrierName}</span>{' '}
// //                 <span className="text-yellow-500 font-black">{stars} نجوم</span>
// //               </p>
// //               <p className="text-xs text-muted-foreground/60 font-bold">تقييمك سيظهر للمسافرين الآخرين في رحلات هذا الناقل</p>
// //             </div>
// //             <div className="space-y-3 pt-2">
// //               <Button onClick={handleNewTrip} className="w-full h-14 rounded-2xl font-black text-lg shadow-lg gap-2">
// //                 <MapPin className="h-5 w-5" /> احجز رحلة جديدة الآن
// //               </Button>
// //               <Button variant="outline" onClick={handleClose} className="w-full h-11 rounded-2xl font-bold">إغلاق</Button>
// //             </div>
// //           </div>
// //         ) : (
// //           <>
// //             <DialogHeader>
// //               <DialogTitle className="text-center">كيف كانت رحلتك؟</DialogTitle>
// //               <DialogDescription className="text-center">
// //                 تقييمك للكابتن <span className="font-black text-foreground">{trip.carrierName}</span> يساعد المسافرين الآخرين.
// //               </DialogDescription>
// //             </DialogHeader>
// //             <div className="grid gap-6 py-4">
// //               <div className="flex flex-col items-center gap-2">
// //                 <div className="flex justify-center gap-2">
// //                   {[1, 2, 3, 4, 5].map((star) => (
// //                     <button key={star} type="button" onClick={() => setStars(star)} className="focus:outline-none transition-transform hover:scale-110">
// //                       <Star className={cn("h-8 w-8 transition-colors", star <= stars ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground")} />
// //                     </button>
// //                   ))}
// //                 </div>
// //                 {stars > 0 && (
// //                   <p className="text-xs font-bold text-muted-foreground">
// //                     {stars === 1 ? 'سيء جداً' : stars === 2 ? 'سيء' : stars === 3 ? 'مقبول' : stars === 4 ? 'جيد' : 'ممتاز! 🎉'}
// //                   </p>
// //                 )}
// //               </div>
// //               <div className="space-y-3 bg-muted/30 p-3 rounded-lg border border-dashed">
// //                 <div className="flex items-center justify-between">
// //                   <span className="text-sm flex items-center gap-2"><DollarSign className="h-4 w-4" /> هل التزم بالسعر؟</span>
// //                   <div className="flex gap-2">
// //                     <Button size="sm" variant={priceAdherence === true ? "default" : "outline"} className={cn("h-7 px-2", priceAdherence === true && "bg-green-600 hover:bg-green-700")} onClick={() => setPriceAdherence(true)}><ThumbsUp className="h-3 w-3" /></Button>
// //                     <Button size="sm" variant={priceAdherence === false ? "destructive" : "outline"} className="h-7 px-2" onClick={() => setPriceAdherence(false)}><ThumbsDown className="h-3 w-3" /></Button>
// //                   </div>
// //                 </div>
// //                 <div className="flex items-center justify-between">
// //                   <span className="text-sm flex items-center gap-2"><Car className="h-4 w-4" /> هل المركبة مطابقة؟</span>
// //                   <div className="flex gap-2">
// //                     <Button size="sm" variant={vehicleMatch === true ? "default" : "outline"} className={cn("h-7 px-2", vehicleMatch === true && "bg-green-600 hover:bg-green-700")} onClick={() => setVehicleMatch(true)}><ThumbsUp className="h-3 w-3" /></Button>
// //                     <Button size="sm" variant={vehicleMatch === false ? "destructive" : "outline"} className="h-7 px-2" onClick={() => setVehicleMatch(false)}><ThumbsDown className="h-3 w-3" /></Button>
// //                   </div>
// //                 </div>
// //               </div>
// //               <Textarea placeholder="اكتب ملاحظاتك هنا (اختياري)..." value={comment} onChange={(e) => setComment(e.target.value)} className="resize-none" maxLength={200} />
// //             </div>
// //             <DialogFooter>
// //               <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>تخطي</Button>
// //               <Button onClick={handleSubmit} disabled={isSubmitting || stars === 0}>
// //                 {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "إرسال التقييم"}
// //               </Button>
// //             </DialogFooter>
// //           </>
// //         )}
// //       </DialogContent>
// //     </Dialog>
// //   );
// // }

// // 'use client';

// // import { useState } from 'react';
// // import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// // import { Button } from '@/components/ui/button';
// // import { Textarea } from '@/components/ui/textarea';
// // import { Star, Loader2, ThumbsUp, ThumbsDown, Car, DollarSign } from 'lucide-react';
// // import { useToast } from '@/hooks/use-toast';
// // import { useFirestore, useUser } from '@/firebase';
// // import { doc, serverTimestamp, setDoc, collection } from 'firebase/firestore';
// // import { cn } from '@/lib/utils';
// // import type { Trip } from '@/lib/data';

// // interface RateTripDialogProps {
// //   isOpen: boolean;
// //   onOpenChange: (open: boolean) => void;
// //   trip: Trip | null;
// //   onConfirm: () => void;
// // }

// // export function RateTripDialog({ isOpen, onOpenChange, trip, onConfirm }: RateTripDialogProps) {
// //   const { toast } = useToast();
// //   const firestore = useFirestore();
// //   const { user } = useUser();

// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const [stars, setStars] = useState(0);
// //   const [comment, setComment] = useState('');

// //   // Specific Criteria (Simple Yes/No for objectivity)
// //   const [priceAdherence, setPriceAdherence] = useState<boolean | null>(null); // Did carrier stick to price?
// //   const [vehicleMatch, setVehicleMatch] = useState<boolean | null>(null);     // Was the car as advertised?

// //   if (!trip) return null;

// //   const handleSubmit = async () => {
// //     if (!firestore || !user || !trip.carrierId) return;

// //     if (stars === 0) {
// //         toast({ variant: "destructive", title: "التقييم مطلوب", description: "يرجى اختيار عدد النجوم." });
// //         return;
// //     }
// //     if (priceAdherence === null || vehicleMatch === null) {
// //         toast({ variant: "destructive", title: "معلومات ناقصة", description: "يرجى الإجابة على أسئلة الالتزام." });
// //         return;
// //     }

// //     setIsSubmitting(true);
// //     try {
// //       // 1. Prepare the Payload (Direct Write to Firestore)
// //       const ratingRef = doc(collection(firestore, 'ratings'));

// //       const ratingData = {
// //         id: ratingRef.id,
// //         tripId: trip.id,
// //         carrierId: trip.carrierId,
// //         userId: user.uid,
// //         // Raw Data for Cloud Function to process
// //         details: {
// //             serviceStars: stars,
// //             priceAdherence: priceAdherence,
// //             vehicleMatch: vehicleMatch,
// //             comment: comment.trim()
// //         },
// //         // Placeholder ratingValue (will be calculated by Cloud Function)
// //         ratingValue: 0, 
// //         createdAt: serverTimestamp(),
// //       };

// //       // 2. Execute Write Operation (Protocol 88: Single Request)
// //       await setDoc(ratingRef, ratingData);

// //       toast({
// //         title: "تم استلام التقييم بنجاح",
// //         description: "شكراً لك! رأيك يساهم في رفع جودة الخدمة.",
// //       });

// //       // 3. Close & Reset
// //       onConfirm(); 
// //       onOpenChange(false);
// //       setStars(0);
// //       setComment('');
// //       setPriceAdherence(null);
// //       setVehicleMatch(null);

// //     } catch (error) {
// //       console.error("Rating submission error:", error);
// //       toast({ variant: "destructive", title: "فشل الإرسال", description: "حدث خطأ أثناء حفظ التقييم." });
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   return (
// //     <Dialog open={isOpen} onOpenChange={onOpenChange}>
// //       <DialogContent className="sm:max-w-[425px]">
// //         <DialogHeader>
// //           <DialogTitle className="text-center">كيف كانت رحلتك؟</DialogTitle>
// //           <DialogDescription className="text-center">
// //             تقييمك للكابتن {trip.carrierName} يساعدنا في ضمان الجودة.
// //           </DialogDescription>
// //         </DialogHeader>

// //         <div className="grid gap-6 py-4">

// //           {/* 1. Star Rating */}
// //           <div className="flex justify-center gap-2">
// //             {[1, 2, 3, 4, 5].map((star) => (
// //               <button
// //                 key={star}
// //                 type="button"
// //                 onClick={() => setStars(star)}
// //                 className="focus:outline-none transition-transform hover:scale-110"
// //               >
// //                 <Star 
// //                     className={cn(
// //                         "h-8 w-8 transition-colors", 
// //                         star <= stars ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
// //                     )} 
// //                 />
// //               </button>
// //             ))}
// //           </div>

// //           {/* 2. Objective Criteria */}
// //           <div className="space-y-3 bg-muted/30 p-3 rounded-lg border border-dashed">
// //              {/* Price Adherence */}
// //              <div className="flex items-center justify-between">
// //                 <span className="text-sm flex items-center gap-2"><DollarSign className="h-4 w-4"/> هل التزم بالسعر؟</span>
// //                 <div className="flex gap-2">
// //                     <Button 
// //                         size="sm" 
// //                         variant={priceAdherence === true ? "default" : "outline"} 
// //                         className={cn("h-7 px-2", priceAdherence === true && "bg-green-600 hover:bg-green-700")}
// //                         onClick={() => setPriceAdherence(true)}
// //                     >
// //                         <ThumbsUp className="h-3 w-3" />
// //                     </Button>
// //                     <Button 
// //                         size="sm" 
// //                         variant={priceAdherence === false ? "destructive" : "outline"} 
// //                         className="h-7 px-2"
// //                         onClick={() => setPriceAdherence(false)}
// //                     >
// //                         <ThumbsDown className="h-3 w-3" />
// //                     </Button>
// //                 </div>
// //              </div>

// //              {/* Vehicle Match */}
// //              <div className="flex items-center justify-between">
// //                 <span className="text-sm flex items-center gap-2"><Car className="h-4 w-4"/> هل المركبة مطابقة؟</span>
// //                 <div className="flex gap-2">
// //                     <Button 
// //                         size="sm" 
// //                         variant={vehicleMatch === true ? "default" : "outline"} 
// //                         className={cn("h-7 px-2", vehicleMatch === true && "bg-green-600 hover:bg-green-700")}
// //                         onClick={() => setVehicleMatch(true)}
// //                     >
// //                         <ThumbsUp className="h-3 w-3" />
// //                     </Button>
// //                     <Button 
// //                         size="sm" 
// //                         variant={vehicleMatch === false ? "destructive" : "outline"} 
// //                         className="h-7 px-2"
// //                         onClick={() => setVehicleMatch(false)}
// //                     >
// //                         <ThumbsDown className="h-3 w-3" />
// //                     </Button>
// //                 </div>
// //              </div>
// //           </div>

// //           {/* 3. Comment */}
// //           <Textarea
// //             placeholder="اكتب ملاحظاتك هنا (اختياري)..."
// //             value={comment}
// //             onChange={(e) => setComment(e.target.value)}
// //             className="resize-none"
// //             maxLength={200}
// //           />
// //         </div>

// //         <DialogFooter>
// //           <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
// //             تخطي
// //           </Button>
// //           <Button onClick={handleSubmit} disabled={isSubmitting || stars === 0}>
// //             {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "إرسال التقييم"}
// //           </Button>
// //         </DialogFooter>
// //       </DialogContent>
// //     </Dialog>
// //   );
// // }

// 'use client';

// import { useState } from 'react';
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Textarea } from '@/components/ui/textarea';
// import { Star, Loader2, ThumbsUp, ThumbsDown, Car, DollarSign, MapPin } from 'lucide-react';
// import { useToast } from '@/hooks/use-toast';
// import { useFirestore, useUser } from '@/firebase';
// import { doc, serverTimestamp, setDoc, collection, updateDoc, getDoc } from 'firebase/firestore';
// import { cn } from '@/lib/utils';
// import type { Trip } from '@/lib/data';

// interface RateTripDialogProps {
//   isOpen: boolean;
//   onOpenChange: (open: boolean) => void;
//   trip: Trip | null;
//   onConfirm: () => void;
//   onNewTrip?: () => void;
// }

// export function RateTripDialog({ isOpen, onOpenChange, trip, onConfirm, onNewTrip }: RateTripDialogProps) {
//   const { toast } = useToast();
//   const firestore = useFirestore();
//   const { user } = useUser();

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isDone, setIsDone] = useState(false);
//   const [stars, setStars] = useState(0);
//   const [comment, setComment] = useState('');
//   const [priceAdherence, setPriceAdherence] = useState<boolean | null>(null);
//   const [vehicleMatch, setVehicleMatch] = useState<boolean | null>(null);

//   if (!trip) return null;

//   const calculateRatingValue = (serviceStars: number, price: boolean, vehicle: boolean): number => {
//     const starsScore = (serviceStars / 5) * 0.7;
//     const criteriaScore = ((price ? 1 : 0) + (vehicle ? 1 : 0)) / 2 * 0.3;
//     return parseFloat(((starsScore + criteriaScore) * 5).toFixed(2));
//   };

//   const handleSubmit = async () => {
//     if (!user || !trip.carrierId) return;

//     if (stars === 0) {
//       toast({ variant: "destructive", title: "التقييم مطلوب", description: "يرجى اختيار عدد النجوم." });
//       return;
//     }
//     if (priceAdherence === null || vehicleMatch === null) {
//       toast({ variant: "destructive", title: "معلومات ناقصة", description: "يرجى الإجابة على أسئلة الالتزام." });
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const ratingValue = calculateRatingValue(stars, priceAdherence, vehicleMatch);

//       const res = await fetch('/api/rate', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           tripId: trip.id,
//           carrierId: trip.carrierId,
//           userId: user.uid,
//           ratingValue,
//           details: { serviceStars: stars, priceAdherence, vehicleMatch, comment: comment.trim() },
//         }),
//       });

//       if (!res.ok) {
//         const err = await res.json();
//         throw new Error(err.error || 'فشل الإرسال');
//       }

//       toast({ title: "✅ تم إرسال التقييم بنجاح", description: "شكراً! تقييمك سيظهر في رحلات الناقل القادمة." });
//       setIsDone(true);
//       onConfirm();
//     } catch (error) {
//       console.error("Rating submission error:", error);
//       toast({ variant: "destructive", title: "فشل الإرسال", description: "حدث خطأ أثناء حفظ التقييم." });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleClose = () => {
//     onOpenChange(false);
//     setTimeout(() => { setIsDone(false); setStars(0); setComment(''); setPriceAdherence(null); setVehicleMatch(null); }, 300);
//   };

//   const handleNewTrip = () => { handleClose(); onNewTrip?.(); };

//   return (
//     <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); else onOpenChange(true); }}>
//       <DialogContent className="sm:max-w-[425px]">

//         {isDone ? (
//           <div className="text-center py-6 space-y-6">
//             <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
//               <div className="absolute inset-0 rounded-full bg-yellow-400/20 animate-ping" />
//               <div className="relative h-16 w-16 rounded-full bg-yellow-400/10 border-2 border-yellow-400/40 flex items-center justify-center">
//                 <span className="text-3xl">⭐</span>
//               </div>
//             </div>
//             <div className="space-y-2">
//               <div className="flex justify-center gap-1">
//                 {[1, 2, 3, 4, 5].map(s => (
//                   <Star key={s} className={cn("h-7 w-7", s <= stars ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30")} />
//                 ))}
//               </div>
//               <p className="font-black text-xl">تم تقييم الرحلة!</p>
//               <p className="text-sm text-muted-foreground font-bold">
//                 أعطيت الكابتن <span className="text-primary font-black">{trip.carrierName}</span>{' '}
//                 <span className="text-yellow-500 font-black">{stars} نجوم</span>
//               </p>
//               <p className="text-xs text-muted-foreground/60 font-bold">تقييمك سيظهر للمسافرين الآخرين في رحلات هذا الناقل</p>
//             </div>
//             <div className="space-y-3 pt-2">
//               <Button onClick={handleNewTrip} className="w-full h-14 rounded-2xl font-black text-lg shadow-lg gap-2">
//                 <MapPin className="h-5 w-5" /> احجز رحلة جديدة الآن
//               </Button>
//               <Button variant="outline" onClick={handleClose} className="w-full h-11 rounded-2xl font-bold">إغلاق</Button>
//             </div>
//           </div>
//         ) : (
//           <>
//             <DialogHeader>
//               <DialogTitle className="text-center">كيف كانت رحلتك؟</DialogTitle>
//               <DialogDescription className="text-center">
//                 تقييمك للكابتن <span className="font-black text-foreground">{trip.carrierName}</span> يساعد المسافرين الآخرين.
//               </DialogDescription>
//             </DialogHeader>
//             <div className="grid gap-6 py-4">
//               <div className="flex flex-col items-center gap-2">
//                 <div className="flex justify-center gap-2">
//                   {[1, 2, 3, 4, 5].map((star) => (
//                     <button key={star} type="button" onClick={() => setStars(star)} className="focus:outline-none transition-transform hover:scale-110">
//                       <Star className={cn("h-8 w-8 transition-colors", star <= stars ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground")} />
//                     </button>
//                   ))}
//                 </div>
//                 {stars > 0 && (
//                   <p className="text-xs font-bold text-muted-foreground">
//                     {stars === 1 ? 'سيء جداً' : stars === 2 ? 'سيء' : stars === 3 ? 'مقبول' : stars === 4 ? 'جيد' : 'ممتاز! 🎉'}
//                   </p>
//                 )}
//               </div>
//               <div className="space-y-3 bg-muted/30 p-3 rounded-lg border border-dashed">
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm flex items-center gap-2"><DollarSign className="h-4 w-4" /> هل التزم بالسعر؟</span>
//                   <div className="flex gap-2">
//                     <Button size="sm" variant={priceAdherence === true ? "default" : "outline"} className={cn("h-7 px-2", priceAdherence === true && "bg-green-600 hover:bg-green-700")} onClick={() => setPriceAdherence(true)}><ThumbsUp className="h-3 w-3" /></Button>
//                     <Button size="sm" variant={priceAdherence === false ? "destructive" : "outline"} className="h-7 px-2" onClick={() => setPriceAdherence(false)}><ThumbsDown className="h-3 w-3" /></Button>
//                   </div>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm flex items-center gap-2"><Car className="h-4 w-4" /> هل المركبة مطابقة؟</span>
//                   <div className="flex gap-2">
//                     <Button size="sm" variant={vehicleMatch === true ? "default" : "outline"} className={cn("h-7 px-2", vehicleMatch === true && "bg-green-600 hover:bg-green-700")} onClick={() => setVehicleMatch(true)}><ThumbsUp className="h-3 w-3" /></Button>
//                     <Button size="sm" variant={vehicleMatch === false ? "destructive" : "outline"} className="h-7 px-2" onClick={() => setVehicleMatch(false)}><ThumbsDown className="h-3 w-3" /></Button>
//                   </div>
//                 </div>
//               </div>
//               <Textarea placeholder="اكتب ملاحظاتك هنا (اختياري)..." value={comment} onChange={(e) => setComment(e.target.value)} className="resize-none" maxLength={200} />
//             </div>
//             <DialogFooter>
//               <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>تخطي</Button>
//               <Button onClick={handleSubmit} disabled={isSubmitting || stars === 0}>
//                 {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "إرسال التقييم"}
//               </Button>
//             </DialogFooter>
//           </>
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// }
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, Loader2, ThumbsUp, ThumbsDown, Car, DollarSign, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useUser } from '@/firebase';
import { doc, serverTimestamp, setDoc, collection, updateDoc, getDoc } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import type { Trip } from '@/lib/data';
import { useTranslations } from 'next-intl';

interface RateTripDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  trip: Trip | null;
  onConfirm: () => void;
  onNewTrip?: () => void;
}

export function RateTripDialog({ isOpen, onOpenChange, trip, onConfirm, onNewTrip }: RateTripDialogProps) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();
  const t = useTranslations("rateTrip"); // 👈 استدعاء الترجمة

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState('');
  const [priceAdherence, setPriceAdherence] = useState<boolean | null>(null);
  const [vehicleMatch, setVehicleMatch] = useState<boolean | null>(null);

  if (!trip) return null;

  const calculateRatingValue = (serviceStars: number, price: boolean, vehicle: boolean): number => {
    const starsScore = (serviceStars / 5) * 0.7;
    const criteriaScore = ((price ? 1 : 0) + (vehicle ? 1 : 0)) / 2 * 0.3;
    return parseFloat(((starsScore + criteriaScore) * 5).toFixed(2));
  };

  const handleSubmit = async () => {
    if (!user || !trip.carrierId) return;

    if (stars === 0) {
      toast({ variant: "destructive", title: t("ratingRequiredTitle"), description: t("ratingRequiredDesc") });
      return;
    }
    if (priceAdherence === null || vehicleMatch === null) {
      toast({ variant: "destructive", title: t("missingInfoTitle"), description: t("missingInfoDesc") });
      return;
    }

    setIsSubmitting(true);
    try {
      const ratingValue = calculateRatingValue(stars, priceAdherence, vehicleMatch);

      const res = await fetch('/api/rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tripId: trip.id,
          carrierId: trip.carrierId,
          userId: user.uid,
          ratingValue,
          details: { serviceStars: stars, priceAdherence, vehicleMatch, comment: comment.trim() },
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || t("failTitle"));
      }

      toast({ title: t("successTitle"), description: t("successDesc") });
      setIsDone(true);
      onConfirm();
    } catch (error) {
      console.error("Rating submission error:", error);
      toast({ variant: "destructive", title: t("failTitle"), description: t("failDesc") });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => { setIsDone(false); setStars(0); setComment(''); setPriceAdherence(null); setVehicleMatch(null); }, 300);
  };

  const handleNewTrip = () => { handleClose(); onNewTrip?.(); };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); else onOpenChange(true); }}>
      <DialogContent className="sm:max-w-[425px]">

        {isDone ? (
          <div className="text-center py-6 space-y-6">
            <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-yellow-400/20 animate-ping" />
              <div className="relative h-16 w-16 rounded-full bg-yellow-400/10 border-2 border-yellow-400/40 flex items-center justify-center">
                <span className="text-3xl">⭐</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} className={cn("h-7 w-7", s <= stars ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30")} />
                ))}
              </div>
              <p className="font-black text-xl">{t("ratedSuccessTitle")}</p>
              <p className="text-sm text-muted-foreground font-bold">
                {t("youGaveCaptain")} <span className="text-primary font-black">{trip.carrierName}</span>{' '}
                <span className="text-yellow-500 font-black">{stars} {t("stars")}</span>
              </p>
              <p className="text-xs text-muted-foreground/60 font-bold">{t("ratingVisibilityNote")}</p>
            </div>
            <div className="space-y-3 pt-2">
              <Button onClick={handleNewTrip} className="w-full h-14 rounded-2xl font-black text-lg shadow-lg gap-2">
                <MapPin className="h-5 w-5" /> {t("bookNewTrip")}
              </Button>
              <Button variant="outline" onClick={handleClose} className="w-full h-11 rounded-2xl font-bold">{t("close")}</Button>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-center">{t("dialogTitle")}</DialogTitle>
              <DialogDescription className="text-center">
                {t("dialogDesc1")} <span className="font-black text-foreground">{trip.carrierName}</span> {t("dialogDesc2")}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="flex flex-col items-center gap-2">
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setStars(star)} className="focus:outline-none transition-transform hover:scale-110">
                      <Star className={cn("h-8 w-8 transition-colors", star <= stars ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground")} />
                    </button>
                  ))}
                </div>
                {stars > 0 && (
                  <p className="text-xs font-bold text-muted-foreground">
                    {stars === 1 ? t("star1") : stars === 2 ? t("star2") : stars === 3 ? t("star3") : stars === 4 ? t("star4") : t("star5")}
                  </p>
                )}
              </div>
              <div className="space-y-3 bg-muted/30 p-3 rounded-lg border border-dashed">
                <div className="flex items-center justify-between">
                  <span className="text-sm flex items-center gap-2"><DollarSign className="h-4 w-4" /> {t("priceAdherence")}</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant={priceAdherence === true ? "default" : "outline"} className={cn("h-7 px-2", priceAdherence === true && "bg-green-600 hover:bg-green-700")} onClick={() => setPriceAdherence(true)}><ThumbsUp className="h-3 w-3" /></Button>
                    <Button size="sm" variant={priceAdherence === false ? "destructive" : "outline"} className="h-7 px-2" onClick={() => setPriceAdherence(false)}><ThumbsDown className="h-3 w-3" /></Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm flex items-center gap-2"><Car className="h-4 w-4" /> {t("vehicleMatch")}</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant={vehicleMatch === true ? "default" : "outline"} className={cn("h-7 px-2", vehicleMatch === true && "bg-green-600 hover:bg-green-700")} onClick={() => setVehicleMatch(true)}><ThumbsUp className="h-3 w-3" /></Button>
                    <Button size="sm" variant={vehicleMatch === false ? "destructive" : "outline"} className="h-7 px-2" onClick={() => setVehicleMatch(false)}><ThumbsDown className="h-3 w-3" /></Button>
                  </div>
                </div>
              </div>
              <Textarea placeholder={t("notesPlaceholder")} value={comment} onChange={(e) => setComment(e.target.value)} className="resize-none" maxLength={200} />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>{t("skip")}</Button>
              <Button onClick={handleSubmit} disabled={isSubmitting || stars === 0}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : t("submit")}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}