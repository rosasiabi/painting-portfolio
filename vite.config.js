import { resolve } from 'node:path';

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
                main: resolve(__dirname, 'index.html'),
                shop: resolve(__dirname, 'shop.html')
            }
        }
    }
} 
