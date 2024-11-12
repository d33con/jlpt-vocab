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

  const { slug, page, limit } = req.query;

  // GET
  if (req.method == "GET") {
    const list = await prisma.savedWordsList.findUnique({
      where: {
        slug: slug as string,
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

    const wordList = await prisma.word.findMany({
      where: {
        savedWordsListId: list.id,
      },
      take: Number(limit),
      skip: (Number(page) - 1) * Number(limit),
    });

    const levelCounts = await prisma.word.groupBy({
      where: { savedWordsListId: list.id },
      by: "level",
      _count: {
        word: true,
      },
    });

    return res.status(200).json({ list, levelCounts, wordList });
  }
}
