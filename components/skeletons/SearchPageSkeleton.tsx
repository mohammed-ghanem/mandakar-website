import { Skeleton } from "@/components/ui/skeleton";
import ReuseBoxSkeleton from "./ReuseBoxSkeleton";

const SearchPageSkeleton = () => {
  return (
    <section className="bkMainColor pb-12 pt-6 sm:pb-16 sm:pt-8" aria-hidden>
      <div className="bgNavbarColor">
        <div className="container mx-auto mb-6 flex w-[80%] items-center gap-2 py-2 sm:mb-8">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-3" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      <div className="container mx-auto w-full max-w-7xl px-2 sm:px-4 md:w-[90%]">
        <div className="mb-6 space-y-2 sm:mb-8">
          <Skeleton className="h-7 w-40 sm:h-8 sm:w-52" />
          <Skeleton className="h-4 w-64 sm:w-80" />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="rounded-2xl bg-white p-3 [box-shadow:1px_1px_1px_#9d732c] sm:p-4 md:p-6">
            <ReuseBoxSkeleton audioItemIndexes={[0, 1]} itemCount={4} />
          </div>
          <div className="rounded-2xl bg-white p-3 [box-shadow:1px_1px_1px_#9d732c] sm:p-4 md:p-6">
            <ReuseBoxSkeleton itemCount={3} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchPageSkeleton;
