"use client";
import { useRouter, usePathname } from "next/navigation";
import langIcon from "@/public/assets/images/lang.svg";
import Image from "next/image";
import LangUseParams from "@/translate/LangUseParams";

const GlobeBtn = () => {
  const lang = LangUseParams();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const newLang = lang === "en" ? "ar" : "en";
    const segments = pathname.split("/").filter(Boolean);

    if (segments[0] === "en" || segments[0] === "ar") {
      segments[0] = newLang;
    } else {
      segments.unshift(newLang);
    }

    const path = "/" + segments.join("/");
    const query = typeof window !== "undefined" ? window.location.search : "";
    router.push(path + query);
  };

  return (
    <button
      type="button"
      className="inline-flex items-center cursor-pointer rounded-md p-1"
      onClick={toggleLanguage}
      aria-label={lang === "en" ? "Switch to Arabic" : "Switch to English"}
    >
      <span className="text-sm font-bold me-2">{lang === "en" ? "Ar" : "EN"}</span>
      <Image src={langIcon} alt="lang" width={40} height={40} />
    </button>
  );
};

export default GlobeBtn;
