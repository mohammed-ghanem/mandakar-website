import { Skeleton } from "@/components/ui/skeleton";

const CARD_HEIGHT =
  "h-[180px] rounded-lg sm:h-[190px] md:h-[200px]";

const HeroSectionSkeleton = () => {
  return (
    <div className="relative pb-8 sm:pb-10" aria-hidden>
     

      <div className="container mx-auto w-[90%] max-w-7xl px-2 pt-8 sm:px-4 sm:pt-12 md:pt-15">
        <div className="mb-6 sm:mb-8 md:mb-10">
          <Skeleton className="h-7 w-44 sm:h-8 sm:w-56" />
          <Skeleton className="mt-2 h-4 w-full max-w-md sm:mt-3" />
        </div>

        {/* 1 card on mobile → 2 sm → 3 md → 4 lg (matches carousel breakpoints) */}
        <div className="flex gap-3 sm:gap-4" dir="ltr">
          <Skeleton className={`min-w-0 flex-1 ${CARD_HEIGHT}`} />
          <Skeleton className={`hidden min-w-0 flex-1 sm:block ${CARD_HEIGHT}`} />
          <Skeleton className={`hidden min-w-0 flex-1 md:block ${CARD_HEIGHT}`} />
          <Skeleton className={`hidden min-w-0 flex-1 lg:block ${CARD_HEIGHT}`} />
        </div>
      </div>
    </div>
  );
};

export default HeroSectionSkeleton;
