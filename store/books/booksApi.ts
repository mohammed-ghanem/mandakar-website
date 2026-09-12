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
const BOOKS_API_BASE = `${BASE_URL}/client-api/v1/books`;

export const buildBookCategoryHref = (id: string | number) => `/books/category-${id}`;
export const buildBookHref = (id: string | number) => `/books/book-${id}`;
const buildNestedBookCategoryHref = (
  id: string | number,
  parentHref?: string,
) => (parentHref ? `${parentHref}/category-${id}` : buildBookCategoryHref(id));

type ApiLocalizedText = {
  ar?: string;
  en?: string;
};

type ApiBookItem = {
  id: string | number;
  title?: ApiLocalizedText;
  _title?: string;
  image?: string | null;
  sort_order?: number;
};

type ApiBookCategory = {
  id: string | number;
  name?: ApiLocalizedText;
  _name?: string;
  sort_order?: number;
  has_sections?: boolean;
  has_other_topics?: boolean;
  children?: ApiBookCategory[];
  books?: ApiBookItem[];
  other_topics?: ApiBookItem[];
};

type ApiCategoriesResponse = {
  data?: {
    categories?: ApiBookCategory[];
  };
};

type ApiCategoryResponse = {
  data?: {
    category?: ApiBookCategory;
  };
};

type ApiBookResponse = {
  data?: {
    book?: {
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
      previous_item?: ApiBookItem | null;
      next_item?: ApiBookItem | null;
      continue_series?: ApiBookItem[];
      related_topics?: ApiBookItem[];
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

const mapBookItem = (
  item: ApiBookItem,
  lang: string,
  withHref = false,
): CategoryTopic => ({
  id: item.id,
  title: getLocalizedText(item.title, item._title, lang),
  href: withHref ? buildBookHref(item.id) : undefined,
});

const mapCategory = (
  item: ApiBookCategory,
  lang: string,
  parentHref?: string,
): CategoryItem => {
  const href = buildNestedBookCategoryHref(item.id, parentHref);
  const children = sortByOrder(item.children).map((child) =>
    mapCategory(child, lang, href),
  );

  const topicsSource = item.other_topics?.length
    ? item.other_topics
    : item.books?.length
      ? item.books
      : [];

  const topics = sortByOrder(topicsSource).map((topic) =>
    mapBookItem(topic, lang, true),
  );

  return {
    id: item.id,
    title: getLocalizedText(item.name, item._name, lang),
    href,
    children,
    topics,
  };
};

const mapRootCategory = (item: ApiBookCategory, lang: string): CategoryItem => ({
  id: item.id,
  title: getLocalizedText(item.name, item._name, lang),
  href: buildBookCategoryHref(item.id),
  children: [],
  topics: [],
});

const getBookDescription = (
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

export const booksApi = createApi({
  reducerPath: "booksApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["BookCategories", "BookCategory", "BookContent"],
  endpoints: (builder) => ({
    getBookCategories: builder.query<CategoryItem[], { lang: string }>({
      query: ({ lang }) => ({
        url: `${BOOKS_API_BASE}/categories`,
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
      providesTags: ["BookCategories"],
    }),
    getBookCategory: builder.query<CategoryItem | null, { id: string; lang: string }>({
      query: ({ id, lang }) => ({
        url: `${BOOKS_API_BASE}/categories/${id}`,
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
      providesTags: ["BookCategory"],
    }),
    getBookCategoryItems: builder.query<
      CategoryItem | null,
      { id: string; lang: string }
    >({
      query: ({ id, lang }) => ({
        url: `${BOOKS_API_BASE}/categories/${id}/items`,
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
      providesTags: ["BookCategory"],
    }),
    getBookContent: builder.query<
      ScholarlyExplanationPageData | null,
      { id: string; lang: string }
    >({
      query: ({ id, lang }) => ({
        url: `${BOOKS_API_BASE}/${id}`,
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
        const result = response as ApiBookResponse;
        const book = result?.data?.book;

        if (!book) return null;

        const content: ScholarlyExplanationContent = {
          id: book.id,
          title: getLocalizedText(book.title, book._title, arg.lang),
          audioUrl: book.audio || undefined,
          downloadUrl: book.audio || undefined,
          description: getBookDescription(book.description, book._description, arg.lang),
          image: book.image || undefined,
          youtubeUrl: book.youtube_url || undefined,
          videoUrl: book.video_url || undefined,
          views: book.views_count ?? 0,
          previous: book.previous_item
            ? {
                title: getLocalizedText(
                  book.previous_item.title,
                  book.previous_item._title,
                  arg.lang,
                ),
                href: buildBookHref(book.previous_item.id),
              }
            : undefined,
          next: book.next_item
            ? {
                title: getLocalizedText(
                  book.next_item.title,
                  book.next_item._title,
                  arg.lang,
                ),
                href: buildBookHref(book.next_item.id),
              }
            : undefined,
          attachedFiles: (book.attachments ?? [])
            .map((item) => ({
              id: item.id,
              title: getMixedText(item.title, item._title, arg.lang),
              href: item.file || item.url || "",
            }))
            .filter((item) => item.href),
          externalLinks: (book.external_links ?? [])
            .map((item) => ({
              id: item.id,
              title: getMixedText(item.title, item._title, arg.lang),
              href: item.url || item.href || "",
            }))
            .filter((item) => item.href),
          series: sortByOrder(book.continue_series ?? []).map((item) => ({
            id: item.id,
            title: getLocalizedText(item.title, item._title, arg.lang),
            href: buildBookHref(item.id),
            image: item.image || undefined,
          })),
          relatedTopics: sortByOrder(book.related_topics ?? []).map((item) => ({
            id: item.id,
            title: getLocalizedText(item.title, item._title, arg.lang),
            href: buildBookHref(item.id),
            image: item.image || undefined,
          })),
        };

        return {
          content,
          trail: [
            book.main_category
              ? {
                  id: book.main_category.id,
                  title: getLocalizedText(
                    book.main_category.name,
                    book.main_category._name,
                    arg.lang,
                  ),
                }
              : null,
            book.subcategory
              ? {
                  id: book.subcategory.id,
                  title: getLocalizedText(
                    book.subcategory.name,
                    book.subcategory._name,
                    arg.lang,
                  ),
                }
              : null,
            book.sub_subcategory
              ? {
                  id: book.sub_subcategory.id,
                  title: getLocalizedText(
                    book.sub_subcategory.name,
                    book.sub_subcategory._name,
                    arg.lang,
                  ),
                }
              : null,
          ].filter(Boolean) as Array<{ id: string | number; title: string }>,
        };
      },
      providesTags: ["BookContent"],
    }),
  }),
});

export const {
  useGetBookCategoriesQuery,
  useGetBookCategoryQuery,
  useGetBookCategoryItemsQuery,
  useGetBookContentQuery,
} = booksApi;
