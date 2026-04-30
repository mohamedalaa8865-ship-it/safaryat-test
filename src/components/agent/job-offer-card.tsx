'use client';

import { Briefcase, Target, Award, Banknote, Bell } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/**
 * @component JobOfferCard
 * @description يعرض عرض الشغل الحالي للوكيل — يتحدث real-time من Firestore عبر useUserProfile
 */
interface JobOfferCardProps {
    jobTitle?: string;
    agentTarget?: number;
    agentBonus?: number;
    baseSalary?: number;
    currency?: string;
    hasNewUpdate?: boolean;
}

export function JobOfferCard({
    jobTitle,
    agentTarget = 0,
    agentBonus = 0,
    baseSalary = 0,
    currency = 'JOD',
    hasNewUpdate = false,
}: JobOfferCardProps) {
    return (
        <Card className="border-amber-500/20 bg-amber-500/5 rounded-[2rem] overflow-hidden relative">
            {hasNewUpdate && (
                <div className="absolute top-3 left-3 z-10">
                    <span className="flex items-center gap-1 bg-amber-500 text-black text-[9px] font-black px-2 py-1 rounded-full animate-pulse">
                        <Bell className="h-3 w-3" /> تم تحديث عرض شغلك
                    </span>
                </div>
            )}
            <div className="absolute top-0 right-0 w-1.5 h-full bg-amber-500/60" />
            <CardContent className="pt-6 pb-5 space-y-4 text-right">
                <div className="flex justify-between items-start">
                    <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20">
                        <Briefcase className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-amber-600/70 uppercase tracking-widest">عرض الشغل الحالي</p>
                        <h3 className="font-black text-base text-foreground">
                            {jobTitle || 'وكيل سيادي'}
                        </h3>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                    <div className={cn(
                        "flex flex-col items-center justify-center p-3 rounded-2xl border text-center gap-1",
                        "bg-background border-amber-500/10"
                    )}>
                        <Target className="h-4 w-4 text-primary" />
                        <span className="text-[9px] text-muted-foreground font-bold">هدف الحجوزات</span>
                        <span className="font-black text-sm text-foreground font-mono">{agentTarget}</span>
                        <span className="text-[8px] text-muted-foreground">راكب</span>
                    </div>

                    <div className="flex flex-col items-center justify-center p-3 rounded-2xl border bg-background border-amber-500/10 text-center gap-1">
                        <Award className="h-4 w-4 text-amber-500" />
                        <span className="text-[9px] text-muted-foreground font-bold">مكافأة الهدف</span>
                        <span className="font-black text-sm text-amber-600 font-mono">{agentBonus}</span>
                        <span className="text-[8px] text-muted-foreground">{currency}</span>
                    </div>

                    <div className="flex flex-col items-center justify-center p-3 rounded-2xl border bg-background border-amber-500/10 text-center gap-1">
                        <Banknote className="h-4 w-4 text-emerald-500" />
                        <span className="text-[9px] text-muted-foreground font-bold">الراتب الشهري</span>
                        <span className="font-black text-sm text-emerald-600 font-mono">{baseSalary}</span>
                        <span className="text-[8px] text-muted-foreground">{currency}</span>
                    </div>
                </div>

                <p className="text-[8px] text-muted-foreground/60 font-bold text-center pt-1 border-t border-amber-500/10">
                    يتم تحديث بيانات العمل تلقائياً فور أي تعديل من الإدارة.
                </p>
            </CardContent>
        </Card>
    );
}