'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

const CURVE_COLOR: Record<string, string> = {
  'low':         'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  'low-medium':  'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  'medium':      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  'medium-high': 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  'high':        'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  'very high':   'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
};

const TIER_CONFIG: Record<number, { label: string }> = {
  1: { label: 'Popular & Recomendado' },
  2: { label: 'Especializado' },
  3: { label: 'Enterprise' },
  4: { label: 'Nicho / Específico' },
};

const CURVE_LABELS: Record<string, string> = {
  'low':         'Baja',
  'low-medium':  'Baja-Media',
  'medium':      'Media',
  'medium-high': 'Media-Alta',
  'high':        'Alta',
  'very high':   'Muy Alta',
};

type Stack = {
  id: string;
  name: string;
  description: string;
  tier: number;
  learningCurve: string;
  estimatedCost: string;
  setupTime: string;
  tags?: string[];
};

interface Props {
  stacks: Stack[];
}

type CurveFilter = 'all' | 'low' | 'medium' | 'high';
type TierFilter = 0 | 1 | 2 | 3 | 4;

export default function StacksGrid({ stacks }: Props) {
  const [query, setQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<TierFilter>(0);
  const [curveFilter, setCurveFilter] = useState<CurveFilter>('all');

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return stacks.filter((s) => {
      if (tierFilter !== 0 && s.tier !== tierFilter) return false;
      if (curveFilter !== 'all') {
        const curve = s.learningCurve;
        if (curveFilter === 'low' && !['low', 'low-medium'].includes(curve)) return false;
        if (curveFilter === 'medium' && !['medium', 'medium-high'].includes(curve)) return false;
        if (curveFilter === 'high' && !['high', 'very high'].includes(curve)) return false;
      }
      if (q) {
        return (
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          (s.tags || []).some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [stacks, query, tierFilter, curveFilter]);

  // Group by tier
  const byTier = useMemo(() => {
    const map: Record<number, Stack[]> = {};
    filtered.forEach((s) => {
      if (!map[s.tier]) map[s.tier] = [];
      map[s.tier].push(s);
    });
    return map;
  }, [filtered]);

  const activeFilters = tierFilter !== 0 || curveFilter !== 'all' || query !== '';

  const tierBtn = (tier: TierFilter, label: string) => (
    <button
      onClick={() => setTierFilter(tier)}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
        tierFilter === tier
          ? 'bg-primary text-white border-primary'
          : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:border-primary hover:text-primary'
      }`}
    >
      {label}
    </button>
  );

  const curveBtn = (filter: CurveFilter, label: string) => (
    <button
      onClick={() => setCurveFilter(filter)}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
        curveFilter === filter
          ? 'bg-primary text-white border-primary'
          : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:border-primary hover:text-primary'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div>
      {/* Search + Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-600 p-5 mb-8 shadow-sm">
        {/* Search */}
        <div className="relative mb-4">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 text-lg">🔍</span>
          <input
            type="text"
            placeholder="Buscar por nombre, tecnología, caso de uso..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter rows */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-xs text-gray-500 dark:text-slate-400 self-center mr-1 font-medium">Tier:</span>
          {tierBtn(0, 'Todos')}
          {tierBtn(1, '⭐ Popular')}
          {tierBtn(2, '🔬 Especializado')}
          {tierBtn(3, '🏢 Enterprise')}
          {tierBtn(4, '🎯 Nicho')}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-gray-500 dark:text-slate-400 self-center mr-1 font-medium">Curva:</span>
          {curveBtn('all', 'Todas')}
          {curveBtn('low', '🟢 Baja')}
          {curveBtn('medium', '🟡 Media')}
          {curveBtn('high', '🔴 Alta')}
        </div>

        {/* Results count + clear */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
          <span className="text-sm text-gray-500 dark:text-slate-400">
            {filtered.length === stacks.length
              ? `${stacks.length} stacks en total`
              : `${filtered.length} de ${stacks.length} stacks`}
          </span>
          {activeFilters && (
            <button
              onClick={() => { setQuery(''); setTierFilter(0); setCurveFilter('all'); }}
              className="text-sm text-primary hover:underline transition-colors"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* No results */}
      {filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔎</div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Sin resultados</h3>
          <p className="text-gray-500 dark:text-slate-400 mb-6">
            No encontramos stacks que coincidan con tu búsqueda.
          </p>
          <button
            onClick={() => { setQuery(''); setTierFilter(0); setCurveFilter('all'); }}
            className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            Ver todos los stacks
          </button>
        </div>
      )}

      {/* Stacks by tier (when filtering: flat list) */}
      {filtered.length > 0 && activeFilters && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((stack) => (
            <StackCard key={stack.id} stack={stack} />
          ))}
        </div>
      )}

      {/* Stacks grouped by tier (default view) */}
      {filtered.length > 0 && !activeFilters && (
        <div>
          {[1, 2, 3, 4].map((tier) => {
            const tierStacks = byTier[tier] || [];
            if (!tierStacks.length) return null;
            return (
              <div key={tier} className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {TIER_CONFIG[tier].label}
                  </h2>
                  <span className="text-sm text-gray-500 dark:text-slate-400">
                    {tierStacks.length} stacks
                  </span>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tierStacks.map((stack) => (
                    <StackCard key={stack.id} stack={stack} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StackCard({ stack }: { stack: Stack }) {
  return (
    <Link
      href={`/stacks/${stack.id}`}
      className="group bg-white dark:bg-slate-800 rounded-xl border-2 border-gray-200 dark:border-slate-600 p-5 hover:border-primary dark:hover:border-primary transition-all hover:shadow-lg hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-snug flex-1 pr-2 group-hover:text-primary transition-colors">
          {stack.name}
        </h3>
        <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-medium ${CURVE_COLOR[stack.learningCurve] || 'bg-gray-100 text-gray-600'}`}>
          {CURVE_LABELS[stack.learningCurve] || stack.learningCurve}
        </span>
      </div>
      <p className="text-gray-500 dark:text-slate-400 text-xs leading-relaxed mb-4 line-clamp-2">
        {stack.description}
      </p>
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-400">
        <span>💰 {stack.estimatedCost}</span>
        <span>⏱ {stack.setupTime}</span>
        <span className="text-primary group-hover:underline">Ver análisis →</span>
      </div>
    </Link>
  );
}
