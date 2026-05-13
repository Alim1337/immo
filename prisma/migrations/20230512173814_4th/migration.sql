/*
  Warnings:

  - Made the column `adresse` on table `Biens` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Biens" ALTER COLUMN "adresse" SET NOT NULL,
ALTER COLUMN "prix_estime" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Client vip" ALTER COLUMN "telephone" SET DATA TYPE TEXT,
ALTER COLUMN "date_naissance" SET DATA TYPE TEXT,
ALTER COLUMN "date_dinscription" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Proprietaire" ADD COLUMN     "clientId" INTEGER,
ALTER COLUMN "telephone" SET DATA TYPE TEXT,
ALTER COLUMN "date_naissance" SET DATA TYPE TEXT,
ALTER COLUMN "date_dinscription" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "ProprietaireVip" ALTER COLUMN "telephone" SET DATA TYPE TEXT,
ALTER COLUMN "date_naissance" SET DATA TYPE TEXT,
ALTER COLUMN "date_dinscription" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Proprietaire" ADD CONSTRAINT "Proprietaire_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;
