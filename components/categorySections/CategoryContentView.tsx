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
import type { ScholarlyExplanationContent } from "@/store/scholarly/scholarlyApi";

const PdfViewer = dynamic(() => import("@/components/reusebox/PdfViewer"), {
  ssr: false,
});

const DEFAULT_SERIES_ITEMS_COUNT = 5;
const DEFAULT_RELATED_TOPICS_COUNT = 3;

const EMPTY_CONTENT_DATA: ScholarlyExplanationContent = {
  id: "empty",
  title: "",
  description: "",
  views: 0,
  previous: undefined,
  next: undefined,
  attachedFiles: [],
  externalLinks: [],
  series: [],
  relatedTopics: [],
};

const CARD = "rounded-2xl p-4 sm:p-5 ";
const HTML_DESCRIPTION_CLASS =
  "text-sm leading-8 grayColor sm:text-base [&_h1]:mb-4 [&_h1]:text-xl [&_h1]:font-bold [&_h1]:scoundColor [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:scoundColor [&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:text-base [&_h3]:font-bold [&_h3]:scoundColor [&_p]:mb-4 [&_p]:leading-8 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:ps-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:ps-6 [&_li]:mb-1 [&_a]:font-semibold [&_a]:scoundColor [&_a]:underline [&_a]:underline-offset-4 [&_strong]:font-bold [&_strong]:text-[#3f3e3e] [&_blockquote]:my-4 [&_blockquote]:border-s-4 [&_blockquote]:border-[#9d732c] [&_blockquote]:ps-4 [&_blockquote]:italic";

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
  if (!videoId) return "/assets/images/def.png";
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

type CategoryContentViewProps = {
  title?: string;
  content?: ScholarlyExplanationContent;
  pageKey?:
    | "scholarlyPage"
    | "lecturesPage"
    | "khutbasPage"
    | "fatwasPage"
    | "articlesPage"
    | "booksPage";
};

const CategoryContentView = ({
  title,
  content,
  pageKey = "scholarlyPage",
}: CategoryContentViewProps) => {
  const lang = LangUseParams();
  const translate = TranslateHook();
  const labels = translate.pages[pageKey].content;
  const data = content ?? EMPTY_CONTENT_DATA;
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
  const hasAudio = Boolean(data.audioUrl);
  const hasVideo = Boolean(data.youtubeUrl);
  const hasDescription = Boolean(data.description?.trim());
  const hasNavigation = Boolean(data.previous || data.next);
  const showNavigation = hasAudio && hasNavigation;
  const hasHtmlDescription = /<\/?[a-z][\s\S]*>/i.test(data.description ?? "");
  const hasFiles = Boolean(data.attachedFiles?.length);
  const hasLinks = Boolean(data.externalLinks?.length);
  const hasResources = hasFiles || hasLinks;
  const visibleSeriesItems = data.series.slice(0, DEFAULT_SERIES_ITEMS_COUNT);
  const hasSeries = Boolean(visibleSeriesItems.length);
  const visibleRelatedTopics = data.relatedTopics.slice(
    0,
    DEFAULT_RELATED_TOPICS_COUNT,
  );
  const hasRelatedTopics = Boolean(visibleRelatedTopics.length);
  const activeFilesTab = hasFiles ? filesTab : "links";

  const shortDescription =
    !hasHtmlDescription && (data.description?.length ?? 0) > 180
      ? `${data.description?.slice(0, 180)}…`
      : (data.description ?? "");

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
              {(data.views ?? 0).toLocaleString(lang === "ar" ? "ar" : "en")}
            </span>
            <span>{labels.views}</span>
          </p>
        </div>

        {(hasAudio || data.downloadUrl || showNavigation) && (
          <article className={CARD + " audioPlayerBg"}>
            {data.downloadUrl && (
              <div className="mb-4 flex flex-wrap items-center justify-end gap-3">
                <a
                  href={data.downloadUrl}
                  download
                  className="inline-flex shrink-0 items-center gap-2 rounded-lg scoundBgColor px-3 py-2 text-sm text-white"
                >
                  {labels.download}
                  <Download className="h-4 w-4" />
                </a>
              </div>
            )}

            {hasAudio && (
              <>
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
              </>
            )}

            {showNavigation && (
              <>
                {hasAudio && <hr className="my-4 border-[#E6D6C0]" />}
                <div className="mt-6 flex flex-col gap-4 text-sm font-semibold scoundColor sm:flex-row sm:items-start sm:justify-between sm:gap-2">
                  {data.previous ? (
                    <Link
                      href={`/${lang}${data.previous.href}`}
                      className="w-full transition-opacity hover:opacity-80 sm:w-auto"
                    >
                      <div className="flex w-full items-center justify-start gap-2 rounded-lg scoundBgColor px-3 py-2 text-sm text-white sm:inline-flex sm:w-auto">
                        <p className="flex items-center gap-2">
                          <ArrowRight className="h-4 w-4" />
                          {labels.previous}
                        </p>
                      </div>
                      <p className="mt-4">{data.previous.title}</p>
                    </Link>
                  ) : (
                    <div />
                  )}

                  {data.next ? (
                    <Link
                      href={`/${lang}${data.next.href}`}
                      className="w-full text-end transition-opacity hover:opacity-80 sm:w-auto"
                    >
                      <div className="flex w-full items-center justify-end gap-2 rounded-lg scoundBgColor px-3 py-2 text-sm text-white sm:inline-flex sm:w-auto">
                        <p className="flex items-center gap-2">
                          {labels.next}
                          <ArrowLeft className="h-4 w-4" />
                        </p>
                      </div>
                      <p className="mt-4">{data.next.title}</p>
                    </Link>
                  ) : (
                    <div />
                  )}
                </div>
              </>
            )}
          </article>
        )}

        {hasDescription && (
          <article className={CARD + " bg-white"}>
            {hasHtmlDescription ? (
              <div
                className={HTML_DESCRIPTION_CLASS}
                dir={lang === "ar" ? "rtl" : "ltr"}
                dangerouslySetInnerHTML={{ __html: data.description ?? "" }}
              />
            ) : (
              <p className="text-sm leading-8 grayColor sm:text-base">
                {isExpanded ? data.description : shortDescription}
              </p>
            )}
            {!hasHtmlDescription && (data.description?.length ?? 0) > 180 && (
              <button
                type="button"
                onClick={() => setIsExpanded((open) => !open)}
                className="mt-3 text-sm font-bold scoundColor"
              >
                {isExpanded ? labels.readLess : labels.readMore}
              </button>
            )}
          </article>
        )}

        {hasVideo && (
          <article className={`${CARD} overflow-hidden p-0 sm:p-0`}>
            {isVideoPlaying ? (
              <div className="aspect-video w-full">
                <iframe
                  src={getYoutubeEmbedUrl(data.youtubeUrl!)}
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
                  src={data.videoPoster || getYoutubeThumbnailUrl(data.youtubeUrl!)}
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
        )}

        {hasResources && (
          <div>
            {hasFiles && hasLinks && (
              <div
                role="tablist"
                className="mb-4 grid grid-cols-2 rounded-lg border border-[#E6D6C0] bg-white p-1"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeFilesTab === "files"}
                  onClick={() => setFilesTab("files")}
                  className={`rounded-lg py-2 text-sm font-bold sm:text-base ${
                    activeFilesTab === "files"
                      ? "categoryTabActiveBg text-white"
                      : "text-[#3f3e3e]"
                  }`}
                >
                  {labels.attachedFiles}
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeFilesTab === "links"}
                  onClick={() => setFilesTab("links")}
                  className={`rounded-lg py-2 text-sm font-bold sm:text-base ${
                    activeFilesTab === "links"
                      ? "categoryTabActiveBg text-white"
                      : "text-[#3f3e3e]"
                  }`}
                >
                  {labels.externalLinks}
                </button>
              </div>
            )}

            <article className={CARD}>
              <ul className="rounded-lg bg-white p-6 divide-y divide-[#E6D6C0]/70">
                {activeFilesTab === "files" && hasFiles
                  ? data.attachedFiles.map((file) => (
                      <li
                        key={file.id}
                        className="mb-0.5 flex items-center gap-3 bg-white p-4 py-3 first:pt-0 last:pb-0"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full scoundBgColor text-xs font-bold scoundColor">
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
                            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#F5F3ED]"
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
                        className="mb-0.5 flex items-center gap-3 bg-white p-4 py-3 first:pt-0 last:pb-0"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full scoundBgColor text-xs font-bold">
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
        )}

        {hasSeries && (
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
                <ul className="rounded-lg bg-white p-6 divide-y divide-[#E6D6C0]/70">
                  {visibleSeriesItems.map((item) => (
                    <li key={item.id} className="py-3 first:pt-0 last:pb-0">
                      <Link href={`/${lang}${item.href}`} className="flex items-center gap-3">
                        <Image
                          src={item.image || defaultImage}
                          alt=""
                          width={48}
                          height={48}
                          className="h-12 w-12 shrink-0 rounded-lg object-cover"
                        />
                        <span className="min-w-0 block text-sm font-semibold">
                          {item.title}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
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
          <SocialLinks
            className="rounded-full scoundBgColor"
            title={lessonTitle}
          />
        </div>

        {hasRelatedTopics && (
          <div>
            <h2 className="mb-4 text-base font-bold scoundColor sm:text-lg">
              {labels.relatedTopics}
            </h2>
            <ul className="space-y-4">
              {visibleRelatedTopics.map((topic) => (
                <li key={topic.id}>
                  <Link
                    href={`/${lang}${topic.href}`}
                    className="relative block overflow-hidden rounded-xl "
                  >
                    <Image
                      src={topic.image || defaultImage}
                      alt=""
                      width={600}
                      height={200}
                      className="w-full h-50 object-cover"
                    />
                    <span className="absolute inset-0 bg-linear-to-t from-black/80 via-black/50 to-transparent" />

                    <span className="absolute inset-x-3 bottom-3 text-sm font-bold text-white">
                      {topic.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
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
