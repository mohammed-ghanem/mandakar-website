"use client";

import { Suspense } from "react";
import Link from "next/link";
import GlobeBtn from "./GlobeBtn";
import logo from "@/public/assets/images/logo.svg";
import Image from "next/image";
import SearchInput from "./SearchInput";
import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";

const SearchInputFallback = () => {
  const translate = TranslateHook();
  const searchInput = translate?.home?.searchInput;

  return (
    <div className="relative w-full">
      <div className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 rounded bg-gray-200" />
      <input
        type="search"
        disabled
        placeholder={searchInput?.searchPlaceholder ?? ""}
        aria-label={searchInput?.search ?? ""}
        className="w-full rounded-md border border-gray-300 bg-white py-2.5 pl-12 pr-4 text-sm text-gray-700 outline-none placeholder:text-gray-400"
      />
    </div>
  );
};

const TopHeader = () => {
  const lang = LangUseParams();

  return (
    <div className="w-full">
      <div className="container mx-auto w-[90%] max-w-7xl px-2 py-4 sm:px-4 sm:py-6">
        {/* Mobile & Tablet */}
        <div className="flex flex-col gap-4 lg:hidden">
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2">
            <GlobeBtn />
            <Link
              href={`/${lang}`}
              className="flex items-center justify-center"
            >
              <Image
                src={logo}
                alt="logo"
                width={350}
                height={250}
                priority
                className="w-auto sm:h-16 md:h-20"
              />
            </Link>
            <div className="w-10 sm:w-12" aria-hidden />
          </div>
          <Suspense fallback={<SearchInputFallback />}>
            <SearchInput />
          </Suspense>
        </div>

        {/* Desktop */}
        <div className="hidden lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-6">
          <div className="flex justify-start mr-8">
            <GlobeBtn />
          </div>
          <Link href={`/${lang}`} className="flex items-center justify-center">
            <Image
              src={logo}
              alt="logo"
              width={240}
              height={250}
              priority
              className="h-auto w-full max-w-[240px] xl:max-w-[250px]"
            />
          </Link>
          <div className="flex justify-end">
            <div className="w-[80%] max-w-md">
              <Suspense fallback={<SearchInputFallback />}>
                <SearchInput />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;
