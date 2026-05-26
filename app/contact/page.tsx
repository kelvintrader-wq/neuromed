import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'

export const metadata = {
  title: 'Contacte-nos | NeuroMed+',
  description: 'Entre em contacto com a NeuroMed+ para agendar uma consulta ou tirar dúvidas.',
}

export default function Contact() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-primary text-primary-foreground py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Entre em Contacto</h1>
            <p className="text-lg text-primary-foreground/90">
              Estamos aqui para ajudar. Contacte-nos por qualquer dúvida ou para agendar uma consulta.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-20 sm:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
              {/* Contact Info */}
              <div className="lg:col-span-1 space-y-8">
                <div className="flex gap-4">
                  <MapPin className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Endereço</h3>
                    <p className="text-muted-foreground">Avenida Principal, Luanda, Angola</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Phone className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Telefone</h3>
                    <p className="text-muted-foreground">+244 222 XXX XXX</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Mail className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Email</h3>
                    <p className="text-muted-foreground">info@neuromed.ao</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Clock className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Horário</h3>
                    <p className="text-muted-foreground text-sm">Segunda a Sexta: 08h - 18h</p>
                    <p className="text-muted-foreground text-sm">Sábado: 09h - 13h</p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="lg:col-span-2 bg-muted/30 p-8 rounded-lg">
                <h2 className="text-2xl font-bold text-foreground mb-6">Envie-nos uma Mensagem</h2>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Nome</label>
                      <Input placeholder="Seu nome" className="bg-background" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                      <Input type="email" placeholder="seu@email.com" className="bg-background" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Telefone</label>
                    <Input placeholder="+244 XXX XXX XXX" className="bg-background" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Assunto</label>
                    <Input placeholder="Como podemos ajudar?" className="bg-background" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Mensagem</label>
                    <Textarea 
                      placeholder="Descreva sua consulta..." 
                      className="bg-background min-h-32"
                    />
                  </div>

                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    Enviar Mensagem
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Map Placeholder */}
        <section className="bg-muted/30 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-muted rounded-lg aspect-video flex items-center justify-center border border-border">
              <p className="text-muted-foreground">Mapa da localização virá aqui</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
