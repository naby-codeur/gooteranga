'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DashboardSidebar } from '@/components/layout/DashboardSidebar'
import { DashboardHeader } from '@/components/layout/DashboardHeader'
import { AvatarUpload } from '@/components/ui/avatar-upload'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, 
  Heart, 
  MessageSquare, 
  MapPin,
  Star,
  Clock,
  CreditCard,
  DollarSign,
  TrendingDown,
  Receipt,
  Filter,
  Loader2,
  Plus,
  Trash2,
  Search,
  X,
  Bell,
  Check
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/lib/hooks/useAuth'
import { useReservations } from '@/lib/hooks/useReservations'
import { useFavoris } from '@/lib/hooks/useFavoris'
import { useDepenses } from '@/lib/hooks/useDepenses'
import { useNotifications } from '@/lib/hooks/useNotifications'
import { ChatInterface } from '@/components/messaging/ChatInterface'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/routing'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  getTouristeConversations, 
  getMessagesForConversation,
  type MockMessage 
} from '@/lib/mock-messaging-data'

// Type pour les données de dépense
type DepenseFormData = {
  titre: string
  description?: string
  categorie: string
  montant: number
  date?: string
  lieu?: string
  methode?: string
}

// Type pour les dépenses affichées
type DepenseDisplay = {
  id: string
  titre: string
  type: string
  date: string
  montant: number
  statut: string
  methode: string
  sejour: string
  isHorsPlateforme: boolean
  description?: string
  lieu?: string
}

// Composant pour le formulaire d'ajout de dépense
function AddDepenseForm({ onSuccess, addDepense }: { onSuccess: () => void; addDepense: (data: DepenseFormData) => Promise<unknown> }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    categorie: '',
    montant: '',
    date: new Date().toISOString().split('T')[0],
    lieu: '',
    methode: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.titre || !formData.categorie || !formData.montant) {
      alert('Veuillez remplir tous les champs obligatoires')
      return
    }

    try {
      setLoading(true)
      await addDepense({
        titre: formData.titre,
        description: formData.description || undefined,
        categorie: formData.categorie,
        montant: Number(formData.montant),
        date: formData.date,
        lieu: formData.lieu || undefined,
        methode: formData.methode || undefined,
      })
      setFormData({
        titre: '',
        description: '',
        categorie: '',
        montant: '',
        date: new Date().toISOString().split('T')[0],
        lieu: '',
        methode: '',
      })
      onSuccess()
    } catch (error) {
      console.error('Error adding expense:', error)
      alert('Erreur lors de l\'ajout de la dépense')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="titre">Titre *</Label>
        <Input
          id="titre"
          value={formData.titre}
          onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
          placeholder="Ex: Restaurant local"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="categorie">Catégorie *</Label>
        <Select
          value={formData.categorie}
          onValueChange={(value) => setFormData({ ...formData, categorie: value })}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="HEBERGEMENT">Hébergement</SelectItem>
            <SelectItem value="RESTAURATION">Restauration</SelectItem>
            <SelectItem value="TRANSPORT">Transport</SelectItem>
            <SelectItem value="ACTIVITE">Activité</SelectItem>
            <SelectItem value="SHOPPING">Shopping</SelectItem>
            <SelectItem value="AUTRE">Autre</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="montant">Montant (FCFA) *</Label>
        <Input
          id="montant"
          type="number"
          min="0"
          step="0.01"
          value={formData.montant}
          onChange={(e) => setFormData({ ...formData, montant: e.target.value })}
          placeholder="0"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Date *</Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="lieu">Lieu</Label>
        <Input
          id="lieu"
          value={formData.lieu}
          onChange={(e) => setFormData({ ...formData, lieu: e.target.value })}
          placeholder="Ex: Dakar, Sénégal"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="methode">Méthode de paiement</Label>
        <Input
          id="methode"
          value={formData.methode}
          onChange={(e) => setFormData({ ...formData, methode: e.target.value })}
          placeholder="Ex: Espèces, Carte, Mobile Money"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Notes supplémentaires (optionnel)"
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onSuccess}
          disabled={loading}
        >
          Annuler
        </Button>
        <Button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-700">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Ajout...
            </>
          ) : (
            'Ajouter'
          )}
        </Button>
      </div>
    </form>
  )
}

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState('overview')
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [localMessages, setLocalMessages] = useState<MockMessage[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFilter, setSearchFilter] = useState<'all' | 'reservations' | 'favoris' | 'depenses' | 'messages'>('all')
  const pathname = usePathname()
  const router = useRouter()
  const locale = useLocale()
  
  // Récupérer les données utilisateur
  const { user, loading: authLoading } = useAuth()
  const { reservations, loading: reservationsLoading } = useReservations()
  const { favoris, loading: favorisLoading, removeFavori } = useFavoris()
  const { depenses: depensesManuelles, loading: depensesLoading, addDepense, deleteDepense } = useDepenses()
  const { 
    notifications, 
    unreadCount, 
    loading: notificationsLoading, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications()
  const [showAddDepenseDialog, setShowAddDepenseDialog] = useState(false)

  const getLocaleLabel = (loc: string) => {
    switch (loc) {
      case 'fr':
        return '🇫🇷 FR'
      case 'en':
        return '🇬🇧 EN'
      case 'ar':
        return '🇸🇦 AR'
      case 'es':
        return '🇪🇸 ES'
      case 'pt':
        return '🇵🇹 PT'
      case 'de':
        return '🇩🇪 DE'
      case 'it':
        return '🇮🇹 IT'
      default:
        return '🌐'
    }
  }

  // Données utilisateur depuis l'API
  const userData = useMemo(() => ({
    nom: user?.nom || '',
    prenom: user?.prenom || '',
    email: user?.email || '',
    telephone: user?.telephone || '',
    avatar: user?.avatar || null,
  }), [user])

  const handleImageChange = (file: File | null) => {
    if (file) {
      // TODO: Uploader l'image vers le serveur
      console.log('Image à uploader:', file)
      // L'état sera mis à jour automatiquement par le composant AvatarUpload via le preview
    } else {
      // TODO: Supprimer l'image du serveur
      console.log('Suppression de l\'image')
      setProfileImage(null)
    }
  }

  // Calculer les dépenses depuis les réservations payées
  const depensesReservations = useMemo(() => {
    return reservations
      .filter(r => r.paiement?.statut === 'PAID')
      .map(r => ({
        id: r.id,
        titre: r.offre.titre,
        type: r.offre.type === 'HEBERGEMENT' ? 'Hébergement' : 
              r.offre.type === 'ACTIVITE' ? 'Activité' :
              r.offre.type === 'RESTAURANT' ? 'Restauration' : 'Autre',
        date: r.dateDebut,
        montant: Number(r.montant),
        statut: r.paiement?.statut === 'PAID' ? 'paye' : 'en_attente',
        methode: r.paiement?.methode || 'Non spécifié',
        sejour: `${new Date(r.dateDebut).toLocaleDateString('fr-FR')}${r.dateFin ? ` - ${new Date(r.dateFin).toLocaleDateString('fr-FR')}` : ''}`,
        isHorsPlateforme: false,
        description: undefined as string | undefined,
        lieu: undefined as string | undefined,
      }))
  }, [reservations])

  // Combiner les dépenses des réservations et les dépenses manuelles
  const depenses = useMemo(() => {
    const depensesManuellesFormatees = depensesManuelles.map(d => ({
      id: d.id,
      titre: d.titre,
      type: d.categorie === 'HEBERGEMENT' ? 'Hébergement' :
            d.categorie === 'RESTAURATION' ? 'Restauration' :
            d.categorie === 'TRANSPORT' ? 'Transport' :
            d.categorie === 'ACTIVITE' ? 'Activité' :
            d.categorie === 'SHOPPING' ? 'Shopping' : 'Autre',
      date: d.date,
      montant: Number(d.montant),
      statut: 'paye' as const,
      methode: d.methode || 'Non spécifié',
      sejour: new Date(d.date).toLocaleDateString('fr-FR'),
      isHorsPlateforme: true,
      description: d.description || undefined,
      lieu: d.lieu || undefined,
    }))
    
    return [...depensesReservations, ...depensesManuellesFormatees].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  }, [depensesReservations, depensesManuelles])

  const totalDepenses = useMemo(() => depenses.reduce((sum, d) => sum + d.montant, 0), [depenses])
  const depensesParType = useMemo(() => depenses.reduce((acc, d) => {
    acc[d.type] = (acc[d.type] || 0) + d.montant
    return acc
  }, {} as Record<string, number>), [depenses])

  // Données fictives pour la messagerie
  const conversations = useMemo(() => {
    return getTouristeConversations(user?.id || 'touriste-current')
  }, [user?.id])

  const messages = useMemo(() => {
    if (!selectedConversationId) return []
    const conversation = conversations.find(c => c.id === selectedConversationId)
    if (!conversation) return []
    
    return getMessagesForConversation(
      selectedConversationId,
      user?.id || 'touriste-current',
      conversation.user.id,
      conversation.name
    )
  }, [selectedConversationId, conversations, user?.id])

  const handleSendMessage = (content: string, conversationId: string, audioBlob?: Blob, duration?: number, attachments?: File[]) => {
    const conversation = conversations.find(c => c.id === conversationId)
    if (!conversation) return

    const newMessage: MockMessage = {
      id: `msg-${Date.now()}`,
      content,
      senderId: user?.id || 'touriste-current',
      senderName: 'Vous',
      timestamp: new Date(),
      isRead: false,
      isFromUser: true,
      isVoiceMessage: !!audioBlob,
      voiceUrl: audioBlob ? URL.createObjectURL(audioBlob) : undefined,
      voiceDuration: duration,
      attachments: attachments?.map((file, index) => ({
        id: `att-${Date.now()}-${index}`,
        name: file.name,
        url: file.type.startsWith('image/') ? URL.createObjectURL(file) : '#',
        type: file.type.startsWith('image/') ? 'image' as const : 'file' as const,
        size: file.size,
      })),
    }

    setLocalMessages(prev => [...prev, newMessage])
  }

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId)
    setLocalMessages([])
  }

  const allMessages = useMemo(() => {
    return [...messages, ...localMessages].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    )
  }, [messages, localMessages])

  // Fonction de recherche
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null

    const query = searchQuery.toLowerCase().trim()
    const results = {
      reservations: [] as typeof reservations,
      favoris: [] as typeof favoris,
      depenses: [] as typeof depenses,
      messages: [] as typeof allMessages,
    }

    // Recherche dans les réservations
    if (searchFilter === 'all' || searchFilter === 'reservations') {
      results.reservations = reservations.filter(r => 
        r.offre.titre.toLowerCase().includes(query) ||
        r.offre.ville.toLowerCase().includes(query) ||
        r.offre.region.toLowerCase().includes(query) ||
        r.prestataire.nomEntreprise.toLowerCase().includes(query) ||
        r.statut.toLowerCase().includes(query) ||
        r.notes?.toLowerCase().includes(query) ||
        r.montant.toString().includes(query)
      )
    }

    // Recherche dans les favoris
    if (searchFilter === 'all' || searchFilter === 'favoris') {
      results.favoris = favoris.filter(f => 
        f.offre.titre.toLowerCase().includes(query) ||
        f.offre.description.toLowerCase().includes(query) ||
        f.offre.ville.toLowerCase().includes(query) ||
        f.offre.region.toLowerCase().includes(query) ||
        f.offre.prestataire.nomEntreprise.toLowerCase().includes(query) ||
        f.offre.type.toLowerCase().includes(query)
      )
    }

    // Recherche dans les dépenses
    if (searchFilter === 'all' || searchFilter === 'depenses') {
      results.depenses = depenses.filter(d => 
        d.titre.toLowerCase().includes(query) ||
        d.type.toLowerCase().includes(query) ||
        d.description?.toLowerCase().includes(query) ||
        d.lieu?.toLowerCase().includes(query) ||
        d.methode.toLowerCase().includes(query) ||
        d.montant.toString().includes(query) ||
        new Date(d.date).toLocaleDateString('fr-FR').toLowerCase().includes(query)
      )
    }

    // Recherche dans les messages
    if (searchFilter === 'all' || searchFilter === 'messages') {
      type MessageWithConversation = MockMessage & { conversationName?: string; conversationId?: string }
      
      const allConversations: MessageWithConversation[] = conversations.flatMap(conv => {
        const convMessages = getMessagesForConversation(
          conv.id,
          user?.id || 'touriste-current',
          conv.user.id,
          conv.name
        )
        return convMessages.map(msg => ({ ...msg, conversationName: conv.name, conversationId: conv.id }))
      })
      
      const allMessagesWithConversation: MessageWithConversation[] = [
        ...allConversations, 
        ...localMessages.map(msg => ({ ...msg, conversationName: 'Vous', conversationId: selectedConversationId || '' }))
      ]
      
      results.messages = allMessagesWithConversation.filter(msg => 
        msg.content.toLowerCase().includes(query) ||
        msg.senderName.toLowerCase().includes(query) ||
        msg.conversationName?.toLowerCase().includes(query)
      )
    }

    const totalResults = results.reservations.length + results.favoris.length + results.depenses.length + results.messages.length

    return totalResults > 0 ? results : null
  }, [searchQuery, searchFilter, reservations, favoris, depenses, conversations, localMessages, selectedConversationId, user?.id])

  const loading = authLoading || reservationsLoading || favorisLoading || depensesLoading || notificationsLoading

  // Fonction pour formater le temps écoulé
  function getTimeAgo(date: Date): string {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) {
      return 'À l\'instant'
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) {
      return `Il y a ${diffInMinutes} min${diffInMinutes > 1 ? 's' : ''}`
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) {
      return `Il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`
    }
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) {
      return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`
    }
    
    const diffInWeeks = Math.floor(diffInDays / 7)
    if (diffInWeeks < 4) {
      return `Il y a ${diffInWeeks} semaine${diffInWeeks > 1 ? 's' : ''}`
    }
    
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  }

  return (
    <div className="flex w-full min-h-screen">
      <DashboardSidebar type="client" activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="flex-1 flex flex-col lg:ml-0 min-h-screen bg-gradient-to-br from-orange-50/50 via-yellow-50/30 to-orange-50/50">
        <DashboardHeader 
          type="client" 
          userName={`${userData.prenom} ${userData.nom}`}
          userEmail={userData.email}
          onSectionChange={setActiveSection}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
          onDeleteNotification={deleteNotification}
        />
        
        <main className="flex-1 overflow-y-auto pb-4 md:pb-0">
          <div className="container py-4 sm:py-6 lg:py-8 xl:py-12 px-3 sm:px-4 lg:px-6 xl:px-8 max-w-full">
          <AnimatePresence mode="wait">
          {/* Section de recherche */}
          {searchQuery.trim() && (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 mb-6"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight mb-1 sm:mb-2 bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                    Résultats de recherche
                  </h2>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {searchResults ? (
                      <>
                        {searchResults.reservations.length + searchResults.favoris.length + searchResults.depenses.length + searchResults.messages.length} résultat(s) pour &quot;{searchQuery}&quot;
                      </>
                    ) : (
                      <>Aucun résultat pour &quot;{searchQuery}&quot;</>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={searchFilter} onValueChange={(value: 'all' | 'reservations' | 'favoris' | 'depenses' | 'messages') => setSearchFilter(value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filtrer par" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tout</SelectItem>
                      <SelectItem value="reservations">Réservations</SelectItem>
                      <SelectItem value="favoris">Favoris</SelectItem>
                      <SelectItem value="depenses">Dépenses</SelectItem>
                      <SelectItem value="messages">Messages</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon" onClick={() => setSearchQuery('')}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {searchResults ? (
                <div className="space-y-6">
                  {/* Résultats des réservations */}
                  {searchResults.reservations.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="h-5 w-5" />
                          Réservations ({searchResults.reservations.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {searchResults.reservations.map((reservation) => (
                            <motion.div
                              key={reservation.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                              onClick={() => setActiveSection('reservations')}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-semibold">{reservation.offre.titre}</h4>
                                  <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                    <MapPin className="h-4 w-4" />
                                    {reservation.offre.ville}, {reservation.offre.region}
                                  </p>
                                  <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                    <Clock className="h-4 w-4" />
                                    {new Date(reservation.dateDebut).toLocaleDateString('fr-FR')}
                                  </p>
                                </div>
                                <Badge variant={reservation.statut === 'CONFIRMED' ? 'default' : 'secondary'}>
                                  {reservation.statut === 'CONFIRMED' ? 'Confirmée' : 
                                   reservation.statut === 'PENDING' ? 'En attente' :
                                   reservation.statut === 'CANCELLED' ? 'Annulée' : 'Terminée'}
                                </Badge>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Résultats des favoris */}
                  {searchResults.favoris.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Heart className="h-5 w-5" />
                          Favoris ({searchResults.favoris.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                          {searchResults.favoris.map((favori) => (
                            <motion.div
                              key={favori.id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                              onClick={() => setActiveSection('favoris')}
                            >
                              <div className="h-32 bg-gradient-to-br from-orange-300 to-yellow-300 relative">
                                {favori.offre.images && favori.offre.images.length > 0 && (
                                  <Image 
                                    src={favori.offre.images[0]} 
                                    alt={favori.offre.titre}
                                    fill
                                    className="object-cover"
                                  />
                                )}
                              </div>
                              <div className="p-3">
                                <h4 className="font-semibold text-sm truncate">{favori.offre.titre}</h4>
                                <p className="text-lg font-bold mt-1">
                                  {Number(favori.offre.prix).toLocaleString()} FCFA
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Résultats des dépenses */}
                  {searchResults.depenses.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <DollarSign className="h-5 w-5" />
                          Dépenses ({searchResults.depenses.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {searchResults.depenses.map((depense) => (
                            <motion.div
                              key={depense.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                              onClick={() => setActiveSection('depenses')}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-semibold">{depense.titre}</h4>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {depense.type} • {new Date(depense.date).toLocaleDateString('fr-FR')}
                                  </p>
                                  {depense.lieu && (
                                    <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                      <MapPin className="h-4 w-4" />
                                      {depense.lieu}
                                    </p>
                                  )}
                                </div>
                                <div className="text-right">
                                  <p className="text-lg font-bold text-orange-600">
                                    {depense.montant.toLocaleString()} FCFA
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Résultats des messages */}
                  {searchResults.messages.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MessageSquare className="h-5 w-5" />
                          Messages ({searchResults.messages.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {searchResults.messages.map((message) => {
                            type MessageWithConversation = MockMessage & { conversationName?: string; conversationId?: string }
                            const msgWithConv = message as MessageWithConversation
                            return (
                              <motion.div
                                key={message.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => {
                                  if (msgWithConv.conversationId) {
                                    setSelectedConversationId(msgWithConv.conversationId)
                                    setActiveSection('messages')
                                  }
                                }}
                              >
                                <div className="flex items-start gap-3">
                                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-yellow-400 flex items-center justify-center text-white font-bold">
                                    {message.senderName.charAt(0).toUpperCase()}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                      <p className="font-semibold text-sm">
                                        {msgWithConv.conversationName || message.senderName}
                                      </p>
                                      <span className="text-xs text-muted-foreground">
                                        {new Date(message.timestamp).toLocaleDateString('fr-FR')}
                                      </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                      {message.content}
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            )
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">Aucun résultat trouvé</h3>
                    <p className="text-muted-foreground mb-4">
                      Essayez avec d&apos;autres mots-clés ou modifiez vos filtres
                    </p>
                    <Button variant="outline" onClick={() => setSearchQuery('')}>
                      Effacer la recherche
                    </Button>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}

          {!searchQuery.trim() && activeSection === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
      <motion.div 
        className="mb-6 sm:mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
                <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight mb-1 sm:mb-2 bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
          Mon Tableau de Bord
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
          Gérez vos réservations, favoris et messages
        </p>
      </motion.div>

              <motion.div 
                className="space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <motion.div variants={itemVariants}>
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Réservations</CardTitle>
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </motion.div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                ) : (
                  <>
                    <motion.div 
                      className="text-2xl font-bold"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    >
                      {reservations.length}
                    </motion.div>
                    <p className="text-xs text-muted-foreground">
                      {reservations.filter(r => r.statut === 'CONFIRMED').length} confirmées
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Favoris</CardTitle>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Heart className="h-4 w-4 text-muted-foreground fill-red-500" />
                </motion.div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                ) : (
                  <>
                    <motion.div 
                      className="text-2xl font-bold"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                    >
                      {favoris.length}
                    </motion.div>
                    <p className="text-xs text-muted-foreground">Offres sauvegardées</p>
                  </>
                )}
              </CardContent>
            </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Messages</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <motion.div 
                  className="text-2xl font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
                >
                  {conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)}
                </motion.div>
                <p className="text-xs text-muted-foreground">Non lus</p>
              </CardContent>
            </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total dépensé</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                ) : (
                  <>
                    <motion.div 
                      className="text-2xl font-bold"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
                    >
                      {totalDepenses.toLocaleString()} FCFA
                    </motion.div>
                    <p className="text-xs text-muted-foreground">Total dépensé</p>
                  </>
                )}
              </CardContent>
            </Card>
            </motion.div>
          </div>

          {/* Dernières réservations */}
          <motion.div variants={itemVariants}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Dernières réservations</CardTitle>
              <CardDescription>Vos réservations récentes</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="space-y-4">
                  {reservations.slice(0, 5).map((reservation, index) => (
                    <motion.div
                      key={reservation.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      whileHover={{ scale: 1.02, x: 4 }}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div>
                        <h4 className="font-semibold">{reservation.offre.titre}</h4>
                        <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                          <Clock className="h-4 w-4" />
                          {new Date(reservation.dateDebut).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="text-left sm:text-right w-full sm:w-auto">
                        <Badge
                          variant={reservation.statut === 'CONFIRMED' ? 'default' : 'secondary'}
                          className="mb-2 sm:mb-0"
                        >
                          {reservation.statut === 'CONFIRMED' ? 'Confirmée' : 
                           reservation.statut === 'PENDING' ? 'En attente' :
                           reservation.statut === 'CANCELLED' ? 'Annulée' : 'Terminée'}
                        </Badge>
                        <p className="text-sm font-medium mt-2">
                          {Number(reservation.montant).toLocaleString()} FCFA
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        variant="outline" 
                        className="w-full mt-4" 
                        onClick={() => setActiveSection('reservations')}
                      >
                        Voir toutes les réservations
                      </Button>
                    </motion.div>
            </CardContent>
          </Card>
          </motion.div>
              </motion.div>
            </motion.div>
          )}

          {!searchQuery.trim() && activeSection === 'reservations' && (
            <motion.div 
              key="reservations"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Mes réservations</CardTitle>
              <CardDescription>Historique complet de vos réservations</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="space-y-4">
                  {reservations.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Aucune réservation</h3>
                      <p className="text-muted-foreground mb-4">
                        Commencez à explorer et réservez vos premières expériences
                      </p>
                      <Button asChild>
                        <Link href="/explorer">Explorer les offres</Link>
                      </Button>
                    </div>
                  ) : (
                    reservations.map((reservation, index) => (
                      <motion.div
                        key={reservation.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        whileHover={{ scale: 1.01, y: -2 }}
                        className="border rounded-lg p-4 sm:p-6 space-y-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">{reservation.offre.titre}</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                              <MapPin className="h-4 w-4" />
                              {reservation.offre.ville}, {reservation.offre.region}
                            </p>
                          </div>
                          <Badge
                            variant={reservation.statut === 'CONFIRMED' ? 'default' : 'secondary'}
                          >
                            {reservation.statut === 'CONFIRMED' ? 'Confirmée' : 
                             reservation.statut === 'PENDING' ? 'En attente' :
                             reservation.statut === 'CANCELLED' ? 'Annulée' : 'Terminée'}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Date</p>
                            <p className="font-medium">
                              {new Date(reservation.dateDebut).toLocaleDateString('fr-FR')}
                              {reservation.dateFin && ` - ${new Date(reservation.dateFin).toLocaleDateString('fr-FR')}`}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Montant</p>
                            <p className="font-medium">
                              {Number(reservation.montant).toLocaleString()} FCFA
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
                              <Link href={`/experience/${reservation.offre.id}`}>Voir les détails</Link>
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full sm:w-auto"
                              onClick={() => setActiveSection('messages')}
                            >
                              Contacter le prestataire
                            </Button>
                          </motion.div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
            </motion.div>
          )}

          {!searchQuery.trim() && activeSection === 'depenses' && (
            <motion.div 
              key="depenses"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <motion.div 
                className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight mb-1 sm:mb-2 bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                    Mes dépenses 💰
                  </h2>
                  <p className="text-muted-foreground">
                    Suivez toutes vos dépenses durant votre séjour au Sénégal
                  </p>
                </div>
                <Dialog open={showAddDepenseDialog} onOpenChange={setShowAddDepenseDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-orange-600 hover:bg-orange-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter une dépense
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Ajouter une dépense</DialogTitle>
                      <DialogDescription>
                        Ajoutez une dépense effectuée hors de Gooteranga durant votre séjour
                      </DialogDescription>
                    </DialogHeader>
                    <AddDepenseForm 
                      onSuccess={() => {
                        setShowAddDepenseDialog(false)
                      }}
                      addDepense={addDepense}
                    />
                  </DialogContent>
                </Dialog>
              </motion.div>

              {/* Statistiques des dépenses */}
              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  <Card className="hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-orange-500 to-yellow-500 text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-white">Total dépensé</CardTitle>
                      <DollarSign className="h-4 w-4 text-white/80" />
                    </CardHeader>
                    <CardContent>
                      <motion.div 
                        className="text-2xl sm:text-3xl font-bold"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                      >
                        {totalDepenses.toLocaleString()} FCFA
                      </motion.div>
                      <p className="text-xs text-orange-100 mt-1">Toutes vos dépenses</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                      <Receipt className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <motion.div 
                        className="text-2xl font-bold"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                      >
                        {depenses.length}
                      </motion.div>
                      <p className="text-xs text-muted-foreground">Paiements effectués</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Moyenne</CardTitle>
                      <TrendingDown className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <motion.div 
                        className="text-2xl font-bold"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
                      >
                        {depenses.length > 0 ? Math.round(totalDepenses / depenses.length).toLocaleString() : 0} FCFA
                      </motion.div>
                      <p className="text-xs text-muted-foreground">Par transaction</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                >
                  <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Catégories</CardTitle>
                      <Filter className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <motion.div 
                        className="text-2xl font-bold"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
                      >
                        {Object.keys(depensesParType).length}
                      </motion.div>
                      <p className="text-xs text-muted-foreground">Types différents</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Répartition par type */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle>Répartition par catégorie</CardTitle>
                    <CardDescription>Vos dépenses classées par type</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(depensesParType).map(([type, montant], index) => {
                        const percentage = Math.round((montant / totalDepenses) * 100)
                        return (
                          <motion.div
                            key={type}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.3 }}
                            className="space-y-2"
                          >
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium">{type}</span>
                              <span className="text-muted-foreground">
                                {montant.toLocaleString()} FCFA ({percentage}%)
                              </span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                              />
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Liste détaillée des dépenses */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle>Historique des dépenses</CardTitle>
                    <CardDescription>Détails de toutes vos transactions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {depenses.length === 0 ? (
                      <div className="text-center py-12">
                        <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Aucune dépense</h3>
                        <p className="text-muted-foreground">
                          Vos dépenses apparaîtront ici après vos réservations
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {depenses.map((depense, index) => (
                          <motion.div
                            key={depense.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.3 }}
                            whileHover={{ scale: 1.01, y: -2 }}
                            className="border rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow"
                          >
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h3 className="text-lg font-semibold">{depense.titre}</h3>
                                      {depense.isHorsPlateforme && (
                                        <Badge variant="outline" className="text-xs">
                                          Hors plateforme
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                      <Clock className="h-4 w-4" />
                                      {depense.sejour}
                                    </p>
                                    {(depense as DepenseDisplay).lieu && (
                                      <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                        <MapPin className="h-4 w-4" />
                                        {(depense as DepenseDisplay).lieu}
                                      </p>
                                    )}
                                    {(depense as DepenseDisplay).description && (
                                      <p className="text-sm text-muted-foreground mt-1">
                                        {(depense as DepenseDisplay).description}
                                      </p>
                                    )}
                                  </div>
                                  <div className="flex flex-col items-end gap-2">
                                    <Badge variant="default" className="ml-2">
                                      {depense.statut === 'paye' ? 'Payé' : 'En attente'}
                                    </Badge>
                                    {depense.isHorsPlateforme && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={async () => {
                                          if (confirm('Êtes-vous sûr de vouloir supprimer cette dépense ?')) {
                                            await deleteDepense(depense.id)
                                          }
                                        }}
                                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-3">
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {depense.type}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <CreditCard className="h-4 w-4" />
                                    {depense.methode}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {new Date(depense.date).toLocaleDateString('fr-FR', {
                                      day: 'numeric',
                                      month: 'long',
                                      year: 'numeric'
                                    })}
                                  </div>
                                </div>
                              </div>
                              <div className="text-left sm:text-right">
                                <motion.p 
                                  className="text-2xl font-bold text-orange-600"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", stiffness: 200, delay: index * 0.1 + 0.2 }}
                                >
                                  {depense.montant.toLocaleString()} FCFA
                                </motion.p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Transaction #{depense.id}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}

          {!searchQuery.trim() && activeSection === 'favoris' && (
            <motion.div 
              key="favoris"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Mes favoris</CardTitle>
              <CardDescription>Offres que vous avez sauvegardées</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : favoris.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucun favori</h3>
                  <p className="text-muted-foreground mb-4">
                    Ajoutez des offres à vos favoris pour les retrouver facilement
                  </p>
                  <Button asChild>
                    <Link href="/explorer">Explorer les offres</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {favoris.map((favori, index) => (
                    <motion.div
                      key={favori.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                      <div className="h-48 bg-gradient-to-br from-orange-300 to-yellow-300 relative">
                        {favori.offre.images && favori.offre.images.length > 0 && (
                          <Image 
                            src={favori.offre.images[0]} 
                            alt={favori.offre.titre}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <CardHeader>
                        <CardTitle className="text-lg">{favori.offre.titre}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{favori.offre.rating.toFixed(1)}</span>
                          <span className="text-xs text-muted-foreground">({favori.offre._count.avis} avis)</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-lg font-bold mb-4">
                          {Number(favori.offre.prix).toLocaleString()} FCFA
                        </p>
                        <div className="flex gap-2">
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                            <Button className="w-full" size="sm" asChild>
                              <Link href={`/experience/${favori.offre.id}`}>Voir les détails</Link>
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={async () => {
                                await removeFavori(favori.offre.id)
                              }}
                            >
                              <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                            </Button>
                          </motion.div>
                        </div>
                      </CardContent>
                    </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
            </motion.div>
          )}

          {!searchQuery.trim() && activeSection === 'messages' && (
            <motion.div 
              key="messages"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <Card className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-xl">
                <CardContent className="p-0">
                  <div className="h-[500px] md:h-[600px]">
                    <ChatInterface
                      currentUserId={user?.id || 'touriste-current'}
                      conversations={conversations}
                      messages={allMessages}
                      emptyStateTitle="Aucun message"
                      emptyStateDescription="Vos conversations avec les prestataires apparaîtront ici"
                      onSendMessage={handleSendMessage}
                      onSelectConversation={handleSelectConversation}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {!searchQuery.trim() && activeSection === 'notifications' && (
            <motion.div 
              key="notifications"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <motion.div 
                className="mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                  Mes notifications 🔔
                </h2>
                <p className="text-muted-foreground">
                  Gérez toutes vos notifications
                </p>
              </motion.div>

              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Notifications</CardTitle>
                      <CardDescription>
                        {unreadCount > 0 ? `${unreadCount} notification(s) non lue(s)` : 'Toutes vos notifications sont lues'}
                      </CardDescription>
                    </div>
                    {unreadCount > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => markAllAsRead()}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Tout marquer comme lu
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {notificationsLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="text-center py-12">
                      <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                      <h3 className="text-lg font-semibold mb-2">Aucune notification</h3>
                      <p className="text-muted-foreground">
                        Vous n&apos;avez aucune notification pour le moment
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {notifications.map((notification, index) => {
                        const timeAgo = getTimeAgo(notification.date)
                        return (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.3 }}
                            className={cn(
                              "border rounded-lg p-4 hover:shadow-md transition-shadow",
                              !notification.isRead && "bg-orange-50/50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800"
                            )}
                          >
                            <div className="flex items-start gap-3">
                              {notification.icon && (
                                <span className="text-2xl flex-shrink-0">{notification.icon}</span>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <div className="flex items-center gap-2 flex-1">
                                    <h4 className={cn(
                                      "font-semibold",
                                      !notification.isRead && "text-orange-900 dark:text-orange-100"
                                    )}>
                                      {notification.titre}
                                    </h4>
                                    {!notification.isRead && (
                                      <div className="h-2 w-2 rounded-full bg-orange-500 flex-shrink-0" />
                                    )}
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-red-600"
                                    onClick={() => deleteNotification(notification.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                  {notification.message}
                                </p>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    <span>{timeAgo}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {!notification.isRead && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 text-xs"
                                        onClick={() => markAsRead(notification.id)}
                                      >
                                        <Check className="h-3 w-3 mr-1" />
                                        Marquer comme lu
                                      </Button>
                                    )}
                                    {notification.actionLabel && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 text-xs"
                                        onClick={() => {
                                          if (notification.actionUrl) {
                                            const url = new URL(notification.actionUrl, window.location.origin)
                                            const section = url.searchParams.get('section')
                                            if (section) {
                                              setActiveSection(section)
                                            }
                                          }
                                        }}
                                      >
                                        {notification.actionLabel}
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {!searchQuery.trim() && activeSection === 'profil' && (
            <motion.div 
              key="profil"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <motion.div 
                className="mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                  Mon profil 👤
                </h2>
                <p className="text-muted-foreground">
                  Gérez vos informations personnelles
                </p>
              </motion.div>
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Mon profil</CardTitle>
                  <CardDescription>Gérez vos informations personnelles</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6 pb-6 border-b">
                    <AvatarUpload
                      currentImage={profileImage || userData.avatar}
                      onImageChange={handleImageChange}
                      label="Photo de profil"
                      size="lg"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-1">
                        {userData.prenom} {userData.nom}
                      </h3>
                      <p className="text-muted-foreground mb-2">{userData.email}</p>
                      <p className="text-sm text-muted-foreground">{userData.telephone}</p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Prénom</label>
                      <input
                        type="text"
                        defaultValue={userData.prenom}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nom</label>
                      <input
                        type="text"
                        defaultValue={userData.nom}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <input
                        type="email"
                        defaultValue={userData.email}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Téléphone</label>
                      <input
                        type="tel"
                        defaultValue={userData.telephone}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium">Langue</label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="w-full justify-between">
                            <span className="flex items-center gap-2">
                              <span className="text-lg">🌐</span>
                              <span>{getLocaleLabel(locale as string)}</span>
                            </span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-full">
                          <DropdownMenuItem onClick={() => router.replace(pathname || '/', { locale: 'fr' })}>
                            🇫🇷 Français
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.replace(pathname || '/', { locale: 'en' })}>
                            🇬🇧 English
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.replace(pathname || '/', { locale: 'ar' })}>
                            🇸🇦 العربية
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.replace(pathname || '/', { locale: 'es' })}>
                            🇪🇸 Español
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.replace(pathname || '/', { locale: 'it' })}>
                            🇮🇹 Italiano
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.replace(pathname || '/', { locale: 'pt' })}>
                            🇵🇹 Português
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.replace(pathname || '/', { locale: 'de' })}>
                            🇩🇪 Deutsch
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 pt-4">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button 
                        className="w-full sm:w-auto"
                        onClick={() => {
                          alert('Modifications enregistrées avec succès ! (Mode développement)')
                        }}
                      >
                        Enregistrer les modifications
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button 
                        variant="outline" 
                        className="w-full sm:w-auto"
                        onClick={() => {
                          alert('Un email de réinitialisation de mot de passe sera envoyé. (Mode développement)')
                        }}
                      >
                        Changer le mot de passe
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
          </AnimatePresence>

          </div>
        </main>
      </div>
    </div>
  )
}
