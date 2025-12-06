import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/api/auth'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api/response'

/**
 * GET /api/referrals
 * Récupère les statistiques de parrainage du prestataire connecté
 */
export async function GET(request: NextRequest) {
  try {
    const authUser = await requireAuth(request)

    // Récupérer le prestataire
    const prestataire = await prisma.prestataire.findUnique({
      where: { userId: authUser.id },
      include: {
        referralsParrain: {
          where: { statut: 'COMPLETED' },
          include: {
            filleul: {
              select: {
                id: true,
                nomEntreprise: true,
                createdAt: true,
              },
            },
            evenements: {
              orderBy: { createdAt: 'desc' },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            referralsParrain: {
              where: { statut: 'COMPLETED' },
            },
            referralsFilleul: true,
          },
        },
      },
    })

    if (!prestataire) {
      return errorResponse('Prestataire non trouvé', 404)
    }

    // Calculer les statistiques
    const totalFilleuls = prestataire._count.referralsParrain
    const totalPoints = prestataire.points
    const boostsDisponibles = prestataire.boostsDisponibles
    const pointsRestants = totalPoints % 100 // Points non convertis

    // Calculer les points par événement
    const pointsParEvenement = {
      inscription: prestataire.referralsParrain.reduce(
        (sum, r) =>
          sum +
          r.evenements.filter((e) => e.type === 'INSCRIPTION_VALIDEE').reduce((s, e) => s + e.points, 0),
        0
      ),
      premiereOffre: prestataire.referralsParrain.reduce(
        (sum, r) =>
          sum +
          r.evenements.filter((e) => e.type === 'PREMIERE_OFFRE_PUBLIEE').reduce((s, e) => s + e.points, 0),
        0
      ),
      reservation: prestataire.referralsParrain.reduce(
        (sum, r) =>
          sum +
          r.evenements.filter((e) => e.type === 'RESERVATION_EFFECTUEE').reduce((s, e) => s + e.points, 0),
        0
      ),
      abonnementPremium: prestataire.referralsParrain.reduce(
        (sum, r) =>
          sum +
          r.evenements.filter((e) => e.type === 'ABONNEMENT_PREMIUM').reduce((s, e) => s + e.points, 0),
        0
      ),
    }

    return successResponse(
      {
        codeParrain: prestataire.codeParrain,
        lienParrainage: `${process.env.NEXT_PUBLIC_APP_URL || 'https://gooteranga.com'}/register?ref=${prestataire.codeParrain}`,
        totalFilleuls,
        totalPoints,
        pointsRestants,
        boostsDisponibles,
        pointsParEvenement,
        filleuls: prestataire.referralsParrain.map((r) => ({
          id: r.id,
          filleul: {
            id: r.filleul.id,
            nomEntreprise: r.filleul.nomEntreprise,
            dateInscription: r.filleul.createdAt,
          },
          pointsGagnes: r.pointsGagnes,
          evenements: r.evenements.map((e) => ({
            type: e.type,
            points: e.points,
            date: e.createdAt,
          })),
          dateParrainage: r.createdAt,
        })),
      },
      'Statistiques de parrainage récupérées avec succès'
    )
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
        return errorResponse(error.message, 403)
      }
    }
    console.error('Error fetching referrals:', error)
    return errorResponse('Internal server error', 500)
  }
}


