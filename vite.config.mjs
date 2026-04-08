import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const manifest = JSON.parse(
  readFileSync(resolve(__dirname, "src/manifest.json"), "utf-8")
);

export default defineConfig({
  base: "./",
  plugins: [react(), crx({ manifest })],
  publicDir: "public",
  build: {
    emptyOutDir: true,
  },
});
