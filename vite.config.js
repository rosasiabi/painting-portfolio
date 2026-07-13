import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

export default {
    root: './',
    publicDir: './public/',
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
