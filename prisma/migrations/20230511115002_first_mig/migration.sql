-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" INTEGER NOT NULL,
    "mdps" TEXT NOT NULL,
    "date_naissance" TIMESTAMP(3),
    "sex" TEXT,
    "date_dinscription" TIMESTAMP(3),

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client vip" (
    "id" SERIAL NOT NULL,
    "nom" TEXT,
    "prenom" TEXT,
    "email" TEXT,
    "telephone" INTEGER,
    "mdps" TEXT,
    "date_naissance" TIMESTAMP(3),
    "sex" TEXT,
    "date_dinscription" TIMESTAMP(3),
    "clientId" INTEGER NOT NULL,

    CONSTRAINT "Client vip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proprietaire" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "ville" TEXT,
    "telephone" DOUBLE PRECISION NOT NULL,
    "mdps" TEXT NOT NULL,
    "date_naissance" TIMESTAMP(3),
    "sex" TEXT,
    "date_dinscription" TIMESTAMP(3),

    CONSTRAINT "Proprietaire_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProprietaireVip" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "ville" TEXT,
    "telephone" DOUBLE PRECISION NOT NULL,
    "mdps" TEXT NOT NULL,
    "date_naissance" TIMESTAMP(3),
    "sex" TEXT,
    "date_dinscription" TIMESTAMP(3),
    "proprietaireId" INTEGER NOT NULL,

    CONSTRAINT "ProprietaireVip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Biens" (
    "id" SERIAL NOT NULL,
    "description" TEXT,
    "type_bien" TEXT,
    "adresse" TEXT,
    "ville" TEXT,
    "code_postal" TEXT[],
    "prix_estime" DOUBLE PRECISION,
    "etat" TEXT,
    "id_proprietaire" INTEGER NOT NULL,

    CONSTRAINT "Biens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client vip" ADD CONSTRAINT "Client vip_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProprietaireVip" ADD CONSTRAINT "ProprietaireVip_proprietaireId_fkey" FOREIGN KEY ("proprietaireId") REFERENCES "Proprietaire"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Biens" ADD CONSTRAINT "Biens_id_proprietaire_fkey" FOREIGN KEY ("id_proprietaire") REFERENCES "Proprietaire"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
