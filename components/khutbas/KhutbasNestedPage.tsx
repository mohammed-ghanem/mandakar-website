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
  buildKhutbaCategoryHref,
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
  const routeId = slug.at(-1) ?? "";
  const categoryIds = slug
    .map((segment) => segment.match(/^category-(\d+)$/)?.[1] ?? null)
    .filter(Boolean) as string[];
  const speechMatch = routeId.match(/^speech-(\d+)$/);
  const categoryId = categoryIds.at(-1) ?? "";
  const rootCategoryId = categoryIds[0] ?? "";
  const speechId = speechMatch?.[1] ?? "";
  const targetCategoryHref = categoryIds.length
    ? `/khutbas/${categoryIds.map((id) => `category-${id}`).join("/")}`
    : undefined;
  const isApiCategoryRoute = Boolean(categoryIds.length);
  const isApiSpeechRoute = Boolean(speechId);

  const { data: apiCategory, isLoading } = useGetSpeechCategoryQuery(
    { id: rootCategoryId || categoryId, lang: lang ?? "ar" },
    { skip: !isApiCategoryRoute },
  );
  const { data: apiSpeech, isLoading: isSpeechLoading } = useGetSpeechContentQuery(
    { id: speechId, lang: lang ?? "ar" },
    { skip: !isApiSpeechRoute },
  );

  const cachedCategory = useAppSelector((state) => {
    if (!targetCategoryHref) return null;

    const queries = Object.values(
      (state[speechesApi.reducerPath]?.queries ?? {}) as Record<
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
    (isApiSpeechRoute && isSpeechLoading)
  ) {
    let variant: "tabs" | "boxes" | "topics" | "content" =
      isApiSpeechRoute ? "content" : "boxes";

    if (resolvedCategory) {
      if (hasChildren(resolvedCategory) && hasTopics(resolvedCategory)) variant = "tabs";
      else if (hasChildren(resolvedCategory)) variant = "boxes";
      else if (hasTopics(resolvedCategory)) variant = "topics";
    }

    return <CategoryDetailSkeleton variant={variant} />;
  }

  if (isApiSpeechRoute && apiSpeech) {
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

  if (isApiCategoryRoute && resolvedCategory) {
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
    <CategoryPageLayout crumbs={[{ label: homeLabel }, { label: page?.title ?? "" }]}>
      <p className="text-center text-sm grayColor">{page?.notFound}</p>
    </CategoryPageLayout>
  );
};

export default KhutbasNestedPage;
