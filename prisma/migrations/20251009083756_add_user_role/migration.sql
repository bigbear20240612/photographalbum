-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "avatar_url" TEXT,
    "display_name" TEXT,
    "bio" TEXT,
    "location" TEXT,
    "website_url" TEXT,
    "instagram_url" TEXT,
    "weibo_url" TEXT,
    "photography_tags" TEXT,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "role" TEXT NOT NULL DEFAULT 'USER',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_users" ("avatar_url", "bio", "created_at", "display_name", "email", "email_verified", "id", "instagram_url", "location", "password_hash", "photography_tags", "status", "updated_at", "username", "website_url", "weibo_url") SELECT "avatar_url", "bio", "created_at", "display_name", "email", "email_verified", "id", "instagram_url", "location", "password_hash", "photography_tags", "status", "updated_at", "username", "website_url", "weibo_url" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
