'use client'

import { useState, useEffect } from 'react'
import { Link } from '@/i18n/routing'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, MapPin, UserCheck, ArrowLeft, Shield, Award } from 'lucide-react'
import Image from 'next/image'

export default function GuidesPage() {
  const [currentBgIndex, setCurrentBgIndex] = useState(0)
  const backgroundImages = Array.from({ length: 10 }, (_, i) => `/images/ba${i + 1}.png`)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [backgroundImages.length])

  const guides = [
    {
      id: 1,
      nom: 'Amadou Diallo',
      specialite: 'Guide Culturel & Historique',
      description: 'Guide certifié avec 10 ans d\'expérience, spécialisé dans l\'histoire et la culture sénégalaise',
      lieu: 'Dakar',
      rating: 4.9,
      nombreAvis: 127,
      langues: ['Français', 'Anglais', 'Wolof'],
      prix: '15000',
      image: '/images/ba6.png',
      certifications: ['Guide Certifié', 'UNESCO']
    },
    {
      id: 2,
      nom: 'Fatou Sarr',
      specialite: 'Guide Nature & Écotourisme',
      description: 'Passionnée de nature, je vous emmène découvrir les parcs nationaux et réserves du Sénégal',
      lieu: 'Tambacounda',
      rating: 4.8,
      nombreAvis: 89,
      langues: ['Français', 'Anglais', 'Pulaar'],
      prix: '18000',
      image: '/images/ba7.png',
      certifications: ['Guide Nature', 'Écotourisme']
    },
    {
      id: 3,
      nom: 'Ibrahima Kane',
      specialite: 'Guide Gastronomie & Marchés',
      description: 'Découvrez la cuisine sénégalaise authentique avec un guide local expérimenté',
      lieu: 'Saint-Louis',
      rating: 4.7,
      nombreAvis: 156,
      langues: ['Français', 'Wolof', 'Arabe'],
      prix: '12000',
      image: '/images/ba8.png',
      certifications: ['Guide Culinaire']
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
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
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFC342]/30 via-[#FFD700]/20 to-[#FFC342]/30 z-10"></div>
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
              <div className="p-3 bg-[#FFC342]/20 backdrop-blur rounded-full">
                <UserCheck className="h-8 w-8 text-white" />
              </div>
              <Badge className="bg-white/20 backdrop-blur text-white border-white/30">
                Guides Locaux Certifiés
              </Badge>
            </div>
            <h1 className="text-5xl font-bold text-white sm:text-6xl md:text-7xl mb-6">
              Guides Locaux
              <br />
              <span className="text-[#FFD700]">Certifiés</span>
            </h1>
            <p className="text-xl text-white/90 sm:text-2xl max-w-2xl">
              Vivez des expériences authentiques avec nos guides locaux certifiés. 
              Découvrez le Sénégal à travers les yeux de ceux qui le connaissent le mieux.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-[10%] py-16 md:py-24">
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
            Nos Guides
          </h2>
          <p className="text-lg text-muted-foreground">
            Rencontrez nos guides certifiés et expérimentés, prêts à vous faire découvrir le Sénégal
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => (
            <Card key={guide.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="relative h-64 bg-gooteranga-orange-gradient">
                <Image
                  src={guide.image}
                  alt={guide.nom}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <Badge className="bg-white/90 text-teranga-orange">
                    <Shield className="h-3 w-3 mr-1" />
                    Certifié
                  </Badge>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-bold text-white mb-1">{guide.nom}</h3>
                  <p className="text-sm text-white/90">{guide.specialite}</p>
                </div>
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{guide.rating}</span>
                    <span className="text-xs text-muted-foreground ml-1">({guide.nombreAvis} avis)</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4" />
                  {guide.lieu}
                </div>
                <CardDescription className="text-base">{guide.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Langues parlées:</p>
                  <div className="flex flex-wrap gap-2">
                    {guide.langues.map((langue, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {langue}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Certifications:</p>
                  <div className="flex flex-wrap gap-2">
                    {guide.certifications.map((cert, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        <Award className="h-3 w-3 mr-1" />
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-teranga-orange">{guide.prix}</span>
                    <span className="text-sm text-muted-foreground ml-1">FCFA/jour</span>
                  </div>
                </div>
                <Button asChild className="w-full bg-gooteranga-orange-gradient hover:opacity-90 text-white">
                  <Link href={`/guide/${guide.id}`}>
                    Voir le profil
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
