import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  CARD_SHADOW,
  CategoryBreadcrumbBarSkeleton,
  CategoryLinkRowSkeleton,
  CategoryPageHeaderSkeleton,
  CategoryTabsSkeleton,
} from "./categorySkeletonParts";

type CategoryDetailSkeletonProps = {
  variant?: "tabs" | "boxes" | "topics" | "content";
};

const BoxCardSkeleton = () => (
  <article
    className={cn(
      "flex h-72 flex-col items-start rounded-2xl bg-white p-4",
      CARD_SHADOW,
    )}
  >
    <Skeleton className="mb-2 h-8 w-10" />
    <Skeleton className="mb-4 h-5 w-36" />
    <div className="w-full space-y-3">
      <CategoryLinkRowSkeleton />
      <CategoryLinkRowSkeleton />
      <CategoryLinkRowSkeleton />
      <CategoryLinkRowSkeleton />
    </div>
  </article>
);

const BoxesGridSkeleton = () => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {Array.from({ length: 4 }).map((_, index) => (
      <BoxCardSkeleton key={index} />
    ))}
  </div>
);

const TopicsCardSkeleton = () => (
  <article
    className={cn("rounded-2xl bg-white p-4 sm:p-6 md:p-8", CARD_SHADOW)}
  >
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "min-w-0",
            index % 2 === 1 && "sm:border-r sm:border-[#e6d6c0] sm:ps-5",
          )}
        >
          <CategoryLinkRowSkeleton />
        </div>
      ))}
    </div>
  </article>
);

const FileRowSkeleton = () => (
  <div className="flex items-center gap-3 py-3">
    <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
    <Skeleton className="h-4 min-w-0 flex-1" />
    <div className="flex shrink-0 items-center gap-1.5">
      <Skeleton className="h-9 w-9 rounded-full" />
      <Skeleton className="h-9 w-9 rounded-full" />
    </div>
  </div>
);

const SeriesRowSkeleton = () => (
  <div className="flex items-center gap-3 py-3">
    <Skeleton className="h-12 w-12 shrink-0 rounded-lg" />
    <div className="min-w-0 flex-1 space-y-2">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-4 w-[85%]" />
    </div>
  </div>
);

const ContentCardSkeleton = () => (
  <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(240px,300px)]">
    <div className="min-w-0 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Skeleton className="h-6 w-48 sm:h-7 sm:w-80" />
        <Skeleton className="h-4 w-24 shrink-0" />
      </div>

      <div className={cn("rounded-2xl bg-white p-4 sm:p-5", CARD_SHADOW)}>
        <div className="mb-4 flex justify-end">
          <Skeleton className="h-9 w-24 rounded-lg" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
          <Skeleton className="h-3 w-10 shrink-0" />
          <Skeleton className="h-1.5 flex-1 rounded-full" />
          <Skeleton className="h-3 w-10 shrink-0" />
        </div>
        <div className="my-4 h-px w-full bg-skeleton" />
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
          <div className="w-full sm:w-auto">
            <Skeleton className="h-9 w-full rounded-lg sm:w-24" />
            <Skeleton className="mt-4 h-4 w-28" />
          </div>
          <div className="w-full sm:w-auto sm:text-end">
            <Skeleton className="ms-auto h-9 w-full rounded-lg sm:w-24" />
            <Skeleton className="mt-4 ms-auto h-4 w-28" />
          </div>
        </div>
      </div>

      <div className={cn("rounded-2xl bg-white p-4 sm:p-5", CARD_SHADOW)}>
        <Skeleton className="mb-3 h-5 w-24 sm:h-6" />
        <Skeleton className="mb-2 h-4 w-full" />
        <Skeleton className="mb-2 h-4 w-[92%]" />
        <Skeleton className="h-4 w-[70%]" />
        <Skeleton className="mt-3 h-4 w-20" />
      </div>

      <Skeleton className="aspect-video w-full rounded-2xl" />

      <div>
        <div className="mb-4 grid grid-cols-2 rounded-lg border border-[#E6D6C0] bg-white p-1">
          <Skeleton className="h-9 rounded-lg sm:h-10" />
          <div className="h-9 sm:h-10" />
        </div>
        <div className={cn("rounded-2xl bg-white p-3 sm:p-5", CARD_SHADOW)}>
          <FileRowSkeleton />
          <FileRowSkeleton />
          <FileRowSkeleton />
        </div>
      </div>

      <div className={cn("rounded-2xl bg-white p-4 sm:p-5", CARD_SHADOW)}>
        <Skeleton className="mb-3 h-5 w-36 sm:h-6" />
        <SeriesRowSkeleton />
        <SeriesRowSkeleton />
        <SeriesRowSkeleton />
      </div>
    </div>

    <aside className="space-y-5">
      <div className={cn("rounded-2xl bg-white p-4 sm:p-5", CARD_SHADOW)}>
        <Skeleton className="h-36 w-full rounded-xl sm:h-40" />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-1">
        <Skeleton className="h-4 w-20" />
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-10 rounded-full" />
        ))}
      </div>
      <div>
        <Skeleton className="mb-4 h-5 w-36 sm:h-6" />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-50 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </aside>
  </div>
);

const CategoryDetailSkeleton = ({
  variant = "topics",
}: CategoryDetailSkeletonProps) => {
  return (
    <section
      className="bkMainColor pb-12 pt-6 sm:pb-16 sm:pt-8"
      aria-hidden
    >
      <CategoryBreadcrumbBarSkeleton crumbs={3} />

      <div className="container mx-auto w-full max-w-7xl px-2 sm:px-4 md:w-[90%]">
        {variant !== "content" && <CategoryPageHeaderSkeleton />}

        {variant === "tabs" && (
          <>
            <CategoryTabsSkeleton />
            <BoxesGridSkeleton />
          </>
        )}
        {variant === "boxes" && <BoxesGridSkeleton />}
        {variant === "topics" && <TopicsCardSkeleton />}
        {variant === "content" && <ContentCardSkeleton />}
      </div>
    </section>
  );
};

export default CategoryDetailSkeleton;
