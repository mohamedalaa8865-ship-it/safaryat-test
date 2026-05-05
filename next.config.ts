// // // // // @ts-nocheck
// // // // /** @type {import('next').NextConfig} */
// // // // const createNextIntlPlugin = require('next-intl/plugin');
// // // // const withNextIntl = createNextIntlPlugin();

// // // // const withPWA = require('next-pwa')({
// // // //   dest: 'public',
// // // //   disable: process.env.NODE_ENV === 'development',
// // // //   register: true,
// // // //   skipWaiting: true
// // // // });

// // // // /**
// // // //  * [SCR-2026-FUSION-ULTIMATE-V33]: THE CHUNK RESILIENCE SEAL
// // // //  * [FIX]: إبادة خطأ Cannot find module (Webpack Chunks)
// // // //  * [STABILITY]: Hardening build stability and forcing a clean state via Build ID.
// // // //  */
// // // // const nextConfig = {
// // // //   reactStrictMode: true,

// // // //   // [PROTOCOL 88]: Fresh Build ID to eradicate stale chunk references
// // // //   generateBuildId: async () => {
// // // //     return 'safar-gate-ultimate-seal-v33-chunk-resilience';
// // // //   },

// // // //   typescript: {
// // // //     ignoreBuildErrors: true
// // // //   },
// // // //   eslint: {
// // // //     ignoreDuringBuilds: true
// // // //   },

// // // //   // [PROTOCOL 30]: Strict isolation of server-only modules
// // // //   serverExternalPackages: [
// // // //     'firebase-admin',
// // // //     'genkit',
// // // //     '@genkit-ai/ai',
// // // //     '@genkit-ai/core',
// // // //     '@genkit-ai/flow',
// // // //     '@genkit-ai/dotprompt',
// // // //     '@genkit-ai/google-genai',
// // // //     'require-in-the-middle',
// // // //     'import-in-the-middle',
// // // //     'jose',
// // // //     'opentelemetry',
// // // //     'grpc',
// // // //     '@grpc/grpc-js',
// // // //     '@grpc/proto-loader',
// // // //     'google-auth-library',
// // // //     'undici',
// // // //     'node-fetch',
// // // //     '@google-cloud/firestore',
// // // //     '@google-cloud/storage',
// // // //     'protobufjs',
// // // //     'encoding',
// // // //     'gaxios',
// // // //     'gcp-metadata',
// // // //     'wav'
// // // //   ],

// // // //   images: {
// // // //     remotePatterns: [
// // // //       { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
// // // //       { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
// // // //       { protocol: 'https', hostname: 'images.unsplash.com' },
// // // //       { protocol: 'https', hostname: 'i.postimg.cc' },
// // // //       { protocol: 'https', hostname: 'picsum.photos' }
// // // //     ],
// // // //   },

// // // //   webpack: (config, { isServer }) => {
// // // //     // [PROTOCOL 88]: Handle node-specific modules in client bundles gracefully
// // // //     if (!isServer) {
// // // //       config.resolve.fallback = {
// // // //         ...config.resolve.fallback,
// // // //         fs: false,
// // // //         net: false,
// // // //         tls: false,
// // // //         dns: false,
// // // //         child_process: false,
// // // //         perf_hooks: false,
// // // //         async_hooks: false,
// // // //         punycode: false,
// // // //       };
// // // //     }

// // // //     // Hardening the runtime to prevent 'call' errors and module resolution schisms
// // // //     config.optimization.moduleIds = 'deterministic';

// // // //     return config;
// // // //   },
// // // // };

// // // // module.exports = withPWA(withNextIntl(nextConfig));

// // // import type { NextConfig } from "next";
// // // import withPWA from "next-pwa";

// // // const pwa = withPWA({
// // //   dest: "public",
// // //   disable: process.env.NODE_ENV === "development",
// // //   register: true,
// // //   skipWaiting: true,
// // //   runtimeCaching: [
// // //     {
// // //       urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/i,
// // //       handler: "CacheFirst",
// // //       options: {
// // //         cacheName: "sovereign-firestore-cache",
// // //         expiration: { maxEntries: 200, maxAgeSeconds: 24 * 60 * 60 },
// // //       },
// // //     },
// // //     {
// // //       urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
// // //       handler: "CacheFirst",
// // //       options: {
// // //         cacheName: "google-fonts",
// // //         expiration: { maxEntries: 4, maxAgeSeconds: 365 * 24 * 60 * 60 },
// // //       },
// // //     },
// // //     {
// // //       urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font\.css)$/i,
// // //       handler: "StaleWhileRevalidate",
// // //       options: {
// // //         cacheName: "static-font-assets",
// // //         expiration: { maxEntries: 4, maxAgeSeconds: 7 * 24 * 60 * 60 },
// // //       },
// // //     },
// // //     {
// // //       urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp|avif)$/i,
// // //       handler: "CacheFirst",
// // //       options: {
// // //         cacheName: "static-image-assets",
// // //         expiration: { maxEntries: 100, maxAgeSeconds: 7 * 24 * 60 * 60 },
// // //       },
// // //     },
// // //     {
// // //       urlPattern: /\.(?:js|css)$/i,
// // //       handler: "StaleWhileRevalidate",
// // //       options: {
// // //         cacheName: "static-js-css",
// // //         expiration: { maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 },
// // //       },
// // //     },
// // //   ],
// // // });

// // // const nextConfig: NextConfig = {
// // //   reactStrictMode: true,
// // //   typescript: { ignoreBuildErrors: true },
// // //   eslint: { ignoreDuringBuilds: true },

// // //   images: {
// // //     formats: ["image/avif", "image/webp"] as const,
// // //     minimumCacheTTL: 60 * 60 * 24 * 7,
// // //     deviceSizes: [640, 750, 828, 1080, 1200],
// // //     imageSizes: [16, 32, 64, 96, 128, 256],
// // //     remotePatterns: [
// // //       { protocol: "https", hostname: "firebasestorage.googleapis.com", pathname: "**" },
// // //       { protocol: "https", hostname: "lh3.googleusercontent.com", pathname: "**" },
// // //       { protocol: "https", hostname: "images.unsplash.com", pathname: "**" },
// // //       { protocol: "https", hostname: "i.postimg.cc", pathname: "**" },
// // //     ],
// // //   },

// // //   async headers() {
// // //     return [
// // //       {
// // //         // [PERF-FIX-4]: Removed no-store — was breaking bfcache (back/forward cache)
// // //         // no-cache allows bfcache while still requiring revalidation
// // //         source: "/(.*)",
// // //         headers: [
// // //           { key: "X-DNS-Prefetch-Control", value: "on" },
// // //           { key: "Cache-Control", value: "no-cache, must-revalidate" },
// // //         ],
// // //       },
// // //       {
// // //         // Static assets: immutable 1 year cache
// // //         source: "/(.*)\\.(png|jpg|jpeg|webp|avif|svg|ico|woff|woff2|js|css)",
// // //         headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
// // //       },
// // //     ];
// // //   },

// // //   webpack: (config: any) => {
// // //     config.resolve.alias = {
// // //       ...config.resolve.alias,
// // //       undici: false,
// // //     };
// // //     config.infrastructureLogging = { level: "error" };

// // //     // [PERF-FIX-5]: Force tree shaking — removes unused exports from lucide-react etc.
// // //     config.optimization = {
// // //       ...config.optimization,
// // //       sideEffects: true,
// // //       usedExports: true,
// // //     };

// // //     return config;
// // //   },
// // // };

// // // export default pwa(nextConfig);

// // import type { NextConfig } from "next";
// // import withPWA from "next-pwa";

// // const pwa = withPWA({
// //   dest: "public",
// //   disable: process.env.NODE_ENV === "development",
// //   register: true,
// //   skipWaiting: true,
// //   // ⚠️ IMPORTANT: sw.js is our Firebase file — tell next-pwa to use a different name
// //   // so it doesn't overwrite the Firebase messaging service worker
// //   swDest: "public/sw-pwa.js",
// //   runtimeCaching: [
// //     {
// //       urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/i,
// //       handler: "CacheFirst",
// //       options: {
// //         cacheName: "sovereign-firestore-cache",
// //         expiration: { maxEntries: 200, maxAgeSeconds: 24 * 60 * 60 },
// //       },
// //     },
// //     {
// //       urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
// //       handler: "CacheFirst",
// //       options: {
// //         cacheName: "google-fonts",
// //         expiration: { maxEntries: 4, maxAgeSeconds: 365 * 24 * 60 * 60 },
// //       },
// //     },
// //     {
// //       urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font\.css)$/i,
// //       handler: "StaleWhileRevalidate",
// //       options: {
// //         cacheName: "static-font-assets",
// //         expiration: { maxEntries: 4, maxAgeSeconds: 7 * 24 * 60 * 60 },
// //       },
// //     },
// //     {
// //       urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp|avif)$/i,
// //       handler: "CacheFirst",
// //       options: {
// //         cacheName: "static-image-assets",
// //         expiration: { maxEntries: 100, maxAgeSeconds: 7 * 24 * 60 * 60 },
// //       },
// //     },
// //     {
// //       urlPattern: /\.(?:js|css)$/i,
// //       handler: "StaleWhileRevalidate",
// //       options: {
// //         cacheName: "static-js-css",
// //         expiration: { maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 },
// //       },
// //     },
// //   ],
// // });

// // const nextConfig: NextConfig = {
// //   reactStrictMode: true,
// //   typescript: { ignoreBuildErrors: true },
// //   eslint: { ignoreDuringBuilds: true },

// //   images: {
// //     formats: ["image/avif", "image/webp"] as const,
// //     minimumCacheTTL: 60 * 60 * 24 * 7,
// //     deviceSizes: [640, 750, 828, 1080, 1200],
// //     imageSizes: [16, 32, 64, 96, 128, 256],
// //     remotePatterns: [
// //       { protocol: "https", hostname: "firebasestorage.googleapis.com", pathname: "**" },
// //       { protocol: "https", hostname: "lh3.googleusercontent.com", pathname: "**" },
// //       { protocol: "https", hostname: "images.unsplash.com", pathname: "**" },
// //       { protocol: "https", hostname: "i.postimg.cc", pathname: "**" },
// //     ],
// //   },

// //   async headers() {
// //     return [
// //       // ✅ FIX: Service Workers need special headers — no no-cache!
// //       {
// //         source: "/sw.js",
// //         headers: [
// //           { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
// //           { key: "Service-Worker-Allowed", value: "/" },
// //           { key: "Content-Type", value: "application/javascript" },
// //         ],
// //       },
// //       {
// //         source: "/sw-pwa.js",
// //         headers: [
// //           { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
// //           { key: "Service-Worker-Allowed", value: "/" },
// //           { key: "Content-Type", value: "application/javascript" },
// //         ],
// //       },
// //       // ✅ FIX: Manifest needs correct Content-Type
// //       {
// //         source: "/manifest.json",
// //         headers: [
// //           { key: "Content-Type", value: "application/manifest+json" },
// //           { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
// //         ],
// //       },
// //       // General pages — no-cache (بدون no-store عشان bfcache يشتغل)
// //       {
// //         source: "/(.*)",
// //         headers: [
// //           { key: "X-DNS-Prefetch-Control", value: "on" },
// //           { key: "Cache-Control", value: "no-cache, must-revalidate" },
// //         ],
// //       },
// //       // Static assets — immutable
// //       {
// //         source: "/(.*)\\.(?:png|jpg|jpeg|webp|avif|svg|ico|woff|woff2|js|css)",
// //         headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
// //       },
// //     ];
// //   },

// //   webpack: (config: any) => {
// //     config.resolve.alias = {
// //       ...config.resolve.alias,
// //       undici: false,
// //     };
// //     config.infrastructureLogging = { level: "error" };
// //     config.optimization = {
// //       ...config.optimization,
// //       sideEffects: true,
// //       usedExports: true,
// //     };
// //     return config;
// //   },
// // };

// // export default pwa(nextConfig);

// import type { NextConfig } from "next";
// import withPWA from "next-pwa";

// const pwa = withPWA({
//   dest: "public",
//   disable: process.env.NODE_ENV === "development",
//   register: true,
//   skipWaiting: true,
//   swDest: "public/sw-pwa.js",
//   runtimeCaching: [
//     {
//       urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/i,
//       handler: "CacheFirst",
//       options: {
//         cacheName: "sovereign-firestore-cache",
//         expiration: { maxEntries: 200, maxAgeSeconds: 24 * 60 * 60 },
//       },
//     },
//     {
//       urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
//       handler: "CacheFirst",
//       options: {
//         cacheName: "google-fonts",
//         expiration: { maxEntries: 4, maxAgeSeconds: 365 * 24 * 60 * 60 },
//       },
//     },
//     {
//       urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font\.css)$/i,
//       handler: "StaleWhileRevalidate",
//       options: {
//         cacheName: "static-font-assets",
//         expiration: { maxEntries: 4, maxAgeSeconds: 7 * 24 * 60 * 60 },
//       },
//     },
//     {
//       urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp|avif)$/i,
//       handler: "CacheFirst",
//       options: {
//         cacheName: "static-image-assets",
//         expiration: { maxEntries: 100, maxAgeSeconds: 7 * 24 * 60 * 60 },
//       },
//     },
//     {
//       urlPattern: /\.(?:js|css)$/i,
//       handler: "StaleWhileRevalidate",
//       options: {
//         cacheName: "static-js-css",
//         expiration: { maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 },
//       },
//     },
//   ],
// });

// const nextConfig: NextConfig = {
//   reactStrictMode: true,
//   typescript: { ignoreBuildErrors: true },
//   eslint: { ignoreDuringBuilds: true },

//   images: {
//     formats: ["image/avif", "image/webp"] as const,
//     minimumCacheTTL: 60 * 60 * 24 * 7,
//     deviceSizes: [640, 750, 828, 1080, 1200],
//     imageSizes: [16, 32, 64, 96, 128, 256],
//     remotePatterns: [
//       { protocol: "https", hostname: "firebasestorage.googleapis.com", pathname: "**" },
//       { protocol: "https", hostname: "lh3.googleusercontent.com", pathname: "**" },
//       { protocol: "https", hostname: "images.unsplash.com", pathname: "**" },
//       { protocol: "https", hostname: "i.postimg.cc", pathname: "**" },
//     ],
//   },

//   async headers() {
//     return [
//       // Service Workers
//       {
//         source: "/sw.js",
//         headers: [
//           { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
//           { key: "Service-Worker-Allowed", value: "/" },
//           { key: "Content-Type", value: "application/javascript" },
//         ],
//       },
//       {
//         source: "/sw-pwa.js",
//         headers: [
//           { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
//           { key: "Service-Worker-Allowed", value: "/" },
//           { key: "Content-Type", value: "application/javascript" },
//         ],
//       },
//       // Manifest
//       {
//         source: "/manifest.json",
//         headers: [
//           { key: "Content-Type", value: "application/manifest+json" },
//           { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
//         ],
//       },
//       // [PERF-FIX]: API routes — no-store مقبول هنا بس
//       {
//         source: "/api/(.*)",
//         headers: [{ key: "Cache-Control", value: "no-store" }],
//       },
//       // [PERF-FIX]: Dashboard + authenticated pages — private بيسمح بـ bfcache
//       {
//         source: "/(en|ar)/(dashboard|history|carrier|agent|ticket|admin)(.*)",
//         headers: [
//           { key: "Cache-Control", value: "private, no-cache, must-revalidate" },
//           { key: "X-DNS-Prefetch-Control", value: "on" },
//         ],
//       },
//       // [PERF-FIX]: Public pages (landing, login) — يستفيد من bfcache
//       {
//         source: "/(en|ar)$",
//         headers: [
//           { key: "Cache-Control", value: "public, max-age=60, stale-while-revalidate=300" },
//           { key: "X-DNS-Prefetch-Control", value: "on" },
//         ],
//       },
//       // Static assets — immutable
//       {
//         source: "/(.*)\\.(?:png|jpg|jpeg|webp|avif|svg|ico|woff|woff2)",
//         headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
//       },
//     ];
//   },

//   webpack: (config: any) => {
//     config.resolve.alias = {
//       ...config.resolve.alias,
//       undici: false,
//     };
//     config.infrastructureLogging = { level: "error" };
//     config.optimization = {
//       ...config.optimization,
//       sideEffects: true,
//       usedExports: true,
//     };
//     return config;
//   },
// };

// export default pwa(nextConfig);

import type { NextConfig } from "next";
import withPWA from "next-pwa";

const pwa = withPWA({
  dest: "public",
  // ✅ disable في development فقط
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  // ✅ sw-pwa.js منفصل عن sw.js (Firebase) — مهم جداً
  swDest: "public/sw-pwa.js",
  // ✅ fallback للـ offline
  fallbacks: {
    document: "/offline.html",
  },
  runtimeCaching: [
    // ✅ Firestore — NetworkFirst (بيانات real-time لازم تكون fresh)
    {
      urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "sovereign-firestore-cache",
        networkTimeoutSeconds: 10,
        expiration: { maxEntries: 200, maxAgeSeconds: 24 * 60 * 60 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    // ✅ Firebase Auth
    {
      urlPattern: /^https:\/\/identitytoolkit\.googleapis\.com\/.*/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "firebase-auth-cache",
        networkTimeoutSeconds: 10,
        expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    // ✅ Google Fonts — CacheFirst (ثابتة)
    {
      urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "google-fonts",
        expiration: { maxEntries: 4, maxAgeSeconds: 365 * 24 * 60 * 60 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    // ✅ Font files
    {
      urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font\.css)$/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-font-assets",
        expiration: { maxEntries: 4, maxAgeSeconds: 7 * 24 * 60 * 60 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    // ✅ Images — CacheFirst
    {
      urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp|avif)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "static-image-assets",
        expiration: { maxEntries: 100, maxAgeSeconds: 7 * 24 * 60 * 60 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    // ✅ Firebase Storage images
    {
      urlPattern: /^https:\/\/firebasestorage\.googleapis\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "firebase-storage-images",
        expiration: { maxEntries: 100, maxAgeSeconds: 7 * 24 * 60 * 60 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    // ✅ JS & CSS — StaleWhileRevalidate
    {
      urlPattern: /\.(?:js|css)$/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-js-css",
        expiration: { maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    // ✅ Next.js static files (_next/static)
    {
      urlPattern: /^\/_next\/static\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "next-static-assets",
        expiration: { maxEntries: 200, maxAgeSeconds: 365 * 24 * 60 * 60 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
  ],
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },

  // ✅ Compression
  compress: true,

  // ✅ PoweredByHeader — أمان وperformance
  poweredByHeader: false,

  images: {
    formats: ["image/avif", "image/webp"] as const,
    minimumCacheTTL: 60 * 60 * 24 * 7,
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 64, 96, 128, 256],
    remotePatterns: [
      { protocol: "https", hostname: "firebasestorage.googleapis.com", pathname: "/**" },
      { protocol: "https", hostname: "lh3.googleusercontent.com", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "i.postimg.cc", pathname: "/**" },
    ],
  },

  async headers() {
    return [
      // ✅ Security headers على كل الصفحات
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
      // ✅ Service Worker: Firebase (sw.js)
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
        ],
      },
      // ✅ Service Worker: PWA (sw-pwa.js)
      {
        source: "/sw-pwa.js",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
        ],
      },
      // ✅ Workbox (next-pwa يولّد workbox-*.js)
      {
        source: "/workbox-:hash.js",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
        ],
      },
      // ✅ Manifest
      {
        source: "/manifest.json",
        headers: [
          { key: "Content-Type", value: "application/manifest+json" },
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
        ],
      },
      // ✅ API routes — no caching
      {
        source: "/api/(.*)",
        headers: [{ key: "Cache-Control", value: "no-store, no-cache" }],
      },
      // ✅ Authenticated pages — private cache (يسمح بـ bfcache)
      {
        source: "/(en|ar)/(dashboard|history|carrier|agent|ticket|admin)(.*)",
        headers: [{ key: "Cache-Control", value: "private, no-cache, must-revalidate" }],
      },
      // ✅ Public landing pages — يستفيد من bfcache + ISR
      {
        source: "/(en|ar)$",
        headers: [{ key: "Cache-Control", value: "public, max-age=60, stale-while-revalidate=300" }],
      },
      // ✅ Next.js static assets — immutable 1 year
      {
        source: "/_next/static/(.*)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      // ✅ Static media assets — immutable 1 year
      {
        source: "/(.*)\\.(?:png|jpg|jpeg|webp|avif|svg|ico|woff|woff2)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },

  webpack: (config: any) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      undici: false,
    };
    config.infrastructureLogging = { level: "error" };

    // ✅ Tree shaking optimization
    config.optimization = {
      ...config.optimization,
      sideEffects: true,
      usedExports: true,
      moduleIds: "deterministic",
    };

    return config;
  },
};

export default pwa(nextConfig);
