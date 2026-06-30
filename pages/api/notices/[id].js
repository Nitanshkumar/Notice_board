const prisma = require("../../../lib/prisma");
const { noticeUpdateSchema, formatZodErrors } = require("../../../lib/validators");

function parseId(rawId) {
  const id = Number(rawId);
  return Number.isInteger(id) && id > 0 ? id : null;
}

module.exports = handler;
module.exports.default = handler;

async function handler(req, res) {
  const id = parseId(req.query.id);
  if (id === null) {
    return res.status(400).json({ error: "Invalid notice id" });
  }

  if (req.method === "GET") {
    try {
      const notice = await prisma.notice.findUnique({ where: { id } });
      if (!notice) return res.status(404).json({ error: "Notice not found" });
      return res.status(200).json(notice);
    } catch (err) {
      console.error(`GET /api/notices/${id} failed:`, err.message);
      return res.status(500).json({ error: "Failed to fetch notice" });
    }
  }

  if (req.method === "PUT") {
    const parsed = noticeUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Validation failed",
        fields: formatZodErrors(parsed.error),
      });
    }

    const { title, body, category, priority, publishDate, imageUrl } = parsed.data;

    try {
      const existing = await prisma.notice.findUnique({ where: { id } });
      if (!existing) return res.status(404).json({ error: "Notice not found" });

      const updated = await prisma.notice.update({
        where: { id },
        data: {
          title,
          body,
          category,
          priority,
          publishDate: new Date(publishDate),
          imageUrl: imageUrl || null,
        },
      });
      return res.status(200).json(updated);
    } catch (err) {
      console.error(`PUT /api/notices/${id} failed:`, err.message);
      return res.status(500).json({ error: "Failed to update notice" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const existing = await prisma.notice.findUnique({ where: { id } });
      if (!existing) return res.status(404).json({ error: "Notice not found" });

      await prisma.notice.delete({ where: { id } });
      return res.status(204).end();
    } catch (err) {
      console.error(`DELETE /api/notices/${id} failed:`, err.message);
      return res.status(500).json({ error: "Failed to delete notice" });
    }
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
};
