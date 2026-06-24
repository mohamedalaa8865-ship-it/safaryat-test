// 'use client';

// import { useState } from 'react';
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { ShieldCheck, AlertTriangle, Zap, ArrowLeft, ShieldAlert, Sparkles } from "lucide-react";
// import { useCarrierSubscription } from "@/hooks/use-carrier-subscription";
// import { Progress } from "@/components/ui/progress";
// import { TopupDialog } from "@/components/carrier/topup-dialog";
// import { useTranslations } from "next-intl";
// import type { UserProfile } from '@/lib/data';

// interface SubscriptionStatusCardProps {
//   profile?: UserProfile | null;
// }

// /**
//  * @component SubscriptionStatusCard
//  * @description THE REINFORCED SOVEREIGN SENSOR (DIAMOND STERILIZED - SC-721)
//  * [SC-721]: Passive Component. Consumes profile from parent to prevent Double Echo.
//  * Protocol 16: Sterilized. Zero internal logic, pure view.
//  * Protocol 88: Zero redundant listeners.
//  */
// export function SubscriptionStatusCard({ profile }: SubscriptionStatusCardProps) {
//   // Enforcing SSOT by passing the already available profile pulse
//   const { subscriptionState, daysRemaining, gracePeriodTotal, status, isMarketActive, marketRule } = useCarrierSubscription(profile);
//   const [isTopupOpen, setIsTopupOpen] = useState(false);

//   const t = useTranslations("subscriptionCard");

//   if (status === 'loading') return null;

//   // [SC-680] ARTERIAL BLOCK: Show critical warning if the entire sector is frozen
//   if (!isMarketActive) {
//     return (
//       <Card className="border-l-4 border-l-destructive bg-destructive/5 shadow-md mb-4 animate-in zoom-in duration-500">
//         <CardContent className="p-4 flex items-start gap-4">
//           <div className="bg-destructive/10 p-2 rounded-full">
//             <ShieldAlert className="h-6 w-6 text-destructive animate-pulse" />
//           </div>
//           <div className="space-y-1 text-right">
//             <h3 className="font-black text-sm text-destructive uppercase tracking-tighter">القطاع مجمد سيادياً</h3>
//             <p className="text-xs text-muted-foreground leading-relaxed">
//               عذراً كابتن، يخضع قطاع <strong>{marketRule?.countryName || 'الحالي'}</strong> للصيانة الجغرافية حالياً. تم تعليق قبول الطلبات الجديدة مؤقتاً.
//             </p>
//           </div>
//         </CardContent>
//       </Card>
//     );
//   }

//   const isTrial = profile?.subscriptionStatus === 'trial' || subscriptionState === 'active';

//   const progressValue =
//     gracePeriodTotal > 0
//       ? ((gracePeriodTotal - daysRemaining) / gracePeriodTotal) * 100
//       : 0;

//   const stateConfig = {
//     active: {
//       color: "green",
//       icon: isTrial ? Sparkles : ShieldCheck,
//       title: isTrial ? "فترة سماح تأسيسية" : t("active.title"),
//       message: isTrial ? "أنت في فترة الإطلاق المجاني. كافة الأرباح لك بالكامل!" : t("active.message"),
//       badge: isTrial ? "مجاني / Trial" : t("active.badge"),
//       badgeStyle: "text-green-700 bg-green-50 border-green-200"
//     },
//     warning: {
//       color: "yellow",
//       icon: AlertTriangle,
//       title: t("warning.title"),
//       message: t("warning.message"),
//       badge: t("warning.badge"),
//       badgeStyle: "text-yellow-700 bg-yellow-50 border-yellow-200"
//     },
//     expired: {
//       color: "red",
//       icon: Zap,
//       title: t("expired.title"),
//       message: t("expired.message"),
//       badge: t("expired.badge"),
//       badgeStyle: "text-red-700 bg-red-50 border-red-200"
//     }
//   } as const;

//   const config = stateConfig[subscriptionState];
//   const Icon = config.icon;

//   const borderClass =
//     subscriptionState === 'active'
//       ? 'border-l-green-500'
//       : subscriptionState === 'warning'
//         ? 'border-l-yellow-500'
//         : 'border-l-red-500';

//   const iconColorClass =
//     subscriptionState === 'active'
//       ? 'text-green-600'
//       : subscriptionState === 'warning'
//         ? 'text-yellow-600'
//         : 'text-red-600';

//   const progressColorClass =
//     subscriptionState === 'active'
//       ? '[&>div]:bg-green-500'
//       : subscriptionState === 'warning'
//         ? '[&>div]:bg-yellow-500'
//         : '[&>div]:bg-red-500';

//   return (
//     <>
//       <Card className={`border-l-4 ${borderClass} shadow-sm mb-4 transition-all duration-300`}>
//         <CardContent className="p-4 pt-4">
//           <div className="flex justify-between items-start mb-2">
//             <div className="flex flex-col gap-1 text-right">
//               <h3 className="font-bold text-foreground flex items-center justify-start gap-2 text-sm">
//                 <Icon className={`w-4 h-4 ${iconColorClass} ${isTrial ? 'animate-pulse' : ''}`} />
//                 {config.title}
//               </h3>
//               <p className="text-xs text-muted-foreground leading-relaxed max-w-[280px]">
//                 {config.message}
//               </p>
//             </div>

//             <Badge variant="outline" className={config.badgeStyle}>
//               {config.badge}
//             </Badge>
//           </div>

//           {subscriptionState !== 'expired' && (
//             <div className="space-y-1.5 mt-3">
//               <div className="flex justify-between text-xs font-medium">
//                 <span className="text-muted-foreground">
//                   {isTrial ? "صلاحية فترة السماح" : t("trialValidity")}
//                 </span>
//                 <span className={`${iconColorClass} font-bold`}>
//                   {t("daysRemaining", { days: daysRemaining })}
//                 </span>
//               </div>

//               <Progress
//                 value={progressValue}
//                 className={`h-1.5 bg-secondary ${progressColorClass}`}
//               />

//               <div className="flex justify-between items-center mt-1">
//                 <p className="text-[10px] text-muted-foreground">
//                   {t("totalDays", { total: gracePeriodTotal })}
//                 </p>
//                 {marketRule?.carrierSubscriptionFee && (
//                   <p className="text-[10px] font-black text-primary">
//                     قيمة التجديد القادم: {marketRule.carrierSubscriptionFee} {marketRule.currency}
//                   </p>
//                 )}
//               </div>
//             </div>
//           )}

//           {(subscriptionState === 'warning' || subscriptionState === 'expired') && (
//             <div className="mt-4 pt-3 border-t border-dashed">
//               <Button
//                 size="sm"
//                 className={`w-full font-bold ${subscriptionState === 'expired'
//                     ? 'bg-red-600 hover:bg-red-700'
//                     : 'bg-amber-500 hover:bg-amber-600 text-white'
//                   }`}
//                 onClick={() => setIsTopupOpen(true)}
//               >
//                 <Zap className="ml-2 h-4 w-4" />
//                 {t("renewNow")}
//                 <ArrowLeft className="mr-auto h-4 w-4 opacity-70" />
//               </Button>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       <TopupDialog
//         isOpen={isTopupOpen}
//         onOpenChange={setIsTopupOpen}
//       />
//     </>
//   );
// }

'use client';

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, AlertTriangle, Zap, ArrowLeft, ShieldAlert, Sparkles } from "lucide-react";
import { useCarrierSubscription } from "@/hooks/use-carrier-subscription";
import { Progress } from "@/components/ui/progress";
import { TopupDialog } from "@/components/carrier/topup-dialog";
import { useTranslations } from "next-intl";
import type { UserProfile } from '@/lib/data';

interface SubscriptionStatusCardProps {
  profile?: UserProfile | null;
}

/**
 * @component SubscriptionStatusCard
 * @description THE REINFORCED SOVEREIGN SENSOR (DIAMOND STERILIZED - SC-721)
 * [SC-721]: Passive Component. Consumes profile from parent to prevent Double Echo.
 * Protocol 16: Sterilized. Zero internal logic, pure view.
 * Protocol 88: Zero redundant listeners.
 */
export function SubscriptionStatusCard({ profile }: SubscriptionStatusCardProps) {
  // Enforcing SSOT by passing the already available profile pulse
  const { subscriptionState, daysRemaining, gracePeriodTotal, status, isMarketActive, marketRule } = useCarrierSubscription(profile);
  const [isTopupOpen, setIsTopupOpen] = useState(false);

  const t = useTranslations("subscriptionCard");

  if (status === 'loading') return null;

  // [SC-680] ARTERIAL BLOCK: Show critical warning if the entire sector is frozen
  if (!isMarketActive) {
    return (
      <Card className="border-l-4 border-l-destructive bg-destructive/5 shadow-md mb-4 animate-in zoom-in duration-500">
        <CardContent className="p-4 flex items-start gap-4">
          <div className="bg-destructive/10 p-2 rounded-full">
            <ShieldAlert className="h-6 w-6 text-destructive animate-pulse" />
          </div>
          <div className="space-y-1 text-right">
            <h3 className="font-black text-sm text-destructive uppercase tracking-tighter">القطاع مجمد سيادياً</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              عذراً كابتن، يخضع قطاع <strong>{marketRule?.countryName || 'الحالي'}</strong> للصيانة الجغرافية حالياً. تم تعليق قبول الطلبات الجديدة مؤقتاً.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isTrial = profile?.subscriptionStatus === 'trial' || subscriptionState === 'active';

  const progressValue =
    gracePeriodTotal > 0
      ? ((gracePeriodTotal - daysRemaining) / gracePeriodTotal) * 100
      : 0;

  const stateConfig = {
    active: {
      color: "green",
      icon: isTrial ? Sparkles : ShieldCheck,
      title: isTrial ? "فترة سماح تأسيسية" : t("active.title"),
      message: isTrial ? "أنت في فترة الإطلاق المجاني. كافة الأرباح لك بالكامل!" : t("active.message"),
      badge: isTrial ? "مجاني / Trial" : t("active.badge"),
      badgeStyle: "text-green-700 bg-green-50 border-green-200"
    },
    warning: {
      color: "yellow",
      icon: AlertTriangle,
      title: t("warning.title"),
      message: t("warning.message"),
      badge: t("warning.badge"),
      badgeStyle: "text-yellow-700 bg-yellow-50 border-yellow-200"
    },
    expired: {
      color: "red",
      icon: Zap,
      title: t("expired.title"),
      message: t("expired.message"),
      badge: t("expired.badge"),
      badgeStyle: "text-red-700 bg-red-50 border-red-200"
    }
  } as const;

  const config = stateConfig[subscriptionState];
  const Icon = config.icon;

  const borderClass =
    subscriptionState === 'active'
      ? 'border-l-green-500'
      : subscriptionState === 'warning'
        ? 'border-l-yellow-500'
        : 'border-l-red-500';

  const iconColorClass =
    subscriptionState === 'active'
      ? 'text-green-600'
      : subscriptionState === 'warning'
        ? 'text-yellow-600'
        : 'text-red-600';

  const progressColorClass =
    subscriptionState === 'active'
      ? '[&>div]:bg-green-500'
      : subscriptionState === 'warning'
        ? '[&>div]:bg-yellow-500'
        : '[&>div]:bg-red-500';

  return (
    <>
      <Card className={`border-l-4 ${borderClass} shadow-sm mb-4 transition-all duration-300`}>
        <CardContent className="p-4 pt-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex flex-col gap-1">
              <h3 className="font-bold text-foreground flex items-center gap-2 text-sm">
                <Icon className={`w-4 h-4 ${iconColorClass} ${isTrial ? 'animate-pulse' : ''}`} />
                {config.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {config.message}
              </p>
            </div>

            <Badge variant="outline" className={`shrink-0 ms-3 ${config.badgeStyle}`}>
              {config.badge}
            </Badge>
          </div>

          {subscriptionState !== 'expired' && (
            <div className="space-y-1.5 mt-3">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-muted-foreground">
                  {isTrial ? "صلاحية فترة السماح" : t("trialValidity")}
                </span>
                <span className={`${iconColorClass} font-bold`}>
                  {t("daysRemaining", { days: daysRemaining })}
                </span>
              </div>

              <Progress
                value={progressValue}
                className={`h-1.5 bg-secondary ${progressColorClass}`}
              />

              <div className="flex justify-between items-center mt-1">
                <p className="text-[10px] text-muted-foreground">
                  {t("totalDays", { total: gracePeriodTotal })}
                </p>
                {marketRule?.carrierSubscriptionFee && (
                  <p className="text-[10px] font-black text-primary">
                    قيمة التجديد القادم: {marketRule.carrierSubscriptionFee} {marketRule.currency}
                  </p>
                )}
              </div>
            </div>
          )}

          {(subscriptionState === 'warning' || subscriptionState === 'expired') && (
            <div className="mt-4 pt-3 border-t border-dashed">
              <Button
                size="sm"
                className={`w-full font-bold ${subscriptionState === 'expired'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-amber-500 hover:bg-amber-600 text-white'
                  }`}
                onClick={() => setIsTopupOpen(true)}
              >
                <Zap className="ml-2 h-4 w-4" />
                {t("renewNow")}
                <ArrowLeft className="mr-auto h-4 w-4 opacity-70" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <TopupDialog
        isOpen={isTopupOpen}
        onOpenChange={setIsTopupOpen}
      />
    </>
  );
}