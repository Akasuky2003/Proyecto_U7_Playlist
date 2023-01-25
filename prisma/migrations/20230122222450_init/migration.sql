/*
  Warnings:

  - Made the column `album` on table `Song` required. This step will fail if there are existing NULL values in that column.
  - Made the column `artist` on table `Song` required. This step will fail if there are existing NULL values in that column.
  - Made the column `duration` on table `Song` required. This step will fail if there are existing NULL values in that column.
  - Made the column `genero` on table `Song` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `Song` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `album` on table `Music` required. This step will fail if there are existing NULL values in that column.
  - Made the column `artist` on table `Music` required. This step will fail if there are existing NULL values in that column.
  - Made the column `genre` on table `Music` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `Music` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `Playlist` required. This step will fail if there are existing NULL values in that column.

*/
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
    "estado" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Song" ("album", "artist", "duration", "estado", "genero", "id", "name", "year") SELECT "album", "artist", "duration", "estado", "genero", "id", "name", "year" FROM "Song";
DROP TABLE "Song";
ALTER TABLE "new_Song" RENAME TO "Song";
CREATE UNIQUE INDEX "Song_name_key" ON "Song"("name");
CREATE UNIQUE INDEX "Song_artist_key" ON "Song"("artist");
CREATE UNIQUE INDEX "Song_album_key" ON "Song"("album");
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "last_session" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "date_born" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("date_born", "email", "id", "last_session", "name", "password", "updated_at") SELECT "date_born", "email", "id", "last_session", "name", "password", "updated_at" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE TABLE "new_Music" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "album" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "genre" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    CONSTRAINT "Music_id_fkey" FOREIGN KEY ("id") REFERENCES "Song" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Music" ("album", "artist", "duration", "genre", "id", "name", "year") SELECT "album", "artist", "duration", "genre", "id", "name", "year" FROM "Music";
DROP TABLE "Music";
ALTER TABLE "new_Music" RENAME TO "Music";
CREATE UNIQUE INDEX "Music_name_key" ON "Music"("name");
CREATE UNIQUE INDEX "Music_artist_key" ON "Music"("artist");
CREATE UNIQUE INDEX "Music_album_key" ON "Music"("album");
CREATE TABLE "new_Playlist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "user" INTEGER NOT NULL,
    CONSTRAINT "Playlist_user_fkey" FOREIGN KEY ("user") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Playlist" ("id", "name", "user") SELECT "id", "name", "user" FROM "Playlist";
DROP TABLE "Playlist";
ALTER TABLE "new_Playlist" RENAME TO "Playlist";
CREATE UNIQUE INDEX "Playlist_name_key" ON "Playlist"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
