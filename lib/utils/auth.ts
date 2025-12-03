/**
 * Utilitaires pour l'authentification et la gestion des rôles
 */

export type UserRole = 'USER' | 'PRESTATAIRE' | 'ADMIN'

/**
 * Génère un email virtuel pour Supabase basé sur l'email réel et le rôle
 * Permet d'avoir plusieurs comptes Supabase avec la même email mais des rôles différents
 */
export function getSupabaseEmail(realEmail: string, role: UserRole): string {
  const [localPart, domain] = realEmail.split('@')
  if (!domain) {
    throw new Error('Email invalide')
  }
  
  // Pour USER, on utilise l'email tel quel ou avec +user
  // Pour PRESTATAIRE, on utilise +prestataire
  // Pour ADMIN, on utilise +admin
  const roleSuffix = role === 'USER' ? 'user' : role.toLowerCase()
  return `${localPart}+${roleSuffix}@${domain}`
}

/**
 * Extrait l'email réel depuis un email Supabase virtuel
 */
export function getRealEmailFromSupabaseEmail(supabaseEmail: string): string {
  // Si l'email contient +role@, on l'enlève
  const match = supabaseEmail.match(/^(.+)\+[^@]+@(.+)$/)
  if (match) {
    return `${match[1]}@${match[2]}`
  }
  return supabaseEmail
}

/**
 * Détermine le dashboard approprié selon le rôle de l'utilisateur
 */
export function getDashboardPath(role: UserRole): string {
  switch (role) {
    case 'PRESTATAIRE':
      return '/dashboard/prestataire'
    case 'ADMIN':
      return '/dashboard/admin'
    case 'USER':
    default:
      return '/dashboard'
  }
}

/**
 * Vérifie si un utilisateur peut accéder à un dashboard spécifique
 */
export function canAccessDashboard(userRole: UserRole, dashboardPath: string): boolean {
  // Les admins peuvent accéder à tout
  if (userRole === 'ADMIN') {
    return true
  }

  // Vérifier selon le chemin
  if (dashboardPath === '/dashboard/admin') {
    return false // Déjà vérifié au début, seul ADMIN peut accéder
  }

  if (dashboardPath === '/dashboard/prestataire') {
    return userRole === 'PRESTATAIRE'
  }

  if (dashboardPath === '/dashboard') {
    return userRole === 'USER'
  }

  return false
}


