import { defineConfig } from "vite";


export default defineConfig({
    root: './',
    base: "/intergalactic-3d-resume/",
    build: {
        outDir: './dist/',
        sourcemap: true,
        emptyOutDir: true,
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                entryFileNames: "[name].js",
                chunkFileNames: "[name].js",
                assetFileNames: "[name].[ext]"
            }
        }
    },
});