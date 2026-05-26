import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary text-primary-foreground py-12 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="font-bold text-lg mb-4">NeuroMed+</h3>
            <p className="text-sm text-primary-foreground/80">
              Saúde mental e bem-estar para sua qualidade de vida.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Serviços</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/services/autism" className="text-sm text-primary-foreground/80 hover:text-primary-foreground">
                  Autismo
                </Link>
              </li>
              <li>
                <Link href="/services/adhd" className="text-sm text-primary-foreground/80 hover:text-primary-foreground">
                  TDAH
                </Link>
              </li>
              <li>
                <Link href="/services/dyslexia" className="text-sm text-primary-foreground/80 hover:text-primary-foreground">
                  Dislexia
                </Link>
              </li>
              <li>
                <Link href="/services/rehabilitation" className="text-sm text-primary-foreground/80 hover:text-primary-foreground">
                  Reabilitação Cognitiva
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Empresa</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-primary-foreground/80 hover:text-primary-foreground">
                  Sobre nós
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-primary-foreground/80 hover:text-primary-foreground">
                  Contacte-nos
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-primary-foreground/80 hover:text-primary-foreground">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>Email: info@neuromed.ao</li>
              <li>Telefone: +244 222 XXX XXX</li>
              <li>Endereço: Luanda, Angola</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary-foreground/20 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-primary-foreground/70">
            <p>&copy; {currentYear} NeuroMed+. Todos os direitos reservados.</p>
            <div className="flex gap-6 mt-4 sm:mt-0">
              <Link href="/privacy" className="hover:text-primary-foreground">
                Privacidade
              </Link>
              <Link href="/terms" className="hover:text-primary-foreground">
                Termos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
