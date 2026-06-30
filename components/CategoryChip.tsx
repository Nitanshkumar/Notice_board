import type { Category } from "../lib/validators";

const STYLES: Record<Category, string> = {
  EXAM: "bg-purple-100 text-purple-800",
  EVENT: "bg-blue-100 text-blue-800",
  GENERAL: "bg-gray-100 text-gray-800",
};

type CategoryChipProps = {
  category: Category;
};

export default function CategoryChip({ category }: CategoryChipProps) {
  const cls = STYLES[category] || STYLES.GENERAL;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {category}
    </span>
  );
}
