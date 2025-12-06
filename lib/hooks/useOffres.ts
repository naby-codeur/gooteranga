'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { apiFetch } from './useApi'

export interface Offre {
  id: string
  titre: string
  description: string
  type: string
  region: string
  ville: string
  adresse: string | null
  prix: number
  prixUnite: string | null
  images: string[]
  videos: string[]
  duree: number | null
  capacite: number | null
  rating: number
  isActive: boolean
  isFeatured: boolean
  tags?: string[] // Tags pour classifier l'offre
  prestataire: {
    id: string
    nomEntreprise: string
    logo: string | null
    isVerified: boolean
    rating: number
  }
  vuesVideo?: number
  nombreLikes?: number
  _count: {
    avis: number
    reservations: number
    likes?: number
    favoris?: number
  }
  createdAt: string
}

interface OffresFilters {
  type?: string
  region?: string
  ville?: string
  minPrix?: string
  maxPrix?: string
  isActive?: boolean
  isFeatured?: boolean
  page?: number
  limit?: number
  search?: string
}

interface UseOffresReturn {
  offres: Offre[]
  loading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  refetch: () => Promise<void>
  updateOffre: (id: string, data: Partial<Offre>) => Promise<boolean>
  deleteOffre: (id: string) => Promise<boolean>
}

export function useOffres(filters: OffresFilters = {}): UseOffresReturn {
  const [offres, setOffres] = useState<Offre[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  })

  // Memoize filters to prevent infinite loops when filters object is recreated
  // We use individual filter values instead of the filters object to avoid infinite loops
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedFilters = useMemo(() => filters, [
    filters.type,
    filters.region,
    filters.ville,
    filters.minPrix,
    filters.maxPrix,
    filters.isActive,
    filters.isFeatured,
    filters.page,
    filters.limit,
    filters.search,
  ])

  const fetchOffres = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const params = new URLSearchParams()
      
      if (memoizedFilters.type) params.append('type', memoizedFilters.type)
      if (memoizedFilters.region) params.append('region', memoizedFilters.region)
      if (memoizedFilters.ville) params.append('ville', memoizedFilters.ville)
      if (memoizedFilters.minPrix) params.append('minPrix', memoizedFilters.minPrix)
      if (memoizedFilters.maxPrix) params.append('maxPrix', memoizedFilters.maxPrix)
      if (memoizedFilters.isActive !== undefined) params.append('isActive', String(memoizedFilters.isActive))
      if (memoizedFilters.isFeatured) params.append('isFeatured', 'true')
      if (memoizedFilters.page) params.append('page', String(memoizedFilters.page))
      if (memoizedFilters.limit) params.append('limit', String(memoizedFilters.limit))

      const result = await apiFetch<{ offres: Offre[]; pagination: typeof pagination }>(
        `/api/offres?${params.toString()}`
      )

      if (result.success && result.data) {
        // Si recherche textuelle, filtrer côté client
        let filteredOffres = result.data.offres || []
        if (memoizedFilters.search) {
          const searchLower = memoizedFilters.search.toLowerCase()
          filteredOffres = filteredOffres.filter((offre: Offre) =>
            offre.titre.toLowerCase().includes(searchLower) ||
            offre.description.toLowerCase().includes(searchLower) ||
            offre.region.toLowerCase().includes(searchLower) ||
            offre.ville.toLowerCase().includes(searchLower)
          )
        }
        setOffres(filteredOffres)
        if (result.data.pagination) {
          setPagination(result.data.pagination)
        }
      } else {
        setError(result.error || 'Erreur lors du chargement des offres')
      }
    } catch (err) {
      setError('Erreur lors du chargement des offres')
      console.error('Error fetching offres:', err)
    } finally {
      setLoading(false)
    }
  }, [memoizedFilters])

  useEffect(() => {
    fetchOffres()
  }, [fetchOffres])

  // Fonction pour mettre à jour une offre
  const updateOffre = useCallback(async (id: string, data: Partial<Offre>): Promise<boolean> => {
    try {
      // Si c'est une offre fictive, mettre à jour localement
      if (id.startsWith('mock-')) {
        setOffres(prev => prev.map(o => 
          o.id === id ? { ...o, ...data } : o
        ))
        return true
      }

      // Sinon, utiliser l'API
      const response = await fetch(`/api/offres/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()
      
      if (response.ok && result.success) {
        await fetchOffres()
        return true
      }
      return false
    } catch (error) {
      console.error('Error updating offre:', error)
      return false
    }
  }, [fetchOffres])

  // Fonction pour supprimer une offre
  const deleteOffre = useCallback(async (id: string): Promise<boolean> => {
    try {
      // Si c'est une offre fictive, supprimer localement
      if (id.startsWith('mock-')) {
        setOffres(prev => prev.filter(o => o.id !== id))
        return true
      }

      // Sinon, utiliser l'API
      const response = await fetch(`/api/offres/${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()
      
      if (response.ok && result.success) {
        await fetchOffres()
        return true
      }
      return false
    } catch (error) {
      console.error('Error deleting offre:', error)
      return false
    }
  }, [fetchOffres])

  return {
    offres,
    loading,
    error,
    pagination,
    refetch: fetchOffres,
    updateOffre,
    deleteOffre,
  }
}

