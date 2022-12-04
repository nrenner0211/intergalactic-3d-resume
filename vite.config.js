import { defineConfig } from "vite";

export default defineConfig({
    base: "/glowing-space/",
    build: {
        chunkSizeWarningLimit: 1000,
    },
});