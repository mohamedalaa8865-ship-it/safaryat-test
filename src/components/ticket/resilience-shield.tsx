'use client';

/**
 * @component ResilienceShield
 * @description THE REINFORCED FALLBACK UI (SCR-930 - DIAMOND STERILIZED)
 * [PROTOCOL 16]: Dumb UI. Consumes state from useAtomicAction.
 * [PROTOCOL 43]: Independent UI Island. 
 * [CSS FREEZE]: Respects existing color palette and geometry.
 */

import React from 'react';
import { WifiOff, CreditCard, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ResilienceShieldProps {
    state: 'idle' | 'executing' | 'offline_vault' | 'payment_fallback' | 'fatal_error' | 'success';
    onRetry: () => void;
    onConvertToCash: () => void;
    traceId: string | null;
    children: React.ReactNode;
}

export function ResilienceShield({ state, onRetry, onConvertToCash, traceId, children }: ResilienceShieldProps) {
    if (state === 'idle' || state === 'executing' || state === 'success') {
        return (
            <div className={cn("transition-opacity duration-300", state === 'executing' && "opacity-50 pointer-events-none")}>
                {children}
            </div>
        );
    }

    return (
        <div className="animate-in fade-in zoom-in-95 duration-500">
            {/* Shield 1: Offline Vault */}
            {state === 'offline_vault' && (
                <div className="p-6 bg-green-500/10 border-2 border-green-500/20 rounded-[2.5rem] text-center space-y-4 shadow-xl">
                    <div className="mx-auto w-14 h-14 bg-green-500 text-black rounded-full flex items-center justify-center shadow-lg">
                        <WifiOff className="h-7 w-7" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-xl font-black text-green-400 uppercase tracking-tighter">تم حفظ الطلب محلياً</h3>
                        <p className="text-xs font-bold text-muted-foreground leading-relaxed">
                            الشبكة ضعيفة حالياً. بياناتك في مأمن "الخزنة الخضراء". انقر لإعادة الإرسال فور عودة الاتصال.
                        </p>
                    </div>
                    <Button onClick={onRetry} className="w-full h-14 bg-green-600 hover:bg-green-700 text-white font-black rounded-2xl gap-2 shadow-lg active:scale-95 transition-all">
                        <RefreshCw className="h-5 w-5" /> إعادة المحاولة الذرية
                    </Button>
                </div>
            )}

            {/* Shield 2: Payment Fallback */}
            {state === 'payment_fallback' && (
                <div className="p-6 bg-orange-500/10 border-2 border-orange-500/20 rounded-[2.5rem] text-center space-y-4 shadow-xl">
                    <div className="mx-auto w-14 h-14 bg-orange-500 text-black rounded-full flex items-center justify-center shadow-lg">
                        <CreditCard className="h-7 w-7" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-xl font-black text-orange-400 uppercase tracking-tighter">اضطراب في بوابة الدفع</h3>
                        <p className="text-xs font-bold text-muted-foreground leading-relaxed">
                            تم رفض العملية البنكية. لحماية حجزك من الضياع، يمكنك التحويل للدفع النقدي المباشر للقائد.
                        </p>
                    </div>
                    <Button onClick={onConvertToCash} className="w-full h-14 bg-orange-600 hover:bg-orange-700 text-white font-black rounded-2xl shadow-lg active:scale-95 transition-all">
                        تأكيد الدفع عند الركوب
                    </Button>
                </div>
            )}

            {/* Shield 3: Diagnostic Bridge (Fatal) */}
            {state === 'fatal_error' && (
                <div className="p-6 bg-red-500/10 border-2 border-red-500/20 rounded-[2.5rem] text-center space-y-4 shadow-xl">
                    <div className="mx-auto w-14 h-14 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg">
                        <AlertTriangle className="h-7 w-7" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-xl font-black text-red-400 uppercase tracking-tighter">حدث تعارض سيادي</h3>
                        <p className="text-xs font-bold text-muted-foreground leading-relaxed">
                            عذراً، لم نتمكن من إنفاذ الطلب. يرجى تزويد الدعم الفني بالرمز الجنائي التالي:
                        </p>
                    </div>
                    <div className="bg-black/40 py-3 rounded-2xl border border-red-500/30 font-mono text-red-500 font-black tracking-[0.2em] text-lg shadow-inner">
                        {traceId || 'ERR-UNKNOWN'}
                    </div>
                    <Button variant="outline" onClick={onRetry} className="w-full h-12 border-red-500/30 text-red-400 font-black rounded-xl">
                        إعادة محاولة الاتصال
                    </Button>
                </div>
            )}
        </div>
    );
}
