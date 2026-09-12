import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const CARD_SHADOW = "[box-shadow:1px_1px_1px_#9d732c]";
export const HEADER_SHADOW = "[box-shadow:0px_0px_2px_#9d732c]";

export const CategoryBreadcrumbBarSkeleton = ({
  crumbs = 2,
}: {
  crumbs?: number;
}) => (
  <div className="bgNavbarColor">
    <div className="container mx-auto mb-6 flex w-[80%] items-center gap-2 py-2 sm:mb-8">
      {Array.from({ length: crumbs }).map((_, index) => (
        <span key={index} className="flex items-center gap-2">
          {index > 0 && <Skeleton className="h-3 w-2" />}
          <Skeleton className={index === 0 ? "h-4 w-14" : "h-4 w-28"} />
        </span>
      ))}
    </div>
  </div>
);

export const CategoryLinkRowSkeleton = ({
  className = "",
}: {
  className?: string;
}) => (
  <div className={cn("inline-flex min-w-0 items-center gap-2", className)}>
    <Skeleton className="h-8 w-8 shrink-0 rounded-full sm:h-9 sm:w-9" />
    <div className="min-w-0 space-y-2">
      <Skeleton className="h-4 w-28 sm:h-[1.125rem] sm:w-36" />
      <Skeleton className="h-px w-28 sm:w-36" />
    </div>
  </div>
);

export const CategoryPageHeaderSkeleton = () => (
  <div
    className={cn(
      "mb-5 flex items-center rounded-xl bg-white px-4 py-3 sm:mb-6 sm:px-6 sm:py-4",
      HEADER_SHADOW,
    )}
  >
    <Skeleton className="h-6 w-48 sm:h-7 sm:w-72" />
  </div>
);

export const CategoryTabsSkeleton = () => (
  <div className="mb-6 mx-auto grid w-[80%] grid-cols-2 rounded-lg border border-[#E6D6C0] bg-white p-1">
    <Skeleton className="h-9 rounded-lg sm:h-10" />
    <div className="h-9 sm:h-10" />
  </div>
);
