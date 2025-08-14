// vitest.config.ts
import { defineConfig } from "vitest/config";
import  vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()], // ← 追加
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./"),
      "@": path.resolve(__dirname, "./"),
    },
  },
});
