'use client';

import { useMemo, useState } from 'react';
import { MyTripsList } from '@/components/carrier/my-trips-list';
import type { Trip, UserProfile } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { EditTripDialog, type EditTripFormValues } from '@/components/carrier/edit-trip-dialog';
import { useTripActions } from '@/hooks/use-trip-actions';
import { useTranslations } from 'next-intl';
import { useUserProfile } from '@/hooks/use-user-profile';

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

/**
 * @page CarrierTripsPage
 * @description THE REINFORCED TRIPS LIST (SC-806 V2.6)
 * Enforced useMemoFirebase for arterial stability.
 */
export default function CarrierTripsPage() {
  const t = useTranslations('carrierTripsPage');
  const { user } = useUser();
  const firestore = useFirestore();
  const { profile } = useUserProfile();
  const [tripToEdit, setTripToEdit] = useState<Trip | null>(null);
  const { editTrip } = useTripActions();

  const activeTripsQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return query(collection(firestore, 'trips'),
      where('carrierId', '==', user.uid),
      where('status', 'in', [
        'Planned',
        'In-Transit',
        'Has_Offers',
        'Negotiating',
        'Pending-Carrier-Confirmation',
      ])
    );
  }, [firestore, user]);

  // const { data: trips, isLoading } = useCollection<Trip>(activeTripsQuery);
  // ✅ جيب كل الرحلات بدون فلتر status
  const allTripsQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return query(
      collection(firestore, 'trips'),
      where('carrierId', '==', user.uid),
    );
  }, [firestore, user]);

  const { data: trips, isLoading } = useCollection<Trip>(allTripsQuery);

  // ✅ رتّب — النشطة أولاً ثم المنتهية
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
  // const sortedTrips = useMemo(() => {
  //   if (!trips) return [];
  //   return [...trips].sort((a, b) => {
  //     const aDate = new Date(a.departureDate || 0).getTime();
  //     const bDate = new Date(b.departureDate || 0).getTime();
  //     return aDate - bDate;
  //   });
  // }, [trips]);

  const handleEditTrip = (trip: Trip) => setTripToEdit(trip);

  const handleConfirmEdit = async (trip: Trip, data: EditTripFormValues) => {
    const success = await editTrip(trip, data);
    if (success) setTripToEdit(null);
  };

  if (isLoading) return <LoadingState />;

  return (
    <>
      <div className="space-y-8 w-full pt-10">
        <header>
          <h1 className="text-xl md:text-2xl font-bold">
            {t('title')}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            {t('description')}
          </p>
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

      {/* <EditTripDialog
        isOpen={!!tripToEdit}
        onOpenChange={(open) => !open && setTripToEdit(null)}
        trip={tripToEdit}
        onConfirm={handleConfirmEdit}
      /> */}
    </>
  );
}
