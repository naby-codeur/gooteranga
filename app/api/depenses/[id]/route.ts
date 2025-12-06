import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/api/auth'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api/response'

/**
 * DELETE /api/depenses/[id]
 * Supprime une dépense
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authUser = await requireAuth(request)
    const { id } = params

    // Vérifier que la dépense appartient à l'utilisateur
    const depense = await prisma.depense.findUnique({
      where: { id },
    })

    if (!depense) {
      return errorResponse('Dépense non trouvée', 404)
    }

    if (depense.userId !== authUser.id) {
      return errorResponse('Non autorisé', 403)
    }

    await prisma.depense.delete({
      where: { id },
    })

    return successResponse(null, 'Dépense supprimée avec succès')
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
        return errorResponse(error.message, 403)
      }
    }
    console.error('Error deleting expense:', error)
    return errorResponse('Internal server error', 500)
  }
}

/**
 * PATCH /api/depenses/[id]
 * Met à jour une dépense
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authUser = await requireAuth(request)
    const { id } = params

    // Vérifier que la dépense appartient à l'utilisateur
    const depense = await prisma.depense.findUnique({
      where: { id },
    })

    if (!depense) {
      return errorResponse('Dépense non trouvée', 404)
    }

    if (depense.userId !== authUser.id) {
      return errorResponse('Non autorisé', 403)
    }

    const body = await request.json()
    const { titre, description, categorie, montant, date, lieu, methode } = body

    const updateData: {
      titre?: string
      description?: string | null
      categorie?: string
      montant?: number
      date?: Date
      lieu?: string | null
      methode?: string | null
    } = {}

    if (titre !== undefined) updateData.titre = titre
    if (description !== undefined) updateData.description = description || null
    if (categorie !== undefined) updateData.categorie = categorie
    if (montant !== undefined) {
      if (montant <= 0) {
        return errorResponse('Le montant doit être supérieur à 0', 400)
      }
      updateData.montant = Number(montant)
    }
    if (date !== undefined) updateData.date = new Date(date)
    if (lieu !== undefined) updateData.lieu = lieu || null
    if (methode !== undefined) updateData.methode = methode || null

    const updated = await prisma.depense.update({
      where: { id },
      data: updateData,
    })

    return successResponse(updated, 'Dépense mise à jour avec succès')
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
        return errorResponse(error.message, 403)
      }
    }
    console.error('Error updating expense:', error)
    return errorResponse('Internal server error', 500)
  }
}


