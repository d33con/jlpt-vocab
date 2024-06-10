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

  // GET
  if (req.method == "GET") {
    const savedLists = await prisma.savedWordsList.findMany({
      where: {
        user: {
          email: session.user.email,
        },
      },
      include: {
        words: true,
      },
    });
    res.status(200).json({ savedLists });
  }

  // POST - add a word to a saved List
  if (req.method == "POST") {
    const { word, meaning, romaji, furigana, level } = req.body;
    const result = await prisma.savedWordsList.update({
      where: {
        id: Number(req.query.id),
      },
      data: {
        words: {
          create: {
            word,
            meaning,
            furigana,
            romaji,
            level,
          },
        },
      },
    });
    // TODO : success
    res.status(200).json(result);
  }

  // PATCH - rename list
  if (req.method == "PATCH") {
    const result = await prisma.savedWordsList.update({
      where: {
        id: Number(req.query.id),
      },
      data: {
        name: req.body,
      },
    });
    res.status(200).json({
      success: true,
      list: result,
    });
  }

  // DELETE
  if (req.method == "DELETE") {
    const result = await prisma.savedWordsList.delete({
      where: {
        id: Number(req.query.id),
      },
      select: {
        name: true,
      },
    });
    res.status(200).json({ success: true, name: result.name });
  }
}
