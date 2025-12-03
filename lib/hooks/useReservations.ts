'use client'

import { useState, useEffect } from 'react'
import { apiFetch } from './useApi'

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

export function useReservations(statut?: string): UseReservationsReturn {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReservations = async () => {
    try {
      setLoading(true)
      setError(null)
      const params = new URLSearchParams()
      if (statut) {
        params.append('statut', statut)
      }
      
      const result = await apiFetch<{ reservations: Reservation[]; pagination?: unknown }>(
        `/api/reservations?${params.toString()}`
      )

      if (result.success && result.data) {
        setReservations(result.data.reservations || [])
      } else {
        setError(result.error || 'Erreur lors du chargement des réservations')
      }
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

