import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, handleApiError } from '@/lib/api/response'
import { requireRole } from '@/lib/api/auth'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
})

type Prestataire = {
  id: string
  userId: string
  stripeAccountId: string | null
  stripeOnboardingCompleted: boolean
  [key: string]: unknown
}

/**
 * GET /api/stripe-connect/onboarding
 * Récupère le statut de l'onboarding Stripe Connect du prestataire
 */
export async function GET(request: NextRequest) {
  try {
    const user = await requireRole('PRESTATAIRE', request)

    const prestataire = await prisma.prestataire.findUnique({
      where: { userId: user.id },
    }) as Prestataire | null

    if (!prestataire) {
      return errorResponse('Prestataire non trouvé', 404)
    }

    return successResponse({
      hasStripeAccount: !!prestataire.stripeAccountId,
      onboardingCompleted: prestataire.stripeOnboardingCompleted,
      stripeAccountId: prestataire.stripeAccountId,
    })
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * POST /api/stripe-connect/onboarding
 * Crée un compte Stripe Connect et génère le lien d'onboarding
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireRole('PRESTATAIRE', request)

    const prestataire = await prisma.prestataire.findUnique({
      where: { userId: user.id },
      include: {
        user: true,
      },
    }) as Prestataire & { user: { email: string; nom: string; prenom: string | null } } | null

    if (!prestataire) {
      return errorResponse('Prestataire non trouvé', 404)
    }

    // Si le prestataire a déjà un compte Stripe Connect
    if (prestataire.stripeAccountId) {
      // Vérifier le statut de l'onboarding
      try {
        const account = await stripe.accounts.retrieve(prestataire.stripeAccountId)
        
        if (account.details_submitted && account.charges_enabled) {
          // L'onboarding est terminé
          await prisma.prestataire.update({
            where: { id: prestataire.id },
            data: {
              stripeOnboardingCompleted: true,
            },
          })

          return successResponse({
            onboardingCompleted: true,
            stripeAccountId: prestataire.stripeAccountId,
          })
        } else {
          // Générer un nouveau lien d'onboarding
          const accountLink = await stripe.accountLinks.create({
            account: prestataire.stripeAccountId,
            refresh_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/prestataire?stripe=refresh`,
            return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/prestataire?stripe=success`,
            type: 'account_onboarding',
          })

          return successResponse({
            onboardingUrl: accountLink.url,
            stripeAccountId: prestataire.stripeAccountId,
            onboardingCompleted: false,
          })
        }
      } catch (error) {
        // Si le compte n'existe plus, créer un nouveau compte
        console.error('Error retrieving Stripe account:', error)
      }
    }

    // Créer un nouveau compte Stripe Connect (Standard)
    const account = await stripe.accounts.create({
      type: 'standard',
      country: 'SN', // Sénégal par défaut (peut être configuré)
      email: prestataire.user.email || user.email,
      business_type: 'individual',
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      metadata: {
        prestataireId: prestataire.id,
        userId: user.id,
      },
    })

    // Générer le lien d'onboarding
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/prestataire?stripe=refresh`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/prestataire?stripe=success`,
      type: 'account_onboarding',
    })

    // Mettre à jour le prestataire avec le compte Stripe
    await prisma.prestataire.update({
      where: { id: prestataire.id },
      data: {
        stripeAccountId: account.id,
        stripeOnboardingCompleted: false,
      },
    })

    return successResponse({
      onboardingUrl: accountLink.url,
      stripeAccountId: account.id,
      onboardingCompleted: false,
    })
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * PATCH /api/stripe-connect/onboarding
 * Vérifie et met à jour le statut de l'onboarding
 */
export async function PATCH(request: NextRequest) {
  try {
    const user = await requireRole('PRESTATAIRE', request)

    const prestataire = await prisma.prestataire.findUnique({
      where: { userId: user.id },
    }) as Prestataire | null

    if (!prestataire) {
      return errorResponse('Prestataire non trouvé', 404)
    }

    if (!prestataire.stripeAccountId) {
      return errorResponse('Aucun compte Stripe Connect trouvé', 404)
    }

    // Vérifier le statut du compte Stripe
    const account = await stripe.accounts.retrieve(prestataire.stripeAccountId)

    const onboardingCompleted = account.details_submitted && account.charges_enabled

    // Mettre à jour le statut dans la base de données
    await prisma.prestataire.update({
      where: { id: prestataire.id },
      data: {
        stripeOnboardingCompleted: onboardingCompleted,
      },
    })

    return successResponse({
      onboardingCompleted,
      stripeAccountId: prestataire.stripeAccountId,
      accountDetails: {
        chargesEnabled: account.charges_enabled,
        detailsSubmitted: account.details_submitted,
        payoutsEnabled: account.payouts_enabled,
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}

