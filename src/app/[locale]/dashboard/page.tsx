// // // 'use client';

// // // import { useState, useMemo, useEffect, useCallback } from 'react';
// // // import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
// // // import { collection, query, where, limit } from 'firebase/firestore';
// // // import { useRouter } from '@/i18n/routing';
// // // import { useTranslations, useLocale } from 'next-intl';
// // // import { Filter, Calendar as CalendarIcon, Send, ChevronsUpDown, Check, PlaneTakeoff, PlaneLanding, ShieldAlert, ShipWheel, ChevronDown, ChevronUp, User, Car, User2 } from 'lucide-react';
// // // import { ScheduledTripCard } from '@/components/scheduled-trip-card';
// // // import { Button } from '@/components/ui/button';
// // // import { Skeleton } from '@/components/ui/skeleton';
// // // import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
// // // import { RequestDialog } from '@/components/requests/request-dialog';
// // // import { AuthRedirectDialog } from '@/components/auth-redirect-dialog';
// // // import { getCityName, COUNTRY_CODE_MAP } from '@/lib/constants';
// // // import type { Trip } from '@/lib/data';
// // // import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// // // import { Calendar as CalendarPicker } from "@/components/ui/calendar"
// // // import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
// // // import { cn } from '@/lib/utils';
// // // import { parseISO, isValid, format } from 'date-fns';
// // // import { arSA, enUS } from 'date-fns/locale';
// // // import { Label } from '@/components/ui/label';
// // // import { AppLayout } from '@/components/app-layout';
// // // import { useSearchParams } from 'next/navigation';
// // // import { useUserProfile } from '@/hooks/use-user-profile';
// // // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// // // import { LocalErrorBoundary } from '@/components/ui/local-error-boundary';
// // // import { useCountryPricing } from '@/hooks/use-country-pricing';
// // // import { useActiveMarkets } from '@/hooks/use-active-markets';
// // // import { Input } from '@/components/ui/input';

// // // /**
// // //  * @page DashboardPage
// // //  * @description THE STERILIZED SEARCH CENTER (V10.0 - PROTOCOL 16)
// // //  * [SCR-955]: Final Sterilization. Purged redundant state and enforced clean dependency arrays.
// // //  * Protocol 88: Maximum resource protection via stable useMemo filters.
// // //  */
// // // export default function DashboardPage() {
// // //   const { user, isUserLoading } = useUser();
// // //   const { profile, isEngaged, isLoading: isProfileLoading } = useUserProfile();
// // //   const firestore = useFirestore();
// // //   const router = useRouter();
// // //   const searchParams = useSearchParams();
// // //   const t = useTranslations('dashboard');
// // //   const locale = useLocale();

// // //   const [visibleCount, setVisibleCount] = useState(10);
// // //   const [searchCarrierName, setSearchCarrierName] = useState('');
// // //   const [sessionNowISO, setSessionNowISO] = useState<string | null>(null);
// // //   const { activeMarkets, isLoading: isLoadingMarkets } = useActiveMarkets();

// // //   useEffect(() => {
// // //     setSessionNowISO(new Date().toISOString());
// // //   }, []);

// // //   const countryCode = useMemo(() => {
// // //     if (!profile?.operatingCountry) return 'JO';
// // //     return COUNTRY_CODE_MAP[profile.operatingCountry] || 'JO';
// // //   }, [profile?.operatingCountry]);

// // //   const { rule: marketRule, loading: marketLoading } = useCountryPricing(countryCode);

// // //   // بعد ما المسافر يحجز → يتبعت للـ history ومش يرجع للـ dashboard
// // //   // الا لما الرحله تنتهي او يلغي (isEngaged بيبقى false تلقائاً لما status = Completed/Cancelled)
// // //   useEffect(() => {
// // //     if (!isProfileLoading && isEngaged) {
// // //       router.replace('/history');
// // //     }
// // //   }, [isEngaged, isProfileLoading, router]);

// // //   const [searchOriginCountry, setSearchOriginCountry] = useState(searchParams.get('oc') || '');
// // //   const [searchOriginCity, setSearchOriginCity] = useState(searchParams.get('o') || '');
// // //   const [accordionValue, setAccordionValue] = useState<string | undefined>(undefined);
// // //   const [searchDestinationCountry, setSearchDestinationCountry] = useState(searchParams.get('dc') || '');
// // //   const [searchDestinationCity, setSearchDestinationCity] = useState(searchParams.get('d') || '');

// // //   const [searchDate, setSearchDate] = useState<Date | undefined>(() => {
// // //     const dt = searchParams.get('dt');
// // //     if (!dt) return undefined;
// // //     const parsed = parseISO(dt);
// // //     return isValid(parsed) ? parsed : undefined;
// // //   });

// // //   const [searchSeats, setSearchSeats] = useState(parseInt(searchParams.get('s') || '1'));
// // //   // const [nationality, setNationality] = useState('اردني')
// // //   const [searchVehicleType, setSearchVehicleType] = useState<'any' | 'small' | 'bus'>(
// // //     (searchParams.get('v') as any) || 'any'
// // //   );

// // //   // ARTERIAL PERSISTENCE: Sync filters to URL without full page reloads
// // //   useEffect(() => {
// // //     const params = new URLSearchParams(searchParams.toString());
// // //     if (searchOriginCountry) params.set('oc', searchOriginCountry); else params.delete('oc');
// // //     if (searchOriginCity) params.set('o', searchOriginCity); else params.delete('o');
// // //     if (searchDestinationCountry) params.set('dc', searchDestinationCountry); else params.delete('dc');
// // //     if (searchDestinationCity) params.set('d', searchDestinationCity); else params.delete('d');
// // //     if (searchDate) params.set('dt', searchDate.toISOString().split('T')[0]); else params.delete('dt');
// // //     if (searchSeats > 1) params.set('s', searchSeats.toString()); else params.delete('s');
// // //     if (searchVehicleType !== 'any') params.set('v', searchVehicleType); else params.delete('v');

// // //     const queryString = params.toString();
// // //     const currentPath = window.location.pathname;
// // //     const newUrl = queryString ? `${currentPath}?${queryString}` : currentPath;

// // //     if (typeof window !== 'undefined' && window.location.search !== `?${queryString}`) {
// // //       window.history.replaceState({ ...window.history.state }, '', newUrl);
// // //     }
// // //   }, [searchOriginCountry, searchOriginCity, searchDestinationCountry, searchDestinationCity, searchDate, searchSeats, searchVehicleType, searchParams]);

// // //   const [openOrigin, setOpenOrigin] = useState(false);
// // //   const [openDest, setOpenDest] = useState(false);
// // //   const [isRequestOpen, setIsRequestOpen] = useState(false);
// // //   const [isAuthRedirectOpen, setIsAuthRedirectOpen] = useState(false);

// // //   const handleOriginSelect = useCallback((mId: string) => {
// // //     setSearchOriginCountry(mId);
// // //     setSearchOriginCity("");
// // //     setOpenOrigin(false);
// // //   }, []);

// // //   const handleDestSelect = useCallback((mId: string) => {
// // //     setSearchDestinationCountry(mId);
// // //     setSearchDestinationCity("");
// // //     setOpenDest(false);
// // //   }, []);

// // //   const tripsQuery = useMemoFirebase(() => {
// // //     if (!firestore || !sessionNowISO) return null;
// // //     return query(
// // //       collection(firestore, 'trips'),
// // //       where('status', 'in', ['Planned', 'Has_Offers', 'Negotiating']),
// // //       where('departureDate', '>=', sessionNowISO),
// // //       limit(200),
// // //     );
// // //   }, [firestore, sessionNowISO]);

// // //   const { data: allTrips, isLoading: isLoadingTrips } = useCollection<Trip>(tripsQuery);

// // //   // ✅ query منفصل للناقلين عشان نجيب carrierId بالاسم
// // //   const carriersQuery = useMemoFirebase(() => {
// // //     if (!firestore || !searchCarrierName.trim()) return null;
// // //     return query(
// // //       collection(firestore, 'users'),
// // //       where('role', '==', 'carrier'),
// // //       where('firstName', '>=', searchCarrierName.trim()),
// // //       where('firstName', '<=', searchCarrierName.trim() + ''),
// // //       limit(5)
// // //     );
// // //   }, [firestore, searchCarrierName]);
// // //   const { data: matchedCarriers } = useCollection<any>(carriersQuery);

// // //   // ✅ جيب carrierId من الرحلات أو من الناقلين مباشرة
// // //   const resolvedCarrierId = useMemo(() => {
// // //     if (!searchCarrierName.trim()) return undefined;
// // //     // أولاً من الرحلات
// // //     const fromTrips = (allTrips || []).find(t =>
// // //       t.carrierName?.toLowerCase().includes(searchCarrierName.toLowerCase())
// // //     )?.carrierId;
// // //     if (fromTrips) return fromTrips;
// // //     // ثانياً من قائمة الناقلين مباشرة
// // //     return matchedCarriers?.[0]?.id;
// // //   }, [allTrips, matchedCarriers, searchCarrierName]);

// // //   // PROTOCOL 88: Centralized O(n) Filter Reactor
// // //   const sortedTrips = useMemo(() => {
// // //     if (!allTrips) return [];
// // //     let filtered = allTrips.filter(t => (t.availableSeats || 0) > 0);

// // //     if (searchDate) {
// // //       const start = new Date(searchDate); start.setHours(0, 0, 0, 0);
// // //       const end = new Date(searchDate); end.setHours(23, 59, 59, 999);
// // //       filtered = filtered.filter(t => {
// // //         const d = new Date(t.departureDate);
// // //         return d >= start && d <= end;
// // //       });
// // //     }

// // //     if (searchCarrierName.trim()) {
// // //       const q = searchCarrierName.toLowerCase();
// // //       filtered = filtered.filter(t => t.carrierName?.toLowerCase().includes(q));
// // //     }

// // //     if (searchOriginCity) filtered = filtered.filter(t => t.origin === searchOriginCity);
// // //     if (searchDestinationCity) filtered = filtered.filter(t => t.destination === searchDestinationCity);
// // //     if (searchSeats > 1) filtered = filtered.filter(t => (t.availableSeats || 0) >= searchSeats);
// // //     if (searchVehicleType !== 'any') filtered = filtered.filter(t => t.vehicleCategory === searchVehicleType);

// // //     return filtered.sort((a, b) => new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime());
// // //   }, [allTrips, searchDate, searchOriginCity, searchDestinationCity, searchSeats, searchVehicleType, searchCarrierName]);

// // //   const isInitialLoading = isUserLoading || isProfileLoading || !sessionNowISO || marketLoading || isLoadingMarkets;

// // //   if (isInitialLoading) {
// // //     return (
// // //       <div className="flex h-screen items-center justify-center bg-background">
// // //         <div className="text-center space-y-4">
// // //           <Skeleton className="h-12 w-12 rounded-full mx-auto" />
// // //           <p className="text-muted-foreground animate-pulse">{t('securingPath')}</p>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   if (marketRule && !marketRule.isActive) {
// // //     return (
// // //       <AppLayout profile={profile} user={user}>
// // //         <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-8 space-y-6 animate-in fade-in zoom-in duration-700 bg-card rounded-2xl border border-destructive/20">
// // //           <div className="p-6 bg-destructive/10 rounded-full border border-destructive/20">
// // //             <ShieldAlert className="h-24 w-24 text-destructive animate-pulse" />
// // //           </div>
// // //           <h2 className="text-3xl font-black text-foreground mb-3">القطاع مغلق مؤقتاً</h2>
// // //           <p className="text-muted-foreground font-bold max-w-md mx-auto leading-relaxed">
// // //             هذا القطاع الجغرافي ({marketRule.countryName}) يخضع للصيانة السيادية حالياً. سنعود قريباً.
// // //           </p>
// // //           <Button variant="outline" onClick={() => router.push('/')}>العودة للرئيسية</Button>
// // //         </div>
// // //       </AppLayout>
// // //     );
// // //   }

// // //   return (
// // //     <AppLayout profile={profile} user={user}>
// // //       <div className="space-y-4 pt-16">
// // //         <Accordion type="single" collapsible value={accordionValue} onValueChange={setAccordionValue} className="w-full bg-card rounded-lg border shadow-sm overflow-hidden" defaultValue={!sortedTrips.length ? 'search-filter' : undefined}>
// // //           <AccordionItem value="search-filter" className="border-none">
// // //             <AccordionTrigger className="p-4 hover:no-underline font-semibold text-sm bg-blue-600 text-white">
// // //               <div className="flex items-center gap-2"><Filter className="w-4 h-4" /><span>{t('searchFilter')}</span></div>
// // //             </AccordionTrigger>
// // //             <AccordionContent className="p-4 pt-0 border-t bg-card">
// // //               <div className="grid grid-cols-1 gap-4 pt-4">
// // //                 {/* من دوله ومدينه */}
// // //                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // //                   <div className="space-y-2">
// // //                     <Label className="text-muted-foreground flex items-center gap-2"><PlaneTakeoff className="h-4 w-4 text-primary" /> {t('fromCountry')}</Label>
// // //                     <Popover open={openOrigin} onOpenChange={setOpenOrigin}>
// // //                       <PopoverTrigger asChild>
// // //                         <Button variant="outline" className="w-full justify-between h-12 bg-card/50 border-muted">
// // //                           {searchOriginCountry ? (activeMarkets.find(m => m.id === searchOriginCountry)?.name || searchOriginCountry) : t('selectOriginCountry')}
// // //                           <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
// // //                         </Button>
// // //                       </PopoverTrigger>
// // //                       <PopoverContent className="w-[300px] p-0" align="start">
// // //                         <Command>
// // //                           <CommandInput placeholder={t('searchCountry')} />
// // //                           <CommandEmpty>{t('noCountryFound')}</CommandEmpty>
// // //                           <CommandGroup>
// // //                             <CommandList>
// // //                               {activeMarkets.map((market) => (
// // //                                 <CommandItem key={market.id} value={market.name} onSelect={() => handleOriginSelect(market.id)}>
// // //                                   <Check className={cn("mr-2 h-4 w-4", searchOriginCountry === market.id ? "opacity-100" : "opacity-0")} />
// // //                                   {market.name}
// // //                                 </CommandItem>
// // //                               ))}
// // //                             </CommandList>
// // //                           </CommandGroup>
// // //                         </Command>
// // //                       </PopoverContent>
// // //                     </Popover>
// // //                   </div>
// // //                   <div className="space-y-2">
// // //                     <Label className="opacity-0">.</Label>
// // //                     <Select onValueChange={setSearchOriginCity} value={searchOriginCity} disabled={!searchOriginCountry}>
// // //                       <SelectTrigger className="h-12 bg-card/50 border-muted"><SelectValue placeholder={t('fromCity')} /></SelectTrigger>
// // //                       <SelectContent>
// // //                         {searchOriginCountry && activeMarkets.find(m => m.id === searchOriginCountry)?.cities.map((c: string) => (
// // //                           <SelectItem key={c} value={c}>{getCityName(c, locale)}</SelectItem>
// // //                         ))}
// // //                       </SelectContent>
// // //                     </Select>
// // //                   </div>
// // //                 </div>
// // //                 {/* الي دوله و مدينه  */}
// // //                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // //                   <div className="space-y-2">
// // //                     <Label className="text-muted-foreground flex items-center gap-2"><PlaneLanding className="h-4 w-4 text-primary" /> {t('toCountry')}</Label>
// // //                     <Popover open={openDest} onOpenChange={setOpenDest}>
// // //                       <PopoverTrigger asChild>
// // //                         <Button variant="outline" disabled={!searchOriginCountry} className="w-full justify-between h-12 bg-card/50 border-muted">
// // //                           {searchDestinationCountry ? (activeMarkets.find(m => m.id === searchDestinationCountry)?.name || searchDestinationCountry) : t('selectDestCountry')}
// // //                           <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
// // //                         </Button>
// // //                       </PopoverTrigger>
// // //                       <PopoverContent className="w-[300px] p-0" align="start">
// // //                         <Command>
// // //                           <CommandInput placeholder={t('searchCountry')} />
// // //                           <CommandEmpty>{t('noDestAvailable')}</CommandEmpty>
// // //                           <CommandGroup>
// // //                             <CommandList>
// // //                               {activeMarkets.filter(m => m.id !== searchOriginCountry).map((market) => (
// // //                                 <CommandItem key={market.id} value={market.name} onSelect={() => handleDestSelect(market.id)}>
// // //                                   <Check className={cn("mr-2 h-4 w-4", searchDestinationCountry === market.id ? "opacity-100" : "opacity-0")} />
// // //                                   {market.name}
// // //                                 </CommandItem>
// // //                               ))}
// // //                             </CommandList>
// // //                           </CommandGroup>
// // //                         </Command>
// // //                       </PopoverContent>
// // //                     </Popover>
// // //                   </div>
// // //                   <div className="space-y-2">
// // //                     <Label className="opacity-0">.</Label>
// // //                     <Select onValueChange={setSearchDestinationCity} value={searchDestinationCity} disabled={!searchDestinationCountry}>
// // //                       <SelectTrigger className="h-12 bg-card/50 border-muted"><SelectValue placeholder={t('toCity')} /></SelectTrigger>
// // //                       <SelectContent>
// // //                         {searchDestinationCountry && activeMarkets.find(m => m.id === searchDestinationCountry)?.cities.map((c: string) => (
// // //                           <SelectItem key={c} value={c}>{getCityName(c, locale)}</SelectItem>
// // //                         ))}
// // //                       </SelectContent>
// // //                     </Select>
// // //                   </div>
// // //                 </div>
// // //                 {/* الجنسيه */}
// // //                 {/* <div className="space-y-2">
// // //                   <Label className="text-muted-foreground flex items-center gap-2"><User2 className="h-4 w-4 text-primary" /> {t('nationality')}</Label>
// // //                   <Input
// // //                     placeholder={t('nationality')}
// // //                     value={nationality}
// // //                     onChange={(e) => setNationality(e.target.value)}
// // //                     className="h-12 bg-card/50 border-muted" />

// // //                 </div> */}
// // //                 {/*  اسم الناقل ونوع المركبه*/}
// // //                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
// // //                   <div className="space-y-2">
// // //                     <Label className="text-muted-foreground flex items-center gap-2"><User className="h-4 w-4 text-primary" /> {t('carrierName')}</Label>
// // //                     <Input placeholder={t('writeCarrierName')} value={searchCarrierName} onChange={(e) => setSearchCarrierName(e.target.value)} className="h-12 bg-card/50 border-muted" />
// // //                   </div>
// // //                   <div className="space-y-2">
// // //                     <Label className="text-muted-foreground flex items-center gap-2"><Car className="h-4 w-4 text-primary" /> {t('vehicleType')}</Label>
// // //                     <div className="grid grid-cols-3 gap-2">
// // //                       {[{ v: 'any', l: t('all') }, { v: 'small', l: t('car') }, { v: 'bus', l: t('bus') }].map((o) => (
// // //                         <Button key={o.v} variant={searchVehicleType === o.v ? "default" : "outline"} size="sm" onClick={() => setSearchVehicleType(o.v as any)} className="h-12">{o.l}</Button>
// // //                       ))}
// // //                     </div>
// // //                   </div>
// // //                 </div>

// // //                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // //                   <Popover>
// // //                     <PopoverTrigger asChild>
// // //                       <Button variant="outline" className={cn("w-full justify-start h-12 bg-card/50", !searchDate && "text-muted-foreground")}>
// // //                         <CalendarIcon className="ml-2 h-4 w-4" />
// // //                         {searchDate ? format(searchDate, "PPP", { locale: locale === 'ar' ? arSA : enUS }) : t('travelDate')}
// // //                       </Button>
// // //                     </PopoverTrigger>
// // //                     <PopoverContent className="w-auto p-0" align="start">
// // //                       <CalendarPicker mode="single" selected={searchDate} onSelect={setSearchDate} locale={locale === 'ar' ? arSA : enUS} disabled={{ before: new Date() }} />
// // //                     </PopoverContent>
// // //                   </Popover>
// // //                   <Select onValueChange={(v) => setSearchSeats(parseInt(v))} value={String(searchSeats)}>
// // //                     <SelectTrigger className="h-12 bg-card/50"><SelectValue placeholder={t('seatCount')} /></SelectTrigger>
// // //                     <SelectContent>{[1, 2, 3, 4, 5, 6, 7, 8].map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}</SelectContent>
// // //                   </Select>
// // //                 </div>

// // //                 <div className="flex justify-end pt-2">
// // //                   <Button onClick={() => user ? setIsRequestOpen(true) : setIsAuthRedirectOpen(true)} className="gap-2 h-12 px-8 shadow-lg">
// // //                     <Send className="h-4 w-4" /> {t('createSpecialRequest')}
// // //                   </Button>
// // //                 </div>
// // //               </div>
// // //             </AccordionContent>
// // //           </AccordionItem>
// // //         </Accordion>

// // //         <LocalErrorBoundary fallbackTitle="تعثر عرض الرحلات المتاحة">
// // //           {isLoadingTrips ? (
// // //             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{[1, 2, 3].map(i => <Skeleton key={i} className="h-48 w-full rounded-lg" />)}</div>
// // //           ) : sortedTrips.length === 0 ? (
// // //             <div className="flex flex-col items-center justify-center text-center py-16 px-4 border-2 border-dashed rounded-lg bg-secondary/5">
// // //               <ShipWheel className="h-12 w-12 text-primary/40 mb-4 animate-spin-slow" />
// // //               <h3 className="text-xl font-bold mb-2">{t('noScheduledTrips')}</h3>
// // //               <Button onClick={() => user ? setIsRequestOpen(true) : setIsAuthRedirectOpen(true)} className="mt-4 h-12 px-10">{t('createSpecialRequest')}</Button>
// // //             </div>
// // //           ) : (
// // //             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
// // //               {sortedTrips.slice(0, visibleCount).map((trip) => (
// // //                 <ScheduledTripCard
// // //                   key={trip.id}
// // //                   trip={trip}
// // //                   onBookNow={!user ? () => setIsAuthRedirectOpen(true) : undefined}
// // //                 />
// // //               ))}
// // //             </div>
// // //           )}
// // //         </LocalErrorBoundary>

// // //         {sortedTrips.length > visibleCount && (
// // //           <div className="flex justify-center pt-6">
// // //             <Button variant="outline" size="lg" onClick={() => setVisibleCount(prev => prev + 10)} className="w-full max-w-sm font-bold gap-2">
// // //               <ChevronDown className="h-4 w-4" /> {t('loadMore')}
// // //             </Button>
// // //           </div>
// // //         )}
// // //       </div>

// // //       <AuthRedirectDialog isOpen={isAuthRedirectOpen} onOpenChange={setIsAuthRedirectOpen} />
// // //       <RequestDialog
// // //         isOpen={isRequestOpen}
// // //         onOpenChange={setIsRequestOpen}
// // //         searchParams={{
// // //           origin: searchOriginCity,
// // //           destination: searchDestinationCity,
// // //           departureDate: searchDate,
// // //           passengers: searchSeats,
// // //           // nationality: nationality,
// // //           requestType: searchCarrierName.trim() ? 'Direct' : 'General',
// // //           targetCarrierId: resolvedCarrierId,
// // //         }}
// // //         onSuccess={() => router.push('/history')}
// // //       />
// // //     </AppLayout>
// // //   );
// // // }
// // 'use client';

// // import { useState, useMemo, useEffect, useCallback } from 'react';
// // import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
// // import { collection, query, where, limit } from 'firebase/firestore';
// // import { useRouter } from '@/i18n/routing';
// // import { useTranslations, useLocale } from 'next-intl';
// // import { Filter, Calendar as CalendarIcon, Send, ChevronsUpDown, Check, PlaneTakeoff, PlaneLanding, ShieldAlert, ShipWheel, ChevronDown, ChevronUp, User, Car, User2 } from 'lucide-react';
// // // [PERF-FIX]: ScheduledTripCard lazy — بيشيل CarrierTrustSheet + BookingSummarySheet
// // // من الـ initial bundle (~30KB)
// // const ScheduledTripCard = dynamic(
// //   () => import('@/components/scheduled-trip-card').then(m => ({ default: m.ScheduledTripCard })),
// //   {
// //     ssr: false,
// //     loading: () => <Skeleton className="h-48 w-full rounded-lg" />
// //   }
// // );
// // import { Button } from '@/components/ui/button';
// // import { Skeleton } from '@/components/ui/skeleton';
// // import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
// // import { getCityName, COUNTRY_CODE_MAP } from '@/lib/constants';
// // import type { Trip } from '@/lib/data';
// // import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// // import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
// // import { cn } from '@/lib/utils';
// // import { parseISO, isValid } from 'date-fns';
// // import { Label } from '@/components/ui/label';
// // import { AppLayout } from '@/components/app-layout';
// // import { useSearchParams } from 'next/navigation';
// // import { useUserProfile } from '@/hooks/use-user-profile';
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// // import { LocalErrorBoundary } from '@/components/ui/local-error-boundary';
// // import { useCountryPricing } from '@/hooks/use-country-pricing';
// // import { useActiveMarkets } from '@/hooks/use-active-markets';
// // import { Input } from '@/components/ui/input';
// // import dynamic from 'next/dynamic';

// // // [PERF-FIX]: Lazy load heavy components — بيوفر ~110 KiB من الـ initial bundle
// // // RequestDialog: zod + react-hook-form + resolvers = ~40KB → بس لما المستخدم يضغط
// // const RequestDialog = dynamic(
// //   () => import('@/components/requests/request-dialog').then(m => ({ default: m.RequestDialog })),
// //   { ssr: false }
// // );
// // // AuthRedirectDialog: بس لما غير مسجل يضغط
// // const AuthRedirectDialog = dynamic(
// //   () => import('@/components/auth-redirect-dialog').then(m => ({ default: m.AuthRedirectDialog })),
// //   { ssr: false }
// // );
// // // Calendar + date-fns locales (~30KB) → بس لما الـ Popover يتفتح
// // const CalendarPicker = dynamic(
// //   () => import('@/components/ui/calendar').then(m => ({ default: m.Calendar })),
// //   { ssr: false, loading: () => <Skeleton className="h-64 w-64" /> }
// // );

// // // [PERF-FIX]: format + locales lazy — بيوفر ~20KB من date-fns
// // async function formatDate(date: Date, locale: string): Promise<string> {
// //   const { format } = await import('date-fns');
// //   if (locale === 'ar') {
// //     const { arSA } = await import('date-fns/locale');
// //     return format(date, 'PPP', { locale: arSA });
// //   }
// //   const { enUS } = await import('date-fns/locale');
// //   return format(date, 'PPP', { locale: enUS });
// // }

// // /**
// //  * @page DashboardPage
// //  * @description THE STERILIZED SEARCH CENTER (V10.0 - PROTOCOL 16)
// //  * [SCR-955]: Final Sterilization. Purged redundant state and enforced clean dependency arrays.
// //  * Protocol 88: Maximum resource protection via stable useMemo filters.
// //  */
// // export default function DashboardPage() {
// //   const { user, isUserLoading } = useUser();
// //   const { profile, isEngaged, isLoading: isProfileLoading } = useUserProfile();
// //   const firestore = useFirestore();
// //   const router = useRouter();
// //   const searchParams = useSearchParams();
// //   const t = useTranslations('dashboard');
// //   const locale = useLocale();

// //   const [visibleCount, setVisibleCount] = useState(10);
// //   const [searchCarrierName, setSearchCarrierName] = useState('');
// //   const [sessionNowISO, setSessionNowISO] = useState<string | null>(null);
// //   const [formattedDate, setFormattedDate] = useState<string>('');
// //   const { activeMarkets, isLoading: isLoadingMarkets } = useActiveMarkets();

// //   useEffect(() => {
// //     setSessionNowISO(new Date().toISOString());
// //   }, []);

// //   const countryCode = useMemo(() => {
// //     if (!profile?.operatingCountry) return 'JO';
// //     return COUNTRY_CODE_MAP[profile.operatingCountry] || 'JO';
// //   }, [profile?.operatingCountry]);

// //   const { rule: marketRule, loading: marketLoading } = useCountryPricing(countryCode);

// //   // بعد ما المسافر يحجز → يتبعت للـ history ومش يرجع للـ dashboard
// //   // الا لما الرحله تنتهي او يلغي (isEngaged بيبقى false تلقائاً لما status = Completed/Cancelled)
// //   useEffect(() => {
// //     if (!isProfileLoading && isEngaged) {
// //       router.replace('/history');
// //     }
// //   }, [isEngaged, isProfileLoading, router]);

// //   const [searchOriginCountry, setSearchOriginCountry] = useState(searchParams.get('oc') || '');
// //   const [searchOriginCity, setSearchOriginCity] = useState(searchParams.get('o') || '');
// //   const [accordionValue, setAccordionValue] = useState<string | undefined>(undefined);
// //   const [searchDestinationCountry, setSearchDestinationCountry] = useState(searchParams.get('dc') || '');
// //   const [searchDestinationCity, setSearchDestinationCity] = useState(searchParams.get('d') || '');

// //   const [searchDate, setSearchDate] = useState<Date | undefined>(() => {
// //     const dt = searchParams.get('dt');
// //     if (!dt) return undefined;
// //     const parsed = parseISO(dt);
// //     return isValid(parsed) ? parsed : undefined;
// //   });

// //   const [searchSeats, setSearchSeats] = useState(parseInt(searchParams.get('s') || '1'));
// //   // const [nationality, setNationality] = useState('اردني')
// //   const [searchVehicleType, setSearchVehicleType] = useState<'any' | 'small' | 'bus'>(
// //     (searchParams.get('v') as any) || 'any'
// //   );

// //   // [PERF-FIX]: format date lazily — لا يحمل date-fns locales إلا لما في تاريخ
// //   useEffect(() => {
// //     if (!searchDate) { setFormattedDate(''); return; }
// //     formatDate(searchDate, locale).then(setFormattedDate);
// //   }, [searchDate, locale]);

// //   // ARTERIAL PERSISTENCE: Sync filters to URL without full page reloads
// //   useEffect(() => {
// //     const params = new URLSearchParams(searchParams.toString());
// //     if (searchOriginCountry) params.set('oc', searchOriginCountry); else params.delete('oc');
// //     if (searchOriginCity) params.set('o', searchOriginCity); else params.delete('o');
// //     if (searchDestinationCountry) params.set('dc', searchDestinationCountry); else params.delete('dc');
// //     if (searchDestinationCity) params.set('d', searchDestinationCity); else params.delete('d');
// //     if (searchDate) params.set('dt', searchDate.toISOString().split('T')[0]); else params.delete('dt');
// //     if (searchSeats > 1) params.set('s', searchSeats.toString()); else params.delete('s');
// //     if (searchVehicleType !== 'any') params.set('v', searchVehicleType); else params.delete('v');

// //     const queryString = params.toString();
// //     const currentPath = window.location.pathname;
// //     const newUrl = queryString ? `${currentPath}?${queryString}` : currentPath;

// //     if (typeof window !== 'undefined' && window.location.search !== `?${queryString}`) {
// //       window.history.replaceState({ ...window.history.state }, '', newUrl);
// //     }
// //   }, [searchOriginCountry, searchOriginCity, searchDestinationCountry, searchDestinationCity, searchDate, searchSeats, searchVehicleType, searchParams]);

// //   const [openOrigin, setOpenOrigin] = useState(false);
// //   const [openDest, setOpenDest] = useState(false);
// //   const [isRequestOpen, setIsRequestOpen] = useState(false);
// //   const [isAuthRedirectOpen, setIsAuthRedirectOpen] = useState(false);

// //   const handleOriginSelect = useCallback((mId: string) => {
// //     setSearchOriginCountry(mId);
// //     setSearchOriginCity("");
// //     setOpenOrigin(false);
// //   }, []);

// //   const handleDestSelect = useCallback((mId: string) => {
// //     setSearchDestinationCountry(mId);
// //     setSearchDestinationCity("");
// //     setOpenDest(false);
// //   }, []);

// //   const tripsQuery = useMemoFirebase(() => {
// //     if (!firestore || !sessionNowISO) return null;
// //     return query(
// //       collection(firestore, 'trips'),
// //       where('status', 'in', ['Planned', 'Has_Offers', 'Negotiating']),
// //       where('departureDate', '>=', sessionNowISO),
// //       limit(200),
// //     );
// //   }, [firestore, sessionNowISO]);

// //   const { data: allTrips, isLoading: isLoadingTrips } = useCollection<Trip>(tripsQuery);

// //   // ✅ query منفصل للناقلين عشان نجيب carrierId بالاسم
// //   const carriersQuery = useMemoFirebase(() => {
// //     if (!firestore || !searchCarrierName.trim()) return null;
// //     return query(
// //       collection(firestore, 'users'),
// //       where('role', '==', 'carrier'),
// //       where('firstName', '>=', searchCarrierName.trim()),
// //       where('firstName', '<=', searchCarrierName.trim() + ''),
// //       limit(5)
// //     );
// //   }, [firestore, searchCarrierName]);
// //   const { data: matchedCarriers } = useCollection<any>(carriersQuery);

// //   // ✅ جيب carrierId من الرحلات أو من الناقلين مباشرة
// //   const resolvedCarrierId = useMemo(() => {
// //     if (!searchCarrierName.trim()) return undefined;
// //     // أولاً من الرحلات
// //     const fromTrips = (allTrips || []).find(t =>
// //       t.carrierName?.toLowerCase().includes(searchCarrierName.toLowerCase())
// //     )?.carrierId;
// //     if (fromTrips) return fromTrips;
// //     // ثانياً من قائمة الناقلين مباشرة
// //     return matchedCarriers?.[0]?.id;
// //   }, [allTrips, matchedCarriers, searchCarrierName]);

// //   // PROTOCOL 88: Centralized O(n) Filter Reactor
// //   const sortedTrips = useMemo(() => {
// //     if (!allTrips) return [];
// //     let filtered = allTrips.filter(t => (t.availableSeats || 0) > 0);

// //     if (searchDate) {
// //       const start = new Date(searchDate); start.setHours(0, 0, 0, 0);
// //       const end = new Date(searchDate); end.setHours(23, 59, 59, 999);
// //       filtered = filtered.filter(t => {
// //         const d = new Date(t.departureDate);
// //         return d >= start && d <= end;
// //       });
// //     }

// //     if (searchCarrierName.trim()) {
// //       const q = searchCarrierName.toLowerCase();
// //       filtered = filtered.filter(t => t.carrierName?.toLowerCase().includes(q));
// //     }

// //     if (searchOriginCity) filtered = filtered.filter(t => t.origin === searchOriginCity);
// //     if (searchDestinationCity) filtered = filtered.filter(t => t.destination === searchDestinationCity);
// //     if (searchSeats > 1) filtered = filtered.filter(t => (t.availableSeats || 0) >= searchSeats);
// //     if (searchVehicleType !== 'any') filtered = filtered.filter(t => t.vehicleCategory === searchVehicleType);

// //     return filtered.sort((a, b) => new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime());
// //   }, [allTrips, searchDate, searchOriginCity, searchDestinationCity, searchSeats, searchVehicleType, searchCarrierName]);

// //   const isInitialLoading = isUserLoading || isProfileLoading || !sessionNowISO || marketLoading || isLoadingMarkets;

// //   if (isInitialLoading) {
// //     return (
// //       <div className="flex h-screen items-center justify-center bg-background">
// //         <div className="text-center space-y-4">
// //           <Skeleton className="h-12 w-12 rounded-full mx-auto" />
// //           <p className="text-muted-foreground animate-pulse">{t('securingPath')}</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (marketRule && !marketRule.isActive) {
// //     return (
// //       <AppLayout profile={profile} user={user}>
// //         <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-8 space-y-6 animate-in fade-in zoom-in duration-700 bg-card rounded-2xl border border-destructive/20">
// //           <div className="p-6 bg-destructive/10 rounded-full border border-destructive/20">
// //             <ShieldAlert className="h-24 w-24 text-destructive animate-pulse" />
// //           </div>
// //           <h2 className="text-3xl font-black text-foreground mb-3">القطاع مغلق مؤقتاً</h2>
// //           <p className="text-muted-foreground font-bold max-w-md mx-auto leading-relaxed">
// //             هذا القطاع الجغرافي ({marketRule.countryName}) يخضع للصيانة السيادية حالياً. سنعود قريباً.
// //           </p>
// //           <Button variant="outline" onClick={() => router.push('/')}>العودة للرئيسية</Button>
// //         </div>
// //       </AppLayout>
// //     );
// //   }

// //   return (
// //     <AppLayout profile={profile} user={user}>
// //       <div className="space-y-4 pt-16">
// //         <Accordion type="single" collapsible value={accordionValue} onValueChange={setAccordionValue} className="w-full bg-card rounded-lg border shadow-sm overflow-hidden" defaultValue={!sortedTrips.length ? 'search-filter' : undefined}>
// //           <AccordionItem value="search-filter" className="border-none">
// //             <AccordionTrigger className="p-4 hover:no-underline font-semibold text-sm bg-blue-600 text-white">
// //               <div className="flex items-center gap-2"><Filter className="w-4 h-4" /><span>{t('searchFilter')}</span></div>
// //             </AccordionTrigger>
// //             <AccordionContent className="p-4 pt-0 border-t bg-card">
// //               <div className="grid grid-cols-1 gap-4 pt-4">
// //                 {/* من دوله ومدينه */}
// //                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// //                   <div className="space-y-2">
// //                     <Label className="text-muted-foreground flex items-center gap-2"><PlaneTakeoff className="h-4 w-4 text-primary" /> {t('fromCountry')}</Label>
// //                     <Popover open={openOrigin} onOpenChange={setOpenOrigin}>
// //                       <PopoverTrigger asChild>
// //                         <Button variant="outline" className="w-full justify-between h-12 bg-card/50 border-muted">
// //                           {searchOriginCountry ? (activeMarkets.find(m => m.id === searchOriginCountry)?.name || searchOriginCountry) : t('selectOriginCountry')}
// //                           <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
// //                         </Button>
// //                       </PopoverTrigger>
// //                       <PopoverContent className="w-[300px] p-0" align="start">
// //                         <Command>
// //                           <CommandInput placeholder={t('searchCountry')} />
// //                           <CommandEmpty>{t('noCountryFound')}</CommandEmpty>
// //                           <CommandGroup>
// //                             <CommandList>
// //                               {activeMarkets.map((market) => (
// //                                 <CommandItem key={market.id} value={market.name} onSelect={() => handleOriginSelect(market.id)}>
// //                                   <Check className={cn("mr-2 h-4 w-4", searchOriginCountry === market.id ? "opacity-100" : "opacity-0")} />
// //                                   {market.name}
// //                                 </CommandItem>
// //                               ))}
// //                             </CommandList>
// //                           </CommandGroup>
// //                         </Command>
// //                       </PopoverContent>
// //                     </Popover>
// //                   </div>
// //                   <div className="space-y-2">
// //                     <Label className="opacity-0">.</Label>
// //                     <Select onValueChange={setSearchOriginCity} value={searchOriginCity} disabled={!searchOriginCountry}>
// //                       <SelectTrigger className="h-12 bg-card/50 border-muted"><SelectValue placeholder={t('fromCity')} /></SelectTrigger>
// //                       <SelectContent>
// //                         {searchOriginCountry && activeMarkets.find(m => m.id === searchOriginCountry)?.cities.map((c: string) => (
// //                           <SelectItem key={c} value={c}>{getCityName(c, locale)}</SelectItem>
// //                         ))}
// //                       </SelectContent>
// //                     </Select>
// //                   </div>
// //                 </div>
// //                 {/* الي دوله و مدينه  */}
// //                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// //                   <div className="space-y-2">
// //                     <Label className="text-muted-foreground flex items-center gap-2"><PlaneLanding className="h-4 w-4 text-primary" /> {t('toCountry')}</Label>
// //                     <Popover open={openDest} onOpenChange={setOpenDest}>
// //                       <PopoverTrigger asChild>
// //                         <Button variant="outline" disabled={!searchOriginCountry} className="w-full justify-between h-12 bg-card/50 border-muted">
// //                           {searchDestinationCountry ? (activeMarkets.find(m => m.id === searchDestinationCountry)?.name || searchDestinationCountry) : t('selectDestCountry')}
// //                           <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
// //                         </Button>
// //                       </PopoverTrigger>
// //                       <PopoverContent className="w-[300px] p-0" align="start">
// //                         <Command>
// //                           <CommandInput placeholder={t('searchCountry')} />
// //                           <CommandEmpty>{t('noDestAvailable')}</CommandEmpty>
// //                           <CommandGroup>
// //                             <CommandList>
// //                               {activeMarkets.filter(m => m.id !== searchOriginCountry).map((market) => (
// //                                 <CommandItem key={market.id} value={market.name} onSelect={() => handleDestSelect(market.id)}>
// //                                   <Check className={cn("mr-2 h-4 w-4", searchDestinationCountry === market.id ? "opacity-100" : "opacity-0")} />
// //                                   {market.name}
// //                                 </CommandItem>
// //                               ))}
// //                             </CommandList>
// //                           </CommandGroup>
// //                         </Command>
// //                       </PopoverContent>
// //                     </Popover>
// //                   </div>
// //                   <div className="space-y-2">
// //                     <Label className="opacity-0">.</Label>
// //                     <Select onValueChange={setSearchDestinationCity} value={searchDestinationCity} disabled={!searchDestinationCountry}>
// //                       <SelectTrigger className="h-12 bg-card/50 border-muted"><SelectValue placeholder={t('toCity')} /></SelectTrigger>
// //                       <SelectContent>
// //                         {searchDestinationCountry && activeMarkets.find(m => m.id === searchDestinationCountry)?.cities.map((c: string) => (
// //                           <SelectItem key={c} value={c}>{getCityName(c, locale)}</SelectItem>
// //                         ))}
// //                       </SelectContent>
// //                     </Select>
// //                   </div>
// //                 </div>
// //                 {/* الجنسيه */}
// //                 {/* <div className="space-y-2">
// //                   <Label className="text-muted-foreground flex items-center gap-2"><User2 className="h-4 w-4 text-primary" /> {t('nationality')}</Label>
// //                   <Input
// //                     placeholder={t('nationality')}
// //                     value={nationality}
// //                     onChange={(e) => setNationality(e.target.value)}
// //                     className="h-12 bg-card/50 border-muted" />

// //                 </div> */}
// //                 {/*  اسم الناقل ونوع المركبه*/}
// //                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
// //                   <div className="space-y-2">
// //                     <Label className="text-muted-foreground flex items-center gap-2"><User className="h-4 w-4 text-primary" /> {t('carrierName')}</Label>
// //                     <Input placeholder={t('writeCarrierName')} value={searchCarrierName} onChange={(e) => setSearchCarrierName(e.target.value)} className="h-12 bg-card/50 border-muted" />
// //                   </div>
// //                   <div className="space-y-2">
// //                     <Label className="text-muted-foreground flex items-center gap-2"><Car className="h-4 w-4 text-primary" /> {t('vehicleType')}</Label>
// //                     <div className="grid grid-cols-3 gap-2">
// //                       {[{ v: 'any', l: t('all') }, { v: 'small', l: t('car') }, { v: 'bus', l: t('bus') }].map((o) => (
// //                         <Button key={o.v} variant={searchVehicleType === o.v ? "default" : "outline"} size="sm" onClick={() => setSearchVehicleType(o.v as any)} className="h-12">{o.l}</Button>
// //                       ))}
// //                     </div>
// //                   </div>
// //                 </div>

// //                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// //                   <Popover>
// //                     <PopoverTrigger asChild>
// //                       <Button variant="outline" className={cn("w-full justify-start h-12 bg-card/50", !searchDate && "text-muted-foreground")}>
// //                         <CalendarIcon className="ml-2 h-4 w-4" />
// //                         {searchDate ? formattedDate : t('travelDate')}
// //                       </Button>
// //                     </PopoverTrigger>
// //                     <PopoverContent className="w-auto p-0" align="start">
// //                       <CalendarPicker mode="single" selected={searchDate} onSelect={setSearchDate} disabled={{ before: new Date() }} />
// //                     </PopoverContent>
// //                   </Popover>
// //                   <Select onValueChange={(v) => setSearchSeats(parseInt(v))} value={String(searchSeats)}>
// //                     <SelectTrigger className="h-12 bg-card/50"><SelectValue placeholder={t('seatCount')} /></SelectTrigger>
// //                     <SelectContent>{[1, 2, 3, 4, 5, 6, 7, 8].map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}</SelectContent>
// //                   </Select>
// //                 </div>

// //                 <div className="flex justify-end pt-2">
// //                   <Button onClick={() => user ? setIsRequestOpen(true) : setIsAuthRedirectOpen(true)} className="gap-2 h-12 px-8 shadow-lg">
// //                     <Send className="h-4 w-4" /> {t('createSpecialRequest')}
// //                   </Button>
// //                 </div>
// //               </div>
// //             </AccordionContent>
// //           </AccordionItem>
// //         </Accordion>

// //         <LocalErrorBoundary fallbackTitle="تعثر عرض الرحلات المتاحة">
// //           {isLoadingTrips ? (
// //             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{[1, 2, 3].map(i => <Skeleton key={i} className="h-48 w-full rounded-lg" />)}</div>
// //           ) : sortedTrips.length === 0 ? (
// //             <div className="flex flex-col items-center justify-center text-center py-16 px-4 border-2 border-dashed rounded-lg bg-secondary/5">
// //               <ShipWheel className="h-12 w-12 text-primary/40 mb-4 animate-spin-slow" />
// //               <h3 className="text-xl font-bold mb-2">{t('noScheduledTrips')}</h3>
// //               <Button onClick={() => user ? setIsRequestOpen(true) : setIsAuthRedirectOpen(true)} className="mt-4 h-12 px-10">إنشاء طلب رحلة مخصصة</Button>
// //             </div>
// //           ) : (
// //             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
// //               {sortedTrips.slice(0, visibleCount).map((trip) => (
// //                 <ScheduledTripCard
// //                   key={trip.id}
// //                   trip={trip}
// //                   onBookNow={!user ? () => setIsAuthRedirectOpen(true) : undefined}
// //                 />
// //               ))}
// //             </div>
// //           )}
// //         </LocalErrorBoundary>

// //         {sortedTrips.length > visibleCount && (
// //           <div className="flex justify-center pt-6">
// //             <Button variant="outline" size="lg" onClick={() => setVisibleCount(prev => prev + 10)} className="w-full max-w-sm font-bold gap-2">
// //               <ChevronDown className="h-4 w-4" /> {t('loadMore')}
// //             </Button>
// //           </div>
// //         )}
// //       </div>

// //       {/* [PERF-FIX]: Dialogs بيتحملوا بس لما بيتفتحوا لأول مرة */}
// //       {isAuthRedirectOpen && <AuthRedirectDialog isOpen={isAuthRedirectOpen} onOpenChange={setIsAuthRedirectOpen} />}
// //       {isRequestOpen && <RequestDialog
// //         isOpen={isRequestOpen}
// //         onOpenChange={setIsRequestOpen}
// //         searchParams={{
// //           origin: searchOriginCity,
// //           destination: searchDestinationCity,
// //           departureDate: searchDate,
// //           passengers: searchSeats,
// //           // nationality: nationality,
// //           requestType: searchCarrierName.trim() ? 'Direct' : 'General',
// //           targetCarrierId: resolvedCarrierId,
// //         }}
// //         onSuccess={() => router.push('/history')}
// //       />}
// //     </AppLayout>
// //   );
// // }
// 'use client';

// import { useState, useMemo, useEffect, useCallback } from 'react';
// import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
// import { collection, query, where, limit } from 'firebase/firestore';
// import { useRouter } from '@/i18n/routing';
// import { useTranslations, useLocale } from 'next-intl';
// import { Filter, Calendar as CalendarIcon, Send, ChevronsUpDown, Check, PlaneTakeoff, PlaneLanding, ShieldAlert, ShipWheel, ChevronDown, User, Car } from 'lucide-react';

// // [PERF-FIX]: ScheduledTripCard lazy
// const ScheduledTripCard = dynamic(
//   () => import('@/components/scheduled-trip-card').then(m => ({ default: m.ScheduledTripCard })),
//   {
//     ssr: false,
//     loading: () => <Skeleton className="h-48 w-full rounded-lg" />
//   }
// );
// import { Button } from '@/components/ui/button';
// import { Skeleton } from '@/components/ui/skeleton';
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
// import { getCityName, COUNTRY_CODE_MAP } from '@/lib/constants';
// import type { Trip } from '@/lib/data';
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
// import { cn } from '@/lib/utils';
// import { parseISO, isValid } from 'date-fns';
// import { Label } from '@/components/ui/label';
// import { AppLayout } from '@/components/app-layout';
// import { useSearchParams } from 'next/navigation';
// import { useUserProfile } from '@/hooks/use-user-profile';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { LocalErrorBoundary } from '@/components/ui/local-error-boundary';
// import { useCountryPricing } from '@/hooks/use-country-pricing';
// import { useActiveMarkets } from '@/hooks/use-active-markets';
// import { Input } from '@/components/ui/input';
// import dynamic from 'next/dynamic';

// // [PERF-FIX]: Lazy load heavy components
// const RequestDialog = dynamic(
//   () => import('@/components/requests/request-dialog').then(m => ({ default: m.RequestDialog })),
//   { ssr: false }
// );
// const AuthRedirectDialog = dynamic(
//   () => import('@/components/auth-redirect-dialog').then(m => ({ default: m.AuthRedirectDialog })),
//   { ssr: false }
// );
// const CalendarPicker = dynamic(
//   () => import('@/components/ui/calendar').then(m => ({ default: m.Calendar })),
//   { ssr: false, loading: () => <Skeleton className="h-64 w-64" /> }
// );

// // [PERF-FIX]: format + locales lazy
// async function formatDate(date: Date, locale: string): Promise<string> {
//   const { format } = await import('date-fns');
//   if (locale === 'ar') {
//     const { arSA } = await import('date-fns/locale');
//     return format(date, 'PPP', { locale: arSA });
//   }
//   const { enUS } = await import('date-fns/locale');
//   return format(date, 'PPP', { locale: enUS });
// }

// export default function DashboardPage() {
//   const { user, isUserLoading } = useUser();
//   const { profile, isEngaged, isLoading: isProfileLoading } = useUserProfile();
//   const firestore = useFirestore();
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const t = useTranslations('dashboard');
//   const locale = useLocale();

//   const [visibleCount, setVisibleCount] = useState(10);
//   const [searchCarrierName, setSearchCarrierName] = useState('');

//   // ✅ إضافة Debounce لاسم الناقل لحماية الفايربيز
//   const [debouncedCarrierName, setDebouncedCarrierName] = useState('');
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedCarrierName(searchCarrierName);
//     }, 500); // ينتظر نصف ثانية بعد توقف الكتابة
//     return () => clearTimeout(handler);
//   }, [searchCarrierName]);

//   const [sessionNowISO, setSessionNowISO] = useState<string | null>(null);
//   const [formattedDate, setFormattedDate] = useState<string>('');
//   const { activeMarkets, isLoading: isLoadingMarkets } = useActiveMarkets();

//   useEffect(() => {
//     setSessionNowISO(new Date().toISOString());
//   }, []);

//   const countryCode = useMemo(() => {
//     if (!profile?.operatingCountry) return 'JO';
//     return COUNTRY_CODE_MAP[profile.operatingCountry] || 'JO';
//   }, [profile?.operatingCountry]);

//   const { rule: marketRule, loading: marketLoading } = useCountryPricing(countryCode);

//   useEffect(() => {
//     if (!isProfileLoading && isEngaged) {
//       router.replace('/history');
//     }
//   }, [isEngaged, isProfileLoading, router]);

//   const [searchOriginCountry, setSearchOriginCountry] = useState(searchParams.get('oc') || '');
//   const [searchOriginCity, setSearchOriginCity] = useState(searchParams.get('o') || '');
//   const [accordionValue, setAccordionValue] = useState<string | undefined>(undefined);
//   const [searchDestinationCountry, setSearchDestinationCountry] = useState(searchParams.get('dc') || '');
//   const [searchDestinationCity, setSearchDestinationCity] = useState(searchParams.get('d') || '');

//   const [searchDate, setSearchDate] = useState<Date | undefined>(() => {
//     const dt = searchParams.get('dt');
//     if (!dt) return undefined;
//     const parsed = parseISO(dt);
//     return isValid(parsed) ? parsed : undefined;
//   });

//   const [searchSeats, setSearchSeats] = useState(parseInt(searchParams.get('s') || '1'));
//   const [searchVehicleType, setSearchVehicleType] = useState<'any' | 'small' | 'bus'>(
//     (searchParams.get('v') as any) || 'any'
//   );

//   useEffect(() => {
//     if (!searchDate) { setFormattedDate(''); return; }
//     formatDate(searchDate, locale).then(setFormattedDate);
//   }, [searchDate, locale]);

//   useEffect(() => {
//     const params = new URLSearchParams(searchParams.toString());
//     if (searchOriginCountry) params.set('oc', searchOriginCountry); else params.delete('oc');
//     if (searchOriginCity) params.set('o', searchOriginCity); else params.delete('o');
//     if (searchDestinationCountry) params.set('dc', searchDestinationCountry); else params.delete('dc');
//     if (searchDestinationCity) params.set('d', searchDestinationCity); else params.delete('d');
//     if (searchDate) params.set('dt', searchDate.toISOString().split('T')[0]); else params.delete('dt');
//     if (searchSeats > 1) params.set('s', searchSeats.toString()); else params.delete('s');
//     if (searchVehicleType !== 'any') params.set('v', searchVehicleType); else params.delete('v');

//     // ✅ نستخدم القيمة المؤجلة (debounced) لعدم إرهاق المتصفح بتحديث الـ URL مع كل حرف
//     if (debouncedCarrierName) params.set('c', debouncedCarrierName); else params.delete('c');

//     const queryString = params.toString();
//     const currentPath = window.location.pathname;
//     const newUrl = queryString ? `${currentPath}?${queryString}` : currentPath;

//     if (typeof window !== 'undefined' && window.location.search !== `?${queryString}`) {
//       window.history.replaceState({ ...window.history.state }, '', newUrl);
//     }
//   }, [searchOriginCountry, searchOriginCity, searchDestinationCountry, searchDestinationCity, searchDate, searchSeats, searchVehicleType, debouncedCarrierName, searchParams]);

//   const [openOrigin, setOpenOrigin] = useState(false);
//   const [openDest, setOpenDest] = useState(false);
//   const [isRequestOpen, setIsRequestOpen] = useState(false);
//   const [isAuthRedirectOpen, setIsAuthRedirectOpen] = useState(false);

//   const handleOriginSelect = useCallback((mId: string) => {
//     setSearchOriginCountry(mId);
//     setSearchOriginCity("");
//     setOpenOrigin(false);
//   }, []);

//   const handleDestSelect = useCallback((mId: string) => {
//     setSearchDestinationCountry(mId);
//     setSearchDestinationCity("");
//     setOpenDest(false);
//   }, []);

//   const tripsQuery = useMemoFirebase(() => {
//     if (!firestore || !sessionNowISO) return null;
//     return query(
//       collection(firestore, 'trips'),
//       where('status', 'in', ['Planned', 'Has_Offers', 'Negotiating']),
//       where('departureDate', '>=', sessionNowISO),
//       limit(200),
//     );
//   }, [firestore, sessionNowISO]);

//   const { data: allTrips, isLoading: isLoadingTrips } = useCollection<Trip>(tripsQuery);

//   // ✅ استخدام debouncedCarrierName بدلاً من searchCarrierName لتوفير القراءات
//   const carriersQuery = useMemoFirebase(() => {
//     if (!firestore || !debouncedCarrierName.trim()) return null;
//     return query(
//       collection(firestore, 'users'),
//       where('role', '==', 'carrier'),
//       where('firstName', '>=', debouncedCarrierName.trim()),
//       where('firstName', '<=', debouncedCarrierName.trim() + '\uf8ff'),
//       limit(5)
//     );
//   }, [firestore, debouncedCarrierName]);
//   const { data: matchedCarriers } = useCollection<any>(carriersQuery);

//   const resolvedCarrierId = useMemo(() => {
//     if (!debouncedCarrierName.trim()) return undefined;
//     const fromTrips = (allTrips || []).find(t =>
//       t.carrierName?.toLowerCase().includes(debouncedCarrierName.toLowerCase())
//     )?.carrierId;
//     if (fromTrips) return fromTrips;
//     return matchedCarriers?.[0]?.id;
//   }, [allTrips, matchedCarriers, debouncedCarrierName]);

//   const sortedTrips = useMemo(() => {
//     if (!allTrips) return [];
//     let filtered = allTrips.filter(t => (t.availableSeats || 0) > 0);

//     if (searchDate) {
//       const start = new Date(searchDate); start.setHours(0, 0, 0, 0);
//       const end = new Date(searchDate); end.setHours(23, 59, 59, 999);
//       filtered = filtered.filter(t => {
//         const d = new Date(t.departureDate);
//         return d >= start && d <= end;
//       });
//     }

//     if (debouncedCarrierName.trim()) {
//       const q = debouncedCarrierName.toLowerCase();
//       filtered = filtered.filter(t => t.carrierName?.toLowerCase().includes(q));
//     }

//     if (searchOriginCity) filtered = filtered.filter(t => t.origin === searchOriginCity);
//     if (searchDestinationCity) filtered = filtered.filter(t => t.destination === searchDestinationCity);
//     if (searchSeats > 1) filtered = filtered.filter(t => (t.availableSeats || 0) >= searchSeats);
//     if (searchVehicleType !== 'any') filtered = filtered.filter(t => t.vehicleCategory === searchVehicleType);

//     return filtered.sort((a, b) => new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime());
//   }, [allTrips, searchDate, searchOriginCity, searchDestinationCity, searchSeats, searchVehicleType, debouncedCarrierName]);

//   const isInitialLoading = isUserLoading || isProfileLoading || !sessionNowISO || marketLoading || isLoadingMarkets;

//   if (isInitialLoading) {
//     return (
//       <div className="flex h-screen items-center justify-center bg-background">
//         <div className="text-center space-y-4">
//           <Skeleton className="h-12 w-12 rounded-full mx-auto" />
//           <p className="text-muted-foreground animate-pulse">{t('securingPath')}</p>
//         </div>
//       </div>
//     );
//   }

//   if (marketRule && !marketRule.isActive) {
//     return (
//       <AppLayout profile={profile} user={user}>
//         <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-8 space-y-6 animate-in fade-in zoom-in duration-700 bg-card rounded-2xl border border-destructive/20">
//           <div className="p-6 bg-destructive/10 rounded-full border border-destructive/20">
//             <ShieldAlert className="h-24 w-24 text-destructive animate-pulse" />
//           </div>
//           <h2 className="text-3xl font-black text-foreground mb-3">القطاع مغلق مؤقتاً</h2>
//           <p className="text-muted-foreground font-bold max-w-md mx-auto leading-relaxed">
//             هذا القطاع الجغرافي ({marketRule.countryName}) يخضع للصيانة السيادية حالياً. سنعود قريباً.
//           </p>
//           <Button variant="outline" onClick={() => router.push('/')}>العودة للرئيسية</Button>
//         </div>
//       </AppLayout>
//     );
//   }

//   return (
//     <AppLayout profile={profile} user={user}>
//       <div className="space-y-4 pt-4 md:pt-8">

//         {/* ✅ إضافة Sticky Positioning للفلاتر لتبقى ظاهرة عند النزول بالصفحة */}
//         <div className="sticky top-[60px] md:top-[70px] z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-2 shadow-sm rounded-lg">
//           <Accordion type="single" collapsible value={accordionValue} onValueChange={setAccordionValue} className="w-full bg-card rounded-lg border overflow-hidden" defaultValue={!sortedTrips.length ? 'search-filter' : undefined}>
//             <AccordionItem value="search-filter" className="border-none">
//               <AccordionTrigger className="p-4 hover:no-underline font-semibold text-sm bg-blue-600 text-white">
//                 <div className="flex items-center gap-2"><Filter className="w-4 h-4" /><span>{t('searchFilter')}</span></div>
//               </AccordionTrigger>
//               <AccordionContent className="p-4 pt-0 border-t bg-card">
//                 <div className="grid grid-cols-1 gap-4 pt-4">
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label className="text-muted-foreground flex items-center gap-2"><PlaneTakeoff className="h-4 w-4 text-primary" /> {t('fromCountry')}</Label>
//                       <Popover open={openOrigin} onOpenChange={setOpenOrigin}>
//                         <PopoverTrigger asChild>
//                           <Button variant="outline" className="w-full justify-between h-12 bg-card/50 border-muted">
//                             {searchOriginCountry ? (activeMarkets.find(m => m.id === searchOriginCountry)?.name || searchOriginCountry) : t('selectOriginCountry')}
//                             <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                           </Button>
//                         </PopoverTrigger>
//                         <PopoverContent className="w-[300px] p-0" align="start">
//                           <Command>
//                             <CommandInput placeholder={t('searchCountry')} />
//                             <CommandEmpty>{t('noCountryFound')}</CommandEmpty>
//                             <CommandGroup>
//                               <CommandList>
//                                 {activeMarkets.map((market) => (
//                                   <CommandItem key={market.id} value={market.name} onSelect={() => handleOriginSelect(market.id)}>
//                                     <Check className={cn("mr-2 h-4 w-4", searchOriginCountry === market.id ? "opacity-100" : "opacity-0")} />
//                                     {market.name}
//                                   </CommandItem>
//                                 ))}
//                               </CommandList>
//                             </CommandGroup>
//                           </Command>
//                         </PopoverContent>
//                       </Popover>
//                     </div>
//                     <div className="space-y-2">
//                       <Label className="opacity-0 hidden sm:block">.</Label>
//                       <Select onValueChange={setSearchOriginCity} value={searchOriginCity} disabled={!searchOriginCountry}>
//                         <SelectTrigger className="h-12 bg-card/50 border-muted"><SelectValue placeholder={t('fromCity')} /></SelectTrigger>
//                         <SelectContent>
//                           {searchOriginCountry && activeMarkets.find(m => m.id === searchOriginCountry)?.cities.map((c: string) => (
//                             <SelectItem key={c} value={c}>{getCityName(c, locale)}</SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label className="text-muted-foreground flex items-center gap-2"><PlaneLanding className="h-4 w-4 text-primary" /> {t('toCountry')}</Label>
//                       <Popover open={openDest} onOpenChange={setOpenDest}>
//                         <PopoverTrigger asChild>
//                           <Button variant="outline" disabled={!searchOriginCountry} className="w-full justify-between h-12 bg-card/50 border-muted">
//                             {searchDestinationCountry ? (activeMarkets.find(m => m.id === searchDestinationCountry)?.name || searchDestinationCountry) : t('selectDestCountry')}
//                             <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                           </Button>
//                         </PopoverTrigger>
//                         <PopoverContent className="w-[300px] p-0" align="start">
//                           <Command>
//                             <CommandInput placeholder={t('searchCountry')} />
//                             <CommandEmpty>{t('noDestAvailable')}</CommandEmpty>
//                             <CommandGroup>
//                               <CommandList>
//                                 {activeMarkets.filter(m => m.id !== searchOriginCountry).map((market) => (
//                                   <CommandItem key={market.id} value={market.name} onSelect={() => handleDestSelect(market.id)}>
//                                     <Check className={cn("mr-2 h-4 w-4", searchDestinationCountry === market.id ? "opacity-100" : "opacity-0")} />
//                                     {market.name}
//                                   </CommandItem>
//                                 ))}
//                               </CommandList>
//                             </CommandGroup>
//                           </Command>
//                         </PopoverContent>
//                       </Popover>
//                     </div>
//                     <div className="space-y-2">
//                       <Label className="opacity-0 hidden sm:block">.</Label>
//                       <Select onValueChange={setSearchDestinationCity} value={searchDestinationCity} disabled={!searchDestinationCountry}>
//                         <SelectTrigger className="h-12 bg-card/50 border-muted"><SelectValue placeholder={t('toCity')} /></SelectTrigger>
//                         <SelectContent>
//                           {searchDestinationCountry && activeMarkets.find(m => m.id === searchDestinationCountry)?.cities.map((c: string) => (
//                             <SelectItem key={c} value={c}>{getCityName(c, locale)}</SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
//                     <div className="space-y-2">
//                       <Label className="text-muted-foreground flex items-center gap-2"><User className="h-4 w-4 text-primary" /> {t('carrierName')}</Label>
//                       {/* ✅ ربط الـ Input بالقيمة الأصلية لكي تكون الكتابة سلسة للمستخدم */}
//                       <Input placeholder={t('writeCarrierName')} value={searchCarrierName} onChange={(e) => setSearchCarrierName(e.target.value)} className="h-12 bg-card/50 border-muted" />
//                     </div>
//                     <div className="space-y-2">
//                       <Label className="text-muted-foreground flex items-center gap-2"><Car className="h-4 w-4 text-primary" /> {t('vehicleType')}</Label>
//                       <div className="grid grid-cols-3 gap-2">
//                         {[{ v: 'any', l: t('all') }, { v: 'small', l: t('car') }, { v: 'bus', l: t('bus') }].map((o) => (
//                           <Button key={o.v} variant={searchVehicleType === o.v ? "default" : "outline"} size="sm" onClick={() => setSearchVehicleType(o.v as any)} className="h-12">{o.l}</Button>
//                         ))}
//                       </div>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <Popover>
//                       <PopoverTrigger asChild>
//                         <Button variant="outline" className={cn("w-full justify-start h-12 bg-card/50", !searchDate && "text-muted-foreground")}>
//                           <CalendarIcon className="ml-2 h-4 w-4" />
//                           {searchDate ? formattedDate : t('travelDate')}
//                         </Button>
//                       </PopoverTrigger>
//                       <PopoverContent className="w-auto p-0" align="start">
//                         <CalendarPicker mode="single" selected={searchDate} onSelect={setSearchDate} disabled={{ before: new Date() }} />
//                       </PopoverContent>
//                     </Popover>
//                     <Select onValueChange={(v) => setSearchSeats(parseInt(v))} value={String(searchSeats)}>
//                       <SelectTrigger className="h-12 bg-card/50"><SelectValue placeholder={t('seatCount')} /></SelectTrigger>
//                       <SelectContent>{[1, 2, 3, 4, 5, 6, 7, 8].map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}</SelectContent>
//                     </Select>
//                   </div>

//                   <div className="flex justify-end pt-2">
//                     <Button onClick={() => user ? setIsRequestOpen(true) : setIsAuthRedirectOpen(true)} className="gap-2 h-12 px-8 shadow-lg">
//                       <Send className="h-4 w-4" /> {t('createSpecialRequest')}
//                     </Button>
//                   </div>
//                 </div>
//               </AccordionContent>
//             </AccordionItem>
//           </Accordion>
//         </div>

//         <LocalErrorBoundary fallbackTitle="تعثر عرض الرحلات المتاحة">
//           {isLoadingTrips ? (
//             // ✅ تم تحسين الـ Skeleton ليكون أكثر واقعية وجاذبية أثناء التحميل
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {[1, 2, 3, 4, 5, 6].map(i => (
//                 <div key={i} className="flex flex-col space-y-4 border p-5 rounded-2xl shadow-sm bg-card">
//                   <div className="flex justify-between items-center">
//                     <div className="flex items-center gap-3">
//                       <Skeleton className="h-12 w-12 rounded-full" />
//                       <div className="space-y-2">
//                         <Skeleton className="h-4 w-24" />
//                         <Skeleton className="h-3 w-16" />
//                       </div>
//                     </div>
//                     <Skeleton className="h-8 w-16 rounded-full" />
//                   </div>
//                   <Skeleton className="h-16 w-full rounded-xl" />
//                   <div className="flex justify-between items-center pt-2">
//                     <Skeleton className="h-4 w-20" />
//                     <Skeleton className="h-10 w-28 rounded-lg" />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : sortedTrips.length === 0 ? (
//             <div className="flex flex-col items-center justify-center text-center py-16 px-4 border-2 border-dashed rounded-lg bg-secondary/5">
//               <ShipWheel className="h-12 w-12 text-primary/40 mb-4 animate-spin-slow" />
//               <h3 className="text-xl font-bold mb-2">{t('noScheduledTrips')}</h3>
//               <Button onClick={() => user ? setIsRequestOpen(true) : setIsAuthRedirectOpen(true)} className="mt-4 h-12 px-10">إنشاء طلب رحلة مخصصة</Button>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
//               {sortedTrips.slice(0, visibleCount).map((trip) => (
//                 <ScheduledTripCard
//                   key={trip.id}
//                   trip={trip}
//                   onBookNow={!user ? () => setIsAuthRedirectOpen(true) : undefined}
//                 />
//               ))}
//             </div>
//           )}
//         </LocalErrorBoundary>

//         {sortedTrips.length > visibleCount && (
//           <div className="flex justify-center pt-6">
//             <Button variant="outline" size="lg" onClick={() => setVisibleCount(prev => prev + 10)} className="w-full max-w-sm font-bold gap-2">
//               <ChevronDown className="h-4 w-4" /> {t('loadMore')}
//             </Button>
//           </div>
//         )}
//       </div>

//       {isAuthRedirectOpen && <AuthRedirectDialog isOpen={isAuthRedirectOpen} onOpenChange={setIsAuthRedirectOpen} />}
//       {isRequestOpen && <RequestDialog
//         isOpen={isRequestOpen}
//         onOpenChange={setIsRequestOpen}
//         searchParams={{
//           origin: searchOriginCity,
//           destination: searchDestinationCity,
//           departureDate: searchDate,
//           passengers: searchSeats,
//           requestType: debouncedCarrierName.trim() ? 'Direct' : 'General',
//           targetCarrierId: resolvedCarrierId,
//         }}
//         onSuccess={() => router.push('/history')}
//       />}
//     </AppLayout>
//   );
// }

'use client';

import { useState, useMemo, useEffect, useCallback, Suspense } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import { useRouter } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { Filter, Calendar as CalendarIcon, Send, ChevronsUpDown, Check, PlaneTakeoff, PlaneLanding, ShieldAlert, ShipWheel, ChevronDown, User, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getCityName, COUNTRY_CODE_MAP } from '@/lib/constants';
import type { Trip } from '@/lib/data';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { parseISO, isValid } from 'date-fns';
import { Label } from '@/components/ui/label';
import { AppLayout } from '@/components/app-layout';
import { useSearchParams } from 'next/navigation';
import { useUserProfile } from '@/hooks/use-user-profile';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LocalErrorBoundary } from '@/components/ui/local-error-boundary';
import { useCountryPricing } from '@/hooks/use-country-pricing';
import { useActiveMarkets } from '@/hooks/use-active-markets';
import { Input } from '@/components/ui/input';
import dynamic from 'next/dynamic';

const ScheduledTripCard = dynamic(
  () => import('@/components/scheduled-trip-card').then(m => ({ default: m.ScheduledTripCard })),
  { ssr: false, loading: () => <Skeleton className="h-48 w-full rounded-lg" /> }
);
const RequestDialog = dynamic(() => import('@/components/requests/request-dialog').then(m => ({ default: m.RequestDialog })), { ssr: false });
const AuthRedirectDialog = dynamic(() => import('@/components/auth-redirect-dialog').then(m => ({ default: m.AuthRedirectDialog })), { ssr: false });
const CalendarPicker = dynamic(() => import('@/components/ui/calendar').then(m => ({ default: m.Calendar })), { ssr: false, loading: () => <Skeleton className="h-64 w-64" /> });

async function formatDate(date: Date, locale: string): Promise<string> {
  const { format } = await import('date-fns');
  if (locale === 'ar') {
    const { arSA } = await import('date-fns/locale');
    return format(date, 'PPP', { locale: arSA });
  }
  const { enUS } = await import('date-fns/locale');
  return format(date, 'PPP', { locale: enUS });
}

// 1. قمنا بفصل المحتوى الذي يستخدم useSearchParams هنا
function DashboardContent() {
  const { user, isUserLoading } = useUser();
  const { profile, isEngaged, isLoading: isProfileLoading } = useUserProfile();
  const firestore = useFirestore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('dashboard');
  const locale = useLocale();

  const [visibleCount, setVisibleCount] = useState(4);
  const [searchCarrierName, setSearchCarrierName] = useState('');
  const [debouncedCarrierName, setDebouncedCarrierName] = useState('');
  const [sessionNowISO, setSessionNowISO] = useState<string | null>(null);
  const [formattedDate, setFormattedDate] = useState<string>('');
  const { activeMarkets, isLoading: isLoadingMarkets } = useActiveMarkets();

  useEffect(() => { setSessionNowISO(new Date().toISOString()); }, []);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedCarrierName(searchCarrierName), 500);
    return () => clearTimeout(handler);
  }, [searchCarrierName]);

  const countryCode = useMemo(() => {
    if (!profile?.operatingCountry) return 'JO';
    return COUNTRY_CODE_MAP[profile.operatingCountry] || 'JO';
  }, [profile?.operatingCountry]);

  const { rule: marketRule, loading: marketLoading } = useCountryPricing(countryCode);

  useEffect(() => {
    if (!isProfileLoading && isEngaged) router.replace('/history');
  }, [isEngaged, isProfileLoading, router]);

  const [searchOriginCountry, setSearchOriginCountry] = useState(searchParams.get('oc') || '');
  const [searchOriginCity, setSearchOriginCity] = useState(searchParams.get('o') || '');
  const [accordionValue, setAccordionValue] = useState<string | undefined>(undefined);
  const [searchDestinationCountry, setSearchDestinationCountry] = useState(searchParams.get('dc') || '');
  const [searchDestinationCity, setSearchDestinationCity] = useState(searchParams.get('d') || '');
  const [searchDate, setSearchDate] = useState<Date | undefined>(() => {
    const dt = searchParams.get('dt');
    if (!dt) return undefined;
    const parsed = parseISO(dt);
    return isValid(parsed) ? parsed : undefined;
  });
  const [searchSeats, setSearchSeats] = useState(parseInt(searchParams.get('s') || '1'));
  const [searchVehicleType, setSearchVehicleType] = useState<'any' | 'small' | 'bus'>((searchParams.get('v') as any) || 'any');

  useEffect(() => {
    if (!searchDate) { setFormattedDate(''); return; }
    formatDate(searchDate, locale).then(setFormattedDate);
  }, [searchDate, locale]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchOriginCountry) params.set('oc', searchOriginCountry); else params.delete('oc');
    if (searchOriginCity) params.set('o', searchOriginCity); else params.delete('o');
    if (searchDestinationCountry) params.set('dc', searchDestinationCountry); else params.delete('dc');
    if (searchDestinationCity) params.set('d', searchDestinationCity); else params.delete('d');
    if (searchDate) params.set('dt', searchDate.toISOString().split('T')[0]); else params.delete('dt');
    if (searchSeats > 1) params.set('s', searchSeats.toString()); else params.delete('s');
    if (searchVehicleType !== 'any') params.set('v', searchVehicleType); else params.delete('v');
    if (debouncedCarrierName) params.set('c', debouncedCarrierName); else params.delete('c');

    const queryString = params.toString();
    const currentPath = window.location.pathname;
    const newUrl = queryString ? `${currentPath}?${queryString}` : currentPath;

    if (typeof window !== 'undefined' && window.location.search !== `?${queryString}`) {
      window.history.replaceState({ ...window.history.state }, '', newUrl);
    }
  }, [searchOriginCountry, searchOriginCity, searchDestinationCountry, searchDestinationCity, searchDate, searchSeats, searchVehicleType, debouncedCarrierName, searchParams]);

  const [openOrigin, setOpenOrigin] = useState(false);
  const [openDest, setOpenDest] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [isAuthRedirectOpen, setIsAuthRedirectOpen] = useState(false);

  const handleOriginSelect = useCallback((mId: string) => { setSearchOriginCountry(mId); setSearchOriginCity(""); setOpenOrigin(false); }, []);
  const handleDestSelect = useCallback((mId: string) => { setSearchDestinationCountry(mId); setSearchDestinationCity(""); setOpenDest(false); }, []);

  const tripsQuery = useMemoFirebase(() => {
    if (!firestore || !sessionNowISO) return null;
    return query(collection(firestore, 'trips'), where('status', 'in', ['Planned', 'Has_Offers', 'Negotiating']), where('departureDate', '>=', sessionNowISO), limit(200));
  }, [firestore, sessionNowISO]);

  const { data: allTrips, isLoading: isLoadingTrips } = useCollection<Trip>(tripsQuery);

  const carriersQuery = useMemoFirebase(() => {
    if (!firestore || !debouncedCarrierName.trim()) return null;
    return query(collection(firestore, 'users'), where('role', '==', 'carrier'), where('firstName', '>=', debouncedCarrierName.trim()), where('firstName', '<=', debouncedCarrierName.trim() + '\uf8ff'), limit(5));
  }, [firestore, debouncedCarrierName]);
  const { data: matchedCarriers } = useCollection<any>(carriersQuery);

  const resolvedCarrierId = useMemo(() => {
    if (!debouncedCarrierName.trim()) return undefined;
    const fromTrips = (allTrips || []).find(t => t.carrierName?.toLowerCase().includes(debouncedCarrierName.toLowerCase()))?.carrierId;
    if (fromTrips) return fromTrips;
    return matchedCarriers?.[0]?.id;
  }, [allTrips, matchedCarriers, debouncedCarrierName]);

  const sortedTrips = useMemo(() => {
    if (!allTrips) return [];
    let filtered = allTrips.filter(t => (t.availableSeats || 0) > 0);
    if (searchDate) {
      const start = new Date(searchDate); start.setHours(0, 0, 0, 0);
      const end = new Date(searchDate); end.setHours(23, 59, 59, 999);
      filtered = filtered.filter(t => { const d = new Date(t.departureDate); return d >= start && d <= end; });
    }
    if (debouncedCarrierName.trim()) {
      const q = debouncedCarrierName.toLowerCase();
      filtered = filtered.filter(t => t.carrierName?.toLowerCase().includes(q));
    }
    if (searchOriginCity) filtered = filtered.filter(t => t.origin === searchOriginCity);
    if (searchDestinationCity) filtered = filtered.filter(t => t.destination === searchDestinationCity);
    if (searchSeats > 1) filtered = filtered.filter(t => (t.availableSeats || 0) >= searchSeats);
    if (searchVehicleType !== 'any') filtered = filtered.filter(t => t.vehicleCategory === searchVehicleType);
    return filtered.sort((a, b) => new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime());
  }, [allTrips, searchDate, searchOriginCity, searchDestinationCity, searchSeats, searchVehicleType, debouncedCarrierName]);

  const isInitialLoading = isUserLoading || isProfileLoading || !sessionNowISO || marketLoading || isLoadingMarkets;

  if (isInitialLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-12 rounded-full mx-auto" />
          <p className="text-muted-foreground animate-pulse">{t('securingPath')}</p>
        </div>
      </div>
    );
  }

  if (marketRule && !marketRule.isActive) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-8 space-y-6 animate-in fade-in zoom-in duration-700 bg-card rounded-2xl border border-destructive/20">
        <div className="p-6 bg-destructive/10 rounded-full border border-destructive/20"><ShieldAlert className="h-24 w-24 text-destructive animate-pulse" /></div>
        <h2 className="text-3xl font-black text-foreground mb-3">القطاع مغلق مؤقتاً</h2>
        <p className="text-muted-foreground font-bold max-w-md mx-auto leading-relaxed">هذا القطاع الجغرافي ({marketRule.countryName}) يخضع للصيانة السيادية حالياً. سنعود قريباً.</p>
        <Button variant="outline" onClick={() => router.push('/')}>العودة للرئيسية</Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 pt-4 md:pt-8">
        <div className="sticky top-[60px] md:top-[70px] z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-2 shadow-sm rounded-lg">
          <Accordion type="single" collapsible value={accordionValue} onValueChange={setAccordionValue} className="w-full bg-card rounded-lg border overflow-hidden" defaultValue={!sortedTrips.length ? 'search-filter' : undefined}>
            <AccordionItem value="search-filter" className="border-none">
              {/* حل مشكلة الـ Accessibility بإضافة aria-label */}
              <AccordionTrigger aria-label={t('searchFilter')} className="p-4 hover:no-underline font-semibold text-sm bg-blue-600 text-white">
                <div className="flex items-center gap-2"><Filter className="w-4 h-4" /><span>{t('searchFilter')}</span></div>
              </AccordionTrigger>
              <AccordionContent className="p-4 pt-0 border-t bg-card">
                <div className="grid grid-cols-1 gap-4 pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground flex items-center gap-2"><PlaneTakeoff className="h-4 w-4 text-primary" /> {t('fromCountry')}</Label>
                      <Popover open={openOrigin} onOpenChange={setOpenOrigin}>
                        <PopoverTrigger asChild>
                          {/* حل مشكلة الـ Accessibility */}
                          <Button aria-label={t('selectOriginCountry')} variant="outline" className="w-full justify-between h-12 bg-card/50 border-muted">
                            {searchOriginCountry ? (activeMarkets.find(m => m.id === searchOriginCountry)?.name || searchOriginCountry) : t('selectOriginCountry')}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0" align="start">
                          <Command>
                            <CommandInput placeholder={t('searchCountry')} />
                            <CommandEmpty>{t('noCountryFound')}</CommandEmpty>
                            <CommandGroup>
                              <CommandList>
                                {activeMarkets.map((market) => (
                                  <CommandItem key={market.id} value={market.name} onSelect={() => handleOriginSelect(market.id)}>
                                    <Check className={cn("mr-2 h-4 w-4", searchOriginCountry === market.id ? "opacity-100" : "opacity-0")} />
                                    {market.name}
                                  </CommandItem>
                                ))}
                              </CommandList>
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label className="opacity-0 hidden sm:block">.</Label>
                      <Select onValueChange={setSearchOriginCity} value={searchOriginCity} disabled={!searchOriginCountry}>
                        <SelectTrigger aria-label={t('fromCity')} className="h-12 bg-card/50 border-muted"><SelectValue placeholder={t('fromCity')} /></SelectTrigger>
                        <SelectContent>
                          {searchOriginCountry && activeMarkets.find(m => m.id === searchOriginCountry)?.cities.map((c: string) => (
                            <SelectItem key={c} value={c}>{getCityName(c, locale)}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground flex items-center gap-2"><PlaneLanding className="h-4 w-4 text-primary" /> {t('toCountry')}</Label>
                      <Popover open={openDest} onOpenChange={setOpenDest}>
                        <PopoverTrigger asChild>
                          <Button aria-label={t('selectDestCountry')} variant="outline" disabled={!searchOriginCountry} className="w-full justify-between h-12 bg-card/50 border-muted">
                            {searchDestinationCountry ? (activeMarkets.find(m => m.id === searchDestinationCountry)?.name || searchDestinationCountry) : t('selectDestCountry')}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0" align="start">
                          <Command>
                            <CommandInput placeholder={t('searchCountry')} />
                            <CommandEmpty>{t('noDestAvailable')}</CommandEmpty>
                            <CommandGroup>
                              <CommandList>
                                {activeMarkets.filter(m => m.id !== searchOriginCountry).map((market) => (
                                  <CommandItem key={market.id} value={market.name} onSelect={() => handleDestSelect(market.id)}>
                                    <Check className={cn("mr-2 h-4 w-4", searchDestinationCountry === market.id ? "opacity-100" : "opacity-0")} />
                                    {market.name}
                                  </CommandItem>
                                ))}
                              </CommandList>
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label className="opacity-0 hidden sm:block">.</Label>
                      <Select onValueChange={setSearchDestinationCity} value={searchDestinationCity} disabled={!searchDestinationCountry}>
                        <SelectTrigger aria-label={t('toCity')} className="h-12 bg-card/50 border-muted"><SelectValue placeholder={t('toCity')} /></SelectTrigger>
                        <SelectContent>
                          {searchDestinationCountry && activeMarkets.find(m => m.id === searchDestinationCountry)?.cities.map((c: string) => (
                            <SelectItem key={c} value={c}>{getCityName(c, locale)}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground flex items-center gap-2"><User className="h-4 w-4 text-primary" /> {t('carrierName')}</Label>
                      <Input placeholder={t('writeCarrierName')} value={searchCarrierName} onChange={(e) => setSearchCarrierName(e.target.value)} className="h-12 bg-card/50 border-muted" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground flex items-center gap-2"><Car className="h-4 w-4 text-primary" /> {t('vehicleType')}</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {[{ v: 'any', l: t('all') }, { v: 'small', l: t('car') }, { v: 'bus', l: t('bus') }].map((o) => (
                          <Button aria-label={o.l} key={o.v} variant={searchVehicleType === o.v ? "default" : "outline"} size="sm" onClick={() => setSearchVehicleType(o.v as any)} className="h-12">{o.l}</Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button aria-label={t('travelDate')} variant="outline" className={cn("w-full justify-start h-12 bg-card/50", !searchDate && "text-muted-foreground")}>
                          <CalendarIcon className="ml-2 h-4 w-4" />
                          {searchDate ? formattedDate : t('travelDate')}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarPicker mode="single" selected={searchDate} onSelect={setSearchDate} disabled={{ before: new Date() }} />
                      </PopoverContent>
                    </Popover>
                    <Select onValueChange={(v) => setSearchSeats(parseInt(v))} value={String(searchSeats)}>
                      <SelectTrigger aria-label={t('seatCount')} className="h-12 bg-card/50"><SelectValue placeholder={t('seatCount')} /></SelectTrigger>
                      <SelectContent>{[1, 2, 3, 4, 5, 6, 7, 8].map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button onClick={() => user ? setIsRequestOpen(true) : setIsAuthRedirectOpen(true)} className="gap-2 h-12 px-8 shadow-lg">
                      <Send className="h-4 w-4" /> {t('createSpecialRequest')}
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <LocalErrorBoundary fallbackTitle="تعثر عرض الرحلات المتاحة">
          {isLoadingTrips ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="flex flex-col space-y-4 border p-5 rounded-2xl shadow-sm bg-card">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                    <Skeleton className="h-8 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-16 w-full rounded-xl" />
                  <div className="flex justify-between items-center pt-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-28 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ) : sortedTrips.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-16 px-4 border-2 border-dashed rounded-lg bg-secondary/5">
              <ShipWheel className="h-12 w-12 text-primary/40 mb-4 animate-spin-slow" />
              <h3 className="text-xl font-bold mb-2">{t('noScheduledTrips')}</h3>
              <Button onClick={() => user ? setIsRequestOpen(true) : setIsAuthRedirectOpen(true)} className="mt-4 h-12 px-10">إنشاء طلب رحلة مخصصة</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
              {sortedTrips.slice(0, visibleCount).map((trip) => (
                <ScheduledTripCard
                  key={trip.id}
                  trip={trip}
                  onBookNow={!user ? () => setIsAuthRedirectOpen(true) : undefined}
                />
              ))}
            </div>
          )}
        </LocalErrorBoundary>

        {sortedTrips.length > visibleCount && (
          <div className="flex justify-center pt-6">
            <Button variant="outline" size="lg" onClick={() => setVisibleCount(prev => prev + 5)} className="w-full max-w-sm font-bold gap-2">
              <ChevronDown className="h-4 w-4" /> {t('loadMore')}
            </Button>
          </div>
        )}
      </div>

      {isAuthRedirectOpen && <AuthRedirectDialog isOpen={isAuthRedirectOpen} onOpenChange={setIsAuthRedirectOpen} />}
      {isRequestOpen && <RequestDialog
        isOpen={isRequestOpen}
        onOpenChange={setIsRequestOpen}
        searchParams={{
          origin: searchOriginCity,
          destination: searchDestinationCity,
          departureDate: searchDate,
          passengers: searchSeats,
          requestType: debouncedCarrierName.trim() ? 'Direct' : 'General',
          targetCarrierId: resolvedCarrierId,
        }}
        onSuccess={() => router.push('/history')}
      />}
    </>
  );
}

// 2. المكون الأساسي الذي يغلف المحتوى بـ Suspense
export default function DashboardPage() {
  const { user } = useUser();
  const { profile } = useUserProfile();

  return (
    <AppLayout profile={profile} user={user}>
      <Suspense fallback={
        <div className="flex h-screen items-center justify-center bg-background">
          <Skeleton className="h-12 w-12 rounded-full animate-pulse" />
        </div>
      }>
        <DashboardContent />
      </Suspense>
    </AppLayout>
  );
}