/**
 * StackAdvisor Decision Logic Engine
 */

const stacksData = require('./stacks.json');

// ---------- helpers ----------

function parseCost(estimatedCost) {
  if (!estimatedCost) return 999;
  const match = estimatedCost.match(/\d+/);
  return match ? parseInt(match[0]) : 999;
}

function parseSetupHours(setupTime) {
  if (!setupTime) return 999;
  const numbers = setupTime.match(/\d+/g);
  if (!numbers) return 999;
  return Math.max(...numbers.map(Number));
}

function hasTags(stack, ...tags) {
  const stackTags = stack.tags || [];
  return tags.some(t => stackTags.includes(t));
}

// ---------- main engine ----------

function getRecommendation(answers) {
  const stacks = stacksData.stacks;
  const scoredStacks = [];

  for (const stack of stacks) {
    const result = scoreStack(stack, answers);
    if (result.score > 0) {
      scoredStacks.push({
        stack,
        score: result.score,
        matchReasons: result.matchReasons,
        warnings: result.warnings
      });
    }
  }

  scoredStacks.sort((a, b) => b.score - a.score);
  const topRecommendations = scoredStacks.slice(0, 3);

  return {
    primary: topRecommendations[0] || null,
    alternatives: topRecommendations.slice(1, 3),
    totalEvaluated: stacks.length,
    userProfile: generateUserProfile(answers)
  };
}

function scoreStack(stack, answers) {
  let score = 50;
  const matchReasons = [];
  const warnings = [];

  const projectType = answers.q1;
  const timeline    = answers.q2;
  const teamSize    = answers.q3;
  const experience  = answers.q4;
  const priority    = answers.q5;
  const performance = answers.q6;
  const security    = answers.q7;
  const realtime    = answers.q8;
  const budget      = answers.q9;
  const ecosystem   = answers.q10;
  const architecture = answers.q11;
  const platforms   = answers.q12;
  const special     = answers.q13 || '';

  // ============================================
  // RULE 1: PROJECT TYPE MATCHING
  // ============================================

  if (projectType === 'blog') {
    if (['astro_node_postgres', 'headless_cms_nextjs', 'payload_nextjs'].includes(stack.id)) {
      score += 30;
      matchReasons.push('Optimizado para sitios de contenido y blogs');
    } else if (['nextjs_postgres_vercel', 'rails_postgres', 'wordpress_woocommerce', 'nuxt_supabase'].includes(stack.id)) {
      score += 20;
      matchReasons.push('Excelente para SEO y contenido estático/dinámico');
    }
    if (stack.id === 'wordpress_woocommerce') {
      score += 15; // extra boost for blogs — WP is king here
      matchReasons.push('WordPress es el rey del contenido — 43% de todos los blogs usan WP');
    }
  }

  if (projectType === 'ecommerce') {
    if (stack.id === 'shopify') {
      score += 40;
      matchReasons.push('Plataforma especializada en e-commerce llave en mano');
    } else if (stack.id === 'wordpress_woocommerce') {
      score += 35;
      matchReasons.push('WooCommerce es la plataforma e-commerce más usada del mundo');
    } else if (['nextjs_postgres_vercel', 't3_stack', 'remix_postgres'].includes(stack.id)) {
      score += 30;
      matchReasons.push('Excelente para e-commerce custom con Stripe');
    } else if (['rails_postgres', 'laravel_vue_inertia'].includes(stack.id)) {
      score += 25;
      matchReasons.push('Ecosistema maduro con plugins de e-commerce de primer nivel');
    }
  }

  if (projectType === 'saas') {
    if (['nextjs_postgres_vercel', 'react_node_postgres_railway', 'react_fastapi_postgres',
         't3_stack', 'rails_postgres', 'laravel_vue_inertia', 'nuxt_supabase', 'remix_postgres'].includes(stack.id)) {
      score += 25;
      matchReasons.push('Stack probado para SaaS escalables');
    }
    if (stack.id === 'convex_react') {
      score += 20;
      matchReasons.push('Backend reactivo ideal para SaaS moderno');
    }
    if (stack.id === 'pocketbase_react') {
      score += 15;
      matchReasons.push('Ideal para SaaS MVP con backend zero-config');
    }
  }

  if (projectType === 'mobile') {
    if (stack.id === 'flutter_firebase' || stack.id === 'react_native_firebase') {
      score += 40;
      matchReasons.push('Framework móvil cross-platform ideal');
    } else if (!hasTags(stack, 'mobile', 'cross-platform')) {
      score -= 30;
    }
  }

  if (projectType === 'dashboard') {
    if (['react_node_postgres_railway', 'django_react_postgres', 'nextjs_postgres_vercel',
         't3_stack', 'rails_postgres', 'laravel_vue_inertia', 'angular_node_postgres'].includes(stack.id)) {
      score += 20;
      matchReasons.push('Ideal para dashboards y herramientas internas');
    }
    if (stack.id === 'angular_node_postgres') {
      score += 10; // Angular shines for dashboards
      matchReasons.push('Angular Material es perfecto para dashboards enterprise');
    }
  }

  if (projectType === 'api') {
    if (['react_fastapi_postgres', 'go_react_postgres', 'graphql_apollo_react',
         'rails_postgres', 'laravel_vue_inertia', 'angular_node_postgres'].includes(stack.id)) {
      score += 30;
      matchReasons.push('Backend robusto para APIs');
    }
    if (stack.id === 't3_stack') {
      score += 20;
      matchReasons.push('tRPC ofrece APIs type-safe sin boilerplate');
    }
  }

  if (projectType === 'social') {
    if (realtime === 'realtime' && ['svelte_node_mongo', 'elixir_phoenix_postgres', 'convex_react'].includes(stack.id)) {
      score += 35;
      matchReasons.push('Excelente para features sociales en tiempo real');
    } else if (stack.id === 'convex_react') {
      score += 30;
      matchReasons.push('Convex maneja sincronización en tiempo real nativamente');
    } else if (['react_node_postgres_railway', 'nextjs_postgres_vercel'].includes(stack.id)) {
      score += 20;
      matchReasons.push('Sólido para aplicaciones sociales');
    }
  }

  if (projectType === 'game') {
    if (['svelte_node_mongo', 'react_node_postgres_railway'].includes(stack.id)) {
      score += 25;
      matchReasons.push('Buen stack para juegos web interactivos');
    } else if (stack.id === 'nextjs_postgres_vercel') {
      score += 15;
      matchReasons.push('Funciona para juegos web simples con Next.js');
    }
  }

  // ============================================
  // RULE 2: EXPERIENCE LEVEL
  // ============================================

  if (experience === 'non_technical') {
    if (['nocode_bubble_flutterflow', 'shopify', 'wordpress_woocommerce'].includes(stack.id)) {
      score += 50;
      matchReasons.push('No requiere programación — perfecto para no-técnicos');
    } else {
      score -= 40;
      warnings.push('Este stack requiere conocimientos de programación');
    }
  }

  if (experience === 'junior') {
    if (stack.learningCurve === 'low' || stack.learningCurve === 'low-medium') {
      score += 15;
      matchReasons.push('Curva de aprendizaje suave para developers juniors');
    } else if (stack.learningCurve === 'very high') {
      score -= 20;
      warnings.push('Curva de aprendizaje steep - puede ser frustrante');
    }
    if (stack.community === 'excellent') {
      score += 10;
      matchReasons.push('Comunidad grande con muchos recursos para aprender');
    }
  }

  if (experience === 'mid') {
    // Mid-level: puede con stacks moderados, evita los extremos
    if (stack.learningCurve === 'low' || stack.learningCurve === 'medium' || stack.learningCurve === 'low-medium') {
      score += 10;
      matchReasons.push('Stack accesible para tu nivel de experiencia');
    } else if (stack.learningCurve === 'very high') {
      score -= 10;
      warnings.push('Este stack puede ser desafiante — considera un camino gradual');
    }
    if (stack.community === 'excellent') {
      score += 5;
    }
  }

  if (experience === 'senior' || experience === 'varied') {
    if (stack.learningCurve === 'very high') {
      score += 5;
    }
  }

  // ============================================
  // RULE 3: TIMELINE / SPEED TO MARKET
  // ============================================

  if (timeline === 'urgent') {
    const setupHours = parseSetupHours(stack.setupTime);
    if (setupHours <= 4) {
      score += 25;
      matchReasons.push('Setup ultra-rápido para lanzar en semanas');
    } else if (setupHours >= 15) {
      score -= 25;
      warnings.push('Setup complejo puede retrasar tu timeline');
    }
    if (hasTags(stack, 'fast', 'managed')) {
      score += 15;
      matchReasons.push('Plataforma managed reduce tiempo de desarrollo');
    }
  }

  if (timeline === 'no_rush') {
    if (stack.tier === 2 || stack.tier === 4) {
      score += 10;
      matchReasons.push('Tienes tiempo para explorar opciones más especializadas');
    }
  }

  // ============================================
  // RULE 4: PRIORITY
  // ============================================

  if (priority === 'speed') {
    if (['nextjs_postgres_vercel', 'supabase_nextjs', 'flutter_firebase',
         't3_stack', 'rails_postgres', 'convex_react', 'laravel_vue_inertia',
         'pocketbase_react', 'nuxt_supabase'].includes(stack.id)) {
      score += 20;
      matchReasons.push('Optimizado para lanzar rápido al mercado');
    }
  }

  if (priority === 'scalability') {
    if (stack.scalability === 'very high') {
      score += 25;
      matchReasons.push('Escalabilidad probada para crecer 10x+');
    } else if (stack.scalability === 'low-medium') {
      score -= 20;
      warnings.push('Escalabilidad limitada puede ser un problema');
    }
  }

  if (priority === 'cost') {
    const costValue = parseCost(stack.estimatedCost);
    if (costValue <= 25) {
      score += 20;
      matchReasons.push('Costos bajos ideales para bootstrapping');
    }
  }

  if (priority === 'reliability') {
    if (['spring_react_postgres', 'aspnet_react_sqlserver', 'go_react_postgres',
         'angular_node_postgres'].includes(stack.id)) {
      score += 25;
      matchReasons.push('Stack enterprise con alta confiabilidad');
    }
  }

  if (priority === 'maintainability') {
    if (hasTags(stack, 'simple') || stack.learningCurve === 'low') {
      score += 15;
      matchReasons.push('Código simple y fácil de mantener long-term');
    }
    if (stack.id === 'rails_postgres' || stack.id === 't3_stack') {
      score += 15;
      matchReasons.push('Convenciones fuertes = código consistente y fácil de mantener');
    }
  }

  // ============================================
  // RULE 5: PERFORMANCE REQUIREMENTS
  // ============================================

  if (performance === 'ultra_critical') {
    if (stack.id === 'go_react_postgres' || stack.id === 'rust_react_postgres') {
      score += 40;
      matchReasons.push('Performance ultra-crítica con latencia <100ms');
    } else if (stack.id === 'elixir_phoenix_postgres') {
      score += 30;
      matchReasons.push('Excelente concurrency y performance');
    } else {
      score -= 15;
      warnings.push('Este stack puede no cumplir requisitos de latencia ultra-baja');
    }
  }

  if (performance === 'critical') {
    if (['go_react_postgres', 'nextjs_postgres_vercel', 'svelte_node_mongo'].includes(stack.id)) {
      score += 20;
      matchReasons.push('Performance excelente para apps críticas');
    }
  }

  // ============================================
  // RULE 6: SECURITY REQUIREMENTS
  // ============================================

  if (security === 'critical' || security === 'high') {
    if (['spring_react_postgres', 'aspnet_react_sqlserver', 'django_react_postgres'].includes(stack.id)) {
      score += 30;
      matchReasons.push('Security enterprise-grade para datos sensibles');
    }
    if (stack.id === 'nocode_bubble_flutterflow') {
      score -= 30;
      warnings.push('No-code no recomendado para apps con security crítica');
    }
  }

  // ============================================
  // RULE 7: REAL-TIME REQUIREMENTS
  // ============================================

  if (realtime === 'realtime' || realtime === 'streaming') {
    if (['svelte_node_mongo', 'elixir_phoenix_postgres', 'flutter_firebase', 'convex_react'].includes(stack.id)) {
      score += 35;
      matchReasons.push('Optimizado para datos en tiempo real y websockets');
    } else if (stack.id === 'react_node_postgres_railway') {
      score += 15;
      matchReasons.push('Soporta real-time con Socket.io');
    }
  }

  if (realtime === 'no') {
    score += 5;
  }

  // ============================================
  // RULE 8: BUDGET CONSTRAINTS
  // ============================================

  if (budget === 'minimal') {
    const costValue = parseCost(stack.estimatedCost);
    if (costValue <= 10) {
      score += 30;
      matchReasons.push('Puede correr en free tiers (Vercel + Supabase)');
    } else if (costValue <= 20) {
      score += 15;
      matchReasons.push('Costo mínimo — ideal para bootstrap');
    } else if (costValue > 50) {
      score -= 25;
      warnings.push('Costos pueden exceder tu presupuesto');
    }
    if (stack.id === 'pocketbase_react') {
      score += 15;
      matchReasons.push('PocketBase en un VPS de $4/mes — el stack más barato disponible');
    }
    if (stack.id === 'wordpress_woocommerce') {
      score += 10;
      matchReasons.push('Hosting de WordPress desde $5/mes con todo incluido');
    }
  }

  if (budget === 'unlimited') {
    if (stack.tier === 3) {
      score += 15;
      matchReasons.push('Stack enterprise con soporte comercial disponible');
    }
  }

  // ============================================
  // RULE 9: ECOSYSTEM PREFERENCE
  // ============================================

  if (ecosystem === 'javascript') {
    if (hasTags(stack, 'javascript', 'typescript')) {
      score += 20;
      matchReasons.push('Full JavaScript/TypeScript stack');
    } else if (hasTags(stack, 'php', 'laravel', 'wordpress')) {
      score -= 10; // PHP but not a JS ecosystem
    } else {
      score -= 15;
    }
  }

  if (ecosystem === 'python') {
    if (hasTags(stack, 'python')) {
      score += 20;
      matchReasons.push('Python backend ideal para data y ML');
    } else {
      score -= 15;
    }
  }

  if (ecosystem === 'specialized') {
    if (['go_react_postgres', 'rust_react_postgres', 'elixir_phoenix_postgres',
         'laravel_vue_inertia', 'wordpress_woocommerce'].includes(stack.id)) {
      score += 20;
      matchReasons.push('Lenguaje/ecosistema especializado con ventajas únicas');
    }
  }

  if (ecosystem === 'no_preference') {
    if (stack.community === 'excellent') {
      score += 8;
      matchReasons.push('Comunidad excelente con abundantes recursos y soporte');
    } else if (stack.community === 'good') {
      score += 4;
    }
  }

  // ============================================
  // RULE 10: ARCHITECTURE PREFERENCE
  // ============================================

  if (architecture === 'monolith') {
    if (hasTags(stack, 'monolith', 'fullstack')) {
      score += 15;
      matchReasons.push('Arquitectura monolítica todo en uno');
    }
  }

  if (architecture === 'separated') {
    if (hasTags(stack, 'separated', 'api')) {
      score += 15;
      matchReasons.push('Frontend y backend separados para máxima flexibilidad');
    }
  }

  if (architecture === 'no_preference') {
    if (hasTags(stack, 'fullstack')) {
      score += 5;
    }
  }

  // ============================================
  // RULE 11: MULTI-PLATFORM SUPPORT
  // ============================================

  if (platforms === 'web_mobile' || platforms === 'web_mobile_desktop' || platforms === 'all') {
    if (stack.id === 'flutter_firebase' || stack.id === 'react_native_firebase') {
      score += 30;
      matchReasons.push('Una codebase para web + mobile + desktop');
    } else if (stack.id === 'react_node_postgres_railway') {
      score += 10;
      matchReasons.push('React permite compartir lógica con React Native');
    }
  }

  // ============================================
  // RULE 12: TEAM SIZE CONSIDERATIONS
  // ============================================

  if (teamSize === 'solo') {
    if (hasTags(stack, 'beginner-friendly', 'managed', 'fast', 'indie') ||
        ['nextjs_postgres_vercel', 'django_react_postgres', 'supabase_nextjs',
         'sveltekit_postgres', 'astro_node_postgres', 't3_stack', 'rails_postgres',
         'convex_react', 'pocketbase_react', 'laravel_vue_inertia', 'nuxt_supabase',
         'wordpress_woocommerce'].includes(stack.id)) {
      score += 15;
      matchReasons.push('Ideal para solo developers — menos moving parts');
    }
  }

  if (teamSize === 'large') {
    if (['nestjs_react_postgres', 'spring_react_postgres', 'aspnet_react_sqlserver',
         'angular_node_postgres'].includes(stack.id)) {
      score += 20;
      matchReasons.push('Arquitectura estructurada para equipos grandes');
    }
    if (stack.id === 'laravel_vue_inertia') {
      score += 10;
      matchReasons.push('Laravel tiene convenciones claras que escalan bien con el equipo');
    }
  }

  // ============================================
  // RULE 13: SPECIAL REQUIREMENTS (Q13)
  // ============================================

  const specialLower = special.toLowerCase();

  if (specialLower.includes('blockchain') || specialLower.includes('web3') || specialLower.includes('crypto')) {
    if (stack.id === 'blockchain_solidity_react') {
      score += 50;
      matchReasons.push('Stack especializado para Web3 y blockchain');
    }
  }

  if (specialLower.includes('ml') || specialLower.includes('machine learning') || specialLower.includes('ai')) {
    if (hasTags(stack, 'python') && hasTags(stack, 'data')) {
      score += 30;
      matchReasons.push('Python ideal para integración ML/AI');
    }
  }

  if (specialLower.includes('cms') || specialLower.includes('content')) {
    if (stack.id === 'headless_cms_nextjs') {
      score += 30;
      matchReasons.push('CMS headless para gestión de contenido avanzada');
    }
  }

  // ============================================
  // FINAL: Fallback matchReasons si no se generó ninguno
  // ============================================

  if (matchReasons.length === 0) {
    if (stack.bestFor && stack.bestFor.length > 0) {
      matchReasons.push(`Ideal para: ${stack.bestFor.slice(0, 2).join(', ')}`);
    }
    if (stack.description) {
      matchReasons.push(stack.description);
    }
    if (stack.community === 'excellent') {
      matchReasons.push('Gran comunidad y ecosistema maduro con soporte activo');
    }
  }

  score = Math.max(0, Math.min(200, score));

  return { score, matchReasons, warnings };
}

function generateUserProfile(answers) {
  return {
    projectType: answers.q1,
    timeline: answers.q2,
    teamSize: answers.q3,
    experienceLevel: answers.q4,
    topPriority: answers.q5,
    performanceNeeds: answers.q6,
    securityLevel: answers.q7,
    realtimeNeeds: answers.q8,
    budget: answers.q9,
    ecosystemPreference: answers.q10,
    architecturePreference: answers.q11,
    platformSupport: answers.q12,
    specialRequirements: answers.q13
  };
}

function generateRoadmap(stack, answers) {
  const type    = answers.q1 || 'saas';
  const urgent  = answers.q2 === 'urgent';
  const fe      = (stack.technologies && stack.technologies.frontend)  || 'el frontend';
  const be      = (stack.technologies && stack.technologies.backend)   || 'el backend';
  const db      = (stack.technologies && stack.technologies.database)  || 'la base de datos';
  const auth    = (stack.technologies && stack.technologies.auth)      || 'el sistema de autenticación';
  const hosting = (stack.technologies && stack.technologies.hosting)   || 'producción';

  const roadmaps = {

    // ─── SaaS ────────────────────────────────────────────────────────────────
    saas: [
      { week: 1,  title: 'Setup & Fundación',
        tasks: [`Inicializar proyecto con ${fe} y configurar ${hosting}`, `Conectar ${db} y correr primera migración`, 'Crear repositorio Git + CI básico (lint + build)', 'Deploy de "Hello World" en producción — el deploy más fácil siempre es el primero'] },
      { week: 2,  title: 'Autenticación Completa',
        tasks: [`Implementar ${auth} (registro, login, recuperación de contraseña)`, 'Email de verificación de cuenta', 'Sesiones seguras + logout en todos los dispositivos', 'Testear flujo de auth end-to-end'] },
      { week: 3,  title: 'Billing & Suscripciones',
        tasks: ['Integrar Stripe: planes Free, Pro y Business', 'Webhooks de Stripe (pago exitoso, fallido, cancelación)', 'Portal de cliente para cambiar plan o datos de pago', 'Lógica de acceso: bloquear features según plan'] },
      { week: 4,  title: 'Feature Core #1',
        tasks: [`Modelar entidades en ${db} y correr migraciones`, `Construir endpoints en ${be} con validación`, `Componentes UI en ${fe} con estados de carga y error`, 'Deploy a staging + smoke tests'] },
      { week: 5,  title: 'Feature Core #2',
        tasks: ['Planificar flujo de usuario del segundo feature', `Backend: lógica de negocio y endpoints en ${be}`, `Frontend: formularios, vistas y feedback visual en ${fe}`, 'Integration testing del feature completo'] },
      { week: 6,  title: 'Dashboard de Usuario',
        tasks: ['Página de inicio post-login con métricas personales', 'Historial de actividad y acciones recientes', 'Configuración de cuenta (perfil, notificaciones, plan)', 'Empty states útiles para usuarios nuevos'] },
      { week: 7,  title: 'Panel de Administración',
        tasks: ['Lista de usuarios con búsqueda y filtros', 'Gestión de suscripciones y facturación manual', 'Métricas globales: MRR, churn, usuarios activos', 'Herramientas de soporte: impersonar usuario, resetear cuenta'] },
      { week: 8,  title: 'Performance & Escalabilidad',
        tasks: [`Agregar índices en ${db} para queries lentas`, 'Caching de respuestas frecuentes (Redis o in-memory)', `Optimizar bundle de ${fe}: code splitting, lazy load`, 'Monitoreo con Sentry + uptime checks'] },
      { week: 9,  title: 'Seguridad & Compliance',
        tasks: ['Rate limiting en endpoints de auth y API', 'CSRF protection + security headers (Helmet)', 'Validación y sanitización estricta de todos los inputs', 'Privacy Policy, Terms of Service y cookie consent'] },
      { week: 10, title: 'Beta Privada',
        tasks: ['Invitar 20-50 usuarios beta (LinkedIn, Slack, comunidades)', 'Instalar herramienta de feedback (Canny, Typeform o email)', 'Corregir bugs críticos en menos de 24h', 'Iterar en los flujos con más fricción'] },
      { week: 11, title: 'Onboarding & Polish',
        tasks: ['Welcome email con pasos de activación claros', 'Tour interactivo para nuevos usuarios (Intro.js o propio)', 'Tooltips y hints contextuales en features clave', 'Ajustes finales de UI/UX según feedback beta'] },
      { week: 12, title: '🚀 Launch Day',
        tasks: [`Testing final en ${hosting} con datos reales`, 'Publicar en Product Hunt, Hacker News (Show HN), Reddit', 'Monitorear errores y métricas las primeras 24h', '¡Celebrar y preparar el roadmap del próximo mes!'] },
    ],

    // ─── E-commerce ──────────────────────────────────────────────────────────
    ecommerce: [
      { week: 1,  title: 'Setup & Catálogo de Productos',
        tasks: [`Inicializar proyecto con ${fe} + ${be} en ${hosting}`, `Schema de productos en ${db}: nombre, precio, variantes, stock, imágenes`, 'Subida de imágenes a CDN (Cloudinary o S3)', 'Panel básico para cargar primeros productos'] },
      { week: 2,  title: 'Páginas de Producto & Listados',
        tasks: ['Página de producto con galería, descripción y selector de variantes', 'Listado con paginación, filtros por categoría y precio', 'Búsqueda full-text de productos', 'Diseño responsive mobile-first'] },
      { week: 3,  title: 'Carrito de Compras',
        tasks: ['Carrito persistente (localStorage + DB para usuarios logueados)', 'Agregar, quitar y modificar cantidades', 'Cálculo de subtotal, descuentos y costos de envío', 'Mini-carrito en navbar con badge de items'] },
      { week: 4,  title: 'Checkout & Pagos',
        tasks: ['Flujo de checkout de 3 pasos: datos → envío → pago', 'Integrar Stripe Checkout o Mercado Pago', 'Validación de dirección de envío', 'Email de confirmación de compra automático'] },
      { week: 5,  title: 'Gestión de Órdenes',
        tasks: ['Schema de órdenes con estados: pendiente, pagado, enviado, entregado', 'Panel de admin para gestionar órdenes', 'Emails de estado: confirmación, tracking, entrega', 'Sistema básico de devoluciones'] },
      { week: 6,  title: 'Cuentas de Usuario',
        tasks: [`Auth con ${auth}: registro, login, Google OAuth`, 'Historial de compras con detalles de cada orden', 'Wishlist / lista de favoritos', 'Gestión de direcciones guardadas'] },
      { week: 7,  title: 'Panel de Admin Completo',
        tasks: ['Dashboard: ventas del día, semana, mes y productos más vendidos', 'Gestión de inventario con alertas de stock bajo', 'Gestión de descuentos y cupones', 'Exportar órdenes a CSV para contabilidad'] },
      { week: 8,  title: 'SEO & Structured Data',
        tasks: ['Meta tags dinámicos por producto y categoría', 'Schema.org (Product, BreadcrumbList, Organization)', 'Sitemap XML dinámico + robots.txt', 'Open Graph para compartir en redes sociales'] },
      { week: 9,  title: 'Performance & Core Web Vitals',
        tasks: ['Convertir imágenes a WebP + lazy loading', 'Pasar LCP < 2.5s y CLS < 0.1 en Google PageSpeed', `Optimizar bundle de ${fe} (tree shaking, prefetch)`, 'CDN para assets estáticos'] },
      { week: 10, title: 'Marketing & Analytics',
        tasks: ['Google Analytics 4 + eventos de conversión', 'Meta Pixel para retargeting de carritos abandonados', 'Integración con Mailchimp / Klaviyo para email marketing', 'Recuperación de carritos abandonados (email automático a las 24h)'] },
      { week: 11, title: 'Beta con Ventas Reales',
        tasks: ['Abrir tienda a amigos y familia (10-20 compras de prueba)', 'Verificar flujo de pago → orden → email end-to-end', 'Testear en móvil real (iOS + Android)', 'Corregir bugs de checkout y UX'] },
      { week: 12, title: '🚀 Launch Day',
        tasks: ['Lanzar con mínimo 50 productos cargados', 'Anunciar en redes sociales + grupos del nicho', 'Monitorear conversiones y abandono de carrito', '¡Primera venta real! 🎉'] },
    ],

    // ─── Blog / Contenido ─────────────────────────────────────────────────────
    blog: [
      { week: 1,  title: 'Setup & Modelo de Contenido',
        tasks: [`Inicializar con ${fe} + configurar ${hosting} con CI/CD`, 'Modelo de artículos: título, slug, contenido, cover, categoría, tags, autor', `Conectar ${db} o configurar CMS headless`, 'Deploy del sitio en blanco — siempre deployar primero'] },
      { week: 2,  title: 'Páginas de Artículo & Routing',
        tasks: ['Página de artículo con lectura estimada y tabla de contenidos', 'Listado principal con paginación y cards visuales', 'Páginas por categoría y tag', 'URLs amigables (slugs) y canonicals'] },
      { week: 3,  title: 'CMS & Editor',
        tasks: ['Editor de contenido: MDX, Notion API o Sanity/Contentful', 'Preview de artículos antes de publicar', 'Soporte para imágenes, código syntax highlighting y embeds', 'Sistema de borradores y programación de publicación'] },
      { week: 4,  title: 'Búsqueda & Navegación',
        tasks: ['Búsqueda full-text de artículos', 'Filtros por categoría, tag y fecha', 'Artículos relacionados al final de cada post', 'Breadcrumbs + navegación prev/next entre artículos'] },
      { week: 5,  title: 'Engagement & Comunidad',
        tasks: ['Sección de comentarios (Giscus, Disqus o propio)', 'Reacciones rápidas (👏 💡 ❤️) sin login', 'Compartir artículo en Twitter/LinkedIn/WhatsApp', 'Tiempo de lectura y barra de progreso de scroll'] },
      { week: 6,  title: 'Newsletter & Suscriptores',
        tasks: ['Formulario de suscripción (Mailchimp, Resend o ConvertKit)', 'Email de bienvenida con los mejores artículos', 'Popup de suscripción inteligente (aparece al 60% de scroll)', 'Doble opt-in para cumplir GDPR'] },
      { week: 7,  title: 'SEO Avanzado',
        tasks: ['Meta tags dinámicos + Open Graph por artículo', 'JSON-LD (Article, BreadcrumbList, WebSite)', 'Sitemap XML que se actualiza automáticamente', 'Core Web Vitals: LCP, FID y CLS en verde'] },
      { week: 8,  title: 'Performance',
        tasks: ['Imágenes optimizadas con next/image o similar', 'SSG o ISR para carga instantánea', 'Fuentes web con font-display: swap', 'Score > 90 en Google PageSpeed para móvil'] },
      { week: 9,  title: 'Monetización',
        tasks: ['Contenido premium con paywall (Stripe o LemonSqueezy)', 'Ads relevantes (Google AdSense o Carbon Ads)', 'Sección de patrocinadores', 'Afiliados: links de Amazon, libros o herramientas del nicho'] },
      { week: 10, title: 'Analytics Profundo',
        tasks: ['Google Analytics 4 + eventos custom (scroll, lectura completa)', 'Plausible o Umami como alternativa privacy-friendly', 'Heatmaps con Hotjar o Microsoft Clarity', 'Dashboard personal de métricas: vistas, lectores únicos, suscriptores'] },
      { week: 11, title: 'Distribución & RSS',
        tasks: ['Feed RSS/Atom para lectores y agregadores', 'Cross-posting automático a Dev.to, Medium o Hashnode', 'Newsletters de resumen semanal/mensual', 'Estrategia de backlinks: guest posts y colaboraciones'] },
      { week: 12, title: '🚀 Launch con Contenido',
        tasks: ['Publicar con mínimo 10 artículos de calidad listos', 'Anunciar en Twitter/X, LinkedIn y comunidades del nicho', 'Enviar primera newsletter a suscriptores beta', '¡Indexar en Google Search Console y esperar el tráfico!'] },
    ],

    // ─── Mobile ───────────────────────────────────────────────────────────────
    mobile: [
      { week: 1,  title: 'Setup & Arquitectura',
        tasks: [`Inicializar proyecto con ${fe} para iOS y Android`, 'Configurar CI/CD: builds automáticos en cada commit', 'Estructura de navegación: Tab Bar o Stack Navigator', 'Deploy de "Hello World" en simulador y dispositivo físico'] },
      { week: 2,  title: 'Autenticación Nativa',
        tasks: [`Implementar ${auth}: email/contraseña y Google Sign-In`, 'Face ID / Touch ID con Expo LocalAuthentication', 'Persistencia de sesión con Secure Store', 'Pantallas de onboarding (3-4 slides de bienvenida)'] },
      { week: 3,  title: 'Pantalla Principal',
        tasks: [`Conectar ${be} con ${db} para datos reales`, 'Feed o pantalla home con pull-to-refresh', 'Estados de carga (skeletons), error y lista vacía', 'Paginación infinita o "cargar más"'] },
      { week: 4,  title: 'Flujo Core #1',
        tasks: ['La funcionalidad principal del app (crear, buscar, registrar según dominio)', 'Formularios nativos con validación en tiempo real', 'Feedback táctil (haptics) en acciones importantes', 'Guardar datos localmente + sync con backend'] },
      { week: 5,  title: 'Flujo Core #2',
        tasks: ['Segunda funcionalidad clave del app', 'Gestos nativos (swipe, pinch, long press)', 'Soporte offline: mostrar datos cacheados sin conexión', 'Animaciones fluidas con Reanimated o equivalente'] },
      { week: 6,  title: 'Notificaciones Push',
        tasks: ['Configurar Firebase Cloud Messaging (FCM)', 'Notificaciones locales programadas (recordatorios)', 'Deep links: abrir la app en una pantalla específica desde notificación', 'Configuración de preferencias de notificación por el usuario'] },
      { week: 7,  title: 'APIs del Dispositivo',
        tasks: ['Cámara y galería de fotos (Expo ImagePicker)', 'Geolocalización si aplica al dominio', 'Compartir contenido con apps del sistema (Share API)', 'Acceso a contactos o calendario si el negocio lo requiere'] },
      { week: 8,  title: 'Performance & Batería',
        tasks: ['Profiling con Flipper o React Native DevTools', 'Eliminar renders innecesarios (memo, useMemo, useCallback)', 'Optimizar consumo de red: batching de requests, compresión', 'Background tasks eficientes (no despertar la CPU innecesariamente)'] },
      { week: 9,  title: 'Preparación para Stores',
        tasks: ['Generar iconos app (1024×1024) y splash screen en todas las resoluciones', 'Screenshots para App Store (6.7" iPhone) y Play Store (tablet + phone)', 'Rellenar metadata: descripción, keywords, categoría, edad', 'Revisar App Store Guidelines y Play Store Policy'] },
      { week: 10, title: 'Beta Testing',
        tasks: ['Distribuir por TestFlight (iOS) e Internal Testing (Android)', 'Invitar 20+ testers con distintos dispositivos y versiones de OS', 'Instalar crash reporting (Sentry o Crashlytics)', 'Corregir crashes y bugs críticos de UX'] },
      { week: 11, title: 'Polish & Accesibilidad',
        tasks: ['Labels de accesibilidad para lectores de pantalla', 'Soporte para modo oscuro (Dark Mode)', 'Textos escalables para configuración de tamaño del sistema', 'Animaciones reducidas para usuarios con preferencia prefers-reduced-motion'] },
      { week: 12, title: '🚀 Submit a Stores',
        tasks: ['Submit a App Store Review (proceso de 1-3 días)', 'Submit a Google Play Store Review (proceso de horas a 1 día)', 'Preparar landing page con badges de descarga', '¡Primera instalación real de un usuario desconocido! 🎉'] },
    ],

    // ─── Dashboard / Herramienta interna ──────────────────────────────────────
    dashboard: [
      { week: 1,  title: 'Setup & Sistema de Roles',
        tasks: [`Inicializar con ${fe} + ${be} en ${hosting}`, `Schema de usuarios y roles en ${db} (admin, editor, viewer)`, 'Definir qué puede hacer cada rol (permisos por recurso)', 'Deploy inicial con pantalla de login'] },
      { week: 2,  title: 'Autenticación & RBAC',
        tasks: [`Auth completa con ${auth}`, 'Middleware de autorización por rol en cada endpoint', 'Pantalla de acceso denegado para rutas protegidas', 'Gestión de sesiones: timeout automático por inactividad'] },
      { week: 3,  title: 'Vistas Principales de Datos',
        tasks: [`Tablas paginadas con datos de ${db}`, 'Columnas ordenables + filtros por columna', 'Búsqueda en tiempo real', 'Exportar a CSV con los filtros aplicados'] },
      { week: 4,  title: 'Gráficos & KPIs',
        tasks: ['KPIs principales en tarjetas (totales, promedios, variaciones vs período anterior)', 'Gráfico de líneas para tendencias temporales (Recharts o Chart.js)', 'Gráfico de barras para comparaciones', 'Selector de rango de fechas para todos los gráficos'] },
      { week: 5,  title: 'Filtros Avanzados & Exportación',
        tasks: ['Filtros combinados: fecha, estado, categoría, usuario', 'Guardar configuraciones de filtro favoritas', 'Exportar a Excel (con formato) además de CSV', 'Vista de detalle al hacer click en cualquier fila'] },
      { week: 6,  title: 'CRUD Completo',
        tasks: ['Formularios de creación con validación en tiempo real', 'Edición inline en tabla para cambios rápidos', 'Confirmación antes de eliminar (soft delete con papelera)', 'Importación masiva via CSV con validación de cada fila'] },
      { week: 7,  title: 'Notificaciones & Alertas',
        tasks: ['Alertas configurables cuando una métrica supera/baja un umbral', 'Centro de notificaciones in-app con badge de no leídas', 'Emails automáticos para eventos críticos', 'Historial de alertas disparadas'] },
      { week: 8,  title: 'Performance',
        tasks: [`Índices en ${db} para las queries de los filtros más usados`, 'Paginación server-side para tablas con miles de filas', 'Caché de resultados frecuentes (Redis o in-memory)', 'Virtual scroll para listas muy largas'] },
      { week: 9,  title: 'Audit Logs & Compliance',
        tasks: ['Registro inmutable de quién hizo qué y cuándo', 'Vista de audit log con filtros por usuario y acción', 'Retención de logs configurable (30/90/365 días)', 'Compliance: HTTPS, headers de seguridad, backups de DB'] },
      { week: 10, title: 'UAT con Stakeholders',
        tasks: ['Sesión guiada con los usuarios finales del equipo (no IT, sino los operativos)', 'Recolectar feedback estructurado por flujo', 'Priorizar cambios: bugs críticos vs nice-to-have', 'Segunda ronda de UAT post-correcciones'] },
      { week: 11, title: 'Documentación',
        tasks: ['Manual de usuario con capturas de pantalla', 'Videos cortos (2-3 min) para cada flujo principal', 'FAQ interno con los problemas más comunes', 'Guía de onboarding para nuevos usuarios del equipo'] },
      { week: 12, title: '🚀 Go-Live',
        tasks: [`Deploy a producción en ${hosting} con backup verificado`, 'Migración de datos desde sistema anterior (si aplica)', 'Sesión de capacitación grupal con todo el equipo', '¡El equipo adopta la herramienta — misión cumplida! 🎉'] },
    ],

    // ─── API / Backend ────────────────────────────────────────────────────────
    api: [
      { week: 1,  title: 'Setup & Arquitectura',
        tasks: [`Inicializar proyecto con ${be}`, 'Estructura de carpetas: routes, controllers, services, middleware', 'Linting (ESLint/Pylint) + formateo + pre-commit hooks', `Deploy en ${hosting} con variables de entorno seguras`] },
      { week: 2,  title: 'Schema & Migraciones',
        tasks: [`Diseñar schema completo en ${db} con relaciones`, 'Sistema de migraciones versionadas (Prisma, Alembic, Flyway)', 'Seeds para datos de desarrollo', 'Validaciones a nivel de base de datos (constraints, FK)'] },
      { week: 3,  title: 'Endpoints CRUD Core',
        tasks: ['GET (list + detail), POST, PUT/PATCH, DELETE para entidades principales', 'Validación de body con schema (Zod, Joi, Pydantic)', 'Respuestas JSON consistentes: `{ data, error, meta }`', 'Manejo de errores centralizado con códigos HTTP correctos'] },
      { week: 4,  title: 'Auth & Middleware',
        tasks: [`JWT + refresh tokens (o sessions según ${be})`, 'Middleware de autenticación en rutas protegidas', 'Autorización por roles y ownership (¿puede este user modificar este recurso?)', 'Revocación de tokens y logout en todos los dispositivos'] },
      { week: 5,  title: 'Endpoints Avanzados',
        tasks: ['Paginación cursor-based o offset con metadata (total, pages, hasNext)', 'Filtros por múltiples campos + ordenamiento configurable', 'Búsqueda full-text', 'Endpoints de búsqueda y agregación/estadísticas'] },
      { week: 6,  title: 'Rate Limiting & Caching',
        tasks: ['Rate limiting por IP y por usuario (express-rate-limit, slowapi)', 'Cache de respuestas costosas (Redis o in-memory LRU)', 'ETag y Cache-Control headers para clientes', 'Circuit breaker para llamadas a servicios externos'] },
      { week: 7,  title: 'Documentación OpenAPI',
        tasks: ['Spec OpenAPI 3.0 completa (o generada desde código)', 'Swagger UI / Redoc disponible en /docs', 'Colección de Postman/Insomnia exportable', 'Ejemplos de request/response para cada endpoint'] },
      { week: 8,  title: 'Testing',
        tasks: ['Unit tests de services y helpers (>80% coverage)', 'Integration tests de endpoints con base de datos real', 'Mocking de servicios externos', 'CI que bloquea merges si los tests fallan'] },
      { week: 9,  title: 'Seguridad (OWASP)',
        tasks: ['SQL injection: queries parametrizadas en todo el código', 'XSS: sanitizar inputs y outputs', 'CORS configurado para orígenes permitidos solamente', 'Headers de seguridad (Helmet, HSTS, CSP)'] },
      { week: 10, title: 'Load Testing',
        tasks: ['Definir SLOs: p95 < 200ms, uptime > 99.9%', 'Load test con k6 o Artillery: simular 1000 usuarios concurrentes', 'Identificar y corregir bottlenecks (DB, N+1 queries, memoria)', 'Autoscaling configurado en `' + hosting + '`'] },
      { week: 11, title: 'SDK & Webhooks',
        tasks: ['SDK cliente en TypeScript/Python si hay consumidores externos', 'Sistema de webhooks: subscribe, deliver, retry con backoff exponencial', 'Versionado de API: /v1/, headers de deprecación', 'Changelog público de breaking changes'] },
      { week: 12, title: '🚀 Launch & Monitoreo',
        tasks: [`Deploy final en ${hosting} con backups automáticos de ${db}`, 'Logs estructurados (JSON) + alertas en Sentry / Datadog', 'Status page pública (statuspage.io o betteruptime.com)', '¡Primera integración de cliente real! 🎉'] },
    ],

    // ─── Red Social ──────────────────────────────────────────────────────────
    social: [
      { week: 1,  title: 'Setup & Infraestructura Real-Time',
        tasks: [`Inicializar con ${fe} + ${be} en ${hosting}`, 'Configurar WebSockets o real-time layer (Socket.io, Supabase Realtime, Convex)', `Schema de usuarios, posts y relaciones en ${db}`, 'Deploy base con conexión real-time verificada'] },
      { week: 2,  title: 'Perfiles de Usuario',
        tasks: [`Auth con ${auth}: email, Google y Apple Sign-In`, 'Perfil: avatar, bio, links, nombre de usuario único (@handle)', 'Subida de avatar con crop circular', 'Página pública de perfil con URL amigable'] },
      { week: 3,  title: 'Feed Principal',
        tasks: ['Timeline cronológico de posts de las cuentas que sigo', 'Paginación infinita con nuevos posts apareciendo arriba en tiempo real', 'Indicador "X nuevos posts" sin recargar la página', 'Feed vacío con sugerencias de a quién seguir'] },
      { week: 4,  title: 'Publicación de Contenido',
        tasks: ['Composer de post: texto, imágenes (múltiples), video corto', 'Preview de links con Open Graph (unfurl automático)', 'Menciones (@usuario) con autocompletado', 'Borrador guardado automáticamente'] },
      { week: 5,  title: 'Comentarios & Reacciones',
        tasks: ['Comentarios anidados (respuestas a respuestas)', 'Reacciones con emojis personalizados', 'Like/unlike en tiempo real visible para todos', 'Contador de vistas por post'] },
      { week: 6,  title: 'Sistema de Follows',
        tasks: ['Seguir / dejar de seguir con actualización instantánea', 'Seguidores y seguidos con lista paginada', 'Sugerencias de "Personas que quizás conozcas" (amigos de amigos)', 'Perfil privado con solicitudes de seguimiento'] },
      { week: 7,  title: 'Notificaciones',
        tasks: ['Notificaciones in-app en tiempo real (nuevo like, comentario, follower)', 'Centro de notificaciones con filtros (todo, menciones, seguidos)', 'Push notifications para móvil (PWA o app nativa)', 'Email digest semanal de actividad'] },
      { week: 8,  title: 'Búsqueda & Descubrimiento',
        tasks: ['Búsqueda de usuarios, posts y hashtags', 'Página de Explorar: contenido trending del momento', 'Hashtags con página propia y feed dedicado', 'Trending topics calculados en tiempo real'] },
      { week: 9,  title: 'Moderación & Seguridad',
        tasks: ['Reportar post o usuario con categorías de motivo', 'Bloquear usuario (deja de verse mutuamente)', 'Silenciar usuario (no lo ves, pero él sí te ve)', 'Panel de moderación para revisar reportes (admin)'] },
      { week: 10, title: 'Performance & Escalabilidad',
        tasks: ['CDN para imágenes y videos (Cloudflare, Cloudinary)', 'Feed cacheado para reducir queries a DB', 'Paginación eficiente con cursor (no offset) para feeds grandes', 'Monitoreo: latencia de WebSockets, queries lentas, errores'] },
      { week: 11, title: 'Mobile & PWA',
        tasks: ['PWA: manifest.json + Service Worker para instalación', 'Diseño responsivo perfecto en iOS Safari y Chrome Android', 'Gestos táctiles nativos (swipe, pull-to-refresh)', 'Modo oscuro automático según preferencia del sistema'] },
      { week: 12, title: '🚀 Launch con Seed Users',
        tasks: ['Estrategia anti-red-vacía: invitar 50+ usuarios activos antes del launch', 'Contenido pre-cargado para que la plataforma no parezca vacía', 'Anunciar en Twitter/X, Product Hunt y comunidades del nicho', '¡Primer viral orgánico — el momento que hace que todo valga la pena! 🎉'] },
    ],

    // ─── Juego Web ────────────────────────────────────────────────────────────
    game: [
      { week: 1,  title: 'Setup & Game Loop',
        tasks: [`Inicializar proyecto con ${fe} (Canvas, WebGL o librería de juegos)`, 'Game loop principal: update → render a 60fps', 'Input handling: teclado, mouse y touch', 'Deploy en `' + hosting + '` para testear en móvil desde el día 1'] },
      { week: 2,  title: 'Mecánicas Core',
        tasks: ['Física básica: gravedad, velocidad, colisiones AABB', 'Personaje/entidad principal con movimiento y animación', 'Primer nivel jugable (aunque sea simple)', 'Game states: menú → jugando → pausa → game over'] },
      { week: 3,  title: 'HUD & Interfaz',
        tasks: ['HUD: score, vidas, tiempo, nivel — legible en cualquier pantalla', 'Pantalla de menú principal con opciones', 'Pantalla de pausa con resume/restart/exit', 'Pantalla de Game Over con score final y botón de retry'] },
      { week: 4,  title: 'Niveles & Progresión',
        tasks: ['Diseñar e implementar 5-8 niveles con dificultad progresiva', 'Sistema de unlock de niveles', 'Transiciones suaves entre niveles (fadeout, pantalla de "Nivel X")', 'Balance de dificultad: testear con alguien externo'] },
      { week: 5,  title: 'Leaderboard & Multijugador',
        tasks: [`Score global guardado en ${db} con ranking en tiempo real`, 'Top 10 global + posición del jugador actual', 'Compartir score en Twitter/X con un click', 'Multijugador básico si el concepto lo permite (turn-based o co-op simple)'] },
      { week: 6,  title: 'Audio & Efectos Visuales',
        tasks: ['Música de fondo con loop y control de volumen', 'Sonidos por acción: saltar, colisionar, recoger item, morir', 'Efectos de partículas para explosiones, puntos, power-ups', 'Screen shake para impactos y eventos dramáticos'] },
      { week: 7,  title: 'Sistema de Guardado',
        tasks: ['Guardar progreso en localStorage (offline) y DB (online)', 'Checkpoints en niveles largos', 'Configuración guardada: volumen, controles, idioma', 'Borrar progreso con doble confirmación'] },
      { week: 8,  title: 'Performance a 60fps',
        tasks: ['Profiling en Chrome DevTools: CPU, memoria, FPS counter', 'Object pooling para balas, partículas y enemigos', 'Culling: no procesar objetos fuera de pantalla', 'Comprimir y optimizar todos los assets de audio e imagen'] },
      { week: 9,  title: 'Monetización (si aplica)',
        tasks: ['Definir modelo: cosméticos (skins), remove-ads o one-time purchase', 'Integrar Stripe para compras o Itch.io si es indie', 'Anuncios no-intrusivos (banner al final de nivel, no durante el juego)', 'Rewarded ads: mirar un ad = vida extra o continue'] },
      { week: 10, title: 'Playtesting Externo',
        tasks: ['Compartir con 10-20 testers fuera de tu círculo cercano', 'Observar sin intervenir: ¿dónde se confunden? ¿dónde se aburren?', 'Medir: tiempo promedio de sesión, nivel donde abandonan, score promedio', 'Iterar en los primeros 60 segundos — son los más críticos'] },
      { week: 11, title: 'Polish & Bug Fixing',
        tasks: ['Corregir todos los bugs de gameplay (prioridad máxima)', 'Animaciones de introducción y tutorial contextual', 'Achievements o logros para aumentar retención', 'Optimizar mobile: táctil preciso, no bloquear pantalla en iOS'] },
      { week: 12, title: '🚀 Launch',
        tasks: ['Publicar en Itch.io + embed en sitio propio', 'Trailer de 60 segundos para Twitter/X y TikTok', 'Postear en r/WebGames, GameDev.net y comunidades del nicho', '¡Primer "completé tu juego" de un desconocido — la mejor sensación! 🎉'] },
    ],
  };

  const plan = (roadmaps[type] || roadmaps.saas).map((week, i) => ({ ...week, week: i + 1 }));

  if (urgent) {
    plan[0].tasks.push('⚡ FAST TRACK: Recortar al MVP mínimo — lanzar primero, pulir después');
    // Remove weeks 9-11 detail by shortening non-critical weeks into one sprint
  }

  return plan;
}

module.exports = {
  getRecommendation,
  scoreStack,
  generateUserProfile,
  generateRoadmap
};
