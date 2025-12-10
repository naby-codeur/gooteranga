'use client'

import { Link } from '@/i18n/routing'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, MapPin, UtensilsCrossed, ChefHat, Store, BookOpen, ArrowLeft, ArrowRight } from 'lucide-react'
import Image from 'next/image'

export default function GastronomiePage() {

  // Plats principaux
  const platsPrincipaux = [
    {
      id: 1,
      nom: 'Thiébou Dieune',
      description: 'Le plat national sénégalais : riz au poisson avec légumes',
      ingredients: ['Riz', 'Poisson', 'Tomates', 'Chou', 'Carottes', 'Aubergines', 'Pommes de terre'],
      image: '/images/ba1.png',
      region: 'Tout le Sénégal'
    },
    {
      id: 2,
      nom: 'Yassa Poulet',
      description: 'Poulet mariné au citron et oignons, servi avec riz',
      ingredients: ['Poulet', 'Oignons', 'Citron', 'Moutarde', 'Riz'],
      image: '/images/ba2.png',
      region: 'Casamance'
    },
    {
      id: 3,
      nom: 'Mafé',
      description: 'Viande ou poisson dans une sauce à base d\'arachide',
      ingredients: ['Viande/Poisson', 'Arachide', 'Tomates', 'Oignons', 'Riz'],
      image: '/images/ba3.png',
      region: 'Tout le Sénégal'
    },
    {
      id: 4,
      nom: 'Soupou Kandja',
      description: 'Soupe de gombo avec poisson ou viande',
      ingredients: ['Gombo', 'Poisson/Viande', 'Riz', 'Épices'],
      image: '/images/ba4.png',
      region: 'Casamance'
    },
    {
      id: 5,
      nom: 'Thiébou Yapp',
      description: 'Riz à la viande, variante du Thiébou Dieune',
      ingredients: ['Riz', 'Viande de bœuf', 'Légumes', 'Épices'],
      image: '/images/ba5.png',
      region: 'Tout le Sénégal'
    },
    {
      id: 6,
      nom: 'Couscous Sénégalais',
      description: 'Couscous de mil ou de maïs avec sauce et viande',
      ingredients: ['Couscous', 'Viande', 'Légumes', 'Sauce'],
      image: '/images/ba6.png',
      region: 'Nord du Sénégal'
    },
  ]

  // Street food
  const streetFood = [
    {
      id: 1,
      nom: 'Fataya',
      description: 'Beignets fourrés à la viande, poisson ou légumes',
      prix: '500-1000 FCFA',
      image: '/images/ba7.png'
    },
    {
      id: 2,
      nom: 'Pastels',
      description: 'Beignets de poisson frits, spécialité de Gorée',
      prix: '300-500 FCFA',
      image: '/images/ba8.png'
    },
    {
      id: 3,
      nom: 'Bouye',
      description: 'Boisson à base de fruit du baobab',
      prix: '500-1000 FCFA',
      image: '/images/ba9.png'
    },
    {
      id: 4,
      nom: 'Bissap',
      description: 'Jus d\'hibiscus, rafraîchissant et riche en vitamines',
      prix: '500-1000 FCFA',
      image: '/images/ba1.png'
    },
    {
      id: 5,
      nom: 'Dibi',
      description: 'Brochettes de viande grillée, spécialité dakaroise',
      prix: '1000-2000 FCFA',
      image: '/images/ba2.png'
    },
    {
      id: 6,
      nom: 'Thiakry',
      description: 'Dessert à base de mil, lait caillé et fruits',
      prix: '500-1000 FCFA',
      image: '/images/ba3.png'
    },
  ]

  // Restaurants recommandés
  const restaurants = [
    {
      id: 1,
      nom: 'Le N\'Gor',
      specialite: 'Cuisine sénégalaise traditionnelle',
      lieu: 'N\'Gor, Dakar',
      rating: 4.8,
      prix: 'Moyen',
      image: '/images/ba4.png'
    },
    {
      id: 2,
      nom: 'La Calebasse',
      specialite: 'Thiébou Dieune authentique',
      lieu: 'Plateau, Dakar',
      rating: 4.9,
      prix: 'Économique',
      image: '/images/ba5.png'
    },
    {
      id: 3,
      nom: 'Le Lagon',
      specialite: 'Fruits de mer et poissons',
      lieu: 'Saly',
      rating: 4.7,
      prix: 'Élevé',
      image: '/images/ba6.png'
    },
    {
      id: 4,
      nom: 'Chez Loutcha',
      specialite: 'Cuisine casamançaise',
      lieu: 'Ziguinchor',
      rating: 4.8,
      prix: 'Moyen',
      image: '/images/ba7.png'
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('/images/ba2.jpg')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-teranga-orange/40 via-[#FFD700]/20 to-teranga-orange/40 z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-10"></div>
        </div>

        <div className="container relative z-20 mx-4 sm:mx-[5%] md:mx-[10%] py-12 sm:py-16 md:py-20 lg:py-24">
          <Button asChild variant="ghost" className="mb-4 sm:mb-6 text-white hover:text-white/80 text-sm sm:text-base">
            <Link href="/">
              <ArrowLeft className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              Retour à l&apos;accueil
            </Link>
          </Button>
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="p-2 sm:p-3 bg-teranga-orange/20 backdrop-blur rounded-full">
                <UtensilsCrossed className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <Badge className="bg-white/20 backdrop-blur text-white border-white/30 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5">
                Gastronomie Sénégalaise
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              Gastronomie
              <br />
              <span className="text-[#FFD700]">Sénégalaise</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-2xl leading-relaxed">
              Savourez les délices de la cuisine sénégalaise. Du Thiéboudiène au Yassa, 
              découvrez les saveurs authentiques qui font la réputation de la Teranga.
            </p>
          </div>
        </div>
      </section>

      {/* Section Plats Principaux */}
      <section className="mx-4 sm:mx-[5%] md:mx-[10%] py-8 sm:py-12 md:py-16 lg:py-24">
        <div className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3 sm:mb-4">
            Plats Principaux
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            Les plats emblématiques de la cuisine sénégalaise
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {platsPrincipaux.map((plat) => (
            <Card key={plat.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="relative h-64">
                <Image
                  src={plat.image}
                  alt={plat.nom}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-bold text-white mb-1">{plat.nom}</h3>
                  <div className="flex items-center gap-2 text-white/90 text-sm">
                    <MapPin className="h-4 w-4" />
                    {plat.region}
                  </div>
                </div>
              </div>
              <CardHeader>
                <CardDescription className="text-base">{plat.description}</CardDescription>
                <div className="mt-2">
                  <p className="text-sm font-medium mb-2">Ingrédients principaux:</p>
                  <div className="flex flex-wrap gap-2">
                    {plat.ingredients.slice(0, 4).map((ingredient, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {ingredient}
                      </Badge>
                    ))}
                    {plat.ingredients.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{plat.ingredients.length - 4}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Section Street Food */}
      <section className="bg-muted/50 py-16 md:py-24">
        <div className="mx-[10%]">
          <div className="mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
              Street Food
            </h2>
            <p className="text-lg text-muted-foreground">
              Découvrez les saveurs de la rue sénégalaise
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {streetFood.map((item) => (
              <Card key={item.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="relative h-48">
                  <Image
                    src={item.image}
                    alt={item.nom}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-bold text-white mb-1">{item.nom}</h3>
                    <p className="text-sm text-white/90">{item.prix}</p>
                  </div>
                </div>
                <CardHeader>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section Restaurants Recommandés */}
      <section className="mx-[10%] py-16 md:py-24">
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
            Restaurants Recommandés
          </h2>
          <p className="text-lg text-muted-foreground">
            Les meilleures adresses pour découvrir la cuisine sénégalaise
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {restaurants.map((restaurant) => (
            <Card key={restaurant.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="relative h-64">
                <Image
                  src={restaurant.image}
                  alt={restaurant.nom}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <Badge className="absolute top-4 right-4 bg-teranga-orange text-white">
                  {restaurant.prix}
                </Badge>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-bold text-white mb-1">{restaurant.nom}</h3>
                  <div className="flex items-center gap-2 text-white/90 text-sm mb-2">
                    <MapPin className="h-4 w-4" />
                    {restaurant.lieu}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-white">{restaurant.rating}</span>
                  </div>
                </div>
              </div>
              <CardHeader>
                <CardDescription className="text-base">{restaurant.specialite}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-teranga-orange hover:bg-[#FFD700] text-white">
                  <Link href={`/explorer?type=restaurant&search=${encodeURIComponent(restaurant.nom)}`}>
                    Voir les offres
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Section Recettes & Astuces */}
      <section className="bg-gradient-to-br from-teranga-orange/10 to-[#FFD700]/10 py-16 md:py-24">
        <div className="mx-[10%]">
          <div className="mb-12 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BookOpen className="h-8 w-8 text-teranga-orange" />
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Recettes & Astuces
              </h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Apprenez à cuisiner les plats sénégalais avec nos guides et cours de cuisine
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                id: 1,
                titre: 'Cours de Cuisine Thiéboudiène',
                description: 'Apprenez à préparer le plat national avec un chef local',
                duree: '4h',
                prix: '15 000 FCFA'
              },
              {
                id: 2,
                titre: 'Atelier Yassa',
                description: 'Maîtrisez la préparation du Yassa poulet traditionnel',
                duree: '3h',
                prix: '12 000 FCFA'
              },
              {
                id: 3,
                titre: 'Découverte des Épices',
                description: 'Initiation aux épices et condiments sénégalais',
                duree: '2h',
                prix: '8 000 FCFA'
              },
            ].map((recette) => (
              <Card key={recette.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <ChefHat className="h-5 w-5 text-teranga-orange" />
                    <CardTitle className="text-lg">{recette.titre}</CardTitle>
                  </div>
                  <CardDescription>{recette.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline">{recette.duree}</Badge>
                    <span className="text-lg font-bold text-teranga-orange">{recette.prix}</span>
                  </div>
                  <Button asChild className="w-full bg-teranga-orange hover:bg-[#FFD700] text-white">
                    <Link href={`/explorer?activite=GASTRONOMIE&search=${encodeURIComponent(recette.titre)}`}>
                      Réserver
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button asChild size="lg" variant="outline" className="border-teranga-orange text-teranga-orange hover:bg-teranga-orange hover:text-white">
              <Link href="/explorer?activite=GASTRONOMIE">
                Voir tous les cours de cuisine
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
