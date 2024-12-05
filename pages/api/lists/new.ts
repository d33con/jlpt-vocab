import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import prisma from "../../../lib/prisma";
import { authOptions } from "../auth/[...nextauth]";
import urlSafeString from "../../../utils/urlSafeString";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) return res.status(401).send({ message: "Unauthorized" });

  // POST - add a word to a new saved List
  if (req.method == "POST") {
    const { listName, word } = req.body;

    const savingUser = await prisma.user.findFirst({
      where: {
        email: session.user.email,
      },
    });

    const result = await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        savedWordsLists: {
          create: {
            name: listName,
            slug: urlSafeString(listName, savingUser.id),
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
      include: {
        savedWordsLists: true,
      },
    });
    res.status(200).json(result);
  }
}
