import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "../../providers/Providers";
import { ReactNode } from "react";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { getSiteUrl } from "@/lib/siteUrl";
import {
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_TITLE,
  getDefaultOgImage,
} from "@/lib/siteMetadata";

const site = getSiteUrl();
const ogImage = getDefaultOgImage();

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: {
    default: SITE_TITLE,
    template: `%s - ${SITE_TITLE}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [...SITE_KEYWORDS],
  authors: [
    {
      name: SITE_TITLE,
      url: site,
    },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: site,
    siteName: SITE_TITLE,
    locale: "ar",
    type: "website",
    images: [
      {
        url: ogImage,
        alt: SITE_TITLE,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: ogImage,
        alt: SITE_TITLE,
      },
    ],
  },
};

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <html lang={lang} dir={dir}>
      <body className="overflow-x-hidden">
        <Providers>
          <div className="">
            <div>
              <Header />
              <main>
                <div className="mx-auto">{children}</div>
              </main>
              <Footer />
            </div>
          </div>
        </Providers>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
