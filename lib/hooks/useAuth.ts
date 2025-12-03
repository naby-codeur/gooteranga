'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { apiFetch } from './useApi'

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
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchSession = useCallback(async () => {
    try {
      const result = await apiFetch<{ user: User }>('/api/auth/session')

      // Si 401 ou 403, l'utilisateur n'est pas authentifié (c'est normal)
      if (result.status === 401 || result.status === 403) {
        setUser(null)
        setLoading(false)
        return
      }

      if (result.success && result.data?.user) {
        const userData = result.data.user
        // Détecter et nettoyer les utilisateurs mock invalides
        if (userData.email && (userData.email.includes('mock@example.com') || userData.email.includes('mock-id'))) {
          console.warn('Invalid mock user detected, cleaning up session...')
          setUser(null)
          // Nettoyer la session Supabase
          const supabase = createClient()
          await supabase.auth.signOut()
          await fetch('/api/auth/logout', { method: 'POST' })
          return
        }
        setUser(userData)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Error fetching session:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSession()

    // Écouter les changements d'authentification Supabase
    const supabase = createClient()
    
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        fetchSession()
        router.refresh()
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        router.refresh()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, fetchSession])

  const signOut = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Error signing out:', error)
      // En cas d'erreur, rediriger quand même
      router.push('/')
      router.refresh()
    }
  }

  const refresh = async () => {
    await fetchSession()
    router.refresh()
  }

  return { user, loading, signOut, refresh }
}


