// 'use client';
// import Link from 'next/link';
// import { cn } from '@/lib/utils';
// import { Logo } from '../logo';
// import { Box, Facebook, Instagram, User, type LucideIcon } from 'lucide-react';
// import { usePathname } from 'next/navigation';
// import { Badge } from '@/components/ui/badge';
// import { SheetHeader, SheetTitle, Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
// import { useState } from 'react';
// import { useTranslations } from "next-intl";
// import { Button } from '../ui/button';
// import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
// import { Booking } from '@/lib/data';
// import { collection, query, where } from 'firebase/firestore';


// interface NavLink {
//     href: string;
//     label: string;
//     icon: LucideIcon;
//     exact?: boolean;
//     count: number;
//     mobile?: boolean;
// }

// interface CarrierMobileMenuProps {
//     onLinkClick: () => void;
//     navLinks: NavLink[];
// }

// export function CarrierMobileMenu({ onLinkClick, navLinks }: CarrierMobileMenuProps) {
//     const pathname = usePathname();
//     const allLinks = [...navLinks, { href: '/carrier/profile', label: 'الملف الشخصي والإعدادات', icon: User, exact: true, count: 0, mobile: false }];
//     const [isSocialOpen, setIsSocialOpen] = useState(false);
//     const t = useTranslations("carrierLayout");

//     const { user } = useUser();
//     const firestore = useFirestore();
//     const pendingPaymentQuery = useMemoFirebase(() => {
//         if (!firestore || !user?.uid) return null;
//         return query(
//             collection(firestore, "bookings"),
//             where("carrierId", "==", user.uid),
//             where("status", "==", "Pending-Payment-Verification")
//         );
//     }, [firestore, user]);
//     const { data: pendingPaymentBookings } = useCollection<Booking>(pendingPaymentQuery);

//     const pendingPaymentCount = pendingPaymentBookings?.length || 0;

//     return (
//         <div className="flex flex-col ">
//             <SheetHeader className="px-4 border-b text-right">
//                 <Logo />
//                 <SheetTitle className="sr-only">Carrier Menu</SheetTitle>
//             </SheetHeader>
//             <nav className="flex-grow p-4">
//                 <ul className="space-y-2">
//                     {/* <li className='flex items-center gap-2 px-3'>
//                         <Box className='size-6' />
//                         <Link href="/carrier/bookings" className={pathname.startsWith("/carrier/bookings") ? "text-primary flex items-center gap-1 relative" : "text-muted-foreground flex items-center gap-1 relative"}>
//                             {t("bookings")}
//                             {pendingPaymentCount > 0 && (
//                                 <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
//                                     {pendingPaymentCount}
//                                 </span>
//                             )}
//                         </Link>
//                     </li> */}
//                     {allLinks.map(link => {
//                         const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href);
//                         return (

//                             <li key={link.href}>
//                                 <Link
//                                     href={link.href}
//                                     onClick={onLinkClick}
//                                     className={cn(
//                                         "flex items-center justify-between gap-4 rounded-lg px-4 py-3 text-lg font-semibold transition-colors hover:bg-muted/50 hover:text-primary",
//                                         isActive ? "bg-primary/10 text-primary" : "text-foreground"
//                                     )}
//                                 >
//                                     <div className="flex items-center gap-4">
//                                         <link.icon className="h-5 w-5" />
//                                         <span>{link.label}</span>
//                                     </div>
//                                     {link.count > 0 && <Badge variant="destructive" className="bg-orange-500 text-white">{link.count}</Badge>}
//                                 </Link>
//                             </li>

//                         );
//                     })}
//                     <li className='flex items-center gap-2 rounded-lg px-4 py-3 text-lg font-semibold transition-colors text-white hover:bg-muted/50 hover:text-primary"'
//                     >
//                         <Box className='size-6' />
//                         <Link href="/carrier/bookings"
//                             onClick={onLinkClick}
//                             // className='flex items-center justify-between gap-4 rounded-lg px-4 py-3 text-lg font-semibold transition-colors hover:bg-muted/50 hover:text-primary"'
//                             className={pathname.startsWith("/carrier/bookings") ? "text-white flex items-center gap-1 relative" : "text-muted-foreground flex items-center gap-1 relative"}
//                         >
//                             {t("bookings")}
//                             {pendingPaymentCount > 0 && (
//                                 <span className=" rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
//                                     {pendingPaymentCount}
//                                 </span>
//                             )}
//                         </Link>
//                     </li>
//                 </ul>

//             </nav>
//             <div className="mx-auto">
//                 <Button className="text-lg font-semibold mb-4 text-center" onClick={() => setIsSocialOpen(true)}>{t("followSocial")} </Button>
//             </div>
//             <Sheet open={isSocialOpen} onOpenChange={setIsSocialOpen}>
//                 <SheetContent side="top" className="max-w-sm mx-auto mt-12 rounded-2xl">
//                     <h3 className="text-lg font-semibold mb-4 text-center">{t("followSocial")}</h3>
//                     <div className="flex flex-col gap-4">
//                         <a href="#" className="flex items-center gap-3 p-2 rounded-lg hover:bg-black hover:text-white transition-colors"><Facebook /><span className="font-medium">Facebook</span></a>
//                         <a href="#" className="flex items-center gap-3 p-2 rounded-lg hover:bg-black hover:text-white transition-colors"><Instagram /><span className="font-medium">Instagram</span></a>
//                     </div>
//                 </SheetContent>
//             </Sheet>
//         </div>
//     );
// }

'use client';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Logo } from '../logo';
import { Box, Facebook, Instagram, User, type LucideIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { SheetHeader, SheetTitle, Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';
import { useTranslations } from "next-intl";
import { Button } from '../ui/button';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { Booking } from '@/lib/data';
import { collection, query, where } from 'firebase/firestore';

interface NavLink {
    href: string;
    label: string;
    icon: LucideIcon;
    exact?: boolean;
    count: number;
    mobile?: boolean;
}

interface CarrierMobileMenuProps {
    onLinkClick: () => void;
    navLinks: NavLink[];
}

export function CarrierMobileMenu({ onLinkClick, navLinks }: CarrierMobileMenuProps) {
    const pathname = usePathname();
    const allLinks = [...navLinks, { href: '/carrier/profile', label: 'الملف الشخصي والإعدادات', icon: User, exact: true, count: 0, mobile: false }];
    const [isSocialOpen, setIsSocialOpen] = useState(false);
    const t = useTranslations("carrierLayout");

    const { user } = useUser();
    const firestore = useFirestore();
    const pendingPaymentQuery = useMemoFirebase(() => {
        if (!firestore || !user?.uid) return null;
        return query(
            collection(firestore, "bookings"),
            where("carrierId", "==", user.uid),
            where("status", "==", "Pending-Payment-Verification")
        );
    }, [firestore, user]);
    const { data: pendingPaymentBookings } = useCollection<Booking>(pendingPaymentQuery);

    const pendingPaymentCount = pendingPaymentBookings?.length || 0;

    return (
        <div className="flex flex-col">
            <SheetHeader className="px-4 border-b text-right">
                <Logo />
                <SheetTitle className="sr-only">Carrier Menu</SheetTitle>
            </SheetHeader>
            <nav className="flex-grow p-4">
                <ul className="space-y-2">
                    {/* باقي الروابط الديناميكية */}
                    {allLinks.map(link => {
                        const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href);
                        return (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    onClick={onLinkClick}
                                    className={cn(
                                        "flex items-center justify-between gap-4 rounded-lg px-4 py-3 text-lg font-semibold transition-colors hover:bg-muted/50 hover:text-primary",
                                        isActive ? "bg-primary/10 text-primary" : "text-foreground"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <link.icon className="h-5 w-5" />
                                        <span>{link.label}</span>
                                    </div>
                                    {link.count > 0 && <Badge variant="destructive" className="bg-orange-500 text-white">{link.count}</Badge>}
                                </Link>
                            </li>
                        );
                    })}

                    {/* صندوق المهام المُعدل ليتطابق مع الاستايل */}
                    <li>
                        <Link
                            href="/carrier/bookings"
                            onClick={onLinkClick}
                            className={cn(
                                "flex items-center justify-between gap-4 rounded-lg px-4 py-3 text-lg font-semibold transition-colors hover:bg-muted/50 hover:text-primary",
                                pathname.startsWith("/carrier/bookings") ? "bg-primary/10 text-primary" : "text-foreground"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <Box className="h-5 w-5" />
                                <span>{t("bookings")}</span>
                            </div>

                            {/* إشعار الـ Pulse للطلبات المعلقة */}
                            {pendingPaymentCount > 0 && (
                                <span className="bg-red-500 text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                                    {pendingPaymentCount}
                                </span>
                            )}
                        </Link>
                    </li>
                </ul>
            </nav>

            <div className="mx-auto">
                <Button className="text-lg font-semibold mb-4 text-center" onClick={() => setIsSocialOpen(true)}>
                    {t("followSocial")}
                </Button>
            </div>

            <Sheet open={isSocialOpen} onOpenChange={setIsSocialOpen}>
                <SheetContent side="top" className="max-w-sm mx-auto mt-12 rounded-2xl">
                    <h3 className="text-lg font-semibold mb-4 text-center">{t("followSocial")}</h3>
                    <div className="flex flex-col gap-4">
                        <a href="#" className="flex items-center gap-3 p-2 rounded-lg hover:bg-black hover:text-white transition-colors">
                            <Facebook /><span className="font-medium">Facebook</span>
                        </a>
                        <a href="#" className="flex items-center gap-3 p-2 rounded-lg hover:bg-black hover:text-white transition-colors">
                            <Instagram /><span className="font-medium">Instagram</span>
                        </a>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}