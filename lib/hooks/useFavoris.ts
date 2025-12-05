'use client'

import { useState, useEffect } from 'react'

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

// Données fictives pour le développement
const mockFavoris: Favori[] = [
  {
    id: 'fav-1',
    offre: {
      id: 'offre-1',
      titre: 'Visite de l\'Île de Gorée',
      description: 'Découvrez l\'histoire de l\'île de Gorée, site historique classé au patrimoine mondial de l\'UNESCO',
      prix: 5000,
      images: ['/images/ba1.png'],
      type: 'ACTIVITE',
      region: 'Dakar',
      ville: 'Dakar',
      rating: 4.8,
      prestataire: {
        id: 'prest-1',
        nomEntreprise: 'Guide Sénégal Authentique',
        logo: null,
        isVerified: true,
        rating: 4.9,
      },
      _count: {
        avis: 127,
        reservations: 234,
      },
    },
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'fav-2',
    offre: {
      id: 'offre-2',
      titre: 'Hôtel Teranga - Chambre double',
      description: 'Chambre confortable avec vue sur la mer, petit-déjeuner inclus',
      prix: 15000,
      images: ['/images/ba2.png'],
      type: 'HEBERGEMENT',
      region: 'Dakar',
      ville: 'Dakar',
      rating: 4.5,
      prestataire: {
        id: 'prest-2',
        nomEntreprise: 'Hôtel Teranga',
        logo: null,
        isVerified: true,
        rating: 4.6,
      },
      _count: {
        avis: 89,
        reservations: 156,
      },
    },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'fav-3',
    offre: {
      id: 'offre-3',
      titre: 'Restaurant La Teranga',
      description: 'Cuisine sénégalaise traditionnelle dans un cadre chaleureux',
      prix: 8000,
      images: ['/images/ba3.png'],
      type: 'RESTAURANT',
      region: 'Dakar',
      ville: 'Dakar',
      rating: 4.7,
      prestataire: {
        id: 'prest-3',
        nomEntreprise: 'Restaurant La Teranga',
        logo: null,
        isVerified: true,
        rating: 4.8,
      },
      _count: {
        avis: 203,
        reservations: 445,
      },
    },
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export function useFavoris(): UseFavorisReturn {
  const [favoris, setFavoris] = useState<Favori[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFavoris = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Simuler un délai de chargement
      await new Promise(resolve => setTimeout(resolve, 300))
      
      setFavoris([...mockFavoris])
    } catch (err) {
      setError('Erreur lors du chargement des favoris')
      console.error('Error fetching favoris:', err)
    } finally {
      setLoading(false)
    }
  }

  const addFavori = async (offreId: string): Promise<boolean> => {
    // En mode développement, simuler l'ajout
    await new Promise(resolve => setTimeout(resolve, 200))
    return true
  }

  const removeFavori = async (offreId: string): Promise<boolean> => {
    try {
      // Simuler la suppression
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // Retirer le favori de la liste
      setFavoris(prev => prev.filter(f => f.offre.id !== offreId))
      return true
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

