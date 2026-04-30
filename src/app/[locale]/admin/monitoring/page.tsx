'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Globe2, TrendingUp, DollarSign, Zap, Clock, ShieldCheck } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useDailyPulse } from '@/hooks/use-daily-pulse';

/**
 * @page WarRoomDashboard
 * @description THE SOVEREIGN WAR ROOM (DIAMOND STERILIZED - SC-804)
 * [PROTOCOL 88]: Uses Aggregated Daily Pulse ($0 Waste).
 * [PROTOCOL 30]: Passive analytical view. Zero operational interference.
 */
export default function PulseMonitoringPage() {
  const { pulseData, isLoading } = useDailyPulse();

  const grandTotals = useMemo(() => {
    return pulseData.reduce((acc, curr) => ({
      activeTrips: acc.activeTrips + (curr.activeTrips || 0),
      totalTripsToday: acc.totalTripsToday + (curr.totalTripsToday || 0),
      dailyBookings: acc.dailyBookings + (curr.dailyBookings || 0),
      dailyRevenue: acc.dailyRevenue + (curr.dailyRevenue || 0),
    }), { activeTrips: 0, totalTripsToday: 0, dailyBookings: 0, dailyRevenue: 0 });
  }, [pulseData]);

  if (isLoading) {
      return (
          <div className="p-8 space-y-6 animate-pulse">
              <Skeleton className="h-12 w-1/3 rounded-xl" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
              </div>
              <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
      );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700 p-2 md:p-6" dir="rtl">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b pb-6 border-slate-200/50">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3 text-slate-900">
            <Activity className="h-8 w-8 text-primary animate-pulse" />
            غرفة العمليات الاستخباراتية (War Room)
          </h1>
          <p className="text-muted-foreground text-sm mt-2 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-green-600" />
              رصد حي للإيرادات، النمو، والتدفق الميداني [SC-804].
          </p>
        </div>
        <Badge variant="outline" className="bg-black text-green-400 border-green-500/30 px-3 py-1 font-mono text-xs uppercase tracking-widest shadow-inner">
           ● Live Pulse Artery
        </Badge>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-600 shadow-sm bg-gradient-to-br from-blue-50/50 to-transparent">
          <CardContent className="p-5 flex flex-col gap-2">
              <div className="flex justify-between items-start">
                  <p className="text-xs font-black text-slate-500 uppercase tracking-wider">الإيرادات اللحظية</p>
                  <div className="p-2 bg-blue-100 rounded-full"><DollarSign className="h-4 w-4 text-blue-700" /></div>
              </div>
              <h3 className="text-3xl font-black text-slate-900">{grandTotals.dailyRevenue.toFixed(2)} <span className="text-sm font-bold text-muted-foreground">JOD</span></h3>
              <p className="text-[10px] text-muted-foreground mt-1 font-bold italic">إجمالي عمولات المسافرين اليوم</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 shadow-sm bg-gradient-to-br from-green-50/50 to-transparent">
          <CardContent className="p-5 flex flex-col gap-2">
              <div className="flex justify-between items-start">
                  <p className="text-xs font-black text-slate-500 uppercase tracking-wider">نبض الميدان</p>
                  <div className="p-2 bg-green-100 rounded-full"><Zap className="h-4 w-4 text-green-700" /></div>
              </div>
              <div className="flex items-end gap-2">
                  <h3 className="text-3xl font-black text-slate-900">{grandTotals.activeTrips}</h3>
                  <span className="text-sm font-bold text-green-600 mb-1 animate-pulse">نشطة الآن</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1 font-bold italic">من أصل {grandTotals.totalTripsToday} رحلة انطلقت اليوم</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 shadow-sm bg-gradient-to-br from-amber-50/50 to-transparent">
          <CardContent className="p-5 flex flex-col gap-2">
              <div className="flex justify-between items-start">
                  <p className="text-xs font-black text-slate-500 uppercase tracking-wider">حجوزات مؤكدة</p>
                  <div className="p-2 bg-amber-100 rounded-full"><TrendingUp className="h-4 w-4 text-amber-700" /></div>
              </div>
              <h3 className="text-3xl font-black text-slate-900">{grandTotals.dailyBookings}</h3>
              <p className="text-[10px] text-muted-foreground mt-1 font-bold italic">مقعد تمَّ حجزه اليوم</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-600 shadow-sm bg-gradient-to-br from-purple-50/50 to-transparent">
          <CardContent className="p-5 flex flex-col gap-2">
              <div className="flex justify-between items-start">
                  <p className="text-xs font-black text-slate-500 uppercase tracking-wider">الدول النشطة</p>
                  <div className="p-2 bg-purple-100 rounded-full"><Globe2 className="h-4 w-4 text-purple-700" /></div>
              </div>
              <h3 className="text-3xl font-black text-slate-900">{pulseData.length}</h3>
              <p className="text-[10px] text-muted-foreground mt-1 font-bold italic">قطاعات جغرافية سجلت حركة</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg border-slate-200/60 overflow-hidden bg-card/50 backdrop-blur-md">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
          <CardTitle className="text-lg font-black flex items-center gap-2">
             <Globe2 className="h-5 w-5 text-primary" /> مصفوفة النبض الجغرافي (Heat Matrix)
          </CardTitle>
          <CardDescription className="text-xs font-bold text-muted-foreground">توزيع النشاط المالي والتشغيلي لليوم الحالي.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
            {pulseData.length === 0 ? (
                <div className="p-16 text-center text-muted-foreground flex flex-col items-center gap-2 opacity-30">
                    <Clock className="h-10 w-10" />
                    <p className="font-bold text-sm">لم تُسجل أي حركة تشغيلية في أي قطاع حتى الآن.</p>
                </div>
            ) : (
                <Table>
                    <TableHeader className="bg-muted/10">
                        <TableRow>
                            <TableHead className="text-right font-black py-4">القطاع (الدولة)</TableHead>
                            <TableHead className="text-center font-black">رحلات جارية</TableHead>
                            <TableHead className="text-center font-black">إجمالي انطلاقات اليوم</TableHead>
                            <TableHead className="text-center font-black">حجوزات (مقاعد)</TableHead>
                            <TableHead className="text-left font-black">الإيراد اليومي</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pulseData.map((stat) => (
                            <TableRow key={stat.id} className="hover:bg-primary/5 transition-colors border-primary/5 group">
                                <TableCell className="font-bold">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-sm font-black">{stat.country === 'GENERIC' ? 'المركز الرئيسي' : stat.country}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge variant="outline" className="font-mono font-bold bg-green-50 text-green-700 border-green-200 px-3">
                                        {stat.activeTrips || 0}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-center font-mono font-bold text-slate-700">{stat.totalTripsToday || 0}</TableCell>
                                <TableCell className="text-center font-mono font-bold text-amber-700">{stat.dailyBookings || 0}</TableCell>
                                <TableCell className="text-left font-mono font-black text-blue-700">
                                    {(stat.dailyRevenue || 0).toFixed(2)} JOD
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </CardContent>
      </Card>

      <div className="p-4 bg-muted/20 rounded-2xl border-2 border-dashed border-primary/10 flex items-center gap-4">
          <ShieldCheck className="h-6 w-6 text-primary/40" />
          <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">
            <strong>قانون غرفة العمليات [SC-804]:</strong> تعتمد هذه البيانات على النبض التجميعي اللحظي. يتم تصفير العدادات آلياً عند منتصف الليل. القراءة تتم بصفر هدر للموارد عبر وثيقة تجميع واحدة لكل قطاع.
          </p>
      </div>
    </div>
  );
}
