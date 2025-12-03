// Type pour le client Prisma mock
type MockPrismaClient = {
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
    create: (args: unknown) => Promise<unknown>
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
  $disconnect: () => Promise<void>
}

// Client Prisma mock pour le développement
// Note: En mode mock, nous retournons simplement les valeurs passées pour create/update
// et null pour findUnique pour éviter de créer des utilisateurs fantômes
const mockPrismaClient: MockPrismaClient = {
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
    create: async () => ({}),
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

