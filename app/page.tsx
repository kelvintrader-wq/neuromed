import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import Link from 'next/link'
import { Heart, Brain, Users, Zap, Shield, Smile } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary via-primary to-primary/95 text-primary-foreground py-20 sm:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Saúde Mental e Bem-estar para sua Qualidade de Vida
                </h1>
                <p className="text-lg text-primary-foreground/90 mb-8 max-w-xl leading-relaxed">
                  Acompanhamento especializado e humanizado para pacientes neurodivergentes. NeuroMed+ integra tecnologia e cuidado humano para transformar vidas em Angola.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <Link href="/appointment">Agendar Consulta</Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                    <Link href="/about">Saiba Mais</Link>
                  </Button>
                </div>
              </div>
              <div className="relative hidden lg:block">
                <div className="aspect-square rounded-lg bg-primary-foreground/10 flex items-center justify-center">
                  <Brain className="w-32 h-32 text-primary-foreground/30" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 sm:py-32 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Por que escolher NeuroMed+?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Combinamos experiência clínica com inovação tecnológica para oferecer o melhor cuidado.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-card p-8 rounded-lg border border-border hover:shadow-lg transition-shadow">
                <Heart className="w-12 h-12 text-accent mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-3">Humanização</h3>
                <p className="text-muted-foreground">
                  Atendimento empático e centrado na pessoa, respeitando sua singularidade e necessidades.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-card p-8 rounded-lg border border-border hover:shadow-lg transition-shadow">
                <Zap className="w-12 h-12 text-accent mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-3">Inovação</h3>
                <p className="text-muted-foreground">
                  Uso de tecnologia e inteligência artificial para potencializar resultados terapêuticos.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-card p-8 rounded-lg border border-border hover:shadow-lg transition-shadow">
                <Users className="w-12 h-12 text-accent mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-3">Inclusão</h3>
                <p className="text-muted-foreground">
                  Ambientes seguros e acessíveis para pacientes, famílias e profissionais.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-card p-8 rounded-lg border border-border hover:shadow-lg transition-shadow">
                <Shield className="w-12 h-12 text-accent mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-3">Confidencialidade</h3>
                <p className="text-muted-foreground">
                  Dados protegidos e relações transparentes de apoio contínuo com clientes.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-card p-8 rounded-lg border border-border hover:shadow-lg transition-shadow">
                <Brain className="w-12 h-12 text-accent mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-3">Excelência</h3>
                <p className="text-muted-foreground">
                  Profissionais especializados comprometidos com qualidade e impacto positivo.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-card p-8 rounded-lg border border-border hover:shadow-lg transition-shadow">
                <Smile className="w-12 h-12 text-accent mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-3">Prevenção</h3>
                <p className="text-muted-foreground">
                  Foco em saúde preventiva, reduzindo riscos de burnout e ansiedade laboral.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 sm:py-32 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Nossos Serviços Especializados
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Acompanhamento especializado para diferentes diagnósticos neurodivergentes
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Autismo', desc: 'Diagnóstico e intervenção para o espectro autista' },
                { title: 'TDAH', desc: 'Avaliação e tratamento do Transtorno do Déficit de Atenção' },
                { title: 'Hiperatividade', desc: 'Manejo comportamental e terapêutico' },
                { title: 'Dislexia', desc: 'Reabilitação de distúrbios de leitura e escrita' },
                { title: 'Reabilitação Cognitiva', desc: 'Recuperação de funções cognitivas' },
                { title: 'Apoio Laboral', desc: 'Inclusão e adaptação no ambiente de trabalho' },
              ].map((service, idx) => (
                <Link key={idx} href={`/services`} className="group">
                  <div className="bg-card p-6 rounded-lg border border-border hover:border-primary hover:shadow-lg transition-all h-full">
                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">{service.desc}</p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/services">Ver Todos os Serviços</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-primary-foreground py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Pronto para Começar?</h2>
            <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Agende uma consulta com nossos especialistas hoje mesmo. Estamos aqui para ajudar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/appointment">Agendar Agora</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                <Link href="/contact">Entre em Contacto</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
