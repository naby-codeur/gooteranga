'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface ContenuSection {
  id: string
  type: 'text' | 'image' | 'video' | 'title'
  content: string
  url?: string
}

interface EditableContentProps {
  pageId: string
  defaultContent?: React.ReactNode
}

export function EditableContent({ pageId, defaultContent }: EditableContentProps) {
  const [contenu, setContenu] = useState<{ sections: ContenuSection[] } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadContenu()
  }, [pageId])

  const loadContenu = async () => {
    try {
      const response = await fetch(`/api/admin/contenu?page=${pageId}`)
      if (!response.ok) {
        console.error('Failed to fetch contenu:', response.status, response.statusText)
        setLoading(false)
        return
      }
      
      const data = await response.json()
      
      if (data.success && data.data) {
        const contenuData = data.data
        let sections: ContenuSection[] = []
        
        // Parser le contenu JSON avec gestion d'erreur robuste
        try {
          if (typeof contenuData.contenu === 'string') {
            try {
              const parsed = JSON.parse(contenuData.contenu)
              sections = Array.isArray(parsed.sections) ? parsed.sections : []
            } catch (parseError) {
              console.error('Erreur lors du parsing du contenu JSON (string):', parseError)
              sections = []
            }
          } else if (contenuData.contenu && typeof contenuData.contenu === 'object') {
            // Si c'est déjà un objet, vérifier qu'il a la structure attendue
            if (Array.isArray(contenuData.contenu.sections)) {
              sections = contenuData.contenu.sections
            } else {
              // Essayer de sérialiser/désérialiser pour valider
              try {
                const validated = JSON.parse(JSON.stringify(contenuData.contenu))
                sections = Array.isArray(validated.sections) ? validated.sections : []
              } catch (validationError) {
                console.error('Erreur lors de la validation du contenu JSON:', validationError)
                sections = []
              }
            }
          }
        } catch (error) {
          console.error('Erreur générale lors du traitement du contenu:', error)
          sections = []
        }
        
        if (sections.length > 0) {
          setContenu({ sections })
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement du contenu:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <>{defaultContent}</>
  }

  if (!contenu || contenu.sections.length === 0) {
    return <>{defaultContent}</>
  }

  return (
    <div className="space-y-6">
      {contenu.sections.map((section, index) => (
        <motion.div
          key={section.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          {section.type === 'title' && (
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
              {section.content}
            </h2>
          )}

          {section.type === 'text' && (
            <div 
              className="prose prose-orange max-w-none text-muted-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ __html: section.content.replace(/\n/g, '<br />') }}
            />
          )}

          {section.type === 'image' && section.url && (
            <div className="space-y-2">
              <div className="relative w-full h-64 sm:h-96 rounded-lg overflow-hidden">
                <Image
                  src={section.url}
                  alt={section.content || 'Image'}
                  fill
                  className="object-cover"
                />
              </div>
              {section.content && (
                <p className="text-sm text-muted-foreground italic text-center">
                  {section.content}
                </p>
              )}
            </div>
          )}

          {section.type === 'video' && section.url && (
            <div className="space-y-2">
              <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                <video
                  src={section.url}
                  controls
                  className="w-full h-full object-cover"
                />
              </div>
              {section.content && (
                <p className="text-sm text-muted-foreground italic text-center">
                  {section.content}
                </p>
              )}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}

