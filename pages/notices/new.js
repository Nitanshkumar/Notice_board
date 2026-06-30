import Link from "next/link";
import NoticeForm from "../../components/NoticeForm";

export default function NewNoticePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        &larr; Back to Notice Board
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-gray-900">New Notice</h1>
      <p className="mt-1 text-sm text-gray-500">Fill in the details below to publish a new notice.</p>

      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <NoticeForm mode="create" />
      </div>
    </div>
  );
}
