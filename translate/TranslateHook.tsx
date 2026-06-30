/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import en from "@/app/dictionaries/en.json";
import ar from "@/app/dictionaries/ar.json";
import LangUseParams from "./LangUseParams";
import { defaultLocale } from "@/constants/locales";

const dictionaries: Record<string, any> = { en, ar };

const TranslateHook = () => {
  const lang = LangUseParams();
  return dictionaries[lang ?? defaultLocale] ?? dictionaries[defaultLocale];
};

export default TranslateHook;
