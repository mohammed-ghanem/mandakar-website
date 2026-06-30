"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import logo from "@/public/assets/images/logoo.png";
import GlobeBtn from "./GlobeBtn";
import TranslateHook from "@/translate/TranslateHook";
import LangUseParams from "@/translate/LangUseParams";


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const lang = LangUseParams();
  const translate = TranslateHook();
 


  const navLinks = [
    { label: translate?.home?.navbar?.home, href: `/${lang}` },
    { label: translate?.home?.navbar?.about, href: `/${lang}` },
    { label: translate?.home?.navbar?.khutbas, href: `/${lang}` },
    { label: translate?.home?.navbar?.lessons, href: `/${lang}` },
    { label: translate?.home?.navbar?.lectures, href: `/${lang}` },
    { label: translate?.home?.navbar?.fatwas, href: `/${lang}` },
    { label: translate?.home?.navbar?.contactUs, href: `/${lang}/contact-us` },
  ];

  return (
    <header className="w-full">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="relative flex items-center justify-between mt-4 rounded-xl px-6 py-2
         bgTitleColorOpacity shadow-sm">
          {/* logo */}
          <Link href={`/${lang}`}>
            <Image
              src={logo}
              alt=""
              width={100}
             
            />
          </Link>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center gap-4 md:gap-5 text-sm lg:text-base">
            {navLinks.map((link, index) => (
              <Link
                key={`${link.label}-${index}`}
                href={link.href}
                className="hover:mainColor transition font-bold mainColor"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="w-9 h-9 rounded-full  flex items-center justify-center text-sm">
              <GlobeBtn />
            </div>
          </div>
 
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden flex flex-col gap-1"
          >
            <span className="w-6 h-0.5 scoundBgColor"></span>
            <span className="w-6 h-0.5 scoundBgColor"></span>
            <span className="w-6 h-0.5 scoundBgColor"></span>
          </button>

          {/* Mobile Dropdown */}
          {isOpen && (
            <div className="absolute top-full left-0 w-full bg-white shadow-md rounded-lg mt-3 p-4 flex flex-col gap-4 lg:hidden">
              {navLinks.map((link, index) => (
                <Link
                  key={`${link.label}-m-${index}`}
                  href={link.href}
                  className="font-bold mainColor"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* Actions inside mobile */}
              <div className="flex items-center gap-3 pt-3 border-t">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm">
                  <GlobeBtn />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
