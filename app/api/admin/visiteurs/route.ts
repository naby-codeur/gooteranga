import { NextRequest } from 'next/server'
import { requireRole } from '@/lib/api/auth'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api/response'

/**
 * GET /api/admin/visiteurs
 * Récupère les statistiques de visiteurs par mois et par année (admin uniquement)
 */
export async function GET(request: NextRequest) {
  try {
    await requireRole('ADMIN', request)

    const { searchParams } = new URL(request.url)
    const periode = searchParams.get('periode') || 'mois' // 'mois' ou 'annee'

    // Récupérer les statistiques de visiteurs depuis le modèle Statistique
    // On utilise le type "visiteur" pour les visites
    const statistiquesVisiteurs = await prisma.statistique.findMany({
      where: {
        type: 'visiteur',
      },
      orderBy: {
        date: 'asc',
      },
    })

    // Si aucune statistique n'existe, on peut utiliser les données des utilisateurs créés comme proxy
    // ou retourner des données vides
    let visiteursParMois: Array<{ mois: string; nombre: number; pourcentage: number }> = []
    let visiteursParAnnee: Array<{ annee: string; nombre: number; pourcentage: number }> = []

    if (statistiquesVisiteurs.length === 0) {
      // Utiliser les utilisateurs créés comme proxy pour les visiteurs
      const utilisateurs = await prisma.user.findMany({
        select: {
          createdAt: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      })

      // Grouper par mois
      const visiteursParMoisMap = new Map<string, number>()
      utilisateurs.forEach((user) => {
        const date = new Date(user.createdAt)
        const moisKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        visiteursParMoisMap.set(moisKey, (visiteursParMoisMap.get(moisKey) || 0) + 1)
      })

      // Grouper par année
      const visiteursParAnneeMap = new Map<string, number>()
      utilisateurs.forEach((user) => {
        const date = new Date(user.createdAt)
        const anneeKey = String(date.getFullYear())
        visiteursParAnneeMap.set(anneeKey, (visiteursParAnneeMap.get(anneeKey) || 0) + 1)
      })

      // Calculer les totaux pour les pourcentages
      const totalMois = Array.from(visiteursParMoisMap.values()).reduce((a, b) => a + b, 0)
      const totalAnnee = Array.from(visiteursParAnneeMap.values()).reduce((a, b) => a + b, 0)

      // Convertir en tableaux avec pourcentages
      visiteursParMois = Array.from(visiteursParMoisMap.entries())
        .map(([mois, nombre]) => ({
          mois,
          nombre,
          pourcentage: totalMois > 0 ? Number(((nombre / totalMois) * 100).toFixed(2)) : 0,
        }))
        .sort((a, b) => a.mois.localeCompare(b.mois))

      visiteursParAnnee = Array.from(visiteursParAnneeMap.entries())
        .map(([annee, nombre]) => ({
          annee,
          nombre,
          pourcentage: totalAnnee > 0 ? Number(((nombre / totalAnnee) * 100).toFixed(2)) : 0,
        }))
        .sort((a, b) => a.annee.localeCompare(b.annee))
    } else {
      // Utiliser les statistiques réelles
      // Grouper par mois
      const visiteursParMoisMap = new Map<string, number>()
      statistiquesVisiteurs.forEach((stat) => {
        const date = new Date(stat.date)
        const moisKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        visiteursParMoisMap.set(moisKey, (visiteursParMoisMap.get(moisKey) || 0) + 1)
      })

      // Grouper par année
      const visiteursParAnneeMap = new Map<string, number>()
      statistiquesVisiteurs.forEach((stat) => {
        const date = new Date(stat.date)
        const anneeKey = String(date.getFullYear())
        visiteursParAnneeMap.set(anneeKey, (visiteursParAnneeMap.get(anneeKey) || 0) + 1)
      })

      // Calculer les totaux pour les pourcentages
      const totalMois = Array.from(visiteursParMoisMap.values()).reduce((a, b) => a + b, 0)
      const totalAnnee = Array.from(visiteursParAnneeMap.values()).reduce((a, b) => a + b, 0)

      // Convertir en tableaux avec pourcentages
      visiteursParMois = Array.from(visiteursParMoisMap.entries())
        .map(([mois, nombre]) => ({
          mois,
          nombre,
          pourcentage: totalMois > 0 ? Number(((nombre / totalMois) * 100).toFixed(2)) : 0,
        }))
        .sort((a, b) => a.mois.localeCompare(b.mois))

      visiteursParAnnee = Array.from(visiteursParAnneeMap.entries())
        .map(([annee, nombre]) => ({
          annee,
          nombre,
          pourcentage: totalAnnee > 0 ? Number(((nombre / totalAnnee) * 100).toFixed(2)) : 0,
        }))
        .sort((a, b) => a.annee.localeCompare(b.annee))
    }

    // Formater les mois avec des noms de mois en français
    const moisNoms = [
      'Janvier',
      'Février',
      'Mars',
      'Avril',
      'Mai',
      'Juin',
      'Juillet',
      'Août',
      'Septembre',
      'Octobre',
      'Novembre',
      'Décembre',
    ]

    const visiteursParMoisFormate = visiteursParMois.map((item) => {
      const [annee, mois] = item.mois.split('-')
      const moisNom = moisNoms[parseInt(mois) - 1]
      return {
        mois: `${moisNom} ${annee}`,
        moisKey: item.mois,
        nombre: item.nombre,
        pourcentage: item.pourcentage,
      }
    })

    return successResponse(
      {
        visiteursParMois: visiteursParMoisFormate,
        visiteursParAnnee,
        totalVisiteurs: visiteursParMois.reduce((sum, item) => sum + item.nombre, 0),
      },
      'Statistiques de visiteurs récupérées avec succès',
      200
    )
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
        return errorResponse(error.message, 403)
      }
    }
    console.error('Error fetching visitor stats:', error)
    return errorResponse('Internal server error', 500)
  }
}

