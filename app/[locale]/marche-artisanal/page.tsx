'use client'

import { Link } from '@/i18n/routing'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, MapPin, ShoppingBag, Hammer, Gem, Scissors, Palette, ArrowLeft, ArrowRight, Phone, Mail } from 'lucide-react'
import Image from 'next/image'

export default function MarcheArtisanalPage() {

  // Catégories d'artisanat
  const categoriesArtisanat = [
    {
      id: 1,
      nom: 'Sculpture',
      description: 'Sculptures en bois, pierre et métal, représentant des figures traditionnelles',
      icon: Hammer,
      couleur: 'bg-amber-600',
      produits: ['Masques', 'Statues', 'Objets décoratifs']
    },
    {
      id: 2,
      nom: 'Bijoux',
      description: 'Bijoux en or, argent et perles, créations traditionnelles et modernes',
      icon: Gem,
      couleur: 'bg-purple-600',
      produits: ['Colliers', 'Bracelets', 'Boucles d\'oreilles', 'Bagues']
    },
    {
      id: 3,
      nom: 'Tissage',
      description: 'Tissus traditionnels, bazins, wax et créations de stylistes locaux',
      icon: Scissors,
      couleur: 'bg-pink-600',
      produits: ['Bazins', 'Wax', 'Pagnes', 'Vêtements']
    },
    {
      id: 4,
      nom: 'Objets en Bois',
      description: 'Meubles, ustensiles et objets décoratifs en bois local',
      icon: Hammer,
      couleur: 'bg-orange-600',
      produits: ['Meubles', 'Ustensiles', 'Décoration']
    },
    {
      id: 5,
      nom: 'Tableaux',
      description: 'Peintures sur sable, toiles et œuvres d\'art contemporain',
      icon: Palette,
      couleur: 'bg-blue-600',
      produits: ['Peintures sur sable', 'Toiles', 'Art contemporain']
    },
    {
      id: 6,
      nom: 'Poterie',
      description: 'Poteries traditionnelles et objets en terre cuite',
      icon: Hammer,
      couleur: 'bg-red-600',
      produits: ['Vases', 'Pots', 'Objets décoratifs']
    },
  ]

  // Portraits d'artisans
  const artisans = [
    {
      id: 1,
      nom: 'Amadou Ba',
      specialite: 'Sculpteur sur bois',
      description: 'Maître sculpteur avec 25 ans d\'expérience, spécialisé dans les masques traditionnels',
      lieu: 'Dakar',
      rating: 4.9,
      nombreAvis: 45,
      image: '/images/ba1.png',
      contact: {
        telephone: '+221 77 XXX XX XX',
        email: 'amadou.ba@example.com'
      },
      produits: ['Masques', 'Statues', 'Objets décoratifs']
    },
    {
      id: 2,
      nom: 'Fatou Diallo',
      specialite: 'Bijoutière',
      description: 'Créatrice de bijoux en or et perles, mélangeant tradition et modernité',
      lieu: 'Saint-Louis',
      rating: 4.8,
      nombreAvis: 32,
      image: '/images/ba2.png',
      contact: {
        telephone: '+221 77 XXX XX XX',
        email: 'fatou.diallo@example.com'
      },
      produits: ['Colliers', 'Bracelets', 'Boucles d\'oreilles']
    },
    {
      id: 3,
      nom: 'Ibrahima Sarr',
      specialite: 'Tisseur',
      description: 'Maître tisserand, créateur de bazins et tissus traditionnels',
      lieu: 'Thiès',
      rating: 4.7,
      nombreAvis: 28,
      image: '/images/ba3.png',
      contact: {
        telephone: '+221 77 XXX XX XX',
        email: 'ibrahima.sarr@example.com'
      },
      produits: ['Bazins', 'Pagnes', 'Tissus']
    },
    {
      id: 4,
      nom: 'Mariama Ndiaye',
      specialite: 'Peintre sur sable',
      description: 'Artiste renommée pour ses tableaux de sable coloré, technique unique du Sénégal',
      lieu: 'Dakar',
      rating: 4.9,
      nombreAvis: 56,
      image: '/images/ba4.png',
      contact: {
        telephone: '+221 77 XXX XX XX',
        email: 'mariama.ndiaye@example.com'
      },
      produits: ['Tableaux de sable', 'Œuvres d\'art']
    },
  ]

  // Marchés artisanaux
  const marches = [
    {
      id: 1,
      nom: 'Marché de Soumbédioune',
      description: 'Le plus grand marché artisanal de Dakar',
      lieu: 'Dakar',
      horaires: 'Tous les jours, 9h-19h',
      image: '/images/ba5.png'
    },
    {
      id: 2,
      nom: 'Village Artisanal de Thiès',
      description: 'Centre d\'artisanat regroupant de nombreux artisans',
      lieu: 'Thiès',
      horaires: 'Lun-Sam, 8h-18h',
      image: '/images/ba6.png'
    },
    {
      id: 3,
      nom: 'Marché de Saint-Louis',
      description: 'Marché artisanal dans l\'ancienne capitale',
      lieu: 'Saint-Louis',
      horaires: 'Tous les jours, 9h-18h',
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
            style={{ backgroundImage: `url('/images/ba3.webp')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFC342]/40 via-[#FFD700]/20 to-[#FFC342]/40 z-10"></div>
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
              <div className="p-2 sm:p-3 bg-[#FFC342]/20 backdrop-blur rounded-full">
                <ShoppingBag className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <Badge className="bg-white/20 backdrop-blur text-white border-white/30 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5">
                Marché Artisanal
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              Marché Artisanal
              <br />
              <span className="text-[#FFD700]">du Sénégal</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-2xl leading-relaxed">
              Valorisez les artisans locaux et découvrez les produits traditionnels authentiques. 
              De la sculpture au tissage, explorez l&apos;artisanat sénégalais.
            </p>
          </div>
        </div>
      </section>

      {/* Section Catégories d'Artisanat */}
      <section className="mx-[10%] py-16 md:py-24">
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
            Catégories d&apos;Artisanat
          </h2>
          <p className="text-lg text-muted-foreground">
            Découvrez les différentes formes d&apos;artisanat sénégalais
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categoriesArtisanat.map((categorie) => {
            const Icon = categorie.icon
            return (
              <Card key={categorie.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className={`${categorie.couleur} h-32 flex items-center justify-center`}>
                  <Icon className="h-16 w-16 text-white" />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{categorie.nom}</CardTitle>
                  <CardDescription>{categorie.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Produits:</p>
                    <div className="flex flex-wrap gap-2">
                      {categorie.produits.map((produit, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {produit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/explorer?activite=SHOPPING&search=${encodeURIComponent(categorie.nom)}`}>
                      Découvrir
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Section Portraits d'Artisans */}
      <section className="bg-muted/50 py-16 md:py-24">
        <div className="mx-[10%]">
          <div className="mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
              Portraits d&apos;Artisans
            </h2>
            <p className="text-lg text-muted-foreground">
              Rencontrez les artisans locaux et découvrez leur savoir-faire
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {artisans.map((artisan) => (
              <Card key={artisan.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="relative h-64">
                  <Image
                    src={artisan.image}
                    alt={artisan.nom}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-xl font-bold text-white mb-1">{artisan.nom}</h3>
                    <p className="text-sm text-white/90 mb-2">{artisan.specialite}</p>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-white">{artisan.rating}</span>
                      <span className="text-xs text-white/70">({artisan.nombreAvis} avis)</span>
                    </div>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4" />
                    {artisan.lieu}
                  </div>
                  <CardDescription className="text-base">{artisan.description}</CardDescription>
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Produits:</p>
                    <div className="flex flex-wrap gap-2">
                      {artisan.produits.map((produit, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {produit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{artisan.contact.telephone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{artisan.contact.email}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild className="flex-1 bg-[#FFC342] hover:bg-[#FFD700] text-white">
                      <Link href={`/explorer?type=artisan&search=${encodeURIComponent(artisan.nom)}`}>
                        Réserver
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="flex-1">
                      <Link href={`/artisan/${artisan.id}`}>
                        Profil
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section Marchés Artisanaux */}
      <section className="mx-[10%] py-16 md:py-24">
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
            Marchés Artisanaux
          </h2>
          <p className="text-lg text-muted-foreground">
            Les meilleurs endroits pour découvrir et acheter l&apos;artisanat local
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {marches.map((marche) => (
            <Card key={marche.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="relative h-64">
                <Image
                  src={marche.image}
                  alt={marche.nom}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-bold text-white mb-1">{marche.nom}</h3>
                  <div className="flex items-center gap-2 text-white/90 text-sm mb-2">
                    <MapPin className="h-4 w-4" />
                    {marche.lieu}
                  </div>
                  <p className="text-sm text-white/90">{marche.horaires}</p>
                </div>
              </div>
              <CardHeader>
                <CardDescription className="text-base">{marche.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full border-[#FFC342] text-[#FFC342] hover:bg-[#FFC342] hover:text-white">
                  <Link href={`/explorer?search=${encodeURIComponent(marche.nom)}`}>
                    Découvrir
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Section CTA */}
      <section className="bg-gradient-to-br from-[#FFC342]/10 to-[#FFD700]/10 py-16 md:py-24">
        <div className="mx-[10%] text-center">
          <ShoppingBag className="h-16 w-16 text-[#FFC342] mx-auto mb-6" />
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
            Découvrez et Réservez des Artisans
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Rencontrez les artisans locaux, découvrez leur savoir-faire et commandez des produits authentiques
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-[#FFC342] hover:bg-[#FFD700] text-white text-lg px-8 py-6 h-auto">
              <Link href="/explorer?activite=SHOPPING">
                Voir tous les artisans
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-[#FFC342] text-[#FFC342] hover:bg-[#FFC342] hover:text-white text-lg px-8 py-6 h-auto">
              <Link href="/explorer?type=artisan">
                Visiter les marchés
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
