'use client'

import { useState, useEffect } from 'react'

export interface Reservation {
  id: string
  offre: {
    id: string
    titre: string
    images: string[]
    type: string
    region: string
    ville: string
  }
  user?: {
    id: string
    nom: string
    prenom?: string | null
    email: string
    telephone?: string | null
  }
  prestataire: {
    id: string
    nomEntreprise: string
    logo: string | null
  }
  dateDebut: string
  dateFin: string | null
  nombrePersonnes: number
  montant: number
  statut: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
  notes: string | null
  createdAt: string
  paiement?: {
    id: string
    statut: string
    methode: string
  }
}

interface UseReservationsReturn {
  reservations: Reservation[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

// Données fictives pour le développement
const mockReservations: Reservation[] = [
  {
    id: '1',
    offre: {
      id: 'offre-1',
      titre: 'Visite de l\'Île de Gorée',
      images: ['/images/ba1.png'],
      type: 'ACTIVITE',
      region: 'Dakar',
      ville: 'Dakar',
    },
    prestataire: {
      id: 'prest-1',
      nomEntreprise: 'Guide Sénégal Authentique',
      logo: null,
    },
    dateDebut: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    dateFin: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    nombrePersonnes: 2,
    montant: 10000,
    statut: 'CONFIRMED',
    notes: null,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    paiement: {
      id: 'paiement-1',
      statut: 'PAID',
      methode: 'Orange Money',
    },
  },
  {
    id: '2',
    offre: {
      id: 'offre-2',
      titre: 'Hôtel Teranga - Chambre double',
      images: ['/images/ba2.png'],
      type: 'HEBERGEMENT',
      region: 'Dakar',
      ville: 'Dakar',
    },
    prestataire: {
      id: 'prest-2',
      nomEntreprise: 'Hôtel Teranga',
      logo: null,
    },
    dateDebut: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    dateFin: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000).toISOString(),
    nombrePersonnes: 2,
    montant: 45000,
    statut: 'PENDING',
    notes: null,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    offre: {
      id: 'offre-3',
      titre: 'Safari dans le Parc Niokolo-Koba',
      images: ['/images/ba3.png'],
      type: 'ACTIVITE',
      region: 'Tambacounda',
      ville: 'Tambacounda',
    },
    prestataire: {
      id: 'prest-3',
      nomEntreprise: 'Nature Sénégal',
      logo: null,
    },
    dateDebut: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    dateFin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    nombrePersonnes: 4,
    montant: 100000,
    statut: 'COMPLETED',
    notes: null,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    paiement: {
      id: 'paiement-3',
      statut: 'PAID',
      methode: 'Wave',
    },
  },
]

export function useReservations(statut?: string): UseReservationsReturn {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReservations = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Simuler un délai de chargement
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Filtrer par statut si fourni
      let filteredReservations = mockReservations
      if (statut) {
        filteredReservations = mockReservations.filter(r => r.statut === statut)
      }
      
      setReservations(filteredReservations)
    } catch (err) {
      setError('Erreur lors du chargement des réservations')
      console.error('Error fetching reservations:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReservations()
  }, [statut])

  return {
    reservations,
    loading,
    error,
    refetch: fetchReservations,
  }
}

