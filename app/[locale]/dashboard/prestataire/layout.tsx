// Authentification désactivée pour le développement - accès direct avec données fictives
import React from 'react'

export default async function PrestataireLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  // Await params in Next.js 15+
  await params
  // Accès direct sans vérification d'authentification
  return <>{children}</>
}

