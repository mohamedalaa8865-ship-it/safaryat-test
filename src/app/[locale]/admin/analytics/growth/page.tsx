'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, Calendar, Loader2, Info } from 'lucide-react';
import { useGrowthReactor } from '@/hooks/analytics/use-growth-reactor';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SOVEREIGN_GEO_REGISTRY } from '@/lib/constants';

/**
 * @page GrowthAnalyticsPage
 * @description THE DEEP DIVE: GROWTH (SC-805 Registry Update)
 */
export default function GrowthAnalyticsPage() {
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

  const { growth, loading } = useGrowthReactor(country);

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
                    <TrendingUp className="h-8 w-8 text-blue-600" />
                    تحليل نمو القلعة
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                    تطور قاعدة المنتسبين والرحلات في نطاق: <span className="font-bold text-primary">{countryName}</span>
                </p>
            </div>
        </div>
        <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl flex items-center gap-3">
            <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg">
                <Calendar className="h-5 w-5" />
            </div>
            <div>
                <p className="text-[10px] font-black uppercase text-blue-600">النطاق الزمني</p>
                <p className="text-sm font-bold">آخر 180 يوماً</p>
            </div>
        </div>
      </div>

      <Card className="border-primary/10 shadow-2xl bg-card/50 backdrop-blur-xl overflow-hidden">
        <CardHeader className="bg-muted/30 border-b p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <CardTitle className="text-lg font-black">منحنى التصاعد التراكمي</CardTitle>
                    <CardDescription className="text-xs">مقارنة بين اكتساب الجمهور وتدفق المعروض.</CardDescription>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                        <span className="text-xs font-bold">المنتسبون</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_rgba(190,174,119,0.5)]" />
                        <span className="text-xs font-bold">الرحلات</span>
                    </div>
                </div>
            </div>
        </CardHeader>
        <CardContent className="p-6 h-[500px]">
            {loading ? (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4 opacity-30">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="font-black text-lg animate-pulse">جاري استرجاع الحقيقة...</p>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={growth} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorUsersDeep" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorTripsDeep" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#beae77" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#beae77" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                        <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                        <Tooltip contentStyle={{ backgroundColor: '#1F0A10', border: '1px solid #beae77', borderRadius: '12px' }} />
                        <Area type="monotone" dataKey="users" name="الجمهور" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorUsersDeep)" />
                        <Area type="monotone" dataKey="trips" name="الرحلات" stroke="#beae77" strokeWidth={4} fillOpacity={1} fill="url(#colorTripsDeep)" />
                    </AreaChart>
                </ResponsiveContainer>
            )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-primary/5 border-primary/10">
              <CardContent className="p-6 space-y-2">
                  <h4 className="font-bold text-primary flex items-center gap-2"><Info className="h-4 w-4" /> تحليل الكثافة</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                      يُظهر المخطط التوازن بين العرض والطلب. تمَّ تثبيت السياق الجغرافي بناءً على آخر معايرة سيادية لك.
                  </p>
              </CardContent>
          </Card>
      </div>

    </div>
  );
}
