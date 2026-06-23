// 'use client';

// import { useMemo } from 'react';
// import { Bell, CheckCheck, BellOff, ShieldCheck } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
// } from '@/components/ui/dropdown-menu';
// import { useNotifications } from '@/hooks/use-notifications';
// import { useRouter } from '@/i18n/routing';
// import { cn } from '@/lib/utils';
// import type { Notification } from '@/lib/data';
// import { useTranslations } from 'next-intl';
// import { useEffect } from 'react';

// const notifIcons: Record<string, string> = {
//   booking_confirmed: '✅',
//   new_booking_request: '🎟️',
//   trip_update: '✏️',
//   new_offer: '🏷️',
//   rating_request: '⭐',
//   payment_reminder: '💳',
//   group_chat_message: '💬',
//   SOVEREIGN: '🏛️',
// };

// /**
//  * @component NotificationBell
//  * @description THE REINFORCED SOVEREIGN RADAR (UI/UX - SC-707)
//  * [SC-707]: Stratified sorting. Prioritizes official alerts.
//  */
// export function NotificationBell() {
//   const { notifications, unreadCount, markAllAsRead, markOneAsRead } = useNotifications();
//   const router = useRouter();
//   const t = useTranslations('common');
//   // 🔴 إضافة هذا الكود لتحديث الشارة (Badge) على أيقونة التطبيق في الموبايل

//   useEffect(() => {
//     if (typeof navigator !== 'undefined' && 'setAppBadge' in navigator) {
//       if (unreadCount > 0) {
//         // وضع العدد على أيقونة التطبيق من الخارج
//         navigator.setAppBadge(unreadCount).catch(console.error);
//       } else {
//         // إزالة الشارة إذا كان العدد صفر
//         navigator.clearAppBadge().catch(console.error);
//       }
//     }
//   }, [unreadCount]);
//   // [SC-707] Stratified Sorting Logic: Sovereign items override time sorting
//   const sortedNotifications = useMemo(() => {
//     return [...notifications].sort((a, b) => {
//       if (a.isSovereign && !b.isSovereign) return -1;
//       if (!a.isSovereign && b.isSovereign) return 1;
//       return 0; // Maintain default Firebase time-order for same class
//     });
//   }, [notifications]);

//   const handleClick = async (notif: Notification) => {
//     await markOneAsRead(notif.id);
//     if (notif.link) router.push(notif.link);
//   };

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="ghost" size="icon" aria-label="الإشعارات" className="relative">
//           <Bell className="h-5 w-5" />
//           {unreadCount > 0 && (
//             <Badge
//               variant="destructive"
//               className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full p-0 text-[10px] animate-in zoom-in"
//             >
//               {unreadCount > 9 ? '+9' : unreadCount}
//             </Badge>
//           )}
//           <span className="sr-only">{t('notifications')}</span>
//         </Button>
//       </DropdownMenuTrigger>

//       <DropdownMenuContent align="end" className="w-80">
//         <div className="flex items-center justify-between px-3 py-2" dir="rtl">
//           <DropdownMenuLabel className="p-0 text-sm font-bold">
//             {t('notifications')} {unreadCount > 0 && <span className="text-primary">({unreadCount})</span>}
//           </DropdownMenuLabel>
//           {unreadCount > 0 && (
//             <Button
//               variant="ghost"
//               size="sm"
//               className="h-7 text-xs text-muted-foreground gap-1"
//               onClick={markAllAsRead}
//             >
//               <CheckCheck className="h-3.5 w-3.5" />
//               {t('markAllRead')}
//             </Button>
//           )}
//         </div>
//         <DropdownMenuSeparator />

//         {sortedNotifications.length === 0 ? (
//           <div className="flex flex-col items-center justify-center py-8 text-muted-foreground gap-2" dir="rtl">
//             <BellOff className="h-8 w-8 opacity-40" />
//             <p className="text-xs">{t('noNotifications')}</p>
//           </div>
//         ) : (
//           <div className="max-h-80 overflow-y-auto" dir="rtl">
//             {sortedNotifications.map(notif => (
//               <button
//                 key={notif.id}
//                 onClick={() => handleClick(notif)}
//                 className={cn(
//                   'w-full text-right px-3 py-3 hover:bg-muted/60 transition-colors border-b border-border/50 last:border-0',
//                   'flex gap-3 items-start',
//                   notif.isSovereign && 'bg-primary/10 border-primary/30 hover:bg-primary/20'
//                 )}
//               >
//                 <span className="text-lg shrink-0 mt-0.5">
//                   {notifIcons[notif.type] || '🔔'}
//                 </span>
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center gap-2 mb-0.5">
//                     <p className={cn("text-xs font-semibold leading-tight", notif.isSovereign ? "text-primary" : "text-foreground")}>
//                       {notif.title}
//                     </p>
//                     {notif.isSovereign && (
//                       <Badge variant="default" className="h-4 text-[8px] px-1 bg-primary text-primary-foreground font-black uppercase">{t('official')}</Badge>
//                     )}
//                   </div>
//                   <p className="text-xs text-muted-foreground leading-snug line-clamp-2">{notif.message}</p>
//                 </div>
//                 {!notif.isRead && (
//                   <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
//                 )}
//               </button>
//             ))}
//           </div>
//         )}
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }

'use client';

import { useMemo } from 'react';
import { Bell, CheckCheck, BellOff, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useNotifications } from '@/hooks/use-notifications';
import { useRouter } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import type { Notification } from '@/lib/data';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

const notifIcons: Record<string, string> = {
  booking_confirmed: '✅',
  new_booking_request: '🎟️',
  trip_update: '✏️',
  new_offer: '🏷️',
  rating_request: '⭐',
  payment_reminder: '💳',
  group_chat_message: '💬',
  carrier_chat_message: '💬',  // [NEW] رسالة من الناقل
  new_chat_message: '💬',
  SOVEREIGN: '🏛️',
};

/**
 * @component NotificationBell
 * @description THE REINFORCED SOVEREIGN RADAR (UI/UX - SC-707)
 * [SC-707]: Stratified sorting. Prioritizes official alerts.
 */
export function NotificationBell() {
  const { notifications, unreadCount, markAllAsRead, markOneAsRead } = useNotifications();
  const router = useRouter();
  const t = useTranslations('common');
  // 🔴 إضافة هذا الكود لتحديث الشارة (Badge) على أيقونة التطبيق في الموبايل

  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'setAppBadge' in navigator) {
      if (unreadCount > 0) {
        // وضع العدد على أيقونة التطبيق من الخارج
        navigator.setAppBadge(unreadCount).catch(console.error);
      } else {
        // إزالة الشارة إذا كان العدد صفر
        navigator.clearAppBadge().catch(console.error);
      }
    }
  }, [unreadCount]);
  // [SC-707] Stratified Sorting Logic: Sovereign items override time sorting
  const sortedNotifications = useMemo(() => {
    return [...notifications].sort((a, b) => {
      if (a.isSovereign && !b.isSovereign) return -1;
      if (!a.isSovereign && b.isSovereign) return 1;
      return 0; // Maintain default Firebase time-order for same class
    });
  }, [notifications]);

  const handleClick = async (notif: Notification) => {
    await markOneAsRead(notif.id);
    if (notif.link) router.push(notif.link);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="الإشعارات" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full p-0 text-[10px] animate-in zoom-in"
            >
              {unreadCount > 9 ? '+9' : unreadCount}
            </Badge>
          )}
          <span className="sr-only">{t('notifications')}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-3 py-2" dir="rtl">
          <DropdownMenuLabel className="p-0 text-sm font-bold">
            {t('notifications')} {unreadCount > 0 && <span className="text-primary">({unreadCount})</span>}
          </DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-muted-foreground gap-1"
              onClick={markAllAsRead}
            >
              <CheckCheck className="h-3.5 w-3.5" />
              {t('markAllRead')}
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />

        {sortedNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground gap-2" dir="rtl">
            <BellOff className="h-8 w-8 opacity-40" />
            <p className="text-xs">{t('noNotifications')}</p>
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto" dir="rtl">
            {sortedNotifications.map(notif => (
              <button
                key={notif.id}
                onClick={() => handleClick(notif)}
                className={cn(
                  'w-full text-right px-3 py-3 hover:bg-muted/60 transition-colors border-b border-border/50 last:border-0',
                  'flex gap-3 items-start',
                  notif.isSovereign && 'bg-primary/10 border-primary/30 hover:bg-primary/20'
                )}
              >
                <span className="text-lg shrink-0 mt-0.5">
                  {notifIcons[notif.type] || '🔔'}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className={cn("text-xs font-semibold leading-tight", notif.isSovereign ? "text-primary" : "text-foreground")}>
                      {notif.title}
                    </p>
                    {notif.isSovereign && (
                      <Badge variant="default" className="h-4 text-[8px] px-1 bg-primary text-primary-foreground font-black uppercase">{t('official')}</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-snug line-clamp-2">{notif.message}</p>
                </div>
                {!notif.isRead && (
                  <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
                )}
              </button>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}