-- CreateTable
CREATE TABLE "SavedWordList" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "userId" INTEGER,
    "date_added" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SavedWordList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
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
    "savedWordListId" INTEGER,
    CONSTRAINT "Word_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Word_savedWordListId_fkey" FOREIGN KEY ("savedWordListId") REFERENCES "SavedWordList" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Word" ("date_added", "furigana", "id", "level", "meaning", "romaji", "userId", "word") SELECT "date_added", "furigana", "id", "level", "meaning", "romaji", "userId", "word" FROM "Word";
DROP TABLE "Word";
ALTER TABLE "new_Word" RENAME TO "Word";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
