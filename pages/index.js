import { useState } from "react";
import Link from "next/link";
import prisma from "../lib/prisma";
import NoticeCard from "../components/NoticeCard";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

export async function getServerSideProps() {
  const notices = await prisma.notice.findMany({
    orderBy: [{ priority: "desc" }, { publishDate: "desc" }],
  });

  return {
    props: {
      initialNotices: JSON.parse(JSON.stringify(notices)),
    },
  };
}

export default function Home({ initialNotices }) {
  const [notices, setNotices] = useState(initialNotices);
  const [target, setTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleConfirmDelete() {
    if (!target) return;
    setDeleting(true);
    setError("");

    try {
      const res = await fetch(`/api/notices/${target.id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete notice");
      }
      setNotices((prev) => prev.filter((n) => n.id !== target.id));
      setTarget(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">NoticeHub</h1>
          <p className="mt-1 text-sm text-gray-500">
            {notices.length} notice{notices.length === 1 ? "" : "s"} - Urgent items always appear first.
          </p>
        </div>
        <Link
          href="/notices/new"
          className="inline-flex w-fit items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
        >
          + New Notice
        </Link>
      </div>

      {error ? (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}

      {notices.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
          <p className="text-gray-500">No notices yet. Create the first one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notices.map((notice) => (
            <NoticeCard key={notice.id} notice={notice} onDeleteClick={setTarget} />
          ))}
        </div>
      )}

      <ConfirmDeleteModal
        open={Boolean(target)}
        noticeTitle={target?.title}
        deleting={deleting}
        onCancel={() => setTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
