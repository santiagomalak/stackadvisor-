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

  const auth = { Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}` };

  const [resG, resL] = await Promise.all([
    fetch(`https://api.lemonsqueezy.com/v1/variants/${VARIANT_GLOBAL}`, { headers: auth }),
    fetch(`https://api.lemonsqueezy.com/v1/variants/${VARIANT_LATAM}`,  { headers: auth }),
  ]);

  const [dataG, dataL] = await Promise.all([resG.json(), resL.json()]);

  const buyG = dataG?.data?.attributes?.buy_now_url as string | undefined;
  const buyL = dataL?.data?.attributes?.buy_now_url as string | undefined;

  const result = {
    global: buyG ? `${buyG}?embed=1&media=0&logo=0` : '',
    latam:  buyL ? `${buyL}?embed=1&media=0&logo=0` : '',
  };

  if (result.global && result.latam) {
    urlCache = { ...result, at: Date.now() };
  }

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
