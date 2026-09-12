import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/store/base/axiosBaseQuery";
import type {
  CategoryItem,
  CategoryTopic,
} from "@/components/categorySections/types";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const SCHOLARLY_API_BASE = `${BASE_URL}/client-api/v1/explanations`;

export const buildCategoryHref = (id: string | number) =>
  `/scholarly/category-${id}`;
export const buildExplanationHref = (id: string | number) =>
  `/scholarly/explanation-${id}`;
const buildNestedCategoryHref = (
  id: string | number,
  parentHref?: string,
) => (parentHref ? `${parentHref}/category-${id}` : buildCategoryHref(id));

type ApiLocalizedName = {
  ar?: string;
  en?: string;
};

type ApiLocalizedTitle = {
  ar?: string;
  en?: string;
};

type ApiExplanation = {
  id: string | number;
  title?: ApiLocalizedTitle;
  _title?: string;
  image?: string | null;
  sort_order?: number;
};

type ApiScholarlyCategory = {
  id: string | number;
  name?: ApiLocalizedName;
  _name?: string;
  name_?: string;
  sort_order?: number;
  has_sections?: boolean;
  has_other_topics?: boolean;
  explanations?: ApiExplanation[];
  other_topics?: ApiExplanation[];
  children?: ApiScholarlyCategory[];
};

type ApiCategoriesResponse = {
  data?: {
    categories?: ApiScholarlyCategory[];
  };
};

type ApiCategoryResponse = {
  data?: {
    category?: ApiScholarlyCategory;
  };
};

type ApiExplanationContentResponse = {
  data?: {
    explanation?: {
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
      previous_item?: ApiExplanation | null;
      next_item?: ApiExplanation | null;
      continue_series?: ApiExplanation[];
      related_topics?: ApiExplanation[];
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

export type ScholarlyExplanationContent = {
  id: string | number;
  title: string;
  image?: string;
  audioUrl?: string;
  downloadUrl?: string;
  description?: string;
  youtubeUrl?: string;
  videoUrl?: string;
  videoPoster?: string;
  views: number;
  previous?: { title: string; href: string };
  next?: { title: string; href: string };
  attachedFiles: Array<{ id: string | number; title: string; href: string }>;
  externalLinks: Array<{ id: string | number; title: string; href: string }>;
  series: Array<{
    id: string | number;
    title: string;
    href: string;
    image?: string;
  }>;
  relatedTopics: Array<{
    id: string | number;
    title: string;
    href: string;
    image?: string;
  }>;
};

export type ScholarlyExplanationPageData = {
  content: ScholarlyExplanationContent;
  trail: Array<{ id: string | number; title: string }>;
};

const getLocalizedText = (
  localized: ApiLocalizedName | ApiLocalizedTitle | undefined,
  fallback: string | undefined,
  lang: string,
) => localized?.[lang as keyof ApiLocalizedName] || fallback || "";

const sortByOrder = <T extends { sort_order?: number }>(
  items?: T[] | null,
) => [...(items ?? [])].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

const mapExplanation = (
  item: ApiExplanation,
  lang: string,
  withHref = false,
): CategoryTopic => ({
  id: item.id,
  title: getLocalizedText(item.title, item._title, lang),
  href: withHref ? buildExplanationHref(item.id) : undefined,
});

const mapCategory = (
  item: ApiScholarlyCategory,
  lang: string,
  parentHref?: string,
): CategoryItem => {
  const href = buildNestedCategoryHref(item.id, parentHref);
  const children = sortByOrder(item.children).map((child) =>
    mapCategory(child, lang, href),
  );

  const topicsSource = item.other_topics?.length
    ? item.other_topics
    : item.explanations?.length
      ? item.explanations
      : [];

  const topics = sortByOrder(topicsSource).map((topic) =>
    mapExplanation(topic, lang, true),
  );

  return {
    id: item.id,
    title: getLocalizedText(item.name, item._name || item.name_, lang),
    href,
    children,
    topics,
  };
};

export const scholarlyApi = createApi({
  reducerPath: "scholarlyApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["ScholarlyCategories", "ScholarlyCategory", "ScholarlyExplanation"],
  endpoints: (builder) => ({
    getScholarlyCategories: builder.query<CategoryItem[], { lang: string }>({
      query: ({ lang }) => ({
        url: `${SCHOLARLY_API_BASE}/categories`,
        method: "GET",
        headers: {
          "Accept-Language": lang,
        },
      }),
      transformResponse: (response: unknown, _, arg): CategoryItem[] => {
        const result = response as ApiCategoriesResponse;
        const categories = sortByOrder(result?.data?.categories ?? []);
        return categories.map((item) => mapCategory(item, arg.lang));
      },
      providesTags: ["ScholarlyCategories"],
    }),
    getScholarlyCategory: builder.query<
      CategoryItem | null,
      { id: string; lang: string }
    >({
      query: ({ id, lang }) => ({
        url: `${SCHOLARLY_API_BASE}/categories/${id}`,
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
      providesTags: ["ScholarlyCategory"],
    }),
    getScholarlyCategoryItems: builder.query<
      CategoryItem | null,
      { id: string; lang: string }
    >({
      query: ({ id, lang }) => ({
        url: `${SCHOLARLY_API_BASE}/categories/${id}/items`,
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
      providesTags: ["ScholarlyCategory"],
    }),
    getScholarlyExplanation: builder.query<
      ScholarlyExplanationPageData | null,
      { id: string; lang: string }
    >({
      query: ({ id, lang }) => ({
        url: `${SCHOLARLY_API_BASE}/${id}`,
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
        const result = response as ApiExplanationContentResponse;
        const explanation = result?.data?.explanation;

        if (!explanation) return null;

        const description =
          explanation._description ||
          (typeof explanation.description === "string"
            ? explanation.description
            : "");

        return {
          content: {
            id: explanation.id,
            title: getLocalizedText(
              explanation.title,
              explanation._title,
              arg.lang,
            ),
            audioUrl: explanation.audio || undefined,
            downloadUrl: explanation.audio || undefined,
            description,
            image: explanation.image || undefined,
            youtubeUrl: explanation.youtube_url || undefined,
            videoUrl: explanation.video_url || undefined,
            views: explanation.views_count ?? 0,
            previous: explanation.previous_item
              ? {
                  title: getLocalizedText(
                    explanation.previous_item.title,
                    explanation.previous_item._title,
                    arg.lang,
                  ),
                  href: buildExplanationHref(explanation.previous_item.id),
                }
              : undefined,
            next: explanation.next_item
              ? {
                  title: getLocalizedText(
                    explanation.next_item.title,
                    explanation.next_item._title,
                    arg.lang,
                  ),
                  href: buildExplanationHref(explanation.next_item.id),
                }
              : undefined,
            attachedFiles: (explanation.attachments ?? [])
              .map((item) => ({
                id: item.id,
                title: getLocalizedText(item.title, item._title, arg.lang),
                href: item.file || item.url || "",
              }))
              .filter((item) => item.href),
            externalLinks: (explanation.external_links ?? [])
              .map((item) => ({
                id: item.id,
                title: getLocalizedText(item.title, item._title, arg.lang),
                href: item.url || item.href || "",
              }))
              .filter((item) => item.href),
            series: sortByOrder(explanation.continue_series ?? []).map(
              (item) => ({
                id: item.id,
                title: getLocalizedText(item.title, item._title, arg.lang),
                href: buildExplanationHref(item.id),
                image: item.image || undefined,
              }),
            ),
            relatedTopics: sortByOrder(explanation.related_topics ?? []).map(
              (item) => ({
                id: item.id,
                title: getLocalizedText(item.title, item._title, arg.lang),
                href: buildExplanationHref(item.id),
                image: item.image || undefined,
              }),
            ),
          },
          trail: [
            explanation.main_category
              ? {
                  id: explanation.main_category.id,
                  title: getLocalizedText(
                    explanation.main_category.name,
                    explanation.main_category._name,
                    arg.lang,
                  ),
                }
              : null,
            explanation.subcategory
              ? {
                  id: explanation.subcategory.id,
                  title: getLocalizedText(
                    explanation.subcategory.name,
                    explanation.subcategory._name,
                    arg.lang,
                  ),
                }
              : null,
            explanation.sub_subcategory
              ? {
                  id: explanation.sub_subcategory.id,
                  title: getLocalizedText(
                    explanation.sub_subcategory.name,
                    explanation.sub_subcategory._name,
                    arg.lang,
                  ),
                }
              : null,
          ].filter(Boolean) as Array<{ id: string | number; title: string }>,
        };
      },
      providesTags: ["ScholarlyExplanation"],
    }),
  }),
});

export const {
  useGetScholarlyCategoriesQuery,
  useGetScholarlyCategoryQuery,
  useGetScholarlyCategoryItemsQuery,
  useGetScholarlyExplanationQuery,
} = scholarlyApi;
