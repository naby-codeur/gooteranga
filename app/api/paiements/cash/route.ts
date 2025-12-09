import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, handleApiError } from '@/lib/api/response'
import { requireAuth } from '@/lib/api/auth'

// Types pour les résultats Prisma
type ReservationWithOffre = {
  id: string
  userId: string
  statut: string
  montant: number | string
  offreId: string
  prestataireId: string
  offre: {
    id: string
    titre: string
    [key: string]: unknown
  }
  [key: string]: unknown
}

type Paiement = {
  id: string
  reservationId: string
  prestataireId: string
  montant: number | string
  statut: string
  methode: string
  transactionId?: string | null
  [key: string]: unknown
}

/**
 * POST /api/paiements/cash
 * Crée un paiement cash pour une réservation
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const body = await request.json()
    const { reservationId, transactionId } = body

    if (!reservationId) {
      return errorResponse('ID de réservation requis', 400)
    }

    if (!transactionId) {
      return errorResponse('transactionId requis pour le paiement cash', 400)
    }

    // Vérifier que la réservation existe et appartient à l'utilisateur
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: {
        offre: true,
      },
    }) as ReservationWithOffre | null

    if (!reservation) {
      return errorResponse('Réservation non trouvée', 404)
    }

    if (reservation.userId !== user.id) {
      return errorResponse('Accès refusé', 403)
    }

    if (reservation.statut !== 'PENDING') {
      return errorResponse('Cette réservation ne peut plus être payée', 400)
    }

    // Vérifier qu'il n'y a pas déjà un paiement
    const existingPaiement = await prisma.paiement.findUnique({
      where: { reservationId },
    }) as Paiement | null

    if (existingPaiement && existingPaiement.statut === 'PAID') {
      return errorResponse('Cette réservation a déjà été payée', 400)
    }

    // Créer le paiement cash
    const paiement = await prisma.paiement.upsert({
      where: { reservationId },
      create: {
        reservationId,
        prestataireId: reservation.prestataireId,
        montant: reservation.montant,
        methode: 'cash',
        transactionId,
        statut: 'PAID', // Paiement cash considéré comme payé immédiatement
      },
      update: {
        methode: 'cash',
        transactionId,
        statut: 'PAID',
      },
    }) as Paiement

    // Mettre à jour la réservation
    await prisma.reservation.update({
      where: { id: reservationId },
      data: { statut: 'CONFIRMED' },
    })

    return successResponse({
      paiement,
      message: 'Paiement cash enregistré avec succès',
    })
  } catch (error) {
    return handleApiError(error)
  }
}

