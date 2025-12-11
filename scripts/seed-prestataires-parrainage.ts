/**
 * Script pour créer des données fictives de prestataires avec parrainage
 * 
 * Usage:
 *   npx tsx scripts/seed-prestataires-parrainage.ts
 * 
 * Ou avec ts-node:
 *   npx ts-node scripts/seed-prestataires-parrainage.ts
 */

import { prisma } from '../lib/prisma'
import { generateReferralCode } from '../lib/utils/referral'
import { REFERRAL_POINTS } from '../lib/utils/referral'

// Types de prestataires
const PRESTATAIRE_TYPES = [
  'HOTEL',
  'RESIDENCE',
  'AUBERGE',
  'TRANSPORT',
  'GUIDE',
  'AGENCE',
  'RESTAURANT',
  'ARTISAN',
  'ASSOCIATION',
  'AUTRE',
] as const

// Données fictives de prestataires
const PRESTATAIRES_DATA = [
  {
    nom: 'Diallo',
    prenom: 'Amadou',
    email: 'amadou.diallo@example.com',
    nomEntreprise: 'Hôtel Teranga Excellence',
    type: 'HOTEL' as const,
    description: 'Hôtel 4 étoiles au cœur de Dakar avec vue sur l\'océan',
    ville: 'Dakar',
    region: 'Dakar',
    telephone: '+221 77 123 4567',
    isVerified: true,
    planType: 'PREMIUM' as const,
  },
  {
    nom: 'Ndiaye',
    prenom: 'Fatou',
    email: 'fatou.ndiaye@example.com',
    nomEntreprise: 'Safari Nature Sénégal',
    type: 'AGENCE' as const,
    description: 'Agence de voyage spécialisée dans l\'écotourisme',
    ville: 'Thiès',
    region: 'Thiès',
    telephone: '+221 77 234 5678',
    isVerified: true,
    planType: 'PRO' as const,
  },
  {
    nom: 'Ba',
    prenom: 'Moussa',
    email: 'moussa.ba@example.com',
    nomEntreprise: 'Restaurant Le Baobab',
    type: 'RESTAURANT' as const,
    description: 'Cuisine sénégalaise traditionnelle et moderne',
    ville: 'Saint-Louis',
    region: 'Saint-Louis',
    telephone: '+221 77 345 6789',
    isVerified: true,
    planType: 'GRATUIT' as const,
  },
  {
    nom: 'Sall',
    prenom: 'Aissatou',
    email: 'aissatou.sall@example.com',
    nomEntreprise: 'Guide Touristique Dakar',
    type: 'GUIDE' as const,
    description: 'Guide professionnel certifié pour visites culturelles',
    ville: 'Dakar',
    region: 'Dakar',
    telephone: '+221 77 456 7890',
    isVerified: true,
    planType: 'PRO' as const,
  },
  {
    nom: 'Diop',
    prenom: 'Ibrahima',
    email: 'ibrahima.diop@example.com',
    nomEntreprise: 'Plage Paradise Resort',
    type: 'RESIDENCE' as const,
    description: 'Résidence de vacances face à la mer',
    ville: 'Saly',
    region: 'Thiès',
    telephone: '+221 77 567 8901',
    isVerified: true,
    planType: 'PREMIUM' as const,
  },
  {
    nom: 'Fall',
    prenom: 'Mariama',
    email: 'mariama.fall@example.com',
    nomEntreprise: 'Auberge Casamance',
    type: 'AUBERGE' as const,
    description: 'Auberge authentique au cœur de la Casamance',
    ville: 'Ziguinchor',
    region: 'Ziguinchor',
    telephone: '+221 77 678 9012',
    isVerified: true,
    planType: 'GRATUIT' as const,
  },
  {
    nom: 'Thiam',
    prenom: 'Ousmane',
    email: 'ousmane.thiam@example.com',
    nomEntreprise: 'Transport Teranga',
    type: 'TRANSPORT' as const,
    description: 'Service de transport touristique confortable',
    ville: 'Dakar',
    region: 'Dakar',
    telephone: '+221 77 789 0123',
    isVerified: true,
    planType: 'PRO' as const,
  },
  {
    nom: 'Kane',
    prenom: 'Aminata',
    email: 'aminata.kane@example.com',
    nomEntreprise: 'Artisanat Sénégalais',
    type: 'ARTISAN' as const,
    description: 'Boutique d\'artisanat local et souvenirs',
    ville: 'Thiès',
    region: 'Thiès',
    telephone: '+221 77 890 1234',
    isVerified: true,
    planType: 'GRATUIT' as const,
  },
  {
    nom: 'Cissé',
    prenom: 'Modou',
    email: 'modou.cisse@example.com',
    nomEntreprise: 'Association Tourisme Durable',
    type: 'ASSOCIATION' as const,
    description: 'Promotion du tourisme durable et responsable',
    ville: 'Fatick',
    region: 'Fatick',
    telephone: '+221 77 901 2345',
    isVerified: true,
    planType: 'PRO' as const,
  },
  {
    nom: 'Seck',
    prenom: 'Khadija',
    email: 'khadija.seck@example.com',
    nomEntreprise: 'Hôtel Sine Saloum',
    type: 'HOTEL' as const,
    description: 'Hôtel écologique au bord du delta',
    ville: 'Foundiougne',
    region: 'Fatick',
    telephone: '+221 77 012 3456',
    isVerified: true,
    planType: 'PREMIUM' as const,
  },
]

// Structure de parrainage : [parrainIndex, filleulIndex, événements]
const PARRAINAGES = [
  // Parrain 0 (Hôtel Teranga Excellence) parraine 3 filleuls
  [0, 1, ['INSCRIPTION_VALIDEE', 'PREMIERE_OFFRE_PUBLIEE', 'RESERVATION_EFFECTUEE']], // Safari Nature
  [0, 2, ['INSCRIPTION_VALIDEE', 'PREMIERE_OFFRE_PUBLIEE', 'RESERVATION_EFFECTUEE', 'RESERVATION_EFFECTUEE', 'ABONNEMENT_PREMIUM']], // Restaurant Le Baobab
  [0, 3, ['INSCRIPTION_VALIDEE', 'PREMIERE_OFFRE_PUBLIEE']], // Guide Touristique
  
  // Parrain 1 (Safari Nature) parraine 2 filleuls
  [1, 4, ['INSCRIPTION_VALIDEE', 'PREMIERE_OFFRE_PUBLIEE', 'RESERVATION_EFFECTUEE']], // Plage Paradise
  [1, 5, ['INSCRIPTION_VALIDEE']], // Auberge Casamance
  
  // Parrain 2 (Restaurant Le Baobab) parraine 2 filleuls
  [2, 6, ['INSCRIPTION_VALIDEE', 'PREMIERE_OFFRE_PUBLIEE', 'RESERVATION_EFFECTUEE']], // Transport Teranga
  [2, 7, ['INSCRIPTION_VALIDEE', 'PREMIERE_OFFRE_PUBLIEE']], // Artisanat Sénégalais
  
  // Parrain 3 (Guide Touristique) parraine 1 filleul
  [3, 8, ['INSCRIPTION_VALIDEE', 'PREMIERE_OFFRE_PUBLIEE', 'RESERVATION_EFFECTUEE']], // Association Tourisme
  
  // Parrain 4 (Plage Paradise) parraine 1 filleul
  [4, 9, ['INSCRIPTION_VALIDEE', 'PREMIERE_OFFRE_PUBLIEE', 'RESERVATION_EFFECTUEE', 'ABONNEMENT_PREMIUM']], // Hôtel Sine Saloum
]

async function seedPrestatairesParrainage() {
  try {
    console.log('🌱 Début du seed des prestataires avec parrainage...\n')

    // Créer les utilisateurs et prestataires
    const prestatairesCrees: Array<{ id: string; userId: string; codeParrain: string }> = []

    for (const data of PRESTATAIRES_DATA) {
      // Vérifier si l'utilisateur existe déjà
      let user = await prisma.user.findFirst({
        where: {
          email: data.email,
          role: 'PRESTATAIRE',
        },
      })

      if (!user) {
        // Créer l'utilisateur
        user = await prisma.user.create({
          data: {
            email: data.email,
            nom: data.nom,
            prenom: data.prenom,
            role: 'PRESTATAIRE',
            isActive: true,
          },
        })
        console.log(`✅ Utilisateur créé: ${data.nom} ${data.prenom}`)
      } else {
        console.log(`ℹ️  Utilisateur existant: ${data.nom} ${data.prenom}`)
      }

      // Vérifier si le prestataire existe déjà
      let prestataire = await prisma.prestataire.findUnique({
        where: { userId: user.id },
      })

      if (!prestataire) {
        // Générer un code parrain unique
        let codeParrain = generateReferralCode()
        let codeExists = await prisma.prestataire.findUnique({
          where: { codeParrain },
        })

        // S'assurer que le code est unique
        while (codeExists) {
          codeParrain = generateReferralCode()
          codeExists = await prisma.prestataire.findUnique({
            where: { codeParrain },
          })
        }

        // Créer le prestataire
        prestataire = await prisma.prestataire.create({
          data: {
            userId: user.id,
            type: data.type,
            nomEntreprise: data.nomEntreprise,
            description: data.description,
            ville: data.ville,
            region: data.region,
            telephone: data.telephone,
            email: data.email,
            isVerified: data.isVerified,
            planType: data.planType,
            codeParrain,
            points: 0,
            boostsDisponibles: 0,
            solde: 0,
            rating: Math.random() * 2 + 3, // Rating entre 3 et 5
            nombreAvis: Math.floor(Math.random() * 50),
          },
        })
        console.log(`✅ Prestataire créé: ${data.nomEntreprise} (Code: ${codeParrain})`)
      } else {
        console.log(`ℹ️  Prestataire existant: ${data.nomEntreprise} (Code: ${prestataire.codeParrain})`)
      }

      prestatairesCrees.push({
        id: prestataire.id,
        userId: user.id,
        codeParrain: prestataire.codeParrain,
      })
    }

    console.log('\n📊 Création des relations de parrainage...\n')

    // Créer les relations de parrainage
    for (const [parrainIdx, filleulIdx, evenements] of PARRAINAGES) {
      const parrain = prestatairesCrees[parrainIdx]
      const filleul = prestatairesCrees[filleulIdx]

      if (!parrain || !filleul) {
        console.warn(`⚠️  Index invalide: parrain=${parrainIdx}, filleul=${filleulIdx}`)
        continue
      }

      // Vérifier si le parrainage existe déjà
      const existingReferral = await prisma.referral.findUnique({
        where: {
          parrainId_filleulId: {
            parrainId: parrain.id,
            filleulId: filleul.id,
          },
        },
      })

      if (existingReferral) {
        console.log(`ℹ️  Parrainage existant: ${PRESTATAIRES_DATA[parrainIdx].nomEntreprise} → ${PRESTATAIRES_DATA[filleulIdx].nomEntreprise}`)
        continue
      }

      // Créer le parrainage
      const referral = await prisma.referral.create({
        data: {
          parrainId: parrain.id,
          filleulId: filleul.id,
          statut: 'COMPLETED',
          codeUtilise: parrain.codeParrain,
          pointsGagnes: 0,
        },
      })

      console.log(`✅ Parrainage créé: ${PRESTATAIRES_DATA[parrainIdx].nomEntreprise} → ${PRESTATAIRES_DATA[filleulIdx].nomEntreprise}`)

      // Créer les événements de parrainage
      let totalPoints = 0
      const datesBase = new Date()
      datesBase.setMonth(datesBase.getMonth() - 3) // Il y a 3 mois

      for (let i = 0; i < evenements.length; i++) {
        const eventType = evenements[i] as keyof typeof REFERRAL_POINTS
        const points = REFERRAL_POINTS[eventType] || 0
        totalPoints += points

        // Date progressive pour les événements
        const eventDate = new Date(datesBase)
        eventDate.setDate(eventDate.getDate() + i * 5) // 5 jours entre chaque événement

        await prisma.referralEvent.create({
          data: {
            referralId: referral.id,
            type: eventType,
            points,
            metadata: {
              description: `Événement ${eventType} pour ${PRESTATAIRES_DATA[filleulIdx].nomEntreprise}`,
            },
            createdAt: eventDate,
          },
        })
      }

      // Mettre à jour les points du parrain
      await prisma.prestataire.update({
        where: { id: parrain.id },
        data: {
          points: {
            increment: totalPoints,
          },
        },
      })

      // Mettre à jour les points gagnés dans le referral
      await prisma.referral.update({
        where: { id: referral.id },
        data: {
          pointsGagnes: totalPoints,
        },
      })

      console.log(`   📈 Points gagnés: ${totalPoints} (${evenements.length} événements)`)
    }

    // Calculer les boosts disponibles pour chaque prestataire
    console.log('\n🎁 Calcul des boosts disponibles...\n')
    const prestatairesAvecPoints = await prisma.prestataire.findMany({
      where: {
        points: {
          gt: 0,
        },
      },
    })

    for (const prestataire of prestatairesAvecPoints) {
      const boostsDisponibles = Math.floor(prestataire.points / 100)
      const pointsRestants = prestataire.points % 100

      await prisma.prestataire.update({
        where: { id: prestataire.id },
        data: {
          boostsDisponibles,
        },
      })

      console.log(`✅ ${prestataire.nomEntreprise}: ${prestataire.points} points → ${boostsDisponibles} boosts (${pointsRestants} points restants)`)
    }

    // Afficher un résumé
    console.log('\n📊 Résumé du seed:\n')
    const totalPrestataires = await prisma.prestataire.count()
    const totalReferrals = await prisma.referral.count()
    const totalEvents = await prisma.referralEvent.count()
    const totalPoints = await prisma.prestataire.aggregate({
      _sum: {
        points: true,
      },
    })

    console.log(`   • Prestataires: ${totalPrestataires}`)
    console.log(`   • Parrainages: ${totalReferrals}`)
    console.log(`   • Événements: ${totalEvents}`)
    console.log(`   • Points totaux: ${totalPoints._sum.points || 0}`)
    console.log(`   • Boosts disponibles: ${Math.floor((totalPoints._sum.points || 0) / 100)}`)

    console.log('\n✅ Seed terminé avec succès!\n')
  } catch (error) {
    console.error('❌ Erreur lors du seed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Exécuter le script
seedPrestatairesParrainage()

