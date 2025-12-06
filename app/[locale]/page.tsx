'use client'

import { useState, useEffect } from 'react'
import { Link } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  MapPin, 
  Star, 
  Users, 
  Waves,
  Building2,
  UtensilsCrossed,
  Trees,
  Landmark,
  ShoppingBag,
  Shield,
  Globe,
  CheckCircle2,
  ArrowRight,
  Sun,
  Building,
  UserCheck
} from 'lucide-react'

export default function HomePage() {
  const [currentBgIndex, setCurrentBgIndex] = useState(0)
  const [categoryImageIndices, setCategoryImageIndices] = useState<Record<number, number>>({})
  
  // Images de fond pour le carrousel
  const backgroundImages = Array.from({ length: 10 }, (_, i) => `/images/ba${i + 1}.png`)

  // Carrousel automatique des images de fond (hero)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length)
    }, 5000) // Change d'image toutes les 5 secondes

    return () => clearInterval(interval)
  }, [backgroundImages.length])

  // Carrousel automatique pour chaque catégorie (6 catégories)
  useEffect(() => {
    const intervals: NodeJS.Timeout[] = []
    const numberOfCategories = 6
    
    for (let index = 0; index < numberOfCategories; index++) {
      const interval = setInterval(() => {
        setCategoryImageIndices((prev) => ({
          ...prev,
          [index]: ((prev[index] || 0) + 1) % backgroundImages.length
        }))
      }, 4000 + (index * 200)) // Délai différent pour chaque catégorie pour éviter la synchronisation
      
      intervals.push(interval)
    }

    return () => {
      intervals.forEach(interval => clearInterval(interval))
    }
  }, [backgroundImages.length])

  const experiences = [
    {
      id: 1,
      title: 'Balade au lac Rose',
      location: 'Keur Massar, Dakar',
      price: '12 000 FCFA',
      rating: 4.8,
      guide: 'Amadou D.',
      image: '/experiences/lac-rose.jpg'
    },
    {
      id: 2,
      title: 'Safari Bandia',
      location: 'Réserve de Bandia',
      price: '25 000 FCFA',
      rating: 4.9,
      guide: 'Fatou S.',
      image: '/experiences/bandia.jpg'
    },
    {
      id: 3,
      title: 'Cooking class Thiéboudiène',
      location: 'Saint-Louis',
      price: '15 000 FCFA',
      rating: 4.7,
      guide: 'Mariama B.',
      image: '/experiences/cooking.jpg'
    },
    {
      id: 4,
      title: 'Cérémonie sabar',
      location: 'Dakar',
      price: '8 000 FCFA',
      rating: 4.6,
      guide: 'Ibrahima K.',
      image: '/experiences/sabar.jpg'
    },
    {
      id: 5,
      title: 'Excursion Gorée',
      location: 'Île de Gorée',
      price: '10 000 FCFA',
      rating: 4.9,
      guide: 'Ousmane D.',
      image: '/experiences/goree.jpg'
    },
    {
      id: 6,
      title: 'Kayak à Somone',
      location: 'Somone',
      price: '18 000 FCFA',
      rating: 4.8,
      guide: 'Aissatou N.',
      image: '/experiences/kayak.jpg'
    },
  ]


  const destinations = [
    { name: 'Dakar', image: '/destinations/dakar.jpg', count: '150+ offres' },
    { name: 'Saly', image: '/destinations/saly.jpg', count: '80+ offres' },
    { name: 'Saint-Louis', image: '/destinations/saint-louis.jpg', count: '70+ offres' },
    { name: 'Casamance', image: '/destinations/casamance.jpg', count: '90+ offres' },
    { name: 'Lompoul', image: '/destinations/lompoul.jpg', count: '40+ offres' },
    { name: 'Toubacouta', image: '/destinations/toubacouta.jpg', count: '35+ offres' },
  ]

  // Logos des collaborateurs
  const partners = [
    { id: 1, name: 'Partenaire 1', logo: '/logos/partner1.png' },
    { id: 2, name: 'Partenaire 2', logo: '/logos/partner2.png' },
    { id: 3, name: 'Partenaire 3', logo: '/logos/partner3.png' },
    { id: 4, name: 'Partenaire 4', logo: '/logos/partner4.png' },
    { id: 5, name: 'Partenaire 5', logo: '/logos/partner5.png' },
    { id: 6, name: 'Partenaire 6', logo: '/logos/partner6.png' },
    { id: 7, name: 'Partenaire 7', logo: '/logos/partner7.png' },
    { id: 8, name: 'Partenaire 8', logo: '/logos/partner8.png' },
    { id: 9, name: 'Partenaire 9', logo: '/logos/partner9.png' },
    { id: 10, name: 'Partenaire 10', logo: '/logos/partner10.png' },
  ]

  const categories = [
    {
      icon: Waves,
      title: 'Plages & îles',
      description: 'Découvrez les plus belles plages du Sénégal',
      color: 'bg-cap-blue',
      href: '/plages-iles'
    },
    {
      icon: Building2,
      title: 'Culture & religion',
      description: 'Immergez-vous dans la culture sénégalaise',
      color: 'bg-gradient-to-br from-purple-500 to-pink-500',
      href: '/culture-religion'
    },
    {
      icon: UtensilsCrossed,
      title: 'Gastronomie sénégalaise',
      description: 'Savourez les délices de la cuisine locale',
      color: 'bg-teranga-orange',
      href: '/gastronomie'
    },
    {
      icon: Trees,
      title: 'Nature & écotourisme',
      description: 'Explorez la nature préservée du Sénégal',
      color: 'bg-nature-green',
      href: '/nature-ecotourisme'
    },
    {
      icon: Landmark,
      title: 'Monuments & histoire',
      description: 'Découvrez le patrimoine historique',
      color: 'bg-gooteranga-orange-gradient',
      href: '/monuments-histoire'
    },
    {
      icon: ShoppingBag,
      title: 'Marché artisanal',
      description: 'Découvrez l\'artisanat local et les produits authentiques',
      color: 'bg-gooteranga-orange-gradient',
      href: '/marche-artisanal'
    },
  ]


  return (
    <div className="flex flex-col">
      {/* Section 1: Hero – Immersion directe */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Carrousel d'images de fond */}
        <div className="absolute inset-0">
          {backgroundImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
                index === currentBgIndex ? 'opacity-100 z-0' : 'opacity-0 z-0'
              }`}
              style={{
                backgroundImage: `url(${image})`,
              }}
            />
          ))}
          {/* Overlay gradient léger - Nature (vert) & Plage/Cours d'eau (bleu) */}
          <div className="absolute inset-0 bg-gradient-to-br from-nature-green/20 via-cap-blue/15 to-nature-green/20 z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent z-10"></div>
        </div>

        <div className="container relative z-20 py-24 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl animate-fade-in">
              Explorer le Sénégal
              <br />
              <span className="text-gooteranga-gradient bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#FFC342]">
                autrement
              </span>
            </h1>
            <p className="mt-6 text-xl leading-8 text-white/90 sm:text-2xl max-w-2xl mx-auto">
              Expériences locales, guides vérifiés et découvertes culturelles authentiques.
            </p>

            {/* Barre de recherche */}
            
          </div>
        </div>
      </section>

      {/* Section 2: Catégories principales */}
      <section className="mx-[10%] py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Explorez par catégorie
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Trouvez exactement ce que vous cherchez pour vivre une expérience inoubliable
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => {
            const currentImageIndex = categoryImageIndices[index] || 0
            return (
              <Link key={index} href={category.href}>
                <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-teranga-orange overflow-hidden h-full">
                  <div className="relative h-48 overflow-hidden">
                    {/* Carrousel d'images de fond */}
                    {backgroundImages.map((image, imgIndex) => (
                      <div
                        key={imgIndex}
                        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
                          imgIndex === currentImageIndex ? 'opacity-100 z-0' : 'opacity-0 z-0'
                        }`}
                        style={{
                          backgroundImage: `url(${image})`,
                        }}
                      />
                    ))}
                    {/* Overlay avec couleur de catégorie */}
                    <div className={`absolute inset-0 ${category.color} opacity-60 z-10`}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10"></div>
                    {/* Titre de la catégorie sur l'image */}
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <h3 className="text-2xl font-bold text-white drop-shadow-lg">{category.title}</h3>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl group-hover:text-teranga-orange transition-colors">
                      {category.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {category.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Section 3: Expériences populaires - Carrousel automatique infini */}
      <section className="bg-muted/50 py-16 md:py-24 overflow-hidden">
        <div className="mx-[10%]">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Expériences populaires
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Les meilleures expériences sélectionnées pour vous
              </p>
            </div>
            <Button asChild variant="outline" className="hidden md:flex">
              <Link href="/explorer">
                Voir tout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="relative w-full overflow-hidden">
          <div className="flex gap-6 animate-scroll-infinite">
            {/* Dupliquer les expériences pour créer l'effet de boucle infinie */}
            {[...experiences, ...experiences, ...experiences].map((exp, index) => (
              <Card 
                key={`${exp.id}-${index}`} 
                className="w-full min-w-[350px] max-w-[400px] flex-shrink-0 overflow-hidden group hover:shadow-xl transition-all duration-300"
              >
              <div className="relative h-64 bg-gooteranga-orange-gradient">
                <Badge className="absolute top-4 right-4 bg-white text-teranga-orange">Populaire</Badge>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{exp.title}</CardTitle>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{exp.rating}</span>
                      </div>
                    </div>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {exp.location}
                    </CardDescription>
                    <CardDescription className="text-sm">
                      Guide: {exp.guide}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-teranga-orange">{exp.price}</span>
                      <Button asChild className="bg-teranga-orange hover:bg-[#FFD700] text-white">
                        <Link href={`/experience/${exp.id}`}>
                          Réserver
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </section>

      {/* Section 4: Destinations en vedette */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* Image de fond pour toute la section */}
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/images/ba1.png)' }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40"></div>
        
        <div className="mx-[10%] relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-white">
              Destinations en vedette
            </h2>
            <p className="mt-4 text-lg text-white/90 max-w-2xl mx-auto">
              Découvrez les plus belles régions du Sénégal
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map((destination, index) => (
              <Link key={index} href={`/explorer?destination=${destination.name.toLowerCase()}`}>
                <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer h-full bg-white/95 backdrop-blur-sm">
                  <div className="relative h-64 bg-cover bg-center" style={{ backgroundImage: 'url(/images/ba1.png)' }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-bold text-white mb-1">{destination.name}</h3>
                      <p className="text-sm text-white/90">{destination.count}</p>
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Pourquoi GooTeranga ? */}
      <section className="bg-gradient-to-br from-[#FFF8E1] via-[#FFF9C4] to-[#FFE0B2] dark:from-orange-950 dark:via-yellow-950 dark:to-orange-900 py-16 md:py-24">
        <div className="mx-[10%]">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Pourquoi GooTeranga ?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Une plateforme de confiance pour explorer le Sénégal authentique
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { icon: UserCheck, title: 'Guides certifiés et vérifiés', description: 'Tous nos guides sont vérifiés et certifiés' },
              { icon: Shield, title: 'Expériences 100% locales', description: 'Vivez des moments authentiques avec les locaux' },
              { icon: CheckCircle2, title: 'Paiement sécurisé', description: 'Transactions protégées et sécurisées' },
              { icon: Globe, title: 'Multilingue', description: 'Disponible en français, anglais et arabe' },
              { icon: Users, title: 'Service client disponible', description: 'Support 24/7 pour vos besoins' },
            ].map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow border-2 hover:border-orange-300">
                  <CardHeader>
                    <div className="mx-auto w-16 h-16 rounded-full bg-teranga-orange flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{benefit.description}</CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Section 6: CTA "Devenir Guide" */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gooteranga-orange-gradient"></div>
        <div className="mx-[10%] relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Sun className="h-16 w-16 text-red-500 mx-auto mb-6 animate-pulse" />
            <h2 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl mb-6">
              Vous connaissez bien votre région ?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Devenez guide certifié et partagez votre passion pour le Sénégal avec des voyageurs du monde entier
            </p>
            <Button asChild size="lg" className="bg-white text-red-500 hover:bg-gray-100 text-lg px-8 py-6 h-auto shadow-xl font-semibold">
              <Link href="/signup?type=guide">
                <Sun className="mr-2 h-5 w-5 text-red-500" />
                Commencer maintenant
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Section 7: Ils nous font confiance */}
      <section className="bg-gradient-to-br from-[#FFF8E1] via-[#FFF9C4] to-[#FFE0B2] py-16 md:py-24 w-full">
        <div className="w-full">
          <div className="text-center mb-12 px-4">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
              Ils nous font confiance
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Nos partenaires et collaborateurs qui nous accompagnent dans cette aventure
            </p>
          </div>
          <div className="relative w-full overflow-hidden">
            <div className="flex gap-8 md:gap-12 animate-scroll-partners">
              {/* Dupliquer les logos pour créer l'effet de boucle infinie */}
              {[...partners, ...partners, ...partners].map((partner, index) => (
                <div
                  key={`${partner.id}-${index}`}
                  className="flex-shrink-0 flex items-center justify-center w-48 h-32 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6"
                >
                  <div className="w-full h-full flex items-center justify-center">
                    {/* Placeholder pour le logo - à remplacer par des images réelles */}
                    <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-teranga-orange/10 to-cap-blue/10 rounded-lg">
                      <Building className="h-12 w-12 text-teranga-orange opacity-50" />
                    </div>
                    {/* Décommenter quand vous aurez les vrais logos */}
                    {/* <Image
                      src={partner.logo}
                      alt={partner.name}
                      width={120}
                      height={60}
                      className="object-contain max-w-full max-h-full"
                    /> */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
