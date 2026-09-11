"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import searchIcon from "@/public/assets/images/search.svg";
import TranslateHook from "@/translate/TranslateHook";
import LangUseParams from "@/translate/LangUseParams";

const SearchInput = () => {
  const translate = TranslateHook();
  const lang = LangUseParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchInput = translate?.home?.searchInput;
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  const submitSearch = (event?: FormEvent) => {
    event?.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/${lang}/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <form onSubmit={submitSearch} className="relative w-full">
      <button
        type="submit"
        aria-label={searchInput?.search ?? ""}
        className="absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer"
      >
        <Image src={searchIcon} alt="" width={16} height={16} />
      </button>
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={searchInput?.searchPlaceholder ?? ""}
        aria-label={searchInput?.search ?? ""}
        className="w-full rounded-md border border-gray-300 bg-white py-2.5 pl-12 pr-4 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-gray-400"
      />
    </form>
  );
};

export default SearchInput;
