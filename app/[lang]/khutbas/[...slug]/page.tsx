import type { Metadata } from "next";
import KhutbasNestedPage from "@/components/khutbas/KhutbasNestedPage";
import { generateContentSlugMetadata } from "@/lib/contentMetadata";

type KhutbasSlugPageProps = {
  params: Promise<{ lang: string; slug: string[] }>;
};

export async function generateMetadata({
  params,
}: KhutbasSlugPageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  return generateContentSlugMetadata({
    lang,
    slug,
    section: "khutbas",
    fallbackTitle: "الخطب",
  });
}

export default async function KhutbasSlugPage({
  params,
}: KhutbasSlugPageProps) {
  const { slug } = await params;
  return <KhutbasNestedPage slug={slug} />;
}
