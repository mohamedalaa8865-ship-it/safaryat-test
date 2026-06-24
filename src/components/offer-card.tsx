// 'use client';

// import type { Trip, UserProfile } from '@/lib/data';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Button } from '@/components/ui/button';
// import { DollarSign, Star, Info, Car, Clock, CheckCircle2, Loader2 } from 'lucide-react';
// import { Badge } from '@/components/ui/badge';
// import { cn } from '@/lib/utils';
// import { BookingSummarySheet } from './booking/booking-summary-sheet';
// import { useState } from 'react';
// import { useTranslations } from 'next-intl';

// interface OfferCardProps {
//     offer: any;
//     carrier: UserProfile;
//     onAccept: () => void;
//     isAccepting: boolean;
//     trip: Trip;
// }

// export function OfferCard({ offer, carrier, trip, onAccept, isAccepting }: OfferCardProps) {
//     if (!trip) return null;

//     const t = useTranslations('offerCard');

//     const [isBookingSheetOpen, setIsBookingSheetOpen] = useState(false);

//     const handleSheetConfirm = () => {
//         setIsBookingSheetOpen(false);
//         // تفويض الـ flow الكامل (booking + email dialog) للـ parent
//         // لأن الـ EmailConfirmDialog موجودة في مستوى أعلى خارج الـ Carousel
//         // وده يمنع مشكلة unmount الـ state لما الـ Offer list تتغير بعد قبول العرض
//         onAccept();
//     };

//     return (
//         <div className={cn(
//             "relative bg-card border rounded-2xl overflow-hidden shadow-sm transition-all h-full flex flex-col",
//             offer.isLowestPrice && "border-green-500/50 ring-1 ring-green-500/20",
//             offer.isHighestRated && !offer.isLowestPrice && "border-amber-500/50 ring-1 ring-amber-500/20"
//         )}>
//             <div className="absolute top-3 right-3 left-3 flex justify-between z-10 pointer-events-none">
//                 {offer.isLowestPrice && (
//                     <Badge className="bg-green-600 text-white gap-1 shadow-md border-0">
//                         <DollarSign className="h-3 w-3" /> {t('cheapest')}
//                     </Badge>
//                 )}
//                 {offer.isHighestRated && (
//                     <Badge className="bg-amber-500 text-white gap-1 shadow-md border-0 ml-auto">
//                         <Star className="h-3 w-3 fill-current" /> {t('highestRated')}
//                     </Badge>
//                 )}
//             </div>

//             <div className="p-5 pt-12 flex-1 flex flex-col space-y-4">
//                 <div className="flex flex-col items-center text-center space-y-2">
//                     <Avatar className="h-16 w-16 border-2 border-background shadow-sm">
//                         <AvatarImage
//                             src={carrier.photoURL || "/default-avatar.png"}
//                             alt={carrier.firstName || "Carrier"}
//                         />
//                         <AvatarFallback>{carrier.firstName?.charAt(0) || "C"}</AvatarFallback>
//                     </Avatar>
//                     <div>
//                         <h3 className="font-bold text-lg leading-none">{carrier.firstName} {carrier.lastName}</h3>
//                         <div className="flex items-center justify-center gap-1 text-amber-500 text-xs mt-1">
//                             <Star className="h-3 w-3 fill-current" />
//                             <span className="font-bold">{carrier.ratingStats?.average?.toFixed(1) || t('newCarrier')}</span>
//                             <span className="text-muted-foreground font-normal">({carrier.ratingStats?.count || 0})</span>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="h-px bg-border/50 w-full" />

//                 <div className="flex flex-col items-center justify-center py-2 bg-muted/20 rounded-xl">
//                     <div className="flex items-baseline gap-1">
//                         <span className="text-4xl font-black text-primary">{offer.price}</span>
//                         <span className="text-sm font-bold text-muted-foreground">{offer.currency}</span>
//                     </div>
//                     <p className="text-[10px] text-muted-foreground mt-1">{t('totalPrice')}</p>
//                 </div>

//                 <div className="grid grid-cols-2 gap-2 text-xs">
//                     <div className="flex items-center gap-2 p-2 bg-secondary/30 rounded-lg">
//                         <Car className="h-3.5 w-3.5 text-primary" />
//                         <span className="truncate">{offer.vehicleType}</span>
//                     </div>
//                     <div className="flex items-center gap-2 p-2 bg-secondary/30 rounded-lg">
//                         <Clock className="h-3.5 w-3.5 text-primary" />
//                         <span>{offer.estimatedDurationHours}  {t('hours')}</span>
//                     </div>
//                 </div>

//                 <div className="space-y-1.5 pt-2">
//                     <p className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
//                         <Info className="h-3 w-3" /> {t('carrierConditions')}
//                     </p>
//                     <div className="p-3 bg-muted/50 rounded-lg border border-dashed text-xs leading-relaxed text-foreground/90 max-h-24 overflow-y-auto">
//                         {offer.notes || offer.conditions || t('noConditions')}
//                     </div>
//                 </div>
//             </div>

//             <div className="p-4 bg-muted/30 border-t mt-auto">
//                 <Button
//                     className="w-full h-12 gap-2 font-bold text-base shadow-lg active:scale-95 transition-transform"
//                     onClick={() => setIsBookingSheetOpen(true)}
//                     disabled={isAccepting}
//                 >
//                     {isAccepting
//                         ? <Loader2 className="h-5 w-5 animate-spin" />
//                         : <><CheckCircle2 className="h-5 w-5" />{t('acceptOffer')}</>
//                     }
//                 </Button>
//             </div>

//             <BookingSummarySheet
//                 isOpen={isBookingSheetOpen}
//                 onClose={() => setIsBookingSheetOpen(false)}
//                 onConfirm={handleSheetConfirm}
//                 trip={trip}
//                 countryCode={trip?.currency === 'IQD' ? 'IQ' : 'JO'}
//             />
//         </div>
//     );
// }
'use client';

import type { Trip, UserProfile } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DollarSign, Star, Info, Car, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { BookingSummarySheet } from './booking/booking-summary-sheet';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface OfferCardProps {
    offer: any;
    carrier: UserProfile;
    onAccept: () => void;
    isAccepting: boolean;
    trip: Trip;
}

export function OfferCard({ offer, carrier, trip, onAccept, isAccepting }: OfferCardProps) {
    if (!trip) return null;

    const t = useTranslations('offerCard');

    const [isBookingSheetOpen, setIsBookingSheetOpen] = useState(false);

    const handleSheetConfirm = () => {
        setIsBookingSheetOpen(false);
        // تفويض الـ flow الكامل (booking + email dialog) للـ parent
        // لأن الـ EmailConfirmDialog موجودة في مستوى أعلى خارج الـ Carousel
        // وده يمنع مشكلة unmount الـ state لما الـ Offer list تتغير بعد قبول العرض
        onAccept();
    };

    return (
        <div className={cn(
            "relative bg-card border rounded-2xl overflow-hidden shadow-sm transition-all h-full flex flex-col",
            offer.isLowestPrice && "border-green-500/50 ring-1 ring-green-500/20",
            offer.isHighestRated && !offer.isLowestPrice && "border-amber-500/50 ring-1 ring-amber-500/20"
        )}>
            <div className="absolute top-3 right-3 left-3 flex justify-between z-10 pointer-events-none">
                {offer.isLowestPrice && (
                    <Badge className="bg-green-600 text-white gap-1 shadow-md border-0">
                        <DollarSign className="h-3 w-3" /> {t('cheapest')}
                    </Badge>
                )}
                {offer.isHighestRated && (
                    <Badge className="bg-amber-500 text-white gap-1 shadow-md border-0 ml-auto">
                        <Star className="h-3 w-3 fill-current" /> {t('highestRated')}
                    </Badge>
                )}
            </div>

            <div className="p-5 pt-12 flex-1 flex flex-col space-y-4">
                <div className="flex flex-col items-center text-center space-y-2">
                    <Avatar className="h-16 w-16 border-2 border-background shadow-sm">
                        <AvatarImage
                            src={carrier.photoURL || "/default-avatar.png"}
                            alt={carrier.firstName || "Carrier"}
                        />
                        <AvatarFallback>{carrier.firstName?.charAt(0) || "C"}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-bold text-lg leading-none">{carrier.firstName} {carrier.lastName}</h3>
                        <div className="flex items-center justify-center gap-1 text-amber-500 text-xs mt-1">
                            <Star className="h-3 w-3 fill-current" />
                            <span className="font-bold">{carrier.ratingStats?.average?.toFixed(1) || t('newCarrier')}</span>
                            <span className="text-muted-foreground font-normal">({carrier.ratingStats?.count || 0})</span>
                        </div>
                    </div>
                </div>

                <div className="h-px bg-border/50 w-full" />

                <div className="flex flex-col items-center justify-center py-2 bg-muted/20 rounded-xl">
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black text-primary">{offer.price}</span>
                        <span className="text-sm font-bold text-muted-foreground">{offer.currency}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">{t('totalPrice')}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2 p-2 bg-secondary/30 rounded-lg">
                        <Car className="h-3.5 w-3.5 text-primary" />
                        <span className="truncate">{offer.vehicleType}</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-secondary/30 rounded-lg">
                        <Clock className="h-3.5 w-3.5 text-primary" />
                        <span>{offer.estimatedDurationHours}  {t('hours')}</span>
                    </div>
                </div>

                <div className="space-y-1.5 pt-2">
                    <p className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                        <Info className="h-3 w-3" /> {t('carrierConditions')}
                    </p>
                    <div className="p-3 bg-muted/50 rounded-lg border border-dashed text-xs leading-relaxed text-foreground/90 max-h-24 overflow-y-auto">
                        {offer.notes || offer.conditions || t('noConditions')}
                    </div>
                </div>
            </div>

            <div className="p-4 bg-muted/30 border-t mt-auto">
                <Button
                    className="w-full h-12 gap-2 font-bold text-base shadow-lg active:scale-95 transition-transform"
                    onClick={() => setIsBookingSheetOpen(true)}
                    disabled={isAccepting}
                >
                    {isAccepting
                        ? <Loader2 className="h-5 w-5 animate-spin" />
                        : <><CheckCircle2 className="h-5 w-5" />{t('acceptOffer')}</>
                    }
                </Button>
            </div>

            <BookingSummarySheet
                isOpen={isBookingSheetOpen}
                onClose={() => setIsBookingSheetOpen(false)}
                onConfirm={handleSheetConfirm}
                trip={trip}
                offer={offer}
                countryCode={trip?.currency === 'IQD' ? 'IQ' : 'JO'}
            />
        </div>
    );
}