'use client'

import { Bell, Search, User, Settings, Crown, X, Check, Trash2, Clock } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { Notification } from '@/lib/hooks/useNotifications'

interface DashboardHeaderProps {
  type: 'client' | 'prestataire'
  userName?: string
  userEmail?: string
  onSectionChange?: (section: string) => void
  searchQuery?: string
  onSearchChange?: (query: string) => void
  notifications?: Notification[]
  unreadCount?: number
  onMarkAsRead?: (id: string) => Promise<void>
  onMarkAllAsRead?: () => Promise<void>
  onDeleteNotification?: (id: string) => Promise<void>
}

// Fonction pour formater le temps écoulé
function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return 'À l\'instant'
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `Il y a ${diffInMinutes} min${diffInMinutes > 1 ? 's' : ''}`
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `Il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`
  }
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) {
    return `Il y a ${diffInWeeks} semaine${diffInWeeks > 1 ? 's' : ''}`
  }
  
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

export function DashboardHeader({ 
  type, 
  userName = 'Utilisateur', 
  userEmail = 'user@example.com', 
  onSectionChange, 
  searchQuery = '', 
  onSearchChange,
  notifications = [],
  unreadCount = 0,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
}: DashboardHeaderProps) {
  // Initiales pour l'avatar
  const initials = userName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-30 w-full border-b bg-gradient-to-r from-orange-50/95 via-yellow-50/95 to-orange-50/95 backdrop-blur-md border-orange-200/50 shadow-sm"
    >
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone gauche - Recherche */}
        <div className="flex items-center gap-4 flex-1 max-w-md">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="relative flex-1 hidden md:block"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
            <Input
              type="search"
              placeholder="Rechercher réservations, favoris, dépenses..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="pl-9 pr-9 bg-white/80 border-orange-200 focus:border-orange-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange?.('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-orange-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </motion.div>
          {/* Bouton de recherche mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-orange-700 hover:bg-orange-100/50"
            onClick={() => {
              // Focus sur la recherche si elle existe, sinon on peut ouvrir un modal
              const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement
              if (searchInput) {
                searchInput.focus()
              }
            }}
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>

        {/* Zone droite - Actions */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="flex items-center gap-2 sm:gap-3"
        >
          {/* Abonnements - Visible uniquement pour les prestataires */}
          {type === 'prestataire' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:from-orange-600 hover:to-yellow-600 shadow-md hover:shadow-lg"
                  title="Mon abonnement"
                >
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
                  >
                    <Crown className="h-4 w-4" />
                  </motion.div>
                  <span className="hidden sm:inline">Abonnement</span>
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>Mon abonnement</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Actif
                  </Badge>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {/* Abonnement actuel */}
                <div className="px-2 py-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-md mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Crown className="h-4 w-4 text-yellow-500" />
                      <p className="text-sm font-semibold text-orange-800">Premium</p>
                    </div>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                      11 000 FCFA/mois
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Renouvelé le 15/01/2025
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full text-xs"
                    onClick={(e) => {
                      e.preventDefault()
                      onSectionChange?.('abonnements')
                    }}
                  >
                    Gérer mon abonnement
                  </Button>
                </div>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  Autres plans disponibles
                </DropdownMenuLabel>
                
                {/* Plan Gratuit */}
                <DropdownMenuItem 
                  className="flex flex-col items-start gap-2 py-3 cursor-pointer hover:bg-orange-50"
                  onClick={(e) => {
                    e.preventDefault()
                    onSectionChange?.('abonnements')
                  }}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                      <p className="text-sm font-semibold text-orange-800">Gratuit</p>
                    </div>
                    <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                      0 FCFA
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    5 expériences maximum, fonctionnalités de base
                  </p>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                {/* Abonnement Pro */}
                <DropdownMenuItem 
                  className="flex flex-col items-start gap-2 py-3 cursor-pointer hover:bg-orange-50"
                  onClick={(e) => {
                    e.preventDefault()
                    onSectionChange?.('abonnements')
                  }}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                      <p className="text-sm font-semibold text-orange-800">Pro</p>
                    </div>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                      4 000 FCFA/mois
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Expériences illimitées, statistiques, 1 boost/mois
                  </p>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                {/* Abonnement Premium */}
                <DropdownMenuItem 
                  className="flex flex-col items-start gap-2 py-3 cursor-pointer hover:bg-orange-50"
                  onClick={(e) => {
                    e.preventDefault()
                    onSectionChange?.('abonnements')
                  }}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <Crown className="h-4 w-4 text-yellow-500" />
                      <p className="text-sm font-semibold text-orange-800">Premium</p>
                    </div>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                      11 000 FCFA/mois
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Toutes les fonctionnalités, 3 boosts/mois, badge certifié
                  </p>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <Button 
                  variant="ghost" 
                  className="w-full justify-center text-sm text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                  onClick={(e) => {
                    e.preventDefault()
                    onSectionChange?.('abonnements')
                  }}
                >
                  Voir tous les plans
                </Button>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-orange-700 hover:bg-orange-100/50 hover:text-orange-800 transition-all hover:scale-105 active:scale-95"
              >
                <motion.div
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Bell className="h-5 w-5" />
                </motion.div>
                {unreadCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  >
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </Badge>
                  </motion.div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-96 max-h-[600px] overflow-y-auto">
              <div className="flex items-center justify-between px-2 py-1.5">
                <DropdownMenuLabel className="px-0">Notifications</DropdownMenuLabel>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-orange-600 hover:text-orange-700"
                    onClick={(e) => {
                      e.preventDefault()
                      onMarkAllAsRead?.()
                    }}
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Tout marquer comme lu
                  </Button>
                )}
              </div>
              <DropdownMenuSeparator />
              {notifications.length === 0 ? (
                <div className="px-2 py-8 text-center">
                  <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                  <p className="text-sm text-muted-foreground">Aucune notification</p>
                </div>
              ) : (
                <>
                  {notifications.map((notification) => {
                    const timeAgo = getTimeAgo(notification.date)
                    return (
                      <div key={notification.id}>
                        <DropdownMenuItem
                          className={`flex flex-col items-start gap-1 py-3 cursor-pointer ${
                            !notification.isRead ? 'bg-orange-50/50 dark:bg-orange-950/20' : ''
                          }`}
                          onClick={(e) => {
                            e.preventDefault()
                            if (!notification.isRead) {
                              onMarkAsRead?.(notification.id)
                            }
                            if (notification.actionUrl) {
                              const url = new URL(notification.actionUrl, window.location.origin)
                              const section = url.searchParams.get('section')
                              if (section) {
                                onSectionChange?.(section)
                              }
                            }
                          }}
                        >
                          <div className="flex items-start justify-between w-full gap-2">
                            <div className="flex items-start gap-2 flex-1 min-w-0">
                              {notification.icon && (
                                <span className="text-lg flex-shrink-0">{notification.icon}</span>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className={`text-sm font-medium ${!notification.isRead ? 'text-orange-900 dark:text-orange-100' : ''}`}>
                                    {notification.titre}
                                  </p>
                                  {!notification.isRead && (
                                    <div className="h-2 w-2 rounded-full bg-orange-500 flex-shrink-0" />
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                  {notification.message}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Clock className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-xs text-orange-600">{timeAgo}</span>
                                </div>
                                {notification.actionLabel && (
                                  <span className="text-xs text-orange-600 mt-1 inline-block">
                                    {notification.actionLabel} →
                                  </span>
                                )}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                              onClick={(e) => {
                                e.stopPropagation()
                                onDeleteNotification?.(notification.id)
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </div>
                    )
                  })}
                  <div className="px-2 py-1">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-center text-sm text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                      onClick={() => onSectionChange?.('notifications')}
                    >
                      Voir toutes les notifications
                    </Button>
                  </div>
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
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 flex items-center gap-2 sm:gap-3 h-auto py-2 px-2 sm:px-3 hover:bg-orange-100/50"
              >
                <motion.div 
                  className="h-9 w-9 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center text-sm font-bold text-white shadow-md"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {initials}
                </motion.div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-orange-800">{userName}</p>
                  <p className="text-xs text-muted-foreground truncate max-w-[150px]">{userEmail}</p>
                </div>
              </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{userName}</p>
                  <p className="text-xs text-muted-foreground">{userEmail}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onSectionChange?.('profil')}
              >
                <User className="mr-2 h-4 w-4" />
                <span>Mon profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onSectionChange?.(type === 'client' ? 'profil' : 'parametres')}
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

