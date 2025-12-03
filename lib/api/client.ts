/**
 * Client API pour faciliter les appels aux routes API
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

/**
 * Effectue une requête API avec gestion automatique des erreurs
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Inclure les cookies pour l'authentification
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `Erreur ${response.status}`,
      }
    }

    return data
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur réseau',
    }
  }
}

/**
 * API Client pour les offres
 */
export const offresApi = {
  /**
   * Récupère la liste des offres
   */
  getAll: (params?: {
    type?: string
    region?: string
    ville?: string
    minPrix?: number
    maxPrix?: number
    isActive?: boolean
    isFeatured?: boolean
    page?: number
    limit?: number
  }) => {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value))
        }
      })
    }
    const query = searchParams.toString()
    return apiRequest(`/api/offres${query ? `?${query}` : ''}`)
  },

  /**
   * Récupère une offre par son ID
   */
  getById: (id: string) => apiRequest(`/api/offres/${id}`),

  /**
   * Crée une nouvelle offre
   */
  create: (data: {
    titre: string
    description: string
    type: string
    region?: string
    ville?: string
    adresse?: string
    latitude?: number
    longitude?: number
    prix: number
    prixUnite?: string
    images?: string[]
    videos?: string[]
    duree?: number
    capacite?: number
    disponibilite?: Record<string, unknown>
  }) =>
    apiRequest('/api/offres', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * Met à jour une offre
   */
  update: (id: string, data: Partial<{
    titre: string
    description: string
    type: string
    region: string
    ville: string
    adresse: string
    latitude: number
    longitude: number
    prix: number
    prixUnite: string
    images: string[]
    videos: string[]
    duree: number
    capacite: number
    disponibilite: Record<string, unknown>
    isActive: boolean
  }>) =>
    apiRequest(`/api/offres/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /**
   * Supprime une offre
   */
  delete: (id: string) =>
    apiRequest(`/api/offres/${id}`, {
      method: 'DELETE',
    }),
}

/**
 * API Client pour les réservations
 */
export const reservationsApi = {
  /**
   * Récupère la liste des réservations
   */
  getAll: (params?: {
    statut?: string
    page?: number
    limit?: number
  }) => {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value))
        }
      })
    }
    const query = searchParams.toString()
    return apiRequest(`/api/reservations${query ? `?${query}` : ''}`)
  },

  /**
   * Récupère une réservation par son ID
   */
  getById: (id: string) => apiRequest(`/api/reservations/${id}`),

  /**
   * Crée une nouvelle réservation
   */
  create: (data: {
    offreId: string
    dateDebut: string
    dateFin?: string
    nombrePersonnes: number
    notes?: string
  }) =>
    apiRequest('/api/reservations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * Met à jour le statut d'une réservation
   */
  updateStatus: (id: string, statut: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED') =>
    apiRequest(`/api/reservations/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ statut }),
    }),

  /**
   * Annule une réservation
   */
  cancel: (id: string) =>
    apiRequest(`/api/reservations/${id}`, {
      method: 'DELETE',
    }),
}

/**
 * API Client pour les paiements
 */
export const paiementsApi = {
  /**
   * Crée un PaymentIntent Stripe
   */
  createStripeIntent: (reservationId: string) =>
    apiRequest('/api/paiements/stripe/create-intent', {
      method: 'POST',
      body: JSON.stringify({ reservationId }),
    }),
}

/**
 * API Client pour les favoris
 */
export const favorisApi = {
  /**
   * Récupère la liste des favoris
   */
  getAll: (params?: { page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value))
        }
      })
    }
    const query = searchParams.toString()
    return apiRequest(`/api/favoris${query ? `?${query}` : ''}`)
  },

  /**
   * Ajoute une offre aux favoris
   */
  add: (offreId: string) =>
    apiRequest('/api/favoris', {
      method: 'POST',
      body: JSON.stringify({ offreId }),
    }),

  /**
   * Retire une offre des favoris
   */
  remove: (offreId: string) =>
    apiRequest(`/api/favoris/${offreId}`, {
      method: 'DELETE',
    }),
}

/**
 * API Client pour les avis
 */
export const avisApi = {
  /**
   * Crée un nouvel avis
   */
  create: (data: {
    offreId: string
    reservationId?: string
    rating: number
    commentaire?: string
  }) =>
    apiRequest('/api/avis', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}

