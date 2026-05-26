'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { NotificationsBell } from '@/components/notifications-bell'

export function Header() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-40 bg-background border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">N+</span>
            </div>
            <span className="font-bold text-lg text-primary hidden sm:inline">NeuroMed+</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Início
            </Link>
            <Link href="/about" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Sobre
            </Link>
            <Link href="/services" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Serviços
            </Link>
            <Link href="/blog" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Blog
            </Link>
            <Link href="/contact" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Contacte-nos
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {!loading && user && (
              <>
                <NotificationsBell />
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard">Painel</Link>
                </Button>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Sair
                </Button>
              </>
            )}
            {!loading && !user && (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Entrar</Link>
                </Button>
                <Button size="sm" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href="/signup">Cadastrar</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
