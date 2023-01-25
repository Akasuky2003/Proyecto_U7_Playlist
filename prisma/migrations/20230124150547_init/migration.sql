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
    "estado" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_Song" ("album", "artist", "duration", "estado", "genero", "id", "name", "year") SELECT "album", "artist", "duration", "estado", "genero", "id", "name", "year" FROM "Song";
DROP TABLE "Song";
ALTER TABLE "new_Song" RENAME TO "Song";
CREATE UNIQUE INDEX "Song_name_key" ON "Song"("name");
CREATE UNIQUE INDEX "Song_artist_key" ON "Song"("artist");
CREATE UNIQUE INDEX "Song_album_key" ON "Song"("album");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
