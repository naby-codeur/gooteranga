/**
 * Script pour créer un utilisateur administrateur
 * 
 * Usage:
 *   npx tsx scripts/seed-admin.ts
 * 
 * Ou avec ts-node:
 *   npx ts-node scripts/seed-admin.ts
 */

import { prisma } from '../lib/prisma'

type UserWithRole = {
  id: string
  email: string
  nom: string
  prenom: string | null
  role: 'USER' | 'PRESTATAIRE' | 'ADMIN'
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@gooteranga.com'
const ADMIN_NOM = process.env.ADMIN_NOM || 'Admin'
const ADMIN_PRENOM = process.env.ADMIN_PRENOM || 'GooTeranga'

async function createAdmin() {
  try {
    console.log('🔍 Vérification de l\'existence d\'un admin...')
    
    // Vérifier si un admin existe déjà
    const existingAdmin = await prisma.user.findUnique({
      where: { email: ADMIN_EMAIL },
      select: {
        id: true,
        email: true,
        nom: true,
        prenom: true,
        role: true,
      },
    }) as UserWithRole | null

    if (existingAdmin) {
      if (existingAdmin.role === 'ADMIN') {
        console.log('✅ Un administrateur existe déjà avec cet email:', ADMIN_EMAIL)
        console.log('   ID:', existingAdmin.id)
        console.log('   Nom:', existingAdmin.nom)
        console.log('   Rôle:', existingAdmin.role)
        return
      } else {
        // Mettre à jour le rôle si l'utilisateur existe mais n'est pas admin
        console.log('🔄 Mise à jour du rôle en ADMIN...')
        const updated = await prisma.user.update({
          where: { email: ADMIN_EMAIL },
          data: { role: 'ADMIN' },
          select: {
            id: true,
            email: true,
            nom: true,
            prenom: true,
            role: true,
          },
        }) as UserWithRole
        console.log('✅ Rôle mis à jour avec succès!')
        console.log('   ID:', updated.id)
        console.log('   Email:', updated.email)
        console.log('   Rôle:', updated.role)
        return
      }
    }

    // Créer un nouvel admin
    console.log('📝 Création d\'un nouvel administrateur...')
    const admin = await prisma.user.create({
      data: {
        email: ADMIN_EMAIL,
        nom: ADMIN_NOM,
        prenom: ADMIN_PRENOM,
        role: 'ADMIN',
      },
      select: {
        id: true,
        email: true,
        nom: true,
        prenom: true,
        role: true,
      },
    }) as UserWithRole

    console.log('✅ Administrateur créé avec succès!')
    console.log('   ID:', admin.id)
    console.log('   Email:', admin.email)
    console.log('   Nom:', admin.nom, admin.prenom || '')
    console.log('   Rôle:', admin.role)
    console.log('')
    console.log('⚠️  IMPORTANT: Vous devez aussi créer cet utilisateur dans Supabase Auth!')
    console.log('   1. Allez dans Supabase > Authentication > Users')
    console.log('   2. Cliquez sur "Add user" > "Create new user"')
    console.log('   3. Email:', `${ADMIN_EMAIL.split('@')[0]}+admin@${ADMIN_EMAIL.split('@')[1]}`)
    console.log('      (Email virtuel avec suffixe +admin)')
    console.log('   4. Cochez "Auto Confirm User"')
    console.log('   5. Créez un mot de passe')
    console.log('')
    console.log('   Pour vous connecter:')
    console.log('   - Email réel:', ADMIN_EMAIL)
    console.log('   - Sélectionnez "Prestataire" dans le sélecteur de type de compte')
    console.log('   - Mot de passe: celui créé dans Supabase')
    console.log('')
    console.log('Ensuite, connectez-vous sur http://localhost:3000/fr/login')
    console.log('Et accédez à http://localhost:3000/fr/dashboard/admin')
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'admin:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Exécuter le script
createAdmin()

