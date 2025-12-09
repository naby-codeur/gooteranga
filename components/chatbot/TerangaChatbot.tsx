'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Minimize2, Sparkles, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  text: string
  isBot: boolean
  timestamp: Date
}

// Base de connaissances sur GooTeranga
const knowledgeBase = {
  greetings: [
    "Salut ! 👋 Moi c'est Teranga, ton guide virtuel sur GooTeranga ! Prêt à découvrir le Sénégal ? 🌍",
    "Bonjour ! 🌞 Teranga à ton service ! Je suis là pour t'aider à explorer les merveilles du Sénégal ! 🇸🇳",
    "Hey ! ✨ Bienvenue sur GooTeranga ! Je suis Teranga, ton assistant panafricain préféré ! Prêt pour l'aventure ? 🚀"
  ],
  platform: [
    "GooTeranga, c'est LA plateforme qui connecte les voyageurs aux meilleurs guides et prestataires du Sénégal ! 🌟 On parle de guides certifiés, d'hébergements authentiques, de restaurants locaux, et d'expériences inoubliables !",
    "Imagine une plateforme où tu peux réserver des visites guidées, des hébergements, des activités culturelles, et même découvrir l'artisanat local ! C'est ça GooTeranga ! 🎯",
    "GooTeranga, c'est ton passeport digital pour découvrir le vrai Sénégal ! Des plages de Saly aux monuments de Gorée, en passant par la gastronomie locale, on a tout ! 🏖️🏛️🍛"
  ],
  services: [
    "On propose plein de trucs géniaux ! 🎉 Des visites guidées, des hébergements (hôtels, maisons d'hôtes), des restaurants locaux, des activités culturelles, de l'artisanat, et même des circuits sur mesure ! Tout pour vivre le Sénégal authentique !",
    "Tu veux explorer les 14 régions du Sénégal ? On a ça ! 🗺️ Des guides certifiés pour chaque destination, des hébergements pour tous les budgets, et des expériences uniques !",
    "Chez GooTeranga, on a pensé à tout ! 🎯 Guides touristiques, hébergements, restaurants, activités (culture, nature, plage, gastronomie), et même un marché artisanal digital ! Le Sénégal à portée de clic !"
  ],
  booking: [
    "Réserver ? C'est super simple ! 🎫 Tu choisis ton expérience, tes dates, tu paies en ligne (carte bancaire, mobile money), et hop ! Tu reçois une confirmation par email ! Facile comme bonjour !",
    "Le processus est rapide et sécurisé ! 🔒 Tu parcours les offres, tu sélectionnes celle qui te plaît, tu choisis tes options, tu paies, et c'est dans la poche ! On accepte Visa, Mastercard, Orange Money, Wave, et Free Money !",
    "C'est parti ! 🚀 Tu cherches une expérience, tu cliques sur réserver, tu remplis les infos, tu paies (tout est sécurisé), et tu reçois ta confirmation ! On gère tout pour que tu profites !"
  ],
  regions: [
    "Le Sénégal, c'est 14 régions magnifiques ! 🌍 Dakar (la capitale), Thiès, Saint-Louis, Ziguinchor, Kaolack, Louga, Matam, Tambacounda, Kolda, Sédhiou, Kaffrine, Fatick, Kédougou, et Diourbel ! Chacune a ses trésors !",
    "14 régions, 14 aventures ! 🗺️ De Dakar avec Gorée et ses plages, à Saint-Louis classée UNESCO, en passant par les parcs nationaux de Tambacounda, chaque région te réserve des surprises !",
    "Ah, les régions du Sénégal ! 🇸🇳 Dakar pour l'histoire et la culture, Saly pour les plages, Saint-Louis pour le patrimoine, Casamance pour la nature... On a de quoi faire ! Quelle région t'intéresse ?"
  ],
  pricing: [
    "Les prix varient selon l'expérience ! 💰 Mais bonne nouvelle : on affiche tout en TTC (Toutes Taxes Comprises), pas de mauvaises surprises ! La commission GooTeranga est clairement indiquée avant la réservation.",
    "C'est transparent ! 💵 Les prestataires fixent leurs tarifs, on ajoute notre commission (visible avant paiement), et c'est tout ! Pas de frais cachés, promis !",
    "Budget serré ? Pas de souci ! 🎯 On a des offres pour tous les budgets, du backpacker au voyageur premium ! Et tous les prix sont TTC, on est clairs là-dessus !"
  ],
  guides: [
    "Devenir guide sur GooTeranga ? Excellente idée ! 🎓 Tu t'inscris en tant que prestataire, tu remplis ton profil, tu ajoutes tes offres, et tu commences à recevoir des réservations ! On a même des plans d'abonnement pour booster ta visibilité !",
    "C'est simple ! 👨‍🏫 Tu crées un compte prestataire, tu complètes ton profil avec tes certifications, tu ajoutes tes expériences (visites, circuits, etc.), et tu choisis ton plan (Gratuit, Pro, ou Premium) !",
    "Rejoins la famille GooTeranga ! 🤝 On a des guides certifiés partout au Sénégal ! Tu peux commencer avec le plan gratuit (5 expériences max), ou passer Pro/Premium pour plus de visibilité et de fonctionnalités !"
  ],
  cancellation: [
    "Tu peux annuler, mais ça dépend des conditions du prestataire ! 📋 En général, plus tu annules tôt, mieux c'est ! Les conditions sont claires avant la réservation. Remboursement sous 5-10 jours ouvrés.",
    "Oui, c'est possible ! ✅ Les conditions d'annulation varient selon le prestataire et sont indiquées avant la réservation. Plus tu annules tôt, plus le remboursement est important !",
    "Pas de problème ! 🔄 Tu peux annuler, mais regarde bien les conditions avant de réserver ! Le remboursement se fait sur le même moyen de paiement, sous 5-10 jours ouvrés."
  ],
  payment: [
    "On accepte plein de moyens de paiement ! 💳 Cartes bancaires (Visa, Mastercard), mobile money (Orange Money, Wave, Free Money), et virements bancaires ! Tout est sécurisé via notre partenaire certifié !",
    "Payer ? Facile ! 💰 Tu peux utiliser ta carte bancaire, ou ton mobile money (Orange Money, Wave, Free Money), ou faire un virement ! Tout est sécurisé, on utilise Stripe et d'autres partenaires de confiance !",
    "Plusieurs options ! 🎯 Carte bancaire, mobile money (Orange Money, Wave, Free Money), ou virement ! Tout est sécurisé SSL/TLS, tes données sont protégées !"
  ],
  languages: [
    "On parle plusieurs langues ! 🌍 Français, anglais, arabe, espagnol, italien, portugais, et allemand ! Change de langue en cliquant sur l'icône globe en haut à droite !",
    "Multilingue, c'est notre truc ! 🗣️ 7 langues disponibles : français, anglais, arabe, espagnol, italien, portugais, et allemand ! On veut que tout le monde se sente chez soi !",
    "7 langues, 7 façons de découvrir le Sénégal ! 🌐 Français, anglais, arabe, espagnol, italien, portugais, et allemand ! Change de langue quand tu veux !"
  ],
  beaches: [
    "Les plages du Sénégal ? Wahou ! 🏖️ On a Saly, N'Gor, Yoff, Somone, Cap Skirring en Casamance... Des eaux turquoise, du sable fin, et du soleil toute l'année ! Parfait pour se détendre ou faire du surf !",
    "Ah, les plages sénégalaises ! 🌊 C'est magnifique ! Saly pour le farniente, N'Gor pour le surf, Cap Skirring pour les plus belles plages d'Afrique de l'Ouest ! Tu veux laquelle ?",
    "Plages ? On en a de la belle ! 🏝️ Saly, Somone, N'Gor, Yoff, et la Casamance avec ses plages paradisiaques ! Du sable blanc, des cocotiers, et une eau à 25°C toute l'année ! Le rêve !"
  ],
  food: [
    "La gastronomie sénégalaise ? C'est un régal ! 🍛 Le thiéboudiène (riz au poisson), le yassa (poulet ou poisson au citron), le mafé (sauce arachide), le ceebu jën... Des saveurs qui te font voyager !",
    "Miam ! 🍽️ La cuisine sénégalaise, c'est de l'art ! Le thiéboudiène (notre plat national), le yassa, le mafé, les beignets... Et tout ça avec des épices qui réveillent les papilles ! Tu veux goûter ?",
    "La bouffe sénégalaise, c'est la vie ! 🥘 Le thiéboudiène, le yassa, le mafé, le ceebu jën... Des plats qui racontent l'histoire du Sénégal ! Et nos restaurants sur GooTeranga te font découvrir tout ça !"
  ],
  culture: [
    "La culture sénégalaise ? C'est riche ! 🎭 On a Gorée (patrimoine UNESCO), les musées, les festivals, la musique (mbalax, afrobeat), l'artisanat, les danses traditionnelles... Une culture vivante et authentique !",
    "Culture ? On en a à revendre ! 🎨 Gorée pour l'histoire, Saint-Louis pour l'architecture, les musées, les festivals, la musique sénégalaise... Et nos guides te font découvrir tout ça avec passion !",
    "La culture sénégalaise, c'est notre fierté ! 🏛️ De Gorée à Saint-Louis, en passant par les musées et les festivals, on a une richesse culturelle incroyable ! Nos guides te racontent tout !"
  ],
  safety: [
    "Sécurité ? Le Sénégal est un pays très sûr ! 🛡️ On est connus pour notre hospitalité (la Teranga !). Bien sûr, comme partout, reste vigilant, mais c'est un pays paisible et accueillant !",
    "Le Sénégal, c'est le pays de la Teranga (hospitalité) ! 🤝 C'est un pays très sûr, les Sénégalais sont accueillants. Nos guides certifiés te guident en toute sécurité !",
    "Sécurité ? Pas de souci ! ✅ Le Sénégal est un pays paisible, connu pour son hospitalité. Nos guides sont certifiés et formés pour t'accompagner en toute sécurité !"
  ],
  default: [
    "Hmm, je ne suis pas sûr de comprendre ! 🤔 Mais je peux t'aider sur GooTeranga, les réservations, les guides, les régions du Sénégal, les plages, la gastronomie, la culture... Pose-moi une question plus précise !",
    "Intéressant ! 🤓 Mais je suis spécialisé dans GooTeranga et le tourisme au Sénégal ! Tu veux savoir quoi exactement ? Réservations, guides, régions, plages, gastronomie ?",
    "Je suis un peu perdu là ! 😅 Mais je connais bien GooTeranga ! Tu veux savoir comment réserver, devenir guide, découvrir les régions, les plages, ou la gastronomie ?"
  ]
}

// Fonction pour générer une réponse intelligente
function generateResponse(userMessage: string): string {
  const message = userMessage.toLowerCase().trim()
  
  // Salutations
  if (message.match(/salut|bonjour|bonsoir|hey|hi|hello|bonsoir|ça va|comment ça va/i)) {
    return knowledgeBase.greetings[Math.floor(Math.random() * knowledgeBase.greetings.length)]
  }
  
  // Questions sur la plateforme
  if (message.match(/gooteranga|plateforme|qu'est-ce que|what is|qu'est ce que/i)) {
    return knowledgeBase.platform[Math.floor(Math.random() * knowledgeBase.platform.length)]
  }
  
  // Services
  if (message.match(/service|offre|propose|disponible|qu'est-ce qu'on peut|what can/i)) {
    return knowledgeBase.services[Math.floor(Math.random() * knowledgeBase.services.length)]
  }
  
  // Réservation
  if (message.match(/réserver|reserver|booking|réservation|reservation|comment réserver|how to book/i)) {
    return knowledgeBase.booking[Math.floor(Math.random() * knowledgeBase.booking.length)]
  }
  
  // Régions
  if (message.match(/région|region|dakar|saint-louis|saly|casamance|zig|thiès|lieu|destination|où|where/i)) {
    return knowledgeBase.regions[Math.floor(Math.random() * knowledgeBase.regions.length)]
  }
  
  // Prix
  if (message.match(/prix|price|tarif|coût|cout|combien|how much|gratuit|free|cher|expensive/i)) {
    return knowledgeBase.pricing[Math.floor(Math.random() * knowledgeBase.pricing.length)]
  }
  
  // Devenir guide
  if (message.match(/devenir guide|become guide|guide|prestataire|provider|inscription guide/i)) {
    return knowledgeBase.guides[Math.floor(Math.random() * knowledgeBase.guides.length)]
  }
  
  // Annulation
  if (message.match(/annuler|annulation|cancel|remboursement|refund|rembourser/i)) {
    return knowledgeBase.cancellation[Math.floor(Math.random() * knowledgeBase.cancellation.length)]
  }
  
  // Paiement
  if (message.match(/paiement|payment|payer|pay|mobile money|orange money|wave|free money|carte|card/i)) {
    return knowledgeBase.payment[Math.floor(Math.floor(Math.random() * knowledgeBase.payment.length))]
  }
  
  // Langues
  if (message.match(/langue|language|français|english|multilingue|multilingual/i)) {
    return knowledgeBase.languages[Math.floor(Math.random() * knowledgeBase.languages.length)]
  }
  
  // Plages
  if (message.match(/plage|beach|saly|ngor|yoff|somone|cap skirring|bord de mer|mer|ocean/i)) {
    return knowledgeBase.beaches[Math.floor(Math.random() * knowledgeBase.beaches.length)]
  }
  
  // Gastronomie
  if (message.match(/gastronomie|food|cuisine|manger|restaurant|thiéboudiène|thieboudiene|yassa|mafé|mafe|plat|repas|miam/i)) {
    return knowledgeBase.food[Math.floor(Math.random() * knowledgeBase.food.length)]
  }
  
  // Culture
  if (message.match(/culture|culturel|gorée|goree|musée|musee|festival|art|artisanat|histoire|historique|patrimoine/i)) {
    return knowledgeBase.culture[Math.floor(Math.random() * knowledgeBase.culture.length)]
  }
  
  // Sécurité
  if (message.match(/sécurité|securite|sûr|sur|safe|danger|risque|hospitalité|hospitalite|teranga/i)) {
    return knowledgeBase.safety[Math.floor(Math.random() * knowledgeBase.safety.length)]
  }
  
  // Réponse par défaut
  return knowledgeBase.default[Math.floor(Math.random() * knowledgeBase.default.length)]
}

export function TerangaChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Salut ! 👋 Moi c'est Teranga, ton guide virtuel sur GooTeranga ! Prêt à découvrir le Sénégal ? 🌍",
      isBot: true,
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen, isMinimized])

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus()
    }
  }, [isOpen, isMinimized])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isBot: false,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')

    // Simuler un délai de réponse du bot
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateResponse(inputValue),
        isBot: true,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botResponse])
    }, 500)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Bouton flottant */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setIsOpen(true)
                setIsMinimized(false)
              }}
              className="relative group"
            >
              {/* Cercle animé en arrière-plan */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 via-yellow-500 to-red-500 blur-xl"
              />
              
              {/* Bouton principal */}
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-orange-500 via-yellow-500 to-red-500 shadow-2xl flex items-center justify-center border-[2px] sm:border-[3px] border-white dark:border-gray-900">
                <Avatar className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 border-2 border-white dark:border-gray-900">
                  <AvatarFallback className="bg-gradient-to-br from-gray-900 to-gray-700 text-white font-bold text-sm sm:text-base md:text-lg">
                    T
                  </AvatarFallback>
                </Avatar>
                
                {/* Badge de notification */}
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center"
                >
                  <Sparkles className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" />
                </motion.div>
              </div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-[10px] sm:text-xs font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:block">
                Parler à Teranga
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-100" />
              </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fenêtre de chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -20, y: 20 }}
            animate={{ 
              opacity: 1, 
              x: 0, 
              y: 0,
              height: isMinimized ? 'auto' : 'auto'
            }}
            exit={{ opacity: 0, x: -20, y: 20 }}
            className={cn(
              "fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50",
              "w-[calc(100vw-2rem)] sm:w-[268px] md:w-[294px] max-w-[calc(100vw-2rem)]",
              "bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-2 border-orange-200 dark:border-orange-800",
              "flex flex-col overflow-hidden",
              isMinimized ? "h-auto" : "h-[350px] sm:h-[420px] md:h-[455px] max-h-[calc(100vh-2rem)]"
            )}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-orange-500 via-yellow-500 to-red-500 p-3 sm:p-4 flex items-center justify-between">
              {/* Motif panafricain en arrière-plan */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-2 left-2 w-8 h-8 border-2 border-white rounded-full" />
                <div className="absolute top-2 right-2 w-6 h-6 border-2 border-white rotate-45" />
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full" />
              </div>
              
              <div className="relative flex items-center gap-1.5 sm:gap-2">
                <Avatar className="w-6 h-6 sm:w-7 sm:h-7 border-2 border-white">
                  <AvatarFallback className="bg-gradient-to-br from-gray-900 to-gray-700 text-white font-bold text-xs sm:text-sm">
                    T
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-1 sm:gap-1.5">
                    Teranga
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                    >
                      <Sun className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-200" />
                    </motion.div>
                  </h3>
                  <p className="text-[9px] sm:text-[10px] text-white/90 flex items-center gap-0.5 sm:gap-1">
                    <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-green-300 rounded-full animate-pulse" />
                    En ligne
                  </p>
                </div>
              </div>
              
              <div className="relative flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="h-8 w-8 text-white hover:bg-white/20"
                >
                  <Minimize2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 text-white hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-2 sm:space-y-3 bg-gradient-to-b from-orange-50/30 via-yellow-50/20 to-orange-50/30 dark:from-gray-900 dark:via-orange-950/10">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "flex gap-3",
                        message.isBot ? "justify-start" : "justify-end"
                      )}
                    >
                      {message.isBot && (
                        <Avatar className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0">
                          <AvatarFallback className="bg-gradient-to-br from-gray-900 to-gray-700 text-white text-[10px] sm:text-xs">
                            T
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div
                        className={cn(
                          "max-w-[80%] rounded-xl sm:rounded-2xl px-3 py-2 sm:px-4 sm:py-2.5 shadow-sm",
                          message.isBot
                            ? "bg-white dark:bg-gray-800 border border-orange-200 dark:border-orange-800 rounded-bl-sm"
                            : "bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-br-sm"
                        )}
                      >
                        <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                          {message.text}
                        </p>
                        <span className="text-[10px] sm:text-xs opacity-70 mt-0.5 sm:mt-1 block">
                          {message.timestamp.toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      
                      {!message.isBot && (
                        <Avatar className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0">
                          <AvatarFallback className="bg-gradient-to-br from-orange-400 to-yellow-400 text-white text-[10px] sm:text-xs">
                            👤
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-2 sm:p-3 border-t border-orange-200 dark:border-orange-800 bg-white dark:bg-gray-900">
                  <div className="flex gap-1.5 sm:gap-2">
                    <Input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Pose ta question..."
                      className="flex-1 rounded-full border-2 border-orange-200 dark:border-orange-800 focus:border-orange-400 dark:focus:border-orange-600 text-xs sm:text-sm"
                    />
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim()}
                        className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 shadow-lg flex-shrink-0"
                        size="icon"
                      >
                        <Send className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </Button>
                    </motion.div>
                  </div>
                  <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-1 sm:mt-1.5 text-center">
                    💬 Teranga répond à tes questions sur GooTeranga et le Sénégal !
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

