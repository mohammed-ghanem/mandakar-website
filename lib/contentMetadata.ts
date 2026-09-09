import type { Metadata } from "next";
import { defaultLocale } from "@/constants/locales";
import {
  SITE_DESCRIPTION,
  SITE_DESCRIPTION_EN,
  SITE_TITLE,
  SITE_TITLE_EN,
  getDefaultOgImage,
} from "@/lib/siteMetadata";
import { getSiteUrl } from "@/lib/siteUrl";

export type ContentSection =
  | "lectures"
  | "khutbas"
  | "fatwas"
  | "articles"
  | "books"
  | "scholarly";

type LocalizedText = {
  ar?: string;
  en?: string;
};

type ContentMeta = {
  title: string;
  description?: string;
  image?: string;
};

type SectionConfig = {
  pathPrefix: string;
  apiBase: string;
  contentPrefix: string;
  dataKey: string;
  categoryItemsKey: string;
};

const SECTION_CONFIG: Record<ContentSection, SectionConfig> = {
  lectures: {
    pathPrefix: "/lectures",
    apiBase: "lectures",
    contentPrefix: "lecture",
    dataKey: "lecture",
    categoryItemsKey: "lectures",
  },
  khutbas: {
    pathPrefix: "/khutbas",
    apiBase: "speeches",
    contentPrefix: "speech",
    dataKey: "speech",
    categoryItemsKey: "speeches",
  },
  fatwas: {
    pathPrefix: "/fatwas",
    apiBase: "fatwas",
    contentPrefix: "fatwa",
    dataKey: "fatwa",
    categoryItemsKey: "fatwas",
  },
  articles: {
    pathPrefix: "/articles",
    apiBase: "articles",
    contentPrefix: "article",
    dataKey: "article",
    categoryItemsKey: "articles",
  },
  books: {
    pathPrefix: "/books",
    apiBase: "books",
    contentPrefix: "book",
    dataKey: "book",
    categoryItemsKey: "books",
  },
  scholarly: {
    pathPrefix: "/scholarly",
    apiBase: "explanations",
    contentPrefix: "explanation",
    dataKey: "explanation",
    categoryItemsKey: "explanations",
  },
};

const getApiBaseUrl = () =>
  (process.env.NEXT_PUBLIC_BASE_URL ?? "").replace(/\/$/, "");

const getApiHeaders = (lang: string): HeadersInit => {
  const headers: HeadersInit = {
    "Accept-Language": lang,
    Accept: "application/json",
  };
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;
  if (apiKey) headers["api-key"] = apiKey;
  return headers;
};

const getLocalizedText = (
  localized: LocalizedText | string | null | undefined,
  fallback?: string | null,
  lang = "ar",
) => {
  if (typeof localized === "string" && localized.trim()) return localized.trim();
  if (localized && typeof localized === "object") {
    const value = localized[lang as keyof LocalizedText] || localized.ar || localized.en;
    if (value?.trim()) return value.trim();
  }
  return fallback?.trim() || "";
};

const stripHtml = (value?: string | null) => {
  if (!value) return "";
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const truncate = (value: string, max = 160) => {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1).trimEnd()}…`;
};

const absolutePublicUrl = (lang: string, path: string) => {
  const base = getSiteUrl();
  const normalized = path.startsWith("/") ? path : `/${path}`;

  if (lang === defaultLocale) {
    return `${base}${normalized === "/" ? "/" : normalized}`;
  }

  if (normalized === "/") return `${base}/en`;
  return `${base}/en${normalized}`;
};

const siteTitleForLang = (lang: string) =>
  lang === "en" ? SITE_TITLE_EN : SITE_TITLE;

const siteDescriptionForLang = (lang: string) =>
  lang === "en" ? SITE_DESCRIPTION_EN : SITE_DESCRIPTION;

async function fetchJson(url: string, lang: string) {
  const response = await fetch(url, {
    headers: getApiHeaders(lang),
    next: { revalidate: 3600 },
  });

  if (!response.ok) return null;
  return response.json();
}

async function fetchContentMeta(
  section: ContentSection,
  contentId: string,
  lang: string,
): Promise<ContentMeta | null> {
  const config = SECTION_CONFIG[section];
  const apiBase = getApiBaseUrl();
  if (!apiBase) return null;

  const json = await fetchJson(
    `${apiBase}/client-api/v1/${config.apiBase}/${contentId}`,
    lang,
  );
  const item = json?.data?.[config.dataKey];
  if (!item) return null;

  const title = getLocalizedText(item.title, item._title, lang);
  if (!title) return null;

  const description = truncate(
    stripHtml(
      getLocalizedText(item.description, item._description, lang) ||
        siteDescriptionForLang(lang),
    ),
  );

  return {
    title,
    description: description || siteDescriptionForLang(lang),
    image: item.image || undefined,
  };
}

async function fetchCategoryMeta(
  section: ContentSection,
  categoryId: string,
  lang: string,
): Promise<ContentMeta | null> {
  const config = SECTION_CONFIG[section];
  const apiBase = getApiBaseUrl();
  if (!apiBase) return null;

  const json = await fetchJson(
    `${apiBase}/client-api/v1/${config.apiBase}/categories/${categoryId}`,
    lang,
  );
  const category = json?.data?.category;
  if (!category) return null;

  const title = getLocalizedText(
    category.name,
    category._name || category.name_,
    lang,
  );
  if (!title) return null;

  return {
    title,
    description: siteDescriptionForLang(lang),
    image: category.image || undefined,
  };
}

export function buildPageMetadata({
  lang = "ar",
  title,
  description,
  path,
  image,
  keywords,
  type = "website",
}: {
  lang?: string;
  title: string;
  description?: string;
  path: string;
  image?: string;
  keywords?: string[];
  type?: "website" | "article";
}): Metadata {
  const siteTitle = siteTitleForLang(lang);
  const fullTitle = title.includes(siteTitle) ? title : `${title} - ${siteTitle}`;
  const desc = description?.trim() || siteDescriptionForLang(lang);
  const url = absolutePublicUrl(lang, path);
  const ogImage = image || getDefaultOgImage();

  return {
    title: {
      absolute: fullTitle,
    },
    description: desc,
    keywords,
    authors: [{ name: siteTitle, url: getSiteUrl() }],
    robots: "index, follow",
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description: desc,
      url,
      siteName: siteTitle,
      locale: lang === "en" ? "en" : "ar",
      type,
      images: [
        {
          url: ogImage,
          alt: title,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: [
        {
          url: ogImage,
          alt: title,
        },
      ],
    },
  };
}

export async function generateContentSlugMetadata({
  lang,
  slug,
  section,
  fallbackTitle,
}: {
  lang: string;
  slug: string[];
  section: ContentSection;
  fallbackTitle: string;
}): Promise<Metadata> {
  const config = SECTION_CONFIG[section];
  const routeId = slug.at(-1) ?? "";
  const contentMatch = routeId.match(
    new RegExp(`^${config.contentPrefix}-(\\d+)$`),
  );
  const categoryMatch = routeId.match(/^category-(\d+)$/);
  const path = `${config.pathPrefix}/${slug.join("/")}`;

  let meta: ContentMeta | null = null;

  if (contentMatch?.[1]) {
    meta = await fetchContentMeta(section, contentMatch[1], lang);
  } else if (categoryMatch?.[1]) {
    meta = await fetchCategoryMeta(section, categoryMatch[1], lang);
  }

  return buildPageMetadata({
    lang,
    title: meta?.title || fallbackTitle,
    description: meta?.description,
    path,
    image: meta?.image,
    type: contentMatch ? "article" : "website",
  });
}

type SitemapCategoryNode = {
  id: string | number;
  children?: SitemapCategoryNode[];
  lectures?: Array<{ id: string | number }>;
  speeches?: Array<{ id: string | number }>;
  fatwas?: Array<{ id: string | number }>;
  articles?: Array<{ id: string | number }>;
  books?: Array<{ id: string | number }>;
  explanations?: Array<{ id: string | number }>;
  other_topics?: Array<{ id: string | number }>;
};

const getCategoryTopicItems = (
  section: ContentSection,
  category: SitemapCategoryNode,
) => {
  const config = SECTION_CONFIG[section];
  if (category.other_topics?.length) return category.other_topics;

  return (
    (category[config.categoryItemsKey as keyof SitemapCategoryNode] as
      | Array<{ id: string | number }>
      | undefined) ?? []
  );
};

/**
 * Walks every category detail (roots + nested children) and builds the same
 * flat public URLs the app uses: `/section/category-{id}` and
 * `/section/{contentPrefix}-{id}`.
 */
export async function fetchSectionSitemapPaths(
  section: ContentSection,
  lang = "ar",
): Promise<string[]> {
  const config = SECTION_CONFIG[section];
  const apiBase = getApiBaseUrl();
  if (!apiBase) return [config.pathPrefix];

  try {
    const listJson = await fetchJson(
      `${apiBase}/client-api/v1/${config.apiBase}/categories`,
      lang,
    );
    const roots = (listJson?.data?.categories ?? []) as Array<{
      id: string | number;
    }>;

    const paths = new Set<string>([config.pathPrefix]);
    const visited = new Set<string>();
    let pending = roots.map((root) => String(root.id));

    while (pending.length > 0) {
      const batch = pending.filter((id) => !visited.has(id));
      pending = [];
      if (batch.length === 0) break;

      for (const id of batch) visited.add(id);

      const detailResults = await Promise.all(
        batch.map((id) =>
          fetchJson(
            `${apiBase}/client-api/v1/${config.apiBase}/categories/${id}`,
            lang,
          ),
        ),
      );

      for (const result of detailResults) {
        const category = result?.data?.category as
          | SitemapCategoryNode
          | undefined;
        if (!category) continue;

        paths.add(`${config.pathPrefix}/category-${category.id}`);

        for (const item of getCategoryTopicItems(section, category)) {
          paths.add(
            `${config.pathPrefix}/${config.contentPrefix}-${item.id}`,
          );
        }

        for (const child of category.children ?? []) {
          const childId = String(child.id);
          if (!visited.has(childId)) pending.push(childId);
        }
      }
    }

    return Array.from(paths);
  } catch {
    return [config.pathPrefix];
  }
}

export { absolutePublicUrl, SECTION_CONFIG };
