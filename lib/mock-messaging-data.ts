// Données fictives pour la messagerie entre touristes et prestataires

export interface MockUser {
  id: string
  nom: string
  prenom: string
  email: string
  telephone: string
  avatar?: string
}

export interface MockConversation {
  id: string
  name: string
  avatar?: string
  lastMessage: string
  timestamp: Date
  unreadCount: number
  isOnline?: boolean
  user: MockUser
}

export interface MockMessage {
  id: string
  content: string
  senderId: string
  senderName: string
  senderAvatar?: string
  timestamp: Date
  isRead: boolean
  isFromUser: boolean
  isVoiceMessage?: boolean
  voiceUrl?: string
  voiceDuration?: number
  attachments?: Array<{
    id: string
    name: string
    url: string
    type: 'image' | 'file'
    size?: number
  }>
}

// Données fictives pour les prestataires
const mockPrestataires: MockUser[] = [
  {
    id: 'prestataire-1',
    nom: 'Diallo',
    prenom: 'Amadou',
    email: 'amadou.diallo@hotel-senegal.com',
    telephone: '+221 77 123 45 67',
  },
  {
    id: 'prestataire-2',
    nom: 'Ndiaye',
    prenom: 'Fatou',
    email: 'fatou.ndiaye@guide-tourisme.sn',
    telephone: '+221 78 234 56 78',
  },
  {
    id: 'prestataire-3',
    nom: 'Ba',
    prenom: 'Ibrahima',
    email: 'ibrahima.ba@restaurant-teranga.sn',
    telephone: '+221 76 345 67 89',
  },
]

// Données fictives pour les touristes
const mockTouristes: MockUser[] = [
  {
    id: 'touriste-1',
    nom: 'Martin',
    prenom: 'Sophie',
    email: 'sophie.martin@email.com',
    telephone: '+33 6 12 34 56 78',
  },
  {
    id: 'touriste-2',
    nom: 'Johnson',
    prenom: 'John',
    email: 'john.johnson@email.com',
    telephone: '+1 555 123 4567',
  },
  {
    id: 'touriste-3',
    nom: 'Dubois',
    prenom: 'Marie',
    email: 'marie.dubois@email.com',
    telephone: '+33 6 98 76 54 32',
  },
]

// Générer des conversations pour un prestataire (avec des touristes)
export function getPrestataireConversations(currentUserId: string): MockConversation[] {
  return mockTouristes.map((touriste, index) => ({
    id: `conv-prestataire-${touriste.id}`,
    name: `${touriste.prenom} ${touriste.nom}`,
    avatar: undefined,
    lastMessage: index === 0 
      ? 'Merci pour votre réponse !'
      : index === 1
      ? 'Parfait, je confirme ma réservation'
      : 'À bientôt !',
    timestamp: new Date(Date.now() - (index * 3600000)), // Messages espacés d'1h
    unreadCount: index === 0 ? 2 : 0,
    isOnline: index === 0,
    user: touriste,
  }))
}

// Générer des conversations pour un touriste (avec des prestataires)
export function getTouristeConversations(currentUserId: string): MockConversation[] {
  return mockPrestataires.map((prestataire, index) => ({
    id: `conv-touriste-${prestataire.id}`,
    name: `${prestataire.prenom} ${prestataire.nom}`,
    avatar: undefined,
    lastMessage: index === 0
      ? 'Votre réservation est confirmée !'
      : index === 1
      ? 'Je serai disponible demain à 9h'
      : 'Merci de votre visite !',
    timestamp: new Date(Date.now() - (index * 3600000)),
    unreadCount: index === 1 ? 1 : 0,
    isOnline: index === 0,
    user: prestataire,
  }))
}

// Générer des messages pour une conversation
export function getMessagesForConversation(
  conversationId: string,
  currentUserId: string,
  otherUserId: string,
  otherUserName: string
): MockMessage[] {
  const messages: MockMessage[] = []
  
  // Messages initiaux
  const initialMessages = [
    {
      content: conversationId.includes('prestataire')
        ? 'Bonjour, je suis intéressé(e) par votre offre. Pouvez-vous me donner plus de détails ?'
        : 'Bonjour, je vous contacte concernant votre réservation.',
      isFromUser: true,
    },
    {
      content: conversationId.includes('prestataire')
        ? 'Bonjour ! Bien sûr, je serais ravi de vous donner plus d\'informations. Que souhaitez-vous savoir ?'
        : 'Bonjour ! Oui, comment puis-je vous aider ?',
      isFromUser: false,
    },
    {
      content: conversationId.includes('prestataire')
        ? 'Quels sont les horaires d\'ouverture et les disponibilités ?'
        : 'Quand puis-je venir récupérer les clés ?',
      isFromUser: true,
    },
    {
      content: conversationId.includes('prestataire')
        ? 'Nous sommes ouverts de 8h à 20h tous les jours. Nous avons encore de la disponibilité pour cette semaine.'
        : 'Vous pouvez venir récupérer les clés à partir de 14h aujourd\'hui.',
      isFromUser: false,
    },
    {
      content: conversationId.includes('prestataire')
        ? 'Parfait ! Je vais réserver pour demain.'
        : 'Parfait, merci beaucoup !',
      isFromUser: true,
    },
  ]

  initialMessages.forEach((msg, index) => {
    messages.push({
      id: `msg-${conversationId}-${index}`,
      content: msg.content,
      senderId: msg.isFromUser ? currentUserId : otherUserId,
      senderName: msg.isFromUser ? 'Vous' : otherUserName,
      senderAvatar: undefined,
      timestamp: new Date(Date.now() - ((initialMessages.length - index) * 600000)), // Messages espacés de 10 min
      isRead: !msg.isFromUser || index < initialMessages.length - 1,
      isFromUser: msg.isFromUser,
    })
  })

  return messages
}

// Obtenir les informations d'un utilisateur par ID
export function getUserById(userId: string, isPrestataire: boolean): MockUser | undefined {
  if (isPrestataire) {
    return mockPrestataires.find(p => p.id === userId)
  } else {
    return mockTouristes.find(t => t.id === userId)
  }
}


