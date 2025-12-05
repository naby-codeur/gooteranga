'use client'

import { useState, useEffect } from 'react'

export interface User {
  id: string
  email: string
  nom: string
  prenom?: string | null
  telephone?: string | null
  role: 'USER' | 'PRESTATAIRE' | 'ADMIN'
  avatar?: string | null
  prestataire?: {
    id: string
    nomEntreprise: string
    type: string
    isVerified: boolean
    planType: string
  } | null
}

interface UseAuthReturn {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
  refresh: () => Promise<void>
}

/**
 * Hook pour gérer l'authentification côté client
 * Mode développement: retourne un utilisateur fictif
 */
export function useAuth(): UseAuthReturn {
  // Détecter le type d'utilisateur selon l'URL
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simuler un délai de chargement
    const timer = setTimeout(() => {
      // Déterminer le rôle selon l'URL actuelle
      const path = window.location.pathname
      let mockUser: User

      if (path.includes('/dashboard/admin')) {
        // Utilisateur admin fictif
        mockUser = {
          id: 'dev-admin-id',
          email: 'admin@gooteranga.com',
          nom: 'Administrateur',
          prenom: 'Principal',
          telephone: '+221 77 000 00 00',
          role: 'ADMIN',
          avatar: null,
        }
      } else if (path.includes('/dashboard/prestataire')) {
        // Utilisateur prestataire fictif
        mockUser = {
          id: 'dev-prestataire-id',
          email: 'prestataire@example.com',
          nom: 'Dupont',
          prenom: 'Jean',
          telephone: '+221 77 123 45 67',
          role: 'PRESTATAIRE',
          avatar: null,
          prestataire: {
            id: 'dev-prestataire-profile-id',
            nomEntreprise: 'Hôtel Teranga',
            type: 'HOTEL',
            isVerified: true,
            planType: 'FREE',
          },
        }
      } else {
        // Utilisateur client fictif
        mockUser = {
          id: 'dev-user-id',
          email: 'client@example.com',
          nom: 'Martin',
          prenom: 'Marie',
          telephone: '+221 77 987 65 43',
          role: 'USER',
          avatar: null,
        }
      }

      setUser(mockUser)
      setLoading(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const signOut = async () => {
    setUser(null)
    // Ne rien faire en mode développement
  }

  const refresh = async () => {
    // Recharger l'utilisateur fictif
    setLoading(true)
    setTimeout(() => {
      const path = window.location.pathname
      let mockUser: User

      if (path.includes('/dashboard/admin')) {
        mockUser = {
          id: 'dev-admin-id',
          email: 'admin@gooteranga.com',
          nom: 'Administrateur',
          prenom: 'Principal',
          telephone: '+221 77 000 00 00',
          role: 'ADMIN',
          avatar: null,
        }
      } else if (path.includes('/dashboard/prestataire')) {
        mockUser = {
          id: 'dev-prestataire-id',
          email: 'prestataire@example.com',
          nom: 'Dupont',
          prenom: 'Jean',
          telephone: '+221 77 123 45 67',
          role: 'PRESTATAIRE',
          avatar: null,
          prestataire: {
            id: 'dev-prestataire-profile-id',
            nomEntreprise: 'Hôtel Teranga',
            type: 'HOTEL',
            isVerified: true,
            planType: 'FREE',
          },
        }
      } else {
        mockUser = {
          id: 'dev-user-id',
          email: 'client@example.com',
          nom: 'Martin',
          prenom: 'Marie',
          telephone: '+221 77 987 65 43',
          role: 'USER',
          avatar: null,
        }
      }

      setUser(mockUser)
      setLoading(false)
    }, 100)
  }

  return { user, loading, signOut, refresh }
}


