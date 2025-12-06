import { NextRequest } from 'next/server'
import { requireRole } from '@/lib/api/auth'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api/response'

// Types pour les résultats Prisma
type UserWithCounts = {
  id: string
  email: string
  nom: string
  prenom: string | null
  telephone: string | null
  role: string
  avatar: string | null
  isActive: boolean
  createdAt: Date
  _count: {
    reservations: number
    favoris: number
    avis: number
  }
}

/**
 * GET /api/admin/utilisateurs
 * Liste tous les utilisateurs (touristes et prestataires) avec possibilité de filtrer
 */
export async function GET(request: NextRequest) {
  try {
    await requireRole('ADMIN', request)

    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role') // 'USER', 'PRESTATAIRE', ou 'all'
    const statut = searchParams.get('statut') // 'all', 'active', 'suspended'
    const search = searchParams.get('search')

    const where: {
      role?: string
      isActive?: boolean
      OR?: Array<{
        nom?: { contains: string; mode: 'insensitive' }
        prenom?: { contains: string; mode: 'insensitive' }
        email?: { contains: string; mode: 'insensitive' }
        telephone?: { contains: string; mode: 'insensitive' }
      }>
    } = {}

    // Filtrer par rôle
    if (role && role !== 'all') {
      where.role = role
    }

    // Filtrer par statut (actif/suspendu)
    if (statut === 'active') {
      where.isActive = true
    } else if (statut === 'suspended') {
      where.isActive = false
    }

    // Recherche
    if (search) {
      where.OR = [
        { nom: { contains: search, mode: 'insensitive' } },
        { prenom: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { telephone: { contains: search, mode: 'insensitive' } },
      ]
    }

    const utilisateurs = await (prisma.user.findMany as (args: unknown) => Promise<UserWithCounts[]>)({
      where,
      select: {
        id: true,
        email: true,
        nom: true,
        prenom: true,
        telephone: true,
        role: true,
        avatar: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: {
            reservations: true,
            favoris: true,
            avis: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return successResponse(utilisateurs, 'Utilisateurs récupérés avec succès', 200)
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
        return errorResponse(error.message, 403)
      }
    }
    console.error('Error fetching utilisateurs:', error)
    return errorResponse('Internal server error', 500)
  }
}

/**
 * PATCH /api/admin/utilisateurs
 * Suspend ou réactive un utilisateur (touriste ou prestataire)
 */
export async function PATCH(request: NextRequest) {
  try {
    await requireRole('ADMIN', request)

    const body = await request.json()
    const { userId, action } = body as { userId: string; action: 'suspend' | 'unsuspend' }

    if (!userId || !action) {
      return errorResponse('userId et action sont requis', 400)
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        prestataire: {
          select: {
            id: true,
          },
        },
      },
    }) as { role: string; prestataire?: { id: string } | null } | null

    if (!user) {
      return errorResponse('Utilisateur non trouvé', 404)
    }

    // Empêcher la suspension d'un autre admin
    if (user.role === 'ADMIN' && action === 'suspend') {
      return errorResponse('Impossible de suspendre un administrateur', 403)
    }

    const isActive = action === 'unsuspend'

    // Mettre à jour l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isActive },
      select: {
        id: true,
        email: true,
        nom: true,
        prenom: true,
        telephone: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    })

    // Si c'est un prestataire suspendu, désactiver aussi ses offres
    if (action === 'suspend' && user.role === 'PRESTATAIRE' && user.prestataire) {
      await prisma.offre.updateMany({
        where: {
          prestataireId: user.prestataire.id,
        },
        data: {
          isActive: false,
        },
      })
    }

    // Créer une notification
    await prisma.notification.create({
      data: {
        userId: userId,
        type: 'system',
        titre: action === 'suspend' ? 'Compte suspendu' : 'Compte réactivé',
        message: action === 'suspend'
          ? 'Votre compte a été suspendu en raison d\'actions inappropriées. Contactez le support pour plus d\'informations.'
          : 'Votre compte a été réactivé. Vous pouvez à nouveau utiliser la plateforme.',
        lien: user.role === 'PRESTATAIRE' ? '/dashboard/prestataire' : '/dashboard',
      },
    })

    return successResponse(
      updatedUser,
      action === 'suspend' ? 'Utilisateur suspendu avec succès' : 'Utilisateur réactivé avec succès',
      200
    )
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
        return errorResponse(error.message, 403)
      }
    }
    console.error('Error updating utilisateur:', error)
    return errorResponse('Internal server error', 500)
  }
}

