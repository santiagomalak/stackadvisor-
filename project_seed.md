# StackAdvisor - Project Seed & Context

**Proyecto:** StackAdvisor  
**Creator:** Santiago  
**Status:** Pre-MVP Design Phase  
**Last Updated:** Jan 2, 2026

---

## EXECUTIVE SUMMARY

StackAdvisor es una plataforma que ayuda a developers y founders a transformar ideas vagas en planes claros. 

**Problem:** Cuando alguien tiene una idea de producto, no sabe por dónde empezar ni qué tecnologías elegir. Gasta 20+ horas investigando, termina paralizado, y muchas ideas nunca se lanzan.

**Solution:** En 5 minutos, el usuario responde un cuestionario inteligente y recibe:
1. Recomendación de stack específica (Frontend, Backend, DB, Hosting)
2. Justificación clara (por qué esas techs para SU proyecto)
3. Roadmap de 12 semanas (paso a paso)
4. Documentación de inicio

**Market Size:** 38M+ developers/founders que enfrentan decisiones de stack  
**TAM:** $500M+ oportunidad SaaS  
**Pricing:** Freemium (Free / $9/mo / $29/mo)

---

## BRAND IDENTITY

**Name:** StackAdvisor  
**Tagline:** "Transform Ideas into Reality"  
**Primary Color:** #3498DB (Trust Blue)  
**Accent Color:** #2ECC71 (Success Green)  
**Font:** Arial / Inter

---

## CUESTIONARIO - DISEÑO FINAL

### 13 PREGUNTAS ESTRATÉGICAS

#### SECCIÓN 1: Entender el Proyecto

**Q1: ¿Qué tipo de proyecto quieres construir?**
- a) Blog / Sitio de contenido estático
- b) E-commerce / Tienda online
- c) SaaS / Aplicación web con usuarios
- d) App móvil (iOS/Android)
- e) Dashboard / Herramienta interna
- f) API / Backend para terceros
- g) Red social / Comunidad
- h) Juego / Entretenimiento

**Q2: ¿Cuál es tu timeline realista para MVP?**
- a) URGENTE (1-2 meses)
- b) Normal (2-3 meses)
- c) Flexible (4+ meses)
- d) No tengo prisa (6+ meses)

**Q3: ¿Cuántas personas van a trabajar en esto?**
- a) Solo yo (1 person)
- b) Equipo pequeño (2-3 personas)
- c) Equipo mediano (4-10 personas)
- d) Equipo grande (10+ personas)

**Q4: ¿Cuál es tu experiencia con desarrollo?**
- a) Soy no-técnico (no programo)
- b) Junior (< 2 años)
- c) Mid-level (2-5 años)
- d) Senior (5+ años)
- e) Muy variada (múltiples stacks)

#### SECCIÓN 2: Requisitos del Proyecto

**Q5: ¿Cuál es la prioridad #1 del proyecto?**
- a) Lanzar RÁPIDO (speed to market)
- b) Escalabilidad (crecer 10x sin problemas)
- c) Confiabilidad (zero downtime)
- d) Costo mínimo (bootstrapping)
- e) Facilidad de mantenimiento (long-term)

**Q6: ¿Qué tan crítica es la VELOCIDAD/PERFORMANCE?**
- a) No importa (chat app, puede ser lento)
- b) Normal (e-commerce, debe ser rápido)
- c) Muy crítica (fintech, search engine)
- d) Ultra crítica (real-time, latency <100ms)

**Q7: ¿Cuáles son tus RESTRICCIONES de seguridad?**
- a) Normal (típico SaaS)
- b) Moderada (datos de usuarios sensibles)
- c) Alta (fintech, healthtech)
- d) Crítica (gobierno, banca)

**Q8: ¿Necesitas datos en tiempo real?**
- a) No, consultas normales está bien
- b) Semi-real-time (actualización cada minuto)
- c) Real-time (websockets, live updates)
- d) Streaming de datos continuos

**Q9: ¿Cuál es tu PRESUPUESTO de hosting/infra al mes?**
- a) Casi nada ($0-10/mes, bootstrapping)
- b) Bajo ($10-50/mes)
- c) Medio ($50-200/mes)
- d) No hay límite (enterprise)

#### SECCIÓN 3: Preferencias Técnicas

**Q10: ¿Qué ecosistema prefieres?**
- a) JavaScript/TypeScript (todo JS)
- b) Python (data, ML, backend robusto)
- c) No tengo preferencia (open to anything)
- d) Necesito especialización (Go, Rust, etc.)

**Q11: ¿Frontend y Backend en el mismo proyecto o separado?**
- a) Monolito (todo en uno, más simple)
- b) Separado (frontend + API separadas, más flexible)
- c) No importa (elige lo mejor)

**Q12: ¿Necesitas soporte para múltiples plataformas?**
- a) Solo web
- b) Web + mobile (iOS/Android)
- c) Web + mobile + desktop
- d) Todas las plataformas

#### SECCIÓN 4: Validación Final

**Q13: ¿Hay algo especial que no cubrimos?**
- [Texto abierto, opcional]

---

## STACKS RECOMENDADOS (20-30 posibles)

### Tier 1: Popular & Recommended
1. **Next.js + PostgreSQL + Vercel** (Best for: Speed, e-commerce, SaaS beginners)
2. **React + Node.js + PostgreSQL + Railway** (Classic full-stack)
3. **React + FastAPI + PostgreSQL** (Python backend, data-heavy)
4. **Django + React + PostgreSQL** (Monolith Python option)
5. **Vue.js + Node.js + PostgreSQL** (Alternative to React)
6. **Flutter + Firebase** (Mobile MVP fast)
7. **React Native + Firebase** (Cross-platform mobile)
8. **Svelte + Node.js + MongoDB** (Lightweight, real-time friendly)

### Tier 2: Specialized
9. **Go + React + PostgreSQL** (Performance-critical)
10. **Rust + React + PostgreSQL** (Ultra-high performance)
11. **Bubble / FlutterFlow** (Non-technical founders)
12. **Remix + PostgreSQL** (Server-side focused)
13. **Astro + Node.js + PostgreSQL** (Content-heavy)
14. **SvelteKit + PostgreSQL** (Full-stack Svelte)
15. **NestJS + React + PostgreSQL** (Enterprise Node.js)

### Tier 3: Enterprise
16. **Spring Boot + React + PostgreSQL** (Java enterprise)
17. **ASP.NET + React + SQL Server** (Microsoft stack)
18. **PHP (Laravel) + PostgreSQL** (Traditional but solid)

### Tier 4: Specialized Needs
19. **Shopify** (For e-commerce only)
20. **Supabase (Postgres + Auth)** (Minimal backend)
21. **Headless CMS + Next.js** (Content-heavy apps)
22. **GraphQL API + Apollo + React** (API-first design)
23. **Serverless (AWS Lambda + React)** (Event-driven, no ops)
24. **Blockchain (Solidity + React)** (Web3 projects)
25. **Elixir + Phoenix + PostgreSQL** (Real-time, fault-tolerant)

---

## DECISION LOGIC RULES (Summary)

### Core Rules

```
IF project_type == "Blog" OR "Content"
  AND experience == "Non-technical"
  THEN → Astro + Vercel (or WordPress)

IF project_type == "E-commerce"
  AND timeline == "URGENT"
  AND budget == "Bootstrapping"
  THEN → Next.js + Stripe + Vercel ($0-50/mo)

IF project_type == "SaaS"
  AND scale == "Scaling"
  AND experience == "Senior"
  THEN → React + FastAPI + PostgreSQL (Data flexibility)

IF project_type == "Mobile"
  THEN → Flutter (cross-platform) OR React Native

IF project_type == "Real-time"
  AND realtime == "True"
  THEN → Svelte + WebSockets OR Firebase Realtime

IF budget == "Enterprise"
  AND security == "Critical"
  THEN → Spring Boot / ASP.NET + PostgreSQL (Enterprise grade)

IF experience == "Non-technical"
  THEN → Bubble OR FlutterFlow (no-code)

IF timeline == "URGENT" AND experience == "Junior"
  THEN → Next.js (best tutorials, community)

IF performance == "Ultra-critical"
  THEN → Go OR Rust backend

IF cost == "$0-10/month"
  THEN → Vercel Free + Supabase Free (optimized for free tier)
```

---

## BUYER PERSONAS

### Persona 1: Martín - Startup Founder (Age 32)
- **Background:** Non-technical (sales/operations)
- **Pain:** Has idea, hired freelancer, doesn't trust tech decisions
- **WTP:** $29/month
- **Solution need:** Credibility to negotiate with developers

### Persona 2: Luna - Junior Developer (Age 21)
- **Background:** Self-taught, worked at 2 companies
- **Pain:** Paralyzed by choices, 10 hrs research = 0 progress
- **WTP:** $0-9/month
- **Solution need:** Confidence + clear roadmap

### Persona 3: Carlos - Solopreneur / Indie Hacker (Age 28)
- **Background:** Marketer, non-technical, multiple SaaS ideas
- **Pain:** Considering hiring dev ($3-5K), doesn't want to be scammed
- **WTP:** $9-19/month
- **Solution need:** Education + cost estimates

---

## MVP SPECIFICATION

### Phase 1: Months 0-3

**Must Have:**
- ✅ Interactive questionnaire (13 questions)
- ✅ Stack recommendation engine (deterministic logic)
- ✅ 12-week detailed roadmap generation
- ✅ User feedback system (thumbs up/down)
- ✅ Save results (email optional)

**Nice to Have:**
- PDF download of recommendation
- Cost estimate display

**NOT in MVP:**
- ❌ AI explanations (Claude/GPT integration)
- ❌ GitHub data analysis
- ❌ Deploy assistant
- ❌ Community/marketplace
- ❌ Paid subscription

---

## TECH STACK (StackAdvisor itself)

- **Frontend:** Next.js 14 + React + TypeScript + TailwindCSS
- **Backend:** Node.js + Express (or Next.js API routes)
- **Database:** PostgreSQL (Supabase)
- **Hosting Frontend:** Vercel
- **Hosting Backend:** Railway / Render
- **Auth:** Supabase Auth / NextAuth.js
- **Analytics:** Vercel Analytics

**MVP Cost:** $25-50/month

---

## ROADMAP

### Phase 1: MVP (Months 0-3)
- Interactive questionnaire
- Stack recommendation engine
- Roadmap generation
- User feedback

### Phase 2: Data-Driven (Months 3-6)
- GitHub data integration
- Trends dashboard
- First paid tier ($9/mo)
- User authentication

### Phase 3: AI & Automation (Months 6-9)
- Claude/ChatGPT integration
- Deploy assistant
- Cost estimator
- Premium tier ($29/mo)

### Phase 4: Community & Ecosystem (Months 9-12)
- Community forum
- Success stories
- Freelancer marketplace
- Video tutorials

### Phase 5: Advanced (Year 2+)
- Project tracking
- AI mentor
- Benchmarking
- Enterprise tier

---

## SUCCESS METRICS (MVP - Month 3)

✅ 200-500 users complete questionnaire  
✅ 70%+ completion rate  
✅ NPS > 0  
✅ Thumbs up ratio > 60%  
✅ 3-5 users say "this saved me"  
✅ 0 critical bugs

---

## NEXT STEPS

### Immediate (This Week)
1. ✅ Create questionnaire.json (13 questions)
2. ✅ Create stacks.json (20-30 stacks definition)
3. ✅ Create decision_logic.js (rules engine)
4. ✅ Create test_cases.js (10 user scenarios)

### Then (Week 2-3)
1. Set up Next.js project
2. Create questionnaire UI components
3. Integrate decision engine
4. Build result page with roadmap

### Testing
1. Internal testing with real users (Martín, Luna, Carlos personas)
2. Iterate on recommendations based on feedback
3. Validate that recommendations are actually good

---

## IMPORTANT NOTES FOR CLAUDE CODE

**For Santiago:**
- You're 23, Data Scientist at Ivolution
- You value deep understanding, not surface-level implementation
- You think long-term (Year 1+ vision, not quick wins)
- You're building this during vacation, all-in mode
- Goal: Make this the MVP that validates the market, then scale

**For the codebase:**
- Keep it clean and modular
- Think about scalability from day 1
- Test with real scenarios
- Document decisions
- Iterate based on feedback

---

## HOW TO USE THIS SEED

When starting Claude Code:
```bash
# Open Claude Code in your project directory
claude

# Then say:
"I have a PROJECT_SEED.md file that describes StackAdvisor. 
Read it, understand the context, and help me:

1. Create questionnaire.json with all 13 questions properly structured
2. Create stacks.json with 20-30 recommended stacks
3. Create decision_logic.js - the rules engine that maps answers to stacks
4. Create test_cases.js - 10 different user scenarios to validate logic

Use this as your north star: clear, modular, production-ready code."
```

---

## CURRENT PHILOSOPHY

**"From ideas to reality, one developer at a time."**

We're not building another generic recommendation engine. We're solving a REAL problem that people WILL pay for. Focus on:
- Quality of recommendations (rules over AI guessing)
- Clear reasoning (users understand WHY)
- Actionable output (roadmap they can follow)
- Small scope, deep execution (MVP > Feature creep)

---

**Status:** Ready for Claude Code execution ✅
