/*
  Warnings:

  - Made the column `album` on table `Music` required. This step will fail if there are existing NULL values in that column.
  - Made the column `artist` on table `Music` required. This step will fail if there are existing NULL values in that column.
  - Made the column `genre` on table `Music` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `Music` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Music" (
    "playlist" INTEGER NOT NULL,
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "album" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "genre" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    CONSTRAINT "Music_playlist_fkey" FOREIGN KEY ("playlist") REFERENCES "Playlist" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Music_id_fkey" FOREIGN KEY ("id") REFERENCES "Song" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Music" ("album", "artist", "duration", "genre", "id", "name", "playlist", "year") SELECT "album", "artist", "duration", "genre", "id", "name", "playlist", "year" FROM "Music";
DROP TABLE "Music";
ALTER TABLE "new_Music" RENAME TO "Music";
CREATE UNIQUE INDEX "Music_name_key" ON "Music"("name");
CREATE UNIQUE INDEX "Music_artist_key" ON "Music"("artist");
CREATE UNIQUE INDEX "Music_album_key" ON "Music"("album");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
