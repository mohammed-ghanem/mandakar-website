import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "../../providers/Providers";
import { ReactNode } from "react";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";

export const metadata: Metadata = {
  title: "التراث العلمى للشيخ فلاح مندكار",
  description:
    "التراث العلمى للشيخ فلاح مندكار رحمة الله تعالى مكتبة علمية رقمية تضم الخطب والمحاضرات والدروس والمقالات والكتب والفتاوى، لتكون مرجعًا علميًا يسهل الوصول إليه والاستفادة منه.",
  keywords: [
    "التراث العلمى للشيخ فلاح مندكار",
    "التراث العلمى للشيخ فلاح مندكار رحمة الله تعالى",
    "التراث العلمى للشيخ فلاح مندكار مكتبة علمية رقمية",
    "التراث العلمى للشيخ فلاح مندكار الخطب والمحاضرات والدروس والمقالات والكتب والفتاوى",
    "التراث العلمى للشيخ فلاح مندكار تكون مرجعًا علميًا يسهل الوصول إليه والاستفادة منه.",
  ],
  authors: [
    {
      name: "التراث العلمى للشيخ فلاح مندكار",
      // url: "https://academy.sorooj.org",
    },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "التراث العلمى للشيخ فلاح مندكار",
    description:
      "التراث العلمى للشيخ فلاح مندكار رحمة الله تعالى مكتبة علمية رقمية تضم الخطب والمحاضرات والدروس والمقالات والكتب والفتاوى، لتكون مرجعًا علميًا يسهل الوصول إليه والاستفادة منه.",
    // url: "https://academy.sorooj.org",
    siteName: "التراث العلمى للشيخ فلاح مندكار",
    locale: "ar",
    type: "website",
    // images: [
    //   {
    //     url: "https://academy.sorooj.org/assets/images/meta.png",
    //     alt: "التراث العلمى للشيخ فلاح مندكار",
    //     width: 1200,
    //     height: 630,
    //   },
    // ],
  },
  twitter: {
    card: "summary_large_image",
    title: "التراث العلمى للشيخ فلاح مندكار",
    description:
      "التراث العلمى للشيخ فلاح مندكار رحمة الله تعالى مكتبة علمية رقمية تضم الخطب والمحاضرات والدروس والمقالات والكتب والفتاوى، لتكون مرجعًا علميًا يسهل الوصول إليه والاستفادة منه.",
    // images: [
    //   {
    //     url: "https://academy.sorooj.org/assets/images/meta.png",
    //     alt: "اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
    //   },
    // ],
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
      </body>
    </html>
  );
}
