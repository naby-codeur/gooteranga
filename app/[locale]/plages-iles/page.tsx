'use client'

import { Link } from '@/i18n/routing'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, MapPin, Waves, Fish, Hotel, ArrowLeft, ArrowRight } from 'lucide-react'
import Image from 'next/image'

export default function PlagesIlesPage() {

  // Top 5 plages
  const topPlages = [
    {
      id: 1,
      nom: 'Plage de N\'Gor',
      region: 'Dakar',
      description: 'Magnifique plage avec eaux turquoise, idéale pour le surf et la détente',
      image: '/images/ba1.png',
      rating: 4.9,
      activites: ['Surf', 'Baignade', 'Détente']
    },
    {
      id: 2,
      nom: 'Plage de Saly',
      region: 'Thiès',
      description: 'Station balnéaire populaire avec de nombreux hôtels et activités nautiques',
      image: '/images/ba2.png',
      rating: 4.8,
      activites: ['Jet-ski', 'Voile', 'Plongée']
    },
    {
      id: 3,
      nom: 'Plage de Somone',
      region: 'Thiès',
      description: 'Plage tranquille avec lagune, parfaite pour les familles',
      image: '/images/ba3.png',
      rating: 4.7,
      activites: ['Kayak', 'Pêche', 'Observation oiseaux']
    },
    {
      id: 4,
      nom: 'Plage de Toubab Dialaw',
      region: 'Thiès',
      description: 'Plage sauvage et authentique, paradis des surfeurs',
      image: '/images/ba4.png',
      rating: 4.8,
      activites: ['Surf', 'Randonnée', 'Yoga']
    },
    {
      id: 5,
      nom: 'Plage de Cap Skirring',
      region: 'Casamance',
      description: 'L\'une des plus belles plages d\'Afrique de l\'Ouest',
      image: '/images/ba5.png',
      rating: 4.9,
      activites: ['Baignade', 'Pêche', 'Détente']
    },
  ]

  // Îles incontournables
  const iles = [
    {
      id: 1,
      nom: 'Île de Gorée',
      description: 'Site classé au patrimoine mondial de l\'UNESCO, témoin de l\'histoire de la traite des esclaves',
      image: '/images/ba6.png',
      coordonnees: { lat: 14.6700, lng: -17.4000 },
      rating: 4.9
    },
    {
      id: 2,
      nom: 'Île de N\'Gor',
      description: 'Petite île pittoresque accessible en pirogue depuis la plage de N\'Gor',
      image: '/images/ba7.png',
      coordonnees: { lat: 14.7500, lng: -17.5167 },
      rating: 4.7
    },
    {
      id: 3,
      nom: 'Île aux Oiseaux (Delta du Saloum)',
      description: 'Réserve ornithologique exceptionnelle dans le delta du Saloum',
      image: '/images/ba8.png',
      coordonnees: { lat: 13.7500, lng: -16.5000 },
      rating: 4.8
    },
    {
      id: 4,
      nom: 'Îles de la Madeleine',
      description: 'Réserve naturelle protégée, paradis pour les oiseaux marins',
      image: '/images/ba9.png',
      coordonnees: { lat: 14.6667, lng: -17.4667 },
      rating: 4.6
    },
  ]

  // Activités
  const activites = [
    {
      id: 1,
      nom: 'Surf',
      description: 'Profitez des vagues de l\'Atlantique sur les meilleurs spots du Sénégal',
      icon: Waves,
      couleur: 'bg-blue-500'
    },
    {
      id: 2,
      nom: 'Kayak',
      description: 'Explorez les lagunes et mangroves en kayak',
      icon: Waves,
      couleur: 'bg-cyan-500'
    },
    {
      id: 3,
      nom: 'Pêche',
      description: 'Partez en pêche avec les pêcheurs locaux',
      icon: Fish,
      couleur: 'bg-teal-500'
    },
    {
      id: 4,
      nom: 'Plongée',
      description: 'Découvrez les fonds marins et la vie sous-marine',
      icon: Waves, // Replace with another valid icon
      couleur: 'bg-indigo-500'
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('/images/ba6.jpg')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-cap-blue/40 via-nature-green/20 to-cap-blue/40 z-10"></div>
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
              <div className="p-2 sm:p-3 bg-cap-blue/20 backdrop-blur rounded-full">
                <Waves className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <Badge className="bg-white/20 backdrop-blur text-white border-white/30 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5">
                Plages & Îles
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              Plages & Îles
              <br />
              <span className="text-cap-blue">du Sénégal</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-2xl leading-relaxed">
              Découvrez les plus belles plages et îles du Sénégal. Des eaux turquoise aux sables dorés, 
              vivez des expériences inoubliables au bord de l&apos;océan Atlantique.
            </p>
          </div>
        </div>
      </section>

      {/* Section Top 5 Plages */}
      <section className="mx-[10%] py-16 md:py-24">
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
            Top 5 Plages
          </h2>
          <p className="text-lg text-muted-foreground">
            Les plus belles plages du Sénégal sélectionnées pour vous
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {topPlages.map((plage, index) => (
            <Card key={plage.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-2 hover:border-cap-blue">
              <div className="relative h-64">
                <Image
                  src={plage.image}
                  alt={plage.nom}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <Badge className="absolute top-4 left-4 bg-cap-blue text-white">
                  #{index + 1}
                </Badge>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-bold text-white mb-1">{plage.nom}</h3>
                  <div className="flex items-center gap-2 text-white/90 text-sm mb-2">
                    <MapPin className="h-4 w-4" />
                    {plage.region}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-white">{plage.rating}</span>
                  </div>
                </div>
              </div>
              <CardHeader>
                <CardDescription className="text-base">{plage.description}</CardDescription>
                <div className="flex flex-wrap gap-2 mt-2">
                  {plage.activites.map((activite, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {activite}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Section Îles Incontournables */}
      <section className="bg-muted/50 py-16 md:py-24">
        <div className="mx-[10%]">
          <div className="mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
              Îles Incontournables
            </h2>
            <p className="text-lg text-muted-foreground">
              Découvrez les îles emblématiques du Sénégal, chacune avec son histoire et sa beauté unique
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {iles.map((ile) => (
              <Card key={ile.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="relative h-80">
                  <Image
                    src={ile.image}
                    alt={ile.nom}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{ile.nom}</h3>
                    <p className="text-white/90 mb-4">{ile.description}</p>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-white">{ile.rating}</span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <Button asChild variant="outline" className="w-full border-cap-blue text-cap-blue hover:bg-cap-blue hover:text-white">
                    <Link href={`/explorer?destination=${ile.nom.toLowerCase().replace(/\s+/g, '-')}`}>
                      Voir les offres
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section Activités */}
      <section className="mx-[10%] py-16 md:py-24">
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
            Activités Nautiques
          </h2>
          <p className="text-lg text-muted-foreground">
            Profitez d&apos;une multitude d&apos;activités au bord de l&apos;océan
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {activites.map((activite) => {
            const Icon = activite.icon
            return (
              <Card key={activite.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300 text-center">
                <div className={`${activite.couleur} h-32 flex items-center justify-center`}>
                  <Icon className="h-16 w-16 text-white" />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{activite.nom}</CardTitle>
                  <CardDescription>{activite.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/explorer?activite=${activite.nom.toLowerCase()}`}>
                      Découvrir
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Section Hébergement */}
      <section className="bg-gradient-to-br from-cap-blue/10 to-nature-green/10 py-16 md:py-24">
        <div className="mx-[10%]">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
              Hébergement près des Plages
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Trouvez le logement parfait pour votre séjour au bord de la mer
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="bg-cap-blue hover:bg-cap-blue/90 text-white text-lg px-8 py-6 h-auto">
              <Link href="/hebergements?type=hotel&region=plage">
                <Hotel className="mr-2 h-5 w-5" />
                Hôtels & Résidences
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-cap-blue text-cap-blue hover:bg-cap-blue hover:text-white text-lg px-8 py-6 h-auto">
              <Link href="/hebergements?type=auberge&region=plage">
                Auberges & Guesthouses
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-cap-blue text-cap-blue hover:bg-cap-blue hover:text-white text-lg px-8 py-6 h-auto">
              <Link href="/explorer?type=hebergement&activite=PLAGE">
                Voir toutes les offres
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
