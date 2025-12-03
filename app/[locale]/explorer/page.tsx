'use client'

import { useState, useEffect, useMemo } from 'react'
import { Link } from '@/i18n/routing'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Star, MapPin, Filter, Search, Calendar, Users, Clock, Compass, Sparkles, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useOffres } from '@/lib/hooks/useOffres'

const activites = [
  { value: 'CULTURE', label: 'Culture' },
  { value: 'NATURE', label: 'Nature' },
  { value: 'AVENTURE', label: 'Aventure' },
  { value: 'RELIGIEUX', label: 'Religieux' },
  { value: 'GASTRONOMIE', label: 'Gastronomie' },
  { value: 'PLAGE', label: 'Plage' },
  { value: 'SPORT', label: 'Sport' },
  { value: 'FESTIVAL', label: 'Festival' },
  { value: 'SHOPPING', label: 'Shopping' },
  { value: 'BIEN_ETRE', label: 'Bien-être' },
]

const typesPublic = [
  { value: 'FAMILLE', label: 'Famille' },
  { value: 'SOLO', label: 'Solo' },
  { value: 'COUPLE', label: 'Couple' },
  { value: 'GROUPE', label: 'Groupe' },
  { value: 'AFFAIRES', label: 'Affaires' },
  { value: 'SENIORS', label: 'Seniors' },
  { value: 'JEUNES', label: 'Jeunes' },
]

const regions = [
  'Dakar', 'Thiès', 'Saint-Louis', 'Ziguinchor', 'Diourbel',
  'Tambacounda', 'Kaolack', 'Louga', 'Fatick', 'Kolda',
  'Matam', 'Kaffrine', 'Kédougou', 'Sédhiou'
]

export default function ExplorerPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentBgIndex, setCurrentBgIndex] = useState(0)
  const [filters, setFilters] = useState({
    region: '',
    type: '',
    activite: '',
    budgetMin: '',
    budgetMax: '',
    dureeMin: '',
    dureeMax: '',
    typePublic: '',
    disponibilite: '',
  })
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [sortBy, setSortBy] = useState('popularity')

  const backgroundImages = Array.from({ length: 10 }, (_, i) => `/images/ba${i + 1}.png`)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [backgroundImages.length])

  // Utiliser le hook useOffres pour récupérer les offres depuis l'API
  const { offres, loading, error, refetch } = useOffres({
    region: filters.region || undefined,
    type: filters.type || undefined,
    minPrix: filters.budgetMin || undefined,
    maxPrix: filters.budgetMax || undefined,
    isActive: true,
    search: searchQuery || undefined,
  })

  // Transformer les offres en expériences pour l'affichage
  const experiences = useMemo(() => {
    let sorted = [...offres]
    
    // Trier selon le critère sélectionné
    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) => Number(a.prix) - Number(b.prix))
        break
      case 'price-high':
        sorted.sort((a, b) => Number(b.prix) - Number(a.prix))
        break
      case 'rating':
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case 'newest':
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      default: // popularity (par défaut, déjà trié par score de visibilité)
        break
    }

    return sorted.map(offre => ({
      id: offre.id,
      titre: offre.titre,
      description: offre.description,
      prix: Number(offre.prix),
      lieu: `${offre.ville}, ${offre.region}`,
      duree: offre.duree ? `${offre.duree}h` : 'N/A',
      capacite: offre.capacite ? `${offre.capacite} personnes` : 'N/A',
      rating: offre.rating || 0,
      image: offre.images && offre.images.length > 0 ? offre.images[0] : '/images/ba1.png',
      prestataire: offre.prestataire.nomEntreprise,
      activite: offre.type,
      typePublic: 'Tous',
    }))
  }, [offres, sortBy])

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section avec carrousel */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          {backgroundImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
                index === currentBgIndex ? 'opacity-100 z-0' : 'opacity-0 z-0'
              }`}
              style={{ backgroundImage: `url(${image})` }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-br from-teranga-orange/30 via-cap-blue/20 to-nature-green/30 z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent z-10"></div>
        </div>

        <div className="container relative z-20 mx-[10%] py-24">
          <Button asChild variant="ghost" className="mb-6 text-white hover:text-white/80">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à l&apos;accueil
            </Link>
          </Button>
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-teranga-orange/20 backdrop-blur rounded-full">
                <Compass className="h-8 w-8 text-white" />
              </div>
              <Badge className="bg-white/20 backdrop-blur text-white border-white/30">
                <Sparkles className="h-3 w-3 mr-1" />
                Explorer
              </Badge>
            </div>
            <h1 className="text-5xl font-bold text-white sm:text-6xl md:text-7xl mb-6">
              Explorez le Sénégal
              <br />
              <span className="text-teranga-orange">autrement</span>
            </h1>
            <p className="text-xl text-white/90 sm:text-2xl max-w-2xl mb-8">
              Découvrez des expériences uniques, authentiques et mémorables avec nos guides locaux certifiés
            </p>

            {/* Barre de recherche améliorée */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-teranga-orange z-10" />
                <Input
                  placeholder="Rechercher une destination, une activité, un guide..."
                  className="pl-12 pr-4 py-6 text-lg bg-white/95 backdrop-blur border-2 border-teranga-orange/30 focus:border-teranga-orange shadow-xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button 
                size="lg" 
                className="sm:w-auto bg-teranga-orange hover:bg-[#FFD700] text-white text-lg px-8 py-6 h-auto shadow-xl font-semibold"
                onClick={() => refetch()}
              >
                <Search className="mr-2 h-5 w-5" />
                Rechercher
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Section Filtres */}
      <section className="bg-gradient-to-br from-[#FFF8E1] via-[#FFF9C4] to-[#FFE0B2] py-8 border-b-2 border-teranga-orange/20">
        <div className="mx-[10%]">
          <div className="space-y-4">

            {/* Filtres de base */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-teranga-orange" />
                <span className="text-sm font-semibold text-gray-800">Filtres rapides:</span>
              </div>
          <Select value={filters.region || 'all'} onValueChange={(value) => setFilters({ ...filters, region: value === 'all' ? '' : value })}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Région" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les régions</SelectItem>
              {regions.map((region) => (
                <SelectItem key={region} value={region.toLowerCase()}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.type || 'all'} onValueChange={(value) => setFilters({ ...filters, type: value === 'all' ? '' : value })}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="hebergement">Hébergement</SelectItem>
              <SelectItem value="guide">Guide</SelectItem>
              <SelectItem value="activite">Activité</SelectItem>
              <SelectItem value="restaurant">Restaurant</SelectItem>
              <SelectItem value="culture">Culture</SelectItem>
              <SelectItem value="evenement">Événement</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.activite || 'all'} onValueChange={(value) => setFilters({ ...filters, activite: value === 'all' ? '' : value })}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Activité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les activités</SelectItem>
              {activites.map((activite) => (
                <SelectItem key={activite.value} value={activite.value}>
                  {activite.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.budgetMin || 'none'} onValueChange={(value) => setFilters({ ...filters, budgetMin: value === 'none' ? '' : value })}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Budget min" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Aucun minimum</SelectItem>
              <SelectItem value="0">0 FCFA</SelectItem>
              <SelectItem value="5000">5 000 FCFA</SelectItem>
              <SelectItem value="10000">10 000 FCFA</SelectItem>
              <SelectItem value="25000">25 000 FCFA</SelectItem>
              <SelectItem value="50000">50 000 FCFA</SelectItem>
              <SelectItem value="100000">100 000 FCFA</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.budgetMax || 'none'} onValueChange={(value) => setFilters({ ...filters, budgetMax: value === 'none' ? '' : value })}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Budget max" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Aucun maximum</SelectItem>
              <SelectItem value="10000">10 000 FCFA</SelectItem>
              <SelectItem value="25000">25 000 FCFA</SelectItem>
              <SelectItem value="50000">50 000 FCFA</SelectItem>
              <SelectItem value="100000">100 000 FCFA</SelectItem>
              <SelectItem value="250000">250 000 FCFA</SelectItem>
              <SelectItem value="500000">500 000 FCFA</SelectItem>
            </SelectContent>
          </Select>

              <Button
                variant="outline"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="border-teranga-orange text-teranga-orange hover:bg-teranga-orange hover:text-white"
              >
                <Filter className="mr-2 h-4 w-4" />
                {showAdvancedFilters ? 'Masquer' : 'Plus'} de filtres
              </Button>
            </div>

            {/* Filtres avancés */}
            {showAdvancedFilters && (
              <Card className="p-6 bg-white/95 backdrop-blur shadow-xl border-2 border-teranga-orange/20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Durée minimale (heures)
                </label>
                <Input
                  type="number"
                  placeholder="Ex: 2"
                  value={filters.dureeMin}
                  onChange={(e) => setFilters({ ...filters, dureeMin: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Durée maximale (heures)
                </label>
                <Input
                  type="number"
                  placeholder="Ex: 8"
                  value={filters.dureeMax}
                  onChange={(e) => setFilters({ ...filters, dureeMax: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Type de public
                </label>
                <Select value={filters.typePublic || 'all'} onValueChange={(value) => setFilters({ ...filters, typePublic: value === 'all' ? '' : value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    {typesPublic.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Disponibilité
                </label>
                <Input
                  type="date"
                  value={filters.disponibilite}
                  onChange={(e) => setFilters({ ...filters, disponibilite: e.target.value })}
                />
              </div>
            </div>

                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setFilters({
                      region: '', type: '', activite: '', budgetMin: '', budgetMax: '',
                      dureeMin: '', dureeMax: '', typePublic: '', disponibilite: ''
                    })}
                    className="border-teranga-orange text-teranga-orange hover:bg-teranga-orange hover:text-white"
                  >
                    Réinitialiser
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Section Résultats */}
      <section className="mx-[10%] py-16 md:py-24">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-2">
              Nos expériences
            </h2>
            <p className="text-lg text-muted-foreground">
              {experiences.length} expériences uniques vous attendent
            </p>
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[200px] border-teranga-orange/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">Plus populaires</SelectItem>
              <SelectItem value="price-low">Prix croissant</SelectItem>
              <SelectItem value="price-high">Prix décroissant</SelectItem>
              <SelectItem value="rating">Meilleures notes</SelectItem>
              <SelectItem value="newest">Plus récents</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-12 w-12 animate-spin text-teranga-orange" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <Compass className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">
              Erreur lors du chargement des offres. Veuillez réessayer.
            </p>
            <Button onClick={() => refetch()} className="mt-4">
              Réessayer
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {experiences.map((exp) => (
                <Card key={exp.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-2 hover:border-teranga-orange">
                  <div className="relative h-64 bg-teranga-orange">
                    <Image
                      src={exp.image}
                      alt={exp.titre}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    <Badge className="absolute top-4 right-4 bg-white text-teranga-orange border-teranga-orange">
                      {exp.prix.toLocaleString()} FCFA
                    </Badge>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-xl font-bold text-white mb-1">{exp.titre}</h3>
                      <div className="flex items-center gap-2 text-white/90 text-sm">
                        <MapPin className="h-4 w-4" />
                        {exp.lieu}
                      </div>
                    </div>
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{exp.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Par {exp.prestataire}</span>
                    </div>
                    <CardDescription className="text-base">{exp.description}</CardDescription>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge variant="secondary" className="text-xs bg-teranga-orange/10 text-teranga-orange border-teranga-orange/20">
                        {exp.activite}
                      </Badge>
                      <Badge variant="secondary" className="text-xs bg-cap-blue/10 text-cap-blue border-cap-blue/20">
                        {exp.typePublic}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {exp.duree}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {exp.capacite}
                      </div>
                    </div>
                    <Button asChild className="w-full bg-teranga-orange hover:bg-[#FFD700] text-white font-semibold">
                      <Link href={`/experience/${exp.id}`}>
                        Voir les détails
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {experiences.length === 0 && (
              <div className="text-center py-12">
                <Compass className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg text-muted-foreground">
                  Aucune expérience trouvée. Essayez de modifier vos filtres.
                </p>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}
