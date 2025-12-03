import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, handleApiError } from '@/lib/api/response'
import { requireAuth } from '@/lib/api/auth'

// Types pour les résultats Prisma
type Reservation = {
  id: string
  userId: string
  statut: string
  [key: string]: unknown
}

type Avis = {
  id: string
  userId: string
  offreId: string
  reservationId: string | null
  rating: number
  commentaire: string | null
  user?: {
    id: string
    nom: string
    prenom: string | null
    avatar: string | null
  }
  offre?: {
    id: string
    titre: string
  }
  [key: string]: unknown
}

/**
 * POST /api/avis
 * Crée un nouvel avis pour une offre
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const body = await request.json()
    const { offreId, reservationId, rating, commentaire } = body

    // Validation
    if (!offreId || !rating) {
      return errorResponse('Champs requis manquants', 400)
    }

    if (rating < 1 || rating > 5) {
      return errorResponse('La note doit être entre 1 et 5', 400)
    }

    // Vérifier que l'offre existe
    const offre = await prisma.offre.findUnique({
      where: { id: offreId },
    })

    if (!offre) {
      return errorResponse('Offre non trouvée', 404)
    }

    // Vérifier que l'utilisateur a une réservation complétée pour cette offre
    if (reservationId) {
      const reservation = await prisma.reservation.findUnique({
        where: { id: reservationId },
      }) as Reservation | null

      if (!reservation || reservation.userId !== user.id) {
        return errorResponse('Réservation non trouvée ou non autorisée', 404)
      }

      if (reservation.statut !== 'COMPLETED') {
        return errorResponse('Vous ne pouvez laisser un avis que pour une réservation complétée', 400)
      }
    }

    // Vérifier qu'il n'y a pas déjà un avis pour cette réservation
    if (reservationId) {
      const existingAvis = await prisma.avis.findUnique({
        where: { reservationId },
      }) as Avis | null

      if (existingAvis) {
        return errorResponse('Vous avez déjà laissé un avis pour cette réservation', 400)
      }
    }

    // Créer l'avis
    const avis = await prisma.avis.create({
      data: {
        userId: user.id,
        offreId,
        reservationId,
        rating,
        commentaire,
      },
      include: {
        user: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            avatar: true,
          },
        },
        offre: {
          select: {
            id: true,
            titre: true,
          },
        },
      },
    }) as Avis

    // Mettre à jour la note moyenne de l'offre
    const allAvis = await (prisma.avis.findMany as (args: unknown) => Promise<Array<{ rating: number }>>)({
      where: { offreId },
      select: { rating: true },
    })

    const moyenneRating = allAvis.reduce((sum: number, a: { rating: number }) => sum + a.rating, 0) / allAvis.length

    await prisma.offre.update({
      where: { id: offreId },
      data: {
        rating: moyenneRating,
        nombreAvis: allAvis.length,
      },
    })

    return successResponse(avis, 'Avis créé avec succès', 201)
  } catch (error) {
    return handleApiError(error)
  }
}

