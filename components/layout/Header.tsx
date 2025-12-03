'use client'

import { useEffect, useState } from 'react'
import { useLocale } from 'next-intl'
import { Link, usePathname, useRouter } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { Menu, User } from 'lucide-react'
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
      default:
        return '🌐'
    }
  }

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled 
          ? 'bg-background/95 backdrop-blur-md border-b shadow-sm' 
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-full">
        {/* Zone gauche - Logo */}
        <div className="flex items-center flex-shrink-0 z-20">
          <Link 
            href="/" 
            className="flex items-center gap-2 group transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <div className="relative w-[45px] h-[45px] sm:w-[50px] sm:h-[50px] animate-pulse-slow">
              <Image
                src="/logo_gooteranga.png"
                alt="GooTeranga Logo"
                fill
                className="object-contain transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:rotate-12 group-hover:drop-shadow-lg group-hover:brightness-110"
                priority
                sizes="(max-width: 640px) 45px, 50px"
              />
            </div>
          </Link>
        </div>

        {/* Zone centrale - Navigation */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 flex-1 justify-center z-20">
          <Link 
            href="/"
            className={`text-sm font-medium transition-colors hover:text-orange-600 ${
              pathname === '/' || pathname === `/${locale}` ? 'text-orange-600' : 'text-foreground'
            }`}
          >
            Accueil
          </Link>
          <Link 
            href="/about"
            className={`text-sm font-medium transition-colors hover:text-orange-600 ${
              pathname?.includes('/about') ? 'text-orange-600' : 'text-foreground'
            }`}
          >
            À propos
          </Link>
          <Link 
            href="/blog"
            className={`text-sm font-medium transition-colors hover:text-orange-600 ${
              pathname?.includes('/blog') ? 'text-orange-600' : 'text-foreground'
            }`}
          >
            Blog
          </Link>
        </nav>

        {/* Zone droite - Actions */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 z-20">
          <Button 
            asChild
            variant="default" 
            size="sm"
            className="bg-teranga-orange hover:bg-[#FFD700] text-white border-0 shadow-md hover:shadow-lg transition-all font-semibold whitespace-nowrap text-xs sm:text-sm hidden sm:flex"
          >
            <Link href="/signup?type=guide">
              Devenir Guide
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1 sm:gap-2 h-9 px-2 sm:px-3">
                <span className="text-base sm:text-lg">🌐</span>
                <span className="hidden sm:inline text-xs">{getLocaleLabel(locale as string)}</span>
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

          <Button asChild variant="outline" size="sm" className="hidden lg:flex whitespace-nowrap">
            <Link href="/signup">
              S&apos;inscrire
            </Link>
          </Button>

          <Button asChild variant="default" size="sm" className="hidden lg:flex whitespace-nowrap">
            <Link href="/login">
              <User className="mr-2 h-4 w-4" />
              Connexion
            </Link>
          </Button>

          {/* Menu mobile */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[300px]">
              <nav className="flex flex-col gap-2 mt-8">
                <Link 
                  href="/"
                  className={`px-4 py-2 rounded-md transition-colors ${
                    pathname === '/' || pathname === `/${locale}` ? 'bg-orange-100 text-orange-600' : 'hover:bg-orange-50'
                  }`}
                >
                  Accueil
                </Link>
                <Link 
                  href="/about"
                  className={`px-4 py-2 rounded-md transition-colors ${
                    pathname?.includes('/about') ? 'bg-orange-100 text-orange-600' : 'hover:bg-orange-50'
                  }`}
                >
                  À propos
                </Link>
                <Link 
                  href="/blog"
                  className={`px-4 py-2 rounded-md transition-colors ${
                    pathname?.includes('/blog') ? 'bg-orange-100 text-orange-600' : 'hover:bg-orange-50'
                  }`}
                >
                  Blog
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <span className="text-lg mr-2">🌐</span>
                          {locale === 'fr' ? '🇫🇷 Français' : locale === 'en' ? '🇬🇧 English' : '🇸🇦 العربية'}
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
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

