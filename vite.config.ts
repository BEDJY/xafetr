import path from "path";
import { defineConfig } from "vite";

import { aiServerPlugin } from "./src/server/aiServerPlugin.ts";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), aiServerPlugin()],
  server: {
    port: 5180,
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
