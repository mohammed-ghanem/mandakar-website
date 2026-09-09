"use client";

import Link from "next/link";
import CategorySections from "@/components/categorySections/CategorySections";
import CategorySectionsSkeleton from "@/components/skeletons/CategorySectionsSkeleton";
import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";
import { useGetLectureCategoriesQuery } from "@/store/lectures/lecturesApi";

const LecturesPage = () => {
  const lang = LangUseParams();
  const translate = TranslateHook();
  const page = translate?.pages?.lecturesPage;
  const homeLabel = translate?.home?.navbar?.home;
  const { data, isLoading } = useGetLectureCategoriesQuery({
    lang: lang ?? "ar",
  });

  if (isLoading || !page) {
    return <CategorySectionsSkeleton />;
  }

  return (
    <section className="bkMainColor pb-12 pt-6 sm:pb-16 sm:pt-8">
      <div className="bgNavbarColor">
        <nav
          aria-label="breadcrumb"
          className=" container mx-auto mb-6 flex w-[80%] flex-wrap items-center gap-2 py-2 text-sm font-semibold sm:mb-8 sm:text-xs"
        >
          <Link href={`/${lang}`}>{homeLabel}</Link>
          <span aria-hidden>{">"}</span>
          <span>{page.title}</span>
        </nav>
      </div>

      <div className="container mx-auto w-full max-w-7xl px-2 sm:px-4 md:w-[90%]">
        <CategorySections items={data ?? []} />
      </div>
    </section>
  );
};

export default LecturesPage;
