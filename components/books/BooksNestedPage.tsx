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
  buildBookCategoryHref,
  booksApi,
  useGetBookCategoryQuery,
  useGetBookContentQuery,
} from "@/store/books/booksApi";

type BooksNestedPageProps = {
  slug: string[];
};

const BooksNestedPage = ({ slug }: BooksNestedPageProps) => {
  const lang = LangUseParams();
  const translate = TranslateHook();
  const page = translate?.pages?.booksPage;
  const homeLabel = translate?.home?.navbar?.home;
  const routeId = slug.at(-1) ?? "";
  const categoryIds = slug
    .map((segment) => segment.match(/^category-(\d+)$/)?.[1] ?? null)
    .filter(Boolean) as string[];
  const bookMatch = routeId.match(/^book-(\d+)$/);
  const categoryId = categoryIds.at(-1) ?? "";
  const rootCategoryId = categoryIds[0] ?? "";
  const bookId = bookMatch?.[1] ?? "";
  const targetCategoryHref = categoryIds.length
    ? `/books/${categoryIds.map((id) => `category-${id}`).join("/")}`
    : undefined;
  const isApiCategoryRoute = Boolean(categoryIds.length);
  const isApiBookRoute = Boolean(bookId);

  const { data: apiCategory, isLoading } = useGetBookCategoryQuery(
    { id: rootCategoryId || categoryId, lang: lang ?? "ar" },
    { skip: !isApiCategoryRoute },
  );
  const { data: apiBook, isLoading: isBookLoading } = useGetBookContentQuery(
    { id: bookId, lang: lang ?? "ar" },
    { skip: !isApiBookRoute },
  );

  const cachedCategory = useAppSelector((state) => {
    if (!targetCategoryHref) return null;

    const queries = Object.values(
      (state[booksApi.reducerPath]?.queries ?? {}) as Record<
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
    (isApiBookRoute && isBookLoading)
  ) {
    let variant: "tabs" | "boxes" | "topics" | "content" =
      isApiBookRoute ? "content" : "boxes";

    if (resolvedCategory) {
      if (hasChildren(resolvedCategory) && hasTopics(resolvedCategory)) variant = "tabs";
      else if (hasChildren(resolvedCategory)) variant = "boxes";
      else if (hasTopics(resolvedCategory)) variant = "topics";
    }

    return <CategoryDetailSkeleton variant={variant} />;
  }

  if (isApiBookRoute && apiBook) {
    const title = apiBook.content.title;
    const crumbs = [
      { label: homeLabel, href: `/${lang}` },
      { label: page.title, href: `/${lang}/books` },
      ...apiBook.trail.map((item, index) => ({
        label: item.title,
        href: `/${lang}/books/${apiBook.trail
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
          content={apiBook.content}
          pageKey="booksPage"
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
          rootHref="/books"
          pageKey="booksPage"
        />
      );
    }

    return (
      <CategoryEmptyPage
        title={resolvedCategory.title}
        crumbs={[
          { label: homeLabel, href: `/${lang}` },
          { label: page.title, href: `/${lang}/books` },
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

export default BooksNestedPage;
