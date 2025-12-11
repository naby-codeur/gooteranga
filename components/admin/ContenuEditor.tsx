'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Save, Image as ImageIcon, Video, FileText, X, Plus, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'

interface ContenuSection {
  id: string
  type: 'text' | 'image' | 'video' | 'title'
  content: string
  url?: string
}

interface ContenuEditable {
  id?: string
  page: string
  titre?: string
  contenu: {
    sections: ContenuSection[]
  }
  meta?: {
    description?: string
    keywords?: string
  }
  version?: number
}

interface ContenuEditorProps {
  pageId: string
  pageName: string
  onSave?: () => void
}

export function ContenuEditor({ pageId, pageName, onSave }: ContenuEditorProps) {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [contenu, setContenu] = useState<ContenuEditable | null>(null)
  const [titre, setTitre] = useState('')
  const [description, setDescription] = useState('')
  const [sections, setSections] = useState<ContenuSection[]>([])

  useEffect(() => {
    loadContenu()
  }, [pageId])

  const loadContenu = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/contenu?page=${pageId}`)
      if (!response.ok) {
        console.error('Failed to fetch contenu:', response.status, response.statusText)
        setSections([])
        setLoading(false)
        return
      }
      
      const data = await response.json()
      
      if (data.success && data.data) {
        const contenuData = data.data
        setContenu(contenuData)
        setTitre(contenuData.titre || '')
        setDescription(contenuData.meta?.description || '')
        
        // Parser le contenu JSON avec gestion d'erreur robuste
        try {
          if (typeof contenuData.contenu === 'string') {
            try {
              const parsed = JSON.parse(contenuData.contenu)
              setSections(Array.isArray(parsed.sections) ? parsed.sections : [])
            } catch (parseError) {
              console.error('Erreur lors du parsing du contenu JSON (string):', parseError)
              setSections([])
            }
          } else if (contenuData.contenu && typeof contenuData.contenu === 'object') {
            // Si c'est déjà un objet, vérifier qu'il a la structure attendue
            if (Array.isArray(contenuData.contenu.sections)) {
              setSections(contenuData.contenu.sections)
            } else {
              // Essayer de sérialiser/désérialiser pour valider
              try {
                const validated = JSON.parse(JSON.stringify(contenuData.contenu))
                setSections(Array.isArray(validated.sections) ? validated.sections : [])
              } catch (validationError) {
                console.error('Erreur lors de la validation du contenu JSON:', validationError)
                setSections([])
              }
            }
          } else {
            setSections([])
          }
        } catch (error) {
          console.error('Erreur générale lors du traitement du contenu:', error)
          setSections([])
        }
      } else {
        // Initialiser avec des sections vides
        setSections([])
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error)
      setSections([])
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const contenuData = {
        page: pageId,
        titre,
        contenu: {
          sections,
        },
        meta: {
          description,
        },
      }

      const response = await fetch('/api/admin/contenu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contenuData),
      })

      const data = await response.json()
      if (response.ok && data.success) {
        alert('Contenu sauvegardé avec succès !')
        onSave?.()
      } else {
        alert(data.error || 'Erreur lors de la sauvegarde')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  const addSection = (type: ContenuSection['type']) => {
    const newSection: ContenuSection = {
      id: Date.now().toString(),
      type,
      content: '',
      url: type === 'image' || type === 'video' ? '' : undefined,
    }
    setSections([...sections, newSection])
  }

  const updateSection = (id: string, updates: Partial<ContenuSection>) => {
    setSections(sections.map(s => s.id === id ? { ...s, ...updates } : s))
  }

  const deleteSection = (id: string) => {
    setSections(sections.filter(s => s.id !== id))
  }

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...sections]
    if (direction === 'up' && index > 0) {
      [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]]
    } else if (direction === 'down' && index < newSections.length - 1) {
      [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]]
    }
    setSections(newSections)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">Chargement du contenu...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Éditer : {pageName}</CardTitle>
          <CardDescription>
            Modifiez le contenu de cette page. Vous pouvez ajouter du texte, des images et des vidéos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Titre de la page</label>
            <Input
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              placeholder="Titre de la page (optionnel)"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Description (SEO)</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description pour le référencement"
              rows={2}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-medium">Sections de contenu</label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addSection('title')}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Titre
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addSection('text')}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Texte
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addSection('image')}
                >
                  <ImageIcon className="h-4 w-4 mr-1" />
                  Image
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addSection('video')}
                >
                  <Video className="h-4 w-4 mr-1" />
                  Vidéo
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {sections.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                  Aucune section. Cliquez sur les boutons ci-dessus pour ajouter du contenu.
                </div>
              ) : (
                sections.map((section, index) => (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">
                        {section.type === 'title' && 'Titre'}
                        {section.type === 'text' && 'Texte'}
                        {section.type === 'image' && 'Image'}
                        {section.type === 'video' && 'Vidéo'}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => moveSection(index, 'up')}
                          disabled={index === 0}
                        >
                          ↑
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => moveSection(index, 'down')}
                          disabled={index === sections.length - 1}
                        >
                          ↓
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600"
                          onClick={() => deleteSection(section.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {section.type === 'title' && (
                      <Input
                        value={section.content}
                        onChange={(e) => updateSection(section.id, { content: e.target.value })}
                        placeholder="Titre de la section"
                        className="font-semibold text-lg"
                      />
                    )}

                    {section.type === 'text' && (
                      <Textarea
                        value={section.content}
                        onChange={(e) => updateSection(section.id, { content: e.target.value })}
                        placeholder="Contenu texte"
                        rows={6}
                      />
                    )}

                    {(section.type === 'image' || section.type === 'video') && (
                      <div className="space-y-2">
                        <Input
                          value={section.url || ''}
                          onChange={(e) => updateSection(section.id, { url: e.target.value })}
                          placeholder={section.type === 'image' ? 'URL de l\'image' : 'URL de la vidéo'}
                        />
                        {section.url && (
                          <div className="mt-2">
                            {section.type === 'image' ? (
                              <img
                                src={section.url}
                                alt="Preview"
                                className="max-w-full h-auto rounded-lg border"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none'
                                }}
                              />
                            ) : (
                              <video
                                src={section.url}
                                controls
                                className="max-w-full h-auto rounded-lg border"
                              />
                            )}
                          </div>
                        )}
                        <Textarea
                          value={section.content}
                          onChange={(e) => updateSection(section.id, { content: e.target.value })}
                          placeholder="Description ou légende (optionnel)"
                          rows={2}
                        />
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

