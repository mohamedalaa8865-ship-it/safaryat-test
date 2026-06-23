// // // // // 'use client';

// // // // // import { useMemo, useState } from 'react';
// // // // // import { MyTripsList } from '@/components/carrier/my-trips-list';
// // // // // import type { Trip, UserProfile } from '@/lib/data';
// // // // // import { Skeleton } from '@/components/ui/skeleton';
// // // // // import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
// // // // // import { collection, query, where } from 'firebase/firestore';
// // // // // import { EditTripDialog, type EditTripFormValues } from '@/components/carrier/edit-trip-dialog';
// // // // // import { useTripActions } from '@/hooks/use-trip-actions';
// // // // // import { useTranslations } from 'next-intl';
// // // // // import { useUserProfile } from '@/hooks/use-user-profile';

// // // // // function LoadingState() {
// // // // //   return (
// // // // //     <div className="space-y-6">
// // // // //       <Skeleton className="h-8 w-48 rounded-lg mb-4" />
// // // // //       <div className="space-y-3">
// // // // //         {[...Array(1)].map((_, i) => (
// // // // //           <Skeleton key={i} className="h-48 w-full rounded-lg" />
// // // // //         ))}
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // }

// // // // // /**
// // // // //  * @page CarrierTripsPage
// // // // //  * @description THE REINFORCED TRIPS LIST (SC-806 V2.6)
// // // // //  * Enforced useMemoFirebase for arterial stability.
// // // // //  */
// // // // // export default function CarrierTripsPage() {
// // // // //   const t = useTranslations('carrierTripsPage');
// // // // //   const { user } = useUser();
// // // // //   const firestore = useFirestore();
// // // // //   const { profile } = useUserProfile();
// // // // //   const [tripToEdit, setTripToEdit] = useState<Trip | null>(null);
// // // // //   const { editTrip } = useTripActions();

// // // // //   const activeTripsQuery = useMemoFirebase(() => {
// // // // //     if (!firestore || !user?.uid) return null;
// // // // //     return query(collection(firestore, 'trips'),
// // // // //       where('carrierId', '==', user.uid),
// // // // //       where('status', 'in', [
// // // // //         'Planned',
// // // // //         'In-Transit',
// // // // //         'Has_Offers',
// // // // //         'Negotiating',
// // // // //         'Pending-Carrier-Confirmation',
// // // // //       ])
// // // // //     );
// // // // //   }, [firestore, user]);

// // // // //   // const { data: trips, isLoading } = useCollection<Trip>(activeTripsQuery);
// // // // //   // ✅ جيب كل الرحلات بدون فلتر status
// // // // //   const allTripsQuery = useMemoFirebase(() => {
// // // // //     if (!firestore || !user?.uid) return null;
// // // // //     return query(
// // // // //       collection(firestore, 'trips'),
// // // // //       where('carrierId', '==', user.uid),
// // // // //     );
// // // // //   }, [firestore, user]);

// // // // //   const { data: trips, isLoading } = useCollection<Trip>(allTripsQuery);

// // // // //   // ✅ رتّب — النشطة أولاً ثم المنتهية
// // // // //   const sortedTrips = useMemo(() => {
// // // // //     if (!trips) return [];
// // // // //     const activeStatuses = ['Planned', 'In-Transit', 'Has_Offers', 'Negotiating', 'Pending-Carrier-Confirmation'];
// // // // //     return [...trips].sort((a, b) => {
// // // // //       const aActive = activeStatuses.includes(a.status) ? 0 : 1;
// // // // //       const bActive = activeStatuses.includes(b.status) ? 0 : 1;
// // // // //       if (aActive !== bActive) return aActive - bActive;
// // // // //       const aDate = (a.departureDate as any)?.toDate?.() ?? new Date(a.departureDate || 0);
// // // // //       const bDate = (b.departureDate as any)?.toDate?.() ?? new Date(b.departureDate || 0);
// // // // //       return bDate.getTime() - aDate.getTime();
// // // // //     });
// // // // //   }, [trips]);
// // // // //   // const sortedTrips = useMemo(() => {
// // // // //   //   if (!trips) return [];
// // // // //   //   return [...trips].sort((a, b) => {
// // // // //   //     const aDate = new Date(a.departureDate || 0).getTime();
// // // // //   //     const bDate = new Date(b.departureDate || 0).getTime();
// // // // //   //     return aDate - bDate;
// // // // //   //   });
// // // // //   // }, [trips]);

// // // // //   const handleEditTrip = (trip: Trip) => setTripToEdit(trip);

// // // // //   const handleConfirmEdit = async (trip: Trip, data: EditTripFormValues) => {
// // // // //     const success = await editTrip(trip, data);
// // // // //     if (success) setTripToEdit(null);
// // // // //   };

// // // // //   if (isLoading) return <LoadingState />;

// // // // //   return (
// // // // //     <>
// // // // //       <div className="space-y-8 w-full pt-10">
// // // // //         <header>
// // // // //           <h1 className="text-xl md:text-2xl font-bold">
// // // // //             {t('title')}
// // // // //           </h1>
// // // // //           <p className="text-muted-foreground text-sm md:text-base">
// // // // //             {t('description')}
// // // // //           </p>
// // // // //         </header>

// // // // //         <main className="space-y-8">
// // // // //           <MyTripsList
// // // // //             trips={sortedTrips}
// // // // //             isLoading={isLoading}
// // // // //             onEdit={handleEditTrip}
// // // // //             carrierProfile={profile}
// // // // //           />
// // // // //         </main>
// // // // //       </div>

// // // // //       {/* <EditTripDialog
// // // // //         isOpen={!!tripToEdit}
// // // // //         onOpenChange={(open) => !open && setTripToEdit(null)}
// // // // //         trip={tripToEdit}
// // // // //         onConfirm={handleConfirmEdit}
// // // // //       /> */}
// // // // //     </>
// // // // //   );
// // // // // }

// // // // 'use client';

// // // // import { useMemo, useState } from 'react';
// // // // import { MyTripsList } from '@/components/carrier/my-trips-list';
// // // // import type { Trip, UserProfile } from '@/lib/data';
// // // // import { Skeleton } from '@/components/ui/skeleton';
// // // // import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
// // // // import { collection, query, where } from 'firebase/firestore';
// // // // import { EditTripDialog, type EditTripFormValues } from '@/components/carrier/edit-trip-dialog';
// // // // import { useTripActions } from '@/hooks/use-trip-actions';
// // // // import { useTranslations } from 'next-intl';
// // // // import { useUserProfile } from '@/hooks/use-user-profile';

// // // // function LoadingState() {
// // // //   return (
// // // //     <div className="space-y-6">
// // // //       <Skeleton className="h-8 w-48 rounded-lg mb-4" />
// // // //       <div className="space-y-3">
// // // //         {[...Array(1)].map((_, i) => (
// // // //           <Skeleton key={i} className="h-48 w-full rounded-lg" />
// // // //         ))}
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // // /**
// // // //  * @page CarrierTripsPage
// // // //  * @description THE REINFORCED TRIPS LIST (SC-806 V2.6)
// // // //  * Enforced useMemoFirebase for arterial stability.
// // // //  */
// // // // export default function CarrierTripsPage() {
// // // //   const t = useTranslations('carrierTripsPage');
// // // //   const { user } = useUser();
// // // //   const firestore = useFirestore();
// // // //   const { profile } = useUserProfile();
// // // //   const [tripToEdit, setTripToEdit] = useState<Trip | null>(null);
// // // //   const { editTrip } = useTripActions();

// // // //   const activeTripsQuery = useMemoFirebase(() => {
// // // //     if (!firestore || !user?.uid) return null;
// // // //     return query(collection(firestore, 'trips'),
// // // //       where('carrierId', '==', user.uid),
// // // //       where('status', 'in', [
// // // //         'Planned',
// // // //         'In-Transit',
// // // //         'Has_Offers',
// // // //         'Negotiating',
// // // //         'Pending-Carrier-Confirmation',
// // // //       ])
// // // //     );
// // // //   }, [firestore, user]);

// // // //   // const { data: trips, isLoading } = useCollection<Trip>(activeTripsQuery);
// // // //   // ✅ جيب رحلات الناقل — فقط where carrierId (بدون composite index)
// // // //   const allTripsQuery = useMemoFirebase(() => {
// // // //     if (!firestore || !user?.uid) return null;
// // // //     return query(
// // // //       collection(firestore, 'trips'),
// // // //       where('carrierId', '==', user.uid),
// // // //     );
// // // //   }, [firestore, user]);

// // // //   const { data: rawTrips, isLoading } = useCollection<Trip>(allTripsQuery);

// // // //   // [FIX]: نفلتر client-side — نشوف بس الرحلات اللي الناقل أنشأها بنفسه (userId == uid)
// // // //   // ده بيمنع طلبات المسافرين اللي اتحدّث عليها carrierId بتاع الناقل من طرف handleAcceptOffer
// // // //   const trips = useMemo(
// // // //     () => (rawTrips ?? []).filter((t: Trip) => (t as any).userId === user?.uid),
// // // //     [rawTrips, user?.uid]
// // // //   );

// // // //   // ✅ رتّب — النشطة أولاً ثم المنتهية
// // // //   const sortedTrips = useMemo(() => {
// // // //     if (!trips) return [];
// // // //     const activeStatuses = ['Planned', 'In-Transit', 'Has_Offers', 'Negotiating', 'Pending-Carrier-Confirmation'];
// // // //     return [...trips].sort((a, b) => {
// // // //       const aActive = activeStatuses.includes(a.status) ? 0 : 1;
// // // //       const bActive = activeStatuses.includes(b.status) ? 0 : 1;
// // // //       if (aActive !== bActive) return aActive - bActive;
// // // //       const aDate = (a.departureDate as any)?.toDate?.() ?? new Date(a.departureDate || 0);
// // // //       const bDate = (b.departureDate as any)?.toDate?.() ?? new Date(b.departureDate || 0);
// // // //       return bDate.getTime() - aDate.getTime();
// // // //     });
// // // //   }, [trips]);
// // // //   // const sortedTrips = useMemo(() => {
// // // //   //   if (!trips) return [];
// // // //   //   return [...trips].sort((a, b) => {
// // // //   //     const aDate = new Date(a.departureDate || 0).getTime();
// // // //   //     const bDate = new Date(b.departureDate || 0).getTime();
// // // //   //     return aDate - bDate;
// // // //   //   });
// // // //   // }, [trips]);

// // // //   const handleEditTrip = (trip: Trip) => setTripToEdit(trip);

// // // //   const handleConfirmEdit = async (trip: Trip, data: EditTripFormValues) => {
// // // //     const success = await editTrip(trip, data);
// // // //     if (success) setTripToEdit(null);
// // // //   };

// // // //   if (isLoading) return <LoadingState />;

// // // //   return (
// // // //     <>
// // // //       <div className="space-y-8 w-full pt-10">
// // // //         <header>
// // // //           <h1 className="text-xl md:text-2xl font-bold">
// // // //             {t('title')}
// // // //           </h1>
// // // //           <p className="text-muted-foreground text-sm md:text-base">
// // // //             {t('description')}
// // // //           </p>
// // // //         </header>

// // // //         <main className="space-y-8">
// // // //           <MyTripsList
// // // //             trips={sortedTrips}
// // // //             isLoading={isLoading}
// // // //             onEdit={handleEditTrip}
// // // //             carrierProfile={profile}
// // // //           />
// // // //         </main>
// // // //       </div>

// // // //       {/* <EditTripDialog
// // // //         isOpen={!!tripToEdit}
// // // //         onOpenChange={(open) => !open && setTripToEdit(null)}
// // // //         trip={tripToEdit}
// // // //         onConfirm={handleConfirmEdit}
// // // //       /> */}
// // // //     </>
// // // //   );
// // // // }
// // // 'use client';

// // // import { useMemo, useState } from 'react';
// // // import { MyTripsList } from '@/components/carrier/my-trips-list';
// // // import type { Trip, UserProfile } from '@/lib/data';
// // // import { Skeleton } from '@/components/ui/skeleton';
// // // import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
// // // import { collection, query, where } from 'firebase/firestore';
// // // import { EditTripDialog, type EditTripFormValues } from '@/components/carrier/edit-trip-dialog';
// // // import { useTripActions } from '@/hooks/use-trip-actions';
// // // import { useTranslations } from 'next-intl';
// // // import { useUserProfile } from '@/hooks/use-user-profile';

// // // function LoadingState() {
// // //   return (
// // //     <div className="space-y-6">
// // //       <Skeleton className="h-8 w-48 rounded-lg mb-4" />
// // //       <div className="space-y-3">
// // //         {[...Array(1)].map((_, i) => (
// // //           <Skeleton key={i} className="h-48 w-full rounded-lg" />
// // //         ))}
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // /**
// // //  * @page CarrierTripsPage
// // //  * @description THE REINFORCED TRIPS LIST (SC-806 V2.6)
// // //  * Enforced useMemoFirebase for arterial stability.
// // //  */
// // // export default function CarrierTripsPage() {
// // //   const t = useTranslations('carrierTripsPage');
// // //   const { user } = useUser();
// // //   const firestore = useFirestore();
// // //   const { profile } = useUserProfile();
// // //   const [tripToEdit, setTripToEdit] = useState<Trip | null>(null);
// // //   const { editTrip } = useTripActions();

// // //   const activeTripsQuery = useMemoFirebase(() => {
// // //     if (!firestore || !user?.uid) return null;
// // //     return query(collection(firestore, 'trips'),
// // //       where('carrierId', '==', user.uid),
// // //       where('status', 'in', [
// // //         'Planned',
// // //         'In-Transit',
// // //         'Has_Offers',
// // //         'Negotiating',
// // //         'Pending-Carrier-Confirmation',
// // //       ])
// // //     );
// // //   }, [firestore, user]);

// // //   // const { data: trips, isLoading } = useCollection<Trip>(activeTripsQuery);
// // //   // ✅ جيب رحلات الناقل — فقط where carrierId (بدون composite index)
// // //   const allTripsQuery = useMemoFirebase(() => {
// // //     if (!firestore || !user?.uid) return null;
// // //     return query(
// // //       collection(firestore, 'trips'),
// // //       where('carrierId', '==', user.uid),
// // //     );
// // //   }, [firestore, user]);

// // //   const { data: rawTrips, isLoading } = useCollection<Trip>(allTripsQuery);

// // //   // [FIX]: نفلتر client-side — نشوف بس الرحلات اللي الناقل أنشأها بنفسه (userId == uid)
// // //   // ده بيمنع طلبات المسافرين اللي اتحدّث عليها carrierId بتاع الناقل من طرف handleAcceptOffer
// // //   const trips = useMemo(
// // //     () => (rawTrips ?? []).filter((t: Trip) => (t as any).userId === user?.uid),
// // //     [rawTrips, user?.uid]
// // //   );

// // //   // ✅ رتّب — النشطة أولاً ثم المنتهية
// // //   const sortedTrips = useMemo(() => {
// // //     if (!trips) return [];
// // //     const activeStatuses = ['Planned', 'In-Transit', 'Has_Offers', 'Negotiating', 'Pending-Carrier-Confirmation'];
// // //     return [...trips].sort((a, b) => {
// // //       const aActive = activeStatuses.includes(a.status) ? 0 : 1;
// // //       const bActive = activeStatuses.includes(b.status) ? 0 : 1;
// // //       if (aActive !== bActive) return aActive - bActive;
// // //       const aDate = (a.departureDate as any)?.toDate?.() ?? new Date(a.departureDate || 0);
// // //       const bDate = (b.departureDate as any)?.toDate?.() ?? new Date(b.departureDate || 0);
// // //       return bDate.getTime() - aDate.getTime();
// // //     });
// // //   }, [trips]);
// // //   // const sortedTrips = useMemo(() => {
// // //   //   if (!trips) return [];
// // //   //   return [...trips].sort((a, b) => {
// // //   //     const aDate = new Date(a.departureDate || 0).getTime();
// // //   //     const bDate = new Date(b.departureDate || 0).getTime();
// // //   //     return aDate - bDate;
// // //   //   });
// // //   // }, [trips]);

// // //   const handleEditTrip = (trip: Trip) => setTripToEdit(trip);

// // //   // const handleConfirmEdit = async (trip: Trip, data: EditTripFormValues) => {
// // //   //   const success = await editTrip(trip, data);
// // //   //   if (success) setTripToEdit(null);
// // //   // };
// // //   const handleConfirmEdit = async (trip: Trip, data: EditTripFormValues) => {
// // //     const success = await editTrip(trip, data);
// // //     if (success) {
// // //       setTripToEdit(null); // يغلق الديالوج فقط في حالة النجاح
// // //     }
// // //     return success; // 👈 أضفنا هذا السطر لإرجاع النتيجة
// // //   };
// // //   if (isLoading) return <LoadingState />;

// // //   return (
// // //     <>
// // //       <div className="space-y-8 w-full pt-10">
// // //         <header>
// // //           <h1 className="text-xl md:text-2xl font-bold">
// // //             {t('title')}
// // //           </h1>
// // //           <p className="text-muted-foreground text-sm md:text-base">
// // //             {t('description')}
// // //           </p>
// // //         </header>

// // //         <main className="space-y-8">
// // //           <MyTripsList
// // //             trips={sortedTrips}
// // //             isLoading={isLoading}
// // //             onEdit={handleEditTrip}
// // //             carrierProfile={profile}
// // //           />
// // //         </main>
// // //       </div>

// // //       {tripToEdit && (
// // //         <EditTripDialog
// // //           isOpen={!!tripToEdit}
// // //           onOpenChange={(open) => !open && setTripToEdit(null)}
// // //           trip={tripToEdit}
// // //           onConfirm={handleConfirmEdit}
// // //         />
// // //       )}
// // //     </>
// // //   );
// // // }
// // 'use client';

// // import { useMemo, useState } from 'react';
// // import { MyTripsList } from '@/components/carrier/my-trips-list';
// // import type { Trip } from '@/lib/data';
// // import { Skeleton } from '@/components/ui/skeleton';
// // import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
// // // 🚀 استيراد أدوات فايربيز لعمل التحديث الجذري المباشر
// // import { collection, query, where, doc, writeBatch, getDocs, serverTimestamp, Timestamp } from 'firebase/firestore';
// // import { EditTripDialog, type EditTripFormValues } from '@/components/carrier/edit-trip-dialog';
// // import { useTranslations } from 'next-intl';
// // import { useUserProfile } from '@/hooks/use-user-profile';

// // function LoadingState() {
// //   return (
// //     <div className="space-y-6">
// //       <Skeleton className="h-8 w-48 rounded-lg mb-4" />
// //       <div className="space-y-3">
// //         {[...Array(1)].map((_, i) => (
// //           <Skeleton key={i} className="h-48 w-full rounded-lg" />
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }

// // export default function CarrierTripsPage() {
// //   const t = useTranslations('carrierTripsPage');
// //   const { user } = useUser();
// //   const firestore = useFirestore();
// //   const { profile } = useUserProfile();
// //   const [tripToEdit, setTripToEdit] = useState<Trip | null>(null);

// //   const allTripsQuery = useMemoFirebase(() => {
// //     if (!firestore || !user?.uid) return null;
// //     return query(
// //       collection(firestore, 'trips'),
// //       where('carrierId', '==', user.uid),
// //     );
// //   }, [firestore, user]);

// //   const { data: rawTrips, isLoading } = useCollection<Trip>(allTripsQuery);

// //   const trips = useMemo(
// //     () => (rawTrips ?? []).filter((t: Trip) => (t as any).userId === user?.uid),
// //     [rawTrips, user?.uid]
// //   );

// //   const sortedTrips = useMemo(() => {
// //     if (!trips) return [];
// //     const activeStatuses = ['Planned', 'In-Transit', 'Has_Offers', 'Negotiating', 'Pending-Carrier-Confirmation'];
// //     return [...trips].sort((a, b) => {
// //       const aActive = activeStatuses.includes(a.status) ? 0 : 1;
// //       const bActive = activeStatuses.includes(b.status) ? 0 : 1;
// //       if (aActive !== bActive) return aActive - bActive;
// //       const aDate = (a.departureDate as any)?.toDate?.() ?? new Date(a.departureDate || 0);
// //       const bDate = (b.departureDate as any)?.toDate?.() ?? new Date(b.departureDate || 0);
// //       return bDate.getTime() - aDate.getTime();
// //     });
// //   }, [trips]);

// //   const handleEditTrip = (trip: Trip) => setTripToEdit(trip);

// //   // 🚀 الحل الجذري: دالة التحديث تكتب مباشرة هنا وتحدث الرحلة والعروض في نفس اللحظة
// //   // const handleConfirmEdit = async (trip: Trip, data: EditTripFormValues) => {
// //   //   if (!firestore) return;

// //   //   try {
// //   //     const batch = writeBatch(firestore);

// //   //     // 1. تحديث مستند الرحلة الأصلي
// //   //     const tripRef = doc(firestore, 'trips', trip.id);
// //   //     batch.update(tripRef, {
// //   //       departureDate: Timestamp.fromDate(new Date(data.departureDate)),
// //   //       price: Number(data.price),
// //   //       availableSeats: Number(data.availableSeats),
// //   //       depositPercentage: Number(data.depositPercentage),
// //   //       updatedAt: serverTimestamp(),
// //   //     });

// //   //     // 2. تحديث جميع العروض (Offers) المرتبطة بهذه الرحلة (ليراها المسافرون فوراً)
// //   //     const offersRef = collection(firestore, 'offers');
// //   //     const offersQuery = query(offersRef, where('carrierTripId', '==', trip.id));
// //   //     const offersSnapshot = await getDocs(offersQuery);

// //   //     offersSnapshot.forEach((offerDoc) => {
// //   //       batch.update(offerDoc.ref, {
// //   //         price: Number(data.price),
// //   //         depositPercentage: Number(data.depositPercentage),
// //   //         updatedAt: serverTimestamp(),
// //   //       });
// //   //     });

// //   //     // تنفيذ أمر الحفظ في فايربيز دفعة واحدة
// //   //     await batch.commit();

// //   //     // إغلاق الديالوج بعد النجاح
// //   //     setTripToEdit(null);

// //   //     // 🚀 تحديث الصفحة إجبارياً لكي تختفي أي بيانات قديمة وتظهر النسب الجديدة مباشرة للناقل
// //   //     window.location.reload();

// //   //   } catch (error) {
// //   //     console.error("Update failed:", error);
// //   //     alert("حدث خطأ أثناء حفظ التعديلات");
// //   //   }
// //   // };
// //   const handleConfirmEdit = async (trip: Trip, data: EditTripFormValues) => {
// //     alert("1. بدأنا عملية الحفظ...");

// //     if (!firestore) {
// //       alert("خطأ: لا يوجد اتصال بقاعدة البيانات (firestore is null)");
// //       return;
// //     }

// //     try {
// //       const batch = writeBatch(firestore);
// //       const tripRef = doc(firestore, 'trips', trip.id);

// //       batch.update(tripRef, {
// //         departureDate: Timestamp.fromDate(new Date(data.departureDate)),
// //         price: Number(data.price),
// //         availableSeats: Number(data.availableSeats),
// //         depositPercentage: Number(data.depositPercentage),
// //         updatedAt: serverTimestamp(),
// //       });

// //       alert("2. تم تجهيز الرحلة، جاري البحث عن العروض...");

// //       const offersRef = collection(firestore, 'offers');
// //       const offersQuery = query(offersRef, where('carrierTripId', '==', trip.id));
// //       const offersSnapshot = await getDocs(offersQuery);

// //       offersSnapshot.forEach((offerDoc) => {
// //         batch.update(offerDoc.ref, {
// //           price: Number(data.price),
// //           depositPercentage: Number(data.depositPercentage),
// //           updatedAt: serverTimestamp(),
// //         });
// //       });

// //       alert("3. تم تجهيز كل شيء، جاري الإرسال النهائي لـ Firebase (غالباً الخطأ سيحدث هنا)...");

// //       // السطر الذي يتم فيه الحفظ الفعلي
// //       await batch.commit();

// //       alert("4. تم الحفظ بنجاح! سيتم إغلاق النافذة الآن.");
// //       setTripToEdit(null);
// //       window.location.reload();

// //     } catch (error: any) {
// //       // إذا فشل الحفظ في فايربيز، ستظهر هذه الرسالة وتخبرنا بالسبب الحقيقي!
// //       alert("❌ فشل الحفظ في قاعدة البيانات! السبب: " + error.message);
// //       console.error("Firebase Update Error:", error);
// //     }
// //   };
// //   if (isLoading) return <LoadingState />;

// //   return (
// //     <>
// //       <div className="space-y-8 w-full pt-10">
// //         <header>
// //           <h1 className="text-xl md:text-2xl font-bold">{t('title')}</h1>
// //           <p className="text-muted-foreground text-sm md:text-base">{t('description')}</p>
// //         </header>

// //         <main className="space-y-8">
// //           <MyTripsList
// //             trips={sortedTrips}
// //             isLoading={isLoading}
// //             onEdit={handleEditTrip}
// //             carrierProfile={profile}
// //           />
// //         </main>
// //       </div>

// //       {tripToEdit && (
// //         <EditTripDialog
// //           isOpen={!!tripToEdit}
// //           onOpenChange={(open) => !open && setTripToEdit(null)}
// //           trip={tripToEdit}
// //           onConfirm={handleConfirmEdit}
// //         />
// //       )}
// //     </>
// //   );
// // }
// 'use client';

// import { useMemo, useState } from 'react';
// import { MyTripsList } from '@/components/carrier/my-trips-list';
// import type { Trip } from '@/lib/data';
// import { Skeleton } from '@/components/ui/skeleton';
// import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
// // 🚀 استيراد أدوات فايربيز لعمل التحديث الجذري المباشر
// import { collection, query, where, doc, writeBatch, getDocs, serverTimestamp, Timestamp } from 'firebase/firestore';
// import { EditTripDialog, type EditTripFormValues } from '@/components/carrier/edit-trip-dialog';
// import { useTranslations } from 'next-intl';
// import { useUserProfile } from '@/hooks/use-user-profile';

// function LoadingState() {
//   return (
//     <div className="space-y-6">
//       <Skeleton className="h-8 w-48 rounded-lg mb-4" />
//       <div className="space-y-3">
//         {[...Array(1)].map((_, i) => (
//           <Skeleton key={i} className="h-48 w-full rounded-lg" />
//         ))}
//       </div>
//     </div>
//   );
// }

// export default function CarrierTripsPage() {
//   const t = useTranslations('carrierTripsPage');
//   const { user } = useUser();
//   const firestore = useFirestore();
//   const { profile } = useUserProfile();
//   const [tripToEdit, setTripToEdit] = useState<Trip | null>(null);

//   const allTripsQuery = useMemoFirebase(() => {
//     if (!firestore || !user?.uid) return null;
//     return query(
//       collection(firestore, 'trips'),
//       where('carrierId', '==', user.uid),
//     );
//   }, [firestore, user]);

//   const { data: rawTrips, isLoading } = useCollection<Trip>(allTripsQuery);

//   const trips = useMemo(
//     () => (rawTrips ?? []).filter((t: Trip) => (t as any).userId === user?.uid),
//     [rawTrips, user?.uid]
//   );

//   const sortedTrips = useMemo(() => {
//     if (!trips) return [];
//     const activeStatuses = ['Planned', 'In-Transit', 'Has_Offers', 'Negotiating', 'Pending-Carrier-Confirmation'];
//     return [...trips].sort((a, b) => {
//       const aActive = activeStatuses.includes(a.status) ? 0 : 1;
//       const bActive = activeStatuses.includes(b.status) ? 0 : 1;
//       if (aActive !== bActive) return aActive - bActive;
//       const aDate = (a.departureDate as any)?.toDate?.() ?? new Date(a.departureDate || 0);
//       const bDate = (b.departureDate as any)?.toDate?.() ?? new Date(b.departureDate || 0);
//       return bDate.getTime() - aDate.getTime();
//     });
//   }, [trips]);

//   const handleEditTrip = (trip: Trip) => setTripToEdit(trip);

//   // 🚀 الحل الجذري: دالة التحديث تكتب مباشرة هنا وتحدث الرحلة والعروض في نفس اللحظة
//   // const handleConfirmEdit = async (trip: Trip, data: EditTripFormValues) => {
//   //   if (!firestore) return;

//   //   try {
//   //     const batch = writeBatch(firestore);

//   //     // 1. تحديث مستند الرحلة الأصلي
//   //     const tripRef = doc(firestore, 'trips', trip.id);
//   //     batch.update(tripRef, {
//   //       departureDate: Timestamp.fromDate(new Date(data.departureDate)),
//   //       price: Number(data.price),
//   //       availableSeats: Number(data.availableSeats),
//   //       depositPercentage: Number(data.depositPercentage),
//   //       updatedAt: serverTimestamp(),
//   //     });

//   //     // 2. تحديث جميع العروض (Offers) المرتبطة بهذه الرحلة (ليراها المسافرون فوراً)
//   //     const offersRef = collection(firestore, 'offers');
//   //     const offersQuery = query(offersRef, where('carrierTripId', '==', trip.id));
//   //     const offersSnapshot = await getDocs(offersQuery);

//   //     offersSnapshot.forEach((offerDoc) => {
//   //       batch.update(offerDoc.ref, {
//   //         price: Number(data.price),
//   //         depositPercentage: Number(data.depositPercentage),
//   //         updatedAt: serverTimestamp(),
//   //       });
//   //     });

//   //     // تنفيذ أمر الحفظ في فايربيز دفعة واحدة
//   //     await batch.commit();

//   //     // إغلاق الديالوج بعد النجاح
//   //     setTripToEdit(null);

//   //     // 🚀 تحديث الصفحة إجبارياً لكي تختفي أي بيانات قديمة وتظهر النسب الجديدة مباشرة للناقل
//   //     window.location.reload();

//   //   } catch (error) {
//   //     console.error("Update failed:", error);
//   //     alert("حدث خطأ أثناء حفظ التعديلات");
//   //   }
//   // };
//   const handleConfirmEdit = async (trip: Trip, data: EditTripFormValues) => {
//     alert("1. بدأنا عملية الحفظ...");

//     if (!firestore) {
//       alert("خطأ: لا يوجد اتصال بقاعدة البيانات (firestore is null)");
//       return;
//     }

//     try {
//       const batch = writeBatch(firestore);
//       const tripRef = doc(firestore, 'trips', trip.id);

//       batch.update(tripRef, {
//         departureDate: Timestamp.fromDate(new Date(data.departureDate)),
//         price: Number(data.price),
//         availableSeats: Number(data.availableSeats),
//         depositPercentage: Number(data.depositPercentage),
//         updatedAt: serverTimestamp(),
//       });

//       alert("2. تم تجهيز الرحلة، جاري البحث عن العروض...");

//       const offersRef = collection(firestore, 'offers');
//       const offersQuery = query(offersRef, where('carrierTripId', '==', trip.id));
//       const offersSnapshot = await getDocs(offersQuery);

//       offersSnapshot.forEach((offerDoc) => {
//         batch.update(offerDoc.ref, {
//           price: Number(data.price),
//           depositPercentage: Number(data.depositPercentage),
//           updatedAt: serverTimestamp(),
//         });
//       });

//       // ✅ تحديث نسبة العربون في بروفايل الناقل عشان تنعكس على الرحلات الجديدة
//       if (user) {
//         batch.update(doc(firestore, 'users', user.uid), {
//           depositPercentage: Number(data.depositPercentage),
//           updatedAt: serverTimestamp(),
//         });
//       }

//       alert("3. تم تجهيز كل شيء، جاري الإرسال النهائي لـ Firebase (غالباً الخطأ سيحدث هنا)...");

//       // السطر الذي يتم فيه الحفظ الفعلي
//       await batch.commit();

//       alert("4. تم الحفظ بنجاح! سيتم إغلاق النافذة الآن.");
//       setTripToEdit(null);
//       window.location.reload();

//     } catch (error: any) {
//       // إذا فشل الحفظ في فايربيز، ستظهر هذه الرسالة وتخبرنا بالسبب الحقيقي!
//       alert("❌ فشل الحفظ في قاعدة البيانات! السبب: " + error.message);
//       console.error("Firebase Update Error:", error);
//     }
//   };
//   if (isLoading) return <LoadingState />;

//   return (
//     <>
//       <div className="space-y-8 w-full pt-10">
//         <header>
//           <h1 className="text-xl md:text-2xl font-bold">{t('title')}</h1>
//           <p className="text-muted-foreground text-sm md:text-base">{t('description')}</p>
//         </header>

//         <main className="space-y-8">
//           <MyTripsList
//             trips={sortedTrips}
//             isLoading={isLoading}
//             onEdit={handleEditTrip}
//             carrierProfile={profile}
//           />
//         </main>
//       </div>

//       {tripToEdit && (
//         <EditTripDialog
//           isOpen={!!tripToEdit}
//           onOpenChange={(open) => !open && setTripToEdit(null)}
//           trip={tripToEdit}
//           onConfirm={handleConfirmEdit}
//         />
//       )}
//     </>
//   );
// }
'use client';

import { useMemo, useState } from 'react';
import { MyTripsList } from '@/components/carrier/my-trips-list';
import type { Trip } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import {
  collection,
  query,
  where,
  doc,
  writeBatch,
  getDocs,
  serverTimestamp,
  Timestamp,
  addDoc,
} from 'firebase/firestore';
import { EditTripDialog, type EditTripFormValues } from '@/components/carrier/edit-trip-dialog';
import { useTranslations } from 'next-intl';
import { useUserProfile } from '@/hooks/use-user-profile';
import { useLocale } from 'next-intl';

function LoadingState() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48 rounded-lg mb-4" />
      <div className="space-y-3">
        {[...Array(1)].map((_, i) => (
          <Skeleton key={i} className="h-48 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export default function CarrierTripsPage() {
  const t = useTranslations('carrierTripsPage');
  const { user } = useUser();
  const firestore = useFirestore();
  const { profile } = useUserProfile();
  const locale = useLocale();
  const [tripToEdit, setTripToEdit] = useState<Trip | null>(null);
  const [bookedCountForEdit, setBookedCountForEdit] = useState(0);

  const allTripsQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return query(
      collection(firestore, 'trips'),
      where('carrierId', '==', user.uid),
    );
  }, [firestore, user]);

  const { data: rawTrips, isLoading } = useCollection<Trip>(allTripsQuery);

  const trips = useMemo(
    () => (rawTrips ?? []).filter((t: Trip) => (t as any).userId === user?.uid),
    [rawTrips, user?.uid]
  );

  const sortedTrips = useMemo(() => {
    if (!trips) return [];
    const activeStatuses = ['Planned', 'In-Transit', 'Has_Offers', 'Negotiating', 'Pending-Carrier-Confirmation'];
    return [...trips].sort((a, b) => {
      const aActive = activeStatuses.includes(a.status) ? 0 : 1;
      const bActive = activeStatuses.includes(b.status) ? 0 : 1;
      if (aActive !== bActive) return aActive - bActive;
      const aDate = (a.departureDate as any)?.toDate?.() ?? new Date(a.departureDate || 0);
      const bDate = (b.departureDate as any)?.toDate?.() ?? new Date(b.departureDate || 0);
      return bDate.getTime() - aDate.getTime();
    });
  }, [trips]);

  // ── فتح الـ dialog مع جلب عدد الحجوزات الفعلية أولاً ──
  const handleEditTrip = async (trip: Trip) => {
    if (!firestore) return;
    try {
      const bookingsSnap = await getDocs(
        query(collection(firestore, 'bookings'), where('carrierTripId', '==', trip.id))
      );
      const activeStatuses = ['Confirmed', 'Pending-Payment', 'Pending-Payment-Verification'];
      const activeBookings = bookingsSnap.docs.filter(d => activeStatuses.includes(d.data().status));
      setBookedCountForEdit(activeBookings.length);
    } catch {
      setBookedCountForEdit(0);
    }
    setTripToEdit(trip);
  };

  /**
   * handleConfirmEdit:
   *
   * لو مفيش حجوزات:
   *   → يحدّث التاريخ + الوقت + السعر + نسبة العربون فوراً على الرحلة والعروض وبروفايل الناقل
   *
   * لو في حجوزات:
   *   → يسجّل pendingReschedule على الرحلة (التاريخ والوقت الجديدَين + السبب)
   *   → يبعت notification لكل مسافر محجوز
   *   → الرحلة لا تتغير حتى يوافق الجميع
   */
  const handleConfirmEdit = async (trip: Trip, data: EditTripFormValues) => {
    if (!firestore) return;

    try {
      const newDate = Timestamp.fromDate(new Date(data.departureDate));
      const newTime = data.departureTime?.trim() || null;
      const reason = data.rescheduleReason?.trim() || '';

      // جيب الحجوزات النشطة
      const bookingsSnap = await getDocs(
        query(collection(firestore, 'bookings'), where('carrierTripId', '==', trip.id))
      );
      const activeStatuses = ['Confirmed', 'Pending-Payment', 'Pending-Payment-Verification'];
      const activeBookings = bookingsSnap.docs.filter(d => activeStatuses.includes(d.data().status));

      const batch = writeBatch(firestore);
      const tripRef = doc(firestore, 'trips', trip.id);

      if (activeBookings.length === 0) {
        // ✅ مفيش حجوزات — حدّث كل شيء فوراً
        const updatePayload: any = {
          departureDate: newDate,
          price: Number(data.price),
          depositPercentage: Number(data.depositPercentage),
          updatedAt: serverTimestamp(),
        };
        if (newTime) updatePayload.departureTime = newTime;
        batch.update(tripRef, updatePayload);

        // حدّث العروض المرتبطة
        const offersSnap = await getDocs(
          query(collection(firestore, 'offers'), where('carrierTripId', '==', trip.id))
        );
        offersSnap.forEach((offerDoc) => {
          batch.update(offerDoc.ref, {
            price: Number(data.price),
            depositPercentage: Number(data.depositPercentage),
            updatedAt: serverTimestamp(),
          });
        });

        // حدّث بروفايل الناقل (نسبة العربون الافتراضية)
        if (user) {
          batch.update(doc(firestore, 'users', user.uid), {
            depositPercentage: Number(data.depositPercentage),
            updatedAt: serverTimestamp(),
          });
        }

        await batch.commit();

      } else {
        // ⏳ في حجوزات — ابعت طلب موافقة (موعد بس، بدون تغيير السعر)
        const affectedBookingIds = activeBookings.map(d => d.id);
        const affectedUserIds = [...new Set(activeBookings.map(d => d.data().userId as string))];

        batch.update(tripRef, {
          pendingReschedule: {
            newDepartureDate: new Date(data.departureDate).toISOString(),
            newDepartureTime: newTime || null,
            reason,
            requestedAt: serverTimestamp(),
            approvals: [],
            rejections: [],
            affectedBookingIds,
            totalRequired: affectedUserIds.length,
          },
          updatedAt: serverTimestamp(),
        });

        await batch.commit();

        // بعت notification لكل مسافر
        const formattedDate = new Date(data.departureDate).toLocaleDateString('ar', {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        });
        const formattedTime = newTime ? ` — الساعة ${newTime}` : '';

        for (const userId of affectedUserIds) {
          try {
            const bookingId = activeBookings.find(d => d.data().userId === userId)?.id || trip.id;
            await addDoc(
              collection(doc(firestore, 'users', userId), 'notifications'),
              {
                userId,
                title: '⏰ طلب تغيير موعد الرحلة',
                message: `الناقل يطلب تغيير الموعد إلى ${formattedDate}${formattedTime}. السبب: ${reason || 'لم يُذكر'}`,
                type: 'reschedule_request',
                tripId: trip.id,
                isRead: false,
                link: `/${locale}/ticket/${bookingId}`,
                createdAt: serverTimestamp(),
              }
            );
          } catch (notifError) {
            console.warn('[TripsPage] Notification failed (non-critical):', notifError);
          }
        }
      }

      setTripToEdit(null);
    } catch (error: any) {
      console.error('[TripsPage] Edit failed:', error);
      alert('حدث خطأ أثناء حفظ التغييرات: ' + error.message);
    }
  };

  if (isLoading) return <LoadingState />;

  return (
    <>
      <div className="space-y-8 w-full pt-10">
        <header>
          <h1 className="text-xl md:text-2xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground text-sm md:text-base">{t('description')}</p>
        </header>

        <main className="space-y-8">
          <MyTripsList
            trips={sortedTrips}
            isLoading={isLoading}
            onEdit={handleEditTrip}
            carrierProfile={profile}
          />
        </main>
      </div>

      {tripToEdit && (
        <EditTripDialog
          isOpen={!!tripToEdit}
          onOpenChange={(open) => !open && setTripToEdit(null)}
          trip={tripToEdit}
          bookedCount={bookedCountForEdit}
          onConfirm={handleConfirmEdit}
        />
      )}
    </>
  );
}