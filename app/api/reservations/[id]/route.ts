import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, handleApiError } from '@/lib/api/response'
import { requireAuth } from '@/lib/api/auth'

// Types pour les résultats Prisma
type ReservationWithRelations = {
  id: string
  userId: string
  prestataireId: string
  statut: string
  prestataire?: {
    id: string
    userId: string
    nomEntreprise?: string
    logo?: string | null
    telephone?: string | null
    email?: string | null
    [key: string]: unknown
  }
  [key: string]: unknown
}

/**
 * GET /api/reservations/[id]
 * Récupère les détails d'une réservation
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await requireAuth(request)

    const reservation = await prisma.reservation.findUnique({
      where: { id },
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
        prestataire: {
          select: {
            id: true,
            nomEntreprise: true,
            logo: true,
            telephone: true,
            email: true,
          },
        },
        paiement: true,
        user: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
            telephone: true,
          },
        },
      },
    }) as ReservationWithRelations | null

    if (!reservation) {
      return errorResponse('Réservation non trouvée', 404)
    }

    // Vérifier que l'utilisateur est le propriétaire ou le prestataire
    if (reservation.userId !== user.id && reservation.prestataireId !== user.id && user.role !== 'ADMIN') {
      return errorResponse('Accès refusé', 403)
    }

    return successResponse(reservation)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * PUT /api/reservations/[id]/status
 * Met à jour le statut d'une réservation
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await requireAuth(request)
    const body = await request.json()
    const { statut } = body

    if (!statut || !['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'].includes(statut)) {
      return errorResponse('Statut invalide', 400)
    }

    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: {
        prestataire: true,
      },
    }) as ReservationWithRelations | null

    if (!reservation) {
      return errorResponse('Réservation non trouvée', 404)
    }

    // Vérifier les permissions
    const isOwner = reservation.userId === user.id
    const isPrestataire = reservation.prestataire?.userId === user.id
    const isAdmin = user.role === 'ADMIN'

    if (!isOwner && !isPrestataire && !isAdmin) {
      return errorResponse('Accès refusé', 403)
    }

    // Seul le prestataire ou admin peut confirmer/annuler
    if (statut === 'CONFIRMED' && !isPrestataire && !isAdmin) {
      return errorResponse('Seul le prestataire peut confirmer une réservation', 403)
    }

    const updatedReservation = await prisma.reservation.update({
      where: { id },
      data: { statut },
      include: {
        offre: {
          select: {
            id: true,
            titre: true,
            images: true,
          },
        },
        prestataire: {
          select: {
            id: true,
            nomEntreprise: true,
            logo: true,
          },
        },
        paiement: true,
      },
    })

    return successResponse(updatedReservation, 'Statut mis à jour avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * DELETE /api/reservations/[id]
 * Annule une réservation
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await requireAuth(request)

    const reservation = await prisma.reservation.findUnique({
      where: { id },
    }) as ReservationWithRelations | null

    if (!reservation) {
      return errorResponse('Réservation non trouvée', 404)
    }

    // Seul le propriétaire peut annuler
    if (reservation.userId !== user.id && user.role !== 'ADMIN') {
      return errorResponse('Accès refusé', 403)
    }

    // Ne peut annuler que si le statut est PENDING
    if (reservation.statut !== 'PENDING') {
      return errorResponse('Seules les réservations en attente peuvent être annulées', 400)
    }

    const updatedReservation = await prisma.reservation.update({
      where: { id },
      data: { statut: 'CANCELLED' },
      include: {
        offre: {
          select: {
            id: true,
            titre: true,
          },
        },
      },
    })

    return successResponse(updatedReservation, 'Réservation annulée avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}

