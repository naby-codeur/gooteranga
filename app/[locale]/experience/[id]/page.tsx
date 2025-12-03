import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, MapPin, Share2, Heart, Check } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default async function ExperiencePage({ params }: { params: Promise<{ id: string; locale: string }> }) {
  await params; // params will be used later to fetch experience data
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <div className="relative h-96 rounded-lg overflow-hidden bg-gradient-to-br from-orange-300 to-yellow-300">
            <div className="absolute top-4 right-4 flex gap-2">
              <Button variant="secondary" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
              <Button variant="secondary" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Title and Info */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Expérience touristique exceptionnelle</h1>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>Dakar, Sénégal</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">4.8</span>
                    <span>(124 avis)</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge>Hébergement</Badge>
              <Badge variant="secondary">Plage</Badge>
              <Badge variant="secondary">Famille</Badge>
            </div>
          </div>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>À propos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Découvrez une expérience unique au cœur du Sénégal. Cette offre exceptionnelle 
                vous permet de vivre des moments inoubliables dans un cadre authentique et chaleureux.
                Profitez de nos services de qualité et de notre hospitalité légendaire.
              </p>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>Ce qui est inclus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {['Petit-déjeuner inclus', 'Wi-Fi gratuit', 'Parking disponible', 'Service 24/7'].map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card>
            <CardHeader>
              <CardTitle>Avis (124)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border-b last:border-0 pb-6 last:pb-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold">Nom du client {i}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= 5 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span>Il y a {i} semaine{i > 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground mt-2">
                      Excellent séjour ! Tout était parfait, je recommande vivement.
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl font-bold">15 000 FCFA</span>
                <span className="text-muted-foreground">/nuit</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">4.8</span>
                <span className="text-muted-foreground">(124 avis)</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Dates</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">Arrivée</Label>
                    <Input type="date" />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Départ</Label>
                    <Input type="date" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Voyageurs</Label>
                <Input type="number" placeholder="1" min="1" />
              </div>
              <Button className="w-full" size="lg">
                Réserver maintenant
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Vous ne serez pas débité pour le moment
              </p>
              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span>15 000 FCFA x 2 nuits</span>
                  <span>30 000 FCFA</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Frais de service</span>
                  <span>3 000 FCFA</span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t">
                  <span>Total</span>
                  <span>33 000 FCFA</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

