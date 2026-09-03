"use client";

import { useEffect, useState } from "react";
import CategoryPageLayout from "@/components/categorySections/CategoryPageLayout";
import CategoryDetailView from "@/components/categorySections/CategoryDetailView";
import CategoryContentView from "@/components/categorySections/CategoryContentView";
import {
  findCategoryByHref,
  hasChildren,
  hasTopics,
  withLang,
} from "@/components/categorySections/types";
import CategoryDetailSkeleton from "@/components/skeletons/CategoryDetailSkeleton";
import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";
import { scholarlyCategories } from "./scholarlyTestData";

type ScholarlyNestedPageProps = {
  slug: string[];
};

const ScholarlyNestedPage = ({ slug }: ScholarlyNestedPageProps) => {
  const lang = LangUseParams();
  const translate = TranslateHook();
  const page = translate?.pages?.scholarlyPage;
  const homeLabel = translate?.home?.navbar?.home;
  const href = `/scholarly/${slug.join("/")}`;
  const found = findCategoryByHref(scholarlyCategories, href);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady || !page) {
    let variant: "tabs" | "boxes" | "topics" | "content" = "content";
    if (found && !found.topic) {
      if (hasChildren(found.node) && hasTopics(found.node)) variant = "tabs";
      else if (hasChildren(found.node)) variant = "boxes";
      else if (hasTopics(found.node)) variant = "topics";
    }
    return <CategoryDetailSkeleton variant={variant} />;
  }

  if (!found) {
    return (
      <CategoryPageLayout crumbs={[{ label: homeLabel }, { label: page.title }]}>
        <p className="text-center text-sm grayColor">{page.notFound}</p>
      </CategoryPageLayout>
    );
  }

  if (!found.topic && (hasChildren(found.node) || hasTopics(found.node))) {
    return (
      <CategoryDetailView
        node={found.node}
        trail={found.trail}
        rootHref="/scholarly"
      />
    );
  }

  const title = found.topic?.title ?? found.node.title;
  const crumbs = [
    { label: homeLabel, href: `/${lang}` },
    { label: page.title, href: `/${lang}/scholarly` },
    ...found.trail.map((item, index) => ({
      label: item.title,
      href:
        found.topic || index < found.trail.length - 1
          ? withLang(lang, item.href)
          : undefined,
    })),
    ...(found.topic ? [{ label: found.topic.title }] : []),
  ];

  return (
    <CategoryPageLayout crumbs={crumbs}>
      <CategoryContentView title={title} />
    </CategoryPageLayout>
  );
};

export default ScholarlyNestedPage;
