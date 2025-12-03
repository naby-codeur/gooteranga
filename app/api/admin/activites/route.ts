import { NextRequest } from 'next/server'
import { requireRole } from '@/lib/api/auth'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api/response'

// Types pour les résultats Prisma
type OffreWithPrestataire = {
  id: string
  prestataireId: string
  titre: string
  description: string
  type: string
  isActive: boolean
  prestataire: {
    id: string
    user: {
      nom: string
      prenom: string | null
      email: string
    }
  }
  _count?: {
    reservations: number
    avis: number
    favoris: number
  }
  [key: string]: unknown
}

/**
 * GET /api/admin/activites
 * Liste toutes les activités (admin uniquement)
 */
export async function GET(request: NextRequest) {
  try {
    await requireRole('ADMIN', request)

    const { searchParams } = new URL(request.url)
    const statut = searchParams.get('statut') // 'all', 'active', 'inactive', 'pending'
    const type = searchParams.get('type')
    const search = searchParams.get('search')

    const where: {
      isActive?: boolean
      type?: string
      OR?: Array<{
        titre?: { contains: string; mode: 'insensitive' }
        description?: { contains: string; mode: 'insensitive' }
        ville?: { contains: string; mode: 'insensitive' }
        region?: { contains: string; mode: 'insensitive' }
      }>
    } = {}

    if (statut === 'active') {
      where.isActive = true
    } else if (statut === 'inactive') {
      where.isActive = false
    }

    if (type && type !== 'all') {
      where.type = type
    }

    if (search) {
      where.OR = [
        { titre: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { ville: { contains: search, mode: 'insensitive' } },
        { region: { contains: search, mode: 'insensitive' } },
      ]
    }

    const activites = await (prisma.offre.findMany as (args: unknown) => Promise<OffreWithPrestataire[]>)({
      where,
      include: {
        prestataire: {
          include: {
            user: {
              select: {
                nom: true,
                prenom: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            reservations: true,
            avis: true,
            favoris: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return successResponse(activites, 'Activités récupérées avec succès', 200)
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
        return errorResponse(error.message, 403)
      }
    }
    console.error('Error fetching activites:', error)
    return errorResponse('Internal server error', 500)
  }
}

/**
 * PATCH /api/admin/activites
 * Active, désactive ou supprime une activité (admin uniquement)
 */
export async function PATCH(request: NextRequest) {
  try {
    await requireRole('ADMIN', request)

    const body = await request.json()
    const { activiteId, action } = body as { activiteId: string; action: string }

    if (!activiteId || !action) {
      return errorResponse('Missing activiteId or action', 400)
    }

    const activite = await prisma.offre.findUnique({
      where: { id: activiteId },
      include: {
        prestataire: {
          include: {
            user: true,
          },
        },
      },
    }) as OffreWithPrestataire | null

    if (!activite) {
      return errorResponse('Activite not found', 404)
    }

    switch (action) {
      case 'activate':
        await prisma.offre.update({
          where: { id: activiteId },
          data: { isActive: true },
        })
        break
      case 'deactivate':
        await prisma.offre.update({
          where: { id: activiteId },
          data: { isActive: false },
        })
        break
      case 'delete':
        await prisma.offre.delete({
          where: { id: activiteId },
        })
        break
      default:
        return errorResponse('Invalid action', 400)
    }

    // Créer une notification pour le prestataire
    if (action !== 'delete') {
      await prisma.notification.create({
        data: {
          prestataireId: activite.prestataireId,
          type: 'system',
          titre: action === 'activate' ? 'Activité activée' : 'Activité désactivée',
          message: action === 'activate'
            ? `Votre activité "${activite.titre}" a été activée et est maintenant visible sur la plateforme.`
            : `Votre activité "${activite.titre}" a été désactivée. Contactez le support pour plus d'informations.`,
          lien: '/dashboard/prestataire',
        },
      })
    }

    return successResponse({ success: true }, 'Activité mise à jour avec succès', 200)
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
        return errorResponse(error.message, 403)
      }
    }
    console.error('Error updating activite:', error)
    return errorResponse('Internal server error', 500)
  }
}

