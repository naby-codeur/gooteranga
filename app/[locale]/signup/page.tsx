'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'
import { Briefcase, Globe } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'
import { getDashboardPath, type UserRole } from '@/lib/utils/auth'

type AccountType = 'USER' | 'PRESTATAIRE'

// Type temporaire jusqu'à ce que Prisma soit régénéré
type PrestataireType = 'HOTEL' | 'GUIDE' | 'AGENCE' | 'RESTAURANT' | 'ARTISAN' | 'ASSOCIATION' | 'AUBERGE' | 'TRANSPORT' | 'AUTRE'

export default function SignupPage() {
  const router = useRouter()
  const { user, loading: authLoading, signOut } = useAuth()
  const [accountType, setAccountType] = useState<AccountType>('USER')
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    password: '',
    confirmPassword: '',
    // Champs pour utilisateur
    nationalite: '',
    paysResidence: '',
    // Champs pour prestataire
    nomEntreprise: '',
    typePrestataire: '' as PrestataireType | '',
    adresse: '',
    ville: '',
    region: '',
    description: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    // Validation
    if (!formData.email || !formData.password || !formData.nom) {
      setError('Veuillez remplir tous les champs requis')
      return
    }

    if (formData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    if (accountType === 'PRESTATAIRE') {
      if (!formData.nomEntreprise || !formData.typePrestataire) {
        setError('Veuillez remplir tous les champs requis pour les prestataires')
        return
      }
    }

    // Normaliser l'email (minuscules, trim)
    const normalizedEmail = formData.email.toLowerCase().trim()
    
    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(normalizedEmail)) {
      setError('Format d\'email invalide')
      return
    }

    setIsLoading(true)

    try {
      // Mode développement: pas de nettoyage de session nécessaire

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: normalizedEmail,
          password: formData.password,
          nom: formData.nom,
          prenom: formData.prenom || null,
          telephone: formData.telephone || null,
          role: accountType,
          // Champs pour prestataire
          ...(accountType === 'PRESTATAIRE' && {
            nomEntreprise: formData.nomEntreprise,
            typePrestataire: formData.typePrestataire,
            adresse: formData.adresse || null,
            ville: formData.ville || null,
            region: formData.region || null,
            description: formData.description || null,
          }),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création du compte')
      }

      setSuccess(true)

      // Si le compte nécessite une vérification email
      if (data.data?.requiresEmailVerification) {
        // Afficher un message et rediriger après un délai
        setTimeout(() => {
          router.push('/login?message=verify_email')
        }, 3000)
      } else {
        // Rediriger directement vers le dashboard approprié selon le rôle
        const userRole = data.data?.user?.role || accountType
        const dashboardPath = getDashboardPath(userRole as UserRole)
        setTimeout(() => {
          router.push(dashboardPath)
          router.refresh()
        }, 1000)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const regions = [
    'Dakar', 'Thiès', 'Saint-Louis', 'Ziguinchor', 'Diourbel',
    'Tambacounda', 'Kaolack', 'Louga', 'Fatick', 'Kolda',
    'Matam', 'Kaffrine', 'Kédougou', 'Sédhiou'
  ]

  const nationalites = [
    'Sénégal', 'France', 'Belgique', 'Suisse', 'Canada', 'États-Unis',
    'Maroc', 'Algérie', 'Tunisie', 'Côte d\'Ivoire', 'Mali', 'Burkina Faso',
    'Niger', 'Tchad', 'Mauritanie', 'Guinée', 'Gambie', 'Guinée-Bissau',
    'Cameroun', 'Gabon', 'Congo', 'RDC', 'Madagascar', 'Maurice',
    'Espagne', 'Italie', 'Allemagne', 'Pays-Bas', 'Royaume-Uni',
    'Nigeria', 'Cap-Vert', 'Brésil', 'Colombie', 'Turquie',
    'Émirats arabes unis', 'Inde', 'Chine', 'Japon',
    'Autre'
  ]

  const paysResidence = [
    'Sénégal', 'France', 'Belgique', 'Suisse', 'Canada', 'États-Unis',
    'Maroc', 'Algérie', 'Tunisie', 'Côte d\'Ivoire', 'Mali', 'Burkina Faso',
    'Niger', 'Tchad', 'Mauritanie', 'Guinée', 'Gambie', 'Guinée-Bissau',
    'Cameroun', 'Gabon', 'Congo', 'RDC', 'Madagascar', 'Maurice',
    'Espagne', 'Italie', 'Allemagne', 'Pays-Bas', 'Royaume-Uni',
    'Nigeria', 'Cap-Vert', 'Brésil', 'Colombie', 'Turquie',
    'Émirats arabes unis', 'Inde', 'Chine', 'Japon',
    'Autre'
  ]

  const prestataireTypes: { value: PrestataireType; label: string }[] = [
    { value: 'HOTEL', label: 'Hôtel' },
    { value: 'GUIDE', label: 'Guide touristique' },
    { value: 'AGENCE', label: 'Agence de voyage' },
    { value: 'RESTAURANT', label: 'Restaurant' },
    { value: 'ARTISAN', label: 'Artisan' },
    { value: 'ASSOCIATION', label: 'Association' },
    { value: 'AUBERGE', label: 'Auberge' },
    { value: 'TRANSPORT', label: 'Transport' },
    { value: 'AUTRE', label: 'Autre' },
  ]

  return (
    <div className="relative min-h-screen flex items-center justify-center py-12">
      {/* Image de fond */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/images/ba1.png)' }}></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
      
      <div className="container relative z-10 flex items-center justify-center">
        <Card className="w-full max-w-2xl bg-white/95 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">Créer un compte</CardTitle>
          <CardDescription className="text-lg">
            Rejoignez GooTeranga et commencez votre aventure
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!authLoading && user && (
            <div className="p-3 text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-md mb-4">
              <p className="font-medium mb-2">Vous êtes déjà connecté en tant que {user.email}</p>
              <p className="text-xs mb-2">Pour créer un nouveau compte, veuillez d&apos;abord vous déconnecter.</p>
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
            </div>
          )}
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md mb-4">
              Compte créé avec succès! {formData.email.includes('@') && 'Veuillez vérifier votre email pour confirmer votre compte.'}
            </div>
          )}
          {step === 1 ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-center">
                  Choisissez votre type de compte
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setAccountType('USER')}
                    className={`p-6 rounded-lg border-2 transition-all ${
                      accountType === 'USER'
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-950'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className={`p-3 rounded-full ${
                        accountType === 'USER' ? 'bg-orange-500 text-white' : 'bg-gray-100'
                      }`}>
                        <Globe className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg mb-1">Voyageur / Touriste</h4>
                        <p className="text-sm text-muted-foreground">
                          Explorez, réservez et vivez des expériences uniques au Sénégal
                        </p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAccountType('PRESTATAIRE')}
                    className={`p-6 rounded-lg border-2 transition-all ${
                      accountType === 'PRESTATAIRE'
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-950'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className={`p-3 rounded-full ${
                        accountType === 'PRESTATAIRE' ? 'bg-orange-500 text-white' : 'bg-gray-100'
                      }`}>
                        <Briefcase className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg mb-1">Prestataire</h4>
                        <p className="text-sm text-muted-foreground">
                          Hôtel, Guide, Agence, Restaurant... Proposez vos services
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              <Button
                type="button"
                onClick={() => setStep(2)}
                className="w-full"
                size="lg"
              >
                Continuer
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prenom">Prénom *</Label>
                  <Input
                    id="prenom"
                    placeholder="Jean"
                    value={formData.prenom}
                    onChange={(e) => handleChange('prenom', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom *</Label>
                  <Input
                    id="nom"
                    placeholder="Dupont"
                    value={formData.nom}
                    onChange={(e) => handleChange('nom', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone</Label>
                <Input
                  id="telephone"
                  type="tel"
                  placeholder="+221 77 123 45 67"
                  value={formData.telephone}
                  onChange={(e) => handleChange('telephone', e.target.value)}
                />
              </div>

              {accountType === 'USER' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nationalite">Nationalité *</Label>
                    <Select
                      value={formData.nationalite}
                      onValueChange={(value) => handleChange('nationalite', value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une nationalité" />
                      </SelectTrigger>
                      <SelectContent>
                        {nationalites.map((nationalite) => (
                          <SelectItem key={nationalite} value={nationalite}>
                            {nationalite}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paysResidence">Pays de résidence *</Label>
                    <Select
                      value={formData.paysResidence}
                      onValueChange={(value) => handleChange('paysResidence', value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un pays de résidence" />
                      </SelectTrigger>
                      <SelectContent>
                        {paysResidence.map((pays) => (
                          <SelectItem key={pays} value={pays}>
                            {pays}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {accountType === 'PRESTATAIRE' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="nomEntreprise">Nom de l&apos;entreprise *</Label>
                    <Input
                      id="nomEntreprise"
                      placeholder="Mon Hôtel / Mon Agence"
                      value={formData.nomEntreprise}
                      onChange={(e) => handleChange('nomEntreprise', e.target.value)}
                      required={accountType === 'PRESTATAIRE'}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="typePrestataire">Type de prestataire *</Label>
                    <Select
                      value={formData.typePrestataire}
                      onValueChange={(value) => handleChange('typePrestataire', value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un type" />
                      </SelectTrigger>
                      <SelectContent>
                        {prestataireTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="region">Région</Label>
                      <Select
                        value={formData.region}
                        onValueChange={(value) => handleChange('region', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Région" />
                        </SelectTrigger>
                        <SelectContent>
                          {regions.map((region) => (
                            <SelectItem key={region} value={region}>
                              {region}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ville">Ville</Label>
                      <Input
                        id="ville"
                        placeholder="Ville"
                        value={formData.ville}
                        onChange={(e) => handleChange('ville', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adresse">Adresse</Label>
                    <Input
                      id="adresse"
                      placeholder="Adresse complète"
                      value={formData.adresse}
                      onChange={(e) => handleChange('adresse', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <textarea
                      id="description"
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Décrivez votre activité..."
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Retour
                </Button>
                <Button type="submit" className="flex-1" size="lg" disabled={isLoading}>
                  {isLoading ? 'Création...' : 'Créer mon compte'}
                </Button>
              </div>
            </form>
          )}

          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Ou continuer avec</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <Button
              variant="outline"
              type="button"
              disabled={true}
            >
              Google (non disponible en mode dev)
            </Button>
            <Button
              variant="outline"
              type="button"
              disabled={true}
            >
              Facebook (non disponible en mode dev)
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Déjà un compte?{' '}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Se connecter
            </Link>
          </p>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
