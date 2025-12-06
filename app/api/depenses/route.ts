import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/api/auth'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api/response'

/**
 * GET /api/depenses
 * Récupère toutes les dépenses de l'utilisateur connecté
 */
export async function GET(request: NextRequest) {
  try {
    const authUser = await requireAuth(request)

    const { searchParams } = new URL(request.url)
    const categorie = searchParams.get('categorie')
    const dateDebut = searchParams.get('dateDebut')
    const dateFin = searchParams.get('dateFin')

    const where: {
      userId: string
      categorie?: string
      date?: {
        gte?: Date
        lte?: Date
      }
    } = {
      userId: authUser.id,
    }

    if (categorie) {
      where.categorie = categorie
    }

    if (dateDebut || dateFin) {
      where.date = {}
      if (dateDebut) {
        where.date.gte = new Date(dateDebut)
      }
      if (dateFin) {
        where.date.lte = new Date(dateFin)
      }
    }

    const depenses = await prisma.depense.findMany({
      where,
      orderBy: { date: 'desc' },
    })

    return successResponse({ depenses })
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
        return errorResponse(error.message, 403)
      }
    }
    console.error('Error fetching expenses:', error)
    return errorResponse('Internal server error', 500)
  }
}

/**
 * POST /api/depenses
 * Crée une nouvelle dépense manuelle
 */
export async function POST(request: NextRequest) {
  try {
    const authUser = await requireAuth(request)

    const body = await request.json()
    const { titre, description, categorie, montant, date, lieu, methode } = body

    // Validation
    if (!titre || !categorie || !montant) {
      return errorResponse('Titre, catégorie et montant sont requis', 400)
    }

    if (montant <= 0) {
      return errorResponse('Le montant doit être supérieur à 0', 400)
    }

    const depense = await prisma.depense.create({
      data: {
        userId: authUser.id,
        titre,
        description: description || null,
        categorie,
        montant: Number(montant),
        date: date ? new Date(date) : new Date(),
        lieu: lieu || null,
        methode: methode || null,
        isHorsPlateforme: true,
      },
    })

    return successResponse(depense, 'Dépense ajoutée avec succès', 201)
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
        return errorResponse(error.message, 403)
      }
    }
    console.error('Error creating expense:', error)
    return errorResponse('Internal server error', 500)
  }
}


