<template>
  <section id="settings">
    <h2>Profile Info</h2>

    <h4>{{ this.$auth.user.first_name }} {{ this.$auth.user.last_name }}</h4>

    <p v-if="this.$auth.user.login_method === 'google'">
      You are signed in using <i class="fab fa-google"></i> Google.
    </p>

    <strong>Email:</strong> {{ this.$auth.user.email }} <br /><br />

    <el-button class="button block">
      <nuxt-link to="/user/logout">Sign out</nuxt-link>
    </el-button>
    <br />

    <h2>Workspace Integrations</h2>
    <p>Connect this workspace to other applications and services.</p>
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
    <br />
    <br />
    <span class="light"
      >TimeTracking made with <i class="las la-heart"></i> by Leon Zündel<br />
      v.0.1.6 | Pre-alpha stadium</span
    >
  </section>
</template>

<script>
import { mapState } from "vuex";
export default {
  middleware: "auth",
  components: {},
  computed: {
    ...mapState(["settings"])
  },
  props: {},
  data() {
    return {};
  },
  watch: {
    "$store.state.settings": {
      handler(val) {
        this.$store.dispatch("updateSettings", this.$store.state.settings);
      },
      deep: true
    }
  },

  mounted() {},
  methods: {}
};
</script>

<style></style>
