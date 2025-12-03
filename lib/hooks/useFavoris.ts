'use client'

import { useState, useEffect } from 'react'
import { apiFetch } from './useApi'

export interface Favori {
  id: string
  offre: {
    id: string
    titre: string
    description: string
    prix: number
    images: string[]
    type: string
    region: string
    ville: string
    rating: number
    prestataire: {
      id: string
      nomEntreprise: string
      logo: string | null
      isVerified: boolean
      rating: number
    }
    _count: {
      avis: number
      reservations: number
    }
  }
  createdAt: string
}

interface UseFavorisReturn {
  favoris: Favori[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  addFavori: (offreId: string) => Promise<boolean>
  removeFavori: (offreId: string) => Promise<boolean>
}

export function useFavoris(): UseFavorisReturn {
  const [favoris, setFavoris] = useState<Favori[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFavoris = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await apiFetch<{ favoris: Favori[]; pagination?: unknown }>('/api/favoris')

      if (result.success && result.data) {
        setFavoris(result.data.favoris || [])
      } else {
        setError(result.error || 'Erreur lors du chargement des favoris')
      }
    } catch (err) {
      setError('Erreur lors du chargement des favoris')
      console.error('Error fetching favoris:', err)
    } finally {
      setLoading(false)
    }
  }

  const addFavori = async (offreId: string): Promise<boolean> => {
    try {
      const result = await apiFetch('/api/favoris', {
        method: 'POST',
        body: JSON.stringify({ offreId }),
      })

      if (result.success) {
        await fetchFavoris()
        return true
      } else {
        setError(result.error || 'Erreur lors de l\'ajout aux favoris')
        return false
      }
    } catch (err) {
      setError('Erreur lors de l\'ajout aux favoris')
      console.error('Error adding favori:', err)
      return false
    }
  }

  const removeFavori = async (offreId: string): Promise<boolean> => {
    try {
      const result = await apiFetch(`/api/favoris/${offreId}`, {
        method: 'DELETE',
      })

      if (result.success) {
        await fetchFavoris()
        return true
      } else {
        setError(result.error || 'Erreur lors de la suppression des favoris')
        return false
      }
    } catch (err) {
      setError('Erreur lors de la suppression des favoris')
      console.error('Error removing favori:', err)
      return false
    }
  }

  useEffect(() => {
    fetchFavoris()
  }, [])

  return {
    favoris,
    loading,
    error,
    refetch: fetchFavoris,
    addFavori,
    removeFavori,
  }
}

