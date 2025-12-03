import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, handleApiError } from '@/lib/api/response'
import { requireRole } from '@/lib/api/auth'

// Types pour les résultats Prisma
type Prestataire = {
  id: string
  userId: string
  [key: string]: unknown
}

type Offre = {
  id: string
  prestataireId: string
  [key: string]: unknown
}

type Boost = {
  id: string
  prestataireId: string
  offreId: string | null
  type: string
  region: string | null
  categorie: string | null
  montant: number
  dateDebut: Date
  dateFin: Date
  isActive: boolean
  offre?: {
    id: string
    titre: string
  }
  [key: string]: unknown
}

/**
 * GET /api/boosts
 * Liste les boosts actifs du prestataire
 */
export async function GET(request: NextRequest) {
  try {
    const user = await requireRole('PRESTATAIRE', request)
    const { searchParams } = new URL(request.url)
    const actif = searchParams.get('actif') // 'true' ou 'false'

    const prestataire = await prisma.prestataire.findUnique({
      where: { userId: user.id },
    }) as Prestataire | null

    if (!prestataire) {
      return errorResponse('Prestataire non trouvé', 404)
    }

    const where: {
      prestataireId: string
      isActive?: boolean
    } = {
      prestataireId: prestataire.id,
    }

    if (actif === 'true') {
      where.isActive = true
    } else if (actif === 'false') {
      where.isActive = false
    }

    const boosts = await prisma.boost.findMany({
      where,
      include: {
        offre: {
          select: {
            id: true,
            titre: true,
            images: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return successResponse({ boosts })
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * POST /api/boosts
 * Crée un nouveau boost
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireRole('PRESTATAIRE', request)
    const body = await request.json()
    const {
      type,
      offreId,
      region,
      categorie,
      duree, // 'jour', 'semaine', 'mois'
      methode,
      transactionId,
    } = body

    if (!type || !['EXPERIENCE', 'REGIONAL', 'CATEGORIE', 'MENSUEL'].includes(type)) {
      return errorResponse('Type de boost invalide', 400)
    }

    if (!duree || !['jour', 'semaine', 'mois'].includes(duree)) {
      return errorResponse('Durée invalide. Choisissez: jour, semaine ou mois', 400)
    }

    const prestataire = await prisma.prestataire.findUnique({
      where: { userId: user.id },
    }) as Prestataire | null

    if (!prestataire) {
      return errorResponse('Prestataire non trouvé', 404)
    }

    // Tarifs selon le type et la durée
    const tarifs: Record<string, Record<string, number>> = {
      EXPERIENCE: {
        jour: 1000,
        semaine: 6000,
        mois: 15000,
      },
      REGIONAL: {
        semaine: 5000,
        mois: 15000,
      },
      CATEGORIE: {
        semaine: 3000,
        mois: 10000,
      },
      MENSUEL: {
        mois: 15000,
      },
    }

    const montant = tarifs[type]?.[duree]
    if (!montant) {
      return errorResponse('Combinaison type/durée invalide', 400)
    }

    // Vérifier les prérequis selon le type
    if (type === 'EXPERIENCE' && !offreId) {
      return errorResponse('offreId requis pour un boost d\'expérience', 400)
    }

    if (type === 'REGIONAL' && !region) {
      return errorResponse('region requise pour un boost régional', 400)
    }

    if (type === 'CATEGORIE' && !categorie) {
      return errorResponse('categorie requise pour un boost catégorie', 400)
    }

    // Vérifier que l'offre existe si fournie
    if (offreId) {
      const offre = await prisma.offre.findUnique({
        where: { id: offreId },
      }) as Offre | null

      if (!offre || offre.prestataireId !== prestataire.id) {
        return errorResponse('Offre non trouvée ou n\'appartient pas au prestataire', 404)
      }
    }

    // Calculer les dates
    const dateDebut = new Date()
    const dateFin = new Date()

    if (duree === 'jour') {
      dateFin.setDate(dateFin.getDate() + 1)
    } else if (duree === 'semaine') {
      dateFin.setDate(dateFin.getDate() + 7)
    } else if (duree === 'mois') {
      dateFin.setMonth(dateFin.getMonth() + 1)
    }

    // Créer le boost
    const boost = await prisma.boost.create({
      data: {
        prestataireId: prestataire.id,
        offreId: type === 'EXPERIENCE' ? offreId : null,
        type,
        region: type === 'REGIONAL' ? region : null,
        categorie: type === 'CATEGORIE' ? categorie : null,
        montant,
        dateDebut,
        dateFin,
        isActive: true,
        methode: methode || 'stripe',
        transactionId,
      },
      include: {
        offre: {
          select: {
            id: true,
            titre: true,
          },
        },
      },
    }) as Boost

    // Si c'est un boost d'expérience, marquer l'offre comme featured
    if (type === 'EXPERIENCE' && offreId) {
      await prisma.offre.update({
        where: { id: offreId },
        data: {
          isFeatured: true,
          featuredExpiresAt: dateFin,
        },
      })
    }

    return successResponse(boost, 'Boost créé avec succès', 201)
  } catch (error) {
    return handleApiError(error)
  }
}

