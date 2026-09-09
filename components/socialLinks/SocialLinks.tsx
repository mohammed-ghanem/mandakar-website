"use client";

import { useEffect, useState } from "react";
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

type SocialLinksProps = {
  className?: string;
  iconClassName?: string;
  showLabel?: boolean;
  wrapperClassName?: string;
  withDefaultBackground?: boolean;
  url?: string;
  title?: string;
};

const SocialLinks = ({
  className = "",
  iconClassName = "scoundBgColor",
  showLabel = true,
  wrapperClassName = "",
  withDefaultBackground = true,
  url,
  title = "",
}: SocialLinksProps) => {
  const translate = TranslateHook();
  const [shareUrl, setShareUrl] = useState(url ?? "");

  useEffect(() => {
    if (url) {
      setShareUrl(url);
      return;
    }
    setShareUrl(window.location.href);
  }, [url]);

  if (!shareUrl) return null;

  const iconWrapClass = `flex h-10 w-10 items-center justify-center border ${
    withDefaultBackground ? "scoundBgColor" : ""
  } ${className} ${iconClassName}`;

  return (
    <div
      className={`mt-0.5 flex flex-wrap items-center gap-1 ${wrapperClassName}`}
    >
      {showLabel && (
        <p className="shrink-0 whitespace-nowrap">{translate.home.shareVia}</p>
      )}

      <TelegramShareButton
        url={shareUrl}
        title={title}
        className="border-0 bg-transparent p-0"
      >
        <span className={iconWrapClass}>
          <Image src={telegram} alt="Telegram" width={20} height={20} />
        </span>
      </TelegramShareButton>

      <EmailShareButton
        url={shareUrl}
        subject={title}
        body={title ? `${title}\n${shareUrl}` : shareUrl}
        className="border-0 bg-transparent p-0"
      >
        <span className={iconWrapClass}>
          <Image src={mail} alt="Email" width={20} height={20} />
        </span>
      </EmailShareButton>

      <WhatsappShareButton
        url={shareUrl}
        title={title}
        separator=" - "
        className="border-0 bg-transparent p-0"
      >
        <span className={iconWrapClass}>
          <Image src={whatsapp} alt="WhatsApp" width={20} height={20} />
        </span>
      </WhatsappShareButton>

      <XShareButton
        url={shareUrl}
        title={title}
        className="border-0 bg-transparent p-0"
      >
        <span className={iconWrapClass}>
          <Image src={twitter} alt="X" width={20} height={20} />
        </span>
      </XShareButton>

      <FacebookShareButton
        url={shareUrl}
        className="border-0 bg-transparent p-0"
      >
        <span className={iconWrapClass}>
          <Image src={facebook} alt="Facebook" width={10} height={20} />
        </span>
      </FacebookShareButton>
    </div>
  );
};

export default SocialLinks;
