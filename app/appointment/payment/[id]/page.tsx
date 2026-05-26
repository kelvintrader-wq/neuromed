'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { createClient } from '@/lib/supabase/client'

interface Appointment {
  id: string
  cost: number
  specialty: string
  appointment_date: string
  consultation_type: string
  status: string
}

export default function PaymentPage() {
  const router = useRouter()
  const params = useParams()
  const appointmentId = params.id as string

  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [cardNumber, setCardNumber] = useState('')
  const [cardName, setCardName] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    const loadAppointment = async () => {
      const { data, error: err } = await supabase
        .from('appointments')
        .select('*')
        .eq('id', appointmentId)
        .single()

      if (err || !data) {
        setError('Consulta não encontrada')
        return
      }

      setAppointment(data)
    }

    loadAppointment()
  }, [appointmentId])

  const formatCardNumber = (value: string) => {
    return value
      .replace(/\s/g, '')
      .replace(/(\d{4})/g, '$1 ')
      .trim()
  }

  const formatExpiryDate = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .substring(0, 5)
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validation
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      setError('Número do cartão inválido')
      setLoading(false)
      return
    }

    if (cvv.length !== 3) {
      setError('CVV inválido')
      setLoading(false)
      return
    }

    // Simulate payment processing
    setTimeout(async () => {
      try {
        // Update appointment payment status
        const { error: updateError } = await supabase
          .from('appointments')
          .update({
            payment_status: 'completed',
            status: 'confirmed',
          })
          .eq('id', appointmentId)

        if (updateError) {
          setError('Erro ao processar pagamento')
          setLoading(false)
          return
        }

        setSuccess(true)
        // Redirect to confirmation after 2 seconds
        setTimeout(() => {
          router.push(`/appointment/confirmation/${appointmentId}`)
        }, 2000)
      } catch (err) {
        setError('Erro ao processar pagamento. Tente novamente.')
        setLoading(false)
      }
    }, 1500)
  }

  if (!appointment) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p>Carregando dados da consulta...</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Payment Form */}
            <Card>
              <CardHeader>
                <CardTitle>Dados de Pagamento</CardTitle>
                <CardDescription>Preencha seus dados de cartão para completar o pagamento</CardDescription>
              </CardHeader>
              <CardContent>
                {success && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded">
                    Pagamento processado com sucesso! Redirecionando...
                  </div>
                )}

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
                    {error}
                  </div>
                )}

                <form onSubmit={handlePayment} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nome no Cartão</label>
                    <Input
                      type="text"
                      placeholder="JOÃO SILVA"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value.toUpperCase())}
                      required
                      disabled={loading || success}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Número do Cartão</label>
                    <Input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      maxLength={19}
                      required
                      disabled={loading || success}
                    />
                    <p className="text-xs text-muted-foreground mt-1">Use qualquer número de cartão válido</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Data de Validade</label>
                      <Input
                        type="text"
                        placeholder="MM/AA"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                        maxLength={5}
                        required
                        disabled={loading || success}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">CVV</label>
                      <Input
                        type="text"
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 3))}
                        maxLength={3}
                        required
                        disabled={loading || success}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading || success}>
                    {loading ? 'Processando...' : success ? 'Pagamento Realizado' : 'Confirmar Pagamento'}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Seu pagamento é seguro e criptografado. Esta é uma simulação para fins de demonstração.
                  </p>
                </form>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Resumo da Consulta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tipo de Consulta:</span>
                    <span className="font-medium">
                      {appointment.consultation_type === 'in-person' ? 'Presencial' : 'Online'}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Data e Hora:</span>
                    <span className="font-medium">{formattedDate}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Horário:</span>
                    <span className="font-medium">
                      {appointmentDate.toLocaleTimeString('pt-AO', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-semibold">Valor Total:</span>
                    <span className="font-bold text-secondary text-lg">AOA {appointment.cost.toFixed(2)}</span>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-3 rounded">
                  <p className="text-xs text-blue-800">
                    <strong>Nota:</strong> Um email de confirmação será enviado após o pagamento ser processado com sucesso.
                  </p>
                </div>

                <Button variant="outline" className="w-full" onClick={() => router.back()}>
                  Voltar
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
