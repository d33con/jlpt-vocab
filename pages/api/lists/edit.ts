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

  // PATCH - remove a word from a saved list
  if (req.method == "PATCH") {
    const { words } = await prisma.savedWordsList.findUnique({
      where: { id: Number(req.query.id) },
      select: { words: true },
    });
    const result = await prisma.savedWordsList.update({
      where: {
        id: Number(req.query.id),
      },
      data: {
        words: {
          set: words.filter((word) => word.id !== req.body.id),
        },
      },
      select: {
        words: true,
      },
    });

    const wordToDelete = await prisma.word.delete({
      where: {
        id: req.body.id,
      },
    });

    res.status(200).json({
      list: result,
      deletedWord: wordToDelete,
    });
  }
}
