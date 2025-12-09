'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
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
  X,
  Image as ImageIcon,
  Video,
  Zap,
  Loader2,
  AlertCircle,
  CheckCircle,
  MapPin,
  Tag,
  Calendar,
  Clock,
  Users,
  DollarSign,
  Globe,
  Building,
  Navigation,
  Plus,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

type OffreType = 'HEBERGEMENT' | 'GUIDE' | 'ACTIVITE' | 'RESTAURANT' | 'CULTURE' | 'EVENEMENT'

interface CreateOffreFormProps {
  offreId?: string
  onSuccess?: () => void
  onCancel?: () => void
}

export function CreateOffreForm({ offreId, onSuccess, onCancel }: CreateOffreFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    type: '' as OffreType | '',
    region: '',
    ville: '',
    adresse: '',
    latitude: '',
    longitude: '',
    prix: '',
    prixUnite: 'personne',
    duree: '',
    capacite: '',
    tags: [] as string[],
    disponibilite: {
      lundi: { ouvert: true, heures: { debut: '09:00', fin: '18:00' } },
      mardi: { ouvert: true, heures: { debut: '09:00', fin: '18:00' } },
      mercredi: { ouvert: true, heures: { debut: '09:00', fin: '18:00' } },
      jeudi: { ouvert: true, heures: { debut: '09:00', fin: '18:00' } },
      vendredi: { ouvert: true, heures: { debut: '09:00', fin: '18:00' } },
      samedi: { ouvert: true, heures: { debut: '09:00', fin: '18:00' } },
      dimanche: { ouvert: false, heures: { debut: '09:00', fin: '18:00' } },
    },
  })

  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [videos, setVideos] = useState<File[]>([])
  const [videoPreviews, setVideoPreviews] = useState<{ file: File; duration: number; url: string }[]>([])
  const [videoErrors, setVideoErrors] = useState<string[]>([])

  const [boostEnabled, setBoostEnabled] = useState(false)
  const [boostDuree, setBoostDuree] = useState<'jour' | 'semaine' | 'mois'>('semaine')
  const [selectedTag, setSelectedTag] = useState('')
  
  // Tags disponibles selon le type d'offre
  const availableTags = {
    HEBERGEMENT: ['Hôtel', 'Auberge', 'Villa', 'Appartement', 'Camping', 'Eco-lodge', 'Résidence'],
    GUIDE: ['Culture', 'Histoire', 'Nature', 'Gastronomie', 'Aventure', 'Religieux', 'Architecture'],
    ACTIVITE: ['Plage', 'Sport', 'Détente', 'Aventure', 'Culture', 'Nature', 'Famille', 'Romantique'],
    RESTAURANT: ['Traditionnel', 'Moderne', 'Fast-food', 'Gastronomique', 'Végétarien', 'Halal', 'Bar'],
    CULTURE: ['Musée', 'Monument', 'Art', 'Musique', 'Danse', 'Théâtre', 'Festival'],
    EVENEMENT: ['Concert', 'Festival', 'Conférence', 'Exposition', 'Spectacle', 'Sport'],
  }
  
  const prixUniteOptions = {
    HEBERGEMENT: ['nuit', 'semaine', 'mois'],
    GUIDE: ['personne', 'groupe', 'jour'],
    ACTIVITE: ['personne', 'groupe', 'session'],
    RESTAURANT: ['personne', 'plat', 'menu'],
    CULTURE: ['personne', 'groupe', 'visite'],
    EVENEMENT: ['personne', 'billet', 'groupe'],
  }

  const MAX_IMAGES = 3
  const MIN_VIDEO_DURATION = 15 // secondes
  const MAX_VIDEO_DURATION = 60 // secondes
  
  // Type de média : soit vidéo, soit images
  const [mediaType, setMediaType] = useState<'video' | 'images'>('images')

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    if (images.length + files.length > MAX_IMAGES) {
      setError(`Maximum ${MAX_IMAGES} images autorisées`)
      return
    }

    // Si on passe en mode images, supprimer les vidéos
    if (mediaType === 'video' && videoPreviews.length > 0) {
      videoPreviews.forEach(preview => URL.revokeObjectURL(preview.url))
      setVideos([])
      setVideoPreviews([])
      setMediaType('images')
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

    // Si on passe en mode vidéo, supprimer les images
    if (mediaType === 'images' && (images.length > 0 || imagePreviews.length > 0)) {
      setImages([])
      setImagePreviews([])
      setMediaType('video')
    }

    // Ne prendre que la première vidéo
    const file = files[0]
    if (!file) return

    // Vérifier la durée de la vidéo
    const duration = await getVideoDuration(file)
    
    if (duration < MIN_VIDEO_DURATION || duration > MAX_VIDEO_DURATION) {
      errors.push(
        `Durée invalide (${Math.round(duration)}s). La vidéo doit faire entre ${MIN_VIDEO_DURATION}s et ${MAX_VIDEO_DURATION}s`
      )
      setVideoErrors(errors)
      setTimeout(() => setVideoErrors([]), 5000)
      return
    }

    // Supprimer l'ancienne vidéo si elle existe
    if (videoPreviews.length > 0) {
      videoPreviews.forEach(preview => URL.revokeObjectURL(preview.url))
    }

    const url = URL.createObjectURL(file)
    setVideos([file])
    setVideoPreviews([{ file, duration, url }])
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

  // Charger les données de l'offre si on est en mode édition
  useEffect(() => {
    if (offreId) {
      const loadOffre = async () => {
        try {
          const response = await fetch(`/api/offres/${offreId}`)
          const data = await response.json()
          
          if (response.ok && data.success && data.data) {
            const offre = data.data
            const defaultDisponibilite = {
              lundi: { ouvert: true, heures: { debut: '09:00', fin: '18:00' } },
              mardi: { ouvert: true, heures: { debut: '09:00', fin: '18:00' } },
              mercredi: { ouvert: true, heures: { debut: '09:00', fin: '18:00' } },
              jeudi: { ouvert: true, heures: { debut: '09:00', fin: '18:00' } },
              vendredi: { ouvert: true, heures: { debut: '09:00', fin: '18:00' } },
              samedi: { ouvert: true, heures: { debut: '09:00', fin: '18:00' } },
              dimanche: { ouvert: false, heures: { debut: '09:00', fin: '18:00' } },
            }
            
            setFormData({
              titre: offre.titre || '',
              description: offre.description || '',
              type: offre.type || '',
              region: offre.region || '',
              ville: offre.ville || '',
              adresse: offre.adresse || '',
              latitude: offre.latitude ? String(offre.latitude) : '',
              longitude: offre.longitude ? String(offre.longitude) : '',
              prix: String(offre.prix || ''),
              prixUnite: offre.prixUnite || 'personne',
              duree: offre.duree ? String(offre.duree) : '',
              capacite: offre.capacite ? String(offre.capacite) : '',
              tags: offre.tags || [],
              disponibilite: offre.disponibilite || defaultDisponibilite,
            })
            
            // Charger les médias existants
            if (offre.images && offre.images.length > 0) {
              setImagePreviews(offre.images)
              setMediaType('images')
            } else if (offre.videos && offre.videos.length > 0) {
              // Pour les vidéos existantes, créer des previews fictives
              setVideoPreviews(offre.videos.map((url: string) => ({
                file: new File([], url),
                duration: 0,
                url
              })))
              setMediaType('video')
            }
          }
        } catch (error) {
          console.error('Error loading offre:', error)
          setError('Erreur lors du chargement de l\'offre')
        }
      }
      
      loadOffre()
    }
  }, [offreId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Validation
      if (!formData.titre || !formData.description || !formData.type || !formData.prix) {
        throw new Error('Veuillez remplir tous les champs obligatoires')
      }

      // Validation : soit vidéo, soit images (pas les deux)
      if (mediaType === 'video') {
        if (videoPreviews.length === 0) {
          throw new Error('Veuillez ajouter une vidéo (15-60 secondes)')
        }
        if (videoPreviews[0].duration < MIN_VIDEO_DURATION || videoPreviews[0].duration > MAX_VIDEO_DURATION) {
          throw new Error(
            `La vidéo a une durée invalide (${Math.round(videoPreviews[0].duration)}s). Durée requise: ${MIN_VIDEO_DURATION}s-${MAX_VIDEO_DURATION}s`
          )
        }
      } else {
        if (images.length === 0 && imagePreviews.filter(url => url.startsWith('http') || url.startsWith('/')).length === 0) {
          throw new Error('Veuillez ajouter au moins une image (maximum 3)')
        }
        if (images.length + imagePreviews.filter(url => url.startsWith('http') || url.startsWith('/')).length > MAX_IMAGES) {
          throw new Error(`Maximum ${MAX_IMAGES} images autorisées`)
        }
      }

      // Upload des images et vidéos (à implémenter avec votre service de stockage)
      // Pour l'instant, on simule avec des URLs
      // En mode édition, conserver les médias existants
      const existingImageUrls = imagePreviews.filter(url => url.startsWith('http') || url.startsWith('/'))
      const imageUrls: string[] = mediaType === 'images' 
        ? (offreId && existingImageUrls.length > 0 && images.length === 0 
          ? existingImageUrls
          : []) // TODO: Upload new images
        : []
      
      const existingVideoUrls = videoPreviews.filter(p => p.url.startsWith('http') || p.url.startsWith('/')).map(p => p.url)
      const videoUrls: string[] = mediaType === 'video'
        ? (offreId && existingVideoUrls.length > 0 && videos.length === 0
          ? existingVideoUrls
          : []) // TODO: Upload new video
        : []

      // Créer ou mettre à jour l'offre
      const offreData = {
        titre: formData.titre,
        description: formData.description,
        type: formData.type,
        region: formData.region || null,
        ville: formData.ville || null,
        adresse: formData.adresse || null,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        prix: parseFloat(formData.prix),
        prixUnite: formData.prixUnite || 'personne',
        images: imageUrls,
        videos: videoUrls,
        duree: formData.duree ? parseInt(formData.duree) : null,
        capacite: formData.capacite ? parseInt(formData.capacite) : null,
        tags: formData.tags,
        disponibilite: formData.disponibilite,
      }

      const url = offreId ? `/api/offres/${offreId}` : '/api/offres'
      const method = offreId ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(offreData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Erreur lors de la ${offreId ? 'modification' : 'création'} de l'offre`)
      }

      const finalOffreId = offreId || data.data.id

      // Si boost activé, créer le boost (seulement en création)
      if (boostEnabled && !offreId && finalOffreId) {
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
      <Card className="border-2">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 border-b">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Building className="h-6 w-6 text-orange-600" />
            Informations de base
          </CardTitle>
          <CardDescription>
            Les informations essentielles de votre offre
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2">
            <Label htmlFor="titre" className="text-base font-semibold flex items-center gap-2">
              <span>Titre de l&apos;offre *</span>
            </Label>
            <Input
              id="titre"
              value={formData.titre}
              onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
              placeholder="Ex: Visite guidée de l&apos;Île de Gorée"
              className="h-11"
              required
            />
            <p className="text-xs text-muted-foreground">Un titre accrocheur augmente vos réservations</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-semibold">Description détaillée *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={6}
              placeholder="Décrivez votre offre en détail. Mentionnez les points forts, les activités incluses, ce qui rend votre offre unique..."
              className="resize-none"
              required
            />
            <p className="text-xs text-muted-foreground">{formData.description.length}/2000 caractères</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="type" className="text-base font-semibold flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Type d&apos;offre *
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) => {
                  setFormData({ 
                    ...formData, 
                    type: value as OffreType,
                    prixUnite: prixUniteOptions[value as OffreType]?.[0] || 'personne',
                    tags: []
                  })
                }}
                required
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HEBERGEMENT">🏨 Hébergement</SelectItem>
                  <SelectItem value="GUIDE">🗺️ Guide touristique</SelectItem>
                  <SelectItem value="ACTIVITE">🎯 Activité</SelectItem>
                  <SelectItem value="RESTAURANT">🍽️ Restaurant</SelectItem>
                  <SelectItem value="CULTURE">🎭 Culture</SelectItem>
                  <SelectItem value="EVENEMENT">🎪 Événement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prix" className="text-base font-semibold flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Prix (FCFA) *
              </Label>
              <div className="flex gap-2">
                <Input
                  id="prix"
                  type="number"
                  min="0"
                  step="100"
                  value={formData.prix}
                  onChange={(e) => setFormData({ ...formData, prix: e.target.value })}
                  placeholder="0"
                  className="h-11 flex-1"
                  required
                />
                {formData.type && (
                  <Select
                    value={formData.prixUnite}
                    onValueChange={(value) => setFormData({ ...formData, prixUnite: value })}
                  >
                    <SelectTrigger className="h-11 w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {prixUniteOptions[formData.type as OffreType]?.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option === 'personne' ? 'Par personne' :
                           option === 'nuit' ? 'Par nuit' :
                           option === 'groupe' ? 'Par groupe' :
                           option === 'jour' ? 'Par jour' :
                           option === 'semaine' ? 'Par semaine' :
                           option === 'mois' ? 'Par mois' :
                           option === 'session' ? 'Par session' :
                           option === 'plat' ? 'Par plat' :
                           option === 'menu' ? 'Par menu' :
                           option === 'visite' ? 'Par visite' :
                           option === 'billet' ? 'Par billet' :
                           option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </div>

          {/* Tags */}
          {formData.type && (
            <div className="space-y-3">
              <Label className="text-base font-semibold flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Tags / Catégories
              </Label>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1.5 text-sm">
                    {tag}
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, tags: formData.tags.filter((_, i) => i !== index) })}
                      className="ml-2 hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              {availableTags[formData.type as OffreType] && (
                <div className="flex gap-2">
                  <Select value={selectedTag} onValueChange={setSelectedTag}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Ajouter un tag" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTags[formData.type as OffreType]
                        .filter(tag => !formData.tags.includes(tag))
                        .map((tag) => (
                          <SelectItem key={tag} value={tag}>
                            {tag}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (selectedTag && !formData.tags.includes(selectedTag)) {
                        setFormData({ ...formData, tags: [...formData.tags, selectedTag] })
                        setSelectedTag('')
                      }
                    }}
                    disabled={!selectedTag}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Localisation */}
      <Card className="border-2">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b">
          <CardTitle className="flex items-center gap-2 text-xl">
            <MapPin className="h-6 w-6 text-blue-600" />
            Localisation
          </CardTitle>
          <CardDescription>
            Où se trouve votre offre ?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="region" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Région *
              </Label>
              <Select
                value={formData.region}
                onValueChange={(value) => setFormData({ ...formData, region: value })}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Sélectionner une région" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dakar">Dakar</SelectItem>
                  <SelectItem value="Thiès">Thiès</SelectItem>
                  <SelectItem value="Saint-Louis">Saint-Louis</SelectItem>
                  <SelectItem value="Ziguinchor">Ziguinchor</SelectItem>
                  <SelectItem value="Tambacounda">Tambacounda</SelectItem>
                  <SelectItem value="Kaolack">Kaolack</SelectItem>
                  <SelectItem value="Kolda">Kolda</SelectItem>
                  <SelectItem value="Matam">Matam</SelectItem>
                  <SelectItem value="Fatick">Fatick</SelectItem>
                  <SelectItem value="Louga">Louga</SelectItem>
                  <SelectItem value="Sédhiou">Sédhiou</SelectItem>
                  <SelectItem value="Kédougou">Kédougou</SelectItem>
                  <SelectItem value="Diourbel">Diourbel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ville">Ville</Label>
              <Input
                id="ville"
                value={formData.ville}
                onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                placeholder="Ex: Dakar"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="adresse">Adresse complète</Label>
              <Input
                id="adresse"
                value={formData.adresse}
                onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                placeholder="Ex: Avenue Léopold Sédar Senghor"
                className="h-11"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="latitude" className="flex items-center gap-2">
                <Navigation className="h-4 w-4" />
                Latitude (optionnel)
              </Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                placeholder="14.7167"
                className="h-11"
              />
              <p className="text-xs text-muted-foreground">Pour la géolocalisation précise</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="longitude" className="flex items-center gap-2">
                <Navigation className="h-4 w-4" />
                Longitude (optionnel)
              </Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                placeholder="-17.4677"
                className="h-11"
              />
              <p className="text-xs text-muted-foreground">Pour la géolocalisation précise</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Détails supplémentaires */}
      <Card className="border-2">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Clock className="h-6 w-6 text-green-600" />
            Détails supplémentaires
          </CardTitle>
          <CardDescription>
            Informations complémentaires sur votre offre
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="duree" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Durée {formData.type === 'HEBERGEMENT' ? '(nuits)' : '(heures)'}
              </Label>
              <Input
                id="duree"
                type="number"
                min="0"
                value={formData.duree}
                onChange={(e) => setFormData({ ...formData, duree: e.target.value })}
                placeholder={formData.type === 'HEBERGEMENT' ? "Ex: 3" : "Ex: 4"}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacite" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Capacité (personnes)
              </Label>
              <Input
                id="capacite"
                type="number"
                min="1"
                value={formData.capacite}
                onChange={(e) => setFormData({ ...formData, capacite: e.target.value })}
                placeholder="Ex: 10"
                className="h-11"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disponibilité */}
      <Card className="border-2">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Calendar className="h-6 w-6 text-purple-600" />
            Disponibilité
          </CardTitle>
          <CardDescription>
            Définissez les jours et horaires d&apos;ouverture
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          {Object.entries(formData.disponibilite).map(([jour, data]) => (
            <div key={jour} className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="flex items-center gap-3 flex-1">
                <input
                  type="checkbox"
                  id={`jour-${jour}`}
                  checked={data.ouvert}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      disponibilite: {
                        ...formData.disponibilite,
                        [jour]: { ...data, ouvert: e.target.checked }
                      }
                    })
                  }}
                  className="h-4 w-4"
                />
                <Label htmlFor={`jour-${jour}`} className="font-medium capitalize cursor-pointer min-w-[100px]">
                  {jour === 'lundi' ? 'Lundi' :
                   jour === 'mardi' ? 'Mardi' :
                   jour === 'mercredi' ? 'Mercredi' :
                   jour === 'jeudi' ? 'Jeudi' :
                   jour === 'vendredi' ? 'Vendredi' :
                   jour === 'samedi' ? 'Samedi' :
                   'Dimanche'}
                </Label>
              </div>
              {data.ouvert && (
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    type="time"
                    value={data.heures.debut}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        disponibilite: {
                          ...formData.disponibilite,
                          [jour]: {
                            ...data,
                            heures: { ...data.heures, debut: e.target.value }
                          }
                        }
                      })
                    }}
                    className="h-10"
                  />
                  <span className="text-muted-foreground">à</span>
                  <Input
                    type="time"
                    value={data.heures.fin}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        disponibilite: {
                          ...formData.disponibilite,
                          [jour]: {
                            ...data,
                            heures: { ...data.heures, fin: e.target.value }
                          }
                        }
                      })
                    }}
                    className="h-10"
                  />
                </div>
              )}
              {!data.ouvert && (
                <Badge variant="secondary" className="ml-auto">Fermé</Badge>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Médias : Vidéo OU Images */}
      <Card className="border-2">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b">
          <CardTitle className="flex items-center gap-2 text-xl">
            <ImageIcon className="h-6 w-6 text-indigo-600" />
            Médias
          </CardTitle>
          <CardDescription>
            Choisissez soit une vidéo (15-60s) soit jusqu&apos;à 3 images
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Sélecteur de type de média */}
          <div className="flex gap-4 p-1 bg-muted rounded-lg">
            <button
              type="button"
              onClick={() => {
                setMediaType('images')
                // Supprimer les vidéos si on passe en mode images
                if (videoPreviews.length > 0) {
                  videoPreviews.forEach(preview => URL.revokeObjectURL(preview.url))
                  setVideos([])
                  setVideoPreviews([])
                }
              }}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md transition-all",
                mediaType === 'images'
                  ? "bg-background text-foreground shadow-sm font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <ImageIcon className="h-5 w-5" />
              <span>Images (max 3)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMediaType('video')
                // Supprimer les images si on passe en mode vidéo
                if (images.length > 0 || imagePreviews.length > 0) {
                  setImages([])
                  setImagePreviews([])
                }
              }}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md transition-all",
                mediaType === 'video'
                  ? "bg-background text-foreground shadow-sm font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Video className="h-5 w-5" />
              <span>Vidéo (15-60s)</span>
            </button>
          </div>

          {/* Section Images */}
          {mediaType === 'images' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <div className="relative w-full h-32 sm:h-40 rounded-lg border overflow-hidden">
                        <Image
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {imagePreviews.length < MAX_IMAGES && (
                <div>
                  <Label htmlFor="images">Ajouter des images ({imagePreviews.length}/{MAX_IMAGES})</Label>
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

              {imagePreviews.length >= MAX_IMAGES && (
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Limite de {MAX_IMAGES} images atteinte
                </p>
              )}
            </motion.div>
          )}

          {/* Section Vidéo */}
          {mediaType === 'video' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {videoPreviews.length > 0 && (
                <div className="space-y-3">
                  {videoPreviews.map((preview, index) => (
                    <div
                      key={index}
                      className="relative border rounded-lg overflow-hidden bg-muted/50"
                    >
                      <video
                        src={preview.url}
                        className="w-full h-48 sm:h-64 object-cover"
                        controls
                        loop
                        muted
                      />
                      <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Video className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{preview.file.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Durée: {Math.round(preview.duration)}s
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
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {videoPreviews.length === 0 && (
                <div>
                  <Label htmlFor="videos">Ajouter une vidéo</Label>
                  <Input
                    id="videos"
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    Durée requise: {MIN_VIDEO_DURATION}s - {MAX_VIDEO_DURATION}s (lecture en boucle)
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Option Boost */}
      <Card className="border-2 border-orange-300 bg-gradient-to-r from-orange-50 to-yellow-50">
        <CardHeader className="border-b border-orange-200">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Zap className="h-6 w-6 text-orange-600" />
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
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border-2">
        <div className="text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Rappel</p>
          <p>Vérifiez toutes les informations avant de soumettre votre offre</p>
        </div>
        <div className="flex gap-3">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} className="min-w-[120px]">
              Annuler
            </Button>
          )}
          <Button 
            type="submit" 
            disabled={isLoading}
            className="min-w-[160px] bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-white font-semibold shadow-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {offreId ? 'Modification...' : 'Création...'}
              </>
            ) : (
              <>
                    {offreId ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Modifier l&apos;offre
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Créer l&apos;offre
                      </>
                    )}
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}


