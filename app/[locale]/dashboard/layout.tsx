// Authentification désactivée pour le développement - accès direct avec données fictives

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
  return (
    <div className="flex min-h-screen bg-background">
      {children}
    </div>
  )
}

