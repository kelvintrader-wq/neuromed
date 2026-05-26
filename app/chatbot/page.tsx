'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useChat } from 'ai/react'

export default function ChatbotPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-8 px-4">
        <div className="max-w-2xl mx-auto h-screen flex flex-col">
          <Card className="flex-1 flex flex-col">
            <CardHeader>
              <CardTitle>Assistente NeuroMed+</CardTitle>
              <CardDescription>
                Olá! Sou a IA assistente da NeuroMed+. Como posso ajudá-lo hoje?
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-white">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <p className="text-muted-foreground max-w-sm">
                    Bem-vindo ao assistente da NeuroMed+! Você pode fazer perguntas sobre:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Informações sobre serviços e especialidades</li>
                    <li>• Orientações sobre saúde mental</li>
                    <li>• Dúvidas sobre agendamento</li>
                    <li>• Informações sobre transtornos neurodivergentes</li>
                  </ul>
                </div>
              )}

              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`px-4 py-3 rounded-lg max-w-xs ${
                      msg.role === 'user'
                        ? 'bg-secondary text-secondary-foreground'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="px-4 py-3 rounded-lg bg-muted">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </CardContent>

            <div className="border-t p-4 space-y-3">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Digite sua mensagem..."
                  value={input}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button type="submit" disabled={isLoading || !input.trim()}>
                  {isLoading ? 'Enviando...' : 'Enviar'}
                </Button>
              </form>

              <p className="text-xs text-muted-foreground text-center">
                O assistente NeuroMed+ é apenas informativo. Para diagnóstico ou tratamento, consulte um profissional.
              </p>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
