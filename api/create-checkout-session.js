const STRIPE_API_VERSION = '2026-04-22.dahlia';
const DEFAULT_CURRENCY = 'gbp';
const SHIPPING_COUNTRIES = ['AT', 'BE', 'CA', 'CH', 'DE', 'DK', 'ES', 'FI', 'FR', 'GB', 'IE', 'IT', 'NL', 'NO', 'PT', 'SE', 'US'];
const MAX_BODY_BYTES = 1024;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 20;
const rateLimitBuckets = new Map();

const catalog = {};

function getBaseUrl(request) {
  if (process.env.SITE_URL) return sanitizeBaseUrl(process.env.SITE_URL);
  if (process.env.VERCEL_URL) return sanitizeBaseUrl(`https://${process.env.VERCEL_URL}`);

  const requestOrigin = getRequestOrigin(request);
  if (requestOrigin) return requestOrigin;

  return 'http://localhost:5173';
}

function getRequestOrigin(request) {
  const host = request.headers.host || '';
  const proto = request.headers['x-forwarded-proto'] || (host.includes('localhost') || host.startsWith('127.') ? 'http' : 'https');

  if (/^[A-Za-z0-9.-]+(?::\d+)?$/.test(host) && ['http', 'https'].includes(proto)) {
    return `${proto}://${host}`;
  }

  return '';
}

function getLocalDevOrigin(request) {
  const host = request.headers.host || '';
  if (/^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host)) {
    return `http://${host}`;
  }
  return '';
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

function sanitizeBaseUrl(value) {
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('Invalid SITE_URL protocol.');
  }
  return url.origin;
}

function getClientIp(request) {
  const forwardedFor = request.headers['x-forwarded-for'];
  if (typeof forwardedFor === 'string' && forwardedFor.trim()) {
    return forwardedFor.split(',')[0].trim();
  }
  return request.socket?.remoteAddress || 'unknown';
}

function isAllowedOrigin(request) {
  const origin = request.headers.origin;
  if (!origin) return true;

  try {
    const browserOrigin = new URL(origin).origin;
    const allowedOrigins = new Set([
      getRequestOrigin(request),
      getLocalDevOrigin(request)
    ].filter(Boolean));

    if (process.env.SITE_URL) {
      allowedOrigins.add(sanitizeBaseUrl(process.env.SITE_URL));
    }

    if (process.env.VERCEL_URL) {
      allowedOrigins.add(sanitizeBaseUrl(`https://${process.env.VERCEL_URL}`));
    }

    return allowedOrigins.has(browserOrigin);
  } catch {
    return false;
  }
}

function isRateLimited(request) {
  const now = Date.now();
  const ip = getClientIp(request);
  const bucket = rateLimitBuckets.get(ip);

  if (!bucket || bucket.resetAt <= now) {
    rateLimitBuckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  bucket.count += 1;
  return bucket.count > RATE_LIMIT_MAX_REQUESTS;
}

function setSecurityHeaders(response) {
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('X-Content-Type-Options', 'nosniff');
}

function sendJson(response, status, payload) {
  setSecurityHeaders(response);
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

  if (isRateLimited(request)) {
    sendJson(response, 429, { error: 'Too many checkout attempts. Please wait a moment.' });
    return;
  }

  const contentLength = Number(request.headers['content-length'] || 0);
  if (contentLength > MAX_BODY_BYTES) {
    sendJson(response, 413, { error: 'Request is too large.' });
    return;
  }

  const contentType = request.headers['content-type'] || '';
  if (contentType && !contentType.toLowerCase().includes('application/json')) {
    sendJson(response, 415, { error: 'Expected a JSON request.' });
    return;
  }

  if (!isAllowedOrigin(request)) {
    sendJson(response, 403, { error: 'Checkout must start from this website.' });
    return;
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    sendJson(response, 503, { error: 'Checkout is not available yet.' });
    return;
  }

  const { artwork, format } = getBody(request);
  const artworkSlug = typeof artwork === 'string' ? artwork : '';
  const checkoutFormat = typeof format === 'string' ? format : '';
  const item = catalog[artworkSlug];
  const isOriginal = checkoutFormat === 'original';
  const isPrint = checkoutFormat === 'print';

  if (!/^[A-Za-z0-9_-]{1,40}$/.test(artworkSlug) || !item || (!isPrint && !isOriginal)) {
    sendJson(response, 400, { error: 'Unknown artwork or format.' });
    return;
  }

  if (isOriginal && item.status !== 'available') {
    sendJson(response, 409, { error: 'The original has already been sold.' });
    return;
  }

  const unitAmount = item[checkoutFormat];
  if (!Number.isInteger(unitAmount) || unitAmount <= 0) {
    sendJson(response, 409, { error: 'Checkout is not configured for this item yet.' });
    return;
  }

  let baseUrl;
  try {
    baseUrl = getBaseUrl(request);
  } catch {
    sendJson(response, 503, { error: 'Checkout is not configured correctly.' });
    return;
  }

  const currency = DEFAULT_CURRENCY;
  const params = new URLSearchParams();
  const productName = `${item.title} - ${isOriginal ? 'Original' : 'Print'}`;

  params.append('mode', 'payment');
  params.append('success_url', `${baseUrl}/shop.html?artwork=${encodeURIComponent(artworkSlug)}&payment=success`);
  params.append('cancel_url', `${baseUrl}/shop.html?artwork=${encodeURIComponent(artworkSlug)}&payment=cancelled`);
  params.append('client_reference_id', `${artworkSlug}:${checkoutFormat}`);
  params.append('metadata[artwork]', artworkSlug);
  params.append('metadata[format]', checkoutFormat);
  params.append('shipping_address_collection[allowed_countries][]', SHIPPING_COUNTRIES[0]);
  SHIPPING_COUNTRIES.slice(1).forEach((country) => {
    params.append('shipping_address_collection[allowed_countries][]', country);
  });
  appendLineItem(params, '[quantity]', '1');
  appendLineItem(params, '[price_data][currency]', currency);
  appendLineItem(params, '[price_data][unit_amount]', String(unitAmount));
  appendLineItem(params, '[price_data][product_data][name]', productName);
  appendLineItem(params, '[price_data][product_data][metadata][artwork]', artworkSlug);
  appendLineItem(params, '[price_data][product_data][metadata][format]', checkoutFormat);

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
      console.error('Stripe checkout session failed', {
        status: stripeResponse.status,
        type: session.error?.type,
        code: session.error?.code
      });
      sendJson(response, 502, { error: 'Stripe checkout could not start.' });
      return;
    }

    sendJson(response, 200, { url: session.url });
  } catch {
    sendJson(response, 502, { error: 'Could not reach Stripe. Please try again.' });
  }
}
