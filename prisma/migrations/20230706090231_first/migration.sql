/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Proprietaire vip` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "biens" ADD COLUMN     "image" BYTEA;

-- AlterTable
ALTER TABLE "biens vip" ADD COLUMN     "image" BYTEA;

-- CreateIndex
CREATE UNIQUE INDEX "unique_id_email" ON "Proprietaire vip"("email");

-- RenameIndex
ALTER INDEX "U_Proprietaire_email" RENAME TO "email_p_unique";
