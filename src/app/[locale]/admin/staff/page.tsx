'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ShieldAlert } from 'lucide-react';
import { useLocale } from 'next-intl';

/**
 * @page AdminStaffRedirector
 * @description THE REINFORCED ARTERIAL REDIRECTOR (STERILIZED - SC-806 V4.4)
 * [SC-806 V4.4]: HARD WELD REDIRECT. Eradicated Ghost Twin logic.
 * Protocol 16: Sterilized. Ensures SSOT by pointing to the Fused Judicial Center.
 */
export default function AdminStaffPage() {
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    // [SSOT]: HARD WELD - Direct arterial redirection to the Fused Judicial Registry tab
    // No redundant rendering allowed.
    router.replace(`/admin/audit-logs?tab=staff`);
  }, [router, locale]);

  return (
    <div className="flex h-[70vh] w-full flex-col items-center justify-center gap-4 animate-in fade-in duration-500">
      <div className="bg-primary/10 p-6 rounded-full animate-pulse">
        <ShieldAlert className="h-12 w-12 text-primary" />
      </div>
      <div className="text-center space-y-2">
        <h1 className="text-xl font-black text-slate-900 uppercase tracking-widest">Sovereign Fusion Active</h1>
        <p className="text-xs text-slate-500 font-bold">تمَّ صهر إدارة الكوادر داخل ديوان العدالة لضمان وحدة الحقيقة السيادية.</p>
      </div>
      <Loader2 className="h-6 w-6 animate-spin text-primary mt-4" />
    </div>
  );
}
