import {svelte} from "@sveltejs/vite-plugin-svelte";
import {defineConfig} from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  base: "", // relative paths
  build: {
    sourcemap: true
  },
  resolve: {
    alias: [
      {find: "~assets", replacement: "/src/assets"},
      {find: "~components", replacement: "/src/components"},
      {find: "~lib", replacement: "/src/lib"},
      {find: "~pages", replacement: "/src/pages"},
      {find: "~", replacement: "/src"}
    ]
  },
  plugins: [svelte()]
});
