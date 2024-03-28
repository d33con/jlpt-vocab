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
    if (req.query.id) {
      const result = await prisma.savedWordsList.findMany({
        where: {
          id: Number(req.query.id),
        },
        include: {
          words: true,
        },
      });
      res.status(200).json({ savedList: result[0] });
    } else {
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
      res.status(200).json({
        savedLists,
      });
    }
  }

  // POST - add a word to a saved List
  if (req.method == "POST") {
    const { listId, word } = req.body;
    console.log("index");
    const result = await prisma.savedWordsList.update({
      where: {
        id: listId,
      },
      data: {
        words: {
          create: {
            word: word.word,
            meaning: word.meaning,
            furigana: word.furigana,
            romaji: word.romaji,
            level: word.level,
          },
        },
      },
    });
    res.status(200).json(result);
  }

  // DELETE
  if (req.method == "DELETE") {
    if (req.query.id) {
      const result = await prisma.savedWordsList.delete({
        where: {
          id: Number(req.query.id),
        },
        select: {
          name: true,
        },
      });
      res.status(200).json({ name: result.name });
    }
  }
}
