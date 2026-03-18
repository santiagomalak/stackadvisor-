'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const VARIANT_GLOBAL = '0b4b596e-15a4-49e7-a6a2-8f06cabb3286';
const VARIANT_LATAM  = '9542ec0d-60aa-4d07-8922-552b1e4e1638';

interface Stack {
  id: string;
  name: string;
  description: string;
  technologies: {
    frontend: string;
    backend: string;
    database: string;
    hosting: string;
    auth: string;
    styling: string;
  };
  estimatedCost: string;
  learningCurve: string;
  bestFor: string[];
}

interface UserProfile {
  projectType?: string;
  experienceLevel?: string;
  budget?: string;
  timeline?: string;
  teamSize?: string;
  [key: string]: any;
}

interface Props {
  stack: Stack;
  userProfile: UserProfile;
}

const PROJECT_TYPE_LABEL: Record<string, string> = {
  saas:      'SaaS / App web con usuarios y suscripciones',
  ecommerce: 'E-commerce / tienda online',
  blog:      'blog / sitio de contenido',
  mobile:    'aplicación móvil',
  dashboard: 'dashboard / herramienta interna',
  api:       'API / backend para terceros',
  social:    'red social / comunidad',
  ai:        'aplicación con IA integrada',
};

const EXPERIENCE_LABEL: Record<string, string> = {
  beginner:     'principiante (menos de 1 año de experiencia)',
  junior:       'junior (1-2 años de experiencia)',
  intermediate: 'intermedio (2-4 años de experiencia)',
  senior:       'senior (más de 4 años de experiencia)',
};

const BUDGET_LABEL: Record<string, string> = {
  free:       'presupuesto $0 (solo tier gratuito)',
  low:        'presupuesto bajo ($0-50/mes)',
  medium:     'presupuesto medio ($50-300/mes)',
  high:       'presupuesto alto ($300+/mes)',
};

type PromptKey = 'kickstart' | 'arquitectura' | 'features' | 'deploy';

const PROMPT_META: Record<PromptKey, { icon: string; title: string; subtitle: string; tools: string[] }> = {
  kickstart:   { icon: '🚀', title: 'Kickstart del proyecto',    subtitle: 'Setup inicial completo con estructura de carpetas y dependencias', tools: ['Cursor', 'Claude', 'ChatGPT'] },
  arquitectura: { icon: '🏗️', title: 'Diseño de arquitectura',  subtitle: 'Estructura de la app, flujo de datos y decisiones técnicas',       tools: ['Claude', 'ChatGPT'] },
  features:    { icon: '⚙️', title: 'Funcionalidades clave',     subtitle: 'Implementación paso a paso de las features principales',           tools: ['Cursor', 'GitHub Copilot'] },
  deploy:      { icon: '🌐', title: 'Deploy a producción',       subtitle: 'Guía completa para llevar la app a producción desde cero',          tools: ['Claude', 'ChatGPT', 'Cursor'] },
};

function buildPrompts(stack: Stack, profile: UserProfile): Record<PromptKey, string> {
  const tech = stack.technologies;
  const projectType = PROJECT_TYPE_LABEL[profile.projectType ?? ''] || profile.projectType || 'aplicación web';
  const experience  = EXPERIENCE_LABEL[profile.experienceLevel ?? ''] || profile.experienceLevel || 'intermedio';
  const budget      = BUDGET_LABEL[profile.budget ?? ''] || profile.budget || 'bajo';
  const stackName   = stack.name;

  const kickstart = `Eres un experto senior en ${stackName}. Voy a construir un ${projectType} usando este stack:
- Frontend: ${tech.frontend}
- Backend: ${tech.backend}
- Base de datos: ${tech.database}
- Hosting: ${tech.hosting}
- Autenticación: ${tech.auth}
- Estilos: ${tech.styling}

Mi nivel es ${experience}. ${budget ? `Restricción de infra: ${budget}.` : ''}

Necesito que me generes:
1. La estructura de carpetas completa del proyecto (con descripción de qué va en cada carpeta)
2. El archivo de configuración inicial (package.json / requirements.txt / go.mod según corresponda) con todas las dependencias necesarias
3. Las variables de entorno (.env.example) que voy a necesitar
4. El comando exacto para inicializar el proyecto desde cero
5. Los primeros 3 archivos que debo crear y su contenido base

Sé específico y directo. Evitá explicaciones largas, dame el código listo para usar.`;

  const arquitectura = `Eres un arquitecto de software especializado en ${stackName}. Diseñá la arquitectura completa para un ${projectType}.

Stack tecnológico:
- Frontend: ${tech.frontend}
- Backend: ${tech.backend}
- Base de datos: ${tech.database}
- Auth: ${tech.auth}

Incluí en tu respuesta:
1. Diagrama de arquitectura en texto (usando ASCII o Mermaid)
2. Flujo de datos: cómo viaja la información desde el usuario hasta la base de datos y de vuelta
3. Esquema de la base de datos (tablas/colecciones principales con sus campos)
4. Estrategia de autenticación y manejo de sesiones con ${tech.auth}
5. Puntos críticos de escalabilidad a tener en cuenta desde el inicio
6. Qué NO hacer con este stack (errores comunes)

Mi nivel: ${experience}.`;

  const features = `Eres un dev experto en ${stackName}. Voy a implementar las features core de un ${projectType}.

Tech stack: ${tech.frontend} + ${tech.backend} + ${tech.database} + ${tech.auth}

Dame el código completo, paso a paso, para implementar estas 3 funcionalidades esenciales:

1. AUTENTICACIÓN con ${tech.auth}:
   - Registro de usuario
   - Login / logout
   - Protección de rutas privadas
   - Manejo del token/sesión

2. CRUD BÁSICO:
   - Crear, leer, actualizar y eliminar el recurso principal de la app
   - Validación de datos en frontend y backend
   - Manejo de errores con mensajes claros para el usuario

3. DASHBOARD PRINCIPAL:
   - Página protegida que muestra los datos del usuario autenticado
   - Estado de carga (loading state)
   - Estado vacío (empty state)

Para cada feature: muéstrame el archivo completo listo para copiar. No me des snippets parciales.`;

  const deploy = `Eres un DevOps experto en ${tech.hosting}. Necesito hacer el deploy de un ${projectType} construido con ${stackName}.

Stack: ${tech.frontend} + ${tech.backend} + ${tech.database}
Hosting: ${tech.hosting}
${budget ? `Presupuesto: ${budget}` : ''}

Dame la guía completa paso a paso para ir de local a producción:

1. PREPARACIÓN:
   - Checklist antes de hacer deploy
   - Variables de entorno necesarias en producción
   - Configuraciones específicas para ${tech.hosting}

2. DEPLOY INICIAL:
   - Comandos exactos en orden
   - Cómo conectar la base de datos ${tech.database} en producción
   - Configurar dominio personalizado (si aplica)

3. CI/CD BÁSICO:
   - Cómo configurar deploy automático al hacer push a main
   - Qué hacer si el deploy falla

4. POST-DEPLOY:
   - Cómo verificar que todo funciona
   - Monitoring básico gratuito
   - Backup de la base de datos

Soy ${experience}. Dame los comandos exactos, no explicaciones genéricas.`;

  return { kickstart, arquitectura, features, deploy };
}

export default function PromptGenerator({ stack, userProfile }: Props) {
  const [activeTab, setActiveTab] = useState<PromptKey>('kickstart');
  const [copied, setCopied] = useState(false);
  const [isLatam, setIsLatam] = useState(false);
  const [manualLatam, setManualLatam] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('/api/geo')
      .then(r => r.json())
      .then((data: { isLatam: boolean }) => setIsLatam(data.isLatam))
      .catch(() => {});
  }, []);

  const effectiveLatam = manualLatam !== null ? manualLatam : isLatam;
  const price = effectiveLatam ? 30 : 40;
  const variantId = effectiveLatam ? VARIANT_LATAM : VARIANT_GLOBAL;
  const checkoutUrl = `https://stackadvisor.lemonsqueezy.com/checkout/buy/${variantId}?embed=1&media=0&logo=0`;

  const prompts = buildPrompts(stack, userProfile);
  const tabs = Object.keys(PROMPT_META) as PromptKey[];

  const handleCopy = () => {
    navigator.clipboard.writeText(prompts[activeTab]).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const meta = PROMPT_META[activeTab];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 mb-8 print:hidden">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">✨</span>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Prompts listos para usar con IA
            </h2>
          </div>
          <p className="text-gray-500 dark:text-slate-400 text-sm">
            Generados específicamente para <strong className="text-gray-700 dark:text-slate-300">{stack.name}</strong> y tu proyecto. Copiá y pegá en Cursor, Claude o ChatGPT.
          </p>
        </div>
        <span className="bg-accent/10 text-accent border border-accent/20 px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0">
          GRATIS
        </span>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((key) => {
          const m = PROMPT_META[key];
          return (
            <button
              key={key}
              onClick={() => { setActiveTab(key); setCopied(false); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                activeTab === key
                  ? 'bg-primary text-white border-primary shadow-md'
                  : 'bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:border-primary hover:text-primary'
              }`}
            >
              <span>{m.icon}</span>
              <span className="hidden sm:inline">{m.title}</span>
              <span className="sm:hidden">{m.icon}</span>
            </button>
          );
        })}
      </div>

      {/* Active prompt */}
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <span>{meta.icon}</span> {meta.title}
            </h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{meta.subtitle}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              {meta.tools.map((tool) => (
                <span key={tool} className="text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 px-2 py-1 rounded-lg font-medium">
                  {tool}
                </span>
              ))}
            </div>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                copied
                  ? 'bg-accent text-white'
                  : 'bg-primary text-white hover:bg-blue-600'
              }`}
            >
              {copied ? '✅ Copiado' : '📋 Copiar prompt'}
            </button>
          </div>
        </div>

        {/* Prompt box */}
        <div className="relative">
          <pre className="bg-gray-50 dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-600 rounded-xl p-5 text-sm text-gray-700 dark:text-slate-300 whitespace-pre-wrap font-mono leading-relaxed max-h-72 overflow-y-auto">
            {prompts[activeTab]}
          </pre>
        </div>
      </div>

      {/* Divider + upsell CTA */}
      <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-200 dark:border-slate-600">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🔒</span>
              <h3 className="font-bold text-gray-900 dark:text-white">
                Blueprint completo — personalizado para tu app
              </h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">
              Cuestionario extendido de 30 preguntas → documento completo con arquitectura detallada,
              estructura de carpetas, prompts por cada feature, plan de desarrollo milimétrico
              y acceso a consulta 1:1 con un experto.
            </p>
            <ul className="mt-3 space-y-1.5">
              {[
                '30+ prompts listos para cada parte de tu app',
                'Arquitectura completa con decisiones justificadas',
                'Plan de desarrollo semana a semana',
                'Consulta 1:1 con experto humano incluida',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
                  <span className="text-accent font-bold">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center flex-shrink-0">
            <div className="flex items-center justify-center gap-2 mb-2">
              <button
                onClick={() => setManualLatam(false)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${!effectiveLatam ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400 hover:bg-gray-200'}`}
              >
                🌍 Global
              </button>
              <button
                onClick={() => setManualLatam(true)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${effectiveLatam ? 'bg-accent text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400 hover:bg-gray-200'}`}
              >
                🌎 LATAM
              </button>
            </div>
            <div className="text-3xl font-black text-gray-900 dark:text-white mb-0.5">
              ${price} <span className="text-base font-normal text-gray-400">USD</span>
            </div>
            <div className="text-xs text-gray-400 mb-4">pago único · acceso permanente</div>
            <a
              href={checkoutUrl}
              className="lemonsqueezy-button block bg-gradient-to-r from-primary to-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm text-center"
            >
              Obtener mi Blueprint →
            </a>
            <p className="text-xs text-gray-400 mt-2">🔒 Pago seguro · Garantía 7 días</p>
          </div>
        </div>
      </div>
    </div>
  );
}
