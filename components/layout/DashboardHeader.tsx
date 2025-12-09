'use client'

import { Bell, Search, User, Settings, Crown, X, Check, Trash2, Clock, Filter } from 'lucide-react'
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
import { motion, AnimatePresence } from 'framer-motion'
import { Notification } from '@/lib/hooks/useNotifications'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface DashboardHeaderProps {
  type: 'client' | 'prestataire'
  userName?: string
  userEmail?: string
  onSectionChange?: (section: string) => void
  searchQuery?: string
  onSearchChange?: (query: string) => void
  searchFilter?: 'all' | 'offres' | 'reservations' | 'paiements' | 'messages' | 'favoris' | 'depenses'
  onSearchFilterChange?: (filter: 'all' | 'offres' | 'reservations' | 'paiements' | 'messages' | 'favoris' | 'depenses') => void
  showMobileSearch?: boolean
  onShowMobileSearchChange?: (show: boolean) => void
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
  searchFilter = 'all',
  onSearchFilterChange,
  showMobileSearch = false,
  onShowMobileSearchChange,
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
      <div className="flex h-14 sm:h-16 items-center justify-between px-2 sm:px-4 lg:px-6 xl:px-8 gap-2">
        {/* Zone gauche - Recherche */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-1 min-w-0 max-w-md">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="relative flex-1 hidden md:flex items-center gap-2"
          >
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground z-10" />
              <Input
                type="search"
                placeholder={
                  type === 'prestataire' 
                    ? "Rechercher..." 
                    : "Rechercher..."
                }
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="pl-7 sm:pl-9 pr-7 sm:pr-9 bg-white/80 border-orange-200 focus:border-orange-400 transition-all text-sm sm:text-base h-9 sm:h-10"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange?.('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-orange-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {onSearchFilterChange && (
              <Select value={searchFilter} onValueChange={(value) => onSearchFilterChange(value as typeof searchFilter)}>
                <SelectTrigger className="w-[100px] sm:w-[120px] lg:w-[140px] bg-white/80 border-orange-200 h-9 sm:h-10 text-xs sm:text-sm flex-shrink-0">
                  <Filter className="h-3 w-3 mr-1 sm:mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tout</SelectItem>
                  {type === 'prestataire' ? (
                    <>
                      <SelectItem value="offres">Offres</SelectItem>
                      <SelectItem value="reservations">Réservations</SelectItem>
                      <SelectItem value="paiements">Paiements</SelectItem>
                      <SelectItem value="messages">Messages</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="reservations">Réservations</SelectItem>
                      <SelectItem value="favoris">Favoris</SelectItem>
                      <SelectItem value="depenses">Dépenses</SelectItem>
                      <SelectItem value="messages">Messages</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            )}
          </motion.div>
          {/* Bouton de recherche mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-orange-700 hover:bg-orange-100/50 size-8 sm:size-9 flex-shrink-0"
            onClick={() => onShowMobileSearchChange?.(!showMobileSearch)}
          >
            <Search className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>

        {/* Zone droite - Actions */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="flex items-center gap-1 sm:gap-2 lg:gap-3 flex-shrink-0"
        >
          {/* Abonnements - Visible uniquement pour les prestataires */}
          {type === 'prestataire' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:from-orange-600 hover:to-yellow-600 shadow-md hover:shadow-lg flex-shrink-0"
                  title="Mon abonnement"
                >
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
                  >
                    <Crown className="h-3 w-3 sm:h-4 sm:w-4" />
                  </motion.div>
                  <span className="hidden md:inline">Abonnement</span>
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[calc(100vw-2rem)] sm:w-80">
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
                className="relative text-orange-700 hover:bg-orange-100/50 hover:text-orange-800 transition-all hover:scale-105 active:scale-95 size-8 sm:size-9"
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
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </Badge>
                  </motion.div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[calc(100vw-2rem)] sm:w-96 max-h-[600px] overflow-y-auto">
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

      {/* Modal de recherche mobile */}
      <AnimatePresence>
        {showMobileSearch && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t bg-white/95 backdrop-blur-md p-3 sm:p-4 space-y-3"
          >
            <div className="relative">
              <Search className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground z-10" />
              <Input
                type="search"
                placeholder={
                  type === 'prestataire' 
                    ? "Rechercher..." 
                    : "Rechercher..."
                }
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="pl-7 sm:pl-9 pr-7 sm:pr-9 bg-white border-orange-200 focus:border-orange-400 transition-all text-sm sm:text-base h-9 sm:h-10"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange?.('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-orange-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {onSearchFilterChange && (
              <Select value={searchFilter} onValueChange={(value) => onSearchFilterChange(value as typeof searchFilter)}>
                <SelectTrigger className="w-full bg-white border-orange-200 h-9 sm:h-10 text-sm sm:text-base">
                  <Filter className="h-3 w-3 mr-1 sm:mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tout</SelectItem>
                  {type === 'prestataire' ? (
                    <>
                      <SelectItem value="offres">Offres</SelectItem>
                      <SelectItem value="reservations">Réservations</SelectItem>
                      <SelectItem value="paiements">Paiements</SelectItem>
                      <SelectItem value="messages">Messages</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="reservations">Réservations</SelectItem>
                      <SelectItem value="favoris">Favoris</SelectItem>
                      <SelectItem value="depenses">Dépenses</SelectItem>
                      <SelectItem value="messages">Messages</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

