import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { readFileSync, existsSync } from 'node:fs';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

// PERF: tell the browser about every painting image in the page's <head>, so the
// images download at the same time as the 3D code instead of waiting for it to
// load and run. Reads the painting list straight from script.js, so new works
// added there are picked up automatically. crossorigin matches how three.js
// requests images, so each image is only downloaded once.
function preloadPaintings() {
    return {
        name: 'preload-paintings',
        transformIndexHtml: {
            order: 'post',
            handler(html, ctx) {
                if (!ctx.filename.endsWith('index.html')) return html;
                let paintings;
                try {
                    const src = readFileSync(resolve(rootDir, 'script.js'), 'utf8');
                    const m = src.match(/const paintingsData = (\[[\s\S]*?\n\]);/);
                    paintings = JSON.parse(m[1]);
                } catch (e) {
                    console.warn('[preload-paintings] could not read the painting list; skipping preloads');
                    return html;
                }
                const pub = resolve(rootDir, 'public');
                const links = paintings.map(p => {
                    const thumb = `/images/thumb/${p.medium}/${p.fileName}`;
                    const href = existsSync(pub + thumb) ? thumb : `/images/${p.medium}/${p.fileName}`;
                    // The big canvases sit in the middle of the first view: fetch them first.
                    const prio = p.medium === 'canvas' ? ' fetchpriority="high"' : '';
                    return `<link rel="preload" as="image" href="${href}" crossorigin="anonymous"${prio}>`;
                });
                return html.replace('</head>', `${links.join('\n')}\n</head>`);
            }
        }
    };
}

export default {
    root: './',
    publicDir: './public/',
    plugins: [preloadPaintings()],
    build: {
        outDir: './dist',
        emptyOutDir: true,
        sourcemap: true,
        chunkSizeWarningLimit: 1000, // Add this line here
        rollupOptions: {
            input: {
                main: resolve(rootDir, 'index.html'),
                contact: resolve(rootDir, 'contact.html')
            }
        }
    }
};
