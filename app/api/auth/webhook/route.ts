// Authentification désactivée pour le développement
import { successResponse } from '@/lib/api/response'

/**
 * POST /api/auth/webhook
 * Mode développement: retourne une réponse de succès
 */
export async function POST() {
  return successResponse({ received: true })
}
