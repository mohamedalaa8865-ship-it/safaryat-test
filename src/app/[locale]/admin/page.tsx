'use client';

import { useEffect, useState, useTransition, useCallback } from 'react';
import { AdminDashboardStats } from '@/components/admin/admin-dashboard-stats';
import { AdminStrategicVisualizer } from '@/components/admin/admin-strategic-visualizer';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Globe, LayoutGrid, AlertCircle, ShieldCheck, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { useStrategicIntelligence } from '@/hooks/use-strategic-intelligence';
import { LocalErrorBoundary } from '@/components/ui/local-error-boundary';
import { useActiveMarkets } from '@/hooks/use-active-markets';

/**
 * @page AdminDashboard
 * @description THE ARTERIAL CONTROL CENTER (DIAMOND STERILIZED - SC-806 V5.4)
 * [SC-806 V5.4]: Enforced Arterial Persistence across deep analytics gateways.
 * Protocol 16: Sterilized transition handlers. 
 * Protocol 88: Resource Protection via transitions.
 */
export default function AdminDashboard() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [mounted, setMounted] = useState(false);

    const selectedCountry = searchParams.get('country') || 'all';
    const { activeMarkets, getMarketName, isLoading: isLoadingMarkets } = useActiveMarkets();

    // [PROTOCOL 55]: Arterial Persistence Check
    useEffect(() => {
        const memory = localStorage.getItem('safar_admin_geo_memory');
        if (!searchParams.get('country') && memory && memory !== 'all') {
            const params = new URLSearchParams(searchParams.toString());
            params.set('country', memory);
            router.replace(`${pathname}?${params.toString()}`);
        }
        setMounted(true);
    }, [searchParams, router, pathname]);

    // [SSOT]: Using the unified Strategic Intelligence Artery
    const { metrics, isLoading: isIntelLoading } = useStrategicIntelligence(selectedCountry);

    // Fallback for visualizer data (can be refined further)
    const growth: any[] = [];
    const dailyVolume: any[] = [];
    const routes: any[] = [];

    // [PROTOCOL 16]: Memoized Sovereign Handler
    const handleCountryChange = useCallback((val: string) => {
        localStorage.setItem('safar_admin_geo_memory', val);
        startTransition(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (val === 'all') params.delete('country');
            else params.set('country', val);
            router.push(`${pathname}?${params.toString()}`);
        });
    }, [router, pathname, searchParams]);

    /**
     * @function navigateWithContext
     * @description [SC-806 V5.4] ARTERIAL GATEWAY: Ensures deep links carry the geo-context.
     */
    const navigateWithContext = useCallback((targetPath: string) => {
        const params = new URLSearchParams(searchParams.toString());
        const finalUrl = `${targetPath}${params.toString() ? (targetPath.includes('?') ? '&' : '?') + params.toString() : ''}`;
        router.push(finalUrl);
    }, [router, searchParams]);

    if (!mounted) {
        return (
            <div className="space-y-6 p-6">
                <header className="flex justify-between items-center">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-10 w-48" />
                </header>
                <div className="grid gap-4 md:grid-cols-4">
                    {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
                </div>
                <Skeleton className="h-[500px] w-full rounded-2xl" />
            </div>
        );
    }

    return (
        <div className={cn(
            "space-y-8 animate-in fade-in duration-700 pb-20 transition-opacity",
            isPending && "opacity-60 pointer-events-none"
        )} dir="rtl">

            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
                <div className="text-right">
                    <div className="flex items-center justify-end gap-3">
                        {selectedCountry !== 'all' && (
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 animate-in zoom-in">
                                قطاع: {getMarketName(selectedCountry)}
                            </Badge>
                        )}
                        <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
                            غرفة العمليات المركزية
                            <LayoutGrid className="h-8 w-8 text-primary" />
                        </h1>
                    </div>
                    <p className="text-muted-foreground text-sm mt-1">نظام الاستخبارات الموحد: وضعية الرؤية الشاملة [State Persistent].</p>
                </div>

                <div className="flex items-center gap-3 bg-card p-2 rounded-xl border shadow-sm ring-primary/10 focus-within:ring-2 transition-all">
                    <Globe className={cn("h-5 w-5 text-primary", (isPending || isLoadingMarkets) && "animate-spin")} />
                    <Select value={selectedCountry} onValueChange={handleCountryChange} disabled={isLoadingMarkets}>
                        <SelectTrigger className="w-[200px] border-0 bg-transparent focus:ring-0 font-bold text-xs text-right">
                            <SelectValue placeholder="تصفية النطاق الجغرافي" />
                        </SelectTrigger>
                        <SelectContent align="end">
                            <SelectItem value="all" className="text-right font-black">🌍 الرؤية العالمية الشاملة</SelectItem>
                            <div className="h-px bg-muted my-1" />
                            {activeMarkets.map((market) => (
                                <SelectItem key={market.id} value={market.id} className="text-right">{market.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </header>

            <AdminDashboardStats
                countryFilter={selectedCountry}
                data={{
                    totalUsers: metrics.totalUsers,
                    activeTrips: metrics.activeOperations,
                    dailyBrokerageFlow: 0,
                    todayTrips: metrics.totalTripsHistory,
                    unpaidCarriers: 0
                }}
                isLoading={isIntelLoading}
            />

            <section className="space-y-4">
                <h2 className="text-sm font-black text-muted-foreground uppercase tracking-widest flex items-center justify-end gap-2 px-1">
                    بوابات الإدارة والسيادة
                    <ShieldCheck className="h-4 w-4 text-primary" />
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card
                        className="group cursor-pointer hover:border-primary/50 transition-all bg-card/50 border-primary/10 shadow-sm relative overflow-hidden text-right"
                        onClick={() => navigateWithContext('/admin/settings/pricing')}
                    >
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <ArrowLeft className="h-5 w-5 text-primary" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-black text-lg flex items-center justify-end gap-2">
                                        غرفة التسعير
                                        <AlertCircle className="h-5 w-5 text-primary" />
                                    </h3>
                                    <p className="text-xs text-muted-foreground">إدارة العمولات والموازين المالية دولياً.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card
                        className="group cursor-pointer hover:border-blue-500/50 transition-all bg-card/50 border-primary/10 shadow-sm relative overflow-hidden text-right"
                        onClick={() => navigateWithContext('/admin/audit-logs?tab=staff')}
                    >
                        {/* <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                          <div className="h-10 w-10 bg-blue-50/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                              <ArrowLeft className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="space-y-1">
                              <h3 className="font-black text-lg flex items-center justify-end gap-2">
                                  سجل الكوادر
                                  <ShieldCheck className="h-5 w-5 text-blue-600" />
                              </h3>
                              <p className="text-xs text-muted-foreground">تجنيد الموظفين وإدارة الصلاحيات المهنية.</p>
                          </div>
                      </div>
                  </CardContent> */}
                    </Card>

                    <Card
                        className="group cursor-pointer hover:border-slate-500/50 transition-all bg-card/50 border-primary/10 shadow-sm relative overflow-hidden text-right"
                        onClick={() => navigateWithContext('/admin/field')}
                    >
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="h-10 w-10 bg-slate-500/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <ArrowLeft className="h-5 w-5 text-slate-600" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-black text-lg flex items-center justify-end gap-2">
                                        إدارة الجمهور
                                        <LayoutGrid className="h-5 w-5 text-slate-600" />
                                    </h3>
                                    <p className="text-xs text-muted-foreground">الرقابة والتحكم في الناقلين والمسافرين.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-purple-600/20 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
                <AdminStrategicVisualizer
                    country={selectedCountry}
                    growth={growth}
                    dailyVolume={dailyVolume}
                    routes={routes}
                    isLoading={isIntelLoading}
                />
            </div>

            <div className="flex flex-col items-center justify-center gap-2 py-10 opacity-30">
                <div className="h-px w-32 bg-gradient-to-r from-transparent via-primary to-transparent" />
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                    <AlertCircle className="h-3 w-3" />
                    Sovereign Artery v6.5 [SC-714]
                </div>
            </div>

        </div>
    );
}
