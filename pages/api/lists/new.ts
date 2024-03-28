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

  // POST - add a word to a new saved List
  if (req.method == "POST") {
    const { listName, word } = req.body;
    console.log("new");
    const result = await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        savedWordsLists: {
          create: {
            name: listName,
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
        },
      },
    });
    res.status(200).json(result);
  }
}
