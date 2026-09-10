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
  SITE_DESCRIPTION_EN,
  SITE_KEYWORDS,
  SITE_TITLE,
  SITE_TITLE_EN,
  getDefaultOgImage,
} from "@/lib/siteMetadata";

type LayoutProps = {
  children: ReactNode;
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({
  params,
}: LayoutProps): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === "en";
  const site = getSiteUrl();
  const title = isEn ? SITE_TITLE_EN : SITE_TITLE;
  const description = isEn ? SITE_DESCRIPTION_EN : SITE_DESCRIPTION;
  const ogImage = getDefaultOgImage();

  return {
    metadataBase: new URL(site),
    title: {
      default: title,
      template: `%s - ${title}`,
    },
    description,
    keywords: [...SITE_KEYWORDS],
    authors: [
      {
        name: title,
        url: site,
      },
    ],
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
    },
    openGraph: {
      title,
      description,
      url: site,
      siteName: title,
      locale: isEn ? "en" : "ar",
      type: "website",
      images: [
        {
          url: ogImage,
          alt: title,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        {
          url: ogImage,
          alt: title,
        },
      ],
    },
  };
}

export default async function RootLayout({ children, params }: LayoutProps) {
  const { lang } = await params;
  const dir = lang === "ar" ? "rtl" : "ltr";
  const description = lang === "en" ? SITE_DESCRIPTION_EN : SITE_DESCRIPTION;

  return (
    <html lang={lang} dir={dir}>
      <head>
        <meta name="description" content={description} />
      </head>
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
