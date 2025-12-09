
'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DashboardSidebar } from '@/components/layout/DashboardSidebar'
import { DashboardHeader } from '@/components/layout/DashboardHeader'
import { AvatarUpload } from '@/components/ui/avatar-upload'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Eye, 
  Calendar, 
  DollarSign, 
  Star,
  Plus,
  Edit,
  Trash2,
  Bell,
  MessageSquare,
  CreditCard,
  Download,
  Crown,
  Zap,
  CheckCircle,
  XCircle,
  X,
  Clock,
  Loader2,
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { LineChart, BarChart, DoughnutChart } from '@/components/ui/charts'
import { useAuth } from '@/lib/hooks/useAuth'
import { useReservations } from '@/lib/hooks/useReservations'
import { useOffres } from '@/lib/hooks/useOffres'
import { ChatInterface } from '@/components/messaging/ChatInterface'
import { CreateOffreForm } from '@/components/offres/CreateOffreForm'
import { OfferCard } from '@/components/offers/OfferCard'
import { ReferralDashboard } from '@/components/referral/ReferralDashboard'
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
  getPrestataireConversations, 
  getMessagesForConversation,
  type MockMessage 
} from '@/lib/mock-messaging-data'
import { useNotifications } from '@/lib/hooks/useNotifications'

export default function PrestataireDashboardPage() {
  const [activeSection, setActiveSection] = useState('overview')
  const [logoImage, setLogoImage] = useState<string | null>(null)
  const [showCreateOffreForm, setShowCreateOffreForm] = useState(false)
  const [editingOffreId, setEditingOffreId] = useState<string | null>(null)
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [localMessages, setLocalMessages] = useState<MockMessage[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFilter, setSearchFilter] = useState<'all' | 'offres' | 'reservations' | 'paiements' | 'messages' | 'favoris' | 'depenses'>('all')
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const [boostType, setBoostType] = useState<'EXPERIENCE' | 'REGIONAL' | 'CATEGORIE' | 'MENSUEL'>('EXPERIENCE')
  const [selectedOffreId, setSelectedOffreId] = useState<string>('')
  const [boostDuree, setBoostDuree] = useState<'jour' | 'semaine' | 'mois'>('semaine')
  const [isCreatingBoost, setIsCreatingBoost] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const locale = useLocale()
  
  // Notifications
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications()

  // Récupérer les données utilisateur depuis l'API
  const { user, loading: authLoading } = useAuth()
  const { reservations, loading: reservationsLoading } = useReservations()
  
  // Memoize filters to prevent infinite loops
  const offresFilters = useMemo(() => ({ isActive: true }), [])
  const { offres, loading: offresLoading, refetch: refetchOffres, deleteOffre } = useOffres(offresFilters)

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
    prestataire: user?.prestataire || null,
  }), [user])

  const handleLogoChange = (file: File | null) => {
    if (file) {
      // TODO: Uploader le logo vers le serveur
      console.log('Logo à uploader:', file)
      // L'état sera mis à jour automatiquement par le composant AvatarUpload via le preview
    } else {
      // TODO: Supprimer le logo du serveur
      console.log('Suppression du logo')
      setLogoImage(null)
    }
  }

  // Calculer les statistiques depuis les vraies données
  const stats = useMemo(() => {
    const totalVues = offres.reduce((sum, offre) => sum + (offre._count?.reservations || 0) * 10, 0) // Estimation basée sur les réservations
    const totalReservations = reservations.length
    const totalRevenus = reservations
      .filter(r => r.paiement?.statut === 'PAID')
      .reduce((sum, r) => sum + Number(r.montant), 0)
    const moyenneRating = offres.length > 0
      ? offres.reduce((sum, offre) => sum + (offre.rating || 0), 0) / offres.length
      : 0

    return {
      vues: totalVues,
      reservations: totalReservations,
      revenus: totalRevenus,
      satisfaction: moyenneRating,
    }
  }, [offres, reservations])

  // Filtrer les offres du prestataire
  // En mode développement, si pas de prestataire, afficher toutes les offres
  const mesOffres = useMemo(() => {
    let filtered = offres
    if (user?.prestataire?.id) {
      filtered = offres.filter(offre => offre.prestataire?.id === user.prestataire?.id)
    }
    
    // Appliquer la recherche si présente et si le filtre correspond
    if (searchQuery.trim() && (searchFilter === 'all' || searchFilter === 'offres')) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(offre => 
        offre.titre.toLowerCase().includes(query) ||
        offre.description.toLowerCase().includes(query) ||
        offre.region?.toLowerCase().includes(query) ||
        offre.ville?.toLowerCase().includes(query) ||
        offre.type.toLowerCase().includes(query) ||
        offre.prestataire?.nomEntreprise?.toLowerCase().includes(query) ||
        offre.prix.toString().includes(query)
      )
    } else if (searchFilter === 'offres' && !searchQuery.trim()) {
      // Si on filtre uniquement les offres mais sans recherche, retourner toutes les offres
      return filtered
    } else if (searchFilter !== 'all' && searchFilter !== 'offres') {
      // Si on filtre autre chose que les offres, retourner un tableau vide
      return []
    }
    
    return filtered
  }, [offres, user, searchQuery, searchFilter])

  // Filtrer les réservations selon la recherche
  const reservationsFiltrees = useMemo(() => {
    if (searchFilter !== 'all' && searchFilter !== 'reservations') {
      return []
    }
    if (!searchQuery.trim()) return reservations
    
    const query = searchQuery.toLowerCase()
    return reservations.filter(reservation => 
      reservation.offre?.titre?.toLowerCase().includes(query) ||
      reservation.offre?.ville?.toLowerCase().includes(query) ||
      reservation.offre?.region?.toLowerCase().includes(query) ||
      reservation.user?.prenom?.toLowerCase().includes(query) ||
      reservation.user?.nom?.toLowerCase().includes(query) ||
      reservation.user?.email?.toLowerCase().includes(query) ||
      reservation.statut?.toLowerCase().includes(query) ||
      reservation.montant.toString().includes(query) ||
      new Date(reservation.dateDebut).toLocaleDateString('fr-FR').toLowerCase().includes(query) ||
      (reservation.dateFin && new Date(reservation.dateFin).toLocaleDateString('fr-FR').toLowerCase().includes(query))
    )
  }, [reservations, searchQuery, searchFilter])

  // Calculer le solde disponible (revenus payés)
  const solde = useMemo(() => {
    return reservations
      .filter(r => r.paiement?.statut === 'PAID')
      .reduce((sum, r) => sum + Number(r.montant), 0)
  }, [reservations])

  // Paiements depuis les réservations payées
  const paiements = useMemo(() => {
    return reservations
      .filter(r => r.paiement?.statut === 'PAID')
      .map(r => ({
        id: r.id,
        montant: Number(r.montant),
        methode: r.paiement?.methode || 'Non spécifié',
        date: r.createdAt,
        statut: 'paid',
      }))
  }, [reservations])

  // Données fictives pour la messagerie
  const conversations = useMemo(() => {
    return getPrestataireConversations(user?.id || 'prestataire-current')
  }, [user?.id])

  // Filtrer les paiements selon la recherche
  const paiementsFiltres = useMemo(() => {
    if (searchFilter !== 'all' && searchFilter !== 'paiements') {
      return []
    }
    if (!searchQuery.trim()) return paiements
    
    const query = searchQuery.toLowerCase()
    return paiements.filter(paiement => 
      paiement.montant.toString().includes(query) ||
      paiement.methode.toLowerCase().includes(query) ||
      new Date(paiement.date).toLocaleDateString('fr-FR').toLowerCase().includes(query) ||
      paiement.statut.toLowerCase().includes(query)
    )
  }, [paiements, searchQuery, searchFilter])

  // Filtrer les conversations selon la recherche
  const conversationsFiltrees = useMemo(() => {
    if (searchFilter !== 'all' && searchFilter !== 'messages') {
      return []
    }
    if (!searchQuery.trim()) return conversations
    
    const query = searchQuery.toLowerCase()
    return conversations.filter(conversation => 
      conversation.name.toLowerCase().includes(query) ||
      `${conversation.user.prenom} ${conversation.user.nom}`.toLowerCase().includes(query) ||
      conversation.user.email?.toLowerCase().includes(query) ||
      conversation.lastMessage?.toLowerCase().includes(query)
    )
  }, [conversations, searchQuery, searchFilter])

  const messages = useMemo(() => {
    if (!selectedConversationId) return []
    const conversation = conversations.find(c => c.id === selectedConversationId)
    if (!conversation) return []
    
    return getMessagesForConversation(
      selectedConversationId,
      user?.id || 'prestataire-current',
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
      senderId: user?.id || 'prestataire-current',
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

  const loading = authLoading || reservationsLoading || offresLoading

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
      <DashboardSidebar type="prestataire" activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="flex-1 flex flex-col min-h-screen bg-gradient-to-br from-orange-50/50 via-yellow-50/30 to-orange-50/50 lg:ml-0">
        <DashboardHeader 
          type="prestataire" 
          userName={`${userData.prenom} ${userData.nom}`}
          userEmail={userData.email}
          onSectionChange={setActiveSection}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchFilter={searchFilter}
          onSearchFilterChange={setSearchFilter}
          showMobileSearch={showMobileSearch}
          onShowMobileSearchChange={setShowMobileSearch}
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
          onDeleteNotification={deleteNotification}
        />
        
        <main className="flex-1 overflow-y-auto pb-4 lg:pb-0">
          <div className="container max-w-7xl mx-auto py-4 sm:py-6 lg:py-8 xl:py-12 px-3 sm:px-4 lg:px-6 xl:px-8 max-w-full">
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
                className="mb-4 sm:mb-5 md:mb-6 lg:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="w-full sm:w-auto flex-1">
                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-1 sm:mb-2 bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                    Tableau de Bord Prestataire
                  </h1>
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg text-muted-foreground">
                    Gérez vos offres, réservations et revenus
                  </p>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto flex-shrink-0">
                  <Button onClick={() => setActiveSection('offres')} className="w-full sm:w-auto text-xs sm:text-sm md:text-base">
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Nouvelle offre</span>
                    <span className="sm:hidden">Nouvelle</span>
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div 
                className="space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <motion.div variants={itemVariants}>
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6">
                <CardTitle className="text-xs sm:text-sm font-medium">Vues totales</CardTitle>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                </motion.div>
              </CardHeader>
              <CardContent className="px-3 sm:px-6">
                {loading ? (
                  <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin text-muted-foreground" />
                ) : (
                  <>
                    <motion.div 
                      className="text-xl sm:text-2xl font-bold"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    >
                      {stats.vues.toLocaleString()}
                    </motion.div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                      Estimation basée sur les réservations
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
            </motion.div>

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
                <motion.div 
                  className="text-2xl font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                >
                  {stats.reservations}
                </motion.div>
                <p className="text-xs text-muted-foreground">
                  {loading ? (
                    <Loader2 className="h-3 w-3 animate-spin inline" />
                  ) : (
                    `${reservations.filter(r => r.statut === 'PENDING').length} en attente`
                  )}
                </p>
              </CardContent>
            </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenus</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
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
                      transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
                    >
                      {stats.revenus.toLocaleString()} FCFA
                    </motion.div>
                    <p className="text-xs text-muted-foreground">Total payé</p>
                  </>
                )}
              </CardContent>
            </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Star className="h-4 w-4 text-muted-foreground fill-yellow-400" />
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
                      transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
                    >
                      {stats.satisfaction.toFixed(1)}
                    </motion.div>
                    <p className="text-xs text-muted-foreground">
                      Basé sur {mesOffres.reduce((sum, o) => sum + (o._count?.avis || 0), 0)} avis
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
            </motion.div>
          </div>

          {/* Solde et actions rapides */}
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
            <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-orange-500 to-yellow-500 text-white hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-white">Solde disponible</CardTitle>
                <CardDescription className="text-orange-100">
                  Montant pouvant être retiré
                </CardDescription>
              </CardHeader>
              <CardContent>
                <motion.div 
                  className="text-3xl sm:text-4xl font-bold mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                >
                  {solde.toLocaleString()} FCFA
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="secondary" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Demander un retrait
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <motion.div whileHover={{ scale: 1.02, x: 4 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setActiveSection('offres')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Créer une offre
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02, x: 4 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setActiveSection('reservations')}>
                    <Bell className="h-4 w-4 mr-2" />
                    Voir les réservations ({loading ? '...' : reservations.filter(r => r.statut === 'PENDING').length})
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02, x: 4 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setActiveSection('revenus')}>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Gérer les paiements
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
            </motion.div>
          </div>

          {/* Dernières réservations */}
          <motion.div variants={itemVariants}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Réservations récentes</CardTitle>
              <CardDescription>Dernières demandes de réservation</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : ((searchQuery.trim() && (searchFilter === 'all' || searchFilter === 'reservations')) ? reservationsFiltrees : reservations).length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {searchQuery.trim() ? 'Aucune réservation trouvée' : 'Aucune réservation'}
                  </h3>
                  <p className="text-muted-foreground">
                    {searchQuery.trim() 
                      ? `Aucune réservation ne correspond à &quot;${searchQuery}&quot;`
                      : 'Vos réservations apparaîtront ici'}
                  </p>
                  {searchQuery.trim() && (
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setSearchQuery('')}
                    >
                      Effacer la recherche
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {searchQuery.trim() && (searchFilter === 'all' || searchFilter === 'reservations') && reservationsFiltrees.length > 0 && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <p className="text-sm text-blue-800">
                        <strong>{reservationsFiltrees.length}</strong> réservation{reservationsFiltrees.length > 1 ? 's' : ''} trouvée{reservationsFiltrees.length > 1 ? 's' : ''} pour &quot;{searchQuery}&quot;
                      </p>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSearchQuery('')
                          setSearchFilter('all')
                        }}
                        className="w-full sm:w-auto"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Effacer
                      </Button>
                    </div>
                  )}
                  {((searchQuery.trim() && (searchFilter === 'all' || searchFilter === 'reservations')) ? reservationsFiltrees : reservations).slice(0, 5).map((reservation, index) => (
                    <motion.div
                      key={reservation.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      whileHover={{ scale: 1.02, x: 4 }}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div>
                        <h4 className="font-semibold">{reservation.offre?.titre || 'Offre'}</h4>
                        <p className="text-sm text-muted-foreground">
                          {reservation.user ? `${reservation.user.prenom || ''} ${reservation.user.nom || ''}`.trim() || reservation.user.email : 'Client'} • {new Date(reservation.dateDebut).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="text-left sm:text-right w-full sm:w-auto">
                        <Badge
                          variant={reservation.statut === 'CONFIRMED' ? 'default' : 'secondary'}
                          className="mb-2 sm:mb-0"
                        >
                          {reservation.statut === 'PENDING' ? 'En attente' : 
                           reservation.statut === 'CONFIRMED' ? 'Confirmée' :
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
            </CardContent>
          </Card>
          </motion.div>
              </motion.div>
            </motion.div>
          )}

          {activeSection === 'offres' && (
            <motion.div 
              key="offres"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {showCreateOffreForm ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>
                          {editingOffreId ? 'Modifier l\'offre' : 'Créer une nouvelle offre'}
                        </CardTitle>
                        <CardDescription>
                          {editingOffreId 
                            ? 'Modifiez les informations de votre offre'
                            : 'Remplissez le formulaire pour créer votre offre'}
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setShowCreateOffreForm(false)
                          setEditingOffreId(null)
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CreateOffreForm
                      offreId={editingOffreId || undefined}
                      onSuccess={async () => {
                        setShowCreateOffreForm(false)
                        setEditingOffreId(null)
                        // Recharger les offres
                        await refetchOffres()
                      }}
                      onCancel={() => {
                        setShowCreateOffreForm(false)
                        setEditingOffreId(null)
                      }}
                    />
                  </CardContent>
                </Card>
              ) : (
                <>
                  <motion.div 
                    className="mb-4 sm:mb-5 md:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="w-full sm:w-auto flex-1">
                      <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-tight mb-1 sm:mb-2 bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                        Mes offres 🎯
                      </h2>
                      <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                        Gérez vos offres et services
                      </p>
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto flex-shrink-0">
                      <Button 
                        className="w-full sm:w-auto text-xs sm:text-sm md:text-base"
                        onClick={() => setShowCreateOffreForm(true)}
                      >
                        <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Ajouter une offre</span>
                        <span className="sm:hidden">Ajouter</span>
                      </Button>
                    </motion.div>
                  </motion.div>

                  {loading || offresLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : mesOffres.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Plus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {(searchQuery.trim() && (searchFilter === 'all' || searchFilter === 'offres')) ? 'Aucune offre trouvée' : 'Aucune offre'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {(searchQuery.trim() && (searchFilter === 'all' || searchFilter === 'offres'))
                  ? `Aucune offre ne correspond à &quot;${searchQuery}&quot;`
                  : 'Créez votre première offre pour commencer'}
              </p>
              {(searchQuery.trim() && (searchFilter === 'all' || searchFilter === 'offres')) ? (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('')
                    setSearchFilter('all')
                  }}
                >
                  Effacer la recherche
                </Button>
              ) : (
                <Button onClick={() => setShowCreateOffreForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer une offre
                </Button>
              )}
            </div>
          ) : (
                    <>
                             {/* Indicateur de recherche active */}
                             {searchQuery.trim() && (searchFilter === 'all' || searchFilter === 'offres') && mesOffres.length > 0 && (
                               <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                                 <p className="text-sm text-blue-800">
                                   <strong>{mesOffres.length}</strong> offre{mesOffres.length > 1 ? 's' : ''} trouvée{mesOffres.length > 1 ? 's' : ''} pour &quot;{searchQuery}&quot;
                                 </p>
                                 <Button 
                                   variant="ghost" 
                                   size="sm"
                                   onClick={() => {
                                     setSearchQuery('')
                                     setSearchFilter('all')
                                   }}
                                   className="w-full sm:w-auto"
                                 >
                                   <X className="h-4 w-4 mr-1" />
                                   Effacer
                                 </Button>
                               </div>
                             )}
                             {/* Statistiques rapides */}
                             <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4 mb-4 sm:mb-6">
                        <Card className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">Total offres</p>
                              <p className="text-2xl font-bold">{mesOffres.length}</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                              <Star className="h-6 w-6 text-orange-600" />
                            </div>
                          </div>
                        </Card>
                        <Card className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">Offres actives</p>
                              <p className="text-2xl font-bold">{mesOffres.filter(o => o.isActive).length}</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                              <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                          </div>
                        </Card>
                        <Card className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">Total réservations</p>
                              <p className="text-2xl font-bold">
                                {mesOffres.reduce((sum, o) => sum + (o._count?.reservations || 0), 0)}
                              </p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                              <Calendar className="h-6 w-6 text-blue-600" />
                            </div>
                          </div>
                        </Card>
                        <Card className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">Note moyenne</p>
                              <p className="text-2xl font-bold">
                                {mesOffres.length > 0 
                                  ? (mesOffres.reduce((sum, o) => sum + (o.rating || 0), 0) / mesOffres.length).toFixed(1)
                                  : '0.0'}
                              </p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                              <Star className="h-6 w-6 text-yellow-600 fill-yellow-600" />
                            </div>
                          </div>
                        </Card>
                      </div>

                             {/* Grille d'offres améliorée */}
                             <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-start">
                        {mesOffres.map((offre, index) => {
                          const lieu = `${offre.ville || ''}, ${offre.region || ''}`.replace(/^,\s*|,\s*$/g, '') || 'Non spécifié'
                          const isBoosted = offre.isFeatured
                          
                          return (
                <motion.div
                  key={offre.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                              className="flex flex-col h-full"
                            >
                              <div className="relative flex-1">
                                {/* Badge Boost si actif */}
                                {isBoosted && (
                                  <div className="absolute top-2 left-2 z-10">
                                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg">
                                      <Zap className="h-3 w-3 mr-1" />
                                      Boosté
                                    </Badge>
                                  </div>
                                )}

                                {/* Badge Statut */}
                                <div className="absolute top-2 right-2 z-10">
                                  <Badge variant={offre.isActive ? 'default' : 'secondary'}>
                                    {offre.isActive ? 'Active' : 'Inactive'}
                                  </Badge>
                                </div>

                                <OfferCard
                                  id={offre.id}
                                  titre={offre.titre}
                                  description={offre.description}
                                  prix={Number(offre.prix)}
                                  prixUnite={offre.prixUnite}
                                  image={offre.images && offre.images.length > 0 ? offre.images[0] : '/images/ba1.png'}
                                  videos={offre.videos || []}
                                  rating={offre.rating || 0}
                                  nombreAvis={offre._count?.avis || 0}
                                  nombreLikes={offre._count?.likes || offre.nombreLikes || 0}
                                  vuesVideo={offre.vuesVideo || 0}
                                  prestataire={{
                                    nomEntreprise: offre.prestataire.nomEntreprise,
                                    logo: offre.prestataire.logo,
                                  }}
                                  lieu={lieu}
                                  region={offre.region}
                                  ville={offre.ville}
                                  isFavorite={false}
                                  isLiked={false}
                                  onToggleFavorite={async (offreId) => {
                                    // TODO: Implémenter l'API pour ajouter/retirer des favoris
                                    console.log('Toggle favorite:', offreId)
                                  }}
                                  onToggleLike={async (offreId) => {
                                    // TODO: Implémenter l'API pour ajouter/retirer des likes
                                    console.log('Toggle like:', offreId)
                                  }}
                                  onShare={(offreId) => {
                                    if (navigator.share) {
                                      navigator.share({
                                        title: offre.titre,
                                        text: offre.description,
                                        url: `${window.location.origin}/experience/${offreId}`
                                      }).catch(() => {})
                                    } else {
                                      navigator.clipboard.writeText(`${window.location.origin}/experience/${offreId}`)
                                    }
                                  }}
                                  className="h-full"
                                />
                              </div>

                                     {/* Actions de gestion */}
                                     <div className="mt-3 flex flex-wrap gap-2">
                                       <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1 min-w-[100px]">
                                         <Button 
                                           variant="outline" 
                                           size="sm" 
                                           className="w-full text-xs sm:text-sm"
                                           onClick={() => {
                                             setEditingOffreId(offre.id)
                                             setShowCreateOffreForm(true)
                                           }}
                                         >
                                           <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                           <span className="hidden sm:inline">Modifier</span>
                                           <span className="sm:hidden">Modif.</span>
                                         </Button>
                                       </motion.div>
                                       <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                         <Button 
                                           variant="outline" 
                                           size="sm"
                                           className="text-xs sm:text-sm"
                                           onClick={async () => {
                                             if (confirm('Êtes-vous sûr de vouloir supprimer cette offre ? Cette action est irréversible.')) {
                                               try {
                                                 setIsDeleting(true)
                                                 const success = await deleteOffre(offre.id)
                                                 
                                                 if (success) {
                                                   console.log('Offre supprimée avec succès')
                                                 } else {
                                                   alert('Erreur lors de la suppression')
                                                 }
                                               } catch (error) {
                                                 console.error('Error deleting offre:', error)
                                                 alert('Erreur lors de la suppression de l\'offre')
                                               } finally {
                                                 setIsDeleting(false)
                                               }
                                             }
                                           }}
                                           disabled={isDeleting}
                                         >
                                           {isDeleting ? (
                                             <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                                           ) : (
                                             <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                           )}
                                         </Button>
                                       </motion.div>
                                       <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                         <Button 
                                           variant="outline" 
                                           size="sm"
                                           onClick={() => setActiveSection('boosts')}
                                           className={cn(
                                             "text-xs sm:text-sm",
                                             isBoosted && "bg-yellow-50 border-yellow-300"
                                           )}
                                         >
                                           <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
                                         </Button>
                                       </motion.div>
                                     </div>
                            </motion.div>
                          )
                        })}
            </div>
                    </>
          )}
                </>
              )}
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
              <motion.div 
                className="mb-4 sm:mb-5 md:mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-tight mb-1 sm:mb-2 bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                  Réservations 📅
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                  Acceptez ou refusez les demandes de réservation
                </p>
              </motion.div>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Gestion des réservations</CardTitle>
              <CardDescription>Acceptez ou refusez les demandes de réservation</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : reservationsFiltrees.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {(searchQuery.trim() && (searchFilter === 'all' || searchFilter === 'reservations')) ? 'Aucune réservation trouvée' : 'Aucune réservation'}
                  </h3>
                  <p className="text-muted-foreground">
                    {(searchQuery.trim() && (searchFilter === 'all' || searchFilter === 'reservations'))
                      ? `Aucune réservation ne correspond à &quot;${searchQuery}&quot;`
                      : 'Vos réservations apparaîtront ici'}
                  </p>
                  {searchQuery.trim() && (searchFilter === 'all' || searchFilter === 'reservations') && (
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => {
                        setSearchQuery('')
                        setSearchFilter('all')
                      }}
                    >
                      Effacer la recherche
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {searchQuery.trim() && (searchFilter === 'all' || searchFilter === 'reservations') && reservationsFiltrees.length > 0 && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <p className="text-sm text-blue-800">
                        <strong>{reservationsFiltrees.length}</strong> réservation{reservationsFiltrees.length > 1 ? 's' : ''} trouvée{reservationsFiltrees.length > 1 ? 's' : ''} pour &quot;{searchQuery}&quot;
                      </p>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSearchQuery('')
                          setSearchFilter('all')
                        }}
                        className="w-full sm:w-auto"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Effacer
                      </Button>
                    </div>
                  )}
                  {reservationsFiltrees.map((reservation, index) => (
                    <motion.div
                      key={reservation.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      whileHover={{ scale: 1.01, y: -2 }}
                      className="border rounded-lg p-4 sm:p-6 space-y-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">{reservation.offre?.titre || 'Offre'}</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                            Client: {reservation.user ? `${reservation.user.prenom || ''} ${reservation.user.nom || ''}`.trim() || reservation.user.email : 'Non spécifié'}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            Date: {new Date(reservation.dateDebut).toLocaleDateString('fr-FR')}
                            {reservation.dateFin && ` - ${new Date(reservation.dateFin).toLocaleDateString('fr-FR')}`}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
                          <Badge
                            variant={reservation.statut === 'CONFIRMED' ? 'default' : 'secondary'}
                            className="text-xs sm:text-sm"
                          >
                            {reservation.statut === 'PENDING' ? 'En attente' : 
                             reservation.statut === 'CONFIRMED' ? 'Confirmée' :
                             reservation.statut === 'CANCELLED' ? 'Annulée' : 'Terminée'}
                          </Badge>
                          <p className="text-base sm:text-lg font-bold">
                            {Number(reservation.montant).toLocaleString()} FCFA
                          </p>
                        </div>
                      </div>
                      {reservation.statut === 'PENDING' && (
                        <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t">
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                            <Button variant="outline" size="sm" className="w-full">Refuser</Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                            <Button size="sm" className="w-full">Accepter</Button>
                          </motion.div>
                        </div>
                      )}
                      {reservation.statut === 'PENDING' && (
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                          <Button variant="ghost" size="sm" className="w-full sm:w-auto" onClick={() => setActiveSection('messages')}>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Contacter le client
                          </Button>
                        </motion.div>
                      )}
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
                  {searchQuery.trim() && (searchFilter === 'all' || searchFilter === 'messages') && conversationsFiltrees.length > 0 && (
                    <div className="p-4 bg-blue-50 border-b border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <p className="text-sm text-blue-800">
                        <strong>{conversationsFiltrees.length}</strong> conversation{conversationsFiltrees.length > 1 ? 's' : ''} trouvée{conversationsFiltrees.length > 1 ? 's' : ''} pour &quot;{searchQuery}&quot;
                      </p>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSearchQuery('')
                          setSearchFilter('all')
                        }}
                        className="w-full sm:w-auto"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Effacer
                      </Button>
                    </div>
                  )}
                  <ChatInterface
                    currentUserId={user?.id || 'prestataire-current'}
                    conversations={(searchQuery.trim() && (searchFilter === 'all' || searchFilter === 'messages')) ? conversationsFiltrees : conversations}
                    messages={allMessages}
                    emptyStateTitle={(searchQuery.trim() && (searchFilter === 'all' || searchFilter === 'messages')) ? "Aucune conversation trouvée" : "Aucun message"}
                    emptyStateDescription={(searchQuery.trim() && (searchFilter === 'all' || searchFilter === 'messages')) ? `Aucune conversation ne correspond à &quot;${searchQuery}&quot;` : "Vos conversations avec les clients apparaîtront ici"}
                    onSendMessage={handleSendMessage}
                    onSelectConversation={handleSelectConversation}
                  />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeSection === 'revenus' && (
            <motion.div 
              key="revenus"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <motion.div 
                className="mb-4 sm:mb-5 md:mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-tight mb-1 sm:mb-2 bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                  Revenus 💰
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                  Gérez vos revenus, paiements et retraits
                </p>
              </motion.div>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Revenus et paiements</CardTitle>
                  <CardDescription>Historique de vos paiements et retraits</CardDescription>
                </div>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter (CSV)
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Solde disponible</p>
                  <p className="text-3xl font-bold">{solde.toLocaleString()} FCFA</p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Historique des paiements</h3>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : paiementsFiltres.length === 0 ? (
                    <div className="text-center py-12">
                      <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        {(searchQuery.trim() && (searchFilter === 'all' || searchFilter === 'paiements')) ? 'Aucun paiement trouvé' : 'Aucun paiement'}
                      </h3>
                      <p className="text-muted-foreground">
                        {(searchQuery.trim() && (searchFilter === 'all' || searchFilter === 'paiements'))
                          ? `Aucun paiement ne correspond à &quot;${searchQuery}&quot;`
                          : 'Vos paiements apparaîtront ici après les réservations payées'}
                      </p>
                      {searchQuery.trim() && (searchFilter === 'all' || searchFilter === 'paiements') && (
                        <Button 
                          variant="outline" 
                          className="mt-4"
                          onClick={() => {
                            setSearchQuery('')
                            setSearchFilter('all')
                          }}
                        >
                          Effacer la recherche
                        </Button>
                      )}
                    </div>
                  ) : (
                    <>
                      {searchQuery.trim() && (searchFilter === 'all' || searchFilter === 'paiements') && paiementsFiltres.length > 0 && (
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                          <p className="text-sm text-blue-800">
                            <strong>{paiementsFiltres.length}</strong> paiement{paiementsFiltres.length > 1 ? 's' : ''} trouvé{paiementsFiltres.length > 1 ? 's' : ''} pour &quot;{searchQuery}&quot;
                          </p>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setSearchQuery('')
                              setSearchFilter('all')
                            }}
                            className="w-full sm:w-auto"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Effacer
                          </Button>
                        </div>
                      )}
                      {paiementsFiltres.map((paiement, index) => (
                      <motion.div
                        key={paiement.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        whileHover={{ scale: 1.02, x: 4 }}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-base sm:text-lg">
                            {paiement.montant.toLocaleString()} FCFA
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                            {new Date(paiement.date).toLocaleDateString('fr-FR')} • {paiement.methode.toUpperCase()}
                          </p>
                        </div>
                        <div className="w-full sm:w-auto">
                          <Badge variant="secondary" className="text-xs sm:text-sm">
                            Payé
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                    </>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-4">Demander un retrait</h3>
                  <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="montant">Montant (FCFA)</Label>
                      <Input id="montant" type="number" placeholder="100000" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="methode">Méthode de retrait</Label>
                      <select
                        id="methode"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="om">Orange Money</option>
                        <option value="wave">Wave</option>
                        <option value="free_money">Free Money</option>
                        <option value="carte">Carte Visa/Mastercard</option>
                      </select>
                    </div>
                  </div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      className="w-full mt-4"
                      onClick={() => {
                        // TODO: Implémenter la demande de retrait
                        alert('Fonctionnalité de retrait à venir')
                      }}
                    >
                      Demander le retrait
                    </Button>
                  </motion.div>
                </div>
              </div>
            </CardContent>
          </Card>
            </motion.div>
          )}

          {activeSection === 'statistiques' && (
            <motion.div 
              key="statistiques"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <motion.div 
                className="mb-4 sm:mb-5 md:mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-tight mb-1 sm:mb-2 bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                  Statistiques 📈
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                  Analysez vos performances et vos données
                </p>
              </motion.div>
          <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Vues des offres</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Évolution des vues sur 6 mois</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart
                  data={{
                    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
                    datasets: [
                      {
                        label: 'Nombre de vues',
                        data: [450, 520, 480, 610, 580, 650],
                        borderColor: 'rgba(249, 115, 22, 1)',
                        backgroundColor: 'rgba(249, 115, 22, 0.1)',
                        fill: true,
                      },
                    ],
                  }}
                  height={250}
                />
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Réservations mensuelles</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Nombre de réservations par mois</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={{
                    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
                    datasets: [
                      {
                        label: 'Réservations',
                        data: [12, 15, 18, 14, 16, 20],
                        backgroundColor: 'rgba(234, 179, 8, 0.8)',
                        borderColor: 'rgba(234, 179, 8, 1)',
                      },
                    ],
                  }}
                  height={250}
                />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Revenus mensuels</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Évolution des revenus sur 6 mois</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart
                  data={{
                    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
                    datasets: [
                      {
                        label: 'Revenus (FCFA)',
                        data: [250000, 300000, 280000, 320000, 350000, 380000],
                        borderColor: 'rgba(34, 197, 94, 1)',
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        fill: true,
                      },
                    ],
                  }}
                  height={250}
                />
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Répartition des réservations</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Par statut de réservation</CardDescription>
              </CardHeader>
              <CardContent>
                <DoughnutChart
                  data={{
                    labels: ['Confirmées', 'En attente', 'Annulées'],
                    datasets: [
                      {
                        label: 'Réservations',
                        data: [65, 20, 15],
                        backgroundColor: [
                          'rgba(34, 197, 94, 0.8)',
                          'rgba(234, 179, 8, 0.8)',
                          'rgba(239, 68, 68, 0.8)',
                        ],
                        borderColor: [
                          'rgba(34, 197, 94, 1)',
                          'rgba(234, 179, 8, 1)',
                          'rgba(239, 68, 68, 1)',
                        ],
                      },
                    ],
                  }}
                  height={250}
                />
              </CardContent>
            </Card>
          </div>
            </motion.div>
          )}

          {activeSection === 'abonnements' && (
            <motion.div 
              key="abonnements"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <motion.div 
                className="mb-4 sm:mb-5 md:mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-tight mb-1 sm:mb-2 bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                  Mon Abonnement 💳
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                  Gérez votre plan d&apos;abonnement et accédez à plus de fonctionnalités
                </p>
              </motion.div>

              {/* Plan Actuel */}
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-yellow-500" />
                    Plan Actuel
                  </CardTitle>
                  <CardDescription>Votre abonnement actuel et ses avantages</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 p-3 sm:p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-lg font-semibold">
                          Plan Gratuit
                        </Badge>
                        <Badge variant="secondary">Actif</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Expire le: Jamais (plan gratuit)
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">0 FCFA</div>
                      <p className="text-xs text-muted-foreground">/mois</p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                    <div className="p-3 border rounded-lg">
                      <div className="text-sm font-medium mb-1">Expériences</div>
                      <div className="text-2xl font-bold">5 / 5</div>
                      <p className="text-xs text-muted-foreground">Limite atteinte</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="text-sm font-medium mb-1">Boosts gratuits</div>
                      <div className="text-2xl font-bold">0</div>
                      <p className="text-xs text-muted-foreground">Ce mois</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="text-sm font-medium mb-1">Statistiques</div>
                      <div className="flex items-center gap-1">
                        <XCircle className="h-4 w-4 text-red-500" />
                        <span className="text-sm">Non disponible</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Plans Disponibles */}
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Choisir un Plan</CardTitle>
                  <CardDescription>Upgradez pour débloquer plus de fonctionnalités</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2">
                    {/* Plan Pro */}
                    <Card className="border-2 hover:border-orange-500 transition-colors">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <CardTitle className="text-xl">Plan Pro</CardTitle>
                          <Badge variant="outline">Populaire</Badge>
                        </div>
                        <div className="text-3xl font-bold mb-2">
                          4 000 <span className="text-lg font-normal text-muted-foreground">FCFA</span>
                        </div>
                        <CardDescription>/mois</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Expériences illimitées</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Statistiques détaillées</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">1 boost gratuit/mois</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Support prioritaire</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Badge &quot;Pro&quot;</span>
                          </div>
                        </div>
                        <Button className="w-full mt-4" variant="outline">
                          Choisir Pro
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Plan Premium */}
                    <Card className="border-2 border-yellow-500 hover:border-yellow-600 transition-colors bg-gradient-to-br from-yellow-50 to-orange-50">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <CardTitle className="text-xl flex items-center gap-2">
                            Plan Premium
                            <Crown className="h-5 w-5 text-yellow-500" />
                          </CardTitle>
                          <Badge className="bg-yellow-500">Recommandé</Badge>
                        </div>
                        <div className="text-3xl font-bold mb-2">
                          11 000 <span className="text-lg font-normal text-muted-foreground">FCFA</span>
                        </div>
                        <CardDescription>/mois</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium">Tout du Plan Pro +</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">3 boosts gratuits/mois</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Badge &quot;Certifié&quot;</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Analytics avancés</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Support 24/7</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">URL personnalisée</span>
                          </div>
                        </div>
                        <Button 
                          className="w-full mt-4 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
                          onClick={() => {
                            // TODO: Implémenter le changement d'abonnement
                            alert('Fonctionnalité de changement d\'abonnement à venir')
                          }}
                        >
                          Choisir Premium
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>

              {/* Historique des Abonnements */}
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Historique</CardTitle>
                  <CardDescription>Vos abonnements précédents</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucun historique d&apos;abonnement</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeSection === 'boosts' && (
            <motion.div 
              key="boosts"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <motion.div 
                className="mb-4 sm:mb-5 md:mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-tight mb-1 sm:mb-2 bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                  Boosts 🚀
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                  Augmentez la visibilité de vos offres avec nos boosts
                </p>
              </motion.div>

              {/* Boosts Actifs */}
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    Boosts Actifs
                  </CardTitle>
                  <CardDescription>Vos boosts en cours</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 sm:p-4 border rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-2">
                        <div>
                          <div className="font-semibold text-sm sm:text-base">Tour guidé Dakar</div>
                          <div className="text-xs sm:text-sm text-muted-foreground">Boost Expérience - 7 jours</div>
                        </div>
                        <Badge className="bg-green-500 text-xs sm:text-sm">Actif</Badge>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mt-3 text-xs sm:text-sm">
                        <div>
                          <span className="text-muted-foreground">Début:</span> 15/03/2024
                        </div>
                        <div>
                          <span className="text-muted-foreground">Fin:</span> 22/03/2024
                        </div>
                        <div>
                          <span className="text-muted-foreground">Prix:</span> 6 000 FCFA
                        </div>
                      </div>
                    </div>
                    <div className="text-center py-4 text-sm text-muted-foreground">
                      Aucun autre boost actif
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Créer un Boost */}
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Créer un Boost</CardTitle>
                  <CardDescription>Augmentez la visibilité de vos offres</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="boostType">Type de boost</Label>
                      <Select value={boostType} onValueChange={(value) => setBoostType(value as typeof boostType)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EXPERIENCE">Boost d&apos;Expérience</SelectItem>
                          <SelectItem value="REGIONAL">Boost Régional</SelectItem>
                          <SelectItem value="CATEGORIE">Boost Catégorie</SelectItem>
                          <SelectItem value="MENSUEL">Boost Mensuel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {boostType === 'EXPERIENCE' && (
                    <div className="space-y-2">
                        <Label htmlFor="boostOffre">Expérience</Label>
                        <Select value={selectedOffreId} onValueChange={setSelectedOffreId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une expérience" />
                        </SelectTrigger>
                        <SelectContent>
                            {mesOffres.map((offre) => (
                              <SelectItem key={offre.id} value={offre.id}>
                                {offre.titre}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="boostDuree">Durée</Label>
                      <Select value={boostDuree} onValueChange={(value) => setBoostDuree(value as typeof boostDuree)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une durée" />
                        </SelectTrigger>
                        <SelectContent>
                          {boostType === 'EXPERIENCE' && (
                          <SelectItem value="jour">1 jour - 1 000 FCFA</SelectItem>
                          )}
                          <SelectItem value="semaine">7 jours - {boostType === 'EXPERIENCE' ? '6 000' : boostType === 'REGIONAL' ? '5 000' : '3 000'} FCFA</SelectItem>
                          <SelectItem value="mois">30 jours - {boostType === 'EXPERIENCE' ? '15 000' : boostType === 'REGIONAL' ? '15 000' : '10 000'} FCFA</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                      <div>
                        <div className="font-semibold text-sm sm:text-base">Prix total</div>
                        <div className="text-xs sm:text-sm text-muted-foreground">Montant à payer</div>
                      </div>
                      <div className="text-xl sm:text-2xl font-bold">
                        {boostType === 'EXPERIENCE' 
                          ? (boostDuree === 'jour' ? '1 000' : boostDuree === 'semaine' ? '6 000' : '15 000')
                          : boostType === 'REGIONAL'
                          ? (boostDuree === 'semaine' ? '5 000' : '15 000')
                          : (boostDuree === 'semaine' ? '3 000' : '10 000')
                        } FCFA
                    </div>
                  </div>
                  </div>
                  <Button 
                    className="w-full" 
                    disabled={isCreatingBoost || (boostType === 'EXPERIENCE' && !selectedOffreId)}
                    onClick={async () => {
                      if (boostType === 'EXPERIENCE' && !selectedOffreId) {
                        alert('Veuillez sélectionner une expérience')
                        return
                      }
                      setIsCreatingBoost(true)
                      try {
                        const response = await fetch('/api/boosts', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            type: boostType,
                            offreId: boostType === 'EXPERIENCE' ? selectedOffreId : undefined,
                            duree: boostDuree,
                            methode: 'boosts_disponibles',
                          }),
                        })
                        const data = await response.json()
                        if (response.ok && data.success) {
                          alert('Boost créé avec succès !')
                          setSelectedOffreId('')
                          setBoostDuree('semaine')
                          await refetchOffres()
                        } else {
                          alert(data.error || 'Erreur lors de la création du boost')
                        }
                      } catch (error) {
                        console.error('Error creating boost:', error)
                        alert('Erreur lors de la création du boost')
                      } finally {
                        setIsCreatingBoost(false)
                      }
                    }}
                  >
                    {isCreatingBoost ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Création...
                      </>
                    ) : (
                      'Créer le boost'
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Tarifs des Boosts */}
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Tarifs des Boosts</CardTitle>
                  <CardDescription>Choisissez le boost adapté à vos besoins</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 sm:p-4 border rounded-lg">
                      <div className="font-semibold mb-2 text-sm sm:text-base">Boost d&apos;Expérience</div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
                        <div>
                          <div className="font-medium">1 jour</div>
                          <div className="text-muted-foreground">1 000 FCFA</div>
                        </div>
                        <div>
                          <div className="font-medium">7 jours</div>
                          <div className="text-muted-foreground">6 000 FCFA</div>
                        </div>
                        <div>
                          <div className="font-medium">30 jours</div>
                          <div className="text-muted-foreground">15 000 FCFA</div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="font-semibold mb-2">Boost Régional</div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="font-medium">7 jours</div>
                          <div className="text-muted-foreground">5 000 FCFA</div>
                        </div>
                        <div>
                          <div className="font-medium">30 jours</div>
                          <div className="text-muted-foreground">15 000 FCFA</div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="font-semibold mb-2">Boost Catégorie</div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="font-medium">7 jours</div>
                          <div className="text-muted-foreground">3 000 FCFA</div>
                        </div>
                        <div>
                          <div className="font-medium">30 jours</div>
                          <div className="text-muted-foreground">10 000 FCFA</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeSection === 'parrainage' && (
            <motion.div 
              key="parrainage"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <motion.div 
                className="mb-4 sm:mb-5 md:mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-tight mb-1 sm:mb-2 bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                  Parrainage 🎁
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                  Invitez d&apos;autres prestataires et gagnez des points convertibles en boosts
                </p>
              </motion.div>
              <ReferralDashboard />
            </motion.div>
          )}

          {activeSection === 'parametres' && (
            <motion.div 
              key="parametres"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <motion.div 
                className="mb-4 sm:mb-5 md:mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-tight mb-1 sm:mb-2 bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                  Paramètres ⚙️
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                  Gérez vos informations de prestataire
                </p>
              </motion.div>
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Paramètres du compte</CardTitle>
                  <CardDescription>Gérez vos informations de prestataire</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col items-center md:items-start gap-6 pb-6 border-b">
                    <AvatarUpload
                      currentImage={logoImage}
                      onImageChange={handleLogoChange}
                      label="Logo de l'entreprise"
                      size="lg"
                    />
                  </div>

                  <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="nomEntreprise">Nom de l&apos;entreprise</Label>
                      <Input id="nomEntreprise" defaultValue="Mon Hôtel" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Type de prestataire</Label>
                      <Input id="type" defaultValue="Hôtel" disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="contact@hotel.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telephone">Téléphone</Label>
                      <Input id="telephone" type="tel" defaultValue="+221 77 123 45 67" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="langue">Langue</Label>
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
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      className="w-full sm:w-auto"
                      onClick={async () => {
                        // TODO: Implémenter la sauvegarde des paramètres
                        alert('Paramètres enregistrés avec succès !')
                      }}
                    >
                      Enregistrer les modifications
                    </Button>
                  </motion.div>
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

