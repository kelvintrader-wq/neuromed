import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

export const metadata = {
  title: 'Sobre NeuroMed+ | Clínica de Saúde Mental',
  description: 'Conheça a missão, visão e valores da NeuroMed+. Profissionais especializados em saúde mental e reabilitação cognitiva.',
}

export default function About() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-primary text-primary-foreground py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Sobre NeuroMed+</h1>
            <p className="text-lg text-primary-foreground/90 max-w-2xl">
              Uma clínica dedicada à transformação de vidas através da saúde mental humanizada e inovadora.
            </p>
          </div>
        </section>

        {/* Missão */}
        <section className="py-20 sm:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-1 bg-muted/50 p-8 rounded-lg">
                <h2 className="text-2xl font-bold text-primary mb-4">Missão</h2>
                <p className="text-foreground leading-relaxed">
                  Promover saúde mental e bem-estar através de serviços humanizados e inovadores, oferecendo acompanhamento especializado a pacientes neurodivergentes e apoio preventivo em saúde laboral.
                </p>
              </div>

              <div className="lg:col-span-1 bg-muted/50 p-8 rounded-lg">
                <h2 className="text-2xl font-bold text-primary mb-4">Visão</h2>
                <p className="text-foreground leading-relaxed">
                  Ser referência nacional em saúde mental e reabilitação cognitiva, integrando tecnologia, inteligência artificial e atendimento humanizado para uma sociedade mais inclusiva e resiliente.
                </p>
              </div>

              <div className="lg:col-span-1 bg-muted/50 p-8 rounded-lg">
                <h2 className="text-2xl font-bold text-primary mb-4">Valores</h2>
                <ul className="space-y-3 text-foreground text-sm">
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span><strong>Humanização</strong>: Empatia e respeito</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span><strong>Inovação</strong>: Tecnologia ao serviço</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span><strong>Excelência</strong>: Qualidade sempre</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 sm:py-32 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-16 text-center">
              Nossa Equipa
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { name: 'Dr. João Silva', role: 'Diretor Clínico', speciality: 'Neuropsicologia' },
                { name: 'Dra. Maria Santos', role: 'Psicóloga', speciality: 'Autismo e TDAH' },
                { name: 'Dr. Carlos Oliveira', role: 'Terapeuta', speciality: 'Reabilitação Cognitiva' },
              ].map((person, idx) => (
                <div key={idx} className="bg-card p-8 rounded-lg border border-border text-center">
                  <div className="w-20 h-20 rounded-full bg-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground">{person.name}</h3>
                  <p className="text-accent font-medium mb-1">{person.role}</p>
                  <p className="text-muted-foreground text-sm">{person.speciality}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Quer Conhecer Melhor Nossa Clínica?</h2>
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/contact">Entre em Contacto</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
