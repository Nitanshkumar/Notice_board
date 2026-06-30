type ConfirmDeleteModalProps = {
  open: boolean;
  noticeTitle?: string | null;
  onCancel: () => void;
  onConfirm: () => void;
  deleting: boolean;
};

export default function ConfirmDeleteModal({ open, noticeTitle, onCancel, onConfirm, deleting }: ConfirmDeleteModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-delete-title"
    >
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
        <h2 id="confirm-delete-title" className="text-lg font-semibold text-gray-900">
          Delete this notice?
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {noticeTitle ? (
            <>
              This will permanently delete <span className="font-medium">&ldquo;{noticeTitle}&rdquo;</span>. This
              action cannot be undone.
            </>
          ) : (
            "This action cannot be undone."
          )}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
