"use client";

import { useEffect, useState } from "react";
import CarouselComponent from "../carousel/CarouselComponent";
import banner1 from "@/public/assets/images/1.jpg";
import banner2 from "@/public/assets/images/2.jpg";
import banner3 from "@/public/assets/images/3.png";
import banner4 from "@/public/assets/images/4.png";
import Image from "next/image";
import Link from "next/link";
import qaph from "@/public/assets/images/qaph.svg";
import TranslateHook from "@/translate/TranslateHook";

const getItemsPerView = (width: number) => {
  if (width < 640) return 1;
  if (width < 768) return 2;
  if (width < 1024) return 3;
  return 4;
};

export const HeroSection = () => {
  const translate = TranslateHook();
  const hero = translate?.home?.hero;
  const [itemsPerView, setItemsPerView] = useState(4);

  useEffect(() => {
    const updateItemsPerView = () => {
      setItemsPerView(getItemsPerView(window.innerWidth));
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  const items = [
    { id: 1, img: banner1 },
    { id: 2, img: banner2 },
    { id: 3, img: banner3 },
    { id: 4, img: banner4 },
    { id: 5, img: banner3 },
  ];

  const slider = items.map((item) => (
    <Link
      key={item.id}
      href=""
      className="relative block h-full w-full overflow-hidden rounded-lg"
    >
      <div className="overlay absolute inset-0 z-5 bg-black/50" />
      <Image
        src={item.img}
        alt={`Slide ${item.id}`}
        className="h-full w-full object-cover"
        draggable={false}
      />
      <span
        className="absolute top-1.5 left-1.5 z-10 rounded-2xl border border-white/50 bg-black/20 px-1.5 py-0.5 text-[10px] font-semibold text-white sm:top-2 sm:left-2 sm:px-2 sm:py-1 sm:text-xs md:text-sm"
      >
        الخطب
      </span>
      <h2 className="absolute right-1.5 bottom-7 z-10 line-clamp-1 text-xs font-semibold text-white sm:right-2 sm:bottom-9 sm:text-sm md:bottom-10 md:text-base">
        الخطب النبوية المثمنة
      </h2>
      <p className="absolute right-1.5 bottom-2 z-10 line-clamp-1 text-[10px] font-medium text-white sm:right-2 sm:bottom-3 sm:text-xs md:bottom-4 md:text-sm">
        خطبة من القرآن الكريم والسنة النبوية الشريفة
      </p>
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
          className="h-auto w-24 md:w-32 lg:w-[170px]"
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
          enableDrag={false}
          cardClassName="border-0 bg-transparent p-0 shadow-none"
          cardContentClassName="flex items-center justify-center p-0 px-0"
        />
      </div>
    </div>
  );
};
