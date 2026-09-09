import type { Metadata } from "next";
import LecturesNestedPage from "@/components/lectures/LecturesNestedPage";
import { generateContentSlugMetadata } from "@/lib/contentMetadata";

type LecturesSlugPageProps = {
  params: Promise<{ lang: string; slug: string[] }>;
};

export async function generateMetadata({
  params,
}: LecturesSlugPageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  return generateContentSlugMetadata({
    lang,
    slug,
    section: "lectures",
    fallbackTitle: "المحاضرات",
  });
}

export default async function LecturesSlugPage({
  params,
}: LecturesSlugPageProps) {
  const { slug } = await params;
  return <LecturesNestedPage slug={slug} />;
}
