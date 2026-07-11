import { Skeleton } from "@/components/ui/skeleton";
import ReuseBoxSkeleton from "./ReuseBoxSkeleton";

const LastPublishedSkeleton = () => {
  return (
    <section className="relative pb-10" aria-hidden>
      <div className="container mx-auto w-full max-w-7xl px-2 sm:px-4 md:w-[90%]">
        <Skeleton className="mb-6 h-7 w-44 sm:h-8 sm:w-56" />

        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
          <ReuseBoxSkeleton audioItemIndexes={[0, 3]} />
          <ReuseBoxSkeleton audioItemIndexes={[1, 4]} />
          <ReuseBoxSkeleton audioItemIndexes={[0, 3]} />
          <ReuseBoxSkeleton audioItemIndexes={[0, 3]} />
          <ReuseBoxSkeleton />
          <ReuseBoxSkeleton showIconBackground={false} />
        </div>
      </div>
    </section>
  );
};

export default LastPublishedSkeleton;
