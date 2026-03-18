import Link from 'next/link';

const stacks = [
  { name: 'Next.js + PostgreSQL', tier: '⭐ Más popular', icon: '▲' },
  { name: 'React + Node.js', tier: 'Full-stack clásico', icon: '⚛' },
  { name: 'Flutter + Firebase', tier: 'Mobile rápido', icon: '📱' },
  { name: 'Django + React', tier: 'Python power', icon: '🐍' },
  { name: 'Go + React', tier: 'Alta performance', icon: '🚀' },
  { name: 'Shopify', tier: 'E-commerce', icon: '🛒' },
];

const faqs = [
  {
    q: '¿Necesito saber programar para usar StackAdvisor?',
    a: 'No. Si eres no-técnico, te recomendaremos herramientas no-code como Bubble o Shopify que no requieren código. El cuestionario se adapta a tu nivel.',
  },
  {
    q: '¿Qué tan confiables son las recomendaciones?',
    a: 'Nuestro motor de decisión usa reglas basadas en miles de proyectos reales. Considera tu tipo de proyecto, experiencia, presupuesto y prioridades para darte la mejor opción posible.',
  },
  {
    q: '¿Cuánto tiempo toma el cuestionario?',
    a: 'Entre 3 y 5 minutos. Son 13 preguntas de opción múltiple (excepto la última que es opcional). Puedes navegar con el teclado para ir más rápido.',
  },
  {
    q: '¿Puedo hacerlo varias veces?',
    a: 'Sí, completamente gratis. Puedes probarlo con distintos escenarios - por ejemplo comparar qué stack te recomienda para un MVP urgente vs. uno sin prisa.',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-blue-700 text-white pt-20 pb-24">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="inline-block bg-white/10 border border-white/20 text-sm px-4 py-1.5 rounded-full mb-6 font-medium">
            35 stacks analizados · Gratis · Sin registro
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-5 leading-tight">
            ¿No sabes qué tecnología usar para tu proyecto?
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Responde 13 preguntas y en 5 minutos recibes tu stack ideal, con justificación clara
            y un roadmap de 12 semanas para llevarlo a producción.
          </p>
          <Link
            href="/questionnaire"
            className="inline-block bg-accent hover:bg-green-500 text-white font-bold px-10 py-4 rounded-xl text-lg transition-all transform hover:scale-105 shadow-xl"
          >
            Obtener mi recomendación gratis →
          </Link>
          <p className="mt-5 text-sm opacity-70">
            Sin tarjeta de crédito · Sin registro · Resultado instantáneo
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto text-center">
            {[
              { value: '35', label: 'Stacks cubiertos' },
              { value: '13', label: 'Preguntas inteligentes' },
              { value: '5 min', label: 'Para obtener resultados' },
              { value: '12 sem', label: 'Roadmap detallado' },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="text-2xl font-bold text-primary">{value}</div>
                <div className="text-sm text-gray-500 dark:text-slate-400">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Para quién es */}
      <section className="py-16 bg-gray-50 dark:bg-slate-900">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-3">¿Para quién es StackAdvisor?</h2>
          <p className="text-gray-500 dark:text-slate-400 text-center mb-12 max-w-xl mx-auto">
            Para cualquier persona con una idea de producto que no sabe por dónde empezar
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                emoji: '🧑‍💼',
                name: 'Martín, Founder',
                age: '32 años',
                pain: 'Tiene una idea clara pero no sabe si contratar un dev con React o con Vue, ni cuánto debería costarle el hosting.',
                win: 'Recibe una recomendación con presupuesto estimado y puede negociar con developers con criterio.',
              },
              {
                emoji: '👩‍💻',
                name: 'Luna, Dev Junior',
                age: '21 años',
                pain: 'Lleva 10 horas leyendo comparativas de Next.js vs Remix vs Astro y sigue sin decidirse.',
                win: 'En 5 minutos sabe exactamente qué aprender y por qué esa tecnología encaja con su proyecto.',
              },
              {
                emoji: '🧑‍🎨',
                name: 'Carlos, Indie Hacker',
                age: '28 años',
                pain: 'Quiere lanzar un SaaS pero no sabe si puede hacerlo solo o cuánto le va a costar la infraestructura.',
                win: 'Obtiene un roadmap realista de 12 semanas adaptado a sus recursos y experiencia.',
              },
            ].map((p) => (
              <div key={p.name} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-600 p-6 shadow-sm">
                <div className="text-4xl mb-3">{p.emoji}</div>
                <div className="font-bold text-lg text-gray-900 dark:text-white">{p.name}</div>
                <div className="text-sm text-gray-400 mb-4">{p.age}</div>
                <div className="mb-3">
                  <span className="text-xs font-semibold text-red-500 uppercase tracking-wide">El problema</span>
                  <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">{p.pain}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-accent uppercase tracking-wide">Lo que logra</span>
                  <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">{p.win}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="py-16 bg-white dark:bg-slate-800">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Cómo funciona</h2>
          <div className="space-y-8">
            {[
              {
                step: '1',
                title: 'Responde 13 preguntas sobre tu proyecto',
                desc: 'Te preguntamos sobre tu tipo de proyecto, experiencia, presupuesto, timeline y prioridades. Sin tecnicismos. Puedes responder con el teclado.',
                color: 'bg-primary',
              },
              {
                step: '2',
                title: 'Nuestro motor analiza 35 stacks',
                desc: 'Comparamos tu perfil con 35 stacks probados en producción. Cada stack recibe un score basado en tus respuestas y te explicamos el porqué.',
                color: 'bg-primary',
              },
              {
                step: '3',
                title: 'Recibe tu plan completo',
                desc: 'Stack recomendado con justificación, 2 alternativas, costo estimado de hosting y un roadmap semana a semana para llegar a producción.',
                color: 'bg-accent',
              },
            ].map(({ step, title, desc, color }) => (
              <div key={step} className="flex items-start gap-5">
                <div className={`flex-shrink-0 w-12 h-12 ${color} text-white rounded-full flex items-center justify-center font-bold text-xl shadow-md`}>
                  {step}
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-1 text-gray-900 dark:text-white">{title}</h3>
                  <p className="text-gray-500 dark:text-slate-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/questionnaire"
              className="inline-block bg-primary hover:bg-blue-600 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all shadow-lg"
            >
              Empezar ahora →
            </Link>
          </div>
        </div>
      </section>

      {/* Qué recibes */}
      <section className="py-16 bg-gray-50 dark:bg-slate-900">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-3">Qué recibes al terminar</h2>
          <p className="text-gray-500 dark:text-slate-400 text-center mb-12">Todo lo que necesitas para pasar de idea a código en un día</p>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { icon: '🎯', title: 'Stack recomendado completo', desc: 'Frontend, Backend, Base de datos, Hosting y Auth. No stacks genéricos — el que mejor encaja con TU situación específica.' },
              { icon: '💡', title: 'Justificación clara del porqué', desc: 'Entiendes exactamente por qué ese stack y no otro. Puedes explicárselo a un co-founder o a un desarrollador.' },
              { icon: '🔀', title: '2 alternativas con comparativa', desc: 'Si el primario no te convence, tienes opciones con su costo y curva de aprendizaje para que compares.' },
              { icon: '🗓️', title: 'Roadmap de 12 semanas', desc: 'Qué hacer semana a semana, desde el setup hasta el lanzamiento. Concreto y accionable.' },
              { icon: '💰', title: 'Costo estimado de hosting', desc: 'Sabes exactamente cuánto vas a gastar en infraestructura desde el MVP hasta escalar.' },
              { icon: '📋', title: 'Primeros pasos para HOY', desc: 'No quedas con la duda de qué hacer después. Te damos los 3 pasos concretos para arrancar hoy mismo.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-600 p-6 flex gap-4 shadow-sm">
                <div className="text-3xl flex-shrink-0">{icon}</div>
                <div>
                  <h3 className="font-semibold text-base mb-1 text-gray-900 dark:text-white">{title}</h3>
                  <p className="text-gray-500 dark:text-slate-400 text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stacks que cubrimos */}
      <section className="py-16 bg-white dark:bg-slate-800">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-3">Stacks que analizamos</h2>
          <p className="text-gray-500 dark:text-slate-400 text-center mb-10">35 opciones desde no-code hasta enterprise</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {stacks.map(({ name, tier, icon }) => (
              <div key={name} className="border border-gray-200 dark:border-slate-600 rounded-lg p-4 flex items-center gap-3 hover:border-primary dark:hover:border-primary transition-colors bg-white dark:bg-slate-700">
                <div className="w-9 h-9 bg-gray-100 dark:bg-slate-600 rounded-lg flex items-center justify-center text-lg font-bold flex-shrink-0">
                  {icon}
                </div>
                <div>
                  <div className="font-medium text-sm text-gray-900 dark:text-white">{name}</div>
                  <div className="text-xs text-gray-400">{tier}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-400 mt-6">
            + No-code, Blockchain, GraphQL, Serverless, Elixir y más
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50 dark:bg-slate-900">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-10">Preguntas frecuentes</h2>
          <div className="space-y-4">
            {faqs.map(({ q, a }) => (
              <div key={q} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-600 p-6 shadow-sm">
                <h3 className="font-semibold text-base mb-2 text-gray-900 dark:text-white">{q}</h3>
                <p className="text-gray-500 dark:text-slate-400 text-sm">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-br from-primary to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Deja de buscar. Empieza a construir.
          </h2>
          <p className="text-lg mb-8 opacity-90">
            En 5 minutos sabes exactamente qué tecnología usar y cómo arrancar.
          </p>
          <Link
            href="/questionnaire"
            className="inline-block bg-accent hover:bg-green-500 text-white font-bold px-10 py-4 rounded-xl text-lg transition-all transform hover:scale-105 shadow-xl"
          >
            Obtener mi recomendación gratis →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-gray-400 text-center text-sm">
        <div className="container mx-auto px-4">
          <p className="mb-1">© 2026 StackAdvisor · Hecho por Santiago</p>
          <p className="text-gray-600">
            Ayudando a developers y founders a transformar ideas en realidad, un stack a la vez.
          </p>
        </div>
      </footer>

    </main>
  );
}
