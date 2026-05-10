// 'use client';

// import { useState, useMemo, useTransition } from 'react';
// import type { Offer, Trip, UserProfile } from '@/lib/data';
// import { Button } from '@/components/ui/button';
// import { ArrowRight, Clock, Star, DollarSign, LayoutGrid } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
// import { collection, query, where, documentId } from 'firebase/firestore';
// import { OfferCard } from '@/components/offer-card';
// import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
// import { Skeleton } from '@/components/ui/skeleton';
// import { useTranslations } from 'next-intl';

// interface OfferDecisionRoomProps {
//   trip: Trip;
//   offers: Offer[];
//   onAcceptOffer: (trip: Trip, offer: Offer) => void;
//   isProcessing: boolean;
//   onBack: () => void;
// }

// /**
//  * @component OfferDecisionRoom
//  * @description THE INTELLIGENT COMMAND CENTER (STERILIZED - SC-806 V2.6.1)
//  * Enforced useMemoFirebase for queries to ensure zero redundant reads and resolve memo errors.
//  */
// export function OfferDecisionRoom({ trip, offers, onAcceptOffer, isProcessing, onBack }: OfferDecisionRoomProps) {
//   const [sortMode, setSortMode] = useState<'recommended' | 'price' | 'rating'>('recommended');
//   const firestore = useFirestore();
//   const t = useTranslations('statusCards');

//   const carrierIds = useMemo(() => [...new Set(offers.map(o => o.carrierId))], [offers]);

//   const carriersQuery = useMemoFirebase(() => {
//     if (!firestore || carrierIds.length === 0) return null;
//     return query(collection(firestore, 'users'), where(documentId(), 'in', carrierIds));
//   }, [firestore, carrierIds]);

//   const { data: carriers, isLoading: isLoadingCarriers } = useCollection<UserProfile>(carriersQuery);

//   const carriersMap = useMemo(() => {
//     const map = new Map<string, UserProfile>();
//     carriers?.forEach(c => map.set(c.id, c));
//     return map;
//   }, [carriers]);

//   const processedOffers = useMemo(() => {
//     if (isLoadingCarriers || carriersMap.size === 0) return [];

//     // 1. Data Enrichment & Stability
//     const enriched = offers.map(offer => {
//       const carrier = carriersMap.get(offer.carrierId);
//       return carrier ? {
//         ...offer,
//         carrierRating: carrier.ratingStats?.average || 0,
//         carrierTier: carrier.ratingStats?.tier || 'BRONZE',
//       } : null;
//     }).filter(Boolean);

//     // 2. Global Benchmarks (Absolute Transparency)
//     const minPrice = Math.min(...enriched.map(o => o!.price).filter(p => p > 0));
//     const maxRating = Math.max(...enriched.map(o => o!.carrierRating));

//     // 3. Mark for Special UI Badges
//     const finalized = enriched.map(o => ({
//       ...o!,
//       isLowestPrice: o!.price === minPrice,
//       isHighestRated: o!.carrierRating === maxRating && maxRating > 0,
//     }));

//     // 4. Multi-modal Sorting
//     return finalized.sort((a, b) => {
//       if (sortMode === 'price') return a.price - b.price;
//       if (sortMode === 'rating') return b.carrierRating - a.carrierRating;
//       // Recommended: Balanced Score
//       return (b.carrierRating * 10 - b.price) - (a.carrierRating * 10 - a.price);
//     });
//   }, [offers, sortMode, carriersMap, isLoadingCarriers]);

//   if (isLoadingCarriers && offers.length > 0) {
//     return <div className="p-4 flex justify-center"><Skeleton className="h-[450px] w-full max-w-[350px] rounded-xl" /></div>;
//   }

//   if (!offers.length && !isLoadingCarriers) {
//     return (
//       <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
//         <Clock className="h-12 w-12 mb-4 animate-pulse opacity-20" />
//         <p>{t('awaitingOffers.badge')}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
//       <div className="flex items-center justify-between">
//         <Button variant="ghost" size="sm" onClick={onBack} className="gap-1 text-muted-foreground">
//           <ArrowRight className="h-4 w-4" /> {t('offerDesc.back')}
//         </Button>
//         <div className="flex gap-2">
//           <Button variant={sortMode === 'recommended' ? 'default' : 'outline'} size="sm" onClick={() => setSortMode('recommended')} className="h-8 text-xs gap-1"><LayoutGrid className="h-3 w-3" /> {t('offerDesc.proposal')}</Button>
//           <Button variant={sortMode === 'price' ? 'default' : 'outline'} size="sm" onClick={() => setSortMode('price')} className="h-8 text-xs gap-1"><DollarSign className="h-3 w-3" /> {t('offerDesc.mostAffordable')}</Button>
//           <Button variant={sortMode === 'rating' ? 'default' : 'outline'} size="sm" onClick={() => setSortMode('rating')} className="h-8 text-xs gap-1"><Star className="h-3 w-3" /> {t('offerDesc.best')}</Button>
//         </div>
//       </div>

//       <Carousel opts={{ align: "start", direction: 'rtl' }} className="w-full">
//         <CarouselContent className="-ml-4">
//           {processedOffers.map((offer) => (
//             <CarouselItem key={offer.id} className="pl-4 basis-[85%] md:basis-1/2 lg:basis-1/3">
//               <OfferCard
//                 offer={offer}
//                 carrier={carriersMap.get(offer.carrierId)!}
//                 onAccept={() => onAcceptOffer(trip, offer as any)}
//                 isAccepting={isProcessing}
//                 trip={trip}
//               />
//             </CarouselItem>
//           ))}
//         </CarouselContent>
//         <CarouselPrevious className="hidden sm:flex" />
//         <CarouselNext className="hidden sm:flex" />
//       </Carousel>

//       <div className="text-center text-[10px] text-muted-foreground">
//         {t('footer.swipeToCompare')} {offers.length} {t('footer.offerAvailiable')}
//       </div>
//     </div>
//   );
// }

'use client';

import { useState, useMemo } from 'react';
import type { Offer, Trip, UserProfile } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, Star, DollarSign, LayoutGrid } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, documentId } from 'firebase/firestore';
import { OfferCard } from '@/components/offer-card';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslations } from 'next-intl';

interface OfferDecisionRoomProps {
  trip: Trip;
  offers: Offer[];
  onAcceptOffer: (trip: Trip, offer: Offer) => void;
  isProcessing: boolean;
  onBack: () => void;
}

export function OfferDecisionRoom({ trip, offers, onAcceptOffer, isProcessing, onBack }: OfferDecisionRoomProps) {
  const [sortMode, setSortMode] = useState<'recommended' | 'price' | 'rating'>('recommended');
  const firestore = useFirestore();
  const t = useTranslations('statusCards');

  // 1. جلب بيانات الناقلين
  const carrierIds = useMemo(() => [...new Set(offers.map(o => o.carrierId))], [offers]);
  const carriersQuery = useMemoFirebase(() => {
    if (!firestore || carrierIds.length === 0) return null;
    return query(collection(firestore, 'users'), where(documentId(), 'in', carrierIds));
  }, [firestore, carrierIds]);
  const { data: carriers, isLoading: isLoadingCarriers } = useCollection<UserProfile>(carriersQuery);

  const carriersMap = useMemo(() => {
    const map = new Map<string, UserProfile>();
    carriers?.forEach(c => map.set(c.id, c));
    return map;
  }, [carriers]);

  // 🚀 2. [SMART MATCH]: جلب رحلات الناقلين الأصلية لسحب الوقت والمدة منها
  const carrierTripIds = useMemo(() => {
    const ids = offers.map(o => o.carrierTripId).filter(Boolean) as string[];
    return [...new Set(ids)];
  }, [offers]);

  const tripsQuery = useMemoFirebase(() => {
    if (!firestore || carrierTripIds.length === 0) return null;
    return query(collection(firestore, 'trips'), where(documentId(), 'in', carrierTripIds));
  }, [firestore, carrierTripIds]);

  const { data: carrierTrips, isLoading: isLoadingTrips } = useCollection<Trip>(tripsQuery);

  const tripsMap = useMemo(() => {
    const map = new Map<string, Trip>();
    carrierTrips?.forEach(t => map.set(t.id, t));
    return map;
  }, [carrierTrips]);

  const processedOffers = useMemo(() => {
    if (isLoadingCarriers || isLoadingTrips || carriersMap.size === 0) return [];

    // 3. دمج بيانات الناقل وبيانات الرحلة الأصلية (الوقت) داخل العرض
    const enriched = offers.map(offer => {
      const carrier = carriersMap.get(offer.carrierId);
      const cTrip = offer.carrierTripId ? tripsMap.get(offer.carrierTripId) : null;

      return carrier ? {
        ...offer,
        carrierRating: carrier.ratingStats?.average || 0,
        carrierTier: carrier.ratingStats?.tier || 'BRONZE',
        // 🌟 زرع الوقت والمدة من رحلة الناقل لتُعرض في OfferCard
        departureTime: cTrip?.departureTime || (offer as any).departureTime,
        estimatedDurationHours: cTrip?.estimatedDurationHours || (offer as any).estimatedDurationHours,
        vehicleType: cTrip?.vehicleType || (offer as any).vehicleType,
      } : null;
    }).filter(Boolean);

    const minPrice = Math.min(...enriched.map(o => o!.price).filter(p => p > 0));
    const maxRating = Math.max(...enriched.map(o => o!.carrierRating));

    const finalized = enriched.map(o => ({
      ...o!,
      isLowestPrice: o!.price === minPrice,
      isHighestRated: o!.carrierRating === maxRating && maxRating > 0,
    }));

    return finalized.sort((a, b) => {
      if (sortMode === 'price') return a.price - b.price;
      if (sortMode === 'rating') return b.carrierRating - a.carrierRating;
      return (b.carrierRating * 10 - b.price) - (a.carrierRating * 10 - a.price);
    });
  }, [offers, sortMode, carriersMap, tripsMap, isLoadingCarriers, isLoadingTrips]);

  if ((isLoadingCarriers || isLoadingTrips) && offers.length > 0) {
    return <div className="p-4 flex justify-center"><Skeleton className="h-[450px] w-full max-w-[350px] rounded-xl" /></div>;
  }

  if (!offers.length && !isLoadingCarriers) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Clock className="h-12 w-12 mb-4 animate-pulse opacity-20" />
        <p>{t('awaitingOffers.badge')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1 text-muted-foreground">
          <ArrowRight className="h-4 w-4" /> {t('offerDesc.back')}
        </Button>
        <div className="flex gap-2">
          <Button variant={sortMode === 'recommended' ? 'default' : 'outline'} size="sm" onClick={() => setSortMode('recommended')} className="h-8 text-xs gap-1"><LayoutGrid className="h-3 w-3" /> {t('offerDesc.proposal')}</Button>
          <Button variant={sortMode === 'price' ? 'default' : 'outline'} size="sm" onClick={() => setSortMode('price')} className="h-8 text-xs gap-1"><DollarSign className="h-3 w-3" /> {t('offerDesc.mostAffordable')}</Button>
          <Button variant={sortMode === 'rating' ? 'default' : 'outline'} size="sm" onClick={() => setSortMode('rating')} className="h-8 text-xs gap-1"><Star className="h-3 w-3" /> {t('offerDesc.best')}</Button>
        </div>
      </div>

      <Carousel opts={{ align: "start", direction: 'rtl' }} className="w-full">
        <CarouselContent className="-ml-4">
          {processedOffers.map((offer) => (
            <CarouselItem key={offer.id} className="pl-4 basis-[85%] md:basis-1/2 lg:basis-1/3">
              <OfferCard
                offer={offer}
                carrier={carriersMap.get(offer.carrierId)!}
                onAccept={() => onAcceptOffer(trip, offer as any)}
                isAccepting={isProcessing}
                trip={trip}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>

      <div className="text-center text-[10px] text-muted-foreground">
        {t('footer.swipeToCompare')} {offers.length} {t('footer.offerAvailiable')}
      </div>
    </div>
  );
}