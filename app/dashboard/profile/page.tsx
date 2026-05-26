'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { createClient } from '@/lib/supabase/client'

interface UserProfile {
  id: string
  full_name: string
  email: string
  phone?: string
  date_of_birth?: string
  gender?: string
  address?: string
  city?: string
  province?: string
  postal_code?: string
  profile_image_url?: string
  bio?: string
}

export default function ProfileEditPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const supabase = createClient()

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileData) {
        setProfile(profileData)
      }

      setLoading(false)
    }

    loadProfile()
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile((prev) => (prev ? { ...prev, [name]: value } : null))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    if (!profile) {
      setSaving(false)
      return
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        full_name: profile.full_name,
        phone: profile.phone,
        date_of_birth: profile.date_of_birth,
        gender: profile.gender,
        address: profile.address,
        city: profile.city,
        province: profile.province,
        postal_code: profile.postal_code,
        bio: profile.bio,
      })
      .eq('id', profile.id)

    if (updateError) {
      setError('Erro ao salvar perfil. Tente novamente.')
      setSaving(false)
      return
    }

    setSuccess('Perfil atualizado com sucesso!')
    setSaving(false)

    setTimeout(() => {
      router.push('/dashboard/patient')
    }, 1500)
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p>Carregando perfil...</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p>Perfil não encontrado</p>
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
              <CardTitle>Editar Perfil</CardTitle>
              <CardDescription>Atualize suas informações pessoais</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded">
                  {success}
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nome Completo</label>
                    <Input
                      type="text"
                      name="full_name"
                      value={profile.full_name || ''}
                      onChange={handleChange}
                      placeholder="Seu nome completo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input type="email" value={profile.email} disabled className="bg-muted" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Telefone</label>
                    <Input
                      type="tel"
                      name="phone"
                      value={profile.phone || ''}
                      onChange={handleChange}
                      placeholder="+244 912 345 678"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Data de Nascimento</label>
                    <Input
                      type="date"
                      name="date_of_birth"
                      value={profile.date_of_birth || ''}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Gênero</label>
                  <select
                    name="gender"
                    value={profile.gender || ''}
                    onChange={(e) =>
                      setProfile((prev) => (prev ? { ...prev, gender: e.target.value } : null))
                    }
                    className="w-full px-3 py-2 border rounded bg-background"
                  >
                    <option value="">Selecionar</option>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                    <option value="Other">Outro</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Endereço</label>
                    <Input
                      type="text"
                      name="address"
                      value={profile.address || ''}
                      onChange={handleChange}
                      placeholder="Rua, número"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Cidade</label>
                    <Input
                      type="text"
                      name="city"
                      value={profile.city || ''}
                      onChange={handleChange}
                      placeholder="Luanda"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Província</label>
                    <Input
                      type="text"
                      name="province"
                      value={profile.province || ''}
                      onChange={handleChange}
                      placeholder="Luanda"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Código Postal</label>
                    <Input
                      type="text"
                      name="postal_code"
                      value={profile.postal_code || ''}
                      onChange={handleChange}
                      placeholder="1000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={profile.bio || ''}
                    onChange={handleChange}
                    placeholder="Fale um pouco sobre você..."
                    className="w-full px-3 py-2 border rounded bg-background resize-none"
                    rows={4}
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={saving} className="flex-1">
                    {saving ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
