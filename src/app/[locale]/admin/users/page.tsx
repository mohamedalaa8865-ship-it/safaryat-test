
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ShieldAlert } from 'lucide-react';
import { useLocale } from 'next-intl';

/**
 * @page AdminUsersIntelligence
 * @description THE REDIRECTOR (STERILIZED - SC-716)
 * [SC-716]: Eradicated dual-screen redundancy. Users are now managed via the Unified Radar.
 */
export default function AdminUsersPage() {
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    // Immediate Sovereign Redirection to the Unified Hub
    router.replace(`/admin/field`);
  }, [router, locale]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background/50">
      <div className="bg-emerald-500/10 p-6 rounded-full animate-pulse">
        <ShieldAlert className="h-12 w-12 text-emerald-500" />
      </div>
      <div className="text-center space-y-2">
        <h1 className="text-xl font-black text-foreground">جاري توجيهك لمركز العمليات الموحد</h1>
        <p className="text-xs text-muted-foreground">تم دمج إدارة الجمهور داخل رادار الميدان والعدالة لضمان وحدة الحقيقة.</p>
      </div>
      <Loader2 className="h-6 w-6 animate-spin text-emerald-500 mt-4" />
    </div>
  );
}
