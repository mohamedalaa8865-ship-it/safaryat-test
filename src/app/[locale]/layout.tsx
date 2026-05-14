
// // // // // // // // import { NextIntlClientProvider } from 'next-intl';
// // // // // // // // import { notFound } from 'next/navigation';
// // // // // // // // import { routing } from '@/i18n/routing';
// // // // // // // // import './globals.css';
// // // // // // // // import { PlaceHolderImages } from '@/lib/placeholder-images';
// // // // // // // // import AppProviders from '@/components/layout/app-providers';
// // // // // // // // import { NetworkIndicator } from '@/components/layout/network-indicator';
// // // // // // // // import { PwaInstallPrompt } from '@/components/layout/pwa-install-prompt';
// // // // // // // // import type { Metadata } from 'next';
// // // // // // // // import { Tajawal } from 'next/font/google';

// // // // // // // // const tajawal = Tajawal({
// // // // // // // //   subsets: ['arabic'],
// // // // // // // //   weight: ['400', '700'],
// // // // // // // //   display: 'swap',
// // // // // // // //   variable: '--font-tajawal',
// // // // // // // // });

// // // // // // // // export function generateStaticParams() {
// // // // // // // //   return routing.locales.map((locale) => ({ locale }));
// // // // // // // // }

// // // // // // // // export async function generateMetadata({
// // // // // // // //   params
// // // // // // // // }: {
// // // // // // // //   params: { locale: string };
// // // // // // // // }): Promise<Metadata> {
// // // // // // // //   const isAr = params.locale === 'ar';

// // // // // // // //   return {
// // // // // // // //     title: isAr ? 'سفريات — الوسيط الأول للسفر البري' : 'Safaryat — #1 Overland Travel Broker',
// // // // // // // //     description: isAr
// // // // // // // //       ? 'احجز رحلتك البرية بسهولة مع أفضل الناقلين بأسعار شفافة في جميع أنحاء المنطقة'
// // // // // // // //       : 'Book your overland trip with trusted carriers at transparent prices across the region.',
// // // // // // // //     keywords: isAr
// // // // // // // //       ? ['سفريات', 'حجز رحلات', 'نقل بري', 'ناقلون', 'سفر بين الدول']
// // // // // // // //       : ['Safaryat', 'overland travel', 'bus booking', 'land transport', 'travel broker'],
// // // // // // // //     openGraph: {
// // // // // // // //       title: isAr ? 'سفريات — الوسيط الأول للسفر البري' : 'Safaryat — #1 Overland Travel',
// // // // // // // //       description: isAr
// // // // // // // //         ? 'منصة السفر البري الأولى في المنطقة'
// // // // // // // //         : 'The leading overland travel platform in the region',
// // // // // // // //       url: 'https://safaryat.net',
// // // // // // // //       siteName: 'Safaryat',
// // // // // // // //       locale: isAr ? 'ar_AR' : 'en_US',
// // // // // // // //       type: 'website',
// // // // // // // //     },
// // // // // // // //     twitter: {
// // // // // // // //       card: 'summary_large_image',
// // // // // // // //       title: isAr ? 'سفريات' : 'Safaryat',
// // // // // // // //       description: isAr ? 'احجز رحلتك البرية بسهولة' : 'Book your overland trip easily',
// // // // // // // //     },
// // // // // // // //     robots: {
// // // // // // // //       index: true,
// // // // // // // //       follow: true,
// // // // // // // //     },
// // // // // // // //     alternates: {
// // // // // // // //       canonical: 'https://safaryat.net',
// // // // // // // //       languages: {
// // // // // // // //         'ar': 'https://safaryat.net/ar',
// // // // // // // //         'en': 'https://safaryat.net/en',
// // // // // // // //       },
// // // // // // // //     },
// // // // // // // //   };
// // // // // // // // }

// // // // // // // // export default async function LocaleLayout({
// // // // // // // //   children,
// // // // // // // //   params
// // // // // // // // }: {
// // // // // // // //   children: React.ReactNode;
// // // // // // // //   params: { locale: string };
// // // // // // // // }) {
// // // // // // // //   const { locale } = params;

// // // // // // // //   if (!routing.locales.includes(locale as any)) {
// // // // // // // //     notFound();
// // // // // // // //   }

// // // // // // // //   const messages = (await import(`@/messages/${locale}.json`)).default;
// // // // // // // //   const logoImage = PlaceHolderImages.find((img) => img.id === 'safar-logo');
// // // // // // // //   const isRTL = locale === 'ar';

// // // // // // // //   return (
// // // // // // // //     <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'} className="dark" suppressHydrationWarning>
// // // // // // // //       <head>
// // // // // // // //         <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
// // // // // // // //         <meta name="theme-color" content="#321118" />
// // // // // // // //         {/* <link rel="icon" href="/favicon.ico" /> */}
// // // // // // // //         <link rel="icon" href="/favicon.png" type="image/png" />
// // // // // // // //         <link rel="apple-touch-icon" href="/favicon.png" />
// // // // // // // //         <link rel="manifest" href="/manifest.json" />
// // // // // // // //         {logoImage && <link rel="apple-touch-icon" href={logoImage.imageUrl} />}

// // // // // // // //         <meta name="application-name" content="Safar Gate" />
// // // // // // // //         <meta name="apple-mobile-web-app-capable" content="yes" />
// // // // // // // //         <meta name="mobile-web-app-capable" content="yes" />
// // // // // // // //         <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
// // // // // // // //         <meta name="apple-mobile-web-app-title" content="Safar Gate" />

// // // // // // // //         {/* [SC-572] Sovereign Auto-Recovery: Prevents ChunkLoadError white-screens */}
// // // // // // // //         <script
// // // // // // // //           dangerouslySetInnerHTML={{
// // // // // // // //             __html: `
// // // // // // // //               window.addEventListener('error', function(e) {
// // // // // // // //                 if (e.message && e.message.includes('ChunkLoadError')) {
// // // // // // // //                   const lastReload = localStorage.getItem('safar_last_reload');
// // // // // // // //                   const now = Date.now();
// // // // // // // //                   if (!lastReload || now - parseInt(lastReload) > 10000) {
// // // // // // // //                     localStorage.setItem('safar_last_reload', now.toString());
// // // // // // // //                     window.location.reload();
// // // // // // // //                   }
// // // // // // // //                 }
// // // // // // // //               });
// // // // // // // //             `,
// // // // // // // //           }}
// // // // // // // //         />
// // // // // // // //       </head>
// // // // // // // //       <body className={`${tajawal.variable} font-body antialiased min-h-screen bg-background`}>
// // // // // // // //         <NextIntlClientProvider messages={messages} locale={locale}>
// // // // // // // //           <AppProviders>
// // // // // // // //             <NetworkIndicator />
// // // // // // // //             {children}
// // // // // // // //             <PwaInstallPrompt />
// // // // // // // //           </AppProviders>
// // // // // // // //         </NextIntlClientProvider>
// // // // // // // //       </body>
// // // // // // // //     </html>
// // // // // // // //   );
// // // // // // // // }
// // // // // // // import { NextIntlClientProvider } from 'next-intl';
// // // // // // // import { notFound } from 'next/navigation';
// // // // // // // import { routing } from '@/i18n/routing';
// // // // // // // import './globals.css';
// // // // // // // import { PlaceHolderImages } from '@/lib/placeholder-images';
// // // // // // // import AppProviders from '@/components/layout/app-providers';
// // // // // // // import { NetworkIndicator } from '@/components/layout/network-indicator';
// // // // // // // import { PwaInstallPrompt } from '@/components/layout/pwa-install-prompt';
// // // // // // // import type { Metadata } from 'next';
// // // // // // // import { Tajawal } from 'next/font/google';

// // // // // // // const tajawal = Tajawal({
// // // // // // //   subsets: ['arabic'],
// // // // // // //   weight: ['400', '700'],
// // // // // // //   display: 'swap',
// // // // // // //   variable: '--font-tajawal',
// // // // // // // });

// // // // // // // export function generateStaticParams() {
// // // // // // //   return routing.locales.map((locale) => ({ locale }));
// // // // // // // }

// // // // // // // export async function generateMetadata({
// // // // // // //   params
// // // // // // // }: {
// // // // // // //   params: { locale: string };
// // // // // // // }): Promise<Metadata> {
// // // // // // //   const isAr = params.locale === 'ar';

// // // // // // //   return {
// // // // // // //     title: isAr ? 'سفريات — الوسيط الأول للسفر البري' : 'Safaryat — #1 Overland Travel Broker',
// // // // // // //     description: isAr
// // // // // // //       ? 'احجز رحلتك البرية بسهولة مع أفضل الناقلين بأسعار شفافة في جميع أنحاء المنطقة'
// // // // // // //       : 'Book your overland trip with trusted carriers at transparent prices across the region.',
// // // // // // //     keywords: isAr
// // // // // // //       ? ['سفريات', 'حجز رحلات', 'نقل بري', 'ناقلون', 'سفر بين الدول']
// // // // // // //       : ['Safaryat', 'overland travel', 'bus booking', 'land transport', 'travel broker'],
// // // // // // //     openGraph: {
// // // // // // //       title: isAr ? 'سفريات — الوسيط الأول للسفر البري' : 'Safaryat — #1 Overland Travel',
// // // // // // //       description: isAr
// // // // // // //         ? 'منصة السفر البري الأولى في المنطقة'
// // // // // // //         : 'The leading overland travel platform in the region',
// // // // // // //       url: 'https://safaryat.net',
// // // // // // //       siteName: 'Safaryat',
// // // // // // //       locale: isAr ? 'ar_AR' : 'en_US',
// // // // // // //       type: 'website',
// // // // // // //     },
// // // // // // //     twitter: {
// // // // // // //       card: 'summary_large_image',
// // // // // // //       title: isAr ? 'سفريات' : 'Safaryat',
// // // // // // //       description: isAr ? 'احجز رحلتك البرية بسهولة' : 'Book your overland trip easily',
// // // // // // //     },
// // // // // // //     robots: {
// // // // // // //       index: true,
// // // // // // //       follow: true,
// // // // // // //     },
// // // // // // //     alternates: {
// // // // // // //       canonical: 'https://safaryat.net',
// // // // // // //       languages: {
// // // // // // //         'ar': 'https://safaryat.net/ar',
// // // // // // //         'en': 'https://safaryat.net/en',
// // // // // // //       },
// // // // // // //     },
// // // // // // //   };
// // // // // // // }

// // // // // // // export default async function LocaleLayout({
// // // // // // //   children,
// // // // // // //   params
// // // // // // // }: {
// // // // // // //   children: React.ReactNode;
// // // // // // //   params: { locale: string };
// // // // // // // }) {
// // // // // // //   const { locale } = params;

// // // // // // //   if (!routing.locales.includes(locale as any)) {
// // // // // // //     notFound();
// // // // // // //   }

// // // // // // //   const messages = (await import(`@/messages/${locale}.json`)).default;
// // // // // // //   const logoImage = PlaceHolderImages.find((img) => img.id === 'safar-logo');
// // // // // // //   const isRTL = locale === 'ar';

// // // // // // //   return (
// // // // // // //     <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'} className="dark" suppressHydrationWarning>
// // // // // // //       <head>
// // // // // // //         <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
// // // // // // //         <meta name="theme-color" content="#321118" />
// // // // // // //         <link rel="icon" href="/favicon.png" type="image/png" sizes="32x32" />
// // // // // // //         <link rel="icon" href="/favicon.webp" type="image/webp" sizes="32x32" />
// // // // // // //         <link rel="manifest" href="/manifest.json" />
// // // // // // //         {logoImage && <link rel="apple-touch-icon" href={logoImage.imageUrl} />}

// // // // // // //         <meta name="application-name" content="Safar Gate" />
// // // // // // //         <meta name="apple-mobile-web-app-capable" content="yes" />
// // // // // // //         <meta name="mobile-web-app-capable" content="yes" />
// // // // // // //         <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
// // // // // // //         <meta name="apple-mobile-web-app-title" content="Safar Gate" />

// // // // // // //         {/* [SC-572] Sovereign Auto-Recovery: Prevents ChunkLoadError white-screens */}
// // // // // // //         <script
// // // // // // //           dangerouslySetInnerHTML={{
// // // // // // //             __html: `
// // // // // // //               window.addEventListener('error', function(e) {
// // // // // // //                 if (e.message && e.message.includes('ChunkLoadError')) {
// // // // // // //                   const lastReload = localStorage.getItem('safar_last_reload');
// // // // // // //                   const now = Date.now();
// // // // // // //                   if (!lastReload || now - parseInt(lastReload) > 10000) {
// // // // // // //                     localStorage.setItem('safar_last_reload', now.toString());
// // // // // // //                     window.location.reload();
// // // // // // //                   }
// // // // // // //                 }
// // // // // // //               });
// // // // // // //             `,
// // // // // // //           }}
// // // // // // //         />
// // // // // // //       </head>
// // // // // // //       <body className={`${tajawal.variable} font-body antialiased min-h-screen bg-background`}>
// // // // // // //         <NextIntlClientProvider messages={messages} locale={locale}>
// // // // // // //           <AppProviders>
// // // // // // //             <NetworkIndicator />
// // // // // // //             {children}
// // // // // // //             <PwaInstallPrompt />
// // // // // // //           </AppProviders>
// // // // // // //         </NextIntlClientProvider>
// // // // // // //       </body>
// // // // // // //     </html>
// // // // // // //   );
// // // // // // // }

// // // // // // import { NextIntlClientProvider } from 'next-intl';
// // // // // // import { notFound } from 'next/navigation';
// // // // // // import { routing } from '@/i18n/routing';
// // // // // // import './globals.css';
// // // // // // import { PlaceHolderImages } from '@/lib/placeholder-images';
// // // // // // import AppProviders from '@/components/layout/app-providers';
// // // // // // import { NetworkIndicator } from '@/components/layout/network-indicator';
// // // // // // import { PwaInstallPrompt } from '@/components/layout/pwa-install-prompt';
// // // // // // import type { Metadata } from 'next';
// // // // // // import { Tajawal } from 'next/font/google';

// // // // // // const tajawal = Tajawal({
// // // // // //   subsets: ['arabic'],
// // // // // //   weight: ['400', '700'],
// // // // // //   display: 'swap',
// // // // // //   variable: '--font-tajawal',
// // // // // // });

// // // // // // export function generateStaticParams() {
// // // // // //   return routing.locales.map((locale) => ({ locale }));
// // // // // // }

// // // // // // export async function generateMetadata({
// // // // // //   params
// // // // // // }: {
// // // // // //   params: { locale: string };
// // // // // // }): Promise<Metadata> {
// // // // // //   const isAr = params.locale === 'ar';

// // // // // //   return {
// // // // // //     title: isAr ? 'سفريات — الوسيط الأول للسفر البري' : 'Safaryat — #1 Overland Travel Broker',
// // // // // //     description: isAr
// // // // // //       ? 'احجز رحلتك البرية بسهولة مع أفضل الناقلين بأسعار شفافة في جميع أنحاء المنطقة'
// // // // // //       : 'Book your overland trip with trusted carriers at transparent prices across the region.',
// // // // // //     keywords: isAr
// // // // // //       ? ['سفريات', 'حجز رحلات', 'نقل بري', 'ناقلون', 'سفر بين الدول']
// // // // // //       : ['Safaryat', 'overland travel', 'bus booking', 'land transport', 'travel broker'],
// // // // // //     openGraph: {
// // // // // //       title: isAr ? 'سفريات — الوسيط الأول للسفر البري' : 'Safaryat — #1 Overland Travel',
// // // // // //       description: isAr
// // // // // //         ? 'منصة السفر البري الأولى في المنطقة'
// // // // // //         : 'The leading overland travel platform in the region',
// // // // // //       url: 'https://safaryat.net',
// // // // // //       siteName: 'Safaryat',
// // // // // //       locale: isAr ? 'ar_AR' : 'en_US',
// // // // // //       type: 'website',
// // // // // //     },
// // // // // //     twitter: {
// // // // // //       card: 'summary_large_image',
// // // // // //       title: isAr ? 'سفريات' : 'Safaryat',
// // // // // //       description: isAr ? 'احجز رحلتك البرية بسهولة' : 'Book your overland trip easily',
// // // // // //     },
// // // // // //     robots: {
// // // // // //       index: true,
// // // // // //       follow: true,
// // // // // //     },
// // // // // //     alternates: {
// // // // // //       canonical: 'https://safaryat.net',
// // // // // //       languages: {
// // // // // //         'ar': 'https://safaryat.net/ar',
// // // // // //         'en': 'https://safaryat.net/en',
// // // // // //       },
// // // // // //     },
// // // // // //   };
// // // // // // }

// // // // // // export default async function LocaleLayout({
// // // // // //   children,
// // // // // //   params
// // // // // // }: {
// // // // // //   children: React.ReactNode;
// // // // // //   params: { locale: string };
// // // // // // }) {
// // // // // //   const { locale } = params;

// // // // // //   if (!routing.locales.includes(locale as any)) {
// // // // // //     notFound();
// // // // // //   }

// // // // // //   const messages = (await import(`@/messages/${locale}.json`)).default;
// // // // // //   const logoImage = PlaceHolderImages.find((img) => img.id === 'safar-logo');
// // // // // //   const isRTL = locale === 'ar';

// // // // // //   return (
// // // // // //     <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'} className="dark" suppressHydrationWarning>
// // // // // //       <head>
// // // // // //         <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
// // // // // //         <meta name="theme-color" content="#321118" />
// // // // // //         <link rel="icon" href="/favicon.png" type="image/png" sizes="32x32" />
// // // // // //         <link rel="icon" href="/favicon.webp" type="image/webp" sizes="32x32" />
// // // // // //         <link rel="manifest" href="/manifest.json" />
// // // // // //         {logoImage && <link rel="apple-touch-icon" href={logoImage.imageUrl} />}

// // // // // //         <meta name="application-name" content="Safar Gate" />
// // // // // //         <meta name="apple-mobile-web-app-capable" content="yes" />
// // // // // //         <meta name="mobile-web-app-capable" content="yes" />
// // // // // //         <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
// // // // // //         <meta name="apple-mobile-web-app-title" content="Safar Gate" />

// // // // // //         {/*
// // // // // //           ✅ PERF-FIX-4: preconnect لـ Firebase domains
// // // // // //           بيخلي المتصفح يفتح الـ connection مسبقاً قبل ما Firebase يتحمل
// // // // // //           بيوفر ~200-400ms من وقت الاتصال الأول
// // // // // //         */}
// // // // // //         <link rel="preconnect" href="https://firestore.googleapis.com" />
// // // // // //         <link rel="preconnect" href="https://identitytoolkit.googleapis.com" />
// // // // // //         <link rel="preconnect" href="https://firebasestorage.googleapis.com" />
// // // // // //         <link rel="dns-prefetch" href="https://firestore.googleapis.com" />

// // // // // //         {/*
// // // // // //           ✅ PERF-FIX-5: bfcache fix — إزالة ChunkLoadError handler من الـ layout
// // // // // //           المشكلة: الـ script ده كان بيستخدم localStorage بطريقة ممكن تمنع الـ bfcache
// // // // // //           الحل: استبدلناه بـ sessionStorage اللي مش بيمنع الـ bfcache + pagehide بدل unload
// // // // // //         */}
// // // // // //         <script
// // // // // //           dangerouslySetInnerHTML={{
// // // // // //             __html: `
// // // // // //               window.addEventListener('error', function(e) {
// // // // // //                 if (e.message && e.message.includes('ChunkLoadError')) {
// // // // // //                   var key = 'safar_last_reload';
// // // // // //                   try {
// // // // // //                     var lastReload = sessionStorage.getItem(key);
// // // // // //                     var now = Date.now();
// // // // // //                     if (!lastReload || now - parseInt(lastReload) > 10000) {
// // // // // //                       sessionStorage.setItem(key, now.toString());
// // // // // //                       window.location.reload();
// // // // // //                     }
// // // // // //                   } catch(err) {}
// // // // // //                 }
// // // // // //               });
// // // // // //             `,
// // // // // //           }}
// // // // // //         />
// // // // // //       </head>
// // // // // //       <body className={`${tajawal.variable} font-body antialiased min-h-screen bg-background`}>
// // // // // //         <NextIntlClientProvider messages={messages} locale={locale}>
// // // // // //           <AppProviders>
// // // // // //             <NetworkIndicator />
// // // // // //             {children}
// // // // // //             <PwaInstallPrompt />
// // // // // //           </AppProviders>
// // // // // //         </NextIntlClientProvider>
// // // // // //       </body>
// // // // // //     </html>
// // // // // //   );
// // // // // // }


// // // // // import { NextIntlClientProvider } from 'next-intl';
// // // // // import { notFound } from 'next/navigation';
// // // // // import { routing } from '@/i18n/routing';
// // // // // import './globals.css';
// // // // // import { PlaceHolderImages } from '@/lib/placeholder-images';
// // // // // import AppProviders from '@/components/layout/app-providers';
// // // // // import { NetworkIndicator } from '@/components/layout/network-indicator';
// // // // // import { PwaInstallPrompt } from '@/components/layout/pwa-install-prompt';
// // // // // import type { Metadata } from 'next';
// // // // // import { Tajawal } from 'next/font/google';

// // // // // const tajawal = Tajawal({
// // // // //   subsets: ['arabic', 'latin'],
// // // // //   weight: ['400', '700'],
// // // // //   display: 'swap',
// // // // //   variable: '--font-tajawal',
// // // // //   // [PERF-FIX]: preload بيخلي الفونت يتحمل مع الـ HTML مش بعده
// // // // //   preload: true,
// // // // //   // [PERF-FIX]: fallback عشان مفيش layout shift
// // // // //   fallback: ['system-ui', 'arial'],
// // // // //   // [PERF-FIX]: adjustFontFallback بيزود الـ CLS score
// // // // //   adjustFontFallback: true,
// // // // // });

// // // // // export function generateStaticParams() {
// // // // //   return routing.locales.map((locale) => ({ locale }));
// // // // // }

// // // // // export async function generateMetadata({
// // // // //   params
// // // // // }: {
// // // // //   params: { locale: string };
// // // // // }): Promise<Metadata> {
// // // // //   const isAr = params.locale === 'ar';

// // // // //   return {
// // // // //     title: isAr ? 'سفريات — الوسيط الأول للسفر البري' : 'Safaryat — #1 Overland Travel Broker',
// // // // //     description: isAr
// // // // //       ? 'احجز رحلتك البرية بسهولة مع أفضل الناقلين بأسعار شفافة في جميع أنحاء المنطقة'
// // // // //       : 'Book your overland trip with trusted carriers at transparent prices across the region.',
// // // // //     keywords: isAr
// // // // //       ? ['سفريات', 'حجز رحلات', 'نقل بري', 'ناقلون', 'سفر بين الدول']
// // // // //       : ['Safaryat', 'overland travel', 'bus booking', 'land transport', 'travel broker'],
// // // // //     openGraph: {
// // // // //       title: isAr ? 'سفريات — الوسيط الأول للسفر البري' : 'Safaryat — #1 Overland Travel',
// // // // //       description: isAr
// // // // //         ? 'منصة السفر البري الأولى في المنطقة'
// // // // //         : 'The leading overland travel platform in the region',
// // // // //       url: 'https://safaryat.net',
// // // // //       siteName: 'Safaryat',
// // // // //       locale: isAr ? 'ar_AR' : 'en_US',
// // // // //       type: 'website',
// // // // //     },
// // // // //     twitter: {
// // // // //       card: 'summary_large_image',
// // // // //       title: isAr ? 'سفريات' : 'Safaryat',
// // // // //       description: isAr ? 'احجز رحلتك البرية بسهولة' : 'Book your overland trip easily',
// // // // //     },
// // // // //     robots: {
// // // // //       index: true,
// // // // //       follow: true,
// // // // //     },
// // // // //     alternates: {
// // // // //       canonical: 'https://safaryat.net',
// // // // //       languages: {
// // // // //         'ar': 'https://safaryat.net/ar',
// // // // //         'en': 'https://safaryat.net/en',
// // // // //       },
// // // // //     },
// // // // //   };
// // // // // }

// // // // // export default async function LocaleLayout({
// // // // //   children,
// // // // //   params
// // // // // }: {
// // // // //   children: React.ReactNode;
// // // // //   params: { locale: string };
// // // // // }) {
// // // // //   const { locale } = params;

// // // // //   if (!routing.locales.includes(locale as any)) {
// // // // //     notFound();
// // // // //   }

// // // // //   const messages = (await import(`@/messages/${locale}.json`)).default;
// // // // //   const logoImage = PlaceHolderImages.find((img) => img.id === 'safar-logo');
// // // // //   const isRTL = locale === 'ar';

// // // // //   return (
// // // // //     <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'} className="dark" suppressHydrationWarning>
// // // // //       <head>
// // // // //         <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
// // // // //         <meta name="theme-color" content="#321118" />
// // // // //         <link rel="icon" href="/favicon.png" type="image/png" sizes="32x32" />
// // // // //         <link rel="icon" href="/favicon.webp" type="image/webp" sizes="32x32" />
// // // // //         <link rel="manifest" href="/manifest.json" />
// // // // //         {logoImage && <link rel="apple-touch-icon" href={logoImage.imageUrl} />}

// // // // //         <meta name="application-name" content="Safar Gate" />
// // // // //         <meta name="apple-mobile-web-app-capable" content="yes" />
// // // // //         <meta name="mobile-web-app-capable" content="yes" />
// // // // //         <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
// // // // //         <meta name="apple-mobile-web-app-title" content="Safar Gate" />

// // // // //         {/*
// // // // //           ✅ PERF-FIX-4: preconnect لـ Firebase domains
// // // // //           بيخلي المتصفح يفتح الـ connection مسبقاً قبل ما Firebase يتحمل
// // // // //           بيوفر ~200-400ms من وقت الاتصال الأول
// // // // //         */}
// // // // //         <link rel="preconnect" href="https://firestore.googleapis.com" />
// // // // //         <link rel="preconnect" href="https://identitytoolkit.googleapis.com" />
// // // // //         <link rel="preconnect" href="https://firebasestorage.googleapis.com" />
// // // // //         <link rel="dns-prefetch" href="https://firestore.googleapis.com" />

// // // // //         {/*
// // // // //           ✅ PERF-FIX-5: bfcache fix — إزالة ChunkLoadError handler من الـ layout
// // // // //           المشكلة: الـ script ده كان بيستخدم localStorage بطريقة ممكن تمنع الـ bfcache
// // // // //           الحل: استبدلناه بـ sessionStorage اللي مش بيمنع الـ bfcache + pagehide بدل unload
// // // // //         */}
// // // // //         <script
// // // // //           dangerouslySetInnerHTML={{
// // // // //             __html: `
// // // // //               window.addEventListener('error', function(e) {
// // // // //                 if (e.message && e.message.includes('ChunkLoadError')) {
// // // // //                   var key = 'safar_last_reload';
// // // // //                   try {
// // // // //                     var lastReload = sessionStorage.getItem(key);
// // // // //                     var now = Date.now();
// // // // //                     if (!lastReload || now - parseInt(lastReload) > 10000) {
// // // // //                       sessionStorage.setItem(key, now.toString());
// // // // //                       window.location.reload();
// // // // //                     }
// // // // //                   } catch(err) {}
// // // // //                 }
// // // // //               });
// // // // //             `,
// // // // //           }}
// // // // //         />
// // // // //       </head>
// // // // //       <body className={`${tajawal.variable} font-body antialiased min-h-screen bg-background`}>
// // // // //         <NextIntlClientProvider messages={messages} locale={locale}>
// // // // //           <AppProviders>
// // // // //             <NetworkIndicator />
// // // // //             {children}
// // // // //             <PwaInstallPrompt />
// // // // //           </AppProviders>
// // // // //         </NextIntlClientProvider>
// // // // //       </body>
// // // // //     </html>
// // // // //   );
// // // // // }
// // // // import { NextIntlClientProvider } from 'next-intl';
// // // // import { notFound } from 'next/navigation';
// // // // import { routing } from '@/i18n/routing';
// // // // import './globals.css';
// // // // import AppProviders from '@/components/layout/app-providers';
// // // // import { NetworkIndicator } from '@/components/layout/network-indicator';
// // // // import { PwaInstallPrompt } from '@/components/layout/pwa-install-prompt';
// // // // import type { Metadata } from 'next';
// // // // import { Tajawal } from 'next/font/google';

// // // // const tajawal = Tajawal({
// // // //   subsets: ['arabic', 'latin'],
// // // //   weight: ['400', '700'],
// // // //   display: 'swap',
// // // //   variable: '--font-tajawal',
// // // //   preload: true,
// // // //   fallback: ['system-ui', 'arial'],
// // // //   adjustFontFallback: true,
// // // // });

// // // // export function generateStaticParams() {
// // // //   return routing.locales.map((locale) => ({ locale }));
// // // // }

// // // // export async function generateMetadata({
// // // //   params
// // // // }: {
// // // //   params: { locale: string };
// // // // }): Promise<Metadata> {
// // // //   const isAr = params.locale === 'ar';

// // // //   return {
// // // //     title: isAr ? 'سفريات — الوسيط الأول للسفر البري' : 'Safaryat — #1 Overland Travel Broker',
// // // //     description: isAr
// // // //       ? 'احجز رحلتك البرية بسهولة مع أفضل الناقلين بأسعار شفافة في جميع أنحاء المنطقة'
// // // //       : 'Book your overland trip with trusted carriers at transparent prices across the region.',
// // // //     keywords: isAr
// // // //       ? ['سفريات', 'حجز رحلات', 'نقل بري', 'ناقلون', 'سفر بين الدول']
// // // //       : ['Safaryat', 'overland travel', 'bus booking', 'land transport', 'travel broker'],
// // // //     manifest: '/manifest.json',
// // // //     // ✅ iOS PWA metadata — Next.js بيحولها لـ <meta> tags تلقائياً
// // // //     appleWebApp: {
// // // //       capable: true,
// // // //       title: 'سفريات',
// // // //       statusBarStyle: 'black-translucent',
// // // //       startupImage: '/icons/apple-touch-icon.png',
// // // //     },
// // // //     openGraph: {
// // // //       title: isAr ? 'سفريات — الوسيط الأول للسفر البري' : 'Safaryat — #1 Overland Travel',
// // // //       description: isAr
// // // //         ? 'منصة السفر البري الأولى في المنطقة'
// // // //         : 'The leading overland travel platform in the region',
// // // //       url: 'https://safaryat.net',
// // // //       siteName: 'Safaryat',
// // // //       locale: isAr ? 'ar_AR' : 'en_US',
// // // //       type: 'website',
// // // //     },
// // // //     twitter: {
// // // //       card: 'summary_large_image',
// // // //       title: isAr ? 'سفريات' : 'Safaryat',
// // // //       description: isAr ? 'احجز رحلتك البرية بسهولة' : 'Book your overland trip easily',
// // // //     },
// // // //     robots: { index: true, follow: true },
// // // //     alternates: {
// // // //       canonical: 'https://safaryat.net',
// // // //       languages: {
// // // //         'ar': 'https://safaryat.net/ar',
// // // //         'en': 'https://safaryat.net/en',
// // // //       },
// // // //     },
// // // //   };
// // // // }

// // // // export default async function LocaleLayout({
// // // //   children,
// // // //   params
// // // // }: {
// // // //   children: React.ReactNode;
// // // //   params: { locale: string };
// // // // }) {
// // // //   const { locale } = params;

// // // //   if (!routing.locales.includes(locale as any)) {
// // // //     notFound();
// // // //   }

// // // //   const messages = (await import(`@/messages/${locale}.json`)).default;
// // // //   const isRTL = locale === 'ar';

// // // //   return (
// // // //     <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'} className="dark" suppressHydrationWarning>
// // // //       <head>
// // // //         <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
// // // //         <meta name="theme-color" content="#321018" />

// // // //         {/* ✅ FIX-1: apple-touch-icon — ده الأهم على iOS، لازم يبوظ لـ /icons/ مش /favicon.png */}
// // // //         <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
// // // //         <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
// // // //         <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-180x180.png" />

// // // //         {/* ✅ FIX-2: apple-mobile-web-app meta tags — iOS بيحتاجهم عشان يعرف الـ app اسمه وإنه standalone */}
// // // //         <meta name="apple-mobile-web-app-capable" content="yes" />
// // // //         <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
// // // //         <meta name="apple-mobile-web-app-title" content="سفريات" />
// // // //         <meta name="mobile-web-app-capable" content="yes" />
// // // //         <meta name="application-name" content="سفريات" />

// // // //         {/* Regular icons */}
// // // //         <link rel="icon" href="/icons/icon-192x192.png" type="image/png" sizes="192x192" />
// // // //         <link rel="icon" href="/favicon.png" type="image/png" sizes="32x32" />
// // // //         <link rel="manifest" href="/manifest.json" />

// // // //         {/* ✅ FIX-3: preconnect لـ Firebase — بيوفر ~300ms وقت اتصال */}
// // // //         <link rel="preconnect" href="https://firestore.googleapis.com" />
// // // //         <link rel="preconnect" href="https://identitytoolkit.googleapis.com" />
// // // //         <link rel="preconnect" href="https://firebasestorage.googleapis.com" />
// // // //         <link rel="dns-prefetch" href="https://firestore.googleapis.com" />

// // // //         {/* ✅ FIX-4: Capture PWA prompt قبل React يتحمل — Chrome بيبعت الـ event مرة واحدة بس */}
// // // //         <script dangerouslySetInnerHTML={{ __html: `window.__pwaPrompt=null;window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();window.__pwaPrompt=e;});` }} />

// // // //         {/* ✅ FIX-5: ChunkLoadError recovery بـ sessionStorage بدل localStorage عشان bfcache */}
// // // //         <script
// // // //           dangerouslySetInnerHTML={{
// // // //             __html: `
// // // //               window.addEventListener('error', function(e) {
// // // //                 if (e.message && e.message.includes('ChunkLoadError')) {
// // // //                   var key = 'safar_last_reload';
// // // //                   try {
// // // //                     var lastReload = sessionStorage.getItem(key);
// // // //                     var now = Date.now();
// // // //                     if (!lastReload || now - parseInt(lastReload) > 10000) {
// // // //                       sessionStorage.setItem(key, now.toString());
// // // //                       window.location.reload();
// // // //                     }
// // // //                   } catch(err) {}
// // // //                 }
// // // //               });
// // // //             `,
// // // //           }}
// // // //         />
// // // //       </head>
// // // //       <body suppressHydrationWarning className={`${tajawal.variable} font-body antialiased min-h-screen bg-background`}>
// // // //         <NextIntlClientProvider messages={messages} locale={locale}>
// // // //           <AppProviders>
// // // //             <NetworkIndicator />
// // // //             {children}
// // // //             <PwaInstallPrompt />
// // // //           </AppProviders>
// // // //         </NextIntlClientProvider>
// // // //       </body>
// // // //     </html>
// // // //   );
// // // // }
// // // import type { Metadata, Viewport } from 'next';

// // // export const viewport: Viewport = {
// // //   themeColor: '#321018',
// // //   width: 'device-width',
// // //   initialScale: 1,
// // //   maximumScale: 1,
// // //   userScalable: false,
// // // };

// // // export const metadata: Metadata = {
// // //   manifest: '/manifest.json',
// // //   appleWebApp: {
// // //     capable: true,
// // //     statusBarStyle: 'black-translucent',
// // //     title: 'سفريات',
// // //   },
// // //   formatDetection: {
// // //     telephone: false,
// // //   },
// // //   other: {
// // //     'mobile-web-app-capable': 'yes',
// // //   },
// // // };

// // // export default function RootLayout({ children }: { children: React.ReactNode }) {
// // //   return (
// // //     <html lang="ar" dir="rtl">
// // //       <head>
// // //         {/* iOS PWA Icons */}
// // //         <link rel="apple-touch-icon" href="/icons/icon-180x180.png" />
// // //         <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
// // //         <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-180x180.png" />
// // //         <link rel="apple-touch-icon" sizes="167x167" href="/icons/icon-180x180.png" />

// // //         {/* iOS Splash Screens — iPhone */}
// // //         <meta name="apple-mobile-web-app-capable" content="yes" />
// // //         <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
// // //         <meta name="apple-mobile-web-app-title" content="سفريات" />

// // //         {/* Favicon */}
// // //         <link rel="icon" href="/favicon.png" type="image/png" />
// // //         <link rel="shortcut icon" href="/favicon.png" />
// // //       </head>
// // //       <body>{children}</body>
// // //     </html>
// // //   );
// // // }
// // import { NextIntlClientProvider } from 'next-intl';
// // import { notFound } from 'next/navigation';
// // import { routing } from '@/i18n/routing';
// // import './globals.css';
// // import { PlaceHolderImages } from '@/lib/placeholder-images';
// // import AppProviders from '@/components/layout/app-providers';
// // import { NetworkIndicator } from '@/components/layout/network-indicator';
// // import { PwaInstallPrompt } from '@/components/layout/pwa-install-prompt';
// // import type { Metadata } from 'next';
// // import { Tajawal } from 'next/font/google';

// // const tajawal = Tajawal({
// //   subsets: ['arabic', 'latin'],
// //   weight: ['400', '700'],
// //   display: 'swap',
// //   variable: '--font-tajawal',
// //   preload: true,
// //   fallback: ['system-ui', 'arial'],
// //   adjustFontFallback: true,
// // });

// // export function generateStaticParams() {
// //   return routing.locales.map((locale) => ({ locale }));
// // }

// // export async function generateMetadata({
// //   params,
// // }: {
// //   params: { locale: string };
// // }): Promise<Metadata> {
// //   const isAr = params.locale === 'ar';

// //   return {
// //     title: isAr
// //       ? 'سفريات — الوسيط الأول للسفر البري'
// //       : 'Safaryat — #1 Overland Travel Broker',
// //     description: isAr
// //       ? 'احجز رحلتك البرية بسهولة مع أفضل الناقلين بأسعار شفافة في جميع أنحاء المنطقة'
// //       : 'Book your overland trip with trusted carriers at transparent prices across the region.',
// //     keywords: isAr
// //       ? ['سفريات', 'حجز رحلات', 'نقل بري', 'ناقلون', 'سفر بين الدول']
// //       : ['Safaryat', 'overland travel', 'bus booking', 'land transport', 'travel broker'],
// //     // ✅ PWA manifest — Next.js بيحطه في <head> تلقائياً
// //     manifest: '/manifest.json',
// //     // ✅ iOS PWA metadata
// //     appleWebApp: {
// //       capable: true,
// //       title: 'سفريات',
// //       statusBarStyle: 'black-translucent',
// //     },
// //     openGraph: {
// //       title: isAr
// //         ? 'سفريات — الوسيط الأول للسفر البري'
// //         : 'Safaryat — #1 Overland Travel',
// //       description: isAr
// //         ? 'منصة السفر البري الأولى في المنطقة'
// //         : 'The leading overland travel platform in the region',
// //       url: 'https://safaryat.net',
// //       siteName: 'Safaryat',
// //       locale: isAr ? 'ar_AR' : 'en_US',
// //       type: 'website',
// //     },
// //     twitter: {
// //       card: 'summary_large_image',
// //       title: isAr ? 'سفريات' : 'Safaryat',
// //       description: isAr ? 'احجز رحلتك البرية بسهولة' : 'Book your overland trip easily',
// //     },
// //     robots: { index: true, follow: true },
// //     alternates: {
// //       canonical: 'https://safaryat.net',
// //       languages: {
// //         ar: 'https://safaryat.net/ar',
// //         en: 'https://safaryat.net/en',
// //       },
// //     },
// //   };
// // }

// // export default async function LocaleLayout({
// //   children,
// //   params,
// // }: {
// //   children: React.ReactNode;
// //   params: { locale: string };
// // }) {
// //   const { locale } = params;

// //   if (!routing.locales.includes(locale as any)) {
// //     notFound();
// //   }

// //   const messages = (await import(`@/messages/${locale}.json`)).default;
// //   const logoImage = PlaceHolderImages.find((img) => img.id === 'safar-logo');
// //   const isRTL = locale === 'ar';

// //   return (
// //     <html
// //       lang={locale}
// //       dir={isRTL ? 'rtl' : 'ltr'}
// //       className="dark"
// //       suppressHydrationWarning
// //     >
// //       <head>
// //         <meta
// //           name="viewport"
// //           content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
// //         />
// //         <meta name="theme-color" content="#321018" />

// //         {/* ✅ iOS PWA Icons — الأهم على iOS */}
// //         <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
// //         <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
// //         <link rel="apple-touch-icon" sizes="167x167" href="/icons/icon-180x180.png" />
// //         <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-180x180.png" />
// //         {logoImage && <link rel="apple-touch-icon" href={logoImage.imageUrl} />}

// //         {/* ✅ iOS PWA Meta Tags */}
// //         <meta name="apple-mobile-web-app-capable" content="yes" />
// //         <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
// //         <meta name="apple-mobile-web-app-title" content="سفريات" />
// //         <meta name="mobile-web-app-capable" content="yes" />
// //         <meta name="application-name" content="سفريات" />

// //         {/* Favicon */}
// //         <link rel="icon" href="/icons/icon-192x192.png" type="image/png" sizes="192x192" />
// //         <link rel="icon" href="/favicon.png" type="image/png" sizes="32x32" />

// //         {/* ✅ Firebase preconnect — بيوفر ~300ms */}
// //         <link rel="preconnect" href="https://firestore.googleapis.com" />
// //         <link rel="preconnect" href="https://identitytoolkit.googleapis.com" />
// //         <link rel="preconnect" href="https://firebasestorage.googleapis.com" />
// //         <link rel="dns-prefetch" href="https://firestore.googleapis.com" />

// //         {/* ✅ Capture PWA install prompt قبل React — Chrome بيبعته مرة واحدة بس */}
// //         <script
// //           dangerouslySetInnerHTML={{
// //             __html: `window.__pwaPrompt=null;window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();window.__pwaPrompt=e;});`,
// //           }}
// //         />

// //         {/* ✅ ChunkLoadError recovery */}
// //         <script
// //           dangerouslySetInnerHTML={{
// //             __html: `
// //               window.addEventListener('error', function(e) {
// //                 if (e.message && e.message.includes('ChunkLoadError')) {
// //                   var key = 'safar_last_reload';
// //                   try {
// //                     var lastReload = sessionStorage.getItem(key);
// //                     var now = Date.now();
// //                     if (!lastReload || now - parseInt(lastReload) > 10000) {
// //                       sessionStorage.setItem(key, now.toString());
// //                       window.location.reload();
// //                     }
// //                   } catch(err) {}
// //                 }
// //               });
// //             `,
// //           }}
// //         />
// //       </head>
// //       <body
// //         suppressHydrationWarning
// //         className={`${tajawal.variable} font-body antialiased min-h-screen bg-background`}
// //       >
// //         <NextIntlClientProvider messages={messages} locale={locale}>
// //           <AppProviders>
// //             <NetworkIndicator />
// //             {children}
// //             <PwaInstallPrompt />
// //           </AppProviders>
// //         </NextIntlClientProvider>
// //       </body>
// //     </html>
// //   );
// // }
// import { NextIntlClientProvider } from 'next-intl';
// import { notFound } from 'next/navigation';
// import { routing } from '@/i18n/routing';
// import './globals.css';
// import { PlaceHolderImages } from '@/lib/placeholder-images';
// import AppProviders from '@/components/layout/app-providers';
// import { NetworkIndicator } from '@/components/layout/network-indicator';
// import { PwaInstallPrompt } from '@/components/layout/pwa-install-prompt';
// import type { Metadata, Viewport } from 'next';
// import { Tajawal } from 'next/font/google';

// const tajawal = Tajawal({
//   subsets: ['arabic', 'latin'],
//   weight: ['400', '700'],
//   display: 'swap',
//   variable: '--font-tajawal',
//   preload: true,
//   fallback: ['system-ui', 'arial'],
//   adjustFontFallback: true,
// });

// export function generateStaticParams() {
//   return routing.locales.map((locale) => ({ locale }));
// }

// // ✅ FIX: viewport منفصل عن metadata (Next.js 14+ requirement)
// export const viewport: Viewport = {
//   width: 'device-width',
//   initialScale: 1,
//   // maximumScale: 1,
//   // userScalable: false,
//   viewportFit: 'cover',
//   themeColor: '#321018',
// };

// export async function generateMetadata({
//   params,
// }: {
//   params: { locale: string };
// }): Promise<Metadata> {
//   const isAr = params.locale === 'ar';

//   return {
//     title: {
//       default: isAr
//         ? 'سفريات — الوسيط الأول للسفر البري'
//         : 'Safaryat — #1 Overland Travel Broker',
//       template: isAr ? '%s | سفريات' : '%s | Safaryat',
//     },
//     description: isAr
//       ? 'احجز رحلتك البرية بسهولة مع أفضل الناقلين بأسعار شفافة في جميع أنحاء المنطقة'
//       : 'Book your overland trip with trusted carriers at transparent prices across the region.',
//     keywords: isAr
//       ? ['سفريات', 'حجز رحلات', 'نقل بري', 'ناقلون', 'سفر بين الدول']
//       : ['Safaryat', 'overland travel', 'bus booking', 'land transport', 'travel broker'],
//     // ✅ PWA manifest
//     manifest: '/manifest.json',
//     // ✅ iOS PWA
//     appleWebApp: {
//       capable: true,
//       title: 'سفريات',
//       statusBarStyle: 'black-translucent',
//     },
//     openGraph: {
//       title: isAr
//         ? 'سفريات — الوسيط الأول للسفر البري'
//         : 'Safaryat — #1 Overland Travel',
//       description: isAr
//         ? 'منصة السفر البري الأولى في المنطقة'
//         : 'The leading overland travel platform in the region',
//       url: 'https://safaryat.net',
//       siteName: 'Safaryat',
//       locale: isAr ? 'ar_AR' : 'en_US',
//       type: 'website',
//     },
//     twitter: {
//       card: 'summary_large_image',
//       title: isAr ? 'سفريات' : 'Safaryat',
//       description: isAr ? 'احجز رحلتك البرية بسهولة' : 'Book your overland trip easily',
//     },
//     robots: { index: true, follow: true },
//     alternates: {
//       canonical: `https://safaryat.net/${params.locale}`,
//       languages: {
//         ar: 'https://safaryat.net/ar',
//         en: 'https://safaryat.net/en',
//       },
//     },
//   };
// }

// export default async function LocaleLayout({
//   children,
//   params,
// }: {
//   children: React.ReactNode;
//   params: { locale: string };
// }) {
//   const { locale } = params;

//   if (!routing.locales.includes(locale as any)) {
//     notFound();
//   }

//   const messages = (await import(`@/messages/${locale}.json`)).default;
//   const logoImage = PlaceHolderImages.find((img) => img.id === 'safar-logo');
//   const isRTL = locale === 'ar';

//   return (
//     <html
//       lang={locale}
//       dir={isRTL ? 'rtl' : 'ltr'}
//       className="dark"
//       suppressHydrationWarning
//     >
//       <head>
//         {/* ✅ iOS PWA Icons */}
//         <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
//         <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
//         <link rel="apple-touch-icon" sizes="167x167" href="/icons/icon-180x180.png" />
//         <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-180x180.png" />
//         {logoImage && <link rel="apple-touch-icon" href={logoImage.imageUrl} />}

//         {/* ✅ iOS PWA Meta Tags */}
//         <meta name="apple-mobile-web-app-capable" content="yes" />
//         <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
//         <meta name="apple-mobile-web-app-title" content="سفريات" />
//         <meta name="mobile-web-app-capable" content="yes" />
//         <meta name="application-name" content="سفريات" />

//         {/* Favicon */}
//         <link rel="icon" href="/icons/icon-192x192.png" type="image/png" sizes="192x192" />
//         <link rel="icon" href="/favicon.png" type="image/png" sizes="32x32" />

//         {/* ✅ Performance: preconnect للسيرفرات الخارجية */}
//         <link rel="preconnect" href="https://firestore.googleapis.com" crossOrigin="anonymous" />
//         <link rel="preconnect" href="https://identitytoolkit.googleapis.com" crossOrigin="anonymous" />
//         <link rel="preconnect" href="https://firebasestorage.googleapis.com" crossOrigin="anonymous" />
//         <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
//         <link rel="dns-prefetch" href="https://firestore.googleapis.com" />
//         <link rel="dns-prefetch" href="https://firebase.googleapis.com" />

//         {/* ✅ Capture PWA install prompt قبل React — Chrome بيبعته مرة واحدة بس */}
//         <script
//           dangerouslySetInnerHTML={{
//             __html: `window.__pwaPrompt=null;window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();window.__pwaPrompt=e;});`,
//           }}
//         />

//         {/* ✅ ChunkLoadError auto-recovery */}
//         <script
//           dangerouslySetInnerHTML={{
//             __html: `window.addEventListener('error',function(e){if(e.message&&e.message.includes('ChunkLoadError')){var k='safar_last_reload';try{var t=sessionStorage.getItem(k),n=Date.now();if(!t||n-parseInt(t)>10000){sessionStorage.setItem(k,n.toString());window.location.reload();}}catch(_){}}});`,
//           }}
//         />
//       </head>
//       <body
//         suppressHydrationWarning
//         className={`${tajawal.variable} font-body antialiased min-h-screen bg-background`}
//       >
//         {/* ✅ Accessibility: skip-to-content link للـ keyboard users */}
//         <a
//           href="#main-content"
//           className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[99999] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:font-bold focus:shadow-lg"
//         >
//           {isRTL ? 'انتقل للمحتوى الرئيسي' : 'Skip to main content'}
//         </a>

//         <NextIntlClientProvider messages={messages} locale={locale}>
//           <AppProviders>
//             <NetworkIndicator />
//             <main id="main-content">
//               {children}
//             </main>
//             <PwaInstallPrompt />
//           </AppProviders>
//         </NextIntlClientProvider>
//       </body>
//     </html>
//   );
// }
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import './globals.css';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import AppProviders from '@/components/layout/app-providers';
import { NetworkIndicator } from '@/components/layout/network-indicator';
import { PwaInstallPrompt } from '@/components/layout/pwa-install-prompt';
import { FCMRegistration } from '@/components/layout/fcm-registration'; // 👈 1. أضفنا استيراد المكون هنا (عدل المسار إذا اختلف)
import type { Metadata, Viewport } from 'next';
import { Tajawal } from 'next/font/google';

const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-tajawal',
  preload: true,
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true,
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// ✅ FIX: viewport منفصل عن metadata (Next.js 14+ requirement)
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // maximumScale: 1,
  // userScalable: false,
  viewportFit: 'cover',
  themeColor: '#321018',
};

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isAr = params.locale === 'ar';

  return {
    title: {
      default: isAr
        ? 'سفريات — الوسيط الأول للسفر البري'
        : 'Safaryat — #1 Overland Travel Broker',
      template: isAr ? '%s | سفريات' : '%s | Safaryat',
    },
    description: isAr
      ? 'احجز رحلتك البرية بسهولة مع أفضل الناقلين بأسعار شفافة في جميع أنحاء المنطقة'
      : 'Book your overland trip with trusted carriers at transparent prices across the region.',
    keywords: isAr
      ? ['سفريات', 'حجز رحلات', 'نقل بري', 'ناقلون', 'سفر بين الدول']
      : ['Safaryat', 'overland travel', 'bus booking', 'land transport', 'travel broker'],
    manifest: '/manifest.json',
    appleWebApp: {
      capable: true,
      title: 'سفريات',
      statusBarStyle: 'black-translucent',
    },
    openGraph: {
      title: isAr
        ? 'سفريات — الوسيط الأول للسفر البري'
        : 'Safaryat — #1 Overland Travel',
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
    robots: { index: true, follow: true },
    alternates: {
      canonical: `https://safaryat.net/${params.locale}`,
      languages: {
        ar: 'https://safaryat.net/ar',
        en: 'https://safaryat.net/en',
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
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
    <html
      lang={locale}
      dir={isRTL ? 'rtl' : 'ltr'}
      className="dark"
      suppressHydrationWarning
    >
      <head>
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/icon-180x180.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-180x180.png" />
        {logoImage && <link rel="apple-touch-icon" href={logoImage.imageUrl} />}

        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="سفريات" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="سفريات" />

        <link rel="icon" href="/icons/icon-192x192.png" type="image/png" sizes="192x192" />
        <link rel="icon" href="/favicon.png" type="image/png" sizes="32x32" />

        <link rel="preconnect" href="https://firestore.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://identitytoolkit.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://firestore.googleapis.com" />
        <link rel="dns-prefetch" href="https://firebase.googleapis.com" />

        <script
          dangerouslySetInnerHTML={{
            __html: `window.__pwaPrompt=null;window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();window.__pwaPrompt=e;});`,
          }}
        />

        <script
          dangerouslySetInnerHTML={{
            __html: `window.addEventListener('error',function(e){if(e.message&&e.message.includes('ChunkLoadError')){var k='safar_last_reload';try{var t=sessionStorage.getItem(k),n=Date.now();if(!t||n-parseInt(t)>10000){sessionStorage.setItem(k,n.toString());window.location.reload();}}catch(_){}}});`,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${tajawal.variable} font-body antialiased min-h-screen bg-background`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[99999] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:font-bold focus:shadow-lg"
        >
          {isRTL ? 'انتقل للمحتوى الرئيسي' : 'Skip to main content'}
        </a>

        <NextIntlClientProvider messages={messages} locale={locale}>
          <AppProviders>
            {/* 👈 2. وضعنا مكون الإشعارات هنا ليعمل مع بداية تحميل التطبيق */}
            <FCMRegistration />
            <NetworkIndicator />
            <main id="main-content">
              {children}
            </main>
            <PwaInstallPrompt />
          </AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}