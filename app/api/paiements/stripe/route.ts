import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, handleApiError } from '@/lib/api/response'
import { requireAuth } from '@/lib/api/auth'
import Stripe from 'stripe'

// Types pour les résultats Prisma
type ReservationWithOffre = {
  id: string
  userId: string
  statut: string
  montant: number | string
  offreId: string
  prestataireId: string
  offre: {
    id: string
    titre: string
    [key: string]: unknown
  }
  [key: string]: unknown
}

type Paiement = {
  id: string
  reservationId: string
  prestataireId: string
  montant: number | string
  statut: string
  methode: string
  stripePaymentId?: string | null
  [key: string]: unknown
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
})

/**
 * POST /api/paiements/stripe/create-intent
 * Crée un PaymentIntent Stripe pour une réservation
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const body = await request.json()
    const { reservationId } = body

    if (!reservationId) {
      return errorResponse('ID de réservation requis', 400)
    }

    // Vérifier que la réservation existe et appartient à l'utilisateur
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: {
        offre: true,
      },
    }) as ReservationWithOffre | null

    if (!reservation) {
      return errorResponse('Réservation non trouvée', 404)
    }

    if (reservation.userId !== user.id) {
      return errorResponse('Accès refusé', 403)
    }

    if (reservation.statut !== 'PENDING') {
      return errorResponse('Cette réservation ne peut plus être payée', 400)
    }

    // Vérifier qu'il n'y a pas déjà un paiement
    const existingPaiement = await prisma.paiement.findUnique({
      where: { reservationId },
    }) as Paiement | null

    if (existingPaiement && existingPaiement.statut === 'PAID') {
      return errorResponse('Cette réservation a déjà été payée', 400)
    }

    // Récupérer le prestataire pour vérifier son compte Stripe Connect
    const prestataire = await prisma.prestataire.findUnique({
      where: { id: reservation.prestataireId },
    }) as { id: string; stripeAccountId: string | null; stripeOnboardingCompleted: boolean } | null

    if (!prestataire) {
      return errorResponse('Prestataire non trouvé', 404)
    }

    // Vérifier que le prestataire a un compte Stripe Connect configuré
    if (!prestataire.stripeAccountId || !prestataire.stripeOnboardingCompleted) {
      return errorResponse('Le prestataire n\'a pas encore configuré son compte de paiement. Veuillez contacter le prestataire ou choisir le paiement en espèces.', 400)
    }

    // Créer le PaymentIntent Stripe avec Stripe Connect Standard
    // L'argent va directement au compte du prestataire (on_behalf_of + transfer_data)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(reservation.montant) * 100), // Convertir en centimes
      currency: 'xof', // Franc CFA
      // Stripe Connect : paiement direct au prestataire
      on_behalf_of: prestataire.stripeAccountId,
      transfer_data: {
        destination: prestataire.stripeAccountId,
      },
      // Application fee = 0 (GooTeranga ne prend pas de commission)
      application_fee_amount: 0,
      metadata: {
        reservationId,
        userId: user.id,
        offreId: reservation.offreId,
        prestataireId: prestataire.id,
      },
      description: `Réservation: ${reservation.offre.titre}`,
    })

    // Créer ou mettre à jour le paiement dans la base de données
    // Montant 100% pour le prestataire (pas de commission)
    const paiement = await prisma.paiement.upsert({
      where: { reservationId },
      create: {
        reservationId,
        prestataireId: reservation.prestataireId,
        montant: reservation.montant,
        methode: 'stripe',
        stripePaymentId: paymentIntent.id,
        statut: 'PENDING',
      },
      update: {
        stripePaymentId: paymentIntent.id,
        statut: 'PENDING',
      },
    }) as Paiement

    return successResponse({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      paiement,
      paymentMethods: ['visa', 'mastercard', 'amex', 'apple_pay', 'google_pay'],
      message: 'Méthodes de paiement supportées : Visa, Mastercard, AMEX, Apple Pay, Google Pay',
    })
  } catch (error) {
    return handleApiError(error)
  }
}

