// Authentification désactivée pour le développement
import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api/response'
// import { prisma } from '@/lib/prisma'
// import { generateReferralCode } from '@/lib/utils/referral'
// import { REFERRAL_POINTS } from '@/lib/utils/referral'

/**
 * POST /api/auth/signup
 * Mode développement: retourne une réponse de succès
 * 
 * TODO: En production, cette API doit :
 * 1. Créer l'utilisateur dans Supabase Auth
 * 2. Créer le User dans Prisma
 * 3. Si PRESTATAIRE :
 *    - Créer le Prestataire avec un codeParrain généré (generateReferralCode())
 *    - Si codeParrain fourni, créer un Referral avec statut PENDING
 *    - Déclencher l'événement INSCRIPTION_VALIDEE via /api/referrals/events
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { codeParrain, role } = body

    // En mode développement, on simule juste la réponse
    // En production, il faudrait :
    // 1. Vérifier le codeParrain si fourni (pour PRESTATAIRE)
    // 2. Créer le prestataire avec generateReferralCode()
    // 3. Créer le Referral si codeParrain valide
    // 4. Déclencher l'événement INSCRIPTION_VALIDEE

    if (role === 'PRESTATAIRE' && codeParrain) {
      // En production, vérifier que le code existe et créer le referral
      // const parrain = await prisma.prestataire.findUnique({
      //   where: { codeParrain }
      // })
      // if (!parrain) {
      //   return errorResponse('Code parrain invalide', 400)
      // }
      // Créer le referral avec statut PENDING
      // Déclencher l'événement INSCRIPTION_VALIDEE après validation
    }

    return successResponse(
      {
        user: {
          id: 'dev-user-id',
          email: body.email || 'user@dev.local',
          nom: body.nom || 'Dev',
          prenom: body.prenom || 'User',
          role: role || 'USER',
        },
        requiresEmailVerification: false,
        // En production, inclure l'ID du prestataire créé si PRESTATAIRE
        prestataire: role === 'PRESTATAIRE' ? {
          id: 'dev-prestataire-id',
          codeParrain: 'GT-DEV1234', // En production: code généré
        } : null,
      },
      'Compte créé avec succès (mode développement)'
    )
  } catch (error) {
    console.error('Signup error:', error)
    return errorResponse('Erreur lors de la création du compte', 500)
  }
}
