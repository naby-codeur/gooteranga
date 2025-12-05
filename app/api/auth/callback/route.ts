// Authentification désactivée pour le développement
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/auth/callback
 * Mode développement: redirige vers le dashboard
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const next = requestUrl.searchParams.get('next') || '/dashboard'
  
  // Rediriger vers la page demandée ou le dashboard
  return NextResponse.redirect(new URL(next, request.url))
}
