'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { createClient } from '@/lib/supabase/client'

interface Notification {
  id: string
  title: string
  message: string
  type: string
  is_read: boolean
  created_at: string
}

export default function NotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    const loadNotifications = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (data) {
        setNotifications(data)
      }

      setLoading(false)
    }

    loadNotifications()
  }, [router])

  const markAsRead = async (notificationId: string) => {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)

    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
    )
  }

  const markAllAsRead = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false)

    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
  }

  const deleteNotification = async (notificationId: string) => {
    await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId)

    setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-l-4 border-l-green-500 bg-green-50'
      case 'warning':
        return 'border-l-4 border-l-yellow-500 bg-yellow-50'
      case 'error':
        return 'border-l-4 border-l-red-500 bg-red-50'
      default:
        return 'border-l-4 border-l-blue-500 bg-blue-50'
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p>Carregando notificações...</p>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Notificações</h1>
            {notifications.some((n) => !n.is_read) && (
              <Button variant="outline" onClick={markAllAsRead}>
                Marcar tudo como lido
              </Button>
            )}
          </div>

          {notifications.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Você não tem nenhuma notificação</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <Card key={notification.id} className={getTypeColor(notification.type)}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{notification.title}</h3>
                          {!notification.is_read && (
                            <span className="inline-block w-2 h-2 bg-primary rounded-full"></span>
                          )}
                        </div>
                        <p className="text-sm mt-2">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-3">
                          {new Date(notification.created_at).toLocaleString('pt-AO')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {!notification.is_read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                          >
                            Ler
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          Deletar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
