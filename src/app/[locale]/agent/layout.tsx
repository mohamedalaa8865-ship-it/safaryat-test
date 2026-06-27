'use client';

import { ReactNode } from 'react';
import { useUserProfile } from '@/hooks/use-user-profile';
import { ShieldAlert, ArrowRight, Loader2, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { AgentPendingScreen } from '@/components/agent/agent-pending-screen';
import { AgentBottomNav } from '@/components/agent/agent-bottom-nav';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useLocale, useTranslations } from 'next-intl';
import { LanguageSwitcher } from '@/components/language-switcher';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
export default function AgentLayout({ children }: { children: ReactNode }) {
  const { profile, isLoading, isMaster } = useUserProfile();
  const router = useRouter();
  const auth = useAuth();
  const locale = useLocale();
  const t = useTranslations('AgentLayout');

  const handleLogout = async () => {
    try {
      if (auth) await signOut(auth);
      document.cookie = `__session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure`;
      window.location.href = `/${locale}/login`;
    } catch (error) {
      console.error("[Sovereign Auth] Logout failure:", error);
    }
  };
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
          <p className="text-primary font-mono text-[10px] uppercase tracking-[0.3em] animate-pulse">
            {t('loading')}
          </p>
        </div>
      </div>
    );
  }

  // [SC-55] Unified Authorization Protocol
  const isAuthorized = profile?.role === 'agent' || isMaster;

  if (!isAuthorized) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen bg-background p-8 text-center space-y-6"
        dir="rtl"
      >
        <div className="p-6 bg-destructive/10 rounded-full border border-destructive/20">
          <ShieldAlert className="h-20 w-20 text-destructive animate-pulse" />
        </div>
        <div className="max-w-md space-y-3">
          <h2 className="text-3xl font-black text-foreground tracking-tighter">
            {t('unauthorized_title')}
          </h2>
          <p className="text-muted-foreground font-bold leading-relaxed">
            {t('unauthorized_desc')}
          </p>
        </div>
        <Button
          variant="outline"
          className="gap-2 rounded-2xl h-12 px-8 font-black shadow-lg"
          onClick={() => router.push('/')}
        >
          <ArrowRight className="h-4 w-4" />
          t('back_button')
        </Button>
      </div>
    );
  }

  // [SCR-1001] APPROVAL GATE
  const isPendingApproval = !isMaster && (profile as any)?.agentStatus === 'pending';

  if (isPendingApproval && profile) {
    return <AgentPendingScreen profile={profile} />;
  }

  return (
    <div className="min-h-screen w-full bg-background flex flex-col overflow-x-hidden">

      {/* ========== NAVBAR العلوي ========== */}
      <header className="app-navbar fixed top-0 left-0 right-0 z-50 w-full border-b bg-[#BEAD77] backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">

          {/* اللوجو */}
          <Image
            src="/logo.png"
            alt="Safaryat"
            width={150}
            height={150}
            style={{ height: 'auto' }}
            priority
            className="w-[110px] md:w-[150px] mt-5"
          />

          {/* اللغة + الحساب */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-9 w-9 rounded-full bg-[#1A0E10] text-white flex items-center justify-center font-black text-sm hover:opacity-90 transition-opacity">
                  {profile?.firstName?.charAt(0)?.toUpperCase() || 'm'}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="font-black">
                  <p className="font-black">{profile?.firstName || ''}</p>
                  <p className="text-xs text-muted-foreground font-normal truncate">{profile?.email || ''}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive cursor-pointer gap-2"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  t('logout')
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* المحتوى - pt-16 عشان الـ navbar الفوقاني */}
      <main className="flex-1 w-full pb-24 pt-16">
        {children}
      </main>

      <AgentBottomNav />
    </div>
  );
}