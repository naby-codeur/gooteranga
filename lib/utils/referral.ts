/**
 * Utilitaires pour le système de parrainage
 */

/**
 * Génère un code parrain unique (format: GT-XXXX1234)
 */
export function generateReferralCode(): string {
  const prefix = 'GT-'
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  
  // Générer 4 caractères aléatoires
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  // Ajouter 4 chiffres
  for (let i = 0; i < 4; i++) {
    code += Math.floor(Math.random() * 10).toString()
  }
  
  return prefix + code
}

/**
 * Points gagnés par événement
 */
export const REFERRAL_POINTS = {
  INSCRIPTION_VALIDEE: 100,
  PREMIERE_OFFRE_PUBLIEE: 50,
  RESERVATION_EFFECTUEE: 150,
  ABONNEMENT_PREMIUM: 500,
} as const

/**
 * Conversion points -> boosts
 */
export const POINTS_PER_BOOST = 100

/**
 * Vérifie si un code parrain est valide (format)
 */
export function isValidReferralCode(code: string): boolean {
  return /^GT-[A-Z0-9]{8}$/.test(code)
}


