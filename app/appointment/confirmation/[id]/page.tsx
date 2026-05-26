'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { createClient } from '@/lib/supabase/client'

interface AppointmentData {
  id: string
  appointment_date: string
  consultation_type: string
  cost: number
  notes?: string
  doctor_id: string
  specialty: string
}

interface Doctor {
  full_name: string
}

export default function ConfirmationPage() {
  const router = useRouter()
  const params = useParams()
  const appointmentId = params.id as string

  const [appointment, setAppointment] = useState<AppointmentData | null>(null)
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    const loadAppointment = async () => {
      const { data: appointmentData, error: appointmentError } = await supabase
        .from('appointments')
        .select('*')
        .eq('id', appointmentId)
        .single()

      if (appointmentError || !appointmentData) {
        router.push('/dashboard')
        return
      }

      setAppointment(appointmentData)

      // Load doctor info
      const { data: doctorData } = await supabase.from('profiles').select('full_name').eq('id', appointmentData.doctor_id).single()

      if (doctorData) {
        setDoctor(doctorData)
      }

      setLoading(false)
    }

    loadAppointment()
  }, [appointmentId])

  if (loading || !appointment || !doctor) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p>Carregando...</p>
        </main>
        <Footer />
      </div>
    )
  }

  const appointmentDate = new Date(appointment.appointment_date)
  const formattedDate = appointmentDate.toLocaleDateString('pt-AO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-green-200 bg-green-50">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <CardTitle className="text-green-900">Consulta Agendada com Sucesso!</CardTitle>
              <CardDescription className="text-green-800">
                Sua consulta foi confirmada e o pagamento foi processado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-white border border-green-200 p-6 rounded-lg space-y-4">
                <h3 className="font-semibold text-lg text-foreground">Detalhes da Consulta</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Médico</p>
                    <p className="font-medium">{doctor.full_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tipo de Consulta</p>
                    <p className="font-medium">
                      {appointment.consultation_type === 'in-person' ? 'Presencial' : 'Online'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Data</p>
                    <p className="font-medium">{formattedDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Horário</p>
                    <p className="font-medium">
                      {appointmentDate.toLocaleTimeString('pt-AO', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Valor Pago</p>
                    <p className="font-medium text-secondary">AOA {appointment.cost.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">ID da Consulta</p>
                    <p className="font-mono text-xs break-all">{appointment.id}</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded">
                <p className="text-sm text-blue-900">
                  <strong>Próximos Passos:</strong>
                </p>
                <ul className="text-sm text-blue-800 mt-2 space-y-1 list-disc list-inside">
                  <li>Um email de confirmação foi enviado para sua caixa de entrada</li>
                  <li>Você receberá um lembrete 24 horas antes da consulta</li>
                  <li>Para consultas online, você receberá um link de acesso por email</li>
                  <li>Entre em contato conosco em caso de dúvidas</li>
                </ul>
              </div>

              <div className="flex flex-col gap-2">
                <Button asChild className="w-full">
                  <Link href="/dashboard">Ir para Meu Painel</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/appointment">Agendar Outra Consulta</Link>
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
