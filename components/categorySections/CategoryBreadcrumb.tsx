import Link from "next/link";

export type CategoryBreadcrumbItem = {
  label?: string;
  href?: string;
};

type CategoryBreadcrumbProps = {
  items: CategoryBreadcrumbItem[];
};

const CategoryBreadcrumb = ({ items }: CategoryBreadcrumbProps) => {
  return (
    <nav
      aria-label="breadcrumb"
      className="container mx-auto mb-6 flex w-[80%] flex-wrap items-center gap-2 py-2 text-sm font-semibold sm:mb-8 sm:text-xs"
    >
      {items.map((crumb, index) => (
        <span key={`${crumb.label}-${index}`} className="flex items-center gap-2">
          {index > 0 && <span aria-hidden>{">"}</span>}
          {crumb.href ? (
            <Link href={crumb.href} className="transition-opacity hover:opacity-80">
              {crumb.label}
            </Link>
          ) : (
            <span>{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
};

export default CategoryBreadcrumb;
