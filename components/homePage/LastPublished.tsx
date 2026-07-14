"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ReuseBox from "@/components/reusebox/ReuseBox";
import bookOpen from "@/public/assets/images/book.svg";
import videoIcon from "@/public/assets/images/videoIcon.svg";
import sermons from "@/public/assets/images/sermons.svg";
import fatwa from "@/public/assets/images/fatwa.svg";
import articles from "@/public/assets/images/articles.svg";
import books from "@/public/assets/images/books.svg";
import qaph from "@/public/assets/images/qaph.svg";
import TranslateHook from "@/translate/TranslateHook";
import LastPublishedSkeleton from "@/components/skeletons/LastPublishedSkeleton";
import {
  scholarlyItems,
  lectureItems,
  sermonItems,
  fatwaItems,
  articleItems,
  bookItems,
} from "./TestData";

const LastPublished = () => {
  const translate = TranslateHook();
  const homeTitles = translate?.home?.homeTitles;
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady || !homeTitles) {
    return <LastPublishedSkeleton />;
  }

  return (
    <section className="pb-10 relative">
      <div className="pointer-events-none absolute top-[20%] right-0 z-10 hiddenmd:block">
        <Image
          src={qaph}
          alt=""
          width={170}
          height={100}
          className="h-auto w-24 md:w-32 lg:w-[170px]"
        />
      </div>
      <div className="container mx-auto w-full md:w-[90%] max-w-7xl px-2 sm:px-4">
        <h2 className="mb-6 text-xl font-bold scoundColor sm:text-2xl">
          {homeTitles?.lastPublished}
        </h2>

        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
          {/* Scholarly Items */}
          <ReuseBox
            title={homeTitles?.scholarly}
            icon={<Image src={bookOpen} alt="" width={40} height={40} />}
            showIconBackground={true}
            viewAllText={homeTitles?.viewAll}
            viewAllHref="/ar"
            items={scholarlyItems}
          />
          {/* Lectures */}
          <ReuseBox
            title={homeTitles?.lectures}
            icon={<Image src={videoIcon} alt="" width={30} height={30} />}
            showIconBackground={true}
            viewAllText={homeTitles?.viewAll}
            viewAllHref="/ar"
            items={lectureItems}
          />
          {/* Sermons */}
          <ReuseBox
            title={homeTitles?.khutbas}
            icon={<Image src={sermons} alt="" width={45} height={40} />}
            showIconBackground={true}
            viewAllText={homeTitles?.viewAll}
            viewAllHref="/ar"
            items={sermonItems}
          />
          {/* Fatwas */}
          <ReuseBox
            title={homeTitles?.fatwas}
            icon={<Image src={fatwa} alt="" width={30} height={30} />}
            showIconBackground={true}
            viewAllText={homeTitles?.viewAll}
            viewAllHref="/ar"
            items={fatwaItems}
          />
          {/* Articles */}
          <ReuseBox
            title={homeTitles?.articles}
            icon={<Image src={articles} alt="" width={30} height={30} />}
            showIconBackground={true}
            viewAllText={homeTitles?.viewAll}
            viewAllHref="/ar"
            items={articleItems}
          />
          {/* Books and Letters */}
          <ReuseBox
            title={homeTitles?.books}
            icon={
              <Image
                src={books}
                alt=""
                width={120}
                height={200}
                className="max-w-fit! bg-[#F7F2EA] p-0.5 py-4 rounded-lg"
              />
            }
            showIconBackground={false}
            viewAllText={homeTitles?.viewAll}
            viewAllHref="/ar"
            items={bookItems}
          />
        </div>
      </div>
    </section>
  );
};

export default LastPublished;
