
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";

export default defineConfig({
  plugins: [react()],               // ← remove basicSsl()
  build: { outDir: "dist", sourcemap: true },
  server: {
    https: {
      key: fs.readFileSync("./localhost-key.pem"),  // mkcert outputs
      cert: fs.readFileSync("./localhost.pem"),
    },
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
