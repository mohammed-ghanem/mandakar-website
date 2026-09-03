import type { ReactNode } from "react";
import CategoryBreadcrumb, {
  type CategoryBreadcrumbItem,
} from "./CategoryBreadcrumb";

type CategoryPageLayoutProps = {
  crumbs: CategoryBreadcrumbItem[];
  children: ReactNode;
};

const CategoryPageLayout = ({ crumbs, children }: CategoryPageLayoutProps) => {
  return (
    <section className="bkMainColor pb-12 pt-6 sm:pb-16 sm:pt-8">
      <div className="bgNavbarColor">
        <CategoryBreadcrumb items={crumbs} />
      </div>
      <div className="container mx-auto w-full max-w-7xl px-2 sm:px-4 md:w-[90%]">
        {children}
      </div>
    </section>
  );
};

export default CategoryPageLayout;
