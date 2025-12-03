/**
 * Utilitaires pour la gestion des plans d'abonnement
 */

export type PlanType = 'GRATUIT' | 'PRO' | 'PREMIUM'

export interface PlanLimits {
  maxExperiences: number
  hasStatistics: boolean
  hasAdvancedStatistics: boolean
  hasBoost: boolean
  freeBoostsPerMonth: number
  hasPrioritySupport: boolean
  hasCertifiedBadge: boolean
  hasCustomUrl: boolean
}

/**
 * Limites et fonctionnalités par plan
 */
export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  GRATUIT: {
    maxExperiences: 5,
    hasStatistics: false,
    hasAdvancedStatistics: false,
    hasBoost: false,
    freeBoostsPerMonth: 0,
    hasPrioritySupport: false,
    hasCertifiedBadge: false,
    hasCustomUrl: false,
  },
  PRO: {
    maxExperiences: Infinity, // Illimité
    hasStatistics: true,
    hasAdvancedStatistics: false,
    hasBoost: true,
    freeBoostsPerMonth: 1,
    hasPrioritySupport: true,
    hasCertifiedBadge: false,
    hasCustomUrl: false,
  },
  PREMIUM: {
    maxExperiences: Infinity, // Illimité
    hasStatistics: true,
    hasAdvancedStatistics: true,
    hasBoost: true,
    freeBoostsPerMonth: 3,
    hasPrioritySupport: true,
    hasCertifiedBadge: true,
    hasCustomUrl: true,
  },
}

/**
 * Tarifs des plans (en FCFA)
 */
export const PLAN_PRICES: Record<PlanType, number> = {
  GRATUIT: 0,
  PRO: 4000,
  PREMIUM: 11000,
}

/**
 * Tarifs des boosts (en FCFA)
 */
export const BOOST_PRICES = {
  EXPERIENCE: {
    jour: 1000,
    semaine: 6000,
    mois: 15000,
  },
  REGIONAL: {
    semaine: 5000,
    mois: 15000,
  },
  CATEGORIE: {
    semaine: 3000,
    mois: 10000,
  },
  MENSUEL: {
    mois: 15000,
  },
}

/**
 * Vérifie si un prestataire peut créer une nouvelle expérience
 */
export function canCreateExperience(
  planType: PlanType,
  currentExperiencesCount: number
): boolean {
  const limits = PLAN_LIMITS[planType]
  return currentExperiencesCount < limits.maxExperiences
}

/**
 * Vérifie si un plan est actif (non expiré)
 */
export function isPlanActive(planExpiresAt: Date | null | undefined): boolean {
  if (!planExpiresAt) return false
  return new Date() < new Date(planExpiresAt)
}

/**
 * Obtient le nombre de boosts gratuits restants ce mois
 */
export function getFreeBoostsRemaining(
  planType: PlanType,
  boostsUsedThisMonth: number
): number {
  const limits = PLAN_LIMITS[planType]
  return Math.max(0, limits.freeBoostsPerMonth - boostsUsedThisMonth)
}

/**
 * Calcule le score de visibilité d'une offre (pour le tri)
 * Plus le score est élevé, plus l'offre apparaît en premier
 */
export function calculateVisibilityScore(
  planType: PlanType,
  hasActiveBoost: boolean,
  boostType?: string,
  rating: number = 0,
  nombreAvis: number = 0
): number {
  let score = 0

  // Score selon le plan (Premium > Pro > Gratuit)
  const planScores: Record<PlanType, number> = {
    PREMIUM: 1000,
    PRO: 500,
    GRATUIT: 0,
  }
  score += planScores[planType]

  // Bonus pour les boosts
  if (hasActiveBoost) {
    const boostScores: Record<string, number> = {
      MENSUEL: 500,
      REGIONAL: 300,
      CATEGORIE: 200,
      EXPERIENCE: 100,
    }
    score += boostScores[boostType || 'EXPERIENCE'] || 100
  }

  // Bonus pour la qualité (rating et nombre d'avis)
  score += rating * 10
  score += Math.min(nombreAvis * 2, 100) // Max 100 points pour les avis

  return score
}

