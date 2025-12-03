import { NextRequest } from 'next/server'
import { requireRole } from '@/lib/api/auth'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api/response'

// Types pour les rôles admin
export type AdminRole = 'SUPER_ADMIN' | 'ADMIN' | 'MODERATEUR' | 'SUPPORT' | 'CONTENT_MANAGER'

interface CreateMemberRequest {
  email: string
  nom: string
  prenom?: string
  telephone?: string
  role: AdminRole
  permissions?: string[]
}

// Types pour les résultats Prisma
type User = {
  id: string
  email: string
  nom: string
  prenom: string | null
  telephone: string | null
  role: string
  avatar: string | null
  createdAt: Date
  updatedAt: Date
}

type UserSelect = {
  id: string
  email: string
  nom: string
  prenom: string | null
  telephone: string | null
  role: string
  avatar?: string | null
  isActive?: boolean
  createdAt?: Date
  updatedAt?: Date
}

// GET - Récupérer tous les membres admin
export async function GET(request: NextRequest) {
  try {
    await requireRole('ADMIN', request)
    
    const { searchParams } = new URL(request.url)
    const roleParam = searchParams.get('role')

    const where: {
      role?: string
    } = {
      role: 'ADMIN'
    }

    if (roleParam) {
      // Pour l'instant, on filtre par role ADMIN
      // Plus tard, on pourra ajouter un champ adminRole dans le schéma
    }

    const membres = await (prisma.user.findMany as (args: unknown) => Promise<UserSelect[]>)({
      where,
      select: {
        id: true,
        email: true,
        nom: true,
        prenom: true,
        telephone: true,
        role: true,
        avatar: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return successResponse(membres, 'Membres récupérés avec succès', 200)
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
        return errorResponse(error.message, 403)
      }
    }
    console.error('Erreur lors de la récupération des membres:', error)
    return errorResponse('Erreur lors de la récupération des membres', 500)
  }
}

// POST - Créer un nouveau membre admin
export async function POST(request: NextRequest) {
  try {
    const body: CreateMemberRequest = await request.json()
    const { email, nom, prenom, telephone } = body

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    }) as User | null

    if (existingUser) {
      // Si l'utilisateur existe, mettre à jour son rôle
      const updatedUser = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          role: 'ADMIN',
          nom,
          prenom,
          telephone,
        }
      }) as UserSelect

      return successResponse(
        updatedUser,
        'Membre ajouté avec succès',
        200
      )
    }

    // Créer un nouvel utilisateur admin
    // Note: Dans un vrai système, il faudrait envoyer un email d'invitation
    // avec un lien pour définir le mot de passe
    const newMember = await prisma.user.create({
      data: {
        email,
        nom,
        prenom,
        telephone,
        role: 'ADMIN',
        // Le mot de passe sera défini lors de l'activation du compte
      },
      select: {
        id: true,
        email: true,
        nom: true,
        prenom: true,
        telephone: true,
        role: true,
        createdAt: true,
      }
    })

    return successResponse(
      newMember,
      'Membre créé avec succès. Un email d\'invitation sera envoyé.',
      201
    )
  } catch (error: unknown) {
    console.error('Erreur lors de la création du membre:', error)
    return errorResponse('Erreur lors de la création du membre', 500)
  }
}

// PATCH - Mettre à jour un membre ou suspendre/réactiver un utilisateur
export async function PATCH(request: NextRequest) {
  try {
    await requireRole('ADMIN', request)
    
    const body = await request.json()
    const { id, action, ...updateData } = body as { 
      id: string
      action?: 'suspend' | 'unsuspend'
      [key: string]: unknown
    }

    if (!id) {
      return errorResponse('ID requis', 400)
    }

    // Si c'est une action de suspension/réactivation
    if (action) {
      const userResult = await prisma.user.findUnique({
        where: { id },
        select: { id: true, email: true, nom: true, role: true },
      }) as { id: string; email: string; nom: string; role: string } | null

      if (!userResult) {
        return errorResponse('Utilisateur non trouvé', 404)
      }

      const userRole = userResult.role

      // Empêcher la suspension d'un autre admin (sécurité)
      if (userRole === 'ADMIN' && action === 'suspend') {
        return errorResponse('Impossible de suspendre un administrateur', 403)
      }

      const isActive = action === 'unsuspend'

      const updatedUser = await prisma.user.update({
        where: { id },
        data: { isActive },
        select: {
          id: true,
          email: true,
          nom: true,
          prenom: true,
          telephone: true,
          role: true,
          isActive: true,
          updatedAt: true,
        },
      }) as UserSelect

      // Si c'est un prestataire, désactiver aussi ses offres en cas de suspension
      if (action === 'suspend' && userRole === 'PRESTATAIRE') {
        // Récupérer le prestataire associé
        const prestataire = await prisma.prestataire.findUnique({
          where: { userId: id }
        }) as { id: string } | null

        if (prestataire) {
          // Désactiver toutes les offres du prestataire via update
          // Note: updateMany n'est pas disponible dans le mock, on utilise findMany + update
          const offres = await prisma.offre.findMany() as Array<{ id: string; prestataireId: string }>
          const offresPrestataire = offres.filter((o: { prestataireId: string }) => o.prestataireId === prestataire.id)
          
          for (const offre of offresPrestataire) {
            await prisma.offre.update({
              where: { id: offre.id },
              data: { isActive: false },
            })
          }
        }
      }

      // Créer une notification
      await prisma.notification.create({
        data: {
          userId: id,
          type: 'system',
          titre: action === 'suspend' ? 'Compte suspendu' : 'Compte réactivé',
          message: action === 'suspend'
            ? 'Votre compte a été suspendu en raison d\'actions inappropriées. Contactez le support pour plus d\'informations.'
            : 'Votre compte a été réactivé. Vous pouvez à nouveau utiliser la plateforme.',
          lien: userRole === 'PRESTATAIRE' ? '/dashboard/prestataire' : '/dashboard',
        },
      })

      return successResponse(
        updatedUser,
        action === 'suspend' ? 'Utilisateur suspendu avec succès' : 'Utilisateur réactivé avec succès',
        200
      )
    }

    // Sinon, mise à jour normale
    const updatedMember = await prisma.user.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date()
      },
      select: {
        id: true,
        email: true,
        nom: true,
        prenom: true,
        telephone: true,
        role: true,
        isActive: true,
        updatedAt: true,
      }
    })

    return successResponse(
      updatedMember,
      'Membre mis à jour avec succès',
      200
    )
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
        return errorResponse(error.message, 403)
      }
    }
    console.error('Erreur lors de la mise à jour du membre:', error)
    return errorResponse('Erreur lors de la mise à jour du membre', 500)
  }
}

// DELETE - Supprimer un membre (retirer le rôle admin)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return errorResponse('ID du membre requis', 400)
    }

    // Retirer le rôle admin (revenir à USER)
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        role: 'USER'
      }
    })

    return successResponse(
      updatedUser,
      'Membre retiré avec succès',
      200
    )
  } catch (error: unknown) {
    console.error('Erreur lors de la suppression du membre:', error)
    return errorResponse('Erreur lors de la suppression du membre', 500)
  }
}

