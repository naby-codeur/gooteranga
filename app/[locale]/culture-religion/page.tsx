'use client'

import { useState, useEffect } from 'react'
import { Link } from '@/i18n/routing'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, MapPin, Building2, Calendar, Landmark, Building, ArrowLeft, ArrowRight } from 'lucide-react'
import Image from 'next/image'

export default function CultureReligionPage() {
  const [currentBgIndex, setCurrentBgIndex] = useState(0)
  const backgroundImages = Array.from({ length: 10 }, (_, i) => `/images/ba${i + 1}.png`)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [backgroundImages.length])

  // Mosaïque Culture Sénégalaise
  const cultureItems = [
    {
      id: 1,
      titre: 'Danse Sabar',
      description: 'Cérémonie traditionnelle de danse et de percussion',
      image: '/images/ba1.png',
      type: 'Tradition'
    },
    {
      id: 2,
      titre: 'Griots',
      description: 'Gardiens de la tradition orale et de l\'histoire',
      image: '/images/ba2.png',
      type: 'Patrimoine'
    },
    {
      id: 3,
      titre: 'Groupes Ethniques',
      description: 'Wolof, Pulaar, Sérère, Diola et bien d\'autres',
      image: '/images/ba3.png',
      type: 'Diversité'
    },
    {
      id: 4,
      titre: 'Musique Sénégalaise',
      description: 'Mbalax, reggae, hip-hop et musique traditionnelle',
      image: '/images/ba4.png',
      type: 'Art'
    },
    {
      id: 5,
      titre: 'Tissus & Mode',
      description: 'Bazins, wax et créations de stylistes locaux',
      image: '/images/ba5.png',
      type: 'Artisanat'
    },
    {
      id: 6,
      titre: 'Festivals',
      description: 'Festival de Jazz, Biennale de Dakar, Festival des Arts',
      image: '/images/ba6.png',
      type: 'Événement'
    },
  ]

  // Religion
  const religions = [
    {
      id: 1,
      nom: 'Islam',
      description: 'Religion majoritaire au Sénégal (95% de la population)',
      confreries: ['Mouride', 'Tidjane', 'Qadiriyya', 'Layène'],
      icon: Landmark,
      couleur: 'bg-green-600'
    },
    {
      id: 2,
      nom: 'Christianisme',
      description: 'Communauté chrétienne présente notamment à Ziguinchor et Casamance',
      confreries: ['Catholique', 'Protestant'],
      icon: Building,
      couleur: 'bg-blue-600'
    },
  ]

  // Lieux culturels
  const lieuxCulturels = [
    {
      id: 1,
      nom: 'Musée des Civilisations Noires',
      type: 'Musée',
      description: 'Musée dédié aux civilisations africaines',
      lieu: 'Dakar',
      image: '/images/ba7.png'
    },
    {
      id: 2,
      nom: 'Village des Arts',
      type: 'Centre Culturel',
      description: 'Espace dédié aux artistes et créateurs',
      lieu: 'Dakar',
      image: '/images/ba8.png'
    },
    {
      id: 3,
      nom: 'Maison des Esclaves',
      type: 'Musée Historique',
      description: 'Mémorial de la traite des esclaves',
      lieu: 'Gorée',
      image: '/images/ba9.png'
    },
    {
      id: 4,
      nom: 'Centre Culturel Blaise Senghor',
      type: 'Centre Culturel',
      description: 'Espace de spectacles et d\'expositions',
      lieu: 'Dakar',
      image: '/images/ba1.png'
    },
  ]

  // Calendrier des événements
  const evenements = [
    {
      id: 1,
      nom: 'Grand Magal de Touba',
      type: 'Religieux',
      date: '18 Rabi\' al-awwal',
      description: 'Pèlerinage annuel des Mourides à Touba',
      lieu: 'Touba'
    },
    {
      id: 2,
      nom: 'Gamou de Tivaouane',
      type: 'Religieux',
      date: '12 Rabi\' al-awwal',
      description: 'Célébration de la naissance du Prophète par les Tidjanes',
      lieu: 'Tivaouane'
    },
    {
      id: 3,
      nom: 'Festival International de Jazz de Saint-Louis',
      type: 'Culturel',
      date: 'Mai',
      description: 'Festival de musique jazz sur l\'île de Saint-Louis',
      lieu: 'Saint-Louis'
    },
    {
      id: 4,
      nom: 'Biennale de Dakar',
      type: 'Culturel',
      date: 'Mai-Juin (années impaires)',
      description: 'Exposition internationale d\'art contemporain',
      lieu: 'Dakar'
    },
    {
      id: 5,
      nom: 'Festival des Arts Nègres',
      type: 'Culturel',
      date: 'Décembre',
      description: 'Festival panafricain des arts et de la culture',
      lieu: 'Dakar'
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
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
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/40 via-pink-500/20 to-purple-500/40 z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-10"></div>
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
              <div className="p-3 bg-purple-500/20 backdrop-blur rounded-full">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <Badge className="bg-white/20 backdrop-blur text-white border-white/30">
                Culture & Religion
              </Badge>
            </div>
            <h1 className="text-5xl font-bold text-white sm:text-6xl md:text-7xl mb-6">
              Culture & Religion
              <br />
              <span className="text-purple-300">du Sénégal</span>
            </h1>
            <p className="text-xl text-white/90 sm:text-2xl max-w-2xl">
              Immergez-vous dans la riche culture sénégalaise. Découvrez les traditions, 
              les religions et les coutumes qui font l&apos;identité de ce pays de la Teranga.
            </p>
          </div>
        </div>
      </section>

      {/* Mosaïque Culture Sénégalaise */}
      <section className="mx-[10%] py-16 md:py-24">
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
            Culture Sénégalaise
          </h2>
          <p className="text-lg text-muted-foreground">
            Un patrimoine culturel riche et diversifié
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cultureItems.map((item) => (
            <Card key={item.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="relative h-64">
                <Image
                  src={item.image}
                  alt={item.titre}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <Badge className="absolute top-4 right-4 bg-purple-500 text-white">
                  {item.type}
                </Badge>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-bold text-white mb-1">{item.titre}</h3>
                  <p className="text-sm text-white/90">{item.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Section Religion */}
      <section className="bg-muted/50 py-16 md:py-24">
        <div className="mx-[10%]">
          <div className="mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
              Religion au Sénégal
            </h2>
            <p className="text-lg text-muted-foreground">
              Un pays de tolérance religieuse où coexistent différentes confessions
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {religions.map((religion) => {
              const Icon = religion.icon
              return (
                <Card key={religion.id} className="overflow-hidden">
                  <div className={`${religion.couleur} h-32 flex items-center justify-center`}>
                    <Icon className="h-16 w-16 text-white" />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-2xl">{religion.nom}</CardTitle>
                    <CardDescription className="text-base">{religion.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Confréries & Communautés:</p>
                      <div className="flex flex-wrap gap-2">
                        {religion.confreries.map((confrerie, idx) => (
                          <Badge key={idx} variant="outline">
                            {confrerie}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button asChild variant="outline" className="w-full">
                      <Link href={`/explorer?activite=RELIGIEUX&search=${religion.nom}`}>
                        Découvrir les lieux
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Lieux religieux emblématiques */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-6">Lieux Religieux Emblématiques</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { nom: 'Grande Mosquée de Touba', lieu: 'Touba', type: 'Mouride' },
                { nom: 'Mosquée de Tivaouane', lieu: 'Tivaouane', type: 'Tidjane' },
                { nom: 'Sanctuaire de Popenguine', lieu: 'Popenguine', type: 'Catholique' },
                { nom: 'Mosquée de la Divinité', lieu: 'Dakar', type: 'Layène' },
              ].map((lieu, idx) => (
                <Card key={idx} className="text-center">
                  <CardHeader>
                    <CardTitle className="text-lg">{lieu.nom}</CardTitle>
                    <CardDescription>{lieu.lieu}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="secondary">{lieu.type}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Lieux Culturels */}
      <section className="mx-[10%] py-16 md:py-24">
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
            Lieux Culturels
          </h2>
          <p className="text-lg text-muted-foreground">
            Musées, centres culturels et espaces artistiques à découvrir
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {lieuxCulturels.map((lieu) => (
            <Card key={lieu.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="relative h-64">
                <Image
                  src={lieu.image}
                  alt={lieu.nom}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <Badge className="absolute top-4 right-4 bg-purple-500 text-white">
                  {lieu.type}
                </Badge>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-bold text-white mb-1">{lieu.nom}</h3>
                  <div className="flex items-center gap-2 text-white/90 text-sm mb-2">
                    <MapPin className="h-4 w-4" />
                    {lieu.lieu}
                  </div>
                  <p className="text-sm text-white/90">{lieu.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Calendrier des Événements */}
      <section className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 py-16 md:py-24">
        <div className="mx-[10%]">
          <div className="mb-12 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Calendar className="h-8 w-8 text-purple-600" />
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Calendrier des Événements
              </h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ne manquez pas les grands événements culturels et religieux du Sénégal
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {evenements.map((evenement) => (
              <Card key={evenement.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant={evenement.type === 'Religieux' ? 'default' : 'secondary'}>
                      {evenement.type}
                    </Badge>
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-lg">{evenement.nom}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-2">
                    <MapPin className="h-4 w-4" />
                    {evenement.lieu}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Date:</strong> {evenement.date}
                  </p>
                  <p className="text-sm">{evenement.description}</p>
                  <Button asChild variant="outline" className="w-full mt-4">
                    <Link href={`/explorer?search=${encodeURIComponent(evenement.nom)}`}>
                      Voir les offres
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
