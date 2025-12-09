import { NextRequest } from 'next/server'
import { requireRole } from '@/lib/api/auth'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api/response'

/**
 * GET /api/admin/notifications
 * Récupère toutes les notifications (admin uniquement)
 */
export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification et le rôle
    try {
      await requireRole('ADMIN', request)
    } catch (authError) {
      // Si l'authentification échoue, retourner une erreur 403
      if (authError instanceof Error) {
        if (authError.message === 'Unauthorized' || authError.message === 'Forbidden') {
          return errorResponse(authError.message, 403)
        }
      }
      return errorResponse('Unauthorized', 403)
    }

    // Récupérer toutes les notifications, triées par date de création (plus récentes en premier)
    const notifications = (await prisma.notification.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // Limiter à 50 notifications les plus récentes
    })) as Array<{
      id: string
      userId: string | null
      prestataireId: string | null
      type: string
      titre: string
      message: string
      lien: string | null
      isRead: boolean
      createdAt: Date
    }>

    // Compter les notifications non lues
    const unreadCount = (await prisma.notification.count({
      where: {
        isRead: false,
      },
    })) as number

    // Transformer les notifications pour correspondre au format attendu par le frontend
    const formattedNotifications = notifications.map((notification) => ({
      id: notification.id,
      type: notification.type,
      title: notification.titre,
      message: notification.message,
      isRead: notification.isRead,
      createdAt: notification.createdAt,
      actionUrl: notification.lien || undefined,
    }))

    return successResponse(
      {
        notifications: formattedNotifications,
        unreadCount,
      },
      'Notifications récupérées avec succès',
      200
    )
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
        return errorResponse(error.message, 403)
      }
      console.error('Error fetching notifications:', error.message, error.stack)
    } else {
      console.error('Error fetching notifications (unknown error):', error)
    }
    return errorResponse('Internal server error', 500)
  }
}

/**
 * PATCH /api/admin/notifications
 * Marque une notification comme lue, toutes comme lues, ou supprime une notification (admin uniquement)
 */
export async function PATCH(request: NextRequest) {
  try {
    await requireRole('ADMIN', request)

    const body = await request.json()
    const { notificationId, action } = body as { notificationId?: string; action: string }

    if (!action) {
      return errorResponse('Missing action', 400)
    }

    switch (action) {
      case 'read':
        if (!notificationId) {
          return errorResponse('Missing notificationId for read action', 400)
        }
        await prisma.notification.update({
          where: { id: notificationId },
          data: { isRead: true },
        })
        return successResponse({ success: true }, 'Notification marquée comme lue', 200)

      case 'readAll':
        await prisma.notification.updateMany({
          where: { isRead: false },
          data: { isRead: true },
        })
        return successResponse({ success: true }, 'Toutes les notifications marquées comme lues', 200)

      case 'delete':
        if (!notificationId) {
          return errorResponse('Missing notificationId for delete action', 400)
        }
        await prisma.notification.delete({
          where: { id: notificationId },
        })
        return successResponse({ success: true }, 'Notification supprimée', 200)

      default:
        return errorResponse('Invalid action', 400)
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
        return errorResponse(error.message, 403)
      }
    }
    console.error('Error updating notification:', error)
    return errorResponse('Internal server error', 500)
  }
}

