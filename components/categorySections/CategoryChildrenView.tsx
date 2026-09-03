"use client";

import Link from "next/link";
import LangUseParams from "@/translate/LangUseParams";
import FolderBadge from "./FolderBadge";
import CategorySubList from "./CategorySubList";
import { hasChildren, withLang, type CategoryItem, type FoundCategory } from "./types";

export type CategoryBreadcrumbItem = {
  label: string;
  href?: string;
};

type CategoryChildrenViewProps = {
  found: FoundCategory;
  rootLabel: string;
  rootHref: string;
  homeLabel: string;
};

const CategoryChildrenView = ({
  found,
  rootLabel,
  rootHref,
  homeLabel,
}: CategoryChildrenViewProps) => {
  const lang = LangUseParams();
  const { node, trail } = found;
  const children = node.children ?? [];

  const crumbs: CategoryBreadcrumbItem[] = [
    { label: homeLabel, href: `/${lang}` },
    { label: rootLabel, href: withLang(lang, rootHref) },
    ...trail.map((item, index) => ({
      label: item.title,
      href:
        index === trail.length - 1
          ? undefined
          : withLang(lang, item.href),
    })),
  ];

  return (
    <section className="bkMainColor pb-12 pt-6 sm:pb-16 sm:pt-8">
      <div className="container mx-auto w-full max-w-7xl px-2 sm:px-4 md:w-[90%]">
        <nav
          aria-label="breadcrumb"
          className="mb-6 flex flex-wrap items-center gap-2  text-sm font-semibold scoundColor
           sm:mb-8 sm:text-base "
        >
          {crumbs.map((crumb, index) => (
            <span key={`${crumb.label}-${index}`} className="flex items-center gap-2">
              {index > 0 && (
                <span aria-hidden className="text-[#C4B58A]">
                  {">"}
                </span>
              )}
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="transition-opacity hover:opacity-80"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span>{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>

        <article className="rounded-2xl bg-white p-4 shadow-sm sm:p-6 md:p-8">
          <div className="mb-5 flex items-center gap-3 sm:mb-6 sm:gap-4 ">
            <h1 className="min-w-0 flex-1 text-lg font-bold mainColor sm:text-xl">
              {node.title}
            </h1>
          
          </div>

          {hasChildren(node) ? (
            <CategorySubList items={children} />
          ) : null}
        </article>
      </div>
    </section>
  );
};

export default CategoryChildrenView;
