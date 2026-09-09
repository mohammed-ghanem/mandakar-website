import type { MetadataRoute } from "next";
import { i18n } from "@/i18n-config";
import {
  absolutePublicUrl,
  fetchSectionSitemapPaths,
  SECTION_CONFIG,
  type ContentSection,
} from "@/lib/contentMetadata";

const STATIC_PATHS = [
  "",
  "/about",
  "/contact-us",
  "/articles",
  "/books",
  "/fatwas",
  "/khutbas",
  "/lectures",
  "/scholarly",
  "/privacy-policy",
  "/terms-and-conditions",
] as const;

const CONTENT_SECTIONS = Object.keys(SECTION_CONFIG) as ContentSection[];

const SECTION_ROOT_PATHS = new Set(
  CONTENT_SECTIONS.map((section) => SECTION_CONFIG[section].pathPrefix),
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];
  const dynamicPaths = new Set<string>();

  const sectionResults = await Promise.allSettled(
    CONTENT_SECTIONS.map((section) => fetchSectionSitemapPaths(section, "ar")),
  );

  for (const result of sectionResults) {
    if (result.status !== "fulfilled") continue;

    for (const path of result.value) {
      if (SECTION_ROOT_PATHS.has(path)) continue;
      dynamicPaths.add(path);
    }
  }

  for (const locale of i18n.locales) {
    for (const path of STATIC_PATHS) {
      entries.push({
        url: absolutePublicUrl(locale, path || "/"),
        lastModified: now,
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.8,
      });
    }

    for (const path of dynamicPaths) {
      entries.push({
        url: absolutePublicUrl(locale, path),
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
