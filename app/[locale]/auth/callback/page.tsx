'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getDashboardPath } from '@/lib/utils/auth'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mode développement: récupérer la session et rediriger vers le bon dashboard
    const fetchSessionAndRedirect = async () => {
      try {
        // Récupérer la session pour connaître le rôle
        const response = await fetch('/api/auth/session')
        const data = await response.json()

        if (data.success && data.data?.user) {
          const userRole = data.data.user.role
          const requestedNext = searchParams.get('next')
          
          // Utiliser la page demandée ou rediriger vers le dashboard approprié
          const redirectPath = requestedNext || getDashboardPath(userRole)
          
          router.push(redirectPath)
          router.refresh()
        } else {
          // Si pas de session, rediriger vers login
          router.push('/login')
        }
      } catch (error) {
        console.error('Error in callback:', error)
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    // Petit délai pour s'assurer que la session est bien établie
    setTimeout(fetchSessionAndRedirect, 500)
  }, [router, searchParams])

  return (
    <div className="container flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Connexion en cours...</h1>
        <p className="text-muted-foreground">
          {isLoading ? 'Veuillez patienter' : 'Redirection...'}
        </p>
      </div>
    </div>
  )
}

