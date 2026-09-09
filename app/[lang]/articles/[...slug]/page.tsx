import type { Metadata } from "next";
import ArticlesNestedPage from "@/components/articles/ArticlesNestedPage";
import { generateContentSlugMetadata } from "@/lib/contentMetadata";

type ArticlesSlugPageProps = {
  params: Promise<{ lang: string; slug: string[] }>;
};

export async function generateMetadata({
  params,
}: ArticlesSlugPageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  return generateContentSlugMetadata({
    lang,
    slug,
    section: "articles",
    fallbackTitle: "المقالات",
  });
}

export default async function ArticlesSlugPage({
  params,
}: ArticlesSlugPageProps) {
  const { slug } = await params;
  return <ArticlesNestedPage slug={slug} />;
}
