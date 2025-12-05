// Authentification désactivée pour le développement - retourne des utilisateurs fictifs

import { NextRequest } from 'next/server'

export interface AuthUser {
  id: string
  email: string
  role: 'USER' | 'PRESTATAIRE' | 'ADMIN'
}

/**
 * Récupère l'utilisateur authentifié (mode développement: utilisateur fictif)
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getAuthUser(_request?: NextRequest): Promise<AuthUser | null> {
  // Mode développement: retourner un utilisateur fictif selon le contexte
  // En production, cette fonction devrait vérifier la session réelle
  return {
    id: 'dev-user-id',
    email: 'user@dev.local',
    role: 'USER',
  }
}

/**
 * Vérifie si l'utilisateur est authentifié (mode développement: toujours vrai)
 */
export async function requireAuth(request?: NextRequest): Promise<AuthUser> {
  // Mode développement: retourner un utilisateur fictif
  // En production, cette fonction devrait vérifier la session réelle
  return {
    id: 'dev-user-id',
    email: 'user@dev.local',
    role: 'USER',
  }
}

/**
 * Vérifie si l'utilisateur a un rôle spécifique (mode développement: toujours autorisé)
 */
export async function requireRole(
  role: 'USER' | 'PRESTATAIRE' | 'ADMIN',
  request?: NextRequest
): Promise<AuthUser> {
  // Mode développement: retourner un utilisateur avec le rôle demandé
  return {
    id: `dev-${role.toLowerCase()}-id`,
    email: `${role.toLowerCase()}@dev.local`,
    role: role,
  }
}

