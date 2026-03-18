import { NextRequest, NextResponse } from 'next/server';

const LATAM_COUNTRIES = [
  'AR', 'BR', 'MX', 'CO', 'CL', 'PE', 'VE', 'EC', 'BO', 'PY',
  'UY', 'CR', 'PA', 'GT', 'HN', 'SV', 'NI', 'DO', 'CU', 'PR',
];

export async function GET(request: NextRequest) {
  // Vercel injects the country automatically in the header
  const country = request.headers.get('x-vercel-ip-country') || '';
  const isLatam = LATAM_COUNTRIES.includes(country.toUpperCase());

  return NextResponse.json({
    country,
    isLatam,
    variantId: isLatam
      ? process.env.LEMONSQUEEZY_VARIANT_LATAM
      : process.env.LEMONSQUEEZY_VARIANT_GLOBAL,
    price: isLatam ? 30 : 40,
    label: isLatam ? 'Precio LATAM' : 'Precio global',
  });
}
