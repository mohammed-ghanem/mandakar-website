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
const ARTICLES_API_BASE = `${BASE_URL}/client-api/v1/articles`;

export const buildArticleCategoryHref = (id: string | number) =>
  `/articles/category-${id}`;
export const buildArticleHref = (id: string | number) => `/articles/article-${id}`;
const buildNestedArticleCategoryHref = (
  id: string | number,
  parentHref?: string,
) => (parentHref ? `${parentHref}/category-${id}` : buildArticleCategoryHref(id));

type ApiLocalizedText = {
  ar?: string;
  en?: string;
};

type ApiArticleItem = {
  id: string | number;
  title?: ApiLocalizedText;
  _title?: string;
  image?: string | null;
  sort_order?: number;
};

type ApiArticleCategory = {
  id: string | number;
  name?: ApiLocalizedText;
  _name?: string;
  sort_order?: number;
  has_sections?: boolean;
  has_other_topics?: boolean;
  children?: ApiArticleCategory[];
  articles?: ApiArticleItem[];
  other_topics?: ApiArticleItem[];
};

type ApiCategoriesResponse = {
  data?: {
    categories?: ApiArticleCategory[];
  };
};

type ApiCategoryResponse = {
  data?: {
    category?: ApiArticleCategory;
  };
};

type ApiArticleResponse = {
  data?: {
    article?: {
      id: string | number;
      title?: ApiLocalizedText;
      _title?: string;
      image?: string | null;
      video_url?: string | null;
      youtube_url?: string | null;
      audio?: string | null;
      description?: ApiLocalizedText | string | null | unknown;
      _description?: string;
      views_count?: number;
      attachments?: Array<{
        id: string | number;
        title?: ApiLocalizedText | string;
        _title?: string;
        file?: string | null;
        url?: string | null;
      }>;
      external_links?: Array<{
        id: string | number;
        title?: ApiLocalizedText | string;
        _title?: string;
        url?: string | null;
        href?: string | null;
      }>;
      previous_item?: ApiArticleItem | null;
      next_item?: ApiArticleItem | null;
      continue_series?: ApiArticleItem[];
      related_topics?: ApiArticleItem[];
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

const getMixedText = (
  value: ApiLocalizedText | string | undefined,
  fallback: string | undefined,
  lang: string,
) => {
  if (typeof value === "string") return value || fallback || "";
  return getLocalizedText(value, fallback, lang);
};

const sortByOrder = <T extends { sort_order?: number }>(
  items?: T[] | null,
) => [...(items ?? [])].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

const mapArticleItem = (
  item: ApiArticleItem,
  lang: string,
  withHref = false,
): CategoryTopic => ({
  id: item.id,
  title: getLocalizedText(item.title, item._title, lang),
  href: withHref ? buildArticleHref(item.id) : undefined,
});

const mapCategory = (
  item: ApiArticleCategory,
  lang: string,
  parentHref?: string,
): CategoryItem => {
  const href = buildNestedArticleCategoryHref(item.id, parentHref);
  const children = sortByOrder(item.children).map((child) =>
    mapCategory(child, lang, href),
  );

  const topicsSource = item.other_topics?.length
    ? item.other_topics
    : item.articles?.length
      ? item.articles
      : [];

  const topics = sortByOrder(topicsSource).map((topic) =>
    mapArticleItem(topic, lang, true),
  );

  return {
    id: item.id,
    title: getLocalizedText(item.name, item._name, lang),
    href,
    children,
    topics,
  };
};

const mapRootCategory = (item: ApiArticleCategory, lang: string): CategoryItem => ({
  id: item.id,
  title: getLocalizedText(item.name, item._name, lang),
  href: buildArticleCategoryHref(item.id),
  children: [],
  topics: [],
});

const getArticleDescription = (
  description: ApiLocalizedText | string | null | undefined | unknown,
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

export const articlesApi = createApi({
  reducerPath: "articlesApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["ArticleCategories", "ArticleCategory", "ArticleContent"],
  endpoints: (builder) => ({
    getArticleCategories: builder.query<CategoryItem[], { lang: string }>({
      query: ({ lang }) => ({
        url: `${ARTICLES_API_BASE}/categories`,
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
      providesTags: ["ArticleCategories"],
    }),
    getArticleCategory: builder.query<CategoryItem | null, { id: string; lang: string }>({
      query: ({ id, lang }) => ({
        url: `${ARTICLES_API_BASE}/categories/${id}`,
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
      providesTags: ["ArticleCategory"],
    }),
    getArticleCategoryItems: builder.query<
      CategoryItem | null,
      { id: string; lang: string }
    >({
      query: ({ id, lang }) => ({
        url: `${ARTICLES_API_BASE}/categories/${id}/items`,
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
      providesTags: ["ArticleCategory"],
    }),
    getArticleContent: builder.query<
      ScholarlyExplanationPageData | null,
      { id: string; lang: string }
    >({
      query: ({ id, lang }) => ({
        url: `${ARTICLES_API_BASE}/${id}`,
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
        const result = response as ApiArticleResponse;
        const article = result?.data?.article;

        if (!article) return null;

        const content: ScholarlyExplanationContent = {
          id: article.id,
          title: getLocalizedText(article.title, article._title, arg.lang),
          audioUrl: article.audio || undefined,
          downloadUrl: article.audio || undefined,
          description: getArticleDescription(
            article.description,
            article._description,
            arg.lang,
          ),
          youtubeUrl: article.youtube_url || undefined,
          videoUrl: article.video_url || undefined,
          videoPoster: article.image || undefined,
          views: article.views_count ?? 0,
          previous: article.previous_item
            ? {
                title: getLocalizedText(
                  article.previous_item.title,
                  article.previous_item._title,
                  arg.lang,
                ),
                href: buildArticleHref(article.previous_item.id),
              }
            : undefined,
          next: article.next_item
            ? {
                title: getLocalizedText(
                  article.next_item.title,
                  article.next_item._title,
                  arg.lang,
                ),
                href: buildArticleHref(article.next_item.id),
              }
            : undefined,
          attachedFiles: (article.attachments ?? [])
            .map((item) => ({
              id: item.id,
              title: getMixedText(item.title, item._title, arg.lang),
              href: item.file || item.url || "",
            }))
            .filter((item) => item.href),
          externalLinks: (article.external_links ?? [])
            .map((item) => ({
              id: item.id,
              title: getMixedText(item.title, item._title, arg.lang),
              href: item.url || item.href || "",
            }))
            .filter((item) => item.href),
          series: sortByOrder(article.continue_series ?? []).map((item) => ({
            id: item.id,
            title: getLocalizedText(item.title, item._title, arg.lang),
            href: buildArticleHref(item.id),
            image: item.image || undefined,
          })),
          relatedTopics: sortByOrder(article.related_topics ?? []).map((item) => ({
            id: item.id,
            title: getLocalizedText(item.title, item._title, arg.lang),
            href: buildArticleHref(item.id),
            image: item.image || undefined,
          })),
        };

        return {
          content,
          trail: [
            article.main_category
              ? {
                  id: article.main_category.id,
                  title: getLocalizedText(
                    article.main_category.name,
                    article.main_category._name,
                    arg.lang,
                  ),
                }
              : null,
            article.subcategory
              ? {
                  id: article.subcategory.id,
                  title: getLocalizedText(
                    article.subcategory.name,
                    article.subcategory._name,
                    arg.lang,
                  ),
                }
              : null,
            article.sub_subcategory
              ? {
                  id: article.sub_subcategory.id,
                  title: getLocalizedText(
                    article.sub_subcategory.name,
                    article.sub_subcategory._name,
                    arg.lang,
                  ),
                }
              : null,
          ].filter(Boolean) as Array<{ id: string | number; title: string }>,
        };
      },
      providesTags: ["ArticleContent"],
    }),
  }),
});

export const {
  useGetArticleCategoriesQuery,
  useGetArticleCategoryQuery,
  useGetArticleCategoryItemsQuery,
  useGetArticleContentQuery,
} = articlesApi;
