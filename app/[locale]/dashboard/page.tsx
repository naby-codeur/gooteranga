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
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/lib/hooks/useAuth'
import { useReservations } from '@/lib/hooks/useReservations'
import { useFavoris } from '@/lib/hooks/useFavoris'
import { useDepenses } from '@/lib/hooks/useDepenses'
import { ChatInterface } from '@/components/messaging/ChatInterface'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Trash2 } from 'lucide-react'
import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/routing'
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
  const pathname = usePathname()
  const router = useRouter()
  const locale = useLocale()
  
  // Récupérer les données utilisateur
  const { user, loading: authLoading } = useAuth()
  const { reservations, loading: reservationsLoading } = useReservations()
  const { favoris, loading: favorisLoading, removeFavori } = useFavoris()
  const { depenses: depensesManuelles, loading: depensesLoading, addDepense, deleteDepense } = useDepenses()
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

  const handleSendMessage = (content: string, conversationId: string) => {
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

  const loading = authLoading || reservationsLoading || favorisLoading || depensesLoading

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
    <div className="flex w-full">
      <DashboardSidebar type="client" activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="flex-1 flex flex-col lg:ml-0 min-h-screen bg-gradient-to-br from-orange-50/50 via-yellow-50/30 to-orange-50/50">
        <DashboardHeader 
          type="client" 
          userName={`${userData.prenom} ${userData.nom}`}
          userEmail={userData.email}
          onSectionChange={setActiveSection}
        />
        
        <main className="flex-1 overflow-y-auto">
          <div className="container py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
          {activeSection === 'overview' && (
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
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
          Mon Tableau de Bord
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground">
          Gérez vos réservations, favoris et messages
        </p>
      </motion.div>

              <motion.div 
                className="space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                  0
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

          {activeSection === 'reservations' && (
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
                            <Button variant="outline" size="sm" className="w-full sm:w-auto">Contacter le prestataire</Button>
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

          {activeSection === 'depenses' && (
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
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
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
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

          {activeSection === 'favoris' && (
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

          {activeSection === 'messages' && (
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
                  <ChatInterface
                    currentUserId={user?.id || 'touriste-current'}
                    conversations={conversations}
                    messages={allMessages}
                    emptyStateTitle="Aucun message"
                    emptyStateDescription="Vos conversations avec les prestataires apparaîtront ici"
                    onSendMessage={handleSendMessage}
                    onSelectConversation={handleSelectConversation}
                  />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeSection === 'profil' && (
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

                  <div className="grid gap-4 md:grid-cols-2">
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
                      <Button className="w-full sm:w-auto">Enregistrer les modifications</Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button variant="outline" className="w-full sm:w-auto">Changer le mot de passe</Button>
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


