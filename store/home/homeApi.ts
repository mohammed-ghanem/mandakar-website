import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/store/base/axiosBaseQuery";
import type { ReuseBoxItem } from "@/components/reusebox/types";
import { buildExplanationHref, buildCategoryHref } from "@/store/scholarly/scholarlyApi";
import {
  buildLectureHref,
  buildLectureCategoryHref,
} from "@/store/lectures/lecturesApi";
import {
  buildKhutbaHref,
  buildKhutbaCategoryHref,
} from "@/store/speeches/speechesApi";
import {
  buildFatwaHref,
  buildFatwaCategoryHref,
} from "@/store/fatwas/fatwasApi";
import {
  buildArticleHref,
  buildArticleCategoryHref,
} from "@/store/articles/articlesApi";
import {
  buildBookHref,
  buildBookCategoryHref,
} from "@/store/books/booksApi";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const HOME_API_BASE = `${BASE_URL}/client-api/v1/home`;

type ApiLocalizedText = {
  ar?: string;
  en?: string;
};

type ApiBanner = {
  id: string | number;
  title?: ApiLocalizedText | string;
  _title?: string;
  description?: ApiLocalizedText | string;
  _description?: string;
  category?: string;
  _category?: string;
  url?: string | null;
  image?: string | null;
  sort_order?: number;
};

type ApiBannersResponse = {
  data?: {
    banners?: ApiBanner[];
  };
};

type ApiLatestItem = {
  id: string | number;
  content_type?: string;
  rank?: number;
  media_kind?: string;
  category_id?: string | number;
  category?: {
    id?: string | number;
    name?: ApiLocalizedText;
    _name?: string;
  } | null;
  title?: ApiLocalizedText | string;
  _title?: string;
  image?: string | null;
  audio?: string | null;
  pdf?: string | null;
  youtube_url?: string | null;
  has_audio?: boolean;
  has_video?: boolean;
  views_count?: number;
  created_at?: string;
};

type ApiLatestPublishedResponse = {
  data?: {
    explanations?: ApiLatestItem[];
    lectures?: ApiLatestItem[];
    speeches?: ApiLatestItem[];
    fatwas?: ApiLatestItem[];
    articles?: ApiLatestItem[];
    books?: ApiLatestItem[];
  };
};

type ApiMostViewedResponse = {
  data?: {
    audio_visual?: ApiLatestItem[];
    articles?: ApiLatestItem[];
    books?: ApiLatestItem[];
  };
};

export type HomeBanner = {
  id: string | number;
  title: string;
  description: string;
  category: string;
  categoryLabel: string;
  href: string;
  image: string;
  sortOrder: number;
};

export type HomeLatestPublished = {
  explanations: ReuseBoxItem[];
  lectures: ReuseBoxItem[];
  speeches: ReuseBoxItem[];
  fatwas: ReuseBoxItem[];
  articles: ReuseBoxItem[];
  books: ReuseBoxItem[];
};

export type HomeMostViewed = {
  audioVisual: ReuseBoxItem[];
  articles: ReuseBoxItem[];
  books: ReuseBoxItem[];
};

type ApiStatisticsResponse = {
  data?: {
    statistics?: {
      explanations?: number;
      lectures?: number;
      speeches?: number;
      fatwas?: number;
      articles?: number;
      books?: number;
      total_attachments?: number;
      total_visits?: number;
    };
  };
};

export type HomeStatistics = {
  scholarly: number;
  lectures: number;
  khutbas: number;
  fatwas: number;
  articles: number;
  books: number;
  attachments: number;
  visits: number;
};

type ApiSearchResponse = {
  data?: {
    query?: string;
    total?: number;
    results?: {
      explanations?: ApiLatestItem[];
      lectures?: ApiLatestItem[];
      speeches?: ApiLatestItem[];
      fatwas?: ApiLatestItem[];
      articles?: ApiLatestItem[];
      books?: ApiLatestItem[];
    };
  };
};

export type HomeSearchResults = {
  query: string;
  total: number;
  explanations: ReuseBoxItem[];
  lectures: ReuseBoxItem[];
  speeches: ReuseBoxItem[];
  fatwas: ReuseBoxItem[];
  articles: ReuseBoxItem[];
  books: ReuseBoxItem[];
};

const getLocalizedText = (
  value: ApiLocalizedText | string | undefined,
  fallback: string | undefined,
  lang: string,
) => {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (value && typeof value === "object") {
    const text = value[lang as keyof ApiLocalizedText] || value.ar || value.en;
    if (text?.trim()) return text.trim();
  }
  return fallback?.trim() || "";
};

const toLocalizedHref = (url: string | null | undefined, lang: string) => {
  if (!url) return `/${lang}`;

  try {
    const parsed = new URL(url, "https://mandakar.net");
    const path = parsed.pathname || "/";
    return `/${lang}${path === "/" ? "" : path}`;
  } catch {
    const path = url.startsWith("/") ? url : `/${url}`;
    return `/${lang}${path}`;
  }
};

const withLang = (lang: string, path: string) => {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `/${lang}${normalized}`;
};

const sortByOrder = <T extends { sort_order?: number }>(items: T[] = []) =>
  [...items].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

const mapLatestItem = (
  item: ApiLatestItem,
  lang: string,
  buildContentHref: (id: string | number) => string,
  buildCategoryHrefFn: (id: string | number) => string,
): ReuseBoxItem => {
  const contentTitle = getLocalizedText(item.title, item._title, lang);
  const categoryTitle = getLocalizedText(
    item.category?.name,
    item.category?._name,
    lang,
  );
  const categoryId = item.category?.id ?? item.category_id;
  const contentHref = withLang(lang, buildContentHref(item.id));
  const categoryHref = categoryId
    ? withLang(lang, buildCategoryHrefFn(categoryId))
    : contentHref;
  const mediaKind = item.media_kind?.toLowerCase();

  const base = {
    id: item.id,
    subtitle: categoryTitle || contentTitle,
    title: contentTitle,
    subtitleHref: categoryHref,
    titleHref: contentHref,
  };

  if (
    (mediaKind === "video" || item.has_video || Boolean(item.youtube_url)) &&
    item.youtube_url
  ) {
    return {
      ...base,
      type: "video",
      youtubeUrl: item.youtube_url,
    };
  }

  if (
    (mediaKind === "audio" || item.has_audio || Boolean(item.audio)) &&
    item.audio
  ) {
    return {
      ...base,
      type: "audio",
      audioUrl: item.audio,
      downloadUrl: item.audio,
      progress: 0,
    };
  }

  if ((mediaKind === "read" || Boolean(item.pdf)) && item.pdf) {
    return {
      ...base,
      type: "pdf",
      downloadUrl: item.pdf,
      viewUrl: item.pdf,
    };
  }

  return {
    ...base,
    type: "link",
  };
};

const mapLatestList = (
  items: ApiLatestItem[] | undefined,
  lang: string,
  buildContentHref: (id: string | number) => string,
  buildCategoryHrefFn: (id: string | number) => string,
) =>
  (items ?? []).map((item) =>
    mapLatestItem(item, lang, buildContentHref, buildCategoryHrefFn),
  );

const getHrefBuildersByContentType = (contentType?: string) => {
  switch (contentType) {
    case "lecture":
      return {
        content: buildLectureHref,
        category: buildLectureCategoryHref,
      };
    case "speech":
      return {
        content: buildKhutbaHref,
        category: buildKhutbaCategoryHref,
      };
    case "fatwa":
      return {
        content: buildFatwaHref,
        category: buildFatwaCategoryHref,
      };
    case "article":
      return {
        content: buildArticleHref,
        category: buildArticleCategoryHref,
      };
    case "book":
      return {
        content: buildBookHref,
        category: buildBookCategoryHref,
      };
    case "explanation":
    default:
      return {
        content: buildExplanationHref,
        category: buildCategoryHref,
      };
  }
};

const mapMostViewedList = (
  items: ApiLatestItem[] | undefined,
  lang: string,
) =>
  [...(items ?? [])]
    .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))
    .map((item) => {
      const builders = getHrefBuildersByContentType(item.content_type);
      // Same media mapping as latest-published (audio / video / pdf / link)
      return mapLatestItem(item, lang, builders.content, builders.category);
    });

export const homeApi = createApi({
  reducerPath: "homeApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: [
    "HomeBanners",
    "HomeLatestPublished",
    "HomeMostViewed",
    "HomeStatistics",
    "HomeSearch",
  ],
  endpoints: (builder) => ({
    getHomeBanners: builder.query<HomeBanner[], { lang: string }>({
      query: ({ lang }) => ({
        url: `${HOME_API_BASE}/banners`,
        method: "GET",
        headers: {
          "Accept-Language": lang,
        },
      }),
      transformResponse: (response: unknown, _, arg): HomeBanner[] => {
        const result = response as ApiBannersResponse;
        return sortByOrder(result?.data?.banners ?? []).map((item) => ({
          id: item.id,
          title: getLocalizedText(item.title, item._title, arg.lang),
          description: getLocalizedText(
            item.description,
            item._description,
            arg.lang,
          ),
          category: item.category || "",
          categoryLabel: item._category || "",
          href: toLocalizedHref(item.url, arg.lang),
          image: item.image || "",
          sortOrder: item.sort_order ?? 0,
        }));
      },
      providesTags: ["HomeBanners"],
    }),

    getHomeLatestPublished: builder.query<HomeLatestPublished, { lang: string }>(
      {
        query: ({ lang }) => ({
          url: `${HOME_API_BASE}/latest-published`,
          method: "GET",
          headers: {
            "Accept-Language": lang,
          },
        }),
        transformResponse: (
          response: unknown,
          _,
          arg,
        ): HomeLatestPublished => {
          const result = response as ApiLatestPublishedResponse;
          const data = result?.data ?? {};

          return {
            explanations: mapLatestList(
              data.explanations,
              arg.lang,
              buildExplanationHref,
              buildCategoryHref,
            ),
            lectures: mapLatestList(
              data.lectures,
              arg.lang,
              buildLectureHref,
              buildLectureCategoryHref,
            ),
            speeches: mapLatestList(
              data.speeches,
              arg.lang,
              buildKhutbaHref,
              buildKhutbaCategoryHref,
            ),
            fatwas: mapLatestList(
              data.fatwas,
              arg.lang,
              buildFatwaHref,
              buildFatwaCategoryHref,
            ),
            articles: mapLatestList(
              data.articles,
              arg.lang,
              buildArticleHref,
              buildArticleCategoryHref,
            ),
            books: mapLatestList(
              data.books,
              arg.lang,
              buildBookHref,
              buildBookCategoryHref,
            ),
          };
        },
        providesTags: ["HomeLatestPublished"],
      },
    ),

    getHomeMostViewed: builder.query<
      HomeMostViewed,
      { lang: string; audioVisualLimit?: number }
    >({
      query: ({ lang, audioVisualLimit = 6 }) => ({
        url: `${HOME_API_BASE}/most-viewed`,
        method: "GET",
        params: {
          audio_visual_limit: audioVisualLimit,
        },
        headers: {
          "Accept-Language": lang,
        },
      }),
      transformResponse: (response: unknown, _, arg): HomeMostViewed => {
        const result = response as ApiMostViewedResponse;
        const data = result?.data ?? {};
        const audioVisualLimit = arg.audioVisualLimit ?? 6;

        return {
          audioVisual: mapMostViewedList(data.audio_visual, arg.lang).slice(
            0,
            audioVisualLimit,
          ),
          articles: mapMostViewedList(data.articles, arg.lang),
          books: mapMostViewedList(data.books, arg.lang),
        };
      },
      providesTags: ["HomeMostViewed"],
    }),

    getHomeStatistics: builder.query<HomeStatistics, { lang: string }>({
      query: ({ lang }) => ({
        url: `${HOME_API_BASE}/statistics`,
        method: "GET",
        headers: {
          "Accept-Language": lang,
        },
      }),
      transformResponse: (response: unknown): HomeStatistics => {
        const result = response as ApiStatisticsResponse;
        const stats = result?.data?.statistics ?? {};

        return {
          scholarly: stats.explanations ?? 0,
          lectures: stats.lectures ?? 0,
          khutbas: stats.speeches ?? 0,
          fatwas: stats.fatwas ?? 0,
          articles: stats.articles ?? 0,
          books: stats.books ?? 0,
          attachments: stats.total_attachments ?? 0,
          visits: stats.total_visits ?? 0,
        };
      },
      providesTags: ["HomeStatistics"],
    }),

    getHomeSearch: builder.query<
      HomeSearchResults,
      { lang: string; q: string }
    >({
      query: ({ lang, q }) => ({
        url: `${HOME_API_BASE}/search`,
        method: "GET",
        params: { q },
        headers: {
          "Accept-Language": lang,
        },
      }),
      transformResponse: (response: unknown, _, arg): HomeSearchResults => {
        const result = response as ApiSearchResponse;
        const data = result?.data ?? {};
        const results = data.results ?? {};

        return {
          query: data.query ?? arg.q,
          total: data.total ?? 0,
          explanations: mapMostViewedList(results.explanations, arg.lang),
          lectures: mapMostViewedList(results.lectures, arg.lang),
          speeches: mapMostViewedList(results.speeches, arg.lang),
          fatwas: mapMostViewedList(results.fatwas, arg.lang),
          articles: mapMostViewedList(results.articles, arg.lang),
          books: mapMostViewedList(results.books, arg.lang),
        };
      },
      providesTags: ["HomeSearch"],
    }),
  }),
});

export const {
  useGetHomeBannersQuery,
  useGetHomeLatestPublishedQuery,
  useGetHomeMostViewedQuery,
  useGetHomeStatisticsQuery,
  useGetHomeSearchQuery,
} = homeApi;
