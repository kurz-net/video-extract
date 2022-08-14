/*
  Warnings:

  - The primary key for the `Video` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Video` table. All the data in the column will be lost.
  - The primary key for the `VideoClip` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `VideoClip` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Video` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endTime` to the `VideoClip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `VideoClip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `VideoClip` table without a default value. This is not possible if the table is not empty.
  - The required column `uuid` was added to the `VideoClip` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Video" (
    "uuid" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "failed" BOOLEAN NOT NULL DEFAULT false,
    "title" TEXT,
    "originUrl" TEXT NOT NULL,
    "fileUrl" TEXT
);
INSERT INTO "new_Video" ("createdAt", "failed", "fileUrl", "originUrl", "progress", "title", "uuid") SELECT "createdAt", "failed", "fileUrl", "originUrl", "progress", "title", "uuid" FROM "Video";
DROP TABLE "Video";
ALTER TABLE "new_Video" RENAME TO "Video";
CREATE TABLE "new_VideoClip" (
    "uuid" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "videoId" TEXT,
    "startTime" REAL NOT NULL,
    "endTime" REAL NOT NULL,
    "downloaded" BOOLEAN NOT NULL DEFAULT false,
    "failed" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "VideoClip_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video" ("uuid") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_VideoClip" ("createdAt", "videoId") SELECT "createdAt", "videoId" FROM "VideoClip";
DROP TABLE "VideoClip";
ALTER TABLE "new_VideoClip" RENAME TO "VideoClip";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
