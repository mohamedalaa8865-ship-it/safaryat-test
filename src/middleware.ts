// import createMiddleware from "next-intl/middleware";
// import { routing } from "./i18n/routing";
// import { NextResponse, type NextRequest } from "next/server";
// import { decodeJwt } from "jose";
// import { SOVEREIGN_MASTER_EMAIL } from "./lib/constants";

// /**
//  * @file src/middleware.ts
//  * @description THE REINFORCED SOVEREIGN BORDER GUARD (STERILIZED - V15.5 - FINAL SEAL)
//  * [SCR-988]: Hardened Official Email Firewall with legacy Master bypass.
//  * Protocol 30: Dictatorship of the Token.
//  */

// const intlMiddleware = createMiddleware(routing);

// function parseSovereignPath(url: string) {
//   const { pathname, search } = new URL(url);
//   const segments = pathname.split("/").filter(Boolean);
//   const locale = routing.locales.includes(segments[0] as any) ? segments[0] : routing.defaultLocale;
//   const pathWithoutLocale = routing.locales.includes(segments[0] as any) ? "/" + segments.slice(1).join("/") : pathname;

//   return { pathname, search, locale, pathWithoutLocale };
// }

// export default function middleware(request: NextRequest) {
//   const { pathname, search, locale, pathWithoutLocale } = parseSovereignPath(request.url);
//   const session = request.cookies.get("__session")?.value;

//   // 1. 🛡️ [Static & API Bypass] - حماية الموارد (P88)
//   if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".")) {
//     return NextResponse.next();
//   }

//   const isAdminZone = pathWithoutLocale.startsWith("/admin");
//   const isLoginRoute = pathWithoutLocale === "/login" || pathWithoutLocale === "/admin/login";
//   const isProtectedRoute =
//     isAdminZone || ["/carrier", "/dashboard", "/history", "/chats", "/profile", "/agent"].some((p) => pathWithoutLocale.startsWith(p));

//   // 2. 🛡️ [Anonymous Access Control]
//   if (!session) {
//     if (isProtectedRoute && !isLoginRoute) {
//       const target = isAdminZone ? `/${locale}/admin/login` : `/${locale}/login`;
//       const redirectUrl = new URL(target, request.url);
//       redirectUrl.searchParams.set("returnTo", pathname + search);
//       return NextResponse.redirect(redirectUrl);
//     }
//     return intlMiddleware(request);
//   }

//   try {
//     const payload = decodeJwt(session);
//     const email = ((payload.email as string) || "").toLowerCase().trim();
//     const role = ((payload.role as string) || "").toLowerCase();

//     console.log(`[GUARD]: Email: ${email} | Role: ${role} | Path: ${pathWithoutLocale}`);
//     // 3. 🛡️ [Security Check: Deactivation]
//     if (!!payload.isDeactivated) {
//       const response = NextResponse.redirect(new URL(`/${locale}/login`, request.url));
//       response.cookies.delete("__session");
//       return response;
//     }

//     // 4. 🛡️ [The Sovereign Firewall]: Official Domain Enforcement (@safaryat.net)
//     // [SCR-988]: Allowing both safaryat.net and legacy safar-gate.com during transition.
//     const isOfficialEmail = email.endsWith("@safaryat.net") || email.endsWith("@safar-gate.com");
//     const eliteRoles = ["agent", "admin", "operations_manager", "owner", "developer"];

//     // [MASTER_BYPASS]: السماح للمالك بالدخول مهما كان بريده (براءة الذمة التاريخية)
//     const isRootOwner = email === SOVEREIGN_MASTER_EMAIL.toLowerCase() || email === "fayzgabli22@gmail.com";

//     if (eliteRoles.includes(role) && !isOfficialEmail && !isRootOwner) {
//       const response = NextResponse.redirect(new URL(`/${locale}/login?error=OFFICIAL_EMAIL_REQUIRED`, request.url));
//       response.cookies.delete("__session");
//       return response;
//     }

//     // 5. 🛡️ [Domain Isolation Logic]
//     if (role === "agent") {
//       const isAgentZone = ["/agent", "/chats", "/profile"].some((p) => pathWithoutLocale.startsWith(p));
//       if (!isAgentZone) return NextResponse.redirect(new URL(`/${locale}/agent`, request.url));
//       return intlMiddleware(request);
//     }

//     const hasAdminPower = isRootOwner || ["owner", "admin", "operations_manager", "developer"].includes(role);

//     if (isAdminZone) {
//       if (!hasAdminPower) return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
//       if (isLoginRoute) return NextResponse.redirect(new URL(`/${locale}/admin`, request.url));
//       return intlMiddleware(request);
//     }

//     if (role === "carrier" && (pathWithoutLocale === "/" || pathWithoutLocale.startsWith("/dashboard"))) {
//       return NextResponse.redirect(new URL(`/${locale}/carrier`, request.url));
//     }

//     if (role === "traveler" && (pathWithoutLocale === "/" || pathWithoutLocale.startsWith("/carrier"))) {
//       return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
//     }
//   } catch (error) {
//     const response = NextResponse.redirect(new URL(`/${locale}/login`, request.url));
//     response.cookies.delete("__session");
//     return response;
//   }

//   return intlMiddleware(request);
// }

// export const config = {
//   matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
// };

import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextResponse, type NextRequest } from "next/server";
import { decodeJwt } from "jose";
import { SOVEREIGN_MASTER_EMAIL, ELITE_ROLES, PROTECTED_ROUTES } from "./lib/constants";

const intlMiddleware = createMiddleware(routing);

function parseSovereignPath(url: string) {
  const { pathname, search } = new URL(url);
  const segments = pathname.split("/").filter(Boolean);
  const locale = routing.locales.includes(segments[0] as any) ? segments[0] : routing.defaultLocale;
  const pathWithoutLocale = routing.locales.includes(segments[0] as any) ? "/" + segments.slice(1).join("/") : pathname;

  return { pathname, search, locale, pathWithoutLocale };
}

export default function middleware(request: NextRequest) {
  const { pathname, search, locale, pathWithoutLocale } = parseSovereignPath(request.url);
  const session = request.cookies.get("__session")?.value;

  // 1. 🛡️ Static & API Bypass
  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".")) {
    return NextResponse.next();
  }

  const isAdminZone = pathWithoutLocale.startsWith("/admin");
  const isLoginRoute = pathWithoutLocale === "/login" || pathWithoutLocale === "/admin/login";
  const isProtectedRoute = PROTECTED_ROUTES.some((p) => pathWithoutLocale.startsWith(p));

  // 2. 🛡️ Anonymous Access
  if (!session) {
    if (isProtectedRoute && !isLoginRoute) {
      const target = isAdminZone ? `/${locale}/admin/login` : `/${locale}/login`;
      const redirectUrl = new URL(target, request.url);
      redirectUrl.searchParams.set("returnTo", pathname + search);
      return NextResponse.redirect(redirectUrl);
    }
    return intlMiddleware(request);
  }

  try {
    const payload = decodeJwt(session);
    const email = ((payload.email as string) || "").toLowerCase().trim();
    const role = ((payload.role as string) || "").toLowerCase();

    // [SCR-2026-045] MW_AUDIT
    console.log(`MW_AUDIT: [${email}] [${role}] [Target: ${pathWithoutLocale}]`);

    // 3. 🛡️ Security Check
    if (!!payload.isDeactivated) {
      const response = NextResponse.redirect(new URL(`/${locale}/login`, request.url));
      response.cookies.delete("__session");
      return response;
    }

    // 4. 🛡️ The Sovereign Firewall
    const isRootOwner = email === SOVEREIGN_MASTER_EMAIL.toLowerCase();
    const isOfficialEmail = email.endsWith("@safaryat.net") || email.endsWith("@safar-gate.com");

    // if (ELITE_ROLES.includes(role as any) && !isOfficialEmail && !isRootOwner) {
    const rolesRequiringOfficialEmail = ELITE_ROLES.filter((r) => r !== "agent");
    if (rolesRequiringOfficialEmail.includes(role as any) && !isOfficialEmail && !isRootOwner) {
      const response = NextResponse.redirect(new URL(`/${locale}/login?error=OFFICIAL_EMAIL_REQUIRED`, request.url));
      response.cookies.delete("__session");
      return response;
    }

    // 5. 🛡️ Role Redirection Logic
    // const hasAdminPower = isRootOwner || ["owner", "admin", "developer"].includes(role);

    // if (isAdminZone && !hasAdminPower) {
    //   return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
    // }

    // // if (role === "carrier" && pathWithoutLocale.startsWith("/dashboard")) {
    // //   return NextResponse.redirect(new URL(`/${locale}/carrier`, request.url));
    // // }
    // if (role === "carrier" && pathWithoutLocale === "/chats") {
    //   return NextResponse.redirect(new URL(`/${locale}/carrier/chats`, request.url));
    // }
    // 5. 🛡️ Role Redirection Logic
    const hasAdminPower = isRootOwner || ["owner", "admin", "developer"].includes(role);

    if (isAdminZone && !hasAdminPower) {
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
    }

    // ✅ الناقل يروح /carrier/chats مش /chats
    if (role === "carrier" && pathWithoutLocale === "/chats") {
      return NextResponse.redirect(new URL(`/${locale}/carrier/chats`, request.url));
    }

    // ✅ الناقل يروح /carrier مش /dashboard
    if (role === "carrier" && pathWithoutLocale.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL(`/${locale}/carrier`, request.url));
    }
  } catch (error) {
    const response = NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    response.cookies.delete("__session");
    return response;
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
