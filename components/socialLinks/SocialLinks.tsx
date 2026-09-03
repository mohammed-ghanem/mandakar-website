"use client";

import Image from "next/image";
import {
  FacebookShareButton,
  XShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  EmailShareButton,
} from "react-share";
import TranslateHook from "@/translate/TranslateHook";
import facebook from "@/public/assets/images/facebook.svg";
import twitter from "@/public/assets/images/twitter.svg";
import mail from "@/public/assets/images/mail.svg";
import telegram from "@/public/assets/images/telegram.svg";
import whatsapp from "@/public/assets/images/whatsapp.svg";

const socialLinks = [
  { icon: telegram, Button: TelegramShareButton },
  { icon: mail, Button: EmailShareButton },
  { icon: whatsapp, Button: WhatsappShareButton },
  { icon: twitter, Button: XShareButton },
  { icon: facebook, Button: FacebookShareButton },
] as const;

const SocialLinks = ({ className = "" }: { className?: string }) => {
  const translate = TranslateHook();
  const url = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="mt-0.5 flex flex-wrap items-center gap-1">
      <p className="shrink-0 whitespace-nowrap">{translate.home.shareVia}</p>
      {socialLinks.map((item, index) => (
        <item.Button
          key={index}
          url={url}
          className="border-0 bg-transparent p-0"
        >
          <span
            className={`flex h-10 w-10 items-center justify-center border scoundBgColor ${className}`}
          >
            <Image
              src={item.icon}
              alt="icon"
              width={item.icon === facebook ? 10 : 20}
              height={item.icon === facebook ? 10 : 20}
            />
          </span>
        </item.Button>
      ))}
    </div>
  );
};

export default SocialLinks;
