// Disposable loopback-only test harness. No production credentials or settings.
import { createServer, request } from 'node:http';
import { spawn } from 'node:child_process';
import { createWriteStream, mkdirSync } from 'node:fs';
const cwd = process.argv[2];
const evidence = process.argv[3];
if (!cwd || !evidence) throw new Error('Pass checkout and evidence directory');
mkdirSync(evidence, { recursive: true });
const access = 'isolated-role-access-'.repeat(2);
const env = { ...process.env, PORT: '45147', PREVIEW_BIND_HOST: '127.0.0.1', PREVIEW_ACCESS_PASSWORD: access, PREVIEW_ACCOUNT_PASSWORD: 'isolated-role-account-'.repeat(2), SESSION_SECRET: 'isolated-role-session-'.repeat(2) };
const log = createWriteStream(evidence + '/runtime.log');
const records = createWriteStream(evidence + '/proxy.jsonl');
const child = spawn(process.execPath, ['scripts/preview-start.mjs'], { cwd, env, stdio: ['ignore', 'pipe', 'pipe'] });
child.stdout.on('data', chunk => { log.write(chunk); if (chunk.toString().includes('Protected disposable preview ready')) console.log('UPSTREAM_READY'); });
child.stderr.on('data', chunk => log.write(chunk));
child.on('exit', code => { console.log('UPSTREAM_EXIT', code); server.close(); log.end(); records.end(); });
const server = createServer((req, res) => {
  const upstream = request({ hostname: '127.0.0.1', port: 45147, method: req.method, path: req.url, headers: { ...req.headers, authorization: 'Basic ' + Buffer.from('preview:' + access).toString('base64'), 'x-forwarded-proto': 'https', 'x-forwarded-host': req.headers.host } }, incoming => {
    records.write(JSON.stringify({ method: req.method, path: req.url, status: incoming.statusCode, serverActionRedirect: Boolean(incoming.headers['x-action-redirect']) }) + '\n');
    res.writeHead(incoming.statusCode, incoming.headers);
    incoming.pipe(res);
  });
  upstream.on('error', () => { res.writeHead(502); res.end('Local fixture is starting'); });
  req.pipe(upstream);
});
server.listen(45148, '127.0.0.1', () => console.log('PROXY_READY http://127.0.0.1:45148'));
let stopping = false;
function stop() { if (stopping) return; stopping = true; server.close(); child.kill('SIGINT'); }
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
