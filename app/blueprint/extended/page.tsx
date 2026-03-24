'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const QUESTIONS = [
  // Bloque 1 — Tu proyecto
  { id: 'user_email',       section: 'Tu proyecto',       q: '¿Cuál es tu email? Te enviamos el Blueprint ahí para que lo tengas siempre.', type: 'email',  placeholder: 'hola@ejemplo.com' },
  { id: 'project_name',     section: 'Tu proyecto',       q: '¿Cómo se llama tu proyecto o idea?',                                          type: 'text',   placeholder: 'Ej: AppMiNegocio, PlatformX...' },
  { id: 'project_desc',     section: 'Tu proyecto',       q: 'Describí tu proyecto en 2-3 oraciones. ¿Qué hace y para quién?',              type: 'textarea', placeholder: 'Ej: Una app para que dueños de gimnasios gestionen sus turnos y pagos...' },
  { id: 'main_problem',     section: 'Tu proyecto',       q: '¿Qué problema específico resuelve tu app?',                                   type: 'textarea', placeholder: 'Ej: Los gimnasios pierden clientes porque no tienen sistema de reservas online...' },
  { id: 'target_user',      section: 'Tu proyecto',       q: '¿Quién es tu usuario objetivo? Describilo lo más específico posible.',        type: 'textarea', placeholder: 'Ej: Dueños de gimnasios pequeños de 50-200 socios en Argentina...' },
  { id: 'competitors',      section: 'Tu proyecto',       q: '¿Existe algo similar? ¿Cuáles son tus competidores o referencias?',          type: 'textarea', placeholder: 'Ej: Mindbody, pero es muy caro para gimnasios pequeños. QuieroTurno, pero no tiene pagos...' },

  // Bloque 2 — Features
  { id: 'core_features',    section: 'Funcionalidades',   q: 'Listá las 5 funcionalidades más importantes de tu app (en orden de prioridad).', type: 'textarea', placeholder: '1. Login de usuarios\n2. Sistema de reservas\n3. Pagos con Mercado Pago\n4. Panel del admin\n5. Notificaciones por email' },
  { id: 'auth_type',        section: 'Funcionalidades',   q: '¿Qué tipo de autenticación necesitás?',                                       type: 'choice',  options: ['Email + contraseña', 'Google / Social login', 'Ambas', 'Sin login (app pública)', 'No sé todavía'] },
  { id: 'payments',         section: 'Funcionalidades',   q: '¿Tu app necesita procesar pagos?',                                            type: 'choice',  options: ['Sí, pagos únicos', 'Sí, suscripciones mensuales', 'Sí, ambos', 'No, es gratis', 'No sé todavía'] },
  { id: 'payment_platform', section: 'Funcionalidades',   q: '¿Qué plataforma de pagos preferís?',                                         type: 'choice',  options: ['Stripe', 'Mercado Pago', 'PayPal', 'Ambas (Stripe + MercadoPago)', 'No sé, recomendame'] },
  { id: 'realtime',         section: 'Funcionalidades',   q: '¿Necesitás funcionalidades en tiempo real?',                                  type: 'choice',  options: ['Sí, chat entre usuarios', 'Sí, notificaciones live', 'Sí, datos que se actualizan solos', 'No necesito tiempo real', 'No sé'] },
  { id: 'file_upload',      section: 'Funcionalidades',   q: '¿Los usuarios van a subir archivos o imágenes?',                             type: 'choice',  options: ['Sí, imágenes de perfil', 'Sí, documentos o archivos', 'Sí, videos', 'No', 'No sé'] },
  { id: 'roles',            section: 'Funcionalidades',   q: '¿Hay diferentes tipos de usuarios con distintos permisos?',                  type: 'choice',  options: ['Sí, admin y usuario normal', 'Sí, múltiples roles (admin, manager, user...)', 'No, todos ven lo mismo', 'No sé todavía'] },

  // Bloque 3 — Técnico
  { id: 'platform',         section: 'Técnico',           q: '¿En qué plataforma va a correr tu app?',                                     type: 'choice',  options: ['Solo web (desktop + mobile responsive)', 'Web + App móvil nativa', 'Solo app móvil', 'API para otros'] },
  { id: 'existing_code',    section: 'Técnico',           q: '¿Ya tenés código escrito o arrancás de cero?',                               type: 'choice',  options: ['Arranco de cero', 'Tengo un prototipo básico', 'Tengo bastante código pero necesito reorganizarlo', 'Tengo código en otro stack que quiero migrar'] },
  { id: 'team',             section: 'Técnico',           q: '¿Con quién vas a construir esto?',                                           type: 'choice',  options: ['Solo (soy el único dev)', 'Con 1 dev más', 'Con un equipo de 3-5', 'Voy a contratar freelancers', 'No tengo dev, busco alguien'] },
  { id: 'dev_hours',        section: 'Técnico',           q: '¿Cuántas horas por semana podés dedicarle al desarrollo?',                   type: 'choice',  options: ['Menos de 5hs', '5-15hs', '15-30hs', '30+ hs (full time)'] },
  { id: 'launch_date',      section: 'Técnico',           q: '¿Cuándo necesitás tener algo funcionando para mostrar?',                     type: 'choice',  options: ['En 2-4 semanas (MVP urgente)', 'En 1-3 meses', 'En 3-6 meses', 'Sin fecha fija, quiero hacerlo bien'] },

  // Bloque 4 — Negocio
  { id: 'monetization',     section: 'Negocio',           q: '¿Cómo vas a monetizar la app?',                                              type: 'choice',  options: ['Suscripción mensual (SaaS)', 'Pago por uso', 'Venta de producto único', 'Freemium (gratis + premium)', 'Publicidad', 'Aún no lo definí'] },
  { id: 'mvp_users',        section: 'Negocio',           q: '¿Cuántos usuarios esperás en los primeros 3 meses?',                        type: 'choice',  options: ['Menos de 100', '100-500', '500-2000', 'Más de 2000', 'No tengo idea'] },
  { id: 'infra_budget',     section: 'Negocio',           q: '¿Cuánto podés gastar en infraestructura por mes?',                          type: 'choice',  options: ['$0 (solo free tiers)', '$10-30/mes', '$30-100/mes', '$100-300/mes', 'Más de $300/mes'] },
  { id: 'total_budget',     section: 'Negocio',           q: '¿Cuál es tu presupuesto total para el desarrollo?',                         type: 'choice',  options: ['$0 (lo construyo yo solo)', '$500-2000', '$2000-10000', '$10000+', 'Prefiero no decirlo'] },

  // Bloque 5 — Contexto extra
  { id: 'biggest_fear',     section: 'Contexto',          q: '¿Cuál es tu mayor miedo o duda sobre este proyecto?',                       type: 'textarea', placeholder: 'Ej: No sé si voy a poder escalarlo cuando crezca. Miedo a elegir mal el stack y tener que rehacer todo...' },
  { id: 'tried_before',     section: 'Contexto',          q: '¿Intentaste construir esto antes? ¿Qué pasó?',                              type: 'textarea', placeholder: 'Ej: Empecé con PHP pero me perdí. Intenté con Firebase pero los costos escalaron mucho...' },
  { id: 'specific_doubts',  section: 'Contexto',          q: '¿Hay alguna decisión técnica específica que te esté trabando?',             type: 'textarea', placeholder: 'Ej: No sé si usar SQL o NoSQL. No entiendo cuándo conviene un monolito vs microservicios...' },
  { id: 'extra_context',    section: 'Contexto',          q: '¿Algo más que quieras contarnos sobre tu proyecto? (opcional)',             type: 'textarea', placeholder: 'Cualquier contexto que creas relevante...', optional: true },
];

const SECTIONS = ['Tu proyecto', 'Funcionalidades', 'Técnico', 'Negocio', 'Contexto'];

export default function ExtendedQuestionnairePage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentSection, setCurrentSection] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const sectionQuestions = QUESTIONS.filter(q => q.section === SECTIONS[currentSection]);
  const totalAnswered = sectionQuestions.filter(q => q.optional || answers[q.id]?.trim()).length;
  const requiredAnswered = sectionQuestions.filter(q => !q.optional && answers[q.id]?.trim()).length;
  const requiredTotal = sectionQuestions.filter(q => !q.optional).length;
  const sectionComplete = requiredAnswered === requiredTotal;

  const handleAnswer = (id: string, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleNext = () => {
    if (currentSection < SECTIONS.length - 1) {
      setCurrentSection(s => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    // Store answers in sessionStorage for the blueprint generation page
    sessionStorage.setItem('blueprintAnswers', JSON.stringify(answers));
    // Redirect to blueprint result
    router.push('/blueprint/result');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="container mx-auto px-4 max-w-2xl">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Cuestionario Blueprint
          </h1>
          <p className="text-gray-500 dark:text-slate-400 text-sm">
            Cuanto más detallado, mejor tu Blueprint. ~10 minutos.
          </p>
        </div>

        {/* Section progress */}
        <div className="flex gap-2 mb-8">
          {SECTIONS.map((s, i) => (
            <div key={s} className="flex-1">
              <div className={`h-2 rounded-full transition-all ${
                i < currentSection ? 'bg-accent' :
                i === currentSection ? 'bg-primary' :
                'bg-gray-200 dark:bg-slate-700'
              }`} />
              <div className={`text-xs mt-1 text-center hidden sm:block ${
                i === currentSection ? 'text-primary font-medium' : 'text-gray-400 dark:text-slate-600'
              }`}>{s}</div>
            </div>
          ))}
        </div>

        {/* Section title */}
        <div className="mb-6">
          <div className="text-xs text-primary font-semibold uppercase tracking-wide mb-1">
            Sección {currentSection + 1} de {SECTIONS.length}
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {SECTIONS[currentSection]}
          </h2>
        </div>

        {/* Questions */}
        <div className="space-y-6 mb-8">
          {sectionQuestions.map((q) => (
            <div key={q.id} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-600 p-6 shadow-sm">
              <label className="block font-semibold text-gray-900 dark:text-white mb-3 text-sm leading-relaxed">
                {q.q}
                {q.optional && <span className="text-gray-400 dark:text-slate-500 font-normal ml-2">(opcional)</span>}
              </label>

              {q.type === 'choice' && q.options && (
                <div className="space-y-2">
                  {q.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleAnswer(q.id, opt)}
                      className={`w-full text-left px-4 py-3 rounded-lg border-2 text-sm transition-all ${
                        answers[q.id] === opt
                          ? 'border-primary bg-blue-50 dark:bg-blue-950 text-primary font-medium'
                          : 'border-gray-200 dark:border-slate-600 text-gray-700 dark:text-slate-300 hover:border-primary hover:bg-gray-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {(q.type === 'text' || q.type === 'email') && (
                <input
                  type={q.type}
                  value={answers[q.id] || ''}
                  onChange={e => handleAnswer(q.id, e.target.value)}
                  placeholder={q.placeholder}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-primary transition-all text-sm"
                />
              )}

              {q.type === 'textarea' && (
                <textarea
                  value={answers[q.id] || ''}
                  onChange={e => handleAnswer(q.id, e.target.value)}
                  placeholder={q.placeholder}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-primary transition-all text-sm resize-none"
                />
              )}
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => { setCurrentSection(s => s - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            disabled={currentSection === 0}
            className="px-6 py-3 rounded-lg border-2 border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-400 font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:border-primary hover:text-primary transition-all text-sm"
          >
            ← Anterior
          </button>

          <span className="text-xs text-gray-400 dark:text-slate-600">
            {requiredAnswered}/{requiredTotal} respondidas
          </span>

          <button
            onClick={handleNext}
            disabled={!sectionComplete || submitting}
            className="px-6 py-3 rounded-lg bg-primary text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-600 transition-all text-sm"
          >
            {submitting ? 'Generando...' : currentSection === SECTIONS.length - 1 ? '✨ Generar Blueprint →' : 'Siguiente →'}
          </button>
        </div>
      </div>
    </div>
  );
}
