import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api/response'
import { REFERRAL_POINTS } from '@/lib/utils/referral'

/**
 * POST /api/referrals/events
 * Déclenche un événement de parrainage (appelé automatiquement lors d'actions du filleul)
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      filleulPrestataireId: string
      eventType: 'INSCRIPTION_VALIDEE' | 'PREMIERE_OFFRE_PUBLIEE' | 'RESERVATION_EFFECTUEE' | 'ABONNEMENT_PREMIUM'
      metadata?: Record<string, unknown>
    }

    const { filleulPrestataireId, eventType, metadata } = body

    if (!filleulPrestataireId || !eventType) {
      return errorResponse('filleulPrestataireId et eventType sont requis', 400)
    }

    // Trouver le parrainage actif
    const referral = await prisma.referral.findFirst({
      where: {
        filleulId: filleulPrestataireId,
        statut: 'PENDING', // Seulement si le parrainage est encore en attente
      },
      include: {
        parrain: true,
      },
    })

    if (!referral) {
      // Pas de parrainage actif, ignorer silencieusement
      return successResponse({ processed: false }, 'Aucun parrainage actif')
    }

    // Vérifier si l'événement a déjà été enregistré
    const eventExists = await prisma.referralEvent.findFirst({
      where: {
        referralId: referral.id,
        type: eventType,
      },
    })

    if (eventExists) {
      return successResponse({ processed: false }, 'Événement déjà enregistré')
    }

    const points = REFERRAL_POINTS[eventType]

    // Créer l'événement et mettre à jour les points
    await prisma.$transaction([
      // Créer l'événement
      prisma.referralEvent.create({
        data: {
          referralId: referral.id,
          type: eventType,
          points,
          metadata: metadata || null,
        },
      }),
      // Mettre à jour les points du parrain
      prisma.prestataire.update({
        where: { id: referral.parrainId },
        data: {
          points: {
            increment: points,
          },
        },
      }),
      // Mettre à jour les points gagnés dans le referral
      prisma.referral.update({
        where: { id: referral.id },
        data: {
          pointsGagnes: {
            increment: points,
          },
          // Si c'est l'inscription validée, marquer comme COMPLETED
          ...(eventType === 'INSCRIPTION_VALIDEE' && {
            statut: 'COMPLETED',
          }),
        },
      }),
    ])

    return successResponse(
      {
        processed: true,
        points,
        eventType,
      },
      'Événement de parrainage enregistré avec succès'
    )
  } catch (error: unknown) {
    console.error('Error processing referral event:', error)
    return errorResponse('Internal server error', 500)
  }
}


