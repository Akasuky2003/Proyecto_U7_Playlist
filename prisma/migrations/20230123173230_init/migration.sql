/*
  Warnings:

  - Added the required column `playlist` to the `Music` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Music" (
    "playlist" INTEGER NOT NULL,
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "artist" TEXT,
    "album" TEXT,
    "year" INTEGER NOT NULL,
    "genre" TEXT,
    "duration" INTEGER NOT NULL,
    CONSTRAINT "Music_playlist_fkey" FOREIGN KEY ("playlist") REFERENCES "Playlist" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Music_id_fkey" FOREIGN KEY ("id") REFERENCES "Song" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Music" ("album", "artist", "duration", "genre", "id", "name", "year") SELECT "album", "artist", "duration", "genre", "id", "name", "year" FROM "Music";
DROP TABLE "Music";
ALTER TABLE "new_Music" RENAME TO "Music";
CREATE UNIQUE INDEX "Music_name_key" ON "Music"("name");
CREATE UNIQUE INDEX "Music_artist_key" ON "Music"("artist");
CREATE UNIQUE INDEX "Music_album_key" ON "Music"("album");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
