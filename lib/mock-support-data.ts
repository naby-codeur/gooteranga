// Données fictives pour le support client (admin)

export interface MockSupportUser {
  id: string
  nom: string
  prenom: string
  email: string
  telephone: string
  role: 'USER' | 'PRESTATAIRE'
  type?: string // Pour les prestataires
  avatar?: string
}

export interface MockSupportConversation {
  id: string
  name: string
  avatar?: string
  lastMessage: string
  timestamp: Date
  unreadCount: number
  isOnline?: boolean
  user: MockSupportUser
  sujet?: string
  priorite?: 'low' | 'medium' | 'high'
  statut?: 'open' | 'pending' | 'resolved'
}

export interface MockSupportMessage {
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

// Données fictives pour les utilisateurs en support
const mockSupportUsers: MockSupportUser[] = [
  {
    id: 'user-support-1',
    nom: 'Dupont',
    prenom: 'Jean',
    email: 'jean.dupont@email.com',
    telephone: '+33 6 12 34 56 78',
    role: 'USER',
  },
  {
    id: 'prestataire-support-1',
    nom: 'Diallo',
    prenom: 'Amadou',
    email: 'amadou.diallo@hotel-senegal.com',
    telephone: '+221 77 123 45 67',
    role: 'PRESTATAIRE',
    type: 'HOTEL',
  },
  {
    id: 'user-support-2',
    nom: 'Martin',
    prenom: 'Sophie',
    email: 'sophie.martin@email.com',
    telephone: '+33 6 98 76 54 32',
    role: 'USER',
  },
  {
    id: 'prestataire-support-2',
    nom: 'Ndiaye',
    prenom: 'Fatou',
    email: 'fatou.ndiaye@guide-tourisme.sn',
    telephone: '+221 78 234 56 78',
    role: 'PRESTATAIRE',
    type: 'GUIDE',
  },
  {
    id: 'user-support-3',
    nom: 'Johnson',
    prenom: 'John',
    email: 'john.johnson@email.com',
    telephone: '+1 555 123 4567',
    role: 'USER',
  },
  {
    id: 'prestataire-support-3',
    nom: 'Ba',
    prenom: 'Ibrahima',
    email: 'ibrahima.ba@restaurant-teranga.sn',
    telephone: '+221 76 345 67 89',
    role: 'PRESTATAIRE',
    type: 'RESTAURANT',
  },
]

// Générer des conversations de support
export function getSupportConversations(): MockSupportConversation[] {
  return [
    {
      id: 'conv-support-1',
      name: 'Jean Dupont',
      avatar: undefined,
      lastMessage: 'Bonjour, j\'ai un problème avec ma réservation. Elle a été annulée mais je n\'ai pas reçu le remboursement.',
      timestamp: new Date(Date.now() - 1800000), // Il y a 30 minutes
      unreadCount: 2,
      isOnline: true,
      user: mockSupportUsers[0],
      sujet: 'Problème de remboursement',
      priorite: 'high',
      statut: 'open',
    },
    {
      id: 'conv-support-2',
      name: 'Amadou Diallo (Hôtel)',
      avatar: undefined,
      lastMessage: 'Bonjour, je ne peux pas accéder à mon tableau de bord prestataire. Pouvez-vous m\'aider ?',
      timestamp: new Date(Date.now() - 3600000), // Il y a 1 heure
      unreadCount: 1,
      isOnline: false,
      user: mockSupportUsers[1],
      sujet: 'Problème de connexion',
      priorite: 'high',
      statut: 'open',
    },
    {
      id: 'conv-support-3',
      name: 'Sophie Martin',
      avatar: undefined,
      lastMessage: 'Merci pour votre aide, le problème est résolu !',
      timestamp: new Date(Date.now() - 7200000), // Il y a 2 heures
      unreadCount: 0,
      isOnline: false,
      user: mockSupportUsers[2],
      sujet: 'Question sur les paiements',
      priorite: 'medium',
      statut: 'resolved',
    },
    {
      id: 'conv-support-4',
      name: 'Fatou Ndiaye (Guide)',
      avatar: undefined,
      lastMessage: 'Comment puis-je mettre en avant mes offres ?',
      timestamp: new Date(Date.now() - 10800000), // Il y a 3 heures
      unreadCount: 0,
      isOnline: true,
      user: mockSupportUsers[3],
      sujet: 'Question sur les boosts',
      priorite: 'low',
      statut: 'pending',
    },
    {
      id: 'conv-support-5',
      name: 'John Johnson',
      avatar: undefined,
      lastMessage: 'Je souhaite signaler un prestataire pour comportement inapproprié.',
      timestamp: new Date(Date.now() - 14400000), // Il y a 4 heures
      unreadCount: 0,
      isOnline: false,
      user: mockSupportUsers[4],
      sujet: 'Signalement',
      priorite: 'high',
      statut: 'open',
    },
    {
      id: 'conv-support-6',
      name: 'Ibrahima Ba (Restaurant)',
      avatar: undefined,
      lastMessage: 'Quand vais-je recevoir mes paiements ?',
      timestamp: new Date(Date.now() - 18000000), // Il y a 5 heures
      unreadCount: 0,
      isOnline: false,
      user: mockSupportUsers[5],
      sujet: 'Question sur les paiements',
      priorite: 'medium',
      statut: 'pending',
    },
  ]
}

// Générer des messages pour une conversation de support
export function getSupportMessagesForConversation(
  conversationId: string,
  currentUserId: string,
  otherUserId: string,
  otherUserName: string
): MockSupportMessage[] {
  const messages: MockSupportMessage[] = []
  
  // Messages initiaux selon la conversation
  let initialMessages: Array<{ content: string; isFromUser: boolean }> = []
  
  if (conversationId === 'conv-support-1') {
    initialMessages = [
      {
        content: 'Bonjour, j\'ai un problème avec ma réservation. Elle a été annulée mais je n\'ai pas reçu le remboursement.',
        isFromUser: true,
      },
      {
        content: 'Bonjour Jean, je vais examiner votre problème immédiatement. Pouvez-vous me donner le numéro de réservation ?',
        isFromUser: false,
      },
      {
        content: 'Oui bien sûr, c\'est la réservation #RES-2024-001234',
        isFromUser: true,
      },
      {
        content: 'Merci. Je vois que la réservation a été annulée il y a 3 jours. Le remboursement devrait normalement être traité dans un délai de 5 à 7 jours ouvrés. Laissez-moi vérifier le statut de votre remboursement...',
        isFromUser: false,
      },
      {
        content: 'D\'accord, merci. C\'est que ça fait déjà 5 jours et je n\'ai toujours rien reçu.',
        isFromUser: true,
      },
    ]
  } else if (conversationId === 'conv-support-2') {
    initialMessages = [
      {
        content: 'Bonjour, je ne peux pas accéder à mon tableau de bord prestataire. Pouvez-vous m\'aider ?',
        isFromUser: true,
      },
      {
        content: 'Bonjour Amadou, je vais vous aider à résoudre ce problème. Quel message d\'erreur voyez-vous exactement ?',
        isFromUser: false,
      },
      {
        content: 'Il me dit "Accès refusé" alors que j\'étais connecté hier sans problème.',
        isFromUser: true,
      },
      {
        content: 'Je vais vérifier votre compte. Il est possible que votre session ait expiré ou qu\'il y ait un problème temporaire. Essayez de vous déconnecter et reconnecter.',
        isFromUser: false,
      },
    ]
  } else if (conversationId === 'conv-support-3') {
    initialMessages = [
      {
        content: 'Bonjour, j\'ai une question sur les méthodes de paiement acceptées.',
        isFromUser: true,
      },
      {
        content: 'Bonjour Sophie, nous acceptons Orange Money, Wave, Free Money et les cartes bancaires (VISA/Mastercard).',
        isFromUser: false,
      },
      {
        content: 'Parfait, merci pour votre aide !',
        isFromUser: true,
      },
      {
        content: 'De rien, n\'hésitez pas si vous avez d\'autres questions !',
        isFromUser: false,
      },
    ]
  } else if (conversationId === 'conv-support-4') {
    initialMessages = [
      {
        content: 'Bonjour, comment puis-je mettre en avant mes offres ?',
        isFromUser: true,
      },
      {
        content: 'Bonjour Fatou, vous pouvez utiliser la fonctionnalité "Boost" dans votre tableau de bord. Cela permet de mettre vos offres en avant pour une durée déterminée.',
        isFromUser: false,
      },
      {
        content: 'Combien ça coûte ?',
        isFromUser: true,
      },
      {
        content: 'Les prix varient selon la durée et le type de boost. Vous pouvez voir les tarifs dans la section "Boosts" de votre tableau de bord.',
        isFromUser: false,
      },
    ]
  } else if (conversationId === 'conv-support-5') {
    initialMessages = [
      {
        content: 'Je souhaite signaler un prestataire pour comportement inapproprié.',
        isFromUser: true,
      },
      {
        content: 'Bonjour John, nous prenons ces signalements très au sérieux. Pouvez-vous me donner plus de détails sur ce qui s\'est passé ?',
        isFromUser: false,
      },
      {
        content: 'Le prestataire a été très désagréable lors de ma réservation et a annulé au dernier moment sans raison valable.',
        isFromUser: true,
      },
      {
        content: 'Je comprends votre frustration. Nous allons examiner ce cas. Pouvez-vous me donner le nom du prestataire et la date de l\'incident ?',
        isFromUser: false,
      },
    ]
  } else {
    // Messages par défaut
    initialMessages = [
      {
        content: 'Bonjour, j\'ai besoin d\'aide.',
        isFromUser: true,
      },
      {
        content: 'Bonjour, comment puis-je vous aider aujourd\'hui ?',
        isFromUser: false,
      },
    ]
  }

  initialMessages.forEach((msg, index) => {
    messages.push({
      id: `msg-${conversationId}-${index}`,
      content: msg.content,
      senderId: msg.isFromUser ? otherUserId : currentUserId,
      senderName: msg.isFromUser ? otherUserName : 'Administrateur',
      senderAvatar: undefined,
      timestamp: new Date(Date.now() - ((initialMessages.length - index) * 600000)), // Messages espacés de 10 min
      isRead: !msg.isFromUser || index < initialMessages.length - 1,
      isFromUser: msg.isFromUser,
    })
  })

  return messages
}

// Obtenir les informations d'un utilisateur de support par ID
export function getSupportUserById(userId: string): MockSupportUser | undefined {
  return mockSupportUsers.find(u => u.id === userId)
}

