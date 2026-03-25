# StackAdvisor

**Tu tech stack ideal en 5 minutos — con roadmap, estimación de costos y Blueprint personalizado.**

Plataforma de recomendación de tecnología para founders y devs latinoamericanos. Cuestionario inteligente de 13 preguntas → stack recomendado + plan de 12 semanas + upsell a Blueprint premium con IA.

🌐 **Producción:** [stackadvisor-nu.vercel.app](https://stackadvisor-nu.vercel.app)

---

## Producto

### Flujo gratuito
1. Cuestionario de 13 preguntas (con skip logic para no-técnicos, shortcuts de teclado)
2. Motor de recomendación evalúa 35 stacks → recomienda el óptimo con justificación
3. Resultados: stack, alternativas, roadmap 12 semanas, estimador de costos, prompts de IA
4. Email lead magnet: envía el stack recomendado al correo del usuario (Resend)

### Blueprint premium ($30 LATAM / $40 Global)
1. Cuestionario extendido de 30 preguntas sobre el proyecto
2. Gemini 1.5 Flash genera un Blueprint completo en ~2 minutos
3. Chat contextualizado de IA con 50 mensajes incluidos
4. Persistencia en `localStorage` — permanente en el dispositivo
5. Descarga como `.txt` y sesión 1:1 de 30 min incluida

---

## Tech stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 14 (App Router) |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS |
| IA | Google Gemini 1.5 Flash (`@google/generative-ai`) |
| Pagos | Lemon Squeezy (checkout overlay con `lemon.js`) |
| Email | Resend |
| Analytics | Vercel Analytics |
| Hosting | Vercel |
| Motor de recomendación | `lib/decision_logic.js` (CommonJS, rule-based scoring) |

---

## Estructura del proyecto

```
StackAdvisor/
├── app/
│   ├── page.tsx                        # Landing page con testimonios y CTA
│   ├── questionnaire/page.tsx          # Cuestionario gratuito (13 preguntas)
│   ├── results/page.tsx                # Resultados + email capture
│   ├── stacks/
│   │   ├── page.tsx                    # Grid de los 35 stacks con filtros
│   │   └── [id]/page.tsx              # Página de detalle por stack (SSG)
│   ├── compare/page.tsx                # Comparador de hasta 4 stacks
│   ├── blueprint/
│   │   ├── page.tsx                    # Landing de venta del Blueprint
│   │   ├── ejemplo/page.tsx            # Ejemplo anonimizado (muestra el producto)
│   │   ├── extended/page.tsx           # Cuestionario extendido de 30 preguntas
│   │   ├── result/page.tsx             # Blueprint generado + chat de IA
│   │   └── success/page.tsx            # Post-pago (redirige a extended)
│   ├── api/
│   │   ├── recommend/route.ts          # Motor de recomendación
│   │   ├── email/route.ts              # Lead magnet por email (Resend)
│   │   ├── geo/route.ts                # Geo-detección + URLs de checkout
│   │   ├── blueprint/
│   │   │   ├── generate/route.ts       # Generación del Blueprint con Gemini
│   │   │   └── chat/route.ts           # Chat contextualizado post-Blueprint
│   └── layout.tsx                      # Root layout con Analytics y lemon.js
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── QuestionCard.tsx                # Tarjeta de pregunta con shortcuts
│   ├── ProgressBar.tsx
│   ├── StacksGrid.tsx                  # Grid filtrable de stacks
│   ├── PromptGenerator.tsx             # Generador de prompts por tipo + upsell
│   ├── CostEstimator.tsx               # Estimador interactivo de costos
│   ├── Roadmap.tsx                     # Visualización del roadmap 12 semanas
│   ├── AffiliateCards.tsx              # Cards de afiliados por stack
│   └── ThemeProvider.tsx              # Dark/light mode
├── lib/
│   ├── stacks.json                     # 35 stacks definidos
│   ├── questionnaire.json              # Preguntas del cuestionario libre
│   ├── decision_logic.js               # Motor de scoring (CommonJS)
│   └── affiliates.ts                   # Links de afiliados por stack
└── docs/
    ├── estrategia-crecimiento.md       # Roadmap de negocio y distribución
    └── prompt-maestro-claude.md        # Prompt para trabajo de marketing con Claude
```

---

## Variables de entorno

Crear `.env.local` con:

```env
# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Lemon Squeezy (pagos)
LEMONSQUEEZY_API_KEY=your_lemonsqueezy_api_key
LEMONSQUEEZY_VARIANT_GLOBAL=your_global_variant_uuid
LEMONSQUEEZY_VARIANT_LATAM=your_latam_variant_uuid
LEMONSQUEEZY_URL_GLOBAL=https://your-store.lemonsqueezy.com/checkout/buy/your_global_variant_uuid
LEMONSQUEEZY_URL_LATAM=https://your-store.lemonsqueezy.com/checkout/buy/your_latam_variant_uuid

# Email (Resend)
RESEND_API_KEY=your_resend_api_key

# App
NEXT_PUBLIC_APP_URL=https://your-production-url.vercel.app
```

---

## Instalación local

```bash
git clone https://github.com/santiagomalak/stackadvisor-.git
cd StackAdvisor
npm install
cp .env.local.example .env.local   # completar con tus keys
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

---

## Detalles técnicos clave

### Geo-detección y precios
`/api/geo` lee el header `x-vercel-ip-country` (solo disponible en Vercel) para detectar si el usuario es de LATAM. Devuelve las URLs de checkout de Lemon Squeezy cacheadas por 1 hora.

LATAM: AR, BR, MX, CO, CL, PE, VE, EC, BO, PY, UY, CR, PA, GT, HN, SV, NI, DO, CU, PR

### Blueprint con Gemini
El prompt de generación ancla los costos al presupuesto declarado por el usuario (`infra_budget`), adapta las recomendaciones al tamaño del equipo, y genera 10 secciones en markdown. El resultado se guarda en `localStorage` con clave `sa_blueprint_v1`.

### Checkout Lemon Squeezy
Se usa la clase CSS `lemonsqueezy-button` en el `<a>` + lemon.js cargado con `strategy="afterInteractive"` para abrir el overlay de pago sin abandonar la página.

### Motor de recomendación
`lib/decision_logic.js` evalúa los 35 stacks con un sistema de scoring basado en reglas. Cada respuesta del cuestionario suma o resta puntos según criterios (proyecto, experiencia, presupuesto, features requeridas). Devuelve el top 3.

---

## Modelo de negocio

| Fuente | Detalle |
|--------|---------|
| Blueprint Premium | $30 USD (LATAM) / $40 USD (Global) — pago único |
| Afiliados | Vercel, Railway, DigitalOcean, Platzi — links contextuales |
| Sesión 1:1 | Incluida en Blueprint (a futuro: upsell separado) |

---

## Estado del proyecto (marzo 2026)

- ✅ MVP en producción con flujo completo gratuito y premium
- ✅ Pagos operativos con Lemon Squeezy (LATAM / Global)
- ✅ Blueprint generado con IA + chat contextualizado
- ✅ Email lead magnet con Resend
- ✅ Analytics activo (Vercel Analytics)
- ✅ Ejemplo de Blueprint público en `/blueprint/ejemplo`
- ✅ Testimonios y prueba social en landing y blueprint
- ⏳ Dominio propio (`stackadvisor.dev`) — pendiente
- ⏳ Blog con SEO — pendiente
- ⏳ Webhook de Lemon Squeezy para validar pagos — pendiente
- ⏳ Email sequence automático post-cuestionario — pendiente

Ver roadmap completo en `docs/estrategia-crecimiento.md`

---

## Deployment

El proyecto se deploya automáticamente en Vercel al hacer push a `main`.

Para deploy manual:
```bash
vercel --prod
```

Agregar las variables de entorno en Vercel Dashboard → Settings → Environment Variables.

---

Hecho por **Santiago Aragón** · [WhatsApp](https://wa.me/5493834553249)
