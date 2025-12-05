'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AdminSidebar } from '@/components/layout/AdminSidebar'
import { AdminHeader } from '@/components/layout/AdminHeader'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, 
  Package, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  CheckCircle,
  XCircle,
  Star,
  Eye,
  FileText,
  MessageSquare,
  Settings,
  BarChart3,
  Shield,
  Globe,
  CreditCard,
  UserCheck,
  Search,
  Download,
  Edit,
  Ban,
  Mail,
  Phone,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { LineChart, BarChart, DoughnutChart } from '@/components/ui/charts'

// Types pour les données
interface Prestataire {
  id: string
  nomEntreprise: string
  type: string
  email?: string
  telephone?: string
  isVerified: boolean
  rating: number
  nombreAvis: number
  createdAt: string | Date
  region?: string
  ville?: string
  user?: {
    id: string
    email: string
    nom: string
    prenom: string | null
    isActive: boolean
  }
}

interface Activite {
  id: string
  titre: string
  type: string
  prestataire: string
  prix: number
  region: string
  isActive: boolean
  rating: number
  vues: number
  createdAt: string
}

interface Reservation {
  id: string
  offre: string
  client: string
  prestataire: string
  dateDebut: string
  montant: number
  statut: string
  createdAt: string
}

interface Utilisateur {
  id: string
  nom: string
  prenom: string | null
  email: string
  role: string
  telephone: string | null
  createdAt: string | Date
  isActive: boolean
  _count?: {
    reservations: number
    favoris: number
    avis: number
  }
}

export default function AdminDashboardPage() {
  const [activeSection, setActiveSection] = useState('overview')
  const [memberForm, setMemberForm] = useState({
    email: '',
    nom: '',
    prenom: '',
    telephone: '',
    role: ''
  })
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([])
  const [prestataires, setPrestataires] = useState<Prestataire[]>([])
  const [loadingUtilisateurs, setLoadingUtilisateurs] = useState(false)
  const [loadingPrestataires, setLoadingPrestataires] = useState(false)
  const [filtreRole, setFiltreRole] = useState('all')
  const [filtreStatut, setFiltreStatut] = useState('all')
  const [searchUtilisateur, setSearchUtilisateur] = useState('')

  // Données pour les graphiques (calculées une seule fois)
  const reservationsData = useMemo(() => [156, 134, 98, 87, 76], [])
  const topDestinations = useMemo(() => ['Dakar', 'Thiès', 'Saint-Louis', 'Ziguinchor', 'Tambacounda'], [])
  const touristOrigins = useMemo(() => ['France', 'Belgique', 'Suisse', 'Canada', 'États-Unis'], [])
  const originPercentages = useMemo(() => [28, 22, 18, 15, 12], [])

  // Données fictives - à remplacer par des appels API réels
  const stats = {
    prestatairesTotal: 156,
    activitesTotal: 342,
    reservationsTotal: 1245,
    reservationsMois: 89,
    revenusTotal: 45230000,
    revenusMois: 3200000,
    revenusAbonnements: 240000, // Revenus des abonnements (Pro + Premium)
    revenusBoosts: 80000, // Revenus des boosts
    revenusTotalMois: 320000, // Total revenus GooTeranga (abonnements + boosts)
    utilisateursTotal: 2341,
    utilisateursMois: 45,
  }

  // Charger les utilisateurs depuis l'API
  useEffect(() => {
    if (activeSection === 'utilisateurs') {
      loadUtilisateurs()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection, filtreRole, filtreStatut, searchUtilisateur])

  const loadUtilisateurs = async () => {
    setLoadingUtilisateurs(true)
    try {
      const params = new URLSearchParams()
      if (filtreRole !== 'all') params.append('role', filtreRole)
      if (filtreStatut !== 'all') params.append('statut', filtreStatut)
      if (searchUtilisateur) params.append('search', searchUtilisateur)

      const response = await fetch(`/api/admin/utilisateurs?${params.toString()}`)
      const data = await response.json()
      
      if (response.ok && data.success) {
        setUtilisateurs(data.data || [])
      } else {
        console.error('Erreur lors du chargement des utilisateurs:', data.error)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error)
    } finally {
      setLoadingUtilisateurs(false)
    }
  }

  const loadPrestataires = useCallback(async () => {
    setLoadingPrestataires(true)
    try {
      const response = await fetch('/api/admin/prestataires')
      const data = await response.json()
      
      if (response.ok && data.success) {
        setPrestataires(data.data || [])
      } else {
        console.error('Erreur lors du chargement des prestataires:', data.error)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des prestataires:', error)
    } finally {
      setLoadingPrestataires(false)
    }
  }, [])

  // Charger les prestataires depuis l'API
  useEffect(() => {
    if (activeSection === 'prestataires') {
      loadPrestataires()
    }
  }, [activeSection, loadPrestataires])

  const handleSuspendUtilisateur = async (userId: string, action: 'suspend' | 'unsuspend') => {
    const confirmMessage = action === 'suspend' 
      ? 'Êtes-vous sûr de vouloir suspendre cet utilisateur ?'
      : 'Êtes-vous sûr de vouloir réactiver cet utilisateur ?'
    
    if (!confirm(confirmMessage)) return

    try {
      const response = await fetch('/api/admin/utilisateurs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action })
      })

      const data = await response.json()
      if (response.ok && data.success) {
        alert(data.message || (action === 'suspend' ? 'Utilisateur suspendu avec succès' : 'Utilisateur réactivé avec succès'))
        loadUtilisateurs()
      } else {
        alert(data.error || 'Erreur lors de l\'opération')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de l\'opération')
    }
  }

  const handleSuspendPrestataire = async (prestataireId: string, action: 'suspend' | 'unsuspend') => {
    const confirmMessage = action === 'suspend' 
      ? 'Êtes-vous sûr de vouloir suspendre ce prestataire ? Toutes ses offres seront désactivées.'
      : 'Êtes-vous sûr de vouloir réactiver ce prestataire ?'
    
    if (!confirm(confirmMessage)) return

    try {
      const response = await fetch('/api/admin/prestataires', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prestataireId, action })
      })

      const data = await response.json()
      if (response.ok && data.success) {
        alert(data.message || (action === 'suspend' ? 'Prestataire suspendu avec succès' : 'Prestataire réactivé avec succès'))
        loadPrestataires()
      } else {
        alert(data.error || 'Erreur lors de l\'opération')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de l\'opération')
    }
  }

  const activites: Activite[] = [
    {
      id: '1',
      titre: 'Visite de l\'Île de Gorée',
      type: 'ACTIVITE',
      prestataire: 'Guide Sénégal Authentique',
      prix: 5000,
      region: 'Dakar',
      isActive: true,
      rating: 4.8,
      vues: 1234,
      createdAt: '2024-02-20',
    },
    {
      id: '2',
      titre: 'Safari dans le Parc Niokolo-Koba',
      type: 'ACTIVITE',
      prestataire: 'Nature Sénégal',
      prix: 25000,
      region: 'Tambacounda',
      isActive: false,
      rating: 4.6,
      vues: 567,
      createdAt: '2024-03-05',
    },
  ]

  const reservations: Reservation[] = [
    {
      id: '1',
      offre: 'Hôtel Teranga - Chambre double',
      client: 'Jean Dupont',
      prestataire: 'Hôtel Teranga',
      dateDebut: '2024-03-20',
      montant: 25000,
      statut: 'CONFIRMED',
      createdAt: '2024-03-15',
    },
    {
      id: '2',
      offre: 'Visite de l\'Île de Gorée',
      client: 'Marie Martin',
      prestataire: 'Guide Sénégal Authentique',
      dateDebut: '2024-03-22',
      montant: 5000,
      statut: 'PENDING',
      createdAt: '2024-03-18',
    },
  ]


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
      <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="flex-1 flex flex-col lg:ml-0 min-h-screen bg-gradient-to-br from-orange-50/50 via-yellow-50/30 to-orange-50/50">
        <AdminHeader 
          userName="Administrateur"
          userEmail="admin@gooteranga.com"
          onSectionChange={setActiveSection}
        />
        
        <main className="flex-1 overflow-y-auto">
          <div className="container py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
            <AnimatePresence mode="wait">
              {/* Vue d'ensemble / Analytics */}
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
                      Dashboard Administrateur
                    </h1>
                    <p className="text-base sm:text-lg text-muted-foreground">
                      Vue d&apos;ensemble de la plateforme GooTeranga
                    </p>
                  </motion.div>

                  <motion.div 
                    className="space-y-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {/* KPIs Principaux */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <motion.div variants={itemVariants}>
                        <Card className="hover:shadow-lg transition-shadow duration-300">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Prestataires</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{stats.prestatairesTotal}</div>
                            <p className="text-xs text-muted-foreground">
                              Prestataires actifs
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <Card className="hover:shadow-lg transition-shadow duration-300">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Réservations</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{stats.reservationsMois}</div>
                            <p className="text-xs text-muted-foreground">
                              Ce mois ({stats.reservationsTotal} total)
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
                            <div className="text-2xl font-bold">
                              {stats.revenusMois.toLocaleString()} FCFA
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Ce mois
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <Card className="hover:shadow-lg transition-shadow duration-300">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Revenus Abonnements</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">
                              {stats.revenusAbonnements?.toLocaleString() || '0'} FCFA
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Plans Pro & Premium
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </div>

                    {/* Graphiques et statistiques détaillées */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardHeader>
                          <CardTitle>Activités par type</CardTitle>
                          <CardDescription>Répartition des activités touristiques</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <DoughnutChart
                            data={{
                              labels: ['Hébergements', 'Guides', 'Activités', 'Restaurants'],
                              datasets: [
                                {
                                  label: 'Nombre d\'activités',
                                  data: [142, 89, 67, 44],
                                  backgroundColor: [
                                    'rgba(249, 115, 22, 0.8)',
                                    'rgba(234, 179, 8, 0.8)',
                                    'rgba(251, 146, 60, 0.8)',
                                    'rgba(250, 204, 21, 0.8)',
                                  ],
                                  borderColor: [
                                    'rgba(249, 115, 22, 1)',
                                    'rgba(234, 179, 8, 1)',
                                    'rgba(251, 146, 60, 1)',
                                    'rgba(250, 204, 21, 1)',
                                  ],
                                },
                              ],
                            }}
                            height={250}
                          />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Top destinations</CardTitle>
                          <CardDescription>Régions les plus visitées</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <BarChart
                            data={{
                              labels: topDestinations,
                              datasets: [
                                {
                                  label: 'Réservations',
                                  data: reservationsData,
                                  backgroundColor: 'rgba(249, 115, 22, 0.8)',
                                  borderColor: 'rgba(249, 115, 22, 1)',
                                },
                              ],
                            }}
                            height={250}
                          />
                        </CardContent>
                      </Card>
                    </div>

                    {/* Graphique des réservations sur 6 mois */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Évolution des réservations</CardTitle>
                        <CardDescription>Réservations sur les 6 derniers mois</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <LineChart
                          data={{
                            labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
                            datasets: [
                              {
                                label: 'Réservations',
                                data: [120, 134, 156, 134, 98, 87],
                                borderColor: 'rgba(249, 115, 22, 1)',
                                backgroundColor: 'rgba(249, 115, 22, 0.1)',
                                fill: true,
                              },
                            ],
                          }}
                          height={300}
                        />
                      </CardContent>
                    </Card>

                    {/* Actions rapides */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Actions rapides</CardTitle>
                        <CardDescription>Accès rapide aux tâches courantes</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                          <Button 
                            variant="outline" 
                            className="h-auto flex-col items-start p-4"
                            onClick={() => setActiveSection('prestataires')}
                          >
                            <Users className="h-5 w-5 mb-2" />
                            <span className="font-medium">Gérer prestataires</span>
                            <span className="text-xs text-muted-foreground mt-1">
                              {stats.prestatairesTotal} prestataires
                            </span>
                          </Button>
                          <Button 
                            variant="outline" 
                            className="h-auto flex-col items-start p-4"
                            onClick={() => setActiveSection('activites')}
                          >
                            <Package className="h-5 w-5 mb-2" />
                            <span className="font-medium">Gérer activités</span>
                            <span className="text-xs text-muted-foreground mt-1">
                              {stats.activitesTotal} activités
                            </span>
                          </Button>
                          <Button 
                            variant="outline" 
                            className="h-auto flex-col items-start p-4"
                            onClick={() => setActiveSection('support')}
                          >
                            <MessageSquare className="h-5 w-5 mb-2" />
                            <span className="font-medium">Support client</span>
                            <span className="text-xs text-muted-foreground mt-1">
                              5 messages non lus
                            </span>
                          </Button>
                          <Button 
                            variant="outline" 
                            className="h-auto flex-col items-start p-4"
                            onClick={() => setActiveSection('analytics')}
                          >
                            <BarChart3 className="h-5 w-5 mb-2" />
                            <span className="font-medium">Voir analytics</span>
                            <span className="text-xs text-muted-foreground mt-1">
                              Statistiques détaillées
                            </span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              )}

              {/* Module 1: Gestion des prestataires */}
              {activeSection === 'prestataires' && (
                <motion.div 
                  key="prestataires"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                        Gestion des Prestataires
                      </h2>
                      <p className="text-muted-foreground">
                        Gérez et modérez les prestataires de la plateforme
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Exporter
                      </Button>
                    </div>
                  </div>

                  {/* Filtres */}
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Rechercher un prestataire..." className="pl-9" />
                          </div>
                        </div>
                        <Select>
                          <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Statut" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Tous</SelectItem>
                            <SelectItem value="verified">Actifs</SelectItem>
                            <SelectItem value="suspended">Suspendus</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select>
                          <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Tous les types</SelectItem>
                            <SelectItem value="HOTEL">Hôtel</SelectItem>
                            <SelectItem value="GUIDE">Guide</SelectItem>
                            <SelectItem value="AGENCE">Agence</SelectItem>
                            <SelectItem value="RESTAURANT">Restaurant</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Liste des prestataires */}
                  {loadingPrestataires ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Chargement des prestataires...</p>
                    </div>
                  ) : prestataires.length === 0 ? (
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <p className="text-muted-foreground">Aucun prestataire trouvé</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {prestataires.map((prestataire) => {
                        const user = prestataire.user
                        const isSuspended = user && !user.isActive
                        
                        return (
                          <Card key={prestataire.id} className="hover:shadow-lg transition-shadow">
                            <CardContent className="pt-6">
                              <div className="flex flex-col lg:flex-row gap-4">
                                <div className="flex-1">
                                  <div className="flex items-start justify-between mb-2">
                                    <div>
                                      <h3 className="text-lg font-semibold flex items-center gap-2">
                                        {prestataire.nomEntreprise}
                                        {isSuspended ? (
                                          <Badge variant="destructive">
                                            <Ban className="h-3 w-3 mr-1" />
                                            Suspendu
                                          </Badge>
                                        ) : (
                                          <Badge variant="default" className="bg-green-500">
                                            <CheckCircle className="h-3 w-3 mr-1" />
                                            Actif
                                          </Badge>
                                        )}
                                      </h3>
                                      <p className="text-sm text-muted-foreground mt-1">
                                        {prestataire.type} • {prestataire.ville || ''}, {prestataire.region || ''}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex flex-wrap gap-4 mt-4 text-sm">
                                    {user?.email && (
                                      <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <span>{user.email}</span>
                                      </div>
                                    )}
                                    {prestataire.telephone && (
                                      <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span>{prestataire.telephone}</span>
                                      </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                      <span>{prestataire.rating || 0} ({prestataire.nombreAvis || 0} avis)</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-col gap-2 lg:items-end">
                                  {isSuspended ? (
                                    <Button 
                                      size="sm" 
                                      className="w-full lg:w-auto"
                                      onClick={() => handleSuspendPrestataire(prestataire.id, 'unsuspend')}
                                    >
                                      <UserCheck className="h-4 w-4 mr-2" />
                                      Réactiver
                                    </Button>
                                  ) : (
                                    <>
                                      <Button variant="outline" size="sm" className="w-full lg:w-auto">
                                        <Edit className="h-4 w-4 mr-2" />
                                        Modifier
                                      </Button>
                                      <Button 
                                        variant="destructive" 
                                        size="sm" 
                                        className="w-full lg:w-auto"
                                        onClick={() => handleSuspendPrestataire(prestataire.id, 'suspend')}
                                      >
                                        <Ban className="h-4 w-4 mr-2" />
                                        Suspendre
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Module 2: Gestion des activités */}
              {activeSection === 'activites' && (
                <motion.div 
                  key="activites"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                        Gestion des Activités
                      </h2>
                      <p className="text-muted-foreground">
                        Gérez et modérez toutes les activités touristiques
                      </p>
                    </div>
                  </div>

                  {/* Filtres */}
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Rechercher une activité..." className="pl-9" />
                          </div>
                        </div>
                        <Select>
                          <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Statut" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Toutes</SelectItem>
                            <SelectItem value="active">Actives</SelectItem>
                            <SelectItem value="inactive">Inactives</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select>
                          <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Tous les types</SelectItem>
                            <SelectItem value="HEBERGEMENT">Hébergement</SelectItem>
                            <SelectItem value="GUIDE">Guide</SelectItem>
                            <SelectItem value="ACTIVITE">Activité</SelectItem>
                            <SelectItem value="RESTAURANT">Restaurant</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Liste des activités */}
                  <div className="space-y-4">
                    {activites.map((activite) => (
                      <Card key={activite.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                          <div className="flex flex-col lg:flex-row gap-4">
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="text-lg font-semibold flex items-center gap-2">
                                    {activite.titre}
                                    {activite.isActive ? (
                                      <Badge variant="default" className="bg-green-500">
                                        Active
                                      </Badge>
                                    ) : (
                                      <Badge variant="secondary">
                                        Inactive
                                      </Badge>
                                    )}
                                  </h3>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {activite.type} • {activite.region} • Prestataire: {activite.prestataire}
                                  </p>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-4 mt-4 text-sm">
                                <div className="flex items-center gap-2">
                                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                                  <span>{activite.prix.toLocaleString()} FCFA</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                  <span>{activite.rating}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Eye className="h-4 w-4 text-muted-foreground" />
                                  <span>{activite.vues} vues</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <span>Créée le {new Date(activite.createdAt).toLocaleDateString('fr-FR')}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2 lg:items-end">
                              <Button variant="outline" size="sm" className="w-full lg:w-auto">
                                <Eye className="h-4 w-4 mr-2" />
                                Voir détails
                              </Button>
                              {activite.isActive ? (
                                <Button variant="destructive" size="sm" className="w-full lg:w-auto">
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Masquer
                                </Button>
                              ) : (
                                <Button size="sm" className="w-full lg:w-auto">
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Activer
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Module 3: Gestion des réservations */}
              {activeSection === 'reservations' && (
                <motion.div 
                  key="reservations"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                      Gestion des Réservations
                    </h2>
                    <p className="text-muted-foreground">
                      Supervisez toutes les réservations et intervenez en cas de litige
                    </p>
                  </div>

                  {/* Filtres */}
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Rechercher une réservation..." className="pl-9" />
                          </div>
                        </div>
                        <Select>
                          <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Statut" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Tous</SelectItem>
                            <SelectItem value="PENDING">En attente</SelectItem>
                            <SelectItem value="CONFIRMED">Confirmées</SelectItem>
                            <SelectItem value="CANCELLED">Annulées</SelectItem>
                            <SelectItem value="COMPLETED">Terminées</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Liste des réservations */}
                  <div className="space-y-4">
                    {reservations.map((reservation) => (
                      <Card key={reservation.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                          <div className="flex flex-col lg:flex-row gap-4">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold mb-2">{reservation.offre}</h3>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-muted-foreground">Client</p>
                                  <p className="font-medium">{reservation.client}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Prestataire</p>
                                  <p className="font-medium">{reservation.prestataire}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Date</p>
                                  <p className="font-medium">{new Date(reservation.dateDebut).toLocaleDateString('fr-FR')}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Montant</p>
                                  <p className="font-medium">{reservation.montant.toLocaleString()} FCFA</p>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2 lg:items-end">
                              <Badge 
                                variant={
                                  reservation.statut === 'CONFIRMED' ? 'default' :
                                  reservation.statut === 'PENDING' ? 'secondary' :
                                  reservation.statut === 'CANCELLED' ? 'destructive' : 'outline'
                                }
                              >
                                {reservation.statut}
                              </Badge>
                              <Button variant="outline" size="sm" className="w-full lg:w-auto">
                                <Eye className="h-4 w-4 mr-2" />
                                Voir détails
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Module 4: Gestion des utilisateurs */}
              {activeSection === 'utilisateurs' && (
                <motion.div 
                  key="utilisateurs"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                      Gestion des Utilisateurs
                    </h2>
                    <p className="text-muted-foreground">
                      Gérez les comptes clients et prestataires
                    </p>
                  </div>

                  {/* Filtres */}
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                              placeholder="Rechercher un utilisateur..." 
                              className="pl-9"
                              value={searchUtilisateur}
                              onChange={(e) => setSearchUtilisateur(e.target.value)}
                            />
                          </div>
                        </div>
                        <Select value={filtreRole} onValueChange={setFiltreRole}>
                          <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Rôle" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Tous</SelectItem>
                            <SelectItem value="USER">Clients</SelectItem>
                            <SelectItem value="PRESTATAIRE">Prestataires</SelectItem>
                            <SelectItem value="ADMIN">Admins</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={filtreStatut} onValueChange={setFiltreStatut}>
                          <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Statut" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Tous</SelectItem>
                            <SelectItem value="active">Actifs</SelectItem>
                            <SelectItem value="suspended">Suspendus</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Liste des utilisateurs */}
                  {loadingUtilisateurs ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Chargement des utilisateurs...</p>
                    </div>
                  ) : utilisateurs.length === 0 ? (
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <p className="text-muted-foreground">Aucun utilisateur trouvé</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {utilisateurs.map((utilisateur) => (
                        <Card key={utilisateur.id} className="hover:shadow-lg transition-shadow">
                          <CardContent className="pt-6">
                            <div className="flex flex-col lg:flex-row gap-4">
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold mb-2">
                                  {utilisateur.prenom || ''} {utilisateur.nom}
                                </h3>
                                <div className="flex flex-wrap gap-4 text-sm">
                                  <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span>{utilisateur.email}</span>
                                  </div>
                                  {utilisateur.telephone && (
                                    <div className="flex items-center gap-2">
                                      <Phone className="h-4 w-4 text-muted-foreground" />
                                      <span>{utilisateur.telephone}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-muted-foreground" />
                                    <Badge variant="outline">{utilisateur.role}</Badge>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>Inscrit le {new Date(utilisateur.createdAt).toLocaleDateString('fr-FR')}</span>
                                  </div>
                                  {!utilisateur.isActive && (
                                    <Badge variant="destructive">Suspendu</Badge>
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-col gap-2 lg:items-end">
                                {utilisateur.isActive ? (
                                  <Button 
                                    variant="destructive" 
                                    size="sm" 
                                    className="w-full lg:w-auto"
                                    onClick={() => handleSuspendUtilisateur(utilisateur.id, 'suspend')}
                                  >
                                    <Ban className="h-4 w-4 mr-2" />
                                    Suspendre
                                  </Button>
                                ) : (
                                  <Button 
                                    size="sm" 
                                    className="w-full lg:w-auto"
                                    onClick={() => handleSuspendUtilisateur(utilisateur.id, 'unsuspend')}
                                  >
                                    <UserCheck className="h-4 w-4 mr-2" />
                                    Réactiver
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Module 5: Gestion des Membres Admin */}
              {activeSection === 'membres' && (
                <motion.div 
                  key="membres"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                      Gestion des Membres
                    </h2>
                    <p className="text-muted-foreground">
                      Gérez les membres de l&apos;équipe administrative avec différents rôles
                    </p>
                  </div>

                  {/* Formulaire d'ajout de membre */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <UserCheck className="h-5 w-5" />
                        Ajouter un nouveau membre
                      </CardTitle>
                      <CardDescription>
                        Invitez un nouveau membre à rejoindre l&apos;équipe administrative
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Email *</label>
                          <Input 
                            type="email" 
                            placeholder="email@example.com"
                            value={memberForm.email}
                            onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Nom *</label>
                          <Input 
                            type="text" 
                            placeholder="Nom"
                            value={memberForm.nom}
                            onChange={(e) => setMemberForm({ ...memberForm, nom: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Prénom</label>
                          <Input 
                            type="text" 
                            placeholder="Prénom"
                            value={memberForm.prenom}
                            onChange={(e) => setMemberForm({ ...memberForm, prenom: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Téléphone</label>
                          <Input 
                            type="tel" 
                            placeholder="+221 77 123 45 67"
                            value={memberForm.telephone}
                            onChange={(e) => setMemberForm({ ...memberForm, telephone: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-sm font-medium">Rôle *</label>
                          <Select value={memberForm.role} onValueChange={(value) => setMemberForm({ ...memberForm, role: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un rôle" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="SUPER_ADMIN">
                                <div className="flex items-center gap-2">
                                  <Shield className="h-4 w-4 text-red-500" />
                                  <span>Super Administrateur</span>
                                  <Badge variant="outline" className="ml-2">Accès complet</Badge>
                                </div>
                              </SelectItem>
                              <SelectItem value="ADMIN">
                                <div className="flex items-center gap-2">
                                  <Shield className="h-4 w-4 text-orange-500" />
                                  <span>Administrateur</span>
                                  <Badge variant="outline" className="ml-2">Gestion complète</Badge>
                                </div>
                              </SelectItem>
                              <SelectItem value="MODERATEUR">
                                <div className="flex items-center gap-2">
                                  <UserCheck className="h-4 w-4 text-blue-500" />
                                  <span>Modérateur</span>
                                  <Badge variant="outline" className="ml-2">Validation contenu</Badge>
                                </div>
                              </SelectItem>
                              <SelectItem value="SUPPORT">
                                <div className="flex items-center gap-2">
                                  <MessageSquare className="h-4 w-4 text-green-500" />
                                  <span>Support</span>
                                  <Badge variant="outline" className="ml-2">Support client</Badge>
                                </div>
                              </SelectItem>
                              <SelectItem value="CONTENT_MANAGER">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-purple-500" />
                                  <span>Gestionnaire de contenu</span>
                                  <Badge variant="outline" className="ml-2">Édition contenu</Badge>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="md:col-span-2">
                          <Button 
                            className="w-full bg-teranga-orange hover:bg-[#FFD700] text-white"
                            onClick={async () => {
                              const { email, nom, prenom, telephone, role } = memberForm

                              if (!email || !nom || !role) {
                                alert('Veuillez remplir tous les champs obligatoires')
                                return
                              }

                              try {
                                const response = await fetch('/api/admin/membres', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ email, nom, prenom, telephone, role })
                                })

                                const data = await response.json()
                                if (response.ok && data.success) {
                                  alert(data.message || 'Membre ajouté avec succès!')
                                  // Réinitialiser le formulaire
                                  setMemberForm({ email: '', nom: '', prenom: '', telephone: '', role: '' })
                                  // Recharger la liste
                                  window.location.reload()
                                } else {
                                  alert(data.error || 'Erreur lors de l\'ajout du membre')
                                }
                              } catch (error) {
                                console.error('Erreur:', error)
                                alert('Erreur lors de l\'ajout du membre')
                              }
                            }}
                          >
                            <UserCheck className="mr-2 h-4 w-4" />
                            Ajouter le membre
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Liste des membres */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Membres de l&apos;équipe
                          </CardTitle>
                          <CardDescription>
                            Liste de tous les membres administratifs
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input 
                            placeholder="Rechercher un membre..."
                            className="w-64"
                            id="search-member"
                          />
                          <Select defaultValue="all">
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Tous les rôles</SelectItem>
                              <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                              <SelectItem value="ADMIN">Admin</SelectItem>
                              <SelectItem value="MODERATEUR">Modérateur</SelectItem>
                              <SelectItem value="SUPPORT">Support</SelectItem>
                              <SelectItem value="CONTENT_MANAGER">Content Manager</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Données fictives - à remplacer par un appel API */}
                        {[
                          {
                            id: '1',
                            email: 'admin@gooteranga.com',
                            nom: 'Administrateur',
                            prenom: 'Principal',
                            telephone: '+221 77 000 00 00',
                            role: 'SUPER_ADMIN',
                            createdAt: '2024-01-01',
                          },
                          {
                            id: '2',
                            email: 'moderateur@gooteranga.com',
                            nom: 'Modérateur',
                            prenom: 'Test',
                            telephone: '+221 77 111 11 11',
                            role: 'MODERATEUR',
                            createdAt: '2024-02-15',
                          },
                        ].map((membre) => (
                          <Card key={membre.id} className="border-orange-200">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center text-white font-bold">
                                    {membre.nom[0]}{membre.prenom?.[0] || ''}
                                  </div>
                                  <div>
                                    <p className="font-semibold">
                                      {membre.prenom} {membre.nom}
                                    </p>
                                    <p className="text-sm text-muted-foreground">{membre.email}</p>
                                    <p className="text-xs text-muted-foreground">{membre.telephone}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="text-right">
                                    <Badge 
                                      variant={
                                        membre.role === 'SUPER_ADMIN' ? 'destructive' :
                                        membre.role === 'ADMIN' ? 'default' :
                                        membre.role === 'MODERATEUR' ? 'secondary' :
                                        'outline'
                                      }
                                    >
                                      {membre.role === 'SUPER_ADMIN' ? 'Super Admin' :
                                       membre.role === 'ADMIN' ? 'Admin' :
                                       membre.role === 'MODERATEUR' ? 'Modérateur' :
                                       membre.role === 'SUPPORT' ? 'Support' :
                                       'Content Manager'}
                                    </Badge>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      Membre depuis {new Date(membre.createdAt).toLocaleDateString('fr-FR')}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={async () => {
                                        if (confirm('Êtes-vous sûr de vouloir retirer ce membre ?')) {
                                          try {
                                            const response = await fetch(`/api/admin/membres?id=${membre.id}`, {
                                              method: 'DELETE'
                                            })
                                            const data = await response.json()
                                            if (response.ok && data.success) {
                                              alert(data.message || 'Membre retiré avec succès')
                                              window.location.reload()
                                            } else {
                                              alert(data.error || 'Erreur lors de la suppression')
                                            }
                                          } catch (error) {
                                            console.error('Erreur:', error)
                                            alert('Erreur lors de la suppression')
                                          }
                                        }
                                      }}
                                    >
                                      <Ban className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Module 5: Contenu institutionnel */}
              {activeSection === 'contenu' && (
                <motion.div 
                  key="contenu"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                      Contenu Institutionnel
                    </h2>
                    <p className="text-muted-foreground">
                      Gérez les pages officielles et le contenu de la plateforme
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          Conditions Générales
                        </CardTitle>
                        <CardDescription>CGU de la plateforme</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button variant="outline" className="w-full">
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="h-5 w-5" />
                          Politique de Confidentialité
                        </CardTitle>
                        <CardDescription>Protection des données</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button variant="outline" className="w-full">
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          À propos
                        </CardTitle>
                        <CardDescription>Page À propos de GooTeranga</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button variant="outline" className="w-full">
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MessageSquare className="h-5 w-5" />
                          FAQ
                        </CardTitle>
                        <CardDescription>Questions fréquentes</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button variant="outline" className="w-full">
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          Blog
                        </CardTitle>
                        <CardDescription>Articles et actualités</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button variant="outline" className="w-full">
                          <Edit className="h-4 w-4 mr-2" />
                          Gérer les articles
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MessageSquare className="h-5 w-5" />
                          Contact
                        </CardTitle>
                        <CardDescription>Page de contact</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button variant="outline" className="w-full">
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              )}

              {/* Module 6: Support client */}
              {activeSection === 'support' && (
                <motion.div 
                  key="support"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                      Support Client
                    </h2>
                    <p className="text-muted-foreground">
                      Gérez les demandes de support et les litiges
                    </p>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Messages de support</CardTitle>
                      <CardDescription>5 messages non lus</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold">Problème de réservation</h4>
                              <p className="text-sm text-muted-foreground">Jean Dupont • Il y a 2 heures</p>
                            </div>
                            <Badge variant="secondary">Non lu</Badge>
                          </div>
                          <p className="text-sm mt-2">
                            Bonjour, j&apos;ai un problème avec ma réservation #1234...
                          </p>
                          <Button variant="outline" size="sm" className="mt-3">
                            Voir et répondre
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Module 7: Paramètres globaux */}
              {activeSection === 'parametres' && (
                <motion.div 
                  key="parametres"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                      Paramètres Globaux
                    </h2>
                    <p className="text-muted-foreground">
                      Configurez les paramètres de la plateforme
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Globe className="h-5 w-5" />
                          Langues
                        </CardTitle>
                        <CardDescription>Langues disponibles sur la plateforme</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span>Français</span>
                          <Badge variant="default">Actif</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Anglais</span>
                          <Badge variant="default">Actif</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Arabe</span>
                          <Badge variant="default">Actif</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Espagnol</span>
                          <Badge variant="default">Actif</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Portugais</span>
                          <Badge variant="default">Actif</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Allemand</span>
                          <Badge variant="default">Actif</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Italien</span>
                          <Badge variant="default">Actif</Badge>
                        </div>
                        <Button variant="outline" className="w-full mt-4">
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier les langues
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <DollarSign className="h-5 w-5" />
                          Revenus GooTeranga
                        </CardTitle>
                        <CardDescription>Modèle économique basé sur abonnements et boosts</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="text-2xl font-bold mb-1">
                              {stats.revenusTotalMois?.toLocaleString() || '0'} FCFA
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Revenus totaux ce mois
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                            <div>
                              <div className="text-lg font-semibold">
                                {stats.revenusAbonnements?.toLocaleString() || '0'} FCFA
                              </div>
                              <p className="text-xs text-muted-foreground">Abonnements</p>
                            </div>
                            <div>
                              <div className="text-lg font-semibold">
                                {stats.revenusBoosts?.toLocaleString() || '0'} FCFA
                              </div>
                              <p className="text-xs text-muted-foreground">Boosts</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CreditCard className="h-5 w-5" />
                          Moyens de paiement
                        </CardTitle>
                        <CardDescription>Méthodes de paiement acceptées</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span>Orange Money</span>
                          <Badge variant="default">Actif</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Wave</span>
                          <Badge variant="default">Actif</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>VISA/Mastercard</span>
                          <Badge variant="default">Actif</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Free Money</span>
                          <Badge variant="default">Actif</Badge>
                        </div>
                        <Button variant="outline" className="w-full mt-4">
                          <Edit className="h-4 w-4 mr-2" />
                          Gérer les paiements
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Settings className="h-5 w-5" />
                          Design
                        </CardTitle>
                        <CardDescription>Apparence de la plateforme</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button variant="outline" className="w-full">
                          <Edit className="h-4 w-4 mr-2" />
                          Personnaliser le design
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              )}

              {/* Module 8: Analytics */}
              {activeSection === 'analytics' && (
                <motion.div 
                  key="analytics"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                        Analytics & Statistiques
                      </h2>
                      <p className="text-muted-foreground">
                        Analysez les performances de la plateforme
                      </p>
                    </div>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Exporter les données
                    </Button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                      <CardHeader>
                        <CardTitle>Prestataires actifs</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{stats.prestatairesTotal}</div>
                        <p className="text-sm text-muted-foreground mt-2">
                          <TrendingUp className="h-4 w-4 inline mr-1 text-green-500" />
                          +12% ce mois
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Réservations par mois</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{stats.reservationsMois}</div>
                        <p className="text-sm text-muted-foreground mt-2">
                          <TrendingUp className="h-4 w-4 inline mr-1 text-green-500" />
                          +8% ce mois
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Revenus générés</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">
                          {stats.revenusMois.toLocaleString()} FCFA
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          <TrendingUp className="h-4 w-4 inline mr-1 text-green-500" />
                          +15% ce mois
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Origine des touristes</CardTitle>
                        <CardDescription>Pays d&apos;origine des visiteurs</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <DoughnutChart
                          data={{
                            labels: touristOrigins,
                            datasets: [
                              {
                                label: 'Pourcentage',
                                data: originPercentages,
                                backgroundColor: [
                                  'rgba(249, 115, 22, 0.8)',
                                  'rgba(234, 179, 8, 0.8)',
                                  'rgba(251, 146, 60, 0.8)',
                                  'rgba(250, 204, 21, 0.8)',
                                  'rgba(217, 119, 6, 0.8)',
                                ],
                                borderColor: [
                                  'rgba(249, 115, 22, 1)',
                                  'rgba(234, 179, 8, 1)',
                                  'rgba(251, 146, 60, 1)',
                                  'rgba(250, 204, 21, 1)',
                                  'rgba(217, 119, 6, 1)',
                                ],
                              },
                            ],
                          }}
                          height={300}
                        />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Revenus mensuels</CardTitle>
                        <CardDescription>Évolution des revenus sur 6 mois</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <BarChart
                          data={{
                            labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
                            datasets: [
                              {
                                label: 'Revenus (FCFA)',
                                data: [2800000, 3100000, 3200000, 2900000, 3000000, 3200000],
                                backgroundColor: 'rgba(234, 179, 8, 0.8)',
                                borderColor: 'rgba(234, 179, 8, 1)',
                              },
                            ],
                          }}
                          height={300}
                        />
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  )
}

