import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api/response'

/**
 * GET /api/referrals/code?code=GT-ABCD1234
 * Vérifie si un code parrain est valide
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    if (!code) {
      return errorResponse('Code parrain requis', 400)
    }

    // Vérifier si le code existe
    const prestataire = await prisma.prestataire.findUnique({
      where: { codeParrain: code },
      select: {
        id: true,
        nomEntreprise: true,
        isVerified: true,
      },
    })

    if (!prestataire) {
      return errorResponse('Code parrain invalide', 404)
    }

    if (!prestataire.isVerified) {
      return errorResponse('Le prestataire parrain n\'est pas encore vérifié', 403)
    }

    return successResponse(
      {
        valide: true,
        parrain: {
          nomEntreprise: prestataire.nomEntreprise,
        },
      },
      'Code parrain valide'
    )
  } catch (error: unknown) {
    console.error('Error checking referral code:', error)
    return errorResponse('Internal server error', 500)
  }
}


