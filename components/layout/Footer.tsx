'use client'

import { Link, usePathname, useRouter } from '@/i18n/routing'
import { useLocale } from 'next-intl'
import { Facebook, Instagram, Twitter, Youtube, Globe, MapPin, Compass, Hotel, UtensilsCrossed, Heart, Sparkles, Sun } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import Image from 'next/image'

export function Footer() {
  const pathname = usePathname()
  const router = useRouter()
  const locale = useLocale()

  const getLocaleLabel = (loc: string) => {
    switch (loc) {
      case 'fr':
        return '🇫🇷 Français'
      case 'en':
        return '🇬🇧 English'
      case 'ar':
        return '🇸🇦 العربية'
      case 'es':
        return '🇪🇸 Español'
      case 'it':
        return '🇮🇹 Italiano'
      case 'pt':
        return '🇵🇹 Português'
      case 'de':
        return '🇩🇪 Deutsch'
      default:
        return '🌐'
    }
  }

  return (
    <footer className="relative overflow-hidden border-t bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 dark:from-green-600 dark:via-yellow-600 dark:to-red-600">
      {/* Effet de particules animées en arrière-plan */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-300/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-orange-300/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-yellow-400/20 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="container relative z-10 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Logo et description */}
          <div className="space-y-6 lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Link href="/" className="inline-block group">
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    className="relative w-12 h-12"
                  >
                    <Image
                      src="/logo_gooteranga.png"
                      alt="GooTeranga Logo"
                      fill
                      className="object-contain"
                    />
                  </motion.div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-yellow-500 to-orange-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              GooTeranga
            </h3>
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="h-5 w-5 text-yellow-500" />
                  </motion.div>
                </div>
            </Link>
              <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              Explorez le Sénégal comme jamais auparavant. Découvrez, réservez et vivez des expériences inoubliables 
              avec nos guides locaux certifiés.
            </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Fait avec</span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                </motion.div>
                <span>au Sénégal</span>
                <Sun className="h-4 w-4 text-yellow-500 ml-1" />
              </div>
            </motion.div>
            
            {/* Réseaux sociaux avec animations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex gap-4"
            >
              {[
                { icon: Facebook, href: 'https://facebook.com', color: 'hover:text-blue-600', label: 'Facebook' },
                { icon: Instagram, href: 'https://instagram.com', color: 'hover:text-pink-600', label: 'Instagram' },
                { icon: Twitter, href: 'https://twitter.com', color: 'hover:text-blue-400', label: 'Twitter' },
                { icon: Youtube, href: 'https://youtube.com', color: 'hover:text-red-600', label: 'Youtube' },
              ].map((social, index) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                target="_blank" 
                rel="noopener noreferrer"
                    className={`relative p-3 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300 ${social.color} group`}
                    aria-label={social.label}
                    whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Icon className="h-5 w-5 text-muted-foreground group-hover:text-current transition-colors" />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400/20 to-yellow-400/20 opacity-0 group-hover:opacity-100 transition-opacity blur-sm"></div>
                  </motion.a>
                )
              })}
            </motion.div>
          </div>

          {/* Découvrir */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="mb-6 font-bold text-lg bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
              Découvrir
            </h4>
            <ul className="space-y-4 text-sm">
              {[
                { icon: MapPin, href: '/explorer', label: 'Destinations' },
                { icon: Compass, href: '/guides', label: 'Guides & Expériences' },
                { icon: Hotel, href: '/hebergements', label: 'Hébergements' },
                { icon: UtensilsCrossed, href: '/restaurants', label: 'Restaurants' },
              ].map((item, index) => {
                const Icon = item.icon
                return (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link 
                      href={item.href} 
                      className="group flex items-center gap-3 text-muted-foreground hover:text-orange-600 transition-all duration-300"
                    >
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ duration: 0.3 }}
                        className="p-1.5 rounded-lg bg-orange-100 dark:bg-orange-900/20 group-hover:bg-orange-200 dark:group-hover:bg-orange-900/40 transition-colors"
                      >
                        <Icon className="h-4 w-4" />
                      </motion.div>
                      <span className="group-hover:translate-x-1 transition-transform inline-block">{item.label}</span>
                </Link>
                  </motion.li>
                )
              })}
            </ul>
          </motion.div>

          {/* Entreprise */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="mb-6 font-bold text-lg bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
              Entreprise
            </h4>
            <ul className="space-y-4 text-sm">
              {[
                { href: '/about', label: 'À propos' },
                { href: '/contact', label: 'Contact' },
                { href: '/signup?type=guide', label: 'Devenir Guide' },
                { href: '#', label: 'FAQ' },
              ].map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  {item.href === '#' ? (
                    <a 
                      href={item.href} 
                      className="group flex items-center gap-2 text-muted-foreground hover:text-orange-600 transition-all duration-300"
                    >
                      <span className="group-hover:translate-x-1 transition-transform inline-block">{item.label}</span>
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.2 }}
                        className="text-orange-500 opacity-0 group-hover:opacity-100"
                      >
                        →
                      </motion.span>
                    </a>
                  ) : (
                    <Link 
                      href={item.href} 
                      className="group flex items-center gap-2 text-muted-foreground hover:text-orange-600 transition-all duration-300"
                    >
                      <span className="group-hover:translate-x-1 transition-transform inline-block">{item.label}</span>
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.2 }}
                        className="text-orange-500 opacity-0 group-hover:opacity-100"
                      >
                        →
                      </motion.span>
                </Link>
                  )}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Légal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="mb-6 font-bold text-lg bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
              Légal
            </h4>
            <ul className="space-y-4 text-sm">
              {[
                { href: '#', label: 'Conditions Générales d\'Utilisation' },
                { href: '#', label: 'Conditions Générales de Vente' },
                { href: '#', label: 'Politique de Confidentialité' },
              ].map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <a 
                    href={item.href} 
                    className="group flex items-center gap-2 text-muted-foreground hover:text-orange-600 transition-all duration-300"
                  >
                    <span className="group-hover:translate-x-1 transition-transform inline-block">{item.label}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Section du bas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-orange-200/50 dark:border-orange-800/50"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center md:items-start gap-2">
              <p className="text-sm text-muted-foreground text-center md:text-left">
                &copy; {new Date().getFullYear()} GooTeranga. Tous droits réservés.
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Propulsé par</span>
                <motion.span
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-orange-500 font-semibold"
                >
                  Teranga
                </motion.span>
                <Sun className="h-3 w-3 text-yellow-500" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden sm:inline">Langue:</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    suppressHydrationWarning
                  >
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-9 bg-white dark:bg-gray-800 border-orange-200 dark:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:border-orange-300 dark:hover:border-orange-700 transition-all"
                    >
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      >
                        <Globe className="h-4 w-4 mr-2 text-orange-600" />
                      </motion.div>
                      <span className="font-medium">{getLocaleLabel(locale)}</span>
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border-orange-200 dark:border-orange-800">
                  {[
                    { locale: 'fr', label: '🇫🇷 Français' },
                    { locale: 'en', label: '🇬🇧 English' },
                    { locale: 'ar', label: '🇸🇦 العربية' },
                    { locale: 'es', label: '🇪🇸 Español' },
                    { locale: 'it', label: '🇮🇹 Italiano' },
                    { locale: 'pt', label: '🇵🇹 Português' },
                    { locale: 'de', label: '🇩🇪 Deutsch' },
                  ].map((lang) => (
                    <DropdownMenuItem
                      key={lang.locale}
                      onClick={() => router.replace(pathname || '/', { locale: lang.locale as any })}
                      className="hover:bg-orange-50 dark:hover:bg-orange-900/20 cursor-pointer focus:bg-orange-50 dark:focus:bg-orange-900/20"
                    >
                      {lang.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
