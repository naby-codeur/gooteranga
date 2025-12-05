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
import Image from 'next/image'

export default function PrestataireDashboardPage() {
  const [activeSection, setActiveSection] = useState('overview')
  const [logoImage, setLogoImage] = useState<string | null>(null)

  // Récupérer les données utilisateur depuis l'API
  const { user, loading: authLoading } = useAuth()
  const { reservations, loading: reservationsLoading } = useReservations()
  const { offres, loading: offresLoading } = useOffres({ isActive: true })

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
  const mesOffres = useMemo(() => {
    if (!user?.prestataire?.id) return []
    return offres.filter(offre => offre.prestataire?.id === user.prestataire?.id)
  }, [offres, user])

  // Calculer le solde disponible (revenus payés moins commissions)
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
        commission: 0, // Pas de commission pour l'instant
        methode: r.paiement?.methode || 'Non spécifié',
        date: r.createdAt,
        statut: 'paid',
      }))
  }, [reservations])

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
    <div className="flex w-full">
      <DashboardSidebar type="prestataire" activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="flex-1 flex flex-col lg:ml-0 min-h-screen bg-gradient-to-br from-orange-50/50 via-yellow-50/30 to-orange-50/50">
        <DashboardHeader 
          type="prestataire" 
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
                className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
        <div>
                  <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
            Tableau de Bord Prestataire
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground">
            Gérez vos offres, réservations et revenus
          </p>
        </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button onClick={() => setActiveSection('offres')} className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvelle offre
                  </Button>
                </motion.div>
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
                <CardTitle className="text-sm font-medium">Vues totales</CardTitle>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Eye className="h-4 w-4 text-muted-foreground" />
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
                      {stats.vues.toLocaleString()}
                    </motion.div>
                    <p className="text-xs text-muted-foreground">
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
          <div className="grid gap-4 sm:grid-cols-2">
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
              ) : reservations.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucune réservation</h3>
                  <p className="text-muted-foreground">
                    Vos réservations apparaîtront ici
                  </p>
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
              <motion.div 
                className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                    Mes offres 🎯
                  </h2>
                  <p className="text-muted-foreground">
                    Gérez vos offres et services
                  </p>
                </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une offre
              </Button>
            </motion.div>
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : mesOffres.length === 0 ? (
            <div className="text-center py-12">
              <Plus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucune offre</h3>
              <p className="text-muted-foreground mb-4">
                Créez votre première offre pour commencer
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Créer une offre
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {mesOffres.map((offre, index) => (
                <motion.div
                  key={offre.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="h-48 bg-gradient-to-br from-orange-300 to-yellow-300 relative">
                    {offre.images && offre.images.length > 0 && (
                      <Image 
                        src={offre.images[0]} 
                        alt={offre.titre}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{offre.titre}</CardTitle>
                      <Badge variant={offre.isActive ? 'default' : 'secondary'}>
                        {offre.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Prix</p>
                        <p className="font-medium">{Number(offre.prix).toLocaleString()} FCFA</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Réservations</p>
                        <p className="font-medium">{offre._count?.reservations || 0}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
                </motion.div>
              ))}
            </div>
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
                className="mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                  Réservations 📅
                </h2>
                <p className="text-muted-foreground">
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
              ) : reservations.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucune réservation</h3>
                  <p className="text-muted-foreground">
                    Vos réservations apparaîtront ici
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reservations.map((reservation, index) => (
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
                          <h3 className="text-lg font-semibold">{reservation.offre?.titre || 'Offre'}</h3>
                          <p className="text-sm text-muted-foreground">
                            Client: {reservation.user ? `${reservation.user.prenom || ''} ${reservation.user.nom || ''}`.trim() || reservation.user.email : 'Non spécifié'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Date: {new Date(reservation.dateDebut).toLocaleDateString('fr-FR')}
                            {reservation.dateFin && ` - ${new Date(reservation.dateFin).toLocaleDateString('fr-FR')}`}
                          </p>
                        </div>
                        <Badge
                          variant={reservation.statut === 'CONFIRMED' ? 'default' : 'secondary'}
                        >
                          {reservation.statut === 'PENDING' ? 'En attente' : 
                           reservation.statut === 'CONFIRMED' ? 'Confirmée' :
                           reservation.statut === 'CANCELLED' ? 'Annulée' : 'Terminée'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-bold">
                          {Number(reservation.montant).toLocaleString()} FCFA
                        </p>
                      {reservation.statut === 'PENDING' && (
                        <div className="flex flex-col sm:flex-row gap-2">
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button variant="outline" size="sm" className="w-full sm:w-auto">Refuser</Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button size="sm" className="w-full sm:w-auto">Accepter</Button>
                          </motion.div>
                        </div>
                      )}
                      </div>
                      {reservation.statut === 'PENDING' && (
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button variant="ghost" size="sm" className="w-full sm:w-auto">
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
                className="mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                  Revenus 💰
                </h2>
                <p className="text-muted-foreground">
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
                  ) : paiements.length === 0 ? (
                    <div className="text-center py-12">
                      <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Aucun paiement</h3>
                      <p className="text-muted-foreground">
                        Vos paiements apparaîtront ici après les réservations payées
                      </p>
                    </div>
                  ) : (
                    paiements.map((paiement, index) => (
                      <motion.div
                        key={paiement.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        whileHover={{ scale: 1.02, x: 4 }}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div>
                          <p className="font-medium">
                            {paiement.montant.toLocaleString()} FCFA
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(paiement.date).toLocaleDateString('fr-FR')} • {paiement.methode.toUpperCase()}
                          </p>
                        </div>
                        <div className="text-left sm:text-right w-full sm:w-auto">
                          <Badge variant="secondary" className="mb-2 sm:mb-0">
                            Commission: {paiement.commission.toLocaleString()} FCFA
                          </Badge>
                          <p className="text-sm text-muted-foreground mt-1">
                            Net: {(paiement.montant - paiement.commission).toLocaleString()} FCFA
                          </p>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-4">Demander un retrait</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
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
                    <Button className="w-full mt-4">Demander le retrait</Button>
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
                className="mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                  Statistiques 📈
                </h2>
                <p className="text-muted-foreground">
                  Analysez vos performances et vos données
                </p>
              </motion.div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle>Vues des offres</CardTitle>
                <CardDescription>Évolution des vues sur 6 mois</CardDescription>
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
                <CardTitle>Réservations mensuelles</CardTitle>
                <CardDescription>Nombre de réservations par mois</CardDescription>
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

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle>Revenus mensuels</CardTitle>
                <CardDescription>Évolution des revenus sur 6 mois</CardDescription>
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
                <CardTitle>Répartition des réservations</CardTitle>
                <CardDescription>Par statut de réservation</CardDescription>
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
                className="mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                  Mon Abonnement 💳
                </h2>
                <p className="text-muted-foreground">
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
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200">
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

                  <div className="grid gap-3 md:grid-cols-3">
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
                  <div className="grid gap-4 md:grid-cols-2">
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
                        <Button className="w-full mt-4 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600">
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
                className="mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                  Boosts 🚀
                </h2>
                <p className="text-muted-foreground">
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
                    <div className="p-4 border rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-semibold">Tour guidé Dakar</div>
                          <div className="text-sm text-muted-foreground">Boost Expérience - 7 jours</div>
                        </div>
                        <Badge className="bg-green-500">Actif</Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-sm">
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
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="boostType">Type de boost</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="experience">Boost d&apos;Expérience</SelectItem>
                          <SelectItem value="regional">Boost Régional</SelectItem>
                          <SelectItem value="categorie">Boost Catégorie</SelectItem>
                          <SelectItem value="mensuel">Boost Mensuel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="boostOffre">Expérience (si boost expérience)</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une expérience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Tour guidé Dakar</SelectItem>
                          <SelectItem value="2">Chambre double vue mer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="boostDuree">Durée</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une durée" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="jour">1 jour - 1 000 FCFA</SelectItem>
                          <SelectItem value="semaine">7 jours - 6 000 FCFA</SelectItem>
                          <SelectItem value="mois">30 jours - 15 000 FCFA</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="boostRegion">Région (si boost régional)</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une région" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dakar">Dakar</SelectItem>
                          <SelectItem value="thies">Thiès</SelectItem>
                          <SelectItem value="saint-louis">Saint-Louis</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">Prix total</div>
                        <div className="text-sm text-muted-foreground">Montant à payer</div>
                      </div>
                      <div className="text-2xl font-bold">6 000 FCFA</div>
                    </div>
                  </div>
                  <Button className="w-full">Créer le boost</Button>
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
                    <div className="p-4 border rounded-lg">
                      <div className="font-semibold mb-2">Boost d&apos;Expérience</div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
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
                className="mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                  Paramètres ⚙️
                </h2>
                <p className="text-muted-foreground">
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

                  <div className="grid gap-4 md:grid-cols-2">
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
                  </div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button className="w-full sm:w-auto">Enregistrer les modifications</Button>
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

