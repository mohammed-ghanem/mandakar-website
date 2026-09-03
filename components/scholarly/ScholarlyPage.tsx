"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CategorySections from "@/components/categorySections/CategorySections";
import CategorySectionsSkeleton from "@/components/skeletons/CategorySectionsSkeleton";
import { scholarlyCategories } from "./scholarlyTestData";
import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";

const ScholarlyPage = () => {
  const lang = LangUseParams();
  const translate = TranslateHook();
  const page = translate?.pages?.scholarlyPage;
  const homeLabel = translate?.home?.navbar?.home;
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady || !page) {
    return <CategorySectionsSkeleton />;
  }

  return (
    <section className="bkMainColor pb-12 pt-6 sm:pb-16 sm:pt-8">
      <div className="bgNavbarColor">
        <nav
          aria-label="breadcrumb"
          className=" mb-6 flex flex-wrap items-center gap-2 text-sm font-semibold  
          sm:mb-8 sm:text-xs container mx-auto w-[80%] py-2"
        >
          <Link
            href={`/${lang}`}
            className=""
          >
            {homeLabel}
          </Link>
          <span aria-hidden className="">
            {">"}
          </span>
          <span>{page?.title}</span>
        </nav>
      </div>

      <div className="container mx-auto w-full max-w-7xl px-2 sm:px-4 md:w-[90%]">
        <CategorySections items={scholarlyCategories} />
      </div>
    </section>
  );
};

export default ScholarlyPage;
