"use client";

import { useEffect, useState } from "react";
import ReuseBox from "../reusebox/ReuseBox";
import Image from "next/image";
import bookOpen from "@/public/assets/images/book.svg";
import audio from "@/public/assets/images/audio.svg";
import videoIcon from "@/public/assets/images/videoIcon.svg";
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
          />
          <ReuseBox
            title={homeTitles?.readingItems}
            icon={<Image src={bookOpen} alt="" width={40} height={40} />}
            showIconBackground={true}
            viewAllText={homeTitles?.viewAll}
            viewAllHref="/ar"
            items={mostWatchedReadingItems}
          />
        </div>
      </div>
    </section>
  );
};

export default MoreWatched;
