import BooksNestedPage from "@/components/books/BooksNestedPage";

type BooksSlugPageProps = {
  params: Promise<{ lang: string; slug: string[] }>;
};

export default async function BooksSlugPage({
  params,
}: BooksSlugPageProps) {
  const { slug } = await params;
  return <BooksNestedPage slug={slug} />;
}
