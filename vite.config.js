import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  base: "/dark-minimal/",
  envPrefix: ["VITE_", "PUBLIC_"],
  plugins: [react()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(projectRoot, "index.html"),
        about: resolve(projectRoot, "about.html"),
        projects: resolve(projectRoot, "projects.html"),
        services: resolve(projectRoot, "services.html"),
        contact: resolve(projectRoot, "contact.html"),
        resume: resolve(projectRoot, "resume.html"),
      },
    },
  },
  server: {
    host: true,
    port: 4321,
  },
});
