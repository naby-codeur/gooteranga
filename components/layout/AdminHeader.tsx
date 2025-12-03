'use client'

import { Bell, Search, Settings, Shield } from 'lucide-react'
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

interface AdminHeaderProps {
  userName?: string
  userEmail?: string
  onSectionChange?: (section: string) => void
}

export function AdminHeader({ userName = 'Admin', userEmail = 'admin@gooteranga.com', onSectionChange }: AdminHeaderProps) {
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
              placeholder="Rechercher dans l'admin..."
              className="pl-9 bg-white/80 border-orange-200 focus:border-orange-400 transition-all"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-200/50"
          >
            <Shield className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-700 hidden sm:inline">Mode Admin</span>
          </motion.div>
        </div>

        {/* Zone droite - Actions */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="flex items-center gap-2 sm:gap-3"
        >
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 relative size-9 hover:bg-orange-100/50 text-orange-700 hover:text-orange-800"
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
                    5
                  </Badge>
                </motion.div>
              </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications Admin</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                <p className="text-sm font-medium">Nouveau prestataire à valider</p>
                <p className="text-xs text-muted-foreground">
                  Un nouveau prestataire a soumis son inscription
                </p>
                <span className="text-xs text-orange-600 mt-1">Il y a 1 heure</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                <p className="text-sm font-medium">Activité signalée</p>
                <p className="text-xs text-muted-foreground">
                  Une activité nécessite votre attention
                </p>
                <span className="text-xs text-orange-600 mt-1">Il y a 3 heures</span>
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

