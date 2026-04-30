// 'use client';

// /**
//  * @component SmartRadar
//  * @description THE STERILIZED RADAR VIEW (V23.0 - DIAMOND)
//  * [PROTOCOL 16]: Dumb UI Island. Logic completely moved to useSovereignSearch.
//  * [PROTOCOL 88]: Memoized layout to prevent unnecessary redraws.
//  */

// import React, { useState, useCallback, memo } from 'react';
// import { 
//   Filter, PlaneTakeoff, PlaneLanding, ChevronsUpDown, Check, Zap, MapPin, Calendar as CalendarIcon, XCircle
// } from 'lucide-react';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
// import { Calendar as CalendarPicker } from "@/components/ui/calendar";
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { LocalErrorBoundary } from '@/components/ui/local-error-boundary';
// import { format } from 'date-fns';
// import { cn, triggerHaptic } from '@/lib/utils';
// import { getCityName } from '@/lib/constants';
// import { useSovereignSearch } from '@/hooks/use-sovereign-search';
// import { formatDate } from '@/lib/formatters';
// import { Skeleton } from '@/components/ui/skeleton';
// import { useLocale } from 'next-intl';

// interface SmartRadarProps {
//   activeMarkets: any[];
// }

// export const SmartRadar = memo(({ activeMarkets }: SmartRadarProps) => {
//   const locale = useLocale();
//   const [openOrigin, setOpenOrigin] = useState(false);
//   const [openDest, setOpenDest] = useState(false);

//   const { filters, updateFilters, clearFilters, matchedTrips, matchedCarriers, radarStatus } = useSovereignSearch();

//   const handleOriginChange = useCallback((mId: string) => {
//     updateFilters({ originCountry: mId, originCity: '' });
//     setOpenOrigin(false);
//   }, [updateFilters]);

//   const handleDestChange = useCallback((mId: string) => {
//     updateFilters({ destCountry: mId, destCity: '' });
//     setOpenDest(false);
//   }, [updateFilters]);

//   const handleClear = useCallback(() => {
//     triggerHaptic('heavy');
//     clearFilters();
//   }, [clearFilters]);

//   return (
//     <div className="space-y-4 animate-in fade-in duration-500">
//         <div className="flex items-center justify-between px-2">
//             <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
//                 <Filter className="h-3 w-3 text-primary" /> رادار الاستكشاف الميداني
//             </h3>
//             {radarStatus !== 'idle' && (
//                 <button onClick={handleClear} className="text-[10px] font-black text-destructive hover:opacity-70 flex items-center gap-1 transition-all">
//                     <XCircle className="h-3 w-3" /> ترسيت الفلاتر
//                 </button>
//             )}
//         </div>

//         <Card className="border-primary/10 bg-card/50 backdrop-blur-md rounded-[2.5rem] overflow-hidden shadow-2xl border-2">
//             <CardContent className="p-6 space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                         <Label className="text-[10px] font-black text-primary uppercase flex items-center gap-1">
//                             <PlaneTakeoff className="h-3 w-3" /> نقطة الانطلاق
//                         </Label>
//                         <div className="flex flex-col gap-2">
//                             <Popover open={openOrigin} onOpenChange={setOpenOrigin}>
//                                 <PopoverTrigger asChild>
//                                     <Button variant="outline" className="w-full justify-between h-11 bg-background text-xs font-bold border-primary/10 rounded-xl">
//                                         {filters.originCountry ? activeMarkets.find(m => m.id === filters.originCountry)?.name : "اختر دولة"}
//                                         <ChevronsUpDown className="h-3 w-3 opacity-50" />
//                                     </Button>
//                                 </PopoverTrigger>
//                                 <PopoverContent className="w-[200px] p-0 rounded-2xl" align="start">
//                                     <Command>
//                                         <CommandInput placeholder="بحث..." className="h-9 text-xs" />
//                                         <CommandList>
//                                             <CommandEmpty>لا نتائج.</CommandEmpty>
//                                             <CommandGroup>
//                                                 <CommandList>
//                                                     {activeMarkets.map(m => (
//                                                         <CommandItem key={m.id} onSelect={() => handleOriginChange(m.id)} className="text-xs font-bold">
//                                                             <Check className={cn("mr-2 h-3 w-3", filters.originCountry === m.id ? "opacity-100" : "opacity-0")} /> {m.name}
//                                                         </CommandItem>
//                                                     ))}
//                                                 </CommandList>
//                                             </CommandGroup>
//                                         </CommandList>
//                                     </Command>
//                                 </PopoverContent>
//                             </Popover>
//                             <Select value={filters.originCity || undefined} onValueChange={(v) => updateFilters({ originCity: v })} disabled={!filters.originCountry}>
//                                 <SelectTrigger className="h-11 text-xs font-bold rounded-xl"><SelectValue placeholder="اختر مدينة" /></SelectTrigger>
//                                 <SelectContent className="rounded-xl">
//                                     {filters.originCountry && activeMarkets.find(m => m.id === filters.originCountry)?.cities.map((c: string) => (
//                                         <SelectItem key={c} value={c} className="text-xs font-bold">{getCityName(c, locale)}</SelectItem>
//                                     ))}
//                                 </SelectContent>
//                             </Select>
//                         </div>
//                     </div>

//                     <div className="space-y-2">
//                         <Label className="text-[10px] font-black text-primary uppercase flex items-center gap-1">
//                             <PlaneLanding className="h-3 w-3" /> وجهة الوصول
//                         </Label>
//                         <div className="flex flex-col gap-2">
//                             <Popover open={openDest} onOpenChange={setOpenDest}>
//                                 <PopoverTrigger asChild>
//                                     <Button variant="outline" disabled={!filters.originCountry} className="w-full justify-between h-11 bg-background text-xs font-bold border-primary/10 rounded-xl">
//                                         {filters.destCountry ? activeMarkets.find(m => m.id === filters.destCountry)?.name : "اختر دولة"}
//                                         <ChevronsUpDown className="h-3 w-3 opacity-50" />
//                                     </Button>
//                                 </PopoverTrigger>
//                                 <PopoverContent className="w-[200px] p-0 rounded-2xl" align="start">
//                                     <Command>
//                                         <CommandInput placeholder="بحث..." className="h-9 text-xs" />
//                                         <CommandList>
//                                             <CommandEmpty>لا نتائج.</CommandEmpty>
//                                             <CommandGroup>
//                                                 <CommandList>
//                                                     {activeMarkets.filter(m => m.id !== filters.originCountry).map(m => (
//                                                         <CommandItem key={m.id} onSelect={() => handleDestChange(m.id)} className="text-xs font-bold">
//                                                             <Check className={cn("mr-2 h-3 w-3", filters.destCountry === m.id ? "opacity-100" : "opacity-0")} /> {m.name}
//                                                         </CommandItem>
//                                                     ))}
//                                                 </CommandList>
//                                             </CommandGroup>
//                                         </CommandList>
//                                     </Command>
//                                 </PopoverContent>
//                             </Popover>
//                             <Select value={filters.destCity || undefined} onValueChange={(v) => updateFilters({ destCity: v })} disabled={!filters.destCountry}>
//                                 <SelectTrigger className="h-11 text-xs font-bold rounded-xl"><SelectValue placeholder="اختر مدينة" /></SelectTrigger>
//                                 <SelectContent className="rounded-xl">
//                                     {filters.destCountry && activeMarkets.find(m => m.id === filters.destCountry)?.cities.map((c: string) => (
//                                         <SelectItem key={c} value={c} className="text-xs font-bold">{getCityName(c, locale)}</SelectItem>
//                                     ))}
//                                 </SelectContent>
//                             </Select>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-dashed pt-4">
//                     <div className="space-y-1">
//                         <Label className="text-[9px] font-black text-muted-foreground uppercase">التاريخ</Label>
//                         <Popover>
//                             <PopoverTrigger asChild>
//                                 <Button variant="outline" className={cn("w-full h-10 text-[10px] font-bold bg-muted/20 rounded-xl", !filters.travelDate && "text-muted-foreground")}>
//                                     <CalendarIcon className="ml-2 h-3 w-3" /> {filters.travelDate ? format(filters.travelDate, "dd/MM/yyyy") : "اختر تاريخاً"}
//                                 </Button>
//                             </PopoverTrigger>
//                             <PopoverContent className="w-auto p-0 rounded-2xl">
//                               <CalendarPicker mode="single" selected={filters.travelDate} onSelect={(d) => updateFilters({ travelDate: d })} />
//                             </PopoverContent>
//                         </Popover>
//                     </div>
//                     <div className="space-y-1">
//                         <Label className="text-[9px] font-black text-muted-foreground uppercase">الركاب</Label>
//                         <Input type="number" value={filters.seats} onChange={e => updateFilters({ seats: parseInt(e.target.value) || 1 })} className="h-10 text-xs font-black text-center rounded-xl" min={1} />
//                     </div>
//                     <div className="space-y-1 col-span-2 md:col-span-1">
//                         <Label className="text-[9px] font-black text-muted-foreground uppercase">صنف المركبة</Label>
//                         <div className="flex gap-1">
//                             <Button variant={filters.vehicleCategory === 'any' ? 'default' : 'outline'} size="sm" className="h-10 flex-1 text-[10px] font-black rounded-xl" onClick={() => updateFilters({ vehicleCategory: 'any' })}>الكل</Button>
//                             <Button variant={filters.vehicleCategory === 'small' ? 'default' : 'outline'} size="sm" className="h-10 flex-1 text-[10px] font-black rounded-xl" onClick={() => updateFilters({ vehicleCategory: 'small' })}>صغيرة</Button>
//                             <Button variant={filters.vehicleCategory === 'bus' ? 'default' : 'outline'} size="sm" className="h-10 flex-1 text-[10px] font-black rounded-xl" onClick={() => updateFilters({ vehicleCategory: 'bus' })}>حافلة</Button>
//                         </div>
//                     </div>
//                 </div>
//             </CardContent>
//         </Card>

//         <LocalErrorBoundary fallbackTitle="تعثر محرك الاستكشاف الميداني">
//             <Tabs defaultValue="trips" className="w-full">
//                 <TabsList className="grid w-full grid-cols-2 h-14 bg-card/50 border rounded-[1.5rem] p-1 mb-4 shadow-sm">
//                     <TabsTrigger value="trips" className="font-black text-xs gap-2 rounded-2xl transition-all"><Zap className="h-4 w-4" /> رحلات مجدولة ({matchedTrips.length})</TabsTrigger>
//                     <TabsTrigger value="carriers" className="font-black text-xs gap-2 rounded-2xl transition-all"><MapPin className="h-4 w-4" /> الأسطول المتاح ({matchedCarriers.length})</TabsTrigger>
//                 </TabsList>

//                 <TabsContent value="trips" className="animate-in slide-in-from-bottom-2 duration-500 min-h-[100px]">
//                     {radarStatus === 'idle' && <div className="p-12 text-center text-xs text-muted-foreground bg-muted/10 rounded-[2.5rem] border-2 border-dashed border-primary/10">حدد مسار الرحلة لتفعيل الرادار الاستكشافي.</div>}
//                     {radarStatus === 'loading' && <div className="space-y-3">{[1, 2].map(i => <Skeleton key={i} className="h-20 w-full rounded-3xl" />)}</div>}
//                     {radarStatus === 'success' && matchedTrips.length === 0 && <div className="p-12 text-center text-xs text-muted-foreground bg-muted/10 rounded-[2.5rem] border-2 border-dashed border-primary/10">لا توجد رحلات مجدولة حالياً لهذا المسار.</div>}
//                     {radarStatus === 'success' && matchedTrips.map((trip: any) => (
//                         <Card key={trip.id} className="border-primary/10 bg-card hover:border-primary/30 transition-all rounded-3xl overflow-hidden group shadow-md mb-3">
//                             <div className="p-4 flex justify-between items-center">
//                                 <div className="space-y-1 text-right">
//                                     <span className="text-sm font-black">{trip.carrierName}</span>
//                                     <p className="text-[10px] text-muted-foreground font-bold">{formatDate(trip.departureDate, 'EEEE, d MMMM - HH:mm', locale)}</p>
//                                 </div>
//                                 <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-mono text-xs">{trip.price} {trip.currency}</Badge>
//                             </div>
//                         </Card>
//                     ))}
//                 </TabsContent>

//                 <TabsContent value="carriers" className="animate-in slide-in-from-bottom-2 duration-500 min-h-[100px]">
//                     {radarStatus === 'success' && matchedCarriers.map((carrier: any) => (
//                         <Card key={carrier.id} className="border-primary/5 bg-card/30 hover:bg-primary/5 transition-all rounded-3xl overflow-hidden shadow-sm mb-3">
//                             <div className="p-4 flex justify-between items-center">
//                                 <div className="text-right">
//                                     <p className="text-sm font-black">{carrier.officeName || carrier.firstName}</p>
//                                     <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">{carrier.vehicleType} • {carrier.vehicleCapacity} مقعد</p>
//                                 </div>
//                                 <Button size="sm" variant="ghost" className="h-9 px-4 text-[10px] font-black border-primary/10 border hover:bg-primary hover:text-black rounded-xl transition-all">تواصل</Button>
//                             </div>
//                         </Card>
//                     ))}
//                 </TabsContent>
//             </Tabs>
//         </LocalErrorBoundary>
//     </div>
//   );
// });

// SmartRadar.displayName = 'SmartRadar';

// 'use client';

// /**
//  * @component SmartRadar
//  * @description THE STERILIZED RADAR VIEW (V23.0 - DIAMOND)
//  * [PROTOCOL 16]: Dumb UI Island. Logic completely moved to useSovereignSearch.
//  * [PROTOCOL 88]: Memoized layout to prevent unnecessary redraws.
//  */

// import React, { useState, useCallback, memo } from 'react';
// import {
//     Filter, PlaneTakeoff, PlaneLanding, ChevronsUpDown, Check, Zap, MapPin, Calendar as CalendarIcon, XCircle
// } from 'lucide-react';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
// import { Calendar as CalendarPicker } from "@/components/ui/calendar";
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { LocalErrorBoundary } from '@/components/ui/local-error-boundary';
// import { format } from 'date-fns';
// import { cn, triggerHaptic } from '@/lib/utils';
// import { getCityName } from '@/lib/constants';
// import { useSovereignSearch } from '@/hooks/use-sovereign-search';
// import { formatDate } from '@/lib/formatters';
// import { Skeleton } from '@/components/ui/skeleton';
// import { useLocale } from 'next-intl';

// interface SmartRadarProps {
//     activeMarkets: any[];
// }

// export const SmartRadar = memo(({ activeMarkets }: SmartRadarProps) => {
//     const locale = useLocale();
//     const [openOrigin, setOpenOrigin] = useState(false);
//     const [openDest, setOpenDest] = useState(false);

//     const { filters, updateFilters, clearFilters, matchedTrips, matchedCarriers, radarStatus, selectedTrip, selectTrip } = useSovereignSearch();

//     const handleOriginChange = useCallback((mId: string) => {
//         updateFilters({ originCountry: mId, originCity: '' });
//         setOpenOrigin(false);
//     }, [updateFilters]);

//     const handleDestChange = useCallback((mId: string) => {
//         updateFilters({ destCountry: mId, destCity: '' });
//         setOpenDest(false);
//     }, [updateFilters]);

//     const handleClear = useCallback(() => {
//         triggerHaptic('heavy');
//         clearFilters();
//     }, [clearFilters]);

//     return (
//         <div className="space-y-4 animate-in fade-in duration-500">
//             <div className="flex items-center justify-between px-2">
//                 <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
//                     <Filter className="h-3 w-3 text-primary" /> رادار الاستكشاف الميداني
//                 </h3>
//                 {radarStatus !== 'idle' && (
//                     <button onClick={handleClear} className="text-[10px] font-black text-destructive hover:opacity-70 flex items-center gap-1 transition-all">
//                         <XCircle className="h-3 w-3" /> ترسيت الفلاتر
//                     </button>
//                 )}
//             </div>

//             <Card className="border-primary/10 bg-card/50 backdrop-blur-md rounded-[2.5rem] overflow-hidden shadow-2xl border-2">
//                 <CardContent className="p-6 space-y-4">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                             <Label className="text-[10px] font-black text-primary uppercase flex items-center gap-1">
//                                 <PlaneTakeoff className="h-3 w-3" /> نقطة الانطلاق
//                             </Label>
//                             <div className="flex flex-col gap-2">
//                                 <Popover open={openOrigin} onOpenChange={setOpenOrigin}>
//                                     <PopoverTrigger asChild>
//                                         <Button variant="outline" className="w-full justify-between h-11 bg-background text-xs font-bold border-primary/10 rounded-xl">
//                                             {filters.originCountry ? activeMarkets.find(m => m.id === filters.originCountry)?.name : "اختر دولة"}
//                                             <ChevronsUpDown className="h-3 w-3 opacity-50" />
//                                         </Button>
//                                     </PopoverTrigger>
//                                     <PopoverContent className="w-[200px] p-0 rounded-2xl" align="start">
//                                         <Command>
//                                             <CommandInput placeholder="بحث..." className="h-9 text-xs" />
//                                             <CommandList>
//                                                 <CommandEmpty>لا نتائج.</CommandEmpty>
//                                                 <CommandGroup>
//                                                     <CommandList>
//                                                         {activeMarkets.map(m => (
//                                                             <CommandItem key={m.id} onSelect={() => handleOriginChange(m.id)} className="text-xs font-bold">
//                                                                 <Check className={cn("mr-2 h-3 w-3", filters.originCountry === m.id ? "opacity-100" : "opacity-0")} /> {m.name}
//                                                             </CommandItem>
//                                                         ))}
//                                                     </CommandList>
//                                                 </CommandGroup>
//                                             </CommandList>
//                                         </Command>
//                                     </PopoverContent>
//                                 </Popover>
//                                 <Select value={filters.originCity || undefined} onValueChange={(v) => updateFilters({ originCity: v })} disabled={!filters.originCountry}>
//                                     <SelectTrigger className="h-11 text-xs font-bold rounded-xl"><SelectValue placeholder="اختر مدينة" /></SelectTrigger>
//                                     <SelectContent className="rounded-xl">
//                                         {filters.originCountry && activeMarkets.find(m => m.id === filters.originCountry)?.cities.map((c: string) => (
//                                             <SelectItem key={c} value={c} className="text-xs font-bold">{getCityName(c, locale)}</SelectItem>
//                                         ))}
//                                     </SelectContent>
//                                 </Select>
//                             </div>
//                         </div>

//                         <div className="space-y-2">
//                             <Label className="text-[10px] font-black text-primary uppercase flex items-center gap-1">
//                                 <PlaneLanding className="h-3 w-3" /> وجهة الوصول
//                             </Label>
//                             <div className="flex flex-col gap-2">
//                                 <Popover open={openDest} onOpenChange={setOpenDest}>
//                                     <PopoverTrigger asChild>
//                                         <Button variant="outline" disabled={!filters.originCountry} className="w-full justify-between h-11 bg-background text-xs font-bold border-primary/10 rounded-xl">
//                                             {filters.destCountry ? activeMarkets.find(m => m.id === filters.destCountry)?.name : "اختر دولة"}
//                                             <ChevronsUpDown className="h-3 w-3 opacity-50" />
//                                         </Button>
//                                     </PopoverTrigger>
//                                     <PopoverContent className="w-[200px] p-0 rounded-2xl" align="start">
//                                         <Command>
//                                             <CommandInput placeholder="بحث..." className="h-9 text-xs" />
//                                             <CommandList>
//                                                 <CommandEmpty>لا نتائج.</CommandEmpty>
//                                                 <CommandGroup>
//                                                     <CommandList>
//                                                         {activeMarkets.filter(m => m.id !== filters.originCountry).map(m => (
//                                                             <CommandItem key={m.id} onSelect={() => handleDestChange(m.id)} className="text-xs font-bold">
//                                                                 <Check className={cn("mr-2 h-3 w-3", filters.destCountry === m.id ? "opacity-100" : "opacity-0")} /> {m.name}
//                                                             </CommandItem>
//                                                         ))}
//                                                     </CommandList>
//                                                 </CommandGroup>
//                                             </CommandList>
//                                         </Command>
//                                     </PopoverContent>
//                                 </Popover>
//                                 <Select value={filters.destCity || undefined} onValueChange={(v) => updateFilters({ destCity: v })} disabled={!filters.destCountry}>
//                                     <SelectTrigger className="h-11 text-xs font-bold rounded-xl"><SelectValue placeholder="اختر مدينة" /></SelectTrigger>
//                                     <SelectContent className="rounded-xl">
//                                         {filters.destCountry && activeMarkets.find(m => m.id === filters.destCountry)?.cities.map((c: string) => (
//                                             <SelectItem key={c} value={c} className="text-xs font-bold">{getCityName(c, locale)}</SelectItem>
//                                         ))}
//                                     </SelectContent>
//                                 </Select>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-dashed pt-4">
//                         <div className="space-y-1">
//                             <Label className="text-[9px] font-black text-muted-foreground uppercase">التاريخ</Label>
//                             <Popover>
//                                 <PopoverTrigger asChild>
//                                     <Button variant="outline" className={cn("w-full h-10 text-[10px] font-bold bg-muted/20 rounded-xl", !filters.travelDate && "text-muted-foreground")}>
//                                         <CalendarIcon className="ml-2 h-3 w-3" /> {filters.travelDate ? format(filters.travelDate, "dd/MM/yyyy") : "اختر تاريخاً"}
//                                     </Button>
//                                 </PopoverTrigger>
//                                 <PopoverContent className="w-auto p-0 rounded-2xl">
//                                     <CalendarPicker mode="single" selected={filters.travelDate} onSelect={(d) => updateFilters({ travelDate: d })} />
//                                 </PopoverContent>
//                             </Popover>
//                         </div>
//                         <div className="space-y-1">
//                             <Label className="text-[9px] font-black text-muted-foreground uppercase">الركاب</Label>
//                             <Input type="number" value={filters.seats} onChange={e => updateFilters({ seats: parseInt(e.target.value) || 1 })} className="h-10 text-xs font-black text-center rounded-xl" min={1} />
//                         </div>
//                         <div className="space-y-1 col-span-2 md:col-span-1">
//                             <Label className="text-[9px] font-black text-muted-foreground uppercase">صنف المركبة</Label>
//                             <div className="flex gap-1">
//                                 <Button variant={filters.vehicleCategory === 'any' ? 'default' : 'outline'} size="sm" className="h-10 flex-1 text-[10px] font-black rounded-xl" onClick={() => updateFilters({ vehicleCategory: 'any' })}>الكل</Button>
//                                 <Button variant={filters.vehicleCategory === 'small' ? 'default' : 'outline'} size="sm" className="h-10 flex-1 text-[10px] font-black rounded-xl" onClick={() => updateFilters({ vehicleCategory: 'small' })}>صغيرة</Button>
//                                 <Button variant={filters.vehicleCategory === 'bus' ? 'default' : 'outline'} size="sm" className="h-10 flex-1 text-[10px] font-black rounded-xl" onClick={() => updateFilters({ vehicleCategory: 'bus' })}>حافلة</Button>
//                             </div>
//                         </div>
//                     </div>
//                 </CardContent>
//             </Card>

//             <LocalErrorBoundary fallbackTitle="تعثر محرك الاستكشاف الميداني">
//                 <Tabs defaultValue="trips" className="w-full">
//                     <TabsList className="grid w-full grid-cols-2 h-14 bg-card/50 border rounded-[1.5rem] p-1 mb-4 shadow-sm">
//                         <TabsTrigger value="trips" className="font-black text-xs gap-2 rounded-2xl transition-all"><Zap className="h-4 w-4" /> رحلات مجدولة ({matchedTrips.length})</TabsTrigger>
//                         <TabsTrigger value="carriers" className="font-black text-xs gap-2 rounded-2xl transition-all"><MapPin className="h-4 w-4" /> الأسطول المتاح ({matchedCarriers.length})</TabsTrigger>
//                     </TabsList>

//                     <TabsContent value="trips" className="animate-in slide-in-from-bottom-2 duration-500 min-h-[100px]">
//                         {radarStatus === 'idle' && <div className="p-12 text-center text-xs text-muted-foreground bg-muted/10 rounded-[2.5rem] border-2 border-dashed border-primary/10">حدد مسار الرحلة لتفعيل الرادار الاستكشافي.</div>}
//                         {radarStatus === 'loading' && <div className="space-y-3">{[1, 2].map(i => <Skeleton key={i} className="h-20 w-full rounded-3xl" />)}</div>}
//                         {radarStatus === 'success' && matchedTrips.length === 0 && <div className="p-12 text-center text-xs text-muted-foreground bg-muted/10 rounded-[2.5rem] border-2 border-dashed border-primary/10">لا توجد رحلات مجدولة حالياً لهذا المسار.</div>}
//                         {radarStatus === 'success' && matchedTrips.map((trip: any) => {
//                             const isSelected = selectedTrip?.id === trip.id;
//                             return (
//                                 <Card key={trip.id} onClick={() => selectTrip(isSelected ? null : trip)} className={cn(
//                                     "border-2 transition-all rounded-3xl overflow-hidden shadow-md mb-3 cursor-pointer",
//                                     isSelected
//                                         ? "border-primary bg-primary/10 shadow-primary/20 shadow-lg"
//                                         : "border-primary/10 bg-card hover:border-primary/30"
//                                 )}>
//                                     <div className="p-4 flex justify-between items-center gap-3">
//                                         <div className="space-y-1 text-right flex-1 min-w-0">
//                                             <span className="text-sm font-black truncate block">{trip.carrierName}</span>
//                                             <p className="text-[10px] text-muted-foreground font-bold">{formatDate(trip.departureDate, 'EEEE, d MMMM - HH:mm', locale)}</p>
//                                             <p className="text-[10px] text-muted-foreground font-bold">مقاعد متاحة: {trip.availableSeats || '—'}</p>
//                                         </div>
//                                         <div className="flex flex-col items-end gap-2 shrink-0">
//                                             <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-mono text-xs">{trip.price} {trip.currency}</Badge>
//                                             <span className={cn(
//                                                 "text-[10px] font-black px-3 py-1 rounded-xl border transition-all",
//                                                 isSelected
//                                                     ? "bg-primary text-black border-primary"
//                                                     : "bg-muted/30 text-muted-foreground border-muted"
//                                             )}>
//                                                 {isSelected ? "✓ تم الاختيار" : "اختر"}
//                                             </span>
//                                         </div>
//                                     </div>
//                                 </Card>
//                             );
//                         })}
//                     </TabsContent>

//                     <TabsContent value="carriers" className="animate-in slide-in-from-bottom-2 duration-500 min-h-[100px]">
//                         {radarStatus === 'success' && matchedCarriers.map((carrier: any) => (
//                             <Card key={carrier.id} className="border-primary/5 bg-card/30 hover:bg-primary/5 transition-all rounded-3xl overflow-hidden shadow-sm mb-3">
//                                 <div className="p-4 flex justify-between items-center">
//                                     <div className="text-right">
//                                         <p className="text-sm font-black">{carrier.officeName || carrier.firstName}</p>
//                                         <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">{carrier.vehicleType} • {carrier.vehicleCapacity} مقعد</p>
//                                     </div>
//                                     <Button size="sm" variant="ghost" className="h-9 px-4 text-[10px] font-black border-primary/10 border hover:bg-primary hover:text-black rounded-xl transition-all">تواصل</Button>
//                                 </div>
//                             </Card>
//                         ))}
//                     </TabsContent>
//                 </Tabs>
//             </LocalErrorBoundary>
//         </div>
//     );
// });

// SmartRadar.displayName = 'SmartRadar';

'use client';

/**
 * @component SmartRadar
 * @description THE STERILIZED RADAR VIEW (V23.0 - DIAMOND)
 * [PROTOCOL 16]: Dumb UI Island. Logic completely moved to useSovereignSearch.
 * [PROTOCOL 88]: Memoized layout to prevent unnecessary redraws.
 */

import React, { useState, useCallback, memo } from 'react';
import {
    Filter, PlaneTakeoff, PlaneLanding, ChevronsUpDown, Check, Zap, MapPin, Calendar as CalendarIcon, XCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LocalErrorBoundary } from '@/components/ui/local-error-boundary';
import { format } from 'date-fns';
import { cn, triggerHaptic } from '@/lib/utils';
import { getCityName } from '@/lib/constants';
import { useSovereignSearchContext } from '@/contexts/sovereign-search-context';
import { formatDate } from '@/lib/formatters';
import { Skeleton } from '@/components/ui/skeleton';
import { useLocale } from 'next-intl';

interface SmartRadarProps {
    activeMarkets: any[];
}

export const SmartRadar = memo(({ activeMarkets }: SmartRadarProps) => {
    const locale = useLocale();
    const [openOrigin, setOpenOrigin] = useState(false);
    const [openDest, setOpenDest] = useState(false);

    const { filters, updateFilters, clearFilters, matchedTrips, matchedCarriers, radarStatus, selectedTrip, selectTrip } = useSovereignSearchContext();

    const handleOriginChange = useCallback((mId: string) => {
        updateFilters({ originCountry: mId, originCity: '' });
        setOpenOrigin(false);
    }, [updateFilters]);

    const handleDestChange = useCallback((mId: string) => {
        updateFilters({ destCountry: mId, destCity: '' });
        setOpenDest(false);
    }, [updateFilters]);

    const handleClear = useCallback(() => {
        triggerHaptic('heavy');
        clearFilters();
    }, [clearFilters]);

    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                    <Filter className="h-3 w-3 text-primary" /> رادار الاستكشاف الميداني
                </h3>
                {radarStatus !== 'idle' && (
                    <button onClick={handleClear} className="text-[10px] font-black text-destructive hover:opacity-70 flex items-center gap-1 transition-all">
                        <XCircle className="h-3 w-3" /> ترسيت الفلاتر
                    </button>
                )}
            </div>

            <Card className="border-primary/10 bg-card/50 backdrop-blur-md rounded-[2.5rem] overflow-hidden shadow-2xl border-2">
                <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black text-primary uppercase flex items-center gap-1">
                                <PlaneTakeoff className="h-3 w-3" /> نقطة الانطلاق
                            </Label>
                            <div className="flex flex-col gap-2">
                                <Popover open={openOrigin} onOpenChange={setOpenOrigin}>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full justify-between h-11 bg-background text-xs font-bold border-primary/10 rounded-xl">
                                            {filters.originCountry ? activeMarkets.find(m => m.id === filters.originCountry)?.name : "اختر دولة"}
                                            <ChevronsUpDown className="h-3 w-3 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[200px] p-0 rounded-2xl" align="start">
                                        <Command>
                                            <CommandInput placeholder="بحث..." className="h-9 text-xs" />
                                            <CommandList>
                                                <CommandEmpty>لا نتائج.</CommandEmpty>
                                                <CommandGroup>
                                                    <CommandList>
                                                        {activeMarkets.map(m => (
                                                            <CommandItem key={m.id} onSelect={() => handleOriginChange(m.id)} className="text-xs font-bold">
                                                                <Check className={cn("mr-2 h-3 w-3", filters.originCountry === m.id ? "opacity-100" : "opacity-0")} /> {m.name}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandList>
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <Select value={filters.originCity || undefined} onValueChange={(v) => updateFilters({ originCity: v })} disabled={!filters.originCountry}>
                                    <SelectTrigger className="h-11 text-xs font-bold rounded-xl"><SelectValue placeholder="اختر مدينة" /></SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        {filters.originCountry && activeMarkets.find(m => m.id === filters.originCountry)?.cities.map((c: string) => (
                                            <SelectItem key={c} value={c} className="text-xs font-bold">{getCityName(c, locale)}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black text-primary uppercase flex items-center gap-1">
                                <PlaneLanding className="h-3 w-3" /> وجهة الوصول
                            </Label>
                            <div className="flex flex-col gap-2">
                                <Popover open={openDest} onOpenChange={setOpenDest}>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" disabled={!filters.originCountry} className="w-full justify-between h-11 bg-background text-xs font-bold border-primary/10 rounded-xl">
                                            {filters.destCountry ? activeMarkets.find(m => m.id === filters.destCountry)?.name : "اختر دولة"}
                                            <ChevronsUpDown className="h-3 w-3 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[200px] p-0 rounded-2xl" align="start">
                                        <Command>
                                            <CommandInput placeholder="بحث..." className="h-9 text-xs" />
                                            <CommandList>
                                                <CommandEmpty>لا نتائج.</CommandEmpty>
                                                <CommandGroup>
                                                    <CommandList>
                                                        {activeMarkets.filter(m => m.id !== filters.originCountry).map(m => (
                                                            <CommandItem key={m.id} onSelect={() => handleDestChange(m.id)} className="text-xs font-bold">
                                                                <Check className={cn("mr-2 h-3 w-3", filters.destCountry === m.id ? "opacity-100" : "opacity-0")} /> {m.name}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandList>
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <Select value={filters.destCity || undefined} onValueChange={(v) => updateFilters({ destCity: v })} disabled={!filters.destCountry}>
                                    <SelectTrigger className="h-11 text-xs font-bold rounded-xl"><SelectValue placeholder="اختر مدينة" /></SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        {filters.destCountry && activeMarkets.find(m => m.id === filters.destCountry)?.cities.map((c: string) => (
                                            <SelectItem key={c} value={c} className="text-xs font-bold">{getCityName(c, locale)}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-dashed pt-4">
                        <div className="space-y-1">
                            <Label className="text-[9px] font-black text-muted-foreground uppercase">التاريخ</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className={cn("w-full h-10 text-[10px] font-bold bg-muted/20 rounded-xl", !filters.travelDate && "text-muted-foreground")}>
                                        <CalendarIcon className="ml-2 h-3 w-3" /> {filters.travelDate ? format(filters.travelDate, "dd/MM/yyyy") : "اختر تاريخاً"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 rounded-2xl">
                                    <CalendarPicker mode="single" selected={filters.travelDate} onSelect={(d) => updateFilters({ travelDate: d })} />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[9px] font-black text-muted-foreground uppercase">الركاب</Label>
                            <Input type="number" value={filters.seats} onChange={e => updateFilters({ seats: parseInt(e.target.value) || 1 })} className="h-10 text-xs font-black text-center rounded-xl" min={1} />
                        </div>
                        <div className="space-y-1 col-span-2 md:col-span-1">
                            <Label className="text-[9px] font-black text-muted-foreground uppercase">صنف المركبة</Label>
                            <div className="flex gap-1">
                                <Button variant={filters.vehicleCategory === 'any' ? 'default' : 'outline'} size="sm" className="h-10 flex-1 text-[10px] font-black rounded-xl" onClick={() => updateFilters({ vehicleCategory: 'any' })}>الكل</Button>
                                <Button variant={filters.vehicleCategory === 'small' ? 'default' : 'outline'} size="sm" className="h-10 flex-1 text-[10px] font-black rounded-xl" onClick={() => updateFilters({ vehicleCategory: 'small' })}>صغيرة</Button>
                                <Button variant={filters.vehicleCategory === 'bus' ? 'default' : 'outline'} size="sm" className="h-10 flex-1 text-[10px] font-black rounded-xl" onClick={() => updateFilters({ vehicleCategory: 'bus' })}>حافلة</Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <LocalErrorBoundary fallbackTitle="تعثر محرك الاستكشاف الميداني">
                <Tabs defaultValue="trips" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 h-14 bg-card/50 border rounded-[1.5rem] p-1 mb-4 shadow-sm">
                        <TabsTrigger value="trips" className="font-black text-xs gap-2 rounded-2xl transition-all"><Zap className="h-4 w-4" /> رحلات مجدولة ({matchedTrips.length})</TabsTrigger>
                        <TabsTrigger value="carriers" className="font-black text-xs gap-2 rounded-2xl transition-all"><MapPin className="h-4 w-4" /> الأسطول المتاح ({matchedCarriers.length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="trips" className="animate-in slide-in-from-bottom-2 duration-500 min-h-[100px]">
                        {radarStatus === 'idle' && <div className="p-12 text-center text-xs text-muted-foreground bg-muted/10 rounded-[2.5rem] border-2 border-dashed border-primary/10">حدد مسار الرحلة لتفعيل الرادار الاستكشافي.</div>}
                        {radarStatus === 'loading' && <div className="space-y-3">{[1, 2].map(i => <Skeleton key={i} className="h-20 w-full rounded-3xl" />)}</div>}
                        {radarStatus === 'success' && matchedTrips.length === 0 && <div className="p-12 text-center text-xs text-muted-foreground bg-muted/10 rounded-[2.5rem] border-2 border-dashed border-primary/10">لا توجد رحلات مجدولة حالياً لهذا المسار.</div>}
                        {radarStatus === 'success' && matchedTrips.map((trip: any) => {
                            const isSelected = selectedTrip?.id === trip.id;
                            return (
                                <Card key={trip.id} onClick={() => selectTrip(isSelected ? null : trip)} className={cn(
                                    "border-2 transition-all rounded-3xl overflow-hidden shadow-md mb-3 cursor-pointer",
                                    isSelected
                                        ? "border-primary bg-primary/10 shadow-primary/20 shadow-lg"
                                        : "border-primary/10 bg-card hover:border-primary/30"
                                )}>
                                    <div className="p-4 flex justify-between items-center gap-3">
                                        <div className="space-y-1 text-right flex-1 min-w-0">
                                            <span className="text-sm font-black truncate block">{trip.carrierName}</span>
                                            <p className="text-[10px] text-muted-foreground font-bold">{formatDate(trip.departureDate, 'EEEE, d MMMM - HH:mm', locale)}</p>
                                            <p className="text-[10px] text-muted-foreground font-bold">مقاعد متاحة: {trip.availableSeats || '—'}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2 shrink-0">
                                            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-mono text-xs">{trip.price} {trip.currency}</Badge>
                                            <span className={cn(
                                                "text-[10px] font-black px-3 py-1 rounded-xl border transition-all",
                                                isSelected
                                                    ? "bg-primary text-black border-primary"
                                                    : "bg-muted/30 text-muted-foreground border-muted"
                                            )}>
                                                {isSelected ? "✓ تم الاختيار" : "اختر"}
                                            </span>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </TabsContent>

                    <TabsContent value="carriers" className="animate-in slide-in-from-bottom-2 duration-500 min-h-[100px]">
                        {radarStatus === 'success' && matchedCarriers.map((carrier: any) => (
                            <Card key={carrier.id} className="border-primary/5 bg-card/30 hover:bg-primary/5 transition-all rounded-3xl overflow-hidden shadow-sm mb-3">
                                <div className="p-4 flex justify-between items-center">
                                    <div className="text-right">
                                        <p className="text-sm font-black">{carrier.officeName || carrier.firstName}</p>
                                        <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">{carrier.vehicleType} • {carrier.vehicleCapacity} مقعد</p>
                                    </div>
                                    <Button size="sm" variant="ghost" className="h-9 px-4 text-[10px] font-black border-primary/10 border hover:bg-primary hover:text-black rounded-xl transition-all">تواصل</Button>
                                </div>
                            </Card>
                        ))}
                    </TabsContent>
                </Tabs>
            </LocalErrorBoundary>
        </div>
    );
});

SmartRadar.displayName = 'SmartRadar';