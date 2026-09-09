import LecturesNestedPage from "@/components/lectures/LecturesNestedPage";

type LecturesSlugPageProps = {
  params: Promise<{ lang: string; slug: string[] }>;
};

export default async function LecturesSlugPage({
  params,
}: LecturesSlugPageProps) {
  const { slug } = await params;
  return <LecturesNestedPage slug={slug} />;
}
