'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [accountType, setAccountType] = useState('patient')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('As senhas não correspondem')
      return
    }

    if (!agreeTerms) {
      setError('Você deve concordar com os Termos de Serviço')
      return
    }

    setLoading(true)

    const supabase = createClient()
    const { error: signUpError, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? `${window.location.origin}/auth/callback`,
        data: {
          full_name: fullName,
          phone,
          role: accountType,
        },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      // If email confirmation is not required, auto-create patient/doctor record
      if (accountType === 'patient') {
        const { error: patientError } = await supabase.from('patients').insert({
          id: data.user.id,
          preferred_language: 'pt',
        })
        if (patientError) console.error('Error creating patient record:', patientError)
      } else if (accountType === 'doctor') {
        const { error: doctorError } = await supabase.from('doctors').insert({
          id: data.user.id,
        })
        if (doctorError) console.error('Error creating doctor record:', doctorError)
      }
    }

    setSuccess(true)
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  }

  if (success) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <div className="w-full max-w-md">
            <div className="bg-card p-8 rounded-lg border border-border text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Verificação de Email</h2>
              <p className="text-muted-foreground mb-4">
                Um link de confirmação foi enviado para <strong>{email}</strong>. Clique no link para verificar sua conta.
              </p>
              <p className="text-sm text-muted-foreground">
                Você será redirecionado para fazer login em alguns momentos...
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-card p-8 rounded-lg border border-border">
            <h1 className="text-3xl font-bold text-foreground mb-2 text-center">Cadastrar</h1>
            <p className="text-muted-foreground text-center mb-8">
              Crie sua conta e comece seu acompanhamento
            </p>

            {error && (
              <div className="mb-6 p-3 bg-destructive/10 border border-destructive text-destructive rounded text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nome Completo
                </label>
                <Input
                  placeholder="Seu nome completo"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Telefone
                </label>
                <Input
                  placeholder="+244 XXX XXX XXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Tipo de Conta
                </label>
                <select
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value)}
                  disabled={loading}
                >
                  <option value="patient">Paciente</option>
                  <option value="doctor">Profissional</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Senha
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Confirmar Senha
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <label className="flex items-start gap-2 mb-6">
                <input
                  type="checkbox"
                  className="w-4 h-4 mt-1"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  disabled={loading}
                />
                <span className="text-sm text-muted-foreground">
                  Concordo com os{' '}
                  <Link href="#" className="text-primary hover:underline">
                    Termos de Serviço
                  </Link>{' '}
                  e{' '}
                  <Link href="#" className="text-primary hover:underline">
                    Política de Privacidade
                  </Link>
                </span>
              </label>

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? 'Criando conta...' : 'Criar Conta'}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-center text-muted-foreground text-sm">
                Já tem conta?{' '}
                <Link href="/login" className="text-primary font-medium hover:underline">
                  Entrar
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
