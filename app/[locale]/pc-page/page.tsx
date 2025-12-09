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
        'Données d\'identification : nom, prénom, email, téléphone, adresse.',
        'Données de connexion : identifiants, mots de passe (cryptés), adresse IP.',
        'Données de profil : photo, préférences, historique de réservations.',
        'Données de paiement : informations de carte bancaire (gérées par nos partenaires certifiés).',
        'Données de navigation : pages visitées, temps passé, appareil utilisé.',
        'Données de localisation : si vous autorisez l\'accès à votre géolocalisation.',
        'Données de communication : messages échangés via la plateforme, avis laissés.'
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
        'Avec les Prestataires : pour permettre la réalisation de vos réservations.',
        'Avec nos partenaires techniques : hébergement, paiement, analytics (sous contrat de confidentialité).',
        'Avec les autorités : si requis par la loi ou en cas d\'obligation légale.',
        'Nous ne vendons jamais vos données personnelles à des tiers.',
        'Tous nos partenaires sont soumis à des obligations strictes de confidentialité.',
        'Vos données peuvent être transférées hors du Sénégal uniquement vers des pays offrant un niveau de protection adéquat.'
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
        'Vos données sont conservées pendant la durée nécessaire aux finalités pour lesquelles elles ont été collectées.',
        'Données de compte : pendant la durée de vie de votre compte et 3 ans après sa suppression.',
        'Données de réservation : 5 ans pour les obligations comptables et légales.',
        'Données de paiement : conformément aux obligations légales (gérées par nos partenaires).',
        'Données de marketing : jusqu\'à votre désinscription ou demande de suppression.',
        'Après ces durées, vos données sont supprimées ou anonymisées de manière sécurisée.'
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
        'Nous utilisons des cookies pour améliorer votre expérience sur la plateforme.',
        'Cookies essentiels : nécessaires au fonctionnement de la plateforme (ne peuvent pas être désactivés).',
        'Cookies analytiques : pour comprendre comment vous utilisez la plateforme.',
        'Cookies de préférences : pour mémoriser vos choix et personnaliser votre expérience.',
        'Cookies marketing : pour vous proposer des contenus adaptés (avec votre consentement).',
        'Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur.',
        'La désactivation de certains cookies peut affecter le fonctionnement de la plateforme.'
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
        'Pour toute question concernant cette Politique de Confidentialité, contactez-nous :',
        'Email : privacy@gooteranga.com',
        'Adresse : GooTeranga, Dakar, Sénégal',
        'Vous pouvez également déposer une réclamation auprès de l\'autorité de protection des données compétente.',
        'Nous nous engageons à répondre à vos demandes dans les meilleurs délais (maximum 30 jours).',
        'Pour exercer vos droits, veuillez nous fournir une pièce d\'identité pour vérification.'
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
              <Shield className="h-16 w-16 text-orange-500 mx-auto" />
            </motion.div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent">
              Politique de Confidentialité
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground mb-4">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <Badge className="px-4 py-2 text-base bg-orange-500 text-white">
              <Heart className="h-4 w-4 mr-2" />
              Protection garantie
            </Badge>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
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
            <h3 className="text-2xl font-bold mb-4">Questions sur la protection de vos données ?</h3>
            <p className="mb-4">Notre équipe est à votre écoute</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard/admin?section=support">
                <Badge className="px-6 py-2 text-base bg-white text-orange-600 hover:bg-orange-50 cursor-pointer">
                  Nous contacter
                </Badge>
              </Link>
              <a href="mailto:privacy@gooteranga.com">
                <Badge className="px-6 py-2 text-base bg-white text-orange-600 hover:bg-orange-50 cursor-pointer">
                  <Mail className="h-4 w-4 mr-2 inline" />
                  privacy@gooteranga.com
                </Badge>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

