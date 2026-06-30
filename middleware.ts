import { NextResponse, type NextRequest } from "next/server";
import { i18n } from "@/i18n-config";
import { defaultLocale } from "./constants/locales";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const localeInPath = i18n.locales.find(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );

  if (!localeInPath) {
    const res = NextResponse.rewrite(
      new URL(`/${defaultLocale}${pathname}${search}`, request.url),
    );
    res.cookies.set("lang", defaultLocale, { path: "/" });
    return res;
  }

  const locale = localeInPath;

  if (locale === defaultLocale) {
    const dest = pathname.replace(`/${defaultLocale}`, "") || "/";
    const res = NextResponse.redirect(new URL(`${dest}${search}`, request.url));
    res.cookies.set("lang", defaultLocale, { path: "/" });
    return res;
  }

  const res = NextResponse.next();
  res.cookies.set("lang", locale, { path: "/" });
  return res;
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};
