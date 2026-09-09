"use client";

import CategoryPageLayout from "@/components/categorySections/CategoryPageLayout";
import CategoryDetailView from "@/components/categorySections/CategoryDetailView";
import CategoryContentView from "@/components/categorySections/CategoryContentView";
import CategoryEmptyPage from "@/components/categorySections/CategoryEmptyPage";
import {
  findCategoryByHref,
  hasChildren,
  hasTopics,
  type CategoryItem,
  type FoundCategory,
} from "@/components/categorySections/types";
import CategoryDetailSkeleton from "@/components/skeletons/CategoryDetailSkeleton";
import { useAppSelector } from "@/store/hooks";
import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";
import {
  buildFatwaCategoryHref,
  fatwasApi,
  useGetFatwaCategoryQuery,
  useGetFatwaContentQuery,
} from "@/store/fatwas/fatwasApi";

type FatwasNestedPageProps = {
  slug: string[];
};

const FatwasNestedPage = ({ slug }: FatwasNestedPageProps) => {
  const lang = LangUseParams();
  const translate = TranslateHook();
  const page = translate?.pages?.fatwasPage;
  const homeLabel = translate?.home?.navbar?.home;
  const routeId = slug.at(-1) ?? "";
  const categoryIds = slug
    .map((segment) => segment.match(/^category-(\d+)$/)?.[1] ?? null)
    .filter(Boolean) as string[];
  const fatwaMatch = routeId.match(/^fatwa-(\d+)$/);
  const categoryId = categoryIds.at(-1) ?? "";
  const rootCategoryId = categoryIds[0] ?? "";
  const fatwaId = fatwaMatch?.[1] ?? "";
  const targetCategoryHref = categoryIds.length
    ? `/fatwas/${categoryIds.map((id) => `category-${id}`).join("/")}`
    : undefined;
  const isApiCategoryRoute = Boolean(categoryIds.length);
  const isApiFatwaRoute = Boolean(fatwaId);

  const { data: apiCategory, isLoading } = useGetFatwaCategoryQuery(
    { id: rootCategoryId || categoryId, lang: lang ?? "ar" },
    { skip: !isApiCategoryRoute },
  );
  const { data: apiFatwa, isLoading: isFatwaLoading } = useGetFatwaContentQuery(
    { id: fatwaId, lang: lang ?? "ar" },
    { skip: !isApiFatwaRoute },
  );

  const cachedCategory = useAppSelector((state) => {
    if (!targetCategoryHref) return null;

    const queries = Object.values(
      (state[fatwasApi.reducerPath]?.queries ?? {}) as Record<
        string,
        { data?: unknown }
      >,
    );

    for (const query of queries) {
      const data = query?.data;
      const items = Array.isArray(data)
        ? (data as CategoryItem[])
        : data && typeof data === "object" && "id" in (data as object)
          ? [data as CategoryItem]
          : [];

      const found = findCategoryByHref(items, targetCategoryHref);
      if (found) return found;
    }

    return null as FoundCategory | null;
  });

  const apiCategoryMatch = targetCategoryHref && apiCategory
    ? findCategoryByHref([apiCategory], targetCategoryHref)
    : null;
  const resolvedCategory =
    apiCategoryMatch?.node ?? cachedCategory?.node ?? apiCategory ?? null;
  const resolvedTrail =
    apiCategoryMatch?.trail ??
    cachedCategory?.trail ??
    (resolvedCategory ? [resolvedCategory] : []);

  if (
    !page ||
    (isApiCategoryRoute && isLoading) ||
    (isApiFatwaRoute && isFatwaLoading)
  ) {
    let variant: "tabs" | "boxes" | "topics" | "content" =
      isApiFatwaRoute ? "content" : "boxes";

    if (resolvedCategory) {
      if (hasChildren(resolvedCategory) && hasTopics(resolvedCategory)) variant = "tabs";
      else if (hasChildren(resolvedCategory)) variant = "boxes";
      else if (hasTopics(resolvedCategory)) variant = "topics";
    }

    return <CategoryDetailSkeleton variant={variant} />;
  }

  if (isApiFatwaRoute && apiFatwa) {
    const title = apiFatwa.content.title;
    const crumbs = [
      { label: homeLabel, href: `/${lang}` },
      { label: page.title, href: `/${lang}/fatwas` },
      ...apiFatwa.trail.map((item, index) => ({
        label: item.title,
        href: `/${lang}/fatwas/${apiFatwa.trail
          .slice(0, index + 1)
          .map((entry) => `category-${entry.id}`)
          .join("/")}`,
      })),
      { label: title },
    ];

    return (
      <CategoryPageLayout crumbs={crumbs}>
        <CategoryContentView
          title={title}
          content={apiFatwa.content}
          pageKey="fatwasPage"
        />
      </CategoryPageLayout>
    );
  }

  if (isApiCategoryRoute && resolvedCategory) {
    if (hasChildren(resolvedCategory) || hasTopics(resolvedCategory)) {
      return (
        <CategoryDetailView
          node={resolvedCategory}
          trail={resolvedTrail}
          rootHref="/fatwas"
          pageKey="fatwasPage"
        />
      );
    }

    return (
      <CategoryEmptyPage
        title={resolvedCategory.title}
        crumbs={[
          { label: homeLabel, href: `/${lang}` },
          { label: page.title, href: `/${lang}/fatwas` },
          ...resolvedTrail.slice(0, -1).map((item) => ({
            label: item.title,
            href: `/${lang}${item.href}`,
          })),
          { label: resolvedCategory.title },
        ]}
        message={page.contentSoon}
      />
    );
  }

  return (
    <CategoryPageLayout crumbs={[{ label: homeLabel }, { label: page?.title ?? "" }]}>
      <p className="text-center text-sm grayColor">{page?.notFound}</p>
    </CategoryPageLayout>
  );
};

export default FatwasNestedPage;
