import ArticlesNestedPage from "@/components/articles/ArticlesNestedPage";

type ArticlesSlugPageProps = {
  params: Promise<{ lang: string; slug: string[] }>;
};

export default async function ArticlesSlugPage({
  params,
}: ArticlesSlugPageProps) {
  const { slug } = await params;
  return <ArticlesNestedPage slug={slug} />;
}
