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
const LECTURES_API_BASE = `${BASE_URL}/client-api/v1/lectures`;

export const buildLectureCategoryHref = (id: string | number) =>
  `/lectures/category-${id}`;
export const buildLectureHref = (id: string | number) => `/lectures/lecture-${id}`;
const buildNestedLectureCategoryHref = (
  id: string | number,
  parentHref?: string,
) => (parentHref ? `${parentHref}/category-${id}` : buildLectureCategoryHref(id));

type ApiLocalizedName = {
  ar?: string;
  en?: string;
};

type ApiLocalizedTitle = {
  ar?: string;
  en?: string;
};

type ApiLectureItem = {
  id: string | number;
  title?: ApiLocalizedTitle;
  _title?: string;
  image?: string | null;
  sort_order?: number;
};

type ApiLectureCategory = {
  id: string | number;
  name?: ApiLocalizedName;
  _name?: string;
  sort_order?: number;
  view_type?: "sections" | "lectures";
  has_sections?: boolean;
  has_other_topics?: boolean;
  children?: ApiLectureCategory[];
  lectures?: ApiLectureItem[];
  other_topics?: ApiLectureItem[];
};

type ApiCategoriesResponse = {
  data?: {
    categories?: ApiLectureCategory[];
  };
};

type ApiCategoryResponse = {
  data?: {
    category?: ApiLectureCategory;
  };
};

type ApiLectureResponse = {
  data?: {
    lecture?: {
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
        title?: ApiLocalizedTitle | string;
        _title?: string;
        file?: string | null;
        url?: string | null;
      }>;
      external_links?: Array<{
        id: string | number;
        title?: ApiLocalizedTitle | string;
        _title?: string;
        url?: string | null;
        href?: string | null;
      }>;
      previous_item?: ApiLectureItem | null;
      next_item?: ApiLectureItem | null;
      continue_series?: ApiLectureItem[];
      related_topics?: ApiLectureItem[];
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

const getMixedText = (
  value: ApiLocalizedTitle | string | undefined,
  fallback: string | undefined,
  lang: string,
) => {
  if (typeof value === "string") return value || fallback || "";
  return getLocalizedText(value, fallback, lang);
};

const sortByOrder = <T extends { sort_order?: number }>(
  items?: T[] | null,
) => [...(items ?? [])].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

const mapLectureItem = (
  item: ApiLectureItem,
  lang: string,
  withHref = false,
): CategoryTopic => ({
  id: item.id,
  title: getLocalizedText(item.title, item._title, lang),
  href: withHref ? buildLectureHref(item.id) : undefined,
});

const pickCategoryTopics = (item: ApiLectureCategory) => {
  if (item.other_topics?.length) return item.other_topics;
  if (item.lectures?.length) return item.lectures;
  return [];
};

const mapCategory = (
  item: ApiLectureCategory,
  lang: string,
  parentHref?: string,
): CategoryItem => {
  const href = buildNestedLectureCategoryHref(item.id, parentHref);
  const children = sortByOrder(item.children).map((child) =>
    mapCategory(child, lang, href),
  );

  const topics = sortByOrder(pickCategoryTopics(item)).map((topic) =>
    mapLectureItem(topic, lang, true),
  );

  return {
    id: item.id,
    title: getLocalizedText(item.name, item._name, lang),
    href,
    children,
    topics,
  };
};

const mapRootCategory = (item: ApiLectureCategory, lang: string): CategoryItem => ({
  id: item.id,
  title: getLocalizedText(item.name, item._name, lang),
  href: buildLectureCategoryHref(item.id),
  children: [],
  topics: [],
});

export const lecturesApi = createApi({
  reducerPath: "lecturesApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["LectureCategories", "LectureCategory", "LectureContent"],
  endpoints: (builder) => ({
    getLectureCategories: builder.query<CategoryItem[], { lang: string }>({
      query: ({ lang }) => ({
        url: `${LECTURES_API_BASE}/categories`,
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
      providesTags: ["LectureCategories"],
    }),
    getLectureCategory: builder.query<CategoryItem | null, { id: string; lang: string }>({
      query: ({ id, lang }) => ({
        url: `${LECTURES_API_BASE}/categories/${id}`,
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
      providesTags: ["LectureCategory"],
    }),
    /** Leaf / content categories: GET .../categories/:id/items */
    getLectureCategoryItems: builder.query<
      CategoryItem | null,
      { id: string; lang: string }
    >({
      query: ({ id, lang }) => ({
        url: `${LECTURES_API_BASE}/categories/${id}/items`,
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
      providesTags: ["LectureCategory"],
    }),
    getLectureContent: builder.query<
      ScholarlyExplanationPageData | null,
      { id: string; lang: string }
    >({
      query: ({ id, lang }) => ({
        url: `${LECTURES_API_BASE}/${id}`,
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
        const result = response as ApiLectureResponse;
        const lecture = result?.data?.lecture;

        if (!lecture) return null;

        const description =
          lecture._description ||
          (typeof lecture.description === "string" ? lecture.description : "");

        const content: ScholarlyExplanationContent = {
          id: lecture.id,
          title: getLocalizedText(lecture.title, lecture._title, arg.lang),
          audioUrl: lecture.audio || undefined,
          downloadUrl: lecture.audio || undefined,
          description,
          youtubeUrl: lecture.youtube_url || undefined,
          videoUrl: lecture.video_url || undefined,
          videoPoster: lecture.image || undefined,
          views: lecture.views_count ?? 0,
          previous: lecture.previous_item
            ? {
                title: getLocalizedText(
                  lecture.previous_item.title,
                  lecture.previous_item._title,
                  arg.lang,
                ),
                href: buildLectureHref(lecture.previous_item.id),
              }
            : undefined,
          next: lecture.next_item
            ? {
                title: getLocalizedText(
                  lecture.next_item.title,
                  lecture.next_item._title,
                  arg.lang,
                ),
                href: buildLectureHref(lecture.next_item.id),
              }
            : undefined,
          attachedFiles: (lecture.attachments ?? [])
            .map((item) => ({
              id: item.id,
              title: getMixedText(item.title, item._title, arg.lang),
              href: item.file || item.url || "",
            }))
            .filter((item) => item.href),
          externalLinks: (lecture.external_links ?? [])
            .map((item) => ({
              id: item.id,
              title: getMixedText(item.title, item._title, arg.lang),
              href: item.url || item.href || "",
            }))
            .filter((item) => item.href),
          series: sortByOrder(lecture.continue_series ?? []).map((item) => ({
            id: item.id,
            title: getLocalizedText(item.title, item._title, arg.lang),
            href: buildLectureHref(item.id),
            image: item.image || undefined,
          })),
          relatedTopics: sortByOrder(lecture.related_topics ?? []).map((item) => ({
            id: item.id,
            title: getLocalizedText(item.title, item._title, arg.lang),
            href: buildLectureHref(item.id),
            image: item.image || undefined,
          })),
        };

        return {
          content,
          trail: [
            lecture.main_category
              ? {
                  id: lecture.main_category.id,
                  title: getLocalizedText(
                    lecture.main_category.name,
                    lecture.main_category._name,
                    arg.lang,
                  ),
                }
              : null,
            lecture.subcategory
              ? {
                  id: lecture.subcategory.id,
                  title: getLocalizedText(
                    lecture.subcategory.name,
                    lecture.subcategory._name,
                    arg.lang,
                  ),
                }
              : null,
            lecture.sub_subcategory
              ? {
                  id: lecture.sub_subcategory.id,
                  title: getLocalizedText(
                    lecture.sub_subcategory.name,
                    lecture.sub_subcategory._name,
                    arg.lang,
                  ),
                }
              : null,
          ].filter(Boolean) as Array<{ id: string | number; title: string }>,
        };
      },
      providesTags: ["LectureContent"],
    }),
  }),
});

export const {
  useGetLectureCategoriesQuery,
  useGetLectureCategoryQuery,
  useGetLectureCategoryItemsQuery,
  useGetLectureContentQuery,
} = lecturesApi;
