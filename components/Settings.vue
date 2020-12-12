<template>
  <section id="settings">
    <h2>Workspace Integrations</h2>
    <p>Connect this workspace to other applications and services.</p>
    <br />
    <h3>ToDoist</h3>
    <span class="checkbox-label">Enable Integration</span>
    <div class="checkbox">
      <input
        id="toDoistEnabledCheck"
        v-model="settings.toDoistEnabled"
        type="checkbox"
      /><label for="toDoistEnabledCheck"></label>
    </div>
    <br /><br />
    <h4>ToDoist API Token</h4>
    <input
      v-model="settings.toDoistApiKey"
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
