import type { Metadata } from "next";
import HomePage from "@/components/homePage/Home";
import { buildPageMetadata } from "@/lib/contentMetadata";
import {
  SITE_DESCRIPTION,
  SITE_DESCRIPTION_EN,
  SITE_KEYWORDS,
  SITE_TITLE,
  SITE_TITLE_EN,
} from "@/lib/siteMetadata";

type HomePageProps = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === "en";

  return buildPageMetadata({
    lang,
    title: isEn ? SITE_TITLE_EN : SITE_TITLE,
    description: isEn ? SITE_DESCRIPTION_EN : SITE_DESCRIPTION,
    path: "/",
    keywords: [...SITE_KEYWORDS],
    type: "website",
  });
}

export default function Home() {
  return <HomePage />;
}
