import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, handleApiError } from '@/lib/api/response'
import { requireRole } from '@/lib/api/auth'

// Types pour les résultats Prisma
type OffreWithPrestataire = {
  id: string
  prestataireId: string
  prestataire: {
    id: string
    userId: string
    nomEntreprise?: string
    [key: string]: unknown
  }
  [key: string]: unknown
}

/**
 * GET /api/offres/[id]
 * Récupère les détails d'une offre
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const offre = await prisma.offre.findUnique({
      where: { id },
      include: {
        prestataire: {
          select: {
            id: true,
            nomEntreprise: true,
            description: true,
            logo: true,
            isVerified: true,
            rating: true,
            nombreAvis: true,
            adresse: true,
            ville: true,
            region: true,
            telephone: true,
            email: true,
            siteWeb: true,
          },
        },
        avis: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                nom: true,
                prenom: true,
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: {
            avis: true,
            reservations: true,
            favoris: true,
          },
        },
      },
    })

    if (!offre) {
      return errorResponse('Offre non trouvée', 404)
    }

    // Incrémenter le compteur de vues
    await prisma.offre.update({
      where: { id },
      data: { vues: { increment: 1 } },
    })

    return successResponse(offre)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * PUT /api/offres/[id]
 * Met à jour une offre (propriétaire ou admin uniquement)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await requireRole('PRESTATAIRE', request)

    const offre = await prisma.offre.findUnique({
      where: { id },
      include: {
        prestataire: true,
      },
    }) as OffreWithPrestataire | null

    if (!offre) {
      return errorResponse('Offre non trouvée', 404)
    }

    // Vérifier que l'utilisateur est le propriétaire ou admin
    if (offre.prestataire.userId !== user.id && user.role !== 'ADMIN') {
      return errorResponse('Accès refusé', 403)
    }

    const body = await request.json()
    const {
      titre,
      description,
      type,
      region,
      ville,
      adresse,
      latitude,
      longitude,
      prix,
      prixUnite,
      images,
      videos,
      duree,
      capacite,
      disponibilite,
      isActive,
    } = body

    const updatedOffre = await prisma.offre.update({
      where: { id },
      data: {
        ...(titre && { titre }),
        ...(description && { description }),
        ...(type && { type }),
        ...(region !== undefined && { region }),
        ...(ville !== undefined && { ville }),
        ...(adresse !== undefined && { adresse }),
        ...(latitude !== undefined && { latitude }),
        ...(longitude !== undefined && { longitude }),
        ...(prix && { prix }),
        ...(prixUnite !== undefined && { prixUnite }),
        ...(images && { images }),
        ...(videos && { videos }),
        ...(duree !== undefined && { duree }),
        ...(capacite !== undefined && { capacite }),
        ...(disponibilite && { disponibilite }),
        ...(isActive !== undefined && { isActive }),
      },
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
    })

    return successResponse(updatedOffre, 'Offre mise à jour avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * DELETE /api/offres/[id]
 * Supprime une offre (propriétaire ou admin uniquement)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await requireRole('PRESTATAIRE', request)

    const offre = await prisma.offre.findUnique({
      where: { id },
      include: {
        prestataire: true,
      },
    }) as OffreWithPrestataire | null

    if (!offre) {
      return errorResponse('Offre non trouvée', 404)
    }

    // Vérifier que l'utilisateur est le propriétaire ou admin
    if (offre.prestataire.userId !== user.id && user.role !== 'ADMIN') {
      return errorResponse('Accès refusé', 403)
    }

    await prisma.offre.delete({
      where: { id },
    })

    return successResponse(null, 'Offre supprimée avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}

