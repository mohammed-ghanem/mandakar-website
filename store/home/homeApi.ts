import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/store/base/axiosBaseQuery";

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

const sortByOrder = <T extends { sort_order?: number }>(items: T[] = []) =>
  [...items].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

export const homeApi = createApi({
  reducerPath: "homeApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["HomeBanners"],
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
  }),
});

export const { useGetHomeBannersQuery } = homeApi;
