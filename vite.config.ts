import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { crx } from "@crxjs/vite-plugin";
// about CRXJS packaging and dev, see reference: https://crxjs.dev/guide/installation/create-crxjs
// and https://crxjs.dev/guide/packaging
import manifest from "./manifest.config.ts";
import zip from "vite-plugin-zip-pack";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    crx({ manifest }),
    zip({ outDir: "release", outFileName: "release.zip" }),
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
});
