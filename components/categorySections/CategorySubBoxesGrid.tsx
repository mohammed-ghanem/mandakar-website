"use client";

import Link from "next/link";
import CategoryLink from "./CategoryLink";
import { withLang, type CategoryItem, type CategoryTopic } from "./types";
import LangUseParams from "@/translate/LangUseParams";
import { ScrollArea } from "@/components/ui/scroll-area";

type CategorySubBoxesGridProps = {
  items: CategoryItem[];
};

const boxLinks = (item: CategoryItem): CategoryTopic[] => {
  const childLinks =
    item.children?.map((child) => ({
      id: child.id,
      title: child.title,
      href: child.href,
    })) ?? [];
  const topicLinks = item.topics ?? [];
  return [...childLinks, ...topicLinks];
};

const CategorySubBoxesGrid = ({ items }: CategorySubBoxesGridProps) => {
  const lang = LangUseParams();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item, index) => {
        const order = String(index + 1).padStart(2, "0");
        const href = withLang(lang, item.href);
        const links = boxLinks(item);

        return (
          <article
            key={item.id}
            className="flex h-72 flex-col items-start overflow-hidden rounded-2xl bg-white p-4 [box-shadow:1px_1px_1px_#9d732c]"
          >
            <span
              className="mb-2 block text-start text-2xl font-bold leading-none text-[#E6E2DA]"
              aria-hidden
            >
              {order}
            </span>
            {href ? (
              <Link
                href={href}
                className="mb-4 block w-full text-start text-base font-bold transition-opacity hover:opacity-80 sm:text-lg"
              >
                {item.title}
              </Link>
            ) : (
              <h2 className="mb-4 w-full text-start text-base font-bold sm:text-lg">
                {item.title}
              </h2>
            )}

            <ScrollArea
              type="auto"
              dir={lang === "ar" ? "rtl" : "ltr"}
              className="categoryBoxScroll min-h-0 w-full min-w-0 flex-1 self-stretch"
            >
              <ul className="space-y-3 pe-1">
                {links.map((link) => (
                  <li key={link.id} className="min-w-0">
                    <CategoryLink
                      title={link.title}
                      href={withLang(lang, link.href)}
                      size="sm"
                    />
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </article>
        );
      })}
    </div>
  );
};

export default CategorySubBoxesGrid;
