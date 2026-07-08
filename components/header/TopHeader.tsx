"use client";

import Link from "next/link";
import GlobeBtn from "./GlobeBtn";
import logo from "@/public/assets/images/logo.svg";
import Image from "next/image";
import SearchInput from "./SearchInput";
import LangUseParams from "@/translate/LangUseParams";

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
          <SearchInput />
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
              <SearchInput />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;
