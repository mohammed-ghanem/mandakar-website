"use client";

import { useEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import TranslateHook from "@/translate/TranslateHook";
import { cn } from "@/lib/utils";
import bookOpen from "@/public/assets/images/book.svg";
import videoIcon from "@/public/assets/images/videoIcon.svg";
import audio from "@/public/assets/images/audio.svg";
import fatwa from "@/public/assets/images/fatwa.svg";
import articles from "@/public/assets/images/articles.svg";
import down from "@/public/assets/images/down.svg";
import visite from "@/public/assets/images/visite.svg";

type StatKey =
  | "scholarly"
  | "lectures"
  | "khutbas"
  | "fatwas"
  | "articles"
  | "books"
  | "attachments"
  | "visits";

/** Static test data — replace with API values later */
const statisticsTestData: {
  key: StatKey;
  value: number;
  icon: StaticImageData;
  iconSize?: number;
  className?: string;
}[] = [
  { key: "scholarly", value: 128, icon: bookOpen, iconSize: 40 },
  { key: "lectures", value: 86, icon: videoIcon, iconSize: 32 },
  { key: "khutbas", value: 64, icon: audio, iconSize: 32 },
  { key: "fatwas", value: 210, icon: fatwa, iconSize: 32 },
  { key: "articles", value: 97, icon: articles, iconSize: 28 },
  { key: "books", value: 45, icon: bookOpen, iconSize: 40 },
  { key: "attachments", value: 532, icon: down, iconSize: 32 },
  { key: "visits", value: 9840, icon: visite, iconSize: 30 },
];

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const useCountUp = (target: number, active: boolean, durationMs = 1400) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) {
      setCount(0);
      return;
    }

    let frameId = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs);
      setCount(Math.round(target * easeOutCubic(progress)));
      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [active, durationMs, target]);

  return count;
};

const StatCard = ({
  label,
  value,
  icon,
  iconSize = 24,
  active,
  className = "mt-4 mx-2 mb-2",
}: {
  label: string;
  value: number;
  icon: StaticImageData;
  iconSize?: number;
  active: boolean;
  className?: string;
}) => {
  const count = useCountUp(value, active);

  return (
    <article
      className={cn(
        "flex items-center gap-3 rounded-xl bg-[#F5F3ED] px-3 py-3 sm:gap-4 sm:px-4 sm:py-4",
        className,
      )}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full scoundBgColor sm:h-14 sm:w-14">
        <Image
          src={icon}
          alt=""
          width={iconSize}
          height={iconSize}
          className="object-contain"
        />
      </div>
      <div className="min-w-0 text-right">
        <p className="text-xl font-bold tabular-nums leading-none scoundColor sm:text-2xl">
          {count.toLocaleString()}
        </p>
        <p className="mt-1 truncate text-base font-medium grayColor">{label}</p>
      </div>
    </article>
  );
};

const Statistics = () => {
  const translate = TranslateHook();
  const stats = translate?.home?.statistics;
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="pb-12 pt-4 sm:pb-16">
      <div className="container mx-auto w-full max-w-7xl px-2 sm:px-4 md:w-[90%]">
        <h2 className="my-6 text-xl font-bold scoundColor sm:text-2xl">
          {stats?.title}
        </h2>

        <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-6 md:p-8">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            {statisticsTestData.map((item) => (
              <StatCard
                key={item.key}
                label={stats?.[item.key] ?? ""}
                value={item.value}
                icon={item.icon}
                iconSize={item.iconSize}
                active={isVisible}
                className={item.className}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Statistics;
