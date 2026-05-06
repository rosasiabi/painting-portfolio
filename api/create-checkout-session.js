const STRIPE_API_VERSION = '2026-04-22.dahlia';
const DEFAULT_CURRENCY = 'eur';
const SHIPPING_COUNTRIES = ['AT', 'BE', 'CA', 'CH', 'DE', 'DK', 'ES', 'FI', 'FR', 'GB', 'IE', 'IT', 'NL', 'NO', 'PT', 'SE', 'US'];

const catalog = {
  charles: {
    title: 'I have meddled...If that is the word',
    status: 'available',
    print: 7500,
    original: 65000
  },
  charlie: {
    title: 'Charlie',
    status: 'sold',
    print: 7500
  },
  teni: {
    title: 'Teni',
    status: 'sold',
    print: 7500
  },
  milo: {
    title: 'Milo',
    status: 'sold',
    print: 7500
  },
  andrew: {
    title: 'Andrew',
    status: 'sold',
    print: 7500
  },
  victor: {
    title: 'I sport new balance to avoid a narrow path',
    status: 'available',
    print: 7500,
    original: 120000
  },
  bb09: { title: 'head', status: 'available', print: 4500, original: 28000 },
  bb01: { title: 'leg', status: 'available', print: 4500, original: 28000 },
  bb07: { title: 'nipple', status: 'sold', print: 4500 },
  bb03: { title: 'half', status: 'available', print: 4500, original: 28000 },
  bb04: { title: 'fist', status: 'available', print: 4500, original: 28000 },
  bb05: { title: 'v', status: 'sold', print: 4500 },
  bb02: { title: 'thigh', status: 'sold', print: 4500 },
  bb06: { title: 'chest', status: 'available', print: 4500, original: 28000 },
  bb08: { title: 'armpit', status: 'available', print: 4500, original: 28000 },
  bb10: { title: 'upper body', status: 'available', print: 4500, original: 28000 },
  CAKE: { title: 'Aging backwards', status: 'sold', print: 4500 },
  MAKEUP: { title: 'All dolled up with nowhere to be', status: 'available', print: 5500, original: 36000 },
  tilda: { title: 'Tilda do us part', status: 'available', print: 4500, original: 28000 },
  franca: { title: 'Franca lost her drink', status: 'sold', print: 4500 },
  tow: { title: 'Turkish Oil Wrestling', status: 'available', print: 4500, original: 28000 }
};

function getBaseUrl(request) {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, '');
  const host = request.headers['x-forwarded-host'] || request.headers.host;
  const proto = request.headers['x-forwarded-proto'] || 'https';
  if (host) return `${proto}://${host}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:5173';
}

function getBody(request) {
  if (request.body && typeof request.body === 'object') return request.body;
  if (typeof request.body === 'string') {
    try {
      return JSON.parse(request.body);
    } catch {
      return {};
    }
  }
  return {};
}

function sendJson(response, status, payload) {
  response.statusCode = status;
  response.setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify(payload));
}

function appendLineItem(params, key, value) {
  params.append(`line_items[0]${key}`, value);
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    sendJson(response, 405, { error: 'Method not allowed' });
    return;
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    sendJson(response, 500, { error: 'Stripe is not configured yet.' });
    return;
  }

  const { artwork, format } = getBody(request);
  const item = catalog[artwork];
  const isOriginal = format === 'original';
  const isPrint = format === 'print';

  if (!item || (!isPrint && !isOriginal)) {
    sendJson(response, 400, { error: 'Unknown artwork or format.' });
    return;
  }

  if (isOriginal && item.status !== 'available') {
    sendJson(response, 409, { error: 'The original has already been sold.' });
    return;
  }

  const unitAmount = item[format];
  if (!Number.isInteger(unitAmount) || unitAmount <= 0) {
    sendJson(response, 409, { error: 'Checkout is not configured for this item yet.' });
    return;
  }

  const baseUrl = getBaseUrl(request);
  const currency = (process.env.STRIPE_CURRENCY || DEFAULT_CURRENCY).toLowerCase();
  const params = new URLSearchParams();
  const productName = `${item.title} - ${isOriginal ? 'Original' : 'Print'}`;

  params.append('mode', 'payment');
  params.append('success_url', `${baseUrl}/shop.html?artwork=${encodeURIComponent(artwork)}&payment=success`);
  params.append('cancel_url', `${baseUrl}/shop.html?artwork=${encodeURIComponent(artwork)}&payment=cancelled`);
  params.append('client_reference_id', `${artwork}:${format}`);
  params.append('metadata[artwork]', artwork);
  params.append('metadata[format]', format);
  params.append('shipping_address_collection[allowed_countries][]', SHIPPING_COUNTRIES[0]);
  SHIPPING_COUNTRIES.slice(1).forEach((country) => {
    params.append('shipping_address_collection[allowed_countries][]', country);
  });
  appendLineItem(params, '[quantity]', '1');
  appendLineItem(params, '[price_data][currency]', currency);
  appendLineItem(params, '[price_data][unit_amount]', String(unitAmount));
  appendLineItem(params, '[price_data][product_data][name]', productName);
  appendLineItem(params, '[price_data][product_data][metadata][artwork]', artwork);
  appendLineItem(params, '[price_data][product_data][metadata][format]', format);

  try {
    const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Stripe-Version': STRIPE_API_VERSION
      },
      body: params
    });

    const session = await stripeResponse.json();
    if (!stripeResponse.ok) {
      sendJson(response, stripeResponse.status, {
        error: session.error?.message || 'Stripe could not create a checkout session.'
      });
      return;
    }

    sendJson(response, 200, { url: session.url });
  } catch {
    sendJson(response, 502, { error: 'Could not reach Stripe. Please try again.' });
  }
}
