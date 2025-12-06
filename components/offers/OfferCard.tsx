'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Star, 
  MapPin, 
  Heart, 
  Share2, 
  MessageSquare, 
  ThumbsUp,
  Eye,
  Play,
  Clock,
  Users
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface OfferCardProps {
  id: string
  titre: string
  description: string
  prix: number
  prixUnite?: string | null
  image: string
  videos?: string[]
  rating: number
  nombreAvis: number
  nombreLikes: number
  vuesVideo: number
  prestataire: {
    nomEntreprise: string
    logo?: string | null
  }
  lieu: string
  region?: string
  ville?: string
  isFavorite?: boolean
  isLiked?: boolean
  onToggleFavorite?: (offreId: string) => void
  onToggleLike?: (offreId: string) => void
  onShare?: (offreId: string) => void
  className?: string
}

export function OfferCard({
  id,
  titre,
  description,
  prix,
  prixUnite,
  image,
  videos = [],
  rating,
  nombreAvis,
  nombreLikes,
  vuesVideo,
  prestataire,
  lieu,
  isFavorite = false,
  isLiked = false,
  onToggleFavorite,
  onToggleLike,
  onShare,
  className
}: OfferCardProps) {
  const [isFav, setIsFav] = useState(isFavorite)
  const [isLikedState, setIsLikedState] = useState(isLiked)
  const [likesCount, setLikesCount] = useState(nombreLikes)

  const handleToggleFavorite = () => {
    setIsFav(!isFav)
    onToggleFavorite?.(id)
  }

  const handleToggleLike = () => {
    const newLiked = !isLikedState
    setIsLikedState(newLiked)
    setLikesCount(prev => newLiked ? prev + 1 : prev - 1)
    onToggleLike?.(id)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: titre,
        text: description,
        url: `${window.location.origin}/experience/${id}`
      }).catch(() => {
        // Fallback si l'utilisateur annule
      })
    } else {
      // Fallback : copier le lien dans le presse-papier
      navigator.clipboard.writeText(`${window.location.origin}/experience/${id}`)
      onShare?.(id)
    }
  }

  return (
    <Card className={cn("overflow-hidden group hover:shadow-xl transition-all duration-300 border-2 hover:border-orange-400", className)}>
      <div className="relative h-64 bg-gradient-to-br from-orange-500 to-yellow-500">
        <Image
          src={image}
          alt={titre}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        {/* Badge Prix */}
        <Badge className="absolute top-4 right-4 bg-white text-orange-600 border-orange-600 font-semibold text-sm px-3 py-1">
          {prix.toLocaleString()} FCFA
          {prixUnite && <span className="text-xs ml-1">/{prixUnite}</span>}
        </Badge>

        {/* Nombre de vues vidéo */}
        {videos.length > 0 && vuesVideo > 0 && (
          <Badge className="absolute top-4 left-4 bg-black/60 text-white border-0 backdrop-blur-sm">
            <Eye className="h-3 w-3 mr-1" />
            {vuesVideo.toLocaleString()} vues
          </Badge>
        )}

        {/* Boutons d'action */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              size="icon"
              variant="secondary"
              className={cn(
                "h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white",
                isFav && "bg-red-500 hover:bg-red-600 text-white"
              )}
              onClick={handleToggleFavorite}
            >
              <Heart className={cn("h-4 w-4", isFav && "fill-current")} />
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              size="icon"
              variant="secondary"
              className="h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>

        {/* Informations en bas de l'image */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-bold text-white mb-1 line-clamp-2">{titre}</h3>
          <div className="flex items-center gap-2 text-white/90 text-sm">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{lieu}</span>
          </div>
        </div>
      </div>

      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          {/* Nom du prestataire avec avatar */}
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={prestataire.logo || undefined} />
              <AvatarFallback className="bg-gradient-to-br from-orange-400 to-yellow-400 text-white text-xs">
                {prestataire.nomEntreprise.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {prestataire.nomEntreprise}
            </span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold">{rating.toFixed(1)}</span>
            {nombreAvis > 0 && (
              <span className="text-xs text-muted-foreground">({nombreAvis})</span>
            )}
          </div>
        </div>

        <CardDescription className="text-base line-clamp-2">{description}</CardDescription>
      </CardHeader>

      <CardContent>
        {/* Actions sociales */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b">
          <div className="flex items-center gap-4">
            {/* Like */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleToggleLike}
              className={cn(
                "flex items-center gap-1 text-sm transition-colors",
                isLikedState 
                  ? "text-blue-600 dark:text-blue-400" 
                  : "text-gray-600 dark:text-gray-400 hover:text-blue-600"
              )}
            >
              <ThumbsUp className={cn("h-4 w-4", isLikedState && "fill-current")} />
              <span>{likesCount}</span>
            </motion.button>

            {/* Commentaires */}
            <Link 
              href={`/experience/${id}#comments`}
              className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-orange-600 transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Commenter</span>
            </Link>
          </div>

          {/* Évaluation 5 étoiles */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "h-4 w-4",
                  star <= Math.round(rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300 dark:text-gray-600"
                )}
              />
            ))}
          </div>
        </div>

        {/* Bouton principal */}
        <Button asChild className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold">
          <Link href={`/experience/${id}`}>
            Voir les détails
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

