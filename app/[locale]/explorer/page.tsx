'use client'

import { useState, useEffect, useMemo } from 'react'
import { Link } from '@/i18n/routing'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Filter, Search, Calendar, Users, Clock, Compass, Sparkles, ArrowLeft, Loader2 } from 'lucide-react'
import { useOffres } from '@/lib/hooks/useOffres'
import { ThemeFilters, matchesThemes } from '@/components/filters/ThemeFilters'
import { OfferCard } from '@/components/offers/OfferCard'
import { Pagination } from '@/components/ui/pagination'

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
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
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
  const [selectedThemes, setSelectedThemes] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  // Images de fond avec les bonnes extensions
  const backgroundImages = [
    '/images/ba1.jpg',
    '/images/ba2.jpg',
    '/images/ba3.webp',
    '/images/ba4.jpg',
    '/images/ba5.jpg',
    '/images/ba6.jpg',
    '/images/ba7.jpeg',
    '/images/ba8.jpg',
    '/images/ba9.jpg',
    '/images/ba10.jpg',
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [backgroundImages.length])

  // Debounce pour la recherche
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 500) // Attendre 500ms après la dernière frappe

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Utiliser le hook useOffres pour récupérer les offres depuis l'API
  const { offres, loading, error, refetch, pagination } = useOffres({
    region: filters.region || undefined,
    type: filters.type || undefined,
    minPrix: filters.budgetMin || undefined,
    maxPrix: filters.budgetMax || undefined,
    isActive: true,
    search: debouncedSearchQuery || undefined,
    page: currentPage,
    limit: itemsPerPage,
  })

  // Réinitialiser à la page 1 quand les filtres changent
  const filtersKey = `${filters.region}-${filters.type}-${filters.activite}-${filters.budgetMin}-${filters.budgetMax}-${debouncedSearchQuery}-${selectedThemes.join(',')}`
  
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey])

  // Transformer les offres en expériences pour l'affichage avec filtrage par thèmes
  const { experiences, totalFiltered } = useMemo(() => {
    // Filtrer par thèmes si des thèmes sont sélectionnés
    let filtered = [...offres]
    
    if (selectedThemes.length > 0) {
      filtered = filtered.filter(offre => {
        // Récupérer les tags de l'offre
        const offreTags = offre.tags || []
        return matchesThemes(offreTags, selectedThemes)
      })
    }
    
    const totalFiltered = filtered.length
    
    const sorted = [...filtered]
    
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

    // Pagination côté client si filtrage par thèmes
    const startIndex = selectedThemes.length > 0 ? (currentPage - 1) * itemsPerPage : 0
    const endIndex = selectedThemes.length > 0 ? startIndex + itemsPerPage : sorted.length
    const paginated = sorted.slice(startIndex, endIndex)

    return {
      experiences: paginated.map(offre => ({
      id: offre.id,
      titre: offre.titre,
      description: offre.description,
      prix: Number(offre.prix),
      prixUnite: offre.prixUnite,
      lieu: `${offre.ville || ''}, ${offre.region || ''}`.replace(/^,\s*|,\s*$/g, ''),
      region: offre.region,
      ville: offre.ville,
      duree: offre.duree ? `${offre.duree}h` : 'N/A',
      capacite: offre.capacite ? `${offre.capacite} personnes` : 'N/A',
      rating: offre.rating || 0,
      nombreAvis: offre._count?.avis || 0,
      nombreLikes: offre._count?.likes || offre.nombreLikes || 0,
      vuesVideo: offre.vuesVideo || 0,
      image: offre.images && offre.images.length > 0 ? offre.images[0] : '/images/ba1.png',
      videos: offre.videos || [],
      prestataire: {
        nomEntreprise: offre.prestataire.nomEntreprise,
        logo: offre.prestataire.logo,
      },
      activite: offre.type,
      typePublic: 'Tous',
      tags: offre.tags || [],
    })),
      totalFiltered
    }
  }, [offres, sortBy, selectedThemes, currentPage, itemsPerPage])

  // Calculer la pagination réelle
  const actualPagination = useMemo(() => {
    if (selectedThemes.length > 0) {
      // Pagination côté client
      return {
        page: currentPage,
        limit: itemsPerPage,
        total: totalFiltered,
        totalPages: Math.ceil(totalFiltered / itemsPerPage)
      }
    } else {
      // Pagination côté serveur
      return pagination
    }
  }, [selectedThemes.length, currentPage, itemsPerPage, totalFiltered, pagination])

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section avec carrousel */}
      <section className="relative min-h-[50vh] sm:min-h-[60vh] flex items-center justify-center overflow-hidden">
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

        <div className="container relative z-20 mx-4 sm:mx-6 md:mx-[10%] py-12 sm:py-16 md:py-24">
          <Button asChild variant="ghost" className="mb-4 sm:mb-6 text-white hover:text-white/80 text-sm sm:text-base">
            <Link href="/">
              <ArrowLeft className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Retour à l&apos;accueil</span>
              <span className="sm:hidden">Retour</span>
            </Link>
          </Button>
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="p-2 sm:p-3 bg-teranga-orange/20 backdrop-blur rounded-full">
                <Compass className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <Badge className="bg-white/20 backdrop-blur text-white border-white/30 text-xs sm:text-sm">
                <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                Explorer
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              Explorez le Sénégal
              <br />
              <span className="text-teranga-orange">autrement</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-2xl mb-6 sm:mb-8">
              Découvrez des expériences uniques, authentiques et mémorables avec nos guides locaux certifiés
            </p>

            {/* Barre de recherche améliorée */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1 relative group">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-teranga-orange z-10 transition-colors group-focus-within:text-[#FFD700]" />
                <Input
                  placeholder="Rechercher une destination, activité, guide..."
                  className="pl-10 sm:pl-12 pr-10 sm:pr-4 py-4 sm:py-6 text-sm sm:text-base md:text-lg bg-white/95 backdrop-blur border-2 border-teranga-orange/30 focus:border-teranga-orange shadow-xl transition-all duration-200 focus:shadow-2xl focus:scale-[1.01]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setDebouncedSearchQuery(searchQuery)
                      refetch()
                    }
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('')
                      setDebouncedSearchQuery('')
                    }}
                    className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-teranga-orange transition-colors"
                    aria-label="Effacer la recherche"
                  >
                    <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-teranga-orange hover:bg-[#FFD700] text-white text-sm sm:text-base md:text-lg px-6 sm:px-8 py-4 sm:py-6 h-auto shadow-xl font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
                onClick={() => {
                  setDebouncedSearchQuery(searchQuery)
                  refetch()
                }}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                ) : (
                  <Search className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                )}
                Rechercher
              </Button>
            </div>
            {debouncedSearchQuery && (
              <p className="text-xs sm:text-sm text-white/80 mt-2 flex items-center gap-2">
                <Search className="h-3 w-3 sm:h-4 sm:w-4" />
                Recherche: &quot;{debouncedSearchQuery}&quot;
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Section Filtres */}
      <section className="bg-gradient-to-br from-[#FFF8E1] via-[#FFF9C4] to-[#FFE0B2] py-6 sm:py-8 border-b-2 border-teranga-orange/20">
        <div className="mx-4 sm:mx-6 md:mx-[10%]">
          <div className="space-y-4">

            {/* Filtres de base */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 items-start sm:items-center">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-teranga-orange flex-shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-gray-800">Filtres rapides:</span>
              </div>
          <Select value={filters.region || 'all'} onValueChange={(value) => setFilters({ ...filters, region: value === 'all' ? '' : value })}>
            <SelectTrigger className="w-full sm:w-[180px] text-sm">
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
            <SelectTrigger className="w-full sm:w-[180px] text-sm">
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
              <SelectItem value="transport">Transport</SelectItem>
              <SelectItem value="autres">Autres</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.activite || 'all'} onValueChange={(value) => setFilters({ ...filters, activite: value === 'all' ? '' : value })}>
            <SelectTrigger className="w-full sm:w-[180px] text-sm">
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
            <SelectTrigger className="w-full sm:w-[180px] text-sm">
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
            <SelectTrigger className="w-full sm:w-[180px] text-sm">
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
                className="w-full sm:w-auto border-teranga-orange text-teranga-orange hover:bg-teranga-orange hover:text-white text-sm"
              >
                <Filter className="mr-2 h-4 w-4" />
                {showAdvancedFilters ? 'Masquer' : 'Plus'} de filtres
              </Button>
            </div>

            {/* Filtres par thèmes */}
            <Card className="p-4 sm:p-6 bg-white/95 backdrop-blur shadow-xl border-2 border-teranga-orange/20">
              <ThemeFilters
                selectedThemes={selectedThemes}
                onThemesChange={setSelectedThemes}
              />
            </Card>

            {/* Filtres avancés */}
            {showAdvancedFilters && (
              <Card className="p-4 sm:p-6 bg-white/95 backdrop-blur shadow-xl border-2 border-teranga-orange/20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
      <section className="mx-4 sm:mx-6 md:mx-[10%] py-12 sm:py-16 md:py-24">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mb-8 sm:mb-12">
          <div className="flex-1">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-2">
              Nos expériences
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
              {actualPagination.total > 0 
                ? `${actualPagination.total} expérience${actualPagination.total > 1 ? 's' : ''} trouvée${actualPagination.total > 1 ? 's' : ''}`
                : 'Aucune expérience trouvée'
              }
              {actualPagination.totalPages > 1 && (
                <span className="ml-2 text-xs sm:text-sm">
                  (Page {currentPage} sur {actualPagination.totalPages})
                </span>
              )}
            </p>
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[200px] border-teranga-orange/30 text-sm">
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
                <OfferCard
                  key={exp.id}
                  id={exp.id}
                  titre={exp.titre}
                  description={exp.description}
                  prix={exp.prix}
                  prixUnite={exp.prixUnite}
                  image={exp.image}
                  videos={exp.videos}
                  rating={exp.rating}
                  nombreAvis={exp.nombreAvis}
                  nombreLikes={exp.nombreLikes}
                  vuesVideo={exp.vuesVideo}
                  prestataire={exp.prestataire}
                  lieu={exp.lieu}
                  region={exp.region}
                  ville={exp.ville}
                  onToggleFavorite={(offreId) => {
                    // TODO: Implémenter l'API pour ajouter/retirer des favoris
                    console.log('Toggle favorite:', offreId)
                  }}
                  onToggleLike={(offreId) => {
                    // TODO: Implémenter l'API pour ajouter/retirer des likes
                    console.log('Toggle like:', offreId)
                  }}
                  onShare={(offreId) => {
                    console.log('Share:', offreId)
                  }}
                />
              ))}
            </div>

            {/* Pagination */}
            {actualPagination.totalPages > 1 && (
              <div className="mt-12">
                <Pagination
                  currentPage={currentPage}
                  totalPages={actualPagination.totalPages}
                  onPageChange={(page) => {
                    setCurrentPage(page)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  showInfo={true}
                />
              </div>
            )}

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
