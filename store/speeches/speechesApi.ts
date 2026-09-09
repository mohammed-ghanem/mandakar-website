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
const SPEECHES_API_BASE = `${BASE_URL}/client-api/v1/speeches`;

export const buildKhutbaCategoryHref = (id: string | number) =>
  `/khutbas/category-${id}`;
export const buildKhutbaHref = (id: string | number) => `/khutbas/speech-${id}`;
const buildNestedKhutbaCategoryHref = (
  id: string | number,
  parentHref?: string,
) => (parentHref ? `${parentHref}/category-${id}` : buildKhutbaCategoryHref(id));

type ApiLocalizedName = {
  ar?: string;
  en?: string;
};

type ApiLocalizedTitle = {
  ar?: string;
  en?: string;
};

type ApiSpeechItem = {
  id: string | number;
  title?: ApiLocalizedTitle;
  _title?: string;
  image?: string | null;
  sort_order?: number;
};

type ApiSpeechCategory = {
  id: string | number;
  name?: ApiLocalizedName;
  _name?: string;
  sort_order?: number;
  has_sections?: boolean;
  has_other_topics?: boolean;
  children?: ApiSpeechCategory[];
  speeches?: ApiSpeechItem[];
  other_topics?: ApiSpeechItem[];
};

type ApiCategoriesResponse = {
  data?: {
    categories?: ApiSpeechCategory[];
  };
};

type ApiCategoryResponse = {
  data?: {
    category?: ApiSpeechCategory;
  };
};

type ApiSpeechResponse = {
  data?: {
    speech?: {
      id: string | number;
      title?: ApiLocalizedTitle;
      _title?: string;
      image?: string | null;
      video_url?: string | null;
      youtube_url?: string | null;
      audio?: string | null;
      description?: unknown;
      _description?: string;
      views_count?: number;
      attachments?: Array<{
        id: string | number;
        title?: ApiLocalizedTitle;
        _title?: string;
        file?: string | null;
        url?: string | null;
      }>;
      external_links?: Array<{
        id: string | number;
        title?: ApiLocalizedTitle;
        _title?: string;
        url?: string | null;
        href?: string | null;
      }>;
      previous_item?: ApiSpeechItem | null;
      next_item?: ApiSpeechItem | null;
      continue_series?: ApiSpeechItem[];
      related_topics?: ApiSpeechItem[];
      main_category?: {
        id: string | number;
        name?: ApiLocalizedName;
        _name?: string;
      } | null;
      subcategory?: {
        id: string | number;
        name?: ApiLocalizedName;
        _name?: string;
      } | null;
      sub_subcategory?: {
        id: string | number;
        name?: ApiLocalizedName;
        _name?: string;
      } | null;
    };
  };
};

const getLocalizedText = (
  localized: ApiLocalizedName | ApiLocalizedTitle | undefined,
  fallback: string | undefined,
  lang: string,
) => localized?.[lang as keyof ApiLocalizedName] || fallback || "";

const sortByOrder = <T extends { sort_order?: number }>(items: T[] = []) =>
  [...items].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

const mapSpeechItem = (
  item: ApiSpeechItem,
  lang: string,
  withHref = false,
): CategoryTopic => ({
  id: item.id,
  title: getLocalizedText(item.title, item._title, lang),
  href: withHref ? buildKhutbaHref(item.id) : undefined,
});

const mapCategory = (
  item: ApiSpeechCategory,
  lang: string,
  parentHref?: string,
): CategoryItem => {
  const href = buildNestedKhutbaCategoryHref(item.id, parentHref);
  const children = sortByOrder(item.children).map((child) =>
    mapCategory(child, lang, href),
  );

  const topicsSource =
    item.has_other_topics && item.other_topics?.length
      ? item.other_topics
      : item.speeches;

  const topics = sortByOrder(topicsSource).map((topic) =>
    mapSpeechItem(topic, lang, true),
  );

  return {
    id: item.id,
    title: getLocalizedText(item.name, item._name, lang),
    href,
    children,
    topics,
  };
};

const mapRootCategory = (item: ApiSpeechCategory, lang: string): CategoryItem => ({
  id: item.id,
  title: getLocalizedText(item.name, item._name, lang),
  href: buildKhutbaCategoryHref(item.id),
  children: [],
  topics: [],
});

export const speechesApi = createApi({
  reducerPath: "speechesApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["SpeechCategories", "SpeechCategory", "SpeechContent"],
  endpoints: (builder) => ({
    getSpeechCategories: builder.query<CategoryItem[], { lang: string }>({
      query: ({ lang }) => ({
        url: `${SPEECHES_API_BASE}/categories`,
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
      providesTags: ["SpeechCategories"],
    }),
    getSpeechCategory: builder.query<CategoryItem | null, { id: string; lang: string }>({
      query: ({ id, lang }) => ({
        url: `${SPEECHES_API_BASE}/categories/${id}`,
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
      providesTags: ["SpeechCategory"],
    }),
    getSpeechContent: builder.query<
      ScholarlyExplanationPageData | null,
      { id: string; lang: string }
    >({
      query: ({ id, lang }) => ({
        url: `${SPEECHES_API_BASE}/${id}`,
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
        const result = response as ApiSpeechResponse;
        const speech = result?.data?.speech;

        if (!speech) return null;

        const description =
          speech._description ||
          (typeof speech.description === "string" ? speech.description : "");

        const content: ScholarlyExplanationContent = {
          id: speech.id,
          title: getLocalizedText(speech.title, speech._title, arg.lang),
          audioUrl: speech.audio || undefined,
          downloadUrl: speech.audio || undefined,
          description,
          youtubeUrl: speech.youtube_url || undefined,
          videoUrl: speech.video_url || undefined,
          videoPoster: speech.image || undefined,
          views: speech.views_count ?? 0,
          previous: speech.previous_item
            ? {
                title: getLocalizedText(
                  speech.previous_item.title,
                  speech.previous_item._title,
                  arg.lang,
                ),
                href: buildKhutbaHref(speech.previous_item.id),
              }
            : undefined,
          next: speech.next_item
            ? {
                title: getLocalizedText(
                  speech.next_item.title,
                  speech.next_item._title,
                  arg.lang,
                ),
                href: buildKhutbaHref(speech.next_item.id),
              }
            : undefined,
          attachedFiles: (speech.attachments ?? [])
            .map((item) => ({
              id: item.id,
              title: getLocalizedText(item.title, item._title, arg.lang),
              href: item.file || item.url || "",
            }))
            .filter((item) => item.href),
          externalLinks: (speech.external_links ?? [])
            .map((item) => ({
              id: item.id,
              title: getLocalizedText(item.title, item._title, arg.lang),
              href: item.url || item.href || "",
            }))
            .filter((item) => item.href),
          series: sortByOrder(speech.continue_series ?? []).map((item) => ({
            id: item.id,
            title: getLocalizedText(item.title, item._title, arg.lang),
            href: buildKhutbaHref(item.id),
            image: item.image || undefined,
          })),
          relatedTopics: sortByOrder(speech.related_topics ?? []).map((item) => ({
            id: item.id,
            title: getLocalizedText(item.title, item._title, arg.lang),
            href: buildKhutbaHref(item.id),
            image: item.image || undefined,
          })),
        };

        return {
          content,
          trail: [
            speech.main_category
              ? {
                  id: speech.main_category.id,
                  title: getLocalizedText(
                    speech.main_category.name,
                    speech.main_category._name,
                    arg.lang,
                  ),
                }
              : null,
            speech.subcategory
              ? {
                  id: speech.subcategory.id,
                  title: getLocalizedText(
                    speech.subcategory.name,
                    speech.subcategory._name,
                    arg.lang,
                  ),
                }
              : null,
            speech.sub_subcategory
              ? {
                  id: speech.sub_subcategory.id,
                  title: getLocalizedText(
                    speech.sub_subcategory.name,
                    speech.sub_subcategory._name,
                    arg.lang,
                  ),
                }
              : null,
          ].filter(Boolean) as Array<{ id: string | number; title: string }>,
        };
      },
      providesTags: ["SpeechContent"],
    }),
  }),
});

export const {
  useGetSpeechCategoriesQuery,
  useGetSpeechCategoryQuery,
  useGetSpeechContentQuery,
} = speechesApi;
