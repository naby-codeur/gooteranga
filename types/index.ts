import { UserRole, OffreType, ReservationStatus, PaymentStatus, PrestataireType } from '@prisma/client'

export type { UserRole, OffreType, ReservationStatus, PaymentStatus, PrestataireType }

// Types pour les nouvelles fonctionnalités
export type ActiviteCategorie = 'CULTURE' | 'NATURE' | 'AVENTURE' | 'RELIGIEUX' | 'GASTRONOMIE' | 'PLAGE' | 'SPORT' | 'FESTIVAL' | 'SHOPPING' | 'BIEN_ETRE'

export type TypePublic = 'FAMILLE' | 'SOLO' | 'COUPLE' | 'GROUPE' | 'AFFAIRES' | 'SENIORS' | 'JEUNES'

export interface Region {
  id: string
  nom: string
  code: string
}

export interface FilterOptions {
  region?: string
  type?: OffreType
  activite?: ActiviteCategorie
  budgetMin?: number
  budgetMax?: number
  dureeMin?: number
  dureeMax?: number
  capacite?: number
  rating?: number
  typePublic?: TypePublic
  disponibilite?: {
    dateDebut: Date
    dateFin?: Date
  }
}

export interface SearchParams {
  q?: string
  region?: string
  type?: string
  budget?: string
  sort?: 'price' | 'rating' | 'popularity' | 'newest'
}


