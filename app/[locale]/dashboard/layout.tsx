// Authentification désactivée pour le développement - accès direct avec données fictives
import React from 'react'

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  // Await params in Next.js 15+
  await params
  // Accès direct sans vérification d'authentification
  // Ne pas wrapper les enfants car les layouts enfants gèrent déjà leur propre structure
  return <>{children}</>
}

