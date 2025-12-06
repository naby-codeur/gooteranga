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

// Données fictives pour le développement
const mockDepenses: Depense[] = [
  {
    id: 'dep-1',
    titre: 'Restaurant local à Dakar',
    description: 'Déjeuner dans un restaurant traditionnel',
    categorie: 'RESTAURATION',
    montant: 8500,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    lieu: 'Dakar, Plateau',
    methode: 'Espèces',
    isHorsPlateforme: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'dep-2',
    titre: 'Taxi vers l\'aéroport',
    description: 'Transport depuis l\'hôtel',
    categorie: 'TRANSPORT',
    montant: 5000,
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    lieu: 'Dakar',
    methode: 'Orange Money',
    isHorsPlateforme: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'dep-3',
    titre: 'Souvenirs artisanaux',
    description: 'Achat de masques et sculptures',
    categorie: 'SHOPPING',
    montant: 15000,
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    lieu: 'Thiès, Marché artisanal',
    methode: 'Espèces',
    isHorsPlateforme: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'dep-4',
    titre: 'Excursion en pirogue',
    description: 'Tour en pirogue autour de l\'île',
    categorie: 'ACTIVITE',
    montant: 12000,
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    lieu: 'Saint-Louis',
    methode: 'Wave',
    isHorsPlateforme: true,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export function useDepenses() {
  const [depenses, setDepenses] = useState<Depense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDepenses = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Simuler un délai de chargement
      await new Promise(resolve => setTimeout(resolve, 300))
      
      setDepenses([...mockDepenses])
    } catch (err) {
      setError('Erreur lors du chargement des dépenses')
      console.error('Error fetching expenses:', err)
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
      // Simuler un délai
      await new Promise(resolve => setTimeout(resolve, 200))
      
      const newDepense: Depense = {
        id: `dep-${Date.now()}`,
        titre: depenseData.titre,
        description: depenseData.description || null,
        categorie: depenseData.categorie,
        montant: depenseData.montant,
        date: depenseData.date || new Date().toISOString().split('T')[0],
        lieu: depenseData.lieu || null,
        methode: depenseData.methode || null,
        isHorsPlateforme: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      
      setDepenses(prev => [newDepense, ...prev])
      return { depense: newDepense }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue'
      setError(errorMessage)
      throw err
    }
  }

  const deleteDepense = async (id: string) => {
    try {
      // Simuler un délai
      await new Promise(resolve => setTimeout(resolve, 200))
      
      setDepenses(prev => prev.filter(d => d.id !== id))
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
      // Simuler un délai
      await new Promise(resolve => setTimeout(resolve, 200))
      
      setDepenses(prev => prev.map(d => 
        d.id === id 
          ? {
              ...d,
              ...depenseData,
              updatedAt: new Date().toISOString(),
            }
          : d
      ))
      
      const updated = depenses.find(d => d.id === id)
      return { depense: updated }
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

