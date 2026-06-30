"use client";

import Image from "next/image";
import footerlogo from "@/public/assets/images/logofooter.png";
import footerEffect from "@/public/assets/images/footer-effect.png";

import "./style.css";
import SocialLinks from "../socialLinks/SocialLinks";
import LangUseParams from "@/translate/LangUseParams";
import Link from "next/link";

const Footer = () => {
  const lang = LangUseParams();

  const mainLinks = [
    { label: "الرئيسية", href: `/${lang}/` },
    { label: "عن الشيخ", href: `/${lang}` },
    { label: "الخطب", href: `/${lang}` },
    { label: "الدروس", href: `/${lang}` },
    { label: "المحاضرات", href: `/${lang}` },
    { label: "الفتاوى", href: `/${lang}` },
    { label: "تواصل معنا", href: `/${lang}/contact-us` },
  ];

  const secondaryLinks = [
    { label: "سياسة الخصوصية", href: `/${lang}/privacy-policy` },
    { label: "الشروط والأحكام", href: `/${lang}/terms-and-conditions` },
  ];
  return (
    <footer className="relative mt-10 text-white pt-10 md:pt-20 lg:pt-26 footer-bg">
      <div className="relative z-10 max-w-6xl mx-auto w-[95%] md:w-[80%] text-center px-4">
        {/* Social Icons */}
        <div className="flex justify-center gap-4 mt-4">
          <SocialLinks className="rounded-full" />
        </div>

        {/* Divider */}

        <div className="text-center text-white font-bold text-xs mt-6 pb-4">
          <p>
            All rights reserved for{" "}
            <span className="text-[#ffd86d]">Dr-Flayh Mandakar</span> &copy;
            2026 - {new Date().getFullYear()}
          </p>
          <p className="text-white text-xs mt-2">WeCan For Development & IT</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
