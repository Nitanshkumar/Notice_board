import { useState, type ChangeEvent } from "react";
import { useRouter } from "next/router";
import type { Category, Priority, NoticeView } from "../lib/validators";

const CATEGORIES: Category[] = ["EXAM", "EVENT", "GENERAL"];

function toDateInputValue(value: string | Date | null | undefined) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

type CreateNoticeFormProps = {
  mode: "create";
  initialNotice?: undefined;
};

type EditNoticeFormProps = {
  mode: "edit";
  initialNotice: NoticeView;
};

type NoticeFormProps = CreateNoticeFormProps | EditNoticeFormProps;

type FormErrors = Partial<Record<keyof Omit<NoticeView, "id"> | "form" | "image", string>>;

export default function NoticeForm({ mode, initialNotice }: NoticeFormProps) {
  const router = useRouter();
  const isEdit = mode === "edit";

  const [title, setTitle] = useState(initialNotice?.title ?? "");
  const [body, setBody] = useState(initialNotice?.body ?? "");
  const [category, setCategory] = useState<Category>(initialNotice?.category ?? "GENERAL");
  const [priority, setPriority] = useState<Priority>(initialNotice?.priority ?? "NORMAL");
  const [publishDate, setPublishDate] = useState(toDateInputValue(initialNotice?.publishDate) || "");
  const [imageUrl, setImageUrl] = useState<string>(initialNotice?.imageUrl ?? "");
  const [imagePreview, setImagePreview] = useState<string>(initialNotice?.imageUrl ?? "");

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  function clientSideErrors() {
    const next: FormErrors = {};
    if (!title.trim() || title.trim().length < 3) next.title = "Title must be at least 3 characters.";
    if (!body.trim() || body.trim().length < 10) next.body = "Body must be at least 10 characters.";
    if (!publishDate || Number.isNaN(new Date(publishDate).getTime())) next.publishDate = "Enter a valid date.";
    return next;
  }

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    // Bonus image support: encode small images as a data URL so the demo
    // works without external storage. In production this would upload to
    // a blob/object store and store the resulting URL instead.
    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: "Image must be 2MB or smaller." }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setImageUrl(result);
        setImagePreview(result);
      }
      setErrors((prev) => ({ ...prev, image: undefined }));
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");

    const clientErrors = clientSideErrors();
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setSubmitting(true);
    const payload = { title, body, category, priority, publishDate, imageUrl };

    try {
      const url = isEdit ? `/api/notices/${initialNotice.id}` : "/api/notices";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 400) {
        const data = await res.json();
        setErrors(data.fields || {});
        setFormError(data.error || "Please fix the errors below.");
        setSubmitting(false);
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setFormError(data.error || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      router.push("/");
    } catch (err) {
      setFormError("Network error - please check your connection and try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {formError ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</div>
      ) : null}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="e.g. Fee Deadline Extended"
        />
        {errors.title ? <p className="mt-1 text-sm text-red-600">{errors.title}</p> : null}
      </div>

      <div>
        <label htmlFor="body" className="block text-sm font-medium text-gray-700">
          Body
        </label>
        <textarea
          id="body"
          rows={5}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Full details of the notice..."
        />
        {errors.body ? <p className="mt-1 text-sm text-red-600">{errors.body}</p> : null}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value as Category)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0) + c.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>

        <div>
          <span className="block text-sm font-medium text-gray-700">Priority</span>
          <div className="mt-2 flex gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="radio"
                name="priority"
                value="NORMAL"
                checked={priority === "NORMAL"}
                onChange={() => setPriority("NORMAL")}
              />
              Normal
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="radio"
                name="priority"
                value="URGENT"
                checked={priority === "URGENT"}
                onChange={() => setPriority("URGENT")}
              />
              Urgent
            </label>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="publishDate" className="block text-sm font-medium text-gray-700">
          Publish Date
        </label>
        <input
          id="publishDate"
          type="date"
          value={publishDate}
          onChange={(e) => setPublishDate(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:w-60"
        />
        {errors.publishDate ? <p className="mt-1 text-sm text-red-600">{errors.publishDate}</p> : null}
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700">
          Image <span className="text-gray-400">(optional)</span>
        </label>
        <input id="image" type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImageChange} className="mt-1 block w-full text-sm" />
        {errors.image ? <p className="mt-1 text-sm text-red-600">{errors.image}</p> : null}
        {imagePreview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imagePreview} alt="Preview" className="mt-3 h-32 w-auto rounded-md border object-cover" />
        ) : null}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Saving..." : isEdit ? "Save Changes" : "Save Notice"}
        </button>
      </div>
    </form>
  );
}
