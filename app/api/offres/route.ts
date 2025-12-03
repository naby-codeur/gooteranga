import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, handleApiError } from '@/lib/api/response'
import { requireRole } from '@/lib/api/auth'
import { calculateVisibilityScore } from '@/lib/plans'

// Types pour les résultats Prisma
type Prestataire = {
  id: string
  planType: string
  planExpiresAt: Date | null
  [key: string]: unknown
}

type OffreWithPrestataire = {
  id: string
  prestataireId: string
  rating: number
  prestataire: Prestataire
  boosts: Array<{ type: string }>
  _count: {
    avis: number
    reservations: number
  }
  [key: string]: unknown
}

/**
 * GET /api/offres
 * Récupère la liste des offres avec filtres optionnels
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type')
    const region = searchParams.get('region')
    const ville = searchParams.get('ville')
    const minPrix = searchParams.get('minPrix')
    const maxPrix = searchParams.get('maxPrix')
    const isActive = searchParams.get('isActive') !== 'false'
    const isFeatured = searchParams.get('isFeatured')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const where: {
      isActive: boolean;
      type?: string;
      region?: string;
      ville?: string;
      prix?: { gte?: number; lte?: number };
      isFeatured?: boolean;
      featuredExpiresAt?: { gte: Date };
    } = {
      isActive,
    }

    if (type) {
      where.type = type
    }
    if (region) {
      where.region = region
    }
    if (ville) {
      where.ville = ville
    }
    if (minPrix || maxPrix) {
      where.prix = {}
      if (minPrix) {
        where.prix.gte = parseFloat(minPrix)
      }
      if (maxPrix) {
        where.prix.lte = parseFloat(maxPrix)
      }
    }
    if (isFeatured === 'true') {
      where.isFeatured = true
      where.featuredExpiresAt = {
        gte: new Date(),
      }
    }

    // Récupérer toutes les offres avec les informations nécessaires pour le tri
    const offresRaw = await (prisma.offre.findMany as (args: unknown) => Promise<OffreWithPrestataire[]>)({
      where,
      include: {
        prestataire: {
          select: {
            id: true,
            nomEntreprise: true,
            logo: true,
            isVerified: true,
            rating: true,
            planType: true,
            planExpiresAt: true,
          },
        },
        boosts: {
          where: {
            isActive: true,
            dateFin: {
              gte: new Date(),
            },
          },
          select: {
            type: true,
          },
        },
        _count: {
          select: {
            avis: true,
            reservations: true,
          },
        },
      },
    })

    // Calculer le score de visibilité pour chaque offre
    const offresWithScore = offresRaw.map((offre) => {
      const hasActiveBoost = offre.boosts.length > 0
      const boostType = offre.boosts[0]?.type
      const isPlanActive = offre.prestataire.planExpiresAt
        ? new Date(offre.prestataire.planExpiresAt) > new Date()
        : false

      // Si le plan est expiré, considérer comme GRATUIT
      const planType = isPlanActive
        ? offre.prestataire.planType
        : 'GRATUIT'

      const visibilityScore = calculateVisibilityScore(
        planType as 'GRATUIT' | 'PRO' | 'PREMIUM',
        hasActiveBoost,
        boostType,
        offre.rating,
        offre._count.avis
      )

      return {
        ...(offre as Record<string, unknown>),
        visibilityScore,
      }
    })

    // Trier par score de visibilité (décroissant)
    offresWithScore.sort((a, b) => b.visibilityScore - a.visibilityScore)

    // Pagination manuelle
    const total = offresWithScore.length
    const offres = offresWithScore.slice(skip, skip + limit).map((offre) => {
      // Retirer le score de visibilité et les boosts de la réponse
      const offreObj = offre as Record<string, unknown>
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { visibilityScore, boosts, ...offreData } = offreObj
      return offreData
    })

    return successResponse({
      offres,
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
 * POST /api/offres
 * Crée une nouvelle offre (prestataire uniquement)
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireRole('PRESTATAIRE', request)

    // Vérifier que l'utilisateur a un prestataire
    const prestataire = await prisma.prestataire.findUnique({
      where: { userId: user.id },
    }) as Prestataire | null

    if (!prestataire) {
      return errorResponse('Prestataire non trouvé', 404)
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
    } = body

    // Validation
    if (!titre || !description || !type || !prix) {
      return errorResponse('Champs requis manquants', 400)
    }

    // Vérifier la limite d'expériences selon le plan
    const planType = prestataire.planType
    const isPlanActive = prestataire.planExpiresAt
      ? new Date(prestataire.planExpiresAt) > new Date()
      : false

    // Si le plan est expiré, considérer comme GRATUIT
    const effectivePlan = isPlanActive ? planType : 'GRATUIT'

    if (effectivePlan === 'GRATUIT') {
      const nombreOffres = await prisma.offre.count({
        where: {
          prestataireId: prestataire.id,
          isActive: true,
        },
      })

      if (nombreOffres >= 5) {
        return errorResponse(
          'Limite atteinte. Le plan gratuit permet 5 expériences maximum. Passez au plan Pro ou Premium pour des expériences illimitées.',
          403
        )
      }
    }

    const offre = await prisma.offre.create({
      data: {
        prestataireId: prestataire.id,
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
        images: images || [],
        videos: videos || [],
        duree,
        capacite,
        disponibilite,
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

    return successResponse(offre, 'Offre créée avec succès', 201)
  } catch (error) {
    return handleApiError(error)
  }
}

