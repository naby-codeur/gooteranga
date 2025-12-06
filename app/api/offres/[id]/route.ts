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

    // Vérifier si c'est une offre fictive (commence par 'mock-')
    if (id.startsWith('mock-')) {
      // Importer le store des offres fictives depuis route.ts
      // Pour simplifier, on va créer les offres fictives ici aussi
      const mockOffres = await getMockOffres()
      const mockOffre = mockOffres.find((o: { id: string }) => o.id === id)
      
      if (mockOffre) {
        return successResponse(mockOffre)
      }
      return errorResponse('Offre non trouvée', 404)
    }

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
    try {
      await prisma.offre.update({
        where: { id },
        data: { vues: { increment: 1 } },
      })
    } catch {
      // Ignorer l'erreur si l'offre n'existe pas en base
    }

    return successResponse(offre)
  } catch (error) {
    return handleApiError(error)
  }
}

// Fonction helper pour récupérer les offres fictives
async function getMockOffres() {
  const allOffres = await prisma.offre.findMany()
  if (allOffres.length === 0) {
    return [
      {
        id: 'mock-1',
        titre: 'Tour guidé de Dakar',
        description: 'Découvrez les merveilles de Dakar avec un guide local expérimenté. Visitez les monuments historiques, les marchés colorés et les plages magnifiques.',
        type: 'GUIDE',
        region: 'Dakar',
        ville: 'Dakar',
        adresse: 'Place de l\'Indépendance',
        prix: 15000,
        prixUnite: 'personne',
        images: ['/images/ba1.png', '/images/ba2.png'],
        videos: [],
        duree: 4,
        capacite: 10,
        rating: 4.5,
        isActive: true,
        isFeatured: true,
        tags: ['CULTURE', 'HISTOIRE'],
        prestataire: {
          id: 'prest-1',
          nomEntreprise: 'Dakar Tours',
          logo: null,
          isVerified: true,
          rating: 4.8,
        },
        vuesVideo: 1250,
        nombreLikes: 45,
        _count: {
          avis: 23,
          reservations: 12,
          likes: 45,
          favoris: 18,
        },
        createdAt: new Date().toISOString(),
      },
      // ... autres offres fictives
    ]
  }
  return []
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

    // Si c'est une offre fictive, accepter la modification
    if (id.startsWith('mock-')) {
      const body = await request.json()
      // Retourner les données mises à jour
      return successResponse({ id, ...body }, 'Offre mise à jour avec succès')
    }

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

    // Si c'est une offre fictive, accepter la suppression
    if (id.startsWith('mock-')) {
      return successResponse(null, 'Offre supprimée avec succès')
    }

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

