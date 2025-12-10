'use client'

import { Link } from '@/i18n/routing'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, MapPin, Landmark, Clock, BookOpen, ArrowLeft, ArrowRight } from 'lucide-react'
import Image from 'next/image'

export default function MonumentsHistoirePage() {

  // Monuments emblématiques
  const monuments = [
    {
      id: 1,
      nom: 'Monument de la Renaissance Africaine',
      description: 'Statue de bronze de 49 mètres, symbole de l\'Afrique émergente',
      lieu: 'Dakar',
      annee: 2010,
      image: '/images/ba1.png',
      rating: 4.7,
      type: 'Monument'
    },
    {
      id: 2,
      nom: 'Île de Gorée',
      description: 'Site classé au patrimoine mondial de l\'UNESCO, témoin de l\'histoire de la traite des esclaves',
      lieu: 'Gorée, Dakar',
      annee: 'XVIIe siècle',
      image: '/images/ba2.png',
      rating: 4.9,
      type: 'Patrimoine UNESCO'
    },
    {
      id: 3,
      nom: 'Musée des Civilisations Noires',
      description: 'Musée dédié aux civilisations africaines et à la diaspora',
      lieu: 'Dakar',
      annee: 2018,
      image: '/images/ba3.png',
      rating: 4.8,
      type: 'Musée'
    },
    {
      id: 4,
      nom: 'Place de l\'Indépendance',
      description: 'Place historique au cœur de Dakar',
      lieu: 'Dakar',
      annee: 'XIXe siècle',
      image: '/images/ba4.png',
      rating: 4.6,
      type: 'Place Historique'
    },
  ]

  // Lieux historiques par région
  const lieuxHistoriques = [
    {
      region: 'Dakar',
      lieux: [
        { nom: 'Maison des Esclaves', description: 'Mémorial de la traite des esclaves', type: 'Musée' },
        { nom: 'Fort d\'Estrées', description: 'Fort colonial français', type: 'Fort' },
        { nom: 'Palais Présidentiel', description: 'Résidence officielle du Président', type: 'Palais' },
      ]
    },
    {
      region: 'Saint-Louis',
      lieux: [
        { nom: 'Île de Saint-Louis', description: 'Ancienne capitale coloniale, classée UNESCO', type: 'Patrimoine UNESCO' },
        { nom: 'Pont Faidherbe', description: 'Pont historique reliant l\'île au continent', type: 'Pont' },
        { nom: 'Maison des Gouverneurs', description: 'Ancienne résidence des gouverneurs', type: 'Monument' },
      ]
    },
    {
      region: 'Thiès',
      lieux: [
        { nom: 'Musée de Thiès', description: 'Musée régional d\'histoire et de culture', type: 'Musée' },
        { nom: 'Gare de Thiès', description: 'Gare historique du chemin de fer', type: 'Gare' },
      ]
    },
    {
      region: 'Casamance',
      lieux: [
        { nom: 'Maison du Roi', description: 'Palais traditionnel en Casamance', type: 'Palais' },
        { nom: 'Fort de Ziguinchor', description: 'Fort colonial portugais', type: 'Fort' },
      ]
    },
  ]

  // Timeline de l'histoire du Sénégal
  const timeline = [
    {
      annee: 'XIe siècle',
      evenement: 'Empire du Ghana',
      description: 'Influence de l\'empire du Ghana sur le territoire sénégalais'
    },
    {
      annee: 'XIIIe siècle',
      evenement: 'Empire du Mali',
      description: 'Domination de l\'empire du Mali'
    },
    {
      annee: '1444',
      evenement: 'Arrivée des Portugais',
      description: 'Premiers contacts avec les Européens, début du commerce'
    },
    {
      annee: '1659',
      evenement: 'Fondation de Saint-Louis',
      description: 'Création du premier comptoir français en Afrique de l\'Ouest'
    },
    {
      annee: '1857',
      evenement: 'Fondation de Dakar',
      description: 'Création de la ville de Dakar par les Français'
    },
    {
      annee: '1895',
      evenement: 'Afrique-Occidentale Française',
      description: 'Intégration dans l\'AOF, Dakar devient la capitale'
    },
    {
      annee: '1960',
      evenement: 'Indépendance',
      description: 'Indépendance du Sénégal, Léopold Sédar Senghor premier Président'
    },
    {
      annee: '1980',
      evenement: 'Abdou Diouf',
      description: 'Abdou Diouf succède à Senghor'
    },
    {
      annee: '2000',
      evenement: 'Alternance',
      description: 'Élection d\'Abdoulaye Wade, première alternance démocratique'
    },
    {
      annee: '2012',
      evenement: 'Macky Sall',
      description: 'Élection de Macky Sall à la présidence'
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('/images/ba4.jpg')` }}
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
                <Landmark className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <Badge className="bg-white/20 backdrop-blur text-white border-white/30 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5">
                Monuments & Histoire
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              Monuments & Histoire
              <br />
              <span className="text-[#FFD700]">du Sénégal</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-2xl leading-relaxed">
              Découvrez le patrimoine historique du Sénégal. Des monuments emblématiques aux sites classés UNESCO, 
              plongez dans l&apos;histoire riche et fascinante de ce pays.
            </p>
          </div>
        </div>
      </section>

      {/* Section Monuments */}
      <section className="mx-[10%] py-16 md:py-24">
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
            Monuments Emblématiques
          </h2>
          <p className="text-lg text-muted-foreground">
            Les monuments qui symbolisent l&apos;histoire et l&apos;identité du Sénégal
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {monuments.map((monument) => (
            <Card key={monument.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="relative h-80">
                <Image
                  src={monument.image}
                  alt={monument.nom}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                <Badge className="absolute top-4 right-4 bg-[#FFC342] text-white">
                  {monument.type}
                </Badge>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{monument.nom}</h3>
                  <div className="flex items-center gap-2 text-white/90 text-sm mb-2">
                    <MapPin className="h-4 w-4" />
                    {monument.lieu}
                  </div>
                  <p className="text-white/90 mb-2">{monument.description}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-white">{monument.rating}</span>
                    </div>
                    <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                      {monument.annee}
                    </Badge>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <Button asChild className="w-full bg-[#FFC342] hover:bg-[#FFD700] text-white">
                  <Link href={`/explorer?activite=CULTURE&search=${encodeURIComponent(monument.nom)}`}>
                    Voir les visites guidées
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Section Lieux Historiques par Région */}
      <section className="bg-muted/50 py-16 md:py-24">
        <div className="mx-[10%]">
          <div className="mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
              Lieux Historiques par Région
            </h2>
            <p className="text-lg text-muted-foreground">
              Explorez le patrimoine historique à travers les régions du Sénégal
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {lieuxHistoriques.map((region, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-[#FFC342]" />
                    {region.region}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {region.lieux.map((lieu, lieuIdx) => (
                      <div key={lieuIdx} className="border-l-2 border-[#FFC342] pl-4">
                        <h4 className="font-semibold text-sm mb-1">{lieu.nom}</h4>
                        <p className="text-xs text-muted-foreground mb-2">{lieu.description}</p>
                        <Badge variant="outline" className="text-xs">
                          {lieu.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <Button asChild variant="outline" className="w-full mt-4 border-[#FFC342] text-[#FFC342] hover:bg-[#FFC342] hover:text-white">
                    <Link href={`/explorer?region=${region.region.toLowerCase()}&activite=CULTURE`}>
                      Explorer
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline de l'Histoire */}
      <section className="mx-[10%] py-16 md:py-24">
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Clock className="h-8 w-8 text-[#FFC342]" />
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Timeline de l&apos;Histoire du Sénégal
            </h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Les grandes dates qui ont marqué l&apos;histoire du Sénégal
          </p>
        </div>

        <div className="relative">
          {/* Ligne verticale */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-[#FFC342] hidden md:block"></div>

          <div className="space-y-8">
            {timeline.map((event, index) => (
              <div
                key={index}
                className={`relative flex items-start gap-6 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Point sur la ligne */}
                <div className="absolute left-6 md:left-1/2 w-4 h-4 bg-[#FFC342] rounded-full -translate-x-1/2 z-10"></div>

                {/* Contenu */}
                <Card className={`flex-1 ml-16 md:ml-0 ${index % 2 === 0 ? 'md:mr-auto md:w-5/12' : 'md:ml-auto md:w-5/12'}`}>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-[#FFC342] text-white">{event.annee}</Badge>
                    </div>
                    <CardTitle className="text-lg">{event.evenement}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{event.description}</CardDescription>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section CTA */}
      <section className="bg-gradient-to-br from-[#FFC342]/10 to-[#FFD700]/10 py-16 md:py-24">
        <div className="mx-[10%] text-center">
          <BookOpen className="h-16 w-16 text-[#FFC342] mx-auto mb-6" />
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
            Visites Guidées Historiques
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Découvrez l&apos;histoire du Sénégal avec nos guides certifiés
          </p>
          <Button asChild size="lg" className="bg-[#FFC342] hover:bg-[#FFD700] text-white text-lg px-8 py-6 h-auto">
            <Link href="/explorer?activite=CULTURE">
              Voir toutes les visites guidées
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
