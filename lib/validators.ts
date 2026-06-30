import { z } from "zod";

export const CATEGORY_VALUES = ["EXAM", "EVENT", "GENERAL"] as const;
export const PRIORITY_VALUES = ["NORMAL", "URGENT"] as const;

export const categorySchema = z.enum(CATEGORY_VALUES, {
  errorMap: () => ({ message: `category must be one of ${CATEGORY_VALUES.join(", ")}` }),
});

export const prioritySchema = z.enum(PRIORITY_VALUES, {
  errorMap: () => ({ message: `priority must be one of ${PRIORITY_VALUES.join(", ")}` }),
});

const validDateString = z.string().refine((val) => {
  if (!val) return false;
  const d = new Date(val);
  return !Number.isNaN(d.getTime());
}, { message: "publishDate must be a valid date" });

export const noticeSchema = z.object({
  title: z
    .string({ required_error: "title is required" })
    .trim()
    .min(3, "title must be at least 3 characters")
    .max(120, "title must be at most 120 characters"),
  body: z
    .string({ required_error: "body is required" })
    .trim()
    .min(10, "body must be at least 10 characters")
    .max(2000, "body must be at most 2000 characters"),
  category: categorySchema,
  priority: prioritySchema,
  publishDate: validDateString,
  imageUrl: z.string().trim().max(500).optional().nullable().or(z.literal("")),
});

export const noticeUpdateSchema = noticeSchema;

export type Category = z.infer<typeof categorySchema>;
export type Priority = z.infer<typeof prioritySchema>;
export type NoticeInput = z.infer<typeof noticeSchema>;
export type NoticeView = NoticeInput & {
  id: number;
  imageUrl?: string | null;
};

export function formatZodErrors(zodError: z.ZodError) {
  const fields: Record<string, string> = {};
  for (const issue of zodError.issues) {
    const key = issue.path.join(".") || "form";
    if (!fields[key]) fields[key] = issue.message;
  }
  return fields;
}
