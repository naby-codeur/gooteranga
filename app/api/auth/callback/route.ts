import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { getDashboardPath, getRealEmailFromSupabaseEmail } from '@/lib/utils/auth'

/**
 * GET /api/auth/callback
 * Gère les callbacks OAuth et email confirmation de Supabase
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/'

  if (code) {
    const supabase = await createClient()

    // Échanger le code contre une session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Synchroniser l'utilisateur avec Prisma si nécessaire
      try {
        // Utiliser l'ID Supabase pour trouver l'utilisateur
        const existingUser = await prisma.user.findUnique({
          where: { id: data.user.id },
        })

        if (!existingUser) {
          // Créer l'utilisateur dans Prisma s'il n'existe pas
          // (peut arriver avec OAuth ou si la création initiale a échoué)
          const userData = data.user.user_metadata || {}
          
          // Extraire l'email réel depuis l'email Supabase virtuel ou utiliser les metadata
          const realEmail = userData.realEmail || getRealEmailFromSupabaseEmail(data.user.email!)

          await prisma.user.create({
            data: {
              id: data.user.id,
              email: realEmail,
              nom: userData.nom || realEmail.split('@')[0],
              prenom: userData.prenom || null,
              telephone: userData.telephone || null,
              role: (userData.role as 'USER' | 'PRESTATAIRE' | 'ADMIN') || 'USER',
              emailVerified: data.user.email_confirmed_at
                ? new Date(data.user.email_confirmed_at)
                : null,
            },
          })

          // Si c'est un prestataire, créer le profil (automatiquement vérifié)
          if (userData.role === 'PRESTATAIRE' && userData.nomEntreprise && userData.typePrestataire) {
            await prisma.prestataire.create({
              data: {
                userId: data.user.id,
                nomEntreprise: userData.nomEntreprise,
                type: userData.typePrestataire,
                adresse: userData.adresse || null,
                ville: userData.ville || null,
                region: userData.region || null,
                description: userData.description || null,
                isVerified: true, // Validation automatique
              },
            })
          }
        } else if (data.user.email_confirmed_at) {
          // Vérifier si l'utilisateur existe et n'a pas encore emailVerified
          const userWithEmailVerified = existingUser as { id: string; emailVerified: Date | null } | null
          if (userWithEmailVerified && !userWithEmailVerified.emailVerified) {
            // Mettre à jour la date de vérification d'email
            await prisma.user.update({
              where: { id: userWithEmailVerified.id },
              data: {
                emailVerified: new Date(data.user.email_confirmed_at),
              },
            })
          }
        }
      } catch (prismaError) {
        console.error('Error syncing user with Prisma:', prismaError)
        // Continuer même en cas d'erreur Prisma
      }

      // Déterminer la redirection selon le rôle si aucune page spécifique n'est demandée
      let redirectPath = next
      
      if (next === '/' || next === '/dashboard' || !next.startsWith('/dashboard')) {
        // Récupérer le rôle de l'utilisateur depuis Prisma
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: data.user.id },
            select: { role: true },
          }) as { role: string } | null

          if (dbUser && dbUser.role) {
            redirectPath = getDashboardPath(dbUser.role as 'USER' | 'PRESTATAIRE' | 'ADMIN')
          }
        } catch (error) {
          // En cas d'erreur, utiliser le chemin par défaut
          console.error('Error getting user role in callback:', error)
        }
      }

      // Rediriger vers la page déterminée
      return NextResponse.redirect(new URL(redirectPath, request.url))
    }
  }

  // En cas d'erreur, rediriger vers la page de login
  return NextResponse.redirect(new URL('/login?error=auth_failed', request.url))
}

