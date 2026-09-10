"use client";

import {
  findCategoryByHref,
  hasChildren,
  hasTopics,
  type CategoryItem,
  type FoundCategory,
} from "@/components/categorySections/types";
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
 * Resolves nested category routes using the same category endpoints already used
 * by the project (`GET .../categories/:id`).
 *
 * - Leaf category id is fetched for topics/children
 * - Root category is fetched (when nested) only to rebuild breadcrumb trail
 * - Cache is a fallback if a request is unavailable
 */
export const useResolvedCategoryRoute = ({
  slug,
  sectionPath,
  contentPrefix,
  lang,
  apiReducerPath,
  useGetCategoryQuery,
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
    ? findCategoryByHref(
        [treeSource],
        targetCategoryHref ?? "",
      ) ??
      (leafCategoryId
        ? findCategoryById([treeSource], leafCategoryId)
        : null)
    : null;

  const leafNode =
    !isLeafError && leafCategory
      ? withHref(leafCategory, targetCategoryHref)
      : null;

  // Prefer the leaf endpoint payload (this is where topics live).
  // Fall back to parent-tree/cache only when leaf has no usable content.
  const resolvedCategory = categoryHasContent(leafNode)
    ? leafNode
    : categoryHasContent(treeMatch?.node)
      ? withHref(treeMatch!.node, targetCategoryHref)
      : categoryHasContent(cachedCategory?.node)
        ? withHref(cachedCategory!.node, targetCategoryHref)
        : leafNode ??
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

    if (
      String(trail[trail.length - 1]?.id) !== String(resolvedCategory.id)
    ) {
      return [...trail, resolvedCategory];
    }

    return trail;
  })();

  const isCategoryLoading =
    isCategoryRoute &&
    (isLeafLoading || (needsRootTrail && isRootLoading && !resolvedCategory));

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
  };
};
