import ScholarlyNestedPage from "@/components/scholarly/ScholarlyNestedPage";

type ScholarlySlugPageProps = {
  params: Promise<{ lang: string; slug: string[] }>;
};

export default async function ScholarlySlugPage({
  params,
}: ScholarlySlugPageProps) {
  const { slug } = await params;
  return <ScholarlyNestedPage slug={slug} />;
}
