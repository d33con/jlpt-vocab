import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // GET
  if (req.method == "GET") {
    const allLists = await prisma.savedWordsList.findMany({
      include: {
        words: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    });
    res.status(200).json({ allLists });
  }
}
