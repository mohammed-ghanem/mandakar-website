import { NextResponse, type NextRequest } from "next/server";
import { i18n } from "@/i18n-config";
import { defaultLocale } from "./constants/locales";

const LEGACY_PAGE = /\.(aspx|asp|ashx|html?)$/i;

const LEGACY_SECTIONS: { keywords: string[]; target: string }[] = [
  { keywords: ["article", "maqal"], target: "/articles" },
  { keywords: ["book", "kotob", "kutub", "library"], target: "/books" },
  { keywords: ["fatwa", "fatawa", "fatwas"], target: "/fatwas" },
  { keywords: ["lecture", "lesson", "dars", "doros", "muhadara"], target: "/lectures" },
  { keywords: ["khutba", "khotba", "khutab", "speech", "sermon"], target: "/khutbas" },
  { keywords: ["sharh", "shar7", "explanation", "scholarly"], target: "/scholarly" },
  { keywords: ["about", "biography", "sheikh", "tarjama"], target: "/about" },
  { keywords: ["contact"], target: "/contact-us" },
];

const getLegacyTarget = (pathname: string) => {
  const page = pathname.toLowerCase();
  const match = LEGACY_SECTIONS.find(({ keywords }) =>
    keywords.some((keyword) => page.includes(keyword)),
  );
  return match?.target ?? "/";
};

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (LEGACY_PAGE.test(pathname)) {
    return NextResponse.redirect(
      new URL(getLegacyTarget(pathname), request.url),
      301,
    );
  }

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
