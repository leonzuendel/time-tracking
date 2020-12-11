<template>
  <div id="container">
    <topBar :settings-open.sync="settingsOpen" />
    <Settings v-if="settingsOpen" />
    <nuxt />
  </div>
</template>

<script>
import Settings from "@/components/Settings";
import topBar from "@/layouts/partials/topBar.vue";
export default {
  components: {
    topBar,
    Settings
  },
  data() {
    return {
      settingsOpen: false,
      nav: [
        {
          title: "Home",
          icon: "home",
          to: { name: "index" }
        }
      ]
    };
  },
  async mounted() {
    const settings = await this.$localForage.getItem("Settings");
    if (settings) {
      this.$store.dispatch("changeSettings", settings);
    }
  }
};
</script>
