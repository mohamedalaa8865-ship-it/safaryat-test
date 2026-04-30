// import { Card } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { MapPin } from "lucide-react";
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
//   const isFull = trip.availableSeats === 0;

//   return (
//     <Card className="overflow-hidden border-0 shadow-md flex flex-col h-full">
//       {/* ================= HEADER ================= */}
//       <div
//         className={cn(
//           "p-4 text-white relative",
//           trip.status === "Planned"
//             ? "bg-gradient-to-r from-blue-600 to-blue-800"
//             : trip.status === "In-Transit"
//               ? "bg-gradient-to-r from-green-600 to-green-800"
//               : "bg-gradient-to-r from-slate-700 to-slate-900",
//         )}
//       >
//         <div className="space-y-3">
//           {/* السطر العلوي: العنوان + الباج */}
//           <div className="flex justify-between items-start">
//             <h2 className="text-xl font-bold tracking-tight flex items-center gap-1.5 flex-wrap">
//               {getCityName(trip.origin, locale)}
//               <span className="text-blue-200 font-light">←</span>
//               {getCityName(trip.destination, locale)}
//             </h2>
//           </div>

//           {/* معلومات الناقل تحت العنوان */}
//           {headerAction && (
//             <div className="border-t border-white/20 pt-2">{headerAction}</div>
//           )}
//         </div>
//       </div>

//       {/* ================= BODY ================= */}
//       <div className="p-5 flex-1 bg-white dark:bg-slate-950 space-y-6">
//         {/* وقت الانطلاق */}

//         <div className="flex items-center gap-6">
//           {/* الوقت */}
//           <div>
//             <p className="text-xs text-muted-foreground">
//               {t("departureTime")}
//             </p>
//             <p className="font-semibold text-lg">
//               {formatDate(trip.departureDate, "hh:mm a", locale)}
//             </p>
//           </div>

//           {/* التاريخ */}
//           <div>
//             <p className="text-xs text-muted-foreground">
//               {t("departureDate")}
//             </p>
//             <p className="font-semibold text-sm">
//               {formatDate(trip.departureDate, "EEEE, dd MMM", locale)}
//             </p>
//           </div>
//         </div>

//         {/* المركبة والمقاعد */}
//         {!isCarrierView && (
//           <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-dashed border-muted-foreground/20">
//             <div className="flex items-center gap-3">
//               {vehicleAction}
//               <div>
//                 <p className="text-xs font-bold text-muted-foreground">
//                   {t("vehicle")}
//                 </p>
//                 <p className="text-sm font-medium">
//                   {trip.vehicleCategory === "bus" ? t("bus") : t("car")}
//                 </p>
//                 <p className="text-xs text-muted-foreground mt-1">
//                   {t("type")}: {trip.vehicleType}
//                 </p>
//               </div>
//             </div>

//             <div
//               className={cn(
//                 "px-3 py-1.5 rounded text-center min-w-[80px]",
//                 isFull
//                   ? "bg-red-100 text-red-700"
//                   : "bg-green-100 text-green-700",
//               )}
//             >
//               <p className="text-xs font-bold">{t("available")}</p>
//               <p className="text-lg font-black font-mono leading-none mt-0.5">
//                 {trip.availableSeats}
//                 <span className="text-[10px] opacity-60">
//                   {" / "}
//                   {trip.vehicleCapacity || "?"}
//                 </span>
//               </p>
//             </div>
//           </div>
//         )}

//         {/* تفاصيل إضافية */}
//         <div className="grid grid-cols-2 gap-4 text-sm">
//           <div>
//             <p className="text-xs text-muted-foreground">{t("price")}</p>
//             <p className="font-semibold">
//               {trip.price} {trip.currency}
//             </p>
//           </div>
//           <div>
//             <p className="text-xs text-muted-foreground">{t("deposit")}</p>
//             <p className="font-semibold">{trip.depositPercentage}%</p>
//           </div>

//           {!isCarrierView && (
//             <div>
//               <p className="text-xs text-muted-foreground">{t("carrier")}</p>
//               <p className="font-semibold">{trip.carrierName}</p>
//             </div>
//           )}

//           <div>
//             <p className="text-xs text-muted-foreground">{t("duration")}</p>
//             <p className="font-semibold">
//               {trip.estimatedDurationHours
//                 ? `${trip.estimatedDurationHours} ${t("hours")}`
//                 : t("notSpecified")}
//             </p>
//           </div>

//           <div>
//             <p className="text-xs text-muted-foreground">{t("stops")}</p>
//             <p className="font-semibold">{trip.numberOfStops}</p>
//           </div>
//           <div>
//             <p className="text-xs text-muted-foreground">{t("bagsPerSeat")}</p>
//             <p className="font-semibold">{trip.bagsPerSeat}</p>
//           </div>
//           <div className="col-span-2">
//             <div className="p-3 rounded-lg bg-muted/30 border border-dashed border-muted-foreground/20 flex items-start gap-3">
//               <div className="mt-0.5">
//                 <MapPin className="h-4 w-4 text-primary" />
//               </div>

//               <div className="flex-1 min-w-0">
//                 <p className="text-xs font-bold text-muted-foreground">
//                   {t("meetingPoint")}
//                 </p>

//                 <p className="font-semibold text-sm break-words">
//                   {trip.meetingPoint || t("notSpecified")}
//                 </p>

//                 {trip.meetingPointLink && (
//                   <a
//                     href={trip.meetingPointLink}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="inline-flex items-center gap-1.5 mt-2 px-3 py-2 rounded-md 
//                bg-primary/10 text-primary text-xs font-semibold
//                hover:bg-primary hover:text-white transition-all duration-200"
//                   >
//                     <MapPin className="h-3.5 w-3.5" />
//                     عرض على الخريطة
//                   </a>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {children && (
//         <div className="p-4 bg-white dark:bg-slate-900 border-t flex flex-col gap-3">
//           {children}
//         </div>
//       )}
//     </Card>
//   );
// }
'use client';

/**
 * @component TripCardBase
 * @description THE REINFORCED SOVEREIGN CHASSIS (V20.0 - LUXURY EDITION)
 * [SCR-067]: Visual reconstruction with high-contrast deep gradients and gold accents.
 * Protocol 16: Sterilized. Protocol 13: Luxury PWA interface.
 */

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
    trip.status === "Planned" ? "border-blue-500/30" :
      trip.status === "In-Transit" ? "border-green-500/30" :
        "border-primary/20";

  return (
    <Card className={cn(
      "group overflow-hidden border-2 transition-all duration-500 rounded-[2.5rem] bg-card/40 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:shadow-primary/5 hover:border-primary/40",
      statusBorder
    )}>
      {/* ================= HEADER: ROUTE & STATUS ================= */}
      <div className={cn("p-6 text-white relative border-b border-white/5", statusGradient)}>
        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
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
              <span className="text-primary/40 font-light text-xl">◄</span>
              {getCityName(trip.destination, locale)}
            </h2>
            <p className="text-[10px] font-mono text-muted-foreground tracking-widest opacity-60">REF: {trip.id.slice(-8).toUpperCase()}</p>
          </div>

          {headerAction && (
            <div className="pt-2">{headerAction}</div>
          )}
        </div>
      </div>

      {/* ================= BODY: DETAILS ================= */}
      <div className="p-6 flex-1 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5 shadow-inner">
            <p className="text-[9px] font-black text-muted-foreground uppercase flex items-center gap-1 mb-1 tracking-widest">
              <Clock className="h-3 w-3 text-primary" /> {t("departureTime")}
            </p>
            <p className="font-black text-lg text-foreground">{formatDate(trip.departureDate, "hh:mm a", locale)}</p>
          </div>
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5 shadow-inner">
            <p className="text-[9px] font-black text-muted-foreground uppercase flex items-center gap-1 mb-1 tracking-widest">
              <Clock className="h-3 w-3 text-primary" /> {t("departureDate")}
            </p>
            <p className="font-black text-sm text-foreground">{formatDate(trip.departureDate, "EEEE, dd MMM", locale)}</p>
          </div>
        </div>

        {!isCarrierView && (
          <div className="flex items-center justify-between p-4 bg-primary/5 rounded-[2rem] border border-primary/10 shadow-inner group-hover:bg-primary/10 transition-colors">
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
              "px-4 py-2 rounded-2xl text-center min-w-[90px] border shadow-lg",
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

          <div className="col-span-2">
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-start gap-4 shadow-inner relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary/20" />
              <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0 text-right">
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">{t("meetingPoint")}</p>
                <p className="font-bold text-sm text-foreground/90 leading-tight">
                  {trip.meetingPoint || t("notSpecified")}
                </p>
                {trip.meetingPointLink && (
                  <a
                    href={trip.meetingPointLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-xl bg-primary text-black text-[10px] font-black uppercase tracking-tighter hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
                  >
                    <MapPin className="h-3.5 w-3.5" />
                    عرض الموقع السيادي
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {children && (
        <div className="p-6 bg-black/20 border-t border-white/5 flex flex-col gap-4">
          {children}
        </div>
      )}
    </Card>
  );
}