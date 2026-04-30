'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ShieldAlert } from 'lucide-react';

/**
 * @page IdentityManagement (Ghost Redirector)
 * @description THE REINFORCED ARTERIAL REDIRECTOR (STERILIZED - SC-806 V3.4)
 * [SC-806 V3.4]: Eradicated Ghost Twins. Points to the Unified Judicial Center.
 * Protocol 16: Sterilized. Ensures SSOT by centralizing Identity into the Registry Hub.
 */
export default function IdentityManagementPage() {
  const router = useRouter();

  useEffect(() => {
    // [SSOT]: Direct arterial redirection to the Fused Judicial Center
    router.replace(`/admin/audit-logs?tab=staff`);
  }, [router]);

  return (
    <div className="flex h-[70vh] w-full flex-col items-center justify-center gap-4 animate-in fade-in duration-500">
      <div className="bg-primary/10 p-6 rounded-full animate-pulse border border-primary/20 shadow-2xl">
        <ShieldAlert className="h-16 w-16 text-primary" />
      </div>
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-widest">Sovereign Fusion Active</h1>
        <p className="text-sm text-slate-500 font-bold">تم صهر سجل الهوية داخل مركز الكوادر الموحد لضمان وحدة الحقيقة السيادية.</p>
      </div>
      <Loader2 className="h-6 w-6 animate-spin text-primary mt-4" />
    </div>
  );
}
