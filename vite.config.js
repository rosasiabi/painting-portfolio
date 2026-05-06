import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

function loadLocalEnv() {
    for (const fileName of ['.env.local', '.env']) {
        const filePath = resolve(process.cwd(), fileName);
        if (!existsSync(filePath)) continue;

        const lines = readFileSync(filePath, 'utf8').split(/\r?\n/);
        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;
            const eq = trimmed.indexOf('=');
            const key = trimmed.slice(0, eq).trim();
            const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
            if (key && process.env[key] === undefined) process.env[key] = value;
        }
    }
}

function stripeApiDevMiddleware() {
    return {
        name: 'stripe-api-dev-middleware',
        configureServer(server) {
            server.middlewares.use('/api/create-checkout-session', async (request, response) => {
                const { default: checkoutHandler } = await import('./api/create-checkout-session.js');
                let body = '';
                request.on('data', (chunk) => {
                    body += chunk;
                });
                request.on('end', async () => {
                    request.body = body;
                    await checkoutHandler(request, response);
                });
                request.on('error', () => {
                    response.statusCode = 400;
                    response.setHeader('Content-Type', 'application/json');
                    response.end(JSON.stringify({ error: 'Invalid checkout request.' }));
                });
            });
        }
    };
}

loadLocalEnv();

export default {
    root: './',
    publicDir: './public/',
    plugins: [stripeApiDevMiddleware()],
    build: {
        outDir: './dist',
        emptyOutDir: true,
        sourcemap: true,
        chunkSizeWarningLimit: 1000, // Add this line here
        rollupOptions: {
            input: {
                main: resolve(rootDir, 'index.html'),
                shop: resolve(rootDir, 'shop.html')
            }
        }
    }
};
