'use client'

import { useEffect, useState } from 'react'
import { useLocale } from 'next-intl'
import { Link, usePathname, useRouter } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { Menu, User, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const locale = useLocale()
  const [scrolled, setScrolled] = useState(false)
  // Nécessaire pour éviter l'erreur d'hydratation avec Radix UI
  // Les composants Radix UI génèrent des IDs aléatoires qui diffèrent entre serveur et client
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Utiliser setTimeout pour éviter l'avertissement du linter tout en résolvant l'hydratation
    const timer = setTimeout(() => {
      setMounted(true)
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const getLocaleLabel = (loc: string) => {
    switch (loc) {
      case 'fr':
        return '🇫🇷 FR'
      case 'en':
        return '🇬🇧 EN'
      case 'ar':
        return '🇸🇦 AR'
      case 'es':
        return '🇪🇸 ES'
      case 'pt':
        return '🇵🇹 PT'
      case 'de':
        return '🇩🇪 DE'
      case 'it':
        return '🇮🇹 IT'
      default:
        return '🌐'
    }
  }

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled 
          ? 'bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 backdrop-blur-md border-b shadow-sm' 
          : 'bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 border-b border-transparent'
      }`}
    >
      <div className="flex h-14 sm:h-16 md:h-20 items-center justify-between px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 max-w-full overflow-hidden">
        {/* Zone gauche - Logo */}
        <div className="flex items-center flex-shrink-0 z-20 min-w-0">
          <Link 
            href="/" 
            className="flex items-center gap-1 sm:gap-1.5 md:gap-2 group transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <div className="relative w-[32px] h-[32px] sm:w-[40px] sm:h-[40px] md:w-[45px] md:h-[45px] lg:w-[50px] lg:h-[50px] flex-shrink-0 animate-pulse-slow">
              <Image
                src="/logo_gooteranga.png"
                alt="GooTeranga Logo"
                fill
                className="object-contain transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:rotate-12 group-hover:drop-shadow-lg group-hover:brightness-110"
                priority
                unoptimized
                sizes="(max-width: 640px) 32px, (max-width: 768px) 40px, (max-width: 1024px) 45px, 50px"
              />
            </div>
            <h5 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-orange-600 via-yellow-500 to-orange-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              GooTeranga
            </h5>
          
          </Link>
        </div>

        {/* Zone centrale - Navigation */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-6 flex-1 justify-center z-20 mx-2">
          <Link 
            href="/"
            className={`text-xs xl:text-sm font-medium transition-colors hover:text-orange-600 whitespace-nowrap ${
              pathname === '/' || pathname === `/${locale}` ? 'text-orange-600' : 'text-foreground'
            }`}
          >
            Accueil
          </Link>
          <Link 
            href="/explorer"
            className={`text-xs xl:text-sm font-medium transition-colors hover:text-orange-600 whitespace-nowrap ${
              pathname?.includes('/explorer') ? 'text-orange-600' : 'text-foreground'
            }`}
          >
            Explorer
          </Link>
          {mounted ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`flex items-center gap-1 text-xs xl:text-sm font-medium transition-colors hover:text-orange-600 whitespace-nowrap ${
                    pathname?.includes('/plages-iles') ||
                    pathname?.includes('/culture-religion') ||
                    pathname?.includes('/gastronomie') ||
                    pathname?.includes('/nature-ecotourisme') ||
                    pathname?.includes('/monuments-histoire') ||
                    pathname?.includes('/marche-artisanal')
                      ? 'text-orange-600' 
                      : 'text-foreground'
                  }`}
                >
                  Découvrir
                  <ChevronDown className="h-3 w-3 xl:h-4 xl:w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/plages-iles" className="cursor-pointer">
                    Plages & îles
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/culture-religion" className="cursor-pointer">
                    Culture & religion
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/gastronomie" className="cursor-pointer">
                    Gastronomie sénégalaise
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/nature-ecotourisme" className="cursor-pointer">
                    Nature & écotourisme
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/monuments-histoire" className="cursor-pointer">
                    Monuments & histoire
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/marche-artisanal" className="cursor-pointer">
                    Marché Artisanal
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button
              className={`flex items-center gap-1 text-xs xl:text-sm font-medium transition-colors hover:text-orange-600 whitespace-nowrap ${
                pathname?.includes('/plages-iles') ||
                pathname?.includes('/culture-religion') ||
                pathname?.includes('/gastronomie') ||
                pathname?.includes('/nature-ecotourisme') ||
                pathname?.includes('/monuments-histoire') ||
                pathname?.includes('/marche-artisanal')
                  ? 'text-orange-600' 
                  : 'text-foreground'
              }`}
            >
              Découvrir
              <ChevronDown className="h-3 w-3 xl:h-4 xl:w-4" />
            </button>
          )}
          <Link 
            href="/regions"
            className={`text-xs xl:text-sm font-medium transition-colors hover:text-orange-600 whitespace-nowrap ${
              pathname?.includes('/regions') ? 'text-orange-600' : 'text-foreground'
            }`}
          >
            Régions
          </Link>
          <Link 
            href="/about"
            className={`text-xs xl:text-sm font-medium transition-colors hover:text-orange-600 whitespace-nowrap ${
              pathname?.includes('/about') ? 'text-orange-600' : 'text-foreground'
            }`}
          >
            À propos
          </Link>
        </nav>

        {/* Zone droite - Actions */}
        <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 lg:gap-3 flex-shrink-0 z-20">
          
          {mounted ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-0.5 sm:gap-1 h-7 sm:h-8 md:h-9 px-1 sm:px-1.5 md:px-2 lg:px-3">
                  <span className="text-xs sm:text-sm md:text-base lg:text-lg">🌐</span>
                  <span className="hidden sm:inline text-[9px] sm:text-[10px] md:text-xs">{getLocaleLabel(locale as string)}</span>
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
                <DropdownMenuItem onClick={() => router.replace(pathname || '/', { locale: 'es' })}>
                  🇪🇸 Español
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.replace(pathname || '/', { locale: 'it' })}>
                  🇮🇹 Italiano
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.replace(pathname || '/', { locale: 'pt' })}>
                  🇵🇹 Português
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.replace(pathname || '/', { locale: 'de' })}>
                  🇩🇪 Deutsch
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="sm" className="gap-0.5 sm:gap-1 h-7 sm:h-8 md:h-9 px-1 sm:px-1.5 md:px-2 lg:px-3">
              <span className="text-xs sm:text-sm md:text-base lg:text-lg">🌐</span>
              <span className="hidden sm:inline text-[9px] sm:text-[10px] md:text-xs">{getLocaleLabel(locale as string)}</span>
            </Button>
          )}

          <Button asChild variant="outline" size="sm" className="hidden xl:flex whitespace-nowrap h-8 md:h-9 text-xs md:text-sm px-2 md:px-3">
            <Link href="/signup">
              S&apos;inscrire
            </Link>
          </Button>

          <Button 
            asChild
            variant="default" 
            size="sm"
            className="bg-teranga-orange hover:bg-[#FFD700] text-white border-0 shadow-md hover:shadow-lg transition-all font-semibold whitespace-nowrap text-[10px] sm:text-xs md:text-sm hidden md:flex h-8 md:h-9 px-2 md:px-3"
          >
           <Link href="/login">
              <User className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Connexion</span>
            </Link>
          </Button>

          {/* Menu mobile */}
          {mounted ? (
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9">
                  <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[280px] sm:w-[300px]">
              <nav className="flex flex-col gap-2 mt-6 sm:mt-8">
                <Link 
                  href="/"
                  className={`px-4 py-2 rounded-md transition-colors ${
                    pathname === '/' || pathname === `/${locale}` ? 'bg-orange-100 text-orange-600' : 'hover:bg-orange-50'
                  }`}
                >
                  Accueil
                </Link>
                <Link 
                  href="/explorer"
                  className={`px-4 py-2 rounded-md transition-colors ${
                    pathname?.includes('/explorer') ? 'bg-orange-100 text-orange-600' : 'hover:bg-orange-50'
                  }`}
                >
                  Explorer
                </Link>
                <div className="px-4 py-2">
                  <p className="text-sm font-medium mb-2">Découvrir</p>
                  <div className="flex flex-col gap-1 ml-2">
                    <Link 
                      href="/plages-iles"
                      className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                        pathname?.includes('/plages-iles') ? 'bg-orange-100 text-orange-600' : 'hover:bg-orange-50'
                      }`}
                    >
                      Plages & îles
                    </Link>
                    <Link 
                      href="/culture-religion"
                      className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                        pathname?.includes('/culture-religion') ? 'bg-orange-100 text-orange-600' : 'hover:bg-orange-50'
                      }`}
                    >
                      Culture & religion
                    </Link>
                    <Link 
                      href="/gastronomie"
                      className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                        pathname?.includes('/gastronomie') ? 'bg-orange-100 text-orange-600' : 'hover:bg-orange-50'
                      }`}
                    >
                      Gastronomie sénégalaise
                    </Link>
                    <Link 
                      href="/nature-ecotourisme"
                      className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                        pathname?.includes('/nature-ecotourisme') ? 'bg-orange-100 text-orange-600' : 'hover:bg-orange-50'
                      }`}
                    >
                      Nature & écotourisme
                    </Link>
                    <Link 
                      href="/monuments-histoire"
                      className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                        pathname?.includes('/monuments-histoire') ? 'bg-orange-100 text-orange-600' : 'hover:bg-orange-50'
                      }`}
                    >
                      Monuments & histoire
                    </Link>
                    <Link 
                      href="/marche-artisanal"
                      className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                        pathname?.includes('/marche-artisanal') ? 'bg-orange-100 text-orange-600' : 'hover:bg-orange-50'
                      }`}
                    >
                      Marché Artisanal
                    </Link>
                  </div>
                </div>
                <Link 
                  href="/regions"
                  className={`px-4 py-2 rounded-md transition-colors ${
                    pathname?.includes('/regions') ? 'bg-orange-100 text-orange-600' : 'hover:bg-orange-50'
                  }`}
                >
                  Régions
                </Link>
                <Link 
                  href="/about"
                  className={`px-4 py-2 rounded-md transition-colors ${
                    pathname?.includes('/about') ? 'bg-orange-100 text-orange-600' : 'hover:bg-orange-50'
                  }`}
                >
                  À propos
                </Link>
                <div className="pt-4 border-t mt-4">
                  <Button 
                    asChild
                    className="w-full bg-teranga-orange hover:bg-[#FFD700] text-white font-semibold mb-4"
                  >
                    <Link href="/signup?type=guide">
                      Devenir Guide
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full mb-4">
                    <Link href="/signup">
                      S&apos;inscrire
                    </Link>
                  </Button>
                  <Button asChild variant="default" className="w-full mb-4">
                    <Link href="/login">
                      <User className="mr-2 h-4 w-4" />
                      Connexion
                    </Link>
                  </Button>
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-2">Langue:</p>
                    {mounted ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="w-full justify-start">
                            <span className="text-lg mr-2">🌐</span>
                            {locale === 'fr' ? '🇫🇷 Français' : 
                             locale === 'en' ? '🇬🇧 English' : 
                             locale === 'ar' ? '🇸🇦 العربية' :
                             locale === 'es' ? '🇪🇸 Español' :
                             locale === 'it' ? '🇮🇹 Italiano' :
                             locale === 'pt' ? '🇵🇹 Português' :
                             locale === 'de' ? '🇩🇪 Deutsch' : '🌐'}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuItem onClick={() => router.replace(pathname || '/', { locale: 'fr' })}>
                            🇫🇷 Français
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.replace(pathname || '/', { locale: 'en' })}>
                            🇬🇧 English
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.replace(pathname || '/', { locale: 'ar' })}>
                            🇸🇦 العربية
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.replace(pathname || '/', { locale: 'es' })}>
                            🇪🇸 Español
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.replace(pathname || '/', { locale: 'it' })}>
                            🇮🇹 Italiano
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.replace(pathname || '/', { locale: 'pt' })}>
                            🇵🇹 Português
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.replace(pathname || '/', { locale: 'de' })}>
                            🇩🇪 Deutsch
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <Button variant="outline" className="w-full justify-start">
                        <span className="text-lg mr-2">🌐</span>
                        {locale === 'fr' ? '🇫🇷 Français' : 
                         locale === 'en' ? '🇬🇧 English' : 
                         locale === 'ar' ? '🇸🇦 العربية' :
                         locale === 'es' ? '🇪🇸 Español' :
                         locale === 'it' ? '🇮🇹 Italiano' :
                         locale === 'pt' ? '🇵🇹 Português' :
                         locale === 'de' ? '🇩🇪 Deutsch' : '🌐'}
                      </Button>
                    )}
                  </div>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
          ) : (
            <Button variant="ghost" size="icon" className="lg:hidden h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9">
              <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

