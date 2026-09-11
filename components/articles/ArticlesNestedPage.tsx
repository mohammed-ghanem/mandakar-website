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
  articlesApi,
  useGetArticleCategoryItemsQuery,
  useGetArticleCategoryQuery,
  useGetArticleContentQuery,
} from "@/store/articles/articlesApi";

type ArticlesNestedPageProps = {
  slug: string[];
};

const ArticlesNestedPage = ({ slug }: ArticlesNestedPageProps) => {
  const lang = LangUseParams();
  const translate = TranslateHook();
  const page = translate?.pages?.articlesPage;
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
    sectionPath: "/articles",
    contentPrefix: "article",
    lang: lang ?? "ar",
    apiReducerPath: articlesApi.reducerPath,
    useGetCategoryQuery: useGetArticleCategoryQuery,
    useGetCategoryItemsQuery: useGetArticleCategoryItemsQuery,
  });

  const { data: apiArticle, isLoading: isArticleLoading } =
    useGetArticleContentQuery(
      { id: contentId, lang: lang ?? "ar" },
      { skip: !isContentRoute },
    );

  if (!page || isCategoryLoading || (isContentRoute && isArticleLoading)) {
    return (
      <CategoryDetailSkeleton
        variant={skeletonVariant}
        crumbs={skeletonCrumbs}
      />
    );
  }

  if (isContentRoute && apiArticle) {
    const title = apiArticle.content.title;
    const crumbs = [
      { label: homeLabel, href: `/${lang}` },
      { label: page.title, href: `/${lang}/articles` },
      ...apiArticle.trail.map((item, index) => ({
        label: item.title,
        href: `/${lang}/articles/${apiArticle.trail
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
          content={apiArticle.content}
          pageKey="articlesPage"
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
          rootHref="/articles"
          pageKey="articlesPage"
        />
      );
    }

    return (
      <CategoryEmptyPage
        title={resolvedCategory.title}
        crumbs={[
          { label: homeLabel, href: `/${lang}` },
          { label: page.title, href: `/${lang}/articles` },
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

export default ArticlesNestedPage;
