/*
  Warnings:

  - You are about to drop the `SavedWordList` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `savedWordListId` on the `Word` table. All the data in the column will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SavedWordList";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "SavedWordsList" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "userId" INTEGER,
    "date_added" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SavedWordsList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Word" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "word" TEXT NOT NULL,
    "meaning" TEXT NOT NULL,
    "furigana" TEXT NOT NULL,
    "romaji" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "userId" INTEGER,
    "date_added" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "savedWordsListId" INTEGER,
    CONSTRAINT "Word_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Word_savedWordsListId_fkey" FOREIGN KEY ("savedWordsListId") REFERENCES "SavedWordsList" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Word" ("date_added", "furigana", "id", "level", "meaning", "romaji", "userId", "word") SELECT "date_added", "furigana", "id", "level", "meaning", "romaji", "userId", "word" FROM "Word";
DROP TABLE "Word";
ALTER TABLE "new_Word" RENAME TO "Word";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
