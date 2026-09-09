import type { Metadata } from "next";
import FatwasNestedPage from "@/components/fatwas/FatwasNestedPage";
import { generateContentSlugMetadata } from "@/lib/contentMetadata";

type FatwasSlugPageProps = {
  params: Promise<{ lang: string; slug: string[] }>;
};

export async function generateMetadata({
  params,
}: FatwasSlugPageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  return generateContentSlugMetadata({
    lang,
    slug,
    section: "fatwas",
    fallbackTitle: "الفتاوى",
  });
}

export default async function FatwasSlugPage({
  params,
}: FatwasSlugPageProps) {
  const { slug } = await params;
  return <FatwasNestedPage slug={slug} />;
}
