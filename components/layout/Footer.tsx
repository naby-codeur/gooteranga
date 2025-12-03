'use client'

import { Link, usePathname, useRouter } from '@/i18n/routing'
import { Facebook, Instagram, Twitter, Youtube, Globe, MapPin, Compass, Hotel, UtensilsCrossed } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

export function Footer() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Logo et description */}
          <div className="space-y-4 lg:col-span-2">
            <Link href="/" className="inline-block">
            <h3 className="text-2xl font-bold text-gooteranga-gradient bg-clip-text bg-gradient-to-r from-[#FFC342] to-[#FFD700]">
              GooTeranga
            </h3>
            </Link>
            <p className="text-sm text-muted-foreground max-w-md">
              Explorez le Sénégal comme jamais auparavant. Découvrez, réservez et vivez des expériences inoubliables 
              avec nos guides locaux certifiés.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Youtube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Découvrir */}
          <div>
            <h4 className="mb-4 font-semibold text-base">Découvrir</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/explorer" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Destinations
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <Compass className="h-4 w-4" />
                  Guides & Expériences
                </Link>
              </li>
              <li>
                <Link href="/hebergements" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <Hotel className="h-4 w-4" />
                  Hébergements
                </Link>
              </li>
              <li>
                <Link href="/restaurants" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <UtensilsCrossed className="h-4 w-4" />
                  Restaurants
                </Link>
              </li>
            </ul>
          </div>

          {/* Entreprise */}
          <div>
            <h4 className="mb-4 font-semibold text-base">Entreprise</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/signup?type=guide" className="text-muted-foreground hover:text-primary transition-colors">
                  Devenir Guide
                </Link>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h4 className="mb-4 font-semibold text-base">Légal</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Conditions Générales d&apos;Utilisation
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Conditions Générales de Vente
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Politique de Confidentialité
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Section du bas */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              &copy; {new Date().getFullYear()} GooTeranga. Tous droits réservés.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Langue:</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8">
                    <Globe className="h-4 w-4 mr-2" />
                    Français
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => router.replace(pathname || '/', { locale: 'fr' })}>
                    🇫🇷 Français
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.replace(pathname || '/', { locale: 'en' })}>
                    🇬🇧 English
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.replace(pathname || '/', { locale: 'ar' })}>
                    🇸🇦 العربية
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
