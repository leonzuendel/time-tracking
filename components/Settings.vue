<template>
  <section id="settings">
    <h2>Integrations</h2>
    <p>Connect this workspace to other applications and services.</p>
    <h3>ToDoist Api Token</h3>
    <input
      v-model="settings.ToDoistApiKey"
      type="text"
      placeholder="e.g. d5e889n4knm865nbn324jb2jb3b44bjbaeedc6"
      class="form-input"
    />
  </section>
</template>

<script>
import { mapState } from "vuex";
export default {
  components: {},
  computed: {
    ...mapState(["settings"])
  },
  props: {},
  data() {
    return {};
  },
  watch: {
    settings: {
      handler(val) {
        this.changeSettings();
      },
      deep: true
    }
  },
  mounted() {},
  methods: {
    changeSettings() {
      this.$store.dispatch("changeSettings", this.settings);
    }
  }
};
</script>

<style></style>
