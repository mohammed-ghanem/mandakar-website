import { cn } from "@/lib/utils";
import LangUseParams from "@/translate/LangUseParams";
import CategoryLink from "./CategoryLink";
import { withLang, type CategoryItem } from "./types";

type CategorySubListProps = {
  items: CategoryItem[];
};

const CategorySubList = ({ items }: CategorySubListProps) => {
  const lang = LangUseParams();
  const isRtl = lang === "ar";

  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-4">
      {items.map((item) => (
        <li
          key={item.id}
          className={cn(
            "min-w-0",
            isRtl
              ? "sm:even:border-r sm:even:border-[#e6d6c0] sm:even:ps-5"
              : "sm:odd:border-r sm:odd:border-[#e6d6c0] sm:odd:pe-5",
          )}
        >
          <CategoryLink
            title={item.title}
            href={withLang(lang, item.href)}
            size="sm"
            className="text-md"
          />
        </li>
      ))}
    </ul>
  );
};

export default CategorySubList;
