"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Loader2, Pause } from "lucide-react";
import downloadIcon from "@/public/assets/images/download.svg";
import eyeIcon from "@/public/assets/images/eye.svg";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { ReuseBoxItem, ReuseBoxProps } from "./types";
import Image from "next/image";
import dynamic from "next/dynamic";
import playIcon from "@/public/assets/images/play.svg";
import {
  claimAudioPlayback,
  releaseAudioPlayback,
  stopAllAudioPlayback,
} from "./mediaPlayback";

const PdfViewer = dynamic(() => import("./PdfViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[85vh] items-center justify-center bg-[#525659]">
      <Loader2 className="h-10 w-10 animate-spin text-white" aria-hidden />
    </div>
  ),
});

const actionBtnClass = ` flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F5F3ED]
   text-[#9D732C] transition-colors hover:bg-[#E6D6C0] cursor-pointer `;

const formatAudioDuration = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds <= 0) return "00:00";

  const totalSeconds = Math.floor(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  return `${minutes}:${String(secs).padStart(2, "0")}`;
};

const getYoutubeEmbedUrl = (url: string) => {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]+)/,
  );
  const videoId = match?.[1] ?? url;
  const params = new URLSearchParams({
    autoplay: "1",
    enablejsapi: "1",
    playsinline: "1",
    rel: "0",
  });
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
};

const DownloadButton = ({
  href,
  ariaLabel = "تحميل",
}: {
  href: string;
  ariaLabel?: string;
}) => (
  <a
    href={href}
    download
    target="_blank"
    rel="noopener noreferrer"
    aria-label={ariaLabel}
    className={actionBtnClass + " p-2"}
  >
    <Image src={downloadIcon} alt="download" width={24} height={24} />
  </a>
);

const AudioPlayerBar = ({
  audioUrl,
  duration,
  progress = 0,
}: {
  audioUrl: string;
  duration?: string;
  progress?: number;
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(progress);
  const [totalDurationSec, setTotalDurationSec] = useState(0);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);

  const displayTime =
    isPlaying || currentTimeSec > 0
      ? formatAudioDuration(currentTimeSec)
      : totalDurationSec > 0
        ? formatAudioDuration(totalDurationSec)
        : (duration ?? "--:--");

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateDuration = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        setTotalDurationSec(audio.duration);
      }
    };

    updateDuration();
    audio.load();

    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("durationchange", updateDuration);
    audio.addEventListener("canplay", updateDuration);

    return () => {
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("durationchange", updateDuration);
      audio.removeEventListener("canplay", updateDuration);
    };
  }, [audioUrl]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      return;
    }

    claimAudioPlayback(audio);
    void audio.play().then(() => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        setTotalDurationSec(audio.duration);
      }
    });
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const bar = progressBarRef.current;
    if (!audio || !bar || !audio.duration) return;

    const rect = bar.getBoundingClientRect();
    const clickRatio = Math.min(
      1,
      Math.max(0, (rect.right - e.clientX) / rect.width),
    );

    audio.currentTime = clickRatio * audio.duration;
    setCurrentTimeSec(audio.currentTime);
    setCurrentProgress(clickRatio * 100);
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
        className="sr-only"
        onLoadedMetadata={(e) => {
          if (
            Number.isFinite(e.currentTarget.duration) &&
            e.currentTarget.duration > 0
          ) {
            setTotalDurationSec(e.currentTarget.duration);
          }
        }}
        onDurationChange={(e) => {
          if (
            Number.isFinite(e.currentTarget.duration) &&
            e.currentTarget.duration > 0
          ) {
            setTotalDurationSec(e.currentTarget.duration);
          }
        }}
        onPlay={(e) => {
          claimAudioPlayback(e.currentTarget);
          setIsPlaying(true);
        }}
        onPause={(e) => {
          releaseAudioPlayback(e.currentTarget);
          setIsPlaying(false);
        }}
        onEnded={(e) => {
          releaseAudioPlayback(e.currentTarget);
          setIsPlaying(false);
          setCurrentTimeSec(0);
          setCurrentProgress(0);
        }}
        onTimeUpdate={(e) => {
          const audio = e.currentTarget;
          setCurrentTimeSec(audio.currentTime);
          if (audio.duration) {
            setCurrentProgress((audio.currentTime / audio.duration) * 100);
          }
        }}
      />

      <div dir="ltr" className="  mx-auto mt-1.5 flex items-center gap-3">
        <span className="min-w-[42px] shrink-0 text-xs font-medium tabular-nums text-[#737373] sm:text-sm">
          {displayTime}
        </span>
        <div
          ref={progressBarRef}
          role="slider"
          aria-label="موضع التشغيل"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(currentProgress)}
          tabIndex={0}
          onClick={handleProgressClick}
          onKeyDown={(e) => {
            const audio = audioRef.current;
            if (!audio?.duration) return;

            if (e.key === "ArrowLeft") {
              audio.currentTime = Math.min(
                audio.duration,
                audio.currentTime + 5,
              );
            } else if (e.key === "ArrowRight") {
              audio.currentTime = Math.max(0, audio.currentTime - 5);
            }
          }}
          className="relative h-1.5 flex-1 cursor-pointer overflow-hidden rounded-full bg-[#E6D6C0]/40"
        >
          <div
            className="absolute top-0 right-0 h-full rounded-full bg-[#9D732C] transition-all"
            style={{
              width: `${Math.min(100, Math.max(0, currentProgress))}%`,
            }}
          />
        </div>
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? "إيقاف" : "تشغيل"}
          className={actionBtnClass}
        >
          {isPlaying ? (
            <Pause className="h-3.5 w-3.5 fill-current" />
          ) : (
            <Image src={playIcon} alt="play" width={20} height={20} />
          )}
        </button>
      </div>
    </>
  );
};

const PdfItemActions = ({
  downloadUrl,
  viewUrl,
  title,
}: Extract<ReuseBoxItem, { type: "pdf" }>) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="عرض"
          className={actionBtnClass}
        >
          <Image src={eyeIcon} alt="eye" width={20} height={20} />
        </button>
        <DownloadButton href={downloadUrl} />
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-h-[95vh] max-w-[95vw] gap-0 overflow-hidden p-0 pt-[50px] sm:max-w-6xl lg:max-w-7xl">
          <DialogTitle className="sr-only">{title}</DialogTitle>
          {isOpen && <PdfViewer url={viewUrl} />}
        </DialogContent>
      </Dialog>
    </>
  );
};

const VideoItemActions = ({
  youtubeUrl,
  title,
}: Extract<ReuseBoxItem, { type: "video" }>) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex shrink-0 items-center">
        <button
          type="button"
          onClick={() => {
            stopAllAudioPlayback();
            setIsOpen(true);
          }}
          aria-label="تشغيل الفيديو"
          className={actionBtnClass}
        >
          <Image src={playIcon} alt="play" width={20} height={20} />
        </button>
      </div>

      <Dialog
        open={isOpen}
       
        onOpenChange={(open) => {
          if (open) stopAllAudioPlayback();
          setIsOpen(open);
        }}
      >
        <DialogContent className="max-w-4xl gap-0 overflow-hidden p-10 sm:max-w-3xl">
          <DialogTitle className="sr-only">{title}</DialogTitle>
          <div className="relative aspect-video w-full">
            <iframe
              key={isOpen ? youtubeUrl : "closed"}
              src={isOpen ? getYoutubeEmbedUrl(youtubeUrl) : undefined}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const ReuseBoxItemRow = ({
  icon,
  iconsByType,
  showIconBackground,
  item,
}: {
  icon?: React.ReactNode;
  iconsByType?: ReuseBoxProps["iconsByType"];
  showIconBackground: boolean;
  item: ReuseBoxItem;
}) => {
  const { subtitle, title, subtitleHref, titleHref, type } = item;
  const resolvedIcon = iconsByType?.[type] ?? icon;

  return (
    <article className="flex flex-1 items-center gap-3 rounded-xl border border-[#E6D6C0]/40 bg-white p-3 shadow-sm sm:p-4">
      <div
        className={
          showIconBackground
            ? "flex h-11 w-11 shrink-0 items-center justify-center rounded-full scoundBgColor sm:h-12 sm:w-12"
            : "flex h-11 w-11 shrink-0 items-center justify-center sm:h-12 sm:w-12 m-4 ml-5"
        }
      >
        {resolvedIcon}
      </div>

      <div className="min-w-0 flex-1 text-right">
        {subtitleHref ? (
          <Link
            href={subtitleHref}
            className="inline-block text-xs font-medium scoundColor underline underline-offset-4 transition-colors hover:text-[#9D732C] sm:text-sm"
          >
            {subtitle}
          </Link>
        ) : (
          <p className="text-xs font-medium scoundColor sm:text-sm">
            {subtitle}
          </p>
        )}

        {titleHref ? (
          <Link
            href={titleHref}
            className="mt-0.5 line-clamp-2 block text-sm font-semibold leading-snug transition-colors hover:text-[#9D732C] sm:text-base"
          >
            {title}
          </Link>
        ) : (
          <h3 className="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug sm:text-base">
            {title}
          </h3>
        )}

        {type === "audio" && (
          <AudioPlayerBar
            audioUrl={item.audioUrl}
            duration={item.duration}
            progress={item.progress}
          />
        )}
      </div>

      <div className="flex shrink-0 items-center self-center">
        {type === "audio" && <DownloadButton href={item.downloadUrl} />}
        {type === "pdf" && <PdfItemActions {...item} />}
        {type === "video" && <VideoItemActions {...item} />}
      </div>
    </article>
  );
};

const ReuseBox = ({
  title,
  icon,
  iconsByType,
  showIconBackground = true,
  viewAllText = "عرض الكل",
  viewAllHref,
  items,
  className = "",
}: ReuseBoxProps) => {
  return (
    <section className={`flex h-full flex-col gap-3 p-0 md:p-4 ${className}`}>
      <div className="flex shrink-0 items-center justify-between gap-3">
        <h2 className="text-base font-bold sm:text-lg">{title}</h2>
        <Link
          href={viewAllHref}
          className="shrink-0 text-sm font-semibold scoundColor underline underline-offset-4 transition-colors hover:text-[#9D732C]"
        >
          {viewAllText}
        </Link>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3">
        {items.map((item) => (
          <ReuseBoxItemRow
            key={item.id}
            icon={icon}
            iconsByType={iconsByType}
            showIconBackground={showIconBackground}
            item={item}
          />
        ))}
      </div>
    </section>
  );
};

export default ReuseBox;
