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
  scholarlyApi,
  useGetScholarlyCategoryItemsQuery,
  useGetScholarlyCategoryQuery,
  useGetScholarlyExplanationQuery,
} from "@/store/scholarly/scholarlyApi";

type ScholarlyNestedPageProps = {
  slug: string[];
};

const ScholarlyNestedPage = ({ slug }: ScholarlyNestedPageProps) => {
  const lang = LangUseParams();
  const translate = TranslateHook();
  const page = translate?.pages?.scholarlyPage;
  const homeLabel = translate?.home?.navbar?.home;

  const {
    isCategoryRoute,
    isContentRoute,
    contentId,
    isCategoryLoading,
    resolvedCategory,
    resolvedTrail,
    skeletonVariant,
    skeletonCrumbs,
  } = useResolvedCategoryRoute({
    slug,
    sectionPath: "/scholarly",
    contentPrefix: "explanation",
    lang: lang ?? "ar",
    apiReducerPath: scholarlyApi.reducerPath,
    useGetCategoryQuery: useGetScholarlyCategoryQuery,
    useGetCategoryItemsQuery: useGetScholarlyCategoryItemsQuery,
  });

  const { data: apiExplanation, isLoading: isExplanationLoading } =
    useGetScholarlyExplanationQuery(
      { id: contentId, lang: lang ?? "ar" },
      { skip: !isContentRoute },
    );

  if (
    !page ||
    isCategoryLoading ||
    (isContentRoute && isExplanationLoading)
  ) {
    return (
      <CategoryDetailSkeleton
        variant={skeletonVariant}
        crumbs={skeletonCrumbs}
      />
    );
  }

  if (isContentRoute && apiExplanation) {
    const title = apiExplanation.content.title;
    const crumbs = [
      { label: homeLabel, href: `/${lang}` },
      { label: page.title, href: `/${lang}/scholarly` },
      ...apiExplanation.trail.map((item, index) => ({
        label: item.title,
        href: `/${lang}/scholarly/${apiExplanation.trail
          .slice(0, index + 1)
          .map((entry) => `category-${entry.id}`)
          .join("/")}`,
      })),
      { label: title },
    ];

    return (
      <CategoryPageLayout crumbs={crumbs}>
        <CategoryContentView title={title} content={apiExplanation.content} />
      </CategoryPageLayout>
    );
  }

  if (isCategoryRoute && resolvedCategory) {
    if (hasChildren(resolvedCategory) || hasTopics(resolvedCategory)) {
      return (
        <CategoryDetailView
          node={resolvedCategory}
          trail={resolvedTrail}
          rootHref="/scholarly"
        />
      );
    }

    return (
      <CategoryEmptyPage
        title={resolvedCategory.title}
        crumbs={[
          { label: homeLabel, href: `/${lang}` },
          { label: page.title, href: `/${lang}/scholarly` },
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
      crumbs={[{ label: homeLabel }, { label: page.title }]}
    >
      <p className="text-center text-sm grayColor">{page.notFound}</p>
    </CategoryPageLayout>
  );
};

export default ScholarlyNestedPage;
