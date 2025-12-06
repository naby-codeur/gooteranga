import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, handleApiError } from '@/lib/api/response'
import { requireAuth } from '@/lib/api/auth'

/**
 * GET /api/favoris
 * Récupère la liste des favoris de l'utilisateur
 */
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const [favoris, total] = await Promise.all([
      (prisma.favori as { findMany: (args: unknown) => Promise<unknown[]> }).findMany({
        where: { userId: user.id },
        include: {
          offre: {
            include: {
              prestataire: {
                select: {
                  id: true,
                  nomEntreprise: true,
                  logo: true,
                  isVerified: true,
                  rating: true,
                },
              },
              _count: {
                select: {
                  avis: true,
                  reservations: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      (prisma.favori as { count: (args: unknown) => Promise<number> }).count({ where: { userId: user.id } }),
    ])

    return successResponse({
      favoris,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * POST /api/favoris
 * Ajoute une offre aux favoris
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const body = await request.json()
    const { offreId } = body

    if (!offreId) {
      return errorResponse('ID d\'offre requis', 400)
    }

    // Vérifier que l'offre existe
    const offre = await prisma.offre.findUnique({
      where: { id: offreId },
    })

    if (!offre) {
      return errorResponse('Offre non trouvée', 404)
    }

    // Créer le favori (ou le récupérer s'il existe déjà)
    const favori = await (prisma.favori as { upsert: (args: unknown) => Promise<unknown> }).upsert({
      where: {
        userId_offreId: {
          userId: user.id,
          offreId,
        },
      },
      create: {
        userId: user.id,
        offreId,
      },
      update: {},
      include: {
        offre: {
          include: {
            prestataire: {
              select: {
                id: true,
                nomEntreprise: true,
                logo: true,
                isVerified: true,
              },
            },
          },
        },
      },
    })

    return successResponse(favori, 'Offre ajoutée aux favoris', 201)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * DELETE /api/favoris?offreId=xxx
 * Retire une offre des favoris
 */
export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const searchParams = request.nextUrl.searchParams
    const offreId = searchParams.get('offreId')

    if (!offreId) {
      return errorResponse('ID d\'offre requis', 400)
    }

    await prisma.favori.delete({
      where: {
        userId_offreId: {
          userId: user.id,
          offreId,
        },
      },
    })

    return successResponse(null, 'Offre retirée des favoris', 200)
  } catch (error) {
    return handleApiError(error)
  }
}

