'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export function HtmlAttributes() {
  const pathname = usePathname()
  
  useEffect(() => {
    // Extraire la locale du pathname (ex: /fr/... ou /en/... ou /ar/...)
    const locale = pathname?.split('/')[1] || 'fr'
    const isRTL = locale === 'ar'
    
    // Mettre à jour les attributs html
    document.documentElement.lang = locale
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
  }, [pathname])
  
  return null
}




