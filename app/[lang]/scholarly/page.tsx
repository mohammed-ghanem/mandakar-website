import type { Metadata } from "next";
import ScholarlyPage from "@/components/scholarly/ScholarlyPage";
import { buildPageMetadata } from "@/lib/contentMetadata";

type PageProps = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  return buildPageMetadata({
    lang,
    title: lang === "en" ? "Scholarly Explanations" : "الشروح العلمية",
    description:
      lang === "en"
        ? "Browse Sheikh Falah Mandakar's scholarly explanations by category and topic."
        : "تصفح الشروح العلمية للشيخ فلاح مندكار حسب الأقسام والموضوعات.",
    path: "/scholarly",
  });
}

export default function Scholarly() {
  return <ScholarlyPage />;
}
