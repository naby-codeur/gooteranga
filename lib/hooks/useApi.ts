'use client'

/**
 * Fonction utilitaire pour faire des appels API avec gestion d'erreur robuste
 */
export async function apiFetch<T = unknown>(
  url: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string; status?: number }> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    // Vérifier le statut HTTP
    const status = response.status

    // Vérifier le Content-Type
    const contentType = response.headers.get('content-type')
    const isJson = contentType && contentType.includes('application/json')

    // Si ce n'est pas du JSON, retourner une erreur
    if (!isJson) {
      const text = await response.text()
      console.error('Non-JSON response:', text.substring(0, 200))
      return {
        success: false,
        error: `La réponse n'est pas du JSON (status: ${status})`,
        status,
      }
    }

    // Parser le JSON
    const data = await response.json()

    // Si la réponse a un champ success, l'utiliser
    if (typeof data === 'object' && data !== null) {
      if ('success' in data) {
        return {
          success: data.success,
          data: data.success ? data.data : undefined,
          error: data.success ? undefined : (data.error || data.message),
          status,
        }
      }
    }

    // Sinon, retourner les données telles quelles
    return {
      success: status >= 200 && status < 300,
      data: data as T,
      status,
    }
  } catch (error) {
    console.error('API fetch error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }
  }
}


