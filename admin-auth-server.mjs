import { createServer } from 'node:http';

const PORT = Number(process.env.PORT || 8787);
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_PASSWORD) {
  console.error('ADMIN_PASSWORD env değişkeni zorunludur.');
  process.exit(1);
}

const sendJson = (res, status, payload) => {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(payload));
};

createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  if (req.url !== '/api/admin-login' || req.method !== 'POST') {
    sendJson(res, 404, { success: false, message: 'Not found' });
    return;
  }

  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
    if (body.length > 1e6) req.destroy();
  });

  req.on('end', () => {
    try {
      const parsed = JSON.parse(body || '{}');
      const success = parsed.password === ADMIN_PASSWORD;
      sendJson(res, success ? 200 : 401, { success });
    } catch {
      sendJson(res, 400, { success: false, message: 'Invalid JSON' });
    }
  });
}).listen(PORT, () => {
  console.log(`Admin auth API running on http://localhost:${PORT}`);
});
