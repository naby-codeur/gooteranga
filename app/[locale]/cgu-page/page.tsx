'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, Shield, Users, AlertCircle, CheckCircle, Heart, Sparkles } from 'lucide-react'
import { Link } from '@/i18n/routing'

export default function CGUPage() {
  const sections = [
    {
      id: 1,
      title: '1. Objet et champ d\'application',
      icon: FileText,
      content: [
        'Les présentes Conditions Générales d\'Utilisation (CGU) régissent l\'utilisation de la plateforme GooTeranga.',
        'GooTeranga est une plateforme de mise en relation entre touristes et prestataires de services touristiques au Sénégal.',
        'En accédant et en utilisant GooTeranga, vous acceptez sans réserve les présentes CGU.',
        'Si vous n\'acceptez pas ces conditions, veuillez ne pas utiliser la plateforme.'
      ]
    },
    {
      id: 2,
      title: '2. Définitions',
      icon: Users,
      content: [
        'Utilisateur : toute personne accédant à la plateforme GooTeranga.',
        'Touriste : utilisateur recherchant des expériences touristiques au Sénégal.',
        'Prestataire : utilisateur proposant des services touristiques (guides, hébergements, restaurants, etc.).',
        'Service : toute expérience, activité ou prestation proposée via la plateforme.',
        'Réservation : acte par lequel un Touriste réserve un Service proposé par un Prestataire.'
      ]
    },
    {
      id: 3,
      title: '3. Inscription et compte utilisateur',
      icon: Shield,
      content: [
        'Pour utiliser certains services de GooTeranga, vous devez créer un compte.',
        'Vous vous engagez à fournir des informations exactes, complètes et à jour.',
        'Vous êtes responsable de la confidentialité de vos identifiants de connexion.',
        'Vous vous engagez à ne pas partager votre compte avec des tiers.',
        'GooTeranga se réserve le droit de suspendre ou supprimer tout compte en cas de violation des CGU.'
      ]
    },
    {
      id: 4,
      title: '4. Services proposés',
      icon: Sparkles,
      content: [
        'GooTeranga met en relation les Touristes et les Prestataires.',
        'La plateforme propose diverses expériences : visites guidées, hébergements, restaurants, activités culturelles, etc.',
        'GooTeranga agit en tant qu\'intermédiaire et n\'est pas partie aux contrats conclus entre Touristes et Prestataires.',
        'Les Prestataires sont seuls responsables de la qualité et de la conformité de leurs services.',
        'GooTeranga se réserve le droit de refuser, modifier ou retirer toute offre de service.'
      ]
    },
    {
      id: 5,
      title: '5. Réservations et paiements',
      icon: CheckCircle,
      content: [
        'Les réservations sont effectuées directement entre le Touriste et le Prestataire via la plateforme.',
        'Paiement en ligne : Les Voyageurs paient directement les Prestataires via Stripe Connect. Les fonds ne transitent jamais sur un compte GooTeranga.',
        'Paiement hors ligne : Les Voyageurs peuvent payer en espèces ou via Mobile Money directement au Prestataire, hors plateforme.',
        'GooTeranga n\'intervient pas dans l\'encaissement, la détention, la sécurisation bancaire des fonds, les remboursements ou la gestion des litiges financiers.',
        'Toute demande relative à un paiement doit être résolue directement entre le Voyageur et le Prestataire.',
        'GooTeranga ne peut être tenue responsable des défauts de paiement, fraudes, non-remboursements ou litiges commerciaux.',
        'Les Prestataires paient leurs abonnements et boosts à GooTeranga via Stripe Billing (Visa, Mastercard, AMEX, Apple Pay, Google Pay) ou en espèces.'
      ]
    },
    {
      id: 6,
      title: '6. Obligations des utilisateurs',
      icon: AlertCircle,
      content: [
        'Vous vous engagez à utiliser la plateforme de manière licite et conforme aux présentes CGU.',
        'Vous ne devez pas utiliser GooTeranga à des fins frauduleuses, illégales ou nuisibles.',
        'Vous vous engagez à respecter les droits de propriété intellectuelle de GooTeranga et des autres utilisateurs.',
        'Tout contenu publié (avis, photos, descriptions) doit être exact, respectueux et conforme à la législation en vigueur.',
        'Les Prestataires s\'engagent à fournir des services conformes aux descriptions publiées.'
      ]
    },
    {
      id: 7,
      title: '7. Propriété intellectuelle',
      icon: FileText,
      content: [
        'Tous les éléments de la plateforme GooTeranga (logos, textes, images, design) sont protégés par le droit d\'auteur.',
        'L\'utilisation de ces éléments sans autorisation préalable est strictement interdite.',
        'Les contenus publiés par les utilisateurs restent leur propriété, mais ils accordent à GooTeranga une licence d\'utilisation.',
        'Toute reproduction, même partielle, est interdite sans autorisation écrite de GooTeranga.'
      ]
    },
    {
      id: 8,
      title: '8. Responsabilité et limitation de responsabilité',
      icon: Shield,
      content: [
        'GooTeranga est une plateforme technologique et n\'est ni vendeur, ni prestataire de services, ni agent commercial, ni garant financier.',
        'GooTeranga agit en tant qu\'intermédiaire technique et n\'est pas responsable des services fournis par les Prestataires.',
        'La responsabilité de GooTeranga est strictement limitée au fonctionnement technique de la plateforme.',
        'GooTeranga ne peut être tenue responsable de la qualité des prestations, des retards, absences, annulations, litiges, erreurs ou pertes financières.',
        'GooTeranga fournit la plateforme « en l\'état » et sans garantie quant à la disponibilité continue des services.',
        'Tout litige financier ou contractuel entre Voyageur et Prestataire doit être réglé sans intervention de GooTeranga.',
        'GooTeranga peut éventuellement proposer une médiation non contraignante, sans obligation d\'issue favorable.'
      ]
    },
    {
      id: 9,
      title: '9. Protection des données personnelles',
      icon: Shield,
      content: [
        'GooTeranga collecte et traite vos données personnelles conformément à sa Politique de Confidentialité.',
        'Vos données sont utilisées pour le fonctionnement de la plateforme, la gestion des réservations et l\'amélioration de nos services.',
        'Vous disposez d\'un droit d\'accès, de rectification et de suppression de vos données personnelles.',
        'Pour plus d\'informations, consultez notre Politique de Confidentialité.'
      ]
    },
    {
      id: 10,
      title: '10. Modification des CGU',
      icon: AlertCircle,
      content: [
        'GooTeranga se réserve le droit de modifier les présentes CGU à tout moment.',
        'Les modifications sont effectives dès leur publication sur la plateforme.',
        'Il est recommandé de consulter régulièrement les CGU pour prendre connaissance des éventuelles modifications.',
        'L\'utilisation continue de la plateforme après modification vaut acceptation des nouvelles conditions.'
      ]
    },
    {
      id: 11,
      title: '11. Résiliation',
      icon: AlertCircle,
      content: [
        'Vous pouvez supprimer votre compte à tout moment depuis les paramètres de votre profil.',
        'GooTeranga se réserve le droit de suspendre ou supprimer tout compte en cas de violation des CGU.',
        'En cas de résiliation, vos données personnelles seront supprimées conformément à la réglementation en vigueur.',
        'Les réservations en cours restent valides jusqu\'à leur terme.'
      ]
    },
    {
      id: 12,
      title: '12. Obligations des Prestataires',
      icon: Users,
      content: [
        'Les Prestataires s\'engagent à proposer des prestations conformes à la description publiée.',
        'Ils doivent assurer la bonne exécution des services vendus.',
        'Ils doivent afficher des prix clairs, incluant toutes taxes applicables.',
        'Ils doivent gérer eux-mêmes leurs litiges financiers avec les Voyageurs.',
        'Ils doivent résoudre les réclamations sans intervention de GooTeranga.',
        'Ils doivent respecter les législations locales, fiscales et réglementaires applicables à leur activité.',
        'GooTeranga peut suspendre ou supprimer un compte en cas de fraude ou non-respect des obligations.'
      ]
    },
    {
      id: 13,
      title: '13. Obligations des Voyageurs',
      icon: Users,
      content: [
        'Les Voyageurs reconnaissent que les Prestataires sont les seuls responsables des prestations réservées.',
        'Toute demande de modification, remboursement ou réclamation doit être adressée directement au Prestataire.',
        'GooTeranga n\'est ni partie au contrat commercial, ni garant des paiements.',
        'Le choix du mode de paiement (en ligne ou hors ligne) relève entièrement de leur responsabilité.',
        'Les Voyageurs reconnaissent que toute transaction s\'effectue à leurs propres risques.'
      ]
    },
    {
      id: 14,
      title: '14. Acceptation des conditions',
      icon: CheckCircle,
      content: [
        'En utilisant la plateforme, Voyageurs et Prestataires reconnaissent qu\'ils ont pris connaissance du présent document.',
        'Ils acceptent les limites de responsabilité de GooTeranga.',
        'Ils reconnaissent que toute transaction s\'effectue à leurs propres risques.',
        'Ils dégagent pleinement GooTeranga de toute réclamation financière ou contractuelle.',
        'L\'utilisation continue de la plateforme vaut acceptation des conditions.'
      ]
    },
    {
      id: 15,
      title: '15. Droit applicable et juridiction',
      icon: FileText,
      content: [
        'Les présentes CGU sont régies par le droit sénégalais.',
        'En cas de litige, les parties s\'engagent à rechercher une solution amiable.',
        'À défaut d\'accord amiable, le litige sera porté devant les tribunaux compétents de Dakar, Sénégal.',
        'Conformément à la législation sénégalaise, les consommateurs peuvent recourir à la médiation ou à l\'arbitrage.'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-50">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-yellow-500 to-red-500 opacity-10"></div>
        <div className="container mx-auto relative z-10 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="inline-block mb-6"
            >
              <FileText className="h-16 w-16 text-orange-500 mx-auto" />
            </motion.div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent">
              Conditions Générales d&apos;Utilisation
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground mb-4">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <Badge className="px-4 py-2 text-base bg-orange-500 text-white">
              <Heart className="h-4 w-4 mr-2" />
              En vigueur
            </Badge>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Important :</strong> En utilisant GooTeranga, vous reconnaissez avoir lu, compris et accepté les présentes Conditions Générales d&apos;Utilisation. 
              Nous vous invitons à les consulter régulièrement.
            </p>
          </div>

          <div className="space-y-6">
            {sections.map((section, index) => {
              const Icon = section.icon
              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow duration-300 border-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-yellow-500">
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        {section.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {section.content.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-3 text-muted-foreground">
                            <span className="text-orange-500 mt-1">•</span>
                            <span className="flex-1 leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mt-12 p-6 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg text-white text-center"
          >
            <h3 className="text-2xl font-bold mb-4">Des questions sur nos CGU ?</h3>
            <p className="mb-4">Notre équipe est là pour vous aider</p>
            <Link href="/dashboard/admin?section=support">
              <Badge className="px-6 py-2 text-base bg-white text-orange-600 hover:bg-orange-50 cursor-pointer">
                Nous contacter
              </Badge>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

