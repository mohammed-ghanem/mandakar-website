import { Skeleton } from "@/components/ui/skeleton";
import ReuseBoxSkeleton from "./ReuseBoxSkeleton";

const MoreWatchedSkeleton = () => {
  return (
    <section className="relative overflow-hidden py-10" aria-hidden>
      <div className="absolute inset-0 bg-skeleton/30" />

      <div className="relative z-10 container mx-auto w-full max-w-7xl px-2 sm:px-4 md:w-[90%]">
        <Skeleton className="mb-6 h-7 w-52 sm:h-8 sm:w-64" />

        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
          <div className="flex h-full min-h-0 flex-col">
            <ReuseBoxSkeleton audioItemIndexes={[0, 2, 4]} />
          </div>
          <div className="flex h-full min-h-0 flex-col gap-6">
            <ReuseBoxSkeleton />
            <ReuseBoxSkeleton />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MoreWatchedSkeleton;
