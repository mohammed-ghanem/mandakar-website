import { hasChildren, hasTopics, type CategoryItem } from "./types";

export type CategorySkeletonVariant = "tabs" | "boxes" | "topics" | "content";

type ResolveCategorySkeletonArgs = {
  isContentRoute: boolean;
  categoryIds: string[];
  resolvedCategory?: CategoryItem | null;
  /** True while the leaf is expected to load topic items via /items */
  expectsItems?: boolean;
  /** Section APIs that support .../categories/:id/items */
  hasItemsEndpoint?: boolean;
};

/**
 * Picks the closest skeleton layout for nested category/content routes
 * so loading states match the real UI (2-col topics vs section boxes).
 */
export const resolveCategorySkeletonVariant = ({
  isContentRoute,
  categoryIds,
  resolvedCategory,
  expectsItems = false,
  hasItemsEndpoint = false,
}: ResolveCategorySkeletonArgs): CategorySkeletonVariant => {
  if (isContentRoute) return "content";

  if (resolvedCategory) {
    if (hasChildren(resolvedCategory) && hasTopics(resolvedCategory)) {
      return "tabs";
    }
    if (hasChildren(resolvedCategory)) return "boxes";
    if (hasTopics(resolvedCategory)) return "topics";
  }

  // Leaf /items routes and deep nests render the 2-column topics list.
  if (expectsItems || categoryIds.length >= 3) return "topics";

  // With an items endpoint, depth-1 is usually a topics leaf until proven otherwise.
  if (hasItemsEndpoint && categoryIds.length === 1) return "topics";

  // Mid-level section trees render the boxes grid.
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
