import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction(async (tx) => {
    const lists = await tx.savedWordsList.findMany();
    for (const list of lists) {
      await tx.savedWordsList.update({
        where: { id: list.id },
        data: {
          slug: `${list.name
            .toLowerCase()
            .replace(/ /g, "-")
            .replace(/_/g, "-")}-${list.id}`,
        },
      });
    }
  });
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
