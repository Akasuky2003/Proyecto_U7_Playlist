-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "email" TEXT,
    "password" TEXT,
    "last_session" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "date_born" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Song" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "artist" TEXT,
    "album" TEXT,
    "year" INTEGER NOT NULL,
    "genero" TEXT,
    "duration" INTEGER,
    "estado" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Playlist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "user" INTEGER NOT NULL,
    CONSTRAINT "Playlist_user_fkey" FOREIGN KEY ("user") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Music" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "artist" TEXT,
    "album" TEXT,
    "year" INTEGER NOT NULL,
    "genre" TEXT,
    "duration" INTEGER NOT NULL,
    CONSTRAINT "Music_id_fkey" FOREIGN KEY ("id") REFERENCES "Song" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Song_name_key" ON "Song"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Song_artist_key" ON "Song"("artist");

-- CreateIndex
CREATE UNIQUE INDEX "Song_album_key" ON "Song"("album");

-- CreateIndex
CREATE UNIQUE INDEX "Playlist_name_key" ON "Playlist"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Music_name_key" ON "Music"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Music_artist_key" ON "Music"("artist");

-- CreateIndex
CREATE UNIQUE INDEX "Music_album_key" ON "Music"("album");
