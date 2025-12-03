import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, handleApiError } from '@/lib/api/response'

/**
 * POST /api/auth/login
 * Connecte un utilisateur
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validation
    if (!email || !password) {
      return errorResponse('Email et mot de passe sont requis', 400)
    }

    const supabase = await createClient()

    // Connexion avec Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError || !authData.user) {
      return errorResponse(
        authError?.message || 'Email ou mot de passe incorrect',
        401
      )
    }

    // Vérifier si l'email est vérifié (optionnel selon votre configuration)
    if (!authData.user.email_confirmed_at && process.env.NODE_ENV === 'production') {
      return errorResponse(
        'Veuillez vérifier votre email avant de vous connecter',
        403
      )
    }

    // Définir explicitement la session pour que les cookies soient correctement configurés
    if (authData.session) {
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: authData.session.access_token,
        refresh_token: authData.session.refresh_token,
      })

      if (sessionError) {
        console.error('Error setting session:', sessionError)
        // Continuer quand même, la session peut déjà être définie
      }
    }

    // Récupérer le rôle depuis Prisma en utilisant l'ID Supabase
    const dbUser = await prisma.user.findUnique({
      where: { id: authData.user.id },
      select: {
        id: true,
        email: true,
        role: true,
      },
    }) as { id: string; email: string; role: string } | null

    // Créer la réponse avec les cookies de session
    const response = successResponse(
      {
        user: {
          id: authData.user.id,
          email: dbUser?.email || authData.user.email!,
          role: (dbUser?.role as 'USER' | 'PRESTATAIRE' | 'ADMIN') || 'USER',
        },
      },
      'Connexion réussie'
    )

    return response
  } catch (error) {
    return handleApiError(error)
  }
}

