"use client";

import { useState } from "react";
import Link from "next/link";
import TranslateHook from "@/translate/TranslateHook";
import LangUseParams from "@/translate/LangUseParams";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const lang = LangUseParams();
  const translate = TranslateHook();
  const navbar = translate?.home?.navbar;

  const navLinks = [
    { label: navbar?.home, href: `/${lang}` },
    { label: navbar?.about, href: `/${lang}` },
    { label: navbar?.scholarly, href: `/${lang}` },
    { label: navbar?.lectures, href: `/${lang}` },
    { label: navbar?.khutbas, href: `/${lang}` },
    { label: navbar?.fatwas, href: `/${lang}` },
    { label: navbar?.articles, href: `/${lang}` },
    { label: navbar?.books, href: `/${lang}` },
  ];

  const linkClassName =
    "font-semibold hover:text-[#9D732C] transition-colors duration-300";

  return (
    <header className="w-full">
      <div className="container mx-auto w-[90%] max-w-7xl px-2 py-3 sm:px-4 mt-2">
        <div className="relative w-full">
          {/* Desktop / Tablet — scrollable on medium, wrapped on xl+ */}
          <nav className="hidden lg:flex items-center justify-center gap-3 overflow-x-auto pb-1 text-sm whitespace-nowrap xl:flex-wrap xl:gap-4 xl:overflow-visible xl:pb-0 xl:text-base 2xl:gap-6">
            {navLinks.map((link, index) => (
              <Link
                key={`${link.label}-${index}`}
                href={link.href}
                className={linkClassName}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="flex w-full items-center justify-end lg:hidden">
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              className="flex flex-col gap-1.5 rounded-md p-2"
            >
              <span
                className={`h-0.5 w-6 scoundBgColor transition-transform duration-300 ${
                  isOpen ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span
                className={`h-0.5 w-6 scoundBgColor transition-opacity duration-300 ${
                  isOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`h-0.5 w-6 scoundBgColor transition-transform duration-300 ${
                  isOpen ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
            </button>
          </div>

          {/* Mobile dropdown */}
          {isOpen && (
            <>
              <button
                type="button"
                aria-label="Close menu"
                className="fixed inset-0 z-40 bg-black/20 lg:hidden"
                onClick={() => setIsOpen(false)}
              />
              <div className="absolute top-full right-0 left-0 z-50 mt-2 flex flex-col gap-3 rounded-lg border border-[#E6D6C0] bg-white p-4 shadow-lg lg:hidden">
                {navLinks.map((link, index) => (
                  <Link
                    key={`${link.label}-m-${index}`}
                    href={link.href}
                    className={`${linkClassName} py-1 text-base`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
