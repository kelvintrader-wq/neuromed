'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useAuth } from '@/lib/hooks/useAuth'

export default function SignupPage() {
  const { signup } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [accountType, setAccountType] = useState<'patient' | 'doctor'>('patient')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!fullName.trim()) {
      setError('Nome completo é obrigatório')
      return
    }

    if (password.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres')
      return
    }

    if (password !== confirmPassword) {
      setError('As senhas não correspondem')
      return
    }

    if (!agreeTerms) {
      setError('Você deve concordar com os Termos de Serviço')
      return
    }

    setLoading(true)

    const result = await signup({
      fullName,
      email,
      password,
      role: accountType,
    })

    if (!result.success) {
      setError(result.error || 'Cadastro falhou')
    }

    setLoading(false)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-card p-8 rounded-lg border border-border">
            <h1 className="text-3xl font-bold text-foreground mb-2 text-center">Criar Conta</h1>
            <p className="text-muted-foreground text-center mb-8">
              Junte-se à NeuroMed+ para acessar nossos serviços
            </p>

            {error && (
              <div className="mb-6 p-3 bg-destructive/10 border border-destructive text-destructive rounded text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Tipo de Conta
                </label>
                <div className="flex gap-3">
                  <label className="flex-1 flex items-center gap-2 p-3 border border-border rounded cursor-pointer hover:bg-muted transition-colors" style={{ borderColor: accountType === 'patient' ? 'var(--secondary)' : undefined, backgroundColor: accountType === 'patient' ? 'var(--secondary)' : undefined }}>
                    <input
                      type="radio"
                      name="accountType"
                      value="patient"
                      checked={accountType === 'patient'}
                      onChange={(e) => setAccountType(e.target.value as 'patient' | 'doctor')}
                      disabled={loading}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium">Paciente</span>
                  </label>
                  <label className="flex-1 flex items-center gap-2 p-3 border border-border rounded cursor-pointer hover:bg-muted transition-colors" style={{ borderColor: accountType === 'doctor' ? 'var(--secondary)' : undefined, backgroundColor: accountType === 'doctor' ? 'var(--secondary)' : undefined }}>
                    <input
                      type="radio"
                      name="accountType"
                      value="doctor"
                      checked={accountType === 'doctor'}
                      onChange={(e) => setAccountType(e.target.value as 'patient' | 'doctor')}
                      disabled={loading}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium">Médico</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nome Completo
                </label>
                <Input
                  type="text"
                  placeholder="João Silva"
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

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  disabled={loading}
                  className="w-4 h-4 mt-1"
                />
                <span className="text-sm text-muted-foreground">
                  Concordo com os <Link href="#" className="text-primary hover:underline">Termos de Serviço</Link> e <Link href="#" className="text-primary hover:underline">Política de Privacidade</Link>
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
                  Entre aqui
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
