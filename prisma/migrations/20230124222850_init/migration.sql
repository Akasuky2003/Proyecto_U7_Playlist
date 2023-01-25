/*
  Warnings:

  - You are about to drop the column `genre` on the `Music` table. All the data in the column will be lost.
  - You are about to drop the column `playlist` on the `Music` table. All the data in the column will be lost.
  - Added the required column `genero` to the `Music` table without a default value. This is not possible if the table is not empty.
  - Added the required column `playlist_id` to the `Music` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Music" (
    "playlist_id" INTEGER NOT NULL,
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "album" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "genero" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    CONSTRAINT "Music_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "Playlist" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Music_id_fkey" FOREIGN KEY ("id") REFERENCES "Song" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Music" ("album", "artist", "duration", "id", "name", "year") SELECT "album", "artist", "duration", "id", "name", "year" FROM "Music";
DROP TABLE "Music";
ALTER TABLE "new_Music" RENAME TO "Music";
CREATE UNIQUE INDEX "Music_name_key" ON "Music"("name");
CREATE UNIQUE INDEX "Music_artist_key" ON "Music"("artist");
CREATE UNIQUE INDEX "Music_album_key" ON "Music"("album");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
