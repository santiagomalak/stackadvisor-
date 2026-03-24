# PROMPT MAESTRO — StackAdvisor
## Para usar en Claude.ai (chat normal) — Marketing, SEO y Visibilidad Orgánica

---

## CONTEXTO COMPLETO DEL PROYECTO

Soy el fundador de **StackAdvisor** (stackadvisor-nu.vercel.app), una herramienta web que ayuda a developers independientes y founders no-técnicos a elegir el tech stack correcto para su proyecto y obtener un plan de desarrollo detallado.

---

## QUÉ ES EL PRODUCTO

### Producto gratuito — Recomendador de stacks
- El usuario responde 13 preguntas sobre su proyecto (tipo de app, equipo, presupuesto, etc.)
- Recibe una recomendación personalizada entre 35+ stacks evaluados
- Incluye: roadmap de 12 semanas, estimador de costos, 4 prompts básicos de IA, comparativa entre stacks
- Es completamente gratis, sin registro

### Producto pago — Blueprint de desarrollo ($30 LATAM / $40 Global)
- Pago único via Lemon Squeezy
- El usuario responde un cuestionario extendido de 30 preguntas sobre su proyecto
- Recibe un Blueprint generado por IA (Gemini) con 10 secciones:
  1. Resumen ejecutivo del proyecto
  2. Stack tecnológico recomendado con justificaciones
  3. Arquitectura del sistema
  4. Estructura de carpetas lista para copiar
  5. Esquema de base de datos
  6. Plan de desarrollo semana a semana
  7. 30+ prompts listos para Cursor/Claude por cada feature
  8. Estimación de costos real (MVP → escala)
  9. Top 5 riesgos con estrategias de mitigación
  10. Primeros 3 pasos para HOY
- Incluye 50 mensajes de chat con una IA que conoce todo el proyecto
- Incluye una sesión 1:1 de 30 minutos con Santiago (el fundador)
- El Blueprint se guarda en localStorage (permanente en el dispositivo)
- Se puede descargar como .txt o exportar a PDF

---

## TECH STACK DEL PROYECTO
- **Frontend:** Next.js 14 App Router + TypeScript + Tailwind CSS
- **IA:** Google Gemini 1.5 Flash (generación de Blueprint y chat)
- **Pagos:** Lemon Squeezy (no Stripe)
- **Deploy:** Vercel
- **Geo-detección:** Header x-vercel-ip-country para precios LATAM/Global
- **Sin base de datos** por ahora — todo en localStorage/sessionStorage

---

## ESTADO ACTUAL DEL PRODUCTO (Marzo 2026)

### ✅ Live y funcionando
- Recomendador gratuito con 35+ stacks
- Blueprint premium con generación por IA
- Precios diferenciados LATAM/Global con detección automática
- Chat de IA contextualizado (50 mensajes)
- Sesión 1:1 via WhatsApp
- Blueprint guardado en dispositivo + descarga .txt
- Affiliates activos: Railway, DigitalOcean, Platzi, Vercel, Supabase, Netlify, Fly.io, Firebase, MongoDB Atlas

### ❌ Lo que todavía NO tiene
- Testimonios / prueba social
- Analytics (no hay GA ni similar)
- Email capture / lista de emails
- Blog / contenido SEO
- Accounts / login de usuarios
- Número de ventas conocido (primeras semanas de operación)
- Video o demo del producto

---

## AUDIENCIA OBJETIVO

### Perfil primario
- **Developers indie** (0-5 años de experiencia) que quieren arrancar un proyecto propio
- **Founders no-técnicos** que necesitan entender qué pedirle a un dev
- **Freelancers** que necesitan recomendar stacks a sus clientes
- Edad: 22-35 años
- Región: Argentina, México, Colombia, Chile (LATAM) + Global

### Pain points reales
1. "No sé qué stack elegir y tengo miedo de elegir mal y tener que rehacer todo"
2. "Empiezo proyectos y me trabo en las decisiones técnicas antes de escribir código"
3. "Pierdo semanas investigando opciones sin llegar a una conclusión"
4. "No sé si mi idea técnicamente es viable o cuánto me va a costar"

### Canales donde está esta audiencia
- Twitter/X (comunidad dev hispanohablante muy activa)
- Reddit: r/webdev, r/learnprogramming, r/argentina
- YouTube: tutoriales de Next.js, Supabase, shadcn, desarrollo indie
- LinkedIn (founders/PMs no técnicos)
- Discord: servidores de programación LATAM, midudev, Platzi
- TikTok/Instagram Reels (contenido de código y herramientas dev)
- Dev.to / Hashnode (blogging técnico)
- ProductHunt (lanzamientos de productos)

---

## MODELO DE NEGOCIO

- **Ticket promedio:** $35 USD (pago único)
- **Margen bruto:** ~98% (costo variable casi nulo — Gemini es muy barato)
- **Costo por Blueprint generado:** ~$0.02-0.05 USD
- **Costo de la sesión 1:1:** 30 minutos del tiempo del fundador
- **Affiliates:** comisiones por referir herramientas (Railway, DigitalOcean, etc.)
- **Sin recurrencia hoy** — próximo paso es agregar productos adicionales

### Proyección conservadora
- 10 ventas/mes = $350 MRR con cero publicidad
- 50 ventas/mes = $1.750 MRR (alcanzable con contenido orgánico consistente)

---

## NORTE ESTRATÉGICO

**StackAdvisor tiene que ser la primera cosa que hace un dev indie cuando tiene una idea.**

Eso se logra con tres palancas:
1. **Referencia de contenido** — ser la fuente más útil de internet para "qué stack elegir para X"
2. **Mejor producto** — el Blueprint tiene que ser tan bueno que los compradores lo recomienden
3. **Comunidad** — construir una red alrededor del proceso de decisión técnica

El moat no es la tecnología (cualquiera puede hacer esto con IA). El moat es la **confianza, el nombre y la red** que se construye con cada comprador satisfecho.

---

## ROADMAP DE PRODUCTO (referencia)

### Nivel 1 — Próximas 2 semanas (ya en curso)
- Testimonios reales de compradores
- Ejemplo de Blueprint anonimizado en la landing
- Contador "X blueprints generados"
- FAQ ampliada
- SEO básico (meta tags)

### Nivel 2 — Próximo mes
- Email del Blueprint al terminar (lista propia)
- Blueprint Lite a $15 (punto de entrada)
- Página "Cómo funciona" con demo visual
- Sistema de referidos

### Nivel 3 — Próximos 3 meses
- Accounts / login
- Blueprint para equipos ($80)
- Update de Blueprint (segunda venta)
- Paquetes de sesiones adicionales

### Nivel 4 — 6 meses en adelante
- Blog técnico con SEO
- Comunidad privada (Discord)
- API pública del recomendador
- Upgrade a Claude/GPT-4o para mejor calidad

---

## LO QUE NECESITO DE VOS (Claude)

Quiero tu ayuda específicamente con **marketing y visibilidad orgánica**. La infraestructura técnica del producto la manejo en otro contexto. Acá me enfoco en:

### 1. Estrategia de contenido SEO
- ¿Qué artículos escribir primero? Dame un calendario de 3 meses con títulos, keywords target y estructura de cada artículo
- ¿Cómo estructurar el blog dentro de Next.js para SEO?
- ¿Qué páginas de landing específicas crear? (ej: "mejor stack para SaaS", "stack para app móvil")
- Estrategia de link building para un proyecto nuevo sin autoridad de dominio

### 2. Estrategia de redes sociales
- Plan de contenido para Twitter/X con enfoque en la comunidad dev hispanohablante
- Tipos de posts que funcionan para herramientas dev (threads técnicos, comparativas, behind-the-scenes)
- Cómo usar los datos del recomendador como contenido ("el 60% de los devs que usan Next.js eligen Supabase como DB")
- Estrategia para LinkedIn orientada a founders no-técnicos

### 3. ProductHunt y comunidades
- Cuándo y cómo lanzar en ProductHunt para maximizar upvotes
- Cómo presentar el producto en subreddits sin que parezca spam
- Cómo entrar a comunidades de Discord/Slack de manera orgánica

### 4. Email marketing
- Cómo construir la lista desde cero (el producto no tiene email capture hoy)
- Qué ofrecer a cambio del email (lead magnet)
- Secuencia de bienvenida para nuevos suscriptores
- Newsletters que conviertan a compradores de Blueprint

### 5. Casos de uso y prueba social
- Cómo conseguir los primeros testimonios
- Cómo crear un caso de estudio con un comprador real
- Cómo usar el Blueprint de ejemplo anonimizado como herramienta de conversión

---

## RESTRICCIONES Y CONTEXTO

- **Fundador solo** — sin equipo, sin presupuesto publicitario
- **Base: Argentina** — comunidad LATAM es el mercado primario, pero el producto es global
- **Sin historial de dominio** — dominio nuevo, sin autoridad SEO todavía
- **Idioma:** contenido principalmente en español para LATAM, inglés para mercado global eventualmente
- **Tiempo disponible:** dedicación part-time al principio (el fundador tiene otras cosas)
- **Sin presupuesto para ads** — todo orgánico

---

## PREGUNTA INICIAL PARA EMPEZAR

Con todo este contexto, quiero que me ayudes a construir la **estrategia de visibilidad orgánica** de StackAdvisor desde cero.

Empecemos por lo más impactante: **¿qué debería hacer primero esta semana para que StackAdvisor empiece a aparecer frente a su audiencia objetivo, con cero presupuesto publicitario?**

Quiero que seas específico: no "escribí contenido de valor", sino exactamente QUÉ publicar, DÓNDE, CON QUÉ copy, y EN QUÉ orden de prioridad.