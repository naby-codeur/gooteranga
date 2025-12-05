// Authentification désactivée pour le développement - accès direct avec données fictives

export default async function DashboardLayout({
  children,
  params: _params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  // Accès direct sans vérification d'authentification
  return (
    <div className="flex min-h-screen bg-background">
      {children}
    </div>
  )
}

