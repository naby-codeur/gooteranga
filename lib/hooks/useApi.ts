'use client'

/**
 * Normalise une URL pour s'assurer qu'elle est absolue et non affectée par la locale
 */
function normalizeApiUrl(url: string): string {
  // Si l'URL commence déjà par http:// ou https://, la retourner telle quelle
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  
  // S'assurer que l'URL commence par /
  if (!url.startsWith('/')) {
    url = '/' + url
  }
  
  // Pour TOUTES les routes API, utiliser une URL absolue pour éviter les problèmes avec i18n
  // Cela garantit que l'URL n'est pas résolue par rapport à la locale courante dans le navigateur
  if (url.startsWith('/api/')) {
    if (typeof window !== 'undefined') {
      // Utiliser l'origine complète pour garantir que l'URL n'est pas affectée par la locale
      return window.location.origin + url
    }
    // En SSR, retourner l'URL telle quelle (le serveur ne devrait pas avoir ce problème)
    return url
  }
  
  return url
}

/**
 * Fonction utilitaire pour faire des appels API avec gestion d'erreur robuste
 */
export async function apiFetch<T = unknown>(
  url: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string; status?: number }> {
  try {
    // Normaliser l'URL pour éviter les problèmes avec les locales i18n
    const normalizedUrl = normalizeApiUrl(url)
    
    // Log pour déboguer
    if (process.env.NODE_ENV === 'development') {
      console.log('[apiFetch] Making request to:', normalizedUrl)
    }
    
    const response = await fetch(normalizedUrl, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Inclure les cookies pour l'authentification
    })

    // Vérifier le statut HTTP
    const status = response.status

    // Vérifier le Content-Type
    const contentType = response.headers.get('content-type')
    const isJson = contentType && contentType.includes('application/json')

    // Si ce n'est pas du JSON, retourner une erreur avec plus de détails
    if (!isJson) {
      const text = await response.text()
      console.error('[apiFetch] Non-JSON response detected:', {
        originalUrl: url,
        normalizedUrl: normalizedUrl,
        status,
        statusText: response.statusText,
        contentType,
        responsePreview: text.substring(0, 500),
        fullUrl: response.url,
      })
      
      // Si c'est une erreur 404, suggérer que la route n'existe pas
      if (status === 404) {
        return {
          success: false,
          error: `Route API non trouvée (404). Vérifiez que la route ${normalizedUrl} existe.`,
          status,
        }
      }
      
      return {
        success: false,
        error: `La réponse n'est pas du JSON (status: ${status}). URL: ${normalizedUrl}`,
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


