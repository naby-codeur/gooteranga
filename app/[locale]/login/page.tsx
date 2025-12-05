'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { getDashboardPath, type UserRole } from '@/lib/utils/auth'
import { useAuth } from '@/lib/hooks/useAuth'

export default function LoginPage() {
  const router = useRouter()
  const params = useParams()
  const locale = params?.locale as string || 'fr'
  const { user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'USER' | 'PRESTATAIRE'>('USER')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    // En mode développement, rediriger directement vers le dashboard
    try {
      const dashboardPath = getDashboardPath(role)
      router.push(`/${locale}${dashboardPath}`)
      router.refresh()
    } catch (err) {
      setError('Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Connexion</CardTitle>
          <CardDescription className="text-center">
            Mode développement - Accès direct sans authentification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {user && (
            <div className="p-3 text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-md">
              <p className="font-medium mb-2">✅ Mode développement actif</p>
              <p className="text-xs mb-2">
                Vous êtes connecté en tant que {user.email}
              </p>
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={() => {
                  const dashboardPath = `/${locale}${getDashboardPath(user.role as UserRole)}`
                  router.push(dashboardPath)
                  router.refresh()
                }}
                className="text-xs"
              >
                Aller au dashboard
              </Button>
            </div>
          )}
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email (non utilisé en mode dev)</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Type de compte</Label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as 'USER' | 'PRESTATAIRE')}
                disabled={isLoading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="USER">Touriste</option>
                <option value="PRESTATAIRE">Prestataire</option>
                <option value="ADMIN">Administrateur</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe (non utilisé en mode dev)</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button className="w-full" size="lg" type="submit" disabled={isLoading}>
              {isLoading ? 'Redirection...' : 'Accéder au dashboard'}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground">
            Pas encore de compte?{' '}
            <Link href="/signup" className="text-primary hover:underline">
              S&apos;inscrire
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
