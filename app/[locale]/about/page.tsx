'use client'

import { Link } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Heart, 
  Globe, 
  Users, 
  Shield,
  Target,
  Award,
  MapPin,
  ArrowRight
} from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            À propos de GooTeranga
          </h1>
          <p className="text-xl sm:text-2xl text-orange-50 max-w-2xl mx-auto">
            Votre plateforme de référence pour découvrir et vivre le Sénégal authentique
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-orange-800 mb-4">Notre Mission</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Connecter les voyageurs avec les meilleures expériences touristiques du Sénégal
              tout en soutenant les prestataires locaux et en préservant notre patrimoine culturel.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="border-orange-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Target className="h-10 w-10 text-orange-500 mb-4" />
                <CardTitle>Notre Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Devenir la plateforme de référence pour le tourisme au Sénégal,
                  en mettant en avant la richesse culturelle et naturelle de notre pays.
                </p>
              </CardContent>
            </Card>

            <Card className="border-orange-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Heart className="h-10 w-10 text-orange-500 mb-4" />
                <CardTitle>Nos Valeurs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Authenticité, respect de la culture locale, soutien aux communautés,
                  et promotion d&apos;un tourisme responsable et durable.
                </p>
              </CardContent>
            </Card>

            <Card className="border-orange-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Award className="h-10 w-10 text-orange-500 mb-4" />
                <CardTitle>Notre Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Offrir une expérience exceptionnelle à nos utilisateurs tout en
                  contribuant au développement économique local.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-orange-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-orange-800 mb-12">
            Pourquoi choisir GooTeranga ?
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-orange-500 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Sécurité garantie</h3>
                <p className="text-muted-foreground">
                  Tous nos prestataires sont vérifiés et certifiés pour garantir
                  votre sécurité et votre tranquillité d&apos;esprit.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-orange-500 flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Expériences authentiques</h3>
                <p className="text-muted-foreground">
                  Découvrez le vrai Sénégal à travers des expériences authentiques
                  proposées par des locaux passionnés.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-orange-500 flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Communauté locale</h3>
                <p className="text-muted-foreground">
                  Soutenez directement les prestataires locaux et contribuez
                  au développement économique de nos régions.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-orange-500 flex items-center justify-center">
                  <Globe className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Plateforme multilingue</h3>
                <p className="text-muted-foreground">
                  Disponible en français, anglais et arabe pour accueillir
                  tous les voyageurs du monde entier.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-orange-800 mb-6">
            Prêt à découvrir le Sénégal ?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Explorez nos offres et réservez votre prochaine aventure dès maintenant.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-teranga-orange hover:bg-[#FFD700] text-white">
              <Link href="/explorer">
                Explorer les offres
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/signup?type=guide">
                Devenir prestataire
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

