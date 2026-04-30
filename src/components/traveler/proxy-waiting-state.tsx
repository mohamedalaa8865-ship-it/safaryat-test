'use client';

import React from 'react';
import { Radar, ShieldCheck, Clock, MapPin } from 'lucide-react';
import type { Trip } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';

/**
 * @component ProxyWaitingState
 * @description THE REINFORCED WAITING RADAR (STERILIZED - V4.0 - GRAND PURGE)
 * [V4.0]: [SCR-921] Dumb UI Island. Eradicated Ghost Twin calculations.
 * Protocol 16: Dumb UI. Protocol 88: Zero-Waste.
 */
interface ProxyWaitingStateProps {
  trip: Trip | null;
  serverTime?: Date;
}

export function ProxyWaitingState({ trip, serverTime }: ProxyWaitingStateProps) {
  // [SCR-921] SSOT: Trusting the backend 'offersCount' field explicitly
  const offersCount = trip?.offersCount || 0;

  if (!trip) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Card className="border-primary border-2 bg-primary/5 mb-4 overflow-hidden shadow-2xl rounded-[3rem] relative">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <MapPin className="h-32 w-32" />
            </div>
            <CardContent className="p-8 text-center space-y-6">
                
                {offersCount > 0 ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-[2.5rem] flex flex-col items-center gap-4 animate-in zoom-in duration-500">
                        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-emerald-500/20 text-emerald-500 shadow-inner">
                            <span className="text-3xl font-black">{offersCount}</span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-tighter">تلقينا عروضاً لرحلتك!</h3>
                            <p className="text-xs font-bold text-muted-foreground leading-relaxed px-2">
                                الوكيل السيادي يقوم الآن بفحص العروض المتاحة لضمان أفضل جودة وسعر لك.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto border border-primary/20">
                            <Radar className="h-12 w-12 text-primary animate-pulse" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black tracking-tight text-foreground">جاري مسح الرادار...</h2>
                            <p className="text-sm text-muted-foreground font-bold leading-relaxed px-4">
                                أيها المسافر، تمَّ استلام طلبك عبر الوكيل. نحن الآن نعرض طلبك على شبكة الناقلين المعتمدين لجمع أفضل العروض.
                            </p>
                        </div>
                    </div>
                )}

                <div className="bg-muted/30 p-4 rounded-2xl text-right space-y-2">
                    <p className="text-[10px] font-black uppercase text-primary tracking-widest">موجز الرحلة المحجوزة:</p>
                    <div className="flex justify-between items-center text-xs font-bold border-b border-white/5 pb-2">
                        <span className="text-muted-foreground">المسار:</span>
                        <span>{trip.origin} ⬅ {trip.destination}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-bold pt-1">
                        <span className="text-muted-foreground">تاريخ الانطلاق:</span>
                        <span>{new Date(trip.departureDate).toLocaleDateString('ar-SA')}</span>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-2 pt-2">
                    <Clock className="h-3 w-3 text-primary animate-pulse" />
                    <p className="text-[10px] text-muted-foreground italic font-medium">
                        سيتم تحديث هذه الشاشة آلياً فور تأكيد الحجز.
                    </p>
                </div>
            </CardContent>
        </Card>

        <div className="bg-primary/5 p-4 rounded-3xl border border-primary/10 flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <p className="text-[10px] font-bold text-muted-foreground">طلبك موثق رقمياً ومحمي بختم سفريات السيادي.</p>
        </div>
    </div>
  );
}
