/**
 * StackAdvisor — Affiliate Configuration
 *
 * Para activar cada afiliado:
 * 1. Registrate en el programa de la plataforma (links abajo)
 * 2. Reemplazá YOUR_CODE con tu código real
 * 3. Hacé git push — se aplica automáticamente en toda la app
 *
 * Programas:
 * - Railway:      https://railway.app/affiliate          → 25% comisión recurrente
 * - DigitalOcean: https://www.digitalocean.com/referral  → $25 por referido que gasta $25
 * - Render:       https://render.com/i/                  → créditos por referido
 * - Vercel:       https://vercel.com/partners            → programa de partners
 * - Supabase:     https://supabase.com/partners          → 25% comisión recurrente
 * - Netlify:      https://www.netlify.com/partners       → programa de partners
 * - Platzi:       https://platzi.com/r/                  → 25% comisión por curso
 */

export type AffiliateKey =
  | 'railway'
  | 'digitalocean'
  | 'render'
  | 'vercel'
  | 'supabase'
  | 'netlify'
  | 'flyio'
  | 'platzi'
  | 'mongodb_atlas'
  | 'firebase';

interface AffiliateConfig {
  name: string;
  url: string;
  cta: string;
  badge: string;         // texto del badge (ej: "25% off", "Gratis")
  description: string;  // frase corta de valor
  logo: string;         // emoji representativo
  active: boolean;      // false = no mostrar hasta tener el código real
}

export const AFFILIATES: Record<AffiliateKey, AffiliateConfig> = {
  railway: {
    name: 'Railway',
    url: 'https://railway.app?referralCode=YOUR_CODE',
    cta: 'Empezar gratis en Railway →',
    badge: '$5 de crédito gratis',
    description: 'Deploy en segundos. $5 gratis para empezar sin tarjeta.',
    logo: '🚂',
    active: false, // → cambiar a true cuando tengas tu código
  },
  digitalocean: {
    name: 'DigitalOcean',
    url: 'https://www.digitalocean.com/?refcode=YOUR_CODE',
    cta: 'Obtener $200 de crédito →',
    badge: '$200 gratis',
    description: '60 días de crédito gratuito para nuevos usuarios.',
    logo: '🌊',
    active: false,
  },
  render: {
    name: 'Render',
    url: 'https://render.com/i/YOUR_CODE',
    cta: 'Deploy gratis en Render →',
    badge: 'Free tier generoso',
    description: 'Hosting con free tier permanente para apps pequeñas.',
    logo: '⚙️',
    active: false,
  },
  vercel: {
    name: 'Vercel',
    url: 'https://vercel.com/signup',
    cta: 'Empezar gratis en Vercel →',
    badge: 'Gratis para siempre',
    description: 'El mejor hosting para Next.js. Free tier permanente.',
    logo: '▲',
    active: true, // Vercel no requiere código de afiliado para mostrar
  },
  supabase: {
    name: 'Supabase',
    url: 'https://supabase.com/dashboard/sign-up',
    cta: 'Crear proyecto gratis →',
    badge: '2 proyectos gratis',
    description: 'Backend completo en minutos. Auth, DB y Storage incluidos.',
    logo: '⚡',
    active: true,
  },
  netlify: {
    name: 'Netlify',
    url: 'https://app.netlify.com/signup',
    cta: 'Deploy gratis en Netlify →',
    badge: 'Gratis para siempre',
    description: 'CI/CD automático y hosting estático con CDN global.',
    logo: '🌐',
    active: true,
  },
  flyio: {
    name: 'Fly.io',
    url: 'https://fly.io/app/sign-up',
    cta: 'Empezar en Fly.io →',
    badge: 'Free allowance incluido',
    description: 'Deploy de containers en 30+ regiones del mundo.',
    logo: '🪁',
    active: true,
  },
  platzi: {
    name: 'Platzi',
    url: 'https://platzi.com/r/YOUR_CODE',
    cta: 'Ver cursos en Platzi →',
    badge: '30% descuento',
    description: 'Los mejores cursos en español para aprender este stack.',
    logo: '📚',
    active: false,
  },
  mongodb_atlas: {
    name: 'MongoDB Atlas',
    url: 'https://www.mongodb.com/cloud/atlas/register',
    cta: 'Crear cluster gratis →',
    badge: '512MB gratis',
    description: 'Base de datos en la nube con tier gratuito permanente.',
    logo: '🍃',
    active: true,
  },
  firebase: {
    name: 'Firebase',
    url: 'https://firebase.google.com',
    cta: 'Empezar con Firebase →',
    badge: 'Spark plan gratis',
    description: 'Backend de Google con auth, DB y hosting integrados.',
    logo: '🔥',
    active: true,
  },
};

// Mapeo automático: qué afiliados mostrar según el hosting del stack
export const HOSTING_TO_AFFILIATES: Record<string, AffiliateKey[]> = {
  'Vercel':                          ['vercel'],
  'Vercel + Railway':                ['vercel', 'railway'],
  'Railway / Render':                ['railway', 'render'],
  'Railway / DigitalOcean':          ['railway', 'digitalocean'],
  'Railway / Render / Fly.io':       ['railway', 'render', 'flyio'],
  'Railway / Fly.io':                ['railway', 'flyio'],
  'Netlify + Railway':               ['netlify', 'railway'],
  'Firebase Hosting':                ['firebase'],
  'Vercel + MongoDB Atlas':          ['vercel', 'mongodb_atlas'],
  'Vercel + Convex Cloud':           ['vercel'],
  'Fly.io / AWS':                    ['flyio'],
  'Fly.io / Vercel':                 ['flyio', 'vercel'],
  'Fly.io / VPS / DigitalOcean':     ['flyio', 'digitalocean'],
  'Fly.io / Gigalixir':              ['flyio'],
  'Vercel / Netlify':                ['vercel', 'netlify'],
  'AWS / DigitalOcean':              ['digitalocean'],
  'Laravel Forge / DigitalOcean':    ['digitalocean'],
  'Laravel Forge / Railway / DigitalOcean': ['railway', 'digitalocean'],
  'Vercel + Supabase':               ['vercel', 'supabase'],
  'Vercel + MongoDB Atlas / Railway': ['vercel', 'railway', 'mongodb_atlas'],
  'S3 + CloudFront + Lambda':        [],
  'Azure':                           [],
  'AWS / Azure / On-premise':        [],
  'Shopify Cloud':                   [],
  'Platform hosting':                [],
  'App Store + Play Store':          ['firebase'],
  'WP Engine / Hostinger / SiteGround': [],
  'Google Cloud / Azure / AWS':      [],
  'IPFS / Vercel':                   ['vercel'],
};

export function getAffiliatesForHosting(hosting: string): AffiliateConfig[] {
  const keys = HOSTING_TO_AFFILIATES[hosting] || [];
  return keys
    .map((k) => AFFILIATES[k])
    .filter((a) => a && a.active);
}
