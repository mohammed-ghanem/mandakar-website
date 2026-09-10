"use client";

import Image from "next/image";
import ReuseBox from "@/components/reusebox/ReuseBox";
import bookOpen from "@/public/assets/images/book.svg";
import videoIcon from "@/public/assets/images/videoIcon.svg";
import audio from "@/public/assets/images/audio.svg";
import fatwa from "@/public/assets/images/fatwa.svg";
import articles from "@/public/assets/images/articles.svg";
import books from "@/public/assets/images/books.png";
import qaph from "@/public/assets/images/qaph.svg";
import TranslateHook from "@/translate/TranslateHook";
import LangUseParams from "@/translate/LangUseParams";
import LastPublishedSkeleton from "@/components/skeletons/LastPublishedSkeleton";
import { useGetHomeLatestPublishedQuery } from "@/store/home/homeApi";

const LastPublished = () => {
  const translate = TranslateHook();
  const lang = LangUseParams();
  const homeTitles = translate?.home?.homeTitles;
  const { data, isLoading } = useGetHomeLatestPublishedQuery({
    lang: lang ?? "ar",
  });

  if (isLoading || !homeTitles) {
    return <LastPublishedSkeleton />;
  }

  const latest = data ?? {
    explanations: [],
    lectures: [],
    speeches: [],
    fatwas: [],
    articles: [],
    books: [],
  };

  return (
    <section className="pb-10 relative">
      <div className="pointer-events-none absolute top-[20%] right-0 z-10 hiddenmd:block">
        <Image
          src={qaph}
          alt=""
          width={170}
          height={100}
          className="h-auto w-24 md:w-32 lg:w-42.5"
        />
      </div>
      <div className="container mx-auto w-full md:w-[90%] max-w-7xl px-2 sm:px-4">
        <h2 className="mb-6 text-xl font-bold scoundColor sm:text-2xl">
          {homeTitles?.lastPublished}
        </h2>

        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
          <ReuseBox
            title={homeTitles?.scholarly}
            icon={<Image src={bookOpen} alt="" width={40} height={40} />}
            showIconBackground={true}
            viewAllText={homeTitles?.viewAll}
            viewAllHref={`/${lang}/scholarly`}
            items={latest.explanations}
          />
          <ReuseBox
            title={homeTitles?.lectures}
            icon={<Image src={videoIcon} alt="" width={30} height={30} />}
            showIconBackground={true}
            viewAllText={homeTitles?.viewAll}
            viewAllHref={`/${lang}/lectures`}
            items={latest.lectures}
          />
          <ReuseBox
            title={homeTitles?.khutbas}
            icon={<Image src={audio} alt="" width={30} height={30} />}
            showIconBackground={true}
            viewAllText={homeTitles?.viewAll}
            viewAllHref={`/${lang}/khutbas`}
            items={latest.speeches}
          />
          <ReuseBox
            title={homeTitles?.fatwas}
            icon={<Image src={fatwa} alt="" width={30} height={30} />}
            showIconBackground={true}
            viewAllText={homeTitles?.viewAll}
            viewAllHref={`/${lang}/fatwas`}
            items={latest.fatwas}
          />
          <ReuseBox
            title={homeTitles?.articles}
            icon={<Image src={articles} alt="" width={30} height={30} />}
            showIconBackground={true}
            viewAllText={homeTitles?.viewAll}
            viewAllHref={`/${lang}/articles`}
            items={latest.articles}
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
            viewAllHref={`/${lang}/books`}
            items={latest.books}
          />
        </div>
      </div>
    </section>
  );
};

export default LastPublished;
