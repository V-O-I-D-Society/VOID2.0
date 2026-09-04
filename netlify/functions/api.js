// Serverless proxy: forwards /api/* requests from the Netlify frontend to the
// backend hosted on Railway. Netlify's static `status = 200` proxy redirects
// do not support POST (they return 405), so API traffic is proxied through a
// Netlify Function instead, which forwards the original method and body.

// Normalize BACKEND_URL so it tolerates a bare hostname (no scheme) and a
// trailing slash, e.g. "void20-production.up.railway.app/" -> "https://void20-production.up.railway.app".
const rawBackend = process.env.BACKEND_URL || '';
const BACKEND = rawBackend
  ? rawBackend.replace(/\/+$/, '').replace(/^(?!https?:\/\/)/i, 'https://')
  : '';

export const handler = async (event) => {
  if (!BACKEND) {
    return {
      statusCode: 500,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ error: 'BACKEND_URL is not configured on the server' }),
    };
  }

  // Reconstruct the backend path from the original request path.
  let path = event.path || '/';
  path = path.replace(/^\/api/, '').replace(/^\/\.netlify\/functions\/api/, '');
  const query = event.rawQuery ? `?${event.rawQuery}` : '';
  const url = `${BACKEND}/api${path}${query}`;

  const method = event.httpMethod;
  const headers = {
    'content-type': event.headers['content-type'] || 'application/json',
  };

  let body;
  if (event.body && method !== 'GET' && method !== 'HEAD') {
    body = event.isBase64Encoded ? Buffer.from(event.body, 'base64') : event.body;
    headers['content-length'] = Buffer.byteLength(body);
  }

  const res = await fetch(url, { method, headers, body });
  const text = await res.text();

  return {
    statusCode: res.status,
    headers: { 'content-type': res.headers.get('content-type') || 'application/json' },
    body: text,
  };
};
