'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (sessionId) setVerified(true);
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center">

        {/* Success icon */}
        <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <span className="text-5xl">✓</span>
        </div>

        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-3">
          ¡Pago confirmado!
        </h1>
        <p className="text-gray-500 dark:text-slate-400 mb-8 leading-relaxed">
          Tu Blueprint está a un paso. Respondé el cuestionario extendido y generamos tu
          plan de desarrollo personalizado al instante.
        </p>

        {/* Steps */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-600 p-6 mb-8 text-left shadow-sm">
          <h3 className="font-bold text-gray-900 dark:text-white mb-5">¿Qué sigue?</h3>
          <div className="space-y-4">
            {[
              { step: '1', title: 'Cuestionario extendido', desc: '30 preguntas sobre tu proyecto. Tarda ~10 minutos.', active: true },
              { step: '2', title: 'Blueprint generado', desc: 'Tu plan completo listo al instante con IA.', active: false },
              { step: '3', title: 'Consulta 1:1', desc: 'Te contactamos en menos de 24hs para coordinar tu sesión.', active: false },
            ].map(({ step, title, desc, active }) => (
              <div key={step} className="flex items-start gap-4">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${active ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-slate-500'}`}>
                  {step}
                </div>
                <div>
                  <div className={`font-semibold text-sm ${active ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-slate-500'}`}>{title}</div>
                  <div className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Link
          href="/blueprint/extended"
          className="block w-full bg-primary text-white font-bold py-4 px-8 rounded-xl text-lg hover:bg-blue-600 transition-all transform hover:scale-105 shadow-lg mb-4"
        >
          Completar cuestionario extendido →
        </Link>
        <p className="text-xs text-gray-400 dark:text-slate-600">
          ¿Problemas con el pago? Escribinos a{' '}
          <a href="mailto:hola@stackadvisor.app" className="text-primary hover:underline">
            hola@stackadvisor.app
          </a>
        </p>
      </div>
    </div>
  );
}

export default function BlueprintSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
