/**
 * Utilitaires pour l'authentification et la gestion des rôles
 */

export type UserRole = 'USER' | 'PRESTATAIRE' | 'ADMIN'

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


