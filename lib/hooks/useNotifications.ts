'use client'

import { useState, useEffect, useMemo } from 'react'

export type NotificationType = 
  | 'reservation'
  | 'paiement'
  | 'message'
  | 'favori'
  | 'depense'
  | 'system'

export interface Notification {
  id: string
  type: NotificationType
  titre: string
  message: string
  date: Date
  isRead: boolean
  actionUrl?: string
  actionLabel?: string
  icon?: string
}

// Données fictives pour le développement
const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'reservation',
    titre: 'Réservation confirmée',
    message: 'Votre réservation pour "Visite de l\'Île de Gorée" a été confirmée',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000), // Il y a 2 heures
    isRead: false,
    actionUrl: '/dashboard?section=reservations',
    actionLabel: 'Voir la réservation',
    icon: '📅',
  },
  {
    id: 'notif-2',
    type: 'paiement',
    titre: 'Paiement reçu',
    message: 'Votre paiement de 10 000 FCFA a été traité avec succès',
    date: new Date(Date.now() - 5 * 60 * 60 * 1000), // Il y a 5 heures
    isRead: false,
    actionUrl: '/dashboard?section=depenses',
    actionLabel: 'Voir les dépenses',
    icon: '💳',
  },
  {
    id: 'notif-3',
    type: 'message',
    titre: 'Nouveau message',
    message: 'Vous avez reçu un message de Guide Sénégal Authentique',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Il y a 1 jour
    isRead: false,
    actionUrl: '/dashboard?section=messages',
    actionLabel: 'Ouvrir la conversation',
    icon: '💬',
  },
  {
    id: 'notif-4',
    type: 'reservation',
    titre: 'Rappel de réservation',
    message: 'Votre réservation pour "Hôtel Teranga" commence dans 3 jours',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Il y a 2 jours
    isRead: true,
    actionUrl: '/dashboard?section=reservations',
    actionLabel: 'Voir la réservation',
    icon: '⏰',
  },
  {
    id: 'notif-5',
    type: 'favori',
    titre: 'Offre mise à jour',
    message: 'L\'offre "Safari dans le Parc Niokolo-Koba" a été mise à jour',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // Il y a 3 jours
    isRead: true,
    actionUrl: '/dashboard?section=favoris',
    actionLabel: 'Voir l\'offre',
    icon: '⭐',
  },
  {
    id: 'notif-6',
    type: 'system',
    titre: 'Bienvenue sur GooTeranga',
    message: 'Découvrez les meilleures expériences touristiques du Sénégal',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Il y a 7 jours
    isRead: true,
    icon: '🎉',
  },
]

interface UseNotificationsReturn {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (id: string) => Promise<void>
  clearAll: () => Promise<void>
}

export function useNotifications(): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      // Simuler un délai de chargement
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Charger depuis le localStorage ou utiliser les données fictives
      const stored = localStorage.getItem('notifications')
      if (stored) {
        const parsed = JSON.parse(stored)
        setNotifications(parsed.map((n: any) => ({
          ...n,
          date: new Date(n.date),
        })))
      } else {
        setNotifications([...mockNotifications])
        localStorage.setItem('notifications', JSON.stringify(mockNotifications))
      }
    } catch (err) {
      console.error('Error fetching notifications:', err)
      setNotifications([...mockNotifications])
    } finally {
      setLoading(false)
    }
  }

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.isRead).length
  }, [notifications])

  const markAsRead = async (id: string) => {
    try {
      setNotifications(prev => {
        const updated = prev.map(n => 
          n.id === id ? { ...n, isRead: true } : n
        )
        localStorage.setItem('notifications', JSON.stringify(updated))
        return updated
      })
    } catch (err) {
      console.error('Error marking notification as read:', err)
    }
  }

  const markAllAsRead = async () => {
    try {
      setNotifications(prev => {
        const updated = prev.map(n => ({ ...n, isRead: true }))
        localStorage.setItem('notifications', JSON.stringify(updated))
        return updated
      })
    } catch (err) {
      console.error('Error marking all notifications as read:', err)
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      setNotifications(prev => {
        const updated = prev.filter(n => n.id !== id)
        localStorage.setItem('notifications', JSON.stringify(updated))
        return updated
      })
    } catch (err) {
      console.error('Error deleting notification:', err)
    }
  }

  const clearAll = async () => {
    try {
      setNotifications([])
      localStorage.setItem('notifications', JSON.stringify([]))
    } catch (err) {
      console.error('Error clearing notifications:', err)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  }
}

