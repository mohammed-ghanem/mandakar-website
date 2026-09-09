"use client";

import CategoryPageLayout from "./CategoryPageLayout";
import CategoryPageHeader from "./CategoryPageHeader";
import type { CategoryBreadcrumbItem } from "./CategoryBreadcrumb";

type CategoryEmptyPageProps = {
  title: string;
  crumbs: CategoryBreadcrumbItem[];
  message: string;
};

const CategoryEmptyPage = ({
  title,
  crumbs,
  message,
}: CategoryEmptyPageProps) => {
  return (
    <CategoryPageLayout crumbs={crumbs}>
      <CategoryPageHeader title={title} />
      <article className="rounded-2xl bg-white p-6 text-center shadow-sm sm:p-8 [box-shadow:1px_1px_1px_#9d732c]">
        <p className="text-sm grayColor sm:text-base">{message}</p>
      </article>
    </CategoryPageLayout>
  );
};

export default CategoryEmptyPage;
