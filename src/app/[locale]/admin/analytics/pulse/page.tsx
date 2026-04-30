'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, BarChart3, Loader2 } from 'lucide-react';
import { usePulseReactor } from '@/hooks/analytics/use-pulse-reactor';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { SOVEREIGN_GEO_REGISTRY } from '@/lib/constants';

/**
 * @page PulseAnalyticsPage
 * @description THE DEEP DIVE: WEEKLY PULSE (SC-805 Registry Update)
 */
export default function PulseAnalyticsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const country = searchParams.get('country') || 'all';
  const countryName = country === 'all' ? 'العالم' : SOVEREIGN_GEO_REGISTRY[country.toUpperCase()]?.name || country;

  useEffect(() => {
    setMounted(true);
    const memory = localStorage.getItem('safar_admin_geo_memory');
    if (!searchParams.get('country') && memory && memory !== 'all') {
      const params = new URLSearchParams(searchParams.toString());
      params.set('country', memory);
      router.replace(`?${params.toString()}`);
    }
  }, [searchParams, router]);

  const { dailyVolume, loading } = usePulseReactor(country);

  const maxPulse = useMemo(() => Math.max(...dailyVolume.map(d => d.trips), 0), [dailyVolume]);

  if (!mounted) return null;

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 p-2 md:p-4" dir="rtl">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="rounded-full h-12 w-12" onClick={() => router.back()}>
                <ArrowRight className="h-5 w-5" />
            </Button>
            <div>
                <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                    <Zap className="h-8 w-8 text-primary" />
                    النبض الأسبوعي الحقيقي
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                    توزيع كثافة الرحلات على أيام الأسبوع في نطاق: <span className="font-bold text-primary">{countryName}</span>
                </p>
            </div>
        </div>
      </div>

      <Card className="border-primary/10 shadow-2xl bg-card/50 backdrop-blur-xl">
        <CardHeader className="bg-muted/30 border-b p-6">
            <CardTitle className="text-lg font-black">مؤشر التدفق اليومي</CardTitle>
            <CardDescription className="text-xs">تحديد أيام الذروة والركود لتوجيه العمليات الميدانية.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 h-[500px]">
            {loading ? (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4 opacity-30">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="font-black text-lg animate-pulse">جاري معايرة النبض...</p>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyVolume} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                        <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                        <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#1F0A10', border: '1px solid #beae77', borderRadius: '12px' }} />
                        <Bar dataKey="trips" radius={[6, 6, 0, 0]} barSize={60}>
                            {dailyVolume.map((entry, index) => {
                                let fill = '#333';
                                if (entry.trips > 0) {
                                    fill = entry.trips === maxPulse ? '#22c55e' : '#beae77';
                                }
                                return <Cell key={`cell-${index}`} fill={fill} />;
                            })}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            )}
        </CardContent>
      </Card>

      <div className="bg-primary/5 p-6 rounded-2xl border border-dashed border-primary/30 flex items-start gap-4">
          <div className="bg-primary/20 p-3 rounded-full"><BarChart3 className="h-6 w-6 text-primary" /></div>
          <div>
              <h4 className="font-black text-primary mb-1">الرؤية التشغيلية</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                  هذا المخطط يتبع آخر فلتر تمَّ اختياره في قمرة القيادة بفضل الذاكرة الجغرافية المستمرة.
              </p>
          </div>
      </div>

    </div>
  );
}
