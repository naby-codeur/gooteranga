'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Camera, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AvatarUploadProps {
  currentImage?: string | null
  onImageChange?: (file: File | null) => void
  label?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function AvatarUpload({
  currentImage,
  onImageChange,
  label = 'Photo de profil',
  size = 'md',
  className,
}: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sizeClasses = {
    sm: 'h-16 w-16',
    md: 'h-24 w-24',
    lg: 'h-32 w-32',
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image')
      return
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('L\'image ne doit pas dépasser 5MB')
      return
    }

    setIsUploading(true)

    // Créer un preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
      setIsUploading(false)
      onImageChange?.(file)
    }
    reader.readAsDataURL(file)
  }

  const handleRemove = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onImageChange?.(null)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      <div className="relative group">
        <div
          className={cn(
            'relative rounded-full overflow-hidden border-4 border-orange-200 bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center',
            sizeClasses[size]
          )}
        >
          {preview ? (
            <Image
              src={preview}
              alt={label}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-orange-400">
              <Camera className="h-8 w-8" />
            </div>
          )}
          
          {/* Overlay au survol */}
          <div
            onClick={handleClick}
            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
          >
            <Camera className="h-6 w-6 text-white" />
          </div>
        </div>

        {/* Bouton supprimer si image présente */}
        {preview && (
          <button
            onClick={handleRemove}
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex flex-col items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleClick}
          disabled={isUploading}
          className="bg-white border-orange-200 hover:bg-orange-50 text-orange-700"
        >
          {isUploading ? 'Téléchargement...' : preview ? 'Changer' : 'Ajouter une photo'}
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          {label}
          <br />
          <span className="text-[10px]">JPG, PNG (max 5MB)</span>
        </p>
      </div>
    </div>
  )
}


