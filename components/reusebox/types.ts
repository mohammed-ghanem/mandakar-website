import type { ReactNode } from "react";

export type ReuseBoxContentType = "audio" | "pdf" | "video";

type ReuseBoxItemBase = {
  id: string | number;
  subtitle: string;
  title: string;
  subtitleHref?: string;
  titleHref?: string;
};

export type ReuseBoxAudioItem = ReuseBoxItemBase & {
  type: "audio";
  audioUrl: string;
  downloadUrl: string;
  duration?: string;
  progress?: number;
};

export type ReuseBoxPdfItem = ReuseBoxItemBase & {
  type: "pdf";
  downloadUrl: string;
  viewUrl: string;
};

export type ReuseBoxVideoItem = ReuseBoxItemBase & {
  type: "video";
  youtubeUrl: string;
};

export type ReuseBoxItem =
  | ReuseBoxAudioItem
  | ReuseBoxPdfItem
  | ReuseBoxVideoItem;

export type ReuseBoxIconsByType = Partial<
  Record<ReuseBoxContentType, ReactNode>
>;

export type ReuseBoxProps = {
  title: string;
  /** Default icon for all items. Used when no type-specific icon is set. */
  icon?: ReactNode;
  /** Optional icons per item type (audio / pdf / video). */
  iconsByType?: ReuseBoxIconsByType;
  /** Circular background behind the icon. Defaults to true. */
  showIconBackground?: boolean;
  viewAllText?: string;
  viewAllHref: string;
  items: ReuseBoxItem[];
  className?: string;
};
