/**
 * Utilitaires pour la validation des mots de passe
 * Inclut la vérification HIBP (Have I Been Pwned)
 */

import { pwnedPassword } from 'hibp'

/**
 * Vérifie si un mot de passe a été compromis via HIBP
 * @param password - Le mot de passe à vérifier
 * @returns Le nombre de fois que le mot de passe a été trouvé dans des fuites de données
 * @throws Error si le mot de passe est compromis
 */
export async function validatePasswordHIBP(password: string): Promise<number> {
  try {
    const count = await pwnedPassword(password)
    return count
  } catch (error) {
    // En cas d'erreur réseau ou autre, on ne bloque pas l'inscription
    // mais on log l'erreur pour debugging
    console.error('Erreur lors de la vérification HIBP:', error)
    return 0
  }
}

/**
 * Valide un mot de passe et vérifie s'il est compromis
 * @param password - Le mot de passe à valider
 * @returns Un objet avec le résultat de la validation
 */
export async function validatePassword(password: string): Promise<{
  isValid: boolean
  isCompromised: boolean
  breachCount: number
  message?: string
}> {
  // Validation de base
  if (!password || password.length < 8) {
    return {
      isValid: false,
      isCompromised: false,
      breachCount: 0,
      message: 'Le mot de passe doit contenir au moins 8 caractères',
    }
  }

  // Vérification HIBP
  const breachCount = await validatePasswordHIBP(password)

  if (breachCount > 0) {
    return {
      isValid: false,
      isCompromised: true,
      breachCount,
      message: `⚠️ Ce mot de passe a été trouvé dans ${breachCount} fuite(s) de données. Veuillez choisir un mot de passe plus sécurisé.`,
    }
  }

  return {
    isValid: true,
    isCompromised: false,
    breachCount: 0,
  }
}

/**
 * Vérifie si un message d'erreur indique un mot de passe compromis
 * @param errorMessage - Le message d'erreur
 * @returns true si le message indique un mot de passe compromis
 */
export function isHIBPError(errorMessage: string | undefined | null): boolean {
  if (!errorMessage) return false
  
  const hibpIndicators = [
    'Password was found in a data breach',
    'password was found in a data breach',
    'data breach',
    'compromised password',
    'hibp',
  ]

  return hibpIndicators.some(indicator => 
    errorMessage.toLowerCase().includes(indicator.toLowerCase())
  )
}

/**
 * Extrait un message d'erreur utilisateur-friendly depuis une erreur HIBP
 * @param errorMessage - Le message d'erreur
 * @returns Un message d'erreur formaté pour l'utilisateur
 */
export function getHIBPErrorMessage(errorMessage: string | undefined | null): string {
  if (!errorMessage) {
    return '⚠️ Ce mot de passe est compromis. Choisissez-en un autre.'
  }

  if (isHIBPError(errorMessage)) {
    return '⚠️ Ce mot de passe a été trouvé dans des fuites de données et ne peut pas être utilisé. Veuillez choisir un mot de passe plus sécurisé.'
  }

  return errorMessage
}


