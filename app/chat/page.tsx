'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { createClient } from '@/lib/supabase/client'

interface Message {
  id: string
  sender_id: string
  receiver_id: string
  message: string
  created_at: string
  is_read: boolean
  sender?: {
    full_name: string
    profile_image_url?: string
  }
}

interface Contact {
  id: string
  full_name: string
  profile_image_url?: string
  role: string
}

export default function ChatPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      if (!authUser) {
        router.push('/login')
        return
      }

      setUser(authUser)
      loadContacts(authUser.id)
    }

    checkAuth()
  }, [router])

  const loadContacts = async (userId: string) => {
    try {
      // Get all contacts (other users)
      const { data: contactsData } = await supabase
        .from('profiles')
        .select('id, full_name, profile_image_url, role')
        .neq('id', userId)

      if (contactsData) {
        setContacts(contactsData)
      }
    } catch (err) {
      console.error('Error loading contacts:', err)
    }

    setLoading(false)
  }

  const loadMessages = async (contactId: string) => {
    try {
      const { data: messagesData } = await supabase
        .from('chat_messages')
        .select('*, sender:sender_id(full_name, profile_image_url)')
        .or(
          `and(sender_id.eq.${user.id},receiver_id.eq.${contactId}),and(sender_id.eq.${contactId},receiver_id.eq.${user.id})`
        )
        .order('created_at', { ascending: true })

      if (messagesData) {
        setMessages(messagesData)

        // Mark messages as read
        await supabase
          .from('chat_messages')
          .update({ is_read: true })
          .eq('receiver_id', user.id)
          .eq('sender_id', contactId)
      }
    } catch (err) {
      console.error('Error loading messages:', err)
    }
  }

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact)
    loadMessages(contact.id)
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim() || !selectedContact) {
      return
    }

    setSending(true)

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert([
          {
            sender_id: user.id,
            receiver_id: selectedContact.id,
            message: newMessage,
          },
        ])
        .select('*, sender:sender_id(full_name, profile_image_url)')

      if (!error && data) {
        setMessages((prev) => [...prev, ...data])
        setNewMessage('')
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }
    } catch (err) {
      console.error('Error sending message:', err)
    }

    setSending(false)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p>Carregando mensagens...</p>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-8 px-4">
        <div className="max-w-6xl mx-auto h-screen flex gap-6">
          {/* Contacts Sidebar */}
          <div className="w-full md:w-80 flex flex-col">
            <Card className="flex-1 flex flex-col">
              <CardHeader>
                <CardTitle>Mensagens</CardTitle>
                <CardDescription>Selecione um contato para conversar</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto space-y-2">
                {contacts.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Nenhum contato disponível
                  </p>
                ) : (
                  contacts.map((contact) => (
                    <button
                      key={contact.id}
                      onClick={() => handleSelectContact(contact)}
                      className={`w-full p-3 rounded text-left transition ${
                        selectedContact?.id === contact.id
                          ? 'bg-secondary text-secondary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {contact.profile_image_url ? (
                          <img
                            src={contact.profile_image_url}
                            alt={contact.full_name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold">
                            {contact.full_name
                              ?.split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-sm">{contact.full_name}</p>
                          <p className="text-xs text-muted-foreground">{contact.role}</p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          {selectedContact ? (
            <div className="flex-1 flex flex-col gap-6">
              <Card className="flex-1 flex flex-col">
                <CardHeader className="border-b">
                  <div className="flex items-center gap-3">
                    {selectedContact.profile_image_url ? (
                      <img
                        src={selectedContact.profile_image_url}
                        alt={selectedContact.full_name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold">
                        {selectedContact.full_name
                          ?.split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                    )}
                    <div>
                      <CardTitle className="text-lg">{selectedContact.full_name}</CardTitle>
                      <CardDescription className="text-xs">Online</CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      Nenhuma mensagem ainda. Comece a conversar!
                    </p>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`px-4 py-2 rounded-lg max-w-xs ${
                            msg.sender_id === user.id
                              ? 'bg-secondary text-secondary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{msg.message}</p>
                          <p
                            className={`text-xs mt-1 ${
                              msg.sender_id === user.id
                                ? 'text-secondary-foreground/70'
                                : 'text-muted-foreground'
                            }`}
                          >
                            {new Date(msg.created_at).toLocaleTimeString('pt-AO', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </CardContent>
              </Card>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Digite sua mensagem..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  disabled={sending}
                />
                <Button type="submit" disabled={sending || !newMessage.trim()}>
                  {sending ? 'Enviando...' : 'Enviar'}
                </Button>
              </form>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-muted-foreground">Selecione um contato para iniciar uma conversa</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
