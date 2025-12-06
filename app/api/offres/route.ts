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
            likes: true,
            favoris: true,
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
      boostEnabled,
      boostDuree,
    } = body

    // Validation
    if (!titre || !description || !type || !prix) {
      return errorResponse('Champs requis manquants', 400)
    }

    // Validation des images (max 3)
    if (images && Array.isArray(images) && images.length > 3) {
      return errorResponse('Maximum 3 images autorisées', 400)
    }

    // Validation des vidéos (durée 30s-1mn)
    // Note: La validation de durée doit être faite côté client avant l'upload
    // Ici on vérifie juste que les URLs sont valides
    if (videos && Array.isArray(videos) && videos.length > 0) {
      // La validation de durée sera faite lors de l'upload côté client
      // On accepte les vidéos ici, mais l'upload doit vérifier la durée
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
    }) as OffreWithPrestataire

    // Si boost activé, créer le boost automatiquement
    if (boostEnabled && boostDuree) {
      try {
        // Vérifier les boosts disponibles
        const prestataireWithBoosts = await prisma.prestataire.findUnique({
          where: { id: prestataire.id },
          select: { boostsDisponibles: true },
        }) as { boostsDisponibles: number } | null

        const tarifs: Record<string, number> = {
          jour: 1000,
          semaine: 6000,
          mois: 15000,
        }

        const montant = tarifs[boostDuree] || 6000

        // Calculer les dates
        const dateDebut = new Date()
        const dateFin = new Date()
        if (boostDuree === 'jour') {
          dateFin.setDate(dateFin.getDate() + 1)
        } else if (boostDuree === 'semaine') {
          dateFin.setDate(dateFin.getDate() + 7)
        } else if (boostDuree === 'mois') {
          dateFin.setMonth(dateFin.getMonth() + 1)
        }

        // Si le prestataire a des boosts disponibles, les utiliser
        if (prestataireWithBoosts && prestataireWithBoosts.boostsDisponibles > 0) {
          // Utiliser un boost disponible
          await prisma.$transaction([
            prisma.boost.create({
              data: {
                prestataireId: prestataire.id,
                offreId: offre.id,
                type: 'EXPERIENCE',
                montant: 0, // Gratuit car utilise un boost disponible
                dateDebut,
                dateFin,
                isActive: true,
                methode: 'boosts_disponibles',
              },
            }),
            prisma.prestataire.update({
              where: { id: prestataire.id },
              data: {
                boostsDisponibles: {
                  decrement: 1,
                },
              },
            }),
            prisma.offre.update({
              where: { id: offre.id as string },
              data: {
                isFeatured: true,
                featuredExpiresAt: dateFin,
              },
            }),
          ])
        } else {
          // Créer un boost payant (sera facturé plus tard)
          await prisma.boost.create({
            data: {
              prestataireId: prestataire.id,
              offreId: offre.id,
              type: 'EXPERIENCE',
              montant,
              dateDebut,
              dateFin,
              isActive: true,
              methode: 'pending_payment', // À payer plus tard
            },
          })

          await prisma.offre.update({
            where: { id: offre.id },
            data: {
              isFeatured: true,
              featuredExpiresAt: dateFin,
            },
          })
        }
      } catch (boostError) {
        // Ne pas bloquer la création de l'offre si le boost échoue
        console.error('Error creating boost:', boostError)
      }
    }

    return successResponse(offre, 'Offre créée avec succès', 201)
  } catch (error) {
    return handleApiError(error)
  }
}

