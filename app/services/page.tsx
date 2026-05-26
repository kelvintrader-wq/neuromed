import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Brain, Target, Users, Award } from 'lucide-react'

export const metadata = {
  title: 'Serviços | NeuroMed+ - Clínica Especializada',
  description: 'Conheça nossos serviços especializados em autismo, TDAH, dislexia e reabilitação cognitiva.',
}

const services = [
  {
    id: 'autism',
    title: 'Autismo',
    icon: Brain,
    description: 'Avaliação diagnóstica, intervenção comportamental e apoio familiar especializado.',
    features: [
      'Diagnóstico diferencial completo',
      'Intervenção comportamental estruturada',
      'Terapia de desenvolvimento social',
      'Apoio familiar e escolar',
    ],
  },
  {
    id: 'adhd',
    title: 'TDAH',
    icon: Target,
    description: 'Avaliação multidisciplinar e estratégias de manejo do Transtorno do Déficit de Atenção e Hiperatividade.',
    features: [
      'Avaliação neuropsicológica completa',
      'Treinamento de funções executivas',
      'Coaching comportamental',
      'Orientação a pais e educadores',
    ],
  },
  {
    id: 'dyslexia',
    title: 'Dislexia',
    icon: Award,
    description: 'Reabilitação especializada de distúrbios de leitura e escrita com métodos comprovados.',
    features: [
      'Avaliação de fluência leitura',
      'Programas de reabilitação adaptados',
      'Treino de processamento fonológico',
      'Acompanhamento escolar integrado',
    ],
  },
  {
    id: 'rehabilitation',
    title: 'Reabilitação Cognitiva',
    icon: Users,
    description: 'Recuperação e otimização de funções cognitivas através de programas personalizados.',
    features: [
      'Avaliação neuropsicológica detalhada',
      'Treinamento de memória e atenção',
      'Estimulação cognitiva personalizada',
      'Monitoramento de progresso contínuo',
    ],
  },
]

export default function Services() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-primary text-primary-foreground py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Nossos Serviços</h1>
            <p className="text-lg text-primary-foreground/90 max-w-2xl">
              Soluções especializadas para cada necessidade neurodivergente, desenvolvidas com expertise e inovação.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 sm:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-16">
              {services.map((service, idx) => {
                const Icon = service.icon
                return (
                  <div key={service.id} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                    <div className={idx % 2 === 1 ? 'lg:order-2' : ''}>
                      <Icon className="w-16 h-16 text-accent mb-6" />
                      <h2 className="text-3xl font-bold text-foreground mb-4">{service.title}</h2>
                      <p className="text-lg text-muted-foreground mb-8">{service.description}</p>
                      <ul className="space-y-3 mb-8">
                        {service.features.map((feature, fidx) => (
                          <li key={fidx} className="flex gap-3">
                            <span className="text-accent font-bold">✓</span>
                            <span className="text-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                        <Link href="/appointment">Agendar Consulta</Link>
                      </Button>
                    </div>
                    <div className="bg-muted/50 rounded-lg aspect-square flex items-center justify-center">
                      <Icon className="w-24 h-24 text-muted-foreground/30" />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Additional Services */}
        <section className="bg-muted/30 py-20 sm:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Serviços Complementares</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Consultas Online', desc: 'Acompanhamento remoto seguro e eficaz' },
                { title: 'Avaliação Dinâmica', desc: 'Diagnóstico baseado em evidências' },
                { title: 'Workshops', desc: 'Capacitação para pais e educadores' },
                { title: 'Apoio Escolar', desc: 'Integração na educação formal' },
                { title: 'Coaching Profissional', desc: 'Inclusão no mercado de trabalho' },
                { title: 'Grupos de Apoio', desc: 'Comunidade e suporte entre pares' },
              ].map((svc, idx) => (
                <div key={idx} className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-2">{svc.title}</h3>
                  <p className="text-muted-foreground text-sm">{svc.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Pronto para Começar o Seu Acompanhamento?</h2>
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/appointment">Agendar Consulta Inicial</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
