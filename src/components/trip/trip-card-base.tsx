// // // 'use client';

// // // /**
// // //  * @component TripCardBase
// // //  * @description THE REINFORCED SOVEREIGN CHASSIS (V20.0 - LUXURY EDITION)
// // //  * [SCR-067]: Visual reconstruction with high-contrast deep gradients and gold accents.
// // //  * Protocol 16: Sterilized. Protocol 13: Luxury PWA interface.
// // //  */

// // // import { Card } from "@/components/ui/card";
// // // import { Badge } from "@/components/ui/badge";
// // // import { MapPin, Clock, ShieldCheck } from "lucide-react";
// // // import { getCityName } from "@/lib/constants";
// // // import { Trip } from "@/lib/data";
// // // import { cn } from "@/lib/utils";
// // // import { formatDate } from "@/lib/formatters";
// // // import { useTranslations, useLocale } from "next-intl";

// // // interface TripCardBaseProps {
// // //   trip: Trip;
// // //   children?: React.ReactNode;
// // //   headerAction?: React.ReactNode;
// // //   vehicleAction?: React.ReactNode;
// // //   isCarrierView?: boolean;
// // // }

// // // export function TripCardBase({
// // //   trip,
// // //   children,
// // //   headerAction,
// // //   vehicleAction,
// // //   isCarrierView = false,
// // // }: TripCardBaseProps) {
// // //   const t = useTranslations("trip");
// // //   const locale = useLocale();
// // //   const isFull = (trip.availableSeats || 0) === 0;

// // //   const statusGradient =
// // //     trip.status === "Planned" ? "from-blue-900/40 via-blue-800/20 to-transparent" :
// // //       trip.status === "In-Transit" ? "from-green-900/40 via-green-800/20 to-transparent" :
// // //         "from-slate-900/40 via-slate-800/20 to-transparent";

// // //   const statusBorder =
// // //     trip.status === "Planned" ? "border-blue-500/30" :
// // //       trip.status === "In-Transit" ? "border-green-500/30" :
// // //         "border-primary/20";

// // //   return (
// // //     <Card className={cn(
// // //       "group overflow-hidden border-2 transition-all duration-500 rounded-[2.5rem] bg-card/40 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:shadow-primary/5 hover:border-primary/40",
// // //       statusBorder
// // //     )}>
// // //       {/* ================= HEADER: ROUTE & STATUS ================= */}
// // //       <div className={cn("p-6 text-white relative border-b border-white/5", statusGradient)}>
// // //         <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
// // //           <MapPin className="h-24 w-24" />
// // //         </div>

// // //         <div className="space-y-4 relative z-10">
// // //           <div className="flex justify-between items-center">
// // //             <Badge variant="outline" className="bg-white/5 text-white border-white/10 text-[8px] font-black uppercase tracking-[0.2em] px-3 h-6">
// // //               {trip.status === "Planned" ? "Scheduled Mission" : "Live Pulse"}
// // //             </Badge>
// // //             <div className="flex items-center gap-1.5 text-[9px] font-black text-primary/60 uppercase tracking-widest">
// // //               <ShieldCheck className="h-3 w-3" /> SSOT Verified
// // //             </div>
// // //           </div>

// // //           <div className="flex flex-col gap-1">
// // //             <h2 className="text-2xl font-black tracking-tighter leading-none flex items-center gap-3 flex-wrap italic">
// // //               {getCityName(trip.origin, locale)}
// // //               <span className="text-primary/40 font-light text-xl">◄</span>
// // //               {getCityName(trip.destination, locale)}
// // //             </h2>
// // //             <p className="text-[10px] font-mono text-muted-foreground tracking-widest opacity-60">REF: {trip.id.slice(-8).toUpperCase()}</p>
// // //           </div>

// // //           {headerAction && (
// // //             <div className="pt-2">{headerAction}</div>
// // //           )}
// // //         </div>
// // //       </div>

// // //       {/* ================= BODY: DETAILS ================= */}
// // //       <div className="p-6 flex-1 space-y-6">
// // //         <div className="grid grid-cols-2 gap-4">
// // //           <div className="p-4 bg-white/5 rounded-2xl border border-white/5 shadow-inner">
// // //             <p className="text-[9px] font-black text-muted-foreground uppercase flex items-center gap-1 mb-1 tracking-widest">
// // //               <Clock className="h-3 w-3 text-primary" /> {t("departureTime")}
// // //             </p>
// // //             <p className="font-black text-lg text-foreground">{formatDate(trip.departureDate, "hh:mm a", locale)}</p>
// // //           </div>
// // //           <div className="p-4 bg-white/5 rounded-2xl border border-white/5 shadow-inner">
// // //             <p className="text-[9px] font-black text-muted-foreground uppercase flex items-center gap-1 mb-1 tracking-widest">
// // //               <Clock className="h-3 w-3 text-primary" /> {t("departureDate")}
// // //             </p>
// // //             <p className="font-black text-sm text-foreground">{formatDate(trip.departureDate, "EEEE, dd MMM", locale)}</p>
// // //           </div>
// // //         </div>

// // //         {!isCarrierView && (
// // //           <div className="flex items-center justify-between p-4 bg-primary/5 rounded-[2rem] border border-primary/10 shadow-inner group-hover:bg-primary/10 transition-colors">
// // //             <div className="flex items-center gap-4">
// // //               {vehicleAction || <div className="p-3 bg-black rounded-xl border border-white/5"><ShieldCheck className="h-6 w-6 text-primary" /></div>}
// // //               <div className="text-right">
// // //                 <p className="text-[9px] font-black text-primary uppercase tracking-widest">
// // //                   {t("vehicle")}
// // //                 </p>
// // //                 <p className="text-base font-black text-foreground italic">
// // //                   {trip.vehicleCategory === "bus" ? t("bus") : t("car")}
// // //                 </p>
// // //                 <p className="text-[10px] font-bold text-muted-foreground mt-0.5">
// // //                   {trip.vehicleType}
// // //                 </p>
// // //               </div>
// // //             </div>

// // //             <div className={cn(
// // //               "px-4 py-2 rounded-2xl text-center min-w-[90px] border shadow-lg",
// // //               isFull ? "bg-red-50/10 border-red-500/20 text-red-500" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
// // //             )}>
// // //               <p className="text-[9px] font-black uppercase tracking-tighter">{t("available")}</p>
// // //               <p className="text-xl font-black font-mono leading-none mt-1">
// // //                 {trip.availableSeats}
// // //                 <span className="text-[10px] opacity-40 mx-1">/</span>
// // //                 <span className="text-sm opacity-60">{trip.vehicleCapacity || "?"}</span>
// // //               </p>
// // //             </div>
// // //           </div>
// // //         )}

// // //         <div className="grid grid-cols-2 gap-6 text-sm">
// // //           <div className="space-y-1">
// // //             <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{t("price")}</p>
// // //             <div className="flex items-baseline gap-1">
// // //               <span className="font-black text-2xl text-primary tracking-tighter">{trip.price}</span>
// // //               <span className="text-[10px] font-bold text-muted-foreground">{trip.currency}</span>
// // //             </div>
// // //           </div>

// // //           <div className="space-y-1 text-left ltr">
// // //             <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">{t("duration")}</p>
// // //             <p className="font-black text-sm text-foreground text-right">
// // //               {trip.estimatedDurationHours ? `${trip.estimatedDurationHours} ${t("hours")}` : t("notSpecified")}
// // //             </p>
// // //           </div>

// // //           <div className="col-span-2">
// // //             <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-start gap-4 shadow-inner relative overflow-hidden">
// // //               <div className="absolute top-0 left-0 w-1 h-full bg-primary/20" />
// // //               <div className="flex flex-col w-full min-w-0 text-right">
// // //                 <div className="flex gap-2 items-start">
// // //                   <MapPin className="h-5 w-5 text-primary shrink-0 " />
// // //                   <p className="text-[16px] font-black text-muted-foreground uppercase tracking-widest mb-1">{t("meetingPoint")}</p>
// // //                 </div>
// // //                 <div className="flex justify-between items-center">
// // //                   <p className="font-bold text-[16px] text-foreground/90 leading-tight">
// // //                     {trip.meetingPoint || t("notSpecified")}
// // //                   </p>
// // //                   {trip.meetingPointLink && (
// // //                     <a
// // //                       href={trip.meetingPointLink}
// // //                       target="_blank"
// // //                       rel="noopener noreferrer"
// // //                       className="inline-flex items-center text-[14px] gap-2 mt-3 px-4 py-2 rounded-xl bg-primary text-black  font-black uppercase tracking-tighter hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
// // //                     >
// // //                       <MapPin className="h-3.5 w-3.5" />
// // //                       {t('location')}
// // //                     </a>
// // //                   )}

// // //                 </div>

// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {children && (
// // //         <div className="p-6 bg-black/20 border-t border-white/5 flex flex-col gap-4">
// // //           {children}
// // //         </div>
// // //       )}
// // //     </Card>
// // //   );
// // // }
// // 'use client';

// // import { Card } from "@/components/ui/card";
// // import { Badge } from "@/components/ui/badge";
// // import { MapPin, Clock, ShieldCheck } from "lucide-react";
// // import { getCityName } from "@/lib/constants";
// // import { Trip } from "@/lib/data";
// // import { cn } from "@/lib/utils";
// // import { formatDate } from "@/lib/formatters";
// // import { useTranslations, useLocale } from "next-intl";

// // interface TripCardBaseProps {
// //   trip: Trip;
// //   children?: React.ReactNode;
// //   headerAction?: React.ReactNode;
// //   vehicleAction?: React.ReactNode;
// //   isCarrierView?: boolean;
// // }

// // export function TripCardBase({
// //   trip,
// //   children,
// //   headerAction,
// //   vehicleAction,
// //   isCarrierView = false,
// // }: TripCardBaseProps) {
// //   const t = useTranslations("trip");
// //   const locale = useLocale();
// //   const isFull = (trip.availableSeats || 0) === 0;

// //   const statusGradient =
// //     trip.status === "Planned" ? "from-blue-900/40 via-blue-800/20 to-transparent" :
// //       trip.status === "In-Transit" ? "from-green-900/40 via-green-800/20 to-transparent" :
// //         "from-slate-900/40 via-slate-800/20 to-transparent";

// //   const statusBorder =
// //     trip.status === "Planned" ? "border-blue-500/30" :
// //       trip.status === "In-Transit" ? "border-green-500/30" :
// //         "border-primary/20";

// //   return (
// //     <Card className={cn(
// //       // 🚀 [PERF-FIX]: إزالة backdrop-blur-xl واستبداله بـ bg-card صلب أو شفافية بسيطة جداً
// //       // وتخفيف الظل المعقد لتقليل الـ Rendering time على الموبايل
// //       "group overflow-hidden border-2 transition-all duration-300 rounded-[2.5rem] bg-card shadow-lg hover:shadow-xl hover:border-primary/40",
// //       statusBorder
// //     )}>
// //       <div className={cn("p-6 text-white relative border-b border-white/5", statusGradient)}>
// //         <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
// //           <MapPin className="h-24 w-24" />
// //         </div>

// //         <div className="space-y-4 relative z-10">
// //           <div className="flex justify-between items-center">
// //             <Badge variant="outline" className="bg-white/5 text-white border-white/10 text-[8px] font-black uppercase tracking-[0.2em] px-3 h-6">
// //               {trip.status === "Planned" ? "Scheduled Mission" : "Live Pulse"}
// //             </Badge>
// //             <div className="flex items-center gap-1.5 text-[9px] font-black text-primary/60 uppercase tracking-widest">
// //               <ShieldCheck className="h-3 w-3" /> SSOT Verified
// //             </div>
// //           </div>

// //           <div className="flex flex-col gap-1">
// //             <h2 className="text-2xl font-black tracking-tighter leading-none flex items-center gap-3 flex-wrap italic">
// //               {getCityName(trip.origin, locale)}
// //               {/* <span className="text-primary/40 font-light text-xl">◄</span> */}
// //               <span className="text-white/70 mx-1">{locale === 'ar' ? '◄' : '►'}</span>
// //               {getCityName(trip.destination, locale)}
// //             </h2>
// //             <p className="text-[10px] font-mono text-muted-foreground tracking-widest opacity-60">REF: {trip.id.slice(-8).toUpperCase()}</p>
// //           </div>

// //           {headerAction && (
// //             <div className="pt-2">{headerAction}</div>
// //           )}
// //         </div>
// //       </div>

// //       <div className="p-6 flex-1 space-y-6">
// //         <div className="grid grid-cols-2 gap-4">
// //           <div className="p-4 bg-muted/20 rounded-2xl border border-muted/10">
// //             <p className="text-[9px] font-black text-muted-foreground uppercase flex items-center gap-1 mb-1 tracking-widest">
// //               <Clock className="h-3 w-3 text-primary" /> {t("departureTime")}
// //             </p>
// //             <p className="font-black text-lg text-foreground">{formatDate(trip.departureDate, "hh:mm a", locale)}</p>
// //           </div>
// //           <div className="p-4 bg-muted/20 rounded-2xl border border-muted/10">
// //             <p className="text-[9px] font-black text-muted-foreground uppercase flex items-center gap-1 mb-1 tracking-widest">
// //               <Clock className="h-3 w-3 text-primary" /> {t("departureDate")}
// //             </p>
// //             <p className="font-black text-sm text-foreground">{formatDate(trip.departureDate, "EEEE, dd MMM", locale)}</p>
// //           </div>
// //         </div>

// //         {!isCarrierView && (
// //           <div className="flex items-center justify-between p-4 bg-primary/5 rounded-[2rem] border border-primary/10">
// //             <div className="flex items-center gap-4">
// //               {vehicleAction || <div className="p-3 bg-black rounded-xl border border-white/5"><ShieldCheck className="h-6 w-6 text-primary" /></div>}
// //               <div className="text-right">
// //                 <p className="text-[9px] font-black text-primary uppercase tracking-widest">
// //                   {t("vehicle")}
// //                 </p>
// //                 <p className="text-base font-black text-foreground italic">
// //                   {trip.vehicleCategory === "bus" ? t("bus") : t("car")}
// //                 </p>
// //                 <p className="text-[10px] font-bold text-muted-foreground mt-0.5">
// //                   {trip.vehicleType}
// //                 </p>
// //               </div>
// //             </div>

// //             <div className={cn(
// //               "px-4 py-2 rounded-2xl text-center min-w-[90px] border shadow-sm",
// //               isFull ? "bg-red-50/10 border-red-500/20 text-red-500" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
// //             )}>
// //               <p className="text-[9px] font-black uppercase tracking-tighter">{t("available")}</p>
// //               <p className="text-xl font-black font-mono leading-none mt-1">
// //                 {trip.availableSeats}
// //                 <span className="text-[10px] opacity-40 mx-1">/</span>
// //                 <span className="text-sm opacity-60">{trip.vehicleCapacity || "?"}</span>
// //               </p>
// //             </div>
// //           </div>
// //         )}

// //         <div className="grid grid-cols-2 gap-6 text-sm">
// //           <div className="space-y-1">
// //             <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{t("price")}</p>
// //             <div className="flex items-baseline gap-1">
// //               <span className="font-black text-2xl text-primary tracking-tighter">{trip.price}</span>
// //               <span className="text-[10px] font-bold text-muted-foreground">{trip.currency}</span>
// //             </div>
// //           </div>

// //           <div className="space-y-1 text-left ltr">
// //             <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">{t("duration")}</p>
// //             <p className="font-black text-sm text-foreground text-right">
// //               {trip.estimatedDurationHours ? `${trip.estimatedDurationHours} ${t("hours")}` : t("notSpecified")}
// //             </p>
// //           </div>

// //           <div className="col-span-2">
// //             <div className="p-4 rounded-2xl bg-muted/20 border border-muted/10 flex items-start gap-4 relative overflow-hidden">
// //               <div className="absolute top-0 left-0 w-1 h-full bg-primary/50" />
// //               <div className="flex flex-col w-full min-w-0 text-right">
// //                 <div className="flex gap-2 items-start">
// //                   <MapPin className="h-5 w-5 text-primary shrink-0 " />
// //                   <p className="text-[16px] font-black text-muted-foreground uppercase tracking-widest mb-1">{t("meetingPoint")}</p>
// //                 </div>
// //                 <div className="flex justify-between items-center">
// //                   <p className="font-bold text-[16px] text-foreground/90 leading-tight">
// //                     {trip.meetingPoint || t("notSpecified")}
// //                   </p>
// //                   {trip.meetingPointLink && (
// //                     <a
// //                       href={trip.meetingPointLink}
// //                       target="_blank"
// //                       rel="noopener noreferrer"
// //                       className="inline-flex items-center text-[14px] gap-2 mt-3 px-4 py-2 rounded-xl bg-primary text-black  font-black uppercase tracking-tighter hover:scale-[1.02] active:scale-95 transition-all shadow-sm"
// //                     >
// //                       <MapPin className="h-3.5 w-3.5" />
// //                       {t('location')}
// //                     </a>
// //                   )}
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {children && (
// //         <div className="p-6 bg-muted/10 border-t border-muted/5 flex flex-col gap-4">
// //           {children}
// //         </div>
// //       )}
// //     </Card>
// //   );
// // }
// 'use client';

// import { Card } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { MapPin, Clock, ShieldCheck } from "lucide-react";
// import { getCityName } from "@/lib/constants";
// import { Trip } from "@/lib/data";
// import { cn } from "@/lib/utils";
// import { formatDate } from "@/lib/formatters";
// import { useTranslations, useLocale } from "next-intl";

// interface TripCardBaseProps {
//   trip: Trip;
//   children?: React.ReactNode;
//   headerAction?: React.ReactNode;
//   vehicleAction?: React.ReactNode;
//   isCarrierView?: boolean;
// }

// export function TripCardBase({
//   trip,
//   children,
//   headerAction,
//   vehicleAction,
//   isCarrierView = false,
// }: TripCardBaseProps) {
//   const t = useTranslations("trip");
//   const locale = useLocale();
//   const isFull = (trip.availableSeats || 0) === 0;

//   const statusGradient =
//     trip.status === "Planned" ? "from-blue-900/40 via-blue-800/20 to-transparent" :
//       trip.status === "In-Transit" ? "from-green-900/40 via-green-800/20 to-transparent" :
//         "from-slate-900/40 via-slate-800/20 to-transparent";

//   const statusBorder =
//     trip.status === "Planned" ? "border-blue-500/30" :
//       trip.status === "In-Transit" ? "border-green-500/30" :
//         "border-primary/20";

//   return (
//     <Card className={cn(
//       // 🚀 [PERF-FIX]: إزالة backdrop-blur-xl واستبداله بـ bg-card صلب أو شفافية بسيطة جداً
//       // وتخفيف الظل المعقد لتقليل الـ Rendering time على الموبايل
//       "group overflow-hidden border-2 transition-all duration-300 rounded-[2.5rem] bg-card shadow-lg hover:shadow-xl hover:border-primary/40",
//       statusBorder
//     )}>
//       <div className={cn("p-6 text-white relative border-b border-white/5", statusGradient)}>
//         <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
//           <MapPin className="h-24 w-24" />
//         </div>

//         <div className="space-y-4 relative z-10">
//           <div className="flex justify-between items-center">
//             <Badge variant="outline" className="bg-white/5 text-white border-white/10 text-[8px] font-black uppercase tracking-[0.2em] px-3 h-6">
//               {trip.status === "Planned" ? "Scheduled Mission" : "Live Pulse"}
//             </Badge>
//             <div className="flex items-center gap-1.5 text-[9px] font-black text-primary/60 uppercase tracking-widest">
//               <ShieldCheck className="h-3 w-3" /> SSOT Verified
//             </div>
//           </div>

//           <div className="flex flex-col gap-1">
//             <h2 className="text-2xl font-black tracking-tighter leading-none flex items-center gap-3 flex-wrap italic">
//               {getCityName(trip.origin, locale)}
//               {/* <span className="text-primary/40 font-light text-xl">◄</span> */}
//               <span className="text-white/70 mx-1">{locale === 'ar' ? '◄' : '►'}</span>
//               {getCityName(trip.destination, locale)}
//             </h2>
//             <p className="text-[10px] font-mono text-muted-foreground tracking-widest opacity-60">REF: {trip.id.slice(-8).toUpperCase()}</p>
//           </div>

//           {headerAction && (
//             <div className="pt-2">{headerAction}</div>
//           )}
//         </div>
//       </div>

//       <div className="p-6 flex-1 space-y-6">
//         <div className="grid grid-cols-2 gap-4">
//           <div className="p-4 bg-muted/20 rounded-2xl border border-[#AE9E6D]">
//             <p className="text-[9px] font-black text-muted-foreground uppercase flex items-center gap-1 mb-1 tracking-widest">
//               <Clock className="h-3 w-3 text-primary" /> {t("departureTime")}
//             </p>
//             <p className="font-black text-lg text-foreground">{formatDate(trip.departureDate, "hh:mm a", locale)}</p>
//           </div>
//           <div className="p-4 bg-muted/20 rounded-2xl border border-[#AE9E6D]">
//             <p className="text-[9px] font-black text-muted-foreground uppercase flex items-center gap-1 mb-1 tracking-widest">
//               <Clock className="h-3 w-3 text-primary" /> {t("departureDate")}
//             </p>
//             <p className="font-black text-sm text-foreground">{formatDate(trip.departureDate, "EEEE, dd MMM", locale)}</p>
//           </div>
//         </div>

//         {!isCarrierView && (
//           <div className="flex items-center justify-between p-4 bg-primary/5 rounded-[2rem] border border-[#AE9E6D]">
//             <div className="flex items-center gap-4">
//               {vehicleAction || <div className="p-3 bg-black rounded-xl border border-white/5"><ShieldCheck className="h-6 w-6 text-primary" /></div>}
//               <div className="text-right">
//                 <p className="text-[9px] font-black text-primary uppercase tracking-widest">
//                   {t("vehicle")}
//                 </p>
//                 <p className="text-base font-black text-foreground italic">
//                   {trip.vehicleCategory === "bus" ? t("bus") : t("car")}
//                 </p>
//                 <p className="text-[10px] font-bold text-muted-foreground mt-0.5">
//                   {trip.vehicleType}
//                 </p>
//               </div>
//             </div>

//             <div className={cn(
//               "px-4 py-2 rounded-2xl text-center min-w-[90px] border shadow-sm ",
//               isFull ? "bg-red-50/10 border-red-500/20 text-red-500" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
//             )}>
//               <p className="text-[9px] font-black uppercase tracking-tighter">{t("available")}</p>
//               <p className="text-xl font-black font-mono leading-none mt-1">
//                 {trip.availableSeats}
//                 <span className="text-[10px] opacity-40 mx-1">/</span>
//                 <span className="text-sm opacity-60">{trip.vehicleCapacity || "?"}</span>
//               </p>
//             </div>
//           </div>
//         )}

//         <div className="grid grid-cols-2 gap-6 text-sm">
//           <div className="space-y-1">
//             <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{t("price")}</p>
//             <div className="flex items-baseline gap-1">
//               <span className="font-black text-2xl text-primary tracking-tighter">{trip.price}</span>
//               <span className="text-[10px] font-bold text-muted-foreground">{trip.currency}</span>
//             </div>
//             {trip.excessWeightFee != null && trip.excessWeightFee > 0 && (
//               <div className="flex justify-between">
//                 <div className="text-[#BFAF78]">
//                   <p>ألوزن الزائد</p>
//                 </div>
//                 <div className="flex items-center gap-1 mt-0.5">
//                   <span className="text-sm">⚖️</span>
//                   <span className="text-sm font-bold text-orange-400">
//                     +{trip.excessWeightFee} {trip.currency || 'د.أ'}/كغ
//                   </span>
//                 </div>
//               </div>

//             )}
//           </div>

//           <div className="space-y-1 text-left ltr">
//             <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">{t("duration")}</p>
//             <p className="font-black text-sm text-foreground text-right">
//               {trip.estimatedDurationHours ? `${trip.estimatedDurationHours} ${t("hours")}` : t("notSpecified")}
//             </p>
//           </div>

//           <div className="col-span-2">
//             <div className="p-4 rounded-2xl bg-muted/20 border border-[#AE9E6D] flex items-start gap-4 relative overflow-hidden">
//               <div className="absolute top-0 left-0 w-1 h-full bg-primary/50" />
//               <div className="flex flex-col w-full min-w-0 text-right">
//                 <div className="flex gap-2 items-start">
//                   <MapPin className="h-5 w-5 text-primary shrink-0 " />
//                   <p className="text-[16px] font-black text-muted-foreground uppercase tracking-widest mb-1">{t("meetingPoint")}</p>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <p className="font-bold text-[16px] text-foreground/90 leading-tight">
//                     {trip.meetingPoint || t("notSpecified")}
//                   </p>
//                   {trip.meetingPointLink && (
//                     <a
//                       href={trip.meetingPointLink}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="inline-flex items-center text-[14px] gap-2 mt-3 px-4 py-2 rounded-xl bg-primary text-black  font-black uppercase tracking-tighter hover:scale-[1.02] active:scale-95 transition-all shadow-sm"
//                     >
//                       <MapPin className="h-3.5 w-3.5" />
//                       {t('location')}
//                     </a>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {children && (
//         <div className="p-6 bg-muted/10 border-t border-muted/5 flex flex-col gap-4">
//           {children}
//         </div>
//       )}
//     </Card>
//   );
// }

'use client';

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, ShieldCheck } from "lucide-react";
import { getCityName } from "@/lib/constants";
import { Trip } from "@/lib/data";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/formatters";
import { useTranslations, useLocale } from "next-intl";

interface TripCardBaseProps {
  trip: Trip;
  children?: React.ReactNode;
  headerAction?: React.ReactNode;
  vehicleAction?: React.ReactNode;
  isCarrierView?: boolean;
}

export function TripCardBase({
  trip,
  children,
  headerAction,
  vehicleAction,
  isCarrierView = false,
}: TripCardBaseProps) {
  const t = useTranslations("trip");
  const locale = useLocale();
  const isFull = (trip.availableSeats || 0) === 0;

  const statusGradient =
    trip.status === "Planned" ? "from-blue-900/40 via-blue-800/20 to-transparent" :
      trip.status === "In-Transit" ? "from-green-900/40 via-green-800/20 to-transparent" :
        "from-slate-900/40 via-slate-800/20 to-transparent";

  const statusBorder =
    trip.status === "Planned" ? "border-[#31747D]" :
      trip.status === "In-Transit" ? "border-green-500/30" :
        "border-primary/20";

  return (
    <Card className={cn(
      // 🚀 [PERF-FIX]: إزالة backdrop-blur-xl واستبداله بـ bg-card صلب أو شفافية بسيطة جداً
      // وتخفيف الظل المعقد لتقليل الـ Rendering time على الموبايل
      "group overflow-hidden  border-2 border-[#307380] transition-all duration-300  rounded-[2.5rem] bg-card shadow-lg hover:shadow-xl hover:border-primary/50",
      statusBorder
    )}>
      <div className={cn("p-6 text-white relative border-b border-white/5", statusGradient)}>
        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
          <MapPin className="h-24 w-24" />
        </div>

        <div className="space-y-4 relative z-10">
          <div className="flex justify-between items-center">
            <Badge variant="outline" className="bg-white/5 text-white border-white/10 text-[8px] font-black uppercase tracking-[0.2em] px-3 h-6">
              {trip.status === "Planned" ? "Scheduled Mission" : "Live Pulse"}
            </Badge>
            <div className="flex items-center gap-1.5 text-[9px] font-black text-primary/60 uppercase tracking-widest">
              <ShieldCheck className="h-3 w-3" /> SSOT Verified
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-black tracking-tighter leading-none flex items-center gap-3 flex-wrap italic">
              {getCityName(trip.origin, locale)}
              {/* <span className="text-primary/40 font-light text-xl">◄</span> */}
              <span className="text-white/70 mx-1">{locale === 'ar' ? '◄' : '►'}</span>
              {getCityName(trip.destination, locale)}
            </h2>
            <p className="text-[10px] font-mono text-muted-foreground tracking-widest opacity-60">REF: {trip.id.slice(-8).toUpperCase()}</p>
          </div>

          {headerAction && (
            <div className="pt-2">{headerAction}</div>
          )}
        </div>
      </div>

      <div className="p-6 flex-1 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-muted/20 rounded-2xl border border-[#AE9E6D]">
            <p className="text-[9px] font-black text-muted-foreground uppercase flex items-center gap-1 mb-1 tracking-widest">
              <Clock className="h-3 w-3 text-primary" /> {t("departureTime")}
            </p>
            <p className="font-black text-lg text-foreground">{formatDate(trip.departureDate, "hh:mm a", locale)}</p>
          </div>
          <div className="p-4 bg-muted/20 rounded-2xl border border-[#AE9E6D]">
            <p className="text-[9px] font-black text-muted-foreground uppercase flex items-center gap-1 mb-1 tracking-widest">
              <Clock className="h-3 w-3 text-primary" /> {t("departureDate")}
            </p>
            <p className="font-black text-sm text-foreground">{formatDate(trip.departureDate, "EEEE, dd MMM", locale)}</p>
          </div>
        </div>

        {!isCarrierView && (
          <div className="flex items-center justify-between p-4 bg-primary/5 rounded-[2rem] border border-[#AE9E6D]">
            <div className="flex items-center gap-4">
              {vehicleAction || <div className="p-3 bg-black rounded-xl border border-white/5"><ShieldCheck className="h-6 w-6 text-primary" /></div>}
              <div className="text-right">
                <p className="text-[9px] font-black text-primary uppercase tracking-widest">
                  {t("vehicle")}
                </p>
                <p className="text-base font-black text-foreground italic">
                  {trip.vehicleCategory === "bus" ? t("bus") : t("car")}
                </p>
                <p className="text-[10px] font-bold text-muted-foreground mt-0.5">
                  {trip.vehicleType}
                </p>
              </div>
            </div>

            <div className={cn(
              "px-4 py-2 rounded-2xl text-center min-w-[90px] border shadow-sm ",
              isFull ? "bg-red-50/10 border-red-500/20 text-red-500" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
            )}>
              <p className="text-[9px] font-black uppercase tracking-tighter">{t("available")}</p>
              <p className="text-xl font-black font-mono leading-none mt-1">
                {trip.availableSeats}
                <span className="text-[10px] opacity-40 mx-1">/</span>
                <span className="text-sm opacity-60">{trip.vehicleCapacity || "?"}</span>
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-6 text-sm">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{t("price")}</p>
            <div className="flex items-baseline gap-1">
              <span className="font-black text-2xl text-primary tracking-tighter">{trip.price}</span>
              <span className="text-[10px] font-bold text-muted-foreground">{trip.currency}</span>
            </div>
          </div>


          <div className="space-y-1 text-left ltr">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">{t("duration")}</p>
            <p className="font-black text-sm text-foreground text-right">
              {trip.estimatedDurationHours ? `${trip.estimatedDurationHours} ${t("hours")}` : t("notSpecified")}
            </p>
          </div>
          <div className="col-span-2  ">
            {trip.excessWeightFee != null && trip.excessWeightFee > 0 && (
              <div className="flex justify-between">
                <div className="text-[#BFAF78]">
                  <p>ألوزن الزائد</p>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-sm">⚖️</span>
                  <span className="text-sm font-bold text-orange-400">
                    +{trip.excessWeightFee} {trip.currency || 'د.أ'}/كغ
                  </span>
                </div>
              </div>
            )}
            {trip.conditions && (
              <div className="flex justify-between pt-1 border-t border-amber-500/20 mt-1">
                <div className="text-[#BFAF78]">
                  <p>شروط الرحلة</p>
                </div>
                <div className="flex items-center gap-1 mt-0.5 text-right max-w-[60%]">
                  <span className="text-sm">⚠️</span>
                  <span className="text-xs font-bold text-amber-400 leading-tight">
                    {trip.conditions}
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="col-span-2">
            <div className="p-4 rounded-2xl bg-muted/20 border border-[#AE9E6D] flex items-start gap-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary/50" />
              <div className="flex flex-col w-full min-w-0 text-right">
                <div className="flex gap-2 items-start">
                  <MapPin className="h-5 w-5 text-primary shrink-0 " />
                  <p className="text-[16px] font-black text-muted-foreground uppercase tracking-widest mb-1">{t("meetingPoint")}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-bold text-[16px] text-foreground/90 leading-tight">
                    {trip.meetingPoint || t("notSpecified")}
                  </p>
                  {trip.meetingPointLink && (
                    <a
                      href={trip.meetingPointLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-[14px] gap-2 mt-3 px-4 py-2 rounded-xl bg-primary text-black  font-black uppercase tracking-tighter hover:scale-[1.02] active:scale-95 transition-all shadow-sm"
                    >
                      <MapPin className="h-3.5 w-3.5" />
                      {t('location')}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {children && (
        <div className="p-6 bg-muted/10 border-t border-muted/5 flex flex-col gap-4">
          {children}
        </div>
      )}
    </Card>
  );
}