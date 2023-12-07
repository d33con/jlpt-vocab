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

  const totalWords = async () => {
    return await prisma.word.count({
      where: { user: { email: session.user.email } },
    });
  };
  const groupByCount = async () => {
    return await prisma.word.groupBy({
      where: { user: { email: session.user.email } },
      by: "level",
      _count: {
        word: true,
      },
    });
  };

  // GET
  if (req.method == "GET") {
    if (req.query.level) {
      const result = await prisma.user.findMany({
        where: {
          email: session.user.email,
        },
        include: {
          words: {
            where: {
              level: {
                in: JSON.parse(req.query.level as string),
              },
            },
          },
        },
      });
      res.status(200).json({ words: result[0].words });
    } else {
      const result = await prisma.user.findMany({
        where: { email: session.user.email },
        select: {
          words: true,
        },
      });
      const totalWordCount = await totalWords();
      const levelsCount = await groupByCount();
      res.status(200).json({
        words: result[0].words,
        total: totalWordCount,
        levels: levelsCount,
      });
    }
  }

  // POST - add a word to user's saved Words
  if (req.method == "POST") {
    const { word, meaning, romaji, furigana, level } = req.body;
    const result = await prisma.user.update({
      where: {
        email: session?.user?.email,
      },
      data: {
        words: {
          create: {
            word: word,
            meaning: meaning,
            romaji: romaji,
            furigana: furigana,
            level: level,
          },
        },
      },
    });
    res.status(200).json(result);
  }

  // PATCH - remove word from user's Words
  if (req.method == "PATCH") {
    const { words } = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { words: true },
    });
    const result = await prisma.user.update({
      where: {
        email: session?.user?.email,
      },
      data: {
        words: {
          set: words.filter(
            (word) => word.id !== parseInt(req.query.id as string)
          ),
        },
      },
      select: {
        words: true,
      },
    });
    const totalWordCount = await totalWords();
    const levelsCount = await groupByCount();
    res.status(200).json({
      words: result.words,
      total: totalWordCount,
      levels: levelsCount,
    });
  }
}
