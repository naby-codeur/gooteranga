'use client'

import { useState, useEffect } from 'react'
import { Link } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Heart, 
  Globe, 
  Users, 
  Shield,
  Target,
  Award,
  MapPin,
  ArrowRight,
  Sparkles,
  Handshake,
  Lightbulb,
  Search,
  Calendar,
  Star,
  UserPlus,
  TrendingUp,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Music,
  CheckCircle2
} from 'lucide-react'
import Image from 'next/image'

export default function AboutPage() {
  const [currentBgIndex, setCurrentBgIndex] = useState(0)
  
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

  // Carrousel automatique des images de fond
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [backgroundImages.length])

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-50">
      {/* 1️⃣ Hero / Introduction */}
      <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[50vh] sm:min-h-[60vh] md:min-h-[70vh] flex items-center">
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
              }}
            />
          ))}
          {/* Overlay sombre pour améliorer la lisibilité */}
          <div className="absolute inset-0 bg-black/50 z-10"></div>
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/30 via-yellow-500/30 to-red-500/30 z-10"></div>
          {/* Overlay gradient du bas vers le haut pour le texte */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20 z-10"></div>
        </div>
        <div className="container mx-auto relative z-10 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 drop-shadow-lg px-2 animate-fade-in-up">
              Bienvenue dans l&apos;univers de GooTeranga
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-white/95 mb-3 sm:mb-4 drop-shadow-md max-w-3xl mx-auto px-2 animate-fade-in-up animation-delay-200">
              Explorez le Sénégal, découvrez ses trésors, connectez-vous à des prestataires locaux, vivez la vraie Teranga.
            </p>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-semibold text-yellow-200 drop-shadow-lg px-2 animate-fade-in-up animation-delay-400">
              &quot;La Teranga, digitale et accessible pour tous.&quot;
            </p>
          </div>
        </div>
      </section>

      {/* 2️⃣ Notre histoire */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-orange-800 mb-4 sm:mb-6 animate-fade-in">
              Notre histoire
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
            <div className="space-y-4 sm:space-y-6 order-2 md:order-1 animate-slide-in-left">
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                <strong className="text-orange-600">GooTeranga</strong> est né de l&apos;envie de connecter les voyageurs à la richesse culturelle, naturelle et artisanale du Sénégal. Nous voulions créer une plateforme simple, sécurisée et authentique pour découvrir le pays tout en soutenant les prestataires locaux.
              </p>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Le tourisme est un moteur de développement au Sénégal. GooTeranga facilite la réservation d&apos;activités et services sans complexité, tout en valorisant la culture locale.
              </p>
            </div>
            <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 rounded-xl overflow-hidden shadow-xl order-1 md:order-2 animate-slide-in-right group hover:scale-105 transition-transform duration-500">
              <Image
                src="/images/ba1.jpg"
                alt="Sénégal - Teranga"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, 50vw"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-br from-teranga-orange/40 via-yellow-400/30 to-orange-500/40 group-hover:opacity-60 transition-opacity duration-500"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 3️⃣ Notre mission */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#FFF8E1] via-[#FFF9C4] to-[#FFE0B2]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-orange-800 mb-4 sm:mb-6 animate-fade-in">
              Notre mission
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto px-4 animate-fade-in animation-delay-200">
              Connecter le monde au Sénégal authentique
            </p>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Pour les voyageurs */}
            <Card className="border-2 border-orange-200 hover:border-teranga-orange hover:shadow-xl transition-all duration-300 overflow-hidden animate-slide-in-up animation-delay-200 group hover:scale-105">
              <div className="relative h-40 sm:h-48 md:h-56 overflow-hidden">
                <Image
                  src="/images/ba2.jpg"
                  alt="Voyageurs au Sénégal"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/50 transition-all duration-500"></div>
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                  <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-teranga-orange flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 animate-pulse-slow">
                      <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg sm:text-xl md:text-2xl text-white">Pour les voyageurs</CardTitle>
                  </div>
                </div>
              </div>
              <CardContent className="pt-4 sm:pt-6">
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  Vous faire découvrir le Sénégal comme un local, avec des expériences authentiques et des prestataires fiables.
                </p>
              </CardContent>
            </Card>

            {/* Pour les prestataires */}
            <Card className="border-2 border-orange-200 hover:border-teranga-orange hover:shadow-xl transition-all duration-300 overflow-hidden animate-slide-in-up animation-delay-400 group hover:scale-105">
              <div className="relative h-40 sm:h-48 md:h-56 overflow-hidden">
                <Image
                  src="/images/ba3.webp"
                  alt="Prestataires locaux"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/50 transition-all duration-500"></div>
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                  <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-teranga-orange flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 animate-pulse-slow">
                      <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg sm:text-xl md:text-2xl text-white">Pour les prestataires</CardTitle>
                  </div>
                </div>
              </div>
              <CardContent className="pt-4 sm:pt-6">
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  Donner aux artisans, guides et entrepreneurs locaux une visibilité digitale et des outils pour booster leurs offres.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 4️⃣ Nos valeurs */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-orange-800 mb-4 sm:mb-6">
              Nos valeurs
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto px-4">
              Les principes qui guident notre action au quotidien
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
            {/* Teranga */}
            <Card className="text-center hover:shadow-xl transition-all duration-300 border-2 hover:border-teranga-orange animate-fade-in-up animation-delay-200 group hover:scale-105 hover:-translate-y-2">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="mx-auto w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-teranga-orange flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 animate-pulse-slow">
                  <Heart className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white group-hover:animate-bounce" />
                </div>
                <CardTitle className="text-base sm:text-lg group-hover:text-teranga-orange transition-colors">Teranga</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-sm sm:text-base">
                  Hospitalité et accueil chaleureux
                </CardDescription>
              </CardContent>
            </Card>

            {/* Authenticité */}
            <Card className="text-center hover:shadow-xl transition-all duration-300 border-2 hover:border-teranga-orange animate-fade-in-up animation-delay-300 group hover:scale-105 hover:-translate-y-2">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="mx-auto w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-teranga-orange flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 animate-pulse-slow">
                  <Award className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white group-hover:animate-bounce" />
                </div>
                <CardTitle className="text-base sm:text-lg group-hover:text-teranga-orange transition-colors">Authenticité</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-sm sm:text-base">
                  Expériences réelles et culturelles
                </CardDescription>
              </CardContent>
            </Card>

            {/* Innovation */}
            <Card className="text-center hover:shadow-xl transition-all duration-300 border-2 hover:border-teranga-orange animate-fade-in-up animation-delay-400 group hover:scale-105 hover:-translate-y-2">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="mx-auto w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-teranga-orange flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 animate-pulse-slow">
                  <Lightbulb className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white group-hover:animate-bounce" />
                </div>
                <CardTitle className="text-base sm:text-lg group-hover:text-teranga-orange transition-colors">Innovation</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-sm sm:text-base">
                  Réservation et boost digital simple et sécurisé
                </CardDescription>
              </CardContent>
            </Card>

            {/* Confiance */}
            <Card className="text-center hover:shadow-xl transition-all duration-300 border-2 hover:border-teranga-orange animate-fade-in-up animation-delay-500 group hover:scale-105 hover:-translate-y-2">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="mx-auto w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-teranga-orange flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 animate-pulse-slow">
                  <Shield className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white group-hover:animate-bounce" />
                </div>
                <CardTitle className="text-base sm:text-lg group-hover:text-teranga-orange transition-colors">Confiance</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-sm sm:text-base">
                  Transparence dans les échanges, sécurité des utilisateurs
                </CardDescription>
              </CardContent>
            </Card>

            {/* Partage */}
            <Card className="text-center hover:shadow-xl transition-all duration-300 border-2 hover:border-teranga-orange animate-fade-in-up animation-delay-600 group hover:scale-105 hover:-translate-y-2">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="mx-auto w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-teranga-orange flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 animate-pulse-slow">
                  <Handshake className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white group-hover:animate-bounce" />
                </div>
                <CardTitle className="text-base sm:text-lg group-hover:text-teranga-orange transition-colors">Partage</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-sm sm:text-base">
                  Soutenir les prestataires locaux et la communauté
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 5️⃣ Comment ça fonctionne */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#FFF8E1] via-[#FFF9C4] to-[#FFE0B2]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-orange-800 mb-4 sm:mb-6 animate-fade-in">
              Comment ça fonctionne
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto px-4 animate-fade-in animation-delay-200">
              Un processus simple et sécurisé pour tous
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
            {/* Pour les voyageurs */}
            <div className="animate-slide-in-left">
              <div className="relative h-40 sm:h-48 md:h-56 rounded-xl overflow-hidden shadow-lg mb-6 sm:mb-8 group hover:scale-105 transition-transform duration-500">
                <Image
                  src="/images/ba4.jpg"
                  alt="Voyageurs"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent group-hover:from-black/50 transition-all duration-500"></div>
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                  <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                    <div className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-full bg-teranga-orange flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 animate-pulse-slow">
                      <Users className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Voyageurs</h3>
                  </div>
                </div>
              </div>
              <div className="space-y-4 sm:space-y-6">
                <div className="flex gap-3 sm:gap-4 animate-fade-in-up animation-delay-300 group hover:translate-x-2 transition-transform duration-300">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-teranga-orange flex items-center justify-center text-white font-bold text-sm sm:text-base group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 animate-pulse-slow">
                      1
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 group-hover:text-teranga-orange transition-colors">Créez votre compte</h4>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Inscrivez-vous gratuitement pour accéder à toutes les fonctionnalités de la plateforme
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 sm:gap-4 animate-fade-in-up animation-delay-400 group hover:translate-x-2 transition-transform duration-300">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-teranga-orange flex items-center justify-center text-white font-bold text-sm sm:text-base group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 animate-pulse-slow">
                      2
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 group-hover:text-teranga-orange transition-colors">Découvrez et réservez</h4>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Parcourez les activités, séjours et expériences disponibles, puis réservez directement en ligne
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 sm:gap-4 animate-fade-in-up animation-delay-500 group hover:translate-x-2 transition-transform duration-300">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-teranga-orange flex items-center justify-center text-white font-bold text-sm sm:text-base group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 animate-pulse-slow">
                      3
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 group-hover:text-teranga-orange transition-colors">Vivez une expérience authentique</h4>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Profitez de moments inoubliables au cœur de la culture sénégalaise
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pour les prestataires */}
            <div className="animate-slide-in-right">
              <div className="relative h-40 sm:h-48 md:h-56 rounded-xl overflow-hidden shadow-lg mb-6 sm:mb-8 group hover:scale-105 transition-transform duration-500">
                <Image
                  src="/images/ba5.jpg"
                  alt="Prestataires"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent group-hover:from-black/50 transition-all duration-500"></div>
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                  <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                    <div className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-full bg-teranga-orange flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 animate-pulse-slow">
                      <UserPlus className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Prestataires</h3>
                  </div>
                </div>
              </div>
              <div className="space-y-4 sm:space-y-6">
                <div className="flex gap-3 sm:gap-4 animate-fade-in-up animation-delay-300 group hover:translate-x-2 transition-transform duration-300">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-teranga-orange flex items-center justify-center text-white font-bold text-sm sm:text-base group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 animate-pulse-slow">
                      1
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 group-hover:text-teranga-orange transition-colors">Inscrivez-vous et créez vos offres</h4>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Rejoignez la plateforme et présentez vos services de manière attractive
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 sm:gap-4 animate-fade-in-up animation-delay-400 group hover:translate-x-2 transition-transform duration-300">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-teranga-orange flex items-center justify-center text-white font-bold text-sm sm:text-base group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 animate-pulse-slow">
                      2
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 group-hover:text-teranga-orange transition-colors">Boostez votre visibilité</h4>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Utilisez nos outils pour augmenter votre présence digitale
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 sm:gap-4 animate-fade-in-up animation-delay-500 group hover:translate-x-2 transition-transform duration-300">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-teranga-orange flex items-center justify-center text-white font-bold text-sm sm:text-base group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 animate-pulse-slow">
                      3
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 group-hover:text-teranga-orange transition-colors">Connectez-vous à des voyageurs</h4>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Recevez des réservations de voyageurs motivés et passionnés
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7️⃣ Call to action */}
      <section className="relative py-16 sm:py-20 md:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Image de fond */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/images/ba6.jpg"
            alt="Prêt à découvrir le Sénégal"
            fill
            className="object-cover"
            sizes="100vw"
            priority={false}
          />
          {/* Overlay pour améliorer la lisibilité */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/80 via-yellow-500/80 to-red-500/80"></div>
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        <div className="container mx-auto relative z-10 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 drop-shadow-lg px-2 animate-fade-in-up">
              Prêt à découvrir le Sénégal ?
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 mb-6 sm:mb-8 drop-shadow-md px-2 animate-fade-in-up animation-delay-200">
              Rejoignez-nous dans cette aventure et vivez la Teranga authentique
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center">
              <Button asChild size="lg" className="bg-white text-teranga-orange hover:bg-gray-100 text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 h-auto shadow-xl font-semibold w-full sm:w-auto animate-fade-in-up animation-delay-300 hover:scale-105 hover:shadow-2xl transition-all duration-300 group">
                <Link href="/signup" className="flex items-center justify-center">
                  Créez votre compte gratuitement
                  <UserPlus className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white/10 border-2 border-white text-white hover:bg-white/20 text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 h-auto shadow-xl font-semibold w-full sm:w-auto animate-fade-in-up animation-delay-400 hover:scale-105 hover:shadow-2xl transition-all duration-300 group">
                <Link href="/explorer" className="flex items-center justify-center">
                  Découvrez nos offres au Sénégal
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 6️⃣ Notre équipe / Contact */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-orange-800 mb-4 sm:mb-6 animate-fade-in">
              Notre équipe
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto mb-6 sm:mb-8 px-4 animate-fade-in animation-delay-200">
              Notre équipe passionnée du tourisme et du digital travaille pour connecter le monde à la Teranga.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
            <Card className="text-center hover:shadow-xl transition-all duration-300 border-2 hover:border-teranga-orange animate-fade-in-up animation-delay-200 group hover:scale-105 hover:-translate-y-2">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-teranga-orange to-yellow-400 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 animate-pulse-slow">
                  <Users className="h-10 w-10 sm:h-12 sm:w-12 text-white group-hover:animate-bounce" />
                </div>
                <CardTitle className="text-base sm:text-lg md:text-xl group-hover:text-teranga-orange transition-colors">Équipe Technique</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-sm sm:text-base">
                  Développement et innovation continue de la plateforme
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 border-2 hover:border-teranga-orange animate-fade-in-up animation-delay-300 group hover:scale-105 hover:-translate-y-2">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-teranga-orange to-yellow-400 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 animate-pulse-slow">
                  <Handshake className="h-10 w-10 sm:h-12 sm:w-12 text-white group-hover:animate-bounce" />
                </div>
                <CardTitle className="text-base sm:text-lg md:text-xl group-hover:text-teranga-orange transition-colors">Équipe Partenariats</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-sm sm:text-base">
                  Accompagnement et soutien des prestataires locaux
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 border-2 hover:border-teranga-orange sm:col-span-2 md:col-span-1 animate-fade-in-up animation-delay-400 group hover:scale-105 hover:-translate-y-2">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-teranga-orange to-yellow-400 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 animate-pulse-slow">
                  <Heart className="h-10 w-10 sm:h-12 sm:w-12 text-white group-hover:animate-bounce" />
                </div>
                <CardTitle className="text-base sm:text-lg md:text-xl group-hover:text-teranga-orange transition-colors">Service Client</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-sm sm:text-base">
                  Support et assistance pour une expérience optimale
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Contact */}
          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-6 sm:p-8 md:p-12 border-2 border-orange-200">
            <div className="text-center mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-800 mb-3 sm:mb-4">
                Contactez-nous
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Une question ? Une suggestion ? N&apos;hésitez pas à nous contacter
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-4 sm:mb-6">
              <Button asChild variant="outline" size="lg" className="border-teranga-orange text-teranga-orange hover:bg-teranga-orange hover:text-white w-full sm:w-auto text-sm sm:text-base px-4 sm:px-6 py-3 sm:py-4">
                <Link href="/contact" className="flex items-center justify-center">
                  <Mail className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Formulaire de contact
              </Link>
            </Button>
            </div>
            <div className="flex justify-center gap-3 sm:gap-4">
              <Button variant="ghost" size="icon" className="h-10 w-10 sm:h-12 sm:w-12 rounded-full hover:bg-orange-100">
                <Facebook className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
              </Button>
              <Button variant="ghost" size="icon" className="h-10 w-10 sm:h-12 sm:w-12 rounded-full hover:bg-orange-100">
                <Twitter className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
              </Button>
              <Button variant="ghost" size="icon" className="h-10 w-10 sm:h-12 sm:w-12 rounded-full hover:bg-orange-100">
                <Instagram className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
              </Button>
              <Button variant="ghost" size="icon" className="h-10 w-10 sm:h-12 sm:w-12 rounded-full hover:bg-orange-100">
                <Music className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
