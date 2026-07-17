"use client";

import { useEffect, useState } from "react";
import ReuseBox from "../reusebox/ReuseBox";
import Image from "next/image";
import bookOpen from "@/public/assets/images/book.svg";
import audio from "@/public/assets/images/audio.svg";
import videoIcon from "@/public/assets/images/videoIcon.svg";
import articles from "@/public/assets/images/articles.svg";
import books from "@/public/assets/images/books.png";
import TranslateHook from "@/translate/TranslateHook";
import MoreWatchedSkeleton from "@/components/skeletons/MoreWatchedSkeleton";
import {
  mostWatchedAudioVisualItems,
  mostWatchedReadingItems,
} from "./TestData";

const MoreWatched = () => {
  const translate = TranslateHook();
  const homeTitles = translate?.home?.homeTitles;
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady || !homeTitles) {
    return <MoreWatchedSkeleton />;
  }

  return (
    <section className="relative overflow-hidden py-10">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15"
        style={{
          backgroundImage: 'url("/assets/images/bgwatched.webp")',
        }}
      />

      <div className="relative z-10 container mx-auto w-full md:w-[90%] max-w-7xl px-2 sm:px-4">
        <h2 className="mb-6 text-xl font-bold scoundColor sm:text-2xl">
          {homeTitles?.moreWatched}
        </h2>

        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
          <div className="flex h-full min-h-0 flex-col">
            <ReuseBox
              title={homeTitles?.audioVisual}
              iconsByType={{
                audio: <Image src={audio} alt="" width={30} height={30} />,
                video: <Image src={videoIcon} alt="" width={30} height={30} />,
              }}
              showIconBackground={true}
              viewAllText={homeTitles?.viewAll}
              viewAllHref="/ar"
              items={mostWatchedAudioVisualItems}
              className="h-full"
            />
          </div>
          <div className="flex h-full min-h-0 flex-col gap-6">
            <ReuseBox
              title={homeTitles?.articles}
              icon={<Image src={articles} alt="" width={30} height={30} />}
              showIconBackground={true}
              viewAllText={homeTitles?.viewAll}
              viewAllHref="/ar"
              items={mostWatchedReadingItems}
            />
            <ReuseBox
              title={homeTitles?.books}
              icon={
                <Image
                  src={books}
                  alt=""
                  width={80}
                  height={80}
                  className="max-w-fit! py-7 my-4 p-0.5 rounded-lg"
                />
              }
              showIconBackground={false}
              viewAllText={homeTitles?.viewAll}
              viewAllHref="/ar"
              items={mostWatchedReadingItems}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MoreWatched;
