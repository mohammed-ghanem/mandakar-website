import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import folderIcon from "@/public/assets/images/folder.svg";

type CategoryLinkProps = {
  title: string;
  href?: string;
  size?: "sm" | "md";
  className?: string;
  titleClassName?: string;
};

const CategoryLink = ({
  title,
  href,
  size = "sm",
  className = "",
  titleClassName = "",
}: CategoryLinkProps) => {
  const isMd = size === "md";
  const iconSize = isMd ? 24 : 20;
  const content = (
    <>
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full scoundBgColor",
          isMd ? "h-11 w-11 sm:h-12 sm:w-12" : "h-8 w-8 sm:h-9 sm:w-9",
        )}
        aria-hidden
      >
        <Image
          src={folderIcon}
          alt="folder icon"
          width={iconSize}
          height={iconSize}
        />
      </span>
      <span
        className={cn(
          isMd
            ? "text-lg font-bold mainColor sm:text-xl"
            : "text-sm font-semibold scoundColor border-b border-[#9F854E] pb-2 sm:text-base",
          titleClassName,
        )}
      >
        {title}
      </span>
    </>
  );

  const sharedClass = cn("inline-flex min-w-0 items-center gap-2", className);

  if (href) {
    return (
      <Link
        href={href}
        className={cn(sharedClass, "transition-opacity hover:opacity-80")}
      >
        {content}
      </Link>
    );
  }

  return <div className={sharedClass}>{content}</div>;
};

export default CategoryLink;
