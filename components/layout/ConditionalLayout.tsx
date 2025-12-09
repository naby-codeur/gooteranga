'use client'

import { usePathname } from '@/i18n/routing'
import { Header } from './Header'
import { Footer } from './Footer'
import { TerangaChatbot } from '@/components/chatbot/TerangaChatbot'

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isDashboard = pathname?.includes('/dashboard')

  if (isDashboard) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <TerangaChatbot />
    </div>
  )
}


