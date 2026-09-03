import { Skeleton } from "@/components/ui/skeleton";
import {
  CARD_SHADOW,
  CategoryBreadcrumbBarSkeleton,
  CategoryPageHeaderSkeleton,
} from "./categorySkeletonParts";

const StaticHtmlPageSkeleton = () => (
  <section className="bkMainColor pb-12 pt-6 sm:pb-16 sm:pt-8" aria-hidden>
    <CategoryBreadcrumbBarSkeleton crumbs={2} />
    <div className="container mx-auto w-full max-w-7xl px-2 sm:px-4 md:w-[90%]">
      <CategoryPageHeaderSkeleton />
      <div className={`rounded-2xl bg-white p-5 sm:p-8 ${CARD_SHADOW}`}>
        <Skeleton className="mb-4 h-4 w-[88%]" />
        <Skeleton className="mb-4 h-4 w-full" />
        <Skeleton className="mb-4 h-4 w-[92%]" />
        <Skeleton className="mb-4 h-4 w-[70%]" />
        <Skeleton className="mb-6 h-4 w-[80%]" />
        <Skeleton className="mb-4 h-4 w-full" />
        <Skeleton className="mb-4 h-4 w-[85%]" />
        <Skeleton className="h-4 w-[60%]" />
      </div>
    </div>
  </section>
);

export default StaticHtmlPageSkeleton;
