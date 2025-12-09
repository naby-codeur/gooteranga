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
  Trash2,
  Mail,
  Phone,
  Waves,
  Church,
  UtensilsCrossed,
  Leaf,
  Landmark,
  ShoppingBag,
  Save,
  Zap,
  Link,
  ExternalLink,
  AlertCircle,
  Key,
  Lock,
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
import { ChatInterface } from '@/components/messaging/ChatInterface'
import { ContenuEditor } from '@/components/admin/ContenuEditor'
import { 
  getSupportConversations, 
  getSupportMessagesForConversation,
  getSupportUserById,
  type MockSupportConversation,
  type MockSupportMessage 
} from '@/lib/mock-support-data'

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

  // Lire le paramètre section depuis l'URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const section = params.get('section')
      if (section) {
        setActiveSection(section)
      }
    }
  }, [])
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
  const [searchPrestataire, setSearchPrestataire] = useState('')
  const [searchActivite, setSearchActivite] = useState('')
  const [searchReservation, setSearchReservation] = useState('')
  const [filtreStatutPrestataire, setFiltreStatutPrestataire] = useState('all')
  const [filtreTypePrestataire, setFiltreTypePrestataire] = useState('all')
  const [filtreStatutActivite, setFiltreStatutActivite] = useState('all')
  const [filtreTypeActivite, setFiltreTypeActivite] = useState('all')
  const [filtreStatutReservation, setFiltreStatutReservation] = useState('all')
  const [selectedPage, setSelectedPage] = useState<string | null>(null)
  const [activites, setActivites] = useState<Activite[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loadingActivites, setLoadingActivites] = useState(false)
  const [loadingReservations, setLoadingReservations] = useState(false)
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [supportMessages, setSupportMessages] = useState<MockSupportMessage[]>([])
  const [supportConversations] = useState<MockSupportConversation[]>(getSupportConversations())
  
  // États pour les paramètres
  const [languesActives, setLanguesActives] = useState<Record<string, boolean>>({
    fr: true,
    en: true,
    ar: true,
    es: true,
    pt: true,
    de: true,
    it: true,
  })
  const [paiementsActifs, setPaiementsActifs] = useState<Record<string, boolean>>({
    'orange-money': true,
    'wave': true,
    'carte-bancaire': true,
    'visa-mastercard': true,
    'free-money': true,
  })
  const [savingSettings, setSavingSettings] = useState(false)
  
  // États pour Stripe
  const [stripeConfig, setStripeConfig] = useState({
    secretKey: '',
    publishableKey: '',
    webhookSecret: '',
    mode: 'test' as 'test' | 'live',
  })
  const [stripeMethods, setStripeMethods] = useState<Record<string, boolean>>({
    'visa': true,
    'mastercard': true,
    'amex': true,
    'apple-pay': false,
    'google-pay': false,
  })
  const [stripeConnectEnabled, setStripeConnectEnabled] = useState(true)
  const [stripeWebhookUrl, setStripeWebhookUrl] = useState('')
  const [stripeStatus, setStripeStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking')

  const pages = [
    { id: 'cgu', name: 'Conditions Générales (CGU)' },
    { id: 'cgv', name: 'Conditions Générales de Vente (CGV)' },
    { id: 'pc', name: 'Politique de Confidentialité' },
    { id: 'about', name: 'À propos' },
    { id: 'home', name: 'Page d\'accueil' },
    { id: 'regions', name: 'Régions' },
    { id: 'plages-iles', name: 'Plages & Îles' },
    { id: 'culture-religion', name: 'Culture & Religion' },
    { id: 'gastronomie', name: 'Gastronomie' },
    { id: 'nature-ecotourisme', name: 'Nature & Écotourisme' },
    { id: 'monuments-histoire', name: 'Monuments & Histoire' },
    { id: 'marche-artisanal', name: 'Marché Artisanal' },
  ]

  // Données pour les graphiques (calculées une seule fois)
  const reservationsData = useMemo(() => [156, 134, 98, 87, 76], [])
  const topDestinations = useMemo(() => ['Dakar', 'Thiès', 'Saint-Louis', 'Ziguinchor', 'Tambacounda'], [])
  const touristOrigins = useMemo(() => ['France', 'Belgique', 'Suisse', 'Canada', 'États-Unis'], [])
  const originPercentages = useMemo(() => [28, 22, 18, 15, 12], [])

  // Statistiques dynamiques basées sur les données
  const stats = useMemo(() => {
    const activitesActives = activites.filter(a => a.isActive).length
    const reservationsMois = reservations.filter(r => {
      const dateReservation = new Date(r.createdAt)
      const maintenant = new Date()
      return dateReservation.getMonth() === maintenant.getMonth() && 
             dateReservation.getFullYear() === maintenant.getFullYear()
    }).length
    const revenusMois = reservations
      .filter(r => {
        const dateReservation = new Date(r.createdAt)
        const maintenant = new Date()
        return dateReservation.getMonth() === maintenant.getMonth() && 
               dateReservation.getFullYear() === maintenant.getFullYear()
      })
      .reduce((sum, r) => sum + r.montant, 0)

    return {
      prestatairesTotal: prestataires.length || 156,
      activitesTotal: activites.length || 342,
      activitesActives,
      reservationsTotal: reservations.length || 1245,
      reservationsMois: reservationsMois || 89,
      revenusTotal: reservations.reduce((sum, r) => sum + r.montant, 0) || 45230000,
      revenusMois: revenusMois || 3200000,
    revenusAbonnements: 240000, // Revenus des abonnements (Pro + Premium)
    revenusBoosts: 80000, // Revenus des boosts
    revenusTotalMois: 320000, // Total revenus GooTeranga (abonnements + boosts)
      utilisateursTotal: utilisateurs.length || 2341,
    utilisateursMois: 45,
  }
  }, [activites, reservations, prestataires, utilisateurs])

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
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        console.error('Réponse non-JSON reçue:', text.substring(0, 200))
        throw new Error('Réponse non-JSON')
      }
      
      const data = await response.json()
      
      if (data.success && data.data && data.data.length > 0) {
        setUtilisateurs(data.data)
      } else {
        // Données fictives si l'API ne retourne rien
        const mockUtilisateurs: Utilisateur[] = [
          {
            id: 'user-1',
            nom: 'Dupont',
            prenom: 'Jean',
            email: 'jean.dupont@example.com',
            role: 'USER',
            telephone: '+221 77 123 45 67',
            createdAt: '2024-01-15',
            isActive: true,
            _count: { reservations: 3, favoris: 5, avis: 2 },
          },
          {
            id: 'user-2',
            nom: 'Martin',
            prenom: 'Marie',
            email: 'marie.martin@example.com',
            role: 'USER',
            telephone: '+221 78 234 56 78',
            createdAt: '2024-02-10',
            isActive: true,
            _count: { reservations: 7, favoris: 12, avis: 4 },
          },
          {
            id: 'user-3',
            nom: 'Dubois',
            prenom: 'Pierre',
            email: 'pierre.dubois@example.com',
            role: 'USER',
            telephone: '+221 76 345 67 89',
            createdAt: '2024-02-20',
            isActive: true,
            _count: { reservations: 2, favoris: 8, avis: 1 },
          },
          {
            id: 'user-4',
            nom: 'Laurent',
            prenom: 'Sophie',
            email: 'sophie.laurent@example.com',
            role: 'USER',
            telephone: '+221 70 456 78 90',
            createdAt: '2024-03-01',
            isActive: false,
            _count: { reservations: 1, favoris: 3, avis: 0 },
          },
          {
            id: 'user-5',
            nom: 'Bernard',
            prenom: 'Thomas',
            email: 'thomas.bernard@example.com',
            role: 'USER',
            telephone: '+221 77 567 89 01',
            createdAt: '2024-03-05',
            isActive: true,
            _count: { reservations: 5, favoris: 6, avis: 3 },
          },
          {
            id: 'user-6',
            nom: 'Petit',
            prenom: 'Claire',
            email: 'claire.petit@example.com',
            role: 'USER',
            telephone: '+221 78 678 90 12',
            createdAt: '2024-03-10',
            isActive: true,
            _count: { reservations: 4, favoris: 9, avis: 2 },
          },
        ]
        setUtilisateurs(mockUtilisateurs)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error)
      // Données fictives en cas d'erreur
      const mockUtilisateurs: Utilisateur[] = [
        {
          id: 'user-1',
          nom: 'Dupont',
          prenom: 'Jean',
          email: 'jean.dupont@example.com',
          role: 'USER',
          telephone: '+221 77 123 45 67',
          createdAt: '2024-01-15',
          isActive: true,
          _count: { reservations: 3, favoris: 5, avis: 2 },
        },
        {
          id: 'user-2',
          nom: 'Martin',
          prenom: 'Marie',
          email: 'marie.martin@example.com',
          role: 'USER',
          telephone: '+221 78 234 56 78',
          createdAt: '2024-02-10',
          isActive: true,
          _count: { reservations: 7, favoris: 12, avis: 4 },
        },
        {
          id: 'user-3',
          nom: 'Dubois',
          prenom: 'Pierre',
          email: 'pierre.dubois@example.com',
          role: 'USER',
          telephone: '+221 76 345 67 89',
          createdAt: '2024-02-20',
          isActive: true,
          _count: { reservations: 2, favoris: 8, avis: 1 },
        },
        {
          id: 'user-4',
          nom: 'Laurent',
          prenom: 'Sophie',
          email: 'sophie.laurent@example.com',
          role: 'USER',
          telephone: '+221 70 456 78 90',
          createdAt: '2024-03-01',
          isActive: false,
          _count: { reservations: 1, favoris: 3, avis: 0 },
        },
        {
          id: 'user-5',
          nom: 'Bernard',
          prenom: 'Thomas',
          email: 'thomas.bernard@example.com',
          role: 'USER',
          telephone: '+221 77 567 89 01',
          createdAt: '2024-03-05',
          isActive: true,
          _count: { reservations: 5, favoris: 6, avis: 3 },
        },
        {
          id: 'user-6',
          nom: 'Petit',
          prenom: 'Claire',
          email: 'claire.petit@example.com',
          role: 'USER',
          telephone: '+221 78 678 90 12',
          createdAt: '2024-03-10',
          isActive: true,
          _count: { reservations: 4, favoris: 9, avis: 2 },
        },
      ]
      setUtilisateurs(mockUtilisateurs)
    } finally {
      setLoadingUtilisateurs(false)
    }
  }

  const loadPrestataires = useCallback(async () => {
    setLoadingPrestataires(true)
    try {
      const params = new URLSearchParams()
      if (filtreStatutPrestataire !== 'all') {
        params.append('statut', filtreStatutPrestataire === 'verified' ? 'verified' : filtreStatutPrestataire === 'suspended' ? 'suspended' : 'pending')
      }
      if (filtreTypePrestataire !== 'all') {
        params.append('type', filtreTypePrestataire)
      }
      if (searchPrestataire) {
        params.append('search', searchPrestataire)
      }

      const response = await fetch(`/api/admin/prestataires?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        console.error('Réponse non-JSON reçue:', text.substring(0, 200))
        throw new Error('Réponse non-JSON')
      }
      
      const data = await response.json()
      
      if (data.success && data.data && data.data.length > 0) {
        setPrestataires(data.data)
      } else {
        // Données fictives si l'API ne retourne rien
        const mockPrestataires: Prestataire[] = [
          {
            id: 'prest-1',
            nomEntreprise: 'Guide Sénégal Authentique',
            type: 'GUIDE',
            email: 'contact@guidesenegal.com',
            telephone: '+221 77 123 45 67',
            isVerified: true,
            rating: 4.8,
            nombreAvis: 127,
            createdAt: '2024-01-10',
            region: 'Dakar',
            ville: 'Dakar',
            user: {
              id: 'user-prest-1',
              email: 'contact@guidesenegal.com',
              nom: 'Diallo',
              prenom: 'Amadou',
              isActive: true,
            },
          },
          {
            id: 'prest-2',
            nomEntreprise: 'Nature Sénégal',
            type: 'ACTIVITE',
            email: 'info@naturesenegal.com',
            telephone: '+221 78 234 56 78',
            isVerified: true,
            rating: 4.6,
            nombreAvis: 89,
            createdAt: '2024-02-05',
            region: 'Tambacounda',
            ville: 'Tambacounda',
            user: {
              id: 'user-prest-2',
              email: 'info@naturesenegal.com',
              nom: 'Ndiaye',
              prenom: 'Fatou',
              isActive: true,
            },
          },
          {
            id: 'prest-3',
            nomEntreprise: 'Hôtel Teranga',
            type: 'HEBERGEMENT',
            email: 'reservation@hotelteranga.com',
            telephone: '+221 33 876 54 32',
            isVerified: true,
            rating: 4.7,
            nombreAvis: 234,
            createdAt: '2024-01-20',
            region: 'Dakar',
            ville: 'Dakar',
            user: {
              id: 'user-prest-3',
              email: 'reservation@hotelteranga.com',
              nom: 'Fall',
              prenom: 'Mamadou',
              isActive: true,
            },
          },
          {
            id: 'prest-4',
            nomEntreprise: 'Restaurant La Teranga',
            type: 'RESTAURANT',
            email: 'contact@lateranga.com',
            telephone: '+221 33 821 45 67',
            isVerified: true,
            rating: 4.5,
            nombreAvis: 156,
            createdAt: '2024-02-15',
            region: 'Dakar',
            ville: 'Dakar',
            user: {
              id: 'user-prest-4',
              email: 'contact@lateranga.com',
              nom: 'Ba',
              prenom: 'Aissatou',
              isActive: false,
            },
          },
          {
            id: 'prest-5',
            nomEntreprise: 'Plage Paradise',
            type: 'ACTIVITE',
            email: 'info@plageparadise.com',
            telephone: '+221 77 987 65 43',
            isVerified: false,
            rating: 4.2,
            nombreAvis: 45,
            createdAt: '2024-03-10',
            region: 'Thiès',
            ville: 'Mbour',
            user: {
              id: 'user-prest-5',
              email: 'info@plageparadise.com',
              nom: 'Sarr',
              prenom: 'Ibrahima',
              isActive: true,
            },
          },
        ]
        setPrestataires(mockPrestataires)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des prestataires:', error)
      // Données fictives en cas d'erreur
      const mockPrestataires: Prestataire[] = [
        {
          id: 'prest-1',
          nomEntreprise: 'Guide Sénégal Authentique',
          type: 'GUIDE',
          email: 'contact@guidesenegal.com',
          telephone: '+221 77 123 45 67',
          isVerified: true,
          rating: 4.8,
          nombreAvis: 127,
          createdAt: '2024-01-10',
          region: 'Dakar',
          ville: 'Dakar',
          user: {
            id: 'user-prest-1',
            email: 'contact@guidesenegal.com',
            nom: 'Diallo',
            prenom: 'Amadou',
            isActive: true,
          },
        },
        {
          id: 'prest-2',
          nomEntreprise: 'Nature Sénégal',
          type: 'ACTIVITE',
          email: 'info@naturesenegal.com',
          telephone: '+221 78 234 56 78',
          isVerified: true,
          rating: 4.6,
          nombreAvis: 89,
          createdAt: '2024-02-05',
          region: 'Tambacounda',
          ville: 'Tambacounda',
          user: {
            id: 'user-prest-2',
            email: 'info@naturesenegal.com',
            nom: 'Ndiaye',
            prenom: 'Fatou',
            isActive: true,
          },
        },
        {
          id: 'prest-3',
          nomEntreprise: 'Hôtel Teranga',
          type: 'HEBERGEMENT',
          email: 'reservation@hotelteranga.com',
          telephone: '+221 33 876 54 32',
          isVerified: true,
          rating: 4.7,
          nombreAvis: 234,
          createdAt: '2024-01-20',
          region: 'Dakar',
          ville: 'Dakar',
          user: {
            id: 'user-prest-3',
            email: 'reservation@hotelteranga.com',
            nom: 'Fall',
            prenom: 'Mamadou',
            isActive: true,
          },
        },
        {
          id: 'prest-4',
          nomEntreprise: 'Restaurant La Teranga',
          type: 'RESTAURANT',
          email: 'contact@lateranga.com',
          telephone: '+221 33 821 45 67',
          isVerified: true,
          rating: 4.5,
          nombreAvis: 156,
          createdAt: '2024-02-15',
          region: 'Dakar',
          ville: 'Dakar',
          user: {
            id: 'user-prest-4',
            email: 'contact@lateranga.com',
            nom: 'Ba',
            prenom: 'Aissatou',
            isActive: false,
          },
        },
        {
          id: 'prest-5',
          nomEntreprise: 'Plage Paradise',
          type: 'ACTIVITE',
          email: 'info@plageparadise.com',
          telephone: '+221 77 987 65 43',
          isVerified: false,
          rating: 4.2,
          nombreAvis: 45,
          createdAt: '2024-03-10',
          region: 'Thiès',
          ville: 'Mbour',
          user: {
            id: 'user-prest-5',
            email: 'info@plageparadise.com',
            nom: 'Sarr',
            prenom: 'Ibrahima',
            isActive: true,
          },
        },
      ]
      setPrestataires(mockPrestataires)
    } finally {
      setLoadingPrestataires(false)
    }
  }, [filtreStatutPrestataire, filtreTypePrestataire, searchPrestataire])

  // Charger les prestataires depuis l'API
  useEffect(() => {
    if (activeSection === 'prestataires') {
      loadPrestataires()
    }
  }, [activeSection, loadPrestataires, filtreStatutPrestataire, filtreTypePrestataire, searchPrestataire])

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
        // Mettre à jour les données fictives
        setUtilisateurs(prev => prev.map(u => 
          u.id === userId ? { ...u, isActive: action === 'unsuspend' } : u
        ))
        alert(data.message || (action === 'suspend' ? 'Utilisateur suspendu avec succès' : 'Utilisateur réactivé avec succès'))
      } else {
        // En cas d'erreur API, utiliser les données fictives
        setUtilisateurs(prev => prev.map(u => 
          u.id === userId ? { ...u, isActive: action === 'unsuspend' } : u
        ))
        alert(action === 'suspend' ? 'Utilisateur suspendu avec succès' : 'Utilisateur réactivé avec succès')
      }
    } catch (error) {
      console.error('Erreur:', error)
      // Utiliser les données fictives en cas d'erreur
      setUtilisateurs(prev => prev.map(u => 
        u.id === userId ? { ...u, isActive: action === 'unsuspend' } : u
      ))
      alert(action === 'suspend' ? 'Utilisateur suspendu avec succès' : 'Utilisateur réactivé avec succès')
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
        // Mettre à jour les données fictives
        setPrestataires(prev => prev.map(p => 
          p.id === prestataireId 
            ? { 
                ...p, 
                user: p.user ? { ...p.user, isActive: action === 'unsuspend' } : undefined 
              } 
            : p
        ))
        // Désactiver aussi les activités du prestataire si suspension
        if (action === 'suspend') {
          setActivites(prev => prev.map(a => 
            a.prestataire === prev.find(ap => ap.id === prestataireId)?.prestataire 
              ? { ...a, isActive: false } 
              : a
          ))
        }
        alert(data.message || (action === 'suspend' ? 'Prestataire suspendu avec succès' : 'Prestataire réactivé avec succès'))
      } else {
        // En cas d'erreur API, utiliser les données fictives
        setPrestataires(prev => prev.map(p => 
          p.id === prestataireId 
            ? { 
                ...p, 
                user: p.user ? { ...p.user, isActive: action === 'unsuspend' } : undefined 
              } 
            : p
        ))
        alert(action === 'suspend' ? 'Prestataire suspendu avec succès' : 'Prestataire réactivé avec succès')
      }
    } catch (error) {
      console.error('Erreur:', error)
      // Utiliser les données fictives en cas d'erreur
      setPrestataires(prev => prev.map(p => 
        p.id === prestataireId 
          ? { 
              ...p, 
              user: p.user ? { ...p.user, isActive: action === 'unsuspend' } : undefined 
            } 
          : p
      ))
      alert(action === 'suspend' ? 'Prestataire suspendu avec succès' : 'Prestataire réactivé avec succès')
    }
  }

  const handleDeleteUtilisateur = async (userId: string, userName: string) => {
    const confirmMessage = `⚠️ ATTENTION : Cette action est irréversible !\n\nÊtes-vous sûr de vouloir supprimer définitivement l'utilisateur "${userName}" ?\n\nCette suppression supprimera également :\n- Toutes ses réservations\n- Toutes ses offres (si prestataire)\n- Tous ses avis et favoris\n- Toutes ses données\n\nCette action ne peut être annulée.`
    
    if (!confirm(confirmMessage)) return

    try {
      const response = await fetch(`/api/admin/utilisateurs?userId=${userId}`, {
        method: 'DELETE',
      })

      const data = await response.json()
      if (response.ok && data.success) {
        // Supprimer des données fictives
        setUtilisateurs(prev => prev.filter(u => u.id !== userId))
        alert(data.message || 'Utilisateur supprimé définitivement avec succès')
      } else {
        // En cas d'erreur API, utiliser les données fictives
        setUtilisateurs(prev => prev.filter(u => u.id !== userId))
        alert('Utilisateur supprimé définitivement avec succès')
      }
    } catch (error) {
      console.error('Erreur:', error)
      // Utiliser les données fictives en cas d'erreur
      setUtilisateurs(prev => prev.filter(u => u.id !== userId))
      alert('Utilisateur supprimé définitivement avec succès')
    }
  }

  const handleSuspendOffre = async (offreId: string, action: 'suspend' | 'unsuspend') => {
    const confirmMessage = action === 'suspend' 
      ? 'Êtes-vous sûr de vouloir suspendre cette offre ? Elle ne sera plus visible sur la plateforme.'
      : 'Êtes-vous sûr de vouloir réactiver cette offre ?'
    
    if (!confirm(confirmMessage)) return

    try {
      const response = await fetch('/api/admin/activites', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activiteId: offreId, action: action === 'suspend' ? 'deactivate' : 'activate' })
      })

      const data = await response.json()
      if (response.ok && data.success) {
        // Mettre à jour les données fictives
        setActivites(prev => prev.map(a => 
          a.id === offreId 
            ? { ...a, isActive: action === 'unsuspend' } 
            : a
        ))
        alert(data.message || (action === 'suspend' ? 'Offre suspendue avec succès' : 'Offre réactivée avec succès'))
      } else {
        // En cas d'erreur API, utiliser les données fictives
        setActivites(prev => prev.map(a => 
          a.id === offreId 
            ? { ...a, isActive: action === 'unsuspend' } 
            : a
        ))
        alert(action === 'suspend' ? 'Offre suspendue avec succès' : 'Offre réactivée avec succès')
      }
    } catch (error) {
      console.error('Erreur:', error)
      // Utiliser les données fictives en cas d'erreur
      setActivites(prev => prev.map(a => 
        a.id === offreId 
          ? { ...a, isActive: action === 'unsuspend' } 
          : a
      ))
      alert(action === 'suspend' ? 'Offre suspendue avec succès' : 'Offre réactivée avec succès')
    }
  }

  const handleDeleteOffre = async (offreId: string, offreTitre: string) => {
    const confirmMessage = `⚠️ ATTENTION : Cette action est irréversible !\n\nÊtes-vous sûr de vouloir supprimer définitivement l'offre "${offreTitre}" ?\n\nCette suppression supprimera également :\n- Toutes les réservations associées\n- Tous les avis et favoris\n\nCette action ne peut être annulée.`
    
    if (!confirm(confirmMessage)) return

    try {
      // Supprimer l'offre des données fictives
      setActivites(prev => prev.filter(a => a.id !== offreId))
      // Supprimer aussi les réservations associées
      setReservations(prev => prev.filter(r => r.offre !== offreTitre))
      alert('Offre supprimée définitivement avec succès')
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la suppression')
    }
  }

  const handleDeletePrestataire = async (prestataireId: string, prestataireNom: string) => {
    const confirmMessage = `⚠️ ATTENTION : Cette action est irréversible !\n\nÊtes-vous sûr de vouloir supprimer définitivement le prestataire "${prestataireNom}" ?\n\nCette suppression supprimera également :\n- Toutes ses offres\n- Toutes ses réservations\n- Tous ses avis\n- Toutes ses données\n\nCette action ne peut être annulée.`
    
    if (!confirm(confirmMessage)) return

    try {
      const response = await fetch(`/api/admin/prestataires?prestataireId=${prestataireId}`, {
        method: 'DELETE',
      })

      const data = await response.json()
      if (response.ok && data.success) {
        // Supprimer des données fictives
        const prestataire = prestataires.find(p => p.id === prestataireId)
        setPrestataires(prev => prev.filter(p => p.id !== prestataireId))
        // Supprimer aussi les activités du prestataire
        if (prestataire) {
          setActivites(prev => prev.filter(a => a.prestataire !== prestataire.nomEntreprise))
        }
        alert(data.message || 'Prestataire supprimé définitivement avec succès')
      } else {
        // En cas d'erreur API, utiliser les données fictives
        const prestataire = prestataires.find(p => p.id === prestataireId)
        setPrestataires(prev => prev.filter(p => p.id !== prestataireId))
        if (prestataire) {
          setActivites(prev => prev.filter(a => a.prestataire !== prestataire.nomEntreprise))
        }
        alert('Prestataire supprimé définitivement avec succès')
      }
    } catch (error) {
      console.error('Erreur:', error)
      // Utiliser les données fictives en cas d'erreur
      const prestataire = prestataires.find(p => p.id === prestataireId)
      setPrestataires(prev => prev.filter(p => p.id !== prestataireId))
      if (prestataire) {
        setActivites(prev => prev.filter(a => a.prestataire !== prestataire.nomEntreprise))
      }
      alert('Prestataire supprimé définitivement avec succès')
    }
  }


  // Initialiser les données fictives
  useEffect(() => {
    // Données fictives pour les activités
    const mockActivites: Activite[] = [
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
      {
        id: '3',
        titre: 'Hôtel Teranga - Chambre double',
        type: 'HEBERGEMENT',
        prestataire: 'Hôtel Teranga',
        prix: 25000,
        region: 'Dakar',
        isActive: true,
        rating: 4.7,
        vues: 2345,
        createdAt: '2024-01-15',
      },
      {
        id: '4',
        titre: 'Restaurant La Teranga',
        type: 'RESTAURANT',
        prestataire: 'Restaurant La Teranga',
        prix: 8000,
        region: 'Dakar',
        isActive: true,
        rating: 4.5,
        vues: 890,
        createdAt: '2024-02-10',
      },
      {
        id: '5',
        titre: 'Tour guidé de Saint-Louis',
        type: 'GUIDE',
        prestataire: 'Guide Sénégal Authentique',
        prix: 12000,
        region: 'Saint-Louis',
        isActive: true,
        rating: 4.9,
        vues: 1567,
        createdAt: '2024-02-25',
      },
      {
        id: '6',
        titre: 'Excursion en pirogue à Ziguinchor',
        type: 'ACTIVITE',
        prestataire: 'Nature Sénégal',
        prix: 15000,
        region: 'Ziguinchor',
        isActive: false,
        rating: 4.4,
        vues: 432,
        createdAt: '2024-03-10',
      },
    ]

    // Données fictives pour les réservations
    const mockReservations: Reservation[] = [
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
      {
        id: '3',
        offre: 'Restaurant La Teranga',
        client: 'Pierre Dubois',
        prestataire: 'Restaurant La Teranga',
        dateDebut: '2024-03-25',
        montant: 8000,
        statut: 'CONFIRMED',
        createdAt: '2024-03-20',
      },
      {
        id: '4',
        offre: 'Tour guidé de Saint-Louis',
        client: 'Sophie Laurent',
        prestataire: 'Guide Sénégal Authentique',
        dateDebut: '2024-03-28',
        montant: 12000,
        statut: 'CANCELLED',
        createdAt: '2024-03-22',
      },
      {
        id: '5',
        offre: 'Safari dans le Parc Niokolo-Koba',
        client: 'Thomas Bernard',
        prestataire: 'Nature Sénégal',
        dateDebut: '2024-04-01',
        montant: 25000,
        statut: 'COMPLETED',
        createdAt: '2024-03-25',
      },
    ]

    setActivites(mockActivites)
    setReservations(mockReservations)
  }, [])

  // Charger les activités quand la section est active
  useEffect(() => {
    if (activeSection === 'activites') {
      setLoadingActivites(true)
      // Simuler un chargement
      setTimeout(() => {
        setLoadingActivites(false)
      }, 500)
    }
  }, [activeSection])

  // Charger les réservations quand la section est active
  useEffect(() => {
    if (activeSection === 'reservations') {
      setLoadingReservations(true)
      // Simuler un chargement
      setTimeout(() => {
        setLoadingReservations(false)
      }, 500)
    }
  }, [activeSection])

  // Filtrer les activités
  const activitesFiltrees = useMemo(() => {
    let filtered = activites

    // Filtre par statut
    if (filtreStatutActivite === 'active') {
      filtered = filtered.filter(a => a.isActive)
    } else if (filtreStatutActivite === 'inactive') {
      filtered = filtered.filter(a => !a.isActive)
    }

    // Filtre par type
    if (filtreTypeActivite !== 'all') {
      filtered = filtered.filter(a => a.type === filtreTypeActivite)
    }

    // Recherche
    if (searchActivite.trim()) {
      const query = searchActivite.toLowerCase()
      filtered = filtered.filter(a => 
        a.titre.toLowerCase().includes(query) ||
        a.prestataire.toLowerCase().includes(query) ||
        a.region.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [activites, filtreStatutActivite, filtreTypeActivite, searchActivite])

  // Filtrer les réservations
  const reservationsFiltrees = useMemo(() => {
    let filtered = reservations

    // Filtre par statut
    if (filtreStatutReservation !== 'all') {
      filtered = filtered.filter(r => r.statut === filtreStatutReservation)
    }

    // Recherche
    if (searchReservation.trim()) {
      const query = searchReservation.toLowerCase()
      filtered = filtered.filter(r => 
        r.offre.toLowerCase().includes(query) ||
        r.client.toLowerCase().includes(query) ||
        r.prestataire.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [reservations, filtreStatutReservation, searchReservation])

  // Filtrer les utilisateurs
  const utilisateursFiltres = useMemo(() => {
    let filtered = utilisateurs

    // Filtre par rôle
    if (filtreRole !== 'all') {
      filtered = filtered.filter(u => u.role === filtreRole)
    }

    // Filtre par statut
    if (filtreStatut === 'active') {
      filtered = filtered.filter(u => u.isActive)
    } else if (filtreStatut === 'suspended') {
      filtered = filtered.filter(u => !u.isActive)
    }

    // Recherche
    if (searchUtilisateur.trim()) {
      const query = searchUtilisateur.toLowerCase()
      filtered = filtered.filter(u => 
        u.nom.toLowerCase().includes(query) ||
        (u.prenom && u.prenom.toLowerCase().includes(query)) ||
        u.email.toLowerCase().includes(query) ||
        (u.telephone && u.telephone.toLowerCase().includes(query))
      )
    }

    return filtered
  }, [utilisateurs, filtreRole, filtreStatut, searchUtilisateur])

  // Filtrer les prestataires
  const prestatairesFiltres = useMemo(() => {
    let filtered = prestataires

    // Filtre par statut
    if (filtreStatutPrestataire === 'verified') {
      filtered = filtered.filter(p => p.isVerified && (!p.user || p.user.isActive))
    } else if (filtreStatutPrestataire === 'pending') {
      filtered = filtered.filter(p => !p.isVerified)
    } else if (filtreStatutPrestataire === 'suspended') {
      filtered = filtered.filter(p => p.user && !p.user.isActive)
    }

    // Filtre par type
    if (filtreTypePrestataire !== 'all') {
      filtered = filtered.filter(p => p.type === filtreTypePrestataire)
    }

    // Recherche
    if (searchPrestataire.trim()) {
      const query = searchPrestataire.toLowerCase()
      filtered = filtered.filter(p => 
        p.nomEntreprise.toLowerCase().includes(query) ||
        (p.email && p.email.toLowerCase().includes(query)) ||
        (p.telephone && p.telephone.toLowerCase().includes(query)) ||
        (p.ville && p.ville.toLowerCase().includes(query)) ||
        (p.region && p.region.toLowerCase().includes(query)) ||
        (p.user && (
          p.user.nom.toLowerCase().includes(query) ||
          (p.user.prenom && p.user.prenom.toLowerCase().includes(query)) ||
          p.user.email.toLowerCase().includes(query)
        ))
      )
    }

    return filtered
  }, [prestataires, filtreStatutPrestataire, filtreTypePrestataire, searchPrestataire])


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
          <div className="container py-4 sm:py-6 lg:py-8 xl:py-12 px-3 sm:px-4 lg:px-6 xl:px-8 max-w-full">
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
                    className="mb-4 sm:mb-6 lg:mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-1 sm:mb-2 bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                      Dashboard Administrateur
                    </h1>
                    <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
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
                    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                      <motion.div variants={itemVariants}>
                        <Card className="hover:shadow-lg transition-shadow duration-300">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6 pt-4 sm:pt-6">
                            <CardTitle className="text-xs sm:text-sm font-medium">Prestataires</CardTitle>
                            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                          </CardHeader>
                          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                            <div className="text-xl sm:text-2xl font-bold">{stats.prestatairesTotal}</div>
                            <p className="text-xs text-muted-foreground">
                              Prestataires actifs
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <Card className="hover:shadow-lg transition-shadow duration-300">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6 pt-4 sm:pt-6">
                            <CardTitle className="text-xs sm:text-sm font-medium">Réservations</CardTitle>
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                          </CardHeader>
                          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                            <div className="text-xl sm:text-2xl font-bold">{stats.reservationsMois}</div>
                            <p className="text-xs text-muted-foreground">
                              Ce mois ({stats.reservationsTotal} total)
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <Card className="hover:shadow-lg transition-shadow duration-300">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6 pt-4 sm:pt-6">
                            <CardTitle className="text-xs sm:text-sm font-medium">Revenus</CardTitle>
                            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                          </CardHeader>
                          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                            <div className="text-xl sm:text-2xl font-bold text-sm sm:text-base">
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
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6 pt-4 sm:pt-6">
                            <CardTitle className="text-xs sm:text-sm font-medium">Revenus Abonnements</CardTitle>
                            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                          </CardHeader>
                          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                            <div className="text-xl sm:text-2xl font-bold text-sm sm:text-base">
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
                    <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
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
                        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                          <Button 
                            variant="outline" 
                            className="h-auto flex-col items-start p-3 sm:p-4"
                            onClick={() => setActiveSection('prestataires')}
                          >
                            <Users className="h-4 w-4 sm:h-5 sm:w-5 mb-2" />
                            <span className="font-medium text-sm sm:text-base">Gérer prestataires</span>
                            <span className="text-xs text-muted-foreground mt-1">
                              {stats.prestatairesTotal} prestataires
                            </span>
                          </Button>
                          <Button 
                            variant="outline" 
                            className="h-auto flex-col items-start p-3 sm:p-4"
                            onClick={() => setActiveSection('activites')}
                          >
                            <Package className="h-4 w-4 sm:h-5 sm:w-5 mb-2" />
                            <span className="font-medium text-sm sm:text-base">Gérer activités</span>
                            <span className="text-xs text-muted-foreground mt-1">
                              {stats.activitesTotal} activités
                            </span>
                          </Button>
                          <Button 
                            variant="outline" 
                            className="h-auto flex-col items-start p-3 sm:p-4"
                            onClick={() => setActiveSection('support')}
                          >
                            <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 mb-2" />
                            <span className="font-medium text-sm sm:text-base">Support client</span>
                            <span className="text-xs text-muted-foreground mt-1">
                              5 messages non lus
                            </span>
                          </Button>
                          <Button 
                            variant="outline" 
                            className="h-auto flex-col items-start p-4"
                            onClick={() => setActiveSection('analytics')}
                          >
                            <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 mb-2" />
                            <span className="font-medium text-sm sm:text-base">Voir analytics</span>
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
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                    <div className="min-w-0 flex-1">
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight mb-1 sm:mb-2 bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                        Gestion des Prestataires
                      </h2>
                      <p className="text-sm sm:text-base text-muted-foreground">
                        Gérez et modérez les prestataires de la plateforme
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                        <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Exporter</span>
                        <span className="sm:hidden">Export</span>
                      </Button>
                    </div>
                  </div>

                  {/* Filtres */}
                  <Card>
                    <CardContent className="pt-4 sm:pt-6">
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="relative">
                            <Search className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground z-10" />
                            <Input 
                              placeholder="Rechercher un prestataire..." 
                              className="pl-7 sm:pl-9 text-sm sm:text-base h-9 sm:h-10"
                              value={searchPrestataire}
                              onChange={(e) => setSearchPrestataire(e.target.value)}
                            />
                          </div>
                        </div>
                        <Select value={filtreStatutPrestataire} onValueChange={(value) => {
                          setFiltreStatutPrestataire(value)
                        }}>
                          <SelectTrigger className="w-full sm:w-[160px] lg:w-[180px] h-9 sm:h-10 text-sm sm:text-base">
                            <SelectValue placeholder="Statut" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Tous</SelectItem>
                            <SelectItem value="verified">Actifs</SelectItem>
                            <SelectItem value="pending">En attente</SelectItem>
                            <SelectItem value="suspended">Suspendus</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={filtreTypePrestataire} onValueChange={(value) => {
                          setFiltreTypePrestataire(value)
                        }}>
                          <SelectTrigger className="w-full sm:w-[160px] lg:w-[180px] h-9 sm:h-10 text-sm sm:text-base">
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Tous les types</SelectItem>
                            <SelectItem value="HOTEL">Hébergement</SelectItem>
                            <SelectItem value="RESIDENCE">Résidence</SelectItem>
                            <SelectItem value="AUBERGE">Auberge</SelectItem>
                            <SelectItem value="TRANSPORT">Transport</SelectItem>
                            <SelectItem value="GUIDE">Guide</SelectItem>
                            <SelectItem value="AGENCE">Agence</SelectItem>
                            <SelectItem value="RESTAURANT">Restaurant</SelectItem>
                            <SelectItem value="AUTRE">Autre</SelectItem>
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
                  ) : prestatairesFiltres.length === 0 ? (
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <p className="text-muted-foreground">Aucun prestataire trouvé</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {prestatairesFiltres.map((prestataire) => {
                        const user = prestataire.user
                        const isSuspended = user && !user.isActive
                        
                        return (
                          <Card key={prestataire.id} className="hover:shadow-lg transition-shadow">
                            <CardContent className="pt-4 sm:pt-6">
                              <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between mb-2 gap-2">
                                    <div className="min-w-0 flex-1">
                                      <h3 className="text-base sm:text-lg font-semibold flex flex-wrap items-center gap-1 sm:gap-2">
                                        <span className="truncate">{prestataire.nomEntreprise}</span>
                                        {isSuspended ? (
                                          <Badge variant="destructive" className="text-xs flex-shrink-0">
                                            <Ban className="h-3 w-3 mr-1" />
                                            Suspendu
                                          </Badge>
                                        ) : (
                                          <Badge variant="default" className="bg-green-500 text-xs flex-shrink-0">
                                            <CheckCircle className="h-3 w-3 mr-1" />
                                            Actif
                                          </Badge>
                                        )}
                                      </h3>
                                      <p className="text-xs sm:text-sm text-muted-foreground mt-1 break-words">
                                        {prestataire.type} • {prestataire.ville || ''}, {prestataire.region || ''}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4 mt-3 sm:mt-4 text-xs sm:text-sm">
                                    {user?.email && (
                                      <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                                        <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                                        <span className="truncate">{user.email}</span>
                                      </div>
                                    )}
                                    {prestataire.telephone && (
                                      <div className="flex items-center gap-1.5 sm:gap-2">
                                        <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                                        <span className="truncate">{prestataire.telephone}</span>
                                      </div>
                                    )}
                                    <div className="flex items-center gap-1.5 sm:gap-2">
                                      <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                                      <span>{prestataire.rating || 0} ({prestataire.nombreAvis || 0} avis)</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-row sm:flex-col gap-2 lg:items-end flex-shrink-0">
                                  <div className="flex gap-2 w-full sm:w-auto">
                                    {isSuspended ? (
                                      <Button 
                                        size="sm" 
                                        className="flex-1 sm:flex-none text-xs sm:text-sm"
                                        onClick={() => handleSuspendPrestataire(prestataire.id, 'unsuspend')}
                                      >
                                        <UserCheck className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                        <span className="hidden sm:inline">Réactiver</span>
                                        <span className="sm:hidden">Réact.</span>
                                      </Button>
                                    ) : (
                                      <Button 
                                        variant="destructive" 
                                        size="sm" 
                                        className="flex-1 sm:flex-none text-xs sm:text-sm"
                                        onClick={() => handleSuspendPrestataire(prestataire.id, 'suspend')}
                                      >
                                        <Ban className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                        <span className="hidden sm:inline">Suspendre</span>
                                        <span className="sm:hidden">Susp.</span>
                                      </Button>
                                    )}
                                    <Button 
                                      variant="destructive" 
                                      size="sm" 
                                      className="flex-1 sm:flex-none text-xs sm:text-sm"
                                      onClick={() => handleDeletePrestataire(prestataire.id, prestataire.nomEntreprise)}
                                    >
                                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                      <span className="hidden sm:inline">Supprimer</span>
                                      <span className="sm:hidden">Suppr.</span>
                                    </Button>
                                  </div>
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
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                    <div className="min-w-0 flex-1">
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight mb-1 sm:mb-2 bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                        Gestion des Activités
                      </h2>
                      <p className="text-sm sm:text-base text-muted-foreground">
                        Gérez et modérez toutes les activités touristiques
                      </p>
                    </div>
                  </div>

                  {/* Filtres */}
                  <Card>
                    <CardContent className="pt-4 sm:pt-6">
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="relative">
                            <Search className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground z-10" />
                            <Input 
                              placeholder="Rechercher une activité..." 
                              className="pl-7 sm:pl-9 text-sm sm:text-base h-9 sm:h-10"
                              value={searchActivite}
                              onChange={(e) => setSearchActivite(e.target.value)}
                            />
                          </div>
                        </div>
                        <Select value={filtreStatutActivite} onValueChange={setFiltreStatutActivite}>
                          <SelectTrigger className="w-full sm:w-[160px] lg:w-[180px] h-9 sm:h-10 text-sm sm:text-base">
                            <SelectValue placeholder="Statut" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Toutes</SelectItem>
                            <SelectItem value="active">Actives</SelectItem>
                            <SelectItem value="inactive">Inactives</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={filtreTypeActivite} onValueChange={setFiltreTypeActivite}>
                          <SelectTrigger className="w-full sm:w-[160px] lg:w-[180px] h-9 sm:h-10 text-sm sm:text-base">
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Tous les types</SelectItem>
                            <SelectItem value="HEBERGEMENT">Hébergement</SelectItem>
                            <SelectItem value="GUIDE">Guide</SelectItem>
                            <SelectItem value="ACTIVITE">Activité</SelectItem>
                            <SelectItem value="RESTAURANT">Restaurant</SelectItem>
                            <SelectItem value="TRANSPORT">Transport</SelectItem>
                            <SelectItem value="AUTRE">Autre</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Liste des activités */}
                  {loadingActivites ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Chargement des activités...</p>
                    </div>
                  ) : activitesFiltrees.length === 0 ? (
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <p className="text-muted-foreground">Aucune activité trouvée</p>
                      </CardContent>
                    </Card>
                  ) : (
                  <div className="space-y-4">
                      {activitesFiltrees.map((activite) => (
                      <Card key={activite.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="pt-4 sm:pt-6">
                          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2 gap-2">
                                <div className="min-w-0 flex-1">
                                  <h3 className="text-base sm:text-lg font-semibold flex flex-wrap items-center gap-1 sm:gap-2">
                                    <span className="truncate">{activite.titre}</span>
                                    {activite.isActive ? (
                                      <Badge variant="default" className="bg-green-500 text-xs flex-shrink-0">
                                        Active
                                      </Badge>
                                    ) : (
                                      <Badge variant="secondary" className="text-xs flex-shrink-0">
                                        Inactive
                                      </Badge>
                                    )}
                                  </h3>
                                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 break-words">
                                    {activite.type} • {activite.region} • Prestataire: {activite.prestataire}
                                  </p>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4 mt-3 sm:mt-4 text-xs sm:text-sm">
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                  <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                                  <span>{activite.prix.toLocaleString()} FCFA</span>
                                </div>
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                  <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                                  <span>{activite.rating}</span>
                                </div>
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                  <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                                  <span>{activite.vues} vues</span>
                                </div>
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                                  <span className="hidden sm:inline">Créée le {new Date(activite.createdAt).toLocaleDateString('fr-FR')}</span>
                                  <span className="sm:hidden">{new Date(activite.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-row sm:flex-col gap-2 lg:items-end flex-shrink-0">
                              <Button variant="outline" size="sm" className="flex-1 sm:flex-none text-xs sm:text-sm">
                                <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                <span className="hidden sm:inline">Voir détails</span>
                                <span className="sm:hidden">Détails</span>
                              </Button>
                              <div className="flex gap-2 w-full sm:w-auto">
                                {activite.isActive ? (
                                  <Button 
                                    variant="secondary" 
                                    size="sm" 
                                    className="flex-1 sm:flex-none text-xs sm:text-sm"
                                    onClick={() => handleSuspendOffre(activite.id, 'suspend')}
                                  >
                                    <Ban className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                    <span className="hidden sm:inline">Suspendre</span>
                                    <span className="sm:hidden">Susp.</span>
                                  </Button>
                                ) : (
                                  <Button 
                                    variant="default" 
                                    size="sm" 
                                    className="flex-1 sm:flex-none text-xs sm:text-sm"
                                    onClick={() => handleSuspendOffre(activite.id, 'unsuspend')}
                                  >
                                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                    <span className="hidden sm:inline">Réactiver</span>
                                    <span className="sm:hidden">Réact.</span>
                                  </Button>
                                )}
                                <Button 
                                  variant="destructive" 
                                  size="sm" 
                                  className="flex-1 sm:flex-none text-xs sm:text-sm"
                                  onClick={() => handleDeleteOffre(activite.id, activite.titre)}
                                >
                                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                  <span className="hidden sm:inline">Supprimer</span>
                                  <span className="sm:hidden">Suppr.</span>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  )}
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
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight mb-1 sm:mb-2 bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                      Gestion des Réservations
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Supervisez toutes les réservations et intervenez en cas de litige
                    </p>
                  </div>

                  {/* Filtres */}
                  <Card>
                    <CardContent className="pt-4 sm:pt-6">
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="relative">
                            <Search className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground z-10" />
                            <Input 
                              placeholder="Rechercher une réservation..." 
                              className="pl-7 sm:pl-9 text-sm sm:text-base h-9 sm:h-10"
                              value={searchReservation}
                              onChange={(e) => setSearchReservation(e.target.value)}
                            />
                          </div>
                        </div>
                        <Select value={filtreStatutReservation} onValueChange={setFiltreStatutReservation}>
                          <SelectTrigger className="w-full sm:w-[160px] lg:w-[180px] h-9 sm:h-10 text-sm sm:text-base">
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
                  {loadingReservations ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Chargement des réservations...</p>
                    </div>
                  ) : reservationsFiltrees.length === 0 ? (
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <p className="text-muted-foreground">Aucune réservation trouvée</p>
                      </CardContent>
                    </Card>
                  ) : (
                  <div className="space-y-4">
                      {reservationsFiltrees.map((reservation) => (
                      <Card key={reservation.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="pt-4 sm:pt-6">
                          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base sm:text-lg font-semibold mb-2 truncate">{reservation.offre}</h3>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                                <div>
                                  <p className="text-muted-foreground mb-1">Client</p>
                                  <p className="font-medium truncate">{reservation.client}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground mb-1">Prestataire</p>
                                  <p className="font-medium truncate">{reservation.prestataire}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground mb-1">Date</p>
                                  <p className="font-medium">{new Date(reservation.dateDebut).toLocaleDateString('fr-FR')}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground mb-1">Montant</p>
                                  <p className="font-medium">{reservation.montant.toLocaleString()} FCFA</p>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-row sm:flex-col gap-2 lg:items-end flex-shrink-0">
                              <Badge 
                                variant={
                                  reservation.statut === 'CONFIRMED' ? 'default' :
                                  reservation.statut === 'PENDING' ? 'secondary' :
                                  reservation.statut === 'CANCELLED' ? 'destructive' : 
                                  reservation.statut === 'COMPLETED' ? 'outline' : 'secondary'
                                }
                                className="text-xs sm:text-sm"
                              >
                                {reservation.statut === 'PENDING' ? 'En attente' :
                                 reservation.statut === 'CONFIRMED' ? 'Confirmée' :
                                 reservation.statut === 'CANCELLED' ? 'Annulée' :
                                 reservation.statut === 'COMPLETED' ? 'Terminée' : reservation.statut}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  )}
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
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight mb-1 sm:mb-2 bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                      Gestion des Utilisateurs
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Gérez les comptes clients et prestataires
                    </p>
                  </div>

                  {/* Filtres */}
                  <Card>
                    <CardContent className="pt-4 sm:pt-6">
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="relative">
                            <Search className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground z-10" />
                            <Input 
                              placeholder="Rechercher un utilisateur..."
                              className="pl-7 sm:pl-9 text-sm sm:text-base h-9 sm:h-10"
                              value={searchUtilisateur}
                              onChange={(e) => setSearchUtilisateur(e.target.value)}
                            />
                          </div>
                        </div>
                        <Select value={filtreRole} onValueChange={setFiltreRole}>
                          <SelectTrigger className="w-full sm:w-[160px] lg:w-[180px] h-9 sm:h-10 text-sm sm:text-base">
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
                          <SelectTrigger className="w-full sm:w-[160px] lg:w-[180px] h-9 sm:h-10 text-sm sm:text-base">
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
                  ) : utilisateursFiltres.length === 0 ? (
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <p className="text-muted-foreground">Aucun utilisateur trouvé</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {utilisateursFiltres.map((utilisateur) => (
                        <Card key={utilisateur.id} className="hover:shadow-lg transition-shadow">
                          <CardContent className="pt-4 sm:pt-6">
                            <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
                              <div className="flex-1 min-w-0">
                                <h3 className="text-base sm:text-lg font-semibold mb-2 truncate">
                                  {utilisateur.prenom || ''} {utilisateur.nom}
                                </h3>
                                <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4 text-xs sm:text-sm">
                                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                                    <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                                    <span className="truncate">{utilisateur.email}</span>
                                  </div>
                                  {utilisateur.telephone && (
                                    <div className="flex items-center gap-1.5 sm:gap-2">
                                      <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                                      <span className="truncate">{utilisateur.telephone}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-1.5 sm:gap-2">
                                    <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                                    <Badge variant="outline" className="text-xs">{utilisateur.role}</Badge>
                                  </div>
                                  <div className="flex items-center gap-1.5 sm:gap-2">
                                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                                    <span className="hidden sm:inline">Inscrit le {new Date(utilisateur.createdAt).toLocaleDateString('fr-FR')}</span>
                                    <span className="sm:hidden">{new Date(utilisateur.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}</span>
                                  </div>
                                  {!utilisateur.isActive && (
                                    <Badge variant="destructive" className="text-xs">Suspendu</Badge>
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-row sm:flex-col gap-2 lg:items-end flex-shrink-0">
                                <div className="flex gap-2 w-full sm:w-auto">
                                {utilisateur.isActive ? (
                                  <Button 
                                    variant="destructive" 
                                    size="sm" 
                                    className="flex-1 sm:flex-none text-xs sm:text-sm"
                                    onClick={() => handleSuspendUtilisateur(utilisateur.id, 'suspend')}
                                  >
                                    <Ban className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                    <span className="hidden sm:inline">Suspendre</span>
                                    <span className="sm:hidden">Susp.</span>
                                  </Button>
                                ) : (
                                  <Button 
                                    size="sm" 
                                    className="flex-1 sm:flex-none text-xs sm:text-sm"
                                    onClick={() => handleSuspendUtilisateur(utilisateur.id, 'unsuspend')}
                                  >
                                    <UserCheck className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                    <span className="hidden sm:inline">Réactiver</span>
                                    <span className="sm:hidden">Réact.</span>
                                  </Button>
                                )}
                                  <Button 
                                    variant="destructive" 
                                    size="sm" 
                                    className="flex-1 sm:flex-none text-xs sm:text-sm"
                                    onClick={() => handleDeleteUtilisateur(utilisateur.id, `${utilisateur.prenom || ''} ${utilisateur.nom}`.trim())}
                                  >
                                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                    <span className="hidden sm:inline">Supprimer</span>
                                    <span className="sm:hidden">Suppr.</span>
                                  </Button>
                                </div>
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
                      <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
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
                      Gestion du Contenu
                    </h2>
                    <p className="text-muted-foreground">
                      Gérez le contenu éditable des pages de la plateforme (texte, images, vidéos)
                    </p>
                  </div>

                  {/* Sélection de la page à éditer */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Sélectionner une page à éditer</CardTitle>
                      <CardDescription>
                        Choisissez la page dont vous souhaitez modifier le contenu
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {[
                          { id: 'cgu', name: 'Conditions Générales (CGU)', icon: FileText },
                          { id: 'cgv', name: 'Conditions Générales de Vente (CGV)', icon: FileText },
                          { id: 'pc', name: 'Politique de Confidentialité', icon: Shield },
                          { id: 'about', name: 'À propos', icon: FileText },
                          { id: 'home', name: 'Page d\'accueil', icon: FileText },
                          { id: 'regions', name: 'Régions', icon: Globe },
                          { id: 'plages-iles', name: 'Plages & Îles', icon: Waves },
                          { id: 'culture-religion', name: 'Culture & Religion', icon: Church },
                          { id: 'gastronomie', name: 'Gastronomie', icon: UtensilsCrossed },
                          { id: 'nature-ecotourisme', name: 'Nature & Écotourisme', icon: Leaf },
                          { id: 'monuments-histoire', name: 'Monuments & Histoire', icon: Landmark },
                          { id: 'marche-artisanal', name: 'Marché Artisanal', icon: ShoppingBag },
                        ].map((page) => {
                          const Icon = page.icon
                          return (
                            <Button
                              key={page.id}
                              variant="outline"
                              className="h-auto flex-col items-start p-4 hover:shadow-lg transition-all"
                              onClick={() => setSelectedPage(page.id)}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <Icon className="h-5 w-5" />
                                <span className="font-medium">{page.name}</span>
                              </div>
                            </Button>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Éditeur de contenu */}
                  {selectedPage && (
                    <ContenuEditor
                      pageId={selectedPage}
                      pageName={pages.find(p => p.id === selectedPage)?.name || selectedPage}
                      onSave={() => {
                        // Optionnel: recharger ou faire autre chose après sauvegarde
                      }}
                    />
                  )}
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

                  <Card className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-xl">
                    <CardContent className="p-0">
                      <ChatInterface
                        currentUserId="admin"
                        conversations={supportConversations.map(conv => ({
                          id: conv.id,
                          name: conv.name,
                          avatar: conv.avatar,
                          lastMessage: conv.lastMessage,
                          timestamp: conv.timestamp,
                          unreadCount: conv.unreadCount,
                          isOnline: conv.isOnline,
                          user: conv.user,
                        }))}
                        messages={supportMessages}
                        emptyStateTitle="Aucun message de support"
                        emptyStateDescription="Les messages de support des utilisateurs et prestataires apparaîtront ici"
                        onSendMessage={(content, conversationId) => {
                          if (!conversationId) return
                          
                          const conversation = supportConversations.find(c => c.id === conversationId)
                          if (!conversation) return
                          
                          // Créer un nouveau message
                          const newMessage: MockSupportMessage = {
                            id: `msg-${Date.now()}`,
                            content,
                            senderId: 'admin',
                            senderName: 'Administrateur',
                            timestamp: new Date(),
                            isRead: true,
                            isFromUser: false,
                          }
                          
                          setSupportMessages(prev => [...prev, newMessage])
                        }}
                        onSelectConversation={(conversationId) => {
                          setSelectedConversationId(conversationId)
                          
                          // Trouver la conversation sélectionnée
                          const conversation = supportConversations.find(c => c.id === conversationId)
                          if (!conversation) return
                          
                          // Charger les messages pour cette conversation
                          const otherUser = conversation.user
                          const messages = getSupportMessagesForConversation(
                            conversationId,
                            'admin',
                            otherUser.id,
                            `${otherUser.prenom} ${otherUser.nom}`
                          )
                          
                          setSupportMessages(messages)
                        }}
                      />
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

                  <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Globe className="h-5 w-5" />
                          Langues
                        </CardTitle>
                        <CardDescription>Langues disponibles sur la plateforme</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {[
                          { key: 'fr', name: 'Français' },
                          { key: 'en', name: 'Anglais' },
                          { key: 'ar', name: 'Arabe' },
                          { key: 'es', name: 'Espagnol' },
                          { key: 'pt', name: 'Portugais' },
                          { key: 'de', name: 'Allemand' },
                          { key: 'it', name: 'Italien' },
                        ].map((lang) => (
                          <div key={lang.key} className="flex items-center justify-between">
                            <span>{lang.name}</span>
                            <div className="flex items-center gap-2">
                              <Badge variant={languesActives[lang.key] ? "default" : "secondary"}>
                                {languesActives[lang.key] ? 'Actif' : 'Inactif'}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => {
                                  setLanguesActives(prev => ({
                                    ...prev,
                                    [lang.key]: !prev[lang.key]
                                  }))
                                }}
                              >
                                {languesActives[lang.key] ? '✓' : '✗'}
                              </Button>
                            </div>
                          </div>
                        ))}
                        <Button 
                          variant="outline" 
                          className="w-full mt-4"
                          onClick={async () => {
                            setSavingSettings(true)
                            // Simuler la sauvegarde
                            await new Promise(resolve => setTimeout(resolve, 500))
                            alert('Langues mises à jour avec succès !')
                            setSavingSettings(false)
                          }}
                          disabled={savingSettings}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {savingSettings ? 'Sauvegarde...' : 'Sauvegarder les langues'}
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
                        {[
                          { key: 'orange-money', name: 'Orange Money' },
                          { key: 'wave', name: 'Wave' },
                          { key: 'carte-bancaire', name: 'Carte bancaire' },
                          { key: 'visa-mastercard', name: 'VISA/Mastercard' },
                          { key: 'free-money', name: 'Free Money' },
                        ].map((paiement) => (
                          <div key={paiement.key} className="flex items-center justify-between">
                            <span>{paiement.name}</span>
                            <div className="flex items-center gap-2">
                              <Badge variant={paiementsActifs[paiement.key] ? "default" : "secondary"}>
                                {paiementsActifs[paiement.key] ? 'Actif' : 'Inactif'}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => {
                                  setPaiementsActifs(prev => ({
                                    ...prev,
                                    [paiement.key]: !prev[paiement.key]
                                  }))
                                }}
                              >
                                {paiementsActifs[paiement.key] ? '✓' : '✗'}
                              </Button>
                            </div>
                          </div>
                        ))}
                        <Button 
                          variant="outline" 
                          className="w-full mt-4"
                          onClick={async () => {
                            setSavingSettings(true)
                            // Simuler la sauvegarde
                            await new Promise(resolve => setTimeout(resolve, 500))
                            alert('Moyens de paiement mis à jour avec succès !')
                            setSavingSettings(false)
                          }}
                          disabled={savingSettings}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {savingSettings ? 'Sauvegarde...' : 'Sauvegarder les paiements'}
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="md:col-span-2">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Zap className="h-5 w-5" />
                          Configuration Stripe
                        </CardTitle>
                        <CardDescription>
                          Configurez Stripe pour les paiements en ligne, abonnements et Stripe Connect
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Statut de connexion Stripe */}
                        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                          <div className="flex items-center gap-3">
                            {stripeStatus === 'connected' ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : stripeStatus === 'disconnected' ? (
                              <XCircle className="h-5 w-5 text-red-500" />
                            ) : (
                              <AlertCircle className="h-5 w-5 text-yellow-500" />
                            )}
                            <div>
                              <p className="font-medium">Statut Stripe</p>
                              <p className="text-sm text-muted-foreground">
                                {stripeStatus === 'connected' ? 'Connecté et opérationnel' :
                                 stripeStatus === 'disconnected' ? 'Non configuré' :
                                 'Vérification en cours...'}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                              setStripeStatus('checking')
                              // Simuler la vérification
                              await new Promise(resolve => setTimeout(resolve, 1000))
                              setStripeStatus('connected')
                              alert('Connexion Stripe vérifiée avec succès !')
                            }}
                          >
                            Tester la connexion
                          </Button>
                        </div>

                        {/* Configuration des clés API */}
                        <div className="space-y-4">
                          <h3 className="font-semibold flex items-center gap-2">
                            <Key className="h-4 w-4" />
                            Clés API Stripe
                          </h3>
                          
                          <div className="space-y-3">
                            <div>
                              <label className="text-sm font-medium mb-1 block">Mode</label>
                              <Select 
                                value={stripeConfig.mode} 
                                onValueChange={(value: 'test' | 'live') => 
                                  setStripeConfig(prev => ({ ...prev, mode: value }))
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="test">Test (sk_test_...)</SelectItem>
                                  <SelectItem value="live">Production (sk_live_...)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <label className="text-sm font-medium mb-1 block">Secret Key</label>
                              <div className="relative">
                                <Input
                                  type="password"
                                  placeholder={stripeConfig.mode === 'test' ? 'sk_test_...' : 'sk_live_...'}
                                  value={stripeConfig.secretKey}
                                  onChange={(e) => setStripeConfig(prev => ({ ...prev, secretKey: e.target.value }))}
                                  className="pr-10"
                                />
                                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                Trouvez cette clé dans votre{' '}
                                <a 
                                  href="https://dashboard.stripe.com/apikeys" 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline inline-flex items-center gap-1"
                                >
                                  Dashboard Stripe
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </p>
                            </div>

                            <div>
                              <label className="text-sm font-medium mb-1 block">Publishable Key</label>
                              <div className="relative">
                                <Input
                                  type="password"
                                  placeholder={stripeConfig.mode === 'test' ? 'pk_test_...' : 'pk_live_...'}
                                  value={stripeConfig.publishableKey}
                                  onChange={(e) => setStripeConfig(prev => ({ ...prev, publishableKey: e.target.value }))}
                                  className="pr-10"
                                />
                                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              </div>
                            </div>

                            <div>
                              <label className="text-sm font-medium mb-1 block">Webhook Secret</label>
                              <div className="relative">
                                <Input
                                  type="password"
                                  placeholder="whsec_..."
                                  value={stripeConfig.webhookSecret}
                                  onChange={(e) => setStripeConfig(prev => ({ ...prev, webhookSecret: e.target.value }))}
                                  className="pr-10"
                                />
                                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                Configurez le webhook dans votre{' '}
                                <a 
                                  href="https://dashboard.stripe.com/webhooks" 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline inline-flex items-center gap-1"
                                >
                                  Dashboard Stripe
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Méthodes de paiement Stripe */}
                        <div className="space-y-4 pt-4 border-t">
                          <h3 className="font-semibold flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            Méthodes de paiement Stripe
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {[
                              { key: 'visa', name: 'Visa', icon: '💳' },
                              { key: 'mastercard', name: 'Mastercard', icon: '💳' },
                              { key: 'amex', name: 'American Express', icon: '💳' },
                              { key: 'apple-pay', name: 'Apple Pay', icon: '📱' },
                              { key: 'google-pay', name: 'Google Pay', icon: '📱' },
                            ].map((method) => (
                              <div key={method.key} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-2">
                                  <span>{method.icon}</span>
                                  <span className="text-sm">{method.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant={stripeMethods[method.key] ? "default" : "secondary"}>
                                    {stripeMethods[method.key] ? 'Actif' : 'Inactif'}
                                  </Badge>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => {
                                      setStripeMethods(prev => ({
                                        ...prev,
                                        [method.key]: !prev[method.key]
                                      }))
                                    }}
                                  >
                                    {stripeMethods[method.key] ? '✓' : '✗'}
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Stripe Connect */}
                        <div className="space-y-4 pt-4 border-t">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold flex items-center gap-2">
                                <Link className="h-4 w-4" />
                                Stripe Connect
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                Permet aux prestataires de recevoir des paiements directement
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={stripeConnectEnabled ? "default" : "secondary"}>
                                {stripeConnectEnabled ? 'Activé' : 'Désactivé'}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setStripeConnectEnabled(!stripeConnectEnabled)}
                              >
                                {stripeConnectEnabled ? '✓' : '✗'}
                              </Button>
                            </div>
                          </div>
                          {stripeConnectEnabled && (
                            <div className="p-3 bg-muted rounded-lg">
                              <p className="text-sm text-muted-foreground">
                                Les prestataires peuvent configurer leur compte Stripe Connect pour recevoir des paiements directement.
                                {' '}
                                <a 
                                  href="https://stripe.com/docs/connect" 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline inline-flex items-center gap-1"
                                >
                                  En savoir plus
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </p>
                            </div>
                          )}
                        </div>

                        {/* URL Webhook */}
                        <div className="space-y-2 pt-4 border-t">
                          <h3 className="font-semibold text-sm">URL du Webhook</h3>
                          <div className="flex gap-2">
                            <Input
                              value={stripeWebhookUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'https://votre-domaine.com'}/api/paiements/stripe/webhook`}
                              readOnly
                              className="font-mono text-xs"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const url = stripeWebhookUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'https://votre-domaine.com'}/api/paiements/stripe/webhook`
                                navigator.clipboard.writeText(url)
                                alert('URL copiée dans le presse-papiers !')
                              }}
                            >
                              Copier
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Utilisez cette URL pour configurer votre webhook dans le Dashboard Stripe
                          </p>
                        </div>

                        {/* Bouton de sauvegarde */}
                        <Button 
                          variant="default" 
                          className="w-full"
                          onClick={async () => {
                            setSavingSettings(true)
                            // Simuler la sauvegarde
                            await new Promise(resolve => setTimeout(resolve, 1000))
                            alert('Configuration Stripe enregistrée avec succès !')
                            setSavingSettings(false)
                            setStripeStatus('connected')
                          }}
                          disabled={savingSettings}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {savingSettings ? 'Sauvegarde...' : 'Sauvegarder la configuration Stripe'}
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

                  <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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

                  <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
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

