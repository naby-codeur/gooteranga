'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, CreditCard, Package, RotateCcw, AlertCircle, CheckCircle, Heart, Sparkles, Shield } from 'lucide-react'
import { Link } from '@/i18n/routing'

export default function CGVPage() {
  const sections = [
    {
      id: 1,
      title: '1. Objet et champ d\'application',
      icon: ShoppingCart,
      content: [
        'Les présentes Conditions Générales de Vente (CGV) s\'appliquent à toutes les réservations effectuées sur la plateforme GooTeranga.',
        'Elles régissent les relations contractuelles entre les Prestataires et les Touristes via GooTeranga.',
        'Toute réservation implique l\'acceptation sans réserve des présentes CGV.',
        'GooTeranga agit en tant qu\'intermédiaire technique et n\'est pas partie au contrat de vente entre le Prestataire et le Touriste.'
      ]
    },
    {
      id: 2,
      title: '2. Prix et modalités de paiement',
      icon: CreditCard,
      content: [
        'Les prix sont indiqués en FCFA (Franc CFA) et sont TTC (Toutes Taxes Comprises) sauf mention contraire.',
        'Les prix peuvent varier selon la saison, la disponibilité et les options choisies.',
        'Paiement en ligne : Les Voyageurs paient directement les Prestataires via Stripe Connect (Visa, Mastercard, AMEX, Apple Pay, Google Pay). Les fonds ne transitent jamais sur un compte GooTeranga.',
        'Paiement hors ligne : Les Voyageurs peuvent payer en espèces ou via Mobile Money (Wave, Orange Money, Free Money) directement au Prestataire, hors plateforme.',
        'GooTeranga n\'intervient pas dans l\'encaissement, la détention, la sécurisation bancaire des fonds, les remboursements ou la gestion des litiges financiers.',
        'Toute demande relative à un paiement doit être résolue directement entre le Voyageur et le Prestataire.',
        'GooTeranga ne peut être tenue responsable des défauts de paiement, fraudes, non-remboursements ou litiges commerciaux.'
      ]
    },
    {
      id: 3,
      title: '3. Processus de réservation',
      icon: Package,
      content: [
        'La réservation s\'effectue en ligne via la plateforme GooTeranga.',
        'Le Touriste sélectionne un service, choisit les dates et options, puis procède au paiement.',
        'Une confirmation de réservation est envoyée par email avec tous les détails.',
        'Le Prestataire reçoit une notification de la nouvelle réservation.',
        'La réservation est confirmée uniquement après validation du paiement.',
        'En cas de problème de paiement, la réservation est automatiquement annulée.'
      ]
    },
    {
      id: 4,
      title: '4. Conditions d\'annulation et de remboursement',
      icon: RotateCcw,
      content: [
        'Les conditions d\'annulation varient selon le Prestataire et le type de service.',
        'Les conditions spécifiques sont clairement indiquées avant la réservation.',
        'En général :',
        '  • Annulation plus de 7 jours avant : remboursement intégral (hors frais de service)',
        '  • Annulation entre 3 et 7 jours : remboursement de 50%',
        '  • Annulation moins de 3 jours : pas de remboursement sauf cas de force majeure',
        'Les demandes d\'annulation doivent être effectuées via la plateforme ou par email.',
        'Le remboursement est effectué sous 5 à 10 jours ouvrés sur le moyen de paiement utilisé.',
        'En cas d\'annulation par le Prestataire, le remboursement est intégral.'
      ]
    },
    {
      id: 5,
      title: '5. Obligations du Prestataire',
      icon: CheckCircle,
      content: [
        'Le Prestataire s\'engage à fournir le service tel que décrit sur la plateforme.',
        'Il doit respecter les horaires, lieux et conditions convenus lors de la réservation.',
        'Le Prestataire doit posséder toutes les autorisations et assurances nécessaires.',
        'Il doit informer le Touriste de tout changement ou imprévu dans les meilleurs délais.',
        'Le Prestataire est responsable de la qualité et de la sécurité du service fourni.',
        'En cas de non-respect, le Prestataire peut être sanctionné et retiré de la plateforme.'
      ]
    },
    {
      id: 6,
      title: '6. Obligations du Touriste',
      icon: AlertCircle,
      content: [
        'Le Touriste s\'engage à respecter les conditions d\'utilisation du service.',
        'Il doit se présenter aux horaires et lieux convenus.',
        'Le Touriste doit respecter les règles de sécurité et les consignes du Prestataire.',
        'Tout comportement inapproprié peut entraîner l\'annulation immédiate sans remboursement.',
        'Le Touriste est responsable de ses biens personnels pendant le service.',
        'Il doit informer le Prestataire de tout problème ou préoccupation dans les meilleurs délais.'
      ]
    },
    {
      id: 7,
      title: '7. Assurance et responsabilité',
      icon: Shield,
      content: [
        'Les Prestataires doivent posséder une assurance responsabilité civile professionnelle.',
        'GooTeranga recommande aux Touristes de souscrire une assurance voyage.',
        'GooTeranga est une plateforme technologique et n\'est ni vendeur, ni prestataire de services, ni agent commercial, ni garant financier.',
        'La responsabilité de GooTeranga est strictement limitée au fonctionnement technique de la plateforme.',
        'GooTeranga ne peut être tenue responsable de la qualité des prestations, des retards, absences, annulations, litiges, erreurs ou pertes financières.',
        'Tout litige financier ou contractuel entre Voyageur et Prestataire doit être réglé sans intervention de GooTeranga.',
        'GooTeranga peut éventuellement proposer une médiation non contraignante, sans obligation d\'issue favorable.'
      ]
    },
    {
      id: 8,
      title: '8. Avis et évaluations',
      icon: Sparkles,
      content: [
        'Après chaque service, le Touriste peut laisser un avis et une note.',
        'Les avis doivent être objectifs, respectueux et conformes à la réalité.',
        'Les avis diffamatoires, injurieux ou mensongers peuvent être supprimés.',
        'Les Prestataires peuvent répondre aux avis pour apporter des clarifications.',
        'Les avis sont publics et visibles par tous les utilisateurs de la plateforme.',
        'GooTeranga se réserve le droit de modérer les avis en cas de non-conformité.'
      ]
    },
    {
      id: 9,
      title: '9. Force majeure',
      icon: AlertCircle,
      content: [
        'En cas de force majeure (catastrophe naturelle, pandémie, grève, etc.), les réservations peuvent être annulées.',
        'Le remboursement est alors intégral pour les services non fournis.',
        'Les frais de service peuvent être conservés pour couvrir les frais de gestion.',
        'GooTeranga et les Prestataires s\'engagent à informer les Touristes dans les meilleurs délais.',
        'Aucune indemnité ne sera due en cas de force majeure.'
      ]
    },
    {
      id: 10,
      title: '10. Réclamations et médiation',
      icon: Shield,
      content: [
        'Tout litige financier ou contractuel entre Voyageur et Prestataire doit être réglé sans intervention de GooTeranga.',
        'Toute réclamation doit être adressée directement au Prestataire concerné.',
        'GooTeranga peut éventuellement proposer une médiation non contraignante, sans obligation d\'issue favorable.',
        'En cas de litige, les parties s\'engagent à rechercher une solution amiable.',
        'À défaut d\'accord, le litige peut être soumis à la médiation ou aux tribunaux compétents.',
        'Conformément à la législation sénégalaise, les consommateurs peuvent recourir à la médiation de la consommation.'
      ]
    },
    {
      id: 11,
      title: '11. Droit de rétractation',
      icon: RotateCcw,
      content: [
        'Conformément à la législation sénégalaise, le droit de rétractation peut s\'appliquer selon le type de service.',
        'Pour les services de transport, hébergement et loisirs avec date fixe, le droit de rétractation peut être limité.',
        'Les conditions spécifiques sont indiquées lors de la réservation.',
        'En cas d\'exercice du droit de rétractation, le remboursement est effectué dans les 14 jours.',
        'Pour plus d\'informations, contactez notre service client.'
      ]
    },
    {
      id: 12,
      title: '12. Droit applicable et juridiction',
      icon: Shield,
      content: [
        'Les présentes CGV sont régies par le droit sénégalais.',
        'Tout litige relève de la compétence des tribunaux de Dakar, Sénégal.',
        'Les parties s\'engagent à rechercher une solution amiable avant tout recours judiciaire.',
        'Conformément à la législation, les consommateurs peuvent recourir à la médiation de la consommation.',
        'GooTeranga s\'engage à respecter la réglementation sénégalaise en matière de commerce électronique.'
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
              <ShoppingCart className="h-16 w-16 text-orange-500 mx-auto" />
            </motion.div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent">
              Conditions Générales de Vente
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
              <strong>Important :</strong> Les présentes Conditions Générales de Vente régissent toutes les transactions effectuées sur GooTeranga. 
              En effectuant une réservation, vous acceptez ces conditions.
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
            <h3 className="text-2xl font-bold mb-4">Des questions sur nos CGV ?</h3>
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

