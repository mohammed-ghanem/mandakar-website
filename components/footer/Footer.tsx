"use client";

import SocialLinks from "../socialLinks/SocialLinks";
import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";
import Image from "next/image";
import qfooter from "@/public/assets/images/qfooter.png";
import copyright from "@/public/assets/images/copyright.png";
import Link from "next/link";
import ScrollToTop from "../ScrollToTop/ScrollToTop";

const Footer = () => {
  const lang = LangUseParams();
  const translate = TranslateHook();
  const navbar = translate?.home?.navbar;

  const mainLinks = [
    { label: navbar?.home, href: `/${lang}` },
    { label: navbar?.about, href: `/${lang}` },
    { label: navbar?.scholarly, href: `/${lang}` },
    { label: navbar?.lectures, href: `/${lang}` },
    { label: navbar?.khutbas, href: `/${lang}` },
    { label: navbar?.fatwas, href: `/${lang}` },
    { label: navbar?.articles, href: `/${lang}` },
    { label: navbar?.books, href: `/${lang}` },
    { label: navbar?.privacyPolicy, href: `/${lang}` },
    { label: navbar?.termsAndConditions, href: `/${lang}` },
  ];

  const linkClassName =
    "text-white font-semibold text-xs sm:text-sm md:text-base transition-colors hover:text-[#9D732C]";

  return (
    <footer className="relative bg-black text-white">
      <div className="bkMainColor h-24 sm:h-28 md:h-36" />

      <div className="relative z-10 max-w-6xl mx-auto w-[95%] md:w-[80%] text-center pt-25">
        <div className="absolute -top-30 left-0 right-0 flex justify-center gap-4">
          <Image src={qfooter} alt="logo" width={100} height={100} />
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:gap-x-4 sm:gap-y-3 md:gap-4">
          {mainLinks.map((link, index) => (
            <Link
              key={`${link.label}-${index}`}
              href={link.href}
              className={linkClassName}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-4 flex justify-center">
          <SocialLinks className="rounded-full" />
        </div>

        <div className="mt-6 pb-4 text-center text-xs font-bold text-white sm:text-sm">
          <p
            className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:flex-wrap"
            dir="ltr"
          >
            <span>All rights reserved for</span>
            <span dir="rtl" className="lightColor">
              <Image
                src={copyright}
                alt="copyright"
                width={230}
                height={200}
                className="h-auto w-50 md:w-[230px]"
              />
            </span>
            <span>&copy; 2026 - {new Date().getFullYear()}</span>
          </p>
          <p className="mt-2 text-[10px] text-white sm:text-xs">
            WeCan For Development & IT
          </p>
        </div>
      </div>
      <ScrollToTop />
    </footer>
  );
};

export default Footer;
