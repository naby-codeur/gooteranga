-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'PRESTATAIRE', 'ADMIN');

-- CreateEnum
CREATE TYPE "OffreType" AS ENUM ('HEBERGEMENT', 'GUIDE', 'ACTIVITE', 'RESTAURANT', 'CULTURE', 'EVENEMENT');

-- CreateEnum
CREATE TYPE "ActiviteCategorie" AS ENUM ('CULTURE', 'NATURE', 'AVENTURE', 'RELIGIEUX', 'GASTRONOMIE', 'PLAGE', 'SPORT', 'FESTIVAL', 'SHOPPING', 'BIEN_ETRE');

-- CreateEnum
CREATE TYPE "TypePublic" AS ENUM ('FAMILLE', 'SOLO', 'COUPLE', 'GROUPE', 'AFFAIRES', 'SENIORS', 'JEUNES');

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('GRATUIT', 'PRO', 'PREMIUM');

-- CreateEnum
CREATE TYPE "AbonnementStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'CANCELLED', 'PENDING');

-- CreateEnum
CREATE TYPE "BoostType" AS ENUM ('EXPERIENCE', 'REGIONAL', 'CATEGORIE', 'MENSUEL');

-- CreateEnum
CREATE TYPE "PrestataireType" AS ENUM ('HOTEL', 'GUIDE', 'AGENCE', 'RESTAURANT', 'ARTISAN', 'ASSOCIATION', 'AUBERGE', 'TRANSPORT', 'AUTRE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT,
    "telephone" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "langue" TEXT NOT NULL DEFAULT 'fr',
    "avatar" TEXT,
    "emailVerified" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prestataire" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "PrestataireType" NOT NULL,
    "nomEntreprise" TEXT NOT NULL,
    "description" TEXT,
    "adresse" TEXT,
    "ville" TEXT,
    "region" TEXT,
    "telephone" TEXT,
    "email" TEXT,
    "siteWeb" TEXT,
    "logo" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "planType" "PlanType" NOT NULL DEFAULT 'GRATUIT',
    "planExpiresAt" TIMESTAMP(3),
    "solde" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "nombreAvis" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prestataire_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Offre" (
    "id" TEXT NOT NULL,
    "prestataireId" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "OffreType" NOT NULL,
    "region" TEXT,
    "ville" TEXT,
    "adresse" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "prix" DECIMAL(10,2) NOT NULL,
    "prixMin" DECIMAL(10,2),
    "prixMax" DECIMAL(10,2),
    "prixUnite" TEXT,
    "images" TEXT[],
    "videos" TEXT[],
    "duree" INTEGER,
    "dureeMin" INTEGER,
    "dureeMax" INTEGER,
    "capacite" INTEGER,
    "disponibilite" JSONB,
    "activites" "ActiviteCategorie"[],
    "typesPublic" "TypePublic"[],
    "activitesProches" JSONB,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "nombreAvis" INTEGER NOT NULL DEFAULT 0,
    "vues" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "featuredExpiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Offre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "offreId" TEXT NOT NULL,
    "prestataireId" TEXT NOT NULL,
    "dateDebut" TIMESTAMP(3) NOT NULL,
    "dateFin" TIMESTAMP(3),
    "nombrePersonnes" INTEGER NOT NULL DEFAULT 1,
    "montant" DECIMAL(10,2) NOT NULL,
    "statut" "ReservationStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paiement" (
    "id" TEXT NOT NULL,
    "reservationId" TEXT NOT NULL,
    "prestataireId" TEXT NOT NULL,
    "montant" DECIMAL(10,2) NOT NULL,
    "methode" TEXT NOT NULL,
    "transactionId" TEXT,
    "statut" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "stripePaymentId" TEXT,
    "cinetpayId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Paiement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Avis" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "offreId" TEXT NOT NULL,
    "reservationId" TEXT,
    "rating" INTEGER NOT NULL,
    "commentaire" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Avis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favori" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "offreId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favori_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "prestataireId" TEXT NOT NULL,
    "reservationId" TEXT,
    "contenu" TEXT NOT NULL,
    "isFromUser" BOOLEAN NOT NULL DEFAULT true,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Statistique" (
    "id" TEXT NOT NULL,
    "prestataireId" TEXT,
    "offreId" TEXT,
    "type" TEXT NOT NULL,
    "valeur" DECIMAL(10,2) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "Statistique_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Retrait" (
    "id" TEXT NOT NULL,
    "prestataireId" TEXT NOT NULL,
    "montant" DECIMAL(10,2) NOT NULL,
    "methode" TEXT NOT NULL,
    "numeroCompte" TEXT,
    "statut" TEXT NOT NULL DEFAULT 'PENDING',
    "transactionId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Retrait_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "prestataireId" TEXT,
    "type" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "lien" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Abonnement" (
    "id" TEXT NOT NULL,
    "prestataireId" TEXT NOT NULL,
    "planType" "PlanType" NOT NULL,
    "montant" DECIMAL(10,2) NOT NULL,
    "dateDebut" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateFin" TIMESTAMP(3) NOT NULL,
    "statut" "AbonnementStatus" NOT NULL DEFAULT 'ACTIVE',
    "stripeSubscriptionId" TEXT,
    "methode" TEXT NOT NULL,
    "transactionId" TEXT,
    "autoRenouvellement" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Abonnement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Boost" (
    "id" TEXT NOT NULL,
    "prestataireId" TEXT NOT NULL,
    "offreId" TEXT,
    "type" "BoostType" NOT NULL,
    "region" TEXT,
    "categorie" TEXT,
    "montant" DECIMAL(10,2) NOT NULL,
    "dateDebut" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateFin" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "methode" TEXT NOT NULL,
    "transactionId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Boost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Prestataire_userId_key" ON "Prestataire"("userId");

-- CreateIndex
CREATE INDEX "Prestataire_type_idx" ON "Prestataire"("type");

-- CreateIndex
CREATE INDEX "Prestataire_isVerified_idx" ON "Prestataire"("isVerified");

-- CreateIndex
CREATE INDEX "Prestataire_planType_idx" ON "Prestataire"("planType");

-- CreateIndex
CREATE INDEX "Offre_prestataireId_idx" ON "Offre"("prestataireId");

-- CreateIndex
CREATE INDEX "Offre_type_idx" ON "Offre"("type");

-- CreateIndex
CREATE INDEX "Offre_region_idx" ON "Offre"("region");

-- CreateIndex
CREATE INDEX "Offre_isActive_idx" ON "Offre"("isActive");

-- CreateIndex
CREATE INDEX "Offre_isFeatured_idx" ON "Offre"("isFeatured");

-- CreateIndex
CREATE INDEX "Reservation_userId_idx" ON "Reservation"("userId");

-- CreateIndex
CREATE INDEX "Reservation_offreId_idx" ON "Reservation"("offreId");

-- CreateIndex
CREATE INDEX "Reservation_prestataireId_idx" ON "Reservation"("prestataireId");

-- CreateIndex
CREATE INDEX "Reservation_statut_idx" ON "Reservation"("statut");

-- CreateIndex
CREATE INDEX "Reservation_dateDebut_idx" ON "Reservation"("dateDebut");

-- CreateIndex
CREATE UNIQUE INDEX "Paiement_reservationId_key" ON "Paiement"("reservationId");

-- CreateIndex
CREATE UNIQUE INDEX "Paiement_transactionId_key" ON "Paiement"("transactionId");

-- CreateIndex
CREATE INDEX "Paiement_prestataireId_idx" ON "Paiement"("prestataireId");

-- CreateIndex
CREATE INDEX "Paiement_statut_idx" ON "Paiement"("statut");

-- CreateIndex
CREATE INDEX "Paiement_transactionId_idx" ON "Paiement"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "Avis_reservationId_key" ON "Avis"("reservationId");

-- CreateIndex
CREATE INDEX "Avis_offreId_idx" ON "Avis"("offreId");

-- CreateIndex
CREATE INDEX "Avis_userId_idx" ON "Avis"("userId");

-- CreateIndex
CREATE INDEX "Favori_userId_idx" ON "Favori"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Favori_userId_offreId_key" ON "Favori"("userId", "offreId");

-- CreateIndex
CREATE INDEX "Message_userId_prestataireId_idx" ON "Message"("userId", "prestataireId");

-- CreateIndex
CREATE INDEX "Message_reservationId_idx" ON "Message"("reservationId");

-- CreateIndex
CREATE INDEX "Statistique_prestataireId_idx" ON "Statistique"("prestataireId");

-- CreateIndex
CREATE INDEX "Statistique_offreId_idx" ON "Statistique"("offreId");

-- CreateIndex
CREATE INDEX "Statistique_date_idx" ON "Statistique"("date");

-- CreateIndex
CREATE UNIQUE INDEX "Retrait_transactionId_key" ON "Retrait"("transactionId");

-- CreateIndex
CREATE INDEX "Retrait_prestataireId_idx" ON "Retrait"("prestataireId");

-- CreateIndex
CREATE INDEX "Retrait_statut_idx" ON "Retrait"("statut");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_prestataireId_idx" ON "Notification"("prestataireId");

-- CreateIndex
CREATE INDEX "Notification_isRead_idx" ON "Notification"("isRead");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Abonnement_stripeSubscriptionId_key" ON "Abonnement"("stripeSubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "Abonnement_transactionId_key" ON "Abonnement"("transactionId");

-- CreateIndex
CREATE INDEX "Abonnement_prestataireId_idx" ON "Abonnement"("prestataireId");

-- CreateIndex
CREATE INDEX "Abonnement_statut_idx" ON "Abonnement"("statut");

-- CreateIndex
CREATE INDEX "Abonnement_dateFin_idx" ON "Abonnement"("dateFin");

-- CreateIndex
CREATE INDEX "Abonnement_stripeSubscriptionId_idx" ON "Abonnement"("stripeSubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "Boost_transactionId_key" ON "Boost"("transactionId");

-- CreateIndex
CREATE INDEX "Boost_prestataireId_idx" ON "Boost"("prestataireId");

-- CreateIndex
CREATE INDEX "Boost_offreId_idx" ON "Boost"("offreId");

-- CreateIndex
CREATE INDEX "Boost_type_idx" ON "Boost"("type");

-- CreateIndex
CREATE INDEX "Boost_isActive_idx" ON "Boost"("isActive");

-- CreateIndex
CREATE INDEX "Boost_dateFin_idx" ON "Boost"("dateFin");

-- AddForeignKey
ALTER TABLE "Prestataire" ADD CONSTRAINT "Prestataire_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offre" ADD CONSTRAINT "Offre_prestataireId_fkey" FOREIGN KEY ("prestataireId") REFERENCES "Prestataire"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_offreId_fkey" FOREIGN KEY ("offreId") REFERENCES "Offre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_prestataireId_fkey" FOREIGN KEY ("prestataireId") REFERENCES "Prestataire"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paiement" ADD CONSTRAINT "Paiement_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paiement" ADD CONSTRAINT "Paiement_prestataireId_fkey" FOREIGN KEY ("prestataireId") REFERENCES "Prestataire"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avis" ADD CONSTRAINT "Avis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avis" ADD CONSTRAINT "Avis_offreId_fkey" FOREIGN KEY ("offreId") REFERENCES "Offre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favori" ADD CONSTRAINT "Favori_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favori" ADD CONSTRAINT "Favori_offreId_fkey" FOREIGN KEY ("offreId") REFERENCES "Offre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_prestataireId_fkey" FOREIGN KEY ("prestataireId") REFERENCES "Prestataire"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Retrait" ADD CONSTRAINT "Retrait_prestataireId_fkey" FOREIGN KEY ("prestataireId") REFERENCES "Prestataire"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_prestataireId_fkey" FOREIGN KEY ("prestataireId") REFERENCES "Prestataire"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Abonnement" ADD CONSTRAINT "Abonnement_prestataireId_fkey" FOREIGN KEY ("prestataireId") REFERENCES "Prestataire"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Boost" ADD CONSTRAINT "Boost_prestataireId_fkey" FOREIGN KEY ("prestataireId") REFERENCES "Prestataire"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Boost" ADD CONSTRAINT "Boost_offreId_fkey" FOREIGN KEY ("offreId") REFERENCES "Offre"("id") ON DELETE CASCADE ON UPDATE CASCADE;
