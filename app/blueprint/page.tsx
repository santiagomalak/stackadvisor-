'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const VARIANT_GLOBAL = '0b4b596e-15a4-49e7-a6a2-8f06cabb3286';
const VARIANT_LATAM  = '9542ec0d-60aa-4d07-8922-552b1e4e1638';

const INCLUDES = [
  { icon: '🏗️', title: 'Arquitectura completa',        desc: 'Diagrama de componentes, flujo de datos, esquema de base de datos y decisiones técnicas justificadas para tu proyecto específico.' },
  { icon: '📁', title: 'Estructura de carpetas',        desc: 'La organización exacta del proyecto lista para copiar, con descripción de qué va en cada archivo y carpeta.' },
  { icon: '✨', title: '30+ prompts listos para IA',    desc: 'Un prompt por cada parte de tu app: setup, auth, CRUD, deploy, testing. Pegá directo en Cursor o Claude.' },
  { icon: '🗓️', title: 'Plan de desarrollo milimétrico', desc: 'Semana a semana, qué construir primero, qué evitar, en qué orden. Adaptado a tu nivel y tiempo disponible.' },
  { icon: '💰', title: 'Estimación de costos real',     desc: 'Cuánto vas a gastar en infra desde el MVP hasta 10.000 usuarios. Sin sorpresas.' },
  { icon: '💬', title: 'Chat con IA contextualizado',   desc: 'Una IA que ya sabe todo de tu proyecto. Preguntale lo que quieras sobre tu stack y tu app.' },
  { icon: '👤', title: 'Consulta 1:1 con experto',      desc: '30 minutos con un experto humano que revisó tu Blueprint y puede guiarte con criterio real.' },
  { icon: '♾️', title: 'Acceso permanente',             desc: 'El Blueprint es tuyo para siempre. Lo podés revisar en cualquier momento del desarrollo.' },
];

const FAQS = [
  { q: '¿En cuánto tiempo recibo el Blueprint?',    a: 'Inmediatamente después del pago. Respondés el cuestionario extendido y el Blueprint se genera al instante. La consulta 1:1 la coordinamos en las 48hs siguientes.' },
  { q: '¿Para qué tipo de proyectos sirve?',        a: 'Para cualquier proyecto web, mobile o SaaS. El cuestionario extendido captura todos los detalles de tu proyecto para que el Blueprint sea 100% personalizado.' },
  { q: '¿Necesito saber programar?',                a: 'No necesariamente. Si sos no-técnico, el Blueprint te ayuda a entender qué pedirle a un desarrollador. Si sos dev, te ahorra semanas de decisiones.' },
  { q: '¿Qué pasa si no quedé conforme?',           a: 'Garantía de 7 días. Si el Blueprint no te sirvió, te devolvemos el dinero sin preguntas.' },
  { q: '¿Por qué hay precio LATAM y global?',       a: 'Queremos que el Blueprint sea accesible para devs de toda Latinoamérica. El precio se detecta automáticamente según tu ubicación.' },
];

type GeoData = { isLatam: boolean; price: number; label: string; variantId: string };

export default function BlueprintPage() {
  const [geo, setGeo] = useState<GeoData>({ isLatam: false, price: 40, label: 'Precio global', variantId: VARIANT_GLOBAL });
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
  const variantId = isLatam ? VARIANT_LATAM : VARIANT_GLOBAL;
  const redirectUrl = encodeURIComponent('https://stackadvisor-nu.vercel.app/blueprint/success');
  const checkoutUrl = `https://stackadvisor.lemonsqueezy.com/checkout/buy/${variantId}?embed=1&media=0&logo=0&redirect_url=${redirectUrl}`;

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

            <a
              href={checkoutUrl}
              className="lemonsqueezy-button block w-full bg-accent hover:bg-green-500 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all transform hover:scale-105 shadow-xl text-center"
            >
              Obtener mi Blueprint →
            </a>
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
                  ['Chat con IA contextualizado',         false, true],
                  ['Consulta 1:1 con experto (30 min)',   false, true],
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
          <a
            href={checkoutUrl}
            className="lemonsqueezy-button inline-block bg-white text-primary font-bold py-4 px-10 rounded-xl text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
          >
            Obtener mi Blueprint por ${price} →
          </a>
          <p className="text-white/50 text-xs mt-3">🔒 Pago seguro · Garantía 7 días</p>
        </div>
      </section>
    </div>
  );
}
