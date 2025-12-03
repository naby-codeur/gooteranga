import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, handleApiError } from '@/lib/api/response'
import { getRealEmailFromSupabaseEmail } from '@/lib/utils/auth'

/**
 * GET /api/auth/session
 * Récupère la session actuelle de l'utilisateur
 */
export async function GET() {
  try {
    const supabase = await createClient()

    // Récupérer l'utilisateur Supabase
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !authUser) {
      return successResponse({ user: null })
    }

    // Vérifier si Prisma est en mode mock (pas de DATABASE_URL)
    const isPrismaMock = !process.env.DATABASE_URL && process.env.NODE_ENV === 'development'

    // Détecter les sessions orphelines ou invalides
    // Si l'email contient "mock@example.com" ou si on est en mode mock sans utilisateur
    const userEmail = authUser.email || ''
    const isMockEmail = userEmail.includes('mock@example.com') || userEmail.includes('mock-id')
    
    if (isMockEmail) {
      console.warn('Invalid mock session detected, cleaning up...')
      // Nettoyer la session Supabase
      try {
        await supabase.auth.signOut()
      } catch (error) {
        console.error('Error signing out mock session:', error)
      }
      return successResponse({ user: null })
    }

    // Utiliser l'ID Supabase pour trouver l'utilisateur dans Prisma
    // (car l'email Supabase est maintenant virtuel)
    let dbUser = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: {
        id: true,
        email: true,
        nom: true,
        prenom: true,
        telephone: true,
        role: true,
        avatar: true,
        createdAt: true,
        prestataire: {
          select: {
            id: true,
            nomEntreprise: true,
            type: true,
            isVerified: true,
            planType: true,
          },
        },
      },
    })

    // Si Prisma est en mode mock et qu'aucun utilisateur n'existe,
    // ne pas créer d'utilisateur mock mais retourner null pour forcer la déconnexion
    if (!dbUser && isPrismaMock) {
      console.warn('Prisma is in mock mode and user not found. Cleaning up orphaned session.')
      // Nettoyer la session Supabase
      try {
        await supabase.auth.signOut()
      } catch (error) {
        console.error('Error signing out orphaned session:', error)
      }
      return successResponse({ user: null })
    }

    // Si l'utilisateur n'existe pas dans Prisma mais existe dans Supabase,
    // le créer automatiquement depuis les metadata Supabase
    if (!dbUser) {
      const userMetadata = authUser.user_metadata || {}
      const realEmail = userMetadata.realEmail || getRealEmailFromSupabaseEmail(authUser.email || '')
      
      // Si on ne peut pas extraire l'email réel, retourner une erreur
      if (!realEmail) {
        console.error('Cannot extract real email from Supabase user:', authUser.email)
        return errorResponse('Erreur lors de la récupération de votre profil. Veuillez réessayer.', 400)
      }

      try {
        // Créer l'utilisateur dans Prisma
        dbUser = await prisma.user.create({
          data: {
            id: authUser.id,
            email: realEmail,
            nom: userMetadata.nom || realEmail.split('@')[0] || 'Utilisateur',
            prenom: userMetadata.prenom || null,
            telephone: userMetadata.telephone || null,
            role: (userMetadata.role as 'USER' | 'PRESTATAIRE' | 'ADMIN') || 'USER',
            emailVerified: authUser.email_confirmed_at ? new Date(authUser.email_confirmed_at) : null,
          },
          select: {
            id: true,
            email: true,
            nom: true,
            prenom: true,
            telephone: true,
            role: true,
            avatar: true,
            createdAt: true,
            prestataire: {
              select: {
                id: true,
                nomEntreprise: true,
                type: true,
                isVerified: true,
                planType: true,
              },
            },
          },
        })

        // Si c'est un prestataire, créer le profil prestataire (automatiquement vérifié)
        if (userMetadata.role === 'PRESTATAIRE' && userMetadata.nomEntreprise && userMetadata.typePrestataire) {
          await prisma.prestataire.create({
            data: {
              userId: authUser.id,
              nomEntreprise: userMetadata.nomEntreprise,
              type: userMetadata.typePrestataire,
              adresse: userMetadata.adresse || null,
              ville: userMetadata.ville || null,
              region: userMetadata.region || null,
              description: userMetadata.description || null,
              isVerified: true, // Validation automatique
            },
          })

          // Recharger l'utilisateur pour inclure le prestataire
          dbUser = await prisma.user.findUnique({
            where: { id: authUser.id },
            select: {
              id: true,
              email: true,
              nom: true,
              prenom: true,
              telephone: true,
              role: true,
              avatar: true,
              createdAt: true,
              prestataire: {
                select: {
                  id: true,
                  nomEntreprise: true,
                  type: true,
                  isVerified: true,
                  planType: true,
                },
              },
            },
          })
        }
      } catch (createError) {
        console.error('Error creating user in Prisma:', createError)
        // Si c'est une erreur de contrainte unique, l'utilisateur existe peut-être avec un autre ID
        // Essayer de le trouver par email et rôle
        if (createError && typeof createError === 'object' && 'code' in createError && createError.code === 'P2002') {
          const role = (userMetadata.role as 'USER' | 'PRESTATAIRE' | 'ADMIN') || 'USER'
          dbUser = await prisma.user.findUnique({
            where: {
              email_role: {
                email: realEmail,
                role: role,
              },
            },
            select: {
              id: true,
              email: true,
              nom: true,
              prenom: true,
              telephone: true,
              role: true,
              avatar: true,
              createdAt: true,
              prestataire: {
                select: {
                  id: true,
                  nomEntreprise: true,
                  type: true,
                  isVerified: true,
                  planType: true,
                },
              },
            },
          })
        } else {
          return errorResponse('Erreur lors de la récupération de votre profil. Veuillez réessayer.', 400)
        }
      }
    }

    if (!dbUser) {
      return errorResponse('Erreur lors de la récupération de votre profil. Veuillez réessayer.', 400)
    }

    return successResponse({
      user: dbUser,
    })
  } catch (error) {
    console.error('Error in /api/auth/session:', error)
    return handleApiError(error)
  }
}

