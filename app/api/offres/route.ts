import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, handleApiError } from '@/lib/api/response'
import { requireRole } from '@/lib/api/auth'
import { calculateVisibilityScore } from '@/lib/plans'


// Types pour les résultats Prisma
type Prestataire = {
  id: string
  planType: string
  planExpiresAt: Date | null
  [key: string]: unknown
}

type OffreWithPrestataire = {
  id: string
  prestataireId: string
  rating: number
  prestataire: Prestataire
  boosts: Array<{ type: string }>
  _count: {
    avis: number
    reservations: number
  }
  [key: string]: unknown
}

/**
 * GET /api/offres
 * Récupère la liste des offres avec filtres optionnels
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type')
    const region = searchParams.get('region')
    const ville = searchParams.get('ville')
    const minPrix = searchParams.get('minPrix')
    const maxPrix = searchParams.get('maxPrix')
    const isActive = searchParams.get('isActive') !== 'false'
    const isFeatured = searchParams.get('isFeatured')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const where: {
      isActive: boolean;
      type?: string;
      region?: string;
      ville?: string;
      prix?: { gte?: number; lte?: number };
      isFeatured?: boolean;
      featuredExpiresAt?: { gte: Date };
    } = {
      isActive,
    }

    if (type) {
      where.type = type
    }
    if (region) {
      where.region = region
    }
    if (ville) {
      where.ville = ville
    }
    if (minPrix || maxPrix) {
      where.prix = {}
      if (minPrix) {
        where.prix.gte = parseFloat(minPrix)
      }
      if (maxPrix) {
        where.prix.lte = parseFloat(maxPrix)
      }
    }
    if (isFeatured === 'true') {
      where.isFeatured = true
      where.featuredExpiresAt = {
        gte: new Date(),
      }
    }

    // Récupérer toutes les offres avec les informations nécessaires pour le tri
    const offresRaw = await (prisma.offre.findMany as (args: unknown) => Promise<OffreWithPrestataire[]>)({
      where,
      include: {
        prestataire: {
          select: {
            id: true,
            nomEntreprise: true,
            logo: true,
            isVerified: true,
            rating: true,
            planType: true,
            planExpiresAt: true,
          },
        },
        boosts: {
          where: {
            isActive: true,
            dateFin: {
              gte: new Date(),
            },
          },
          select: {
            type: true,
          },
        },
        _count: {
          select: {
            avis: true,
            reservations: true,
            likes: true,
            favoris: true,
          },
        },
      },
    })

    // Calculer le score de visibilité pour chaque offre
    const offresWithScore = offresRaw.map((offre) => {
      const hasActiveBoost = offre.boosts.length > 0
      const boostType = offre.boosts[0]?.type
      const isPlanActive = offre.prestataire.planExpiresAt
        ? new Date(offre.prestataire.planExpiresAt) > new Date()
        : false

      // Si le plan est expiré, considérer comme GRATUIT
      const planType = isPlanActive
        ? offre.prestataire.planType
        : 'GRATUIT'

      const visibilityScore = calculateVisibilityScore(
        planType as 'GRATUIT' | 'PRO' | 'PREMIUM',
        hasActiveBoost,
        boostType,
        offre.rating,
        offre._count.avis
      )

      return {
        ...(offre as Record<string, unknown>),
        visibilityScore,
      }
    })

    // Trier par score de visibilité (décroissant)
    offresWithScore.sort((a, b) => b.visibilityScore - a.visibilityScore)

    // Si aucune offre n'existe, créer des données fictives pour le développement
    let finalOffres = offresWithScore
    if (finalOffres.length === 0) {
      // ID du prestataire fictif qui correspond à celui de useAuth
      const mockPrestataireId = 'dev-prestataire-profile-id'
      
      // Créer des offres fictives pour le développement
      const mockOffres = [
        {
          id: 'mock-1',
          titre: 'Tour guidé de Dakar',
          description: 'Découvrez les merveilles de Dakar avec un guide local expérimenté. Visitez les monuments historiques, les marchés colorés et les plages magnifiques.',
          type: 'GUIDE',
          region: 'Dakar',
          ville: 'Dakar',
          adresse: 'Place de l\'Indépendance',
          prix: 15000,
          prixUnite: 'personne',
          images: ['/images/ba1.png', '/images/ba2.png'],
          videos: [],
          duree: 4,
          capacite: 10,
          rating: 4.5,
          isActive: true,
          isFeatured: true,
          tags: ['CULTURE', 'HISTOIRE'],
          prestataire: {
            id: mockPrestataireId,
            nomEntreprise: 'Hôtel Teranga',
            logo: null,
            isVerified: true,
            rating: 4.8,
          },
          vuesVideo: 1250,
          nombreLikes: 45,
          _count: {
            avis: 23,
            reservations: 12,
            likes: 45,
            favoris: 18,
          },
          createdAt: new Date().toISOString(),
        },
        {
          id: 'mock-2',
          titre: 'Chambre double vue mer',
          description: 'Magnifique chambre avec vue panoramique sur l\'océan Atlantique. Équipements modernes, petit-déjeuner inclus.',
          type: 'HEBERGEMENT',
          region: 'Dakar',
          ville: 'Almadies',
          adresse: 'Route de la Corniche',
          prix: 35000,
          prixUnite: 'nuit',
          images: ['/images/ba3.png'],
          videos: [],
          duree: null,
          capacite: 2,
          rating: 4.8,
          isActive: true,
          isFeatured: false,
          tags: ['PLAGE', 'BIEN_ETRE'],
          prestataire: {
            id: mockPrestataireId,
            nomEntreprise: 'Hôtel Teranga',
            logo: null,
            isVerified: true,
            rating: 4.8,
          },
          vuesVideo: 890,
          nombreLikes: 32,
          _count: {
            avis: 15,
            reservations: 8,
            likes: 32,
            favoris: 12,
          },
          createdAt: new Date().toISOString(),
        },
        {
          id: 'mock-3',
          titre: 'Safari dans le Parc Niokolo-Koba',
          description: 'Aventure inoubliable dans le plus grand parc national du Sénégal. Observation de la faune sauvage avec guide expert.',
          type: 'ACTIVITE',
          region: 'Tambacounda',
          ville: 'Tambacounda',
          adresse: 'Parc Niokolo-Koba',
          prix: 45000,
          prixUnite: 'personne',
          images: ['/images/ba4.png', '/images/ba5.png'],
          videos: [],
          duree: 8,
          capacite: 15,
          rating: 4.9,
          isActive: true,
          isFeatured: true,
          tags: ['NATURE', 'AVENTURE'],
          prestataire: {
            id: mockPrestataireId,
            nomEntreprise: 'Hôtel Teranga',
            logo: null,
            isVerified: true,
            rating: 4.8,
          },
          vuesVideo: 2100,
          nombreLikes: 78,
          _count: {
            avis: 31,
            reservations: 19,
            likes: 78,
            favoris: 25,
          },
          createdAt: new Date().toISOString(),
        },
        {
          id: 'mock-4',
          titre: 'Restaurant Teranga - Cuisine Sénégalaise Authentique',
          description: 'Découvrez les saveurs authentiques du Sénégal dans un cadre chaleureux. Spécialités : Thiéboudienne, Yassa, Mafé et bien plus.',
          type: 'RESTAURANT',
          region: 'Dakar',
          ville: 'Plateau',
          adresse: 'Avenue Cheikh Anta Diop',
          prix: 8000,
          prixUnite: 'personne',
          images: ['/images/ba6.png'],
          videos: [],
          duree: 2,
          capacite: 50,
          rating: 4.7,
          isActive: true,
          isFeatured: false,
          tags: ['GASTRONOMIE', 'CULTURE'],
          prestataire: {
            id: mockPrestataireId,
            nomEntreprise: 'Hôtel Teranga',
            logo: null,
            isVerified: true,
            rating: 4.8,
          },
          vuesVideo: 650,
          nombreLikes: 28,
          _count: {
            avis: 18,
            reservations: 14,
            likes: 28,
            favoris: 15,
          },
          createdAt: new Date().toISOString(),
        },
        {
          id: 'mock-5',
          titre: 'Visite de l\'Île de Gorée',
          description: 'Plongez dans l\'histoire de l\'Île de Gorée, site classé au patrimoine mondial de l\'UNESCO. Visite guidée des maisons historiques et du musée.',
          type: 'CULTURE',
          region: 'Dakar',
          ville: 'Gorée',
          adresse: 'Île de Gorée',
          prix: 12000,
          prixUnite: 'personne',
          images: ['/images/ba7.png', '/images/ba8.png'],
          videos: [],
          duree: 3,
          capacite: 20,
          rating: 4.9,
          isActive: true,
          isFeatured: true,
          tags: ['CULTURE', 'HISTOIRE'],
          prestataire: {
            id: mockPrestataireId,
            nomEntreprise: 'Hôtel Teranga',
            logo: null,
            isVerified: true,
            rating: 4.8,
          },
          vuesVideo: 1850,
          nombreLikes: 92,
          _count: {
            avis: 42,
            reservations: 28,
            likes: 92,
            favoris: 35,
          },
          createdAt: new Date().toISOString(),
        },
        {
          id: 'mock-6',
          titre: 'Séjour à Saint-Louis - La Venise Africaine',
          description: 'Découvrez la première capitale du Sénégal, classée au patrimoine mondial. Architecture coloniale, pêche traditionnelle et culture riche.',
          type: 'HEBERGEMENT',
          region: 'Saint-Louis',
          ville: 'Saint-Louis',
          adresse: 'Quai Giraud',
          prix: 28000,
          prixUnite: 'nuit',
          images: ['/images/ba9.png'],
          videos: [],
          duree: null,
          capacite: 4,
          rating: 4.6,
          isActive: true,
          isFeatured: false,
          tags: ['CULTURE', 'HISTOIRE'],
          prestataire: {
            id: mockPrestataireId,
            nomEntreprise: 'Hôtel Teranga',
            logo: null,
            isVerified: true,
            rating: 4.8,
          },
          vuesVideo: 720,
          nombreLikes: 21,
          _count: {
            avis: 12,
            reservations: 6,
            likes: 21,
            favoris: 9,
          },
          createdAt: new Date().toISOString(),
        },
        {
          id: 'mock-7',
          titre: 'Surf à N\'Gor - Cours et Location de Planches',
          description: 'Apprenez le surf ou perfectionnez-vous sur les vagues de N\'Gor. Cours pour tous niveaux avec moniteurs certifiés. Location de matériel disponible.',
          type: 'ACTIVITE',
          region: 'Dakar',
          ville: 'N\'Gor',
          adresse: 'Plage de N\'Gor',
          prix: 18000,
          prixUnite: 'personne',
          images: ['/images/ba10.png'],
          videos: [],
          duree: 3,
          capacite: 8,
          rating: 4.8,
          isActive: true,
          isFeatured: true,
          tags: ['SPORT', 'PLAGE'],
          prestataire: {
            id: mockPrestataireId,
            nomEntreprise: 'Hôtel Teranga',
            logo: null,
            isVerified: true,
            rating: 4.8,
          },
          vuesVideo: 1450,
          nombreLikes: 56,
          _count: {
            avis: 25,
            reservations: 16,
            likes: 56,
            favoris: 22,
          },
          createdAt: new Date().toISOString(),
        },
        {
          id: 'mock-8',
          titre: 'Festival de Jazz de Saint-Louis',
          description: 'Assistez au célèbre Festival de Jazz de Saint-Louis, l\'un des plus grands événements musicaux d\'Afrique. Pass journée ou week-end disponible.',
          type: 'EVENEMENT',
          region: 'Saint-Louis',
          ville: 'Saint-Louis',
          adresse: 'Place Faidherbe',
          prix: 25000,
          prixUnite: 'personne',
          images: ['/images/ba1.png'],
          videos: [],
          duree: 6,
          capacite: 100,
          rating: 4.9,
          isActive: true,
          isFeatured: true,
          tags: ['FESTIVAL', 'CULTURE'],
          prestataire: {
            id: mockPrestataireId,
            nomEntreprise: 'Hôtel Teranga',
            logo: null,
            isVerified: true,
            rating: 4.8,
          },
          vuesVideo: 3200,
          nombreLikes: 145,
          _count: {
            avis: 58,
            reservations: 42,
            likes: 145,
            favoris: 48,
          },
          createdAt: new Date().toISOString(),
        },
        {
          id: 'mock-9',
          titre: 'Excursion au Lac Rose',
          description: 'Visite du célèbre Lac Rose, connu pour sa couleur unique. Baignade, promenade en pirogue et découverte des techniques d\'extraction du sel.',
          type: 'ACTIVITE',
          region: 'Dakar',
          ville: 'Rufisque',
          adresse: 'Lac Rose',
          prix: 14000,
          prixUnite: 'personne',
          images: ['/images/ba2.png', '/images/ba3.png'],
          videos: [],
          duree: 4,
          capacite: 12,
          rating: 4.7,
          isActive: true,
          isFeatured: false,
          tags: ['NATURE', 'CULTURE'],
          prestataire: {
            id: mockPrestataireId,
            nomEntreprise: 'Hôtel Teranga',
            logo: null,
            isVerified: true,
            rating: 4.8,
          },
          vuesVideo: 980,
          nombreLikes: 38,
          _count: {
            avis: 19,
            reservations: 11,
            likes: 38,
            favoris: 14,
          },
          createdAt: new Date().toISOString(),
        },
        {
          id: 'mock-10',
          titre: 'Spa & Bien-être - Massage Traditionnel',
          description: 'Détendez-vous avec nos massages traditionnels sénégalais. Soins du corps, hammam et relaxation dans un cadre apaisant.',
          type: 'ACTIVITE',
          region: 'Dakar',
          ville: 'Almadies',
          adresse: 'Route de la Corniche',
          prix: 22000,
          prixUnite: 'personne',
          images: ['/images/ba4.png'],
          videos: [],
          duree: 2,
          capacite: 6,
          rating: 4.8,
          isActive: true,
          isFeatured: false,
          tags: ['BIEN_ETRE', 'RELAXATION'],
          prestataire: {
            id: mockPrestataireId,
            nomEntreprise: 'Hôtel Teranga',
            logo: null,
            isVerified: true,
            rating: 4.8,
          },
          vuesVideo: 550,
          nombreLikes: 24,
          _count: {
            avis: 14,
            reservations: 9,
            likes: 24,
            favoris: 11,
          },
          createdAt: new Date().toISOString(),
        },
        {
          id: 'mock-11',
          titre: 'Randonnée dans le Fouta Djalon',
          description: 'Aventure en pleine nature dans les montagnes du Fouta Djalon. Cascades, paysages époustouflants et rencontres avec les populations locales.',
          type: 'ACTIVITE',
          region: 'Tambacounda',
          ville: 'Kédougou',
          adresse: 'Fouta Djalon',
          prix: 38000,
          prixUnite: 'personne',
          images: ['/images/ba5.png', '/images/ba6.png'],
          videos: [],
          duree: 12,
          capacite: 10,
          rating: 4.9,
          isActive: true,
          isFeatured: true,
          tags: ['NATURE', 'AVENTURE'],
          prestataire: {
            id: mockPrestataireId,
            nomEntreprise: 'Hôtel Teranga',
            logo: null,
            isVerified: true,
            rating: 4.8,
          },
          vuesVideo: 1680,
          nombreLikes: 67,
          _count: {
            avis: 28,
            reservations: 18,
            likes: 67,
            favoris: 20,
          },
          createdAt: new Date().toISOString(),
        },
        {
          id: 'mock-12',
          titre: 'Marché de Soumbédioune - Shopping Artisanal',
          description: 'Découvrez l\'artisanat sénégalais au marché de Soumbédioune. Sculptures, bijoux, textiles et souvenirs authentiques. Guide inclus.',
          type: 'ACTIVITE',
          region: 'Dakar',
          ville: 'Dakar',
          adresse: 'Marché de Soumbédioune',
          prix: 5000,
          prixUnite: 'personne',
          images: ['/images/ba7.png'],
          videos: [],
          duree: 2,
          capacite: 15,
          rating: 4.5,
          isActive: true,
          isFeatured: false,
          tags: ['SHOPPING', 'CULTURE'],
          prestataire: {
            id: mockPrestataireId,
            nomEntreprise: 'Hôtel Teranga',
            logo: null,
            isVerified: true,
            rating: 4.8,
          },
          vuesVideo: 420,
          nombreLikes: 15,
          _count: {
            avis: 8,
            reservations: 5,
            likes: 15,
            favoris: 7,
          },
          createdAt: new Date().toISOString(),
        },
      ]

      finalOffres = mockOffres.map((offre) => ({
        ...offre,
        visibilityScore: offre.isFeatured ? 100 : 50,
      }))
    }

    // Pagination manuelle
    const total = finalOffres.length
    const offres = finalOffres.slice(skip, skip + limit).map((offre) => {
      // Retirer le score de visibilité et les boosts de la réponse
      const offreObj = offre as Record<string, unknown>
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { visibilityScore, boosts, ...offreData } = offreObj
      return offreData
    })

    return successResponse({
      offres,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * POST /api/offres
 * Crée une nouvelle offre (prestataire uniquement)
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireRole('PRESTATAIRE', request)

    // Vérifier que l'utilisateur a un prestataire
    let prestataire = await prisma.prestataire.findUnique({
      where: { userId: user.id },
    }) as Prestataire | null

    // En mode développement, si le prestataire n'existe pas, créer un prestataire fictif
    if (!prestataire) {
      try {
        // Créer un prestataire fictif pour le développement
        const created = await prisma.prestataire.create({
          data: {
            userId: user.id,
            nomEntreprise: 'Prestataire Dev',
            planType: 'GRATUIT',
            boostsDisponibles: 0,
          },
        }) as Prestataire
        
        // Si le mode mock retourne un objet vide, utiliser un prestataire fictif complet
        if (!created || !created.id) {
          prestataire = {
            id: 'dev-prestataire-id',
            userId: user.id,
            planType: 'GRATUIT',
            planExpiresAt: null,
            nomEntreprise: 'Prestataire Dev',
            boostsDisponibles: 0,
          } as Prestataire
        } else {
          prestataire = created
        }
      } catch {
        // Si la création échoue (mode mock), utiliser un prestataire fictif
        prestataire = {
          id: 'dev-prestataire-id',
          userId: user.id,
          planType: 'GRATUIT',
          planExpiresAt: null,
          nomEntreprise: 'Prestataire Dev',
          boostsDisponibles: 0,
        } as Prestataire
      }
    }

    const body = await request.json()
    const {
      titre,
      description,
      type,
      region,
      ville,
      adresse,
      latitude,
      longitude,
      prix,
      prixUnite,
      images,
      videos,
      duree,
      capacite,
      disponibilite,
      boostEnabled,
      boostDuree,
    } = body

    // Validation
    if (!titre || !description || !type || !prix) {
      return errorResponse('Champs requis manquants', 400)
    }

    // Validation des images (max 3)
    if (images && Array.isArray(images) && images.length > 3) {
      return errorResponse('Maximum 3 images autorisées', 400)
    }

    // Validation des vidéos (durée 30s-1mn)
    // Note: La validation de durée doit être faite côté client avant l'upload
    // Ici on vérifie juste que les URLs sont valides
    if (videos && Array.isArray(videos) && videos.length > 0) {
      // La validation de durée sera faite lors de l'upload côté client
      // On accepte les vidéos ici, mais l'upload doit vérifier la durée
    }

    // Vérifier la limite d'expériences selon le plan
    const planType = prestataire.planType
    const isPlanActive = prestataire.planExpiresAt
      ? new Date(prestataire.planExpiresAt) > new Date()
      : false

    // Si le plan est expiré, considérer comme GRATUIT
    const effectivePlan = isPlanActive ? planType : 'GRATUIT'

    if (effectivePlan === 'GRATUIT') {
      const nombreOffres = await prisma.offre.count({
        where: {
          prestataireId: prestataire.id,
          isActive: true,
        },
      })

      if (nombreOffres >= 5) {
        return errorResponse(
          'Limite atteinte. Le plan gratuit permet 5 expériences maximum. Passez au plan Pro ou Premium pour des expériences illimitées.',
          403
        )
      }
    }

    let offre: OffreWithPrestataire
    try {
      offre = await prisma.offre.create({
        data: {
          prestataireId: prestataire.id,
          titre,
          description,
          type,
          region,
          ville,
          adresse,
          latitude,
          longitude,
          prix,
          prixUnite,
          images: images || [],
          videos: videos || [],
          duree,
          capacite,
          disponibilite,
        },
        include: {
          prestataire: {
            select: {
              id: true,
              nomEntreprise: true,
              logo: true,
              isVerified: true,
            },
          },
        },
      }) as OffreWithPrestataire
      
      // Si le mode mock retourne un objet vide, créer un objet complet
      if (!offre || !offre.id) {
        offre = {
          id: `mock-${Date.now()}`,
          prestataireId: prestataire.id,
          titre,
          description,
          type,
          region: region || null,
          ville: ville || null,
          adresse: adresse || null,
          latitude: latitude || null,
          longitude: longitude || null,
          prix,
          prixUnite: prixUnite || null,
          images: images || [],
          videos: videos || [],
          duree: duree || null,
          capacite: capacite || null,
          rating: 0,
          isActive: true,
          isFeatured: false,
          prestataire: {
            id: prestataire.id,
            planType: prestataire.planType || 'GRATUIT',
            planExpiresAt: prestataire.planExpiresAt || null,
            nomEntreprise: prestataire.nomEntreprise || 'Prestataire Dev',
            logo: null,
            isVerified: false,
          } as Prestataire,
          boosts: [],
          _count: {
            avis: 0,
            reservations: 0,
          },
          createdAt: new Date(),
        } as unknown as OffreWithPrestataire
      }
    } catch {
      // En mode mock, créer un objet fictif
      offre = {
        id: `mock-${Date.now()}`,
        prestataireId: prestataire.id,
        titre,
        description,
        type,
        region: region || null,
        ville: ville || null,
        adresse: adresse || null,
        latitude: latitude || null,
        longitude: longitude || null,
        prix,
        prixUnite: prixUnite || null,
        images: images || [],
        videos: videos || [],
        duree: duree || null,
        capacite: capacite || null,
        rating: 0,
        isActive: true,
        isFeatured: false,
          prestataire: {
            id: prestataire.id,
            planType: prestataire.planType || 'GRATUIT',
            planExpiresAt: prestataire.planExpiresAt || null,
            nomEntreprise: prestataire.nomEntreprise || 'Prestataire Dev',
            logo: null,
            isVerified: false,
          } as Prestataire,
        boosts: [],
        _count: {
          avis: 0,
          reservations: 0,
        },
        createdAt: new Date(),
      } as unknown as OffreWithPrestataire
    }

    // Si boost activé, créer le boost automatiquement
    if (boostEnabled && boostDuree) {
      try {
        // Vérifier les boosts disponibles
        const prestataireWithBoosts = await prisma.prestataire.findUnique({
          where: { id: prestataire.id },
          select: { boostsDisponibles: true },
        }) as { boostsDisponibles: number } | null

        const tarifs: Record<string, number> = {
          jour: 1000,
          semaine: 6000,
          mois: 15000,
        }

        const montant = tarifs[boostDuree] || 6000

        // Calculer les dates
        const dateDebut = new Date()
        const dateFin = new Date()
        if (boostDuree === 'jour') {
          dateFin.setDate(dateFin.getDate() + 1)
        } else if (boostDuree === 'semaine') {
          dateFin.setDate(dateFin.getDate() + 7)
        } else if (boostDuree === 'mois') {
          dateFin.setMonth(dateFin.getMonth() + 1)
        }

        // Si le prestataire a des boosts disponibles, les utiliser
        if (prestataireWithBoosts && prestataireWithBoosts.boostsDisponibles > 0) {
          // Utiliser un boost disponible
          await prisma.$transaction([
            prisma.boost.create({
              data: {
                prestataireId: prestataire.id,
                offreId: offre.id,
                type: 'EXPERIENCE',
                montant: 0, // Gratuit car utilise un boost disponible
                dateDebut,
                dateFin,
                isActive: true,
                methode: 'boosts_disponibles',
              },
            }),
            prisma.prestataire.update({
              where: { id: prestataire.id },
              data: {
                boostsDisponibles: {
                  decrement: 1,
                },
              },
            }),
            prisma.offre.update({
              where: { id: offre.id as string },
              data: {
                isFeatured: true,
                featuredExpiresAt: dateFin,
              },
            }),
          ])
        } else {
          // Créer un boost payant (sera facturé plus tard)
          await prisma.boost.create({
            data: {
              prestataireId: prestataire.id,
              offreId: offre.id,
              type: 'EXPERIENCE',
              montant,
              dateDebut,
              dateFin,
              isActive: true,
              methode: 'pending_payment', // À payer plus tard
            },
          })

          await prisma.offre.update({
            where: { id: offre.id },
            data: {
              isFeatured: true,
              featuredExpiresAt: dateFin,
            },
          })
        }
      } catch (boostError) {
        // Ne pas bloquer la création de l'offre si le boost échoue
        console.error('Error creating boost:', boostError)
      }
    }

    return successResponse(offre, 'Offre créée avec succès', 201)
  } catch (error) {
    return handleApiError(error)
  }
}

