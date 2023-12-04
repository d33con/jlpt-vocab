import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import prisma from "../../../lib/prisma";
import { authOptions } from "../auth/[...nextauth]";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (session) {
    if (req.method == "GET") {
      if (req.query.level) {
        // const arrayofIds = req.query.level
        //   .split(",")
        //   .map((id) => Number(id.replace(/[\[\]]/g, "")));

        const result = await prisma.user.findMany({
          where: {
            email: session.user.email,
          },
          include: {
            words: {
              where: {
                level: {
                  in: JSON.parse(req.query.level),
                },
              },
            },
          },
        });
        res.json(result[0].words);
      } else {
        const result = await prisma.user.findMany({
          where: { email: session.user.email },
          select: {
            words: true,
          },
        });
        // const count = await prisma.user.count({
        //   where: { email: session.user.email },
        //   where: {
        //     words: true,
        //   },
        // });

        res.json(result[0].words);
      }
    }
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
      res.json(result);
    }
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
      res.json(result.words);
    }
  } else {
    res.status(401).send({ message: "Unauthorized" });
  }
}
