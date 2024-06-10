/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `SavedWordsList` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "SavedWordsList" ADD COLUMN     "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "SavedWordsList_slug_key" ON "SavedWordsList"("slug");
