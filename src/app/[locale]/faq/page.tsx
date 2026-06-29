// app/[locale]/faq/page.tsx
//
// Server-rendered FAQ page for GEO (Generative Engine Optimization).
// Two things make this page useful for AI citation, not just human readers:
//  1. The Q&A content is rendered as real, visible HTML on the server
//     (no client-only rendering, no content hidden behind JS or a login).
//  2. The exact same Q&A pairs are wrapped in FAQPage JSON-LD, so AI
//     crawlers (ChatGPT, Perplexity, Google AI Overviews, etc.) get an
//     unambiguous, structured version of the same content — never a
//     mismatch between what's visible and what's in the schema.
//
// The content itself lives in a single source of truth (TRAVELER_FAQ) that
// is also used to ground the in-app assistant's answers. Update answers
// there; this page and the assistant will both stay in sync automatically.

import type { Metadata } from 'next';
import { TRAVELER_FAQ } from '@/lib/geo/traveler-faq';

export async function generateMetadata({
    params,
}: {
    params: { locale: string };
}): Promise<Metadata> {
    const isAr = params.locale === 'ar';
    return {
        title: isAr
            ? 'الأسئلة الشائعة عن الحجز والتذاكر'
            : 'Frequently Asked Questions — Booking & Tickets',
        description: isAr
            ? 'إجابات مباشرة عن حجز الرحلات، العربون، التذاكر الرقمية، والإلغاء على منصة سفريات.'
            : 'Direct answers about booking trips, deposits, digital tickets, and cancellations on Safaryat.',
        alternates: {
            canonical: `https://safaryat.net/${params.locale}/faq`,
        },
    };
}

const CATEGORY_LABELS: Record<string, { ar: string; en: string }> = {
    booking: { ar: 'الحجز', en: 'Booking' },
    payment: { ar: 'الدفع والعربون', en: 'Payment & Deposit' },
    ticket: { ar: 'التذكرة الرقمية', en: 'Digital Ticket' },
    cancellation: { ar: 'الإلغاء والتعديل', en: 'Cancellation' },
    communication: { ar: 'التواصل مع الناقل', en: 'Communicating with the Carrier' },
    account: { ar: 'الحساب الشخصي', en: 'Your Account' },
    'cross-border': { ar: 'السفر بين الدول', en: 'Cross-Border Travel' },
};

export default function FaqPage({ params }: { params: { locale: string } }) {
    const isAr = params.locale === 'ar';

    // FAQPage JSON-LD — same questions/answers as the visible content below.
    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: TRAVELER_FAQ.map((entry) => ({
            '@type': 'Question',
            name: entry.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: entry.answer,
            },
        })),
    };

    const grouped = TRAVELER_FAQ.reduce<Record<string, typeof TRAVELER_FAQ>>((acc, entry) => {
        (acc[entry.category] ||= []).push(entry);
        return acc;
    }, {});

    return (
        <main id="main-content" className="max-w-3xl mx-auto px-4 py-10">
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <script
                type="application/ld+json"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            <h1 className="text-2xl font-bold mb-2">
                {isAr ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
            </h1>
            <p className="text-muted-foreground mb-8">
                {isAr
                    ? 'إجابات مباشرة عن حجز رحلتك، الدفع، التذكرة الرقمية، والتواصل مع الناقل.'
                    : 'Direct answers about booking your trip, payment, your digital ticket, and contacting the carrier.'}
            </p>

            {Object.entries(grouped).map(([category, entries]) => (
                <section key={category} className="mb-8">
                    <h2 className="text-lg font-semibold mb-4">
                        {isAr ? CATEGORY_LABELS[category]?.ar : CATEGORY_LABELS[category]?.en}
                    </h2>
                    <div className="space-y-6">
                        {entries.map((entry) => (
                            <article key={entry.id}>
                                <h3 className="font-medium mb-1">{entry.question}</h3>
                                <p className="text-muted-foreground leading-relaxed">{entry.answer}</p>
                            </article>
                        ))}
                    </div>
                </section>
            ))}
        </main>
    );
}
