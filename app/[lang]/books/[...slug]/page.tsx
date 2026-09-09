import type { Metadata } from "next";
import BooksNestedPage from "@/components/books/BooksNestedPage";
import { generateContentSlugMetadata } from "@/lib/contentMetadata";

type BooksSlugPageProps = {
  params: Promise<{ lang: string; slug: string[] }>;
};

export async function generateMetadata({
  params,
}: BooksSlugPageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  return generateContentSlugMetadata({
    lang,
    slug,
    section: "books",
    fallbackTitle: "الكتب والرسائل",
  });
}

export default async function BooksSlugPage({
  params,
}: BooksSlugPageProps) {
  const { slug } = await params;
  return <BooksNestedPage slug={slug} />;
}
