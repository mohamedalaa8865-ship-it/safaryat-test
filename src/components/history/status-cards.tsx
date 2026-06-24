// // 'use client';

// // import { useMemo } from 'react';
// // import { useRouter } from '@/i18n/routing';
// // import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
// // import { Badge } from '@/components/ui/badge';
// // import { CreditCard, Hourglass, Radar, AlertTriangle, RefreshCcw, XCircle, Search } from 'lucide-react';
// // import type { Trip, Booking, Offer } from '@/lib/data';
// // import { getCityName, SOVEREIGN_GEO_REGISTRY as CITIES } from '@/lib/constants';
// // import { Button } from '@/components/ui/button';
// // import { useLocale, useTranslations } from 'next-intl';
// // import { cn } from '@/lib/utils';
// // import { triggerHaptic } from '@/lib/utils';

// // export const PendingPaymentCard = ({ booking, trip, onClick }: { booking: Booking, trip?: Trip | null, onClick: () => void }) => {
// //     const locale = useLocale();
// //     const t = useTranslations('PendingPaymentCard')
// //     return (
// //         <Card className="border-orange-500 border-2 bg-orange-500/5 cursor-pointer hover:bg-orange-500/10 mb-4" onClick={() => { triggerHaptic('light'); onClick(); }}>
// //             <CardHeader>
// //                 <div className="flex justify-between items-start">
// //                     <div>
// //                         <CardTitle className="text-lg">{trip ? `${getCityName(trip.origin, locale)} - ${getCityName(trip.destination, locale)}` : t('loading')}</CardTitle>
// //                         <CardDescription>{t('withCarrier')}: {trip?.carrierName || '...'}</CardDescription>
// //                     </div>
// //                     <Badge variant="outline" className="flex items-center gap-2 bg-orange-100 text-orange-800 border-orange-300">
// //                         <CreditCard className="h-4 w-4 animate-pulse" />
// //                         {t('waitingDeposit')}
// //                     </Badge>
// //                 </div>
// //             </CardHeader>
// //             <CardContent>
// //                 <p className="font-bold text-center text-orange-600">
// //                     {t('accptCarrier')}
// //                 </p>
// //             </CardContent>
// //         </Card>
// //     );
// // };

// // export const PendingConfirmationCard = ({ booking, trip }: { booking: Booking, trip?: Trip | null }) => {
// //     const locale = useLocale();
// //     const t = useTranslations('PendingPaymentCard')

// //     return (
// //         <Card className="border-primary border-2 bg-primary/5 mb-4">
// //             <CardHeader>
// //                 <div className="flex justify-between items-start">
// //                     <div>
// //                         <CardTitle className="text-lg">{trip ? `${getCityName(trip.origin, locale)} - ${getCityName(trip.destination, locale)}` : t('loading')}</CardTitle>
// //                         <CardDescription>{t('withCarrier')}: {trip?.carrierName || '...'}</CardDescription>
// //                     </div>
// //                     <Badge variant="outline" className="flex items-center gap-2 bg-yellow-100 text-yellow-800 border-yellow-300">
// //                         <Hourglass className="h-4 w-4 animate-spin" />
// //                         {t('waitingAccpt')}
// //                     </Badge>
// //                 </div>
// //             </CardHeader>
// //             <CardContent>
// //                 <div className="text-sm space-y-1">
// //                     <p><strong>{t('seatsNum')}:</strong> {booking.seats}</p>
// //                     <p><strong>{t('totalPrice')}:</strong> {booking.totalPrice.toFixed(2)} {booking.currency}</p>
// //                 </div>
// //             </CardContent>
// //         </Card>
// //     );
// // };

// // export const AwaitingOffersCard = ({
// //     trip,
// //     offerCount,
// //     matchingTripCount,
// //     offers,
// //     onClick,
// //     onWithdraw
// // }: {
// //     trip: Trip,
// //     offerCount: number,
// //     matchingTripCount?: number,
// //     offers?: Offer[],
// //     onClick: () => void,
// //     onWithdraw?: () => void
// // }) => {
// //     const router = useRouter();
// //     const locale = useLocale();
// //     const t = useTranslations('statusCards');

// //     const findCountryByCity = (cityKey: string) => {
// //         return Object.keys(CITIES).find(countryKey => (CITIES as any)[countryKey].cities.includes(cityKey));
// //     };

// //     const handleRadarRedirect = (e: React.MouseEvent) => {
// //         e.stopPropagation();
// //         triggerHaptic('light');
// //         const oc = findCountryByCity(trip.origin);
// //         const dc = findCountryByCity(trip.destination);
// //         const date = trip.departureDate.split('T')[0];

// //         router.push(`/dashboard?o=${trip.origin}&d=${trip.destination}&oc=${oc || ''}&dc=${dc || ''}&dt=${date}&s=${trip.passengers || 1}`);
// //     };

// //     const isStagnant = useMemo(() => {
// //         if (!trip.createdAt || offerCount > 0) return false;
// //         const createdTime = trip.createdAt.seconds ? trip.createdAt.seconds * 1000 : new Date(trip.createdAt).getTime();
// //         // [SC-912] Calibrated to Sovereign 35-minute threshold
// //         const stagnantThreshold = Date.now() - (35 * 60 * 1000);
// //         return createdTime < stagnantThreshold;
// //     }, [trip.createdAt, offerCount]);

// //     return (
// //         <Card className="border-primary border-2 bg-primary/5 transition-colors mb-4 overflow-hidden shadow-md">
// //             {matchingTripCount && matchingTripCount > 0 && (
// //                 <div
// //                     onClick={handleRadarRedirect}
// //                     className={cn(
// //                         "bg-green-600 p-2 text-center text-xs font-bold text-white border-b border-green-700 cursor-pointer hover:bg-green-700 transition-all flex items-center justify-center gap-2",
// //                         "animate-pulse"
// //                     )}
// //                 >
// //                     <Search className="h-3 w-3" />
// //                     🚀 لا داعي للانتظار! وجدنا {matchingTripCount} رحلة مجدولة تطابق طلبك تماماً. احجز الآن.
// //                 </div>
// //             )}

// //             <div className="cursor-pointer hover:bg-primary/10 transition-colors" onClick={() => { triggerHaptic('light'); onClick(); }}>
// //                 <CardHeader>
// //                     <div className="flex justify-between items-start">
// //                         <div>
// //                             <CardTitle className="text-lg">{getCityName(trip.origin, locale)} - {getCityName(trip.destination, locale)}</CardTitle>
// //                             <CardDescription>{t('awaitingOffers.publishedInMarket')}</CardDescription>
// //                         </div>
// //                         <Badge variant="outline" className="flex items-center gap-2 bg-blue-100 text-blue-800 border-blue-300">
// //                             <Radar className="h-4 w-4 animate-pulse" />
// //                             {t('awaitingOffers.badge')}
// //                         </Badge>
// //                     </div>
// //                 </CardHeader>
// //                 <CardContent className="pb-4">
// //                     {(!offers || offers.length === 0) ? (
// //                         <div className="text-center">
// //                             <div className="inline-flex flex-col items-center justify-center p-4 bg-background/50 rounded-full border border-primary/10 shadow-inner">
// //                                 <span className="text-4xl font-black text-primary leading-none">0</span>
// //                                 <span className="text-[0.5rem] text-muted-foreground font-bold uppercase tracking-widest mt-1 ">{t('awaitingOffers.offReceived')}</span>
// //                             </div>
// //                             <p className="text-xs text-muted-foreground mt-3">{t('awaitingOffers.havenotReq')}</p>
// //                         </div>
// //                     ) : (
// //                         <div className="space-y-2">
// //                             <div className="flex items-center justify-between mb-3">
// //                                 <span className="text-sm font-bold text-primary">{offerCount} عروض مستلمة</span>
// //                                 <span className="text-xs text-muted-foreground">اضغط للمقارنة والقبول</span>
// //                             </div>
// //                             {offers.slice(0, 3).map((offer, idx) => (
// //                                 <div key={offer.id} className="flex items-center justify-between p-3 bg-background/60 rounded-lg border border-primary/10 hover:border-primary/30 transition-colors">
// //                                     <div className="flex items-center gap-3">
// //                                         <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-black text-primary">
// //                                             {idx + 1}
// //                                         </div>
// //                                         <div>
// //                                             <p className="text-xs text-muted-foreground">{offer.vehicleType || 'مركبة خاصة'}</p>
// //                                             {offer.estimatedDurationHours && (
// //                                                 <p className="text-[10px] text-muted-foreground/70">{offer.estimatedDurationHours} ساعة</p>
// //                                             )}
// //                                         </div>
// //                                     </div>
// //                                     <div className="text-right">
// //                                         <p className="text-base font-black text-primary">{offer.price} <span className="text-xs font-normal">{offer.currency || 'د.أ'}</span></p>
// //                                         {offer.depositPercentage !== undefined && offer.depositPercentage > 0 && (
// //                                             <p className="text-[10px] text-muted-foreground">عربون {offer.depositPercentage}%</p>
// //                                         )}
// //                                     </div>
// //                                 </div>
// //                             ))}
// //                             {offerCount > 3 && (
// //                                 <p className="text-center text-xs text-muted-foreground pt-1">+ {offerCount - 3} عروض أخرى</p>
// //                             )}
// //                         </div>
// //                     )}
// //                 </CardContent>
// //             </div>

// //             {isStagnant && (
// //                 <div className="p-4 border-t border-primary/10">
// //                     <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
// //                         <div className="flex items-start gap-3">
// //                             <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
// //                             <div className="flex-1">
// //                                 <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-200">{t('stagnation.title')}</h4>
// //                                 <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
// //                                     {t('stagnation.description')}
// //                                 </p>
// //                                 <div className="flex gap-2 mt-3">
// //                                     <Button
// //                                         variant="outline"
// //                                         size="sm"
// //                                         className="h-8 text-xs bg-white dark:bg-black border-amber-300 hover:bg-amber-100 text-amber-900"
// //                                         onClick={handleRadarRedirect}
// //                                     >
// //                                         <RefreshCcw className="h-3 w-3 mr-1" />
// //                                         {t('stagnation.searchScheduled')}
// //                                     </Button>
// //                                 </div>
// //                             </div>
// //                         </div>
// //                     </div>
// //                 </div>
// //             )}

// //             {onWithdraw && (
// //                 <CardFooter className="p-0 border-t bg-muted/20">
// //                     <Button
// //                         variant="ghost"
// //                         className="w-full h-10 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-t-none transition-colors gap-2"
// //                         onClick={(e) => {
// //                             e.stopPropagation();
// //                             triggerHaptic('heavy');
// //                             onWithdraw();
// //                         }}
// //                     >
// //                         <XCircle className="h-3.5 w-3.5" />
// //                         {t('awaitingOffers.withdraw')}
// //                     </Button>
// //                 </CardFooter>
// //             )}
// //         </Card>
// //     );
// // };



// 'use client';

// import { useMemo } from 'react';
// import { useRouter } from '@/i18n/routing';
// import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { CreditCard, Hourglass, Radar, AlertTriangle, RefreshCcw, XCircle, Search } from 'lucide-react';
// import type { Trip, Booking, Offer } from '@/lib/data';
// import { getCityName, SOVEREIGN_GEO_REGISTRY as CITIES } from '@/lib/constants';
// import { Button } from '@/components/ui/button';
// import { useLocale, useTranslations } from 'next-intl';
// import { cn } from '@/lib/utils';
// import { triggerHaptic } from '@/lib/utils';

// export const PendingPaymentCard = ({ booking, trip, onClick }: { booking: Booking, trip?: Trip | null, onClick: () => void }) => {
//     const locale = useLocale();
//     const t = useTranslations('PendingPaymentCard')
//     return (
//         <Card className="border-orange-500 border-2 bg-orange-500/5 cursor-pointer hover:bg-orange-500/10 mb-4" onClick={() => { triggerHaptic('light'); onClick(); }}>
//             <CardHeader>
//                 <div className="flex justify-between items-start">
//                     <div>
//                         <CardTitle className="text-lg">{trip ? `${getCityName(trip.origin, locale)} - ${getCityName(trip.destination, locale)}` : t('loading')}</CardTitle>
//                         <CardDescription>{t('withCarrier')}: {trip?.carrierName || '...'}</CardDescription>
//                     </div>
//                     <Badge variant="outline" className="flex items-center gap-2 bg-orange-100 text-orange-800 border-orange-300">
//                         <CreditCard className="h-4 w-4 animate-pulse" />
//                         {t('waitingDeposit')}
//                     </Badge>
//                 </div>
//             </CardHeader>
//             <CardContent>
//                 <p className="font-bold text-center text-orange-600">
//                     {t('accptCarrier')}
//                 </p>
//             </CardContent>
//         </Card>
//     );
// };

// export const PendingConfirmationCard = ({ booking, trip }: { booking: Booking, trip?: Trip | null }) => {
//     const locale = useLocale();
//     const t = useTranslations('PendingPaymentCard')

//     return (
//         <Card className="border-primary border-2 bg-primary/5 mb-4">
//             <CardHeader>
//                 <div className="flex justify-between items-start">
//                     <div>
//                         <CardTitle className="text-lg">{trip ? `${getCityName(trip.origin, locale)} - ${getCityName(trip.destination, locale)}` : t('loading')}</CardTitle>
//                         <CardDescription>{t('withCarrier')}: {trip?.carrierName || '...'}</CardDescription>
//                     </div>
//                     <Badge variant="outline" className="flex items-center gap-2 bg-yellow-100 text-yellow-800 border-yellow-300">
//                         <Hourglass className="h-4 w-4 animate-spin" />
//                         {t('waitingAccpt')}
//                     </Badge>
//                 </div>
//             </CardHeader>
//             <CardContent>
//                 <div className="text-sm space-y-1">
//                     <p><strong>{t('seatsNum')}:</strong> {booking.seats}</p>
//                     <p><strong>{t('totalPrice')}:</strong> {booking.totalPrice.toFixed(2)} {booking.currency}</p>
//                 </div>
//             </CardContent>
//         </Card>
//     );
// };

// export const AwaitingOffersCard = ({
//     trip,
//     offerCount,
//     matchingTripCount,
//     offers,
//     onClick,
//     onWithdraw
// }: {
//     trip: Trip,
//     offerCount: number,
//     matchingTripCount?: number,
//     offers?: Offer[],
//     onClick: () => void,
//     onWithdraw?: () => void
// }) => {
//     const router = useRouter();
//     const locale = useLocale();
//     const t = useTranslations('statusCards');

//     const findCountryByCity = (cityKey: string) => {
//         return Object.keys(CITIES).find(countryKey => (CITIES as any)[countryKey].cities.includes(cityKey));
//     };

//     const handleRadarRedirect = (e: React.MouseEvent) => {
//         e.stopPropagation();
//         triggerHaptic('light');
//         const oc = findCountryByCity(trip.origin);
//         const dc = findCountryByCity(trip.destination);
//         const date = trip.departureDate.split('T')[0];

//         router.push(`/dashboard?o=${trip.origin}&d=${trip.destination}&oc=${oc || ''}&dc=${dc || ''}&dt=${date}&s=${(Array.isArray(trip.passengers) ? trip.passengers.length : trip.passengers) || 1}`);
//     };

//     const isStagnant = useMemo(() => {
//         if (!trip.createdAt || offerCount > 0) return false;
//         const createdTime = trip.createdAt.seconds ? trip.createdAt.seconds * 1000 : new Date(trip.createdAt).getTime();
//         // [SC-912] Calibrated to Sovereign 35-minute threshold
//         const stagnantThreshold = Date.now() - (35 * 60 * 1000);
//         return createdTime < stagnantThreshold;
//     }, [trip.createdAt, offerCount]);

//     return (
//         <Card className="border-primary border-2 bg-primary/5 transition-colors mb-4 overflow-hidden shadow-md">
//             {matchingTripCount && matchingTripCount > 0 && (
//                 <div
//                     onClick={handleRadarRedirect}
//                     className={cn(
//                         "bg-green-600 p-2 text-center text-xs font-bold text-white border-b border-green-700 cursor-pointer hover:bg-green-700 transition-all flex items-center justify-center gap-2",
//                         "animate-pulse"
//                     )}
//                 >
//                     <Search className="h-3 w-3" />
//                     🚀 لا داعي للانتظار! وجدنا {matchingTripCount} رحلة مجدولة تطابق طلبك تماماً. احجز الآن.
//                 </div>
//             )}

//             <div className="cursor-pointer hover:bg-primary/10 transition-colors" onClick={() => { triggerHaptic('light'); onClick(); }}>
//                 <CardHeader>
//                     <div className="flex justify-between items-start">
//                         <div>
//                             <CardTitle className="text-lg">{getCityName(trip.origin, locale)} - {getCityName(trip.destination, locale)}</CardTitle>
//                             <CardDescription>{t('awaitingOffers.publishedInMarket')}</CardDescription>
//                         </div>
//                         <Badge variant="outline" className="flex items-center gap-2 bg-blue-100 text-blue-800 border-blue-300">
//                             <Radar className="h-4 w-4 animate-pulse" />
//                             {t('awaitingOffers.badge')}
//                         </Badge>
//                     </div>
//                 </CardHeader>
//                 <CardContent className="pb-4">
//                     {(!offers || offers.length === 0) ? (
//                         <div className="text-center">
//                             <div className="inline-flex flex-col items-center justify-center p-4 bg-background/50 rounded-full border border-primary/10 shadow-inner">
//                                 <span className="text-4xl font-black text-primary leading-none">0</span>
//                                 <span className="text-[0.5rem] text-muted-foreground font-bold uppercase tracking-widest mt-1 ">{t('awaitingOffers.offReceived')}</span>
//                             </div>
//                             <p className="text-xs text-muted-foreground mt-3">{t('awaitingOffers.havenotReq')}</p>
//                         </div>
//                     ) : (
//                         <div className="space-y-2">
//                             <div className="flex items-center justify-between mb-3">
//                                 <span className="text-sm font-bold text-primary">{offerCount} عروض مستلمة</span>
//                                 <span className="text-xs text-muted-foreground">اضغط للمقارنة والقبول</span>
//                             </div>
//                             {offers.slice(0, 3).map((offer, idx) => (
//                                 <div key={offer.id} className="flex items-center justify-between p-3 bg-background/60 rounded-lg border border-primary/10 hover:border-primary/30 transition-colors">
//                                     <div className="flex items-center gap-3">
//                                         <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-black text-primary">
//                                             {idx + 1}
//                                         </div>
//                                         <div>
//                                             <p className="text-xs text-muted-foreground">{offer.vehicleType || 'مركبة خاصة'}</p>
//                                             {offer.estimatedDurationHours && (
//                                                 <p className="text-[10px] text-muted-foreground/70">{offer.estimatedDurationHours} ساعة</p>
//                                             )}
//                                         </div>
//                                     </div>
//                                     <div className="text-right">
//                                         <p className="text-base font-black text-primary">{offer.price} <span className="text-xs font-normal">{offer.currency || 'د.أ'}</span></p>
//                                         {offer.depositPercentage !== undefined && offer.depositPercentage > 0 && (
//                                             <p className="text-[10px] text-muted-foreground">عربون {offer.depositPercentage}%</p>
//                                         )}
//                                     </div>
//                                 </div>
//                             ))}
//                             {offerCount > 3 && (
//                                 <p className="text-center text-xs text-muted-foreground pt-1">+ {offerCount - 3} عروض أخرى</p>
//                             )}
//                         </div>
//                     )}
//                 </CardContent>
//             </div>

//             {isStagnant && (
//                 <div className="p-4 border-t border-primary/10">
//                     <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
//                         <div className="flex items-start gap-3">
//                             <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
//                             <div className="flex-1">
//                                 <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-200">{t('stagnation.title')}</h4>
//                                 <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
//                                     {t('stagnation.description')}
//                                 </p>
//                                 <div className="flex gap-2 mt-3">
//                                     <Button
//                                         variant="outline"
//                                         size="sm"
//                                         className="h-8 text-xs bg-white dark:bg-black border-amber-300 hover:bg-amber-100 text-amber-900"
//                                         onClick={handleRadarRedirect}
//                                     >
//                                         <RefreshCcw className="h-3 w-3 mr-1" />
//                                         {t('stagnation.searchScheduled')}
//                                     </Button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {onWithdraw && (
//                 <CardFooter className="p-0 border-t bg-muted/20">
//                     <Button
//                         variant="ghost"
//                         className="w-full h-10 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-t-none transition-colors gap-2"
//                         onClick={(e) => {
//                             e.stopPropagation();
//                             triggerHaptic('heavy');
//                             onWithdraw();
//                         }}
//                     >
//                         <XCircle className="h-3.5 w-3.5" />
//                         {t('awaitingOffers.withdraw')}
//                     </Button>
//                 </CardFooter>
//             )}
//         </Card>
//     );
// };

'use client';

import { useMemo } from 'react';
import { useRouter } from '@/i18n/routing';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Hourglass, Radar, AlertTriangle, RefreshCcw, XCircle, Search } from 'lucide-react';
import type { Trip, Booking, Offer } from '@/lib/data';
import { getCityName, SOVEREIGN_GEO_REGISTRY as CITIES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { useLocale, useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { triggerHaptic } from '@/lib/utils';

/**
 * كارد جديد: المسافر وافق على العرض وفي انتظار الناقل أن يُنشئ الرحلة
 */
export const TravelerAcceptedAwaitingCarrierCard = ({ booking, trip }: { booking: Booking, trip?: Trip | null }) => {
    const locale = useLocale();
    const bookingAny = booking as any;
    const origin = trip?.origin || bookingAny.requestOrigin || '';
    const destination = trip?.destination || bookingAny.requestDestination || '';
    const carrierName = trip?.carrierName || bookingAny.carrierName || '';
    return (
        <Card className="border-emerald-500 border-2 bg-emerald-500/5 mb-4 overflow-hidden">
            {/* شريط علوي متحرك */}
            <div className="h-1 w-full bg-gradient-to-r from-emerald-400 via-primary to-emerald-400 animate-pulse" />
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg">
                            {origin && destination
                                ? `${getCityName(origin, locale)} - ${getCityName(destination, locale)}`
                                : 'جاري التحميل...'}
                        </CardTitle>
                        <CardDescription>
                            الناقل: {carrierName || booking.carrierId?.slice(-5) || '...'}
                        </CardDescription>
                    </div>
                    <Badge variant="outline" className="flex items-center gap-2 bg-emerald-100 text-emerald-800 border-emerald-300 shrink-0">
                        <Hourglass className="h-4 w-4 animate-spin" />
                        في انتظار الناقل
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                    <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                        <Hourglass className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-emerald-800 dark:text-emerald-200">
                            وافقت على العرض ✅
                        </p>
                        <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
                            الناقل سيُنشئ الرحلة ويؤكد حجزك — ستصلك إشعار بمجرد الموافقة لتدفع العربون
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-muted/30 rounded-lg p-2 text-center">
                        <p className="text-xs text-muted-foreground">المقاعد</p>
                        <p className="font-black text-foreground">{booking.seats}</p>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-2 text-center">
                        <p className="text-xs text-muted-foreground">الإجمالي</p>
                        <p className="font-black text-foreground">{booking.totalPrice} {booking.currency}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export const PendingPaymentCard = ({ booking, trip, onClick }: { booking: Booking, trip?: Trip | null, onClick: () => void }) => {
    const locale = useLocale();
    const t = useTranslations('PendingPaymentCard')
    return (
        <Card className="border-orange-500 border-2 bg-orange-500/5 cursor-pointer hover:bg-orange-500/10 mb-4" onClick={() => { triggerHaptic('light'); onClick(); }}>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg">{trip ? `${getCityName(trip.origin, locale)} - ${getCityName(trip.destination, locale)}` : t('loading')}</CardTitle>
                        <CardDescription>{t('withCarrier')}: {trip?.carrierName || '...'}</CardDescription>
                    </div>
                    <Badge variant="outline" className="flex items-center gap-2 bg-orange-100 text-orange-800 border-orange-300">
                        <CreditCard className="h-4 w-4 animate-pulse" />
                        {t('waitingDeposit')}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <p className="font-bold text-center text-orange-600">
                    {t('accptCarrier')}
                </p>
            </CardContent>
        </Card>
    );
};

export const PendingConfirmationCard = ({ booking, trip }: { booking: Booking, trip?: Trip | null }) => {
    const locale = useLocale();
    const t = useTranslations('PendingPaymentCard')

    return (
        <Card className="border-primary border-2 bg-primary/5 mb-4">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg">{trip ? `${getCityName(trip.origin, locale)} - ${getCityName(trip.destination, locale)}` : t('loading')}</CardTitle>
                        <CardDescription>{t('withCarrier')}: {trip?.carrierName || '...'}</CardDescription>
                    </div>
                    <Badge variant="outline" className="flex items-center gap-2 bg-yellow-100 text-yellow-800 border-yellow-300">
                        <Hourglass className="h-4 w-4 animate-spin" />
                        {t('waitingAccpt')}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-sm space-y-1">
                    <p><strong>{t('seatsNum')}:</strong> {booking.seats}</p>
                    <p><strong>{t('totalPrice')}:</strong> {booking.totalPrice.toFixed(2)} {booking.currency}</p>
                </div>
            </CardContent>
        </Card>
    );
};

export const AwaitingOffersCard = ({
    trip,
    offerCount,
    matchingTripCount,
    offers,
    onClick,
    onWithdraw
}: {
    trip: Trip,
    offerCount: number,
    matchingTripCount?: number,
    offers?: Offer[],
    onClick: () => void,
    onWithdraw?: () => void
}) => {
    const router = useRouter();
    const locale = useLocale();
    const t = useTranslations('statusCards');

    const findCountryByCity = (cityKey: string) => {
        return Object.keys(CITIES).find(countryKey => (CITIES as any)[countryKey].cities.includes(cityKey));
    };

    const handleRadarRedirect = (e: React.MouseEvent) => {
        e.stopPropagation();
        triggerHaptic('light');
        const oc = findCountryByCity(trip.origin);
        const dc = findCountryByCity(trip.destination);
        const date = trip.departureDate.split('T')[0];

        router.push(`/dashboard?o=${trip.origin}&d=${trip.destination}&oc=${oc || ''}&dc=${dc || ''}&dt=${date}&s=${(Array.isArray(trip.passengers) ? trip.passengers.length : trip.passengers) || 1}`);
    };

    const isStagnant = useMemo(() => {
        if (!trip.createdAt || offerCount > 0) return false;
        const createdTime = trip.createdAt.seconds ? trip.createdAt.seconds * 1000 : new Date(trip.createdAt).getTime();
        // [SC-912] Calibrated to Sovereign 35-minute threshold
        const stagnantThreshold = Date.now() - (35 * 60 * 1000);
        return createdTime < stagnantThreshold;
    }, [trip.createdAt, offerCount]);

    return (
        <Card className="border-primary border-2 bg-primary/5 transition-colors mb-4 overflow-hidden shadow-md">
            {matchingTripCount && matchingTripCount > 0 && (
                <div
                    onClick={handleRadarRedirect}
                    className={cn(
                        "bg-green-600 p-2 text-center text-xs font-bold text-white border-b border-green-700 cursor-pointer hover:bg-green-700 transition-all flex items-center justify-center gap-2",
                        "animate-pulse"
                    )}
                >
                    <Search className="h-3 w-3" />
                    🚀 لا داعي للانتظار! وجدنا {matchingTripCount} رحلة مجدولة تطابق طلبك تماماً. احجز الآن.
                </div>
            )}

            <div className="cursor-pointer hover:bg-primary/10 transition-colors" onClick={() => { triggerHaptic('light'); onClick(); }}>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-lg">{getCityName(trip.origin, locale)} - {getCityName(trip.destination, locale)}</CardTitle>
                            <CardDescription>{t('awaitingOffers.publishedInMarket')}</CardDescription>
                        </div>
                        <Badge variant="outline" className="flex items-center gap-2 bg-blue-100 text-blue-800 border-blue-300">
                            <Radar className="h-4 w-4 animate-pulse" />
                            {t('awaitingOffers.badge')}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="pb-4">
                    {(!offers || offers.length === 0) ? (
                        <div className="text-center">
                            <div className="inline-flex flex-col items-center justify-center p-4 bg-background/50 rounded-full border border-[#B09E6E]-2 shadow-inner">
                                <span className="text-4xl font-black text-primary leading-none">0</span>
                                <span className="text-[0.5rem] text-muted-foreground font-bold uppercase tracking-widest mt-1 ">{t('awaitingOffers.offReceived')}</span>
                            </div>
                            <p className="text-xs text-white mt-3">{t('awaitingOffers.havenotReq')}</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-bold text-primary">{offerCount} عروض مستلمة</span>
                                <span className="text-xs text-muted-foreground">اضغط للمقارنة والقبول</span>
                            </div>
                            {offers.slice(0, 3).map((offer, idx) => (
                                <div key={offer.id} className="flex items-center justify-between p-3 bg-background/60 rounded-lg border border-primary/10 hover:border-primary/30 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-black text-primary">
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">{offer.vehicleType || 'مركبة خاصة'}</p>
                                            {offer.estimatedDurationHours && (
                                                <p className="text-[10px] text-muted-foreground/70">{offer.estimatedDurationHours} ساعة</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-base font-black text-primary">{offer.price} <span className="text-xs font-normal">{offer.currency || 'د.أ'}</span></p>
                                        {offer.depositPercentage !== undefined && offer.depositPercentage > 0 && (
                                            <p className="text-[10px] text-muted-foreground">عربون {offer.depositPercentage}%</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {offerCount > 3 && (
                                <p className="text-center text-xs text-muted-foreground pt-1">+ {offerCount - 3} عروض أخرى</p>
                            )}
                        </div>
                    )}
                </CardContent>
            </div>
            {isStagnant && (
                // استخدام locale لتحديد الاتجاه بشكل قاطع
                <div className="p-4 border-t border-primary/10" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                            <div className="flex-1 text-start">
                                <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                                    {t('stagnation.title')}
                                </h4>

                                {/* استخدام قائمة مرتبة لمنع مشاكل Bidi في المتصفح */}
                                <ol className="list-decimal ps-4 mt-2 space-y-1 text-xs text-amber-700 dark:text-amber-300">
                                    <li>{t('stagnation.description')}</li>
                                    <li>{t('stagnation.description2')}</li>
                                    <li>{t('stagnation.description3')}</li>
                                </ol>

                                {/* <div className="flex gap-2 mt-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 text-xs bg-white dark:bg-black border-amber-300 hover:bg-amber-100 text-amber-900"
                                        onClick={handleRadarRedirect}
                                    >
                                        <RefreshCcw className="h-3 w-3 rtl:ml-1 ltr:mr-1" />
                                        {t('stagnation.searchScheduled')}
                                    </Button>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {onWithdraw && (
                <CardFooter className="p-0 border-t bg-muted/20">
                    <Button
                        variant="ghost"
                        className="w-full h-10 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-t-none transition-colors gap-2"
                        onClick={(e) => {
                            e.stopPropagation();
                            triggerHaptic('heavy');
                            onWithdraw();
                        }}
                    >
                        <XCircle className="h-3.5 w-3.5" />
                        {t('awaitingOffers.withdraw')}
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
};