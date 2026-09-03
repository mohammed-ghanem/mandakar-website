import { cn } from "@/lib/utils";
import CategorySectionCard from "./CategorySectionCard";
import type { CategorySectionsProps } from "./types";

const CategorySections = ({ items, className = "" }: CategorySectionsProps) => {
  return (
    <div className={cn("flex flex-col gap-4 sm:gap-5", className)}>
      {items.map((item, index) => (
        <CategorySectionCard key={item.id} item={item} index={index} />
      ))}
    </div>
  );
};

export default CategorySections;
