'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import stacksData from '@/lib/stacks.json';

interface Stack {
  id: string;
  name: string;
  description: string;
  tierLabel: string;
  tier: number;
  bestFor: string[];
  technologies: {
    frontend: string;
    backend: string;
    database: string;
    hosting: string;
    auth: string;
    styling: string;
  };
  pros: string[];
  cons: string[];
  learningCurve: string;
  community: string;
  estimatedCost: string;
  setupTime: string;
  scalability: string;
  tags: string[];
  resources?: {
    docs: { label: string; url: string };
    tutorial: { label: string; url: string };
    quickstart: { label: string; url: string };
  };
}

const ALL_STACKS: Stack[] = (stacksData as any).stacks;
const MAX_STACKS = 4;

// ── Metric scoring helpers ──────────────────────────────────────────────────
const CURVE_ORDER = ['low', 'low-medium', 'medium', 'medium-high', 'high', 'very high'];
const SCALE_ORDER = ['low', 'low-medium', 'medium', 'high', 'very high'];
const COMMUNITY_ORDER = ['small', 'niche', 'growing', 'good', 'excellent'];

function bestIndices(stacks: Stack[], key: 'learningCurve' | 'scalability' | 'community' | 'cost'): number[] {
  if (stacks.length === 0) return [];
  if (key === 'learningCurve') {
    const scores = stacks.map((s) => CURVE_ORDER.indexOf(s.learningCurve));
    const min = Math.min(...scores.filter((x) => x >= 0));
    return scores.map((s, i) => (s === min ? i : -1)).filter((i) => i >= 0);
  }
  if (key === 'scalability') {
    const scores = stacks.map((s) => SCALE_ORDER.indexOf(s.scalability));
    const max = Math.max(...scores.filter((x) => x >= 0));
    return scores.map((s, i) => (s === max ? i : -1)).filter((i) => i >= 0);
  }
  if (key === 'community') {
    const scores = stacks.map((s) => COMMUNITY_ORDER.indexOf(s.community));
    const max = Math.max(...scores.filter((x) => x >= 0));
    return scores.map((s, i) => (s === max ? i : -1)).filter((i) => i >= 0);
  }
  if (key === 'cost') {
    const scores = stacks.map((s) => {
      const m = s.estimatedCost?.match(/\d+/);
      return m ? parseInt(m[0]) : 9999;
    });
    const min = Math.min(...scores);
    return scores.map((s, i) => (s === min ? i : -1)).filter((i) => i >= 0);
  }
  return [];
}

function curveBadge(curve: string) {
  const i = CURVE_ORDER.indexOf(curve);
  if (i <= 1) return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700';
  if (i <= 3) return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700';
  return 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700';
}

function scaleBadge(scale: string) {
  const i = SCALE_ORDER.indexOf(scale);
  if (i >= 3) return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700';
  if (i >= 2) return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700';
  return 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700';
}

function communityBadge(c: string) {
  const i = COMMUNITY_ORDER.indexOf(c);
  if (i >= 4) return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700';
  if (i >= 2) return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700';
  return 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 border-gray-200 dark:border-slate-600';
}

function costBadge(cost: string) {
  const m = cost?.match(/\d+/);
  const v = m ? parseInt(m[0]) : 9999;
  if (v <= 20) return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700';
  if (v <= 60) return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700';
  return 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700';
}

const PROJECT_FILTERS: Record<string, string[]> = {
  'SaaS':       ['nextjs_postgres_vercel','t3_stack','react_node_postgres_railway','supabase_nextjs','rails_postgres','laravel_vue_inertia','nuxt_supabase','convex_react','pocketbase_react'],
  'E-commerce': ['shopify','wordpress_woocommerce','nextjs_postgres_vercel','t3_stack','rails_postgres','laravel_vue_inertia','remix_postgres'],
  'Blog':       ['astro_node_postgres','headless_cms_nextjs','payload_nextjs','wordpress_woocommerce','nextjs_postgres_vercel','nuxt_supabase'],
  'Mobile':     ['flutter_firebase','react_native_firebase'],
  'API':        ['react_fastapi_postgres','go_react_postgres','graphql_apollo_react','rails_postgres','laravel_vue_inertia','nestjs_react_postgres','angular_node_postgres'],
  'Enterprise': ['spring_react_postgres','aspnet_react_sqlserver','angular_node_postgres','nestjs_react_postgres','go_react_postgres'],
  'Real-time':  ['convex_react','svelte_node_mongo','elixir_phoenix_postgres','react_node_postgres_railway'],
};

// ── Stack Picker Sidebar ────────────────────────────────────────────────────
function StackPicker({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (id: string) => void;
}) {
  const [search, setSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let base = ALL_STACKS;
    if (projectFilter && PROJECT_FILTERS[projectFilter]) {
      const ids = PROJECT_FILTERS[projectFilter];
      base = ALL_STACKS.filter((s) => ids.includes(s.id));
    }
    const q = search.toLowerCase();
    if (!q) return base;
    return base.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.tags?.some((t: string) => t.includes(q))
    );
  }, [search, projectFilter]);

  const tiers = [1, 2, 3, 4];
  const tierLabels: Record<number, string> = {
    1: 'Popular & Recomendado',
    2: 'Especializados',
    3: 'Enterprise',
    4: 'No-Code / BaaS',
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border-2 border-gray-200 dark:border-slate-600 p-4 h-full">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Elegir stacks</h2>
      <p className="text-xs text-gray-500 dark:text-slate-400 mb-3">Seleccioná hasta {MAX_STACKS} para comparar</p>

      {/* Project type filter */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {Object.keys(PROJECT_FILTERS).map((f) => (
          <button
            key={f}
            onClick={() => setProjectFilter((p) => (p === f ? null : f))}
            className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
              projectFilter === f
                ? 'bg-primary border-primary text-white'
                : 'border-gray-200 dark:border-slate-600 text-gray-500 dark:text-slate-400 hover:border-primary hover:text-primary'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <input
        type="text"
        placeholder="Buscar stack..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 rounded-lg px-3 py-2 text-sm mb-4 focus:border-primary focus:outline-none"
      />

      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
        {tiers.map((tier) => {
          const inTier = filtered.filter((s) => s.tier === tier);
          if (inTier.length === 0) return null;
          return (
            <div key={tier}>
              <div className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                {tierLabels[tier]}
              </div>
              <div className="space-y-1">
                {inTier.map((stack) => {
                  const isSelected = selected.includes(stack.id);
                  const isDisabled = !isSelected && selected.length >= MAX_STACKS;
                  return (
                    <button
                      key={stack.id}
                      onClick={() => !isDisabled && onToggle(stack.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg border-2 text-sm transition-all ${
                        isSelected
                          ? 'border-primary bg-blue-50 dark:bg-blue-950 text-primary font-medium'
                          : isDisabled
                          ? 'border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-700 text-gray-300 dark:text-slate-600 cursor-not-allowed'
                          : 'border-gray-100 dark:border-slate-700 hover:border-primary hover:bg-blue-50 dark:hover:bg-blue-950 text-gray-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center text-xs ${
                          isSelected ? 'border-primary bg-primary text-white' : 'border-gray-300 dark:border-slate-500'
                        }`}>
                          {isSelected && '✓'}
                        </span>
                        <span className="truncate">{stack.name}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Comparison Table ────────────────────────────────────────────────────────
function ComparisonTable({ stacks }: { stacks: Stack[] }) {
  const bestCurve   = bestIndices(stacks, 'learningCurve');
  const bestScale   = bestIndices(stacks, 'scalability');
  const bestComm    = bestIndices(stacks, 'community');
  const bestCost    = bestIndices(stacks, 'cost');

  const TIER_COLORS: Record<number, string> = {
    1: 'bg-accent text-white',
    2: 'bg-primary text-white',
    3: 'bg-purple-500 text-white',
    4: 'bg-orange-400 text-white',
  };

  const rowEven = 'bg-gray-50 dark:bg-slate-700';
  const rowOdd  = 'bg-white dark:bg-slate-800';

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        {/* Stack headers */}
        <thead>
          <tr>
            <th className="w-36 text-left py-3 pr-4 text-gray-500 dark:text-slate-400 font-medium text-xs uppercase tracking-wide align-bottom">
              Métrica
            </th>
            {stacks.map((stack) => (
              <th key={stack.id} className="py-3 px-3 text-center min-w-[160px]">
                <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-2 ${TIER_COLORS[stack.tier] || 'bg-gray-400 text-white'}`}>
                  {stack.tierLabel}
                </span>
                <div className="font-bold text-gray-900 dark:text-white leading-snug text-sm">{stack.name}</div>
                <p className="text-gray-500 dark:text-slate-400 font-normal text-xs mt-1 leading-snug line-clamp-2">{stack.description}</p>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {/* Tech Stack */}
          {(['frontend', 'backend', 'database', 'hosting'] as const).map((tech, rowIdx) => {
            const labels: Record<string, string> = {
              frontend: '🎨 Frontend',
              backend: '⚙️ Backend',
              database: '💾 Base de datos',
              hosting: '🚀 Hosting',
            };
            return (
              <tr key={tech} className={rowIdx % 2 === 0 ? rowEven : rowOdd}>
                <td className="py-3 pr-4 text-gray-500 dark:text-slate-400 font-medium text-xs whitespace-nowrap">
                  {labels[tech]}
                </td>
                {stacks.map((s) => (
                  <td key={s.id} className="py-3 px-3 text-center text-gray-800 dark:text-slate-200 font-medium text-xs">
                    {s.technologies[tech]}
                  </td>
                ))}
              </tr>
            );
          })}

          {/* Divider */}
          <tr><td colSpan={stacks.length + 1} className="py-2"><div className="border-t-2 border-gray-100 dark:border-slate-600" /></td></tr>

          {/* Cost */}
          <tr className={rowEven}>
            <td className="py-3 pr-4 text-gray-500 dark:text-slate-400 font-medium text-xs">💰 Costo/mes</td>
            {stacks.map((s, i) => (
              <td key={s.id} className="py-3 px-3 text-center">
                <span className={`inline-block border rounded-lg px-2 py-1 text-xs font-semibold ${costBadge(s.estimatedCost)} ${bestCost.includes(i) ? 'ring-2 ring-green-400' : ''}`}>
                  {s.estimatedCost}
                  {bestCost.includes(i) && stacks.length > 1 && ' ★'}
                </span>
              </td>
            ))}
          </tr>

          {/* Setup time */}
          <tr className={rowOdd}>
            <td className="py-3 pr-4 text-gray-500 dark:text-slate-400 font-medium text-xs">⏱ Setup</td>
            {stacks.map((s) => (
              <td key={s.id} className="py-3 px-3 text-center text-gray-700 dark:text-slate-300 text-xs font-medium">
                {s.setupTime}
              </td>
            ))}
          </tr>

          {/* Learning curve */}
          <tr className={rowEven}>
            <td className="py-3 pr-4 text-gray-500 dark:text-slate-400 font-medium text-xs">📚 Curva de aprendizaje</td>
            {stacks.map((s, i) => (
              <td key={s.id} className="py-3 px-3 text-center">
                <span className={`inline-block border rounded-lg px-2 py-1 text-xs font-semibold capitalize ${curveBadge(s.learningCurve)} ${bestCurve.includes(i) && stacks.length > 1 ? 'ring-2 ring-green-400' : ''}`}>
                  {s.learningCurve}
                  {bestCurve.includes(i) && stacks.length > 1 && ' ★'}
                </span>
              </td>
            ))}
          </tr>

          {/* Scalability */}
          <tr className={rowOdd}>
            <td className="py-3 pr-4 text-gray-500 dark:text-slate-400 font-medium text-xs">📈 Escalabilidad</td>
            {stacks.map((s, i) => (
              <td key={s.id} className="py-3 px-3 text-center">
                <span className={`inline-block border rounded-lg px-2 py-1 text-xs font-semibold capitalize ${scaleBadge(s.scalability)} ${bestScale.includes(i) && stacks.length > 1 ? 'ring-2 ring-green-400' : ''}`}>
                  {s.scalability}
                  {bestScale.includes(i) && stacks.length > 1 && ' ★'}
                </span>
              </td>
            ))}
          </tr>

          {/* Community */}
          <tr className={rowEven}>
            <td className="py-3 pr-4 text-gray-500 dark:text-slate-400 font-medium text-xs">👥 Comunidad</td>
            {stacks.map((s, i) => (
              <td key={s.id} className="py-3 px-3 text-center">
                <span className={`inline-block border rounded-lg px-2 py-1 text-xs font-semibold capitalize ${communityBadge(s.community)} ${bestComm.includes(i) && stacks.length > 1 ? 'ring-2 ring-green-400' : ''}`}>
                  {s.community}
                  {bestComm.includes(i) && stacks.length > 1 && ' ★'}
                </span>
              </td>
            ))}
          </tr>

          {/* Divider */}
          <tr><td colSpan={stacks.length + 1} className="py-2"><div className="border-t-2 border-gray-100 dark:border-slate-600" /></td></tr>

          {/* Best for */}
          <tr className={rowOdd}>
            <td className="py-3 pr-4 text-gray-500 dark:text-slate-400 font-medium text-xs align-top pt-3">🎯 Ideal para</td>
            {stacks.map((s) => (
              <td key={s.id} className="py-3 px-3 text-center align-top">
                <div className="flex flex-wrap gap-1 justify-center">
                  {(s.bestFor || []).slice(0, 3).map((b) => (
                    <span key={b} className="bg-blue-50 dark:bg-blue-950 text-primary border border-blue-100 dark:border-blue-800 px-2 py-0.5 rounded-full text-xs">
                      {b}
                    </span>
                  ))}
                </div>
              </td>
            ))}
          </tr>

          {/* Pros */}
          <tr className={rowEven}>
            <td className="py-3 pr-4 text-gray-500 dark:text-slate-400 font-medium text-xs align-top pt-3">✅ Ventajas</td>
            {stacks.map((s) => (
              <td key={s.id} className="py-3 px-3 align-top">
                <ul className="space-y-1">
                  {(s.pros || []).slice(0, 3).map((p, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-gray-700 dark:text-slate-300">
                      <span className="text-accent font-bold flex-shrink-0 mt-0.5">+</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </td>
            ))}
          </tr>

          {/* Cons */}
          <tr className={rowOdd}>
            <td className="py-3 pr-4 text-gray-500 dark:text-slate-400 font-medium text-xs align-top pt-3">⚠️ Desventajas</td>
            {stacks.map((s) => (
              <td key={s.id} className="py-3 px-3 align-top">
                <ul className="space-y-1">
                  {(s.cons || []).slice(0, 2).map((c, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600 dark:text-slate-400">
                      <span className="text-gray-400 dark:text-slate-500 font-bold flex-shrink-0 mt-0.5">−</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </td>
            ))}
          </tr>

          {/* Resources */}
          <tr className={rowEven}>
            <td className="py-3 pr-4 text-gray-500 dark:text-slate-400 font-medium text-xs align-top pt-3">📖 Recursos</td>
            {stacks.map((s) => (
              <td key={s.id} className="py-3 px-3 text-center align-top">
                {s.resources ? (
                  <div className="flex flex-col gap-1.5">
                    <a href={s.resources.docs.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                      📖 Docs
                    </a>
                    <a href={s.resources.tutorial.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                      🎬 Tutorial
                    </a>
                    <a href={s.resources.quickstart.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                      ⚡ Quickstart
                    </a>
                  </div>
                ) : (
                  <span className="text-gray-400 dark:text-slate-500 text-xs">—</span>
                )}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// ── Main comparator ─────────────────────────────────────────────────────────
function ComparatorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialIds = useMemo(() => {
    const param = searchParams.get('stacks');
    if (!param) return [];
    return param
      .split(',')
      .filter((id) => ALL_STACKS.some((s) => s.id === id))
      .slice(0, MAX_STACKS);
  }, [searchParams]);

  const [selectedIds, setSelectedIds] = useState<string[]>(initialIds);

  const selectedStacks = useMemo(
    () => selectedIds.map((id) => ALL_STACKS.find((s) => s.id === id)!).filter(Boolean),
    [selectedIds]
  );

  const handleToggle = (id: string) => {
    setSelectedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      const url = next.length > 0 ? `/compare?stacks=${next.join(',')}` : '/compare';
      router.replace(url, { scroll: false });
      return next;
    });
  };

  const [linkCopied, setLinkCopied] = useState(false);

  const copyLink = () => {
    const url = `${window.location.origin}/compare?stacks=${selectedIds.join(',')}`;
    navigator.clipboard.writeText(url);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <Link href="/" className="text-gray-500 dark:text-slate-400 hover:text-primary text-sm transition-colors">
              ← Inicio
            </Link>
            <span className="text-gray-400 dark:text-slate-600">/</span>
            <span className="text-sm text-gray-500 dark:text-slate-400">Comparador de Stacks</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">Comparador de Tech Stacks</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">
            Elegí hasta {MAX_STACKS} stacks y compará todas sus métricas lado a lado
          </p>
        </div>

        <div className="grid lg:grid-cols-[280px,1fr] gap-6 items-start">
          {/* Sidebar picker */}
          <div className="lg:sticky lg:top-6">
            <StackPicker selected={selectedIds} onToggle={handleToggle} />

            {selectedIds.length >= 2 && (
              <div className="mt-3 space-y-2">
                <button
                  onClick={copyLink}
                  className="w-full bg-primary text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                >
                  {linkCopied ? '✅ ¡Copiado!' : '🔗 Compartir comparación'}
                </button>
                <Link
                  href="/questionnaire"
                  className="block w-full text-center bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-600 text-gray-700 dark:text-slate-300 py-2.5 rounded-lg text-sm font-medium hover:border-primary hover:text-primary transition-all"
                >
                  Obtener recomendación personalizada →
                </Link>
              </div>
            )}
          </div>

          {/* Comparison area */}
          <div>
            {selectedStacks.length === 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-xl border-2 border-dashed border-gray-200 dark:border-slate-600 p-16 text-center">
                <div className="text-5xl mb-4">🔍</div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Seleccioná stacks para comparar</h2>
                <p className="text-gray-500 dark:text-slate-400 text-sm max-w-sm mx-auto">
                  Elegí al menos 2 stacks del panel izquierdo para ver su comparación completa
                </p>
                <div className="mt-6 flex flex-wrap gap-2 justify-center">
                  {['nextjs_postgres_vercel', 't3_stack', 'supabase_nextjs', 'rails_postgres'].map((id) => {
                    const s = ALL_STACKS.find((x) => x.id === id)!;
                    return (
                      <button
                        key={id}
                        onClick={() => handleToggle(id)}
                        className="border-2 border-gray-200 dark:border-slate-600 hover:border-primary text-gray-600 dark:text-slate-300 hover:text-primary px-3 py-1.5 rounded-lg text-sm transition-all"
                      >
                        + {s?.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {selectedStacks.length === 1 && (
              <div className="bg-white dark:bg-slate-800 rounded-xl border-2 border-dashed border-primary p-8 text-center">
                <div className="text-3xl mb-3">👆</div>
                <p className="text-gray-700 dark:text-slate-300 font-medium">
                  Seleccionaste <strong className="text-primary">{selectedStacks[0].name}</strong>
                </p>
                <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">Agregá al menos un stack más para comparar</p>
              </div>
            )}

            {selectedStacks.length >= 2 && (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                      Comparando {selectedStacks.length} stacks
                    </h2>
                    <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
                      ★ = mejor valor en esa métrica
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedIds([]);
                      router.replace('/compare', { scroll: false });
                    }}
                    className="text-xs text-gray-500 dark:text-slate-400 hover:text-red-500 transition-colors"
                  >
                    Limpiar selección
                  </button>
                </div>
                <ComparisonTable stacks={selectedStacks} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary" />
        </div>
      }
    >
      <ComparatorContent />
    </Suspense>
  );
}
