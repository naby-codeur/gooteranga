'use client'

import { useState, useEffect } from 'react'
import { Link } from '@/i18n/routing'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, MapPin, Clock, Users, Waves, ArrowLeft } from 'lucide-react'
import Image from 'next/image'

export default function PlagesIlesPage() {
  const [currentBgIndex, setCurrentBgIndex] = useState(0)
  const backgroundImages = Array.from({ length: 10 }, (_, i) => `/images/ba${i + 1}.png`)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [backgroundImages.length])

  // Exemple d'offres - À remplacer par des données réelles depuis la base de données
  const offres = [
    {
      id: 1,
      titre: 'Excursion Île de Gorée',
      description: 'Découvrez l\'île historique de Gorée, site classé au patrimoine mondial de l\'UNESCO',
      prix: '15000',
      lieu: 'Gorée, Dakar',
      duree: '4h',
      capacite: '20 personnes',
      rating: 4.9,
      image: '/images/ba1.png',
      prestataire: 'Dakar Tours'
    },
    {
      id: 2,
      titre: 'Plage de N\'Gor',
      description: 'Profitez des magnifiques plages de N\'Gor avec activités nautiques',
      prix: '8000',
      lieu: 'N\'Gor, Dakar',
      duree: '6h',
      capacite: '15 personnes',
      rating: 4.7,
      image: '/images/ba2.png',
      prestataire: 'Senegal Beach'
    },
    {
      id: 3,
      titre: 'Îles de la Madeleine',
      description: 'Excursion vers les îles de la Madeleine, réserve naturelle',
      prix: '20000',
      lieu: 'Dakar',
      duree: '8h',
      capacite: '12 personnes',
      rating: 4.8,
      image: '/images/ba3.png',
      prestataire: 'Nature Tours'
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
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
          <div className="absolute inset-0 bg-gradient-to-br from-cap-blue/30 via-nature-green/20 to-cap-blue/30 z-10"></div>
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
              <div className="p-3 bg-cap-blue/20 backdrop-blur rounded-full">
                <Waves className="h-8 w-8 text-white" />
              </div>
              <Badge className="bg-white/20 backdrop-blur text-white border-white/30">
                Plages & Îles
              </Badge>
            </div>
            <h1 className="text-5xl font-bold text-white sm:text-6xl md:text-7xl mb-6">
              Plages & Îles
              <br />
              <span className="text-cap-blue">du Sénégal</span>
            </h1>
            <p className="text-xl text-white/90 sm:text-2xl max-w-2xl">
              Découvrez les plus belles plages et îles du Sénégal. Des eaux turquoise aux sables dorés, 
              vivez des expériences inoubliables au bord de l&apos;océan Atlantique.
            </p>
          </div>
        </div>
      </section>

      {/* Offres Section */}
      <section className="mx-[10%] py-16 md:py-24">
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
            Nos offres
          </h2>
          <p className="text-lg text-muted-foreground">
            Explorez toutes les offres de nos prestataires pour découvrir les plages et îles du Sénégal
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {offres.map((offre) => (
            <Card key={offre.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="relative h-64 bg-cap-blue">
                <Image
                  src={offre.image}
                  alt={offre.titre}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <Badge className="absolute top-4 right-4 bg-white text-cap-blue">
                  {offre.prix} FCFA
                </Badge>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-bold text-white mb-1">{offre.titre}</h3>
                  <div className="flex items-center gap-2 text-white/90 text-sm">
                    <MapPin className="h-4 w-4" />
                    {offre.lieu}
                  </div>
                </div>
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{offre.rating}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Par {offre.prestataire}</span>
                </div>
                <CardDescription className="text-base">{offre.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {offre.duree}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {offre.capacite}
                  </div>
                </div>
                <Button asChild className="w-full bg-cap-blue hover:bg-cap-blue/90 text-white">
                  <Link href={`/experience/${offre.id}`}>
                    Voir les détails
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {offres.length === 0 && (
          <div className="text-center py-12">
            <Waves className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">
              Aucune offre disponible pour le moment
            </p>
          </div>
        )}
      </section>
    </div>
  )
}

