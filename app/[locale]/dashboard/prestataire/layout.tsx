import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/api/auth'
import { getDashboardPath } from '@/lib/utils/auth'

export default async function PrestataireLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Toujours exiger l'authentification pour accéder au dashboard prestataire
  const user = await getAuthUser()

  // Rediriger si non authentifié
  if (!user) {
    redirect(`/${locale}/login?next=/${locale}/dashboard/prestataire`)
  }

  // Rediriger si pas prestataire ou admin
  if (user.role !== 'PRESTATAIRE' && user.role !== 'ADMIN') {
    redirect(`/${locale}${getDashboardPath(user.role)}`)
  }

  return <>{children}</>
}

