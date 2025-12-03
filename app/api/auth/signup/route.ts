import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, handleApiError } from '@/lib/api/response'
import { getSupabaseEmail } from '@/lib/utils/auth'
import { validatePassword, isHIBPError, getHIBPErrorMessage } from '@/lib/utils/password'

/**
 * POST /api/auth/signup
 * Crée un nouveau compte utilisateur
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      email,
      password,
      nom,
      prenom,
      telephone,
      role = 'USER',
      // Champs pour prestataire
      nomEntreprise,
      typePrestataire,
      adresse,
      ville,
      region,
      description,
    } = body

    // Validation
    if (!email || !password || !nom) {
      return errorResponse('Email, mot de passe et nom sont requis', 400)
    }

    if (password.length < 8) {
      return errorResponse('Le mot de passe doit contenir au moins 8 caractères', 400)
    }

    // Validation HIBP optionnelle (vérification avant envoi à Supabase)
    // Cela permet d'éviter un aller-retour réseau si le mot de passe est compromis
    const passwordValidation = await validatePassword(password)
    if (passwordValidation.isCompromised) {
      return errorResponse(passwordValidation.message || 'Ce mot de passe est compromis', 400)
    }

    const userRole = role as 'USER' | 'PRESTATAIRE' | 'ADMIN'

    // Vérifier que ce rôle n'existe pas déjà pour cet email
    const existingUser = await prisma.user.findUnique({
      where: { 
        email_role: {
          email,
          role: userRole,
        }
      },
    })

    if (existingUser) {
      return errorResponse(`Un compte ${userRole === 'PRESTATAIRE' ? 'prestataire' : 'touriste'} existe déjà pour cet email`, 409)
    }

    const supabase = await createClient()

    // Générer l'email virtuel pour Supabase (permet plusieurs comptes avec la même email)
    const supabaseEmail = getSupabaseEmail(email, userRole)

    // Créer l'utilisateur dans Supabase Auth avec l'email virtuel
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: supabaseEmail,
      password,
      options: {
        emailRedirectTo: `${request.nextUrl.origin}/auth/callback`,
        data: {
          nom,
          prenom,
          telephone,
          role,
          realEmail: email, // Stocker l'email réel dans les metadata
        },
      },
    })

    if (authError || !authData.user) {
      // Vérifier si l'erreur est liée à HIBP
      if (authError && isHIBPError(authError.message)) {
        return errorResponse(getHIBPErrorMessage(authError.message), 400)
      }
      return errorResponse(authError?.message || 'Erreur lors de la création du compte', 400)
    }

    // Créer l'utilisateur dans Prisma avec l'email réel
    const user = await prisma.user.create({
      data: {
        email, // Email réel
        nom,
        prenom: prenom || null,
        telephone: telephone || null,
        role: userRole,
        // Lier avec l'ID Supabase
        id: authData.user.id,
      },
    }) as { id: string; email: string; nom: string; prenom: string | null; role: string }

    // Si c'est un prestataire, créer le profil prestataire (automatiquement vérifié)
    if (role === 'PRESTATAIRE' && nomEntreprise && typePrestataire) {
      await prisma.prestataire.create({
        data: {
          userId: user.id,
          nomEntreprise,
          type: typePrestataire,
          adresse: adresse || null,
          ville: ville || null,
          region: region || null,
          description: description || null,
          isVerified: true, // Validation automatique
        },
      })
    }

    return successResponse(
      {
        user: {
          id: user.id,
          email: user.email,
          nom: user.nom,
          prenom: user.prenom,
          role: user.role,
        },
        // Ne pas renvoyer la session complète pour la sécurité
        requiresEmailVerification: !authData.session,
      },
      authData.session
        ? 'Compte créé avec succès'
        : 'Compte créé. Veuillez vérifier votre email pour confirmer votre compte.'
    )
  } catch (error) {
    return handleApiError(error)
  }
}

