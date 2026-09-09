import type { Metadata } from "next";
import PublicAboutPage from "@/components/staticPages/PublicAboutPage";
import { buildPageMetadata } from "@/lib/contentMetadata";

export const metadata: Metadata = buildPageMetadata({
  title: "ترجمة الشيخ",
  description:
    "ترجمة الشيخ فلاح مندكار رحمه الله تعالى، ضمن المكتبة العلمية الرقمية للتراث العلمي.",
  path: "/about",
  keywords: [
    "ترجمة الشيخ",
    "الشيخ فلاح مندكار",
    "التراث العلمى للشيخ فلاح مندكار",
  ],
});

export default function AboutPage() {
  return <PublicAboutPage />;
}
