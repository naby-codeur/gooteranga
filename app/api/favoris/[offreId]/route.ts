import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, handleApiError } from '@/lib/api/response'
import { requireAuth } from '@/lib/api/auth'

/**
 * DELETE /api/favoris/[offreId]
 * Retire une offre des favoris
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ offreId: string }> }
) {
  try {
    const { offreId } = await params
    const user = await requireAuth(request)

    const favori = await (prisma as { favori: { findUnique: (args: unknown) => Promise<unknown> } }).favori.findUnique({
      where: {
        userId_offreId: {
          userId: user.id,
          offreId,
        },
      },
    })

    if (!favori) {
      return errorResponse('Favori non trouvé', 404)
    }

    await (prisma as { favori: { delete: (args: unknown) => Promise<unknown> } }).favori.delete({
      where: {
        userId_offreId: {
          userId: user.id,
          offreId,
        },
      },
    })

    return successResponse(null, 'Offre retirée des favoris')
  } catch (error) {
    return handleApiError(error)
  }
}

