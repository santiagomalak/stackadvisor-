'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Roadmap from '@/components/Roadmap';
import CostEstimator from '@/components/CostEstimator';
import PromptGenerator from '@/components/PromptGenerator';
import AffiliateCards from '@/components/AffiliateCards';
import Link from 'next/link';
import { Suspense } from 'react';

const HISTORY_KEY = 'stackAdvisorHistory';
const MAX_HISTORY = 5;

interface HistoryEntry {
  stackName: string;
  stackId: string;
  label: string;
  date: string;
  shareEncoded?: string;
}

function saveToHistory(primary: Recommendation, storedAnswers: string | null) {
  try {
    const existing: HistoryEntry[] = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    const { label } = matchLabel(primary.score);
    const entry: HistoryEntry = {
      stackName: primary.stack.name,
      stackId: primary.stack.id,
      label,
      date: new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' }),
      shareEncoded: storedAnswers ? btoa(encodeURIComponent(storedAnswers)) : undefined,
    };
    // Avoid duplicate consecutive entries
    const filtered = existing.filter((e) => e.stackId !== entry.stackId);
    const updated = [entry, ...filtered].slice(0, MAX_HISTORY);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch { /* localStorage may be unavailable */ }
}

interface StackResource {
  label: string;
  url: string;
}

interface Stack {
  id: string;
  name: string;
  description: string;
  tierLabel: string;
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
  resources?: {
    docs: StackResource;
    tutorial: StackResource;
    quickstart: StackResource;
  };
}

interface Recommendation {
  stack: Stack;
  score: number;
  matchReasons: string[];
  warnings: string[];
  roadmap?: any[];
}

interface Result {
  primary: Recommendation;
  alternatives: Recommendation[];
  userProfile: any;
  totalEvaluated: number;
}

type FeedbackState = 'none' | 'up' | 'down';

function matchLabel(score: number): { label: string; color: string; bg: string } {
  const pct = Math.min(100, Math.round((score / 200) * 100));
  if (pct >= 75) return { label: 'Match Perfecto', color: 'text-accent', bg: 'bg-green-50 dark:bg-green-950 border-accent' };
  if (pct >= 60) return { label: 'Match Excelente', color: 'text-primary', bg: 'bg-blue-50 dark:bg-blue-950 border-primary' };
  if (pct >= 45) return { label: 'Muy Buen Match', color: 'text-primary', bg: 'bg-blue-50 dark:bg-blue-950 border-blue-300' };
  return { label: 'Buen Match', color: 'text-gray-600 dark:text-slate-400', bg: 'bg-gray-50 dark:bg-slate-700 border-gray-300 dark:border-slate-500' };
}

function ScoreBadge({ score }: { score: number }) {
  const { label, color, bg } = matchLabel(score);
  return (
    <div className={`border-2 ${bg} px-4 py-3 rounded-xl text-center min-w-[140px]`}>
      <div className="text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">Compatibilidad</div>
      <div className={`text-lg font-bold ${color}`}>{label}</div>
    </div>
  );
}

function EmailCapture({ stack, reasons, roadmap }: { stack: any; reasons: string[]; roadmap: any[] }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, stack, reasons, roadmap }),
      });
      setStatus(res.ok ? 'done' : 'error');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'done') {
    return (
      <div className="bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 rounded-2xl p-6 text-center">
        <div className="text-3xl mb-2">📬</div>
        <h3 className="font-bold text-green-800 dark:text-green-300 mb-1">¡Listo! Revisá tu bandeja</h3>
        <p className="text-sm text-green-700 dark:text-green-400">Te enviamos tu recomendación completa con el roadmap a <strong>{email}</strong></p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-primary/5 to-blue-600/5 border-2 border-primary/20 dark:border-primary/30 rounded-2xl p-6">
      <div className="flex items-start gap-4">
        <div className="text-3xl flex-shrink-0">📧</div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 dark:text-white mb-1">Recibí tu recomendación por email</h3>
          <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">
            Te mandamos tu stack recomendado, por qué te encaja y tu roadmap completo — para que lo tengas siempre a mano.
          </p>
          <form onSubmit={handleSubmit} className="flex gap-2 flex-col sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className="flex-1 px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-all text-sm"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-600 disabled:opacity-50 transition-colors whitespace-nowrap"
            >
              {status === 'loading' ? 'Enviando...' : 'Enviar gratis →'}
            </button>
          </form>
          {status === 'error' && <p className="text-xs text-red-500 mt-2">Hubo un error. Intentá de nuevo.</p>}
          <p className="text-xs text-gray-400 dark:text-slate-600 mt-2">Sin spam. Solo tu resultado.</p>
        </div>
      </div>
    </div>
  );
}

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<FeedbackState>('none');
  const [shared, setShared] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const h = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
      setHistory(h);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    const encoded = searchParams.get('r');

    // Case 1: URL has encoded answers → call API fresh (shareable link)
    if (encoded) {
      try {
        const answers = JSON.parse(decodeURIComponent(atob(encoded)));
        fetch('/api/recommend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers }),
        })
          .then((r) => r.json())
          .then((data) => {
            if (data.primary) {
              setResult(data);
            }
            setLoading(false);
          })
          .catch(() => setLoading(false));
        return;
      } catch {
        // fall through to sessionStorage
      }
    }

    // Case 2: sessionStorage
    const storedResult = sessionStorage.getItem('stackAdvisorResult');
    if (!storedResult) {
      router.push('/questionnaire');
      return;
    }
    try {
      const parsed = JSON.parse(storedResult);
      if (parsed.primary) {
        setResult(parsed);
        saveToHistory(parsed.primary, sessionStorage.getItem('stackAdvisorAnswers'));
      }
      setLoading(false);
    } catch {
      router.push('/questionnaire');
    }
  }, [router, searchParams]);

  const handleShare = () => {
    const storedAnswers = sessionStorage.getItem('stackAdvisorAnswers');
    if (!storedAnswers) {
      navigator.clipboard.writeText(window.location.href);
      setShared(true);
      setTimeout(() => setShared(false), 2500);
      return;
    }
    try {
      const encoded = btoa(encodeURIComponent(storedAnswers));
      const shareUrl = `${window.location.origin}/results?r=${encoded}`;
      navigator.clipboard.writeText(shareUrl);
      setShared(true);
      setTimeout(() => setShared(false), 2500);
    } catch {
      navigator.clipboard.writeText(window.location.href);
      setShared(true);
      setTimeout(() => setShared(false), 2500);
    }
  };

  const handleCopyResults = () => {
    if (!result) return;
    const { primary } = result;
    const { label } = matchLabel(primary.score);
    const text = `🎯 Mi Stack Recomendado por StackAdvisor

Stack: ${primary.stack.name}
Compatibilidad: ${label}

Tech Stack:
• Frontend: ${primary.stack.technologies.frontend}
• Backend: ${primary.stack.technologies.backend}
• Base de datos: ${primary.stack.technologies.database}
• Hosting: ${primary.stack.technologies.hosting}

¿Por qué este stack?
${primary.matchReasons.map((r) => `• ${r}`).join('\n')}

Costo estimado: ${primary.stack.estimatedCost}
Tiempo de setup: ${primary.stack.setupTime}

Obtén tu recomendación gratis en: stackadvisor-nu.vercel.app`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4" />
          <p className="text-gray-600 dark:text-slate-400">Cargando tu recomendación...</p>
        </div>
      </div>
    );
  }

  if (!result || !result.primary) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No pudimos generar tu recomendación</h2>
          <p className="text-gray-600 dark:text-slate-400 mb-6">
            Algo salió mal al procesar tus respuestas. Por favor intenta de nuevo.
          </p>
          <Link
            href="/questionnaire"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-all"
          >
            Intentar de Nuevo
          </Link>
        </div>
      </div>
    );
  }

  const { primary, alternatives } = result;

  // Build compare URL with primary + alternatives
  const compareUrl = `/compare?stacks=${[primary, ...alternatives]
    .map((r) => r.stack.id)
    .join(',')}`;

  const techRows = [
    { icon: '🎨', label: 'Frontend', value: primary.stack.technologies.frontend },
    { icon: '⚙️', label: 'Backend', value: primary.stack.technologies.backend },
    { icon: '💾', label: 'Base de datos', value: primary.stack.technologies.database },
    { icon: '🚀', label: 'Hosting', value: primary.stack.technologies.hosting },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8 print:bg-white print:py-0">
      <div className="container mx-auto px-4 max-w-5xl">

        {/* Header */}
        <div className="bg-gradient-to-br from-primary to-blue-700 text-white rounded-xl p-8 mb-8 text-center print:rounded-none">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">¡Tu Stack Ideal está Listo!</h1>
          <p className="text-lg opacity-90">
            Evaluamos {result.totalEvaluated} tech stacks y encontramos tu mejor opción
          </p>
        </div>

        {/* Primary Recommendation */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="inline-block bg-accent text-white px-3 py-1 rounded-full text-sm font-medium mb-3">
                {primary.stack.tierLabel}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{primary.stack.name}</h2>
              <p className="text-gray-500 dark:text-slate-400 mt-2">{primary.stack.description}</p>
            </div>
            <ScoreBadge score={primary.score} />
          </div>

          {/* Tech Stack Grid */}
          <div className="mb-6">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">Tu Stack Completo</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {techRows.map(({ icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 bg-gray-50 dark:bg-slate-700 rounded-lg p-3 border border-gray-100 dark:border-slate-600">
                  <span className="text-2xl">{icon}</span>
                  <div>
                    <div className="font-medium text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wide">{label}</div>
                    <div className="text-gray-900 dark:text-white font-semibold text-sm">{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Por qué este stack */}
          <div className="mb-6">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span>💡</span> Por Qué Este Stack es Perfecto Para Ti
            </h3>
            <ul className="space-y-2">
              {(primary.matchReasons && primary.matchReasons.length > 0
                ? primary.matchReasons
                : (primary.stack.bestFor || []).map((b: string) => `Ideal para: ${b}`)
              ).map((reason: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-accent mt-0.5 font-bold flex-shrink-0">✓</span>
                  <span className="text-gray-700 dark:text-slate-300">{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Warnings */}
          {primary.warnings && primary.warnings.length > 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-950 border-2 border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-2 flex items-center gap-2 text-yellow-800 dark:text-yellow-300">
                <span>⚠️</span> Cosas a Considerar
              </h3>
              <ul className="space-y-1">
                {primary.warnings.map((warning, index) => (
                  <li key={index} className="text-yellow-800 dark:text-yellow-300 text-sm">• {warning}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Pros / Cons */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold mb-3 text-accent">Ventajas</h3>
              <ul className="space-y-2">
                {primary.stack.pros.map((pro, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-slate-300">
                    <span className="text-accent font-bold mt-0.5 flex-shrink-0">+</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-gray-500 dark:text-slate-400">Desventajas</h3>
              <ul className="space-y-2">
                {primary.stack.cons.map((con, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-slate-300">
                    <span className="text-gray-400 font-bold mt-0.5 flex-shrink-0">−</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-100 dark:border-slate-700 mb-6">
            {[
              { label: 'Curva de Aprendizaje', value: primary.stack.learningCurve },
              { label: 'Comunidad', value: primary.stack.community },
              { label: 'Costo Estimado', value: primary.stack.estimatedCost },
              { label: 'Tiempo de Setup', value: primary.stack.setupTime },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <div className="text-xs text-gray-400 mb-1 uppercase tracking-wide">{label}</div>
                <div className="font-semibold text-gray-900 dark:text-white text-sm capitalize">{value}</div>
              </div>
            ))}
          </div>

          {/* Feedback */}
          <div className="pt-6 border-t border-gray-100 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <span className="text-sm text-gray-600 dark:text-slate-400 font-medium">¿Te fue útil esta recomendación?</span>
              <button
                onClick={() => setFeedback((p) => (p === 'up' ? 'none' : 'up'))}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg border-2 font-medium text-sm transition-all ${
                  feedback === 'up' ? 'border-accent bg-accent text-white' : 'border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-400 hover:border-accent hover:text-accent'
                }`}
              >
                👍 Sí, me ayudó
              </button>
              <button
                onClick={() => setFeedback((p) => (p === 'down' ? 'none' : 'down'))}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg border-2 font-medium text-sm transition-all ${
                  feedback === 'down' ? 'border-red-400 bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400' : 'border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-400 hover:border-red-400 hover:text-red-500'
                }`}
              >
                👎 Mejorable
              </button>
            </div>
            {feedback !== 'none' && (
              <p className={`text-sm font-medium ${feedback === 'up' ? 'text-accent' : 'text-gray-600 dark:text-slate-400'}`}>
                {feedback === 'up' ? '¡Gracias! Nos alegra haberte ayudado 🙌' : 'Gracias por el feedback. Seguiremos mejorando.'}
              </p>
            )}
          </div>
        </div>

        {/* Recursos para aprender */}
        {primary.stack.resources && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Recursos para empezar</h2>
            <p className="text-gray-500 dark:text-slate-400 text-sm mb-6">Los mejores recursos gratuitos para aprender {primary.stack.name}</p>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { icon: '📖', key: 'docs', label: 'Documentación' },
                { icon: '🎬', key: 'tutorial', label: 'Tutorial' },
                { icon: '⚡', key: 'quickstart', label: 'Inicio rápido' },
              ].map(({ icon, key, label }) => {
                const res = primary.stack.resources![key as keyof typeof primary.stack.resources] as StackResource;
                return (
                  <a
                    key={key}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 border-2 border-gray-200 dark:border-slate-600 rounded-lg p-4 hover:border-primary hover:bg-blue-50 dark:hover:bg-blue-950 transition-all group"
                  >
                    <span className="text-2xl">{icon}</span>
                    <div>
                      <div className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">{label}</div>
                      <div className="text-sm font-semibold text-gray-800 dark:text-slate-200 group-hover:text-primary transition-colors leading-snug">{res.label}</div>
                    </div>
                    <span className="ml-auto text-gray-300 dark:text-slate-600 group-hover:text-primary transition-colors">→</span>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* Primeros pasos HOY */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">¿Por dónde empiezo hoy?</h2>
          <p className="text-gray-500 dark:text-slate-400 text-sm mb-6">Tres acciones concretas para las próximas horas</p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                step: '1',
                title: 'Instala el entorno',
                desc: `Descarga e instala ${primary.stack.technologies.frontend}. Sigue la guía de inicio rápido de la documentación oficial.`,
                color: 'bg-primary',
              },
              {
                step: '2',
                title: 'Crea tu primer proyecto',
                desc: `Crea un "Hello World" y conéctalo a ${primary.stack.technologies.database} en local. No avances sin tener esto funcionando.`,
                color: 'bg-primary',
              },
              {
                step: '3',
                title: 'Haz tu primer deploy',
                desc: `Despliega ese Hello World en ${primary.stack.technologies.hosting}. Producción desde el día 1 cambia la mentalidad completamente.`,
                color: 'bg-accent',
              },
            ].map(({ step, title, desc, color }) => (
              <div key={step} className="bg-gray-50 dark:bg-slate-700 rounded-lg p-5 border border-gray-100 dark:border-slate-600">
                <div className={`w-9 h-9 ${color} text-white rounded-full flex items-center justify-center font-bold text-lg mb-3`}>
                  {step}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Roadmap */}
        {primary.roadmap && primary.roadmap.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 mb-8">
            <Roadmap roadmap={primary.roadmap} />
          </div>
        )}

        {/* Email capture */}
        <div className="mb-8">
          <EmailCapture
            stack={primary.stack}
            reasons={primary.matchReasons || []}
            roadmap={primary.roadmap || []}
          />
        </div>

        {/* Affiliate cards */}
        <AffiliateCards hosting={primary.stack.technologies.hosting} variant="inline" />

        {/* Prompt Generator */}
        <PromptGenerator stack={primary.stack} userProfile={result.userProfile || {}} />

        {/* Alternativas + Comparativa */}
        {alternatives && alternatives.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Opciones Alternativas</h2>
            <p className="text-gray-500 dark:text-slate-400 text-sm mb-6">Si el stack principal no te convence, estas son buenas opciones</p>

            {/* Comparison table */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-100 dark:border-slate-700">
                    <th className="text-left py-3 pr-4 text-gray-500 dark:text-slate-400 font-medium">Stack</th>
                    <th className="text-center py-3 px-3 text-gray-500 dark:text-slate-400 font-medium">Match</th>
                    <th className="text-center py-3 px-3 text-gray-500 dark:text-slate-400 font-medium hidden md:table-cell">Costo/mes</th>
                    <th className="text-center py-3 px-3 text-gray-500 dark:text-slate-400 font-medium hidden md:table-cell">Setup</th>
                    <th className="text-center py-3 px-3 text-gray-500 dark:text-slate-400 font-medium hidden md:table-cell">Escalabilidad</th>
                    <th className="text-center py-3 pl-3 text-gray-500 dark:text-slate-400 font-medium">Curva</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Primary row */}
                  <tr className="border-b border-gray-100 dark:border-slate-700 bg-blue-50 dark:bg-blue-950">
                    <td className="py-3 pr-4 font-semibold text-primary">{primary.stack.name} ⭐</td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-accent font-bold text-xs">{matchLabel(primary.score).label}</span>
                    </td>
                    <td className="py-3 px-3 text-center text-gray-700 dark:text-slate-300 hidden md:table-cell">{primary.stack.estimatedCost}</td>
                    <td className="py-3 px-3 text-center text-gray-700 dark:text-slate-300 hidden md:table-cell">{primary.stack.setupTime}</td>
                    <td className="py-3 px-3 text-center text-gray-700 dark:text-slate-300 capitalize hidden md:table-cell">{primary.stack.scalability}</td>
                    <td className="py-3 pl-3 text-center text-gray-700 dark:text-slate-300 capitalize">{primary.stack.learningCurve}</td>
                  </tr>
                  {/* Alternatives rows */}
                  {alternatives.map((alt) => (
                    <tr key={alt.stack.id} className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700">
                      <td className="py-3 pr-4 font-medium text-gray-800 dark:text-slate-200">{alt.stack.name}</td>
                      <td className="py-3 px-3 text-center">
                        <span className="text-primary font-semibold text-xs">{matchLabel(alt.score).label}</span>
                      </td>
                      <td className="py-3 px-3 text-center text-gray-600 dark:text-slate-400 hidden md:table-cell">{alt.stack.estimatedCost}</td>
                      <td className="py-3 px-3 text-center text-gray-600 dark:text-slate-400 hidden md:table-cell">{alt.stack.setupTime}</td>
                      <td className="py-3 px-3 text-center text-gray-600 dark:text-slate-400 capitalize hidden md:table-cell">{alt.stack.scalability}</td>
                      <td className="py-3 pl-3 text-center text-gray-600 dark:text-slate-400 capitalize">{alt.stack.learningCurve}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Alternative cards */}
            <div className="space-y-4">
              {alternatives.map((alt, index) => (
                <div key={alt.stack.id} className="border-2 border-gray-200 dark:border-slate-600 rounded-lg p-5 hover:border-primary dark:hover:border-primary transition-all">
                  <div className="flex justify-between items-start mb-2 gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{index + 2}. {alt.stack.name}</h3>
                      <p className="text-gray-500 dark:text-slate-400 text-sm mt-0.5">{alt.stack.description}</p>
                    </div>
                    <ScoreBadge score={alt.score} />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-slate-400 mb-3">
                    <strong>Cuándo considerarlo:</strong>{' '}
                    {alt.matchReasons[0] || 'Buena opción alternativa sólida'}
                  </p>
                  <div className="flex gap-2 flex-wrap text-xs text-gray-500 dark:text-slate-400">
                    <span className="bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">💰 {alt.stack.estimatedCost}</span>
                    <span className="bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">⏱ {alt.stack.setupTime}</span>
                    <span className="bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">📈 Curva {alt.stack.learningCurve}</span>
                    {alt.stack.resources && (
                      <a
                        href={alt.stack.resources.docs.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-50 dark:bg-blue-950 text-primary px-2 py-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                      >
                        📖 Ver docs
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cost Estimator */}
        <CostEstimator stack={primary.stack} />

        {/* Compare CTA */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-8 print:hidden">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">¿Querés comparar más stacks?</h2>
              <p className="text-gray-500 dark:text-slate-400 text-sm mt-0.5">
                Compará los {1 + alternatives.length} stacks recomendados lado a lado, o explorá cualquier combinación de los 35 disponibles
              </p>
            </div>
            <Link
              href={compareUrl}
              className="flex-shrink-0 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              ⚖️ Comparar estos stacks
            </Link>
          </div>
        </div>

        {/* History panel */}
        {history.length > 1 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-8 print:hidden">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Tus recomendaciones anteriores</h2>
            <div className="space-y-2">
              {history.slice(1).map((entry, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-4 py-3 border-b border-gray-100 dark:border-slate-700 last:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-800 dark:text-slate-200 text-sm truncate">{entry.stackName}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{entry.date} · {entry.label}</div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    {entry.shareEncoded && (
                      <a
                        href={`/results?r=${entry.shareEncoded}`}
                        className="text-xs text-primary hover:underline border border-primary/20 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-lg"
                      >
                        Ver →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                localStorage.removeItem(HISTORY_KEY);
                setHistory([]);
              }}
              className="mt-3 text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              Borrar historial
            </button>
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-primary to-blue-700 text-white rounded-xl p-8 text-center print:hidden">
          <h2 className="text-2xl font-bold mb-3">¿Listo para Empezar a Construir?</h2>
          <p className="mb-6 opacity-90">Ya tienes todo lo que necesitas para transformar tu idea en realidad</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={handleShare}
              className="bg-white text-primary px-5 py-3 rounded-lg font-medium hover:bg-gray-100 transition-all flex items-center gap-2"
            >
              {shared ? '✅ ¡Link copiado!' : '🔗 Compartir resultados'}
            </button>
            <button
              onClick={handleCopyResults}
              className="bg-white/10 border border-white/30 text-white px-5 py-3 rounded-lg font-medium hover:bg-white/20 transition-all flex items-center gap-2"
            >
              {copied ? '✅ ¡Copiado!' : '📋 Copiar como texto'}
            </button>
            <button
              onClick={() => window.print()}
              className="bg-white/10 border border-white/30 text-white px-5 py-3 rounded-lg font-medium hover:bg-white/20 transition-all"
            >
              📄 Guardar PDF
            </button>
            <Link
              href="/questionnaire"
              className="bg-accent hover:bg-green-500 text-white px-5 py-3 rounded-lg font-medium transition-all"
            >
              Intentar de Nuevo
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary" />
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
