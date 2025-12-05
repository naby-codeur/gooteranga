// Authentification désactivée pour le développement
import { NextRequest } from 'next/server'
import { successResponse } from '@/lib/api/response'

/**
 * POST /api/auth/login
 * Mode développement: retourne une réponse de succès
 */
export async function POST(_request: NextRequest) {
  return successResponse(
    {
      user: {
        id: 'dev-user-id',
        email: 'user@dev.local',
        role: 'USER',
      },
    },
    'Connexion réussie (mode développement)'
  )
}
