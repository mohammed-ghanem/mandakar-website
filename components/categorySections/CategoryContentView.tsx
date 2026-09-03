"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ArrowLeft,
  ArrowRight,
  Download,
  ExternalLink,
  Pause,
} from "lucide-react";
import downloadIcon from "@/public/assets/images/download.svg";
import playIcon from "@/public/assets/images/play.svg";
import eyeIcon from "@/public/assets/images/eye.svg";

import defaultImage from "@/public/assets/images/def.png";
import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";
import SocialLinks from "@/components/socialLinks/SocialLinks";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  claimAudioPlayback,
  releaseAudioPlayback,
  stopAllAudioPlayback,
} from "@/components/reusebox/mediaPlayback";
import pdfIcon from "@/public/assets/images/pdf.svg";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const PdfViewer = dynamic(() => import("@/components/reusebox/PdfViewer"), {
  ssr: false,
});

/** Static test data — replace with API values later */
const CONTENT_TEST_DATA = {
  title: "الشريط الثاني من شرح الترمذي",
  audioUrl: "/assets/images/1.mp3",
  downloadUrl: "/assets/images/1.mp3",
  previous: {
    label: "الشريط الأول",
    href: "/scholarly/hadith/arbaeen/lesson-1",
  },
  next: {
    label: "الشريط الثالث",
    href: "/scholarly/hadith/arbaeen/lesson-3",
  },
  description:
    "الإخلاص في العمل هو أن يقصد العبد بعمله وجه الله تعالى وحده، لا رياء فيه ولا سمعة. ومن فقه طالب العلم أن يراجع نيته في طلبه وفي نشره، فإن العمل لا يُقبل إلا إذا كان خالصًا صوابًا. وهذه المادة تتناول أصول الإخلاص وعلاماته، مع التنبيه على آفات الرياء والعجب، وربط ذلك بما ورد في السنة من الحث على إصلاح السريرة وإتقان العمل.",
  youtubeUrl: "https://www.youtube.com/watch?v=Jf34HIvDKcI",
  videoPoster: "/assets/images/1.jpg",
  attachedFiles: [
    {
      id: 1,
      title: "فضل الدعاء في الأوقات المستحبة",
      href: "/assets/images/test.pdf",
    },
    {
      id: 2,
      title: "مختصر في آداب طالب العلم",
      href: "/assets/images/test.pdf",
    },
    {
      id: 3,
      title: "متن الأربعين النووية",
      href: "/assets/images/test.pdf",
    },
  ],
  externalLinks: [
    {
      id: 1,
      title: "مصدر المادة على يوتيوب",
      href: "https://www.youtube.com/watch?v=Jf34HIvDKcI",
    },
    {
      id: 2,
      title: "المرجع المعتمد للشرح",
      href: "https://example.com",
    },
  ],
  series: [
    {
      id: 1,
      tape: "الشريط الأول",
      title: "شرح كتاب مختصر في صفات النبي ﷺ وخلقه",
      href: "/scholarly/hadith/arbaeen/lesson-1",
      image: "/assets/images/1.jpg",
    },
    {
      id: 2,
      tape: "الشريط الثاني",
      title: "الشريط الثاني من شرح الترمذي",
      href: "/scholarly/hadith/arbaeen/lesson-2",
      image: "/assets/images/2.jpg",
    },
    {
      id: 3,
      tape: "الشريط الثالث",
      title: "تتمة أبواب العلم والعمل",
      href: "/scholarly/hadith/arbaeen/lesson-3",
      image: "/assets/images/3.png",
    },
  ],
  views: 1240,
  sheikhName: "الشيخ فلاح مندكار",
  relatedTopics: [
    {
      id: 1,
      category: "كتاب",
      title: "فضائل كلمة التوحيد",
      image: "/assets/images/1.jpg",
      href: "/scholarly/aqeedah/uluhiyyah",
    },
    {
      id: 2,
      category: "محاضرة",
      title: "شرح مقدمة أصول التفسير",
      image: "/assets/images/def.png",
      href: "/scholarly/quran/usul-tafsir/lesson-1",
    },
    {
      id: 3,
      category: "خطبة",
      title: "الإخلاص وأثره في العمل",
      image: "/assets/images/3.png",
      href: "/scholarly/aqeedah/tadmuriyyah",
    },
    {
      id: 4,
      category: "مقالة",
      title: "ضوابط الاجتهاد والتقليد",
      image: "/assets/images/4.png",
      href: "/scholarly/fiqh/ijtihad",
    },
  ],
};

const CARD = "rounded-2xl p-4 sm:p-5 ";

const formatAudioDuration = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds <= 0) return "00:00";
  const totalSeconds = Math.floor(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

const getYoutubeVideoId = (url: string) => {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]+)/,
  );
  return match?.[1] ?? null;
};

const getYoutubeEmbedUrl = (url: string) => {
  const videoId = getYoutubeVideoId(url) ?? url;
  const params = new URLSearchParams({
    autoplay: "1",
    enablejsapi: "1",
    playsinline: "1",
    rel: "0",
  });
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
};

const getYoutubeThumbnailUrl = (url: string) => {
  const videoId = getYoutubeVideoId(url);
  if (!videoId) return CONTENT_TEST_DATA.videoPoster;
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

type CategoryContentViewProps = {
  title?: string;
};

const CategoryContentView = ({ title }: CategoryContentViewProps) => {
  const lang = LangUseParams();
  const translate = TranslateHook();
  const labels = translate.pages.scholarlyPage.content;
  const data = CONTENT_TEST_DATA;
  const lessonTitle = title || data.title;
  const [isExpanded, setIsExpanded] = useState(false);
  const [filesTab, setFilesTab] = useState<"files" | "links">("files");
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [pdfPreview, setPdfPreview] = useState<{
    url: string;
    title: string;
  } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [totalDurationSec, setTotalDurationSec] = useState(0);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const shortDescription =
    data.description.length > 180
      ? `${data.description.slice(0, 180)}…`
      : data.description;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const updateDuration = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        setTotalDurationSec(audio.duration);
      }
    };
    audio.addEventListener("loadedmetadata", updateDuration);
    return () => audio.removeEventListener("loadedmetadata", updateDuration);
  }, [data.audioUrl]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      return;
    }
    claimAudioPlayback(audio);
    void audio.play();
  };

  const handleProgressClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const bar = progressBarRef.current;
    if (!audio || !bar || !audio.duration) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.min(
      1,
      Math.max(0, (event.clientX - rect.left) / rect.width),
    );
    audio.currentTime = ratio * audio.duration;
    setCurrentTimeSec(audio.currentTime);
    setCurrentProgress(ratio * 100);
  };

  const startVideo = () => {
    stopAllAudioPlayback();
    setIsVideoPlaying(true);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(240px,300px)]">
      <div className="min-w-0 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="min-w-0 flex-1 text-lg font-bold sm:text-xl">
            {lessonTitle}
          </h1>
          <p className="flex shrink-0 items-center gap-1.5 text-sm grayColor">
            <Image src={eyeIcon} alt="" width={16} height={16} />
            <span className="tabular-nums">
              {data.views.toLocaleString(lang === "ar" ? "ar" : "en")}
            </span>
            <span>{labels.views}</span>
          </p>
        </div>

        <article className={CARD + " audioPlayerBg"}>
          <div className="mb-4 flex flex-wrap items-center justify-end gap-3">
            <a
              href={data.downloadUrl}
              download
              className="inline-flex shrink-0 items-center gap-2 rounded-lg scoundBgColor px-3 
              py-2 text-sm  text-white"
            >
              {labels.download}
              <Download className="h-4 w-4" />
            </a>
          </div>

          <audio
            ref={audioRef}
            src={data.audioUrl}
            preload="metadata"
            className="sr-only"
            onPlay={(event) => {
              claimAudioPlayback(event.currentTarget);
              setIsPlaying(true);
            }}
            onPause={(event) => {
              releaseAudioPlayback(event.currentTarget);
              setIsPlaying(false);
            }}
            onEnded={(event) => {
              releaseAudioPlayback(event.currentTarget);
              setIsPlaying(false);
              setCurrentTimeSec(0);
              setCurrentProgress(0);
            }}
            onTimeUpdate={(event) => {
              const audio = event.currentTarget;
              setCurrentTimeSec(audio.currentTime);
              if (audio.duration) {
                setCurrentProgress((audio.currentTime / audio.duration) * 100);
              }
            }}
          />

          <div dir="ltr" className="flex items-center gap-3">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? labels.pause : labels.play}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F5F3ED] text-[#9D732C]"
            >
              {isPlaying ? (
                <Pause className="h-3.5 w-3.5 fill-current" />
              ) : (
                <Image src={playIcon} alt="" width={18} height={18} />
              )}
            </button>
            <span className="min-w-10.5 text-xs tabular-nums text-[#737373]">
              {formatAudioDuration(currentTimeSec)}
            </span>
            <div
              ref={progressBarRef}
              role="slider"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(currentProgress)}
              tabIndex={0}
              onClick={handleProgressClick}
              className="relative h-1.5 flex-1 cursor-pointer overflow-hidden rounded-full bg-[#E6D6C0]/50"
            >
              <div
                className="absolute top-0 left-0 h-full rounded-full bg-[#9D732C]"
                style={{
                  width: `${Math.min(100, Math.max(0, currentProgress))}%`,
                }}
              />
            </div>
            <span className="min-w-10.5 text-end text-xs tabular-nums text-[#737373]">
              {formatAudioDuration(totalDurationSec)}
            </span>
          </div>

          <hr className="my-4 border-[#E6D6C0]" />

          <div
            className="mt-6 flex flex-col gap-4 text-sm font-semibold scoundColor
            sm:flex-row sm:items-start sm:justify-between sm:gap-2"
          >
            <Link
              href={`/${lang}${data.previous.href}`}
              className="w-full transition-opacity hover:opacity-80 sm:w-auto"
            >
              <div
                className="flex w-full items-center justify-start
              gap-2 rounded-lg scoundBgColor px-3 py-2 text-sm text-white sm:inline-flex sm:w-auto"
              >
                <p className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  {labels.previous}
                </p>
              </div>
              <p className="mt-4">{data.previous.label}</p>
            </Link>
            <Link
              href={`/${lang}${data.next.href}`}
              className="w-full text-end transition-opacity hover:opacity-80 sm:w-auto"
            >
              <div
                className="flex w-full items-center justify-end
              gap-2 rounded-lg scoundBgColor px-3 py-2 text-sm text-white sm:inline-flex sm:w-auto"
              >
                <p className="flex items-center gap-2">
                  {labels.next}
                  <ArrowLeft className="h-4 w-4" />
                </p>
              </div>
              <p className="mt-4">{data.next.label}</p>
            </Link>
          </div>
        </article>

        <article className={CARD + " bg-white"}>
          <h2 className="mb-3 text-base font-bold scoundColor sm:text-lg">
            {labels.aboutLesson}
          </h2>
          <p className="text-sm leading-8 grayColor sm:text-base">
            {isExpanded ? data.description : shortDescription}
          </p>
          {data.description.length > 180 && (
            <button
              type="button"
              onClick={() => setIsExpanded((open) => !open)}
              className="mt-3 text-sm font-bold scoundColor"
            >
              {isExpanded ? labels.readLess : labels.readMore}
            </button>
          )}
        </article>

        <article className={`${CARD} overflow-hidden p-0 sm:p-0`}>
          {isVideoPlaying ? (
            <div className="aspect-video w-full">
              <iframe
                src={getYoutubeEmbedUrl(data.youtubeUrl)}
                title={lessonTitle}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={startVideo}
              className="relative block aspect-video w-full"
              aria-label={labels.play}
            >
              <Image
                src={getYoutubeThumbnailUrl(data.youtubeUrl)}
                alt=""
                fill
                className="object-cover"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                <span className="flex h-14 w-14 items-center justify-center rounded-full scoundBgColor">
                  <Image src={playIcon} alt="" width={28} height={28} />
                </span>
              </span>
            </button>
          )}
        </article>

        <div>
          <div
            role="tablist"
            className="mb-4 grid grid-cols-2 rounded-lg border border-[#E6D6C0] bg-white p-1"
          >
            <button
              type="button"
              role="tab"
              aria-selected={filesTab === "files"}
              onClick={() => setFilesTab("files")}
              className={`rounded-lg py-2 text-sm font-bold sm:text-base ${
                filesTab === "files"
                  ? "categoryTabActiveBg text-white"
                  : "text-[#3f3e3e]"
              }`}
            >
              {labels.attachedFiles}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={filesTab === "links"}
              onClick={() => setFilesTab("links")}
              className={`rounded-lg py-2 text-sm font-bold sm:text-base ${
                filesTab === "links"
                  ? "categoryTabActiveBg text-white"
                  : "text-[#3f3e3e]"
              }`}
            >
              {labels.externalLinks}
            </button>
          </div>

          <article className={CARD}>
            <ul className="divide-y divide-[#E6D6C0]/70 bg-white p-6 rounded-lg">
              {filesTab === "files"
                ? data.attachedFiles.map((file) => (
                    <li
                      key={file.id}
                      className="flex items-center gap-3 py-3 first:pt-0 last:pb-0 
                        p-4 bg-white mb-0.5"
                    >
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center
                       rounded-full scoundBgColor  text-xs font-bold scoundColor"
                      >
                        <Image src={pdfIcon} alt="pdf" width={22} height={22} />
                      </span>
                      <span className="min-w-0 flex-1 wrap-break-word text-sm font-semibold">
                        {file.title}
                      </span>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            setPdfPreview({ url: file.href, title: file.title })
                          }
                          aria-label="عرض"
                          className="flex h-9 w-9 items-center justify-center cursor-pointer rounded-full bg-[#F5F3ED]"
                        >
                          <Image src={eyeIcon} alt="" width={18} height={18} />
                        </button>
                        <a
                          href={file.href}
                          download
                          aria-label={labels.download}
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5F3ED]"
                        >
                          <Image
                            src={downloadIcon}
                            alt=""
                            width={16}
                            height={16}
                          />
                        </a>
                      </div>
                    </li>
                  ))
                : data.externalLinks.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center gap-3 py-3 first:pt-0 last:pb-0 p-4 bg-white mb-0.5"
                    >
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center
                       rounded-full scoundBgColor text-xs font-bold"
                      >
                        <ExternalLink className="h-4 w-4 text-white! stroke-white!" />
                      </span>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-w-0 flex-1 wrap-break-word text-sm font-semibold hover:underline underline-offset-4"
                      >
                        {item.title}
                      </a>
                    </li>
                  ))}
            </ul>
          </article>
        </div>

        <Accordion
          type="single"
          collapsible
          defaultValue="series"
          className={CARD}
        >
          <AccordionItem value="series" className="border-0">
            <AccordionTrigger className="py-1 text-base font-bold hover:no-underline scoundColor sm:text-lg">
              {labels.completeSeries}
            </AccordionTrigger>
            <AccordionContent className="pb-0 pt-3">
              <ul className="divide-y divide-[#E6D6C0]/70 bg-white p-6 rounded-lg">
                {data.series.map((item) => (
                  <li key={item.id} className="py-3 first:pt-0 last:pb-0">
                    <Link
                      href={`/${lang}${item.href}`}
                      className="flex items-center gap-3"
                    >
                      <Image
                        src={item.image}
                        alt=""
                        width={48}
                        height={48}
                        className="h-12 w-12 shrink-0 rounded-lg object-cover"
                      />
                      <span className="min-w-0">
                        <span className="block text-xs scoundColor">
                          {item.tape}
                        </span>
                        <span className="block text-sm font-semibold">
                          {item.title}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <aside className="space-y-5">
        <article className={`${CARD} flex flex-col items-center py-8`}>
          <Image
            src={defaultImage}
            alt=""
            width={380}
            height={140}
            className="h-auto w-full"
          />
        </article>

        <div className="flex justify-center">
          <SocialLinks className="rounded-full scoundBgColor" />
        </div>

        <div>
          <h2 className="mb-4 text-base font-bold scoundColor sm:text-lg">
            {labels.relatedTopics}
          </h2>
          <ul className="space-y-4">
            {data.relatedTopics.map((topic) => (
              <li key={topic.id}>
                <Link
                  href={`/${lang}${topic.href}`}
                  className="relative block overflow-hidden rounded-xl "
                >
                  <Image
                    src={topic.image}
                    alt=""
                    width={600}
                    height={200}
                    className="w-full h-50 object-cover"
                  />
                  {/* overlay */}
                  <span
                    className="absolute inset-0 bg-linear-to-t from-black/80 via-black/50
                   to-transparent"
                  />

                  <span className="absolute inset-x-3 bottom-3 text-sm font-bold text-white">
                    {topic.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <Dialog open={!!pdfPreview} onOpenChange={() => setPdfPreview(null)}>
        <DialogContent className="max-h-[95vh] max-w-[95vw] gap-0 overflow-hidden p-0 pt-12.5 sm:max-w-6xl lg:max-w-7xl">
          <DialogTitle className="sr-only">{pdfPreview?.title}</DialogTitle>
          {pdfPreview && <PdfViewer url={pdfPreview.url} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryContentView;
