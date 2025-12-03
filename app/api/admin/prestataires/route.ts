import { NextRequest } from 'next/server'
import { requireRole } from '@/lib/api/auth'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api/response'

// Types pour les résultats Prisma
type PrestataireWithUser = {
  id: string
  userId: string
  type: string
  nomEntreprise: string
  isVerified: boolean
  user: {
    id: string
    email: string
    nom: string
    prenom: string | null
    telephone: string | null
    createdAt: Date
  }
  _count?: {
    offres: number
    reservations: number
  }
  [key: string]: unknown
}

/**
 * GET /api/admin/prestataires
 * Liste tous les prestataires (admin uniquement)
 */
export async function GET(request: NextRequest) {
  try {
    await requireRole('ADMIN', request)

    const { searchParams } = new URL(request.url)
    const statut = searchParams.get('statut') // 'all', 'verified', 'pending', 'suspended'
    const type = searchParams.get('type')
    const search = searchParams.get('search')

    const where: {
      isVerified?: boolean
      type?: string
      OR?: Array<{
        nomEntreprise?: { contains: string; mode: 'insensitive' }
        email?: { contains: string; mode: 'insensitive' }
        ville?: { contains: string; mode: 'insensitive' }
        region?: { contains: string; mode: 'insensitive' }
      }>
    } = {}

    if (statut === 'verified') {
      where.isVerified = true
    } else if (statut === 'pending') {
      where.isVerified = false
    }

    if (type && type !== 'all') {
      where.type = type
    }

    if (search) {
      where.OR = [
        { nomEntreprise: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { ville: { contains: search, mode: 'insensitive' } },
        { region: { contains: search, mode: 'insensitive' } },
      ]
    }

    const prestataires = await (prisma.prestataire.findMany as (args: unknown) => Promise<PrestataireWithUser[]>)({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            nom: true,
            prenom: true,
            telephone: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            offres: true,
            reservations: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return successResponse(prestataires, 'Prestataires récupérés avec succès', 200)
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
        return errorResponse(error.message, 403)
      }
    }
    console.error('Error fetching prestataires:', error)
    return errorResponse('Internal server error', 500)
  }
}

/**
 * PATCH /api/admin/prestataires
 * Valide ou suspend un prestataire (admin uniquement)
 */
export async function PATCH(request: NextRequest) {
  try {
    await requireRole('ADMIN', request)

    const body = await request.json()
    const { prestataireId, action } = body as { prestataireId: string; action: string }

    if (!prestataireId || !action) {
      return errorResponse('Missing prestataireId or action', 400)
    }

    const prestataire = await prisma.prestataire.findUnique({
      where: { id: prestataireId },
    })

    if (!prestataire) {
      return errorResponse('Prestataire not found', 404)
    }

    // Récupérer le prestataire avec son utilisateur
    const prestataireWithUser = await prisma.prestataire.findUnique({
      where: { id: prestataireId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            nom: true,
            prenom: true,
            isActive: true,
          },
        },
      },
    }) as PrestataireWithUser | null

    if (!prestataireWithUser) {
      return errorResponse('Prestataire not found', 404)
    }

    let updatePrestataireData: { isVerified: boolean } | null = null
    let updateUserData: { isActive: boolean } | null = null

    switch (action) {
      case 'validate':
        updatePrestataireData = { isVerified: true }
        break
      case 'reject':
        updatePrestataireData = { isVerified: false }
        break
      case 'suspend':
        // Suspendre le prestataire ET l'utilisateur
        updatePrestataireData = { isVerified: false }
        updateUserData = { isActive: false }
        // Désactiver toutes les offres du prestataire
        await prisma.offre.updateMany({
          where: { prestataireId },
          data: { isActive: false },
        })
        break
      case 'unsuspend':
        // Réactiver le prestataire ET l'utilisateur
        updatePrestataireData = { isVerified: true }
        updateUserData = { isActive: true }
        break
      default:
        return errorResponse('Invalid action', 400)
    }

    // Mettre à jour le prestataire
    if (updatePrestataireData) {
      await prisma.prestataire.update({
        where: { id: prestataireId },
        data: updatePrestataireData,
      })
    }

    // Mettre à jour l'utilisateur si nécessaire
    if (updateUserData && prestataireWithUser.userId) {
      await prisma.user.update({
        where: { id: prestataireWithUser.userId },
        data: updateUserData,
      })
    }

    // Récupérer le prestataire mis à jour
    const updated = await prisma.prestataire.findUnique({
      where: { id: prestataireId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            nom: true,
            prenom: true,
            isActive: true,
          },
        },
      },
    })

    // Créer une notification pour le prestataire
    await prisma.notification.create({
      data: {
        prestataireId: prestataireId,
        type: 'system',
        titre: action === 'validate' 
          ? 'Compte validé' 
          : action === 'suspend' 
          ? 'Compte suspendu' 
          : action === 'unsuspend'
          ? 'Compte réactivé'
          : 'Compte rejeté',
        message: action === 'validate' 
          ? 'Votre compte prestataire a été validé. Vous pouvez maintenant publier vos offres.'
          : action === 'suspend'
          ? 'Votre compte prestataire a été suspendu en raison d\'actions inappropriées. Toutes vos offres ont été désactivées. Contactez le support pour plus d\'informations.'
          : action === 'unsuspend'
          ? 'Votre compte prestataire a été réactivé. Vous pouvez à nouveau utiliser la plateforme.'
          : 'Votre demande de compte prestataire a été rejetée. Contactez le support pour plus d\'informations.',
        lien: '/dashboard/prestataire',
      },
    })

    return successResponse(updated, 'Prestataire mis à jour avec succès', 200)
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
        return errorResponse(error.message, 403)
      }
    }
    console.error('Error updating prestataire:', error)
    return errorResponse('Internal server error', 500)
  }
}

