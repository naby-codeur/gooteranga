/**
 * Utilitaires pour les retries avec timeout
 */

export interface RetryOptions {
  maxRetries?: number
  initialDelay?: number
  maxDelay?: number
  timeout?: number
  onRetry?: (attempt: number, error: Error) => void
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelay: 1000, // 1 seconde
  maxDelay: 10000, // 10 secondes
  timeout: 10000, // 10 secondes
  onRetry: () => {},
}

/**
 * Vérifie si une erreur est une erreur réseau récupérable
 */
export function isRetryableError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false
  }

  const errorMessage = error.message.toLowerCase()
  const errorName = error.name.toLowerCase()
  const errorString = String(error).toLowerCase()

  // Erreurs de socket/connection
  const socketErrors = [
    'und_err_socket',
    'socket',
    'econnrefused',
    'econnreset',
    'etimedout',
    'enotfound',
    'eai_again',
    'other side closed',
    'fetch failed',
    'network',
    'timeout',
  ]

  // Erreurs HTTP récupérables
  const httpRetryable = [
    '500',
    '502',
    '503',
    '504',
    '429', // Too many requests
  ]

  return (
    socketErrors.some((err) => 
      errorMessage.includes(err) || 
      errorName.includes(err) || 
      errorString.includes(err)
    ) ||
    httpRetryable.some((code) => 
      errorMessage.includes(code) || 
      errorString.includes(code)
    )
  )
}

/**
 * Crée une promesse avec timeout
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(
        () => reject(new Error(`Timeout après ${timeoutMs}ms`)),
        timeoutMs
      )
    ),
  ])
}

/**
 * Retry avec backoff exponentiel
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  let lastError: Error | null = null

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      // Appliquer le timeout
      return await withTimeout(fn(), opts.timeout)
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      // Si ce n'est pas une erreur récupérable, arrêter
      if (!isRetryableError(lastError)) {
        throw lastError
      }

      // Si c'est la dernière tentative, arrêter
      if (attempt === opts.maxRetries) {
        throw lastError
      }

      // Calculer le délai avec backoff exponentiel
      const delay = Math.min(
        opts.initialDelay * Math.pow(2, attempt),
        opts.maxDelay
      )

      // Appeler le callback de retry
      opts.onRetry(attempt + 1, lastError)

      // Attendre avant de réessayer
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  // Ne devrait jamais arriver, mais TypeScript le demande
  throw lastError || new Error('Erreur inconnue')
}


