"use client";

import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";
import StaticHtmlPage from "./StaticHtmlPage";
import StaticHtmlPageSkeleton from "@/components/skeletons/StaticHtmlPageSkeleton";

type PageCopy = {
  title?: string;
  titleSpan?: string;
  empty?: string;
  error?: string;
  retry?: string;
};

type PublicStaticPageProps = {
  page?: PageCopy;
  html?: string;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
};

const PublicStaticPage = ({
  page,
  html,
  isLoading,
  isError,
  onRetry,
}: PublicStaticPageProps) => {
  const lang = LangUseParams();
  const translate = TranslateHook();

  if (!translate || !page) {
    return <StaticHtmlPageSkeleton />;
  }

  const title = `${page.title ?? ""}${page.titleSpan ?? ""}`.trim();
  const homeLabel = translate.home.navbar.home;

  return (
    <StaticHtmlPage
      title={title}
      crumbs={[
        { label: homeLabel, href: `/${lang}` },
        { label: title },
      ]}
      html={html}
      isLoading={isLoading}
      isError={isError}
      onRetry={onRetry}
      labels={{
        empty: page.empty,
        error: page.error,
        retry: page.retry,
      }}
    />
  );
};

export default PublicStaticPage;
