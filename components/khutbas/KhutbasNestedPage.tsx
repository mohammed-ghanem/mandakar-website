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
  speechesApi,
  useGetSpeechCategoryQuery,
  useGetSpeechContentQuery,
} from "@/store/speeches/speechesApi";

type KhutbasNestedPageProps = {
  slug: string[];
};

const KhutbasNestedPage = ({ slug }: KhutbasNestedPageProps) => {
  const lang = LangUseParams();
  const translate = TranslateHook();
  const page = translate?.pages?.khutbasPage;
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
    sectionPath: "/khutbas",
    contentPrefix: "speech",
    lang: lang ?? "ar",
    apiReducerPath: speechesApi.reducerPath,
    useGetCategoryQuery: useGetSpeechCategoryQuery,
  });

  const { data: apiSpeech, isLoading: isSpeechLoading } =
    useGetSpeechContentQuery(
      { id: contentId, lang: lang ?? "ar" },
      { skip: !isContentRoute },
    );

  if (!page || isCategoryLoading || (isContentRoute && isSpeechLoading)) {
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

  if (isContentRoute && apiSpeech) {
    const title = apiSpeech.content.title;
    const crumbs = [
      { label: homeLabel, href: `/${lang}` },
      { label: page.title, href: `/${lang}/khutbas` },
      ...apiSpeech.trail.map((item, index) => ({
        label: item.title,
        href: `/${lang}/khutbas/${apiSpeech.trail
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
          content={apiSpeech.content}
          pageKey="khutbasPage"
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
          rootHref="/khutbas"
          pageKey="khutbasPage"
        />
      );
    }

    return (
      <CategoryEmptyPage
        title={resolvedCategory.title}
        crumbs={[
          { label: homeLabel, href: `/${lang}` },
          { label: page.title, href: `/${lang}/khutbas` },
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

export default KhutbasNestedPage;
