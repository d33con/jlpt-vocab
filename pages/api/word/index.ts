import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { word, meaning, romaji, furigana, level } = req.body;

  const session = await getServerSession(req, res, authOptions);
  if (session) {
    if (req.method == "PATCH") {
      const result = await prisma.user.update({
        where: {
          email: session?.user?.email,
        },
        data: {
          words: {
            deleteMany: {
              word: word,
            },
          },
        },
      });
      res.json(result);
    } else {
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
  } else {
    res.status(401).send({ message: "Unauthorized" });
  }
}
