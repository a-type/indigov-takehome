-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Constituent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "street_address_1" TEXT NOT NULL,
    "street_address_2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip_code" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_Constituent" ("city", "created_at", "email", "first_name", "id", "last_name", "phone_number", "state", "street_address_1", "street_address_2", "updated_at", "zip_code") SELECT "city", "created_at", "email", "first_name", "id", "last_name", "phone_number", "state", "street_address_1", "street_address_2", "updated_at", "zip_code" FROM "Constituent";
DROP TABLE "Constituent";
ALTER TABLE "new_Constituent" RENAME TO "Constituent";
CREATE UNIQUE INDEX "Constituent_email_key" ON "Constituent"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
