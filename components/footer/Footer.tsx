"use client";

import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";
import Image from "next/image";
import qfooter from "@/public/assets/images/qfooter.png";
import copyright from "@/public/assets/images/copyright.png";
import facebook from "@/public/assets/images/facebook.svg";
import twitter from "@/public/assets/images/twitter.svg";
import instagram from "@/public/assets/images/instagram.svg";
import youtube from "@/public/assets/images/youtube.svg";
import telegram from "@/public/assets/images/telegram.svg";
import Link from "next/link";
import ScrollToTop from "../ScrollToTop/ScrollToTop";

const Footer = () => {
  const lang = LangUseParams();
  const translate = TranslateHook();
  const navbar = translate?.home?.navbar;
  const footerSocialIcons = [
    { icon: facebook, alt: "Facebook", width: 10, height: 20 },
    { icon: twitter, alt: "X", width: 20, height: 20 },
    { icon: instagram, alt: "Instagram", width: 20, height: 20 },
    { icon: youtube, alt: "YouTube", width: 20, height: 20 },
    { icon: telegram, alt: "Telegram", width: 20, height: 20 },
  ];

  const mainLinks = [
    { label: navbar?.home, href: `/${lang}` },
    { label: navbar?.about, href: `/${lang}/about` },
    { label: navbar?.scholarly, href: `/${lang}/scholarly` },
    { label: navbar?.lectures, href: `/${lang}/lectures` },
    { label: navbar?.khutbas, href: `/${lang}/khutbas` },
    { label: navbar?.fatwas, href: `/${lang}/fatwas` },
    { label: navbar?.articles, href: `/${lang}/articles` },
    { label: navbar?.books, href: `/${lang}/books` },
    { label: navbar?.privacyPolicy, href: `/${lang}/privacy-policy` },
    { label: navbar?.termsAndConditions, href: `/${lang}/terms-and-conditions` },
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
          <div className="flex items-center gap-2">
            {footerSocialIcons.map((item) => (
              <span
                key={item.alt}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-transparent"
              >
                <Image
                  src={item.icon}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                />
              </span>
            ))}
          </div>
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
                className="h-auto w-50 md:w-57.5"
              />
            </span>
            <span>&copy; 2026 - {new Date().getFullYear()}</span>
          </p>
          <p className="mt-2 text-[10px] text-white sm:text-xs">
            <Link href="https://wecandevmode.online" target="_blank">
              WeCan For Development & IT
            </Link>
          </p>
        </div>
      </div>
      <ScrollToTop />
    </footer>
  );
};

export default Footer;
