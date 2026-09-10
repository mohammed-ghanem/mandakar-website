"use client";

import CategoryPageLayout from "@/components/categorySections/CategoryPageLayout";
import CategoryDetailView from "@/components/categorySections/CategoryDetailView";
import CategoryContentView from "@/components/categorySections/CategoryContentView";
import CategoryEmptyPage from "@/components/categorySections/CategoryEmptyPage";
import { useResolvedCategoryRoute } from "@/components/categorySections/useResolvedCategoryRoute";
import { hasChildren, hasTopics } from "@/components/categorySections/types";
import CategoryDetailSkeleton from "@/components/skeletons/CategoryDetailSkeleton";
import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";
import {
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

  const {
    isCategoryRoute,
    isContentRoute,
    contentId,
    isCategoryLoading,
    resolvedCategory,
    resolvedTrail,
  } = useResolvedCategoryRoute({
    slug,
    sectionPath: "/fatwas",
    contentPrefix: "fatwa",
    lang: lang ?? "ar",
    apiReducerPath: fatwasApi.reducerPath,
    useGetCategoryQuery: useGetFatwaCategoryQuery,
  });

  const { data: apiFatwa, isLoading: isFatwaLoading } = useGetFatwaContentQuery(
    { id: contentId, lang: lang ?? "ar" },
    { skip: !isContentRoute },
  );

  if (!page || isCategoryLoading || (isContentRoute && isFatwaLoading)) {
    let variant: "tabs" | "boxes" | "topics" | "content" = isContentRoute
      ? "content"
      : "boxes";

    if (resolvedCategory) {
      if (hasChildren(resolvedCategory) && hasTopics(resolvedCategory))
        variant = "tabs";
      else if (hasChildren(resolvedCategory)) variant = "boxes";
      else if (hasTopics(resolvedCategory)) variant = "topics";
    }

    return <CategoryDetailSkeleton variant={variant} />;
  }

  if (isContentRoute && apiFatwa) {
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

  if (isCategoryRoute && resolvedCategory) {
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
    <CategoryPageLayout
      crumbs={[{ label: homeLabel }, { label: page?.title ?? "" }]}
    >
      <p className="text-center text-sm grayColor">{page?.notFound}</p>
    </CategoryPageLayout>
  );
};

export default FatwasNestedPage;
