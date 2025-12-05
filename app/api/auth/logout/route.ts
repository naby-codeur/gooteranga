// Authentification désactivée pour le développement
import { successResponse } from '@/lib/api/response'

/**
 * POST /api/auth/logout
 * Mode développement: retourne une réponse de succès
 */
export async function POST() {
  return successResponse(null, 'Déconnexion réussie (mode développement)')
}
