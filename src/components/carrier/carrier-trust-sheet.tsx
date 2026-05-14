// // // 'use client';

// // // import { useState, useEffect, useCallback } from 'react';
// // // import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
// // // import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// // // import { Badge } from '@/components/ui/badge';
// // // import { Button } from '@/components/ui/button';
// // // import { ScrollArea } from '@/components/ui/scroll-area';
// // // import { Star, ShieldCheck, CheckCircle2, XCircle, Loader2, Quote } from 'lucide-react';
// // // import { useFirestore } from '@/firebase';
// // // import { collection, query, where, orderBy, limit, startAfter, getDocs, type DocumentSnapshot, type Timestamp } from 'firebase/firestore';
// // // import { format } from 'date-fns';
// // // import { arSA } from 'date-fns/locale';

// // // interface CarrierTrustSheetProps {
// // //   carrierId: string | null;
// // //   isOpen: boolean;
// // //   onClose: () => void;
// // //   carrierName?: string;
// // //   carrierImage?: string;
// // //   carrierTier?: string;
// // // }

// // // // Internal type for the review data
// // // interface ReviewData {
// // //   id: string;
// // //   details: {
// // //     priceAdherence: boolean;
// // //     vehicleMatch: boolean;
// // //     serviceStars: number;
// // //     comment?: string;
// // //   };
// // //   createdAt: Timestamp;
// // // }

// // // export function CarrierTrustSheet({ carrierId, isOpen, onClose, carrierName, carrierImage, carrierTier }: CarrierTrustSheetProps) {
// // //   const firestore = useFirestore();
// // //   const [reviews, setReviews] = useState<ReviewData[]>([]);
// // //   const [loading, setLoading] = useState(false);
// // //   const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
// // //   const [hasMore, setHasMore] = useState(true);
// // //   const BATCH_SIZE = 10;

// // //   const fetchReviews = useCallback(async (isInitial = false) => {
// // //     if (!firestore || !carrierId) return;
// // //     if (loading && !isInitial) return;

// // //     setLoading(true);
// // //     try {
// // //       let q = query(
// // //         collection(firestore, 'ratings'),
// // //         where('carrierId', '==', carrierId),
// // //         orderBy('createdAt', 'desc'),
// // //         limit(BATCH_SIZE)
// // //       );

// // //       if (!isInitial && lastDoc) {
// // //         q = query(q, startAfter(lastDoc));
// // //       }

// // //       const snapshot = await getDocs(q);
// // //       const newReviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ReviewData));

// // //       if (isInitial) {
// // //         setReviews(newReviews);
// // //       } else {
// // //         setReviews(prev => [...prev, ...newReviews]);
// // //       }

// // //       setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
// // //       setHasMore(snapshot.docs.length === BATCH_SIZE);

// // //     } catch (error) {
// // //       console.error("Failed to fetch reviews:", error);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   }, [firestore, carrierId, loading, lastDoc]);

// // //   useEffect(() => {
// // //     if (isOpen && carrierId) {
// // //       setReviews([]);
// // //       setLastDoc(null);
// // //       setHasMore(true);
// // //       fetchReviews(true);
// // //     }
// // //   }, [isOpen, carrierId, fetchReviews]);

// // //   const getTierColor = (tier?: string) => {
// // //     switch (tier) {
// // //       case 'PLATINUM': return 'bg-slate-900 text-white border-slate-500';
// // //       case 'GOLD': return 'bg-yellow-500 text-white border-yellow-600';
// // //       case 'SILVER': return 'bg-slate-400 text-white border-slate-500';
// // //       default: return 'bg-orange-700 text-white border-orange-800'; // Bronze
// // //     }
// // //   };

// // //   return (
// // //     <Sheet open={isOpen} onOpenChange={onClose}>
// // //       <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl p-0 flex flex-col">
// // //         <div className="p-6 pb-2 border-b bg-muted/20">
// // //           <SheetHeader className="text-right mb-4">
// // //             <SheetTitle>سجل الثقة والمصداقية</SheetTitle>
// // //             <SheetDescription>تاريخ الأداء بناءً على تقييمات المسافرين الموثقة.</SheetDescription>
// // //           </SheetHeader>
// // //           <div className="flex items-center gap-4">
// // //             <Avatar className="h-16 w-16 border-2 border-primary/20">
// // //               {/* <AvatarImage src={carrierImage} /> */}
// // //               <AvatarImage src={carrierImage || "/default-avatar.png"} alt={''} />

// // //               <AvatarFallback>{carrierName?.[0] || '?'}</AvatarFallback>
// // //             </Avatar>
// // //             <div className="space-y-1">
// // //               <h3 className="font-bold text-lg">{carrierName}</h3>
// // //               <Badge variant="outline" className={`${getTierColor(carrierTier)} gap-1`}>
// // //                 <ShieldCheck className="h-3 w-3" />
// // //                 {carrierTier || 'BRONZE'}
// // //               </Badge>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         <ScrollArea className="flex-1 p-6 pt-4">
// // //           {reviews.length === 0 && !loading ? (
// // //             <div className="text-center text-muted-foreground py-10">لا توجد تقييمات مسجلة لهذا الناقل بعد.</div>
// // //           ) : (
// // //             <div className="space-y-4">
// // //               {reviews.map((review) => (
// // //                 <div key={review.id} className="border rounded-lg p-4 bg-card shadow-sm animate-in slide-in-from-bottom-2">
// // //                   <div className="flex justify-between items-start mb-2">
// // //                     <div className="flex gap-1">
// // //                       {[1, 2, 3, 4, 5].map(star => (
// // //                         <Star key={star} className={`h-3 w-3 ${star <= review.details.serviceStars ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`} />
// // //                       ))}
// // //                     </div>
// // //                     <span className="text-xs text-muted-foreground">
// // //                       {review.createdAt?.toDate ? format(review.createdAt.toDate(), 'PPP', { locale: arSA }) : ''}
// // //                     </span>
// // //                   </div>
// // //                   <div className="flex gap-2 mb-3">
// // //                     <Badge variant={review.details.priceAdherence ? "default" : "destructive"} className="text-[10px] h-5 px-1 bg-opacity-90">
// // //                       {review.details.priceAdherence ? <CheckCircle2 className="h-3 w-3 mr-1"/> : <XCircle className="h-3 w-3 mr-1"/>} السعر
// // //                     </Badge>
// // //                     <Badge variant={review.details.vehicleMatch ? "default" : "destructive"} className="text-[10px] h-5 px-1 bg-opacity-90">
// // //                       {review.details.vehicleMatch ? <CheckCircle2 className="h-3 w-3 mr-1"/> : <XCircle className="h-3 w-3 mr-1"/>} المركبة
// // //                     </Badge>
// // //                   </div>
// // //                   {review.details.comment && (
// // //                     <div className="bg-muted/30 p-2 rounded text-xs text-foreground/80 flex gap-2 items-start">
// // //                       <Quote className="h-3 w-3 text-muted-foreground shrink-0 mt-0.5" />
// // //                       <p>{review.details.comment}</p>
// // //                     </div>
// // //                   )}
// // //                 </div>
// // //               ))}
// // //               {hasMore && (
// // //                 <div className="pt-2 pb-6 flex justify-center">
// // //                   <Button variant="outline" size="sm" onClick={() => fetchReviews(false)} disabled={loading} className="w-full">
// // //                     {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "عرض المزيد من التقييمات"}
// // //                   </Button>
// // //                 </div>
// // //               )}
// // //             </div>
// // //           )}
// // //         </ScrollArea>
// // //       </SheetContent>
// // //     </Sheet>
// // //   );
// // // }

// // 'use client';

// // import { useState, useEffect, useCallback } from 'react';
// // import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
// // import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// // import { Badge } from '@/components/ui/badge';
// // import { Button } from '@/components/ui/button';
// // import { ScrollArea } from '@/components/ui/scroll-area';
// // import { Star, ShieldCheck, CheckCircle2, XCircle, Loader2, Quote } from 'lucide-react';
// // import { useFirestore } from '@/firebase';
// // import { collection, query, where, orderBy, limit, startAfter, getDocs, type DocumentSnapshot, type Timestamp } from 'firebase/firestore';
// // import { format } from 'date-fns';
// // import { arSA } from 'date-fns/locale';

// // interface CarrierTrustSheetProps {
// //   carrierId: string | null;
// //   isOpen: boolean;
// //   onClose: () => void;
// //   carrierName?: string;
// //   carrierImage?: string;
// //   carrierTier?: string;
// // }

// // // Internal type for the review data
// // interface ReviewData {
// //   id: string;
// //   details: {
// //     priceAdherence: boolean;
// //     vehicleMatch: boolean;
// //     serviceStars: number;
// //     comment?: string;
// //   };
// //   createdAt: Timestamp;
// // }

// // export function CarrierTrustSheet({ carrierId, isOpen, onClose, carrierName, carrierImage, carrierTier }: CarrierTrustSheetProps) {
// //   const firestore = useFirestore();
// //   const [reviews, setReviews] = useState<ReviewData[]>([]);
// //   const [loading, setLoading] = useState(false);
// //   const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
// //   const [hasMore, setHasMore] = useState(true);
// //   const BATCH_SIZE = 10;

// //   const fetchReviews = useCallback(async (isInitial = false, currentLastDoc: DocumentSnapshot | null = null) => {
// //     if (!firestore || !carrierId) return;

// //     setLoading(true);
// //     try {
// //       let q = query(
// //         collection(firestore, 'ratings'),
// //         where('carrierId', '==', carrierId),
// //         orderBy('createdAt', 'desc'),
// //         limit(BATCH_SIZE)
// //       );

// //       if (!isInitial && currentLastDoc) {
// //         q = query(q, startAfter(currentLastDoc));
// //       }

// //       const snapshot = await getDocs(q);
// //       const newReviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ReviewData));

// //       if (isInitial) {
// //         setReviews(newReviews);
// //       } else {
// //         setReviews(prev => [...prev, ...newReviews]);
// //       }

// //       setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
// //       setHasMore(snapshot.docs.length === BATCH_SIZE);

// //     } catch (error) {
// //       console.error("Failed to fetch reviews:", error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, [firestore, carrierId]);

// //   useEffect(() => {
// //     if (isOpen && carrierId) {
// //       setReviews([]);
// //       setLastDoc(null);
// //       setHasMore(true);
// //       fetchReviews(true, null);
// //     }
// //   }, [isOpen, carrierId]); // eslint-disable-line react-hooks/exhaustive-deps

// //   const getTierColor = (tier?: string) => {
// //     switch (tier) {
// //       case 'PLATINUM': return 'bg-slate-900 text-white border-slate-500';
// //       case 'GOLD': return 'bg-yellow-500 text-white border-yellow-600';
// //       case 'SILVER': return 'bg-slate-400 text-white border-slate-500';
// //       default: return 'bg-orange-700 text-white border-orange-800'; // Bronze
// //     }
// //   };

// //   return (
// //     <Sheet open={isOpen} onOpenChange={onClose}>
// //       <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl p-0 flex flex-col">
// //         <div className="p-6 pb-2 border-b bg-muted/20">
// //           <SheetHeader className="text-right mb-4">
// //             <SheetTitle>سجل الثقة والمصداقية</SheetTitle>
// //             <SheetDescription>تاريخ الأداء بناءً على تقييمات المسافرين الموثقة.</SheetDescription>
// //           </SheetHeader>
// //           <div className="flex items-center gap-4">
// //             <Avatar className="h-16 w-16 border-2 border-primary/20">
// //               {/* <AvatarImage src={carrierImage} /> */}
// //               <AvatarImage src={carrierImage || "/default-avatar.png"} alt={''} />

// //               <AvatarFallback>{carrierName?.[0] || '?'}</AvatarFallback>
// //             </Avatar>
// //             <div className="space-y-1">
// //               <h3 className="font-bold text-lg">{carrierName}</h3>
// //               <Badge variant="outline" className={`${getTierColor(carrierTier)} gap-1`}>
// //                 <ShieldCheck className="h-3 w-3" />
// //                 {carrierTier || 'BRONZE'}
// //               </Badge>
// //             </div>
// //           </div>
// //         </div>

// //         <ScrollArea className="flex-1 p-6 pt-4">
// //           {reviews.length === 0 && !loading ? (
// //             <div className="text-center text-muted-foreground py-10">لا توجد تقييمات مسجلة لهذا الناقل بعد.</div>
// //           ) : (
// //             <div className="space-y-4">
// //               {reviews.map((review) => (
// //                 <div key={review.id} className="border rounded-lg p-4 bg-card shadow-sm animate-in slide-in-from-bottom-2">
// //                   <div className="flex justify-between items-start mb-2">
// //                     <div className="flex gap-1">
// //                       {[1, 2, 3, 4, 5].map(star => (
// //                         <Star key={star} className={`h-3 w-3 ${star <= review.details.serviceStars ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`} />
// //                       ))}
// //                     </div>
// //                     <span className="text-xs text-muted-foreground">
// //                       {review.createdAt?.toDate ? format(review.createdAt.toDate(), 'PPP', { locale: arSA }) : ''}
// //                     </span>
// //                   </div>
// //                   <div className="flex gap-2 mb-3 ">
// //                     <Badge variant={review.details.priceAdherence ? "default" : "destructive"} className="text-lg p-3 h-5 px-1 bg-[]">
// //                       {review.details.priceAdherence ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />} السعر
// //                     </Badge>
// //                     <Badge variant={review.details.vehicleMatch ? "default" : "destructive"} className="text-lg p-3 h-5 px-1 bg-[]">
// //                       {review.details.vehicleMatch ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />} المركبة
// //                     </Badge>
// //                   </div>
// //                   {review.details.comment && (
// //                     <div className="bg-muted/30 p-2 rounded text-xs text-foreground/80 flex gap-2 items-start">
// //                       <Quote className="h-3 w-3 text-muted-foreground shrink-0 mt-0.5" />
// //                       <p>{review.details.comment}</p>
// //                     </div>
// //                   )}
// //                 </div>
// //               ))}
// //               {hasMore && (
// //                 <div className="pt-2 pb-6 flex justify-center">
// //                   <Button variant="outline" size="sm" onClick={() => fetchReviews(false, lastDoc)} disabled={loading} className="w-full">
// //                     {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "عرض المزيد من التقييمات"}
// //                   </Button>
// //                 </div>
// //               )}
// //             </div>
// //           )}
// //         </ScrollArea>
// //       </SheetContent>
// //     </Sheet>
// //   );
// // }
// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import { useTranslations } from 'next-intl';
// import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { Star, ShieldCheck, CheckCircle2, XCircle, Loader2, Quote, User } from 'lucide-react';
// import { useFirestore } from '@/firebase';
// import { collection, query, where, orderBy, limit, startAfter, getDocs, getDoc, doc, type DocumentSnapshot, type Timestamp } from 'firebase/firestore';
// import { format } from 'date-fns';
// import { arSA, enUS } from 'date-fns/locale';
// import { useLocale } from 'next-intl';

// interface CarrierTrustSheetProps {
//   carrierId: string | null;
//   isOpen: boolean;
//   onClose: () => void;
//   carrierName?: string;
//   carrierImage?: string;
//   carrierTier?: string;
// }

// interface ReviewData {
//   id: string;
//   userId?: string;
//   travelerName?: string;
//   details: {
//     priceAdherence: boolean;
//     vehicleMatch: boolean;
//     serviceStars: number;
//     comment?: string;
//   };
//   createdAt: Timestamp;
// }

// export function CarrierTrustSheet({ carrierId, isOpen, onClose, carrierName, carrierImage, carrierTier }: CarrierTrustSheetProps) {
//   const firestore = useFirestore();
//   const t = useTranslations('carrierTrustSheet');
//   const locale = useLocale();
//   const dateLocale = locale === 'ar' ? arSA : enUS;

//   const [reviews, setReviews] = useState<ReviewData[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
//   const [hasMore, setHasMore] = useState(true);
//   const BATCH_SIZE = 10;

//   const fetchReviews = useCallback(async (isInitial = false, currentLastDoc: DocumentSnapshot | null = null) => {
//     if (!firestore || !carrierId) return;

//     setLoading(true);
//     try {
//       let q = query(
//         collection(firestore, 'ratings'),
//         where('carrierId', '==', carrierId),
//         orderBy('createdAt', 'desc'),
//         limit(BATCH_SIZE)
//       );

//       if (!isInitial && currentLastDoc) {
//         q = query(q, startAfter(currentLastDoc));
//       }

//       const snapshot = await getDocs(q);
//       const rawReviews = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ReviewData));

//       // جيب أسماء المسافرين من users collection
//       const reviewsWithNames = await Promise.all(
//         rawReviews.map(async (review) => {
//           if (!review.userId) return review;
//           try {
//             const userSnap = await getDoc(doc(firestore, 'users', review.userId));
//             if (userSnap.exists()) {
//               const data = userSnap.data();
//               const travelerName =
//                 data.displayName ||
//                 (data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : null) ||
//                 data.firstName ||
//                 data.fullName ||
//                 null;
//               return { ...review, travelerName };
//             }
//           } catch {
//             // لو فشل جلب الاسم، يرجع التقييم بدون اسم
//           }
//           return review;
//         })
//       );

//       if (isInitial) {
//         setReviews(reviewsWithNames);
//       } else {
//         setReviews(prev => [...prev, ...reviewsWithNames]);
//       }

//       setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
//       setHasMore(snapshot.docs.length === BATCH_SIZE);

//     } catch (error) {
//       console.error("Failed to fetch reviews:", error);
//     } finally {
//       setLoading(false);
//     }
//   }, [firestore, carrierId]);

//   useEffect(() => {
//     if (isOpen && carrierId) {
//       setReviews([]);
//       setLastDoc(null);
//       setHasMore(true);
//       fetchReviews(true, null);
//     }
//   }, [isOpen, carrierId]); // eslint-disable-line react-hooks/exhaustive-deps

//   const getTierColor = (tier?: string) => {
//     switch (tier) {
//       case 'PLATINUM': return 'bg-slate-900 text-white border-slate-500';
//       case 'GOLD': return 'bg-yellow-500 text-white border-yellow-600';
//       case 'SILVER': return 'bg-slate-400 text-white border-slate-500';
//       default: return 'bg-orange-700 text-white border-orange-800';
//     }
//   };

//   return (
//     <Sheet open={isOpen} onOpenChange={onClose}>
//       <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl py-5 px-0 flex flex-col">
//         <div className="p-6 pb-2 border-b bg-muted/20">
//           <SheetHeader className="text-right mb-4" dir='ltr '>
//             <SheetTitle>{t('title')}</SheetTitle>
//             <SheetDescription>{t('description')}</SheetDescription>
//           </SheetHeader>
//           <div className="flex items-center gap-4">
//             <Avatar className="h-16 w-16 border-2 border-primary/20">
//               <AvatarImage src={carrierImage || "/default-avatar.png"} alt={''} />
//               <AvatarFallback>{carrierName?.[0] || '?'}</AvatarFallback>
//             </Avatar>
//             <div className="space-y-1">
//               <h3 className="font-bold text-lg">{carrierName}</h3>
//               <Badge variant="outline" className={`${getTierColor(carrierTier)} gap-1`}>
//                 <ShieldCheck className="h-3 w-3" />
//                 {carrierTier || t('bronze')}
//               </Badge>
//             </div>
//           </div>
//         </div>

//         <ScrollArea className="flex-1 p-6 pt-4">
//           {reviews.length === 0 && !loading ? (
//             <div className="text-center text-muted-foreground py-10">{t('noReviews')}</div>
//           ) : (
//             <div className="space-y-4">
//               {reviews.map((review) => (
//                 <div key={review.id} className="border rounded-lg p-4 bg-card shadow-sm animate-in slide-in-from-bottom-2">

//                   {/* اسم المسافر + التاريخ */}
//                   <div className="flex justify-between items-center mb-2">
//                     <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
//                       <User className="h-3.5 w-3.5 text-muted-foreground" />
//                       <span>{review.travelerName || t('traveler')}</span>
//                     </div>
//                     <span className="text-xs text-muted-foreground">
//                       {review.createdAt?.toDate ? format(review.createdAt.toDate(), 'PPP', { locale: dateLocale }) : ''}
//                     </span>
//                   </div>

//                   {/* النجوم */}
//                   <div className="flex gap-1 mb-2">
//                     {[1, 2, 3, 4, 5].map(star => (
//                       <Star key={star} className={`h-3 w-3 ${star <= review.details.serviceStars ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`} />
//                     ))}
//                   </div>

//                   {/* السعر والمركبة */}
//                   <div className="flex gap-2 mb-3">
//                     <Badge variant={review.details.priceAdherence ? "default" : "destructive"} className="text-sm p-3 h-5 px-1 bg-[#B09E6E]">
//                       {review.details.priceAdherence ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />} {t('price')}
//                     </Badge>
//                     <Badge variant={review.details.vehicleMatch ? "default" : "destructive"} className="text-sm p-3 h-5 px-1 bg-[#B09E6E]">
//                       {review.details.vehicleMatch ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />} {t('vehicle')}
//                     </Badge>
//                   </div>

//                   {/* التعليق */}
//                   <div className="bg-muted/30 p-2 rounded text-xs text-foreground/80 flex gap-2 items-start">
//                     <Quote className="h-3 w-3 text-muted-foreground shrink-0 mt-0.5" />
//                     {review.details.comment
//                       ? <p>{review.details.comment}</p>
//                       : <p className="text-muted-foreground tracking-widest">{t('noComment')}</p>
//                     }
//                   </div>

//                 </div>
//               ))}
//               {hasMore && (
//                 <div className="pt-2 pb-6 flex justify-center">
//                   <Button variant="outline" size="sm" onClick={() => fetchReviews(false, lastDoc)} disabled={loading} className="w-full">
//                     {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t('loadMore')}
//                   </Button>
//                 </div>
//               )}
//             </div>
//           )}
//         </ScrollArea>
//       </SheetContent>
//     </Sheet>
//   );
// }
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Star, ShieldCheck, CheckCircle2, XCircle, Loader2, Quote, User } from 'lucide-react';
import { useFirestore } from '@/firebase';
import { collection, query, where, orderBy, limit, startAfter, getDocs, getDoc, doc, type DocumentSnapshot, type Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';
import { arSA, enUS } from 'date-fns/locale';

interface CarrierTrustSheetProps {
  carrierId: string | null;
  isOpen: boolean;
  onClose: () => void;
  carrierName?: string;
  carrierImage?: string;
  carrierTier?: string;
}

interface ReviewData {
  id: string;
  userId?: string;
  travelerName?: string;
  details: {
    priceAdherence: boolean;
    vehicleMatch: boolean;
    serviceStars: number;
    comment?: string;
  };
  createdAt: Timestamp;
}

export function CarrierTrustSheet({ carrierId, isOpen, onClose, carrierName, carrierImage, carrierTier }: CarrierTrustSheetProps) {
  const firestore = useFirestore();
  const t = useTranslations('carrierTrustSheet');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const dateLocale = isRTL ? arSA : enUS;
  const dir = isRTL ? 'rtl' : 'ltr';

  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const BATCH_SIZE = 10;

  const fetchReviews = useCallback(async (isInitial = false, currentLastDoc: DocumentSnapshot | null = null) => {
    if (!firestore || !carrierId) return;

    setLoading(true);
    try {
      let q = query(
        collection(firestore, 'ratings'),
        where('carrierId', '==', carrierId),
        orderBy('createdAt', 'desc'),
        limit(BATCH_SIZE)
      );

      if (!isInitial && currentLastDoc) {
        q = query(q, startAfter(currentLastDoc));
      }

      const snapshot = await getDocs(q);
      const rawReviews = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ReviewData));

      const reviewsWithNames = await Promise.all(
        rawReviews.map(async (review) => {
          if (!review.userId) return review;
          try {
            const userSnap = await getDoc(doc(firestore, 'users', review.userId));
            if (userSnap.exists()) {
              const data = userSnap.data();
              const travelerName =
                data.displayName ||
                (data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : null) ||
                data.firstName ||
                data.fullName ||
                null;
              return { ...review, travelerName };
            }
          } catch {
            // لو فشل جلب الاسم، يرجع التقييم بدون اسم
          }
          return review;
        })
      );

      if (isInitial) {
        setReviews(reviewsWithNames);
      } else {
        setReviews(prev => [...prev, ...reviewsWithNames]);
      }

      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
      setHasMore(snapshot.docs.length === BATCH_SIZE);

    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  }, [firestore, carrierId]);

  useEffect(() => {
    if (isOpen && carrierId) {
      setReviews([]);
      setLastDoc(null);
      setHasMore(true);
      fetchReviews(true, null);
    }
  }, [isOpen, carrierId]); // eslint-disable-line react-hooks/exhaustive-deps

  const getTierColor = (tier?: string) => {
    switch (tier) {
      case 'PLATINUM': return 'bg-slate-900 text-white border-slate-500';
      case 'GOLD': return 'bg-yellow-500 text-white border-yellow-600';
      case 'SILVER': return 'bg-slate-400 text-white border-slate-500';
      default: return 'bg-orange-700 text-white border-orange-800';
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl py-5 px-0 flex flex-col" dir={dir}>
        <div className="p-6 pb-2 border-b bg-muted/20">

          {/* العنوان والوصف */}
          <SheetHeader className="mb-4 text-start">
            <SheetTitle>{t('title')}</SheetTitle>
            <SheetDescription>{t('description')}</SheetDescription>
          </SheetHeader>

          {/* بيانات الناقل */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/20">
              <AvatarImage src={carrierImage || "/default-avatar.png"} alt={''} />
              <AvatarFallback>{carrierName?.[0] || '?'}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="font-bold text-lg">{carrierName}</h3>
              <Badge variant="outline" className={`${getTierColor(carrierTier)} gap-1`}>
                <ShieldCheck className="h-3 w-3" />
                {carrierTier || t('bronze')}
              </Badge>
            </div>
          </div>

        </div>

        <ScrollArea className="flex-1 p-6 pt-4">
          {reviews.length === 0 && !loading ? (
            <div className="text-center text-muted-foreground py-10">{t('noReviews')}</div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-4 bg-card shadow-sm animate-in slide-in-from-bottom-2">

                  {/* اسم المسافر + التاريخ */}
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{review.travelerName || t('traveler')}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {review.createdAt?.toDate ? format(review.createdAt.toDate(), 'PPP', { locale: dateLocale }) : ''}
                    </span>
                  </div>

                  {/* النجوم */}
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} className={`h-3 w-3 ${star <= review.details.serviceStars ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`} />
                    ))}
                  </div>

                  {/* السعر والمركبة */}
                  <div className="flex gap-2 mb-3">
                    <Badge variant={review.details.priceAdherence ? "default" : "destructive"} className="text-sm p-3 h-5 px-1 bg-[#B09E6E]">
                      {review.details.priceAdherence ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />} {t('price')}
                    </Badge>
                    <Badge variant={review.details.vehicleMatch ? "default" : "destructive"} className="text-sm p-3 h-5 px-1 bg-[#B09E6E]">
                      {review.details.vehicleMatch ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />} {t('vehicle')}
                    </Badge>
                  </div>

                  {/* التعليق */}
                  <div className="bg-muted/30 p-2 rounded text-xs text-foreground/80 flex gap-2 items-start">
                    <Quote className="h-3 w-3 text-muted-foreground shrink-0 mt-0.5" />
                    {review.details.comment
                      ? <p>{review.details.comment}</p>
                      : <p className="text-muted-foreground tracking-widest">{t('noComment')}</p>
                    }
                  </div>

                </div>
              ))}
              {hasMore && (
                <div className="pt-2 pb-6 flex justify-center">
                  <Button variant="outline" size="sm" onClick={() => fetchReviews(false, lastDoc)} disabled={loading} className="w-full">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t('loadMore')}
                  </Button>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}