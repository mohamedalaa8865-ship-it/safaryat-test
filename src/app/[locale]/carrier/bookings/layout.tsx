'use client';

import { type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Inbox } from 'lucide-react';

export default function CarrierBookingsLayout({ children }: { children: ReactNode }) {
    const t = useTranslations('bookingRequests');

    return (
        <div className="min-h-screen w-full pt-8">
            {/* Page Header */}
            <div className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/10 p-5 sm:p-6">
                <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-primary/5 blur-2xl pointer-events-none" />
                <div className="absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-primary/8 blur-xl pointer-events-none" />

                <div className="relative flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                        <Inbox className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                        <h1 className="text-lg sm:text-xl font-black tracking-tight text-foreground truncate">
                            {t('title')}
                        </h1>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">
                            {t('description')}
                        </p>
                    </div>
                </div>
            </div>

            <main className="w-full">
                {children}
            </main>
        </div>
    );
}