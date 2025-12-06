// ...existing code...
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { successResponse, errorResponse } from '../../lib/api-utils'

/**
 * POST /api/likes
 * Ajoute ou retire un like sur une offre
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return errorResponse('Non authentifié', 401)
    }

    const body = await request.json()
    const { offreId } = body

    if (!offreId) {
      return errorResponse('offreId requis', 400)
    }

    // Vérifier si l'offre existe
    const offre = await prisma.offre.findUnique({
      where: { id: offreId },
    })

    if (!offre) {
      return errorResponse('Offre introuvable', 404)
    }

    // Vérifier si l'utilisateur a déjà liké cette offre
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_offreId: {
          userId: session.user.id,
          offreId: offreId,
        },
      },
    })

    if (existingLike) {
      // Retirer le like
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      })

      return successResponse({ liked: false, message: 'Like retiré' })
    } else {
      // Ajouter le like
      await prisma.like.create({
        data: {
          userId: session.user.id,
          offreId: offreId,
        },
      })

      return successResponse({ liked: true, message: 'Like ajouté' })
    }
  } catch (error) {
    console.error('Error in POST /api/likes:', error)
    return errorResponse('Erreur lors de la gestion du like', 500)
  }
}

/**
 * GET /api/likes?offreId=xxx
 * Vérifie si l'utilisateur a liké une offre
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return errorResponse('Non authentifié', 401)
    }

    const searchParams = request.nextUrl.searchParams
    const offreId = searchParams.get('offreId')

    if (!offreId) {
      return errorResponse('offreId requis', 400)
    }

    const like = await prisma.like.findUnique({
      where: {
        userId_offreId: {
          userId: session.user.id,
          offreId: offreId,
        },
      },
    })

    return successResponse({ isLiked: !!like })
  } catch (error) {
    console.error('Error in GET /api/likes:', error)
    return errorResponse('Erreur lors de la vérification du like', 500)
  }
}
// ...existing code...