-- DropIndex
DROP INDEX "Music_album_key";

-- DropIndex
DROP INDEX "Music_artist_key";

-- DropIndex
DROP INDEX "Music_name_key";

-- DropIndex
DROP INDEX "Playlist_name_key";

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Song" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "album" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "genero" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "estado" BOOLEAN NOT NULL
);
INSERT INTO "new_Song" ("album", "artist", "duration", "estado", "genero", "id", "name", "year") SELECT "album", "artist", "duration", "estado", "genero", "id", "name", "year" FROM "Song";
DROP TABLE "Song";
ALTER TABLE "new_Song" RENAME TO "Song";
CREATE UNIQUE INDEX "Song_name_key" ON "Song"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
