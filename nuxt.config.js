export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: "TimeTracking",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },

  loading: false,

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    "@/assets/css/main.css",
    "quill/dist/quill.core.css",
    "quill/dist/quill.snow.css",
    "@/assets/fonts/lineawesome/css/line-awesome.min.css",
    "@/assets/fonts/fontawesome/font/fontawesome-all.css"
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    { src: "@/plugins/VueQuillEditor.js", ssr: false },
    { src: "@/plugins/vueDraggable.js", ssr: false },
    { src: "@/plugins/VueDatepicker.js", ssr: false }
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    "@nuxtjs/eslint-module",
    "@nuxtjs/localforage"
  ],

  localforage: {
    /* module options */
    name: "TimeTracking App",
    storeName: "TimeTracking App Storage",
    description: "All data is stored here locally."
  },

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/buefy
    "nuxt-buefy",
    // https://go.nuxtjs.dev/axios
    "@nuxtjs/axios",
    // https://go.nuxtjs.dev/pwa
    "@nuxtjs/pwa",

    "@nuxtjs/auth" // enables Nuxt Auth module
  ],

  auth: {
    strategies: {
      local: {
        endpoints: {
          // these are the API endpoints we created in Express
          login: {
            url: "/api/users/login",
            method: "post",
            propertyName: "token"
          },
          logout: true,
          user: {
            url: "/api/users/user",
            method: "get",
            propertyName: "user"
          }
        },
        tokenRequired: true,
        tokenType: "Bearer"
      }
    },
    redirect: {
      login: "/user/login", // User will be redirected to this path if login is required
      logout: "/user/login", // User will be redirected to this path if after logout, current route is protected
      home: "/" // User will be redirect to this path after login if accessed login page directly
    },
    rewriteRedirects: true
  },

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    baseURL: ""
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {},

  // API
  serverMiddleware: ["~/api/index.js"]
};
