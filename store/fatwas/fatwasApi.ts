import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/store/base/axiosBaseQuery";
import type {
  CategoryItem,
  CategoryTopic,
} from "@/components/categorySections/types";
import type {
  ScholarlyExplanationContent,
  ScholarlyExplanationPageData,
} from "@/store/scholarly/scholarlyApi";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const FATWAS_API_BASE = `${BASE_URL}/client-api/v1/fatwas`;

export const buildFatwaCategoryHref = (id: string | number) =>
  `/fatwas/category-${id}`;
export const buildFatwaHref = (id: string | number) => `/fatwas/fatwa-${id}`;
const buildNestedFatwaCategoryHref = (
  id: string | number,
  parentHref?: string,
) => (parentHref ? `${parentHref}/category-${id}` : buildFatwaCategoryHref(id));

type ApiLocalizedText = {
  ar?: string;
  en?: string;
};

type ApiFatwaItem = {
  id: string | number;
  title?: ApiLocalizedText;
  _title?: string;
  image?: string | null;
  sort_order?: number;
};

type ApiFatwaCategory = {
  id: string | number;
  name?: ApiLocalizedText;
  _name?: string;
  sort_order?: number;
  has_sections?: boolean;
  has_other_topics?: boolean;
  children?: ApiFatwaCategory[];
  fatwas?: ApiFatwaItem[];
  other_topics?: ApiFatwaItem[];
};

type ApiCategoriesResponse = {
  data?: {
    categories?: ApiFatwaCategory[];
  };
};

type ApiCategoryResponse = {
  data?: {
    category?: ApiFatwaCategory;
  };
};

type ApiFatwaResponse = {
  data?: {
    fatwa?: {
      id: string | number;
      title?: ApiLocalizedText;
      _title?: string;
      image?: string | null;
      video_url?: string | null;
      youtube_url?: string | null;
      audio?: string | null;
      description?: ApiLocalizedText | string | null;
      _description?: string;
      views_count?: number;
      attachments?: Array<{
        id: string | number;
        title?: ApiLocalizedText;
        _title?: string;
        file?: string | null;
        url?: string | null;
      }>;
      external_links?: Array<{
        id: string | number;
        title?: ApiLocalizedText;
        _title?: string;
        url?: string | null;
        href?: string | null;
      }>;
      previous_item?: ApiFatwaItem | null;
      next_item?: ApiFatwaItem | null;
      continue_series?: ApiFatwaItem[];
      related_topics?: ApiFatwaItem[];
      main_category?: {
        id: string | number;
        name?: ApiLocalizedText;
        _name?: string;
      } | null;
      subcategory?: {
        id: string | number;
        name?: ApiLocalizedText;
        _name?: string;
      } | null;
      sub_subcategory?: {
        id: string | number;
        name?: ApiLocalizedText;
        _name?: string;
      } | null;
    };
  };
};

const getLocalizedText = (
  localized: ApiLocalizedText | undefined,
  fallback: string | undefined,
  lang: string,
) => localized?.[lang as keyof ApiLocalizedText] || fallback || "";

const sortByOrder = <T extends { sort_order?: number }>(
  items?: T[] | null,
) => [...(items ?? [])].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

const mapFatwaItem = (
  item: ApiFatwaItem,
  lang: string,
  withHref = false,
): CategoryTopic => ({
  id: item.id,
  title: getLocalizedText(item.title, item._title, lang),
  href: withHref ? buildFatwaHref(item.id) : undefined,
});

const mapCategory = (
  item: ApiFatwaCategory,
  lang: string,
  parentHref?: string,
): CategoryItem => {
  const href = buildNestedFatwaCategoryHref(item.id, parentHref);
  const children = sortByOrder(item.children).map((child) =>
    mapCategory(child, lang, href),
  );

  const topicsSource = item.other_topics?.length
    ? item.other_topics
    : item.fatwas?.length
      ? item.fatwas
      : [];

  const topics = sortByOrder(topicsSource).map((topic) =>
    mapFatwaItem(topic, lang, true),
  );

  return {
    id: item.id,
    title: getLocalizedText(item.name, item._name, lang),
    href,
    children,
    topics,
  };
};

const mapRootCategory = (item: ApiFatwaCategory, lang: string): CategoryItem => ({
  id: item.id,
  title: getLocalizedText(item.name, item._name, lang),
  href: buildFatwaCategoryHref(item.id),
  children: [],
  topics: [],
});

const getFatwaDescription = (
  description: ApiLocalizedText | string | null | undefined,
  fallback: string | undefined,
  lang: string,
) => {
  if (fallback) return fallback;
  if (typeof description === "string") return description;
  if (description && typeof description === "object") {
    return getLocalizedText(description as ApiLocalizedText, undefined, lang);
  }
  return "";
};

export const fatwasApi = createApi({
  reducerPath: "fatwasApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["FatwaCategories", "FatwaCategory", "FatwaContent"],
  endpoints: (builder) => ({
    getFatwaCategories: builder.query<CategoryItem[], { lang: string }>({
      query: ({ lang }) => ({
        url: `${FATWAS_API_BASE}/categories`,
        method: "GET",
        headers: {
          "Accept-Language": lang,
        },
      }),
      transformResponse: (response: unknown, _, arg): CategoryItem[] => {
        const result = response as ApiCategoriesResponse;
        const categories = sortByOrder(result?.data?.categories ?? []);
        return categories.map((item) => mapRootCategory(item, arg.lang));
      },
      providesTags: ["FatwaCategories"],
    }),
    getFatwaCategory: builder.query<CategoryItem | null, { id: string; lang: string }>({
      query: ({ id, lang }) => ({
        url: `${FATWAS_API_BASE}/categories/${id}`,
        method: "GET",
        headers: {
          "Accept-Language": lang,
        },
      }),
      transformResponse: (response: unknown, _, arg): CategoryItem | null => {
        const result = response as ApiCategoryResponse;
        const category = result?.data?.category;
        if (!category) return null;
        return mapCategory(category, arg.lang);
      },
      providesTags: ["FatwaCategory"],
    }),
    getFatwaCategoryItems: builder.query<
      CategoryItem | null,
      { id: string; lang: string }
    >({
      query: ({ id, lang }) => ({
        url: `${FATWAS_API_BASE}/categories/${id}/items`,
        method: "GET",
        headers: {
          "Accept-Language": lang,
        },
      }),
      transformResponse: (response: unknown, _, arg): CategoryItem | null => {
        const result = response as ApiCategoryResponse;
        const category = result?.data?.category;
        if (!category) return null;
        return mapCategory(category, arg.lang);
      },
      providesTags: ["FatwaCategory"],
    }),
    getFatwaContent: builder.query<
      ScholarlyExplanationPageData | null,
      { id: string; lang: string }
    >({
      query: ({ id, lang }) => ({
        url: `${FATWAS_API_BASE}/${id}`,
        method: "GET",
        headers: {
          "Accept-Language": lang,
        },
      }),
      transformResponse: (
        response: unknown,
        _,
        arg,
      ): ScholarlyExplanationPageData | null => {
        const result = response as ApiFatwaResponse;
        const fatwa = result?.data?.fatwa;

        if (!fatwa) return null;

        const content: ScholarlyExplanationContent = {
          id: fatwa.id,
          title: getLocalizedText(fatwa.title, fatwa._title, arg.lang),
          audioUrl: fatwa.audio || undefined,
          downloadUrl: fatwa.audio || undefined,
          description: getFatwaDescription(
            fatwa.description,
            fatwa._description,
            arg.lang,
          ),
          youtubeUrl: fatwa.youtube_url || undefined,
          videoUrl: fatwa.video_url || undefined,
          videoPoster: fatwa.image || undefined,
          views: fatwa.views_count ?? 0,
          previous: fatwa.previous_item
            ? {
                title: getLocalizedText(
                  fatwa.previous_item.title,
                  fatwa.previous_item._title,
                  arg.lang,
                ),
                href: buildFatwaHref(fatwa.previous_item.id),
              }
            : undefined,
          next: fatwa.next_item
            ? {
                title: getLocalizedText(
                  fatwa.next_item.title,
                  fatwa.next_item._title,
                  arg.lang,
                ),
                href: buildFatwaHref(fatwa.next_item.id),
              }
            : undefined,
          attachedFiles: (fatwa.attachments ?? [])
            .map((item) => ({
              id: item.id,
              title: getLocalizedText(item.title, item._title, arg.lang),
              href: item.file || item.url || "",
            }))
            .filter((item) => item.href),
          externalLinks: (fatwa.external_links ?? [])
            .map((item) => ({
              id: item.id,
              title: getLocalizedText(item.title, item._title, arg.lang),
              href: item.url || item.href || "",
            }))
            .filter((item) => item.href),
          series: sortByOrder(fatwa.continue_series ?? []).map((item) => ({
            id: item.id,
            title: getLocalizedText(item.title, item._title, arg.lang),
            href: buildFatwaHref(item.id),
            image: item.image || undefined,
          })),
          relatedTopics: sortByOrder(fatwa.related_topics ?? []).map((item) => ({
            id: item.id,
            title: getLocalizedText(item.title, item._title, arg.lang),
            href: buildFatwaHref(item.id),
            image: item.image || undefined,
          })),
        };

        return {
          content,
          trail: [
            fatwa.main_category
              ? {
                  id: fatwa.main_category.id,
                  title: getLocalizedText(
                    fatwa.main_category.name,
                    fatwa.main_category._name,
                    arg.lang,
                  ),
                }
              : null,
            fatwa.subcategory
              ? {
                  id: fatwa.subcategory.id,
                  title: getLocalizedText(
                    fatwa.subcategory.name,
                    fatwa.subcategory._name,
                    arg.lang,
                  ),
                }
              : null,
            fatwa.sub_subcategory
              ? {
                  id: fatwa.sub_subcategory.id,
                  title: getLocalizedText(
                    fatwa.sub_subcategory.name,
                    fatwa.sub_subcategory._name,
                    arg.lang,
                  ),
                }
              : null,
          ].filter(Boolean) as Array<{ id: string | number; title: string }>,
        };
      },
      providesTags: ["FatwaContent"],
    }),
  }),
});

export const {
  useGetFatwaCategoriesQuery,
  useGetFatwaCategoryQuery,
  useGetFatwaCategoryItemsQuery,
  useGetFatwaContentQuery,
} = fatwasApi;
