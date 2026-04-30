'use client';

/**
 * @page OwnerCockpit
 * @description THE PURIFIED SOVEREIGN HUD [SCR-942 - STRATEGIC PURGE]
 * [SCR-942]: Relocated Architectural Tree to Dev Screen to prevent context pollution.
 * Protocol 16: Diamond Sterilized.
 */

import { useOwnerIntelligence } from '@/hooks/use-owner-intelligence';
import { Card, CardContent } from '@/components/ui/card';
import { 
    Zap, Users, Ship, Briefcase, Search, ShieldCheck, 
    Terminal, ArrowUpRight,
    User, MapPin, Loader2, XCircle, FileText,
    Lock, Gavel, Activity, ShieldAlert
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { triggerHaptic, cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useLocale } from 'next-intl';
import { formatDate } from '@/lib/formatters';
import { Skeleton } from '@/components/ui/skeleton';

export default function OwnerCockpitPage() {
    const locale = useLocale();
    const { toast } = useToast();
    
    const { 
        counters, isCountersLoading, 
        searchTerm, setSearchTerm, isSearching, 
        searchResult, forensicTimeline,
        recentJudicialActions, isJudicialLoading
    } = useOwnerIntelligence();
    
    const [pinInput, setPinInput] = useState('');
    const [isArchiveUnlocked, setIsArchiveUnlocked] = useState(false);

    const handleUnlock = (e: React.FormEvent) => {
        e.preventDefault();
        if (pinInput === '9000') {
            setIsArchiveUnlocked(true);
            triggerHaptic('success');
            toast({ title: 'تم فك أختام الأرشيف الجنائي ✅' });
        } else {
            triggerHaptic('heavy');
            toast({ variant: 'destructive', title: 'خرق أمني', description: 'الرمز السيادي غير صحيح.' });
            setPinInput('');
        }
    };

    const statsConfig = useMemo(() => [
        { label: 'المنتسبون', value: counters?.totalUsers, icon: Users, color: 'text-blue-400', prefix: 'T/C-26' },
        { label: 'العمليات الحية', value: counters?.activeOperations, icon: Ship, color: 'text-amber-400', prefix: 'LIVE' },
        { label: 'الرحلات التاريخية', value: counters?.totalTripsHistory, icon: Zap, color: 'text-purple-400', prefix: 'TRP' },
        { label: 'الإيراد السيادي', value: counters?.totalRevenue, icon: Briefcase, color: 'text-emerald-400', prefix: 'JOD' },
    ], [counters]);

    return (
        <div className="space-y-8 animate-in fade-in duration-1000 p-2 md:p-6 bg-black min-h-screen text-white overflow-x-hidden pb-32" dir="rtl">
            
            {/* COMMAND HEADER */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-primary/20 pb-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 shadow-[0_0_15px_rgba(190,174,119,0.1)]">
                        <Terminal className="h-8 w-8 text-primary animate-pulse" />
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-4xl font-black tracking-tighter text-white italic uppercase">قمرة قيادة المالك</h1>
                        <Badge variant="outline" className="bg-black text-[8px] font-mono text-primary border-primary/30 uppercase tracking-[0.2em] px-3">Sovereign HUD v4.2 [PURIFIED]</Badge>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="h-12 px-6 bg-primary text-black flex items-center justify-center rounded-2xl shadow-lg font-black text-xs gap-2">
                        <ShieldCheck className="h-5 w-5" /> السيادة المطلقة
                    </div>
                </div>
            </header>

            {/* ATOMIC RADAR */}
            <section className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <Card className="lg:col-span-3 bg-zinc-900/80 backdrop-blur-3xl border-primary/20 shadow-2xl rounded-[2.5rem] overflow-hidden">
                    <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="flex items-center gap-4 text-primary shrink-0">
                                <Search className="h-8 w-8" />
                                <h3 className="text-xl font-black tracking-widest uppercase italic">الرادار الذري</h3>
                            </div>
                            <div className="flex-1 w-full relative">
                                <Input 
                                    placeholder="أدخل المعرف (تلقائي)..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
                                    className="h-16 bg-black/50 border-primary/30 rounded-2xl text-xl font-mono text-center tracking-[0.2em] text-white"
                                />
                                {isSearching ? (
                                    <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-primary animate-spin" />
                                ) : (
                                    <ArrowUpRight className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary opacity-30" />
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-1 bg-zinc-900/40 border border-primary/10 rounded-[2.5rem] overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-white/5 bg-primary/5 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-primary flex items-center gap-2"><Activity className="h-3 w-3" /> التتبع الجنائي</span>
                        {isJudicialLoading && <Loader2 className="h-3 w-3 animate-spin text-primary opacity-50" />}
                    </div>
                    <CardContent className="p-4 flex-1 space-y-3">
                        {!recentJudicialActions || recentJudicialActions.length === 0 ? (
                            <p className="text-[10px] text-center text-muted-foreground italic py-8">لا توجد عمليات مسجلة.</p>
                        ) : recentJudicialActions.map((action: any) => (
                            <div key={action.id} className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1 hover:bg-primary/5 transition-colors cursor-pointer" onClick={() => setSearchTerm(action.targetUserId)}>
                                <div className="flex justify-between items-center">
                                    <Badge variant="outline" className="text-[8px] h-4 bg-black border-primary/20 text-primary uppercase font-black">{action.action}</Badge>
                                    <span className="text-[8px] font-mono opacity-40">{formatDate(action.timestamp, 'HH:mm', locale)}</span>
                                </div>
                                <p className="text-[10px] font-bold text-slate-300 truncate">{action.reason}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </section>

            {/* SNIPE RESULT & TRIBUNAL */}
            {searchResult && (
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in zoom-in-95 duration-500">
                    <Card className="lg:col-span-1 bg-zinc-900/40 border-2 border-primary/30 rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl">
                        <div className="bg-primary/10 border-b border-primary/20 p-6 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary text-black rounded-xl"><FileText className="h-6 w-6" /></div>
                                <h2 className="text-lg font-black uppercase tracking-tight">الملف الجنائي</h2>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setSearchTerm('')} className="text-primary hover:bg-primary/10"><XCircle className="h-5 w-5" /></Button>
                        </div>
                        <CardContent className="p-6 space-y-6">
                            <div className="bg-black/40 p-5 rounded-3xl border border-white/5 space-y-4 shadow-inner">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-zinc-800 rounded-full flex items-center justify-center border border-white/10 text-primary">
                                        {searchResult.type === 'users' ? <User className="h-5 w-5" /> : <MapPin className="h-5 w-5" />}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-black text-slate-500 uppercase">المستهدف المباشر</p>
                                        <p className="text-base font-black truncate">{searchResult.firstName || searchResult.passengerName || searchResult.fullName || 'بيانات قيد التدقيق'}</p>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-white/5 space-y-2 text-xs">
                                    <div className="flex justify-between"><span className="text-slate-500">الحالة:</span><Badge className="bg-blue-600 h-4 text-[8px] font-black">{searchResult.status || 'Active'}</Badge></div>
                                    <div className="flex justify-between"><span className="text-slate-500">المعرف الذري:</span><span className="font-mono text-primary font-bold">{searchResult.atomicId}</span></div>
                                    {searchResult.phoneNumber && <div className="flex justify-between"><span className="text-slate-500">الهاتف:</span><span className="font-mono">{searchResult.phoneNumber}</span></div>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-2 bg-zinc-900/60 border-2 border-primary/20 rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl">
                        <div className="bg-muted/30 border-b border-white/5 p-6 flex items-center gap-3">
                            <Gavel className="h-5 w-5 text-primary" />
                            <h2 className="text-lg font-black uppercase">المحكمة الرقمية</h2>
                        </div>
                        <CardContent className="flex-1 p-0 relative min-h-[300px]">
                            {!isArchiveUnlocked ? (
                                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-xl p-8 text-center gap-6">
                                    <Lock className="h-12 w-12 text-red-500 animate-pulse" />
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-black">فتح أختام الأرشيف</h3>
                                        <p className="text-xs text-muted-foreground font-bold">أدخل الرمز السيادي 9000 للولوج المباشر.</p>
                                    </div>
                                    <form onSubmit={handleUnlock} className="flex flex-col gap-4 w-full max-w-xs">
                                        <Input 
                                            type="password"
                                            maxLength={4}
                                            value={pinInput}
                                            onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                                            className="h-14 bg-white/5 border-white/10 text-center text-2xl font-mono tracking-[1em]"
                                        />
                                        <Button type="submit" className="h-14 rounded-2xl font-black bg-primary text-black">إلغاء القفل</Button>
                                    </form>
                                </div>
                            ) : (
                                <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto no-scrollbar animate-in fade-in duration-500">
                                    {forensicTimeline.length === 0 ? (
                                        <div className="text-center py-20 opacity-30 italic flex flex-col items-center gap-4">
                                            <ShieldAlert className="h-12 w-12" />
                                            <p>لا توجد محادثات مؤرشفة لهذا المعرف.</p>
                                        </div>
                                    ) : forensicTimeline.map((log) => (
                                        <div key={log.id} className={cn(
                                            "border p-4 rounded-2xl space-y-1 transition-all",
                                            log.type === 'judicial' ? "bg-amber-500/10 border-amber-500/20" : "bg-black/40 border-white/5"
                                        )}>
                                            <div className="flex justify-between text-[10px] font-black uppercase text-primary border-b border-white/5 pb-1">
                                                <span className="flex items-center gap-1">
                                                    {log.type === 'judicial' && <ShieldCheck className="h-3 w-3" />}
                                                    {log.sender}
                                                </span>
                                                <span className="opacity-50 font-mono">{log.time}</span>
                                            </div>
                                            <p className="text-xs text-slate-300 leading-relaxed pt-1">{log.message}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </section>
            )}

            {/* GLOBAL PULSE GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsConfig.map((stat, i) => (
                    <Card key={i} className="bg-zinc-900/50 border-primary/10 shadow-xl rounded-[2rem] hover:border-primary/40 transition-all group overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-30 group-hover:opacity-100 transition-opacity" />
                        <CardContent className="p-6 space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="p-3 bg-black rounded-2xl shadow-inner border border-white/5">
                                    <stat.icon className={cn("h-6 w-6", stat.color)} />
                                </div>
                                <Badge variant="outline" className="font-mono text-[10px] border-white/10 text-slate-500">{stat.prefix}</Badge>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{stat.label}</p>
                                {isCountersLoading ? <Skeleton className="h-10 w-24 bg-zinc-800 mt-2 rounded-lg" /> : (
                                    <h3 className="text-4xl font-black text-white mt-1 tracking-tighter">{stat.value?.toLocaleString() || 0}</h3>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
