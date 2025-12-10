'use client'

import { Link } from '@/i18n/routing'
import { Facebook, Instagram, Twitter, UtensilsCrossed, Heart, Sparkles, Sun, Waves, Church, Leaf, Landmark, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import Image from 'next/image'

export function Footer() {

  return (
    <footer className="relative overflow-hidden border-t bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 dark:from-green-600 dark:via-yellow-600 dark:to-red-600">
      {/* Effet de particules animées en arrière-plan */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-300/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-orange-300/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-yellow-400/20 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="container relative z-10 py-8 sm:py-10 md:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-7 justify-items-center max-w-7xl mx-auto">
          {/* Logo et description */}
          <div className="space-y-6 lg:col-span-2 text-center lg:text-left w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Link href="/" className="inline-block group">
                <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
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
              <p className="text-sm max-w-md leading-relaxed mx-auto lg:mx-0">
              Explorez le Sénégal comme jamais auparavant. Découvrez, réservez et vivez des expériences inoubliables 
              avec nos guides locaux certifiés.
            </p>
              <div className="flex items-center justify-center lg:justify-start gap-2 text-sm ">
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
              className="flex gap-4 justify-center lg:justify-start"
            >
              {[
                { icon: Facebook, href: 'https://facebook.com', color: 'hover:text-blue-600', label: 'Facebook' },
                { icon: Instagram, href: 'https://instagram.com', color: 'hover:text-pink-600', label: 'Instagram' },
                { icon: Twitter, href: 'https://twitter.com', color: 'hover:text-blue-400', label: 'Twitter' },
                {                href: 'https://tiktok.com', color: 'hover:text-black dark:hover:text-white', label: 'TikTok',
                },
              ].map((social, index) => {
                const Icon = 'icon' in social ? social.icon : null
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
                    {Icon ? (
                      <Icon className="h-5 w-5 text-muted-foreground group-hover:text-current transition-colors" />
                    ) : (
                      <svg className="h-5 w-5 text-muted-foreground group-hover:text-current transition-colors" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                      </svg>
                    )}
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
            className="lg:col-span-2 text-center lg:text-left w-full"
          >
            <h4 className="mb-6 font-bold text-lg bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
              Découvrir
            </h4>
            <ul className="space-y-4 text-sm">
              {[
                { icon: Waves, href: '/plages-iles', label: 'Plages & îles' },
                { icon: Church, href: '/culture-religion', label: 'Culture & religion' },
                { icon: UtensilsCrossed, href: '/gastronomie', label: 'Gastronomie sénégalaise' },
                { icon: Leaf, href: '/nature-ecotourisme', label: 'Nature & écotourisme' },
                { icon: Landmark, href: '/monuments-histoire', label: 'Monuments & histoire' },
                { icon: ShoppingBag, href: '/marche-artisanal', label: 'Marché Artisanal' },
              ].map((item, index) => {
                const Icon = item.icon
                return (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex justify-center lg:justify-start"
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
            className="text-center lg:text-left w-full"
          >
            <h4 className="mb-6 font-bold text-lg bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
              Entreprise
            </h4>
            <ul className="space-y-4 text-sm">
              {[
                { href: '/', label: 'Accueil' },
                { href: '/about', label: 'À propos' },
                { href: '/regions', label: 'Régions' },
                { href: '/explorer', label: 'Explorer' },
                { href: '/dashboard/admin?section=support', label: 'Contact' },
                { href: '/signup?type=guide', label: 'Devenir Guide' },
              ].map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex justify-center lg:justify-start"
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
            className="lg:col-span-2 text-center lg:text-left w-full"
          >
            <h4 className="mb-6 font-bold text-lg bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
              Légal
            </h4>
            <ul className="space-y-4 text-sm ">
              {[
                { href: '/cgu-page', label: 'Conditions Générales d\'Utilisation' },
                { href: '/cgv-page', label: 'Conditions Générales de Vente' },
                { href: '/pc-page', label: 'Politique de Confidentialité' },
              ].map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex justify-center lg:justify-start"
                >
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
          className="mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8 border-t border-orange-200/50 dark:border-orange-800/50"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="flex flex-col items-center md:items-start gap-2">
              <p className="text-xs sm:text-sm text-muted-foreground text-center md:text-left">
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
            <div className="flex items-center gap-2 sm:gap-4">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    suppressHydrationWarning>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 sm:h-9 bg-white dark:bg-gray-800 border-orange-200 dark:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:border-orange-300 dark:hover:border-orange-700 transition-all text-xs sm:text-sm"
                    >
                      <span className="font-medium truncate max-w-[200px] sm:max-w-none">gooteranga92@gmail.com</span>
                    </Button>
                </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
