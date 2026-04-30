'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin, Info, Loader2 } from 'lucide-react';
import { useRoutesReactor } from '@/hooks/analytics/use-routes-reactor';
import { PieChart as ReChartsPie, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { SOVEREIGN_GEO_REGISTRY } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';

/**
 * @page RoutesAnalyticsPage
 * @description THE DEEP DIVE: ROUTES (SC-805 Registry Update)
 */
export default function RoutesAnalyticsPage() {
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

  const { routes, loading } = useRoutesReactor(country);

  const COLORS = ['#beae77', '#632139', '#3b82f6', '#22c55e', '#f59e0b'];

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
                    <MapPin className="h-8 w-8 text-destructive" />
                    حيوية المسارات الدولية
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                    تحليل أكثر الخطوط طلباً ونمواً في نطاق: <span className="font-bold text-primary">{countryName}</span>
                </p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-primary/10 shadow-2xl bg-card/50 backdrop-blur-xl">
            <CardHeader className="bg-muted/30 border-b p-6">
                <CardTitle className="text-lg font-black text-center">توزيع كثافة المسارات</CardTitle>
            </CardHeader>
            <CardContent className="p-6 h-[450px]">
                {loading ? (
                    <div className="w-full h-full flex items-center justify-center opacity-30"><Loader2 className="h-12 w-12 animate-spin" /></div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <ReChartsPie>
                            <Pie
                                data={routes}
                                cx="50%"
                                cy="50%"
                                innerRadius={80}
                                outerRadius={120}
                                paddingAngle={8}
                                dataKey="value"
                                animationBegin={0}
                                animationDuration={1500}
                            >
                                {routes.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0.2)" strokeWidth={2} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#1F0A10', border: '1px solid #beae77', borderRadius: '12px' }} />
                            <Legend verticalAlign="bottom" height={36}/>
                        </ReChartsPie>
                    </ResponsiveContainer>
                )}
            </CardContent>
          </Card>

          <Card className="border-primary/10 bg-card/50">
              <CardHeader className="border-b"><CardTitle className="text-sm font-black">قائمة الشرف للمسارات</CardTitle></CardHeader>
              <CardContent className="p-0">
                  {loading ? <div className="p-10"><Loader2 className="h-6 w-6 animate-spin mx-auto opacity-20" /></div> : (
                      <div className="divide-y">
                          {routes.map((route, i) => (
                              <div key={i} className="p-4 flex items-center justify-between group hover:bg-primary/5 transition-colors">
                                  <div className="flex items-center gap-3">
                                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                      <span className="text-sm font-bold">{route.name}</span>
                                  </div>
                                  <Badge variant="outline" className="font-mono text-primary border-primary/20">{route.value} رحلة</Badge>
                              </div>
                          ))}
                          {routes.length === 0 && <p className="p-10 text-center text-xs text-muted-foreground">لا توجد بيانات مسارات كافية.</p>}
                      </div>
                  )}
              </CardContent>
          </Card>
      </div>

      <div className="bg-muted/30 p-6 rounded-2xl border-2 border-dashed border-primary/10 flex items-center gap-4 text-center justify-center">
          <Info className="h-5 w-5 text-primary" />
          <p className="text-xs text-muted-foreground font-medium">
              يتم تحليل المسارات بناءً على عينة تشغيلية مستمرة. الذاكرة الجغرافية نشطة الآن لحماية سياق البحث.
          </p>
      </div>

    </div>
  );
}
