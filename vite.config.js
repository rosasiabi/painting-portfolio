export default {
    root: './',
    publicDir: './public/',
    build: {
        outDir: './dist',
        emptyOutDir: true,
        sourcemap: true,
        chunkSizeWarningLimit: 1000 // Add this line here
    }
}