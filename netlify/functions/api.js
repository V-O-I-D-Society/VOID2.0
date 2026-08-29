// Serverless proxy: forwards /api/* requests from the Netlify frontend to the
// backend hosted on Railway. Netlify's static `status = 200` proxy redirects
// do not support POST (they return 405), so API traffic is proxied through a
// Netlify Function instead, which forwards the original method and body.

const BACKEND = process.env.BACKEND_URL;

export const handler = async (event) => {
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
