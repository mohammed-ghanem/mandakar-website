import { hasChildren, hasTopics, type CategoryItem } from "./types";

export type CategorySkeletonVariant = "tabs" | "boxes" | "topics" | "content";

type ResolveCategorySkeletonArgs = {
  isContentRoute: boolean;
  categoryIds: string[];
  resolvedCategory?: CategoryItem | null;
  /** True while the leaf is expected to load topic items via /items */
  expectsItems?: boolean;
};

/**
 * Picks the closest skeleton layout for nested category/content routes
 * so loading states don't flash the wrong shape (boxes vs topics vs content).
 */
export const resolveCategorySkeletonVariant = ({
  isContentRoute,
  categoryIds,
  resolvedCategory,
  expectsItems = false,
}: ResolveCategorySkeletonArgs): CategorySkeletonVariant => {
  if (isContentRoute) return "content";

  if (resolvedCategory) {
    if (hasChildren(resolvedCategory) && hasTopics(resolvedCategory)) {
      return "tabs";
    }
    if (hasChildren(resolvedCategory)) return "boxes";
    if (hasTopics(resolvedCategory)) return "topics";
  }

  // Sub-sub routes and leaf /items fetches usually render topic links.
  if (expectsItems || categoryIds.length >= 3) return "topics";

  // Main / mid categories usually render section boxes.
  return "boxes";
};

/** home + section + category trail (+ content title when applicable) */
export const resolveCategorySkeletonCrumbs = ({
  isContentRoute,
  categoryIds,
}: {
  isContentRoute: boolean;
  categoryIds: string[];
}) => {
  const base = 2; // home + section
  if (isContentRoute) return base + Math.max(categoryIds.length, 1) + 1;
  return base + Math.max(categoryIds.length, 1);
};
