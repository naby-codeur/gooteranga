import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, handleApiError } from '@/lib/api/response'
import { requireRole } from '@/lib/api/auth'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
})

// Types pour les résultats Prisma
type PrestataireWithAbonnements = {
  id: string
  planType: string
  planExpiresAt: Date | null
  abonnements: Array<{
    id: string
    planType: string
    montant: number
    dateDebut: Date
    dateFin: Date
    statut: string
    [key: string]: unknown
  }>
}

type Prestataire = {
  id: string
  planType: string
  planExpiresAt: Date | null
}

type Abonnement = {
  id: string
  prestataireId: string
  planType: string
  montant: number
  dateDebut: Date
  dateFin: Date
  statut: string
  [key: string]: unknown
}

/**
 * GET /api/abonnements
 * Récupère l'abonnement actif du prestataire
 */
export async function GET(request: NextRequest) {
  try {
    const user = await requireRole('PRESTATAIRE', request)

    // Récupérer le prestataire
    const prestataire = await prisma.prestataire.findUnique({
      where: { userId: user.id },
      include: {
        abonnements: {
          where: {
            statut: 'ACTIVE',
          },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    }) as PrestataireWithAbonnements | null

    if (!prestataire) {
      return errorResponse('Prestataire non trouvé', 404)
    }

    const abonnementActif = prestataire.abonnements[0] || null

    return successResponse({
      prestataire: {
        id: prestataire.id,
        planType: prestataire.planType,
        planExpiresAt: prestataire.planExpiresAt,
      },
      abonnement: abonnementActif,
    })
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * POST /api/abonnements
 * Crée un nouvel abonnement (avec Stripe Billing si méthode = 'stripe', sinon paiement cash)
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireRole('PRESTATAIRE', request)
    const body = await request.json()
    const { planType, methode, transactionId } = body

    if (!planType || !['PRO', 'PREMIUM'].includes(planType)) {
      return errorResponse('Plan invalide. Choisissez PRO ou PREMIUM', 400)
    }

    // Tarifs des plans (en FCFA)
    const tarifs = {
      PRO: 4000,
      PREMIUM: 11000,
    }

    const montant = tarifs[planType as 'PRO' | 'PREMIUM']
    const paymentMethod = methode || 'stripe'

    // Récupérer le prestataire
    const prestataire = await prisma.prestataire.findUnique({
      where: { userId: user.id },
      include: {
        user: true,
      },
    }) as Prestataire & { user: { email: string } } | null

    if (!prestataire) {
      return errorResponse('Prestataire non trouvé', 404)
    }

    // Calculer la date d'expiration (1 mois à partir de maintenant)
    const dateDebut = new Date()
    const dateFin = new Date()
    dateFin.setMonth(dateFin.getMonth() + 1)

    let stripeSubscriptionId: string | null = null
    let statut: 'ACTIVE' | 'PENDING' = 'ACTIVE'

    // Si paiement via Stripe Billing
    if (paymentMethod === 'stripe') {
      // Créer un produit Stripe pour le plan
      const product = await stripe.products.create({
        name: `Abonnement ${planType} - GooTeranga`,
        description: `Plan ${planType} pour prestataire`,
        metadata: {
          planType,
          prestataireId: prestataire.id,
        },
      })

      // Créer un prix récurrent (mensuel)
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: Math.round(montant * 100), // Convertir en centimes
        currency: 'xof',
        recurring: {
          interval: 'month',
        },
        metadata: {
          planType,
          prestataireId: prestataire.id,
        },
      })

      // Créer une session Checkout pour l'abonnement
      // Stripe Checkout supporte automatiquement : Visa, Mastercard, AMEX, Apple Pay, Google Pay
      const checkoutSession = await stripe.checkout.sessions.create({
        mode: 'subscription',
        customer_email: prestataire.user.email || user.email,
        line_items: [
          {
            price: price.id,
            quantity: 1,
          },
        ],
        payment_method_types: ['card'], // Supporte Visa, Mastercard, AMEX
        // Apple Pay et Google Pay sont automatiquement activés si configurés dans Stripe Dashboard
        success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/prestataire?subscription=success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/prestataire?subscription=cancel`,
        metadata: {
          prestataireId: prestataire.id,
          planType,
          userId: user.id,
        },
        subscription_data: {
          metadata: {
            prestataireId: prestataire.id,
            planType,
            userId: user.id,
          },
        },
      })

      // Retourner l'URL de checkout (l'abonnement sera créé après le paiement via webhook)
      return successResponse({
        checkoutUrl: checkoutSession.url,
        checkoutSessionId: checkoutSession.id,
        paymentMethods: ['visa', 'mastercard', 'amex', 'apple_pay', 'google_pay'],
        message: 'Redirigez l\'utilisateur vers l\'URL de checkout pour finaliser l\'abonnement',
      })
    }

    // Si paiement cash, créer directement l'abonnement
    if (paymentMethod === 'cash') {
      if (!transactionId) {
        return errorResponse('transactionId requis pour le paiement cash', 400)
      }

      const abonnement = await prisma.abonnement.create({
        data: {
          prestataireId: prestataire.id,
          planType,
          montant,
          dateDebut,
          dateFin,
          statut: 'ACTIVE',
          methode: 'cash',
          transactionId,
          autoRenouvellement: false, // Pas de renouvellement automatique pour le cash
        },
      }) as Abonnement

      // Mettre à jour le prestataire
      await prisma.prestataire.update({
        where: { id: prestataire.id },
        data: {
          planType,
          planExpiresAt: dateFin,
        },
      })

      return successResponse(abonnement, 'Abonnement créé avec succès (paiement cash)', 201)
    }

    return errorResponse('Méthode de paiement non supportée. Utilisez "stripe" ou "cash"', 400)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * PATCH /api/abonnements
 * Annule ou renouvelle un abonnement
 */
export async function PATCH(request: NextRequest) {
  try {
    const user = await requireRole('PRESTATAIRE', request)
    const body = await request.json()
    const { action } = body

    if (!action || !['cancel', 'renew'].includes(action)) {
      return errorResponse('Action invalide', 400)
    }

    const prestataire = await prisma.prestataire.findUnique({
      where: { userId: user.id },
    }) as Prestataire | null

    if (!prestataire) {
      return errorResponse('Prestataire non trouvé', 404)
    }

    if (action === 'cancel') {
      // Récupérer l'abonnement actif
      const abonnementActif = await prisma.abonnement.findFirst({
        where: {
          prestataireId: prestataire.id,
          statut: 'ACTIVE',
        },
        orderBy: { createdAt: 'desc' },
      }) as Abonnement & { stripeSubscriptionId: string | null } | null

      if (!abonnementActif) {
        return errorResponse('Aucun abonnement actif trouvé', 404)
      }

      // Si c'est un abonnement Stripe, l'annuler côté Stripe
      if (abonnementActif.stripeSubscriptionId) {
        try {
          await stripe.subscriptions.cancel(abonnementActif.stripeSubscriptionId)
        } catch (error) {
          console.error('Error canceling Stripe subscription:', error)
          // Continuer quand même avec l'annulation dans la base de données
        }
      }

      // Annuler l'abonnement dans la base de données
      await prisma.abonnement.updateMany({
        where: {
          prestataireId: prestataire.id,
          statut: 'ACTIVE',
        },
        data: {
          statut: 'CANCELLED',
          autoRenouvellement: false,
        },
      })

      // Passer au plan gratuit à l'expiration
      // Le plan reste actif jusqu'à la date d'expiration
      return successResponse({ message: 'Abonnement annulé. Il restera actif jusqu\'à la date d\'expiration.' })
    }

    if (action === 'renew') {
      // Renouveler l'abonnement
      const abonnementActif = await prisma.abonnement.findFirst({
        where: {
          prestataireId: prestataire.id,
          statut: 'ACTIVE',
        },
        orderBy: { createdAt: 'desc' },
      }) as Abonnement | null

      if (!abonnementActif) {
        return errorResponse('Aucun abonnement actif trouvé', 404)
      }

      const nouvelleDateFin = new Date(abonnementActif.dateFin)
      nouvelleDateFin.setMonth(nouvelleDateFin.getMonth() + 1)

      await prisma.abonnement.update({
        where: { id: abonnementActif.id },
        data: {
          dateFin: nouvelleDateFin,
          autoRenouvellement: true,
        },
      })

      await prisma.prestataire.update({
        where: { id: prestataire.id },
        data: {
          planExpiresAt: nouvelleDateFin,
        },
      })

      return successResponse({ message: 'Abonnement renouvelé avec succès' })
    }

    return errorResponse('Action non implémentée', 400)
  } catch (error) {
    return handleApiError(error)
  }
}

