import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  CARD_SHADOW,
  CategoryBreadcrumbBarSkeleton,
  CategoryLinkRowSkeleton,
} from "./categorySkeletonParts";

const SectionCardSkeleton = ({ links = 0 }: { links?: number }) => (
  <article
    className={cn("rounded-2xl bg-white p-4 sm:p-6 md:p-8", CARD_SHADOW)}
  >
    <Skeleton className="mb-2 h-8 w-12 sm:h-10 sm:w-14" />
    {links > 0 ? (
      <>
        <Skeleton className="mb-5 h-6 w-40 sm:mb-6 sm:h-7 sm:w-52" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-4">
          {Array.from({ length: links }).map((_, index) => (
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
      </>
    ) : (
      <Skeleton className="h-6 w-40 sm:h-7 sm:w-56" />
    )}
  </article>
);

const CategorySectionsSkeleton = () => {
  return (
    <section
      className="bkMainColor pb-12 pt-6 sm:pb-16 sm:pt-8"
      aria-busy="true"
      aria-hidden
    >
      <CategoryBreadcrumbBarSkeleton crumbs={2} />

      <div className="container mx-auto w-full max-w-7xl px-2 sm:px-4 md:w-[90%]">
        <div className="flex flex-col gap-4 sm:gap-5">
          <SectionCardSkeleton links={4} />
          <SectionCardSkeleton />
          <SectionCardSkeleton />
          <SectionCardSkeleton links={2} />
          <SectionCardSkeleton />
        </div>
      </div>
    </section>
  );
};

export default CategorySectionsSkeleton;
