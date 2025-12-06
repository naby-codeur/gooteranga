'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  MessageSquare, 
  Send, 
  Smile, 
  Paperclip, 
  Search,
  MoreVertical,
  Phone,
  Video,
  Check,
  CheckCheck,
  Clock
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  content: string
  senderId: string
  senderName: string
  senderAvatar?: string
  timestamp: Date
  isRead: boolean
  isFromUser: boolean
}

interface Conversation {
  id: string
  name: string
  avatar?: string
  lastMessage: string
  timestamp: Date
  unreadCount: number
  isOnline?: boolean
}

interface ChatInterfaceProps {
  conversations?: Conversation[]
  messages?: Message[]
  currentUserId: string
  onSendMessage?: (content: string, conversationId: string) => void
  onSelectConversation?: (conversationId: string) => void
  emptyStateTitle?: string
  emptyStateDescription?: string
}

export function ChatInterface({
  conversations = [],
  messages = [],
  currentUserId,
  onSendMessage,
  onSelectConversation,
  emptyStateTitle = "Aucun message",
  emptyStateDescription = "Vos conversations apparaîtront ici"
}: ChatInterfaceProps) {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messageInput, setMessageInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const currentMessages = selectedConversation
    ? messages.filter(msg => msg.senderId === selectedConversation || msg.senderId === currentUserId)
    : []

  const selectedConv = conversations.find(c => c.id === selectedConversation)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentMessages])

  const handleSendMessage = () => {
    if (messageInput.trim() && selectedConversation && onSendMessage) {
      onSendMessage(messageInput, selectedConversation)
      setMessageInput('')
    }
  }

  const handleSelectConversation = (id: string) => {
    setSelectedConversation(id)
    onSelectConversation?.(id)
  }

  return (
    <div className="flex h-[600px] rounded-lg border bg-background overflow-hidden shadow-lg">
      {/* Sidebar - Liste des conversations */}
      <div className="w-80 border-r bg-gradient-to-b from-orange-50/50 to-yellow-50/50 dark:from-orange-950/10 dark:to-yellow-950/10">
        <div className="p-4 border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
              Messages
            </h2>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-white/80 dark:bg-gray-800/80"
            />
          </div>
        </div>

        <div className="overflow-y-auto h-[calc(100%-100px)]">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
              <p className="text-sm text-muted-foreground">{emptyStateDescription}</p>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {filteredConversations.map((conversation, index) => (
                <motion.div
                  key={conversation.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleSelectConversation(conversation.id)}
                  className={cn(
                    "relative p-3 rounded-lg cursor-pointer transition-all duration-200",
                    "hover:bg-orange-100/50 dark:hover:bg-orange-900/20",
                    selectedConversation === conversation.id && "bg-gradient-to-r from-orange-100 to-yellow-100 dark:from-orange-900/30 dark:to-yellow-900/30 shadow-sm"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12 ring-2 ring-orange-200 dark:ring-orange-800">
                        <AvatarImage src={conversation.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-orange-400 to-yellow-400 text-white font-bold">
                          {conversation.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.isOnline && (
                        <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-sm truncate">{conversation.name}</h3>
                        <span className="text-xs text-muted-foreground">
                          {new Date(conversation.timestamp).toLocaleTimeString('fr-FR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                        {conversation.unreadCount > 0 && (
                          <Badge className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white h-5 min-w-5 flex items-center justify-center text-xs">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Zone de chat principale */}
      <div className="flex-1 flex flex-col">
        {selectedConversation && selectedConv ? (
          <>
            {/* Header de la conversation */}
            <div className="p-4 border-b bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 ring-2 ring-orange-200 dark:ring-orange-800">
                    <AvatarImage src={selectedConv.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-orange-400 to-yellow-400 text-white">
                      {selectedConv.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{selectedConv.name}</h3>
                    {selectedConv.isOnline && (
                      <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                        <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                        En ligne
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Zone des messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-white via-orange-50/30 to-yellow-50/30 dark:from-gray-900 dark:via-orange-950/10 dark:to-yellow-950/10">
              <div className="space-y-4">
                {currentMessages.length === 0 ? (
                  <div className="text-center py-12">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                    </motion.div>
                    <p className="text-muted-foreground">Aucun message dans cette conversation</p>
                  </div>
                ) : (
                  currentMessages.map((message, index) => {
                    const isOwn = message.senderId === currentUserId
                    const showAvatar = index === 0 || currentMessages[index - 1].senderId !== message.senderId

                    return (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={cn(
                          "flex gap-3",
                          isOwn && "flex-row-reverse"
                        )}
                      >
                        {showAvatar && !isOwn && (
                          <Avatar className="h-8 w-8 mt-1">
                            <AvatarImage src={message.senderAvatar} />
                            <AvatarFallback className="bg-gradient-to-br from-orange-400 to-yellow-400 text-white text-xs">
                              {message.senderName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        {showAvatar && isOwn && <div className="w-8" />}
                        <div className={cn(
                          "flex flex-col gap-1 max-w-[70%]",
                          isOwn && "items-end"
                        )}>
                          {showAvatar && (
                            <span className={cn(
                              "text-xs text-muted-foreground px-2",
                              isOwn && "text-right"
                            )}>
                              {message.senderName}
                            </span>
                          )}
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className={cn(
                              "rounded-2xl px-4 py-2 shadow-sm",
                              isOwn
                                ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-br-sm"
                                : "bg-white dark:bg-gray-800 border rounded-bl-sm"
                            )}
                          >
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          </motion.div>
                          <div className={cn(
                            "flex items-center gap-1 text-xs text-muted-foreground px-2",
                            isOwn && "flex-row-reverse"
                          )}>
                            <span>
                              {new Date(message.timestamp).toLocaleTimeString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            {isOwn && (
                              message.isRead ? (
                                <CheckCheck className="h-3 w-3 text-blue-500" />
                              ) : (
                                <Check className="h-3 w-3" />
                              )
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Zone de saisie */}
            <div className="p-4 border-t bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <div className="flex items-end gap-2">
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <Paperclip className="h-5 w-5" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    placeholder="Tapez votre message..."
                    className="pr-10 rounded-full border-2 focus:border-orange-400"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                  >
                    <Smile className="h-5 w-5" />
                  </Button>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    className="h-10 w-10 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 shadow-lg"
                    size="icon"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-50 dark:from-gray-900 dark:via-orange-950/10 dark:to-yellow-950/10">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center p-8"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              >
                <MessageSquare className="h-24 w-24 mx-auto text-orange-400 mb-6 opacity-50" />
              </motion.div>
              <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                {emptyStateTitle}
              </h3>
              <p className="text-muted-foreground max-w-sm">
                {emptyStateDescription}
              </p>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

