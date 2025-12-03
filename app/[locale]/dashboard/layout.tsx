import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/api/auth'
import { getDashboardPath } from '@/lib/utils/auth'

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Toujours exiger l'authentification pour accéder au dashboard
  const user = await getAuthUser()

  // Rediriger si non authentifié
  if (!user) {
    redirect(`/${locale}/login?next=/${locale}/dashboard`)
  }

  // Rediriger les prestataires et admins vers leurs dashboards respectifs
  if (user.role === 'PRESTATAIRE' || user.role === 'ADMIN') {
    redirect(`/${locale}${getDashboardPath(user.role)}`)
  }

  // USER peut rester sur /dashboard

  return (
    <div className="flex min-h-screen bg-background">
      {children}
    </div>
  )
}

