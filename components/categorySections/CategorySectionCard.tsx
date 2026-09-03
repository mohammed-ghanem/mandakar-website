import Link from "next/link";
import LangUseParams from "@/translate/LangUseParams";
import CategorySubList from "./CategorySubList";
import { hasChildren, withLang, type CategoryItem } from "./types";

type CategorySectionCardProps = {
  item: CategoryItem;
  index: number;
};

const CategorySectionCard = ({ item, index }: CategorySectionCardProps) => {
  const lang = LangUseParams();
  const order = String(index + 1).padStart(2, "0");
  const itemHasChildren = hasChildren(item);
  const href = withLang(lang, item.href);

  const title = (
    <h2 className="min-w-0 flex-1 text-lg font-bold">{item.title}</h2>
  );

  return (
    <article
      className="rounded-2xl bg-white p-4 shadow-sm sm:p-6 md:p-8 
    [box-shadow:1px_1px_1px_#9d732c]"
    >
      <div className={itemHasChildren ? "mb-5 sm:mb-6" : undefined}>
        <span
          className="mb-2 block shrink-0 text-3xl font-bold leading-none text-[#E6E2DA] sm:text-4xl"
          aria-hidden
        >
          {order}
        </span>
        {href ? (
          <Link
            href={href}
            className="min-w-0 transition-opacity hover:opacity-80"
          >
            {title}
          </Link>
        ) : (
          title
        )}
      </div>

      {itemHasChildren && <CategorySubList items={item.children!} />}
    </article>
  );
};

export default CategorySectionCard;
