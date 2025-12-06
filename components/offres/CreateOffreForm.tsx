'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Upload,
  X,
  Image as ImageIcon,
  Video,
  Zap,
  Loader2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type OffreType = 'HEBERGEMENT' | 'GUIDE' | 'ACTIVITE' | 'RESTAURANT' | 'CULTURE' | 'EVENEMENT'

interface CreateOffreFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function CreateOffreForm({ onSuccess, onCancel }: CreateOffreFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    type: '' as OffreType | '',
    region: '',
    ville: '',
    adresse: '',
    prix: '',
    prixUnite: '',
    duree: '',
    capacite: '',
  })

  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [videos, setVideos] = useState<File[]>([])
  const [videoPreviews, setVideoPreviews] = useState<{ file: File; duration: number; url: string }[]>([])
  const [videoErrors, setVideoErrors] = useState<string[]>([])

  const [boostEnabled, setBoostEnabled] = useState(false)
  const [boostDuree, setBoostDuree] = useState<'jour' | 'semaine' | 'mois'>('semaine')

  const MAX_IMAGES = 3
  const MIN_VIDEO_DURATION = 30 // secondes
  const MAX_VIDEO_DURATION = 60 // secondes

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    if (images.length + files.length > MAX_IMAGES) {
      setError(`Maximum ${MAX_IMAGES} images autorisées`)
      return
    }

    const newImages = [...images, ...files]
    setImages(newImages)

    // Créer les previews
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreviews((prev) => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const errors: string[] = []

    for (const file of files) {
      // Vérifier la durée de la vidéo
      const duration = await getVideoDuration(file)
      
      if (duration < MIN_VIDEO_DURATION || duration > MAX_VIDEO_DURATION) {
        errors.push(
          `${file.name}: Durée invalide (${duration}s). La vidéo doit faire entre ${MIN_VIDEO_DURATION}s et ${MAX_VIDEO_DURATION}s`
        )
        continue
      }

      const url = URL.createObjectURL(file)
      setVideos((prev) => [...prev, file])
      setVideoPreviews((prev) => [...prev, { file, duration, url }])
    }

    if (errors.length > 0) {
      setVideoErrors(errors)
      setTimeout(() => setVideoErrors([]), 5000)
    }
  }

  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const video = document.createElement('video')
      video.preload = 'metadata'
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src)
        resolve(video.duration)
      }
      video.src = URL.createObjectURL(file)
    })
  }

  const removeVideo = (index: number) => {
    const preview = videoPreviews[index]
    URL.revokeObjectURL(preview.url)
    setVideos((prev) => prev.filter((_, i) => i !== index))
    setVideoPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Validation
      if (!formData.titre || !formData.description || !formData.type || !formData.prix) {
        throw new Error('Veuillez remplir tous les champs obligatoires')
      }

      if (images.length > MAX_IMAGES) {
        throw new Error(`Maximum ${MAX_IMAGES} images autorisées`)
      }

      // Vérifier les durées des vidéos
      for (const preview of videoPreviews) {
        if (preview.duration < MIN_VIDEO_DURATION || preview.duration > MAX_VIDEO_DURATION) {
          throw new Error(
            `La vidéo "${preview.file.name}" a une durée invalide (${preview.duration}s). Durée requise: ${MIN_VIDEO_DURATION}s-${MAX_VIDEO_DURATION}s`
          )
        }
      }

      // Upload des images et vidéos (à implémenter avec votre service de stockage)
      // Pour l'instant, on simule avec des URLs
      const imageUrls: string[] = [] // TODO: Upload images
      const videoUrls: string[] = [] // TODO: Upload videos

      // Créer l'offre
      const offreData = {
        titre: formData.titre,
        description: formData.description,
        type: formData.type,
        region: formData.region || null,
        ville: formData.ville || null,
        adresse: formData.adresse || null,
        prix: parseFloat(formData.prix),
        prixUnite: formData.prixUnite || null,
        images: imageUrls,
        videos: videoUrls,
        duree: formData.duree ? parseInt(formData.duree) : null,
        capacite: formData.capacite ? parseInt(formData.capacite) : null,
      }

      const response = await fetch('/api/offres', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(offreData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création de l\'offre')
      }

      const offreId = data.data.id

      // Si boost activé, créer le boost
      if (boostEnabled && offreId) {
        const boostResponse = await fetch('/api/boosts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'EXPERIENCE',
            offreId,
            duree: boostDuree,
            methode: 'boosts_disponibles', // Utiliser les boosts disponibles
          }),
        })

        const boostData = await boostResponse.json()
        if (!boostResponse.ok) {
          console.warn('Erreur lors de la création du boost:', boostData.error)
          // Ne pas bloquer la création de l'offre si le boost échoue
        }
      }

      if (onSuccess) {
        onSuccess()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  const boostPricing = {
    jour: 1000,
    semaine: 6000,
    mois: 15000,
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800"
        >
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </motion.div>
      )}

      <AnimatePresence>
        {videoErrors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
          >
            {videoErrors.map((err, i) => (
              <div key={i} className="text-yellow-800 text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>{err}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Informations de base */}
      <Card>
        <CardHeader>
          <CardTitle>Informations de base</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titre">Titre *</Label>
            <Input
              id="titre"
              value={formData.titre}
              onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={5}
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as OffreType })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HEBERGEMENT">Hébergement</SelectItem>
                  <SelectItem value="GUIDE">Guide</SelectItem>
                  <SelectItem value="ACTIVITE">Activité</SelectItem>
                  <SelectItem value="RESTAURANT">Restaurant</SelectItem>
                  <SelectItem value="CULTURE">Culture</SelectItem>
                  <SelectItem value="EVENEMENT">Événement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prix">Prix (FCFA) *</Label>
              <Input
                id="prix"
                type="number"
                min="0"
                step="0.01"
                value={formData.prix}
                onChange={(e) => setFormData({ ...formData, prix: e.target.value })}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Images (max 3) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Images
          </CardTitle>
          <CardDescription>
            Maximum {MAX_IMAGES} images ({images.length}/{MAX_IMAGES} utilisées)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {images.length < MAX_IMAGES && (
            <div>
              <Label htmlFor="images">Ajouter des images</Label>
              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="mt-2"
              />
            </div>
          )}

          {images.length >= MAX_IMAGES && (
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Limite de {MAX_IMAGES} images atteinte
            </p>
          )}
        </CardContent>
      </Card>

      {/* Vidéos (30s-1mn) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Vidéos
          </CardTitle>
          <CardDescription>
            Durée requise: {MIN_VIDEO_DURATION}s - {MAX_VIDEO_DURATION}s
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {videoPreviews.length > 0 && (
            <div className="space-y-3">
              {videoPreviews.map((preview, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Video className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{preview.file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Durée: {preview.duration.toFixed(1)}s
                        {preview.duration >= MIN_VIDEO_DURATION &&
                        preview.duration <= MAX_VIDEO_DURATION ? (
                          <Badge variant="default" className="ml-2 bg-green-500">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Valide
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="ml-2">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Durée invalide
                          </Badge>
                        )}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeVideo(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div>
            <Label htmlFor="videos">Ajouter une vidéo</Label>
            <Input
              id="videos"
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Durée minimale: {MIN_VIDEO_DURATION}s, maximale: {MAX_VIDEO_DURATION}s
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Option Boost */}
      <Card className="border-orange-200 bg-orange-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-600" />
            Booster cette offre
          </CardTitle>
          <CardDescription>
            Augmentez la visibilité de votre offre dès sa création
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="boostEnabled"
              checked={boostEnabled}
              onChange={(e) => setBoostEnabled(e.target.checked)}
              className="h-4 w-4"
            />
            <Label htmlFor="boostEnabled" className="cursor-pointer">
              Activer le boost pour cette offre
            </Label>
          </div>

          {boostEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-4 pt-4 border-t"
            >
              <div className="space-y-2">
                <Label htmlFor="boostDuree">Durée du boost</Label>
                <Select
                  value={boostDuree}
                  onValueChange={(value) =>
                    setBoostDuree(value as 'jour' | 'semaine' | 'mois')
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jour">1 jour - {boostPricing.jour.toLocaleString()} FCFA</SelectItem>
                    <SelectItem value="semaine">
                      7 jours - {boostPricing.semaine.toLocaleString()} FCFA
                    </SelectItem>
                    <SelectItem value="mois">
                      30 jours - {boostPricing.mois.toLocaleString()} FCFA
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 bg-white rounded-lg border">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Prix du boost</span>
                  <span className="text-2xl font-bold text-orange-600">
                    {boostPricing[boostDuree].toLocaleString()} FCFA
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Le boost sera débité de vos boosts disponibles ou facturé
                </p>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Création...
            </>
          ) : (
            'Créer l\'offre'
          )}
        </Button>
      </div>
    </form>
  )
}


