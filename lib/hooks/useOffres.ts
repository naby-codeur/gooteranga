'use client'

import { useState, useEffect, useCallback } from 'react'
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

  const fetchOffres = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const params = new URLSearchParams()
      
      if (filters.type) params.append('type', filters.type)
      if (filters.region) params.append('region', filters.region)
      if (filters.ville) params.append('ville', filters.ville)
      if (filters.minPrix) params.append('minPrix', filters.minPrix)
      if (filters.maxPrix) params.append('maxPrix', filters.maxPrix)
      if (filters.isActive !== undefined) params.append('isActive', String(filters.isActive))
      if (filters.isFeatured) params.append('isFeatured', 'true')
      if (filters.page) params.append('page', String(filters.page))
      if (filters.limit) params.append('limit', String(filters.limit))

      const result = await apiFetch<{ offres: Offre[]; pagination: typeof pagination }>(
        `/api/offres?${params.toString()}`
      )

      if (result.success && result.data) {
        // Si recherche textuelle, filtrer côté client
        let filteredOffres = result.data.offres || []
        if (filters.search) {
          const searchLower = filters.search.toLowerCase()
          filteredOffres = filteredOffres.filter((offre: Offre) =>
            offre.titre.toLowerCase().includes(searchLower) ||
            offre.description.toLowerCase().includes(searchLower) ||
            offre.region.toLowerCase().includes(searchLower) ||
            offre.ville.toLowerCase().includes(searchLower)
          )
        }
        setOffres(filteredOffres)
        setPagination(result.data.pagination || pagination)
      } else {
        setError(result.error || 'Erreur lors du chargement des offres')
      }
    } catch (err) {
      setError('Erreur lors du chargement des offres')
      console.error('Error fetching offres:', err)
    } finally {
      setLoading(false)
    }
  }, [filters, pagination])

  useEffect(() => {
    fetchOffres()
  }, [fetchOffres])

  return {
    offres,
    loading,
    error,
    pagination,
    refetch: fetchOffres,
  }
}

