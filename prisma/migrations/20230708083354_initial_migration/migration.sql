/*
  Warnings:

  - You are about to drop the `likes demande` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "likes demande" DROP CONSTRAINT "fk_c";

-- DropForeignKey
ALTER TABLE "likes demande" DROP CONSTRAINT "fk_d";

-- DropForeignKey
ALTER TABLE "likes demande" DROP CONSTRAINT "fk_p";

-- DropTable
DROP TABLE "likes demande";

-- CreateTable
CREATE TABLE "interesse" (
    "id_interesse" SERIAL NOT NULL,
    "iid_demande_client" INTEGER NOT NULL,
    "id_proprietaire" INTEGER NOT NULL,
    "time" TIMETZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "interesse_pkey" PRIMARY KEY ("id_interesse")
);

-- CreateTable
CREATE TABLE "negotiation demande" (
    "id_negotiation_demande" SERIAL NOT NULL,
    "id_interesse" INTEGER NOT NULL,
    "id_proprietaire" INTEGER,
    "id_client" INTEGER,
    "prix_propose" DECIMAL,
    "statut" VARCHAR,
    "created_at" TIMETZ(6) DEFAULT '01:42:37.641086+02'::time with time zone,
    "duree" VARCHAR,
    "commentaire" VARCHAR,

    CONSTRAINT "negotiation demande_pkey" PRIMARY KEY ("id_negotiation_demande")
);

-- AddForeignKey
ALTER TABLE "interesse" ADD CONSTRAINT "fk_dc" FOREIGN KEY ("iid_demande_client") REFERENCES "Demande client"("id_demande_client") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "interesse" ADD CONSTRAINT "fk_pp" FOREIGN KEY ("id_proprietaire") REFERENCES "Proprietaire"("id_proprietaire") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "negotiation demande" ADD CONSTRAINT "fk_ccc" FOREIGN KEY ("id_client") REFERENCES "Client"("id_client") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "negotiation demande" ADD CONSTRAINT "fk_inter" FOREIGN KEY ("id_interesse") REFERENCES "interesse"("id_interesse") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "negotiation demande" ADD CONSTRAINT "fk_ppp" FOREIGN KEY ("id_proprietaire") REFERENCES "Proprietaire"("id_proprietaire") ON DELETE NO ACTION ON UPDATE NO ACTION;
