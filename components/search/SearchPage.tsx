"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ReuseBox from "@/components/reusebox/ReuseBox";
import SearchPageSkeleton from "@/components/skeletons/SearchPageSkeleton";
import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";
import { useGetHomeSearchQuery } from "@/store/home/homeApi";
import bookOpen from "@/public/assets/images/book.svg";
import videoIcon from "@/public/assets/images/videoIcon.svg";
import audio from "@/public/assets/images/audio.svg";
import fatwa from "@/public/assets/images/fatwa.svg";
import articles from "@/public/assets/images/articles.svg";
import books from "@/public/assets/images/books.png";

const SearchPage = () => {
  const lang = LangUseParams();
  const translate = TranslateHook();
  const searchParams = useSearchParams();
  const page = translate?.pages?.searchPage;
  const homeTitles = translate?.home?.homeTitles;
  const homeLabel = translate?.home?.navbar?.home;
  const q = (searchParams.get("q") ?? "").trim();

  const { data, isLoading, isError, isFetching } = useGetHomeSearchQuery(
    { lang: lang ?? "ar", q },
    { skip: !q },
  );

  if (!page || (q && (isLoading || (isFetching && !data)))) {
    return <SearchPageSkeleton />;
  }

  const sections = [
    {
      key: "explanations",
      title: homeTitles?.scholarly,
      href: `/${lang}/scholarly`,
      items: data?.explanations ?? [],
      icon: <Image src={bookOpen} alt="" width={40} height={40} />,
      showIconBackground: true,
    },
    {
      key: "lectures",
      title: homeTitles?.lectures,
      href: `/${lang}/lectures`,
      items: data?.lectures ?? [],
      icon: <Image src={videoIcon} alt="" width={30} height={30} />,
      showIconBackground: true,
    },
    {
      key: "speeches",
      title: homeTitles?.khutbas,
      href: `/${lang}/khutbas`,
      items: data?.speeches ?? [],
      icon: <Image src={audio} alt="" width={30} height={30} />,
      showIconBackground: true,
    },
    {
      key: "fatwas",
      title: homeTitles?.fatwas,
      href: `/${lang}/fatwas`,
      items: data?.fatwas ?? [],
      icon: <Image src={fatwa} alt="" width={30} height={30} />,
      showIconBackground: true,
    },
    {
      key: "articles",
      title: homeTitles?.articles,
      href: `/${lang}/articles`,
      items: data?.articles ?? [],
      icon: <Image src={articles} alt="" width={30} height={30} />,
      showIconBackground: true,
    },
    {
      key: "books",
      title: homeTitles?.books,
      href: `/${lang}/books`,
      items: data?.books ?? [],
      icon: (
        <Image
          src={books}
          alt=""
          width={80}
          height={80}
          className="max-w-fit! py-7 my-4 p-0.5 rounded-lg"
        />
      ),
      showIconBackground: false,
    },
  ].filter((section) => section.items.length > 0);

  const total = data?.total ?? 0;
  const queryLabel = data?.query || q;

  return (
    <section className="bkMainColor pb-12 pt-6 sm:pb-16 sm:pt-8">
      <div className="bgNavbarColor">
        <nav
          aria-label="breadcrumb"
          className="container mx-auto mb-6 flex w-[80%] flex-wrap items-center gap-2 py-2 text-sm font-semibold sm:mb-8 sm:text-xs"
        >
          <Link href={`/${lang}`}>{homeLabel}</Link>
          <span aria-hidden>{">"}</span>
          <span>{page.title}</span>
        </nav>
      </div>

      <div className="container mx-auto w-full max-w-7xl px-2 sm:px-4 md:w-[90%]">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl font-bold scoundColor sm:text-2xl">
            {page.title}
          </h1>
          {q ? (
            <p className="mt-2 text-sm text-gray-600 sm:text-base">
              {page.resultsFor}{" "}
              <span className="font-semibold scoundColor">
                &ldquo;{queryLabel}&rdquo;
              </span>
              {total > 0 ? (
                <span className="ms-2 text-gray-500">
                  ({total} {page.resultsCount})
                </span>
              ) : null}
            </p>
          ) : (
            <p className="mt-2 text-sm text-gray-600 sm:text-base">
              {page.emptyQuery}
            </p>
          )}
        </div>

        {!q ? null : isError ? (
          <div className="rounded-2xl bg-white p-6 text-center [box-shadow:1px_1px_1px_#9d732c] sm:p-8">
            <p className="font-semibold scoundColor">{page.error}</p>
          </div>
        ) : sections.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 text-center [box-shadow:1px_1px_1px_#9d732c] sm:p-8">
            <p className="font-semibold scoundColor">{page.empty}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {sections.map((section) => (
              <article
                key={section.key}
                className="rounded-2xl bg-white p-3 [box-shadow:1px_1px_1px_#9d732c] sm:p-4 md:p-6"
              >
                <ReuseBox
                  title={section.title ?? ""}
                  icon={section.icon}
                  showIconBackground={section.showIconBackground}
                  viewAllText={homeTitles?.viewAll}
                  viewAllHref={section.href}
                  items={section.items}
                />
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchPage;
