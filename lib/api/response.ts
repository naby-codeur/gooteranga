import { NextResponse } from 'next/server'

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

/**
 * Crée une réponse API réussie
 * NextResponse.json() sérialise automatiquement les Dates et autres types
 */
export function successResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): NextResponse<ApiResponse<T>> {
  try {
    return NextResponse.json(
      {
        success: true,
        data,
        message,
      },
      { status }
    )
  } catch (error) {
    console.error('Error creating response:', error)
    // En cas d'erreur, essayer de sérialiser manuellement
    try {
      const serialized = JSON.parse(JSON.stringify(data))
      return NextResponse.json(
        {
          success: true,
          data: serialized,
          message,
        },
        { status }
      )
    } catch (serializeError) {
      console.error('Error serializing data:', serializeError)
      return NextResponse.json(
        {
          success: false,
          error: 'Erreur lors de la sérialisation des données',
        },
        { status: 500 }
      )
    }
  }
}

/**
 * Crée une réponse API d'erreur
 */
export function errorResponse(
  error: string | Error,
  status: number = 400
): NextResponse<ApiResponse> {
  const errorMessage = error instanceof Error ? error.message : error
  return NextResponse.json(
    {
      success: false,
      error: errorMessage,
    },
    { status }
  )
}

/**
 * Gère les erreurs d'une route API
 */
export function handleApiError(error: unknown): NextResponse<ApiResponse> {
  console.error('API Error:', error)

  if (error instanceof Error) {
    if (error.message === 'Unauthorized') {
      return errorResponse('Non authentifié', 401)
    }
    if (error.message === 'Forbidden') {
      return errorResponse('Accès refusé', 403)
    }
    if (error.message.includes('Unique constraint')) {
      return errorResponse('Cette ressource existe déjà', 409)
    }
    if (error.message.includes('Record to delete does not exist')) {
      return errorResponse('Ressource non trouvée', 404)
    }
    return errorResponse(error.message, 400)
  }

  return errorResponse('Une erreur est survenue', 500)
}

