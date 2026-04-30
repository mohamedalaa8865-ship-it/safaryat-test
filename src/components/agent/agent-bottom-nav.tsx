// 'use client';

// /**
//  * @component AgentBottomNav
//  * @description الناف بار السفلي المخصص للوكيل — V2 FIXED
//  * - الشات بيروح على /agent/chat (شات الوكيل مع الأدمن)
//  * - إدارة الحجز /agent/cockpit
//  * - isActive صح بدون تعارض بين /agent و /agent/cockpit
//  */

// import { usePathname } from 'next/navigation';
// import { Link } from '@/i18n/routing';
// import { Cloud, Settings, MessageSquare } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { useFirestore, useUser, useMemoFirebase, useCollection } from '@/firebase';
// import { collection, query, where, orderBy, limit } from 'firebase/firestore';

// // عدد الرسائل الغير مقروءة في شات الوكيل مع الأدمن
// function useAgentUnreadCount() {
//     const firestore = useFirestore();
//     const { user } = useUser();

//     const msgsQuery = useMemoFirebase(() => {
//         if (!firestore || !user) return null;
//         return query(
//             collection(firestore, 'agent_approval_chats', user.uid, 'messages'),
//             where('senderId', '!=', user.uid),
//             orderBy('senderId'),
//             orderBy('timestamp', 'desc'),
//             limit(20)
//         );
//     }, [firestore, user]);

//     const { data: msgs } = useCollection(msgsQuery);

//     // رسائل الأدمن اللي ما فيهاش isRead
//     return (msgs || []).filter((m: any) => !m.isRead).length;
// }

// export function AgentBottomNav() {
//     const pathname = usePathname();
//     const unreadCount = useAgentUnreadCount();

//     // دالة صح للـ active state بدون تعارض
//     const isActive = (href: string) => {
//         // استخرج الجزء بعد الـ locale
//         const segments = pathname.split('/').filter(Boolean);
//         // ابعد أول segment لو كان locale (ar/en)
//         const withoutLocale = segments.length > 1 && segments[0].length === 2
//             ? '/' + segments.slice(1).join('/')
//             : pathname;

//         if (href === '/agent') return withoutLocale === '/agent';
//         return withoutLocale.startsWith(href);
//     };

//     const navItems = [
//         { href: '/agent', label: 'لوحة التحكم', icon: Cloud },
//         { href: '/agent/cockpit', label: 'إدارة الحجز', icon: Settings },
//         { href: '/agent/chat', label: 'الرسائل', icon: MessageSquare, badge: unreadCount },
//     ];

//     return (
//         <nav
//             className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 py-2 border-t"
//             style={{
//                 background: 'hsl(var(--background))',
//                 borderColor: 'hsl(var(--border))',
//                 paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom))',
//             }}
//             dir="rtl"
//         >
//             {navItems.map((item) => {
//                 const active = isActive(item.href);
//                 const Icon = item.icon;

//                 return (
//                     <Link
//                         key={item.href}
//                         href={item.href as any}
//                         className={cn(
//                             'relative flex flex-col items-center gap-1 px-5 py-2 rounded-2xl transition-all duration-200 min-w-[64px]',
//                             active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
//                         )}
//                     >
//                         {active && (
//                             <span className="absolute inset-0 rounded-2xl bg-primary/10 border border-primary/20" />
//                         )}
//                         <span className="relative">
//                             <Icon className={cn('h-5 w-5 transition-all duration-200', active ? 'scale-110' : 'scale-100')} />
//                             {item.badge != null && item.badge > 0 && (
//                                 <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[9px] font-black flex items-center justify-center leading-none">
//                                     {item.badge > 9 ? '9+' : item.badge}
//                                 </span>
//                             )}
//                         </span>
//                         <span className={cn('text-[10px] font-black tracking-tight transition-all duration-200', active ? 'opacity-100' : 'opacity-60')}>
//                             {item.label}
//                         </span>
//                     </Link>
//                 );
//             })}
//         </nav>
//     );
// }
'use client';

/**
 * @component AgentBottomNav
 * @description الناف بار السفلي المخصص للوكيل — V2 FIXED
 * - الشات بيروح على /agent/chat (شات الوكيل مع الأدمن)
 * - إدارة الحجز /agent/cockpit
 * - isActive صح بدون تعارض بين /agent و /agent/cockpit
 */

import { usePathname } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { Cloud, Settings, MessageSquare, ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFirestore, useUser, useMemoFirebase, useCollection } from '@/firebase';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';

// عدد الرسائل الغير مقروءة في شات الوكيل مع الأدمن
function useAgentUnreadCount() {
    const firestore = useFirestore();
    const { user } = useUser();

    const msgsQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return query(
            collection(firestore, 'agent_approval_chats', user.uid, 'messages'),
            where('senderId', '!=', user.uid),
            orderBy('senderId'),
            orderBy('timestamp', 'desc'),
            limit(20)
        );
    }, [firestore, user]);

    const { data: msgs } = useCollection(msgsQuery);

    // رسائل الأدمن اللي ما فيهاش isRead
    return (msgs || []).filter((m: any) => !m.isRead).length;
}

export function AgentBottomNav() {
    const pathname = usePathname();
    const unreadCount = useAgentUnreadCount();

    // دالة صح للـ active state بدون تعارض
    const isActive = (href: string) => {
        // استخرج الجزء بعد الـ locale
        const segments = pathname.split('/').filter(Boolean);
        // ابعد أول segment لو كان locale (ar/en)
        const withoutLocale = segments.length > 1 && segments[0].length === 2
            ? '/' + segments.slice(1).join('/')
            : pathname;

        if (href === '/agent') return withoutLocale === '/agent';
        return withoutLocale.startsWith(href);
    };

    const navItems = [
        { href: '/agent', label: 'لوحة التحكم', icon: Cloud },
        { href: '/agent/bookings', label: 'الحجوزات', icon: ClipboardList },
        { href: '/agent/cockpit', label: 'الإعدادات', icon: Settings },
        { href: '/agent/chat', label: 'الرسائل', icon: MessageSquare, badge: unreadCount },
    ];

    return (
        <nav
            className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 py-2 border-t"
            style={{
                background: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
                paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom))',
            }}
            dir="rtl"
        >
            {navItems.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;

                return (
                    <Link
                        key={item.href}
                        href={item.href as any}
                        className={cn(
                            'relative flex flex-col items-center gap-1 px-5 py-2 rounded-2xl transition-all duration-200 min-w-[64px]',
                            active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                        )}
                    >
                        {active && (
                            <span className="absolute inset-0 rounded-2xl bg-primary/10 border border-primary/20" />
                        )}
                        <span className="relative">
                            <Icon className={cn('h-5 w-5 transition-all duration-200', active ? 'scale-110' : 'scale-100')} />
                            {item.badge != null && item.badge > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[9px] font-black flex items-center justify-center leading-none">
                                    {item.badge > 9 ? '9+' : item.badge}
                                </span>
                            )}
                        </span>
                        <span className={cn('text-[10px] font-black tracking-tight transition-all duration-200', active ? 'opacity-100' : 'opacity-60')}>
                            {item.label}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}