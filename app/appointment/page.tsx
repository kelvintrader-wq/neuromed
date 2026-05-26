'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { createClient } from '@/lib/supabase/client'

interface Doctor {
  id: string
  full_name: string
  profile_image_url?: string
  specializations?: string[]
  hourly_rate?: number
}

interface Specialty {
  value: string
  label: string
  description: string
}

const SPECIALTIES: Specialty[] = [
  {
    value: 'autism',
    label: 'Autismo',
    description: 'Avaliação e acompanhamento de espectro autista',
  },
  {
    value: 'tdah',
    label: 'TDAH',
    description: 'Transtorno do Déficit de Atenção com Hiperatividade',
  },
  {
    value: 'hyperactivity',
    label: 'Hiperatividade',
    description: 'Tratamento de problemas de hiperatividade',
  },
  {
    value: 'dyslexia',
    label: 'Dislexia',
    description: 'Avaliação e reabilitação de dislexia',
  },
  {
    value: 'cognitive_rehab',
    label: 'Reabilitação Cognitiva',
    description: 'Programas de reabilitação cognitiva especializada',
  },
]

export default function AppointmentPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [specialty, setSpecialty] = useState('')
  const [consultationType, setConsultationType] = useState('in-person')
  const [appointmentDate, setAppointmentDate] = useState('')
  const [appointmentTime, setAppointmentTime] = useState('')
  const [notes, setNotes] = useState('')
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [selectedDoctor, setSelectedDoctor] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState(1)

  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      if (!authUser) {
        router.push('/login')
        return
      }

      setUser(authUser)
    }

    checkAuth()
  }, [router])

  useEffect(() => {
    if (specialty) {
      loadDoctors()
    }
  }, [specialty])

  const loadDoctors = async () => {
    const { data, error: err } = await supabase
      .from('doctors')
      .select('id, full_name, profile_image_url, specializations, hourly_rate')
      .contains('specializations', [specialty])
      .eq('is_available', true)

    if (!err && data) {
      setDoctors(data as Doctor[])
    }
  }

  const handleBooking = async () => {
    setLoading(true)
    setError('')

    try {
      const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}`)

      const { data, error: bookingError } = await supabase
        .from('appointments')
        .insert([
          {
            patient_id: user.id,
            doctor_id: selectedDoctor,
            specialty: specialty,
            appointment_date: appointmentDateTime.toISOString(),
            consultation_type: consultationType,
            notes: notes || null,
            cost: doctors.find((d) => d.id === selectedDoctor)?.hourly_rate || 50.0,
            status: 'pending',
            payment_status: 'pending',
          },
        ])
        .select()

      if (bookingError) {
        setError('Erro ao agendar consulta. Por favor, tente novamente.')
        setLoading(false)
        return
      }

      // Proceed to payment simulation
      router.push(`/appointment/payment/${data[0].id}`)
    } catch (err) {
      setError('Ocorreu um erro. Por favor, tente novamente.')
      setLoading(false)
    }
  }

  const getMinDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  const handleNext = () => {
    if (step === 1 && specialty && consultationType) {
      setStep(2)
    } else if (step === 2 && appointmentDate && appointmentTime && selectedDoctor) {
      setStep(3)
    }
  }

  if (!user) {
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

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Agendar Consulta</CardTitle>
              <CardDescription>Passo {step} de 3 - Complete o formulário para agendar sua consulta</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
                  {error}
                </div>
              )}

              {/* Step 1: Select Specialty and Type */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-3">Selecione a Especialidade</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {SPECIALTIES.map((spec) => (
                        <button
                          key={spec.value}
                          onClick={() => setSpecialty(spec.value)}
                          className={`p-4 rounded border-2 text-left transition ${
                            specialty === spec.value
                              ? 'border-secondary bg-secondary/10'
                              : 'border-border hover:border-secondary/50'
                          }`}
                        >
                          <div className="font-medium">{spec.label}</div>
                          <div className="text-xs text-muted-foreground mt-1">{spec.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">Tipo de Consulta</label>
                    <div className="space-y-2">
                      {['in-person', 'online'].map((type) => (
                        <label key={type} className="flex items-center p-3 border rounded cursor-pointer hover:bg-muted">
                          <input
                            type="radio"
                            name="consultation_type"
                            value={type}
                            checked={consultationType === type}
                            onChange={(e) => setConsultationType(e.target.value)}
                            className="mr-3"
                          />
                          <span className="font-medium">{type === 'in-person' ? 'Presencial' : 'Online'}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <Button onClick={handleNext} className="w-full">
                    Próximo
                  </Button>
                </div>
              )}

              {/* Step 2: Select Date, Time and Doctor */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Médico</label>
                    <select
                      value={selectedDoctor}
                      onChange={(e) => setSelectedDoctor(e.target.value)}
                      className="w-full px-3 py-2 border rounded bg-background"
                    >
                      <option value="">Selecione um médico</option>
                      {doctors.length > 0 ? (
                        doctors.map((doctor) => (
                          <option key={doctor.id} value={doctor.id}>
                            Dr(a). {doctor.full_name}
                            {doctor.hourly_rate && ` - AOA ${doctor.hourly_rate.toFixed(2)}`}
                          </option>
                        ))
                      ) : (
                        <option disabled>Nenhum médico disponível</option>
                      )}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Data</label>
                      <Input
                        type="date"
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                        min={getMinDate()}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Hora</label>
                      <Input
                        type="time"
                        value={appointmentTime}
                        onChange={(e) => setAppointmentTime(e.target.value)}
                        min="08:00"
                        max="18:00"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Notas Adicionais</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Descreva seus sintomas ou dúvidas..."
                      className="w-full px-3 py-2 border rounded bg-background resize-none"
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
                      Voltar
                    </Button>
                    <Button onClick={handleNext} className="flex-1">
                      Próximo
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Confirm and Pay */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="bg-muted p-4 rounded space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Especialidade:</span>
                      <span>{SPECIALTIES.find((s) => s.value === specialty)?.label}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Tipo de Consulta:</span>
                      <span>{consultationType === 'in-person' ? 'Presencial' : 'Online'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Médico:</span>
                      <span>{doctors.find((d) => d.id === selectedDoctor)?.full_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Data e Hora:</span>
                      <span>
                        {appointmentDate} às {appointmentTime}
                      </span>
                    </div>
                    <div className="border-t pt-3 flex justify-between font-semibold">
                      <span>Valor:</span>
                      <span>AOA {(doctors.find((d) => d.id === selectedDoctor)?.hourly_rate || 50).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={() => setStep(2)} variant="outline" className="flex-1">
                      Voltar
                    </Button>
                    <Button onClick={handleBooking} disabled={loading} className="flex-1">
                      {loading ? 'Processando...' : 'Confirmar e Pagar'}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
