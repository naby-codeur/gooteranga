import { useState, useEffect } from 'react'

export interface Depense {
  id: string
  titre: string
  description?: string | null
  categorie: string
  montant: number
  date: string
  lieu?: string | null
  methode?: string | null
  isHorsPlateforme: boolean
  createdAt: string
  updatedAt: string
}

export function useDepenses() {
  const [depenses, setDepenses] = useState<Depense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDepenses = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/depenses')
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || data.message || 'Erreur lors de la récupération des dépenses')
      }

      setDepenses(data.data?.depenses || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      console.error('Error fetching expenses:', err)
      // En cas d'erreur, initialiser avec un tableau vide pour éviter les erreurs dans l'UI
      setDepenses([])
    } finally {
      setLoading(false)
    }
  }

  const addDepense = async (depenseData: {
    titre: string
    description?: string
    categorie: string
    montant: number
    date?: string
    lieu?: string
    methode?: string
  }) => {
    try {
      const response = await fetch('/api/depenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(depenseData),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || data.message || 'Erreur lors de l\'ajout de la dépense')
      }

      // Recharger les dépenses
      await fetchDepenses()
      return data.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue'
      setError(errorMessage)
      throw err
    }
  }

  const deleteDepense = async (id: string) => {
    try {
      const response = await fetch(`/api/depenses/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || data.message || 'Erreur lors de la suppression de la dépense')
      }

      // Recharger les dépenses
      await fetchDepenses()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue'
      setError(errorMessage)
      throw err
    }
  }

  const updateDepense = async (
    id: string,
    depenseData: {
      titre?: string
      description?: string
      categorie?: string
      montant?: number
      date?: string
      lieu?: string
      methode?: string
    }
  ) => {
    try {
      const response = await fetch(`/api/depenses/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(depenseData),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || data.message || 'Erreur lors de la mise à jour de la dépense')
      }

      // Recharger les dépenses
      await fetchDepenses()
      return data.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue'
      setError(errorMessage)
      throw err
    }
  }

  useEffect(() => {
    fetchDepenses()
  }, [])

  return {
    depenses,
    loading,
    error,
    addDepense,
    deleteDepense,
    updateDepense,
    refetch: fetchDepenses,
  }
}

