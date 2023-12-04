import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
              id: req.query.word.id,
            },
          },
        },
        select: {
          words: true,
        },
      });
      res.json(result);
    }
    if (req.query.level) {
      const words = await prisma.user.findMany({
        where: { email: session.user.email },
        select: {
          words: {
            where: {
              level: parseInt(req.query.level),
            },
          },
        },
      });
      res.json(words[0]);
    }
    const words = await prisma.user.findMany({
      where: { email: session.user.email },
      select: {
        words: true,
      },
    });
    res.json(words[0]);
  } else {
    res.status(401).send({ message: "Unauthorized" });
  }
}
