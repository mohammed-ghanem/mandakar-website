import { Metadata } from "next";
import PublicAboutPage from "@/components/staticPages/PublicAboutPage";

export const metadata: Metadata = {
  title: "ترجمة الشيخ - التراث العلمى للشيخ فلاح مندكار",
  description:
    "ترجمة الشيخ فلاح مندكار رحمه الله تعالى، ضمن المكتبة العلمية الرقمية للتراث العلمي.",
  keywords: [
    "ترجمة الشيخ",
    "الشيخ فلاح مندكار",
    "التراث العلمى للشيخ فلاح مندكار",
  ],
  authors: [
    {
      name: "التراث العلمى للشيخ فلاح مندكار",
      url: "https://mandekar.net",
    },
  ],
  robots: "index, follow",
  openGraph: {
    title: "ترجمة الشيخ - التراث العلمى للشيخ فلاح مندكار",
    description:
      "ترجمة الشيخ فلاح مندكار رحمه الله تعالى، ضمن المكتبة العلمية الرقمية للتراث العلمي.",
    url: "https://mandekar.net/about",
    siteName: "التراث العلمى للشيخ فلاح مندكار",
    locale: "ar",
    type: "website",
    images: [
      {
        url: "https://mandekar.net/assets/images/meta.png",
        alt: "التراث العلمى للشيخ فلاح مندكار",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function AboutPage() {
  return <PublicAboutPage />;
}
