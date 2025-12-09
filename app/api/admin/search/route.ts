import { NextRequest } from 'next/server'
import { requireRole } from '@/lib/api/auth'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api/response'

/**
 * GET /api/admin/search
 * Recherche globale dans toutes les sections de l'admin
 */
export async function GET(request: NextRequest) {
  try {
    await requireRole('ADMIN', request)

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const type = searchParams.get('type') || 'all' // all, users, prestataires, activites, reservations

    if (!query || query.trim().length < 2) {
      return successResponse(
        {
          users: [],
          prestataires: [],
          activites: [],
          reservations: [],
        },
        'Recherche effectuée',
        200
      )
    }

    const searchTerm = query.trim().toLowerCase()

    // Recherche dans les utilisateurs
    const users =
      type === 'all' || type === 'users'
        ? await prisma.user.findMany({
            where: {
              OR: [
                { email: { contains: searchTerm, mode: 'insensitive' } },
                { nom: { contains: searchTerm, mode: 'insensitive' } },
                { prenom: { contains: searchTerm, mode: 'insensitive' } },
                { telephone: { contains: searchTerm, mode: 'insensitive' } },
              ],
            },
            take: 10,
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
        : []

    // Recherche dans les prestataires
    const prestataires =
      type === 'all' || type === 'prestataires'
        ? await prisma.prestataire.findMany({
            where: {
              OR: [
                { nomEntreprise: { contains: searchTerm, mode: 'insensitive' } },
                { email: { contains: searchTerm, mode: 'insensitive' } },
                { telephone: { contains: searchTerm, mode: 'insensitive' } },
                { ville: { contains: searchTerm, mode: 'insensitive' } },
                { region: { contains: searchTerm, mode: 'insensitive' } },
              ],
            },
            take: 10,
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
        : []

    // Recherche dans les activités/offres
    const activites =
      type === 'all' || type === 'activites'
        ? await prisma.offre.findMany({
            where: {
              OR: [
                { titre: { contains: searchTerm, mode: 'insensitive' } },
                { description: { contains: searchTerm, mode: 'insensitive' } },
                { region: { contains: searchTerm, mode: 'insensitive' } },
                { ville: { contains: searchTerm, mode: 'insensitive' } },
              ],
            },
            take: 10,
            include: {
              prestataire: {
                select: {
                  nomEntreprise: true,
                },
              },
            },
          })
        : []

    // Recherche dans les réservations
    const reservations =
      type === 'all' || type === 'reservations'
        ? await prisma.reservation.findMany({
            where: {
              OR: [
                {
                  offre: {
                    titre: { contains: searchTerm, mode: 'insensitive' },
                  },
                },
                {
                  client: {
                    OR: [
                      { nom: { contains: searchTerm, mode: 'insensitive' } },
                      { prenom: { contains: searchTerm, mode: 'insensitive' } },
                      { email: { contains: searchTerm, mode: 'insensitive' } },
                    ],
                  },
                },
                {
                  prestataire: {
                    nomEntreprise: { contains: searchTerm, mode: 'insensitive' },
                  },
                },
              ],
            },
            take: 10,
            include: {
              offre: {
                select: {
                  titre: true,
                },
              },
              client: {
                select: {
                  nom: true,
                  prenom: true,
                  email: true,
                },
              },
              prestataire: {
                select: {
                  nomEntreprise: true,
                },
              },
            },
          })
        : []

    // Sérialiser les dates et autres types Prisma
    const serializedUsers = users.map(u => ({
      ...u,
      createdAt: u.createdAt instanceof Date ? u.createdAt.toISOString() : u.createdAt,
    }))

    const serializedPrestataires = prestataires.map(p => ({
      ...p,
      createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt,
      user: p.user ? {
        ...p.user,
        createdAt: p.user.createdAt instanceof Date ? p.user.createdAt.toISOString() : p.user.createdAt,
      } : undefined,
    }))

    const serializedActivites = activites.map(a => ({
      ...a,
      createdAt: a.createdAt instanceof Date ? a.createdAt.toISOString() : a.createdAt,
    }))

    const serializedReservations = reservations.map(r => ({
      ...r,
      createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : r.createdAt,
    }))

    return successResponse(
      {
        users: serializedUsers,
        prestataires: serializedPrestataires,
        activites: serializedActivites,
        reservations: serializedReservations,
        total: users.length + prestataires.length + activites.length + reservations.length,
      },
      'Recherche effectuée avec succès',
      200
    )
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
        return errorResponse(error.message, 403)
      }
    }
    console.error('Error in search:', error)
    return errorResponse('Internal server error', 500)
  }
}

