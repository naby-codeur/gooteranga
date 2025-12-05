// Authentification désactivée pour le développement - accès direct avec données fictives

export default async function PrestataireLayout({
  children,
  params: _params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  // Accès direct sans vérification d'authentification
  return <>{children}</>
}

