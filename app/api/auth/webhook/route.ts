import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api/response'

/**
 * POST /api/auth/webhook
 * Webhook Supabase pour synchroniser les utilisateurs Auth avec Prisma
 * 
 * Configuration dans Supabase Dashboard:
 * - Project Settings > API > Webhooks
 * - URL: https://votre-domaine.com/api/auth/webhook
 * - Events: auth.users (INSERT, UPDATE, DELETE)
 * - HTTP Method: POST
 */
export async function POST(request: NextRequest) {
  try {
    // Vérifier le secret du webhook (si configuré)
    const webhookSecret = request.headers.get('x-webhook-secret')
    if (process.env.SUPABASE_WEBHOOK_SECRET && webhookSecret !== process.env.SUPABASE_WEBHOOK_SECRET) {
      return errorResponse('Unauthorized', 401)
    }

    const body = await request.json()
    const { type, record } = body

    // Vérifier que c'est bien un événement auth
    if (!type || !record) {
      return errorResponse('Invalid webhook payload', 400)
    }

    const userId = record.id
    const email = record.email

    // Synchroniser selon le type d'événement
    switch (type) {
      case 'INSERT':
        // Nouvel utilisateur créé
        if (email) {
          const userMetadata = record.user_metadata || {}
          const existingUser = await prisma.user.findUnique({
            where: { email },
          })

          if (!existingUser) {
            await prisma.user.create({
              data: {
                id: userId,
                email,
                nom: userMetadata.nom || email.split('@')[0],
                prenom: userMetadata.prenom || null,
                telephone: userMetadata.telephone || null,
                role: (userMetadata.role as 'USER' | 'PRESTATAIRE' | 'ADMIN') || 'USER',
                emailVerified: record.email_confirmed_at
                  ? new Date(record.email_confirmed_at)
                  : null,
              },
            })

            // Si c'est un prestataire, créer le profil (automatiquement vérifié)
            if (userMetadata.role === 'PRESTATAIRE' && userMetadata.nomEntreprise && userMetadata.typePrestataire) {
              await prisma.prestataire.create({
                data: {
                  userId: userId,
                  nomEntreprise: userMetadata.nomEntreprise,
                  type: userMetadata.typePrestataire,
                  adresse: userMetadata.adresse || null,
                  ville: userMetadata.ville || null,
                  region: userMetadata.region || null,
                  description: userMetadata.description || null,
                  isVerified: true, // Validation automatique
                },
              })
            }
          }
        }
        break

      case 'UPDATE':
        // Utilisateur mis à jour
        if (email) {
          const existingUser = await prisma.user.findUnique({
            where: { email },
          })

          if (existingUser) {
            const userMetadata = record.user_metadata || {}
            const user = existingUser as {
              id: string
              nom: string
              prenom: string | null
              telephone: string | null
              emailVerified: Date | null
            }
            await prisma.user.update({
              where: { id: user.id },
              data: {
                email: record.email,
                nom: userMetadata.nom || user.nom,
                prenom: userMetadata.prenom ?? user.prenom,
                telephone: userMetadata.telephone ?? user.telephone,
                emailVerified: record.email_confirmed_at
                  ? new Date(record.email_confirmed_at)
                  : user.emailVerified,
              },
            })
          }
        }
        break

      case 'DELETE':
        // Utilisateur supprimé
        if (email) {
          const existingUser = await prisma.user.findUnique({
            where: { email },
          })

          if (existingUser) {
            // Prisma supprimera automatiquement les relations grâce à onDelete: Cascade
            const user = existingUser as { id: string }
            await prisma.user.delete({
              where: { id: user.id },
            })
          }
        }
        break

      default:
        return errorResponse(`Unknown event type: ${type}`, 400)
    }

    return successResponse({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return errorResponse('Error processing webhook', 500)
  }
}

