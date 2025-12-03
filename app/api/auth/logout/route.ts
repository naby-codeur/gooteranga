import { createClient } from '@/lib/supabase/server'
import { successResponse, errorResponse, handleApiError } from '@/lib/api/response'

/**
 * POST /api/auth/logout
 * Déconnecte l'utilisateur
 */
export async function POST() {
  try {
    const supabase = await createClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
      return errorResponse(error.message, 400)
    }

    return successResponse(null, 'Déconnexion réussie')
  } catch (error) {
    return handleApiError(error)
  }
}

