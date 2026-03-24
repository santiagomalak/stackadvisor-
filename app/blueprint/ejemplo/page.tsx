'use client';

import Link from 'next/link';

const EJEMPLO_BLUEPRINT = `# Blueprint de Desarrollo — TaskFlow Pro

## 1. Resumen Ejecutivo

**TaskFlow Pro** es una herramienta SaaS de gestión de tareas para equipos remotos de hasta 20 personas. El objetivo es llegar a un MVP funcional en 8 semanas con un presupuesto de infraestructura de $20-50/mes.

Stack recomendado: **Next.js 14 + Supabase + Vercel**

Este stack fue elegido porque permite un desarrollo rápido con un solo desarrollador, incluye autenticación lista para usar, base de datos PostgreSQL con tiempo real, y escala desde $0 hasta miles de usuarios sin cambiar de proveedor.

---

## 2. Stack Tecnológico

| Capa | Tecnología | Justificación |
|------|-----------|---------------|
| Frontend | Next.js 14 (App Router) | SSR + RSC + DX excelente |
| Base de datos | Supabase PostgreSQL | Auth + realtime + storage incluidos |
| Autenticación | Supabase Auth | Email, Google, GitHub en minutos |
| Hosting | Vercel | Deploy automático desde GitHub, CDN global |
| Email | Resend | Transaccional moderno, gratis hasta 3000/mes |
| Pagos | Lemon Squeezy | SaaS-first, sin necesidad de LLC |
| Estilos | Tailwind CSS + shadcn/ui | Productividad máxima |
| Tipado | TypeScript | Seguridad de tipos end-to-end |

---

## 3. Arquitectura del Sistema

\`\`\`
                    ┌─────────────────────────┐
                    │   Usuario (Browser)      │
                    └───────────┬─────────────┘
                                │ HTTPS
                    ┌───────────▼─────────────┐
                    │   Vercel Edge Network    │
                    │   (CDN + Serverless)     │
                    └───────────┬─────────────┘
                                │
              ┌─────────────────┼─────────────────┐
              │                 │                 │
   ┌──────────▼──────┐ ┌───────▼──────┐ ┌───────▼──────┐
   │  Next.js App    │ │  API Routes  │ │  Static      │
   │  (RSC + SSR)    │ │  /api/*      │ │  Assets      │
   └──────────┬──────┘ └───────┬──────┘ └──────────────┘
              │                │
   ┌──────────▼────────────────▼──────┐
   │           Supabase               │
   │  ┌──────────┐  ┌──────────────┐  │
   │  │ Auth     │  │ PostgreSQL   │  │
   │  └──────────┘  └──────────────┘  │
   │  ┌──────────┐  ┌──────────────┐  │
   │  │ Realtime │  │ Storage      │  │
   │  └──────────┘  └──────────────┘  │
   └──────────────────────────────────┘
\`\`\`

**Flujo de datos:**
1. Usuario hace request → Vercel Edge recibe
2. Next.js server components renderizan con datos de Supabase
3. Client components se hidratan en el browser
4. Realtime subscriptions mantienen el estado sincronizado entre usuarios

---

## 4. Estructura de Carpetas

\`\`\`
taskflow-pro/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/page.tsx
│   │   ├── projects/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── tasks/page.tsx
│   │   ├── team/page.tsx
│   │   └── layout.tsx
│   ├── api/
│   │   ├── projects/route.ts
│   │   ├── tasks/route.ts
│   │   └── webhooks/lemon/route.ts
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/              ← shadcn/ui components
│   ├── tasks/
│   │   ├── TaskCard.tsx
│   │   ├── TaskBoard.tsx
│   │   └── TaskForm.tsx
│   ├── projects/
│   │   ├── ProjectCard.tsx
│   │   └── ProjectSidebar.tsx
│   └── shared/
│       ├── Navbar.tsx
│       └── UserAvatar.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts    ← browser client
│   │   └── server.ts    ← server client
│   ├── utils.ts
│   └── validations.ts
├── types/
│   └── database.ts      ← tipos generados por Supabase
├── middleware.ts         ← protección de rutas
└── supabase/
    └── migrations/      ← SQL migrations
\`\`\`

---

## 5. Esquema de Base de Datos

\`\`\`sql
-- Equipos / Organizations
create table teams (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text unique not null,
  plan        text default 'free',   -- free | pro | enterprise
  created_at  timestamptz default now()
);

-- Miembros del equipo
create table team_members (
  id        uuid primary key default gen_random_uuid(),
  team_id   uuid references teams(id) on delete cascade,
  user_id   uuid references auth.users(id) on delete cascade,
  role      text default 'member',  -- owner | admin | member
  joined_at timestamptz default now(),
  unique(team_id, user_id)
);

-- Proyectos
create table projects (
  id          uuid primary key default gen_random_uuid(),
  team_id     uuid references teams(id) on delete cascade,
  name        text not null,
  description text,
  status      text default 'active', -- active | archived | completed
  color       text default '#3b82f6',
  created_at  timestamptz default now()
);

-- Tareas
create table tasks (
  id           uuid primary key default gen_random_uuid(),
  project_id   uuid references projects(id) on delete cascade,
  assigned_to  uuid references auth.users(id),
  title        text not null,
  description  text,
  status       text default 'todo',    -- todo | in_progress | review | done
  priority     text default 'medium',  -- low | medium | high | urgent
  due_date     date,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- RLS Policies (Row Level Security)
alter table projects enable row level security;
create policy "Team members can view projects"
  on projects for select
  using (team_id in (
    select team_id from team_members where user_id = auth.uid()
  ));
\`\`\`

---

## 6. Plan de Desarrollo — Semana a Semana

**Semana 1 — Setup y Auth**
- Inicializar proyecto Next.js 14 con TypeScript y Tailwind
- Configurar Supabase (proyecto, variables de entorno)
- Implementar login/register con Supabase Auth (email + Google)
- Middleware para protección de rutas
- Layout del dashboard vacío

**Semana 2 — Core: Proyectos**
- CRUD de proyectos (crear, listar, archivar)
- Invitar miembros al equipo por email
- Roles: owner, admin, member
- Row Level Security en Supabase

**Semana 3 — Core: Tareas**
- CRUD de tareas con estados (Todo → In Progress → Review → Done)
- Asignar tareas a miembros
- Prioridad y fecha de vencimiento
- Vista board (kanban) y lista

**Semana 4 — Tiempo real**
- Supabase Realtime para sincronización de tareas
- Notificaciones en tiempo real cuando asignan una tarea
- Indicador de "online" para miembros activos

**Semana 5 — Pagos**
- Integrar Lemon Squeezy para plan Pro ($12/mes)
- Webhook para activar plan tras pago
- Límites del plan free (3 proyectos, 10 tareas)
- Página de billing

**Semana 6 — Email y notificaciones**
- Resend para emails transaccionales
- Notificación cuando se asigna una tarea
- Digest semanal de tareas pendientes
- Email de bienvenida al registrarse

**Semana 7 — Pulir UX**
- Loading states y skeletons
- Manejo de errores
- Mobile responsive
- Búsqueda de tareas

**Semana 8 — Deploy y lanzamiento**
- Dominio personalizado en Vercel
- Variables de entorno de producción
- Tests básicos de flujo crítico
- Lanzamiento en ProductHunt / Twitter

---

## 7. Prompts Listos para IA

**Prompt 1 — Setup inicial**
\`\`\`
Soy un dev senior. Configurá un proyecto Next.js 14 con TypeScript, Tailwind CSS y Supabase.
Incluí:
- /app/layout.tsx con ThemeProvider
- Supabase client para browser (lib/supabase/client.ts) y server (lib/supabase/server.ts)
- middleware.ts que protege /dashboard/* y redirige a /login si no hay sesión
- Variables de entorno en .env.local: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
Usá el patrón oficial de Supabase para Next.js App Router con cookies.
\`\`\`

**Prompt 2 — CRUD de tareas**
\`\`\`
Con Supabase + Next.js App Router, creá un componente TaskBoard.tsx que:
- Muestre tareas agrupadas por status (todo, in_progress, review, done)
- Permita drag & drop entre columnas (usá @hello-pangea/dnd)
- Al mover una tarjeta llame a Supabase para actualizar el status
- Suscriba a cambios en tiempo real con supabase.channel().on('postgres_changes')
- Optimistic update: actualice el UI antes de confirmar con el servidor
\`\`\`

**Prompt 3 — Auth con Google**
\`\`\`
Implementá login con Google OAuth en Supabase + Next.js 14:
- Botón "Continuar con Google" en /login/page.tsx
- Handler en /auth/callback/route.ts que intercambia el code por session
- Después del login, crea automáticamente un team para el usuario si no tiene uno
- Redirigir a /dashboard
Usá supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } })
\`\`\`

**Prompt 4 — Webhook Lemon Squeezy**
\`\`\`
Creá /api/webhooks/lemon/route.ts que:
- Verifique la firma del webhook con HMAC SHA256
- Si event_type === 'order_created', active el plan pro del team en Supabase
- Actualice teams SET plan = 'pro' WHERE id = metadata.team_id
- Retorne 200 OK si todo salió bien, 400 si falló la verificación
Incluí el secret key desde process.env.LEMON_WEBHOOK_SECRET
\`\`\`

---

## 8. Estimación de Costos

| Servicio | MVP (mes 1-3) | Crecimiento (mes 4-6) | Escala (mes 7-12) |
|---------|--------------|----------------------|-------------------|
| Vercel | $0 (hobby) | $20/mes (pro) | $20/mes |
| Supabase | $0 (free) | $25/mes (pro) | $25/mes |
| Resend | $0 (<3K emails) | $0 | $20/mes |
| Dominio | $12/año | — | — |
| **Total** | **~$1/mes** | **~$45/mes** | **~$65/mes** |

> El plan free de Supabase soporta hasta 50,000 filas y 2GB de storage. Con el plan Pro ($25/mes) obtenés backups diarios, 8GB storage y soporte prioritario. El salto tiene sentido cuando tenés usuarios pagando.

---

## 9. Riesgos y Mitigaciones

**Riesgo 1 — Complejidad del tiempo real**
Supabase Realtime puede tener latencia en conexiones lentas. Mitigación: implementar optimistic updates primero, Realtime como mejora progresiva.

**Riesgo 2 — Límites del plan free**
Supabase free tiene límite de 500MB de DB. Con TaskFlow Pro y equipos pequeños, esto da para ~6 meses. Planificar migración a Pro antes de llegar al límite.

**Riesgo 3 — Retención de usuarios**
Sin notificaciones push o email, los usuarios olvidan el producto. Implementar email digest desde semana 6 es crítico para la retención.

**Riesgo 4 — Escalabilidad del kanban**
Si un proyecto tiene +500 tareas, el drag & drop se puede poner lento. Mitigación: paginación virtual y lazy loading de columnas.

---

## 10. Primeros 3 Pasos Para HOY

1. **Crear el proyecto base** (30 minutos)
   \`npx create-next-app@latest taskflow-pro --typescript --tailwind --app\`
   Crear proyecto en supabase.com y copiar las variables de entorno.

2. **Configurar Auth** (2 horas)
   Implementar login/register con email usando el prompt #1 y #3 de arriba.
   Probar que el middleware protege /dashboard correctamente.

3. **Primera tabla en producción** (1 hora)
   Crear la tabla \`teams\` y \`team_members\` en Supabase con RLS activado.
   Al loguearse, verificar que se crea el equipo automáticamente.`;

const SECTIONS = [
  { id: 'resumen', label: '1. Resumen' },
  { id: 'stack', label: '2. Stack' },
  { id: 'arquitectura', label: '3. Arquitectura' },
  { id: 'carpetas', label: '4. Carpetas' },
  { id: 'db', label: '5. Base de datos' },
  { id: 'plan', label: '6. Plan semanal' },
  { id: 'prompts', label: '7. Prompts IA' },
  { id: 'costos', label: '8. Costos' },
  { id: 'riesgos', label: '9. Riesgos' },
  { id: 'pasos', label: '10. Primeros pasos' },
];

function renderLine(line: string, i: number): React.ReactNode {
  if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-black text-gray-900 dark:text-white mt-8 mb-4">{line.slice(2)}</h1>;
  if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold text-primary mt-10 mb-3 pb-2 border-b border-gray-200 dark:border-slate-700">{line.slice(3)}</h2>;
  if (line.startsWith('### ')) return <h3 key={i} className="text-base font-bold text-gray-800 dark:text-slate-200 mt-6 mb-2">{line.slice(4)}</h3>;
  if (line.startsWith('**') && line.endsWith('**') && !line.slice(2, -2).includes('**')) {
    return <p key={i} className="font-bold text-gray-900 dark:text-white mt-4 mb-1">{line.slice(2, -2)}</p>;
  }
  if (line.startsWith('---')) return <hr key={i} className="border-gray-200 dark:border-slate-700 my-6" />;
  if (line.startsWith('> ')) return <blockquote key={i} className="border-l-4 border-primary pl-4 italic text-gray-600 dark:text-slate-400 my-3 text-sm">{line.slice(2)}</blockquote>;

  // Table
  if (line.startsWith('|')) {
    if (line.match(/^[\|:\-\s]+$/)) return null;
    const cells = line.split('|').filter((_, ci) => ci > 0 && ci < line.split('|').length - 1);
    const isHeader = false;
    return (
      <tr key={i} className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800/50">
        {cells.map((c, ci) => (
          <td key={ci} className="py-2 px-3 text-sm text-gray-700 dark:text-slate-300 first:font-medium first:text-gray-900 dark:first:text-white">{c.trim()}</td>
        ))}
      </tr>
    );
  }

  // Code block handled separately
  if (line.startsWith('- ') || line.startsWith('* ')) {
    return <li key={i} className="text-gray-700 dark:text-slate-300 text-sm leading-relaxed ml-4">{parseInline(line.slice(2))}</li>;
  }

  if (line === '') return <div key={i} className="h-2" />;

  return <p key={i} className="text-gray-700 dark:text-slate-300 text-sm leading-relaxed">{parseInline(line)}</p>;
}

function parseInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let last = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const m = match[0];
    if (m.startsWith('**')) parts.push(<strong key={match.index} className="font-semibold text-gray-900 dark:text-white">{m.slice(2, -2)}</strong>);
    else parts.push(<code key={match.index} className="bg-gray-100 dark:bg-slate-700 text-primary dark:text-blue-400 px-1.5 py-0.5 rounded text-xs font-mono">{m.slice(1, -1)}</code>);
    last = match.index + m.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.length === 1 ? parts[0] : <>{parts}</>;
}

function BlueprintRenderer({ content }: { content: string }) {
  const lines = content.split('\n');
  const nodes: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      nodes.push(
        <div key={i} className="my-4 rounded-xl overflow-hidden border border-slate-700">
          {lang && <div className="bg-slate-800 px-4 py-1.5 text-xs text-slate-400 font-mono border-b border-slate-700">{lang}</div>}
          <pre className="bg-slate-900 text-slate-200 p-4 text-xs font-mono overflow-x-auto leading-relaxed">{codeLines.join('\n')}</pre>
        </div>
      );
      i++;
      continue;
    }

    // Table group
    if (line.startsWith('|')) {
      const tableRows: React.ReactNode[] = [];
      let firstRow = true;
      while (i < lines.length && lines[i].startsWith('|')) {
        const r = renderLine(lines[i], i);
        if (r !== null) {
          if (firstRow) {
            const cells = lines[i].split('|').filter((_, ci, arr) => ci > 0 && ci < arr.length - 1);
            tableRows.push(
              <tr key={`h${i}`} className="bg-gray-50 dark:bg-slate-800">
                {cells.map((c, ci) => <th key={ci} className="py-2 px-3 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide text-left">{c.trim()}</th>)}
              </tr>
            );
            firstRow = false;
          } else {
            tableRows.push(r);
          }
        }
        i++;
      }
      nodes.push(
        <div key={`table${i}`} className="my-4 overflow-x-auto rounded-xl border border-gray-200 dark:border-slate-700">
          <table className="w-full text-sm">{tableRows}</table>
        </div>
      );
      continue;
    }

    // List group
    if (line.startsWith('- ') || line.startsWith('* ')) {
      const items: React.ReactNode[] = [];
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        items.push(renderLine(lines[i], i));
        i++;
      }
      nodes.push(<ul key={`ul${i}`} className="list-disc list-inside space-y-1 my-3 pl-2">{items}</ul>);
      continue;
    }

    const node = renderLine(line, i);
    if (node !== null) nodes.push(node);
    i++;
  }

  return <>{nodes}</>;
}

export default function BlueprintEjemplo() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">

      {/* Banner */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 text-sm font-medium">
            <span>👀</span>
            <span>Esto es un Blueprint de ejemplo — anonimizado. Tu Blueprint será 100% personalizado para tu proyecto.</span>
          </div>
          <Link
            href="/blueprint"
            className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
          >
            Obtener mi Blueprint →
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-5xl">
        <div className="flex gap-8">

          {/* Sidebar nav */}
          <aside className="hidden lg:block w-52 flex-shrink-0">
            <div className="sticky top-6 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4 shadow-sm">
              <div className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-3">Secciones</div>
              <nav className="space-y-1">
                {SECTIONS.map(s => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="block text-xs text-gray-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary py-1 px-2 rounded hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    {s.label}
                  </a>
                ))}
              </nav>
              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-700">
                <Link
                  href="/blueprint"
                  className="block w-full bg-primary hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-3 rounded-lg text-center transition-colors"
                >
                  Obtener el mío →
                </Link>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">

            {/* Header */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-6 mb-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="inline-flex items-center gap-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold px-3 py-1 rounded-full mb-3">
                    <span>📄</span> Ejemplo anonimizado
                  </div>
                  <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">Blueprint — TaskFlow Pro</h1>
                  <p className="text-sm text-gray-500 dark:text-slate-400">SaaS de gestión de tareas · Next.js + Supabase · Solo dev · 8 semanas</p>
                </div>
                <Link
                  href="/blueprint"
                  className="bg-primary hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all hover:scale-105 shadow whitespace-nowrap"
                >
                  Quiero el mío →
                </Link>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-gray-100 dark:border-slate-700">
                {[
                  { label: 'Secciones', value: '10' },
                  { label: 'Semanas de plan', value: '8' },
                  { label: 'Prompts para IA', value: '4' },
                  { label: 'Escenarios de costo', value: '3' },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <div className="text-xl font-black text-primary">{s.value}</div>
                    <div className="text-xs text-gray-500 dark:text-slate-400">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Blueprint content */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-8">
              <BlueprintRenderer content={EJEMPLO_BLUEPRINT} />
            </div>

            {/* CTA final */}
            <div className="mt-8 bg-gradient-to-br from-slate-900 to-blue-950 rounded-2xl p-8 text-white text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h2 className="text-2xl font-black mb-2">¿Querés uno así para tu proyecto?</h2>
              <p className="text-white/70 mb-6 max-w-md mx-auto text-sm">
                Respondés 30 preguntas sobre tu idea y en minutos tenés un Blueprint completo y 100% personalizado, con chat de IA incluido.
              </p>
              <Link
                href="/blueprint"
                className="inline-block bg-accent hover:bg-green-500 text-white font-bold py-4 px-10 rounded-xl text-lg transition-all hover:scale-105 shadow-xl"
              >
                Obtener mi Blueprint →
              </Link>
              <p className="text-white/40 text-xs mt-3">$30 LATAM · $40 Global · Garantía 7 días</p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
