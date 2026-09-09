import KhutbasNestedPage from "@/components/khutbas/KhutbasNestedPage";

type KhutbasSlugPageProps = {
  params: Promise<{ lang: string; slug: string[] }>;
};

export default async function KhutbasSlugPage({
  params,
}: KhutbasSlugPageProps) {
  const { slug } = await params;
  return <KhutbasNestedPage slug={slug} />;
}
