'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { createClient } from '@/lib/supabase/client'

interface Appointment {
  id: string
  appointment_date: string
  status: string
  specialty: string
  consultation_type: string
  cost: number
  doctor?: {
    full_name: string
  }
}

interface UserProfile {
  id: string
  full_name: string
  email: string
  phone?: string
  profile_image_url?: string
}

const SPECIALTY_LABELS: Record<string, string> = {
  autism: 'Autismo',
  tdah: 'TDAH',
  hyperactivity: 'Hiperatividade',
  dyslexia: 'Dislexia',
  cognitive_rehab: 'Reabilitação Cognitiva',
}

export default function PatientDashboard() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      // Load profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileData) {
        setProfile(profileData)
      }

      // Load appointments
      const { data: appointmentsData } = await supabase
        .from('appointments')
        .select('*, doctor:doctor_id(full_name)')
        .eq('patient_id', user.id)
        .order('appointment_date', { ascending: false })

      if (appointmentsData) {
        setAppointments(appointmentsData)
      }

      setLoading(false)
    }

    loadData()
  }, [router])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmada'
      case 'pending':
        return 'Pendente'
      case 'completed':
        return 'Concluída'
      case 'cancelled':
        return 'Cancelada'
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p>Carregando dados...</p>
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
          {/* Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle>Meu Perfil</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  {profile?.profile_image_url ? (
                    <img
                      src={profile.profile_image_url}
                      alt={profile.full_name}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center text-white text-2xl font-bold">
                      {profile?.full_name
                        ?.split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-2xl font-bold">{profile?.full_name}</h3>
                  <p className="text-muted-foreground">{profile?.email}</p>
                  {profile?.phone && <p className="text-muted-foreground">{profile.phone}</p>}
                  <Button asChild variant="outline" className="mt-4">
                    <Link href="/dashboard/profile">Editar Perfil</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appointments Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Minhas Consultas</h2>
              <Button asChild>
                <Link href="/appointment">Nova Consulta</Link>
              </Button>
            </div>

            {appointments.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground mb-4">Você ainda não tem nenhuma consulta agendada</p>
                  <Button asChild>
                    <Link href="/appointment">Agendar Consulta Agora</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {appointments.map((appointment) => {
                  const appointmentDate = new Date(appointment.appointment_date)
                  const formattedDate = appointmentDate.toLocaleDateString('pt-AO', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                  const formattedTime = appointmentDate.toLocaleTimeString('pt-AO', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })

                  return (
                    <Card key={appointment.id}>
                      <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">
                                {appointment.doctor?.full_name || 'Médico'} -{' '}
                                {SPECIALTY_LABELS[appointment.specialty] || appointment.specialty}
                              </h3>
                              <span className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusColor(appointment.status)}`}>
                                {getStatusLabel(appointment.status)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {formattedDate} às {formattedTime}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Tipo: {appointment.consultation_type === 'in-person' ? 'Presencial' : 'Online'}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button asChild variant="outline" size="sm">
                              <Link href={`/dashboard/appointment/${appointment.id}`}>Ver Detalhes</Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
