'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const TESTIMONIALS = [
  {
    quote: 'Tardé 10 minutos en tener el Blueprint. Me ahorré fácil 2 semanas de investigar qué stack usar. El plan semana a semana es oro.',
    name: 'Matías R.',
    role: 'Founder · SaaS de RRHH',
    country: '🇦🇷',
  },
  {
    quote: 'Soy diseñadora metida a founder. Sin el Blueprint no sabría ni por dónde empezar a hablar con los devs. Ahora tengo el vocabulario y el plan.',
    name: 'Valentina G.',
    role: 'Co-founder · Fintech LATAM',
    country: '🇲🇽',
  },
  {
    quote: 'Los prompts de IA solos ya valen el precio. Pegué el primero en Cursor y me generó la estructura del proyecto completa en 5 minutos.',
    name: 'Diego F.',
    role: 'Dev independiente',
    country: '🇨🇴',
  },
];

const VARIANT_GLOBAL = '0b4b596e-15a4-49e7-a6a2-8f06cabb3286';
const VARIANT_LATAM  = '9542ec0d-60aa-4d07-8922-552b1e4e1638';

const INCLUDES = [
  { icon: '🏗️', title: 'Arquitectura completa',         desc: 'Diagrama de componentes, flujo de datos, esquema de base de datos y decisiones técnicas justificadas para tu proyecto específico.' },
  { icon: '📁', title: 'Estructura de carpetas',         desc: 'La organización exacta del proyecto lista para copiar, con descripción de qué va en cada archivo y carpeta.' },
  { icon: '✨', title: '30+ prompts listos para IA',     desc: 'Un prompt por cada parte de tu app: setup, auth, CRUD, deploy, testing. Pegá directo en Cursor o Claude.' },
  { icon: '🗓️', title: 'Plan semana a semana',           desc: 'Qué construir primero, en qué orden, qué evitar. Adaptado a tus horas disponibles y fecha de lanzamiento.' },
  { icon: '💰', title: 'Estimación de costos real',      desc: 'Desglose mensual por servicio desde el MVP hasta escala. Anclado a tu presupuesto declarado. Sin sorpresas.' },
  { icon: '💬', title: '50 mensajes de IA incluidos',    desc: 'Una IA que conoce tu proyecto en profundidad. 50 mensajes para resolver dudas técnicas, de código o de arquitectura.' },
  { icon: '👤', title: 'Sesión 1:1 de 30 min',           desc: 'Una sesión con un experto humano para revisar tu Blueprint, validar decisiones y resolver lo que la IA no puede.' },
  { icon: '💾', title: 'Guardado en tu dispositivo',     desc: 'El Blueprint queda guardado en tu navegador. Cerrá la pestaña y volvé cuando quieras — siempre va a estar ahí.' },
];

const FAQS = [
  { q: '¿En cuánto tiempo recibo el Blueprint?',    a: 'Inmediatamente después del pago. Respondés el cuestionario extendido y el Blueprint se genera al instante. La consulta 1:1 la coordinamos en las 48hs siguientes.' },
  { q: '¿Para qué tipo de proyectos sirve?',        a: 'Para cualquier proyecto web, mobile o SaaS. El cuestionario extendido captura todos los detalles de tu proyecto para que el Blueprint sea 100% personalizado.' },
  { q: '¿Necesito saber programar?',                a: 'No necesariamente. Si sos no-técnico, el Blueprint te ayuda a entender qué pedirle a un desarrollador. Si sos dev, te ahorra semanas de decisiones.' },
  { q: '¿Qué pasa si no quedé conforme?',           a: 'Garantía de 7 días. Si el Blueprint no te sirvió, te devolvemos el dinero sin preguntas.' },
  { q: '¿Por qué hay precio LATAM y global?',       a: 'Queremos que el Blueprint sea accesible para devs de toda Latinoamérica. El precio se detecta automáticamente según tu ubicación.' },
];

type GeoData = { isLatam: boolean; price: number; label: string; checkoutGlobal: string; checkoutLatam: string };

export default function BlueprintPage() {
  const [geo, setGeo] = useState<GeoData>({ isLatam: false, price: 40, label: 'Precio global', checkoutGlobal: '', checkoutLatam: '' });
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [manualLatam, setManualLatam] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('/api/geo')
      .then(r => r.json())
      .then((data: GeoData) => setGeo(data))
      .catch(() => {});
  }, []);

  const isLatam = manualLatam !== null ? manualLatam : geo.isLatam;
  const price = isLatam ? 30 : 40;
  const checkoutUrl = isLatam ? geo.checkoutLatam : geo.checkoutGlobal;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-blue-950 text-white py-20">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="inline-block bg-accent/20 border border-accent/30 text-accent text-sm px-4 py-1.5 rounded-full mb-6 font-medium">
            Producto premium · Pago único
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-5 leading-tight">
            Tu Blueprint de desarrollo
            <span className="text-primary"> personalizado</span>
          </h1>
          <p className="text-lg md:text-xl opacity-85 max-w-2xl mx-auto mb-10 leading-relaxed">
            Respondés 30 preguntas sobre tu proyecto y recibís un plan milimétrico con arquitectura,
            prompts para IA, roadmap y consulta 1:1. Todo lo que necesitás para arrancar sin dudar.
          </p>

          {/* Price card */}
          <div className="bg-white/10 border border-white/20 rounded-2xl p-8 max-w-sm mx-auto">
            {/* Region toggle */}
            <div className="flex items-center justify-center gap-2 mb-5">
              <button
                onClick={() => setManualLatam(false)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${!isLatam ? 'bg-white text-slate-900' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}
              >
                🌍 Global
              </button>
              <button
                onClick={() => setManualLatam(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${isLatam ? 'bg-accent text-white' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}
              >
                🌎 LATAM
              </button>
            </div>

            <div className="text-5xl font-black mb-1">${price}</div>
            <div className="text-white/60 text-sm mb-1">USD · pago único · acceso permanente</div>
            {isLatam && (
              <div className="text-accent text-xs font-medium mb-4">✓ Precio especial para Latinoamérica</div>
            )}
            {!isLatam && <div className="mb-4" />}

            {checkoutUrl ? (
              <a
                href={checkoutUrl}
                className="lemonsqueezy-button block w-full bg-accent hover:bg-green-500 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all transform hover:scale-105 shadow-xl text-center"
              >
                Obtener mi Blueprint →
              </a>
            ) : (
              <button disabled className="block w-full bg-accent/50 text-white font-bold py-4 px-8 rounded-xl text-lg cursor-wait text-center">
                Cargando…
              </button>
            )}
            <p className="text-white/50 text-xs mt-3">🔒 Pago seguro · Garantía 7 días</p>
          </div>

          {/* Auto-detected notice */}
          <p className="text-white/40 text-xs mt-4">
            {geo.isLatam
              ? '✓ Precio LATAM detectado automáticamente según tu ubicación'
              : 'Precio detectado según tu ubicación · ¿Sos de LATAM? Seleccionalo arriba'}
          </p>
        </div>
      </section>

      {/* Ejemplo + contador */}
      <section className="py-10 bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-3xl font-black text-primary">+120</div>
                <div className="text-xs text-gray-500 dark:text-slate-400">Blueprints generados</div>
              </div>
              <div className="w-px h-10 bg-gray-200 dark:bg-slate-600" />
              <div className="text-center">
                <div className="text-3xl font-black text-accent">7 días</div>
                <div className="text-xs text-gray-500 dark:text-slate-400">Garantía de devolución</div>
              </div>
              <div className="w-px h-10 bg-gray-200 dark:bg-slate-600" />
              <div className="text-center">
                <div className="text-3xl font-black text-gray-900 dark:text-white">10 min</div>
                <div className="text-xs text-gray-500 dark:text-slate-400">Para tenerlo listo</div>
              </div>
            </div>
            <Link
              href="/blueprint/ejemplo"
              className="flex items-center gap-2 bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-slate-200 font-semibold px-5 py-3 rounded-xl transition-all text-sm"
            >
              <span>👀</span> Ver ejemplo de Blueprint
            </Link>
          </div>
        </div>
      </section>

      {/* Qué incluye */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-3">Todo lo que incluye</h2>
          <p className="text-gray-500 dark:text-slate-400 text-center mb-12 max-w-xl mx-auto">
            No es un PDF genérico. Es un documento construido específicamente para tu proyecto, tu stack y tu nivel.
          </p>
          <div className="grid md:grid-cols-2 gap-5">
            {INCLUDES.map(({ icon, title, desc }) => (
              <div key={title} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-600 p-6 flex gap-4 shadow-sm hover:shadow-md hover:border-primary dark:hover:border-primary transition-all">
                <div className="text-3xl flex-shrink-0">{icon}</div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">{title}</h3>
                  <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabla comparativa */}
      <section className="py-16 bg-white dark:bg-slate-800">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Gratis vs Blueprint</h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-slate-600 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-700">
                  <th className="text-left py-4 px-6 text-gray-500 dark:text-slate-400 font-medium">Qué recibís</th>
                  <th className="text-center py-4 px-4 text-gray-500 dark:text-slate-400 font-medium">Gratis</th>
                  <th className="text-center py-4 px-4 text-primary font-bold">Blueprint</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                {[
                  ['Recomendación de stack',              true,  true],
                  ['Roadmap de 12 semanas',               true,  true],
                  ['4 prompts básicos para IA',           true,  true],
                  ['Estimador de costos',                 true,  true],
                  ['Cuestionario extendido (30 preguntas)', false, true],
                  ['Arquitectura completa de tu app',     false, true],
                  ['Estructura de carpetas lista',        false, true],
                  ['30+ prompts para cada feature',       false, true],
                  ['Plan de desarrollo milimétrico',      false, true],
                  ['50 mensajes de IA contextualizada',   false, true],
                  ['Sesión 1:1 con experto (30 min)',     false, true],
                  ['Garantía de 7 días',                  false, true],
                ].map(([feature, free, paid]) => (
                  <tr key={feature as string} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                    <td className="py-3 px-6 text-gray-700 dark:text-slate-300">{feature as string}</td>
                    <td className="py-3 px-4 text-center">{free ? <span className="text-accent font-bold">✓</span> : <span className="text-gray-300 dark:text-slate-600">—</span>}</td>
                    <td className="py-3 px-4 text-center">{paid ? <span className="text-accent font-bold">✓</span> : <span className="text-gray-300 dark:text-slate-600">—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-16 bg-white dark:bg-slate-800">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-3">Lo que dicen quienes ya lo usaron</h2>
          <p className="text-gray-500 dark:text-slate-400 text-center mb-12 max-w-xl mx-auto">
            Founders, devs y no-técnicos que arrancaron su proyecto con un Blueprint.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ quote, name, role, country }) => (
              <div key={name} className="bg-gray-50 dark:bg-slate-700 rounded-2xl p-6 border border-gray-100 dark:border-slate-600 flex flex-col gap-4">
                <div className="flex gap-0.5 text-amber-400 text-sm">{'★★★★★'}</div>
                <p className="text-gray-700 dark:text-slate-300 text-sm leading-relaxed flex-1">"{quote}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-gray-200 dark:border-slate-600">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-base">{country}</div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white text-sm">{name}</div>
                    <div className="text-xs text-gray-500 dark:text-slate-400">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* El creador */}
      <section className="py-16 bg-gray-50 dark:bg-slate-900">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-600 p-8 flex flex-col sm:flex-row gap-8 items-center shadow-sm">
            <div className="flex-shrink-0 w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-4xl font-black shadow-lg">
              S
            </div>
            <div>
              <div className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Quién está detrás</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Santiago Aragón — Dev y founder</h3>
              <p className="text-gray-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                Construí StackAdvisor porque yo mismo perdí semanas eligiendo el stack correcto para mis proyectos.
                Cada Blueprint que generás lo reviso personalmente en la sesión 1:1 — no es solo un documento generado por IA.
                Aporto el contexto humano que ningún modelo de lenguaje puede darte.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://wa.me/5493834553249"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-accent/10 text-accent font-semibold text-sm px-4 py-2 rounded-lg hover:bg-accent/20 transition-colors"
                >
                  <span>💬</span> WhatsApp directo
                </a>
                <span className="inline-flex items-center gap-2 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 text-sm px-4 py-2 rounded-lg">
                  <span>⚡</span> Responde en menos de 4hs
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-10">Preguntas frecuentes</h2>
          <div className="space-y-3">
            {FAQS.map(({ q, a }, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-600 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 font-medium text-gray-900 dark:text-white hover:text-primary transition-colors"
                >
                  <span>{q}</span>
                  <span className={`flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}>▾</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-sm text-gray-600 dark:text-slate-400 leading-relaxed border-t border-gray-100 dark:border-slate-700 pt-4">
                    {a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-16 bg-gradient-to-br from-primary to-blue-700">
        <div className="container mx-auto px-4 max-w-xl text-center text-white">
          <div className="text-5xl mb-4">🎯</div>
          <h2 className="text-3xl font-bold mb-3">¿Listo para arrancar?</h2>
          <p className="opacity-85 mb-8">En menos de 10 minutos tenés tu Blueprint listo para usar.</p>
          {checkoutUrl ? (
            <a
              href={checkoutUrl}
              className="lemonsqueezy-button inline-block bg-white text-primary font-bold py-4 px-10 rounded-xl text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
            >
              Obtener mi Blueprint por ${price} →
            </a>
          ) : (
            <button disabled className="inline-block bg-white/50 text-primary font-bold py-4 px-10 rounded-xl text-lg cursor-wait">
              Cargando…
            </button>
          )}
          <p className="text-white/50 text-xs mt-3">🔒 Pago seguro · Garantía 7 días</p>
        </div>
      </section>
    </div>
  );
}
