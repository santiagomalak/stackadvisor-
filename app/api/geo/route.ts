import { NextRequest, NextResponse } from 'next/server';

const LATAM_COUNTRIES = [
  'AR', 'BR', 'MX', 'CO', 'CL', 'PE', 'VE', 'EC', 'BO', 'PY',
  'UY', 'CR', 'PA', 'GT', 'HN', 'SV', 'NI', 'DO', 'CU', 'PR',
];

const VARIANT_GLOBAL = process.env.LEMONSQUEEZY_VARIANT_GLOBAL!;
const VARIANT_LATAM  = process.env.LEMONSQUEEZY_VARIANT_LATAM!;

// Module-level cache so we don't hit Lemon Squeezy API on every request
let urlCache: { global: string; latam: string; at: number } | null = null;
const CACHE_MS = 60 * 60 * 1000; // 1 hour

async function getLemonCheckoutUrls(): Promise<{ global: string; latam: string }> {
  if (urlCache && Date.now() - urlCache.at < CACHE_MS) {
    return { global: urlCache.global, latam: urlCache.latam };
  }

  // Option 1: direct URLs stored in env (fastest, no API call)
  const directGlobal = process.env.LEMONSQUEEZY_URL_GLOBAL;
  const directLatam  = process.env.LEMONSQUEEZY_URL_LATAM;

  if (directGlobal && directLatam) {
    const result = {
      global: `${directGlobal}?embed=1&media=0&logo=0`,
      latam:  `${directLatam}?embed=1&media=0&logo=0`,
    };
    urlCache = { ...result, at: Date.now() };
    return result;
  }

  // Option 2: fetch store slug from Lemon Squeezy API and construct URL from variant UUID
  const auth = { Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}` };

  const storeRes  = await fetch('https://api.lemonsqueezy.com/v1/stores', { headers: auth });
  const storeData = await storeRes.json();
  const slug      = storeData?.data?.[0]?.attributes?.slug as string | undefined;

  if (!slug) {
    console.error('[geo] Could not get Lemon Squeezy store slug', storeData);
    return { global: '', latam: '' };
  }

  const base   = (uuid: string) => `https://${slug}.lemonsqueezy.com/checkout/buy/${uuid}?embed=1&media=0&logo=0`;
  const result = {
    global: base(VARIANT_GLOBAL),
    latam:  base(VARIANT_LATAM),
  };

  urlCache = { ...result, at: Date.now() };
  return result;
}

export async function GET(request: NextRequest) {
  const country  = request.headers.get('x-vercel-ip-country') || '';
  const isLatam  = LATAM_COUNTRIES.includes(country.toUpperCase());

  let checkoutGlobal = '';
  let checkoutLatam  = '';

  try {
    const urls = await getLemonCheckoutUrls();
    checkoutGlobal = urls.global;
    checkoutLatam  = urls.latam;
  } catch {
    // fallback: will be handled on the frontend
  }

  return NextResponse.json({
    country,
    isLatam,
    price:          isLatam ? 30 : 40,
    label:          isLatam ? 'Precio LATAM' : 'Precio global',
    checkoutGlobal,
    checkoutLatam,
  });
}
