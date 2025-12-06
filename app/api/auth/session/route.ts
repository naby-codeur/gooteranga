// Authentification désactivée pour le développement - retourne des utilisateurs fictifs

import { successResponse } from '@/lib/api/response'

/**
 * GET /api/auth/session
 * Récupère la session actuelle de l'utilisateur (mode développement: utilisateur fictif)
 */
export async function GET() {
  // Mode développement: retourner un utilisateur fictif
  // Le hook useAuth déterminera le type d'utilisateur selon l'URL côté client
  
  // Par défaut, retourner un utilisateur client fictif
  // Le hook useAuth ajustera selon l'URL
  const mockUser = {
    id: 'dev-user-id',
    email: 'client@example.com',
    nom: 'Martin',
    prenom: 'Marie',
    telephone: '+221 77 987 65 43',
    role: 'USER' as const,
    avatar: null,
    createdAt: new Date().toISOString(),
    prestataire: null,
  }

  return successResponse({
    user: mockUser,
  })
}
