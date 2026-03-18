import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-600 mt-16 transition-colors">
      <div className="container mx-auto px-4 max-w-6xl py-12">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center mb-3 w-fit group">
              <div className="bg-slate-900 dark:bg-transparent rounded-xl px-2 py-1">
                <Image
                  src="/logo.png"
                  alt="StackAdvisor"
                  width={150}
                  height={38}
                  className="h-8 w-auto object-contain group-hover:opacity-80 transition-opacity"
                />
              </div>
            </Link>
            <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">
              El motor de recomendación de tech stacks para startups y devs independientes.
            </p>
          </div>

          {/* Explorar */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-4">Explorar</h4>
            <ul className="space-y-2.5">
              {[
                { href: '/stacks', label: 'Todos los stacks' },
                { href: '/compare', label: 'Comparar stacks' },
                { href: '/stacks#tier-1', label: 'Stacks populares' },
                { href: '/stacks#tier-3', label: 'Stacks enterprise' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-gray-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Herramientas */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-4">Herramientas</h4>
            <ul className="space-y-2.5">
              {[
                { href: '/questionnaire', label: 'Cuestionario' },
                { href: '/results', label: 'Ver resultados' },
                { href: '/compare', label: 'Comparador' },
                { href: '/blueprint', label: '🏗️ Blueprint premium' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-gray-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-4">¿Listo para empezar?</h4>
            <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">
              Respondé 13 preguntas y obtené tu stack ideal con roadmap incluido.
            </p>
            <Link
              href="/questionnaire"
              className="inline-block bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              Empezar ahora →
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 mt-8 border-t border-gray-100 dark:border-slate-700">
          <p className="text-xs text-gray-400 dark:text-slate-500">
            © {year} StackAdvisor. Hecho con ❤️ para devs.
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-slate-500">
              <span className="w-2 h-2 rounded-full bg-accent inline-block"></span>
              35 stacks evaluados
            </span>
            <span className="text-xs text-gray-400 dark:text-slate-500">·</span>
            <span className="text-xs text-gray-400 dark:text-slate-500">Actualizado 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
