'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, Ship, TrendingUp, Handshake, ArrowRightCircle, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';

interface AdminDashboardStatsProps {
  countryFilter: string;
  data: {
    totalUsers: number;
    activeTrips: number;
    dailyBrokerageFlow: number;
    todayTrips: number;
    unpaidCarriers: number; // [SC-719] Injected
  };
  isLoading: boolean;
}

/**
 * @component AdminDashboardStats
 * @description THE REINFORCED COMMAND METRICS (DIAMOND - SC-719)
 * [SC-719]: Cross-Linking metrics to the Unified Radar.
 */
export function AdminDashboardStats({ countryFilter, data, isLoading }: AdminDashboardStatsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const navigateTo = (path: string, params: Record<string, string> = {}) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (countryFilter !== 'all') newParams.set('country', countryFilter);
    Object.entries(params).forEach(([k, v]) => newParams.set(k, v));
    router.push(`/admin/${path}?${newParams.toString()}`);
  };

  const strategicMetrics = [
    { 
        id: 'growth',
        title: 'إجمالي الجمهور', 
        value: data.totalUsers, 
        desc: 'تحليل النمو والاكتساب ↗', 
        icon: Users, 
        color: "text-blue-600", 
        path: 'analytics/growth'
    },
    { 
        id: 'debt',
        title: 'مديونية الميدان', 
        value: data.unpaidCarriers, 
        desc: 'ناقلون متأخرون عن السداد ↗', 
        icon: AlertTriangle, 
        color: "text-red-600", 
        path: 'field',
        params: { status: 'unpaid' } // [SC-719] SMART LINK
    },
    { 
        id: 'pulse',
        title: 'النبض اليومي', 
        value: data.todayTrips, 
        desc: 'رصد التدفق الأسبوعي ↗', 
        icon: TrendingUp, 
        color: "text-primary", 
        path: 'analytics/pulse' 
    },
    { 
        id: 'routes',
        title: 'إجمالي الميدان', 
        value: data.activeTrips, 
        desc: 'خارطة المسارات الحيوية ↗', 
        icon: Ship, 
        color: "text-slate-600", 
        path: 'analytics/routes' 
    },
  ];

  if (isLoading) {
    return (
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-primary/10 shadow-sm">
                <CardHeader className="p-4 pb-2"><Skeleton className="h-4 w-2/3" /></CardHeader>
                <CardContent className="p-4 pt-0"><Skeleton className="h-8 w-1/2" /></CardContent>
            </Card>
        ))}
       </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {strategicMetrics.map((m, i) => (
        <Card 
            key={i} 
            onClick={() => m.path && navigateTo(m.path, m.params)}
            className={cn(
                "border-primary/10 shadow-sm transition-all duration-300 relative overflow-hidden group",
                m.path ? "cursor-pointer hover:shadow-md hover:border-primary/30 hover:-translate-y-1" : "opacity-90",
                m.id === 'debt' && data.unpaidCarriers > 0 && "border-red-200 bg-red-50/30"
            )}
        >
          <div className={cn(
              "absolute top-0 left-0 w-1 h-full opacity-0 group-hover:opacity-100 transition-opacity",
              m.id === 'debt' ? "bg-red-500" : "bg-primary"
          )} />
          
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
            <CardTitle className="text-[10px] uppercase font-black tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
                {m.title}
            </CardTitle>
            <m.icon className={cn("h-4 w-4 transition-transform group-hover:scale-110", m.color, m.id === 'debt' && data.unpaidCarriers > 0 && "animate-bounce")} />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-baseline gap-2">
                <div className={cn("text-2xl font-black", m.color)}>{m.value}</div>
                {m.path && <ArrowRightCircle className="h-4 w-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-muted-foreground" />}
            </div>
            <CardDescription className="text-[10px] mt-1 font-medium">{m.desc}</CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
