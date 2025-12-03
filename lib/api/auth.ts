import { createClient } from '@/lib/supabase/server'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export interface AuthUser {
  id: string
  email: string
  role: 'USER' | 'PRESTATAIRE' | 'ADMIN'
}

/**
 * Récupère l'utilisateur authentifié depuis Supabase
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getAuthUser(_request?: NextRequest): Promise<AuthUser | null> {
  try {
    // En développement, retourner null si Supabase n'est pas configuré
    const isDevelopment = process.env.NODE_ENV === 'development'
    const skipAuth = process.env.SKIP_AUTH === 'true' || isDevelopment

    // Vérifier si Supabase est configuré
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      if (skipAuth) {
        console.warn('Supabase not configured, skipping auth check in development')
        return null
      }
      // En production, si Supabase n'est pas configuré, c'est une erreur
      throw new Error('Supabase is not configured')
    }

    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return null
    }

    // Récupérer les informations complètes depuis Prisma
    // En développement, si Prisma n'est pas configuré, retourner null
    try {
      const dbUser = await prisma.user.findUnique({
        where: { email: user.email! },
        select: { id: true, email: true, role: true },
      }) as { id: string; email: string; role: string } | null

      if (!dbUser) {
        return null
      }

      return {
        id: dbUser.id,
        email: dbUser.email,
        role: dbUser.role as AuthUser['role'],
      }
    } catch (prismaError) {
      // Si Prisma n'est pas configuré (pas de DATABASE_URL), retourner null
      if (skipAuth) {
        console.warn('Prisma not configured, skipping auth check in development')
        return null
      }
      throw prismaError
    }
  } catch (error) {
    console.error('Error getting auth user:', error)
    return null
  }
}

/**
 * Vérifie si l'utilisateur est authentifié
 */
export async function requireAuth(request?: NextRequest): Promise<AuthUser> {
  // En développement, permettre l'accès sans authentification pour voir l'interface
  const isDevelopment = process.env.NODE_ENV === 'development'
  const skipAuth = process.env.SKIP_AUTH === 'true' || isDevelopment

  if (skipAuth) {
    // Retourner un utilisateur admin fictif pour le développement
    return {
      id: 'dev-admin-id',
      email: 'admin@dev.local',
      role: 'ADMIN',
    }
  }

  const user = await getAuthUser(request)
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}

/**
 * Vérifie si l'utilisateur a un rôle spécifique
 */
export async function requireRole(
  role: 'USER' | 'PRESTATAIRE' | 'ADMIN',
  request?: NextRequest
): Promise<AuthUser> {
  const user = await requireAuth(request)
  
  // En développement, toujours autoriser
  const isDevelopment = process.env.NODE_ENV === 'development'
  const skipAuth = process.env.SKIP_AUTH === 'true' || isDevelopment
  
  if (skipAuth) {
    return user
  }

  if (user.role !== role && user.role !== 'ADMIN') {
    throw new Error('Forbidden')
  }
  return user
}

