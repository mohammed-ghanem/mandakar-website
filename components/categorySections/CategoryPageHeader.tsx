"use client";

import LangUseParams from "@/translate/LangUseParams";
import { getTextDir } from "@/lib/textDirection";

type CategoryPageHeaderProps = {
  title: string;
  image?: string;
};

const CategoryPageHeader = ({ title }: CategoryPageHeaderProps) => {
  const lang = LangUseParams();

  return (
    <div className="mb-5 flex items-center gap-3 rounded-xl bg-white px-4 py-3 
    sm:mb-6 sm:px-6 sm:py-4 [box-shadow:0px_0px_2px_#9d732c]">
      <h1
        dir={getTextDir(title, lang)}
        className="min-w-0 flex-1 text-lg font-bold sm:text-xl"
      >
        {title}
      </h1>
     
    </div>
  );
};

export default CategoryPageHeader;
