import { notFound } from 'next/navigation';
import Link from 'next/link';
import stacksData from '@/lib/stacks.json';
import type { Metadata } from 'next';
import AffiliateCards from '@/components/AffiliateCards';
import { getLearningAffiliate } from '@/lib/affiliates';

const ALL_STACKS: any[] = (stacksData as any).stacks;

export async function generateStaticParams() {
  return ALL_STACKS.map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const stack = ALL_STACKS.find((s) => s.id === params.id);
  if (!stack) return { title: 'Stack no encontrado' };
  return {
    title: `${stack.name} — Análisis completo | StackAdvisor`,
    description: `${stack.description}. Pros, contras, costo estimado (${stack.estimatedCost}), curva de aprendizaje y recursos para empezar hoy.`,
  };
}

const CURVE_CONFIG: Record<string, { label: string; color: string; pct: number }> = {
  'low':         { label: 'Baja',         color: 'bg-green-500',  pct: 15 },
  'low-medium':  { label: 'Baja-Media',   color: 'bg-green-400',  pct: 30 },
  'medium':      { label: 'Media',        color: 'bg-yellow-400', pct: 50 },
  'medium-high': { label: 'Media-Alta',   color: 'bg-orange-400', pct: 67 },
  'high':        { label: 'Alta',         color: 'bg-red-400',    pct: 83 },
  'very high':   { label: 'Muy Alta',     color: 'bg-red-600',    pct: 100 },
};

const SCALE_CONFIG: Record<string, { label: string; color: string; pct: number }> = {
  'low':        { label: 'Baja',        color: 'bg-red-400',    pct: 20 },
  'low-medium': { label: 'Baja-Media',  color: 'bg-orange-400', pct: 35 },
  'medium':     { label: 'Media',       color: 'bg-yellow-400', pct: 55 },
  'high':       { label: 'Alta',        color: 'bg-green-400',  pct: 80 },
  'very high':  { label: 'Muy Alta',    color: 'bg-green-600',  pct: 100 },
};

const COMMUNITY_CONFIG: Record<string, { label: string; pct: number }> = {
  'small':     { label: 'Pequeña', pct: 15 },
  'niche':     { label: 'Nicho',   pct: 25 },
  'growing':   { label: 'Creciendo', pct: 45 },
  'good':      { label: 'Buena',   pct: 70 },
  'excellent': { label: 'Excelente', pct: 100 },
};

// Real companies using each stack (curated data)
const USED_BY: Record<string, string[]> = {
  nextjs_postgres_vercel:   ['Vercel', 'TikTok', 'Hulu', 'Twitch', 'GitHub'],
  t3_stack:                 ['Cal.com', 'Ping.gg', 'Liftbear'],
  react_node_postgres_railway: ['Facebook (React)', 'Airbnb', 'Netflix', 'Discord'],
  supabase_nextjs:          ['Mobbin', 'Peerlist', 'WorkOS'],
  django_react_postgres:    ['Instagram', 'Pinterest', 'Disqus', 'Spotify'],
  react_fastapi_postgres:   ['Netflix (FastAPI)', 'Uber', 'Microsoft'],
  flutter_firebase:         ['Google Pay', 'Alibaba Xianyu', 'BMW App'],
  rails_postgres:           ['GitHub', 'Shopify', 'Airbnb', 'Basecamp', 'Twitch'],
  laravel_vue_inertia:      ['Laracasts', 'Invoice Ninja', 'Laravel Forge'],
  nuxt_supabase:            ['GitLab', 'Maison Margiela', 'Starbucks France'],
  remix_postgres:           ['Shopify', 'Stripe', 'GitHub', 'Netlify'],
  angular_node_postgres:    ['Google', 'Microsoft', 'Forbes', 'Deutsche Bank'],
  wordpress_woocommerce:    ['BBC America', 'TechCrunch', 'The White House', 'Sony Music'],
  pocketbase_react:         ['Comunidad indie hacker', 'Proyectos open-source'],
  payload_nextjs:           ['Agencias digitales', 'Plataformas editoriales'],
  go_react_postgres:        ['Google', 'Uber', 'Dropbox', 'Cloudflare'],
  spring_react_postgres:    ['Amazon', 'Netflix', 'LinkedIn', 'eBay'],
  convex_react:             ['Notion-like apps', 'Plataformas colaborativas'],
  elixir_phoenix_postgres:  ['WhatsApp', 'Discord', 'Pinterest'],
  svelte_node_mongo:        ['The New York Times', 'Apple', 'Spotify'],
};

function MetricBar({ label, config }: { label: string; config: { label: string; color: string; pct: number } }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600 dark:text-slate-400">{label}</span>
        <span className="font-semibold text-gray-900 dark:text-white">{config.label}</span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-slate-600 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${config.color}`} style={{ width: `${config.pct}%` }} />
      </div>
    </div>
  );
}

export default function StackPage({ params }: { params: { id: string } }) {
  const stack = ALL_STACKS.find((s) => s.id === params.id);
  if (!stack) notFound();

  const usedBy = stack.usedBy || USED_BY[stack.id] || [];
  const relatedStacks = ALL_STACKS
    .filter((s) => s.id !== stack.id && s.tier === stack.tier)
    .slice(0, 3);

  const curveConf = CURVE_CONFIG[stack.learningCurve] || { label: stack.learningCurve, color: 'bg-gray-400', pct: 50 };
  const scaleConf = SCALE_CONFIG[stack.scalability] || { label: stack.scalability, color: 'bg-gray-400', pct: 50 };
  const commConf  = COMMUNITY_CONFIG[stack.community] || { label: stack.community, pct: 50 };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="container mx-auto px-4 max-w-5xl">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400 mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
          <span className="text-gray-400 dark:text-slate-600">/</span>
          <Link href="/stacks" className="hover:text-primary transition-colors">Stacks</Link>
          <span className="text-gray-400 dark:text-slate-600">/</span>
          <span className="text-gray-700 dark:text-slate-300">{stack.name}</span>
        </div>

        {/* Hero */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
            <div className="flex-1">
              <span className="inline-block bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
                {stack.tierLabel}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                {stack.name}
              </h1>
              <p className="text-lg text-gray-500 dark:text-slate-400 leading-relaxed max-w-2xl">
                {stack.description}
              </p>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-100 dark:border-slate-700">
            {[
              { icon: '💰', label: 'Costo estimado', value: stack.estimatedCost },
              { icon: '⏱', label: 'Tiempo de setup', value: stack.setupTime },
              { icon: '📚', label: 'Curva de aprendizaje', value: curveConf.label },
              { icon: '👥', label: 'Comunidad', value: commConf.label },
            ].map(({ icon, label, value }) => (
              <div key={label} className="text-center bg-gray-50 dark:bg-slate-700 rounded-xl p-4">
                <div className="text-2xl mb-1">{icon}</div>
                <div className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1">{label}</div>
                <div className="font-bold text-gray-900 dark:text-white text-sm">{value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main column */}
          <div className="md:col-span-2 space-y-8">

            {/* Tech Stack */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Stack Tecnológico</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { icon: '🎨', label: 'Frontend', key: 'frontend' },
                  { icon: '⚙️', label: 'Backend', key: 'backend' },
                  { icon: '💾', label: 'Base de datos', key: 'database' },
                  { icon: '🚀', label: 'Hosting', key: 'hosting' },
                  { icon: '🔐', label: 'Autenticación', key: 'auth' },
                  { icon: '🎨', label: 'Estilos', key: 'styling' },
                ].map(({ icon, label, key }) => (
                  stack.technologies[key] && (
                    <div key={key} className="flex items-center gap-3 bg-gray-50 dark:bg-slate-700 rounded-xl p-3 border border-gray-100 dark:border-slate-600">
                      <span className="text-xl">{icon}</span>
                      <div>
                        <div className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide">{label}</div>
                        <div className="font-semibold text-gray-900 dark:text-white text-sm">{stack.technologies[key]}</div>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* Pros & Cons */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Pros & Contras</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-accent mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-xs">✓</span>
                    Ventajas
                  </h3>
                  <ul className="space-y-2">
                    {stack.pros.map((pro: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-slate-300">
                        <span className="text-accent font-bold mt-0.5 flex-shrink-0">+</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-500 mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-xs">−</span>
                    Desventajas
                  </h3>
                  <ul className="space-y-2">
                    {stack.cons.map((con: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-slate-400">
                        <span className="text-gray-400 font-bold mt-0.5 flex-shrink-0">−</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Best For */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Ideal para</h2>
              <div className="flex flex-wrap gap-2">
                {stack.bestFor.map((b: string, i: number) => (
                  <span
                    key={i}
                    className="bg-blue-50 dark:bg-blue-950 text-primary border border-blue-200 dark:border-blue-800 px-3 py-1.5 rounded-full text-sm font-medium"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>

            {/* Companies using it */}
            {usedBy.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quién lo usa</h2>
                <div className="flex flex-wrap gap-2">
                  {usedBy.map((company: string, i: number) => (
                    <span
                      key={i}
                      className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 dark:border-slate-600"
                    >
                      {company}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Resources */}
            {stack.resources && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Recursos para empezar</h2>
                <div className="space-y-3">
                  {[
                    { icon: '📖', key: 'docs', label: 'Documentación oficial' },
                    { icon: '🎬', key: 'tutorial', label: 'Tutorial recomendado' },
                    { icon: '⚡', key: 'quickstart', label: 'Inicio rápido' },
                  ].map(({ icon, key, label }) => {
                    const res = stack.resources[key];
                    if (!res) return null;
                    return (
                      <a
                        key={key}
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 border-2 border-gray-200 dark:border-slate-600 rounded-xl p-4 hover:border-primary hover:bg-blue-50 dark:hover:bg-blue-950 transition-all group"
                      >
                        <span className="text-2xl">{icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-0.5">{label}</div>
                          <div className="font-semibold text-gray-800 dark:text-slate-200 group-hover:text-primary transition-colors text-sm leading-snug truncate">
                            {res.label}
                          </div>
                        </div>
                        <span className="text-gray-400 dark:text-slate-500 group-hover:text-primary transition-colors flex-shrink-0">→</span>
                      </a>
                    );
                  })}

                  {/* Platzi affiliate — cursos en español */}
                  {(() => {
                    const platzi = getLearningAffiliate();
                    if (!platzi) return null;
                    return (
                      <a
                        href={platzi.url}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        className="flex items-center gap-4 border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950 rounded-xl p-4 hover:border-accent transition-all group"
                      >
                        <span className="text-2xl">{platzi.logo}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <div className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide">Cursos en español</div>
                            <span className="text-xs bg-accent text-white px-1.5 py-0.5 rounded-full font-semibold">{platzi.badge}</span>
                          </div>
                          <div className="font-semibold text-gray-800 dark:text-slate-200 group-hover:text-accent transition-colors text-sm">
                            Aprendé {stack.name.split('+')[0].trim()} en Platzi
                          </div>
                        </div>
                        <span className="text-gray-400 dark:text-slate-500 group-hover:text-accent transition-colors flex-shrink-0">→</span>
                      </a>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Metrics */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Métricas</h2>
              <div className="space-y-5">
                <MetricBar label="Curva de aprendizaje" config={curveConf} />
                <MetricBar label="Escalabilidad" config={scaleConf} />
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-slate-400">Comunidad</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{commConf.label}</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-slate-600 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${commConf.pct}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-primary to-blue-700 rounded-2xl p-6 text-white text-center">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-bold text-lg mb-2">¿Es este tu stack ideal?</h3>
              <p className="text-sm opacity-90 mb-4">
                Respondé 13 preguntas y confirmamos si {stack.name.split(' ')[0]} es la mejor opción para tu proyecto
              </p>
              <Link
                href="/questionnaire"
                className="block bg-white text-primary font-semibold py-3 px-4 rounded-xl hover:bg-gray-100 transition-all text-sm"
              >
                Validar con cuestionario →
              </Link>
            </div>

            {/* Affiliate cards */}
            <AffiliateCards hosting={stack.technologies.hosting} variant="sidebar" />

            {/* Compare */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3">Comparar</h3>
              <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">
                Compará {stack.name.split('+')[0].trim()} contra otros stacks lado a lado
              </p>
              <Link
                href={`/compare?stacks=${stack.id}`}
                className="block text-center border-2 border-primary text-primary py-2.5 rounded-xl font-medium hover:bg-primary hover:text-white transition-all text-sm"
              >
                ⚖️ Abrir en comparador
              </Link>
            </div>

            {/* Related stacks */}
            {relatedStacks.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Stacks similares</h3>
                <div className="space-y-3">
                  {relatedStacks.map((s: any) => (
                    <Link
                      key={s.id}
                      href={`/stacks/${s.id}`}
                      className="flex items-center justify-between gap-2 py-2 border-b border-gray-100 dark:border-slate-700 last:border-0 hover:text-primary transition-colors group"
                    >
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white text-sm group-hover:text-primary transition-colors leading-snug">
                          {s.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-slate-400">{s.estimatedCost}</div>
                      </div>
                      <span className="text-gray-400 dark:text-slate-500 group-hover:text-primary transition-colors flex-shrink-0">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
