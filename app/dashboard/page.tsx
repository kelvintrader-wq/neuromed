'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      setUser(user)

      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (!profileError && profileData) {
        setProfile(profileData)
        
        // Redirect to role-specific dashboard
        if (profileData.role === 'patient') {
          router.push('/dashboard/patient')
        } else if (profileData.role === 'doctor') {
          router.push('/dashboard/doctor')
        } else if (profileData.role === 'admin') {
          router.push('/dashboard/admin')
        }
        return
      }

      setLoading(false)
    }

    getUser()
  }, [router])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Bem-vindo, {profile?.full_name || user?.email}!
              </h1>
              <p className="text-muted-foreground">
                Gerencie sua conta e acompanhamento na NeuroMed+
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Sair
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Meu Perfil</CardTitle>
                <CardDescription>Gerenciar informações pessoais</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <p className="text-sm">
                    <span className="font-medium">Email:</span> {user?.email}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Tipo de Conta:</span> {profile?.role === 'patient' ? 'Paciente' : 'Profissional'}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Verificado:</span> {profile?.is_verified ? 'Sim' : 'Não'}
                  </p>
                </div>
                <Link href="/profile">
                  <Button variant="outline" className="w-full">
                    Editar Perfil
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {profile?.role === 'patient' && (
              <Card>
                <CardHeader>
                  <CardTitle>Agendamentos</CardTitle>
                  <CardDescription>Visualizar e agendar consultas</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Você não tem agendamentos no momento.
                  </p>
                  <Link href="/appointment">
                    <Button className="w-full">Agendar Consulta</Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {profile?.role === 'doctor' && (
              <Card>
                <CardHeader>
                  <CardTitle>Meus Pacientes</CardTitle>
                  <CardDescription>Gerenciar pacientes e consultas</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Você não tem pacientes atribuídos no momento.
                  </p>
                  <Link href="/patients">
                    <Button variant="outline" className="w-full">
                      Ver Pacientes
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Próximos Passos</CardTitle>
              <CardDescription>Comece a usar a plataforma NeuroMed+</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {profile?.role === 'patient' && (
                  <>
                    <li className="flex items-start gap-3">
                      <span className="text-accent font-bold">1.</span>
                      <span>Complete seu perfil com informações médicas</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-accent font-bold">2.</span>
                      <span>Navegue pela lista de profissionais disponíveis</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-accent font-bold">3.</span>
                      <span>Agende sua primeira consulta</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-accent font-bold">4.</span>
                      <span>Comunique-se com seu profissional via chat</span>
                    </li>
                  </>
                )}
                {profile?.role === 'doctor' && (
                  <>
                    <li className="flex items-start gap-3">
                      <span className="text-accent font-bold">1.</span>
                      <span>Complete seu perfil profissional</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-accent font-bold">2.</span>
                      <span>Configure sua disponibilidade</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-accent font-bold">3.</span>
                      <span>Receba pacientes e gerencie consultas</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-accent font-bold">4.</span>
                      <span>Mantenha registros médicos eletrônicos</span>
                    </li>
                  </>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
