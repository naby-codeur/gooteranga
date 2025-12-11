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
      let contenu
      try {
        contenu = await prisma.contenuEditable.findUnique({
          where: { page },
        })
      } catch (dbError) {
        console.error(`Error fetching contenu from database for page ${page}:`, dbError)
        return errorResponse('Erreur lors de la récupération du contenu', 500)
      }

      if (!contenu) {
        return successResponse(null, 'Contenu non trouvé', 200)
      }

      // Valider et nettoyer le contenu JSON
      let contenuValide
      try {
        // Créer une copie de l'objet pour éviter de modifier l'original
        contenuValide = {
          ...contenu,
          contenu: null as any
        }

        // Si contenu est déjà un objet, le valider en le sérialisant/désérialisant
        if (typeof contenu.contenu === 'object' && contenu.contenu !== null) {
          try {
            // Essayer de sérialiser pour valider
            const serialized = JSON.stringify(contenu.contenu)
            // Puis désérialiser pour s'assurer que c'est valide
            contenuValide.contenu = JSON.parse(serialized)
          } catch (serializeError) {
            console.error(`Invalid JSON object in contenu for page ${page}:`, serializeError)
            contenuValide.contenu = { sections: [] }
          }
        } else if (typeof contenu.contenu === 'string') {
          // Si c'est une string, essayer de la parser
          try {
            contenuValide.contenu = JSON.parse(contenu.contenu)
            // Valider que le résultat est un objet avec sections
            if (!contenuValide.contenu || typeof contenuValide.contenu !== 'object') {
              contenuValide.contenu = { sections: [] }
            }
          } catch (parseError) {
            console.error(`Invalid JSON string in contenu for page ${page}:`, parseError)
            contenuValide.contenu = { sections: [] }
          }
        } else {
          // Type inattendu, utiliser un contenu vide
          console.warn(`Unexpected contenu type for page ${page}:`, typeof contenu.contenu)
          contenuValide.contenu = { sections: [] }
        }
      } catch (jsonError) {
        console.error(`Error processing JSON in contenu for page ${page}:`, jsonError)
        // En cas d'erreur, retourner un contenu vide
        contenuValide = {
          ...contenu,
          contenu: { sections: [] },
        }
      }

      // S'assurer que la réponse peut être sérialisée
      try {
        JSON.stringify(contenuValide)
        return successResponse(contenuValide, 'Contenu récupéré avec succès', 200)
      } catch (serializeError) {
        console.error(`Error serializing response for page ${page}:`, serializeError)
        // Retourner un contenu minimal et valide
        return successResponse(
          {
            id: contenu.id,
            page: contenu.page,
            titre: contenu.titre || null,
            contenu: { sections: [] },
            meta: null,
            version: contenu.version,
            auteurId: contenu.auteurId,
            createdAt: contenu.createdAt,
            updatedAt: contenu.updatedAt,
          },
          'Contenu récupéré avec succès (corrigé)',
          200
        )
      }
    }

    // Récupérer tous les contenus
    let contenus
    try {
      contenus = await prisma.contenuEditable.findMany({
        orderBy: { page: 'asc' },
      })
    } catch (dbError) {
      console.error('Error fetching contenus from database:', dbError)
      return errorResponse('Erreur lors de la récupération des contenus', 500)
    }

    // Valider tous les contenus
    const contenusValides = contenus.map(contenu => {
      try {
        if (typeof contenu.contenu === 'object' && contenu.contenu !== null) {
          JSON.stringify(contenu.contenu)
        } else if (typeof contenu.contenu === 'string') {
          try {
            contenu.contenu = JSON.parse(contenu.contenu)
          } catch (parseError) {
            console.error(`Invalid JSON string in contenu for page ${contenu.page}:`, parseError)
            return {
              ...contenu,
              contenu: { sections: [] },
            }
          }
        }
        return contenu
      } catch (jsonError) {
        console.error(`Invalid JSON in contenu for page ${contenu.page}:`, jsonError)
        return {
          ...contenu,
          contenu: { sections: [] },
        }
      }
    })

    return successResponse(contenusValides, 'Contenus récupérés avec succès', 200)
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

