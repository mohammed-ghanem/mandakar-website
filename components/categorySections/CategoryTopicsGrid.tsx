import CategorySubList from "./CategorySubList";
import type { CategoryTopic } from "./types";

type CategoryTopicsGridProps = {
  topics: CategoryTopic[];
};

const CategoryTopicsGrid = ({ topics }: CategoryTopicsGridProps) => {
  return (
    <article className="rounded-2xl bg-white p-4 sm:p-6 md:p-8 [box-shadow:1px_1px_1px_#9d732c]">
      <CategorySubList
        items={topics.map((topic) => ({
          id: topic.id,
          title: topic.title,
          href: topic.href,
        }))}
      />
    </article>
  );
};

export default CategoryTopicsGrid;
