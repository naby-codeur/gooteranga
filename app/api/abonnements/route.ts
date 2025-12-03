import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, handleApiError } from '@/lib/api/response'
import { requireRole } from '@/lib/api/auth'

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
 * Crée un nouvel abonnement
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireRole('PRESTATAIRE', request)
    const body = await request.json()
    const { planType, methode, transactionId, stripeSubscriptionId } = body

    if (!planType || !['PRO', 'PREMIUM'].includes(planType)) {
      return errorResponse('Plan invalide. Choisissez PRO ou PREMIUM', 400)
    }

    // Tarifs des plans (en FCFA)
    const tarifs = {
      PRO: 4000,
      PREMIUM: 11000,
    }

    const montant = tarifs[planType as 'PRO' | 'PREMIUM']

    // Récupérer le prestataire
    const prestataire = await prisma.prestataire.findUnique({
      where: { userId: user.id },
    }) as Prestataire | null

    if (!prestataire) {
      return errorResponse('Prestataire non trouvé', 404)
    }

    // Calculer la date d'expiration (1 mois à partir de maintenant)
    const dateDebut = new Date()
    const dateFin = new Date()
    dateFin.setMonth(dateFin.getMonth() + 1)

    // Créer l'abonnement
    const abonnement = await prisma.abonnement.create({
      data: {
        prestataireId: prestataire.id,
        planType,
        montant,
        dateDebut,
        dateFin,
        statut: 'ACTIVE',
        methode: methode || 'stripe',
        transactionId,
        stripeSubscriptionId,
        autoRenouvellement: true,
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

    return successResponse(abonnement, 'Abonnement créé avec succès', 201)
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
      // Annuler l'abonnement
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

