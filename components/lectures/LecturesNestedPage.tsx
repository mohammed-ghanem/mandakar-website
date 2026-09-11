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
  lecturesApi,
  useGetLectureCategoryItemsQuery,
  useGetLectureCategoryQuery,
  useGetLectureContentQuery,
} from "@/store/lectures/lecturesApi";

type LecturesNestedPageProps = {
  slug: string[];
};

const LecturesNestedPage = ({ slug }: LecturesNestedPageProps) => {
  const lang = LangUseParams();
  const translate = TranslateHook();
  const page = translate?.pages?.lecturesPage;
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
    sectionPath: "/lectures",
    contentPrefix: "lecture",
    lang: lang ?? "ar",
    apiReducerPath: lecturesApi.reducerPath,
    useGetCategoryQuery: useGetLectureCategoryQuery,
    useGetCategoryItemsQuery: useGetLectureCategoryItemsQuery,
  });

  const { data: apiLecture, isLoading: isLectureLoading } =
    useGetLectureContentQuery(
      { id: contentId, lang: lang ?? "ar" },
      { skip: !isContentRoute },
    );

  if (!page || isCategoryLoading || (isContentRoute && isLectureLoading)) {
    return (
      <CategoryDetailSkeleton
        variant={skeletonVariant}
        crumbs={skeletonCrumbs}
      />
    );
  }

  if (isContentRoute && apiLecture) {
    const title = apiLecture.content.title;
    const crumbs = [
      { label: homeLabel, href: `/${lang}` },
      { label: page.title, href: `/${lang}/lectures` },
      ...apiLecture.trail.map((item, index) => ({
        label: item.title,
        href: `/${lang}/lectures/${apiLecture.trail
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
          content={apiLecture.content}
          pageKey="lecturesPage"
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
          rootHref="/lectures"
          pageKey="lecturesPage"
        />
      );
    }

    return (
      <CategoryEmptyPage
        title={resolvedCategory.title}
        crumbs={[
          { label: homeLabel, href: `/${lang}` },
          { label: page.title, href: `/${lang}/lectures` },
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

export default LecturesNestedPage;
