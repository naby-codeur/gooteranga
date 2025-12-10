'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
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
  UserCheck
} from 'lucide-react'

export default function HomePage() {
  const [currentBgIndex, setCurrentBgIndex] = useState(0)
  const [categoryImageIndices, setCategoryImageIndices] = useState<Record<number, number>>({})
  const [featuredDestinationIndex, setFeaturedDestinationIndex] = useState(0)
  const [heroMessageIndex, setHeroMessageIndex] = useState(0)
  

  // Images de fond pour le carrousel (ba1 à ba10)
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

  const heroMessages = [
    'GooTeranga, votre guide vers l’authentique',
    'Explorez, vibrez, vivez la Teranga',
    'Découvrez la vraie essence de la Teranga',
    'Découvrez les trésors du Sénégal, guidés par la Teranga',
    'La plateforme qui connecte vos offres au monde entier',
    'Donnez vie à vos services, le monde vous attend',
    'La Teranga, digitalisée pour le monde',
    'L’expérience Sénégalaise à portée de main.',
  ]

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

  // Carrousel automatique pour les destinations en vedette (10 images)
  useEffect(() => {
    const interval = setInterval(() => {
      setFeaturedDestinationIndex((prev) => (prev + 1) % backgroundImages.length)
    }, 4000) // Change d'image toutes les 4 secondes

    return () => clearInterval(interval)
  }, [backgroundImages.length])

  // Carrousel automatique des messages du hero
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroMessageIndex((prev) => (prev + 1) % heroMessages.length)
    }, 3500)

    return () => clearInterval(interval)
  }, [heroMessages.length])

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



  // Logos des collaborateurs
  const partners = [
    { id: 1, name: 'Partenaire 1', logo: '/images/logo_gooteranga.png' },
    { id: 2, name: 'Partenaire 2', logo: '/images/logo_gooteranga.png' },
    { id: 3, name: 'Partenaire 3', logo: '/images/logo_gooteranga.png' },
    { id: 4, name: 'Partenaire 4', logo: '/images/logo_gooteranga.png' },
    { id: 5, name: 'Partenaire 5', logo: '/images/logo_gooteranga.png' },
    { id: 6, name: 'Partenaire 6', logo: '/images/logo_gooteranga.png' },
    { id: 7, name: 'Partenaire 7', logo: '/images/logo_gooteranga.png' },
    { id: 8, name: 'Partenaire 8', logo: '/images/logo_gooteranga.png' },
    { id: 9, name: 'Partenaire 9', logo: '/images/logo_gooteranga.png' },
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
      <section className="relative min-h-[85vh] sm:min-h-[90vh] w-full flex items-center justify-center overflow-hidden">
        {/* Carrousel d'images de fond */}
        <div className="absolute inset-0 w-full h-full">
          {backgroundImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                index === currentBgIndex ? 'opacity-100 z-0' : 'opacity-0 z-0'
              }`}
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                width: '100%',
                height: '100%',
                minHeight: '100%',
              }}
            />
          ))}
          {/* Overlay sombre pour améliorer la lisibilité */}
          <div className="absolute inset-0 bg-black/50 z-10"></div>
          {/* Overlay gradient léger - Nature (vert) & Plage/Cours d'eau (bleu) */}
          <div className="absolute inset-0 bg-gradient-to-br from-nature-green/20 via-cap-blue/15 to-nature-green/20 z-10"></div>
          {/* Overlay gradient du bas vers le haut pour le texte */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/20 z-10"></div>
        </div>

        <div className="container relative z-20 py-8 sm:py-12 md:py-16 lg:py-24 xl:py-32 px-4 sm:px-6">
          <div className="mx-auto max-w-4xl text-center">
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl 3xl:text-8xl tracking-tight animate-fade-in px-2 sm:px-4">
              <span className="text-rainbow-gradient animate-shimmer">
                Bienvenue au pays de
                <br />
                la Teranga
              </span>
            </h3>
            <div className="relative h-14 sm:h-16 md:h-20 lg:h-24 mt-3 sm:mt-4 md:mt-6 lg:mt-8">
              {heroMessages.map((message, index) => (
                <div
                  key={message}
                  className={`absolute inset-0 flex items-center justify-center px-3 sm:px-4 md:px-6 transition-all duration-700 ease-in-out ${
                    index === heroMessageIndex ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-semibold text-white drop-shadow-lg text-balance leading-tight sm:leading-normal">
                    {message}
                  </p>
                </div>
              ))}
            </div>

            {/* Barre de recherche */}
            
          </div>
        </div>
      </section>

      {/* Section 2: Catégories principales */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight px-2">
            Explorez par catégorie
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Trouvez exactement ce que vous cherchez pour vivre une expérience inoubliable
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => {
            const currentImageIndex = categoryImageIndices[index] || 0
            return (
              <Link key={index} href={category.href}>
                <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-teranga-orange overflow-hidden h-full">
                  <div className="relative h-40 sm:h-48 overflow-hidden">
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
                    <div className="absolute inset-0 flex items-center justify-center z-20 px-2">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white drop-shadow-lg transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:scale-105 text-center">
                        {category.title}
                      </h3>
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
      <section className="bg-muted/50 py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-10 md:mb-12 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                Expériences populaires
              </h2>
              <p className="mt-2 sm:mt-4 text-sm sm:text-base md:text-lg text-muted-foreground">
                Les meilleures expériences sélectionnées pour vous
              </p>
            </div>
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/explorer">
                Voir tout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="relative w-full overflow-hidden">
          <div className="flex gap-4 sm:gap-6 animate-scroll-infinite">
            {/* Dupliquer les expériences pour créer l'effet de boucle infinie */}
            {[...experiences, ...experiences, ...experiences].map((exp, index) => (
              <Card 
                key={`${exp.id}-${index}`} 
                className="w-full min-w-[260px] xs:min-w-[280px] sm:min-w-[300px] md:min-w-[320px] lg:min-w-[350px] max-w-[400px] flex-shrink-0 overflow-hidden group hover:shadow-xl transition-all duration-300"
              >
              <div className="relative h-48 sm:h-56 md:h-64 bg-gooteranga-orange-gradient">
                <Badge className="absolute top-4 right-4 bg-white text-teranga-orange">Populaire</Badge>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                  </div>
                  <CardHeader className="p-4 sm:p-6">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base sm:text-lg flex-1">{exp.title}</CardTitle>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs sm:text-sm font-medium">{exp.rating}</span>
                      </div>
                    </div>
                    <CardDescription className="flex items-center gap-1 text-xs sm:text-sm">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{exp.location}</span>
                    </CardDescription>
                    <CardDescription className="text-xs sm:text-sm">
                      Guide: {exp.guide}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <span className="text-xl sm:text-2xl font-bold text-teranga-orange">{exp.price}</span>
                      <Button asChild size="sm" className="bg-teranga-orange hover:bg-[#FFD700] text-white w-full sm:w-auto">
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
      <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden flex items-center justify-center px-4">
        <div className="w-full flex items-center justify-center">
          <div className="relative w-full sm:w-[90%] md:w-[86%] h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[86vh] max-h-[800px] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl">
            {/* Carrousel d'images automatique */}
            {backgroundImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
                  index === featuredDestinationIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
                style={{
                  backgroundImage: `url(${image})`,
                }}
              />
            ))}
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50 z-20"></div>
            
            {/* Contenu centré */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-30 text-center px-4 sm:px-6">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold tracking-tight text-white mb-3 sm:mb-4 drop-shadow-lg px-2">
                Destinations en vedette
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 max-w-2xl mb-4 sm:mb-6 drop-shadow-md px-2">
                Découvrez les plus belles régions du Sénégal
              </p>
              
              {/* Bouton Consulter */}
              <Button asChild size="lg" className="bg-white text-teranga-orange hover:bg-orange-50 text-sm sm:text-base md:text-lg px-6 sm:px-8 py-4 sm:py-6 h-auto shadow-xl font-semibold">
                <Link href="/regions">
                  Consulter
                </Link>
              </Button>
              
              {/* Indicateurs de pagination */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-40">
                {backgroundImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setFeaturedDestinationIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === featuredDestinationIndex
                        ? 'w-8 bg-white'
                        : 'w-2 bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`Aller à l'image ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Pourquoi GooTeranga ? */}
      <section className="bg-gradient-to-br from-[#FFF8E1] via-[#FFF9C4] to-[#FFE0B2] dark:from-orange-950 dark:via-yellow-950 dark:to-orange-900 py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight px-2">
              Pourquoi GooTeranga ?
            </h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Une plateforme de confiance pour explorer le Sénégal authentique
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { icon: UserCheck, title: 'Guides certifiés et vérifiés', description: 'Tous nos guides sont vérifiés et certifiés' },
              { icon: Shield, title: 'Expériences 100% locales', description: 'Vivez des moments authentiques avec les locaux' },
              { icon: CheckCircle2, title: 'Paiement sécurisé', description: 'Transactions protégées et sécurisées' },
              { icon: Globe, title: 'Multilingue', description: 'Disponible en plusieurs langues internationales' },
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
      <section className="relative py-12 sm:py-16 md:py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gooteranga-orange-gradient"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Sun className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-red-500 mx-auto mb-4 sm:mb-6 animate-pulse" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 px-2">
              Vous connaissez bien votre région ?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Devenez guide certifié et partagez votre passion pour le Sénégal avec des voyageurs du monde entier
            </p>
            <Button asChild size="lg" className="bg-white text-red-500 hover:bg-gray-100 text-sm sm:text-base md:text-lg px-6 sm:px-8 py-4 sm:py-6 h-auto shadow-xl font-semibold">
              <Link href="/signup?type=guide">
                <Sun className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                Commencer maintenant
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Section 7: Ils nous font confiance */}
      <section className="bg-gradient-to-br from-[#FFF8E1] via-[#FFF9C4] to-[#FFE0B2] py-12 sm:py-16 md:py-20 lg:py-24 w-full">
        <div className="w-full">
          <div className="text-center mb-8 sm:mb-10 md:mb-12 px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3 sm:mb-4">
              Ils nous font confiance
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Nos partenaires et collaborateurs qui nous accompagnent dans cette aventure
            </p>
          </div>
          <div className="relative w-full overflow-hidden">
            <div className="flex gap-4 sm:gap-6 md:gap-8 lg:gap-12 animate-scroll-partners">
              {/* Dupliquer les logos pour créer l'effet de boucle infinie */}
              {[...partners, ...partners, ...partners].map((partner, index) => (
                <div
                  key={`${partner.id}-${index}`}
                  className="flex-shrink-0 flex items-center justify-center w-36 h-24 sm:w-40 sm:h-28 md:w-48 md:h-32 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-4 sm:p-5 md:p-6"
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <Image
                      src="/logo_gooteranga.png"
                      alt={partner.name}
                      width={120}
                      height={60}
                      className="object-contain max-w-full max-h-full"
                    />
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
