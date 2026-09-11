import type { Metadata } from "next";
import { Suspense } from "react";
import SearchPage from "@/components/search/SearchPage";
import SearchPageSkeleton from "@/components/skeletons/SearchPageSkeleton";
import { buildPageMetadata } from "@/lib/contentMetadata";

type SearchRouteProps = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({
  params,
  searchParams,
}: SearchRouteProps): Promise<Metadata> {
  const { lang } = await params;
  const { q } = await searchParams;
  const query = q?.trim();
  const title = query ? `نتائج البحث: ${query}` : "نتائج البحث";

  return {
    ...buildPageMetadata({
      lang,
      title,
      path: "/search",
      description: query
        ? `نتائج البحث عن ${query} في التراث العلمى للشيخ فلاح مندكار`
        : "ابحث في التراث العلمى للشيخ فلاح مندكار",
    }),
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default function SearchRoute() {
  return (
    <Suspense fallback={<SearchPageSkeleton />}>
      <SearchPage />
    </Suspense>
  );
}
