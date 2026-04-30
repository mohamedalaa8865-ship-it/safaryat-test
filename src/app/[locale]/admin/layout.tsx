'use client';

import { useAdmin } from '@/hooks/use-admin';
import Link from 'next/link';
import {
  Home, CircleUser, ShieldCheck, LogOut,
  Banknote, Shield, Zap, MessageSquare, Globe, Code,
  History, Terminal, Coins, Briefcase, UserCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ReactNode, useEffect, useState, useMemo, useCallback } from 'react';
import { useUserProfile } from '@/hooks/use-user-profile';
import { useAuth, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { AdminSearchBar } from '@/components/admin/layout/admin-search-bar';

/**
 * @layout AdminLayout
 * @description THE REINFORCED SOVEREIGN SHELL (STERILIZED - V7.8 - SCR-984)
 * [SCR-984]: Fixed Sheet imports and purged invalid dir attributes.
 * Protocol 16: Diamond Sterilized.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  const { isAdmin, isLoading: isAdminLoading } = useAdmin();
  const { profile, checkPermission, isLoading: isProfileLoading, isMaster } = useUserProfile();
  const auth = useAuth();
  const firestore = useFirestore();
  const locale = useLocale();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeCrashesQuery = useMemoFirebase(() => {
    if (!firestore || !isAdmin) return null;
    return query(collection(firestore, 'fatal_crashes'), where('status', '==', 'active'), limit(1));
  }, [firestore, isAdmin]);

  const { data: activeCrashes } = useCollection(activeCrashesQuery);
  const hasActiveCrashes = useMemo(() => activeCrashes && activeCrashes.length > 0, [activeCrashes]);

  const isOwner = useMemo(() => {
    return isMaster || profile?.role === 'owner';
  }, [isMaster, profile?.role]);

  const navLinks = useMemo(() => {
    const links = [
      { href: "/admin", label: "لوحة التحكم", icon: Home },
    ];

    if (isOwner) links.push({ href: "/admin/owner-cockpit", label: "قمرة قيادة المالك", icon: Terminal });

    if (isOwner || checkPermission('fieldControl')) links.push({ href: "/admin/field", label: "رادار الميدان", icon: Shield });
    if (isOwner || checkPermission('liveMonitoring')) links.push({ href: "/admin/monitoring", label: "محرك النبض", icon: Zap });
    if (isOwner || checkPermission('sovereignComm')) links.push({ href: "/admin/communication", label: "التواصل السيادي", icon: MessageSquare });
    if (isOwner || isAdmin) links.push({ href: "/admin/agent-requests", label: "طلبات الوكلاء", icon: UserCheck });
    if (isOwner || checkPermission('socialMedia')) links.push({ href: "/admin/media", label: "الإعلام الرقمي", icon: Globe });
    if (isOwner || checkPermission('financeAnalytics') || checkPermission('financeVault')) links.push({ href: "/admin/finance/ledger", label: "الخزينة والديوان", icon: Banknote });
    // if (isOwner || checkPermission('securityAdmin')) links.push({ href: "/admin/audit-logs?tab=staff", label: "سجل الكوادر", icon: Briefcase });
    if (isOwner || checkPermission('financeVault')) links.push({ href: "/admin/settings/pricing", label: "غرفة التسعير", icon: Coins });
    if (isOwner || profile?.role === 'developer') links.push({ href: "/admin/dev", label: "شاشة البرمجة", icon: Code });
    if (isOwner || isAdmin) links.push({ href: "/admin/audit-logs", label: "السجل القانوني", icon: History });

    return links;
  }, [isOwner, checkPermission, profile?.role, isAdmin]);

  const handleSignOut = useCallback(async () => {
    if (!auth) return;
    await signOut(auth);
    document.cookie = `__session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure`;
    window.location.href = `/${locale}`;
  }, [auth, locale]);

  if (!mounted) return null;
  if (pathname.includes('/admin/login')) return <>{children}</>;

  if (!isMaster && (isAdminLoading || isProfileLoading)) {
    return <div className="flex h-screen w-full items-center justify-center bg-background"><Zap className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  if (!(isOwner || isAdmin)) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 p-8 text-center bg-background">
        <ShieldCheck className="h-12 w-12 text-destructive" />
        <h1 className="text-xl font-black">وصول غير مصرح به</h1>
        <Button variant="outline" className="font-bold" onClick={() => window.location.href = `/${locale}/admin/login`}>العودة للبوابة</Button>
      </div>
    );
  }

  return (
    <div className="grid h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] overflow-hidden" dir="rtl">
      <aside className="hidden border-l bg-card md:block shadow-2xl z-20 overflow-y-auto border-primary/10 h-full">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center border-b px-6 shrink-0">
            <h1 className="text-lg font-black tracking-widest text-primary uppercase">قيادة سفريات</h1>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all font-bold text-sm ${pathname === link.href ? "bg-primary/10 text-primary shadow-inner" : "text-muted-foreground hover:text-primary hover:bg-muted/50"}`}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
                {link.href === "/admin/dev" && hasActiveCrashes && (
                  <span className="mr-auto h-2 w-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                )}
              </Link>
            ))}
          </nav>
        </div>
      </aside>
      <div className="flex flex-col h-full overflow-hidden">
        <header className="flex h-16 items-center justify-between gap-4 border-b bg-card/50 backdrop-blur-md px-6 sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-black tracking-widest text-foreground/90 uppercase hidden lg:block">العمليات المركزية | <span className="text-primary font-mono text-sm uppercase">{isMaster ? 'MASTER' : (profile?.role || 'ADMIN')}</span></h1>
          </div>
          <AdminSearchBar />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full"><CircleUser className="h-5 w-5" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="text-right">مرحباً، {profile?.firstName || 'أيها القائد'}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive font-black cursor-pointer flex justify-between">
                <LogOut className="h-4 w-4" /> إخلاء الموقع
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex-1 p-4 md:p-6 bg-background/30 overflow-y-auto overflow-x-hidden h-full">{children}</main>
      </div>
    </div>
  );
}
