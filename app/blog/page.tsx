import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import Link from 'next/link'
import { Calendar, User, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Blog | NeuroMed+ - Artigos e Recursos',
  description: 'Leia artigos e recursos sobre saúde mental, neurodiversidade e bem-estar.',
}

const blogPosts = [
  {
    id: 1,
    title: 'Entendendo o Autismo: Mitos e Realidades',
    excerpt: 'Descubra os mitos mais comuns sobre autismo e como a educação pode transformar perspectivas.',
    author: 'Dra. Maria Santos',
    date: '15 de Maio de 2024',
    category: 'Autismo',
    image: '/placeholder-blog-1.png',
  },
  {
    id: 2,
    title: 'TDAH em Adultos: Diagnóstico Tardio e Esperança',
    excerpt: 'Muitos adultos descobrem que têm TDAH apenas na vida adulta. Saiba como isso pode mudar sua vida.',
    author: 'Dr. Carlos Oliveira',
    date: '10 de Maio de 2024',
    category: 'TDAH',
    image: '/placeholder-blog-2.png',
  },
  {
    id: 3,
    title: 'Bem-estar Mental no Trabalho: Dicas Práticas',
    excerpt: 'Estratégias simples para manter a saúde mental enquanto trabalha em um ambiente desafiador.',
    author: 'Dr. João Silva',
    date: '5 de Maio de 2024',
    category: 'Bem-estar',
    image: '/placeholder-blog-3.png',
  },
  {
    id: 4,
    title: 'Dislexia: Intervenção Precoce Salva Vidas',
    excerpt: 'Por que identificar dislexia cedo é crucial para o sucesso escolar das crianças.',
    author: 'Dra. Maria Santos',
    date: '1 de Maio de 2024',
    category: 'Dislexia',
    image: '/placeholder-blog-4.png',
  },
  {
    id: 5,
    title: 'Inteligência Artificial em Saúde Mental',
    excerpt: 'Como a IA está revolucionando o acompanhamento e tratamento em saúde mental.',
    author: 'Dr. João Silva',
    date: '25 de Abril de 2024',
    category: 'Inovação',
    image: '/placeholder-blog-5.png',
  },
  {
    id: 6,
    title: 'Apoio Familiar: Guia Completo para Pais',
    excerpt: 'Recursos e estratégias para apoiar melhor seu filho neurodivergente.',
    author: 'Equipa NeuroMed+',
    date: '20 de Abril de 2024',
    category: 'Família',
    image: '/placeholder-blog-6.png',
  },
]

export default function Blog() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-primary text-primary-foreground py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Blog NeuroMed+</h1>
            <p className="text-lg text-primary-foreground/90 max-w-2xl">
              Artigos, recursos e insights sobre saúde mental, neurodiversidade e bem-estar.
            </p>
          </div>
        </section>

        {/* Search and Filter */}
        <section className="bg-muted/30 py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <input 
                type="search" 
                placeholder="Buscar artigos..." 
                className="flex-1 px-4 py-2 rounded border border-border bg-background"
              />
              <select className="px-4 py-2 rounded border border-border bg-background">
                <option>Todas as categorias</option>
                <option>Autismo</option>
                <option>TDAH</option>
                <option>Dislexia</option>
                <option>Bem-estar</option>
              </select>
            </div>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="py-20 sm:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.id}`}>
                  <article className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg hover:border-primary transition-all h-full flex flex-col group">
                    {/* Image */}
                    <div className="bg-muted/50 aspect-video flex items-center justify-center overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 group-hover:from-primary/30 group-hover:to-accent/30 transition-colors" />
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-medium bg-accent/20 text-accent px-2 py-1 rounded">
                          {post.category}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>

                      <p className="text-muted-foreground text-sm mb-4 flex-1">
                        {post.excerpt}
                      </p>

                      <div className="space-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{post.date}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-4 text-primary font-medium text-sm group-hover:gap-3 transition-all">
                        Ler Mais
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Subscreva Nossa Newsletter</h2>
            <p className="mb-8 text-primary-foreground/90">
              Receba artigos e recursos valiosos diretamente na sua caixa de entrada.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="seu@email.com" 
                className="flex-1 px-4 py-2 rounded text-foreground"
              />
              <button className="px-6 py-2 bg-accent text-accent-foreground rounded font-medium hover:bg-accent/90">
                Subscrever
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
