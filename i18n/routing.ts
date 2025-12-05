import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'

export const routing = defineRouting({
  // Liste de toutes les locales supportées
  locales: ['fr', 'en', 'ar', 'es', 'pt', 'de', 'it'],

  // Utilisée lorsqu'aucune locale ne correspond
  defaultLocale: 'fr',
  
  // Toujours afficher le préfixe de locale dans l'URL
  localePrefix: 'always'
})

// Enveloppes légères autour des APIs de navigation de Next.js
// qui prendront en compte la configuration de routage
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing)


