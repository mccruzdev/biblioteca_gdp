// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  // devtools: { enabled: true }
  css: ["~/assets/css/tailwind.css", "~/assets/css/globals.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  ssr: false,
  modules: ["@pinia/nuxt", "@nuxt/ui", "@vueuse/nuxt"],
});
