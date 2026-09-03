"use client";

import CategoryPageLayout from "@/components/categorySections/CategoryPageLayout";
import CategoryPageHeader from "@/components/categorySections/CategoryPageHeader";
import type { CategoryBreadcrumbItem } from "@/components/categorySections/CategoryBreadcrumb";
import StaticHtmlPageSkeleton from "@/components/skeletons/StaticHtmlPageSkeleton";
import LangUseParams from "@/translate/LangUseParams";
import { CARD_SHADOW } from "@/components/skeletons/categorySkeletonParts";
import { cn } from "@/lib/utils";

const PROSE_CLASS = cn(
  "text-sm leading-8 grayColor sm:text-base",
  "[&_h1]:mb-4 [&_h1]:text-xl [&_h1]:font-bold [&_h1]:scoundColor sm:[&_h1]:text-2xl",
  "[&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:scoundColor sm:[&_h2]:text-xl",
  "[&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:text-base [&_h3]:font-bold [&_h3]:scoundColor",
  "[&_p]:mb-4 [&_p]:leading-8",
  "[&_ul]:my-4 [&_ul]:list-disc [&_ul]:ps-6",
  "[&_ol]:my-4 [&_ol]:list-decimal [&_ol]:ps-6",
  "[&_li]:mb-1",
  "[&_a]:font-semibold [&_a]:scoundColor [&_a]:underline [&_a]:underline-offset-4",
  "[&_strong]:font-bold [&_strong]:text-[#3f3e3e]",
  "[&_blockquote]:my-4 [&_blockquote]:border-s-4 [&_blockquote]:border-[#9d732c] [&_blockquote]:ps-4 [&_blockquote]:italic",
  "[&_img]:my-4 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-xl",
  "[&_table]:my-4 [&_table]:w-full [&_table]:border-collapse",
  "[&_th]:border [&_th]:border-[#E6D6C0] [&_th]:bg-[#F5F3ED] [&_th]:p-2 [&_th]:text-start",
  "[&_td]:border [&_td]:border-[#E6D6C0] [&_td]:p-2",
);

export type StaticHtmlPageLabels = {
  empty?: string;
  error?: string;
  retry?: string;
};

type StaticHtmlPageProps = {
  title: string;
  crumbs: CategoryBreadcrumbItem[];
  html?: string;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  labels?: StaticHtmlPageLabels;
};

const StaticHtmlPage = ({
  title,
  crumbs,
  html,
  isLoading,
  isError,
  onRetry,
  labels,
}: StaticHtmlPageProps) => {
  const lang = LangUseParams();
  const content = html?.trim() ?? "";

  if (isLoading) {
    return <StaticHtmlPageSkeleton />;
  }

  return (
    <CategoryPageLayout crumbs={crumbs}>
      <CategoryPageHeader title={title} />

      {isError && (
        <div
          className={`rounded-2xl bg-white p-6 text-center sm:p-8 ${CARD_SHADOW}`}
          role="alert"
        >
          <p className="mb-4 text-sm font-semibold grayColor">{labels?.error}</p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="rounded-lg scoundBgColor px-4 py-2 text-sm text-white"
            >
              {labels?.retry}
            </button>
          )}
        </div>
      )}

      {!isError && content.length === 0 && (
        <p className="py-10 text-center text-sm grayColor">{labels?.empty}</p>
      )}

      {!isError && content.length > 0 && (
        <article
          className={cn(
            "rounded-2xl bg-white p-5 sm:p-8 md:p-10",
            CARD_SHADOW,
            PROSE_CLASS,
          )}
          dir={lang === "ar" ? "rtl" : "ltr"}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
    </CategoryPageLayout>
  );
};

export default StaticHtmlPage;
