import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { noticeSchema, formatZodErrors } from "../../../lib/validators";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const notices = await prisma.notice.findMany({
        orderBy: [{ priority: "desc" }, { publishDate: "desc" }],
      });
      return res.status(200).json(notices);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("GET /api/notices failed:", message);
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
      const message = err instanceof Error ? err.message : String(err);
      console.error("POST /api/notices failed:", message);
      return res.status(500).json({ error: "Failed to create notice" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
