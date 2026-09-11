"use client";

import {
  findCategoryByHref,
  hasChildren,
  hasTopics,
  type CategoryItem,
  type FoundCategory,
} from "@/components/categorySections/types";
import {
  resolveCategorySkeletonCrumbs,
  resolveCategorySkeletonVariant,
} from "@/components/categorySections/resolveCategorySkeleton";
import { useAppSelector } from "@/store/hooks";
import type { RootState } from "@/store/store";

type CategoryQueryResult = {
  data?: CategoryItem | null;
  isLoading: boolean;
  isError: boolean;
};

type UseResolvedCategoryRouteArgs = {
  slug: string[];
  sectionPath: string;
  contentPrefix: string;
  lang: string;
  apiReducerPath: keyof RootState;
  useGetCategoryQuery: (
    args: { id: string; lang: string },
    options?: { skip?: boolean },
  ) => CategoryQueryResult;
  /**
   * Optional leaf items endpoint (`.../categories/:id/items`).
   * Used when the category detail has no nested sections and topics
   * live on the dedicated items payload (e.g. lectures).
   */
  useGetCategoryItemsQuery?: (
    args: { id: string; lang: string },
    options?: { skip?: boolean },
  ) => CategoryQueryResult;
};

const findCategoryById = (
  items: CategoryItem[],
  id: string,
  trail: CategoryItem[] = [],
): FoundCategory | null => {
  for (const item of items) {
    const nextTrail = [...trail, item];
    if (String(item.id) === id) {
      return { node: item, trail: nextTrail };
    }
    if (item.children?.length) {
      const found = findCategoryById(item.children, id, nextTrail);
      if (found) return found;
    }
  }
  return null;
};

const findCachedCategory = (
  state: RootState,
  apiReducerPath: keyof RootState,
  targetCategoryHref: string,
  leafCategoryId: string,
): FoundCategory | null => {
  const slice = state[apiReducerPath] as
    | { queries?: Record<string, { data?: unknown }> }
    | undefined;
  const queries = Object.values(slice?.queries ?? {});

  for (const query of queries) {
    const data = query?.data;
    const items = Array.isArray(data)
      ? (data as CategoryItem[])
      : data && typeof data === "object" && "id" in (data as object)
        ? [data as CategoryItem]
        : [];

    const byHref = findCategoryByHref(items, targetCategoryHref);
    if (byHref) return byHref;

    const byId = findCategoryById(items, leafCategoryId);
    if (byId) return byId;
  }

  return null;
};

const withHref = (category: CategoryItem, href?: string): CategoryItem =>
  href && category.href !== href ? { ...category, href } : category;

const categoryHasContent = (category: CategoryItem | null | undefined) =>
  Boolean(category && (hasChildren(category) || hasTopics(category)));

/**
 * Resolves nested category routes.
 *
 * - `GET .../categories/:id` for sections tree
 * - optional `GET .../categories/:id/items` for topic links on leaf categories
 * - root category (when nested) rebuilds breadcrumb trail
 */
export const useResolvedCategoryRoute = ({
  slug,
  sectionPath,
  contentPrefix,
  lang,
  apiReducerPath,
  useGetCategoryQuery,
  useGetCategoryItemsQuery,
}: UseResolvedCategoryRouteArgs) => {
  const routeId = slug.at(-1) ?? "";
  const categoryIds = slug
    .map((segment) => segment.match(/^category-(\d+)$/)?.[1] ?? null)
    .filter(Boolean) as string[];
  const contentMatch = routeId.match(
    new RegExp(`^${contentPrefix}-(\\d+)$`),
  );
  const leafCategoryId = categoryIds.at(-1) ?? "";
  const rootCategoryId = categoryIds[0] ?? "";
  const contentId = contentMatch?.[1] ?? "";
  const targetCategoryHref = categoryIds.length
    ? `${sectionPath}/${categoryIds.map((id) => `category-${id}`).join("/")}`
    : undefined;
  const isCategoryRoute = Boolean(categoryIds.length);
  const isContentRoute = Boolean(contentId);
  const needsRootTrail =
    isCategoryRoute &&
    Boolean(rootCategoryId) &&
    rootCategoryId !== leafCategoryId;

  const {
    data: leafCategory,
    isLoading: isLeafLoading,
    isError: isLeafError,
  } = useGetCategoryQuery(
    { id: leafCategoryId, lang },
    { skip: !isCategoryRoute || !leafCategoryId },
  );

  const { data: rootCategory, isLoading: isRootLoading } = useGetCategoryQuery(
    { id: rootCategoryId, lang },
    { skip: !needsRootTrail },
  );

  const hasItemsEndpoint = Boolean(useGetCategoryItemsQuery);
  const getCategoryItems = useGetCategoryItemsQuery ?? useGetCategoryQuery;

  const leafLooksLikeSectionTree =
    Boolean(leafCategory) && hasChildren(leafCategory!);

  // Sub-sub routes always use /items. Shallower leaves use /items only when
  // category detail has no nested sections (topics live on the items payload).
  const shouldFetchItems =
    hasItemsEndpoint &&
    isCategoryRoute &&
    Boolean(leafCategoryId) &&
    (categoryIds.length >= 3 ||
      (!isLeafLoading && (isLeafError || !leafLooksLikeSectionTree)));

  const {
    data: itemsCategory,
    isLoading: isItemsLoading,
    isError: isItemsError,
  } = getCategoryItems(
    { id: leafCategoryId, lang },
    {
      skip: !shouldFetchItems || !leafCategoryId,
    },
  );

  const cachedCategory = useAppSelector((state) => {
    if (!targetCategoryHref || !leafCategoryId) return null;
    return findCachedCategory(
      state,
      apiReducerPath,
      targetCategoryHref,
      leafCategoryId,
    );
  });

  const treeSource = rootCategory ?? (!needsRootTrail ? leafCategory : null);
  const treeMatch = treeSource
    ? (findCategoryByHref([treeSource], targetCategoryHref ?? "") ??
      (leafCategoryId
        ? findCategoryById([treeSource], leafCategoryId)
        : null))
    : null;

  const itemsNode =
    !isItemsError && itemsCategory
      ? withHref(itemsCategory, targetCategoryHref)
      : null;

  const leafNode =
    !isLeafError && leafCategory
      ? withHref(leafCategory, targetCategoryHref)
      : null;

  // Prefer /items (topics) when present; otherwise category tree / cache.
  const resolvedCategory = categoryHasContent(itemsNode)
    ? itemsNode
    : categoryHasContent(leafNode)
      ? leafNode
      : categoryHasContent(treeMatch?.node)
        ? withHref(treeMatch!.node, targetCategoryHref)
        : categoryHasContent(cachedCategory?.node)
          ? withHref(cachedCategory!.node, targetCategoryHref)
          : itemsNode ??
            leafNode ??
            (treeMatch?.node
              ? withHref(treeMatch.node, targetCategoryHref)
              : null) ??
            (cachedCategory?.node
              ? withHref(cachedCategory.node, targetCategoryHref)
              : null);

  const resolvedTrail = (() => {
    const baseTrail =
      treeMatch?.trail ??
      cachedCategory?.trail ??
      (resolvedCategory ? [resolvedCategory] : []);

    if (!resolvedCategory || !baseTrail.length) return baseTrail;

    const trail = baseTrail.map((item) =>
      String(item.id) === String(resolvedCategory.id)
        ? resolvedCategory
        : item,
    );

    if (String(trail[trail.length - 1]?.id) !== String(resolvedCategory.id)) {
      return [...trail, resolvedCategory];
    }

    return trail;
  })();

  const isCategoryLoading =
    isCategoryRoute &&
    (isLeafLoading ||
      (shouldFetchItems && isItemsLoading) ||
      (needsRootTrail && isRootLoading && !resolvedCategory));

  const skeletonVariant = resolveCategorySkeletonVariant({
    isContentRoute,
    categoryIds,
    resolvedCategory,
    expectsItems: shouldFetchItems || Boolean(itemsNode && hasTopics(itemsNode)),
  });

  const skeletonCrumbs = resolveCategorySkeletonCrumbs({
    isContentRoute,
    categoryIds,
  });

  return {
    categoryIds,
    leafCategoryId,
    rootCategoryId,
    contentId,
    targetCategoryHref,
    isCategoryRoute,
    isContentRoute,
    isCategoryLoading,
    resolvedCategory,
    resolvedTrail,
    skeletonVariant,
    skeletonCrumbs,
  };
};
