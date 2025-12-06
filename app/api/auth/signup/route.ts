// Authentification désactivée pour le développement
import { successResponse } from '@/lib/api/response'

/**
 * POST /api/auth/signup
 * Mode développement: retourne une réponse de succès
 */
export async function POST() {
  return successResponse(
    {
      user: {
        id: 'dev-user-id',
        email: 'user@dev.local',
        nom: 'Dev',
        prenom: 'User',
        role: 'USER',
      },
      requiresEmailVerification: false,
    },
    'Compte créé avec succès (mode développement)'
  )
}
