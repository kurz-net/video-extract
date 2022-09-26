-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_VideoClip" (
    "uuid" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "videoId" TEXT,
    "startTime" REAL NOT NULL,
    "endTime" REAL NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "downloaded" BOOLEAN NOT NULL DEFAULT false,
    "failed" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "VideoClip_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video" ("uuid") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_VideoClip" ("createdAt", "downloaded", "endTime", "failed", "startTime", "updatedAt", "uuid", "videoId") SELECT "createdAt", "downloaded", "endTime", "failed", "startTime", "updatedAt", "uuid", "videoId" FROM "VideoClip";
DROP TABLE "VideoClip";
ALTER TABLE "new_VideoClip" RENAME TO "VideoClip";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
