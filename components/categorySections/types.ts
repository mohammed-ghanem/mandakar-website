export type CategoryTopic = {
  id: string | number;
  title: string;
  href?: string;
};

export type CategoryItem = {
  id: string | number;
  title: string;
  /** Path after the locale, e.g. `/scholarly/quran` */
  href?: string;
  image?: string;
  /** Topics linked directly to this category */
  topics?: CategoryTopic[];
  /** Nested sub-categories */
  children?: CategoryItem[];
};

export type CategorySectionsProps = {
  items: CategoryItem[];
  className?: string;
};

export type FoundCategory = {
  node: CategoryItem;
  trail: CategoryItem[];
  topic?: CategoryTopic;
};

export const withLang = (lang: string | undefined, href?: string) => {
  if (!href) return undefined;
  if (href.startsWith("http")) return href;
  const path = href.startsWith("/") ? href : `/${href}`;
  return `/${lang ?? "ar"}${path}`;
};

export const hasChildren = (item: CategoryItem) =>
  Boolean(item.children && item.children.length > 0);

export const hasTopics = (item: CategoryItem) =>
  Boolean(item.topics && item.topics.length > 0);

export const findCategoryByHref = (
  items: CategoryItem[],
  href: string,
  trail: CategoryItem[] = [],
): FoundCategory | null => {
  for (const item of items) {
    const nextTrail = [...trail, item];
    if (item.href === href) {
      return { node: item, trail: nextTrail };
    }

    const topic = item.topics?.find((entry) => entry.href === href);
    if (topic) {
      return { node: item, trail: nextTrail, topic };
    }

    if (item.children?.length) {
      const found = findCategoryByHref(item.children, href, nextTrail);
      if (found) return found;
    }
  }
  return null;
};
