'use client'

import { Link } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Hotel } from 'lucide-react'

export default function HebergementsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('/images/ba7.jpeg')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-teranga-orange/40 via-[#FFD700]/20 to-teranga-orange/40 z-10"></div>
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
              <div className="p-2 sm:p-3 bg-teranga-orange/20 backdrop-blur rounded-full">
                <Hotel className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <Badge className="bg-white/20 backdrop-blur text-white border-white/30 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5">
                Hébergements
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              Hébergements
              <br />
              <span className="text-[#FFD700]">au Sénégal</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-2xl leading-relaxed">
              Trouvez le logement parfait pour votre séjour au Sénégal. 
              Des hôtels de luxe aux auberges authentiques, découvrez l&apos;hospitalité sénégalaise.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="container mx-4 sm:mx-auto py-8 sm:py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <p className="text-base sm:text-lg text-muted-foreground mb-8 text-center">
            Contenu à venir - similaire à la page explorer mais filtré pour les hébergements
          </p>
        </div>
      </section>
    </div>
  )
}
