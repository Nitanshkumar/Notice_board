import Link from "next/link";
import UrgentBadge from "./UrgentBadge";
import CategoryChip from "./CategoryChip";

function formatDate(dateStr) {
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function NoticeCard({ notice, onDeleteClick }) {
  const isUrgent = notice.priority === "URGENT";

  return (
    <div
      className={`flex flex-col gap-3 rounded-lg border bg-white p-4 shadow-sm transition hover:shadow-md ${
        isUrgent ? "border-red-300 ring-1 ring-red-100" : "border-gray-200"
      }`}
    >
      {notice.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={notice.imageUrl}
          alt=""
          className="h-36 w-full rounded-md object-cover"
        />
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        {isUrgent ? <UrgentBadge /> : null}
        <CategoryChip category={notice.category} />
        <span className="ml-auto text-xs text-gray-500">{formatDate(notice.publishDate)}</span>
      </div>

      <h3 className="text-base font-semibold text-gray-900 break-words">{notice.title}</h3>
      <p className="line-clamp-3 text-sm text-gray-600 break-words whitespace-pre-line">{notice.body}</p>

      <div className="mt-auto flex gap-2 pt-2">
        <Link
          href={`/notices/${notice.id}/edit`}
          className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Edit
        </Link>
        <button
          type="button"
          onClick={() => onDeleteClick(notice)}
          className="flex-1 rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
