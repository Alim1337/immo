-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CLIENT', 'PROPRIETAIRE', 'AGENCE');

-- CreateEnum
CREATE TYPE "TypeBien" AS ENUM ('APPARTEMENT', 'VILLA', 'MAISON', 'BUREAU', 'LOCAL_COMMERCIAL', 'TERRAIN', 'STUDIO');

-- CreateEnum
CREATE TYPE "TypeTransaction" AS ENUM ('LOCATION', 'VENTE', 'LOCATION_VACANCES');

-- CreateEnum
CREATE TYPE "EtatBien" AS ENUM ('DISPONIBLE', 'RESERVE', 'LOUE', 'VENDU', 'SUSPENDU');

-- CreateEnum
CREATE TYPE "StatutNegotiation" AS ENUM ('EN_COURS', 'ACCEPTEE', 'REFUSEE', 'ANNULEE', 'FINALISEE');

-- CreateEnum
CREATE TYPE "StatutDemande" AS ENUM ('EN_ATTENTE', 'EN_COURS', 'SATISFAITE', 'EXPIREE', 'ANNULEE');

-- CreateEnum
CREATE TYPE "StatutRdv" AS ENUM ('CONFIRME', 'ANNULE', 'EFFECTUE');

-- CreateEnum
CREATE TYPE "TypeNotification" AS ENUM ('NOUVELLE_NEGOCIATION', 'MESSAGE_RECU', 'RDV_CONFIRME', 'DEMANDE_INTERESSANTE', 'BIEN_MODIFIE', 'COMPTE_VERIFIE');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT,
    "raison_sociale" TEXT,
    "email" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "mot_de_passe" TEXT NOT NULL,
    "date_naissance" TIMESTAMP(3),
    "sexe" TEXT,
    "avatar_url" TEXT,
    "ville" TEXT,
    "wilaya" TEXT,
    "date_inscription" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "Role" NOT NULL DEFAULT 'CLIENT',
    "est_verifie" BOOLEAN NOT NULL DEFAULT false,
    "est_actif" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bien" (
    "id" SERIAL NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT,
    "type_bien" "TypeBien" NOT NULL,
    "type_transaction" "TypeTransaction" NOT NULL,
    "adresse" TEXT,
    "ville" TEXT NOT NULL,
    "wilaya" TEXT NOT NULL,
    "code_postal" TEXT,
    "superficie" DECIMAL(65,30),
    "nbr_chambres" INTEGER,
    "nbr_salles_bain" INTEGER,
    "nbr_etages" INTEGER,
    "prix" DECIMAL(65,30) NOT NULL,
    "etat" "EtatBien" NOT NULL DEFAULT 'DISPONIBLE',
    "est_meuble" BOOLEAN NOT NULL DEFAULT false,
    "images" TEXT[],
    "equipements" TEXT[],
    "date_publication" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_mise_a_jour" TIMESTAMP(3) NOT NULL,
    "proprietaire_id" INTEGER NOT NULL,

    CONSTRAINT "Bien_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Negotiation" (
    "id" SERIAL NOT NULL,
    "client_id" INTEGER NOT NULL,
    "proprietaire_id" INTEGER NOT NULL,
    "bien_id" INTEGER NOT NULL,
    "prix_propose" DECIMAL(65,30) NOT NULL,
    "statut" "StatutNegotiation" NOT NULL DEFAULT 'EN_COURS',
    "commentaire" TEXT,
    "duree_proposee" TEXT,
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_mise_a_jour" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Negotiation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "negotiation_id" INTEGER NOT NULL,
    "expediteur_id" INTEGER NOT NULL,
    "contenu" TEXT NOT NULL,
    "lu" BOOLEAN NOT NULL DEFAULT false,
    "date_envoi" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Demande" (
    "id" SERIAL NOT NULL,
    "client_id" INTEGER NOT NULL,
    "type_bien" "TypeBien",
    "type_transaction" "TypeTransaction",
    "prix_min" DECIMAL(65,30),
    "prix_max" DECIMAL(65,30),
    "superficie_min" DECIMAL(65,30),
    "nbr_chambres_min" INTEGER,
    "ville" TEXT,
    "wilaya" TEXT,
    "description" TEXT,
    "statut" "StatutDemande" NOT NULL DEFAULT 'EN_ATTENTE',
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_expiration" TIMESTAMP(3),

    CONSTRAINT "Demande_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interet" (
    "id" SERIAL NOT NULL,
    "demande_id" INTEGER NOT NULL,
    "proprietaire_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Interet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rdv" (
    "id" SERIAL NOT NULL,
    "negotiation_id" INTEGER,
    "client_id" INTEGER NOT NULL,
    "proprietaire_id" INTEGER NOT NULL,
    "date_rdv" TIMESTAMP(3) NOT NULL,
    "lieu" TEXT,
    "statut" "StatutRdv" NOT NULL DEFAULT 'CONFIRME',
    "notes" TEXT,

    CONSTRAINT "Rdv_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Avis" (
    "id" SERIAL NOT NULL,
    "auteur_id" INTEGER NOT NULL,
    "cible_id" INTEGER NOT NULL,
    "bien_id" INTEGER,
    "note" INTEGER NOT NULL,
    "commentaire" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Avis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favori" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "bien_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favori_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "type" "TypeNotification" NOT NULL,
    "titre" TEXT NOT NULL,
    "contenu" TEXT NOT NULL,
    "lue" BOOLEAN NOT NULL DEFAULT false,
    "lien" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Visite" (
    "id" SERIAL NOT NULL,
    "bien_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Visite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_telephone_key" ON "User"("telephone");

-- CreateIndex
CREATE UNIQUE INDEX "Interet_demande_id_proprietaire_id_key" ON "Interet"("demande_id", "proprietaire_id");

-- CreateIndex
CREATE UNIQUE INDEX "Favori_user_id_bien_id_key" ON "Favori"("user_id", "bien_id");

-- AddForeignKey
ALTER TABLE "Bien" ADD CONSTRAINT "Bien_proprietaire_id_fkey" FOREIGN KEY ("proprietaire_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Negotiation" ADD CONSTRAINT "Negotiation_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Negotiation" ADD CONSTRAINT "Negotiation_proprietaire_id_fkey" FOREIGN KEY ("proprietaire_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Negotiation" ADD CONSTRAINT "Negotiation_bien_id_fkey" FOREIGN KEY ("bien_id") REFERENCES "Bien"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_negotiation_id_fkey" FOREIGN KEY ("negotiation_id") REFERENCES "Negotiation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_expediteur_id_fkey" FOREIGN KEY ("expediteur_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Demande" ADD CONSTRAINT "Demande_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interet" ADD CONSTRAINT "Interet_demande_id_fkey" FOREIGN KEY ("demande_id") REFERENCES "Demande"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interet" ADD CONSTRAINT "Interet_proprietaire_id_fkey" FOREIGN KEY ("proprietaire_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rdv" ADD CONSTRAINT "Rdv_negotiation_id_fkey" FOREIGN KEY ("negotiation_id") REFERENCES "Negotiation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rdv" ADD CONSTRAINT "Rdv_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rdv" ADD CONSTRAINT "Rdv_proprietaire_id_fkey" FOREIGN KEY ("proprietaire_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avis" ADD CONSTRAINT "Avis_auteur_id_fkey" FOREIGN KEY ("auteur_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avis" ADD CONSTRAINT "Avis_cible_id_fkey" FOREIGN KEY ("cible_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avis" ADD CONSTRAINT "Avis_bien_id_fkey" FOREIGN KEY ("bien_id") REFERENCES "Bien"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favori" ADD CONSTRAINT "Favori_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favori" ADD CONSTRAINT "Favori_bien_id_fkey" FOREIGN KEY ("bien_id") REFERENCES "Bien"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visite" ADD CONSTRAINT "Visite_bien_id_fkey" FOREIGN KEY ("bien_id") REFERENCES "Bien"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
