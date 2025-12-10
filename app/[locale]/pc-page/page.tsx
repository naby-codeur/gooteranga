'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, Lock, Eye, Database, UserCheck, AlertCircle, CheckCircle, Heart, Mail, FileText } from 'lucide-react'
import { Link } from '@/i18n/routing'

export default function PCPage() {
  const sections = [
    {
      id: 1,
      title: '1. Introduction',
      icon: Shield,
      content: [
        'GooTeranga s\'engage à protéger la confidentialité et la sécurité de vos données personnelles.',
        'Cette Politique de Confidentialité explique comment nous collectons, utilisons, stockons et protégeons vos informations.',
        'En utilisant GooTeranga, vous acceptez les pratiques décrites dans cette politique.',
        'Nous respectons la réglementation sénégalaise et internationale en matière de protection des données personnelles.'
      ]
    },
    {
      id: 2,
      title: '2. Données collectées',
      icon: Database,
      content: [
        'Données d\'identification : nom, prénom, email, téléphone, adresse postale, date de naissance (si nécessaire).',
        'Données de connexion : identifiants, mots de passe (cryptés avec des algorithmes sécurisés), adresse IP, logs de connexion.',
        'Données de profil : photo de profil, préférences, historique de réservations, avis et évaluations.',
        'Données de paiement : informations de carte bancaire (gérées exclusivement par Stripe, partenaire certifié PCI-DSS). GooTeranga ne stocke aucune donnée bancaire.',
        'Données de navigation : pages visitées, temps passé, appareil utilisé, système d\'exploitation, navigateur.',
        'Données de localisation : si vous autorisez l\'accès à votre géolocalisation pour améliorer les services de recherche.',
        'Données de communication : messages échangés via la plateforme, avis laissés, réclamations.',
        'Données techniques : cookies, identifiants uniques, données de performance de l\'application.'
      ]
    },
    {
      id: 3,
      title: '3. Utilisation des données',
      icon: Eye,
      content: [
        'Gestion de votre compte et authentification.',
        'Traitement et suivi de vos réservations.',
        'Communication avec vous concernant vos réservations et nos services.',
        'Amélioration de nos services et personnalisation de votre expérience.',
        'Envoi d\'informations marketing (avec votre consentement).',
        'Analyse statistique et recherche pour améliorer la plateforme.',
        'Respect des obligations légales et réglementaires.',
        'Prévention de la fraude et sécurisation de la plateforme.'
      ]
    },
    {
      id: 4,
      title: '4. Partage des données',
      icon: UserCheck,
      content: [
        'Avec les Prestataires : pour permettre la réalisation de vos réservations (nom, coordonnées, détails de la réservation).',
        'Avec nos partenaires techniques : hébergement, paiement (Stripe), analytics, services cloud (sous contrat de confidentialité strict).',
        'Avec les autorités : si requis par la loi, ordonnance judiciaire ou en cas d\'obligation légale.',
        'Nous ne vendons jamais vos données personnelles à des tiers à des fins commerciales.',
        'Tous nos partenaires sont soumis à des obligations strictes de confidentialité et de protection des données.',
        'Vos données peuvent être transférées hors du Sénégal uniquement vers des pays offrant un niveau de protection adéquat ou avec des garanties appropriées (clauses contractuelles types, Privacy Shield, etc.).',
        'En cas de fusion, acquisition ou cession d\'actifs, vos données pourront être transférées, avec notification préalable.'
      ]
    },
    {
      id: 5,
      title: '5. Sécurité des données',
      icon: Lock,
      content: [
        'Nous mettons en œuvre des mesures techniques et organisationnelles pour protéger vos données.',
        'Chiffrement SSL/TLS pour toutes les transmissions de données.',
        'Mots de passe cryptés avec des algorithmes sécurisés.',
        'Accès restreint aux données personnelles aux seuls membres autorisés de notre équipe.',
        'Surveillance et détection des intrusions et anomalies.',
        'Sauvegardes régulières et sécurisées de nos bases de données.',
        'Formation de notre personnel à la protection des données.',
        'Mise à jour régulière de nos systèmes de sécurité.'
      ]
    },
    {
      id: 6,
      title: '6. Conservation des données',
      icon: Database,
      content: [
        'Vos données sont conservées pendant la durée nécessaire aux finalités pour lesquelles elles ont été collectées, conformément à la réglementation sénégalaise et internationale.',
        'Données de compte : pendant la durée de vie de votre compte et 3 ans après sa suppression (sauf obligations légales contraires).',
        'Données de réservation : 5 ans minimum pour les obligations comptables, fiscales et légales.',
        'Données de paiement : conformément aux obligations légales et réglementaires (gérées par Stripe, partenaire certifié).',
        'Données de marketing : jusqu\'à votre désinscription ou demande de suppression, avec un délai maximum de 3 ans.',
        'Données de navigation et cookies : selon la durée de vie des cookies (maximum 13 mois pour les cookies analytiques).',
        'Données de communication : 2 ans après la dernière interaction, sauf obligation légale de conservation plus longue.',
        'Après ces durées, vos données sont supprimées de manière sécurisée ou anonymisées de façon irréversible.'
      ]
    },
    {
      id: 7,
      title: '7. Vos droits',
      icon: CheckCircle,
      content: [
        'Droit d\'accès : vous pouvez demander une copie de vos données personnelles.',
        'Droit de rectification : vous pouvez corriger vos données inexactes ou incomplètes.',
        'Droit à l\'effacement : vous pouvez demander la suppression de vos données (sous réserve des obligations légales).',
        'Droit à la portabilité : vous pouvez récupérer vos données dans un format structuré.',
        'Droit d\'opposition : vous pouvez vous opposer au traitement de vos données pour certaines finalités.',
        'Droit à la limitation : vous pouvez demander la limitation du traitement de vos données.',
        'Droit de retirer votre consentement à tout moment.',
        'Pour exercer ces droits, contactez-nous à : privacy@gooteranga.com'
      ]
    },
    {
      id: 8,
      title: '8. Cookies et technologies similaires',
      icon: Eye,
      content: [
        'Nous utilisons des cookies et technologies similaires (pixels, balises, stockage local) pour améliorer votre expérience sur la plateforme.',
        'Cookies essentiels : nécessaires au fonctionnement de la plateforme (authentification, sécurité, panier). Ils ne peuvent pas être désactivés sans affecter le fonctionnement.',
        'Cookies analytiques : pour comprendre comment vous utilisez la plateforme, mesurer la performance et améliorer nos services (durée : 13 mois maximum).',
        'Cookies de préférences : pour mémoriser vos choix (langue, région, préférences d\'affichage) et personnaliser votre expérience.',
        'Cookies marketing : pour vous proposer des contenus adaptés et mesurer l\'efficacité de nos campagnes (avec votre consentement explicite).',
        'Vous pouvez gérer vos préférences de cookies dans les paramètres de votre compte ou de votre navigateur.',
        'La désactivation de certains cookies peut affecter le fonctionnement optimal de la plateforme.',
        'Nous utilisons également des outils d\'analyse tiers (Google Analytics, etc.) qui peuvent placer leurs propres cookies, sous réserve de votre consentement.'
      ]
    },
    {
      id: 9,
      title: '9. Données des mineurs',
      icon: Shield,
      content: [
        'GooTeranga est destiné aux personnes majeures (18 ans et plus).',
        'Nous ne collectons pas sciemment de données personnelles de mineurs.',
        'Si nous apprenons qu\'un mineur a fourni des données personnelles, nous les supprimerons immédiatement.',
        'Les parents ou tuteurs peuvent nous contacter pour exercer les droits de leurs enfants mineurs.',
        'Nous encourageons les parents à surveiller l\'utilisation d\'Internet par leurs enfants.'
      ]
    },
    {
      id: 10,
      title: '10. Transferts internationaux',
      icon: FileText,
      content: [
        'Vos données peuvent être stockées et traitées dans des serveurs situés au Sénégal ou à l\'étranger.',
        'En cas de transfert hors du Sénégal, nous nous assurons que des garanties appropriées sont en place.',
        'Nous utilisons des services cloud certifiés et conformes aux standards internationaux de sécurité.',
        'Tous nos partenaires internationaux sont soumis à des contrats de protection des données.',
        'Vous pouvez nous contacter pour obtenir plus d\'informations sur les transferts de vos données.'
      ]
    },
    {
      id: 11,
      title: '11. Modifications de la politique',
      icon: AlertCircle,
      content: [
        'Nous pouvons modifier cette Politique de Confidentialité pour refléter les changements dans nos pratiques.',
        'Les modifications importantes vous seront notifiées par email ou via la plateforme.',
        'La date de dernière mise à jour est indiquée en haut de cette page.',
        'Nous vous encourageons à consulter régulièrement cette politique.',
        'L\'utilisation continue de la plateforme après modification vaut acceptation de la nouvelle politique.'
      ]
    },
    {
      id: 12,
      title: '12. Contact et réclamations',
      icon: Mail,
      content: [
        'Pour toute question concernant cette Politique de Confidentialité ou pour exercer vos droits, contactez-nous :',
        'Email : privacy@gooteranga.com',
        'Adresse : GooTeranga, Dakar, Sénégal',
        'Nous nous engageons à répondre à vos demandes dans les meilleurs délais (maximum 30 jours à compter de la réception de votre demande).',
        'Pour exercer vos droits (accès, rectification, suppression, portabilité, opposition), veuillez nous fournir une pièce d\'identité pour vérification de votre identité.',
        'Vous pouvez également déposer une réclamation auprès de l\'autorité de protection des données compétente au Sénégal si vous estimez que vos droits ne sont pas respectés.',
        'En cas de violation de données personnelles susceptible d\'engendrer un risque élevé pour vos droits et libertés, nous vous en informerons dans les meilleurs délais.'
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
              className="inline-block mb-4 sm:mb-6"
            >
              <Shield className="h-12 w-12 sm:h-16 sm:w-16 text-orange-500 mx-auto" />
            </motion.div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-orange-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent px-2">
              Politique de Confidentialité
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-4 px-2">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <Badge className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base bg-orange-500 text-white">
              <Heart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Protection garantie
            </Badge>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs sm:text-sm text-blue-800 leading-relaxed">
              <strong>Engagement :</strong> GooTeranga s&apos;engage à protéger vos données personnelles et à respecter votre vie privée. 
              Cette politique explique comment nous collectons, utilisons et protégeons vos informations.
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
                    <CardHeader className="p-4 sm:p-6">
                      <CardTitle className="flex items-start sm:items-center gap-2 sm:gap-3 text-base sm:text-lg md:text-xl flex-wrap">
                        <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-orange-500 to-yellow-500 flex-shrink-0">
                          <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                        </div>
                        <span className="flex-1 min-w-0 break-words">{section.title}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 pt-0">
                      <ul className="space-y-2 sm:space-y-3">
                        {section.content.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-2 sm:gap-3 text-muted-foreground">
                            <span className="text-orange-500 mt-1 flex-shrink-0">•</span>
                            <span className="flex-1 leading-relaxed text-sm sm:text-base break-words">{item}</span>
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
            className="mt-8 sm:mt-12 p-4 sm:p-6 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg text-white text-center"
          >
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Questions sur la protection de vos données ?</h3>
            <p className="mb-3 sm:mb-4 text-sm sm:text-base">Notre équipe est à votre écoute</p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Link href="/dashboard/admin?section=support">
                <Badge className="px-4 py-1.5 sm:px-6 sm:py-2 text-sm sm:text-base bg-white text-orange-600 hover:bg-orange-50 cursor-pointer inline-flex items-center">
                  Nous contacter
                </Badge>
              </Link>
              <a href="mailto:privacy@gooteranga.com" className="break-all">
                <Badge className="px-4 py-1.5 sm:px-6 sm:py-2 text-xs sm:text-sm md:text-base bg-white text-orange-600 hover:bg-orange-50 cursor-pointer inline-flex items-center">
                  <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                  <span className="break-all">privacy@gooteranga.com</span>
                </Badge>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

