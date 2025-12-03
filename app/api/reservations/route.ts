import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, handleApiError } from '@/lib/api/response'
import { requireAuth } from '@/lib/api/auth'

// Types pour les résultats Prisma
type OffreWithPrestataire = {
  id: string
  prestataireId: string
  isActive: boolean
  prix: number | string
  [key: string]: unknown
}

/**
 * GET /api/reservations
 * Récupère la liste des réservations de l'utilisateur
 */
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const searchParams = request.nextUrl.searchParams
    const statut = searchParams.get('statut')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const where: {
      userId: string;
      statut?: string;
    } = {
      userId: user.id,
    }

    if (statut) {
      where.statut = statut
    }

    const [reservations, total] = await Promise.all([
      (prisma.reservation.findMany as (args: unknown) => Promise<unknown[]>)({
        where,
        include: {
          offre: {
            select: {
              id: true,
              titre: true,
              images: true,
              type: true,
              region: true,
              ville: true,
            },
          },
          prestataire: {
            select: {
              id: true,
              nomEntreprise: true,
              logo: true,
            },
          },
          paiement: {
            select: {
              id: true,
              statut: true,
              methode: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.reservation.count({ where }),
    ])

    return successResponse({
      reservations,
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
 * POST /api/reservations
 * Crée une nouvelle réservation
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const body = await request.json()
    const {
      offreId,
      dateDebut,
      dateFin,
      nombrePersonnes,
      notes,
    } = body

    // Validation
    if (!offreId || !dateDebut || !nombrePersonnes) {
      return errorResponse('Champs requis manquants', 400)
    }

    // Vérifier que l'offre existe et est active
    const offre = await prisma.offre.findUnique({
      where: { id: offreId },
      include: {
        prestataire: true,
      },
    }) as OffreWithPrestataire | null

    if (!offre) {
      return errorResponse('Offre non trouvée', 404)
    }

    if (!offre.isActive) {
      return errorResponse('Cette offre n\'est plus disponible', 400)
    }

    // Calculer le montant
    const dateDebutObj = new Date(dateDebut)
    const dateFinObj = dateFin ? new Date(dateFin) : null
    const nombreNuits = dateFinObj
      ? Math.ceil((dateFinObj.getTime() - dateDebutObj.getTime()) / (1000 * 60 * 60 * 24))
      : 1

    // Calcul du montant (100% pour le prestataire, pas de commission)
    const montant = Number(offre.prix) * nombreNuits * nombrePersonnes

    // Créer la réservation
    const reservation = await prisma.reservation.create({
      data: {
        userId: user.id,
        offreId,
        prestataireId: offre.prestataireId,
        dateDebut: dateDebutObj,
        dateFin: dateFinObj,
        nombrePersonnes,
        montant,
        statut: 'PENDING',
        notes,
      },
      include: {
        offre: {
          select: {
            id: true,
            titre: true,
            images: true,
            type: true,
          },
        },
        prestataire: {
          select: {
            id: true,
            nomEntreprise: true,
            logo: true,
          },
        },
      },
    })

    return successResponse(reservation, 'Réservation créée avec succès', 201)
  } catch (error) {
    return handleApiError(error)
  }
}

