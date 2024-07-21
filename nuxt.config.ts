import "dotenv/config";

export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: [
    "@nuxt/ui",
    "@nuxt/image",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@samk-dev/nuxt-vcalendar",
  ],
  pinia: {
    storesDirs: ["./stores/**", "./custom-folder/stores/**"],
  },
  typescript: {
    shim: false,
  },
  colorMode: {
    dataValue: "light",
    preference: "light",
  },
  runtimeConfig: {
    public: {
      API_URL: process.env.BASE_API_URL,
    },
  },
});
