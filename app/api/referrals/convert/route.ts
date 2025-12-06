import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/api/auth'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api/response'

// Type pour le prestataire avec les champs nécessaires
type Prestataire = {
  id: string
  points: number
  boostsDisponibles: number
}

// Type pour le résultat de la mise à jour
type UpdatedPrestataire = {
  points: number
  boostsDisponibles: number
}

/**
 * POST /api/referrals/convert
 * Convertit les points en boosts (100 points = 1 boost)
 */
export async function POST(request: NextRequest) {
  try {
    const authUser = await requireAuth(request)

    // Récupérer le prestataire
    const prestataire = await prisma.prestataire.findUnique({
      where: { userId: authUser.id },
      select: {
        id: true,
        points: true,
        boostsDisponibles: true,
      },
    }) as Prestataire | null

    if (!prestataire) {
      return errorResponse('Prestataire non trouvé', 404)
    }

    const { pointsAConvertir } = (await request.json()) as { pointsAConvertir?: number }

    if (!pointsAConvertir || pointsAConvertir <= 0) {
      return errorResponse('Nombre de points invalide', 400)
    }

    // Vérifier que le prestataire a assez de points
    if (prestataire.points < pointsAConvertir) {
      return errorResponse('Points insuffisants', 400)
    }

    // Vérifier que c'est un multiple de 100
    if (pointsAConvertir % 100 !== 0) {
      return errorResponse('Le nombre de points doit être un multiple de 100', 400)
    }

    const boostsAGagner = pointsAConvertir / 100

    // Mettre à jour le prestataire
    const updated = (await prisma.prestataire.update({
      where: { id: prestataire.id },
      data: {
        points: {
          decrement: pointsAConvertir,
        },
        boostsDisponibles: {
          increment: boostsAGagner,
        },
      },
      select: {
        points: true,
        boostsDisponibles: true,
      },
    })) as UpdatedPrestataire

    return successResponse(
      {
        pointsRestants: updated.points,
        boostsDisponibles: updated.boostsDisponibles,
        boostsGagnes: boostsAGagner,
      },
      `${boostsAGagner} boost(s) ajouté(s) avec succès`
    )
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
        return errorResponse(error.message, 403)
      }
    }
    console.error('Error converting points:', error)
    return errorResponse('Internal server error', 500)
  }
}


