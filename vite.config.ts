import {svelte} from "@sveltejs/vite-plugin-svelte";
import {defineConfig} from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  base: "", // relative paths
  build: {
    sourcemap: true
  },
  plugins: [svelte()]
});