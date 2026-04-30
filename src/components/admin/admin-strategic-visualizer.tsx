'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { TrendingUp, MapPin, Zap, Info, Loader2, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { LocalErrorBoundary } from '@/components/ui/local-error-boundary';

interface AdminStrategicVisualizerProps {
  country: string;
  growth: any[];
  dailyVolume: any[];
  routes: any[];
  isLoading: boolean;
}

/**
 * @component AdminStrategicVisualizer
 * @description THE REINFORCED VISUAL ISLAND (PROTOCOL 43 - SC-802 - SCR-936 PATCHED)
 * [SCR-936]: Injected Diamond Shield to prevent White Screen on undefined map.
 * [SC-802]: Dumb UI Island. Strictly decoupled from data fetching.
 * Protected by internal local error boundaries to prevent Domino Effect.
 */
export function AdminStrategicVisualizer({ country, growth, dailyVolume, routes, isLoading }: AdminStrategicVisualizerProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const COLORS = useMemo(() => ['#beae77', '#632139', '#3b82f6', '#22c55e', '#f59e0b'], []);
  const CHART_HEIGHT = "h-[450px]";

  // [PROTOCOL 20]: Diamond Shield - الإعدام الفوري لخطأ (undefined map)
  const maxPulseValue = useMemo(() => {
    // 1. صد الهجوم: إذا كانت البيانات غير موجودة أو ليست مصفوفة، أرجع 0 فوراً (Graceful Degradation)
    if (!dailyVolume || !Array.isArray(dailyVolume) || dailyVolume.length === 0) {
      return 0;
    }
    
    // 2. التنفيذ الآمن: استخدام الحماية الاختيارية (?.) في حال كان أحد العناصر تالفاً
    return Math.max(...dailyVolume.map(d => d?.trips || 0), 0);
  }, [dailyVolume]);

  if (!mounted) return <div className="h-[500px] w-full bg-muted/10 animate-pulse rounded-2xl" />;

  return (
    <LocalErrorBoundary fallbackTitle="تعثر محرك التصوير الاستراتيجي">
      <Card className="border-primary/10 shadow-2xl overflow-hidden bg-card/50 backdrop-blur-md relative z-10">
        <CardHeader className="bg-muted/30 border-b p-6 flex flex-row items-center justify-between">
              <div>
                  <CardTitle className="text-xl font-black flex items-center gap-2">
                      <Activity className="h-6 w-6 text-primary animate-pulse" />
                      مركز الاستخبارات الإستراتيجية
                  </CardTitle>
                  <CardDescription>الرؤية البصرية الشاملة: {country === 'all' ? 'النطاق العالمي' : country}</CardDescription>
              </div>
              <div className="bg-primary/10 px-4 py-1.5 rounded-full text-[10px] font-bold text-primary flex items-center gap-2 border border-primary/20">
                  <Info className="h-3 w-3" /> SOVEREIGN ANALYTICS
              </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <Tabs defaultValue="growth" className="space-y-8">
            <TabsList className="bg-background border p-1 h-14 w-full grid grid-cols-3 shadow-sm rounded-xl">
              <TabsTrigger value="growth" className="h-full font-bold gap-2 data-[state=active]:bg-primary transition-all">
                  <TrendingUp className="h-4 w-4" /> <span className="hidden md:inline">نمو القلعة</span>
              </TabsTrigger>
              <TabsTrigger value="routes" className="h-full font-bold gap-2 data-[state=active]:bg-primary transition-all">
                  <MapPin className="h-4 w-4" /> <span className="hidden md:inline">حيوية المسارات</span>
              </TabsTrigger>
              <TabsTrigger value="daily" className="h-full font-bold gap-2 data-[state=active]:bg-primary transition-all">
                  <Zap className="h-4 w-4" /> <span className="hidden md:inline">النبض اليومي</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="growth" className="animate-in slide-in-from-bottom-4 duration-500">
              {isLoading ? (
                  <div className={`${CHART_HEIGHT} w-full flex flex-col items-center justify-center bg-muted/5 rounded-xl border border-dashed`}>
                      <Loader2 className="h-10 w-10 animate-spin text-primary/50" />
                      <p className="text-xs font-bold mt-4 text-muted-foreground animate-pulse">جاري مزامنة التاريخ...</p>
                  </div>
              ) : (
                  <div className={CHART_HEIGHT}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={growth || []} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorUsersMain" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#beae77" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#beae77" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorTripsMain" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#632139" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#632139" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                        <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                        <Tooltip contentStyle={{ backgroundColor: '#1F0A10', border: '1px solid #beae77', borderRadius: '12px' }} />
                        <Area type="monotone" dataKey="users" name="الجمهور" stroke="#beae77" strokeWidth={4} fillOpacity={1} fill="url(#colorUsersMain)" />
                        <Area type="monotone" dataKey="trips" name="الرحلات" stroke="#632139" strokeWidth={4} fillOpacity={1} fill="url(#colorTripsMain)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
              )}
            </TabsContent>

            <TabsContent value="routes" className="animate-in zoom-in-95 duration-500">
              {isLoading ? (
                  <div className={`${CHART_HEIGHT} w-full flex items-center justify-center opacity-20`}><Loader2 className="h-12 w-12 animate-spin" /></div>
              ) : (
                  <div className="grid md:grid-cols-5 gap-8 items-center h-[400px]">
                      <div className="md:col-span-2 h-full relative">
                          <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                  <Pie data={routes || []} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" stroke="none">
                                      {(routes || []).map((entry, index) => (
                                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                      ))}
                                  </Pie>
                                  <Tooltip contentStyle={{ backgroundColor: '#1F0A10', border: '1px solid #beae77', borderRadius: '12px' }} />
                              </PieChart>
                          </ResponsiveContainer>
                          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                              <span className="text-3xl font-black text-primary">{(routes || []).reduce((a, b) => a + (b?.value || 0), 0)}</span>
                              <span className="text-[10px] text-muted-foreground font-black tracking-widest uppercase">مجموع الحيوية</span>
                          </div>
                      </div>
                      
                      <div className="md:col-span-3 h-full overflow-y-auto space-y-4 flex flex-col justify-center pr-2">
                          <div className="flex items-center justify-between border-b pb-2">
                              <h4 className="font-black text-sm text-primary uppercase flex items-center gap-2">
                                  <MapPin className="h-4 w-4" /> قائمة الشرف للمسارات
                              </h4>
                          </div>
                          {routes && routes.length > 0 ? routes.map((route, i) => (
                              <div key={i} className="group flex flex-col gap-1.5 p-3 rounded-xl hover:bg-muted/10 transition-colors border border-transparent hover:border-primary/10">
                                  <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                          <span className="text-xs font-bold">{route.name}</span>
                                      </div>
                                      <Badge variant="secondary" className="h-5 px-1.5 font-mono text-[10px] font-black">{route.value}</Badge>
                                  </div>
                                  <div className="h-1.5 w-full bg-muted/20 rounded-full overflow-hidden">
                                      <div className="h-full transition-all duration-1000" style={{ width: `${(route.value / (routes[0]?.value || 1)) * 100}%`, backgroundColor: COLORS[i % COLORS.length] }} />
                                  </div>
                              </div>
                          )) : <div className="text-center text-xs opacity-50">لا توجد بيانات مسارات كافية.</div>}
                      </div>
                  </div>
              )}
            </TabsContent>

            <TabsContent value="daily" className="animate-in slide-in-from-left-4 duration-500">
              {isLoading ? (
                  <div className={`${CHART_HEIGHT} w-full flex flex-col items-center justify-center bg-muted/5 rounded-xl border border-dashed border-muted`}>
                      <Loader2 className="h-10 w-10 animate-spin text-primary/50" />
                      <p className="text-xs font-bold mt-4 text-muted-foreground animate-pulse">جاري معايرة النبض...</p>
                  </div>
              ) : (
                  <div className={CHART_HEIGHT}>
                      <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={dailyVolume || []} margin={{ top: 20 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                              <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                              <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                              <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#1F0A10', border: '1px solid #beae77', borderRadius: '12px' }} />
                              <Bar dataKey="trips" radius={[10, 10, 0, 0]} barSize={60}>
                                  {(dailyVolume || []).map((entry, index) => {
                                      let fill = '#333'; 
                                      if (entry?.trips > 0) {
                                          fill = (entry.trips === maxPulseValue) ? '#22c55e' : '#beae77';
                                      }
                                      return <Cell key={`cell-${index}`} fill={fill} />;
                                  })}
                              </Bar>
                          </BarChart>
                      </ResponsiveContainer>
                  </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </LocalErrorBoundary>
  );
}
