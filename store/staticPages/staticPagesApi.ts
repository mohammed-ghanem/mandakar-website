import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/store/base/axiosBaseQuery";
import {
  getLocalizedText,
  type LocalizedText,
} from "@/lib/localizedText";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const CLIENT_STATIC_PAGES_BASE = `${BASE_URL}/client-api/v1/static-pages`;

export type StaticPageHtml = {
  html: string;
  /** Locale of the HTML actually returned (may fall back to Arabic). */
  contentLang: "ar" | "en";
};

export type WebsiteSocialLinks = {
  facebook: string | null;
  x: string | null;
  instagram: string | null;
  youtube: string | null;
  telegram: string | null;
};

const extractHtml = (payload: unknown, lang: string): string => {
  if (typeof payload === "string") return normalizeHtml(payload);

  if (!payload || typeof payload !== "object") return "";

  const raw = (payload as { data?: unknown }).data;

  if (typeof raw === "string") return normalizeHtml(raw);

  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    // Empty `{}` from API means no content for that locale
    if (Object.keys(raw as object).length === 0) return "";
    return normalizeHtml(
      getLocalizedText(raw as LocalizedText, undefined, lang),
    );
  }

  return "";
};

/** Treat blank / editor-empty HTML as missing so Arabic fallback can run. */
const normalizeHtml = (html: string): string => {
  const trimmed = html.trim();
  if (!trimmed) return "";

  const textOnly = trimmed
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  return textOnly ? trimmed : "";
};

const fetchStaticHtml = async (
  path: string,
  lang: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  baseQuery: any,
): Promise<
  | { data: StaticPageHtml }
  | { error: unknown }
> => {
  const requestedLang = lang === "en" ? "en" : "ar";

  const primary = await baseQuery({
    url: `${CLIENT_STATIC_PAGES_BASE}/${path}`,
    method: "GET",
    headers: {
      "Accept-Language": requestedLang,
    },
  });

  if (primary.error) {
    return { error: primary.error };
  }

  const primaryHtml = extractHtml(primary.data, requestedLang);
  if (primaryHtml || requestedLang === "ar") {
    return {
      data: {
        html: primaryHtml,
        contentLang: requestedLang,
      },
    };
  }

  // English empty → fall back to Arabic content
  const fallback = await baseQuery({
    url: `${CLIENT_STATIC_PAGES_BASE}/${path}`,
    method: "GET",
    headers: {
      "Accept-Language": "ar",
    },
  });

  if (fallback.error) {
    return { error: fallback.error };
  }

  return {
    data: {
      html: extractHtml(fallback.data, "ar"),
      contentLang: "ar",
    },
  };
};

export const staticPagesApi = createApi({
  reducerPath: "staticPagesApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: [
    "StaticPrivacyPolicy",
    "StaticTermsAndConditions",
    "StaticAbout",
    "WebsiteContacts",
  ],
  endpoints: (builder) => ({
    getStaticPrivacyPolicy: builder.query<StaticPageHtml, { lang: string }>({
      async queryFn({ lang }, _api, _extra, baseQuery) {
        return fetchStaticHtml("privacy-policy", lang, baseQuery);
      },
      providesTags: ["StaticPrivacyPolicy"],
    }),

    getStaticTermsAndConditions: builder.query<
      StaticPageHtml,
      { lang: string }
    >({
      async queryFn({ lang }, _api, _extra, baseQuery) {
        return fetchStaticHtml("terms-and-conditions", lang, baseQuery);
      },
      providesTags: ["StaticTermsAndConditions"],
    }),

    getStaticAbout: builder.query<StaticPageHtml, { lang: string }>({
      async queryFn({ lang }, _api, _extra, baseQuery) {
        return fetchStaticHtml("about-sheikh", lang, baseQuery);
      },
      providesTags: ["StaticAbout"],
    }),

    getWebsiteContacts: builder.query<WebsiteSocialLinks, { lang: string }>({
      query: ({ lang }) => ({
        url: `${CLIENT_STATIC_PAGES_BASE}/website-contacts`,
        method: "GET",
        headers: {
          "Accept-Language": lang,
        },
      }),
      transformResponse: (response: unknown): WebsiteSocialLinks => {
        const r = response as {
          data?: {
            social?: {
              facebook?: string | null;
              x?: string | null;
              instagram?: string | null;
              youtube?: string | null;
              telegram?: string | null;
            };
          };
        };
        const social = r?.data?.social ?? {};

        return {
          facebook: social.facebook?.trim() || null,
          x: social.x?.trim() || null,
          instagram: social.instagram?.trim() || null,
          youtube: social.youtube?.trim() || null,
          telegram: social.telegram?.trim() || null,
        };
      },
      providesTags: ["WebsiteContacts"],
    }),
  }),
});

export const {
  useGetStaticPrivacyPolicyQuery,
  useGetStaticTermsAndConditionsQuery,
  useGetStaticAboutQuery,
  useGetWebsiteContactsQuery,
} = staticPagesApi;
