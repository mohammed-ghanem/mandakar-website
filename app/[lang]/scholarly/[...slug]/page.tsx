import type { Metadata } from "next";
import ScholarlyNestedPage from "@/components/scholarly/ScholarlyNestedPage";
import { generateContentSlugMetadata } from "@/lib/contentMetadata";

type ScholarlySlugPageProps = {
  params: Promise<{ lang: string; slug: string[] }>;
};

export async function generateMetadata({
  params,
}: ScholarlySlugPageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  return generateContentSlugMetadata({
    lang,
    slug,
    section: "scholarly",
    fallbackTitle: "الشروح العلمية",
  });
}

export default async function ScholarlySlugPage({
  params,
}: ScholarlySlugPageProps) {
  const { slug } = await params;
  return <ScholarlyNestedPage slug={slug} />;
}
