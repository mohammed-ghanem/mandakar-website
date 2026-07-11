import { Skeleton } from "@/components/ui/skeleton";

type ReuseBoxItemSkeletonProps = {
  showIconBackground?: boolean;
  withAudioBar?: boolean;
};

export const ReuseBoxItemSkeleton = ({
  showIconBackground = true,
  withAudioBar = false,
}: ReuseBoxItemSkeletonProps) => {
  return (
    <article className="flex flex-1 items-center gap-3 rounded-xl border border-[#E6D6C0]/40 bg-white p-3 shadow-sm sm:p-4">
      <Skeleton
        className={
          showIconBackground
            ? "h-11 w-11 shrink-0 rounded-full sm:h-12 sm:w-12"
            : "h-11 w-11 shrink-0 rounded-md sm:h-12 sm:w-12"
        }
      />

      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-3 w-16 sm:w-20" />
        <Skeleton className="h-4 w-full" />
        {withAudioBar && (
          <div className="flex items-center gap-2 pt-1">
            <Skeleton className="h-7 w-7 shrink-0 rounded-full" />
            <Skeleton className="h-1.5 flex-1 rounded-full" />
            <Skeleton className="h-3 w-10 shrink-0" />
          </div>
        )}
      </div>

      <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
    </article>
  );
};

type ReuseBoxSkeletonProps = {
  itemCount?: number;
  showIconBackground?: boolean;
  audioItemIndexes?: number[];
};

const ReuseBoxSkeleton = ({
  itemCount = 6,
  showIconBackground = true,
  audioItemIndexes = [],
}: ReuseBoxSkeletonProps) => {
  return (
    <section className="flex h-full flex-col gap-3 p-0 md:p-4" aria-hidden>
      <div className="flex shrink-0 items-center justify-between gap-3">
        <Skeleton className="h-6 w-28 sm:h-7 sm:w-36" />
        <Skeleton className="h-4 w-14 sm:w-16" />
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3">
        {Array.from({ length: itemCount }).map((_, index) => (
          <ReuseBoxItemSkeleton
            key={index}
            showIconBackground={showIconBackground}
            withAudioBar={audioItemIndexes.includes(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default ReuseBoxSkeleton;
