/*
  Warnings:

  - Added the required column `uuid` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Video" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uuid" TEXT NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "failed" BOOLEAN NOT NULL DEFAULT false,
    "title" TEXT,
    "originUrl" TEXT NOT NULL,
    "fileUrl" TEXT
);
INSERT INTO "new_Video" ("createdAt", "failed", "fileUrl", "id", "originUrl", "progress", "title") SELECT "createdAt", "failed", "fileUrl", "id", "originUrl", "progress", "title" FROM "Video";
DROP TABLE "Video";
ALTER TABLE "new_Video" RENAME TO "Video";
CREATE UNIQUE INDEX "Video_uuid_key" ON "Video"("uuid");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
