'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
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
  patient?: {
    full_name: string
    profile_image_url?: string
  }
}

const SPECIALTY_LABELS: Record<string, string> = {
  autism: 'Autismo',
  tdah: 'TDAH',
  hyperactivity: 'Hiperatividade',
  dyslexia: 'Dislexia',
  cognitive_rehab: 'Reabilitação Cognitiva',
}

export default function DoctorDashboard() {
  const router = useRouter()
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

      // Load appointments
      const { data: appointmentsData } = await supabase
        .from('appointments')
        .select('*, patient:patient_id(full_name, profile_image_url)')
        .eq('doctor_id', user.id)
        .order('appointment_date', { ascending: true })

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

  const upcomingAppointments = appointments.filter(
    (apt) => new Date(apt.appointment_date) > new Date() && apt.status !== 'cancelled'
  )

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Consultas Pendentes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {appointments.filter((a) => a.status === 'pending').length}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Próximas Consultas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{upcomingAppointments.length}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total de Pacientes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {new Set(appointments.map((a) => a.patient?.full_name)).size}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Appointments List */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Agenda de Consultas</h2>

            {appointments.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Você ainda não tem nenhuma consulta agendada</p>
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
                          <div className="flex items-start gap-4 flex-1">
                            {appointment.patient?.profile_image_url ? (
                              <img
                                src={appointment.patient.profile_image_url}
                                alt={appointment.patient.full_name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white text-xs font-bold">
                                {appointment.patient?.full_name
                                  ?.split(' ')
                                  .map((n) => n[0])
                                  .join('')}
                              </div>
                            )}
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">
                                  {appointment.patient?.full_name || 'Paciente'} -{' '}
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
                          </div>
                          <Button variant="outline" size="sm">
                            Gerenciar
                          </Button>
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
