import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import prisma from "../../../lib/prisma";
import { authOptions } from "../auth/[...nextauth]";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) return res.status(401).send({ message: "Unauthorized" });

  const slug = Array.isArray(req.query.slug)
    ? req.query.slug[0]
    : req.query.slug;

  // GET
  if (req.method == "GET") {
    const list = await prisma.savedWordsList.findUnique({
      where: {
        slug,
      },
      include: {
        words: true,
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    const levelCounts = await prisma.word.groupBy({
      where: { savedWordsListId: list.id },
      by: "level",
      _count: {
        word: true,
      },
    });

    return res.status(200).json({ list, levelCounts });
  }
}
