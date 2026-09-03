"use client";

import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";
import CategoryPageLayout from "./CategoryPageLayout";
import CategoryPageHeader from "./CategoryPageHeader";
import CategorySubBoxesGrid from "./CategorySubBoxesGrid";
import CategoryTopicsGrid from "./CategoryTopicsGrid";
import { hasChildren, hasTopics, withLang, type CategoryItem } from "./types";
import { useState } from "react";

type CategoryDetailViewProps = {
  node: CategoryItem;
  trail: CategoryItem[];
  rootHref: string;
};

type DetailTab = "categories" | "topics";

const CategoryDetailView = ({ node, trail, rootHref }: CategoryDetailViewProps) => {
  const lang = LangUseParams();
  const translate = TranslateHook();
  const page = translate.pages.scholarlyPage;
  const homeLabel = translate.home.navbar.home;
  const children = node.children ?? [];
  const topics = node.topics ?? [];
  const showTabs = hasChildren(node) && hasTopics(node);
  const [tab, setTab] = useState<DetailTab>("categories");

  const crumbs = [
    { label: homeLabel, href: `/${lang}` },
    { label: page.title, href: withLang(lang, rootHref) },
    ...trail.map((item, index) => ({
      label: item.title,
      href:
        index < trail.length - 1 ? withLang(lang, item.href) : undefined,
    })),
  ];

  const showCategories = hasChildren(node) && (!showTabs || tab === "categories");
  const showTopics = hasTopics(node) && (!hasChildren(node) || tab === "topics");

  return (
    <CategoryPageLayout crumbs={crumbs}>
      <CategoryPageHeader title={node.title} image={node.image} />

      {showTabs && (
        <div className="mb-6 flex justify-center">
          <div
            role="tablist"
            className="grid w-[80%] mx-auto grid-cols-2 rounded-lg border border-[#E6D6C0] bg-white p-1"
          >
            <button
              type="button"
              role="tab"
              aria-selected={tab === "categories"}
              onClick={() => setTab("categories")}
              className={`rounded-lg py-2 text-sm font-bold transition-colors  sm:text-base ${
                tab === "categories"
                  ? "categoryTabActiveBg text-white"
                  : "text-[#3f3e3e]"
              }`}
            >
              {page.categoriesTab}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === "topics"}
              onClick={() => setTab("topics")}
              className={`rounded-lg py-2 text-sm font-bold transition-colors  sm:text-base ${
                tab === "topics"
                  ? "categoryTabActiveBg text-white"
                  : "text-[#3f3e3e]"
              }`}
            >
              {page.otherTopicsTab}
            </button>
          </div>
        </div>
      )}

      {showCategories && <CategorySubBoxesGrid items={children} />}
      {showTopics && <CategoryTopicsGrid topics={topics} />}
    </CategoryPageLayout>
  );
};

export default CategoryDetailView;
