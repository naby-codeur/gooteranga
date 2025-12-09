'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Calendar,
  Heart,
  MessageSquare,
  User,
  DollarSign,
  BarChart3,
  Settings,
  Plus,
  Compass,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Bell,
  Users,
} from 'lucide-react'

interface SidebarItem {
  id: string
  label: string
  icon: React.ElementType
  emoji?: string
}

interface DashboardSidebarProps {
  type: 'client' | 'prestataire'
  activeSection: string
  onSectionChange: (section: string) => void
}

const clientItems: SidebarItem[] = [
  { id: 'overview', label: 'Vue d\'ensemble', icon: LayoutDashboard, emoji: '📊' },
  { id: 'reservations', label: 'Réservations', icon: Calendar, emoji: '📅' },
  { id: 'depenses', label: 'Mes dépenses', icon: DollarSign, emoji: '💰' },
  { id: 'favoris', label: 'Favoris', icon: Heart, emoji: '❤️' },
  { id: 'messages', label: 'Messages', icon: MessageSquare, emoji: '💬' },
  { id: 'notifications', label: 'Notifications', icon: Bell, emoji: '🔔' },
  { id: 'profil', label: 'Profil', icon: User, emoji: '👤' },
]

const prestataireItems: SidebarItem[] = [
  { id: 'overview', label: 'Vue d\'ensemble', icon: LayoutDashboard, emoji: '📊' },
  { id: 'offres', label: 'Mes offres', icon: Plus, emoji: '🎯' },
  { id: 'reservations', label: 'Réservations', icon: Calendar, emoji: '📅' },
  { id: 'messages', label: 'Messages', icon: MessageSquare, emoji: '💬' },
  { id: 'abonnements', label: 'Abonnement', icon: DollarSign, emoji: '💳' },
  { id: 'boosts', label: 'Boosts', icon: TrendingUp, emoji: '🚀' },
  { id: 'parrainage', label: 'Parrainage', icon: Users, emoji: '🎁' },
  { id: 'revenus', label: 'Revenus', icon: DollarSign, emoji: '💰' },
  { id: 'statistiques', label: 'Statistiques', icon: BarChart3, emoji: '📈' },
  { id: 'parametres', label: 'Paramètres', icon: Settings, emoji: '⚙️' },
]

export function DashboardSidebar({ type, activeSection, onSectionChange }: DashboardSidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const items = type === 'client' ? clientItems : prestataireItems

  return (
    <>
      {/* Bouton du menu mobile */}
      <motion.div 
        className="lg:hidden fixed top-4 left-4 z-50"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="bg-gradient-to-br from-orange-500 to-yellow-500 text-white border-0 shadow-lg hover:shadow-xl transition-all"
          >
            <AnimatePresence mode="wait">
              {isMobileOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
      </motion.div>

      {/* Barre latérale */}
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? 80 : 256,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          'fixed lg:sticky top-0 left-0 h-screen bg-gradient-to-b from-orange-50 via-yellow-50 to-orange-50 border-r border-orange-200/50 shadow-xl z-40 transition-transform duration-300',
          'lg:translate-x-0',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          'w-64 lg:w-auto'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <motion.div 
            className="p-4 sm:p-6 border-b border-orange-200/50 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 relative"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={cn('flex items-center gap-3', isCollapsed && 'justify-center')}>
              <motion.div 
                className="h-10 w-10 rounded-lg overflow-hidden bg-white/50 flex items-center justify-center shadow-lg flex-shrink-0"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Image
                  src="/logo_gooteranga.png"
                  alt="GooTeranga Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </motion.div>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                      GooTeranga
                    </h2>
                    <p className="text-xs text-orange-600/70 font-medium">
                      {type === 'client' ? 'Touriste, Voyageur' : 'Prestataire'}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* Bouton collapse (desktop seulement) */}
            <motion.button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-white border-2 border-orange-200 shadow-md items-center justify-center hover:bg-orange-50 transition-colors z-10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {isCollapsed ? (
                  <motion.div
                    key="right"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="h-4 w-4 text-orange-600" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="left"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronLeft className="h-4 w-4 text-orange-600" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>

          {/* Navigation */}
          <nav className="flex-1 p-3 sm:p-4 space-y-2 overflow-y-auto">
            {items.map((item, index) => {
              const Icon = item.icon
              const isActive = activeSection === item.id
              
              return (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onSectionChange(item.id)
                    setIsMobileOpen(false)
                  }}
                  className={cn(
                    'w-full flex items-center gap-3 rounded-xl transition-all duration-200 text-left group',
                    isCollapsed ? 'justify-center px-2 py-3' : 'px-3 sm:px-4 py-3',
                    isActive
                      ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg shadow-orange-500/30'
                      : 'text-orange-700 hover:bg-orange-100/50 hover:shadow-md'
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <motion.div 
                    className={cn(
                      'flex items-center justify-center rounded-lg transition-all flex-shrink-0',
                      isCollapsed ? 'w-10 h-10' : 'w-8 h-8',
                      isActive
                        ? 'bg-white/20'
                        : 'bg-orange-100 group-hover:bg-orange-200'
                    )}
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon className={cn(
                      'h-4 w-4',
                      isActive ? 'text-white' : 'text-orange-600'
                    )} />
                  </motion.div>
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center flex-1 gap-2"
                      >
                        <span className={cn(
                          'font-medium flex-1 whitespace-nowrap',
                          isActive ? 'text-white' : 'text-orange-800'
                        )}>
                          {item.label}
                        </span>
                        {item.emoji && (
                          <motion.span 
                            className="text-lg"
                            animate={isActive ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
                            transition={{ duration: 0.5, repeat: isActive ? Infinity : 0, repeatDelay: 2 }}
                          >
                            {item.emoji}
                          </motion.span>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              )
            })}
          </nav>

          {/* Footer actions */}
          <motion.div 
            className="p-3 sm:p-4 border-t border-orange-200/50 space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="outline"
                asChild
                className={cn(
                  'w-full text-orange-700 border-orange-200 hover:bg-orange-100 transition-all',
                  isCollapsed ? 'justify-center px-2' : 'justify-start'
                )}
                title={isCollapsed ? 'Explorer' : undefined}
              >
                <Link href="/explorer">
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <Compass className="h-4 w-4" />
                  </motion.div>
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span 
                        className="ml-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        Explorer
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </Button>
            </motion.div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div 
                  className="text-center text-xs text-orange-600/60 pt-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <p>✨ Bienvenue au Sénégal</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Superposition mobile */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-30"
              onClick={() => setIsMobileOpen(false)}
            />
          )}
        </AnimatePresence>
      </motion.aside>
    </>
  )
}

