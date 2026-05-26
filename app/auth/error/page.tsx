'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function AuthErrorPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-card p-8 rounded-lg border border-border text-center">
            <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Erro na Autenticação</h2>
            <p className="text-muted-foreground mb-6">
              Ocorreu um erro ao processar sua solicitação de autenticação. Por favor, tente novamente.
            </p>
            <div className="space-y-2">
              <Link href="/login">
                <Button className="w-full">Tentar Novamente</Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full">
                  Voltar ao Início
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
