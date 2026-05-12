// "use client";

// import { useMemo, useState } from "react";
// import { Link, usePathname } from "@/i18n/routing";
// import { useAuth, useCollection, useFirestore, useMemoFirebase, useUser } from "@/firebase";
// import { signOut } from "firebase/auth";
// import { useTranslations, useLocale } from "next-intl";
// import {
//   LayoutDashboard,
//   Map,
//   List,
//   MessageSquare,
//   Menu,
//   Archive,
//   ListChecks,
//   ClipboardList,
//   Facebook,
//   Instagram,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { CarrierMobileMenu } from "@/components/carrier/carrier-mobile-menu";
// import { CarrierBottomNav } from "@/components/carrier/carrier-bottom-nav";
// import { NotificationBell } from "@/components/notification-bell";
// import { AddTripDialog } from "@/components/carrier/add-trip-dialog";
// import { useToast } from "@/hooks/use-toast";
// import { useUnreadChats } from "@/hooks/use-unread-chats";
// import Image from "next/image";
// import { LanguageSwitcher } from "@/components/language-switcher";
// import { useUserProfile } from "@/hooks/use-user-profile";
// import { useCarrierSubscription } from "@/hooks/use-carrier-subscription";
// import { Trip } from "@/lib/data";
// import { collection, query, where } from "firebase/firestore";
// import { Booking } from "@/lib/data";

// /**
//  * @layout CarrierLayout
//  * @description THE ARTERIAL DISPATCHER (SC-686-SSOT)
//  * [SC-686]: Eradicated "Double Echo" by becoming the primary data pulse.
//  * Prop-drills identity and subscription state to children.
//  */
// export default function CarrierLayout({ children }: { children: React.ReactNode }) {
//   const { profile, isEngaged, engagementType, isLoading: isProfileLoading } = useUserProfile();

//   // [SC-686] SSOT: Passing profile to subscription hook to avoid secondary listener
//   const { isMarketActive, marketRule } = useCarrierSubscription(profile);

//   const auth = useAuth();
//   const pathname = usePathname();
//   const { toast } = useToast();
//   const t = useTranslations("carrierLayout");
//   const locale = useLocale();

//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isAddTripOpen, setIsAddTripOpen] = useState(false);
//   const [isSocialOpen, setIsSocialOpen] = useState(false);

//   const unreadChatsCount = useUnreadChats();

//   const { user } = useUser();
//   const firestore = useFirestore();

//   const activeTripQuery = useMemoFirebase(() => {
//     if (!firestore || !user?.uid) return null;
//     return query(
//       collection(firestore, 'trips'),
//       where('carrierId', '==', user.uid),
//       where('status', 'in', ['Planned', 'In-Transit', 'Has_Offers', 'Negotiating', 'Pending-Carrier-Confirmation'])
//     );
//   }, [firestore, user]);

//   const { data: activeTrips } = useCollection<Trip>(activeTripQuery);

//   const hasActiveTrip = useMemo(() => {
//     if (!activeTrips || activeTrips.length === 0) return false;
//     return activeTrips.some(trip => {
//       const depDate = (trip.departureDate as any)?.toDate?.()
//         ? (trip.departureDate as any).toDate()
//         : new Date(trip.departureDate || 0);
//       const durationHours = (trip as any).estimatedDurationHours || 0;
//       const endDate = new Date(depDate.getTime() + durationHours * 60 * 60 * 1000);
//       return endDate > new Date();
//     });
//   }, [activeTrips]);

//   // 🔴 عدد الحجوزات اللي المسافر دفع عربونها وبتنتظر تأكيد الناقل
//   const pendingPaymentQuery = useMemoFirebase(() => {
//     if (!firestore || !user?.uid) return null;
//     return query(
//       collection(firestore, "bookings"),
//       where("carrierId", "==", user.uid),
//       where("status", "==", "Pending-Payment-Verification")
//     );
//   }, [firestore, user]);

//   const { data: pendingPaymentBookings } = useCollection<Booking>(pendingPaymentQuery);
//   const pendingPaymentCount = pendingPaymentBookings?.length || 0;

//   const handleAddTripClick = () => {
//     if (!isMarketActive) {
//       toast({
//         variant: "destructive",
//         title: "العمليات متوقفة",
//         description: `عذراً، قطاع ${marketRule?.countryName || ''} مجمد حالياً للصيانة الإدارية.`
//       });
//       return;
//     }

//     if (hasActiveTrip) {
//       toast({ variant: "destructive", title: t("activeTrip"), description: t("activeTripDesc") });
//     } else {
//       setIsAddTripOpen(true);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       if (auth) await signOut(auth);
//       document.cookie = `__session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure`;
//       window.location.href = `/${locale}/login`;
//     } catch (error) {
//       console.error("[Sovereign Auth] Logout failure:", error);
//     }
//   };

//   const navLinks = [
//     { href: "/carrier", label: t("command"), icon: LayoutDashboard, exact: true, count: 0, mobile: true },
//     { href: "/carrier/chats", label: t("messages"), icon: MessageSquare, exact: false, count: unreadChatsCount, mobile: true },
//     // { href: "/carrier/bookings", label: t("bookings"), icon: ClipboardList, exact: false, count: pendingPaymentCount, mobile: false },
//     { href: "/carrier/trips", label: t("myTrips"), icon: List, exact: false, count: 0 },
//     { href: "/carrier/archive", label: t("archive"), icon: Archive, exact: true, count: 0 },
//     { href: "/carrier/Permanent", label: t("permanentConditions"), icon: ListChecks, exact: true, count: 0 },
//   ];

//   if (isProfileLoading) return null;

//   return (
//     <div className="flex min-h-screen flex-col bg-background">
//       <header className="fixed top-0 left-0 right-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//         <div className="container flex h-16 items-center justify-between px-4">
//           <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
//             <SheetTrigger asChild>
//               <Button variant="ghost" size="icon" className="md:hidden">
//                 <Menu className="h-5 w-5" />
//               </Button>
//             </SheetTrigger>
//             <SheetContent side={locale === "ar" ? "right" : "left"} className="p-0">
//               <CarrierMobileMenu onLinkClick={() => setIsSidebarOpen(false)} navLinks={navLinks} />
//             </SheetContent>
//           </Sheet>

//           <div className="flex items-center gap-2 ">
//             <Image
//               src="/logo.png"
//               alt="Safar Gate"
//               width={150}

//               height={150}
//               style={{ height: 'auto' }}
//               priority
//               className="w-[110px] md:w-[150px] mt-5"
//             />
//           </div>

//           <nav className="hidden md:flex items-center gap-6 text-sm font-medium ">
//             {navLinks.filter(l => !l.mobile).map(link => (
//               <Link key={link.href} href={link.href} className={pathname === link.href ? "text-primary" : "text-muted-foreground"}>
//                 {link.label}
//               </Link>
//             ))}
//             <Link href="/carrier/bookings" className={pathname.startsWith("/carrier/bookings") ? "text-primary flex items-center gap-1 relative" : "text-muted-foreground flex items-center gap-1 relative"}>
//               {t("bookings")}
//               {pendingPaymentCount > 0 && (
//                 <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
//                   {pendingPaymentCount}
//                 </span>
//               )}
//             </Link>
//           </nav>

//           <div className="flex items-center gap-2">
//             <NotificationBell />
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" className="relative h-9 w-9 rounded-full">
//                   <Avatar className="h-9 w-9 border-2 border-primary/10">
//                     <AvatarImage src={profile?.photoURL || ""} alt="Avatar" />
//                     <AvatarFallback>{profile?.firstName?.[0] || "C"}</AvatarFallback>
//                   </Avatar>
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end">
//                 <DropdownMenuLabel>{profile?.firstName} {profile?.lastName}</DropdownMenuLabel>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem asChild><Link href="/carrier/profile">{t("carrierProfile")}</Link></DropdownMenuItem>
//                 <DropdownMenuItem onClick={handleLogout} className="text-destructive">{t("logout")}</DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//             <LanguageSwitcher />
//           </div>
//         </div>
//       </header>

//       <main className="flex-1 container pb-6 pt-16 px-4 mb-20">{children}</main>

//       <CarrierBottomNav onAddTripClick={handleAddTripClick} navLinks={navLinks} hasActiveTrip={hasActiveTrip} />
//       <AddTripDialog isOpen={isAddTripOpen} onOpenChange={setIsAddTripOpen} />

//       <Sheet open={isSocialOpen} onOpenChange={setIsSocialOpen}>
//         <SheetContent side="top" className="max-w-sm mx-auto mt-12 rounded-2xl">
//           <h3 className="text-lg font-semibold mb-4 text-center">{t("followSocial")}</h3>
//           <div className="flex flex-col gap-4">
//             <a href="#" className="flex items-center gap-3 p-2 rounded-lg hover:bg-black hover:text-white transition-colors"><Facebook /><span className="font-medium">Facebook</span></a>
//             <a href="#" className="flex items-center gap-3 p-2 rounded-lg hover:bg-black hover:text-white transition-colors"><Instagram /><span className="font-medium">Instagram</span></a>
//           </div>
//         </SheetContent>
//       </Sheet>
//     </div>
//   );
// }
"use client";

import { useMemo, useState, useEffect } from "react";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useAuth, useCollection, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import { signOut } from "firebase/auth";
import { useTranslations, useLocale } from "next-intl";
import {
  LayoutDashboard,
  Map,
  List,
  MessageSquare,
  Menu,
  Archive,
  ListChecks,
  ClipboardList,
  Facebook,
  Instagram,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CarrierMobileMenu } from "@/components/carrier/carrier-mobile-menu";
import { CarrierBottomNav } from "@/components/carrier/carrier-bottom-nav";
import { NotificationBell } from "@/components/notification-bell";
import { AddTripDialog } from "@/components/carrier/add-trip-dialog";
import { useToast } from "@/hooks/use-toast";
import { useUnreadChats } from "@/hooks/use-unread-chats";
import Image from "next/image";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useCarrierSubscription } from "@/hooks/use-carrier-subscription";
import { Trip } from "@/lib/data";
import { collection, query, where } from "firebase/firestore";
import { Booking } from "@/lib/data";

/**
 * @layout CarrierLayout
 * @description THE ARTERIAL DISPATCHER (SC-686-SSOT)
 * [SC-686]: Eradicated "Double Echo" by becoming the primary data pulse.
 * Prop-drills identity and subscription state to children.
 */
export default function CarrierLayout({ children }: { children: React.ReactNode }) {
  const { profile, isEngaged, engagementType, isLoading: isProfileLoading } = useUserProfile();

  // [SC-686] SSOT: Passing profile to subscription hook to avoid secondary listener
  const { isMarketActive, marketRule } = useCarrierSubscription(profile);

  const auth = useAuth();
  const pathname = usePathname();
  const { toast } = useToast();
  const t = useTranslations("carrierLayout");
  const locale = useLocale();

  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddTripOpen, setIsAddTripOpen] = useState(false);
  const [isSocialOpen, setIsSocialOpen] = useState(false);

  const unreadChatsCount = useUnreadChats();

  const { user } = useUser();
  const firestore = useFirestore();

  const activeTripQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return query(
      collection(firestore, 'trips'),
      where('carrierId', '==', user.uid),
      where('status', 'in', ['Planned', 'In-Transit', 'Has_Offers', 'Negotiating', 'Pending-Carrier-Confirmation'])
    );
  }, [firestore, user]);

  const { data: activeTrips } = useCollection<Trip>(activeTripQuery);

  const hasActiveTrip = useMemo(() => {
    if (!activeTrips || activeTrips.length === 0) return false;
    return activeTrips.some(trip => {
      const depDate = (trip.departureDate as any)?.toDate?.()
        ? (trip.departureDate as any).toDate()
        : new Date(trip.departureDate || 0);
      const durationHours = (trip as any).estimatedDurationHours || 0;
      const endDate = new Date(depDate.getTime() + durationHours * 60 * 60 * 1000);
      return endDate > new Date();
    });
  }, [activeTrips]);

  // 🔴 عدد الحجوزات اللي المسافر دفع عربونها وبتنتظر تأكيد الناقل
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

  const handleAddTripClick = () => {
    if (!isMarketActive) {
      toast({
        variant: "destructive",
        title: "العمليات متوقفة",
        description: `عذراً، قطاع ${marketRule?.countryName || ''} مجمد حالياً للصيانة الإدارية.`
      });
      return;
    }

    // ── Onboarding Guard: قبل فتح الـ dialog تأكد إن الناقل أكمل بياناته ──
    const hasPermanentData =
      profile?.isPermanentComplete ||
      (!!profile?.price && profile.price > 0 && Array.isArray(profile?.paymentWallets) && profile.paymentWallets.length > 0);

    if (!hasPermanentData) {
      toast({
        variant: "destructive",
        title: "أكمل بياناتك أولاً",
        description: "يجب إكمال الشروط الدائمة قبل إنشاء رحلة.",
      });
      router.push('/carrier/Permanent');
      return;
    }

    if (profile?.isPartial || !profile?.vehicleType || !profile?.vehicleCapacity) {
      toast({
        variant: "destructive",
        title: "أكمل بياناتك أولاً",
        description: "يجب إكمال بيانات البروفيل قبل إنشاء رحلة.",
      });
      router.push('/carrier/profile');
      return;
    }
    // ── نهاية الـ Guard ──

    if (hasActiveTrip) {
      toast({ variant: "destructive", title: t("activeTrip"), description: t("activeTripDesc") });
    } else {
      setIsAddTripOpen(true);
    }
  };

  const handleLogout = async () => {
    try {
      if (auth) await signOut(auth);
      document.cookie = `__session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure`;
      window.location.href = `/${locale}/login`;
    } catch (error) {
      console.error("[Sovereign Auth] Logout failure:", error);
    }
  };

  const navLinks = [
    { href: "/carrier", label: t("command"), icon: LayoutDashboard, exact: true, count: 0, mobile: true },
    { href: "/carrier/chats", label: t("messages"), icon: MessageSquare, exact: false, count: unreadChatsCount, mobile: true },
    // { href: "/carrier/bookings", label: t("bookings"), icon: ClipboardList, exact: false, count: pendingPaymentCount, mobile: false },
    { href: "/carrier/trips", label: t("myTrips"), icon: List, exact: false, count: 0 },
    { href: "/carrier/archive", label: t("archive"), icon: Archive, exact: true, count: 0 },
    { href: "/carrier/Permanent", label: t("permanentConditions"), icon: ListChecks, exact: true, count: 0 },
  ];

  if (isProfileLoading) return null;

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ONBOARDING GUARD — يوجه الناقل الجديد لإكمال بياناته
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const onboardingExemptPaths = [
    '/carrier/Permanent',
    '/carrier/profile',
  ];
  const isOnboardingExempt = onboardingExemptPaths.some(p => pathname.startsWith(p));

  if (profile && !isOnboardingExempt) {
    // الخطوة 1: الشروط الدائمة — يتحقق من isPermanentComplete أو البيانات الفعلية (سعر + وسيلة دفع)
    const hasPermanentData =
      profile.isPermanentComplete ||
      (!!profile.price && profile.price > 0 && Array.isArray(profile.paymentWallets) && profile.paymentWallets.length > 0);

    if (!hasPermanentData) {
      if (typeof window !== 'undefined') {
        window.location.replace(`/${locale}/carrier/Permanent`);
      }
      return null;
    }
    // الخطوة 2: البروفيل — يتحقق من بيانات المركبة
    if (profile.isPartial || !profile.vehicleType || !profile.vehicleCapacity) {
      if (typeof window !== 'undefined') {
        window.location.replace(`/${locale}/carrier/profile`);
      }
      return null;
    }
  }


  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side={locale === "ar" ? "right" : "left"} className="p-0">
              <CarrierMobileMenu onLinkClick={() => setIsSidebarOpen(false)} navLinks={navLinks} />
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2 ">
            <Image
              src="/logo.png"
              alt="Safar Gate"
              width={150}

              height={150}
              style={{ height: 'auto' }}
              priority
              className="w-[110px] md:w-[150px] mt-5"
            />
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium ">
            {navLinks.filter(l => !l.mobile).map(link => (
              <Link key={link.href} href={link.href} className={pathname === link.href ? "text-primary" : "text-muted-foreground"}>
                {link.label}
              </Link>
            ))}
            <Link href="/carrier/bookings" className={pathname.startsWith("/carrier/bookings") ? "text-primary flex items-center gap-1 relative" : "text-muted-foreground flex items-center gap-1 relative"}>
              {t("bookings")}
              {pendingPaymentCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                  {pendingPaymentCount}
                </span>
              )}
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <NotificationBell />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9 border-2 border-primary/10">
                    <AvatarImage src={profile?.photoURL || ""} alt="Avatar" />
                    <AvatarFallback>{profile?.firstName?.[0] || "C"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{profile?.firstName} {profile?.lastName}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link href="/carrier/profile">{t("carrierProfile")}</Link></DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">{t("logout")}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="flex-1 container pb-6 pt-16 px-4 mb-20">{children}</main>

      <CarrierBottomNav onAddTripClick={handleAddTripClick} navLinks={navLinks} hasActiveTrip={hasActiveTrip} />
      <AddTripDialog isOpen={isAddTripOpen} onOpenChange={setIsAddTripOpen} />

      <Sheet open={isSocialOpen} onOpenChange={setIsSocialOpen}>
        <SheetContent side="top" className="max-w-sm mx-auto mt-12 rounded-2xl">
          <h3 className="text-lg font-semibold mb-4 text-center">{t("followSocial")}</h3>
          <div className="flex flex-col gap-4">
            <a href="#" className="flex items-center gap-3 p-2 rounded-lg hover:bg-black hover:text-white transition-colors"><Facebook /><span className="font-medium">Facebook</span></a>
            <a href="#" className="flex items-center gap-3 p-2 rounded-lg hover:bg-black hover:text-white transition-colors"><Instagram /><span className="font-medium">Instagram</span></a>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}