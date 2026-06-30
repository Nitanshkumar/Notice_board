const { z } = require("zod");

const CATEGORY_VALUES = ["EXAM", "EVENT", "GENERAL"];
const PRIORITY_VALUES = ["NORMAL", "URGENT"];

// A string that Date() can actually parse into a valid date.
const validDateString = z.string().refine((val) => {
  if (!val) return false;
  const d = new Date(val);
  return !Number.isNaN(d.getTime());
}, { message: "publishDate must be a valid date" });

const noticeSchema = z.object({
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
  category: z.enum(CATEGORY_VALUES, {
    errorMap: () => ({ message: `category must be one of ${CATEGORY_VALUES.join(", ")}` }),
  }),
  priority: z.enum(PRIORITY_VALUES, {
    errorMap: () => ({ message: `priority must be one of ${PRIORITY_VALUES.join(", ")}` }),
  }),
  publishDate: validDateString,
  imageUrl: z.string().trim().max(500).optional().nullable().or(z.literal("")),
});

// Same rules apply to updates; Prisma's `id` comes from the route param, not the body.
const noticeUpdateSchema = noticeSchema;

function formatZodErrors(zodError) {
  const fields = {};
  for (const issue of zodError.issues) {
    const key = issue.path.join(".") || "form";
    if (!fields[key]) fields[key] = issue.message;
  }
  return fields;
}

module.exports = { noticeSchema, noticeUpdateSchema, formatZodErrors, CATEGORY_VALUES, PRIORITY_VALUES };
