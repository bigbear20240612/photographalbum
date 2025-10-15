-- CreateTable
CREATE TABLE IF NOT EXISTS "favorites" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "photo_id" TEXT,
    "album_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "favorites_user_id_idx" ON "favorites"("user_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "favorites_photo_id_idx" ON "favorites"("photo_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "favorites_album_id_idx" ON "favorites"("album_id");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "unique_user_photo_favorite" ON "favorites"("user_id", "photo_id");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "unique_user_album_favorite" ON "favorites"("user_id", "album_id");

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_photo_id_fkey" FOREIGN KEY ("photo_id") REFERENCES "photos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "albums"("id") ON DELETE CASCADE ON UPDATE CASCADE;
