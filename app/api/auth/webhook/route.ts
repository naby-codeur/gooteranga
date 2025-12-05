// Authentification désactivée pour le développement
import { NextRequest } from 'next/server'
import { successResponse } from '@/lib/api/response'

/**
 * POST /api/auth/webhook
 * Mode développement: retourne une réponse de succès
 */
export async function POST(_request: NextRequest) {
  return successResponse({ received: true })
}
