// nuxt.config.ts
export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss"], // ←追加
  css: ["~/assets/css/tailwind.css"],
  devtools: { enabled: true }, // 任意
});
