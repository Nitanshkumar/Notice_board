import Link from "next/link";
import type { GetServerSideProps } from "next";
import type { Notice } from "@prisma/client";
import prisma from "../../../lib/prisma";
import type { NoticeView } from "../../../lib/validators";
import NoticeForm from "../../../components/NoticeForm";

type EditNoticePageProps = {
  notice: NoticeView;
};

export const getServerSideProps: GetServerSideProps<EditNoticePageProps> = async ({ params }) => {
  const id = Number(params?.id);
  if (!Number.isInteger(id)) {
    return { notFound: true };
  }

  const notice = await prisma.notice.findUnique({ where: { id } });
  if (!notice) {
    return { notFound: true };
  }

  return {
    props: {
      notice: JSON.parse(JSON.stringify(notice)) as NoticeView,
    },
  };
};

export default function EditNoticePage({ notice }: EditNoticePageProps) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        &larr; Back to Notice Board
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-gray-900">Edit Notice</h1>
      <p className="mt-1 text-sm text-gray-500">Update the fields and save your changes.</p>

      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <NoticeForm mode="edit" initialNotice={notice} />
      </div>
    </div>
  );
}
