'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { getDashboardPath, getSupabaseEmail, type UserRole } from '@/lib/utils/auth'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/useAuth'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading: authLoading, signOut } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'USER' | 'PRESTATAIRE'>('USER')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const supabase = createClient()

      // Générer l'email virtuel pour Supabase basé sur le rôle
      const supabaseEmail = getSupabaseEmail(email, role)

      // Connexion directement côté client avec Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: supabaseEmail,
        password,
      })

      if (authError || !authData.user) {
        throw new Error(authError?.message || 'Email ou mot de passe incorrect')
      }

      // Vérifier si l'email est vérifié (optionnel selon votre configuration)
      if (!authData.user.email_confirmed_at && process.env.NODE_ENV === 'production') {
        throw new Error('Veuillez vérifier votre email avant de vous connecter')
      }

      // Récupérer le rôle depuis Prisma via l'API
      const sessionResponse = await fetch('/api/auth/session')
      const sessionData = await sessionResponse.json()

      if (!sessionData.success || !sessionData.data?.user) {
        // Si l'utilisateur n'existe pas dans Prisma, le créer
        // (peut arriver si l'inscription n'a pas été complétée)
        throw new Error('Erreur lors de la récupération de votre profil. Veuillez réessayer.')
      }

      // Déterminer la redirection selon le rôle
      const userRole = sessionData.data.user.role || 'USER'
      const requestedNext = searchParams.get('next')
      
      // Si une page spécifique est demandée, l'utiliser
      // Sinon, rediriger vers le dashboard approprié selon le rôle
      const next = requestedNext || getDashboardPath(userRole as UserRole)
      
      router.push(next)
      router.refresh() // Rafraîchir pour mettre à jour la session
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthLogin = async (provider: 'google' | 'facebook') => {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const redirectTo = `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(searchParams.get('next') || '/dashboard')}`
      
      // Rediriger vers Supabase OAuth
      window.location.href = `${supabaseUrl}/auth/v1/authorize?provider=${provider}&redirect_to=${encodeURIComponent(redirectTo)}`
    } catch {
      setError('Erreur lors de la connexion avec ' + provider)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Connexion</CardTitle>
          <CardDescription className="text-center">
            Connectez-vous à votre compte GooTeranga
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!authLoading && user && (
            <div className="p-3 text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-md">
              {/* Détecter et nettoyer automatiquement les sessions mock invalides */}
              {user.email && (user.email.includes('mock@example.com') || user.email.includes('mock-id')) ? (
                <>
                  <p className="font-medium mb-2">Session invalide détectée</p>
                  <p className="text-xs mb-2">Nettoyage automatique de la session...</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      await signOut()
                      router.refresh()
                    }}
                    className="text-xs"
                  >
                    Nettoyer la session
                  </Button>
                </>
              ) : (
                <>
                  <p className="font-medium mb-2">Vous êtes déjà connecté en tant que {user.email}</p>
                  <p className="text-xs mb-2">Pour vous connecter avec un autre compte, veuillez d&apos;abord vous déconnecter.</p>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        await signOut()
                      }}
                      className="text-xs"
                    >
                      Se déconnecter
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        router.push(getDashboardPath(user.role as UserRole))
                      }}
                      className="text-xs"
                    >
                      Aller au dashboard
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Type de compte</Label>
              <Select value={role} onValueChange={(value) => setRole(value as 'USER' | 'PRESTATAIRE')} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez le type de compte" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">Touriste</SelectItem>
                  <SelectItem value="PRESTATAIRE">Prestataire</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Vous pouvez utiliser la même email pour un compte touriste et prestataire, mais avec des mots de passe différents.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mot de passe</Label>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Mot de passe oublié?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button className="w-full" size="lg" type="submit" disabled={isLoading}>
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Ou continuer avec</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => handleOAuthLogin('google')}
              disabled={isLoading}
            >
              Google
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={() => handleOAuthLogin('facebook')}
              disabled={isLoading}
            >
              Facebook
            </Button>
          </div>
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

