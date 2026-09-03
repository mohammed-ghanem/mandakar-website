import Image from "next/image";
import { cn } from "@/lib/utils";
import folderIcon from "@/public/assets/images/folder.svg";

type FolderBadgeProps = {
  size?: "sm" | "md";
  className?: string;
};

const FolderBadge = ({ size = "sm", className = "" }: FolderBadgeProps) => {
  const isMd = size === "md";
  const iconSize = isMd ? 24 : 20;

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full scoundBgColor",
        isMd ? "h-11 w-11 sm:h-12 sm:w-12" : "h-7 w-7 sm:h-8 sm:w-8",
        className,
      )}
      aria-hidden
    >
      <Image src={folderIcon} alt="" width={iconSize} height={iconSize} />
    </span>
  );
};

export default FolderBadge;
