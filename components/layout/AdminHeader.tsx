'use client'

import { useState, useEffect, useCallback } from 'react'
import { Bell, Search, Settings, Shield, X, Check, CheckCheck, Users, Package, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'

interface AdminHeaderProps {
  userName?: string
  userEmail?: string
  onSectionChange?: (section: string) => void
}

interface Notification {
  id: string
  type: string
  title: string
  message: string
  isRead: boolean
  createdAt: Date | string
  actionUrl?: string
}

interface SearchUser {
  id: string
  email: string
  nom: string
  prenom: string | null
  telephone: string | null
  role: string
  isActive: boolean
  createdAt: Date | string
}

interface SearchPrestataire {
  id: string
  nomEntreprise: string
  type: string
  email?: string
  telephone?: string
  ville?: string
  region?: string
}

interface SearchActivite {
  id: string
  titre: string
  region?: string
  ville?: string
  type?: string
}

interface SearchReservation {
  id: string
  offre?: {
    titre: string
  }
  client?: {
    nom: string
    prenom: string | null
    email: string
  }
}

interface SearchResult {
  users: SearchUser[]
  prestataires: SearchPrestataire[]
  activites: SearchActivite[]
  reservations: SearchReservation[]
  total: number
}

export function AdminHeader({ userName = 'Admin', userEmail = 'admin@gooteranga.com', onSectionChange }: AdminHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loadingNotifications, setLoadingNotifications] = useState(false)
  const initials = userName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  // Charger les notifications
  const loadNotifications = useCallback(async () => {
    setLoadingNotifications(true)
    try {
      const response = await fetch('/api/admin/notifications', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Inclure les cookies pour l'authentification
      })
      
      if (!response.ok) {
        // Si c'est une erreur 403 ou 401, c'est probablement un problème d'authentification
        if (response.status === 401 || response.status === 403) {
          console.warn('Accès non autorisé aux notifications (peut être normal en développement)')
          setNotifications([])
          setUnreadCount(0)
          return
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        console.error('Réponse non-JSON reçue:', text.substring(0, 200))
        throw new Error('Réponse non-JSON')
      }
      
      const data = await response.json()
      if (data.success) {
        setNotifications(data.data.notifications || [])
        setUnreadCount(data.data.unreadCount || 0)
      } else {
        // Si la réponse indique un échec mais n'est pas une erreur HTTP
        console.warn('Réponse API indique un échec:', data.message || 'Erreur inconnue')
        setNotifications([])
        setUnreadCount(0)
      }
    } catch (error) {
      // Gérer différents types d'erreurs
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        console.warn('Impossible de se connecter à l\'API (peut être normal si le serveur n\'est pas démarré)')
      } else if (error instanceof Error) {
        console.error('Erreur lors du chargement des notifications:', error.message)
      } else {
        console.error('Erreur inconnue lors du chargement des notifications:', error)
      }
      // Ne pas bloquer l'interface en cas d'erreur
      setNotifications([])
      setUnreadCount(0)
    } finally {
      setLoadingNotifications(false)
    }
  }, [])

  useEffect(() => {
    loadNotifications()
    // Recharger toutes les 30 secondes
    const interval = setInterval(loadNotifications, 30000)
    return () => clearInterval(interval)
  }, [loadNotifications])

  // Recherche globale
  const handleSearch = useCallback(async (query: string) => {
    if (query.trim().length < 2) {
      setSearchResults(null)
      setShowSearchResults(false)
      return
    }

    try {
      const response = await fetch(`/api/admin/search?q=${encodeURIComponent(query)}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        console.error('Réponse non-JSON reçue:', text.substring(0, 200))
        throw new Error('Réponse non-JSON')
      }
      
      const data = await response.json()
      if (data.success) {
        setSearchResults(data.data)
        setShowSearchResults(true)
      }
    } catch (error) {
      console.error('Erreur lors de la recherche:', error)
      setSearchResults(null)
      setShowSearchResults(false)
    }
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        handleSearch(searchQuery)
      } else {
        setSearchResults(null)
        setShowSearchResults(false)
      }
    }, 300) // Debounce de 300ms

    return () => clearTimeout(timeoutId)
  }, [searchQuery, handleSearch])

  // Marquer une notification comme lue
  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch('/api/admin/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId, action: 'read' }),
      })
      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
        )
        setUnreadCount((prev) => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error)
    }
  }

  // Marquer toutes comme lues
  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/admin/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'readAll' }),
      })
      if (response.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
        setUnreadCount(0)
      }
    } catch (error) {
      console.error('Erreur lors du marquage de toutes comme lues:', error)
    }
  }

  // Supprimer une notification
  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch('/api/admin/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId, action: 'delete' }),
      })
      if (response.ok) {
        setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
        const deleted = notifications.find((n) => n.id === notificationId)
        if (deleted && !deleted.isRead) {
          setUnreadCount((prev) => Math.max(0, prev - 1))
        }
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }

  const formatTimeAgo = (date: Date | string) => {
    const now = new Date()
    const notificationDate = typeof date === 'string' ? new Date(date) : date
    const diffInSeconds = Math.floor((now.getTime() - notificationDate.getTime()) / 1000)

    if (diffInSeconds < 60) return 'À l\'instant'
    if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} min`
    if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)} h`
    return `Il y a ${Math.floor(diffInSeconds / 86400)} jour${diffInSeconds >= 172800 ? 's' : ''}`
  }

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-30 w-full border-b bg-gradient-to-r from-orange-50/95 via-yellow-50/95 to-orange-50/95 backdrop-blur-md border-orange-200/50 shadow-sm"
    >
      <div className="flex h-14 sm:h-16 items-center justify-between px-2 sm:px-4 lg:px-6 xl:px-8 gap-2">
        {/* Zone gauche - Recherche */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-1 min-w-0 max-w-md">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="relative flex-1 hidden sm:block"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
            <Input
              type="search"
              placeholder="Rechercher..."
              className="pl-8 sm:pl-9 bg-white/80 border-orange-200 focus:border-orange-400 transition-all text-sm sm:text-base h-9 sm:h-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery && searchResults && setShowSearchResults(true)}
              onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
            />
            {/* Résultats de recherche */}
            <AnimatePresence>
              {showSearchResults && searchResults && searchResults.total > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-orange-200 max-h-96 overflow-y-auto z-50"
                >
                  <div className="p-2">
                    {searchResults.users.length > 0 && (
                      <div className="mb-2">
                        <div className="px-2 py-1 text-xs font-semibold text-muted-foreground flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          Utilisateurs ({searchResults.users.length})
                        </div>
                        {searchResults.users.map((user) => (
                          <DropdownMenuItem
                            key={user.id}
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => {
                              onSectionChange?.('utilisateurs')
                              setSearchQuery('')
                              setShowSearchResults(false)
                            }}
                          >
                            <div className="flex-1">
                              <p className="text-sm font-medium">{user.prenom} {user.nom}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </DropdownMenuItem>
                        ))}
                      </div>
                    )}
                    {searchResults.prestataires.length > 0 && (
                      <div className="mb-2">
                        <div className="px-2 py-1 text-xs font-semibold text-muted-foreground flex items-center gap-1">
                          <Package className="h-3 w-3" />
                          Prestataires ({searchResults.prestataires.length})
                        </div>
                        {searchResults.prestataires.map((prestataire) => (
                          <DropdownMenuItem
                            key={prestataire.id}
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => {
                              onSectionChange?.('prestataires')
                              setSearchQuery('')
                              setShowSearchResults(false)
                            }}
                          >
                            <div className="flex-1">
                              <p className="text-sm font-medium">{prestataire.nomEntreprise}</p>
                              <p className="text-xs text-muted-foreground">{prestataire.type}</p>
                            </div>
                          </DropdownMenuItem>
                        ))}
                      </div>
                    )}
                    {searchResults.activites.length > 0 && (
                      <div className="mb-2">
                        <div className="px-2 py-1 text-xs font-semibold text-muted-foreground flex items-center gap-1">
                          <Package className="h-3 w-3" />
                          Activités ({searchResults.activites.length})
                        </div>
                        {searchResults.activites.map((activite) => (
                          <DropdownMenuItem
                            key={activite.id}
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => {
                              onSectionChange?.('activites')
                              setSearchQuery('')
                              setShowSearchResults(false)
                            }}
                          >
                            <div className="flex-1">
                              <p className="text-sm font-medium">{activite.titre}</p>
                              <p className="text-xs text-muted-foreground">{activite.region}</p>
                            </div>
                          </DropdownMenuItem>
                        ))}
                      </div>
                    )}
                    {searchResults.reservations.length > 0 && (
                      <div>
                        <div className="px-2 py-1 text-xs font-semibold text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Réservations ({searchResults.reservations.length})
                        </div>
                        {searchResults.reservations.map((reservation) => (
                          <DropdownMenuItem
                            key={reservation.id}
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => {
                              onSectionChange?.('reservations')
                              setSearchQuery('')
                              setShowSearchResults(false)
                            }}
                          >
                            <div className="flex-1">
                              <p className="text-sm font-medium">{reservation.offre?.titre || 'Réservation'}</p>
                              <p className="text-xs text-muted-foreground">
                                {reservation.client?.prenom} {reservation.client?.nom}
                              </p>
                            </div>
                          </DropdownMenuItem>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-200/50 flex-shrink-0"
          >
            <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />
            <span className="text-xs sm:text-sm font-medium text-orange-700 hidden md:inline">Mode Admin</span>
          </motion.div>
        </div>

        {/* Zone droite - Actions */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="flex items-center gap-1 sm:gap-2 lg:gap-3 flex-shrink-0"
        >
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center gap-1 sm:gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 relative size-8 sm:size-9 hover:bg-orange-100/50 text-orange-700 hover:text-orange-800"
              >
                <motion.div
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                </motion.div>
                {unreadCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  >
                    <Badge
                      variant="destructive"
                      className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center p-0 text-[10px] sm:text-xs"
                    >
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </Badge>
                  </motion.div>
                )}
              </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[calc(100vw-2rem)] sm:w-80 max-h-[500px] overflow-y-auto">
              <div className="flex items-center justify-between px-2 py-1.5">
                <DropdownMenuLabel>Notifications Admin</DropdownMenuLabel>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={(e) => {
                      e.stopPropagation()
                      markAllAsRead()
                    }}
                  >
                    <CheckCheck className="h-3 w-3 mr-1" />
                    Tout marquer lu
                  </Button>
                )}
              </div>
              <DropdownMenuSeparator />
              {loadingNotifications ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Chargement...
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Aucune notification
                </div>
              ) : (
                <>
                  {notifications.map((notification) => (
                    <div key={notification.id}>
                      <DropdownMenuItem
                        className={`flex flex-col items-start gap-1 py-3 ${!notification.isRead ? 'bg-orange-50/50' : ''}`}
                        onClick={() => {
                          if (notification.actionUrl) {
                            const url = new URL(notification.actionUrl, window.location.origin)
                            const section = url.searchParams.get('section')
                            if (section) {
                              onSectionChange?.(section)
                            }
                          }
                          if (!notification.isRead) {
                            markAsRead(notification.id)
                          }
                        }}
                      >
                        <div className="flex items-start justify-between w-full gap-2">
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${!notification.isRead ? 'font-semibold' : ''}`}>
                              {notification.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {notification.message}
                            </p>
                            <span className="text-xs text-orange-600 mt-1 block">
                              {formatTimeAgo(notification.createdAt)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            {!notification.isRead && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  markAsRead(notification.id)
                                }}
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteNotification(notification.id)
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </div>
                  ))}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Menu utilisateur */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-1 sm:gap-2 lg:gap-3 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 h-auto py-1.5 sm:py-2 px-1.5 sm:px-2 lg:px-3 hover:bg-orange-100/50"
              >
                <motion.div 
                  className="h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center text-xs sm:text-sm font-bold text-white shadow-md flex-shrink-0"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {initials}
                </motion.div>
                <div className="hidden lg:block text-left min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-orange-800 truncate">{userName}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate max-w-[120px] lg:max-w-[150px]">{userEmail}</p>
                </div>
              </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[calc(100vw-2rem)] sm:w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{userName}</p>
                  <p className="text-xs text-muted-foreground">{userEmail}</p>
                  <Badge variant="outline" className="w-fit mt-1 text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    Administrateur
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onSectionChange?.('parametres')}
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Paramètres</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600 focus:text-red-600">
                <span>Déconnexion</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>
      </div>
    </motion.header>
  )
}

