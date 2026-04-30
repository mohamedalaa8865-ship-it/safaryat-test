'use client';

import { useUserProfile } from '@/hooks/use-user-profile';
import { SecurityVault } from '@/components/agent/cockpit/security-vault';
import { FieldArchive } from '@/components/agent/cockpit/field-archive';
import { AgentAchievementPulse } from '@/components/agent/agent-achievement-pulse';
import { useAgentArchive } from '@/hooks/use-agent-archive';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { LocalErrorBoundary } from '@/components/ui/local-error-boundary';
import { JobOfferCard } from '@/components/agent/job-offer-card';

/**
 * @page AgentCockpit
 * @description THE REINFORCED SOVEREIGN COCKPIT (STERILIZED - V18.0 - SCR-987)
 * [SCR-987]: Diamond Sterilized logic. Typed genome consumption.
 * [PROTOCOL 16]: Dumb Shell. [PROTOCOL 88]: SSOT Pulse.
 */
export default function AgentCockpit() {
  const { profile, isMaster } = useUserProfile();

  // [SSOT]: Welded to the Unified Archive Artery
  const { counts } = useAgentArchive();

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-700 p-4 pb-32" dir="rtl">

      <header className="flex justify-between items-center px-2">
        <div className="flex items-center gap-3">
          <Link href="/agent">
            <div className="p-2 bg-muted/20 hover:bg-primary/10 rounded-xl border border-primary/10 transition-colors cursor-pointer active:scale-90">
              <ArrowRight className="h-5 w-5 text-foreground" />
            </div>
          </Link>
          <div>
            <h1 className="font-black text-xl tracking-tighter text-foreground">قمرة القيادة السيادية</h1>
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Sovereign Profile & Records</p>
          </div>
        </div>
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-black text-[9px] gap-1 px-3 py-1 rounded-full shadow-inner">
          < ShieldCheck className="h-3 w-3" /> إدارة الحساب
        </Badge>
      </header>

      <LocalErrorBoundary fallbackTitle="تعثر عداد الإنجازات">
        <AgentAchievementPulse
          completedTrips={counts.success}
          target={profile?.agentTarget || 50}
          bonus={profile?.agentBonus || 0}
          currency={profile?.currency || 'JOD'}
          isMaster={isMaster}
          firstName={profile?.firstName}
        />
      </LocalErrorBoundary>
      <JobOfferCard
        jobTitle={(profile as any)?.jobTitle}
        agentTarget={profile?.agentTarget || 0}
        agentBonus={profile?.agentBonus || 0}
        baseSalary={(profile as any)?.baseSalary || 0}
        currency={profile?.currency || 'JOD'}
      />
      <div className="space-y-6">
        <LocalErrorBoundary fallbackTitle="تعثر غرفة الهوية">
          <SecurityVault />
        </LocalErrorBoundary>

        <LocalErrorBoundary fallbackTitle="تعثر الأرشيف الميداني">
          <FieldArchive />
        </LocalErrorBoundary>
      </div>

      <div className="p-4 bg-primary/5 rounded-3xl border border-dashed border-primary/20 text-center">
        <p className="text-[9px] font-bold text-muted-foreground leading-relaxed">
          <strong>ميثاق القمة [SCR-987]:</strong> قمرة القيادة مرتبطة بوحدة الحقيقة التاريخية. تمَّ إعدام كافة الأشباح البرمجية لضمان نزاهة العدادات الميدانية.
        </p>
      </div>

    </div>
  );
}
