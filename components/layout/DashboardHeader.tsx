'use client'

import { Bell, Search, User, Settings, Crown } from 'lucide-react'
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
import { motion } from 'framer-motion'

interface DashboardHeaderProps {
  type: 'client' | 'prestataire'
  userName?: string
  userEmail?: string
  onSectionChange?: (section: string) => void
}

export function DashboardHeader({ type, userName = 'Utilisateur', userEmail = 'user@example.com', onSectionChange }: DashboardHeaderProps) {
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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher..."
              className="pl-9 bg-white/80 border-orange-200 focus:border-orange-400 transition-all"
            />
          </motion.div>
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
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-orange-700 hover:bg-orange-100/50 hover:text-orange-800 transition-all"
                >
                  <motion.div
                    animate={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <Bell className="h-5 w-5" />
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  >
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      3
                    </Badge>
                  </motion.div>
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                <p className="text-sm font-medium">Nouvelle réservation</p>
                <p className="text-xs text-muted-foreground">
                  Vous avez reçu une nouvelle demande de réservation
                </p>
                <span className="text-xs text-orange-600 mt-1">Il y a 2 heures</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                <p className="text-sm font-medium">Paiement reçu</p>
                <p className="text-xs text-muted-foreground">
                  Votre paiement a été traité avec succès
                </p>
                <span className="text-xs text-orange-600 mt-1">Il y a 5 heures</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <Button variant="ghost" className="w-full justify-center text-sm text-orange-600">
                Voir toutes les notifications
              </Button>
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

