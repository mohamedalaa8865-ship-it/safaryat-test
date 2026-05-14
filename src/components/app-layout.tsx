
// "use client";

// import { ReactNode, useState, useMemo } from "react";
// import { Link } from "@/i18n/routing";
// import { usePathname, useRouter } from "@/i18n/routing";
// import { useAuth, useFunctions } from "@/firebase";
// import { signOut } from "firebase/auth";
// import { httpsCallable } from "firebase/functions";
// import {
//   LayoutGrid,
//   LogOut,
//   User,
//   Menu,
//   MessageSquare,
//   Facebook,
//   Instagram,
//   Archive,
//   Trash2,
//   Sparkles,
//   ArrowRight
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
// import { useUnreadChats } from "@/hooks/use-unread-chats";
// import { useToast } from "@/hooks/use-toast";
// import Image from "next/image";
// import { useLocale, useTranslations } from "next-intl";
// import { LanguageSwitcher } from "./language-switcher";
// import { NotificationBell } from "./notification-bell";
// import type { UserProfile } from "@/lib/data";

// /**
//  * @component SovereignPulseBanner
//  * @description مكون صامت يعرض تنبيه النبض النشط (SSOT Optimized)
//  */
// function SovereignPulseBanner({ isEngaged, engagementType }: { isEngaged: boolean, engagementType: string }) {
//   const pathname = usePathname();
//   const router = useRouter();
//   const locale = useLocale();

//   if (!isEngaged || pathname.includes('/history')) return null;

//   const label = engagementType === 'BOOKING'
//     ? (locale === 'ar' ? 'لديك رحلة نشطة جارية الآن' : 'You have an active trip')
//     : (locale === 'ar' ? 'محرك النوايا يبحث لك عن عروض' : 'Intent engine is searching for offers');

//   return (
//     <div className="bg-primary text-primary-foreground py-2 px-4 flex items-center justify-between animate-in slide-in-from-top duration-500 sticky top-16 z-30 shadow-md">
//       <div className="flex items-center gap-2 text-xs font-bold">
//         <Sparkles className="h-3 w-3 animate-pulse" />
//         <span>{label}</span>
//       </div>
//       <Button
//         variant="secondary"
//         size="sm"
//         className="h-7 text-[10px] gap-1 px-3 font-black"
//         onClick={() => router.push('/history')}
//       >
//         {locale === 'ar' ? 'غرفة العمليات' : 'Operations Room'}
//         <ArrowRight className="h-3 w-3" />
//       </Button>
//     </div>
//   );
// }

// interface AppLayoutProps {
//   children: ReactNode;
//   profile?: UserProfile | null;
//   user?: any;
//   isEngaged?: boolean;
//   engagementType?: string;
// }
// interface NavItem {
//   href: string;
//   label: string;
//   icon: React.ElementType;
//   count?: number;  // اختياري
// }

// /**
//  * @component AppLayout
//  * @description THE REINFORCED PASSIVE SHELL (SC-700-ALIGNED)
//  * [SC-700-PURGE]: Eradicated Delegate Portal link.
//  */
// export function AppLayout({ children, profile, user, isEngaged = false, engagementType = 'NONE' }: AppLayoutProps) {
//   const auth = useAuth();
//   const functions = useFunctions();
//   const pathname = usePathname();
//   const locale = useLocale();
//   const { toast } = useToast();
//   const t = useTranslations("nav");

//   const tCommon = useTranslations("common");
//   const unreadChatsCount = useUnreadChats();
//   const [isSocialOpen, setIsSocialOpen] = useState(false);

//   // const navItems = useMemo(() => {
//   //   const items = [
//   //     { href: "/dashboard", label: t("dashboard"), icon: LayoutGrid },
//   //     { href: "/chats", label: t("chats"), icon: MessageSquare, count: unreadChatsCount },
//   //     { href: "/history", label: t("history"), icon: Archive },
//   //   ];

//   //   return items;
//   // }, [t, unreadChatsCount]);

//   const navItems = useMemo((): NavItem[] => {
//     const items: NavItem[] = [
//       { href: "/dashboard", label: t("dashboard"), icon: LayoutGrid },
//     ];

//     if (user) {
//       items.push(
//         {
//           href: "/chats", label: t("chats"), icon: MessageSquare,
//           count: unreadChatsCount
//         },
//         { href: "/history", label: t("history"), icon: Archive }
//       );
//     }

//     return items;
//   }, [t, unreadChatsCount, user]);
//   const handleLogout = async () => {
//     try {
//       if (auth) await signOut(auth);
//       document.cookie = `__session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure`;
//       window.location.href = `/${locale}/login`;
//     } catch (error) {
//       console.error("[Sovereign Auth] Logout failure:", error);
//     }
//   };

//   const handleDeleteAccount = async () => {
//     if (!functions) return;
//     if (!confirm(locale === "ar" ? "⚠️ تحذير نهائي: هل أنت متأكد من حذف حسابك؟" : "⚠️ Final Warning: Are you sure?")) return;

//     const deleteFn = httpsCallable(functions, "deleteTravelerAccount");
//     try {
//       toast({ title: locale === "ar" ? "جاري الحذف..." : "Deleting..." });
//       await deleteFn();
//       await handleLogout();
//       toast({ title: locale === "ar" ? "تم حذف الحساب بنجاح" : "Account deleted" });
//     } catch (error: any) {
//       toast({ variant: "destructive", title: tCommon("error"), description: error.message });
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background flex flex-col overflow-y-auto">
//       <header className="fixed top-0 left-0 right-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//         <div className="container mx-auto pt-2 flex h-16 items-center justify-between px-4">
//           <Sheet>
//             <SheetTrigger asChild>
//               <Button variant="ghost" size="icon" className="md:hidden">
//                 <Menu className="h-5 w-5" />
//               </Button>
//             </SheetTrigger>
//             <SheetContent side={locale === "ar" ? "right" : "left"}>
//               <nav className="flex flex-col gap-4 mt-8 ">
//                 {navItems.map((item) => {
//                   const Icon = item.icon;
//                   return (
//                     <>

//                       <Link
//                         key={item.href}
//                         href={item.href}
//                         className={`flex items-center gap-3 text-lg font-medium transition-colors hover:text-primary ${pathname === item.href ? "text-primary" : "text-muted-foreground"
//                           }`}
//                       >
//                         <Icon className="h-5 w-5" />
//                         {item.label}
//                         {item.count != null && item.count > 0 ? (
//                           <span className="bg-destructive text-destructive-foreground text-[10px] rounded-full h-4 w-4 flex items-center justify-center ml-auto">{item.count}</span>
//                         ) : null
//                         }
//                       </Link>
//                     </>

//                   );
//                 })}
//                 {user ?
//                   <div className="hidden">
//                     <Link href="/email-login?role=traveler"><Button className="w-full">{t("login")}</Button></Link>
//                     <Link href="/"><Button className="w-full">{t("home")}</Button></Link>
//                     <LanguageSwitcher fullWidth />
//                   </div> :
//                   <div className="flex flex-col gap-2 ">
//                     <Link href="/email-login?role=traveler"><Button className="w-full">{t("login")}</Button></Link>
//                     <Link href="/"><Button className="w-full">{t("home")}</Button></Link>
//                     <LanguageSwitcher fullWidth />
//                   </div>
//                 }

//                 <div className="mx-auto">
//                   <Button className="text-lg font-semibold mb-4 text-center" onClick={() => setIsSocialOpen(true)}>{locale === "ar" ? "تابعنا على السوشيال ميديا" : "Follow us"} </Button>
//                 </div>
//                 <Sheet open={isSocialOpen} onOpenChange={setIsSocialOpen}>
//                   <SheetContent side="top" className="max-w-sm mx-auto mt-12 rounded-2xl">
//                     <h3 className="text-lg font-semibold mb-4 text-center">{locale === "ar" ? "تابعنا على السوشيال ميديا" : "Follow us"}</h3>                    <div className="flex flex-col gap-4">
//                       <a href="#" className="flex items-center gap-3 p-2 rounded-lg hover:bg-black hover:text-white transition-colors"><Facebook /><span className="font-medium">Facebook</span></a>
//                       <a href="#" className="flex items-center gap-3 p-2 rounded-lg hover:bg-black hover:text-white transition-colors"><Instagram /><span className="font-medium">Instagram</span></a>
//                     </div>
//                   </SheetContent>
//                 </Sheet>
//                 {user && <Button variant="ghost" className="justify-start gap-3 text-destructive mt-4 hover:bg-destructive/10" onClick={handleLogout}>
//                   <LogOut className="h-5 w-5" />
//                   {t("logout")}
//                 </Button>}
//               </nav>
//             </SheetContent>
//           </Sheet>

//           {user ?
//             <div className={`flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2 ${locale === "ar" ? "ml-8" : "-ml-10"} md:static md:transform-none mt-5`}>
//               <div>
//                 <Image
//                   src="/logo.png"
//                   alt="Logo"
//                   width={180}
//                   height={180}
//                   style={{ height: 'auto' }}
//                   priority
//                   className="w-[110px] md:w-[180px]"
//                 />
//               </div>
//             </div> :
//             <div className={`flex items-center gap-2 absolute left-1/2 transform  ${locale === "ar" ? "ml-8 -translate-x-52" : "-ml-10 translate-x-28"}  md:static md:transform-none  mt-5`}>
//               <div>
//                 <Image
//                   src="/logo.png"
//                   alt="Logo"
//                   width={180}
//                   height={180}
//                   style={{ height: 'auto' }}
//                   priority
//                   className="w-[110px] md:w-[180px]"
//                 />
//               </div>
//             </div>
//           }
//           {/* <div className={`flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2 ${locale === "ar" ? "ml-8" : "-ml-10"} md:static md:transform-none mt-5`}>
//             <div>
//               <Image
//                 src="/logo.png"
//                 alt="Logo"
//                 width={180}
//                 height={180}
//                 style={{ height: 'auto' }}
//                 priority
//                 className="w-[110px] md:w-[180px]"
//               />
//             </div>
//           </div> */}

//           <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
//             {navItems.map((item) => (
//               <Link key={item.href} href={item.href} className={`transition-colors hover:text-primary ${pathname === item.href ? "text-primary" : "text-muted-foreground"}`}>
//                 {item.label}
//               </Link>
//             ))}
//           </nav>

//           <div className="flex items-center gap-2">
//             {user ? (
//               <div className="flex items-center gap-2 md:gap-3">
//                 <NotificationBell />
//                 <span className="text-sm font-medium hidden sm:inline-block">{profile?.firstName || (locale === "ar" ? "المسافر" : "Traveler")}</span>
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button variant="ghost" className="relative h-9 w-9 rounded-full">
//                       <Avatar className="h-9 w-9 border-2 border-primary/10">
//                         <AvatarImage src={user.photoURL || ""} alt="User" />
//                         <AvatarFallback className="bg-primary/5 text-primary"><User className="h-4 w-4" /></AvatarFallback>
//                       </Avatar>
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent className="w-56" align="end" forceMount>
//                     <DropdownMenuLabel className="font-normal">
//                       <div className="flex flex-col space-y-1">
//                         <p className="text-sm font-medium leading-none">{profile?.firstName} {profile?.lastName}</p>
//                         <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
//                       </div>
//                     </DropdownMenuLabel>
//                     <DropdownMenuSeparator />
//                     <DropdownMenuItem onClick={handleLogout} className="text-amber-600 focus:text-amber-600 focus:bg-amber-50 cursor-pointer">
//                       <LogOut className="mr-2 h-4 w-4" /><span>{t("logout")}</span>
//                     </DropdownMenuItem>
//                     {profile?.role === "traveler" && (
//                       <>
//                         <DropdownMenuSeparator />
//                         <DropdownMenuItem onClick={handleDeleteAccount} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
//                           <Trash2 className="mr-2 h-4 w-4" /><span>{locale === "ar" ? "حذف حسابي نهائياً" : "Delete Account"}</span>
//                         </DropdownMenuItem>
//                       </>
//                     )}
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//                 <LanguageSwitcher />
//               </div>
//             ) : (
//               <>
//                 <div className="hidden md:flex items-center gap-1 text-sm font-medium">
//                   <Link href="/email-login?role=traveler"><Button size="sm">{t("login")}</Button></Link>
//                   <Link href="/"><Button size="sm">{t("home")}</Button></Link>
//                   <LanguageSwitcher />
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </header>
//       <SovereignPulseBanner isEngaged={isEngaged} engagementType={engagementType} />
//       <main className="flex-1 container py-6 px-4 md:px-6">{children}</main>
//     </div>
//   );
// }

"use client";

import { ReactNode, useState, useMemo } from "react";
import { Link } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/routing";
import { useAuth, useFunctions } from "@/firebase";
import { signOut } from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import {
  LayoutGrid,
  LogOut,
  User,
  Menu,
  MessageSquare,
  Facebook,
  Instagram,
  Archive,
  Trash2,
  Sparkles,
  ArrowRight
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
import { useUnreadChats } from "@/hooks/use-unread-chats";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { LanguageSwitcher } from "./language-switcher";
import { NotificationBell } from "./notification-bell";
import type { UserProfile } from "@/lib/data";

/**
 * @component SovereignPulseBanner
 * @description مكون صامت يعرض تنبيه النبض النشط (SSOT Optimized)
 */
function SovereignPulseBanner({ isEngaged, engagementType }: { isEngaged: boolean, engagementType: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();

  if (!isEngaged || pathname.includes('/history')) return null;

  const label = engagementType === 'BOOKING'
    ? (locale === 'ar' ? 'لديك رحلة نشطة جارية الآن' : 'You have an active trip')
    : (locale === 'ar' ? 'محرك النوايا يبحث لك عن عروض' : 'Intent engine is searching for offers');

  return (
    <div className="bg-primary text-primary-foreground py-2 px-4 flex items-center justify-between animate-in slide-in-from-top duration-500 sticky top-16 z-30 shadow-md">
      <div className="flex items-center gap-2 text-xs font-bold">
        <Sparkles className="h-3 w-3 animate-pulse" />
        <span>{label}</span>
      </div>
      <Button
        variant="secondary"
        size="sm"
        className="h-7 text-[10px] gap-1 px-3 font-black"
        onClick={() => router.push('/history')}
      >
        {locale === 'ar' ? 'غرفة العمليات' : 'Operations Room'}
        <ArrowRight className="h-3 w-3" />
      </Button>
    </div>
  );
}

interface AppLayoutProps {
  children: ReactNode;
  profile?: UserProfile | null;
  user?: any;
  isEngaged?: boolean;
  engagementType?: string;
}
interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  count?: number;  // اختياري
}

/**
 * @component AppLayout
 * @description THE REINFORCED PASSIVE SHELL (SC-700-ALIGNED)
 * [SC-700-PURGE]: Eradicated Delegate Portal link.
 */
export function AppLayout({ children, profile, user, isEngaged = false, engagementType = 'NONE' }: AppLayoutProps) {
  const auth = useAuth();
  const functions = useFunctions();
  const pathname = usePathname();
  const locale = useLocale();
  const { toast } = useToast();
  const t = useTranslations("nav");

  const tCommon = useTranslations("common");
  const unreadChatsCount = useUnreadChats();
  const [isSocialOpen, setIsSocialOpen] = useState(false);

  // const navItems = useMemo(() => {
  //   const items = [
  //     { href: "/dashboard", label: t("dashboard"), icon: LayoutGrid },
  //     { href: "/chats", label: t("chats"), icon: MessageSquare, count: unreadChatsCount },
  //     { href: "/history", label: t("history"), icon: Archive },
  //   ];

  //   return items;
  // }, [t, unreadChatsCount]);

  const navItems = useMemo((): NavItem[] => {
    const items: NavItem[] = [
      { href: "/dashboard", label: t("dashboard"), icon: LayoutGrid },
    ];

    if (user) {
      items.push(
        {
          href: "/chats", label: t("chats"), icon: MessageSquare,
          count: unreadChatsCount
        },
        { href: "/history", label: t("history"), icon: Archive }
      );
    }

    return items;
  }, [t, unreadChatsCount, user]);
  const handleLogout = async () => {
    try {
      if (auth) await signOut(auth);
      document.cookie = `__session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure`;
      window.location.href = `/${locale}/login`;
    } catch (error) {
      console.error("[Sovereign Auth] Logout failure:", error);
    }
  };

  const handleDeleteAccount = async () => {
    if (!functions) return;
    if (!confirm(locale === "ar" ? "⚠️ تحذير نهائي: هل أنت متأكد من حذف حسابك؟" : "⚠️ Final Warning: Are you sure?")) return;

    const deleteFn = httpsCallable(functions, "deleteTravelerAccount");
    try {
      toast({ title: locale === "ar" ? "جاري الحذف..." : "Deleting..." });
      await deleteFn();
      await handleLogout();
      toast({ title: locale === "ar" ? "تم حذف الحساب بنجاح" : "Account deleted" });
    } catch (error: any) {
      toast({ variant: "destructive", title: tCommon("error"), description: error.message });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-y-auto">
      <header className="fixed top-0 left-0 right-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto pt-2 flex h-16 items-center justify-between px-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side={locale === "ar" ? "right" : "left"}>
              <nav className="flex flex-col gap-4 mt-8 ">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <>

                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 text-lg font-medium transition-colors hover:text-primary ${pathname === item.href ? "text-primary" : "text-muted-foreground"
                          }`}
                      >
                        <Icon className="h-5 w-5" />
                        {item.label}
                        {item.count != null && item.count > 0 ? (
                          <span className="bg-destructive text-destructive-foreground text-[10px] rounded-full h-4 w-4 flex items-center justify-center ml-auto">{item.count}</span>
                        ) : null
                        }
                      </Link>
                    </>

                  );
                })}
                {user ?
                  <div className="hidden">
                    <Link href="/email-login?role=traveler"><Button className="w-full">{t("login")}</Button></Link>
                    <Link href="/"><Button className="w-full">{t("home")}</Button></Link>
                    <LanguageSwitcher fullWidth />
                  </div> :
                  <div className="flex flex-col gap-2 ">
                    <Link href="/email-login?role=traveler"><Button className="w-full">{t("login")}</Button></Link>
                    <Link href="/"><Button className="w-full">{t("home")}</Button></Link>
                    <LanguageSwitcher fullWidth />
                  </div>
                }

                <div className="mx-auto">
                  <Button className="text-lg font-semibold mb-4 text-center" onClick={() => setIsSocialOpen(true)}>{locale === "ar" ? "تابعنا على السوشيال ميديا" : "Follow us"} </Button>
                </div>
                <Sheet open={isSocialOpen} onOpenChange={setIsSocialOpen}>
                  <SheetContent side="top" className="max-w-sm mx-auto mt-12 rounded-2xl">
                    <h3 className="text-lg font-semibold mb-4 text-center">{locale === "ar" ? "تابعنا على السوشيال ميديا" : "Follow us"}</h3>                    <div className="flex flex-col gap-4">
                      <a href="#" className="flex items-center gap-3 p-2 rounded-lg hover:bg-black hover:text-white transition-colors"><Facebook /><span className="font-medium">Facebook</span></a>
                      <a href="#" className="flex items-center gap-3 p-2 rounded-lg hover:bg-black hover:text-white transition-colors"><Instagram /><span className="font-medium">Instagram</span></a>
                    </div>
                  </SheetContent>
                </Sheet>
                {user && <Button variant="ghost" className="justify-start gap-3 text-destructive mt-4 hover:bg-destructive/10" onClick={handleLogout}>
                  <LogOut className="h-5 w-5" />
                  {t("logout")}
                </Button>}
              </nav>
            </SheetContent>
          </Sheet>

          <div className="flex items-center">
            <Image
              src="/logo.png"
              alt="Logo"
              width={180}
              height={180}
              style={{ height: 'auto' }}
              priority
              className="w-[100px] md:w-[150px]"
            />
          </div>
          {/* <div className={`flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2 ${locale === "ar" ? "ml-8" : "-ml-10"} md:static md:transform-none mt-5`}>
            <div>
              <Image
                src="/logo.png"
                alt="Logo"
                width={180}
                height={180}
                style={{ height: 'auto' }}
                priority
                className="w-[110px] md:w-[180px]"
              />
            </div>
          </div> */}

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className={`transition-colors hover:text-primary ${pathname === item.href ? "text-primary" : "text-muted-foreground"}`}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2 md:gap-3">
                <NotificationBell />
                <span className="text-sm font-medium hidden sm:inline-block">{profile?.firstName || (locale === "ar" ? "المسافر" : "Traveler")}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                      <Avatar className="h-9 w-9 border-2 border-primary/10">
                        <AvatarImage src={user.photoURL || ""} alt="User" />
                        <AvatarFallback className="bg-primary/5 text-primary"><User className="h-4 w-4" /></AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{profile?.firstName} {profile?.lastName}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-amber-600 focus:text-amber-600 focus:bg-amber-50 cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" /><span>{t("logout")}</span>
                    </DropdownMenuItem>
                    {profile?.role === "traveler" && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleDeleteAccount} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                          <Trash2 className="mr-2 h-4 w-4" /><span>{locale === "ar" ? "حذف حسابي نهائياً" : "Delete Account"}</span>
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
                <LanguageSwitcher />
              </div>
            ) : (
              <>
                <div className="hidden md:flex items-center gap-1 text-sm font-medium">
                  <Link href="/email-login?role=traveler"><Button size="sm">{t("login")}</Button></Link>
                  <Link href="/"><Button size="sm">{t("home")}</Button></Link>
                  <LanguageSwitcher />
                </div>
              </>
            )}
          </div>
        </div>
      </header>
      <SovereignPulseBanner isEngaged={isEngaged} engagementType={engagementType} />
      <main className="flex-1 container py-6 px-4 md:px-6">{children}</main>
    </div>
  );
}