"use client";

import Image from "next/image";
import searchIcon from "@/public/assets/images/search.svg";
import TranslateHook from "@/translate/TranslateHook";

const SearchInput = () => {
  const translate = TranslateHook();
  const searchInput = translate?.home?.searchInput;

  return (
    <div className="relative w-full">
      <Image
        src={searchIcon}
        alt=""
        width={16}
        height={16}
        className="absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer"
      />
      <input
        type="search"
        placeholder={searchInput?.searchPlaceholder ?? ""}
        aria-label={searchInput?.search ?? ""}
        className={`w-full rounded-md border border-gray-300 bg-white py-2.5 pl-12 pr-4 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-gray-400`}
      />
    </div>
  );
};

export default SearchInput;
