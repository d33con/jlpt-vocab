import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import Level from "../../../level/[level]";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (session) {
    const words = await prisma.word.findMany({
      where: {
        user: { email: session.user.email },
        level: parseInt(req.query.level),
      },
    });
    res.json(words);
  } else {
    res.status(401).send({ message: "Unauthorized" });
  }
}
