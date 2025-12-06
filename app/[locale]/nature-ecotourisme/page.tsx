'use client'

import { useState, useEffect } from 'react'
import { Link } from '@/i18n/routing'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, MapPin, Trees, Bird, Fish, Leaf, Route, ArrowLeft, ArrowRight } from 'lucide-react'
import Image from 'next/image'

export default function NatureEcotourismePage() {
  const [currentBgIndex, setCurrentBgIndex] = useState(0)
  const backgroundImages = Array.from({ length: 10 }, (_, i) => `/images/ba${i + 1}.png`)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [backgroundImages.length])

  // Parcs nationaux
  const parcsNationaux = [
    {
      id: 1,
      nom: 'Parc National du Niokolo-Koba',
      description: 'Le plus grand parc national du Sénégal, classé au patrimoine mondial de l\'UNESCO',
      superficie: '913 000 hectares',
      lieu: 'Tambacounda',
      faune: ['Lions', 'Éléphants', 'Buffle', 'Hippopotames', 'Crocodiles', 'Antilopes'],
      image: '/images/ba1.png',
      rating: 4.9
    },
    {
      id: 2,
      nom: 'Parc National des Oiseaux du Djoudj',
      description: 'Réserve ornithologique exceptionnelle, site RAMSAR et UNESCO',
      superficie: '16 000 hectares',
      lieu: 'Saint-Louis',
      faune: ['Flamants roses', 'Pélicans', 'Cormorans', 'Hérons', 'Canards'],
      image: '/images/ba2.png',
      rating: 4.8
    },
    {
      id: 3,
      nom: 'Réserve de Bandia',
      description: 'Réserve privée avec animaux en semi-liberté, accessible depuis Dakar',
      superficie: '3 500 hectares',
      lieu: 'Thiès',
      faune: ['Girafes', 'Rhinocéros', 'Zèbres', 'Antilopes', 'Oiseaux'],
      image: '/images/ba3.png',
      rating: 4.7
    },
    {
      id: 4,
      nom: 'Parc National de la Langue de Barbarie',
      description: 'Réserve naturelle côtière avec dunes et lagunes',
      superficie: '2 000 hectares',
      lieu: 'Saint-Louis',
      faune: ['Oiseaux migrateurs', 'Tortues marines', 'Poissons'],
      image: '/images/ba4.png',
      rating: 4.6
    },
  ]

  // Mangroves
  const mangroves = [
    {
      id: 1,
      nom: 'Mangroves du Delta du Saloum',
      description: 'Écosystème unique classé au patrimoine mondial de l\'UNESCO',
      superficie: '180 000 hectares',
      lieu: 'Delta du Saloum',
      activites: ['Kayak', 'Observation oiseaux', 'Pêche traditionnelle'],
      image: '/images/ba5.png',
      rating: 4.9
    },
    {
      id: 2,
      nom: 'Mangroves de Casamance',
      description: 'Vastes étendues de mangroves dans le sud du Sénégal',
      superficie: '150 000 hectares',
      lieu: 'Casamance',
      activites: ['Navigation en pirogue', 'Écotourisme', 'Découverte culturelle'],
      image: '/images/ba6.png',
      rating: 4.8
    },
  ]

  // Faune & Flore
  const fauneFlore = [
    {
      id: 1,
      categorie: 'Mammifères',
      especes: ['Lions', 'Éléphants', 'Buffle', 'Hippopotames', 'Girafes', 'Rhinocéros', 'Zèbres', 'Antilopes'],
      icon: Trees,
      couleur: 'bg-green-600'
    },
    {
      id: 2,
      categorie: 'Oiseaux',
      especes: ['Flamants roses', 'Pélicans', 'Cormorans', 'Hérons', 'Aigles', 'Vautours', 'Canards'],
      icon: Bird,
      couleur: 'bg-blue-600'
    },
    {
      id: 3,
      categorie: 'Flore',
      especes: ['Baobabs', 'Acacias', 'Palétuviers', 'Cocotiers', 'Mangroves'],
      icon: Leaf,
      couleur: 'bg-emerald-600'
    },
    {
      id: 4,
      categorie: 'Marin',
      especes: ['Poissons', 'Tortues marines', 'Dauphins', 'Crocodiles'],
      icon: Fish,
      couleur: 'bg-cyan-600'
    },
  ]

  // Circuits écotouristiques
  const circuits = [
    {
      id: 1,
      nom: 'Safari Niokolo-Koba',
      description: 'Safari de 3 jours dans le plus grand parc national',
      duree: '3 jours',
      prix: '150 000 FCFA',
      activites: ['Safari', 'Observation faune', 'Randonnée'],
      image: '/images/ba7.png'
    },
    {
      id: 2,
      nom: 'Kayak Delta du Saloum',
      description: 'Exploration des mangroves en kayak',
      duree: '1 jour',
      prix: '25 000 FCFA',
      activites: ['Kayak', 'Observation oiseaux', 'Pêche'],
      image: '/images/ba8.png'
    },
    {
      id: 3,
      nom: 'Observation Oiseaux Djoudj',
      description: 'Découverte de la réserve ornithologique',
      duree: '1 jour',
      prix: '20 000 FCFA',
      activites: ['Observation oiseaux', 'Photographie', 'Randonnée'],
      image: '/images/ba9.png'
    },
    {
      id: 4,
      nom: 'Randonnée Casamance',
      description: 'Randonnée dans les forêts et mangroves de Casamance',
      duree: '2 jours',
      prix: '45 000 FCFA',
      activites: ['Randonnée', 'Écotourisme', 'Découverte culturelle'],
      image: '/images/ba1.png'
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
          <div className="absolute inset-0 bg-gradient-to-br from-nature-green/40 via-cap-blue/20 to-nature-green/40 z-10"></div>
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
              <div className="p-3 bg-nature-green/20 backdrop-blur rounded-full">
                <Trees className="h-8 w-8 text-white" />
              </div>
              <Badge className="bg-white/20 backdrop-blur text-white border-white/30">
                Nature & Écotourisme
              </Badge>
            </div>
            <h1 className="text-5xl font-bold text-white sm:text-6xl md:text-7xl mb-6">
              Nature & Écotourisme
              <br />
              <span className="text-nature-green">du Sénégal</span>
            </h1>
            <p className="text-xl text-white/90 sm:text-2xl max-w-2xl">
              Explorez la nature préservée du Sénégal. Des parcs nationaux aux réserves naturelles, 
              découvrez la biodiversité exceptionnelle de ce pays d&apos;Afrique de l&apos;Ouest.
            </p>
          </div>
        </div>
      </section>

      {/* Section Parcs Nationaux */}
      <section className="mx-[10%] py-16 md:py-24">
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
            Parcs Nationaux
          </h2>
          <p className="text-lg text-muted-foreground">
            Découvrez les espaces protégés et leurs richesses naturelles
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {parcsNationaux.map((parc) => (
            <Card key={parc.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="relative h-80">
                <Image
                  src={parc.image}
                  alt={parc.nom}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                <Badge className="absolute top-4 right-4 bg-nature-green text-white">
                  Parc National
                </Badge>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{parc.nom}</h3>
                  <div className="flex items-center gap-2 text-white/90 text-sm mb-2">
                    <MapPin className="h-4 w-4" />
                    {parc.lieu}
                  </div>
                  <p className="text-white/90 mb-2">{parc.description}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-white">{parc.rating}</span>
                  </div>
                  <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                    {parc.superficie}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <div className="mb-2">
                  <p className="text-sm font-medium mb-2">Faune présente:</p>
                  <div className="flex flex-wrap gap-2">
                    {parc.faune.slice(0, 4).map((animal, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {animal}
                      </Badge>
                    ))}
                    {parc.faune.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{parc.faune.length - 4}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-nature-green hover:bg-nature-green/90 text-white">
                  <Link href={`/explorer?activite=NATURE&search=${encodeURIComponent(parc.nom)}`}>
                    Voir les offres
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Section Mangroves */}
      <section className="bg-muted/50 py-16 md:py-24">
        <div className="mx-[10%]">
          <div className="mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
              Mangroves
            </h2>
            <p className="text-lg text-muted-foreground">
              Explorez ces écosystèmes uniques et fragiles
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {mangroves.map((mangrove) => (
              <Card key={mangrove.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="relative h-80">
                  <Image
                    src={mangrove.image}
                    alt={mangrove.nom}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                  <Badge className="absolute top-4 right-4 bg-cyan-600 text-white">
                    UNESCO
                  </Badge>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{mangrove.nom}</h3>
                    <div className="flex items-center gap-2 text-white/90 text-sm mb-2">
                      <MapPin className="h-4 w-4" />
                      {mangrove.lieu}
                    </div>
                    <p className="text-white/90 mb-2">{mangrove.description}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-white">{mangrove.rating}</span>
                    </div>
                    <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                      {mangrove.superficie}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <div className="mb-2">
                    <p className="text-sm font-medium mb-2">Activités:</p>
                    <div className="flex flex-wrap gap-2">
                      {mangrove.activites.map((activite, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {activite}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="w-full border-nature-green text-nature-green hover:bg-nature-green hover:text-white">
                    <Link href={`/explorer?activite=NATURE&search=${encodeURIComponent(mangrove.nom)}`}>
                      Découvrir
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section Faune & Flore */}
      <section className="mx-[10%] py-16 md:py-24">
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
            Faune & Flore
          </h2>
          <p className="text-lg text-muted-foreground">
            La biodiversité exceptionnelle du Sénégal
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {fauneFlore.map((categorie) => {
            const Icon = categorie.icon
            return (
              <Card key={categorie.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className={`${categorie.couleur} h-32 flex items-center justify-center`}>
                  <Icon className="h-16 w-16 text-white" />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{categorie.categorie}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {categorie.especes.slice(0, 3).map((espece, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {espece}
                      </Badge>
                    ))}
                    {categorie.especes.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{categorie.especes.length - 3}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Section Circuits Écotouristiques */}
      <section className="bg-gradient-to-br from-nature-green/10 to-cap-blue/10 py-16 md:py-24">
        <div className="mx-[10%]">
          <div className="mb-12 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Route className="h-8 w-8 text-nature-green" />
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Circuits Écotouristiques
              </h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Partez à l&apos;aventure avec nos circuits respectueux de l&apos;environnement
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {circuits.map((circuit) => (
              <Card key={circuit.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="relative h-64">
                  <Image
                    src={circuit.image}
                    alt={circuit.nom}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-xl font-bold text-white mb-1">{circuit.nom}</h3>
                    <div className="flex items-center gap-4 text-white/90 text-sm">
                      <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                        {circuit.duree}
                      </Badge>
                      <span className="text-lg font-bold text-white">{circuit.prix}</span>
                    </div>
                  </div>
                </div>
                <CardHeader>
                  <CardDescription className="text-base">{circuit.description}</CardDescription>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {circuit.activites.map((activite, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {activite}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full bg-nature-green hover:bg-nature-green/90 text-white">
                    <Link href={`/explorer?activite=NATURE&search=${encodeURIComponent(circuit.nom)}`}>
                      Réserver
                      <ArrowRight className="ml-2 h-4 w-4" />
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