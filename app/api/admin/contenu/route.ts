import { NextRequest } from 'next/server'
import { requireRole } from '@/lib/api/auth'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api/response'

/**
 * GET /api/admin/contenu
 * Récupère le contenu éditable d'une page ou toutes les pages
 */
export async function GET(request: NextRequest) {
  try {
    await requireRole('ADMIN', request)

    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page')

    if (page) {
      // Récupérer le contenu d'une page spécifique
      const contenu = await prisma.contenuEditable.findUnique({
        where: { page },
      })

      if (!contenu) {
        return successResponse(null, 'Contenu non trouvé', 200)
      }

      return successResponse(contenu, 'Contenu récupéré avec succès', 200)
    }

    // Récupérer tous les contenus
    const contenus = await prisma.contenuEditable.findMany({
      orderBy: { page: 'asc' },
    })

    return successResponse(contenus, 'Contenus récupérés avec succès', 200)
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
        return errorResponse(error.message, 403)
      }
    }
    console.error('Error fetching contenu:', error)
    return errorResponse('Internal server error', 500)
  }
}

/**
 * POST /api/admin/contenu
 * Crée ou met à jour le contenu éditable d'une page
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireRole('ADMIN', request)

    let body
    try {
      body = await request.json()
    } catch (parseError) {
      return errorResponse('Invalid JSON body', 400)
    }

    const { page, titre, contenu, meta } = body

    if (!page || !contenu) {
      return errorResponse('Page et contenu sont requis', 400)
    }

    // Vérifier si le contenu existe déjà
    const existing = await prisma.contenuEditable.findUnique({
      where: { page },
    })

    // S'assurer que contenu est un objet JSON valide
    let contenuData = contenu
    if (typeof contenu === 'string') {
      try {
        contenuData = JSON.parse(contenu)
      } catch (parseError) {
        return errorResponse('Le contenu doit être un JSON valide', 400)
      }
    }

    let result
    if (existing) {
      // Mettre à jour
      result = await prisma.contenuEditable.update({
        where: { page },
        data: {
          titre,
          contenu: contenuData,
          meta: meta || null,
          version: existing.version + 1,
          auteurId: user.id,
        },
      })
    } else {
      // Créer
      result = await prisma.contenuEditable.create({
        data: {
          page,
          titre,
          contenu: contenuData,
          meta: meta || null,
          auteurId: user.id,
        },
      })
    }

    return successResponse(result, 'Contenu sauvegardé avec succès', 200)
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
        return errorResponse(error.message, 403)
      }
    }
    console.error('Error saving contenu:', error)
    return errorResponse('Internal server error', 500)
  }
}

/**
 * DELETE /api/admin/contenu
 * Supprime le contenu d'une page (réinitialise au contenu par défaut)
 */
export async function DELETE(request: NextRequest) {
  try {
    await requireRole('ADMIN', request)

    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page')

    if (!page) {
      return errorResponse('Page est requis', 400)
    }

    await prisma.contenuEditable.delete({
      where: { page },
    })

    return successResponse({}, 'Contenu supprimé avec succès', 200)
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
        return errorResponse(error.message, 403)
      }
    }
    console.error('Error deleting contenu:', error)
    return errorResponse('Internal server error', 500)
  }
}

