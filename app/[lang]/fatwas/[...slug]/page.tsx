import FatwasNestedPage from "@/components/fatwas/FatwasNestedPage";

type FatwasSlugPageProps = {
  params: Promise<{ lang: string; slug: string[] }>;
};

export default async function FatwasSlugPage({
  params,
}: FatwasSlugPageProps) {
  const { slug } = await params;
  return <FatwasNestedPage slug={slug} />;
}
