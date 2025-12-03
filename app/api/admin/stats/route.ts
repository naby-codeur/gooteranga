import { NextRequest } from 'next/server'
import { requireRole } from '@/lib/api/auth'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api/response'

// Helper pour convertir Decimal en number
function toNumber(value: unknown): number {
  if (typeof value === 'number') return value
  if (value && typeof value === 'object' && 'toNumber' in value) {
    return (value as { toNumber: () => number }).toNumber()
  }
  return 0
}

/**
 * GET /api/admin/stats
 * Récupère les statistiques globales de la plateforme (admin uniquement)
 */
export async function GET(request: NextRequest) {
  try {
    await requireRole('ADMIN', request)

    // Date du début du mois
    const debutMois = new Date()
    debutMois.setDate(1)
    debutMois.setHours(0, 0, 0, 0)

    // Statistiques générales
    const [
      prestatairesTotal,
      prestatairesEnAttente,
      activitesTotal,
      activitesEnAttente,
      reservationsTotal,
      reservationsMois,
      utilisateursTotal,
      utilisateursMois,
      paiementsMois,
    ] = await Promise.all([
      prisma.prestataire.count(),
      prisma.prestataire.count({ where: { isVerified: false } }),
      prisma.offre.count(),
      prisma.offre.count({ where: { isActive: false } }),
      prisma.reservation.count(),
      prisma.reservation.count({
        where: {
          createdAt: { gte: debutMois },
        },
      }),
      prisma.user.count(),
      prisma.user.count({
        where: {
          createdAt: { gte: debutMois },
        },
      }),
      prisma.paiement.aggregate({
        where: {
          createdAt: { gte: debutMois },
          statut: 'PAID',
        },
        _sum: {
          montant: true,
        },
      }),
    ])

    // Calcul des revenus (abonnements + boosts)
    const revenusReservations = toNumber(paiementsMois._sum.montant)
    
    // Revenus des abonnements du mois
    const abonnementsMois = await prisma.abonnement.aggregate({
      where: {
        createdAt: { gte: debutMois },
        statut: 'ACTIVE',
      },
      _sum: {
        montant: true,
      },
    })
    
    // Revenus des boosts du mois
    const boostsMois = await prisma.boost.aggregate({
      where: {
        createdAt: { gte: debutMois },
      },
      _sum: {
        montant: true,
      },
    })
    
    const revenusAbonnements = toNumber(abonnementsMois._sum.montant)
    const revenusBoosts = toNumber(boostsMois._sum.montant)
    const revenusTotalMois = revenusAbonnements + revenusBoosts

    // Statistiques par type d'offre
    const activitesParType = await prisma.offre.groupBy({
      by: ['type'],
      _count: {
        id: true,
      },
    })

    // Top destinations (régions)
    const topDestinations = await prisma.offre.groupBy({
      by: ['region'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 5,
    })

    // Statistiques des réservations par statut
    const reservationsParStatut = await prisma.reservation.groupBy({
      by: ['statut'],
      _count: {
        id: true,
      },
    })

    // Statistiques des abonnements par plan
    const abonnementsParPlan = await prisma.abonnement.groupBy({
      by: ['planType'],
      where: {
        statut: 'ACTIVE',
      },
      _count: {
        id: true,
      },
    })

    // Statistiques des prestataires par plan
    const prestatairesParPlan = await prisma.prestataire.groupBy({
      by: ['planType'],
      _count: {
        id: true,
      },
    })

    return successResponse(
      {
        prestatairesTotal,
        prestatairesEnAttente,
        activitesTotal,
        activitesEnAttente,
        reservationsTotal,
        reservationsMois,
        utilisateursTotal,
        utilisateursMois,
        // Revenus (ancien système de commissions remplacé)
        revenusReservations, // Montant total des réservations (pour info, pas nos revenus)
        revenusAbonnements, // Revenus réels des abonnements
        revenusBoosts, // Revenus réels des boosts
        revenusTotalMois, // Total des revenus GooTeranga
        activitesParType,
        topDestinations,
        reservationsParStatut,
        abonnementsParPlan,
        prestatairesParPlan,
      },
      'Statistiques récupérées avec succès',
      200
    )
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
        return errorResponse(error.message, 403)
      }
    }
    console.error('Error fetching stats:', error)
    return errorResponse('Internal server error', 500)
  }
}

