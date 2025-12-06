'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { X, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Theme {
  id: string
  label: string
  emoji: string
  color: string
  tags: string[] // Tags associés à ce thème
}

// Thèmes prédéfinis basés sur le plan d'améliorations
export const themes: Theme[] = [
  {
    id: 'culture',
    label: 'Culture & Patrimoine',
    emoji: '🎭',
    color: 'from-purple-500 to-pink-500',
    tags: ['musée', 'patrimoine', 'histoire', 'artisanat', 'tradition', 'culture', 'art', 'monument']
  },
  {
    id: 'religion',
    label: 'Religion & Spiritualité',
    emoji: '🕌',
    color: 'from-blue-500 to-cyan-500',
    tags: ['religion', 'spiritualité', 'pèlerinage', 'retraite', 'mosquée', 'église', 'temple', 'saint']
  },
  {
    id: 'ecotourisme',
    label: 'Écotourisme',
    emoji: '🌿',
    color: 'from-green-500 to-emerald-500',
    tags: ['écotourisme', 'nature', 'parc', 'réserve', 'durable', 'environnement', 'faune', 'flore', 'safari']
  },
  {
    id: 'gastronomie',
    label: 'Gastronomie',
    emoji: '🍽️',
    color: 'from-orange-500 to-red-500',
    tags: ['gastronomie', 'restaurant', 'cuisine', 'marché', 'atelier', 'dégustation', 'local', 'traditionnel']
  },
  {
    id: 'aventure',
    label: 'Aventure',
    emoji: '🏄',
    color: 'from-yellow-500 to-orange-500',
    tags: ['aventure', 'sport', 'nautique', 'randonnée', 'outdoor', 'extrême', 'escalade', 'plongée']
  },
  {
    id: 'plage',
    label: 'Plage & Détente',
    emoji: '🏖️',
    color: 'from-cyan-500 to-blue-500',
    tags: ['plage', 'détente', 'bain', 'soleil', 'sable', 'océan', 'baignade', 'relaxation']
  },
  {
    id: 'festival',
    label: 'Festivals & Événements',
    emoji: '🎉',
    color: 'from-pink-500 to-rose-500',
    tags: ['festival', 'événement', 'concert', 'célébration', 'fête', 'spectacle', 'danse', 'musique']
  },
  {
    id: 'shopping',
    label: 'Shopping & Artisanat',
    emoji: '🛍️',
    color: 'from-indigo-500 to-purple-500',
    tags: ['shopping', 'artisanat', 'marché', 'souvenir', 'boutique', 'artisan', 'local', 'traditionnel']
  },
  {
    id: 'bien-etre',
    label: 'Bien-être',
    emoji: '🧘',
    color: 'from-teal-500 to-green-500',
    tags: ['bien-être', 'spa', 'massage', 'relaxation', 'yoga', 'méditation', 'santé', 'détente']
  }
]

interface ThemeFiltersProps {
  selectedThemes: string[]
  onThemesChange: (themes: string[]) => void
  className?: string
}

export function ThemeFilters({ selectedThemes, onThemesChange, className }: ThemeFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleTheme = (themeId: string) => {
    if (selectedThemes.includes(themeId)) {
      onThemesChange(selectedThemes.filter(id => id !== themeId))
    } else {
      onThemesChange([...selectedThemes, themeId])
    }
  }

  const clearAll = () => {
    onThemesChange([])
  }

  const selectedThemesData = themes.filter(t => selectedThemes.includes(t.id))

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header avec compteur */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-orange-500" />
          <h3 className="font-semibold text-lg">Filtrer par thèmes</h3>
          {selectedThemes.length > 0 && (
            <Badge className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
              {selectedThemes.length}
            </Badge>
          )}
        </div>
        {selectedThemes.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="h-8 text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Tout effacer
          </Button>
        )}
      </div>

      {/* Thèmes sélectionnés (toujours visibles) */}
      {selectedThemesData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="flex flex-wrap gap-2 pb-2"
        >
          {selectedThemesData.map((theme) => (
            <motion.div
              key={theme.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Badge
                className={cn(
                  "px-4 py-2 text-sm cursor-pointer border-2",
                  `bg-gradient-to-r ${theme.color} text-white border-transparent hover:border-white/50`
                )}
                onClick={() => toggleTheme(theme.id)}
              >
                <span className="mr-2">{theme.emoji}</span>
                {theme.label}
                <X className="h-3 w-3 ml-2" />
              </Badge>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Bouton pour afficher/masquer tous les thèmes */}
      <Button
        variant="outline"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full justify-between"
      >
        <span>{isExpanded ? 'Masquer' : 'Afficher'} tous les thèmes</span>
        <motion.span
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ▼
        </motion.span>
      </Button>

      {/* Liste complète des thèmes */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
          >
            {themes.map((theme, index) => {
              const isSelected = selectedThemes.includes(theme.id)
              return (
                <motion.div
                  key={theme.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <button
                    onClick={() => toggleTheme(theme.id)}
                    className={cn(
                      "w-full p-4 rounded-xl border-2 transition-all duration-200 text-left",
                      "hover:shadow-lg",
                      isSelected
                        ? `bg-gradient-to-r ${theme.color} text-white border-transparent shadow-md`
                        : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-orange-300"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "text-3xl p-2 rounded-lg",
                        isSelected ? "bg-white/20" : "bg-gray-100 dark:bg-gray-700"
                      )}>
                        {theme.emoji}
                      </div>
                      <div className="flex-1">
                        <h4 className={cn(
                          "font-semibold text-sm",
                          isSelected ? "text-white" : "text-gray-900 dark:text-gray-100"
                        )}>
                          {theme.label}
                        </h4>
                        <p className={cn(
                          "text-xs mt-1",
                          isSelected ? "text-white/80" : "text-gray-500 dark:text-gray-400"
                        )}>
                          {theme.tags.length} mots-clés
                        </p>
                      </div>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-6 h-6 rounded-full bg-white flex items-center justify-center"
                        >
                          <span className="text-orange-500 text-xs">✓</span>
                        </motion.div>
                      )}
                    </div>
                  </button>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Fonction utilitaire pour obtenir les tags d'un thème
export function getThemeTags(themeIds: string[]): string[] {
  return themes
    .filter(theme => themeIds.includes(theme.id))
    .flatMap(theme => theme.tags)
}

// Fonction utilitaire pour vérifier si une offre correspond aux thèmes sélectionnés
export function matchesThemes(offreTags: string[], selectedThemeIds: string[]): boolean {
  if (selectedThemeIds.length === 0) return true
  
  const themeTags = getThemeTags(selectedThemeIds)
  const offreTagsLower = offreTags.map(tag => tag.toLowerCase())
  const themeTagsLower = themeTags.map(tag => tag.toLowerCase())
  
  // Vérifier si au moins un tag de l'offre correspond à un tag des thèmes sélectionnés
  return offreTagsLower.some(tag => themeTagsLower.includes(tag))
}

