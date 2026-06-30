const prisma = require("../../../lib/prisma");
const { noticeSchema, formatZodErrors } = require("../../../lib/validators");

module.exports = async function handler(req, res) {
  if (req.method === "GET") {
    try {
      // Urgent-first ordering happens here, in the database query itself -
      // priority DESC puts URGENT ('U' > 'N' is irrelevant; Prisma sorts enums
      // by declaration order, so URGENT is declared after NORMAL) ahead of
      // NORMAL, then newest publishDate first within each group.
      const notices = await prisma.notice.findMany({
        orderBy: [{ priority: "desc" }, { publishDate: "desc" }],
      });
      return res.status(200).json(notices);
    } catch (err) {
      console.error("GET /api/notices failed:", err.message);
      return res.status(500).json({ error: "Failed to fetch notices" });
    }
  }

  if (req.method === "POST") {
    const parsed = noticeSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Validation failed",
        fields: formatZodErrors(parsed.error),
      });
    }

    const { title, body, category, priority, publishDate, imageUrl } = parsed.data;

    try {
      const notice = await prisma.notice.create({
        data: {
          title,
          body,
          category,
          priority,
          publishDate: new Date(publishDate),
          imageUrl: imageUrl || null,
        },
      });
      return res.status(201).json(notice);
    } catch (err) {
      console.error("POST /api/notices failed:", err.message);
      return res.status(500).json({ error: "Failed to create notice" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
};
