
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig({
  plugins: [react(), basicSsl()],
  build: {
    outDir: "dist",
    sourcemap: true,
  },
  server: {
    https: true,          // <-- enable HTTPS
    host: "localhost",
    port: 3000,
    strictPort: true,
    open: true,
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.js",
    css: true,
    coverage: { reporter: ["text", "json", "html"] },
  },
});
