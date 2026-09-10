"use client";

import { useEffect, useState } from "react";
import CarouselComponent from "../carousel/CarouselComponent";
import Image from "next/image";
import Link from "next/link";
import qaph from "@/public/assets/images/qaph.svg";
import TranslateHook from "@/translate/TranslateHook";
import LangUseParams from "@/translate/LangUseParams";
import HeroSectionSkeleton from "@/components/skeletons/HeroSectionSkeleton";
import { getCarouselItemsPerView } from "./carouselBreakpoints";
import { useGetHomeBannersQuery } from "@/store/home/homeApi";
import defaultImage from "@/public/assets/images/def.png";

const TITLE_MAX_CHARS = 30;
const DESCRIPTION_MAX_CHARS = 40;

const truncateText = (text: string, max: number) =>
  text.length > max ? `${text.slice(0, max).trimEnd()}  …` : text;

export const HeroSection = () => {
  const translate = TranslateHook();
  const lang = LangUseParams();
  const hero = translate?.home?.hero;
  const [itemsPerView, setItemsPerView] = useState<number | null>(null);
  const { data: banners = [], isLoading, isError } = useGetHomeBannersQuery({
    lang: lang ?? "ar",
  });

  useEffect(() => {
    const updateItemsPerView = () => {
      setItemsPerView(getCarouselItemsPerView(window.innerWidth));
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  if (itemsPerView === null || isLoading) {
    return <HeroSectionSkeleton />;
  }

  const slider = banners.map((item) => (
    <Link
      key={item.id}
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative block h-full w-full overflow-hidden rounded-lg"
    >
      <div className="overlay pointer-events-none absolute inset-0 z-5 bg-black/50" />
      <Image
        src={item.image || defaultImage}
        alt={item.title || "banner"}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 25vw"
        draggable={false}
      />
      {item.categoryLabel ? (
        <span className="absolute top-1.5 left-1.5 z-10 rounded-2xl border border-white/50 bg-black/20 px-1.5 py-0.5 text-[10px] font-semibold text-white sm:top-2 sm:left-2 sm:px-2 sm:py-1 sm:text-xs md:text-sm">
          {item.categoryLabel}
        </span>
      ) : null}
      <h2
        dir="rtl"
        className="absolute inset-x-1.5 bottom-7 z-10 text-right text-xs font-semibold text-white sm:inset-x-2 sm:bottom-9 sm:text-sm md:bottom-10 md:text-base"
      >
        {truncateText(item.title, TITLE_MAX_CHARS)}
      </h2>
      {item.description ? (
        <p
          dir="rtl"
          className="absolute inset-x-1.5 bottom-2 z-10 text-right text-[10px] font-medium text-white sm:inset-x-2 sm:bottom-3 sm:text-xs md:bottom-4 md:text-sm"
        >
          {truncateText(item.description, DESCRIPTION_MAX_CHARS)}
        </p>
      ) : null}
    </Link>
  ));

  return (
    <div className="relative pb-8 sm:pb-10">
      <div className="pointer-events-none absolute -top-16 left-2 z-10 hidden sm:block md:-top-24 md:left-6 lg:-top-35 lg:left-15">
        <Image
          src={qaph}
          alt=""
          width={170}
          height={100}
          className="h-auto w-24 md:w-32 lg:w-42.5"
        />
      </div>

      <div className="container mx-auto w-[90%] max-w-7xl px-2 pt-8 sm:px-4 sm:pt-12 md:pt-15">
        <div className="mb-6 sm:mb-8 md:mb-10">
          <h1 className="text-xl font-bold scoundColor sm:text-2xl">
            {hero?.title}
          </h1>
          <p className="mt-1 text-sm font-medium grayColor sm:mt-2 sm:text-base">
            {hero?.description}
          </p>
        </div>

        {banners.length > 0 ? (
          <CarouselComponent
            key={itemsPerView}
            items={slider}
            height="h-[180px] sm:h-[190px] md:h-[200px]"
            autoplay={true}
            interval={5000}
            showArrows={false}
            showDots={false}
            itemsPerView={itemsPerView}
            pauseOnHover={true}
            enableDrag={true}
            cardClassName="border-0 bg-transparent p-0 shadow-none"
            cardContentClassName="flex items-center justify-center p-0 px-0"
          />
        ) : isError ? (
          <p className="py-8 text-center text-sm grayColor">
            {translate?.pages?.lecturesPage?.notFound || "تعذر تحميل البنرات"}
          </p>
        ) : null}
      </div>
    </div>
  );
};
