import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/store/base/axiosBaseQuery";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const CLIENT_STATIC_PAGES_BASE = `${BASE_URL}/client-api/v1/static-pages`;

export type StaticPageHtml = { html: string };

export type WebsiteSocialLinks = {
  facebook: string | null;
  x: string | null;
  instagram: string | null;
  youtube: string | null;
  telegram: string | null;
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
        getStaticPrivacyPolicy: builder.query<
            StaticPageHtml,
            { lang: string }
        >({
            query: ({ lang }) => ({
                url: `${CLIENT_STATIC_PAGES_BASE}/privacy-policy`,
                method: "GET",
                headers: {
                    "Accept-Language": lang,
                },
            }),
            transformResponse: (response: unknown): StaticPageHtml => {
                const r = response as { data?: unknown };
                const raw = r?.data;
                return {
                    html: typeof raw === "string" ? raw : "",
                };
            },
            providesTags: ["StaticPrivacyPolicy"],
        }),

        getStaticTermsAndConditions: builder.query<
            StaticPageHtml,
            { lang: string }
        >({
            query: ({ lang }) => ({
                url: `${CLIENT_STATIC_PAGES_BASE}/terms-and-conditions`,
                method: "GET",
                headers: {
                    "Accept-Language": lang,
                },
            }),
            transformResponse: (response: unknown): StaticPageHtml => {
                const r = response as { data?: unknown };
                const raw = r?.data;
                return {
                    html: typeof raw === "string" ? raw : "",
                };
            },
            providesTags: ["StaticTermsAndConditions"],
        }),

        getStaticAbout: builder.query<
            StaticPageHtml,
            { lang: string }
        >({
            query: ({ lang }) => ({
                url: `${CLIENT_STATIC_PAGES_BASE}/about-app`,
                method: "GET",
                headers: {
                    "Accept-Language": lang,
                },
            }),
            transformResponse: (response: unknown): StaticPageHtml => {
                const r = response as { data?: unknown };
                const raw = r?.data;
                return {
                    html: typeof raw === "string" ? raw : "",
                };
            },
            providesTags: ["StaticAbout"],
        }),

        getWebsiteContacts: builder.query<
            WebsiteSocialLinks,
            { lang: string }
        >({
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
