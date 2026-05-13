/*
  Warnings:

  - A unique constraint covering the columns `[id_demande_client]` on the table `Demande client` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "likes demande" (
    "id_likes_demande" INTEGER NOT NULL,
    "id_client" INTEGER,
    "id_proprietaire" INTEGER,
    "time" TIMESTAMP(6) DEFAULT '2023-07-06 15:37:12.884385'::timestamp without time zone,

    CONSTRAINT "pk_id_likes_demande" PRIMARY KEY ("id_likes_demande")
);

-- CreateIndex
CREATE UNIQUE INDEX "u_d" ON "Demande client"("id_demande_client");

-- AddForeignKey
ALTER TABLE "likes demande" ADD CONSTRAINT "fk_c" FOREIGN KEY ("id_client") REFERENCES "Client"("id_client") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "likes demande" ADD CONSTRAINT "fk_d" FOREIGN KEY ("id_likes_demande") REFERENCES "Demande client"("id_demande_client") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "likes demande" ADD CONSTRAINT "fk_p" FOREIGN KEY ("id_proprietaire") REFERENCES "Proprietaire"("id_proprietaire") ON DELETE NO ACTION ON UPDATE NO ACTION;
