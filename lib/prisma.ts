// Type pour le client Prisma mock
type MockPrismaClient = {
  $transaction(arg0: Promise<unknown>[]): unknown
  user: {
    findUnique: (args: unknown) => Promise<unknown>
    findMany: () => Promise<unknown[]>
    count: (args?: unknown) => Promise<number>
    create: (args: unknown) => Promise<{ id: string; email: string; role: string }>
    update: (args: unknown) => Promise<{ id: string; email: string; role: string }>
    delete: (args: unknown) => Promise<unknown>
  }
  prestataire: {
    findUnique: (args: unknown) => Promise<unknown>
    findMany: () => Promise<unknown[]>
    count: (args?: unknown) => Promise<number>
    create: (args: unknown) => Promise<unknown>
    update: (args: unknown) => Promise<unknown>
    groupBy: (args: unknown) => Promise<unknown[]>
  }
  offre: {
    findUnique: (args: unknown) => Promise<unknown>
    findMany: () => Promise<unknown[]>
    count: (args?: unknown) => Promise<number>
    create: (args: unknown) => Promise<unknown>
    update: (args: unknown) => Promise<unknown>
    updateMany: (args: unknown) => Promise<{ count: number }>
    delete: (args: unknown) => Promise<unknown>
    groupBy: (args: unknown) => Promise<unknown[]>
  }
  reservation: {
    findMany: () => Promise<unknown[]>
    findUnique: (args: unknown) => Promise<unknown>
    count: (args?: unknown) => Promise<number>
    create: (args: unknown) => Promise<unknown>
    update: (args: unknown) => Promise<unknown>
    groupBy: (args: unknown) => Promise<unknown[]>
  }
  paiement: {
    findUnique: (args: unknown) => Promise<unknown>
    upsert: (args: unknown) => Promise<unknown>
    update: (args: unknown) => Promise<unknown>
    aggregate: (args: unknown) => Promise<{ _sum: { montant: number | null } }>
  }
  abonnement: {
    findFirst: (args: unknown) => Promise<unknown>
    findMany: () => Promise<unknown[]>
    create: (args: unknown) => Promise<unknown>
    update: (args: unknown) => Promise<unknown>
    updateMany: (args: unknown) => Promise<unknown>
    aggregate: (args: unknown) => Promise<{ _sum: { montant: number | null } }>
    groupBy: (args: unknown) => Promise<unknown[]>
  }
  boost: {
    findMany: (args?: unknown) => Promise<unknown[]>
    create: (args: unknown) => Promise<unknown>
    aggregate: (args: unknown) => Promise<{ _sum: { montant: number | null } }>
  }
  notification: {
    findMany: (args?: unknown) => Promise<unknown[]>
    count: (args?: unknown) => Promise<number>
    create: (args: unknown) => Promise<unknown>
    update: (args: unknown) => Promise<unknown>
    updateMany: (args: unknown) => Promise<{ count: number }>
    delete: (args: unknown) => Promise<unknown>
    deleteMany: (args?: unknown) => Promise<{ count: number }>
  }
  avis: {
    findUnique: (args: unknown) => Promise<unknown>
    findMany: (args?: unknown) => Promise<unknown[]>
    create: (args: unknown) => Promise<unknown>
  },
  favori: {
    findUnique: (args: unknown) => Promise<unknown>
    findMany: (args?: unknown) => Promise<unknown[]>
    count: (args?: unknown) => Promise<number>
    create: (args: unknown) => Promise<unknown>
    upsert: (args: unknown) => Promise<unknown>
    delete: (args: unknown) => Promise<unknown>
  },
  depense: {
    findUnique: (args: unknown) => Promise<unknown>
    findMany: (args?: unknown) => Promise<unknown[]>
    count: (args?: unknown) => Promise<number>
    create: (args: unknown) => Promise<unknown>
    update: (args: unknown) => Promise<unknown>
    delete: (args: unknown) => Promise<unknown>
  },
  $disconnect: () => Promise<void>
}

// Client Prisma mock pour le développement
// Note: En mode mock, nous retournons simplement les valeurs passées pour create/update
// et null pour findUnique pour éviter de créer des utilisateurs fantômes
const mockPrismaClient: MockPrismaClient = {
  $transaction: async (operations: Promise<unknown>[]) => {
    return Promise.all(operations);
  },
  user: {
    findUnique: async () => null,
    findMany: async () => [],
    count: async () => 0,
    create: async (args: unknown) => {
      // En mode mock, retourner les vraies valeurs passées au lieu de mock@example.com
      if (!args || typeof args !== 'object' || !('data' in args)) {
        return { id: 'mock-id', email: 'mock@example.com', role: 'ADMIN' }
      }
      const data = args.data as { id?: string; email?: string; role?: string; [key: string]: unknown }
      const select = 'select' in args ? (args.select as Record<string, boolean> | undefined) : undefined
      
      // Créer un objet utilisateur avec les vraies valeurs
      const user: Record<string, unknown> = {
        id: data.id || 'mock-id',
        email: data.email || 'unknown@example.com',
        role: data.role || 'USER',
        ...data,
      }
      
      // Si un select est spécifié, filtrer les champs
      if (select) {
        const filtered: Record<string, unknown> = {}
        for (const key in select) {
          if (select[key] && key in user) {
            filtered[key] = user[key]
          }
        }
        return filtered as { id: string; email: string; role: string }
      }
      
      return user as { id: string; email: string; role: string }
    },
    update: async (args: unknown) => {
      // En mode mock, retourner les vraies valeurs passées
      if (!args || typeof args !== 'object' || !('data' in args)) {
        return { id: 'mock-id', email: 'mock@example.com', role: 'ADMIN' }
      }
      const data = args.data as { id?: string; email?: string; role?: string; [key: string]: unknown }
      const select = 'select' in args ? (args.select as Record<string, boolean> | undefined) : undefined
      
      const user: Record<string, unknown> = {
        id: data.id || 'mock-id',
        email: data.email || 'mock@example.com',
        role: data.role || 'USER',
        ...data,
      }
      
      if (select) {
        const filtered: Record<string, unknown> = {}
        for (const key in select) {
          if (select[key] && key in user) {
            filtered[key] = user[key]
          }
        }
        return filtered as { id: string; email: string; role: string }
      }
      
      return user as { id: string; email: string; role: string }
    },
    delete: async () => ({}),
  },
  prestataire: {
    findUnique: async () => null,
    findMany: async () => [],
    count: async () => 0,
    create: async () => ({}),
    update: async () => ({}),
    groupBy: async () => [],
  },
  offre: {
    findUnique: async () => null,
    findMany: async () => [],
    count: async () => 0,
    create: async () => ({}),
    update: async () => ({}),
    updateMany: async () => ({ count: 0 }),
    delete: async () => ({}),
    groupBy: async () => [],
  },
  reservation: {
    findMany: async () => [],
    findUnique: async () => null,
    count: async () => 0,
    create: async () => ({}),
    update: async () => ({}),
    groupBy: async () => [],
  },
  paiement: {
    findUnique: async () => null,
    upsert: async () => ({}),
    update: async () => ({}),
    aggregate: async () => ({ _sum: { montant: null } }),
  },
  abonnement: {
    findFirst: async () => null,
    findMany: async () => [],
    create: async () => ({}),
    update: async () => ({}),
    updateMany: async () => ({}),
    aggregate: async () => ({ _sum: { montant: null } }),
    groupBy: async () => [],
  },
  boost: {
    findMany: async () => [],
    create: async () => ({}),
    aggregate: async () => ({ _sum: { montant: null } }),
  },
  notification: {
    findMany: async (args?: unknown) => {
      // Données mockées pour les notifications admin (déjà triées par date décroissante)
      const baseNotifications = [
        {
          id: 'notif-1',
          userId: null,
          prestataireId: null,
          type: 'system',
          titre: 'Nouveau prestataire en attente',
          message: 'Un nouveau prestataire "Aventures Sénégal" a soumis une demande de validation.',
          lien: '/dashboard/admin/prestataires?statut=pending',
          isRead: false,
          createdAt: new Date(Date.now() - 5 * 60 * 1000), // Il y a 5 minutes
        },
        {
          id: 'notif-2',
          userId: null,
          prestataireId: null,
          type: 'system',
          titre: 'Activité signalée',
          message: 'L\'activité "Safari dans le Delta du Saloum" a été signalée par un utilisateur.',
          lien: '/dashboard/admin/activites',
          isRead: false,
          createdAt: new Date(Date.now() - 15 * 60 * 1000), // Il y a 15 minutes
        },
        {
          id: 'notif-3',
          userId: null,
          prestataireId: null,
          type: 'system',
          titre: 'Nouvelle réservation',
          message: 'Une nouvelle réservation a été effectuée pour "Excursion à Gorée".',
          lien: '/dashboard/admin/reservations',
          isRead: true,
          createdAt: new Date(Date.now() - 30 * 60 * 1000), // Il y a 30 minutes
        },
        {
          id: 'notif-4',
          userId: null,
          prestataireId: null,
          type: 'system',
          titre: 'Paiement reçu',
          message: 'Un paiement de 25 000 FCFA a été reçu pour la réservation #RES-2024-001.',
          lien: '/dashboard/admin/paiements',
          isRead: true,
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // Il y a 1 heure
        },
        {
          id: 'notif-5',
          userId: null,
          prestataireId: null,
          type: 'system',
          titre: 'Nouveau membre inscrit',
          message: 'Un nouveau membre "Mamadou Diallo" s\'est inscrit sur la plateforme.',
          lien: '/dashboard/admin/membres',
          isRead: false,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // Il y a 2 heures
        },
        {
          id: 'notif-6',
          userId: null,
          prestataireId: null,
          type: 'system',
          titre: 'Avis en attente de modération',
          message: 'Un nouvel avis a été soumis pour "Randonnée dans le Fouta Djalon" et nécessite une modération.',
          lien: '/dashboard/admin/avis',
          isRead: true,
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // Il y a 3 heures
        },
        {
          id: 'notif-7',
          userId: null,
          prestataireId: null,
          type: 'system',
          titre: 'Compte prestataire suspendu',
          message: 'Le compte prestataire "Tours & Travel" a été suspendu automatiquement après 3 signalements.',
          lien: '/dashboard/admin/prestataires',
          isRead: false,
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // Il y a 4 heures
        },
        {
          id: 'notif-8',
          userId: null,
          prestataireId: null,
          type: 'system',
          titre: 'Rapport mensuel disponible',
          message: 'Le rapport mensuel de novembre 2024 est maintenant disponible.',
          lien: '/dashboard/admin/rapports',
          isRead: true,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Il y a 1 jour
        },
      ]

      // Créer une copie pour éviter de muter l'original
      let result = [...baseNotifications]

      // Appliquer le tri si demandé
      if (args && typeof args === 'object' && 'orderBy' in args) {
        const orderBy = args.orderBy as { createdAt?: string }
        if (orderBy?.createdAt === 'desc') {
          result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        } else if (orderBy?.createdAt === 'asc') {
          result.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        }
      } else {
        // Par défaut, trier par date décroissante (plus récentes en premier)
        result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      }

      // Appliquer la limite si demandée
      if (args && typeof args === 'object' && 'take' in args) {
        const take = args.take as number
        if (typeof take === 'number' && take > 0) {
          result = result.slice(0, take)
        }
      }

      return result
    },
    count: async (args?: unknown) => {
      const mockNotifications = [
        { id: 'notif-1', isRead: false },
        { id: 'notif-2', isRead: false },
        { id: 'notif-3', isRead: true },
        { id: 'notif-4', isRead: true },
        { id: 'notif-5', isRead: false },
        { id: 'notif-6', isRead: true },
        { id: 'notif-7', isRead: false },
        { id: 'notif-8', isRead: true },
      ]

      if (args && typeof args === 'object' && 'where' in args) {
        const where = args.where as { isRead?: boolean }
        if (where?.isRead === false) {
          return mockNotifications.filter(n => !n.isRead).length
        }
      }

      return mockNotifications.length
    },
    create: async (args: unknown) => {
      if (!args || typeof args !== 'object' || !('data' in args)) {
        return {}
      }
      const data = args.data as Record<string, unknown>
      return {
        id: `notif-${Date.now()}`,
        ...data,
        createdAt: new Date(),
      }
    },
    update: async (args: unknown) => {
      if (!args || typeof args !== 'object' || !('data' in args)) {
        return {}
      }
      const data = args.data as Record<string, unknown>
      return {
        id: 'notif-1',
        ...data,
      }
    },
    updateMany: async (args: unknown) => {
      if (!args || typeof args !== 'object' || !('where' in args)) {
        return { count: 0 }
      }
      const where = args.where as { isRead?: boolean }
      // Simuler la mise à jour de toutes les notifications non lues
      if (where?.isRead === false) {
        return { count: 4 } // 4 notifications non lues dans les données mockées
      }
      return { count: 0 }
    },
    delete: async (args: unknown) => {
      if (!args || typeof args !== 'object' || !('where' in args)) {
        return {}
      }
      return {}
    },
    deleteMany: async (args?: unknown) => {
      return { count: 0 }
    },
  },
  avis: {
    findUnique: async () => null,
    findMany: async () => [],
    create: async () => ({}),
  },
  favori: {
    findUnique: async () => null,
    findMany: async () => [],
    count: async () => 0,
    create: async () => ({}),
    upsert: async () => ({}),
    delete: async () => ({}),
  },
  depense: {
    findUnique: async () => null,
    findMany: async () => [],
    count: async () => 0,
    create: async (args: unknown) => {
      if (!args || typeof args !== 'object' || !('data' in args)) {
        return {}
      }
      const data = args.data as Record<string, unknown>
      return {
        id: 'mock-depense-id',
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    },
    update: async (args: unknown) => {
      if (!args || typeof args !== 'object' || !('data' in args)) {
        return {}
      }
      const data = args.data as Record<string, unknown>
      return {
        id: 'mock-depense-id',
        ...data,
        updatedAt: new Date(),
      }
    },
    delete: async () => ({}),
  },
  $disconnect: async () => {},
}

// En développement, créer un client Prisma mock si DATABASE_URL n'est pas configuré
function createPrismaClient(): MockPrismaClient {
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  if (isDevelopment && !process.env.DATABASE_URL) {
    console.warn('DATABASE_URL not configured, using mock Prisma client in development')
    return mockPrismaClient
  }

  // Essayer d'importer PrismaClient, sinon utiliser le mock
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaClient } = require('@prisma/client')
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    }) as unknown as MockPrismaClient
  } catch {
    console.warn('PrismaClient not available, using mock client')
    return mockPrismaClient
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: MockPrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

