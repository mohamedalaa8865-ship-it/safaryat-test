
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import './globals.css';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import AppProviders from '@/components/layout/app-providers';
import { NetworkIndicator } from '@/components/layout/network-indicator';
import { PwaInstallPrompt } from '@/components/layout/pwa-install-prompt';
import type { Metadata } from 'next';
import { Tajawal } from 'next/font/google';

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-tajawal',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isAr = params.locale === 'ar';

  return {
    title: isAr ? 'سفريات — الوسيط الأول للسفر البري' : 'Safaryat — #1 Overland Travel Broker',
    description: isAr
      ? 'احجز رحلتك البرية بسهولة مع أفضل الناقلين بأسعار شفافة في جميع أنحاء المنطقة'
      : 'Book your overland trip with trusted carriers at transparent prices across the region.',
    keywords: isAr
      ? ['سفريات', 'حجز رحلات', 'نقل بري', 'ناقلون', 'سفر بين الدول']
      : ['Safaryat', 'overland travel', 'bus booking', 'land transport', 'travel broker'],
    openGraph: {
      title: isAr ? 'سفريات — الوسيط الأول للسفر البري' : 'Safaryat — #1 Overland Travel',
      description: isAr
        ? 'منصة السفر البري الأولى في المنطقة'
        : 'The leading overland travel platform in the region',
      url: 'https://safaryat.net',
      siteName: 'Safaryat',
      locale: isAr ? 'ar_AR' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: isAr ? 'سفريات' : 'Safaryat',
      description: isAr ? 'احجز رحلتك البرية بسهولة' : 'Book your overland trip easily',
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: 'https://safaryat.net',
      languages: {
        'ar': 'https://safaryat.net/ar',
        'en': 'https://safaryat.net/en',
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = (await import(`@/messages/${locale}.json`)).default;
  const logoImage = PlaceHolderImages.find((img) => img.id === 'safar-logo');
  const isRTL = locale === 'ar';

  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'} className="dark" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#321118" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="manifest" href="/manifest.json" />
        {logoImage && <link rel="apple-touch-icon" href={logoImage.imageUrl} />}

        <meta name="application-name" content="Safar Gate" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Safar Gate" />

        {/* [SC-572] Sovereign Auto-Recovery: Prevents ChunkLoadError white-screens */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('error', function(e) {
                if (e.message && e.message.includes('ChunkLoadError')) {
                  const lastReload = localStorage.getItem('safar_last_reload');
                  const now = Date.now();
                  if (!lastReload || now - parseInt(lastReload) > 10000) {
                    localStorage.setItem('safar_last_reload', now.toString());
                    window.location.reload();
                  }
                }
              });
            `,
          }}
        />
      </head>
      <body className={`${tajawal.variable} font-body antialiased min-h-screen bg-background`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <AppProviders>
            <NetworkIndicator />
            {children}
            <PwaInstallPrompt />
          </AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}