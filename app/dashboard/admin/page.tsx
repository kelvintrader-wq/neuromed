'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { createClient } from '@/lib/supabase/client'

interface Stats {
  totalUsers: number
  totalPatients: number
  totalDoctors: number
  totalAppointments: number
  completedAppointments: number
  pendingAppointments: number
  totalRevenue: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    const loadStats = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      // Verify admin role
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profileData?.role !== 'admin') {
        router.push('/dashboard')
        return
      }

      try {
        // Get total users count
        const { data: usersData } = await supabase.from('profiles').select('id')

        // Get patients count
        const { data: patientsData } = await supabase.from('patients').select('id')

        // Get doctors count
        const { data: doctorsData } = await supabase.from('doctors').select('id')

        // Get appointments
        const { data: appointmentsData } = await supabase.from('appointments').select('*')

        const completedCount =
          appointmentsData?.filter((a) => a.status === 'completed').length || 0
        const pendingCount = appointmentsData?.filter((a) => a.status === 'pending').length || 0
        const totalRevenue =
          appointmentsData?.reduce((sum, a) => {
            if (a.payment_status === 'completed') {
              return sum + (a.cost || 0)
            }
            return sum
          }, 0) || 0

        setStats({
          totalUsers: usersData?.length || 0,
          totalPatients: patientsData?.length || 0,
          totalDoctors: doctorsData?.length || 0,
          totalAppointments: appointmentsData?.length || 0,
          completedAppointments: completedCount,
          pendingAppointments: pendingCount,
          totalRevenue,
        })
      } catch (err) {
        console.error('Error loading stats:', err)
      }

      setLoading(false)
    }

    loadStats()
  }, [router])

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p>Carregando painel administrativo...</p>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Painel Administrativo</h1>
            <p className="text-muted-foreground">Gerencie a plataforma NeuroMed+</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total de Usuários</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-secondary">{stats?.totalUsers || 0}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pacientes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-600">{stats?.totalPatients || 0}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Profissionais</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-purple-600">{stats?.totalDoctors || 0}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Consultas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">{stats?.totalAppointments || 0}</p>
              </CardContent>
            </Card>
          </div>

          {/* Appointments Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Consultas Concluídas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">
                  {stats?.completedAppointments || 0}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {stats
                    ? (
                        ((stats.completedAppointments || 0) / (stats.totalAppointments || 1)) *
                        100
                      ).toFixed(1)
                    : 0}
                  % do total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Consultas Pendentes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-yellow-600">
                  {stats?.pendingAppointments || 0}
                </p>
                <p className="text-xs text-muted-foreground mt-2">Aguardando confirmação</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Receita Total</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-secondary">
                  AOA {(stats?.totalRevenue || 0).toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground mt-2">De pagamentos processados</p>
              </CardContent>
            </Card>
          </div>

          {/* Admin Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento</CardTitle>
              <CardDescription>Acesse as ferramentas de administração</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-auto py-4">
                  Gerenciar Usuários
                </Button>
                <Button variant="outline" className="h-auto py-4">
                  Gerenciar Profissionais
                </Button>
                <Button variant="outline" className="h-auto py-4">
                  Gerenciar Consultas
                </Button>
                <Button variant="outline" className="h-auto py-4">
                  Relatórios
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
