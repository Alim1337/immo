-- CreateTable
CREATE TABLE "Client" (
    "id_client" SERIAL NOT NULL,
    "nom" VARCHAR(255) NOT NULL,
    "prenom" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "telephone" DECIMAL NOT NULL,
    "mdps" VARCHAR(255) NOT NULL,
    "date_naissance" DATE,
    "sex" VARCHAR(255),
    "date_dinscription" DATE,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id_client")
);

-- CreateTable
CREATE TABLE "Client vip" (
    "id_client_vip" SERIAL NOT NULL,
    "id_client" INTEGER NOT NULL,
    "nom" VARCHAR(255) NOT NULL,
    "prenom" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "telephone" DECIMAL NOT NULL,
    "mdps" VARCHAR(255) NOT NULL,
    "date_naissance" DATE,
    "sex" VARCHAR(255),
    "date_dinscription" DATE,

    CONSTRAINT "Client vip_pkey" PRIMARY KEY ("id_client_vip")
);

-- CreateTable
CREATE TABLE "Demande client" (
    "id_demande_client" SERIAL NOT NULL,
    "id_client" INTEGER NOT NULL,
    "type bien" VARCHAR,
    "type de transaction" VARCHAR,
    "prix minimum" DECIMAL,
    "prix maximum" DECIMAL,
    "surface minimum" DECIMAL,
    "nbr chambre minimum" VARCHAR,
    "date debut rechercher" DATE,
    "date fin recherche" DATE,
    "statut demande" VARCHAR,

    CONSTRAINT "Demande_client_pkey" PRIMARY KEY ("id_demande_client")
);

-- CreateTable
CREATE TABLE "Demande client valide" (
    "id_demande_client" SERIAL NOT NULL,
    "id_client" INTEGER NOT NULL,
    "type bien" VARCHAR,
    "type de transaction" VARCHAR,
    "prix minimum" DECIMAL,
    "prix maximum" DECIMAL,
    "surface minimum" DECIMAL,
    "nbr chambre minimum" VARCHAR,
    "date debut rechercher" DATE,
    "date fin recherche" DATE,
    "statut demande" VARCHAR,
    "id_demande_client_valid" SERIAL NOT NULL,

    CONSTRAINT "Demande client valide_pkey" PRIMARY KEY ("id_demande_client_valid")
);

-- CreateTable
CREATE TABLE "Demande client vip " (
    "id_demande_client" SERIAL NOT NULL,
    "id_client" INTEGER NOT NULL,
    "type bien" VARCHAR,
    "type de transaction" VARCHAR,
    "prix minimum" DECIMAL,
    "prix maximum" DECIMAL,
    "surface minimum" DECIMAL,
    "nbr chambre minimum" VARCHAR,
    "date debut rechercher" DATE,
    "date fin recherche" DATE,
    "statut demande" VARCHAR,
    "id_demande_client_vip" SERIAL NOT NULL,

    CONSTRAINT "Demande client vip _pkey" PRIMARY KEY ("id_demande_client_vip")
);

-- CreateTable
CREATE TABLE "Demande client vip valid " (
    "id_demande_client" SERIAL NOT NULL,
    "id_client" INTEGER NOT NULL,
    "type bien" VARCHAR,
    "type de transaction" VARCHAR,
    "prix minimum" DECIMAL,
    "prix maximum" DECIMAL,
    "surface minimum" DECIMAL,
    "nbr chambre minimum" VARCHAR,
    "date debut rechercher" DATE,
    "date fin recherche" DATE,
    "statut demande" VARCHAR,
    "id_demande_client_vip" SERIAL NOT NULL,
    "id_demande_client_vip_valid" SERIAL NOT NULL,

    CONSTRAINT "demande client vip valid _pkey" PRIMARY KEY ("id_demande_client_vip_valid")
);

-- CreateTable
CREATE TABLE "Proprietaire" (
    "id_proprietaire" SERIAL NOT NULL,
    "nom" VARCHAR(255) NOT NULL,
    "prenom" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "ville" VARCHAR(255),
    "telephone" DECIMAL NOT NULL,
    "mdps" VARCHAR(255) NOT NULL,
    "date_naissance" DATE,
    "sex" VARCHAR(255),
    "date_dinscription" DATE,
    "id_client" INTEGER,

    CONSTRAINT "Proprietaire_pkey" PRIMARY KEY ("id_proprietaire")
);

-- CreateTable
CREATE TABLE "Proprietaire vip" (
    "id_proprietaire_vip" SERIAL NOT NULL,
    "id_proprietaire" INTEGER NOT NULL,
    "nom" VARCHAR(255) NOT NULL,
    "prenom" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "ville" VARCHAR(255),
    "telephone" DECIMAL NOT NULL,
    "mdps" VARCHAR(255) NOT NULL,
    "date_naissance" DATE,
    "sex" VARCHAR(255),
    "date_dinscription" DATE,
    "id_client" INTEGER,

    CONSTRAINT "Proprietaire vip_pkey" PRIMARY KEY ("id_proprietaire_vip")
);

-- CreateTable
CREATE TABLE "Rdv" (
    "id_rdv" SERIAL NOT NULL,
    "id_demande_client_valid" INTEGER,
    "date_rdv" DATE NOT NULL,
    "heure_rdv" TIME(6),
    "lieu_rdv" VARCHAR,
    "id_client" SERIAL NOT NULL,
    "id_proprietaire" SERIAL NOT NULL,
    "id_negotiation" INTEGER,

    CONSTRAINT "RDV_pkey" PRIMARY KEY ("id_rdv")
);

-- CreateTable
CREATE TABLE "Rdv Vip " (
    "id_rdv" SERIAL NOT NULL,
    "id_demande_client_valid" INTEGER,
    "date_rdv" DATE NOT NULL,
    "heure_rdv" TIME(6),
    "lieu_rdv" VARCHAR,
    "id_client" SERIAL NOT NULL,
    "id_proprietaire" SERIAL NOT NULL,
    "id_rdv_vip" SERIAL NOT NULL,
    "id_negotiation" INTEGER,

    CONSTRAINT "Rdv Vip _pkey" PRIMARY KEY ("id_rdv_vip")
);

-- CreateTable
CREATE TABLE "admin" (
    "id_admin" SERIAL NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id_admin")
);

-- CreateTable
CREATE TABLE "biens" (
    "id_biens" SERIAL NOT NULL,
    "description" VARCHAR(255),
    "type_bien" VARCHAR(255),
    "adresse" VARCHAR(255),
    "ville" VARCHAR(255),
    "code_postal" VARCHAR(255)[],
    "prix_estime" DECIMAL,
    "etat" VARCHAR(255),
    "id_proprietaire" INTEGER NOT NULL,
    "nbrChambre" VARCHAR(255),

    CONSTRAINT "biens_pkey" PRIMARY KEY ("id_biens")
);

-- CreateTable
CREATE TABLE "biens loue" (
    "id_biens_loue" SERIAL NOT NULL,
    "id_biens" INTEGER NOT NULL,
    "id_client" INTEGER NOT NULL,
    "description" VARCHAR(255),
    "type_bien" VARCHAR(255),
    "adresse" VARCHAR(255),
    "ville" VARCHAR(255),
    "code_postal" VARCHAR(255)[],
    "prix_estime" DECIMAL,
    "etat" VARCHAR(255),

    CONSTRAINT "biens loue_pkey" PRIMARY KEY ("id_biens_loue")
);

-- CreateTable
CREATE TABLE "biens loue vip " (
    "id_biens_loue" SERIAL NOT NULL,
    "id_biens" INTEGER NOT NULL,
    "id_client" INTEGER NOT NULL,
    "description" VARCHAR(255),
    "type_bien" VARCHAR(255),
    "adresse" VARCHAR(255),
    "ville" VARCHAR(255),
    "code_postal" VARCHAR(255)[],
    "prix_estime" DECIMAL,
    "etat" VARCHAR(255),
    "id_bien_loue_vip" SERIAL NOT NULL,

    CONSTRAINT "biens loue vip _pkey" PRIMARY KEY ("id_bien_loue_vip")
);

-- CreateTable
CREATE TABLE "biens vip" (
    "id_biens" SERIAL NOT NULL,
    "description" VARCHAR(255),
    "type_bien" VARCHAR(255),
    "adresse" VARCHAR(255),
    "ville" VARCHAR(255),
    "code_postal" VARCHAR(255)[],
    "prix_estime" DECIMAL,
    "etat" VARCHAR(255),
    "id_proprietaire" INTEGER NOT NULL,
    "nbrChambre" VARCHAR(255),
    "type_location_vip" VARCHAR,
    "id_proprietaire_vip" INTEGER,

    CONSTRAINT "biens vip_pkey" PRIMARY KEY ("id_biens")
);

-- CreateTable
CREATE TABLE "likes" (
    "id_likes" SERIAL NOT NULL,
    "client_id" INTEGER NOT NULL,
    "proprietaire_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "id_bien" INTEGER NOT NULL,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id_likes")
);

-- CreateTable
CREATE TABLE "message" (
    "id_message" SERIAL NOT NULL,
    "negotiation_id" INTEGER NOT NULL,
    "sender_id" INTEGER NOT NULL,
    "receiver_id" INTEGER NOT NULL,
    "content" VARCHAR(255),
    "timestamp" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_pkey" PRIMARY KEY ("id_message")
);

-- CreateTable
CREATE TABLE "negotiation" (
    "id_negotiation" SERIAL NOT NULL,
    "client_id" INTEGER NOT NULL,
    "proprietaire_id" INTEGER NOT NULL,
    "bien_id" INTEGER NOT NULL,
    "prix_propose" DECIMAL,
    "statut" VARCHAR(255),
    "commentaire" VARCHAR(255),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "duree" VARCHAR,
    "id_like" INTEGER,

    CONSTRAINT "negotiation_pkey" PRIMARY KEY ("id_negotiation")
);

-- CreateIndex
CREATE UNIQUE INDEX "U_client_email" ON "Client"("email");

-- CreateIndex
CREATE UNIQUE INDEX "U_client_telephone" ON "Client"("telephone");

-- CreateIndex
CREATE UNIQUE INDEX "unique_id_c" ON "Client vip"("id_client");

-- CreateIndex
CREATE UNIQUE INDEX "U_Proprietaire_email" ON "Proprietaire"("email");

-- CreateIndex
CREATE UNIQUE INDEX "unique_id_p" ON "Proprietaire vip"("id_proprietaire");

-- CreateIndex
CREATE UNIQUE INDEX "u_admin_email" ON "admin"("email");

-- AddForeignKey
ALTER TABLE "Client vip" ADD CONSTRAINT "Client vip_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "Client"("id_client") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Demande client" ADD CONSTRAINT "fk_demande_client" FOREIGN KEY ("id_client") REFERENCES "Client"("id_client") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Demande client valide" ADD CONSTRAINT "fk_demande_client_valid" FOREIGN KEY ("id_demande_client_valid") REFERENCES "Demande client"("id_demande_client") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Demande client valide" ADD CONSTRAINT "fk_demande_client_valid_client" FOREIGN KEY ("id_client") REFERENCES "Client"("id_client") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Demande client vip " ADD CONSTRAINT "fk_demande_client_vip" FOREIGN KEY ("id_demande_client_vip") REFERENCES "Demande client"("id_demande_client") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Demande client vip " ADD CONSTRAINT "fk_demande_client_vip_client" FOREIGN KEY ("id_client") REFERENCES "Client"("id_client") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Demande client vip valid " ADD CONSTRAINT "fk_demande_client_vip" FOREIGN KEY ("id_demande_client") REFERENCES "Demande client vip "("id_demande_client_vip") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Demande client vip valid " ADD CONSTRAINT "fk_demande_client_vip_client" FOREIGN KEY ("id_client") REFERENCES "Client vip"("id_client_vip") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Proprietaire" ADD CONSTRAINT "id_client_in_proprietaire_fk" FOREIGN KEY ("id_client") REFERENCES "Client"("id_client") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Proprietaire vip" ADD CONSTRAINT "Proprietaire vip_id_proprietaire_fkey" FOREIGN KEY ("id_proprietaire") REFERENCES "Proprietaire"("id_proprietaire") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Rdv" ADD CONSTRAINT "fk_rdv_client" FOREIGN KEY ("id_client") REFERENCES "Client"("id_client") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Rdv" ADD CONSTRAINT "fk_rdv_negotiation" FOREIGN KEY ("id_negotiation") REFERENCES "negotiation"("id_negotiation") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Rdv" ADD CONSTRAINT "fk_rdv_p" FOREIGN KEY ("id_proprietaire") REFERENCES "Proprietaire"("id_proprietaire") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Rdv Vip " ADD CONSTRAINT "fk_rdv_vip" FOREIGN KEY ("id_rdv") REFERENCES "Rdv"("id_rdv") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Rdv Vip " ADD CONSTRAINT "fk_rdv_vip_client_vip" FOREIGN KEY ("id_client") REFERENCES "Client vip"("id_client_vip") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Rdv Vip " ADD CONSTRAINT "fk_rdv_vip_p" FOREIGN KEY ("id_proprietaire") REFERENCES "Proprietaire vip"("id_proprietaire_vip") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "biens" ADD CONSTRAINT "biens_id_proprietaire_fkey" FOREIGN KEY ("id_proprietaire") REFERENCES "Proprietaire"("id_proprietaire") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "biens loue" ADD CONSTRAINT "biens loue_id_biens_fkey" FOREIGN KEY ("id_biens") REFERENCES "biens"("id_biens") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "biens loue" ADD CONSTRAINT "biens loue_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "Client"("id_client") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "biens loue vip " ADD CONSTRAINT "fk_bien_loue_bip" FOREIGN KEY ("id_biens_loue") REFERENCES "biens loue"("id_biens_loue") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "biens vip" ADD CONSTRAINT "fk_bien_vip " FOREIGN KEY ("id_biens") REFERENCES "biens"("id_biens") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "biens vip" ADD CONSTRAINT "fk_bien_vip_" FOREIGN KEY ("id_proprietaire") REFERENCES "Proprietaire"("id_proprietaire") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "biens vip" ADD CONSTRAINT "fk_proprietaire_vip_to_biens_vip" FOREIGN KEY ("id_proprietaire_vip") REFERENCES "Proprietaire vip"("id_proprietaire_vip") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "fk_bien_like" FOREIGN KEY ("id_bien") REFERENCES "biens"("id_biens") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "fk_likes_client" FOREIGN KEY ("client_id") REFERENCES "Client"("id_client") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "fk_likes_proprietaire" FOREIGN KEY ("proprietaire_id") REFERENCES "Proprietaire"("id_proprietaire") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_negotiation_id_fkey" FOREIGN KEY ("negotiation_id") REFERENCES "negotiation"("id_negotiation") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "Proprietaire"("id_proprietaire") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "Client"("id_client") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "negotiation" ADD CONSTRAINT "negotiation_bien_id_fkey" FOREIGN KEY ("bien_id") REFERENCES "biens"("id_biens") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "negotiation" ADD CONSTRAINT "negotiation_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id_client") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "negotiation" ADD CONSTRAINT "negotiation_like_id_fkey" FOREIGN KEY ("id_negotiation") REFERENCES "negotiation"("id_negotiation") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "negotiation" ADD CONSTRAINT "negotiation_proprietaire_id_fkey" FOREIGN KEY ("proprietaire_id") REFERENCES "Proprietaire"("id_proprietaire") ON DELETE NO ACTION ON UPDATE NO ACTION;
